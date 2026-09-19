const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const api=require('../dynamot-aufgaben.js');
const finishedStates={};
const fixture=(v='v1')=>({time:0,running:true,slots:[{id:'M1',type:'motor'},{id:'M2',type:'motor'},{id:'L1',type:'lamp'}],devices:[{id:7,type:'motor',slot:'M1',crank:v!=='v4',weight:v==='v4',hand:v!=='v4',omega:5,rate:5,angle:0,mass:.5,height:1.2,power:0},{id:9,type:['v1','v4'].includes(v)?'lamp':'motor',slot:['v1','v4'].includes(v)?'L1':'M2',crank:v==='v2',weight:v==='v3',hand:false,omega:0,rate:5,angle:0,mass:.5,height:.2,power:.1}],wires:[{a:7,ap:0,b:9,bp:0},{a:9,ap:1,b:7,bp:1}]});
const graph=v=>{const c=api.experiments.find(e=>e.id===v).chain,nodes=c.filter((_,i)=>i%2).map((label,i)=>({id:'n'+i,label}));return {nodes,edges:c.filter((_,i)=>!(i%2)).map((energy,i)=>({from:i?nodes[i-1].id:null,to:i<nodes.length?nodes[i].id:null,energy}))};};
assert.equal(api.definitions.length,16);assert.equal(api.create().progress().maxPoints,20);assert.equal(api.palette.flatMap(g=>g.items).length,9);
for(const v of ['v1','v2','v3','v4']){
 let s=fixture(v);assert(api.checkBuild(s,v));s.wires[0].bp=1;s.wires[1].ap=0;assert(api.checkBuild(s,v),'crossed wiring works');
 for(const change of [s=>s.wires.pop(),s=>s.devices[1].slot='M1',s=>s.wires[1].bp=0,s=>s.wires.push({a:7,ap:0,b:7,bp:1}),s=>s.devices[0].crank=s.devices[0].weight=true]){s=fixture(v);change(s);assert.equal(api.checkBuild(s,v),null);}
 const g=graph(v);assert(api.checkDiagram(v,g));g.nodes.reverse();g.edges.reverse();assert(api.checkDiagram(v,g),'array order irrelevant');g.edges.push({from:g.nodes.find(n=>n.label!=='Gewicht').id,to:null,energy:'thermische Energie'});assert(api.checkDiagram(v,g),'optional thermal accepted');g.edges[0].energy='Kernenergie';assert(!api.checkDiagram(v,g));
 const bad=graph(v);bad.edges.pop();assert(!api.checkDiagram(v,bad));bad.edges.push({from:null,to:null,energy:'Licht'});assert(!api.checkDiagram(v,bad));
}
assert(!api.checkDiagram('v1',{nodes:[{id:'x',label:'DynaMot'},{id:'x',label:'Lampe'}],edges:[]}));
const raw=fs.readFileSync(require('node:path').join(__dirname,'../dynamot-labor.html'),'utf8');const model=raw.slice(raw.indexOf('/* MODEL_START */'),raw.indexOf('/* MODEL_END */'));const box={};vm.runInNewContext(model+';this.step=step;',box);
function run(e,s,seconds=2,experiment){let completed=false;for(let i=0;i<seconds/.005;i++){box.step(s.devices,s.wires,.005);s.time+=.005;if(i%20===0)completed=e.observe(s,experiment)||completed;}return completed;}
for(const v of ['v1','v2','v3','v4']){
 const e=api.create({definitions:api.definitions.filter(d=>d.experiment===v)}),s=fixture(v),before=JSON.stringify(s);assert(e.observe(s));assert.equal(JSON.stringify(s),before);assert.equal(e.current().kind,'observe');
 if(v==='v1'){run(e,s);s.devices[0].rate=12;assert(run(e,s));}
 if(v==='v2'){s.devices[0].rate=10;run(e,s);s.devices[0].rate=20;run(e,s);s.devices[0].rate=-20;run(e,s);s.wires[0].bp=1;s.wires[1].ap=0;assert(run(e,s));}
 if(v==='v3'){s.devices[0].rate=25;assert(run(e,s));}
 if(v==='v4'){s.devices[0].omega=0;run(e,s,6);s.devices[0].mass=1;s.devices[0].height=1.2;s.devices[0].omega=0;assert(run(e,s,6));}
 assert.equal(e.current().kind,'choice',v+' action completes');const q=e.current().questions;assert(!e.answer({}).accepted);const wrong=Object.fromEntries(q.map(x=>[x.id,x.options.find(o=>o!==x.answer)]));assert(!e.answer(wrong).correct);assert(e.answer(Object.fromEntries(q.map(x=>[x.id,x.answer]))).correct);
 assert(!e.submitDiagram({nodes:[],edges:[]}).correct);assert(e.submitDiagram(graph(v)).correct);assert(e.progress().done);assert.equal(e.progress().points,5);assert(!e.submitDiagram(graph(v)).accepted);assert.equal(e.progress().points,5);
 finishedStates[v]=e.serialize();
 const resumed=api.create({definitions:api.definitions.filter(d=>d.experiment===v),state:JSON.parse(JSON.stringify(e.serialize()))});assert.deepEqual(resumed.progress(),e.progress());assert.deepEqual(resumed.results(),e.results());
}
let e=api.create(),s=fixture();e.observe(s);s.running=false;assert(!e.observe(s));s.running=true;e.observe(s);s.devices[0].omega=20;s.devices[1].power=1;assert(!e.observe(s),'duplicate time cannot demonstrate action');s.time=1;s.wires.pop();assert(!e.observe(s));
assert.throws(()=>api.create({state:{version:1}}));const lab={...fixture(),widget:'dynamot-lab',version:2,simulationTime:2};const adapted=api.fromLab(lab);assert(api.checkBuild(adapted));adapted.devices[0].crank=false;assert(lab.devices[0].crank);assert.equal(adapted.time,2);
console.log('All four real simulation actions, topology, diagram graph, optional heat, answers, 20-point definitions, persistence and idempotence passed.');

