const fs=require('node:fs'),path=require('node:path'),dir=__dirname;
const read=n=>fs.readFileSync(path.join(dir,n),'utf8');
fs.writeFileSync(path.join(dir,'app.js'),'// Generated; edit the source modules.\n'+['task.js','domain.js','media.js','ui.js','worksheet.js'].map(read).join('\n')+'\ninitFallMedia(root);initFallWorksheet(root);\n');
let html=read('widget.quelle.html');
html=html.replace('</style>','</style><style>'+read('worksheet.css')+'</style>');
const temp=path.join(dir,'widget.build.html');
fs.writeFileSync(temp,html);
try{require('../../../tools/edulo/build.cjs').build(temp,path.join(dir,'widget.html'));}
finally{fs.unlinkSync(temp);}
