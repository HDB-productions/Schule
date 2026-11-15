const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const D=require('./domain.js'),L=require('./task.js');
const Local=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'local.js'),'utf8')+';LocalTasks;',{});
const clone=value=>JSON.parse(JSON.stringify(value));
const oldLesson={...clone(L),version:'1',questions:L.questions.map(q=>({...q,criteria:q.criteria.filter(c=>c.id!=='bus_skater')}))};
const text='Beim Bremsen bleibe ich zunächst in Bewegung.\n„Meine Erklärung“: ü, ß und <Text>.';
function feedback(lesson,statuses=[]){return {summary:'Gespeicherte Zusammenfassung',languageFeedback:'Hinweis zur Sprache',misconceptions:[],nextSteps:['Weiterarbeiten'],
  taskFeedback:lesson.questions.map(q=>({id:q.id,feedback:'Die gespeicherte Rückmeldung bleibt lesbar.'})),
  criteria:D.criteria(lesson).map((c,i)=>({id:c.id,status:statuses[i]||'met',feedback:'Aspekt '+c.id}))};}
function legacy(status='done',metadata=true){
  const s={...D.fresh(oldLesson),local:clone(Local.fresh())};
  s.answers.bus=text;s.ownerUid='aa-bbbbbb-cccccc-dddddd';s.aspects.bus_anfahren.assisted=true;
  s.local.choices=[true,false,true];s.local.matches=['accelerating','braking'];s.local.formulas=['a*m','F|/|a',''];
  s.local.earned=['green','yellow','gray','gray','yellow','green'];s.local.assisted=[false,true,true,false,true,false];
  const h=D.begin(oldLesson,s,'old-request-id','2026-10-25T12:00:00.000Z');
  if(status==='done'){D.finish(oldLesson,s,h,feedback(oldLesson,['met','met','missing','partial']));h.feedbackStyle='questions-v4';}
  else {h.status=status;h.message='Ausgang unklar: bitte abrufen.';s.aspects.bus_bremsen.earned='green';}
  // Truly old attempts may predate rubricVersion and the question cache metadata.
  delete h.rubricVersion;
  if(!metadata)for(const key of ['checkedQuestionIds','reusedFrom','questionSignatures'])delete h[key];
  return {widget:'newton-gesetze-ki-v1',version:1,data:s,scores:[...s.local.earned,...D.scores(oldLesson,s)]};
}

test('completed legacy migration preserves all data and appends the eleventh point',()=>{
  assert.equal(L.version,'2');assert.equal(D.criteria(L).length,5);
  const input=legacy(),before=clone(input),migrated=D.migrate(L,input);
  const expected=clone(input);expected.version=2;expected.data.version='2';expected.data.aspects.bus_skater={earned:'gray',assisted:false};
  expected.data.history[0].rubricVersion='1';expected.data.history[0].assisted.bus_skater=false;expected.scores.push('gray');
  assert.deepEqual(migrated,expected);assert.deepEqual(input,before);
  assert(D.valid(L,migrated.data));assert(Local.valid(migrated.data.local));
  assert.deepEqual(migrated.scores,[...migrated.data.local.earned,...D.scores(L,migrated.data)]);
  assert.equal(migrated.scores.length,11);assert.deepEqual(D.plan(L,migrated.data),{checkedQuestionIds:['bus'],reusedFrom:{}});
  migrated.data.local.choices[0]=false;assert.deepEqual(input,before);
});

test('legacy feedback without cache metadata remains valid and renderable',()=>{
  const migrated=D.migrate(L,legacy('done',false)),h=migrated.data.history[0];
  assert(D.valid(L,migrated.data));assert(D.validAttemptFeedback(L,h,h.feedback));
  assert.equal(h.feedback.taskFeedback[0].id,'bus');assert.equal(h.answers.bus,text);
  assert(!D.validFeedback(L,h.feedback));assert.equal(h.feedback.criteria.length,4);
});

for(const status of ['pending','unknown'])test(status+' legacy requests retain their request ID, version and four-criterion recovery contract',()=>{
  const input=legacy(status),migrated=D.migrate(L,input),s=migrated.data,h=s.history[0],oldFeedback=feedback(oldLesson);
  assert.equal(h.status,status);assert.equal(h.requestId,'old-request-id');
  const submitted=D.request(L,h);assert.equal(submitted.task.id,L.id);assert.equal(submitted.task.version,'1');
  assert.deepEqual(submitted.task.criteria.map(c=>c.id),D.criteria(oldLesson).map(c=>c.id));assert.deepEqual(JSON.parse(submitted.answer),h.answers);
  assert.throws(()=>D.begin(L,s,'forbidden-new-request','today'),/ungeklärt/);
  assert(D.validResponse(L,h,oldFeedback));assert(!D.validResponse(L,h,feedback(L)));
  D.finish(L,s,h,oldFeedback);h.feedbackStyle='questions-v4';
  assert.equal(h.status,'done');assert.equal(s.aspects.bus_bremsen.earned,'green');
  assert.deepEqual(s.aspects.bus_skater,{earned:'gray',assisted:false});assert(D.valid(L,s));
  assert.deepEqual(D.plan(L,s),{checkedQuestionIds:['bus'],reusedFrom:{}});
  const next=D.begin(L,s,'new-request-id','2026-10-26');
  assert.equal(D.request(L,next).task.version,'2');assert.equal(D.request(L,next).task.criteria.length,5);
});

