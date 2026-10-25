// Local browser smoke test; synthetic accounts and token, no real worker or payments.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {ADMIN_HTML} from './admin-page.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
test('administration uses exact euro amounts, safe text, RAM authentication and idempotent manual recovery',async()=>{
 const uid='aa-bbbbbb-cccccc-dddddd',calls=[],operations=new Map(),errors=[];
 const snapshot={accounts:[{uid,grantedEuroMicros:1000000,spentEuroMicros:250000,weeklyLimitEuroMicros:100000,blocked:false,budget:{remainingEuroMicros:750000,weeklyRemainingEuroMicros:80000,reservedEuroMicros:20000,weekKey:'2026-W43'}},{uid:'<img src=x onerror=alert(1)>',name:'',grantedEuroMicros:0,spentEuroMicros:0,weeklyLimitEuroMicros:1,blocked:true,budget:{remainingEuroMicros:0,weeklyRemainingEuroMicros:0,reservedEuroMicros:0,weekKey:'2026-W43'}}],global:{spentEuroMicros:250000,reservedEuroMicros:20000,weeklySpentEuroMicros:20000,weeklyReservedEuroMicros:20000,globalLifetimeLimitEuroMicros:5000000,globalWeeklyLimitEuroMicros:1000000}};
 let loseNext=false,holdNext=false,releaseHold;
 const server=http.createServer(async(req,res)=>{
  if(req.method==='GET'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(ADMIN_HTML);return;}
  assert.equal(req.url,'/admin/manage');assert.equal(req.headers.authorization,'Bearer synthetic-admin-password');assert.equal(req.headers.cookie,undefined);
  let raw='';for await(const c of req)raw+=c;const body=JSON.parse(raw);calls.push({raw,body});res.setHeader('Content-Type','application/json');
  if(body.action==='list'){res.end(JSON.stringify(snapshot));return;}
  assert.match(body.operationId,/^[a-f0-9-]{36}$/i);
  if(!operations.has(body.operationId)){
   if(body.action==='add')snapshot.accounts.push({uid:body.uid,name:body.name||'',grantedEuroMicros:body.amountEuroMicros,spentEuroMicros:0,weeklyLimitEuroMicros:body.weeklyLimitEuroMicros,blocked:false,budget:{remainingEuroMicros:body.amountEuroMicros,weeklyRemainingEuroMicros:Math.min(body.amountEuroMicros,body.weeklyLimitEuroMicros),reservedEuroMicros:0,weekKey:'2026-W43'}});
   if(body.action==='rename')snapshot.accounts.find(a=>a.uid===body.uid).name=body.name;
   if(body.action==='topup'){const a=snapshot.accounts.find(a=>a.uid===body.uid);a.grantedEuroMicros+=body.amountEuroMicros;a.budget.remainingEuroMicros+=body.amountEuroMicros;}
   if(body.action==='weekly')snapshot.accounts.find(a=>a.uid===body.uid).weeklyLimitEuroMicros=body.weeklyLimitEuroMicros;
   if(body.action==='limits'){snapshot.global.globalLifetimeLimitEuroMicros=body.globalLifetimeLimitEuroMicros;snapshot.global.globalWeeklyLimitEuroMicros=body.globalWeeklyLimitEuroMicros;}
   operations.set(body.operationId,JSON.stringify(snapshot));
  }
  if(holdNext){holdNext=false;await new Promise(r=>releaseHold=r);}
  res.end(operations.get(body.operationId));
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/admin/manage',async route=>{if(loseNext&&route.request().postDataJSON().action==='topup'){loseNext=false;await route.fetch();return route.abort('failed');}return route.continue();});
  async function login(){await page.locator('#password').fill('synthetic-admin-password');await page.locator('#login-form button').click();await page.waitForFunction(()=>!document.querySelector('#dashboard').hidden);}
  async function done(){await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Änderung gespeichert.'));}
  await page.goto(origin+'/admin');await login();assert.equal(await page.locator('#password').inputValue(),'');assert.equal(await page.locator('#accounts img').count(),0);assert.match(await page.locator('#accounts').innerText(),/<img src=x onerror=alert\(1\)>/);assert.match(await page.locator('#accounts').innerText(),/Gesperrt/);
  assert.deepEqual(await page.locator('.account-name').allTextContents(),['Ohne Namen','Ohne Namen'],'missing legacy names and explicit empty names remain compatible');
  assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});assert.equal(page.url(),origin+'/admin');
  for(const width of [390,920,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal page overflow at '+width);}
  await page.locator('#add-form [name=uid]').fill('zz-111111-222222-333333');await page.locator('#add-form [name=name]').fill('  Synthetisches Testkonto  ');await page.locator('#add-form [name=amount]').fill('0');await page.locator('#add-form [name=weekly]').fill('0,100001');await page.locator('#add-form button').click();await done();assert.equal(calls.at(-1).body.amountEuroMicros,0);assert.equal(calls.at(-1).body.weeklyLimitEuroMicros,100001);assert.equal(calls.at(-1).body.name,'Synthetisches Testkonto');assert.equal(await page.locator('.account-name').last().innerText(),'Synthetisches Testkonto');assert.equal(await page.locator('.account .uid').last().innerText(),'zz-111111-222222-333333');
  const first=page.locator('.account').first();
  await first.locator('[name=name]').fill(' <img src=x onerror=alert(1)> ');await first.getByRole('button',{name:'Name speichern',exact:true}).click();await done();assert.equal(calls.at(-1).body.action,'rename');assert.equal(calls.at(-1).body.name,'<img src=x onerror=alert(1)>');assert.equal(await first.locator('.account-name').innerText(),'<img src=x onerror=alert(1)>');assert.equal(await first.locator('img').count(),0);assert.equal(await first.locator('.uid').innerText(),uid);
  await first.locator('[name=name]').fill('   ');await first.getByRole('button',{name:'Name speichern',exact:true}).click();await done();assert.equal(calls.at(-1).body.name,'');assert.equal(await first.locator('.account-name').innerText(),'Ohne Namen');
  const nameCalls=calls.length;assert.equal(await first.locator('[name=name]').getAttribute('maxlength'),'120');await first.locator('.name-form').evaluate(form=>{form.elements.name.value='x'.repeat(121);form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});assert.equal(calls.length,nameCalls,'names longer than 120 trimmed characters never reach the API');assert(await page.locator('#status.error').isVisible());
  await first.locator('[name=name]').fill('Synthetische Zuordnung');await first.getByRole('button',{name:'Name speichern',exact:true}).click();await done();assert.equal(snapshot.accounts[0].name,'Synthetische Zuordnung');
  for(const invalid of ['0','0,0000001','1e2','1.000,00','9007199254.740992']){const count=calls.length;await first.locator('[name=amount]').fill(invalid);await first.getByRole('button',{name:'Aufladen',exact:true}).click();assert.equal(calls.length,count,'invalid euro rejected before API call: '+invalid);assert(await page.locator('#status.error').isVisible());}
  holdNext=true;await first.locator('[name=amount]').fill('1.234567');await first.getByRole('button',{name:'Aufladen',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Vorgang wird gespeichert'));assert(await page.locator('#add-form button').isDisabled());assert(await page.locator('#refresh').isDisabled());releaseHold();await done();assert.equal(calls.at(-1).body.amountEuroMicros,1234567);
  await first.locator('[name=weekly]').fill('0,000001');await first.getByRole('button',{name:'Wochenlimit speichern'}).click();await done();assert.equal(calls.at(-1).body.weeklyLimitEuroMicros,1);
  await page.locator('#global-form [name=lifetime]').fill('10,123456');await page.locator('#global-form [name=weekly]').fill('2.000001');await page.locator('#global-form button').click();await done();assert.equal(calls.at(-1).body.globalLifetimeLimitEuroMicros,10123456);assert.equal(calls.at(-1).body.globalWeeklyLimitEuroMicros,2000001);
  const before=snapshot.accounts[0].grantedEuroMicros;loseNext=true;await first.locator('[name=amount]').fill('0,000001');await first.getByRole('button',{name:'Aufladen',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('#pending').hidden&&!document.querySelector('#retry').disabled);assert(await page.locator('#add-form button').isDisabled());assert.equal(snapshot.accounts[0].grantedEuroMicros,before+1);const uncertain=calls.at(-1);await page.locator('#retry').click();await done();assert.equal(calls.at(-1).raw,uncertain.raw,'manual retry preserves the entire serialized body and operationId');assert.equal(snapshot.accounts[0].grantedEuroMicros,before+1,'no second topup');
  snapshot.accounts[1].uid='xx-aaaaaa-bbbbbb-cccccc';await page.locator('#refresh').click();await page.waitForFunction(()=>document.querySelector('#status').textContent==='Kontostände aktualisiert.');
  if(process.env.WRITE_PREVIEWS==='1'){const previewDir=path.resolve('.edulo-tools');await fs.mkdir(previewDir,{recursive:true});for(const width of [390,1200]){await page.setViewportSize({width,height:1000});await page.screenshot({path:path.join(previewDir,'admin-preview-'+width+'.png'),fullPage:true});}}
  for(const width of [390,920,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'named accounts do not overflow at '+width);}
  const count=calls.length;await page.reload();assert(await page.locator('#login').isVisible());assert(await page.locator('#dashboard').isHidden());assert.equal(calls.length,count,'reload does not retain credentials or load accounts');await login();assert.equal(await page.locator('.account-name').first().innerText(),'Synthetische Zuordnung');assert.equal(await page.locator('.account-name').last().innerText(),'Synthetisches Testkonto');await page.locator('#logout').click();assert.equal(await page.locator('#accounts').innerText(),'');assert.equal(await page.locator('#password').inputValue(),'');assert(await page.locator('#dashboard').isHidden());assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});assert.deepEqual(errors,[]);
 }finally{releaseHold?.();await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
});


