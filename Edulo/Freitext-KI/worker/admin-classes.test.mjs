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

test('metadata migration is read-only, profiles preserve original name and public privacy', async () => {
  const s = setup(); s.config.accounts[uid].name = 'Original';
  const initial = await s.ledger.admin(s.config, { action: 'list' });
  assert.equal(s.storage.data.size, 0); assert.deepEqual(initial.drafts, []);
  assert.equal(account(initial).className, ''); assert.equal(account(initial).frozen, false);
  await s.ledger.admin(s.config, mutation('profile', {uid, name:'New', className:'9b', schoolYear:'2026/2027'}));
  const result = await s.ledger.admin(s.config, mutation('rename', {uid,name:'Later'}));
  assert.equal(account(result).legacyName, 'Original');
  const publicData = await s.ledger.quota(uid,s.config);
  for (const key of ['name','className','schoolYear','frozen','legacyName']) assert.equal(Object.hasOwn(publicData,key),false);
});

test('withdrawals protect spent and reserved funds and cannot be restored by stale seeds', async () => {
  const s=setup(); await spend(s,100);
  const id=crypto.randomUUID(); await s.ledger.reserve(uid,id,id,200,s.config);
  const op=mutation('deduct',{uid,amountEuroMicros:700,reason:'Budget transfer'});
  await Promise.all(Array.from({length:8},()=>s.ledger.admin(s.config,op)));
  assert.equal((await s.restart().quota(uid,s.config)).remainingEuroMicros,0);
  await assert.rejects(s.ledger.admin(s.config,mutation('deduct',{uid,amountEuroMicros:1,reason:'Extra'})),{code:'insufficient_available_funds'});
  s.config.accounts[uid].totalGrantedEuroMicros=999999;
  const snap=await s.restart().admin(s.config,{action:'list'});
  assert.equal(account(snap).spentEuroMicros,100); assert.equal(account(snap).budget.reservedEuroMicros,200);
  assert.equal(account(snap).budget.remainingEuroMicros,0);
  await s.ledger.finish(uid,id,s.config,{status:200,body:{}},200);
  assert.equal((await s.ledger.quota(uid,s.config)).remainingEuroMicros,0);
  await s.ledger.admin(s.config,mutation('topup',{uid,amountEuroMicros:10}));
  assert.equal((await s.ledger.quota(uid,s.config)).remainingEuroMicros,10);
});

test('import preserves existing money and flags, deduplicates drafts and binds only explicit new UIDs', async()=>{
  const s=setup(); await s.ledger.admin(s.config,mutation('freeze',{uids:[uid],draftIds:[],frozen:true}));
  const row={uid:'',name:'Person',className:'8a',schoolYear:'2026/2027'};
  const op=mutation('import',{rows:[{...row,uid},row,row],amountEuroMicros:25,weeklyLimitEuroMicros:15});
  const results=await Promise.all([s.ledger.admin(s.config,op),s.ledger.admin(s.config,op)]);
  const snap=results[1]; assert.equal(snap.drafts.length,1); assert.equal(account(snap).grantedEuroMicros,1000);
  assert.equal(account(snap).weeklyLimitEuroMicros,500); assert.equal(account(snap).frozen,true);
  const draftId=snap.drafts[0].id;
  await s.ledger.admin(s.config,mutation('freeze',{uids:[],draftIds:[draftId],frozen:true}));
  await assert.rejects(s.ledger.admin(s.config,mutation('assignUid',{draftId,uid,amountEuroMicros:25,weeklyLimitEuroMicros:15})),{code:'account_exists'});
  const assigned=await s.ledger.admin(s.config,mutation('assignUid',{draftId,uid:uid3,amountEuroMicros:25,weeklyLimitEuroMicros:15}));
  assert.equal(assigned.drafts.length,0); assert.equal(account(assigned,uid3).frozen,true);
  assert.equal(account(assigned,uid3).budget.remainingEuroMicros,25);
});

