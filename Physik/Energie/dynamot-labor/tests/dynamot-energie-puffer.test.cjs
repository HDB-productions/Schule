const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const folder = path.join(__dirname, '..');
const raw = fs.readFileSync(path.join(folder, 'dynamot-labor.quelle.html'), 'utf8');
const network = fs.readFileSync(path.join(folder, 'dynamot-stromnetz.js'), 'utf8');
const source = raw.slice(raw.indexOf('/* MODEL_START */'), raw.indexOf('/* MODEL_END */'))
  .replace('/* DYNAMOT_NETWORK_MODEL */', network);
const physics = {};
vm.runInNewContext(`${source};this.step=step;this.circuit=circuit;`, physics);
const energy = require('../dynamot-energie.js');
const Buffers = require('../dynamot-energie-puffer.js');

const close = (actual, expected, label, tolerance = 1e-7) => assert.ok(
  Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
  `${label}: ${actual} ≈ ${expected}`
);
const motor = id => ({ id, type: 'motor', omega: 0, angle: 0, weight: false,
  crank: false, hand: false, rate: 15, mass: 0.5, height: 1.2 });
const lamp = id => ({ ...motor(id), type: 'lamp' });
const pair = (a, b, crossed = false) => [
  { a, ap: 0, b, bp: crossed ? 1 : 0 },
  { a, ap: 1, b, bp: crossed ? 0 : 1 }
];
function scene(devices, wires, measure = () => 3.2) {
  const state = { devices, wires, simulationTime: 0, running: true };
  physics.step(devices, wires, 0.01);
  state.simulationTime = 0.01;
  const buffer = Buffers.create();
  let plan = energy.plan(state), frame = buffer.update(plan, state, measure);
  function advance(seconds, inspect = () => {}) {
    const steps = Math.round(seconds / 0.01);
    for (let i = 0; i < steps; i++) {
      physics.step(devices, wires, 0.01);
      state.simulationTime += 0.01;
      plan = energy.plan(state);
      frame = buffer.update(plan, state, measure);
      for (const channel of frame.channels) close(
        channel.outputs.reduce((sum, o) => sum + o.joules, 0),
        channel.input.joules, `${channel.id} area`);
      for (const channel of frame.channels) {
        const active = frame.packets.filter(p => p.channel === channel.id && p.stage !== 'travel');
        if (active.length) {
          assert.equal(active.filter(p => p.stage === 'input').length, 1, 'one conversion per lane');
          close(active.reduce((sum, p) => sum + p.joules, 0),
            channel.input.joules, `${channel.id} visible conversion area`);
        }
      }
      assert.ok(frame.packets.every(p => p.joules >= -1e-8 && p.progress >= -1e-8 && p.progress <= 1 + 1e-8));
      inspect(frame, plan);
    }
    return frame;
  }
  return { state, buffer, get plan() { return plan; }, get frame() { return frame; }, advance };
}

test('all hand-to-lamp paths start populated and paired cable packets remain distinct', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  const s = scene([g, l], pair(1, 2));
  assert.ok(s.frame.routes.some(r => r.from === 'hand:1' && r.to === 'motor:1'));
  for (const wire of [0, 1]) {
    const route = s.frame.routes.find(r => r.wire === wire && r.to === 'lamp:2');
    assert.ok(route && route.sourceChannel && route.targetChannel);
    assert.ok(s.frame.packets.some(p => p.stage === 'travel' && p.routeId === route.id),
      `cable ${wire} is visibly populated at the initial frame`);
  }
  let motorSplit = false, lampSplit = false;
  s.advance(6, frame => {
    motorSplit ||= frame.packets.some(p => p.station === 'motor:1' && p.stage === 'input' && p.kind === 'mechanical-in') &&
      frame.packets.some(p => p.station === 'motor:1' && p.stage === 'output' && p.kind === 'electrical' && p.joules > 0);
    lampSplit ||= frame.packets.some(p => p.station === 'lamp:2' && p.stage === 'input' && p.kind === 'electrical') &&
      frame.packets.some(p => p.station === 'lamp:2' && p.stage === 'output' && p.kind === 'heat' && p.joules > 0) &&
      frame.packets.some(p => p.station === 'lamp:2' && p.stage === 'output' && p.kind === 'light' && p.joules > 0);
  });
  assert.ok(motorSplit && lampSplit);
});

