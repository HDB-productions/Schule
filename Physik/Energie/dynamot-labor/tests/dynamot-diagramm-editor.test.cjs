const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dir=path.join(__dirname,'..');
require(path.join(dir,'dynamot-diagramm.js'));
const Diagram=globalThis.DynamotDiagram;
const energy=label=>({kind:'energy',label}),device=label=>({kind:'device',label});
const main=[energy('Lageenergie'),device('Gewicht'),energy('kinetische Energie'),device('DynaMot'),energy('elektrische Energie'),device('Lampe'),energy('Licht')];

{
 const before=Diagram.flowLayout(main,[]);
 assert.deepEqual(before.splits.map(s=>s.from),[3,5],'weight has no heat output');
 assert(before.gaps.at(-1).last,'final light arrow belongs to the main flow');
 const branch=[{from:3,energy:'thermische Energie',fraction:.25},{from:5,energy:'thermische Energie',fraction:.4}];
 const after=Diagram.flowLayout(main,branch);
 assert.equal(after.width,main.length*82,'the second step retains the 82px cells of the basic diagram');
 assert.deepEqual(after.nodes.map(n=>n.x),main.map((_,i)=>i*82),'energy and converter cells stay adjacent');
 for(const split of after.splits)if(split.branch)assert(Math.abs(split.incoming-split.outgoing-split.heat)<1e-9,'flow is conserved at each split');
 for(const split of after.splits)if(split.branch){
  assert.equal(split.cx-split.x0,12,'heat starts immediately at the converter output');
  assert(Math.abs(split.radius-split.innerRadius-split.heat)<1e-9,'quarter-circle contours preserve the heat thickness');
  assert(split.cx+split.radius<=split.x0+82,'the downward curve stays within its energy cell');
 }
 assert(Math.abs(after.remaining-.45)<1e-9,'later bands carry the remaining fraction');
 assert(after.gaps.at(-1).outgoing<after.gaps[2].outgoing,'final light band becomes thinner');
 const legacy=Diagram.flowLayout(main,[{from:3,energy:'thermische Energie'}]);
 assert.equal(legacy.splits.find(s=>s.from===3).fraction,.25,'old branches without fraction render at 25 percent');
}

