/* Interactive five-step clock. Every boundary is a real, frozen simulation time. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GMZProcess=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const clock={radiationStart:0,windowAt:1.2,collisionAt:3,electronAt:4,ionAt:4.6,avalancheAt:10,pulseAt:15,readyAt:22};
 const phases=[
  {id:'incoming',title:'1 · Eintritt',start:0,end:1.8,seconds:5},
  {id:'ionization',title:'2 · Ionisation',start:1.8,end:4,seconds:6},
  {id:'drift',title:'3 · Bewegung',start:4,end:10,seconds:7},
  {id:'avalanche',title:'4 · Lawine',start:10,end:15,seconds:7},
  {id:'deadtime',title:'5 · Totzeit',start:15,end:23,seconds:9}
 ];
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
 const mix=(a,b,p)=>a+(b-a)*p,vector=(a,b,p)=>a.map((v,i)=>mix(v,b[i],p));
 function pose(time,atomic){
  const origin=atomic.sensorOrigin||[0,30,-6.9],contact=atomic.primary.position.map((v,i)=>v+origin[i]);
  const zoom=ease((time-1.8)/.85),overview=ease((time-4)/1.2),recovery=ease((time-15)/1.3);
  const target=vector(vector([0,30,-14.8],contact,zoom),[7,30,-6.9],overview);
  return {yaw:mix(2.85,2.2,recovery),pitch:.18,distance:mix(mix(mix(100,18,zoom),65,overview),32,recovery),target:vector(target,[10,31,-3],recovery),explosion:0,microscopic:zoom,windowVisibility:1-zoom,fieldVisibility:ease((time-15)/.7)};
 }
 function frame(index,elapsed){const phase=phases[index],p=clamp(elapsed/phase.seconds);return{time:mix(phase.start,phase.end,p),progress:p,finished:p===1};}
 return{clock,phases,pose,frame};
});
