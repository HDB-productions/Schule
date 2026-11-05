const test = require('node:test');
const assert = require('node:assert/strict');
const {generate, variants} = require('../dist/exercise-data.js');
const rng = seed => { seed = Math.imul(seed, 2654435761) >>> 0; return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; }; };
const number = s => Number(s.replace(',', '.'));
const near = (a, b, tol = 1e-7) => assert.ok(Math.abs(a - b) <= tol, `${a} ≈ ${b}`);
const fields = e => e.stages.flatMap(s => s.fields);

test('all variants generate deterministic, finite, self-consistent contracts over 100 seeds', () => {
  for (let step = 1; step <= 6; step++) for (const {value} of variants(step)) {
    const signatures = new Set();
    for (let seed = 1; seed <= 100; seed++) {
      const e = generate(step, rng(seed), value);
      assert.deepEqual(e, generate(step, rng(seed), value));
      assert.equal(e.variant, value);
      assert.ok(e.title && e.intro && e.signature && e.stages.length);
      signatures.add(e.signature);
      for (const s of e.stages) {
        assert.ok(s.title && s.body && s.explanation && s.fields.length);
        assert.equal(new Set(s.fields.map(f => f.id)).size, s.fields.length);
        if (s.table) for (const row of s.table.rows) { assert.equal(row.length, s.table.headers.length); row.forEach(c => assert.equal(typeof c, 'string')); }
        if (s.plot) { assert.ok(s.plot.xMax > (s.plot.xMin || 0)); assert.ok(s.plot.yMax > (s.plot.yMin || 0)); s.plot.points.flat().forEach(x => assert.ok(Number.isFinite(x))); }
        for (const f of s.fields) {
          assert.ok(f.label && f.explanation);
          if (f.type === 'number') { assert.ok(Number.isFinite(f.answer)); assert.ok(f.tolerance > 0); }
          else if (f.type === 'text') { assert.equal(typeof f.answer, 'string'); assert.ok(f.accepted.includes(f.answer)); }
          else {
            const opts = f.options.map(o => o.value);
            assert.equal(new Set(opts).size, opts.length);
            (Array.isArray(f.answer) ? f.answer : [f.answer]).forEach(a => assert.ok(opts.includes(a)));
          }
        }
      }
    }
    assert.ok(signatures.size >= (step === 4 && value === 'proportional' ? 4 : step === 4 && value === 'antiproportional' ? 4 : 8), `${step}/${value}: ${signatures.size} distinct exercises`);
  }
});

test('step 1 means include all cells; exactly two conspicuous values and evidence only in stage 3', () => {
  const badPositions = new Set(), correctPositions = new Set();
  for (let seed = 1; seed <= 250; seed++) {
    const e = generate(1, rng(seed));
    assert.equal(e.stages.length, 3);
    const rows = e.stages[0].table.rows.map(r => r.slice(1).map(number));
    rows.forEach((r, i) => {
      near(e.stages[0].fields[i * 3].answer, Math.round(r.reduce((a, b) => a + b) / 4 * 100) / 100);
      near(e.stages[0].fields[i * 3 + 1].answer, Math.min(...r));
      near(e.stages[0].fields[i * 3 + 2].answer, Math.max(...r));
    });
    const detected = [];
    rows.forEach((row, i) => { const min = Math.min(...row); row.forEach((x, j) => { if (x - min > 1) detected.push(`${'ABC'[i]}${j + 1}`); }); });
    const selected = e.stages[1].fields[0].answer;
    assert.deepEqual([...selected].sort(), detected.sort());
    assert.equal(selected.length, 2);
    assert.notEqual(selected[0][0], selected[1][0], 'anomalies have separate row clusters');
    assert.equal(e.stages[1].fields[0].options.length, 12);
    assert.doesNotMatch(e.stages.slice(0, 2).map(s => s.body).join(' '), /zu spät|kein Problem beobachtet/);
    assert.match(e.stages[2].body, /nachweislich/);
    assert.equal(e.stages[2].fields[0].answer, 'documented');
    correctPositions.add(e.stages[2].fields[0].options.findIndex(o => o.value === 'documented'));
    badPositions.add(e.stages[2].fields[0].options.find(o => o.value === 'documented').label);
  }
  assert.equal(correctPositions.size, 3);
  assert.ok(badPositions.size > 8);
});

