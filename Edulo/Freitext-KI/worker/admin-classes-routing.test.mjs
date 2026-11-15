import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorker, FeedbackBudget } from './worker.mjs';

const uid = 'ab-123456-abcdef-789012', newUid = 'cd-123456-abcdef-789012';
const token = 'synthetic-administration-key-for-tests-only';
class Storage {
  data = new Map(); queue = Promise.resolve();
  async transaction(fn) {
    const before = this.queue; let release; this.queue = new Promise(r => release = r); await before;
    const copy = structuredClone(this.data);
    try { const result = await fn({ get: async k => structuredClone(copy.get(k)), put: async (k,v) => copy.set(k,structuredClone(v)) }); this.data = copy; return result; }
    finally { release(); }
  }
}
function setup() {
  const calls = [];
  const env = {
    ADMIN_UI_TOKEN: token, OPENAI_API_KEY: 'synthetic-no-external-call', ALLOWED_ORIGINS: 'ionic://localhost',
    ACCOUNTS_JSON: JSON.stringify({[uid]: {name:'Testperson 8 G3 2026 2027',totalGrantedEuroMicros:500000,weeklyLimitEuroMicros:100000}}),
    PRICE_CONFIG_JSON: JSON.stringify({inputNanoUsdPerToken:100,cachedInputNanoUsdPerToken:10,outputNanoUsdPerToken:500,euroMicrosPerUsd:900000,version:'synthetic'}),
    LIMITS_JSON: JSON.stringify({globalLifetimeLimitEuroMicros:2000000,globalWeeklyLimitEuroMicros:500000}),
    FEEDBACK_LIMITER: {limit:async()=>({success:true})},
  };
  const storage = new Storage();
  const object = new FeedbackBudget({storage},env,{upstreamFetch:async(url,options)=>{
    calls.push(JSON.parse(options.body));
    return new Response(JSON.stringify({status:'completed',usage:{input_tokens:100,output_tokens:60,total_tokens:160},output:[{content:[{type:'output_text',text:JSON.stringify({summary:'Gut.',criteria:[{id:'kraft',status:'met',feedback:'Erfüllt.'}],nextSteps:[],languageFeedback:'Verständlich formuliert.',misconceptions:[]})}]}]}));
  }});
  env.FEEDBACK_BUDGET = {idFromName: name=>name,get:()=>({fetch:request=>object.fetch(request)})};
  const invoke = (path,body,headers={}) => createWorker().fetch(new Request('https://worker.example'+path,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)}),env);
  const admin = (body,headers={}) => invoke('/admin/manage',body,{Authorization:'Bearer '+token,Origin:'https://worker.example',...headers});
  const learner = (path,body) => invoke(path,body,{Origin:'ionic://localhost'});
  const mutate = (action,fields={}) => admin({action,operationId:crypto.randomUUID(),...fields});
  return {calls,storage,env,admin,learner,mutate};
}
async function success(response) { assert.equal(response.status,200,await response.clone().text()); return response.json(); }

test('class administration through worker routing preserves balances, enforces freezes and protects metadata',async()=>{
  const s=setup();
  const before=await success(await s.admin({action:'list'}));
  const migrated=await success(await s.mutate('profile',{uid,name:'Testperson',className:'8G3',schoolYear:'2026/2027'}));
  assert.equal(migrated.accounts[0].name,'Testperson');
  assert.deepEqual(migrated.accounts[0].budget,before.accounts[0].budget);
  const body={uid,requestId:crypto.randomUUID(),task:{id:'test',version:'1',prompt:'Was macht Kraft?',referenceAnswer:'Sie ändert Bewegung.',criteria:[{id:'kraft',label:'Kraft',description:'Ändert Bewegung.'}]},answer:'Kraft ändert Bewegung.'};
  await success(await s.learner('/feedback',body));assert.equal(s.calls.length,1);
  assert(!JSON.stringify(s.calls).includes('Testperson'));assert(!JSON.stringify(s.calls).includes('8G3'));assert(!JSON.stringify(s.calls).includes(uid));
  const frozen=await success(await s.mutate('freeze',{uids:[uid],draftIds:[],frozen:true}));assert.equal(frozen.accounts[0].frozen,true);
  const denied=await s.learner('/feedback',{...body,requestId:crypto.randomUUID()});
  assert.equal(denied.status,403);assert.equal((await denied.json()).error.code,'account_frozen');assert.equal(s.calls.length,1);
  await success(await s.learner('/result',{uid,requestId:body.requestId}));
  await success(await s.learner('/feedback',body));assert.equal(s.calls.length,1,'frozen account can recover existing result without another API call');
  const quota=await success(await s.learner('/quota',{uid}));
  for(const field of ['name','className','schoolYear','legacyName','drafts'])assert(!JSON.stringify(quota).includes(field));
  const shifted=await success(await s.mutate('moveClass',{uids:[uid],draftIds:[],className:'9G3',schoolYear:'2027/2028'}));
  assert.equal(shifted.accounts[0].className,'9G3');assert.equal(shifted.accounts[0].frozen,true);
  await success(await s.mutate('freeze',{uids:[uid],draftIds:[],frozen:false}));
  await success(await s.learner('/feedback',{...body,requestId:crypto.randomUUID()}));assert.equal(s.calls.length,2);
});

test('CSV import API is authorized, bounded, atomic, and cannot alter existing account money',async()=>{
  const s=setup(),rows=[{uid,name:'Testperson',className:'8G3',schoolYear:'2026/2027'},{uid:newUid,name:'Zweites Testkonto',className:'8G3',schoolYear:'2026/2027'},{uid:'',name:'Noch ohne ID',className:'8G3',schoolYear:'2026/2027'}];
  const body={action:'import',operationId:crypto.randomUUID(),rows,amountEuroMicros:100000,weeklyLimitEuroMicros:20000};
  for(const headers of [{Authorization:'Bearer wrong'},{Origin:'ionic://localhost'}])assert([401,403].includes((await s.admin(body,headers)).status));
  assert.equal((await success(await s.admin({action:'list'}))).accounts.length,1);
  const imported=await success(await s.admin(body));assert.equal(imported.accounts.length,2);assert.equal(imported.drafts.length,1);
  assert.equal(imported.accounts.find(a=>a.uid===uid).budget.remainingEuroMicros,500000);
  assert.equal(imported.accounts.find(a=>a.uid===newUid).budget.remainingEuroMicros,100000);
  assert.deepEqual(await success(await s.admin(body)),{...imported,replayed:true});
  const another=await success(await s.admin({...body,operationId:crypto.randomUUID()}));assert.equal(another.drafts.length,1);
  assert.equal(another.accounts.find(a=>a.uid===newUid).budget.remainingEuroMicros,100000,'reimport never tops up existing accounts');
  const tooMany=await s.admin({...body,operationId:crypto.randomUUID(),rows:Array.from({length:101},()=>rows[2])});assert.equal(tooMany.status,400);
  const tooLarge=await s.admin({...body,operationId:crypto.randomUUID(),rows:[{...rows[0],name:'x'.repeat(49000)}]});assert.equal(tooLarge.status,413);
  assert.equal(s.calls.length,0);
});
