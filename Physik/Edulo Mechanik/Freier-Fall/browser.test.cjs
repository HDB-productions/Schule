const fs=require('fs'),path=require('path'),os=require('os'),http=require('http'),assert=require('assert/strict');
const {chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const fixture=require('./test-fixture.cjs');let base,browser,saved,unknown=false;const requests=[];
const budget={remainingEuroMicros:1000000,weeklyRemainingEuroMicros:1000000,reservedEuroMicros:0};
const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8');
const server=http.createServer(async(req,res)=>{
 if(req.method==='GET'){
  if(['/fallvideo.mov','/stroboskop-original.jpg'].includes(req.url)){res.setHeader('Content-Type',req.url.endsWith('.mov')?'video/quicktime':'image/jpeg');res.end(fs.readFileSync(path.join(__dirname,req.url.slice(1))));return;}
  res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fixture(html,base));return;
 }
 let text='';for await(const chunk of req)text+=chunk;const b=JSON.parse(text);requests.push({path:req.url,body:b});res.setHeader('Content-Type','application/json');
 if(req.url==='/quota'){res.end(JSON.stringify({budget}));return;}
 if(req.url==='/result'){res.end(JSON.stringify(saved));return;}
 saved={taskId:b.task.id,taskVersion:b.task.version,requestId:b.requestId,feedbackStyle:'questions-v4',budget,feedback:{summary:'',languageFeedback:'',misconceptions:[],nextSteps:[],taskFeedback:b.task.feedbackGroups.map(g=>({id:g.id,feedback:'Prüfe deinen Rechenweg. <img src=x onerror=alert(1)>'})),criteria:b.task.criteria.map(c=>({id:c.id,status:'met',feedback:''}))}};
 if(unknown){res.statusCode=202;res.end(JSON.stringify({charge:{status:'reserved'},budget}));return;}res.end(JSON.stringify(saved));
});
(async()=>{try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForFunction(()=>!document.querySelector('[data-controls]').disabled);
 assert.equal(await page.locator('.fall-table input').count(),22);
 assert.equal(await page.locator('.fall-table input').evaluateAll(a=>a.filter(x=>x.value).length),0);
 assert.equal(await page.locator('[data-fall-image]').evaluate(i=>i.complete&&i.naturalWidth>0),true);
 await page.waitForFunction(()=>document.querySelector('video').videoWidth>0);
 await page.locator('video').evaluate(v=>v.play());await page.waitForFunction(()=>document.querySelector('video').currentTime>0);await page.locator('video').evaluate(v=>v.pause());
 const fillColumn=async(key,values)=>{for(let i=0;i<values.length;i++)await page.locator('[data-fall-cell='+key+'][data-row="'+i+'"]').fill(values[i]);};
 await page.locator('[data-answer=zeit]').fill('1s / 100 = 0,01 s.');
 await fillColumn('hoehen_m',['1,40','1,38','1,31','1,20','1,04','0,83','0,59','0,30']);
 await fillColumn('strecken_m',['0,02','0,07','0,11','0,16','0,21','0,24','0,29']);
 await fillColumn('geschwindigkeiten_ms',['0,4','1,4','2,2','3,2','4,2','4,8','5,8']);
 await page.locator('.fall-explanation-label textarea').first().fill('Fünf Intervalle je Zeile. Die Höhe nimmt zunehmend schneller ab.');
 await page.locator('.fall-explanation-label textarea').last().fill('Zum Beispiel 0,16m durch 0,05s ergibt 3,2m/s im Mittel.');
 await page.locator('[data-answer=deutung]').fill('Größere Abstände in gleicher Zeit bedeuten zunehmende Geschwindigkeit. Die Bildrate ist unsicher.');
 assert.equal(await page.locator('.fall-measurement-point').count(),8);
 for(const width of [390,920,1440]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(__dirname,'preview-'+width+'.png'),fullPage:true});}
 const snapshot=()=>page.evaluate(()=>fixtureState());
 await page.locator('[data-check]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status==='done');
 assert.equal(requests.filter(r=>r.path==='/feedback').length,1);assert(await page.locator('[data-check]').isDisabled());
 assert.equal(await page.locator('.question img').count(),0);assert.equal((await snapshot()).scores.length,13);
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-fall-cell=hoehen_m]')?.value==='1,40');assert.equal(await page.locator('.fall-measurement-point').count(),8);
 await page.locator('[data-fall-cell=hoehen_m][data-row="1"]').fill('1,37');
 unknown=true;await page.locator('[data-check]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status==='unknown');
 assert.deepEqual(requests.filter(r=>r.path==='/feedback').at(-1).body.task.feedbackGroups.map(g=>g.id),['messung','geschwindigkeit']);
 const calls=requests.filter(r=>r.path==='/feedback').length;
 await page.locator('[data-recover]').click();await page.waitForFunction(()=>fixtureState()?.data.history.at(-1)?.status==='done');assert.equal(requests.filter(r=>r.path==='/feedback').length,calls);
 assert.equal((await snapshot()).data.history.at(-1).answers.zeit,'1s / 100 = 0,01 s.');assert.deepEqual(errors,[]);
 await page.goto(base+'?identity=remote');await page.waitForFunction(()=>document.querySelectorAll('.fall-table input').length===22);assert(await page.locator('[data-controls]').evaluate(el=>el.disabled));assert(await page.locator('.fall-table input').first().isDisabled());
 console.log('PASS: tables, graph, media, 390/920/1440 layout, E1/E2, reload, partial requests, recovery, safe feedback');
 }finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
