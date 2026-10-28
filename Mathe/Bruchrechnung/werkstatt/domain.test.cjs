'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const D = require('./domain.js');
const R = require('./reduce-domain.js');

// Frozen pre-extension data: index determines the published task identifier.
const originalReductions = {
  1: [[2,4,2],[3,6,3],[4,8,4],[3,9,3],[4,10,2],[4,12,4],[6,14,2],[6,15,3],[6,16,2],[4,6,2],[6,8,2],[6,9,3],[6,10,2],[8,12,4],[8,14,2],[9,15,3],[10,16,2],[2,6,2],[2,8,2],[2,10,2],[3,12,3],[4,14,2],[3,15,3],[4,16,4],[8,10,2],[9,12,3],[10,14,2],[12,15,3],[12,16,4],[2,12,2],[2,14,2],[2,16,2]],
  2: [[6,12,6],[7,14,7],[6,15,3],[8,16,8],[9,18,9],[10,20,10],[9,21,3],[11,22,11],[12,24,12],[10,25,5],[13,26,13],[12,27,3],[14,28,14],[15,30,15],[16,32,16],[15,33,3],[17,34,17],[15,35,5],[18,36,18],[8,12,4],[9,15,3],[12,16,4],[12,18,6],[12,20,4],[12,21,3],[15,24,3],[15,25,5],[15,27,3],[16,28,4],[18,30,6],[20,32,4],[18,33,3]]
};

const answer = step => Object.fromEntries(step.fields.map(field => [field.key, field.value]));
const signature = task => JSON.stringify(Object.fromEntries(Object.entries(task).filter(([key]) => key !== 'id')));
const all = ['reduce', 'expand', 'operate'].flatMap(kind => [1, 2].flatMap(level => D.tasks(kind, level)));

test('ggT and kgV handle zeros, signs, coprime values, and invalid integers', () => {
  assert.equal(D.gcd(18, 24), 6);
  assert.equal(D.gcd(-18, 24), 6);
  assert.equal(D.gcd(0, 9), 9);
  assert.equal(D.gcd(0, 0), 0);
  assert.equal(D.gcd(5, 7), 1);
  assert.equal(D.lcm(6, 8), 24);
  assert.equal(D.lcm(-3, 4), 12);
  assert.equal(D.lcm(0, 9), 0);
  for (const invalid of [NaN, Infinity, 1.5, '4', null, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => D.gcd(invalid, 6), RangeError);
    assert.throws(() => D.lcm(6, invalid), RangeError);
  }
  assert.throws(() => D.lcm(Number.MAX_SAFE_INTEGER, 2), RangeError);
});

for (const kind of ['reduce', 'expand', 'operate']) {
  for (const level of [1, 2]) {
    test(`${kind}, level ${level}: deterministic, varied, unique, isolated canonical pool`, () => {
      const tasks = D.tasks(kind, level);
      assert.ok(tasks.length >= 20);
      assert.deepEqual(tasks, D.tasks(kind, level));
      assert.equal(new Set(tasks.map(task => task.id)).size, tasks.length);
      assert.equal(new Set(tasks.map(signature)).size, tasks.length);
      assert.ok(new Set(tasks.map(task => task.d)).size >= 4);
      assert.ok(new Set(tasks.map(task => task.n)).size >= 3);
      for (const task of tasks) {
        assert.equal(task.kind, kind);
        assert.equal(task.level, level);
        assert.equal(D.validTask(task), true);
        assert.ok(task.n > 0 && task.n < task.d);
        assert.ok(Number.isSafeInteger(task.n) && Number.isSafeInteger(task.d));
      }
      tasks[0].n = -1;
      tasks.push({ id: 'invented' });
      assert.equal(D.validTask(tasks[0]), false);
      assert.ok(D.tasks(kind, level)[0].n > 0);
      assert.equal(D.tasks(kind, level).length, tasks.length - 1);
    });
  }
}

test('task identifiers are globally unique and invalid pool queries are empty', () => {
  assert.equal(new Set(all.map(task => task.id)).size, all.length);
  for (const [kind, level] of [['unknown', 1], ['reduce', 0], ['expand', 3], ['operate', '1'], [null, 1]]) {
    assert.deepEqual(D.tasks(kind, level), []);
  }
});

