const A = Algebra, E = Engine;
let state, ready = false, draftTimer = null, historyDirty = true, lastFeedback = '', feedbackBad = false;
const answer = q('[data-answer]');
const bridge = createEduloBridge({root, widgetId: 'aequivalenz-v3', stateVersion: 1, hideFooter: true, fresh: E.fresh, validate: E.validate,
  onStatus: ({text, error}) => { q('[data-storage]').textContent = text; q('[data-retry]').hidden = !error; }
});
const task = () => state.tasks.at(-1);
const node = (tag, text = '', cls = '') => { const el = document.createElement(tag); el.textContent = text; if (cls) el.className = cls; return el; };
function persist() {
  clearTimeout(draftTimer); draftTimer = null;
  if (!ready || !root.isConnected || bridge.getStatus().mode === 'editor') return;
  try { bridge.save(state, state.board); } catch {} // The bridge keeps its detailed error visible.
}
function draftChanged() {
  if (!ready || task().done) return;
  task().input = answer.value; updateBraces();
  // No copying, replay or serialization on individual key presses.
  clearTimeout(draftTimer); draftTimer = setTimeout(persist, 400);
}
function showFeedback(text = '', bad = false) { lastFeedback = text; feedbackBad = bad; const el = q('[data-feedback]'); el.hidden = !text; el.textContent = text; el.classList.toggle('bad', bad); }
function updateBraces() {
  const t = task(), isReals = ['ℝ', 'R'].includes((t.done ? t.solution : answer.value)?.trim());
  q('[data-open-brace]').hidden = isReals; q('[data-close-brace]').hidden = isReals;
}
// Source ranges keep the highlighted parts tied to the same roles in the rule.
function bracketHelp(text, issue) {
  const pairs = [], stack = [];
  for (let i = 0; i < text.length; i++) { if (text[i] === '(') stack.push(i); else if (text[i] === ')' && stack.length) pairs.push({open: stack.pop(), close: i}); }
  const span = (start, end, role) => { while (/\s/.test(text[start] || '') && start < end) start++; while (/\s/.test(text[end - 1] || '') && end > start) end--; return {start, end, role}; };
  for (const {open, close} of pairs) {
    let depth = 0, separator = -1;
    for (let i = open + 1; i < close; i++) {
      if (text[i] === '(') depth++; else if (text[i] === ')') depth--;
      else if (!depth && ['+', '-', '−'].includes(text[i]) && text.slice(open + 1, i).trim() && !/[+\-−*/·:÷(]$/.test(text.slice(open + 1, i).trim())) { separator = i; break; }
    }
    if (separator < 0) continue;
    const sign = text[separator] === '+' ? '+' : '−';
    if (issue === 'brackets') {
      const before = text.slice(0, open), after = text.slice(close + 1);
      const left = before.match(/([+\-−]?\s*\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?)\s*[*·×]?\s*$/), right = after.match(/^\s*[*·×]\s*([+\-−]?\s*\d+(?:[.,]\d+)?)/);
      let factor;
      if (left) factor = span(left.index, left.index + left[1].length, 'a');
      else if (right) { const start = close + 1 + right[0].indexOf(right[1]); factor = span(start, start + right[1].length, 'a'); }
      if (!factor) continue;
      return {ranges: [factor, span(open + 1, separator, 'b'), span(separator + 1, close, 'c')], rule: 'a · (b ' + sign + ' c) → a · b ' + sign + ' a · c'};
    }
    if (issue === 'minusBracket' && /[\-−]\s*$/.test(text.slice(0, open))) return {ranges: [span(open + 1, separator, 'a'), span(separator + 1, close, 'b')], rule: '−(a ' + sign + ' b) → −a ' + (sign === '+' ? '−' : '+') + ' b'};
    if (issue === 'divideBracket') {
      const divisor = text.slice(close + 1).match(/^\s*[/:÷]\s*(\(\s*[+\-−]?\s*\d+(?:[.,]\d+)?\s*\)|[+\-−]?\s*\d+(?:[.,]\d+)?)/);
      if (!divisor) continue;
      const start = close + 1 + divisor[0].indexOf(divisor[1]);
      return {ranges: [span(open + 1, separator, 'a'), span(separator + 1, close, 'b'), span(start, start + divisor[1].length, 'c')], rule: '(a ' + sign + ' b) : c → a : c ' + sign + ' b : c'};
    }
  }
  return null;
}
function focusedBracket(t, h) {
  const p = E.phase(t);
  if (!h?.focus || !['left', 'right'].includes(p) || t.pending.operation !== null) return null;
  const issue = E.issues(t)[p === 'left' ? 0 : 1];
  return ['brackets', 'minusBracket', 'divideBracket'].includes(issue) ? bracketHelp(t.lines.at(-1)[p], issue) : null;
}
function markedText(el, text, focus, column, bracket) {
  if (!focus || !['left', 'right'].includes(column)) { el.textContent = text; return; }
  const use = focus === 'both' || focus === column || focus === 'right-x' && column === 'right' || focus === 'left-number' && column === 'left' || focus === 'right-number' && column === 'right' || focus === 'coefficient';
  if (!use) { el.textContent = text; return; }
  if (bracket !== undefined) {
    let offset = 0;
    for (const r of [...(bracket?.ranges || [])].sort((a, b) => a.start - b.start)) { el.append(document.createTextNode(text.slice(offset, r.start))); el.append(node('mark', text.slice(r.start, r.end), 'role-' + r.role)); offset = r.end; }
    el.append(document.createTextNode(text.slice(offset))); return;
  }
  const parts = String(text).split(/((?:\d+(?:[.,]\d+)?(?:\/\d+)?\s*\*?\s*)?x|\d+(?:[.,]\d+)?)/g);
  for (const part of parts) {
    if (!part) continue;
    const isX = part.includes('x'), numeric = /\d/.test(part);
    if ((focus === 'right-x' && isX) || (['left-number', 'right-number'].includes(focus) && numeric && !isX) || (!['right-x', 'left-number', 'right-number'].includes(focus) && (numeric || isX))) el.append(node('mark', part, isX ? '' : 'constant'));
    else el.append(document.createTextNode(part));
  }
}
function renderWork(parent, t, interactive = false) {
  const colors = E.entryColors(t);
  const p = E.phase(t), h = interactive ? E.hint(t) : null, bracket = focusedBracket(t, h), bracketIssue = ['left', 'right'].includes(p) && t.pending.operation === null && ['brackets', 'minusBracket', 'divideBracket'].includes(E.issues(t)[p === 'left' ? 0 : 1]), table = node('table'); table.setAttribute('aria-label', 'Linke Seite gleich rechte Seite mit Operation');
  const cols = node('colgroup'); for (const name of ['eq-left', 'eq-sign', 'eq-right', 'eq-pipe', 'eq-operation']) cols.append(node('col', '', name)); table.append(cols);
  const body = node('tbody'); table.append(body);
  function row(left, right, op, entries, active, focused = false) {
    const tr = node('tr'), texts = [left, '=', right, op !== null ? '|' : '', op ?? ''];
    texts.forEach((text, i) => {
      const column = ['left', 'equals', 'right', 'pipe', 'operation'][i], td = node('td', '', i === 0 ? 'left' : i === 1 || i === 3 ? 'sign' : ''); td.dataset.column = column;
      if (entries?.[column]) td.classList.add(entries[column] + '-entry');
      if (active === i) { td.append(answer); td.classList.add('active-cell'); }
      else markedText(td, text ?? '', focused ? h?.focus : '', column, bracketIssue ? bracket : undefined);
      tr.append(td);
    }); body.append(tr);
  }
  t.lines.forEach((l, i) => {
    const active = interactive && i === t.lines.length - 1 && p === 'operation' ? 4 : null;
    row(l.left, l.right, active === 4 ? '' : l.operation, colors.lines[i], active, i === t.lines.length - 1);
  });
  if (t.pending) row(t.pending.left, t.pending.right, null, colors.pending, interactive ? p === 'left' ? 0 : 2 : null);
  parent.replaceChildren(table);
}
function renderScores() {
  const counts = Object.fromEntries(['green', 'yellow', 'red', 'gray'].map(c => [c, state.board.filter(v => v === c).length]));
  q('[data-progress]').textContent = (20 - counts.gray) + ' von 20 Punkten belegt';
  q('[data-count]').textContent = state.totals.total + ' Aufgaben abgeschlossen';
  const dots = q('[data-dots]'); dots.replaceChildren();
  const names = {green: 'grün, ohne Fehler', yellow: 'gelb, mit Fehler oder Hilfe', red: 'rot, Schritt gelöst', gray: 'noch frei'};
  state.board.forEach((c, i) => { const dot = node('span', '', 'dot ' + c); dot.title = 'Punkt ' + (i + 1) + ': ' + names[c]; dot.setAttribute('role', 'img'); dot.setAttribute('aria-label', dot.title); dots.append(dot); });
  const t = task(); q('[data-task-status]').textContent = t.usedSolve ? 'Diese Aufgabe zählt rot. Der Punkt wurde bereits vergeben.' : t.tainted ? 'Diese Aufgabe zählt bei Abschluss gelb.' : t.done ? 'Diese Aufgabe zählt grün.' : 'Auf Anhieb richtig und ohne Hilfe: Diese Aufgabe kann grün werden.';
}
function renderHelp() {
  const h = E.hint(task()); q('[data-help-box]').hidden = !h;
  if (!h) return;
  q('[data-help-level]').textContent = 'Hilfe ' + h.level + ' von ' + E.HELP_COUNT;
  q('[data-help-text]').textContent = h.text;
  const bracket = focusedBracket(task(), h), visual = bracket?.rule || h.visual, el = q('[data-help-visual]'); el.replaceChildren();
  const equation = node('span', '', 'rule-equation');
  if (bracket) for (const part of visual.split(/([abc])/g)) equation.append(/^[abc]$/.test(part) ? node('mark', part, 'role-' + part) : document.createTextNode(part));
  else equation.textContent = visual;
  el.append(equation); el.hidden = !visual;
}
function renderAdvisory() {
  const t = task(), p = t.pending;
  let reasons = [];
  if (p && p.operation !== null && p.left === null && p.right === null) { try { reasons = A.advisory(E.current(t), p.operation); } catch {} }
  q('[data-advisory]').hidden = !reasons.length;
  q('[data-advisory-details]').hidden = true;
  q('[data-advisory-button]').setAttribute('aria-expanded', 'false');
  q('[data-advisory-text]').textContent = reasons.length ? 'Dieser Schritt könnte den Lösungsweg verlängern. Du kannst trotzdem weiterrechnen.' : '';
  q('[data-advisory-reasons]').textContent = reasons.join(' ');
}
function render() {
  if (!ready) return;
  const t = task(), p = E.phase(t), editing = p !== 'done';
  q('[data-exercise]').hidden = false; q('[data-task-label]').textContent = 'Aufgabe ' + t.id;
  q('[data-instruction]').textContent = E.instruction(t);
  q('[data-input-home]').append(answer); answer.value = t.input;
  answer.setAttribute('aria-label', E.instruction(t)); answer.placeholder = p === 'solution' ? 'Zahl, ℝ oder leer' : p === 'operation' ? '+ …, − …, · …, : …' : 'Dein Term';
  renderWork(q('[data-work]'), t, editing);
  q('[data-solution]').hidden = p !== 'solution' && p !== 'done';
  for (const color of ['green', 'yellow', 'red']) q('[data-solution]').classList.toggle(color + '-entry', E.entryColors(t).solution === color);
  q('[data-solution-input]').replaceChildren();
  if (p === 'solution') q('[data-solution-input]').append(answer);
  else if (p === 'done') q('[data-solution-input]').textContent = t.solution === 'R' ? 'ℝ' : t.solution;
  updateBraces();
  q('[data-keyboard]').hidden = !editing; q('[data-form]').hidden = !editing; q('[data-next]').hidden = editing;
  const solve = t.level === E.HELP_COUNT; q('[data-help]').textContent = solve ? 'Lösen' : 'Hilfe'; q('[data-help]').classList.toggle('solve', solve);
  q('[data-help]').setAttribute('aria-label', solve ? 'Aktuelle Eingabe lösen; Aufgabe zählt rot' : 'Nächste Hilfe zum aktuellen Schritt');
  q('[data-skip]').hidden = !E.canSkip(t);
  q('[data-simplify]').hidden = p !== 'operation' || !E.issues(t).some(Boolean);
  renderHelp(); renderAdvisory(); renderScores();
  q('[data-history-title]').textContent = 'Dein Verlauf · ' + state.totals.total + ' abgeschlossene Aufgaben';
  if (q('[data-history-panel]').open && historyDirty) renderHistory();
  if (editing) { const work = q('[data-work]'); work.scrollTop = work.scrollHeight; }
  showFeedback(lastFeedback, feedbackBad);
}
function renderHistory() {
  const list = q('[data-history-list]'); list.replaceChildren();
  const arc = state.archive;
  q('[data-archive]').textContent = arc.total ? arc.total + ' ältere Aufgaben zusammengefasst: ' + arc.green + ' grün, ' + arc.yellow + ' gelb, ' + arc.red + ' rot. ' + arc.unique + ' eindeutig, ' + arc.all + ' allgemeingültig, ' + arc.none + ' nicht lösbar.' : 'Die letzten höchstens 50 Aufgaben bleiben im Detail erhalten. Details werden erst beim Öffnen geladen.';
  for (const t of [...state.tasks].reverse()) {
    const d = node('details', '', 'history-item'); d.dataset.taskId = t.id;
    const status = t.done ? {green: 'ohne Fehler', yellow: 'mit Fehler/Hilfe', red: 'mit Lösen'}[t.award] : 'in Bearbeitung';
    d.append(node('summary', 'Aufgabe ' + t.id + ' · ' + t.initial + ' · ' + status));
    d.addEventListener('toggle', () => { if (!d.open || d.dataset.loaded) return; d.dataset.loaded = '1'; const w = node('div', '', 'work-scroll'); renderWork(w, t); d.append(w);
      if (t.done) d.append(node('p', ['ℝ', 'R'].includes(t.solution) ? 'L = ℝ' : 'L = {' + t.solution + '}', E.entryColors(t).solution + '-entry'));
      const ol = node('ol');
      for (const v of t.events) { let text;
        if (v.type === 'answer') text = {operation: 'Operation', left: 'Linke Seite', right: 'Rechte Seite', solution: 'Lösungsmenge'}[v.kind] + ': ' + (v.input || '(leer)') + ' · ' + (v.auto ? 'mit Lösen übernommen' : v.ok ? 'richtig' : 'noch nicht richtig');
        else if (v.type === 'help') text = 'Hilfe ' + v.level + ' angefordert';
        else text = {skip: 'Weiter frei umformen', simplify: 'Terme vereinfachen', change: 'Operation geändert'}[v.type];
        if (v.originalInput) text += ' · frühere Eingabe ' + v.originalInput + ', damalige Berechnung durch Klammern verdeutlicht';
        ol.append(node('li', text, v.auto ? 'red-entry' : ''));
      } d.append(ol);
    }); list.append(d);
  } historyDirty = false;
}
function checked(input = answer.value, auto = false) {
  if (!ready || task().done) return;
  const t = task(), result = E.apply(t, input, auto); E.account(state, t); historyDirty = true;
  showFeedback(result.ok ? t.done ? 'Richtig. Deine Lösungsmenge ist bestätigt.' : auto ? 'Diese Eingabe wurde gelöst und rot markiert. Rechne jetzt selbst weiter.' : 'Richtig. Weiter mit dem nächsten Schritt.' : result.error, !result.ok);
  render(); persist();
  if (!t.done) answer.focus({preventScroll: true});
}
function help() {
  if (!ready || task().done) return;
  if (task().level === E.HELP_COUNT) { checked(E.nextAnswer(task()), true); return; }
  E.requestHelp(task()); historyDirty = true; showFeedback(); render(); persist(); answer.focus({preventScroll: true});
}
function keyboardAction(key) {
  if (!ready || task().done) return;
  answer.focus({preventScroll: true});
  let start = answer.selectionStart ?? answer.value.length, end = answer.selectionEnd ?? start;
  if (key === 'left') { const pos = start !== end ? start : Math.max(0, start - 1); answer.setSelectionRange(pos, pos); return; }
  if (key === 'right') { const pos = start !== end ? end : Math.min(answer.value.length, end + 1); answer.setSelectionRange(pos, pos); return; }
  if (key === 'home' || key === 'end') { const pos = key === 'home' ? 0 : answer.value.length; answer.setSelectionRange(pos, pos); return; }
  if (key === 'backspace') { if (start === end) start = Math.max(0, start - 1); answer.setRangeText('', start, end, 'end'); }
  else if (key === 'delete') { if (start === end) end = Math.min(answer.value.length, end + 1); answer.setRangeText('', start, end, 'end'); }
  else { if (answer.value.length - (end - start) + key.length > 160) return; answer.setRangeText(key, start, end, 'end'); }
  draftChanged();
}
const keys = [['7','7'],['8','8'],['9','9'],['+','+'],['−','−'],['x','x'],['⌫','backspace'],['Entf','delete'],['4','4'],['5','5'],['6','6'],['·','·'],[':',':'],['ℝ','ℝ'],['←','left'],['→','right'],['1','1'],['2','2'],['3','3'],['(','('],[')',')'],['',''],['↤','home'],['↦','end'],['0','0'],[',',','],['',''],['',''],['',''],['',''],['',''],['','']];
const keyNames = {backspace: 'Zeichen vor dem Cursor löschen', delete: 'Zeichen nach dem Cursor löschen', left: 'Cursor nach links', right: 'Cursor nach rechts', home: 'Cursor zum Anfang', end: 'Cursor zum Ende', 'ℝ': 'Alle reellen Zahlen', ',': 'Dezimalkomma'};
function keyButton(label, key) { const family = key.length > 1 ? 'nav' : ['x', 'ℝ'].includes(key) ? 'symbol' : /^\d$/.test(key) || key === ',' ? 'number' : 'op'; const b = node('button', label, family); b.type = 'button'; b.dataset.key = key; b.setAttribute('aria-label', keyNames[key] || label); b.addEventListener('pointerdown', e => e.preventDefault()); b.addEventListener('click', () => keyboardAction(key)); return b; }
const keyWrap = node('div', '', 'key-grid-wrap'), keyGrid = node('div', '', 'key-grid'); keyWrap.append(keyGrid); q('[data-keyboard]').append(keyWrap);
keys.forEach(([label, key], i) => { const el = key ? keyButton(label, key) : node('span', '', 'key-spacer'); el.dataset.row = Math.floor(i / 8) + 1; el.dataset.col = i % 8 + 1; if (!key) el.setAttribute('aria-hidden', 'true'); keyGrid.append(el); });
q('[data-form]').addEventListener('submit', e => { e.preventDefault(); checked(); });
answer.addEventListener('input', draftChanged);
answer.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); checked(); } });
q('[data-help]').addEventListener('click', help);
q('[data-advisory-button]').addEventListener('click', () => {
  if (!ready || !task().pending?.operation) return;
  const open = q('[data-advisory-details]').hidden;
  q('[data-advisory-details]').hidden = !open;
  q('[data-advisory-button]').setAttribute('aria-expanded', String(open));
});
q('[data-alternative-help]').addEventListener('click', () => {
  if (!ready || !task().pending?.operation) return;
  E.changeOperation(task()); help();
});
q('[data-change]').addEventListener('click', () => { if (E.changeOperation(task())) { historyDirty = true; showFeedback(); render(); persist(); answer.focus({preventScroll: true}); } });
q('[data-skip]').addEventListener('click', () => { if (E.skipSimplification(task())) { historyDirty = true; showFeedback(); render(); persist(); answer.focus({preventScroll: true}); } });
q('[data-simplify]').addEventListener('click', () => { if (E.simplify(task())) { historyDirty = true; showFeedback(); render(); persist(); answer.focus({preventScroll: true}); } });
q('[data-next]').addEventListener('click', () => { if (E.newTask(state)) { historyDirty = true; showFeedback(); render(); persist(); q('.edulo-work').scrollTop = 0; } });
q('[data-history-panel]').addEventListener('toggle', () => { if (ready && q('[data-history-panel]').open && historyDirty) renderHistory(); });
q('[data-retry]').addEventListener('click', () => ready ? persist() : start());
function fit() {
  let bottom = window.innerHeight, top = Math.max(0, root.getBoundingClientRect().top);
  for (let p = root.parentElement; p && p !== document.documentElement; p = p.parentElement) if (/hidden|clip|auto|scroll/.test(getComputedStyle(p).overflowY)) bottom = Math.min(bottom, p.getBoundingClientRect().bottom);
  root.style.setProperty('--edulo-height', Math.max(180, bottom - top - 12) + 'px');
}
function flushDraft() { if (draftTimer) persist(); }
window.addEventListener('resize', fit); window.addEventListener('pagehide', flushDraft); window.addEventListener('blur', flushDraft);
const onVisibility = () => { if (document.hidden) flushDraft(); }; document.addEventListener('visibilitychange', onVisibility);
const cleanup = new MutationObserver(() => { if (!root.isConnected) { clearTimeout(draftTimer); window.removeEventListener('resize', fit); window.removeEventListener('pagehide', flushDraft); window.removeEventListener('blur', flushDraft); document.removeEventListener('visibilitychange', onVisibility); cleanup.disconnect(); } });
cleanup.observe(document.documentElement, {childList: true, subtree: true});
async function start() {
  q('[data-controls]').disabled = true;
  try {
    const loaded = await bridge.load();
    state = E.upgrade(loaded.data);
    if (JSON.stringify(loaded.scores) !== JSON.stringify(state.board)) throw Error('Punktestand und Aufgabenstand passen nicht zusammen. Originalstand bleibt erhalten.');
    ready = true; const isNew = !state.tasks.length; if (isNew) E.newTask(state);
    historyDirty = true; render(); fit(); q('[data-controls]').disabled = bridge.getStatus().mode === 'editor';
    if (isNew) persist();
  } catch (e) { ready = false; q('[data-storage]').textContent = e.message; q('[data-retry]').hidden = false; }
}
fit();
// Test builds inject their read-only harness at this stable marker.
/* TEST_HOOK */
start();
