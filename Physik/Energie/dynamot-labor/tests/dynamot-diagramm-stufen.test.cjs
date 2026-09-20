const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const Tasks=require('../dynamot-aufgaben.js');
const Stages=require('../dynamot-diagramm-stufen.js');
const clone=value=>JSON.parse(JSON.stringify(value));
const sources=id=>Tasks.experiments.find(e=>e.id===id).chain.flatMap((label,i)=>i%2&&label!=='Gewicht'?[i]:[]);
const full=id=>{
 const value=Stages.seed(id);
 value.branches=sources(id).map((from,i)=>({from,energy:'thermische Energie',fraction:[.05,.25,.95][i%3]}));
 return value;
};

test('all four experiments: exact basic chain, complete heat losses, and no thermal main arrow',()=>{
 for(const ex of Tasks.experiments){
  const basic=Stages.seed(ex.id);
  assert.equal(Stages.basicCorrect(ex.id,basic),true,ex.id);
  assert.equal(Stages.lossesCorrect(ex.id,basic),false,ex.id);
  const losses=full(ex.id);
  assert.equal(Stages.basicCorrect(ex.id,losses),false,ex.id+' basic excludes branches');
  assert.equal(Stages.lossesCorrect(ex.id,losses),true,ex.id);
  const wrong=clone(basic);wrong.main[0]={kind:'energy',label:'thermische Energie'};
  assert.equal(Stages.basicCorrect(ex.id,wrong),false,ex.id);
  assert.equal(Stages.lossesCorrect(ex.id,wrong),false,ex.id);
  const wrongKind=clone(basic);wrongKind.main[1].kind='energy';
  assert.equal(Stages.basicCorrect(ex.id,wrongKind),false,ex.id);
  assert.equal(Stages.basicCorrect(ex.id,{...basic,branches:undefined}),false,ex.id);
 }
 assert.equal(Stages.basicCorrect('unknown',Stages.seed('v1')),false);
 assert.throws(()=>Stages.seed('unknown'));
});

test('weight stores energy and is never a thermal side-output',()=>{
 for(const id of ['v3','v4']){
  const ex=Tasks.experiments.find(e=>e.id===id),weight=ex.chain.indexOf('Gewicht');
  assert(weight%2===1);
  const value=full(id);
  assert(!value.branches.some(b=>b.from===weight));
  assert.equal(Stages.lossesCorrect(id,value),true);
  value.branches.push({from:weight,energy:'thermische Energie',fraction:.25});
  assert.equal(Stages.lossesCorrect(id,value),false);
 }
});

test('losses require one legal branch per converter and finite numeric shares within bounds',()=>{
 const correct=full('v4');
 const variants=[
  value=>value.branches.pop(),
  value=>value.branches.push({...value.branches[0]}),
  value=>value.branches[0].energy='Licht',
  value=>value.branches[0].from=0,
  value=>delete value.branches[0].fraction,
  value=>value.branches[0].fraction='0.25',
  value=>value.branches[0].fraction=0,
  value=>value.branches[0].fraction=.951,
  value=>value.branches[0].fraction=NaN
 ];
 for(const mutate of variants){const value=clone(correct);mutate(value);assert.equal(Stages.lossesCorrect('v4',value),false);}
 const lower=clone(correct),upper=clone(correct);lower.branches[0].fraction=.05;upper.branches[0].fraction=.95;
 assert(Stages.lossesCorrect('v4',lower));assert(Stages.lossesCorrect('v4',upper));
});

test('seed reconstructs the exact chain and retains only legal legacy branches',()=>{
 const legacy={main:[{kind:'energy',label:'incorrect'}],branches:[
  {from:3,energy:'thermische Energie'},
  {from:1,energy:'thermische Energie',fraction:.4},
  {from:3,energy:'thermische Energie',fraction:.5},
  {from:5,energy:'thermische Energie'}, // Weight in v3: no heat branch.
  {from:8,energy:'thermische Energie'},
  {from:1,energy:'Licht'},
  {from:1,energy:'thermische Energie',fraction:2}
 ]};
 const seeded=Stages.seed('v3',legacy);
 assert.deepEqual(seeded.branches,[
  {from:3,energy:'thermische Energie',fraction:.25},
  {from:1,energy:'thermische Energie',fraction:.4}
 ]);
 assert.deepEqual(seeded.main,Stages.seed('v3').main);
 assert.equal(Stages.basicCorrect('v3',seeded),false);
 assert.equal(Stages.lossesCorrect('v3',seeded),true);
 assert.equal(legacy.branches[0].fraction,undefined,'seed does not mutate the saved legacy value');
});

test('extension persistence permits old stores and incomplete legal drafts after earned diagram',()=>{
 assert(Stages.validateExtensions(undefined,{completed:[]}));
 const draft=Stages.seed('v1');draft.branches.push({from:1,energy:'thermische Energie',fraction:.2});
 const record={v1:{value:draft,completed:false}};
 assert(Stages.validateExtensions(record,{completed:['v1.diagram']}));
 record.v1={value:full('v1'),completed:true};
 assert(Stages.validateExtensions(record,{completed:['v1.diagram']}));
});

test('extension persistence rejects unknown, premature, malformed, and falsely completed entries',()=>{
 const good={v1:{value:full('v1'),completed:true}};
 const cases=[
  [null,{completed:['v1.diagram']}],
  [[],{completed:['v1.diagram']}],
  [good,{completed:[]}],
  [{unknown:{value:full('v1'),completed:true}},{completed:['v1.diagram']}],
  [{'v1.diagram':{value:full('v1'),completed:true}},{completed:['v1.diagram']}],
  [{v1:{value:Stages.seed('v1'),completed:true}},{completed:['v1.diagram']}],
  [{v1:{value:full('v1'),completed:'true'}},{completed:['v1.diagram']}],
  [{v1:{value:{main:[],branches:[]},completed:false}},{completed:['v1.diagram']}],
  [{v1:{value:{...full('v1'),branches:[{from:1,energy:'thermische Energie'}]},completed:false}},{completed:['v1.diagram']}]
 ];
 for(const [record,engineState]of cases)assert.throws(()=>Stages.validateExtensions(record,engineState));
});

test('UMD browser global uses existing tasks without changing definitions or engine state',()=>{
 const before=JSON.stringify(Tasks.definitions),root=path.join(__dirname,'..');
 const context=vm.createContext({});
 vm.runInContext(fs.readFileSync(path.join(root,'dynamot-aufgaben.js'),'utf8'),context);
 vm.runInContext(fs.readFileSync(path.join(root,'dynamot-diagramm-stufen.js'),'utf8'),context);
 assert.equal(context.DynamotDiagramStages.basicCorrect('v1',context.DynamotDiagramStages.seed('v1')),true);
 assert.equal(JSON.stringify(Tasks.definitions),before);
 assert.equal(Tasks.create().progress().maxPoints,20);
});
