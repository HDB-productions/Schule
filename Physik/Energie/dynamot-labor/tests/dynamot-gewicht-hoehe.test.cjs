const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');

const dir=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(dir,'dynamot-labor.quelle.html'),'utf8');
function inject(marker,replacement){assert(html.includes(marker),marker+' must exist');html=html.replace(marker,replacement);}
inject('/* DYNAMOT_NETWORK_MODEL */',`function solveDynamotNetwork(devices){for(const d of devices){d.current=d.weight?2:0;d.voltage=0;d.power=0;}}`);
inject('/* DYNAMOT_3D_BUNDLE */',`const LabScene={LAB_SLOTS:[{id:'M1',type:'motor'},{id:'M2',type:'motor'},{id:'L1',type:'lamp'}],createLabScene(stage){const canvas=document.createElement('canvas');stage.append(canvas);return {canvas,rebuild(){},update(){},setMode(){},getViewState(){return null},projectDevice(){return null},projectSlot(){return null},projectPort(){return null},projectAccessory(){return null},pickAt(){return null},dispose(){}};}};`);
inject('DynamotLearning.mount(root);globalThis.DynamotBuildHints?.mount(root);init();frame=requestAnimationFrame(tick);',`globalThis.DynamotLearning={mount(){}};globalThis.weightTest={
 get state(){return state},
 prepare(){
  const motor=(id,slot)=>({id,type:'motor',slot,omega:0,angle:0,crank:false,weight:false,hand:false,rate:15,mass:.5,height:1.2});
  const drive=motor(1,'M1'),lift=motor(2,'M2');drive.crank=true;drive.hand=true;lift.weight=true;lift.mass=.3;lift.height=.8;lift.omega=4;
  Object.assign(state,{activeMode:'v3',mode:'v3',allowedSlots:['M1','M2'],next:3,devices:[drive,lift],wires:[{a:1,ap:0,b:2,bp:0},{a:1,ap:1,b:2,bp:1}],buildLocked:true,tasks:{'dynamot-learning-v2':{points:17,note:'unchanged'}}});
  selected=2;render();save();
 },
 selectLift(){selected=2;inspect();}
};DynamotLearning.mount(root);init();frame=requestAnimationFrame(tick);`);

const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/dynamot-labor.quelle.html`);
  await page.waitForFunction(()=>window.weightTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);
  await page.evaluate(()=>weightTest.prepare());
  const lower=page.locator('.inspector [data-action=lower]');
  const raise=page.locator('.inspector [data-action=raise]');
  assert(await lower.isVisible(),'lower control remains available in locked guided v3');
  assert(await raise.isVisible(),'raise control remains alongside lower');
  assert.equal(await page.locator('.weight-height-actions').evaluate(el=>getComputedStyle(el).display),'grid');
  assert(await page.locator('[data-action=reset-build]').isHidden(),'build controls stay locked');
  await lower.click();
  let s=await page.evaluate(()=>weightTest.state);
  assert.equal(s.devices[1].height,0,'manual lowering reaches the ground');
  assert.equal(s.devices[1].omega,0,'manual lowering stops the shaft');
  assert.equal(s.buildLocked,true,'lowering does not unlock the build');
  assert.equal(s.wires.length,2,'connections remain in place');
  assert.deepEqual(s.tasks['dynamot-learning-v2'],{points:17,note:'unchanged'},'points and learning state remain untouched');
  assert.match(await page.locator('.notice').innerText(),/Lageenergie entnommen/);
  await page.locator('[data-action=run]').click();
  await page.waitForFunction(()=>weightTest.state.devices[1].height>0,{timeout:3000});
  await page.locator('[data-action=run]').click();
  await lower.click();
  await page.reload();
  await page.waitForFunction(()=>window.weightTest&&document.querySelector('#energyLab').energyLab.getPersistenceStatus().ready);
  s=await page.evaluate(()=>weightTest.state);
  assert.equal(s.activeMode,'v3');assert.equal(s.buildLocked,true);
  assert.equal(s.devices[1].height,0);assert.equal(s.devices[1].omega,0);
  assert.deepEqual(s.tasks['dynamot-learning-v2'],{points:17,note:'unchanged'});
  await page.evaluate(()=>weightTest.selectLift());
  await page.locator('.inspector [data-action=raise]').click();
  s=await page.evaluate(()=>weightTest.state);
  assert.equal(s.devices[1].height,1.2,'the existing raise action still works');
  assert.equal(s.devices[1].omega,0);
  assert.deepEqual(errors,[]);
  console.log('Locked v3: lower, stop, restart lift, reload, raise, build lock, and points passed.');
 }finally{await browser?.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
