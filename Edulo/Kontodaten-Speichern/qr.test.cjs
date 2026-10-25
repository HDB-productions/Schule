// Synthetic local fixtures only. jsQR 1.4.0 independently decodes canvas pixels.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
const jsQR=require('./vendor/jsQR.js');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8');
const own='ab-123456-abcdef-987654',pupil='cd-fedcba-123456-654321',teacher='ef-111111-222222-333333';
const record=id=>`UserID: ${id} | Benutzername: fixture.student`;
let options={},browser,checks=0;
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html.replace('<body>','<body>'+`<input id="e1_text_input" value="${options.saved||''}" ${options.readonly?'readonly':''}><input id="e2_input" value="untouched"><script>
window.metrics={input:0,change:0,network:0,storage:0,checks:0};
Storage.prototype.setItem=Storage.prototype.removeItem=Storage.prototype.clear=function(){metrics.storage++};
window.fetch=function(){metrics.network++;throw Error('Unexpected fetch')};XMLHttpRequest.prototype.open=function(){metrics.network++};
window.widget={JSON:${JSON.stringify(options.remote?{remoteUserData:''}:{})},user:{uid:${JSON.stringify(options.remote?teacher:own)},name:'fixture.student'},check(){metrics.checks++},save(){metrics.checks++},findModule(){${options.noStorage?'return null':'return {JSON:{active:true},save(){}}'}}};
document.addEventListener('input',e=>{if(e.target.id==='e1_text_input')metrics.input++});document.addEventListener('change',e=>{if(e.target.id==='e1_text_input')metrics.change++});
</script>`));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:920,height:1000}}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 const base='http://127.0.0.1:'+server.address().port;
 async function load(opts={}){options=opts;await page.goto(base);await page.waitForTimeout(650);}
 async function decode(expected){
  assert(await page.locator('[data-qr-section]').isVisible());
  const pixels=await page.locator('canvas[data-qr]').evaluate(c=>({width:c.width,height:c.height,data:Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data)}));
  const decoded=jsQR(new Uint8ClampedArray(pixels.data),pixels.width,pixels.height);
  assert(decoded,'QR must independently decode from rendered pixels');assert.equal(decoded.data,expected);checks++;
 }
 async function hidden(){assert(await page.locator('[data-qr-section]').isHidden());checks++;}
 async function clean(changes){assert.deepEqual(await page.evaluate(()=>[metrics.network,metrics.storage,metrics.checks,metrics.change]),[0,0,0,changes]);assert.equal(await page.locator('#e2_input').inputValue(),'untouched');}
 for(const width of [920,390]){
  await page.setViewportSize({width,height:1000});await load();await decode(own);await clean(1);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const box=await page.locator('canvas[data-qr]').boundingBox();assert(box.x>=0&&box.x+box.width<=width);checks++;
  if(process.env.QR_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.QR_SCREENSHOT_DIR,`kontodaten-qr-${width}.png`),fullPage:true});
  await page.waitForTimeout(1050);await clean(1);
  await load({remote:true,saved:record(pupil)});await decode(pupil);await clean(0);
  if(process.env.QR_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.QR_SCREENSHOT_DIR,`kontodaten-qr-pupil-${width}.png`),fullPage:true});
  await page.locator('#e1_text_input').evaluate((e,value)=>e.value=value,record(own));await page.waitForTimeout(650);await decode(own);await clean(0);
  await page.locator('#e1_text_input').evaluate(e=>e.value='');await page.waitForTimeout(650);await hidden();await clean(0);
  await load({remote:true});await hidden();await clean(0);
  await load({noStorage:true});await decode(own);await clean(0);
  await page.evaluate(()=>widget.user=null);await page.waitForTimeout(650);await hidden();await clean(0);
  await load({readonly:true});await decode(own);await clean(0);
 }
 assert.deepEqual(errors,[]);assert(requests.every(url=>url===base+'/'),'Only local fixture navigation may request a resource');
 console.log(`PASS ${checks} QR fixture checks: independent jsQR canvas decode, exact raw UID, remote selection/switch/empty, logout, storage failures, 920/390 layout; no extra E1 writes or network. No live Edulo or physical scanner test.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
