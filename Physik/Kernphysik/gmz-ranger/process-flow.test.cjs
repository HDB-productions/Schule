const test=require('node:test'),assert=require('node:assert/strict'),P=require('./process-flow.js'),A=require('./atomic-motion.js');
test('five contiguous phases split the entry before the real gas contact',()=>{
 assert.deepEqual(P.phases.map(p=>p.id),['incoming','ionization','drift','avalanche','deadtime']);
 P.phases.slice(1).forEach((p,i)=>assert.equal(p.start,P.phases[i].end));
 const entry=A.evaluate(P.phases[0].end,P.clock);assert.ok(entry.radiation.enteredWindow);assert.equal(entry.primary.occurred,false);
 assert.ok(P.phases[1].start<P.clock.collisionAt);assert.ok(P.phases[1].end>P.clock.collisionAt);
 assert.equal(P.pose(P.phases[0].end,entry).windowVisibility,1);
 assert.equal(P.pose(P.clock.collisionAt-.1,A.evaluate(P.clock.collisionAt-.1,P.clock)).windowVisibility,0);
});
test('phase clocks stop exactly at the boundary including all ambient gas',()=>{
 P.phases.forEach((p,i)=>{
  const end=P.frame(i,p.seconds);assert.equal(end.time,p.end);assert.equal(end.finished,true);
  assert.deepEqual(P.frame(i,p.seconds+100),end);
  assert.deepEqual(A.evaluate(end.time,P.clock),A.evaluate(P.frame(i,p.seconds+100).time,P.clock));
 });
});
test('camera and window stay continuous at phase boundaries and zoom knots',()=>{
 for(const t of [1.8,2.65,4,5.2,10,15,16.3,23]){
  const pose=x=>P.pose(x,A.evaluate(x,P.clock)),a=pose(t-1e-6),b=pose(t+1e-6);
  for(const key of ['distance','yaw','microscopic','windowVisibility','fieldVisibility'])assert.ok(Math.abs(a[key]-b[key])<.001,key+' at '+t);
  assert.ok(Math.hypot(...a.target.map((v,i)=>v-b.target[i]))<.001);
 }
});
