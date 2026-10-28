'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const D=require('./domain.js');
const O=require('./operate-domain.js');
const tasks=[1,2].flatMap(level=>D.tasks('operate',level));
const copy=value=>JSON.parse(JSON.stringify(value));
const answer=step=>Object.fromEntries(step.fields.map(f=>[f.key,f.value]));
const task=shape=>tasks.find(t=>Object.entries(shape).every(([k,v])=>t[k]===v));
function finish(a) {
  while(a.index<4) {
    const result=O.check(a,answer(O.steps(a)[a.index]));
    if(result.warning)O.resolve(a,true);
    assert.equal(O.validActive(a),true);
  }
  return a;
}
function oldActive(t,index) {
  const drafts=D.steps(t).slice(0,index).map(step=>Object.fromEntries(step.fields.map(f=>[f.key,String(f.value)])));
  return {task:copy(t),index,drafts,attempts:drafts.map((a,step)=>({step,answer:copy(a),correct:true})),help:[],feedback:null};
}
function snapshot(active,history=[]) {
  return {widget:'brueche-ungleichnamig',version:1,data:{level:active.task.level,active,history,intro:true},scores:Array(20).fill('gray')};
}

test('minimum uses reduced operands and all integral equivalent denominators are accepted',()=>{
  const zero={n:1,d:3,bn:2,bd:6,op:'-'};
  assert.equal(O.minimum(zero),'3');
  assert.deepEqual(O.values(zero,'3'),{left:'1',right:'1',n:'0',d:'3',finalN:'0',finalD:'1'});
  assert.deepEqual(O.values(zero,'12'),{left:'4',right:'4',n:'0',d:'12',finalN:'0',finalD:'1'});
  const add={n:2,d:6,bn:1,bd:4,op:'+'};
  assert.equal(O.minimum(add),'12');
  assert.throws(()=>O.values(add,'9'),RangeError);
  const thirds={n:2,d:6,bn:3,bd:9,op:'+'};
  assert.equal(O.minimum(thirds),'3');
  assert.deepEqual(O.values(thirds,'9'),{left:'3',right:'3',n:'6',d:'9',finalN:'2',finalD:'3'});
  assert.equal(O.values(thirds,'3').left,'1');
});

test('all canonical tasks complete with the actual minimum and fresh JSON state',()=>{
  for(const t of tasks) {
    const a=O.fresh(t);
    assert.deepEqual(a,{task:t,index:0,common:null,pending:null,drafts:[],attempts:[],help:[],feedback:null,legacyAttempts:null});
    assert.notEqual(a.task,t);
    assert.equal(O.validActive(a),true);
    finish(a);
    assert.equal(a.common,O.minimum(t));
    assert.equal(a.attempts.length,4);
    assert.ok(a.attempts.every(v=>v.correct));
    assert.equal(O.validActive(copy(a)),true);
    const state={level:t.level,active:a,history:[copy(a)],intro:false};
    assert.equal(O.validState(copy(state)),true);
  }
});

test('smaller-than-original denominator, zero numerator, and staged reduction stay exact',()=>{
  const t=task({n:1,d:3,bn:2,bd:6,op:'-'});
  assert.ok(t);
  const a=O.fresh(t);
  assert.equal(O.check(a,{common:'3'}).correct,true);
  assert.equal(O.check(a,{left:'1',right:'1'}).correct,true);
  assert.equal(O.check(a,{n:'0',d:'1'}).correct,false);
  assert.equal(a.index,2);
  assert.equal(O.check(a,{n:'0',d:'3'}).correct,true);
  assert.equal(O.check(a,{n:'0',d:'3'}).correct,false);
  assert.equal(O.check(a,{n:'0',d:'1'}).completed,true);
  assert.equal(O.validActive(copy(a)),true);
});

