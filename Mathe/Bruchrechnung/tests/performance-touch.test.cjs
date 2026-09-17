// Regression: long legacy states, batched host writes and real touch input.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const files=['Brueche verstehen.html','Anteile berechnen.html','Das Ganze bestimmen.html','Anteile berechnen 2.html'];
const hooks=`Object.defineProperty(window,'state',{configurable:true,get:()=>state,set:v=>state=v});Object.assign(window,{fresh,render,save,parseState,encodeState});window.pool=typeof POOL==='undefined'?null:POOL;`;
const pages=files.map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8').replace(/connect\(\);\s*\}\)\(\);/,hooks+'connect();})();'));
let browser;const server=http.createServer((req,res)=>{const i=Number(req.url.split('?')[0].slice(1))||0;res.setHeader('Content-Type','text/html;charset=utf-8');res.end('<textarea id="e1_text_input"></textarea>'+Array.from({length:20},(_,i)=>`<input id="e2_cloze_text_input_${i+1}">`).join('')+'<script>window.widget={};window.writes=0;document.querySelector("textarea").addEventListener("change",()=>window.writes++);</script>'+pages[i]);});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'msedge'});
 for(let i=0;i<files.length;i++){
  const page=await browser.newPage({viewport:{width:900,height:1100},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port+'/'+i+'?edulo=1');await page.locator('#exercise').waitFor();
  // A pre-change-format state with 1,000 complete tasks and an unfinished answer.
  await page.evaluate(basic=>{
   state=fresh();const task=basic?{n:3,d:4,mode:1,form:'fraction'}:pool.find(t=>t.scene==='tape'&&t.n===3&&t.d===4);
   const a=basic?{task,step:'number',answer:{whole:'',n:'3',d:'4'},parts:4,selected:[],attempts:[],hadError:false,started:'2026-09-10'}:{task,flowVersion:3,mode:'divide',route:'divide',stage:'unit',parts:4,copies:1,selected:[0,1,2],input:'12',attempts:[],hadError:false,work:[],started:'2026-09-10'};
   state.active=a;state.points=basic?7:8;state.history=Array.from({length:1000},(_,j)=>({task:{...task},route:j%2?'divide':'multiply',correct:j%3!==0,attempts:[],work:[],started:'2026-09-10'}));
   const legacy=encodeState(state),decoded=parseState(legacy);if(JSON.stringify(decoded)!==JSON.stringify(state))throw Error('legacy roundtrip changed');state=decoded;render();save();window.snapshot=JSON.parse(JSON.stringify(state));window.writes=0;
  },i===0);
  assert.equal(await page.locator('#historyList').locator(':scope > *').count(),0,'closed history must not be built');
  const input=i===0?'#numerator':'#answer';
  const timing=await page.evaluate(selector=>{const start=performance.now(),el=document.querySelector(selector);for(let n=0;n<40;n++){el.value=String(n);el.dispatchEvent(new Event('input',{bubbles:true}));}return {ms:performance.now()-start,writes:window.writes};},input);assert.equal(timing.writes,0);
  await page.waitForFunction(()=>window.writes===1,{},{timeout:3000}).catch(async e=>{console.log(await page.evaluate(()=>({writes:window.writes,storage:document.querySelector('#storage').textContent,active:state.active,host:document.querySelector('textarea').value.slice(0,40)})));throw e;});assert.equal(await page.evaluate(()=>JSON.stringify(parseState(document.querySelector('textarea').value).history)===JSON.stringify(snapshot.history)),true);
  // Pending text reaches the existing host field synchronously on pagehide.
  await page.locator(input).fill('987');await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));assert.equal(await page.evaluate(basic=>{const s=parseState(document.querySelector('textarea').value);return basic?s.active.answer.n:s.active.input},i===0),'987');
  await page.locator('#historyPanel > summary').click();await page.waitForFunction(()=>document.querySelector('#historyList').children.length===1000);
  await page.evaluate(()=>{window.firstHistory=document.querySelector('#historyList').firstElementChild;render();save()});assert.equal(await page.evaluate(()=>window.firstHistory===document.querySelector('#historyList').firstElementChild),true);await page.locator('#historyPanel > summary').click();
  await page.evaluate(basic=>{if(basic){state.active.step='mark';state.active.answer={whole:'',n:'3',d:'4'};}else state.active.stage='mark';state.active.selected=[];render();save();window.writes=0;},i===0);
  const selector=i===0?'.piece':'[data-part]';await page.locator(selector).first().scrollIntoViewIfNeeded();
  const centers=await page.locator(selector).evaluateAll(es=>es.slice(0,3).map(el=>{const b=el.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}}));
  const cdp=await page.context().newCDPSession(page);
  const touch=async(type,p)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:p?[{x:p.x,y:p.y,id:1,radiusX:2,radiusY:2}]:[]});
  await touch('touchStart',centers[0]);await touch('touchMove',centers[1]);await touch('touchMove',centers[2]);await touch('touchEnd');
  const selected=await page.evaluate(()=>state.active.selected);for(const n of [0,1,2])assert.ok(selected.includes(n),files[i]+' touch missed '+n);assert.equal(new Set(selected).size,selected.length);
  const after=await page.evaluate(()=>parseState(document.querySelector('textarea').value).active.selected);assert.deepEqual(after,selected);
  // Return over an already touched field in the same gesture must not toggle twice.
  await touch('touchStart',centers[0]);await touch('touchMove',centers[1]);await touch('touchMove',centers[0]);await touch('touchEnd');assert.equal(await page.evaluate(()=>state.active.selected.includes(0)||state.active.selected.includes(1)),false);
  // Mouse and keyboard retain single-cell toggling.
  await page.locator(selector).first().click();assert.equal(await page.evaluate(()=>state.active.selected.includes(0)),true);await page.locator(selector).first().press('Enter');assert.equal(await page.evaluate(()=>state.active.selected.includes(0)),false);
  assert.deepEqual(errors,[]);console.log('PASS',files[i],JSON.stringify({legacyTasks:1000,rapidInputs:40,hostWrites:1,inputMs:Math.round(timing.ms),touch:true}));await page.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
