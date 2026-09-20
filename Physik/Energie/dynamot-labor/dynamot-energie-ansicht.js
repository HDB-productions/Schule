import * as THREE from './dynamot-3d-vendor/three.module.js';

// Energy symbols are a separate, deliberately schematic overlay, not charge carriers.
export function createEnergyView(group,{models,wireCurves,worldPort}){
 const arrivals=new Map(),sprites=new Map(),materials=new Map(),weightTracker=globalThis.DynamotEnergy.createWeightPacketTracker();let lastPlan=null,lastTime=null,clock=0;
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),positive=x=>Math.max(0,Number.isFinite(x)?x:0);
 function material(color){
  if(materials.has(color))return materials.get(color);
  const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
  ctx.fillStyle=color;ctx.fillRect(7,7,114,114);ctx.strokeStyle='#163442';ctx.lineWidth=8;ctx.strokeRect(7,7,114,114);
  ctx.fillStyle='#102f3a';ctx.font='bold 88px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('E',64,68);
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.SpriteMaterial({map,depthTest:false,depthWrite:false,toneMapped:false});materials.set(color,m);return m;
 }
 function point(model,p){return model.group.localToWorld(p.clone());}
 function packet(key,p,color,area,meta){
  if(!(area>0))return;
  let s=sprites.get(key);if(!s){s=new THREE.Sprite(material(color));s.renderOrder=20;group.add(s);sprites.set(key,s);}
  s.material=material(color);s.position.copy(p);s.scale.setScalar(Math.sqrt(area));s.visible=true;s.userData={...meta,area};
 }
 const line=(a,b)=>new THREE.LineCurve3(a,b);
 const joined=(...curves)=>{const p=new THREE.CurvePath();for(const c of curves)p.add(c);return p;};
 function stream(key,curve,power,color,meta,offset=0,count=1){
  if(!(power>.0001)||!curve)return;
  // All streams emit the same number per visual interval. Square area, not side
  // length, represents their share. One common scale keeps splits additive.
  const area=.34*power/(lastPlan.visualScale||1);
  for(let i=0;i<count;i++){
   const t=((clock/3+offset+i/count)%1+1)%1;
   packet(key+':'+i,curve.getPointAt(t),color,area,{...meta,t,power});
  }
 }
 function update(state){
  const time=state.simulationTime||0;if(lastTime!==null)clock+=Math.max(0,time-lastTime);lastTime=time;
  group.visible=state.energyPackets===true;for(const s of sprites.values())s.visible=false;
  if(!group.visible)return;
  const plan=globalThis.DynamotEnergy.plan(state);lastPlan=plan;
  const colors={electrical:'#65b9ff',thermal:'#f27770',light:'#ffe45d',potential:'#bc97eb',kinetic:'#6cd1a0'};
  // Scale is global for this frame, preserving area ratios at every split.
  plan.visualScale=Math.max(.12,...plan.devices.map(d=>positive(d.electricalIn)+positive(d.mechanicalIn)+positive(d.electricalOut)));
  for(const d of plan.devices){
   const model=models.get(d.id),raw=state.devices.find(v=>v.id===d.id);if(!model||!raw)continue;
   const center=point(model,raw.type==='lamp'?V(0,1.08,0):V(0,.2,0));
   const incoming=plan.wires.some(w=>w.to===d.id&&w.power>.0001);
   const cycle=Math.floor(clock/3),previous=arrivals.get(d.id);
   const arrived=incoming&&previous?.incoming&&cycle>previous.cycle;
   const received=incoming&&(arrived||previous?.incoming&&previous.received);
   arrivals.set(d.id,{cycle,incoming,received});
   if(raw.type==='lamp'){
    // Both outputs start at the same filament: a visible split into unequal areas.
    stream('light:'+d.id,line(center,center.clone().add(V(-1.4,1.7,-.35))),d.light,colors.light,{kind:'light',device:d.id});
    stream('heat:'+d.id,line(center,center.clone().add(V(1.3,2,-.15))),d.heat,colors.thermal,{kind:'heat',device:d.id});
   }else{
    const shaft=point(model,V(0,0,1.85));
    const grip=model.parts.grip.getWorldPosition(new THREE.Vector3());
    if(raw.crank){
     stream('hand:'+d.id,joined(line(grip,shaft),line(shaft,center)),d.mechanicalIn,colors.kinetic,{kind:'mechanical-in',device:d.id});
     const output=grip.clone().add(V(-.4,.65,.3));
     stream('crank:'+d.id,joined(line(center,shaft),line(shaft,output)),Math.max(d.mechanicalOut,!raw.hand?positive(d.electromagneticPower):0),colors.kinetic,{kind:'mechanical-out',device:d.id});
    }
    if(raw.weight){
     const weight=model.parts.weightRig.children[1].getWorldPosition(new THREE.Vector3());
     const pulley=point(model,V(-.4,0,1.85));
     const transfer=weightTracker.update(d,raw.mass,time,state.running!==false,incoming?!!arrived:null);
     for(const stock of transfer.stock){
      // Packets surround the weight, offset radially from the vertical rope.
      const ring=Math.floor(stock.index/5),angle=2*Math.PI*(stock.index%5)/5;
      const pos=weight.clone().add(V(Math.cos(angle)*(.43+.04*(ring%2)),-.35+ring*.2,Math.sin(angle)*(.43+.04*(ring%2))));
      packet('stock:'+d.id+':'+stock.index,pos,colors.potential,.065*stock.joules,
       {kind:'potential-stock',device:d.id,index:stock.index,joules:stock.joules,stockJ:transfer.stockJ});
     }
     for(const moving of transfer.transit){
      if(moving.direction==='lift'&&moving.partial)continue;
      // Falling: a lilac stock packet becomes green at the weight and climbs
      // the rope. Lifting: green arrives from the motor; lilac appears only on arrival.
      const path=moving.direction==='fall'?joined(line(weight,pulley),line(pulley,center)):
       joined(line(center,pulley),line(pulley,weight));
      packet('weight-transfer:'+d.id+':'+moving.id,path.getPointAt(moving.progress),colors.kinetic,moving.electricalArrival?.34*(moving.joules/3)/(plan.visualScale||1):.065*moving.joules,
       {kind:moving.direction,device:d.id,joules:moving.joules,progress:moving.progress,partial:moving.partial===true,electricalArrival:moving.electricalArrival===true});
     }
    }
    // The receiving weight motor splits only when the blue packet reaches its center.
    if(!raw.weight||!incoming||received)stream('motor-heat:'+d.id,line(center,center.clone().add(V(1.2,1.65,.25))),d.heat,colors.thermal,{kind:'heat',device:d.id});
   }
  }
  for(const w of plan.wires){
   if(!(w.power>.0001))continue;const raw=state.wires[w.index],curve=wireCurves.get(raw);if(!curve)continue;
   const forward=w.from===raw.a,source=models.get(w.from),sink=models.get(w.to);if(!source||!sink)continue;
   // Follow the actual cable and meet the device's conversion point at either end.
   const a=curve.getPointAt(forward?0:1),b=curve.getPointAt(forward?1:0);
   const center=m=>point(m,m.bulb?V(0,1.08,0):V(0,.2,0));
   const start=center(source),end=center(sink);
   // The cable already owns an arc-length cache. Avoid rebuilding/sampling it
   // hundreds of times per frame just to add the two short device leads.
   const path={getPointAt(t){if(t<.15)return start.clone().lerp(a,t/.15);if(t>.85)return b.clone().lerp(end,(t-.85)/.15);const f=(t-.15)/.7;return curve.getPointAt(forward?f:1-f);}};
   stream('wire:'+w.index,path,w.power,colors.electrical,{kind:'electrical',wire:w.index,from:w.from,to:w.to});
  }
 }
 return {update,reset(){for(const s of sprites.values())group.remove(s);sprites.clear();weightTracker.reset();arrivals.clear();lastPlan=null;lastTime=null;clock=0;},samples(){return [...sprites.values()].filter(s=>s.visible&&group.visible).map(s=>({...s.userData,position:s.position.toArray(),size:s.scale.x}));},plan(){return lastPlan;},dispose(){for(const m of materials.values()){m.map.dispose();m.dispose();}materials.clear();sprites.clear();weightTracker.reset();group.clear();}};
}
