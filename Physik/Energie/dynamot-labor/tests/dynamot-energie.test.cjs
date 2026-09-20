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

const motor = id => ({ id, type: 'motor', omega: 0, angle: 0, weight: false, crank: false, hand: false, rate: 15, mass: 0.5, height: 1.2 });
const lamp = id => ({ ...motor(id), type: 'lamp' });
const wire = (a, ap, b, bp) => ({ a, ap, b, bp });
const pair = (a = 1, b = 2, swap = false) => [wire(a, 0, b, swap ? 1 : 0), wire(a, 1, b, swap ? 0 : 1)];
const run = (devices, wires, seconds = 2) => {
  const dt = 0.005;
  for (let i = 0; i < seconds / dt; i++) model.step(devices, wires, dt);
  return energy.plan({ devices, wires });
};
const near = (actual, expected, relative = 0.02) => assert.ok(Math.abs(actual - expected) <= relative * Math.max(1, Math.abs(expected)), `${actual} ≈ ${expected}`);
const directed = (plan, from, to) => {
  assert.ok(plan.wires.every(w => w.power > 0 && w.from === from && w.to === to), 'both cables deliver energy source→receiver');
  assert.ok(plan.wires.every(w => w.direction === 1 || w.direction === -1));
};

test('hand generator lights lamp: two cable flows, balanced losses, illustrative light split', () => {
  const g = motor(1), l = lamp(2), wires = pair();
  g.crank = g.hand = true;
  const plan = run([g, l], wires);
  const [source, bulb] = plan.devices;
  assert.ok(source.mechanicalIn > source.electricalOut > 0);
  assert.ok(source.copperHeat > 0 && source.frictionHeat > 0);
  assert.ok(bulb.electricalIn > 0 && bulb.heat > bulb.light);
  near(bulb.light, bulb.electricalIn * 0.1, 1e-10);
  directed(plan, 1, 2);
  near(plan.wires.reduce((sum, w) => sum + w.power, 0), source.electricalOut - plan.wires.reduce((sum, w) => sum + w.heat / 2, 0));
  near(source.electricalOut, bulb.electricalIn + plan.wires.reduce((sum, w) => sum + w.heat, 0));
});

test('falling weight releases potential energy and lights lamp', () => {
  const g = motor(1), l = lamp(2), wires = pair();
  g.weight = true; g.mass = 1;
  const initialPotential = g.mass * 9.81 * g.height;
  const plan = run([g, l], wires, 1);
  const source = plan.devices[0];
  assert.ok(g.omega < 0 && g.height < 1.2);
  assert.ok(source.potentialJ < initialPotential && source.gravityPower > 0);
  assert.equal(source.handPower, 0);
  assert.ok(source.electricalOut > 0 && plan.devices[1].light > 0);
  directed(plan, 1, 2);
});

test('hand generator drives a second motor, then lifts its weight', () => {
  const g = motor(1), m = motor(2), wires = pair();
  g.crank = g.hand = true;
  let plan = run([g, m], wires);
  assert.ok(m.omega > 0 && plan.devices[1].electromagneticPower > 0);
  assert.ok(plan.devices[1].electricalIn > 0);
  directed(plan, 1, 2);
  m.weight = true; m.mass = 0.5; m.height = 0.2;
  plan = run([g, m], wires, 1);
  assert.ok(m.height > 0.2 && plan.devices[1].potentialJ > m.mass * 9.81 * 0.2);
  assert.ok(plan.devices[1].mechanicalOut > 0 && plan.devices[1].gravityPower < 0);
  directed(plan, 1, 2);
});

test('swapped lamp polarity and reversed crank rotation do not reverse visual delivery', () => {
  for (const rate of [15, -15]) {
    const g = motor(1), l = lamp(2), wires = pair(1, 2, true);
    g.crank = g.hand = true; g.rate = rate;
    const plan = run([g, l], wires);
    assert.ok(wires[0].current * wires[1].current < 0, 'cable currents oppose');
    directed(plan, 1, 2);
  }
});

