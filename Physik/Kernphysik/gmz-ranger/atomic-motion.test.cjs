'use strict';
const assert=require('node:assert/strict'),A=require('./atomic-motion.js');
const config={collisionAt:79,electronAt:90.96,ionAt:95.22,avalancheAt:103.66,pulseAt:122.19,readyAt:188.4,seed:7391};
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const before=A.evaluate(config.collisionAt-1e-6,config),contact=A.evaluate(config.collisionAt,config);
assert.equal(before.atoms[0].visible,true);assert.equal(before.electrons[0].visible,false);assert.equal(before.ions[0].visible,false);
assert.equal(contact.atoms[0].visible,false);assert.equal(contact.electrons[0].visible,true);assert.equal(contact.ions[0].visible,true);
for(const p of [contact.radiation.position,contact.electrons[0].position,contact.ions[0].position])assert.ok(distance(p,contact.primary.position)<1e-10,'Primary collision products/radiation must coincide');
assert.ok(distance(before.atoms[0].position,contact.primary.position)<1e-5,'Primary target must reach collision continuously');
assert.notDeepEqual(A.evaluate(70,config).atoms.map(a=>a.position),A.evaluate(70.8,config).atoms.map(a=>a.position),'Gas must move');
assert.deepEqual(A.evaluate(70,config),A.evaluate(70,config),'Same seed/time must reproduce gas and events');
for(const event of contact.events.slice(1)){
  const prior=A.evaluate(event.time-1e-6,config),at=A.evaluate(event.time,config);
  assert.equal(prior.electrons[event.index].visible,false,'Secondary electron cannot pre-exist its contact');
  assert.equal(prior.atoms[event.atomIndex].visible,true,'Neutral target cannot vanish before contact');
  assert.equal(at.atoms[event.atomIndex].visible,false);assert.equal(at.electrons[event.index].visible,true);
  for(const p of [at.electrons[event.parentElectron].position,at.electrons[event.index].position,at.ions[event.index].position,event.projectileAtContact,A.atomPosition(event.atomIndex,event.time,A.normalize(config))])assert.ok(distance(p,event.position)<1e-9,'Secondary parent/atom/products must share actual contact');
}
for(const time of [0,50,79,91,104,109,120,188])for(const atom of A.evaluate(time,config).atoms){assert.ok(Math.hypot(atom.position[0],atom.position[1])<=21.2+1e-10);assert.ok(Math.abs(atom.position[2])<=5.4+1e-10);}
const released=A.evaluate(config.collisionAt+.25,config),halfRelease=A.evaluate(config.collisionAt+.125,config),frozen=A.evaluate(config.electronAt-.001,config);
assert.ok(Math.abs(distance(released.electrons[0].position,contact.primary.position)-2)<1e-10,'Release displacement must be two illustrative mm');assert.ok(Math.abs(distance(halfRelease.electrons[0].position,contact.primary.position)-1)<1e-10);
assert.deepEqual(frozen.electrons[0].position,released.electrons[0].position,'Electron must hold after release until spoken drift');
assert.deepEqual(A.evaluate(config.electronAt,config).electrons[0].position,released.electrons[0].position,'Drift must begin without a jump');
const departing=A.evaluate(config.electronAt+.5,config);assert.ok(distance(departing.electrons[0].position,released.electrons[0].position)>0);assert.deepEqual(departing.ions[0].position,contact.primary.position,'Ion remains until its own departure');
const late=A.evaluate(120,config);A.evaluate(80,config);assert.deepEqual(late,A.evaluate(120,config),'Backward seek must not mutate simulation');
const suppressed=A.evaluate(config.pulseAt,config),recovered=A.evaluate(config.readyAt,config);
assert.ok(suppressed.fieldStrength>0&&suppressed.fieldStrength<1);assert.equal(suppressed.measurementReady,false);assert.equal(suppressed.avalanchePermitted,false);
assert.equal(recovered.measurementReady,true);assert.equal(recovered.recovered,true);assert.ok(recovered.fieldStrength>suppressed.fieldStrength&&recovered.fieldStrength<1);
assert.ok(recovered.ions.some(e=>e.visible),'Measurement readiness must not require complete ion collection');assert.ok(recovered.ions.some(e=>!e.visible),'Ions must have individual arrival times');
for(const ion of recovered.ions)assert.equal(recovered.atoms[ion.index].visible,!ion.visible,'Each atom returns only after its own ion neutralization');
assert.ok(recovered.electrons.every(e=>!e.visible));assert.equal(recovered.neutralization.allNeutralized,false);
const fullyNeutral=A.evaluate(recovered.neutralization.lastArrivalAt+.01,config);assert.ok(fullyNeutral.atoms.every(a=>a.visible));assert.ok(fullyNeutral.ions.every(e=>!e.visible));assert.equal(fullyNeutral.neutralization.allNeutralized,true);assert.equal(fullyNeutral.measurementReady,true);
assert.deepEqual(A.evaluate(config.readyAt,config),recovered,'Readiness with remaining ions must be seek-deterministic');
// Actual recorded film cues, including the long pause before narrated drift.
// Sampling every visible electron catches the old recoil and zigzag targets,
// even if all collision positions happen to agree at the scheduled instants.
const film={collisionAt:80.795,electronAt:92.414,ionAt:96.674,avalancheAt:105.114,pulseAt:118.25,readyAt:212.742};
const wireDistance=p=>Math.hypot(Math.hypot(p[0],p[1])-13.8,p[2]-.2);
const dot=(a,b)=>a.reduce((sum,v,k)=>sum+v*b[k],0),minus=(a,b)=>a.map((v,k)=>v-b[k]);
let pathSamples=0,maxWireIncrease=0,maxContactError=0,neutralizationContacts=0,maxNeutralizationError=0,wallReflections=0,faceReflections=0;
const seeds=[-3,0,1,17,99,7391,2147483647];
for(const seed of seeds){
  const c={...film,seed},initial=A.evaluate(c.collisionAt,c);
  assert.equal(initial.atoms.length,52);assert.equal(initial.events.length,16);
  for(const event of initial.events){
    const at=A.evaluate(event.time,c),prior=A.evaluate(event.time-1e-6,c);
    assert.equal(prior.atoms[event.atomIndex].visible,true);
    assert.equal(at.atoms[event.atomIndex].visible,false);
    const positions=[at.atoms[event.atomIndex].position,at.electrons[event.index].position,at.ions[event.index].position,event.projectileAtContact,A.atomPosition(event.atomIndex,event.time,c)];
    if(event.parentElectron!==null)positions.push(at.electrons[event.parentElectron].position);
    else positions.push(at.radiation.position);
    for(const position of positions){const error=distance(position,event.position);maxContactError=Math.max(maxContactError,error);assert.ok(error<1e-9,'Every moving target, real projectile and pair must meet');}
    assert.ok(distance(prior.atoms[event.atomIndex].position,event.position)<1e-5,'A target must drift continuously into contact');
    assert.ok(distance(A.atomPosition(event.atomIndex,event.time-.2,c),event.position)>1e-6,'Collision targets remain moving gas atoms');
    assert.ok(Math.abs(wireDistance(event.anodeTarget))<1e-10,'Every electron terminates on the ring wire');
    if(event.parentElectron!==null){const parent=initial.events[event.parentElectron];assert.ok(event.time>parent.time);assert.ok(wireDistance(event.position)<wireDistance(parent.position),'A new branch is born farther forward toward the wire');}
  }
  const samples=new Set(Object.values(film));
  for(let t=c.collisionAt;t<c.pulseAt;t+=.075)samples.add(t);
  for(const event of initial.events)for(const dt of [-1e-6,0,1e-6])samples.add(event.time+dt);
  for(const dt of [0,.125,.25,.251])samples.add(c.collisionAt+dt);
  const previous=[];
  for(const time of [...samples].sort((a,b)=>a-b)){
    const state=A.evaluate(time,c);
    for(const electron of state.electrons){
      if(!electron.visible)continue;
      const event=initial.events[electron.index],direction=minus(event.anodeTarget,event.position),offset=minus(electron.position,event.position),lengthSquared=dot(direction,direction),progress=dot(offset,direction)/lengthSquared;
      assert.ok(progress>=-1e-10&&progress<=1+1e-10,'Electron stays on the forward segment');
      assert.ok(distance(electron.position,event.position.map((v,k)=>v+direction[k]*progress))<1e-9,'Each electron follows one straight path with no lateral jumps');
      const prior=previous[electron.index];
      if(prior){
        const increase=wireDistance(electron.position)-wireDistance(prior);maxWireIncrease=Math.max(maxWireIncrease,increase);
        assert.ok(increase<1e-10,'Every visible electron must approach the actual ring wire monotonically');
        assert.ok(dot(minus(electron.position,prior),direction)>=-1e-10,'No electron may reverse along its path');
      }
      previous[electron.index]=electron.position;pathSamples++;
    }
  }
  const ready=A.evaluate(c.readyAt,c);assert.equal(ready.measurementReady,true);assert.ok(ready.neutralization.remainingIons>0);assert.equal(A.evaluate(c.pulseAt,c).measurementReady,false);
  for(const ion of ready.ions){
    const arrival=ion.neutralizedAt,prior=A.evaluate(arrival-1e-6,c),at=A.evaluate(arrival,c),after=A.evaluate(arrival+1e-6,c),index=ion.index;
    assert.equal(prior.ions[index].visible,true);assert.equal(prior.atoms[index].visible,false);
    assert.equal(at.ions[index].visible,false);assert.equal(at.atoms[index].visible,true);
    assert.equal(after.ions[index].visible,false);assert.equal(after.atoms[index].visible,true);
    const endpoint=[initial.events[index].position[0],initial.events[index].position[1],5.4],error=distance(at.atoms[index].position,endpoint);
    maxNeutralizationError=Math.max(maxNeutralizationError,error);assert.ok(error<1e-10,'Reappearing neutral atom begins exactly where its ion reaches the cathode');
    assert.ok(distance(prior.ions[index].position,endpoint)<1e-5,'Ion approaches its neutralization point continuously');
    assert.ok(distance(after.atoms[index].position,endpoint)<1e-5,'Neutral atom leaves the same point continuously');
    assert.ok(after.atoms[index].position[2]<5.4,'Neutralized atom flies back inward from the cathode');
    const later=A.evaluate(arrival+1,c);assert.ok(distance(later.atoms[index].position,endpoint)>.2,'Neutral atom continues flying after neutralization');
    assert.deepEqual(later.atoms[index].position,A.atomPosition(index,arrival+1,c),'Public atom position and visible model share the post-neutralization trajectory');
    A.evaluate(arrival-3,c);assert.deepEqual(A.evaluate(arrival+1,c),later,'Neutralization flight is deterministic after backward seeks');
    neutralizationContacts++;
  }
  for(const time of [0,20,50,80,120,200,300,500])for(const atom of A.evaluate(time,c).atoms){
    assert.ok(Math.hypot(atom.position[0],atom.position[1])<=21.2+1e-10,'Ballistic atoms stay inside the cylindrical wall');
    assert.ok(atom.position[2]>=-5.4-1e-10&&atom.position[2]<=5.4+1e-10,'Ballistic atoms stay between gas faces, including the neutralization face');
  }
  for(let index=16;index<52;index++){
    const start=A.atomPosition(index,0,c),step=A.atomPosition(index,.001,c),velocity=minus(step,start).map(v=>v/.001),a=velocity[0]**2+velocity[1]**2,b=start[0]*velocity[0]+start[1]*velocity[1];
    const wall=(-b+Math.sqrt(b*b-a*(start[0]**2+start[1]**2-21.2**2)))/a;
    const face=((velocity[2]>0?5.4:-5.4)-start[2])/velocity[2],hitTime=Math.min(wall,face),epsilon=1e-5;
    const prior=A.atomPosition(index,hitTime-epsilon,c),at=A.atomPosition(index,hitTime,c),after=A.atomPosition(index,hitTime+epsilon,c);
    assert.ok(distance(prior,at)<1e-4&&distance(after,at)<1e-4,'Wall reflections never teleport a gas atom');
    const outgoing=minus(A.atomPosition(index,hitTime+2*epsilon,c),after).map(v=>v/epsilon),expected=velocity.slice();
    if(wall<face){const radius=Math.hypot(at[0],at[1]),normal=[at[0]/radius,at[1]/radius,0],projection=dot(expected,normal);for(let k=0;k<3;k++)expected[k]-=2*projection*normal[k];assert.ok(Math.abs(radius-21.2)<1e-8);wallReflections++;}
    else{expected[2]*=-1;assert.ok(Math.abs(Math.abs(at[2])-5.4)<1e-8);faceReflections++;}
    assert.ok(distance(outgoing,expected)<1e-5,`Gas reflects specularly while preserving speed: ${JSON.stringify({seed,index,wall,face,at,outgoing,expected,error:distance(outgoing,expected)})}`);
  }
}
// Away from a wall, gas motion has constant velocity rather than an orbit
// about a fixed origin. The chosen short intervals contain no reflections.
for(let index=16;index<52;index++){
  const p=A.atomPosition(index,.1,film),q=A.atomPosition(index,.11,film),r=A.atomPosition(index,.12,film);
  assert.ok(distance(minus(q,p),minus(r,q))<1e-10,'Neutral gas uses straight constant-velocity free flight');
}
const entryConfig={...film,radiationStart:film.collisionAt-4.2,windowAt:film.collisionAt-2.4};
const entry=A.evaluate(entryConfig.windowAt,entryConfig).radiation;
assert.equal(entry.windowCrossingAt,entryConfig.windowAt);assert.ok(distance(entry.position,entry.windowPosition)<1e-10);assert.ok(Math.abs(entry.position[2]+7.9)<1e-10);assert.equal(entry.enteredWindow,true);
for(const dt of [-1e-7,1e-7])assert.ok(distance(A.evaluate(entryConfig.windowAt+dt,entryConfig).radiation.position,entry.windowPosition)<1e-5,'Window crossing is continuous on both sides');
assert.equal(A.evaluate(entryConfig.radiationStart-1e-6,entryConfig).radiation.visible,false);
assert.equal(A.evaluate(entryConfig.radiationStart,entryConfig).radiation.visible,true);
assert.ok(distance(A.evaluate(film.collisionAt,entryConfig).radiation.position,A.evaluate(film.collisionAt,entryConfig).primary.position)<1e-10);
const linear=A.evaluate(film.collisionAt-1,film),linearWindow=A.evaluate(linear.radiation.windowCrossingAt,film);
assert.ok(Math.abs(linearWindow.radiation.position[2]+7.9)<1e-10,'Legacy configs retain their linear crossing time');
assert.ok(distance(linear.radiation.position,linear.radiation.start.map((v,k)=>(v+linear.radiation.contact[k])/2))<1e-10,'Legacy incoming motion remains linear');
console.log(JSON.stringify({passed:true,atoms:52,primaryContacts:1,secondaryContacts:15,ionsStillVisibleWhenReady:recovered.neutralization.remainingIons,directedPaths:{seeds:seeds.length,pathSamples,maxWireIncrease,maxContactError},neutralization:{contacts:neutralizationContacts,maxPositionError:maxNeutralizationError},gasReflections:{wall:wallReflections,face:faceReflections},windowCrossingAt:entry.windowCrossingAt,checks:['ballistic bounded gas with wall reflections','seed/time deterministic','primary contact coincidence','secondary parent-target-product coincidence','no pre-contact products','independent departure','backward seek','nonzero weaker field','readiness before complete neutralization','individual ion arrivals','continuous neutralization and neutral flight','monotone wire distance at real film times','straight forward branches','continuous explicit and legacy window crossing']}));
