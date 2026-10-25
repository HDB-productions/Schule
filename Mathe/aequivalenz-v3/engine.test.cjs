'use strict';
const assert = require('node:assert/strict');
const {performance} = require('node:perf_hooks');
const A = require('./algebra.js');
const E = require('./engine.js');

// Help follows either solving direction, explains division, and never fills the input.
for (const [source,pattern] of [['3=2x+1',/rechten/],['12\/(-3)=x',/Division/]]) {
  const t=E.makeTask(source),before=t.input;
  E.requestHelp(t); E.requestHelp(t);
  assert.match(E.hint(t).text,pattern);
  assert.equal(t.input,before);
  assert.ok(E.hint(t).visual);
  assert.notEqual(E.hint(t).text,E.nextAnswer(t));
}

const clone = value => JSON.parse(JSON.stringify(value));
const start = text => E.makeTask(text);
const answer = (task, text = E.nextAnswer(task)) => {
  const result = E.apply(task, text);
  assert.equal(result.ok, true, `${E.phase(task)}: ${text}: ${result.error}`);
};
const finish = task => {
  for(let n=0;E.phase(task)!=='done'&&n<30;n++)answer(task);
  assert.equal(E.phase(task),'done',task.initial);
};
function random(seed){let state=seed>>>0;return () => ((state=(Math.imul(1664525,state)+1013904223)>>>0)/4294967296);}
function colorCounts(board){return Object.fromEntries(['green','yellow','gray','red'].map(c=>[c,board.filter(x=>x===c).length]));}

// A free operation may work from either side; every step preserves the solution set.
{
  const task=start('7x-7=2x+5');
  assert.equal(E.phase(task),'operation');
  answer(task,'-7x');
  assert.deepEqual(E.expected(task),A.equation('-7= -5x+5'));
  answer(task,'-7');
  answer(task,'-5x+5');
  assert.equal(E.phase(task),'operation');
  finish(task);
  assert.equal(task.solution,'12/5');
  assert.equal(task.kind,'unique');
  assert.deepEqual(E.hint(task),null);
}
{
  const t=start('7x-7=2x+5');
  assert.ok(A.advisory(E.current(t),'+100').length);
  answer(t,'+100');
  assert.equal(E.changeOperation(t),true);
  assert.equal(E.phase(t),'operation');
  assert.equal(t.tainted,false);
  assert.equal(t.lines.length,1);
  answer(t,'-2x');
  finish(t);
  assert.equal(t.tainted,false);
  assert.equal(t.award,null); // Accounting is a separate transition.
  const resumed=E.fresh();resumed.tasks=[t];resumed.nextId=2;
  E.account(resumed,t);
  assert.equal(E.validate(clone(resumed)),true);
}
for(const [source,kind,solution] of [
  ['3(x+2)-x=2x+6','all','ℝ'],
  ['3(x+2)-x=2x+7','none',''],
  ['3(x+2)-x=x+6','unique','0']
]){
  const t=start(source);
  assert.equal(t.kind,kind);
  assert.equal(E.phase(t),'left');
  assert.match(E.instruction(t),/Klammer/);
  answer(t,'2x+6');
  assert.equal(E.phase(t),'operation');
  finish(t);
  assert.equal(t.solution,solution);
}
{
  const t=start('x+x+2+3=10');
  assert.equal(E.phase(t),'left');
  answer(t,'x+x+5'); // Equal in value, still visibly unsimplified.
  assert.equal(t.lines.at(-1).left,'x+x+5');
  assert.equal(E.phase(t),'left');
  answer(t,'2x+5');
  finish(t);
  assert.equal(t.solution,'5/2');
}
for(const [source,entry,expected] of [
  ['2x=1','0,5','0,5'],
  ['3x=1','1/3','1/3'],
  ['2x+1=1','0','0'],
  ['2=2','R','R'],
  ['3=2','','']
]){
  const t=start(source);
  while(E.phase(t)!=='solution')answer(t);
  answer(t,entry);
  assert.equal(t.solution,expected);
}
for(const op of ['*0',':0','*x',':x','+(x*x)']){
  const t=start('x=2');
  // A terminal equation needs an operation context to test rejected operations.
  const working=start('2x=4');
  assert.equal(E.phase(t),'solution');
  const before=clone(working.lines);
  const result=E.apply(working,op);
  assert.equal(result.ok,false,op);
  assert.deepEqual(working.lines,before);
  assert.equal(working.tainted,true);
}