test('new attempts require five criteria and may reuse their complete current feedback',()=>{
  const s=D.fresh(L);s.answers.bus=text;
  const h=D.begin(L,s,'new-request','2026-10-26'),f=feedback(L);
  assert(!D.validResponse(L,h,feedback(oldLesson)));assert(D.validResponse(L,h,f));
  assert.throws(()=>D.finish(L,s,h,feedback(oldLesson)),/Ungültiges Feedback/);assert.equal(h.status,'pending');
  D.finish(L,s,h,f);h.feedbackStyle='questions-v4';
  assert(D.valid(L,s));assert.deepEqual(D.scores(L,s),Array(5).fill('green'));
  assert.deepEqual(D.plan(L,s),{checkedQuestionIds:[],reusedFrom:{bus:'new-request'}});
  assert.throws(()=>D.begin(L,s,'duplicate','today'),/unverändert/);
  s.answers.bus+=' Ergänzung';assert.deepEqual(D.plan(L,s),{checkedQuestionIds:['bus'],reusedFrom:{}});
});

test('signature and feedback validation distinguishes old four-criterion and new five-criterion history',()=>{
  const migrated=D.migrate(L,legacy()),h=migrated.data.history[0];assert(D.valid(L,migrated.data));
  const oldSignature=JSON.parse(h.questionSignatures.bus);assert.equal(oldSignature.criteria.length,4);
  oldSignature.prompt='Historischer Aufgabentext';oldSignature.referenceAnswer='Historische Referenz';
  h.questionSignatures.bus=JSON.stringify(oldSignature);assert(D.valid(L,migrated.data));
  oldSignature.criteria.push(D.task(L).criteria.find(c=>c.id==='bus_skater'));h.questionSignatures.bus=JSON.stringify(oldSignature);
  assert(!D.valid(L,migrated.data));
  const s=D.fresh(L);s.answers.bus=text;const current=D.begin(L,s,'current','today');
  const newSignature=JSON.parse(current.questionSignatures.bus);newSignature.criteria.pop();current.questionSignatures.bus=JSON.stringify(newSignature);
  assert(!D.valid(L,s));
});

test('invalid legacy snapshots and score mismatches are rejected without modifying original data',()=>{
  const corruptions=[
    x=>{x.widget='other-widget';},x=>{x.version=2;},x=>{x.data.lesson='other-lesson';},x=>{x.data.version='2';},
    x=>{x.scores[0]='gray';},x=>{x.scores[6]='gray';},x=>{x.scores.push('gray');},x=>{x.scores.pop();},
    x=>{x.data.local.earned.pop();},x=>{x.data.local.earned[0]='red';},x=>{x.data.local.assisted.pop();},
    x=>{x.data.local.assisted[0]='false';},x=>{x.data.local=null;},x=>{x.data.history[0].rubricVersion='2';},
    x=>{x.data.history[0].rubricVersion='unknown';},x=>{x.data.history[0].assisted.bus_bremsen='false';},
    x=>{x.data.history[0].feedback.criteria.pop();},x=>{x.data.history[0].questionSignatures.bus='broken json';}
  ];
  for(const corrupt of corruptions){const input=legacy();corrupt(input);const before=clone(input);
    assert.throws(()=>D.migrate(L,input),/Originaldaten bleiben erhalten/);assert.deepEqual(input,before);}
  for(const input of [undefined,null,{},[]])assert.throws(()=>D.migrate(L,input),/Originaldaten bleiben erhalten/);
});

test('migration keeps an explicit version 1 and never calls network or billing code',()=>{
  const input=legacy('pending');input.data.history[0].rubricVersion='1';
  const migrated=D.migrate(L,input);assert.equal(migrated.data.history[0].rubricVersion,'1');
  assert.equal(migrated.data.history.length,1);assert.equal(migrated.data.history[0].status,'pending');
  const code=fs.readFileSync(path.join(__dirname,'domain.js'),'utf8');assert(!/\b(?:fetch|XMLHttpRequest)\s*\(/.test(code));
});
