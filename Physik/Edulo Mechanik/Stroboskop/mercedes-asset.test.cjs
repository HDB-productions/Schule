const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {inspect,readGLB,localMatrix,multiply,point}=require('./inspect-mercedes.cjs');
const source=fs.readFileSync(path.join(__dirname,'assets/Mercedes-W212-original.glb'));
const metadata=inspect(source),{json}=readGLB(source);
const near=(a,b,tolerance=1e-6)=>assert(Math.abs(a-b)<=tolerance,`${a} != ${b}`);

test('metadata identifies the unchanged original GLB, author and CC BY 4.0 license',()=>{
  assert.equal(metadata.source.byteLength,37334564);
  assert.equal(metadata.source.sha256,'8ed00a65ea18726c512ab2b24c9149fb497bc8ff176f418a341c1d7f1b2fad0e');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname,'assets/Mercedes-W212-metadata.json'),'utf8')),metadata);
  assert.equal(metadata.asset.version,'2.0');assert.match(metadata.asset.extras.author,/Peter_D/);assert.match(metadata.asset.extras.license,/CC-BY-4\.0/);
  assert.match(metadata.asset.extras.source,/119c5e10733142b197aa53b86f6aeb04$/);
  assert.deepEqual(metadata.stats,{nodeCount:186,meshCount:88,primitiveCount:88,vertices:298271,triangles:362853});
});

test('all buffers and images are embedded without external resource URIs',()=>{
  assert.equal(metadata.embedded.allInline,true);assert.deepEqual(metadata.embedded.externalURIs,[]);
  assert.equal(metadata.embedded.buffers,1);assert.equal(metadata.embedded.images,46);
  for(const buffer of json.buffers)assert(!buffer.uri||buffer.uri.startsWith('data:'));
  for(const image of json.images){assert(Number.isInteger(image.bufferView));const view=json.bufferViews[image.bufferView];assert.equal(view.buffer,0);assert((view.byteOffset||0)+view.byteLength<=json.buffers[0].byteLength);}
  assert(metadata.source.binaryBytes>=json.buffers[0].byteLength);
});

test('four independently named nonoverlapping wheel hierarchies retain their group pivots',()=>{
  assert.deepEqual(metadata.wheels.map(w=>w.name),['WheelFL','WheelFR','WheelRL','WheelRR']);
  const occupied=new Set();
  for(const wheel of metadata.wheels){
    assert.equal(json.nodes[wheel.nodeIndex].name,wheel.name);assert.equal(wheel.parentIndex,metadata.body.nodeIndex);assert.equal(wheel.meshNodeIndices.length,2);
    for(const index of wheel.descendantNodeIndices){assert(!occupied.has(index));occupied.add(index);}
    assert(wheel.descendantNodeIndices.includes(wheel.nodeIndex));assert(wheel.meshNodeIndices.every(index=>wheel.descendantNodeIndices.includes(index)));
    assert.deepEqual(wheel.pivotLocal,json.nodes[wheel.nodeIndex].translation);
    near(Math.hypot(...wheel.axisWorld),1);wheel.axisWorld.forEach((value,i)=>near(value,i===0?1:0));
    near(wheel.radiusWorld,0.3293208173);near(wheel.boundsWorld.size[1],wheel.boundsWorld.size[2]);assert(wheel.boundsWorld.size[0]<2*wheel.radiusWorld);
    near(wheel.boundsWorld.center[1],wheel.pivotWorld[1],0.001);near(wheel.boundsWorld.center[2],wheel.pivotWorld[2]);
  }
  const rearLeft=metadata.wheels.find(w=>w.name==='WheelRL');
  assert(rearLeft.descendantNodeIndices.some(i=>json.nodes[i].name==='mesh_WheelRR'));
  assert.equal(rearLeft.name,'WheelRL');
});

test('original positive-y front maps to world negative-z; axle pairs remain aligned',()=>{
  for(const wheel of metadata.wheels){
    const front=wheel.name[5]==='F',left=wheel.name.endsWith('L');
    assert(front?wheel.pivotLocal[1]>0:wheel.pivotLocal[1]<0);
    assert(front?wheel.pivotWorld[2]<0:wheel.pivotWorld[2]>0);
    assert(front?wheel.boundsWorld.center[2]<0:wheel.boundsWorld.center[2]>0);
    assert(left?wheel.pivotWorld[0]<0:wheel.pivotWorld[0]>0);
    near(wheel.pivotWorld[1],0.32939,1e-5);
  }
  for(const suffix of ['F','R']){const pair=metadata.wheels.filter(w=>w.name[5]===suffix);near(pair[0].pivotWorld[1],pair[1].pivotWorld[1]);near(pair[0].pivotWorld[2],pair[1].pivotWorld[2]);}
});

test('complete world bounds include all wheels and preserve the source floor offset',()=>{
  const b=metadata.worldBounds;near(b.size[0],2.1459388733);near(b.size[1],1.4487747898);near(b.size[2],4.8708661620);
  near(metadata.floorMinY,0.00006949176827,1e-12);assert.equal(metadata.floorMinY,b.min[1]);
  for(const wheel of metadata.wheels)for(let axis=0;axis<3;axis++){assert(wheel.boundsWorld.min[axis]>=b.min[axis]-1e-10);assert(wheel.boundsWorld.max[axis]<=b.max[axis]+1e-10);}
  near(metadata.body.translationLocal[2],0.1967882812);
});

test('matrix math composes translation, quaternion, scale and explicit matrices',()=>{
  const s=Math.SQRT1_2,child=localMatrix({translation:[5,6,7],rotation:[0,0,s,s],scale:[2,3,4]});
  const p=point(child,[1,2,3]);p.forEach((value,i)=>near(value,[-1,8,19][i]));
  const parent=localMatrix({translation:[10,0,0]}),world=multiply(parent,child);
  point(world,[1,2,3]).forEach((value,i)=>near(value,[9,8,19][i]));
  const original=localMatrix({matrix:world});assert.deepEqual(original,world);assert.notEqual(original,world);
});
