const D = FractionDomain;
const titles = {reduce:'Gleich große Teile zusammenfassen',expand:'Gleich große Teile weiter unterteilen',operate:'Mit gleich großen Teilen rechnen'};
const introductions = {
  reduce:'Beim Kürzen teilst du Zähler und Nenner durch dieselbe Zahl. Der Anteil bleibt gleich: Aus 6 von 8 kleinen Teilen werden 3 von 4 größeren Teilen. Suche hier den größten gemeinsamen Teiler (ggT), damit du vollständig kürzt.',
  expand:'Beim Erweitern multiplizierst du Zähler und Nenner mit derselben natürlichen Zahl. Der Anteil bleibt gleich: Aus 1 von 2 Teilen werden beim Erweitern mit 3 genau 3 von 6 kleineren Teilen. Der Zielnenner ist vorgegeben.',
  operate:'Brüche mit unterschiedlichen Nennern beschreiben unterschiedlich große Teile. Finde zuerst das kleinste gemeinsame Vielfache (kgV) der Nenner. Erweitere beide Brüche auf diesen Nenner. Addiere oder subtrahiere dann nur die Zähler; der gemeinsame Nenner bleibt. Kürze zum Schluss vollständig. Beispiel: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.'
};
const freshActive = task => ({task,index:0,drafts:[],attempts:[],help:[],feedback:null});
const selectTask = (level,history) => {
  const pool=D.tasks(KIND,level), used=new Set(history.map(h=>h.task.id));
  const unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  return choices[Math.floor(Math.random()*choices.length)];
};
const validDraft = d => d && typeof d==='object' && !Array.isArray(d) && Object.entries(d).every(([k,v])=>['n','d','factor','same','common','left','right'].includes(k)&&typeof v==='string'&&v.length<=24);
function validActive(a) {
  if(!a || !D.validTask(a.task) || a.task.kind!==KIND)return false;
  const len=D.steps(a.task).length;
  return Number.isInteger(a.index)&&a.index>=0&&a.index<=len && Array.isArray(a.drafts)&&a.drafts.length<=len&&a.drafts.every(validDraft) && Array.isArray(a.help)&&a.help.every(i=>Number.isInteger(i)&&i>=0&&i<len) && Array.isArray(a.attempts)&&a.attempts.every(v=>v&&Number.isInteger(v.step)&&v.step>=0&&v.step<len&&typeof v.correct==='boolean'&&validDraft(v.answer)) && (a.feedback===null || (typeof a.feedback?.text==='string'&&typeof a.feedback?.bad==='boolean'));
}
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:1,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),
  validate:s=>!!s&&[1,2].includes(s.level)&&typeof s.intro==='boolean'&&validActive(s.active)&&s.active.task.level===s.level&&Array.isArray(s.history)&&s.history.every(h=>validActive(h)&&h.index===D.steps(h.task).length),
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fraction = (n,d) => `<span class="frac" aria-label="${n} durch ${d}"><span>${n}</span><span>${d}</span></span>`;
const answerText = (field,value) => field.key==='same'?(value==='1'?'Der Anteil bleibt gleich':value==='0'?'Der Anteil verändert sich':'Keine Auswahl'):`${field.label}: ${value}`;
function taskHTML(t,result=null) {
  const answer=result?fraction(result.n,result.d):'?';
  if(KIND==='operate')return `${fraction(t.n,t.d)} <span>${t.op==='-'?'−':'+'}</span> ${fraction(t.bn,t.bd)} <span>=</span> ${answer}`;
  if(KIND==='expand')return `${fraction(t.n,t.d)} <span>=</span> ${result?answer:fraction('?',t.target)}`;
  return `${fraction(t.n,t.d)} <span>=</span> ${answer}`;
}
function taskText(t) {return KIND==='operate'?`${t.n}/${t.d} ${t.op==='-'?'−':'+'} ${t.bn}/${t.bd}`:KIND==='expand'?`${t.n}/${t.d} auf Nenner ${t.target}`:`${t.n}/${t.d}`;}
// Alle Streifen haben dieselbe Breite: Ein Streifen ist immer genau ein Ganzes.
function model(n,d,label,{group=1,color='#19a491',removed=0,split=Infinity}={}) {
  let html=`<figure class="model"><figcaption class="model-label">${esc(label)}</figcaption>`;
  const wholes=Math.max(1,Math.ceil(n/d));
  for(let w=0;w<wholes;w++) {
    const count=Math.max(0,Math.min(d,n-w*d));
    html+=`<svg class="bar-svg" viewBox="0 0 364 64" role="img" aria-label="${count} von ${d} Teilen eines Ganzen markiert${removed?', davon '+removed+' weggenommen':''}"><rect x="2" y="2" width="360" height="60" fill="#f7faf9" stroke="#193c43" stroke-width="2"/>`;
    for(let i=0;i<d;i++) {
      const x=2+i*360/d,width=360/d;
      if(i<count)html+=`<rect x="${x}" y="3" width="${width}" height="58" fill="${w*d+i>=split?'#4287bc':color}"/>`;
      if(removed && i<count && w*d+i>=n-removed)html+=`<rect x="${x}" y="3" width="${width}" height="58" fill="#fff1dd"/><path d="M ${x+1} 8 L ${x+width-1} 56 M ${x+1} 56 L ${x+width-1} 8" stroke="#a35327" stroke-width="2"/>`;
      if(i>0)html+=`<path d="M ${x} 2 V 62" stroke="#557e75" stroke-width="${i%group===0?2.5:.7}" ${i%group===0?'':'stroke-dasharray="3 3"'}/>`;
    }
    html+='</svg><p class="whole-label">Ein Ganzes</p>';
  }
  return html+'</figure>';
}
function renderVisual() {
  const {task:t,index:i}=state.active;let html='',caption='Die farbige Fläche zeigt den Anteil. Jeder gleich breite Streifen steht für ein Ganzes.';
  if(KIND==='reduce') {
    const factor=D.gcd(t.n,t.d);
    html=model(t.n,t.d,`Ausgangsbruch: ${t.n}/${t.d}`,{group:i>=1?factor:1});
    if(i>=1)caption=`Je ${factor} kleine Teile bilden ein größeres Teil. Dicke Linien begrenzen die neuen Teile; die Fläche bleibt gleich.`;
    if(i>=2)html+=model(t.n/factor,t.d/factor,`Gekürzt: ${t.n/factor}/${t.d/factor}`);
  } else if(KIND==='expand') {
    const factor=t.target/t.d;
    html=model(t.n,t.d,`Ausgangsbruch: ${t.n}/${t.d}`);
    if(i>=1)html+=model(t.n*factor,t.target,`Jedes alte Teil wird in ${factor} neue Teile geteilt`,{group:factor});
    if(i>=1)caption='Dicke Linien zeigen die alten Grenzen, gestrichelte Linien die neue Unterteilung. Die farbige Fläche bleibt gleich.';
  } else {
    const common=D.lcm(t.d,t.bd),left=t.n*common/t.d,right=t.bn*common/t.bd;
    html=model(i>=1?left:t.n,i>=1?common:t.d,`Erster Bruch: ${i>=2?left+'/'+common:t.n+'/'+t.d}${i===1?' · neue Unterteilung':''}`);
    html+=model(i>=1?right:t.bn,i>=1?common:t.bd,`Zweiter Bruch: ${i>=2?right+'/'+common:t.bn+'/'+t.bd}${i===1?' · neue Unterteilung':''}`,{color:'#4287bc'});
    if(i>=1)caption=`Beide Ganzen sind jetzt in ${common} gleich große Teile geteilt. Erst jetzt können wir die Zähler verrechnen.`;
    if(i>=3) {
      const n=t.op==='-'?left-right:left+right;
      if(t.op==='-')html+=model(left,common,`${right} Teile wegnehmen`,{removed:right});
      html+=model(n,common,`Ergebnis: ${n}/${common}`,{split:t.op==='+'?left:Infinity});
      const divisor=D.gcd(n,common);
      if(i>=4&&divisor>1)html+=model(n/divisor,common/divisor,`Vollständig gekürzt: ${n/divisor}/${common/divisor}`);
      caption=t.op==='-'?'Die durchgestrichenen Teile werden weggenommen. Der Nenner beschreibt weiter dieselbe Teilgröße.':'Die Anteile werden zusammengezählt. Jeder Streifen bleibt ein Ganzes; der Nenner bleibt gleich.';
    }
  }
  q('[data-visual]').innerHTML=html;q('[data-visual-caption]').textContent=caption;
}
function renderFields(step) {
  const draft=state.active.drafts[state.active.index]||{};
  const fields=step.fields;
  if(fields.length===1&&fields[0].key==='same') {
    q('[data-fields]').innerHTML='<button type="button" data-choice="1" aria-pressed="false">Der Anteil bleibt gleich</button><button type="button" data-choice="0" aria-pressed="false">Der Anteil verändert sich</button>';
    for(const button of root.querySelectorAll('[data-choice]'))button.setAttribute('aria-pressed',String(draft.same===button.dataset.choice));
    return;
  }
  const inputs=fields.map(f=>`<label class="entry">${esc(f.label)}<input type="text" inputmode="numeric" autocomplete="off" maxlength="24" data-key="${esc(f.key)}" aria-label="${esc(f.label)}" value="${esc(draft[f.key]||'')}"></label>`).join('');
  q('[data-fields]').innerHTML=fields.length===2&&fields[0].key==='n'?`<div class="fraction-input">${inputs}</div>`:inputs;
}
function renderHistory() {
  const history=state.history,clean=history.filter(h=>!h.help.length&&h.attempts.every(a=>a.correct)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  q('[data-history]').innerHTML=history.length?history.map(h=>`<li><details><summary>${esc(taskText(h.task))} · Stufe ${h.task.level} · ${h.help.length||h.attempts.some(a=>!a.correct)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><ol>${h.attempts.map(a=>`<li>Schritt ${a.step+1}: ${D.steps(h.task)[a.step].fields.map(f=>esc(answerText(f,a.answer[f.key]??'leer'))).join(', ')} – ${a.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>${h.help.length?'<p>Tipp genutzt in Schritt '+h.help.map(i=>i+1).join(', ')+'.</p>':''}</details></li>`).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function render() {
  const a=state.active,steps=D.steps(a.task),done=a.index===steps.length;
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  const resultStep=KIND==='operate'?steps.length-1:1;
  q('[data-category]').textContent=titles[KIND];q('[data-task]').innerHTML=taskHTML(a.task,done?Object.fromEntries(steps[resultStep].fields.map(f=>[f.key,f.value])):null);
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`Schritt ${a.index+1} von ${steps.length}`;
  q('[data-heading]').textContent=done?'Geschafft!':steps[a.index].title;
  q('[data-instruction]').textContent=done?'Alle Schritte sind gelöst. Du kannst weiterüben oder die Schwierigkeitsstufe wechseln.':steps[a.index].text;
  q('[data-fields]').hidden=done;q('[data-check]').hidden=done;q('[data-hint]').hidden=done;q('[data-next]').hidden=!done;
  if(!done)renderFields(steps[a.index]);
  q('[data-hint-text]').hidden=done||!a.help.includes(a.index);q('[data-hint-text]').textContent=done?'':steps[a.index].hint;
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);
  q('[data-confirmed]').innerHTML=steps.slice(0,a.index).map((step,i)=>`<li><b>${esc(step.title)}</b><br>${esc(step.explanation)}<br><small>Deine Eingabe: ${step.fields.map(f=>esc(answerText(f,a.drafts[i]?.[f.key]??''))).join(' · ')}</small></li>`).join('');
  q('[data-introduction]').hidden=!state.intro;q('[data-introduction]').textContent=introductions[KIND];q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;
  q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');
  renderVisual();renderHistory();
}
const draft = () => state.active.drafts[state.active.index] ||= {};
function save(immediate=false) {try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{} }
q('[data-fields]').addEventListener('input',e=>{if(!ready||!e.target.dataset.key)return;draft()[e.target.dataset.key]=e.target.value;save();});
q('[data-fields]').addEventListener('click',e=>{const button=e.target.closest('[data-choice]');if(!ready||!button)return;draft().same=button.dataset.choice;for(const b of root.querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(b===button));save();});
function check() {
  if(!ready)return;const a=state.active,steps=D.steps(a.task);if(a.index>=steps.length)return;
  const answer={...draft()},step=steps[a.index];
  const correct=step.fields.every(f=>/^\d+$/.test((answer[f.key]||'').trim())&&Number(answer[f.key])===f.value);
  a.attempts.push({step:a.index,answer,correct});
  if(correct) {
    a.index++;a.feedback={text:'Richtig! Der bestätigte Rechenschritt steht unten.',bad:false};
    if(a.index===steps.length) {
      const slot=state.history.length;
      if(slot<scores.length)scores[slot]=a.help.length||a.attempts.some(v=>!v.correct)?'yellow':'green';
      state.history.push(JSON.parse(JSON.stringify(a)));
      a.feedback={text:'Richtig gelöst. Schau dir die bestätigten Rechenschritte noch einmal an.',bad:false};
    }
  }else a.feedback={text:KIND==='operate'&&a.index===2?'Noch nicht richtig. Verrechne nur die Zähler und behalte den gemeinsamen Nenner. Kürze erst im nächsten Schritt.':'Noch nicht richtig. Prüfe die Eingaben am Bild. Du kannst sie verbessern oder einen Tipp öffnen.',bad:true};
  save(true);render();if(correct)q(a.index===steps.length?'[data-next]':'[data-heading]').focus();
}
q('[data-check]').addEventListener('click',check);
q('[data-fields]').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();check();}});
q('[data-hint]').addEventListener('click',()=>{if(!ready)return;const a=state.active;if(!a.help.includes(a.index))a.help.push(a.index);save(true);q('[data-hint-text]').textContent=D.steps(a.task)[a.index].hint;q('[data-hint-text]').hidden=false;});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-introduction]').textContent=introductions[KIND];q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
q('[data-level]').addEventListener('change',()=>{if(!ready||state.active.index!==D.steps(state.active.task).length)return;state.level=Number(q('[data-level]').value);state.active=freshActive(selectTask(state.level,state.history));save(true);render();q('[data-heading]').focus();});
q('[data-next]').addEventListener('click',()=>{if(!ready||state.active.index!==D.steps(state.active.task).length)return;state.active=freshActive(selectTask(state.level,state.history));save(true);render();q('[data-heading]').focus();});
async function start() {
  ready=false;q('[data-controls]').disabled=true;
  try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}
}
q('[data-retry]').addEventListener('click',start);
start();
