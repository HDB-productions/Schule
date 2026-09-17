const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const file=path.join(__dirname,'Äquivalenzumformungen üben - Version 2.html'),raw=fs.readFileSync(file,'utf8');
const hook="Object.assign(window,{test:{creditMode,scoreCounts,scorePoints,assessment,credited,parse,analyze,equation,operate,goal,et,encode,decode,fresh,makeTask,applyAnswer,issues,instruction,thresholds,get state(){return state},set state(s){state=s},render,save,newTask}});";
const html=process.argv.includes('--preview')?raw:raw.replace('connect();\n})();',hook+'connect();\n})();');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/danie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const KEY='mathe-aequivalenz-v2';let seedHost='';
const fields=()=>`<div id="e1"><textarea id="e1_text_input">${seedHost}</textarea></div><div id="e2">${Array.from({length:20},(_,i)=>`<input id="e2_cloze_text_input_${i+1}">`).join('')}</div>`;
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url.startsWith('/host')?fields()+'<script>window.changes=0;document.addEventListener("change",()=>changes++);</script><iframe src="/app?edulo=1" style="width:100%;height:1000px"></iframe>':req.url.startsWith('/inline')?html.replace('<body>','<body>'+fields()+'<script>window.widget={isEditor:'+req.url.includes('editor')+'}</script>'):html);});
let browser;
if(process.argv.includes('--preview'))server.listen(8769,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8769'));else (async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 console.log('Launching Edge');browser=await chromium.launch({headless:true,channel:'msedge',timeout:20000,args:['--no-proxy-server']});
 const page=await browser.newPage({viewport:{width:1000,height:1100}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message)});page.on('console',m=>console.log('BROWSER',m.text()));page.on('requestfailed',r=>console.log('REQUEST FAILED',r.url(),r.failure()));page.setDefaultTimeout(10000);
 await page.goto(base,{waitUntil:"domcontentloaded"});await page.locator('#exercise').waitFor();console.log('Loaded widget');
 const seed=async(e)=>page.evaluate(e=>{test.state={...test.fresh(),tasks:[test.makeTask(e)]};test.render();test.save();},e);
 const answer=async(s,p=page)=>{await p.locator('#answer').fill(s);await p.locator('#answerForm button').click();};
 const state=()=>page.evaluate(()=>test.state);
 const setHints=async(value)=>{if((await page.locator('#transformationHints').getAttribute('aria-checked')==='true')!==value)await page.locator('#transformationHints').click();};
 await page.evaluate(()=>{
  const t=test,yes=(v,m)=>{if(!v)throw Error(m)},bad=f=>{let fail=false;try{f()}catch{fail=true}yes(fail,'Expected rejection')};
  for(const s of ['6x-9','-9+6x','((6x-9))','6*x-9'])yes(t.analyze(s).issue===null,'Already simplified '+s);
  for(const s of ['9x-3x-9','9x-9-3x'])yes(t.analyze(s).issue==='x','Collect '+s);
  yes(t.analyze('5-15').issue==='numbers','Numbers');yes(t.analyze('3(2x-3)').issue==='brackets','Expand');yes(t.analyze('12/(-3)').issue==='calculate','Division');yes(t.analyze('-(x+2)').issue==='minusBracket','Minus bracket');yes(t.analyze('(x+2)/3').issue==='divideBracket','Divide bracket');yes(t.analyze('x/2').issue===null,'Reduced variable fraction');
  for(const s of ['x/0','x*x','x/(x+1)','(x+2','alert(1)','2**3'])bad(()=>t.parse(s));
  for(const s of ['-3x','-(3x)','+(-3x)','-(6x/2)'])yes(t.et(t.operate(t.equation('9x-9=5-15+3x'),s))==='6x − 9 = -10',s);
  for(const s of ['-9x','+9',':3'])bad(()=>t.operate(t.equation('9x-9=5-15+3x'),s));
  for(const s of [':6',':(6)',':((6))','*(1/6)','·(1/6)'])yes(t.et(t.operate(t.equation('6x=12'),s))==='x = 2',s);
  for(const s of ['*(-1)',':(-1)','÷(-1)'])yes(t.et(t.operate(t.equation('-x=4'),s))==='x = -4',s);
  for(const s of ['*0,5',':2','×0.5'])yes(t.et(t.operate(t.equation('2x=4'),s))==='x = 2',s);
  for(const s of [':0','*(0)',':(1-1)','*x'])bad(()=>t.operate(t.equation('2x=4'),s));
 });console.log('PASS algebra and structure');

 // Settings are presentation-only: neutral prompts, persisted draft, same mathematical gates.
 await seed('9x-9=5-15+3x');assert.match(await page.locator('#answer').getAttribute('placeholder'),/Bringe die x-Terme/);
 await page.locator('#settingsButton').click();assert.equal(await page.locator('#settingsButton').getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#transformationHints').getAttribute('aria-checked'),'true');
 await page.locator('#answer').fill('-(3x)');await setHints(false);assert.equal(await page.locator('#answer').inputValue(),'-(3x)');assert.equal(await page.locator('#answer').getAttribute('placeholder'),'Operation auf beiden Seiten');assert.equal(await page.locator('#answer').getAttribute('aria-label'),'Operation auf beiden Seiten');assert.equal(await page.locator('#strategyHelp').isVisible(),false);
 await page.reload();await page.locator('#answer').waitFor();assert.equal(await page.locator('#answer').inputValue(),'-(3x)');assert.equal(await page.locator('#answer').getAttribute('placeholder'),'Operation auf beiden Seiten');await answer('*0');assert.doesNotMatch(await page.locator('#feedback').innerText(),/Entferne|rechte Seite|x-Terme/);assert.equal((await state()).tasks[0].pending,null);
 for(const v of ['-3x','9x-9-3x','5-15'])await answer(v);assert.equal(await page.locator('#answer').getAttribute('placeholder'),'Linke Gleichungsseite');assert.equal((await state()).tasks[0].pending.operation,null);
 await page.locator('#settingsButton').click();await setHints(true);assert.match(await page.locator('#answer').getAttribute('placeholder'),/Fasse die x-Terme/);await page.locator('#settingsButton').click();assert.equal(await page.locator('#settingsPanel').isVisible(),false);
 // Existing schema-3 saves without settings keep tips enabled.
 await page.evaluate(()=>{const old=structuredClone(test.state);delete old.settings;if(test.decode(test.encode(old)).settings.transformationHints!==true)throw Error('Legacy default');});

 // Free operations: alternate direction, non-shortening steps, zero rejection and right-side solution.
 await seed('2x+3=5x+15');await page.locator('#settingsButton').click();await setHints(false);
 for(const v of ['+1','2x+4','5x+16','-2x','4','3x+16'])await answer(v);
 assert.equal((await state()).tasks[0].clean,true);await page.reload();await page.locator('#answer').waitFor();assert.equal((await state()).tasks[0].lines.length,3);
 for(const v of ['-16','-12','3x',':3','-4','x'])await answer(v);assert.equal((await state()).tasks[0].done,true);assert.equal((await state()).tasks[0].clean,true);assert.equal(await page.locator('#work tr').last().locator('[data-column=pipe]').innerText(),'');
 await page.reload();await page.locator('#next').waitFor();assert.equal((await state()).tasks[0].done,true);
 await page.evaluate(()=>{for(const op of ['+0','*1',':1','+x+2','*(-2)',':0,5'])test.operate(test.equation('2x+3=5x+15'),op,false);for(const op of ['*0',':0','*x',':x']){let rejected=false;try{test.operate(test.equation('2x+3=5x+15'),op,false)}catch{rejected=true}if(!rejected)throw Error('Invalid free '+op);}});
 // Switching during an accepted free operation does not change its expected side values.
 await seed('2x+3=5x+15');await page.locator('#settingsButton').click();await setHints(false);await answer('+1');await setHints(true);await page.reload();await page.locator('#answer').waitFor();await answer('2x+4');await answer('5x+16');assert.equal((await state()).tasks[0].pending,null);assert.match(await page.locator('#answer').getAttribute('placeholder'),/Bringe die x-Terme/);

 // Host checkbox decorations must not create a second control; native button supports keyboard.
 await page.locator('#settingsButton').click();await page.addStyleTag({content:'input[type=checkbox] + span::before {content:"";display:block;width:24px;height:24px;background:teal;position:absolute;}'});assert.equal(await page.locator('#settingsPanel input[type=checkbox]').count(),0);assert.equal(await page.locator('#transformationHints').evaluate(e=>e.tagName),'BUTTON');await page.locator('#transformationHints').focus();const switchBefore=await page.locator('#transformationHints').getAttribute('aria-checked');await page.locator('#transformationHints').press('Space');assert.notEqual(await page.locator('#transformationHints').getAttribute('aria-checked'),switchBefore);await page.locator('#transformationHints').press('Enter');assert.equal(await page.locator('#transformationHints').getAttribute('aria-checked'),switchBefore);await page.locator('#settingsButton').click();
 console.log('PASS settings toggle, neutral hints/errors, unchanged gating, draft/reload, legacy defaults');
 // Preserve correct original expressions; multiple simplify rows, without operation fields.
 await seed('9x - 9 = 5 - 15 + 3x');
 for(const s of ['-(3x)','9x-9-3x','5-15'])await answer(s);
 assert.match(await page.locator('#instruction').innerText(),/x-Terme zusammen/);assert.equal((await state()).tasks[0].pending.operation,null);
 assert.match(await page.locator('#work').innerText(),/9x-9-3x\s*=\s*5-15/);
 await answer('3*(2x-3)');assert.match(await page.locator('#instruction').innerText(),/Zahlen zusammen/);
 await answer('-10');assert.match(await page.locator('#instruction').innerText(),/Klammer aus/);
 await page.locator('#answer').fill('6x -');await page.reload();await page.locator('#answer').waitFor();assert.equal(await page.locator('#answer').inputValue(),'6x -');assert.match(await page.locator('#instruction').innerText(),/Klammer aus/);
 await answer('9x-3x-9');assert.match(await page.locator('#instruction').innerText(),/x-Terme zusammen/);
 await answer('-9 + 6x');assert.match(await page.locator('#instruction').innerText(),/Zahlen von links nach rechts/);
 for(const s of ['+9','6x','-1',':((6))','x','-1/6'])await answer(s);
 assert.equal((await state()).tasks[0].done,true);assert.equal((await state()).tasks[0].clean,true);
 assert.equal((await state()).tasks[0].lines.filter(l=>l.operation===null).length,3);
 await page.reload();await page.locator('#next').waitFor();assert.equal((await state()).tasks[0].done,true);
 const originalWork=(await state()).tasks[0].lines.map(l=>l.equation);assert.ok(originalWork.includes('3*(2x-3) = -10'));assert.ok(originalWork.includes('-9 + 6x = -10'));

 // Actual schema geometry and input positions, including instructions inside the field.
 await seed('9x-9=5-15+3x');
 const checkPosition=async(column)=>{assert.equal(await page.locator('#answer').evaluate(el=>el.parentElement.dataset.column),column);assert.equal(await page.locator('#answer').getAttribute('placeholder'),await page.locator('#instruction').textContent());assert.ok(await page.locator('#answer').evaluate(el=>el.scrollHeight<=el.clientHeight+2));};
 await checkPosition('operation');await page.setViewportSize({width:390,height:1000});await page.waitForTimeout(80);await checkPosition('operation');await page.screenshot({path:path.join(__dirname,'aequivalenz-schema-operation-mobil.png'),fullPage:true});await page.setViewportSize({width:1000,height:1100});await page.waitForTimeout(80);await page.screenshot({path:path.join(__dirname,'aequivalenz-schema-operation.png'),fullPage:true});assert.equal(await page.locator('#work tr').last().locator('[data-column=pipe]').innerText(),'|');
 await answer('-3x');await checkPosition('left');await answer('9x-9-3x');await checkPosition('right');await answer('5-15');await checkPosition('left');assert.equal(await page.locator('#work tr').last().locator('[data-column=pipe]').innerText(),'');
 const equals=await page.locator('#work [data-column=equals]').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().x));assert.ok(equals.every(x=>Math.abs(x-equals[0])<1));
 assert.ok(await page.evaluate(()=>document.querySelector('#scorePanel').getBoundingClientRect().top>document.querySelector('#exercise').getBoundingClientRect().bottom));assert.equal(await page.locator('h1').innerText(),'Gleichungen schrittweise lösen');
 await page.screenshot({path:path.join(__dirname,'aequivalenz-schema-desktop.png'),fullPage:true});
 console.log('PASS guided sides, original entries, repeated simplification and resume');
 // Fully simplified reordered terms: no artificial extra row; errors never advance.
 await seed('2x+3=5x+15');await answer('-2x');assert.equal((await state()).tasks[0].pending,null);
 await answer('-5x');await answer('x=-4');assert.equal((await state()).tasks[0].pending.left,null);
 await answer('3-3*x');await answer('15');assert.equal((await state()).tasks[0].pending,null);
 for(const s of ['-3','-3x','12',':(-3)','x','12/(-3)'])await answer(s);
 assert.equal((await state()).tasks[0].done,false);assert.match(await page.locator('#instruction').innerText(),/rechts/);await answer('-4');assert.equal((await state()).tasks[0].done,true);assert.equal((await state()).tasks[0].clean,false);
 console.log('PASS negative divisor and invalid steps');

 // Heuristic is advisory, recognizes both solution directions and tolerates useful intermediate steps.
 await page.evaluate(()=>{const e=test.equation('2x+3=5x+15');if(!test.assessment(e,'*3000000').length)throw Error('Large factor');if(!test.assessment(e,':3').length)throw Error('Extra fractions');if(!test.assessment(test.equation('2x=6'),'+3').length)throw Error('Extra terms');for(const [eq,op] of [['2x+3=5x+15','-2x'],['2x+3=5x+15','-5x'],['x/2+1=3x/2+5','*2'],['-12=3x',':3'],['-3x=12',':(-3)']])if(test.assessment(test.equation(eq),op).length)throw Error('Useful step '+op);});
 await seed('2x+3=5x+15');await page.evaluate(()=>{test.state.settings.transformationHints=false;test.render();test.save();});
 for(const input of [':pi','+a']){await answer(input);assert.match(await page.locator('#feedback').innerText(),/nicht unterstützt/);assert.equal(await page.locator('#feedback').evaluate(e=>e.classList.contains('bad')),false);assert.equal((await state()).tasks[0].clean,true);}
 await answer('*3000000');assert.equal(await page.locator('#work .suspect').count(),1);assert.equal(await page.locator('#operationHelp').isVisible(),true);await page.screenshot({path:path.join(__dirname,'aequivalenz-schritthilfe.png'),fullPage:true});assert.equal((await state()).tasks[0].pending.operation,'*3000000');await page.locator('#keepOperation').click();assert.equal(await page.locator('#operationHelp').isVisible(),false);
 for(const v of ['6000000x+9000000','15000000x+45000000'])await answer(v);assert.equal((await state()).tasks[0].clean,true);await page.reload();await page.locator('#answer').waitFor();assert.equal(await page.locator('#work .suspect').count(),1);
 await page.locator('#work .suspect').click();await page.locator('#changeOperation').click();assert.equal((await state()).tasks[0].lines.length,1);assert.equal((await state()).tasks[0].revisions.length,1);assert.equal(await page.locator('#answer').inputValue(),'*3000000');assert.equal(await page.locator('#answer').evaluate(e=>e.parentElement.dataset.column),'operation');await page.reload();await page.locator('#answer').waitFor();
 for(const v of ['-2x','3','3x+15','-15','-12','3x',':3','-4','x'])await answer(v);assert.equal((await state()).tasks[0].done,true);assert.equal(await page.evaluate(()=>test.credited(test.state.tasks[0])),true);assert.equal((await state()).tasks[0].revisions.length,1);
 // Unmarked operation can be changed before either following side is entered.
 await seed('2x+3=5x+15');await answer('-5x');await page.locator('#work .op-help').click();await page.locator('#changeOperation').click();assert.equal((await state()).tasks[0].pending,null);assert.equal((await state()).tasks[0].attempts.length,0);assert.equal((await state()).tasks[0].revisions[0].pending.operation,'-5x');await page.reload();await page.locator('#answer').waitFor();

 // Later rewind preserves preceding rows; discarded mathematical errors cannot be erased for points.
 await seed('2x+3=5x+15');for(const v of ['-5x','0','-3x+3','15','-3'])await answer(v);await page.locator('#work .op-help').last().click();await page.locator('#changeOperation').click();assert.equal((await state()).tasks[0].lines.length,2);assert.equal((await state()).tasks[0].lines[1].equation,'-3x+3 = 15');await page.locator('#work .op-help').first().click();await page.locator('#changeOperation').click();for(const v of ['-5x','-3x+3','15','-3','-3x','12',':(-3)','x','-4'])await answer(v);assert.equal(await page.evaluate(()=>test.credited(test.state.tasks[0])),false);await page.reload();await page.locator('#next').waitFor();assert.equal(await page.evaluate(()=>test.credited(test.state.tasks[0])),false);
 console.log('PASS advisory heuristic, unsupported syntax, continue, persistent marker, rewind before/after sides and reload');
 // Build real accepted attempts for score thresholds, then reload through strict validation.
 await page.evaluate(()=>{const tasks=[];for(let k=0;k<130;k++){let t=test.makeTask('2x+3=5x+15');for(const input of ['-5x','-3x+3','15','-3','-3x','12',':(-3)','x','-4']){const kind=t.pending?(t.pending.left===null?'left':'right'):'operation';test.applyAnswer(t,input);t.attempts.push({kind,input,ok:true,time:new Date().toISOString()});}tasks.push(t);}test.state={...test.fresh(),tasks:tasks.slice(0,4)};window.scoreTasks=tasks;test.render();test.save();});
 assert.match(await page.locator('#points').innerText(),/1 \/ 10/);
 await page.evaluate(()=>{for(let i=0;i<test.thresholds.length;i++){test.state.tasks=scoreTasks.slice(0,test.thresholds[i]);test.render();if(document.querySelector('#points').textContent!==`${i+1} / 10 Punkte`)throw Error('Threshold '+i);}test.state.tasks=scoreTasks.slice(0,4);test.render();test.save();});
 await page.reload();await page.locator('#next').waitFor();assert.match(await page.locator('#points').innerText(),/1 \/ 10/);
 await page.locator('#historyPanel').evaluate(e=>e.open=true);await page.locator('#history details').first().evaluate(e=>e.open=true);await page.locator('#history').getByRole('button',{name:'Aufgabe ansehen',exact:true}).first().click();assert.equal(await page.locator('#answer').isVisible(),false);await page.locator('#next').click();assert.equal((await state()).tasks.length,4);

 // Reopening and completing the same credited task keeps exactly the same point total.
 await page.locator('#work .op-help').first().click();await page.locator('#changeOperation').click();assert.match(await page.locator('#points').innerText(),/1 \/ 10/);await page.reload();await page.locator('#answer').waitFor();assert.match(await page.locator('#points').innerText(),/1 \/ 10/);for(const v of ['-5x','-3x+3','15','-3','-3x','12',':(-3)','x','-4'])await answer(v);assert.equal((await state()).tasks.length,4);assert.match(await page.locator('#points').innerText(),/1 \/ 10/);assert.equal((await state()).tasks[0].revisions.length,1);

 // Independent ten-point progressions: guided history never raises the next free threshold.
 await page.evaluate(()=>{const sample=structuredClone(test.state.tasks[1]);delete sample.revisions;delete sample.hinted;const guided=()=>structuredClone(sample),free=()=>{const t=guided();t.hinted=false;for(const a of t.attempts)if(a.kind==='operation')a.guided=false;return t;};window.guidedSample=guided();window.freeSample=free();const set=(g,f)=>{test.state.tasks=[...Array.from({length:g},guided),...Array.from({length:f},free)];test.state.active=0;};set(3,3);if(JSON.stringify(test.scorePoints())!==JSON.stringify({guided:0,free:0}))throw Error('Combined progress leaked');set(10,4);test.render();if(test.scorePoints().guided!==2||test.scorePoints().free!==1)throw Error('Independent progress');for(let i=0;i<test.thresholds.length;i++){set(test.thresholds[i],4);if(test.scorePoints().guided!==i+1||test.scorePoints().free!==1)throw Error('Guided threshold');set(10,test.thresholds[i]);if(test.scorePoints().guided!==2||test.scorePoints().free!==i+1)throw Error('Free threshold');}set(130,130);if(test.scorePoints().guided!==10||test.scorePoints().free!==10)throw Error('Full twenty');set(10,4);test.render();test.save();});
 assert.equal(await page.locator('#points').innerText(),'2 / 10 Punkte');assert.equal(await page.locator('#pointsFree').innerText(),'1 / 10 Punkte');await page.screenshot({path:path.join(__dirname,'aequivalenz-zwei-punktelisten.png'),fullPage:true});
 const splitState=await page.evaluate(()=>test.encode(test.state));seedHost=splitState;await page.goto(base+'/inline');await page.locator('#exercise').waitFor();for(const [i,want] of [[1,'1'],[2,'1'],[3,'0'],[10,'0'],[11,'1'],[12,'0'],[20,'0']])assert.equal(await page.locator('#e2_cloze_text_input_'+i).inputValue(),want);assert.equal(await page.locator('#e2').isVisible(),false);
 // Reopen a credited free task while tips are on: credit stays in its original lane after reload.
 await page.evaluate(()=>{test.state.active=10;test.state.settings.transformationHints=true;test.render();test.save();});await page.locator('#work .op-help').first().click();await page.locator('#changeOperation').click();assert.equal(await page.locator('#pointsFree').innerText(),'1 / 10 Punkte');assert.equal(await page.locator('#e2_cloze_text_input_11').inputValue(),'1');seedHost=await page.locator('#e1_text_input').inputValue();await page.reload();await page.locator('#answer').waitFor();assert.equal(await page.locator('#e2_cloze_text_input_11').inputValue(),'1');for(const v of ['-5x','-3x+3','15','-3','-3x','12',':(-3)','x','-4'])await answer(v);assert.equal(await page.locator('#points').innerText(),'2 / 10 Punkte');assert.equal(await page.locator('#pointsFree').innerText(),'1 / 10 Punkte');
 // An unfinished free task that later displays tips is credited only as guided.
 await page.evaluate(()=>{test.state={...test.fresh(),settings:{transformationHints:false},tasks:[test.makeTask('2x+3=5x+15')]};test.render();test.save();});await answer('-5x');await page.locator('#settingsButton').click();await setHints(true);for(const v of ['-3x+3','15','-3','-3x','12',':(-3)','x','-4'])await answer(v);assert.equal(await page.evaluate(()=>test.creditMode(test.state.tasks[0])),'guided');
 // Resume the existing integration cases with four completed guided tasks.
 await page.goto(base);await page.locator('#exercise').waitFor();await page.evaluate(()=>{const sample=structuredClone(test.state.tasks[1]);delete sample.revisions;delete sample.hinted;for(const a of sample.attempts)delete a.guided;test.state={...test.fresh(),tasks:Array.from({length:4},()=>structuredClone(sample))};test.render();test.save();});
 console.log('PASS two independent progressions, all twenty field slots, mixed-mode assignment, stable lane after rewind/reload');
 const saved=await page.evaluate(()=>test.encode(test.state));
 seedHost='';await page.goto(base+'/host');let frame=page.frames()[1];await frame.locator('#exercise').waitFor();assert.equal(await frame.evaluate(()=>test.state.tasks.length),1);assert.equal(await frame.evaluate(()=>test.state.tasks[0].done),false);assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.locator('#e2').isVisible(),false);assert.equal(await page.locator('#e2_cloze_text_input_1').inputValue(),'0');assert.ok(await page.evaluate(()=>changes)>0);
 seedHost=saved;await page.reload();frame=page.frames()[1];await frame.locator('#exercise').waitFor();assert.equal(await frame.evaluate(()=>test.state.tasks.length),4);assert.equal(await page.locator('#e2_cloze_text_input_1').inputValue(),'1');assert.equal(await page.locator('#e2_cloze_text_input_2').inputValue(),'0');
 await page.goto(base+'/inline?editor');await page.locator('#exercise').waitFor();assert.equal(await page.locator('#e1_text_input').inputValue(),saved);assert.equal(await page.locator('#e1').isVisible(),true);assert.match(await page.locator('#storage').textContent(),/Editor/);
 await page.goto(base+'/inline');await page.locator('#exercise').waitFor();assert.equal(await page.locator('#e2_cloze_text_input_1').inputValue(),'1');
 seedHost='broken';await page.goto(base+'/host');frame=page.frames()[1];await frame.locator('#retry').waitFor();assert.equal(await page.locator('#e1_text_input').inputValue(),'broken');assert.equal(await frame.locator('#exercise').isVisible(),false);
 await page.goto(base+'/app?edulo=1');await page.locator('#retry').waitFor();assert.equal(await page.locator('#exercise').isVisible(),false);

 // Configuration, visible/missing scoring fields, E1 with altered quotes, partial host resume.
 seedHost=saved;await page.goto(base+'/inline?SHOW_FIELDS=1');await page.locator('#exercise').waitFor();assert.equal(await page.locator('#e1').isVisible(),true);assert.equal(await page.locator('#e2').isVisible(),true);
 await page.locator('#e2_cloze_text_input_10').evaluate(e=>e.remove());await page.evaluate(()=>test.save());assert.match(await page.locator('#storage').innerText(),/1 Punktefelder fehlen/);
 await page.goto(base+'/inline?STATE_ID=e1_text_input&SCORE_PREFIX=e2_cloze_text_input_');await page.locator('#exercise').waitFor();assert.equal(await page.locator('#e2_cloze_text_input_1').inputValue(),'1');
 await page.evaluate(()=>{test.state={...test.fresh(),tasks:[test.makeTask('9x-9=5-15+3x')]};test.render();test.save();});for(const s of ['-3x','9x-3x-9','5-15','6x-9'])await answer(s);await page.locator('#answer').fill('5 -');seedHost=await page.locator('#e1_text_input').inputValue();await page.reload();await page.locator('#answer').waitFor();assert.equal(await page.locator('#answer').inputValue(),'5 -');assert.match(await page.locator('#instruction').innerText(),/Zahlen zusammen/);assert.equal(await page.locator('#e2_cloze_text_input_1').inputValue(),'0');

 await page.locator('#settingsButton').click();await setHints(false);seedHost=await page.locator('#e1_text_input').inputValue();await page.reload();await page.locator('#answer').waitFor();assert.equal(await page.locator('#answer').getAttribute('placeholder'),'Rechte Gleichungsseite');assert.equal(await page.evaluate(()=>test.state.settings.transformationHints),false);await page.locator('#settingsButton').click();await page.screenshot({path:path.join(__dirname,'aequivalenz-einstellungen.png'),fullPage:true});

 await page.locator('#work .op-help').first().click();await page.locator('#changeOperation').click();seedHost=await page.locator('#e1_text_input').inputValue();await page.reload();await page.locator('#answer').waitFor();assert.equal((await state()).tasks[0].lines.length,1);assert.equal((await state()).tasks[0].revisions.length,1);assert.equal(await page.locator('#answer').evaluate(e=>e.parentElement.dataset.column),'operation');
 console.log('PASS scoring, history, E1 priority, fields/events, inline/editor, corrupt/missing E1');
 await page.goto(base);await page.locator('#exercise').waitFor();await seed('9x-9=5-15+3x');await answer('-3x');await answer('9x-9-3x');await answer('5-15');
 for(const width of [1000,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('#answer:visible').count(),1);await page.waitForTimeout(80);assert.ok(await page.locator('#answer').evaluate(el=>el.scrollHeight<=el.clientHeight+2));assert.ok(await page.locator('#work').evaluate(el=>el.scrollWidth<=el.clientWidth));await page.screenshot({path:path.join(__dirname,'aequivalenz-preview-'+width+'.png'),fullPage:true});}
 await page.locator('#answer').fill('6x-9');await page.locator('#answer').press('Enter');assert.match(await page.locator('#instruction').innerText(),/Zahlen zusammen/);assert.deepEqual(errors,[]);
 console.log('PASS responsive 320/390/1000, single active field, keyboard, no browser errors. ALL TESTS PASSED.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.close();});

