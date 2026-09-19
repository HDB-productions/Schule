const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve(__dirname,'..'),out=path.join(__dirname,'elektronen-ansichten');fs.mkdirSync(out,{recursive:true});
const raw=fs.readFileSync(path.join(dir,'dynamot-labor.html'),'utf8');
const app=raw.replace('init();frame=requestAnimationFrame(tick);',`window.labTest={get state(){return state},get view(){return view},render,setRunning(value){running=value},advance(n){for(let i=0;i<n;i++){step(state.devices,state.wires,.005);state.simulationTime+=.005;}view.update(state);}};init();frame=requestAnimationFrame(tick);`);
const server=http.createServer((req,res)=>{if(req.url.includes('hdb-youtube-avatar')){res.setHeader('Content-Type','image/jpeg');return res.end(fs.readFileSync(path.resolve(dir,'../../../assets/hdb-youtube-avatar.jpg')));}res.setHeader('Content-Type','text/html;charset=utf-8');res.end(app);});
const near=(a,b,label)=>assert(Math.abs(a-b)<1e-7,`${label}: ${a} != ${b}`);
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1180,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/app`);await page.waitForFunction(()=>window.labTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);await page.locator('.learn-picker').selectOption('free');
 await page.evaluate(()=>{labTest.setRunning(false);Object.assign(labTest.state,{devices:[{id:1,type:'motor',slot:'M1',omega:0,angle:0,crank:true,weight:false,hand:true,rate:22,mass:.5,height:1.2},{id:2,type:'lamp',slot:'L1',lampR:8},{id:3,type:'lamp',slot:'L4',lampR:8}],wires:[{a:1,ap:0,b:2,bp:1},{a:1,ap:1,b:2,bp:0},{a:1,ap:0,b:3,bp:1},{a:1,ap:1,b:3,bp:0}],electronFlow:true,energyPackets:false,simulationTime:0});labTest.render();labTest.advance(300);});
 const samples=()=>page.evaluate(()=>({wires:labTest.view.getFlowSamples(),lamps:labTest.view.getLampFlowSamples(),devices:labTest.state.devices,currents:labTest.state.wires.map(w=>w.current)}));
 const before=await samples();near(before.devices[1].current,before.devices[2].current,'equal parallel lamp currents');near(before.devices[1].power,before.devices[2].power,'equal parallel lamp powers');
 for(const [name,items,key]of [['wire',before.wires,'wire'],['lamp',before.lamps,'device']]){
  for(const id of new Set(items.map(p=>p[key]))){const points=items.filter(p=>p[key]===id&&p.visible).sort((a,b)=>a.distance-b.distance);assert(points.length>=2,name+' multiple symbols');for(let i=1;i<points.length;i++)near(points[i].distance-points[i-1].distance,.7,name+' uniform arc spacing');const length=points[0].length;assert(Math.abs(points.length-length/.7)<=1,name+' count follows length');}
 }
 const nearWire=before.wires.filter(p=>p.wire===0&&p.visible),farWire=before.wires.filter(p=>p.wire===2&&p.visible);assert(farWire[0].length>nearWire[0].length+1,'L4 path is longer');assert(farWire.length>nearWire.length,'long cable contains more symbols');
 // Positions actually lie on the rendered charge path, measured by arc length.
 const curveMatch=await page.evaluate(()=>{const points=labTest.view.getChargePoints(2,2000),symbols=labTest.view.getFlowSamples().filter(p=>p.wire===2&&p.visible);return symbols.every(s=>Math.min(...points.map(p=>Math.hypot(...p.map((v,i)=>v-s.position[i]))))<.012);});assert(curveMatch,'symbols follow actual path');
 await page.evaluate(()=>labTest.advance(1));const after=await samples();
 for(const id of [0,2]){const a=before.wires.find(p=>p.wire===id),b=after.wires.find(p=>p.wire===id);let delta=b.distance-a.distance;if(delta>.35)delta-=.7;if(delta<-.35)delta+=.7;near(delta,-after.currents[id]*1.2*.005,'world speed proportional to branch current '+JSON.stringify({id,a:a.distance,b:b.distance,beforeI:before.currents[id],afterI:after.currents[id]}));}
 for(const id of [2,3]){const lamp=after.lamps.find(p=>p.device===id),wireIndex=id===2?1:3,wire=after.wires.find(p=>p.wire===wireIndex);const gap=((wire.length-wire.distance+lamp.distance)%.7+.7)%.7;assert(gap<1e-7||Math.abs(gap-.7)<1e-7,'continuous spacing at lamp terminal');}
 await page.screenshot({path:path.join(out,'parallel-L1-L4.png'),fullPage:true});const frozen=await samples();await page.waitForTimeout(180);assert.deepEqual(await samples(),frozen,'pause freezes');
 await page.evaluate(()=>{labTest.state.devices[0].hand=false;labTest.state.devices[0].omega=0;labTest.advance(1);});assert((await samples()).wires.every(p=>!p.visible),'zero current has no moving symbols');
 assert.deepEqual(errors,[]);console.log('Charge browser: L1/L4 parallel, geometric path length, equal spacing/count/speed, lamp contacts, pause and stop passed.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
