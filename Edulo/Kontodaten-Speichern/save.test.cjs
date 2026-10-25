// Synthetic local fixtures; this does not claim a live Edulo persistence test.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;
try {({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}
catch {({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8');
const uid='ab-123456-abcdef-987654',name='fixture.student',expected=`UserID: ${uid} | Benutzername: ${name}`;
let options={},persisted='',browser,checks=0;
const setup=()=>`<script>
window.metrics={input:0,change:0,storage:0,cookie:0,network:0,checks:0};
Storage.prototype.setItem=function(){metrics.storage++};Storage.prototype.removeItem=function(){metrics.storage++};Storage.prototype.clear=function(){metrics.storage++};
Object.defineProperty(document,'cookie',{get(){return ''},set(){metrics.cookie++}});
window.fetch=()=>{metrics.network++;throw Error('Unexpected network')};XMLHttpRequest.prototype.open=function(){metrics.network++};
window.widget=Object.assign({JSON:{},user:{uid:${JSON.stringify(uid)},name:${JSON.stringify(name)},ID:123,username:'wrong.alias'},check(){metrics.checks++},save(){metrics.checks++}},${JSON.stringify(options.widget||{})});
window.fixtureStorage={JSON:{active:${JSON.stringify(options.storageActive??true)}},save(){}};window.widget.findModule=()=>${options.noStorage?'null':'window.fixtureStorage'};
document.addEventListener('input',e=>{if(e.target.matches('#e1_text_input,[name=e1_input]'))metrics.input++});
document.addEventListener('change',e=>{if(e.target.matches('#e1_text_input,[name=e1_input]')){metrics.change++;window.persistFixture(e.target.value)}});
</script>`;
const fields=()=>options.noField?'':`${options.wrapper?'<div id="e1"><div class="inputcontainer">':''}${options.textarea?'<textarea name="e1_input">'+persisted+'</textarea>':'<input type="text" id="e1_text_input" value="'+persisted+'" '+(options.attrs||'')+'>'}${options.duplicate?'<input name="e1_input">':''}${options.wrapper==='control'?'<button id="other-control">Other control</button>':''}${options.wrapper==='iframe'?'<iframe id="other-frame" srcdoc="unrelated"></iframe>':''}${options.wrapper?'</div></div>':''}<input id="e2_input" value="unrelated answer">`;
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url.startsWith('/child')?html:options.iframe?`<!doctype html><body>${setup()}${fields()}<iframe src="/child" style="width:100%;height:700px;border:0"></iframe>`:html.replace('<body>','<body>'+setup()+fields()));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:920,height:900}});
 await context.addInitScript(()=>{window.metrics={input:0,change:0,storage:0,cookie:0,network:0,checks:0};Storage.prototype.setItem=function(){metrics.storage++};Storage.prototype.removeItem=function(){metrics.storage++};Storage.prototype.clear=function(){metrics.storage++};Object.defineProperty(document,'cookie',{configurable:true,get(){return ''},set(){metrics.cookie++}});window.fetch=()=>{metrics.network++;throw Error('Unexpected network')};XMLHttpRequest.prototype.open=function(){metrics.network++};});
 await context.exposeBinding('persistFixture',(_,value)=>{persisted=value});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port;
 const field=()=>page.locator('#e1_text_input,[name=e1_input]').first();
 async function clean(){assert.deepEqual(await page.evaluate(()=>[metrics.storage,metrics.cookie,metrics.network,metrics.checks]),[0,0,0,0]);if(!options.noField)assert.equal(await page.locator('#e2_input').inputValue(),'unrelated answer');}
 async function load(opts={},value=''){options=opts;persisted=value;await page.goto(base+'/'+(opts.query||''));await page.waitForTimeout(580);await clean();}
 async function noWrite(label,opts={},value=''){await load(opts,value);assert.equal(await page.evaluate(()=>metrics.change),0,label);if(!opts.noField)assert.equal(await field().inputValue(),value,label);checks++;}
 for(const textarea of [false,true]){
  await load({textarea});assert.equal(await field().inputValue(),expected);assert.deepEqual(await page.evaluate(()=>[metrics.input,metrics.change]),[1,1]);assert.equal(persisted,expected);assert.equal(await field().isVisible(),false);assert(await page.locator('main').isVisible());assert(await page.locator('[data-qr]').isVisible());assert(await page.locator('#e2_input').isVisible());checks++;
  await page.waitForTimeout(1050);assert.equal(await page.evaluate(()=>metrics.change),1);checks++;
  await page.reload();await page.waitForTimeout(580);assert.equal(await field().inputValue(),expected);assert.equal(await page.evaluate(()=>metrics.change),0);checks++;
 }
 await load();await page.evaluate(()=>widget.user.name='renamed.student');await page.waitForTimeout(580);assert.equal(await field().inputValue(),`UserID: ${uid} | Benutzername: renamed.student`);assert.equal(await page.evaluate(()=>metrics.change),2);checks++;
 await noWrite('another account',{},'UserID: zz-111111-222222-333333 | Benutzername: other.student');
 await noWrite('arbitrary pupil work',{},'My existing answer');
 for(const bad of [{ID:123,id:'123',name},{uid:'123',name},{uid:'ab-123456-abcdef',name},{uid,name:''},{uid,username:'wrong.alias'}])await noWrite('invalid identity',{widget:{user:bad}});
 for(const attrs of ['readonly','disabled','maxlength="4"'])await noWrite(attrs,{attrs});
 await noWrite('duplicate fields',{duplicate:true});
 await noWrite('missing save_load module',{noStorage:true});
 for(const storageActive of [false,'false'])await noWrite('inactive save_load',{storageActive});
 for(const widget of [{isEditor:true},{isFromEditor:true},{isTeacher:true},{user:{uid,name,teacher:1}},{user:{uid,name,Teacher:'1'}},{JSON:{asTest:true}},{JSON:{remoteUserData:'fixture'}},{JSON:{remoteUserData:''}},{JSON:{remoteClassData:''}}])await noWrite('protected mode',{widget});
 for(const query of ['?editor=1','?fromeditor=1','?input=synthetic'])await noWrite(query,{query});
 // Visibility fixtures use only local synthetic Edulo fields and mode switches.
 for(const widget of [{isEditor:true},{isFromEditor:true},{isTeacher:true},{user:{uid,name,teacher:1}},{JSON:{asTest:true}},{JSON:{remoteUserData:''}},{JSON:{remoteClassData:''}}]){
  await load({widget});assert(await field().isVisible());checks++;
 }
 for(const query of ['?editor=1','?fromeditor=1','?input=synthetic']){await load({query});assert(await field().isVisible());checks++;}
 for(const mode of ['isEditor','isTeacher','remoteUserData','asTest']){
  await load({wrapper:'safe'});assert.equal(await field().isVisible(),false);
  await page.evaluate(mode=>{if(mode==='remoteUserData'||mode==='asTest')widget.JSON[mode]=mode==='asTest'?true:'';else widget[mode]=true},mode);
  await page.waitForTimeout(580);assert(await field().isVisible());assert(await page.locator('#e1').isVisible());assert(await page.locator('.inputcontainer').isVisible());
  await page.evaluate(mode=>{delete widget[mode];delete widget.JSON[mode]},mode);
  await page.waitForTimeout(580);assert.equal(await field().isVisible(),false);checks++;
 }
 await load({wrapper:'safe'});assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.locator('.inputcontainer').isVisible(),false);assert.equal(persisted,expected);checks++;
 for(const wrapper of ['control','iframe']){
  await load({wrapper});assert.equal(await field().isVisible(),false);assert(await page.locator('#e1').isVisible());assert(await page.locator('.inputcontainer').isVisible());assert(await page.locator(wrapper==='control'?'#other-control':'#other-frame').isVisible());assert(await page.locator('#e2_input').isVisible());checks++;
 }
 await load();await page.evaluate(()=>{window.oldField=document.querySelector('#e1_text_input');const next=oldField.cloneNode();next.value='';oldField.replaceWith(next)});await page.waitForTimeout(580);
 assert.equal(await field().inputValue(),expected);assert.equal(await field().isVisible(),false);assert.equal(await page.evaluate(()=>oldField.hidden),false);checks++;
 await load({wrapper:'safe'});await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide')));assert(await field().isVisible());assert(await page.locator('#e1').isVisible());
 await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow')));await page.waitForTimeout(80);assert.equal(await field().isVisible(),false);checks++;
 await load({wrapper:'safe'});await page.locator('main').evaluate(el=>el.remove());await page.waitForTimeout(580);assert(await field().isVisible());assert(await page.locator('#e1').isVisible());assert(await page.locator('.inputcontainer').isVisible());checks++;
 await load({widget:{isTeacher:true}});assert.equal(await page.locator('[data-userid]').textContent(),uid);assert.equal(await page.locator('[data-username]').textContent(),name);assert.match(await page.locator('[data-status]').textContent(),/Grund: Lehrerkonto/);assert.equal(await page.evaluate(()=>metrics.change),0);checks++;
 for(const [widget,reason] of [[{JSON:{remoteUserData:''}},'remoteUserData'],[{JSON:{remoteClassData:''}},'remoteClassData'],[{JSON:{asTest:true}},'Prüfungsmodus']]){await load({widget});assert((await page.locator('[data-status]').textContent()).includes(reason));assert.equal(await page.evaluate(()=>metrics.change),0);if(reason!=='Prüfungsmodus')assert.equal(await page.locator('[data-userid]').textContent(),'Nicht verfügbar');checks++;}
 await load({noStorage:true});assert.equal(await page.locator('[data-userid]').textContent(),uid);assert.equal(await page.locator('[data-username]').textContent(),name);assert.match(await page.locator('[data-status]').textContent(),/Nicht gespeichert/);await page.evaluate(()=>widget.user=null);await page.waitForTimeout(580);assert.equal(await page.locator('[data-userid]').textContent(),'Nicht verfügbar');checks++;
 await load({widget:{JSON:{remoteUserData:''},user:{uid:'zz-111111-222222-333333',name:'teacher.account'}}},expected);
 assert.equal(await page.locator('[data-userid]').textContent(),uid);assert.equal(await page.locator('[data-username]').textContent(),name);assert.equal(await page.evaluate(()=>metrics.change),0);assert.equal(await field().inputValue(),expected);checks++;
 await load({noField:true});await page.evaluate(()=>{const f=document.createElement('input');f.id='e1_text_input';document.body.prepend(f)});await page.waitForTimeout(580);assert.equal(await field().inputValue(),expected);checks++;
 await load({widget:{user:null}});assert.equal(await page.evaluate(()=>metrics.change),0);await page.evaluate(({uid,name})=>widget.user={uid,name},{uid,name});await page.waitForTimeout(580);assert.equal(await field().inputValue(),expected);checks++;
 for(const key of ['isReady','initPerformed']){await load({widget:{[key]:false}});assert.equal(await page.evaluate(()=>metrics.change),0);await page.evaluate(key=>widget[key]=true,key);await page.waitForTimeout(580);assert.equal(await field().inputValue(),expected);checks++;}
 await load({iframe:true});const child=page.frames().find(f=>f.url().endsWith('/child'));assert.equal(await field().inputValue(),expected);assert.equal(await child.locator('[data-userid]').textContent(),uid);checks++;
 for(const width of [920,390]){await page.setViewportSize({width,height:900});await page.waitForTimeout(50);assert(await child.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;}
 await clean();assert.deepEqual(await child.evaluate(()=>[metrics.storage,metrics.cookie,metrics.network,metrics.checks]),[0,0,0,0]);assert.deepEqual(errors,[]);
 console.log(`PASS ${checks} local fixture checks: hidden input/textarea save/reload, protected mode transitions, safe/unsafe wrappers, field replacement, lifecycle restore, account safety, late readiness, parent iframe, 920/390 layout; zero storage/cookie/network/global-check actions. No live Edulo test.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
