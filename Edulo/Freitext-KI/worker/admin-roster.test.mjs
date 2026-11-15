import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { parseCsv, suggestLegacyProfile, csvTemplate, ROSTER_BROWSER_JS } from './admin-roster.mjs';

const uid = 'Ab-123456-abcdef-ABCDEF';
test('German CSV, BOM, CRLF and exact UID case are preserved', () => {
  assert.deepEqual(parseCsv(`\uFEFFEdulo-ID;Name;Klasse;Schuljahr\r\n${uid};Testperson;8 G3;2026 2027\r\n`), {
    rows: [{ uid, name: 'Testperson', className: '8G3', schoolYear: '2026/2027' }], errors: []
  });
});
test('quoted delimiter and escaped quotes, name-only import, tab separator', () => {
  assert.equal(parseCsv('Name,Klasse,Schuljahr\n"Beispiel, ""Test""",8G3,2026/27').rows[0].name, 'Beispiel, "Test"');
  assert.equal(parseCsv('name\tclassname\tschoolyear\nTest\t8 G3\t2026-2027').rows[0].className, '8G3');
  assert.equal(parseCsv('Name\nTest').rows.length, 1);
});
test('rejects embedded line breaks and reports physical record lines', () => {
  const result = parseCsv('Name;Klasse\r\n"Test\r\nName";8G3\r\nTest;8G3');
  assert.deepEqual(result.rows, []);
  assert.match(result.errors[0], /^Zeile 2:/);
});
test('malformed CSV and headers fail without partial rows', () => {
  for (const input of ['Name;Name\nA;B', 'Unbekannt\nTest', 'Name;Klasse\nTest', 'Name\n"Test', 'Name\n"Test"extra', 'Name;uid\n;']) {
    const result = parseCsv(input);
    assert.ok(result.errors.length, input);
    assert.deepEqual(result.rows, []);
  }
});
test('validates IDs, duplicate IDs, field limits and consecutive school years', () => {
  for (const input of [
    'uid;Name\nwrong;Test',
    `uid;Name\n${uid};Test\n${uid};Test2`,
    `Name\n${'a'.repeat(121)}`,
    `Name;Klasse\nTest;${'a'.repeat(41)}`,
    'Name;Schuljahr\nTest;2026/2028',
    'Name;Schuljahr\nTest;1999/2000',
    'Name;Schuljahr\nTest;2199/2200',
    'Name\nTest\u0000'
  ]) assert.ok(parseCsv(input).errors.length, input);
  assert.equal(parseCsv('Name;Schuljahr\nTest;2099/2100').rows[0].schoolYear, '2099/2100');
  assert.equal(parseCsv('Name;Klasse\nTest;Arbeitsgruppe Nord').rows[0].className, 'Arbeitsgruppe Nord');
});
test('enforces entry and UTF-8 byte limits', () => {
  assert.equal(parseCsv('Name\n' + Array(100).fill('Test').join('\n')).rows.length, 100);
  assert.ok(parseCsv('Name\n' + Array(101).fill('Test').join('\n')).errors.length);
  assert.match(parseCsv('Name\n' + 'ä'.repeat(20000)).errors[0], /40000 Bytes/);
});
test('legacy suggestions require both safe class and year suffix', () => {
  for (const value of ['Maxim 8 G3 2026 2027', 'Maxim · 8G3 · 2026/2027', 'Maxim 8G3 2026/27']) {
    assert.deepEqual(suggestLegacyProfile(value), { name: 'Maxim', className: '8G3', schoolYear: '2026/2027', recognized: true });
  }
  for (const name of ['Maxim 2026 2027', 'Maxim 8G3', 'Maxim 8G3 2026/2028', 'Maxim 8G3 2026', '  Originalname  ']) {
    assert.deepEqual(suggestLegacyProfile(name), { name, className: '', schoolYear: '', recognized: false });
  }
});
test('browser JS runs independently and agrees with module exports', () => {
  const context = vm.createContext({ TextEncoder });
  vm.runInContext(ROSTER_BROWSER_JS + '; globalThis.api = AdminRoster;', context);
  const plain = value => JSON.parse(JSON.stringify(value));
  for (const text of [csvTemplate(), 'Name\nTest', 'Name;Schuljahr\nTest;2026/27', 'Name\n"Test\nTest"']) {
    assert.deepEqual(plain(context.api.parseCsv(text)), parseCsv(text));
  }
  assert.deepEqual(plain(context.api.suggestLegacyProfile('Maxim · 8G3 · 2026/2027')), suggestLegacyProfile('Maxim · 8G3 · 2026/2027'));
  assert.equal(context.api.csvTemplate(), csvTemplate());
});
