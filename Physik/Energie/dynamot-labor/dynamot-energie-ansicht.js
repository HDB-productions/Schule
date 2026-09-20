import * as THREE from './dynamot-3d-vendor/three.module.js';

// This overlay slows down transfers without changing the simulation or its scores.
export function createEnergyView(group,{models,wireCurves}){
 const buffers=globalThis.DynamotEnergyBuffers.create(),sprites=new Map(),materials=new Map();
 let lastPlan=null,lastTime=null,lastShape=null,lastHeights=null;
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),colors={electrical:'#65b9ff',thermal:'#f27770',light:'#ffe45d',potential:'#bc97eb',kinetic:'#6cd1a0'};
 const areaPerJoule=.05;
 function material(color){
  if(materials.has(color))return materials.get(color);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');
  ctx.fillStyle=color;ctx.fillRect(7,7,114,114);ctx.strokeStyle='#163442';ctx.lineWidth=8;ctx.strokeRect(7,7,114,114);
  ctx.fillStyle='#102f3a';ctx.font='bold 88px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('E',64,68);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.SpriteMaterial({map,depthTest:false,depthWrite:false,toneMapped:false});materials.set(color,m);return m;
 }
 function draw(key,position,form,joules,meta){
  if(!(joules>1e-7)||!position)return;
  let sprite=sprites.get(key);if(!sprite){sprite=new THREE.Sprite(material(colors[form]));sprite.renderOrder=20;group.add(sprite);sprites.set(key,sprite);}
  const area=areaPerJoule*joules;sprite.material=material(colors[form]);sprite.position.copy(position);sprite.scale.setScalar(Math.sqrt(area));sprite.visible=true;sprite.userData={...meta,form,joules,area};
 }
 const point=(model,p)=>model.group.localToWorld(p.clone());
 function anchor(device,station,side,form){
  const m=models.get(device);if(!m)return null;
  let p;
  if(station?.startsWith('weight:'))p=m.parts.weightRig.children[1].getWorldPosition(new THREE.Vector3());
  else if(station?.startsWith('rotor:'))p=point(m,V(0,.35,1.5));
  else p=point(m,m.bulb?V(0,1.08,0):V(0,.45,0));
  if(side==='input')return p.add(V(-.45,.12,form==='kinetic'?.3:form==='electrical'?-.2:0));
  const offset={thermal:V(.45,.75,0),light:V(-.1,.75,-.45),electrical:V(.45,.05,-.2),kinetic:V(.1,.05,.55),potential:V(.3,.2,0)};
  return p.add(offset[form]||V(0,0,0));
 }
 function transport(packet,state){
  const t=Math.max(0,Math.min(1,packet.progress||0)),id=packet.device;
  if(packet.kind==='electrical'){
   const raw=state.wires[packet.wire],curve=wireCurves.get(raw);if(!raw||!curve)return null;
   const from=Number(String(packet.from).split(':').at(-1)),to=Number(String(packet.to).split(':').at(-1));
   const forward=from===raw.a,start=anchor(from,packet.from,'output','electrical'),end=anchor(to,packet.to,'input','electrical');if(!start||!end)return null;
   const a=curve.getPointAt(forward?0:1),b=curve.getPointAt(forward?1:0);
   if(t<.15)return start.lerp(a,t/.15);if(t>.85)return b.clone().lerp(end,(t-.85)/.15);
   return curve.getPointAt(forward?(t-.15)/.7:1-(t-.15)/.7);
  }
  const m=models.get(id);if(!m)return null;
  if(packet.kind==='mechanical-in')return m.parts.grip.getWorldPosition(new THREE.Vector3()).lerp(anchor(id,'motor:'+id,'input','kinetic'),t);
  if(packet.kind==='fall'||packet.kind==='lift'){
   const fall=packet.kind==='fall',start=anchor(id,fall?'weight:'+id:'motor:'+id,'output','kinetic'),end=anchor(id,fall?'motor:'+id:'weight:'+id,'input','kinetic'),pulley=point(m,V(-.4,0,1.85));
   const path=new THREE.CurvePath();path.add(new THREE.LineCurve3(start,pulley));path.add(new THREE.LineCurve3(pulley,end));return path.getPointAt(t);
  }
  if(packet.kind==='kinetic')return anchor(id,'rotor:'+id,'output','kinetic').lerp(anchor(id,'motor:'+id,'input','kinetic'),t);
  const start=anchor(id,packet.station||'motor:'+id,'output',packet.form);
  const end=packet.kind==='mechanical-out'?m.parts.grip.getWorldPosition(new THREE.Vector3()).add(V(-.4,.65,.3)):start.clone().add(packet.form==='thermal'?V(1.1,1.6,.2):V(-1.2,1.5,-.4));
  return start.lerp(end,t);
 }
 function reset(){for(const s of sprites.values())group.remove(s);sprites.clear();buffers.reset();lastPlan=null;lastTime=null;lastShape=null;lastHeights=null;}
 function update(state){
  const time=state.simulationTime||0,shape=JSON.stringify([state.activeMode,state.devices.map(d=>[d.id,d.type,d.slot,d.crank,d.weight,d.mass]),state.wires.map(w=>[w.a,w.ap,w.b,w.bp])]),heights=JSON.stringify(state.devices.map(d=>d.height));
  if(lastShape!==null&&(shape!==lastShape||time<lastTime||time===lastTime&&heights!==lastHeights))reset();
  lastShape=shape;lastTime=time;lastHeights=heights;
  lastPlan=globalThis.DynamotEnergy.plan(state);const frame=buffers.update(lastPlan,state);lastPlan.bufferLedger=frame.ledger;
  group.visible=state.energyPackets===true;for(const s of sprites.values())s.visible=false;
  if(group.visible){
   // Combine same-form parts visually while keeping separate wire routes in flight.
   const stationary=new Map();
   for(const p of frame.packets){
    if(p.store)continue;
    if(p.stage==='travel')draw('travel:'+p.id,transport(p,state),p.form,p.joules,p);
    else{const key=[p.station,p.stage,p.form,p.waiting?'waiting':'active'].join(':');const existing=stationary.get(key);if(existing)existing.joules+=p.joules;else stationary.set(key,{...p});}
   }
   for(const [key,p]of stationary){const at=anchor(p.device,p.station,p.stage,p.form);if(at&&p.waiting)at.add(V(-.15,.45,0));draw(key,at,p.form,p.joules,p);}
   for(const stock of frame.stocks){
    const model=models.get(stock.device);if(!model)continue;
    if(stock.kind==='potential-stock'){
     const weight=model.parts.weightRig.children[1].getWorldPosition(new THREE.Vector3());
     draw('stock:'+stock.device,weight.clone().add(V(.55,.05,.15)),'potential',stock.joules,{kind:'potential-stock',device:stock.device,stockJ:stock.joules,stage:'stored'});
    }else draw('rotation:'+stock.device,anchor(stock.device,'rotor:'+stock.device,'output','kinetic'),'kinetic',stock.joules,{kind:'kinetic-stock',device:stock.device,stage:'stored'});
   }
  }
  // Finished symbols are removed instead of accumulating invisible sprites forever.
  for(const [key,sprite]of sprites)if(!sprite.visible){group.remove(sprite);sprites.delete(key);}
 }
 return {update,reset,samples(){return [...sprites.values()].filter(s=>s.visible&&group.visible).map(s=>({...s.userData,position:s.position.toArray(),size:s.scale.x}));},plan(){return lastPlan;},dispose(){reset();for(const m of materials.values()){m.map.dispose();m.dispose();}materials.clear();group.clear();}};
}
