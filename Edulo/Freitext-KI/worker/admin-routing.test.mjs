import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorker,FeedbackBudget} from './worker.mjs';
const token='synthetic-admin-ui-key-at-least-32-characters';
const uid='ab-123456-abcdef-789012',newUid='cd-123456-abcdef-789012';
class Storage {
  data=new Map(); queue=Promise.resolve();
  async transaction(fn){const previous=this.queue;let unlock;this.queue=new Promise(r=>unlock=r);await previous;const draft=structuredClone(this.data);try{const result=await fn({get:async k=>structuredClone(draft.get(k)),put:async(k,v)=>draft.set(k,structuredClone(v))});this.data=draft;return result;}finally{unlock();}}
}
function setup(){
  let apiCalls=0;
  const env={ADMIN_UI_TOKEN:token,OPENAI_API_KEY:'never-used',ALLOWED_ORIGINS:'ionic://localhost',
    ACCOUNTS_JSON:JSON.stringify({[uid]:{totalGrantedEuroMicros:500000,weeklyLimitEuroMicros:100000}}),
    PRICE_CONFIG_JSON:JSON.stringify({inputNanoUsdPerToken:100,cachedInputNanoUsdPerToken:10,outputNanoUsdPerToken:500,euroMicrosPerUsd:900000,version:'test'}),
    LIMITS_JSON:JSON.stringify({globalLifetimeLimitEuroMicros:500000,globalWeeklyLimitEuroMicros:100000}),
    FEEDBACK_LIMITER:{limit:async()=>({success:true})}};
  const instance=new FeedbackBudget({storage:new Storage()},env,{upstreamFetch:()=>{apiCalls++;throw Error('unexpected OpenAI');}});
  env.FEEDBACK_BUDGET={idFromName:name=>name,get:()=>({fetch:r=>instance.fetch(r)})};
  const invoke=(path,options={})=>createWorker().fetch(new Request('https://worker.example'+path,options),env);
  const manage=(body,headers={})=>invoke('/admin/manage',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token,Origin:'https://worker.example',...headers},body:JSON.stringify(body)});
  return {env,invoke,manage,apiCalls:()=>apiCalls};
}
test('admin page carries no account data or secret and has restrictive browser headers',async()=>{
  const s=setup(),r=await s.invoke('/admin');assert.equal(r.status,200);const html=await r.text();
  assert.ok(!html.includes(token));assert.ok(!html.includes(uid));
  assert.equal(r.headers.get('Cache-Control'),'no-store');assert.equal(r.headers.get('X-Frame-Options'),'DENY');
  assert.match(r.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
  const nonce=html.match(/<script nonce="([a-f0-9]+)">/)[1];assert.ok(r.headers.get('Content-Security-Policy').includes("'nonce-"+nonce+"'"));
  assert.equal((await s.invoke('/admin',{method:'POST'})).status,405);
});
test('management requires its own token, exact same browser origin, POST and JSON; no CORS',async()=>{
  const s=setup();
  for(const origin of ['null','ionic://localhost','https://worker.example.evil','https://evil.example']){
    const r=await s.manage({action:'list'},{Origin:origin});assert.equal(r.status,403);assert.equal(r.headers.get('Access-Control-Allow-Origin'),null);
  }
  assert.equal((await s.manage({action:'list'},{Authorization:'Bearer wrong'})).status,401);
  assert.equal((await s.manage({action:'list'},{'Content-Type':'text/plain'})).status,415);
  assert.equal((await s.invoke('/admin/manage',{method:'OPTIONS'})).status,405);
  assert.equal((await s.invoke('/admin/manage',{method:'GET'})).status,405);
  const listed=await s.manage({action:'list'});assert.equal(listed.status,200);assert.equal(listed.headers.get('Access-Control-Allow-Origin'),null);
  delete s.env.ADMIN_UI_TOKEN;assert.equal((await s.manage({action:'list'})).status,503);
  assert.equal(s.apiCalls(),0);
});
test('new managed IDs reach quota through public worker without changing config secret',async()=>{
  const s=setup();
  const add={operationId:crypto.randomUUID(),action:'add',uid:newUid,amountEuroMicros:500000,weeklyLimitEuroMicros:100000};
  assert.equal((await s.manage(add)).status,200);
  const publicQuota=uid=>s.invoke('/quota',{method:'POST',headers:{'Content-Type':'application/json',Origin:'ionic://localhost'},body:JSON.stringify({uid})});
  const r=await publicQuota(newUid);assert.equal(r.status,200);assert.equal((await r.json()).budget.remainingEuroMicros,500000);
  assert.equal((await publicQuota('ef-123456-abcdef-789012')).status,403);
  const topup={operationId:crypto.randomUUID(),action:'topup',uid:newUid,amountEuroMicros:1000000};
  assert.equal((await s.manage(topup)).status,200);assert.equal((await s.manage(topup)).status,200);
  assert.equal((await (await publicQuota(newUid)).json()).budget.remainingEuroMicros,1500000);
  assert.equal(s.apiCalls(),0);
});
test('admin limiter fails closed and management does not grant reconciliation access',async()=>{
  const s=setup();s.env.FEEDBACK_LIMITER.limit=async()=>({success:false});assert.equal((await s.manage({action:'list'})).status,429);
  s.env.FEEDBACK_LIMITER.limit=async()=>({success:true});
  const r=await s.invoke('/admin/reconcile',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:'{}'});assert.equal(r.status,503);
  assert.equal(s.apiCalls(),0);
});
