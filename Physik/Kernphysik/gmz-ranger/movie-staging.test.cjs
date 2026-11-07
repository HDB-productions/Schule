const test=require('node:test'),assert=require('node:assert/strict'),S=require('./movie-staging.js');
const route=S.movieRoute(()=>[0,30,-6.9]);
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
  assert.ok(S.sample(route,60.2).distance/S.sample(route,65.4).distance>5);
  assert.equal(S.sample(route,65.4).microscopic,1);
  assert.equal(S.sample(route,207.142).microscopic,0);
});
test('seeking backwards reproduces a pose; camera rotation follows the short path',()=>{
  const a=S.sample(route,61);S.sample(route,190);assert.deepEqual(S.sample(route,61),a);
  const view={yaw:3.1,pitch:0,distance:100,target:[0,0,0]};
  assert.ok(Math.abs(S.interpolate(view,{...view,yaw:-3.1},.5).yaw-Math.PI)<1e-9);
});
