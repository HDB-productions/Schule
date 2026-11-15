// Local browser and simulated Edulo/API checks; no real AI charges.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const L=require('./task.js'),D=require('./domain.js'),uid='aa-bbbbbb-cccccc-dddddd';
const singleJS=process.env.EDULO_SINGLE_JS==='1',split=singleJS||process.env.EDULO_SPLIT==='1',nativeHost=require('./edulo-host-fixture.cjs');
const uploadDirectory=singleJS?'edulo-upload-eine-datei':'edulo-upload-toyota',scriptName=singleJS?'stroboskop-komplett-v4.js':'stroboskop-3d-v3.js',modelName=singleJS?null:'stroboskop-toyota-v3.bin';
let origin,mode='normal',savedResult,requests=[],fileRequests=[];
function fixture(html,options={}){const identityUid=options.uid||uid,endpointBase=options.apiBase||origin;return html.replace('<body>','<body><div id="contentWrapper"><div id="e1"><textarea id="e1_text_input"></textarea></div><div id="e2">'+Array.from({length:D.criteria(L).length},(_,i)=>'<input id="e2_cloze_text_input_'+(i+1)+'">').join('')+'</div><div id="footerButtons">Überprüfen Lösungen</div><script>'+`
const wrap=el=>({0:el,val(v){if(arguments.length){el.value=v;return this;}return el.value;}});
const mod={name:'cloze_text',loadUserInput(c,rows){for(const row of rows)for(const item of c.clozeInputs)if(item.JSON.id===row.id){item.inputElement.val(row.v);item.last=row.l||null;item.correct=row.c;item.helped=row.h;}},checkSingleClozeInput(item){const ok=item.inputElement.val().trim()==='1';item.correct=ok?'true':'false';return ok;},saveUserInput(c,out){for(const item of c.clozeInputs){out.input.push({id:item.JSON.id,v:item.inputElement.val(),l:item.last||'',c:item.correct,h:item.helped});out.counter.total++;if(item.correct==='true')out.counter.correct++;else if(item.inputElement.val()!=='')out.counter.wrong++;if(item.correct==='true'&&item.helped==='true')out.counter.helped++;}}};
const content={JSON:{},module:mod,clozeInputs:[]};
const storage={JSON:{active:'true'},save(){localStorage.setItem('fixture',JSON.stringify({e1:document.querySelector('#e1_text_input').value,rows:content.clozeInputs.map(i=>({id:i.JSON.id,v:i.inputElement.val(),l:i.last||'',c:i.correct,h:i.helped}))}));}};
content.clozeInputs=[...document.querySelectorAll('#e2 input')].map((el,i)=>({JSON:{id:100+i,values:[{value:'1'}]},inputElement:wrap(el),correct:'false',helped:'false',last:null}));
const stored=JSON.parse(localStorage.getItem('fixture')||'null');if(stored){document.querySelector('#e1_text_input').value=stored.e1;mod.loadUserInput(content,stored.rows);}
document.querySelector('#e1_text_input').addEventListener('change',()=>storage.save());
window.widget={JSON:{},user:{uid:${JSON.stringify(identityUid)}},isEditor:false,contentWrapper:{0:document.getElementById('contentWrapper')},forEachContent(fn){fn(content)},findModule(n){return n==='cloze_text'?mod:n==='save_load'?storage:null}};
const fixtureMode=new URLSearchParams(location.search).get('identity');if(fixtureMode==='missing')delete widget.user;if(fixtureMode==='remote')widget.JSON.remoteUserData={};
window.fixtureState=()=>{const raw=document.querySelector('#e1_text_input').value;return raw?JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw.slice(7)),c=>c.charCodeAt(0)))):null;};
`+'</script>').replace('</body>','</div></body>').replace(/^const API_BASE = .*$/m,'const API_BASE = '+JSON.stringify(endpointBase)+';');}

