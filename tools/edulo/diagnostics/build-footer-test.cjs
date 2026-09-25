const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
function buildFooter(output = path.join(__dirname, 'footer-test.html')) {
  const helper = fs.readFileSync(path.join(__dirname, '../runtime/footer.js'), 'utf8');
  const source = fs.readFileSync(path.join(__dirname, 'footer-test.template.html'), 'utf8');
  const html = source.replace('/* EDULO_FOOTER */', () => helper);
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  fs.writeFileSync(output, html, 'utf8');
  return html;
}
if (require.main === module) buildFooter(process.argv[2]);
module.exports = {buildFooter};
