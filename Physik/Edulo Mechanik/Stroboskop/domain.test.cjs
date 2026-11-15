const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('./task.js'),D=require('./domain.js');
const feedback=(status='met')=>({summary:'',languageFeedback:'',nextSteps:[],misconceptions:[],taskFeedback:L.questions.map(q=>({id:q.id,feedback:'Prüfe deine Begründung.'})),criteria:D.criteria(L).map(c=>({id:c.id,status,feedback:''}))});
test('Vollständiger Worker-Vertrag und Antwortlängen',()=>{
 const t=D.task(L);assert.equal(t.feedbackGroups.length,6);assert.equal(t.criteria.length,14);
 assert(t.prompt.length<=3000);assert(t.referenceAnswer.length<=6000);
 const s=D.fresh(L);assert(D.valid(L,s));assert.throws(()=>D.begin(L,s,'empty','now'));
 for(const q of L.questions)s.answers[q.id]='x'.repeat(1500);
 assert(JSON.stringify(s.answers).length<=12000);assert(D.valid(L,s));
 s.answers.ball+='x';assert(!D.valid(L,s));
});
test('Kriterien korrekt zuordnen und Hilfe über mehrere Versuche bewahren',()=>{
 const s=D.fresh(L);for(const q of L.questions)s.answers[q.id]='Meine Antwort';
 const h=D.begin(L,s,'first','now');assert.throws(()=>D.begin(L,s,'second','now'));
 const f=feedback();f.criteria[0].status='partial';D.finish(L,s,h,f);
 assert.equal(D.scores(L,s)[0],'gray');assert.equal(D.scores(L,s)[1],'green');
 D.finish(L,s,D.begin(L,s,'second','now'),feedback());
 assert.equal(D.scores(L,s)[0],'yellow');assert.equal(D.scores(L,s)[1],'green');
 assert(D.valid(L,JSON.parse(JSON.stringify(s))));
 assert(!D.validFeedback(L,{...feedback(),criteria:feedback().criteria.slice(1)}));
 assert(!D.validFeedback(L,{...feedback(),taskFeedback:Array(6).fill({id:'ball',feedback:'x'})}));
});
test('Physikalische Referenz enthält Abbremsen und Grenzen der Videoauswertung',()=>{
 assert.match(L.questions.find(q=>q.id==='beschleunigt').reference,/Abbremsen/);
 assert.match(L.questions.find(q=>q.id==='ball').reference,/nicht null/);
 assert.match(L.questions.find(q=>q.id==='fall').reference,/sieht das Video nicht/);
});