test('travel uses fixed world speed even if measured route length changes', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  let rootLength = 4;
  const measure = route => route.id === 'root:hand:1' ? rootLength : 3.2;
  const s = scene([g, l], pair(1, 2), measure);
  const original = s.frame.packets.find(p => p.routeId === 'root:hand:1' && p.distance < 1);
  assert.ok(original);
  rootLength = 6;
  const next = s.advance(0.2).packets.find(p => p.id === original.id);
  assert.ok(next, 'lengthening a path cannot teleport an in-flight packet');
  close(next.distance - original.distance, Buffers.SPEED * 0.2, 'fixed physical travel speed');
  close(next.progress, next.distance / 6, 'progress follows current path length');
});

test('arrival inside a large frame immediately advances its receiving conversion', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  const measure = route => route.id === 'root:hand:1' ? 1 : 3.2;
  const s = scene([g, l], pair(1, 2), measure);
  s.state.simulationTime += 0.8;
  const frame = s.buffer.update(s.plan, s.state, measure);
  const input = frame.packets.find(p => p.stage === 'input' && p.station === 'motor:1');
  assert.ok(input, 'hand packet has already arrived');
  close(input.progress, (0.8 - 1 / Buffers.SPEED) / Buffers.CONVERSION,
    'conversion accounts for time after arrival', 1e-6);
});

test('shortening a moving path completes the previous lane before its next packet arrives', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  let length = 4;
  const measure = route => route.id === 'root:hand:1' ? length : 3.2;
  const s = scene([g, l], pair(1, 2), measure);
  const first = s.frame.packets.find(p => p.routeId === 'root:hand:1' && p.distance > 2);
  assert.ok(first);
  assert.ok(s.frame.packets.some(p => p.station === 'motor:1' && p.stage === 'input'));
  length = first.distance + 0.24; // next arrival in 0.15 s at 1.6 units/s
  s.state.simulationTime += 0.13;
  const frame = s.buffer.update(s.plan, s.state, measure);
  assert.ok(frame.packets.some(p => p.id === first.id && p.stage === 'travel'));
  assert.ok(!frame.packets.some(p => p.station === 'motor:1' && p.stage === 'input'),
    'the previous conversion finished before the incoming packet reached the motor');
  assert.ok(frame.packets.some(p => p.from === 'motor:1' && p.stage === 'travel'),
    'finished conversion released its outputs without an arrival-time jump');
});

test('a newly appearing route is not seeded again after a live conversion launches it', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  const measure = route => route.id === 'root:hand:1' ? 1 : 3.2;
  const s = scene([g, l], pair(1, 2), measure);
  const changed = structuredClone(s.plan);
  changed.wires[0].flows.push({ from: 1, to: null, power: 0.1, kind: 'heat' });
  s.state.simulationTime += 0.2; // Existing motor conversion completes at 0.125 s.
  const frame = s.buffer.update(changed, s.state, measure);
  const extra = frame.routes.find(r => r.from === 'motor:1' && r.to === 'wire:0' &&
    !s.frame.routes.some(old => old.id === r.id));
  assert.ok(extra);
  const packets = frame.packets.filter(p => p.routeId === extra.id && p.stage === 'travel');
  assert.equal(packets.length, 1);
  close(packets[0].distance, Buffers.SPEED * (0.2 - 0.125), 'live launch retained');
  assert.equal(new Set(frame.packets.map(p => p.id)).size, frame.packets.length, 'no duplicate packet identities');
});

test('receiving motor converts blue into copper heat and shaft energy, then green lift', () => {
  const g = motor(1), m = motor(2); g.crank = g.hand = true; g.rate = 30;
  m.weight = true; m.height = 0.2;
  const s = scene([g, m], pair(1, 2));
  let receiverSplit = false, shaftSplit = false, liftTravel = false, weightStore = false;
  s.advance(8, (frame, plan) => {
    receiverSplit ||= frame.channels.some(c => c.station === 'motor:2' && c.input.form === 'electrical' &&
      c.outputs.some(o => o.kind === 'heat') && c.outputs.some(o => o.kind === 'shaft'));
    shaftSplit ||= frame.channels.some(c => c.station === 'shaft:2' && c.outputs.some(o => o.kind === 'heat') &&
      c.outputs.some(o => o.kind === 'lift'));
    liftTravel ||= frame.packets.some(p => p.stage === 'travel' && p.kind === 'lift' &&
      p.from === 'shaft:2' && p.to === 'weight:2');
    weightStore ||= frame.channels.some(c => c.station === 'weight:2' && c.input.kind === 'lift' &&
      c.outputs.some(o => o.kind === 'potential' && o.store));
    close(frame.stocks.find(x => x.kind === 'potential-stock' && x.device === 2).joules,
      plan.devices.find(x => x.id === 2).potentialJ, 'stock tracks actual height');
  });
  assert.ok(receiverSplit && shaftSplit && liftTravel && weightStore);
});