// Help stays on the current field. The third hint never fills it; auto answer is explicit.
{
  const s=E.fresh(),rng=random(811); E.newTask(s,rng); const t=s.tasks[0];
  const originalPhase=E.phase(t),originalLines=clone(t.lines);
  for(let level=1;level<=3;level++){
    assert.equal(E.requestHelp(t),true);
    const h=E.hint(t);
    assert.equal(h.level,level);
    assert.ok(h.text.length>10);
    assert.equal(E.phase(t),originalPhase);
    assert.deepEqual(t.lines,originalLines);
  }
  assert.equal(E.requestHelp(t),false);
  assert.equal(t.usedSolve,false);
  const automatic=E.nextAnswer(t);
  assert.equal(E.apply(t,automatic,true).ok,true);
  assert.equal(t.usedSolve,true);
  assert.equal(t.lines[0].right,originalLines[0].right);
  assert.equal(t.lines[0].left,originalLines[0].left);
  E.account(s,t);
  assert.equal(t.award,'red');
  assert.equal(s.board.at(-1),'red');
  assert.equal(s.totals.total,0);
  E.account(s,t);
  assert.equal(s.board.filter(x=>x==='red').length,1);
  finish(t); E.account(s,t); E.account(s,t);
  assert.equal(s.totals.total,1);
  assert.equal(s.totals.red,1);
  assert.equal(E.validate(s),true);
}

// Exhaust every reachable score count and incoming result, including a full board.
for(let g=0;g<=20;g++)for(let y=0;y<=20-g;y++)for(let r=0;r<=20-g-y;r++){
  const old=[...Array(g).fill('green'),...Array(y).fill('yellow'),...Array(20-g-y-r).fill('gray'),...Array(r).fill('red')];
  for(const incoming of ['green','yellow','red']){
    const next=E.scoreAdd(old,incoming),c=colorCounts(next),full=g+y+r===20;
    assert.equal(next.length,20);
    assert.deepEqual(next,[...Array(c.green).fill('green'),...Array(c.yellow).fill('yellow'),...Array(c.gray).fill('gray'),...Array(c.red).fill('red')]);
    assert.equal(c.green+c.yellow+c.red,Math.min(20,g+y+r+1));
    if(!full){assert.equal(c[incoming],{green:g,yellow:y,red:r}[incoming]+1);continue;}
    if(incoming==='red'){
      if(y){assert.equal(c.yellow,y-1);assert.equal(c.red,r+1);}
      else if(g){assert.equal(c.green,g-1);assert.equal(c.yellow,y+1);assert.equal(c.red,r);}
      else assert.deepEqual(c,{green:g,yellow:y,gray:0,red:r});
    } else if(r){assert.equal(c.red,r-1);assert.equal(c[incoming],{green:g,yellow:y}[incoming]+1);}
    else if(incoming==='green'&&y){assert.equal(c.green,g+1);assert.equal(c.yellow,y-1);}
    else if(incoming==='yellow'&&g){assert.equal(c.green,g-1);assert.equal(c.yellow,y+1);}
    else assert.deepEqual(c,{green:g,yellow:y,gray:0,red:r});
  }
}

