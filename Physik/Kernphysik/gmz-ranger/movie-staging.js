/* One continuous spatial route: source narration time, independent of scene captions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GMZStaging=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const mix=(a,b,p)=>a+(b-a)*p;
  const angle=(a,b,p)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*p;
  function interpolate(a,b,p){p=ease(p);return {yaw:angle(a.yaw,b.yaw,p),pitch:mix(a.pitch,b.pitch,p),distance:mix(a.distance,b.distance,p),target:a.target.map((v,i)=>mix(v,b.target[i],p)),explosion:mix(a.explosion||0,b.explosion||0,p),microscopic:mix(a.microscopic||0,b.microscopic||0,p)};}
  function sample(frames,time){if(time<=frames[0].time)return interpolate(frames[0],frames[0],0);for(let i=1;i<frames.length;i++)if(time<=frames[i].time)return interpolate(frames[i-1],frames[i],(time-frames[i-1].time)/(frames[i].time-frames[i-1].time));const last=frames[frames.length-1];return interpolate(last,last,0);}
  function movieRoute(resolvePart){
    const shot=(time,distance,target,yaw=2.85,explosion=0,microscopic=0,part=null)=>({time,distance,target:part?resolvePart(part,explosion):target,yaw,pitch:.18,explosion,microscopic});
    return [
      shot(0,282,[0,0,0],.43),shot(13.72,282,[0,0,0],.98),
      shot(17.54,295,[0,12,0],2.35,.30),
      shot(21.5,140,null,2.85,1,0,'cathode'),shot(22.4,140,null,2.85,1,0,'cathode'),
      shot(23.2,145,null,2.85,1,0,'window'),shot(32,145,null,2.85,1,0,'window'),
      shot(34.06,112,null,2.85,1,0,'anode'),shot(36.5,112,null,2.85,1,0,'anode'),
      shot(39.38,160,null,.45,.40,0,'voltage'),shot(49.48,160,null,.45,.40,0,'voltage'),
      shot(52,155,null,.45,.40,0,'counter'),shot(56.2,155,null,.45,.40,0,'counter'),
      // Pull back before reassembly. Only then reveal the interior and zoom.
      shot(58.2,240,[0,15,0],2.85,.40),shot(60.2,145,[0,30,-6.9],2.85,0),
      shot(62.2,80,[3,30,-6.9],2.85,0,.65),shot(65.4,25,[3,30,-6.9],2.85,0,1),
      shot(87.34,25,[3,30,-6.9],2.85,0,1),shot(93,65,[7,30,-6.9],2.85,0,1),
      shot(118.49,65,[7,30,-6.9],2.85,0,1),shot(123,110,[0,30,-6.9],2.85,0,.8),
      shot(131.57,110,[0,30,-6.9],2.85,0,.8),shot(136.05,85,[0,30,-6.9],2.85,0,1),
      shot(151,85,[0,30,-6.9],2.85,0,1),shot(156,85,[0,30,-6.9],2.2,0,1),
      shot(195,85,[0,30,-6.9],2.2,0,1),shot(199.8,145,[0,30,-6.9],2.85,0,.65),
      shot(203.5,240,[0,8,0],1.35,0,0),shot(207.142,282,[0,0,0],.43,0,0)
    ];
  }
  return {ease,interpolate,sample,movieRoute};
});
