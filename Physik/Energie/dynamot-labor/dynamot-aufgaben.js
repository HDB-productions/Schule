/* Read-only task engine; browser global and CommonJS. No DOM or storage writes. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DynamotTasks=factory();})(globalThis,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const palette=[
 {group:'Mechanische Energieformen',items:['kinetische Energie','Lageenergie','elastische Energie']},
 {group:'Innere Energieformen',items:['thermische Energie','chemische Energie','Kernenergie']},
 {group:'Elektromagnetische Energieformen',items:['Licht','elektrische Energie','magnetische Energie']}
];
const q=(id,text,options,answer)=>({id,text,options,answer});
const experiments=[
 {id:'v1',title:'Mit der Kurbel Licht erzeugen',image:'IMG_2155.jpeg',build:'Baue den Versuch wie auf dem Bild auf. Du brauchst einen DynaMot mit Kurbel, eine Lampe und zwei Kabel.',hints:['Setze einen DynaMot an einen freien Platz an der Tischkante.','Bringe die Kurbel an und stelle eine Lampe auf den Tisch.','Verbinde beide DynaMot-Buchsen mit den beiden Lampenbuchsen.'],action:'Drehe an der Kurbel. Kurble langsam und schneller. Beobachte die Lampe.',questions:[q('light','Wenn ich kurble, …',['leuchtet die Lampe','bleibt die Lampe aus'],'leuchtet die Lampe'),q('brightness','Je schneller ich kurble, desto … leuchtet die Lampe.',['heller','dunkler'],'heller')],chain:['kinetische Energie','DynaMot','elektrische Energie','Lampe','Licht'],summary:'Der DynaMot wandelt kinetische Energie in elektrische Energie um. Die Lampe gibt Licht und thermische Energie ab.'},
 {id:'v2',title:'Eine Kurbel treibt die andere an',image:'IMG_2157.jpeg',build:'Verbinde zwei DynaMots mit zwei Kabeln. Bringe an beiden eine Kurbel an. Nur einen DynaMot kurbelst du selbst; am zweiten bleibt „Kurbeln“ aus.',hints:['Setze zwei DynaMots an freie Plätze an der Tischkante und bringe zwei Kurbeln an.','Verbinde rot mit rot und schwarz mit schwarz.','Schalte nur beim antreibenden DynaMot „Kurbeln“ ein.'],action:'Kurble langsam und schneller. Kehre deine Drehrichtung um. Vertausche danach am zweiten DynaMot die beiden Kabel und kurble erneut. Vergleiche die Kurbeln stets mit derselben Blickrichtung: jeweils von außen auf die Kurbel und entlang der Welle zum Gerät.',questions:[q('speed','Wenn der Antrieb schneller dreht, dreht der zweite DynaMot …',['schneller','langsamer'],'schneller'),q('direction','Rot–rot und schwarz–schwarz: Bei gleicher Blickrichtung drehen beide Kurbeln …',['gleichsinnig','gegensinnig'],'gleichsinnig'),q('reverse','Wenn ich die Antriebsrichtung umkehre, …',['kehrt auch der Abtrieb seine Richtung um','bleibt die Abtriebsrichtung gleich'],'kehrt auch der Abtrieb seine Richtung um'),q('poles','Wenn ich die Kabel am zweiten DynaMot vertausche, …',['kehrt sich seine relative Drehrichtung um','ändert sich nichts'],'kehrt sich seine relative Drehrichtung um'),q('loss','Im passiven Aufbau dreht die zweite Kurbel langsamer. Ein Teil der übertragenen Energie …',['wird in thermische Energie umgewandelt','wird vernichtet'],'wird in thermische Energie umgewandelt')],chain:['kinetische Energie','DynaMot (Generator)','elektrische Energie','DynaMot (Motor)','kinetische Energie'],summary:'Der erste DynaMot arbeitet als Generator, der zweite als Motor. Reibung und elektrische Widerstände erwärmen die Geräte. Drehzahl allein ist kein allgemeines Maß für Energie.'},
 {id:'v3',title:'Mit der Kurbel ein Gewicht heben',build:'Verbinde zwei DynaMots mit zwei Kabeln. Der erste bekommt eine Kurbel, der zweite eine Seilrolle mit Gewicht. Beginne mit 0,5 kg und einem Gewicht nahe am Boden.',hints:['Nimm am zweiten DynaMot die Kurbel ab und bringe die Seilrolle an.','Verbinde rot mit rot und schwarz mit schwarz.','Kurble in die Richtung, die das Gewicht hebt. Falls es oben ist: Lass es zunächst sinken.'],action:'Kurble so, dass das Gewicht am zweiten DynaMot sichtbar steigt. Beobachte seine Höhe.',questions:[q('height','Beim Heben nimmt die … des Gewichts zu.',['Lageenergie','Kernenergie'],'Lageenergie'),q('source','Die Energie zum Heben kommt hier …',['vom Kurbeln','aus dem Nichts'],'vom Kurbeln')],chain:['kinetische Energie','DynaMot (Generator)','elektrische Energie','DynaMot (Motor)','kinetische Energie','Gewicht','Lageenergie'],summary:'Der Motor hebt das Gewicht. Dadurch nimmt dessen Lageenergie zu. Das Gewicht ist im vereinfachten Diagramm eine Station zur Speicherung von Energie.'},
 {id:'v4',title:'Ein fallendes Gewicht lässt die Lampe leuchten',build:'Verbinde einen DynaMot und eine Lampe mit zwei Kabeln. Bringe am DynaMot statt der Kurbel eine Seilrolle mit Gewicht an. Setze das Gewicht hoch.',hints:['Ersetze die Kurbel durch die Seilrolle.','Verbinde beide DynaMot-Buchsen mit den beiden Lampenbuchsen.','Vergleiche zum Beispiel 0,5 kg und 1 kg. Setze das Gewicht vor jedem Lauf wieder auf dieselbe Höhe.'],action:'Lass das Gewicht fallen und beobachte die Lampe. Wiederhole mit einem schwereren Gewicht aus derselben Starthöhe. Vergleiche bei gleicher Fallhöhe; die Verkabelung bleibt gleich.',questions:[q('fall','Beim Fallen nimmt die Lageenergie des Gewichts …',['ab','zu'],'ab'),q('mass','Das schwerere Gewicht lässt die Lampe im untersuchten Bereich bei sonst gleichen Bedingungen … leuchten.',['heller','dunkler'],'heller'),q('friction','Ein sehr kleines Gewicht kann stehen bleiben, weil …',['Reibung die Bewegung verhindert','keine Schwerkraft wirkt'],'Reibung die Bewegung verhindert')],chain:['Lageenergie','Gewicht','kinetische Energie','DynaMot','elektrische Energie','Lampe','Licht'],summary:'Beim Fallen wird Lageenergie übertragen und umgewandelt. Das Gewicht ist eine Speicherstation. Kleine Gewichte können wegen Reibung stehen bleiben; nach dem Auftreffen endet der Antrieb.'}
];
// Stable experiment IDs retain their meaning when the classroom order changes.
experiments.sort((a,b)=>['v1','v4','v2','v3'].indexOf(a.id)-['v1','v4','v2','v3'].indexOf(b.id));
const definitions=experiments.flatMap(e=>[
 {id:e.id+'.build',experiment:e.id,kind:'build',points:1,text:e.build,image:e.image||null,hints:e.hints,reference:{chain:e.chain}},
 {id:e.id+'.observe',experiment:e.id,kind:'observe',points:1,text:e.action},
 {id:e.id+'.choice',experiment:e.id,kind:'choice',points:1,text:'Ergänze die Beobachtungen.',questions:e.questions},
 {id:e.id+'.diagram',experiment:e.id,kind:'diagram',points:2,text:'Docke Energiepfeile und rechteckige Stationen zu einem Energieflussdiagramm an.',chain:e.chain,note:'Vereinfachtes Diagramm: Thermische Energie darf zusätzlich als Ausgang eingezeichnet werden. Ohne diese Nebenpfeile ist das Diagramm ebenfalls richtig; Energie verschwindet dabei nicht.'}
]);
function fromLab(s){if(s?.widget!=='dynamot-lab'||s.version!==2)throw Error('Unsupported laboratory snapshot');return copy({time:s.simulationTime,running:s.running,devices:s.devices,wires:s.wires,slots:[...['M1','M2','M3'].map(id=>({id,type:'motor'})),...['L1','L2','L3','L4'].map(id=>({id,type:'lamp'}))]});}
function checkBuild(s,experiment='v1'){
 if(!s||!Array.isArray(s.devices)||!Array.isArray(s.wires)||!Array.isArray(s.slots))return null;
 const ids=new Set(),occupied=new Set();for(const d of s.devices){if(ids.has(d.id)||occupied.has(d.slot)||!s.slots.some(p=>p.id===d.slot&&p.type===d.type))return null;ids.add(d.id);occupied.add(d.slot);}
 for(const g of s.devices.filter(d=>d.type==='motor'&&(experiment==='v4'?d.weight&&!d.crank:d.crank&&!d.weight)))for(const l of s.devices.filter(d=>d.id!==g.id&&(['v1','v4'].includes(experiment)?d.type==='lamp':d.type==='motor'&&!d.hand&&(experiment==='v2'?d.crank&&!d.weight:d.weight&&!d.crank)))){
  const ws=s.wires.filter(w=>[w.a,w.b].includes(g.id)||[w.a,w.b].includes(l.id));if(ws.length!==2)continue;
  const ps=ws.map(w=>w.a===g.id&&w.b===l.id?[w.ap,w.bp]:w.b===g.id&&w.a===l.id?[w.bp,w.ap]:null);
  if(ps.every(p=>p&&p.every(v=>v===0||v===1))&&ps[0][0]!==ps[1][0]&&ps[0][1]!==ps[1][1])return {generator:g.id,receiver:l.id,lamp:l.type==='lamp'?l.id:null,polarity:ps[0][0]===ps[0][1]?1:-1};
 }return null;
}
// Diagram arrows are graph edges. null marks a free source/output end, never a pixel position.
function checkDiagram(experiment,graph){
 const ex=experiments.find(e=>e.id===experiment);if(!ex||!graph||!Array.isArray(graph.nodes)||!Array.isArray(graph.edges))return false;
 const ns=graph.nodes,es=graph.edges,labels=ex.chain.filter((_,i)=>i%2===1),energies=ex.chain.filter((_,i)=>i%2===0);
 if(ns.some(n=>!n||typeof n!=='object')||es.some(e=>!e||typeof e!=='object'))return false;
 if(ns.length!==labels.length||new Set(ns.map(n=>n.id)).size!==ns.length||ns.some(n=>typeof n.id!=='string'||!n.id))return false;
 const ordered=labels.map(label=>ns.find(n=>n.label===label));if(ordered.some(n=>!n)||new Set(ordered.map(n=>n.id)).size!==ns.length)return false;
 const required=energies.map((energy,i)=>({from:i?ordered[i-1].id:null,to:i<ordered.length?ordered[i].id:null,energy}));
 const remaining=es.map(copy);for(const r of required){const i=remaining.findIndex(e=>e.from===r.from&&e.to===r.to&&e.energy===r.energy);if(i<0)return false;remaining.splice(i,1);}
 const thermalSources=new Set();return remaining.every(e=>e.energy==='thermische Energie'&&e.to===null&&ns.some(n=>n.id===e.from&&n.label!=='Gewicht')&&!thermalSources.has(e.from)&&!!thermalSources.add(e.from));
}
function create(options={}){
 const defs=copy(options.definitions||definitions),signature=JSON.stringify(defs);
 if(!defs.length||new Set(defs.map(d=>d.id)).size!==defs.length||defs.some(d=>!['build','observe','choice','diagram'].includes(d.kind)||!experiments.some(e=>e.id===d.experiment)))throw Error('Invalid task definitions');
 let completed=[],answers={},diagrams={},evidence={},samples=[],lastTime=null,observedStep=null,activeExperiment=null;
 if(options.state){
  const s=options.state,record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),fail=()=>{throw Error('Incompatible task state');};
  if(!record(s)||s.version!==2||!Array.isArray(s.completed)||s.completed.length>defs.length||new Set(s.completed).size!==s.completed.length||s.completed.some(id=>!defs.some(d=>d.id===id))||!record(s.answers)||!record(s.diagrams)||!record(s.evidence))fail();
  // Only a permutation of the exact same definitions is a valid migration.
  let oldDefs;try{oldDefs=JSON.parse(s.signature);}catch{fail();}
  const canonical=xs=>JSON.stringify([...xs].sort((a,b)=>a.id.localeCompare(b.id)));
  if(!Array.isArray(oldDefs)||oldDefs.some(d=>!record(d)||typeof d.id!=='string')||canonical(oldDefs)!==canonical(defs))fail();
  const predecessors=d=>defs.filter(x=>x.experiment===d.experiment).slice(0,defs.filter(x=>x.experiment===d.experiment).findIndex(x=>x.id===d.id));
  // Cross-experiment holes are expected after reordering; holes inside one experiment are corrupt.
  if(defs.some(d=>s.completed.includes(d.id)&&predecessors(d).some(x=>!s.completed.includes(x.id))))fail();
  const available=defs.filter(d=>predecessors(d).every(x=>s.completed.includes(x.id)));
  for(const [id,response]of Object.entries(s.answers)){
   const d=available.find(d=>d.id===id&&d.kind==='choice');
   if(!d||!record(response)||Object.keys(response).length!==d.questions.length||d.questions.some(q=>!q.options.includes(response[q.id])||(s.completed.includes(id)&&response[q.id]!==q.answer)))fail();
  }
  for(const [id,g]of Object.entries(s.diagrams)){const d=available.find(d=>d.id===id&&d.kind==='diagram');if(!d||!s.completed.includes(id)||!checkDiagram(d.experiment,g))fail();}
  for(const d of defs.filter(d=>s.completed.includes(d.id))){if(d.kind==='choice'&&!Object.hasOwn(s.answers,d.id)||d.kind==='diagram'&&!Object.hasOwn(s.diagrams,d.id))fail();}
  for(const [id,ev]of Object.entries(s.evidence)){
   const d=available.find(d=>d.id===id&&d.kind==='observe');if(!d||!record(ev))fail();
   const allowed={v1:['comparison'],v2:['normal','swapped','reverse','speed'],v3:['rise','lift'],v4:['startHeight','fall','falls','comparison']}[d.experiment];
   for(const [k,v]of Object.entries(ev)){
    if(!allowed.includes(k))fail();
    if(k==='falls'){
     if(!Array.isArray(v)||v.length>300)fail();
     for(const a of v){if(!record(a)||typeof a.key!=='string'||!['time','polarity','speed','sign','out','light','height','mass','startHeight'].every(k=>Number.isFinite(a[k]))||![-1,1].includes(a.polarity)||a.mass<=0||a.light<0||a.light>1)fail();}
    }else if(['rise','startHeight'].includes(k)){if(!Number.isFinite(v)||v<0)fail();}
    else if(typeof v!=='boolean')fail();
   }
  }
  for(const d of defs.filter(d=>d.kind==='observe'&&s.completed.includes(d.id))){
   const needed={v1:['comparison'],v2:['normal','swapped','reverse','speed'],v3:['lift'],v4:['fall','comparison']}[d.experiment];
   if(!s.evidence[d.id]||needed.some(k=>s.evidence[d.id][k]!==true))fail();
  }
  completed=copy(s.completed);answers=copy(s.answers);diagrams=copy(s.diagrams);evidence=copy(s.evidence);
 }
 const current=experiment=>{
  if(experiment&&activeExperiment!==experiment){samples=[];lastTime=null;observedStep=null;activeExperiment=experiment;}
  return defs.find(d=>(!experiment||d.experiment===experiment)&&!completed.includes(d.id))||null;
 };
 function finish(d){completed.push(d.id);samples=[];lastTime=null;observedStep=null;}
 function observe(s,experiment){
  const d=current(experiment);if(!d||!['build','observe'].includes(d.kind))return false;
  if(observedStep!==d.id){samples=[];lastTime=null;observedStep=d.id;}
  const p=checkBuild(s,d.experiment);
  if(d.kind==='build'){if(p){finish(d);return true;}return false;}
  if(!Number.isFinite(s?.time)||s.running!==true||!p)return false;
  if(lastTime!==null&&s.time<=lastTime)return false;lastTime=s.time;
  const g=s.devices.find(x=>x.id===p.generator),l=s.devices.find(x=>x.id===p.receiver);
  if(!Number.isFinite(g.omega)||!Number.isFinite(l.power))return false;
  const weight=d.experiment==='v4';if(!weight&&(!g.hand||Math.abs(g.omega)<1))return false;
  const a={time:s.time,key:JSON.stringify([p.generator,p.receiver,l.type==='lamp'?(l.lampR||8):null]),polarity:p.polarity,speed:Math.abs(g.omega),sign:Math.sign(g.omega),out:l.omega,light:Math.min(1,Math.max(0,l.power)/3),height:weight?g.height:l.height,mass:weight?g.mass:l.mass};
  const last=samples.length?samples[samples.length-1]:null;
  const previous=samples.filter(b=>b.key===a.key&&s.time-b.time>=.2);samples.push(a);if(samples.length>600)samples.shift();
  const ev=evidence[d.id]||(evidence[d.id]={});
  if(d.experiment==='v1'){
   if(previous.some(b=>Math.max(a.speed,b.speed)>=Math.min(a.speed,b.speed)*1.3&&Math.min(a.light,b.light)>.003&&(a.speed-b.speed)*(a.light-b.light)>0&&Math.abs(a.light-b.light)>.015))ev.comparison=true;
  }else if(d.experiment==='v2'){
   const valid=x=>Number.isFinite(x.out)&&Math.abs(x.out)>.2&&Math.sign(x.out)===x.sign*x.polarity;
   if(valid(a)){
    if(a.polarity===1)ev.normal=true;else ev.swapped=true;
    if(previous.some(b=>valid(b)&&a.polarity===b.polarity&&a.sign!==b.sign))ev.reverse=true;
    if(previous.some(b=>valid(b)&&a.polarity===b.polarity&&Math.max(a.speed,b.speed)>Math.min(a.speed,b.speed)*1.3&&(a.speed-b.speed)*(Math.abs(a.out)-Math.abs(b.out))>0))ev.speed=true;
   }
  }else if(d.experiment==='v3'){
   if(last&&last.key===a.key&&last.mass===a.mass&&Number.isFinite(a.height)&&l.omega>.05&&l.power>0){
    const rise=a.height-last.height,dt=a.time-last.time;
    if(rise>0&&rise<=Math.max(Math.abs(l.omega),Math.abs(last.out))*.02*dt*1.5+.002)ev.rise=(ev.rise||0)+rise;
    if(ev.rise>=.03)ev.lift=true;
   }
  }else{
   if(!last||last.key!==a.key||last.mass!==a.mass||a.height>last.height+.01)ev.startHeight=a.height;
   if(Number.isFinite(a.height)&&a.height>.02&&g.omega<-.1&&a.light>.003){
    // Compare at matching heights after downward motion in each mass run; resets are not falls.
    if(previous.some(b=>b.mass===a.mass&&b.height>a.height+.005)){
     ev.fall=true;const falls=ev.falls||(ev.falls=[]);a.startHeight=ev.startHeight;
     if(falls.some(b=>b.key===a.key&&b.polarity===a.polarity&&Math.abs(b.startHeight-a.startHeight)<.08&&Math.abs(b.height-a.height)<.08&&Math.max(b.mass,a.mass)>=Math.min(b.mass,a.mass)*1.3&&(a.mass-b.mass)*(a.light-b.light)>0&&Math.abs(a.light-b.light)>.01))ev.comparison=true;
     falls.push(a);if(falls.length>300)falls.shift();
    }
   }
  }
  const needed={v1:['comparison'],v2:['normal','swapped','reverse','speed'],v3:['lift'],v4:['fall','comparison']}[d.experiment];
  if(needed.every(k=>ev[k])){finish(d);return true;}return false;
 }
 function answer(value,experiment){const d=current(experiment);if(d?.kind!=='choice'||!value||typeof value!=='object')return {accepted:false,correct:false};const feedback={};let accepted=true;for(const q of d.questions){feedback[q.id]=value[q.id]===q.answer;if(!q.options.includes(value[q.id]))accepted=false;}if(!accepted)return {accepted:false,correct:false,feedback};answers[d.id]=copy(value);const correct=Object.values(feedback).every(Boolean);if(correct)finish(d);return {accepted:true,correct,feedback};}
 function submitDiagram(graph,experiment){const d=current(experiment);if(d?.kind!=='diagram')return {accepted:false,correct:false};const correct=checkDiagram(d.experiment,graph);if(correct){diagrams[d.id]=copy(graph);finish(d);}return {accepted:true,correct};}
 function progress(){return {completed:completed.length,total:defs.length,done:completed.length===defs.length,points:defs.filter(d=>completed.includes(d.id)).reduce((n,d)=>n+d.points,0),maxPoints:defs.reduce((n,d)=>n+d.points,0)};}
 function resetExperiment(id){
  const own=new Set(defs.filter(d=>d.experiment===id).map(d=>d.id));
  if(!own.size)throw RangeError('Unknown DynaMot experiment');
  completed=completed.filter(step=>!own.has(step));
  for(const records of [answers,diagrams,evidence])for(const step of own)delete records[step];
  if(activeExperiment===id){samples=[];lastTime=null;observedStep=null;activeExperiment=null;}
  return progress();
 }
 return {current:experiment=>copy(current(experiment)),observe,answer,submitDiagram,progress,resetExperiment,
  results:()=>copy({progress:progress(),experiments:experiments.map(e=>({...e,steps:defs.filter(d=>d.experiment===e.id).map(d=>({...d,completed:completed.includes(d.id),response:answers[d.id]||diagrams[d.id]||null}))}))}),
  serialize:()=>copy({version:2,signature,completed,answers,diagrams,evidence}),
  activity:experiment=>copy(evidence[current(experiment)?.id]||{})
 };
}
return {palette,experiments,definitions,fromLab,checkBuild,checkDiagram,create};
});
