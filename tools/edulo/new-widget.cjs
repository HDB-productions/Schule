// node tools/edulo/new-widget.cjs Mathe/mein-widget mein-widget "Titel"
const fs = require('node:fs'), path = require('node:path');
const {build} = require('./build.cjs');
function create(target, id, title = id) {
  if (!/^[a-z][a-z0-9-]+$/.test(id || '')) throw Error('Widget-ID: Kleinbuchstaben, Ziffern, Bindestriche; mindestens zwei Zeichen.');
  const repo = path.resolve(__dirname, '../..'), dir = path.resolve(target);
  if (!dir.startsWith(repo + path.sep)) throw Error('Ziel muss innerhalb dieses Repositories liegen.');
  if (fs.existsSync(dir) && fs.readdirSync(dir).length) throw Error('Zielordner ist nicht leer. Bestehende Dateien bleiben unverändert.');
  fs.mkdirSync(dir, {recursive: true});
  const escapeHTML = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  for (const file of ['widget.quelle.html', 'app.js', 'app.css']) {
    const text = fs.readFileSync(path.join(__dirname, 'templates', file), 'utf8').replaceAll('__WIDGET_ID__', id).replaceAll('__TITLE__', escapeHTML(title));
    fs.writeFileSync(path.join(dir, file), text, {encoding: 'utf8', flag: 'wx'});
  }
  build(path.join(dir, 'widget.quelle.html'));
}
module.exports = {create};
if (require.main === module) { if (!process.argv[2]) throw Error('Aufruf: node tools/edulo/new-widget.cjs <Zielordner> <widget-id> [Titel]'); create(process.argv[2], process.argv[3], process.argv[4]); }
