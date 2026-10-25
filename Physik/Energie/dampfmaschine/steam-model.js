/* Finite teaching model: energy is always in a packet or in the environment.
 * Ten reusable fire slots; four thermal packets form the boiler's heat store.
 * Times describe the animation, never create thermal energy or pressure.
 */
function steamModelFresh(){
  const model={version:2,time:0,nextId:1,temperature:20,pressure:0,angle:0,totalAdded:0,environment:0,packets:[],slots:Array(10).fill(null),waterOrder:[],legacyReserve:[],idleAge:0};
  steamModelRefuel(model,10);return model;
}
function steamModelPacket(model,slot){
  return {id:`e${model.nextId++}`,parent:null,slot,stage:'fuel',amount:100,age:0,efficient:null,turnStart:0,x:0,y:0,dx:0};
}
function steamModelFillReserve(model){
  for(let slot=0;slot<10&&model.legacyReserve.length;slot++){
    const current=model.packets.find(p=>p.id===model.slots[slot]);
    if(current&&['fuel','fire'].includes(current.stage))continue;
    const reserveId=model.legacyReserve.shift(),packet=model.packets.find(p=>p.id===reserveId);
    packet.slot=slot;packet.stage='fuel';packet.age=0;model.slots[slot]=packet.id;
  }
}
function steamModelRefuel(model,count=5){
  if(!Number.isFinite(count)||count<1)return false;
  count=Math.min(10,Math.floor(count),Math.floor((1e8-model.totalAdded)/100));
  steamModelFillReserve(model);
  let added=0;
  for(let slot=0;slot<10&&added<count;slot++){
    const current=model.packets.find(p=>p.id===model.slots[slot]);
    if(current&&['fuel','fire'].includes(current.stage))continue;
    const packet=steamModelPacket(model,slot);model.packets.push(packet);model.slots[slot]=packet.id;added++;
  }
  model.totalAdded+=added*100;if(added)model.idleAge=0;return added>0;
}
function steamModelValidate(model){
  if(!model||typeof model!=='object'||Array.isArray(model)||![1,2].includes(model.version))return false;
  const numeric=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
  const keys=['version','time','nextId','temperature','pressure','angle','totalAdded','environment','packets'];
  if(model.version===2)keys.push('slots','waterOrder','legacyReserve','idleAge');
  if(Object.keys(model).length!==keys.length||!keys.every(k=>Object.hasOwn(model,k)))return false;
  if(!numeric(model.time,0,1e9)||!Number.isSafeInteger(model.nextId)||model.nextId<1||!numeric(model.temperature,20,100)||!numeric(model.pressure,0,1)||!numeric(model.angle,0,1e10)||!numeric(model.totalAdded,0,1e8)||!numeric(model.environment,0,model.totalAdded)||!Array.isArray(model.packets)||model.packets.length>(model.version===1?4000:4000000))return false;
  const ids=new Set(),originals=new Set(),stages=['fuel','fire','water','steam','wheel','loss','spent'];
  if(model.version===2)stages.push('reserve');
  let sum=model.environment,originalCount=0,maxId=0;
  const packetKeys=['id','parent','slot','stage','amount','age','efficient','turnStart','x','y','dx'];
  for(const p of model.packets){
    if(!p||typeof p!=='object'||Object.keys(p).length!==packetKeys.length||!packetKeys.every(k=>Object.hasOwn(p,k))||typeof p.id!=='string'||!/^e[1-9]\d*$/.test(p.id)||ids.has(p.id)||!stages.includes(p.stage))return false;
    ids.add(p.id);maxId=Math.max(maxId,Number(p.id.slice(1)));
    if(!Number.isSafeInteger(p.slot)||p.slot<(model.version===2?-1:0)||(model.version===2&&p.slot>9)||!numeric(p.amount,0,100)||!numeric(p.age,0,1e9)||!numeric(p.turnStart,0,model.angle)||!numeric(p.x,-1000,2000)||!numeric(p.y,-1000,1000)||!numeric(p.dx,-50,50)||(p.efficient!==null&&typeof p.efficient!=='boolean'))return false;
    if((p.stage==='spent')!==(p.amount===0)||['fuel','reserve'].includes(p.stage)&&(p.amount!==100||p.efficient!==null)||p.stage==='fire'&&p.age>(model.version===1?3.601:2.000001)||p.stage==='steam'&&p.age>4.801||p.stage==='loss'&&p.age>8.001)return false;
    if(p.parent===null){originals.add(p.id);originalCount++;}else if(typeof p.parent!=='string'||!['loss','spent'].includes(p.stage))return false;
    sum+=p.amount;
  }
  if(!(model.nextId>maxId&&model.totalAdded===originalCount*100&&Math.abs(sum-model.totalAdded)<1e-6&&model.packets.every(p=>p.parent===null||originals.has(p.parent))&&model.packets.filter(p=>p.stage==='fire').length<=1))return false;
  if(model.version===1)return true;
  if(!Array.isArray(model.slots)||model.slots.length!==10||!Array.isArray(model.waterOrder)||!Array.isArray(model.legacyReserve)||!numeric(model.idleAge,0,1e9))return false;
  const slotIds=model.slots.filter(id=>id!==null),waters=model.packets.filter(p=>p.stage==='water'),reserve=model.packets.filter(p=>p.stage==='reserve');
  if(new Set(slotIds).size!==slotIds.length||slotIds.some(id=>!originals.has(id))||new Set(model.waterOrder).size!==model.waterOrder.length||new Set(model.legacyReserve).size!==model.legacyReserve.length||model.waterOrder.length!==waters.length||waters.length>4||model.legacyReserve.length!==reserve.length)return false;
  if(model.slots.some((id,slot)=>id!==null&&model.packets.find(p=>p.id===id).slot!==slot)||waters.some(p=>!model.waterOrder.includes(p.id))||reserve.some(p=>!model.legacyReserve.includes(p.id)||p.slot!==-1))return false;
  if(model.packets.some(p=>['fuel','fire'].includes(p.stage)&&(p.parent!==null||p.slot<0||model.slots[p.slot]!==p.id))||model.packets.some(p=>p.slot===-1&&p.stage!=='reserve'))return false;
  // Residual pressure is valid while a previously hot boiler cools down.
  return model.temperature===20+waters.length*20&&(waters.length===4||model.pressure===0||model.time>=8);
}
/* Validation remains read-only. Migration returns an independent copy and keeps
 * every historical packet ID and amount, including oversized legacy stock.
 */
