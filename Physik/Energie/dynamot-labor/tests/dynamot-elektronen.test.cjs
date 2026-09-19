const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../dynamot-labor-szene.js'),'utf8');
const raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8'),box={};
vm.runInNewContext(source.slice(source.indexOf('export function createFlowTracker'),source.indexOf('export function createLabScene')).replaceAll('export ','')+';this.createFlowTracker=createFlowTracker;this.alignChargePhases=alignChargePhases;'+raw.slice(raw.indexOf('/* MODEL_START */'),raw.indexOf('/* MODEL_END */'))+';this.step=step;',box);
const near=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);
function falling(offset){
 const tracker=box.createFlowTracker(),d={id:1,type:'motor',omega:0,angle:0,weight:true,crank:false,hand:false,rate:15,mass:.4,height:1},l={id:2,type:'lamp'},w=[{a:1,ap:0,b:2,bp:0},{a:1,ap:1,b:2,bp:1}],samples=[];
 tracker.update(w,offset);
 for(let n=1;n<=1000;n++){box.step([d,l],w,.005);tracker.update(w,offset+n*.005);samples.push(tracker.phase(w[0]));}
 // The UI raise path sets omega to zero and restores height, preserving the clock.
 d.omega=0;d.height=1.2;w.forEach(x=>x.current=0);const before=tracker.phase(w[0]);tracker.update(w,offset+5);near(tracker.phase(w[0]),before);
 for(let n=1;n<=100;n++){box.step([d,l],w,.005);tracker.update(w,offset+5+n*.005);samples.push(tracker.phase(w[0]));}
 return samples;
}
const baseline=falling(0);for(const offset of [30,60])falling(offset).forEach((v,i)=>near(v,baseline[i]));
const tracker=box.createFlowTracker(),a={current:.5},b={current:-.25};tracker.update([a,b],60);tracker.update([a,b],60.1);near(tracker.phase(a),.64);near(tracker.phase(b),.03);
const paused=tracker.phase(a);a.current=-.5;tracker.update([a,b],60.1);near(tracker.phase(a),paused);tracker.update([a,b],60.2);near(tracker.phase(a),0);
a.current=0;tracker.update([a,b],61);near(tracker.phase(a),0);
const bBefore=tracker.phase(b);tracker.update([b],61);near(tracker.phase(b),bBefore);const fresh={current:.5};tracker.update([b,fresh],61);near(tracker.phase(fresh),0);
tracker.update([b,fresh],0);near(tracker.phase(fresh),0);tracker.update([b,fresh],.1);near(tracker.phase(fresh),.64);
console.log('Electron phase: 0.4 kg at absolute times 0/30/60, weight reset, pause, reversal, zero current, remove/new cable, clock reset passed.');

// Spatial offsets continue through a lamp despite opposite endpoint storage.
const aligned=box.alignChargePhases([{key:'wire0',a:'m0',b:'l0',length:4.3,phase:.2},{key:'lamp',a:'l0',b:'l1',length:3.1,phase:.4},{key:'wire1',a:'m1',b:'l1',length:7.8,phase:.5}]);
near(aligned.get('lamp'),.1);near(aligned.get('wire1'),.3);
const flux=box.createFlowTracker(),small={current:.1},large={current:.2};flux.update([small,large],0);flux.update([small,large],.1);near(flux.spacing-flux.phase(large),2*(flux.spacing-flux.phase(small)));
console.log('Spatial charge phase: same spacing, proportional branch speed and continuous two-contact lamp chain passed.');

const branch=box.alignChargePhases([{key:'a',a:'motor0',b:'lampA',length:4,phase:.2},{key:'b',a:'motor0',b:'lampB',length:9,phase:.2}],.7,['motor0']);near(branch.get('a'),branch.get('b'));