test('valid larger denominator warns without attempt or help; continue preserves original strings',()=>{
  const a=O.fresh(tasks.find(t=>BigInt(O.minimum(t))<BigInt(D.lcm(t.d,t.bd))));
  const common=String(BigInt(O.minimum(a.task))*4n),raw=` 000${common} `;
  assert.deepEqual(O.check(a,{common:raw}),{correct:false,completed:false,warning:true});
  assert.equal(a.pending,common);assert.equal(a.common,null);assert.equal(a.index,0);
  assert.deepEqual(a.attempts,[]);assert.deepEqual(a.help,[]);assert.equal(a.feedback,null);
  assert.equal(O.validActive(copy(a)),true);
  const restored=copy(a);
  assert.deepEqual(O.resolve(restored,true),{correct:true,completed:false,warning:false});
  assert.equal(restored.common,common);assert.equal(restored.pending,null);assert.equal(restored.index,1);
  assert.deepEqual(restored.attempts,[{step:0,answer:{common:raw},correct:true}]);
  assert.equal(O.validActive(copy(restored)),true);
  finish(restored);
  assert.ok(restored.attempts.every(v=>v.correct));assert.deepEqual(restored.help,[]);
});

test('search again keeps draft and can warn repeatedly without dirtying the score',()=>{
  const a=O.fresh(tasks[0]),raw=String(BigInt(O.minimum(a.task))*3n);
  O.check(a,{common:raw});O.resolve(a,false);
  assert.equal(a.pending,null);assert.equal(a.index,0);assert.deepEqual(a.drafts,[{common:raw}]);
  assert.deepEqual(a.attempts,[]);assert.deepEqual(a.help,[]);
  assert.equal(O.check(a,{common:raw}).warning,true);
  O.resolve(a,false);
  O.check(a,{common:O.minimum(a.task)});
  assert.equal(a.index,1);assert.equal(a.attempts.length,1);
  assert.equal(O.validActive(a),true);
});

test('invalid input is an attempt; exact integer parser rejects decimal, sign, exponent and oversized strings',()=>{
  const a=O.fresh(tasks[0]);
  for(const common of ['', '0', '-3', '+3', '3.0', '3e1','Infinity','9'.repeat(121)]) {
    if(common.length>120) {assert.throws(()=>O.check(a,{common}),TypeError);continue;}
    const n=a.attempts.length;
    assert.deepEqual(O.check(a,{common}),{correct:false,completed:false,warning:false});
    assert.equal(a.attempts.length,n+1);assert.equal(a.attempts.at(-1).answer.common,common);
    assert.equal(O.validActive(a),true);
  }
  const min=O.minimum(a.task);
  assert.equal(O.check(a,{common:` 00${min} `}).correct,true);
  const expected=answer(O.steps(a)[1]);
  assert.equal(O.check(a,{left:'wrong',right:expected.right}).correct,false);
  assert.equal(O.check(a,expected).correct,true);
  assert.throws(()=>O.check(a,{n:'1',d:'1',extra:'1'}),TypeError);
  finish(a);assert.ok(a.attempts.some(v=>!v.correct));
});

test('huge chosen denominators use BigInt exactly, without enumeration',()=>{
  const a=O.fresh(tasks[0]),N=String(BigInt(O.minimum(a.task))*10n**105n);
  assert.equal(O.check(a,{common:N}).warning,true);O.resolve(a,true);
  const v=O.values(a.task,N);
  assert.equal(BigInt(v.left)*BigInt(a.task.d),BigInt(a.task.n)*BigInt(N));
  assert.equal(BigInt(v.right)*BigInt(a.task.bd),BigInt(a.task.bn)*BigInt(N));
  assert.equal(O.steps(a)[1].fields[0].value,v.left);
  finish(a);assert.equal(O.validActive(copy(a)),true);
});

test('a 120-digit denominator accepts an exact 121-digit addition result through completion',()=>{
  const t=tasks.find(t=>t.op==='+' && t.n*t.bd+t.bn*t.d>t.d*t.bd);
  assert.ok(t);
  const min=BigInt(O.minimum(t));
  const N=String((10n**120n-1n)/min*min);
  assert.equal(N.length,120);
  const a=O.fresh(t);
  assert.equal(O.check(a,{common:N}).warning,true);O.resolve(a,true);
  const v=O.values(t,N);
  assert.equal(v.n.length,121);
  assert.equal(O.check(a,{left:v.left,right:v.right}).correct,true);
  assert.equal(O.check(a,{n:v.n,d:v.d}).correct,true);
  assert.equal(a.drafts[2].n,v.n);
  assert.equal(O.check(a,{n:v.finalN,d:v.finalD}).completed,true);
  assert.equal(O.validActive(copy(a)),true);
  assert.throws(()=>O.values(t,'1'.repeat(121)),RangeError);
  assert.throws(()=>O.check(O.fresh(t),{common:'1'.repeat(121)}),TypeError);
});

