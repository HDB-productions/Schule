const test=require('node:test'),assert=require('node:assert/strict'),T=require('./movie-timing.js');
const map=[
 {kind:'original',start:0,end:20,sourceStart:0,sourceEnd:20},
 {kind:'replacement',start:20,end:40,sourceStart:20,sourceEnd:30},
 {kind:'original',start:40,end:70,sourceStart:30,sourceEnd:60},
 {kind:'replacement',start:70,end:75,sourceStart:60,sourceEnd:70},
 {kind:'original',start:75,end:105,sourceStart:70,sourceEnd:100}
];
test('different recording lengths shift later scenes without stretching retained speech',()=>{
 T.validateMap(map,105,100);
 assert.equal(T.sourceTime(10,map),10);assert.equal(T.sourceTime(30,map),25);
 assert.equal(T.sourceTime(40,map),30);assert.equal(T.sourceTime(55,map),45);
 assert.equal(T.sourceTime(72.5,map),65);assert.equal(T.sourceTime(95,map),90);
 assert.equal(T.outputTime(90,map),95);assert.equal(T.outputTime(30,map),40);
 for(let t=0;t<=105;t+=.125)assert.ok(Math.abs(T.outputTime(T.sourceTime(t,map),map)-t)<1e-8);
});
test('maps reject missing coverage, overlap, wrong total and stretching original narration',()=>{
 for(const bad of [map.slice(1),map.slice(0,-1),map.map((s,i)=>i===2?{...s,start:39}:s),map.map((s,i)=>i===0?{...s,kind:'original',sourceEnd:19}:s)])assert.throws(()=>T.validateMap(bad,105,100));
 assert.throws(()=>T.validateMap(null,105,100));assert.throws(()=>T.validateMap(map,104,100));
});
function timeline(){return {duration:105,sourceDuration:100,timeMap:map,sync:{mode:'recording-cues',finalSync:false,requiredEvents:['pair_formed','electron_drift','ion_drift']},eventCues:[
 {id:'pair_formed',time:44,phase:'ionization',from:1,to:1,duration:0},
 {id:'electron_drift',time:47,phase:'drift',channel:'electron',from:0,to:1,duration:1},
 {id:'ion_drift',time:51,phase:'drift',channel:'ion',from:0,to:.12,duration:4}
 ]};}
