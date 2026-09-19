import * as THREE from './dynamot-3d-vendor/three.module.js';
import { OrbitControls } from './dynamot-3d-vendor/OrbitControls.js';

/** Stylized Cornelsen 54850, not a measured CAD model.
 * Axis: Z; crank at +Z. Angles in radians, unwrapped. Interior is schematic.
 * References: official photos 57176/D, 57173/D and user IMG_2154..2157.jpeg.
 * Three.js 0.180.0, MIT, locally vendored. No external requests.
 */
export function createDynamotModel() {
  const group = new THREE.Group(); group.name = 'DynaMot';
  const materials = {
    metal: new THREE.MeshStandardMaterial({color:0xbfc9d1,metalness:.65,roughness:.32}),
    dark: new THREE.MeshStandardMaterial({color:0x25313b,metalness:.25,roughness:.45}),
    white: new THREE.MeshStandardMaterial({color:0xf3f0df,roughness:.6}),
    brass: new THREE.MeshStandardMaterial({color:0xb8a571,metalness:.6,roughness:.35}),
    red: new THREE.MeshStandardMaterial({color:0xbc373d,roughness:.4}),
    glass: new THREE.MeshStandardMaterial({color:0xcbe5ed,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide,roughness:.2,metalness:.05})
  };
  const put=(geometry,material,parent=group,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;};
  const cyl=(r,h,mat,parent=group,x=0,y=0,z=0,segments=64)=>{const m=put(new THREE.CylinderGeometry(r,r,h,segments),mat,parent,x,y,z);m.rotation.x=Math.PI/2;return m;};
  const bar=(a,b,r,mat,parent=group)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const m=put(new THREE.CylinderGeometry(r,r,av.distanceTo(bv),16),mat,parent);m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),bv.sub(av).normalize());return m;};
  const fixed=new THREE.Group();fixed.name='fixed-housing-and-support';group.add(fixed);
  for(const z of [-1.45,1.45]) {
    cyl(1.03,.07,materials.dark,fixed,0,0,z);
    cyl(1,.085,materials.metal,fixed,0,0,z+(z>0?.045:-.045));
    for(let i=0;i<4;i++){const a=i*Math.PI/2+.55;cyl(.055,.02,materials.dark,fixed,.84*Math.cos(a),.84*Math.sin(a),z+(z>0?.095:-.095));}
  }
  const shell=put(new THREE.CylinderGeometry(1,1,2.85,80,1,true),materials.glass,fixed);shell.rotation.x=Math.PI/2;shell.name='transparent-shell';shell.renderOrder=2;
  for(const a of [.6,2.7,4.7])bar([.87*Math.cos(a),.87*Math.sin(a),-1.4],[.87*Math.cos(a),.87*Math.sin(a),1.4],.028,materials.metal,fixed);
  const support=put(new THREE.BoxGeometry(.13,3.5,.12),materials.metal,fixed,.45,-.96,1.59);
  // Silver table clamp from IMG_2155/2157; schematic jaw and screw geometry.
  const clamp=new THREE.Group();clamp.name='table-clamp';fixed.add(clamp);clamp.position.set(.45,-2.10,1.59);
  put(new THREE.BoxGeometry(.85,.13,.85),materials.metal,clamp,.24,0,-.12);
  put(new THREE.BoxGeometry(.13,.66,.85),materials.metal,clamp,.61,-.29,-.12);
  put(new THREE.BoxGeometry(.85,.13,.85),materials.metal,clamp,.24,-.62,-.12);
  bar([.16,-.88,-.12],[.16,-.22,-.12],.035,materials.dark,clamp);
  const pad=cyl(.13,.055,materials.metal,clamp,.16,-.22,-.12);pad.rotation.x=0;
  bar([-.08,-.84,-.12],[.4,-.84,-.12],.025,materials.metal,clamp);
  // Bare silver motor as photographed by the user; rotor remains inside can.
  cyl(.46,1.18,materials.metal,fixed,0,.15,-.42);
  cyl(.465,.035,materials.metal,fixed,0,.15,-.94);
  // Dark shallow ventilation details, rather than a made-up printed label.
  for(const side of [-1,1]){const vent=put(new THREE.BoxGeometry(.013,.16,.26),materials.dark,fixed,side*.458,.15,-.72);vent.name='motor-vent';}
  cyl(.86,.065,materials.metal,fixed,0,0,.22);
  for(const x of [-.32,.32])bar([x,.48,.20],[x,.48,1.28],.032,materials.brass,fixed);
  // Schematic transmission discs, spaced axially; no claim of exact tooth train.
  function gear(r,z,teeth){const g=new THREE.Group();g.position.set(0,.15,z);group.add(g);cyl(r,.07,materials.dark,g);for(let i=0;i<teeth;i++){const a=i*2*Math.PI/teeth;const t=put(new THREE.BoxGeometry(.06,.11,.08),materials.dark,g,Math.cos(a)*r,Math.sin(a)*r);t.rotation.z=a-Math.PI/2;}for(let i=0;i<3;i++){const a=i*2*Math.PI/3;bar([0,0,.045],[r*.82*Math.cos(a),r*.82*Math.sin(a),.045],.025,materials.metal,g);}return g;}
  const drive=gear(.43,.92,28);drive.name='schematic-input-disc';
  const rotor=gear(.30,.37,20);rotor.name='schematic-motor-disc';
  bar([0,0,1.42],[0,0,1.82],.095,materials.metal,fixed);
  const crank=new THREE.Group();crank.position.z=1.85;crank.name='crank';group.add(crank);
  const arm=put(new THREE.BoxGeometry(.98,.13,.09),materials.metal,crank,-.43,0,0);
  cyl(.135,.13,materials.white,crank,0,0,.035,40);
  cyl(.045,.015,materials.metal,crank,0,0,.11);
  cyl(.07,.20,materials.metal,crank,-.9,0,.13);
  const grip=cyl(.12,.56,materials.dark,crank,-.9,0,.47);grip.name='grip';
  // Alternative accessory at the SAME front shaft, never together with crank.
  const pulley=new THREE.Group();pulley.position.z=1.85;group.add(pulley);pulley.name='pulley';
  cyl(.40,.12,materials.red,pulley);cyl(.46,.025,materials.metal,pulley,0,0,.07);cyl(.46,.025,materials.metal,pulley,0,0,-.07);
  const weightRig=new THREE.Group();group.add(weightRig);weightRig.name='schematic-rope-and-weight';
  const rope=bar([-.40,0,1.85],[-.40,-2.25,1.85],.012,materials.dark,weightRig);
  const weight=cyl(.18,.40,materials.metal,weightRig,-.40,-2.45,1.85);weight.rotation.x=0;
  let accessory='none';
  function setAccessory(value){if(!['none','crank','pulley'].includes(value))throw new TypeError('Accessory must be none, crank or pulley');accessory=value;crank.visible=value==='crank';pulley.visible=value==='pulley';weightRig.visible=value==='pulley';}
  function setWeightHeight(y){if(!Number.isFinite(y))return;const bottom=THREE.MathUtils.clamp(y,-3.5,-.55);weight.position.y=bottom;const end=bottom+.2;rope.position.y=end/2;rope.scale.y=Math.abs(end)/2.25;}
  setAccessory('none');
  // Fixed rear terminals and simplified leads.
  for(const [x,mat] of [[-.68,materials.dark],[.68,materials.red]]){
    cyl(.09,.16,mat,fixed,x,.32,-1.58);cyl(.045,.008,materials.dark,fixed,x,.32,-1.666);
    const points=[new THREE.Vector3(x,.32,-1.4),new THREE.Vector3(x*.9,.65,-1.1),new THREE.Vector3(x*.5,.22,-1.02)];
    put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.022,8,false),mat,fixed);
  }
  let angle=0;
  function setCrankAngle(value){if(!Number.isFinite(value))return;angle=value;crank.rotation.z=value;drive.rotation.z=value;rotor.rotation.z=value*30;pulley.rotation.z=value;}
  function dispose(){const geometries=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());}
  return {group,parts:{fixed,crank,grip,drive,rotor,pulley,shell,weightRig,clamp},setCrankAngle,getCrankAngle:()=>angle,setAccessory,getAccessory:()=>accessory,setCrankAttached:value=>setAccessory(value?'crank':'none'),setWeightAttached:value=>setAccessory(value?'pulley':'none'),setWeightHeight,dispose};
}