test('step descriptions adapt to the chosen denominator and permit shortening and expanding',()=>{
  const a=O.fresh(tasks[0]);O.check(a,{common:String(BigInt(O.minimum(a.task))*7n)});O.resolve(a,true);
  const steps=O.steps(a);
  assert.equal(steps.length,4);
  assert.match(steps[0].title,/Gemeinsamen Nenner finden/);
  assert.doesNotMatch(steps[0].text,/kleinste/);
  assert.match(steps[1].text,/Kürzen oder Erweitern/);
  assert.match(steps[2].text,/nur die Zähler/);
  assert.match(steps[2].text,new RegExp(a.common));
  for(const step of steps) {
    for(const key of ['title','text','hint','explanation'])assert.equal(typeof step[key],'string');
    step.fields.forEach(f=>assert.equal(typeof f.value,'string'));
  }
});

test('state validation rejects forged tasks, invalid arithmetic, and malformed storage',()=>{
  const a=finish(O.fresh(tasks[0]));
  for(const modify of [
    x=>x.task.n++,x=>x.common='0',x=>x.common='01',x=>x.pending='3',x=>x.index=5,
    x=>x.help.push(4),x=>x.attempts[1].correct=false,x=>x.drafts[1].left='999',
    x=>x.legacyAttempts=[{step:0,answer:{common:'garbage'},correct:true}],x=>x.extra=true
  ]) {const bad=copy(a);modify(bad);assert.equal(O.validActive(bad),false);}
  assert.throws(()=>O.fresh({...tasks[0],n:999}),RangeError);
  assert.equal(O.validState({level:1,active:a,history:[O.fresh(tasks[0])],intro:false}),false);
});

test('migration resumes each old stage, preserves scores/IDs/history/errors, and never warns anew',()=>{
  const t=tasks.find(t=>BigInt(O.minimum(t))<BigInt(D.lcm(t.d,t.bd)));
  for(let index=0;index<=4;index++) {
    const old=oldActive(t,index),history=oldActive(t,4);
    // Previously invalid smaller common denominators retain their original judgement.
    old.attempts.unshift({step:0,answer:{common:O.minimum(t)},correct:false});
    old.help=[0,2];
    const original=snapshot(old,[history]);original.scores[0]='yellow';
    const untouched=copy(original),next=O.migrateSnapshot(original),a=next.data.active;
    assert.deepEqual(original,untouched);
    assert.equal(next.version,2);assert.equal(next.widget,original.widget);assert.deepEqual(next.scores,original.scores);
    assert.equal(a.index,index);assert.equal(a.pending,null);assert.deepEqual(a.attempts,old.attempts);assert.deepEqual(a.legacyAttempts,old.attempts);assert.deepEqual(a.help,old.help);
    assert.equal(a.common,index?String(D.lcm(t.d,t.bd)):null);
    assert.equal(next.data.history[0].index,4);assert.equal(next.data.history[0].common,String(D.lcm(t.d,t.bd)));
    assert.equal(O.validState(copy(next.data)),true);
    if(index>0) {while(a.index<4)assert.equal(O.check(a,answer(O.steps(a)[a.index])).warning,false);}
    else finish(a);
    assert.equal(O.validState(copy(next.data)),true);
  }
});

test('migration strictly checks the original step contract and rejects foreign or damaged data',()=>{
  const source=snapshot(oldActive(tasks[0],2));
  for(const modify of [
    s=>s.widget='brueche-kuerzen',s=>s.version=3,s=>s.scores.pop(),s=>s.scores[0]='blue',
    s=>s.data.active.task.n++,s=>s.data.active.drafts[0].common='999',
    s=>s.data.active.attempts[0].correct=false,s=>s.data.history.push(oldActive(tasks[0],2)),
    s=>s.data.extra=true
  ]) {const bad=copy(source);modify(bad);assert.throws(()=>O.migrateSnapshot(bad));}
});

test('browser lexical constant works alongside FractionDomain without CommonJS',()=>{
  const context=vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('./domain.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(require.resolve('./operate-domain.js'),'utf8'),context);
  assert.equal(vm.runInContext('OperateDomain.minimum({n:2,d:6,bn:3,bd:9,op:"+"})',context),'3');
  assert.equal(vm.runInContext('OperateDomain.validActive(OperateDomain.fresh(FractionDomain.tasks("operate",1)[0]))',context),true);
});
