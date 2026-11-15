/* True PBR 3D scene. Exposures are rendered at their own pose; no image is translated. */
const MotionStudio=(()=>{
 const T=strobeThree;
 let promise;
 function makeEnvironment(renderer){
  const room=new T.Scene(),walls=new T.Mesh(new T.BoxGeometry(4000,3000,4000),new T.MeshBasicMaterial({color:0x404954,side:T.BackSide}));room.add(walls);
  function panel(x,y,z,w,h,intensity){const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color().setRGB(intensity,intensity,intensity),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);room.add(m);}
  panel(-600,900,800,700,1000,6);panel(900,500,100,400,1000,4);panel(0,1000,-900,1200,600,5);
  const generator=new T.PMREMGenerator(renderer),map=generator.fromScene(room,.04).texture;generator.dispose();room.traverse(n=>{n.geometry?.dispose();n.material?.dispose();});return map;
 }
 async function create(){
  if(promise)return promise;
  promise=(async()=>{
   let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});}catch{throw Error('Die räumliche Darstellung benötigt WebGL. Bitte aktiviere die Hardwarebeschleunigung oder öffne die Seite in einem Browser mit WebGL-Unterstützung.');}
   renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
   if(typeof DecompressionStream!=='function')throw Error('Für das eingebettete 3D-Modell wird ein aktueller Browser mit GZIP-Unterstützung benötigt.');
   let packed;
   if(typeof STROBE_MODEL_URL!=='undefined'){
    if(!STROBE_MODEL_URL)throw Error('Bitte die Modelldatei stroboskop-toyota-v3.bin als zweite Zusatzdatei auswählen.');
    let response;try{response=await fetch(STROBE_MODEL_URL,{credentials:'same-origin',cache:'default'});}catch{throw Error('Die Modelldatei konnte nicht geladen werden. Bitte die Zusatzdateien prüfen.');}
    if(!response.ok)throw Error('Die Modelldatei ist nicht erreichbar (HTTP '+response.status+'). Bitte die Zusatzdateien prüfen.');
    packed=new Uint8Array(await response.arrayBuffer());
   }else packed=Uint8Array.from(atob(STROBE_3D_CAR),c=>c.charCodeAt(0));
   const bytes=new Uint8Array(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
   const gltf=await new Promise((resolve,reject)=>new strobeGLTF.GLTFLoader().parse(bytes.buffer,'',resolve,reject));
   const model=gltf.scene;
   const wheelNames=['WheelFL','WheelFR','WheelRL','WheelRR'];
   for(const name of wheelNames)if(!model.getObjectByName(name))throw Error('Dem Toyota-Modell fehlt die Radgruppe '+name+'.');
   model.rotation.y=-Math.PI/2;model.updateMatrixWorld(true);
   const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
   const reference={model,size,center,minY:box.min.y,radius:STROBE_CAR_METADATA.wheels[0].radiusWorld,wheelNames};
   if(!Number.isFinite(reference.radius)||reference.radius<=0)throw Error('Der Radradius des Toyota-Modells ist ungültig.');
   const env=makeEnvironment(renderer);
   return {view:(kind,width,height)=>view(renderer,env,reference,kind,width,height)};
  })().catch(error=>{promise=null;throw error;});return promise;
 }
 function view(renderer,env,reference,kind,width,height){
  const ball=kind==='ball',scene=new T.Scene(),baseColor=new T.Color('#111922');scene.background=baseColor;scene.environment=env;scene.environmentIntensity=.9;
  const floorY=ball?-22:0;
  // Curved studio sweep: floor bends smoothly into the wall, with no cut-out horizon.
  const rows=[[1800,floorY],[700,floorY],[0,floorY],[-350,floorY]];
  for(let i=1;i<=24;i++){const angle=i/24*Math.PI/2;rows.push([-350-200*Math.sin(angle),floorY+200*(1-Math.cos(angle))]);}
  rows.push([-550,1400]);
  const vertices=[],indices=[];rows.forEach(([z,y])=>vertices.push(-2500,y,z,2500,y,z));
  for(let i=0;i<rows.length-1;i++){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}
  const sweep=new T.BufferGeometry();sweep.setAttribute('position',new T.Float32BufferAttribute(vertices,3));sweep.setIndex(indices);sweep.computeVertexNormals();
  const floorMat=new T.MeshStandardMaterial({color:0x28313a,roughness:.77,metalness:.08,side:T.DoubleSide});
  const shadowMat=new T.ShadowMaterial({color:0x000000,opacity:.32,side:T.DoubleSide});
  const floor=new T.Mesh(sweep,floorMat);floor.receiveShadow=true;scene.add(floor);
  const backdrop=new T.Group();scene.add(backdrop);
  scene.add(new T.HemisphereLight(0xe4efff,0x25201b,1.8));
  const key=new T.DirectionalLight(0xfff0d5,3.5);key.position.set(-350,700,650);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-650;key.shadow.camera.right=650;key.shadow.camera.top=600;key.shadow.camera.bottom=-200;key.shadow.camera.near=1;key.shadow.camera.far=2200;key.shadow.normalBias=.55;key.shadow.bias=-.00008;key.shadow.radius=3;scene.add(key);scene.add(key.target);
  const fill=new T.DirectionalLight(0xbfd8ff,1.2);fill.position.set(600,250,-250);scene.add(fill);
  const aspect=width/height,worldWidth=1040,worldHeight=worldWidth/aspect;
  const camera=new T.OrthographicCamera(-worldWidth/2,worldWidth/2,worldHeight/2,-worldHeight/2,1,6000);
  if(ball){camera.position.set(90,430,1400);camera.lookAt(0,180,0);}else{camera.position.set(180,280,1200);camera.lookAt(0,22,0);}
  let object,carRoot,wheels=[];
  if(ball)object=createMotionBall(T);
  else{
   carRoot=reference.model.clone(true);const c=MotionModel.config(kind),scale=c.objectWidth/reference.size.x;carRoot.scale.setScalar(scale);carRoot.position.set(-reference.center.x*scale,-reference.minY*scale,-reference.center.z*scale);
   // Preserve the Toyota paint, chrome, rubber and original material maps.
   carRoot.traverse(n=>{if(n.isMesh){n.material=n.material.clone();
    // Transparent exposure frames cannot refract a missing opaque backdrop.
    // Keep the original lens texture/alpha, using its ordinary surface shading.
    if(n.material.transmission>0)n.material.transmission=0;
   }});
   wheels=reference.wheelNames.map(name=>carRoot.getObjectByName(name));object=new T.Group();object.add(carRoot);
  }
  object.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});scene.add(object);
  const rotationAxis=new T.Vector3(.12,.25,1).normalize(),cache=new Map();
  function configure(){renderer.setSize(width,height,false);}
  function copy(){const frame=document.createElement('canvas');frame.width=width;frame.height=height;frame.getContext('2d').drawImage(renderer.domElement,0,0);return frame;}
  configure();object.visible=false;renderer.setClearColor(baseColor,1);renderer.render(scene,camera);const background=copy();object.visible=true;
  function pose(t){const p=MotionModel.sample(kind,t);object.position.x=p.x-500;
   if(ball){object.position.y=620-p.y;object.quaternion.setFromAxisAngle(rotationAxis,p.rotation);}
   else{const c=MotionModel.config(kind),scale=c.objectWidth/reference.size.x,worldRadius=reference.radius*scale;if(!Number.isFinite(worldRadius)||worldRadius<=0)throw Error('Der skalierte Radradius ist ungültig.');wheels.forEach(wheel=>{wheel.rotation.x=-(p.x-90)/worldRadius;});}
  }
  function render(t){configure();pose(t);scene.background=null;backdrop.visible=false;floor.material=shadowMat;renderer.setClearColor(0x000000,0);renderer.render(scene,camera);return renderer.domElement;}
  function snapshot(t){const k=t.toFixed(6);if(!cache.has(k)){
   // Finite exposure uses distinct true 3D poses, including wheel rotation and shadows.
   // It does not smear or shift an already rendered picture in screen space.
   const frame=document.createElement('canvas');frame.width=width;frame.height=height;const capture=frame.getContext('2d');
   if(t>0){capture.globalAlpha=.10;capture.drawImage(render(Math.max(0,t-.005)),0,0);capture.globalAlpha=.14;capture.drawImage(render(Math.max(0,t-.0025)),0,0);}
   capture.globalAlpha=t>0?.95:1;capture.drawImage(render(t),0,0);cache.set(k,frame);
  }return cache.get(k);}
  return {background,snapshot,render,renderer:'webgl-pbr',wheelCount:wheels.length,wheelRadius:ball?0:reference.radius*MotionModel.config(kind).objectWidth/reference.size.x,wheelAngles:()=>wheels.map(w=>w.rotation.x)};
 }
 return {create};
})();