test('every reduction uses the greatest common divisor and preserves the exact value', () => {
  for (const task of all.filter(task => task.kind === 'reduce')) {
    const steps = D.steps(task);
    assert.equal(steps.length, 3);
    const divisor = D.gcd(task.n, task.d);
    assert.equal(task.factor, divisor);
    assert.ok(divisor > 1);
    assert.ok(task.d <= (task.level === 1 ? 48 : 96));
    if (Number(task.id.split('-').at(-1)) <= 32) {
      if (task.level === 1) assert.ok(task.d <= 16 && divisor <= 4);
      else assert.ok(task.d >= 12 && task.d <= 36 && divisor >= 3);
    }
    assert.deepEqual(answer(steps[0]), { factor: divisor });
    assert.deepEqual(answer(steps[1]), { n: task.n / divisor, d: task.d / divisor });
    const reduced = answer(steps[1]);
    assert.equal(reduced.n * task.d, task.n * reduced.d);
    assert.equal(D.gcd(reduced.n, reduced.d), 1);
    assert.deepEqual(answer(steps[2]), { same: 1 });
  }
});

test('reduction extension preserves the original canonical prefix and adds composite divisors without duplicates', () => {
  for (const level of [1, 2]) {
    const pool = D.tasks('reduce', level);
    const original = originalReductions[level].map(([n, d, factor], index) => ({
      id: `reduce-${level}-${index + 1}`, kind: 'reduce', level, n, d, factor
    }));
    assert.deepEqual(pool.slice(0, 32), original);
    original.forEach(task => assert.equal(D.validTask(task), true));
    assert.equal(new Set(pool.map(task => `${task.n}/${task.d}`)).size, pool.length);
    const added = pool.slice(32);
    const bases = level === 1 ? [[1,2],[1,3],[2,3],[3,4]] : [[2,5],[3,5],[4,5],[5,6],[5,7],[7,8]];
    for (const factor of [4, 6, 8, 9, 10, 12]) {
      assert.ok(added.some(task => task.factor === factor), `level ${level}, new divisor ${factor}`);
      for (const [n, d] of bases) {
        assert.ok(pool.some(task => task.n === n * factor && task.d === d * factor && task.factor === factor));
      }
    }
    for (const task of added) {
      assert.ok([4,6,8,9,10,12].includes(task.factor));
      assert.ok(task.d <= (level === 1 ? 48 : 96));
      // Choose a proper divisor first; every new task must support a second round.
      const first = task.factor % 2 === 0 ? 2 : 3;
      const active = R.fresh(task);
      assert.equal(R.check(active, { factor: String(first) }).correct, true);
      assert.equal(R.check(active, { n: String(task.n / first), d: String(task.d / first) }).correct, true);
      assert.equal(R.check(active, { again: 'yes' }).correct, true);
      assert.equal(active.rounds.length, 2);
      const remaining = task.factor / first;
      assert.equal(R.check(active, { factor: String(remaining) }).correct, true);
      assert.equal(R.check(active, { n: String(task.n / task.factor), d: String(task.d / task.factor) }).correct, true);
      assert.equal(R.check(active, { again: 'no' }).completed, true);
      assert.equal(R.validActive(active), true);
    }
  }
});

test('every expansion meets the target denominator and preserves the exact value', () => {
  for (const task of all.filter(task => task.kind === 'expand')) {
    const steps = D.steps(task);
    assert.equal(steps.length, 3);
    assert.ok(task.target <= 36);
    assert.ok(task.factor > 1);
    assert.equal(task.factor * task.d, task.target);
    if (task.level === 1) assert.ok(task.factor <= 3 && task.d <= 8);
    else assert.ok(task.factor >= 3);
    assert.deepEqual(answer(steps[0]), { factor: task.factor });
    assert.deepEqual(answer(steps[1]), { n: task.n * task.factor, d: task.target });
    const expanded = answer(steps[1]);
    assert.equal(expanded.n * task.d, task.n * expanded.d);
    assert.deepEqual(answer(steps[2]), { same: 1 });
  }
});

test('every operation follows exact kgV arithmetic, has nonnegative result, and reduces fully', () => {
  for (const task of all.filter(task => task.kind === 'operate')) {
    const steps = D.steps(task);
    assert.equal(steps.length, 4);
    assert.ok(task.bn > 0 && task.bn < task.bd);
    assert.ok(['+', '-'].includes(task.op));
    const common = D.lcm(task.d, task.bd);
    assert.ok(common <= 24);
    if (task.level === 1) assert.equal(Math.max(task.d, task.bd) % Math.min(task.d, task.bd), 0);
    else assert.notEqual(Math.max(task.d, task.bd) % Math.min(task.d, task.bd), 0);
    const left = task.n * common / task.d;
    const right = task.bn * common / task.bd;
    const raw = task.op === '+' ? left + right : left - right;
    assert.ok(raw >= 0 && raw <= 2 * common);
    assert.deepEqual(answer(steps[0]), { common });
    assert.deepEqual(answer(steps[1]), { left, right });
    assert.deepEqual(answer(steps[2]), { n: raw, d: common });
    const final = answer(steps[3]);
    assert.equal(D.gcd(final.n, final.d), 1);
    assert.ok(final.d > 0);
    assert.equal(final.n * common, raw * final.d);
  }
  for (const level of [1, 2]) {
    const pool = D.tasks('operate', level);
    assert.equal(pool.filter(task => task.op === '+').length, pool.filter(task => task.op === '-').length);
  }
  assert.ok(D.tasks('operate', 2).some(task => D.gcd(task.d, task.bd) === 1));
  assert.ok(D.tasks('operate', 2).some(task => D.gcd(task.d, task.bd) > 1));
});

