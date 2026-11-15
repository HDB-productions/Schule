/* Standalone Three.js factory. Lighting/environment belong to the caller. */
function createMotionBall(T) {
  const group = new T.Group();
  group.name = 'Rubber basketball';
  const radius = 22;

  // A height map, not a photograph: tightly packed rubber pebbles over fine grain.
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Ball surface canvas is unavailable.');
  let seed = 48271;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const pixels = context.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const gray = 104 + Math.floor(random() * 18);
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = gray;
    pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  for (let row = 0; row < 121; row++) {
    for (let column = -1; column < 206; column++) {
      const x = column * 5 + (row % 2) * 2.5 + (random() - 0.5) * 0.7;
      const y = row * 4.3 + (random() - 0.5) * 0.6;
      const gray = Math.floor(166 + random() * 28);
      context.fillStyle = `rgb(${gray},${gray},${gray})`;
      context.beginPath();
      context.ellipse(x, y, 1.5 + random() * 0.25, 1.35 + random() * 0.25, 0, 0, Math.PI * 2);
      context.fill();
    }
  }
  const bump = new T.CanvasTexture(canvas);
  bump.name = 'Procedural rubber pebble height';
  if (T.NoColorSpace !== undefined) bump.colorSpace = T.NoColorSpace;
  bump.wrapS = T.RepeatWrapping;
  bump.wrapT = T.ClampToEdgeWrapping;
  bump.anisotropy = 4;

  const rubber = new T.MeshPhysicalMaterial({
    color: 0xd67b29,
    metalness: 0,
    roughness: 0.74,
    bumpMap: bump,
    bumpScale: 0.13,
    clearcoat: 0.025,
    clearcoatRoughness: 0.85,
    sheen: 0.12,
    sheenColor: new T.Color(0xb36729),
    sheenRoughness: 0.9
  });
  const sphere = new T.Mesh(new T.SphereGeometry(radius, 96, 64), rubber);
  sphere.name = 'Pebbled rubber shell';
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  group.add(sphere);

  const seamMaterial = new T.MeshStandardMaterial({
    color: 0x201b16,
    roughness: 0.93,
    metalness: 0,
    bumpMap: bump,
    bumpScale: 0.035
  });
  const geometries = [sphere.geometry];
  // Thin channels hug the shell (outer extent < 22.4); no floating cage or rings.
  // Two central cross-seams and two bowed side-panel seams form the familiar pattern.
  const seamRadius = 21.98;
  function seam(name, position) {
    const points = Array.from({ length: 192 }, (_, i) => {
      const theta = i * Math.PI * 2 / 192;
      return new T.Vector3(...position(theta));
    });
    const curve = new T.CatmullRomCurve3(points, true, 'centripetal');
    const geometry = new T.TubeGeometry(curve, 384, 0.34, 8, true);
    geometries.push(geometry);
    const mesh = new T.Mesh(geometry, seamMaterial);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  seam('Equatorial channel', t => [seamRadius * Math.cos(t), 0, seamRadius * Math.sin(t)]);
  seam('Central meridian channel', t => [0, seamRadius * Math.cos(t), seamRadius * Math.sin(t)]);
  for (const side of [-1, 1]) {
    const x = side * seamRadius * 0.56;
    const yzRadius = Math.sqrt(seamRadius * seamRadius - x * x);
    seam(side < 0 ? 'Left bowed channel' : 'Right bowed channel', t => [x, yzRadius * Math.cos(t), yzRadius * Math.sin(t)]);
  }

  // Rotating the returned group rotates the real shell and every seam together.
  group.userData.radius = radius;
  group.userData.dispose = () => {
    geometries.forEach(geometry => geometry.dispose());
    rubber.dispose();
    seamMaterial.dispose();
    bump.dispose();
  };
  return group;
}

if (typeof module !== 'undefined' && module.exports) module.exports = createMotionBall;
