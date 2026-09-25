const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1024,height:768}});await page.clock.install();
 await page.setContent('<div style="position:absolute;top:40px;left:25px;width:974px;height:728px;overflow:hidden"><div id="scene" style="width:920px"></div></div>');
 await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'../simulation.js'),'utf8')});
 await page.evaluate(()=>window.sim=createRocketSimulation(document.querySelector('#scene'),{energyVisible:true,efficiencyVisible:true,legendLabelsVisible:true}));
 const read=()=>page.evaluate(()=>({state:sim.getState(),nodes:[...document.querySelectorAll('[data-packet-id],[data-loss-id]')].filter(n=>n.style.opacity!=='0').map(n=>{const rect=n.querySelector('rect'),text=n.querySelector('text');return {id:n.dataset.packetId??n.dataset.lossId,transform:n.getAttribute('transform'),side:+rect.getAttribute('width'),font:+text.getAttribute('font-size'),amount:+n.dataset.amount};})}));
 await page.evaluate(()=>{for(let i=0;i<5;i++)document.querySelector('[data-pump-button]').click();});
 let elapsed=0;for(const time of [6400,8000,9750,11000,15000]){await page.clock.runFor(time-elapsed);elapsed=time;const {state,nodes}=await read();assert(Math.abs(nodes.reduce((sum,n)=>sum+n.amount,0)-5)<1e-6);assert(nodes.every(n=>n.font<n.side),'every E fits its filled square');await page.screenshot({path:path.join(__dirname,'artifacts',`heat-dispersion-${time}.png`)});}
 const before=await read();await page.clock.runFor(32);const after=await read();const xy=n=>n.transform.match(/translate\(([^ ]+) ([^)]+)\)/).slice(1).map(Number);
 after.nodes.forEach((n,i)=>assert(Math.hypot(...xy(n).map((v,j)=>v-xy(before.nodes[i])[j]))<2,'continuous gentle drift'));
 const xs=after.nodes.map(n=>xy(n)[0]);assert(Math.max(...xs)-Math.min(...xs)>300,'dispersion spans the environment rather than one collection point');
 await page.clock.runFor(55000);const outside=await read();assert.equal(outside.state.animationActive,false);assert(outside.nodes.every(n=>xy(n)[1]<-20),'squares travel naturally out of view');assert(Math.abs(outside.nodes.reduce((sum,n)=>sum+n.amount,0)-5)<1e-6,'offscreen energy is conserved');
 await page.evaluate(()=>{sim.reset();sim.setEfficiencyVisible(false);for(let i=0;i<5;i++)document.querySelector('[data-pump-button]').click();});
 for(const ms of [120,500,5500,1000,1800,1800]){await page.clock.runFor(ms);const data=await read();assert(data.state.losses.every(n=>n.amount===0));assert(data.nodes.every(n=>n.side===28),'OFF: all five original-size squares through all phases');}
 console.log('PASS: sequential projection-size frames, fitted E labels, continuous dispersed thermal paths, conserved offscreen energy, OFF constant size and no splits.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
