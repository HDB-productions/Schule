'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { SAMPLE_RATE, buildMap, parseArgs, assertSafeOutputs, assemble } = require('./audio-montage.cjs');
const root = path.resolve(__dirname, '../../..');
const ffmpeg = process.env.FFMPEG_PATH || path.join(root, 'outputs/gmz-ranger-source/python-deps/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe');
const fixture = [
  { id: 'aufbau', sourceStart: 1, sourceEnd: 3, duration: 0.5 },
  { id: 'ionisation', sourceStart: 4, sourceEnd: 5, duration: 1.25 },
  { id: 'zaehlimpuls', sourceStart: 7, sourceEnd: 8, duration: 0.75 },
  { id: 'totzeit', sourceStart: 9, sourceEnd: 11, duration: 2 }
];
function temp() {
  const base = path.join(root, 'outputs/gmz-ranger-audio-tests');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'case-'));
}
function clean(dir) { fs.rmSync(dir, { recursive: true, force: true }); }

test('unequal replacement lengths preserve every original gap and form one continuous map', () => {
  const map = buildMap(12, fixture);
  assert.equal(map.duration, 10.5);
  assert.equal(map.sampleRate, SAMPLE_RATE);
  assert.equal(map.segments.length, 9);
  assert.equal(map.segments[0].start, 0);
  assert.equal(map.segments.at(-1).end, map.duration);
  for (let i = 1; i < map.segments.length; i++) {
    assert.equal(map.segments[i].start, map.segments[i - 1].end);
    assert.equal(map.segments[i].sourceStart, map.segments[i - 1].sourceEnd);
  }
  const originals = map.segments.filter(s => s.kind === 'original');
  assert.deepEqual(originals.map(s => [s.sourceStart, s.sourceEnd]), [[0, 1], [3, 4], [5, 7], [8, 9], [11, 12]]);
  const replaced = map.segments.filter(s => s.kind === 'replacement');
  assert.deepEqual(replaced.map(s => s.id), fixture.map(s => s.id));
  replaced.forEach((s, i) => assert.equal(Math.round((s.end - s.start) * SAMPLE_RATE), fixture[i].duration * SAMPLE_RATE));
});

test('full coverage, untouched source and noninteger sample boundaries', () => {
  assert.deepEqual(buildMap(2, []).segments, [{ kind: 'original', start: 0, end: 2, sourceStart: 0, sourceEnd: 2 }]);
  const full = buildMap(2, [{ id: 'all', sourceStart: 0, sourceEnd: 2, duration: 3 }]);
  assert.equal(full.segments.length, 1);
  assert.equal(full.duration, 3);
  const quantized = buildMap(2, [{ id: 'part', sourceStart: 0.123456, sourceEnd: 0.765432, duration: 0.333333 }]);
  quantized.segments.forEach(s => {
    assert.ok(Math.abs(s.start * SAMPLE_RATE - Math.round(s.start * SAMPLE_RATE)) < 1e-8);
    assert.ok(Math.abs(s.end * SAMPLE_RATE - Math.round(s.end * SAMPLE_RATE)) < 1e-8);
  });
});

test('invalid, unsorted, overlapping, out-of-bounds and missing-duration cuts are rejected', () => {
  const valid = { id: 'one', sourceStart: 1, sourceEnd: 3, duration: 1 };
  for (const changed of [
    { sourceStart: -1 }, { sourceEnd: 13 }, { sourceEnd: 1 },
    { sourceStart: NaN }, { duration: undefined }, { duration: 0 }, { duration: 1e-10 }, { id: '' }
  ]) assert.throws(() => buildMap(12, [{ ...valid, ...changed }]));
  assert.throws(() => buildMap(12, [valid, { ...valid, id: 'two', sourceStart: 2, sourceEnd: 5 }]));
  assert.throws(() => buildMap(12, [valid, { ...valid, sourceStart: 4, sourceEnd: 5 }]));
  assert.throws(() => buildMap(12, [...fixture].reverse()));
  assert.throws(() => buildMap(0, fixture));
  assert.throws(() => buildMap(12, fixture, { sampleRate: 0 }));
});

test('CLI requires explicit paths and rejects malformed or duplicate options', () => {
  assert.deepEqual(parseArgs(['--source', 'a file.m4a', '--overwrite']), { source: 'a file.m4a', overwrite: true });
  for (const args of [['source'], ['--source'], ['--unknown'], ['--source', 'a', '--source', 'b'], ['--overwrite', 'false']]) assert.throws(() => parseArgs(args));
});

test('output safety protects originals, plan and output collisions even with overwrite', async t => {
  const dir = temp();
  try {
    const source = path.join(dir, 'original.wav'), output = path.join(dir, 'draft.m4a'), map = path.join(dir, 'map.json');
    fs.writeFileSync(source, 'unaltered original');
    assert.throws(() => assertSafeOutputs([source], [source, map], true), /Eingabedatei/);
    assert.throws(() => assertSafeOutputs([source], [output, output], true), /verschieden/);
    fs.writeFileSync(output, 'old draft');
    assert.throws(() => assertSafeOutputs([source], [output, map]), /existiert/);
    assert.doesNotThrow(() => assertSafeOutputs([source], [output, map], true));
    await t.test('hardlink aliases are protected when filesystem permits creating one', child => {
      const linked = path.join(dir, 'linked.m4a');
      try { fs.linkSync(source, linked); }
      catch (error) {
        if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) { child.skip('Filesystem/sandbox does not permit hardlink creation.'); return; }
        throw error;
      }
      assert.throws(() => assertSafeOutputs([source], [linked], true), /Eingabedatei/);
    });
    assert.equal(fs.readFileSync(source, 'utf8'), 'unaltered original');
  } finally { clean(dir); }
});

