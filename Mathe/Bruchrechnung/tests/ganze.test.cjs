// Integration: PLAYWRIGHT_MODULE auf die lokale Playwright-Installation setzen.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const raw=fs.readFileSync(path.join(__dirname,'..','Das Ganze bestimmen.html'),'utf8').replace(/\r\n/g,'\n');
const hooks=`Object.defineProperty(window,'state',{configurable:true,get:()=>state,set:v=>state=v});Object.defineProperty(window,'ready',{configurable:true,get:()=>ready,set:v=>ready=v});Object.assign(window,{fresh,render,save,pointRequirements,stats,parseState,encodeState,newTask,chooseTask,taskKey,given,SCENES,POOL,drawing,expected,rationalText,readNumber,submitAnswer,validTask,partitionOptions});`;
const html=raw.replace(/connect\(\);\s*\}\)\(\);/,hooks+'\nconnect();\n})();');
const storageKey='bruchrechnung-das-ganze-bestimmen-v1';
const fresh=()=>({version:1,widget:'das-ganze-bestimmen',mode:'divide',points:0,history:[],active:null});
const active=(mode='divide',task={scene:'ruler',whole:21,n:5,d:7})=>({flowVersion:3,task,mode,route:mode==='choice'?null:mode,stage:mode==='choice'?'route':'divideParts',parts:1,copies:1,selected:[],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()});
// Quantities must come from the same scenario pool as production.
const routeTask={scene:'tape',whole:21,n:5,d:7};
let initial='';
const fields=`<div id="e1"><textarea id="e1_text_input"></textarea></div><div id="e2">${Array.from({length:20},(_,i)=>`<input id="e2_cloze_text_input_${i+1}">`).join('')}</div>`;
const host=()=>fields.replace('</textarea>',initial.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea>')+`<script>window.widget={isEditor:location.pathname.includes('editor')};window.changes=0;document.addEventListener('change',()=>window.changes++);document.querySelector('textarea').addEventListener('input',e=>{let first=true;e.target.value=e.target.value.replace(/"/g,()=>{first=!first;return first?'“':'„';});});</script><iframe src="/app?edulo=1" style="width:100%;height:900px"></iframe>`;
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url.startsWith('/host')?host():req.url.startsWith('/inline')?'<html><body class="editor">'+fields+'<div id="slot"></div></body></html>':html);});
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
 const page=await browser.newPage({viewport:{width:1000,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('#exercise').waitFor();
 async function seed(s){await page.evaluate(({s,storageKey})=>{ready=false;localStorage.setItem(storageKey,JSON.stringify(s));},{s,storageKey});await page.reload();await page.locator('#exercise').waitFor();}
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('bruchrechnung-das-ganze-bestimmen-v1')));
 async function answer(target=page){const value=await target.evaluate(()=>rationalText(expected(state.active)));await target.locator('#answer').fill(value);await target.locator('#answerForm button').click();}
 async function solve(target=page,choice='divide'){
  for(let k=0;k<7;k++){
   const a=await target.evaluate(()=>state.active);if(a.stage==='done')return;
   if(a.stage==='route'){await target.locator(`[data-route=${choice}]`).click();continue;}
   if(['divideParts','copies','multiplyParts'].includes(a.stage)){await target.locator('#range').fill(String(await target.evaluate(()=>state.active.stage==='copies'?state.active.task.d:partitionOptions(state.active.task).indexOf(state.active.stage==='divideParts'?state.active.task.d:state.active.task.n)+1)));await target.locator('#checkRange').click();continue;}
   if(a.stage==='mark'){for(let i=0;i<a.task.n;i++)if(!a.selected.includes(i))await target.locator(`[data-part="${i}"]`).press('Enter');await target.locator('#checkMark').click();continue;}
   await answer(target);
  }assert.fail('Task did not finish');
 }

 const screenshotDir=process.env.SCREENSHOT_DIR;if(screenshotDir)fs.mkdirSync(screenshotDir,{recursive:true});
 const beaker={scene:'orange',whole:300,n:2,d:3};
 for(const width of [1000,390]){
  await page.setViewportSize({width,height:1100});await seed({...fresh(),active:active('divide',beaker)});
  const snapshot=async name=>{if(screenshotDir)await page.screenshot({path:path.join(screenshotDir,'integrated-'+name+'-'+width+'.png'),fullPage:true});};
  assert.match(await page.locator('#stepTitle').textContent(),/Teile das Ganze in Drittel/);
  assert.equal(await page.locator('.object').count(),1);assert.equal(await page.locator('#wholeSchema').count(),0);
  assert.doesNotMatch(await page.locator('.object').innerText(),/100|200|300/);await snapshot('partition');
  await page.locator('#range').fill('3');assert.equal(await page.locator('.object [data-region]').count(),3);
  const viewbox=await page.locator('.object svg').getAttribute('viewBox');
  await page.locator('#checkRange').click();assert.equal((await saved()).active.stage,'mark');
  assert.match(await page.locator('#stepTitle').textContent(),/Markiere zwei Drittel/);
  await page.locator('[data-part="0"]').click();await page.reload();assert.equal(await page.locator('[aria-pressed=true]').count(),1);
  await page.locator('[data-part="1"]').press('Enter');assert.equal(await page.locator('[data-known-total]').count(),0);await snapshot('mark');
  await page.locator('#checkMark').click();assert.equal((await saved()).active.stage,'unit');
  assert.equal(await page.locator('[data-known-total]').count(),1);assert.match(await page.locator('[data-known-total]').textContent(),/200 ml/);
  assert.equal(await page.locator('[data-part-amount]').count(),0);assert.doesNotMatch(await page.locator('.object').innerText(),/100|300/);
  assert.equal(await page.locator('[data-known=false]').count(),1);await snapshot('known-200');
  await page.locator('#answer').fill('200/2');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'unit');
  await page.locator('#answer').fill('100');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'result');
  assert.equal(await page.locator('[data-part-amount]').count(),3);assert.deepEqual(await page.locator('[data-part-amount]').evaluateAll(els=>els.map(el=>el.getAttribute('aria-label'))),['100 ml','100 ml','100 ml']);
  assert.equal(await page.locator('[data-known=false] [data-part-amount]').count(),1);assert.equal(await page.locator('[data-whole-total]').count(),0);
  assert.match(await page.locator('#stepTitle').textContent(),/fasst das ganze Gefäß/);await snapshot('parts-100');
  await page.reload();assert.equal(await page.locator('[data-part-amount]').count(),3);await page.locator('#answer').fill('300');await page.locator('#answerForm button').click();
  assert.match(await page.locator('[data-whole-total]').textContent(),/300 ml/);assert.equal(await page.locator('.object svg').getAttribute('viewBox'),viewbox);assert.equal(await page.locator('.object').count(),1);
  assert.deepEqual((await saved()).history[0].attempts.map(v=>v.stage),['divideParts','mark','unit','unit','result']);await snapshot('whole-300');
 }
 // Three fifths = 36 cm: five copies fill exactly three whole physical targets.
 const lengthTask={scene:'ribbon',whole:60,n:3,d:5};
 for(const width of [1000,390]){
  await page.setViewportSize({width,height:1100});await seed({...fresh(),mode:'multiply',active:active('multiply',lengthTask)});
  const shot=async name=>{if(screenshotDir)await page.screenshot({path:path.join(screenshotDir,'copies-'+name+'-'+width+'.png'),fullPage:true});};
  assert.match(await page.locator('#stepTitle').textContent(),/Teile das Ganze in Fünftel/);assert.equal(await page.locator('.object').count(),1);assert.doesNotMatch(await page.locator('.scene-board').innerText(),/36|60|180/);
  await page.locator('#range').fill('5');await page.locator('#checkRange').click();assert.match(await page.locator('#stepTitle').textContent(),/Markiere drei Fünftel/);
  for(let i=0;i<3;i++)await page.locator(`[data-part="${i}"]`).click();await page.locator('#checkMark').click();assert.equal((await saved()).active.stage,'copies');
  assert.match(await page.locator('#stepTitle').textContent(),/Wie oft brauchst du dieses markierte Stück, um drei ganze Strecken zu füllen/);
  assert.equal(await page.locator('[data-target-whole]').count(),3);assert.equal(await page.locator('#wholeSchema').count(),0);assert.equal(await page.locator('.main-target-picture').count(),1);assert.equal(await page.evaluate(()=>Math.abs(document.querySelector('[data-main-target-picture]').getBoundingClientRect().left-document.querySelector('.main-target-scroll').getBoundingClientRect().left)<1),true,'Shared row begins at the first whole on mobile');assert.equal(await page.locator('.copy-source,[data-copy-badge]').count(),0);assert.deepEqual(await page.locator('[data-target-whole]').evaluateAll(els=>els.map(el=>[el.getAttribute('x'),el.getAttribute('y')])),[['0','0'],['370','0'],['740','0']]);assert.match(await page.locator('[data-piece-measure]').textContent(),/36 cm/);
  for(const copies of [1,2,4,5,6,3]){
   await page.locator('#range').fill(String(copies));
   const regions=await page.locator('[data-target-whole] [data-region]').evaluateAll(els=>els.map(el=>Number(el.dataset.copyIndex)));
   assert.equal(regions.filter(Boolean).length,Math.min(copies*3,15));
   for(let i=0;i<15;i++)assert.equal(regions[i],i<copies*3?Math.floor(i/3)+1:0);
   assert.equal(await page.locator('[data-target-whole]').count(),3);assert.doesNotMatch(await page.locator('.scene-board').innerText(),/60 cm|180 cm/);
   if(copies===2){assert.deepEqual(regions.slice(0,6),[1,1,1,2,2,2]);await shot('two');}
   if(copies===5){assert.match(await page.locator('#copyStatus').textContent(),/genau gefüllt/);await shot('five');}
   if(copies===6)assert.match(await page.locator('#copyStatus').textContent(),/passt nicht/);
  }
  await page.reload();assert.equal((await saved()).active.copies,3);assert.equal(await page.locator('[data-target-part]:not([data-copy-index="0"])').count(),9);
  await page.locator('#checkRange').click();assert.equal((await saved()).active.stage,'copies');
  await page.locator('#range').fill('5');await page.locator('#checkRange').click();assert.equal((await saved()).active.stage,'product');
  assert.match(await page.locator('#stepTitle').textContent(),/Wie lang sind die drei ganzen Strecken zusammen/);assert.equal(await page.locator('[data-target-amount]').count(),0);
  await page.locator('#answer').fill('180');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'result');
  assert.match(await page.locator('#pictureWork').textContent(),/36 cm × 5 = 180 cm/);assert.doesNotMatch(await page.locator('.scene-board').innerText(),/60 cm/);await shot('total');
  assert.match(await page.locator('#stepTitle').textContent(),/Wie lang ist eine ganze Strecke/);await page.locator('#answer').fill('60');await page.locator('#answerForm button').click();
  assert.equal(await page.locator('[data-target-amount]').count(),3);assert.deepEqual((await saved()).history[0].work,['36 cm × 5 = 180 cm','180 cm ÷ 3 = 60 cm']);
  assert.equal(await page.locator('[data-completed-stage]').count(),5);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await shot('done');
 }
 const ropeTask={scene:'rope',whole:12,n:3,d:4};
 await seed({...fresh(),mode:'divide',active:{...active('divide',ropeTask),stage:'unit',parts:4,selected:[0,1,2]}});
 assert.match(await page.locator('[data-known-total] path').getAttribute('d'),/^M25 185H250 /);assert.equal(await page.locator('.object path[d^="M25 185H325"]').count(),0);assert.equal(await page.locator('[data-known-total] text').textContent(),'9 m');
 await seed({...fresh(),mode:'multiply',active:{...active('multiply',ropeTask),stage:'copies',parts:4,selected:[0,1,2],copies:4}});
 assert.equal(await page.locator('[data-piece-measure]').count(),4);assert.equal(await page.locator('.object path[d^="M25 185H325"]').count(),0);assert.doesNotMatch(await page.locator('.scene-board').innerText(),/Kopie|Markierte Teile zusammen/);
 assert.deepEqual(await page.locator('[data-piece-measure] text').allTextContents(),['9 m','9 m','9 m','9 m']);
 // An old unfinished sequence is retained as a snapshot and restarted with the same task.
 const legacy=active('divide',beaker);delete legacy.flowVersion;legacy.stage='unit';legacy.parts=2;legacy.attempts=[{stage:'divideParts',input:2,correct:true}];legacy.input='10';
 await seed({...fresh(),points:2,active:legacy});const migrated=(await saved());assert.equal(migrated.points,2);assert.equal(migrated.active.stage,'divideParts');assert.equal(migrated.active.previousFlow.input,'10');assert.equal(migrated.active.previousFlow.attempts.length,1);
 const oldMultiply=active('multiply',lengthTask);oldMultiply.flowVersion=2;oldMultiply.stage='product';oldMultiply.copies=5;oldMultiply.input='180';
 await seed({...fresh(),mode:'multiply',active:oldMultiply});assert.equal((await saved()).active.stage,'divideParts');assert.equal((await saved()).active.previousFlow.input,'180');
 const poolReport=await page.evaluate(()=>({count:POOL.length,scenes:new Set(POOL.map(t=>t.scene)).size,bad:POOL.filter(t=>t.n<2||!Number.isInteger(t.whole/t.d*2)||!Number.isInteger(given(t)*2)||(t.scene==='eggs'&&!Number.isInteger(t.whole/t.d))).length}));
 assert.equal(poolReport.scenes,20);assert.equal(poolReport.bad,0);assert.ok(poolReport.count>1000);
 const example={scene:'chocolate',whole:120,n:3,d:4};
 for(const mode of ['divide','multiply','choice'])for(const route of mode==='choice'?['divide','multiply']:[mode]){
  await seed({...fresh(),mode,active:active(mode,example)});
  assert.match(await page.locator('#story').textContent(),/90 g/);assert.doesNotMatch(await page.locator('#exercise').innerText(),/120 g|[×÷]/);
  if(mode==='choice')await page.locator(`[data-route=${route}]`).click();
  await solve(page,route);const h=(await saved()).history[0];assert.equal(h.correct,true);assert.equal(h.route,route);assert.equal(h.attempts.length,mode==='choice'?2:route==='multiply'?5:4);
  assert.deepEqual(h.work,route==='divide'?['90 g ÷ 3 = 30 g','30 g × 4 = 120 g']:['90 g × 4 = 360 g','360 g ÷ 3 = 120 g']);
  assert.equal(await page.locator('#pictureWork [data-equation]').count(),2);assert.match(await page.locator('#visualCaption').textContent(),/120 g/);
  await page.reload();assert.equal((await saved()).history.length,1);assert.equal((await saved()).active.stage,'done');
  await page.evaluate(()=>submitAnswer());assert.equal((await saved()).history.length,1);
  await page.locator('#next').click();assert.notDeepEqual((await saved()).active.task,example);
 }
 await seed({...fresh(),active:active('divide',example)});await page.locator('#checkRange').click();assert.equal((await saved()).active.hadError,true);await solve();assert.equal((await saved()).history[0].correct,false);
 await seed({...fresh(),mode:'choice',active:active('choice',example)});await page.locator('[data-route=divide]').click();
 await page.locator('#showTip').click();assert.match(await page.locator('#stepTip').textContent(),/90 g ÷ 3/);assert.doesNotMatch(await page.locator('#stepTip').textContent(),/120|×/);
 await page.locator('#answer').fill('90/3');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'unit');
 await page.locator('#answer').fill('30');await page.reload();assert.equal(await page.locator('#answer').inputValue(),'30');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'result');
 assert.equal(await page.locator('[data-completed-stage]').count(),2);assert.match(await page.locator('#pictureWork').textContent(),/30 g/);assert.equal(await page.locator('#stepTip').isVisible(),false);
 const layout=await page.evaluate(()=>({past:document.querySelector('#work').getBoundingClientRect().bottom,current:document.querySelector('#stepTitle').getBoundingClientRect().top,input:document.querySelector('#answerForm').getBoundingClientRect().bottom,picture:document.querySelector('.scene-board').getBoundingClientRect().top}));assert.ok(layout.past<=layout.current);assert.ok(layout.input<layout.picture);
 const numbers=await page.evaluate(()=>['1,5','1.600','1.600,5','3/4','30*4',''].map(readNumber));assert.deepEqual(numbers,[{n:3,d:2},{n:1600,d:1},{n:3201,d:2},null,null,null]);
 const points=await page.evaluate(()=>{const out=[];for(let p=1;p<=20;p++){state=fresh();const total=p*(p+3),min=p<3?0:Math.ceil(total/5);state.history=Array.from({length:total},(_,i)=>({task:POOL[0],route:i<min?'multiply':'divide',correct:true,attempts:[],work:[]}));save();out.push(state.points);if(min){state.points=0;state.history[0].route='divide';save();out.push(state.points===p-1);}}return out;});let pi=0;for(let p=1;p<=20;p++){assert.equal(points[pi++],p);if(p>2)assert.equal(points[pi++],true);}

 for(const width of [1000,390,320]){
  await page.setViewportSize({width,height:1100});
  for(const scene of await page.evaluate(()=>SCENES.map(s=>s.id))){
   for(const route of ['divide','multiply']){
    await page.evaluate(({scene,route})=>{state=fresh();state.mode=route;const task=POOL.find(t=>t.scene===scene&&t.n===3&&t.d===4)||POOL.find(t=>t.scene===scene);state.active={flowVersion:3,task,mode:route,route,stage:'divideParts',parts:1,copies:1,selected:[],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()};render();save();},{scene,route});
    await solve();assert.equal((await saved()).history[0].correct,true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,scene+' '+width);
    assert.equal(await page.locator('svg rect rect,svg path path,svg ellipse ellipse').count(),0);
    if(screenshotDir&&['chocolate','eggs','minutes','cola'].includes(scene)&&width!==320)await page.screenshot({path:path.join(screenshotDir,scene+'-'+route+'-'+width+'.png'),fullPage:true});
   }
  }
 }
 // Host transport tolerates EduLudoo's smart quote replacement and writes 20 gaps.
 initial='';await page.goto(base+'/host');const frame=page.frames().find(f=>f.url().includes('/app'));await frame.locator('#exercise').waitFor();await solve(frame);
 const hostState=await page.locator('#e1_text_input').inputValue();assert.ok(hostState.startsWith('GANZES1:'));assert.equal(JSON.parse(Buffer.from(hostState.slice(8),'base64').toString()).history.length,1);assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.locator('#e2').isVisible(),false);assert.equal((await page.locator('#e2 input').evaluateAll(els=>els.map(e=>e.value))).filter(v=>v==='0').length,20);
 await frame.evaluate(()=>{state.points=20;save();});assert.equal((await page.locator('#e2 input').evaluateAll(els=>els.map(e=>e.value))).filter(v=>v==='1').length,20);
 initial=await page.locator('#e1_text_input').inputValue();await page.reload();const restored=page.frames().find(f=>f.url().includes('/app'));await restored.locator('#exercise').waitFor();assert.equal(await restored.evaluate(()=>state.points),20);
 // Foreign/corrupt state is protected, and editor is a transient preview.
 initial='{"widget":"brueche-verstehen"}';await page.goto(base+'/host');let f=page.frames().find(f=>f.url().includes('/app'));await f.locator('#retry').waitFor();assert.equal(await page.locator('#e1_text_input').inputValue(),initial);assert.equal(await f.locator('#exercise').isVisible(),false);
 await page.goto(base+'/host-editor');f=page.frames().find(f=>f.url().includes('/app'));await f.locator('#exercise').waitFor();await solve(f);assert.equal(await page.locator('#e1').isVisible(),true);assert.equal(await page.locator('#e1_text_input').inputValue(),initial);assert.equal(await page.evaluate(()=>changes),0);
 // Reload with only ten available host gaps still permits interaction.
 initial='';await page.goto(base+'/host');await page.locator('#e2 input').evaluateAll(els=>els.slice(10).forEach(el=>el.remove()));const tenFrame=page.frames().find(f=>f.url().includes('/app'));await tenFrame.locator('#exercise').waitFor();await solve(tenFrame);assert.equal(await tenFrame.evaluate(()=>state.history.length),1);
 // Actual jQuery append pattern: host $ and UI survive repeated insertions.
 await page.goto(base+'/inline');const jquery=path.resolve(__dirname,'../../..','Chemie/Edulo Laborführerschen/Widget_224324_Luft_und_Gas_Regulieren.wdgt/libs/jquery-2.1.1.min.js');
 await page.addScriptTag({path:jquery});await page.evaluate(()=>{window.originalDollar=window.$;});
 const scriptBefore=raw.match(/<script>([\s\S]*?)<\/script>/i)[1];
 assert.equal(await page.evaluate(html=>window.$(html).find('script').addBack('script').last().text(),raw),scriptBefore,'Host prefilter must preserve every script template');
 const body=html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1],style=raw.match(/<style>([\s\S]*?)<\/style>/i)[1];
 for(let n=0;n<3;n++){await page.evaluate(({body,style})=>{window.$('#slot').empty().append(window.$('<style>'+style+'</style>'+body));},{body,style});await page.locator('#exercise').waitFor();assert.equal(await page.evaluate(()=>window.$===window.originalDollar),true);assert.equal(await page.locator('#e1').isVisible(),true);await page.locator('#help').click();await page.locator('#closeIntro').click();}

 for(const task of [{scene:'eggs',whole:12,n:3,d:4},{scene:'chocolate',whole:120,n:3,d:4},{scene:'minutes',whole:60,n:3,d:4}]){
  await page.evaluate(task=>{state=fresh();state.active={flowVersion:3,task,mode:'divide',route:'divide',stage:'mark',parts:4,copies:1,selected:[],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()};render();},task);
  assert.equal(await page.locator('svg rect rect,svg path path,svg ellipse ellipse').count(),0);
  if(task.scene==='eggs')assert.equal(await page.locator('.object ellipse').count(),24);
  if(task.scene==='chocolate')assert.equal(await page.locator('[data-chocolate-piece]').count(),24);
  if(task.scene==='minutes')assert.equal(await page.locator('.object svg text').count(),5);
  const boxes=await page.locator('.object svg [data-region]').evaluateAll(els=>els.map(el=>{const b=el.getBBox();return b.width>0&&b.height>0;}));assert.ok(boxes.every(Boolean));
  await page.locator('[data-part="0"]').press('Enter');assert.equal(await page.locator('[aria-pressed=true]').count(),1);await solve();
  if(screenshotDir)await page.screenshot({path:path.join(screenshotDir,'host-'+task.scene+'.png'),fullPage:true});
 }
 // The new packing graphics and their controls also run after actual legacy jQuery insertion.
 for(const task of [{scene:'eggs',whole:12,n:3,d:4},{scene:'chocolate',whole:120,n:3,d:4},{scene:'minutes',whole:60,n:3,d:4},{scene:'tape',whole:30,n:3,d:5}]){
  await page.evaluate(task=>{state=fresh();state.mode='multiply';state.active={flowVersion:3,task,mode:'multiply',route:'multiply',stage:'copies',parts:task.d,copies:1,selected:Array.from({length:task.n},(_,i)=>i),input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()};render();},task);
  assert.equal(await page.locator('[data-target-whole]').count(),task.n);
  assert.equal(await page.locator('[data-target-part]:not([data-copy-index="0"])').count(),task.n);
  await page.locator('#range').fill('2');assert.equal(await page.locator('[data-target-part]:not([data-copy-index="0"])').count(),2*task.n);
  const bounds=await page.locator('[data-target-part]:not([data-copy-index="0"])').evaluateAll(els=>els.every(el=>{const b=el.getBBox();return b.x>0&&b.y>0&&b.width>0&&b.height>0;}));assert.equal(bounds,true);
  if(task.scene==='chocolate')assert.equal(await page.locator('[data-chocolate-piece]').count(),24*task.n);
  if(task.scene==='eggs')assert.equal(await page.locator('[data-target-whole] [data-known=true] path[fill]').count(),18);
  if(task.scene==='tape')assert.equal(await page.locator('[data-fence]').count(),task.n);
  await solve();assert.equal(await page.locator('[data-target-amount]').count(),task.n);
  assert.equal(await page.locator('svg rect rect,svg path path,svg ellipse ellipse').count(),0);
 }
 // The delivered, uninstrumented file also runs directly without a server.
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'..','Das Ganze bestimmen.html')).href);await page.locator('#exercise').waitFor();assert.match(await page.locator('#storage').textContent(),/diesem Browser gespeichert/);const localQuestion=await page.locator('#question').textContent();await page.reload();assert.equal(await page.locator('#question').textContent(),localQuestion);
 assert.deepEqual(errors,[]);
 console.log('PASS: '+poolReport.count+' tasks, 20 scenarios, all routes, persistence, 20 reward thresholds, responsive graphics, EduLudoo and repeated editor insertion.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
