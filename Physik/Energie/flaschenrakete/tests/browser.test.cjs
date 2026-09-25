/* Browser QA for the standalone Flaschenrakete widget.  It deliberately uses
   the built HTML, a local HTTP server and Edge's packaged Playwright channel. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
let chromium;
try { ({chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }

const dir = path.resolve(__dirname, '..');
const output = path.join(dir, 'widget.html');
const artifacts = path.join(__dirname, 'artifacts');
fs.mkdirSync(artifacts, {recursive: true});
require(path.join(dir, 'build.cjs'));
const html = fs.readFileSync(output);
const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(html);
});

async function waitPhase(page, value, timeout = 7000) {
  await page.waitForFunction(phase => document.querySelector('[data-simulation]')?.dataset.phase === phase, value, {timeout});
}
async function chooseAll(page, values) {
  const selects = page.locator('select[data-cloze]');
  assert.equal(await selects.count(), 6, 'six cloze selectors are available');
  for (let index = 0; index < values.length; index++) await selects.nth(index).selectOption({label: values[index]});
}
async function tapAssign(page, slot, energy) {
  await page.locator(`[data-token="${energy}"]`).first().click();
  await page.locator(`[data-slot="${slot}"]`).click();
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true});
    const page = await browser.newPage({viewport: {width: 920, height: 768}, hasTouch: true});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.locator('[data-pump-button]').waitFor();
    assert.equal(await page.locator('[data-packet-id]').count(),5,'five stable energy packets');
    assert.equal(await page.locator('[data-energy-group]').textContent().then(t=>/chemisch|kinetisch|thermisch|Lage/.test(t)),false,'scene has no visible energy names');
    await page.screenshot({path: path.join(artifacts, 'overview-920x768.png'), fullPage: false});

    await page.locator('[data-energy-button]').click();
    await page.evaluate(()=>{window.originalPackets=[...document.querySelectorAll('[data-packet-id]')];window.trace=[];const capture=()=>{const p=originalPackets[0];trace.push({t:performance.now(),x:+p.dataset.x,y:+p.dataset.y,form:p.dataset.form});if(document.querySelector('[data-simulation]').dataset.phase==='pumping')requestAnimationFrame(capture);};window.capturePacket=capture;});
    const original=await page.locator('[data-packet-id="0"]').evaluate(e=>({x:+e.dataset.x,y:+e.dataset.y}));
    assert(original.x>=139&&original.x<=175&&original.y>=210&&original.y<=240,'initial packet on upper-arm muscle');
    await page.screenshot({path:path.join(artifacts,'packets-muscle.png')});
    await page.locator('[data-pump-button]').click();await page.evaluate(()=>capturePacket());
    await waitPhase(page,'ready');
    const trace=await page.evaluate(()=>trace);
    assert(trace.some(p=>p.form==='kinetic'&&p.x<230),'conversion in muscle/arm');
    assert(trace.some(p=>p.form==='thermal'&&p.x>=236&&p.x<=251&&p.y>260&&p.y<308),'thermal conversion inside pump');
    assert(trace.some(p=>p.form==='thermal'&&p.x>300&&p.x<500&&p.y>285),'same packet follows hose');
    assert(trace.some(p=>p.form==='thermal'&&p.x>530&&p.y<200),'same packet arrives in air');
    for(let i=1;i<trace.length;i++)assert(Math.hypot(trace[i].x-trace[i-1].x,trace[i].y-trace[i-1].y)<80,'no teleport between route segments');
    assert(await page.evaluate(()=>originalPackets.every((p,i)=>p===document.querySelectorAll('[data-packet-id]')[i])),'same DOM packets throughout stroke');
    await page.screenshot({path:path.join(artifacts,'packet-in-bottle.png')});
    await page.locator('[data-reset-button]').click();
    await page.locator('[data-energy-button]').click();

    // Five rapid clicks must queue exactly five strokes and pass through all flight states.
    await page.locator('[data-pump-button]').click({clickCount: 5});
    await waitPhase(page, 'pumping');
    await page.waitForFunction(() => document.querySelector('[data-packet-id="0"]')?.dataset.form === 'kinetic');
    const firstPacket=await page.locator('[data-packet-id="0"]').evaluate(e=>({id:e.dataset.packetId,form:e.dataset.form,x:+e.dataset.x,y:+e.dataset.y}));
    assert.equal(firstPacket.id,'0'); assert.equal(firstPacket.form,'kinetic'); assert(firstPacket.x>118,'first packet moves from the arm');
    await waitPhase(page, 'launching');
    assert.equal(await page.locator('[data-simulation]').getAttribute('data-strokes'), '5');
    await page.screenshot({path: path.join(artifacts, 'powered-flight-920.png'), fullPage: true});
    await waitPhase(page, 'apex');
    await waitPhase(page, 'falling');
    await waitPhase(page, 'landed');

    // Reset cancels both a live pump animation and a live flight animation.
    await page.locator('[data-reset-button]').click();
    await page.locator('[data-pump-button]').click();
    await waitPhase(page, 'pumping');
    await page.locator('[data-reset-button]').click();
    await waitPhase(page, 'ready');
    assert.equal(await page.locator('[data-simulation]').getAttribute('data-strokes'), '0');
    await page.locator('[data-pump-button]').click({clickCount: 5});
    await waitPhase(page, 'launching');
    await page.locator('[data-reset-button]').click();
    await waitPhase(page, 'ready');

    // Toggle energy visibility, including persistence across a standalone reload.
    await page.locator('[data-energy-button]').tap();
    assert.equal(await page.locator('[data-energy-group]').evaluate(element => getComputedStyle(element).display !== 'none'), true);
    await page.locator('[data-energy-button]').tap();
    assert.equal(await page.locator('[data-energy-group]').evaluate(element => getComputedStyle(element).display !== 'none'), false);
    await page.locator('[data-energy-button]').tap();
    await page.waitForTimeout(350);
    await page.reload();
    await page.locator('[data-pump-button]').waitFor();
    assert.equal(await page.locator('[data-energy-group]').evaluate(element => getComputedStyle(element).display !== 'none'), true, 'standalone energy setting survives reload');

    const answers = ['chemische Energie', 'kinetische Energie', 'thermische Energie', 'kinetische Energie', 'Lageenergie', 'kinetische Energie'];
    await page.locator('[data-navigate=cloze]:visible').click();
    const options = await page.locator('select[data-cloze]').first().locator('option').evaluateAll(nodes => nodes.slice(1).map(node => node.value));
    assert.deepEqual(options, ['kinetische Energie', 'Lageenergie', 'elastische Energie', 'thermische Energie', 'chemische Energie', 'Kernenergie', 'Licht', 'elektrische Energie', 'magnetische Energie']);
    // Exercise every dropdown: first an incorrect full submission, then its correction.
    await chooseAll(page, Array(6).fill('Licht'));
    await page.locator('[data-check="cloze"]').click();
    assert.match(await page.locator('.rocket-feedback').first().textContent(), /richtig|markierten/i);
    await chooseAll(page, answers);
    await page.locator('[data-check="cloze"]').click();
    assert.match(await page.locator('.rocket-feedback').first().textContent(), /Alles richtig/i);

    await page.locator('[data-navigate=experiment]:visible').click();await page.locator('[data-navigate=diagram]:visible').click();
    // Tapping replaces matching energy arrows; alternating arrows and converter boxes solve the chain.
    await page.locator('[data-token="Licht"]').first().tap();
    await page.locator('[data-slot="basic:0"]').tap();
    await page.locator('[data-token="chemische Energie"]').first().tap();
    await page.locator('[data-slot="basic:0"]').tap();
    assert.match(await page.locator('[data-slot="basic:0"]').textContent(), /chemische Energie/);
    assert.equal(await page.locator('[data-token=\"Muskel\"]').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 240, 202)','DynaMot yellow converter box');
    assert(await page.locator('[data-token=\"chemische Energie\"]').first().evaluate(e=>getComputedStyle(e).clipPath.includes('polygon')),'DynaMot energy arrow silhouette');
    const chain=['chemische Energie','Muskel','kinetische Energie','Luftpumpe','thermische Energie','Flasche','kinetische Energie','Flasche','Lageenergie','Flasche','kinetische Energie'];
    // Drag succeeds, pointer cancellation and lost capture do not assign a value.
    await page.setViewportSize({width: 920, height: 2000});
    const token = page.locator('[data-token="chemische Energie"]').last();
    const target = page.locator('[data-slot="basic:0"]');
    await token.scrollIntoViewIfNeeded();
    const a = await token.boundingBox();
    assert(a, 'drag source is visible');
    const b = await target.boundingBox();
    assert(b.y+b.height<2000, 'source and target both in viewport for real drag');
    assert(b, 'drag target is visible');
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, {steps: 4});
    await page.mouse.up();
    assert.match(await target.textContent(), /chemische Energie/);
    const canceled = page.locator('[data-slot="basic:2"]');
    const c=await canceled.boundingBox();
    for(const event of ['pointercancel','lostpointercapture']){
      await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();
      await token.dispatchEvent(event,{pointerId:1,isPrimary:true});
      await page.mouse.move(c.x+c.width/2,c.y+c.height/2,{steps:3});await page.mouse.up();
      assert.match(await canceled.textContent(),/Ablegen/,event+' aborts even when released over a valid energy slot');
    }
    await token.click();await page.keyboard.press('Escape');await canceled.click();
    assert.match(await canceled.textContent(),/Ablegen/,'Escape clears selection');
    await token.click();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await canceled.click();
    assert.match(await canceled.textContent(),/Ablegen/,'blur clears selection');
    // A converter is draggable too, and can be replaced by a real touch tap.
    const converter=page.locator('[data-token="Flasche"]').last();const deviceTarget=page.locator('[data-slot="basic:1"]');
    await converter.scrollIntoViewIfNeeded();const d=await converter.boundingBox(),e=await deviceTarget.boundingBox();
    await page.mouse.move(d.x+d.width/2,d.y+d.height/2);await page.mouse.down();await page.mouse.move(e.x+e.width/2,e.y+e.height/2,{steps:4});await page.mouse.up();
    assert.match(await deviceTarget.textContent(),/Flasche/);
    await page.locator('[data-token="Muskel"]').last().tap();await deviceTarget.tap();
    assert.match(await deviceTarget.textContent(),/Muskel/,'new touch selection is not swallowed after dragging');

    for (let i = 1; i < chain.length; i++) await tapAssign(page, `basic:${i}`, chain[i]);
    await tapAssign(page,'basic:0',chain[0]);
    await page.locator('[data-check="basic"]').click();
    assert.equal(await page.locator('[data-flow-branch]').count(),6);
    for(let i=0;i<6;i++){
      await page.locator('[data-token="'+(i===3?'kinetische Energie':'thermische Energie')+'"]').click();
      await page.locator('[data-branch="'+i+'"]').click();
    }
    assert.match(await page.locator('[data-page=experiment] [data-section-score=cloze]').textContent(), /6 von 6 Punkte/);assert.match(await page.locator('[data-page=experiment] [data-section-score=diagram]').textContent(), /12 von 12 Punkte/);
    await page.waitForTimeout(350); await page.reload(); await page.locator('[data-navigate=diagram]:visible').click();await page.locator('[data-diagram-card]').waitFor();
    assert.match(await page.locator('[data-page=experiment] [data-section-score=cloze]').textContent(), /6 von 6 Punkte/);assert.match(await page.locator('[data-page=experiment] [data-section-score=diagram]').textContent(), /12 von 12 Punkte/);

    await page.setViewportSize({width: 920, height: 768});
    await page.locator('[data-shared-diagram]').scrollIntoViewIfNeeded();
    await page.screenshot({path: path.join(artifacts, 'learning-920x768.png'), fullPage: false});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no desktop horizontal overflow');
    await page.locator('[data-navigate=experiment]:visible').click();
    await page.setViewportSize({width: 390, height: 844});
    await page.locator('[data-energy-button]').tap();
    await page.locator('.edulo-work').evaluate(element => { element.scrollTop = 0; });
    await page.screenshot({path: path.join(artifacts, 'learning-mobile-390x844.png'), fullPage: false});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no mobile horizontal overflow');
    assert.deepEqual(errors, []);
    console.log('PASS: continuous packet identity/path/conversions, rapid pump/reset/flight, 9 energy options, DynaMot arrows/boxes and six qualitative branches, real energy+converter drag/touch, cancel/lostcapture/Escape/blur, 18-criterion reload, responsive screenshots.');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
