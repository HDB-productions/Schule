const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),Tasks=require('../dynamot-aufgaben.js');
const raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8').replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},render,save,encode};init();frame=requestAnimationFrame(tick);');
const motor=(id,slot)=>({id,slot,type:'motor',omega:0,angle:17,weight:false,crank:true,hand:false,rate:12,mass:.4,height:1,voltage:0,current:0,power:0});
const lamp={...motor(3,'L1'),type:'lamp',crank:false,lampR:24};
const initial={widget:'dynamot-lab',version:2,next:4,simulationTime:60,electronFlow:true,running:false,devices:[motor(1,'M1'),motor(2,'M2'),lamp],wires:[{a:1,ap:0,b:2,bp:0},{a:1,ap:1,b:2,bp:1},{a:1,ap:0,b:3,bp:0},{a:1,ap:1,b:3,bp:1}],camera:{position:[0,8,-15],target:[0,.1,1]},tasks:{'dynamot-learning-v2':{version:2,engine:Tasks.create().serialize(),chosen:'summary',drafts:{'v1.choice':{light:'leuchtet die Lampe'},'v1.diagram':{main:[{kind:'energy',label:'kinetische Energie'},{kind:'device',label:'DynaMot'},null,null,null],branches:[{from:1,energy:'thermische Energie'}]}},builds:{v1:{devices:[motor(1,'M1')],wires:[]}},notes:{v1:'Testnotiz'}}}};
const cameraEqual=(a,b)=>{for(const k of ['position','target'])a[k].forEach((v,i)=>assert(Math.abs(v-b[k][i])<1e-9));};
const encoded='DYNAMOT1:'+Buffer.from(JSON.stringify(initial)).toString('base64');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url==='/host'?'<textarea id="e1_text_input">'+encoded+'</textarea>'+Array.from({length:20},(_,i)=>'<input id="e2_cloze_text_input_'+(i+1)+'">').join('')+'<iframe src="/app?edulo=1" style="width:1180px;height:720px"></iframe>':raw);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({hasTouch:true,viewport:{width:1180,height:720}}),base='http://127.0.0.1:'+server.address().port;
 await page.addInitScript(()=>{if(location.pathname==='/host')localStorage.setItem('dynamot-lab-v1','INVALID LOCAL FALLBACK');});
 await page.goto(base+'/host');const frame=page.frames().find(f=>f.url().includes('/app'));await frame.locator('.learn-picker').waitFor();
 assert.equal(await frame.locator('.learn-picker').inputValue(),'summary');
 let restored=await frame.evaluate(()=>labTest.state);assert.equal(restored.devices.length,3);assert.equal(restored.devices[2].lampR,24);assert.deepEqual(restored.tasks['dynamot-learning-v2'].drafts,initial.tasks['dynamot-learning-v2'].drafts);cameraEqual(restored.camera,initial.camera);
 await frame.locator('.learn-picker').selectOption('v1');await frame.locator('[data-view=front]').click();await frame.locator('[data-action=zoom-in]').click();
 const saved=await page.locator('#e1_text_input').inputValue();assert(saved.startsWith('DYNAMOT1:'));await frame.goto(frame.url());await frame.locator('.learn-picker').waitFor();assert.equal(await frame.locator('.learn-picker').inputValue(),'v1');restored=await frame.evaluate(()=>labTest.state);const expected=JSON.parse(Buffer.from(saved.slice(9),'base64').toString());cameraEqual(restored.camera,expected.camera);assert.deepEqual(restored.devices,expected.devices);assert.deepEqual(restored.wires,expected.wires);assert.deepEqual(restored.tasks,expected.tasks);assert.equal(restored.simulationTime,60);assert.equal(restored.electronFlow,true);assert.equal(await page.locator('[id^=e2_cloze_text_input_]').count(),20);assert((await page.locator('[id^=e2_cloze_text_input_]').evaluateAll(fields=>fields.map(f=>f.value))).every(v=>v==='0'));
 // Load the same complete state standalone. Corrupt browser fallback above must not win in Edulo.
 await page.goto(base+'/app');await page.evaluate(value=>localStorage.setItem('dynamot-lab-v1',value),saved);await page.reload();await page.locator('.learn-picker').waitFor();cameraEqual(await page.evaluate(()=>labTest.state.camera),expected.camera);
 const canvas=await page.locator('canvas').boundingBox();await page.mouse.move(canvas.x+canvas.width*.65,canvas.y+canvas.height*.65);await page.mouse.down();await page.mouse.move(canvas.x+canvas.width*.75,canvas.y+canvas.height*.7,{steps:10});await page.mouse.up();const rotated=await page.evaluate(()=>labTest.view.getViewState());await page.reload();await page.locator('.learn-picker').waitFor();cameraEqual(await page.evaluate(()=>labTest.view.getViewState()),rotated);
 for(const size of [{width:1024,height:668},{width:1180,height:720}])for(const crossed of [false,true]){
  await page.setViewportSize(size);await page.evaluate(crossed=>{const s=labTest.state;s.wires[0].bp=crossed?1:0;s.wires[1].bp=crossed?0:1;labTest.render();},crossed);
  for(const view of ['front','back','default']){
   await page.locator('[data-view='+view+']').click();
   const points=await page.evaluate(()=>[0,1,2,3].map(i=>labTest.view.getWirePoints(i)));
   assert(points.every(ps=>ps.length===101&&ps.every(p=>p.y>.04)),'cables stay above tabletop');
   assert(points[0].some((p,i)=>Math.hypot(p.x-points[1][i].x,p.y-points[1][i].y,p.z-points[1][i].z)>.5),'parallel routes separated');
   for(let index=0;index<4;index++){
    const target=await page.evaluate(index=>{for(let j=8;j<93;j++){const p=labTest.view.projectWire(index,j/100),hit=labTest.view.pickAt(p.x,p.y);if(document.elementFromPoint(p.x,p.y)===labTest.view.canvas&&hit?.kind==='wire'&&hit.index===index)return p;}return null;},index);
    assert(target,'each curve independently selectable '+view+' '+index);await page.touchscreen.tap(target.x,target.y);assert(await page.locator('[data-action=remove-wire]').isVisible());await page.locator('[data-action=cancel-wire]').tap();
   }
   if(view==='back')await page.screenshot({path:path.join(__dirname,`dynamot-kabel-${size.width}-${crossed?'gekreuzt':'normal'}.png`)});
  }
 }
 await page.locator('[data-action=reset-build]').click();await page.reload();await page.locator('[data-action=undo-build]').click();assert.equal(await page.evaluate(()=>labTest.state.wires.length),4);
 await page.locator('[data-action=run]').click();await page.reload();assert.equal(await page.locator('[data-action=run]').innerText(),'Ⅱ Pause');await page.locator('[data-action=run]').click();
 console.log('E1/local full state and camera/current-page roundtrip; normal/crossed cables, lamps, four routes, all camera views and tablet touch selection passed.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
