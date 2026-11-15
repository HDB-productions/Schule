const test=require('node:test'),assert=require('node:assert/strict');
const D=require('./domain.js'),L=require('./task.js');
const feedback=(status='met')=>({summary:'Fachlich nachvollziehbar.',languageFeedback:'Du kannst die Sätze kürzen.',nextSteps:[],criteria:D.criteria(L).map(c=>({id:c.id,status,feedback:'Begründung zum Aspekt.'}))});
function ready(){const s=D.fresh(L);for(const q of L.questions)s.answers[q.id]='Eigene Erläuterung zu '+q.id;return s;}
test('first success is green, wording feedback does not reduce points',()=>{const s=ready(),h=D.begin(L,s,'first','2026-10-25T12:00:00Z');D.finish(L,s,h,feedback());assert(D.valid(L,s));assert.deepEqual(D.scores(L,s),Array(13).fill('green'));});
test('missing and partial stay gray, later met becomes yellow; earned points persist',()=>{const s=ready(),h=D.begin(L,s,'a','now'),f=feedback();f.criteria[0].status='missing';f.criteria[1].status='partial';D.finish(L,s,h,f);assert.deepEqual(D.scores(L,s).slice(0,3),['gray','gray','green']);const next=D.begin(L,s,'b','later');D.finish(L,s,next,feedback());assert.deepEqual(D.scores(L,s).slice(0,3),['yellow','yellow','green']);D.finish(L,s,D.begin(L,s,'c','later'),feedback('missing'));assert.deepEqual(D.scores(L,s).slice(0,3),['yellow','yellow','green']);});
test('history keeps exact submitted answers and assistance snapshot',()=>{const s=ready();s.answers.definition='Zeile 1\nZeile 2 ä';D.assist(L,s,14);const h=D.begin(L,s,'a','time');s.answers.definition='Überarbeitet';assert.equal(h.answers.definition,'Zeile 1\nZeile 2 ä');assert(h.assisted.q1_positive_ion);D.finish(L,s,h,feedback());assert.equal(s.aspects.q1_positive_ion.earned,'yellow');assert.equal(h.feedback.languageFeedback,'Du kannst die Sätze kürzen.');});
test('pending and unknown block additional requests; empty answers block',()=>{const s=ready(),h=D.begin(L,s,'a','time');assert.throws(()=>D.begin(L,s,'b','time'));h.status='unknown';assert.throws(()=>D.begin(L,s,'b','time'));assert.throws(()=>D.begin(L,D.fresh(L),'c','time'));});
test('malformed, duplicate and foreign criteria are rejected without points',()=>{for(const mutate of [f=>f.criteria.pop(),f=>f.criteria[1].id=f.criteria[0].id,f=>f.criteria[0].status='correct',f=>f.criteria[0].id='foreign',f=>f.languageFeedback=null]){const s=ready(),h=D.begin(L,s,'a','time'),f=feedback();mutate(f);assert.equal(D.validFeedback(L,f),false);assert.throws(()=>D.finish(L,s,h,f));assert(D.scores(L,s).every(c=>c==='gray'));}const s=ready();D.begin(L,s,'a','time').status='failed';D.begin(L,s,'a','time');assert.equal(D.valid(L,s),false);});
module.exports={feedback};
test('new danger criterion has a verified video hint and remains separate from dose',()=>{
 const c=D.criteria(L).find(c=>c.id==='q3_perception');assert.equal(c.source,392);assert.match(c.description,/Sinnen/);assert.equal(L.questions[2].criteria.length,6);
});
test('repair uses the precise 5:57 hint while other verified hints and all four measurement IDs remain stable',()=>{
 const criteria=D.criteria(L),repair=criteria.find(c=>c.id==='q3_repair');assert.equal(repair.source,357);assert.equal(criteria.length,13);assert.deepEqual(L.questions[1].criteria.map(c=>c.id),['q2_ionisation','q2_setup','q2_process','q2_signal']);
 assert.deepEqual([...new Set(criteria.map(c=>c.source))],[14,54,195,261,357,392]);const s=ready();D.assist(L,s,357);assert.deepEqual(Object.entries(s.aspects).filter(([,a])=>a.assisted).map(([id])=>id),['q3_repair']);assert(D.scores(L,s).every(c=>c==='gray'));
 const evidence=require('./sources.json');assert(evidence.video.segments.find(s=>s.start===261).subsegments.some(s=>s.start===357));assert.match(evidence.editorialNotes.join(' '),/keine Pflicht/);
});
test('task contract groups all 13 criteria into exactly three questions',()=>{
 const task=D.task(L);assert.deepEqual(task.feedbackGroups,L.questions.map(q=>({id:q.id,prompt:q.title,criterionIds:q.criteria.map(c=>c.id)})));assert.equal(task.feedbackGroups.length,3);assert.deepEqual(task.feedbackGroups.flatMap(g=>g.criterionIds),D.criteria(L).map(c=>c.id));
});
test('grouped feedback is optional for old saves, exactly covers questions and never awards additional points',()=>{
 const taskFeedback=L.questions.map(q=>({id:q.id,feedback:'Eine zusammenhängende Rückmeldung zu '+q.id}));
 const f={...feedback('missing'),taskFeedback};f.criteria.forEach(c=>c.feedback='');assert(D.validFeedback(L,f));const s=ready();D.finish(L,s,D.begin(L,s,'grouped','time'),f);assert.deepEqual(D.scores(L,s),Array(13).fill('gray'));assert(D.valid(L,s));assert.deepEqual(s.history[0].feedback.taskFeedback,taskFeedback);
 for(const invalid of [undefined,null,[],taskFeedback.slice(1),[...taskFeedback,{id:'extra',feedback:'text'}],taskFeedback.map((g,i)=>i===1?{...g,id:taskFeedback[0].id}:g),taskFeedback.map((g,i)=>i===0?{...g,id:'foreign'}:g),taskFeedback.map((g,i)=>i===0?{...g,feedback:' '}:g),taskFeedback.map((g,i)=>i===0?{...g,feedback:'x'.repeat(1201)}:g)])assert.equal(D.validFeedback(L,{...f,taskFeedback:invalid}),false);
 assert(D.validFeedback(L,feedback()));assert(D.validFeedback(L,{...f,taskFeedback:taskFeedback.map(g=>({...g,feedback:'x'.repeat(1200)}))}));
});
test('misconceptions are optional for old saves, bounded and independent from scoring',()=>{
 const old=feedback();assert(D.validFeedback(L,old));
 for(const misconceptions of [[],[{statement:'UV-Licht ist radioaktive Strahlung.',correction:'Diese beiden Begriffe bezeichnen unterschiedliche Dinge.'}],Array.from({length:3},()=>({statement:'s'.repeat(300),correction:'c'.repeat(600)}))]){const f={...feedback('missing'),misconceptions},s=ready();assert(D.validFeedback(L,f));D.finish(L,s,D.begin(L,s,'misconception','time'),f);assert(D.scores(L,s).every(c=>c==='gray'));assert.deepEqual(s.history[0].feedback.misconceptions,misconceptions);assert(D.valid(L,s));}
 for(const misconceptions of [null,undefined,{},Array(4).fill({statement:'A',correction:'B'}),[{statement:' ',correction:'B'}],[{statement:'A',correction:''}],[{statement:'s'.repeat(301),correction:'B'}],[{statement:'A',correction:'c'.repeat(601)}],[{statement:123,correction:'B'}]])assert.equal(D.validFeedback(L,{...old,misconceptions}),false);
 const success=ready(),f={...feedback(),misconceptions:[{statement:'Eine unzutreffende Nebenbehauptung.',correction:'Eine gezielte kurze Klarstellung.'}]};D.finish(L,success,D.begin(L,success,'done','time'),f);assert.deepEqual(D.scores(L,success),Array(13).fill('green'));
});
test('12-point history migrates without invented feedback or lost points; outstanding old response stays recoverable',()=>{
 const old={...L,version:'1',questions:L.questions.map(q=>({...q,criteria:q.criteria.filter(c=>c.id!=='q3_perception')}))};
 const data=D.fresh(old);for(const q of old.questions)data.answers[q.id]='Alte Antwort';
 const f={summary:'Altes Feedback',languageFeedback:'Verständlich.',nextSteps:[],criteria:D.criteria(old).map(c=>({id:c.id,status:'met',feedback:'Erfüllt.'}))};
 const first=D.begin(old,data,'a','2026-10-25');D.finish(old,data,first,f);D.begin(old,data,'b','2026-10-25');
 const original=JSON.parse(JSON.stringify(data.history[0].feedback));
 const migrated=D.migrate(L,{widget:'ionisierende-strahlung-ki-v1',version:1,data,scores:Array(12).fill('green')});
 assert(D.valid(L,migrated.data));assert.equal(migrated.version,2);assert.deepEqual(migrated.scores,[...Array(12).fill('green'),'gray']);assert.deepEqual(migrated.data.history[0].feedback,original);
 D.finish(L,migrated.data,migrated.data.history[1],f);assert.equal(migrated.data.aspects.q3_perception.earned,'gray');
 assert.throws(()=>D.migrate(L,{...migrated,widget:'foreign'}));
});