const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:920,height:700},hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<main id="energyLab" style="font:16px system-ui;width:850px"><div id="editor"></div></main>');
  await page.addStyleTag({content:fs.readFileSync(path.join(dir,'dynamot-diagramm.css'),'utf8')});
  await page.addScriptTag({content:fs.readFileSync(path.join(dir,'dynamot-diagramm.js'),'utf8')});
  await page.evaluate(main=>{window.editor=DynamotDiagram.mount(document.querySelector('#editor'),{stage:'basic',length:main.length,value:{main,branches:[{from:3,energy:'thermische Energie'}]}});},main);
  assert.equal(await page.locator('[data-branch-socket]').count(),0,'basic step has no branch sockets');
  assert.equal(await page.locator('[data-label="thermische Energie"]').count(),1,'thermal form remains a main-chain distractor');
  assert.deepEqual(await page.evaluate(()=>window.editor.getValue().branches),[{from:3,energy:'thermische Energie'}],'basic stage leaves old branches untouched');
  await page.evaluate(main=>{window.editor.destroy();window.editor=DynamotDiagram.mount(document.querySelector('#editor'),{stage:'losses',length:main.length,value:{main,branches:[]}});},main);
  assert.equal(await page.locator('[data-loss-dock="1"]').count(),0,'weight has no heat dock');
  assert.equal(await page.locator('[data-loss-dock="3"]').count(),1);
  assert.equal(await page.locator('[data-loss-dock="5"]').count(),1);
  await page.locator('[data-loss-energy="chemische Energie"]').click();
  await page.locator('[data-loss-dock="3"]').click();
  assert.equal((await page.evaluate(()=>window.editor.getValue())).branches.length,0,'wrong energy is rejected');
  assert.match(await page.locator('.de-loss-feedback').innerText(),/thermische Energie/);
  await page.locator('[data-loss-energy="thermische Energie"]').click();
  await page.locator('[data-loss-dock="3"]').click();
  await page.locator('[data-loss-energy="thermische Energie"]').click();
  await page.locator('[data-loss-dock="5"]').click();
  let value=await page.evaluate(()=>window.editor.getValue());assert.deepEqual(value.branches.map(b=>b.from),[3,5]);
  const centers=await page.evaluate(()=>[...document.querySelectorAll('.de-flow-energy-label')].map((t,i)=>{const a=document.querySelectorAll('.de-flow-main')[i].getBBox(),b=t.getBBox();return Math.abs((a.y+a.height/2)-(b.y+b.height/2));}));
  assert(centers.every(delta=>delta<1),'labels follow the vertical center of every remaining arrow after adjustment');
  if(process.env.DYNAMOT_QA_IMAGE)await page.screenshot({path:process.env.DYNAMOT_QA_IMAGE+'-initial.png',fullPage:true});
  const grip=page.locator('[data-loss-grip="3"]');await grip.focus();await grip.press('ArrowUp');
  value=await page.evaluate(()=>window.editor.getValue());assert(value.branches[0].fraction>.25,'keyboard changes actual boundary');
  const box=await page.locator('[data-loss-grip="5"]').boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y-20,{steps:5});await page.mouse.up();
  value=await page.evaluate(()=>window.editor.getValue());assert(value.branches[1].fraction>.25,'vertical pointer drag changes loss share');
  const beforeTouch=value.branches[0].fraction,touchBox=await page.locator('[data-loss-grip="3"]').boundingBox(),touch=await page.context().newCDPSession(page);
  const tx=touchBox.x+touchBox.width/2,ty=touchBox.y+touchBox.height/2;
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx,y:ty,id:1}]});
  for(let i=1;i<=5;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:tx,y:ty+3*i,id:1}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  value=await page.evaluate(()=>window.editor.getValue());assert(value.branches[0].fraction<beforeTouch,'touch drag changes the direct boundary');
  assert.equal(await page.locator('.de-flow-main[data-flow-after="5"]').count(),1,'light exit remains visible');
  const geometry=await page.evaluate(()=>({
   width:+document.querySelector('.de-sankey-svg').getAttribute('width'),
   blue:[...document.querySelectorAll('.de-flow-main')].map(p=>p.getAttribute('d')),
   heat:[...document.querySelectorAll('.de-flow-heat')].map(p=>p.getAttribute('d')),
   rects:[...document.querySelectorAll('.de-flow-device rect')].map(r=>[+r.getAttribute('x'),+r.getAttribute('width')]),
   labels:[...document.querySelectorAll('.de-flow-energy-label')].map(t=>+t.getAttribute('x'))
  }));
  const cell=geometry.width/7;assert(geometry.width>=574,'diagram fills available width with equal cells');
  assert.deepEqual(geometry.rects,[[cell,cell],[3*cell,cell],[5*cell,cell]],'the converter boxes keep the first step cell positions');
  assert.deepEqual(geometry.labels,[.5*cell,2.5*cell,4.5*cell,6.5*cell],'energy captions sit inside their original arrow cells');
  for(const [i,heat] of geometry.heat.entries()){
   assert.match(heat,/A [\d.]+ [\d.]+ 0 0 1 [\d.]+ [\d.]+ L [\d.]+ 207 L [\d.]+ 226 L [\d.]+ 207/,'heat rounds through a quarter-circle into a downward arrow tip');
   assert.match(heat,/A [\d.]+ [\d.]+ 0 0 0 [\d.]+ [\d.]+ L [\d.]+ [\d.]+ Z$/,'inner heat contour rounds back at constant thickness');
   assert(geometry.blue[i+2].startsWith(`M ${(i===0?4:6)*cell} 24 L `),'main arrows start at the same converter outlet as heat');
  }
  if(process.env.DYNAMOT_QA_IMAGE)await page.screenshot({path:process.env.DYNAMOT_QA_IMAGE+'-920.png',fullPage:true});
  await page.setViewportSize({width:390,height:700});
  await page.evaluate(()=>document.querySelector('#energyLab').style.width='370px');
  assert(await page.evaluate(()=>{const el=document.querySelector('.de-losses-scroll');return el.scrollWidth>el.clientWidth&&el.clientWidth<=370;}),'phone uses horizontal diagram scroll');
  if(process.env.DYNAMOT_QA_IMAGE)await page.screenshot({path:process.env.DYNAMOT_QA_IMAGE+'-390.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('Basic and losses stages, conserved Sankey widths, correct docks, rejection, keyboard/pointer input, and phone scrolling passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
