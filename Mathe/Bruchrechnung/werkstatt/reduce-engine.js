const D=FractionDomain,R=ReduceDomain;
const freshActive=task=>R.fresh(task);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fraction=(n,d)=>`<span class="frac" aria-label="${n} durch ${d}"><span>${n}</span><span>${d}</span></span>`;
const introduction='Beim Kürzen teilst du Zähler und Nenner durch dieselbe natürliche Zahl größer als 1. Suche einen möglichst großen gemeinsamen Teiler. Auch ein kleinerer gemeinsamer Teiler ist richtig: Du kannst danach weiter kürzen. Beispiel: 12/24 : 2 ergibt 6/12. Daraus wird mit : 3 der Bruch 2/4 und mit : 2 schließlich 1/2. Nach jedem Ergebnis entscheidest du, ob du noch weiter kürzen kannst.';
const selectTask=(level,history)=>{
  const pool=D.tasks('reduce',level),used=new Set(history.map(h=>h.task.id)),unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  // Four of every five selections prioritize composite divisors. Rotate among
  // the least-practised divisor groups instead of letting small primes dominate.
  const completed=history.filter(h=>h.task.level===level);
  if(completed.length%5!==4){
    const factors=[4,6,8,9,10,12],groups=factors.map(factor=>({factor,tasks:choices.filter(t=>t.factor===factor),done:completed.filter(h=>h.task.factor===factor).length})).filter(g=>g.tasks.length);
    if(groups.length){const minimum=Math.min(...groups.map(g=>g.done)),least=groups.filter(g=>g.done===minimum),group=least[Math.floor(Math.random()*least.length)];return group.tasks[Math.floor(Math.random()*group.tasks.length)];}
  }
  return choices[Math.floor(Math.random()*choices.length)];
};
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:2,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),
  validate:R.validState,migrateSnapshot:R.migrateSnapshot,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
