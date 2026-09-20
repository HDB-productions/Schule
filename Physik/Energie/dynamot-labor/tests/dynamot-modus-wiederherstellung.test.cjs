const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve(__dirname,'..'),Tasks=require('../dynamot-aufgaben.js');
const fixtures=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/dynamot-altstand-v2.json')));
const original=JSON.parse(Buffer.from(fixtures.cases.find(f=>f.name==='all-four-complete').raw.slice(9),'base64').toString());
const empty=()=>({next:1,devices:[],wires:[],simulationTime:0,electronFlow:false,energyPackets:false,buildLocked:false});
const broken=structuredClone(original);Object.assign(broken,empty(),{activeMode:'v1',labModes:Object.fromEntries(['v1','v4','v2','v3','free'].map(id=>[id,empty()]))});
broken.tasks['dynamot-learning-v2'].chosen='v1';
// Existing partially migrated modes used to bypass reconstruction entirely.
// Missing build records and old slot layouts must also reconstruct from the earned progress.
delete broken.tasks['dynamot-learning-v2'].builds.v2;
broken.tasks['dynamot-learning-v2'].builds.v3.devices.forEach(d=>delete d.slot);
const encode=s=>'DYNAMOT1:'+Buffer.from(JSON.stringify(s)).toString('base64');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');if(req.url.startsWith('/app'))return res.end(fs.readFileSync(path.join(dir,'dynamot-labor.html')));if(req.url.includes('hdb-youtube-avatar')){res.setHeader('Content-Type','image/jpeg');return res.end(fs.readFileSync(path.resolve(dir,'../../../assets/hdb-youtube-avatar.jpg')));}res.end(`<textarea id="e1_text_input">${encode(broken)}</textarea><div id="e2">${Array.from({length:20},(_,i)=>`<input id="e2_cloze_text_input_${i+1}" value="1">`).join('')}</div><iframe src="/app?edulo=1" style="width:920px;height:900px"></iframe>`);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1000,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}`);const frame=page.frames().find(f=>f.url().includes('/app'));
 const ready=async()=>{await frame.waitForFunction(()=>document.querySelector('#energyLab')?.energyLab?.getPersistenceStatus().ready);await frame.waitForSelector('.learn-picker');assert.equal(await frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getPersistenceStatus().blocked),false);};
 const snapshot=()=>frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getSnapshot());
 const state=()=>frame.evaluate(()=>document.querySelector('#energyLab').energyLab.getTaskState('dynamot-learning-v2'));
 await ready();
 for(const id of ['v1','v4','v2','v3']){await frame.locator('.learn-picker').selectOption(id);const s=await snapshot();assert(s.buildLocked,id+' locked despite existing empty mode');assert(Tasks.checkBuild(Tasks.fromLab(s),id),id+' correct reconstruction');assert.equal(await frame.locator('.learn-reference').count(),0);assert.equal(await frame.locator('[data-tool]:visible').count(),0);assert.equal(await frame.locator('[data-action=reset-build]').isVisible(),false);}
 assert.deepEqual((await state()).engine,original.tasks['dynamot-learning-v2'].engine,'restoration preserves all earned progress and answers');
 assert.equal(await frame.locator('.learn-score').innerText(),'20 von 20 Punkten');
 await frame.goto(frame.url());await ready();assert((await snapshot()).buildLocked,'locked after E1 roundtrip');
 await frame.locator('.learn-picker').selectOption('v2');const before=await state(),beforeLab=await snapshot();
 await frame.locator('.learn-restart summary').click();await frame.locator('[data-restart-experiment="v2"]').click();
 const after=await state(),lab=await snapshot();assert.equal(lab.activeMode,'v2');assert.equal(lab.buildLocked,false);assert.equal(lab.devices.length,0);assert.equal(lab.wires.length,0);assert.equal(await frame.locator('.learn-reference').count(),1);assert.equal(await frame.locator('#energyLab').getAttribute('data-learning-step'),'build');assert.equal(await frame.locator('.learn-score').innerText(),'15 von 20 Punkten');
 for(const id of ['v1','v4','v3']){for(const key of ['answers','diagrams','evidence'])for(const k of Object.keys(before.engine[key]))if(k===id||k.startsWith(id+'.'))assert.deepEqual(after.engine[key][k],before.engine[key][k]);assert.deepEqual(lab.labModes[id],beforeLab.labModes[id],id+' mode unaffected');}
 const fields=await page.locator('#e2 input').evaluateAll(xs=>xs.map(x=>x.value));assert.equal(fields.filter(v=>v==='1').length,15,'only selected five E2 points cleared');
 await frame.goto(frame.url());await ready();assert.equal((await snapshot()).buildLocked,false);assert.equal((await snapshot()).devices.length,0);assert.equal(await frame.locator('#energyLab').getAttribute('data-learning-step'),'build');
 await frame.locator('.learn-picker').selectOption('v1');assert((await snapshot()).buildLocked);await frame.locator('.learn-picker').selectOption('free');assert.equal((await snapshot()).buildLocked,false);
 assert.deepEqual(errors,[]);console.log('Partially migrated old modes, missing/old-slot records, locked restoration, single experiment reset, E1 roundtrip and E2 isolation passed.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

