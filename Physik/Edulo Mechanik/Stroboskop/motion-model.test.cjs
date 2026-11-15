const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motion-model.js');
const close = (actual, expected, tolerance=1e-8) => assert(Math.abs(actual-expected)<=tolerance, `${actual} ≠ ${expected}`);

test('fixed exposure times include endpoints and ball rate is 25 Hz', () => {
  for (const kind of ['ball','uniform','accelerated']) {
    const c = M.config(kind), s = M.samples(kind);
    close(s[0].t,0);close(s.at(-1).t,c.duration);
    assert.equal(s.length,Math.round(c.duration/c.dt)+1);
    for(let i=1;i<s.length;i++) close(s[i].t-s[i-1].t,c.dt);
  }
  assert.equal(1/M.config('ball').dt,25);
  assert.equal(M.config('ball').duration,1.44);assert.equal(M.samples('ball').length,37);
});

test('ball has constant horizontal speed and two exact parabolas', () => {
  const s=M.samples('ball');
  for(let i=1;i<s.length;i++) {close(s[i].x-s[i-1].x,18);assert.equal(s[i].vx,450);}
  for(const [start,end] of [[0,20],[20,36]]) for(let i=start+1;i<end;i++) close(s[i+1].y-2*s[i].y+s[i-1].y,4500*0.04**2);
  for(const t of [0,0.8,1.44])close(M.sample('ball',t).y,620);
  for(const [t,y] of [[0.4,260],[1.12,389.6]]) {const apex=M.sample('ball',t);close(apex.y,y);close(apex.vy,0);close(Math.hypot(apex.vx,apex.vy),450);assert(Math.hypot(M.sample('ball',t-0.04).vx,M.sample('ball',t-0.04).vy)>450);assert(Math.hypot(M.sample('ball',t+0.04).vx,M.sample('ball',t+0.04).vy)>450);}
  close((620-M.sample('ball',1.12).y)/(620-M.sample('ball',0.4).y),0.64);
  close(M.sample('ball',1.44).rotation,5.76);close(M.sample('ball',1.44).x,788);
});

test('inelastic contact reduces vertical speed and energy while horizontal speed remains constant', () => {
  const epsilon=1e-7, before=M.sample('ball',0.8-epsilon), after=M.sample('ball',0.8+epsilon), at=M.sample('ball',0.8);
  assert.equal(M.config('ball').restitution,0.8);assert.equal(M.config('ball').impactTime,0.8);
  close(before.vy,1800-4500*epsilon);close(after.vy,-1440+4500*epsilon);
  assert.equal(at.vy,-1440);assert.equal(M.sample('ball',0).vy,-1800);
  close(before.vy+4500*epsilon,1800);close(after.vy-4500*epsilon,-1440);
  close((-at.vy/1800),0.8);close(at.vy**2/1800**2,0.64);
  assert.equal(before.vx,450);assert.equal(after.vx,450);
  assert(Math.hypot(after.vx,after.vy)<Math.hypot(before.vx,before.vy));
  close(Math.hypot(at.vx,at.vy),Math.hypot(450,1440));
  // End convention: final image is the incoming second landing, not a third launch.
  assert.equal(M.sample('ball',1.44).vy,1440);
  assert(M.sample('ball',1.44-1e-7).vy>0);
});

test('blur is the signed backward velocity vector on ascent, descent, and contact', () => {
  for(const t of [0.12,0.4,0.68,0.8,1.08]) {
    const v=M.sample('ball',t), b=M.blurVector('ball',t);
    close(b.dx,-v.vx*0.005);close(b.dy,-v.vy*0.005);
  }
  assert(M.blurVector('ball',0.12).dy>0);assert(M.blurVector('ball',0.68).dy<0);
  assert(M.blurVector('ball',0.8).dy>0);
  const before=M.blurVector('ball',0.8-1e-7),after=M.blurVector('ball',0.8+1e-7);
  assert(Math.abs(after.dy)<Math.abs(before.dy));
  assert(Math.hypot(after.dx,after.dy)<Math.hypot(before.dx,before.dy));
  close(before.dx,after.dx);
  close(Math.abs(M.blurVector('ball',0.8).dy),1440*0.005);
  close(M.blurVector('uniform',0.5,0.01).dx,-8.2);
});

test('ghost fading follows one global sequence through bounce', () => {
  const previous=M.ghosts('ball',0.76),at=M.ghosts('ball',0.8),next=M.ghosts('ball',0.84);
  assert.equal(at.length,21);assert.equal(next.length,22);
  close(at.at(-1).opacity,0.92);close(next.at(-2).opacity,0.92*0.96);
  close(at[0].opacity,previous[0].opacity*0.96);
  close(next[0].opacity,at[0].opacity*0.96);
  for(const g of [at,next,M.ghosts('ball',1.44)]) for(let i=0;i<g.length;i++) {
    assert(g[i].opacity>=0.16&&g[i].opacity<=0.92);
    if(i)assert(g[i].opacity>=g[i-1].opacity);
  }
  assert(M.ghosts('ball',0.79).every(s=>s.t<=0.79));
});

test('car positions have constant or increasing spacing and positive initial speed', () => {
  const uniform=M.samples('uniform'), accelerated=M.samples('accelerated');
  for(let i=1;i<uniform.length;i++) {close(uniform[i].x-uniform[i-1].x,164);assert(uniform[i].x-uniform[i-1].x>M.config('uniform').objectWidth);assert.equal(uniform[i].vx,820);}
  let last=0;
  for(let i=1;i<accelerated.length;i++){const gap=accelerated[i].x-accelerated[i-1].x;assert(gap>last);if(i>1)close(gap-last,41.6);last=gap;}
  assert.equal(accelerated[0].vx,300);assert.equal(accelerated.at(-1).vx,1340);
  for(const kind of ['uniform','accelerated']) {assert.equal(M.sample(kind,0).x,90);assert.equal(M.sample(kind,1).x,910);assert.equal(M.sample(kind,0.5).y,155);}
});

test('all states remain finite and sprites stay inside canvas; config is independent', () => {
  for(const kind of ['ball','uniform','accelerated']) {
    const c=M.config(kind),halfWidth=c.objectWidth/2,halfHeight=kind==='ball'?halfWidth:halfWidth/2.5;
    for(let i=0;i<=1000;i++) {
      const s=M.sample(kind,c.duration*i/1000);
      assert(Object.values(s).every(Number.isFinite));
      assert(s.x-halfWidth>=0&&s.x+halfWidth<=c.width);
      assert(s.y-halfHeight>=0&&s.y+halfHeight<=c.height);
    }
    assert.deepEqual(M.sample(kind,-1),M.sample(kind,0));assert.deepEqual(M.sample(kind,99),M.sample(kind,c.duration));
  }
  const c=M.config('ball');c.dt=1;assert.equal(M.config('ball').dt,0.04);
  assert.throws(()=>M.sample('ball',NaN),RangeError);assert.throws(()=>M.config('other'),RangeError);
  assert.throws(()=>M.blurVector('ball',0,-1),RangeError);
});
