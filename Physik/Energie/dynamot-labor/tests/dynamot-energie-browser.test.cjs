const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve(__dirname,'..'),repo=path.resolve(dir,'../../..'),out=path.join(__dirname,'energie-ansichten');
fs.mkdirSync(out,{recursive:true});
const raw=fs.readFileSync(path.join(dir,'dynamot-labor.html'),'utf8');
const instrumented=raw.replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},parse,encode,step,render,save,chooseDevice,setRunning(value){running=value;state.running=value},advance(n){const previous=state.running;state.running=true;for(let i=0;i<n;i++){step(state.devices,state.wires,.005);state.simulationTime+=.005;if(i%4===3)view.update(state);}view.update(state);state.running=previous;}};init();frame=requestAnimationFrame(tick);');
assert.notEqual(instrumented,raw,'laboratory instrumentation is installed');
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://local');if(url.pathname.endsWith('dynamot-labor.html')){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(instrumented);}const file=path.resolve(repo,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)){res.statusCode=404;return res.end();}res.end(fs.readFileSync(file));});
const fixture=(v,{mass,rate=30,height}={})=>{
 const motor=(id,slot)=>({id,type:'motor',slot,omega:0,angle:0,crank:false,weight:false,hand:false,rate,mass:.5,height:1.2});
 const a=motor(1,'M1'),b=motor(2,['v1','v4'].includes(v)?'L1':'M2');
 if(['v1','v4'].includes(v))b.type='lamp';else if(v==='v2')b.crank=true;else{b.weight=true;b.mass=mass??.3;b.height=height??0;}
 if(v==='v4'){a.weight=true;a.mass=mass??2;a.height=height??1.2;}else{a.crank=true;a.hand=true;}
 return {widget:'dynamot-lab',version:2,next:3,simulationTime:0,electronFlow:false,energyPackets:true,tasks:{},activeMode:'free',devices:[a,b],wires:[{a:1,ap:0,b:2,bp:b.type==='lamp'?1:0},{a:1,ap:1,b:2,bp:b.type==='lamp'?0:1}]};
};
const near=(a,b,tolerance,message)=>assert(Math.abs(a-b)<=tolerance,`${message}: ${a} ≠ ${b}`);
const box=s=>s.screenBox;
const overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left);
const verticalOverlap=(a,b)=>Math.min(a.top,b.top)-Math.max(a.bottom,b.bottom);
function noInterior(a,b,label){
 assert(overlap(a,b)<=.0006||verticalOverlap(a,b)<=.0006,label+' squares do not overlap inside');
}
function contacts(list,label){
 const groups=new Map();
 for(const item of list.filter(s=>s.stage==='input'||s.stage==='output')){
  const group=groups.get(item.channel)||[];group.push(item);groups.set(item.channel,group);
 }
 let checked=0,withHeat=0;
 for(const [channel,items]of groups){
  const input=items.find(s=>s.stage==='input'),nonthermal=items.filter(s=>s.stage==='output'&&s.form!=='thermal');
  const heat=items.find(s=>s.stage==='output'&&s.form==='thermal');
  const primary=nonthermal.find(s=>!(s.form==='kinetic'&&s.store))||nonthermal[0];
  const sideHeat=nonthermal.length?heat:null;
  const third=nonthermal.length>1?nonthermal.find(s=>s!==primary&&s.form==='kinetic'&&s.store):null;
  if(input&&third){
   const a=box(input),d=box(third);
   near(a.bottom,d.top,.0006,label+' '+channel+' third kinetic store touches the input bottom');
   assert(overlap(a,d)>.0001,label+' '+channel+' store contact has positive edge length');
   noInterior(a,d,label+' '+channel+' store');
  }
  if(input&&!primary&&heat){
   const a=box(input),c=box(heat);
   near(a.top,c.bottom,.0006,label+' '+channel+' sole heat output touches input top');
   near(a.right,c.right,.0006,label+' '+channel+' sole heat output shares input right edge');
   assert(overlap(a,c)>.0001,label+' '+channel+' sole heat has positive contact');
   noInterior(a,c,label+' '+channel+' sole heat');
   checked++;withHeat++;continue;
  }
  if(!input||!primary)continue;
  const a=box(input),b=box(primary);
  near(a.right,b.left,.0006,label+' '+channel+' input touches primary at a vertical edge');
  near(a.top,b.top,.0006,label+' '+channel+' input and primary share a top edge');
  assert(verticalOverlap(a,b)>.0001,label+' '+channel+' contact has positive edge length');
  noInterior(a,b,label+' '+channel);
  checked++;
  if(sideHeat){
   const c=box(sideHeat);
   near(a.top,c.bottom,.0006,label+' '+channel+' heat touches the input top');
   near(a.right,c.right,.0006,label+' '+channel+' heat and input share a right edge');
   assert(overlap(a,c)>.0001,label+' '+channel+' heat contact has positive edge length');
   noInterior(a,c,label+' '+channel+' input/heat');
   noInterior(b,c,label+' '+channel+' primary/heat');
   withHeat++;
  }
 }
 assert(checked>0,label+' has a visible conversion');
 return {checked,withHeat};
}
function sampleShape(list,label){
 assert(list.length>0,label+' has visible E packets');
 for(const s of list){
  assert(['input','output','travel','stored'].includes(s.stage),label+' stage');
  assert(typeof s.id==='string'&&s.id.length>0,label+' stable ID '+JSON.stringify(s));
  assert(typeof s.form==='string',label+' form');
  if(s.stage!=='stored')assert(typeof s.station==='string',label+' station');
  assert(Number.isFinite(s.joules)&&s.joules>0&&Number.isFinite(s.area)&&s.area>0,label+' energy and area');
  assert(Array.isArray(s.position)&&s.position.length===3&&s.position.every(Number.isFinite),label+' world position');
  assert(Number.isFinite(s.size)&&s.size>0,label+' size');
  assert(s.waiting!==true,label+' has no deferred waiting state');
  if(s.stage!=='stored')assert(Object.hasOwn(s,'channel'),label+' channel field '+s.stage+' '+s.id);
  if(s.stage==='input'||s.stage==='output')assert(typeof s.channel==='string'&&s.channel.length>0,label+' conversion channel');
  if(s.stage!=='stored')assert(Number.isFinite(s.progress),label+' progress');
  for(const edge of ['left','right','bottom','top'])assert(Number.isFinite(box(s)?.[edge]),label+' screen edge '+edge);
  assert(box(s).right>box(s).left&&box(s).top>box(s).bottom,label+' positive projected square');
  if(s.stage==='travel'){
   assert(typeof s.routeId==='string'&&s.routeId.length>0,label+' route ID');
   for(const key of ['distance','pathLength','speed'])assert(Number.isFinite(s[key]),label+' travel '+key);
   near(s.speed,1.6,1e-9,label+' travel speed');
   assert(s.distance>=0&&s.distance<s.pathLength,label+' position on route');
  }
 }
}
const stock=(list,id)=>list.filter(s=>s.stage==='stored'&&s.form==='potential'&&s.device===id);
const sum=(items,key)=>items.reduce((total,item)=>total+item[key],0);

