/**
 * Resistive DC network, no DOM/imports; suitable for the laboratory MODEL_START.
 * Each cable has C.wireR ohms (default 0.05), including parallel cables.
 * Device pins: voltage = V0 - V1, current = (voltage - emf) / resistance.
 * Cable current is conventional current a/ap -> b/bp; electrons move oppositely.
 * Only voltage/current/power fields on supplied devices and wires are mutated.
 * Pausing time is the caller's responsibility; omega=0 removes generator emf.
 */
function solveDynamotNetwork(devices, wires, C = {}) {
  const positive = (value, fallback) => Number.isFinite(value) && value > 0 ? value : fallback;
  const motorR = positive(C.R, 2), lampR = positive(C.lampR, 8);
  const wireR = positive(C.wireR, 0.05), k = Number.isFinite(C.k) ? C.k : 0.18;
  const count = devices.length * 2, adjacency = Array.from({ length: count }, () => []);
  const index = new Map(devices.map((device, i) => [device.id, i * 2]));
  const edges = [];
  const clear = item => { item.voltage = 0; item.current = 0; item.power = 0; };
  function add(a, b, resistance, emf, item) {
    const id = edges.length;
    edges.push({ a, b, resistance, emf, item });
    adjacency[a].push(id); adjacency[b].push(id);
  }
  devices.forEach((device, i) => {
    clear(device);
    const source = device.type === 'motor';
    const emf = source && Number.isFinite(device.omega) ? k * device.omega : 0;
    add(i * 2, i * 2 + 1, source ? motorR : positive(device.lampR, lampR), Number.isFinite(emf) ? emf : 0, device);
  });
  wires.forEach(wire => {
    clear(wire);
    if (!index.has(wire.a) || !index.has(wire.b) || ![0, 1].includes(wire.ap) || ![0, 1].includes(wire.bp)) return;
    const a = index.get(wire.a) + wire.ap, b = index.get(wire.b) + wire.bp;
    if (a !== b) add(a, b, wireR, 0, wire);
  });

  // Graph bridges carry exactly zero DC current: no closed return path.
  // Edge IDs (not parent vertices) preserve parallel cables as real branches.
  const visited = Array(count).fill(-1), low = Array(count).fill(0), bridges = new Set(), components = [];
  let clock = 0;
  function visit(node, parentEdge, nodes) {
    visited[node] = low[node] = clock++; nodes.push(node);
    for (const edgeId of adjacency[node]) {
      if (edgeId === parentEdge) continue;
      const edge = edges[edgeId], other = edge.a === node ? edge.b : edge.a;
      if (visited[other] < 0) {
        visit(other, edgeId, nodes); low[node] = Math.min(low[node], low[other]);
        if (low[other] > visited[node]) bridges.add(edgeId);
      } else low[node] = Math.min(low[node], visited[other]);
    }
  }
  for (let node = 0; node < count; node++) if (visited[node] < 0) {
    const nodes = []; visit(node, -1, nodes); components.push(nodes);
  }
  const potentials = Array(count).fill(0);
  for (const nodes of components) {
    // One exact reference per component, no artificial leakage to ground.
    const unknown = nodes.slice(1), local = new Map(unknown.map((node, i) => [node, i]));
    const n = unknown.length, matrix = Array.from({ length: n }, () => Array(n + 1).fill(0));
    const componentEdges = new Set(nodes.flatMap(node => adjacency[node]));
    for (const id of componentEdges) {
      const { a, b, resistance, emf } = edges[id], conductance = 1 / resistance;
      const i = local.get(a), j = local.get(b);
      if (i !== undefined) { matrix[i][i] += conductance; matrix[i][n] += conductance * emf; }
      if (j !== undefined) { matrix[j][j] += conductance; matrix[j][n] -= conductance * emf; }
      if (i !== undefined && j !== undefined) { matrix[i][j] -= conductance; matrix[j][i] -= conductance; }
    }
    // Partial pivoting; connected positive-resistance components are nonsingular.
    for (let col = 0; col < n; col++) {
      let pivot = col;
      for (let row = col + 1; row < n; row++) if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
      [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
      const diagonal = matrix[col][col];
      if (!Number.isFinite(diagonal) || diagonal === 0) throw new RangeError('DynaMot network resistance range is numerically singular');
      for (let row = col + 1; row < n; row++) {
        const factor = matrix[row][col] / diagonal;
        matrix[row][col] = 0;
        for (let j = col + 1; j <= n; j++) matrix[row][j] -= factor * matrix[col][j];
      }
    }
    const solution = Array(n).fill(0);
    for (let row = n - 1; row >= 0; row--) {
      let rhs = matrix[row][n];
      for (let col = row + 1; col < n; col++) rhs -= matrix[row][col] * solution[col];
      solution[row] = rhs / matrix[row][row];
      if (!Number.isFinite(solution[row])) throw new RangeError('DynaMot network voltage is not finite');
      potentials[unknown[row]] = solution[row];
    }
  }
  edges.forEach((edge, id) => {
    const { item, a, b, resistance, emf } = edge;
    // For a bridge the exact zero-current solution has voltage == emf.
    const voltage = bridges.has(id) ? emf : potentials[a] - potentials[b];
    const raw = (voltage - emf) / resistance;
    const tolerance = 32 * Number.EPSILON * Math.max(Math.abs(potentials[a]), Math.abs(potentials[b]), Math.abs(emf), 1) / resistance;
    item.current = Math.abs(raw) <= tolerance ? 0 : raw;
    item.voltage = voltage === 0 ? 0 : voltage;
    item.power = item.voltage * item.current;
  });
}

if (typeof module !== 'undefined' && module.exports) module.exports = { solveDynamotNetwork };
