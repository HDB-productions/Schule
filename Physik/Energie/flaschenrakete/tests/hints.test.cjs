// Focused browser QA for the six staged cloze hints in the built standalone widget.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
let chromium;
try { ({chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }

const dir = path.resolve(__dirname, '..');
const key = 'schule-edulo:flaschenrakete';
const html = fs.readFileSync(path.join(dir, 'widget.html'));
const artifacts = path.join(__dirname, 'artifacts');
const {rocketLearningFresh, rocketLearningMigrate} = require(path.join(dir, 'learning.js'));
const suite = fs.readFileSync(path.resolve(dir, '../../../tools/edulo/tests/run.cjs'), 'utf8');
const fixture = vm.runInNewContext('const exportedMethods=null;' + suite.slice(suite.indexOf('function fixture(mode)'), suite.indexOf('\nconst server =')) + ';fixture');
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(req.url === '/frame' ? fixture('normal') : html);
});
const decode = raw => JSON.parse(Buffer.from(raw.slice('EDULO2:'.length), 'base64').toString('utf8'));

async function state(page) {
  await page.waitForFunction(k => !!localStorage.getItem(k), key);
  return page.evaluate(k => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem(k).slice(7)), c => c.charCodeAt(0)))).data.learning, key);
}
async function open(page, i) {
  await page.locator(`[data-cloze-help="${i}"]`).tap();
  await page.locator('.rocket-hint-dialog[open]').waitFor();
}
async function close(page, i) {
  await page.locator('.rocket-hint-dialog [data-close-help]').first().click();
  await page.locator('.rocket-hint-dialog').waitFor({state:'detached'});
  assert.equal(await page.evaluate(index => document.activeElement?.dataset.clozeHelp === String(index), i), true, 'focus returns to the matching help button');
}
async function viewportCheck(page) {
  const bounds = await page.locator('.rocket-hint-dialog').boundingBox();
  const size = page.viewportSize();
  assert(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= size.width + 1 && bounds.y + bounds.height <= size.height + 1, 'dialog remains inside viewport');
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true});
    const page = await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    await page.goto(base + '/widget');
    await page.locator('[data-navigate=cloze]:visible').click();await page.locator('[data-cloze-help="0"]').waitFor();
    assert.equal(await page.locator('.rocket-cloze-help').count(), 6);
    assert.equal(await page.locator('.rocket-story .rocket-hint, .rocket-story .rocket-hintrow').count(), 0, 'no former inline hint row');
    assert.equal(await page.locator('.rocket-story').evaluate(story => [...story.querySelectorAll('[data-cloze]')].every((select, i) => select.closest('label')?.nextElementSibling?.matches(`[data-cloze-help="${i}"]`))), true, 'each help button immediately follows its labeled select');
    assert.equal(await page.evaluate(k => localStorage.getItem(k), key), null, 'fresh state has not been written');

    for (let i = 0; i < 6; i++) {
      const original = await page.locator(`[data-cloze="${i}"]`).inputValue();
      await page.locator(`[data-cloze-help="${i}"]`).scrollIntoViewIfNeeded();
      const scrollBefore = await page.evaluate(() => [scrollY, document.querySelector('.edulo-work')?.scrollTop || 0]);
      await open(page, i);
      const scrollAfterOpen = await page.evaluate(() => [scrollY, document.querySelector('.edulo-work')?.scrollTop || 0]);
      assert(scrollAfterOpen.every((x, n) => Math.abs(x - scrollBefore[n]) <= 1), 'opening dialog does not scroll the page');
      await viewportCheck(page);
      for (let level = 1; level <= ([4,3,3,3,3,4][i]); level++) {
        assert.match(await page.locator('.rocket-hint-stage').textContent(), new RegExp(`Hinweis ${level} von ${[4,3,3,3,3,4][i]}`));
        assert.equal(await page.locator('.rocket-hint-steps p').count(), level);
        assert.equal(await page.locator('.rocket-hint-steps strong, .rocket-hint-steps b, .rocket-hint-steps mark').count(), 0, 'no highlighted option');
        if (level < ([4,3,3,3,3,4][i])) await page.locator('[data-more-help]').click();
      }
      assert.equal(await page.locator('[data-more-help]').count(), 0, 'last stage has no more button');
      assert.match(await page.locator('.rocket-hint-dialog-actions').textContent(), /Du entscheidest/);
      assert.equal(await page.locator(`[data-cloze="${i}"]`).inputValue(), original, 'help does not fill or change answer');
      await close(page, i);
      const scrollAfterClose = await page.evaluate(() => [scrollY, document.querySelector('.edulo-work')?.scrollTop || 0]);
      assert(scrollAfterClose.every((x, n) => Math.abs(x - scrollBefore[n]) <= 1), 'more hints, close, and focus return do not scroll the page');
      assert.equal((await state(page)).hintLevels[i], [4,3,3,3,3,4][i]);
    }
    await open(page, 0);
    await page.waitForTimeout(200);
    await page.screenshot({path:path.join(artifacts,'hints-mobile.png'),fullPage:false});
    await viewportCheck(page);
    await page.keyboard.press('Escape');
    await page.locator('.rocket-hint-dialog').waitFor({state:'detached'});
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.clozeHelp), '0', 'Escape restores focus');
    await open(page, 1);
    await page.mouse.click(2, 2);
    await page.locator('.rocket-hint-dialog').waitFor({state:'detached'});
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.clozeHelp), '1', 'outside click restores focus');
    await page.waitForTimeout(400);
    await page.reload();
    await page.locator('[data-navigate=cloze]:visible').click();await page.locator('[data-cloze-help="0"]').waitFor();
    assert.deepEqual((await state(page)).hintLevels, [4,3,3,3,3,4]);
    await open(page, 3);
    assert.match(await page.locator('.rocket-hint-stage').textContent(), /Hinweis 3 von 3/, 'reopen resumes the unlocked level');
    await close(page, 3);

    await page.locator('[data-cloze="0"]').selectOption('chemische Energie');
    await page.locator('[data-check="cloze"]').click();
    await page.waitForTimeout(400);
    assert.equal(decode(await page.evaluate(k => localStorage.getItem(k), key)).scores[0], 'yellow', 'a correct answer after help earns yellow');

    const fresh = rocketLearningFresh();
    assert.deepEqual(fresh.hintLevels, Array(6).fill(0));
    for (const version of [1, 2]) {
      const old = rocketLearningFresh(); old.version = version; old.hints[1] = true; old.hints[4] = true;
      if (version === 1) { old.drafts.basic = Array(6).fill(''); old.drafts.losses = Array(8).fill(''); }
      else { old.drafts.losses.main = Array(11).fill(''); old.drafts.losses.branches = Array(2).fill(''); }
      delete old.hintLevels;
      assert.deepEqual(rocketLearningMigrate(old).hintLevels, [0,1,0,0,1,0], `v${version} booleans migrate to level one`);
    }
    const missing = rocketLearningFresh(); missing.hints[2] = true; delete missing.hintLevels;
    assert.deepEqual(rocketLearningMigrate(missing).hintLevels, [0,0,1,0,0,0], 'v3 without levels falls back to booleans');

    const narrow = await browser.newPage({viewport:{width:390,height:400},hasTouch:true});
    await narrow.goto(base + '/frame');
    await narrow.evaluate(() => document.getElementById('mount').innerHTML = '<iframe src="/widget" style="width:390px;height:400px;border:0"></iframe>');
    const frame = narrow.frameLocator('iframe');
    await frame.locator('[data-navigate=cloze]:visible').click();await frame.locator('[data-cloze-help="2"]').tap();
    await frame.locator('.rocket-hint-dialog[open]').waitFor();
    for (let step=1; step<3; step++) await frame.locator('[data-more-help]').click();
    const box = await frame.locator('.rocket-hint-dialog').boundingBox();
    assert(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= 391 && box.y + box.height <= 401, 'fourth hint fits short 390x400 iframe viewport');
    assert.equal(await frame.locator('.rocket-hint-dialog').evaluate(d => getComputedStyle(d).overflowY), 'auto', 'short dialog allows internal scrolling');
    await narrow.close();
    assert.deepEqual(errors, []);
    console.log('PASS: six staged dialogs, close/Escape/outside focus, persisted levels, yellow after help, v1/v2/v3 migration, mobile and short iframe bounds.');
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
