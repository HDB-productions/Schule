const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8').replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},render,save};init();frame=requestAnimationFrame(tick);');
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(raw);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const size of [{width:1024,height:668},{width:1180,height:720}])for(const source of [1,3]){
  const page=await browser.newPage({viewport:size,hasTouch:true});await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('canvas').waitFor();
  await page.evaluate(()=>{const s=labTest.state;s.devices=['M1','M2','L1','L2'].map((slot,i)=>({id:i+1,type:slot[0]==='M'?'motor':'lamp',slot,omega:0,angle:0,crank:false,weight:false,hand:false,mass:.4,height:1,rate:12}));s.next=5;s.wires=[];labTest.render();labTest.view.setView('back');labTest.save();});
  const targets=source===1?[2,3,4]:[1,2,4];
  for(const [n,id]of targets.entries()){
   await page.locator(`[data-socket-device="${source}"][data-socket-pin="0"]`).tap();await page.locator(`[data-socket-device="${id}"][data-socket-pin="0"]`).tap();
   const plugs=await page.evaluate(source=>labTest.view.getPlugSamples().filter(p=>p.id===source&&p.pin===0),source);assert.deepEqual(plugs.map(p=>p.stack),Array.from({length:n+1},(_,i)=>i));
   assert(plugs.every(p=>Math.abs(p.axis.reduce((sum,v,i)=>sum+v*p.side[i],0))<1e-9),'lateral cable exit');
   if(n){assert(Math.hypot(...plugs[n].exit.map((v,i)=>v-plugs[n-1].exit[i]))>.35);await page.locator('.stage').screenshot({path:path.join(__dirname,`dynamot-stecker-${source===1?'motor':'lampe'}-${n+1}-${size.width}.png`)});}
  }
  const old=await page.evaluate(()=>labTest.state.wires.map(w=>({color:w.color,routeLane:w.routeLane})));
  const point=await page.evaluate(()=>{for(let j=10;j<95;j++){const p=labTest.view.projectWire(0,j/100),h=labTest.view.pickAt(p.x,p.y);if(document.elementFromPoint(p.x,p.y)===labTest.view.canvas&&h?.kind==='wire'&&h.index===0)return p;}return null;});assert(point);await page.touchscreen.tap(point.x,point.y);await page.locator('[data-action=remove-wire]').tap();
  assert.deepEqual(await page.evaluate(source=>labTest.view.getPlugSamples().filter(p=>p.id===source&&p.pin===0).map(p=>p.stack),source),[0,1]);
  assert.deepEqual(await page.evaluate(()=>labTest.state.wires.map(w=>({color:w.color,routeLane:w.routeLane}))),old.slice(1));
  await page.reload();await page.locator('canvas').waitFor();assert.deepEqual(await page.evaluate(source=>labTest.view.getPlugSamples().filter(p=>p.id===source&&p.pin===0).map(p=>p.stack),source),[0,1]);assert.equal(await page.evaluate(()=>labTest.state.wires.length),2);await page.close();
 }
 console.log('Motor/lamp: 2/3 stackable plugs through original socket taps, perpendicular side exits, distinct origins, bottom removal/reindex, stable colors/routes and reload at both tablet sizes passed.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
