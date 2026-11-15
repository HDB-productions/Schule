import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {validTask} from '../../../Edulo/Freitext-KI/worker/worker.mjs';
const require=createRequire(import.meta.url),D=require('./domain.js'),L=require('./task.js'),{resolveFallMedia}=require('./media.js');
const feedback=task=>({summary:'',languageFeedback:'',nextSteps:[],misconceptions:[],taskFeedback:task.feedbackGroups.map(g=>({id:g.id,feedback:'Prüfe deine Begründung.'})),criteria:task.criteria.map(c=>({id:c.id,status:'met',feedback:''}))});
test('task fits existing worker contract, including maximum-sized answers',()=>{
 assert(validTask(D.task(L)));assert.equal(D.criteria(L).length,13);
 const s=D.fresh(L);L.questions.forEach(q=>s.answers[q.id]='x'.repeat(2000));
 const h=D.begin(L,s,'a','2026-10-26'),r=D.request(L,h);assert(r.answer.length<10000);assert(D.valid(L,s));
});
test('table source changes invalidate affected feedback and preserve earned points',()=>{
 const s=D.fresh(L);L.questions.forEach(q=>s.answers[q.id]='Antwort');
 const h=D.begin(L,s,'a','2026-10-26');D.finish(L,s,h,feedback(D.request(L,h).task));h.feedbackStyle='questions-v4';
 assert.equal(D.plan(L,s).checkedQuestionIds.length,0);
 s.answers.messung=JSON.stringify({hoehen_m:['1,4','1,38']});s.answers.geschwindigkeit=JSON.stringify({hoehen_m:['1,4','1,38'],strecken_m:['0,02']});
 const second=D.begin(L,s,'b','2026-10-26'),r=D.request(L,second);
 assert.deepEqual(r.task.feedbackGroups.map(g=>g.id),['messung','geschwindigkeit']);
 D.finish(L,s,second,feedback(r.task));second.feedbackStyle='questions-v4';assert(D.valid(L,s));
 assert(D.scores(L,s).every(c=>c==='green'));assert(D.valid(L,JSON.parse(JSON.stringify(s))));
});
test('media resolution uses exact matching module and Edulo resolver, failing closed on ambiguity',()=>{
 const content={JSON:{type:'html_and_files',html:'EDULO_WIDGET_KEY:freier-fall-ki-v1',files:[{url:'folder/fallvideo.mov'}]}};
 let calls=[];const host={forEachContent:fn=>fn(content),getMediaURLPath:p=>{calls.push(p);return 'https://media.example/'+p;}};
 assert.equal(resolveFallMedia(host,'fallvideo.mov'), 'https://media.example/folder/fallvideo.mov');assert.deepEqual(calls,['folder/fallvideo.mov']);
 assert.throws(()=>resolveFallMedia(host,'missing.jpg'),/hochladen/);
 assert.throws(()=>resolveFallMedia({...host,forEachContent:fn=>{fn(content);fn(content);}},'fallvideo.mov'),/eindeutig/);
 assert.throws(()=>resolveFallMedia({...host,getMediaURLPath:()=> 'javascript:alert(1)'},'fallvideo.mov'),/ungültig/);
 assert.equal(resolveFallMedia(null,'fallvideo.mov','file:///C:/lesson/widget.html'),'file:///C:/lesson/fallvideo.mov');
});