function steamModelMigrate(model){
  if(!steamModelValidate(model))return null;
  const m=JSON.parse(JSON.stringify(model));if(m.version===2)return m;
  m.version=2;m.slots=Array(10).fill(null);m.waterOrder=[];m.legacyReserve=[];m.idleAge=0;
  const originals=m.packets.filter(p=>p.parent===null);
  for(const p of originals)p.slot%=10;
  const stock=originals.filter(p=>['fuel','fire'].includes(p.stage)).sort((a,b)=>(a.stage==='fire'?-1:0)-(b.stage==='fire'?-1:0));
  stock.forEach((p,index)=>{if(index<10){p.slot=index;m.slots[index]=p.id;if(p.stage==='fire')p.age=Math.min(2,p.age);}else{p.stage='reserve';p.slot=-1;m.legacyReserve.push(p.id);}});
  for(const p of originals)if(!['fuel','fire','reserve'].includes(p.stage)&&m.slots[p.slot]===null)m.slots[p.slot]=p.id;
  for(const p of m.packets)if(p.parent!==null){const parent=originals.find(o=>o.id===p.parent);p.slot=parent.slot<0?0:parent.slot;}
  const water=m.packets.filter(p=>p.stage==='water').sort((a,b)=>b.age-a.age);
  /* Very old/malformed-but-v1-valid states may contain >4 water packets.
   * Keep their exact energy as visible cooling heat rather than deleting it. */
  for(const p of water.slice(0,Math.max(0,water.length-4))){p.stage='loss';p.age=0;p.x=286;p.y=260;p.dx=5;}
  m.waterOrder=water.filter(p=>p.stage==='water').map(p=>p.id);
  m.temperature=20+m.waterOrder.length*20;if(m.waterOrder.length<4)m.pressure=0;
  steamModelFillReserve(m);return m;
}
function steamModelAdvance(model,seconds,efficiency){
  if(!Number.isFinite(seconds)||seconds<0||seconds>3600)throw new Error('Ungültiger Zeitschritt.');
  if(model.version!==2)throw new Error('Alter Modellstand muss zuerst migriert werden.');
  if(seconds===0)return model;
  const epsilon=1e-9;
  function loss(parent,amount,x,y,dx){if(amount<=0)return;model.packets.push({id:`e${model.nextId++}`,parent:parent.id,slot:parent.slot,stage:'loss',amount,age:0,efficient:parent.efficient,turnStart:0,x,y,dx});}
  function cool(packet){packet.stage='loss';packet.age=0;packet.x=286;packet.y=260;packet.dx=5;}
  let remaining=seconds;
  while(remaining>1e-10){
    steamModelFillReserve(model);
    let fire=model.packets.find(p=>p.stage==='fire');
    if(!fire){fire=model.packets.find(p=>p.stage==='fuel');if(fire){fire.stage='fire';fire.age=0;fire.efficient=!!efficiency;}}
    const wheels=model.packets.filter(p=>p.stage==='wheel');
    const speed=wheels.length?Math.min(2.5,1+wheels.length*.65):0;
    let dt=Math.min(.02,remaining);
    // Stop at packet boundaries so large and small user steps agree.
    for(const p of model.packets){let until=Infinity;if(p.stage==='fire')until=2-p.age;else if(p.stage==='steam')until=4.8-p.age;else if(p.stage==='loss')until=8-p.age;else if(p.stage==='wheel'&&speed)until=(Math.PI*6-(model.angle-p.turnStart))/speed;if(until>epsilon)dt=Math.min(dt,until);}
    if(!fire&&model.waterOrder.length){const until=14-model.idleAge;if(until>epsilon)dt=Math.min(dt,until);}
    remaining-=dt;model.time+=dt;model.angle+=dt*speed;
    model.idleAge=fire?0:model.idleAge+dt;
    const pressureTarget=model.waterOrder.length===4&&fire?1:0;
    model.pressure=pressureTarget+(model.pressure-pressureTarget)*Math.exp(-dt*(pressureTarget ? .4 : .12));
    const packets=model.packets.map(packet=>({packet,stage:packet.stage}));
    for(const {packet:p,stage} of packets){
      // A packet displaced into steam by this boundary starts at age zero,
      // even in a legacy save whose array is not ordered by arrival.
      if(p.stage!==stage)continue;
      if(['fuel','reserve','spent'].includes(p.stage))continue;p.age+=dt;
      if(p.stage==='fire'&&p.age>=2-epsilon){
        const amount=p.efficient?80:100;loss(p,p.amount-amount,258,262,-7);p.amount=amount;p.stage='water';p.age=0;
        if(model.waterOrder.length===4){
          const oldestId=model.waterOrder.shift(),oldest=model.packets.find(q=>q.id===oldestId);
          const transferred=oldest.efficient?oldest.amount*.75:oldest.amount;
          loss(oldest,oldest.amount-transferred,286,229,5);oldest.amount=transferred;oldest.stage='steam';oldest.age=0;oldest.x=190+(oldest.slot%6)*35+Math.sin(model.time*2+oldest.slot)*8;oldest.y=273+Math.sin(model.time*2.6+oldest.slot)*9;
        }
        model.waterOrder.push(p.id);
      }else if(p.stage==='steam'&&p.age>=4.8-epsilon){
        const amount=p.efficient?p.amount*.2:p.amount;loss(p,p.amount-amount,553,260,-4);p.amount=amount;p.stage='wheel';p.age=0;p.turnStart=model.angle;
      }else if(p.stage==='wheel'&&model.angle-p.turnStart>=Math.PI*6-epsilon){
        const a=model.angle+p.slot*.8;p.stage='loss';p.age=0;p.x=760+57*Math.cos(a);p.y=294+57*Math.sin(a);p.dx=4;
      }else if(p.stage==='loss'&&p.age>=8-epsilon){model.environment+=p.amount;p.amount=0;p.stage='spent';p.age=0;}
    }
    if(!fire&&model.waterOrder.length&&model.idleAge>=14-epsilon){const oldestId=model.waterOrder.shift();cool(model.packets.find(p=>p.id===oldestId));model.idleAge=8;}
    model.temperature=20+model.waterOrder.length*20;
    if(model.pressure<1e-4)model.pressure=0; // negligible tail, never a visible drop on cooling
    steamModelFillReserve(model);
  }
  return model;
}
function steamModelStep(model,seconds,efficiency){return steamModelAdvance(model,seconds,efficiency);}