test('known concrete examples have the intended answers', () => {
  const reduce = D.tasks('reduce', 2).find(task => task.n === 6 && task.d === 12);
  assert.ok(reduce);
  assert.deepEqual(D.steps(reduce).map(answer), [{ factor: 6 }, { n: 1, d: 2 }, { same: 1 }]);
  const expand = D.tasks('expand', 1).find(task => task.n === 1 && task.d === 2 && task.target === 6);
  assert.ok(expand);
  assert.deepEqual(D.steps(expand).map(answer), [{ factor: 3 }, { n: 3, d: 6 }, { same: 1 }]);
  const operate = D.tasks('operate', 1).find(task => task.n === 1 && task.d === 2 && task.bn === 1 && task.bd === 4 && task.op === '+');
  assert.ok(operate);
  assert.deepEqual(D.steps(operate).map(answer), [{ common: 4 }, { left: 2, right: 1 }, { n: 3, d: 4 }, { n: 3, d: 4 }]);
});

test('first hints give complete, mathematically correct divisor and multiple lists', () => {
  for (const task of all.filter(task => task.kind === 'reduce')) {
    const lists = Array.from(D.steps(task)[0].hint.matchAll(/Teiler von (\d+): ([\d, ]+)\./g));
    assert.equal(lists.length, 2);
    assert.deepEqual(lists.map(match => Number(match[1])), [task.n, task.d]);
    for (const [, number, values] of lists) {
      const divisors = values.split(', ').map(Number);
      const expected = [];
      for (let candidate = 1; candidate <= Number(number); candidate++) {
        if (Number(number) % candidate === 0) expected.push(candidate);
      }
      assert.deepEqual(divisors, expected);
    }
  }
  for (const task of all.filter(task => task.kind === 'operate')) {
    const lists = Array.from(D.steps(task)[0].hint.matchAll(/Vielfache von (\d+): ([\d, ]+)\./g));
    assert.equal(lists.length, 2);
    assert.deepEqual(lists.map(match => Number(match[1])), [task.d, task.bd]);
    const common = D.lcm(task.d, task.bd);
    for (const [, number, values] of lists) {
      const multiples = values.split(', ').map(Number);
      assert.equal(multiples.length, common / Number(number));
      multiples.forEach((value, index) => assert.equal(value, Number(number) * (index + 1)));
      assert.equal(multiples.at(-1), common);
    }
  }
});

test('forged, incomplete, extra-field and wrong-type task data is rejected', () => {
  for (const task of all) {
    for (const key of Object.keys(task)) {
      const incomplete = { ...task };
      delete incomplete[key];
      assert.equal(D.validTask(incomplete), false);
      const altered = { ...task, [key]: typeof task[key] === 'number' ? task[key] + 1 : `${task[key]}!` };
      assert.equal(D.validTask(altered), false);
      assert.throws(() => D.steps(altered), RangeError);
    }
    assert.equal(D.validTask({ ...task, extra: true }), false);
    assert.equal(D.validTask({ ...task, n: String(task.n) }), false);
  }
  for (const bad of [undefined, null, [], 1, 'reduce', {}, Object.create(all[0])]) {
    assert.equal(D.validTask(bad), false);
    assert.throws(() => D.steps(bad), RangeError);
  }
});

test('step objects contain integer answers, unique field keys, plain German text, and fresh data', () => {
  for (const task of all) {
    const steps = D.steps(task);
    for (const step of steps) {
      for (const key of ['title', 'text', 'hint', 'explanation']) {
        assert.equal(typeof step[key], 'string');
        assert.ok(step[key].length > 0);
        assert.doesNotMatch(step[key], /<[^>]*>/);
      }
      assert.ok(step.fields.length > 0);
      assert.equal(new Set(step.fields.map(field => field.key)).size, step.fields.length);
      step.fields.forEach(field => {
        assert.equal(typeof field.label, 'string');
        assert.ok(Number.isSafeInteger(field.value));
      });
    }
    steps[0].fields[0].value = -999;
    assert.notEqual(D.steps(task)[0].fields[0].value, -999);
  }
});

test('the file exposes a browser lexical constant without CommonJS or dependencies', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('./domain.js'), 'utf8'), context);
  assert.equal(vm.runInContext('FractionDomain.tasks("reduce", 1).length', context), D.tasks('reduce', 1).length);
  assert.equal(vm.runInContext('FractionDomain.gcd(8, 12)', context), 4);
});
