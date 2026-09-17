const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const files=['Anteile berechnen.html','Das Ganze bestimmen.html','Anteile berechnen 2.html'];
const hooks=`Object.defineProperty(window,'state',{configurable:true,get:()=>state,set:v=>state=v});Object.assign(window,{fresh,render,save,POOL});`;
const html=files.map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8').replace(/connect\(\);\s*\}\)\(\);/,hooks+'connect();})();'));
const jquery=fs.readFileSync(path.resolve(__dirname,'../../../Chemie/Edulo Laborführerschen/Widget_224324_Luft_und_Gas_Regulieren.wdgt/libs/jquery-2.1.1.min.js'));
const server=http.createServer((req,res)=>{if(req.url==='/jquery'){res.setHeader('Content-Type','application/javascript');res.end(jquery);return;}res.setHeader('Content-Type','text/html;charset=utf-8');res.end('<body class="editor"><div id="slot"></div><script src="/jquery"></script></body>');});let browser;
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'msedge'});
for(let i=0;i<files.length;i++){
 const page=await browser.newPage({viewport:{width:800,height:1100},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);
 const body=html[i].match(/<body[^>]*>([\s\S]*)<\/body>/)[1],style=html[i].match(/<style>([\s\S]*?)<\/style>/)[1];await page.evaluate(({body,style})=>window.$('#slot').append(window.$('<style>'+style+'</style>'+body)),{body,style});await page.locator('#exercise').waitFor();
 const seed=async(scene='tape')=>{await page.evaluate(scene=>{state=fresh();const task=POOL.find(t=>t.scene===scene&&t.n===3&&t.d===4)||POOL.find(t=>t.scene===scene);state.active={flowVersion:3,task,mode:'divide',route:'divide',stage:'mark',parts:task.d,copies:1,selected:[],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()};render();},scene);await page.locator('[data-part]').first().scrollIntoViewIfNeeded();};
 const cdp=await page.context().newCDPSession(page);
 const touch=async(type,p)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:p?[{x:p.x,y:p.y,id:1}]:[]});
 const point=()=>page.locator('[data-part="0"]').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
 await seed();let p=await point();await touch('touchStart',p);await touch('touchEnd');assert.deepEqual(await page.evaluate(()=>state.active.selected),[0],'native tap');
 // Some embedding layers emit a compatibility mouse click without another mouse press.
 await page.evaluate(()=>document.querySelector('[data-part="0"]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:0})));assert.deepEqual(await page.evaluate(()=>state.active.selected),[0],'compatibility click must not undo touch');
 await seed();p=await point();await touch('touchStart',p);await touch('touchEnd');await page.evaluate(()=>document.querySelector('[data-part="0"]').dispatchEvent(new PointerEvent('click',{bubbles:true,detail:1,pointerType:'mouse'})));assert.deepEqual(await page.evaluate(()=>state.active.selected),[0],'mouse-labelled compatibility click');
 // Touchstart target is authoritative even if coordinate hit-testing disagrees.
 await seed();await page.evaluate(()=>{const target=document.querySelector('[data-part="0"]'),box=target.getBoundingClientRect(),container=document.querySelector('#objects'),hit=document.elementFromPoint;document.elementFromPoint=()=>container;const capture=container.setPointerCapture;container.setPointerCapture=()=>{};target.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:99,isPrimary:true,clientX:box.x+10,clientY:box.y+10}));container.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch',pointerId:99}));document.elementFromPoint=hit;container.setPointerCapture=capture;});assert.deepEqual(await page.evaluate(()=>state.active.selected),[0],'start field must be painted directly');
 // Actual touch taps and wipes in every available renderer, after legacy jQuery insertion.
 const scenes=await page.evaluate(()=>[...new Set(POOL.map(t=>t.scene))]);for(const scene of scenes){await seed(scene);
  // Find genuinely hittable interior pixels, not the bounding-box center of a clock arc.
  const pts=await page.evaluate(()=>[0,1].map(index=>{const group=document.querySelector(`[data-part="${index}"]`),r=group.getBoundingClientRect();for(let fy=.15;fy<1;fy+=.15)for(let fx=.15;fx<1;fx+=.15){const x=r.x+r.width*fx,y=r.y+r.height*fy;if(document.elementFromPoint(x,y)?.closest('[data-part]')===group)return {x,y};}throw Error('no hit point '+index);}));
  await touch('touchStart',pts[0]);await touch('touchEnd');assert.deepEqual(await page.evaluate(()=>state.active.selected),[0],scene+' short tap');await touch('touchStart',pts[0]);await touch('touchEnd');assert.deepEqual(await page.evaluate(()=>state.active.selected),[],scene+' second tap');
  await touch('touchStart',pts[0]);await touch('touchMove',pts[1]);await touch('touchEnd');const selected=await page.evaluate(()=>state.active.selected);assert.ok(selected.includes(0)&&selected.includes(1),scene+' wipe start/end');
 }
 await seed();await page.locator('[data-part="0"]').click();assert.deepEqual(await page.evaluate(()=>state.active.selected),[0]);await page.locator('[data-part="0"]').press('Enter');assert.deepEqual(await page.evaluate(()=>state.active.selected),[]);assert.deepEqual(errors,[]);console.log('PASS',files[i],scenes.length,'scenes: taps, start/end, compatibility clicks, legacy jQuery, mouse and keyboard');await page.close();
}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