// Alternative action order and restore during an experiment must remain usable.
{
 const defs=api.definitions.filter(d=>d.experiment==='v2');let e=api.create({definitions:defs}),s=fixture('v2');e.observe(s);
 s.wires[0].bp=1;s.wires[1].ap=0;s.devices[0].rate=20;run(e,s);s.devices[0].rate=10;run(e,s);s.devices[0].rate=-10;run(e,s);
 e=api.create({definitions:defs,state:JSON.parse(JSON.stringify(e.serialize()))});s.wires[0].bp=0;s.wires[1].ap=1;assert(run(e,s));assert.equal(e.current().kind,'choice');
}
{
 const defs=api.definitions.filter(d=>d.experiment==='v3'),e=api.create({definitions:defs}),s=fixture('v3');e.observe(s);s.devices[0].omega=25;s.devices[1].omega=2;s.devices[1].power=1;e.observe(s);s.time=.1;s.devices[1].height=1.2;assert(!e.observe(s),'manual teleport must not earn lifting credit');
}
assert.equal(api.checkDiagram('v1',{nodes:[null],edges:[null]}),false);
console.log('Alternative order, partial restore and manual-height-reset regression passed.');
for(const corrupt of [s=>s.answers=[],s=>s.diagrams=true,s=>s.evidence=[],s=>s.completed=Array(17).fill('v1.build'),s=>s.answers.unknown={},s=>s.evidence['v1.observe']={comparison:'true'},s=>s.diagrams['v1.diagram']={nodes:[],edges:[]}]){const state=api.create().serialize();corrupt(state);assert.throws(()=>api.create({state}),'corrupt state must fail');}
console.log('Strict restoration rejects malformed state containers, unknown records, invalid flags and impossible diagrams.');
assert.deepEqual(api.experiments.map(e=>e.id),['v1','v4','v2','v3']);
const oldDefs=['v1','v2','v3','v4'].flatMap(v=>api.definitions.filter(d=>d.experiment===v));
function oldState(ids){const state={version:2,signature:JSON.stringify(oldDefs),completed:[],answers:{},diagrams:{},evidence:{}};for(const id of ids){const s=finishedStates[id];state.completed.push(...s.completed);Object.assign(state.answers,s.answers);Object.assign(state.diagrams,s.diagrams);Object.assign(state.evidence,s.evidence);}return state;}
{
 const old=oldState(['v1','v2']),migrated=api.create({state:old});assert.equal(migrated.current().id,'v4.build');assert.equal(migrated.progress().points,10);assert.deepEqual(migrated.serialize().completed,old.completed);
 const reloaded=api.create({state:JSON.parse(JSON.stringify(migrated.serialize()))});assert.equal(reloaded.current().id,'v4.build');assert.deepEqual(reloaded.results(),migrated.results());
 const s=fixture('v4');reloaded.observe(s);s.devices[0].omega=0;run(reloaded,s,6);s.devices[0].mass=1;s.devices[0].height=1.2;s.devices[0].omega=0;run(reloaded,s,6);reloaded.answer(Object.fromEntries(reloaded.current().questions.map(q=>[q.id,q.answer])));reloaded.submitDiagram(graph('v4'));assert.equal(reloaded.current().id,'v3.build','completed v2 must be skipped after new v4');assert.equal(reloaded.progress().points,15);
}
{
 const old=oldState(['v1','v2','v3','v4']),migrated=api.create({state:old});assert.equal(migrated.current(),null);assert.equal(migrated.progress().points,20);assert.deepEqual(api.create({state:migrated.serialize()}).results(),migrated.results());
}
{
 const old=oldState(['v1']);old.completed.push('v2.build','v2.observe');old.evidence['v2.observe']=finishedStates.v2.evidence['v2.observe'];old.answers['v2.choice']=Object.fromEntries(api.experiments.find(e=>e.id==='v2').questions.map(q=>[q.id,q.options.find(o=>o!==q.answer)]));
 const migrated=api.create({state:old});assert.equal(migrated.current().id,'v4.build');assert.deepEqual(api.create({state:migrated.serialize()}).serialize().answers,old.answers,'unfinished later answers survive migration');
 const bad=oldState(['v1']);bad.completed.push('v2.observe');bad.evidence['v2.observe']=finishedStates.v2.evidence['v2.observe'];assert.throws(()=>api.create({state:bad}),'intra-experiment holes remain invalid');
 const altered=oldState(['v1']);const signature=JSON.parse(altered.signature);signature[0].text+=' modified';altered.signature=JSON.stringify(signature);assert.throws(()=>api.create({state:altered}),'changed definitions are not an order migration');
}
console.log('Stable-ID order migration: half/full/unfinished old states, hole-preserving restore, skip completed later experiment, reject changed definitions passed.');

