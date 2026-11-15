const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {parseGLB,partition}=require('./prepare-car.cjs');
const geometry=parseGLB(fs.readFileSync(path.join(__dirname,'assets/ToyCar.glb')));
const result=partition(geometry),parts=result.parts;
const near=(a,b,tolerance)=>assert(Math.abs(a-b)<=tolerance,`${a} != ${b}`);

test('geometry statistics and generated artifact match the local ToyCar model',()=>{
  assert.equal(geometry.positions.length,66951);assert.equal(geometry.indices.length/3,88837);assert.equal(result.components.length,47);
  assert.equal(parts.bodyIndices.length/3,69869);assert.equal(parts.wheels.length,4);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname,'assets/car-parts.json'),'utf8')),parts);
  assert(geometry.positions.every(p=>p.length===3&&p.every(Number.isFinite)));
});

test('body and four nonempty wheel index partitions cover each original triangle exactly once',()=>{
  const original=new Map();
  for(let i=0;i<geometry.indices.length;i+=3){const key=geometry.indices.slice(i,i+3).join(',');original.set(key,(original.get(key)||0)+1);}
  let triangleCount=0;
  for(const indices of [parts.bodyIndices,...parts.wheels.map(w=>w.indices)]) {
    assert(indices.length>0);assert.equal(indices.length%3,0);
    for(let i=0;i<indices.length;i+=3){const key=indices.slice(i,i+3).join(',');assert((original.get(key)||0)>0,'Duplicate or foreign triangle '+key);original.set(key,original.get(key)-1);triangleCount++;}
  }
  assert.equal(triangleCount,geometry.indices.length/3);assert([...original.values()].every(count=>count===0));
});

test('wheel bounds describe cylinders along x with correctly aligned axle pivots',()=>{
  for(const wheel of parts.wheels) {
    const {min,max}=result.bounds(wheel.indices),positiveX=wheel.name.startsWith('positive-x'),positiveY=wheel.name.endsWith('positive-y');
    assert(positiveX?min[0]>50&&max[0]<96:max[0]<-50&&min[0]>-96);
    assert(positiveY?min[1]>=100&&max[1]<=165:min[1]>=-137&&max[1]<=-75);
    assert(min[2]>-66&&max[2]<-6);assert(max[0]-min[0]<2*wheel.radius);
    // The tire is polygonal: sampled y/z extrema differ by about 0.028 units.
    near(max[1]-min[1],max[2]-min[2],0.05);
    near(wheel.radius,(max[2]-min[2])/2,1e-10);near(wheel.radius,26.2863,0.002);
    near(wheel.pivot[0],(min[0]+max[0])/2,1e-10);assert.equal(wheel.pivot[1],positiveY?133.5725:-106.0024);assert.equal(wheel.pivot[2],-36.2104);
    near((min[1]+max[1])/2,wheel.pivot[1],0.02);near((min[2]+max[2])/2,wheel.pivot[2],0.02);
    for(const index of wheel.indices){const p=geometry.positions[index];assert(Math.hypot(p[1]-wheel.pivot[1],p[2]-wheel.pivot[2])<=wheel.radius+0.02);}
  }
  for(const axle of ['positive-y','negative-y']) {
    const pair=parts.wheels.filter(w=>w.name.endsWith(axle));assert.equal(pair.length,2);
    assert.deepEqual(pair[0].pivot.slice(1),pair[1].pivot.slice(1));assert(pair[0].pivot[0]*pair[1].pivot[0]<0);
  }
});

test('GLB reader honors view offsets, accessor offsets, interleaving and unsigned index types',()=>{
  for(const componentType of [5121,5123,5125]) {
    const bin=Buffer.alloc(80),positions=[[0,0,0],[1,0,0],[0,1,0]],bytes=componentType===5121?1:componentType===5123?2:4;
    positions.forEach((p,i)=>p.forEach((v,j)=>bin.writeFloatLE(v,12+16*i+4*j)));
    for(let i=0;i<3;i++)bin[bytes===1?'writeUInt8':bytes===2?'writeUInt16LE':'writeUInt32LE'](i,64+4+i*bytes);
    const json={buffers:[{byteLength:80}],bufferViews:[{buffer:0,byteOffset:8,byteLength:48,byteStride:16},{buffer:0,byteOffset:64,byteLength:16}],accessors:[{bufferView:0,byteOffset:4,componentType:5126,count:3,type:'VEC3'},{bufferView:1,byteOffset:4,componentType,count:3,type:'SCALAR'}],meshes:[{primitives:[{attributes:{POSITION:0},indices:1}]}]};
    const text=Buffer.from(JSON.stringify(json)),padded=Buffer.alloc(Math.ceil(text.length/4)*4,32);text.copy(padded);
    const glb=Buffer.alloc(12+8+padded.length+8+bin.length);glb.writeUInt32LE(0x46546c67,0);glb.writeUInt32LE(2,4);glb.writeUInt32LE(glb.length,8);glb.writeUInt32LE(padded.length,12);glb.writeUInt32LE(0x4e4f534a,16);padded.copy(glb,20);
    const offset=20+padded.length;glb.writeUInt32LE(bin.length,offset);glb.writeUInt32LE(0x004e4942,offset+4);bin.copy(glb,offset+8);
    assert.deepEqual(parseGLB(glb),{positions,indices:[0,1,2]});
  }
});
