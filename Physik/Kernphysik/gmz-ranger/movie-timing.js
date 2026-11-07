/* Two clocks: final speech owns event timing; source time locates retained scenes. */
(function(global){
 'use strict';
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const eps=.002;
 function lastIndex(items,test){for(let i=items.length-1;i>=0;i--)if(test(items[i]))return i;return -1;}
 function validateMap(map,duration,sourceDuration){
  if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(sourceDuration)||sourceDuration<=0)throw Error('Ungültige Filmdauer.');
  if(map===undefined||map===null){if(Math.abs(duration-sourceDuration)>eps)throw Error('Geänderte Tonlänge benötigt eine Zeitzuordnung.');return;}
  if(!Array.isArray(map)||!map.length)throw Error('Leere Zeitzuordnung.');
  let output=0,source=0;
  for(const s of map){
   if(!s||!['original','replacement'].includes(s.kind)||!['start','end','sourceStart','sourceEnd'].every(k=>Number.isFinite(s[k]))||s.end<=s.start||s.sourceEnd<=s.sourceStart||Math.abs(s.start-output)>eps||Math.abs(s.sourceStart-source)>eps)throw Error('Die Zeitzuordnung enthält eine Lücke, Überschneidung oder ungültige Dauer.');
   if(s.kind==='original'&&Math.abs((s.end-s.start)-(s.sourceEnd-s.sourceStart))>eps)throw Error('Die Originalsprache darf nicht zeitlich gedehnt werden.');
   output=s.end;source=s.sourceEnd;
  }
  if(Math.abs(output-duration)>eps||Math.abs(source-sourceDuration)>eps)throw Error('Zeitzuordnung und vollständige Tonlänge passen nicht zusammen.');
 }
 function sourceTime(time,map){
  if(!map)return time;
  const t=clamp(time,0,map[map.length-1].end),index=Math.max(0,lastIndex(map,s=>s.start<=t)),s=map[index];
  return s.sourceStart+clamp((t-s.start)/(s.end-s.start),0,1)*(s.sourceEnd-s.sourceStart);
 }
 function outputTime(time,map){
  if(!map)return time;
  const t=clamp(time,0,map[map.length-1].sourceEnd),index=Math.max(0,lastIndex(map,s=>s.sourceStart<=t)),s=map[index];
  return s.start+clamp((t-s.sourceStart)/(s.sourceEnd-s.sourceStart),0,1)*(s.end-s.start);
 }
 function validatePresentationMap(map,duration,sourceDuration){
  if(map===undefined||map===null)return;
  if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(sourceDuration)||sourceDuration<=0)throw Error('Ungültige Filmdauer.');
  if(!Array.isArray(map)||map.length<2)throw Error('Die Präsentationszuordnung benötigt mindestens zwei Anker.');
  for(let i=0;i<map.length;i++){
   const a=map[i],previous=map[i-1];
   if(!a||!Number.isFinite(a.source)||!Number.isFinite(a.time)||(previous&&(a.source<=previous.source||a.time<=previous.time)))throw Error('Die Präsentationsanker müssen in beiden Zeiten streng steigen.');
  }
  const first=map[0],last=map[map.length-1];
  if(first.source!==0||first.time!==0||last.source!==sourceDuration||last.time!==duration)throw Error('Die Präsentationsanker müssen bei 0 beginnen und beide vollständigen Filmdauern abdecken.');
 }
 function interpolatePresentation(time,map,input,output){
  if(!map)return time;
  const t=clamp(time,map[0][input],map[map.length-1][input]),index=Math.min(map.length-2,Math.max(0,lastIndex(map,a=>a[input]<=t))),a=map[index],b=map[index+1];
  return a[output]+(t-a[input])/(b[input]-a[input])*(b[output]-a[output]);
 }
 function presentationSourceTime(time,map){return interpolatePresentation(time,map,'time','source');}
 function presentationOutputTime(time,map){return interpolatePresentation(time,map,'source','time');}
 function sceneTime(time,timeline){return timeline.presentationMap?presentationSourceTime(time,timeline.presentationMap):sourceTime(time,timeline.timeMap);}
 function sceneOutputTime(time,timeline){return timeline.presentationMap?presentationOutputTime(time,timeline.presentationMap):outputTime(time,timeline.timeMap);}
 function validate(timeline){
  validateMap(timeline.timeMap,timeline.duration,timeline.sourceDuration||207.142);
  validatePresentationMap(timeline.presentationMap,timeline.duration,timeline.sourceDuration||207.142);
  const cues=timeline.eventCues||[];
  if(!Array.isArray(cues)||new Set(cues.map(c=>c?.id)).size!==cues.length)throw Error('Ereignismarken sind nicht eindeutig.');
  for(const c of cues){
   if(!c||typeof c.id!=='string'||(c.time!==null&&c.time!==undefined&&(!Number.isFinite(c.time)||c.time<0||c.time>timeline.duration)))throw Error('Ungültige Wortzeit.');
   for(const k of ['from','to'])if(c[k]!==undefined&&(!Number.isFinite(c[k])||c[k]<0||c[k]>1))throw Error('Ungültiger Ereignisfortschritt.');
   if(c.duration!==undefined&&(!Number.isFinite(c.duration)||c.duration<0))throw Error('Ungültige Ereignisdauer.');
  }
  if(timeline.sync?.mode==='recording-cues'){
   for(const id of timeline.sync.requiredEvents||[]){const c=cues.find(c=>c.id===id);if(!c||!Number.isFinite(c.time))throw Error('Endgültige Wortzeit fehlt: '+id);}
  }else if(timeline.sync?.finalSync)throw Error('Ein Endschnitt benötigt Wortmarken der fertigen Tonfassung.');
  const pulseSignal=cues.find(c=>c.id==='pulse_signal'),pulseCount=cues.find(c=>c.id==='pulse_count');
  if(Number.isFinite(pulseSignal?.time)&&Number.isFinite(pulseCount?.time)&&pulseSignal.time>pulseCount.time)throw Error('Das Impulssignal darf nicht nach seiner Registrierung liegen.');
  return timeline;
 }
 function value(c,time){const p=c.duration?clamp((time-c.time)/c.duration,0,1):1;return (c.from??0)+((c.to??0)-(c.from??0))*p;}
 function latest(cues,time,test){let result=null;for(const c of cues)if(test(c)&&Number.isFinite(c.time)&&c.time<=time&&(!result||c.time>=result.time))result=c;return result;}
 function phase(timeline,time){
  const cues=timeline.eventCues||[],c=latest(cues,time,c=>!!c.phase||c.id==='pulse_signal');if(!c)return['off',0];
  const selected=c.id==='pulse_signal'?'pulse':c.phase,signal=cues.find(c=>c.id==='pulse_signal');
  if(selected==='pulse'&&Number.isFinite(signal?.time)&&time>=signal.time)return['pulse',pulseDisplay(timeline,time).progress];
  return[selected,value(c,time)];
 }
 function charges(timeline,time){
  if(timeline.sync?.mode!=='recording-cues')return null;
  const result={electron:0,ion:0};
  for(const name of ['electron','ion']){const c=latest(timeline.eventCues||[],time,c=>c.channel===name);if(c)result[name]=value(c,time);}
  return result;
 }
 function pulseDisplay(timeline,time){
  const cue=timeline.eventCues?.find(c=>c.id==='pulse_count');
  const countTime=timeline.sync?.mode==='recording-cues'&&Number.isFinite(cue?.time)?cue.time:outputTime(122.19,timeline.timeMap);
  const signal=timeline.sync?.mode==='recording-cues'?timeline.eventCues?.find(c=>c.id==='pulse_signal'&&Number.isFinite(c.time)):null,signalTime=signal?signal.time:countTime;
  const duration=timeline.sync?.mode==='recording-cues'?(signal?.duration??(signal&&countTime>signalTime?countTime-signalTime:cue?.duration??2.8)):2.8,progress=duration?clamp((time-signalTime)/duration,0,1):time>=signalTime?1:0;
  const beats=timeline.beats||[];let index=beats.findIndex(b=>b.phase==='pulse');
  if(index<0)return{visible:false,count:time>=countTime?1:0,progress,signalTime,countTime,endTime:null};
  while(beats[index+1]?.phase==='pulse')index++;
  const sourceEnd=beats[index+1]?.start??timeline.sourceDuration??207.142,endTime=sceneOutputTime(sourceEnd,timeline);
  return{visible:time>=signalTime&&time<endTime,count:time>=countTime?1:0,progress,signalTime,countTime,endTime};
 }
 const api={lastIndex,validateMap,validatePresentationMap,validate,sourceTime,outputTime,presentationSourceTime,presentationOutputTime,sceneTime,sceneOutputTime,phase,charges,pulseDisplay};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.GMZMovieTiming=api;
})(typeof window==='undefined'?globalThis:window);
