// Standalone archive service; no Edulo identity, cookies, or third-party services.
export const MAX_BODY_BYTES = 6 * 1024 * 1024;
export const CHUNK_BYTES = 128 * 1024;
export const BACKUP_COUNT = 20;
const encoder = new TextEncoder();
const ORIGINS = new Set(['https://hdb-productions.github.io', 'null']);
const OBJECT_NAME = 'single-owner-archive-v1';

class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; }
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Vary': 'Origin',
      ...headers,
    },
  });
}

export async function digestKey(key) {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(key)));
  return Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function constantTimeEqual(a, b) {
  // Authentication only invokes this on two fixed-length SHA-256 hex digests.
  let difference = a.length ^ b.length;
  for (let i = 0; i < 64; i++) difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return difference === 0;
}

export async function authenticate(request, env) {
  if (!/^[a-f0-9]{64}$/.test(env.ARCHIVE_KEY_SHA256 || '')) {
    throw new HttpError(503, 'not_configured');
  }
  const match = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.headers.get('Authorization') || '');
  if (!match || !constantTimeEqual(await digestKey(match[1]), env.ARCHIVE_KEY_SHA256)) {
    throw new HttpError(401, 'unauthorized');
  }
}

function routeFor(request) {
  const url = new URL(request.url);
  if (url.search) return null;
  if (url.pathname === '/health') return { type: 'health', methods: ['GET'] };
  if (url.pathname === '/archive') return { type: 'archive', methods: ['GET', 'PUT'] };
  if (url.pathname === '/backups') return { type: 'backups', methods: ['GET'] };
  const match = /^\/backups\/([1-9][0-9]*)$/.exec(url.pathname);
  if (match && Number.isSafeInteger(Number(match[1]))) {
    return { type: 'backup', revision: Number(match[1]), methods: ['GET'] };
  }
  return null;
}

export async function handleRequest(request, env, action) {
  const origin = request.headers.get('Origin');
  const cors = origin !== null && ORIGINS.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {};
  const finish = response => {
    // Rebuild so every success and failure, including forwarded responses, has these headers.
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries({
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff', ...cors,
    })) headers.set(name, value);
    const vary = new Set((headers.get('Vary') || '').split(',').map(value => value.trim()).filter(Boolean));
    vary.add('Origin');
    headers.set('Vary', [...vary].join(', '));
    headers.delete('Access-Control-Allow-Credentials');
    return new Response(response.body, { status: response.status, headers });
  };
  try {
    if (origin !== null && !ORIGINS.has(origin)) throw new HttpError(403, 'origin_not_allowed');
    const route = routeFor(request);
    if (!route) throw new HttpError(404, 'not_found');
    if (request.method === 'OPTIONS') {
      if (origin === null) throw new HttpError(400, 'invalid_preflight');
      const method = request.headers.get('Access-Control-Request-Method');
      const requested = (request.headers.get('Access-Control-Request-Headers') || '')
        .split(',').map(header => header.trim().toLowerCase()).filter(Boolean);
      if (!route.methods.includes(method) || requested.some(header => !['authorization', 'content-type'].includes(header))) {
        throw new HttpError(403, 'invalid_preflight');
      }
      return finish(new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Methods': route.methods.join(', '),
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Vary': 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
      } }));
    }
    if (!route.methods.includes(request.method)) {
      return finish(json({ error: 'method_not_allowed' }, 405, { Allow: route.methods.join(', ') }));
    }
    if (route.type === 'health') return finish(json({ ok: true }));
    await authenticate(request, env);
    return finish(await action(route));
  } catch (error) {
    // Do not log keys, headers, bodies, names, or private archive contents.
    return finish(json({ error: error instanceof HttpError ? error.message : 'internal_error' },
      error instanceof HttpError ? error.status : 500));
  }
}

export async function readJsonBody(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') || '')) {
    throw new HttpError(415, 'json_required');
  }
  const contentLength = request.headers.get('Content-Length');
  if (contentLength !== null && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)) {
    throw new HttpError(413, 'body_too_large');
  }
  if (!request.body) throw new HttpError(400, 'invalid_json');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new HttpError(413, 'body_too_large');
      }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, 'invalid_json');
  } finally { reader.releaseLock(); }
}

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validId = value => typeof value === 'string' && value.length > 0 && value.length <= 256;
function uniqueRecords(items, getId = item => item.id) {
  if (!Array.isArray(items)) return false;
  const ids = new Set();
  for (const item of items) {
    if (!record(item)) return false;
    const id = getId(item);
    if (!validId(id) || ids.has(id)) return false;
    ids.add(id);
  }
  return true;
}

export function validateStore(store) {
  if (!record(store) || store.version !== 1 || !uniqueRecords(store.exams, exam => exam.metadata?.id)) return false;
  if (store.currentExamId !== null && (!validId(store.currentExamId) ||
      !store.exams.some(exam => exam.metadata.id === store.currentExamId))) return false;
  if (!uniqueRecords(store.taskBlockLibrary) || !uniqueRecords(store.classListLibrary)) return false;
  for (const exam of store.exams) {
    if (!record(exam.metadata) || !uniqueRecords(exam.students) || !uniqueRecords(exam.structure) ||
        !record(exam.evaluations) || (exam.printLayout !== undefined && !record(exam.printLayout))) return false;
  }
  for (const template of store.taskBlockLibrary) if (!uniqueRecords(template.nodes)) return false;
  // Class-list templates intentionally have no student IDs in the existing application.
  for (const template of store.classListLibrary) {
    if (!Array.isArray(template.students) || !template.students.every(record)) return false;
  }
  return true;
}

