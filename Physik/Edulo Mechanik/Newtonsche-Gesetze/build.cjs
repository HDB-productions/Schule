const fs=require('node:fs'),path=require('node:path');
const dir=__dirname;
const image='data:image/webp;base64,'+fs.readFileSync(path.join(dir,'assets/bus-inlineskater-v4.webp')).toString('base64');
// Local build: shared worker and reference lesson stay untouched.
fs.writeFileSync(path.join(dir,'app.js'),'// Generated; edit task.js, domain.js, local.js, ui.js.\nconst BUS_COMIC='+JSON.stringify(image)+';\n'+['task.js','domain.js','local.js','ui.js'].map(n=>fs.readFileSync(path.join(dir,n),'utf8')).join('\n'));
fs.writeFileSync(path.join(dir,'app.css'),fs.readFileSync(path.join(dir,'base.css'),'utf8').replaceAll('.ion-lesson','.newton-lesson')+'\n'+fs.readFileSync(path.join(dir,'local.css'),'utf8'));
require('../../../tools/edulo/build.cjs').build(path.join(dir,'widget.quelle.html'));

