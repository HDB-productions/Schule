import * as THREE from './dynamot-3d-vendor/three.module.js';

// A slowed picture of the current flow, independent of physics and persistence.
export function createEnergyView(group,{models,wireCurves,camera}){
 const buffers=globalThis.DynamotEnergyBuffers.create(),sprites=new Map(),materials=new Map();
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 const colors={electrical:'#65b9ff',thermal:'#f27770',light:'#ffe45d',potential:'#bc97eb',kinetic:'#6cd1a0'};
 const areaPerJoule=.05,size=j=>Math.sqrt(Math.max(0,j)*areaPerJoule);
 let lastPlan=null,lastTime=null,lastShape=null,lastHeights=null,channels=new Map(),paths=new Map();
 let right=V(1,0,0),up=V(0,1,0),stateNow=null;
 function material(color){
  if(materials.has(color))return materials.get(color);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,128,128);
  ctx.strokeStyle='#163442';ctx.lineWidth=7;ctx.strokeRect(3.5,3.5,121,121);
  ctx.fillStyle='#102f3a';ctx.font='bold 88px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('E',64,68);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.SpriteMaterial({map,depthTest:false,depthWrite:false,toneMapped:false});materials.set(color,m);return m;
 }
 function draw(key,position,form,joules,meta){
  if(!(joules>1e-8)||!position)return;
  let sprite=sprites.get(key);
  if(!sprite){sprite=new THREE.Sprite(material(colors[form]));sprite.renderOrder=20;group.add(sprite);sprites.set(key,sprite);}
  sprite.renderOrder=meta.stage==='travel'?10:meta.stage==='stored'?20:30;
  sprite.material=material(colors[form]);sprite.position.copy(position);sprite.scale.setScalar(size(joules));sprite.visible=true;
  sprite.userData={id:key,...meta,form,joules,area:areaPerJoule*joules};
 }
 const point=(model,p)=>model.group.localToWorld(p.clone());
 const deviceId=station=>Number(String(station).split(':').at(-1));
 function origin(station){
  if(station?.startsWith('wire:'))return wireCurves.get(stateNow.wires[deviceId(station)])?.getPointAt(.5)||null;
  const m=models.get(deviceId(station));if(!m)return null;
  if(station?.startsWith('weight:'))return m.parts.weightRig.children[1].getWorldPosition(V()).addScaledVector(right,.8).addScaledVector(up,-.25);
  if(station?.startsWith('shaft:')||station?.startsWith('rotor:'))return point(m,V(0,.4,1.25));
  if(m.bulb)return point(m,V(0,1.08,0));
  // Beside the housing, clear of the crank label and the approaching hand E.
  return point(m,V(0,.55,0)).addScaledVector(right,-.75).addScaledVector(up,-.1);
 }
 function outputTotals(channel){
  const totals=new Map();for(const o of channel.outputs||[])totals.set(o.form,(totals.get(o.form)||0)+o.joules);return totals;
 }
 // Each arriving stream owns a contact corner: no waiting or stacked arrivals.
 // Billboard-plane offsets keep the actual colored edges touching in every view.
 function corner(channel){
  const base=origin(channel.station);if(!base)return null;
  const siblings=[...channels.values()].filter(c=>c.station===channel.station);
  const index=siblings.findIndex(c=>c.id===channel.id),row=Math.floor(index/3),start=row*3,list=siblings.slice(start,start+3);
  const widths=list.map(c=>Math.max(size(c.input.joules),...[...outputTotals(c).values()].map(size))*2+.12);
  let x=-widths.reduce((a,b)=>a+b,0)/2;
  for(let i=0;i<index-start;i++)x+=widths[i];x+=(widths[index-start]||0)/2;
  const rowHeight=Math.max(.45,...siblings.map(c=>size(c.input.joules)*2+.18));
  return base.addScaledVector(right,x).addScaledVector(up,row*rowHeight);
 }
 function contact(channel,stage,form,joules,inputJ=0){
  const p=corner(channel);if(!p)return null;const half=size(joules)/2;
  if(stage==='input')return p.addScaledVector(right,-half).addScaledVector(up,-half);
  const forms=[...outputTotals(channel).keys()].filter(f=>f!=='thermal');
  if(form==='thermal')return p.addScaledVector(right,-half).addScaledVector(up,half);
  if(forms.indexOf(form)>0)return p.addScaledVector(right,-half).addScaledVector(up,-size(inputJ)-half);
  return p.addScaledVector(right,half).addScaledVector(up,-half);
 }
 function endpoint(route,which){
  const c=channels.get(which==='start'?route.sourceChannel:route.targetChannel);
  if(c)return contact(c,which==='start'?'output':'input',route.form,which==='start'?(outputTotals(c).get(route.form)||route.joules):c.input.joules);
  const station=which==='start'?route.from:route.to,m=models.get(deviceId(station)||route.device);
  if(!station||station.startsWith('environment:'))return null;
  if(station?.startsWith('hand:')&&m?.parts.grip)return m.parts.grip.getWorldPosition(V());
  return origin(station);
 }
 function polyline(points){
  const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+points[i-1].distanceTo(points[i]));
  const length=lengths.at(-1)||0;
  return {length,point(distance){
   const d=Math.max(0,Math.min(length,distance));let low=1,high=lengths.length-1;
   while(low<high){const mid=(low+high)>>1;if(lengths[mid]<d)low=mid+1;else high=mid;}
   const i=low,span=lengths[i]-lengths[i-1];return points[i-1].clone().lerp(points[i],span?(d-lengths[i-1])/span:0);
  }};
 }
 function routePath(route){
  let start=endpoint(route,'start'),end=endpoint(route,'end');if(!start)return null;
  const pts=[start];
  if(route.kind==='electrical'){
   const raw=stateNow.wires[route.wire],curve=wireCurves.get(raw);if(!raw||!curve||!end)return null;
   const forward=deviceId(route.from)===raw.a,stop=route.to?.startsWith('wire:')?.5:(forward?1:0),begin=forward?0:1;
   for(let i=0;i<=100;i++)pts.push(curve.getPointAt(begin+(stop-begin)*i/100));
  }else if(route.kind==='fall'||route.kind==='lift'){
   const m=models.get(route.device);if(m)pts.push(point(m,V(-.4,0,1.85)));
  }
  if(!end)end=start.clone().add(route.form==='thermal'?V(1.1,1.6,.2):V(-1.2,1.5,-.4));
  pts.push(end);return polyline(pts);
 }
 function reset(){for(const s of sprites.values())group.remove(s);sprites.clear();buffers.reset();lastPlan=null;lastTime=null;lastShape=null;lastHeights=null;channels.clear();paths.clear();}
 function update(state){
  const time=state.simulationTime||0,shape=JSON.stringify([state.activeMode,state.devices.map(d=>[d.id,d.type,d.slot,d.crank,d.weight,d.mass]),state.wires.map(w=>[w.a,w.ap,w.b,w.bp])]),heights=JSON.stringify(state.devices.map(d=>d.height));
  if(lastShape!==null&&(shape!==lastShape||time<lastTime||time===lastTime&&heights!==lastHeights))reset();
  lastShape=shape;lastTime=time;lastHeights=heights;stateNow=state;
  right=V(1,0,0).applyQuaternion(camera.quaternion);up=V(0,1,0).applyQuaternion(camera.quaternion);paths=new Map();
  lastPlan=globalThis.DynamotEnergy.plan(state);
  if(state.energyPackets!==true){
   group.visible=false;for(const s of sprites.values())group.remove(s);sprites.clear();buffers.reset();channels.clear();return;
  }
  const frame=buffers.update(lastPlan,state,(route,list)=>{
   channels=new Map((list instanceof Map?[...list.values()]:list).map(c=>[c.id,c]));
   const path=routePath(route);if(path)paths.set(route.id,path);return path?.length||.01;
  });
  channels=new Map(frame.channels.map(c=>[c.id,c]));
  lastPlan.flowModel={speed:globalThis.DynamotEnergyBuffers.SPEED,interval:globalThis.DynamotEnergyBuffers.INTERVAL,channels:frame.channels,routes:frame.routes};
  group.visible=state.energyPackets===true;for(const s of sprites.values())s.visible=false;
  if(group.visible){
   const stationary=new Map(),potentialAtWeight=new Map(),travelGroups=[];
   for(const p of frame.packets){
    if(p.stage==='travel'){
     const path=paths.get(p.routeId);if(path){
      const position=path.point(p.distance);
      const together=travelGroups.find(g=>g.form===p.form&&g.from===p.from&&g.position.distanceTo(position)<.025);
      if(together){together.joules+=p.joules;together.routeIds.push(p.routeId);}
      else travelGroups.push({...p,position,routeIds:[p.routeId],pathLength:path.length,speed:globalThis.DynamotEnergyBuffers.SPEED});
     }
    }else{
     const key=[p.channel,p.stage,p.form].join(':'),existing=stationary.get(key);
     if(existing)existing.joules+=p.joules;else stationary.set(key,{...p});
    }
   }
   for(const p of travelGroups)draw('travel:'+p.id,p.position,p.form,p.joules,{...p,position:undefined});
   const availableStock=new Map(frame.stocks.filter(s=>s.kind==='potential-stock').map(s=>[s.device,s.joules]));
   for(const p of stationary.values())if(p.station.startsWith('weight:')&&p.form==='potential'){
    p.joules=Math.min(p.joules,availableStock.get(p.device)||0);
    availableStock.set(p.device,Math.max(0,(availableStock.get(p.device)||0)-p.joules));
   }
   const inputJ=new Map([...stationary.values()].filter(p=>p.stage==='input').map(p=>[p.channel,p.joules]));
   for(const [key,p]of stationary){
    const c=channels.get(p.channel);if(!c)continue;
    draw(key,contact(c,p.stage,p.form,p.joules,inputJ.get(p.channel)||0),p.form,p.joules,p);
    if(p.station.startsWith('weight:')&&p.form==='potential')potentialAtWeight.set(p.device,(potentialAtWeight.get(p.device)||0)+p.joules);
   }
   for(const stock of frame.stocks){
    if(stock.kind!=='potential-stock')continue;
    const m=models.get(stock.device);if(!m)continue;
    const at=m.parts.weightRig.children[1].getWorldPosition(V());
    // The active violet tile belongs to the stock rather than duplicating it.
    const remaining=Math.max(0,stock.joules-(potentialAtWeight.get(stock.device)||0));
    const portions=globalThis.DynamotEnergy.weightStockPackets(remaining,stock.mass);
    const spacing=size(stock.mass*9.81*1.5/20)+.035;
    for(const p of portions){
     const pos=at.clone().addScaledVector(right,-.3-(p.index%4+.5)*spacing).addScaledVector(up,(Math.floor(p.index/4)-1)*spacing);
     draw('stock:'+stock.device+':'+p.index,pos,'potential',p.joules,{kind:'potential-stock',device:stock.device,index:p.index,stockJ:stock.joules,stage:'stored',station:'weight:'+stock.device,channel:null,progress:0});
    }
   }
  }
  for(const [key,sprite]of sprites)if(!sprite.visible){group.remove(sprite);sprites.delete(key);}
 }
 return {update,reset,samples(){return [...sprites.values()].filter(s=>s.visible&&group.visible).map(s=>{
  const half=s.scale.x/2,a=s.position.clone().addScaledVector(right,-half).addScaledVector(up,-half).project(camera),b=s.position.clone().addScaledVector(right,half).addScaledVector(up,half).project(camera);
  return {...s.userData,position:s.position.toArray(),size:s.scale.x,screenBox:{left:a.x,right:b.x,bottom:a.y,top:b.y}};
 });},plan(){return lastPlan;},dispose(){reset();for(const m of materials.values()){m.map.dispose();m.dispose();}materials.clear();group.clear();}};
}
