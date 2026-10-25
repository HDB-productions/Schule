// Full lesson -> real Worker/ledger code -> simulated OpenAI -> real scoring.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createWorker,FeedbackBudget,validTask} from '../../../Edulo/Freitext-KI/worker/worker.mjs';
const require=createRequire(import.meta.url),L=require('./task.js'),D=require('./domain.js');
class Storage{
 constructor(){this.data=new Map();this.queue=Promise.resolve();}
 async transaction(fn){const prev=this.queue;let release;this.queue=new Promise(r=>release=r);await prev;
  const data=structuredClone(this.data);
  try{const result=await fn({get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v))});this.data=data;return result;}finally{release();}}
}
test('real lesson rubric fits generic worker and survives grading with charged usage',async()=>{
 const task=D.task(L);assert(validTask(task));assert.equal(task.criteria.length,13);assert(task.prompt.length<=3000);assert(task.referenceAnswer.length<=6000);
 const uid='ab-123456-abcdef-789012',origin='https://lesson.example';let calls=0;
 const env={OPENAI_API_KEY:'synthetic-key',ALLOWED_ORIGINS:origin,ACCOUNTS_JSON:JSON.stringify({[uid]:{totalGrantedEuroMicros:1000000,weeklyLimitEuroMicros:100000}}),
  PRICE_CONFIG_JSON:JSON.stringify({inputNanoUsdPerToken:100,cachedInputNanoUsdPerToken:10,outputNanoUsdPerToken:500,euroMicrosPerUsd:1000000,version:'synthetic-test'}),
  LIMITS_JSON:JSON.stringify({globalLifetimeLimitEuroMicros:1000000,globalWeeklyLimitEuroMicros:100000}),FEEDBACK_LIMITER:{limit:async()=>({success:true})}};
 const resultFeedback={summary:'Eine verständliche Erklärung.',misconceptions:[],languageFeedback:'Du formulierst verständlich.',nextSteps:[],taskFeedback:task.feedbackGroups.map(g=>({id:g.id,feedback:'Deine Erläuterung zu dieser Aufgabe ist verständlich und fachlich ausreichend.'})),criteria:task.criteria.map(c=>({id:c.id,status:'met',feedback:''}))};
 const instance=new FeedbackBudget({storage:new Storage()},env,{upstreamFetch:async(url,options)=>{
  calls++;assert.equal(url,'https://api.openai.com/v1/responses');const request=JSON.parse(options.body);
  assert(!JSON.stringify(request).includes(uid),'Edulo ID leaked to model');assert.equal(request.model,'gpt-6-luna');
  const content=JSON.parse(request.input[0].content[0].text);assert.deepEqual(content.task,task);
  return new Response(JSON.stringify({status:'completed',id:'synthetic-response',usage:{input_tokens:2400,output_tokens:900,input_tokens_details:{cached_tokens:0},total_tokens:3300},
   output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(resultFeedback)}]}]}));}});
 env.FEEDBACK_BUDGET={idFromName:n=>n,get:()=>({fetch:r=>instance.fetch(r)})};
 const s=D.fresh(L);for(const q of L.questions)s.answers[q.id]=q.reference;
 const h=D.begin(L,s,crypto.randomUUID(),new Date().toISOString());
 const payload={uid,requestId:h.requestId,task,answer:JSON.stringify(h.answers)};
 const request=()=>new Request('https://worker.example/feedback',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const worker=createWorker(),response=await worker.fetch(request(),env);assert.equal(response.status,200);
 const result=await response.json();assert(D.validFeedback(L,result.feedback));assert.equal(result.requestId,h.requestId);assert.equal(result.charge.euroMicros,690);
 D.finish(L,s,h,result.feedback);assert(D.scores(L,s).every(c=>c==='green'));assert(D.valid(L,s));
 const repeat=await worker.fetch(request(),env);assert.equal(repeat.status,200);assert.equal(calls,1);assert.equal((await repeat.json()).charge.euroMicros,690);
});

