// Serializable learning state. UI and Edulo never contain the mathematical rules.
const Engine = (() => {
  const A = typeof Algebra === 'undefined' ? require('./algebra.js') : Algebra;
  const COLORS = ['gray', 'green', 'yellow', 'red'], KINDS = ['unique', 'all', 'none'];
  const LIMIT = 50, HELP_COUNT = 3;
  const copy = value => JSON.parse(JSON.stringify(value));
  const counts = () => ({total: 0, green: 0, yellow: 0, red: 0, unique: 0, all: 0, none: 0});
  function fresh() { return {schema: 2, nextId: 1, tasks: [], bag: [], board: Array(20).fill('gray'), totals: counts(), archive: counts()}; }
  function current(t) { const l = t.lines.at(-1); return [A.parse(l.left), A.parse(l.right)]; }
  function issues(t) { const l = t.lines.at(-1); return [A.analyze(l.left).issue, A.analyze(l.right).issue]; }
  function phase(t) { return t.done ? 'done' : t.pending ? (t.pending.left === null ? 'left' : 'right') : A.isTerminal(current(t)) ? 'solution' : 'operation'; }
  function continueTask(t) {
    const issue = issues(t), l = t.lines.at(-1);
    t.pending = issue.some(Boolean) ? {operation: null, left: issue[0] ? null : l.left, right: issue[1] ? null : l.right, redLeft: false, redRight: false} : null;
  }
  function makeTask(initial, id = 1) {
    const sides = initial.split('=').map(s => s.trim());
    if (sides.length !== 2) throw Error('Ungültige Gleichung.');
    const t = {id, initial, kind: A.classify(A.equation(initial)), lines: [{left: sides[0], right: sides[1], operation: null, redLeft: false, redRight: false, redOp: false}], pending: null, input: '', level: 0, tainted: false, usedSolve: false, done: false, solution: null, solutionRed: false, award: null, events: []};
    continueTask(t); return t;
  }
  function expected(t) { return t.pending?.operation !== null && t.pending ? A.operate(current(t), t.pending.operation, !!t._legacyOperations) : current(t); }
  function nextAnswer(t) {
    const p = phase(t), e = current(t);
    if (p === 'operation') return A.suggestOperation(e);
    if (p === 'left' || p === 'right') return A.term(expected(t)[p === 'left' ? 0 : 1]);
    if (p === 'solution') return t.kind === 'all' ? 'ℝ' : t.kind === 'none' ? '' : A.qt(A.solution(e));
    throw Error('Die Aufgabe ist bereits abgeschlossen.');
  }
  function accept(t, input, auto = false) {
    const p = phase(t);
    if (p === 'operation') {
      A.operate(current(t), input, !!t._legacyOperations);
      t.lines.at(-1).operation = input; t.lines.at(-1).redOp = auto;
      t.pending = {operation: input, left: null, right: null, redLeft: false, redRight: false};
    } else if (p === 'left' || p === 'right') {
      const side = p === 'left' ? 0 : 1;
      if (!A.same(A.parse(input), expected(t)[side])) throw Error('Diese Seite hat nach dem Schritt noch nicht den richtigen Wert.');
      t.pending[p] = input; t.pending[p === 'left' ? 'redLeft' : 'redRight'] = auto;
      if (t.pending.left !== null && t.pending.right !== null) {
        const pending = t.pending;
        t.lines.push({left: pending.left, right: pending.right, operation: null, redLeft: pending.redLeft, redRight: pending.redRight, redOp: false});
        continueTask(t);
      }
    } else if (p === 'solution') {
      const s = input.trim(); let ok = false;
      if (t.kind === 'all') ok = s === 'ℝ' || s === 'R';
      else if (t.kind === 'none') ok = s === '';
      else { const v = A.parse(s); ok = A.zero(v[0]) && A.eq(v[1], A.solution(current(t))); }
      if (!ok) throw Error('Prüfe noch einmal, welche Lösungsmenge zur letzten Gleichung gehört.');
      t.solution = s; t.solutionRed = auto; t.done = true;
    } else throw Error('Die Aufgabe ist bereits abgeschlossen.');
    t.input = ''; t.level = 0;
    if (auto) { t.usedSolve = true; t.tainted = true; }
  }
  function apply(t, input, auto = false, stored = false) {
    if (typeof input !== 'string' || input.length > (stored ? 162 : 160)) throw Error('Höchstens 160 Zeichen pro Eingabe.');
    if (t.done) return {ok: false, error: 'Die Aufgabe ist bereits abgeschlossen.'};
    const kind = phase(t); let error = '';
    try { accept(t, input, auto); }
    catch (e) { error = e.message; t.tainted = true; t.level = Math.min(HELP_COUNT, t.level + 1); t.input = input; }
    t.events.push({type: 'answer', kind, input, ok: !error, auto});
    return {ok: !error, error};
  }
  function requestHelp(t) {
    if (t.done || t.level >= HELP_COUNT) return false;
    t.tainted = true; t.level++; t.events.push({type: 'help', kind: phase(t), level: t.level}); return true;
  }
  function canSkip(t) { return !!t.pending && t.pending.operation === null && !A.isTerminal(current(t)); }
  function skipSimplification(t) {
    if (!canSkip(t)) return false;
    const p = t.pending, old = t.lines.at(-1);
    if (p.left !== null && p.left !== old.left || p.right !== null && p.right !== old.right) {
      t.lines.push({left: p.left ?? old.left, right: p.right ?? old.right, operation: null, redLeft: p.redLeft, redRight: p.redRight, redOp: false});
    }
    t.pending = null; t.input = ''; t.level = 0; t.events.push({type: 'skip'}); return true;
  }
  function simplify(t) {
    if (phase(t) !== 'operation' || !issues(t).some(Boolean)) return false;
    continueTask(t); t.input = ''; t.level = 0; t.events.push({type: 'simplify'}); return true;
  }
  function changeOperation(t) {
    if (!t.pending || t.pending.operation === null || t.pending.left !== null || t.pending.right !== null) return false;
    const l = t.lines.at(-1); t.input = l.operation; l.operation = null; l.redOp = false; t.pending = null; t.level = 0;
    t.events.push({type: 'change'}); return true;
  }
  function scoreAdd(board, color) {
    let g = board.filter(c => c === 'green').length, y = board.filter(c => c === 'yellow').length, r = board.filter(c => c === 'red').length;
    if (g + y + r < 20) { if (color === 'green') g++; else if (color === 'yellow') y++; else r++; }
    else if (color === 'red') { if (y) { y--; r++; } else if (g) { g--; y++; } }
    else {
      if (r) { r--; if (color === 'green') g++; else y++; }
      else if (color === 'green' && y) { y--; g++; }
      else if (color === 'yellow' && g) { g--; y++; }
    }
    return [...Array(g).fill('green'), ...Array(y).fill('yellow'), ...Array(20 - g - y - r).fill('gray'), ...Array(r).fill('red')];
  }
  function account(s, t) {
    // Red is awarded immediately on the first solved input, once per task.
    if (!t.award && (t.usedSolve || t.done)) { t.award = t.usedSolve ? 'red' : t.tainted ? 'yellow' : 'green'; s.board = scoreAdd(s.board, t.award); }
    if (t.done && !t.counted) { t.counted = true; s.totals.total++; s.totals[t.award]++; s.totals[t.kind]++; }
  }
  function newTask(s, rng = Math.random) {
    if (s.tasks.length && !s.tasks.at(-1).done) return false;
    if (!s.bag.length) { s.bag = [...KINDS]; for (let i = 2; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [s.bag[i], s.bag[j]] = [s.bag[j], s.bag[i]]; } }
    const kind = s.bag.shift(); s.tasks.push(makeTask(A.generate(kind, rng), s.nextId++));
    if (s.tasks.length > LIMIT) { const old = s.tasks.shift(); s.archive.total++; s.archive[old.award]++; s.archive[old.kind]++; }
    return true;
  }
  const issueInstructions = {brackets: 'Multipliziere die Klammer aus', minusBracket: 'Löse die Minusklammer auf', divideBracket: 'Teile jeden Term in der Klammer', x: 'Fasse gleiche x-Terme zusammen', numbers: 'Fasse die Zahlen zusammen', calculate: 'Vereinfache den Rechenausdruck'};
  function instruction(t) {
    const p = phase(t);
    if (p === 'operation') return 'Operation auf beiden Seiten';
    if (p === 'solution') return 'Gib die Lösungsmenge an.';
    if (p === 'done') return 'Aufgabe abgeschlossen';
    const side = p === 'left' ? 0 : 1, where = side ? 'rechts' : 'links';
    return t.pending.operation === null ? (issueInstructions[issues(t)[side]] || 'Vereinfache den Term') + ' – ' + where : 'Berechne die ' + (side ? 'rechte' : 'linke') + ' Seite.';
  }
  function hint(t) {
    const p = phase(t), e = current(t), level = t.level;
    if (!level || p === 'done') return null;
    let texts, visual = '', focus = '';
    if (p === 'operation') {
      const target = !A.zero(e[0][0]) && !A.zero(e[1][0]) ? 'right-x' : !A.zero(e[0][0]) && !A.zero(e[0][1]) ? 'left-number' : A.zero(e[0][0]) && !A.zero(e[1][1]) ? 'right-number' : 'coefficient';
      if (target === 'right-x') { texts = ['Sammle die x-Terme auf einer Seite. Du kannst zum Beispiel den x-Term rechts entfernen.', 'Betrachte den x-Term rechts. Welche Gegenoperation hebt sein Addieren oder Subtrahieren auf?', 'Wende die Gegenoperation auf beide Seiten an. Gib ein Rechenzeichen und den passenden x-Term ein.']; visual = '+ … ↔ − …'; }
      else if (target === 'left-number' || target === 'right-number') { const where = target === 'left-number' ? 'links' : 'rechts'; texts = ['Versuche, den Zahlenterm neben dem x-Term zu entfernen.', 'Auf der ' + (where === 'links' ? 'linken' : 'rechten') + ' Seite steht neben dem x-Term eine Zahl. Welche Gegenoperation hebt diesen Zahlenterm auf?', 'Der Zahlenterm soll ' + where + ' verschwinden. Führe die Gegenoperation auf beiden Seiten aus.']; visual = '+ … ↔ − …'; }
      else { texts = ['Versuche, x allein auf einer Seite zu erhalten.', 'Vor x steht ein Faktor. Mit welcher Gegenoperation kannst du den Faktor entfernen?', 'Teile beide Seiten durch den Faktor vor x oder multipliziere mit seinem Kehrwert. Achte auf das Vorzeichen.']; visual = '· … ↔ : …'; }
      focus = target;
    } else if (p === 'solution') {
      texts = ['Betrachte die letzte Gleichung: Gibt es genau eine Lösung, alle reellen Zahlen oder keine Lösung?', 'Ist x allein, lies die Zahl auf der anderen Seite ab. Ohne x: Prüfe, ob die beiden Zahlen gleich sind.', 'Trage eine einzelne Lösung ein, lass das Feld für die leere Menge leer oder wähle ℝ für alle reellen Zahlen. Entscheide anhand der letzten Gleichung.'];
      visual = 'eine Zahl   ·   keine Zahl   ·   alle Zahlen'; focus = 'both';
    } else {
      const side = p === 'left' ? 0 : 1, issue = issues(t)[side]; focus = side ? 'right' : 'left';
      if (t.pending.operation !== null) { texts = ['Wende die gewählte Operation auf die gefragte Seite an.', 'Beachte die Operation hinter dem Strich. x-Terme und reine Zahlen musst du getrennt behandeln.', 'Bei + oder − verrechnest du gleiche Terme. Bei · oder : wendest du die Operation auf jeden Summanden an. Prüfe auch die Vorzeichen.']; visual = 'x-Terme ↔ x-Terme   ·   Zahlen ↔ Zahlen'; }
      else if (['brackets', 'minusBracket', 'divideBracket'].includes(issue)) {
        texts = ['Die Klammer enthält eine Summe oder Differenz. Bearbeite jeden Term in der Klammer.', issue === 'minusBracket' ? 'Ein Minus vor der Klammer ändert jedes Vorzeichen in der Klammer.' : issue === 'divideBracket' ? 'Teile jeden Term in der Klammer einzeln durch die Zahl im Nenner.' : 'Multipliziere den Faktor vor der Klammer mit jedem Term in der Klammer.', 'Bearbeite zuerst den x-Term und dann den Zahlenterm. Schreibe die Teilrechnungen auf und fasse anschließend gleiche Terme zusammen.'];
        visual = issue === 'minusBracket' ? '−(a + b) → −a −b' : issue === 'divideBracket' ? '(a + b) : c → a : c + b : c' : 'a · (b + c) → a · b + a · c';
      } else if (issue === 'calculate') {
        const raw = t.lines.at(-1)[p], division = /[/:÷]/.test(raw);
        texts = ['Führe die noch offenen Rechnungen aus. Beachte Punktrechnung vor Strichrechnung.', division ? 'Bei einer Division prüfst du Zähler, Nenner und ihre Vorzeichen. Kürze einen Bruch, wenn es möglich ist.' : 'Berechne zuerst die Zahlenfaktoren. Falls x vorkommt, bleibt x beim Berechnen seines Faktors erhalten.', 'Gleiche Vorzeichen ergeben bei Multiplikation und Division ein Plus, verschiedene ein Minus. Rechne den Zahlenanteil aus und schreibe den vereinfachten Term.'];
        visual = 'gleiches Vorzeichen → +   ·   verschiedenes → −';
      } else { texts = ['Fasse gleichartige Terme zusammen. x-Terme und Zahlen bleiben getrennt.', issue === 'x' ? 'Betrachte die Zahlen vor x einschließlich ihrer Vorzeichen. Bei x ist der Faktor 1, bei −x ist er −1.' : 'Achte bei den Zahlen auf jedes Plus- und Minuszeichen. Berechne ihre Summe.', 'Ordne zuerst die x-Terme und die reinen Zahlen. Verrechne jede Gruppe für sich; prüfe negative Vorzeichen.']; visual = 'x-Terme ↔ x-Terme   ·   Zahlen ↔ Zahlen'; }
    }
    return {text: texts[level - 1], visual: level >= 2 ? visual : '', focus: level >= 2 ? focus : '', level};
  }
  // Entry colors are derived from the existing log, so older saves need no migration.
  // Process only newly appended events; typing and repeated renders do not replay the log.
  const entryCache = new WeakMap();
  function entryColors(t) {
    let c = entryCache.get(t);
    if (!c || c.events !== t.events || c.initial !== t.initial || c.processed > t.events.length) {
      const replay = makeTask(t.initial, t.id);
      c = {events: t.events, initial: t.initial, processed: 0, replay,
        colors: {lines: [{left: null, right: null, operation: null}], pending: null, solution: null}};
      entryCache.set(t, c);
    }
    const r = c.replay, colors = c.colors;
    const syncPending = () => {
      const last = colors.lines.at(-1);
      colors.pending = r.pending ? {left: r.pending.left === null ? null : last.left,
        right: r.pending.right === null ? null : last.right, operation: null} : null;
    };
    if (!c.processed) syncPending();
    while (c.processed < t.events.length) {
      const v = t.events[c.processed++], before = r.lines.length;
      if (v.type === 'answer') {
        const kind = phase(r), color = v.auto ? 'red' : r.level ? 'yellow' : 'green';
        const pending = colors.pending;
        if (apply(r, v.input, v.auto, true).ok) {
          if (kind === 'operation') { colors.lines.at(-1).operation = color; syncPending(); }
          else if (kind === 'solution') colors.solution = color;
          else {
            pending[kind] = color;
            if (r.lines.length > before) { colors.lines.push({...pending, operation: null}); syncPending(); }
          }
        }
      } else if (v.type === 'help') requestHelp(r);
      else if (v.type === 'skip') {
        const last = colors.lines.at(-1), p = r.pending, pending = colors.pending;
        skipSimplification(r);
        if (r.lines.length > before) colors.lines.push({left: p.left === null ? last.left : pending.left,
          right: p.right === null ? last.right : pending.right, operation: null});
        syncPending();
      } else if (v.type === 'simplify') { simplify(r); syncPending(); }
      else if (v.type === 'change') { changeOperation(r); colors.lines.at(-1).operation = null; syncPending(); }
    }
    return colors;
  }
  // Validation caches mathematical replay by complete task content, never merely by task ID.
  const cache = new Map();
  function validateTask(t, legacy = false) {
    const signature = JSON.stringify([legacy,t]); if (cache.get(t.id) === signature) return true;
    if (!Number.isInteger(t.id) || t.id < 1 || typeof t.initial !== 'string' || typeof t.input !== 'string' || t.input.length > 160 || !Array.isArray(t.events) || t.events.length > 10000 || !Number.isInteger(t.level) || t.level < 0 || t.level > HELP_COUNT) return false;
    const replay = makeTask(t.initial, t.id);
    replay._legacyOperations = legacy;
    for (const v of t.events) {
      if (v.type === 'answer') {
        if (v.kind !== phase(replay) || typeof v.input !== 'string' || typeof v.ok !== 'boolean' || typeof v.auto !== 'boolean' || (v.auto && (replay.level !== HELP_COUNT || v.input !== nextAnswer(replay)))) return false;
        if (v.input.length > 160 && (!v.originalInput || v.originalInput.length > 160 || v.input !== legacyGrouping(v.originalInput))) return false;
        if (apply(replay, v.input, v.auto, true).ok !== v.ok) return false;
      } else if (v.type === 'help') { if (v.kind !== phase(replay) || !requestHelp(replay) || v.level !== replay.level) return false; }
      else if (v.type === 'skip') { if (!skipSimplification(replay)) return false; }
      else if (v.type === 'simplify') { if (!simplify(replay)) return false; }
      else if (v.type === 'change') { if (!changeOperation(replay)) return false; }
      else return false;
    }
    for (const key of ['kind', 'lines', 'pending', 'level', 'tainted', 'usedSolve', 'done', 'solution', 'solutionRed']) if (JSON.stringify(replay[key]) !== JSON.stringify(t[key])) return false;
    const award = replay.usedSolve ? 'red' : replay.done ? replay.tainted ? 'yellow' : 'green' : null;
    if (t.award !== award || !!t.counted !== replay.done) return false;
    cache.set(t.id, signature); if (cache.size > LIMIT + 2) cache.delete(cache.keys().next().value); return true;
  }
  function validate(s) {
    try {
      if (!s || ![1,2].includes(s.schema) || !Number.isInteger(s.nextId) || s.nextId < 1 || !Array.isArray(s.tasks) || s.tasks.length > LIMIT || !Array.isArray(s.bag) || s.bag.length > 2 || new Set(s.bag).size !== s.bag.length || s.bag.some(k => !KINDS.includes(k)) || !Array.isArray(s.board) || s.board.length !== 20 || s.board.some(c => !COLORS.includes(c))) return false;
      for (const c of [s.totals, s.archive]) { if (!c || Object.keys(counts()).some(k => !Number.isInteger(c[k]) || c[k] < 0) || c.green + c.yellow + c.red !== c.total || c.unique + c.all + c.none !== c.total) return false; }
      let previous = 0; const retained = counts();
      for (const t of s.tasks) { if (t.id <= previous || t.id >= s.nextId || !validateTask(t, s.schema === 1)) return false; previous = t.id; if (t.done) { retained.total++; retained[t.award]++; retained[t.kind]++; } else if (t !== s.tasks.at(-1)) return false; }
      if (Object.keys(retained).some(k => retained[k] + s.archive[k] !== s.totals[k])) return false;
      if (s.nextId - 1 !== s.totals.total + (s.tasks.length && !s.tasks.at(-1).done ? 1 : 0)) return false;
      return true;
    } catch { return false; }
  }
  function legacyGrouping(input) {
    const s = input.trim().replace(/^\|\s*/, '').replace(/[−–]/g, '-');
    return '-(' + s.slice(1).replace(/\s/g, '') + ')';
  }
  function upgrade(s) {
    if (s.schema === 2) return s;
    if (!validate(s)) throw Error('Der vorhandene Lernstand konnte nicht geprüft werden. Originalstand bleibt erhalten.');
    const result = copy(s); result.schema = 2;
    result.tasks = s.tasks.map(old => {
      const t = makeTask(old.initial, old.id);
      for (const v of old.events) {
        if (v.type === 'answer') {
          let input = v.input;
          if (v.ok && v.kind === 'operation' && !v.auto) {
            const e = current(t), before = A.operate(e, input, true), after = A.operate(e, input);
            if (!before.every((side, i) => A.same(side, after[i]))) input = legacyGrouping(input);
          }
          if (apply(t, input, v.auto, true).ok !== v.ok) throw Error('Der alte Lösungsweg konnte nicht wiederhergestellt werden. Originalstand bleibt erhalten.');
          if (input !== v.input) t.events.at(-1).originalInput = v.input;
        } else if (v.type === 'help') requestHelp(t);
        else if (v.type === 'skip') skipSimplification(t);
        else if (v.type === 'simplify') simplify(t);
        else if (v.type === 'change') changeOperation(t);
      }
      t.input = old.input; t.award = old.award;
      if (old.counted) t.counted = true;
      return t;
    });
    if (!validate(result)) throw Error('Der aktualisierte Lernstand konnte nicht geprüft werden. Originalstand bleibt erhalten.');
    return result;
  }
  return {fresh, makeTask, current, issues, phase, expected, nextAnswer, apply, requestHelp, canSkip, skipSimplification, simplify, changeOperation, scoreAdd, account, newTask, instruction, hint, entryColors, validate, upgrade, LIMIT, HELP_COUNT, copy};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
