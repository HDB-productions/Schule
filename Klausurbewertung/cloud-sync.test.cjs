"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
// The app's package is ESM; load the standalone UMD script in a CommonJS host.
const host = { module: { exports: {} }, URL };
vm.runInNewContext(fs.readFileSync(require.resolve("./cloud-sync.js"), "utf8"), host);
const { createClient, STORAGE_KEY } = host.module.exports;
const KEY = "a".repeat(43);
const copy = value => JSON.parse(JSON.stringify(value));
function store(ids = ["a"]) {
  return { version: 1, currentExamId: ids[0] || null,
    exams: ids.map(id => ({ metadata: { id, title: id }, students: [] })),
    taskBlockLibrary: [], classListLibrary: [] };
}
function memory() {
  const values = new Map();
  return { fail: false, getItem: key => values.get(key) || null,
    setItem(key, value) { if (this.fail) throw Error("quota"); values.set(key, value); },
    removeItem(key) { values.delete(key); } };
}
function server(initial = null) {
  const api = { revision: initial ? 1 : 0, store: copy(initial), offline: false, calls: [], status: null };
  api.fetch = async (url, init) => {
    assert.ok(url.endsWith("/archive"));
    assert.ok(!url.includes(KEY));
    assert.equal(init.headers.Authorization, "Bearer " + KEY);
    api.calls.push(init.method);
    if (api.offline) throw new TypeError("offline");
    if (api.status) return { ok: false, status: api.status };
    if (init.method === "PUT") {
      const body = JSON.parse(init.body);
      if (body.baseRevision !== api.revision) return { ok: false, status: 409 };
      api.store = copy(body.store); api.revision += 1;
    }
    const result = copy({ revision: api.revision, store: api.store, updatedAt: "2026-11-15T00:00:00Z" });
    return { ok: true, status: 200, json: async () => result };
  };
  return api;
}
function fixture(api, config = {}) {
  const box = config.box || { value: store() };
  const storage = config.storage || memory();
  const backups = [], statuses = [];
  const options = { storage, fetch: api.fetch,
    readStore: () => box.value,
    applyStore: next => { box.value = copy(next); },
    backup: (previous, reason) => { backups.push({ store: copy(previous), reason }); },
    onStatus: status => { statuses.push(status); },
    ...config.options };
  const client = createClient(options);
  return { client, box, storage, backups, statuses,
    edit(title) { box.value.exams[0].metadata.title = title; client.changed(); } };
}
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}
function holdFetch(api, method) {
  const entered = deferred(), released = deferred();
  let held = false;
  return { entered: entered.promise, release: released.resolve,
    fetch: async (url, init) => {
      const response = await api.fetch(url, init);
      if (init.method === method && !held) {
        held = true; entered.resolve(); await released.promise;
      }
      return response;
    } };
}

test("first connection and introduction of a device always require an explicit direction", async () => {
  const api = server();
  const f = fixture(api);
  await f.client.connect(KEY);
  assert.equal(f.client.getStatus().state, "choose");
  assert.equal(f.client.getStatus().connected, true);
  f.edit("local demo");
  assert.equal(f.client.getStatus().dirty, false);
  await f.client.syncNow();
  assert.deepEqual(api.calls, ["GET"]);
  await f.client.useLocal();
  assert.equal(api.store.exams[0].metadata.title, "local demo");
  assert.equal(f.client.getStatus().state, "synced");
  assert.equal(f.backups.length, 1);
  const other = fixture(api);
  await other.client.connect(KEY);
  assert.equal(other.client.getStatus().state, "choose");
  assert.equal(api.calls.filter(method => method === "PUT").length, 1);
});

