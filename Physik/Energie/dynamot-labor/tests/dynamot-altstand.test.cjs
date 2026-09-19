const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');

const folder=path.join(__dirname,'..');
const fixturePath=path.join(__dirname,'fixtures','dynamot-altstand-v2.json');
const tasks=require(path.join(folder,'dynamot-aufgaben.js'));
const copy=value=>JSON.parse(JSON.stringify(value));
const encode=value=>'DYNAMOT1:'+Buffer.from(JSON.stringify(value),'utf8').toString('base64');
const decode=raw=>JSON.parse(Buffer.from(raw.slice(9),'base64').toString('utf8'));
const graph=(api,id)=>{
 const chain=api.experiments.find(e=>e.id===id).chain;
 const nodes=chain.filter((_,i)=>i%2).map((label,i)=>({id:'n'+i,label}));
 return {nodes,edges:chain.filter((_,i)=>!(i%2)).map((energy,i)=>({from:i?nodes[i-1].id:null,to:i<nodes.length?nodes[i].id:null,energy}))};
};
const device=(id,type,slot,parts={})=>({id,type,slot,crank:false,weight:false,hand:false,omega:0,angle:0,mass:.5,height:.2,rate:5,power:0,...parts});
const laboratory=id=>{
 const first=device(7,'motor','M1',{crank:id!=='v4',weight:id==='v4',hand:id!=='v4',omega:5,height:1.2});
 const second=['v1','v4'].includes(id)?device(9,'lamp','L1',{power:.1,lampR:8}):device(9,'motor','M2',{crank:id==='v2',weight:id==='v3',power:.1});
 return {time:0,running:true,slots:[{id:'M1',type:'motor'},{id:'M2',type:'motor'},{id:'L1',type:'lamp'}],devices:[first,second],wires:[{a:7,ap:0,b:9,bp:0},{a:9,ap:1,b:7,bp:1}]};
};
function extractOriginal(html){
 const start=html.indexOf('/* Read-only task engine; browser global and CommonJS. No DOM or storage writes. */');
 const endMark='return {palette,experiments,definitions,fromLab,checkBuild,checkDiagram,create};';
 const last=html.indexOf(endMark,start);
 assert(start>=0&&last>start,'original task engine is present');
 const context={module:{exports:{}}};
 vm.runInNewContext(html.slice(start,html.indexOf('});',last)+3),context);
 const model=html.slice(html.indexOf('/* MODEL_START */'),html.indexOf('/* MODEL_END */'));
 assert(model.includes('function step('),'original simulation model is present');
 const physics={};vm.runInNewContext(model+';this.step=step;',physics);
 return {api:context.module.exports,step:physics.step};
}
function simulate(engine,lab,step,seconds=2){
 let finished=false;
 for(let i=0;i<seconds/.005;i++){
  step(lab.devices,lab.wires,.005);lab.time+=.005;
  if(i%20===0)finished=engine.observe(lab)||finished;
 }
 return finished;
}
function doBuild(engine,id){const lab=laboratory(id);assert(engine.observe(lab),id+' original build');return lab;}
function doObservation(engine,id,lab,step){
 if(id==='v1'){
  simulate(engine,lab,step);lab.devices[0].rate=12;assert(simulate(engine,lab,step));
 }else if(id==='v2'){
  lab.devices[0].rate=10;simulate(engine,lab,step);
  lab.devices[0].rate=20;simulate(engine,lab,step);
  lab.devices[0].rate=-20;simulate(engine,lab,step);
  lab.wires[0].bp=1;lab.wires[1].ap=0;assert(simulate(engine,lab,step));
 }else if(id==='v3'){
  lab.devices[0].rate=25;assert(simulate(engine,lab,step));
 }else{
  lab.devices[0].omega=0;simulate(engine,lab,step,6);
  lab.devices[0].mass=1;lab.devices[0].height=1.2;lab.devices[0].omega=0;
  assert(simulate(engine,lab,step,6));
 }
 assert.equal(engine.current().kind,'choice');
}
function finishExperiment(engine,api,id,step){
 const lab=doBuild(engine,id);doObservation(engine,id,lab,step);
 assert(engine.answer(Object.fromEntries(engine.current().questions.map(q=>[q.id,q.answer]))).correct);
 assert(engine.submitDiagram(graph(api,id)).correct);
 return lab;
}
function storeFor(engine,builds={},extras={}){
 const notes={v1:'Alte Notiz: Kurbel schneller → Lampe heller.',...extras.notes};
 return {version:2,engine:copy(engine.serialize()),drafts:extras.drafts||{},builds:copy(builds),notes,pages:extras.pages||{v1:{scroll:73,open:['Hilfe zum Aufbau']}},chosen:extras.chosen||'v1'};
}
function buildRecord(lab){return {devices:copy(lab.devices),wires:copy(lab.wires)};}
function payload(store,lab=laboratory('v1')){
 return encode({widget:'dynamot-lab',version:2,next:10,simulationTime:lab.time,electronFlow:true,tasks:{'dynamot-learning-v2':store},devices:copy(lab.devices),wires:copy(lab.wires),camera:{position:[1.2,3.4,5.6],target:[0,0,0]},ui:{selected:7,selectedWire:0,pending:null,tool:null,panelOpen:true,slotPopup:null,helpOpen:true},undoBuild:null,running:false});
}
function fixtureFromOriginal(filename){
 const html=fs.readFileSync(filename,'utf8');
 const {api,step}=extractOriginal(html);
 const canonical=defs=>JSON.stringify([...defs].sort((a,b)=>a.id.localeCompare(b.id)));
 assert.equal(canonical(api.definitions),canonical(tasks.definitions),'fixture source matches stable definitions');
 const cases=[];
 const add=(name,engine,store,lab)=>cases.push({name,raw:payload(store,lab),expected:{points:engine.progress().points,next:engine.current()?.id||null,completed:copy(engine.serialize().completed)}});

 let engine=api.create();add('empty',engine,storeFor(engine));

 engine=api.create();let lab=doBuild(engine,'v1');doObservation(engine,'v1',lab,step);
 const wrong=Object.fromEntries(engine.current().questions.map(q=>[q.id,q.options.find(o=>o!==q.answer)]));
 assert.equal(engine.answer(wrong).correct,false);
 add('wrong-choice-and-draft',engine,storeFor(engine,{v1:buildRecord(lab)},{drafts:{'v1.choice':wrong},chosen:'v1'}),lab);

 engine=api.create();let builds={};
 for(const id of api.experiments.map(e=>e.id)){lab=finishExperiment(engine,api,id,step);builds[id]=buildRecord(lab);}
 assert.equal(engine.progress().points,20);
 add('all-four-complete',engine,storeFor(engine,builds,{chosen:'summary',notes:{v4:'Gewicht und Licht verglichen.'}}),lab);

 engine=api.create();builds={};
 for(const id of ['v1','v4']){lab=finishExperiment(engine,api,id,step);builds[id]=buildRecord(lab);}
 lab=doBuild(engine,'v2');builds.v2=buildRecord(lab);
 lab.devices[0].rate=10;simulate(engine,lab,step,.6);
 assert.equal(engine.current().id,'v2.observe');
 assert.equal(engine.activity().normal,true);
 add('unfinished-observation',engine,storeFor(engine,builds,{chosen:'v2'}),lab);

 const oldOrder=['v1','v2','v3','v4'].flatMap(id=>api.definitions.filter(d=>d.experiment===id));
 engine=api.create({definitions:oldOrder});builds={};
 for(const id of ['v1','v2']){lab=finishExperiment(engine,api,id,step);builds[id]=buildRecord(lab);}
 add('old-order-prefix-with-hole',engine,storeFor(engine,builds,{chosen:'v2'}),lab);
 cases.at(-1).expected.legacyNext=cases.at(-1).expected.next;
 cases.at(-1).expected.next='v4.build';

 const v1={widget:'dynamot-lab',version:1,next:10,electronFlow:true,devices:copy(laboratory('v1').devices).map(d=>{delete d.slot;d.x=20;d.y=30;return d;}),wires:copy(laboratory('v1').wires),tasks:{'dynamot-learning-v2':storeFor(api.create())}};
 return {origin:'original bundled DynaMot HTML before energy-view changes',originSha256:crypto.createHash('sha256').update(html).digest('hex'),cases,version1:{raw:encode(v1),expectedSlots:['M1','L1']}};
}

