const D=FractionDomain;
const clone=value=>JSON.parse(JSON.stringify(value));
const plain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const exactKeys=(value,keys)=>plain(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
const text=value=>typeof value==='string'&&value.length<=24;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fraction=(n,d)=>`<span class="frac" aria-label="${n} durch ${d}"><span>${n}</span><span>${d}</span></span>`;
const introduction='Beim Erweitern multiplizierst du Zähler und Nenner mit derselben natürlichen Zahl größer als 1. Der Anteil bleibt gleich: Aus 1 von 2 Teilen werden mit dem Faktor 3 genau 3 von 6 kleineren Teilen. Hier ist der Zielnenner vorgegeben. Bestimme zuerst den passenden Faktor und erweitere dann den Bruch.';
// Stable state/test hooks: state, scores, ready, freshActive and render. Index 0:
// factor; index 1: result; index 2: completed. Only check() awards a point.
const freshActive=task=>({task:clone(task),index:0,drafts:[],attempts:[],help:[],feedback:null,legacy:false,legacyAttempts:null});
const selectTask=(level,history)=>{
  const pool=D.tasks('expand',level),used=new Set(history.map(h=>h.task.id)),unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  return choices[Math.floor(Math.random()*choices.length)];
};
const validFeedback=value=>value===null||(exactKeys(value,['text','bad'])&&typeof value.text==='string'&&value.text.length<=2000&&typeof value.bad==='boolean');
const validDraft=value=>plain(value)&&Object.entries(value).every(([key,value])=>['factor','n','d','same','common','left','right'].includes(key)&&text(value));
const valueMatches=(value,expected)=>text(value)&&/^\d+$/.test(value.trim())&&Number(value)===expected;
const answerCorrect=(task,step,answer)=>D.steps(task)[step].fields.every(field=>valueMatches(answer[field.key],field.value));
function validAttempt(attempt,task,legacy=false){
  return exactKeys(attempt,['step','answer','correct'])&&Number.isInteger(attempt.step)&&attempt.step>=0&&attempt.step<(legacy?3:2)&&validDraft(attempt.answer)&&(legacy||exactKeys(attempt.answer,attempt.step===0?['factor']:['n','d']))&&typeof attempt.correct==='boolean'&&attempt.correct===answerCorrect(task,attempt.step,attempt.answer);
}
function validOldActive(a){
  if(!exactKeys(a,['task','index','drafts','attempts','help','feedback'])||!D.validTask(a.task)||a.task.kind!=='expand'||!Number.isInteger(a.index)||a.index<0||a.index>3||!Array.isArray(a.drafts)||a.drafts.length>3||!a.drafts.every(validDraft)||!Array.isArray(a.attempts)||!a.attempts.every(v=>validAttempt(v,a.task,true))||!Array.isArray(a.help)||!a.help.every(v=>Number.isInteger(v)&&v>=0&&v<3)||!validFeedback(a.feedback))return false;
  for(let i=0;i<a.index;i++)if(!a.drafts[i]||!answerCorrect(a.task,i,a.drafts[i]))return false;
  return true;
}
function validActive(a){
  if(!exactKeys(a,['task','index','drafts','attempts','help','feedback','legacy','legacyAttempts'])||!D.validTask(a.task)||a.task.kind!=='expand'||typeof a.legacy!=='boolean'||!Number.isInteger(a.index)||a.index<0||a.index>2||!Array.isArray(a.drafts)||a.drafts.length>(a.legacy?3:2)||!a.drafts.every(validDraft)||!Array.isArray(a.attempts)||!a.attempts.every(v=>validAttempt(v,a.task,a.legacy))||!Array.isArray(a.help)||!a.help.every(v=>Number.isInteger(v)&&v>=0&&v<(a.legacy?3:2))||!validFeedback(a.feedback))return false;
  if(a.legacyAttempts!==null&&(!a.legacy||!Array.isArray(a.legacyAttempts)||!a.legacyAttempts.every(v=>validAttempt(v,a.task,true))))return false;
  for(let i=0;i<a.index;i++)if(!a.drafts[i]||!answerCorrect(a.task,i,a.drafts[i]))return false;
  if(!a.legacy&&a.drafts.some((draft,index)=>Object.keys(draft).some(key=>!(index===0?['factor']:['n','d']).includes(key))))return false;
  return true;
}
function validState(s){return exactKeys(s,['level','active','history','intro'])&&[1,2].includes(s.level)&&typeof s.intro==='boolean'&&validActive(s.active)&&s.active.task.level===s.level&&Array.isArray(s.history)&&s.history.every(h=>validActive(h)&&h.index===2);}
function migrateSnapshot(snapshot){
  if(!exactKeys(snapshot,['widget','version','data','scores'])||snapshot.widget!=='brueche-erweitern'||snapshot.version!==1||!Array.isArray(snapshot.scores)||snapshot.scores.length!==20||snapshot.scores.some(v=>!['gray','green','yellow','red'].includes(v)))throw new Error('Dieser ältere Lernstand kann nicht übernommen werden. Das Original bleibt erhalten.');
  const s=snapshot.data;
  if(!exactKeys(s,['level','active','history','intro'])||![1,2].includes(s.level)||typeof s.intro!=='boolean'||!validOldActive(s.active)||s.active.task.level!==s.level||!Array.isArray(s.history)||!s.history.every(h=>validOldActive(h)&&h.index===3))throw new Error('Der ältere Erweiterungsstand ist beschädigt. Das Original bleibt erhalten.');
  const convert=a=>{
    const next={...clone(a),index:a.index===3?2:a.index===2?1:a.index,legacy:true,legacyAttempts:null};
    if(a.index===2)next.feedback={text:'Dein Bruch wurde bereits richtig geprüft. Bestätige ihn mit „Bruch prüfen“, um die Aufgabe abzuschließen.',bad:false};
    return next;
  };
  const migrated={widget:snapshot.widget,version:2,data:{level:s.level,active:convert(s.active),history:s.history.map(convert),intro:s.intro},scores:clone(snapshot.scores)};
  if(!validState(migrated.data))throw new Error('Der ältere Erweiterungsstand konnte nicht vollständig übernommen werden. Das Original bleibt erhalten.');
  return migrated;
}
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:2,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),validate:validState,migrateSnapshot,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
const tainted=a=>a.help.length>0||a.attempts.some(v=>!v.correct)||!!a.legacyAttempts?.some(v=>!v.correct);
function save(immediate=false){try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{}}
function diagram(task,result=false){
  const {n,d,factor}=task,count=result?d*factor:d,filled=result?n*factor:n;
  const image=FractionVisuals.image({n:filled,d:count,group:result?factor:1,columns:FractionVisuals.columns(d),label:`${filled} von ${count} Teilen eines Ganzen${result?', jedes ursprüngliche Teil in '+factor+' kleine Teile unterteilt':''}`});
  return `<figure class="expand-diagram ${result?'result':'original'}" ${result?'data-result-model':''}>${image}<figcaption>${result?`Jedes Teil → ${factor} Teilstücke`:'Ein Ganzes'}</figcaption></figure>`;
}
function renderEquations(){
  const a=state.active,t=a.task,factor=a.drafts[0]?.factor||'',result=a.drafts[1]||{},preview=a.attempts.filter(v=>v.step===1).at(-1),done=a.index===2;
  const factorHTML=a.index===0?`<label class="factor-input"><span class="sr-only">Erweiterungsfaktor</span><input data-key="factor" aria-label="Erweiterungsfaktor" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(factor)}" ${a.feedback?.bad?'aria-invalid="true"':''}></label>`:`<span class="expand-factor" aria-label="Erweiterungsfaktor ${t.factor}">${t.factor}</span>`;
  const input=(key,label,expected)=>`<input data-key="${key}" aria-label="${label}" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(result[key]||'')}" aria-invalid="${!!preview&&!valueMatches(result[key]||'',expected)}">`;
  const answer=done?fraction(t.n*t.factor,t.target):a.index===1?`<div class="expand-fraction-input">${input('n','Neuer Zähler',t.n*t.factor)}<span class="expand-input-rule" aria-hidden="true"></span><span class="fixed-denominator" aria-label="Vorgegebener Nenner ${t.target}">${t.target}</span></div>`:fraction('?',t.target);
  q('[data-equations]').innerHTML=`<section class="expand-round" aria-label="Bruch erweitern"><p class="expand-target">Erweitere auf den Nenner ${t.target}.</p><div class="expand-equation"><div class="expand-number">${fraction(t.n,t.d)}</div><div class="expand-sign">${factorHTML}<span class="equals">=</span></div><div class="expand-number">${answer}</div>${diagram(t)}${preview?diagram(t,true):''}</div></section>`;
}
function renderHistory(){
  const history=state.history,clean=history.filter(h=>!tainted(h)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  const answerText=(task,attempt)=>D.steps(task)[attempt.step].fields.map(field=>`${field.label}: ${attempt.answer[field.key]||'leer'}`).join(', ');
  const attemptsHTML=h=>[...h.attempts,...(h.legacyAttempts||[])].map(v=>`<li>${v.step===2?'Bisheriger Vergleich':`Schritt ${v.step+1}`}: ${esc(answerText(h.task,v))} – ${v.correct?'richtig':'noch nicht richtig'}</li>`).join('');
  q('[data-history]').innerHTML=history.length?history.map(h=>`<li><details><summary>${h.task.n}/${h.task.d} auf Nenner ${h.task.target} · Stufe ${h.task.level} · ${tainted(h)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><p>${h.task.n}/${h.task.d} mit Faktor ${h.task.factor} erweitert: ${h.task.n*h.task.factor}/${h.task.target}</p><details><summary>Meine Versuche</summary><ol>${attemptsHTML(h)}</ol>${h.help.length?`<p>Tipp genutzt in Schritt ${h.help.map(i=>i+1).join(', ')}.</p>`:''}</details></details></li>`).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function render(){
  const a=state.active,done=a.index===2;
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`Schritt ${a.index+1} von 2 · ${a.index===0?'Erweiterungsfaktor finden':'Neuen Zähler berechnen'}`;
  q('[data-heading]').textContent=done?'Richtig erweitert!':a.index===0?'Finde den passenden Erweiterungsfaktor.':'Berechne den neuen Zähler.';
  q('[data-instruction]').textContent=done?'Der Bruch hat jetzt den Zielnenner. Die gleich große farbige Fläche zeigt: Der Anteil bleibt beim Erweitern gleich.':a.index===0?`Mit welcher Zahl musst du ${a.task.d} multiplizieren, um den Zielnenner ${a.task.target} zu erhalten? Trage den Faktor über dem Gleichheitszeichen ein.`:`Multipliziere den Zähler mit ${a.task.factor}. Der Zielnenner ${a.task.target} ist schon vorgegeben.`;
  q('[data-check]').hidden=done;q('[data-check]').textContent=a.index===0?'Faktor prüfen':'Bruch prüfen';q('[data-hint]').hidden=done;q('[data-next]').hidden=!done;
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);
  q('[data-rating]').hidden=!tainted(a);q('[data-hint-text]').hidden=done||!a.help.includes(a.index);q('[data-hint-text]').textContent=done?'':D.steps(a.task)[a.index].hint;
  q('[data-introduction]').textContent=introduction;q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;
  q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');renderEquations();renderHistory();
}
q('[data-equations]').addEventListener('input',e=>{
  if(!ready||!e.target.dataset.key||state.active.index===2)return;
  (state.active.drafts[state.active.index]||={})[e.target.dataset.key]=e.target.value;e.target.removeAttribute('aria-invalid');save();
});
function check(){
  if(!ready||state.active.index===2)return;
  // Keep the existing storage format; the target denominator is supplied,
  // including when resuming a previous editable-denominator draft.
  if(state.active.index===1)(state.active.drafts[1]||={}).d=String(state.active.task.target);
  const a=state.active,step=a.index,fields=D.steps(a.task)[step].fields,draft=a.drafts[step]||{},answer=Object.fromEntries(fields.map(f=>[f.key,draft[f.key]||''])),correct=answerCorrect(a.task,step,answer);
  a.attempts.push({step,answer,correct});
  if(correct){
    a.index++;
    a.feedback={text:step===0?`Richtig! Multipliziere Zähler und Nenner mit ${a.task.factor}.`:'Richtig! Du hast den Bruch auf den vorgegebenen Nenner erweitert.',bad:false};
    if(a.index===2){const slot=state.history.length;if(slot<scores.length)scores[slot]=tainted(a)?'yellow':'green';state.history.push(clone(a));}
  }else a.feedback={text:step===0?`Noch nicht richtig. Der Faktor muss ${a.task.d} auf den Zielnenner ${a.task.target} bringen.`:`Noch nicht richtig. Multipliziere Zähler und Nenner mit ${a.task.factor}. Vergleiche die Unterteilung im Bild mit deinem Bruch.`,bad:true};
  save(true);render();if(correct)q(a.index===2?'[data-next]':'[data-key="n"]').focus();
}
q('[data-check]').addEventListener('click',check);
q('[data-equations]').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();check();}});
q('[data-hint]').addEventListener('click',()=>{if(!ready||state.active.index===2)return;const a=state.active;if(!a.help.includes(a.index))a.help.push(a.index);save(true);q('[data-hint-text]').textContent=D.steps(a.task)[a.index].hint;q('[data-hint-text]').hidden=false;q('[data-rating]').hidden=false;});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-introduction]').textContent=introduction;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
function next(level){if(!ready||state.active.index!==2)return;state.level=level;state.active=freshActive(selectTask(level,state.history));save(true);render();q('[data-key="factor"]').focus();}
q('[data-next]').addEventListener('click',()=>next(state.level));q('[data-level]').addEventListener('change',()=>next(Number(q('[data-level]').value)));
async function start(){ready=false;q('[data-controls]').disabled=true;try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}}
q('[data-retry]').addEventListener('click',start);start();
