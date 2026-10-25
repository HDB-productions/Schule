// Read-only utility: no bridge.load/save, E1/E2, localStorage or fetch.
// Confirmed by the user's Edulo diagnostic on 2026-10-25:
// user.uid is the public login ID; user.name is the requested username.
// user.ID / user.id are internal numbers; activations are historical records.
const LOGIN_ID=/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i;
let identity = {id:'', username:''}, currentStatus = '', footer = null, footerWidget = null;
function scalar(value) {
  return typeof value === 'string' ? value.trim() : '';
}
function host() {
  // Choose the closest widget. Never combine identities from different frames.
  const seen = new Set();
  let win = window;
  for (let i=0; i<8 && !seen.has(win); i++) {
    seen.add(win);
    try {
      if (win.widget && typeof win.widget === 'object') return {win, widget:win.widget};
      if (win.parent === win) break;
      win = win.parent;
    } catch { break; }
  }
  return null;
}
function show(next, status) {
  if (identity.id !== next.id || identity.username !== next.username) {
    identity = next;
    q('[data-copy-status]').textContent = '';
    for (const key of ['id','username']) {
      q('[data-value="'+key+'"]').value = identity[key];
      q('[data-copy="'+key+'"]').disabled = !identity[key];
    }
  }
  for (const key of ['id','username']) q('[data-value="'+key+'"]').placeholder = 'Nicht verfügbar';
  if (status !== currentStatus) { currentStatus=status; q('[data-status]').textContent=status; }
}
function restoreFooter() { try { footer?.restore(); } catch {} footer=null; footerWidget=null; }
function sync() {
  if (!root.isConnected) { stop(); return; }
  const found=host(), w=found?.widget;
  let status='', next={id:'',username:''};
  const teacher=w?.user && [w.user.teacher,w.user.Teacher].some(v=>v===true||String(v)==='1');
  if (w?.isEditor || w?.isFromEditor) status='In der Bearbeitungsansicht werden keine persönlichen Zugangsdaten angezeigt. Öffne die Aufgabe mit deinem Schülerkonto.';
  else if (w?.JSON?.remoteUserData) status='In der Ansicht fremder Antworten werden keine Zugangsdaten angezeigt. Öffne deine eigene Aufgabe.';
  else if (teacher) status='Du bist als Lehrkraft angemeldet. Die Schülerinnen und Schüler sehen hier ihre eigenen Zugangsdaten.';
  else if (w?.user) {
    const uid=scalar(w.user.uid);
    next.id=LOGIN_ID.test(uid)?uid:'';
    next.username=scalar(w.user.name);
    status=next.id && next.username ? 'Das sind die Daten deines aktuell angemeldeten Kontos.' : next.id ? 'Deine ID ist verfügbar. Edulo übergibt hier keinen Benutzernamen.' : 'Edulo übergibt hier keine gültige Anmelde-ID im Format xx-xxxxxx-xxxxxx-xxxxxx. Prüfe, ob du mit deinem Schülerkonto angemeldet bist.';
  } else status=w ? 'Dein Edulo-Konto wird geladen …' : 'Öffne dieses Widget in Edulo mit deinem Schülerkonto. Hier im Browser sind keine Kontodaten verfügbar.';
  if (footer && (footerWidget!==w || !footer.isCurrent() || w?.isEditor || w?.isFromEditor || w?.JSON?.remoteUserData || w?.JSON?.asTest==='1')) restoreFooter();
  if (w && !footer && !w.isEditor && !w.isFromEditor && !w.JSON?.remoteUserData && w.JSON?.asTest!=='1') {
    try { footer=createEduloFooter({root,widget:w}); footerWidget=w; footer.setHidden(); } catch { restoreFooter(); }
  }
  if (footer) try { footer.setHidden(); } catch { restoreFooter(); }
  show(next,status);
}
for (const button of root.querySelectorAll('[data-copy]')) button.addEventListener('click',async()=>{
  sync();
  const key=button.dataset.copy, value=identity[key], input=q('[data-value="'+key+'"]');
  if (!value) return;
  let copied=false;
  function legacyCopy() {
    input.focus(); input.select(); input.setSelectionRange(0,input.value.length);
    try { return document.execCommand('copy'); } catch { return false; }
  }
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try { await navigator.clipboard.writeText(value); copied=true; } catch { copied=legacyCopy(); }
  } else copied=legacyCopy();
  q('[data-copy-status]').textContent=copied ? (key==='id'?'ID':'Benutzername')+' kopiert. Du kannst '+(key==='id'?'sie':'ihn')+' jetzt einfügen.' : 'Automatisches Kopieren ist hier gesperrt. Der Text ist markiert: Halte ihn gedrückt und wähle „Kopieren“ (am Computer: Strg+C).';
  if (!copied) { input.focus(); input.select(); input.setSelectionRange(0,input.value.length); }
});
let timer=setInterval(sync,500);
function stop() { clearInterval(timer); restoreFooter(); window.removeEventListener('pageshow',resume); window.removeEventListener('pagehide',suspend); }
function suspend() { clearInterval(timer); restoreFooter(); }
function resume() { clearInterval(timer); sync(); timer=setInterval(sync,500); }
window.addEventListener('pagehide',suspend);
window.addEventListener('pageshow',resume);
sync();
