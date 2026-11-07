const test=require('node:test'),assert=require('node:assert/strict'),S=require('./movie-staging.js');
const route=S.movieRoute(()=>[0,30,-6.9]);

test('new electronics recording holds the rigid closeup for the complete spoken passage',()=>{
  const T=require('./movie-timing.js'),timeline=T.validate(require('./video-timeline.json'));
  const section=timeline.timeMap.find(s=>s.id==='zaehlelektronik');
  assert.ok(section,'fifth recording is present');
  assert.ok(Math.abs(section.end-section.start-16.405)<1e-8);
  const endOfSpeech=section.start+16.9-.8;
  for(let t=section.start;t<=endOfSpeech;t+=1/24){
    const pose=S.sample(route,T.sceneTime(t,timeline));
    assert.equal(pose.explosion,1);
    assert.ok(Math.abs(pose.yaw-2.85)<1e-12);
    if(t>=section.start+4.36-.8)assert.equal(pose.distance,155);
  }
  assert.ok(T.sceneTime(endOfSpeech,timeline)<=56.2+1e-8);
});

test('counting electronics remain rigidly open until the explanation and pullback finish',()=>{
  for(let t=49.48;t<=58.2;t+=.01){const pose=S.sample(route,t);assert.equal(pose.explosion,1);assert.ok(Math.abs(pose.yaw-2.85)<1e-12);}
  assert.ok(S.sample(route,59).explosion<1,'reassembly follows the explanatory closeup');
  assert.equal(S.sample(route,60.2).explosion,0);
});
test('camera and reveal remain continuous across every caption and route boundary',()=>{
  const captionTimes=require('./video-timeline.json').beats.map(b=>b.start);
  for(const t of [...captionTimes,...route.map(r=>r.time)]){
    const a=S.sample(route,t-1e-6),b=S.sample(route,t+1e-6);
    for(const key of ['distance','pitch','explosion','microscopic'])assert.ok(Math.abs(a[key]-b[key])<.0002,`${key} jumps at ${t}`);
    assert.ok(Math.abs(Math.atan2(Math.sin(a.yaw-b.yaw),Math.cos(a.yaw-b.yaw)))<.0002);
    assert.ok(Math.hypot(...a.target.map((v,i)=>v-b.target[i]))<.0002);
  }
});
test('operation stays assembled; atom view only follows reassembly and an extreme zoom',()=>{
  for(let t=60.2;t<207.142;t+=.05)assert.equal(S.sample(route,t).explosion,0);
  for(let t=0;t<=60.2;t+=.05)assert.equal(S.sample(route,t).microscopic,0);
  assert.ok(S.sample(route,65.4).distance>60,'window remains in view before the recorded entrance');
  const A=require('./atomic-motion.js'),clock={collisionAt:80.795,electronAt:92.414,ionAt:96.674,avalancheAt:105.114,pulseAt:118.25,readyAt:212.742,windowAt:78.395,radiationStart:76.595};
  for(const t of [80.795,85,95,107,116]){const state=A.evaluate(t,clock),view=S.followElectron(S.sample(route,90),{...clock,time:t},state);assert.ok(view.distance<=12.1);assert.equal(view.microscopic,1);}
  let previous;
  for(let t=76.59;t<123;t+=.005){const view=S.followElectron(S.sample(route,90),{...clock,time:t},A.evaluate(t,clock));if(previous){assert.ok(Math.abs(view.distance-previous.distance)<.4);assert.ok(Math.hypot(...view.target.map((v,i)=>v-previous.target[i]))<.1);}previous=view;}
  assert.equal(S.sample(route,207.142).microscopic,0);
});
test('seeking backwards reproduces a pose; camera rotation follows the short path',()=>{
  const a=S.sample(route,61);S.sample(route,190);assert.deepEqual(S.sample(route,61),a);
  const view={yaw:3.1,pitch:0,distance:100,target:[0,0,0]};
  assert.ok(Math.abs(S.interpolate(view,{...view,yaw:-3.1},.5).yaw-Math.PI)<1e-9);
});
test('electron camera reaches the actual wire continuously and holds there before pulling back',()=>{
  const A=require('./atomic-motion.js'),clock={collisionAt:80.795,electronAt:92.414,ionAt:96.674,avalancheAt:105.114,pulseAt:118.25,readyAt:212.742,windowAt:78.395,radiationStart:76.595};
  const base=S.sample(route,90),origin=[4,17,-9],distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
  const pose=time=>{const state=A.evaluate(time,clock);state.sensorOrigin=origin;return S.followElectron(base,{...clock,time},state);};
  const endpoint=A.evaluate(clock.pulseAt,clock).electrons[0].anodeTarget.map((v,i)=>v+origin[i]);
  // A fixed 0.65-mm normalized look-ahead overshot the endpoint until pulseAt
  // and then disappeared in one frame. The view now settles on the wire as
  // soon as the electron is closer than the nominal look-ahead distance.
  for(const time of [clock.pulseAt-.1,clock.pulseAt-1e-6,clock.pulseAt,clock.pulseAt+1e-6,clock.pulseAt+.399])assert.ok(distance(pose(time).target,endpoint)<1e-9,`Camera must hold its real wire endpoint at ${time}`);
  for(const boundary of [clock.windowAt,clock.windowAt+2,clock.collisionAt+.15,clock.collisionAt+1.25,clock.pulseAt,clock.pulseAt+.4,clock.pulseAt+4.4]){
    const before=pose(boundary-1e-6),after=pose(boundary+1e-6);
    assert.ok(distance(before.target,after.target)<1e-4,`Camera target must be continuous at ${boundary}`);
    assert.ok(Math.abs(before.distance-after.distance)<1e-4,`Camera zoom must be continuous at ${boundary}`);
  }
  assert.deepEqual(pose(clock.pulseAt+4.4),base,'After the smooth pullback the route resumes exactly');
});
