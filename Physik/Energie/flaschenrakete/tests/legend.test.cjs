// Focused regression for the optional legend and the revised pump sentence.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const dir=path.resolve(__dirname,'..');require(path.join(dir,'build.cjs'));const html=fs.readFileSync(path.join(dir,'widget.html'),'utf8');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:920,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('[data-pump-button]').waitFor();const legend=page.locator('[data-energy-legend]');assert(await legend.isHidden());await page.locator('[data-energy-button]').click();assert(await legend.isVisible());
 assert.equal(await legend.locator('[data-legend-labels]:visible').count(),0,'legend words hidden by default');assert.equal(await legend.locator('.rocket-scene__legend-e:visible').count(),4);const eyes=legend.locator('[data-legend-labels-button]');
 await eyes.nth(1).click();assert.equal(await legend.locator('[data-legend-labels]:visible').count(),1);assert.equal(await eyes.nth(0).getAttribute('aria-pressed'),'false');assert.equal(await eyes.nth(1).getAttribute('aria-pressed'),'true');
 await eyes.nth(3).click();await eyes.nth(1).click();assert.equal(await legend.locator('[data-legend-labels]:visible').count(),1);assert.equal(await eyes.nth(3).getAttribute('aria-pressed'),'true');
 await page.waitForTimeout(400);await page.reload();await page.locator('[data-controls]:not([disabled])').waitFor();assert.equal(await eyes.nth(1).getAttribute('aria-pressed'),'false');assert.equal(await eyes.nth(3).getAttribute('aria-pressed'),'true','independent names restored');
 for(let i=0;i<3;i++)await eyes.nth(i).click();assert.equal(await legend.locator('[data-legend-labels]:visible').count(),4);assert.equal(await page.locator('[data-energy-group]').evaluate(e=>getComputedStyle(e).display!=='none'),true,'word toggle keeps energy squares');
 const entries=await legend.locator('[data-legend-form]').evaluateAll(nodes=>nodes.map(e=>({form:e.dataset.legendForm,text:e.textContent,color:getComputedStyle(e.firstElementChild).backgroundColor})));
 assert.deepEqual(entries.map(e=>e.form),['chemical','kinetic','thermal','potential']);assert.deepEqual(entries.map(e=>e.color),['rgb(246, 174, 88)','rgb(108, 209, 160)','rgb(242, 119, 112)','rgb(188, 151, 235)']);
 for(const width of [920,701,610,390]){
  await page.setViewportSize({width,height:900});await page.locator('.edulo-work').evaluate(el=>el.scrollTop=0);
  const rows=await legend.locator('[data-legend-form]').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));assert(rows.every((y,i)=>i===0||y>rows[i-1]),'entries remain stacked');
  const layout=await page.evaluate(()=>{const r=e=>e.getBoundingClientRect(),l=r(document.querySelector('[data-energy-legend]')),s=r(document.querySelector('.rocket-scene svg'));const overlap=e=>{const b=r(e);return Math.min(l.right,b.right)-Math.max(l.left,b.left)>.5&&Math.min(l.bottom,b.bottom)-Math.max(l.top,b.top)>.5;};return {overlaps:[...document.querySelectorAll('[data-person],[data-pump],[data-bottle-position]')].some(overlap),below:l.top>=s.bottom-.5,inside:l.right<=document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth<=innerWidth};});
  assert(!layout.overlaps,'legend never covers apparatus at '+width);assert(layout.inside&&layout.scroll);assert.equal(layout.below,width<=700);
  if(width===920||width===390)await page.screenshot({path:path.join(__dirname,'artifacts','legend-'+width+'.png')});
 }
 await page.setViewportSize({width:920,height:900});await page.locator('[data-pump-button]').click({clickCount:5});
 await page.evaluate(()=>{window.overlaps=[];window.framesChecked=0;const tick=()=>{const l=document.querySelector('[data-energy-legend]').getBoundingClientRect(),b=document.querySelector('[data-bottle-position]').getBoundingClientRect();framesChecked++;if(Math.min(l.right,b.right)-Math.max(l.left,b.left)>.5&&Math.min(l.bottom,b.bottom)-Math.max(l.top,b.top)>.5)overlaps.push(document.querySelector('[data-simulation]').dataset.phase);if(document.querySelector('[data-simulation]').dataset.phase!=='landed')requestAnimationFrame(tick);};tick();});
 await page.waitForFunction(()=>document.querySelector('[data-simulation]').dataset.phase==='landed',null,{timeout:15000});assert.deepEqual(await page.evaluate(()=>overlaps),[],'legend clear throughout complete flight');assert(await page.evaluate(()=>framesChecked>100));
 await page.locator('[data-energy-button]').click();assert(await legend.isHidden());await page.locator('[data-energy-button]').click();await page.waitForTimeout(350);await page.reload();await page.locator('[data-pump-button]').waitFor();assert(await legend.isVisible(),'saved energy setting restores legend');

 // Legacy boolean migration is also supported directly by the simulation API.
 const source=fs.readFileSync(path.join(dir,'simulation.js'),'utf8');await page.addScriptTag({content:source});
 for(const oldValue of [false,true]){const result=await page.evaluate(value=>{const host=document.createElement('div');document.body.append(host);const sim=createRocketSimulation(host,{energyVisible:true,legendLabelsVisible:value});const names=sim.getState().legendNames;sim.destroy();host.remove();return names;},oldValue);assert.deepEqual(Object.values(result),[oldValue,oldValue,oldValue,oldValue]);}
 assert.deepEqual(errors,[]);console.log('PASS: legend toggle/restore, four exact colors, 920/701/610/390 responsive layout, no flight overlap.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
