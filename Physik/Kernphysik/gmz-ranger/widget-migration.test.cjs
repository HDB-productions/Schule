// Real built widget in an isolated synthetic Edulo host; no personal data or paid API calls.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const { fixture, uid } = require('./test-fixture.cjs');
const L = require('./lesson.js'), D = require('./domain.js');
const legacyIds = ['entry', 'ionisation', 'charges', 'field', 'electron_motion', 'ion_motion', 'avalanche', 'pulse', 'count', 'quenching', 'deadtime', 'efficiency', 'limits'];
const encode = value => 'EDULO2:' + Buffer.from(JSON.stringify(value)).toString('base64');

async function run() {
  const html = fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf8');
  assert.ok(html.includes('migrateSnapshot'), 'Build the migration-enabled widget first.');
  const data = D.fresh();
  data.ownerUid = uid;
  data.answer = 'Mein bisheriger Entwurf: Strahlung gelangt in das Gas.  Noch nicht eingereicht.';
  for (const [i, c] of L.components.entries()) if (i < 4) data.labels[c.id] = { draft: c.label, earned: i === 1 ? 'yellow' : 'green', assisted: i === 1, attempts: i === 1 ? 2 : 1 };
  data.labels.voltage.draft = 'Spannungsversorgung';
  data.aspects = Object.fromEntries(legacyIds.map(id => [id, { earned: 'gray', assisted: id === 'deadtime' }]));
  const scores = [...L.components.map(c => data.labels[c.id].earned), ...legacyIds.map(id => data.aspects[id].earned)];
  const old = { widget: L.id, version: 1, data, scores }, raw = encode(old);
  const rows = scores.map((color, i) => ({ id: 100 + i, v: color === 'gray' ? '' : '1', l: '', c: color === 'gray' ? 'false' : 'true', h: color === 'yellow' ? 'true' : 'false' }));
  const seed = JSON.stringify({ e1: raw, rows });
  const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html;charset=utf-8'); res.end(fixture(html)); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const context = await browser.newContext({ viewport: { width: 920, height: 1000 }, reducedMotion: 'reduce' });
    await context.addInitScript(({ seed }) => {
      const originalSet = Storage.prototype.setItem;
      if (!localStorage.getItem('fixture')) originalSet.call(localStorage, 'fixture', seed);
      window.migrationWrites = [];
      Storage.prototype.setItem = function(key, value) { window.migrationWrites.push({ type: 'storage', key }); return originalSet.call(this, key, value); };
      for (const type of ['input', 'change']) document.addEventListener(type, event => {
        if (/^e[12]_/.test(event.target.id)) window.migrationWrites.push({ type, id: event.target.id });
      }, true);
    }, { seed });
    let paidRequests = 0;
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) return route.continue();
      if (url.pathname === '/feedback') paidRequests++;
      const headers = { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      if (url.hostname === 'edulomodularai.hildebrandt.workers.dev' && url.pathname === '/quota') return route.fulfill({ status: 200, headers, contentType: 'application/json', body: JSON.stringify({ budget: { remainingEuroMicros: 100000, weeklyRemainingEuroMicros: 100000, reservedEuroMicros: 0 } }) });
      return route.fulfill({ status: 204, headers });
    });
    const page = await context.newPage(), errors = [];
    page.setDefaultTimeout(20000); page.setDefaultNavigationTimeout(30000);
    page.on('pageerror', error => errors.push(error.message));
    const read = () => page.evaluate(() => ({ raw: document.querySelector('#e1_text_input').value, state: fixtureState(), rows: fixtureRows(), writes: window.migrationWrites }));
    const waitLoaded = () => page.waitForFunction(() => document.querySelector('[data-storage]')?.textContent.includes('Mit Edulo verbunden.') && !document.querySelector('[data-label-controls]').disabled);
    console.log('Migration browser: loading synthetic v1/13-aspect state');
    await page.goto(origin); await waitLoaded();
    let observed = await read();
    assert.equal(observed.raw, raw, 'loading preserves original E1 bytes');
    assert.deepEqual(observed.state, old, 'loading does not rewrite the old snapshot');
    assert.deepEqual(observed.writes, [], 'loading dispatches no E1/E2 events or persistent writes');
    assert.deepEqual(observed.rows, rows.map(r => ({ value: r.v, correct: r.c, helped: r.h })), 'loading leaves all E2 values and flags unchanged');
    assert.equal(await page.locator('[data-progress]').innerText(), '4 / 19 Punkte');
    assert.equal(await page.locator('[data-label-progress]').innerText(), '4 / 7 beschriftet');
    assert.equal(await page.locator('[data-label-input]').isEnabled(), true);
    assert.equal(await page.locator('[data-label-input]').inputValue(), data.labels.voltage.draft);
    assert.equal(await page.locator('[data-answer]').inputValue(), data.answer);
    // A second real load must also be read-only while the old raw state remains stored.
    await page.reload(); await waitLoaded();
    observed = await read(); assert.equal(observed.raw, raw); assert.deepEqual(observed.writes, []);

    console.log('Migration browser: completing remaining labels and saving v2');
    for (const [index, c] of L.components.entries()) {
      if (index < 4) continue;
      await page.locator('[data-label-input]').fill(c.label);
      await page.locator('[data-label-check]').click();
      await page.waitForFunction(id => fixtureState()?.version === 2 && fixtureState().data.labels[id].earned === 'green', c.id);
      const current = (await read()).state;
      assert.equal(current.data.ownerUid, data.ownerUid);
      assert.equal(current.data.answer, data.answer);
      assert.deepEqual(current.data.history, []);
      assert.deepEqual(current.data.retiredAspects, { quenching: data.aspects.quenching });
      for (const criterion of L.criteria) assert.deepEqual(current.data.aspects[criterion.id], data.aspects[criterion.id]);
      for (const first of L.components.slice(0, 4)) assert.deepEqual(current.data.labels[first.id], data.labels[first.id]);
      assert.equal(current.scores[19], 'gray');
      if (index < L.components.length - 1) await page.locator('[data-next]').click();
    }
    observed = await read(); const saved = observed.state, savedRaw = observed.raw;
    assert.equal(D.valid(saved.data), true);
    assert.ok(observed.writes.some(write => write.type === 'change' && write.id === 'e1_text_input'));
    assert.equal(await page.locator('[data-progress]').innerText(), '7 / 19 Punkte');
    assert.equal(await page.locator('[data-parts-panel]').isVisible(), true);
    await page.reload();
    await page.waitForFunction(() => document.querySelector('[data-storage]')?.textContent.includes('Mit Edulo verbunden.') && !document.querySelector('[data-parts-panel]').hidden);
    observed = await read();
    assert.equal(observed.raw, savedRaw); assert.deepEqual(observed.state, saved);
    assert.deepEqual(observed.writes, [], 'loading persisted v2 does not write or alter scores');
    assert.deepEqual(observed.rows, saved.scores.map(color => ({ value: color === 'gray' ? '' : '1', correct: color === 'gray' ? 'false' : 'true', helped: color === 'yellow' ? 'true' : 'false' })));
    assert.equal(await page.locator('[data-answer]').inputValue(), data.answer);
    assert.equal(paidRequests, 0); assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, browser: browser.version(), originalBridgeVersion: old.version, savedBridgeVersion: saved.version, initialPoints: 4, finalPoints: 7, writesOnMigrationLoad: 0, originalSnapshotPreservedUntilUserAction: true, retiredAspectPreserved: true, reloadPreserved: true, paidRequests, runtimeErrors: errors }));
    await context.close();
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