function save(immediate=false){try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{}}
const tainted=a=>a.hadError||a.help.length>0||a.attempts.some(v=>!v.correct);
function diagram(n,d,group=1,result=false) {
  // Keep every group inside a column, including when the learner chooses a
  // smaller divisor before completing the reduction in another round.
  const reducedDenominator=d/D.gcd(n,d);
  let columns=1;
  for(let c=1;c<=8;c++)if(reducedDenominator%c===0)columns=c;
  const image=FractionVisuals.image({n,d,group,columns});
  const caption=result?`Je ${group} Teile → 1 Teil`:'Ein Ganzes';
  return `<figure class="reduce-diagram ${result?'result':'original'}" ${result?'data-result-model':''}>${image}<figcaption>${caption}</figcaption></figure>`;
}
function renderEquations() {
  const a=state.active;
  const rounds=a.rounds.map((r,index)=>{
    const active=index===a.rounds.length-1,editingFactor=active&&a.phase==='factor',editingResult=active&&a.phase==='result';
    const factor=editingFactor?`<label class="factor-input"><span class="sr-only">Kürzungszahl</span><input data-key="factor" aria-label="Kürzungszahl" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(r.draftFactor)}" ${a.feedback?.bad?'aria-invalid="true"':''}></label>`:`<span class="reduce-factor" aria-label="Kürzungszahl ${r.factor}">${r.factor}</span>`;
    const validEntry=(value,expected)=>/^\d+$/.test(value.trim())&&Number(value)===expected;
    const invalidN=!!r.preview&&!r.preview.correct&&!validEntry(r.preview.n,r.n/r.factor);
    const invalidD=!!r.preview&&!r.preview.correct&&!validEntry(r.preview.d,r.d/r.factor);
    let answer='';
    if(editingResult)answer=`<div class="reduce-fraction-input"><input data-key="n" aria-label="Neuer Zähler" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(r.draftN)}" aria-invalid="${invalidN}"><span class="reduce-input-rule" aria-hidden="true"></span><input data-key="d" aria-label="Neuer Nenner" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(r.draftD)}" aria-invalid="${invalidD}"></div>`;
    else if(r.solved)answer=fraction(r.n/r.factor,r.d/r.factor);
    return `<section class="reduce-round" aria-label="Kürzung ${index+1}"><p class="reduce-round-label">${index+1}. Kürzung</p><div class="reduce-equation"><div class="reduce-number">${fraction(r.n,r.d)}</div><div class="reduce-sign"><span class="equals">=</span>${factor}</div><div class="reduce-number">${answer}</div>${diagram(r.n,r.d)}${r.preview?diagram(r.n,r.d,r.factor,true):''}</div></section>`;
  });
  q('[data-equations]').innerHTML=(rounds.length>1?`<details class="prior-steps"><summary>Vorherige Kürzungen (${rounds.length-1})</summary>${rounds.slice(0,-1).join('')}</details>`:'')+rounds.at(-1);
}
function renderHistory() {
  const history=state.history,clean=history.filter(h=>!tainted(h)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  const answerText=attempt=>attempt.phase==='factor'?`Kürzungszahl: ${attempt.answer.factor||'leer'}`:attempt.phase==='result'?`Bruch: ${attempt.answer.n||'leer'}/${attempt.answer.d||'leer'}`:`Weiter kürzen? ${attempt.answer.again==='yes'?'Ja':attempt.answer.again==='no'?'Nein':'keine Auswahl'}`;
  q('[data-history]').innerHTML=history.length?history.map(h=>`<li><details><summary>${h.task.n}/${h.task.d} · Stufe ${h.task.level} · ${tainted(h)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><ol>${h.rounds.map(r=>`<li>${r.n}/${r.d} mit ${r.factor} kürzen: ${r.n/r.factor}/${r.d/r.factor}</li>`).join('')}</ol><details><summary>Meine Versuche</summary><ol>${h.attempts.map(attempt=>`<li>${attempt.round+1}. Kürzung · ${esc(answerText(attempt))} – ${attempt.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>${h.help.length?'<p>Tipp genutzt.</p>':''}${h.legacyAttempts?`<p>Aus der bisherigen Übung übernommen.</p><ol>${h.legacyAttempts.map(attempt=>`<li>Schritt ${attempt.step+1}: ${esc(Object.entries(attempt.answer).map(([key,value])=>`${key==='factor'?'Kürzungszahl':key==='n'?'Zähler':key==='d'?'Nenner':'Vergleich'}: ${value}`).join(', '))} – ${attempt.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>`:''}</details></details></li>`).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function hint() {
  const a=state.active,r=a.rounds.at(-1);
  if(a.phase==='factor') {
    const divisors=Array.from({length:Math.min(r.n,r.d)-1},(_,i)=>i+2).filter(k=>r.n%k===0&&r.d%k===0);
    return `Suche Zahlen größer als 1, durch die ${r.n} und ${r.d} ohne Rest teilbar sind. Gemeinsame Teiler sind: ${divisors.join(', ')}. Jede dieser Zahlen ist erlaubt. Mit einer großen Zahl geht es oft schneller.`;
  }
  if(a.phase==='result')return `Je ${r.factor} kleine Teile werden zu einem größeren Teil. Rechne ${r.n} : ${r.factor} = ${r.n/r.factor} und ${r.d} : ${r.factor} = ${r.d/r.factor}.`;
  const n=r.n/r.factor,d=r.d/r.factor,divisor=D.gcd(n,d);
  return divisor>1?`${n} und ${d} sind beide durch ${divisor} teilbar. Du kannst weiter kürzen. Wähle „Ja“.`:`${n} und ${d} haben keinen gemeinsamen Teiler größer als 1. Der Bruch ist vollständig gekürzt. Wähle „Nein“.`;
}
function render() {
  const a=state.active,done=a.phase==='done';
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`${a.rounds.length}. Kürzung · ${a.phase==='factor'?'Kürzungszahl wählen':a.phase==='result'?'Zähler und Nenner teilen':'Ergebnis untersuchen'}`;
  q('[data-heading]').textContent={factor:'Wähle eine Kürzungszahl.',result:'Kürze Zähler und Nenner.',again:'Kannst du weiter kürzen?',done:'Vollständig gekürzt!'}[a.phase];
  q('[data-instruction]').textContent={factor:'Finde einen möglichst großen gemeinsamen Teiler. Jeder gemeinsame Teiler größer als 1 ist erlaubt.',result:`Teile Zähler und Nenner durch ${a.rounds.at(-1).factor}. Trage den neuen Bruch ein.`,again:'Haben Zähler und Nenner noch einen gemeinsamen Teiler größer als 1?',done:'Zähler und Nenner haben keinen gemeinsamen Teiler größer als 1 mehr.'}[a.phase];
  q('[data-check]').hidden=done||a.phase==='again';q('[data-check]').textContent=a.phase==='factor'?'Kürzungszahl prüfen':'Bruch prüfen';q('[data-hint]').hidden=done;
  q('[data-decisions]').hidden=a.phase!=='again';q('[data-next]').hidden=!done;
  (a.phase==='again'?q('[data-decisions]'):q('.reduce-actions')).append(q('[data-hint]'));
  q('.reduce-actions').hidden=done||a.phase==='again';
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);
  q('[data-rating]').hidden=!tainted(a);
  q('[data-hint-text]').hidden=done||!a.help.includes(`${a.rounds.length-1}:${a.phase}`);q('[data-hint-text]').textContent=done?'':hint();
  q('[data-introduction]').textContent=introduction;q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;
  q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');
  renderEquations();renderHistory();
}
q('[data-equations]').addEventListener('input',e=>{
  if(!ready||!e.target.dataset.key)return;const r=state.active.rounds.at(-1),key=e.target.dataset.key;
  const mapping={factor:'draftFactor',n:'draftN',d:'draftD'};r[mapping[key]]=e.target.value;
  e.target.removeAttribute('aria-invalid');save();
});
function check(again) {
  if(!ready||state.active.phase==='done')return;
  const a=state.active,r=a.rounds.at(-1),answer=a.phase==='factor'?{factor:r.draftFactor}:a.phase==='result'?{n:r.draftN,d:r.draftD}:{again};
  const result=R.check(a,answer);
  if(result.completed) {
    const slot=state.history.length;if(slot<scores.length)scores[slot]=tainted(a)?'yellow':'green';
    state.history.push(JSON.parse(JSON.stringify(a)));
  }
  save(true);render();
  if(result.correct)q(a.phase==='done'?'[data-next]':a.phase==='factor'?'[data-key="factor"]':a.phase==='result'?'[data-key="n"]':'[data-heading]').focus();
}
q('[data-check]').addEventListener('click',()=>check());
q('[data-equations]').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();check();}});
q('[data-decisions]').addEventListener('click',e=>{const button=e.target.closest('[data-again]');if(button&&state.active.phase==='again')check(button.dataset.again);});
q('[data-hint]').addEventListener('click',()=>{
  if(!ready||state.active.phase==='done')return;const a=state.active,key=`${a.rounds.length-1}:${a.phase}`;
  if(!a.help.includes(key))a.help.push(key);save(true);q('[data-hint-text]').textContent=hint();q('[data-hint-text]').hidden=false;q('[data-rating]').hidden=false;
});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-introduction]').textContent=introduction;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
function next(level) {if(!ready||state.active.phase!=='done')return;state.level=level;state.active=freshActive(selectTask(level,state.history));save(true);render();q('[data-key="factor"]').focus();}
q('[data-next]').addEventListener('click',()=>next(state.level));
q('[data-level]').addEventListener('change',()=>next(Number(q('[data-level]').value)));
async function start() {
  ready=false;q('[data-controls]').disabled=true;
  try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}
}
q('[data-retry]').addEventListener('click',start);
start();
