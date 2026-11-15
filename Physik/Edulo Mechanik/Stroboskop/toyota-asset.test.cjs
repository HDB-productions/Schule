const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), zlib = require('node:zlib');
const { readGLB, viewBytes, loadSharp, sha256 } = require('./optimize-mercedes.cjs');
const { accessor, sourceGeometry, worldMatrices, normalize } = require('./prepare-toyota.cjs');
const { point } = require('./inspect-mercedes.cjs');
const read = name => fs.readFileSync(path.join(__dirname,'assets',name));
const originalBytes=read('Toyota-Corolla-original.glb'),preparedBytes=read('Toyota-Corolla.glb');
const original=readGLB(originalBytes),prepared=readGLB(preparedBytes);
const metadata=JSON.parse(read('Toyota-Corolla-metadata.json')),report=JSON.parse(read('Toyota-Corolla-optimization.json'));
const close=(a,b,message,tolerance=3e-7)=>assert(Math.abs(a-b)<tolerance,`${message}: ${a} vs ${b}`);
const wheelNames=['WheelFL','WheelFR','WheelRL','WheelRR'];

test('Toyota original, license, every material, interior and triangle totals are preserved',()=>{
  assert.equal(originalBytes.length,18501296);
  assert.equal(sha256(originalBytes),metadata.source.sha256);
  assert.equal(sha256(preparedBytes),report.output.sha256);
  assert.deepEqual(prepared.json.asset,original.json.asset);
  assert.deepEqual(prepared.json.materials,original.json.materials);
  assert.equal(metadata.asset.extras.title,'2014 Toyota Corolla E180 EU (with interior)');
  const triangleCount=g=>g.json.meshes.reduce((sum,m)=>sum+m.primitives.reduce((n,p)=>n+g.json.accessors[p.indices].count/3,0),0);
  assert.equal(triangleCount(original),84398);assert.equal(triangleCount(prepared),84398);
  assert(prepared.json.nodes.some(n=>n.name.includes('interior_front')));
  assert(prepared.json.nodes.some(n=>n.name.includes('steering_wheel')));
  assert.equal(metadata.preparation.lossless,false);assert.equal(report.removedTriangles,0);
});

test('every source triangle remains in its material with matching world positions and UV coordinates',()=>{
  const rows=sourceGeometry(original),world=worldMatrices(prepared.json),seen=new Set();
  let checkedTriangles=0;
  for(const [nodeIndex,matrix]of world){const node=prepared.json.nodes[nodeIndex];if(node.mesh===undefined)continue;
    for(const primitive of prepared.json.meshes[node.mesh].primitives){
      const info=primitive.extras.preparedSource,row=rows.find(r=>r.nodeIndex===info.nodeIndex&&r.primitiveIndex===info.primitiveIndex);
      assert(row);assert.equal(primitive.material,row.primitive.material);
      assert.deepEqual(Object.keys(primitive.attributes).sort(),Object.keys(row.primitive.attributes).sort());
      const unique=[info.nodeIndex,info.primitiveIndex,info.wheelPartition].join(':');assert(!seen.has(unique));seen.add(unique);
      const selected=[];
      for(let i=0;i<row.indices.length;i+=3){const index=row.indices[i],p=row.positions[index];
        // Independently classify front/rear and driver left/right in the normalized frame.
        const expectedWheel=(p[2]<0?'WheelF':'WheelR')+(p[0]<0?'L':'R');
        if(!row.wheel||expectedWheel===info.wheelPartition)selected.push(...row.indices.slice(i,i+3));
      }
      const indices=accessor(prepared,primitive.indices).map(a=>a[0]),positions=accessor(prepared,primitive.attributes.POSITION);
      assert.equal(indices.length,selected.length);checkedTriangles+=indices.length/3;
      const outputAttrs=Object.fromEntries(Object.entries(primitive.attributes).map(([k,i])=>[k,accessor(prepared,i)]));
      const testedVertices=new Set();
      for(let i=0;i<indices.length;i++){
        const oi=indices[i],si=selected[i],actual=point(matrix,positions[oi]);
        for(let a=0;a<3;a++)close(actual[a],row.positions[si][a],`source vertex ${row.nodeIndex}/${si} axis ${a}`);
        if(testedVertices.has(oi))continue;testedVertices.add(oi);
        for(const [semantic,values]of Object.entries(row.attributes)){
          if(semantic.startsWith('TEXCOORD_'))assert.deepEqual(outputAttrs[semantic][oi],values[si],semantic);
          if(semantic==='NORMAL'||semantic==='TANGENT'){
            const v=outputAttrs[semantic][oi];close(Math.hypot(...v.slice(0,3)),1,'unit surface vector',2e-6);
            const m=row.matrix,s=values[si],expected=normalize([m[0]*s[0]+m[4]*s[1]+m[8]*s[2],m[1]*s[0]+m[5]*s[1]+m[9]*s[2],m[2]*s[0]+m[6]*s[1]+m[10]*s[2]]),length=Math.hypot(...expected);
            for(let a=0;a<3;a++)close(v[a],expected[a]/length,'surface orientation',2e-6);
            if(semantic==='TANGENT')assert.equal(v[3],s[3]);
          }
        }
      }
    }
  }
  assert.equal(checkedTriangles,84398);
});