function splitFixture(editor=false){
 const snippet=fs.readFileSync(path.join(__dirname,uploadDirectory,'html-code.html'),'utf8');
 const files=[{url:'Zusatzdateien/'+scriptName},...(modelName?[{url:'Zusatzdateien/'+modelName}]:[])];
 const shell='<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script src="/fixture-jquery.js"></script></head><body><div id="html-module-own"></div></body></html>';
 const setup=`
 ${nativeHost.getOriginalHtmlModuleSource()}
 const htmlContent={id:'html-module-own',JSON:{id:'html-module-own',type:'html_and_files',html:${JSON.stringify(snippet)},files:${JSON.stringify(files)},nocheck:'true'},htmlElement:$('#html-module-own'),module:window.fixtureHtmlModule};
 const oldForEach=widget.forEachContent.bind(widget);widget.forEachContent=fn=>{oldForEach(fn);fn(htmlContent);};
 widget.isEditor=${editor};widget.refreshScrollbars=()=>{};window.fixtureMediaCalls=[];
 widget.getMediaURLPath=url=>{fixtureMediaCalls.push(url);return new URL('/files/'+encodeURIComponent(url.split('/').pop()),location.origin).href;};
 window.fixtureHtmlModule.refreshContent(htmlContent);
 `;
 return fixture(shell).replace('</body>','<script>'+setup+'</script></body>');
}

async function assert3DPlayers(page){
 assert(await page.locator('[data-motion=uniform],[data-motion=accelerated]').evaluateAll(players=>players.every(p=>p.dataset.vehicle==='2014 Toyota Corolla E180 EU (with interior)')));
 assert(await page.locator('[data-motion=uniform],[data-motion=accelerated]').evaluateAll(players=>players.every(p=>Number(p.dataset.wheelRadius)>0&&JSON.parse(p.dataset.wheelAngles).length===4&&JSON.parse(p.dataset.wheelAngles).every(Number.isFinite))));
 assert(await page.locator('.motion-player').evaluateAll(players=>players.every(p=>p.dataset.engine==='webgl-pbr'&&Number(p.dataset.wheels)===(p.dataset.motion==='ball'?0:4))));
}

async function trackNativeLoads(page){
 const counts={scriptsPerPage:[],binRequests:[]};
 page.on('request',request=>{
  if(request.isNavigationRequest()&&request.frame()===page.mainFrame())counts.scriptsPerPage.push(0);
  const pathname=new URL(request.url()).pathname;
  if(pathname==='/files/'+scriptName)counts.scriptsPerPage[counts.scriptsPerPage.length-1]++;
  if(/\.bin$/i.test(pathname))counts.binRequests.push(request.url());
 });
 await page.addInitScript(()=>{
  window.fixtureWebGLRequests=[];const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){if(/webgl/i.test(type))window.fixtureWebGLRequests.push(type);return Reflect.apply(original,this,[type,...args]);};
 });
 return counts;
}