// The selected experiment owns its next step; the global first-open step is only a legacy default.
{
 let free=api.create(),v4=fixture('v4'),v2=fixture('v2');
 assert.equal(free.current('v4').id,'v4.build');
 assert(free.observe(v4,'v4'));assert.equal(free.current('v4').id,'v4.observe');
 assert(free.observe(v2,'v2'));assert.equal(free.current('v2').id,'v2.observe');
 assert.equal(free.current('v1').id,'v1.build');
 free=api.create({state:JSON.parse(JSON.stringify(free.serialize()))});
 assert.equal(free.current('v4').id,'v4.observe');assert.equal(free.current('v2').id,'v2.observe');
 assert.equal(free.progress().points,2);
 v4.devices[0].omega=0;run(free,v4,6,'v4');
 v4.devices[0].mass=1;v4.devices[0].height=1.2;v4.devices[0].omega=0;
 assert(run(free,v4,6,'v4'));
 assert.equal(free.current('v4').kind,'choice');
 assert.equal(free.current('v2').kind,'observe','another experiment remains at its own step');
 const questions=free.current('v4').questions;
 assert(free.answer(Object.fromEntries(questions.map(q=>[q.id,q.answer])),'v4').correct);
 assert(free.submitDiagram(graph('v4'),'v4').correct);
 assert.equal(free.current('v4'),null);
 assert.equal(free.current().id,'v1.build');
 assert.equal(free.progress().points,6);
 assert.equal(free.observe(v4,'v4'),false,'finished experiment cannot gain points');
 const saved=free.serialize(),again=api.create({state:JSON.parse(JSON.stringify(saved))});
 assert.deepEqual(again.serialize(),saved);
 assert.equal(again.current('v2').id,'v2.observe');
 assert.equal(again.current('v4'),null);
}
{
 const free=api.create(),s=fixture('v1');assert(free.observe(s,'v1'));
 run(free,s,.5,'v1');assert.equal(free.current('v1').kind,'observe');
 free.current('v2');s.devices[0].rate=12;
 assert.equal(run(free,s,.5,'v1'),false,'measurement samples from before a visit elsewhere cannot finish a comparison');
 assert.equal(free.current('v1').kind,'observe');
}
console.log('Free experiment selection, independent step order, nonprefix completion, points and reload passed.');
