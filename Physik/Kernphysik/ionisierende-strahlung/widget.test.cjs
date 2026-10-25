// Local Edulo contract and mock-service simulation; no real accounts, APIs or charges.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const L=require('./task.js'),D=require('./domain.js'),uid='aa-bbbbbb-cccccc-dddddd';
let previewMode=false,feedbackStyle='questions-v3',misconceptionMode='present',taskFeedbackMode='present';
const groupedTexts=['Deine erste Erläuterung ist nachvollziehbar. Wie könntest du die Ursache noch genauer beschreiben?','Dein Vorschlag hat einen nachvollziehbaren Anfang. Welche Beobachtung würdest du für die Auswertung verwenden?','Du nennst eine Gefahr. Wie könntest du die Wirkung auf den Körper und mögliche Folgen genauer begründen?'];
const feedback=()=>({summary:'Welche deiner Erläuterungen könntest du noch genauer begründen?',languageFeedback:'Welche Sätze könntest du kürzer und eindeutiger formulieren?'+(previewMode?'':' <img src=x onerror=alert(1)>'),nextSteps:feedbackStyle==='questions-v3'?[]:['Welche deiner Aussagen braucht noch eine Begründung?','Wie könntest du deine drei Antworten nach dem erneuten Ansehen überarbeiten?'],...(taskFeedbackMode==='absent'?{}:{taskFeedback:L.questions.map((q,i)=>({id:q.id,feedback:groupedTexts[i]+(previewMode?'':' <img src=x onerror=alert(1)>')}))}),...(misconceptionMode==='absent'?{}:{misconceptions:misconceptionMode==='empty'?[]:[{statement:'UV-Licht und radioaktive Strahlung sind dasselbe.'+(previewMode?'':' <img src=x onerror=alert(1)>'),correction:'UV-Licht und die beim radioaktiven Zerfall ausgesandte Strahlung sind unterschiedliche Begriffe.'+(previewMode?'':' <b>Gezielte Klarstellung</b>')}]}),criteria:D.criteria(L).map((c,i)=>({id:c.id,status:i<3?'met':i===3?'partial':'missing',feedback:feedbackStyle==='questions-v3'?'':'CRITERION_TEXT_MUST_STAY_HIDDEN'}))});
const budget={remainingEuroMicros:980000,weeklyRemainingEuroMicros:180000,reservedEuroMicros:0,weekKey:'2026-W43'};
let mode='normal',quotaStatus=200,requests=[],savedResult,origin,browser;
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
const server=http.createServer(async(req,res)=>{if(req.url==='/connection'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({requestOrigin:req.headers.origin||null,originAllowed:true,ready:true}));return;}if(req.method==='GET'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fixture(fs.readFileSync(path.join(__dirname,'widget.html'),'utf8')));return;}let text='';for await(const chunk of req)text+=chunk;const body=JSON.parse(text);requests.push({path:req.url,body});res.setHeader('Content-Type','application/json');if(req.url==='/quota'){res.statusCode=quotaStatus;res.end(JSON.stringify(quotaStatus===200?{budget}:{error:{code:'quota_unavailable'}}));return;}if(req.url==='/result'){res.end(JSON.stringify(savedResult));return;}assert.equal(body.uid,uid);assert.equal(body.task.id,L.id);assert.equal(Object.keys(JSON.parse(body.answer)).length,3);savedResult={taskId:L.id,taskVersion:L.version,requestId:body.requestId,feedbackStyle,feedback:feedback(),budget,charge:{status:'settled',euroMicros:1200}};if(mode==='duplicate'){res.statusCode=409;res.end(JSON.stringify({error:{code:'duplicate_request'},charge:{status:'reserved'},budget}));}else if(mode==='unknown'){res.statusCode=202;res.end(JSON.stringify({budget,charge:{status:'reserved'}}));}else if(mode==='malformed'){res.end(JSON.stringify({...savedResult,requestId:'wrong'}));}else if(mode==='fail'){res.statusCode=503;res.end(JSON.stringify({error:{code:'not_ready'},charge:{status:'released'}}));}else if(mode==='network'){req.socket.destroy();}else res.end(JSON.stringify(savedResult));});
if(require.main===module)(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
async function init(query=''){await page.goto(origin+query);await page.waitForFunction(()=>document.querySelector('[data-storage]').textContent.includes('Edulo'));}
async function fill(){for(const q of L.questions)await page.locator('[data-answer="'+q.id+'"]').fill('Meine genaue Antwort zu '+q.id+'\nmit einer zweiten Zeile.');}
async function state(){return page.evaluate(()=>fixtureState());}
async function submit(){await page.locator('[data-check]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status!=='pending');}
await init();await page.locator('[data-connection-help] summary').click();await page.locator('[data-diagnose]').click();await page.waitForFunction(()=>document.querySelector('[data-diagnostics]').textContent.includes('Server erreichbar: ja'));assert.equal(requests.filter(r=>r.path==='/feedback').length,0);assert.match(await page.locator('[data-diagnostics]').innerText(),/Herkunft freigegeben: ja/);assert.equal(await page.locator('.ion-lesson textarea').count(),3);assert.equal(await page.locator('.ion-lesson input').count(),0);assert.match(await page.locator('[data-identity]').innerText(),/automatisch/);
for(const width of [390,920,1440]){await page.setViewportSize({width,height:900});assert(await page.locator('.ion-lesson').evaluate(el=>Math.abs(el.getBoundingClientRect().width-document.body.clientWidth)<2));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('.ion-lesson').evaluate(el=>getComputedStyle(el).overflowY),'visible');}
await page.setViewportSize({width:920,height:1000});if(process.env.WRITE_PREVIEWS==='1')await page.screenshot({path:path.join(__dirname,'preview-empty-920.png'),fullPage:true});await fill();await submit();let s=await state();assert.equal(s.data.history.length,1);assert.deepEqual(s.scores.slice(0,4),['green','green','green','gray']);assert.equal(s.data.history[0].answers.definition,'Meine genaue Antwort zu definition\nmit einer zweiten Zeile.');assert.equal(s.data.history[0].feedback.languageFeedback,feedback().languageFeedback);assert.equal(await page.locator('[data-language] img').count(),0);assert.match(await page.locator('[data-language]').innerText(),/<img/);assert.equal(await page.locator('#e2 input').evaluateAll(els=>els.filter(e=>e.value==='1').length),3);
assert.equal(s.data.history[0].feedbackStyle,'questions-v3');
assert.deepEqual(s.data.history[0].feedback.misconceptions,feedback().misconceptions);assert(await page.locator('[data-misconceptions-wrap]').isVisible());assert.equal(await page.locator('[data-misconceptions] img,[data-misconceptions] b').count(),0);assert.match(await page.locator('[data-misconceptions]').innerText(),/<img/);assert.match(await page.locator('[data-misconceptions]').innerText(),/<b>Gezielte Klarstellung<\/b>/);
assert.equal(await page.locator('[data-summary]').innerText(),feedback().summary);
assert.equal(await page.locator('.aspects strong').count(),0);assert.equal(await page.locator('.aspects li').count(),3);assert.deepEqual(await page.locator('.aspects .task-feedback').allTextContents(),feedback().taskFeedback.map(g=>g.feedback));assert.equal(await page.locator('.aspects img').count(),0);assert.equal(await page.locator('.question .point[role=img]').count(),13);
await page.locator('[data-history-label]').click();await page.locator('[data-history] details summary').first().click();
for(const c of D.criteria(L))assert(!(await page.locator('.ion-lesson').innerText()).includes(c.label),'rubric label must not reveal an expected solution: '+c.label);
assert.match(await page.locator('[data-history]').innerText(),/Welche deiner Erläuterungen könntest du noch genauer begründen\?/);
assert.deepEqual(await page.locator('[data-history] .task-feedback').allTextContents(),feedback().taskFeedback.map(g=>g.feedback));assert(!(await page.locator('[data-history]').innerText()).includes('CRITERION_TEXT_MUST_STAY_HIDDEN'));
assert.match(await page.locator('[data-history]').innerText(),/Fehlvorstellungen klären/);assert.match(await page.locator('[data-history]').innerText(),/UV-Licht und radioaktive Strahlung/);assert.equal(await page.locator('[data-history] img,[data-history] b').count(),0);
const times=await page.locator('.aspects a').evaluateAll(els=>els.map(e=>new URL(e.href).searchParams.get('t')));assert.deepEqual([...new Set(D.criteria(L).map(c=>c.source))],[14,54,195,261,392]);assert.deepEqual(times,['54s','195s','261s','392s'],'links are deduplicated per question');await page.reload();await page.waitForFunction(()=>document.querySelector('[data-feedback]').hidden===false);assert.deepEqual(await page.locator('.aspects .task-feedback').allTextContents(),feedback().taskFeedback.map(g=>g.feedback));assert.equal(await page.locator('[data-answer="definition"]').inputValue(),s.data.answers.definition);await page.locator('[data-answer="definition"]').fill('Neue Fassung');assert(await page.locator('[data-stale]').isVisible());
assert(await page.locator('[data-misconceptions-wrap]').isVisible());assert.match(await page.locator('[data-misconceptions]').innerText(),/UV-Licht und radioaktive Strahlung/);
feedbackStyle='questions-v1';misconceptionMode='absent';taskFeedbackMode='absent';await submit();assert.equal((await state()).data.history.at(-1).feedbackStyle,'questions-v1');assert(!Object.hasOwn((await state()).data.history.at(-1).feedback,'misconceptions'));assert(await page.locator('[data-misconceptions-wrap]').isHidden());assert.equal(await page.locator('[data-summary]').innerText(),feedback().summary);assert.deepEqual(await page.locator('.aspects .task-feedback').allTextContents(),Array(3).fill('Diese frühere Prüfung enthält noch keine zusammenhängende Rückmeldung zu dieser Aufgabe.'));assert(!(await page.locator('.ion-lesson').innerText()).includes('CRITERION_TEXT_MUST_STAY_HIDDEN'));
feedbackStyle='questions-v2';await submit();assert.equal((await state()).data.history.at(-1).feedbackStyle,'questions-v2');assert.deepEqual((await state()).scores,s.scores);assert(!(await page.locator('.ion-lesson').innerText()).includes('CRITERION_TEXT_MUST_STAY_HIDDEN'));
previewMode=true;feedbackStyle='questions-v3';misconceptionMode='empty';taskFeedbackMode='present';
await page.locator('[data-answer="definition"]').fill('Ionisierende Strahlung kann Elektronen aus Atomen entfernen. Es bleiben positiv geladene Ionen und freie Elektronen zurück.');
await page.locator('[data-answer="messung"]').fill('Man könnte ein Gas zwischen zwei Metallplatten verwenden.');
await page.locator('[data-answer="gefahren"]').fill('Die Strahlung kann Zellen schädigen.');
await submit();
assert(await page.locator('[data-misconceptions-wrap]').isHidden());assert.deepEqual((await state()).scores,s.scores,'clarifications never change independently earned points');assert.deepEqual((await state()).data.history.at(-1).feedback.misconceptions,[]);
if(process.env.GROUPED_PREVIEW==='1'){const preview=path.resolve('.edulo-tools/grouped-feedback-preview.png');fs.mkdirSync(path.dirname(preview),{recursive:true});await page.setViewportSize({width:920,height:1000});await page.screenshot({path:preview,fullPage:true});}
for(const width of [390,920]){await page.setViewportSize({width,height:1000});if(process.env.WRITE_PREVIEWS==='1')await page.screenshot({path:path.join(__dirname,'preview-feedback-'+width+'.png'),fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
mode='unknown';await submit();s=await state();const id=s.data.history.at(-1).requestId,before=requests.filter(r=>r.path==='/feedback').length;assert.equal(s.data.history.at(-1).status,'unknown');assert(await page.locator('[data-check]').isDisabled());await page.locator('[data-recover]').click();await page.waitForFunction(()=>fixtureState().data.history.at(-1).status==='done');assert.equal(requests.at(-1).path,'/result');assert.equal(requests.at(-1).body.requestId,id);assert.equal(requests.filter(r=>r.path==='/feedback').length,before);
mode='duplicate';await submit();assert.equal((await state()).data.history.at(-1).status,'unknown');await page.locator('[data-recover]').click();await page.waitForFunction(()=>fixtureState().data.history.at(-1).status==='done');quotaStatus=429;await page.locator('[data-refresh-budget]').click();await page.waitForFunction(()=>document.querySelector('[data-budget]').textContent.includes('Wochenlimit'));quotaStatus=200;mode='malformed';await submit();s=await state();assert.equal(s.data.history.at(-1).status,'unknown');assert.equal(s.scores.filter(c=>c!=='gray').length,3);await page.locator('[data-recover]').click();await page.waitForFunction(()=>fixtureState().data.history.at(-1).status==='done');
mode='fail';await submit();assert.equal((await state()).data.history.at(-1).status,'failed');assert(await page.locator('[data-check]').isEnabled());mode='network';await submit();assert.equal((await state()).data.history.at(-1).status,'unknown');assert(await page.locator('[data-check]').isDisabled());
const oldLesson={...L,version:'1',questions:L.questions.map(q=>({...q,criteria:q.criteria.filter(c=>c.id!=='q3_perception')}))};
const oldData=D.fresh(oldLesson);for(const q of oldLesson.questions)oldData.answers[q.id]='Erhaltene Antwort '+q.id;
const oldFeedback={summary:'LEGACY_LÖSUNG: Das Gas wird durch Strahlung ionisiert.',languageFeedback:'LEGACY_FORMULIERUNG: Ausführlich erklärt.',nextSteps:[],criteria:D.criteria(oldLesson).map(c=>({id:c.id,status:'met',feedback:'LEGACY_KRITERIUM: Vollständige alte Lösung.'}))};
D.finish(oldLesson,oldData,D.begin(oldLesson,oldData,'legacy-request','2026-10-25T12:00:00Z'),oldFeedback);
const oldEnvelope={widget:'ionisierende-strahlung-ki-v1',version:1,data:oldData,scores:Array(12).fill('green')};
const oldRaw='EDULO2:'+Buffer.from(JSON.stringify(oldEnvelope),'utf8').toString('base64');
await page.evaluate(raw=>{localStorage.clear();localStorage.setItem('fixture',JSON.stringify({e1:raw,rows:Array.from({length:13},(_,i)=>({id:100+i,v:i<12?'1':'',l:'',c:i<12?'true':'false',h:'false'}))}));},oldRaw);
await init();assert.equal(await page.locator('#e1_text_input').inputValue(),oldRaw,'migration load must not write E1');
assert.equal(await page.locator('[data-answer=definition]').inputValue(),'Erhaltene Antwort definition');
assert.equal(await page.locator('[data-points=gefahren] .point[data-color=gray]').count(),1);
assert(!(await page.locator('.ion-lesson').innerText()).includes('LEGACY_'));
assert.match(await page.locator('.ion-lesson').innerText(),/ältere|frühere|neue.*Prüfung/i);
await page.locator('[data-history-label]').click();await page.locator('[data-history] details summary').first().click();
assert(!(await page.locator('[data-history]').innerText()).includes('LEGACY_'),'legacy answer content stays hidden even when history is expanded');
for(const c of D.criteria(L))assert(!(await page.locator('[data-history]').innerText()).includes(c.label));
await page.locator('[data-answer=definition]').fill('Erhaltene Antwort definition, jetzt ergänzt');
await page.waitForFunction(()=>fixtureState().version===2);
const migrated=await state();assert.deepEqual(migrated.scores,[...Array(12).fill('green'),'gray']);assert.deepEqual(migrated.data.history[0].feedback,oldFeedback);
for(const identity of ['missing','remote']){await page.evaluate(()=>localStorage.clear());const n=requests.filter(r=>r.path==='/feedback').length;await init('/?identity='+identity);if(await page.locator('[data-answer=definition]').isEnabled())await fill();if(await page.locator('[data-check]').isEnabled())await page.locator('[data-check]').click();assert.equal(requests.filter(r=>r.path==='/feedback').length,n);assert.equal((await state())?.data.history.length||0,0);}
// Simulate the iPad fetch failure using isolated browser storage and local mocks.
// Only free reads may fall back; a paid feedback submission must never retry itself.
mode='normal';quotaStatus=200;
async function transportCase(blockQuotaFetch){
 const isolated=await browser.newContext(),p=await isolated.newPage(),calls=[];
 p.on('pageerror',e=>errors.push(e.message));
 p.on('request',request=>{const url=new URL(request.url());if(['/quota','/feedback','/result'].includes(url.pathname))calls.push({path:url.pathname,type:request.resourceType(),body:request.postDataJSON()});});
 try{
  if(blockQuotaFetch)await p.route('**/quota',route=>route.request().resourceType()==='fetch'?route.abort('failed'):route.continue());
  else await p.route('**/feedback',route=>route.abort('failed'));
  await p.goto(origin);await p.waitForFunction(()=>document.querySelector('[data-storage]').textContent.includes('Edulo'));
  await p.waitForFunction(()=>document.querySelector('[data-budget]').textContent.includes('Diese Woche'));
  assert.equal(await p.locator('.ion-lesson input').count(),0);
  for(const q of L.questions)await p.locator('[data-answer="'+q.id+'"]').fill('Synthetische Testantwort zu '+q.id);
  await p.locator('[data-check]').click();await p.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status!=='pending');
  const submitted=await p.evaluate(()=>fixtureState().data.history.at(-1));
  const paid=calls.filter(c=>c.path==='/feedback');assert.equal(paid.length,1,'a feedback submission is sent exactly once');
  assert.equal(paid[0].body.uid,uid);assert.equal(paid[0].body.requestId,submitted.requestId);
  if(blockQuotaFetch){
   assert.deepEqual(calls.filter(c=>c.path==='/quota').map(c=>c.type),['fetch','xhr']);
   assert.equal(paid[0].type,'xhr','successful free XHR read selects XHR for the subsequent single submission');
   assert.equal(submitted.status,'done');
  }else{
   assert.deepEqual(calls.filter(c=>c.path==='/quota').map(c=>c.type),['fetch']);
   assert.equal(paid[0].type,'fetch');assert.equal(submitted.status,'unknown');
   assert(await p.locator('[data-check]').isDisabled());
   await p.route('**/result',route=>{
    if(route.request().resourceType()==='fetch')return route.abort('failed');
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({taskId:L.id,taskVersion:L.version,requestId:route.request().postDataJSON().requestId,feedbackStyle,feedback:feedback(),budget,charge:{status:'settled',euroMicros:1200}})});
   });
   await p.locator('[data-recover]').click();await p.waitForFunction(()=>fixtureState().data.history.at(-1).status==='done');
   const recovered=calls.filter(c=>c.path==='/result');assert.deepEqual(recovered.map(c=>c.type),['fetch','xhr']);
   assert(recovered.every(c=>c.body.requestId===submitted.requestId));
   assert.equal(calls.filter(c=>c.path==='/feedback').length,1,'recovery never creates another paid submission');
  }
 }finally{await isolated.close();}
}
await transportCase(true);await transportCase(false);
assert.deepEqual(errors,[]);console.log('PASS: local Edulo E1/E2, identity blocks, exact history, scoring, replay, malformed/error handling, plain text, restoration and 390/920/1440 layouts. Simulated service only.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.closeAllConnections();server.close();});
module.exports={fixture};







