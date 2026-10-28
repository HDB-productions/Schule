// Real browser, locally served test copy. No test hooks are written to widget.html.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const D=require('./domain.js');
const hook=`window.qa={get state(){return state},get scores(){return scores},D,R,render,freshActive,selectTask,get ready(){return ready},seed(task){state.level=task.level;state.active=freshActive(task);render();}};\nstart();`;
function html(){const source=fs.readFileSync(path.join(__dirname,'../kuerzen/widget.html'),'utf8');assert(source.includes('ReduceDomain'),'Build new reduce widget first');const i=source.lastIndexOf('start();');assert(i>0);return source.slice(0,i)+hook+source.slice(i+8);}
const server=http.createServer((req,res)=>{try{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html());}catch(e){res.statusCode=500;res.end(String(e));}});
const encode=s=>'EDULO2:'+Buffer.from(JSON.stringify(s)).toString('base64');
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});const context=await browser.newContext({viewport:{width:920,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const ready=()=>page.waitForFunction(()=>window.qa?.ready);
 const phase=()=>page.evaluate(()=>qa.state.active.phase);
 const snap=()=>page.evaluate(()=>({state:qa.state,scores:qa.scores}));
 async function aligned(){const deltas=await page.locator('.reduce-round').evaluateAll(rounds=>rounds.filter(el=>!el.closest('details:not([open])')&&el.getBoundingClientRect().height>0).flatMap(el=>{const a=el.querySelector('.equals').getBoundingClientRect();return [...el.querySelectorAll('.frac span+span,.reduce-input-rule')].filter(rule=>rule.getBoundingClientRect().height>0).map(rule=>{const b=rule.getBoundingClientRect();return a.y+a.height/2-(b.y+(rule.matches('.reduce-input-rule')?b.height/2:1));});}));assert(deltas.every(d=>Math.abs(d)<=3),`Equals must align with both fraction bars: ${deltas.join(', ')}px`);}
 async function seed(n,d){const task=[1,2].flatMap(l=>D.tasks('reduce',l)).find(t=>t.n===n&&t.d===d);assert(task,`Missing ${n}/${d} pool task`);await page.evaluate(task=>qa.seed(task),task);}
 async function factor(v){assert.equal(await phase(),'factor');await page.locator('[data-key=factor]').fill(String(v));await page.locator('[data-check]').click();}
 async function result(n,d){assert.equal(await phase(),'result');await page.locator('[data-key=n]').fill(String(n));await page.locator('[data-key=d]').fill(String(d));await page.locator('[data-check]').click();}
 async function again(v,keyboard=false){assert.equal(await phase(),'again');const button=page.locator(`[data-again=${v}]`);if(keyboard){await button.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Enter');}else await button.click();}
 await page.goto(url);await ready();await seed(12,24);assert(await page.locator('[data-level]').isDisabled());
 const selected=await page.evaluate(()=>{const history=[];for(let i=0;i<20;i++)history.push({task:qa.selectTask(1,history)});return history.map(h=>h.task.factor);});
 assert(selected.filter((factor,index)=>index%5!==4).every(factor=>[4,6,8,9,10,12].includes(factor)),'four of five tasks prioritize composite reduction factors');
 assert([4,6,8,9,10,12].every(factor=>selected.includes(factor)),'all requested composite factors occur regularly');
 assert(!(await page.locator('[data-result-model]').isVisible()));await factor(2);assert.equal(await phase(),'result');assert(!(await page.locator('[data-result-model]').isVisible()));
 await page.locator('[data-key=n]').fill('6');await page.locator('[data-key=d]').fill('12');await page.locator('[data-heading]').click();await page.waitForTimeout(650);await page.reload();await ready();assert.equal(await phase(),'result');assert.equal(await page.locator('[data-key=n]').inputValue(),'6');assert.equal(await page.locator('[data-key=d]').inputValue(),'12');assert(!(await page.locator('[data-result-model]').isVisible()));
 await result(6,12);assert(await page.locator('[data-result-model]').isVisible());assert.equal((await snap()).scores.filter(s=>s!=='gray').length,0);await again('yes',true);await factor(3);await result(2,4);await again('yes');await factor(2);await result(1,2);await again('no',true);assert.equal(await phase(),'done');assert.equal((await snap()).scores[0],'green');assert.equal((await snap()).state.active.rounds.length,3);assert(!(await page.locator('[data-level]').isDisabled()));
 fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});for(const width of [390,920,1600]){await page.setViewportSize({width,height:900});await aligned();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`completion overflow ${width}`);if(width!==1600)await page.screenshot({path:path.join(__dirname,'qa',`kuerzen-mehrstufig-${width}.png`),fullPage:true});}
 await page.reload();await ready();assert.equal((await snap()).state.history.length,1);assert.equal((await snap()).scores[0],'green');assert.equal(await phase(),'done');
 await seed(4,14);await factor(2);await result(1,4);assert.equal(await phase(),'result');assert(await page.locator('[data-result-model]').isVisible());assert.match(await page.locator('[data-result-model] .fraction-model-image').getAttribute('aria-label'),/2 von 7/);assert.equal((await snap()).scores.filter(s=>s!=='gray').length,1);
 for(const width of [390,920,1600]){await page.setViewportSize({width,height:900});await aligned();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`wrong-result overflow ${width}`);if(width!==1600)await page.screenshot({path:path.join(__dirname,'qa',`kuerzen-fehler-${width}.png`),fullPage:true});}
 await result(2,7);await again('yes');assert.equal(await phase(),'again');await again('no');assert.equal((await snap()).scores[1],'yellow');
 await seed(4,14);for(const invalid of ['','1','0','1.5','-2','1e2','abc']){await factor(invalid);assert.equal(await phase(),'factor');}await page.locator('[data-hint]').click();await factor(2);await result(2,7);await again('no');assert.equal((await snap()).scores[2],'yellow');
 // A new larger example supports a composite first divisor and another round.
 await seed(84,96);await factor(4);await result(21,24);assert.equal(await phase(),'again');
 for(const width of [390,920]){await page.setViewportSize({width,height:900});await aligned();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(__dirname,'qa',`kuerzen-grosse-zahlen-${width}.png`),fullPage:true});}
 await again('yes');await factor(3);await result(7,8);await again('no');assert.equal((await snap()).scores[3],'green');
 // Migrate a real v1 snapshot with a completed task and a partially entered next task.
 const oldTask=D.tasks('reduce',1)[0],steps=D.steps(oldTask),drafts=steps.map(step=>Object.fromEntries(step.fields.map(f=>[f.key,String(f.value)])));
 const completed={task:oldTask,index:3,drafts,attempts:drafts.map((answer,step)=>({step,answer,correct:true})),help:[],feedback:null};
 const old={widget:'brueche-kuerzen',version:1,data:{level:1,active:{task:oldTask,index:1,drafts:[drafts[0],{n:'9',d:'11'}],attempts:[{step:0,answer:drafts[0],correct:true}],help:[],feedback:null},history:[completed],intro:false},scores:['green','yellow',...Array(18).fill('gray')]};
 await page.evaluate(raw=>localStorage.setItem('schule-edulo:brueche-kuerzen',raw),encode(old));await page.reload();await ready();assert.equal(await phase(),'result');assert.equal(await page.locator('[data-key=n]').inputValue(),'9');assert.deepEqual((await snap()).scores,old.scores);assert.equal((await snap()).state.history.length,1);
 await page.locator('[data-key=n]').fill('13');await page.locator('[data-heading]').click();await page.waitForTimeout(650);await page.reload();await ready();assert.equal(await page.locator('[data-key=n]').inputValue(),'13');assert.deepEqual((await snap()).scores,old.scores);assert.equal(await page.evaluate(()=>JSON.parse(atob(localStorage.getItem('schule-edulo:brueche-kuerzen').slice(7))).version),2);
 assert.deepEqual(errors,[]);console.log('Kürzen: iterative factors, visual preview, keyboard choices, green/yellow, draft and migration reloads, history and responsive screenshots passed. Local standalone browser test; no live Edulo verification.');await context.close();
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
