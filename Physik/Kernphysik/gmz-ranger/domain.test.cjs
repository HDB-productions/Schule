const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const lesson = require('./lesson.js');
const domain = require('./domain.js');
const copy = value => JSON.parse(JSON.stringify(value));
const id = number => `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`;
const at = '2026-11-07T17:00:00.000Z';
const feedback = status => ({ summary: '', languageFeedback: '', nextSteps: [], misconceptions: [], criteria: lesson.criteria.map(c => ({ id: c.id, status, feedback: '' })), taskFeedback: [{ id: 'explanation', feedback: 'Prüfe die Zusammenhänge in deiner Erklärung.' }] });
const started = () => { const state = domain.fresh(); state.answer = 'Die Strahlung gelangt in das Gas und löst Elektronen heraus.'; return { state, attempt: domain.begin(state, id(1), at) }; };

test('browser scripts expose exact domain API without require', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'lesson.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'domain.js'), 'utf8') + '\nthis.testValid = GMZDomain.valid(GMZDomain.fresh());', context);
  assert.equal(context.testValid, true);
  assert.deepEqual(Object.keys(domain), ['fresh', 'valid', 'normalize', 'checkLabel', 'submitLabel', 'useHint', 'scores', 'migrateSnapshot', 'task', 'validFeedback', 'begin', 'finish', 'cached', 'applyCached']);
});
test('seven components plus twelve prose criteria leave the twentieth Edulo slot permanently unused', () => {
  const state = domain.fresh(); assert.equal(domain.valid(state), true);
  assert.deepEqual(lesson.components.map(c => c.id), ['window', 'cathode', 'anode', 'gas', 'voltage', 'counter', 'battery']);
  assert.equal(domain.scores(state).length, 20); assert.ok(domain.scores(state).every(s => s === 'gray'));
  assert.equal(lesson.criteria.length, 12);
  for (const c of lesson.components) domain.submitLabel(state, c.id, c.label);
  state.answer = 'Eine vollständige Erklärung im Unterrichtsmodell.';
  domain.finish(state, domain.begin(state, id(1), at), feedback('met'));
  assert.equal(domain.scores(state).filter(color => color !== 'gray').length, 19);
  assert.equal(domain.scores(state)[19], 'gray');
  assert.equal(/lösch|quench|ende der entladung/i.test(JSON.stringify(lesson)), false);
  assert.deepEqual(Object.keys(domain.task()), ['id', 'version', 'prompt', 'referenceAnswer', 'criteria', 'feedbackGroups']);
  assert.deepEqual(domain.task().feedbackGroups[0].criterionIds, lesson.criteria.map(c => c.id));
  assert.ok(domain.task().prompt.length <= 3000); assert.ok(domain.task().referenceAnswer.length <= 6000);
  for (const c of domain.task().criteria) assert.ok(c.description.length <= 600);
});
test('German aliases handle umlauts and one typo in long words while preserving polarity and distinct parts', () => {
  for (const c of lesson.components) for (const alias of c.aliases) assert.equal(domain.checkLabel(c.id, '  ' + alias.toUpperCase() + '  '), true, alias);
  assert.equal(domain.checkLabel('counter', 'Zaehlelektronik'), true);
  assert.equal(domain.checkLabel('cathode', 'Katode'), true);
  assert.equal(domain.checkLabel('window', 'Fenster kaputt'), false);
  assert.equal(domain.checkLabel('gas', ''), false);
  assert.equal(domain.checkLabel('anode', 'Kathode'), false);
  assert.equal(domain.checkLabel('window', 'Glimerfenster'), true);
  assert.equal(domain.checkLabel('cathode', 'Metallmantel'), true);
  assert.equal(domain.checkLabel('cathode', 'Plasikgehäuse'), false);
  assert.equal(domain.checkLabel('cathode', 'Gehäuse'), false);
  assert.equal(domain.checkLabel('cathode', 'Minuspol'), false);
  assert.equal(domain.checkLabel('anode', 'Pluspol'), false);
  assert.equal(domain.checkLabel('anode', 'negative Elektrode'), false);
  assert.equal(domain.checkLabel('cathode', 'positive Elektrode'), false);
});
test('mistakes and hints stay yellow on later success; earned scores persist across edits', () => {
  const state = domain.fresh();
  assert.equal(domain.submitLabel(state, 'window', 'Glimmerfenster'), true);
  assert.equal(domain.submitLabel(state, 'cathode', 'Anode'), false);
  assert.equal(state.labels.cathode.earned, 'gray');
  assert.equal(domain.submitLabel(state, 'cathode', 'Kathode'), true);
  domain.useHint(state, 'anode'); domain.submitLabel(state, 'anode', 'Anode');
  domain.submitLabel(state, 'window', 'falsch');
  assert.deepEqual(domain.scores(state).slice(0, 3), ['green', 'yellow', 'yellow']);
  assert.equal(domain.valid(copy(state)), true);
});
test('received criterion feedback only assists missing and partial aspects', () => {
  const { state, attempt } = started();
  assert.ok(Object.values(state.aspects).every(a => !a.assisted));
  const f = feedback('missing'); f.criteria[0].status = 'met'; f.criteria[1].status = 'partial';
  assert.equal(domain.finish(state, attempt, f), true);
  assert.equal(state.aspects.entry.earned, 'green'); assert.equal(state.aspects.entry.assisted, false);
  assert.equal(state.aspects.ionisation.assisted, true); assert.equal(state.aspects.charges.assisted, true);
  state.answer += ' Verbesserte Erklärung.';
  const next = domain.begin(state, id(2), at); domain.finish(state, next, feedback('met'));
  assert.equal(state.aspects.entry.earned, 'green'); assert.equal(state.aspects.ionisation.earned, 'yellow');
  assert.equal(domain.valid(copy(state)), true);
});
test('late feedback is retained but never awards or assists the changed current answer', () => {
  const { state, attempt } = started(); state.answer = 'Ein neuer Entwurf, während die Prüfung läuft.';
  assert.equal(domain.finish(state, attempt, feedback('met')), false);
  assert.equal(state.history[0].status, 'done'); assert.equal(state.history[0].applied, false);
  assert.ok(Object.values(state.aspects).every(a => a.earned === 'gray' && !a.assisted));
  assert.equal(domain.valid(copy(state)), true);
});
test('explicit cached feedback adoption awards the original answer exactly once without a new request', () => {
  const { state, attempt } = started(), original = state.answer;
  state.answer = 'Ein inzwischen veränderter Entwurf.';
  const f = feedback('missing'); f.criteria[0].status = 'met';
  domain.finish(state, attempt, f);
  assert.equal(domain.cached(state), null);
  assert.throws(() => domain.applyCached(state, attempt.requestId), /aktuellen Text/);
  state.answer = '  ' + original.replaceAll(' ', '\n') + ' ';
  assert.equal(domain.cached(state), attempt);
  assert.equal(domain.applyCached(state, attempt.requestId), true);
  assert.equal(state.history.length, 1); assert.equal(state.history[0].applied, true);
  assert.equal(state.aspects.entry.earned, 'green'); assert.equal(state.aspects.ionisation.assisted, true);
  assert.equal(domain.cached(state), null);
  const snapshot = copy(state);
  assert.equal(domain.applyCached(state, attempt.requestId), false); assert.deepEqual(state, snapshot);
  assert.equal(domain.valid(copy(state)), true);
});
test('duplicates cannot award again or replace the original feedback; unchanged rechecks cannot incur another call', () => {
  const { state, attempt } = started(); domain.finish(state, attempt, feedback('met'));
  const snapshot = copy(state); assert.equal(domain.finish(state, attempt, feedback('missing')), false); assert.deepEqual(state, snapshot);
  assert.throws(() => domain.begin(state, id(2), at), /bereits geprüft/);
  state.answer = '  ' + state.answer.replaceAll(' ', '\n') + '  ';
  assert.throws(() => domain.begin(state, id(2), at), /bereits geprüft/);
});
test('unknown pending requests block new spending and can finish after restoration', () => {
  const { state } = started(); state.history[0].status = 'unknown'; state.history[0].message = 'Zeitüberschreitung';
  state.answer += ' Neuer Text'; assert.throws(() => domain.begin(state, id(2), at), /ungeklärt/);
  const saved = copy(state); assert.equal(domain.valid(saved), true);
  assert.equal(domain.finish(saved, copy(saved.history[0]), feedback('met')), false);
  assert.equal(saved.history[0].status, 'done');
});
test('request identity, criterion schema and finished states reject malformed or misassigned results', () => {
  const { state, attempt } = started();
  const wrong = copy(attempt); wrong.answer += ' fremd';
  assert.throws(() => domain.finish(state, wrong, feedback('met')), /gehört nicht/);
  const duplicate = feedback('met'); duplicate.criteria[1].id = duplicate.criteria[0].id;
  assert.equal(domain.validFeedback(duplicate), false);
  assert.throws(() => domain.finish(state, attempt, duplicate), /Ungültige Rückmeldung/);
  state.history[0].status = 'failed'; assert.throws(() => domain.finish(state, attempt, feedback('met')), /abgeschlossen/);
  state.answer += ' Überarbeitung'; assert.doesNotThrow(() => domain.begin(state, id(2), at));
});
test('invalid saved drafts, scores, schemas, owners and request IDs are rejected without normalization', () => {
  const cases = [
    s => { s.answer = 3; }, s => { s.version = '2'; }, s => { s.ownerUid = 'foreign user'; },
    s => { s.labels.window.earned = 'green'; }, s => { s.labels.window.draft = 'x'.repeat(161); },
    s => { s.labels.window.attempts = -1; }, s => { s.aspects.entry.earned = 'yellow'; },
    s => { s.labels.extra = s.labels.window; }, s => { s.answer = 'x'.repeat(12001); }
  ];
  for (const mutate of cases) { const s = domain.fresh(); mutate(s); const before = copy(s); assert.equal(domain.valid(s), false); assert.deepEqual(s, before); }
  const { state } = started(); const broken = copy(state); broken.history[0].requestId = 'wrong'; assert.equal(domain.valid(broken), false);
  assert.throws(() => domain.begin(domain.fresh(), id(1), at), /zuerst eine Erklärung/);
});

