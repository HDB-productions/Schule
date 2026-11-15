// Read-only inspection of the original glTF asset; no renderer or dependencies.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function multiply(a,b){const result=Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)result[c*4+r]+=a[k*4+r]*b[c*4+k];return result;}
function point(m,p){return [0,1,2].map(r=>m[r]*p[0]+m[4+r]*p[1]+m[8+r]*p[2]+m[12+r]);}
function localMatrix(node){
  if(node.matrix)return node.matrix.slice();
  const [x,y,z,w]=node.rotation||[0,0,0,1],[sx,sy,sz]=node.scale||[1,1,1],[tx,ty,tz]=node.translation||[0,0,0];
  return [(1-2*(y*y+z*z))*sx,2*(x*y+z*w)*sx,2*(x*z-y*w)*sx,0,
    2*(x*y-z*w)*sy,(1-2*(x*x+z*z))*sy,2*(y*z+x*w)*sy,0,
    2*(x*z+y*w)*sz,2*(y*z-x*w)*sz,(1-2*(x*x+y*y))*sz,0,tx,ty,tz,1];
}
function readGLB(buffer){
  if(buffer.readUInt32LE(0)!==0x46546c67||buffer.readUInt32LE(4)!==2||buffer.readUInt32LE(8)!==buffer.length)throw Error('Invalid GLB v2.');
  let json,binaryBytes=0;
  for(let offset=12;offset<buffer.length;){const length=buffer.readUInt32LE(offset),type=buffer.readUInt32LE(offset+4);if(offset+8+length>buffer.length)throw Error('Truncated GLB chunk.');if(type===0x4e4f534a)json=JSON.parse(buffer.subarray(offset+8,offset+8+length).toString('utf8').trim());if(type===0x004e4942)binaryBytes+=length;offset+=8+length;}
  if(!json)throw Error('Missing glTF JSON.');return {json,binaryBytes};
}
function analyze(json){
  const sceneIndex=json.scene??0,scene=json.scenes[sceneIndex],matrices=new Map(),parents=new Map();
  function visit(index,parentMatrix,parentIndex){if(matrices.has(index))throw Error('Repeated/cyclic node '+index);const node=json.nodes[index],world=multiply(parentMatrix,localMatrix(node));matrices.set(index,world);parents.set(index,parentIndex);for(const child of node.children||[])visit(child,world,index);}
  for(const index of scene.nodes)visit(index,identity(),null);
  function descendants(index){return [index,...(json.nodes[index].children||[]).flatMap(descendants)];}
  function bounds(nodeIndices){
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];let primitiveCount=0;
    for(const index of nodeIndices){const node=json.nodes[index];if(node.mesh===undefined)continue;for(const primitive of json.meshes[node.mesh].primitives){const accessor=json.accessors[primitive.attributes.POSITION];if(!accessor.min||!accessor.max)throw Error('POSITION bounds required at node '+index);primitiveCount++;
      for(let mask=0;mask<8;mask++){const p=point(matrices.get(index),[0,1,2].map(a=>(mask&(1<<a))?accessor.max[a]:accessor.min[a]));for(let a=0;a<3;a++){min[a]=Math.min(min[a],p[a]);max[a]=Math.max(max[a],p[a]);}}
    }}
    if(!primitiveCount)throw Error('No geometry in bounds.');return {min,max,size:min.map((v,a)=>max[a]-v),center:min.map((v,a)=>(max[a]+v)/2)};
  }
  const externalURIs=[];
  for(const [type,items] of [['buffers',json.buffers||[]],['images',json.images||[]]])items.forEach((item,i)=>{if(item.uri&&!item.uri.startsWith('data:'))externalURIs.push({type,index:i,uri:item.uri});});
  const worldBounds=bounds([...matrices.keys()]);
  const wheels=['WheelFL','WheelFR','WheelRL','WheelRR'].map(name=>{
    const matches=[...matrices.keys()].filter(i=>json.nodes[i].name===name);if(matches.length!==1)throw Error('Expected one named wheel group '+name);
    const nodeIndex=matches[0],worldMatrix=matrices.get(nodeIndex),descendantNodeIndices=descendants(nodeIndex),boundsWorld=bounds(descendantNodeIndices);
    const axisRaw=[worldMatrix[0],worldMatrix[1],worldMatrix[2]],length=Math.hypot(...axisRaw);
    return {name,nodeIndex,parentIndex:parents.get(nodeIndex),descendantNodeIndices,meshNodeIndices:descendantNodeIndices.filter(i=>json.nodes[i].mesh!==undefined),pivotLocal:point(localMatrix(json.nodes[nodeIndex]),[0,0,0]),pivotWorld:point(worldMatrix,[0,0,0]),axisWorld:axisRaw.map(v=>v/length),radiusWorld:boundsWorld.size[1]/2,boundsWorld,worldMatrix};
  });
  const allInline=(json.buffers||[]).every(b=>!b.uri||b.uri.startsWith('data:'))&&(json.images||[]).every(i=>i.bufferView!==undefined||(i.uri||'').startsWith('data:'));
  let vertices=0,triangles=0,primitiveCount=0;
  for(const mesh of json.meshes||[])for(const p of mesh.primitives){primitiveCount++;vertices+=json.accessors[p.attributes.POSITION].count;if(p.mode===undefined||p.mode===4)triangles+=(p.indices!==undefined?json.accessors[p.indices].count:json.accessors[p.attributes.POSITION].count)/3;}
  const bodyIndex=[...matrices.keys()].find(i=>json.nodes[i].name==='Body');
  return {asset:json.asset,sceneIndex,stats:{nodeCount:matrices.size,meshCount:json.meshes.length,primitiveCount,vertices,triangles},embedded:{buffers:(json.buffers||[]).length,images:(json.images||[]).length,allInline,externalURIs},worldBounds,floorMinY:worldBounds.min[1],body:{nodeIndex:bodyIndex,translationLocal:json.nodes[bodyIndex].translation||[0,0,0],worldMatrix:matrices.get(bodyIndex)},wheels};
}
function inspect(buffer){const {json,binaryBytes}=readGLB(buffer);return {source:{file:'Mercedes-W212-original.glb',byteLength:buffer.length,sha256:crypto.createHash('sha256').update(buffer).digest('hex'),binaryBytes},...analyze(json)};}
if(require.main===module){const metadata=inspect(fs.readFileSync(path.join(__dirname,'assets/Mercedes-W212-original.glb')));fs.writeFileSync(path.join(__dirname,'assets/Mercedes-W212-metadata.json'),JSON.stringify(metadata,null,2)+'\n');console.log(JSON.stringify(metadata,null,2));}
module.exports={readGLB,analyze,inspect,localMatrix,multiply,point};
