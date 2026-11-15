// Generated; edit the source modules.
const API_BASE='https://edulomodularai.hildebrandt.workers.dev';
const LESSON={id:'freier-fall-ki-v1',version:'1',questions:[
 {id:'zeit',title:'Bestimme den Zeitabstand zwischen zwei benachbarten Murmelpositionen. Begründe mit der angegebenen Bildrate.',
 reference:'Die Vorlage gibt 100 Bilder pro Sekunde an. Daher Δt = 1/(100 pro Sekunde) = 0,01 s = 10 ms. Die Bildrate ist eine Quellenangabe, keine am Video verifizierte Aufnahmefrequenz. Nicht aus der Zeitlupen-Wiedergabedauer rechnen.',criteria:[
 {id:'zeit_wert',label:'Zeitabstand',description:'Nennt 0,01 s oder gleichwertig 10 ms mit Einheit.'},
 {id:'zeit_grund',label:'Begründung',description:'Teilt eine Sekunde durch 100 bzw. nutzt den Kehrwert der Bildrate.'}]},
 {id:'messung',title:'Lies die Höhen zu den acht Zeiten ab. Erkläre, wie du die Positionen zugeordnet hast und was das Diagramm zeigt.',
 reference:'Antwort ist JSON mit hoehen_m (acht Höhen in m zu t=0;0,05;0,10;0,15;0,20;0,25;0,30;0,35 s) und erlaeuterung. Das Original zeigt Höhe über Boden h, NICHT gefallenen Weg. Start bei etwa 1,40 m. Ungefähre Ablesungen: 1,40;1,38;1,31;1,20;1,04;0,83;0,59;0,30 m. Toleranz je etwa 0,04 m, im überlagerten oberen Bereich großzügig. Kein Idealgesetz anwenden: Bildpositionen und Quellenbildrate sind mit g=9,81 nicht konsistent. Fünf Intervalle liegen zwischen Tabellenzeilen; Markierung 10 ist bei t=0,10 s. Das h(t)-Diagramm fällt und wird zunehmend steiler. Die KI sieht kein Bild, sondern prüft nur diese Aufgabenreferenz und Eingaben. Keine behaupteten Bilddetails erfinden.',criteria:[
 {id:'messung_voll',label:'Höhenwerte',description:'Trägt acht plausible Höhen gemäß Referenz ein; Kommastellen nicht überfordern. Nicht theoretische Fallhöhen aus g verlangen.'},
 {id:'messung_zeit',label:'Zeitzuordnung',description:'Erklärt Zuordnung in Fünferschritten bzw. fünf Intervalle zu je 0,01 s. Obere Startposition ist hier Bild 0.'},
 {id:'messung_bezug',label:'Höhe und Fallweg',description:'Unterscheidet abnehmende Höhe über dem Boden vom zunehmenden gefallenen Weg, zumindest sinngemäß.'},
 {id:'messung_kurve',label:'Diagrammverlauf',description:'Beschreibt eine fallende, zunehmend steile Kurve, statt eine gleichförmige Bewegung zu behaupten.'}]},
 {id:'geschwindigkeit',title:'Berechne für jeden Zeitabschnitt die gefallene Strecke und die Durchschnittsgeschwindigkeit. Erläutere deinen Rechenweg an einem Abschnitt.',
 reference:'Antwort ist JSON mit hoehen_m (die eigenen acht Ablesungen), strecken_m und geschwindigkeiten_ms (je sieben Werte) sowie erlaeuterung. Je Intervall Δt=0,05s. Positive Fallstrecke Δs=h(t1)-h(t2); Geschwindigkeitsbetrag v̄=Δs/0,05s. Werte anhand der mitgesendeten eigenen Höhen prüfen, Folgefehler nicht doppelt abwerten. Beispiel: von 1,20 auf 1,04 m ergibt 0,16m und 3,2m/s. Andere aus eigenen Ablesungen korrekt berechnete Werte anerkennen. Keine exakte Erdbeschleunigung verlangen. Bei Rundung 0,01m bzw. 0,2m/s tolerieren. Es sind Durchschnittswerte im Intervall, keine Momentangeschwindigkeiten am Rand.',criteria:[
 {id:'rechnung_strecken',label:'Streckendifferenzen',description:'Sieben Strecken passend zu den mitgesendeten Höhen als h1-h2; Folgefehler eigener Ablesung getrennt behandeln.'},
 {id:'rechnung_v',label:'Geschwindigkeiten',description:'Sieben Geschwindigkeiten jeweils Strecke geteilt durch 0,05s, mit üblicher Rundung. Nicht durch Gesamtzeit teilen.'},
 {id:'rechnung_weg',label:'Rechenweg',description:'Erläutert mindestens eine Höhendifferenz und Division durch Zeitintervall nachvollziehbar. Einheiten stehen auch in Tabellenüberschriften.'},
 {id:'rechnung_mittel',label:'Durchschnittswert',description:'Deutet v̄ als Durchschnittsgeschwindigkeit eines Zeitabschnitts, etwa über Strecke pro Intervall; keine formale Integraldefinition nötig.'}]},
 {id:'deutung',title:'Erkläre anhand der Abstände und deiner Werte, wie sich die Bewegung verändert. Welche Grenzen hat die Auswertung?',
 reference:'Bei gleichen Zeitintervallen wachsen die Abstände und die Durchschnittsgeschwindigkeiten: Die Murmel wird beim Fallen schneller, bewegt sich beschleunigt. Zunehmende Steigung des gefallenen Wegs bzw. zunehmend negative Steigung der Höhe. Ableseunsicherheit durch überlappende/breite Punkte, Maßstab/Perspektive oder unsichere Bildrate sind mögliche Grenzen. Die Quelle gibt 100 Bilder/s an, ist aber mit idealem freiem Fall nicht konsistent; keine Übereinstimmung mit g=9,81 und keinen Nachweis konstanter Beschleunigung verlangen. Ein begründeter Hinweis auf eine Grenze reicht. Keine Theorieformel oder Fehlerrechnung nötig.',criteria:[
 {id:'deutung_abstand',label:'Beleg aus dem Bild',description:'Verknüpft zunehmende Positionsabstände mit gleichen Zeitabständen.'},
 {id:'deutung_bewegung',label:'Beschleunigte Bewegung',description:'Erklärt zunehmende Geschwindigkeit anhand der Messwerte oder größerer Wege pro gleicher Zeit; keine konkrete Beschleunigungszahl erforderlich.'},
 {id:'deutung_grenze',label:'Messgrenze',description:'Nennt mindestens eine sinnvolle Grenze wie Überlagerung, Ableseunsicherheit, Perspektive oder nicht bestätigte Bildrate. Keine bestimmte zusätzliche Grenze fordern.'}]}
]};
if(typeof module!=='undefined'&&module.exports)module.exports=LESSON;