(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:920,height:768}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const url=`http://127.0.0.1:${server.address().port}/Physik/Energie/dynamot-labor/dynamot-labor.html`;
 await page.goto(url);await page.waitForFunction(()=>window.labTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);
 await page.locator('.learn-picker').selectOption('free');
 const samples=()=>page.evaluate(()=>labTest.view.getEnergySamples());
 const plan=()=>page.evaluate(()=>labTest.view.getEnergyPlan());
 const advance=n=>page.evaluate(count=>labTest.advance(count),n);
 const findConversion=async(station,form)=>{
  for(let i=0;i<=80;i++){
   const list=await samples(),input=list.find(s=>s.stage==='input'&&s.station===station&&s.form===form&&s.progress>.15&&s.progress<.55);
   if(input)return {list,input};
   if(i<80)await advance(4);
  }
  assert.fail(station+' '+form+' conversion does not appear within one 1.6 s pulse period');
 };
 const load=async(v,options={})=>{
  const state=fixture(v,options);
  await page.evaluate(s=>{labTest.setRunning(false);Object.assign(labTest.state,s);labTest.render();},state);
  await page.evaluate(v=>labTest.view.restoreView({position:v==='v2'?[-7,6,-3]:v==='v4'?[1.5,5.5,8.5]:v==='v3'?[-9,6,10]:[-7.5,5,-3.2],target:v==='v2'?[-2.25,0,2.4]:v==='v4'?[-3.9,-.3,2.1]:v==='v3'?[-2.25,-.2,2.4]:[-3.9,0,1.7]}),v);
 };

 let heatContacts=0;
 for(const v of ['v1','v4','v2','v3']){
  await load(v);await advance(4); // 0.02 s: active routes must already be populated.
  const first=await samples();sampleShape(first,v);
  const flow=(await plan()).flowModel;
  assert(flow&&Array.isArray(flow.routes)&&Array.isArray(flow.channels),v+' exposes routed channels');
  const long=flow.routes.filter(r=>r.length>=1.6*1.6&&r.joules>0);
  assert(long.length>0,v+' has a long active route');
  for(const route of long)assert(first.some(s=>s.stage==='travel'&&(s.routeId===route.id||s.routeIds?.includes(route.id))),v+' route '+route.id+' is occupied at 0.02 s');
  const station=v==='v4'?'weight:1':'motor:1',form=v==='v4'?'potential':'kinetic';
  const {list:start,input}=await findConversion(station,form);
   heatContacts+=contacts(start,v).withHeat;
  await advance(12);const later=await samples();sampleShape(later,v+' later');contacts(later,v+' later');
  const after=later.find(s=>s.id===input.id);
  assert(after&&after.joules<input.joules,v+' input shrinks during conversion');
   const outputTotal=list=>sum(list.filter(s=>s.channel===input.channel&&s.stage==='output'),'joules');
   assert(outputTotal(later)>outputTotal(start),v+' colored outputs grow during conversion');
   if(['v1','v4'].includes(v)){
    assert(new Set(flow.channels.filter(c=>c.station==='lamp:2'&&c.input?.form==='electrical').map(c=>c.id)).size>=2,v+' two cables keep independent lamp channels');
    const lampFrame=(await findConversion('lamp:2','electrical')).list;
    const arrivals=lampFrame.filter(s=>s.stage==='input'&&s.station==='lamp:2'&&s.form==='electrical');
    assert(arrivals.length>0,v+' blue arrival reaches the lamp within one pulse period');
    for(const arrival of arrivals){
     const heat=lampFrame.find(s=>s.channel===arrival.channel&&s.stage==='output'&&s.form==='thermal');
     const light=lampFrame.find(s=>s.channel===arrival.channel&&s.stage==='output'&&s.form==='light');
     assert(heat&&light,v+' blue-to-red/yellow lamp conversion follows arrival');
     near(heat.area/light.area,9,1e-7,v+' lamp split 90/10 by area');
    }
    heatContacts+=contacts(lampFrame,v+' lamp').withHeat;
   }
  const frozen=await samples();await page.waitForTimeout(100);
  assert.deepEqual(await samples(),frozen,v+' pause freezes transport and conversion');
  await page.screenshot({path:path.join(out,v+'-puffer.png'),fullPage:true});
  if(v==='v3'){
   await advance(100);const height=await page.evaluate(()=>labTest.state.devices[1].height);
   assert(height>0,'motor physically lifts normal 0.3 kg weight');
   const lifted=await samples(),green=lifted.find(s=>s.station==='weight:2'&&s.stage==='input'&&s.form==='kinetic');
   const violet=green&&lifted.find(s=>s.channel===green.channel&&s.stage==='output'&&s.form==='potential');
   assert(green&&violet,'growing violet energy touches green at the weight');
   contacts(lifted.filter(s=>s.channel===green.channel),'v3 weight');
   const visiblePotential=lifted.filter(s=>s.station==='weight:2'&&s.form==='potential'&&['stored','input','output'].includes(s.stage));
   const visibleJ=sum(visiblePotential,'joules');
   assert(visibleJ>0,'violet energy accumulates at the lifting weight');
   assert(visibleJ<=.3*9.81*height+1e-7,'visible violet stock stays within actual gravitational energy');
   await page.screenshot({path:path.join(out,'v3-vorrat-gewachsen.png'),fullPage:true});
   await page.evaluate(()=>labTest.chooseDevice(2));await page.locator('.inspector [data-action=lower]').click();
   assert.equal(await page.evaluate(()=>labTest.state.devices[1].height),0);
   assert.equal(stock(await samples(),2).length,0,'manual lowering clears the stock');
   await page.locator('.inspector [data-action=raise]').click();
   assert.equal(await page.evaluate(()=>labTest.state.devices[1].height),1.2);
   assert(stock(await samples(),2).length>0,'manual raising replaces the stock');
   await page.locator('[data-action=close-device]').click();
  }
 }
 assert(heatContacts>0,'thermal conversions share real screen edges');

 // A resting weight is a fixed set of height slices; mass changes area, not count.
 let areas=[];
 for(const mass of [.1,2]){
  await load('v4',{mass});const resting=stock(await samples(),1);
  assert.equal(resting.length,16,'1.2 m of 1.5 m shows 16 stored height slices');
  const quantum=mass*9.81*1.5/20;
  resting.forEach(s=>near(s.joules,quantum,1e-7,'resting stock quantum'));
  areas.push(sum(resting,'area'));
 }
 near(areas[1]/areas[0],20,1e-7,'2 kg has 20 times the stock area of 0.1 kg');
 await load('v4',{mass:2});await advance(80);
 const falling=await samples(),currentHeight=await page.evaluate(()=>labTest.state.devices[0].height);
 assert(currentHeight<1.2,'2 kg weight is falling');
 const quantum=2*9.81*1.5/20;
 assert(stock(falling,1).length>0,'falling weight still has stock');
 for(const tile of stock(falling,1))assert(tile.joules>0&&tile.joules<=quantum+1e-7,'running stock is capped at one height quantum');
 await page.screenshot({path:path.join(out,'maximale-energie.png'),fullPage:true});
 await advance(1600);
 assert.equal(await page.evaluate(()=>labTest.state.devices[0].height),0,'weight reaches floor');
 assert.equal((await samples()).length,0,'all flow E and stock disappear immediately at the floor');
 await page.evaluate(()=>labTest.chooseDevice(1));await page.locator('.inspector [data-action=raise]').click();
 assert.equal(await page.evaluate(()=>labTest.state.devices[0].height),1.2);
 assert.equal(stock(await samples(),1).length,16,'manual raise restores the stock without old flow');
 await page.locator('[data-action=close-device]').click();

 // Opposed hand drives feed cable heat from both ends, even at zero net transfer.
 await load('v2');await page.evaluate(()=>{const d=labTest.state.devices[1];d.hand=true;d.rate=-30;labTest.render();});
 await advance(4);const opposed=await samples();sampleShape(opposed,'counter-crank');
 const wireInput=opposed.find(s=>s.station?.startsWith('wire:')&&s.stage==='input'&&s.form==='electrical');
 const wireHeat=wireInput&&opposed.find(s=>s.channel===wireInput.channel&&s.stage==='output'&&s.form==='thermal');
 assert(wireInput&&wireHeat,'blue cable arrival changes directly into red wire heat');
 contacts(opposed.filter(s=>s.channel===wireInput.channel),'counter-crank wire');
 await page.screenshot({path:path.join(out,'gegenkurbel.png'),fullPage:true});

 // A fixed travel ID moves by 1.6 world units per simulated second on a straight heat route.
 let straight=opposed.find(s=>s.stage==='travel'&&s.form==='thermal'&&s.pathLength-s.distance>.25);
 for(let i=0;!straight&&i<40;i++){
  await advance(4);straight=(await samples()).find(s=>s.stage==='travel'&&s.form==='thermal'&&s.pathLength-s.distance>.25);
 }
 assert(straight,'straight heat route is populated without warm-up');
 await advance(20);const moved=(await samples()).find(s=>s.id===straight.id&&JSON.stringify(s.routeIds||[s.routeId])===JSON.stringify(straight.routeIds||[straight.routeId]));
 assert(moved,'travel packet retains its ID and bundled routes in a stable plan');
 near(moved.distance-straight.distance,.16,.002,'route distance follows speed 1.6');
 const worldDistance=Math.hypot(...moved.position.map((p,i)=>p-straight.position[i]));
 near(worldDistance,.16,.02,'straight heat route moves at 1.6 world units/s');

 await page.locator('[data-electron-flow]').uncheck();assert((await samples()).length>0,'energy independent of charges');
 await page.locator('[data-energy-packets]').uncheck();assert.equal((await samples()).length,0);
 await page.locator('[data-energy-packets]').check();assert((await samples()).length>0);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'puffer-mobil.png'),fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 assert.deepEqual(errors,[]);
 console.log('Instant energy browser: four experiments, touching conversions, independently occupied routes, stable travel speed, bounded weight stock, floor/manual resets and counter-crank heat passed.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
