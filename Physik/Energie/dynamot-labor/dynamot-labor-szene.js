import * as THREE from './dynamot-3d-vendor/three.module.js';
import { OrbitControls } from './dynamot-3d-vendor/OrbitControls.js';
import { createDynamotModel } from './dynamot-3d.js';
import { createEnergyView } from './dynamot-energie-ansicht.js';

export const LAB_SLOTS=[
 {id:'M1',type:'motor',x:-4.5,z:2.8},{id:'M2',type:'motor',x:0,z:2.8},{id:'M3',type:'motor',x:4.5,z:2.8},
 {id:'L1',type:'lamp',x:-3.4,z:.25},{id:'L2',type:'lamp',x:3.4,z:.25},{id:'L3',type:'lamp',x:-3.4,z:-2.3},{id:'L4',type:'lamp',x:3.4,z:-2.3}
];

// A second static scene shares the exact device/cable renderer, but has no pupil
// model, animation loop or storage bridge. Only its camera is interactive.
export function referenceBuild(experiment){
 const motor=(id,slot)=>({id,type:'motor',slot,omega:0,angle:0,crank:false,weight:false,hand:false,rate:15,mass:.5,height:1.2});
 const a=motor(1,'M1'),b=motor(2,['v1','v4'].includes(experiment)?'L1':'M2');
 if(!['v1','v4','v2','v3'].includes(experiment))throw Error('Unbekannte Versuchsvorlage');
 if(['v1','v4'].includes(experiment))b.type='lamp';else if(experiment==='v2')b.crank=true;else{b.weight=true;b.height=.6;}
 if(experiment==='v4')a.weight=true;else a.crank=true;
 // Motor pin 0 is at local +X, but lamp pin 0 is at local -X.
 // Connect matching physical sides, not matching colors, for the lamp examples.
 const state={devices:[a,b],wires:[0,1].map(pin=>({a:1,ap:pin,b:2,bp:b.type==='lamp'?1-pin:pin})),simulationTime:0,allowedSlots:['M1',b.slot],buildLocked:true};
 return state;
}
export function createLabReference(container,experiment){
 const state=referenceBuild(experiment),b=state.devices[1];
 const stage=document.createElement('div');stage.className='reference-canvas';container.append(stage);
 const view=createLabScene(stage),lamps=b.type==='lamp';
 view.rebuild(state);
 const weighted=['v4','v3'].includes(experiment);
 const reset=()=>view.restoreView({position:experiment==='v4'?[1.5,5.5,8.5]:weighted?[-9,6,10]:lamps?[-7.5,5,-3.2]:[-7,6,-3],target:weighted?(lamps?[-3.9,-.3,2.1]:[-2.25,-.2,2.4]):lamps?[-3.9,0,1.7]:[-2.25,0,2.4]});reset();
 view.canvas.setAttribute('aria-label','Fertig aufgebauter Versuch als 3D-Vorlage. Ziehen dreht die Ansicht, zwei Finger zoomen. Geräte und Kabel bleiben unverändert.');
 const controls=document.createElement('div');controls.className='reference-controls';
 for(const [text,title,action]of [['＋','Vorlage vergrößern',()=>view.zoom(.8)],['−','Vorlage verkleinern',()=>view.zoom(1.25)],['Ansicht zurücksetzen','Vorlagenansicht zurücksetzen',reset]]){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',title);b.addEventListener('click',action);controls.append(b);}container.append(controls);
 return {getViewState:()=>view.getViewState(),getSnapshot:()=>structuredClone(state),dispose(){view.dispose();stage.remove();controls.remove();}};
}

// Pure visual phase tracker: independent of the absolute age of the experiment.
export function createFlowTracker(){
 const phases=new Map(),spacing=.7;let lastTime=null;
 return {update(wires,time=0){
  const dt=lastTime===null?0:Math.max(0,time-lastTime);lastTime=time;
  const live=new Set(wires);for(const wire of phases.keys())if(!live.has(wire))phases.delete(wire);
  for(const wire of wires){const old=phases.get(wire),I=wire.current||0;
   const delta=old===undefined||Math.abs(I)<=.0001?0:-I*1.2*dt;
   phases.set(wire,(((old||0)+delta)%spacing+spacing)%spacing);
  }
 },spacing,phase(wire){return phases.get(wire)||0;}};
}

// Continue one spatial lattice through degree-two contacts. At branching nodes,
// marker identities are schematic; their flux still follows Kirchhoff currents.
export function alignChargePhases(paths,spacing=.7,boundaries=[]){
 const stops=new Set(boundaries),nodes=new Map(),result=new Map(),wrap=x=>(x%spacing+spacing)%spacing;
 for(const p of paths)for(const n of [p.a,p.b]){if(!nodes.has(n))nodes.set(n,[]);nodes.get(n).push(p);}
 for(const first of paths){if(result.has(first.key))continue;result.set(first.key,first.phase);const stack=[first];
  while(stack.length){const p=stack.pop(),phase=result.get(p.key);
   for(const n of [p.a,p.b]){const neighbors=nodes.get(n);if(stops.has(n)||neighbors.length!==2)continue;const next=neighbors.find(q=>q!==p);if(!next||result.has(next.key))continue;
    const outward=n===p.a?phase:wrap(p.length-phase);
    result.set(next.key,wrap(n===next.a?-outward:next.length+outward));stack.push(next);
   }
  }
 }
 return result;
}

export function createLabScene(container,{onPick,onHover,onViewChange}={}){
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor(0xeaf1ed);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;const canvas=renderer.domElement;canvas.style.cssText='display:block;width:100%;height:100%;touch-action:none';canvas.tabIndex=0;canvas.setAttribute('aria-label','Gemeinsamer Experimentiertisch. Ziehen dreht die Ansicht. Buchsen, Geräte und freie Plätze antippen.');container.append(canvas);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,100);scene.add(new THREE.HemisphereLight(0xffffff,0x6e7d73,3));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-7,12,7);scene.add(light);const second=new THREE.DirectionalLight(0xffffff,1.8);second.position.set(8,4,-5);scene.add(second);
 const orbit=new OrbitControls(camera,canvas);orbit.target.set(0,.2,1);orbit.enablePan=true;orbit.screenSpacePanning=true;orbit.touches.ONE=THREE.TOUCH.ROTATE;orbit.touches.TWO=THREE.TOUCH.DOLLY_PAN;orbit.minDistance=4.5;orbit.maxDistance=35;orbit.maxPolarAngle=Math.PI*.49;
 const staticGroup=new THREE.Group(),devicesGroup=new THREE.Group(),wiresGroup=new THREE.Group(),flowGroup=new THREE.Group();scene.add(staticGroup,devicesGroup,wiresGroup,flowGroup);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.55,...extra});
 function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
 mesh(new THREE.BoxGeometry(15,.24,8),mat(0xc9af82),staticGroup,0,-.12,0);
 mesh(new THREE.BoxGeometry(15,.09,.09),mat(0x886e47),staticGroup,0,-.045,4.01);
 for(const x of [-6.3,6.3])for(const z of [-3.3,3.3])mesh(new THREE.BoxGeometry(.22,2.3,.22),mat(0x647470,{metalness:.5}),staticGroup,x,-1.39,z);
 mesh(new THREE.BoxGeometry(40,.08,30),mat(0xd7e1db),staticGroup,0,-2.66,0);
 const flowTracker=createFlowTracker(),wireCurves=new Map(),wireEnds=new Map(),topPorts=new Map();
 const chargeCurves=new Map(),lampFlowTracker=createFlowTracker(),energyGroup=new THREE.Group();scene.add(energyGroup);
 const targets=[],models=new Map(),slotMarks=new Map();
 const energyView=createEnergyView(energyGroup,{models,wireCurves,worldPort});let current={devices:[],wires:[]},pending=null,tool=null,selected=null,selectedWire=-1;
 function label(text,parent,x,y,z,color='#28594a') {const c=document.createElement('canvas');c.width=256;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='rgba(247,251,248,.92)';ctx.beginPath();ctx.roundRect(0,0,256,96,20);ctx.fill();ctx.fillStyle=color;ctx.font='bold 45px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,128,48);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.SpriteMaterial({map:t,depthTest:true,toneMapped:false});const sprite=new THREE.Sprite(m);sprite.position.set(x,y,z);sprite.scale.set(1.3,.49,1);parent.add(sprite);return sprite;}
 for(const slot of LAB_SLOTS){const plane=mesh(new THREE.BoxGeometry(slot.type==='motor'?2.7:3.1,.035,slot.type==='motor'?1.2:2.35),mat(slot.type==='motor'?0xc2dad0:0xdadcbf,{transparent:true,opacity:.6}),staticGroup,slot.x,.025,slot.type==='motor'?3.3:slot.z);plane.userData.pick={kind:'slot',slot:slot.id};targets.push(plane);const text=label(slot.id,staticGroup,slot.x,.32,slot.type==='motor'?4.8:slot.z);slotMarks.set(slot.id,{plane,text});}
 function terminal(parent,pos,id,pin){const ring=mesh(new THREE.TorusGeometry(.145,.045,10,22),mat(pin?0x29363b:0xbc3b39),parent,...pos);const dot=mesh(new THREE.CircleGeometry(.115,24),mat(0x10191c,{side:THREE.DoubleSide}),parent,...pos);dot.position.z-=.012;dot.rotation.y=Math.PI;const hit=mesh(new THREE.SphereGeometry(.24,12,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),parent,...pos);hit.userData.pick={kind:'port',id,pin};targets.push(hit);return {ring,hit,pos:new THREE.Vector3(...pos),parent};}
 function lampModel(d){const g=new THREE.Group();const dark=mat(0x20292b),metal=mat(0xaebcb5,{metalness:.7}),glass=mat(0xfff0b0,{transparent:true,opacity:.33,emissive:0xffad22,emissiveIntensity:0});mesh(new THREE.BoxGeometry(2.5,.17,1.8),dark,g,0,.1,0);mesh(new THREE.CylinderGeometry(.46,.46,.16,32),dark,g,0,.26,0);mesh(new THREE.CylinderGeometry(.2,.22,.4,24),dark,g,0,.51,0);mesh(new THREE.CylinderGeometry(.18,.18,.14,24),metal,g,0,.77,0);const bulb=mesh(new THREE.SphereGeometry(.29,24,16),glass,g,0,1.03,0);const coilPoints=Array.from({length:73},(_,i)=>{const t=i/72,a=t*Math.PI*8;return new THREE.Vector3(-.16+.32*t,1.035+.055*Math.sin(a),.055*Math.cos(a));});const coilCurve=new THREE.CatmullRomCurve3(coilPoints);const filament=mesh(new THREE.TubeGeometry(coilCurve,100,.012,8,false),mat(0x806c3d,{emissive:0xffbb33,emissiveIntensity:0}),g);
 const chargePath=new THREE.CurvePath(),lead=[new THREE.Vector3(-1,.43,.25),new THREE.Vector3(-1,.51,.25),new THREE.Vector3(-.16,.55,0),coilPoints[0]];
 for(let i=1;i<lead.length;i++)chargePath.add(new THREE.LineCurve3(lead[i-1],lead[i]));chargePath.add(coilCurve);
 const tail=[coilPoints.at(-1),new THREE.Vector3(.16,.55,0),new THREE.Vector3(1,.51,.25),new THREE.Vector3(1,.43,.25)];for(let i=1;i<tail.length;i++)chargePath.add(new THREE.LineCurve3(tail[i-1],tail[i]));
 const conductor=mesh(new THREE.TubeGeometry(chargePath,180,.016,8,false),new THREE.MeshBasicMaterial({color:0x5faadb,transparent:true,opacity:.65,depthTest:false,depthWrite:false}),g);conductor.renderOrder=8;conductor.visible=false;
 const electrons=[];for(let i=0;i<=Math.ceil(chargePath.getLength()/lampFlowTracker.spacing);i++){const e=mesh(new THREE.SphereGeometry(.045,10,8),new THREE.MeshBasicMaterial({color:0x8bdcff,depthTest:false,depthWrite:false}),g);e.renderOrder=12;e.visible=false;electrons.push(e);}
 for(const a of [0,2.1,4.2]){mesh(new THREE.CylinderGeometry(.075,.075,.025,12),metal,g,.34*Math.cos(a),.355,.34*Math.sin(a));mesh(new THREE.BoxGeometry(.1,.015,.017),dark,g,.34*Math.cos(a),.371,.34*Math.sin(a));}const ports=[];for(const [pin,x]of [[0,-1],[1,1]]){const stem=mesh(new THREE.CylinderGeometry(.13,.13,.24,18),dark,g,x,.3,.25);const group=new THREE.Group();group.position.set(x,.43,.25);group.rotation.x=-Math.PI/2;g.add(group);ports.push(terminal(group,[0,0,0],d.id,pin));}const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'rgba(255,249,171,1)');gradient.addColorStop(.28,'rgba(255,220,61,.8)');gradient.addColorStop(1,'rgba(255,183,20,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);gc.strokeStyle='rgba(255,185,10,.95)';gc.lineWidth=5;gc.lineCap='round';for(let i=0;i<8;i++){const a=i*Math.PI/4;gc.beginPath();gc.moveTo(64+38*Math.cos(a),64+38*Math.sin(a));gc.lineTo(64+54*Math.cos(a),64+54*Math.sin(a));gc.stroke();}const glowTexture=new THREE.CanvasTexture(glowCanvas),halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,opacity:0,depthWrite:false,blending:THREE.NormalBlending}));halo.position.set(0,1.04,0);halo.scale.set(1.65,1.65,1);g.add(halo);return {group:g,ports,bulb,filament,halo,chargePath,conductor,electrons};}
 function disposeTree(group){const materials=new Set(),geometries=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});}
 function worldPort(id,pin){const p=models.get(id)?.ports[pin];return p?p.parent.localToWorld(p.pos.clone()):null;}
 function rebuild(state){current=state;for(const [id,m]of models){devicesGroup.remove(m.group);disposeTree(m.group);}models.clear();targets.splice(LAB_SLOTS.length); // slots are the initial raycast targets
 for(const d of state.devices){const slot=LAB_SLOTS.find(s=>s.id===d.slot);if(!slot)continue;let m;if(d.type==='motor'){const model=createDynamotModel();model.parts.clamp.rotation.y=-Math.PI/2;model.parts.clamp.position.z=1.0;model.group.scale.setScalar(.72);model.group.rotation.y=0;model.group.position.set(slot.x,1.55,slot.z);model.setAccessory(d.crank?'crank':d.weight?'pulley':'none');m={...model,ports:[]};m.ports[0]=terminal(model.group,[.68,.32,-1.68],d.id,0);m.ports[1]=terminal(model.group,[-.68,.32,-1.68],d.id,1);}else{m=lampModel(d);m.group.position.set(slot.x,0,slot.z);}if(d.type==='motor'){const accessory=d.crank?m.parts.crank:d.weight?m.parts.weightRig.children[1]:null;accessory?.traverse(o=>{if(o.isMesh)o.userData.pick={kind:'accessory',id:d.id};});}m.group.traverse(o=>{if(o.isMesh){if(!o.userData.pick)o.userData.pick={kind:'device',id:d.id};if(!targets.includes(o))targets.push(o);}});devicesGroup.add(m.group);models.set(d.id,m);label(d.slot,m.group,0,d.type==='motor'?1.4:1.6,0);}
 for(const slot of LAB_SLOTS){const occupied=state.devices.some(d=>d.slot===slot.id);const enabled=!state.allowedSlots||state.allowedSlots.includes(slot.id);slotMarks.get(slot.id).plane.visible=enabled;slotMarks.get(slot.id).text.visible=enabled&&!occupied;slotMarks.get(slot.id).plane.material.opacity=occupied?.12:.6;}
 rebuildWires();update(state);}
 // One curve per cable drives the tube, charge markers and projected hit testing.
 function cableCurve(w,lane){
  const ends=wireEnds.get(w),a=ends?.[0].exit,b=ends?.[1].exit;if(!a||!b)return null;
  const device=id=>current.devices.find(d=>d.id===id),level=.085+(lane%4)*.012;
  const landing=(p,id,pin)=>{const d=device(id),slot=LAB_SLOTS.find(s=>s.id===d.slot),stack=(p===a?ends[0]:ends[1]).stack;return d.type==='motor'?new THREE.Vector3(p.x+(pin?.12:-.12)*stack,level,1.33):new THREE.Vector3(slot.x+(pin?1:-1)*(1.85+stack*.16),level,p.z);};
  const ga=landing(a,w.a,w.ap),gb=landing(b,w.b,w.bp);
  // Expanded footprints leave room for the cable radius and rounded corners.
  const obstacles=current.devices.map(d=>{const s=LAB_SLOTS.find(s=>s.id===d.slot);return d.type==='motor'?{x0:s.x-1.37,x1:s.x+1.37,z0:1.55,z1:4.05}:{x0:s.x-1.38,x1:s.x+1.38,z0:s.z-1.03,z1:s.z+1.03};});
  const inside=(p,o)=>p.x>o.x0+.001&&p.x<o.x1-.001&&p.z>o.z0+.001&&p.z<o.z1-.001;
  function clear(p,q){for(const o of obstacles){let lo=0,hi=1;for(const [key,min,max]of [['x',o.x0+.002,o.x1-.002],['z',o.z0+.002,o.z1-.002]]){const d=q[key]-p[key];if(Math.abs(d)<1e-9){if(p[key]<=min||p[key]>=max){lo=2;break;}}else{const t0=(min-p[key])/d,t1=(max-p[key])/d;lo=Math.max(lo,Math.min(t0,t1));hi=Math.min(hi,Math.max(t0,t1));}}if(lo<hi&&hi>0&&lo<1)return false;}return true;}
  function route(p,q){const nodes=[p,q];for(const o of obstacles)for(const x of [o.x0,o.x1])for(const z of [o.z0,o.z1]){const v=new THREE.Vector3(x,level,z);if(Math.abs(x)<7.3&&Math.abs(z)<3.8&&!obstacles.some(r=>inside(v,r)))nodes.push(v);}
   const dist=nodes.map(()=>Infinity),prev=[],used=new Set();dist[0]=0;
   for(let n=0;n<nodes.length;n++){let u=-1;for(let i=0;i<nodes.length;i++)if(!used.has(i)&&(u<0||dist[i]<dist[u]))u=i;if(u<0||!Number.isFinite(dist[u]))break;if(u===1){const path=[];for(let v=1;v!==undefined;v=prev[v])path.unshift(nodes[v]);return path;}used.add(u);for(let v=0;v<nodes.length;v++)if(!used.has(v)&&clear(nodes[u],nodes[v])){const d=dist[u]+nodes[u].distanceTo(nodes[v]);if(d<dist[v]){dist[v]=d;prev[v]=u;}}}
   return [p,q];
  }
  const da=device(w.a),db=device(w.b),sa=LAB_SLOTS.find(s=>s.id===da.slot),sb=LAB_SLOTS.find(s=>s.id===db.slot),bow=ga.clone().lerp(gb,.5),slack=.55+Math.min(lane,12)*.13;
  // Families follow device layout and the outward side of the selected lamp ports.
  if(da.type==='lamp'&&db.type==='lamp'){
   if(sa.id===sb.id)bow.z=sa.z-1.3-slack*.25;
   else if(sa.x===sb.x){bow.x+=(w.ap===w.bp?(w.ap?1:-1):Math.sign(ga.x+gb.x-sa.x*2)||1)*slack;}
   else if(sa.z===sb.z){const facing=sa.x<sb.x?w.ap===1&&w.bp===0:w.ap===0&&w.bp===1;bow.z=facing?bow.z-slack:sa.z-1.25-slack*.2;}
   else{bow.x+=(w.ap?1:-1)*slack*.45;bow.z+=slack*.45;}
  }else if(da.type==='motor'&&db.type==='motor')bow.z-=slack;
  else{const lamp=da.type==='lamp'?da:db,pin=da.type==='lamp'?w.ap:w.bp;bow.x+=(pin?1:-1)*slack*.4;bow.z-=slack*.25;}
  const ground=Math.abs(bow.z)<3.7&&Math.abs(bow.x)<7.3&&!obstacles.some(o=>inside(bow,o))?[...route(ga,bow),...route(bow,gb).slice(1)]:route(ga,gb);
  const control=bow.clone().multiplyScalar(2).sub(ga.clone().lerp(gb,.5)),smooth=new THREE.QuadraticBezierCurve3(ga,control,gb),useSmooth=smooth.getPoints(60).every(p=>Math.abs(p.x)<7.3&&Math.abs(p.z)<3.7&&!obstacles.some(o=>inside(p,o)));
  const curve=new THREE.CurvePath(),first=(useSmooth?control:ground[1]).clone().sub(ga).normalize(),last=gb.clone().sub(useSmooth?control:ground[ground.length-2]).normalize();
  function descend(port,ground,id,pin,direction,reverse){const motor=device(id).type==='motor';let parts;if(motor){const mid=new THREE.Vector3(port.x,.6,1.33);parts=[new THREE.CubicBezierCurve3(port,port.clone().add(new THREE.Vector3(0,-.25,0)),mid.clone().add(new THREE.Vector3(0,.4,0)),mid),new THREE.CubicBezierCurve3(mid,mid.clone().add(new THREE.Vector3(0,-.3,0)),ground.clone().addScaledVector(direction,-.16),ground)];}else{parts=[new THREE.CubicBezierCurve3(port,port.clone().add(new THREE.Vector3(pin?.3:-.3,0,0)),ground.clone().addScaledVector(direction,-.18),ground)];}if(reverse)for(const c of parts.reverse())curve.add(new THREE.CubicBezierCurve3(c.v3,c.v2,c.v1,c.v0));else for(const c of parts)curve.add(c);}
  descend(a,ga,w.a,w.ap,first,false);let previous=ga;
  if(useSmooth){curve.add(smooth);previous=gb;}else for(let i=1;i<ground.length-1;i++){const p=ground[i],before=ground[i-1],after=ground[i+1],radius=Math.min(.28,p.distanceTo(before)/3,p.distanceTo(after)/3),entry=p.clone().addScaledVector(before.clone().sub(p).normalize(),radius),exit=p.clone().addScaledVector(after.clone().sub(p).normalize(),radius);curve.add(new THREE.LineCurve3(previous,entry));curve.add(new THREE.QuadraticBezierCurve3(entry,p,exit));previous=exit;}
  if(previous.distanceTo(gb)>.00001)curve.add(new THREE.LineCurve3(previous,gb));descend(b,gb,w.b,w.bp,last.clone().negate(),true);return curve;
 }
 function restOnEarlierCables(base){
  if(!wireCurves.size)return base;
  const count=400,points=base.getSpacedPoints(count),length=base.getLength(),needed=Array(count+1).fill(0),clearance=.108;
  for(const earlier of wireCurves.values()){
   const prior=earlier.getSpacedPoints(count);
   for(let i=1;i<count;i++){const p=points[i];if(p.y>.42)continue;
    for(let j=1;j<prior.length;j++){const a=prior[j-1],b=prior[j];if(Math.max(a.y,b.y)>.38)continue;const dx=b.x-a.x,dz=b.z-a.z,l=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(l||1))),distance=Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
     if(distance<clearance){const y=a.y+(b.y-a.y)*t;needed[i]=Math.max(needed[i],y+Math.sqrt(clearance*clearance-distance*distance)+.008-p.y);}
    }
   }
  }
  if(!needed.some(v=>v>0))return base;
  const lift=needed.slice(),reach=Math.ceil(.3/(length/count));
  for(let i=1;i<count;i++)if(needed[i]>0)for(let j=Math.max(1,i-reach);j<=Math.min(count-1,i+reach);j++){const d=Math.abs(j-i)*length/count/.3;if(d<1)lift[j]=Math.max(lift[j],needed[i]*(1-d)*(1-d)*(1+2*d));}
  const raised=new class extends THREE.Curve{getPoint(t,target=new THREE.Vector3()){base.getPointAt(t,target);const x=Math.max(0,Math.min(count,t*count)),i=Math.min(count-1,Math.floor(x)),f=x-i;target.y+=(lift[i]*(1-f)+lift[i+1]*f);return target;}}();raised.liftHeight=Math.max(...lift);return raised;
 }
 function plug(w,id,pin,stack,color){
  const base=worldPort(id,pin),motor=current.devices.find(d=>d.id===id).type==='motor',axis=new THREE.Vector3(0,motor?0:1,motor?-1:0),side=new THREE.Vector3(motor?0:pin?1:-1,motor?-1:0,0),center=base.clone().addScaledVector(axis,.2+stack*.36),group=new THREE.Group();wiresGroup.add(group);
  const body=mesh(new THREE.CylinderGeometry(.145,.145,.32,8),mat(color),group);body.position.copy(center);body.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axis);
  const shaft=mesh(new THREE.CylinderGeometry(.065,.065,.12,12),mat(0xb7b9ad,{metalness:.7}),group);shaft.position.copy(center).addScaledVector(axis,-.19);shaft.quaternion.copy(body.quaternion);
  const back=center.clone().addScaledVector(axis,.17),ring=mesh(new THREE.TorusGeometry(.085,.023,8,20),mat(color),group);ring.position.copy(back);ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),axis);
  const hole=mesh(new THREE.CircleGeometry(.065,18),mat(0x111719,{side:THREE.DoubleSide}),group);hole.position.copy(back).addScaledVector(axis,-.009);hole.quaternion.copy(ring.quaternion);
  const relief=mesh(new THREE.CylinderGeometry(.065,.085,.2,12),mat(color),group);relief.position.copy(center).addScaledVector(side,.2);relief.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),side);
  const exit=center.clone().addScaledVector(side,.3);group.traverse(o=>{if(o.isMesh){o.userData.pick={kind:'port',id,pin};targets.push(o);}});topPorts.set(id+':'+pin,back);
  return {id,pin,stack,axis,side,exit,back};
 }
 function rebuildWires(){disposeTree(flowGroup);flowGroup.clear();disposeTree(wiresGroup);wiresGroup.clear();wireCurves.clear();chargeCurves.clear();wireEnds.clear();topPorts.clear();scene.updateMatrixWorld(true);const counts=new Map();for(let i=0;i<current.wires.length;i++){const w=current.wires[i],ends=[];w.color??=i%2?0x285375:0xb43c35;for(const [id,pin]of [[w.a,w.ap],[w.b,w.bp]]){const key=id+':'+pin,stack=counts.get(key)||0;counts.set(key,stack+1);ends.push(plug(w,id,pin,stack,w.color));}wireEnds.set(w,ends);}const duplicates=new Map();
  for(let i=0;i<current.wires.length;i++){
   const w=current.wires[i],forward=w.a<w.b||w.a===w.b&&w.ap<=w.bp,key=forward?w.a+':'+w.ap+'-'+w.b+':'+w.bp:w.b+':'+w.bp+'-'+w.a+':'+w.ap;
   const duplicate=duplicates.get(key)||0;duplicates.set(key,duplicate+1);
   const baseLane=forward?w.ap*2+w.bp:w.bp*2+w.ap;if(!Number.isInteger(w.routeLane)){const used=new Set(current.wires.filter(v=>v!==w&&((v.a===w.a&&v.ap===w.ap&&v.b===w.b&&v.bp===w.bp)||(v.a===w.b&&v.ap===w.bp&&v.b===w.a&&v.bp===w.ap))).map(v=>v.routeLane));let lane=baseLane;while(used.has(lane))lane+=4;w.routeLane=lane;}const baseCurve=cableCurve(w,w.routeLane);if(!baseCurve)continue;const curve=restOnEarlierCables(baseCurve);wireCurves.set(w,curve);
   const chargePath=new THREE.CurvePath();chargePath.add(new THREE.LineCurve3(worldPort(w.a,w.ap),curve.getPointAt(0)));chargePath.add(curve);chargePath.add(new THREE.LineCurve3(curve.getPointAt(1),worldPort(w.b,w.bp)));chargeCurves.set(w,chargePath);
   const line=mesh(new THREE.TubeGeometry(curve,100,.045,10,false),mat(w.color),wiresGroup);line.userData.pick={kind:'wire',index:i};
   for(let j=0;j<=Math.ceil(chargePath.getLength()/flowTracker.spacing);j++){const electron=mesh(new THREE.SphereGeometry(.085,10,8),new THREE.MeshBasicMaterial({color:0x66caff,depthTest:false,depthWrite:false}),flowGroup);electron.renderOrder=12;electron.userData={wire:i,index:j};electron.visible=false;}

  }
 }
 function update(state){current=state;lampFlowTracker.update(state.devices,state.simulationTime||0);flowTracker.update(state.wires,state.simulationTime||0);
 const paths=state.wires.filter(w=>chargeCurves.has(w)).map(w=>({key:w,a:w.a+':'+w.ap,b:w.b+':'+w.bp,length:chargeCurves.get(w).getLength(),phase:flowTracker.phase(w)}));
 for(const d of state.devices){const m=models.get(d.id);if(m?.chargePath)paths.push({key:d,a:d.id+':0',b:d.id+':1',length:m.chargePath.getLength(),phase:lampFlowTracker.phase(d)});}
 const phases=alignChargePhases(paths,flowTracker.spacing,state.devices.filter(d=>d.type==='motor').flatMap(d=>[d.id+':0',d.id+':1']));
 for(const electron of flowGroup.children){const w=state.wires[electron.userData.wire],curve=chargeCurves.get(w),length=curve?.getLength()||0,distance=electron.userData.index*flowTracker.spacing+(phases.get(w)||0);electron.userData.distance=distance;electron.userData.length=length;electron.userData.t=distance/length;electron.visible=state.electronFlow===true&&Math.abs(w?.current||0)>.0001&&distance<length;if(electron.visible)electron.position.copy(curve.getPointAt(electron.userData.t));}
 for(const d of state.devices){const m=models.get(d.id);if(!m)continue;if(d.type==='motor'){m.setCrankAngle(d.angle*Math.PI/180);if(d.weight){const y=(-2.46+d.height*1.3-1.55)/.72,rope=m.parts.weightRig.children[0],weight=m.parts.weightRig.children[1];weight.position.y=y;rope.position.y=(y+.2)/2;rope.scale.y=Math.abs(y+.2)/2.25;}}else{const level=(d.power||0)>.0001?Math.pow(Math.min(1,d.power/3),.55):0;m.bulb.material.opacity=.35+level*.6;m.bulb.material.color.setHex(level>0?0xfff18c:0x899b98);m.bulb.material.emissiveIntensity=level*8;m.filament.material.emissiveIntensity=level*16;m.halo.material.opacity=level>0?.25+level*.7:0;m.halo.scale.setScalar(1.2+level*1.4);
 m.conductor.visible=state.electronFlow===true;m.halo.material.opacity*=state.electronFlow?.25:1;if(state.electronFlow)m.bulb.material.opacity=.18;
 for(let i=0;i<m.electrons.length;i++){const e=m.electrons[i],length=m.chargePath.getLength(),distance=i*lampFlowTracker.spacing+(phases.get(d)||0);e.visible=state.electronFlow===true&&Math.abs(d.current||0)>.0001&&distance<length;e.userData={device:d.id,distance,length,t:distance/length};if(e.visible)e.position.copy(m.chargePath.getPointAt(e.userData.t));}}}
 for(const [id,m]of models)for(const [pin,p]of m.ports.entries()){p.ring.material.emissive.setHex(pending?.a===id&&pending?.ap===pin?0xffb629:tool==='wire'?0x776217:0x000000);p.ring.material.emissiveIntensity=1;}
 scene.updateMatrixWorld(true);energyView.update(state);render();}
 function render(){for(const o of wiresGroup.children){const i=o.userData.pick?.index;if(Number.isInteger(i)&&current.wires[i]){o.material.color.setHex(i===selectedWire?0xf0ad26:current.wires[i].color);o.material.emissive.setHex(i===selectedWire?0x7a4e00:0);}}renderer.render(scene,camera);}
 function pickAt(clientX,clientY){const r=canvas.getBoundingClientRect(),mouse=new THREE.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects([...targets,...wiresGroup.children].filter(o=>{const p=o.userData.pick;return p?.kind!=='slot'||(!current.allowedSlots||current.allowedSlots.includes(p.slot));}),false);const port=hits.find(h=>h.object.userData.pick?.kind==='port');if(port)return port.object.userData.pick;let near=null,best=12;for(let i=0;i<current.wires.length;i++){const curve=wireCurves.get(current.wires[i]);if(!curve)continue;let x=projectPoint(curve.getPointAt(0));for(let j=1;j<=80;j++){const y=projectPoint(curve.getPointAt(j/80)),dx=y.x-x.x,dy=y.y-x.y,len=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((clientX-x.x)*dx+(clientY-x.y)*dy)/(len||1))),distance=Math.hypot(clientX-x.x-t*dx,clientY-x.y-t*dy);if(distance<best){best=distance;near={kind:'wire',index:i};}x=y;}}if(near)return near;return hits.find(h=>h.object.userData.pick)?.object.userData.pick||null;}
 const stagePointers=new Set();let suppressStageClick=false;
 container.addEventListener('pointerdown',e=>{if(!stagePointers.size)suppressStageClick=false;stagePointers.add(e.pointerId);if(stagePointers.size>1){suppressStageClick=true;gesture=true;down=null;}},true);
 container.addEventListener('pointerup',e=>stagePointers.delete(e.pointerId),true);
 container.addEventListener('pointercancel',e=>{stagePointers.delete(e.pointerId);suppressStageClick=true;},true);
 container.addEventListener('click',e=>{if(suppressStageClick&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}},true);
 const activePointers=new Set();let down=null,gesture=false;
 canvas.addEventListener('pointerdown',e=>{activePointers.add(e.pointerId);if(activePointers.size===1){down={id:e.pointerId,x:e.clientX,y:e.clientY};gesture=false;}else{gesture=true;down=null;}});
 canvas.addEventListener('pointermove',e=>{if(down&&down.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>=7)gesture=true;if(e.pointerType==='touch')return;const p=pickAt(e.clientX,e.clientY);canvas.style.cursor=p?'pointer':'grab';onHover?.(p);});
 canvas.addEventListener('pointerup',e=>{const tap=!suppressStageClick&&!gesture&&activePointers.size===1&&down?.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7;activePointers.delete(e.pointerId);down=null;if(tap)onPick?.(pickAt(e.clientX,e.clientY));if(!activePointers.size)gesture=false;});
 canvas.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);down=null;gesture=activePointers.size>0;});
 orbit.addEventListener('change',render);orbit.addEventListener('end',()=>onViewChange?.(getViewState()));
 let appliedFit=1;function resize(){const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;const fit=Math.max(1,1.2/camera.aspect);camera.position.sub(orbit.target).multiplyScalar(fit/appliedFit).add(orbit.target);appliedFit=fit;camera.updateProjectionMatrix();render();}const observer=new ResizeObserver(resize);observer.observe(container);
 function getViewState(){return {position:camera.position.clone().sub(orbit.target).divideScalar(appliedFit).add(orbit.target).toArray(),target:orbit.target.toArray()};}
 function restoreView(v){appliedFit=1;camera.position.fromArray(v.position);orbit.target.fromArray(v.target);orbit.update();resize();}
 function resetView(){appliedFit=1;camera.position.set(-10,8,13);orbit.target.set(0,.1,1);orbit.update();resize();}
 function setView(which){appliedFit=1;camera.position.set(...(which==='front'?[0,5.5,16]:which==='back'?[0,8,-15]:[-10,8,13]));orbit.target.set(0,.1,1);orbit.update();resize();onViewChange?.(getViewState());}
 function projectPoint(point){const r=canvas.getBoundingClientRect(),p=point.clone().project(camera);return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};}
 resetView();return {canvas,rebuild,update,getEnergySamples:()=>energyView.samples(),getEnergyPlan:()=>energyView.plan(),getLampFlowSamples(){return [...models.values()].flatMap(m=>(m.electrons||[]).map(e=>({...e.userData,visible:e.visible,position:m.group.localToWorld(e.position.clone()).toArray()})));},getLampChargePoints(id,count=150){const m=models.get(id);return m?.chargePath?m.chargePath.getSpacedPoints(count).map(p=>m.group.localToWorld(p).toArray()):[];},getChargePoints(index,count=100){return chargeCurves.get(current.wires[index])?.getSpacedPoints(count).map(p=>p.toArray())||[];},pickAt,getViewState,restoreView,projectWire(index,t){const curve=wireCurves.get(current.wires[index]);return curve?projectPoint(curve.getPointAt(t)):null;},getPlugSamples(){return [...wireEnds.values()].flat().map(p=>({id:p.id,pin:p.pin,stack:p.stack,exit:p.exit.toArray(),back:p.back.toArray(),axis:p.axis.toArray(),side:p.side.toArray()}));},getWireLift(index){return wireCurves.get(current.wires[index])?.liftHeight||0;},getWirePoints(index,count=100){const curve=wireCurves.get(current.wires[index]);return curve?curve.getSpacedPoints(count).map(p=>({x:p.x,y:p.y,z:p.z})):[];},getFlowSamples(){return flowGroup.children.map(e=>({...e.userData,visible:e.visible,position:e.position.toArray()}));},setView,resetView,setMode(t,p,s,w=-1){tool=t;pending=p;selected=s;selectedWire=w;update(current);},projectPort(id,pin){scene.updateMatrixWorld(true);const p=topPorts.get(id+':'+pin)||worldPort(id,pin);return p&&projectPoint(p);},projectDevice(id){const m=models.get(id);if(!m)return null;scene.updateMatrixWorld(true);return projectPoint(m.group.localToWorld(new THREE.Vector3(0,1,0)));},projectAccessory(id){const m=models.get(id),d=current.devices.find(d=>d.id===id);if(!m||!d||!d.crank&&!d.weight)return null;scene.updateMatrixWorld(true);const part=d.crank?m.parts.crank:m.parts.weightRig.children[1];return projectPoint(part.getWorldPosition(new THREE.Vector3()));},projectSlot(id){const s=LAB_SLOTS.find(v=>v.id===id);return projectPoint(new THREE.Vector3(s.x,.32,s.type==='motor'?4.8:s.z));},zoom(factor){camera.position.sub(orbit.target).multiplyScalar(factor).add(orbit.target);orbit.update();render();onViewChange?.(getViewState());},dispose(){observer.disconnect();orbit.dispose();energyView.dispose();disposeTree(scene);renderer.dispose();renderer.forceContextLoss();canvas.remove();}};
}
