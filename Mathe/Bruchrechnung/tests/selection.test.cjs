const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function app(name){const raw=fs.readFileSync(path.join(__dirname,'..',name+'.html'),'utf8');const code=raw.slice(raw.indexOf('const SCENES='),raw.indexOf('function newTask(){'));return new Function(`let state={mode:'multiply',history:[],active:null};`+code+`;return {POOL,chooseTask,ensureSelection,taskKey,numberTaskKey,parseState,get state(){return state},set state(v){state=v}};`)();}
for(const name of ['Das Ganze bestimmen','Anteile berechnen']){
 const a=app(name),groups=new Set(a.POOL.map(a.numberTaskKey)),combinations=new Set(),rounds=new Map(),reviews=new Map();let draws=0,reviewCount=0;
 while(true){const task=a.chooseTask();if(!task)break;const draw={...a.state.selection.pending},key=a.taskKey(task),numeric=a.numberTaskKey(task);draws++;
  assert.ok(draws<a.POOL.length+200,'No repeated-error loop');
  if(draw.kind==='new'){
   if(!rounds.has(draw.round))rounds.set(draw.round,new Set());assert.equal(rounds.get(draw.round).has(numeric),false,'No duplicate numbers inside a round');rounds.get(draw.round).add(numeric);
   assert.equal(combinations.has(key),false,'No reused motif combination');combinations.add(key);
   if(draw.round>1)assert.equal(rounds.get(1).size,groups.size,'Every first-round number appeared before a second motif');
  }else{
   assert.equal(rounds.get(1).size,groups.size);assert.ok(combinations.has(key));const reviewKey=draw.round+':'+key;assert.equal(reviews.has(reviewKey),false);reviews.set(reviewKey,true);reviewCount++;
  }
  // Repeated errors in review deliberately stay wrong; they must never requeue themselves.
  const correct=draw.kind==='new'&&rounds.get(draw.round).size>3;
  a.state.history.push({task,draw,route:'multiply',correct,attempts:[],work:[]});a.state.active={task,draw,stage:'done'};
  if(draws===100){a.ensureSelection();const saved=JSON.stringify(a.state);a.state=JSON.parse(saved);assert.equal(a.state.selection.used.length,100);}
 }
 assert.equal(combinations.size,a.POOL.length);assert.equal(rounds.get(1).size,groups.size);assert.ok(reviewCount>=3);assert.equal(a.state.selection.phase,'complete');assert.equal(a.chooseTask(),null);
 // Reservation happens at draw time, even without answering and across a reload.
 const b=app(name),first=b.chooseTask();b.state=JSON.parse(JSON.stringify(b.state));const second=b.chooseTask();assert.notEqual(b.numberTaskKey(first),b.numberTaskKey(second));
 // Old history imports used combinations and queues one latest failure per combination.
 const c=app(name),t=c.POOL[0];c.state.history=[{task:t,correct:false},{task:t,correct:false}];const ledger=c.ensureSelection();assert.equal(ledger.used.length,1);assert.equal(ledger.retry.length,1);
 console.log(`PASS ${name}: ${groups.size} number groups, ${combinations.size} unique variants, ${reviewCount} bounded error repeats, ${rounds.size} rounds, save/reload and legacy import.`);
}
