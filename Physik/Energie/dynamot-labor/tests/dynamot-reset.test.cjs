const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const Tasks=require('../dynamot-aufgaben.js');

const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures','dynamot-altstand-v2.json'),'utf8'));
const saved=name=>{
 const item=fixture.cases.find(c=>c.name===name);
 assert(item,name+' fixture exists');
 const lab=JSON.parse(Buffer.from(item.raw.slice('DYNAMOT1:'.length),'base64').toString('utf8'));
 return lab.tasks['dynamot-learning-v2'].engine;
};
const otherRecords=(records,id)=>Object.fromEntries(Object.entries(records).filter(([key])=>!key.startsWith(id+'.')));
function assertOnlyReset(before,after,id){
 assert.equal(after.version,before.version);
 assert.equal(after.signature,JSON.stringify(Tasks.definitions));
 assert.deepEqual(after.completed,before.completed.filter(step=>!step.startsWith(id+'.')));
 for(const key of ['answers','diagrams','evidence']){
  assert.deepEqual(after[key],otherRecords(before[key],id),key+' from other experiments survive unchanged');
 }
}

test('resetting one full experiment removes only its five points and restores its first step',()=>{
 const engine=Tasks.create({state:saved('all-four-complete')}),before=engine.serialize();
 assert.equal(engine.progress().points,20);
 const result=engine.resetExperiment('v4');
 assert.equal(result.points,15);assert.equal(result.done,false);
 assert.equal(engine.current('v4').id,'v4.build');
 assert.equal(engine.current().id,'v4.build');
 for(const id of ['v1','v2','v3'])assert.equal(engine.current(id),null);
 assertOnlyReset(before,engine.serialize(),'v4');
 const restored=Tasks.create({state:engine.serialize()});
 assert.deepEqual(restored.serialize(),engine.serialize());
 assert.deepEqual(restored.progress(),engine.progress());
});

test('resetting a partial experiment removes its observation evidence but keeps other completed experiments',()=>{
 const engine=Tasks.create({state:saved('unfinished-observation')}),before=engine.serialize();
 assert.equal(before.evidence['v2.observe'].normal,true);
 assert.equal(engine.current('v2').id,'v2.observe');
 const priorPoints=engine.progress().points;
 engine.resetExperiment('v2');
 assert.equal(engine.progress().points,priorPoints-1);
 assert.equal(engine.current('v2').id,'v2.build');
 assert.equal(engine.current('v1'),null);assert.equal(engine.current('v4'),null);
 assertOnlyReset(before,engine.serialize(),'v2');
 assert.deepEqual(Tasks.create({state:engine.serialize()}).serialize(),engine.serialize());
});

test('old-order prefix with cross-experiment holes remains reloadable after reset',()=>{
 const engine=Tasks.create({state:saved('old-order-prefix-with-hole')}),before=engine.serialize();
 assert.equal(engine.progress().points,10);
 assert.equal(engine.current().id,'v4.build');
 engine.resetExperiment('v2');
 assert.equal(engine.progress().points,5);
 assert.equal(engine.current('v1'),null);
 assert.equal(engine.current('v2').id,'v2.build');
 assert.equal(engine.current('v4').id,'v4.build');
 assertOnlyReset(before,engine.serialize(),'v2');
 assert.deepEqual(Tasks.create({state:engine.serialize()}).serialize(),engine.serialize());
});

test('wrong stored answer is deleted and invalid IDs never mutate state',()=>{
 const engine=Tasks.create({state:saved('wrong-choice-and-draft')}),before=engine.serialize();
 assert(before.answers['v1.choice']);
 assert.throws(()=>engine.resetExperiment('unknown'),RangeError);
 assert.throws(()=>engine.resetExperiment('v1.choice'),RangeError);
 assert.deepEqual(engine.serialize(),before);
 engine.resetExperiment('v1');
 assert.equal(engine.progress().points,0);
 assert.equal(engine.current('v1').id,'v1.build');
 assertOnlyReset(before,engine.serialize(),'v1');
});

test('resetting a different experiment keeps the active measurement samples',()=>{
 const engine=Tasks.create();
 const snapshot={time:0,running:true,slots:[{id:'M1',type:'motor'},{id:'L1',type:'lamp'}],devices:[
  {id:1,type:'motor',slot:'M1',crank:true,weight:false,hand:true,omega:5},
  {id:2,type:'lamp',slot:'L1',crank:false,weight:false,hand:false,omega:0,power:.1}
 ],wires:[{a:1,ap:0,b:2,bp:0},{a:2,ap:1,b:1,bp:1}]};
 assert(engine.observe(snapshot,'v1'));
 snapshot.time=1;assert.equal(engine.observe(snapshot,'v1'),false);
 engine.resetExperiment('v2');
 snapshot.time=1.3;snapshot.devices[0].omega=10;snapshot.devices[1].power=.25;
 assert(engine.observe(snapshot,'v1'));
 assert.equal(engine.current('v1').id,'v1.choice');
});
