const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../dynamot-labor-szene.js'),'utf8');
const raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8'),box={};
vm.runInNewContext(source.slice(source.indexOf('export function createFlowTracker'),source.indexOf('export function createLabScene')).replace('export ','')+';this.createFlowTracker=createFlowTracker;'+raw.slice(raw.indexOf('/* MODEL_START */'),raw.indexOf('/* MODEL_END */'))+';this.step=step;',box);
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
const tracker=box.createFlowTracker(),a={current:.5},b={current:-.25};tracker.update([a,b],60);tracker.update([a,b],60.1);near(tracker.phase(a),.915);near(tracker.phase(b),.055);
const paused=tracker.phase(a);a.current=-.5;tracker.update([a,b],60.1);near(tracker.phase(a),paused);tracker.update([a,b],60.2);near(tracker.phase(a),0);
a.current=0;tracker.update([a,b],61);near(tracker.phase(a),0);
const bBefore=tracker.phase(b);tracker.update([b],61);near(tracker.phase(b),bBefore);const fresh={current:.5};tracker.update([b,fresh],61);near(tracker.phase(fresh),0);
tracker.update([b,fresh],0);near(tracker.phase(fresh),0);tracker.update([b,fresh],.1);near(tracker.phase(fresh),.915);
console.log('Electron phase: 0.4 kg at absolute times 0/30/60, weight reset, pause, reversal, zero current, remove/new cable, clock reset passed.');
