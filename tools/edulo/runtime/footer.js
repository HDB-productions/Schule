// Included by build.cjs. Changes only the widget's own task layout.
function createEduloFooter({root, widget}) {
  const wrapper = widget?.contentWrapper?.[0];
  const doc = wrapper?.ownerDocument;
  const footer = doc?.getElementById('footerButtons');
  let frame = null; try { frame = root.ownerDocument.defaultView.frameElement; } catch {}
  if (!wrapper || !footer || !(wrapper.contains(root) || (frame && wrapper.contains(frame))) || footer.contains(root)) throw Error('Footer nicht eindeutig der eigenen Aufgabe zugeordnet.');
  if (widget.isEditor || widget.JSON?.asTest === '1' || widget.JSON?.remoteUserData) throw Error('Footer im Editor, Prüfungsmodus oder in fremden Antworten nicht verändern.');
  const win = doc.defaultView;
  const original = {hidden: footer.hidden, display: footer.style.getPropertyValue('display'), dp: footer.style.getPropertyPriority('display'), bottom: wrapper.style.getPropertyValue('bottom'), bp: wrapper.style.getPropertyPriority('bottom')};
  const restoreProperty = (el, key, value, priority) => value ? el.style.setProperty(key, value, priority) : el.style.removeProperty(key);
  function measure() {
    const rect = el => { const r = el.getBoundingClientRect(); return {width: r.width, height: r.height, top: r.top, bottom: r.bottom}; };
    return {viewport: {width: win.innerWidth, height: win.innerHeight}, wrapper: rect(wrapper), footer: rect(footer), footerDisplay: win.getComputedStyle(footer).display, wrapperBottom: win.getComputedStyle(wrapper).bottom};
  }
  function refresh() {
    // refreshAll() would rebuild content and can re-evaluate answers: deliberately not used.
    try { if (widget.contentWrapper.data?.('jsp') && typeof widget.refreshScrollbars === 'function') widget.refreshScrollbars(); } catch {}
    win.dispatchEvent(new win.Event('resize'));
    if (root.ownerDocument.defaultView !== win) root.ownerDocument.defaultView.dispatchEvent(new root.ownerDocument.defaultView.Event('resize'));
  }
  function restore() {
    footer.hidden = original.hidden;
    restoreProperty(footer, 'display', original.display, original.dp);
    restoreProperty(wrapper, 'bottom', original.bottom, original.bp);
    refresh();
  }
  function setHidden() {
    if (!footer.isConnected || !wrapper.isConnected) throw Error('Edulo hat den Footer ersetzt. Neu verbinden.');
    const position = win.getComputedStyle(wrapper).position;
    if (footer.hidden && footer.style.getPropertyValue('display') === 'none' && (!['absolute','fixed'].includes(position) || wrapper.style.bottom === '0px')) return;
    footer.hidden = true; footer.style.setProperty('display', 'none', 'important');
    if (position === 'absolute' || position === 'fixed') wrapper.style.setProperty('bottom', '0px', 'important');
    refresh();
  }
  async function hide() {
    const before = measure();
    setHidden(); await new Promise(r => setTimeout(r, 200));
    const after = measure();
    return {before, after, gainedHeight: after.wrapper.height - before.wrapper.height, note: 'Actual measured wrapper height; not a server or scoring test'};
  }
  return {hide, setHidden, restore, measure, isCurrent: () => footer.isConnected && wrapper.isConnected && doc.getElementById('footerButtons') === footer && widget.contentWrapper?.[0] === wrapper};
}
