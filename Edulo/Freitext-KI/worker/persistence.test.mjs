// Opt-in: local workerd/SQLite integration, no network access to OpenAI.
// EDULO_MINIFLARE_TEST=1 node --test Edulo/Freitext-KI/worker/persistence.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

test('local Cloudflare emulation: SQLite atomic reservations and settled funds persist across workerd restart',
  { skip: process.env.EDULO_MINIFLARE_TEST !== '1', timeout: 45_000 }, async () => {
  const { Miniflare, convertV4MiniflareOptions } = await import(new URL('../../../.edulo-tools/cloudflare/node_modules/miniflare/dist/src/index.js', import.meta.url));
  const directory = fileURLToPath(new URL('.', import.meta.url));
  const scratchRoot = fileURLToPath(new URL('../../../.edulo-tools/cloudflare/', import.meta.url));
  const persistence = await mkdtemp(resolve(scratchRoot, 'persistence-test-'));
  const uid = 'ab-123456-abcdef-789012';
  const task = { id: 'test', version: '1', prompt: 'Erkläre gleichförmige Bewegung.', referenceAnswer: 'Die Geschwindigkeit ist konstant.',
    criteria: [{ id: 'konstant', label: 'Geschwindigkeit', description: 'Die Geschwindigkeit ist konstant.' }] };
  const feedback = { summary: 'Verständlich.', misconceptions: [], criteria: [{ id: 'konstant', status: 'met', feedback: 'Fachlich erfüllt.' }], nextSteps: [], languageFeedback: 'Verständliche Formulierung.' };
  const usage = { input_tokens: 100, output_tokens: 60, input_tokens_details: { cached_tokens: 20 }, total_tokens: 160 };
  let calls = 0, release;
  const gate = new Promise(r => { release = r; });
  const options = convertV4MiniflareOptions({
    name: 'feedback-persistence-test', modulesRoot: directory,
    modules: ['worker.mjs', 'budget.mjs', 'admin-page.mjs', 'admin-roster.mjs'].map(name => ({ type: 'ESModule', path: resolve(directory, name) })),
    compatibilityDate: '2026-10-25', resourcePersistencePath: persistence,
    durableObjects: { FEEDBACK_BUDGET: { className: 'FeedbackBudget', useSQLite: true } },
    ratelimits: { FEEDBACK_LIMITER: { namespace_id: '10012501', simple: { limit: 30, period: 60 } } },
    bindings: {
      ALLOWED_ORIGINS: 'https://synthetic.example', OPENAI_API_KEY: 'synthetic-never-sent-externally',
      ADMIN_UI_TOKEN: 'synthetic-administrator-token-for-tests-only',
      ACCOUNTS_JSON: JSON.stringify({ [uid]: { totalGrantedEuroMicros: 10_000, weeklyLimitEuroMicros: 10_000 } }),
      PRICE_CONFIG_JSON: JSON.stringify({ inputNanoUsdPerToken: 100, cachedInputNanoUsdPerToken: 10, outputNanoUsdPerToken: 500, euroMicrosPerUsd: 900_000, version: 'synthetic-persistence-test' }),
      LIMITS_JSON: JSON.stringify({ globalLifetimeLimitEuroMicros: 10_000, globalWeeklyLimitEuroMicros: 10_000 }),
    },
    outboundService: async request => {
      assert.equal(request.url, 'https://api.openai.com/v1/responses');
      calls++;
      await gate;
      return new Response(JSON.stringify({ status: 'completed', usage, output: [{ content: [{ type: 'output_text', text: JSON.stringify(feedback) }] }] }));
    },
  });
  let mf;
  const post = (path, body) => mf.dispatchFetch(`https://worker.test${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  try {
    mf = new Miniflare(options); await mf.ready;
    const health = await mf.dispatchFetch('https://worker.test/health'); assert.deepEqual(await health.json(), { ready: true });
    const completed = [];
    const bodies = Array.from({ length: 12 }, () => ({ uid, requestId: crypto.randomUUID(), task, answer: 'x'.repeat(12_000) }));
    const requests = bodies.map(body => post('/feedback', body).then(async response => {
      const result = { status: response.status, body: await response.json() }; completed.push(result); return result;
    }));
    const deadline = Date.now() + 8000;
    while (completed.length + calls < bodies.length && Date.now() < deadline) await new Promise(r => setTimeout(r, 25));
    assert.equal(completed.length + calls, bodies.length, 'all requests either atomically reserved or rejected');
    assert.ok(calls > 0 && calls < bodies.length);
    const reserved = await (await post('/quota', { uid })).json();
    assert.ok(reserved.budget.reservedEuroMicros > 0 && reserved.budget.reservedEuroMicros <= 10_000);
    assert.equal(reserved.budget.remainingEuroMicros + reserved.budget.reservedEuroMicros, 10_000);
    assert.ok(completed.every(r => r.status === 402 || r.body.error?.code === 'global_budget_exhausted'));
    release();
    const results = await Promise.all(requests);
    const successful = results.filter(r => r.status === 200);
    assert.equal(successful.length, calls);
    assert.ok(successful.every(r => r.body.charge.euroMicros === 35 && r.body.charge.status === 'settled'));
    const expectedRemaining = 10_000 - 35 * calls;
    const before = await (await post('/quota', { uid })).json();
    assert.equal(before.budget.remainingEuroMicros, expectedRemaining); assert.equal(before.budget.reservedEuroMicros, 0);
    await mf.dispose(); mf = undefined;
    mf = new Miniflare(options); await mf.ready;
    const after = await (await post('/quota', { uid })).json();
    assert.deepEqual(after, before, 'financial data survives complete Miniflare/workerd disposal and restart');
    const id = successful[0].body.requestId;
    const replay = await post('/result', { uid, requestId: id });
    assert.equal(replay.status, 200); assert.equal((await replay.json()).charge.euroMicros, 35);
    const original = bodies.find(b => b.requestId === id);
    const duplicate = await post('/feedback', original); assert.equal(duplicate.status, 200);
    assert.equal(calls, successful.length, 'restart and duplicate requests never create another API generation');
    const admin = body => mf.dispatchFetch('https://worker.test/admin/manage', {method:'POST',headers:{
      'Content-Type':'application/json',Authorization:'Bearer synthetic-administrator-token-for-tests-only',Origin:'https://worker.test'},body:JSON.stringify(body)});
    const newUid = 'ef-123456-abcdef-789012';
    const add = {action:'add',operationId:crypto.randomUUID(),uid:newUid,name:'Testname',amountEuroMicros:500000,weeklyLimitEuroMicros:100000};
    assert.equal((await admin(add)).status,200);
    const topup = {action:'topup',operationId:crypto.randomUUID(),uid:newUid,amountEuroMicros:1000000};
    assert.equal((await admin(topup)).status,200);
    assert.equal((await admin(topup)).status,200);
    assert.equal((await admin({action:'rename',operationId:crypto.randomUUID(),uid:newUid,name:'Neuer Testname'})).status,200);
    assert.equal((await admin({action:'weekly',operationId:crypto.randomUUID(),uid:newUid,weeklyLimitEuroMicros:200000})).status,200);
    assert.equal((await admin({action:'limits',operationId:crypto.randomUUID(),globalLifetimeLimitEuroMicros:2000000,globalWeeklyLimitEuroMicros:500000})).status,200);
    await mf.dispose(); mf = undefined;
    mf = new Miniflare(options); await mf.ready;
    const managed = await (await admin({action:'list'})).json();
    const added = managed.accounts.find(a=>a.uid===newUid);
    assert.equal(added.name,'Neuer Testname','name survives complete runtime restart');
    assert.equal(added.budget.remainingEuroMicros,1500000,'top-up persists once across restart');
    assert.equal(added.weeklyLimitEuroMicros,200000);
    assert.equal(managed.global.globalLifetimeLimitEuroMicros,2000000);
    assert.equal(managed.accounts.find(a=>a.uid===uid).budget.remainingEuroMicros,expectedRemaining,'old spending preserved');
    assert.equal((await post('/quota',{uid:newUid})).status,200,'managed ID works without editing the original secret');
    assert.equal((await admin(topup)).status,200,'idempotency persists across runtime restart');
    const final = await (await post('/quota',{uid:newUid})).json();assert.equal(final.budget.remainingEuroMicros,1500000);
    // Roster migration, corrections and freezes must also survive a real SQLite restart.
    const mutate = (action,fields={}) => admin({action,operationId:crypto.randomUUID(),...fields});
    assert.equal((await mutate('profile',{uid:newUid,name:'Neuer Testname',className:'8G3',schoolYear:'2026/2027'})).status,200);
    const deduction={action:'deduct',operationId:crypto.randomUUID(),uid:newUid,amountEuroMicros:100000,reason:'Synthetische Fehlbuchung korrigiert'};
    assert.equal((await admin(deduction)).status,200);
    const importedResponse=await mutate('import',{rows:[{uid:'',name:'Synthetischer Entwurf',className:'8G3',schoolYear:'2026/2027'}],amountEuroMicros:0,weeklyLimitEuroMicros:100000});
    assert.equal(importedResponse.status,200);const imported=await importedResponse.json();const draftId=imported.drafts[0].id;
    assert.equal((await mutate('moveClass',{uids:[newUid],draftIds:[draftId],className:'9G3',schoolYear:'2027/2028'})).status,200);
    assert.equal((await mutate('freeze',{uids:[newUid],draftIds:[draftId],frozen:true})).status,200);
    await mf.dispose();mf=undefined;mf=new Miniflare(options);await mf.ready;
    const restoredResponse=await admin(deduction);assert.equal(restoredResponse.status,200);const restored=await restoredResponse.json();
    assert.equal(restored.replayed,true);const corrected=restored.accounts.find(a=>a.uid===newUid);
    assert.equal(corrected.budget.remainingEuroMicros,1400000,'deduction applied exactly once after SQLite restart');
    assert.equal(corrected.withdrawnEuroMicros,100000);assert.equal(corrected.frozen,true);
    assert.equal(corrected.className,'9G3');assert.equal(corrected.schoolYear,'2027/2028');
    assert.equal(corrected.legacyName,'Testname');
    assert.equal(restored.drafts[0].id,draftId);assert.equal(restored.drafts[0].frozen,true);assert.equal(restored.drafts[0].className,'9G3');
    const denied=await post('/feedback',{...bodies[0],uid:newUid,requestId:crypto.randomUUID()});
    assert.equal(denied.status,403);assert.equal((await denied.json()).error.code,'account_frozen');
    const assignedUid='gh-123456-abcdef-789012';
    const assignedResponse=await mutate('assignUid',{draftId,uid:assignedUid,amountEuroMicros:50000,weeklyLimitEuroMicros:100000});
    assert.equal(assignedResponse.status,200);const assigned=await assignedResponse.json();assert.equal(assigned.drafts.length,0);
    assert.equal(assigned.accounts.find(a=>a.uid===assignedUid).frozen,true,'frozen draft remains frozen after UID binding');
    assert.equal(calls,successful.length,'administration never calls OpenAI');
    const files = await readdir(persistence, { recursive: true });
    assert.ok(files.some(name => /sqlite|\.db$/i.test(name)), 'persistent SQLite file created on local disk');
  } finally {
    release(); if (mf) await mf.dispose();
    // Synthetic test-only SQLite evidence stays in ignored .edulo-tools/ for inspection.
  }
});
