// Real UI camera transitions with animation enabled. Synthetic Edulo host; no paid requests.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const { fixture } = require('./test-fixture.cjs');
const lesson = require('./lesson.js');
const output = path.resolve(__dirname, '../../../outputs/gmz-ranger-qa/model-ui');
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html;charset=utf-8'); res.end(fixture(fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf8'))); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const context = await browser.newContext({ viewport: { width: 1100, height: 1000 }, reducedMotion: 'no-preference' });
    const external = [], paid = [], errors = [], snapshots = [];
    await context.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin === origin) return route.continue();
      external.push(url.origin + url.pathname);
      if (url.pathname === '/feedback') paid.push(req.url());
      const headers = { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      if (url.hostname === 'edulomodularai.hildebrandt.workers.dev' && url.pathname === '/quota') return route.fulfill({ status: 200, headers, contentType: 'application/json', body: JSON.stringify({ budget: { remainingEuroMicros: 100000, weeklyRemainingEuroMicros: 100000, reservedEuroMicros: 0 } }) });
      return route.fulfill({ status: 204, headers });
    });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    // Advance the real UI animation clock explicitly so concurrent movie rendering
    // cannot move a screenshot past the transition it is meant to inspect.
    const clockStart = new Date('2026-11-07T18:00:00Z');
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(new Date(clockStart.getTime() + 1000));
    const read = () => page.locator('.gmz').evaluate(root => { const v = root.gmzViewer; return { ...v.getView(), explosion: v.getExplosion(), microscopic: v.getMicroscopic(), highlight: v.getHighlight(), atomic: v.getAtomicState() }; });
    // Capture in the same event turn: browser automation can return long after a click on busy render hosts.
    const armImmediate = (selector, event = 'click') => page.locator(selector).evaluate((node, event) => node.addEventListener(event, () => { const v = document.querySelector('.gmz').gmzViewer; window.modelImmediate = { ...v.getView(), explosion: v.getExplosion(), microscopic: v.getMicroscopic() }; }, { once: true }), event);
    async function snapshot(name) { const state = await read(); snapshots.push({ name, ...state }); await page.locator('.model-layout').screenshot({ path: path.join(output, name + '.png') }); return state; }
    const close = (actual, expected, label, epsilon = .015) => assert.ok(Math.abs(actual - expected) <= epsilon, `${label}: ${actual} expected ${expected}`);
    await page.goto(origin);
    await page.waitForFunction(() => !!document.querySelector('.gmz')?.gmzViewer && !document.querySelector('[data-label-controls]').disabled);
    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), false);
    await page.clock.runFor(3000);
    await page.waitForFunction(() => document.querySelector('.gmz').gmzViewer.getHighlight() === 'window');
    await page.locator('[data-label-input]').fill(lesson.components[0].label); await page.locator('[data-label-check]').click();
    const before = await read(); close(before.explosion, 0, 'initial closed window');
    await armImmediate('[data-next]'); await page.locator('[data-next]').click();
    const immediate = await page.evaluate(() => modelImmediate); assert.ok(immediate.explosion < .12, 'selection must not instantly jump to full explosion');
    await page.clock.runFor(1100); const mid = await snapshot('01-label-transition'); assert.ok(mid.explosion > .03 && mid.explosion < .97, 'label transition interpolates explosion');
    await page.clock.runFor(1900);
    await page.waitForFunction(() => document.querySelector('.gmz').gmzViewer.getHighlight() === 'cathode');
    const labelEnd = await snapshot('02-label-end'); close(labelEnd.explosion, 1, 'cathode exposed'); close(labelEnd.microscopic, 0, 'label remains macroscopic');
    for (let i = 1; i < lesson.components.length; i++) {
      await page.locator('[data-label-input]').fill(lesson.components[i].label); await page.locator('[data-label-check]').click();
      if (i < lesson.components.length - 1) await page.locator('[data-next]').click();
    }
    await page.locator('[data-part="cathode"]').click();
    await page.clock.runFor(3000);
    await page.waitForFunction(() => document.querySelector('.gmz').gmzViewer.getHighlight() === 'cathode' && document.querySelector('[data-model-status]').textContent.includes('hervorgehoben'));
    const processBefore = await read(); close(processBefore.explosion, 1, 'process starts with exploded cathode');
    await armImmediate('[data-process] summary', 'click'); await page.locator('[data-process] summary').click();
    const processImmediate = await page.evaluate(() => modelImmediate); assert.ok(processImmediate.explosion > .85, 'process click must not instantly close the device'); close(processImmediate.microscopic, 0, 'no instant atomic jump');
    await page.clock.runFor(2400); const processMid = await snapshot('03-process-transition'); assert.ok(processMid.explosion > .03 && processMid.explosion < .97, 'process closes in transition');
    await page.clock.runFor(4000);
    await page.waitForFunction(() => { const v = document.querySelector('.gmz').gmzViewer; return v.getMicroscopic() > .999 && v.getExplosion() < .001 && v.getAtomicState() !== null; });
    const processEnd = await snapshot('04-process-atomic-end'); close(processEnd.explosion, 0, 'functional scene closed'); close(processEnd.microscopic, 1, 'functional scene microscopic'); close(processEnd.distance, 25, 'incoming camera closeup', .5);
    const atomic = processEnd.atomic;
    assert.ok(atomic.atoms.length >= 16 && atomic.atoms.some(atom => atom.visible), 'real visible gas atoms exist');
    assert.ok(atomic.events.length >= 2, 'actual primary and secondary atom contact events exist');
    for (const event of atomic.events) {
      assert.ok(atomic.atoms.some(atom => atom.index === event.atomIndex), 'contact targets an existing atom');
      for (const key of ['projectileAtContact', 'electronAtBirth', 'ionAtBirth']) for (let i = 0; i < 3; i++) close(event[key][i], event.position[i], key + ' touches atom', 1e-9);
    }
    await page.locator('[data-phase="1"]').click();
    await page.clock.runFor(1900);
    await page.waitForFunction(() => { const a = document.querySelector('.gmz').gmzViewer.getAtomicState(); return a && a.time > 2.02 && a.time < 3 && a.primary.occurred; });
    const ionization = await snapshot('05-ionization-contact');
    assert.equal(ionization.atomic.atoms[0].visible, false); assert.equal(ionization.atomic.electrons[0].visible, true); assert.equal(ionization.atomic.ions[0].visible, true);
    await armImmediate('[data-home]'); await page.locator('[data-home]').click(); const homeImmediate = await page.evaluate(() => modelImmediate); assert.ok(homeImmediate.microscopic > .85, 'home must interpolate out of microscopic view');
    await page.clock.runFor(1100); const homeMid = await snapshot('06-home-transition'); assert.ok(homeMid.microscopic > .03 && homeMid.microscopic < .97, 'home interpolates microscopic state');
    await page.clock.runFor(2100);
    await page.waitForFunction(() => { const v = document.querySelector('.gmz').gmzViewer; return v.getMicroscopic() < .001 && v.getExplosion() < .001 && v.getAtomicState() === null && v.getHighlight() === null; });
    const homeEnd = await snapshot('07-home-end'); close(homeEnd.explosion, 0, 'home closed'); close(homeEnd.microscopic, 0, 'home macroscopic'); close(homeEnd.distance, 280, 'home distance', .5);
    // A real range-key gesture must recover the visible device from the microscopic view.
    await page.locator('[data-phase="2"]').click();
    await page.clock.runFor(6500);
    await page.waitForFunction(() => { const v = document.querySelector('.gmz').gmzViewer; return v.getMicroscopic() > .999 && v.getExplosion() < .001 && v.getAtomicState() !== null; });
    await page.locator('[data-explosion]').focus(); await armImmediate('[data-explosion]', 'input'); await page.locator('[data-explosion]').press('End');
    const sliderImmediate = await page.evaluate(() => modelImmediate); assert.ok(sliderImmediate.microscopic > .80, 'slider exits microscopic view gradually'); assert.ok(sliderImmediate.explosion < .20, 'slider does not instantly jump to requested full explosion');
    await page.clock.runFor(650); const sliderMid = await snapshot('08-slider-transition'); assert.ok(sliderMid.microscopic > .03 && sliderMid.microscopic < .97, 'slider interpolates back to the visible device');
    await page.clock.runFor(1350);
    await page.waitForFunction(() => { const v = document.querySelector('.gmz').gmzViewer; return v.getMicroscopic() < .001 && v.getExplosion() > .999 && v.getAtomicState() === null; });
    const sliderEnd = await snapshot('09-slider-end'); close(sliderEnd.microscopic, 0, 'slider macroscopic'); close(sliderEnd.explosion, 1, 'requested slider explosion preserved'); close(sliderEnd.distance, 280, 'slider overview camera', .5);
    assert.equal(await page.locator('[data-explosion]').inputValue(), '100');
    const shellOpacity = await page.locator('.gmz').evaluate(root => { let opacity = 0; root.gmzViewer.parts.shell.traverse(mesh => { for (const material of [].concat(mesh.material || [])) opacity = Math.max(opacity, material.opacity); }); return opacity; });
    assert.ok(shellOpacity > .8, 'outer device surfaces become visibly opaque again');
    assert.deepEqual(paid, [], 'camera navigation never starts paid AI'); assert.deepEqual(errors, [], 'no browser runtime errors');
    const evidence = { passed: true, reducedMotion: 'no-preference', paidRequests: paid.length, blockedExternalRequests: external, runtimeErrors: errors, snapshots };
    fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify({ passed: true, transitions: ['label', 'process', 'home', 'microscopic-to-slider'], microscopicFinal: sliderEnd.microscopic, explosionFinal: sliderEnd.explosion, contactEvents: atomic.events.length, paidRequests: 0, runtimeErrors: errors, output }, null, 2));
    await context.close();
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
