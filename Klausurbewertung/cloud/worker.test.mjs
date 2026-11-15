import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import worker, {
  ArchiveStore, SqlArchiveRepository, MAX_BODY_BYTES, CHUNK_BYTES,
  digestKey, constantTimeEqual, validateStore,
} from './worker.mjs';

// Public, deterministic test fixture. This is not a deployed access key.
const TEST_KEY = 'A'.repeat(43);
const env = { ARCHIVE_KEY_SHA256: await digestKey(TEST_KEY) };
const emptyStore = () => ({ version: 1, currentExamId: null, exams: [], taskBlockLibrary: [], classListLibrary: [] });
const populatedStore = () => ({
  ...emptyStore(), currentExamId: 'exam-1',
  exams: [{ metadata: { id: 'exam-1', title: 'Fixture' }, students: [{ id: 'student-1' }],
    structure: [{ id: 'criterion-1', parentId: null }], evaluations: {}, printLayout: {} }],
  taskBlockLibrary: [{ id: 'template-1', nodes: [{ id: 'criterion-2' }] }],
  classListLibrary: [{ id: 'class-1', students: [{ vorname: 'Fixture' }] }],
});

function sqliteStorage() {
  const database = new DatabaseSync(':memory:');
  return {
    database,
    sql: {
      exec(query, ...bindings) {
        const result = database.prepare(query).all(...bindings);
        return { toArray: () => result, [Symbol.iterator]: () => result[Symbol.iterator]() };
      },
    },
    transactionSync(callback) {
      database.exec('BEGIN');
      try { const value = callback(); database.exec('COMMIT'); return value; }
      catch (error) { database.exec('ROLLBACK'); throw error; }
    },
  };
}

function fixture(t) {
  const storage = sqliteStorage();
  t.after(() => storage.database.close());
  return { storage, object: new ArchiveStore({ storage }, env) };
}

