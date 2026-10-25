// Local synthetic fixtures only. No Edulo server or account is accessed.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8');
const setup=`<script>window.widget={user:{ID:19319,Name:'Fixture Name',GUID:'ab-123456-abcdef-987654',nested:{password:'hide-password',token:'hide-token',session:'hide-session'}},JSON:{},save(){throw Error('save called')}};</script>`;
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url==='/parent'?`<!doctype html><body style="margin:0">${setup}<iframe src="/widget" style="border:0;width:100%;height:850px"></iframe>`:req.url==='/inline'?html.replace('<body>','<body>'+setup):html);});
let browser,checks=0;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:920,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.forbidden=[];window.clipboardValues=[];window.copyMode='success';
  const reject=name=>()=>{window.forbidden.push(name);throw Error(name+' forbidden')};
  for(const name of ['getItem','setItem','removeItem','clear'])Storage.prototype[name]=reject('storage.'+name);
  Object.defineProperty(document,'cookie',{configurable:true,get:reject('cookie read'),set:reject('cookie write')});
  window.fetch=reject('fetch');XMLHttpRequest.prototype.open=reject('xhr');navigator.sendBeacon=reject('beacon');
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.clipboardValues.push(value);if(copyMode!=='success')throw Error('blocked')}}});
  document.execCommand=()=>copyMode==='fallback';
 });
 const report=async frame=>JSON.parse(await frame.locator('[data-report]').inputValue());
 const refresh=async frame=>{await frame.locator('[data-refresh]').click();return report(frame)};
 await page.goto(base+'/widget');let r=await report(page);assert.equal(r.probe,'edulo-account-identity');assert.equal(r.frames[0].widgetPresent,false);checks++;
 await page.goto(base+'/inline');r=await report(page);let u=r.frames[0].widgetUser;assert.equal(u.ID,19319);assert.equal(u.Name,'Fixture Name');assert.equal(u.GUID,'ab-123456-abcdef-987654');
 for(const key of ['password','token','session']){assert.equal(u.nested[key].masked,true);assert.equal(u.nested[key].type,'string');assert.equal(typeof u.nested[key].length,'number');}assert(!JSON.stringify(r).includes('hide-'));checks++;
 await page.locator('[data-copy]').click();assert.equal((await page.evaluate(()=>clipboardValues))[0],await page.locator('[data-report]').inputValue());checks++;
 await page.evaluate(()=>copyMode='fallback');await page.locator('[data-copy]').click();assert.match(await page.locator('[data-status]').textContent(),/JSON kopiert/);checks++;
 await page.evaluate(()=>copyMode='blocked');await page.locator('[data-copy]').click();const text=await page.locator('[data-report]').inputValue();assert.deepEqual(await page.locator('[data-report]').evaluate(e=>[e.selectionStart,e.selectionEnd]),[0,text.length]);assert.match(await page.locator('[data-status]').textContent(),/markiert/);checks++;
 await page.evaluate(()=>{widget.user.huge='x'.repeat(100000);widget.user.circular=widget.user;widget.user.items=Array(1000).fill('item');Object.defineProperty(widget.user,'getter',{enumerable:true,get(){throw Error('getter read')}})});r=await refresh(page);u=r.frames[0].widgetUser;assert.equal(u.huge.truncated,true);assert.equal(u.huge.prefix.length,600);assert.equal(u.circular,'[circular]');assert.equal(u.items.length,12);assert.equal(u.getter,'[accessor not read]');assert(JSON.stringify(r).length<20000);checks++;
 await page.evaluate(()=>window.dispatchEvent(new MessageEvent('message',{source:window,data:'user|'+JSON.stringify({ID:19319,Name:'Message fixture',password:'message-secret',nested:{token:'another-secret'}})})));r=await refresh(page);assert.equal(r.userMessages.length,1);assert.equal(r.userMessages[0].user.password.masked,true);assert(!JSON.stringify(r).includes('message-secret'));assert(!JSON.stringify(r).includes('another-secret'));checks++;
 await page.evaluate(()=>{widget.user=null});r=await refresh(page);assert.equal(r.userMessages.length,0);checks++;
 await page.evaluate(()=>{let tree={leaf:'x'.repeat(600)};for(let i=0;i<5;i++)tree=Object.fromEntries(Array.from({length:100},(_,n)=>['branch'+n,tree]));widget.user={ID:19319,tree};});r=await refresh(page);assert(JSON.stringify(r).length<150000);assert(JSON.stringify(r).includes('Report budget reached'));checks++;
 await page.evaluate(()=>{widget.user={ID:17,Name:'Late fixture'}});await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-report]').value).frames[0].widgetUser?.ID===17);checks++;
 assert.deepEqual(await page.evaluate(()=>forbidden),[]);checks++;
 await page.goto(base+'/parent');const frame=page.frames().find(f=>f.url().endsWith('/widget'));await frame.waitForSelector('[data-report]');r=await report(frame);assert.equal(r.frames.find(f=>f.frame==='parent[1]').widgetUser.ID,19319);checks++;
 for(const width of [920,390]){await page.setViewportSize({width,height:900});assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  if(process.env.EDULO_SCREENSHOT_DIR){fs.mkdirSync(process.env.EDULO_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.EDULO_SCREENSHOT_DIR,`edulo-account-probe-${width}.png`),fullPage:true});}
 }
 assert.deepEqual(await page.evaluate(()=>forbidden),[]);assert.deepEqual(await frame.evaluate(()=>forbidden),[]);assert.deepEqual(errors,[]);checks++;
 console.log(`PASS ${checks} fixture checks: standalone, own/parent/late user, masking, bounded/circular values, message capture/logout, clipboard/selection, no storage/cookie/network/save calls, 920/390 layout, no script errors. No live Edulo test or public field mapping verification.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
