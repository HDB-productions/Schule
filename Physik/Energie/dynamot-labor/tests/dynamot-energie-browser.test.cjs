const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve(__dirname,'..'),repo=path.resolve(dir,'../../..'),out=path.join(__dirname,'energie-ansichten');
fs.mkdirSync(out,{recursive:true});
const raw=fs.readFileSync(path.join(dir,'dynamot-labor.html'),'utf8');
const instrumented=raw.replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},parse,encode,step,render,save,chooseDevice,setRunning(value){running=value;state.running=value},advance(n){const previous=state.running;state.running=true;for(let i=0;i<n;i++){step(state.devices,state.wires,.005);state.simulationTime+=.005;}view.update(state);state.running=previous;}};init();frame=requestAnimationFrame(tick);');
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://local');if(url.pathname.endsWith('dynamot-labor.html')){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(instrumented);}const file=path.resolve(repo,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)){res.statusCode=404;return res.end();}res.end(fs.readFileSync(file));});
const fixture=v=>{
 const motor=(id,slot)=>({id,type:'motor',slot,omega:0,angle:0,crank:false,weight:false,hand:false,rate:22,mass:.5,height:1.2});
 const a=motor(1,'M1'),b=motor(2,['v1','v4'].includes(v)?'L1':'M2');
 if(['v1','v4'].includes(v))b.type='lamp';else if(v==='v2')b.crank=true;else{b.weight=true;b.mass=.3;b.height=.3;}
 if(v==='v4'){a.weight=true;a.mass=.65;}else{a.crank=true;a.hand=true;}
 return {widget:'dynamot-lab',version:2,next:3,simulationTime:0,electronFlow:false,energyPackets:false,tasks:{},devices:[a,b],wires:[{a:1,ap:0,b:2,bp:b.type==='lamp'?1:0},{a:1,ap:1,b:2,bp:b.type==='lamp'?0:1}]};
};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:920,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=`http://127.0.0.1:${server.address().port}/Physik/Energie/dynamot-labor/dynamot-labor.html`;
 await page.goto(url);await page.waitForFunction(()=>window.labTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);
 await page.locator('.learn-picker').selectOption('free');
 // Prepare solved models directly; interactions below exercise the real switches.
 for(const v of ['v1','v4','v2','v3']){
  await page.evaluate(s=>{labTest.setRunning(false);Object.assign(labTest.state,s);labTest.render();labTest.advance(200);},fixture(v));
  await page.locator('[data-energy-packets]').check();await page.locator('[data-electron-flow]').check();
  await page.evaluate(v=>labTest.view.restoreView({position:v==='v4'?[1.5,5.5,8.5]:v==='v3'?[-9,6,10]:v==='v1'?[-7.5,5,-3.2]:[-7,6,-3],target:v==='v4'?[-3.9,-.3,2.1]:v==='v3'?[-2.25,-.2,2.4]:v==='v1'?[-3.9,0,1.7]:[-2.25,0,2.4]}),v);
  await page.evaluate(()=>labTest.advance(70));
  const data=await page.evaluate(()=>({packets:labTest.view.getEnergySamples(),electrons:labTest.view.getLampFlowSamples(),wires:labTest.state.wires,devices:labTest.state.devices}));
  assert(data.packets.some(p=>p.kind==='electrical'),v+' electrical delivery');
  if(['v1','v4'].includes(v)){
   const light=data.packets.find(p=>p.kind==='light'),heat=data.packets.find(p=>p.kind==='heat'&&p.device===2);
   assert(light&&heat&&Math.abs(heat.area/light.area-9)<1e-8,'90/10 area split');assert(data.electrons.some(e=>e.visible),'lamp charges visible');
   const joins=await page.evaluate(()=>{const lamp=labTest.view.getLampChargePoints(2),a=labTest.view.getChargePoints(0),b=labTest.view.getChargePoints(1);return [lamp[0],lamp.at(-1),a.at(-1),b.at(-1)];});
   assert.deepEqual(joins[0],joins[3],'wire joins red lamp terminal');assert.deepEqual(joins[1],joins[2],'wire joins black lamp terminal');
  }
  if(v==='v2')assert(data.packets.some(p=>p.kind==='mechanical-out'&&p.device===2),'driven crank kinetic energy');
  if(v==='v3'){
   assert(!data.packets.some(p=>p.kind==='lift'),'no green growing at motor before electrical arrival');
   const split=await page.evaluate(()=>{for(let i=0;i<650;i++){labTest.advance(1);const samples=labTest.view.getEnergySamples(),lift=samples.filter(p=>p.kind==='lift');if(lift.length)return {lift,heat:samples.find(p=>p.kind==='heat'&&p.device===2),blue:samples.filter(p=>p.kind==='electrical')};}return null;});
   assert(split,'electrical arrival releases green');assert.equal(split.lift.length,1,'two cables produce one combined conversion');assert(split.lift[0].electricalArrival&&!split.lift[0].partial);assert.equal(split.lift[0].progress,0);assert(split.heat,'thermal output co-emerges');assert(Math.hypot(...split.lift[0].position.map((v,i)=>v-split.heat.position[i]))<.03,'green and red emerge at same motor conversion point');assert(split.blue.every(p=>p.t<.003),'split occurs exactly as blue arrival completes');
  }
  if(v==='v4'){
   const stock=data.packets.filter(p=>p.kind==='potential-stock'),stockJ=stock.reduce((sum,p)=>sum+p.joules,0);
   assert(stock.length>1,'several lilac reserve packets surround the weight');
   assert(data.packets.filter(p=>p.kind==='fall').every(p=>p.joules>0),'falling rope carries only green transfer packets');
   await page.evaluate(()=>labTest.advance(60));const after=await page.evaluate(()=>labTest.view.getEnergySamples().filter(p=>p.kind==='potential-stock'));
   assert(after.reduce((sum,p)=>sum+p.joules,0)<stockJ,'falling stock decreases');
  }
  const frozen=await page.evaluate(()=>labTest.view.getEnergySamples());await page.waitForTimeout(160);assert.deepEqual(await page.evaluate(()=>labTest.view.getEnergySamples()),frozen,'paused animation freezes');
  await page.screenshot({path:path.join(out,v+'-920.png'),fullPage:true});
 }
 // Exercise the actual run/pause controls as well as the deterministic step hook.
 for(const v of ['v4','v3']){
  await page.evaluate(s=>{labTest.setRunning(false);Object.assign(labTest.state,s);labTest.render();},fixture(v));
  await page.locator('[data-energy-packets]').check();
  assert((await page.evaluate(()=>labTest.view.getEnergySamples().filter(p=>p.kind==='potential-stock').length))>1,v+' initial reserve');
  await page.evaluate(v=>labTest.view.restoreView({position:v==='v4'?[1.5,5.5,8.5]:[-9,6,10],target:v==='v4'?[-3.9,-.3,2.1]:[-2.25,-.2,2.4]}),v);
  await page.locator('[data-action=run]').click();
  const kind=v==='v4'?'fall':'lift';
  await page.waitForFunction(kind=>document.querySelector('#energyLab').energyLab.getSnapshot().running&&labTest.view.getEnergySamples().some(p=>p.kind===kind&&p.progress>.3&&p.progress<.8),kind,{timeout:10000});
  const moving=await page.evaluate(()=>labTest.view.getEnergySamples().filter(p=>p.kind==='fall'||p.kind==='lift'));
  assert(moving.length>0&&moving.every(p=>p.joules>0),v+' live transfer');
  await page.locator('[data-action=run]').click();
  await page.screenshot({path:path.join(out,v+'-seiltransport.png'),fullPage:true});
  const paused=await page.evaluate(()=>labTest.view.getEnergySamples());
  await page.waitForTimeout(160);
  assert.deepEqual(await page.evaluate(()=>labTest.view.getEnergySamples()),paused,v+' live pause freezes packets');
 }
 await page.locator('[data-electron-flow]').uncheck();assert((await page.evaluate(()=>labTest.view.getEnergySamples())).length>0,'energy independent of charge toggle');
 await page.locator('[data-energy-packets]').uncheck();assert.equal((await page.evaluate(()=>labTest.view.getEnergySamples())).length,0);
 await page.locator('[data-electron-flow]').check();assert(await page.locator('[data-electron-flow]').isChecked());assert(!(await page.locator('[data-energy-packets]').isChecked()));
 await page.locator('[data-energy-packets]').check();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'mobile-390.png'),fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390,'no mobile overflow');
 assert.deepEqual(errors,[],'no runtime errors');console.log('Energy browser: four experiments, area splits, continuous lamp joins, independent toggles, pause, decreasing stock, desktop/mobile passed.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
