const D=FractionDomain,R=OperateDomain;
const clone=value=>JSON.parse(JSON.stringify(value));
const freshActive=task=>R.fresh(task);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numberHTML=value=>`<span class="${String(value).length>12?'long-value':''}" title="${esc(value)}">${esc(value)}</span>`;
const fraction=(n,d)=>`<span class="frac" aria-label="${esc(n)} durch ${esc(d)}">${numberHTML(n)}${numberHTML(d)}</span>`;
const introduction='Brüche müssen gleich große Teile beschreiben, bevor du sie addierst oder subtrahierst. Wähle einen gemeinsamen Nenner und rechne beide Brüche darauf um. Dazu darfst du kürzen und erweitern. Beispiel: 1/3 und 2/6 lassen sich beide als 1/3 schreiben. Auch Nenner 6, 9 oder 12 sind möglich. Verrechne anschließend nur die Zähler und kürze das Ergebnis vollständig.';
const selectTask=(level,history)=>{
  const pool=D.tasks('operate',level),used=new Set(history.map(h=>h.task.id)),unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  return choices[Math.floor(Math.random()*choices.length)];
};
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:2,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),validate:R.validState,migrateSnapshot:R.migrateSnapshot,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
const tainted=a=>a.help.length>0||a.attempts.some(v=>!v.correct);
function save(immediate=false){try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{}}
function diagram(n,d,{side='left',converted=false,color='#19a491',result=false}={}){
  const denominator=BigInt(d),wholes=BigInt(n)>denominator?2:1;
  const task=state.active.task;
  const planColumns=FractionVisuals.columns(D.gcd(task.d,task.bd));
  const image=FractionVisuals.image({n,d,color,planColumns});
  return `<figure class="operate-figure ${side}" ${converted?`data-result-model="${side}"`:''} ${result?'data-answer-model':''}>${image}<figcaption>${wholes>1?'Je Rechteck: ein Ganzes':'Ein Ganzes'}${denominator<=128n?'':' · Teilung vereinfacht'}</figcaption></figure>`;
}
function field(key,label,value,expected){
  const a=state.active,preview=a.attempts.filter(v=>v.step===a.index).at(-1);
  let valid=typeof value==='string'&&/^\d+$/.test(value.trim())&&BigInt(value.trim())===BigInt(expected);
  if(key==='common'){try{R.values(a.task,value);valid=true;}catch{valid=false;}}
  return `<input data-key="${key}" aria-label="${label}" inputmode="numeric" autocomplete="off" maxlength="${key==='common'?120:240}" value="${esc(value||'')}" aria-invalid="${!!preview&&!valid}">`;
}
function numeralInput(key,label,denominator,expected){
  const value=state.active.drafts[1]?.[key]||'';
  return `<div class="numerator-entry">${field(key,label,value,expected)}<span class="operate-input-rule" aria-hidden="true"></span><span class="denominator ${String(denominator).length>12?'long-value':''}" title="${esc(denominator)}">${esc(denominator)}</span></div>`;
}
function resultInput(index,values){
  const draft=state.active.drafts[index]||{},n=index===2?values.n:values.finalN,d=index===2?values.d:values.finalD;
  return `<div class="numerator-entry">${field('n',index===2?'Zähler des Ergebnisses':'Vollständig gekürzter Zähler',draft.n||'',n)}<span class="operate-input-rule" aria-hidden="true"></span>${field('d',index===2?'Gemeinsamer Nenner':'Vollständig gekürzter Nenner',draft.d||'',d)}</div>`;
}
function renderEquations(){
  const a=state.active,t=a.task,sign=t.op==='-'?'−':'+',v=a.common?R.values(t,a.common):null;
  const preview=a.index>=2||a.attempts.some(attempt=>attempt.step===1);
  const sourcePictures=diagram(t.n,t.d)+diagram(t.bn,t.bd,{side:'right',color:'#4287bc'});
  let chain=`<div class="operate-chain ${v?'':'initial'} ${v&&preview?'has-preview':''}"><div class="operate-pair original"><div class="operate-number">${fraction(t.n,t.d)}</div><span class="math-sign">${sign}</span><div class="operate-number">${fraction(t.bn,t.bd)}</div><div class="source-pictures-inline">${sourcePictures}</div><details class="source-pictures-mobile"><summary>Ausgangsbilder anzeigen</summary><div class="operate-pair">${sourcePictures}</div></details></div>`;
  if(v)chain+=`<span class="chain-equals">=</span><div class="operate-pair converted"><div class="operate-number">${a.index===1?numeralInput('left','Neuer Zähler links',a.common,v.left):fraction(v.left,a.common)}</div><span class="math-sign">${sign}</span><div class="operate-number">${a.index===1?numeralInput('right','Neuer Zähler rechts',a.common,v.right):fraction(v.right,a.common)}</div>${preview?diagram(v.left,a.common,{converted:true})+diagram(v.right,a.common,{side:'right',converted:true,color:'#4287bc'}):''}</div>`;
  chain+='</div>';
  const previous=[];let current=chain;
  if(a.index>=2){previous.push(chain);current='';}
  if(v&&a.index>=2){
    const resultPreview=a.index>=3||a.attempts.some(attempt=>attempt.step===2);
    const calculation=`<div class="result-line"><div class="result-source"><div class="operate-number">${fraction(`${v.left} ${sign} ${v.right}`,a.common)}</div><p>Der Nenner bleibt gleich.</p></div><span class="math-sign">=</span><div class="result-target"><div class="operate-number">${a.index===2?resultInput(2,v):fraction(v.n,a.common)}</div>${resultPreview?diagram(v.n,a.common,{result:true}):''}</div></div>`;
    if(a.index===2)current=calculation;else previous.push(calculation);
  }
  if(v&&a.index>=3){
    const finalPreview=a.index===4||a.attempts.some(attempt=>attempt.step===3);
    current=`<div class="result-line"><div class="result-source"><div class="operate-number">${fraction(v.n,a.common)}</div><p>Vollständig kürzen</p></div><span class="math-sign">=</span><div class="result-target"><div class="operate-number">${a.index===3?resultInput(3,v):fraction(v.finalN,v.finalD)}</div>${finalPreview?diagram(v.finalN,v.finalD,{result:true}):''}</div></div>`;
  }
  q('[data-equations]').innerHTML=`<div class="operate-scene">${previous.length?`<details class="prior-steps"><summary>Vorherige Rechenschritte</summary>${previous.join('')}</details>`:''}${current}</div>`;
}
function renderHistory(){
  const history=state.history,clean=history.filter(h=>!tainted(h)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  const labels={common:'Gemeinsamer Nenner',left:'Zähler links',right:'Zähler rechts',n:'Zähler',d:'Nenner'};
  q('[data-history]').innerHTML=history.length?history.map(h=>{
    const v=R.values(h.task,h.common);
    return `<li><details><summary>${h.task.n}/${h.task.d} ${h.task.op==='-'?'−':'+'} ${h.task.bn}/${h.task.bd} · Nenner ${esc(h.common)} · ${tainted(h)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><p>${esc(v.left)}/${esc(h.common)} ${h.task.op==='-'?'−':'+'} ${esc(v.right)}/${esc(h.common)} = ${esc(v.n)}/${esc(h.common)} = ${esc(v.finalN)}/${esc(v.finalD)}</p><ol>${h.attempts.map(attempt=>`<li>Schritt ${attempt.step+1}: ${Object.entries(attempt.answer).map(([key,value])=>esc(`${labels[key]||key}: ${value||'leer'}`)).join(', ')} – ${attempt.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>${h.help.length?'<p>Tipp genutzt.</p>':''}</details></li>`;
  }).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function render(){
  const a=state.active,done=a.index===4,steps=R.steps(a);
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`Schritt ${a.index+1} von 4`;
  q('[data-heading]').textContent=done?'Geschafft!':steps[a.index].title;
  q('[data-instruction]').textContent=done?'Das Ergebnis ist vollständig gekürzt.':a.index===1?`Schreibe beide Brüche mit Nenner ${a.common}. Ergänze die Zähler.`:steps[a.index].text;
  q('[data-fields]').hidden=a.index!==0;q('[data-fields]').innerHTML=a.index===0?`<label class="entry">Gemeinsamer Nenner ${field('common','Gemeinsamer Nenner',a.drafts[0]?.common||'',R.minimum(a.task))}</label>`:'';
  q('[data-check]').hidden=done;q('[data-hint]').hidden=done;q('[data-next]').hidden=!done;
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);q('[data-rating]').hidden=!tainted(a);
  q('[data-hint-text]').hidden=done||!a.help.includes(a.index);q('[data-hint-text]').textContent=done?'':steps[a.index].hint;
  q('[data-introduction]').textContent=introduction;q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');
  renderEquations();renderHistory();
  const dialog=q('[data-denominator-dialog]');if(a.pending&&!dialog.open)dialog.showModal();else if(!a.pending&&dialog.open)dialog.close();
}
root.addEventListener('input',e=>{
  const key=e.target.dataset.key;if(!ready||!key||state.active.index===4||state.active.pending)return;
  (state.active.drafts[state.active.index]||={})[key]=e.target.value;e.target.removeAttribute('aria-invalid');save();
});
function check(){
  if(!ready||state.active.index===4||state.active.pending)return;
  const a=state.active,fields=R.steps(a)[a.index].fields,draft=a.drafts[a.index]||{},answer=Object.fromEntries(fields.map(f=>[f.key,draft[f.key]||'']));
  const result=R.check(a,answer);
  if(result.completed){const slot=state.history.length;if(slot<scores.length)scores[slot]=tainted(a)?'yellow':'green';state.history.push(clone(a));}
  save(true);render();if(result.correct&&!a.pending)q(a.index===4?'[data-next]':a.index===1?'[data-key="left"]':'[data-key="n"]').focus();
}
q('[data-check]').addEventListener('click',check);
root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input[data-key]')){e.preventDefault();check();}});
function chooseDenominator(keep){if(!ready||!state.active.pending)return;R.resolve(state.active,keep);save(true);render();const input=q(keep?'[data-key="left"]':'[data-key="common"]');input.focus();if(!keep)input.select();}
q('[data-continue]').addEventListener('click',()=>chooseDenominator(true));q('[data-smaller]').addEventListener('click',()=>chooseDenominator(false));q('[data-denominator-dialog]').addEventListener('cancel',e=>{e.preventDefault();chooseDenominator(false);});
q('[data-hint]').addEventListener('click',()=>{if(!ready||state.active.index===4)return;const a=state.active;if(!a.help.includes(a.index))a.help.push(a.index);save(true);q('[data-hint-text]').textContent=R.steps(a)[a.index].hint;q('[data-hint-text]').hidden=false;q('[data-rating]').hidden=false;});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
function next(level){if(!ready||state.active.index!==4)return;state.level=level;state.active=freshActive(selectTask(level,state.history));save(true);render();q('[data-key="common"]').focus();}
q('[data-next]').addEventListener('click',()=>next(state.level));q('[data-level]').addEventListener('change',()=>next(Number(q('[data-level]').value)));
async function start(){ready=false;q('[data-controls]').disabled=true;const dialog=q('[data-denominator-dialog]');if(dialog.open)dialog.close();try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}}
q('[data-retry]').addEventListener('click',start);
start();