/** Mountable view. setCrankAngle is silent; user crank input emits onCrankChange.
 * options: onCrankChange(angle), controls=true, background=0xf0f4f6.
 * For a shared laboratory scene use createDynamotModel() to avoid extra contexts.
 */
export function createDynamotView(container,options={}) {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setClearColor(options.background??0xf0f4f6);
  const canvas=renderer.domElement;canvas.style.cssText='display:block;width:100%;height:100%;touch-action:none';canvas.tabIndex=0;canvas.setAttribute('aria-label','DynaMot in 3D. Ziehen dreht die Ansicht; zwei Finger oder Mausrad zoomen. Kurbel über die getrennten Bedienelemente.');container.append(canvas);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
  const model=createDynamotModel();scene.add(model.group);
  scene.add(new THREE.HemisphereLight(0xffffff,0x768894,2.8));
  for(const [position,intensity] of [[[4,6,6],3],[[-4,2,-3],2]]){const l=new THREE.DirectionalLight(0xffffff,intensity);l.position.set(...position);scene.add(l);}
  const orbit=new OrbitControls(camera,canvas);orbit.enablePan=false;orbit.minDistance=4.5;orbit.maxDistance=15;orbit.target.set(0,-.45,0);
  function resetView(){camera.position.set(6,3.2,7);orbit.target.set(0,-.45,0);orbit.update();render();}
  function render(){renderer.render(scene,camera);}
  orbit.addEventListener('change',render);
  const resize=()=>{const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();};
  const observer=new ResizeObserver(resize);observer.observe(container);
  let controls=null;
  if(options.controls!==false){
    controls=document.createElement('div');controls.className='dynamot-crank-controls';controls.style.cssText='display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:12px 0';
    const label=document.createElement('label');label.textContent='Kurbel drehen ';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='360';slider.step='1';slider.value='0';slider.setAttribute('aria-label','Kurbelwinkel');label.append(slider);controls.append(label);
    const output=document.createElement('output');output.textContent='0°';controls.append(output);
    slider.addEventListener('input',()=>{const a=Number(slider.value)*Math.PI/180;model.setCrankAngle(a);output.textContent=slider.value+'°';render();options.onCrankChange?.(a);});
    container.after(controls);
  }
  function setCrankAngle(a){model.setCrankAngle(a);if(controls){const deg=((a*180/Math.PI)%360+360)%360;controls.querySelector('input').value=String(deg);controls.querySelector('output').textContent=Math.round(deg)+'°';}render();}
  resetView();resize();
  return {model,canvas,setCrankAngle,getCrankAngle:model.getCrankAngle,setAccessory(value){model.setAccessory(value);render();},setCrankAttached(value){model.setCrankAttached(value);render();},setWeightAttached(value){model.setWeightAttached(value);render();},setWeightHeight(y){model.setWeightHeight(y);render();},resize,resetView,zoom(factor){if(!Number.isFinite(factor)||factor<=0)return;const offset=camera.position.clone().sub(orbit.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,orbit.minDistance,orbit.maxDistance));camera.position.copy(orbit.target).add(offset);orbit.update();render();},dispose(){observer.disconnect();orbit.dispose();model.dispose();renderer.dispose();canvas.remove();controls?.remove();}};
}
