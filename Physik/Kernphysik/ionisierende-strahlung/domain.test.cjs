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

