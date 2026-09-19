// Bundle the fixed, locally vendored ES modules into isolated closures.
// No network, dependencies or changes to the original model files.
const fs=require('node:fs'),path=require('node:path');const dir=__dirname;
function moduleCode(file,name,deps){let s=fs.readFileSync(path.join(dir,file),'utf8');s=s.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g,(_,id,p)=>`const ${id}=${deps[p]};`);s=s.replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,list,p)=>`const {${list.replace(/\bas\b/g,':')}}=${deps[p]};`);s=s.replace(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,list,p)=>list.split(',').map(v=>{const [a,b]=v.trim().split(/\s+as\s+/);return `exports.${b||a}=${deps[p]}.${a};`;}).join('\n'));const functions=[];s=s.replace(/export const (\w+)/g,(_,n)=>{functions.push(n);return 'const '+n;});s=s.replace(/export function (\w+)/g,(_,n)=>{functions.push(n);return 'function '+n;});s=s.replace(/export\s*\{([^}]+)\}\s*;?/g,(_,list)=>'Object.assign(exports,{'+list.split(',').map(v=>{const [a,b]=v.trim().split(/\s+as\s+/);return `${b||a}:${a}`;}).join(',')+'});');if(/\b(?:import|export)\s+(?:\{|\*|function)/.test(s))throw Error('Unsupported module syntax: '+file);return `const ${name}=(()=>{const exports={};\n${s}\n${functions.map(n=>`exports.${n}=${n};`).join('\n')}return exports;})();`;}
const core=moduleCode('dynamot-3d-vendor/three.core.js','threeCore',{});
const three=moduleCode('dynamot-3d-vendor/three.module.js','threeModule',{'./three.core.js':'threeCore'});
const orbit=moduleCode('dynamot-3d-vendor/OrbitControls.js','orbitModule',{'./three.module.js':'threeModule'});
const view=moduleCode('dynamot-3d.js','Dynamot3D',{'./dynamot-3d-vendor/three.module.js':'threeModule','./dynamot-3d-vendor/OrbitControls.js':'orbitModule'});
const energyView=moduleCode('dynamot-energie-ansicht.js','EnergyView',{'./dynamot-3d-vendor/three.module.js':'threeModule'});
const lab=moduleCode('dynamot-labor-szene.js','LabScene',{'./dynamot-3d-vendor/three.module.js':'threeModule','./dynamot-3d-vendor/OrbitControls.js':'orbitModule','./dynamot-3d.js':'Dynamot3D','./dynamot-energie-ansicht.js':'EnergyView'});
const license=fs.readFileSync(path.join(dir,'dynamot-3d-vendor/LICENSE'),'utf8');
const bundle=('/* Three.js license\n'+license+'\n*/\n'+[core,three,orbit,view,energyView,lab].join('\n')).replace(/<\/script/gi,'<\\/script');
const source=fs.readFileSync(path.join(dir,'dynamot-labor.quelle.html'),'utf8');
const learning=['dynamot-aufgaben.js','dynamot-diagramm.js','dynamot-lern-ui.js','dynamot-aufbau-hilfe.js'].map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n').replace(/<\/script/gi,'<\\/script');
const styles=['dynamot-lern-ui.css','dynamot-diagramm.css','dynamot-energie.css'].map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');
const network=fs.readFileSync(path.join(dir,'dynamot-stromnetz.js'),'utf8');
fs.writeFileSync(path.join(dir,'dynamot-labor.html'),source.replace('/* DYNAMOT_ENERGY_MODEL */',()=>fs.readFileSync(path.join(dir,'dynamot-energie.js'),'utf8')).replace('/* DYNAMOT_3D_BUNDLE */',()=>bundle).replace('/* DYNAMOT_LEARNING_CSS */',()=>styles).replace('/* DYNAMOT_NETWORK_MODEL */',()=>network).replace('/* DYNAMOT_LEARNING_BUNDLE */',()=>learning));
console.log('Built standalone dynamot-labor.html with local Three.js and model.');
