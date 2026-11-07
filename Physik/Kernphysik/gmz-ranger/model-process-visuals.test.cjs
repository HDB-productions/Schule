/* Optional process cues: real Three.js geometry, renderer stub, no artifacts. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,window:{},AbortController,cancelAnimationFrame(){}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'model-runtime.js'),'utf8'),context);
const canvas=()=>({style:{},setAttribute(){},removeEventListener(){},remove(){},getContext(){return new Proxy({scale(){}},{get:(o,k)=>k in o?o[k]:()=>{}});}});
context.document={createElement:canvas};
class RendererStub{constructor(){this.domElement=canvas();this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};}setPixelRatio(){}setSize(){}render(){}dispose(){}}
const THREE=Object.assign({},context.window.THREE,{WebGLRenderer:RendererStub});
for(const name of ['atomic-motion.js','model.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,name),'utf8'),context);
const viewer=context.window.createRangerViewer({appendChild(){},getBoundingClientRect:()=>({width:640,height:480})},{THREE,manual:true,interactive:false});
const directionCue=()=>viewer.mechanism.children.find(o=>o.userData.role==='electronDirection');
const opacityState=part=>{const out=[];part.traverse(o=>{if(o.material)out.push({opacity:o.material.opacity,visible:o.visible});});return out;};
const near=(a,b)=>assert.ok(a.distanceTo(b)<1e-8,`${a.toArray()} != ${b.toArray()}`);
assert.equal(viewer.getWindowVisibility(),1);assert.equal(viewer.getElectronDirectionVisible(),false);
assert.equal(directionCue(),undefined,'Default movies must not allocate a cue');
for(const setup of [()=>{},()=>viewer.highlightPart('window'),()=>viewer.setPhase('drift',.3),()=>viewer.setMicroscopic(.45),()=>viewer.setMicroscopic(1)]){
  setup();viewer.setWindowVisibility(1);const baseline=opacityState(viewer.parts.window),anode=opacityState(viewer.parts.anode);
  viewer.setWindowVisibility(.4);const faded=opacityState(viewer.parts.window);
  baseline.forEach((b,i)=>assert.ok(Math.abs(faded[i].opacity-b.opacity*.4)<1e-10,'Film, frame and protective mesh must fade by the same independent multiplier'));
  assert.deepEqual(opacityState(viewer.parts.anode),anode);
  viewer.setWindowVisibility(-4);assert.equal(viewer.getWindowVisibility(),0);assert.ok(opacityState(viewer.parts.window).every(o=>o.opacity===0&&!o.visible));
  viewer.setWindowVisibility(9);assert.equal(viewer.getWindowVisibility(),1);assert.deepEqual(opacityState(viewer.parts.window),baseline);
}
viewer.highlightPart(null);viewer.setMicroscopic(1);viewer.setPairCount(1);viewer.setExplosion(1,{preserveView:true});
const config={collisionAt:2,electronAt:3,ionAt:4,avalancheAt:6,pulseAt:10,readyAt:15,seed:7391};
const sample=time=>{viewer.setAtomicClock({...config,time});viewer.renderAt(time);return viewer.getAtomicState();};
viewer.setPhase('drift',.2);sample(4);assert.equal(directionCue(),undefined);
viewer.setElectronDirectionVisible(true);
const check=state=>{
  const cue=directionCue(),electron=state.electrons[0],position=new THREE.Vector3(...electron.position),target=new THREE.Vector3(...electron.anodeTarget),direction=target.clone().sub(position).normalize();
  assert.ok(cue.visible);assert.equal(cue.parent,viewer.mechanism);near(viewer.mechanism.position,viewer.parts.gas.position);
  near(new THREE.Vector3(0,1,0).applyQuaternion(cue.quaternion),direction);
  const offset=cue.position.clone().sub(position);assert.ok(offset.dot(direction)>0);near(offset.clone().normalize(),direction);
  const tip=cue.position.clone().addScaledVector(direction,cue.cone.position.y);
  assert.ok(tip.distanceTo(target)<position.distanceTo(target),'Arrow must approach the actual anode target');
  assert.ok(cue.cone.position.y>.5&&cue.cone.position.y<=5.5,'Arrow remains visible at the movement camera distance');
  assert.equal(cue.line.material.color.getHex(),0x3edaff);assert.equal(cue.line.material.depthTest,false);assert.equal(cue.cone.material.depthTest,false);
  return{position:cue.position.toArray(),quaternion:cue.quaternion.toArray(),length:cue.cone.position.y};
};
const late=check(sample(5.4));check(sample(3.2));assert.deepEqual(check(sample(5.4)),late,'Cue must seek deterministically');
viewer.setChargeProgress({electron:.1});const held=check(sample(4));viewer.setChargeProgress({electron:.9});assert.notDeepEqual(check(sample(4)).position,held.position);viewer.setChargeProgress(null);
for(const phase of ['incoming','ionization','avalanche','pulse','off']){viewer.setPhase(phase,.5);sample(4);assert.equal(directionCue().visible,false);}
viewer.setPhase('drift',.2);check(sample(config.avalancheAt));
for(const time of [2.2,6.001,10]){sample(time);assert.equal(directionCue().visible,false,'Atomic direction only appears in pre-avalanche drift including its held endpoint');}
sample(4);assert.equal(directionCue().visible,true);viewer.setElectronDirectionVisible(false);assert.equal(directionCue().visible,false);sample(4);assert.equal(directionCue().visible,false);
viewer.setElectronDirectionVisible(true);sample(4);
assert.equal(JSON.stringify(viewer.exportModel()).includes('Flugrichtung'),false,'Teaching cue must remain outside device export');
viewer.setAtomicClock(null);viewer.setPhase('drift',.5);viewer.renderAt(0);assert.equal(directionCue().visible,true);
viewer.setPhase('drift',1);viewer.renderAt(0);assert.equal(directionCue().visible,false,'Reached anode must have no residual flight arrow');
viewer.dispose();
console.log(JSON.stringify({passed:true,checks:['default cues absent','window multiplier across microscope/selection/legacy phase','protective mesh included','clamp and exact restore','other parts unchanged','cyan sensor-local drift arrow','actual remaining electron direction','atomic size','deterministic seek and override','phase/lifetime gating','explicit hide','excluded from device export','legacy drift and arrival']}));
