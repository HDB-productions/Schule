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
const model = {};
vm.runInNewContext(`${source};this.step=step;this.circuit=circuit;`, model);
const energy = require('../dynamot-energie.js');
const Buffers = require('../dynamot-energie-puffer.js');

const motor = id => ({ id, type: 'motor', omega: 0, angle: 0, weight: false, crank: false, hand: false, rate: 15, mass: 0.5, height: 1.2 });
const lamp = id => ({ ...motor(id), type: 'lamp' });
const pair = (a, b) => [{ a, ap: 0, b, bp: 0 }, { a, ap: 1, b, bp: 1 }];
const close = (actual, expected, label, tolerance = 1e-6) => assert.ok(
  Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
  `${label}: ${actual} ≈ ${expected}`
);
function scene(devices, wires) {
  const state = { devices, wires, simulationTime: 0, running: true };
  model.circuit(devices, wires);
  const buffer = Buffers.create();
  let frame = buffer.update(energy.plan(state), state);
  function advance(seconds, onFrame = () => {}) {
    const steps = Math.round(seconds / 0.01);
    for (let i = 0; i < steps; i++) {
      model.step(devices, wires, 0.01);
      state.simulationTime += 0.01;
      frame = buffer.update(energy.plan(state), state);
      close(frame.ledger.balanceJ, 0, 'visual energy balance', 2e-5);
      assert.ok(frame.packets.every(p => p.joules >= 0 && p.progress >= 0 && p.progress <= 1));
      onFrame(frame, i);
    }
    return frame;
  }
  return { state, buffer, get frame() { return frame; }, advance };
}

test('hand input becomes a shrinking motor input and growing blue/heat outputs, then lamp light and heat', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  const s = scene([g, l], pair(1, 2));
  let motorSplit = false, lampSplit = false, twoCableArrival = false;
  s.advance(11, frame => {
    const m = frame.packets.filter(p => p.station === 'motor:1' && p.stage !== 'travel');
    if (m.some(p => p.stage === 'input' && p.kind === 'mechanical-in' && p.joules > 0) &&
      m.some(p => p.stage === 'output' && p.kind === 'electrical' && p.joules > 0) &&
      m.some(p => p.stage === 'output' && p.kind === 'heat' && p.joules > 0)) motorSplit = true;
    const lampInputs = frame.packets.filter(p => p.station === 'lamp:2' && p.stage === 'input' && p.kind === 'electrical' && p.joules > 0);
    twoCableArrival ||= lampInputs.length === 2;
    lampSplit ||= lampInputs.length > 0 && frame.packets.some(p => p.station === 'lamp:2' && p.stage === 'output' && p.kind === 'heat' && p.joules > 0) &&
      frame.packets.some(p => p.station === 'lamp:2' && p.stage === 'output' && p.kind === 'light' && p.joules > 0);
  });
  assert.ok(motorSplit && lampSplit && twoCableArrival, 'paired cable arrivals feed one lamp conversion');
  assert.ok(s.frame.ledger.injectedJ > 0 && s.frame.ledger.deliveredJ > 0);
});

test('falling weight has finite stock and all final source packets drain after physical stop', () => {
  const g = motor(1), l = lamp(2); g.weight = true; g.mass = 1;
  const s = scene([g, l], pair(1, 2));
  const initialJ = s.frame.stocks.find(x => x.kind === 'potential-stock').joules;
  let purpleInput = false, greenOutput = false, greenTravel = false;
  s.advance(30, frame => {
    const stock = frame.stocks.find(x => x.kind === 'potential-stock');
    assert.ok(stock.joules >= 0 && stock.joules <= initialJ + 1e-7);
    purpleInput ||= frame.packets.some(p => p.station === 'weight:1' && p.stage === 'input' && p.kind === 'potential' && p.joules > 0);
    greenOutput ||= frame.packets.some(p => p.station === 'weight:1' && p.stage === 'output' && p.kind === 'fall' && p.joules > 0);
    greenTravel ||= frame.packets.some(p => p.stage === 'travel' && p.kind === 'fall' && p.from === 'weight:1' && p.to === 'motor:1');
  });
  assert.equal(g.height, 0);
  assert.ok(purpleInput && greenOutput && greenTravel);
  const drained = s.advance(12);
  close(drained.stocks.find(x => x.kind === 'potential-stock').joules, 0, 'empty weight');
  assert.equal(drained.packets.length, 0, 'no packet is stuck after the source stops');
  close(drained.ledger.activeJ + drained.ledger.pendingJ, 0, 'no queued final energy');
});

