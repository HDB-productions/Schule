const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8');
const server=http.createServer((req,res)=>res.end(raw));
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const size of [{width:1024,height:668},{width:1180,height:720}]){
  const page=await browser.newPage({viewport:size,hasTouch:true});
  await page.goto('http://127.0.0.1:'+server.address().port);
  assert.equal(await page.locator('.slot-leader').count(),0);
  assert.equal((await page.locator('.slot-target').allTextContents()).join(''),'');
  assert(await page.locator('.slot-target').evaluateAll(bs=>bs.every(b=>b.offsetWidth>=44&&b.offsetHeight>=44&&getComputedStyle(b).backgroundColor==='rgba(0, 0, 0, 0)')));
  await page.screenshot({path:path.join(__dirname,`dynamot-slots-${size.width}.png`)});
  for(const slot of ['M1','M2','M3','L1','L2','L3','L4']){
   await page.locator(`[data-slot=${slot}]`).tap();
   await page.locator(`[data-add-slot=${slot}]`).tap();
   assert(await page.locator(`[data-slot=${slot}]`).isHidden());
   await page.locator('[data-action=close-device]').tap();
  }
  assert.match(await page.locator('canvas').getAttribute('aria-label'),/7 Geräte/);
  await page.close();
 }
 console.log('All seven original slots: tablet touch insertion, occupied slots hidden, 44px transparent targets, no duplicate labels or leaders passed.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
