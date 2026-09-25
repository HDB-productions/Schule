const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const {build} = require('../../../tools/edulo/build.cjs');
const dir = __dirname;
const output = build(path.join(dir,'widget.quelle.html'));
let html = fs.readFileSync(output,'utf8');
for (const [marker, file] of [['/* ROCKET_SIMULATION */','simulation.js'],['/* ROCKET_LEARNING */','learning.js'],['/* ROCKET_LEARNING_CSS */','learning.css']]) {
  if(html.split(marker).length!==2) throw Error('Missing or duplicate marker: '+marker);
  const content=fs.readFileSync(path.join(dir,file),'utf8');
  html=html.replace(marker,()=>file.endsWith('.js')?content.replace(/<\/script/gi,'<\\/script'):content);
}
for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(script[1]);
fs.writeFileSync(output,html,'utf8');
console.log('Flaschenrakete: alle Module eingebettet.');
