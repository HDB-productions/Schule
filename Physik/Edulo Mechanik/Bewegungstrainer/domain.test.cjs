'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Motion=require('./domain.js');
const visualContext={Motion};vm.createContext(visualContext);vm.runInContext(fs.readFileSync(path.join(__dirname,'visuals.js'),'utf8'),visualContext);
function random(seed){return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}
function ready(s){s.prep.inputs=Motion.preparation(s.task).cells.map(c=>c.unit==='clock'?c.expected:String(c.expected).replace('.',',')+' '+c.unit);s.prep.cursors=s.prep.inputs.map(x=>x.length);s.prep.done=true;return s;}
function nextState(index,rand){const s=Motion.fresh();s.index=index;s.task=Motion.generate(index,rand);s.prep.inputs=Motion.preparation(s.task).cells.map(()=>'');s.prep.cursors=s.prep.inputs.map(()=>0);return s;}

test('600 situations: invariants, preparations, dimensional solutions, all types and contexts',()=>{
 const rng=random(26),types=new Set(),actors=new Set();for(let i=0;i<600;i++){
  const s=nextState(i,rng),t=s.task;types.add(t.type);actors.add(t.data.actor);
  assert(t.v>0&&t.s0>=0);assert.equal(t.answer,t.s0+t.v*t.targetT);assert(t.targetT>t.data.firstT+t.data.elapsed);assert(!/Kilometermarke|positive Richtung|feste Bezugspunkt/.test(t.context));
  assert.match(t.context,/Zeitmessung/);assert.match(t.context,/gleichbleibend|gleichmäßig/);
  assert(Motion.validate(s));ready(s);assert(Motion.checkPreparation(t,s.prep.inputs).ok);assert(Motion.validate(s));
  for(const step of Motion.requiredSteps(t)){
    const answer=Motion.canonicalAnswer(t,step);assert(Motion.check(t,step,answer).ok,answer);assert.equal(Motion.hints(t,step).length,3);
    const solvedLabel=step===0?'v = ':step===1?'s₀ = ':step===2?'s(t) = ':'Die Position ist ';
    assert(!Motion.hints(t,step).join(' ').includes(solvedLabel+answer),`full answer leaked: ${i}, ${step}`);
    s.steps[step].input=answer;s.steps[step].cursor=answer.length;assert(Motion.completeStep(s,step));assert(Motion.validate(JSON.parse(JSON.stringify(s))));
  }
 }
 assert.equal(types.size,6);assert.equal(actors.size,4);
});
test('dimensional affine expressions accept equivalence and reject wrong units or unsafe syntax',()=>{
 const t={...Motion.generate(0,()=>0),v:60,s0:8};
 for(const input of ['60km/h·t+8km','8km+t*60km/h','(30+30)km/h*t+8000m','1km/min*t+8km','s(t)=60 km/h*t+8 km','(60km*t)/h+8km','60,0km/h(t)+8km','−(-60km/h*t)+8km'])assert(Motion.check(t,2,input).ok,input);
 for(const input of ['60*t+8','60km*t+8km','60km/h*t+8','60h*t+8km','8km/h+60km/h*t','60km/h*t*t+8km','60km/h/t+8km','60km/h*t+8km/0','globalThis.alert(1)','constructor','t;process.exit()','60km/h*t+8km)','60t3+8km'])assert(!Motion.check(t,2,input).ok,input);
 assert(Motion.check({...t,s0:0},2,'60 km/h*t').ok);assert(Motion.check({...t,s0:0},2,'60 km/h*t+0 km').ok);
 assert(!Motion.check({...t,v:36},0,'10 m/s').ok);assert(!Motion.check(t,0,'60 km').ok);assert(!Motion.check(t,1,'8').ok);
});
test('preparation keeps position separate from additional distance and clocks separate from durations',()=>{
 const distance=Motion.generate(0,()=>0.3),cells=Motion.preparation(distance).cells;
 assert.equal(cells[0].expected,distance.s0);assert.equal(cells[2].expected,distance.v*distance.data.elapsed);assert.notEqual(cells[2].expected,distance.s0+distance.v*distance.data.elapsed);
 const s=ready(nextState(2,()=>0.3));assert.equal(Motion.preparation(s.task).cells[1].unit,'clock');assert(Motion.checkPreparation(s.task,s.prep.inputs).ok);s.prep.inputs[1]='25:90';assert(!Motion.checkPreparation(s.task,s.prep.inputs).ok);
 const pair=Motion.preparation(Motion.generate(1,()=>0.3));assert.equal(pair.layout,'pairs');assert.deepEqual(pair.cells.map(c=>c.unit),['min','min','km','km']);
});
test('reveal inserts a dimensional solution once, gives no point, permits following yellow work',()=>{
 const s=ready(Motion.fresh());assert(!Motion.completeStep(s,1));s.steps[0].hint=3;s.steps[0].errors=4;assert(Motion.revealStep(s,0));assert.equal(s.total,0);assert.equal(s.steps[0].solved,false);assert.equal(s.steps[0].input,Motion.canonicalAnswer(s.task,0));assert.equal(s.steps[0].earned,null);assert(!Motion.completeStep(s,0));assert(!Motion.revealStep(s,0));
 for(const i of Motion.requiredSteps(s.task).filter(i=>i>0)){s.steps[i].input=Motion.canonicalAnswer(s.task,i);s.steps[i].cursor=s.steps[i].input.length;assert(Motion.completeStep(s,i));assert.equal(s.steps[i].earned,'yellow');}
 assert.equal(s.total,2);assert.equal(s.independent,0);assert(Motion.validate(s));assert(Motion.nextSituation(s));assert.equal(s.index,1);assert(!s.prep.done);assert.equal(s.total,2);
});
test('points stay monotonic over more than 25 situations, assisted points later upgrade',()=>{
 const s=Motion.fresh(),rank={gray:0,yellow:1,green:2};let old=Motion.scoreColors(s);
 for(let task=0;task<30;task++){ready(s);for(const i of Motion.requiredSteps(s.task)){
   s.steps[i].hint=task<4?1:0;s.steps[i].input=Motion.canonicalAnswer(s.task,i);s.steps[i].cursor=s.steps[i].input.length;assert(Motion.completeStep(s,i));
   const now=Motion.scoreColors(s);now.forEach((c,j)=>assert(rank[c]>=rank[old[j]]));old=now;assert(Motion.validate(s));
 }assert(Motion.nextSituation(s));}
 assert.equal(s.index,30);assert.equal(s.total,20);assert.equal(s.independent,20);assert.deepEqual(old,Array(20).fill('green'));
});
test('preparation help counts as assistance; an entirely revealed situation gives zero points',()=>{
 const helped=ready(Motion.fresh());helped.prep.hint=1;helped.steps[0].input=Motion.canonicalAnswer(helped.task,0);helped.steps[0].cursor=helped.steps[0].input.length;assert(Motion.completeStep(helped,0));assert.equal(helped.steps[0].earned,'yellow');assert.equal(helped.independent,0);assert(Motion.validate(helped));
 const s=ready(Motion.fresh());s.prep.revealed=true;s.prep.hint=3;
 for(const i of Motion.requiredSteps(s.task)){s.steps[i].hint=3;assert(Motion.revealStep(s,i));assert(Motion.validate(s));}
 assert.equal(s.total,0);assert.equal(s.independent,0);assert(Motion.nextSituation(s));assert(Motion.validate(s));
});
test('all 24 templates exactly reproduce generated prose when placeholders are populated',()=>{
 const templates=Motion.textTemplates();assert.equal(templates.length,24);assert.equal(new Set(templates.map(t=>t.text)).size,24);
 const f=n=>String(n).replace('.',','),clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
 for(let i=0;i<6;i++)for(let a=0;a<4;a++){
  const task=Motion.generate(i,()=>a/4+.02),d=task.data;
  const values={'[Anfangsabstand]':f(d.s0),'[Geschwindigkeit]':f(d.v),'[Dauer]':f(d.elapsed*60),'[weitere Strecke]':f(d.v*d.elapsed),'[erste Zeit]':f(d.firstT*60),'[zweite Zeit]':f((d.firstT+d.elapsed)*60),'[erster Abstand]':f(d.s0+d.v*d.firstT),'[zweiter Abstand]':f(d.s0+d.v*(d.firstT+d.elapsed)),'[erste Uhrzeit]':clock(d.clockStart),'[zweite Uhrzeit]':clock(d.clockStart+d.elapsed*60)};
  let text=templates[i*4+a].text;for(const [from,to]of Object.entries(values))text=text.replaceAll(from,to);assert.equal(text,task.context);
 }
});
test('all 90 visual stages are defined and the formula visual never assembles the task solution',()=>{
 for(let type=0;type<6;type++){const t=Motion.generate(type,()=>0.3);for(let step=-1;step<4;step++)for(let level=1;level<=3;level++){
  const d=visualContext.teachingVisual(t,step,level);assert(d.title&&d.note);assert(['cards','changes','journey','formula'].includes(d.kind));
  if(step===2){const raw=JSON.stringify(d);assert(!raw.includes(Motion.canonicalAnswer(t,2)));if(level===3){assert(raw.includes(t.v+' km/h'));assert(raw.includes(t.s0+' km'));}}
 }}
});
test('legacy migration preserves the real old-format fixture, points, draft, hint and cursor',()=>{
 const old=JSON.parse(fs.readFileSync(path.join(__dirname,'legacy.fixture.json'),'utf8')),before=JSON.stringify(old);assert(Motion.validate(old));const s=Motion.upgrade(old);assert.equal(JSON.stringify(old),before);assert(Motion.validate(s));assert.equal(s.schema,3);assert.equal(s.total,old.total);assert.equal(s.independent,old.independent);assert(s.prep.done);assert.equal(s.steps[2].input,old.steps[2].input);assert.equal(s.steps[2].cursor,old.steps[2].cursor);assert.equal(s.steps[2].hint,old.steps[2].hint);
 const edited=JSON.parse(JSON.stringify(s));edited.task.context='Eine frühere Textfassung.';edited.task.title='Alter Titel';assert(Motion.validate(edited));const updated=Motion.upgrade(edited);assert.equal(updated.task.context,s.task.context);assert.equal(updated.steps[2].input,s.steps[2].input);
});
test('corrupt state and contradictory outcomes rejected; bounded roundtrip',()=>{
 const base=Motion.fresh();assert(Motion.validate(base));for(const edit of [s=>s.task.v++,s=>s.total=1,s=>s.independent=22,s=>s.prep.cursors[0]=400,s=>s.prep.inputs=[],s=>s.prep.revealed=true,s=>s.steps[0].solved=true,s=>s.steps[0].earned='green',s=>s.steps[0].hint=4,s=>s.steps[0].input='x'.repeat(201),s=>s.index=-1]){const s=JSON.parse(JSON.stringify(base));edit(s);assert(!Motion.validate(s));}
 assert(JSON.stringify(base).length<6000);assert(!Motion.validate(null));
});
