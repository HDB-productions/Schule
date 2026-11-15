// Browser and real worker/ledger together; synthetic local data, no external API.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const {createWorker,FeedbackBudget}=await import(process.env.EDULO_TEST_WORKER_BUNDLE?pathToFileURL(path.resolve(process.env.EDULO_TEST_WORKER_BUNDLE)).href:'./worker.mjs');
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
class Storage {
  data=new Map();queue=Promise.resolve();
  async transaction(fn){const before=this.queue;let release;this.queue=new Promise(r=>release=r);await before;const copy=structuredClone(this.data);try{const result=await fn({get:async k=>structuredClone(copy.get(k)),put:async(k,v)=>copy.set(k,structuredClone(v))});this.data=copy;return result;}finally{release();}}
}
test('compact roster works with real worker authorization, migration, draft binding, corrections and whole-class actions', {timeout:60000},async()=>{
  const uid='ab-123456-abcdef-789012',freshUid='cd-123456-abcdef-789012',assignedUid='ef-123456-abcdef-789012',token='synthetic-local-administration-token-only';
  const accounts={[uid]:{name:'Testperson 8 G3 2026 2027',totalGrantedEuroMicros:500000,weeklyLimitEuroMicros:100000}};
  for(let i=0;i<40;i++)accounts['xy-'+String(i).padStart(6,'0')+'-abcdef-789012']={name:'Beispiel '+String(i+1).padStart(2,'0'),className:'8G3',schoolYear:i===0?'2025/2026':'2026/2027',totalGrantedEuroMicros:500000,weeklyLimitEuroMicros:100000};
  const env={ADMIN_UI_TOKEN:token,OPENAI_API_KEY:'synthetic-never-used',ALLOWED_ORIGINS:'ionic://localhost',ACCOUNTS_JSON:JSON.stringify(accounts),PRICE_CONFIG_JSON:JSON.stringify({inputNanoUsdPerToken:100,cachedInputNanoUsdPerToken:10,outputNanoUsdPerToken:500,euroMicrosPerUsd:900000,version:'synthetic'}),LIMITS_JSON:JSON.stringify({globalLifetimeLimitEuroMicros:100000000,globalWeeklyLimitEuroMicros:50000000}),FEEDBACK_LIMITER:{limit:async()=>({success:true})}};
  const object=new FeedbackBudget({storage:new Storage()},env,{upstreamFetch:()=>assert.fail('Administration must never call OpenAI')});
  env.FEEDBACK_BUDGET={idFromName:n=>n,get:()=>({fetch:r=>object.fetch(r)})};
  const worker=createWorker();let origin;
  const server=http.createServer(async(req,res)=>{
    try{let body='';for await(const chunk of req)body+=chunk;const result=await worker.fetch(new Request(origin+req.url,{method:req.method,headers:req.headers,...(body?{body}:{})}),env);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}
    catch(error){res.writeHead(500);res.end(String(error));}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;
  const list=async()=>{const response=await worker.fetch(new Request(origin+'/admin/manage',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,Authorization:'Bearer '+token},body:JSON.stringify({action:'list'})}),env);assert.equal(response.status,200);return response.json();};
  let browser;
  try{
    browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const saved=()=>page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Änderung gespeichert.'));
    const confirm=async()=>{await page.locator('#confirm-commit').click();await saved();};
    const row=name=>page.locator('.account').filter({has:page.locator('.account-name').getByText(name,{exact:true})});
    await page.goto(origin+'/admin');assert.deepEqual(errors,[],'published inline script must initialize before login');await page.locator('#password').fill(token);await page.locator('#login-form button').click();await page.locator('#dashboard').waitFor({state:'visible'});
    assert.equal(await page.locator('.account').count(),41);assert(await page.evaluate(()=>[...document.querySelectorAll('.account')].filter(a=>{const r=a.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}).length)>=7,'at least seven full student rows fit initially');
    const group=page.locator('.class-group').filter({has:page.getByRole('checkbox',{name:'Ganze Klasse 8G3 · 2026/2027 auswählen',exact:true})});
    await group.locator('.group-toggle').click();assert.equal(await group.locator('.account:visible').count(),0);assert.equal(await page.locator('#selected-count').innerText(),'0','folding does not select students');
    await group.locator('.group-head input').check();assert.equal(await page.locator('#selected-count').innerText(),'39');assert.equal(await group.locator('.account:visible').count(),0,'selecting a closed class keeps it closed');
    await group.locator('.group-head input').uncheck();await group.locator('.group-toggle').press('Enter');assert.equal(await group.locator('.account:visible').count(),39);assert.equal(await group.locator('.group-toggle').getAttribute('aria-expanded'),'true');
    await page.getByText('Klassenliste importieren / alte Zuordnungen prüfen',{exact:true}).click();await page.locator('#preview-legacy').click();
    assert.equal((await list()).accounts.find(a=>a.uid===uid).name,'Testperson 8 G3 2026 2027','preview is read-only');
    assert.equal(await page.locator('#import-preview input:checked').count(),0);await page.getByRole('button',{name:'Alle Vorschläge auswählen'}).click();await page.locator('#commit-import').click();await confirm();
    let snapshot=await list();let a=snapshot.accounts.find(a=>a.uid===uid);assert.equal(a.name,'Testperson');assert.equal(a.className,'8G3');assert.equal(a.schoolYear,'2026/2027');assert.equal(a.budget.remainingEuroMicros,500000);assert.equal(a.legacyName,'Testperson 8 G3 2026 2027');
    await page.locator('#csv-text').fill('Edulo-ID;Name;Klasse;Schuljahr\n'+freshUid+';Neues Testkonto;8 G3;2026/27\n;Vorbereitete Testperson;8 G3;2026/27');await page.locator('#import-amount').fill('0,25');await page.locator('#preview-import').click();await page.locator('#commit-import').click();assert.match(await page.locator('#confirm-text').innerText(),/1 neue Konten, 1 vorbereitet/);await confirm();
    snapshot=await list();assert.equal(snapshot.drafts.length,1);assert.equal(snapshot.accounts.find(a=>a.uid===freshUid).budget.remainingEuroMicros,250000);
    await row('Vorbereitete Testperson').getByRole('button',{name:'Bearbeiten'}).click();const dialog=page.locator('#edit-dialog');await dialog.locator('[name=uid]').fill(assignedUid);await dialog.getByRole('button',{name:'Edulo-ID zuweisen'}).click();await saved();assert.equal((await list()).drafts.length,0);
    await row('Testperson').getByRole('button',{name:'Bearbeiten'}).click();await dialog.locator('[name=schoolYear]').fill('2026/27');await dialog.getByRole('button',{name:'Zuordnung speichern'}).click();await saved();
    await row('Testperson').getByRole('button',{name:'Bearbeiten'}).click();await dialog.locator('[name=amount]').fill('0,05');await dialog.locator('[name=reason]').fill('Testkorrektur einer Fehlbuchung');await dialog.getByRole('button',{name:'Abzug prüfen'}).click();await confirm();assert.equal((await list()).accounts.find(a=>a.uid===uid).budget.remainingEuroMicros,450000);
    await page.getByRole('checkbox',{name:'Ganze Klasse 8G3 · 2026/2027 auswählen',exact:true}).check();await page.locator('#bulk summary').click();await page.locator('#bulk-freeze').click();assert.match(await page.locator('#confirm-text').innerText(),/42 Personen/);await confirm();
    snapshot=await list();assert.equal(snapshot.accounts.filter(a=>a.frozen).length,42);assert.equal(snapshot.accounts.find(a=>a.name==='Beispiel 01').frozen,false);
    await page.locator('#bulk-form [name=className]').fill('9G3');await page.locator('#bulk-form [name=schoolYear]').fill('2027/28');await page.locator('#bulk-form button').click();await confirm();snapshot=await list();assert.equal(snapshot.accounts.find(a=>a.uid===uid).schoolYear,'2027/2028');assert.equal(snapshot.accounts.filter(a=>a.className==='9G3').length,42);
    await page.locator('#bulk-unfreeze').click();await confirm();assert.equal((await list()).accounts.filter(a=>a.frozen).length,0);
    await page.locator('#class-filter').selectOption(JSON.stringify(['9G3','2027/2028']));assert.equal(await page.locator('.account').count(),42);
    await page.locator('#add-to-class').click();const addDialog=page.locator('#add-dialog'),addForm=page.locator('#context-add-form');
    assert.equal(await addForm.locator('[name=className]').inputValue(),'9G3');assert.equal(await addForm.locator('[name=schoolYear]').inputValue(),'2027/2028');
    await addForm.locator('[name=amount]').fill('0,01');await addForm.locator('[name=weekly]').fill('0,20');
    for(const [id,name] of [['gh-123456-abcdef-789012','Zusatzperson Eins'],['ij-123456-abcdef-789012','Zusatzperson Zwei']]){
      await addForm.locator('[name=uid]').fill(id);await addForm.locator('[name=name]').fill(name);await addForm.getByRole('button',{name:'Person hinzufügen',exact:true}).click();await saved();
      assert(await addDialog.isVisible());assert.equal(await addForm.locator('[name=uid]').inputValue(),'');assert.equal(await addForm.locator('[name=name]').inputValue(),'');assert.equal(await addForm.locator('[name=className]').inputValue(),'9G3');assert.equal(await addForm.locator('[name=schoolYear]').inputValue(),'2027/2028');
      const created=(await list()).accounts.find(a=>a.uid===id);assert.equal(created.className,'9G3');assert.equal(created.schoolYear,'2027/2028');assert.equal(created.budget.remainingEuroMicros,10000);assert.equal(created.weeklyLimitEuroMicros,200000);
    }
    await page.locator('#close-add-dialog').click();const selectedGroup=page.locator('.class-group');await selectedGroup.locator('.group-toggle').click();await selectedGroup.locator('.class-add').click();assert(await addDialog.isVisible());assert.equal(await selectedGroup.locator('.account:visible').count(),0,'class add button does not expand or select the group');await page.locator('#close-add-dialog').click();await selectedGroup.locator('.group-toggle').click();
    if(process.env.WRITE_PREVIEWS==='1'){await fs.mkdir('.edulo-tools',{recursive:true});await page.locator('#bulk summary').click();for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.resolve('.edulo-tools/admin-classes-'+width+'.png'),fullPage:false});}}
    for(const width of [1440,920,390]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
    await page.locator('#logout').click();assert.equal(await page.locator('#accounts').innerText(),'');assert.equal(await page.locator('#confirm-text').innerText(),'');assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});assert.deepEqual(errors,[]);
  }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
});
