// Real widget in a local mock Edulo parent; this is not a live Edulo server test.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const dir=path.resolve(__dirname,'..'),kit=path.resolve(dir,'../../../tools/edulo');
const suite=fs.readFileSync(path.join(kit,'tests/run.cjs'),'utf8');
const fixture=vm.runInNewContext('const exportedMethods=null;'+suite.slice(suite.indexOf('function fixture(mode)'),suite.indexOf('\nconst server ='))+';fixture');
const html=fs.readFileSync(path.join(dir,'widget.html'),'utf8');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url==='/widget'?html:fixture(req.url==='/corrupt'?'corrupt':'normal'));});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1024,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.evaluate(()=>document.getElementById('mount').innerHTML='<iframe src="/widget" style="width:920px;height:700px;border:0"></iframe>');
 let frame=page.frames()[1];await frame.locator('[data-navigate=cloze]:visible').click().catch(async e=>{console.error('EMBEDDED STATUS',await frame.locator('[data-storage]').textContent(),errors);throw e;});await frame.waitForSelector('[data-cloze="0"]');await frame.locator('[data-cloze="0"]').selectOption('Kernenergie');await frame.locator('[data-check="cloze"]').click();await frame.locator('[data-cloze="0"]').selectOption('chemische Energie');await frame.locator('[data-check="cloze"]').click();
 await page.waitForFunction(()=>document.getElementById('e1_text_input').value.startsWith('EDULO2:')&&content.clozeInputs[0].helped==='true');
 const stored=await page.locator('#e1_text_input').inputValue();assert(await page.locator('#e2').isHidden());assert(await page.locator('#footerButtons').isHidden());assert.equal(await page.evaluate(()=>localStorage.getItem('schule-edulo:flaschenrakete')),null);
 await frame.evaluate(()=>location.reload());frame=page.frames()[1];await frame.locator('[data-navigate=cloze]:visible').click().catch(async e=>{console.error('EMBEDDED STATUS',await frame.locator('[data-storage]').textContent(),errors);throw e;});await frame.waitForSelector('[data-cloze="0"]');assert.equal(await frame.locator('[data-cloze="0"]').inputValue(),'chemische Energie');assert(await frame.locator('[data-cloze="0"]').isDisabled());assert.equal(await page.locator('#e1_text_input').inputValue(),stored,'load must not alter E1');
 const legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/v1-progress.json'),'utf8').replace(/^\uFEFF/,''));
 const legacyRaw='EDULO2:'+Buffer.from(JSON.stringify(legacy),'utf8').toString('base64');
 await page.goto(base);await page.evaluate(raw=>{document.getElementById('e1_text_input').value=raw;document.getElementById('mount').innerHTML='<iframe src="/widget" style="width:920px;height:700px"></iframe>';},legacyRaw);
 frame=page.frames()[1];await frame.locator('[data-navigate=cloze]:visible').click().catch(async e=>{console.error('EMBEDDED STATUS',await frame.locator('[data-storage]').textContent(),errors);throw e;});await frame.waitForSelector('[data-cloze="0"]');assert.equal(await page.locator('#e1_text_input').inputValue(),legacyRaw,'migration on load must be read-only');
 assert.equal(await frame.locator('[data-cloze="0"]').inputValue(),'chemische Energie');assert.deepEqual(await frame.locator('[data-legend-labels-button]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-pressed'))),['false','false','false','false'],'old saved states default to all four hidden legend words');
 await frame.locator('[data-navigate=experiment]:visible').click();await frame.locator('[data-energy-button]').click();
 await page.waitForFunction(raw=>document.getElementById('e1_text_input').value!==raw,legacyRaw);
 const migratedRaw=await page.locator('#e1_text_input').inputValue();const migrated=JSON.parse(Buffer.from(migratedRaw.slice(7),'base64').toString('utf8'));
 assert.equal(migrated.version,1);assert.equal(migrated.data.learning.version,3);assert.deepEqual(migrated.data.learning.legacyV1,legacy.data.learning);assert.deepEqual(migrated.scores,legacy.scores,'earned scores preserved');
 await frame.evaluate(()=>location.reload());frame=page.frames()[1];await frame.locator('[data-navigate=cloze]:visible').click().catch(async e=>{console.error('EMBEDDED STATUS',await frame.locator('[data-storage]').textContent(),errors);throw e;});await frame.waitForSelector('[data-cloze="0"]');assert.equal(await page.locator('#e1_text_input').inputValue(),migratedRaw);
 await page.goto(base+'/corrupt');await page.evaluate(()=>document.getElementById('mount').innerHTML='<iframe src="/widget"></iframe>');frame=page.frames()[1];await frame.locator('[data-retry]').waitFor({state:'visible'});assert.equal(await page.locator('#e1_text_input').inputValue(),'foreign-data');assert(await frame.locator('[data-controls]').evaluate(el=>el.disabled));assert.equal(await page.evaluate(()=>localStorage.getItem('schule-edulo:flaschenrakete')),null);
 assert.deepEqual(errors,[]);console.log('PASS: widget iframe E1/E2 roundtrip, yellow after error, restored answers, readonly load, hidden fields/footer, no local fallback, corrupt state protected, V1 migration read-only until edit, legacy preserved, points retained.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

