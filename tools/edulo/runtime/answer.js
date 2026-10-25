// Optional plain-text answer bridge. No extra scores, browser storage or network.
// Confirmed account fields: user.uid, user.name and user.email.
function createEduloAnswerBridge({root, fieldIds=['e1_text_input','e1_input'], emailFieldIds=['e3_text_input','e3_input']}) {
  let displayData=null;
  const hidden=new Map();
  const uidPattern=/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i;
  const text=value=>typeof value==='string'?value.trim():'';
  const yes=value=>value===true || value===1 || value==='1';
  function restoreOne(el,old) {
    el.hidden=old.hidden;
    if(old.display)el.style.setProperty('display',old.display,old.priority);
    else el.style.removeProperty('display');
    hidden.delete(el);
  }
  function restore() {for(const [el,old] of hidden)restoreOne(el,old);}
  function hideFields(fields) {
    const targets=fields.map(field=>{
      const doc=field.ownerDocument;
      const safe=el=>el && el!==doc.body && el!==doc.documentElement && el.contains(field) && !el.contains(root) && !el.querySelector('iframe') && [...el.querySelectorAll('input,textarea,select,button')].every(f=>f===field);
      const module=doc.getElementById((field.id || field.name).split('_')[0]);
      const container=field.closest?.('.inputcontainer');
      return safe(module)?module:safe(container)?container:field;
    });
    for(const [el,old] of hidden)if(!targets.includes(el))restoreOne(el,old);
    for(const target of targets){
      if(!hidden.has(target))hidden.set(target,{hidden:target.hidden,display:target.style.getPropertyValue('display'),priority:target.style.getPropertyPriority('display')});
      target.hidden=true;target.style.setProperty('display','none','important');
    }
  }
  function parse(value) {
    const match=/^UserID: ([a-z0-9]{2}(?:-[a-z0-9]{6}){3}) \| Benutzername: (.+)$/i.exec(value);
    return match?{uid:match[1],name:match[2]}:null;
  }
  function locate() {
    let win=root.ownerDocument.defaultView;
    for(let i=0;i<8;i++)try{
      if(win.widget && typeof win.widget==='object')return {win,widget:win.widget};
      if(win.parent===win)break;
      win=win.parent;
    }catch{break;}
    return null;
  }
  function write(field,value) {
    if(!field.isConnected)throw Error('Ein Antwortfeld wurde während der Speicherung ersetzt.');
    const fw=field.ownerDocument.defaultView;
    const proto=field.tagName==='TEXTAREA'?fw.HTMLTextAreaElement.prototype:fw.HTMLInputElement.prototype;
    const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;
    if(!setter)throw Error('Nativer Zugriff auf das Antwortfeld fehlt.');
    setter.call(field,value);
    for(const type of ['input','change'])field.dispatchEvent(new fw.Event(type,{bubbles:true}));
    if(String(field.value)!==value)throw Error('Edulo hat einen Antworttext verändert. Bitte die Feldlänge prüfen.');
  }
  function sync() {
    displayData=null;
    if(!root.isConnected){restore();throw Error('Widget wurde entfernt.');}
    const found=locate();
    if(!found){restore();return {data:null,text:'Öffne diese Seite in Edulo. Hier werden keine Daten gespeichert.'};}
    const {win,widget:w}=found,config=w.JSON || {};
    const query=new URLSearchParams(win.location.search);
    const editor=!!w.isEditor || !!w.isFromEditor || win.document.body?.classList.contains('editor') || query.get('editor')==='1' || query.get('fromeditor')==='1';
    const remoteUser=Object.prototype.hasOwnProperty.call(config,'remoteUserData');
    const remoteClass=Object.prototype.hasOwnProperty.call(config,'remoteClassData');
    const remoteUrl=!!query.get('input');
    const remote=remoteUser || remoteClass || remoteUrl;
    const teacher=yes(w.isTeacher) || yes(w.user?.teacher) || yes(w.user?.Teacher);
    const blocked=editor || remote || teacher || yes(config.asTest);
    if(blocked)restore();
    const uid=text(w.user?.uid),name=text(w.user?.name).replace(/[\r\n]+/g,' ');
    // Missing field != explicitly empty address. Unknown data must not erase E3.
    const email=typeof w.user?.email==='string'?text(w.user.email):null;
    const ownData=uidPattern.test(uid) && name?{uid,name,email}:null;
    if(!editor && !remote && !yes(config.asTest))displayData=ownData;
    const doc=w.contentWrapper?.[0]?.ownerDocument || win.document,wrapper=w.contentWrapper?.[0];
    const inputs=[...doc.querySelectorAll('input,textarea')].filter(el=>!root.contains(el) && (el.tagName==='TEXTAREA' || el.type==='text') && (!wrapper || wrapper.contains(el)));
    function one(ids,label){
      const matches=inputs.filter(el=>ids.some(id=>el.id===id || el.name===id));
      if(matches.length>1){restore();throw Error('Mehrere passende Antwortfelder für '+label+' gefunden. Bitte die Modulzuordnung prüfen.');}
      return matches[0];
    }
    const field=one(fieldIds,'E1'),emailField=one(emailFieldIds,'E3');
    if(field && field===emailField){restore();throw Error('E1 und E3 müssen verschiedene Antwortfelder sein.');}
    const raw=field?String(field.value):'',emailRaw=emailField?String(emailField.value):'';
    const saved=parse(raw);
    if(saved)saved.email=emailField?emailRaw.trim():null;
    if(!blocked)hideFields([field,emailField].filter(Boolean));
    if(blocked){
      if(editor)return {data:null,text:'Bearbeitungsansicht: keine Speicherung.'};
      const reasons=[];
      if(remoteUser)reasons.push('fremde Antworten / remoteUserData');
      if(remoteClass)reasons.push('Klassenübersicht / remoteClassData');
      if(remoteUrl)reasons.push('fremde Bearbeitung / input-URL');
      if(teacher)reasons.push('Lehrerkonto');
      if(yes(config.asTest))reasons.push('Prüfungsmodus / asTest');
      displayData=remote?saved:ownData;
      return {data:displayData,text:'Leseansicht – Grund: '+reasons.join(', ')+'. '+(remote?(saved?'Gespeicherte Kontodaten dieser Bearbeitung.':'Noch keine Kontodaten im Antwortfeld gespeichert.'):'Eigene Kontodaten werden angezeigt.')+' Keine automatische Speicherung.'};
    }
    if(!ownData)return {data:null,text:'Warte auf die Anmelde-ID und den Benutzernamen von Edulo.'};
    const data=ownData;displayData=data;
    if(!field)return {data,text:'Das Text-Antwortfeld E1 fehlt. Bitte vor diesem HTML-Modul ein Text-Antwortfeld einfügen.'};
    if(w.isReady===false || w.initPerformed===false)return {data,text:'Warte, bis Edulo die Aufgabe und die Antworten geladen hat.'};
    if(raw.trim() && (!saved || saved.uid!==uid))return {data,text:'Das Antwortfeld enthält bereits andere Daten und wird nicht überschrieben.'};
    // Without an owning E1 record, do not attach a pre-existing unrelated email.
    if(!saved && emailRaw.trim() && (email===null || emailRaw.trim()!==email))return {data,text:'E3 enthält bereits andere Daten ohne zugehörige UserID. Die Antwortfelder werden nicht überschrieben.'};
    const value='UserID: '+uid+' | Benutzername: '+name;
    const changes=[];
    if(raw!==value)changes.push({field,value,label:'E1'});
    if(emailField && email!==null && emailRaw!==email)changes.push({field:emailField,value:email,label:'E3'});
    // Preflight both fields before the first native event can save either one.
    for(const change of changes){
      if(change.field.disabled || change.field.readOnly)return {data,text:'Das Edulo-Antwortfeld '+change.label+' ist gesperrt. Keine Speicherung.'};
      if(change.field.maxLength>=0 && change.value.length>change.field.maxLength)throw Error('Das Antwortfeld '+change.label+' ist zu kurz. Bitte die Zeichenbegrenzung entfernen.');
    }
    if(changes.length){
      const storage=typeof w.findModule==='function'?w.findModule('save_load'):null;
      if(typeof storage?.save!=='function' || storage.JSON?.active==='false' || storage.JSON?.active===false)throw Error('Edulos Antwortspeicherung ist nicht aktiv. Bitte die Speichereinstellung der Aufgabe prüfen.');
      for(const change of changes)write(change.field,change.value);
    }
    const info=!emailField?' Das Text-Antwortfeld E3 für die Mailadresse fehlt noch.':email===null?' Edulo übergibt hier keine Mailadresse; E3 bleibt unverändert.':!email?' Keine Mailadresse hinterlegt; E3 ist leer.':'';
    return {data,text:(changes.length?'Kontodaten automatisch an die Edulo-Antwortfelder übergeben.':'Die Kontodaten stehen in den Edulo-Antwortfeldern.')+info};
  }
  return {sync,restore,getDisplay:()=>displayData};
}
