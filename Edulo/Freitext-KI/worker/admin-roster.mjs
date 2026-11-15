// Shared, side-effect-free roster parsing for the worker and browser preview.
function createAdminRoster() {
  const uidPattern = /^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i;
  const controls = /[\x00-\x1f\x7f-\x9f]/;
  const classPattern = /^(?:[1-9]|1[0-3])\s*[A-Za-z](?:\s*[1-9])?$/;
  function normalizeClass(value) {
    const result = value.trim();
    return classPattern.test(result) ? result.replace(/\s+/g, '') : result;
  }
  function normalizeYear(value) {
    const match = value.trim().match(/^(20\d{2}|21\d{2})(?:\s*[-/]\s*|\s+)(\d{2}|20\d{2}|21\d{2})$/);
    if (!match) return null;
    const start = Number(match[1]);
    const end = match[2].length === 2 ? Math.floor(start / 100) * 100 + Number(match[2]) : Number(match[2]);
    return end === start + 1 && end <= 2199 ? `${start}/${end}` : null;
  }
  function parseCsv(text) {
    const errors = [];
    const fail = message => ({ rows: [], errors: [message] });
    if (typeof text !== 'string') return fail('Zeile 1: CSV-Text erwartet.');
    const byteLength = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : unescape(encodeURIComponent(text)).length;
    if (byteLength > 40000) return fail('Zeile 1: Die CSV-Datei darf höchstens 40000 Bytes enthalten.');
    text = text.replace(/^\uFEFF/, '');
    // Detect the separator from the header, ignoring quoted separator characters.
    const counts = { ';': 0, ',': 0, '\t': 0 };
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (quoted && text[i + 1] === '"') i++;
        else quoted = !quoted;
      } else if (!quoted) {
        if (c === '\r' || c === '\n') break;
        if (c in counts) counts[c]++;
      }
    }
    const separator = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    const records = [];
    let cells = [], cell = '', inQuote = false, closed = false, line = 1, startLine = 1;
    function finishRecord() {
      cells.push(cell);
      if (cells.length > 1 || closed || cells.some(value => value.trim() !== '')) records.push({ cells, line: startLine });
      cells = []; cell = ''; closed = false;
    }
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuote) {
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; }
          else { inQuote = false; closed = true; }
        } else {
          cell += c;
          if (c === '\n' || (c === '\r' && text[i + 1] !== '\n')) line++;
        }
      } else if (c === separator) {
        cells.push(cell); cell = ''; closed = false;
      } else if (c === '\n' || c === '\r') {
        finishRecord();
        if (c === '\r' && text[i + 1] === '\n') i++;
        line++; startLine = line;
      } else if (c === '"' && cell === '' && !closed) {
        inQuote = true;
      } else {
        if (closed || c === '"') errors.push(`Zeile ${line}: Ungültige Anführungszeichen.`);
        cell += c;
      }
    }
    if (inQuote) errors.push(`Zeile ${startLine}: Nicht geschlossenes Anführungszeichen.`);
    finishRecord();
    if (!records.length) return fail('Zeile 1: Die CSV-Datei ist leer.');
    const aliases = { eduloid: 'uid', uid: 'uid', name: 'name', klasse: 'className', class: 'className', classname: 'className', schoolyear: 'schoolYear', jahrgang: 'schoolYear', schuljahr: 'schoolYear' };
    const header = records.shift();
    const fields = header.cells.map(value => aliases[value.trim().toLowerCase().replace(/[\s_-]/g, '')]);
    if (fields.some(field => !field) || new Set(fields).size !== fields.length || (!fields.includes('uid') && !fields.includes('name'))) {
      errors.push(`Zeile ${header.line}: Ungültige oder doppelte Spaltenüberschriften.`);
    }
    if (records.length > 100) errors.push(`Zeile ${records[100].line}: Höchstens 100 Einträge sind erlaubt.`);
    const rows = [], seen = new Set();
    for (const record of records.slice(0, 100)) {
      const row = { uid: '', name: '', className: '', schoolYear: '' };
      const error = message => errors.push(`Zeile ${record.line}: ${message}`);
      if (record.cells.length !== fields.length) { error('Die Spaltenanzahl stimmt nicht mit der Kopfzeile überein.'); continue; }
      fields.forEach((field, index) => { if (field) row[field] = record.cells[index].trim(); });
      // Validate the original field too: trimming must never hide embedded controls.
      if (record.cells.some(value => controls.test(value))) error('Felder dürfen keine Steuerzeichen oder Zeilenumbrüche enthalten.');
      if (!row.uid && !row.name) error('Edulo-ID oder Name erforderlich.');
      if (row.uid && !uidPattern.test(row.uid)) error('Ungültige Edulo-ID.');
      if (row.uid && seen.has(row.uid)) error('Doppelte Edulo-ID.');
      if (row.uid) seen.add(row.uid);
      if (row.name.length > 120) error('Der Name darf höchstens 120 Zeichen enthalten.');
      row.className = normalizeClass(row.className);
      if (row.className.length > 40) error('Die Klasse darf höchstens 40 Zeichen enthalten.');
      if (row.schoolYear) {
        const year = normalizeYear(row.schoolYear);
        if (!year) error('Ungültiges Schuljahr; zwei aufeinanderfolgende Jahre zwischen 2000 und 2199 erforderlich.');
        else row.schoolYear = year;
      }
      rows.push(row);
    }
    return { rows: errors.length ? [] : rows, errors };
  }
  function suggestLegacyProfile(rawName) {
    const original = typeof rawName === 'string' ? rawName : '';
    const unchanged = { name: original, className: '', schoolYear: '', recognized: false };
    if (controls.test(original)) return unchanged;
    const match = original.match(/^(.*?)\s+(?:[·|;]\s*)?((?:[1-9]|1[0-3])\s*[A-Za-z](?:\s*[1-9])?)\s+(?:[·|;]\s*)?((?:20\d{2}|21\d{2})(?:\s*[-/]\s*|\s+)(?:\d{2}|20\d{2}|21\d{2}))\s*$/);
    if (!match) return unchanged;
    const name = match[1].replace(/\s*[·|;]\s*$/, '').trim();
    const schoolYear = normalizeYear(match[3]);
    if (!name || !schoolYear) return unchanged;
    return { name, className: normalizeClass(match[2]), schoolYear, recognized: true };
  }
  function csvTemplate() {
    return '\uFEFFEdulo-ID;Name;Klasse;Schuljahr\r\n';
  }
  return { parseCsv, suggestLegacyProfile, csvTemplate };
}

export const { parseCsv, suggestLegacyProfile, csvTemplate } = createAdminRoster();
export const ROSTER_BROWSER_JS = `const AdminRoster = (${createAdminRoster.toString()})();`;
