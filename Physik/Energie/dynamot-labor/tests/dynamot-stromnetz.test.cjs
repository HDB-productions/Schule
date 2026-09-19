const assert = require('node:assert/strict');
const { test } = require('node:test');
const { solveDynamotNetwork: solve } = require('../dynamot-stromnetz.js');
const C = { k: .18, R: 2, lampR: 8, wireR: .05 };
const motor = (id = 1, omega = 20) => ({ id, type: 'motor', omega });
const lamp = (id = 2, lampR = 8) => ({ id, type: 'lamp', lampR });
const wire = (a, ap, b, bp) => ({ a, ap, b, bp });
const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
function balance(devices, wires) {
  const residual = new Map(devices.flatMap(d => [[`${d.id}/0`, d.current], [`${d.id}/1`, -d.current]]));
  for (const w of wires) { residual.set(`${w.a}/${w.ap}`, residual.get(`${w.a}/${w.ap}`) + w.current); residual.set(`${w.b}/${w.bp}`, residual.get(`${w.b}/${w.bp}`) - w.current); }
  for (const value of residual.values()) close(value, 0);
  close([...devices, ...wires].reduce((sum, item) => sum + item.power, 0), 0);
  for (const w of wires) close(w.power, w.current ** 2 * C.wireR);
}

test('generator and lamp: signs, analytic current, KCL and cable losses', () => {
  const d = [motor(), lamp()], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1)]; solve(d, w, C);
  const current = 3.6 / 10.1;
  close(w[0].current, current); close(w[1].current, current); close(d[0].current, -current); close(d[1].current, current);
  close(d[1].voltage, current * 8); assert.ok(d[0].power < 0); assert.ok(d[1].power > 0); balance(d, w);
});
test('one cable/open branch and isolated source have exactly zero flow', () => {
  const d = [motor(), lamp(), motor(3, -10)], w = [wire(1, 0, 2, 0)]; solve(d, w, C);
  for (const item of [...d, ...w]) assert.equal(item.current, 0);
  close(d[0].voltage, 3.6); close(d[2].voltage, -1.8);
});
test('reverse generator speed reverses every current, preserves powers', () => {
  const d = [motor(), lamp()], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1)]; solve(d, w, C);
  const previous = [...d, ...w].map(x => ({ ...x })); d[0].omega *= -1; solve(d, w, C);
  [...d, ...w].forEach((x, i) => { close(x.current, -previous[i].current); close(x.power, previous[i].power); }); balance(d, w);
});
test('cross-connected lamp reverses lamp pin current; cable orientation follows endpoints', () => {
  const d = [motor(), lamp()], w = [wire(1, 0, 2, 1), wire(1, 1, 2, 0)]; solve(d, w, C);
  assert.ok(d[1].current < 0); assert.ok(w[0].current > 0); assert.ok(w[1].current < 0); balance(d, w);
});
test('geometric crossings do not connect separate circuits', () => {
  const d = [motor(1, 20), lamp(2), motor(3, -10), lamp(4)];
  const w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1), wire(3, 0, 4, 0), wire(4, 1, 3, 1)]; solve(d, w, C);
  close(w[0].current, 3.6 / 10.1); close(w[2].current, -1.8 / 10.1); balance(d, w);
});
test('parallel lamps and duplicate parallel cables split deterministically', () => {
  const d = [motor(), lamp(2, 8), lamp(3, 24)];
  const w = [wire(1, 0, 2, 0), wire(1, 0, 2, 0), wire(2, 1, 1, 1), wire(1, 0, 3, 0), wire(3, 1, 1, 1)]; solve(d, w, C);
  close(w[0].current, w[1].current); close(2 * w[0].current, d[1].current);
  close(d[1].current / d[2].current, 24.1 / 8.075); balance(d, w);
  const snapshot = w.map(x => x.current); solve(d, w, C); w.forEach((x, i) => close(x.current, snapshot[i]));
});
test('lamp bypass carries most current, lamp dims with finite cable resistance', () => {
  const d = [motor(), lamp()], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1)]; solve(d, w, C); const before = d[1].power;
  w.push(wire(2, 0, 2, 1)); solve(d, w, C);
  close(w[2].current / d[1].current, 8 / .05); assert.ok(d[1].power < before / 100); assert.ok(d[1].power > 0); balance(d, w);
});
test('same-pin self loop is zero; motor pin-to-pin short is a real load', () => {
  const d = [motor()], w = [wire(1, 0, 1, 0), wire(1, 0, 1, 1)]; solve(d, w, C);
  assert.equal(w[0].current, 0); close(w[1].current, 3.6 / 2.05); close(d[0].current, -w[1].current); balance(d, w);
});
test('zero-speed/pause-safe repeated calls, empty input and invalid cables', () => {
  solve([], [], C); const d = [motor(1, 0), lamp()], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1), wire(999, 0, 1, 0), wire(1, 2, 2, 1)];
  for (let i = 0; i < 4; i++) solve(d, w, C);
  for (const x of [...d, ...w]) for (const key of ['voltage', 'current', 'power']) { assert.ok(Number.isFinite(x[key])); close(x[key], 0); }
});
test('reordering devices and reversing wire storage preserves physical direction', () => {
  const d = [motor(), lamp()], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1)]; solve(d, w, C); const current = w[0].current;
  const reversed = [wire(1, 1, 2, 1), wire(2, 0, 1, 0)]; solve(d.reverse(), reversed, C); close(reversed[0].current, -current); close(reversed[1].current, -current); balance(d, reversed);
});
test('two machines: generator feeds motor; equal emf produces no circulation', () => {
  const d = [motor(1, 20), motor(2, 5)], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1)]; solve(d, w, C);
  close(w[0].current, 2.7 / 4.1); assert.ok(d[1].current > 0); balance(d, w);
  d[1].omega = 20; solve(d, w, C); for (const item of [...d, ...w]) assert.equal(item.current, 0);
});
test('dangling branch on a live network stays exactly dark and current-free', () => {
  const d = [motor(), lamp(), lamp(3)], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1), wire(2, 0, 3, 0)];
  solve(d, w, C); close(w[0].current, 3.6 / 10.1); assert.equal(w[2].current, 0); assert.equal(d[2].current, 0); balance(d, w);
});
test('config and metadata untouched; inline function works without CommonJS', () => {
  const fs = require('node:fs'), vm = require('node:vm');
  const context = vm.createContext({}); vm.runInContext(fs.readFileSync(require.resolve('../dynamot-stromnetz.js'), 'utf8'), context);
  assert.equal(typeof context.solveDynamotNetwork, 'function');
  const settings = Object.freeze({ ...C }), d = [motor(), lamp()], w = [wire(1, 0, 2, 0), wire(2, 1, 1, 1)];
  d[0].angle = 37; w[0].color = 'blue';context.solveDynamotNetwork(d, w, settings);
  assert.equal(d[0].angle, 37); assert.equal(w[0].color, 'blue'); assert.equal(d[0].omega, 20); balance(d, w);
});