function grouped(status='met'){
 const f=feedback(status);f.summary='';f.languageFeedback='';f.nextSteps=[];f.misconceptions=[];
 f.taskFeedback=L.questions.map(q=>({id:q.id,feedback:'Absatz für '+q.id}));return f;
}
function doneV4(s,id='first',f=grouped()){
 const h=D.begin(L,s,id,'time');D.finish(L,s,h,f);h.feedbackStyle='questions-v4';return h;
}
function rawFor(h,status='met'){
 const {task}=D.request(L,h);return {summary:'',languageFeedback:'',nextSteps:[],misconceptions:[],
  criteria:task.criteria.map(c=>({id:c.id,status,feedback:'Neue Begründung.'})),taskFeedback:task.feedbackGroups.map(q=>({id:q.id,feedback:'Neu geprüft: '+q.id}))};
}
test('plan reuses exactly unchanged questions; all unchanged never appends a new history request',()=>{
 const s=ready(),first=doneV4(s);
 assert.deepEqual(D.plan(L,s),{checkedQuestionIds:[],reusedFrom:Object.fromEntries(L.questions.map(q=>[q.id,first.requestId]))});
 const length=s.history.length;assert.throws(()=>D.begin(L,s,'unchanged','later'),/unverändert/);assert.equal(s.history.length,length);
 s.answers.messung+=' ';
 assert.deepEqual(D.plan(L,s),{checkedQuestionIds:['messung'],reusedFrom:{definition:'first',gefahren:'first'}});
 const h=D.begin(L,s,'second','later');assert.deepEqual(h.checkedQuestionIds,['messung']);assert.deepEqual(h.reusedFrom,{definition:'first',gefahren:'first'});
 assert.equal(typeof h.questionSignatures.definition,'string');assert(D.valid(L,s));
});
test('request projects only changed question, answer, reference and its own criteria',()=>{
 const s=ready();doneV4(s);s.answers.messung='Exakt\nanders ä';const h=D.begin(L,s,'partial','later'),r=D.request(L,h);
 assert.deepEqual(JSON.parse(r.answer),{messung:'Exakt\nanders ä'});assert.equal(r.task.id,L.id);assert.equal(r.task.version,L.version);
 assert.deepEqual(r.task.criteria.map(c=>c.id),L.questions[1].criteria.map(c=>c.id));assert.deepEqual(r.task.feedbackGroups.map(g=>g.id),['messung']);
 assert.equal(r.task.referenceAnswer,'messung: '+L.questions[1].reference);assert(!r.task.prompt.includes(L.questions[0].title));assert.match(r.task.prompt,/eingereichten Teilantworten/);
});
test('partial response merges every status and paragraph while only new criteria change points or assistance',()=>{
 const s=ready(),f=grouped();for(const c of f.criteria)if(c.id.startsWith('q2_'))c.status='partial';const first=doneV4(s,'first',f);
 assert.deepEqual(D.scores(L,s),[...Array(3).fill('green'),...Array(4).fill('gray'),...Array(6).fill('green')]);
 const untouched=JSON.stringify(Object.fromEntries(Object.entries(s.aspects).filter(([id])=>!id.startsWith('q2_'))));
 s.answers.messung+=' ergänzt';const h=D.begin(L,s,'partial','later'),raw=rawFor(h);raw.summary='Ignorierte Gesamtzusammenfassung';raw.languageFeedback='Ignorierter globaler Sprachhinweis';
 assert(D.validResponse(L,h,raw));D.finish(L,s,h,raw);h.feedbackStyle='questions-v4';
 assert.equal(h.feedback.criteria.length,13);assert.equal(h.feedback.taskFeedback.length,3);assert.deepEqual(h.feedback.criteria.filter(c=>!c.id.startsWith('q2_')),first.feedback.criteria.filter(c=>!c.id.startsWith('q2_')));
 assert.deepEqual(h.feedback.taskFeedback.filter(g=>g.id!=='messung'),first.feedback.taskFeedback.filter(g=>g.id!=='messung'));
 assert.equal(h.feedback.summary,'');assert.equal(h.feedback.languageFeedback,'');assert.deepEqual(h.feedback.nextSteps,[]);assert.deepEqual(h.feedback.misconceptions,[]);
 assert.deepEqual(D.scores(L,s),[...Array(3).fill('green'),...Array(4).fill('yellow'),...Array(6).fill('green')]);
 assert.equal(JSON.stringify(Object.fromEntries(Object.entries(s.aspects).filter(([id])=>!id.startsWith('q2_')))),untouched);
 assert(D.valid(L,s));assert.deepEqual(D.plan(L,s).checkedQuestionIds,[]);
});
test('new missing results mark assistance only in checked question and retain already earned green',()=>{
 const s=ready();doneV4(s);s.answers.definition+=' neu';const h=D.begin(L,s,'partial','later');D.finish(L,s,h,rawFor(h,'missing'));h.feedbackStyle='questions-v4';
 assert(D.scores(L,s).every(c=>c==='green'));
 for(const [id,a] of Object.entries(s.aspects))assert.equal(a.assisted,id.startsWith('q1_'));
 assert.deepEqual(h.feedback.criteria.slice(0,3).map(c=>c.status),Array(3).fill('missing'));
 assert.deepEqual(h.feedback.criteria.slice(3).map(c=>c.status),Array(10).fill('met'));
});
test('only newest successful complete v4 result can cache; failed attempts and older matching text are not a baseline',()=>{
 const s=ready();const first=doneV4(s);s.answers.definition='Zwischentext';const second=D.begin(L,s,'second','later');D.finish(L,s,second,rawFor(second));second.feedbackStyle='questions-v4';
 s.answers.definition=first.answers.definition;assert.deepEqual(D.plan(L,s).checkedQuestionIds,['definition']);
 const failed=D.begin(L,s,'failed','later');failed.status='failed';failed.message='Kein Ergebnis';
 assert.deepEqual(D.plan(L,s).checkedQuestionIds,['definition']);
 s.answers.definition=second.answers.definition;assert.deepEqual(D.plan(L,s).checkedQuestionIds,[]);
 second.feedbackStyle='questions-v3';assert.deepEqual(D.plan(L,s).checkedQuestionIds,L.questions.map(q=>q.id));
 second.feedbackStyle='questions-v4';second.feedback.taskFeedback.pop();assert.deepEqual(D.plan(L,s).checkedQuestionIds,L.questions.map(q=>q.id));
});
test('current rubric signature changes invalidate just that question, version changes invalidate the whole cache',()=>{
 const s=ready();doneV4(s);
 const edited={...L,questions:L.questions.map((q,i)=>i===1?{...q,reference:q.reference+' Ergänzter Erwartungshorizont.'}:q)};
 assert.deepEqual(D.plan(edited,s).checkedQuestionIds,['messung']);
 assert(D.valid(edited,s),'historic signature stays readable although current rubric was edited');
 const h=D.begin(edited,s,'new-rubric','later');assert.notEqual(h.questionSignatures.messung,s.history[0].questionSignatures.messung);
 assert.deepEqual(D.request(edited,h).task.feedbackGroups.map(g=>g.id),['messung']);
 assert.deepEqual(D.plan({...L,version:'3'},s).checkedQuestionIds,L.questions.map(q=>q.id));
});
test('legacy complete v4 without signatures can reuse by complete IDs; v4 missing grouped feedback cannot',()=>{
 const s=ready(),h=doneV4(s);delete h.checkedQuestionIds;delete h.reusedFrom;delete h.questionSignatures;
 assert(D.valid(L,s));assert.deepEqual(D.plan(L,s).checkedQuestionIds,[]);
 delete h.feedback.taskFeedback;assert(D.valid(L,s));assert.deepEqual(D.plan(L,s).checkedQuestionIds,L.questions.map(q=>q.id));
});
test('partial history survives JSON reload and unresolved recovery then merges against the original owned history',()=>{
 let s=ready();doneV4(s);s.answers.gefahren+=' überarbeitet';let h=D.begin(L,s,'recover','later');h.status='unknown';h.message='Ausgang unklar';
 const wire=JSON.parse(JSON.stringify(s));assert(D.valid(L,wire));s=wire;h=s.history[1];const raw=rawFor(h,'partial');
 assert(D.validResponse(L,h,raw));D.finish(L,s,h,raw);h.feedbackStyle='questions-v4';assert(D.valid(L,s));assert.equal(h.feedback.criteria.length,13);
 assert.deepEqual(h.feedback.criteria.slice(7).map(c=>c.status),Array(6).fill('partial'));assert.deepEqual(h.feedback.criteria.slice(0,7).map(c=>c.status),Array(7).fill('met'));
});
test('wrong response subset, full response to partial request and missing paragraphs fail without changing points',()=>{
 const s=ready();doneV4(s);s.answers.messung+=' neu';const h=D.begin(L,s,'partial','later'),before=JSON.stringify(s.aspects);
 const wrong=rawFor(h);wrong.criteria[0].id='q1_electron_removal';
 const noParagraph=rawFor(h);delete noParagraph.taskFeedback;
 const wrongParagraph=rawFor(h);wrongParagraph.taskFeedback[0].id='gefahren';
 for(const f of [wrong,grouped(),noParagraph,wrongParagraph]){assert.equal(D.validResponse(L,h,f),false);assert.throws(()=>D.finish(L,s,h,f));assert.equal(JSON.stringify(s.aspects),before);assert.equal(h.status,'pending');}
});
test('cache metadata rejects foreign, future, cyclic, answer-mismatched and incomplete signature references',()=>{
 const initial=ready();doneV4(initial);initial.answers.messung+=' neu';D.begin(L,initial,'partial','later');
 const variants=[h=>h.checkedQuestionIds=[],h=>h.checkedQuestionIds=['messung','messung'],h=>h.checkedQuestionIds=['foreign'],h=>delete h.questionSignatures,
 h=>h.questionSignatures.definition='not json',h=>delete h.questionSignatures.gefahren,h=>h.reusedFrom.definition='foreign',h=>h.reusedFrom.definition='partial',
 h=>h.reusedFrom.messung='first',h=>h.answers.definition+=' verändert',h=>h.questionSignatures.definition=h.questionSignatures.gefahren];
 for(const mutate of variants){const s=JSON.parse(JSON.stringify(initial));mutate(s.history[1]);assert.equal(D.valid(L,s),false);assert.throws(()=>D.finish(L,s,s.history[1],rawFor(initial.history[1])));}
 const other=ready();assert.throws(()=>D.finish(L,other,initial.history[1],rawFor(initial.history[1])));
});
test('historic attempts without new metadata submit all three answers; version one keeps the previous twelve criteria',()=>{
 const s=ready(),h={requestId:'legacy',rubricVersion:'1',answers:{...s.answers}};
 const result=D.request(L,h);assert.equal(result.task.version,'1');assert.equal(result.task.criteria.length,12);assert.equal(result.task.feedbackGroups.length,3);assert.equal(result.answer,JSON.stringify(h.answers));
 const oldFeedback={...feedback(),criteria:feedback().criteria.filter(c=>c.id!=='q3_perception')};assert(D.validResponse(L,h,oldFeedback));
 const latest={...h,rubricVersion:'2'};assert.equal(D.request(L,latest).task.criteria.length,13);assert(D.validResponse(L,latest,feedback()));
});

