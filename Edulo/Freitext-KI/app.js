// Lehrkraft: Worker-Adresse und Aufgabe anpassen, danach neu bauen. Kein API-Schlüssel im Widget!
const API_BASE = '';
const TASK = {
 id:'bewegung-gleichfoermig-v1',version:'1',
 prompt:'Erkläre, was eine gleichförmige Bewegung ist. Beschreibe den Zusammenhang zwischen Strecke, Zeit und Geschwindigkeit und nenne ein Beispiel.',
 referenceAnswer:'Die Geschwindigkeit bleibt konstant. In gleichen Zeitabschnitten werden gleiche Strecken zurückgelegt. Für die zurückgelegte Strecke gilt s = v · t. Bei einem Startort s₀ gilt für den Ort s(t) = s₀ + v · t. Beispiel: Ein Zug fährt auf gerader Strecke konstant 80 km/h und legt jede Minute dieselbe Strecke zurück. Eine richtige Erklärung in Worten genügt; die Formel ist keine Pflicht.',
 criteria:[
  {id:'gleichfoermig',label:'Gleichförmige Bewegung',description:'Konstante Geschwindigkeit oder gleiche Strecken in gleichen Zeitabschnitten erklärt. Sinngemäße Formulierungen anerkennen.'},
  {id:'zusammenhang',label:'Strecke, Zeit und Geschwindigkeit',description:'Bei gleicher Geschwindigkeit wächst die zurückgelegte Strecke proportional zur Zeit. Korrekte Worte oder passende Formel genügen. Ort und zurückgelegte Strecke unterscheiden.'},
  {id:'beispiel',label:'Passendes Beispiel',description:'Konkretes Beispiel mit erkennbar konstanter Geschwindigkeit; nicht allein ein Verkehrsmittel nennen.'}
 ]};
const MAX_ANSWER=4000;
function validFeedback(f) {
 return !!f && typeof f.summary==='string' && f.summary.length<=1600 &&
 Array.isArray(f.nextSteps) && f.nextSteps.length<=6 && f.nextSteps.every(s=>typeof s==='string'&&s.length<=1000) &&
 Array.isArray(f.criteria) && f.criteria.length===TASK.criteria.length &&
 new Set(f.criteria.map(c=>c?.id)).size===TASK.criteria.length &&
 f.criteria.every(c=>c && TASK.criteria.some(t=>t.id===c.id) && ['met','partial','missing'].includes(c.status) && typeof c.feedback==='string' && c.feedback.length<=1600);
}
const fresh=()=>({taskId:TASK.id,taskVersion:TASK.version,answer:'',checks:0,last:null});
function validState(s) {
 return !!s && s.taskId===TASK.id && s.taskVersion===TASK.version && typeof s.answer==='string' && s.answer.length<=MAX_ANSWER &&
 Number.isInteger(s.checks) && s.checks>=0 && (s.last===null || (typeof s.last?.answer==='string' && s.last.answer.length<=MAX_ANSWER && validFeedback(s.last.feedback)));
}
const bridge=createEduloBridge({root,widgetId:'edulo-freitext-ki-v1',stateVersion:1,hideFooter:true,fresh,validate:validState,
 onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}});