test('step 2 offers real measurement table, unique usable scales and physical drawing answers', () => {
  const signatures = new Set();
  for (let seed = 1; seed <= 100; seed++) {
    const e = generate(2, rng(seed)), [setup, drawing] = e.stages, d = setup.diagramSetup;
    signatures.add(e.signature);
    assert.deepEqual(setup.table.headers, ['Nummer', 't in s', 'Mittelwert s in m', 'Minimum s in m', 'Maximum s in m']);
    assert.equal(setup.table.rows.length, 4);
    assert.deepEqual(drawing.table, setup.table);
    assert.deepEqual(drawing.diagramSetup, d);
    assert.equal(drawing.interactivePlot, true);
    const answers = Object.fromEntries(setup.fields.map(f => [f.id, f.answer]));
    assert.deepEqual(answers, {xAxis: 't', yAxis: 's', sx: d.xScale, sy: d.yScale});
    for (const id of ['xAxis', 'yAxis']) assert.deepEqual(setup.fields.find(f => f.id === id).options, [{value: 't', label: 't in s'}, {value: 's', label: 's in m'}]);
    assert.equal(Math.min(...d.xSteps.filter(v => Math.max(...d.points.map(p => p[0])) / v <= 9)), d.xScale);
    assert.equal(Math.min(...d.ySteps.filter(v => Math.max(...d.bars.map(b => b.high)) / v <= 9)), d.yScale);
    assert.equal(drawing.fields.length, 16);
    setup.table.rows.forEach((r, i) => {
      const [num, x, y, low, high] = r.map(number);
      assert.equal(num, i+1);
      assert.deepEqual(d.points[i], [x, y]);
      assert.deepEqual(d.bars[i], {x, low, high});
      assert.ok(x > 0 && low > 0 && low < y && y < high && high <= d.yScale * 8);
      const expected = [[`pointX${i}`, x, d.xScale], [`pointY${i}`, y, d.yScale], [`low${i}`, low, d.yScale], [`high${i}`, high, d.yScale]];
      for (const [id, answer, scale] of expected) {
        const f = drawing.fields.find(f => f.id === id);
        assert.equal(f.answer, answer);
        near(f.tolerance, scale * 0.15);
        assert.equal(Math.round(answer / scale * 2), answer / scale * 2, 'coordinate snaps to half-grid');
      }
    });
  }
  assert.ok(signatures.size > 80);
});

test('step 3 has grouped visible features and only unambiguous data', () => {
  for (const {value} of variants(3)) for (let seed = 1; seed <= 30; seed++) {
    const e=generate(3,rng(seed),value), s=e.stages[0], next=e.stages[1], f=s.fields[0];
    assert.equal(f.type,'multi');
    assert.deepEqual([...new Set(f.options.map(o=>o.group))],['Krümmung','x-Achse','y-Achse','Scheitelpunkt']);
    assert.equal(f.options.length,11);
    assert.equal(next.regressionPreview,true);
    assert.deepEqual(next.fields[0].options.map(o=>o.value),['proportional','linear','quadratisch']);
    assert.equal(next.fields[0].answer,value);
    assert.equal(s.plot.pointsOnly,true);
    assert.doesNotMatch(JSON.stringify(e),/nicht eindeutig entscheidbar|keine sichere Festlegung/);
    const {a,b,c}=s.plot.curve;
    for(const [x,y] of s.plot.points)near(y,value==='quadratisch'?a*x*x+c:a*x+b);
    const hasX=value!=='quadratisch'||c<0;
    assert.equal(f.answer.includes('xIntercept'),hasX);
    assert.equal(f.answer.includes('noXIntercept'),!hasX);
    assert.equal(f.answer.includes('yIntercept'),true);
    assert.ok(!f.options.some(o=>o.value==='xOrigin'));
    assert.equal(f.answer.includes('yNonzero'),value!=='proportional');
    assert.equal(f.options.find(o=>o.value==='yNonzero').dependsOn,'yIntercept');
    assert.equal(f.options.find(o=>o.value==='yOrigin').dependsOn,'yIntercept');
    assert.equal(f.answer.includes('yOrigin'),value==='proportional');
    assert.equal(f.answer.includes('vertex'),value==='quadratisch');
    assert.ok(s.plot.points.some(([x])=>x===0));
    if(hasX)assert.ok(s.plot.points.some(([,y])=>y===0));
    assert.ok(s.plot.xMin<0 && s.plot.xMax>0);
  }
  assert.throws(()=>generate(3,rng(1),'ausschnitt'),RangeError);
});

test('step 4 every arithmetic check and course approximation follows source data', () => {
  for (const {value} of variants(4)) for (let seed = 1; seed <= 50; seed++) {
    const e = generate(4, rng(seed), value), s = e.stages[0];
    const data = s.table.rows.map(r => r.map(number)), xs = data.map(r => r[0]), ys = data.map(r => r[1]);
    const f = Object.fromEntries(fields(e).map(f => [f.id, f.answer]));
    if (value === 'proportional') { data.slice(1).forEach(([x, y], i) => near(f[`q${i}`], y / x)); near(f.a, ys[1] / xs[1]); }
    if (value === 'linear') { assert.deepEqual(xs, [0, 1, 3, 6]); data.slice(1).forEach(([x, y], i) => { near(f[`dx${i}`], x - xs[i]); near(f[`m${i}`], (y - ys[i]) / (x - xs[i])); }); near(f.b, ys[0]); }
    if (value === 'antiproportional') { data.forEach(([x, y], i) => near(f[`p${i}`], x * y)); near(f.a, xs[0] * ys[0]); }
    if (value === 'quadratisch') { const d = ys.slice(1).map((y, i) => y - ys[i]); d.forEach((x, i) => near(f[`d${i}`], x)); d.slice(1).forEach((x, i) => near(f[`dd${i}`], x - d[i])); assert.equal(e.stages.length, 1); }
    if (value === 'exponentiell') { ys.slice(1).forEach((y, i) => near(f[`r${i}`], y / ys[i])); near(f.b, ys[1] / ys[0]); near(f.a, ys[0]); }
  }
});

