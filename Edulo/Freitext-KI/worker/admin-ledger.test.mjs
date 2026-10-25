import test from 'node:test';
import assert from 'node:assert/strict';
import { Ledger } from './budget.mjs';

const uid = 'ab-123456-abcdef-789012';
const uid2 = 'cd-123456-abcdef-789012';
const uid3 = 'ef-123456-abcdef-789012';
class Storage {
  constructor() { this.data = new Map(); this.queue = Promise.resolve(); }
  async transaction(fn) {
    const previous = this.queue; let unlock;
    this.queue = new Promise(resolve => { unlock = resolve; });
    await previous;
    const draft = structuredClone(this.data);
    try {
      const result = await fn({ get: async key => structuredClone(draft.get(key)), put: async (key, value) => { draft.set(key, structuredClone(value)); } });
      this.data = draft; return result;
    } finally { unlock(); }
  }
}
function setup() {
  const storage = new Storage(); let now = Date.parse('2026-10-25T12:00:00Z');
  const config = {
    accounts: { [uid]: { totalGrantedEuroMicros: 1000, weeklyLimitEuroMicros: 500 }, [uid2]: { totalGrantedEuroMicros: 2000, weeklyLimitEuroMicros: 1000 } },
    limits: { globalLifetimeLimitEuroMicros: 3000, globalWeeklyLimitEuroMicros: 1500 },
    prices: { inputNanoUsdPerToken: 100, cachedInputNanoUsdPerToken: 10, outputNanoUsdPerToken: 500, euroMicrosPerUsd: 900000, version: 'synthetic' },
  };
  const ledger = new Ledger(storage, () => now);
  return { ledger, storage, config, advance(ms) { now += ms; }, restart: () => new Ledger(storage, () => now) };
}
const mutation = (action, fields = {}) => ({ operationId: crypto.randomUUID(), action, ...fields });
async function spend(s, amount = 50) {
  const id = crypto.randomUUID(); await s.ledger.reserve(uid, id, id, amount, s.config);
  await s.ledger.finish(uid, id, s.config, { status: 200, body: {} }, amount);
}
const account = (snapshot, id = uid) => snapshot.accounts.find(a => a.uid === id);

test('optional names migrate empty, can be added or changed and preserve financial state across restart',async()=>{
  const s=setup();await spend(s,50);
  const before=await s.ledger.admin(s.config,{action:'list'});assert.equal(account(before).name,'');
  const rename=mutation('rename',{uid,name:'  Alex Müller · 9b  '});
  const named=await s.ledger.admin(s.config,rename);assert.equal(account(named).name,'Alex Müller · 9b');
  assert.deepEqual(account(named).budget,account(before).budget);assert.equal(account(named).spentEuroMicros,50);
  await s.ledger.admin(s.config,mutation('topup',{uid,amountEuroMicros:100}));
  const repeated=await s.restart().admin(s.config,rename);assert.equal(account(repeated).name,'Alex Müller · 9b');assert.equal(account(repeated).budget.remainingEuroMicros,1050);
  const cleared=await s.ledger.admin(s.config,mutation('rename',{uid,name:' '}));assert.equal(account(cleared).name,'');
  const added=await s.ledger.admin(s.config,mutation('add',{uid:uid3,name:'Samira',amountEuroMicros:100,weeklyLimitEuroMicros:20}));assert.equal(account(added,uid3).name,'Samira');
  await s.ledger.admin(s.config,mutation('rename',{uid:uid3,name:'<img src=x onerror=alert(1)>'}));
  assert.equal(account(await s.restart().admin(s.config,{action:'list'}),uid3).name,'<img src=x onerror=alert(1)>');
  assert.ok(!Object.hasOwn(await s.ledger.quota(uid3,s.config),'name'),'learner quota carries no name');
});

test('names reject invalid data before writing and cannot be injected into unrelated operations',async()=>{
  const s=setup();
  for(const name of [null,5,{},'x'.repeat(121),'Alex\nMüller','Alex\u0000']){
    await assert.rejects(s.ledger.admin(s.config,mutation('rename',{uid,name})),{code:'invalid_account_name'});
    await assert.rejects(s.ledger.admin(s.config,mutation('add',{uid:uid3,name,amountEuroMicros:0,weeklyLimitEuroMicros:10})),{code:'invalid_account_name'});
  }
  await assert.rejects(s.ledger.admin(s.config,mutation('rename',{uid:uid3,name:'Name'})),{code:'account_not_found'});
  await assert.rejects(s.ledger.admin(s.config,mutation('topup',{uid,name:'Name',amountEuroMicros:10})),{code:'invalid_admin_request'});
  assert.equal(s.storage.data.size,0);
});