test('all bulk targets and import rows validate before atomic writes',async()=>{
  const s=setup(); const before=await s.ledger.admin(s.config,{action:'list'});
  await assert.rejects(s.ledger.admin(s.config,mutation('moveClass',{uids:[uid,uid3],draftIds:[],className:'9b',schoolYear:'2026/2027'})),{code:'account_not_found'});
  for(const rows of [
    [{uid:uid3,name:'New',className:'9b',schoolYear:'2026/2027'},{uid,name:'Bad',className:'9b',schoolYear:'2026/2028'}],
    [{uid,name:'One',className:'',schoolYear:''},{uid,name:'Two',className:'',schoolYear:''}],
    Array.from({length:101},()=>({uid:'',name:'Name',className:'',schoolYear:''}))]) {
    await assert.rejects(s.ledger.admin(s.config,mutation('import',{rows,amountEuroMicros:10,weeklyLimitEuroMicros:10})),{status:400});
  }
  await assert.rejects(s.ledger.admin(s.config,mutation('freeze',{uids:[uid,uid],draftIds:[],frozen:true})),{status:400});
  assert.deepEqual(await s.ledger.admin(s.config,{action:'list'}),before); assert.equal(s.storage.data.size,0);
});

test('frozen accounts recover existing requests and accounting blocks remain independent',async()=>{
  const s=setup(); const id=crypto.randomUUID(); await s.ledger.reserve(uid,id,id,100,s.config);
  await s.ledger.admin(s.config,mutation('freeze',{uids:[uid],draftIds:[],frozen:true}));
  assert.equal((await s.ledger.reserve(uid,id,id,100,s.config)).existing,true);
  await assert.rejects(s.ledger.reserve(uid,crypto.randomUUID(),'new',10,s.config),{status:403,code:'account_frozen'});
  await s.ledger.finish(uid,id,s.config,{status:502,body:{}},undefined,true);
  assert.ok((await s.ledger.result(uid,id,s.config)).record.result);
  await s.ledger.reconcile(uid,id,s.config,25,'Verified synthetic receipt',false);
  assert.equal(account(await s.ledger.admin(s.config,{action:'list'})).frozen,true);
  await s.ledger.admin(s.config,mutation('freeze',{uids:[uid],draftIds:[],frozen:false}));
  const second=crypto.randomUUID(); await s.ledger.reserve(uid,second,second,10,s.config);
  await s.ledger.finish(uid,second,s.config,{status:502,body:{}},undefined,true);
  await s.ledger.admin(s.config,mutation('freeze',{uids:[uid],draftIds:[],frozen:false}));
  await assert.rejects(s.ledger.reserve(uid,crypto.randomUUID(),'blocked',1,s.config),{code:'account_review_required'});
});

test('draft IDs normalize case for lookup and reject duplicate bulk targets',async()=>{
  const s=setup();
  const imported=await s.ledger.admin(s.config,mutation('import',{rows:[{uid:'',name:'Draft',className:'',schoolYear:''}],amountEuroMicros:0,weeklyLimitEuroMicros:1}));
  const id=imported.drafts[0].id;
  await assert.rejects(s.ledger.admin(s.config,mutation('freeze',{uids:[],draftIds:[id,id.toUpperCase()],frozen:true})),{status:400});
  await s.ledger.admin(s.config,mutation('draftProfile',{draftId:id.toUpperCase(),name:'Changed',className:'9a',schoolYear:'2199/2200'}));
  const assigned=await s.ledger.admin(s.config,mutation('assignUid',{draftId:id.toUpperCase(),uid:uid3,amountEuroMicros:0,weeklyLimitEuroMicros:1}));
  assert.equal(assigned.drafts.length,0); assert.equal(account(assigned,uid3).name,'Changed');
  await assert.rejects(s.ledger.admin(s.config,mutation('import',{rows:[{uid:'',name:'  ',className:'',schoolYear:''}],amountEuroMicros:0,weeklyLimitEuroMicros:1})),{status:400});
});
