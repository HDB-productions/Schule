/**
 * Pure, schematic energy-flow plan for the DynaMot laboratory.
 * Powers are W and stored energies are J. The electrical packets show energy
 * delivery, not charge/electron motion: both cables of a simple circuit carry
 * packets from the generator to the receiver. Cable direction is therefore a
 * visual routing convention, independent of pin polarity and current sign.
 */
(function (root) {
  'use strict';

  const MODEL = Object.freeze({ k: 0.18, R: 2, J: 0.012, friction: 0.03, drag: 0.012, r: 0.02, g: 9.81 });
  // Illustrative classroom split, not a measured efficiency of this lamp.
  const LIGHT_FRACTION = 0.10;
  const COLORS = Object.freeze({ electrical: 0x65b9ff, mechanical: 0x6cd1a0, potential: 0xbc97eb, kinetic: 0x6cd1a0, heat: 0xf27770, light: 0xffe45d });
  // Twenty height slices cover the full 1.5 m weight travel. Their joule size
  // depends on mass, so a heavier weight has visibly larger equal-height slices.
  const WEIGHT_STOCK_SLICES = 20;
  const WEIGHT_TRAVEL_SECONDS = 0.85;
  const EPS = 1e-8;
  const finite = value => Number.isFinite(value) ? value : 0;
  const positive = value => Math.max(0, finite(value));

  function weightStockPackets(joules, mass) {
    const quantumJ = positive(mass) * MODEL.g * 1.5 / WEIGHT_STOCK_SLICES;
    if (!(quantumJ > EPS)) return [];
    const stockJ = positive(joules), count = Math.ceil((stockJ - EPS) / quantumJ);
    return Array.from({ length: Math.min(WEIGHT_STOCK_SLICES, count) }, (_, index) => ({
      index, joules: Math.min(quantumJ, Math.max(0, stockJ - index * quantumJ))
    }));
  }

  function createWeightPacketTracker() {
    const tracks = new Map();
    function update(device, mass, time, running = true, releaseLift = null) {
      const id = device.id, joules = positive(device.potentialJ), m = positive(mass);
      const now = positive(time), quantumJ = m * MODEL.g * 1.5 / WEIGHT_STOCK_SLICES;
      let track = tracks.get(id);
      if (!track || track.mass !== m || now < track.time - EPS) {
        track = { mass: m, time: now, joules, pendingJ: 0, direction: null, inFlight: [], nextId: 0, deliveredJ: 0 };
        tracks.set(id, track);
      } else {
        const dt = Math.max(0, now - track.time), delta = joules - track.joules;
        const motion = finite(device.gravityPower);
        const direction = delta < -EPS && motion > EPS ? 'fall' : delta > EPS && motion < -EPS ? 'lift' : null;
        if (!running || dt <= EPS) {
          // A height edit while time is stopped is a new stock, not a transfer.
          if (Math.abs(delta) > EPS) {
            track.pendingJ = 0; track.inFlight = []; track.direction = null; track.deliveredJ = 0;
          }
        } else if (!direction && Math.abs(delta) > EPS) {
          // Reset/reposition or an incompatible state must never invent packets.
          track.pendingJ = 0; track.inFlight = []; track.direction = null; track.deliveredJ = 0;
        } else if (Math.abs(motion) <= EPS) {
          // At a physical stop, outstanding packets have reached their destination.
          if (track.direction === 'fall') track.deliveredJ += track.pendingJ + track.inFlight.reduce((sum, p) => sum + p.joules, 0);
          track.pendingJ = 0; track.inFlight = []; track.direction = null;
        } else {
          const nextDirection = direction || (motion > 0 ? 'fall' : 'lift');
          if (track.direction && track.direction !== nextDirection) {
            track.pendingJ = 0; track.inFlight = []; track.deliveredJ = 0;
          }
          track.direction = nextDirection;
          for (const packet of track.inFlight) packet.progress += dt / WEIGHT_TRAVEL_SECONDS;
          const arrived = track.inFlight.filter(p => p.progress >= 1);
          if (track.direction === 'fall') track.deliveredJ += arrived.reduce((sum, p) => sum + p.joules, 0);
          track.inFlight = track.inFlight.filter(p => p.progress < 1);
          track.pendingJ += Math.abs(delta);
          if (track.direction === 'lift' && releaseLift !== null) {
            if (releaseLift && track.pendingJ > EPS) {
              track.inFlight.push({ id: track.nextId++, direction: track.direction, joules: track.pendingJ, progress: 0, electricalArrival: true });
              track.pendingJ = 0;
            }
          } else while (quantumJ > EPS && track.pendingJ >= quantumJ - EPS) {
            track.inFlight.push({ id: track.nextId++, direction: track.direction, joules: quantumJ, progress: 0 });
            track.pendingJ = Math.max(0, track.pendingJ - quantumJ);
          }
        }
        track.time = now;
        track.joules = joules;
      }
      const inFlightJ = track.inFlight.reduce((sum, p) => sum + p.joules, 0);
      const stockJ = track.direction === 'lift' ? Math.max(0, joules - track.pendingJ - inFlightJ) : joules;
      const transit = track.inFlight.map(p => ({ ...p }));
      if (track.pendingJ > EPS && track.direction && !(track.direction === 'lift' && releaseLift !== null)) transit.push({ id: 'pending', direction: track.direction, joules: track.pendingJ, progress: 0, partial: true });
      return { stockJ, stock: weightStockPackets(stockJ, m), transit, pendingJ: track.pendingJ, inFlightJ, deliveredJ: track.deliveredJ, quantumJ, direction: track.direction };
    }
    return { update, reset() { tracks.clear(); } };
  }

  function devicePlan(d) {
    const omega = finite(d.omega);
    const current = finite(d.current);
    const terminalPower = finite(d.power);
    const weight = d.type === 'motor' && d.weight === true;
    const mass = weight ? positive(d.mass) : 0;
    const potentialJ = mass * MODEL.g * positive(d.height);
    const kineticJ = d.type === 'motor' ? 0.5 * (MODEL.J + mass * MODEL.r * MODEL.r) * omega * omega : 0;
    const result = {
      id: d.id, type: d.type, potentialJ, kineticJ,
      mechanicalIn: 0, mechanicalOut: 0,
      electricalIn: positive(terminalPower), electricalOut: positive(-terminalPower),
      heat: 0, light: 0, handPower: 0, gravityPower: 0,
      electromagneticPower: 0, copperHeat: 0, frictionHeat: 0, kineticPower: 0
    };
    if (d.type === 'lamp') {
      // The model only solves electrical heating; this visual split is illustrative.
      result.light = result.electricalIn * LIGHT_FRACTION;
      result.heat = result.electricalIn - result.light;
      return result;
    }
    if (d.type !== 'motor') return result;

    const handPower = d.crank && d.hand ? finite(d.handTorque) * omega : 0;
    // h_dot = r * omega, so a descending weight (omega < 0) releases energy.
    const gravityPower = weight ? -mass * MODEL.g * MODEL.r * omega : 0;
    const electromagneticPower = MODEL.k * omega * current;
    const copperHeat = MODEL.R * current * current;
    const frictionHeat = omega === 0 ? 0 : MODEL.friction * Math.abs(omega) + MODEL.drag * omega * omega;
    result.handPower = handPower;
    result.gravityPower = gravityPower;
    result.mechanicalIn = positive(handPower) + positive(gravityPower);
    result.mechanicalOut = positive(-handPower) + positive(-gravityPower);
    result.electromagneticPower = electromagneticPower;
    result.copperHeat = copperHeat;
    result.frictionHeat = frictionHeat;
    result.heat = copperHeat + frictionHeat;
    // Signed instantaneous change in rotational energy. This may differ slightly
    // from a finite-step derivative because the circuit is resolved after the step.
    result.kineticPower = handPower + gravityPower + electromagneticPower - frictionHeat;
    return result;
  }

  function solveRouting(nodes, edges, injections) {
    // A graph of devices (not electrical pins) routes visual packets. Edge weights
    // follow solved cable-current magnitudes, so parallel cables divide the flow.
    const adjacency = nodes.map(() => []);
    edges.forEach((edge, i) => {
      if (edge.weight <= EPS || edge.a === edge.b) return;
      adjacency[edge.a].push(i);
      adjacency[edge.b].push(i);
    });
    const potentials = Array(nodes.length).fill(0);
    const seen = new Set();
    for (let start = 0; start < nodes.length; start++) {
      if (seen.has(start)) continue;
      const component = [start];
      seen.add(start);
      for (let at = 0; at < component.length; at++) {
        const node = component[at];
        for (const edgeId of adjacency[node]) {
          const edge = edges[edgeId];
          const next = edge.a === node ? edge.b : edge.a;
          if (!seen.has(next)) { seen.add(next); component.push(next); }
        }
      }
      if (component.length < 2) continue;
      const index = new Map(component.slice(1).map((node, i) => [node, i]));
      const n = component.length - 1;
      const matrix = Array.from({ length: n }, () => Array(n + 1).fill(0));
      component.slice(1).forEach((node, i) => { matrix[i][n] = injections[node]; });
      for (const edge of edges) {
        if (edge.weight <= EPS || edge.a === edge.b) continue;
        const i = index.get(edge.a), j = index.get(edge.b), w = edge.weight;
        if (i !== undefined) matrix[i][i] += w;
        if (j !== undefined) matrix[j][j] += w;
        if (i !== undefined && j !== undefined) { matrix[i][j] -= w; matrix[j][i] -= w; }
      }
      for (let col = 0; col < n; col++) {
        let pivot = col;
        for (let row = col + 1; row < n; row++) if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
        [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
        if (Math.abs(matrix[col][col]) <= EPS) continue;
        for (let row = col + 1; row < n; row++) {
          const factor = matrix[row][col] / matrix[col][col];
          for (let k = col; k <= n; k++) matrix[row][k] -= factor * matrix[col][k];
        }
      }
      for (let row = n - 1; row >= 0; row--) {
        let rhs = matrix[row][n];
        for (let col = row + 1; col < n; col++) rhs -= matrix[row][col] * potentials[component[col + 1]];
        potentials[component[row + 1]] = Math.abs(matrix[row][row]) > EPS ? rhs / matrix[row][row] : 0;
      }
    }
    return potentials;
  }

  function plan(state) {
    const sourceDevices = Array.isArray(state?.devices) ? state.devices : [];
    const sourceWires = Array.isArray(state?.wires) ? state.wires : [];
    const devices = sourceDevices.map(devicePlan);
    const byId = new Map(devices.map((device, i) => [device.id, i]));
    const injections = devices.map(device => device.electricalOut - device.electricalIn);
    const edges = sourceWires.map((wire, index) => {
      const a = byId.get(wire.a), b = byId.get(wire.b);
      const heat = positive(wire.power);
      if (a !== undefined && b !== undefined) {
        injections[a] -= heat / 2;
        injections[b] -= heat / 2;
      }
      return { index, a, b, weight: Math.abs(finite(wire.current)), heat };
    });
    const potential = solveRouting(devices, edges, injections);
    const wires = edges.map(edge => {
      const { index, a, b, weight, heat } = edge;
      const valid = a !== undefined && b !== undefined && a !== b && weight > EPS;
      const flow = valid ? weight * (potential[a] - potential[b]) : 0;
      const power = Math.abs(flow) > EPS ? Math.abs(flow) : 0;
      return {
        index, power, heat, currentA: weight,
        from: power ? devices[flow > 0 ? a : b].id : null,
        to: power ? devices[flow > 0 ? b : a].id : null,
        direction: power ? (flow > 0 ? 1 : -1) : 0
      };
    });
    return { devices, wires, colors: COLORS, lightFraction: LIGHT_FRACTION };
  }

  const API = Object.freeze({ plan, weightStockPackets, createWeightPacketTracker, WEIGHT_STOCK_SLICES, WEIGHT_TRAVEL_SECONDS, COLORS, LIGHT_FRACTION, MODEL });
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.DynamotEnergy = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