test('receiving motor converts two blue arrivals into red and green before growing weight stock', () => {
  const g = motor(1), m = motor(2); g.crank = g.hand = true; g.rate = 30;
  m.weight = true; m.mass = 0.5; m.height = 0.2;
  const s = scene([g, m], pair(1, 2));
  const initial = s.frame.stocks.find(x => x.kind === 'potential-stock').joules;
  const capacity = m.mass * 9.81 * 1.5;
  let blueAtMotor = false, split = false, greenTravel = false, weightConversion = false, stockGrew = false;
  let priorInput = null, priorStore = null, priorId = null;
  s.advance(18, frame => {
    const stock = frame.stocks.find(x => x.kind === 'potential-stock');
    assert.ok(stock.joules >= 0 && stock.joules <= capacity + 1e-7, 'visible weight stock stays finite');
    stockGrew ||= stock.joules > initial + 0.05;
    const receiverInputs = frame.packets.filter(p => p.station === 'motor:2' && p.stage === 'input' && p.kind === 'electrical' && p.joules > 0);
    blueAtMotor ||= receiverInputs.length === 2;
    split ||= receiverInputs.length === 2 && frame.packets.some(p => p.station === 'motor:2' && p.stage === 'output' && p.kind === 'heat' && p.joules > 0) &&
      frame.packets.some(p => p.station === 'motor:2' && p.stage === 'output' && p.kind === 'lift' && p.joules > 0);
    greenTravel ||= frame.packets.some(p => p.kind === 'lift' && p.stage === 'travel' && p.from === 'motor:2' && p.to === 'weight:2');
    const liftInput = frame.packets.find(p => p.kind === 'lift' && p.station === 'weight:2' && p.stage === 'input');
    const purpleOutput = frame.packets.find(p => p.kind === 'potential' && p.station === 'weight:2' && p.stage === 'output' && p.store);
    if (liftInput && purpleOutput) {
      weightConversion = true;
      if (priorId === liftInput.id) close((priorInput - liftInput.joules), purpleOutput.joules - priorStore, 'green decrease equals lilac growth', 1e-5);
      priorId = liftInput.id; priorInput = liftInput.joules; priorStore = purpleOutput.joules;
    } else { priorId = null; }
  });
  assert.ok(blueAtMotor && split && greenTravel && weightConversion && stockGrew);
});

test('pause and reset preserve stock and remove all in-flight packets', () => {
  const g = motor(1), l = lamp(2); g.crank = g.hand = true;
  const s = scene([g, l], pair(1, 2));
  s.advance(3);
  const paused = s.buffer.update(energy.plan(s.state), s.state);
  assert.deepEqual(s.buffer.update(energy.plan(s.state), s.state), paused);
  s.buffer.reset();
  const initial = s.buffer.update(energy.plan(s.state), s.state);
  assert.equal(initial.packets.length, 0);
  close(initial.ledger.balanceJ, 0, 'reset balance');
});

test('two simultaneous generators feed parallel lamps without duplicate or lost Joules', () => {
  const a = motor(1), b = motor(2), x = lamp(3), y = lamp(4);
  a.crank = a.hand = b.crank = b.hand = true;
  const wires = [...pair(1, 3), ...pair(1, 4), ...pair(2, 3), ...pair(2, 4)];
  const s = scene([a, b, x, y], wires);
  let joined = false;
  s.advance(10, frame => {
    joined ||= frame.packets.filter(p => p.station === 'lamp:3' && p.stage === 'input' && p.kind === 'electrical' && p.joules > 0).length >= 4;
  });
  assert.ok(joined, 'both cables from both sources merge into one lamp batch');
  assert.ok(s.frame.ledger.injectedJ > 0 && s.frame.ledger.deliveredJ > 0);
});

test('staggered arrival stays visible at a busy lamp station', () => {
  const a = motor(1), b = motor(2), l = lamp(3);
  a.crank = a.hand = true;
  b.crank = true;
  const s = scene([a, b, l], [...pair(1, 3), ...pair(2, 3)]);
  let waitingVisible = false;
  s.advance(9, frame => {
    if (s.state.simulationTime >= 0.6) b.hand = true;
    waitingVisible ||= frame.packets.some(p => p.station === 'lamp:3' && p.stage === 'input' &&
      p.waiting === true && p.progress === 0 && p.joules > 0);
  });
  assert.ok(waitingVisible, 'new arrival remains visible while prior conversion runs');
});

test('lift stock stays within height capacity through top stop and drains old packets', () => {
  const g = motor(1), m = motor(2); g.crank = g.hand = true; g.rate = 30;
  m.weight = true; m.mass = 0.5; m.height = 0.2;
  const s = scene([g, m], pair(1, 2)), capacity = m.mass * 9.81 * 1.5;
  let maximum = 0;
  s.advance(50, frame => {
    const stock = frame.stocks.find(x => x.kind === 'potential-stock' && x.device === 2).joules;
    maximum = Math.max(maximum, stock);
    assert.ok(stock <= capacity + 1e-6);
  });
  assert.equal(m.height, 1.5);
  s.advance(10);
  close(s.frame.stocks.find(x => x.kind === 'potential-stock' && x.device === 2).joules,
    m.mass * 9.81 * m.height, 'visible stock catches actual potential at top');
  assert.ok(maximum > capacity * 0.6);
  assert.ok(s.frame.stocks.find(x => x.kind === 'potential-stock' && x.device === 2).joules <= capacity + 1e-6);
  g.hand = false;
  s.advance(40); // The raised weight becomes a genuine new source while it falls.
  assert.equal(m.height, 0);
  const drained = s.advance(12);
  close(drained.stocks.find(x => x.kind === 'potential-stock' && x.device === 2).joules,
    m.mass * 9.81 * m.height, 'visible stock catches actual potential at floor');
  assert.equal(drained.packets.length, 0, 'all packets drain after both sources stop');
});
