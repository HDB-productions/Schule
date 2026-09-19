const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');

const file=path.join(__dirname,'../dynamot-labor.html');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync(file));});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext({viewport:{width:1180,height:760}});let page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const url='http://127.0.0.1:'+server.address().port+'/';
  const ready=async()=>page.waitForFunction(()=>document.querySelector('#energyLab')?.energyLab?.getPersistenceStatus().ready);
  const state=async()=>page.evaluate(()=>document.querySelector('#energyLab').energyLab.getSnapshot());
  const nav=async id=>{await page.locator('[data-learn-nav="'+id+'"]').evaluate(el=>el.click());assert.equal((await state()).activeMode,id);};
  const add=async slot=>page.evaluate(id=>{const root=document.querySelector('#energyLab'),target=root.querySelector('[data-slot="'+id+'"]'),before=root.energyLab.getSnapshot().buildLocked;if(!target)throw Error('slot target missing: '+id);target.click();const button=root.querySelector('[data-add-slot="'+id+'"]');if(!button)throw Error('slot menu missing: '+id+' mode '+root.energyLab.getMode()+' locked '+before+'→'+root.energyLab.getSnapshot().buildLocked+' / '+root.querySelector('.notice').textContent);button.click();},slot);
  const attach=async(slot,action)=>page.evaluate(({slot,action})=>{const root=document.querySelector('#energyLab'),d=root.energyLab.getSnapshot().devices.find(d=>d.slot===slot);root.querySelector('[data-device-target="'+d.id+'"]')?.click();root.querySelector('[data-action="attach-'+action+'"]')?.click();},{slot,action});
  const connect=async(a,ap,b,bp)=>page.evaluate(({a,ap,b,bp})=>{const root=document.querySelector('#energyLab');for(const [id,pin] of [[a,ap],[b,bp]])root.querySelector(`[data-socket-device="${id}"][data-socket-pin="${pin}"]`).click();},{a,ap,b,bp});
  await page.goto(url);await ready();await page.locator('[data-learn-nav="v1"][aria-current="true"]').waitFor({state:'attached'});
  let s=await state();assert.equal(s.activeMode,'v1');assert.deepEqual(s.allowedSlots,['M1','L1']);assert.equal(s.devices.length,0);
  assert.equal(await page.locator('.learn-reference-stage').count(),1,'unconfirmed guided mode shows 3D reference');
  assert.equal(await page.locator('.slot-target').count(),2);
  for(const id of ['v4','v2','v3']){await nav(id);s=await state();assert.equal(s.devices.length,0,id+' begins empty');assert.equal(s.buildLocked,false);assert.equal(await page.locator('.learn-reference-stage').count(),1);}
  await nav('free');assert.equal(await page.locator('.learn-reference').count(),0);await add('M3');await add('L4');
  await page.locator('[data-energy-packets]').check();
  const free=await state();assert.deepEqual(free.devices.map(d=>d.slot).sort(),['L4','M3']);assert.equal(free.energyPackets,true);
  await nav('v1');assert.equal((await state()).devices.length,0);
  await add('M1');await attach('M1','crank');await add('L1');
  s=await state();let m=s.devices.find(d=>d.slot==='M1'),l=s.devices.find(d=>d.slot==='L1');
  await connect(m.id,0,l.id,0);await connect(m.id,1,l.id,1);
  s=await state();assert.equal(s.buildLocked,true,'build check locks v1');assert.equal(s.wires.length,2);
  assert.equal(await page.locator('.learn-reference').count(),0,'confirmed build releases reference and layout space');
  assert.equal(await page.locator('.reference-canvas').count(),0);
  await page.evaluate(()=>{const root=document.querySelector('#energyLab');root.querySelector('[data-action="reset-build"]').click();root.querySelector('[data-action="attach-weight"]')?.click();});
  s=await state();assert.equal(s.devices.length,2);assert.equal(s.wires.length,2);assert.equal(s.devices.find(d=>d.slot==='M1').weight,false);
  await page.evaluate(id=>{const root=document.querySelector('#energyLab');root.querySelector('[data-device-target="'+id+'"]')?.click();const field=root.querySelector('[data-control="lampR"]');field.value='4';field.dispatchEvent(new Event('input',{bubbles:true}));},l.id);
  assert.equal((await state()).devices.find(d=>d.slot==='L1').lampR,4,'lamp type remains adjustable');
  await nav('v2');s=await state();assert.equal(s.devices.length,0);assert.equal(s.buildLocked,false,JSON.stringify({active:s.activeMode,modes:Object.fromEntries(Object.entries(s.labModes).map(([k,v])=>[k,{locked:v.buildLocked,devices:v.devices?.length}]))}));assert.equal(await page.locator('.learn-reference').count(),1,'next unconfirmed mode shows its own reference');
  await add('M1');await attach('M1','crank');await add('M2');await attach('M2','crank');
  s=await state();m=s.devices.find(d=>d.slot==='M1');l=s.devices.find(d=>d.slot==='M2');
  await connect(m.id,0,l.id,0);await connect(m.id,1,l.id,1);
  s=await state();assert.equal(s.buildLocked,true,'build check locks v2');assert.equal(await page.locator('.learn-reference').count(),0);const original=s.wires.map(w=>w.bp);
  await page.locator('[data-action="invert-polarity"]').click();
  s=await state();assert.equal(s.wires.length,2);assert.deepEqual(s.wires.map(w=>w.bp),original.map(pin=>1-pin));
  await nav('free');s=await state();assert.deepEqual(s.devices.map(d=>d.slot).sort(),['L4','M3']);assert.equal(s.energyPackets,true);
  await nav('v1');assert.equal((await state()).devices.find(d=>d.slot==='L1').lampR,4);assert.equal(await page.locator('.learn-reference').count(),0,'return to confirmed build keeps reference hidden');
  await nav('v2');await page.reload();await ready();await page.locator('[data-learn-nav="v2"][aria-current="true"]').waitFor({state:'attached'});
  s=await state();assert.equal(s.activeMode,'v2');assert.equal(s.buildLocked,true);assert.equal(s.wires.length,2);assert.equal(s.running,false,'reopens paused');

  const old=structuredClone(free);delete old.labModes;delete old.activeMode;delete old.mode;delete old.allowedSlots;delete old.buildLocked;old.tasks={};old.running=false;
  await page.evaluate(value=>{localStorage.setItem('dynamot-lab-v1','DYNAMOT1:'+btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))));},old);
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await ready();await page.locator('[data-learn-nav="v1"][aria-current="true"]').waitFor({state:'attached'});
  await nav('free');s=await state();assert.deepEqual(s.devices.map(d=>d.slot).sort(),['L4','M3'],'noncanonical old setup stays in free mode');
  await nav('v1');assert.equal((await state()).devices.length,0,'legacy free setup does not enter guided mode');

  await nav('free');const corrupt=await state();corrupt.labModes.v1={next:1,devices:[],wires:[],buildLocked:true};
  const encoded=await page.evaluate(value=>'DYNAMOT1:'+btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))),corrupt);
  await page.evaluate(value=>localStorage.setItem('dynamot-lab-v1',value),encoded);
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await ready();assert.match(await page.locator('.storage').innerText(),/Speichern gesperrt/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('dynamot-lab-v1')),encoded,'corrupt original retained');
  assert.deepEqual(errors,[]);console.log('Five isolated modes, build locks, v2 polarity, retained settings, legacy E1 and corrupt backup passed');
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