const legacyIds = ['entry', 'ionisation', 'charges', 'field', 'electron_motion', 'ion_motion', 'avalanche', 'pulse', 'count', 'quenching', 'deadtime', 'efficiency', 'limits'];
const legacySnapshot = () => {
  const data = domain.fresh();
  data.aspects = Object.fromEntries(legacyIds.map(id => [id, { earned: 'gray', assisted: false }]));
  return { widget: lesson.id, version: 1, data, scores: Array(20).fill('gray') };
};
const legacyScores = data => [...lesson.components.map(c => data.labels[c.id].earned), ...legacyIds.map(id => data.aspects[id].earned)];

test('known history-free thirteen-aspect draft migrates without changing its original snapshot or earning points', () => {
  const snapshot = legacySnapshot();
  snapshot.data.labels.window.draft = 'Glimerfenster';
  snapshot.data.answer = 'Mein bisheriger Entwurf.  Mit Leerzeichen.';
  snapshot.data.ownerUid = 'ab-123456-abcdef-987654';
  const before = copy(snapshot), migrated = domain.migrateSnapshot(snapshot);
  assert.deepEqual(snapshot, before);
  assert.equal(migrated.version, 2);
  assert.equal(domain.valid(migrated.data), true);
  assert.deepEqual(migrated.data.labels, before.data.labels);
  assert.equal(migrated.data.answer, before.data.answer);
  assert.equal(migrated.data.ownerUid, before.data.ownerUid);
  assert.deepEqual(migrated.data.history, []);
  assert.deepEqual(migrated.data.retiredAspects, { quenching: before.data.aspects.quenching });
  assert.deepEqual(migrated.scores, Array(20).fill('gray'));
  assert.equal(Object.keys(migrated.data.aspects).length, 12);
  migrated.data.labels.window.draft = 'neuer Text';
  migrated.data.retiredAspects.quenching.assisted = true;
  assert.deepEqual(snapshot, before, 'migration must return an independent copy');
});

