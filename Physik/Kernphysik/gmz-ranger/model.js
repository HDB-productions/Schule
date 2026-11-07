/* Radiation Alert Ranger – reusable, self-contained teaching model.
 * Requires window.THREE. No network assets. Exterior: SE International references.
 * Interior is a functional teaching abstraction, NOT a manufacturer service drawing.
 * Coordinates are millimetres; front +Z, back/detector window -Z, top +Y.
 */
(function (global) {
  'use strict';
  global.createRangerViewer = function createRangerViewer(container, options) {
    options = options || {};
    const T = options.THREE || (typeof THREE !== 'undefined' ? THREE : global.THREE);
    if (!T) throw new Error('Three.js fehlt.');
    const scene = new T.Scene();
    scene.background = new T.Color(options.background || '#eaf0f5');
    const camera = new T.PerspectiveCamera(34, 1, 1, 1800);
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: !!options.preserveDrawingBuffer });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, options.pixelRatio || 1.75));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none;cursor:grab';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Drehbares 3D-Modell eines Geiger-Müller-Zählers. Ziehen zum Drehen, zwei Finger zum Zoomen.');
    container.appendChild(canvas);
    const model = new T.Group();
    model.name = 'Radiation Alert Ranger – Lehrmodell';
    model.userData = { units: 'mm', exteriorDimensions: [68, 140, 33], interior: 'schematic functional abstraction, not a service drawing', source: 'https://seintl.com/products/radiation-alert-ranger/' };
    scene.add(model);
    const parts = {}, movable = [], materials = [], textures = [];
    const V = (x, y, z) => new T.Vector3(x, y, z);
    let explosion = 0, highlighted = null, disposed = false, dirty = true, frame = 0, lastTime = null;
    const internal = new Set(['window', 'cathode', 'anode', 'gas', 'voltage', 'counter', 'battery']);
    const look = V(0, 0, 0), lookGoal = look.clone();
    let yaw = .43, pitch = .20, distance = 280;
    let yawGoal = yaw, pitchGoal = pitch, distanceGoal = distance;
    const light = new T.HemisphereLight(0xe9f4ff, 0x6c7281, 2.3); scene.add(light);
    function studioLight(color, intensity, position, shadow) {
      const l = new T.DirectionalLight(color, intensity); l.position.copy(position); l.castShadow = !!shadow;
      if (shadow) { l.shadow.mapSize.set(1024, 1024); l.shadow.camera.left = -190; l.shadow.camera.right = 190; l.shadow.camera.top = 190; l.shadow.camera.bottom = -190; l.shadow.normalBias = .7; }
      scene.add(l); return l;
    }
    studioLight(0xffffff, 3.8, V(-110, 190, 180), true);
    studioLight(0xb6d4ff, 2.1, V(150, 40, -110));
    studioLight(0xffffff, 1.0, V(20, -70, 160));
    const floor = new T.Mesh(new T.PlaneGeometry(1500, 1500), new T.ShadowMaterial({ opacity: .13 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -83; floor.receiveShadow = true; scene.add(floor);
    function mat(color, extra) {
      const m = new T.MeshStandardMaterial(Object.assign({ color: color, roughness: .47, metalness: .05 }, extra));
      materials.push(m); m.userData.baseOpacity = m.opacity; m.userData.baseColor = m.color.getHex(); m.userData.baseEmissive = m.emissive.getHex(); m.userData.baseEmissiveIntensity = m.emissiveIntensity;
      return m;
    }
    const blue = () => mat(0x15429b, { roughness: .36 });
    const navy = () => mat(0x0c2558, { roughness: .65 });
    const metal = () => mat(0xa6b4be, { metalness: .8, roughness: .29 });
    function group(id, base, offset) {
      const g = new T.Group(); g.name = id; g.userData.partId = id;
      g.position.copy(base || V(0, 0, 0)); model.add(g);
      if (!parts[id]) parts[id] = g;
      movable.push({ group: g, base: g.position.clone(), offset: offset || V(0, 0, 0) });
      return g;
    }
    function mesh(parent, geometry, material, x, y, z) {
      const m = new T.Mesh(geometry, material); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true;
      parent.add(m); return m;
    }
    function outline(w, h, r) {
      const s = new T.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
    }
    function extrude(shape, d, bevel) {
      const g = new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: !!bevel, bevelSegments: 3, steps: 1, bevelSize: bevel || 0, bevelThickness: bevel || 0, curveSegments: 10 });
      g.translate(0, 0, -d / 2); return g;
    }
    function rounded(parent, w, h, d, r, material, x, y, z, bevel) { return mesh(parent, extrude(outline(w, h, r), d, bevel), material, x, y, z); }
    function cylinder(parent, radius, height, material, x, y, z, radial) {
      const m = mesh(parent, new T.CylinderGeometry(radius, radius, height, radial || 48), material, x, y, z); m.rotation.x = Math.PI / 2; return m;
    }
    function ring(parent, radius, tube, material, x, y, z) { return mesh(parent, new T.TorusGeometry(radius, tube, 8, 72), material, x, y, z); }
    function wire(parent, points, radius, material) {
      const c = new T.CatmullRomCurve3(points.map(p => V.apply(null, p)));
      return mesh(parent, new T.TubeGeometry(c, Math.max(12, points.length * 8), radius, 7, false), material);
    }
    function label(parent, w, h, x, y, z, draw, back) {
      const c = document.createElement('canvas'), logicalW=1024, logicalH=Math.max(128,Math.round(1024*h/w));
      // Keep even narrow, tall battery labels below 1024 px on both axes.
      const scale=Math.min(1,1024/logicalH);c.width=Math.round(logicalW*scale);c.height=Math.round(logicalH*scale);
      const ctx = c.getContext('2d');ctx.scale(scale,scale);draw(ctx,logicalW,logicalH);
      const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); textures.push(tex);
      const m = mat(0xffffff, { map: tex, transparent: true, alphaTest:.04, roughness: .66, side: T.DoubleSide, depthWrite: false });
      const plane = mesh(parent, new T.PlaneGeometry(w, h), m, x, y, z); plane.castShadow = false;
      if (back) plane.rotation.y = Math.PI; return plane;
    }
    function screw(parent, x, y, z, back) {
      cylinder(parent, 1.25, .55, metal(), x, y, z);
      const slot = mesh(parent, new T.BoxGeometry(1.6, .27, .15), mat(0x253444), x, y, z + (back ? -.36 : .36)); slot.rotation.z = .55;
    }

    // Two moulded case halves and their continuous recessed seam.
    const front = group('shell', V(0, 0, 0), V(-38, 12, 88));
    const rear = group('rear', V(0, 0, 0), V(-38, 0, -82));
    rounded(front, 66, 138, 6, 10, blue(), 0, 0, 12, .8);
    const sideShape = outline(66, 138, 10);
    const sh = outline(60, 132, 8); const path = new T.Path(sh.getPoints(64)); sideShape.holes.push(path);
    mesh(rear, extrude(sideShape, 23, .3), blue(), 0, 0, -2);
    const backShape = outline(66, 138, 10); const opening = new T.Path(); opening.absarc(0, 30, 24.2, 0, Math.PI * 2, true); backShape.holes.push(opening);
    mesh(rear, extrude(backShape, 3, .65), blue(), 0, 0, -14.1);
    const seam = outline(66.35, 138.35, 10); const seamHole = new T.Path(outline(64.9, 136.9, 9).getPoints(64)); seam.holes.push(seamHole);
    mesh(rear, extrude(seam, .65, 0), navy(), 0, 0, 6.4);
    for (let i = 0; i < 5; i++) {
      rounded(rear, 1.9, 7, 15.5, .8, navy(), -33.2, -24 + i * 10, -1);
      rounded(rear, 1.9, 7, 15.5, .8, navy(), 33.2, -24 + i * 10, -1);
    }
    rounded(rear, 58, 44, 1, 9, blue(), 0, -44, -16.2, .3);
    for (let i = 0; i < 5; i++) rounded(rear, 15 - Math.abs(i - 2) * 1.3, .7, .3, .3, navy(), 0, -34 + i * 1.5, -17);
    for (const x of [-26, 26]) for (const y of [-59, 61]) screw(rear, x, y, -16.5, true);
    // Mini USB opening and lanyard recess.
    rounded(rear, 7.2, 3.6, 1.5, .7, mat(0x18212b), 29, 61, 0);
    rounded(rear, 13, 4.5, 3, 2, navy(), 0, -69, 0);
    // Front controls follow the photographed six-sector yellow membrane keypad.
    const display = group('display', V(0, 0, 0), V(-38, 12, 88)); front.add(display);
    movable.pop(); // display travels with the front half, with a separate selectable ID.
    rounded(display, 53, 39, 1.6, 3.5, navy(), 0, 42, 16, .3);
    rounded(display, 47.5, 33.5, .45, 1.6, mat(0xb6c7a6, { roughness: .45 }), 0, 42, 17.1);
    label(display, 46, 31.5, 0, 42, 17.45, (c,w,h) => {
      c.fillStyle = '#b9c8aa'; c.fillRect(0,0,w,h); c.fillStyle = '#30453c';
      c.font = 'bold 47px Arial'; c.fillText('▰▰▰', 34, 70); c.font = 'bold 300px monospace'; c.fillText('0.017', 25, h*.65);
      c.font = 'bold 65px Arial'; c.textAlign='right'; c.fillText('mR/h', w-35, h-50); c.textAlign='left';
      c.strokeStyle='#4e6353'; c.lineWidth=3; c.beginPath(); c.moveTo(w*.5,h-45); c.lineTo(w*.5,h-13); c.moveTo(w*.5-16,h-29); c.lineTo(w*.5+16,h-29); c.stroke();
    });
    cylinder(front, 1.4, .8, mat(0x830d18, { emissive: 0x5f0c09, emissiveIntensity: .6 }), 0, 66, 16.5, 20);
    label(front, 52, 15, 0, 8, 16.05, (c,w,h) => {
      c.fillStyle='#f3e947'; c.font='bold 70px Arial'; c.fillText('RADIATION ALERT', 190, h*.30);
      c.fillStyle='#fff'; c.font='italic bold 225px Georgia'; c.fillText('Ranger', 20, h*.98);
    });
    cylinder(front, 24.5, 1, navy(), 0, -27, 16, 72);
    label(front, 49, 49, 0, -27, 16.56, (c,w,h) => {
      const x=w/2,y=h/2,r=w*.475; c.fillStyle='#142d5d';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.strokeStyle='#f6e936';c.lineWidth=13;c.stroke();
      c.lineWidth=10; for(let i=0;i<6;i++){const a=i*Math.PI/3;c.beginPath();c.moveTo(x+Math.cos(a)*r*.29,y+Math.sin(a)*r*.29);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.stroke();}
      c.fillStyle='#f5f6ec';c.textAlign='center';c.textBaseline='middle';c.font='bold 48px Arial';
      const names=['COUNT','((•))','MENU','☀ +','MODE','ALARM']; const angles=[-30,30,90,150,210,270];
      names.forEach((n,i)=>{const a=angles[i]*Math.PI/180;c.save();c.translate(x+Math.cos(a)*r*.67,y+Math.sin(a)*r*.67);c.rotate(i===0||i===4?a+Math.PI/2:0);c.fillText(n,0,0);c.restore();});
      c.beginPath();c.arc(x,y,r*.29,0,Math.PI*2);c.fillStyle='#172337';c.fill();c.stroke();c.strokeStyle='#fff';c.lineWidth=15;c.beginPath();c.arc(x,y,r*.165,-Math.PI*.32,Math.PI*1.32);c.stroke();c.beginPath();c.moveTo(x,y-r*.23);c.lineTo(x,y);c.stroke();
    });
    label(rear, 51, 22, 0, -9, -16.45, (c,w,h) => {
      c.fillStyle='#ebf2f6';c.textAlign='center';c.font='bold 29px Arial';c.fillText('RADIATION ALERT®  RANGER',w/2,42);
      c.font='23px Arial';c.fillText('S.E. INTERNATIONAL, INC.',w/2,80);c.fillText('www.seintl.com',w/2,112);
      c.font='20px Arial';c.fillText('FRAGILE WINDOW · DO NOT TOUCH',w/2,151);
      c.fillStyle='#eaf0f5';c.fillRect(w*.2,h-58,w*.6,23);
    }, true);

    // Pancake detector: gas-tight metallic cathode cup, flat thin mica window,
    // planar wire anode and glass/ceramic feedthrough. No axial cylindrical tube.
    const cathode = group('cathode', V(0, 30, 0), V(-10, 0, -6));
    const cathodeBacking=cylinder(cathode, 24, 1.3, metal(), 0, 0, -.8);cathodeBacking.userData.cathodeBacking=true;
    const cup = new T.CylinderGeometry(24,24,10,64,1,true); const cupMesh = mesh(cathode,cup,mat(0xa6b4be,{metalness:.8,roughness:.29,side:T.DoubleSide}),0,0,-6.5);cupMesh.rotation.x=Math.PI/2;
    ring(cathode,23.3,.85,metal(),0,0,-12);
    ring(cathode,24,.38,mat(0x53606a,{metalness:.8}),0,0,-2);
    const gas = group('gas', V(0,30,-6.9), V(33,0,-23));
    // A faint violet volume and separate pale particles read as gas, distinct
    // from the opaque silver cathode. Keep the working electrodes visible.
    const gasMaterial=mat(0xb7a5e5,{transparent:true,opacity:.11,roughness:.9,metalness:0,depthWrite:false,side:T.DoubleSide});
    cylinder(gas,22.4,9,gasMaterial,0,0,0);
    const particleGeo = new T.SphereGeometry(.46,8,6), particleMat=mat(0x79dbf4,{emissive:0x0d6888,emissiveIntensity:.25,transparent:true,opacity:.7});
    const atomicParticleGeo=new T.SphereGeometry(.46,20,14);
    // Fixed quasi-uniform illustration of the gas; not actual atoms or density.
    const neutralGas=[];
    for(let i=0;i<52;i++){const a=i*2.39996323,r=Math.sqrt((i+.5)/52)*21;const dot=mesh(gas,particleGeo,particleMat.clone(),Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*1.91)*3.5);dot.userData.neutralGas=true;neutralGas.push(dot);}
    const neutralOrigins=neutralGas.map(dot=>dot.position.clone());
    const anode=group('anode',V(0,30,-6.7),V(63,0,0));
    const gold=mat(0xd9a24a,{metalness:.82,roughness:.27});
    ring(anode,13.8,.22,gold,0,0,0);
    wire(anode,[[13.8,0,0],[19,0,0],[25,0,0],[28,0,1.8]],.23,gold);
    cylinder(anode,1.65,3,mat(0xe4dcc7,{roughness:.32}),25,0,0,16);
    // Transparent mica film and separate protective square mesh.
    const windowGroup=group('window',V(0,30,-14.8),V(-6,0,-59));
    cylinder(windowGroup,22.5,.16,mat(0xb4a88b,{metalness:.18,roughness:.28,transparent:true,opacity:.58,depthWrite:false,side:T.DoubleSide}),0,0,0);
    ring(windowGroup,23.2,.75,metal(),0,0,-.15);
    const grid=[];for(let k=-21;k<=21;k+=1.65){const edge=Math.sqrt(22.1*22.1-k*k);grid.push(k,-edge,-1.1,k,edge,-1.1,-edge,k,-1.1,edge,k,-1.1);}
    const gridGeometry=new T.BufferGeometry();gridGeometry.setAttribute('position',new T.Float32BufferAttribute(grid,3));
    const guard=new T.LineSegments(gridGeometry,new T.LineBasicMaterial({color:0x68705a,transparent:true,opacity:.85}));windowGroup.add(guard);
    // Slight irregular sheen makes the thin film visible without implying thickness.
    ring(windowGroup,21.7,.1,mat(0xdcd0b7,{transparent:true,opacity:.7}),0,0,-.2);
    label(rear,25,6,0,60,-16.5,(c,w,h)=>{c.fillStyle='#fff';c.font='italic bold 145px Georgia';c.fillText('Ranger',8,h*.8);},true);

    // Electronics grouped by function. Layout and circuit details are deliberately
    // schematic. The low voltage batteries feed a step-up high-voltage supply.
    const voltage=group('voltage',V(15,-7,0),V(75,-18,27));
    rounded(voltage,23,25,1.2,1.3,mat(0x185742),0,0,0);
    rounded(voltage,10,9,7,1,mat(0x242c38),0,3,4);
    for(const x of [-7,7]){cylinder(voltage,2.1,6,mat(0x152d43),x,-7,3);cylinder(voltage,1.9,.15,metal(),x,-7,6.1);}
    for(let i=0;i<6;i++)rounded(voltage,2.4,1.1,.7,.2,mat(0xcdb589),-8+i*3.2,10,1);
    const counter=group('counter',V(-8,18,5.5),V(25,7,42));
    rounded(counter,46,68,1.25,3,mat(0x205f4b),0,0,0);
    const traces=mat(0x4fa087,{metalness:.3,roughness:.7});
    for(let i=0;i<9;i++){rounded(counter,.42,40-i*2,.13,.1,traces,-19+i*4.6,2,0.72);rounded(counter,35-i*2,.42,.13,.1,traces,0,-26+i*6,.73);}
    rounded(counter,17,18,2.3,.6,mat(0x252b32),-3,6,1.7);
    for(let i=0;i<8;i++)for(const side of [-1,1])rounded(counter,2.3,.65,.5,.1,metal(),-3+side*9.5,1+i*1.7,1.1);
    for(let i=0;i<10;i++)rounded(counter,2.8,1.8,.9,.2,mat(i%3===0?0x3b4550:0xc3b295),-16+(i%5)*7, -15-Math.floor(i/5)*7,1.3);
    for(const x of [-18,18]) for(const y of [-29,29])cylinder(counter,1.3,1.5,metal(),x,y,1,16);
    const buzzer=cylinder(counter,6,4,mat(0x222a32),11,21,2.8);ring(counter,3,.4,mat(0x090d12),11,21,5);
    const battery=group('battery',V(0,-43,-1),V(6,-37,5));
    rounded(battery,48,53,2,3,mat(0x192530),0,0,-5);
    for(const x of [-12,12]){
      const cell=mesh(battery,new T.CylinderGeometry(7,7,48,28),mat(0xc0b8a2,{metalness:.66,roughness:.4}),x,0,1.5);
      const cap=mesh(battery,new T.CylinderGeometry(7,7,12,28),mat(0x283e54,{metalness:.3}),x,18,1.5);
      mesh(battery,new T.CylinderGeometry(2.4,2.4,1.2,20),metal(),x,24.6,1.5);
      mesh(battery,new T.CylinderGeometry(5,5,.45,24),metal(),x,-24.2,1.5);
      for(const y of [-26,26]){const contact=mesh(battery,new T.BoxGeometry(9,.6,8),metal(),x,y,1);contact.rotation.x=.2;}
      label(battery,8,25,x,0,8.7,(c,w,h)=>{c.fillStyle='#273948';c.font='bold 210px Arial';c.textAlign='center';c.fillText('AA',w/2,h*.45);c.font='130px Arial';c.fillText('1.5 V',w/2,h*.7);c.fillText('+',w/2,h*.18);});
    }
    // Explicit high-voltage terminals and flexible teaching-model leads. The
    // source and detector remain electrically joined through every reveal pose.
    // This is a functional diagram, not a manufacturer's circuit layout.
    const electricalConnections=[];
    let polarityHighlight={positive:0,negative:0};
    function terminal(parent,local,polarity){
      const socket=cylinder(parent,1.25,1.4,mat(0x343e47,{metalness:.65,roughness:.35}),...local,20);
      socket.userData.polarity=polarity;
      const contact=cylinder(parent,.67,1.7,mat(0xc0c7cd,{metalness:.8,roughness:.25}),...local,16);
      contact.userData.polarity=polarity;
    }
    function connection(id,sourceLocal,targetPart,targetLocal){
      const positive=id==='positive',color=positive?0xa84942:0x356d9b;
      terminal(voltage,sourceLocal,id);terminal(parts[targetPart],targetLocal,id);
      label(voltage,3.3,3.3,sourceLocal[0],sourceLocal[1]-3,sourceLocal[2]+1.05,(c,w,h)=>{c.fillStyle=positive?'#b63832':'#2865b1';c.font='bold '+Math.round(h*.94)+'px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(positive?'+':'−',w/2,h*.52);});
      const lead=mesh(model,new T.BufferGeometry(),mat(color,{roughness:.72,metalness:0}));
      lead.name=positive?'HV + → Anode':'HV − → Kathodenmantel';
      lead.userData={partId:'voltage',polarity:id,electricalLead:true};
      electricalConnections.push({id,source:{part:'voltage',local:sourceLocal},target:{part:targetPart,local:targetLocal},lead,points:[]});
    }
    connection('positive',[6,12,4],'anode',[28,0,1.8]);
    connection('negative',[-6,12,4],'cathode',[-24,0,-6.5]);
    function endpointWorld(endpoint){return parts[endpoint.part].localToWorld(V(...endpoint.local));}
    function updateElectricalConnections(){
      model.updateMatrixWorld(true);
      electricalConnections.forEach(c=>{
        const sourceWorld=endpointWorld(c.source),targetWorld=endpointWorld(c.target),positive=c.id==='positive',unfold=stage(explosion,.30,.60);
        const pose=sourceWorld.toArray().concat(targetWorld.toArray(),unfold,model.matrixWorld.elements).join(',');if(c.pose===pose)return;c.pose=pose;
        const a=model.worldToLocal(sourceWorld.clone()),b=model.worldToLocal(targetWorld.clone());
        // Side loops sit outside the circular entrance. They clear the front of
        // the detector cup and enter only at their actual electrode terminal.
        // Fold the slack inside the case when assembled; it unfurls continuously
        // as the boards swing out. Routing uses model coordinates, so rotating
        // or translating the whole device does not change its physical wiring.
        const slack=2+12*unfold,approach=2+3*unfold;
        const side=positive?Math.max(a.x,b.x)+slack:Math.min(a.x,b.x)-slack;
        const z=Math.min(a.z,b.z)-5-2*unfold,sourceExit=model.worldToLocal(parts.voltage.localToWorld(V(c.source.local[0],c.source.local[1]+3,c.source.local[2]+4)));
        const lowerY=Math.min(a.y-8,b.y-32);
        const points=[a,sourceExit,V(sourceExit.x,lowerY,z),V(side,lowerY,z),V(side,b.y-6,z),V(b.x+(positive?approach:-approach),b.y,b.z-3),b];
        const curve=new T.CatmullRomCurve3(points);
        const previous=c.lead.geometry;c.lead.geometry=new T.TubeGeometry(curve,72,.62,9,false);previous.dispose();
        c.points=points.map(p=>model.localToWorld(p.clone()).toArray());
      });
    }
    function getElectricalConnections(){
      // Re-evaluate transforms, so callers can verify connections even after
      // transforming the model root, without relying on a rendered frame.
      updateElectricalConnections();
      return electricalConnections.map(c=>({id:c.id,polarity:c.id,source:{part:c.source.part,local:c.source.local.slice(),world:endpointWorld(c.source).toArray()},target:{part:c.target.part,local:c.target.local.slice(),world:endpointWorld(c.target).toArray()},points:c.points.map(p=>p.slice()),cableStart:c.points[0].slice(),cableEnd:c.points[c.points.length-1].slice()}));
    }
    const partAnchorLocal={cathode:[0,23.3,-12],gas:[-6,8,-.3],anode:[13.8,0,0],voltage:[0,3,8],counter:[-3,6,3],battery:[-12,0,8.5],window:[0,0,-.2],display:[0,42,17.5],shell:[-24,0,15],rear:[-26,0,-16]};
    function getPartAnchor(id){if(!parts[id])return null;model.updateMatrixWorld(true);return parts[id].localToWorld(V(...(partAnchorLocal[id]||[0,0,0]))).toArray();}
    function setPolarityHighlight(value){
      value=value||{};const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
      polarityHighlight={positive:clamp(value.positive),negative:clamp(value.negative)};refreshMaterials();return api;
    }
    // Mechanism primitives share this scene with the lesson and the MP4 renderer.
    // Their sizes, timing, density and trajectories are illustrative, not to scale.
    const mechanism=new T.Group();mechanism.name='Schematische Vorgänge';scene.add(mechanism);
    let phaseState={phase:'off',progress:0},pairCount=8,chargeProgressOverride=null,atomicClock=null,atomicState=null,microscopic=0,fieldVisibility=0;
    const electronMat=mat(0x1198b3,{emissive:0x004b61,emissiveIntensity:.5,roughness:.25});
    const ionMat=mat(0xd26a17,{emissive:0x4b1703,emissiveIntensity:.3,roughness:.4});
    const incident=mesh(mechanism,new T.SphereGeometry(1.15,16,10),mat(0xffdc73,{emissive:0xe79f25,emissiveIntensity:1}));
    function signMaterial(sign,color){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.font='bold 105px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(sign,64,68);const tex=new T.CanvasTexture(c);textures.push(tex);return new T.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false});}
    const minusSign=signMaterial('−','#082a3e'),plusSign=signMaterial('+','#54230b');
    function chargeSign(parent,material,size){const s=new T.Sprite(material.clone());s.scale.set(size,size,1);s.renderOrder=20;parent.add(s);}
    const legacyIonGeometry=new T.SphereGeometry(1.1,12,8);
    const ionPairs=[];for(let i=0;i<16;i++){const pair={origin:neutralGas[i].position.clone(),e:mesh(mechanism,new T.SphereGeometry(.75,12,8),electronMat),ion:mesh(mechanism,legacyIonGeometry,ionMat.clone())};pair.e.userData={role:'electron',index:i};pair.ion.userData={role:'ion',index:i};chargeSign(pair.e,minusSign,1.15);chargeSign(pair.ion,plusSign,1.55);ionPairs.push(pair);}
    const collisionFlashes=ionPairs.map((pair,index)=>{const flash=ring(mechanism,.8,.045,mat(0xe8b950,{emissive:0x8d4c08,emissiveIntensity:.7,transparent:true,opacity:0,depthWrite:false}),0,0,0);flash.userData={role:'collision',index};flash.visible=false;return flash;});
    const avalanche=[];for(let i=0;i<34;i++)avalanche.push(mesh(mechanism,new T.SphereGeometry(.46,8,6),electronMat));
    const pulseDot=mesh(mechanism,new T.SphereGeometry(1.45,12,8),electronMat);
    // Illustrative directions from the positive wire toward the cathode backing;
    // no radial-field claim for the region inside a planar ring electrode.
    const fieldArrows=[];for(let i=0;i<8;i++){const a=i*Math.PI/4;const arrow=new T.ArrowHelper(V(0,0,1),V(Math.cos(a)*13.8,Math.sin(a)*13.8,.4),4.8,0xd99e34,1.4,.7);arrow.userData={role:'field',index:i};mechanism.add(arrow);fieldArrows.push(arrow);}
    const trailGeo=new T.BufferGeometry().setFromPoints([V(0,0,-58),V(0,0,-5)]);
    const trail=new T.Line(trailGeo,new T.LineDashedMaterial({color:0xf0bb44,dashSize:1.6,gapSize:1.5,transparent:true,opacity:.6}));trail.computeLineDistances();mechanism.add(trail);
    const glow=ring(mechanism,13.8,.47,mat(0x7ce9ff,{emissive:0x39b8e6,emissiveIntensity:1,transparent:true,opacity:.8,depthWrite:false}),0,0,0);
    function setPhase(phase,progress){phase=String(phase||'off');const changed=phase!==phaseState.phase;phaseState={phase,progress:Math.max(0,Math.min(1,Number(progress)||0))};if(changed)refreshMaterials();dirty=true;return api;}
    function setPairCount(value){pairCount=Math.max(1,Math.min(8,Math.round(Number(value)||8)));dirty=true;return api;}
    function setChargeProgress(value){
      if(value===null||typeof value!=='object')chargeProgressOverride=null;
      else{chargeProgressOverride={};for(const key of ['electron','ion'])if(Number.isFinite(value[key]))chargeProgressOverride[key]=Math.max(0,Math.min(1,value[key]));}
      dirty=true;return api;
    }
    function setAtomicClock(value){
      const wasActive=atomicClock!==null;
      if(value===null){atomicClock=null;atomicState=null;neutralGas.forEach((dot,i)=>{dot.position.copy(neutralOrigins[i]);dot.scale.setScalar(1);dot.geometry=particleGeo;});}
      else{if(!global.RangerAtomicMotion)throw new Error('atomic-motion.js muss vor model.js geladen werden.');atomicClock=Object.assign({},value);}
      if(wasActive!==(atomicClock!==null))refreshMaterials();dirty=true;return api;
    }
    function setMicroscopic(value){const next=value===true?1:value===false?0:Math.max(0,Math.min(1,Number(value)||0));if(next!==microscopic){microscopic=next;refreshMaterials();}dirty=true;return api;}
    function setFieldVisibility(value){const next=Math.max(0,Math.min(1,Number(value)||0));if(next!==fieldVisibility){fieldVisibility=next;refreshMaterials();}dirty=true;return api;}
    function getAtomicState(){if(atomicClock===null)return null;const state=global.RangerAtomicMotion.evaluate(Number(atomicClock.time)||0,Object.assign({},atomicClock,{chargeProgress:chargeProgressOverride}));return Object.assign(state,{sensorOrigin:gas.position.toArray()});}
    function updateAtomicMechanism(){
      atomicState=getAtomicState();const state=atomicState,phase=phaseState.phase,p=phaseState.progress;
      mechanism.visible=true;mechanism.position.copy(gas.position);
      state.atoms.forEach((atom,i)=>{neutralGas[i].position.fromArray(atom.position);neutralGas[i].visible=atom.visible;neutralGas[i].scale.setScalar(.22/.46);neutralGas[i].geometry=atomicParticleGeo;});
      ionPairs.forEach((pair,i)=>{
        const electron=state.electrons[i],ion=state.ions[i];
        pair.e.position.fromArray(electron.position);pair.ion.position.fromArray(ion.position);pair.e.visible=electron.visible;pair.ion.visible=ion.visible;
        pair.e.scale.setScalar(.11/.75);pair.ion.geometry=atomicParticleGeo;pair.ion.scale.setScalar(.22/.46);
        // An ion reaches the cathode at the exact position from which its neutral
        // atom continues. The same sphere, radius and final material avoid a
        // visual jump as charge disappears; the plus sign fades continuously.
        const neutralBlend=stage(state.time,ion.neutralizedAt-.45,ion.neutralizedAt),m=pair.ion.material,neutral=neutralGas[i].material;
        m.color.copy(ionMat.color).lerp(neutral.color,neutralBlend);m.emissive.copy(ionMat.emissive).lerp(neutral.emissive,neutralBlend);
        m.emissiveIntensity=ionMat.emissiveIntensity+(neutral.emissiveIntensity-ionMat.emissiveIntensity)*neutralBlend;m.opacity=1+(neutral.opacity-1)*neutralBlend;m.roughness=ionMat.roughness+(neutral.roughness-ionMat.roughness)*neutralBlend;m.transparent=neutralBlend>0;m.depthWrite=m.opacity>.8;
        pair.e.children.forEach(s=>s.position.set(0,0,.05));pair.ion.children.forEach(s=>{s.position.set(0,0,.05);s.material.opacity=1-neutralBlend;});
      });
      incident.visible=state.radiation.visible;incident.position.fromArray(state.radiation.position);incident.scale.setScalar(.4);
      trail.visible=state.radiation.visible;trail.position.set(0,0,0);trail.material.opacity=.65;
      const positions=trail.geometry.attributes.position;positions.setXYZ(0,...state.radiation.start);positions.setXYZ(1,...state.radiation.position);positions.needsUpdate=true;trail.geometry.computeBoundingSphere();trail.computeLineDistances();
      collisionFlashes.forEach((flash,i)=>{const age=state.time-state.events[i].time;flash.visible=age>=0&&age<.45;flash.position.fromArray(state.events[i].position);flash.scale.setScalar(.275+Math.max(0,age)*.25);flash.material.opacity=flash.visible?(1-age/.45)*.85:0;});
      avalanche.forEach(dot=>{dot.visible=false;});
      fieldArrows.forEach(a=>{const strength=state.fieldStrength,opacity=fieldVisibility*(.25+.75*strength),length=4.8*strength;a.visible=opacity>0;a.setLength(length,Math.min(1.4,length*.32),Math.min(.7,length*.18));a.userData.fieldStrength=strength;a.line.material.transparent=a.cone.material.transparent=true;a.line.material.opacity=a.cone.material.opacity=opacity;});
      glow.visible=false;
      // The electrical pulse is shown by the signal trace, not as an oversized
      // electron flying out of the sensor and through the external circuit.
      pulseDot.visible=false;
    }
    function updateMechanism(){
      if(atomicClock!==null){updateAtomicMechanism();return;}
      collisionFlashes.forEach(flash=>{flash.visible=false;});incident.scale.setScalar(1);
      const legacyTrail=trail.geometry.attributes.position;legacyTrail.setXYZ(0,0,0,-58);legacyTrail.setXYZ(1,0,0,-5);legacyTrail.needsUpdate=true;trail.geometry.computeBoundingSphere();trail.computeLineDistances();
      const phase=phaseState.phase,p=phaseState.progress;mechanism.visible=phase!=='off'&&phase!=='none';
      neutralGas.forEach((dot,i)=>{dot.visible=!mechanism.visible||i>=pairCount||phase==='incoming'||(phase==='ionization'&&i/pairCount>=p)||(phase==='deadtime'&&p>.92);});
      if(!mechanism.visible)return;
      mechanism.position.copy(gas.position); // same deterministic exploded position
      incident.visible=phase==='incoming'||phase==='ionization';
      const firstAtom=ionPairs[0].origin;
      if(pairCount===1)incident.position.set(firstAtom.x,firstAtom.y,phase==='incoming'?-58+p*(58+firstAtom.z):firstAtom.z+p*3.5);
      else incident.position.set(-7,3,phase==='incoming'?-58+p*50:-8+p*11);
      trail.visible=phase==='incoming'||phase==='ionization';trail.position.set(pairCount===1?firstAtom.x:-7,pairCount===1?firstAtom.y:3,pairCount===1?firstAtom.z+5:0);trail.material.opacity=phase==='incoming'?.55:.55*(1-p);
      fieldArrows.forEach(a=>{a.setLength(4.8,1.4,.7);a.visible=phase==='drift'||phase==='deadtime';a.line.material.transparent=a.cone.material.transparent=true;a.line.material.opacity=a.cone.material.opacity=phase==='deadtime'?p:1;});
      glow.visible=['avalanche','pulse','quench','deadtime'].includes(phase);glow.material.opacity=phase==='quench'?.8*(1-p):phase==='deadtime'?.12+.35*p:.8;
      const pairVisible=['ionization','drift','avalanche','pulse','quench','deadtime'].includes(phase);
      ionPairs.forEach((pair,i)=>{
        const visible=pairVisible&&i<pairCount&&(phase!=='ionization'||i/pairCount<p);pair.e.visible=visible&&(phase==='ionization'||phase==='drift');pair.ion.visible=visible;
        const origin=pair.origin;
        const electronTarget=V(origin.x,origin.y,.2).normalize().multiplyScalar(13.8);electronTarget.z=.2;
        // Positive ions drift toward the cathode backing plate; they must not
        // cross the positive anode ring on their way to the outer side wall.
        const ionTarget=V(origin.x,origin.y,5.4);
        const electronDrift=chargeProgressOverride?.electron??(phase==='drift'?p:0);
        const ionDrift=chargeProgressOverride?.ion??(phase==='drift'?p*.12:phase==='avalanche'?.12+p*.10:phase==='pulse'?.22+p*.08:phase==='quench'?.30+p*.35:phase==='deadtime'?.65+p*.35:0);
        pair.e.position.copy(origin).lerp(electronTarget,electronDrift);if(phase==='ionization')pair.e.position.x+=.8+Math.max(0,p-i/pairCount)*1.5;
        pair.ion.position.copy(origin).lerp(ionTarget,ionDrift);
        pair.e.scale.setScalar(1);pair.ion.scale.setScalar(phase==='deadtime'?Math.min(1,(1-p)*5):1);
        pair.ion.geometry=legacyIonGeometry;pair.ion.material.copy(ionMat);pair.ion.children.forEach(s=>{s.material.opacity=1;});
        pair.e.children.forEach(s=>s.position.set(0,0,0));pair.ion.children.forEach(s=>s.position.set(0,0,0));
      });
      avalanche.forEach((dot,i)=>{
        dot.visible=phase==='avalanche'&&i/avalanche.length<=p;
        const a=.15+Math.sin(i*2.7)*(.05+.3*p),r=13.8+(1-p)*(2+(i%5)*.4);
        dot.position.set(Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*1.9)*(.8*(1-p)+.2));
      });
      pulseDot.visible=phase==='pulse';
      if(pulseDot.visible){const start=anode.position.clone().add(V(28,0,1.8)),end=counter.position.clone().add(V(-3,6,4));pulseDot.position.copy(start.lerp(end,p)).sub(mechanism.position);}
    }
    // No external answer labels: parent lesson owns all pedagogical captions.
    const selectionBox=new T.Box3Helper(new T.Box3(),0xe6a638);selectionBox.visible=false;selectionBox.material.transparent=true;selectionBox.material.opacity=.7;scene.add(selectionBox);
    function partIdFor(obj){while(obj&&obj!==model){if(obj.userData.partId)return obj.userData.partId;obj=obj.parent;}return null;}
    model.traverse(o=>{if(o.material){for(const m of [].concat(o.material)){if(!m.userData.baseOpacity&&m.userData.baseOpacity!==0){m.userData.baseOpacity=m.opacity;m.userData.baseColor=m.color?m.color.getHex():null;m.userData.baseEmissive=m.emissive?m.emissive.getHex():null;}}}});
    function refreshMaterials(){
      // A running atomic clock changes particles only. Device transparency is
      // controlled continuously by setMicroscopic, not by a phase/clock switch.
      const activeMechanism=atomicClock===null&&phaseState.phase!=='off'&&phaseState.phase!=='none';
      const isolate=activeMechanism||(highlighted&&internal.has(highlighted));
      model.traverse(o=>{if(!o.material)return;const id=partIdFor(o),selected=id===highlighted;
        for(const m of [].concat(o.material)){
          const ghost=isolate&&!selected; const b=m.userData.baseOpacity===undefined?1:m.userData.baseOpacity;
          m.opacity=ghost?Math.min(b,.18):b;
          if(activeMechanism){
            if(['shell','rear','display','battery','voltage','counter'].includes(id))m.opacity=Math.min(b,.025);
            else if(id==='cathode')m.opacity=o.userData.cathodeBacking?.07:.55;
            else if(id==='anode')m.opacity=b;
            else if(id==='window')m.opacity=o.isLineSegments?.16:.08;
            else if(id==='gas')m.opacity=o.userData.neutralGas?.20:Math.min(b,.13);
          }
          if(atomicClock!==null&&o.userData.neutralGas)m.opacity=.88;
          if(microscopic>0&&!o.userData.neutralGas){
            // Only the working electrodes reappear with the field explanation;
            // the external housing and electronic assemblies stay faded out.
            const context=id==='anode'?.10+.40*fieldVisibility:id==='cathode'?(o.userData.cathodeBacking?.12:.30)*fieldVisibility:0;
            m.opacity=m.opacity*(1-microscopic)+context*microscopic;
          }
          if(m.color&&m.userData.baseColor!==null)m.color.setHex(atomicClock!==null&&o.userData.neutralGas?0x8e9daa:m.userData.baseColor);
          m.transparent=m.opacity<1||!!m.map;m.depthWrite=!ghost&&m.opacity>.8;
          if(m.emissive){m.emissive.setHex(atomicClock!==null&&o.userData.neutralGas?0x11181d:selected?0x6c3800:m.userData.baseEmissive||0);m.emissiveIntensity=selected?.36:(m.userData.baseEmissiveIntensity??1);}
          const polarity=o.userData.polarity||(id==='anode'?'positive':id==='cathode'?'negative':null),strength=polarity?polarityHighlight[polarity]:0;
          if(strength>0){
            const tint=new T.Color(polarity==='positive'?0xe23c36:0x286cdd);
            if(m.color)m.color.lerp(tint,strength);
            if(m.emissive){m.emissive.lerp(tint,strength);m.emissiveIntensity+=(.32-m.emissiveIntensity)*strength;}
          }
          m.needsUpdate=true;
        }
        if(!o.userData.neutralGas)o.visible=[].concat(o.material).some(m=>m.opacity>0);
        o.castShadow=microscopic===0&&(!isolate||selected);
      });
      // Highlight the actual surfaces; a bounding box would suggest CAD geometry.
      selectionBox.visible=false;
      dirty=true;
    }
    const stage=(value,start,end)=>{const x=Math.max(0,Math.min(1,(value-start)/(end-start)));return x*x*(3-2*x);};
    function updatePositions(){
      movable.forEach(p=>{p.group.position.copy(p.base);const id=p.group.userData.partId;
        if(id==='shell')p.group.position.addScaledVector(V(-45,12,65),stage(explosion,0,.30));
        else if(id==='counter'||id==='voltage'){const opening=stage(explosion,.30,.60);p.group.position.addScaledVector(V(45,0,22),opening);p.group.rotation.y=Math.PI*opening;}
        else if(id==='rear')p.group.position.addScaledVector(V(190,-18,-42),stage(explosion,.35,.65));
        else if(id==='window')p.group.position.addScaledVector(V(-34,0,-22),stage(explosion,.60,1));
        // Cathode, anode, gas and batteries retain their real shared location.
      });floor.position.y=-83-15*stage(explosion,.35,.65);model.updateMatrixWorld(true);updateElectricalConnections();if(highlighted)selectionBox.box.setFromObject(parts[highlighted]);dirty=true;
    }
    function setExplosion(value,settings){explosion=Math.max(0,Math.min(1,Number(value)||0));updatePositions();if(!settings?.preserveView){if(!highlighted){distanceGoal=280+explosion*75;lookGoal.set(0,-2,0);}else new T.Box3().setFromObject(parts[highlighted]).getCenter(lookGoal);if(options.manual){look.copy(lookGoal);distance=distanceGoal;}}return api;}
    function revealPart(id,settings){const levels={window:0,display:0,shell:0,rear:0,counter:.40,voltage:.40,battery:.65,cathode:1,anode:1,gas:1};const value=levels[id]===undefined?0:levels[id];if(settings?.apply)setExplosion(value,settings);return value;}
    function highlightPart(id){highlighted=parts[id]?id:null;refreshMaterials();updatePositions();return api;}
    function focusPart(id,focusOptions){
      if(!parts[id])return api;focusOptions=focusOptions||{};
      highlightPart(id);
      const box=new T.Box3().setFromObject(parts[id]);box.getCenter(lookGoal);const size=box.getSize(V(0,0,0));
      distanceGoal=Math.max(internal.has(id)?205:130,Math.max(size.x,size.y,size.z)*2.8);
      yawGoal=['window','anode','cathode','gas','battery'].includes(id)?-2.85:.40;pitchGoal=id==='window'?.10:.30;
      if(id==='voltage'||id==='counter')yawGoal=.40+2.45*stage(explosion,.30,.60);
      if(focusOptions.immediate||options.manual){yaw=yawGoal;pitch=pitchGoal;distance=distanceGoal;look.copy(lookGoal);}
      dirty=true;return api;
    }
    function resetView(){highlightPart(null);yawGoal=.43;pitchGoal=.20;distanceGoal=280+explosion*95;lookGoal.set(16*explosion,-2,0);if(options.manual){yaw=yawGoal;pitch=pitchGoal;distance=distanceGoal;look.copy(lookGoal);}dirty=true;return api;}
    function poseCamera(){const cp=Math.cos(pitch);camera.position.set(look.x+Math.sin(yaw)*cp*distance,look.y+Math.sin(pitch)*distance,look.z+Math.cos(yaw)*cp*distance);camera.lookAt(look);camera.updateMatrixWorld();}
    function renderAt(seconds){
      if(disposed)return;const t=Math.max(0,Number(seconds)||0);
      if(options.manual){yaw=yawGoal;pitch=pitchGoal;distance=distanceGoal;look.copy(lookGoal);}
      poseCamera();updateMechanism();updateElectricalConnections();if(highlighted)selectionBox.box.setFromObject(parts[highlighted]);renderer.render(scene,camera);dirty=false;lastTime=t;return api;
    }
    function resize(width,height){const rect=container.getBoundingClientRect();width=width||rect.width||640;height=height||rect.height||420;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;if(options.manual)renderAt(lastTime||0);return api;}
    function setView(view){if(view.target){lookGoal.fromArray(view.target);look.copy(lookGoal);}if(Number.isFinite(view.yaw))yaw=yawGoal=view.yaw;if(Number.isFinite(view.pitch))pitch=pitchGoal=view.pitch;if(Number.isFinite(view.distance))distance=distanceGoal=view.distance;dirty=true;return api;}
    function getView(){return{yaw,pitch,distance,target:look.toArray()};}
    function zoom(factor){distanceGoal=Math.max(70,Math.min(700,distanceGoal*factor));if(options.manual)distance=distanceGoal;dirty=true;return api;}
    const pointers=new Map();let pinch=0,moved=false,startPointer=null;
    function down(e){canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.style.cursor='grabbing';moved=false;startPointer={x:e.clientX,y:e.clientY};if(pointers.size===2){const p=Array.from(pointers.values());pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);} }
    function move(e){if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(Math.hypot(e.clientX-startPointer.x,e.clientY-startPointer.y)>5)moved=true;
      if(pointers.size===1){yawGoal-=(e.clientX-old.x)*.009;pitchGoal=Math.max(-1.4,Math.min(1.4,pitchGoal+(e.clientY-old.y)*.007));}
      else{const p=Array.from(pointers.values()),d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(pinch>0&&d>0)zoom(pinch/d);pinch=d;}
      if(options.manual){yaw=yawGoal;pitch=pitchGoal;}dirty=true;
    }
    function up(e){pointers.delete(e.pointerId);if(!pointers.size)canvas.style.cursor='grab';if(!moved&&options.onSelect){const r=canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hits=ray.intersectObject(model,true);const hit=hits.find(h=>h.object.material&&h.object.material.opacity>.15);if(hit)options.onSelect(partIdFor(hit.object));}}
    function wheel(e){if(document.activeElement!==canvas&&!e.ctrlKey)return;e.preventDefault();zoom(Math.exp(e.deltaY*.0015));}
    function key(e){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0'].indexOf(e.key)<0)return;e.preventDefault();if(e.key==='ArrowLeft')yawGoal-=.15;if(e.key==='ArrowRight')yawGoal+=.15;if(e.key==='ArrowUp')pitchGoal=Math.min(1.4,pitchGoal+.1);if(e.key==='ArrowDown')pitchGoal=Math.max(-1.4,pitchGoal-.1);if(e.key==='+'||e.key==='=')zoom(.9);if(e.key==='-')zoom(1.1);if(e.key==='0')resetView();dirty=true;}
    if(options.interactive!==false){canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('keydown',key);}
    let observer=null;if(global.ResizeObserver){observer=new ResizeObserver(()=>resize());observer.observe(container);}
    function tick(ms){if(disposed)return;const delta=lastTime===null?.016:Math.min(.06,Math.max(.001,ms/1000-lastTime));lastTime=ms/1000;const f=1-Math.exp(-delta*10);const changing=Math.abs(yaw-yawGoal)+Math.abs(pitch-pitchGoal)+Math.abs(distance-distanceGoal)+look.distanceTo(lookGoal)>.002;
      if(changing){yaw+=(yawGoal-yaw)*f;pitch+=(pitchGoal-pitch)*f;distance+=(distanceGoal-distance)*f;look.lerp(lookGoal,f);dirty=true;}if(dirty)renderAt(ms/1000);frame=requestAnimationFrame(tick);}
    function dispose(){disposed=true;cancelAnimationFrame(frame);if(observer)observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('keydown',key);const geos=new Set([particleGeo,atomicParticleGeo,legacyIonGeometry]),mats=new Set([ionMat,minusSign,plusSign]);scene.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)[].concat(o.material).forEach(m=>mats.add(m));});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();canvas.remove();}
    function exportModel(){
      model.updateMatrixWorld(true);
      const copy=model.clone(true),canonical=new Map();
      // Procedural geometry serializers rebuild from parameters and lose baked
      // transforms such as our centred extrusion. Serialize actual attributes.
      copy.traverse(o=>{if(o.geometry&&o.geometry.parameters){if(!canonical.has(o.geometry)){const g=new T.BufferGeometry().copy(o.geometry);g.name=o.geometry.name;g.userData=Object.assign({},o.geometry.userData,{sourceGeometryType:o.geometry.type});canonical.set(o.geometry,g);}o.geometry=canonical.get(o.geometry);}});
      const json=copy.toJSON();canonical.forEach(g=>g.dispose());return json;
    }
    const api={scene,camera,renderer,model,parts,canvas,setExplosion,revealPart,highlightPart,focusPart,resetView,resize,renderAt,setView,getView,zoom,zoomBy:zoom,setPhase,setPairCount,setChargeProgress,setAtomicClock,getAtomicState,setMicroscopic,getMicroscopic:()=>microscopic,setFieldVisibility,getFieldVisibility:()=>fieldVisibility,setPolarityHighlight,getPolarityHighlight:()=>Object.assign({},polarityHighlight),getElectricalConnections,getPartAnchor,dispose,exportModel,getExplosion:()=>explosion,getHighlight:()=>highlighted,sensor:{center:[0,30,-6.9],windowCenter:[0,30,-14.8],outwardNormal:[0,0,-1],anodeRadius:13.8},mechanism};
    resize();updatePositions();renderAt(0);if(!options.manual)frame=requestAnimationFrame(tick);return api;
  };
})(window);
