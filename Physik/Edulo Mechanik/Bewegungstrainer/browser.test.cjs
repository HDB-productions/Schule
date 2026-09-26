const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const Motion=require('./domain.js'),key='schule-edulo:bewegungstrainer';
const pack=s=>'EDULO2:'+Buffer.from(JSON.stringify({widget:'bewegungstrainer',version:1,data:s,scores:Motion.scoreColors(s)})).toString('base64');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync(path.join(__dirname,'widget.html')));});
function makeState(index=0){const s=Motion.fresh();s.index=index;s.task=Motion.generate(index,()=>0.3);const cells=Motion.preparation(s.task).cells;s.prep.inputs=cells.map(()=>'');s.prep.cursors=cells.map(()=>0);return s;}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:920,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForSelector('[data-controls]:enabled');
 async function seed(s){await page.waitForTimeout(400);await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:pack(s)});await page.reload();await page.waitForSelector('[data-controls]:enabled');}
 async function press(k){await page.locator('[data-keypad]').getByRole('button',{name:k,exact:true}).click();}
 async function enter(t){const tokens=t.replace(/\s/g,'').match(/km\/h|km|min|[0-9ht,.:+−·/()]/g)||[];assert.equal(tokens.join(''),t.replace(/\s/g,''),'unavailable key in '+t);for(const token of tokens)await press(token);}
 async function prep(s){const cells=Motion.preparation(s.task).cells;for(let i=0;i<cells.length;i++){await page.locator(`[data-cell="${i}"]`).click();const c=cells[i];await enter(c.unit==='clock'?c.expected:String(c.expected).replace('.',',')+c.unit);}await page.locator('[data-check]').click();assert.match(await page.locator('[data-step-title]').textContent(),new RegExp('1\\. '+['Geschwindigkeit','Anfangsposition','Bewegungsformel'][Motion.requiredSteps(s.task)[0]]));}
 async function stored(){return page.evaluate(key=>{const raw=localStorage.getItem(key);return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw.slice(7)),c=>c.charCodeAt(0)))).data;},key);}
 assert.equal(await page.locator('input,textarea,[contenteditable="true"]').count(),0);
 assert.equal(await page.locator('h1,header,.eyebrow .heading').count(),0);
 assert(await page.locator('.score-panel').evaluate(e=>!!(document.querySelector('.exercise').compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING)));
 // Draft editing and recovery in preparation, including automatic hint.
 const s=makeState();await seed(s);await enter('12');await press('Cursor nach links');await press('Zeichen links vom Cursor löschen');await press('3');
 assert.equal(await page.locator('[data-answer]').textContent(),'3│2');await page.waitForTimeout(450);await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-answer]').textContent(),'3│2');
 await page.locator('[data-check]').click();assert.equal(await page.locator('[data-hints] > p').count(),1);await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-hints] > p').count(),1);assert.equal((await stored()).prep.errors,1);
 // Every task type has an operable preparation, including paired measurements and clocks.
 for(let i=0;i<6;i++){const x=makeState(i);await seed(x);if(i===1){assert.match(await page.locator('[data-prep-fields]').textContent(),/Zeit t.*Position s/);}await prep(x);assert.equal((await stored()).prep.done,true);}
 // Four correct steps leave the previous results above the next question.
 await seed(s);await prep(s);
 for(const i of Motion.requiredSteps(s.task)){
   assert.equal(await page.locator('[data-prefix]').textContent(),i===0?'v =':i===1?'s₀ =':i===2?'s(t) =':`s(${String(s.task.targetT*60).replace('.',',')} min) =`);
   if(i===2){assert.equal(await page.locator('[data-keypad]').getByRole('button',{name:'s',exact:true}).count(),0);assert.equal(await page.locator('[data-keypad]').getByRole('button',{name:'=',exact:true}).count(),0);assert.equal(await page.locator('[data-keypad]').getByRole('button',{name:'km/h',exact:true}).count(),1);}
   await enter(i===0?String(s.task.v*s.task.data.elapsed).replace('.',',')+'km/'+String(s.task.data.elapsed).replace('.',',')+'h':Motion.canonicalAnswer(s.task,i));await page.locator('[data-check]').click();assert.equal(await page.locator('[data-results] .result-row').count(),Motion.requiredSteps(s.task).indexOf(i)+1);assert.equal(await page.locator('[data-hints] > p').count(),0);
   if(i===0)assert.equal(await page.locator('[data-results] .result-value').first().textContent(),`v = ${String(s.task.v*s.task.data.elapsed).replace('.',',')} km/${String(s.task.data.elapsed).replace('.',',')} h = ${Motion.canonicalAnswer(s.task,0)}`);
   if(i===2){await page.setViewportSize({width:920,height:768});await page.locator('[data-results]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-results-920.png')});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'preview-results-390.png')});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:920,height:768});}
 }
 assert.match(await page.locator('[data-progress]').textContent(),/3\/20 Punkte · 3 selbstständig/);assert.equal(await page.locator('[data-keypad]').isVisible(),false);
 await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-results] .result-row').count(),3);await page.locator('[data-next]').click();assert.match(await page.locator('[data-number]').textContent(),/2/);assert.match(await page.locator('[data-step-title]').textContent(),/^0\./);
 await page.screenshot({path:path.join(__dirname,'preview-920.png')});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'preview-390.png')});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('[data-check]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-390-eingabe.png')});
 assert(await page.locator('[data-keypad] button').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=44)));await page.setViewportSize({width:920,height:768});
 // Preparation cell selection survives reload; automatic preparation reveal unlocks the task.
 await seed(s);await page.locator('[data-cell="1"]').click();await enter('12');await page.waitForTimeout(450);await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-cell="1"]').getAttribute('aria-pressed'),'true');
 for(let j=0;j<4;j++)await page.locator('[data-check]').click();assert.equal(await page.locator('[data-preparation] .revealed').count(),1);assert.match(await page.locator('[data-progress]').textContent(),/0\/20/);assert.match(await page.locator('[data-step-title]').textContent(),/^1\./);
 // Revealed solution is automatically inserted, red, unscored, persisted, and unlocks next step.
 await seed(s);await prep(s);for(let j=0;j<4;j++)await page.locator('[data-check]').click();
 assert.equal(await page.locator('[data-results] .revealed').count(),1);assert.match(await page.locator('[data-results]').textContent(),/Lösung vorgegeben · kein Punkt/);assert.match(await page.locator('[data-results]').textContent(),new RegExp(String(s.task.v)+' km/h'));assert.match(await page.locator('[data-step-title]').textContent(),/^2\./);assert.match(await page.locator('[data-progress]').textContent(),/0\/20/);
 await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-results] .revealed').count(),1);let saved=await stored();assert.equal(saved.steps[0].revealed,true);assert.equal(saved.steps[0].solved,false);

 // Formula tips stop at individual quantities; the next wrong check inserts the dimensional answer.
 assert.equal(await page.locator('[data-prefix]').textContent(),'s(t) =');for(let j=0;j<3;j++)await page.locator('[data-help]').click();let hintText=await page.locator('[data-hints]').textContent();assert.match(hintText,/s\(t\).*v.*t.*s₀/);assert(!hintText.includes(Motion.canonicalAnswer(s.task,2)));
 await page.locator('[data-check]').click();assert.equal(await page.locator('[data-results] .revealed').count(),2);assert.match(await page.locator('[data-results]').textContent(),/km\/h.*t/);assert.match(await page.locator('[data-progress]').textContent(),/0\/20/);
 await enter(Motion.canonicalAnswer(s.task,3));await page.locator('[data-check]').click();assert.match(await page.locator('[data-progress]').textContent(),/1\/20 Punkte · 0 selbstständig/);
 await page.locator('[data-results]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-revealed.png')});
 // Legacy stand keeps completed work, points, draft, hints, and cursor.
 const legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'legacy.fixture.json'),'utf8'));await seed(legacy);assert.equal(await page.locator('[data-prefix]').textContent(),'s(t) =');assert.equal(await page.locator('[data-results] .result-row').count(),2);assert.match(await page.locator('[data-progress]').textContent(),/2\/20/);assert.equal((await page.locator('[data-answer]').textContent()).replace('│',''),legacy.steps[2].input);assert.equal(await page.locator('[data-hints] > p').count(),1);
 assert.equal((await stored()).schema,undefined,'load must not rewrite original saved data');
 await press('Cursor nach rechts');await page.waitForTimeout(400);assert.equal((await stored()).schema,3);
 // Progressive diagrams explain observed differences; no final speed is given.
 const tableState=makeState(1);await seed(tableState);await prep(tableState);
 for(let h=1;h<=3;h++){await page.locator('[data-help]').click();assert.equal(await page.locator('.teaching-visual.changes').count(),1);assert.equal(await page.locator('.change-row').count(),2);if(h===3)assert.match(await page.locator('.visual-note').textContent(),/= \? km\/h/);}
 await page.locator('.teaching-visual').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-hints-920.png')});await page.setViewportSize({width:390,height:844});await page.locator('.teaching-visual').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-hints-390.png')});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS: six preparations, physical-unit formula keypad, fixed prefixes, type-specific results and speed arithmetic, hints/reveal without point, dependent yellow credit, restoration/migration, 920/390 layouts, no editable inputs or JS errors.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
