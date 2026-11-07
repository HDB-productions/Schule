// Real five-phase UI in an isolated synthetic Edulo host. All remote requests mocked.
'use strict';
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const { fixture } = require('./test-fixture.cjs');
const lesson = require('./lesson.js');
const output = path.resolve(__dirname, '../../../outputs/gmz-ranger-qa/process');
const starts = [0, 1.8, 4, 10, 15], ends = [1.8, 4, 10, 15, 23], seconds = [5, 6, 7, 7, 9];
const near = (actual, expected, label, epsilon = 1e-8) => assert.ok(Math.abs(actual - expected) <= epsilon, `${label}: ${actual} expected ${expected}`);
async function run() {
  assert.ok(fs.existsSync(path.join(__dirname, 'widget.html')), 'Build the widget before running process-ui.test.cjs');
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html;charset=utf-8'); res.end(fixture(fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf8'))); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const context = await browser.newContext({ viewport: { width: 1100, height: 1000 }, reducedMotion: 'no-preference' });
    const paid = [], external = [], errors = [], snapshots = [], boundaries = [];
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) return route.continue();
      external.push(url.origin + url.pathname);
      if (url.pathname === '/feedback') paid.push(request.url());
      const headers = { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      if (url.hostname === 'edulomodularai.hildebrandt.workers.dev' && url.pathname === '/quota') return route.fulfill({ status: 200, headers, contentType: 'application/json', body: JSON.stringify({ budget: { remainingEuroMicros: 100000, weeklyRemainingEuroMicros: 100000, reservedEuroMicros: 0 } }) });
      return route.fulfill({ status: 204, headers });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const clockStart = new Date('2026-11-07T18:00:00Z');
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(new Date(clockStart.getTime() + 1000));
    const read = () => page.locator('.gmz').evaluate(root => {
      const v = root.gmzViewer, process = root.gmzProcessState(), mechanism = [];
      v.mechanism.traverse(node => mechanism.push({ name: node.name, role: node.userData.role, index: node.userData.index, position: node.position.toArray(), quaternion: node.quaternion.toArray(), scale: node.scale.toArray(), visible: node.visible }));
      const cue = v.mechanism.children.find(node => node.userData.role === 'electronDirection');
      return { process, view: v.getView(), cameraPosition: v.camera.position.toArray(), cameraQuaternion: v.camera.quaternion.toArray(), explosion: v.getExplosion(), microscopic: v.getMicroscopic(), windowVisibility: v.getWindowVisibility(), fieldVisibility: v.getFieldVisibility(), directionEnabled: v.getElectronDirectionVisible(), direction: cue ? { visible: cue.visible, position: cue.position.toArray(), quaternion: cue.quaternion.toArray() } : null, atomic: v.getAtomicState(), mechanism };
    });
    async function init() {
      await page.goto(origin);
      await page.waitForFunction(() => !!document.querySelector('.gmz')?.gmzViewer && typeof document.querySelector('.gmz').gmzProcessState === 'function' && !document.querySelector('[data-label-controls]').disabled);
      await page.clock.fastForward(3000); await page.clock.runFor(34);
    }
    async function snapshot(name) {
      const state = await read(); snapshots.push({ name, process: state.process, view: state.view, atomicTime: state.atomic?.time });
      await page.locator('.model-layout').screenshot({ path: path.join(output, name + '.png') });
      console.log('Captured ' + name + ' (simulation time ' + state.atomic?.time + ')');
      return state;
    }
    async function ready(index) {
      let elapsed = 0, state = await read();
      if (state.process.status === 'preparing') { await page.clock.fastForward(3000); await page.clock.runFor(34); elapsed=3034; state=await read(); }
      assert.equal(state.process.mode, 'ablauf'); assert.equal(state.process.phase, index);
      assert.equal(state.process.status, 'playing', `phase ${index} automatically plays after preparation (${elapsed}ms)`);
      assert.ok(elapsed <= 3050, 'camera preparation completes within three seconds plus a frame');
      assert.equal(await page.locator('[data-phase-actions]').isVisible(), false, 'actions stay hidden while playing');
      return state;
    }
    async function sampleTime(index, time) {
      let state = await read();
      assert.equal(state.process.phase, index); assert.equal(state.process.status, 'playing');
      const ms = (time - state.atomic.time) / (ends[index] - starts[index]) * seconds[index] * 1000;
      assert.ok(ms >= -20, 'requested sample must be ahead of current process time');
      if (ms > 34) { await page.clock.fastForward(ms-34); await page.clock.runFor(34); } else if(ms>0) await page.clock.runFor(ms);
      state = await read(); near(state.atomic.time, time, 'sample simulation time', .015); return state;
    }
    async function finish(index) {
      const current = await read();
      const remaining = Math.max(0, (ends[index] - current.atomic.time) / (ends[index] - starts[index]) * seconds[index] * 1000);
      // Interior flight is sampled separately. Jump to the boundary, then let
      // two real frames update Three.js before comparing actual transforms.
      await page.clock.fastForward(remaining + 40); await page.clock.runFor(34);
      const state = await read();
      assert.equal(state.process.status, 'paused'); assert.equal(state.process.phase, index);
      near(state.process.time, ends[index], 'public phase boundary'); near(state.atomic.time, ends[index], 'actual simulation boundary');
      assert.equal(await page.locator('[data-phase-actions]').isVisible(), true, 'both actions appear at the frozen boundary');
      assert.equal(await page.locator('[data-phase-play]').isVisible(), true); assert.equal(await page.locator('[data-phase-replay]').isVisible(), true);
      await page.clock.fastForward(1000); await page.clock.runFor(34);
      assert.deepEqual(await read(), state, 'all atomic data, actual particle transforms and camera remain frozen for an extra second');
      boundaries.push({ phase: index, time: state.atomic.time, positionsFrozen: true });
      console.log('Verified frozen phase ' + index + ' at ' + state.atomic.time);
      return state;
    }
    async function clickImmediate(selector) {
      await page.locator(selector).evaluate(node => node.addEventListener('click', () => {
        const root = document.querySelector('.gmz'), v = root.gmzViewer;
        window.processImmediate = { process: root.gmzProcessState(), atomic: v.getAtomicState(), view: v.getView() };
      }, { once: true }));
      await page.locator(selector).click();
      return page.evaluate(() => window.processImmediate);
    }
    await init();
    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), false);
    assert.equal((await read()).process.mode, 'aufbau');
    assert.equal(await page.locator('.label-panel').isVisible(), true); assert.equal(await page.locator('.explode-label').isVisible(), true);
    await page.locator('[data-label-input]').fill(lesson.components[0].label); await page.locator('[data-label-check]').click();
    await page.locator('[data-next]').click();
    const labelDraft = 'Mein gespeicherter Beschriftungsentwurf', answer = 'Strahlung gelangt in das Zählrohr.';
    await page.locator('[data-label-input]').fill(labelDraft); await page.locator('[data-answer]').fill(answer);
    await page.clock.fastForward(3000); await page.clock.runFor(34);
    const labelsBefore = await page.evaluate(() => fixtureState().data.labels);
    await page.locator('[data-mode-select="ablauf"]').click();
    assert.equal(await page.locator('.model-layout').getAttribute('data-mode'), 'ablauf');
    assert.equal(await page.locator('.label-panel').isVisible(), false); assert.equal(await page.locator('.explode-label').isVisible(), false);
    assert.equal(await page.locator('[data-phase-text]').count(), 0, 'there is no phase explanation field');
    assert.equal(await page.locator('[data-process] p').count(), 0, 'process controls contain no explanatory prose');
    assert.deepEqual(await page.locator('[data-phases] [data-phase]').allTextContents(), ['1 · Eintritt', '2 · Ionisation', '3 · Bewegung', '4 · Lawine', '5 · Totzeit']);
    await ready(0);
    await sampleTime(0, 1.2); const window = await snapshot('01-entry-window');
    near(window.atomic.radiation.windowCrossingAt, 1.2, 'configured window crossing');
    near(window.atomic.radiation.position[2], window.atomic.radiation.windowPlaneZ, 'radiation crosses actual window', .20);
    assert.equal(window.atomic.primary.occurred, false); assert.ok(window.windowVisibility > .99, 'entry keeps window visible');
    const entryEnd = await finish(0);
    assert.equal(entryEnd.atomic.radiation.enteredWindow, true); assert.equal(entryEnd.atomic.primary.occurred, false, 'entry ends after window crossing and before collision');
    assert.equal(entryEnd.atomic.electrons[0].visible, false); assert.ok(!entryEnd.direction?.visible);
    await snapshot('02-entry-paused');
    let immediate = await clickImmediate('[data-phase-play]');
    assert.equal(immediate.process.phase, 1); assert.equal(immediate.process.status, 'playing');
    near(immediate.atomic.time, 1.8, 'ionization begins at shared entry boundary'); assert.deepEqual(immediate.atomic, entryEnd.atomic, 'continue does not reset particles'); assert.deepEqual(immediate.view, entryEnd.view, 'continue does not reset camera');
    await sampleTime(1, 2.4); const precontact = await snapshot('03-ionization-precontact');
    assert.equal(precontact.atomic.primary.occurred, false, 'ionization includes a visible incoming flight before contact');
    assert.equal(precontact.atomic.atoms[0].visible, true); assert.equal(precontact.atomic.electrons[0].visible, false);
    assert.ok(!precontact.direction?.visible, 'no electron direction cue before drift');
    await sampleTime(1, 3.25); const contact = await read();
    assert.equal(contact.atomic.primary.occurred, true); assert.equal(contact.atomic.atoms[0].visible, false); assert.equal(contact.atomic.electrons[0].visible, true); assert.equal(contact.atomic.ions[0].visible, true);
    const ionEnd = await finish(1);
    await clickImmediate('[data-phase-replay]'); await ready(1); await sampleTime(1, 2.4);
    const precontactReplay = await read();
    // RAF samples may straddle an adjacent frame after camera preparation. The
    // exact frozen end below establishes deterministic seeking; this interior
    // check also verifies that replay takes the same precontact flight.
    near(precontactReplay.atomic.time, precontact.atomic.time, 'replay interior clock', .015);
    assert.deepEqual(precontactReplay.atomic.primary, precontact.atomic.primary, 'replay preserves the exact scheduled contact');
    for (const key of ['atoms', 'electrons', 'ions']) for (let i = 0; i < precontact.atomic[key].length; i++) for (let axis = 0; axis < 3; axis++) near(precontactReplay.atomic[key][i].position[axis], precontact.atomic[key][i].position[axis], 'replay interior particle position', .08);
    for (const key of ['yaw', 'pitch', 'distance']) near(precontactReplay.view[key], precontact.view[key], 'replay interior camera', .8);
    const ionReplayEnd = await finish(1); assert.deepEqual(ionReplayEnd.atomic, ionEnd.atomic, 'same phase replay ends deterministically');
    for (let index = 2; index < 5; index++) {
      const previous = await read(); immediate = await clickImmediate('[data-phase-play]');
      assert.equal(immediate.process.phase, index); assert.equal(immediate.process.status, 'playing');
      near(immediate.atomic.time, starts[index], 'next phase shared boundary'); assert.deepEqual(immediate.atomic, previous.atomic, 'advancing preserves every particle at the shared boundary'); assert.deepEqual(immediate.view, previous.view, 'advancing preserves boundary camera');
      if (index === 2) {
        await sampleTime(2, 6); const drift = await snapshot('04-drift-direction');
        assert.equal(drift.direction?.visible, true, 'primary electron has a visible direction helper during drift');
        const electron = drift.atomic.electrons[0], toward = electron.anodeTarget.map((v, i) => v - electron.position[i]), offset = drift.direction.position.map((v, i) => v - electron.position[i]);
        assert.ok(offset.reduce((sum, v, i) => sum + v * toward[i], 0) > 0, 'helper sits ahead of the electron toward its actual anode target');
      } else {
        await sampleTime(index, (starts[index] + ends[index]) / 2);
        assert.ok(!(await read()).direction?.visible, 'electron direction helper is absent outside drift');
      }
      await finish(index);
    }
    const end = await read(); assert.equal(end.atomic.measurementReady, true, 'last boundary is measurably ready again');
    immediate = await clickImmediate('[data-phase-play]'); assert.equal(immediate.process.phase, 0); assert.equal(immediate.process.status, 'preparing');
    await ready(0); near((await read()).atomic.time, 0, 'end play restarts entry', .03);
    await page.locator('[data-phase="3"]').click(); await ready(3);
    const direct = await read(); near(direct.atomic.time, 10, 'direct phase selection starts at its real boundary', .06); await finish(3);
    await page.locator('[data-mode-select="aufbau"]').click(); await page.clock.fastForward(4300); await page.clock.runFor(34);
    const restored = await read(); assert.equal(restored.process.mode, 'aufbau'); assert.equal(restored.atomic, null); near(restored.microscopic, 0, 'Aufbau leaves microscopic state'); near(restored.windowVisibility, 1, 'Aufbau restores window'); near(restored.fieldVisibility, 0, 'Aufbau hides process field'); assert.ok(!restored.direction?.visible);
    assert.equal(await page.locator('.model-layout').getAttribute('data-mode'), 'aufbau'); assert.equal(await page.locator('.label-panel').isVisible(), true); assert.equal(await page.locator('.explode-label').isVisible(), true); assert.equal(await page.locator('[data-process]').isVisible(), false);
    assert.equal(await page.locator('[data-label-input]').inputValue(), labelDraft); assert.equal(await page.locator('[data-answer]').inputValue(), answer);
    assert.deepEqual(await page.evaluate(() => fixtureState().data.labels), labelsBefore, 'changing model modes preserves earned labels and drafts');
    const textarea = page.locator('[data-answer]');
    const metrics = () => textarea.evaluate(node => ({ height: node.getBoundingClientRect().height, client: node.clientHeight, scroll: node.scrollHeight, scrollTop: node.scrollTop, overflowY: getComputedStyle(node).overflowY }));
    const fits = async label => { const m = await metrics(); assert.ok(m.scroll <= m.client + 1, label + ': complete answer fits without inner scrolling'); assert.equal(m.scrollTop, 0, label + ': no internal scroll offset'); return m; };
    const short = await fits('short answer');
    const longAnswer = Array.from({ length: 45 }, (_, i) => `${i + 1}. Die Strahlung ionisiert Gasatome; freie Elektronen bewegen sich im elektrischen Feld zur Anode.`).join('\n');
    assert.ok(longAnswer.length < 6000);
    await textarea.fill(longAnswer); await page.clock.runFor(100); const tall = await fits('long answer'); assert.ok(tall.height > short.height * 2, 'textarea grows with long input');
    await textarea.fill(answer); await page.clock.runFor(100); const shrunk = await fits('deleted text'); assert.ok(shrunk.height < tall.height / 2, 'textarea shrinks after text deletion');
    await textarea.fill(longAnswer); await page.clock.runFor(100);
    await page.setViewportSize({ width: 390, height: 1000 }); await page.clock.runFor(150);
    const narrow = await fits('390px resize'); assert.ok(narrow.height > tall.height, 'narrower lines trigger textarea height recalculation');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '390px layout has no horizontal page overflow');
    await page.locator('[data-answer]').screenshot({ path: path.join(output, '05-narrow-answer.png') });
    await snapshot('06-narrow-model');
    await page.clock.runFor(1500);
    await page.reload(); await page.waitForFunction(() => !document.querySelector('[data-text-controls]').disabled && !!document.querySelector('.gmz')?.gmzViewer); await page.clock.fastForward(3100); await page.clock.runFor(34);
    assert.equal(await textarea.inputValue(), longAnswer, 'saved long text loads through real Edulo bridge'); await fits('loaded saved text');
    assert.equal(await page.locator('[data-label-input]').inputValue(), labelDraft, 'label draft also survives reload');
    await page.locator('[data-mode-select="ablauf"]').click(); await ready(0); await finish(0);
    await snapshot('07-narrow-process-paused');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'narrow Ablauf has no horizontal overflow');
    assert.equal(await page.locator('[data-phase-actions]').isVisible(), true);
    assert.deepEqual(paid, [], 'model exploration and text editing never send paid requests'); assert.deepEqual(errors, [], 'no browser runtime errors');
    const evidence = { passed: true, reducedMotion: 'no-preference', phaseDurationsSeconds: seconds, boundaries, paidRequests: paid.length, blockedExternalRequests: external, runtimeErrors: errors, textarea: { short, tall, shrunk, narrow }, snapshots };
    fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify({ passed: true, phases: 5, frozenBoundaries: boundaries.length, replayDeterministic: true, modeDraftPreservation: true, textareaAutoHeight: true, paidRequests: 0, runtimeErrors: errors, output }, null, 2));
    await context.close();
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