test('missing recordings fail before any media generation', async () => {
  const dir = temp();
  try {
    const output = path.join(dir, 'missing.m4a');
    await assert.rejects(assemble({ source: 'not-opened.m4a', output }), /Ersatzaufnahme 1 fehlt/);
    assert.equal(fs.existsSync(output), false);
    assert.equal(fs.existsSync(output + '.map.json'), false);
  } finally { clean(dir); }
});

test('FFmpeg assembles only synthetic test tones, preserves inputs and emits exact PCM map', { skip: !fs.existsSync(ffmpeg) }, async () => {
  const dir = temp();
  try {
    const tone = (file, duration, frequency) => {
      const result = spawnSync(ffmpeg, ['-hide_banner', '-nostdin', '-loglevel', 'error', '-n', '-f', 'lavfi', '-i', `sine=frequency=${frequency}:sample_rate=${SAMPLE_RATE}:duration=${duration}`, '-c:a', 'pcm_s16le', file], { encoding: 'utf8', windowsHide: true, shell: false });
      assert.equal(result.status, 0, result.stderr);
    };
    const source = path.join(dir, 'synthetic-source.wav');
    tone(source, 12, 300);
    const replacements = fixture.map((item, i) => {
      const file = path.join(dir, `synthetic-tone-${i + 1}.wav`);
      tone(file, item.duration, 400 + i * 100);
      return { ...item, file: path.basename(file) };
    });
    const plan = path.join(dir, 'plan.json');
    fs.writeFileSync(plan, JSON.stringify({ sampleRate: SAMPLE_RATE, replacements }));
    const inputs = [source, plan, ...replacements.map(item => path.join(dir, item.file))];
    const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const hashes = inputs.map(hash);
    const output = path.join(dir, 'synthetic-draft.m4a');
    const args = { source, output, plan, ffmpeg };
    const result = await assemble(args);
    assert.equal(result.duration, 10.5);
    const report = JSON.parse(fs.readFileSync(result.mapFile, 'utf8'));
    assert.equal(report.draft, true);
    assert.equal(report.finalSync, false);
    assert.equal(report.totalSamples, 504000);
    assert.deepEqual(report.segments, buildMap(12, fixture).segments);
    assert.ok(Math.abs(report.encodedAudio.codecPaddingSamples) <= 1024, JSON.stringify(report.encodedAudio));
    assert.ok(fs.statSync(output).size > 1000);
    // Check that the actual encoded signal follows all nine map segments, not only
    // their combined duration. The test tones have unique frequencies, never voices.
    const decoded = spawnSync(ffmpeg, ['-hide_banner', '-nostdin', '-loglevel', 'error', '-i', output, '-map', '0:a:0', '-ac', '1', '-ar', String(SAMPLE_RATE), '-f', 'f32le', 'pipe:1'], { maxBuffer: 4 * 1024 * 1024, windowsHide: true, shell: false });
    assert.equal(decoded.status, 0, decoded.stderr.toString());
    const frequencies = [300, 400, 500, 600, 700];
    report.segments.forEach(segment => {
      const expected = segment.kind === 'original' ? 300 : 400 + fixture.findIndex(item => item.id === segment.id) * 100;
      const center = Math.round((segment.start + segment.end) / 2 * SAMPLE_RATE);
      const power = frequency => {
        let real = 0, imaginary = 0;
        for (let j = -2048; j < 2048; j++) {
          const value = decoded.stdout.readFloatLE((center + j) * 4), angle = 2 * Math.PI * frequency * j / SAMPLE_RATE;
          real += value * Math.cos(angle); imaginary += value * Math.sin(angle);
        }
        return real * real + imaginary * imaginary;
      };
      const observed = frequencies.map(frequency => ({ frequency, power: power(frequency) })).sort((a, b) => b.power - a.power)[0].frequency;
      assert.equal(observed, expected, JSON.stringify(segment));
    });
    assert.deepEqual(inputs.map(hash), hashes);
    await assert.rejects(assemble(args), /existiert/);
    await assemble({ ...args, overwrite: true });
    const adts = await assemble({ ...args, output: path.join(dir, 'synthetic-draft.aac') });
    assert.equal(adts.duration, 10.5);
    const adtsReport = JSON.parse(fs.readFileSync(adts.mapFile, 'utf8'));
    assert.ok(Math.abs(adtsReport.encodedAudio.codecPaddingSamples) <= 2048, JSON.stringify(adtsReport.encodedAudio));
    await assert.rejects(assemble({ ...args, output: source, overwrite: true }), /Ausgabe muss/);
    await assert.rejects(assemble({ ...args, map: source, overwrite: true }), /Eingabedatei/);
    assert.deepEqual(inputs.map(hash), hashes);
    assert.equal(fs.readdirSync(dir).some(name => name.startsWith('.audio-')), false);
    console.log('Synthetic FFmpeg QA: 12 s source, 4 unequal tones, 10.5 s / 504000 PCM samples; original hashes unchanged.');
  } finally { clean(dir); }
});
