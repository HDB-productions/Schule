const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve(__dirname,'..'),out=path.join(__dirname,'ablauf-ansichten');fs.mkdirSync(out,{recursive:true});
const fixtures=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/dynamot-altstand-v2.json'),'utf8'));
const raw=fs.readFileSync(path.join(dir,'dynamot-labor.html'),'utf8');
const app=raw.replace('init();frame=requestAnimationFrame(tick);',`window.labTest={get state(){return state},get view(){return view},parse,encode,render,save,step,connect,place,removeWire,chooseDevice,attemptLockedEdits(){tool='motor';place('M3');tool='move';place('M2');tool='weight';chooseDevice(state.devices[0].id);connect(state.devices[0].id,0);removeWire(0);tool=null;},advance(n){for(let i=0;i<n;i++){step(state.devices,state.wires,.005);state.simulationTime+=.005;}view.update(state);}};init();frame=requestAnimationFrame(tick);`);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');const u=new URL(req.url,'http://local');if(u.pathname==='/app')return res.end(app);if(u.pathname==='/host'){const f=fixtures.cases.find(f=>f.name===u.searchParams.get('case'))||fixtures.cases[1];return res.end(`<textarea id="e1_text_input">${esc(f.raw)}</textarea><div id="e2">${Array.from({length:20},(_,i)=>`<input id="e2_cloze_text_input_${i+1}" value="${i<f.expected.points?'1':'0'}">`).join('')}</div><iframe src="/app?edulo=1" style="width:1180px;height:900px"></iframe>`);}if(u.pathname.endsWith('/assets/hdb-youtube-avatar.jpg')){res.setHeader('Content-Type','image/jpeg');return res.end(fs.readFileSync(path.resolve(dir,'../../../assets/hdb-youtube-avatar.jpg')));}res.statusCode=404;res.end();});
const stable=s=>({devices:s.devices.map(({current,voltage,power,handTorque,...d})=>d),wires:s.wires.map(({current,voltage,power,color,routeLane,...w})=>w)});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1180,height:820},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=`http://127.0.0.1:${server.address().port}`;
 const ready=async p=>{await p.waitForFunction(()=>window.labTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);await p.waitForSelector('.learn-picker');};
 const snap=()=>page.evaluate(()=>document.querySelector('#energyLab').energyLab.getSnapshot());
 const select=async mode=>{await page.locator('.learn-picker').selectOption(mode);await page.waitForFunction(mode=>document.querySelector('#energyLab').energyLab.getMode()===mode,mode);};
 const add=async(slot,accessory)=>{await page.locator(`[data-slot="${slot}"]`).click();if(!(await page.locator(`[data-add-slot="${slot}"]`).count())){console.log('Missing popup',slot,await page.evaluate(()=>({mode:labTest.state.activeMode,locked:labTest.state.buildLocked,notice:document.querySelector('.notice').textContent,html:document.querySelector('.inspector').innerHTML})));await page.screenshot({path:path.join(out,'error-popup.png'),fullPage:true});}await page.locator(`[data-add-slot="${slot}"]`).click();if(accessory)await page.locator(`[data-action="attach-${accessory}"]`).click();await page.locator('[data-action="close-device"]').click();};
 await page.goto(base+'/app');await ready(page);assert.equal((await snap()).activeMode,'v1');
 const saved={};
 for(const mode of ['v1','v4','v2','v3']){
  console.log('Building',mode);await select(mode);assert.equal((await snap()).devices.length,0,mode+' first entry empty');
  assert.equal(await page.locator('.stage .slot-target').count(),2,'only two build slots');assert.equal(await page.locator('.reference-canvas canvas').count(),1,'one independent reference');
  await page.waitForFunction(()=>document.querySelector('.build-hint-text').textContent.includes('Platziere'));
  if(mode==='v1'){
   await page.screenshot({path:path.join(out,'01-leerer-start.png'),fullPage:true});
   const before=stable(await snap()),camera=await page.evaluate(()=>labTest.view.getViewState());
   const ref=await page.locator('.reference-canvas canvas').boundingBox();await page.mouse.move(ref.x+ref.width*.5,ref.y+ref.height*.5);await page.mouse.down();await page.mouse.move(ref.x+ref.width*.7,ref.y+ref.height*.6,{steps:10});await page.mouse.up();
   await page.getByRole('button',{name:'Vorlage vergrößern',exact:true}).click();
   assert.deepEqual(stable(await snap()),before,'reference does not change pupil construction');assert.deepEqual(await page.evaluate(()=>labTest.view.getViewState()),camera,'reference does not change pupil camera');
  }
  await add('M1',mode==='v4'?'weight':'crank');
  if(mode==='v1'){await page.waitForFunction(()=>document.querySelector('.build-hint-text').textContent.includes('Lampe'));await page.screenshot({path:path.join(out,'02-lampe-hinweis.png'),fullPage:true});}
  const lamp=['v1','v4'].includes(mode);await add(lamp?'L1':'M2',lamp?null:mode==='v2'?'crank':'weight');
  if(lamp){
   const reference=await page.evaluate(mode=>{const host=document.createElement('div');host.style.cssText='width:320px;height:260px';document.body.append(host);const ref=document.querySelector('#energyLab').energyLab.mountReference(host,mode);const snapshot=ref.getSnapshot();ref.dispose();host.remove();return snapshot;},mode);
   assert(reference.wires.every(w=>w.ap!==w.bp),'reference uses matching physical sides');
   await page.screenshot({path:path.join(out,mode+'-vorlage.png'),fullPage:true});
  }
  for(const pin of [0,1]){await page.locator(`[data-socket-device="1"][data-socket-pin="${pin}"]`).click();await page.locator(`[data-socket-device="2"][data-socket-pin="${lamp?1-pin:pin}"]`).click();}
  if(lamp){const ends=await page.evaluate(()=>[labTest.view.getChargePoints(0),labTest.view.getChargePoints(1)].map(p=>[p[0],p.at(-1)]));assert((ends[0][0][0]-ends[1][0][0])*(ends[0][1][0]-ends[1][1][0])>0,'lamp cables connect matching physical X sides');}
  await page.waitForFunction(()=>labTest.state.buildLocked===true);assert.equal((await snap()).wires.length,2);
  await page.waitForFunction(()=>!document.querySelector('.learn-reference'));
  const before=stable(await snap());await page.evaluate(()=>labTest.attemptLockedEdits());assert.deepEqual(stable(await snap()),before,'locked internal edit paths');
  assert(!(await page.locator('[data-action="reset-build"]').isVisible()),'reset hidden for confirmed build');
  // Runtime parameters remain usable after structural confirmation.
  await page.evaluate(()=>labTest.chooseDevice(1));
  if(mode==='v4'){await page.locator('[data-control=mass]').fill('0.8');await page.locator('[data-action=raise]').click();}
  else{await page.locator('[data-control=rate]').fill('21');await page.locator('[data-control=hand]').check();}
  await page.locator('[data-action=close-device]').click();
  if(mode==='v2'){const old=JSON.stringify((await snap()).wires);await page.locator('[data-action=invert-polarity]').click();assert.notEqual(JSON.stringify((await snap()).wires),old);assert.equal((await snap()).wires.length,2);}
  await page.locator('[data-energy-packets]').check();await page.locator('[data-electron-flow]').check();await page.evaluate(()=>{labTest.advance(180);labTest.save(false);});
  await page.screenshot({path:path.join(out,mode+'-fertig.png'),fullPage:true});saved[mode]=stable(await snap());
 }
 await select('free');assert.equal((await snap()).devices.length,0);assert.equal(await page.locator('.stage .slot-target').count(),7);assert.equal(await page.locator('.reference-canvas').count(),0);await add('M3','crank');saved.free=stable(await snap());
 for(const mode of ['v1','v4','v2','v3','free']){await select(mode);assert.deepEqual(stable(await snap()),saved[mode],mode+' restores independent state');if(mode!=='free')assert((await snap()).buildLocked);}
 await page.reload();await ready(page);assert.equal((await snap()).activeMode,'free');assert.deepEqual(stable(await snap()),saved.free);
 for(const mode of ['v1','v4','v2','v3']){await select(mode);assert.deepEqual(stable(await snap()),saved[mode],mode+' reload independent state');assert((await snap()).buildLocked);assert.equal(await page.locator('.learn-reference').count(),0,'confirmed reference stays absent after reload');}
 await page.setViewportSize({width:920,height:768});await page.screenshot({path:path.join(out,'tablet-920.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),920);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'mobile-390.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 await page.close();
 // Real old serialized formats are passed through an E1 host, not localStorage.
 for(const f of fixtures.cases.filter(f=>['wrong-choice-and-draft','all-four-complete','unfinished-observation'].includes(f.name))){
  const host=await browser.newPage({viewport:{width:1280,height:1000}});host.on('pageerror',e=>errors.push(e.message));await host.goto(base+'/host?case='+encodeURIComponent(f.name));const frame=host.frames().find(f=>f.url().includes('/app'));await ready(frame);
  assert(!(await frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getPersistenceStatus().blocked)),f.name+' old E1 accepted');
  const old=JSON.parse(Buffer.from(f.raw.slice(9),'base64').toString()),tasks=old.tasks['dynamot-learning-v2'];
  const restored=await frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getTaskState('dynamot-learning-v2'));
  for(const key of ['drafts','notes'])assert.deepEqual(restored[key],tasks[key],f.name+' '+key);
  for(const key of ['completed','answers','diagrams','evidence'])assert.deepEqual(restored.engine[key],tasks.engine[key],f.name+' '+key);
  if(f.name==='all-four-complete')for(const mode of ['v1','v4']){
   await frame.locator('.learn-picker').selectOption(mode);const guided=await frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getSnapshot());
   assert(guided.buildLocked,'legacy lamp build remains locked');assert.deepEqual(stable(guided).wires,stable(tasks.builds[mode]).wires,'legacy crossed wiring remains unchanged');assert.equal(await frame.locator('.learn-reference').count(),0,'legacy confirmed build has no reference');
  }
  await frame.locator('.learn-picker').selectOption('free');const actual=await frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getSnapshot());assert.deepEqual(stable(actual),stable(old),f.name+' old actual scene retained in free');
  await frame.goto(frame.url());await ready(frame);assert(!(await frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getPersistenceStatus().blocked)),'migrated E1 reload');await host.close();
 }
 assert.deepEqual(errors,[]);console.log('Full UI workflow: five independent modes, first starts empty, locks and parameters, polarity switch, reference isolation, hints, E1 legacy preservation, reload, 920/390 layout passed.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