const budget={remainingEuroMicros:990000,weeklyRemainingEuroMicros:180000,reservedEuroMicros:0};
function feedback(){return {summary:'',languageFeedback:'',misconceptions:[],nextSteps:[],taskFeedback:L.questions.map(q=>({id:q.id,feedback:'Begründe deine Beobachtung. <img src=x onerror=alert(1)>'})),criteria:D.criteria(L).map((c,i)=>({id:c.id,status:i===0?'partial':'met',feedback:''}))};}
const server=http.createServer(async(req,res)=>{
 res.setHeader('Content-Type','application/json');
 if(req.method==='GET'){
  if(split&&req.url==='/fixture-jquery.js'){res.setHeader('Content-Type','text/javascript;charset=utf-8');res.end(fs.readFileSync(nativeHost.jqueryPath));return;}
  if(split&&req.url.startsWith('/files/')){const name=decodeURIComponent(req.url.slice('/files/'.length));fileRequests.push(name);if(![scriptName,...(modelName?[modelName]:[])].includes(name)){res.statusCode=404;res.end();return;}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript;charset=utf-8':'application/octet-stream');const data=fs.readFileSync(path.join(__dirname,uploadDirectory,name));res.end(name.endsWith('.js')?data.toString('utf8').replaceAll('https://edulomodularai.hildebrandt.workers.dev',origin):data);return;}
  res.setHeader('Content-Type','text/html;charset=utf-8');
  if(split){if(req.url.startsWith('/standalone')){let html=fs.readFileSync(path.join(__dirname,uploadDirectory,'vorschau.html'),'utf8').replace('src="'+scriptName+'"','src="/files/'+scriptName+'"');if(modelName)html=html.replace('new URL("'+modelName+'"','new URL("/files/'+modelName+'"');res.end(html);}else res.end(splitFixture(req.url.startsWith('/editor')));return;}
  const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8');res.end(req.url.startsWith('/standalone')?html:fixture(html));return;
 }
 let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);requests.push({path:req.url,body});
 if(req.url==='/quota'){res.end(JSON.stringify({budget}));return;}
 if(req.url==='/result'){res.end(JSON.stringify(savedResult));return;}
 assert.equal(body.uid,uid);assert.equal(body.task.id,L.id);assert.deepEqual(body.task,D.task(L));assert.equal(Object.keys(JSON.parse(body.answer)).length,6);
 savedResult={taskId:L.id,taskVersion:L.version,requestId:body.requestId,feedbackStyle:'questions-v4',feedback:feedback(),budget,charge:{status:'settled',euroMicros:1000}};
 if(mode==='unknown'){res.statusCode=202;res.end(JSON.stringify({budget,charge:{status:'reserved'}}));return;}
 res.end(JSON.stringify(savedResult));
});
(async()=>{
 let browser;
 try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const pageLoads=split?await trackNativeLoads(page):null;
 if(split){
  const editorContext=await browser.newContext(),editor=await editorContext.newPage();editor.on('pageerror',e=>errors.push(e.message));const editorLoads=await trackNativeLoads(editor);await editor.goto(origin+'/editor');await editor.waitForFunction(()=>document.querySelectorAll('[data-answer]').length===6);await editor.waitForTimeout(300);
  assert.equal(fileRequests.filter(name=>name.endsWith('.bin')).length,0);assert(await editor.locator('[data-play]').evaluateAll(buttons=>buttons.length===3&&buttons.every(b=>b.disabled)));assert.deepEqual(await editor.evaluate(()=>fixtureWebGLRequests),[]);assert.deepEqual(editorLoads.scriptsPerPage,[1]);assert.deepEqual(editorLoads.binRequests,[]);await editorContext.close();
 }
 await page.goto(origin);await page.waitForFunction(()=>document.querySelector('[data-storage]')?.textContent.includes('Edulo'));
 assert.equal(await page.locator('[data-answer]').count(),6);assert.equal(await page.locator('.motion-player').count(),3);assert.equal(await page.locator('.motion-player canvas').count(),3);assert.equal(await page.locator('h1').count(),0);
 assert.equal(await page.locator('input[type=file], video').count(),0);
 const lessonText=await page.locator('.strobe-lesson').innerText();assert.doesNotMatch(lessonText,/upload|hochladen|datei auswählen/i);assert.match(lessonText,/Aufgabe\s*4/);assert.doesNotMatch(lessonText,/Aufgabe\s*5/);
 if(split){assert.equal(fileRequests.filter(name=>name.endsWith('.bin')).length,0);assert.deepEqual(await page.evaluate(()=>fixtureWebGLRequests),[]);assert.deepEqual(pageLoads.scriptsPerPage,[1]);assert(await page.evaluate(()=>window.fixtureHtmlModule.name==='html_and_files'&&widgetData.actions['html-module-own'].getParent().attr('id')==='html-module-own'&&document.querySelector('[data-edulo-id]').dataset.eduloInitialized==='1'));}
 else{await page.waitForFunction(()=>[...document.querySelectorAll('.motion-player')].every(p=>p.dataset.ready==='1'),null,{timeout:60000});await assert3DPlayers(page);}
 assert.match(await page.locator('.model-credit').innerText(),/Armored Wave/);
 assert.match(await page.locator('.model-credit').innerText(),/CC BY 4.0/);
 assert.equal(await page.locator('.motion-player [data-clock-face]').count(),3);assert.equal(await page.locator('.motion-player [data-clock-hand]').count(),3);
 assert(await page.locator('.motion-player').evaluateAll(players=>players.every(p=>p.dataset.mode==='ready'&&Number(p.dataset.time)===0&&Number(p.dataset.frames)===1)));
 const learningSnapshot=()=>page.evaluate(()=>JSON.stringify({history:fixtureState()?.data.history??[],scores:fixtureState()?.scores??[]}));
 const initialLearning=await learningSnapshot(),ball=page.locator('[data-motion=ball]');
 await ball.locator('[data-play]').click();
 await page.waitForFunction(()=>Number(document.querySelector('[data-motion=ball]').dataset.frames)>=3,null,{timeout:90000});
 assert.equal(await ball.getAttribute('data-mode'),'running');assert.notEqual(await ball.locator('[data-clock]').innerText(),'0,00 s');
 const movingClock=await ball.evaluate(p=>({time:Number(p.dataset.time),angle:Number(p.querySelector('[data-clock-hand]').dataset.angle)}));assert(movingClock.angle>0);assert(Math.abs(movingClock.angle-180*movingClock.time)<0.001);
 await ball.locator('[data-pause]').click();assert.equal(await ball.getAttribute('data-mode'),'paused');
 const pausedTime=await ball.getAttribute('data-time'),pausedFrames=Number(await ball.getAttribute('data-frames')),pausedAngle=await ball.locator('[data-clock-hand]').getAttribute('data-angle');
 await page.waitForTimeout(250);assert.equal(await ball.getAttribute('data-time'),pausedTime);assert.equal(await ball.locator('[data-clock-hand]').getAttribute('data-angle'),pausedAngle);
 await ball.locator('[data-pause]').click();
 await page.waitForFunction(frames=>Number(document.querySelector('[data-motion=ball]').dataset.frames)>frames,pausedFrames);
 assert(Number(await ball.getAttribute('data-time'))>Number(pausedTime));
 const resumedClock=await ball.evaluate(p=>({time:Number(p.dataset.time),angle:Number(p.querySelector('[data-clock-hand]').dataset.angle)}));assert(resumedClock.angle>Number(pausedAngle));assert(Math.abs(resumedClock.angle-180*resumedClock.time)<0.001);
 await page.waitForFunction(()=>document.querySelector('[data-motion=ball]').dataset.mode==='finished',null,{timeout:45000});
 assert.equal(Number(await ball.getAttribute('data-frames')),37);assert.equal(Number(await ball.getAttribute('data-time')),1.44);
 const recordedTimes=await ball.locator('[data-times] li').allTextContents();assert.equal(recordedTimes.length,37);
 recordedTimes.forEach((text,i)=>assert(Math.abs(parseFloat(text.split(':')[1].trim().replace(',','.'))-i*0.04)<1e-10));
 await ball.locator('[data-play]').click();assert.equal(await ball.getAttribute('data-mode'),'running');assert.equal(Number(await ball.getAttribute('data-frames')),1);assert.equal(await ball.locator('[data-times] li').count(),1);assert.doesNotMatch(await ball.locator('[data-motion-status]').innerText(),/Fertig/);
 for(const kind of ['ball','uniform','accelerated']){const player=page.locator('[data-motion='+kind+']');await player.locator('[data-final]').click();await page.waitForFunction(kind=>document.querySelector('[data-motion='+kind+']').dataset.mode==='finished',kind,{timeout:60000});assert.equal(Number(await player.getAttribute('data-frames')),kind==='ball'?37:6);await player.screenshot({path:path.join(__dirname,'snapshot-'+kind+'-3d.png')});}
 if(split){assert.equal(fileRequests.filter(name=>name.endsWith('.bin')).length,singleJS?0:1);if(singleJS)assert.deepEqual(pageLoads.binRequests,[]);await assert3DPlayers(page);}
 assert(await page.locator('[data-motion=uniform],[data-motion=accelerated]').evaluateAll(players=>players.every(p=>JSON.parse(p.dataset.wheelAngles).every(angle=>Number.isFinite(angle)&&Math.abs(angle+820/Number(p.dataset.wheelRadius))<1e-7))));
 assert.equal(await learningSnapshot(),initialLearning);assert.equal(requests.filter(r=>r.path==='/feedback').length,0);
 for(const width of [390,920,1440]){
 await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.equal(await page.locator('.strobe-lesson').evaluate(e=>getComputedStyle(e).overflowY),'visible');
 assert(await page.locator('.strobe-lesson').evaluate(e=>Math.abs(e.getBoundingClientRect().width-document.body.clientWidth)<2));
 assert(await page.locator('.motion-player, .motion-player canvas, .track').evaluateAll(elements=>elements.every(element=>element.scrollWidth<=element.clientWidth+1&&element.scrollHeight<=element.clientHeight+1)),'Animationsbereiche dürfen bei '+width+' px keine Scrollbalken benötigen.');
 await page.screenshot({path:path.join(__dirname,'preview-'+width+'.png'),fullPage:true});
 }
 for(const q of L.questions)await page.locator('[data-answer="'+q.id+'"]').fill('Meine Beobachtung zu '+q.id);
 await page.locator('[data-check]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status==='done');
 let state=await page.evaluate(()=>fixtureState());assert.equal(state.scores.length,14);assert.equal(state.scores[0],'gray');assert.equal(state.scores[1],'green');
 const scoredLearning=await learningSnapshot(),feedbackCount=requests.filter(r=>r.path==='/feedback').length;
 const uniform=page.locator('[data-motion=uniform]');await uniform.locator('[data-play]').click();await page.waitForFunction(()=>Number(document.querySelector('[data-motion=uniform]').dataset.time)>0.02);await uniform.locator('[data-pause]').click();await uniform.locator('[data-final]').click();
 assert.equal(await learningSnapshot(),scoredLearning);assert.equal(requests.filter(r=>r.path==='/feedback').length,feedbackCount);
 assert.equal(await page.locator('.aspects .task-feedback').count(),6);assert.equal(await page.locator('.aspects .task-feedback img').count(),0);
 assert((await page.locator('.aspects .task-feedback').first().innerText()).includes('<img'));
 await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.aspects .task-feedback').length===6);assert.equal(await page.locator('[data-answer=ball]').inputValue(),'Meine Beobachtung zu ball');
 await page.locator('[data-answer=ball]').fill('Überarbeitete Antwort');assert(await page.locator('[data-stale]').isVisible());
 mode='unknown';await page.locator('[data-check]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status==='unknown');
 const count=requests.filter(r=>r.path==='/feedback').length;assert(await page.locator('[data-check]').isDisabled());
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-recover]')&&!document.querySelector('[data-recover]').hidden);await page.locator('[data-recover]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status==='done');
 assert.equal(requests.filter(r=>r.path==='/feedback').length,count);assert.equal((await page.evaluate(()=>fixtureState())).scores[0],'gray');
 await page.goto(origin+'/standalone');await page.waitForFunction(()=>document.querySelector('[data-storage]')?.textContent.includes('Browser'));await page.locator('[data-answer=ball]').fill('Mein lokaler Entwurf');await page.waitForTimeout(900);await page.reload();await page.waitForFunction(()=>document.querySelector('[data-answer=ball]')?.value==='Mein lokaler Entwurf');
 assert.match(await page.locator('[data-identity]').innerText(),/eigene.*Edulo/);assert.deepEqual(errors,[]);
 if(split){assert.equal(fileRequests.filter(name=>name.endsWith('.bin')).length,singleJS?0:1,'Reloads and standalone drafts must not trigger another model request.');assert.deepEqual(pageLoads.scriptsPerPage,[1,1,1,1,1],'Exactly one native JS request is expected on each initial load/reload.');if(singleJS)assert.deepEqual(pageLoads.binRequests,[]);}
 if(singleJS)console.log('PASS: EDULO_SINGLE_JS=1, eine native JS-Zusatzdatei je Seitenaufruf, keine BIN-Anfragen, kein WebGL im Editor oder vor Animationsstart.');
 console.log('PASS: 390/920/1440px, WebGL-PBR-Zeitlupe mit vier geometrischen Autorädern, kontinuierliche Analoguhr, Pause/Weiter/Neustart und exakte Aufnahmezeiten, kein Animationszugriff auf KI/Punkte, kombinierte Aufgabe 4 ohne Dateiauswahl/Video, Edulo E1/E2, Feedback-Klartext, Wiederaufnahme, unklare Anfrage ohne zweite Belastung, Standalone-Entwurf.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

