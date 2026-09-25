// node tools/edulo/build.cjs <widget.quelle.html> [widget.html]
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
function build(source, destination) {
  source = path.resolve(source); destination = path.resolve(destination || source.replace(/\.quelle\.html$/, '.html'));
  if (source === destination) throw Error('Quelle muss .quelle.html heißen oder ein anderes Ausgabeziel erhalten.');
  const dir = path.dirname(source);
  let html = fs.readFileSync(source, 'utf8');
  const files = {'/* EDULO_BRIDGE */': path.join(__dirname, 'runtime/bridge.js'), '/* APP_JS */': path.join(dir, 'app.js'), '/* APP_CSS */': path.join(dir, 'app.css')};
  for (const [marker, file] of Object.entries(files)) {
    if (html.split(marker).length !== 2) throw Error('Marker fehlt oder mehrfach vorhanden: ' + marker);
    let code = fs.readFileSync(file, 'utf8');
    if (marker === '/* EDULO_BRIDGE */') code = fs.readFileSync(path.join(__dirname, 'runtime/footer.js'), 'utf8') + '\n' + code;
    if (file.endsWith('.js')) { new vm.Script(code); code = code.replace(/<\/script/gi, '<\\/script'); }
    else if (/<\/style/i.test(code)) throw Error('CSS enthält HTML-Endtag.');
    html = html.replace(marker, () => code);
  }
  if (/<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel\s*=\s*["']stylesheet/i.test(html)) throw Error('Standardbuild erwartet eingebettetes JS/CSS, keine externen Laufzeitdateien.');
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(match[1]);
  fs.writeFileSync(destination, html, 'utf8');
  console.log('Gebaut: ' + destination);
  return destination;
}
module.exports = {build};
if (require.main === module) { if (!process.argv[2]) throw Error('Aufruf: node tools/edulo/build.cjs <widget.quelle.html> [widget.html]'); build(process.argv[2], process.argv[3]); }