export class SqlArchiveRepository {
  constructor(storage) {
    this.storage = storage;
    this.sql = storage.sql;
    storage.transactionSync(() => {
      this.sql.exec('CREATE TABLE IF NOT EXISTS archive_head (singleton INTEGER PRIMARY KEY CHECK(singleton = 1), revision INTEGER NOT NULL)');
      this.sql.exec('CREATE TABLE IF NOT EXISTS archive_versions (revision INTEGER PRIMARY KEY, updated_at TEXT NOT NULL, bytes INTEGER NOT NULL)');
      this.sql.exec('CREATE TABLE IF NOT EXISTS archive_chunks (revision INTEGER NOT NULL, chunk_index INTEGER NOT NULL, body BLOB NOT NULL, PRIMARY KEY (revision, chunk_index))');
    });
  }

  revision() {
    return this.sql.exec('SELECT revision FROM archive_head WHERE singleton = 1').toArray()[0]?.revision || 0;
  }

  get(revision = this.revision()) {
    if (revision === 0) return { revision: 0, store: null, updatedAt: null };
    const row = this.sql.exec('SELECT updated_at FROM archive_versions WHERE revision = ?', revision).toArray()[0];
    if (!row) return null;
    const decoder = new TextDecoder();
    let text = '';
    for (const chunk of this.sql.exec('SELECT body FROM archive_chunks WHERE revision = ? ORDER BY chunk_index', revision)) {
      text += decoder.decode(chunk.body, { stream: true });
    }
    text += decoder.decode();
    return { revision, store: JSON.parse(text), updatedAt: row.updated_at };
  }

  backups() {
    return this.sql.exec('SELECT revision, updated_at AS updatedAt, bytes FROM archive_versions WHERE revision < ? ORDER BY revision DESC LIMIT ?',
      this.revision(), BACKUP_COUNT).toArray();
  }

  put(baseRevision, store) {
    const body = encoder.encode(JSON.stringify(store));
    if (body.byteLength > MAX_BODY_BYTES) throw new HttpError(413, 'body_too_large');
    // Entire CAS, snapshot write, head update and retention are synchronous and atomic.
    // No await or external I/O is permitted inside this callback.
    return this.storage.transactionSync(() => {
      const current = this.revision();
      if (current !== baseRevision) return { conflict: true, revision: current };
      if (current >= Number.MAX_SAFE_INTEGER) throw new HttpError(507, 'revision_limit');
      const revision = current + 1;
      const updatedAt = new Date().toISOString();
      this.sql.exec('INSERT INTO archive_versions (revision, updated_at, bytes) VALUES (?, ?, ?)', revision, updatedAt, body.byteLength);
      for (let offset = 0, index = 0; offset < body.length; offset += CHUNK_BYTES, index++) {
        this.sql.exec('INSERT INTO archive_chunks (revision, chunk_index, body) VALUES (?, ?, ?)',
          revision, index, body.slice(offset, offset + CHUNK_BYTES));
      }
      this.sql.exec('INSERT INTO archive_head (singleton, revision) VALUES (1, ?) ON CONFLICT(singleton) DO UPDATE SET revision = excluded.revision', revision);
      const cutoff = revision - BACKUP_COUNT;
      this.sql.exec('DELETE FROM archive_chunks WHERE revision < ?', cutoff);
      this.sql.exec('DELETE FROM archive_versions WHERE revision < ?', cutoff);
      return { revision, store, updatedAt };
    });
  }
}

export class ArchiveStore {
  constructor(ctx, env) { this.env = env; this.repository = new SqlArchiveRepository(ctx.storage); }

  async fetch(request) {
    return handleRequest(request, this.env, async route => {
      if (route.type === 'backups') return json({ backups: this.repository.backups() });
      if (route.type === 'backup') {
        const data = this.repository.get(route.revision);
        return data ? json(data) : json({ error: 'not_found' }, 404);
      }
      if (request.method === 'GET') return json(this.repository.get());
      const payload = await readJsonBody(request);
      if (!record(payload) || !Number.isSafeInteger(payload.baseRevision) || payload.baseRevision < 0 || !validateStore(payload.store)) {
        throw new HttpError(400, 'invalid_archive');
      }
      const result = this.repository.put(payload.baseRevision, payload.store);
      return result.conflict ? json({ error: 'conflict', revision: result.revision }, 409) : json(result);
    });
  }
}

export default {
  fetch(request, env) {
    return handleRequest(request, env, () => {
      // EU restriction is mandatory: never silently fall back to an unrestricted object.
      const namespace = env.ARCHIVE.jurisdiction('eu');
      const id = namespace.idFromName(OBJECT_NAME);
      return namespace.get(id).fetch(request);
    });
  },
};