if(process.argv[2]==='--generate'){
 assert(process.argv[3],'pass the original bundled HTML path');
 fs.mkdirSync(path.dirname(fixturePath),{recursive:true});
 fs.writeFileSync(fixturePath,JSON.stringify(fixtureFromOriginal(process.argv[3]),null,2)+'\n');
 console.log('Created '+fixturePath);
 process.exit(0);
}

// Exercise the current source parser rather than duplicating its validation rules here.
function currentParser(){
 const source=fs.readFileSync(path.join(folder,'dynamot-labor.quelle.html'),'utf8');
 const scene=fs.readFileSync(path.join(folder,'dynamot-labor-szene.js'),'utf8');
 const slotStart=scene.indexOf('export const LAB_SLOTS=');
 const slotEnd=scene.indexOf('];',slotStart);
 assert(slotStart>=0&&slotEnd>slotStart,'current laboratory slots are present');
 const slots=vm.runInNewContext(scene.slice(slotStart+'export const LAB_SLOTS='.length,slotEnd+1));
 const begin=source.indexOf('function encode(s){');
 const end=source.indexOf('function restoreHidden()',begin);
 assert(begin>=0&&end>begin,'current save parser is present');
 const context={slots,TextEncoder,TextDecoder,btoa,atob};
 vm.runInNewContext(source.slice(begin,end)+';this.parseState=parse;this.encodeState=encode;',context);
 return context;
}
const saved=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
const parser=currentParser();
assert.match(saved.originSha256,/^[0-9a-f]{64}$/);
assert.deepEqual(saved.cases.map(c=>c.name),['empty','wrong-choice-and-draft','all-four-complete','unfinished-observation','old-order-prefix-with-hole']);
for(const item of saved.cases){
 assert(item.raw.startsWith('DYNAMOT1:'),item.name+' encoded E1');
 const original=decode(item.raw);
 const restored=copy(parser.parseState(item.raw));
 assert.equal(restored.version,2,item.name+' lab schema');
 assert.equal(restored.energyPackets,false,item.name+' default energy view');
 const {energyPackets,...withoutNewField}=restored;
 assert.deepEqual(withoutNewField,original,item.name+' all original E1 fields survive');
 const namespace=restored.tasks['dynamot-learning-v2'];
 assert.equal(namespace.version,2,item.name+' task schema');
 const engine=tasks.create({state:namespace.engine});
 assert.equal(engine.progress().points,item.expected.points,item.name+' points');
 assert.equal(engine.current()?.id||null,item.expected.next,item.name+' next legacy step');
 assert.deepEqual(engine.serialize().completed,item.expected.completed,item.name+' completed IDs');
 assert.deepEqual(engine.serialize().answers,namespace.engine.answers,item.name+' answers');
 assert.deepEqual(engine.serialize().diagrams,namespace.engine.diagrams,item.name+' diagrams');
 assert.deepEqual(engine.serialize().evidence,namespace.engine.evidence,item.name+' action evidence');
 if(item.name==='wrong-choice-and-draft'){
  assert.equal(engine.current().id,'v1.choice');
  assert.deepEqual(namespace.drafts['v1.choice'],namespace.engine.answers['v1.choice']);
  assert(namespace.builds.v1.devices.length===2);
 }
 if(item.name==='all-four-complete'){
  assert.equal(engine.progress().points,20);
  assert.equal(namespace.chosen,'summary');
  assert.equal(engine.current(),null);
 }
 if(item.name==='unfinished-observation'){
  assert.equal(namespace.engine.evidence['v2.observe'].normal,true);
  assert.equal(engine.current('v2').id,'v2.observe');
 }
 if(item.name==='old-order-prefix-with-hole'){
  assert.equal(item.expected.legacyNext,'v3.build');
  assert.equal(engine.current().id,'v4.build');
  assert.equal(engine.current('v2'),null);
 }
 const selectedNext=tasks.definitions.find(d=>d.experiment===namespace.chosen&&!item.expected.completed.includes(d.id))?.id||null;
 assert.equal(engine.current(namespace.chosen)?.id||null,selectedNext,item.name+' chosen experiment remains selectable');
 assert.equal(encode(copy(parser.parseState(parser.encodeState(restored)))),encode(restored),item.name+' current E1 round-trip');
}
const previous=decode(saved.version1.raw);
const migrated=copy(parser.parseState(saved.version1.raw));
assert.equal(migrated.version,2,'version 1 lab upgrades to version 2');
assert.deepEqual(migrated.devices.map(d=>d.slot),saved.version1.expectedSlots);
assert.equal(migrated.energyPackets,false);
assert.deepEqual(migrated.tasks,previous.tasks,'version 1 tasks survive migration');
assert.equal(tasks.create({state:migrated.tasks['dynamot-learning-v2'].engine}).progress().points,0);
assert(migrated.devices.every(d=>!Object.hasOwn(d,'x')&&!Object.hasOwn(d,'y')));
console.log('Original DYNAMOT1 fixtures: empty, wrong choice and draft, full completion, partial observation, old-order hole, and laboratory v1 migration passed.');
