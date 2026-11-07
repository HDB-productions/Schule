/* Export the reusable Ranger scene. Run after build.cjs; no network is used.
 * node Physik/Kernphysik/gmz-ranger/export-model.cjs
 * Optional: PLAYWRIGHT_MODULE points to another installed Playwright module.
 */
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const moduleCandidates=[process.env.PLAYWRIGHT_MODULE,'playwright',path.join(path.dirname(process.execPath),'../node_modules/playwright'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
let chromium;for(const candidate of moduleCandidates){try{({chromium}=require(candidate));break;}catch{}}
if(!chromium)throw Error('Playwright fehlt. PLAYWRIGHT_MODULE auf das lokale Paket setzen.');
const dir = __dirname, workspace = path.resolve(dir, '../../..');
const modelRoute = '/Physik/Kernphysik/gmz-ranger/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.mp4':'video/mp4' };
const server = http.createServer((req,res) => {
  let file;
  try { file = path.resolve(workspace, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); }
  catch { res.writeHead(400); res.end(); return; }
  if (!file.startsWith(workspace + path.sep)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  fs.readFile(file,(error,data) => { res.writeHead(error ? 404 : 200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'}); res.end(error ? 'Not found' : data); });
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
    const page = await browser.newPage({viewport:{width:1000,height:750},deviceScaleFactor:1});
    const errors=[],blockedExternalRequests=[];
    page.on('pageerror',error => errors.push(error.message));
    await page.route('**/*',route=>{const url=route.request().url();if(url.startsWith(base+'/')||url.startsWith('data:')||url.startsWith('blob:'))return route.continue();blockedExternalRequests.push(url);return route.abort('blockedbyclient');});
    await page.goto(base+modelRoute,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => !!document.querySelector('[data-edulo-id="gmz-ranger-v1"]')?.gmzViewer);
    // The widget keeps THREE lexical; its standalone scene runtime exposes the
    // same Three.js revision for ObjectLoader without replacing the live viewer.
    await page.addScriptTag({url:base+modelRoute+'model-runtime.js'});
    await page.addScriptTag({type:'importmap',content:JSON.stringify({imports:{three:'/Physik/Energie/dynamot-labor/dynamot-3d-vendor/three.module.js'}})});
    const exported = await page.evaluate(async () => {
      const viewer=document.querySelector('[data-edulo-id="gmz-ranger-v1"]').gmzViewer;
      viewer.setPhase('off',0); viewer.setExplosion(0); viewer.highlightPart(null); viewer.renderAt(0);
      viewer.model.userData.exportState={assembly:'assembled',mechanism:'off',highlight:null};
      const json=viewer.exportModel();
      function stats(object) {
        object.updateMatrixWorld(true);let meshes=0,lines=0;
        object.traverse(o=>{if(o.isMesh)meshes++;if(o.isLine)lines++;});
        const box=new window.THREE.Box3().setFromObject(object);
        return {meshes,lines,min:box.min.toArray(),max:box.max.toArray(),size:box.getSize(new window.THREE.Vector3()).toArray()};
      }
      const source=stats(viewer.model);
      const reloaded=await new Promise(resolve=>new window.THREE.ObjectLoader().parse(json,resolve));
      const jsonReload=stats(reloaded);
      const { GLTFExporter }=await import('./model-vendor/exporters/GLTFExporter.js');
      const { GLTFLoader }=await import('./model-vendor/loaders/GLTFLoader.js');
      const glbModel=viewer.model.clone(true);
      // glTF defines metres. Keep the source geometry in mm and apply conversion
      // at the root rather than baking a different topology or losing metadata.
      glbModel.scale.setScalar(.001);
      glbModel.userData={...glbModel.userData,units:'m',sourceGeometryUnits:'mm',nominalDimensionsMetres:[.068,.140,.033]};
      const glb=await new GLTFExporter().parseAsync(glbModel,{binary:true,onlyVisible:true,trs:false,maxTextureSize:1024});
      const loadedGlb=await new GLTFLoader().parseAsync(glb,location.href);
      const glbReload=stats(loadedGlb.scene);
      let binary='';const bytes=new Uint8Array(glb);
      for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));
      return {json,glbBase64:btoa(binary),source,jsonReload,glbReload,threeRevision:window.THREE.REVISION};
    });
    assert.deepEqual(errors,[],'Browser errors');
    assert.equal(exported.source.meshes,exported.jsonReload.meshes,'JSON mesh count');
    assert.equal(exported.source.meshes,exported.glbReload.meshes,'GLB mesh count');
    assert.equal(exported.source.lines,exported.jsonReload.lines,'JSON line count');
    assert.equal(exported.source.lines,exported.glbReload.lines,'GLB line count');
    const maxDifference=(a,b,scale=1)=>Math.max(...a.map((v,i)=>Math.abs(v*scale-b[i])));
    for(const key of ['min','max','size']) {
      assert.ok(maxDifference(exported.source[key],exported.jsonReload[key])<1e-6,'JSON bounds '+key+': '+JSON.stringify([exported.source[key],exported.jsonReload[key]]));
      assert.ok(maxDifference(exported.source[key],exported.glbReload[key],.001)<1e-5,'GLB bounds '+key);
    }
    const glb=Buffer.from(exported.glbBase64,'base64');
    assert.equal(glb.readUInt32LE(0),0x46546c67,'GLB magic');assert.equal(glb.readUInt32LE(4),2,'glTF 2.0');
    fs.writeFileSync(path.join(dir,'model.json'),JSON.stringify(exported.json));
    fs.writeFileSync(path.join(dir,'model.glb'),glb);
    const report={passed:true,threeRevision:exported.threeRevision,sourceUnits:'mm',glbUnits:'m',source:exported.source,jsonReload:exported.jsonReload,glbReload:exported.glbReload,browserErrors:errors,blockedExternalRequests,files:{jsonBytes:fs.statSync(path.join(dir,'model.json')).size,glbBytes:glb.length}};
    fs.writeFileSync(path.join(dir,'model-export-validation.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report));
  } finally { if(browser)await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