test('hand generator drives a free crank through both cables, including reversed polarity', () => {
  for (const crossed of [false, true]) {
    const g = motor(1), m = motor(2); g.crank = g.hand = true; m.crank = true;
    const s = scene([g, m], pair(1, 2, crossed));
    let sawShaft = false;
    s.advance(5, frame => {
      sawShaft ||= frame.routes.some(r => r.kind === 'shaft' && r.from === 'motor:2' && r.to === 'shaft:2');
    });
    assert.ok(sawShaft);
    assert.ok(crossed ? m.omega < 0 : m.omega > 0);
    assert.ok(s.frame.routes.filter(r => r.kind === 'electrical' && r.to === 'motor:2').length >= 2);
  }
});

test('two generators feeding parallel lamps retain separate, finite lineages', () => {
  const a = motor(1), b = motor(2), x = lamp(3), y = lamp(4);
  a.crank = a.hand = b.crank = b.hand = true;
  const wires = [...pair(1, 3), ...pair(1, 4), ...pair(2, 3), ...pair(2, 4)];
  const s = scene([a, b, x, y], wires);
  assert.ok(s.frame.routes.filter(r => r.kind === 'electrical' && r.to === 'lamp:3').length >= 4);
  s.advance(3, frame => {
    assert.ok(frame.channels.length < 100 && frame.routes.length < 200);
  });
});

test('opposed driven cranks heat each cable from both ends even with zero net transfer', () => {
  const a = motor(1), b = motor(2);
  a.crank = a.hand = b.crank = b.hand = true; a.rate = 30; b.rate = -30;
  const s = scene([a, b], pair(1, 2));
  assert.ok(s.plan.wires.every(w => w.power === 0 && w.heat > 0));
  for (const wire of [0, 1]) {
    const paths = s.frame.routes.filter(r => r.wire === wire && r.to === 'wire:' + wire);
    assert.equal(paths.length, 2);
    assert.deepEqual(paths.map(r => r.from).sort(), ['motor:1', 'motor:2']);
    assert.ok(paths.every(r => r.kind === 'electrical'));
    assert.equal(s.frame.channels.filter(c => c.station === 'wire:' + wire).length, 2);
  }
  s.advance(2);
  assert.ok(s.frame.packets.some(p => p.stage === 'output' && p.station.startsWith('wire:') && p.kind === 'heat'));
});

test('weight root uses a finite height quantum while displayed stock equals actual mgh', () => {
  const g = motor(1), l = lamp(2); g.weight = true; g.mass = 2;
  const s = scene([g, l], pair(1, 2));
  const quantum = g.mass * 9.81 * 1.5 / 20;
  let sawFall = false;
  s.advance(30, (frame, plan) => {
    const actual = plan.devices.find(d => d.id === 1).potentialJ;
    close(frame.stocks.find(x => x.kind === 'potential-stock').joules, actual, 'weight stock');
    const root = frame.channels.find(c => c.id === 'root:fall:1');
    if (root) {
      sawFall = true;
      close(root.input.joules, Math.min(quantum, actual), 'root packet finite quantum');
    }
  });
  assert.ok(sawFall);
  assert.equal(g.height, 0);
  assert.ok(!s.frame.routes.some(r => r.rootId === 'fall:1'));
  close(s.frame.stocks.find(x => x.kind === 'potential-stock').joules, 0, 'empty floor stock');
});

test('maximum hand rate and 2 kg receiving weight keep packet areas finite', () => {
  const g = motor(1), m = motor(2); g.crank = g.hand = true; g.rate = 30;
  m.weight = true; m.mass = 2; m.height = 0.2;
  const s = scene([g, m], pair(1, 2));
  s.advance(8, (frame, plan) => {
    assert.ok(frame.packets.every(p => Number.isFinite(p.joules) && p.joules < 100));
    close(frame.stocks.find(x => x.kind === 'potential-stock' && x.device === 2).joules,
      plan.devices.find(x => x.id === 2).potentialJ, 'maximum-load stock');
  });
});

test('pause freezes distance, source stop removes its tree, reset seeds only live roots', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  const s = scene([g, l], pair(1, 2));
  s.advance(2);
  const paused = s.buffer.update(s.plan, s.state, () => 3.2);
  assert.deepEqual(s.buffer.update(s.plan, s.state, () => 3.2), paused);
  g.hand = false;
  s.advance(0.01);
  assert.ok(!s.frame.routes.some(r => r.rootId === 'hand:1'));
  s.buffer.reset();
  const reset = s.buffer.update(s.plan, s.state, () => 3.2);
  assert.ok(!reset.routes.some(r => r.rootId === 'hand:1'));
});
