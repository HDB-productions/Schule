/** Schematic, finite-Joule packet pipeline. No DOM, Three.js or physics mutation. */
(function (root) {
  'use strict';
  const INTERVAL = 1.2, TRAVEL = 1.2, SOURCE_INTERVAL = INTERVAL, STEP = 0.05, EPS = 1e-8;
  const finite = x => Number.isFinite(x) ? x : 0;
  const positive = x => Math.max(0, finite(x));
  const motor = id => 'motor:' + id, weight = id => 'weight:' + id, rotor = id => 'rotor:' + id;
  const stationId = station => Number(station.slice(station.indexOf(':') + 1));

  function create() {
    let lastTime = null, previous = null, topology = null, serial = 0;
    let initialJ = 0, injectedJ = 0, deliveredJ = 0;
    const stocks = new Map(), pending = new Map(), liftCredits = new Map(), kineticCredits = new Map(), reservedLift = new Map(), queues = new Map(), travels = [], batches = [];
    const id = () => ++serial;
    const stockKey = (kind, device) => kind + ':' + device;
    const stockOf = (kind, device) => positive(stocks.get(stockKey(kind, device))?.joules);
    const setStock = (kind, device, value) => {
      const item = stocks.get(stockKey(kind, device));
      if (item) item.joules = positive(value);
    };
    const topologyOf = (plan, state) => JSON.stringify([
      (plan?.devices || []).map(d => [d.id, d.type]),
      (state?.wires || []).map(w => [w.a, w.ap, w.b, w.bp])
    ]);
    const recipeOf = (plan, state) => ({
      devices: (plan?.devices || []).map(d => ({ ...d, weight: state.devices?.find(raw => raw.id === d.id)?.weight === true,
        crank: state.devices?.find(raw => raw.id === d.id)?.crank === true })),
      wires: (plan?.wires || []).map(w => ({ ...w }))
    });
    function reset() {
      lastTime = null; previous = null; topology = null; serial = 0;
      initialJ = injectedJ = deliveredJ = 0;
      stocks.clear(); pending.clear(); liftCredits.clear(); kineticCredits.clear(); reservedLift.clear(); queues.clear(); travels.length = 0; batches.length = 0;
    }
    function initialize(plan, state, time) {
      reset(); lastTime = time; topology = topologyOf(plan, state); previous = recipeOf(plan, state);
      for (const d of plan.devices || []) {
        if (d.type !== 'motor') continue;
        const raw = state.devices?.find(x => x.id === d.id);
        if (raw?.weight) stocks.set(stockKey('potential-stock', d.id), { device: d.id, kind: 'potential-stock', joules: positive(d.potentialJ), mass: positive(raw.mass) });
        stocks.set(stockKey('kinetic-stock', d.id), { device: d.id, kind: 'kinetic-stock', joules: positive(d.kineticJ), mass: positive(raw?.mass) });
      }
      initialJ = [...stocks.values()].reduce((sum, s) => sum + s.joules, 0);
    }
    function travel(kind, form, joules, from, to, device, recipe, extra = {}) {
      if (!(joules > EPS)) return;
      travels.push({ id: id(), kind, form, device, from, to, station: to, wire: extra.wire,
        stage: 'travel', progress: 0, joules, outputIndex: extra.outputIndex, recipe });
    }
    function source(kind, device, joules, recipe) {
      if (!(joules > EPS)) return 0;
      if (kind === 'hand') {
        travel('mechanical-in', 'kinetic', joules, 'hand:' + device, motor(device), device, recipe);
        return joules;
      } else if (kind === 'fall') {
        const amount = Math.min(joules, stockOf('potential-stock', device));
        if (!(amount > EPS)) return 0;
        setStock('potential-stock', device, stockOf('potential-stock', device) - amount);
        enqueueBatch(weight(device), [{ id: id(), kind: 'potential', form: 'potential', device, joules: amount, recipe }]);
        return amount;
      } else if (kind === 'rotor') {
        const amount = Math.min(joules, stockOf('kinetic-stock', device));
        if (!(amount > EPS)) return 0;
        setStock('kinetic-stock', device, stockOf('kinetic-stock', device) - amount);
        travel('kinetic', 'kinetic', amount, rotor(device), motor(device), device, recipe);
        return amount;
      }
      return 0;
    }
    function pendingSource(kind, device, amount, dt, recipe, stop) {
      const key = kind + ':' + device;
      let p = pending.get(key);
      if (!p) { p = { kind, device, joules: 0, age: 0, recipe }; pending.set(key, p); }
      if (p.joules <= EPS && amount > EPS) p.recipe = recipe;
      p.joules += positive(amount);
      if (amount > EPS || p.joules > EPS) p.age += dt;
      if (p.joules > EPS && (p.age >= SOURCE_INTERVAL - EPS || stop)) {
        const emitted = source(kind, device, p.joules, p.recipe);
        p.joules = Math.max(0, p.joules - emitted);
        p.age = p.joules > EPS ? SOURCE_INTERVAL : 0;
      }
    }
    function outputsFor(station, input) {
      const recipe = input.recipe || { devices: [], wires: [] }, device = stationId(station);
      if (station.startsWith('weight:')) {
        if (input.kind === 'potential') return [{ kind: 'fall', form: 'kinetic', to: motor(device), weight: 1 }];
        if (input.kind === 'lift') return [{ kind: 'potential', form: 'potential', to: weight(device), store: 'potential-stock', weight: 1 }];
      }
      if (station.startsWith('lamp:')) {
        const d = recipe.devices.find(x => x.id === device), light = positive(d?.light), heat = positive(d?.heat);
        return [{ kind: 'light', form: 'light', to: 'environment:' + device, weight: light },
          { kind: 'heat', form: 'thermal', to: 'environment:' + device, weight: heat }];
      }
      if (!station.startsWith('motor:')) return [{ kind: 'heat', form: 'thermal', to: 'environment:' + device, weight: 1 }];
      const d = recipe.devices.find(x => x.id === device);
      if (!d) return [{ kind: 'heat', form: 'thermal', to: 'environment:' + device, weight: 1 }];
      const out = [], wires = recipe.wires.filter(w => w.from === device && w.power > EPS);
      const wireSum = wires.reduce((sum, w) => sum + w.power, 0);
      for (const w of wires) {
        const receiver = recipe.devices.find(x => x.id === w.to);
        if (!receiver) continue;
        out.push({ kind: 'electrical', form: 'electrical', to: receiver.type + ':' + receiver.id,
          wire: w.index, weight: positive(d.electricalOut) * w.power / wireSum });
      }
      out.push({ kind: 'heat', form: 'thermal', to: 'environment:' + device, weight: positive(d.heat) });
      if (d.weight && d.mechanicalOut > EPS) out.push({ kind: 'lift', form: 'kinetic', to: weight(device), weight: d.mechanicalOut });
      else if (d.crank && d.mechanicalOut > EPS) out.push({ kind: 'mechanical-out', form: 'kinetic', to: 'hand:' + device, weight: d.mechanicalOut });
      if (d.kineticPower > EPS) out.push({ kind: 'kinetic', form: 'kinetic', to: rotor(device), store: 'kinetic-stock', weight: d.kineticPower });
      return out;
    }
    function enqueueBatch(station, inputs) {
      if (batches.some(b => b.station === station)) {
        const waiting = queues.get(station) || [];
        waiting.push(...inputs); queues.set(station, waiting);
      } else makeBatch(station, inputs);
    }
    function makeBatch(station, inputs) {
      if (!inputs.length) return;
      const output = [];
      for (const input of inputs) {
        let choices = outputsFor(station, input).filter(x => x.weight > EPS);
        if (!choices.length) choices = [{ kind: 'heat', form: 'thermal', to: 'environment:' + stationId(station), weight: 1 }];
        const total = choices.reduce((sum, x) => sum + x.weight, 0);
        let excessStoreJ = 0;
        for (const choice of choices) {
          let amount = input.joules * choice.weight / total;
          if (choice.kind === 'lift') {
            const target = stationId(choice.to), mass = positive(stocks.get(stockKey('potential-stock', target))?.mass);
            const capacity = mass * 9.81 * 1.5;
            const room = Math.max(0, capacity - stockOf('potential-stock', target) - positive(reservedLift.get(target)));
            const credit = positive(liftCredits.get(target));
            const allowed = Math.min(amount, room, credit);
            excessStoreJ += amount - allowed; amount = allowed;
            liftCredits.set(target, Math.max(0, credit - allowed));
            reservedLift.set(target, positive(reservedLift.get(target)) + amount);
          } else if (choice.store === 'kinetic-stock') {
            const device = stationId(station), credit = positive(kineticCredits.get(device));
            const allowed = Math.min(amount, credit);
            excessStoreJ += amount - allowed; amount = allowed;
            kineticCredits.set(device, Math.max(0, credit - allowed));
          }
          if (amount > EPS) output.push({ ...choice, joules: amount, recipe: input.recipe, input: input.id });
        }
        if (excessStoreJ > EPS) {
          const alternatives = choices.filter(x => x.kind !== 'lift' && !x.store && x.weight > EPS);
          const alternativesTotal = alternatives.reduce((sum, x) => sum + x.weight, 0);
          if (alternativesTotal > EPS) for (const choice of alternatives) {
            const existing = output.find(o => o.input === input.id && o.kind === choice.kind && o.to === choice.to && o.wire === choice.wire);
            if (existing) existing.joules += excessStoreJ * choice.weight / alternativesTotal;
            else output.push({ ...choice, joules: excessStoreJ * choice.weight / alternativesTotal, recipe: input.recipe, input: input.id });
          } else {
            // A physically impossible isolated recipe remains visible until credit arrives.
            const waiting = queues.get(station) || [];
            waiting.push({ ...input, id: id(), joules: excessStoreJ }); queues.set(station, waiting);
            input.joules -= excessStoreJ;
          }
        }
      }
      batches.push({ id: id(), station, inputs, output, progress: 0 });
    }
    function advance(dt, recipe, actual) {
      const complete = [];
      for (const b of batches) {
        const old = b.progress; b.progress = Math.min(1, old + dt / INTERVAL);
        const fraction = b.progress - old;
        for (const o of b.output) if (o.store) {
          const device = stationId(o.to), wanted = o.joules * fraction;
          const limit = o.store === 'potential-stock' ?
            positive(stocks.get(stockKey('potential-stock', device))?.mass) * 9.81 * 1.5 : Infinity;
          const added = Math.min(wanted, Math.max(0, limit - stockOf(o.store, device)));
          setStock(o.store, device, stockOf(o.store, device) + added);
          if (o.store === 'potential-stock') reservedLift.set(device, Math.max(0, positive(reservedLift.get(device)) - wanted));
          // Capacity was reserved at motor conversion; only a topology/reset can
          // invalidate that reservation, and those clear the whole pipeline.
          if (o.store === 'potential-stock' && wanted - added > 1e-6) throw new RangeError('Weight packet reservation exceeded capacity');
          o.appliedJ = positive(o.appliedJ) + added;
        }
        if (b.progress >= 1 - EPS) complete.push(b);
      }
      for (const b of complete) {
        batches.splice(batches.indexOf(b), 1);
        b.output.forEach((o, outputIndex) => {
          if (o.store) return;
          travel(o.kind, o.form, o.joules, b.station, o.to, stationId(b.station), o.recipe,
            { wire: o.wire, outputIndex });
        });
        const waiting = queues.get(b.station);
        if (waiting?.length) { queues.delete(b.station); makeBatch(b.station, waiting); }
      }
      const arrivals = new Map();
      for (const p of [...travels]) {
        p.progress = Math.min(1, p.progress + dt / TRAVEL);
        if (p.progress < 1 - EPS) continue;
        travels.splice(travels.indexOf(p), 1);
        if (p.to.startsWith('environment:') || p.to.startsWith('hand:')) { deliveredJ += p.joules; continue; }
        const list = arrivals.get(p.to) || [];
        list.push({ id: p.id, kind: p.kind, form: p.form, device: stationId(p.to), joules: p.joules, recipe: p.recipe });
        arrivals.set(p.to, list);
      }
      for (const [station, inputs] of arrivals) enqueueBatch(station, inputs);
    }
    function snapshot() {
      const packets = travels.map(p => ({ id: p.id, kind: p.kind, form: p.form, device: p.device,
        from: p.from, to: p.to, wire: p.wire, station: p.station, stage: 'travel',
        progress: p.progress, joules: p.joules, outputIndex: p.outputIndex }));
      for (const b of batches) {
        b.inputs.forEach(p => packets.push({ id: p.id, kind: p.kind, form: p.form, device: p.device,
          station: b.station, stage: 'input', progress: b.progress, joules: p.joules * (1 - b.progress) }));
        b.output.forEach((o, outputIndex) => packets.push({ id: b.id + ':' + outputIndex, kind: o.kind,
          form: o.form, device: stationId(b.station), from: b.station, to: o.to, wire: o.wire,
          station: b.station, stage: 'output', progress: b.progress,
          joules: o.store ? positive(o.appliedJ) : o.joules * b.progress,
          outputIndex, store: !!o.store }));
      }
      for (const [station, waiting] of queues) for (const p of waiting) packets.push({
        id: p.id, kind: p.kind, form: p.form, device: p.device,
        station, stage: 'input', waiting: true, progress: 0, joules: p.joules
      });
      const visibleStocks = [...stocks.values()].map(s => ({ ...s }));
      const storedJ = visibleStocks.reduce((sum, s) => sum + s.joules, 0);
      const pendingJ = [...pending.values()].filter(p => p.kind === 'hand').reduce((sum, p) => sum + p.joules, 0) +
        [...queues.values()].flat().reduce((sum, p) => sum + p.joules, 0);
      const activeJ = travels.reduce((sum, p) => sum + p.joules, 0) + batches.reduce((sum, b) =>
        sum + b.inputs.reduce((n, p) => n + p.joules * (1 - b.progress), 0) +
        b.output.reduce((n, o) => n + (o.store ? 0 : o.joules * b.progress), 0), 0);
      const ledger = { initialJ, injectedJ, storedJ, pendingJ, activeJ, deliveredJ,
        balanceJ: initialJ + injectedJ - storedJ - pendingJ - activeJ - deliveredJ };
      return { packets, stocks: visibleStocks, ledger };
    }
    function update(plan, state) {
      const time = positive(state?.simulationTime);
      if (!plan || !state || !Array.isArray(plan.devices) || !Array.isArray(state.devices)) return snapshot();
      const current = recipeOf(plan, state), fingerprint = topologyOf(plan, state);
      if (lastTime === null || time < lastTime - EPS || topology !== fingerprint) {
        initialize(plan, state, time); return snapshot();
      }
      const dt = time - lastTime;
      if (dt <= EPS) {
        // A manual raise/reposition occurs without simulation time advancing.
        if (current.devices.some(d => {
          const old = previous.devices.find(p => p.id === d.id);
          return old && (Math.abs(d.potentialJ - old.potentialJ) > EPS || Math.abs(d.kineticJ - old.kineticJ) > EPS);
        })) { initialize(plan, state, time); }
        return snapshot();
      }
      const steps = Math.ceil(dt / STEP), step = dt / steps;
      for (let i = 1; i <= steps; i++) {
        const a = (i - 1) / steps, b = i / steps;
        for (const d of current.devices) {
          if (d.type !== 'motor') continue;
          const old = previous.devices.find(p => p.id === d.id) || d;
          const handA = positive(old.handPower + (d.handPower - old.handPower) * a);
          const handB = positive(old.handPower + (d.handPower - old.handPower) * b);
          const handJ = (handA + handB) * step / 2;
          injectedJ += handJ;
          const fallJ = Math.max(0, (old.potentialJ - d.potentialJ) / steps);
          const liftJ = Math.max(0, (d.potentialJ - old.potentialJ) / steps);
          const rotorJ = Math.max(0, (old.kineticJ - d.kineticJ) / steps);
          const kineticGainJ = Math.max(0, (d.kineticJ - old.kineticJ) / steps);
          if (d.weight && liftJ > EPS) liftCredits.set(d.id, positive(liftCredits.get(d.id)) + liftJ);
          if (kineticGainJ > EPS) kineticCredits.set(d.id, positive(kineticCredits.get(d.id)) + kineticGainJ);
          pendingSource('hand', d.id, handJ, step, current, i === steps && d.handPower <= EPS);
          if (d.weight) pendingSource('fall', d.id, fallJ, step, current, i === steps && d.gravityPower <= EPS);
          pendingSource('rotor', d.id, rotorJ, step, current, i === steps && d.kineticPower >= -EPS);
        }
        advance(step, current, current);
      }
      lastTime = time; previous = current;
      return snapshot();
    }
    return Object.freeze({ update, reset });
  }

  const API = Object.freeze({ create, INTERVAL, TRAVEL, SOURCE_INTERVAL });
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.DynamotEnergyBuffers = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
