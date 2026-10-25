// Diagnostic only: no network, storage, save/check calls, or arbitrary object crawling.
// Values come only from explicit user/account roots and selected widget fields.
const VERSION='2.0.0';
const PUBLIC_ID=/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i;
const SECRET=/(?:passw|passwd|pwd|secret|token|session|cookie|auth|credential|api.?key|private.?key|recovery|reset.?code|hash|salt|^pin$|^key$)/i;
const FOREIGN=/(?:students|pupils|classmates|members|contacts|classes|groups|remoteUserData|remoteClassData)/i;
const LIMITS={depth:5,keys:100,array:12,string:600,messages:30,nodes:1200,totalString:36000};
let budget={nodes:LIMITS.nodes,chars:LIMITS.totalString};
let watched=new Map(), captured=[], messageKinds=new Map(), lastFingerprint='', stopped=false, timer=null;
let accountEpoch=0, previousAccount=null;
function own(object,key) { try {const d=Object.getOwnPropertyDescriptor(object,key);return d&&'value' in d?d.value:undefined;}catch{return undefined;} }
function shape(value) {
  const type=value===null?'null':Array.isArray(value)?'array':typeof value;
  const out={type};
  if(type==='string') {out.length=value.length;out.matchesRequestedIdFormat=PUBLIC_ID.test(value.trim());if(value.includes('-'))out.segmentLengths=value.split('-').slice(0,10).map(s=>s.length);}
  if(type==='array')out.length=value.length;
  return out;
}
function clean(value,key='',depth=0,seen=new Set()) {
  if(--budget.nodes<0)return '[report budget reached]';
  if(SECRET.test(key)||FOREIGN.test(key))return {masked:true,...shape(value)};
  if(value===null||typeof value==='boolean')return value;
  if(typeof value==='number')return Number.isFinite(value)?value:String(value);
  if(typeof value==='string') {
    // URL query/fragment data may contain credentials even in harmlessly named fields.
    if(/^(?:https?:|file:)/i.test(value))return {url:locationInfo(value),...shape(value)};
    if(/(?:bearer\s+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.)/i.test(value))return {masked:true,...shape(value)};
    const length=Math.min(LIMITS.string,Math.max(0,budget.chars));budget.chars-=Math.min(value.length,length);
    return value.length>length?{prefix:value.slice(0,length),truncated:true,...shape(value)}:value;
  }
  if(typeof value!=='object')return {type:typeof value};
  if(seen.has(value))return '[circular]';
  if(depth>=LIMITS.depth)return {truncated:true,...shape(value)};
  seen.add(value);
  let out;
  if(Array.isArray(value))out=value.slice(0,Math.min(LIMITS.array,Math.max(0,budget.nodes))).map(v=>clean(v,key,depth+1,seen));
  else {
    out=Object.create(null);
    try {for(const name of Object.keys(value).slice(0,LIMITS.keys)){
      if(budget.nodes<=0){out['[truncated]']='Report budget reached';break;}
      const descriptor=Object.getOwnPropertyDescriptor(value,name);
      out[name]=descriptor&&'value' in descriptor?clean(descriptor.value,name,depth+1,seen):'[accessor not read]';
    }}catch {out.error='Object not readable';}
  }
  seen.delete(value);return out;
}
function keyTypes(object) {
  if(!object||typeof object!=='object')return shape(object);
  try{return Object.keys(object).slice(0,LIMITS.keys).map(key=>({key,...shape(own(object,key))}));}catch{return {error:'not readable'};}
}
function locationInfo(value) {
  try {const url=new URL(value);return {origin:url.origin,path:url.pathname,queryKeys:[...new Set(url.searchParams.keys())],hasFragment:!!url.hash};}catch{return {unavailable:true};}
}
function windows() {
  const out=[],seen=new Set();let win=window;
  for(let depth=0;depth<8&&!seen.has(win);depth++) {
    seen.add(win);
    try {void win.document;out.push({win,label:depth===0?'self':'parent['+depth+']'});if(win.parent===win)break;win=win.parent;}
    catch {out.push({label:'parent['+depth+']',blocked:true});break;}
  }
  return out;
}
function identityStamp(list) {
  // Detect account object replacement/logout before reusing captured user messages.
  for(const {win} of list)if(win){const w=own(win,'widget');if(w&&typeof w==='object')return own(w,'user');}
  return undefined;
}
function inspect({win,label,blocked}) {
  if(blocked)return {frame:label,accessible:false};
  const out={frame:label,accessible:true,location:locationInfo(win.location.href),widgetPresent:false};
  const w=own(win,'widget');
  if(w&&typeof w==='object') {
    out.widgetPresent=true;out.widgetKeys=keyTypes(w);
    out.widgetUser=clean(own(w,'user'));out.widgetUserFields=keyTypes(own(w,'user'));
    out.widgetIdentityFields=Object.create(null);
    for(const key of ['userID','userId','GUID','guid','username','userName','Username','isTeacher','isEditor','isFromEditor']) {
      const value=own(w,key);if(value!==undefined)out.widgetIdentityFields[key]=clean(value,key);
    }
    const config=own(w,'JSON');out.widgetConfigKeys=keyTypes(config);
    out.view={isEditor:own(w,'isEditor')===true,isFromEditor:own(w,'isFromEditor')===true,hasRemoteUserData:!!own(config,'remoteUserData'),hasRemoteClassData:!!own(config,'remoteClassData')};
  }
  out.accountGlobals=Object.create(null);
  for(const key of ['user','currentUser','loggedInUser','account']) {
    const value=own(win,key);if(value&&typeof value==='object')out.accountGlobals[key]=clean(value,key);
  }
  return out;
}
function record(event,label,win) {
  if(!root.isConnected)return;
  // Store metadata for general messages, values only for the known user| protocol.
  let kind=typeof event.data;
  if(typeof event.data==='string') {
    if(event.data.startsWith('user|'))kind='user|';
    else if(event.data.startsWith('server|'))kind='server|';
    else if(/^(?:WIDGET[A-Z_]+)(?:\s|\||$)/.test(event.data))kind=event.data.match(/^WIDGET[A-Z_]+/)[0].slice(0,48);
    else if(['init','init&check','check_solution','finish_test'].includes(event.data))kind=event.data;
    else kind='other string (content omitted)';
  }
  if(messageKinds.size<30||messageKinds.has(kind))messageKinds.set(kind,(messageKinds.get(kind)||0)+1);
  if(typeof event.data==='string'&&event.data.startsWith('user|')) {
    const source=event.source===win.parent?'parent':event.source===win?'self':event.source===null?'native-or-unknown':'other';
    if(source==='other')return;
    try {
      const raw=JSON.parse(event.data.slice(5));
      budget={nodes:LIMITS.nodes,chars:LIMITS.totalString};
      const user=clean(raw);
      const entry={frame:label,source,accountEpoch,user,fields:keyTypes(raw)};
      // Only keep current, bounded observations. Never retain raw messages.
      if(!captured.some(x=>JSON.stringify(x)===JSON.stringify(entry)))captured.push(entry);
      captured=captured.slice(-LIMITS.messages);
    }catch {captured.push({frame:label,error:'user| payload was not valid JSON',accountEpoch});}
  }
}
function refresh(force=false) {
  if(!root.isConnected){stop();return;}
  const list=windows(), active=new Set(list.filter(x=>x.win).map(x=>x.win));
  const stamp=identityStamp(list);
  if(previousAccount!==stamp){captured=[];accountEpoch++;previousAccount=stamp;}
  for(const [win,handler] of watched)if(!active.has(win)){win.removeEventListener('message',handler);watched.delete(win);}
  for(const {win,label} of list)if(win&&!watched.has(win)){const fn=e=>record(e,label,win);win.addEventListener('message',fn);watched.set(win,fn);}
  budget={nodes:LIMITS.nodes,chars:LIMITS.totalString};
  const frames=list.map(inspect);
  const report={probe:'edulo-account-identity',version:VERSION,scope:'Own reachable account objects and user| messages; no cookies, browser storage, network, class lists or saved answers.',requestedIdFormat:'xx-xxxxxx-xxxxxx-xxxxxx',warning:'widget.user.ID may be an internal number, not the requested login ID.',frames,userMessages:captured,messageTypes:[...messageKinds].map(([type,count])=>({type,count})),limits:LIMITS};
  const encoded=JSON.stringify(report,null,2);
  // Keep the selection stable while the user selects/copies the report.
  if((force||document.activeElement!==q('[data-report]'))&&lastFingerprint!==encoded){q('[data-report]').value=encoded;lastFingerprint=encoded;}
  if(force||!q('[data-status]').dataset.copied)q('[data-status]').textContent=frames.some(f=>f.widgetPresent)?'Edulo-Objekt gefunden. Du kannst den JSON-Bericht kopieren.':'Noch kein Edulo-Objekt erreichbar. Bitte in Edulo öffnen; der Bericht aktualisiert sich automatisch.';
}
q('[data-refresh]').addEventListener('click',()=>{q('[data-status]').dataset.copied='';refresh(true);});
q('[data-copy]').addEventListener('click',async()=>{
  refresh(true);const area=q('[data-report]'),text=area.value;let copied=false;
  function fallback(){area.focus();area.select();area.setSelectionRange(0,area.value.length);try{return document.execCommand('copy');}catch{return false;}}
  if(navigator.clipboard?.writeText&&window.isSecureContext){try{await navigator.clipboard.writeText(text);copied=true;}catch{copied=fallback();}}else copied=fallback();
  q('[data-status]').dataset.copied='1';
  q('[data-status]').textContent=copied?'JSON kopiert. Füge ihn jetzt in unseren Chat ein.':'Der Bericht ist markiert. Bitte manuell kopieren: Strg+C oder gedrückt halten → Kopieren.';
});
function suspend(){clearInterval(timer);for(const [win,handler] of watched)try{win.removeEventListener('message',handler);}catch{}watched.clear();}
function resume(){if(stopped)return;refresh();clearInterval(timer);timer=setInterval(refresh,750);}
function stop(){stopped=true;suspend();captured=[];window.removeEventListener('pagehide',suspend);window.removeEventListener('pageshow',resume);}
window.addEventListener('pagehide',suspend);window.addEventListener('pageshow',resume);
refresh();timer=setInterval(refresh,750);
