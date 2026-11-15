const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('./analog-clock.js');

function fakeClock() {
  const nodes = Object.fromEntries(['hand','face','digital'].map(key=>[key,{attributes:{},textContent:'',setAttribute(name,value){this.attributes[name]=value;}}]));
  const mapping={'[data-clock-hand]':nodes.hand,'[data-clock-face]':nodes.face,'[data-clock]':nodes.digital};
  return {nodes,querySelector(selector){return mapping[selector]??null;}};
}

test('continuous hand angle follows movement time independently of exposure times', () => {
  for(const [time,degrees] of [[0,0],[0.5,90],[1,180],[1.5,270],[1.6,288],[0.013,2.34],[2,360]]) assert.equal(C.angle(time),degrees);
});

test('update changes only the supplied host and keeps the digital time accessible', () => {
  const first=fakeClock(),second=fakeClock();
  C.update(first,1.6);
  assert.equal(first.nodes.hand.attributes.transform,'rotate(288 48 48)');
  assert.equal(first.nodes.hand.attributes['data-angle'],'288');
  assert.equal(first.nodes.digital.textContent,'1,60 s');
  assert.match(first.nodes.face.attributes['aria-label'],/Analoge Stoppuhr: 1,60 Sekunden/);
  assert.equal(second.nodes.digital.textContent,'');assert.deepEqual(second.nodes.hand.attributes,{});
  C.update(first,0);assert.equal(first.nodes.hand.attributes['data-angle'],'0');assert.equal(first.nodes.digital.textContent,'0,00 s');
});

test('invalid times fail before changing the clock', () => {
  const host=fakeClock();
  for(const time of [-1,NaN,Infinity,-Infinity,'1',null,undefined,Number.MAX_VALUE]) {
    assert.throws(()=>C.angle(time),RangeError);assert.throws(()=>C.update(host,time),RangeError);
  }
  assert.deepEqual(host.nodes.hand.attributes,{});assert.equal(host.nodes.digital.textContent,'');
  assert.throws(()=>C.update({querySelector:()=>null},0),/missing/);
});

test('SVG contains readable dial, a long hand, and forty evenly spaced marks', () => {
  for(const kind of ['ball','uniform','accelerated']) {
    const html=C.html(kind);
    assert.match(html,/viewBox="0 0 96 96"/);assert.match(html,/role="img"/);assert.match(html,/data-clock-hand[^>]*y2="16"/);
    assert.equal((html.match(/transform="rotate\(\d+ 48 48\)" stroke=/g)||[]).length,40);
    for(const label of ['0','0,5','1,0','1,5'])assert(html.includes('>'+label+'</text>'));
    assert.match(html,/<output data-clock[^>]*aria-live="off"/);
    assert(html.includes(`id="motion-clock-${kind}-metal"`));
  }
  assert.throws(()=>C.html('unknown'),RangeError);
});
