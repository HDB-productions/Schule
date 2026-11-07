/* CPU-only wiring tests. No browser, WebGL, media render or external requests. */
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),timing=require('./movie-timing.js');
function fixture(signal=true){
 const beat=(start,mode,phase)=>({start,mode,phase,title:'Scene '+start,text:'Text',tag:'Tag',points:[]});
 const cues=[{id:'atom_ejected',time:10,phase:'ionization',from:1,to:1},{id:'electron_drift',time:20,phase:'drift',from:0,to:1,duration:2},{id:'ion_drift',time:25,phase:'drift',from:0,to:.1,duration:2},{id:'avalanche_onset',time:30,phase:'avalanche',from:0,to:1,duration:4},{id:'pulse_count',time:44,phase:'pulse',from:0,to:1,duration:1.2},{id:'deadtime_end',time:95,phase:'deadtime',from:1,to:1}];
 if(signal)cues.push({id:'pulse_signal',time:40});
 return{duration:105,sourceDuration:100,timeMap:[{kind:'replacement',start:0,end:105,sourceStart:0,sourceEnd:100}],presentationMap:[{source:0,time:0},{source:20,time:15},{source:60,time:80},{source:100,time:105}],sync:{mode:'recording-cues',requiredEvents:['pulse_count'],finalSync:false},eventCues:cues,chapters:[{start:0,title:'Chapter'}],beats:[beat(0,'exterior','off'),beat(20,'gas','avalanche'),beat(60,'pulse','pulse'),beat(80,'gas','deadtime')]};
}
async function harness(timeline){
 const elements=new Map();
 class Element{constructor(){this.style={};this.attributes={};this.textContent='';this.classList={toggle(){}};this.children=[];}setAttribute(key,value){this.attributes[key]=value;}append(child){this.children.push(child);}replaceChildren(...children){this.children=children;}querySelector(key){this.queries??={};return this.queries[key]??=new Element();}}
 const element=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 class Vector3{constructor(x=0,y=0,z=0){this.set(x,y,z);}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}toArray(){return[this.x,this.y,this.z];}project(){return this.set(0,0,0);}}
 const THREE={Vector3,Box3:class{setFromObject(){return this;}getCenter(v){return v.set(0,0,0);}},SphereGeometry:class{},MeshStandardMaterial:class{constructor(value){Object.assign(this,value);}},Mesh:class{constructor(geometry,material){this.geometry=geometry;this.material=material;this.position=new Vector3();}}};
 const calls={},viewer={renderer:{shadowMap:{}},model:{updateMatrixWorld(){}},parts:{},scene:{children:[],add(){}},camera:{},mechanism:{traverse(){}},resize(){},setExplosion(value){calls.explosion=value;},setMicroscopic(){},setView(){},setPhase(...phase){calls.phase=phase;},setChargeProgress(){},setAtomicClock(clock){calls.clock=clock;},setFieldVisibility(){},setPairCount(){},renderAt(time){calls.time=time;},getAtomicState(){return{fieldStrength:1,measurementReady:true};}};
 const window={THREE,GMZMovieTiming:timing,GMZStaging:{movieRoute(){return[];},sample(route,sourceTime){calls.sceneTime=sourceTime;return{explosion:0,microscopic:0,yaw:0,pitch:0,distance:100,target:[0,0,0]};}},createRangerViewer(){return viewer;}};
 const context={window,THREE,document:{getElementById:element,createElement(){return new Element();},body:new Element(),head:new Element(),fonts:{ready:Promise.resolve()}},location:{search:''},URLSearchParams,innerWidth:1280,addEventListener(){},performance:{now(){return 0;}},requestAnimationFrame(){},fetch:async()=>({ok:true,json:async()=>JSON.parse(JSON.stringify(timeline))})};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'movie.js'),'utf8'),context,{filename:'movie.js'});await window.movieReady;
 return{window,calls,element};
}
test('movie wiring keeps atomic time on speech clock while scenes use presentation anchors',async()=>{
 const h=await harness(fixture()),render=time=>h.window.renderMovieAt(time);
 render(39.999);assert.equal(h.element('signal').style.display,'none');assert.equal(h.element('count-number').textContent,'0');
 const early=render(40);assert.equal(early.phase,'pulse');assert.equal(early.beat,1,'Pulse begins while an earlier visual beat is active');assert.equal(early.sourceTime,timing.sceneTime(40,fixture()));
 assert.equal(h.element('signal').style.display,'block');assert.equal(h.element('event-count').style.display,'block');assert.equal(h.element('count-number').textContent,'0');assert.equal(h.calls.clock.time,40);assert.equal(h.calls.clock.pulseAt,40);
 render(42);const middleWave=h.element('signal').querySelector('path').attributes.d;assert.match(middleWave,/H 135\.5 /);assert.equal(h.element('count-number').textContent,'0');
 render(44);assert.equal(h.element('count-number').textContent,'1');const completeWave=h.element('signal').querySelector('path').attributes.d;
 render(80);assert.equal(h.element('count-number').textContent,'1');assert.equal(h.element('signal').querySelector('path').attributes.d,completeWave,'Later visual pulse beat must not restart the waveform');
 render(92.5);assert.equal(h.element('signal').style.display,'none');assert.equal(h.element('event-count').style.display,'none');assert.equal(h.element('count-number').textContent,'1');
 render(42);assert.equal(h.element('signal').querySelector('path').attributes.d,middleWave);assert.equal(h.element('count-number').textContent,'0');assert.equal(h.calls.clock.time,42);
});
test('configureMovieTiming validates presentation anchors and does not move actual cue times',async()=>{
 const h=await harness(fixture());h.window.renderMovieAt(40);
 assert.throws(()=>h.window.configureMovieTiming({presentationMap:[{source:0,time:0},{source:100,time:104}]}),/Präsentations/);
 const presentationMap=[{source:0,time:0},{source:20,time:25},{source:60,time:80},{source:100,time:105}],changed=h.window.configureMovieTiming({presentationMap});
 assert.equal(changed.sourceTime,timing.presentationSourceTime(40,presentationMap));assert.equal(changed.time,40);assert.equal(h.calls.clock.time,40);assert.equal(h.calls.clock.pulseAt,40);
 const fallback=h.window.configureMovieTiming({presentationMap:null});assert.equal(fallback.sourceTime,timing.sourceTime(40,fixture().timeMap));assert.equal(h.calls.clock.pulseAt,40);
});
test('movie without optional pulse_signal retains pulse_count as atomic pulse timestamp',async()=>{
 const h=await harness(fixture(false));h.window.renderMovieAt(43.999);assert.equal(h.element('signal').style.display,'none');
 h.window.renderMovieAt(44);assert.equal(h.calls.clock.time,44);assert.equal(h.calls.clock.pulseAt,44);assert.equal(h.element('signal').style.display,'block');assert.equal(h.element('count-number').textContent,'1');
});
