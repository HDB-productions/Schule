// Optional pure metadata parser. No network and no placeholder substitution.
function readEduloParameters(json, marker, {decodeNewlines = false} = {}) {
  if (typeof marker !== 'string' || !marker.startsWith('EDULO_WIDGET_KEY:')) throw Error('Eindeutiger Widgetmarker erforderlich.');
  const hits = [], visited = new Set();
  function walk(list) {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (!item || typeof item !== 'object' || visited.has(item)) continue;
      visited.add(item);
      const body = item.JSON || item;
      if (body.type === 'html_and_files' && typeof body.html === 'string' && body.html.includes(marker)) hits.push(body);
      walk(item.contents); if (body !== item) walk(body.contents);
    }
  }
  walk(json?.contents); walk(json?.modules); walk(json?.body?.contents);
  if (hits.length !== 1) throw Error('Eigenes HTML-Modul fehlt oder Marker ist mehrdeutig.');
  const result = Object.create(null);
  for (const p of hits[0].parameters || []) {
    if (typeof p?.name !== 'string') continue;
    const value = String(p.value ?? '');
    result[p.name] = decodeNewlines ? value.replace(/\\n/g, '\n') : value;
  }
  return result;
}
if (typeof module !== 'undefined' && module.exports) module.exports = {readEduloParameters};
