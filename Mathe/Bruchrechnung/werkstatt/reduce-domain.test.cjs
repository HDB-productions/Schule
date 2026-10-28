'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const D=require('./domain.js'),R=require('./reduce-domain.js');
const copy=v=>JSON.parse(JSON.stringify(v));
const pool=[...D.tasks('reduce',1),...D.tasks('reduce',2)];
const task=(n,d)=>pool.find(t=>t.n===n&&t.d===d);
function attempt(a,answer,correct=true) {
  const result=R.check(a,answer);assert.equal(result.correct,correct);assert.equal(result.completed,a.phase==='done');assert(R.validActive(a));return result;
}
function solveRound(a,factor) {
  const r=R.current(a),n=r.n/factor,d=r.d/factor;
  attempt(a,{factor:String(factor)});attempt(a,{n:String(n),d:String(d)});
}
function oldActive(t,index=0) {
  const steps=D.steps(t),drafts=steps.slice(0,index).map(s=>Object.fromEntries(s.fields.map(f=>[f.key,String(f.value)])));
  return {task:copy(t),index,drafts,attempts:drafts.map((answer,step)=>({step,answer:copy(answer),correct:true})),help:[],feedback:null};
}
function snapshot(active) {return {widget:'brueche-kuerzen',version:1,data:{level:active.task.level,active,history:[],intro:false},scores:Array(20).fill('gray')};}

test('fresh uses an isolated canonical reduction task and the documented state shape',()=>{
  for(const t of pool){const a=R.fresh(t);assert(R.validActive(a));assert.equal(a.phase,'factor');assert.equal(a.hadError,false);assert.equal(a.legacy,false);assert.equal(a.legacyAttempts,null);assert.notEqual(a.task,t);assert(R.validState({level:t.level,active:a,history:[],intro:false}));}
  assert.throws(()=>R.fresh(D.tasks('expand',1)[0]),RangeError);
  assert.throws(()=>R.fresh({...pool[0],id:'forged'}),RangeError);
});

test('a non-greatest divisor is correct and allows several fully green rounds',()=>{
  const a=R.fresh(task(12,24));
  solveRound(a,2);assert.equal(a.phase,'again');assert.deepEqual([R.current(a).n,R.current(a).d],[12,24]);
  attempt(a,{again:'yes'});assert.deepEqual([R.current(a).n,R.current(a).d],[6,12]);
  solveRound(a,3);attempt(a,{again:'yes'});assert.deepEqual([R.current(a).n,R.current(a).d],[2,4]);
  solveRound(a,2);attempt(a,{again:'no'});assert.equal(a.phase,'done');assert.equal(a.rounds.length,3);assert.equal(a.hadError,false);assert(a.attempts.every(v=>v.correct));
  const before=copy(a);assert.deepEqual(R.check(a,{again:'no'}),{correct:false,completed:false});assert.deepEqual(a,before);
});

test('every available common divisor preserves the value and is accepted, including the ggT',()=>{
  for(const t of pool)for(let factor=2;factor<=t.n;factor++)if(t.n%factor===0&&t.d%factor===0){
    const a=R.fresh(t);solveRound(a,factor);const n=t.n/factor,d=t.d/factor;
    assert.equal(t.n*d,n*t.d);assert.equal(a.hadError,false);
    attempt(a,{again:R.canReduce(n,d)?'yes':'no'});
  }
});

test('invalid and noncommon factors never advance and preserve original texts',()=>{
  for(const value of ['', '0','1','-2','2.0','2e0','abc','9007199254740992','5','13']) {
    const a=R.fresh(task(12,24));attempt(a,{factor:value},false);assert.equal(a.phase,'factor');assert.equal(a.hadError,true);assert.equal(R.current(a).draftFactor,value);assert.equal(a.attempts[0].answer.factor,value);
  }
  const a=R.fresh(task(12,24));attempt(a,{factor:' 02 '});assert.equal(R.current(a).factor,2);assert.equal(R.current(a).draftFactor,' 02 ');
});

test('the result preview appears after every result attempt and wrong attempts stay yellow',()=>{
  const a=R.fresh(task(12,24));attempt(a,{factor:'2'});assert.equal(R.current(a).preview,null);
  attempt(a,{n:'3',d:'6'},false);assert.equal(a.phase,'result');assert.deepEqual(R.current(a).preview,{n:'3',d:'6',correct:false});
  attempt(a,{n:'',d:'0'},false);assert.deepEqual(R.current(a).preview,{n:'',d:'0',correct:false});
  attempt(a,{n:' 06 ',d:'012'});assert.deepEqual(R.current(a).preview,{n:' 06 ',d:'012',correct:true});assert.equal(a.phase,'again');assert.equal(a.hadError,true);
  attempt(a,{again:'no'},false);assert.equal(a.phase,'again');attempt(a,{again:'yes'});solveRound(a,6);attempt(a,{again:'yes'},false);attempt(a,{again:'no'});assert.equal(a.phase,'done');assert.equal(a.hadError,true);
});

