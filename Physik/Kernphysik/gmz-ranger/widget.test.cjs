// Real built widget + real WebGL model in isolated headless Edge or optional WebKit; all service calls mocked.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const { fixture, uid } = require('./test-fixture.cjs');
const L = require('./lesson.js'), D = require('./domain.js');
const engine = process.env.BROWSER_ENGINE || 'chromium';
const output = path.resolve(__dirname, '../../../outputs/gmz-ranger-qa', engine === 'webkit' ? 'webkit' : '');
const budget = { remainingEuroMicros: 980000, weeklyRemainingEuroMicros: 180000, reservedEuroMicros: 0, weekKey: '2026-W45' };
const malicious = '<img src=x onerror="window.injected=true"><script>window.injected=true</script>';
const feedback = status => ({ summary: '', languageFeedback: '', nextSteps: [], misconceptions: [], criteria: L.criteria.map((c, i) => ({ id: c.id, status: status || (i < 2 ? 'met' : 'missing'), feedback: '' })), taskFeedback: [{ id: 'explanation', feedback: 'Dein Text nennt einen nachvollziehbaren Anfang. Wie hängen die weiteren Schritte zusammen? ' + malicious }] });
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.end(fixture(fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf8')));
});
async function run() {
  assert.ok(['chromium', 'webkit'].includes(engine), 'BROWSER_ENGINE must be chromium or webkit');
  assert.ok(fs.existsSync(path.join(__dirname, 'widget.html')), 'Build first: node Physik/Kernphysik/gmz-ranger/build.cjs');
  fs.mkdirSync(output, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = engine === 'webkit'
      ? await webkit.launch({ headless: true })
      : await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const context = await browser.newContext({ viewport: { width: 920, height: 1000 }, reducedMotion: 'reduce', ...(engine === 'webkit' ? { deviceScaleFactor: 1 } : {}) });
    // Exercise the widget's real timeout path without a 45-second test delay.
    await context.addInitScript(() => { const native = window.setTimeout; window.fixtureRequestTimeout = 10000; window.setTimeout = function(fn, delay, ...args) { return native(fn, delay === 45000 ? window.fixtureRequestTimeout : delay, ...args); }; });
    let mode = 'normal', held = null, savedResult = null, paid = [], reads = [];
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) return route.continue();
      if (url.origin !== 'https://edulomodularai.hildebrandt.workers.dev') return route.fulfill({ status: 204, body: '' });
      const cors = { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const body = request.method() === 'POST' ? request.postDataJSON() : null;
      const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: cors, body: JSON.stringify(data) });
      if (url.pathname === '/connection') return json({ requestOrigin: origin, originAllowed: true, ready: true });
      assert.equal(body.uid, uid, 'synthetic UID only');
      if (url.pathname === '/quota') { reads.push({ path: '/quota', body }); return json({ budget }); }
      if (url.pathname === '/result') { reads.push({ path: '/result', body }); assert.equal(body.requestId, savedResult.requestId); return json(savedResult); }
      assert.equal(url.pathname, '/feedback'); paid.push(body);
      assert.deepEqual(body.task, D.task()); assert.equal(typeof body.answer, 'string');
      savedResult = { taskId: L.id, taskVersion: L.version, requestId: body.requestId, feedbackStyle: 'questions-v4', feedback: feedback(mode === 'delay' ? 'met' : undefined), budget, charge: { status: 'settled', euroMicros: 1200 } };
      if (mode === 'unknown') return json({ budget, charge: { status: 'reserved' } }, 202);
      if (mode === 'delay' || mode === 'timeout') { await new Promise(resolve => { held = resolve; }); try { return await json(savedResult); } catch { return; } }
      return json(savedResult);
    });
    const page = await context.newPage(), errors = [], consoleDiagnostics = [], renderDiagnostics = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (['warning', 'error'].includes(message.type()) && consoleDiagnostics.length < 50) consoleDiagnostics.push({ type: message.type(), text: message.text() }); });
    page.on('dialog', dialog => { errors.push('Unexpected dialog: ' + dialog.message()); dialog.dismiss(); });
    const state = () => page.evaluate(() => fixtureState());
    const waitStatus = status => page.waitForFunction(status => fixtureState()?.data.history.at(-1)?.status === status, status);
    async function init() { await page.goto(origin); await page.waitForFunction(() => document.querySelector('[data-storage]')?.textContent.includes('Edulo')); await page.waitForFunction(() => !document.querySelector('[data-label-controls]').disabled); }
    async function submit(text) { await page.locator('[data-answer]').fill(text); await page.locator('[data-check]').click(); }
    await init();
    await page.waitForFunction(() => !!document.querySelector('.gmz').gmzViewer);
    assert.equal(await page.locator('[data-view] canvas').count(), 1);
    const webgl = await page.locator('.gmz').evaluate(root => { const v = root.gmzViewer, gl = v.renderer.getContext(); return { renderer: gl.getParameter(gl.RENDERER), version: gl.getParameter(gl.VERSION), parts: Object.keys(v.parts), threeGlobal: typeof window.THREE }; });
    for (const c of L.components) assert.ok(webgl.parts.includes(c.id), 'real model part ' + c.id);
    assert.equal(webgl.threeGlobal, 'undefined', 'actual lexical THREE build, not a test global stub');
    assert.match(await page.locator('[data-identity]').innerText(), /automatisch/);
    assert.equal(await page.locator('[data-points] [role="img"]').count(), 12, 'only twelve earned prose criteria are visible');
    assert.equal(await page.locator('#footerButtons').isVisible(), false);
    await page.locator('[data-label-input]').fill('Falsches Bauteil'); await page.locator('[data-label-check]').click();
    await page.waitForFunction(() => fixtureState()?.data.labels.window.attempts === 1);
    assert.equal((await state()).data.labels.window.earned, 'gray');
    await page.locator('[data-hint]').click(); assert.equal(await page.locator('[data-hint-text]').isVisible(), true);
    for (let i = 0; i < L.components.length; i++) {
      if (i === 1) await page.locator('[data-hint]').click();
      await page.locator('[data-label-input]').fill(L.components[i].label); await page.locator('[data-label-check]').click();
      await page.waitForFunction(id => fixtureState()?.data.labels[id].earned !== 'gray', L.components[i].id);
      if (i < L.components.length - 1) await page.locator('[data-next]').click();
    }
    assert.equal(await page.locator('[data-parts-panel]').isVisible(), true); assert.equal(await page.locator('[data-parts] button').count(), 7);
    assert.deepEqual((await state()).scores.slice(0, 7), ['yellow', 'yellow', 'green', 'green', 'green', 'green', 'green']);
    for (const c of L.components) {
      await page.locator('[data-part="' + c.id + '"]').click();
      await page.waitForFunction(id => document.querySelector('.gmz').gmzViewer.getHighlight() === id, c.id);
      assert.equal(await page.locator('.gmz').evaluate(root => root.gmzViewer.getHighlight()), c.id);
      assert.equal(await page.locator('[data-part-description]').innerText(), c.explanation);
    }
    await page.locator('[data-explosion]').focus(); await page.locator('[data-explosion]').press('End');
    assert.equal(await page.locator('.gmz').evaluate(root => root.gmzViewer.getExplosion()), 1);
    await page.locator('[data-home]').click(); await page.waitForFunction(() => document.querySelector('.gmz').gmzViewer.getExplosion() === 0); assert.equal(await page.locator('.gmz').evaluate(root => root.gmzViewer.getExplosion()), 0);
    await page.locator('[data-mode-select="ablauf"]').click(); await page.locator('[data-phase="3"]').click(); assert.equal(await page.locator('[data-phase-text]').count(), 0);
    await page.locator('[data-phase="4"]').click();
    await page.waitForFunction(() => { const v = document.querySelector('.gmz').gmzViewer; return v.getFieldVisibility() === 1 && v.getAtomicState()?.time > 16; });
    const field = await page.locator('.gmz').evaluate(root => { const v = root.gmzViewer, state = v.getAtomicState(), panel = root.querySelector('[data-field-status]'); return { strength: state.fieldStrength, ready: state.measurementReady, text: panel.innerText, opacity: Number(getComputedStyle(panel).opacity), fillWidth: panel.querySelector('i').getBoundingClientRect().width }; });
    assert.ok(field.strength > 0 && field.strength < 1, 'deadtime field is weakened, not absent');
    assert.equal(field.ready, false); assert.match(field.text, /Totzeit/); assert.equal(field.opacity, 1); assert.ok(field.fillWidth > 0);
    await page.locator('[data-mode-select="aufbau"]').click();
    await submit('Strahlung kann in das Gas gelangen und dort Elektronen herauslösen. ' + malicious); await waitStatus('done');
    let saved = await state(); assert.deepEqual(saved.scores.slice(7, 10), ['green', 'green', 'gray']);
    assert.equal(await page.locator('[data-feedback]').innerText(), savedResult.feedback.taskFeedback[0].feedback);
    assert.equal(await page.locator('[data-feedback] img,[data-feedback] script').count(), 0); assert.equal(await page.evaluate(() => !!window.injected), false);
    assert.equal(await page.locator('[data-check]').isDisabled(), true); assert.equal(paid.length, 1);
    const rows = await page.evaluate(() => fixtureRows()); assert.equal(rows.filter(r => r.correct === 'true').length, 9); assert.equal(rows.filter(r => r.correct === 'true' && r.helped === 'true').length, 2);
    await page.reload(); await page.waitForFunction(() => fixtureState()?.data.history.at(-1)?.status === 'done');
    assert.deepEqual((await state()), saved); assert.equal(await page.locator('[data-answer]').inputValue(), saved.data.answer); assert.equal(await page.locator('[data-parts-panel]').isVisible(), true);
    for (const width of [390, 920, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
      await page.screenshot({ path: path.join(output, 'widget-' + width + '.png'), fullPage: true });
      const layout = await page.evaluate(() => ({ viewport: innerWidth, viewportClientWidth: document.documentElement.clientWidth, visualViewportWidth: visualViewport?.width, devicePixelRatio, documentRectWidth: document.documentElement.getBoundingClientRect().width, bodyRectWidth: document.body.getBoundingClientRect().width, documentWidth: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll('body *')].filter(node => { const r = node.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + .5 || r.left < -.5 || node.scrollWidth > node.clientWidth + 1); }).map(node => { const r = node.getBoundingClientRect(), css = getComputedStyle(node); return { tag: node.tagName, class: node.className?.baseVal ?? node.className, data: [...node.attributes].filter(a => a.name.startsWith('data-')).map(a => a.name), left: r.left, right: r.right, width: r.width, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, overflowX: css.overflowX, overflowWrap: css.overflowWrap, whiteSpace: css.whiteSpace }; }) }));
      fs.writeFileSync(path.join(output, 'layout-' + width + '.json'), JSON.stringify(layout, null, 2));
      if (layout.documentWidth > layout.viewportClientWidth) console.error(JSON.stringify(layout, null, 2));
      await page.locator('[data-view]').scrollIntoViewIfNeeded();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const { imageData, ...rendered } = await page.locator('.gmz').evaluate(root => {
        const v = root.gmzViewer, gl = v.renderer.getContext();
        const before = { calls: v.renderer.info.render.calls, triangles: v.renderer.info.render.triangles, contextLost: gl.isContextLost(), error: gl.getError() };
        // readPixels must follow a draw in the same event turn for non-preserved buffers.
        v.renderer.render(v.scene, v.camera);
        const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4); gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const colors = new Set(); let opaque = 0;
        for (let offset = 0; offset < pixels.length; offset += 4 * 97) { colors.add(pixels.slice(offset, offset + 4).join(',')); if (pixels[offset + 3] > 0) opaque++; }
        return { viewport: innerWidth, before, calls: v.renderer.info.render.calls, triangles: v.renderer.info.render.triangles, backingWidth: gl.drawingBufferWidth, backingHeight: gl.drawingBufferHeight, sampledColors: colors.size, sampledOpaquePixels: opaque, readError: gl.getError(), imageData: v.canvas.toDataURL('image/png') };
      });
      // Native canvas capture avoids Windows WebKit's host-DPI screenshot crop offset.
      fs.writeFileSync(path.join(output, 'model-buffer-' + width + '.png'), Buffer.from(imageData.split(',')[1], 'base64'));
      renderDiagnostics.push({ requestedWidth: width, ...rendered });
      fs.writeFileSync(path.join(output, 'render-diagnostics.json'), JSON.stringify({ consoleDiagnostics, renderDiagnostics }, null, 2));
      await page.locator('[data-view]').screenshot({ path: path.join(output, 'model-' + width + '.png') });
      assert.equal(rendered.before.contextLost, false); assert.ok(rendered.calls > 0 && rendered.triangles > 0 && rendered.sampledColors > 8 && rendered.sampledOpaquePixels > 0, 'model produces visible, nonuniform WebGL pixels'); assert.equal(rendered.readError, 0);
      assert.equal(layout.documentWidth <= layout.viewportClientWidth, true, 'no horizontal overflow at ' + width);
      assert.equal(await page.locator('.gmz').evaluate(root => getComputedStyle(root).overflowY), 'visible');
    }
    // Hold a real network response while the learner edits; stale feedback must not add points or help flags.
    mode = 'delay'; await submit('Ein neuer Text vor der Antwort des Dienstes.'); await page.waitForFunction(() => fixtureState()?.data.history.at(-1)?.status === 'pending');
    // Persisting the pending request precedes the network call. Wait for the
    // actual held response instead of assuming it arrived within 50 ms.
    const heldDeadline = Date.now() + 8000;
    while (!held && Date.now() < heldDeadline) await new Promise(resolve => setTimeout(resolve, 25));
    assert.ok(held, 'mock response is held');
    await page.locator('[data-answer]').fill('Ein inzwischen veränderter Text.'); const beforeStale = (await state()).data.aspects;
    held(); held = null; await waitStatus('done'); saved = await state(); assert.equal(saved.data.history.at(-1).applied, false); assert.deepEqual(saved.data.aspects, beforeStale);
    assert.equal(await page.locator('[data-stale]').isVisible(), true);
    const beforeCached = paid.length, cachedId = saved.data.history.at(-1).requestId;
    await page.locator('[data-answer]').fill('Ein neuer Text vor der Antwort des Dienstes.');
    assert.equal(await page.locator('[data-check]').innerText(), 'Vorhandene Rückmeldung übernehmen');
    assert.equal(await page.locator('[data-check]').isEnabled(), true);
    await page.locator('[data-check]').click();
    await page.waitForFunction(requestId => fixtureState()?.data.history.find(h => h.requestId === requestId)?.applied === true, cachedId);
    assert.equal(paid.length, beforeCached, 'cached adoption makes no paid service call');
    assert.equal((await state()).scores.slice(7).filter(color => color !== 'gray').length, 12);
    assert.equal((await state()).scores[19], 'gray', 'reserved twentieth Edulo slot stays unused');
    assert.equal(await page.locator('[data-check]').isDisabled(), true);
    mode = 'unknown'; await submit('Eine weitere Erklärung für die noch laufende Prüfung.'); await waitStatus('unknown');
    const count = paid.length, requestId = (await state()).data.history.at(-1).requestId;
    assert.equal(await page.locator('[data-check]').isDisabled(), true);
    await page.reload(); await page.waitForFunction(() => document.querySelector('[data-recover]') && !document.querySelector('[data-recover]').hidden);
    await page.locator('[data-recover]').click(); await waitStatus('done');
    assert.equal(paid.length, count); assert.equal(reads.at(-1).path, '/result'); assert.equal(reads.at(-1).body.requestId, requestId);
    await page.evaluate(() => { window.fixtureRequestTimeout = 1000; });
    mode = 'timeout'; await submit('Diese Prüfung wird beim ersten Abruf zeitlich unterbrochen.'); await waitStatus('unknown');
    assert.equal(await page.locator('[data-check]').isDisabled(), true); const timeoutCount = paid.length;
    held(); held = null; await page.locator('[data-recover]').click(); await waitStatus('done'); assert.equal(paid.length, timeoutCount);
    await page.getByText('Deine bisherigen Erklärungen', { exact: true }).click();
    await page.locator('[data-history] details summary').first().click();
    assert.equal(await page.locator('[data-history] img,[data-history] script').count(), 0);
    assert.equal(await page.evaluate(() => !!window.injected), false);
    assert.deepEqual(errors, [], 'no browser runtime exceptions');
    assert.equal(D.valid((await state()).data), true, 'persisted end state satisfies domain validation');
    const evidence = { passed: true, browserEngine: engine, browserVersion: browser.version(), hostPlatform: process.platform,
      validationScope: engine === 'webkit' ? 'Local Playwright WebKit test; this does not establish Safari or iPad behavior.' : 'Local Playwright Chromium/Edge test.',
      widths: [390, 920, 1440], paidMockRequests: paid.length, realPaidRequests: 0, readMockRequests: reads.length, webgl, runtimeErrors: errors, consoleDiagnostics, renderDiagnostics, screenshots: [390, 920, 1440].map(w => 'widget-' + w + '.png') };
    fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
    await context.close();
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