test('parallel lamps split delivery and disconnected or stationary circuits have no packets', () => {
  const g = motor(1), a = lamp(2), b = lamp(3);
  g.crank = g.hand = true;
  const wires = [...pair(1, 2), ...pair(1, 3)];
  let plan = run([g, a, b], wires);
  assert.ok(plan.wires.every(w => w.from === 1 && [2, 3].includes(w.to) && w.power > 0));
  near(plan.wires[0].power, plan.wires[2].power, 1e-6);
  near(plan.devices[1].light, plan.devices[2].light, 1e-6);

  const isolated = motor(4), dark = lamp(5), oneWire = [wire(4, 0, 5, 0)];
  isolated.crank = isolated.hand = true;
  plan = run([isolated, dark], oneWire);
  assert.equal(plan.wires[0].power, 0);
  assert.equal(plan.devices[1].light, 0);
  isolated.hand = false; isolated.omega = 0;
  model.circuit([isolated, dark], oneWire);
  plan = energy.plan({ devices: [isolated, dark], wires: oneWire });
  assert.equal(plan.wires[0].power, 0);
  assert.equal(plan.devices[0].kineticJ, 0);
});

test('two generators supply two parallel lamps through every connected cable', () => {
  const g1 = motor(1), g2 = motor(2), l1 = lamp(3), l2 = lamp(4);
  g1.crank = g1.hand = g2.crank = g2.hand = true;
  const wires = [...pair(1, 3), ...pair(1, 4), ...pair(2, 3), ...pair(2, 4)];
  const plan = run([g1, g2, l1, l2], wires);
  assert.ok(plan.devices.slice(0, 2).every(d => d.electricalOut > 0));
  assert.ok(plan.devices.slice(2).every(d => d.light > 0));
  assert.ok(plan.wires.every(w => w.power > 0 && [1, 2].includes(w.from) && [3, 4].includes(w.to)));
  near(plan.devices.slice(0, 2).reduce((sum, d) => sum + d.electricalOut, 0),
    plan.devices.slice(2).reduce((sum, d) => sum + d.electricalIn, 0) + plan.wires.reduce((sum, w) => sum + w.heat, 0));
});

test('planning does not mutate solved state', () => {
  const g = motor(1), l = lamp(2), wires = pair();
  g.crank = g.hand = true;
  run([g, l], wires);
  const before = JSON.stringify({ devices: [g, l], wires });
  energy.plan({ devices: [g, l], wires });
  assert.equal(JSON.stringify({ devices: [g, l], wires }), before);
});

test('the full weight reserve is shown as several finite lilac packets', () => {
  for (const mass of [0.5, 1, 2]) {
    const potentialJ = mass * energy.MODEL.g * 1.2;
    const packets = energy.weightStockPackets(potentialJ, mass);
    assert.equal(packets.length, 16, 'the 1.2 m reserve occupies 16 of 20 height slices');
    near(packets.reduce((sum, p) => sum + p.joules, 0), potentialJ, 1e-10);
    assert.ok(packets.every(p => p.joules > 0));
  }
  assert.deepEqual(energy.weightStockPackets(0, 1), []);
});

test('falling weight turns finite stock into outgoing packets, then stops at the floor', () => {
  const g = motor(1), l = lamp(2), wires = pair();
  g.weight = true; g.mass = 1;
  const tracker = energy.createWeightPacketTracker();
  let time = 0, observedTransfer = false;
  const initialJ = energy.plan({ devices: [g, l], wires }).devices[0].potentialJ;
  let view = tracker.update({ id: 1, potentialJ: initialJ, gravityPower: 0 }, g.mass, time, true);
  assert.equal(view.stock.length, 16);
  for (let i = 0; i < 6000; i++) {
    model.step([g, l], wires, 0.005); time += 0.005;
    if (i % 20) continue;
    const d = energy.plan({ devices: [g, l], wires }).devices[0];
    view = tracker.update(d, g.mass, time, true);
    assert.ok(view.transit.every(p => p.direction === 'fall' && p.joules > 0));
    near(view.stock.reduce((sum, p) => sum + p.joules, 0), view.stockJ, 1e-8);
    if (g.height > 0 && d.gravityPower > 0) {
      near(view.stockJ + view.pendingJ + view.inFlightJ + view.deliveredJ, initialJ, 1e-6);
      observedTransfer ||= view.transit.length > 0;
    }
  }
  assert.ok(observedTransfer, 'green release packets appeared during the fall');
  assert.equal(g.height, 0);
  assert.equal(view.stock.length, 0);
  assert.equal(view.transit.length, 0);
});