// Saved drafts, help, solved answers, and replay corruption.
{
  const s=E.fresh(),rng=random(23);E.newTask(s,rng);const t=s.tasks[0];
  t.input='mein Entwurf';
  assert.equal(E.requestHelp(t),true);
  assert.equal(E.validate(s),true);
  const saved=clone(s);
  assert.equal(E.validate(saved),true);
  const tampered=clone(saved);tampered.tasks[0].lines[0].left='999x';
  assert.equal(E.validate(tampered),false);
  const badEvent=clone(saved);badEvent.tasks[0].events[0].level=3;
  assert.equal(E.validate(badEvent),false);
  const badTotals=clone(saved);badTotals.totals.total=1;
  assert.equal(E.validate(badTotals),false);
  finish(t);E.account(s,t);
  assert.equal(E.validate(clone(s)),true);
  const badSolution=clone(s);badSolution.tasks[0].solution='999';
  assert.equal(E.validate(badSolution),false);
}

// Individual entries retain their own first-attempt/help/solve colors across reload.
{
  const t=E.makeTask('2x+3=x+5');
  const check=()=>{const colors=E.copy(E.entryColors(t));assert.deepEqual(E.entryColors(clone(t)),colors);return colors;};
  E.apply(t,'*0');check();E.apply(t,'-x');
  assert.equal(check().lines[0].operation,'yellow');
  E.apply(t,'x+3');assert.equal(check().pending.left,'green');
  E.apply(t,'999');E.apply(t,'5');
  assert.deepEqual(check().lines[1],{left:'green',right:'yellow',operation:null});
  E.requestHelp(t);E.apply(t,'-3');assert.equal(check().lines[1].operation,'yellow');
  E.apply(t,'x');E.apply(t,'2');assert.equal(check().lines[2].left,'green');
  E.apply(t,'3');E.apply(t,'2');assert.equal(check().solution,'yellow');
  assert.equal(t.usedSolve,false);
  const solved=E.makeTask('2(x+1)=x+4');
  E.requestHelp(solved);E.requestHelp(solved);E.requestHelp(solved);
  E.apply(solved,E.nextAnswer(solved),true);
  assert.equal(E.entryColors(solved).lines[1].left,'red');
  E.apply(solved,'-x');E.apply(solved,'x+2');E.apply(solved,'4');
  assert.equal(E.entryColors(solved).lines[2].left,'green');
  assert.deepEqual(E.entryColors(clone(solved)),E.entryColors(solved));
  const revised=E.makeTask('2x+3=x+5');E.apply(revised,'+100');E.entryColors(revised);
  E.changeOperation(revised);assert.equal(E.entryColors(revised).lines[0].operation,null);
  E.apply(revised,'-x');assert.equal(E.entryColors(revised).lines[0].operation,'green');
  const skip=E.makeTask('2(x+1)=2(x+2)');E.apply(skip,'999');E.apply(skip,'2x+2');E.entryColors(skip);
  E.skipSimplification(skip);assert.equal(E.entryColors(skip).lines[1].left,'yellow');
  E.simplify(skip);assert.equal(E.entryColors(skip).pending.left,'yellow');
  E.apply(skip,'2x+4');assert.equal(E.entryColors(skip).lines[2].right,'green');
  assert.deepEqual(E.entryColors(clone(skip)),E.entryColors(skip));
  console.log('PASS per-entry green/yellow/red, later independent entries, reload, help, operation change and partial simplification');
}

