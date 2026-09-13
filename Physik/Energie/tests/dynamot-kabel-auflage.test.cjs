const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8').replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},render,save};init();frame=requestAnimationFrame(tick);');
const server=http.createServer((q,r)=>r.end(raw));
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const size of [{width:1024,height:668},{width:1180,height:720}])for(const crossing of [false,true]){
  const page=await browser.newPage({viewport:size,hasTouch:true});await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('canvas').waitFor();
  await page.evaluate(crossing=>{const s=labTest.state;s.devices=['M1','M2','M3','L1','L2','L3','L4'].map((slot,i)=>({id:i+1,slot,type:slot[0]==='M'?'motor':'lamp',omega:0,angle:0,crank:false,weight:false,hand:false,rate:12,mass:.4,height:1}));s.next=8;s.wires=crossing?[{a:1,ap:0,b:3,bp:0},{a:2,ap:0,b:6,bp:0}]:[{a:1,ap:0,b:3,bp:0},{a:1,ap:1,b:3,bp:1},{a:1,ap:0,b:3,bp:1}];labTest.render();labTest.view.restoreView({position:[0,8,-13],target:[0,.15,.3]});labTest.save();},crossing);
  const result=await page.evaluate(()=>{const curves=labTest.state.wires.map((_,i)=>labTest.view.getWirePoints(i,800));let min=Infinity;for(let i=1;i<curves.length;i++)for(let j=0;j<i;j++)for(const p of curves[i]){if(p.y>.36)continue;for(let k=1;k<curves[j].length;k++){const a=curves[j][k-1],b=curves[j][k];if(a.y>.36||b.y>.36)continue;const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy+(p.z-a.z)*dz)/(dx*dx+dy*dy+dz*dz||1)));min=Math.min(min,Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy,p.z-a.z-t*dz));}}return {min,curves,lifts:labTest.state.wires.map((_,i)=>labTest.view.getWireLift(i))};});
  assert(result.lifts.some(v=>v>.01),'actual overlap requires local lift');console.log({crossing,width:size.width,min:result.min,lifts:result.lifts});
  assert(result.min>=.089,'tube clearance '+JSON.stringify({crossing,width:size.width,min:result.min}));
  await page.locator('.stage').screenshot({path:path.join(__dirname,`dynamot-kabel-auflage-${crossing?'kreuzung':'dreifach'}-${size.width}.png`)});
  await page.reload();await page.locator('canvas').waitFor();const restored=await page.evaluate(()=>labTest.state.wires.map((_,i)=>labTest.view.getWirePoints(i,800)));assert.deepEqual(restored,result.curves);
  if(size.width===1180){await page.evaluate(crossing=>labTest.view.restoreView({position:[0,2.2,crossing?-8:-6.5],target:[0,.12,crossing?-.7:1.33]}),crossing);await page.locator('.stage').screenshot({path:path.join(__dirname,`dynamot-kabel-auflage-detail-${crossing?'kreuzung':'dreifach'}.png`)});}
  await page.close();
 }
 console.log('Local cable stacking: three shared routes and crossing at both tablet sizes; >=sum of tube radii clearance and identical reload geometry passed.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

