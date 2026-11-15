/* Resolve only the model attached to this html_and_files module. No network I/O. */
function resolveStroboskopModelURL(moduleId, {
  host = typeof window !== 'undefined' ? window.widget : undefined,
  standaloneURL = null
} = {}) {
  if (host === undefined || host === null) {
    if (typeof standaloneURL !== 'string' || !standaloneURL.trim()) throw new Error('Edulo ist nicht verfügbar. Für die lokale Vorschau muss eine Modell-URL ausdrücklich angegeben werden.');
    let parsed;
    try { parsed = new URL(standaloneURL); } catch (_) { throw new Error('Die Modell-URL für die lokale Vorschau ist ungültig.'); }
    if (!['http:', 'https:', 'file:', 'blob:'].includes(parsed.protocol)) throw new Error('Die Modell-URL für die lokale Vorschau muss HTTP, HTTPS, file oder blob verwenden.');
    return standaloneURL;
  }
  if (typeof host.forEachContent !== 'function') throw new Error('Die Edulo-Inhalte können nicht gelesen werden. Die Modelldatei lässt sich nicht zuordnen.');
  if (moduleId === undefined || moduleId === null || moduleId === '') throw new Error('Die Kennung des eigenen Edulo-HTML-Moduls fehlt.');
  const matches = [];
  try {
    host.forEachContent(content => {
      if (content && (content.id === moduleId || content.JSON?.id === moduleId)) matches.push(content);
    });
  } catch (_) { throw new Error('Die Edulo-Inhalte konnten zur Dateizuordnung nicht gelesen werden.'); }
  if (matches.length !== 1) throw new Error(matches.length ? 'Die Kennung des eigenen Edulo-HTML-Moduls ist mehrdeutig.' : 'Das eigene Edulo-HTML-Modul wurde nicht gefunden.');
  const content = matches[0], json = content.JSON;
  if (!json || !(json.type === 'html_and_files' || content.module?.name === 'html_and_files')) throw new Error('Die Modellzuordnung gehört nicht zu einem Edulo-Modul „HTML und Dateien“.');
  if (typeof json.html !== 'string' || !json.html.includes('EDULO_WIDGET_KEY:stroboskop-ki-v1')) throw new Error('Das gewählte HTML-Modul enthält nicht die Stroboskop-Widget-Kennung.');
  const files = (Array.isArray(json.files) ? json.files : []).filter(file => {
    if (typeof file?.url !== 'string') return false;
    const basename = file.url.split(/[?#]/, 1)[0].split(/[\\/]/).pop();
    return basename === 'stroboskop-toyota-v3.bin';
  });
  if (files.length !== 1) throw new Error(files.length ? 'Die Zusatzdatei stroboskop-toyota-v3.bin ist mehrfach zugeordnet.' : 'Die Zusatzdatei stroboskop-toyota-v3.bin fehlt im eigenen HTML-Modul.');
  if (typeof host.getMediaURLPath !== 'function') throw new Error('Edulo stellt keine Medien-Dateiauflösung bereit.');
  let resolved;
  try { resolved = host.getMediaURLPath(files[0].url); } catch (_) { throw new Error('Edulo konnte die Zusatzdatei stroboskop-toyota-v3.bin nicht auflösen.'); }
  if (typeof resolved !== 'string' || !resolved.trim()) throw new Error('Edulo hat für die Zusatzdatei keine gültige Medienadresse geliefert.');
  return resolved;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { resolveStroboskopModelURL };