// Compound operations and migration of historical subtraction semantics.
{
  const t=E.makeTask('2x=3x+8');answer(t,'-2x-8');
  assert.equal(E.nextAnswer(t),'-8');answer(t,'-8');assert.equal(E.nextAnswer(t),'x');answer(t,'x');
  assert.equal(E.phase(t),'solution');answer(t,'-8');
  assert.equal(t.solution,'-8');
  function legacyTask(done=false){
    const s=E.fresh();s.schema=1;const t=E.makeTask('2x=3x+8');t._legacyOperations=true;
    s.tasks=[t];s.nextId=2;answer(t,'−2x−8');
    E.requestHelp(t);E.requestHelp(t);E.requestHelp(t);E.apply(t,E.nextAnswer(t),true);E.account(s,t);
    if(done){while(!t.done){answer(t);E.account(s,t);}}
    else t.input='mein Entwurf';
    delete t._legacyOperations;return s;
  }
  for(const done of [false,true]){
    const old=legacyTask(done),original=clone(old);assert.equal(E.validate(old),true);
    const migrated=E.upgrade(old);assert.deepEqual(old,original);assert.equal(migrated.schema,2);
    assert.equal(E.validate(migrated),true);assert.deepEqual(migrated.board,old.board);
    assert.deepEqual(migrated.totals,old.totals);assert.deepEqual(migrated.archive,old.archive);
    const m=migrated.tasks[0];assert.equal(m.lines[0].operation,'-(2x-8)');
    assert.equal(m.events[0].originalInput,'−2x−8');assert.equal(m.input,old.tasks[0].input);
    assert.equal(m.award,'red');assert.deepEqual(E.upgrade(migrated),migrated);
    assert.deepEqual(E.entryColors(clone(m)),E.entryColors(m));
    if(!done){answer(m,'x+16');assert.equal(E.phase(m),'operation');answer(m,'-16');
      assert.equal(E.nextAnswer(m),'-8');while(!m.done){answer(m);E.account(migrated,m);}assert.equal(m.solution,'-8');}
    assert.equal(E.validate(clone(migrated)),true);
  }
  // A maximal legacy input gains two explicit grouping characters without dropping data.
  const s=E.fresh();s.schema=1;const long=E.makeTask('2x=3x+8');long._legacyOperations=true;
  s.tasks=[long];s.nextId=2;const op='-2x'+'-0'.repeat(77)+'-01';assert.equal(op.length,160);
  answer(long,op);delete long._legacyOperations;assert.equal(E.validate(s),true);
  const upgraded=E.upgrade(s);assert.equal(upgraded.tasks[0].events[0].input.length,162);
  assert.equal(E.validate(clone(upgraded)),true);
  assert.throws(()=>E.apply(E.makeTask('2x=3x+8'),op+'0'),/160/);
  const invalid=legacyTask();invalid.tasks[0].pending.left='999';assert.equal(E.validate(invalid),false);
  assert.throws(()=>E.upgrade(invalid),/Originalstand/);
  console.log('PASS compound subtraction and non-destructive migration of partial/completed/long legacy saves');
}

// A long learning history keeps only 50 tasks while preserving exact totals.
{
  const s=E.fresh(),rng=random(20261001),kinds={unique:0,all:0,none:0};
  let sizeAt50=0,sizeAt1200=0;
  for(let i=0;i<1200;i++){
    assert.equal(E.newTask(s,rng),true);
    const t=s.tasks.at(-1);kinds[t.kind]++;
    finish(t);E.account(s,t);
    if((i+1)%3===0)assert.deepEqual(kinds,{unique:(i+1)/3,all:(i+1)/3,none:(i+1)/3});
    if(i===49){sizeAt50=JSON.stringify(s).length;assert.equal(E.validate(clone(s)),true);}
    if(i===1199)sizeAt1200=JSON.stringify(s).length;
  }
  assert.equal(s.tasks.length,50);
  assert.equal(s.archive.total,1150);
  assert.deepEqual(s.totals,{total:1200,green:1200,yellow:0,red:0,unique:400,all:400,none:400});
  for(const key of Object.keys(s.totals))assert.equal(s.archive[key]+s.tasks.filter(t=>t.done&&t.kind===key||t.done&&t.award===key||(key==='total'&&t.done)).length,s.totals[key]);
  assert.ok(sizeAt1200<sizeAt50*2.5,`${sizeAt50} -> ${sizeAt1200}`);
  const serialized=JSON.stringify(s),resumed=JSON.parse(serialized),startTime=performance.now();
  assert.equal(E.validate(resumed),true);
  const ms=performance.now()-startTime;
  assert.ok(ms<5000,`validation took ${ms.toFixed(1)} ms`);
  assert.deepEqual(resumed,s);
  console.log(`Engine: 1200 tasks, 50 retained, ${sizeAt50} -> ${sizeAt1200} bytes, validation ${ms.toFixed(1)} ms.`);
}