test('legacy earned and assisted values retain their semantic IDs and retired quenching is archived', () => {
  const snapshot = legacySnapshot();
  snapshot.data.labels.window = { draft: 'Glimmerfenster', earned: 'green', assisted: false, attempts: 1 };
  snapshot.data.labels.cathode = { draft: 'Kathode', earned: 'yellow', assisted: true, attempts: 2 };
  for (const [i, id] of legacyIds.entries()) snapshot.data.aspects[id] = { earned: i % 3 === 0 ? 'gray' : i % 3 === 1 ? 'green' : 'yellow', assisted: i % 3 !== 1 };
  snapshot.data.aspects.quenching = { earned: 'yellow', assisted: true };
  snapshot.scores = legacyScores(snapshot.data);
  const before = copy(snapshot), migrated = domain.migrateSnapshot(snapshot);
  assert.deepEqual(snapshot, before);
  for (const c of lesson.criteria) assert.deepEqual(migrated.data.aspects[c.id], snapshot.data.aspects[c.id], c.id);
  assert.deepEqual(migrated.data.labels, snapshot.data.labels);
  assert.deepEqual(migrated.data.retiredAspects.quenching, snapshot.data.aspects.quenching);
  assert.deepEqual(migrated.scores, [...snapshot.scores.slice(0, 16), ...snapshot.scores.slice(17), 'gray']);
  assert.equal(domain.valid(migrated.data), true);
  const restored = copy(migrated.data);
  domain.submitLabel(restored, 'anode', 'Anode');
  assert.deepEqual(restored.retiredAspects, migrated.data.retiredAspects, 'normal learning actions retain archived progress');
});