test("explicit local merge retains remote-only exams and library records", async () => {
  const remote = store(["a", "remote"]);
  remote.taskBlockLibrary = [{ id: "same", value: "remote" }, { id: "remote", value: 1 }];
  remote.classListLibrary = [{ id: "remote", students: [1] }];
  const api = server(remote);
  const f = fixture(api, { options: { canApply: () => false } });
  f.box.value.taskBlockLibrary = [{ id: "same", value: "local" }];
  f.box.value.exams[0].metadata.title = "local";
  await f.client.connect(KEY); await f.client.useLocal();
  assert.equal(f.client.getStatus().state, "synced");
  assert.equal(api.store.exams[0].metadata.title, "local");
  assert.deepEqual(api.store.exams.map(exam => exam.metadata.id), ["a", "remote"]);
  assert.deepEqual(api.store.taskBlockLibrary, [{ id: "same", value: "local" }, { id: "remote", value: 1 }]);
  assert.deepEqual(f.box.value, api.store);
  assert.deepEqual(f.backups[0].store.exams.map(exam => exam.metadata.id), ["a"]);
});

test("two writers cannot overwrite a stale cloud revision and conflict survives reload", async () => {
  const api = server(store());
  const a = fixture(api), b = fixture(api);
  await a.client.connect(KEY); await a.client.useCloud();
  await b.client.connect(KEY); await b.client.useCloud();
  a.edit("writer A"); b.edit("writer B");
  await a.client.syncNow(); await b.client.syncNow();
  assert.equal(b.client.getStatus().state, "conflict");
  assert.equal(api.store.exams[0].metadata.title, "writer A");
  assert.equal(b.box.value.exams[0].metadata.title, "writer B");
  const reloaded = fixture(api, { box: b.box, storage: b.storage });
  const calls = api.calls.length;
  await reloaded.client.start(); await reloaded.client.syncNow();
  assert.equal(reloaded.client.getStatus().state, "conflict");
  assert.equal(api.calls.length, calls);
  await reloaded.client.useLocal();
  assert.equal(api.store.exams[0].metadata.title, "writer B");
});

test("offline edits persist their dirty flag and base revision across reload", async () => {
  const api = server(store());
  const f = fixture(api);
  await f.client.connect(KEY); await f.client.useCloud();
  api.offline = true;
  f.edit("offline edit");
  await f.client.syncNow();
  assert.equal(f.client.getStatus().state, "offline");
  const saved = JSON.parse(f.storage.getItem(STORAGE_KEY));
  assert.equal(saved.dirty, true); assert.equal(saved.baseRevision, 1);
  const reload = fixture(api, { box: f.box, storage: f.storage });
  api.offline = false; await reload.client.start();
  assert.equal(api.store.exams[0].metadata.title, "offline edit");
  assert.equal(reload.client.getStatus().dirty, false);
});

test("offline explicit merge keeps remote-only records available to the next retry", async () => {
  const api = server(store(["a", "remote"]));
  const f = fixture(api, { options: { fetch: async (url, init) => {
    if (init.method === "PUT") api.offline = true;
    return api.fetch(url, init);
  } } });
  await f.client.connect(KEY); await f.client.useLocal();
  assert.equal(f.client.getStatus().state, "offline");
  assert.deepEqual(f.box.value.exams.map(exam => exam.metadata.id), ["a", "remote"]);
  const reload = fixture(api, { box: f.box, storage: f.storage });
  api.offline = false; await reload.client.start();
  assert.deepEqual(api.store.exams.map(exam => exam.metadata.id), ["a", "remote"]);
});

test("edits made while PUT is pending are never marked clean", async () => {
  const api = server(store());
  const hold = holdFetch(api, "PUT");
  const f = fixture(api, { options: { fetch: hold.fetch } });
  await f.client.connect(KEY); await f.client.useCloud();
  f.edit("sent edit");
  const pending = f.client.syncNow(); await hold.entered;
  f.edit("newer edit"); hold.release(); await pending;
  assert.equal(f.client.getStatus().dirty, true);
  assert.equal(api.store.exams[0].metadata.title, "sent edit");
  assert.equal(JSON.parse(f.storage.getItem(STORAGE_KEY)).dirty, true);
  await f.client.syncNow();
  assert.equal(api.store.exams[0].metadata.title, "newer edit");
  assert.equal(f.client.getStatus().dirty, false);
});

