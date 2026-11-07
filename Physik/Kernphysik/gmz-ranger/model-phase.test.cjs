/* Bounded real-WebGL checks for independent charge timing.
 * node Physik/Kernphysik/gmz-ranger/model-phase.test.cjs
 * Loads the existing runtime and latest model.js. Does not rebuild artifacts.
 */
'use strict';
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const candidates=[process.env.PLAYWRIGHT_MODULE,'playwright',path.join(path.dirname(process.execPath),'../node_modules/playwright'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
let chromium;for(const candidate of candidates){try{({chromium}=require(candidate));break;}catch{}}
if(!chromium)throw Error('Playwright fehlt. PLAYWRIGHT_MODULE auf das lokale Paket setzen.');
const workspace=path.resolve(__dirname,'../../..'),route='/Physik/Kernphysik/gmz-ranger/';
const server=http.createServer((req,res)=>{
  if(req.url==='/__model-phase'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<div id="stage" style="width:640px;height:480px"></div><script src="'+route+'model-runtime.js"></script><script src="'+route+'atomic-motion.js"></script><script src="'+route+'model.js"></script>');return;}
  let file;try{file=path.resolve(workspace,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400);res.end();return;}
  if(!file.startsWith(workspace+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':'text/javascript'});res.end(error?'Not found':data);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try{
    const base='http://127.0.0.1:'+server.address().port;
    browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
    const page=await browser.newPage({viewport:{width:660,height:500}}),errors=[],blocked=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',request=>{if(request.request().url().startsWith(base+'/'))return request.continue();blocked.push(request.request().url());return request.abort('blockedbyclient');});
    await page.goto(base+'/__model-phase',{waitUntil:'load'});
    const snapshots=await page.evaluate(()=>{
      const viewer=createRangerViewer(document.querySelector('#stage'),{manual:true,interactive:false});
      viewer.setExplosion(0);viewer.setPairCount(1);viewer.focusPart('gas',{immediate:true});
      const snap=()=>Object.fromEntries(['electron','ion'].map(role=>{const charge=viewer.mechanism.children.find(o=>o.userData.role===role&&o.userData.index===0);return[role,{position:charge.position.toArray(),visible:charge.visible}];}));
      const frame=(phaseProgress,overrides,seconds)=>{viewer.setChargeProgress(null);viewer.setPhase('drift',phaseProgress);if(overrides!==null)viewer.setChargeProgress(overrides);viewer.renderAt(seconds);return snap();};
      const defaults=frame(.5,null,1);
      const heldIon=frame(.5,{electron:.1,ion:.2},2);
      const movedElectron=frame(.5,{electron:.9,ion:.2},3);
      const movedIon=frame(.5,{electron:.9,ion:.8},4);
      const partial=frame(.5,{electron:.9},5);
      const restored=frame(.5,null,6);
      const clamped=frame(.5,{electron:-3,ion:4},7);
      const explicitEnds=frame(.5,{electron:0,ion:1},8);
      const late=frame(.8,{electron:.85,ion:.15},120);
      const soughtBack=frame(.2,{electron:.25,ion:.05},30);
      const lateAgain=frame(.8,{electron:.85,ion:.15},120);
      const soughtBackAgain=frame(.2,{electron:.25,ion:.05},30);
      // Clearing the override must also reproduce the original lesson curve.
      viewer.setChargeProgress({electron:1,ion:1});viewer.setChargeProgress(null);viewer.setPhase('drift',.5);viewer.renderAt(0);
      const cleared=snap();viewer.dispose();
      return{defaults,heldIon,movedElectron,movedIon,partial,restored,clamped,explicitEnds,late,soughtBack,lateAgain,soughtBackAgain,cleared};
    });
    assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
    assert.deepEqual(snapshots.heldIon.ion,snapshots.movedElectron.ion,'Electron channel moved held ion');
    assert.notDeepEqual(snapshots.heldIon.electron.position,snapshots.movedElectron.electron.position,'Electron did not move');
    assert.deepEqual(snapshots.movedElectron.electron,snapshots.movedIon.electron,'Ion channel moved held electron');
    assert.notDeepEqual(snapshots.movedElectron.ion.position,snapshots.movedIon.ion.position,'Ion did not move');
    assert.deepEqual(snapshots.partial.ion,snapshots.defaults.ion,'Absent ion override must retain lesson default');
    assert.deepEqual(snapshots.restored,snapshots.defaults,'Null override must restore lesson default');
    assert.deepEqual(snapshots.cleared,snapshots.defaults,'Explicit clear must restore lesson default');
    assert.deepEqual(snapshots.clamped,snapshots.explicitEnds,'Override progress must clamp to 0..1');
    assert.deepEqual(snapshots.late,snapshots.lateAgain,'Late frame changed after backward seek');
    assert.deepEqual(snapshots.soughtBack,snapshots.soughtBackAgain,'Backward seek is not deterministic');
    const atomic=await page.evaluate(()=>{
      const viewer=window.atomicQaViewer=createRangerViewer(document.querySelector('#stage'),{manual:true,interactive:false});
      const config=window.atomicQaConfig={collisionAt:79,electronAt:90.96,ionAt:95.22,avalancheAt:103.66,pulseAt:122.19,readyAt:188.4,seed:7391};
      viewer.setPhase('incoming',0);viewer.highlightPart('gas');viewer.setMicroscopic(1);viewer.setView({yaw:.12,pitch:.08,distance:25,target:[3,30,-6.9]});
      const charge=(role,index)=>viewer.mechanism.children.find(o=>o.userData.role===role&&o.userData.index===index);
      const frame=time=>{viewer.setAtomicClock({...config,time});viewer.renderAt(time);const state=viewer.getAtomicState();return{state,electron:charge('electron',0).position.toArray(),ion:charge('ion',0).position.toArray(),electronVisible:charge('electron',0).visible,ionVisible:charge('ion',0).visible,atomVisible:viewer.parts.gas.children.filter(o=>o.userData.neutralGas)[0].visible};};
      const before=frame(78.999999),contact=frame(79),movingA=frame(70),movingB=frame(70.8),movingAAgain=frame(70);
      const secondary=contact.state.events.slice(1).map(event=>{frame(event.time);return{position:event.position,parent:charge('electron',event.parentElectron).position.toArray(),electron:charge('electron',event.index).position.toArray(),ion:charge('ion',event.index).position.toArray()};});
      viewer.setAtomicClock(null);viewer.setMicroscopic(0);viewer.setPhase('off',0);viewer.highlightPart(null);viewer.setExplosion(0,{preserveView:true});viewer.renderAt(0);
      const fixedIds=['gas','anode','cathode','battery'];const sourcePositions=Object.fromEntries(fixedIds.map(id=>[id,viewer.parts[id].position.toArray()]));const sourceCounter=viewer.parts.counter.position.clone(),sourceVoltage=viewer.parts.voltage.position.clone(),view=viewer.getView();
      viewer.setExplosion(1,{preserveView:true});viewer.renderAt(0);const revealedPositions=Object.fromEntries(fixedIds.map(id=>[id,viewer.parts[id].position.toArray()]));
      const boardDelta=viewer.parts.counter.position.clone().sub(sourceCounter).toArray(),voltageDelta=viewer.parts.voltage.position.clone().sub(sourceVoltage).toArray(),viewAfter=viewer.getView();
      const revelation=viewer.revealPart('gas'),explosionAfterQuery=viewer.getExplosion();
      viewer.setExplosion(0,{preserveView:true});const cover=viewer.parts.shell.children.find(o=>o.isMesh),baseCoverOpacity=cover.material.opacity;
      viewer.setAtomicClock({...config,time:0});viewer.renderAt(0);const clockCoverOpacity=cover.material.opacity;
      viewer.setPhase('incoming',.5);viewer.renderAt(0);const phaseCoverOpacity=cover.material.opacity;
      viewer.setMicroscopic(.25);const fade25={visible:cover.visible,opacity:cover.material.opacity};viewer.setMicroscopic(.5);const fade50={visible:cover.visible,opacity:cover.material.opacity};viewer.setMicroscopic(1);const fade100={visible:cover.visible,opacity:cover.material.opacity};
      frame(79);return{before,contact,movingA,movingB,movingAAgain,secondary,sourcePositions,revealedPositions,boardDelta,voltageDelta,view,viewAfter,revelation,explosionAfterQuery,baseCoverOpacity,clockCoverOpacity,phaseCoverOpacity,fade25,fade50,fade100};
    });
    assert.equal(atomic.before.atomVisible,true);assert.equal(atomic.before.electronVisible,false);assert.equal(atomic.before.ionVisible,false);
    assert.equal(atomic.contact.atomVisible,false);assert.equal(atomic.contact.electronVisible,true);assert.equal(atomic.contact.ionVisible,true);
    const close=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]))<1e-8;
    for(const p of [atomic.contact.electron,atomic.contact.ion,atomic.contact.state.radiation.position])assert.ok(close(p,atomic.contact.state.primary.position),'Rendered primary products must share actual collision');
    for(const event of atomic.secondary)for(const p of [event.parent,event.electron,event.ion])assert.ok(close(p,event.position),'Rendered secondary products must share actual contact');
    assert.notDeepEqual(atomic.movingA.state.atoms,atomic.movingB.state.atoms);assert.deepEqual(atomic.movingA.state,atomic.movingAAgain.state);
    assert.deepEqual(atomic.sourcePositions,atomic.revealedPositions,'Detector internals must keep their physical locations during reveal');
    assert.deepEqual(atomic.boardDelta,atomic.voltageDelta,'Electronics must remain a coherent assembly');assert.deepEqual(atomic.view,atomic.viewAfter,'preserveView must preserve camera');
    assert.equal(atomic.revelation,1);assert.equal(atomic.explosionAfterQuery,1);assert.ok(atomic.fade25.visible&&atomic.fade50.visible&&!atomic.fade100.visible);assert.ok(atomic.fade25.opacity>atomic.fade50.opacity&&atomic.fade50.opacity>0&&atomic.fade100.opacity===0);
    assert.equal(atomic.baseCoverOpacity,1);assert.equal(atomic.clockCoverOpacity,1,'Atomic clock alone must not ghost device');assert.equal(atomic.phaseCoverOpacity,1,'Atomic phase changes must not ghost device');
    const field=await page.evaluate(()=>{
      const v=window.atomicQaViewer,c=window.atomicQaConfig;
      const arrows=v.mechanism.children.filter(o=>o.userData.role==='field');
      const sample=time=>{v.setAtomicClock({...c,time});v.renderAt(time);const state=v.getAtomicState();return{state,visibleIonMeshes:v.mechanism.children.filter(o=>o.userData.role==='ion'&&o.visible).length,arrows:arrows.map(a=>({visible:a.visible,opacity:a.line.material.opacity,length:a.cone.position.y,direction:new window.THREE.Vector3(0,1,0).applyQuaternion(a.quaternion).toArray()}))};};
      v.setMicroscopic(1);v.setFieldVisibility(0);const hidden=sample(c.pulseAt);
      v.setFieldVisibility(.5);const half=sample(c.pulseAt);v.setFieldVisibility(1);const weak=sample(c.pulseAt),ready=sample(c.readyAt),neutral=sample(ready.state.neutralization.lastArrivalAt+.01);
      v.setFieldVisibility(-2);const clampLow=v.getFieldVisibility();v.setFieldVisibility(2);const clampHigh=v.getFieldVisibility();v.setFieldVisibility(0);
      return{hidden,half,weak,ready,neutral,clampLow,clampHigh};
    });
    assert.ok(field.hidden.arrows.every(a=>!a.visible));assert.ok(field.weak.arrows.every(a=>a.visible&&a.opacity>0),'Fields must remain showable in microscopic view');
    assert.equal(field.weak.state.measurementReady,false);assert.equal(field.ready.state.measurementReady,true);assert.ok(field.ready.visibleIonMeshes>0);assert.equal(field.ready.visibleIonMeshes,field.ready.state.neutralization.remainingIons);assert.equal(field.neutral.visibleIonMeshes,0);
    for(let i=0;i<field.weak.arrows.length;i++){assert.ok(Math.abs(field.half.arrows[i].opacity*2-field.weak.arrows[i].opacity)<1e-9);assert.ok(field.ready.arrows[i].length>field.weak.arrows[i].length&&field.ready.arrows[i].opacity>field.weak.arrows[i].opacity);assert.ok(close(field.weak.arrows[i].direction,[0,0,1]),'Field direction must remain anode to cathode backing');}
    assert.equal(field.clampLow,0);assert.equal(field.clampHigh,1);
    if(process.argv.includes('--screenshots')){
      const output=path.join(workspace,'outputs/gmz-ranger-qa');fs.mkdirSync(output,{recursive:true});
      for(const [label,time,distance,target] of [['before',78.65,25,[3,30,-6.9]],['contact',79,25,[3,30,-6.9]],['electron',92,25,[3,30,-6.9]],['avalanche',112,65,[7,30,-6.9]]]){await page.evaluate(({time,distance,target})=>{const v=window.atomicQaViewer;v.setAtomicClock({...window.atomicQaConfig,time});v.setMicroscopic(1);v.setView({yaw:.12,pitch:.08,distance,target});v.renderAt(time);},{time,distance,target});await page.screenshot({path:path.join(output,'model-atomic-'+label+'.png')});}
      for(const [label,ready]of [['weak',false],['ready',true]]){await page.evaluate(ready=>{const v=window.atomicQaViewer,c=window.atomicQaConfig,time=ready?c.readyAt:c.pulseAt+.25;v.setAtomicClock({...c,time});v.setMicroscopic(1);v.setFieldVisibility(1);v.setView({yaw:.65,pitch:.35,distance:65,target:[7,30,-6.9]});v.renderAt(time);},ready);await page.screenshot({path:path.join(output,'model-field-'+label+'.png')});}
    }
    await page.evaluate(()=>window.atomicQaViewer.dispose());assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
    console.log(JSON.stringify({passed:true,checks:['independent electron','independent ion','clear/default/clamp','backward seek','moving bounded gas','primary contact exact','15 secondary contacts exact','detector remains aligned','coherent board reveal','continuous microscopic fade','preserved camera','field visibility independent of microscope','qualitative field direction/strength','measurement ready while ions still moving','later complete neutralization'],browserErrors:errors,externalRequests:blocked.length}));
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