test('current twelve-aspect v1 snapshots preserve completed and pending history unchanged', () => {
  for (const done of [false, true]) {
    const { state, attempt } = started();
    if (done) domain.finish(state, attempt, feedback('met'));
    const snapshot = { widget: lesson.id, version: 1, data: state, scores: domain.scores(state) }, before = copy(snapshot);
    const migrated = domain.migrateSnapshot(snapshot);
    assert.deepEqual(migrated, { ...before, version: 2 });
    assert.deepEqual(snapshot, before);
    assert.equal(domain.valid(migrated.data), true);
  }
});

test('ambiguous histories, malformed states, unknown schemas and original score tampering fail without modifying source', () => {
  const cases = [
    s => { s.data.history = [{}]; },
    s => { const { state } = started(); s.data.history = state.history; },
    s => { s.data.labels.window.draft = 4; },
    s => { s.data.labels.window.earned = 'green'; },
    s => { s.data.aspects.quenching.earned = 'yellow'; },
    s => { s.data.aspects.unknown = { earned: 'gray', assisted: false }; },
    s => { delete s.data.aspects.deadtime; },
    s => { s.data.version = 1; },
    s => { s.data.ownerUid = 'unbekannt'; },
    s => { s.widget = 'foreign'; },
    s => { s.version = 2; },
    s => { s.data.extra = true; },
    s => { s.scores[0] = 'green'; },
    s => { s.scores[16] = 'yellow'; },
    s => { s.scores[19] = 'green'; },
    s => { s.scores.pop(); },
    s => { s.data.aspects.quenching = { earned: 'gray', assisted: false, extra: true }; }
  ];
  for (const mutate of cases) {
    const snapshot = legacySnapshot(); mutate(snapshot); const before = copy(snapshot);
    assert.throws(() => domain.migrateSnapshot(snapshot), /Originaldaten bleiben erhalten/);
    assert.deepEqual(snapshot, before);
  }
  const current = { widget: lesson.id, version: 1, data: domain.fresh(), scores: Array(20).fill('gray') };
  current.scores[19] = 'green';
  assert.throws(() => domain.migrateSnapshot(current), /Originaldaten bleiben erhalten/);
});

