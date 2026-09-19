(function(global){
 'use strict';
 const plans={v1:[['M1','motor','crank'],['L1','lamp',null]],v4:[['M1','motor','weight'],['L1','lamp',null]],v2:[['M1','motor','crank'],['M2','motor','crank']],v3:[['M1','motor','crank'],['M2','motor','weight']]};
 function next(state,pending){
  const plan=plans[state.activeMode||state.mode];if(!plan||state.buildLocked)return null;
  for(const [slot,type,accessory]of plan){
   const d=state.devices.find(d=>d.slot===slot);
   if(!d)return {text:type==='motor'?'Platziere hier einen DynaMot.':'Platziere hier die Lampe.',kind:'slot',id:slot};
   if(accessory&&!d[accessory])return {text:accessory==='crank'?'Tippe den DynaMot an und bringe die Kurbel an.':'Tippe den DynaMot an und bringe Seilrolle und Gewicht an.',kind:'device',id:d.id,action:accessory==='crank'?'attach-crank':'attach-weight'};
  }
  const a=state.devices.find(d=>d.slot===plan[0][0]),b=state.devices.find(d=>d.slot===plan[1][0]);
  // The lamp's color order is mirrored relative to the motor's local X axis.
  // Continue an already started old color-matched circuit without rewriting it.
  const oldLampCable=b.type==='lamp'&&state.wires.some(w=>((w.a===a.id&&w.b===b.id)||(w.a===b.id&&w.b===a.id))&&w.ap===w.bp);
  const receiverPin=pin=>b.type==='lamp'&&!oldLampCable?1-pin:pin;
  const paired=pin=>state.wires.some(w=>w.a===a.id&&w.ap===pin&&w.b===b.id&&w.bp===receiverPin(pin)||w.b===a.id&&w.bp===pin&&w.a===b.id&&w.ap===receiverPin(pin));
  for(const pin of [0,1])if(!paired(pin)){
   const bp=receiverPin(pin);
   if(pending&&(pending.a===a.id&&pending.ap===pin||pending.a===b.id&&pending.ap===bp)){
    const id=pending.a===a.id?b.id:a.id,targetPin=id===b.id?bp:pin;
    return {text:`Tippe jetzt die ${targetPin?'schwarze':'rote'} Buchse am anderen Gerät an.`,kind:'port',id,pin:targetPin};
   }
   if(pending)return {text:'Brich das begonnene Kabel durch erneutes Antippen ab. Folge danach den markierten Buchsen.',kind:'port',id:pending.a,pin:pending.ap};
   return {text:b.type==='lamp'&&!oldLampCable?`Verbinde die Buchsen auf derselben Tischseite. Tippe zuerst die ${pin?'schwarze':'rote'} Buchse am DynaMot an.`:`Verbinde die ${pin?'schwarzen':'roten'} Buchsen. Tippe zuerst diese Buchse an.`,kind:'port',id:a.id,pin};
  }
  return {text:'Der Aufbau wird geprüft. Gleich kannst du experimentieren.'};
 }
 function mount(root){
  const lab=root.energyLab,stage=root.querySelector('.stage');if(!lab||!stage||root.dataset.buildHints)return;root.dataset.buildHints='1';
  const text=document.createElement('p');text.className='build-hint-text';text.setAttribute('role','status');text.setAttribute('aria-live','polite');stage.before(text);
  const arrow=document.createElement('div');arrow.className='build-hint-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='↓';stage.append(arrow);
  let previous='',timer,lastSample=0;
  function draw(now){
   if(!root.isConnected)return;
   if(now-lastSample>70){lastSample=now;const state=lab.getSnapshot(),hint=next(state,lab.getPendingPort?.());
    const content=hint?.text||(state.buildLocked&&state.activeMode!=='free'?'✓ Aufbau bestätigt. Du kannst jetzt experimentieren.':'');
    if(content!==previous){text.textContent=content;previous=content;}text.hidden=!content;arrow.hidden=true;
    if(hint?.kind){const r=stage.getBoundingClientRect();let p;
     const button=hint.action?stage.querySelector(`[data-action="${hint.action}"]`):hint.kind==='slot'?stage.querySelector(`[data-add-slot="${hint.id}"]`):null;
     if(button&&button.getClientRects().length){const b=button.getBoundingClientRect();p={x:b.left+b.width/2,y:b.top};}
     else p=lab.projectBuildTarget?.(hint.kind,hint.id,hint.pin);
     if(p&&p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom){arrow.style.left=(p.x-r.left)+'px';arrow.style.top=(p.y-r.top-8)+'px';arrow.hidden=false;}
    }
   }
   timer=requestAnimationFrame(draw);
  }
  timer=requestAnimationFrame(draw);return {dispose(){cancelAnimationFrame(timer);text.remove();arrow.remove();}};
 }
 const api={next,mount};if(typeof module!=='undefined'&&module.exports)module.exports=api;global.DynamotBuildHints=api;
})(globalThis);
