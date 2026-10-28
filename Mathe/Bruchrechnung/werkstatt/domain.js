'use strict';

const FractionDomain = (() => {
  function integer(value) {
    if (!Number.isSafeInteger(value)) throw new RangeError('Es sind nur sichere ganze Zahlen erlaubt.');
    return Math.abs(value);
  }

  function gcd(a, b) {
    a = integer(a);
    b = integer(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function lcm(a, b) {
    a = integer(a);
    b = integer(b);
    if (!a || !b) return 0;
    const result = a / gcd(a, b) * b;
    if (!Number.isSafeInteger(result)) throw new RangeError('Das kgV ist zu groß.');
    return result;
  }

  // Pick across denominator groups before repeating a group. Within each group,
  // start in the middle and alternate outward to avoid a pool of unit fractions.
  function balanced(candidates, group, count) {
    const buckets = new Map();
    candidates.forEach(task => {
      const key = group(task);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(task);
    });
    const queues = Array.from(buckets.values(), list => {
      const ordered = [];
      let left = Math.floor((list.length - 1) / 2);
      let right = left + 1;
      while (left >= 0 || right < list.length) {
        if (left >= 0) ordered.push(list[left--]);
        if (right < list.length) ordered.push(list[right++]);
      }
      return ordered;
    });
    const selected = [];
    for (let round = 0; selected.length < count; round++) {
      let added = false;
      for (const queue of queues) {
        if (queue[round] && selected.length < count) {
          selected.push(queue[round]);
          added = true;
        }
      }
      if (!added) break;
    }
    return selected;
  }

  function reduceTasks(level) {
    const candidates = [];
    const maxDenominator = level === 1 ? 16 : 36;
    for (let d = level === 1 ? 4 : 12; d <= maxDenominator; d++) {
      for (let n = 1; n < d; n++) {
        const factor = gcd(n, d);
        if (factor > 1 && (level === 2 ? factor >= 3 : factor <= 4)) {
          candidates.push({ n, d, factor });
        }
      }
    }
    // Keep the original sequence and identifiers stable for saved learning states.
    const selected = balanced(candidates, task => task.d, 32);
    const seen = new Set(selected.map(task => `${task.n}/${task.d}`));
    const bases = level === 1 ? [[1, 2], [1, 3], [2, 3], [3, 4]]
      : [[2, 5], [3, 5], [4, 5], [5, 6], [5, 7], [7, 8]];
    // Composite common divisors permit both direct and meaningful staged reduction.
    for (const factor of [4, 6, 8, 9, 10, 12]) {
      // All four level-one factor-4 examples already occur in the legacy prefix.
      // Add one further reduced base so factor 4 also gains a fresh example.
      const factorBases = level === 1 && factor === 4 ? [...bases, [2, 5]] : bases;
      for (const [baseN, baseD] of factorBases) {
        const n = baseN * factor, d = baseD * factor, key = `${n}/${d}`;
        if (seen.has(key)) continue;
        selected.push({ n, d, factor });
        seen.add(key);
      }
    }
    return selected;
  }

  function expandTasks(level) {
    const candidates = [];
    for (let d = 2; d <= (level === 1 ? 8 : 12); d++) {
      for (let factor = level === 1 ? 2 : 3; factor <= (level === 1 ? 3 : 6); factor++) {
        const target = d * factor;
        if (target > (level === 1 ? 24 : 36)) continue;
        for (let n = 1; n < d; n++) {
          if (gcd(n, d) === 1) candidates.push({ n, d, factor, target });
        }
      }
    }
    return balanced(candidates, task => `${task.d}:${task.factor}`, 32);
  }

  function operateTasks(level) {
    const pairs = level === 1
      ? [[2, 4], [3, 6], [4, 8], [2, 6], [3, 9], [4, 12], [6, 12], [2, 8]]
      : [[3, 4], [4, 6], [3, 8], [6, 8], [5, 4], [5, 3], [5, 2], [6, 9]];
    const result = [];
    for (const [d, bd] of pairs) {
      for (const op of ['+', '-']) {
        const candidates = [];
        for (let n = 1; n < d; n++) {
          for (let bn = 1; bn < bd; bn++) {
            if (op === '-' && n * bd < bn * d) continue;
            candidates.push({ n, d, bn, bd, op });
          }
        }
        // Two different numerator combinations per denominator pair and operation.
        result.push(candidates[Math.floor(candidates.length / 5)]);
        result.push(candidates[Math.floor(candidates.length * 4 / 5)]);
      }
    }
    return result;
  }

  const pools = {};
  for (const kind of ['reduce', 'expand', 'operate']) {
    for (const level of [1, 2]) {
      const generated = kind === 'reduce' ? reduceTasks(level)
        : kind === 'expand' ? expandTasks(level) : operateTasks(level);
      pools[`${kind}:${level}`] = generated.map((task, index) => Object.freeze({
        id: `${kind}-${level}-${index + 1}`, kind, level, ...task
      }));
    }
  }

  function tasks(kind, level) {
    if (typeof kind !== 'string' || (level !== 1 && level !== 2)) return [];
    return (pools[`${kind}:${level}`] || []).map(task => ({ ...task }));
  }

  function validTask(task) {
    if (!task || typeof task !== 'object' || Array.isArray(task)) return false;
    if (typeof task.kind !== 'string' || (task.level !== 1 && task.level !== 2)) return false;
    const canonical = (pools[`${task.kind}:${task.level}`] || []).find(item => item.id === task.id);
    if (!canonical) return false;
    const keys = Object.keys(canonical);
    return Object.keys(task).length === keys.length
      && keys.every(key => Object.prototype.hasOwnProperty.call(task, key) && task[key] === canonical[key]);
  }

  const field = (key, label, value) => ({ key, label, value });
  const divisors = value => Array.from({ length: value }, (_, index) => index + 1)
    .filter(candidate => value % candidate === 0).join(', ');
  const multiples = (value, until) => Array.from({ length: until / value }, (_, index) => value * (index + 1)).join(', ');
  const sameStep = () => ({
    title: 'Menge vergleichen',
    text: 'Stellen der Ausgangsbruch und der neue Bruch denselben Anteil am Ganzen dar?',
    fields: [field('same', 'Gleiche Menge? (1 = ja, 0 = nein)', 1)],
    hint: 'Die Teile sind anders eingeteilt. Der Anteil am selben Ganzen bleibt gleich. Wähle: Der Anteil bleibt gleich.',
    explanation: 'Zähler und Nenner wurden mit derselben Zahl multipliziert oder durch dieselbe Zahl geteilt. Der Wert des Bruchs bleibt gleich.'
  });

  function steps(task) {
    if (!validTask(task)) throw new RangeError('Diese Aufgabe gehört nicht zum Aufgabenpool.');
    const { n, d, bn, bd, factor, target, op } = task;
    if (task.kind === 'reduce') {
      const rn = n / factor;
      const rd = d / factor;
      return [{
        title: 'Gemeinsamen Teiler finden',
        text: 'Finde die größte ganze Zahl, durch die sich Zähler und Nenner ohne Rest teilen lassen.',
        fields: [field('factor', 'Größter gemeinsamer Teiler', factor)],
        hint: `Notiere die positiven Teiler beider Zahlen. Teiler von ${n}: ${divisors(n)}. Teiler von ${d}: ${divisors(d)}. Vergleiche beide Listen. Die größte Zahl, die in beiden vorkommt, ist ${factor}: der größte gemeinsame Teiler.`,
        explanation: `${factor} ist der größte gemeinsame Teiler von ${n} und ${d}.`
      }, {
        title: 'Vollständig kürzen',
        text: 'Teile Zähler und Nenner durch den gefundenen größten gemeinsamen Teiler.',
        fields: [field('n', 'Neuer Zähler', rn), field('d', 'Neuer Nenner', rd)],
        hint: `Rechne ${n} : ${factor} und ${d} : ${factor}. Du erhältst ${rn}/${rd}.`,
        explanation: `${n}/${d} = (${n} : ${factor})/(${d} : ${factor}) = ${rn}/${rd}. Dieser Bruch ist vollständig gekürzt.`
      }, sameStep()];
    }
    if (task.kind === 'expand') {
      return [{
        title: 'Erweiterungsfaktor finden',
        text: `Bestimme den Faktor, mit dem du den Nenner multiplizieren musst, um den Zielnenner ${target} zu erhalten.`,
        fields: [field('factor', 'Erweiterungsfaktor', factor)],
        hint: `Teile den Zielnenner durch den bisherigen Nenner: ${target} : ${d} = ${factor}. So findest du den Faktor, mit dem der bisherige Nenner multipliziert werden muss.`,
        explanation: `${d} · ${factor} = ${target}. Der Erweiterungsfaktor ist ${factor}.`
      }, {
        title: 'Bruch erweitern',
        text: 'Multipliziere Zähler und Nenner mit dem gefundenen Erweiterungsfaktor.',
        fields: [field('n', 'Neuer Zähler', n * factor), field('d', 'Neuer Nenner', target)],
        hint: `Rechne ${n} · ${factor} und ${d} · ${factor}. Du erhältst ${n * factor}/${target}.`,
        explanation: `${n}/${d} = (${n} · ${factor})/(${d} · ${factor}) = ${n * factor}/${target}.`
      }, sameStep()];
    }
    const common = lcm(d, bd);
    const left = n * (common / d);
    const right = bn * (common / bd);
    const numerator = op === '+' ? left + right : left - right;
    const divisor = gcd(numerator, common);
    const rn = numerator / divisor;
    const rd = common / divisor;
    return [{
      title: 'Gemeinsamen Nenner finden',
      text: 'Bestimme das kleinste gemeinsame Vielfache der beiden Nenner.',
      fields: [field('common', 'Kleinster gemeinsamer Nenner', common)],
      hint: `Notiere die positiven Vielfachen beider Nenner, bis eine Zahl in beiden Listen vorkommt. Vielfache von ${d}: ${multiples(d, common)}. Vielfache von ${bd}: ${multiples(bd, common)}. Die kleinste gemeinsame Zahl ist ${common}: das kleinste gemeinsame Vielfache.`,
      explanation: `kgV(${d}, ${bd}) = ${common}. Das ist der kleinste gemeinsame Nenner.`
    }, {
      title: 'Gleichnamig machen',
      text: 'Bringe beide Brüche auf den gefundenen gemeinsamen Nenner. Trage ihre neuen Zähler ein.',
      fields: [field('left', 'Neuer Zähler links', left), field('right', 'Neuer Zähler rechts', right)],
      hint: `Multipliziere links mit ${common / d} und rechts mit ${common / bd}. Die neuen Zähler sind ${left} und ${right}.`,
      explanation: `${n}/${d} = ${left}/${common} und ${bn}/${bd} = ${right}/${common}.`
    }, {
      title: op === '+' ? 'Brüche addieren' : 'Brüche subtrahieren',
      text: `Rechne mit den gleichnamigen Brüchen. ${op === '+' ? 'Addiere' : 'Subtrahiere'} die Zähler und behalte den gemeinsamen Nenner. Kürze erst im nächsten Schritt.`,
      fields: [field('n', 'Zähler des Ergebnisses', numerator), field('d', 'Gemeinsamer Nenner', common)],
      hint: `${left} ${op} ${right} = ${numerator}. Der Nenner bleibt ${common}.`,
      explanation: `${left}/${common} ${op} ${right}/${common} = ${numerator}/${common}.`
    }, {
      title: 'Ergebnis vollständig kürzen',
      text: 'Gib das Ergebnis als vollständig gekürzten Bruch an. Ist es bereits vollständig gekürzt, übernimm es unverändert.',
      fields: [field('n', 'Vollständig gekürzter Zähler', rn), field('d', 'Vollständig gekürzter Nenner', rd)],
      hint: divisor === 1 ? `Der Bruch ${numerator}/${common} ist bereits vollständig gekürzt.`
        : `Teile Zähler und Nenner durch ${divisor}. Du erhältst ${rn}/${rd}.`,
      explanation: divisor === 1 ? `${numerator}/${common} ist vollständig gekürzt.`
        : `${numerator}/${common} = (${numerator} : ${divisor})/(${common} : ${divisor}) = ${rn}/${rd}.`
    }];
  }

  return { gcd, lcm, tasks, steps, validTask };
})();

if (typeof module !== 'undefined') module.exports = FractionDomain;
