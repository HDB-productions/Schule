const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve(__dirname,'..'),repo=path.resolve(dir,'../../..'),out=path.join(__dirname,'energie-ansichten');
fs.mkdirSync(out,{recursive:true});
const raw=fs.readFileSync(path.join(dir,'dynamot-labor.html'),'utf8');
const instrumented=raw.replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},parse,encode,step,render,save,chooseDevice,setRunning(value){running=value;state.running=value},advance(n){const previous=state.running;state.running=true;for(let i=0;i<n;i++){step(state.devices,state.wires,.005);state.simulationTime+=.005;if(i%4===3)view.update(state);}view.update(state);state.running=previous;}};init();frame=requestAnimationFrame(tick);');
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
 await page.goto(url);await page.waitForFunction(()=>window.labTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);await page.locator('.learn-picker').selectOption('free');
 const samples=()=>page.evaluate(()=>labTest.view.getEnergySamples());
 const find=async(station,form)=>page.evaluate(({station,form})=>{for(let i=0;i<450;i++){labTest.advance(10);const p=labTest.view.getEnergySamples();if(p.some(s=>s.station===station&&s.stage==='input'&&s.form===form&&s.progress>.15&&s.progress<.55))return p;}return null;},{station,form});
 for(const v of ['v1','v4','v2','v3']){
  const state=fixture(v);state.activeMode='free';state.energyPackets=true;state.electronFlow=true;if(v==='v3')state.devices[1].height=0;
  await page.evaluate(s=>{labTest.setRunning(false);Object.assign(labTest.state,s);labTest.render();},state);
  await page.evaluate(v=>labTest.view.restoreView({position:v==='v4'?[1.5,5.5,8.5]:v==='v3'?[-9,6,10]:[-7.5,5,-3.2],target:v==='v4'?[-3.9,-.3,2.1]:v==='v3'?[-2.25,-.2,2.4]:[-3.9,0,1.7]}),v);
  const station=v==='v4'?'weight:1':'motor:1',form=v==='v4'?'potential':'kinetic';const source=await find(station,form);assert(source,v+' visible source conversion');
  const a=source.find(p=>p.station===station&&p.stage==='input'&&p.form===form);await page.evaluate(()=>labTest.advance(12));const after=await samples(),b=after.find(p=>p.station===station&&p.stage==='input'&&p.form===form);assert(b&&b.joules<a.joules,v+' input shrinks');
  const outputs=list=>list.filter(p=>p.station===station&&p.stage==='output').reduce((s,p)=>s+p.joules,0);assert(outputs(after)>outputs(source),v+' outputs grow while input shrinks');
  const receiver=['v1','v4'].includes(v)?'lamp:2':'motor:2';const converted=await find(receiver,'electrical');assert(converted,v+' blue arrival reaches receiver before conversion');
  if(['v1','v4'].includes(v)){
   const light=converted.find(p=>p.station===receiver&&p.stage==='output'&&p.form==='light'),heat=converted.find(p=>p.station===receiver&&p.stage==='output'&&p.form==='thermal');assert(light&&heat);assert(Math.abs(heat.area/light.area-9)<1e-7,'lamp split remains 90/10 by area');
  }
  if(v==='v3'){
   const weight=await find('weight:2','kinetic');assert(weight,'green reaches weight');const beforeStock=weight.filter(p=>p.kind==='potential-stock'&&p.device===2).reduce((s,p)=>s+p.joules,0),green=weight.find(p=>p.station==='weight:2'&&p.stage==='input');
   await page.evaluate(()=>labTest.advance(12));const next=await samples(),nextStock=next.filter(p=>p.kind==='potential-stock'&&p.device===2).reduce((s,p)=>s+p.joules,0),greenAfter=next.find(p=>p.station==='weight:2'&&p.stage==='input');assert(greenAfter.joules<green.joules);assert(nextStock>beforeStock,'lilac stock grows continuously while green shrinks');assert(Math.abs((nextStock-beforeStock)-(green.joules-greenAfter.joules))<1e-6,'weight conversion conserves visible energy');
  }
  const frozen=await samples();await page.waitForTimeout(100);assert.deepEqual(await samples(),frozen,'pause freezes conversion and transport');
  await page.screenshot({path:path.join(out,v+'-puffer.png'),fullPage:true});
  if(v==='v3'){await page.evaluate(()=>labTest.advance(1200));await page.screenshot({path:path.join(out,'v3-vorrat-gewachsen.png'),fullPage:true});await page.evaluate(()=>labTest.chooseDevice(2));await page.locator('.inspector [data-action=lower]').click();assert.equal(await page.evaluate(()=>labTest.state.devices[1].height),0);assert.equal((await samples()).filter(p=>p.kind==='potential-stock'&&p.device===2).length,0,'manual lowering clears old visual stock');await page.evaluate(()=>labTest.advance(200));assert(await page.evaluate(()=>labTest.state.devices[1].height>0),'real solved motor can lift again');await page.locator('[data-action=close-device]').click();}
 }
 await page.locator('[data-electron-flow]').uncheck();assert((await samples()).length>0,'energy independent of charges');await page.locator('[data-energy-packets]').uncheck();assert.equal((await samples()).length,0);await page.locator('[data-energy-packets]').check();assert((await samples()).length>0);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'puffer-mobil.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 assert.deepEqual(errors,[]);console.log('Buffered energy browser: all four experiments, shrinking inputs/growing outputs, 90/10 light split, green-to-lilac conservation, pause and independent toggles passed.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