function request(path, { method = 'GET', auth = true, origin, body, headers = {} } = {}) {
  const all = { ...headers };
  if (auth) all.Authorization = `Bearer ${TEST_KEY}`;
  if (origin !== undefined) all.Origin = origin;
  if (body !== undefined) all['Content-Type'] ??= 'application/json';
  return new Request(`https://archive.example${path}`, {
    method, headers: all, ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
}

test('health is public; protected endpoints fail closed without digest or Bearer', async t => {
  const { object } = fixture(t);
  assert.deepEqual(await (await object.fetch(request('/health', { auth: false }))).json(), { ok: true });
  for (const path of ['/archive', '/backups', '/backups/1']) {
    const response = await object.fetch(request(path, { auth: false, headers: { Cookie: `key=${TEST_KEY}` } }));
    assert.equal(response.status, 401);
  }
  assert.equal((await object.fetch(request('/archive', { auth: false, headers: { Authorization: `Bearer ${'B'.repeat(43)}` } }))).status, 401);
  assert.equal((await object.fetch(request('/archive', { auth: false, headers: { Authorization: `Basic ${TEST_KEY}` } }))).status, 401);
  const unconfigured = new ArchiveStore({ storage: sqliteStorage() }, {});
  t.after(() => unconfigured.repository.storage.database.close());
  assert.equal((await unconfigured.fetch(request('/archive'))).status, 503);
  assert.ok(constantTimeEqual(env.ARCHIVE_KEY_SHA256, env.ARCHIVE_KEY_SHA256));
  assert.ok(!constantTimeEqual(env.ARCHIVE_KEY_SHA256, `f${env.ARCHIVE_KEY_SHA256.slice(1)}`));
});

test('CORS allows only exact Pages origin and literal null, never cookie credentials', async t => {
  const { object } = fixture(t);
  for (const origin of ['https://hdb-productions.github.io', 'null']) {
    const response = await object.fetch(request('/archive', { origin }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
    assert.equal(response.headers.get('Access-Control-Allow-Credentials'), null);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    const denied = await object.fetch(request('/archive', { auth: false, origin }));
    assert.equal(denied.status, 401);
    assert.equal(denied.headers.get('Access-Control-Allow-Origin'), origin);
    const preflight = await object.fetch(request('/archive', { method: 'OPTIONS', auth: false, origin, headers: {
      'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'authorization, CONTENT-TYPE',
    } }));
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('Access-Control-Allow-Headers'), 'Authorization, Content-Type');
    assert.match(preflight.headers.get('Vary'), /Access-Control-Request-Method/);
  }
  for (const origin of ['https://hdb-productions.github.io.evil.example', 'http://hdb-productions.github.io', 'https://evil.example']) {
    const response = await object.fetch(request('/archive', { origin }));
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
  const cli = await object.fetch(request('/archive'));
  assert.equal(cli.status, 200);
  assert.equal(cli.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal((await object.fetch(request('/archive', { method: 'OPTIONS', origin: 'null', headers: {
    'Access-Control-Request-Method': 'DELETE',
  } }))).status, 403);
  assert.equal((await object.fetch(request('/archive', { method: 'OPTIONS', origin: 'null', headers: {
    'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'x-evil',
  } }))).status, 403);
});

test('exact routing and allowed methods cannot expose or mutate arbitrary paths', async t => {
  const { object } = fixture(t);
  for (const path of ['/archive/', '/archive?key=ignored', '/backups/0', '/backups/01', '/backups/1/restore', '/unknown']) {
    assert.equal((await object.fetch(request(path))).status, 404);
  }
  for (const [path, method] of [['/archive', 'POST'], ['/archive', 'DELETE'], ['/backups/1', 'PUT'], ['/health', 'HEAD']]) {
    const response = await object.fetch(request(path, { method }));
    assert.equal(response.status, 405);
    assert.ok(response.headers.get('Allow'));
  }
});

test('empty archive, CAS writes, and simultaneous stale clients', async t => {
  const { object } = fixture(t);
  assert.deepEqual(await (await object.fetch(request('/archive'))).json(), { revision: 0, store: null, updatedAt: null });
  const store = populatedStore();
  const concurrent = await Promise.all([1, 2].map(() => object.fetch(request('/archive', {
    method: 'PUT', body: { baseRevision: 0, store },
  }))));
  assert.deepEqual(concurrent.map(response => response.status).sort(), [200, 409]);
  const conflict = concurrent.find(response => response.status === 409);
  assert.deepEqual(await conflict.json(), { error: 'conflict', revision: 1 });
  const head = await (await object.fetch(request('/archive'))).json();
  assert.equal(head.revision, 1);
  assert.ok(!Number.isNaN(Date.parse(head.updatedAt)));
  assert.deepEqual(head.store, store);
  assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: { baseRevision: 1, store: emptyStore() } }))).status, 200);
});

test('snapshots survive object recreation; retain head plus 20 previous, metadata list omits data', async t => {
  const { storage, object } = fixture(t);
  for (let index = 0; index < 24; index++) {
    const store = emptyStore();
    store.fixtureCounter = index;
    const response = await object.fetch(request('/archive', { method: 'PUT', body: { baseRevision: index, store } }));
    assert.equal(response.status, 200);
  }
  const recreated = new ArchiveStore({ storage }, env);
  const list = await (await recreated.fetch(request('/backups'))).json();
  assert.equal(list.backups.length, 20);
  assert.deepEqual(list.backups.map(item => item.revision), Array.from({ length: 20 }, (_, index) => 23 - index));
  assert.deepEqual(Object.keys(list.backups[0]).sort(), ['bytes', 'revision', 'updatedAt']);
  assert.equal((await recreated.fetch(request('/backups/3'))).status, 404);
  assert.equal((await (await recreated.fetch(request('/backups/4'))).json()).store.fixtureCounter, 3);
  assert.equal((await (await recreated.fetch(request('/archive'))).json()).revision, 24);
  assert.equal(storage.database.prepare('SELECT count(*) AS n FROM archive_versions').get().n, 21);
});

test('large Unicode archive is stored as small binary chunks without corruption', t => {
  const { storage, object } = fixture(t);
  const store = emptyStore();
  store.largeFixture = '🧪ä'.repeat(450_000); // crosses several UTF-8 chunk boundaries
  const saved = object.repository.put(0, store);
  assert.equal(saved.revision, 1);
  assert.deepEqual(object.repository.get().store, store);
  const stats = storage.database.prepare('SELECT count(*) AS n, max(length(body)) AS largest FROM archive_chunks').get();
  assert.ok(stats.n > 10);
  assert.ok(stats.largest <= CHUNK_BYTES);
});