test('literal word marks use the new speech clock and independently control each charge',()=>{
 const l=T.validate(timeline());
 assert.deepEqual(T.phase(l,43.999),['off',0]);assert.deepEqual(T.phase(l,44),['ionization',1]);
 assert.deepEqual(T.charges(l,47.5),{electron:.5,ion:0});
 assert.deepEqual(T.charges(l,53),{electron:1,ion:.06});
 // Re-seeking backwards must not retain positions reached later.
 T.charges(l,60);assert.deepEqual(T.charges(l,47.5),{electron:.5,ion:0});
 assert.equal(T.sourceTime(44,map),34,'scene source clock intentionally differs from spoken-event clock');
});
test('unfinished, duplicate or out-of-range marks cannot be labelled a completed word-timed cut',()=>{
 const l=timeline();l.eventCues[0].time=null;assert.throws(()=>T.validate(l),/pair_formed/);
 const duplicate=timeline();duplicate.eventCues.push({...duplicate.eventCues[0]});assert.throws(()=>T.validate(duplicate),/eindeutig/);
 const outside=timeline();outside.eventCues[1].time=106;assert.throws(()=>T.validate(outside),/Wortzeit/);
 const preview=timeline();preview.sync={mode:'technical-preview',finalSync:true};assert.throws(()=>T.validate(preview),/Endschnitt/);
});
const presentation=[{source:0,time:0},{source:20,time:15},{source:60,time:80},{source:100,time:105}];
test('presentation anchors retime scenes independently of retained audio and spoken event marks',()=>{
 const l=T.validate({...timeline(),presentationMap:presentation});
 assert.equal(T.presentationSourceTime(15,presentation),20);assert.equal(T.presentationOutputTime(20,presentation),15);
 assert.equal(T.presentationSourceTime(47.5,presentation),40);assert.equal(T.presentationOutputTime(40,presentation),47.5);
 assert.equal(T.sceneTime(15,l),20);assert.equal(T.sourceTime(15,map),15,'Audio mapping remains unchanged');
 assert.deepEqual(T.phase(l,44),['ionization',1],'Events remain on actual speech time');
 assert.equal(T.sceneTime(30,{...l,presentationMap:null}),T.sourceTime(30,map),'Missing presentation map retains previous scene behavior');
 assert.equal(T.sceneTime(30,{...l,presentationMap:undefined}),T.sourceTime(30,map));
 for(let source=0;source<=100;source+=.125)assert.ok(Math.abs(T.presentationSourceTime(T.presentationOutputTime(source,presentation),presentation)-source)<1e-8);
 assert.equal(T.presentationSourceTime(-5,presentation),0);assert.equal(T.presentationSourceTime(120,presentation),100);
 assert.equal(T.presentationOutputTime(-5,presentation),0);assert.equal(T.presentationOutputTime(120,presentation),105);
});
test('presentation maps require strictly increasing finite anchors and exact complete endpoints',()=>{
 const invalid=[[],[presentation[0]],presentation.slice(1),presentation.slice(0,-1),
  presentation.map((a,i)=>i===0?{...a,time:.001}:a),presentation.map((a,i)=>i===0?{...a,source:.001}:a),
  presentation.map((a,i)=>i===2?{...a,source:20}:a),presentation.map((a,i)=>i===2?{...a,time:15}:a),
  presentation.map((a,i)=>i===2?{...a,source:19}:a),presentation.map((a,i)=>i===2?{...a,time:14}:a),
  presentation.map((a,i)=>i===1?{...a,time:NaN}:a),presentation.map((a,i)=>i===1?{...a,source:Infinity}:a),
  presentation.map((a,i)=>i===3?{...a,time:104.999}:a),presentation.map((a,i)=>i===3?{...a,source:99.999}:a)];
 for(const bad of invalid)assert.throws(()=>T.validate({...timeline(),presentationMap:bad}),/Präsentations/);
 T.validatePresentationMap(null,105,100);T.validatePresentationMap(undefined,105,100);
});
function pulseTimeline(signal){
 const l={...timeline(),presentationMap:presentation,beats:[{start:0,phase:'off'},{start:20,phase:'avalanche'},{start:60,phase:'pulse'},{start:80,phase:'deadtime'}]};
 l.eventCues.push({id:'pulse_count',time:44,phase:'pulse',from:0,to:1,duration:1.2});
 if(signal)l.eventCues.push({id:'pulse_signal',time:40});
 return l;
}
test('pulse display can begin at the word cue before the pulse scene without resetting the counter at scene boundaries',()=>{
 const l=T.validate(pulseTimeline(false));
 assert.equal(T.sceneTime(44,l)<60,true,'Pulse scene has not begun at the count cue');
 assert.equal(T.pulseDisplay(l,43.999).visible,false);assert.equal(T.pulseDisplay(l,43.999).count,0);
 assert.deepEqual(T.pulseDisplay(l,44),{visible:true,count:1,progress:0,signalTime:44,countTime:44,endTime:92.5});
 assert.equal(T.pulseDisplay(l,79.999).count,1);assert.equal(T.pulseDisplay(l,80).count,1);assert.equal(T.pulseDisplay(l,80).visible,true);
 assert.equal(T.pulseDisplay(l,92.499).visible,true);assert.equal(T.pulseDisplay(l,92.5).visible,false);assert.equal(T.pulseDisplay(l,92.5).count,1);
 T.pulseDisplay(l,95);assert.equal(T.pulseDisplay(l,43.999).count,0,'Backward seek cannot retain a later count');
 const old={...l,presentationMap:null};assert.equal(T.pulseDisplay(old,44).endTime,85,'Without presentation map, end still follows audio mapping');
});
test('optional signal cue starts pulse before registration and cannot reset at the later count cue',()=>{
 const l=T.validate(pulseTimeline(true));
 assert.equal(T.pulseDisplay(l,39.999).visible,false);
 assert.deepEqual(T.pulseDisplay(l,40),{visible:true,count:0,progress:0,signalTime:40,countTime:44,endTime:92.5});
 assert.equal(T.pulseDisplay(l,42).progress,.5);assert.equal(T.pulseDisplay(l,43.999).count,0);
 assert.equal(T.pulseDisplay(l,44).count,1);assert.equal(T.pulseDisplay(l,44).progress,1);assert.equal(T.pulseDisplay(l,45).progress,1);
 assert.deepEqual(T.phase(l,40),['pulse',0]);assert.deepEqual(T.phase(l,42),['pulse',.5]);assert.deepEqual(T.phase(l,44),['pulse',1]);
 const invalid=pulseTimeline(true);invalid.eventCues.find(c=>c.id==='pulse_signal').time=45;assert.throws(()=>T.validate(invalid),/Registrierung/);
 const explicit=pulseTimeline(true);Object.assign(explicit.eventCues.find(c=>c.id==='pulse_signal'),{duration:2});assert.equal(T.pulseDisplay(explicit,41).progress,.5);
});
