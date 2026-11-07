/* Deterministic schematic gas motion and contact-driven GM ionisation.
 * Coordinates: detector-local millimetres. Sizes and times are illustrative.
 * No numerical electric-field, atomic-orbital or gas-collision simulation.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.RangerAtomicMotion=api;})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const lerp=(a,b,p)=>a.map((v,i)=>v+(b[i]-v)*p);
  const finite=(v,fallback)=>Number.isFinite(v)?v:fallback;
  const GAS_RADIUS=21.2,GAS_Z_MIN=-5.4,GAS_Z_MAX=5.4;
  function hash(n,seed){let x=(Math.imul(n+1,374761393)^Math.imul(seed|0,668265263))>>>0;x=Math.imul(x^(x>>>13),1274126177);return((x^(x>>>16))>>>0)/4294967296;}
  function normalize(config){config=config||{};const collisionAt=finite(config.collisionAt,2),electronAt=Math.max(collisionAt,finite(config.electronAt,collisionAt+.35)),ionAt=Math.max(collisionAt,finite(config.ionAt,electronAt+.4)),avalancheAt=Math.max(electronAt+.1,finite(config.avalancheAt,electronAt+3)),pulseAt=Math.max(avalancheAt+.8,finite(config.pulseAt,avalancheAt+4.5)),readyAt=Math.max(pulseAt+.5,finite(config.readyAt,pulseAt+5)),radiationStart=Math.min(collisionAt-.001,finite(config.radiationStart,collisionAt-2)),windowAt=Number.isFinite(config.windowAt)?clamp(config.windowAt,radiationStart+.0001,collisionAt-.0001):null;return{collisionAt,electronAt,ionAt,avalancheAt,pulseAt,readyAt,radiationStart,windowAt,seed:Math.trunc(finite(config.seed,7391)),gasTime:config.gasTime};}
  function gasVelocity(index,c,afterNeutralization=false){
    const salt=afterNeutralization?901:101,h=n=>hash(index*19+salt+n,c.seed),angle=h(0)*Math.PI*2,speed=.35+h(1)*.4;
    return[Math.cos(angle)*speed,Math.sin(angle)*speed,(afterNeutralization?-1:h(2)<.5?-1:1)*(.16+h(3)*.20)];
  }
  function fly(anchor,velocity,elapsed){
    // Seeded ballistic billiards: straight free flight and specular reflection
    // on the cylindrical wall/cathode. Negative elapsed time reconstructs the
    // same continuous flight backwards from a known collision contact.
    const p=anchor.slice(),v=velocity.map(x=>x*(elapsed<0?-1:1));let remaining=Math.abs(elapsed);
    for(let bounce=0;remaining>1e-10&&bounce<4096;bounce++){
      const a=v[0]*v[0]+v[1]*v[1],b=p[0]*v[0]+p[1]*v[1],radialError=p[0]*p[0]+p[1]*p[1]-GAS_RADIUS*GAS_RADIUS;
      const wall=a>1e-16?Math.max(0,(-b+Math.sqrt(Math.max(0,b*b-a*radialError)))/a):Infinity;
      const cap=Math.abs(v[2])>1e-16?Math.max(0,((v[2]>0?GAS_Z_MAX:GAS_Z_MIN)-p[2])/v[2]):Infinity;
      const step=Math.min(remaining,wall,cap);
      for(let k=0;k<3;k++)p[k]+=v[k]*step;
      remaining-=step;if(remaining<=1e-10)break;
      if(wall<=step+1e-9){const r=Math.hypot(p[0],p[1]),nx=p[0]/r,ny=p[1]/r,dot=v[0]*nx+v[1]*ny;v[0]-=2*dot*nx;v[1]-=2*dot*ny;}
      if(cap<=step+1e-9)v[2]*=-1;
    }
    const r=Math.hypot(p[0],p[1]);if(r>GAS_RADIUS){p[0]*=GAS_RADIUS/r;p[1]*=GAS_RADIUS/r;}p[2]=clamp(p[2],GAS_Z_MIN,GAS_Z_MAX);return p;
  }
  function freeAtomPosition(index,time,c){
    if(index===0)return fly([3,0,-.35],gasVelocity(index,c),time-c.collisionAt);
    const h=n=>hash(index*23+n,c.seed),r=Math.sqrt(h(0))*20.8,angle=h(1)*Math.PI*2;
    return fly([Math.cos(angle)*r,Math.sin(angle)*r,GAS_Z_MIN+(GAS_Z_MAX-GAS_Z_MIN)*h(2)],gasVelocity(index,c),time);
  }
  function anodePoint(position,angleOffset=0){const angle=Math.atan2(position[1],position[0])+angleOffset;return[Math.cos(angle)*13.8,Math.sin(angle)*13.8,.2];}
  function targetAtomPosition(index,time,c,event,arrivalOverride){
    const arrival=finite(arrivalOverride,ionArrival(event,c));
    if(time>=arrival)return fly([event.position[0],event.position[1],GAS_Z_MAX],gasVelocity(index,c,true),time-arrival);
    return fly(event.position,gasVelocity(index,c),time-event.time);
  }
  function atomPosition(index,time,config){
    const c=normalize(config);
    return index<=15?targetAtomPosition(index,time,c,schedule(c).events[index]):freeAtomPosition(index,time,c);
  }
  function schedule(config){
    const c=normalize(config),position=freeAtomPosition(0,c.collisionAt,c),events=[{index:0,type:'primary',atomIndex:0,parentElectron:null,time:c.collisionAt,position,anodeTarget:anodePoint(position)}],plan={config:c,events};
    const span=c.pulseAt-c.avalancheAt-.20;
    for(let index=1;index<=15;index++){
      const generation=Math.floor(Math.log2(index)),parentElectron=index-Math.pow(2,generation);
      const fraction=.10+generation*.22+hash(index+300,c.seed)*.018;
      const time=c.avalancheAt+span*fraction;
      const position=electronPosition(parentElectron,time,plan);
      // Each electron keeps one straight forward path. A child opens a small
      // fan on the same side; successive generations use smaller angles, so
      // branches never zigzag between independently scattered target atoms.
      const parentTarget=events[parentElectron].anodeTarget,parentAngle=Math.atan2(parentTarget[1],parentTarget[0]);
      // Cap the opening even for unusually compressed cue timings: the radial
      // derivative of the chord stays positive when R*cos(turn)>birthRadius.
      const radialAngle=Math.atan2(position[1],position[0]),forwardLimit=radialAngle+Math.acos(clamp(Math.hypot(position[0],position[1])/13.8));
      const angle=parentAngle+Math.min(.19*Math.pow(.32,generation),Math.max(0,(forwardLimit-parentAngle)*.6));
      events.push({index,type:'secondary',atomIndex:index,parentElectron,generation,time,position,anodeTarget:[Math.cos(angle)*13.8,Math.sin(angle)*13.8,.2]});
    }
    return{config:c,events};
  }
  function electronPosition(index,time,plan,override){
    const birth=plan.events[index],c=plan.config;
    const recoilDuration=index===0?Math.max(0,Math.min(.25,c.electronAt-birth.time)):0;
    // Brief, deliberately time-stretched release motion makes the two products
    // distinguishable before the spoken explanation of field-driven drift.
    // Their centres still coincide exactly at the actual collision instant.
    const recoilVector=birth.anodeTarget.map((v,i)=>v-birth.position[i]),recoilLength=Math.hypot(...recoilVector);
    const released=index===0&&recoilDuration>0?birth.position.map((v,i)=>v+recoilVector[i]/recoilLength*2):birth.position;
    if(index===0&&time<=c.electronAt)return lerp(birth.position,released,recoilDuration>0?clamp((time-birth.time)/recoilDuration):0);
    const start=index===0?c.electronAt:birth.time;
    // An optional explanatory scrub stays within the pre-avalanche segment;
    // scheduled contacts themselves always use the unmodified model clock.
    if(index===0&&time<c.avalancheAt&&Number.isFinite(override))time=start+clamp(override)*(c.avalancheAt-start);
    return lerp(released,birth.anodeTarget,clamp((time-start)/(c.pulseAt-start)));
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
      const arrivalOverride=index===0&&neutralized[index]?Math.min(time,arrivals[index]):undefined;
      atoms.push({index,position:event?targetAtomPosition(index,gasTime,c,event,arrivalOverride):freeAtomPosition(index,gasTime,c),visible:!reacted});
    }
    for(const event of plan.events){
      const born=time>=event.time;
      electrons.push({index:event.index,bornAt:event.time,anodeTarget:event.anodeTarget.slice(),position:electronPosition(event.index,time,plan,event.index===0?overrides.electron:undefined),visible:born&&time<c.pulseAt});
      const start=Math.max(event.time,c.ionAt),progress=time<=start?0:event.index===0&&Number.isFinite(overrides.ion)?clamp(overrides.ion):clamp((time-start)/Math.max(.001,arrivals[event.index]-start));
      ions.push({index:event.index,bornAt:event.time,neutralizedAt:arrivals[event.index],neutralized:neutralized[event.index],driftProgress:progress,position:lerp(event.position,[event.position[0],event.position[1],GAS_Z_MAX],progress),visible:born&&!neutralized[event.index]});
    }
    const contact=plan.events[0].position,radiationProgress=clamp((time-c.radiationStart)/(c.collisionAt-c.radiationStart));
    const radiationStart=[contact[0],contact[1],-45],windowPlaneZ=-7.9,windowPosition=[contact[0],contact[1],windowPlaneZ];
    const windowCrossingAt=c.windowAt===null?c.radiationStart+(c.collisionAt-c.radiationStart)*(windowPlaneZ-radiationStart[2])/(contact[2]-radiationStart[2]):c.windowAt;
    const radiationPosition=c.windowAt===null?lerp(radiationStart,contact,radiationProgress):time<=windowCrossingAt?lerp(radiationStart,windowPosition,clamp((time-c.radiationStart)/(windowCrossingAt-c.radiationStart))):lerp(windowPosition,contact,clamp((time-windowCrossingAt)/(c.collisionAt-windowCrossingAt)));
    const events=plan.events.map(event=>({...event,position:event.position.slice(),occurred:time>=event.time,projectileAtContact:event.parentElectron===null?contact.slice():electronPosition(event.parentElectron,event.time,plan),electronAtBirth:event.position.slice(),ionAtBirth:event.position.slice()}));
    const remainingIons=ions.filter(ion=>ion.visible).length,totalBorn=ions.filter(ion=>time>=ion.bornAt).length;
    return{time,config:c,space:'sensor-local-mm',atoms,electrons,ions,events,primary:events[0],radiation:{position:radiationPosition,start:radiationStart,contact:contact.slice(),visible:time>=c.radiationStart&&time<=c.collisionAt,windowPlaneZ,windowPosition,windowCrossingAt,enteredWindow:time>=windowCrossingAt},fieldStrength:field.fieldStrength,measurementReady:field.measurementReady,avalanchePermitted:field.measurementReady,recovered:field.measurementReady,neutralization:{remainingIons,totalBorn,allNeutralized:totalBorn===events.length&&remainingIons===0,lastArrivalAt:Math.max(...arrivals)},fieldIsQualitative:true};
  }
  return{evaluate,atomPosition,schedule,normalize};
});
