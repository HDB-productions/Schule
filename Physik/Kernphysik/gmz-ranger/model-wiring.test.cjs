/* Geometry/material checks with real Three.js and a renderer stub. No browser,
 * WebGL process, external requests or generated artifacts are needed. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,window:{},AbortController,cancelAnimationFrame(){}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'model-runtime.js'),'utf8'),context);
const canvas=()=>({style:{},setAttribute(){},removeEventListener(){},remove(){},getContext(){return new Proxy({scale(){}},{get:(o,k)=>k in o?o[k]:()=>{}});}});
context.document={createElement:canvas};
class RendererStub{constructor(){this.domElement=canvas();this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};}setPixelRatio(){}setSize(){}render(){}dispose(){}}
const THREE=Object.assign({},context.window.THREE,{WebGLRenderer:RendererStub});
vm.runInContext(fs.readFileSync(path.join(__dirname,'atomic-motion.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'model.js'),'utf8'),context);
const viewer=context.window.createRangerViewer({appendChild(){},getBoundingClientRect:()=>({width:640,height:480})},{THREE,manual:true,interactive:false});
const plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b)=>assert.ok(Math.hypot(...a.map((n,i)=>n-b[i]))<1e-5,`${a} != ${b}`);
const leads=viewer.model.children.filter(o=>o.userData.electricalLead);
assert.equal(leads.length,2);
let original;
for(const amount of [0,.15,.3,.32,.36,.4,.45,.5,.54,.58,.6,.75,1,0]){
  viewer.setExplosion(amount,{preserveView:true});
  if(amount===0)assert.equal(viewer.parts.voltage.rotation.y,0);
  if(amount===1){
    assert.equal(viewer.parts.voltage.rotation.y,Math.PI);assert.equal(viewer.parts.counter.rotation.y,Math.PI);
    const source=viewer.getElectricalConnections()[0].source.world;
    assert.ok(source[2]<viewer.parts.voltage.position.z,'Opened HV terminals must face the sensor opening');
    assert.ok(viewer.getPartAnchor('voltage')[2]<viewer.parts.voltage.position.z,'Opened source anchor must face the sensor opening');
    viewer.focusPart('voltage',{immediate:true});assert.ok(viewer.getView().yaw>2.8);viewer.highlightPart(null);
  }
  const connections=viewer.getElectricalConnections();
  for(const c of connections){
    near(c.cableStart,c.source.world);near(c.cableEnd,c.target.world);
    near(c.source.world,viewer.parts[c.source.part].localToWorld(new THREE.Vector3(...c.source.local)).toArray());
    near(c.target.world,viewer.parts[c.target.part].localToWorld(new THREE.Vector3(...c.target.local)).toArray());
    near(c.points[1],viewer.parts.voltage.localToWorld(new THREE.Vector3(c.source.local[0],c.source.local[1]+3,c.source.local[2]+4)).toArray());
    const lead=leads.find(o=>o.userData.polarity===c.id),curve=lead.geometry.parameters.path;
    near(lead.localToWorld(curve.getPoint(0)).toArray(),c.source.world);
    near(lead.localToWorld(curve.getPoint(1)).toArray(),c.target.world);
    assert.ok(Math.abs(c.points[3][0])>24,'Cable loop must clear detector opening');
    for(let i=0;i<=100;i++){const p=lead.localToWorld(curve.getPoint(i/100));assert.ok(Math.hypot(p.x,p.y-30)>22.5,'Cable must route around the detector entrance');}
    if(amount===0){
      lead.geometry.computeBoundingBox();const b=lead.geometry.boundingBox;
      assert.ok(b.min.x>=-33&&b.max.x<=33&&b.min.z>=-15&&b.max.z<=15,'Assembled cable including tube radius must remain inside the case: '+JSON.stringify({min:b.min.toArray(),max:b.max.toArray()}));
    }
  }
  if(amount===0&&!original)original=plain(connections);
}
assert.deepEqual(plain(viewer.getElectricalConnections()),original,'Assembled pose must restore deterministic cable geometry');
const localCableGeometry=leads.map(o=>Array.from(o.geometry.attributes.position.array));
viewer.model.position.set(3,-5,8);viewer.model.rotation.y=.2;viewer.renderAt(0);
leads.forEach((o,index)=>{const current=o.geometry.attributes.position.array;current.forEach((value,i)=>assert.ok(Math.abs(value-localCableGeometry[index][i])<1e-5,'Root transform must not reroute model-local cables'));});
for(const c of viewer.getElectricalConnections()){
  const lead=leads.find(o=>o.userData.polarity===c.id),curve=lead.geometry.parameters.path;
  near(lead.localToWorld(curve.getPoint(0)).toArray(),c.source.world);near(lead.localToWorld(curve.getPoint(1)).toArray(),c.target.world);
  near(c.points[1],viewer.parts.voltage.localToWorld(new THREE.Vector3(c.source.local[0],c.source.local[1]+3,c.source.local[2]+4)).toArray());
}
viewer.model.position.set(0,0,0);viewer.model.rotation.set(0,0,0);viewer.renderAt(0);
const anchors=Object.fromEntries(['anode','cathode','gas','voltage'].map(id=>[id,viewer.getPartAnchor(id)]));
near(anchors.anode,[13.8,30,-6.7]);near(anchors.cathode,[0,53.3,-12]);near(anchors.gas,[-6,38,-7.2]);
assert.ok(Math.hypot(...anchors.cathode.map((n,i)=>n-anchors.gas[i]))>15,'Gas/cathode labels need distinct physical targets');
assert.equal(viewer.getPartAnchor('missing'),null);
const gasMaterial=viewer.parts.gas.children[0].material,cathodeMaterial=viewer.parts.cathode.children[0].material;
assert.notEqual(gasMaterial.color.getHex(),cathodeMaterial.color.getHex());assert.equal(gasMaterial.metalness,0);assert.ok(gasMaterial.opacity<.2);assert.ok(cathodeMaterial.metalness>.5);
const materialState=()=>{
  const result=[];viewer.model.traverse(o=>{if(o.material)for(const m of [].concat(o.material))result.push([m.color?.getHex(),m.emissive?.getHex(),m.emissiveIntensity,m.opacity,o.visible]);});return result;
};
for(const settings of [{highlight:null,microscopic:0,field:0},{highlight:'gas',microscopic:.35,field:.6},{highlight:'anode',microscopic:1,field:1}]){
  viewer.highlightPart(settings.highlight);viewer.setMicroscopic(settings.microscopic);viewer.setFieldVisibility(settings.field);
  const baseline=materialState(),baseAnode=viewer.parts.anode.children[0].material.color.clone();
  viewer.setPolarityHighlight({positive:.5,negative:.5});
  const half=viewer.parts.anode.children[0].material.color.clone();
  viewer.setPolarityHighlight({positive:1,negative:1});
  const full=viewer.parts.anode.children[0].material.color.clone();
  assert.ok(Math.abs(half.r-(baseAnode.r+full.r)/2)<1e-8,'Highlight strength must interpolate continuously');
  for(const lead of leads)assert.equal(lead.material.color.getHex(),lead.userData.polarity==='positive'?0xe23c36:0x286cdd);
  assert.equal(viewer.getHighlight(),settings.highlight);assert.equal(viewer.getMicroscopic(),settings.microscopic);assert.equal(viewer.getFieldVisibility(),settings.field);
  viewer.setPolarityHighlight({positive:0,negative:0});assert.deepEqual(materialState(),baseline,'Polarity clear must preserve all existing presentation controls');
}
viewer.setPolarityHighlight({positive:2,negative:-1});assert.deepEqual(plain(viewer.getPolarityHighlight()),{positive:1,negative:0});
viewer.setPolarityHighlight(null);assert.deepEqual(plain(viewer.getPolarityHighlight()),{positive:0,negative:0});
viewer.highlightPart(null);viewer.setMicroscopic(0);viewer.setExplosion(1,{preserveView:true});viewer.setView({yaw:2.85,pitch:.12,target:[24,12,-3],distance:220});viewer.renderAt(0);
// Test the exact open-side camera geometrically, without starting a renderer.
const source=new THREE.Vector3(...viewer.getPartAnchor('voltage')),ray=new THREE.Raycaster(viewer.camera.position.clone(),source.clone().sub(viewer.camera.position).normalize(),0,source.distanceTo(viewer.camera.position));
assert.equal(ray.intersectObject(viewer.parts.rear,true).length,0,'Rear case must not cover HV source from the open-side camera');
for(const c of viewer.getElectricalConnections())for(const p of c.points){
  const target=new THREE.Vector3(...p),ray=new THREE.Raycaster(viewer.camera.position.clone(),target.clone().sub(viewer.camera.position).normalize(),0,target.distanceTo(viewer.camera.position));
  assert.equal(ray.intersectObject(viewer.parts.rear,true).length,0,'Rear case must not cover HV lead from the open-side camera');
}
const config={collisionAt:79,electronAt:90.96,ionAt:95.22,avalancheAt:103.66,pulseAt:122.19,readyAt:188.4,seed:7391};
viewer.setMicroscopic(1);viewer.setAtomicClock({...config,time:112});viewer.renderAt(112);
const atom=viewer.parts.gas.children.find(o=>o.userData.neutralGas),ion=viewer.mechanism.children.find(o=>o.userData.role==='ion'&&o.userData.index===0),electron=viewer.mechanism.children.find(o=>o.userData.role==='electron'&&o.userData.index===0);
assert.ok(Math.abs(atom.geometry.parameters.radius*atom.scale.x-.22)<1e-10);assert.ok(Math.abs(ion.geometry.parameters.radius*ion.scale.x-.22)<1e-10);assert.ok(Math.abs(electron.geometry.parameters.radius*electron.scale.x-.11)<1e-10);
const arrival=viewer.getAtomicState().ions[0].neutralizedAt;
viewer.setAtomicClock({...config,time:arrival-1e-7});viewer.renderAt(arrival-1e-7);
const arriving={position:ion.position.toArray(),color:ion.material.color.toArray(),emissive:ion.material.emissive.toArray(),opacity:ion.material.opacity,radius:ion.geometry.parameters.radius*ion.scale.x};
viewer.setAtomicClock({...config,time:arrival});viewer.renderAt(arrival);
assert.equal(ion.visible,false);assert.equal(atom.visible,true);near(arriving.position,atom.position.toArray());near(arriving.color,atom.material.color.toArray());near(arriving.emissive,atom.material.emissive.toArray());assert.ok(Math.abs(arriving.opacity-atom.material.opacity)<1e-8);assert.equal(arriving.radius,atom.geometry.parameters.radius*atom.scale.x);
viewer.setAtomicClock(null);viewer.setPhase('drift',.2);viewer.renderAt(0);assert.equal(ion.geometry.parameters.radius,1.1);assert.equal(ion.material.color.getHex(),0xd26a17);assert.equal(ion.children[0].material.opacity,1);
viewer.dispose();
console.log(JSON.stringify({passed:true,checks:['two explicit connected HV leads','curve endpoints through staged explosion','closed cables stay within case including radius','source stubs follow board transforms','root transforms preserve local cable shape','board components/terminals face opened sensor side','source focus follows opening','deterministic restore','world transform endpoints','distinct surface anchors','gas/metal visually distinct','continuous polarity color','base materials restored','selection/microscope/field controls preserved','clamp/reset','rear case clears HV source and leads','atomic radii .22/.22/.11','continuous neutralization position/color/size','legacy representation restored']}));
