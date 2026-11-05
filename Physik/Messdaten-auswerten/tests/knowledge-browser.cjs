const {chromium}=require('playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 const url=pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href;
 try{
  await page.goto(url);
  assert.equal(await page.locator('details.knowledge').count(),6);
  assert.equal(await page.locator('details.knowledge[open]').count(),0);
  for(let step=1;step<=6;step++){
   const section=page.locator(`#schritt-${step}`),knowledge=section.locator(':scope > details.knowledge'),exercise=section.locator(':scope > details.exercise');
   assert.equal(await knowledge.count(),1);assert.equal(await exercise.count(),1);
   await knowledge.locator(':scope > summary').click();assert.equal(await knowledge.locator('.knowledge-content').isVisible(),true);
   await exercise.locator(':scope > summary').click();assert.equal(await exercise.locator('.exercise-title').isVisible(),true);
   await knowledge.locator(':scope > summary').click();assert.equal(await exercise.locator('.exercise-title').isVisible(),true);
   await exercise.locator(':scope > summary').click();
  }
  await page.goto(url+'#funktionsvergleich');assert.equal(await page.locator('#wissen-3').evaluate(e=>e.open),true);
  assert.equal(await page.locator('#typePanel').isVisible(),true);
  await page.goto(url+'#pruefen-quadratisch');assert.equal(await page.locator('#wissen-4').evaluate(e=>e.open),true);
  await page.goto(url+'#ueben-2');assert.equal(await page.locator('#ueben-2').evaluate(e=>e.open),true);assert.equal(await page.locator('#wissen-2').evaluate(e=>e.open),false);
  await page.locator('#search').fill('arithmetische');assert.equal(await page.locator('#wissen-1').evaluate(e=>e.open),true);
  await page.locator('#search').fill('');
  for(const width of [1280,320]){await page.setViewportSize({width,height:900});await page.locator('#schritt-1').scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:path.resolve(__dirname,`../qa/knowledge-${width}.png`)});}
  assert.deepEqual(errors,[]);console.log('Wissen/Üben: 6 unabhängige Bereiche, Direktlinks, Suche, 2 Ansichten bestanden.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