test('four independent wheels rotate locally around X through their true Y/Z axle centers',()=>{
  assert.deepEqual(prepared.json.nodes[0].children.length,5);
  for(const name of wheelNames){const matches=prepared.json.nodes.map((n,i)=>({n,i})).filter(({n})=>n.name===name);assert.equal(matches.length,1,name);
    const {n,i}=matches[0],wheel=metadata.wheels.find(w=>w.name===name);assert.equal(wheel.nodeIndex,i);
    assert.equal(n.matrix,undefined);assert.equal(n.rotation,undefined);assert.equal(n.scale,undefined);
    assert.deepEqual(wheel.axisWorld,[1,0,0]);assert.equal(n.children.length,4,'all four original wheel materials retained');
    assert.equal(n.translation[0]<0,name.endsWith('L'));assert.equal(n.translation[2]<0,name.includes('F'));
    close(wheel.radiusWorld,.3093835413455963,'outer tire radius',1e-7);
    close(n.translation[1],.303191,'vertical axle center',5e-7);
    close((wheel.boundsWorld.min[1]+wheel.boundsWorld.max[1])/2,n.translation[1],'centered Y');
    close((wheel.boundsWorld.min[2]+wheel.boundsWorld.max[2])/2,n.translation[2],'centered Z');
    // Rotation around X preserves axle X and radial distance for every wheel vertex.
    for(const child of n.children){const mesh=prepared.json.meshes[prepared.json.nodes[child].mesh];for(const p of mesh.primitives)for(const v of accessor(prepared,p.attributes.POSITION)){
      const angle=.87,c=Math.cos(angle),s=Math.sin(angle),rotated=[v[0],v[1]*c-v[2]*s,v[1]*s+v[2]*c];
      close(rotated[0],v[0],'axle X');close(Math.hypot(rotated[1],rotated[2]),Math.hypot(v[1],v[2]),'radial distance');
    }}
  }
});

test('frontlights establish front -Z; clean Y-up root has no hidden rotations or scale',()=>{
  const root=prepared.json.nodes[0];for(const key of ['matrix','rotation','translation','scale'])assert.equal(root[key],undefined,key);
  assert.equal(metadata.orientation.up,'+Y');assert.equal(metadata.orientation.front,'-Z');assert.equal(metadata.orientation.wheelRotationAxisLocal,'+X');
  assert(metadata.orientation.frontlightsOriginalBounds.min[2]>1.3);
  assert(metadata.orientation.frontlightsBounds.max[2]<-1.3);
  assert(metadata.worldBounds.size[2]>4.3&&metadata.worldBounds.size[2]<4.4);
  assert(metadata.worldBounds.size[1]>1.3&&metadata.worldBounds.size[1]<1.5);
});

test('27 WebP images preserve maps and stay within 512 pixels; intentional lossy settings are documented',async()=>{
  const sharp=loadSharp();assert.equal(prepared.json.images.length,27);assert.equal(prepared.json.textures.length,original.json.textures.length);
  assert(prepared.json.extensionsUsed.includes('EXT_texture_webp'));assert(prepared.json.extensionsRequired.includes('EXT_texture_webp'));
  for(const [index,texture]of prepared.json.textures.entries()){assert.equal(texture.source,undefined);assert.equal(texture.extensions.EXT_texture_webp.source,original.json.textures[index].source);assert.equal(texture.sampler,original.json.textures[index].sampler);}
  for(const [index,image]of prepared.json.images.entries()){assert.equal(image.mimeType,'image/webp');const info=await sharp(viewBytes(prepared,image.bufferView)).metadata();assert.equal(info.format,'webp');assert(info.width<=512&&info.height<=512);assert.equal(info.width,report.images[index].width);assert.equal(report.images[index].quality,90);if(report.images[index].normalMap)assert.equal(report.images[index].normalVectorsRenormalized,true);}
});

test('prepared file is self-contained, all payloads are in bounds and gzip stays comfortably below Edulo upload limit',()=>{
  const json=prepared.json;assert(json.images.every(i=>i.bufferView!==undefined&&!i.uri));assert(json.buffers.every(b=>!b.uri));
  for(const view of json.bufferViews){assert.equal(view.byteOffset%4,0);assert(view.byteOffset+view.byteLength<=json.buffers[0].byteLength);}
  for(const [index,a]of json.accessors.entries()){const data=accessor(prepared,index);assert.equal(data.length,a.count);assert(data.flat().every(Number.isFinite));}
  const gzip=zlib.gzipSync(preparedBytes,{level:9});assert.equal(gzip.length,report.output.gzipBytes);assert(gzip.length<3500000);assert(zlib.gunzipSync(gzip).equals(preparedBytes));
});