test('lifting carries green packets to the weight before adding lilac stock; pause and reset are stable', () => {
  const g = motor(1), m = motor(2), wires = pair();
  g.crank = g.hand = true; g.rate = 30;
  m.weight = true; m.mass = 0.5; m.height = 0.2;
  run([g, m], wires, 1); // Let the receiving motor overcome its initial weight torque.
  assert.ok(m.omega > 0);
  const tracker = energy.createWeightPacketTracker();
  let time = 0, sawTransit = false, sawStockArrival = false;
  const initial = energy.plan({ devices: [g, m], wires }).devices[1];
  let view = tracker.update(initial, m.mass, time, true), previousStock = view.stockJ;
  for (let i = 0; i < 500; i++) {
    model.step([g, m], wires, 0.005); time += 0.005;
    if (i % 10) continue;
    const d = energy.plan({ devices: [g, m], wires }).devices[1];
    view = tracker.update(d, m.mass, time, true);
    near(view.stockJ + view.pendingJ + view.inFlightJ, d.potentialJ, 1e-6);
    assert.ok(view.transit.every(p => p.direction === 'lift' && p.joules > 0));
    sawTransit ||= view.transit.length > 0;
    sawStockArrival ||= view.stockJ > previousStock + 1e-4;
    previousStock = view.stockJ;
  }
  assert.ok(sawTransit && sawStockArrival, 'packet reaches weight and becomes stock');
  view = tracker.update(energy.plan({ devices: [g, m], wires }).devices[1], m.mass, time, true);
  const frozen = tracker.update(energy.plan({ devices: [g, m], wires }).devices[1], m.mass, time, false);
  assert.deepEqual(frozen, view, 'pause does not advance packets');
  m.height = 1.2; m.omega = 0;
  const resetJ = energy.plan({ devices: [g, m], wires }).devices[1].potentialJ;
  view = tracker.update({ id: m.id, potentialJ: resetJ, gravityPower: 0 }, m.mass, time, false);
  near(view.stockJ, resetJ, 1e-10);
  assert.equal(view.transit.length, 0, 'manual raise resets in-flight packets');
  assert.equal(view.stock.length, 16);
});

test('a stopped midair weight clears transfer without consuming its remaining stock', () => {
  const tracker = energy.createWeightPacketTracker(), mass = 1, fullJ = mass * 9.81 * 1.2;
  tracker.update({ id: 1, potentialJ: fullJ, gravityPower: 0 }, mass, 0, true);
  let view = tracker.update({ id: 1, potentialJ: fullJ - 0.3, gravityPower: 1 }, mass, 0.5, true);
  assert.ok(view.transit.length > 0);
  view = tracker.update({ id: 1, potentialJ: fullJ - 0.3, gravityPower: 0 }, mass, 0.6, true);
  assert.equal(view.transit.length, 0);
  near(view.stockJ, fullJ - 0.3, 1e-10);
});

test('electrical arrival releases one lift packet without a growing green placeholder', () => {
  const tracker=energy.createWeightPacketTracker(),mass=.5;
  const device=(potentialJ)=>({id:2,potentialJ,gravityPower:-.2});
  tracker.update(device(1),mass,0,true,false);
  let transfer=tracker.update(device(1.2),mass,1,true,false);
  assert.equal(transfer.transit.length,0);
  near(transfer.stockJ,1);near(transfer.pendingJ,.2);
  transfer=tracker.update(device(1.6),mass,3,true,true);
  assert.equal(transfer.transit.length,1);assert.equal(transfer.transit[0].partial,undefined);
  assert.equal(transfer.transit[0].electricalArrival,true);near(transfer.transit[0].joules,.6);
  near(transfer.stockJ+transfer.pendingJ+transfer.inFlightJ,1.6);
  const paused=tracker.update(device(1.6),mass,3,false,false);
  assert.deepEqual(paused,transfer);
  transfer=tracker.update(device(1.7),mass,4,true,false);
  near(transfer.stockJ,1.6);assert.equal(transfer.transit.length,0);
  near(transfer.pendingJ,.1);
  tracker.reset();transfer=tracker.update(device(1.7),mass,0,false,false);
  near(transfer.stockJ,1.7);assert.equal(transfer.transit.length,0);
});
