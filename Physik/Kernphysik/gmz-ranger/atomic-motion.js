/* Deterministic schematic gas motion and contact-driven GM ionisation.
 * Coordinates: detector-local millimetres. Sizes and times are illustrative.
 * No numerical electric-field, atomic-orbital or gas-collision simulation.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.RangerAtomicMotion=api;})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const lerp=(a,b,p)=>a.map((v,i)=>v+(b[i]-v)*p);
  const finite=(v,fallback)=>Number.isFinite(v)?v:fallback;
  function hash(n,seed){let x=(Math.imul(n+1,374761393)^Math.imul(seed|0,668265263))>>>0;x=Math.imul(x^(x>>>13),1274126177);return((x^(x>>>16))>>>0)/4294967296;}
  function normalize(config){config=config||{};const collisionAt=finite(config.collisionAt,2),electronAt=Math.max(collisionAt,finite(config.electronAt,collisionAt+.35)),ionAt=Math.max(collisionAt,finite(config.ionAt,electronAt+.4)),avalancheAt=Math.max(electronAt+.1,finite(config.avalancheAt,electronAt+3)),pulseAt=Math.max(avalancheAt+.8,finite(config.pulseAt,avalancheAt+4.5)),readyAt=Math.max(pulseAt+.5,finite(config.readyAt,pulseAt+5));return{collisionAt,electronAt,ionAt,avalancheAt,pulseAt,readyAt,radiationStart:finite(config.radiationStart,collisionAt-2),seed:Math.trunc(finite(config.seed,7391)),gasTime:config.gasTime};}
  function atomPosition(index,time,config){
    const seed=config.seed===undefined?7391:config.seed;
    const h=n=>hash(index*11+n,seed),f=.65+h(1)*.65;
    let base,amp;
    if(index===0){base=[3,0,-.35];amp=[1.05,.9,.65];}
    else if(index<=15){const r=11.95+h(2)*.60,a=-.20+h(3)*.75;base=[Math.cos(a)*r,Math.sin(a)*r,(h(4)-.5)*1.2];amp=[.27,.30,.55];}
    else{const r=Math.sqrt((index-15-.5)/36)*19.5,a=index*2.39996323+h(5)*.5;base=[Math.cos(a)*r,Math.sin(a)*r,0];amp=[1.1,1.1,2.8];}
    const p=base.map((v,k)=>v+amp[k]*(.72*Math.sin(time*f*(1+k*.17)+h(k+6)*Math.PI*2)+.28*Math.sin(time*f*1.93+h(k+9)*Math.PI*2)));
    const radius=Math.hypot(p[0],p[1]);if(radius>21.2){p[0]*=21.2/radius;p[1]*=21.2/radius;}p[2]=clamp(p[2],-3.5,3.5);return p;
  }
  function anodePoint(position){const radius=Math.hypot(position[0],position[1])||1;return[position[0]/radius*13.8,position[1]/radius*13.8,.2];}
  function schedule(config){
    const c=normalize(config),events=[{index:0,type:'primary',atomIndex:0,parentElectron:null,time:c.collisionAt,position:atomPosition(0,c.collisionAt,c)}];
    const span=c.pulseAt-c.avalancheAt-.20;
    for(let index=1;index<=15;index++){
      const generation=Math.floor(Math.log2(index)),parentElectron=index-Math.pow(2,generation);
      const fraction=.10+generation*.22+hash(index+300,c.seed)*.018;
      const time=c.avalancheAt+span*fraction;
      events.push({index,type:'secondary',atomIndex:index,parentElectron,generation,time,position:atomPosition(index,time,c)});
    }
    return{config:c,events};
  }
  function electronPosition(index,time,plan,override){
    const birth=plan.events[index],c=plan.config;
    const recoilDuration=index===0?Math.max(0,Math.min(.25,c.electronAt-birth.time)):0;
    // Brief, deliberately time-stretched release motion makes the two products
    // distinguishable before the spoken explanation of field-driven drift.
    // Their centres still coincide exactly at the actual collision instant.
    const recoilVector=[-.7161,1.8414,.3069],recoilLength=Math.hypot(...recoilVector);
    const released=index===0&&recoilDuration>0?birth.position.map((v,i)=>v+recoilVector[i]/recoilLength*2):birth.position;
    if(index===0&&time<=c.electronAt)return lerp(birth.position,released,recoilDuration>0?clamp((time-birth.time)/recoilDuration):0);
    const nodes=[{time:index===0?c.electronAt:birth.time+.04,position:released}];
    for(const event of plan.events)if(event.parentElectron===index)nodes.push({time:event.time,position:event.position});
    const last=nodes[nodes.length-1];nodes.push({time:c.pulseAt,position:anodePoint(last.position)});
    // Optional primary drift override is restricted to the pre-avalanche path;
    // scheduled secondary contacts always retain their exact event positions.
    if(index===0&&time<c.avalancheAt&&Number.isFinite(override))time=nodes[0].time+clamp(override)*(nodes[1].time-nodes[0].time);
    if(time<=nodes[0].time)return released.slice();
    for(let i=1;i<nodes.length;i++)if(time<=nodes[i].time){const u=clamp((time-nodes[i-1].time)/(nodes[i].time-nodes[i-1].time));return lerp(nodes[i-1].position,nodes[i].position,u);}
    return nodes[nodes.length-1].position.slice();
  }
  function fieldState(time,c){
    // Purely didactic indicator near the anode, not a solved field or voltage.
    // Remaining positive ions need not all reach the cathode for detection to
    // become possible again. The display threshold has no physical units.
    const threshold=.78,minimum=.28,duration=c.readyAt-c.pulseAt,smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
    let strength;
    if(time<c.pulseAt)strength=1-(1-minimum)*smooth((time-(c.pulseAt-.5))/.5);
    else if(time<=c.readyAt)strength=minimum+(threshold-minimum)*smooth((time-c.pulseAt)/duration);
    else strength=threshold+(1-threshold)*smooth((time-c.readyAt)/Math.max(.5,duration*.18));
    return{fieldStrength:strength,measurementReady:strength>=threshold-1e-12,qualitative:true};
  }
  function ionArrival(event,c){
    // Deliberately different collection times straddle readyAt. This separates
    // sufficient field recovery from complete positive-ion collection.
    const fraction=.70+event.index/15*.72+(hash(event.index+711,c.seed)-.5)*.04;
    return Math.max(Math.max(event.time,c.ionAt)+.25,c.pulseAt+(c.readyAt-c.pulseAt)*fraction);
  }
  function evaluate(time,options){
    const plan=schedule(options),c=plan.config;time=finite(time,0);
    const overrides=options&&options.chargeProgress||{},atoms=[],electrons=[],ions=[];
    const field=fieldState(time,c),arrivals=plan.events.map(event=>ionArrival(event,c));
    const neutralized=plan.events.map((event,index)=>time>=arrivals[index]||(index===0&&time>Math.max(event.time,c.ionAt)&&Number.isFinite(overrides.ion)&&overrides.ion>=1));
    for(let index=0;index<52;index++){
      const event=plan.events[index],reacted=!!event&&time>=event.time&&!neutralized[index];
      // Ambient-only gasTime never changes a future collision target's path.
      const gasTime=index>15&&time>c.collisionAt?finite(c.gasTime,time):time;
      atoms.push({index,position:atomPosition(index,gasTime,c),visible:!reacted});
    }
    for(const event of plan.events){
      const born=time>=event.time;
      electrons.push({index:event.index,bornAt:event.time,position:electronPosition(event.index,time,plan,event.index===0?overrides.electron:undefined),visible:born&&time<c.pulseAt});
      const start=Math.max(event.time,c.ionAt),progress=time<=start?0:event.index===0&&Number.isFinite(overrides.ion)?clamp(overrides.ion):clamp((time-start)/Math.max(.001,arrivals[event.index]-start));
      ions.push({index:event.index,bornAt:event.time,neutralizedAt:arrivals[event.index],neutralized:neutralized[event.index],driftProgress:progress,position:lerp(event.position,[event.position[0],event.position[1],5.4],progress),visible:born&&!neutralized[event.index]});
    }
    const contact=plan.events[0].position,radiationProgress=clamp((time-c.radiationStart)/(c.collisionAt-c.radiationStart));
    const radiationStart=[contact[0],contact[1],-45],radiationPosition=lerp(radiationStart,contact,radiationProgress);
    const events=plan.events.map(event=>({...event,position:event.position.slice(),occurred:time>=event.time,projectileAtContact:event.parentElectron===null?contact.slice():electronPosition(event.parentElectron,event.time,plan),electronAtBirth:event.position.slice(),ionAtBirth:event.position.slice()}));
    const remainingIons=ions.filter(ion=>ion.visible).length,totalBorn=ions.filter(ion=>time>=ion.bornAt).length;
    return{time,config:c,space:'sensor-local-mm',atoms,electrons,ions,events,primary:events[0],radiation:{position:radiationPosition,start:radiationStart,contact:contact.slice(),visible:time>=c.radiationStart&&time<=c.collisionAt},fieldStrength:field.fieldStrength,measurementReady:field.measurementReady,avalanchePermitted:field.measurementReady,recovered:field.measurementReady,neutralization:{remainingIons,totalBorn,allNeutralized:totalBorn===events.length&&remainingIons===0,lastArrivalAt:Math.max(...arrivals)},fieldIsQualitative:true};
  }
  return{evaluate,atomPosition,schedule,normalize};
});
