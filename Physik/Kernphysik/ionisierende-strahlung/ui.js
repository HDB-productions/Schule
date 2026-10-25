const D=LessonDomain,TASK=D.task(LESSON);
let state,scores,loaded=false,busy=false,budgetBusy=false,currentUid=null,historyShown=8,transport='fetch';
const bridge=createEduloBridge({root,widgetId:'ionisierende-strahlung-ki-v1',stateVersion:2,scoreCount:D.criteria(LESSON).length,migrateSnapshot:s=>D.migrate(LESSON,s),
 hideFooter:true,fresh:()=>D.fresh(LESSON),validate:s=>D.valid(LESSON,s),
 onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}});
const money=value=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:4}).format(value/1e6);
function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
const visibleFeedback=h=>['questions-v1','questions-v2','questions-v3'].includes(h.feedbackStyle);
function groupedFeedback(h,question){
 const block=element('div'),text=visibleFeedback(h)?h.feedback.taskFeedback?.find(item=>item.id===question.id)?.feedback:null;
 const paragraph=element('p',text||'Diese frühere Prüfung enthält noch keine zusammenhängende Rückmeldung zu dieser Aufgabe.','task-feedback');paragraph.dataset.taskFeedback=question.id;block.append(paragraph);
 const sources=new Set(question.criteria.filter(c=>h.feedback.criteria.find(r=>r.id===c.id)?.status!=='met').map(c=>c.source));
 for(const source of sources)block.append(videoLink(source));return block;
}
function misconceptionElements(items){return items.map(item=>{const entry=element('div',undefined,'misconception'),statement=element('p'),correction=element('p');statement.append(element('strong','Deine Aussage: '),document.createTextNode(item.statement));correction.append(element('strong','Klarstellung: '),document.createTextNode(item.correction));entry.append(statement,correction);return entry;});}
function message(text){q('[data-message]').textContent=text;}
function identity(){
 let win=window;const seen=new Set();
 for(let i=0;i<8&&!seen.has(win);i++){
  seen.add(win);
  try{
   const w=win.widget;
   if(w&&typeof w==='object'){
    const config=w.JSON||{},query=new URLSearchParams(win.location.search);
    if(w.isEditor||w.isFromEditor||Object.hasOwn(config,'remoteUserData')||Object.hasOwn(config,'remoteClassData')||query.has('input')||config.asTest===true||config.asTest==='1')return null;
    const uid=typeof w.user?.uid==='string'?w.user.uid.trim():'';
    return /^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i.test(uid)?uid:null;
   }
   if(win.parent===win)break;win=win.parent;
  }catch{break;}
 }return null;
}
function syncIdentity(){
 const next=identity();
 if(next!==currentUid){currentUid=next;q('[data-budget]').textContent='Guthaben bitte aktualisieren.';}
 q('[data-identity]').textContent=next?'Zugang automatisch über dein Edulo-Konto.':'Für KI-Rückmeldungen öffne diese Aufgabe in deiner eigenen Edulo-Ansicht.';
 if(state?.ownerUid&&next&&state.ownerUid!==next){q('[data-identity]').textContent='Das Konto wurde gewechselt. Öffne die Aufgabe neu, damit Edulo den passenden Lernstand lädt.';return null;}
 return next;
}
function endpoint(path){
 if(!API_BASE)throw Error('Die neue KI-Verbindung wird noch eingerichtet. Deine Texte und die Historie können bereits gespeichert werden.');
 const u=new URL(API_BASE);
 if((u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))||u.username||u.password||u.search||u.hash||!['/',''].includes(u.pathname))throw Error('Die Rückmeldeverbindung ist falsch eingerichtet.');
 return u.origin+path;
}
function connectionMessage(error){
 if(error?.name!=='TypeError'&&error?.name!=='AbortError')return error?.message||'Verbindung fehlgeschlagen.';
 const appOrigin=String(location.origin||'unbekannt').slice(0,200);
 return (error.name==='AbortError'?'Die Verbindung antwortet nicht rechtzeitig.':'Keine Verbindung zum Rückmeldedienst.')+' App-Herkunft: '+appOrigin+' ('+location.protocol+'). Öffne die Verbindungshilfe und wähle „Verbindung prüfen“.';
}
async function diagnoseConnection(){
 const button=q('[data-diagnose]'),out=q('[data-diagnostics]');button.disabled=true;
 const lines=['App-Herkunft: '+String(location.origin||'unbekannt').slice(0,200),'App-Protokoll: '+location.protocol];
 out.textContent=lines.join('\n')+'\nServer wird kostenfrei geprüft …';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{
  const r=await fetch(endpoint('/connection'),{method:'GET',credentials:'omit',signal:controller.signal});
  const data=await r.json();
  if(!r.ok||typeof data.originAllowed!=='boolean'||typeof data.ready!=='boolean'||!(data.requestOrigin===null||typeof data.requestOrigin==='string'))throw Error('Ungültige Diagnoseantwort.');
  lines.push('Server erreichbar: ja','Beim Server empfangene Herkunft: '+(data.requestOrigin===null?'kein Origin-Header':data.requestOrigin.slice(0,200)),
   'Herkunft freigegeben: '+(data.originAllowed?'ja':'nein'),'Dienst eingerichtet: '+(data.ready?'ja':'nein'));
 }catch(error){lines.push('Server über Fetch nicht erreichbar: '+(error.name==='AbortError'?'Zeitüberschreitung':String(error.message).slice(0,300)));}
 try{
  const r=await xhrRequest('GET',endpoint('/connection'),null,12000),data=JSON.parse(r.text);
  lines.push('Server über App-Kompatibilitätsweg: '+(r.status===200?'erreichbar':'HTTP '+r.status),
   'Kompatibilitätsweg – Herkunft: '+(data.requestOrigin===null?'kein Origin-Header':String(data.requestOrigin).slice(0,200)),
   'Kompatibilitätsweg – freigegeben: '+(data.originAllowed?'ja':'nein'));
 }catch(error){lines.push('App-Kompatibilitätsweg fehlgeschlagen: '+String(error.message).slice(0,200));}
 finally{clearTimeout(timer);out.textContent=lines.join('\n');button.disabled=false;}
}
function xhrRequest(method,url,body,timeout=45000){
 return new Promise((resolve,reject)=>{
  const xhr=new XMLHttpRequest();xhr.open(method,url,true);xhr.withCredentials=false;xhr.timeout=timeout;
  if(body!==null)xhr.setRequestHeader('Content-Type','application/json');
  xhr.onload=()=>resolve({status:xhr.status,text:xhr.responseText});
  xhr.onerror=()=>reject(new TypeError('Netzwerkverbindung fehlgeschlagen.'));
  xhr.ontimeout=()=>reject(new DOMException('Die Verbindung antwortet nicht rechtzeitig.','AbortError'));
  xhr.onabort=()=>reject(new DOMException('Die Verbindung wurde abgebrochen.','AbortError'));
  xhr.send(body);
 });
}
function parseApiResponse(status,text){
 if(text.length>64000)throw Error('Die Rückmeldung ist unerwartet groß. Bitte informiere deine Lehrkraft.');
 let data;try{data=JSON.parse(text);}catch{throw Error('Die Verbindung hat kein lesbares Ergebnis geliefert.');}
 return {status,ok:status>=200&&status<300,data};
}
async function api(path,body){
 const url=endpoint(path),serialized=JSON.stringify(body);
 if(transport==='xhr'){const r=await xhrRequest('POST',url,serialized);return parseApiResponse(r.status,r.text);}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
 try{
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',redirect:'error',signal:controller.signal,body:serialized});
  return parseApiResponse(res.status,await res.text());
 }catch(error){
  // Only read-only endpoints may try the native-WebView-compatible transport.
  // NEVER retry /feedback automatically: its outcome and charge may be unknown.
  if(error.name==='TypeError'&&(path==='/quota'||path==='/result')){
   const r=await xhrRequest('POST',url,serialized),result=parseApiResponse(r.status,r.text);
   if(result.ok)transport='xhr';return result;
  }
  throw error;
 }finally{clearTimeout(timer);}
}
function renderBudget(b,charge){
 if(!b||!['remainingEuroMicros','weeklyRemainingEuroMicros','reservedEuroMicros'].every(k=>Number.isSafeInteger(b[k])&&b[k]>=0))return;
 let text='Verfügbares Guthaben: '+money(b.remainingEuroMicros)+' · Diese Woche noch nutzbar: '+money(b.weeklyRemainingEuroMicros)+'.';
 if(b.reservedEuroMicros)text+=' Noch für ungeklärte Prüfungen blockiert: '+money(b.reservedEuroMicros)+'.';
 if(charge?.status==='settled'&&Number.isSafeInteger(charge.euroMicros)&&charge.euroMicros>=0)text+=' Verbrauch dieser Prüfung: '+money(charge.euroMicros)+'.';
 q('[data-budget]').textContent=text;
}
async function refreshBudget(){
 if(budgetBusy||busy)return;const uid=syncIdentity();if(!uid)return;
 budgetBusy=true;q('[data-refresh-budget]').disabled=true;
 try{const r=await api('/quota',{uid});if(syncIdentity()!==uid)return;
  if(!r.ok)throw Error(errorMessage(r.data,r.status));renderBudget(r.data.budget);
 }catch(error){q('[data-budget]').textContent=connectionMessage(error);q('[data-connection-help]').open=true;}finally{budgetBusy=false;q('[data-refresh-budget]').disabled=false;}
}
function active(){return state?.history.find(h=>h.status==='pending'||h.status==='unknown');}
function controls(){
 const pending=active();q('[data-check]').disabled=!loaded||busy||!!pending||!LESSON.questions.every(item=>state?.answers[item.id].trim());
 q('[data-check]').textContent=busy?'HDBs KI-Assistent überprüft deine Antworten …':'Alle Antworten prüfen';
 q('[data-recover]').hidden=!pending;q('[data-recover]').disabled=!loaded||busy;
 for(const item of LESSON.questions)q('[data-count="'+item.id+'"]').textContent=(state?.answers[item.id].length||0)+' / 3000 Zeichen';
}
function videoLink(source){
 const a=element('a','Passende Videostelle ab '+Math.floor(source/60)+':'+String(source%60).padStart(2,'0')+' ansehen ↗');
 a.href='https://www.youtube.com/watch?v='+LESSON.videoId+'&t='+source+'s';a.target='_blank';a.rel='noopener noreferrer';
 a.addEventListener('click',()=>{if(!loaded)return;D.assist(LESSON,state,source);bridge.queueSave(state,D.scores(LESSON,state));});return a;
}
function render(){
 if(!state)return;
 const last=[...state.history].reverse().find(h=>h.feedback);
 for(const question of LESSON.questions){
  const points=q('[data-points="'+question.id+'"]');points.replaceChildren();
  question.criteria.forEach((c,i)=>{
   const color=state.aspects[c.id].earned,p=element('span',undefined,'point');p.dataset.color=color;p.setAttribute('role','img');
   p.setAttribute('aria-label','Aspekt '+(i+1)+': '+({gray:'noch offen',green:'auf Anhieb ausreichend erklärt',yellow:'nach Hilfe ausreichend erklärt'})[color]);points.append(p);
  });
  points.append(element('span',question.criteria.filter(c=>state.aspects[c.id].earned!=='gray').length+' / '+question.criteria.length+' Aspekte erreicht','muted'));
  const list=q('[data-aspects="'+question.id+'"]');list.replaceChildren();
  if(last){const li=element('li');li.append(groupedFeedback(last,question));list.append(li);}
 }
 q('[data-feedback]').hidden=!last;
 if(last){
  q('[data-stale]').hidden=JSON.stringify(last.answers)===JSON.stringify(state.answers);
  const current=visibleFeedback(last),misconceptions=current?(last.feedback.misconceptions||[]):[];
  q('[data-summary]').textContent=current?last.feedback.summary:'Frühere Rückmeldung gespeichert. Die bisherigen Punkte bleiben erhalten. Offene Aspekte kannst du mithilfe der Videostellen überarbeiten.';q('[data-language]').textContent=current?last.feedback.languageFeedback:'';
  q('[data-language-wrap]').hidden=!current||!last.feedback.languageFeedback.trim();q('[data-next-wrap]').hidden=!current||!last.feedback.nextSteps.length;
  q('[data-next]').replaceChildren(...(current?last.feedback.nextSteps:[]).map(text=>element('li',text)));
  q('[data-misconceptions-wrap]').hidden=!misconceptions.length;q('[data-misconceptions]').replaceChildren(...misconceptionElements(misconceptions));
 }renderHistory();controls();
}
function renderHistory(){
 q('[data-history-label]').textContent='Deine Historie · '+state.history.length+' Prüfungen';const list=q('[data-history]');list.replaceChildren();
 if(!state.history.length){list.append(element('p','Noch keine Antworten eingereicht.'));return;}
 for(const h of [...state.history].reverse().slice(0,historyShown)){
  const details=element('details',undefined,'history-entry'),date=new Date(h.at);
  const label=Number.isNaN(date.getTime())?h.at:date.toLocaleString('de-DE');
  details.append(element('summary',label+' · '+({pending:'Prüfung läuft',unknown:'Ausgang noch ungeklärt',done:'Feedback erhalten',failed:'Prüfung fehlgeschlagen'})[h.status]));
  for(const item of LESSON.questions){details.append(element('h3',item.title),element('p',h.answers[item.id],'saved-answer'));if(h.feedback)details.append(groupedFeedback(h,item));}
  if(h.feedback){details.append(element('h3','Rückmeldung'));
   if(visibleFeedback(h)){
    details.append(element('p',h.feedback.summary));
    if(h.feedback.languageFeedback)details.append(element('h3','Formulierung'),element('p',h.feedback.languageFeedback));
    if(h.feedback.misconceptions?.length)details.append(element('h3','Fehlvorstellungen klären'),...misconceptionElements(h.feedback.misconceptions));
   }else details.append(element('p','Frühere Rückmeldung gespeichert. Ihr Text wird nicht mehr angezeigt, damit er keine Lösung vorwegnimmt. Die Antworten und Punkte bleiben erhalten.'));
  }else details.append(element('p',h.message||'Noch keine Rückmeldung vorhanden.'));
  list.append(details);
 }
 if(historyShown<state.history.length){const button=element('button','Weitere Prüfungen anzeigen','secondary');button.type='button';button.addEventListener('click',()=>{historyShown+=8;renderHistory();});list.append(button);}
}
function errorMessage(data,status){
 const messages={400:'Die Anfrage konnte nicht verarbeitet werden.',402:'Dein verfügbares Guthaben oder Wochenlimit reicht für diese Prüfung nicht aus.',403:'Deine ID oder diese Lernumgebung ist noch nicht freigegeben.',409:'Die Anfrage ist bereits vorhanden oder das Konto ist noch durch eine ungeklärte Prüfung gesperrt.',429:'Dein Wochenlimit oder das Guthaben ist ausgeschöpft, oder es sind gerade zu viele Anfragen.',503:'Die neue KI-Verbindung ist noch nicht vollständig eingerichtet.'};
 const code=typeof data?.error?.code==='string'&&/^[a-z_]{1,60}$/.test(data.error.code)?' Fehlercode: '+data.error.code+'.':'';
 return (messages[status]||'Die Prüfung konnte nicht abgeschlossen werden.')+code;
}
async function handleResult(h,r){
 renderBudget(r.data.budget,r.data.charge);
 if(r.status===202){h.status='unknown';h.message='Die Prüfung läuft noch oder ihr Ausgang wird geklärt. Es wird kein zweiter KI-Aufruf gestartet.';message(h.message);return;}
 if(r.ok){
  if(r.data.taskId!==TASK.id||r.data.taskVersion!==(h.rubricVersion||TASK.version)||r.data.requestId!==h.requestId||!D.validAttemptFeedback(LESSON,h,r.data.feedback))throw Error('Das Ergebnis passt nicht zum vereinbarten Format.');
  D.finish(LESSON,state,h,r.data.feedback);h.feedbackStyle=['questions-v1','questions-v2','questions-v3'].includes(r.data.feedbackStyle)?r.data.feedbackStyle:'legacy';message('Rückmeldung erhalten. Überarbeite offene Aspekte und prüfe deine Antworten erneut.');
 }else{h.status=r.data.charge?.status==='reserved'?'unknown':'failed';h.message=errorMessage(r.data,r.status);message(h.message);}
}
async function check(){
 if(!loaded||busy||active())return;
 let uid;try{endpoint('/feedback');uid=syncIdentity();if(!uid)throw Error('Deine eigene Edulo-Anmelde-ID ist hier noch nicht verfügbar.');}catch(error){message(error.message);return;}
 busy=true;controls();let h;
 try{
  h=D.begin(LESSON,state,crypto.randomUUID(),new Date().toISOString());state.ownerUid=uid;
  await bridge.save(state,D.scores(LESSON,state)); // Save exact submission in E1 BEFORE spending money.
  message('Deine Antworten werden geprüft.');render();
 }catch(error){
  if(h){h.status='failed';h.message='Nicht an die KI gesendet: Speicherung konnte nicht bestätigt werden.';}
  busy=false;render();message('Die Eingaben konnten nicht sicher gespeichert werden. Es wurde keine KI-Anfrage gesendet. '+error.message);return;
 }
 try{
  const r=await api('/feedback',{uid,requestId:h.requestId,task:TASK,answer:JSON.stringify(h.answers)});
  if(!root.isConnected)return;
  if(syncIdentity()!==uid){h.status='unknown';message('Das Konto wurde während der Prüfung gewechselt. Öffne die Aufgabe neu.');return;}
  await handleResult(h,r);
 }catch(error){h.status='unknown';h.message='Ausgang der Prüfung unbekannt. Eine mögliche Kostenreservierung bleibt bestehen.';
  message(h.message+' Nutze „Ausstehende Prüfung abrufen“, bevor du erneut prüfst. '+connectionMessage(error));q('[data-connection-help]').open=true;
 }finally{busy=false;render();if(root.isConnected&&syncIdentity()===uid)try{await bridge.save(state,D.scores(LESSON,state));}catch{}}
}
async function recover(){
 const h=active(),uid=syncIdentity();if(!h||!uid||busy||!loaded)return;busy=true;controls();
 try{const r=await api('/result',{uid,requestId:h.requestId});if(syncIdentity()!==uid)return;
  if(!r.ok&&!r.data.charge&&r.status!==404)throw Error('Der Abrechnungsstand ist noch unklar.');
  await handleResult(h,r);}
 catch(error){message('Der Ausgang konnte noch nicht abgerufen werden. Es wurde keine neue KI-Anfrage gestartet. '+connectionMessage(error));q('[data-connection-help]').open=true;}
 finally{busy=false;render();if(syncIdentity()===uid)try{await bridge.save(state,D.scores(LESSON,state));}catch{}}
}
async function start(){
 if(busy)return;loaded=false;q('[data-controls]').disabled=true;
 try{const saved=await bridge.load();state=saved.data;scores=saved.scores;
  const expected=D.scores(LESSON,state);if(JSON.stringify(scores)!==JSON.stringify(expected))throw Error('Punkte und gespeicherte Historie passen nicht zusammen. Bitte informiere deine Lehrkraft.');
  for(const item of LESSON.questions)q('[data-answer="'+item.id+'"]').value=state.answers[item.id];
  loaded=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!loaded;syncIdentity();render();
  if(!API_BASE)message('Die neue KI-Verbindung wird noch eingerichtet. Du kannst das Video ansehen und deine Antworten bereits verfassen.');
  else if(active())message('Eine frühere Prüfung ist noch offen. Rufe ihr Ergebnis ab; es wird keine neue Prüfung berechnet.');
  if(API_BASE&&currentUid)refreshBudget();
 }catch(error){message(error.message);}
}
for(const [i,item] of LESSON.questions.entries()){
 const section=element('section',undefined,'question');section.append(element('h2',(i+1)+'. '+item.title));
 const id='ion-answer-'+item.id,label=element('label','Deine Erläuterung');label.htmlFor=id;
 const textarea=element('textarea');textarea.id=id;textarea.dataset.answer=item.id;textarea.rows=5;textarea.maxLength=3000;textarea.placeholder='Erkläre mit eigenen Worten …';
 const counter=element('p','0 / 3000 Zeichen','count');counter.dataset.count=item.id;
 const points=element('div',undefined,'points');points.dataset.points=item.id;points.setAttribute('aria-label','Erreichte Aspekte zur Frage '+(i+1));
 const list=element('ul',undefined,'aspects');list.dataset.aspects=item.id;
 textarea.addEventListener('input',()=>{if(!loaded||state.ownerUid&&syncIdentity()!==state.ownerUid)return;
  state.answers[item.id]=textarea.value;bridge.queueSave(state,D.scores(LESSON,state));render();});
 section.append(label,textarea,counter,points,list);q('[data-questions]').append(section);
}
q('[data-check]').addEventListener('click',check);q('[data-recover]').addEventListener('click',recover);q('[data-refresh-budget]').addEventListener('click',refreshBudget);q('[data-retry]').addEventListener('click',start);
q('[data-diagnose]').addEventListener('click',diagnoseConnection);
const identityTimer=setInterval(()=>{if(!root.isConnected){clearInterval(identityTimer);return;}if(loaded)syncIdentity();},1000);
start();