test('step 5 expected CAS parameters reproduce every datum in requested form', () => {
  let decimalLinear = false, decimalQuadratic = false;
  for (const {value} of variants(5)) for (let seed = 1; seed <= 30; seed++) {
    const e = generate(5, rng(seed), value), f = Object.fromEntries(e.stages[1].fields.map(f => [f.id, f.answer]));
    assert.match(e.intro, /tatsächliches GeoGebra CAS/);
    assert.match(e.stages[1].body, /externen CAS/);
    for (const r of e.stages[0].table.rows) {
      const [x, y] = r.map(number);
      near(y, value === 'quadratisch' ? f.a * x ** 2 + f.b * x + f.c : value === 'antiproportional' ? f.A * x ** f.n : value === 'exponentiell' ? f.A * f.B ** x : f.m * x + f.b);
    }
    if (value === 'proportional') { assert.equal(e.stages[0].fields[0].answer, 'linear'); assert.equal(f.b, 0); }
    if (value === 'antiproportional') { assert.equal(e.stages[0].fields[0].answer, 'potenz'); assert.equal(f.n, -1); }
    if (value === 'linear' && Object.values(f).some(n => !Number.isInteger(n))) decimalLinear = true;
    if (value === 'quadratisch' && Object.values(f).some(n => !Number.isInteger(n))) decimalQuadratic = true;
  }
  assert.ok(decimalLinear && decimalQuadratic);
});

test('practice restricts model selection to the requested three models', () => {
  for (const step of [3, 4, 5, 6]) {
    assert.deepEqual(variants(step).map(v => v.value), ['proportional', 'linear', 'quadratisch']);
    for (const rejected of ['antiproportional', 'exponentiell', 'rundungswirkung']) assert.throws(() => generate(step, rng(1), rejected), RangeError);
  }
});

test('step 6 inline equation fields form physical equations with precise decimal rounding', () => {
  const seen = new Set();
  for (const {value} of variants(6)) for (let seed = 1; seed <= 150; seed++) {
    const e = generate(6, rng(seed), value), s = e.stages[0], equation = s.equation;
    assert.equal(e.stages.length, 1);
    assert.equal(equation.lhs, 'lhs');
    assert.equal(s.fields.find(f => f.id === 'lhs').answer, 's(t)');
    assert.equal(equation.terms.length, {proportional: 1, linear: 2, quadratisch: 3}[value]);
    assert.ok(s.fields.every(f => ['number', 'text'].includes(f.type)));
    assert.doesNotMatch(s.body, /scientific|wissenschaftliche|e3/);
    for (const term of equation.terms) {
      const param = equation.parameters.find(p => p.symbol === term.coefficient), raw = number(param.rawDisplay);
      assert.match(param.rawDisplay, /^-?\d+,\d+$/);
      assert.ok(Math.abs(raw) > 0 && Math.abs(raw) < 10);
      if (Math.abs(raw) < 1) seen.add('small');
      if (raw < 0) seen.add('negative');
      if (Math.abs(raw) > 1) seen.add('aboveone');
      const f = s.fields.find(f => f.id === term.coefficient), unit = s.fields.find(f => f.id === term.unit);
      assert.equal(f.significantDigits, 3);
      assert.equal(f.answer, Number(raw.toPrecision(3)));
      assert.equal(number(f.displayAnswer), f.answer);
      assert.doesNotMatch(f.displayAnswer, /[eE]/);
      assert.equal(f.displayAnswer.replace('-', '').replace(',', '').replace(/^0+/, '').length, 3);
      const place = 10 ** (Math.floor(Math.log10(Math.abs(f.answer))) - 2);
      assert.ok(f.tolerance < place / 10);
      assert.equal(unit.answer, term.power === 2 ? 'm/s²' : term.power === 1 ? 'm/s' : 'm');
      if (term.power) assert.equal(s.fields.find(f => f.id === term.variable).answer, 't');
      else assert.equal(term.variable, undefined);
    }
    assert.ok(number(equation.parameters[0].rawDisplay) > 0);
  }
  assert.equal(seen.size, 3);
});

test('API exported globally and rejects unsupported steps/variants', () => {
  assert.equal(globalThis.MeasurementExercises.generate, generate);
  assert.throws(() => generate(0), RangeError);
  assert.throws(() => generate(4, rng(1), 'unknown'), RangeError);
  assert.deepEqual(variants(99), []);
});