test('retired aspect archive accepts only the exact known aspect with valid scores', () => {
  const state = domain.migrateSnapshot(legacySnapshot()).data;
  for (const mutate of [s => { s.retiredAspects.other = {}; }, s => { s.retiredAspects.quenching.earned = 'greenish'; }, s => { s.retiredAspects.quenching.earned = 'yellow'; }, s => { s.retiredAspects.quenching.extra = true; }, s => { s.retiredAspects = null; }]) {
    const invalid = copy(state); mutate(invalid); assert.equal(domain.valid(invalid), false);
  }
});

test('bridge migration performs no load writes and saves the new schema only after an explicit learning action', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../../../tools/edulo/runtime/bridge.js'), 'utf8');
  const localKey = 'schule-edulo:' + lesson.id;
  const snapshot = legacySnapshot();
  snapshot.data.labels.window.draft = 'Glimmerfenster';
  const raw = 'EDULO2:' + Buffer.from(JSON.stringify(snapshot)).toString('base64');
  let stored = raw, writes = 0;
  const noop = () => {};
  const document = { documentElement: {}, body: { classList: { contains: () => false } }, querySelectorAll: () => [], addEventListener: noop, removeEventListener: noop };
  const window = { document, location: { search: '' }, addEventListener: noop, removeEventListener: noop }; window.parent = window; window.top = window;
  const root = { isConnected: true, contains: () => false, addEventListener: noop, removeEventListener: noop };
  const context = vm.createContext({ window, document, location: window.location, URLSearchParams, TextEncoder, TextDecoder, atob, btoa, setTimeout, clearTimeout,
    MutationObserver: class { observe() {} disconnect() {} },
    localStorage: { getItem: key => { assert.equal(key, localKey); return stored; }, setItem: (key, value) => { assert.equal(key, localKey); stored = value; writes++; } },
    options: { root, widgetId: lesson.id, stateVersion: 2, fresh: domain.fresh, validate: domain.valid, migrateSnapshot: domain.migrateSnapshot }
  });
  vm.runInContext(source + '\nthis.bridge = createEduloBridge(options);', context);
  const loaded = await context.bridge.load();
  assert.equal(writes, 0); assert.equal(stored, raw);
  assert.equal(loaded.version, 2); assert.equal(domain.valid(loaded.data), true);
  domain.submitLabel(loaded.data, 'window', loaded.data.labels.window.draft);
  context.bridge.save(loaded.data, domain.scores(loaded.data));
  assert.equal(writes, 1);
  const saved = JSON.parse(Buffer.from(stored.slice('EDULO2:'.length), 'base64').toString('utf8'));
  assert.equal(saved.version, 2); assert.equal(saved.data.labels.window.earned, 'green');
  assert.deepEqual(saved.data.retiredAspects, { quenching: snapshot.data.aspects.quenching });
  assert.equal(saved.scores[19], 'gray');
  context.bridge.dispose();

  snapshot.data.history = [{}];
  stored = 'EDULO2:' + Buffer.from(JSON.stringify(snapshot)).toString('base64');
  const rejected = stored;
  vm.runInContext('this.rejectedBridge = createEduloBridge(options);', context);
  await assert.rejects(context.rejectedBridge.load(), /Originaldaten bleiben erhalten/);
  assert.equal(stored, rejected); assert.equal(writes, 1);
  context.rejectedBridge.dispose();
});
