// PBR 3D exposures on analytical trajectories. Model loading is shared by all players.
const MotionVisuals=(()=>{
 const names={ball:'Ballbewegung',uniform:'Spur A',accelerated:'Spur B'},seconds=t=>t.toFixed(2).replace('.',',')+' s';
 function html(kind){const c=MotionModel.config(kind);return `<section class="motion-player" data-motion="${kind}" aria-label="${names[kind]} als Zeitlupe">
 <div class="motion-toolbar"><strong>${names[kind]}</strong>${MotionClock.html(kind)}<span class="motion-flash" aria-hidden="true"><svg viewBox="0 0 20 24" style="width:14px;height:19px" fill="currentColor"><path d="M12 1L2 13h7l-1 10L19 9h-7z"/></svg></span><span class="motion-interval">Blitz alle ${seconds(c.dt)}</span></div>
 <canvas width="${c.width}" height="${kind==='ball'?520:180}" role="img" aria-label="${names[kind]}: Bewegungsphasen in gleichen Zeitabständen.">Dein Browser unterstützt die Animation nicht.</canvas>
 <div class="motion-actions"><button type="button" data-play disabled>Zeitlupe starten</button><button type="button" data-pause class="secondary" disabled>Pause</button><button type="button" data-final class="secondary" disabled>Stroboskopbild anzeigen</button></div>
 <p class="motion-status" data-motion-status role="status">Bildmaterial wird geladen …</p><details class="motion-records"><summary>Festgehaltene Aufnahmezeiten <span data-record-count>0</span></summary><ol data-times></ol></details></section>`;}
 async function assets(){return MotionStudio.create();}
 function player(host,studio){
  const kind=host.dataset.motion,c=MotionModel.config(kind),canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw Error('Die Zeichenfläche ist hier nicht verfügbar.');

  const $=s=>host.querySelector(s),clock=$('[data-clock]'),status=$('[data-motion-status]'),play=$('[data-play]'),pause=$('[data-pause]'),final=$('[data-final]'),times=$('[data-times]');
  let time=0,mode='ready',raf=0,lastWall=0,lastCount=-1;
  const slowFactor=kind==='ball'?.18:.14;
  const view=studio.view(kind,canvas.width,canvas.height);
  host.dataset.engine=view.renderer;host.dataset.wheels=String(view.wheelCount);host.dataset.wheelRadius=String(view.wheelRadius);
  if(kind!=='ball')host.dataset.vehicle=STROBE_CAR_METADATA.asset.extras.title;
  function exposure(p,opacity){ctx.save();ctx.globalAlpha=opacity;ctx.drawImage(view.snapshot(p.t),0,0);ctx.restore();}
  function render(){
   const records=MotionModel.ghosts(kind,time),p=MotionModel.sample(kind,time),latest=records.at(-1);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(view.background,0,0);records.forEach(s=>exposure(s,s.opacity));
   if((mode==='running'||mode==='paused')&&Math.abs(p.t-latest.t)>.002){ctx.save();ctx.globalAlpha=.97;ctx.drawImage(view.render(p.t),0,0);ctx.restore();}
   host.dataset.wheelAngles=JSON.stringify(view.wheelAngles());
   MotionClock.update(host,time);host.classList.toggle('is-flashing',mode==='running'&&time-latest.t<slowFactor*.045);
   host.dataset.time=time.toFixed(6);host.dataset.frames=String(records.length);host.dataset.mode=mode;canvas.setAttribute('aria-label',names[kind]+': '+records.length+' Aufnahmen bis '+seconds(latest.t)+'.');
   if(records.length!==lastCount){times.replaceChildren(...records.map((s,i)=>{const li=document.createElement('li');li.textContent=(i+1)+': '+seconds(s.t);return li;}));$('[data-record-count]').textContent='('+records.length+')';lastCount=records.length;}
  }
  function controls(){pause.disabled=mode!=='running'&&mode!=='paused';pause.textContent=mode==='paused'?'Weiter':'Pause';final.disabled=mode==='finished';play.disabled=false;play.textContent=mode==='ready'?'Zeitlupe starten':'Neu starten';}
  function stop(){cancelAnimationFrame(raf);raf=0;}
  function finish(){stop();time=c.duration;mode='finished';status.textContent='Fertig: '+MotionModel.samples(kind).length+' Blitzaufnahmen ergeben dieses Stroboskopbild.';render();controls();}
  function tick(wall){if(!host.isConnected){stop();return;}if(document.hidden){lastWall=0;raf=requestAnimationFrame(tick);return;}
   if(lastWall)time=Math.min(c.duration,time+(wall-lastWall)/1000*slowFactor);lastWall=wall;if(time>=c.duration){finish();return;}render();raf=requestAnimationFrame(tick);
  }
  play.addEventListener('click',()=>{stop();time=0;mode='running';lastWall=0;lastCount=-1;status.textContent='Zeitlupe: Die Uhr zeigt die Zeit der Bewegung. Bei jedem Blitz bleibt eine Aufnahme stehen.';render();controls();raf=requestAnimationFrame(tick);});
  pause.addEventListener('click',()=>{if(mode==='running'){stop();mode='paused';status.textContent='Zeitlupe angehalten.';}else if(mode==='paused'){mode='running';lastWall=0;status.textContent='Zeitlupe läuft weiter.';raf=requestAnimationFrame(tick);}render();controls();});
  final.addEventListener('click',finish);status.textContent='Starte die Zeitlupe und beobachte, wie das Stroboskopbild entsteht.';host.dataset.ready='1';render();controls();
 }
 async function mount(root){
  const hosts=[...root.querySelectorAll('[data-motion]')];
  // The auxiliary-file edition keeps the editor and first page load lightweight.
  if(typeof STROBE_MODEL_URL!=='undefined'||(typeof STROBE_LAZY!=='undefined'&&STROBE_LAZY)){
   for(const host of hosts){
    const status=host.querySelector('[data-motion-status]'),play=host.querySelector('[data-play]'),final=host.querySelector('[data-final]');
    MotionClock.update(host,0);host.dataset.mode='ready';host.dataset.frames='1';host.dataset.time='0.000000';
    if(window.widget?.isEditor||window.widget?.isFromEditor){status.textContent='Die 3D-Animation wird erst in der Lernansicht geladen.';continue;}
    status.textContent='Starte die Zeitlupe. Das 3D-Modell wird beim ersten Start geladen.';play.disabled=false;final.disabled=false;
    const activate=async(event)=>{
     if(host.dataset.loading==='1')return;host.dataset.loading='1';play.disabled=true;final.disabled=true;
     const requested=event.currentTarget;status.textContent='3D-Modell wird geladen …';
     try{const studio=await assets();if(!host.isConnected)return;
      play.removeEventListener('click',activate);final.removeEventListener('click',activate);player(host,studio);requested.click();
     }catch(error){status.textContent=error.message;play.disabled=false;final.disabled=false;}
     finally{delete host.dataset.loading;}
    };
    play.addEventListener('click',activate);final.addEventListener('click',activate);
   }return;
  }
  try{const studio=await assets();if(root.isConnected)hosts.forEach(h=>player(h,studio));}catch(error){hosts.forEach(h=>{h.querySelector('[data-motion-status]').textContent=error.message;});}
 }

 return {ball:()=>html('ball'),uniform:()=>html('uniform'),accelerated:()=>html('accelerated'),mount};
})();