test("GET in flight cannot replace a newer local edit", async () => {
  const api = server(store());
  const f = fixture(api);
  await f.client.connect(KEY); await f.client.useCloud();
  api.store.exams[0].metadata.title = "remote edit"; api.revision += 1;
  const hold = holdFetch(api, "GET");
  const reload = fixture(api, { box: f.box, storage: f.storage, options: { fetch: hold.fetch } });
  const pending = reload.client.start(); await hold.entered;
  reload.edit("local edit"); hold.release(); await pending;
  assert.equal(reload.box.value.exams[0].metadata.title, "local edit");
  assert.equal(reload.backups.length, 0);
  await reload.client.syncNow();
  assert.equal(reload.client.getStatus().state, "conflict");
  assert.equal(api.store.exams[0].metadata.title, "remote edit");
});

test("disconnect and reconnect invalidate an old connection response", async () => {
  const api = server(store());
  const hold = holdFetch(api, "GET");
  const f = fixture(api, { options: { fetch: hold.fetch } });
  const pending = f.client.connect(KEY); await hold.entered;
  f.client.disconnect(); hold.release(); await pending;
  assert.equal(f.client.getStatus().state, "disconnected");
  assert.equal(f.storage.getItem(STORAGE_KEY), null);
  assert.equal(f.backups.length, 0);
  await f.client.connect(KEY);
  assert.equal(f.client.getStatus().state, "choose");
});

test("automatic refresh waits for editor, preserves selection, and ignores selection-only reload changes", async () => {
  const api = server(store(["a", "b"]));
  let allowed = false;
  const f = fixture(api, { options: { canApply: () => allowed } });
  await f.client.connect(KEY); await f.client.useCloud();
  f.box.value.currentExamId = "b";
  f.client.changed();
  assert.equal(f.client.getStatus().dirty, false);
  api.store.exams[0].metadata.title = "remote"; api.revision += 1;
  await f.client.syncNow();
  assert.equal(f.box.value.exams[0].metadata.title, "a");
  allowed = true; await f.client.syncNow();
  assert.equal(f.box.value.exams[0].metadata.title, "remote");
  assert.equal(f.box.value.currentExamId, "b");
  const reload = fixture(api, { box: f.box, storage: f.storage });
  await reload.client.start();
  assert.equal(reload.client.getStatus().dirty, false);
  assert.equal(api.calls.filter(method => method === "PUT").length, 0);
});

test("a failed backup or local apply never marks an existing local archive linked or clean", async () => {
  const api = server(store(["remote"]));
  const f = fixture(api, { options: { backup: async () => { throw Error("disk"); } } });
  await f.client.connect(KEY); await f.client.useCloud();
  assert.equal(f.box.value.exams[0].metadata.id, "a");
  assert.equal(f.client.getStatus().linked, false);
  assert.equal(f.client.getStatus().state, "error");
  const g = fixture(api, { options: { applyStore: () => { throw Error("quota"); } } });
  await g.client.connect(KEY); await g.client.useCloud();
  assert.equal(g.client.getStatus().state, "error");
  assert.equal(g.client.getStatus().linked, false);
  assert.equal(api.calls.filter(method => method === "PUT").length, 0);
});

test("configuration persistence failures block login and upload without replacing previous config", async () => {
  const api = server(store());
  const storage = memory(); storage.fail = true;
  const f = fixture(api, { storage });
  await f.client.connect(KEY);
  assert.equal(f.client.getStatus().state, "error"); assert.equal(api.calls.length, 0);
  storage.fail = false;
  await f.client.connect(KEY); await f.client.useCloud();
  const previous = storage.getItem(STORAGE_KEY);
  storage.fail = true; f.edit("unsaved config");
  await f.client.syncNow();
  assert.equal(f.client.getStatus().state, "error");
  assert.equal(f.client.getStatus().dirty, true);
  assert.equal(storage.getItem(STORAGE_KEY), previous);
  assert.equal(api.calls.filter(method => method === "PUT").length, 0);
});

test("401 stops automatic retry, and neither status nor URL reveals credentials", async () => {
  const api = server(); api.status = 401;
  const f = fixture(api);
  await f.client.connect(KEY);
  const count = api.calls.length;
  assert.equal(f.client.getStatus().state, "auth");
  await f.client.syncNow(); await f.client.start();
  assert.equal(api.calls.length, count);
  assert.ok(!JSON.stringify(f.statuses).includes(KEY));
  api.status = null; await f.client.connect(KEY);
  assert.equal(f.client.getStatus().state, "choose");
});

