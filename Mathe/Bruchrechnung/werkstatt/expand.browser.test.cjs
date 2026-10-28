// Local real-browser checks; no hooks are shipped in the generated widget.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const D=require('./domain.js'),key='schule-edulo:brueche-erweitern';
function html(){const source=fs.readFileSync(path.join(__dirname,'../erweitern/widget.html'),'utf8');assert(source.includes('stateVersion:2'),'Build expand v2 first');const i=source.lastIndexOf('start();');return source.slice(0,i)+`window.qa={get state(){return state},get scores(){return scores},D,render,freshActive,get ready(){return ready},seed(task){state.level=task.level;state.active=freshActive(task);render();}};\nstart();`+source.slice(i+8);}
const server=http.createServer((req,res)=>{try{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html());}catch(e){res.statusCode=500;res.end(String(e));}});
const encode=s=>'EDULO2:'+Buffer.from(JSON.stringify(s)).toString('base64');
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});const context=await browser.newContext({viewport:{width:920,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const ready=()=>page.waitForFunction(()=>window.qa?.ready),snap=()=>page.evaluate(()=>({state:qa.state,scores:qa.scores}));
 const task=D.tasks('expand',1).find(t=>t.n===1&&t.d===2)||D.tasks('expand',1)[0];
 async function seed(t=task){await page.evaluate(t=>qa.seed(t),t);}
 async function factor(n){await page.locator('[data-key=factor]').fill(String(n));await page.locator('[data-check]').click();}
 async function result(n){await page.locator('[data-key=n]').fill(String(n));assert.equal(await page.locator('[data-key=d]').count(),0,'target denominator is provided, not entered again');assert.equal(await page.locator('.fixed-denominator').textContent(),String(task.target));await page.locator('[data-check]').click();}
 async function layout(label){
  fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});
  for(const width of [390,920,1600]){
   await page.setViewportSize({width,height:900});
   const geometry=await page.evaluate(()=>{
    const eq=document.querySelector('.equals').getBoundingClientRect(),factor=document.querySelector('.expand-sign [data-key=factor],.expand-factor')?.getBoundingClientRect();
    const rules=[...document.querySelectorAll('.expand-equation .frac span+span,.expand-input-rule')].map(el=>{const r=el.getBoundingClientRect();return r.y+(el.classList.contains('expand-input-rule')?r.height/2:1);});
    const numbers=[...document.querySelectorAll('.expand-number')].map(el=>el.getBoundingClientRect()).filter(r=>r.height>0),models=[...document.querySelectorAll('.expand-diagram')].map(el=>el.getBoundingClientRect()).filter(r=>r.height>0);
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,eq:eq.y+eq.height/2,factorBottom:factor?.bottom,rules,numbers:numbers.map(r=>({center:r.x+r.width/2,bottom:r.bottom})),models:models.map(r=>({center:r.x+r.width/2,top:r.top}))};
   });
   assert(!geometry.overflow,`${label} overflow ${width}`);assert(geometry.factorBottom<geometry.eq,`factor must be above equals ${width}`);
   assert(geometry.rules.every(y=>Math.abs(y-geometry.eq)<=3),`fraction rule alignment ${label} ${width}: ${JSON.stringify(geometry)}`);
   geometry.models.forEach((m,i)=>{assert(Math.abs(m.center-geometry.numbers[i].center)<3,'picture centered under its fraction');assert(m.top>=geometry.numbers[i].bottom,'picture below its fraction');});
   if(width!==1600)await page.screenshot({path:path.join(__dirname,'qa',`erweitern-${label}-${width}.png`),fullPage:true});
  }
 }
 await page.goto(url);await ready();await seed();assert.equal(await page.locator('[data-choice]').count(),0);assert(await page.locator('[data-level]').isDisabled());await layout('faktor');
 assert.equal(await page.locator('[data-result-model]').count(),0);await factor(task.factor);assert.equal((await snap()).state.active.index,1);assert.equal(await page.locator('[data-result-model]').count(),0);
 await page.locator('[data-key=n]').fill(String(task.n*task.factor));assert.equal(await page.locator('[data-key=d]').count(),0);assert.equal(await page.locator('.fixed-denominator').textContent(),String(task.target));assert.equal(await page.locator('[data-result-model]').count(),0);
 await page.locator('[data-heading]').click();await page.waitForTimeout(650);await page.reload();await ready();assert.equal(await page.locator('[data-key=n]').inputValue(),String(task.n*task.factor));assert.equal(await page.locator('[data-result-model]').count(),0);
 await result(task.n*task.factor);assert.equal((await snap()).state.active.index,2);assert.equal((await snap()).state.history.length,1);assert.equal((await snap()).scores[0],'green');assert(await page.locator('[data-next]').isVisible());assert.equal(await page.locator('[data-choice]').count(),0);assert(await page.locator('[data-result-model]').isVisible());await layout('fertig');
 await page.reload();await ready();assert.equal((await snap()).state.history.length,1);assert.equal((await snap()).scores[0],'green');
 await seed();for(const n of ['', '1','0','1.5','-2','1e2','abc',String(task.factor+1)]){await factor(n);assert.equal((await snap()).state.active.index,0,'only exact factor accepted');}
 await factor(task.factor);await result(task.n*task.factor+1);assert.equal((await snap()).state.active.index,1);assert(await page.locator('[data-result-model]').isVisible());assert.match(await page.locator('[data-result-model] .fraction-model-image').getAttribute('aria-label'),new RegExp(`${task.n*task.factor} von ${task.target}`));assert(await page.locator('[data-key=n]').getAttribute('aria-invalid')==='true');await layout('fehler');
 await page.reload();await ready();assert(await page.locator('[data-result-model]').isVisible());await result(task.n*task.factor);assert.equal((await snap()).scores[1],'yellow');
 await seed();await factor(task.factor);await page.locator('[data-hint]').click();await result(task.n*task.factor);assert.equal((await snap()).scores[2],'yellow');
 // Old comparison stage disappears, while completed history, original inputs,
 // and point colors survive migration. Loading itself awards no new points.
 const fields=D.steps(task),drafts=fields.map(step=>Object.fromEntries(step.fields.map(f=>[f.key,String(f.value)])));
 const complete={task,index:3,drafts,attempts:drafts.map((answer,step)=>({step,answer,correct:true})),help:[],feedback:null};
 const old={widget:'brueche-erweitern',version:1,data:{level:task.level,active:{task,index:2,drafts:drafts.slice(0,2),attempts:complete.attempts.slice(0,2),help:[],feedback:null},history:[complete],intro:false},scores:['green',...Array(19).fill('gray')]};
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:encode(old)});await page.reload();await ready();assert.deepEqual((await snap()).scores,old.scores);assert.equal((await snap()).state.history.length,1);assert.equal((await snap()).state.active.index,1);assert.equal(await page.locator('[data-key=n]').inputValue(),drafts[1].n);await result(task.n*task.factor);assert.equal((await snap()).scores[1],'green');assert.equal((await snap()).state.history.length,2);assert.equal(await page.locator('[data-choice]').count(),0);
 await page.evaluate(key=>localStorage.setItem(key,'foreign broken data'),key);await page.reload();await page.waitForFunction(()=>document.querySelector('[data-retry]').hidden===false);assert(await page.locator('[data-controls]').evaluate(el=>el.disabled));assert(await page.locator('[data-check]').isDisabled());assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),'foreign broken data');
 assert.deepEqual(errors,[]);await context.close();console.log('Erweitern: exact factor/results, factor above equals, deferred visuals, green/yellow, saved drafts, v1 migration, corrupt state protection and 390/920/1600 layout passed. Local browser, no live Edulo test.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
