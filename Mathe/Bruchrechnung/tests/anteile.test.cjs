// Integration: PLAYWRIGHT_MODULE auf die lokale Playwright-Installation setzen.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const raw=fs.readFileSync(path.join(__dirname,'..','Anteile berechnen.html'),'utf8');
const hooks=`Object.defineProperty(window,'state',{configurable:true,get:()=>state,set:v=>state=v});Object.defineProperty(window,'ready',{configurable:true,get:()=>ready,set:v=>ready=v});Object.assign(window,{fresh,render,save,pointRequirements,stats,parseState,encodeState,newTask,chooseTask,taskKey,SCENES,POOL,drawing,expected,rationalText,readNumber,submitAnswer,validTask,partitionOptions});`;
const html=raw.replace(/connect\(\);\s*\}\)\(\);/,hooks+'\nconnect();\n})();');
const storageKey='bruchrechnung-anteile-berechnen-v1';
const fresh=()=>({version:1,widget:'anteile-berechnen',mode:'divide',points:0,history:[],active:null});
const active=(mode='divide',task={scene:'ruler',whole:21,n:5,d:7})=>({task,mode,route:mode==='choice'?null:mode,stage:mode==='choice'?'route':mode==='divide'?'divideParts':'copies',parts:1,copies:1,selected:[],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()});
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
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('bruchrechnung-anteile-berechnen-v1')));
 async function answer(target=page){const value=await target.evaluate(()=>rationalText(expected(state.active)));await target.locator('#answer').fill(value);await target.locator('#answerForm button').click();}
 async function solve(target=page,choice='divide'){
  for(let k=0;k<7;k++){
   const a=await target.evaluate(()=>state.active);if(a.stage==='done')return;
   if(a.stage==='route'){await target.locator(`[data-route=${choice}]`).click();continue;}
   if(['divideParts','copies','multiplyParts'].includes(a.stage)){await target.locator('#range').fill(String(await target.evaluate(()=>state.active.stage==='copies'?state.active.task.n:partitionOptions(state.active.task).indexOf(state.active.task.d)+1)));await target.locator('#checkRange').click();continue;}
   if(a.stage==='mark'){for(let i=0;i<a.task.n;i++)if(!a.selected.includes(i))await target.locator(`[data-part="${i}"]`).press('Enter');await target.locator('#checkMark').click();continue;}
   await answer(target);
  }assert.fail('Task did not finish');
 }
 // Every generated task has exact, suitable quantities. No split eggs.
 const poolReport=await page.evaluate(()=>({count:POOL.length,scenes:new Set(POOL.map(t=>t.scene)).size,bad:POOL.filter(t=>t.n<2||!validTask(t)||!Number.isInteger(t.whole*t.n/t.d*2)||(t.scene==='eggs'&&!Number.isInteger(t.whole/t.d))).length}));
 assert.equal(poolReport.scenes,20);assert.equal(poolReport.bad,0);assert.ok(poolReport.count>1000);
 for(const mode of ['divide','multiply','choice']){await seed({...fresh(),mode,points:1,history:[{task:{scene:'clay',whole:400,n:1,d:4},route:'divide',correct:true,attempts:[],work:[]}],active:active(mode,{scene:'clay',whole:400,n:1,d:4})});assert.ok((await saved()).active.task.n>=2);assert.equal((await saved()).points,1);assert.equal((await saved()).history[0].task.n,1);assert.equal((await saved()).mode,mode);}
 // Four guided stages, persistent partial input/marking, first-attempt record.
 await seed({...fresh(),active:active('divide',routeTask)});
 assert.equal(await page.locator('#historyPanel').getAttribute('open'),null);
 let layout=await page.evaluate(()=>({picture:document.querySelector('#objects').getBoundingClientRect().top,slider:document.querySelector('#checkRange').getBoundingClientRect().bottom,context:document.querySelector('#story').getBoundingClientRect().bottom,question:document.querySelector('#question').getBoundingClientRect().top}));assert.ok(layout.slider<layout.picture);assert.ok(layout.context<=layout.question);
 await page.locator('#range').fill('7');await page.locator('#checkRange').click();await page.locator('#answer').fill('3');await page.reload();assert.equal(await page.locator('#answer').inputValue(),'3');await page.locator('#answerForm button').click();
 await page.locator('[data-part="0"]').click();await page.reload();assert.equal(await page.locator('[aria-pressed=true]').count(),1);await solve();
 assert.equal((await saved()).history[0].correct,true);assert.equal((await saved()).history[0].attempts.length,4);assert.deepEqual((await saved()).history[0].work,['21 m ÷ 7 = 3 m','3 m × 5 = 15 m']);
 await page.evaluate(()=>submitAnswer());assert.equal((await saved()).history.length,1);
 assert.equal(await page.locator('[data-completed-stage]').count(),4);assert.equal(await page.locator('#flow').isVisible(),true);assert.equal(await page.locator('#pictureWork [data-equation]').count(),2);
 const prior=await page.evaluate(()=>taskKey(state.active.task));await page.locator('#next').click();assert.notEqual(await page.evaluate(()=>taskKey(state.active.task)),prior);
 // Wrong attempts stay visible and don't count toward rewards.
 await seed({...fresh(),active:active('divide',routeTask)});await page.locator('#checkRange').click();await solve();assert.equal((await saved()).history[0].correct,false);assert.equal((await saved()).history[0].attempts.length,5);
 // Multiplication before division, deliberately useful unreduced fraction.
 const useful={scene:'tape',whole:10,n:3,d:6};
 await seed({...fresh(),mode:'multiply',active:active('multiply',useful)});await solve();assert.deepEqual((await saved()).history[0].work,['10 m × 3 = 30 m','30 m ÷ 6 = 5 m']);assert.equal(await page.locator('#objects .object > svg').count(),3);
 for(const route of ['divide','multiply']){await seed({...fresh(),mode:'choice',active:active('choice',{scene:'tape',whole:12,n:3,d:6})});await solve(page,route);const h=(await saved()).history[0];assert.equal(h.route,route);assert.equal(h.attempts.length,2);assert.equal(h.correct,true);if(route==='divide')assert.equal(h.work[0],'12 m ÷ 6 = 2 m');}
 const numbers=await page.evaluate(()=>['1,5','1.5','5/3','10 / 6','0','1/0','abc','999999999999999999999999'].map(readNumber));assert.deepEqual(numbers.slice(0,5),[{n:3,d:2},{n:3,d:2},null,null,{n:0,d:1}]);assert.deepEqual(numbers.slice(5),[null,null,null]);
 const groupedNumbers=await page.evaluate(()=>['1.600','1.600,5','1.600 / 5','0.125','1.234.567','1.6.00'].map(readNumber));assert.deepEqual(groupedNumbers,[{n:1600,d:1},{n:3201,d:2},null,{n:1,d:8},{n:1234567,d:1},null]);
 // Numeric answers cannot bypass calculation with a division expression.
 await seed({...fresh(),mode:'multiply',active:{...active('multiply',{scene:'chocolate',whole:120,n:2,d:4}),stage:'result',parts:4,work:['120 g × 2 = 240 g']}});
 assert.match(await page.locator('#stepTitle').textContent(),/Wie viele Gramm/);assert.equal(await page.locator('#answerLabel').textContent(),'Dein Ergebnis');
 await page.locator('#answer').fill('240/4');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'result');assert.match(await page.locator('#feedback').textContent(),/Rechnungen und Brüche/);
 await page.locator('#answer').fill('60');await page.locator('#answerForm button').click();assert.equal((await saved()).active.stage,'done');
 for(const mode of ['choice','divide']){await seed({...fresh(),mode,active:active(mode,useful)});assert.equal(await page.evaluate(()=>Number.isInteger(state.active.task.whole/state.active.task.d*2)),true);}
 // All 20 thresholds, route quotas from third point, order independent.
 await seed({...fresh(),active:active('divide',routeTask)});
 const rewardReport=await page.evaluate(()=>{
  const h=(route)=>({task:{scene:'tape',whole:21,n:5,d:7},route,correct:true,work:[],attempts:[]});
  const reports=[];for(let p=1;p<=20;p++){const total=p*(p+3),minimum=p<=2?0:Math.ceil(total/5);state=fresh();state.history=Array.from({length:total},(_,i)=>h(i<minimum?'multiply':'divide'));save();reports.push(state.points);if(p>2){state.points=0;state.history[0].route='divide';save();reports.push(state.points===p-1);}}
  state=fresh();state.history=Array.from({length:100},()=>h('divide'));save();const blocked={points:state.points,missing:pointRequirements(2).missing};state.history.push(...Array.from({length:4},()=>h('multiply')));save();const progressed=state.points;const earned=state.points;state.history=[];save();return {reports,blocked,progressed,retained:state.points===earned};
 });
 assert.equal(rewardReport.blocked.points,2);assert.equal(rewardReport.blocked.missing.multiply,4);assert.equal(rewardReport.progressed,3);assert.equal(rewardReport.retained,true);
 let ri=0;for(let p=1;p<=20;p++){assert.equal(rewardReport.reports[ri++],p);if(p>2)assert.equal(rewardReport.reports[ri++],true);}
 // True keyboard selection and different renderers, both responsive widths.
 await seed({...fresh(),active:{...active('divide',{scene:'cola',whole:300,n:2,d:3}),stage:'mark',parts:3}});
 await page.locator('[data-part="0"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[aria-pressed=true]').count(),1);
 const screenshotDir=process.env.SCREENSHOT_DIR;if(screenshotDir)fs.mkdirSync(screenshotDir,{recursive:true});
 for(const size of [1000,390]){
  await page.setViewportSize({width:size,height:1100});
  for(const scene of await page.evaluate(()=>SCENES.map(s=>s.id))){
   await page.evaluate(scene=>{state=fresh();const task=POOL.find(t=>t.scene===scene&&t.d===4&&t.n===3)||POOL.find(t=>t.scene===scene);state.active={task,mode:'divide',route:'divide',stage:'mark',parts:task.d,copies:1,selected:[0],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()};render();},scene);
   assert.equal(await page.locator('.object > svg').count(),1);assert.ok(await page.locator('[data-part]').count()>=2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${scene} overflow ${size}`);
   if(screenshotDir&&size===1000)await page.locator('.scene-board').screenshot({path:path.join(screenshotDir,scene+'.png')});
  }
  if(screenshotDir)await page.screenshot({path:path.join(screenshotDir,'page-'+size+'.png'),fullPage:true});
 }
 // Mobile multiplication and clock wedges remain legible; both routes have visible operation arrows.
 for(const width of [1000,390,320]){
  await page.setViewportSize({width,height:1100});
  await seed({...fresh(),mode:'multiply',active:{...active('multiply',{scene:'cola',whole:300,n:3,d:4}),stage:'multiplyParts',parts:4,copies:3,work:['300 ml × 3 = 900 ml']}});
  assert.equal(await page.locator('#objects .object > svg').count(),3);assert.equal(await page.locator('.flow-arrow').count(),0);assert.equal(await page.locator('#flow').isVisible(),false);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(screenshotDir)await page.screenshot({path:path.join(screenshotDir,'multiply-'+width+'.png'),fullPage:true});
 }
 await page.setViewportSize({width:1000,height:1100});
 // Empty checked answers also count as a logged failed attempt.
 await seed({...fresh(),active:{...active('divide',routeTask),stage:'unit',parts:7}});await page.locator('#answerForm button').click();assert.equal((await saved()).active.hadError,true);assert.equal((await saved()).active.attempts[0].input,'');
 // Each available slider step groups chocolate and eggs into equal whole pieces.
 const grouping=await page.evaluate(()=>SCENES.filter(s=>s.kind==='chocolate'||s.discrete).every(s=>POOL.filter(t=>t.scene===s.id).every(t=>partitionOptions(t).every(p=>(s.kind==='chocolate'?24:t.whole)%p===0))));assert.equal(grouping,true);
 for(const task of [{scene:'chocolate',whole:120,n:5,d:6},{scene:'white-chocolate',whole:120,n:7,d:8},{scene:'eggs',whole:24,n:5,d:6}]){await seed({...fresh(),active:active('divide',task)});await solve();assert.equal((await saved()).history[0].correct,true);}
 // Each region gets its known unit amount only after the learner calculates it.
 await seed({...fresh(),active:{...active('divide',{scene:'chocolate',whole:120,n:2,d:4}),stage:'unit',parts:4}});
 assert.equal(await page.locator('[data-part-amount]').count(),0);await page.locator('#answer').fill('20');await page.locator('#answerForm button').click();assert.equal(await page.locator('[data-part-amount]').count(),0);
 await page.locator('#answer').fill('30');await page.locator('#answerForm button').click();assert.equal(await page.locator('[data-part-amount]').count(),4);assert.deepEqual(await page.locator('[data-part-amount]').evaluateAll(els=>els.map(el=>el.getAttribute('aria-label'))),Array(4).fill('30 g'));
 await page.locator('[data-part="0"]').click();await page.locator('[data-part="1"]').click();await page.reload();assert.equal(await page.locator('[data-part-amount]').count(),4);assert.equal(await page.locator('[aria-pressed=true]').count(),2);
 if(screenshotDir)await page.locator('.scene-board').screenshot({path:path.join(screenshotDir,'chocolate-known-parts.png')});await page.locator('#checkMark').click();assert.equal(await page.locator('[data-part-amount]').count(),4);await answer();
 for(const scene of await page.evaluate(()=>SCENES.map(s=>s.id))){
  await page.evaluate(scene=>{state=fresh();const task=POOL.find(t=>t.scene===scene&&t.d===4&&t.n===3)||POOL.find(t=>t.scene===scene);state.active={task,mode:'divide',route:'divide',stage:'mark',parts:task.d,copies:1,selected:[0],input:'',attempts:[],hadError:false,work:[task.whole+' ÷ '+task.d+' = '+task.whole/task.d],started:new Date().toISOString()};render();},scene);
  assert.equal(await page.locator('[data-part-amount]').count(),await page.evaluate(()=>state.active.task.d));
  if(screenshotDir&&['minutes','cola','eggs'].includes(scene))await page.locator('.scene-board').screenshot({path:path.join(screenshotDir,scene+'-known-parts.png')});
 }
 // Context first; hints reveal only the current operation; confirmed results live in the picture.
 const clay={scene:'clay',whole:400,n:4,d:5};await seed({...fresh(),mode:'multiply',active:active('multiply',clay)});
 assert.match(await page.locator('#story').textContent(),/400 g.*vier Fünftel/);assert.equal(await page.locator('#objects figcaption').count(),0);
 assert.doesNotMatch(await page.locator('#exercise').innerText(),/[×÷]/);assert.equal(await page.locator('#pictureWork').isVisible(),false);
 await page.locator('#range').fill('4');await page.locator('#checkRange').click();
 assert.match(await page.locator('[data-completed-stage=copies]').textContent(),/Stelle 4.*4 gleich große Ausgangsmengen/);
 assert.doesNotMatch(await page.locator('#exercise').innerText(),/[×÷]/);
 await page.locator('#showTip').click();assert.match(await page.locator('#stepTip').textContent(),/4 × 400 g/);assert.doesNotMatch(await page.locator('#stepTip').textContent(),/1[.]?600|÷/);
 await page.reload();assert.equal(await page.locator('#stepTip').isVisible(),true);await page.locator('#answer').fill('1600');await page.locator('#answerForm button').click();
 assert.match(await page.locator('[data-completed-stage=product]').textContent(),/Wie viele Gramm wiegen alle Ausgangsmengen zusammen.*1\.600 g/);assert.match(await page.locator('#pictureWork').textContent(),/4 × 400 g = 1\.600 g/);assert.equal(await page.locator('#stepTip').isVisible(),false);assert.doesNotMatch(await page.locator('#exercise').innerText(),/÷/);
 if(screenshotDir){await page.screenshot({path:path.join(screenshotDir,'clay-confirmed-wide.png'),fullPage:true});await page.setViewportSize({width:390,height:1100});await page.screenshot({path:path.join(screenshotDir,'clay-confirmed-mobile.png'),fullPage:true});await page.setViewportSize({width:1000,height:1100});}
 await page.locator('#range').fill('5');await page.locator('#checkRange').click();await page.locator('#answer').fill('80');await page.locator('#answerForm button').click();
 assert.match(await page.locator('#stepTip').textContent(),/1\.600 g ÷ 5/);assert.doesNotMatch(await page.locator('#pictureWork').textContent(),/320/);await page.locator('#answer').fill('320');await page.locator('#answerForm button').click();
 assert.equal(await page.locator('[data-completed-stage]').count(),4);assert.match(await page.locator('#pictureWork').textContent(),/320 g/);assert.equal((await saved()).history[0].correct,false);
 // Free selection follows the same layout and does not expose the second operation early.
 for(const route of ['divide','multiply']){
  await seed({...fresh(),mode:'choice',active:active('choice',clay)});assert.doesNotMatch(await page.locator('#exercise').innerText(),/[×÷]/);await page.locator(`[data-route=${route}]`).click();assert.doesNotMatch(await page.locator('#exercise').innerText(),/[×÷]/);
  const order=await page.evaluate(()=>({input:document.querySelector('#answerForm').getBoundingClientRect().bottom,picture:document.querySelector('.scene-board').getBoundingClientRect().top,past:document.querySelector('#work').getBoundingClientRect().bottom,current:document.querySelector('#stepTitle').getBoundingClientRect().top}));assert.ok(order.input<order.picture);assert.ok(order.past<=order.current);
  await answer();assert.equal(await page.locator('[data-completed-stage]').count(),2,JSON.stringify(await page.evaluate(()=>state.active)));assert.equal(await page.locator('#pictureWork [data-equation]').count(),1);assert.equal(await page.locator('#flow').isVisible(),false);await solve(page,route);assert.equal(await page.locator('#flow').isVisible(),true);
 }
 // Host transport tolerates EduLudoo's smart quote replacement and writes 20 gaps.
 initial='';await page.goto(base+'/host');const frame=page.frames().find(f=>f.url().includes('/app'));await frame.locator('#exercise').waitFor();await solve(frame);
 const hostState=await page.locator('#e1_text_input').inputValue();assert.ok(hostState.startsWith('ANTEIL1:'));assert.equal(JSON.parse(Buffer.from(hostState.slice(8),'base64').toString()).history.length,1);assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.locator('#e2').isVisible(),false);assert.equal((await page.locator('#e2 input').evaluateAll(els=>els.map(e=>e.value))).filter(v=>v==='0').length,20);
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
 // Host SVG regression: exactly twelve visible eggs, three highlighted; 24 chocolate tiles; clock labels.
 for(const task of [{scene:'eggs',whole:12,n:3,d:4},{scene:'chocolate',whole:120,n:3,d:4},{scene:'minutes',whole:60,n:3,d:4}]){
  await page.evaluate(task=>{state=fresh();state.active={task,mode:'divide',route:'divide',stage:'unit',parts:4,copies:1,selected:[],input:'',attempts:[],hadError:false,work:[],started:new Date().toISOString()};render();},task);
  assert.equal(await page.locator('svg rect rect,svg rect path,svg path path,svg ellipse ellipse').count(),0,'No malformed nested shapes');
  if(task.scene==='eggs'){assert.equal(await page.locator('.object path[fill="#087e70"]').count(),3);assert.equal(await page.locator('.object ellipse').count(),24);}
  if(task.scene==='chocolate')assert.equal(await page.locator('[data-chocolate-piece]').count(),24);
  if(task.scene==='minutes')assert.equal(await page.locator('.object svg text').count(),5);
  if(screenshotDir)await page.locator('.scene-board').screenshot({path:path.join(screenshotDir,'host-'+task.scene+'.png')});
  await answer();await page.locator('[data-part="0"]').click();assert.equal(await page.locator('[aria-pressed=true]').count(),1);await solve();
 }

 // The delivered, uninstrumented file also runs directly without a server.
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'..','Anteile berechnen.html')).href);await page.locator('#exercise').waitFor();assert.match(await page.locator('#storage').textContent(),/diesem Browser gespeichert/);const localQuestion=await page.locator('#question').textContent();await page.reload();assert.equal(await page.locator('#question').textContent(),localQuestion);
 assert.deepEqual(errors,[]);
 console.log('PASS: '+poolReport.count+' tasks, 20 scenarios, all routes, persistence, 20 reward thresholds, responsive graphics, EduLudoo and repeated editor insertion.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
