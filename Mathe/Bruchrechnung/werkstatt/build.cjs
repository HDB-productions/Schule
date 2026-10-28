const fs = require('node:fs'), path = require('node:path');
const {build} = require('../../../tools/edulo/build.cjs');
const apps = [ ['kuerzen','reduce','brueche-kuerzen','Brüche kürzen'], ['erweitern','expand','brueche-erweitern','Brüche erweitern'], ['addieren-subtrahieren','operate','brueche-ungleichnamig','Brüche addieren und subtrahieren'] ];
for (const [folder,kind,id,title] of apps) {
  if(process.argv[2] && process.argv[2]!==folder)continue;
  const dir = path.join(__dirname,'..',folder);
  const release=kind==='operate'?'HTML-Gitter · Fläche erhalten':'HTML-Gitter';
  const template = fs.readFileSync(path.join(__dirname,kind+'-template.html'),'utf8').replaceAll('__ID__',id).replaceAll('__TITLE__',title).replace('</footer>',`<span class="build-release">Stand 28.10.2026 · ${release}</span></footer>`);
  fs.writeFileSync(path.join(dir,'widget.quelle.html'),template);
  fs.writeFileSync(path.join(dir,'app.css'),fs.readFileSync(path.join(__dirname,'style.css'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,kind+'.css'),'utf8'));
  const logic=['visuals.js',...(kind==='reduce'?['domain.js','reduce-domain.js','reduce-engine.js']:kind==='expand'?['domain.js','expand-engine.js']:['domain.js','operate-domain.js','operate-engine.js'])];
  fs.writeFileSync(path.join(dir,'app.js'),`// Generiert durch ../werkstatt/build.cjs. Gemeinsame Quellen dort bearbeiten.\nconst KIND = '${kind}';\nconst WIDGET_ID = '${id}';\n` + logic.map(file=>fs.readFileSync(path.join(__dirname,file),'utf8')).join('\n'));
  const html=build(path.join(dir,'widget.quelle.html'));
  // Plain text copy for convenient full-source copying into Edulo.
  fs.copyFileSync(html,path.join(dir,'Edulo-Code.txt'));
  fs.copyFileSync(html,path.join(dir,'Edulo-Code-2026-10-28-Gitter.txt'));
  if(kind==='operate')fs.copyFileSync(html,path.join(dir,'Edulo-Code-2026-10-28-Flaechentreu.txt'));
}