test("client validates credentials and HTTPS endpoint", async () => {
  const api = server(); const f = fixture(api);
  await f.client.connect("https://example.org/?key=" + KEY);
  assert.equal(f.client.getStatus().state, "error"); assert.equal(api.calls.length, 0);
  for (const endpoint of ["http://example.org", "https://user:secret@example.org", "https://example.org?key=secret"]) {
    assert.throws(() => createClient({ endpoint, readStore: () => store(), applyStore() {}, fetch: api.fetch }));
  }
});

test("suspension invalidates in-flight work and all subsequent methods without touching storage", async () => {
  const api = server(store());
  const hold = holdFetch(api, "GET");
  const f = fixture(api, { options: { fetch: hold.fetch } });
  const pending = f.client.connect(KEY); await hold.entered;
  const saved = f.storage.getItem(STORAGE_KEY);
  f.client.suspend("Other tab wrote data");
  f.client.suspend("must not replace original reason");
  hold.release(); await pending;
  assert.equal(f.client.getStatus().state, "error");
  assert.equal(f.client.getStatus().suspended, true);
  assert.equal(f.client.getStatus().message, "Other tab wrote data");
  const count = api.calls.length;
  f.edit("no sync"); f.client.disconnect();
  await f.client.start(); await f.client.syncNow(); await f.client.connect(KEY);
  await f.client.useLocal(); await f.client.useCloud();
  assert.equal(api.calls.length, count);
  assert.equal(f.storage.getItem(STORAGE_KEY), saved);
  assert.equal(f.backups.length, 0);
});

test("failure to persist PUT acknowledgement keeps the previous durable dirty configuration", async () => {
  const api = server(store());
  const storage = memory();
  const f = fixture(api, { storage, options: { fetch: async (url, init) => {
    const response = await api.fetch(url, init);
    if (init.method === "PUT") storage.fail = true;
    return response;
  } } });
  await f.client.connect(KEY); await f.client.useCloud();
  f.edit("new edit"); const previous = storage.getItem(STORAGE_KEY);
  await f.client.syncNow();
  assert.equal(f.client.getStatus().state, "error");
  assert.equal(f.client.getStatus().dirty, true);
  assert.equal(f.client.getStatus().revision, 1);
  assert.equal(storage.getItem(STORAGE_KEY), previous);
  assert.equal(JSON.parse(previous).dirty, true);
  assert.ok(JSON.parse(previous).syncedSnapshot.length < 50);
  assert.equal(api.store.exams[0].metadata.title, "new edit");
});

test("a local edit during asynchronous backup cancels cloud replacement", async () => {
  const api = server(store(["remote"]));
  const entered = deferred(), released = deferred();
  const f = fixture(api, { options: { backup: async () => { entered.resolve(); await released.promise; } } });
  await f.client.connect(KEY);
  const pending = f.client.useCloud(); await entered.promise;
  f.edit("edited during backup"); released.resolve(); await pending;
  assert.equal(f.client.getStatus().state, "conflict");
  assert.equal(f.box.value.exams[0].metadata.title, "edited during backup");
  assert.equal(f.client.getStatus().linked, false);
});

test("concurrent sync calls share a single writer and disconnect invalidates pending PUT completion", async () => {
  const api = server(store()); const hold = holdFetch(api, "PUT");
  const f = fixture(api, { options: { fetch: hold.fetch } });
  await f.client.connect(KEY); await f.client.useCloud(); f.edit("pending");
  const first = f.client.syncNow(); const second = f.client.syncNow();
  assert.equal(first, second);
  await hold.entered; f.client.disconnect(); hold.release(); await first;
  assert.equal(api.calls.filter(method => method === "PUT").length, 1);
  assert.equal(f.client.getStatus().state, "disconnected");
  assert.equal(f.storage.getItem(STORAGE_KEY), null);
});
