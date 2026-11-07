/* Local draft audio cuts only. No synthesis, upload, speed change or source overwrite. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const SAMPLE_RATE = 48000;

function buildMap(originalDuration, replacements, { sampleRate = SAMPLE_RATE } = {}) {
  if (!Number.isInteger(sampleRate) || sampleRate <= 0) throw Error('Ungültige Samplerate.');
  const samples = value => Math.round(value * sampleRate);
  if (!Number.isFinite(originalDuration) || originalDuration <= 0) throw Error('Ungültige Originaldauer.');
  const total = samples(originalDuration);
  if (!total || !Array.isArray(replacements)) throw Error('Ungültiger Schnittplan.');
  let cursor = 0, clock = 0;
  const ids = new Set(), segments = [];
  const append = (kind, start, end, length, id) => {
    if (!length) return;
    const segment = { kind, ...(id ? { id } : {}), start: clock / sampleRate, end: (clock + length) / sampleRate, sourceStart: start / sampleRate, sourceEnd: end / sampleRate };
    segments.push(segment); clock += length;
  };
  for (const item of replacements) {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) throw Error('Fehlende oder doppelte Ersatz-ID.');
    ids.add(item.id);
    if (![item.sourceStart, item.sourceEnd, item.duration].every(Number.isFinite) || item.sourceStart < 0 || item.sourceEnd > originalDuration || item.duration <= 0) throw Error('Ungültiger Ersatzbereich oder fehlende Aufnahmedauer: ' + item.id);
    const start = samples(item.sourceStart), end = samples(item.sourceEnd), length = samples(item.duration);
    if (start < cursor || end <= start || end > total || length <= 0) throw Error('Überlappender, unsortierter oder leerer Ersatzbereich: ' + item.id);
    append('original', cursor, start, start - cursor);
    append('replacement', start, end, length, item.id);
    cursor = end;
  }
  append('original', cursor, total, total - cursor);
  return { sampleRate, duration: clock / sampleRate, segments };
}

function parseArgs(argv) {
  const args = {}, flags = new Set(['help', 'overwrite']);
  const options = new Set(['source', 'replacement1', 'replacement2', 'replacement3', 'replacement4', 'electronics', 'output', 'map', 'plan', 'ffmpeg']);
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i].startsWith('--') ? argv[i].slice(2) : '';
    if ((!flags.has(name) && !options.has(name)) || Object.hasOwn(args, name)) throw Error('Unbekanntes oder doppeltes Argument: ' + argv[i]);
    if (flags.has(name)) args[name] = true;
    else {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw Error('Wert fehlt für --' + name);
      args[name] = argv[++i];
    }
  }
  return args;
}

// Resolve existing parent directories too, so a directory symlink cannot bypass input safety.
function canonical(file) {
  const absolute = path.resolve(file);
  if (fs.existsSync(absolute)) return fs.realpathSync(absolute);
  const parent = path.dirname(absolute);
  return parent === absolute ? absolute : path.join(canonical(parent), path.basename(absolute));
}
function key(file) { const value = canonical(file); return process.platform === 'win32' ? value.toLowerCase() : value; }
function sameFile(a, b) {
  if (key(a) === key(b)) return true;
  if (!fs.existsSync(a) || !fs.existsSync(b)) return false;
  const aa = fs.statSync(a), bb = fs.statSync(b);
  return aa.ino !== 0 && aa.dev === bb.dev && aa.ino === bb.ino;
}
function assertSafeOutputs(inputs, outputs, overwrite = false) {
  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    if (inputs.some(input => sameFile(input, output))) throw Error('Ausgabepfad würde eine Eingabedatei überschreiben: ' + output);
    if (outputs.slice(0, i).some(other => sameFile(other, output))) throw Error('Ausgabepfade müssen verschieden sein.');
    if (fs.existsSync(output) && (!overwrite || !fs.statSync(output).isFile())) throw Error('Ausgabe existiert bereits; für eigene Ausgaben --overwrite verwenden: ' + output);
  }
}

function runFFmpeg(ffmpeg, args, { countSamples = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, args, { stdio: ['ignore', countSamples ? 'pipe' : 'ignore', 'pipe'], windowsHide: true, shell: false });
    let log = '', bytes = 0;
    child.stderr.on('data', chunk => { log = (log + chunk.toString()).slice(-24000); });
    if (countSamples) child.stdout.on('data', chunk => { bytes += chunk.length; });
    child.once('error', reject);
    child.once('close', code => code === 0 ? resolve({ log, bytes }) : reject(Error('FFmpeg (' + code + '): ' + log)));
  });
}

async function inspectAudio(ffmpeg, file) {
  // Metadata comes from FFmpeg stderr; exact duration comes from fully decoded mono
  // float PCM at 48 kHz, avoiding rounded container/ASR duration and VBR guesses.
  const { log, bytes } = await runFFmpeg(ffmpeg, ['-hide_banner', '-nostdin', '-i', file, '-map', '0:a:0', '-vn', '-ac', '1', '-ar', String(SAMPLE_RATE), '-c:a', 'pcm_f32le', '-f', 'f32le', 'pipe:1'], { countSamples: true });
  if (!bytes || bytes % 4 || !Number.isSafeInteger(bytes)) throw Error('Keine gültigen Audiosamples: ' + file);
  const match = log.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  return { samples: bytes / 4, duration: bytes / 4 / SAMPLE_RATE, containerDuration: match ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : null };
}

function buildFilter(map, replacements) {
  const sample = value => Math.round(value * map.sampleRate);
  const filters = map.segments.map((segment, index) => {
    const input = segment.kind === 'original' ? 0 : replacements.findIndex(item => item.id === segment.id) + 1;
    if (input < 0 || (input === 0 && segment.kind === 'replacement')) throw Error('Ersatzaufnahme fehlt im Filter.');
    const start = segment.kind === 'original' ? sample(segment.sourceStart) : 0;
    const end = start + sample(segment.end - segment.start);
    return `[${input}:a:0]aresample=${map.sampleRate},aformat=sample_fmts=fltp:channel_layouts=stereo,atrim=start_sample=${start}:end_sample=${end},asetpts=PTS-STARTPTS[s${index}]`;
  });
  filters.push(map.segments.map((_, i) => `[s${i}]`).join('') + `concat=n=${map.segments.length}:v=0:a=1[out]`);
  return filters.join(';');
}

function recordingOption(id) {
  return { aufbau: 'replacement1', ionisation: 'replacement2', zaehlimpuls: 'replacement3', totzeit: 'replacement4', zaehlelektronik: 'electronics' }[id];
}

async function assemble(args) {
  if (!args.source || !args.output) throw Error('--source und --output sind erforderlich.');
  const planFile = path.resolve(args.plan || path.join(__dirname, 'audio-edit-plan.json'));
  const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  if (!Array.isArray(plan.replacements) || !plan.replacements.length || plan.sampleRate !== SAMPLE_RATE) throw Error('Plan muss Ersatzbereiche und sampleRate 48000 enthalten.');
  const source = path.resolve(args.source), output = path.resolve(args.output), mapFile = path.resolve(args.map || output + '.map.json');
  if (!['.m4a', '.aac'].includes(path.extname(output).toLowerCase())) throw Error('Ausgabe muss eine neue .m4a- oder .aac-Datei sein.');
  const replacements = plan.replacements.map((item, index) => {
    // CLI slots retain their original meaning when a new chronological cut is inserted.
    const option = recordingOption(item.id);
    if (!option) throw Error('Unbekannte Ersatzaufnahme: ' + item.id);
    const value = args[option];
    const file = value ? path.resolve(value) : typeof item.file === 'string' && item.file.trim() ? path.resolve(path.dirname(planFile), item.file) : null;
    if (!file) throw Error('Ersatzaufnahme ' + (index + 1) + ' fehlt (' + item.id + '); --' + option + ' oder Plan-Dateipfad angeben.');
    return { ...item, file };
  });
  const inputs = [source, ...replacements.map(item => item.file), planFile];
  for (const file of inputs) if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw Error('Eingabedatei fehlt: ' + file);
  assertSafeOutputs(inputs, [output, mapFile], !!args.overwrite);
  const root = path.resolve(__dirname, '../../..');
  const ffmpeg = args.ffmpeg || process.env.FFMPEG_PATH || path.join(root, 'outputs/gmz-ranger-source/python-deps/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe');
  const original = await inspectAudio(ffmpeg, source);
  for (const item of replacements) Object.assign(item, await inspectAudio(ffmpeg, item.file));
  const map = buildMap(original.duration, replacements);
  const report = { version: 1, draft: true, finalSync: false, status: 'draft-audio-montage', warning: 'Arbeitsfassung; Schnittgrenzen und Wortereignisse noch hörprüfen. Keine bestätigte Bild-Ton-Synchronität.', ...map, originalDuration: original.duration, originalSamples: original.samples, totalSamples: Math.round(map.duration * SAMPLE_RATE), sourceMetadataDuration: original.containerDuration, replacements: replacements.map(({ id, samples, duration }) => ({ id, samples, duration })) };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.mkdirSync(path.dirname(mapFile), { recursive: true });
  // Stage files: FFmpeg never receives an input path as a writable destination.
  const temporary = path.join(path.dirname(output), '.audio-draft-' + crypto.randomUUID() + path.extname(output));
  const temporaryMap = path.join(path.dirname(mapFile), '.audio-map-' + crypto.randomUUID() + '.json');
  try {
    const ffargs = ['-hide_banner', '-nostdin', '-loglevel', 'warning', '-n', '-i', source];
    replacements.forEach(item => ffargs.push('-i', item.file));
    ffargs.push('-filter_complex', buildFilter(map, replacements), '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', '-ar', String(SAMPLE_RATE), '-metadata', 'title=Geiger-Müller-Zähler – Tonmontage', '-metadata', 'comment=Vorläufige Schnitte; Hörprüfung und Sprachsynchronisation ausstehend.');
    if (path.extname(output).toLowerCase() === '.m4a') ffargs.push('-movflags', '+faststart');
    ffargs.push(temporary);
    await runFFmpeg(ffmpeg, ffargs);
    const encoded = await inspectAudio(ffmpeg, temporary);
    // AAC stores whole frames; the map describes the exact pre-encode montage.
    report.encodedAudio = { decodedSamples: encoded.samples, decodedDuration: encoded.duration, containerDuration: encoded.containerDuration, codecPaddingSamples: encoded.samples - report.totalSamples };
    fs.writeFileSync(temporaryMap, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
    assertSafeOutputs(inputs, [output, mapFile], !!args.overwrite);
    if (args.overwrite) { fs.renameSync(temporary, output); fs.renameSync(temporaryMap, mapFile); }
    else { fs.copyFileSync(temporary, output, fs.constants.COPYFILE_EXCL); fs.copyFileSync(temporaryMap, mapFile, fs.constants.COPYFILE_EXCL); }
    return { output, mapFile, draft: true, finalSync: false, duration: report.duration, segments: report.segments };
  } finally {
    for (const file of [temporary, temporaryMap]) if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

const HELP = `node audio-montage.cjs --source ORIGINAL.m4a --replacement1 01-aufbau.wav --replacement2 02-ionisation.wav --replacement3 03-zaehlimpuls.wav --replacement4 04-totzeit.wav --output ranger-audio-draft.m4a
  [--electronics 05-zaehlelektronik.wav] [--plan audio-edit-plan.json] [--map ranger-audio-draft.map.json] [--ffmpeg PATH] [--overwrite]
Alle im Plan enthaltenen Aufnahmen sind erforderlich (CLI oder Plan). replacement1–4 behalten ihre Bedeutung; electronics ergänzt die Zählelektronik. Keine Sprachsynthese/Zeitdehnung.
Die Ausgabe bleibt eine Arbeitsfassung. Vorläufige Schnittgrenzen und konkrete Sprachereignisse hörprüfen.
Sidecar: segments enthalten neue start/end und ursprüngliche sourceStart/sourceEnd in Sekunden.
Bei replacement beschreibt der source-Bereich die entfernte Originalstelle; start/end die vollständige neue Aufnahme.
duration ist die exakte PCM-Montagedauer bei 48000 Hz; encodedAudio weist AAC-Framepadding gesondert aus.
Originale und Plan werden nie überschrieben. --overwrite gilt nur für ausdrücklich gewählte Ausgaben.`;

if (require.main === module) {
  Promise.resolve().then(() => {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) { console.log(HELP); return; }
    return assemble(args).then(report => console.log(JSON.stringify(report, null, 2)));
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { SAMPLE_RATE, buildMap, parseArgs, assertSafeOutputs, inspectAudio, buildFilter, assemble, recordingOption };