test('empty continuation is a recorded wrong attempt, help and drafts survive serialization',()=>{
  const a=R.fresh(task(12,24));solveRound(a,12);attempt(a,{again:''},false);a.help.push('0:again');R.current(a).again='no';
  const restored=copy(a);assert(R.validActive(restored));assert.equal(restored.help[0],'0:again');attempt(restored,{again:'no'});assert.equal(restored.hadError,true);
});

test('all intermediate JSON round trips validate',()=>{
  const a=R.fresh(task(12,24));
  for(const answer of [{factor:'2'},{n:'6',d:'12'},{again:'yes'},{factor:'2'},{n:'3',d:'6'},{again:'yes'},{factor:'3'},{n:'1',d:'2'},{again:'no'}]){attempt(a,answer);assert(R.validActive(copy(a)));}
});

test('validators reject forged rounds, misleading previews, attempts, help markers and states',()=>{
  const base=R.fresh(task(12,24));solveRound(base,2);
  const mutations=[a=>a.task.n++,a=>a.rounds[0].n++,a=>a.rounds[0].factor=5,a=>a.rounds[0].preview.correct=false,a=>a.rounds[0].draftD='99',a=>a.phase='done',a=>a.attempts[0].correct=false,a=>a.help.push('99:factor'),a=>a.legacyAttempts=[],a=>a.rounds[0].draftFactor='x'.repeat(25),a=>a.extra=true];
  for(const mutate of mutations){const a=copy(base);mutate(a);assert.equal(R.validActive(a),false);}
  assert.equal(R.validState({level:base.task.level===1?2:1,active:base,history:[],intro:false}),false);
  assert.equal(R.validState({level:base.task.level,active:base,history:[base],intro:false}),false);
  assert.throws(()=>R.check(base,{n:'1'}),TypeError);
});

test('version 1 migration preserves scores, completed history and original attempts',()=>{
  const old=oldActive(task(12,24),3);old.attempts.unshift({step:0,answer:{factor:'3'},correct:false});old.help=[0,2];
  const s=snapshot(old);s.data.history=[copy(old)];s.scores[0]='yellow';s.scores[4]='green';s.data.intro=true;
  const original=copy(s),m=R.migrateSnapshot(s);
  assert.deepEqual(s,original);assert.equal(m.version,2);assert.equal(m.widget,s.widget);assert.deepEqual(m.scores,s.scores);assert.equal(m.data.intro,true);assert(R.validState(m.data));
  assert.equal(m.data.active.phase,'done');assert.equal(m.data.history.length,1);assert.equal(m.data.history[0].task.id,old.task.id);assert.deepEqual(m.data.history[0].legacyAttempts,old.attempts);assert.deepEqual(m.data.history[0].help,['legacy:0','legacy:2']);assert.equal(m.data.history[0].hadError,true);
});

test('version 1 in-progress steps migrate without discarding editable drafts or failed previews',()=>{
  for(const [index,phase] of [[0,'factor'],[1,'result'],[2,'again'],[3,'done']]) {
    const old=oldActive(task(12,24),index);
    if(index===0)old.drafts[0]={factor:' 3 '};
    if(index===1){old.drafts[1]={n:'9',d:'99'};old.attempts.push({step:1,answer:{n:'4',d:'9'},correct:false});}
    const m=R.migrateSnapshot(snapshot(old));assert(R.validState(m.data));assert.equal(m.data.active.phase,phase);
    if(index===0)assert.equal(R.current(m.data.active).draftFactor,' 3 ');
    if(index===1){assert.equal(R.current(m.data.active).draftN,'9');assert.deepEqual(R.current(m.data.active).preview,{n:'4',d:'9',correct:false});}
  }
});

test('migration rejects foreign IDs, versions, damaged data and falsely confirmed steps',()=>{
  const base=snapshot(oldActive(task(12,24),2));
  for(const mutate of [s=>s.widget='other',s=>s.version=2,s=>s.scores.pop(),s=>s.scores[0]='blue',s=>s.data.active.drafts[1].n='8',s=>s.data.active.attempts[0].correct=false,s=>s.data.active.task.factor=2,s=>s.data.history.push(oldActive(task(12,24),1))]){
    const s=copy(base);mutate(s);assert.throws(()=>R.migrateSnapshot(s));
  }
});

test('browser use needs no CommonJS and exports only the documented lexical constant',()=>{
  const context=vm.createContext({});vm.runInContext(fs.readFileSync(require.resolve('./domain.js'),'utf8'),context);vm.runInContext(fs.readFileSync(require.resolve('./reduce-domain.js'),'utf8'),context);
  assert.equal(vm.runInContext('ReduceDomain.validActive(ReduceDomain.fresh(FractionDomain.tasks("reduce",1)[0]))',context),true);
});
