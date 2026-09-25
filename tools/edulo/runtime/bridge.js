// Inlined by build.cjs. No global variables, network requests or generated messages.
const createEduloBridge = (() => {
  const PREFIX = 'EDULO2:';
  const COLORS = ['gray', 'green', 'yellow', 'red'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  function encode(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return PREFIX + btoa(binary);
  }
  function decode(raw) {
    if (!raw.startsWith(PREFIX)) throw Error('Unbekannter Speicherstand. Originaldaten bleiben erhalten.');
    return JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(Uint8Array.from(atob(raw.slice(PREFIX.length)), c => c.charCodeAt(0))));
  }
  return function create(options) {
    const {root, widgetId, fresh, validate, onStatus = () => {}} = options;
    if (!root || !/^[a-z][a-z0-9-]+$/.test(widgetId) || typeof fresh !== 'function' || typeof validate !== 'function') throw Error('Ungültige Bridge-Konfiguration.');
    const version = options.stateVersion || 1;
    const query = new URLSearchParams(location.search);
    const count = options.scoreCount ?? 20;
    if (!Number.isInteger(count) || count < 1 || count > 100) throw Error('Ungültige Punktezahl.');
    const stateId = options.stateId || query.get('STATE_ID') || '';
    const prefix = options.scorePrefix || query.get('SCORE_PREFIX') || 'e2_cloze_text_input_';
    const show = options.showFields ?? (query.get('SHOW_FIELDS') === '1');
    const localKey = 'schule-edulo:' + widgetId;
    const hidden = new Map(), listeners = [];
    let mode = '', host = null, fields = [], moduleLink = null, lastRaw = '', current = null;
    let ready = false, disposed = false, pending = null, timer = null, removal = null;
    let hideFooter = options.hideFooter ?? true, footer = null, footerObserver = null, footerError = '';
    function restoreFooter() {
      footerObserver?.disconnect(); footerObserver = null;
      footer?.restore(); footer = null; footerError = '';
    }
    function syncFooter() {
      if (!ready || disposed || !root.isConnected || !hideFooter || mode !== 'edulo' || editor() || moduleLink?.w.JSON?.asTest === '1' || moduleLink?.w.JSON?.remoteUserData) { restoreFooter(); return; }
      const w = moduleLink?.w, doc = w?.contentWrapper?.[0]?.ownerDocument;
      if (!doc) { footerError = 'Edulo-Inhaltsbereich fehlt.'; return; }
      if (!footerObserver) {
        footerObserver = new MutationObserver(syncFooter);
        footerObserver.observe(doc.documentElement, {childList: true, subtree: true});
      }
      try {
        if (footer && !footer.isCurrent()) { footer.restore(); footer = null; }
        if (!footer) footer = createEduloFooter({root, widget: w});
        footer.setHidden(); footerError = '';
      } catch (e) { footerError = e.message; }
    }
    function setFooterHidden(value) {
      if (typeof value !== 'boolean') throw Error('hideFooter erwartet true oder false.');
      hideFooter = value; syncFooter();
    }
    const status = (text, error = false) => onStatus({text, error, mode});
    function docs() {
      const out = [];
      for (const win of [window, window.parent, window.top]) try {
        if (!out.some(x => x.doc === win.document)) out.push({win, doc: win.document});
      } catch {} // A blocked parent is never replaced by localStorage in Edulo mode.
      return out;
    }
    function editor() {
      return docs().some(({win, doc}) => win.widget?.isEditor === true || doc.body?.classList.contains('editor') || new URLSearchParams(win.location.search).get('editor') === '1');
    }
    function matches(id) {
      return docs().flatMap(({doc}) => [...doc.querySelectorAll('input,textarea')].filter(el => !root.contains(el) && (el.id === id || el.name === id) && (el.tagName === 'TEXTAREA' || ['text', 'hidden', 'number'].includes(el.type))));
    }
    function one(id) {
      const found = [...new Set(matches(id))];
      if (found.length > 1) throw Error('Mehrdeutige Edulo-Feldzuordnung: ' + id);
      return found[0] || null;
    }
    function resolve() {
      const candidates = stateId ? [one(stateId)].filter(Boolean) : [...new Set(['e1_input', 'e1_text_input', 'e1_cloze_text_input_1', 'e1'].flatMap(matches))];
      if (candidates.length > 1) throw Error('Mehrere E1-Felder. STATE_ID festlegen.');
      const h = candidates[0] || null, f = Array.from({length: count}, (_, i) => one(prefix + (i + 1)));
      if (h && f.includes(h)) throw Error('Speicher und Punkte dürfen nicht dasselbe Feld sein.');
      return {h, f};
    }
    function bridge() {
      const links = [], seen = new Set();
      for (const {win} of docs()) {
        const w = win.widget;
        if (!w || seen.has(w) || typeof w.findModule !== 'function' || typeof w.forEachContent !== 'function') continue;
        seen.add(w);
        const mod = w.findModule('cloze_text'), storage = w.findModule('save_load');
        if (!mod || !storage || !['loadUserInput', 'saveUserInput', 'checkSingleClozeInput'].every(k => typeof mod[k] === 'function') || typeof storage.save !== 'function') continue;
        if (storage.JSON?.active === 'false' || w.JSON?.remoteUserData || (w.JSON?.asTest === '1' && w.testData?.d && w.testData?.ds)) throw Error('Diese Edulo-Ansicht erlaubt keine normale Speicherung.');
        w.forEachContent(content => {
          if (content.module !== mod || !Array.isArray(content.clozeInputs)) return true;
          const groups = fields.map(field => content.clozeInputs.filter(item => item.inputElement?.[0] === field));
          if (groups.every(g => g.length === 1)) {
            const items = groups.map(g => g[0]);
            if (content.JSON?.nocheck === 'true' || items.some(i => i.JSON.predefined === 'true' || i.JSON.connected === 'true' || i.JSON.unchecked === 'true')) throw Error('E2 braucht normale, unabhängige Lücken mit Lösung 1.');
            if (new Set(items.map(i => i.JSON.id)).size !== count || items.some(i => !Array.isArray(i.JSON.values) || !i.JSON.values.some(v => String(v.value) === '1'))) throw Error('E2-ID oder richtige Lösung stimmt nicht.');
            links.push({w, mod, storage, content, items});
          }
          return true;
        });
      }
      if (links.length > 1) throw Error('Mehrdeutiges Edulo-Lückenmodul.');
      return links[0] || null;
    }
    function hide() {
      if (mode !== 'edulo' || editor()) { restore(); return; }
      syncFooter();
      if (show) { restoreFields(); return; }
      const allowed = new Set([host, ...fields]);
      for (const field of allowed) {
        if (!field) continue;
        const moduleId = field === host ? (options.stateModuleId || 'e1') : (options.scoreModuleId || prefix.split('_')[0]);
        const safe = el => el && el !== el.ownerDocument.body && el !== el.ownerDocument.documentElement && el.contains(field) && !el.contains(root) && !el.querySelector('iframe') && [...el.querySelectorAll('input,textarea,select')].every(f => allowed.has(f));
        const mod = field.ownerDocument.getElementById(moduleId), container = field.closest('.inputcontainer');
        const target = safe(mod) ? mod : safe(container) ? container : field;
        if (!hidden.has(target)) hidden.set(target, {hidden: target.hidden, display: target.style.getPropertyValue('display'), priority: target.style.getPropertyPriority('display')});
        target.hidden = true; target.style.setProperty('display', 'none', 'important');
      }
    }
    function restore() {
      restoreFooter(); restoreFields();
    }
    function restoreFields() {
      for (const [el, old] of hidden) {
        el.hidden = old.hidden;
        if (old.display) el.style.setProperty('display', old.display, old.priority); else el.style.removeProperty('display');
      }
      hidden.clear();
    }
    function nativeWrite(el, value, force = false) {
      if (!el?.isConnected || el.disabled || el.readOnly) throw Error('Edulo-Feld fehlt oder ist gesperrt.');
      if (!force && String(el.value) === value) return;
      const win = el.ownerDocument.defaultView;
      const proto = el.tagName === 'TEXTAREA' ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (!setter) throw Error('Nativer Feldzugriff fehlt.');
      setter.call(el, value);
      for (const type of ['input', 'change']) el.dispatchEvent(new win.Event(type, {bubbles: true}));
      if (String(el.value) !== value) throw Error('Edulo hat den Speicherwert verändert.');
    }
    function row(item) { return {id: item.JSON.id, v: String(item.inputElement.val()), l: item.last || '', c: item.correct, h: item.helped}; }
    function target(item, color) { return {id: item.JSON.id, v: color === 'gray' ? '' : color === 'red' ? '0' : '1', l: '', c: ['green', 'yellow'].includes(color) ? 'true' : 'false', h: color === 'yellow' ? 'true' : 'false'}; }
    function checked(data, scores) {
      if (!validate(data) || !Array.isArray(scores) || scores.length !== count || scores.some(s => !COLORS.includes(s))) throw Error('Ungültiger Lern- oder Punktestand. Originalstand bleibt erhalten.');
      return {widget: widgetId, version, data: clone(data), scores: [...scores]};
    }
    function parse(raw) {
      const value = decode(raw);
      if (value.widget !== widgetId || value.version !== version) throw Error('Fremder oder älterer Lernstand. Migration erforderlich.');
      return checked(value.data, value.scores);
    }
    function ensure() {
      if (!ready || disposed) throw Error('Speicher noch nicht verbunden.');
      if (editor()) { restore(); throw Error('Editor-Vorschau: Speicherung gesperrt.'); }
      if (!root.isConnected) throw Error('Widget wurde entfernt.');
      if (mode === 'edulo') {
        const r = resolve();
        if (!r.h || !r.f.every(Boolean)) throw Error('Edulo-Felder fehlen. Kein lokaler Ersatzspeicher.');
        if (String(r.h.value) !== lastRaw) throw Error('E1 wurde extern geändert. Neu laden statt überschreiben.');
        host = r.h; fields = r.f; moduleLink = bridge();
        if (!moduleLink) throw Error('Edulo-Statusschnittstelle fehlt. Keine vereinfachte 0/1-Ersatzbewertung.');
        hide();
      } else if (localStorage.getItem(localKey) !== (lastRaw || null)) throw Error('Ein anderer Tab hat den Lernstand geändert. Bitte neu laden.');
    }
    async function load() {
      if (disposed) throw Error('Bridge wurde beendet.');
      ready = false;
      if (editor()) {
        mode = 'editor'; restore(); current = checked(fresh(), Array(count).fill('gray'));
        ready = true; status('Editor-Vorschau · keine Speicherung'); return clone(current);
      }
      const embedded = window.parent !== window || query.get('edulo') === '1' || query.has('data') || docs().some(({win}) => !!win.widget) || !!resolve().h;
      mode = options.mode || (embedded ? 'edulo' : 'standalone');
      if (!['edulo', 'standalone'].includes(mode)) throw Error('Unbekannter Betriebsmodus.');
      try {
        if (mode === 'edulo') {
          for (let n = 0; n < (options.attempts ?? 50); n++) {
            if (disposed) throw Error('Widget wurde entfernt.');
            const r = resolve(); host = r.h; fields = r.f;
            if (host && fields.every(Boolean)) { moduleLink = bridge(); if (moduleLink) break; }
            await new Promise(r => setTimeout(r, options.retryMs ?? 200));
          }
          if (!host || !fields.every(Boolean) || !moduleLink) throw Error('E1, E2 oder Edulo-Statusschnittstelle nicht erreichbar.');
          lastRaw = String(host.value);
          if (!lastRaw.trim() && moduleLink.items.some(i => String(i.inputElement.val()) !== '')) throw Error('E1 leer, aber E2 enthält Antworten. Zuordnung prüfen.');
        } else lastRaw = localStorage.getItem(localKey) || '';
        current = lastRaw.trim() ? parse(lastRaw) : checked(fresh(), Array(count).fill('gray'));
        ready = true; hide(); status(mode === 'edulo' ? 'Mit Edulo verbunden.' : 'Speicherung in diesem Browser.');
        return clone(current); // Deliberately no E1/E2 writes and no score synchronization on load.
      } catch (e) { ready = false; restore(); status(e.message, true); throw e; }
    }
    function save(data, scores = current?.scores) {
      clearTimeout(timer); pending = null;
      let stateWritten = false;
      try {
        ensure(); const next = checked(data, scores), raw = encode(next);
        if (mode === 'standalone') { localStorage.setItem(localKey, raw); lastRaw = raw; current = next; status('In diesem Browser gespeichert.'); return clone(next); }
        if (host.disabled || host.readOnly || (host.maxLength >= 0 && raw.length > host.maxLength)) throw Error('E1 ist gesperrt oder zu kurz.');
        const {mod, content, items} = moduleLink;
        const old = items.map(row), desired = items.map((item, i) => target(item, scores[i]));
        const changed = items.map((item, i) => i).filter(i => !equal(old[i], desired[i]));
        if (changed.some(i => fields[i].disabled || fields[i].readOnly)) throw Error('Ein Punktefeld ist gesperrt.');
        // Preflight the entire batch before dispatching any event that can save it.
        try {
          mod.loadUserInput(content, changed.map(i => desired[i]));
          for (const i of changed) {
            if (mod.checkSingleClozeInput(items[i], content) !== (desired[i].c === 'true') || !equal(row(items[i]), desired[i])) throw Error('Edulo bewertet einen Zielwert anders.');
          }
          const serialized = {input: [], counter: {total: 0, correct: 0, helped: 0, wrong: 0}};
          mod.saveUserInput(content, serialized);
          if (changed.some(i => !equal(serialized.input.find(r => r.id === desired[i].id), desired[i]))) throw Error('Edulo-Speicherformat hat sich geändert.');
        } catch (e) { mod.loadUserInput(content, old); throw e; }
        // E1 is authoritative; after an interrupted commit, an explicit save retries E2.
        try { nativeWrite(host, raw); lastRaw = raw; current = next; stateWritten = true; }
        catch (e) { mod.loadUserInput(content, old); throw e; }
        for (const i of changed) nativeWrite(fields[i], desired[i].v, true);
        if (changed.some(i => !equal(row(items[i]), desired[i]))) throw Error('Punktestatus wurde nachträglich verändert.');
        status('Lernstand an Edulo übergeben.'); return clone(next);
      } catch (e) { status((stateWritten ? 'E1 gespeichert, Punkteabgleich unvollständig: ' : 'Nicht gespeichert: ') + e.message, true); throw e; }
    }
    function queueSave(data, scores = current?.scores) {
      pending = {data: clone(data), scores: clone(scores)}; clearTimeout(timer);
      timer = setTimeout(flush, options.debounceMs ?? 300);
    }
    function flush() { if (pending) { const p = pending; try { save(p.data, p.scores); } catch {} } }
    function dispose() {
      if (disposed) return;
      if (root.isConnected) flush();
      clearTimeout(timer); disposed = true; ready = false; restore(); removal?.disconnect();
      for (const [target, type, fn] of listeners) target.removeEventListener(type, fn);
    }
    function listen(target, type, fn) { target.addEventListener(type, fn); listeners.push([target, type, fn]); }
    listen(window, 'pagehide', () => { flush(); restore(); });
    listen(window, 'pageshow', () => { if (ready) hide(); });
    listen(document, 'visibilitychange', () => { if (document.hidden) flush(); });
    listen(root, 'focusout', flush);
    removal = new MutationObserver(() => { if (!root.isConnected) dispose(); else if (editor()) restore(); });
    removal.observe(document.documentElement, {childList: true, subtree: true});
    return {load, save, queueSave, flush, dispose, setFooterHidden, getStatus: () => ({mode, ready, disposed, hideFooter, footerHidden: !!footer && !footerError, footerError}), getSnapshot: () => current ? clone(current) : null};
  };
})();
