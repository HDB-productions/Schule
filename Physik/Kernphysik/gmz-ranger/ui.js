const D=GMZDomain,L=GMZ_LESSON;
let state,loaded=false,busy=false,budgetBusy=false,currentUid=null,transport='fetch',viewer=null,step=0,selected=null,phase=0,phaseStart=0,phaseFrame=0,viewFrame=0;
const bridge=createEduloBridge({root,widgetId:L.id,stateVersion:1,scoreCount:20,hideFooter:true,fresh:D.fresh,validate:D.valid,
 onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}});
const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
const message=text=>{q('[data-message]').textContent=text;};
const pending=()=>state?.history.find(h=>h.status==='pending'||h.status==='unknown');
const normalizedAnswer=value=>value.trim().replace(/\s+/g,' ');
const alreadyChecked=()=>state?.history.some(h=>h.status==='done'&&normalizedAnswer(h.answer)===normalizedAnswer(state.answer));
const canEdit=()=>loaded&&!(state.ownerUid&&state.ownerUid!==syncIdentity());
function uuid(){if(crypto.randomUUID)return crypto.randomUUID();const a=crypto.getRandomValues(new Uint8Array(16));a[6]=(a[6]&15)|64;a[8]=(a[8]&63)|128;const s=[...a].map(v=>v.toString(16).padStart(2,'0')).join('');return [s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');}
function queue(){if(loaded)bridge.queueSave(state,D.scores(state));}
async function save(){try{await bridge.save(state,D.scores(state));}catch(e){message('Dein Lernstand konnte nicht gespeichert werden. '+e.message);}}
function setExplosion(value){q('[data-explosion]').value=String(Math.round(value*100));q('[data-explosion-value]').textContent=Math.round(value*100)+' %';viewer?.setExplosion(value);}
function viewState(){return {...viewer.getView(),explosion:viewer.getExplosion(),microscopic:viewer.getMicroscopic()};}
function moveThrough(stops,done){
 cancelAnimationFrame(viewFrame);if(!viewer){done?.();return;}
 const frames=[{time:0,...viewState()},...stops],started=performance.now(),last=frames[frames.length-1],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,fieldFrom=viewer.getFieldVisibility();
 const tick=now=>{if(!root.isConnected)return;const t=reduced?last.time:Math.min(last.time,(now-started)/1000),pose=GMZStaging.sample(frames,t);setExplosion(pose.explosion);viewer.setMicroscopic(pose.microscopic);viewer.setView(pose);showField(fieldFrom*(1-GMZStaging.ease(t/last.time)));if(t<last.time)viewFrame=requestAnimationFrame(tick);else{viewFrame=0;done?.();}};
 viewFrame=requestAnimationFrame(tick);
}
function partView(id,explosion){
 const before=viewState();viewer.setExplosion(explosion,{preserveView:true});
 const box=new THREE.Box3().setFromObject(viewer.parts[id]),target=box.getCenter(new THREE.Vector3()).toArray(),size=box.getSize(new THREE.Vector3());
 viewer.setExplosion(before.explosion,{preserveView:true});viewer.setView(before);
 return {yaw:['window','anode','gas','cathode'].includes(id)?2.85:.40,pitch:.18,distance:Math.max(100,Math.max(size.x,size.y,size.z)*2.8),target,explosion,microscopic:0};
}
function focus(id){
 selected=id;if(!viewer)return;stopPhase();const microscopic=viewer.getMicroscopic(),e=viewer.revealPart(id),destination=partView(id,e);
 const stops=microscopic>.01?[{time:1.8,yaw:2.85,pitch:.18,distance:160,target:[0,30,-6.9],explosion:0,microscopic:0},{time:4.2,...destination}]:[{time:2.8,...destination}];
 moveThrough(stops,()=>{viewer.setAtomicClock(null);viewer.setPhase(null,0);viewer.highlightPart(id);q('[data-model-status]').textContent='Der ausgewählte Bestandteil ist hervorgehoben. Die übrigen Teile zeigen seine Lage im Gerät.';});
 q('[data-model-status]').textContent='Das Modell öffnet sich schichtweise und zeigt den Bestandteil.';
}
function controls(){
 if(!state)return;
 const editable=loaded&&!(state.ownerUid&&state.ownerUid!==currentUid);
 q('[data-label-controls]').disabled=!editable;q('[data-text-controls]').disabled=!editable;
 const cached=D.cached?.(state);
 q('[data-check]').disabled=!editable||busy||!!pending()||!state.answer.trim()||(alreadyChecked()&&!cached)||!currentUid;
 q('[data-check]').textContent=busy?'Deine Erklärung wird geprüft …':cached?'Vorhandene Rückmeldung übernehmen':alreadyChecked()?'Diese Fassung wurde bereits geprüft':'Erklärung prüfen';
 q('[data-recover]').hidden=!pending();q('[data-recover]').disabled=!editable||busy||!currentUid;
 q('[data-count]').textContent=state.answer.length+' / 6000 Zeichen';
}
function renderProgress(){
 const colors=D.scores(state),solved=colors.filter(c=>c!=='gray').length;
 q('[data-progress]').textContent=solved+' / 19 Punkte';
 q('[data-label-progress]').textContent=colors.slice(0,7).filter(c=>c!=='gray').length+' / 7 beschriftet';
 q('[data-text-progress]').textContent=colors.slice(7,19).filter(c=>c!=='gray').length+' / 12 Aspekte';
 q('[data-points]').replaceChildren(...colors.slice(7,19).map((color,i)=>{const p=el('span',undefined,'point');p.dataset.color=color;p.setAttribute('role','img');p.setAttribute('aria-label','Aspekt '+(i+1)+': '+({gray:'noch offen',green:'auf Anhieb erreicht',yellow:'nach Hilfe erreicht'})[color]);return p;}));
}
function renderLabel(){
 const complete=L.components.every(c=>state.labels[c.id].earned!=='gray');
 q('[data-label-controls]').hidden=complete;q('[data-parts-panel]').hidden=!complete;
 if(complete){
  q('[data-model-heading]')?.setAttribute('data-complete','true');
  q('[data-parts]').replaceChildren(...L.components.map(c=>{const b=el('button',undefined,'secondary');b.type='button';b.dataset.part=c.id;b.setAttribute('aria-pressed',String(selected===c.id));const dot=el('i',undefined,'point');dot.dataset.color=state.labels[c.id].earned;b.append(dot,el('span',c.label));b.addEventListener('click',()=>{focus(c.id);q('[data-part-description]').textContent=c.explanation;renderLabel();});return b;}));return;
 }
 if(step>=L.components.length)step=Math.max(0,L.components.findIndex(c=>state.labels[c.id].earned==='gray'));
 const c=L.components[step],record=state.labels[c.id],correct=record.earned!=='gray';
 q('[data-step]').textContent='Bestandteil '+(step+1)+' von 7';q('[data-label-prompt]').textContent=c.prompt;
 q('[data-label-input]').value=record.draft;q('[data-label-input]').disabled=correct;
 q('[data-label-check]').hidden=correct;q('[data-hint]').hidden=correct;q('[data-next]').hidden=!correct;
 q('[data-hint-text]').hidden=true;q('[data-hint-text]').textContent='';
 q('[data-label-feedback]').textContent=correct?'Richtig: '+c.label+'. '+c.explanation:'';
 q('[data-label-feedback]').classList.toggle('success',correct);
}
function feedbackText(f){
 const grouped=f.taskFeedback?.find(g=>g.id==='explanation')?.feedback||f.taskFeedback?.[0]?.feedback;
 if(grouped)return grouped;
 return [f.summary,...(f.misconceptions||[]).map(m=>'Zu „'+m.statement+'“: '+m.correction),...(f.nextSteps||[]),f.languageFeedback].filter(Boolean).join('\n\n');
}
function renderFeedback(){
 const current=[...state.history].reverse().find(h=>h.status==='done'&&normalizedAnswer(h.answer)===normalizedAnswer(state.answer));
 const last=current||[...state.history].reverse().find(h=>h.status==='done');
 q('[data-feedback]').hidden=!last;q('[data-feedback]').textContent=last?feedbackText(last.feedback):'';
 q('[data-stale]').hidden=!last||!!current;
 const history=q('[data-history]');history.replaceChildren();
 if(!state.history.length){history.append(el('p','Hier erscheinen deine eingereichten Texte und die dazugehörigen Rückmeldungen.'));return;}
 for(const h of [...state.history].reverse().slice(0,20)){
  const row=el('details',undefined,'history-item');row.append(el('summary',new Date(h.at).toLocaleString('de-DE')+' · '+({pending:'Prüfung läuft',unknown:'Ergebnis noch offen',done:'Rückmeldung erhalten',failed:'Prüfung fehlgeschlagen'})[h.status]),el('p',h.answer,'saved-answer'));
  row.append(el('p',h.feedback?feedbackText(h.feedback):h.message,'preserve'));history.append(row);
 }
}
function render(){renderProgress();renderFeedback();controls();}
async function refreshBudget(){
 if(budgetBusy||busy)return;const uid=syncIdentity();if(!uid){q('[data-budget]').textContent='Öffne diese Aufgabe in deinem eigenen Edulo-Konto, um KI-Rückmeldungen zu nutzen.';return;}
 budgetBusy=true;q('[data-refresh-budget]').disabled=true;
 try{const r=await api('/quota',{uid});if(syncIdentity()!==uid)return;if(!r.ok)throw Error(errorMessage(r.data,r.status));renderBudget(r.data.budget);}
 catch(e){q('[data-budget]').textContent=connectionMessage(e);}finally{budgetBusy=false;q('[data-refresh-budget]').disabled=false;}
}
async function handleResult(h,r){
 renderBudget(r.data.budget,r.data.charge);
 if(r.status===202){h.status='unknown';h.message='Die Prüfung läuft noch. Rufe das Ergebnis später ab; es wird keine zweite Prüfung gestartet.';message(h.message);return;}
 if(r.ok){
  if(r.data.taskId!==L.id||r.data.taskVersion!==L.version||r.data.requestId!==h.requestId||!D.validFeedback(r.data.feedback))throw Error('Die Rückmeldung passt nicht zur eingereichten Aufgabe.');
  const applied=D.finish(state,h,r.data.feedback);message(applied?'Deine Rückmeldung ist da. Überarbeite offene Aspekte und prüfe deinen Text anschließend erneut.':'Die Rückmeldung wurde in der Historie gespeichert. Du hast den Text inzwischen verändert; dafür wurden keine Punkte vergeben.');
 }else{
  h.status=r.data.charge?.status==='reserved'?'unknown':'failed';h.message=errorMessage(r.data,r.status);message(h.message);
 }
}
async function check(){
 if(!canEdit()||busy||pending())return;
 const cached=D.cached?.(state);if(cached){D.applyCached(state,cached.requestId);await save();render();message('Die bereits vorhandene Rückmeldung wurde übernommen. Es wurde keine neue KI-Prüfung berechnet.');return;}
 if(alreadyChecked())return;const uid=syncIdentity();if(!uid){message('Öffne die Aufgabe in deiner eigenen Edulo-Ansicht, um deine Erklärung prüfen zu lassen.');return;}
 busy=true;controls();let h;
 try{h=D.begin(state,uuid(),new Date().toISOString());state.ownerUid=uid;await bridge.save(state,D.scores(state));}
 catch(e){if(h){h.status='failed';h.message='Die Anfrage wurde wegen eines Speicherfehlers nicht gesendet.';}busy=false;render();message('Keine KI-Anfrage gesendet: '+e.message);return;}
 message('Deine Erklärung wird geprüft …');
 try{const r=await api('/feedback',{uid,requestId:h.requestId,task:D.task(),answer:h.answer});if(!root.isConnected)return;
  if(syncIdentity()!==uid){h.status='unknown';h.message='Das Konto wurde während der Prüfung gewechselt.';message(h.message);return;}await handleResult(h,r);
 }catch(e){h.status='unknown';h.message='Der Ausgang der Prüfung ist noch unbekannt.';message(h.message+' Nutze „Ausstehende Prüfung abrufen“. '+connectionMessage(e));}
 finally{busy=false;render();if(root.isConnected&&syncIdentity()===uid)await save();}
}
async function recover(){
 const h=pending(),uid=syncIdentity();if(!h||!uid||busy||!canEdit())return;busy=true;controls();
 try{const r=await api('/result',{uid,requestId:h.requestId});if(syncIdentity()!==uid)return;if(!r.ok&&!r.data.charge&&r.status!==404)throw Error('Der Abrechnungsstand ist noch unklar.');await handleResult(h,r);}
 catch(e){message('Das Ergebnis konnte noch nicht abgerufen werden. Es wurde keine neue KI-Prüfung gestartet. '+connectionMessage(e));}
 finally{busy=false;render();if(root.isConnected&&syncIdentity()===uid)await save();}
}
const phases=[
 {id:'incoming',title:'1 · Eintritt',text:'Strahlung kann durch das sehr dünne Glimmerfenster in das Gas gelangen. Nicht jedes einfallende Teilchen oder Photon erzeugt einen Impuls: Es muss den empfindlichen Bereich erreichen und dort eine geeignete Wechselwirkung auslösen.'},
 {id:'ionization',title:'2 · Ionisation',text:'Bei einer Wechselwirkung werden Elektronen aus Gasatomen oder Gasmolekülen gelöst. Zurück bleiben positive Ionen; die herausgelösten Elektronen sind negativ geladen.'},
 {id:'drift',title:'3 · Bewegung',text:'Zwischen Anode und Kathode liegt eine hohe Spannung. Im elektrischen Feld bewegen sich die negativen Elektronen zur positiven Anode. Die positiven Ionen bewegen sich zur negativen Kathode.'},
 {id:'avalanche',title:'4 · Lawine',text:'Nahe dem dünnen Anodenleiter ist das elektrische Feld besonders stark. Beschleunigte Elektronen ionisieren weitere Gasteilchen. Immer mehr freie Elektronen entstehen: eine Elektronenlawine.'},
 {id:'pulse',title:'5 · Zählimpuls',text:'Die kurze Gasentladung erzeugt einen elektrischen Impuls. Die Elektronik zählt ihn als ein Nachweisereignis und kann einen Klick ausgeben. Sie zählt nicht jedes Elektron der Lawine einzeln. Der einzelne Impuls verrät weder die Strahlungsart noch ihre Energie.'},
 {id:'deadtime',title:'6 · Totzeit',text:'Die positiven Ionen bleiben zunächst nahe der Anode und schwächen dort das elektrische Feld. Weitere Elektronen können kurzzeitig keine neue Elektronenlawine auslösen: Es entsteht kein weiterer Zählimpuls. Diese kurze Zeit heißt Totzeit. Während die Ionen zur Kathode wandern, wird das Feld nahe der Anode wieder stärker und das Zählrohr wieder messbereit.'}
];
function stopPhase(){cancelAnimationFrame(phaseFrame);phaseFrame=0;cancelAnimationFrame(viewFrame);viewFrame=0;}
function showField(visibility){
 viewer?.setFieldVisibility(visibility);const node=q('[data-field-status]');if(!node)return;node.style.opacity=String(visibility);
 const atomic=viewer?.getAtomicState();if(!atomic)return;
 node.querySelector('i').style.width=(atomic.fieldStrength*100)+'%';
 node.querySelector('span').textContent=atomic.measurementReady?(atomic.time>=atomic.config.readyAt?'Wieder messbereit':'Messbereit'):'Totzeit: kein neuer Zählimpuls';
}
function playPhase(index){
 phase=index;stopPhase();const item=phases[index];q('[data-phase-text]').textContent=item.text;
 for(const b of q('[data-phases]').children)b.setAttribute('aria-pressed',String(Number(b.dataset.phase)===index));
 if(!viewer)return;
 const closeup={yaw:index===5?2.2:2.85,pitch:.18,distance:index<2?25:index===4?110:65,target:index<2?[3,30,-6.9]:[7,30,-6.9],explosion:0,microscopic:1};
 const stops=viewer.getMicroscopic()>.5?[{time:1.6,...closeup}]:[
  {time:1.6,...viewState(),distance:240,target:[0,15,0]},
  {time:3.6,yaw:2.85,pitch:.18,distance:145,target:[0,30,-6.9],explosion:0,microscopic:0},
  {time:6.2,...closeup}
 ];
 q('[data-model-status]').textContent='Wir schließen das Gerät und vergrößern den Gasraum bis zur atomaren Ebene.';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ranges=[[0,2],[2,3],[3,9],[9,14],[14,16],[16,20]],range=ranges[index];
 const tick=now=>{if(!root.isConnected||!q('[data-process]').open){stopPhase();return;}const elapsed=(now-phaseStart)/1000,p=reduced?.65:Math.min(1,elapsed/6.5),time=range[0]+(range[1]-range[0])*p;viewer.setPhase(item.id,p);viewer.setAtomicClock({time,collisionAt:2,electronAt:3,ionAt:4,avalancheAt:9,pulseAt:14,readyAt:20,gasTime:time+Math.max(0,elapsed-6.5)});showField(index===2||index===5?(reduced?1:GMZStaging.ease(elapsed/.8)):0);if(!reduced)phaseFrame=requestAnimationFrame(tick);};
 moveThrough(stops,()=>{viewer.highlightPart(null);phaseStart=performance.now();q('[data-model-status]').textContent='Atomare Ebene · Teilchen stark vergrößert, Vorgänge verlangsamt.';phaseFrame=requestAnimationFrame(tick);});
}
for(const [i,p]of phases.entries()){const b=el('button',p.title,'secondary');b.type='button';b.dataset.phase=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>playPhase(i));q('[data-phases]').append(b);}
q('[data-phase-replay]').addEventListener('click',()=>playPhase(phase));q('[data-process]').addEventListener('toggle',()=>{if(q('[data-process]').open)playPhase(phase);else stopPhase();});
q('[data-label-input]').addEventListener('input',()=>{if(!canEdit())return;state.labels[L.components[step].id].draft=q('[data-label-input]').value;queue();});
function submitLabel(){if(!canEdit())return;const c=L.components[step],correct=D.submitLabel(state,c.id,q('[data-label-input]').value);renderLabel();renderProgress();if(!correct)q('[data-label-feedback]').textContent='Das passt noch nicht. Schau dir den markierten Bestandteil genauer an oder nutze einen Hinweis.';save();}
q('[data-label-check]').addEventListener('click',submitLabel);q('[data-label-input]').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitLabel();}});
q('[data-hint]').addEventListener('click',()=>{if(!canEdit())return;q('[data-hint-text]').textContent=D.useHint(state,L.components[step].id);q('[data-hint-text]').hidden=false;save();});
q('[data-next]').addEventListener('click',()=>{if(!canEdit())return;step=L.components.findIndex(c=>state.labels[c.id].earned==='gray');renderLabel();if(step>=0){focus(L.components[step].id);q('[data-label-input]').focus({preventScroll:true});}});
q('[data-answer]').addEventListener('input',()=>{if(!canEdit())return;state.answer=q('[data-answer]').value;queue();render();});
q('[data-explosion]').addEventListener('input',()=>{
 const value=Number(q('[data-explosion]').value)/100;stopPhase();if(!viewer)return;
 if(viewer.getMicroscopic()>.01)moveThrough([{time:1.8,yaw:2.85,pitch:.18,distance:280,target:[0,12,0],explosion:value,microscopic:0}],()=>{viewer.setAtomicClock(null);viewer.setPhase(null,0);});
 else {viewer.setAtomicClock(null);viewer.setPhase(null,0);setExplosion(value);}
 q('[data-model-status]').textContent='Aufbau · Schichten öffnen und ihre Lage im Gerät untersuchen.';
});
q('[data-home]').addEventListener('click',()=>{stopPhase();selected=null;if(!viewer)return;moveThrough([{time:3,yaw:.43,pitch:.20,distance:280,target:[0,0,0],explosion:0,microscopic:0}],()=>{viewer.highlightPart(null);viewer.setAtomicClock(null);viewer.setPhase(null,0);});q('[data-model-status]').textContent='Gesamtansicht · Drehen und Zoomen möglich.';});
q('[data-focus]').addEventListener('click',()=>focus(selected||L.components[Math.max(0,step)].id));
q('[data-zoom-in]').addEventListener('click',()=>viewer?.zoomBy?.(.8));q('[data-zoom-out]').addEventListener('click',()=>viewer?.zoomBy?.(1.25));
q('[data-check]').addEventListener('click',check);q('[data-recover]').addEventListener('click',recover);q('[data-refresh-budget]').addEventListener('click',refreshBudget);q('[data-diagnose]').addEventListener('click',diagnoseConnection);
q('[data-task]').textContent=L.prompt;
async function start(){
 loaded=false;controls();
 try{const saved=await bridge.load();if(JSON.stringify(saved.scores)!==JSON.stringify(D.scores(saved.data)))throw Error('Gespeicherte Punkte und Lernstand passen nicht zusammen. Bitte informiere deine Lehrkraft.');
  state=saved.data;loaded=bridge.getStatus().mode!=='editor';step=L.components.findIndex(c=>state.labels[c.id].earned==='gray');if(step<0)step=0;
  q('[data-answer]').value=state.answer;syncIdentity();renderLabel();render();if(viewer&&state.labels[L.components[step].id].earned==='gray')focus(L.components[step].id);
  if(pending())message('Eine frühere Prüfung ist noch offen. Rufe ihr Ergebnis ab, bevor du neu prüfst.');if(currentUid)refreshBudget();
 }catch(e){message(e.message);}
}
q('[data-retry]').addEventListener('click',start);
try{viewer=window.createRangerViewer(q('[data-view]'),{THREE});const field=el('div',undefined,'field-status');field.dataset.fieldStatus='';field.innerHTML='<b>Feld nahe der Anode</b><small>Schematische Stärke</small><div class="field-track"><i></i></div><span></span>';q('[data-view]').append(field);q('[data-model-status]').textContent='Drehen und Zoomen möglich.';root.gmzViewer=viewer;}
catch(e){q('[data-model-status]').textContent='Das 3D-Modell konnte nicht gestartet werden. Öffne die Seite in aktuellem Safari oder starte die App neu.';q('[data-view]').append(el('p','Die interaktive Darstellung benötigt WebGL. Video und Erklärung bleiben verfügbar.','model-error'));}
const identityTimer=setInterval(()=>{if(!root.isConnected){clearInterval(identityTimer);stopPhase();viewer?.dispose();return;}if(loaded){syncIdentity();controls();}},1000);
start();