test('admin list is read-only, contains financial fields and original accounts, never response texts', async () => {
  const s = setup(); const initial = await s.ledger.admin(s.config, { action: 'list' });
  assert.equal(s.storage.data.size, 0); assert.equal(initial.accounts.length, 2);
  assert.equal(account(initial).grantedEuroMicros, 1000); assert.equal(initial.global.globalLifetimeLimitEuroMicros, 3000);
  await spend(s);
  const result = await s.ledger.admin(s.config, { action: 'list' });
  assert.equal(account(result).spentEuroMicros, 50); assert.equal(account(result).weeklySpentEuroMicros, 50);
  assert.equal(result.global.spentEuroMicros, 50); assert.equal(result.global.weeklySpentEuroMicros, 50);
  assert.equal(account(result).budget.remainingEuroMicros, 950); assert.equal(result.weekKey, '2026-10-19');
  assert.equal(s.storage.data.has('admin:settings'), false); assert.ok(!JSON.stringify(result).includes('feedback'));
});
test('adding exact UID authorizes new account and preserves every existing account; existing add never overwrites', async () => {
  const s = setup(); const op = mutation('add', { uid: uid3, amountEuroMicros: 300, weeklyLimitEuroMicros: 100 });
  const result = await s.ledger.admin(s.config, op);
  assert.equal(result.accounts.length, 3); assert.equal(account(result).grantedEuroMicros, 1000);
  assert.equal(account(result, uid2).grantedEuroMicros, 2000); assert.equal(account(result, uid3).grantedEuroMicros, 300);
  assert.equal((await s.ledger.quota(uid3, s.config)).remainingEuroMicros, 300);
  await s.ledger.reserve(uid3, crypto.randomUUID(), 'new', 50, s.config);
  await assert.rejects(s.ledger.admin(s.config, mutation('add', { uid: uid3, amountEuroMicros: 999, weeklyLimitEuroMicros: 999 })), { code: 'account_exists' });
  assert.equal((await s.ledger.quota(uid3, s.config)).remainingEuroMicros, 250);
  const audit = s.storage.data.get(`admin:operation:${op.operationId}`);
  assert.deepEqual(audit.body, op); assert.equal(audit.action, 'add'); assert.equal(typeof audit.at, 'number');
});
test('topup adds cumulative funds without resetting spending, reservations, blocking or old granted high-water mark', async () => {
  const s = setup(); await spend(s, 100);
  s.config.accounts[uid].totalGrantedEuroMicros = 5000;
  await s.ledger.quota(uid, s.config); // Existing max grant survives a stale seed configuration.
  s.config.accounts[uid].totalGrantedEuroMicros = 1000;
  const id = crypto.randomUUID(); await s.ledger.reserve(uid, id, id, 100, s.config);
  await s.ledger.finish(uid, id, s.config, { status: 502, body: {} }, undefined, true);
  const result = await s.ledger.admin(s.config, mutation('topup', { uid, amountEuroMicros: 200 }));
  const a = account(result); assert.equal(a.grantedEuroMicros, 5200); assert.equal(a.spentEuroMicros, 100);
  assert.equal(a.budget.reservedEuroMicros, 100); assert.equal(a.budget.remainingEuroMicros, 5000); assert.equal(a.blocked, true);
  await assert.rejects(s.ledger.reserve(uid, crypto.randomUUID(), 'blocked', 1, s.config), { code: 'account_review_required' });
});
test('parallel different topups serialize; repeated same operation is exact idempotent and body changes conflict', async () => {
  const s = setup(); const op = mutation('topup', { uid, amountEuroMicros: 10 });
  const repeats = await Promise.all(Array.from({ length: 10 }, () => s.ledger.admin(s.config, op)));
  assert.ok(repeats.every(r => r.operationId === op.operationId && account(r).grantedEuroMicros === 1010));
  assert.equal(repeats[0].replayed, undefined);
  assert.ok(repeats.slice(1).every(r => r.replayed === true));
  await Promise.all(Array.from({ length: 20 }, () => s.ledger.admin(s.config, mutation('topup', { uid, amountEuroMicros: 10 }))));
  assert.equal((await s.ledger.quota(uid, s.config)).remainingEuroMicros, 1210);
  const replay = await s.restart().admin(s.config, op);
  assert.equal(replay.replayed, true); assert.equal(replay.operationId, op.operationId);
  assert.equal(account(replay).grantedEuroMicros, 1210);
  const receipt = s.storage.data.get(`admin:operation:${op.operationId}`);
  assert.equal(Object.hasOwn(receipt, 'result'), false); assert.ok(JSON.stringify(receipt).length < 1000);
  await assert.rejects(s.ledger.admin(s.config, { ...op, amountEuroMicros: 20 }), { code: 'operation_conflict' });
  assert.equal((await s.ledger.quota(uid, s.config)).remainingEuroMicros, 1210);
});
test('weekly change preserves spent funds and only changes current and future weekly allowance', async () => {
  const s = setup(); await spend(s, 200);
  const before = await s.ledger.admin(s.config, { action: 'list' });
  const reduced = await s.ledger.admin(s.config, mutation('weekly', { uid, weeklyLimitEuroMicros: 100 }));
  assert.equal(account(reduced).budget.weeklyRemainingEuroMicros, 0); assert.equal(account(reduced).spentEuroMicros, 200);
  assert.equal(account(reduced).grantedEuroMicros, account(before).grantedEuroMicros);
  await assert.rejects(s.ledger.reserve(uid, crypto.randomUUID(), 'weekly', 1, s.config), { code: 'budget_exhausted' });
  const increased = await s.ledger.admin(s.config, mutation('weekly', { uid, weeklyLimitEuroMicros: 350 }));
  assert.equal(account(increased).budget.weeklyRemainingEuroMicros, 150);
  s.advance(86400000);
  const next = await s.restart().admin(s.config, { action: 'list' });
  assert.equal(account(next).weeklySpentEuroMicros, 0); assert.equal(account(next).budget.weeklyRemainingEuroMicros, 350);
  assert.equal(account(next).spentEuroMicros, 200);
});
test('global limits are explicitly persisted and govern reserve instead of environment defaults', async () => {
  const s = setup(); await spend(s, 50);
  const reduced = await s.ledger.admin(s.config, mutation('limits', { globalLifetimeLimitEuroMicros: 60, globalWeeklyLimitEuroMicros: 60 }));
  assert.equal(reduced.global.spentEuroMicros, 50); assert.equal(reduced.global.globalWeeklyLimitEuroMicros, 60);
  assert.deepEqual(reduced.limits, { globalLifetimeLimitEuroMicros: 60, globalWeeklyLimitEuroMicros: 60 });
  await assert.rejects(s.ledger.reserve(uid2, crypto.randomUUID(), 'global', 11, s.config), { code: 'global_budget_exhausted' });
  await s.ledger.admin(s.config, mutation('limits', { globalLifetimeLimitEuroMicros: 100, globalWeeklyLimitEuroMicros: 70 }));
  await s.restart().reserve(uid2, crypto.randomUUID(), 'global2', 20, s.config);
  await assert.rejects(s.ledger.reserve(uid, crypto.randomUUID(), 'global3', 1, s.config), { code: 'global_budget_exhausted' });
  assert.equal((await s.ledger.quota(uid, s.config)).remainingEuroMicros, 950);
});
test('persistent settings survive runtime restart and later seed changes without losing old accounts or grants', async () => {
  const s = setup(); await s.ledger.admin(s.config, mutation('add', { uid: uid3, amountEuroMicros: 50, weeklyLimitEuroMicros: 40 }));
  await s.ledger.admin(s.config, mutation('topup', { uid, amountEuroMicros: 50 }));
  s.config.accounts = { [uid]: { totalGrantedEuroMicros: 1, weeklyLimitEuroMicros: 1 } };
  s.config.limits = { globalLifetimeLimitEuroMicros: 1, globalWeeklyLimitEuroMicros: 1 };
  const restarted = s.restart(); const list = await restarted.admin(s.config, { action: 'list' });
  assert.equal(list.accounts.length, 3); assert.equal(account(list).grantedEuroMicros, 1050); assert.equal(list.limits.globalLifetimeLimitEuroMicros, 3000);
  assert.equal((await restarted.quota(uid2, s.config)).remainingEuroMicros, 2000);
  await restarted.reserve(uid3, crypto.randomUUID(), 'persisted', 30, s.config);
});
test('stored settings override a later larger seed grant when computing an admin topup', async () => {
  const s = setup();
  await s.ledger.admin(s.config, mutation('weekly', { uid, weeklyLimitEuroMicros: 600 }));
  s.config.accounts[uid].totalGrantedEuroMicros = 9_000_000;
  const topped = await s.restart().admin(s.config, mutation('topup', { uid, amountEuroMicros: 50 }));
  assert.equal(account(topped).grantedEuroMicros, 1050);
  assert.equal((await s.ledger.quota(uid, s.config)).remainingEuroMicros, 1050);
});
test('finish and reconciliation of existing requests keep original-week consumption after admin changes', async () => {
  const s = setup(); const id = crypto.randomUUID(); await s.ledger.reserve(uid, id, id, 100, s.config);
  await s.ledger.admin(s.config, mutation('weekly', { uid, weeklyLimitEuroMicros: 50 }));
  s.advance(86400000);
  const settled = await s.restart().finish(uid, id, s.config, { status: 200, body: {} }, 30);
  assert.equal(settled.budget.weeklyRemainingEuroMicros, 50); assert.equal(settled.budget.remainingEuroMicros, 970);
  const id2 = crypto.randomUUID(); await s.ledger.reserve(uid, id2, id2, 40, s.config);
  await s.ledger.finish(uid, id2, s.config, { status: 502, body: {} }, undefined, true);
  await s.ledger.admin(s.config, mutation('topup', { uid, amountEuroMicros: 10 }));
  const reconciled = await s.restart().reconcile(uid, id2, s.config, 20, 'Geprüfter synthetischer Abrechnungsbeleg.', false);
  assert.equal(reconciled.budget.remainingEuroMicros, 960); assert.equal(reconciled.budget.weeklyRemainingEuroMicros, 30);
});
test('admin operations reject malformed fields, IDs, unsafe money and unknown accounts without writes', async () => {
  const s = setup();
  const cases = [null, [], { action: 'list', operationId: crypto.randomUUID() }, { action: 'delete', uid },
    mutation('topup', { uid, amountEuroMicros: 0 }), mutation('topup', { uid, amountEuroMicros: -1 }),
    mutation('topup', { uid, amountEuroMicros: 1.5 }), mutation('topup', { uid, amountEuroMicros: Number.MAX_SAFE_INTEGER + 1 }),
    mutation('weekly', { uid, weeklyLimitEuroMicros: 0 }), mutation('add', { uid: `${uid} `, amountEuroMicros: 1, weeklyLimitEuroMicros: 1 }),
    mutation('add', { uid: `${uid}\n`, amountEuroMicros: 1, weeklyLimitEuroMicros: 1 }),
    { ...mutation('topup', { uid, amountEuroMicros: 1 }), operationId: 'not-uuid' },
    mutation('limits', { globalLifetimeLimitEuroMicros: 100 }), mutation('limits', { globalLifetimeLimitEuroMicros: 0, globalWeeklyLimitEuroMicros: 100 }),
    mutation('topup', { uid, amountEuroMicros: 1, studentAnswer: 'forbidden' })];
  for (const body of cases) await assert.rejects(s.ledger.admin(s.config, body), error => error.status === 400);
  assert.equal(s.storage.data.size, 0);
  await assert.rejects(s.ledger.admin(s.config, mutation('topup', { uid: uid3, amountEuroMicros: 1 })), { code: 'account_not_found' });
  await assert.rejects(s.ledger.admin(s.config, mutation('weekly', { uid: uid3, weeklyLimitEuroMicros: 1 })), { code: 'account_not_found' });
  assert.equal(s.storage.data.size, 0);
});
test('overflow topup rolls back settings and cannot erase accrued spending', async () => {
  const s = setup(); await spend(s, 25);
  const before = await s.ledger.admin(s.config, { action: 'list' });
  await assert.rejects(s.ledger.admin(s.config, mutation('topup', { uid, amountEuroMicros: Number.MAX_SAFE_INTEGER })), { code: 'invalid_admin_amount' });
  assert.deepEqual(await s.ledger.admin(s.config, { action: 'list' }), before);
  assert.equal(s.storage.data.has('admin:settings'), false);
});
