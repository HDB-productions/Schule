const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=__dirname,vendor=path.resolve(dir,'../dynamot-labor/dynamot-3d-vendor');
// Same offline module bundling method as DynaMot; keep Three.js MIT notice.
function moduleCode(file,name,deps={}){
 let s=fs.readFileSync(path.join(vendor,file),'utf8');
 s=s.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g,(_,id,p)=>`const ${id}=${deps[p]};`);
 s=s.replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,list,p)=>`const {${list.replace(/\bas\b/g,':')}}=${deps[p]};`);
 s=s.replace(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,list,p)=>list.split(',').map(v=>{const[a,b]=v.trim().split(/\s+as\s+/);return `exports.${b||a}=${deps[p]}.${a};`;}).join('\n'));
 s=s.replace(/export\s*\{([^}]+)\}\s*;?/g,(_,list)=>'Object.assign(exports,{'+list.split(',').map(v=>{const[a,b]=v.trim().split(/\s+as\s+/);return `${b||a}:${a}`;}).join(',')+'});');
 if(/\b(?:import|export)\s+(?:\{|\*|function)/.test(s))throw Error('Unsupported module syntax: '+file);
 return `const ${name}=(()=>{const exports={};\n${s}\nreturn exports;})();`;
}
const three='/* Three.js MIT license\n'+fs.readFileSync(path.join(vendor,'LICENSE'),'utf8')+'\n*/\n'+moduleCode('three.core.js','steamThreeCore')+'\n'+moduleCode('three.module.js','steamThree',{'./three.core.js':'steamThreeCore'})+'\n'+moduleCode('OrbitControls.js','steamOrbit',{'./three.module.js':'steamThree'});
let html=fs.readFileSync(path.join(dir,'widget.quelle.html'),'utf8');
const entries={'APP_CSS':'app.css','SIMULATION_CSS':'simulation.css','DIAGRAM_CSS':'diagram.css','MODEL_JS':'steam-model.js','VIEW_JS':'steam-view.js','SIMULATION_JS':'simulation.js','DIAGRAM_JS':'diagram.js','APP_JS':'app.js','EDULO_BRIDGE':'../../../tools/edulo/runtime/bridge.js'};
for(const[marker,file]of Object.entries(entries)){
 let code=fs.readFileSync(path.join(dir,file),'utf8');if(marker==='EDULO_BRIDGE')code=fs.readFileSync(path.resolve(dir,'../../../tools/edulo/runtime/footer.js'),'utf8')+'\n'+code;
 if(file.endsWith('.js')){new vm.Script(code);code=code.replace(/<\/script/gi,'<\\/script');}
 const token='/* '+marker+' */';if(html.split(token).length!==2)throw Error('Marker: '+marker);html=html.replace(token,()=>code);
}
html=html.replace('/* THREE_BUNDLE */',()=>three.replace(/<\/script/gi,'<\\/script'));
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(match[1]);
fs.writeFileSync(path.join(dir,'widget.html'),html);console.log('Gebaut: dampfmaschine/widget.html (offline Three.js, Energie-Modell und Aufgaben)');

module.exports={three};
