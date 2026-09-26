const bridge = createEduloBridge({root,widgetId:'bewegungstrainer',stateVersion:1,hideFooter:true,
  fresh:Motion.fresh, validate:Motion.validate,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state, active=-1, prepCell=0;
const names=['Geschwindigkeit','Anfangsposition','Bewegungsformel','Weitere Position'];
const format=n=>String(n).replace('.',',');
function save(immediate=false){try{bridge[immediate?'save':'queueSave'](state,Motion.scoreColors(state));}catch{}}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function findActive(){active=!state.prep.done?-1:state.steps.findIndex((s,i)=>Motion.requiredSteps(state.task).includes(i)&&!s.done);if(state.prep.done&&active===-1)active=4;}
function stepNumber(i){return Motion.requiredSteps(state.task).indexOf(i)+1;}
function prefix(i){return ['v =','s₀ =','s(t) =',`s(${format(state.task.targetT*60)} min) =`][i];}
function prepAnswer(cell){return cell.unit==='clock'?cell.expected:`${format(cell.expected)} ${cell.unit}`;}
function statusText(s){return s.revealed?'Lösung vorgegeben · kein Punkt':s.earned==='green'?'Selbstständig gelöst':s.earned==='yellow'?'Mit Unterstützung gelöst':'Richtig gelöst';}
function readable(input){return input.replace(/\*/g,'·').replace(/(\d)(?=km|m\b|h\b|min\b)/g,'$1 ').replace(/([+·−])/g,' $1 ').replace(/\s+/g,' ').trim();}
function calculatedAnswer(input,result){
  const written=readable(input);
  return input.replace(/\s/g,'')===result.replace(/\s/g,'')?written:`${written} = ${result}`;
}
function renderResults(){
  const target=q('[data-results]');target.replaceChildren();
  state.steps.forEach((s,i)=>{if(!s.done)return;const row=el('section',undefined,'result-row'+(s.revealed?' revealed':s.earned==='yellow'?' assisted':''));
    row.append(el('span',`${stepNumber(i)>0?stepNumber(i)+'. ':''}${names[i]}`,'result-name'),el('strong',`${prefix(i)} ${i===2?readable(s.input):calculatedAnswer(s.input,Motion.canonicalAnswer(state.task,i))}`,'result-value'),el('span',statusText(s),'result-status'));
    target.append(row);
  });
}
function prepTable(interactive){
  const definition=Motion.preparation(state.task),wrap=el('div',undefined,'prep-table-wrap'),table=el('table',undefined,'prep-table');
  function cell(i){const item=definition.cells[i],s=state.prep;
    if(!interactive)return el('td',item.unit==='clock'?s.inputs[i]:calculatedAnswer(s.inputs[i],prepAnswer(item)));
    const td=el('td'),b=el('button',s.inputs[i]||'Eintragen','prep-cell'+(i===prepCell?' selected':''));
    b.type='button';b.dataset.cell=String(i);b.setAttribute('aria-label',item.label);b.setAttribute('aria-pressed',String(i===prepCell));
    b.onclick=()=>{prepCell=i;state.prep.activeCell=i;render();save();};td.append(b);return td;
  }
  if(definition.layout==='pairs'){
    const head=el('thead'),header=el('tr');['Größe','1. Messung','2. Messung'].forEach(t=>header.append(el('th',t)));head.append(header);table.append(head);
    const body=el('tbody');for(let r=0;r<2;r++){const row=el('tr'),th=el('th',r===0?'Zeit t':'Position s');th.scope='row';row.append(th,cell(r*2),cell(r*2+1));body.append(row);}table.append(body);
  }else{
    const body=el('tbody');definition.cells.forEach((item,i)=>{const row=el('tr'),th=el('th',item.label);th.scope='row';row.append(th,cell(i));body.append(row);});table.append(body);
  }
  wrap.append(table);return wrap;
}
function renderPreparation(){
  const area=q('[data-preparation]');area.replaceChildren();
  if(!state.prep.done)return;
  const box=el('section',undefined,'prep-completed'+(state.prep.revealed?' revealed':''));
  box.append(el('h2','0. Gegebene Größen'),prepTable(false));
  if(state.prep.revealed)box.append(el('p','Angaben vorgegeben · Vorbereitung nicht selbst gelöst','result-status'));
  area.append(box);
}
function renderAnswer(){
  if(active===4)return;
  const prep=active===-1,s=prep?state.prep:state.steps[active],input=prep?s.inputs[prepCell]:s.input,cursor=prep?s.cursors[prepCell]:s.cursor;
  const definition=prep?Motion.preparation(state.task).cells[prepCell]:null;
  q('[data-prefix]').textContent=prep?definition.prefix:prefix(active);
  const box=q('[data-answer]');box.replaceChildren(document.createTextNode(input.slice(0,cursor)),el('span','│','cursor'),document.createTextNode(input.slice(cursor)));
  box.setAttribute('aria-label',(prep?definition.label:'Deine Eingabe')+': '+(input||'leer'));
  q('[data-input-label]').textContent=prep?`${definition.label} · ${definition.unit==='clock'?'Uhrzeit als Stunde:Minute':'mit Einheit '+definition.unit}`:'Deine Eingabe · mit Einheiten';
  if(prep){const b=q(`[data-cell="${prepCell}"]`);if(b)b.textContent=input||'Eintragen';}
}
function renderKeypad(){
  const prep=active===-1,unit=prep?Motion.preparation(state.task).cells[prepCell].unit:active===0?'km/h':'km';
  const keys=unit==='clock'?['7','8','9','4','5','6','1','2','3','0',':']:
    ['7','8','9',active===2?'t':'h','km/h','4','5','6','·','km','1','2','3','+','−','0',',','/','(',')',...(active===2?['h']:[]),...(prep&&unit==='min'?['min']:[])];
  const labels={'←':'Cursor nach links','→':'Cursor nach rechts','Del':'Zeichen links vom Cursor löschen'};
  q('[data-keypad]').classList.toggle('formula',unit!=='clock');
  q('[data-keypad]').replaceChildren(...[...keys,'←','→','Del'].map(key=>{const b=el('button',key,['←','→','Del'].includes(key)?'edit-key':'');b.type='button';b.setAttribute('aria-label',labels[key]||key);b.onclick=()=>type(key);return b;}));
}
function render(){
  const colors=Motion.scoreColors(state),prep=active===-1,finished=active===4;
  q('[data-progress]').textContent=`${colors.filter(c=>c!=='gray').length}/20 Punkte · ${colors.filter(c=>c==='green').length} selbstständig`;
  q('[data-points]').replaceChildren(...colors.map((c,i)=>{const n=el('span',c==='green'?'✓':c==='yellow'?'●':'',c);n.title=`Punkt ${i+1}: ${c==='green'?'selbstständig':c==='yellow'?'mit Hilfe':'noch offen'}`;return n;}));
  q('[data-number]').textContent=`SITUATION ${state.index+1}`;
  q('[data-title]').textContent=state.task.title;q('[data-context]').textContent=state.task.context;
  renderPreparation();renderResults();
  q('[data-step-title]').textContent=finished?'Situation abgeschlossen':prep?'0. Gegebene Größen ordnen':`${stepNumber(active)}. ${names[active]}`;
  q('[data-prompt]').textContent=finished?'Du kannst mit einer neuen Situation weiterüben. Auch nach 20 Punkten geht es weiter.':prep?Motion.preparation(state.task).instruction:state.task.prompts[active];
  q('[data-prep-fields]').replaceChildren(...(prep?[prepTable(true)]:[]));
  q('[data-entry]').hidden=finished;q('[data-help]').hidden=finished;q('[data-check]').hidden=finished;q('[data-next]').hidden=!finished;
  q('[data-next]').textContent='Nächste Situation →';q('[data-prep-note]').hidden=!prep;
  if(finished){q('[data-feedback]').textContent='';q('[data-hints]').replaceChildren();return;}
  const s=prep?state.prep:state.steps[active];renderAnswer();renderKeypad();
  q('[data-help]').disabled=s.hint>=3;q('[data-help]').textContent=s.hint>=3?'Alle Tipps geöffnet':`Tipp ${s.hint+1} anzeigen`;
  q('[data-feedback]').textContent=s.feedback;
  const hints=prep?Motion.preparationHints(state.task):Motion.hints(state.task,active);
  q('[data-hints]').replaceChildren(...hints.slice(0,s.hint).map((h,i)=>el('p',`${i+1}. ${h}`)));
  if(s.hint)q('[data-hints]').append(renderTeachingVisual(teachingVisual(state.task,active,s.hint)));
  if(s.hint===3)q('[data-hints]').append(el('p','Versuche es noch einmal. Ist die Antwort erneut falsch, tragen wir die Lösung ein. Dafür gibt es keinen Punkt.','reveal-notice'));
}
function type(key){
  if(active===4)return;const prep=active===-1,s=prep?state.prep:state.steps[active];let input=prep?s.inputs[prepCell]:s.input,cursor=prep?s.cursors[prepCell]:s.cursor;
  if(key==='←')cursor=Math.max(0,cursor-1);else if(key==='→')cursor=Math.min(input.length,cursor+1);
  else if(key==='Del'){if(cursor){input=input.slice(0,cursor-1)+input.slice(cursor);cursor--;}}
  else if(input.length+key.length<=160){input=input.slice(0,cursor)+key+input.slice(cursor);cursor+=key.length;}
  if(prep){s.inputs[prepCell]=input;s.cursors[prepCell]=cursor;}else{s.input=input;s.cursor=cursor;}
  renderAnswer();save();
}
q('[data-check]').onclick=()=>{
  if(active===4)return;const prep=active===-1,s=prep?state.prep:state.steps[active];
  const result=prep?Motion.checkPreparation(state.task,s.inputs):Motion.check(state.task,active,s.input);
  if(result.ok){if(prep){s.done=true;s.feedback='Angaben richtig zugeordnet.';}else Motion.completeStep(state,active);findActive();}
  else if(s.hint===3){
    s.errors=Math.min(999,s.errors+1);
    if(prep){s.inputs=Motion.preparation(state.task).cells.map(prepAnswer);s.cursors=s.inputs.map(t=>t.length);s.done=true;s.revealed=true;s.feedback='Angaben vorgegeben.';}
    else Motion.revealStep(state,active);
    findActive();
  }else{s.errors=Math.min(999,s.errors+1);s.hint++;s.feedback=result.message+' Ein passender Tipp steht unten.';}
  save(true);render();
  if(s.done){const target=s.revealed?(prep?q('[data-preparation]'):q('[data-results]').lastElementChild):q('[data-step-title]');target?.scrollIntoView({block:'nearest'});}
  else q('[data-feedback]').scrollIntoView({block:'nearest'});
};
q('[data-help]').onclick=()=>{if(active===4)return;const s=active===-1?state.prep:state.steps[active];s.hint=Math.min(3,s.hint+1);save(true);render();q('[data-hints]').lastElementChild?.scrollIntoView({block:'nearest'});};
q('[data-next]').onclick=()=>{if(!Motion.nextSituation(state))return;prepCell=0;findActive();save(true);render();q('.edulo-work').scrollTop=0;};
q('[data-rules-toggle]').onclick=()=>{const p=q('[data-rules]');p.hidden=!p.hidden;q('[data-rules-toggle]').setAttribute('aria-expanded',String(!p.hidden));};
async function start(){q('[data-controls]').disabled=true;try{const loaded=await bridge.load();state=Motion.upgrade(loaded.data);prepCell=state.prep.activeCell??0;findActive();render();q('[data-controls]').disabled=bridge.getStatus().mode==='editor';}catch(error){q('[data-storage]').textContent='Der Lernstand konnte nicht geladen werden. '+error.message;q('[data-retry]').hidden=false;}}
q('[data-retry]').onclick=start;
function fit(){let bottom=window.innerHeight,top=Math.max(0,root.getBoundingClientRect().top);for(let p=root.parentElement;p&&p!==document.documentElement;p=p.parentElement){if(/hidden|clip|auto|scroll/.test(getComputedStyle(p).overflowY))bottom=Math.min(bottom,p.getBoundingClientRect().bottom);}root.style.setProperty('--edulo-height',Math.max(180,bottom-top-12)+'px');}
fit();window.addEventListener('resize',fit);
const cleanup=new MutationObserver(()=>{if(!root.isConnected){window.removeEventListener('resize',fit);cleanup.disconnect();}});cleanup.observe(document.documentElement,{childList:true,subtree:true});
start();
