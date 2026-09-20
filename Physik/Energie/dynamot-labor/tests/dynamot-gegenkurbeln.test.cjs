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
vm.runInNewContext(`${source};this.step=step;`, model);
const energy = require('../dynamot-energie.js');

const close = (actual, expected, label, tolerance = 1e-8) => assert.ok(
  Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
  `${label}: ${actual} ≈ ${expected}`
);
function scenario(rateA, rateB, crossed = false) {
  const motor = (id, rate) => ({ id, type: 'motor', omega: 0, angle: 0,
    crank: true, hand: true, weight: false, rate, mass: 0.5, height: 1.2 });
  const devices = [motor(1, rateA), motor(2, rateB)];
  const wires = [{ a: 1, ap: 0, b: 2, bp: crossed ? 1 : 0 },
    { a: 1, ap: 1, b: 2, bp: crossed ? 0 : 1 }];
  for (let i = 0; i < 400; i++) model.step(devices, wires, 0.005);
  return { devices, wires, plan: energy.plan({ devices, wires }) };
}
function verifyBalance({ devices, wires, plan }) {
  for (const d of plan.devices) {
    close(d.mechanicalIn + d.electricalIn,
      d.mechanicalOut + d.electricalOut + d.heat + d.kineticPower,
      `D${d.id} power balance`);
    const sent = plan.wires.flatMap(w => w.flows).filter(f => f.from === d.id).reduce((s, f) => s + f.power, 0);
    const received = plan.wires.flatMap(w => w.flows).filter(f => f.to === d.id).reduce((s, f) => s + f.power, 0);
    close(sent - received, d.electricalOut - d.electricalIn, `D${d.id} cable endpoint balance`);
  }
  for (const [i, w] of plan.wires.entries()) {
    close(w.heat, wires[i].power, `cable ${i} heat`);
    close(w.flows.filter(f => f.kind === 'heat').reduce((s, f) => s + f.power, 0),
      w.heat, `cable ${i} heat flow`);
    assert.ok(w.flows.every(f => f.power > 0 && [1, 2].includes(f.from) &&
      (f.kind === 'heat' ? f.to === null : [1, 2].includes(f.to))));
  }
  close(plan.devices.reduce((s, d) => s + d.mechanicalIn - d.mechanicalOut - d.kineticPower, 0),
    plan.devices.reduce((s, d) => s + d.heat, 0) + plan.wires.reduce((s, w) => s + w.heat, 0),
    'whole scene power balance');
  assert.ok(devices.every((d, i) => d.omega === [devices[0].rate, devices[1].rate][i]));
}

test('equal aligned emfs produce no current; each hand only covers its DynaMot friction', () => {
  for (const [rateA, rateB, crossed] of [[30, 30, false], [-30, -30, false],
    [30, -30, true], [-30, 30, true]]) {
    const result = scenario(rateA, rateB, crossed);
    verifyBalance(result);
    assert.ok(result.wires.every(w => w.current === 0));
    assert.ok(result.plan.wires.every(w => w.power === 0 && w.heat === 0 && w.flows.length === 0));
    for (const d of result.plan.devices) {
      close(d.handPower, 11.7, '30 rad/s friction');
      close(d.heat, d.handPower, 'hand becomes device heat');
    }
  }
});

test('equal opposed emfs drive real current and heat both cables from both generators', () => {
  for (const [rateA, rateB, crossed] of [[30, -30, false], [-30, 30, false],
    [30, 30, true], [-30, -30, true]]) {
    const result = scenario(rateA, rateB, crossed);
    verifyBalance(result);
    const { plan, wires } = result;
    close(Math.abs(wires[0].current), 2.634146341463414, 'circulating current');
    assert.ok(plan.devices.every(d => d.electricalOut > 0 && d.electricalIn === 0));
    assert.ok(plan.wires.every(w => w.power === 0 && w.from === null && w.to === null));
    for (const w of plan.wires) {
      close(w.heat, 0.3469363474122544, 'resistive cable loss');
      assert.equal(w.flows.length, 2);
      assert.deepEqual(w.flows.map(f => f.from), [1, 2]);
      assert.ok(w.flows.every(f => f.kind === 'heat' && f.to === null));
      w.flows.forEach(f => close(f.power, w.heat / 2, 'each end feeds half the cable loss'));
    }
  }
});

test('unequal rates transfer electricity and may return mechanical energy to a hand', () => {
  const normal = scenario(30, 15, false);
  verifyBalance(normal);
  close(normal.plan.devices[0].electricalOut, 2.6887566924449744, 'source terminal power');
  close(normal.plan.devices[1].electricalIn, 2.645389649018436, 'receiver terminal power');
  assert.ok(normal.plan.wires.every(w => w.from === 1 && w.to === 2 && w.power > 0));
  for (const w of normal.plan.wires) {
    assert.deepEqual(w.flows.map(f => f.kind), ['transfer', 'heat']);
    close(w.flows[0].power, w.power - w.heat / 2, 'delivered cable power');
    close(w.flows[1].power, w.heat, 'source pays cable loss');
  }
  const braking = scenario(30, 5, false);
  verifyBalance(braking);
  assert.ok(braking.plan.devices[1].handPower < 0);
  assert.ok(braking.plan.devices[1].mechanicalOut > 0, 'the driven crank gives energy back to the hand');
  assert.ok(braking.plan.wires.every(w => w.flows.some(f => f.kind === 'transfer' && f.from === 1 && f.to === 2)));
});

test('all signed rate and polarity combinations preserve device, cable and scene balances', () => {
  for (const crossed of [false, true]) for (const rateA of [-30, 30]) {
    for (const rateB of [-30, -15, -5, 5, 15, 30]) {
      verifyBalance(scenario(rateA, rateB, crossed));
    }
  }
});
