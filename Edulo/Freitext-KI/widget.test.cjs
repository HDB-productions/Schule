// Real browser, mocked feedback endpoint. No OpenAI call or real Edulo account.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
test('Freitext: persistence, request contract, stale replies, failures, rendering and responsive layout',async()=>{
 let responseStatus=200,delay=0,requests=[];
 const feedback={summary:'<img src=x onerror="window.injected=1">',criteria:['gleichfoermig','zusammenhang','beispiel'].map(id=>({id,status:'partial',feedback:'Ergänze die Erklärung.'})),nextSteps:['Beschreibe die Geschwindigkeit.']};
 const server=http.createServer(async(req,res)=>{
  if(req.url==='/feedback'){
   let body='';for await(const chunk of req)body+=chunk;
   requests.push({auth:req.headers.authorization,body:JSON.parse(body)});
   const status=responseStatus,wait=delay;
   if(wait)await new Promise(r=>setTimeout(r,wait));
   res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(status===200?{taskId:'bewegung-gleichfoermig-v1',taskVersion:'1',feedback}:{error:{code:'TEST',message:'not shown'}}));return;
  }
  const base='http://127.0.0.1:'+server.address().port;
  const html=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8').replace("const API_BASE = '';",'const API_BASE = '+JSON.stringify(base)+';');
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});res.end(html);
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port;await page.goto(base);
  await page.locator('[data-controls]:not([disabled])').waitFor();
  await page.locator('[data-answer]').fill('Die Geschwindigkeit bleibt gleich.');
  await page.reload();await page.locator('[data-controls]:not([disabled])').waitFor();
  assert.equal(await page.locator('[data-answer]').inputValue(),'Die Geschwindigkeit bleibt gleich.');
  await page.locator('[data-check]').click();assert.equal(requests.length,0);
  await page.locator('[data-code]').fill('test-classroom-code');await page.locator('[data-check]').click();
  await page.locator('[data-result]:not([hidden])').waitFor();
  assert.equal(requests.length,1);assert.equal(requests[0].auth,'Bearer test-classroom-code');
  assert(requests[0].body.task.referenceAnswer.includes('Geschwindigkeit'));
  assert.equal(requests[0].body.task.criteria.length,3);assert.equal(requests[0].body.answer,'Die Geschwindigkeit bleibt gleich.');
  assert.equal(await page.locator('[data-summary] img').count(),0);assert.equal(await page.evaluate(()=>window.injected),undefined);
  await page.reload();await page.locator('[data-controls]:not([disabled])').waitFor();
  assert.equal(await page.locator('[data-code]').inputValue(),'');assert(await page.locator('[data-result]').isVisible());
  assert(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('test-classroom-code'));
  await page.locator('[data-answer]').fill('Eine geänderte Antwort.');assert(await page.locator('[data-stale]').isVisible());
  await page.locator('[data-code]').fill('test-classroom-code');responseStatus=429;
  await page.locator('[data-check]').click();await page.getByText('Zu viele Anfragen. Bitte warte kurz und versuche es erneut.',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-answer]').inputValue(),'Eine geänderte Antwort.');assert(await page.locator('[data-stale]').isVisible());
  responseStatus=200;delay=350;await page.locator('[data-check]').click();
  await page.locator('[data-answer]').fill('Noch einmal geändert.');
  await page.getByText('Du hast deine Antwort inzwischen geändert. Fordere bitte neues Feedback an.',{exact:true}).waitFor();
  assert(await page.locator('[data-stale]').isVisible());
  delay=0;feedback.summary='Du hast die gleichbleibende Geschwindigkeit erkannt. Ergänze noch den Zusammenhang und ein konkretes Beispiel.';
  feedback.criteria[0].status='met';feedback.criteria[0].feedback='Richtig: Die Geschwindigkeit bleibt konstant.';
  feedback.nextSteps=['Erkläre, welche Strecken in gleichen Zeitabschnitten zurückgelegt werden, und ergänze ein konkretes Beispiel.'];
  await page.locator('[data-answer]').fill('Bei einer gleichförmigen Bewegung bleibt die Geschwindigkeit immer gleich.');
  await page.locator('[data-check]').click();await page.getByText(feedback.summary,{exact:true}).waitFor();
  for(const width of [390,920,1440]){
   await page.setViewportSize({width,height:900});
   const sizes=await page.evaluate(()=>({screen:innerWidth,scroll:document.documentElement.scrollWidth,root:document.querySelector('main').getBoundingClientRect().width}));
   assert(sizes.scroll<=sizes.screen,'horizontal overflow at '+width);assert(sizes.root>=width-20,'artificial width restriction');
   await page.screenshot({path:path.join(__dirname,'preview-'+width+'.png'),fullPage:true});
  }
  assert.deepEqual(errors,[]);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
});