const LessonDomain=(()=>{
  const colors=['gray','green','yellow'];
  const criteria=lesson=>lesson.questions.flatMap(q=>q.criteria);
  const previous=lesson=>lesson;
  const validAttemptFeedback=(lesson,h,f)=>validFeedback(h.rubricVersion==='1'?previous(lesson):lesson,f);
  const fresh=lesson=>({lesson:lesson.id,version:lesson.version,ownerUid:null,
    answers:Object.fromEntries(lesson.questions.map(q=>[q.id,''])),
    aspects:Object.fromEntries(criteria(lesson).map(c=>[c.id,{earned:'gray',assisted:false}])),history:[]});
  function task(lesson){return {id:lesson.id,version:lesson.version,
    prompt:lesson.questions.map(q=>q.id+': '+q.title).join('\n')+'\nBeurteile die eingereichten Teilantworten getrennt anhand der zugeordneten Kriterien. Gib zusätzlich allgemeine Formulierungshinweise, wenn sie helfen. Keine Abwertung verständlicher Antworten wegen bloßer Rechtschreibung. Keine erfundenen Videostellen oder Links.',
    referenceAnswer:lesson.questions.map(q=>q.id+': '+q.reference).join('\n\n'),
    feedbackGroups:lesson.questions.map(q=>({id:q.id,prompt:q.title,criterionIds:q.criteria.map(c=>c.id)})),
    criteria:criteria(lesson).map(({id,label,description})=>({id,label,description}))};}
  function validFeedback(lesson,f){
    const ids=criteria(lesson).map(c=>c.id);
    return !!f&&typeof f.summary==='string'&&f.summary.length<=1600&&typeof f.languageFeedback==='string'&&f.languageFeedback.length<=1600&&
      (!Object.hasOwn(f,'misconceptions')||Array.isArray(f.misconceptions)&&f.misconceptions.length<=3&&f.misconceptions.every(m=>m&&typeof m.statement==='string'&&m.statement.trim().length>0&&m.statement.length<=300&&typeof m.correction==='string'&&m.correction.trim().length>0&&m.correction.length<=600))&&
      (!Object.hasOwn(f,'taskFeedback')||Array.isArray(f.taskFeedback)&&f.taskFeedback.length===lesson.questions.length&&new Set(f.taskFeedback.map(g=>g?.id)).size===lesson.questions.length&&f.taskFeedback.every(g=>g&&lesson.questions.some(q=>q.id===g.id)&&typeof g.feedback==='string'&&g.feedback.trim().length>0&&g.feedback.length<=1200))&&
      Array.isArray(f.nextSteps)&&f.nextSteps.length<=6&&f.nextSteps.every(s=>typeof s==='string'&&s.length<=1000)&&
      Array.isArray(f.criteria)&&f.criteria.length===ids.length&&new Set(f.criteria.map(c=>c?.id)).size===ids.length&&
      f.criteria.every(c=>c&&ids.includes(c.id)&&['met','partial','missing'].includes(c.status)&&typeof c.feedback==='string'&&c.feedback.length<=1600);
  }
  function validAnswers(lesson,a){return !!a&&lesson.questions.every(q=>typeof a[q.id]==='string'&&a[q.id].length<=2000);}
  const own=(value,key)=>!!value&&Object.hasOwn(value,key);
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const exact=(value,keys)=>object(value)&&Object.keys(value).length===keys.length&&keys.every(key=>own(value,key));
  const attemptLesson=(lesson,h)=>h.rubricVersion==='1'?previous(lesson):lesson;
  const signature=q=>JSON.stringify({id:q.id,prompt:q.title,referenceAnswer:q.reference,
    criteria:q.criteria.map(({id,label,description})=>({id,label,description}))});
  function checked(lesson,h){
    const ids=lesson.questions.map(q=>q.id);
    if(!own(h,'checkedQuestionIds'))return ids;
    return Array.isArray(h.checkedQuestionIds)&&h.checkedQuestionIds.length>0&&
      new Set(h.checkedQuestionIds).size===h.checkedQuestionIds.length&&h.checkedQuestionIds.every(id=>ids.includes(id))?h.checkedQuestionIds:null;
  }
  function validSignatures(lesson,signatures){
    if(!exact(signatures,lesson.questions.map(q=>q.id)))return false;
    return lesson.questions.every(q=>{
      const text=signatures[q.id];let value;
      if(typeof text!=='string'||text.length>20000)return false;
      try{value=JSON.parse(text);}catch{return false;}
      return exact(value,['id','prompt','referenceAnswer','criteria'])&&value.id===q.id&&
        typeof value.prompt==='string'&&typeof value.referenceAnswer==='string'&&Array.isArray(value.criteria)&&
        value.criteria.length===q.criteria.length&&new Set(value.criteria.map(c=>c?.id)).size===q.criteria.length&&
        value.criteria.every(c=>exact(c,['id','label','description'])&&q.criteria.some(expected=>expected.id===c.id)&&typeof c.label==='string'&&typeof c.description==='string');
    });
  }
  function completeGroupedFeedback(lesson,h){
    return h?.status==='done'&&h.feedbackStyle==='questions-v4'&&h.rubricVersion===lesson.version&&
      validFeedback(lesson,h.feedback)&&Array.isArray(h.feedback.taskFeedback)&&h.feedback.taskFeedback.length===lesson.questions.length;
  }
  function latestDone(history,before=history.length){
    for(let i=before-1;i>=0;i--)if(history[i]?.status==='done')return i;
    return -1;
  }
  function validMetadata(lesson,h,history,index){
    const names=['checkedQuestionIds','reusedFrom','questionSignatures'];
    if(!names.some(name=>own(h,name)))return true; // Legacy attempts have no cache metadata.
    if(!names.every(name=>own(h,name)))return false;
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    if(!ids||!validSignatures(base,h.questionSignatures))return false;
    const reused=base.questions.filter(q=>!ids.includes(q.id));
    if(!exact(h.reusedFrom,reused.map(q=>q.id)))return false;
    if(!reused.length)return true;
    const sourceIndex=latestDone(history,index),source=history[sourceIndex];
    if(sourceIndex<0||!completeGroupedFeedback(base,source)||!validMetadata(lesson,source,history,sourceIndex))return false;
    return reused.every(q=>h.reusedFrom[q.id]===source.requestId&&source.answers?.[q.id]===h.answers?.[q.id]&&
      (!own(source,'questionSignatures')||source.questionSignatures[q.id]===h.questionSignatures[q.id]));
  }
  function plan(lesson,s){
    const all=lesson.questions.map(q=>q.id),history=Array.isArray(s?.history)?s.history:[];
    const index=latestDone(history),source=history[index];
    if(!completeGroupedFeedback(lesson,source)||!validAnswers(lesson,source.answers)||!validMetadata(lesson,source,history,index))
      return {checkedQuestionIds:all,reusedFrom:{}};
    const checkedQuestionIds=[],reusedFrom={};
    for(const q of lesson.questions){
      if(s.answers?.[q.id]!==source.answers[q.id]||
        (own(source,'questionSignatures')&&source.questionSignatures[q.id]!==signature(q)))checkedQuestionIds.push(q.id);
      else reusedFrom[q.id]=source.requestId;
    }
    return {checkedQuestionIds,reusedFrom};
  }
  function request(lesson,h){
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    if(!ids)throw Error('Ungültige Teilaufgaben für die Prüfung.');
    const projected={...base,questions:base.questions.filter(q=>ids.includes(q.id))};
    return {task:task(projected),answer:JSON.stringify(own(h,'checkedQuestionIds')?
      Object.fromEntries(projected.questions.map(q=>[q.id,h.answers[q.id]])):h.answers)};
  }
  function validResponse(lesson,h,f){
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    if(!ids)return false;
    const projected={...base,questions:base.questions.filter(q=>ids.includes(q.id))};
    return validFeedback(projected,f)&&(ids.length===base.questions.length||Array.isArray(f.taskFeedback));
  }
  function valid(lesson,s){
    return !!s&&s.lesson===lesson.id&&s.version===lesson.version&&(s.ownerUid===null||typeof s.ownerUid==='string'&&/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i.test(s.ownerUid))&&
      validAnswers(lesson,s.answers)&&s.aspects&&criteria(lesson).every(c=>colors.includes(s.aspects[c.id]?.earned)&&typeof s.aspects[c.id]?.assisted==='boolean')&&
      Array.isArray(s.history)&&new Set(s.history.map(h=>h?.requestId)).size===s.history.length&&s.history.every((h,index)=>h&&typeof h.requestId==='string'&&typeof h.at==='string'&&validAnswers(lesson,h.answers)&&
        ['pending','done','failed','unknown'].includes(h.status)&&criteria(lesson).every(c=>typeof h.assisted?.[c.id]==='boolean')&&
        (h.feedback===null||validAttemptFeedback(lesson,h,h.feedback))&&typeof h.message==='string'&&validMetadata(lesson,h,s.history,index));
  }
  function begin(lesson,s,requestId,at){
    if(s.history.some(h=>h.status==='pending'||h.status==='unknown'))throw Error('Eine frühere Prüfung ist noch ungeklärt.');
    if(!lesson.questions.every(q=>s.answers[q.id].trim()))throw Error('Bitte beantworte zuerst alle Aufgaben.');
    const next=plan(lesson,s);
    if(!next.checkedQuestionIds.length)throw Error('Die Antworten sind unverändert. Die vorhandene Rückmeldung gilt weiterhin.');
    const h={requestId,at,rubricVersion:lesson.version,answers:JSON.parse(JSON.stringify(s.answers)),assisted:Object.fromEntries(criteria(lesson).map(c=>[c.id,s.aspects[c.id].assisted])),
      ...next,questionSignatures:Object.fromEntries(lesson.questions.map(q=>[q.id,signature(q)])),status:'pending',feedback:null,message:''};
    s.history.push(h);return h;
  }
  function finish(lesson,s,h,f){
    const index=s.history.indexOf(h);
    if(index<0||!validMetadata(lesson,h,s.history,index)||!validResponse(lesson,h,f))throw Error('Ungültiges Feedback.');
    if(h.status==='done')return;
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    let merged=f;
    if(ids.length<base.questions.length){
      const results=[],groups=[];
      for(const q of base.questions){
        const source=ids.includes(q.id)?f:s.history.find(prior=>prior.requestId===h.reusedFrom[q.id]).feedback;
        for(const c of q.criteria)results.push({...source.criteria.find(result=>result.id===c.id)});
        groups.push({...source.taskFeedback.find(group=>group.id===q.id)});
      }
      merged={summary:'',languageFeedback:'',misconceptions:[],nextSteps:[],criteria:results,taskFeedback:groups};
    }
    if(!validAttemptFeedback(lesson,h,merged))throw Error('Ungültiges zusammengeführtes Feedback.');
    h.feedback=merged;h.status='done';h.message='Rückmeldung erhalten.';
    for(const result of f.criteria){
      const aspect=s.aspects[result.id];
      if(result.status==='met'&&aspect.earned==='gray')aspect.earned=h.assisted[result.id]?'yellow':'green';
      if(result.status!=='met')aspect.assisted=true;
    }
  }
  function scores(lesson,s){return criteria(lesson).map(c=>s.aspects[c.id].earned);}
  function assist(lesson,s,source){for(const c of criteria(lesson))if(c.source===source)s.aspects[c.id].assisted=true;}
  function migrate(){throw Error('Unbekannter älterer Lernstand. Originaldaten bleiben erhalten.');}
  return {criteria,fresh,task,valid,validFeedback,validAttemptFeedback,plan,request,validResponse,begin,finish,scores,assist,migrate};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=LessonDomain;

/* Edulo resolves its own uploaded files. No guessed server paths. */
function resolveFallMedia(host,name,standaloneBase){
 if(!host)return new URL(name,standaloneBase).href;
 if(typeof host.forEachContent!=='function'||typeof host.getMediaURLPath!=='function')throw Error('Edulos Dateizugriff ist hier nicht verfügbar.');
 const matches=[];
 host.forEachContent(c=>{if((c?.JSON?.type==='html_and_files'||c?.module?.name==='html_and_files')&&typeof c.JSON?.html==='string'&&c.JSON.html.includes('EDULO_WIDGET_KEY:freier-fall-ki-v1'))matches.push(c);});
 if(matches.length!==1)throw Error('Das zugehörige HTML-Modul ist nicht eindeutig auffindbar.');
 const files=(Array.isArray(matches[0].JSON.files)?matches[0].JSON.files:[]).filter(f=>{
  if(typeof f?.url!=='string')return false;
  let basename=f.url.split(/[?#]/,1)[0].split(/[\\/]/).pop();
  try{basename=decodeURIComponent(basename);}catch{}
  return basename===name;
 });
 if(files.length!==1)throw Error('Bitte die Datei '+name+' genau einmal im zugehörigen Edulo-Modul hochladen.');
 const url=host.getMediaURLPath(files[0].url);
 if(typeof url!=='string'||!url.trim()||/^\s*(?:javascript|data):/i.test(url))throw Error('Die Medienadresse ist ungültig.');
 return url;
}
function initFallMedia(root){
 let win=window,host=null;
 for(let i=0;i<8;i++){try{if(win.widget){host=win.widget;break;}if(win.parent===win)break;win=win.parent;}catch{break;}}
 for(const item of [{file:'fallvideo.mov',selector:'[data-fall-video]',link:'[data-video-link]',status:'[data-video-status]'},{file:'stroboskop-original.jpg',selector:'[data-fall-image]',link:'[data-image-link]',status:'[data-image-status]'}]){
  const media=root.querySelector(item.selector),status=root.querySelector(item.status),link=root.querySelector(item.link);
  try{const url=resolveFallMedia(host,item.file,document.baseURI);media.src=url;link.href=url;link.target='_blank';link.rel='noopener';
   media.addEventListener('error',()=>{status.textContent='Die Datei '+item.file+' konnte hier nicht angezeigt werden. Nutze den Link zum separaten Öffnen oder informiere deine Lehrkraft.';});
  }catch(error){status.textContent=error.message;link.hidden=true;}
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports={resolveFallMedia};

const D=LessonDomain;
let state,scores,loaded=false,busy=false,budgetBusy=false,currentUid=null,historyShown=8,transport='fetch';
const bridge=createEduloBridge({root,widgetId:'freier-fall-ki-v1',stateVersion:1,scoreCount:D.criteria(LESSON).length,
 hideFooter:true,fresh:()=>D.fresh(LESSON),validate:s=>D.valid(LESSON,s),
 onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}});
const money=value=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:4}).format(value/1e6);
function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
const visibleFeedback=h=>['questions-v1','questions-v2','questions-v3','questions-v4'].includes(h.feedbackStyle);
function groupedFeedback(h,question){
 const block=element('div'),text=visibleFeedback(h)?h.feedback.taskFeedback?.find(item=>item.id===question.id)?.feedback:null;
 if(h.reusedFrom?.[question.id])block.append(element('p','Unverändert · bisherige Rückmeldung','muted'));
 const clarifications=visibleFeedback(h)?(h.feedback.misconceptions||[]).filter(item=>{if(text?.includes(item.correction))return false;const quote=item.statement.trim(),variants=[quote];if([['„','“'],['"','"'],['«','»']].some(pair=>quote.startsWith(pair[0])&&quote.endsWith(pair[1]))&&quote.length>2)variants.push(quote.slice(1,-1));const matches=LESSON.questions.filter(q=>variants.some(v=>h.answers[q.id].includes(v)));return matches.length===1&&matches[0].id===question.id;}).map(item=>'Zu deiner Aussage „'+item.statement+'“: '+item.correction):[];
 const paragraph=element('p',[text||'Diese frühere Prüfung enthält noch keine zusammenhängende Rückmeldung zu dieser Aufgabe.',...clarifications].join(' '),'task-feedback');paragraph.dataset.taskFeedback=question.id;block.append(paragraph);
 const sources=new Set(question.criteria.filter(c=>h.feedback.criteria.find(r=>r.id===c.id)?.status!=='met').map(c=>c.source));
 return block;
}
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
function readOnlyView(){
 let win=window;
 for(let i=0;i<8;i++){try{const w=win.widget;if(w){const c=w.JSON||{},params=new URLSearchParams(win.location.search);return !!(w.isEditor||w.isFromEditor||Object.hasOwn(c,'remoteUserData')||Object.hasOwn(c,'remoteClassData')||params.has('input')||c.asTest===true||c.asTest==='1');}if(win.parent===win)break;win=win.parent;}catch{break;}}
 return false;
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
 const pending=active(),changed=state?D.plan(LESSON,state).checkedQuestionIds.length:LESSON.questions.length;
 q('[data-check]').disabled=!loaded||busy||!!pending||!changed||!!(state?.ownerUid&&state.ownerUid!==currentUid)||!LESSON.questions.every(item=>state?.answers[item.id].trim());
 q('[data-check]').textContent=busy?'HDBs KI-Assistent überprüft deine Antworten …':!changed?'Keine Änderungen zu prüfen':changed===LESSON.questions.length?'Alle Antworten prüfen':'Geänderte Antworten prüfen';
 q('[data-recover]').hidden=!pending;q('[data-recover]').disabled=!loaded||busy;
 for(const item of LESSON.questions)q('[data-count="'+item.id+'"]').textContent=(state?.answers[item.id].length||0)+' / 2000 Zeichen';
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
 q('[data-stale]').hidden=!last||JSON.stringify(last.answers)===JSON.stringify(state.answers);
 renderHistory();controls();
}
function renderHistory(){
 q('[data-history-label]').textContent='Deine Historie · '+state.history.length+' Prüfungen';const list=q('[data-history]');list.replaceChildren();
 if(!state.history.length){list.append(element('p','Noch keine Antworten eingereicht.'));return;}
 for(const h of [...state.history].reverse().slice(0,historyShown)){
  const details=element('details',undefined,'history-entry'),date=new Date(h.at);
  const label=Number.isNaN(date.getTime())?h.at:date.toLocaleString('de-DE');
  const checked=h.checkedQuestionIds?.length;
  details.append(element('summary',label+' · '+({pending:'Prüfung läuft',unknown:'Ausgang noch ungeklärt',done:'Feedback erhalten',failed:'Prüfung fehlgeschlagen'})[h.status]+(checked&&checked<LESSON.questions.length?' · '+checked+' Antwort'+(checked===1?'':'en')+' neu geprüft':'')));
  for(const item of LESSON.questions){details.append(element('h3',item.title),element('p',h.answers[item.id],'saved-answer'));if(h.feedback)details.append(groupedFeedback(h,item));}
  if(!h.feedback)details.append(element('p',h.message||'Noch keine Rückmeldung vorhanden.'));
  list.append(details);
 }
 if(historyShown<state.history.length){const button=element('button','Weitere Prüfungen anzeigen','secondary');button.type='button';button.addEventListener('click',()=>{historyShown+=8;renderHistory();});list.append(button);}
}
function errorMessage(data,status){
 const messages={400:'Die Anfrage konnte nicht verarbeitet werden.',402:'Dein verfügbares Guthaben oder Wochenlimit reicht für diese Prüfung nicht aus.',403:'Deine ID oder diese Lernumgebung ist noch nicht freigegeben.',409:'Die Anfrage ist bereits vorhanden oder das Konto ist noch durch eine ungeklärte Prüfung gesperrt.',429:'Dein Wochenlimit oder das Guthaben ist ausgeschöpft, oder es sind gerade zu viele Anfragen.',503:'Der KI-Dienst ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.'};
 const serviceMessages={account_frozen:'Dieses Konto ist f\u00fcr neue KI-Anfragen gesperrt. Bitte wende dich an deine Lehrkraft.',upstream_busy:'Der KI-Dienst hat ein Anfragelimit erreicht oder sein API-Guthaben ist ausgeschöpft. Bitte versuche es später erneut. Falls das Problem bestehen bleibt, informiere deine Lehrkraft.',upstream_rate_limited:'Der KI-Dienst erhält gerade zu viele Anfragen. Bitte warte kurz und versuche es erneut.',upstream_quota:'Das API-Guthaben oder API-Limit des KI-Dienstes ist ausgeschöpft. Bitte informiere deine Lehrkraft.',not_configured:'Die KI-Verbindung ist noch nicht vollständig eingerichtet.'};
 const code=typeof data?.error?.code==='string'&&/^[a-z_]{1,60}$/.test(data.error.code)?' Fehlercode: '+data.error.code+'.':'';
 return (Object.hasOwn(serviceMessages,data?.error?.code)?serviceMessages[data.error.code]:messages[status]||'Die Prüfung konnte nicht abgeschlossen werden.')+code;
}
async function handleResult(h,r){
 renderBudget(r.data.budget,r.data.charge);
 if(r.status===202){h.status='unknown';h.message='Die Prüfung läuft noch oder ihr Ausgang wird geklärt. Es wird kein zweiter KI-Aufruf gestartet.';message(h.message);return;}
 if(r.ok){
  const submitted=D.request(LESSON,h);
  if(r.data.taskId!==submitted.task.id||r.data.taskVersion!==submitted.task.version||r.data.requestId!==h.requestId||!D.validResponse(LESSON,h,r.data.feedback))throw Error('Das Ergebnis passt nicht zum vereinbarten Format.');
  D.finish(LESSON,state,h,r.data.feedback);h.feedbackStyle=['questions-v1','questions-v2','questions-v3','questions-v4'].includes(r.data.feedbackStyle)?r.data.feedbackStyle:'legacy';
  const checked=h.checkedQuestionIds?.length||LESSON.questions.length;
  message(checked<LESSON.questions.length?checked+' Antwort'+(checked===1?' wurde':'en wurden')+' neu geprüft. Unveränderte Antworten wurden übernommen.':'Rückmeldung erhalten. Überarbeite offene Aspekte und prüfe deine Antworten erneut.');
 }else{h.status=r.data.charge?.status==='reserved'?'unknown':'failed';h.message=errorMessage(r.data,r.status);message(h.message);}
}
async function check(){
 if(!loaded||busy||active())return;
 let uid;try{endpoint('/feedback');uid=syncIdentity();if(!uid)throw Error('Deine eigene Edulo-Anmelde-ID ist hier noch nicht verfügbar.');
  if(state.ownerUid&&state.ownerUid!==uid)throw Error('Dieser Lernstand gehört zu einem anderen Konto. Öffne die Aufgabe in deiner eigenen Ansicht neu.');
  if(!D.plan(LESSON,state).checkedQuestionIds.length){message('Deine Antworten sind unverändert. Es wurde keine neue KI-Prüfung gestartet.');controls();return;}
 }catch(error){message(error.message);return;}
 busy=true;controls();let h;
 try{
  h=D.begin(LESSON,state,crypto.randomUUID(),new Date().toISOString());state.ownerUid=uid;
  await bridge.save(state,D.scores(LESSON,state)); // Save exact submission in E1 BEFORE spending money.
  message(h.checkedQuestionIds.length===LESSON.questions.length?'Deine Antworten werden geprüft.':'Nur deine geänderten Antworten werden geprüft.');render();
 }catch(error){
  if(h){h.status='failed';h.message='Nicht an die KI gesendet: Speicherung konnte nicht bestätigt werden.';}
  busy=false;render();message('Die Eingaben konnten nicht sicher gespeichert werden. Es wurde keine KI-Anfrage gesendet. '+error.message);return;
 }
 try{
  const submitted=D.request(LESSON,h);
  const r=await api('/feedback',{uid,requestId:h.requestId,...submitted});
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
  loaded=bridge.getStatus().mode!=='editor'&&!readOnlyView();q('[data-controls]').disabled=!loaded;syncIdentity();render();
  if(!API_BASE)message('Die neue KI-Verbindung wird noch eingerichtet. Du kannst das Video ansehen und deine Antworten bereits verfassen.');
  else if(active())message('Eine frühere Prüfung ist noch offen. Rufe ihr Ergebnis ab; es wird keine neue Prüfung berechnet.');
  if(API_BASE&&currentUid)refreshBudget();
 }catch(error){message(error.message);}
}
for(const [i,item] of LESSON.questions.entries()){
 const section=element('section',undefined,'question');section.append(element('h2',(i+1)+'. '+item.title));
 const id='fall-answer-'+item.id,label=element('label','Deine Erläuterung');label.htmlFor=id;
 const textarea=element('textarea');textarea.id=id;textarea.dataset.answer=item.id;textarea.rows=5;textarea.maxLength=2000;textarea.placeholder='Erkläre mit eigenen Worten …';
 const counter=element('p','0 / 2000 Zeichen','count');counter.dataset.count=item.id;
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

function initFallWorksheet(root){
 'use strict';
 if(root.dataset.fallWorksheet)return;
 root.dataset.fallWorksheet='1';
 const times=['0','0,05','0,10','0,15','0,20','0,25','0,30','0,35'];
 const sheets=[];
 function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
 function number(value){const text=value.trim().replace(',','.');return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)?Number(text):NaN;}
 const graph=root.querySelector('[data-measurement-graph]');
 function draw(values){
  if(!graph)return;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 600 400');svg.setAttribute('role','img');svg.setAttribute('aria-label','Höhen-Zeit-Diagramm deiner eingegebenen Messwerte.');svg.classList.add('fall-graph');
  function shape(tag,attrs,text){const n=document.createElementNS(ns,tag);for(const [key,val] of Object.entries(attrs))n.setAttribute(key,String(val));if(text!==undefined)n.textContent=text;svg.append(n);return n;}
  const x=t=>64+t/.35*508,y=h=>346-h/1.4*308;
  for(let i=0;i<=7;i++){
   const h=i*.2,yy=y(h);shape('line',{x1:64,y1:yy,x2:572,y2:yy,class:'fall-grid'});
   shape('text',{x:53,y:yy+5,'text-anchor':'end'},h.toLocaleString('de-DE',{maximumFractionDigits:1}));
  }
  times.forEach((t,i)=>{const xx=x(i*.05);shape('line',{x1:xx,y1:38,x2:xx,y2:346,class:'fall-grid'});shape('text',{x:xx,y:369,'text-anchor':'middle'},t);});
  shape('path',{d:'M64 24V346H584',class:'fall-axis'});
  shape('text',{x:15,y:20},'h / m');shape('text',{x:574,y:395,'text-anchor':'end'},'t / s');
  let run=[];const runs=[];
  values.forEach((v,i)=>{const h=number(v);if(Number.isFinite(h)&&h>=0&&h<=1.5){run.push([x(i*.05),y(h)]);}else if(run.length){runs.push(run);run=[];}});if(run.length)runs.push(run);
  for(const points of runs){if(points.length>1)shape('polyline',{points:points.map(p=>p.join(',')).join(' '),class:'fall-measurement-line'});for(const [cx,cy] of points)shape('circle',{cx,cy,r:5,class:'fall-measurement-point'});}
  graph.replaceChildren(svg);
 }
 function heights(){return sheets.find(s=>s.backing.dataset.answer==='messung')?.read().hoehen_m||Array(8).fill('');}
 function install(id,columns,count){
  const backing=root.querySelector('textarea[data-answer="'+id+'"]');if(!backing)return;
  const question=backing.closest('.question');if(!question)return;
  backing.hidden=true;backing.classList.add('fall-backing');
  for(const label of question.querySelectorAll('label'))if(label.htmlFor===backing.id)label.hidden=true;
  const counter=question.querySelector('[data-count="'+id+'"]');if(counter)counter.hidden=true;
  const box=el('div',undefined,'fall-worksheet'),table=el('table',undefined,'fall-table'),head=el('thead'),headRow=el('tr'),body=el('tbody');
  const labels=[id==='messung'?'t / s':'Zeitabschnitt / s',...columns.map(c=>c.label)];
  for(const text of labels){const th=el('th',text);th.scope='col';headRow.append(th);}head.append(headRow);table.append(head,body);
  const fields=columns.map(()=>[]);
  for(let i=0;i<count;i++){
   const row=el('tr'),time=id==='messung'?times[i]:times[i]+' – '+times[i+1],th=el('th',time);th.scope='row';row.append(th);
   columns.forEach((column,j)=>{const td=el('td'),input=el('input');input.type='text';input.inputMode='decimal';input.autocomplete='off';input.maxLength=16;input.setAttribute('aria-label',column.label+' bei '+time+' Sekunden');input.dataset.fallCell=column.key;input.dataset.row=String(i);fields[j].push(input);td.append(input);row.append(td);});body.append(row);
  }
  const explanationLabel=el('label','Deine Erläuterung', 'fall-explanation-label'),explanation=el('textarea');explanation.rows=3;explanation.maxLength=1300;explanation.placeholder='Beschreibe deine Beobachtungen und deinen Rechenweg …';explanationLabel.append(explanation);
  box.append(table,explanationLabel);backing.before(box);
  let last;
  const controls=[...fields.flat(),explanation];
  function read(){const data={};columns.forEach((c,j)=>data[c.key]=fields[j].map(n=>n.value));if(id==='geschwindigkeit')data.hoehen_m=heights();data.erlaeuterung=explanation.value;return data;}
  function disabled(){const locked=backing.disabled||backing.readOnly||backing.matches(':disabled');controls.forEach(n=>n.disabled=locked);return locked;}
  function sync(){
   disabled();if(last===backing.value)return;
   last=backing.value;let data;try{data=JSON.parse(last);}catch{data={erlaeuterung:last};}
   if(!data||typeof data!=='object')data={};
   columns.forEach((c,j)=>fields[j].forEach((n,i)=>{const v=Array.isArray(data[c.key])&&typeof data[c.key][i]==='string'?data[c.key][i]:'';if(n.value!==v)n.value=v;}));
   const text=typeof data.erlaeuterung==='string'?data.erlaeuterung:'';if(explanation.value!==text)explanation.value=text;
   if(id==='messung')draw(fields[0].map(n=>n.value));
  }
  function save(){
   let serialized=JSON.stringify(read());
   while(serialized.length>2000&&explanation.value.length){explanation.value=explanation.value.slice(0,-1);serialized=JSON.stringify(read());}
   if(serialized.length>2000)return;
   backing.value=serialized;last=serialized;backing.dispatchEvent(new Event('input',{bubbles:true}));
   if(id==='messung'){draw(fields[0].map(n=>n.value));const next=sheets.find(s=>s.backing.dataset.answer==='geschwindigkeit');if(next&&!next.disabled())next.save();}
  }
  box.addEventListener('input',event=>{
   if(!controls.includes(event.target))return;if(disabled()){last=undefined;sync();return;}
   save();
  });
  backing.addEventListener('input',sync);backing.addEventListener('change',sync);sheets.push({sync,backing,read,save,disabled});sync();
 }
 install('messung',[{key:'hoehen_m',label:'Höhe h / m'}],8);
 install('geschwindigkeit',[{key:'strecken_m',label:'Fallstrecke Δs / m'},{key:'geschwindigkeiten_ms',label:'Durchschnitt v̄ / (m/s)'}],7);
 if(!sheets.some(s=>s.backing.dataset.answer==='messung'))draw([]);
 const observer=new MutationObserver(()=>sheets.forEach(s=>s.sync()));observer.observe(root,{attributes:true,subtree:true,attributeFilter:['disabled','readonly']});
 const timer=setInterval(()=>{if(!root.isConnected){clearInterval(timer);observer.disconnect();return;}sheets.forEach(s=>s.sync());},500);
}

initFallMedia(root);initFallWorksheet(root);
