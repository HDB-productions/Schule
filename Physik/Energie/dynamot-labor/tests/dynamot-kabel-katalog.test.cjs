const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),sharp=require(process.env.SHARP_MODULE||'sharp');
const dir=__dirname,source=fs.readFileSync(path.join(dir,'../dynamot-labor-szene.js'),'utf8');
const slots=vm.runInNewContext(source.match(/export const LAB_SLOTS=([\s\S]*?);/)[1]);
const ports=slots.flatMap((s,i)=>[0,1].map(pin=>({slot:s.id,id:i+1,pin}))),pairs=[];for(let i=0;i<ports.length;i++)for(let j=i+1;j<ports.length;j++)pairs.push([ports[i],ports[j]]);assert.equal(pairs.length,91);
const devices=slots.map((s,i)=>({id:i+1,slot:s.id,type:s.id[0]==='M'?'motor':'lamp',omega:0,angle:0,weight:false,crank:false,hand:false,rate:12,mass:.4,height:1}));
const raw=fs.readFileSync(path.join(dir,'../dynamot-labor.html'),'utf8').replace('init();frame=requestAnimationFrame(tick);','window.labTest={get state(){return state},get view(){return view},render,save};init();frame=requestAnimationFrame(tick);');
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(raw);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1180,height:720}});await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('canvas').waitFor();const out=path.join(dir,'kabel-katalog');fs.mkdirSync(out,{recursive:true});const failures=[],tiles=[];
 for(const [n,pair]of pairs.entries()){
  const label=pair.map(p=>p.slot+':'+(p.pin?'schwarz':'rot')).join(' – '),w={a:pair[0].id,ap:pair[0].pin,b:pair[1].id,bp:pair[1].pin};
  for(const full of [true,false]){
   const ds=full?devices:devices.filter(d=>pair.some(p=>p.id===d.id));
   const result=await page.evaluate(({ds,w,slots})=>{const s=labTest.state;s.devices=ds;s.wires=[w];s.next=8;labTest.render();const ps=labTest.view.getWirePoints(0),plugs=labTest.view.getPlugSamples();const problems=[];
    for(const [i,p]of ps.entries()){
     if(p.y<.045-.001)problems.push('table');if(p.y>Math.max(...plugs.map(p=>p.exit[1]))+.1)problems.push('high');
     for(const d of ds){const slot=slots.find(s=>s.id===d.slot),x=p.x-slot.x,z=p.z-slot.z;if(d.type==='lamp'){
      if(p.y<.21&&Math.abs(x)<1.29&&Math.abs(z)<.94)problems.push('lamp-base-'+d.slot);
      if(p.y>.8&&p.y<1.36&&Math.hypot(x,z)<.32)problems.push('bulb-'+d.slot);
     }else if(p.z>1.65&&p.z<3.7&&p.y>.75&&p.y<2.5&&Math.abs(x)<1.05)problems.push('motor-'+d.slot);}
    }
    const eq=(p,v)=>Math.hypot(p.x-v[0],p.y-v[1],p.z-v[2])<1e-6;if(!eq(ps[0],plugs[0].exit)||!eq(ps.at(-1),plugs[1].exit))problems.push('endpoint');
    return [...new Set(problems)];
   },{ds,w,slots:JSON.parse(JSON.stringify(slots))});
   if(result.length)failures.push({label,full,problems:result});
  }
  const sa=slots.find(s=>s.id===pair[0].slot),sb=slots.find(s=>s.id===pair[1].slot),cx=(sa.x+sb.x)/2,cz=(sa.z+sb.z)/2,span=Math.hypot(sa.x-sb.x,sa.z-sb.z),distance=Math.max(7,span*1.15+5);
  await page.evaluate(({cx,cz,distance})=>labTest.view.restoreView({position:[cx,distance*.8,cz-distance],target:[cx,.35,cz]}),{cx,cz,distance});
  const png=await page.locator('.stage').screenshot();const filename=String(n+1).padStart(2,'0')+'.png';fs.writeFileSync(path.join(out,filename),png);
  const text=Buffer.from('<svg width="384" height="28"><rect width="100%" height="100%" fill="white"/><text x="8" y="20" font-family="sans-serif" font-size="15">'+(n+1)+'. '+label+'</text></svg>');
  const tile=await sharp({create:{width:384,height:340,channels:4,background:'white'}}).composite([{input:await sharp(png).resize(384,312,{fit:'fill'}).toBuffer(),top:28,left:0},{input:text,top:0,left:0}]).png().toBuffer();tiles.push(tile);
 }
 for(let start=0;start<tiles.length;start+=12){const slice=tiles.slice(start,start+12);await sharp({create:{width:1152,height:340*Math.ceil(slice.length/3),channels:4,background:'white'}}).composite(slice.map((input,i)=>({input,left:(i%3)*384,top:Math.floor(i/3)*340}))).png().toFile(path.join(out,'kontakt-'+(Math.floor(start/12)+1)+'.png'));}
 fs.writeFileSync(path.join(out,'pruefung.json'),JSON.stringify({pairs:91,geometricConfigurations:182,failures},null,2));console.log(JSON.stringify({pairs:91,geometricConfigurations:182,failures}));assert.equal(failures.length,0);
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
