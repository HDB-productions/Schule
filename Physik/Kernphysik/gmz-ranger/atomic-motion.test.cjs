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
for(const time of [0,50,79,91,104,109,120,188])for(const atom of A.evaluate(time,config).atoms){assert.ok(Math.hypot(atom.position[0],atom.position[1])<=21.2+1e-10);assert.ok(Math.abs(atom.position[2])<=3.5);}
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
console.log(JSON.stringify({passed:true,atoms:52,primaryContacts:1,secondaryContacts:15,ionsStillVisibleWhenReady:recovered.neutralization.remainingIons,checks:['moving bounded gas','seed/time deterministic','primary contact coincidence','secondary parent-target-product coincidence','no pre-contact products','independent departure','backward seek','nonzero weaker field','readiness before complete neutralization','individual ion arrivals']}));
