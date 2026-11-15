// Prepare a small Corolla asset. Geometry is retained; textures are intentionally lossy.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), zlib = require('node:zlib');
const { readGLB, viewBytes, writeGLB, loadSharp, sha256 } = require('./optimize-mercedes.cjs');
const { localMatrix, multiply, point, analyze } = require('./inspect-mercedes.cjs');
const identity = () => [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const normalize = p => [-p[0],p[1],-p[2]]; // Source headlights prove +Z front; rotate 180 degrees around Y.
const WHEELS = ['WheelFL','WheelFR','WheelRL','WheelRR'];
const sizes = { SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16 };
const types = { 5120:[1,'getInt8','writeInt8'],5121:[1,'getUint8','writeUInt8'],5122:[2,'getInt16','writeInt16LE'],5123:[2,'getUint16','writeUInt16LE'],5125:[4,'getUint32','writeUInt32LE'],5126:[4,'getFloat32','writeFloatLE'] };
function accessor(glb, index) {
  const a = glb.json.accessors[index], v = glb.json.bufferViews[a.bufferView];
  assert(!a.sparse && v.buffer === 0, 'Embedded nonsparse accessors required.');
  const [bytes, method] = types[a.componentType], count = sizes[a.type], stride = v.byteStride || bytes * count;
  const data = new DataView(glb.bin.buffer,glb.bin.byteOffset,glb.bin.byteLength), start = (v.byteOffset || 0) + (a.byteOffset || 0);
  return Array.from({length:a.count},(_,i)=>Array.from({length:count},(_,c)=>data[method](start+i*stride+c*bytes,true)));
}
function worldMatrices(json) {
  const matrices = new Map();
  function visit(index,parent) { assert(!matrices.has(index),'Shared/cyclic node unsupported.'); const m=multiply(parent,localMatrix(json.nodes[index]));matrices.set(index,m);for(const child of json.nodes[index].children||[])visit(child,m); }
  for (const root of json.scenes[json.scene || 0].nodes) visit(root,identity());
  return matrices;
}
function direction(matrix, v, normal = false) {
  const a=[matrix[0],matrix[1],matrix[2]],b=[matrix[4],matrix[5],matrix[6]],c=[matrix[8],matrix[9],matrix[10]];
  const cross=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const bc=cross(b,c),ca=cross(c,a),ab=cross(a,b),det=a.reduce((s,x,i)=>s+x*bc[i],0);
  const cols=normal?[bc.map(x=>x/det),ca.map(x=>x/det),ab.map(x=>x/det)]:[a,b,c];
  const p=normalize([0,1,2].map(i=>cols[0][i]*v[0]+cols[1][i]*v[1]+cols[2][i]*v[2])),length=Math.hypot(...p);
  return p.map(x=>x/length);
}
function bounds(points) { const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(const p of points)for(let a=0;a<3;a++){min[a]=Math.min(min[a],p[a]);max[a]=Math.max(max[a],p[a]);}return {min,max,center:min.map((x,i)=>(x+max[i])/2),size:min.map((x,i)=>max[i]-x)}; }
function wheelName(p) { return 'Wheel'+(p[2]<0?'F':'R')+(p[0]<0?'L':'R'); }
function sourceGeometry(glb) {
  const matrices=worldMatrices(glb.json),rows=[],wheelNodeIndices=[];
  const parentIndex=glb.json.nodes.findIndex(n=>n.name==='corolla_e180_wheels');
  assert(parentIndex>=0);wheelNodeIndices.push(...glb.json.nodes[parentIndex].children);
  for(const [nodeIndex,matrix] of matrices){const node=glb.json.nodes[nodeIndex];if(node.mesh===undefined)continue;
    for(const [primitiveIndex,p] of glb.json.meshes[node.mesh].primitives.entries()){
      assert(p.mode===undefined||p.mode===4,'Triangle primitives required.');
      const attributes=Object.fromEntries(Object.entries(p.attributes).map(([key,index])=>[key,accessor(glb,index)]));
      const positions=attributes.POSITION.map(p=>normalize(point(matrix,p))),indices=p.indices!==undefined?accessor(glb,p.indices).map(a=>a[0]):positions.map((_,i)=>i);
      assert.equal(indices.length%3,0);
      rows.push({nodeIndex,primitiveIndex,node,matrix,primitive:p,attributes,positions,indices,wheel:wheelNodeIndices.includes(nodeIndex)});
    }
  }
  return rows;
}
async function prepare(source, sharp=loadSharp()) {
  const original=readGLB(source),rows=sourceGeometry(original),originalJson=original.json;
  assert(!originalJson.animations&&!originalJson.skins,'Static model required for transform baking.');
  const frontRows=rows.filter(r=>r.node.name.includes('frontlights')),frontOriginal=bounds(frontRows.flatMap(r=>r.positions.map(normalize)));
  assert(frontOriginal.center[2]>1,'Source frontlights must face +Z.');
  const json={asset:structuredClone(originalJson.asset),scene:0,scenes:[{nodes:[0]}],nodes:[{name:'Toyota_Corolla_Normalized',children:[1]},{name:'Body',children:[]}],meshes:[],accessors:[],bufferViews:[],buffers:[{byteLength:0}],materials:structuredClone(originalJson.materials),samplers:structuredClone(originalJson.samplers),textures:structuredClone(originalJson.textures),images:[],extensionsUsed:[...(originalJson.extensionsUsed||[]),'EXT_texture_webp'],extensionsRequired:['EXT_texture_webp']};
  const chunks=[];let offset=0;
  function append(data, extra={}) {const pad=(4-offset%4)%4;if(pad){chunks.push(Buffer.alloc(pad));offset+=pad;}const index=json.bufferViews.length;json.bufferViews.push({buffer:0,byteOffset:offset,byteLength:data.length,...extra});chunks.push(data);offset+=data.length;return index;}
  function addAccessor(values, template, target, isPosition=false) {
    const [bytes,,writer]=types[template.componentType],components=sizes[template.type],data=Buffer.alloc(values.length*bytes*components);
    for(let i=0;i<values.length;i++)for(let c=0;c<components;c++)data[writer](values[i][c],(i*components+c)*bytes);
    const a={componentType:template.componentType,count:values.length,type:template.type,bufferView:append(data,{target})};
    if(template.normalized!==undefined)a.normalized=template.normalized;
    if(isPosition){const b=bounds(values);a.min=b.min;a.max=b.max;}
    json.accessors.push(a);return json.accessors.length-1;
  }
  const wheelBounds=Object.fromEntries(WHEELS.map(name=>[name,bounds(rows.filter(r=>r.wheel).flatMap(r=>r.positions.filter(p=>wheelName(p)===name)))]));
  const wheelNodes={};for(const name of WHEELS){const i=json.nodes.length;wheelNodes[name]=i;json.nodes.push({name,translation:wheelBounds[name].center,children:[]});json.nodes[0].children.push(i);}
  let sourceTriangles=0,outputTriangles=0;
  for(const row of rows){sourceTriangles+=row.indices.length/3;const groups=new Map();
    for(let i=0;i<row.indices.length;i+=3){const tri=row.indices.slice(i,i+3),name=row.wheel?wheelName(row.positions[tri[0]]):'Body';if(row.wheel)assert(tri.every(index=>wheelName(row.positions[index])===name),'Triangle crosses wheel quadrants.');if(!groups.has(name))groups.set(name,[]);groups.get(name).push(...tri);}
    for(const [name,oldIndices]of groups){const mapping=new Map(),oldVertices=[];for(const index of oldIndices)if(!mapping.has(index)){mapping.set(index,mapping.size);oldVertices.push(index);}const pivot=name==='Body'?[0,0,0]:wheelBounds[name].center,attributes={};
      for(const [semantic,index]of Object.entries(row.primitive.attributes)){const originalAccessor=originalJson.accessors[index];let values;
        if(semantic==='POSITION')values=oldVertices.map(i=>row.positions[i].map((x,a)=>Math.fround(x-pivot[a])));
        else if(semantic==='NORMAL')values=oldVertices.map(i=>direction(row.matrix,row.attributes[semantic][i],true).map(Math.fround));
        else if(semantic==='TANGENT')values=oldVertices.map(i=>[...direction(row.matrix,row.attributes[semantic][i]).map(Math.fround),row.attributes[semantic][i][3]]);
        else values=oldVertices.map(i=>row.attributes[semantic][i]);
        attributes[semantic]=addAccessor(values,originalAccessor,34962,semantic==='POSITION');
      }
      const indexValues=oldIndices.map(i=>[mapping.get(i)]),componentType=oldVertices.length<=65535?5123:5125;
      const primitive={...structuredClone(row.primitive),attributes,indices:addAccessor(indexValues,{componentType,type:'SCALAR'},34963),extras:{...row.primitive.extras,preparedSource:{nodeIndex:row.nodeIndex,primitiveIndex:row.primitiveIndex,wheelPartition:row.wheel?name:null}}};
      const meshIndex=json.meshes.length;json.meshes.push({name:row.node.name+(row.wheel?'_'+name:''),primitives:[primitive]});
      const nodeIndex=json.nodes.length;json.nodes.push({name:json.meshes[meshIndex].name,mesh:meshIndex});json.nodes[name==='Body'?1:wheelNodes[name]].children.push(nodeIndex);outputTriangles+=indexValues.length/3;
    }
  }
  assert.equal(outputTriangles,sourceTriangles);
  const normalTextures=new Set();for(const m of json.materials){if(m.normalTexture)normalTextures.add(m.normalTexture.index);if(m.extensions?.KHR_materials_clearcoat?.clearcoatNormalTexture)normalTextures.add(m.extensions.KHR_materials_clearcoat.clearcoatNormalTexture.index);}
  const normalImages=new Set([...normalTextures].map(i=>originalJson.textures[i].source)),imageReport=[];
  for(const [index,image] of originalJson.images.entries()){
    const input=viewBytes(original,image.bufferView),info=await sharp(input).metadata();
    let pipeline=sharp(input).resize({width:512,height:512,fit:'inside',withoutEnlargement:true,kernel:'lanczos3'}),width,height;
    if(normalImages.has(index)){
      const raw=await pipeline.ensureAlpha().raw().toBuffer({resolveWithObject:true});width=raw.info.width;height=raw.info.height;
      for(let p=0;p<raw.data.length;p+=4){const v=[raw.data[p]/127.5-1,raw.data[p+1]/127.5-1,raw.data[p+2]/127.5-1],length=Math.hypot(...v)||1;for(let a=0;a<3;a++)raw.data[p+a]=Math.round((v[a]/length+1)*127.5);}
      pipeline=sharp(raw.data,{raw:{width,height,channels:4}});
    }
    const output=await pipeline.webp({quality:90,alphaQuality:100,effort:4,smartSubsample:true}).toBuffer(),result=await sharp(output).metadata();
    json.images.push({bufferView:append(output),mimeType:'image/webp'});imageReport.push({index,name:originalJson.bufferViews[image.bufferView].name,originalWidth:info.width,originalHeight:info.height,width:result.width,height:result.height,originalBytes:input.length,bytes:output.length,normalMap:normalImages.has(index),quality:90,normalVectorsRenormalized:normalImages.has(index)});
  }
  for(const texture of json.textures){texture.extensions={...texture.extensions,EXT_texture_webp:{source:texture.source}};delete texture.source;}
  json.buffers[0].byteLength=offset;const output=writeGLB(json,Buffer.concat(chunks)),analysis=analyze(json),gzip=zlib.gzipSync(output,{level:9});
  const metadata={source:{file:'Toyota-Corolla-original.glb',byteLength:source.length,sha256:sha256(source)},...analysis,orientation:{up:'+Y',front:'-Z',wheelRotationAxisLocal:'+X',sourceFront:'+Z',sourceToPrepared:'Bake original world transforms, then rotate 180 degrees around Y.',frontlightsBounds:bounds(frontRows.flatMap(r=>r.positions)),frontlightsOriginalBounds:frontOriginal},preparation:{allTrianglesRetained:true,interiorRetained:true,materialsUnchanged:true,textureMaxDimension:512,textureEncoding:'WebP quality 90, alpha quality 100; normal maps resized and vectors renormalized. Intentionally lossy.',lossless:false}};
  const report={source:metadata.source,output:{file:'Toyota-Corolla.glb',bytes:output.length,sha256:sha256(output),gzipBytes:gzip.length},sourceTriangles,outputTriangles,sourceMeshCount:originalJson.meshes.length,outputMeshCount:json.meshes.length,removedTriangles:0,interiorRetained:true,materialsUnchanged:true,geometry:'Every original triangle preserved; transforms baked to Float32 world positions, wheel primitives spatially partitioned and vertices reindexed. No decimation or quantization.',textures:'27 images resized to at most 512 pixels and encoded WebP quality 90. Normal vectors renormalized after resize. Lossy image preparation; not lossless.',asset:json.asset,images:imageReport};
  return {output,metadata,report};
}
if(require.main===module)(async()=>{const originalPath=path.join(__dirname,'assets/Toyota-Corolla-original.glb'),source=fs.readFileSync(originalPath),result=await prepare(source);assert.equal(sha256(fs.readFileSync(originalPath)),result.metadata.source.sha256);fs.writeFileSync(path.join(__dirname,'assets/Toyota-Corolla.glb'),result.output);for(const key of ['metadata','report'])fs.writeFileSync(path.join(__dirname,'assets/Toyota-Corolla-'+(key==='report'?'optimization':key)+'.json'),JSON.stringify(result[key],null,2)+'\n');console.log(JSON.stringify({bytes:result.output.length,gzipBytes:result.report.output.gzipBytes,triangles:result.report.outputTriangles,wheels:result.metadata.wheels.map(w=>({name:w.name,pivot:w.pivotWorld,radius:w.radiusWorld})),frontlights:result.metadata.orientation.frontlightsBounds}));})().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={prepare,accessor,worldMatrices,sourceGeometry,normalize,wheelName,direction,bounds};