test('failed chunk write rolls back revision, snapshot and chunks together', t => {
  const { storage, object } = fixture(t);
  object.repository.put(0, emptyStore());
  const exec = storage.sql.exec.bind(storage.sql);
  storage.sql.exec = (query, ...bindings) => {
    if (query.startsWith('INSERT INTO archive_chunks') && bindings[1] === 1) throw new Error('Injected storage fault');
    return exec(query, ...bindings);
  };
  assert.throws(() => object.repository.put(1, { ...emptyStore(), filler: 'x'.repeat(CHUNK_BYTES + 1) }), /Injected/);
  assert.equal(object.repository.revision(), 1);
  assert.deepEqual(object.repository.get().store, emptyStore());
  assert.equal(storage.database.prepare('SELECT count(*) AS n FROM archive_versions').get().n, 1);
  assert.equal(storage.database.prepare('SELECT count(*) AS n FROM archive_chunks WHERE revision = 2').get().n, 0);
});

test('basic schema validation accepts real shape, rejects duplicate and malformed records', async t => {
  const { object } = fixture(t);
  assert.ok(validateStore(populatedStore()));
  const invalid = [];
  const mutate = edit => { const store = populatedStore(); edit(store); invalid.push(store); };
  mutate(store => { store.version = 2; });
  mutate(store => { store.currentExamId = 'missing'; });
  mutate(store => { store.exams.push(structuredClone(store.exams[0])); });
  mutate(store => { store.exams[0].students.push({ id: 'student-1' }); });
  mutate(store => { store.exams[0].structure = {}; });
  mutate(store => { store.exams[0].evaluations = []; });
  mutate(store => { store.taskBlockLibrary[0].nodes = [null]; });
  mutate(store => { store.classListLibrary[0].students = ['bad']; });
  mutate(store => { delete store.taskBlockLibrary; });
  for (const store of invalid) {
    assert.ok(!validateStore(store));
    assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: { baseRevision: 0, store } }))).status, 400);
  }
  for (const baseRevision of [-1, 0.5, '0', Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: { baseRevision, store: emptyStore() } }))).status, 400);
  }
  assert.equal(object.repository.revision(), 0);
});

test('body limits are enforced on streamed bytes; malformed JSON and wrong media type fail', async t => {
  const { object } = fixture(t);
  assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: '{broken' }))).status, 400);
  assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: '{}', headers: { 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: '{}', headers: { 'Content-Length': String(MAX_BODY_BYTES + 1) } }))).status, 413);
  assert.equal((await object.fetch(request('/archive', { method: 'PUT', body: ' '.repeat(MAX_BODY_BYTES + 1) }))).status, 413);
  const invalidUtf8 = new Request('https://archive.example/archive', {
    method: 'PUT', headers: { Authorization: `Bearer ${TEST_KEY}`, 'Content-Type': 'application/json' },
    body: new Uint8Array([0xff, 0xfe]),
  });
  assert.equal((await object.fetch(invalidUtf8)).status, 400);
  assert.equal(object.repository.revision(), 0);
});

test('worker uses one stable EU object; unauthorized calls never reach object', async t => {
  const { object } = fixture(t);
  const calls = [];
  const namespace = {
    idFromName(name) { calls.push(['name', name]); return 'stable-id'; },
    get(id) { assert.equal(id, 'stable-id'); return object; },
  };
  const outerEnv = { ...env, ARCHIVE: { jurisdiction(value) { calls.push(['jurisdiction', value]); return namespace; } } };
  assert.equal((await worker.fetch(request('/archive', { auth: false }), outerEnv)).status, 401);
  assert.deepEqual(calls, []);
  for (let i = 0; i < 2; i++) assert.equal((await worker.fetch(request('/archive'), outerEnv)).status, 200);
  assert.deepEqual(calls, [
    ['jurisdiction', 'eu'], ['name', 'single-owner-archive-v1'],
    ['jurisdiction', 'eu'], ['name', 'single-owner-archive-v1'],
  ]);
  const noJurisdiction = { ...env, ARCHIVE: { idFromName() { assert.fail('must not silently remove EU restriction'); } } };
  assert.equal((await worker.fetch(request('/archive'), noJurisdiction)).status, 500);
});
