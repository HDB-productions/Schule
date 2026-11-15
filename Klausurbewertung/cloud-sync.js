(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.KlausurCloud = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var DEFAULT_ENDPOINT = "https://klausurbewertung-sync.hildebrandt.workers.dev";
  var DEFAULT_STORAGE_KEY = "klausurbewertung-cloud-v1";
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function snapshot(store) {
    var copy = Object.assign({}, store);
    if (copy && typeof copy === "object") delete copy.currentExamId;
    var raw = JSON.stringify(copy), first = 2166136261, second = 0;
    // Bounded change detector (FNV-1a + Jenkins); never a security/authentication hash.
    for (var index = 0; index < raw.length; index += 1) {
      var code = raw.charCodeAt(index);
      first = Math.imul(first ^ code, 16777619);
      second = (second + code) | 0;
      second = (second + (second << 10)) | 0;
      second ^= second >>> 6;
    }
    second = (second + (second << 3)) | 0;
    second ^= second >>> 11;
    second = (second + (second << 15)) | 0;
    return raw.length.toString(36) + ":" + (first >>> 0).toString(16) + ":" + (second >>> 0).toString(16);
  }
  function mergeRecords(local, remote, id) {
    var result = clone(local || []);
    var ids = new Set(result.map(id));
    (remote || []).forEach(function (record) {
      if (!ids.has(id(record))) { result.push(clone(record)); ids.add(id(record)); }
    });
    return result;
  }
  // The explicit local choice keeps local versions and retains cloud-only records.
  function mergeStores(local, remote) {
    if (!remote) return clone(local);
    var merged = Object.assign({}, clone(remote), clone(local));
    merged.exams = mergeRecords(local.exams, remote.exams, function (exam) { return exam.metadata.id; });
    ["taskBlockLibrary", "classListLibrary"].forEach(function (name) {
      merged[name] = mergeRecords(local[name], remote[name], function (record) { return record.id; });
    });
    return merged;
  }

  function createClient(options) {
    options = options || {};
    var endpoint = options.endpoint || DEFAULT_ENDPOINT;
    var url = new URL(endpoint);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      throw new Error("Die Cloud-Adresse muss HTTPS ohne Zugangsdaten oder URL-Parameter verwenden.");
    }
    endpoint = url.href.replace(/\/$/, "");
    var storage = options.storage || (typeof localStorage !== "undefined" ? localStorage : null);
    var fetcher = options.fetch || (typeof fetch !== "undefined" ? fetch.bind(globalThis) : null);
    var storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
    var readStore = options.readStore;
    var applyStore = options.applyStore;
    if (typeof readStore !== "function" || typeof applyStore !== "function" || !fetcher) {
      throw new Error("readStore, applyStore und fetch werden benötigt.");
    }
    var data = { key: null, linked: false, dirty: false, baseRevision: 0, syncedSnapshot: null, authBlocked: false, needsChoice: false };
    var state = "disconnected", message = "Cloud nicht verbunden.";
    var session = 0, generation = 0, busy = null, remote = null, storageWarning = false, suspended = false;

    function getStatus() {
      return {
        state: state, message: message, revision: data.baseRevision,
        connected: !!data.key && !data.authBlocked && !suspended, linked: data.linked, suspended: suspended,
        dirty: data.dirty, conflict: state === "conflict", busy: !!busy,
        cloudEmpty: remote ? !remote.store : undefined, storageWarning: storageWarning
      };
    }
    function emit(next, text) {
      state = next; message = text;
      if (options.onStatus) options.onStatus(getStatus());
    }
    function conflict(text) {
      data.needsChoice = true;
      persist();
      emit("conflict", text);
    }
    function persist() {
      try {
        if (!storage) throw new Error("storage unavailable");
        storage.setItem(storageKey, JSON.stringify(Object.assign({ endpoint: endpoint }, data)));
        storageWarning = false;
      } catch (_) {
        storageWarning = true;
        var error = new Error("Die Cloud-Einstellungen konnten nicht dauerhaft gespeichert werden.");
        error.kind = "storage";
        throw error;
      }
    }
    function restore() {
      try {
        var saved = storage && JSON.parse(storage.getItem(storageKey));
        if (saved && saved.endpoint === endpoint && /^[A-Za-z0-9_-]{43}$/.test(saved.key) &&
            Number.isSafeInteger(saved.baseRevision) && saved.baseRevision >= 0) {
          data = {
            key: saved.key, linked: saved.linked === true, dirty: saved.dirty === true,
            baseRevision: saved.baseRevision, syncedSnapshot: saved.syncedSnapshot || null,
            authBlocked: saved.authBlocked === true, needsChoice: saved.needsChoice === true
          };
          // A local save may have succeeded immediately before the browser closed.
          if (data.linked && snapshot(readStore()) !== data.syncedSnapshot) data.dirty = true;
        }
      } catch (_) { storageWarning = true; }
    }
    restore();
    function active(token) { return token === session && !!data.key && !suspended; }
    function commit(patch) {
      var previous = data;
      data = Object.assign({}, data, patch);
      try { persist(); } catch (error) { data = previous; throw error; }
    }
    function canApply() { return !options.canApply || options.canApply(); }
    function preserveSelection(store) {
      var selected = readStore().currentExamId;
      var result = clone(store);
      if ((result.exams || []).some(function (exam) { return exam.metadata.id === selected; })) result.currentExamId = selected;
      return result;
    }
    async function request(method, token, body) {
      var response = await fetcher(endpoint + "/archive", {
        method: method,
        headers: Object.assign({ Authorization: "Bearer " + data.key }, body ? { "Content-Type": "application/json" } : {}),
        cache: "no-store",
        body: body ? JSON.stringify(body) : undefined
      });
      if (!active(token)) return null;
      if (!response.ok) {
        var error = new Error("Cloud-Anfrage fehlgeschlagen.");
        error.status = response.status;
        throw error;
      }
      var envelope = await response.json();
      if (!active(token)) return null;
      if (!envelope || !Number.isSafeInteger(envelope.revision) || envelope.revision < 0 ||
          (envelope.store !== null && (!envelope.store || !Array.isArray(envelope.store.exams)))) {
        throw new Error("Ungültige Cloud-Antwort.");
      }
      return envelope;
    }
    function handleError(error, token) {
      if (!active(token)) return;
      if (error.status === 401) {
        data.authBlocked = true;
        try { persist(); } catch (_) { /* Stop this session even if storage is unavailable. */ }
        emit("auth", "Schlüssel ungültig. Bitte erneut verbinden.");
      } else if (error.status === 409) {
        data.needsChoice = true;
        try { persist(); } catch (_) { /* Dirty state still prevents a successful stale PUT. */ }
        emit("conflict", "Die Cloud wurde auf einem anderen Gerät geändert. Bitte eine Richtung wählen.");
      } else if (error.kind === "storage") {
        emit("error", "Cloud-Abgleich angehalten: Einstellungen konnten nicht gespeichert werden. Bitte Speicherplatz und Browser-Speicher prüfen.");
      } else if (error.kind === "local") {
        emit("error", "Übernahme angehalten: Die lokale Sicherung oder Speicherung ist fehlgeschlagen. Die Daten wurden nicht als synchronisiert markiert.");
      } else {
        emit("offline", "Cloud nicht erreichbar. Lokale Änderungen bleiben gespeichert; der nächste Abgleich versucht es erneut.");
      }
    }
    function run(task) {
      if (suspended) return Promise.resolve();
      if (busy) return busy;
      var token = session;
      var operation = Promise.resolve().then(function () { return task(token); }).catch(function (error) {
        handleError(error, token);
      }).finally(function () {
        if (busy === operation) {
          busy = null;
          if (options.onStatus) options.onStatus(getStatus());
        }
      });
      busy = operation;
      return operation;
    }
    async function backup(store, reason) {
      try {
        if (typeof options.backup !== "function") throw new Error("backup required");
        await options.backup(clone(store), reason);
      } catch (_) { var error = new Error("Lokale Sicherung fehlgeschlagen."); error.kind = "local"; throw error; }
    }
    async function apply(store) {
      try { await applyStore(store); }
      catch (_) { var error = new Error("Lokale Speicherung fehlgeschlagen."); error.kind = "local"; throw error; }
    }
    function choose() { emit("choose", "Bitte wählen: Cloud übernehmen oder lokale Daten mit der Cloud zusammenführen."); }
    async function put(store, token, sentGeneration) {
      // Never send an edit whose pending status has not reached durable storage.
      persist();
      var result = await request("PUT", token, { baseRevision: data.baseRevision, store: clone(store) });
      if (!result || !active(token)) return;
      remote = result;
      commit({ baseRevision: result.revision, syncedSnapshot: snapshot(store), linked: true,
        dirty: generation !== sentGeneration || snapshot(readStore()) !== snapshot(store), needsChoice: false });
      emit(data.dirty ? "pending" : "synced", data.dirty ? "Weitere lokale Änderungen warten auf den Abgleich." : "Mit der Cloud synchronisiert.");
    }
    async function sync(token) {
      if (!active(token) || data.authBlocked || state === "choose" || state === "conflict") return;
      if (data.needsChoice) { emit("conflict", "Bitte eine Richtung für den Cloud-Abgleich wählen."); return; }
      if (!data.linked) {
        emit("connecting", "Cloud wird geladen …");
        remote = await request("GET", token);
        if (remote) choose();
        return;
      }
      if (data.dirty) {
        var sentGeneration = generation;
        var local = clone(readStore());
        emit("syncing", "Lokale Änderungen werden gesichert …");
        await put(local, token, sentGeneration);
        return;
      }
      var before = generation;
      var result = await request("GET", token);
      if (!result) return;
      remote = result;
      if (generation !== before || data.dirty) {
        emit("pending", "Lokale Änderungen warten auf den Abgleich.");
        return;
      }
      if (result.revision === data.baseRevision) {
        emit("synced", "Mit der Cloud synchronisiert.");
        return;
      }
      if (result.revision < data.baseRevision || !result.store) {
        conflict("Der Cloud-Stand wurde zurückgesetzt. Bitte eine Richtung wählen.");
        return;
      }
      if (!canApply()) { emit("pending", "Ein neuer Cloud-Stand wartet, bis die Bearbeitung abgeschlossen ist."); return; }
      await backup(readStore(), "cloud-update");
      if (!active(token) || generation !== before || data.dirty || !canApply()) return;
      await apply(preserveSelection(result.store));
      if (!active(token)) return;
      commit({ baseRevision: result.revision, syncedSnapshot: snapshot(result.store), dirty: generation !== before });
      emit(data.dirty ? "pending" : "synced", "Neuer Cloud-Stand übernommen.");
    }
    function syncNow() { return run(sync); }
    function start() {
      if (suspended) return Promise.resolve();
      if (!data.key) { emit("disconnected", "Cloud nicht verbunden."); return Promise.resolve(); }
      if (data.authBlocked) { emit("auth", "Bitte mit einem gültigen Schlüssel erneut verbinden."); return Promise.resolve(); }
      if (data.needsChoice) { emit("conflict", "Bitte eine Richtung für den Cloud-Abgleich wählen."); return Promise.resolve(); }
      return syncNow();
    }
    function connect(key) {
      if (suspended) return Promise.resolve();
      key = String(key || "").trim();
      if (!/^[A-Za-z0-9_-]{43}$/.test(key)) {
        emit("error", "Der Schlüssel muss aus 43 Zeichen (Buchstaben, Ziffern, _ oder -) bestehen.");
        return Promise.resolve();
      }
      session += 1; busy = null; remote = null;
      var previous = data;
      if (data.key !== key) data = { key: key, linked: false, dirty: false, baseRevision: 0, syncedSnapshot: null, authBlocked: false, needsChoice: false };
      else data = Object.assign({}, data);
      data.key = key; data.authBlocked = false;
      if (data.linked && snapshot(readStore()) !== data.syncedSnapshot) data.dirty = true;
      try { persist(); } catch (error) {
        data = previous;
        emit("error", "Verbindung angehalten: Cloud-Einstellungen konnten nicht gespeichert werden.");
        return Promise.resolve();
      }
      emit("connecting", "Verbindung wird geprüft …");
      // Always authenticate via GET before resuming a previous link.
      return run(async function (token) {
        var result = await request("GET", token);
        if (!result) return;
        remote = result;
        if (!data.linked) choose();
        else if (data.needsChoice) emit("conflict", "Bitte eine Richtung für den Cloud-Abgleich wählen.");
        else if (data.dirty && result.revision !== data.baseRevision) conflict("Die Cloud wurde zwischenzeitlich geändert. Bitte eine Richtung wählen.");
        else await sync(token);
      });
    }
    function disconnect() {
      if (suspended) return;
      session += 1; busy = null; remote = null;
      data = { key: null, linked: false, dirty: false, baseRevision: 0, syncedSnapshot: null, authBlocked: false, needsChoice: false };
      try { if (storage) storage.removeItem(storageKey); } catch (_) { storageWarning = true; }
      emit("disconnected", "Cloud getrennt. Lokale Daten bleiben erhalten.");
    }
    function changed() {
      if (suspended) return;
      if (data.linked && !data.dirty && snapshot(readStore()) === data.syncedSnapshot) return;
      generation += 1;
      if (!data.key || !data.linked) return;
      data.dirty = true;
      try { persist(); } catch (error) { handleError(error, session); return; }
      if (state !== "conflict" && state !== "auth") emit("pending", "Lokale Änderungen warten auf den Abgleich.");
    }
    function useCloud() {
      return run(async function (token) {
        if (!active(token) || data.authBlocked) return;
        var before = generation;
        var result = await request("GET", token);
        if (!result) return;
        remote = result;
        if (!result.store) { choose(); return; }
        await backup(readStore(), "use-cloud");
        if (!active(token)) return;
        if (generation !== before) { conflict("Lokale Daten wurden inzwischen geändert. Bitte erneut wählen."); return; }
        await apply(preserveSelection(result.store));
        if (!active(token)) return;
        commit({ linked: true, baseRevision: result.revision, syncedSnapshot: snapshot(result.store),
          dirty: generation !== before, needsChoice: false });
        emit(data.dirty ? "pending" : "synced", "Cloud-Stand übernommen. Die vorherigen lokalen Daten wurden gesichert.");
      });
    }
    function useLocal() {
      return run(async function (token) {
        if (!active(token) || data.authBlocked) return;
        var result = await request("GET", token);
        if (!result) return;
        remote = result;
        var before = generation;
        var local = clone(readStore());
        var merged = mergeStores(local, result.store);
        await backup(local, "use-local");
        if (!active(token)) return;
        if (generation !== before) { conflict("Lokale Daten wurden inzwischen geändert. Bitte erneut wählen."); return; }
        await apply(preserveSelection(merged));
        if (!active(token)) return;
        commit({ linked: true, dirty: true, baseRevision: result.revision, needsChoice: false });
        emit("syncing", "Lokale Daten werden mit der Cloud zusammengeführt …");
        await put(clone(readStore()), token, generation);
      });
    }
    function suspend(text) {
      if (suspended) return;
      suspended = true; session += 1; busy = null;
      emit("error", text || "Daten wurden in einem anderen Fenster geändert. Bitte die Seite neu laden.");
    }
    return { connect: connect, start: start, disconnect: disconnect, changed: changed, syncNow: syncNow,
      useCloud: useCloud, useLocal: useLocal, getStatus: getStatus, suspend: suspend };
  }
  return { createClient: createClient, DEFAULT_ENDPOINT: DEFAULT_ENDPOINT, STORAGE_KEY: DEFAULT_STORAGE_KEY };
});
