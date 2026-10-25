/* Offline Three.js model of a horizontal school steam engine.
 * Coordinates: Y up; boiler and piston run along Z; the front is +Z.
 * The wheel axle runs along X. The photographed arrangement is retained.
 * No simulation state is changed here. Energy faces use area proportional to amount.
 */
function createSteamView(host) {
  'use strict';
  if (!host || !host.ownerDocument) throw new Error('Der 3D-Simulationsbereich fehlt.');
  const T = typeof steamThree !== 'undefined' ? steamThree : null;
  const doc = host.ownerDocument;
  let renderer;
  function fail(error) {
    const notice = doc.createElement('p');
    notice.className = 'steam-scene__webgl-error'; notice.setAttribute('role', 'alert');
    notice.textContent = 'Die 3D-Dampfmaschine benötigt WebGL. Bitte die Hardwarebeschleunigung des Browsers aktivieren oder einen anderen Browser verwenden.';
    host.replaceChildren(notice);
    throw new Error('3D-Dampfmaschine: WebGL konnte nicht gestartet werden.', {cause: error});
  }
  try {
    if (!T || !T.WebGLRenderer) throw new Error('Lokales Three.js fehlt.');
    renderer = new T.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'high-performance'});
  } catch (error) { return fail(error); }
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%;outline:none;touch-action:none';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Dreidimensionales Modell einer liegenden Dampfmaschine: Chromkessel auf Ziegelfeuerhaus links, Kolbenantrieb vorne und rotes Schwungrad hinten rechts.');
  host.appendChild(canvas);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xf1f5f6, 1);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.03;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-6.5, 6.5, 4, -4, .1, 100);
  camera.position.set(11.5, 8.2, 14.5); camera.lookAt(-.05, 2.9, 0);
  const root = new T.Group(); root.name = 'horizontal-school-steam-engine'; scene.add(root);
  const textures = [], allMaterials = [], energyMeshes = new Map(), conversionMeshes = new Map(), lossOrigins = new Map();
  const materials = {};
  const standard = (name, color, metalness = 0, roughness = .5, extra = {}) => {
    const mat = new T.MeshStandardMaterial({color, metalness, roughness, ...extra});
    allMaterials.push(mat); if (name) materials[name] = mat; return mat;
  };
  const chrome = standard('chrome', 0xe4ebee, .96, .13);
  const steel = standard('steel', 0xb7c3c8, .85, .25);
  const dark = standard('dark', 0x15272b, .62, .29);
  const red = standard('red', 0xb51d2a, .54, .26);
  const blue = standard('blue', 0x267dad, .4, .3);
  const brass = standard('brass', 0xba9759, .85, .25);
  const black = standard('black', 0x171c1c, .18, .62);
  const fuelWhite = standard('fuelWhite', 0xfaf6e9, .04, .7);
  const ash = standard('ash', 0x383732, .04, .95);
  const glass = standard('glass', 0x22434c, .2, .15, {transparent: true, opacity: .75});
  const boilerShell = standard('boilerShell', 0xe8edef, .98, .1);
  const boilerEnds = standard('boilerEnds', 0xe4e9e8, .95, .15);
  const cylinderShell = standard('cylinderShell', 0x152326, .65, .23);
  const cylinderEndShell = standard('cylinderEndShell', 0xb7c3c8, .85, .25);
  const cylinderRibShell = standard('cylinderRibShell', 0x15272b, .62, .29);
  const pipeShell = standard('pipeShell', 0xd5c7a4, .85, .22);
  const waterMat = standard('water', 0x279cc6, .15, .18, {transparent: true, opacity: .78, depthWrite: false, side: T.DoubleSide});
  const vaporMat = standard('vapor', 0xece2c9, .03, .8, {transparent: true, opacity: .36, depthWrite: false, side: T.DoubleSide});
  const pipeInner = standard('pipeInterior', 0xf4e8cd, .05, .52, {transparent: true, opacity: .85});
  const flameMat = standard('flame', 0xffbd37, .0, .7, {emissive: 0xff6218, emissiveIntensity: 1.8, transparent: true, opacity: .8, depthWrite: false});
  const flameCoreMat = standard('flameCore', 0xfff0a2, .0, .7, {emissive: 0xffc64b, emissiveIntensity: 2, transparent: true, opacity: .92, depthWrite: false});
  function mesh(geometry, material, x=0, y=0, z=0, parent=root) {
    const m = new T.Mesh(geometry, material); m.position.set(x,y,z);
    m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function box(w,h,d,mat,x,y,z,parent=root) {return mesh(new T.BoxGeometry(w,h,d),mat,x,y,z,parent);}
  function cyl(r,h,mat,x=0,y=0,z=0,axis='y',parent=root,segments=48) {
    const m=mesh(new T.CylinderGeometry(r,r,h,segments),mat,x,y,z,parent);
    if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=Math.PI/2;return m;
  }
  function rod(a,b,r,mat=chrome,parent=root,segments=12) {
    const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);
    const m=mesh(new T.CylinderGeometry(r,r,delta.length(),segments),mat,0,0,0,parent);
    m.position.copy(av).add(bv).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;
  }
  function torus(r,t,mat,x,y,z,axis='z',parent=root) {
    const m=mesh(new T.TorusGeometry(r,t,12,72),mat,x,y,z,parent);
    if(axis==='x')m.rotation.y=Math.PI/2;if(axis==='y')m.rotation.x=Math.PI/2;return m;
  }
  function makeTexture(w,h,draw) {
    const c=doc.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
    const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(tex);return tex;
  }
  const brickTexture=makeTexture(512,512,(c,w,h)=>{
    c.fillStyle='#bfb4a2';c.fillRect(0,0,w,h);
    for(let row=0;row<12;row++)for(let col=-1;col<5;col++){
      const x=col*128+(row%2)*64,y=row*(512/12),tone=(row*17+col*11)%19;
      c.fillStyle=`rgb(${137+tone},${65+tone/2},${45+tone/3})`;c.fillRect(x+3,y+3,121,512/12-6);
      c.fillStyle='rgba(250,196,150,.18)';c.fillRect(x+6,y+5,114,3);
      for(let j=0;j<8;j++){c.fillStyle=j%2?'rgba(0,0,0,.1)':'rgba(255,222,180,.13)';c.fillRect(x+7+((j*31+row*5)%108),y+9+((j*7)%22),13,2);}
    }
  });
  const brick=standard('brick',0xffffff,.04,.82,{map:brickTexture});
  const chimneyTexture=brickTexture.clone();chimneyTexture.needsUpdate=true;chimneyTexture.wrapS=T.RepeatWrapping;chimneyTexture.wrapT=T.RepeatWrapping;chimneyTexture.repeat.set(1.1,3.2);textures.push(chimneyTexture);
  const chimneyBrick=standard('chimneyBrick',0xffffff,.03,.82,{map:chimneyTexture});
  // A small procedural studio provides broad, real reflections in the chrome.
  let environmentTarget = null;
  try {
    const room=new T.Scene(); room.background=new T.Color(0x121c24);
    const roomMat=new T.MeshBasicMaterial({color:0x8b969e,side:T.BackSide});
    room.add(new T.Mesh(new T.BoxGeometry(30,24,30),roomMat));
    const panelMaterials=[];
    for(const [pos,size,color] of [ [[-8,5,2],[.1,14,7],0xffffff], [[7,7,-7],[3,10,.1],0xffffff], [[0,10,3],[12,.1,3],0xffffff], [[-1,1,10],[7,9,.1],0xe9eff2], [[-2,1,9.9],[1.3,9,.1],0x18232c], [[7,2,5],[.1,1.1,10],0xffffff] ]) {
      const mat=new T.MeshBasicMaterial({color});panelMaterials.push(mat);const p=new T.Mesh(new T.BoxGeometry(...size),mat);p.position.set(...pos);room.add(p);
    }
    const pmrem=new T.PMREMGenerator(renderer); environmentTarget=pmrem.fromScene(room,.04,.1,100);scene.environment=environmentTarget.texture;
    room.traverse(o=>o.geometry?.dispose());roomMat.dispose();panelMaterials.forEach(m=>m.dispose());pmrem.dispose();
  } catch (_) { /* Directional studio lights still illuminate a valid WebGL scene. */ }
  scene.add(new T.HemisphereLight(0xeef7ff,0x8d7867,1.0));
  const key=new T.DirectionalLight(0xfff6e5,2.8);key.position.set(-4,10,8);key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=9;key.shadow.camera.bottom=-6;key.shadow.normalBias=.025;key.shadow.bias=-.00025;scene.add(key);
  const fill=new T.DirectionalLight(0xc6e3ff,1.2);fill.position.set(8,6,-5);scene.add(fill);
  const floor=mesh(new T.PlaneGeometry(200,200),standard('floor',0xf1f5f6,0,1),0,-.18,0,scene);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
  // Deep blue enamel tray, folded rim, mounting holes and four feet.
  box(8.9,.32,6.0,blue,0,.02,0);box(8.65,.12,5.75,blue,0,.24,0);
  for(const x of [-4.05,4.05])for(const z of [-2.58,2.58]){
    box(.48,.16,.5,blue,x,-.12,z);cyl(.065,.012,black,x,.309,z);cyl(.034,.015,steel,x,.316,z);
  }
  for(const x of [-4.22,4.22])box(.035,.035,5.5,chrome,x,.315,0);
  for(const z of [-2.7,2.7])box(8.4,.035,.035,chrome,0,.315,z);
  // The real furnace has closed brick sides and a small front loading door.
  const bx=-1.8, by=2.8, front=1.82, back=-1.92;
  const underbau=new T.Group();underbau.name='boiler-substructure';root.add(underbau);
  const beforeSubstructure=new Set(root.children);
  box(2.25,.10,4.02,steel,bx,.35,-.05,underbau);
  const furnace=new T.Group();furnace.name='brick-furnace';root.add(furnace);
  box(.16,1.38,3.85,brick,bx-.94,1.03,-.05,furnace);
  for(const z of [-1.93,1.83])box(2.02,1.38,.15,brick,bx,1.03,z,furnace);
  box(.02,.92,3.48,black,bx-.84,.99,-.02,furnace);
  box(1.98,.1,3.75,black,bx,.48,-.05,furnace);
  const sideWall=box(.16,1.38,3.85,brick,bx+1.07,1.03,-.05,furnace);sideWall.name='closed-brick-side-wall';
  const fuelPieces=[], flames=[], fuelColors=[new T.Color(0xfaf6e9),new T.Color(0x383732)];
  function fuelPosition(slot){return new T.Vector3(bx+(slot<5?-.38:.42),.87,1.38-(slot%5)*.69);}
  for(let i=0;i<10;i++){
    const p=fuelPosition(i),fuelMat=standard(null,0xfaf6e9,.04,.7);
    const piece=box(.72,.72,.62,fuelMat,p.x,p.y,p.z);piece.name=`fuel-slot-${i}`;fuelPieces.push(piece);
    const f=new T.Group();f.position.set(p.x,1.10,p.z);f.name=`flame-slot-${i}`;root.add(f);
    for(let j=0;j<3;j++){
      const outer=mesh(new T.ConeGeometry(.11,.55,9),flameMat,(j-1)*.14,.2,0,f);outer.rotation.z=(j-1)*.2;
      mesh(new T.ConeGeometry(.062,.34,8),flameCoreMat,(j-1)*.14,.12,.018,f);
    }
    f.visible=false;flames.push(f);
  }
  const fireLight=new T.PointLight(0xff7d19,0,4,2);fireLight.position.set(bx+1.35,1.1,.35);root.add(fireLight);
  // Front fire door and three proper boiler ventilation ports on the left face.
  box(.58,.72,.04,black,bx,.83,2.01);
  torus(.25,.035,steel,bx,1.05,2.05);cyl(.19,.06,dark,bx,1.05,2.07,'z');
  rod([bx,1.05,2.13],[bx+.12,1.13,2.2],.035,brass);
  for(const z of [-1.18,-.05,1.08]){torus(.13,.027,chrome,bx+1.1,1.5,z,'x');cyl(.105,.025,black,bx+1.11,1.5,z,'x');}
  // Walkway with closely spaced corrugations. The boiler is above, not on the drive.
  box(2.78,.105,4.34,steel,bx,1.79,-.04);
  for(let z=-2.1;z<=2.1;z+=.09)box(2.8,.027,.025,chrome,bx,1.856,z);
  for(const x of [bx-1.32,bx+1.32]){
    for(const z of [-2.11,-1.05,0,1.05,2.1])rod([x,1.86,z],[x,2.51,z],.027,chrome);
    rod([x,2.51,-2.11],[x,2.51,2.1],.028,chrome);
  }
  for(const z of [-2.11,2.1]){
    rod([bx-1.32,2.51,z],[bx+1.32,2.51,z],.028,chrome);
    for(const x of [bx-.65,bx+.65])rod([x,1.86,z],[x,2.51,z],.025,chrome);
  }
  // Two inclined access ladders at the front of the boiler.
  for(const x of [bx-1.05,bx+1.05]){
    for(const dx of [-.24,.24])rod([x+dx,.34,2.76],[x+dx,1.88,2.1],.036,steel);
    for(let j=0;j<7;j++){const t=(j+.45)/7;rod([x-.24,.34+1.54*t,2.76-.66*t],[x+.24,.34+1.54*t,2.76-.66*t],.033,chrome);}
    for(const dx of [-.24,.24])rod([x+dx,1.88,2.1],[x+dx,2.45,1.99],.027,chrome);
  }
  // Separate materials keep the drive and the overall blue tray opaque.
  for(const child of [...root.children])if(!beforeSubstructure.has(child)&&!fuelPieces.includes(child)&&!flames.includes(child)&&child!==fireLight)underbau.add(child);
  // Boiler skin is separate from its end plates so transparent mode exposes volumes.
  const shell=mesh(new T.CylinderGeometry(.96,.96,3.74,96,1,true),boilerShell,bx,by,-.05);shell.rotation.x=Math.PI/2;shell.name='chrome-boiler-shell';
  const endParts=[];
  for(const z of [front,back]){
    endParts.push(cyl(.961,.075,boilerEnds,bx,by,z,'z'));
    torus(.947,.042,chrome,bx,by,z+(z>0?.045:-.045));
    for(let j=0;j<12;j++){const a=j*Math.PI/6;cyl(.032,.035,brass,bx+.85*Math.cos(a),by+.85*Math.sin(a),z+(z>0?.064:-.064),'z',root,12);}
  }
  for(const z of [-1.6,1.51])torus(.978,.036,chrome,bx,by,z);
  const frontGlass=cyl(.34,.025,glass,bx,by,front+.058,'z');
  torus(.355,.045,brass,bx,by,front+.085);
  torus(.405,.035,chrome,bx,by,front+.089);
  // Actual lower and upper half-cylinder cross sections, extruded along the boiler.
  function halfVolume(lower,mat) {
    const s=new T.Shape(),r=.903;
    s.moveTo(-r,0);s.lineTo(r,0);
    s.absarc(0,0,r,0,lower?-Math.PI:Math.PI,lower);s.closePath();
    const g=new T.ExtrudeGeometry(s,{depth:3.58,bevelEnabled:false,curveSegments:48});
    const m=mesh(g,mat,bx,by,back+.09);m.name=lower?'water-volume':'steam-space';m.castShadow=false;return m;
  }
  const water=halfVolume(true,waterMat),vapor=halfVolume(false,vaporMat);
  // Flat animated surface is visible in section rather than a vertical blue cylinder.
  const surface=mesh(new T.PlaneGeometry(1.79,3.58,18,28),waterMat,bx,by+.006,-.05);surface.rotation.x=-Math.PI/2;surface.castShadow=false;
  // Rear brick chimney sits at the rear of the furnace, with a hollow metal rim.
  const chimney=cyl(.29,5.47,chimneyBrick,bx,4.52,-2.09,'y',underbau);chimney.name='rear-brick-chimney';
  cyl(.305,.1,steel,bx,7.285,-2.09,'y',underbau);cyl(.24,.012,black,bx,7.342,-2.09,'y',underbau);torus(.268,.037,chrome,bx,7.342,-2.09,'y',underbau);
  cyl(.32,.12,brick,bx,1.86,-2.09,'y',underbau);
  const underbauMaterials=[];
  underbau.traverse(o=>{if(!o.material)return;const clone=mat=>{const m=mat.clone();m.userData.normalOpacity=mat.opacity;underbauMaterials.push(m);allMaterials.push(m);return m;};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);});
  // Manometer, printed dial and independently animated needle, facing the viewer.
  const boilerTop=by+.96,gaugeX=bx,gaugeZ=front-.27,gaugeStemHeight=.11,gaugeY=boilerTop+gaugeStemHeight+.39-.015;
  cyl(.13,.055,brass,gaugeX,boilerTop+.012,gaugeZ);
  cyl(.095,gaugeStemHeight,brass,gaugeX,boilerTop+gaugeStemHeight/2,gaugeZ);
  cyl(.39,.21,dark,gaugeX,gaugeY,gaugeZ,'z');
  const dialTexture=makeTexture(256,256,c=>{
    c.fillStyle='#faf9e8';c.beginPath();c.arc(128,128,122,0,Math.PI*2);c.fill();
    c.lineWidth=10;c.strokeStyle='#629f87';c.beginPath();c.arc(128,128,98,Math.PI*1.12,Math.PI*1.82);c.stroke();
    c.strokeStyle='#c45a4b';c.beginPath();c.arc(128,128,98,Math.PI*1.82,Math.PI*1.96);c.stroke();
    for(let j=0;j<=20;j++){const a=Math.PI*.88+j*Math.PI*1.24/20;c.strokeStyle='#23363a';c.lineWidth=j%5===0?4:2;c.beginPath();c.moveTo(128+Math.cos(a)*91,128+Math.sin(a)*91);c.lineTo(128+Math.cos(a)*(j%5===0?75:82),128+Math.sin(a)*(j%5===0?75:82));c.stroke();}
    c.fillStyle='#294347';c.textAlign='center';c.font='bold 23px sans-serif';c.fillText('bar',128,183);c.font='16px sans-serif';c.fillText('0',57,164);c.fillText('1',128,48);c.fillText('2',203,164);
  });
  const dialMat=new T.MeshBasicMaterial({map:dialTexture});allMaterials.push(dialMat);
  mesh(new T.CircleGeometry(.345,64),dialMat,gaugeX,gaugeY,gaugeZ+.112);
  torus(.36,.027,chrome,gaugeX,gaugeY,gaugeZ+.118);
  const needle=new T.Group();needle.position.set(gaugeX,gaugeY,gaugeZ+.13);root.add(needle);
  box(.018,.28,.015,red,0,.12,0,needle);cyl(.04,.02,dark,0,0,.005,'z',needle);
  // Spring-loaded safety valve and its black lever and hanging chain.
  cyl(.11,.66,chrome,bx,4.04,-.65);cyl(.15,.09,brass,bx,3.75,-.65);cyl(.14,.11,chrome,bx,4.41,-.65);
  rod([bx-.49,4.53,-.65],[bx+.12,4.46,-.65],.042,dark);
  for(let i=0;i<13;i++){const link=torus(.035,.009,brass,bx-.48,4.47-i*.047,-.65);if(i%2)link.rotation.y=Math.PI/2;}
  cyl(.065,.23,brass,bx+.45,3.73,.29);
  // Curved steam supply from the boiler crown to the FRONT cylinder.
  const pipePoints=[[-1.2,3.51,.55],[-1.12,3.94,.58],[-.65,4.02,.74],[-.19,3.66,.97],[.02,2.45,1.15],[.18,1.36,1.38],[.55,1.15,1.48],[1.4,1.15,1.48],[1.71,1.25,1.48]];
  const steamCurve=new T.CatmullRomCurve3(pipePoints.map(p=>new T.Vector3(...p)),false,'catmullrom',.3);
  const pipe=mesh(new T.TubeGeometry(steamCurve,100,.064,12,false),pipeShell);pipe.name='curved-steam-pipe';
  const innerPipe=mesh(new T.TubeGeometry(steamCurve,100,.043,10,false),pipeInner);innerPipe.name='beige-steam-interior';innerPipe.castShadow=false;
  for(const [x,y,z] of [pipePoints[0],pipePoints[8]])cyl(.11,.11,brass,x,y,z);
  // Red/silver machine bed: the black cylinder is forward of the wheel.
  box(2.85,.23,4.75,steel,2.0,.47,-.02);box(2.60,.07,4.49,red,2.0,.62,-.02);
  for(let z=-2.15;z<2.2;z+=.12)box(2.58,.013,.012,chrome,2,.663,z);
  for(const x of [.67,3.33]){
    for(const z of [-2.15,-.7,.65,2.15])rod([x,.65,z],[x,1.03,z],.023,chrome);
    rod([x,1.03,-2.15],[x,1.03,2.15],.024,chrome);
  }
  const ex=2.15,ey=1.15;
  box(1.03,.18,1.47,dark,ex,.76,1.24);
  const cylinder=cyl(.41,1.31,cylinderShell,ex,ey,1.35,'z');cylinder.name='horizontal-front-cylinder';
  for(const z of [.69,2.02]){
    const end=cyl(.439,.085,cylinderEndShell,ex,ey,z,'z');endParts.push(end);
    for(let j=0;j<6;j++){const a=j*Math.PI/3;cyl(.03,.025,chrome,ex+.35*Math.cos(a),ey+.35*Math.sin(a),z+(z>1?.06:-.06),'z',root,12);}
  }
  for(let j=0;j<28;j++){const a=j*Math.PI*2/28;rod([ex+.414*Math.cos(a),ey+.414*Math.sin(a),.76],[ex+.414*Math.cos(a),ey+.414*Math.sin(a),1.95],.012,cylinderRibShell);}
  const piston=cyl(.353,.10,chrome,ex,ey,1.25,'z');piston.name='moving-piston';
  const pistonRod=rod([ex,ey,1.25],[ex,ey,-.05],.047,chrome);pistonRod.name='piston-rod';
  const chamber=mesh(new T.CylinderGeometry(.36,.36,1.20,48),vaporMat,ex,ey,1.35);chamber.rotation.x=Math.PI/2;chamber.castShadow=false;
  // Parallel slide bars locate the crosshead; they are fixed to the engine bed.
  for(const x of [ex-.29,ex+.29])rod([x,ey,.73],[x,ey,-.46],.033,steel);
  const crosshead=box(.68,.19,.16,steel,ex,ey,.02);crosshead.name='crosshead';
  const wheelCenter=new T.Vector3(ex,1.63,-1.30),wheelR=.94;
  for(const x of [ex-.46,ex+.46]){
    box(.23,.83,.40,dark,x,1.09,-1.30);cyl(.15,.28,brass,x,1.63,-1.30,'x');
  }
  rod([ex-.73,1.63,-1.3],[ex+.78,1.63,-1.3],.075,chrome);
  const wheel=new T.Group();wheel.position.copy(wheelCenter);root.add(wheel);wheel.name='red-six-spoke-flywheel';
  torus(wheelR,.075,red,0,0,0,'x',wheel);
  // Broad polished tyre encloses the six red spokes, with a dark inner lip.
  const tyre=mesh(new T.CylinderGeometry(wheelR+.08,wheelR+.08,.22,96,1,true),chrome,0,0,0,wheel);tyre.rotation.z=Math.PI/2;
  for(const x of [-.12,.12])torus(wheelR,.035,chrome,x,0,0,'x',wheel);
  for(let j=0;j<6;j++){const a=j*Math.PI/3;rod([0,0,0],[0,Math.cos(a)*wheelR*.94,Math.sin(a)*wheelR*.94],.069,red,wheel,16);}
  cyl(.20,.30,red,0,0,0,'x',wheel);cyl(.085,.35,chrome,0,0,0,'x',wheel);
  const crankX=ex+.42,crankR=.29;
  const crankDisc=cyl(.35,.08,red,crankX,1.63,-1.3,'x');
  const crankPin=cyl(.075,.15,chrome,crankX+.06,1.63,-1.01,'x');
  const connectingRod=rod([crankX+.08,ey,.0],[crankX+.08,1.63,-1.01],.051,steel);connectingRod.name='connecting-rod';
  const crossPin=cyl(.075,.5,chrome,ex+.16,ey,.02,'x');
  // Small vertical oiler, transverse governor, and front cylinder drain.
  cyl(.13,.13,brass,ex-.55,1.52,.42);cyl(.035,.72,chrome,ex-.55,1.11,.42);
  for(const x of [ex-.73,ex-.37]){rod([x,.7,.42],[x,1.5,.42],.016,chrome);cyl(.035,.1,brass,x,1.42,.42);}
  cyl(.18,.04,chrome,ex-.55,1.56,.42);cyl(.035,.12,brass,ex-.55,1.64,.42);
  rod([ex-.34,.98,1.98],[ex-.64,.75,2.18],.035,brass);
  // Boiler bubbles exist independently of the energy overlay.
  const bubbleMat=standard('waterBubble',0xc9f0f6,.0,.18,{transparent:true,opacity:.66,depthWrite:false});
  const steamBubbleMat=standard('steamBubble',0xfff2d6,0,.7,{transparent:true,opacity:.92,depthWrite:false});
  const bubbles=[],steamBubbles=[];
  const random=n=>{const q=Math.sin(n*127.1+311.7)*43758.5453;return q-Math.floor(q);};
  for(let i=0;i<36;i++){
    const m=mesh(new T.SphereGeometry(.024+random(i+10)*.045,10,8),bubbleMat);m.castShadow=false;m.name='rising-water-bubble';
    bubbles.push({mesh:m,seed:i+1,phase:random(i+40),speed:.35+random(i+50)*.5});
  }
  for(let i=0;i<19;i++){const m=mesh(new T.SphereGeometry(.021+random(i+120)*.019,8,6),steamBubbleMat);m.castShadow=false;m.name='steam-pipe-bubble';steamBubbles.push({mesh:m,phase:random(i+140)});}
  const energyTextures={};
  for(const [name,fill] of [['chemical','#f4b760'],['thermal','#ed887c'],['kinetic','#72c8a8']]){
    energyTextures[name]=makeTexture(128,128,(c,w,h)=>{
      c.fillStyle=fill;c.fillRect(2,2,w-4,h-4);c.strokeStyle='#24444c';c.lineWidth=4;c.strokeRect(3,3,w-6,h-6);
      c.fillStyle='#123843';c.font='800 91px Arial,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('E',64,68);
    });
  }
  const energyGeometry=new T.PlaneGeometry(1,1),packetMaterials={};
  for(const [name,map] of Object.entries(energyTextures)){
    const m=new T.MeshBasicMaterial({map,transparent:true,depthTest:false,depthWrite:false,toneMapped:false});allMaterials.push(m);packetMaterials[name]=m;
  }
  const packetGroup=new T.Group();packetGroup.name='energy-packets';scene.add(packetGroup);
  let width=1,height=1,frustumWidth=13.2,lastModel={time:0,angle:0,packets:[]},lastOptions={},destroyed=false,transparent=false,isBoiling=false;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function updateRod(m,a,b){const delta=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());m.scale.y=delta.length()/m.geometry.parameters.height;}
  const fireHeatOrigin=p=>fuelPosition(p.slot).add(new T.Vector3(0,.48,0));
  const fireWasteOrigin=p=>fireHeatOrigin(p).add(new T.Vector3(-.65,.05,0));
  const engineHeatOrigin=()=>steamCurve.getPointAt(1);
  const engineMotionOrigin=()=>engineHeatOrigin().add(new T.Vector3(0,.25,0));
  const engineWasteOrigin=()=>engineHeatOrigin().add(new T.Vector3(.65,.48,0));
  function waterPacketPosition(p,time){
    const phase=random(Number(String(p.id).replace(/\D/g,''))||Number(p.slot)+9)*Math.PI*2;
    return new T.Vector3(bx+.35+Math.sin(time*1.7+phase)*.36,by-.37+Math.sin(time*2.3+phase)*.15,Math.sin(time*.65+phase)*1.38);
  }
  function packetPosition(p,time,byId) {
    const slot=((Number(p.slot)||0)%10+10)%10,phase=random(Number(String(p.id).replace(/\D/g,''))||slot+9)*Math.PI*2;
    const age=Number(p.age)||0;
    if(p.stage==='fuel')return fuelPosition(slot);
    if(p.stage==='fire')return fuelPosition(slot); // Chemical energy stays in its fuel.
    if(p.stage==='water')return waterPacketPosition(p,time);
    if(p.stage==='steam')return steamCurve.getPointAt(clamp(age/4,0,1));
    if(p.stage==='wheel'){
      const a=(Number(lastModel.angle)||0)-(Number(p.turnStart)||0)+phase;
      return engineMotionOrigin().lerp(new T.Vector3(crankX+.18,wheelCenter.y+Math.cos(a)*.78,wheelCenter.z+Math.sin(a)*.78),clamp(age/.7,0,1));
    }
    if(p.stage==='loss'){
      const parent=p.parent?byId.get(p.parent):null;
      const thermal=parent&&parent.stage!=='loss'&&parent.stage!=='spent';
      const cooling=p.parent==null&&Math.abs(Number(p.x)-286)<1&&Math.abs(Number(p.y)-260)<1;
      let origin=lossOrigins.get(p.id);
      if(!origin){
        const previous=energyMeshes.get(p.id);
        if(cooling&&previous?.userData.stage==='water')origin=previous.position.clone();
        else if(cooling)origin=packetPosition({...p,stage:'water'},Math.max(0,time-age),byId);
        else if(parent&&Math.abs(Number(p.x)-258)<1&&Math.abs(Number(p.y)-262)<1)origin=fireWasteOrigin(parent);
        else if(thermal&&parent.stage==='water')origin=new T.Vector3(bx+1.15,2.2,-.2+Math.sin(phase));
        else if(thermal&&parent.stage==='steam')origin=steamCurve.getPointAt(.34);
        else if(thermal&&parent.stage==='wheel')origin=engineWasteOrigin();
        else if(p.parent)origin=new T.Vector3(bx+.7,2.6,Math.sin(phase));
        else{const heat=conversionMeshes.get(p.id+':friction-heat');origin=heat?heat.position.clone():packetPosition({...p,stage:'wheel',age:Math.max(.7,p.age)},Math.max(0,time-age),byId).add(new T.Vector3(.4,.25,0));}
        lossOrigins.set(p.id,origin.clone());
      }else origin=origin.clone();
      return origin.add(new T.Vector3(.16*age+Math.sin(phase)*age*.07,.16*age,Math.cos(phase)*age*.07));
    }
    return new T.Vector3();
  }
  function updatePackets(model,visible) {
    packetGroup.visible=!!visible;
    const ids=new Set(),activeConversions=new Set(),byId=new Map((model.packets||[]).map(p=>[p.id,p]));
    for(const p of model.packets||[]){
      if(!(p.amount>0)||p.stage==='spent'||p.stage==='reserve')continue;
      ids.add(p.id);let face=energyMeshes.get(p.id);
      if(!face){face=new T.Mesh(energyGeometry,packetMaterials.thermal);face.name=`energy-${p.id}`;face.renderOrder=100;face.frustumCulled=false;packetGroup.add(face);energyMeshes.set(p.id,face);}
      const kind=p.stage==='fuel'||p.stage==='fire'?'chemical':p.stage==='wheel'?'kinetic':'thermal';
      const frictionProgress=p.stage==='wheel'?clamp(((Number(model.angle)||0)-(Number(p.turnStart)||0)-Math.PI*4)/(Math.PI*2),0,1):0;
      const progress=p.stage==='fire'?clamp((Number(p.age)||0)/(model.version===2?1.4:2.52),0,1):p.stage==='steam'?clamp(((Number(p.age)||0)-4)/.8,0,1):0;
      const amount=(p.stage==='fire'||p.stage==='steam')?p.amount*(1-progress):p.stage==='wheel'?p.amount*(1-frictionProgress):p.amount;
      face.material=packetMaterials[kind];face.position.copy(packetPosition(p,Number(model.time)||0,byId));face.quaternion.copy(camera.quaternion);
      const px=width<600?29:38.5,size=frustumWidth/camera.zoom*px/width*Math.sqrt(clamp(amount,0,100)/100);face.scale.set(size,size,1);face.visible=amount>1e-8;
      face.userData={packetId:p.id,component:'main',stage:p.stage,amount,kind,pixelSide:px*Math.sqrt(amount/100)};
      function output(component,kind,amount,position){
        if(amount<=1e-8)return;
        const key=p.id+':'+component;activeConversions.add(key);let child=conversionMeshes.get(key);
        if(!child){child=new T.Mesh(energyGeometry,packetMaterials[kind]);child.name=`conversion-${key}`;child.renderOrder=101;child.frustumCulled=false;packetGroup.add(child);conversionMeshes.set(key,child);}
        const side=frustumWidth/camera.zoom*px/width*Math.sqrt(amount/100);child.position.copy(position);child.quaternion.copy(camera.quaternion);child.scale.set(side,side,1);child.visible=true;
        child.userData={packetId:p.id,component,stage:p.stage,amount,kind,pixelSide:px*Math.sqrt(amount/100)};
      }
      if(p.stage==='fire'){
        const converted=p.amount*progress,useful=converted*(p.efficient?.8:1);
        const travel=clamp(((Number(p.age)||0)-1.4)/.6,0,1),blend=travel*travel*(3-2*travel);
        output('converted-heat','thermal',useful,fireHeatOrigin(p).lerp(waterPacketPosition(p,Number(model.time)||0),blend));
        output('conversion-loss','thermal',converted-useful,fireWasteOrigin(p));
      }else if(p.stage==='steam'&&progress>0){
        const converted=p.amount*progress,useful=converted*(p.efficient?.2:1);
        output('converted-motion','kinetic',useful,engineMotionOrigin());
        output('conversion-loss','thermal',converted-useful,engineWasteOrigin());
      }else if(p.stage==='wheel'&&frictionProgress>0){
        output('friction-heat','thermal',p.amount*frictionProgress,packetPosition(p,Number(model.time)||0,byId).add(new T.Vector3(.4,.25,0)));
      }
    }
    for(const [id,face] of conversionMeshes)if(!activeConversions.has(id)){packetGroup.remove(face);conversionMeshes.delete(id);}

    for(const [id,face] of energyMeshes)if(!ids.has(id)){packetGroup.remove(face);energyMeshes.delete(id);lossOrigins.delete(id);}
  }
  function draw(model=lastModel,options=lastOptions) {
    if(destroyed)return;lastModel=model||lastModel;lastOptions=options||{};
    model=lastModel;transparent=!!lastOptions.transparent;
    const time=Number(model.time)||0,angle=Number(model.angle)||0,packets=model.packets||[];
    const boiling=model.boiling===true||(packets.filter(p=>p.stage==='water').length>=4);isBoiling=boiling;
    for(const mat of [boilerShell,boilerEnds,cylinderShell,cylinderEndShell,cylinderRibShell,pipeShell]){
      if(mat.transparent!==transparent){mat.transparent=transparent;mat.depthWrite=!transparent;mat.side=transparent?T.DoubleSide:T.FrontSide;mat.needsUpdate=true;}
      mat.opacity=transparent?.1:1;
    }
    root.traverse(o=>{if(o.isMesh&&[boilerShell,boilerEnds,cylinderShell,cylinderEndShell,cylinderRibShell,pipeShell].includes(o.material))o.castShadow=!transparent;});
    for(const mat of underbauMaterials){if(mat.transparent!==transparent){mat.transparent=transparent;mat.depthWrite=!transparent;mat.side=transparent?T.DoubleSide:T.FrontSide;mat.needsUpdate=true;}mat.opacity=transparent?.1:mat.userData.normalOpacity;}
    underbau.traverse(o=>{if(o.isMesh)o.castShadow=!transparent;});
    water.visible=vapor.visible=surface.visible=innerPipe.visible=piston.visible=chamber.visible=transparent;
    frontGlass.material.opacity=transparent?.15:.78;
    const waterPositions=surface.geometry.attributes.position;
    for(let i=0;i<waterPositions.count;i++){const x=waterPositions.getX(i),y=waterPositions.getY(i);waterPositions.setZ(i,boiling?Math.sin(x*8+time*4+y*3)*.016:Math.sin(x*4+time*.8)*.005);}waterPositions.needsUpdate=true;
    needle.rotation.z=2.02-clamp(Number(model.pressure)||0,0,1)*4.05;
    wheel.rotation.x=-angle;crankDisc.rotation.x=-angle;
    const pin=new T.Vector3(crankX+.08,wheelCenter.y+Math.sin(angle)*crankR,wheelCenter.z+Math.cos(angle)*crankR);
    crankPin.position.copy(pin);const crossZ=.12+Math.cos(angle)*.29;
    const cross=new T.Vector3(crankX+.08,ey,crossZ);crosshead.position.z=crossPin.position.z=crossZ;piston.position.z=1.38+Math.cos(angle)*.29;
    updateRod(pistonRod,new T.Vector3(ex,ey,piston.position.z),new T.Vector3(ex,ey,crossZ));updateRod(connectingRod,cross,pin);
    // Newest original packet owns each slot; refuelling replaces the black remains.
    const newest=new Map();for(const p of packets)if(p.parent==null)newest.set(((p.slot%10)+10)%10,p);
    const burning=packets.filter(p=>p.stage==='fire').length;
    for(let slot=0;slot<10;slot++){
      let p=newest.get(slot);
      const slots=model.slots||model.fuelSlots;
      if(Array.isArray(slots)){const ref=slots[slot];const id=typeof ref==='object'?ref?.id:ref;p=id?packets.find(q=>q.id===id)||p:null;}
      const fresh=!!p&&p.stage==='fuel',fire=!!p&&p.stage==='fire',charred=fresh?0:fire?clamp((Number(p.age)||0)/(model.version===2?1.4:2.52),0,1):1;
      fuelPieces[slot].material.color.copy(fuelColors[0]).lerp(fuelColors[1],charred);fuelPieces[slot].userData={fresh,loaded:!!p};
      fuelPieces[slot].scale.y=fresh?1:fire?1-charred*.25:.45;fuelPieces[slot].visible=transparent&&!!p;
      flames[slot].visible=transparent&&burning>0;flames[slot].scale.set(.8,(fire?1:.42)*(.85+Math.sin(time*13+slot)*.16),.8);
    }
    fireLight.intensity=transparent&&burning?2.7+Math.sin(time*18)*.4:0;
    for(const b of bubbles){b.mesh.visible=transparent&&boiling;
      const cycle=time*b.speed*.42+b.phase,q=cycle%1,seed=b.seed+Math.floor(cycle)*43;
      const x=(random(seed+70)-.5)*1.43,z=(random(seed+90)-.5)*3.32;
      const bottom=-Math.sqrt(Math.max(.01,.87*.87-x*x))+.065;
      b.mesh.position.set(bx+x+Math.sin(time*2+b.phase*9)*.018,by+bottom*(1-q)-.025,z);
      b.mesh.scale.setScalar((.65+random(seed+101)*.8)*(.7+q*.6));}
    for(const b of steamBubbles){b.mesh.visible=transparent&&boiling;const q=(time*.15+b.phase)%1;b.mesh.position.copy(steamCurve.getPointAt(q));}
    updatePackets(model,lastOptions.energyVisible);renderer.render(scene,camera);
  }
  // Fit actual projected parts instead of a guessed box: the tall chimney and
  // the nearest blue corner both keep a visible margin in every viewport.
  root.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  const fit={left:Infinity,right:-Infinity,bottom:Infinity,top:-Infinity};
  root.traverse(o=>{
    if(!o.geometry)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;
    for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){
      const p=new T.Vector3(x,y,z).applyMatrix4(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
      fit.left=Math.min(fit.left,p.x);fit.right=Math.max(fit.right,p.x);fit.bottom=Math.min(fit.bottom,p.y);fit.top=Math.max(fit.top,p.y);
    }
  });
  const cameraShift=new T.Vector3((fit.left+fit.right)/2,(fit.bottom+fit.top)/2,0).applyQuaternion(camera.quaternion);camera.position.add(cameraShift);camera.updateMatrixWorld(true);
  const defaultPosition=camera.position.clone(),defaultTarget=new T.Vector3(-.05,2.9,0).add(cameraShift);
  const OrbitControls=typeof steamOrbit!=='undefined'?steamOrbit.OrbitControls:null;
  if(!OrbitControls){renderer.dispose();return fail(new Error('Lokale OrbitControls fehlen.'));}
  const controls=new OrbitControls(camera,canvas);
  controls.target.copy(defaultTarget);controls.enableDamping=false;controls.enablePan=true;controls.screenSpacePanning=true;
  controls.minZoom=.55;controls.maxZoom=5.5;controls.minPolarAngle=.13;controls.maxPolarAngle=Math.PI/2-.035;
  controls.rotateSpeed=.7;controls.zoomSpeed=.85;controls.panSpeed=.75;
  controls.mouseButtons={LEFT:T.MOUSE.ROTATE,MIDDLE:T.MOUSE.DOLLY,RIGHT:T.MOUSE.PAN};
  controls.touches={ONE:T.TOUCH.ROTATE,TWO:T.TOUCH.DOLLY_PAN};
  controls.update();
  function cameraChanged(){
    // Orbit events also redraw a paused simulation, including its facing E tiles.
    if(controls.target.y<.2){const lift=.2-controls.target.y;controls.target.y+=lift;camera.position.y+=lift;}
    camera.lookAt(controls.target);camera.updateMatrixWorld(true);draw();
  }
  controls.addEventListener('change',cameraChanged);
  function resetCamera(){
    if(destroyed)return;camera.position.copy(defaultPosition);controls.target.copy(defaultTarget);camera.zoom=1;camera.updateProjectionMatrix();controls.update();draw();
  }
  function zoomBy(factor){
    if(destroyed||!Number.isFinite(factor)||factor<=0)return;camera.zoom=clamp(camera.zoom*factor,controls.minZoom,controls.maxZoom);camera.updateProjectionMatrix();controls.update();draw();
  }
  function focusPart(name){
    if(destroyed)return;
    const parts={boiler:{target:[bx,by,-.05],zoom:1.8},pipe:{target:[-.35,2.6,1.0],zoom:2.0},piston:{target:[ex,ey,1.05],zoom:2.8}};
    const part=parts[name];if(!part){resetCamera();return;}
    const target=new T.Vector3(...part.target);camera.position.add(target.clone().sub(controls.target));controls.target.copy(target);camera.zoom=part.zoom;camera.updateProjectionMatrix();controls.update();draw();
  }
  function resize() {
    if(destroyed)return;
    const rect=host.getBoundingClientRect();width=Math.max(1,Math.round(rect.width||host.clientWidth||920));height=Math.max(1,Math.round(rect.height||host.clientHeight||width*.61));
    const aspect=width/height,worldHeight=Math.max((fit.top-fit.bottom)*1.055,(fit.right-fit.left)*1.055/aspect);frustumWidth=worldHeight*aspect;
    camera.left=-frustumWidth/2;camera.right=frustumWidth/2;camera.top=worldHeight/2;camera.bottom=-worldHeight/2;camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);draw();
  }
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;observer?.observe(host);
  function destroy() {
    if(destroyed)return;destroyed=true;observer?.disconnect();controls.removeEventListener('change',cameraChanged);controls.dispose();
    const geometries=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});geometries.add(energyGeometry);geometries.forEach(g=>g.dispose());
    allMaterials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environmentTarget?.dispose();renderer.dispose();canvas.remove();energyMeshes.clear();conversionMeshes.clear();
  }
  resize();
  return {render:draw,resize,destroy,resetCamera,zoomBy,focusPart,canvas,getDebug:()=>({renderer:'three-webgl',webgl:true,WebGLok:true,revision:T.REVISION,width,height,transparent,camera:{position:camera.position.toArray(),target:controls.target.toArray(),zoom:camera.zoom},wallVisible:sideWall.visible,unterbauOpacity:underbauMaterials[0]?.opacity,substructureOpacities:[...new Set(underbauMaterials.map(m=>m.opacity))],gaugeAnchor:{x:gaugeX,z:gaugeZ,boilerTop,stemBottom:boilerTop,stemTop:boilerTop+gaugeStemHeight,gaugeBottom:gaugeY-.39},boilerTop,energyVisible:packetGroup.visible,waterVisible:water.visible,waterCount:(lastModel.packets||[]).filter(p=>p.stage==='water').length,boiling:isBoiling,activeBubbleCount:isBoiling?bubbles.length:0,bubbleCount:bubbles.filter(b=>b.mesh.visible).length,boilingBubbles:bubbles.filter(b=>b.mesh.visible).length,steamBubbles:steamBubbles.filter(b=>b.mesh.visible).length,fuelCount:fuelPieces.filter(m=>m.userData.loaded&&m.userData.fresh).length,fuelSlots:fuelPieces.map(m=>({visible:m.visible,loaded:!!m.userData.loaded,fresh:!!m.userData.fresh,color:m.material.color.getHexString()})),packets:[...energyMeshes.values(),...conversionMeshes.values()].map(m=>({...m.userData,position:m.position.toArray()})),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles})};
}