let state,scores,busy=false,loaded=false;
function endpoint() {
 if (!API_BASE) throw new Error('Die Lehrkraft muss die Feedback-Verbindung noch einrichten. Deine Antwort kann bereits gespeichert werden.');
 const url=new URL(API_BASE);
 if (url.protocol!=='https:' && !(url.protocol==='http:' && ['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('Die Feedback-Adresse muss HTTPS verwenden.');
 if (url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname)) throw new Error('Bitte die reine Worker-Adresse konfigurieren.');
 return url.origin+'/feedback';
}
function message(text){q('[data-message]').textContent=text;}
function controls(){
 q('[data-check]').disabled=!loaded||busy||!state?.answer.trim();
 q('[data-check]').textContent=busy?'Luna prüft deine Antwort …':'Feedback anfordern';
 q('[data-count]').textContent=(state?.answer.length||0)+' / '+MAX_ANSWER+' Zeichen';
 q('[data-code]').disabled=busy;
}
function showFeedback(){
 q('[data-result]').hidden=!state.last;
 if(!state.last)return;
 q('[data-stale]').hidden=state.answer===state.last.answer;
 q('[data-summary]').textContent=state.last.feedback.summary;
 const list=q('[data-criteria]');list.replaceChildren();
 const labels={met:'Erfüllt',partial:'Teilweise erfüllt',missing:'Noch offen'};
 for(const criterion of TASK.criteria){
  const result=state.last.feedback.criteria.find(c=>c.id===criterion.id);
  const li=document.createElement('li');li.dataset.status=result.status;
  const strong=document.createElement('strong');strong.textContent=criterion.label+' · '+labels[result.status];
  const p=document.createElement('p');p.textContent=result.feedback;li.append(strong,p);list.append(li);
 }
 const steps=q('[data-steps]');steps.replaceChildren();
 for(const text of state.last.feedback.nextSteps){const li=document.createElement('li');li.textContent=text;steps.append(li);}
 q('[data-next]').hidden=!state.last.feedback.nextSteps.length;
}
async function check(){
 if(!loaded||busy||!state.answer.trim())return;
 let url;try{url=endpoint();}catch(error){message(error.message);return;}
 const code=q('[data-code]').value;
 if(!code.trim()){message('Bitte gib den Zugangscode deiner Lehrkraft ein.');q('[data-code]').focus();return;}
 const answer=state.answer;busy=true;controls();message('Deine Antwort wird geprüft.');
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),45000);
 try{
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+code},body:JSON.stringify({task:TASK,answer}),signal:controller.signal,credentials:'omit',redirect:'error'});
  const raw=await res.text();if(raw.length>48000)throw new Error('Die Feedback-Antwort ist zu groß. Bitte informiere deine Lehrkraft.');
  let data;try{data=JSON.parse(raw);}catch{throw new Error('Die Verbindung liefert kein lesbares Ergebnis. Bitte informiere deine Lehrkraft.');}
  if(!res.ok){
   const errors={401:'Der Zugangscode ist ungültig.',403:'Die Verbindung aus dieser Lernumgebung ist noch nicht freigegeben.',429:'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.',503:'Die Feedback-Verbindung ist noch nicht vollständig eingerichtet oder vorübergehend nicht verfügbar.'};
   const diagnostic=typeof data?.error?.code==='string' && /^[a-z_]{1,60}$/.test(data.error.code) ? ' Fehlercode: '+data.error.code+'.' : '';
   throw new Error((errors[res.status]||'Die Prüfung konnte nicht abgeschlossen werden. Bitte versuche es später erneut.')+diagnostic);
  }
  if(data.taskId!==TASK.id||data.taskVersion!==TASK.version||!validFeedback(data.feedback))throw new Error('Das Feedback passt nicht zum vereinbarten Format. Deine Antwort bleibt gespeichert.');
  if(!root.isConnected)return;
  if(state.answer!==answer){message('Du hast deine Antwort inzwischen geändert. Fordere bitte neues Feedback an.');return;}
  state.last={answer,feedback:data.feedback};state.checks++;showFeedback();
  try{await bridge.save(state,scores);}catch{}
  message('Feedback erhalten. Du kannst deine Antwort überarbeiten und erneut prüfen lassen.');
 }catch(error){
  if(error.name==='AbortError')message('Die Prüfung dauert zu lange. Deine Antwort bleibt erhalten. Bitte versuche es erneut.');
  else if(error instanceof TypeError)message('Die Feedback-Verbindung ist nicht erreichbar. Prüfe deine Internetverbindung; falls das Problem bleibt, informiere deine Lehrkraft.');
  else message(error.message);
 }finally{clearTimeout(timer);busy=false;controls();}
}
async function start(){
 if(busy)return;loaded=false;q('[data-controls]').disabled=true;controls();
 try{
  const saved=await bridge.load();state=saved.data;scores=saved.scores;
  q('[data-answer]').value=state.answer;showFeedback();
  loaded=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!loaded;controls();
  if(!API_BASE)message('Die Feedback-Verbindung wird noch eingerichtet. Du kannst deine Antwort bereits verfassen.');
 }catch{}
}
q('[data-prompt]').textContent=TASK.prompt;
q('[data-answer]').addEventListener('input',()=>{
 if(!loaded)return;state.answer=q('[data-answer]').value;bridge.queueSave(state,scores);showFeedback();controls();
});
q('[data-check]').addEventListener('click',check);
q('[data-retry]').addEventListener('click',start);
start();

