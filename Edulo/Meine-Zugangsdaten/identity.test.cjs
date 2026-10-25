// Local fixture tests only; no real Edulo account or server is accessed.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;
try { ({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright')); }
catch { ({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }
const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8');
const publicId='ab-123456-abcdef-987654';
const setup=`<script>window.saves=0;window.widget={JSON:{},user:{ID:19319,id:'19319',uid:'${publicId}',name:'fixture.student',username:'wrong.alias',activations:[{UID:'zz-111111-222222-333333',Username:'old.name'}]},findModule(){return {save(){window.saves++}}}};</script>`;
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url==='/parent'?`<!doctype html><body>${setup}<iframe src='/widget' style='border:0;width:100%;height:800px'></iframe>`:req.url==='/inline'?html.replace('<body>','<body>'+setup):html);});
let browser,checks=0;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:920,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.storageWrites=0;window.clipboardValues=[];window.legacyValues=[];window.copyMode='success';
  Storage.prototype.setItem=function(){window.storageWrites++};
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async v=>{window.clipboardValues.push(v);if(window.copyMode!=='success')throw Error('fixture blocked')}}});
  document.execCommand=command=>{if(command==='copy')window.legacyValues.push(document.activeElement.value);return window.copyMode==='fallback'};
 });
 async function values(frame,id,username){await frame.waitForFunction(({id,username})=>document.querySelector('[data-value="id"]').value===id&&document.querySelector('[data-value="username"]').value===username,{id,username});checks++;}
 const id='[data-value="id"]',name='[data-value="username"]';
 await page.goto(base+'/inline');await values(page,publicId,'fixture.student');
 await page.locator('[data-copy="id"]').click();await page.locator('[data-copy="username"]').click();
 await page.waitForFunction(()=>clipboardValues.length===2);assert.deepEqual(await page.evaluate(()=>clipboardValues),[publicId,'fixture.student']);checks++;
 await page.evaluate(()=>copyMode='fallback');await page.locator('[data-copy="id"]').click();
 await page.waitForFunction(()=>legacyValues.length===1);assert.deepEqual(await page.evaluate(()=>legacyValues),[publicId]);assert.match(await page.locator('[data-copy-status]').textContent(),/ID kopiert/);checks++;
 await page.evaluate(()=>copyMode='blocked');await page.locator('[data-copy="username"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-copy-status]').textContent.includes('Text ist markiert'));
 assert.deepEqual(await page.locator(name).evaluate(e=>[e.selectionStart,e.selectionEnd]),[0,'fixture.student'.length]);checks++;
 await page.evaluate(()=>widget.user={ID:222,uid:'12-222222-333333-444444',name:'second.account'});await values(page,'12-222222-333333-444444','second.account');
 assert.equal(await page.locator('[data-copy-status]').textContent(),'');checks++;
 await page.evaluate(()=>widget.user=null);await values(page,'','');assert(await page.locator('[data-copy="id"]').isDisabled());checks++;
 await page.evaluate(()=>widget.user={ID:19319,id:'19319',name:'current.name',activations:[{UID:'zz-111111-222222-333333'}]});await values(page,'','current.name');assert(await page.locator('[data-copy="id"]').isDisabled());checks++;
 for(const uid of ['19319',19319,'12-123456-123456','12-123456-123456-123456-extra','']){
  await page.evaluate(uid=>widget.user={ID:19319,uid,name:'current.name'},uid);await page.waitForTimeout(550);await values(page,'','current.name');assert(await page.locator('[data-copy="id"]').isDisabled());checks++;
 }
 await page.evaluate(uid=>widget.user={uid,username:'wrong.alias',Username:'Wrong Case',activations:[{Username:'old.name'}]},publicId);await values(page,publicId,'');assert(await page.locator('[data-copy="username"]').isDisabled());checks++;
 for(const mode of ['teacher','editor','fromeditor','remote']){
  await page.evaluate(mode=>{widget.user={ID:444,uid:'44-111111-222222-333333',name:'hidden.account'};widget.JSON={};widget.isEditor=false;widget.isFromEditor=false;if(mode==='teacher')widget.user.Teacher='1';if(mode==='editor')widget.isEditor=true;if(mode==='fromeditor')widget.isFromEditor=true;if(mode==='remote')widget.JSON.remoteUserData='foreign answers';},mode);
  await values(page,'','');
  await page.waitForTimeout(550);assert.equal(await page.locator(id).inputValue(),'');checks++;
 }
 assert.equal(await page.evaluate(()=>storageWrites),0);assert.equal(await page.evaluate(()=>saves),0);checks++;
 await page.goto(base+'/parent');const frame=page.frames().find(f=>f.url().endsWith('/widget'));await values(frame,publicId,'fixture.student');
 assert.equal(await page.evaluate(()=>storageWrites),0);assert.equal(await frame.evaluate(()=>storageWrites),0);assert.equal(await page.evaluate(()=>saves),0);checks++;
 for(const width of [920,390]){await page.setViewportSize({width,height:900});await page.waitForTimeout(50);assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  if(process.env.EDULO_SCREENSHOT_DIR){fs.mkdirSync(process.env.EDULO_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.EDULO_SCREENSHOT_DIR,`edulo-identity-${width}.png`),fullPage:true});}
 }
 await page.goto(base+'/widget');await values(page,'','');
 await page.evaluate(()=>window.widget={JSON:{},user:null});await page.waitForTimeout(550);await values(page,'','');
 await page.evaluate(()=>widget.user={ID:555,uid:'55-111111-222222-333333',name:'late.account'});await values(page,'55-111111-222222-333333','late.account');
 assert.equal(await page.evaluate(()=>storageWrites),0);assert.deepEqual(errors,[]);checks++;
 console.log(`PASS ${checks} fixture checks: own/parent/late identity, switch/logout, privacy, clipboard fallbacks, no writes, 920/390 layout. No live Edulo test.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close();});
