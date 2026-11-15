// Partition the original ToyCar geometry; preserve its original vertex indices.
const fs = require('node:fs');
const path = require('node:path');

function parseGLB(buffer) {
  if(buffer.readUInt32LE(0)!==0x46546c67||buffer.readUInt32LE(4)!==2||buffer.readUInt32LE(8)!==buffer.length)throw Error('Invalid GLB v2.');
  let json,bin;
  for(let offset=12;offset<buffer.length;) {
    const length=buffer.readUInt32LE(offset),type=buffer.readUInt32LE(offset+4),data=buffer.subarray(offset+8,offset+8+length);
    if(type===0x4e4f534a)json=JSON.parse(data.toString('utf8').trim());
    if(type===0x004e4942)bin=data;
    offset+=8+length;
  }
  if(!json||!bin)throw Error('GLB requires JSON and BIN chunks.');
  const types={5120:[1,'getInt8'],5121:[1,'getUint8'],5122:[2,'getInt16'],5123:[2,'getUint16'],5125:[4,'getUint32'],5126:[4,'getFloat32']};
  const sizes={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};
  function accessor(index) {
    const a=json.accessors[index],v=json.bufferViews[a.bufferView];
    if(a.sparse||v.buffer!==0)throw Error('Sparse/external accessors are not supported.');
    const [bytes,method]=types[a.componentType]||[];const columns=sizes[a.type];
    if(!bytes||!columns)throw Error('Unsupported accessor format.');
    const view=new DataView(bin.buffer,bin.byteOffset,bin.byteLength),stride=v.byteStride||bytes*columns,start=(v.byteOffset||0)+(a.byteOffset||0);
    return Array.from({length:a.count},(_,i)=>Array.from({length:columns},(_,j)=>view[method](start+i*stride+j*bytes,true)));
  }
  const primitive=json.meshes[0].primitives[0];
  if(primitive.mode!==undefined&&primitive.mode!==4)throw Error('Expected triangle geometry.');
  const positions=accessor(primitive.attributes.POSITION),indices=accessor(primitive.indices).map(row=>row[0]);
  if(indices.length%3)throw Error('Incomplete triangle.');
  return {positions,indices};
}

function partition({positions,indices}) {
  const parents=positions.map((_,i)=>i),rank=new Uint8Array(positions.length),welds=new Map();
  function find(i){while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;}
  function join(a,b){a=find(a);b=find(b);if(a===b)return;if(rank[a]<rank[b])[a,b]=[b,a];parents[b]=a;if(rank[a]===rank[b])rank[a]++;}
  positions.forEach((p,i)=>{const key=p.map(v=>Math.round(v*1000)).join(',');if(welds.has(key))join(i,welds.get(key));else welds.set(key,i);});
  for(let i=0;i<indices.length;i+=3){join(indices[i],indices[i+1]);join(indices[i],indices[i+2]);}
  const groups=new Map();
  for(let i=0;i<indices.length;i+=3){const root=find(indices[i]);if(!groups.has(root))groups.set(root,[]);groups.get(root).push(...indices.slice(i,i+3));}
  function bounds(list){const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(const i of list)for(let a=0;a<3;a++){min[a]=Math.min(min[a],positions[i][a]);max[a]=Math.max(max[a],positions[i][a]);}return {min,max};}
  const bodyIndices=[],wheels=new Map(),components=[];
  for(const list of groups.values()) {
    const bbox=bounds(list),[xmin,ymin,zmin]=bbox.min,[xmax,ymax,zmax]=bbox.max;
    const side=xmin>50&&xmax<96?'positive-x':xmax<-50&&xmin>-96?'negative-x':null;
    const axle=ymin>=100&&ymax<=165?'positive-y':ymin>=-137&&ymax<=-75?'negative-y':null;
    components.push({indices:list,bbox});
    if(side&&axle&&zmin>-66&&zmax<-6){const name=side+'-'+axle;if(!wheels.has(name))wheels.set(name,{name,indices:[]});wheels.get(name).indices.push(...list);}
    else for(const index of list)bodyIndices.push(index);
  }
  if(wheels.size!==4)throw Error('Expected four wheel groups; found '+wheels.size);
  const outputWheels=[...wheels.values()].sort((a,b)=>a.name.localeCompare(b.name)).map(wheel=>{
    const bbox=bounds(wheel.indices);
    return {...wheel,pivot:[(bbox.min[0]+bbox.max[0])/2,wheel.name.endsWith('positive-y')?133.5725:-106.0024,-36.2104],radius:(bbox.max[2]-bbox.min[2])/2};
  });
  return {parts:{bodyIndices,wheels:outputWheels},components,bounds};
}

if(require.main===module) {
  const geometry=parseGLB(fs.readFileSync(path.join(__dirname,'assets/ToyCar.glb'))),{parts,components}=partition(geometry);
  fs.writeFileSync(path.join(__dirname,'assets/car-parts.json'),JSON.stringify(parts));
  console.log(JSON.stringify({vertices:geometry.positions.length,triangles:geometry.indices.length/3,components:components.length,bodyTriangles:parts.bodyIndices.length/3,wheels:parts.wheels.map(w=>({name:w.name,triangles:w.indices.length/3,pivot:w.pivot,radius:w.radius}))},null,2));
}
module.exports={parseGLB,partition};
