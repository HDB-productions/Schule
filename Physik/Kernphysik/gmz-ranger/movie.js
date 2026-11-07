/* Deterministic film staging. No network assets, random numbers or synthetic voice. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id), params = new URLSearchParams(location.search);
  const clamp = (n, a=0, b=1) => Math.max(a, Math.min(b, n));
  const ease = x => { x=clamp(x);return x*x*(3-2*x); };
  const mix = (a,b,p) => a+(b-a)*p;
  const timing=window.GMZMovieTiming, staging=window.GMZStaging;
  let timeline, viewer, route, currentBeat=-1, shadowExplosion, playing=false, startWall=0, startTime=0, currentTime=0;
  document.body.classList.toggle('capture-mode',params.get('capture')==='1');
  function fit(){const scale=innerWidth/1280;$('movie').style.transform=`scale(${scale})`;}
  fit();addEventListener('resize',fit);
  function atomicClock(t){
    const cue=(id,fallback)=>timeline.sync?.mode==='recording-cues'?timeline.eventCues.find(c=>c.id===id)?.time:timing.outputTime(fallback,timeline.timeMap);
    return {time:t,collisionAt:cue('atom_ejected',82.88),electronAt:cue('electron_drift',90.96),ionAt:cue('ion_drift',95.22),avalancheAt:cue('avalanche_onset',103.66),pulseAt:cue('pulse_signal',122.19)??cue('pulse_count',122.19),readyAt:cue('deadtime_end',198.36)};
  }
  function phaseAt(beat,t,end){
    if(timeline.sync?.mode==='recording-cues'){
      return timing.phase(timeline,t);
    }
    const p=clamp((t-beat.start)/(end-beat.start));
    if(beat.phase==='entryIon')return p<.30?['incoming',p/.30]:['ionization',(p-.30)/.70];
    if(beat.phase==='drift')return ['drift',p*.85];
    if(beat.phase==='driftEnd')return ['drift',mix(.85,1,p)];
    if(beat.phase==='avalanche')return ['avalanche',p*.85];
    if(beat.phase==='avalancheEnd')return ['avalanche',mix(.85,1,p)];
    if(beat.phase==='quenchStart')return ['quench',p*.25];
    if(beat.phase==='deadtimeRecovery')return ['deadtime',p];
    if(beat.phase==='miss')return ['off',0];
    if(beat.phase==='pulse')return ['pulse',clamp((t-beat.start)/2.8)];
    if(beat.phase==='ionization')return ['ionization',1];
    return [beat.phase,p];
  }
  function updateText(beat,index,chapterIndex){
    if(currentBeat!==index){
      $('beat-title').textContent=beat.title;$('explanation').textContent=beat.text;$('scene-name').textContent=beat.mode==='exterior'?'Geiger-Müller-Zähler':beat.mode==='part'||beat.mode==='open'?'Aufbau des Gerätes':'Im flachen Sensor';
      $('step-number').textContent=String(index+1).padStart(2,'0');$('callout').textContent=beat.tag;
      $('points').replaceChildren(...beat.points.map(p=>{const li=document.createElement('li');li.textContent=p;return li;}));
      $('legend').style.display=['gas','pulse'].includes(beat.mode)?'flex':'none';
      $('atomic-detail').style.display=beat.start===63.24?'block':'none';
      currentBeat=index;
    }
    $('chapter-number').textContent=`KAPITEL ${chapterIndex+1} / ${timeline.chapters.length}`;$('chapter-title').textContent=timeline.chapters[chapterIndex].title;
  }
  window.renderMovieAt=function(seconds,options){
    if(!viewer||!timeline)throw Error('Film noch nicht bereit.');
    const t=clamp(Number(seconds)||0,0,timeline.duration);currentTime=t;
    const sourceT=timing.sceneTime(t,timeline);
    if(options&&typeof options.draft==='boolean')document.body.classList.toggle('no-draft',!options.draft);
    let index=timing.lastIndex(timeline.beats,b=>b.start<=sourceT);index=Math.max(0,index);
    const beat=timeline.beats[index],end=timeline.beats[index+1]?.start||timeline.sourceDuration;
    const chapterIndex=Math.max(0,timing.lastIndex(timeline.chapters,c=>c.start<=sourceT));
    updateText(beat,index,chapterIndex);
    const pose=staging.sample(route,sourceT),e=pose.explosion;
    if(shadowExplosion===undefined||Math.abs(e-shadowExplosion)>1e-6){viewer.renderer.shadowMap.needsUpdate=true;shadowExplosion=e;}
    viewer.setExplosion(e,{preserveView:true});
    viewer.setMicroscopic(pose.microscopic);
    viewer.setView(pose);
    const phase=phaseAt(beat,timeline.sync?.mode==='recording-cues'?t:sourceT,end);viewer.setPhase(phase[0],phase[1]);
    // Atomic motion owns actual contacts. Phase captions never reset particles.
    viewer.setChargeProgress?.(null);
    viewer.setAtomicClock(atomicClock(t));
    const fieldVisibility=ease((sourceT-148)/3)*(1-ease((sourceT-198.36)/3));
    viewer.setFieldVisibility(fieldVisibility);
    if(viewer.setPairCount)viewer.setPairCount(['ionization','drift'].includes(phase[0])?1:8);
    viewer.scene.children.forEach(o=>{if(o.type==='Box3Helper')o.visible=false;});
    miss.visible=beat.phase==='miss';if(miss.visible){const p=clamp((sourceT-beat.start)/8);miss.position.set(17,38,-64+p*115);miss.material.opacity=p<.1?p/.1:p>.9?(1-p)/.1:1;}
    viewer.renderAt(t);
    const atomic=viewer.getAtomicState();
    $('field-status').style.opacity=String(fieldVisibility);
    $('field-fill').style.width=(atomic.fieldStrength*100)+'%';
    $('field-message').textContent=atomic.measurementReady?'Wieder messbereit':'Totzeit: kein neuer Zählimpuls';
    $('scene-name').textContent=sourceT>=195?'Zurück zum Messgerät':pose.microscopic>.9?'Atomare Ebene · stark vergrößert':pose.microscopic>.05?'Wir vergrößern den Gasraum':sourceT>=57.72&&sourceT<198.36?'Zusammengebauter Sensor':beat.mode==='part'||beat.mode==='open'?'Aufbau · schichtweise geöffnet':'Geiger-Müller-Zähler';
    const anchor=beat.part==='anode'?viewer.parts.anode.localToWorld(new THREE.Vector3(0,13.8,0)):beat.part?new THREE.Box3().setFromObject(viewer.parts[beat.part]).getCenter(new THREE.Vector3()):new THREE.Vector3(0,18,0);
    anchor.project(viewer.camera);let ax=(anchor.x*.5+.5)*832,ay=(-anchor.y*.5+.5)*516;ax=clamp(ax,60,790);ay=clamp(ay,65,440);
    $('leader').style.display=beat.mode==='part'?'block':'none';
    $('leader').querySelector('path').setAttribute('d',`M 220 390 L 265 390 L ${ax.toFixed(1)} ${ay.toFixed(1)}`);
    const dot=$('leader').querySelector('circle');dot.setAttribute('cx',ax);dot.setAttribute('cy',ay);
    const pulse=timing.pulseDisplay(timeline,t);
    $('signal').style.display=pulse.visible?'block':'none';$('event-count').style.display=pulse.visible?'block':'none';
    if(pulse.visible){const x=30+pulse.progress*235;$('signal').querySelector('path').setAttribute('d',`M 0 36 H ${x-12} l 6 -30 l 6 30 l 8 -7 l 7 7 H 300`);}
    $('count-number').textContent=String(pulse.count);
    const stamp=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;
    $('progress').style.width=(t/timeline.duration*100)+'%';$('scrub').value=t;$('clock').textContent=stamp(t)+' / '+stamp(timeline.duration);
    return {time:t,sourceTime:sourceT,beat:index,chapter:chapterIndex,phase:phase[0],explosion:e,view:pose,fieldStrength:atomic.fieldStrength,measurementReady:atomic.measurementReady,fieldVisibility,syncStatus:timeline.sync?.mode||'technical-preview',finalSync:!!timeline.sync?.finalSync};
  };
  // The final audio montage owns the clock. Replace null cue times only after
  // the new recordings are placed, then activate recording-cues explicitly.
  window.configureMovieTiming=function(config){
    if(!timeline)throw Error('Film noch nicht bereit.');
    const next=Object.assign({},timeline,config),sync=Object.assign({},timeline.sync,config.sync);
    const checked=timing.validate(Object.assign(next,{sync}));
    timeline=checked;window.movieTimeline=timeline;currentBeat=-1;$('scrub').max=timeline.duration;return window.renderMovieAt(currentTime);
  };
  let miss;
  window.movieReady=(async()=>{
    const response=await fetch('video-timeline.json');if(!response.ok)throw Error('Zeitplan konnte nicht geladen werden.');timeline=timing.validate(await response.json());
    viewer=window.createRangerViewer($('viewer'),{THREE:window.THREE,manual:true,interactive:false,pixelRatio:1,preserveDrawingBuffer:true,background:'#eaf0f5'});
    const field=document.createElement('div');field.id='field-status';field.innerHTML='<b>Feld nahe der Anode</b><small>Schematische Stärke</small><div class="field-track"><i id="field-fill"></i></div><span id="field-message"></span>';$('scene-card').append(field);
    const fieldStyle=document.createElement('style');fieldStyle.textContent='#field-status{position:absolute;right:18px;bottom:18px;width:220px;background:#fffffff0;border:1px solid #dce4ec;border-radius:10px;padding:12px 14px;font-size:12px;line-height:1.4;color:#29495f;opacity:0;pointer-events:none}#field-status b,#field-status small,#field-status span{display:block}#field-status small{font-size:10px;color:#526678;margin:2px 0 7px}#field-status .field-track{height:8px;background:#dce4ec;border-radius:4px;overflow:hidden;margin-bottom:7px}#field-fill{display:block;height:100%;background:#c49935;border-radius:4px}';document.head.append(fieldStyle);
    route=staging.movieRoute((id,e)=>{viewer.setExplosion(e);viewer.model.updateMatrixWorld(true);return new THREE.Box3().setFromObject(viewer.parts[id]).getCenter(new THREE.Vector3()).toArray();});
    // Camera motion does not change the static studio shadow. Recompute only when
    // device parts move or the isolated part changes; particles carry no shadow.
    viewer.mechanism.traverse(o=>{o.castShadow=false;});viewer.renderer.shadowMap.autoUpdate=false;viewer.renderer.shadowMap.needsUpdate=true;
    miss=new THREE.Mesh(new THREE.SphereGeometry(1.3,16,10),new THREE.MeshStandardMaterial({color:0xf5c955,emissive:0xe7a62c,emissiveIntensity:.7,transparent:true}));viewer.scene.add(miss);
    window.movieViewer=viewer;window.movieTimeline=timeline;viewer.resize(832,516);
    await document.fonts.ready;window.renderMovieAt(Number(params.get('t'))||0,{draft:params.get('draft')!=='0'});
    return true;
  })().catch(error=>{$('error').style.display='block';$('error').textContent=error.message;throw error;});
  function tick(now){if(!playing)return;window.renderMovieAt(startTime+(now-startWall)/1000);if(currentTime>=timeline.duration){playing=false;$('play').textContent='Abspielen';return;}requestAnimationFrame(tick);}
  $('play').onclick=async()=>{await window.movieReady;playing=!playing;$('play').textContent=playing?'Pause':'Abspielen';if(playing){startTime=currentTime>=timeline.duration?0:currentTime;startWall=performance.now();requestAnimationFrame(tick);}};
  $('scrub').oninput=async e=>{await window.movieReady;window.renderMovieAt(Number(e.target.value));startTime=currentTime;startWall=performance.now();};
})();
