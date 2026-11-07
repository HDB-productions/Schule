// Transport adapted from the current Edulo Freitext lesson; no automatic paid retries.
const API_BASE='https://edulomodularai.hildebrandt.workers.dev';
const money=value=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:4}).format(value/1e6);
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

function errorMessage(data,status){
 const messages={400:'Die Anfrage konnte nicht verarbeitet werden.',402:'Dein verfügbares Guthaben oder Wochenlimit reicht für diese Prüfung nicht aus.',403:'Deine ID oder diese Lernumgebung ist noch nicht freigegeben.',409:'Die Anfrage ist bereits vorhanden oder das Konto ist noch durch eine ungeklärte Prüfung gesperrt.',429:'Dein Wochenlimit oder das Guthaben ist ausgeschöpft, oder es sind gerade zu viele Anfragen.',503:'Der KI-Dienst ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.'};
 const serviceMessages={account_frozen:'Dieses Konto ist f\u00fcr neue KI-Anfragen gesperrt. Bitte wende dich an deine Lehrkraft.',upstream_busy:'Der KI-Dienst hat ein Anfragelimit erreicht oder sein API-Guthaben ist ausgeschöpft. Bitte versuche es später erneut. Falls das Problem bestehen bleibt, informiere deine Lehrkraft.',upstream_rate_limited:'Der KI-Dienst erhält gerade zu viele Anfragen. Bitte warte kurz und versuche es erneut.',upstream_quota:'Das API-Guthaben oder API-Limit des KI-Dienstes ist ausgeschöpft. Bitte informiere deine Lehrkraft.',not_configured:'Die KI-Verbindung ist noch nicht vollständig eingerichtet.'};
 const code=typeof data?.error?.code==='string'&&/^[a-z_]{1,60}$/.test(data.error.code)?' Fehlercode: '+data.error.code+'.':'';
 return (Object.hasOwn(serviceMessages,data?.error?.code)?serviceMessages[data.error.code]:messages[status]||'Die Prüfung konnte nicht abgeschlossen werden.')+code;
}
