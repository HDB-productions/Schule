// Edge + local Edulo contract simulation; never contacts Edulo servers.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/danie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const raw = fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf8');
const hook = `window.v3={A,E,bridge,render,persist,checked,help,keyboardAction,get state(){return state},set state(s){state=s;historyDirty=true},seed(text){clearTimeout(draftTimer);state=E.fresh();state.tasks=[E.makeTask(text)];state.nextId=2;historyDirty=true;showFeedback();render();persist()}};`;
const html = raw.replace('/* TEST_HOOK */', hook), KEY = 'schule-edulo:aequivalenz-v3';
let hostSeed = '', browser;
function fixture(mode, iframe) {
  return `<!doctype html><html><body><div id="contentWrapper" style="position:absolute;inset:0 0 40px"><div id="e1"><textarea id="e1_text_input">${hostSeed}</textarea></div><div id="e2">${mode === 'missing' ? '' : Array.from({length:20},(_,i)=>'<input id="e2_cloze_text_input_'+(i+1)+'">').join('')}</div><div id="mount">${iframe ? '<iframe src="/app?edulo=1" style="border:0;width:1024px;max-width:100%;height:768px"></iframe>' : ''}</div></div><div id="footerButtons" style="position:absolute;bottom:0;height:40px"><button>Überprüfen</button><button>Lösungen</button></div><script>
  window.writes=[];window.saves=0;window.saved=null;
  const wrap=el=>({0:el,val(v){if(arguments.length){el.value=v;return this;}return el.value;}});
  const mod={loadUserInput(c,rows){for(const r of rows)for(const item of c.clozeInputs)if(item.JSON.id===r.id){item.inputElement.val(r.v);item.last=r.l||null;item.correct=r.c;item.helped=r.h;}},checkSingleClozeInput(item){const ok=item.inputElement.val().trim()==='1';item.correct=ok?'true':'false';return ok;},saveUserInput(c,out){for(const item of c.clozeInputs){out.input.push({id:item.JSON.id,v:item.inputElement.val(),l:item.last||'',c:item.correct,h:item.helped});out.counter.total++;if(item.correct==='true')out.counter.correct++;else if(item.inputElement.val()!=='')out.counter.wrong++;if(item.correct==='true'&&item.helped==='true')out.counter.helped++;}}};
  const content={JSON:{},module:mod,clozeInputs:[]};
  content.clozeInputs=[...document.querySelectorAll('#e2 input')].map((el,i)=>{const item={JSON:{id:200+i,values:[{value:'1'}]},inputElement:wrap(el),correct:'false',helped:'false',last:null};el.addEventListener('change',()=>{mod.checkSingleClozeInput(item);storage.save();});return item;});
  const storage={JSON:{active:'true'},save(){window.saves++;const out={input:[],counter:{total:0,correct:0,helped:0,wrong:0}};mod.saveUserInput(content,out);window.saved=out;}};
  window.widget={JSON:{},isEditor:${mode==='editor'},contentWrapper:{0:document.getElementById('contentWrapper')},forEachContent(fn){fn(content);},findModule(n){return n==='cloze_text'?mod:n==='save_load'?storage:null;}};
  window.content=content;window.mod=mod;
  document.addEventListener('input',e=>writes.push(e.target.id));document.getElementById('e1_text_input').addEventListener('change',()=>storage.save());
  </script></body></html>`;
}
const server = http.createServer((req,res) => {
  const u = new URL(req.url, 'http://localhost'); res.setHeader('Content-Type','text/html;charset=utf-8');
  if (u.pathname === '/host') res.end(fixture(u.searchParams.get('mode') || 'normal', true));
  else if (u.pathname === '/inline') {
    const markup = JSON.stringify(html.match(/<main[\s\S]*<\/main>/)[0]).replace(/<\/script/gi,'<\\/script');
    const install = '<script>const mount=document.getElementById("mount");mount.innerHTML='+markup+';for(const old of [...mount.querySelectorAll("script")]){const script=document.createElement("script");script.textContent=old.textContent;old.replaceWith(script);}</script>';
    res.end(fixture(u.searchParams.get('mode') || 'normal', false).replace('</body>',()=>install+'</body>'));
  } else res.end(process.argv.includes('--preview') ? raw : html);
});
if (process.argv.includes('--preview')) { server.listen(8773,'127.0.0.1',()=>console.log('Preview http://127.0.0.1:8773')); }
else (async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve)); const base = 'http://127.0.0.1:'+server.address().port;
  browser = await chromium.launch({channel:'msedge',headless:true,args:['--no-proxy-server']});
  const page = await browser.newPage({viewport:{width:1024,height:768}}), errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.setDefaultTimeout(10000);
  await page.goto(base, {waitUntil:'domcontentloaded'}); await page.locator('[data-exercise]').waitFor();
  const seed = async (text, frame=page) => frame.evaluate(text=>v3.seed(text),text);
  const answer = async (text, frame=page) => { await frame.locator('[data-answer]').fill(text); await frame.locator('[data-check]').click(); };
  const getTask = (frame=page) => frame.evaluate(()=>v3.state.tasks.at(-1));
  const finish = async(frame=page)=>{for(let n=0;n<40;n++){if((await getTask(frame)).done)return;const input=await frame.evaluate(()=>v3.E.nextAnswer(v3.state.tasks.at(-1)));await answer(input,frame);}throw Error('Task did not terminate');};
  // Real student steps including an alternate direction, decimals and original text.
  await seed('7x-7=2x+5');
  for(const s of ['-7x','-7','-5x+5','-5','-12','-5x',':(-5)','12/5','x','2,4'])await answer(s);
  assert.equal((await getTask()).done,true); assert.equal((await getTask()).solution,'2,4');
  assert.equal(await page.locator('.dot.green').count(),1); assert.equal(await page.locator('[data-keyboard]').isVisible(),false);
  await page.reload();await page.locator('[data-next]').waitFor();assert.equal(await page.locator('.dot.green').count(),1);
  console.log('PASS alternate free direction, decimal set, original entries, reload without duplicate point');
  // Regression from the reported screenshot: subtraction of a signed sum.
  await seed('2x=3x+8');await answer('−2x−8');await answer('−8');
  await page.reload();await page.locator('[data-answer]').waitFor();await answer('x');
  assert.equal(await page.locator('[data-instruction]').innerText(),'Gib die Lösungsmenge an.');
  await answer('−8');assert.equal((await getTask()).solution,'−8');assert.equal((await getTask()).award,'green');
  await seed('2x=3x+8');await answer('-2x-8');
  for(let side=0;side<2;side++)for(let n=0;n<4;n++)await page.locator('[data-help]').click();
  assert.equal((await getTask()).lines.at(-1).left,'-8');assert.equal((await getTask()).lines.at(-1).right,'x');
  await answer('-8');assert.equal((await getTask()).award,'red');assert.equal(await page.locator('.dot.red').count(),1);
  await page.locator('[data-work]').screenshot({path:path.join(__dirname,'compound-operation.png')});
  // Existing logs retain points and drafts; loading does not silently save or reset them.
  const legacyRaw=await page.evaluate(()=>{
    const s=v3.E.fresh();s.schema=1;const t=v3.E.makeTask('2x=3x+8');t._legacyOperations=true;
    s.tasks=[t];s.nextId=2;v3.E.apply(t,'-2x-8');
    for(let n=0;n<3;n++)v3.E.requestHelp(t);
    v3.E.apply(t,v3.E.nextAnswer(t),true);v3.E.account(s,t);t.input='mein Entwurf';delete t._legacyOperations;
    v3.state=s;v3.persist();return localStorage.getItem('schule-edulo:aequivalenz-v3');
  });
  await page.reload();await page.locator('[data-answer]').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('schule-edulo:aequivalenz-v3')),legacyRaw);
  assert.equal(await page.evaluate(()=>v3.state.schema),2);assert.equal((await getTask()).lines[0].operation,'-(2x-8)');
  assert.equal(await page.locator('[data-answer]').inputValue(),'mein Entwurf');assert.equal(await page.locator('.dot.red').count(),1);
  await answer('x+16');await answer('-16');await answer('-8');await answer('x');await answer('-8');
  await page.reload();await page.locator('[data-next]').waitFor();assert.equal((await getTask()).solution,'-8');
  assert.equal(await page.locator('.dot.red').count(),1);
  console.log('PASS compound subtraction manual/solve/reload and read-only upgrade of historical logs with unchanged points/draft');
  // Balanced types, initial expansion/repeated terms and exact all/empty results.
  for(const [source,type] of [['2(x+1)+x-x=2x+2','all'],['2(x+1)+x-x=2x+3','none'],['2(x+1)+x-x=x+3','unique']]){
    await seed(source);assert.match(await page.locator('[data-instruction]').innerText(),/Klammer/);await answer('2x+2');await finish();assert.equal((await getTask()).kind,type);assert.equal((await getTask()).done,true);
    if(type==='all'){assert.equal((await getTask()).solution,'ℝ');assert.equal(await page.locator('[data-open-brace]').isVisible(),false);}
    if(type==='none'){assert.equal((await getTask()).solution,'');assert.equal(await page.locator('[data-open-brace]').isVisible(),true);}
  }
  // Free operation can precede expansion; no artificial error for unsimplified but equal terms.
  await seed('2(x+1)=x+4');await page.locator('[data-skip]').click();await answer('-x');await answer('2(x+1)-x');await answer('4');assert.equal((await getTask()).tainted,false);assert.equal((await getTask()).pending.operation,null);await page.reload();await page.locator('[data-answer]').waitFor();await finish();assert.equal(await page.locator('.dot.green').count(),1);
  console.log('PASS all three solution types, braces, expansion, free choice before simplification, replay mid-phase');
  // Neutral advisory does not taint; explicit assistance does. Notice appears BEFORE sides.
  await seed('7x-7=2x+5');await answer('+100');assert.equal(await page.locator('[data-advisory]').isVisible(),true);assert.equal((await getTask()).tainted,false);await page.locator('[data-change]').click();assert.equal((await getTask()).pending,null);assert.equal((await getTask()).tainted,false);
  await answer('+100');await page.locator('[data-advisory-button]').click();assert.equal((await getTask()).tainted,false);assert.equal((await getTask()).pending.operation,'+100');assert.equal(await page.locator('[data-advisory-details]').isVisible(),true);await page.locator('[data-alternative-help]').click();assert.equal((await getTask()).level,1);assert.equal((await getTask()).tainted,true);assert.equal((await getTask()).pending,null);
  await page.locator('[data-help]').click();assert.equal(await page.locator('[data-help-visual]').isVisible(),true);assert.ok(await page.locator('[data-work] mark').count());assert.equal((await getTask()).level,2);
  await page.locator('[data-help]').click();assert.equal(await page.locator('[data-help]').innerText(),'Lösen');assert.equal((await getTask()).level,3);assert.equal(await page.locator('.dot.red').count(),0);
  await page.locator('[data-help]').click();assert.equal((await getTask()).pending.operation,'-2x');assert.equal(await page.locator('.dot.red').count(),1);assert.equal((await getTask()).done,false);assert.equal(await page.locator('[data-help]').innerText(),'Hilfe');assert.equal(await page.locator('.red-entry').count(),1);
  await page.reload();await page.locator('[data-answer]').waitFor();assert.equal((await getTask()).usedSolve,true);assert.equal(await page.locator('.dot.red').count(),1);await finish();assert.equal(await page.locator('.dot.red').count(),1);assert.equal((await getTask()).award,'red');
  // Faults and voluntary help share the same ladder, reset only after correct input.
  await seed('2(x+1)=x+4');await answer('999');assert.equal((await getTask()).level,1);assert.equal(await page.locator('[data-help-visual]').isVisible(),false);await answer('998');assert.equal((await getTask()).level,2);assert.equal(await page.locator('[data-help-visual]').isVisible(),true);await answer('997');assert.equal((await getTask()).level,3);await page.reload();await page.locator('[data-answer]').waitFor();assert.equal(await page.locator('[data-help]').innerText(),'Lösen');await page.locator('[data-help]').click();assert.equal((await getTask()).lines.at(-1).left,'2x + 2');assert.ok(await page.locator('[data-work] .red-entry').count());await finish();assert.equal((await getTask()).award,'red');
  await seed('2x+3=x+5');await page.locator('[data-help]').click();await finish();assert.equal(await page.locator('.dot.yellow').count(),1);
  await seed('2x+3=x+5');await answer('*0');await finish();assert.equal(await page.locator('.dot.yellow').count(),1);
  console.log('PASS neutral advisory, three incremental visual hints, exhaustion, current input only, immediate red, persistent colors');
  // Each accepted entry has its own color, including corrected operations and solution sets.
  await seed('2x+3=x+5');await answer('*0');await answer('-x');
  assert.equal(await page.locator('[data-work] tr').first().locator('[data-column="operation"]').getAttribute('class'),'yellow-entry');
  await answer('x+3');await answer('999');await answer('5');
  let resultRow=page.locator('[data-work] tr').nth(1);
  assert.ok(await resultRow.locator('[data-column="left"]').evaluate(el=>el.classList.contains('green-entry')));
  assert.ok(await resultRow.locator('[data-column="right"]').evaluate(el=>el.classList.contains('yellow-entry')));
  await page.reload();await page.locator('[data-answer]').waitFor();
  assert.equal(await page.locator('[data-work] .yellow-entry').count(),2);
  await page.locator('[data-work]').screenshot({path:path.join(__dirname,'entry-colors.png')});
  await answer('-3');await answer('x');await answer('2');await answer('9');await answer('2');
  assert.ok(await page.locator('[data-solution]').evaluate(el=>el.classList.contains('yellow-entry')));
  assert.ok(await page.locator('[data-work] tr').last().locator('[data-column="right"]').evaluate(el=>el.classList.contains('green-entry')));
  await page.reload();await page.locator('[data-next]').waitFor();
  assert.ok(await page.locator('[data-solution]').evaluate(el=>el.classList.contains('yellow-entry')));
  await page.locator('[data-history-panel] > summary').click();await page.locator('.history-item > summary').first().click();
  assert.equal(await page.locator('.history-item .yellow-entry').count(),3);
  console.log('PASS individually corrected entries yellow, immediately correct entries green, solution and history colors after reload');
  // Keyboard editing, selection replacement, cursor moves and no serialization per key.
  await seed('2x+3=x+5');assert.equal(await page.locator('[data-answer]').getAttribute('inputmode'),'none');
  await page.evaluate(()=>{v3.bridge.saveOriginal=v3.bridge.save;window.saveCalls=0;v3.bridge.save=(...args)=>{saveCalls++;return v3.bridge.saveOriginal(...args)};});
  for(const k of ['-','1','2'])await page.locator('[data-keyboard] button').filter({hasText:k==='-'?'−':k}).first().click();
  // Use exact data keys for all later editing checks.
  assert.equal(await page.locator('[data-answer]').inputValue(),'−12');await page.locator('[data-key="left"]').click();await page.locator('[data-key="backspace"]').click();await page.locator('[data-key="x"]').click();assert.equal(await page.locator('[data-answer]').inputValue(),'−x2');
  await page.locator('[data-key="home"]').click();await page.locator('[data-key="delete"]').click();assert.equal(await page.locator('[data-answer]').inputValue(),'x2');await page.locator('[data-key="end"]').click();await page.locator('[data-key="("]').click();await page.locator('[data-key=")"]').click();await page.locator('[data-key=","]').click();await page.locator('[data-key="ℝ"]').click();assert.equal(await page.locator('[data-answer]').inputValue(),'x2(),ℝ');
  await page.waitForTimeout(450);assert.equal(await page.evaluate(()=>saveCalls),1);await page.reload();await page.locator('[data-answer]').waitFor();assert.equal(await page.locator('[data-answer]').inputValue(),'x2(),ℝ');
  await page.locator('[data-answer]').fill('−x');await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await page.reload();await page.locator('[data-answer]').waitFor();assert.equal(await page.locator('[data-answer]').inputValue(),'−x');
  console.log('PASS onscreen keys, insertion/deletion/navigation, draft debounce and pagehide/reload');
  // Solution mistakes remain editable; a solved empty set only completes that input.
  await seed('0=1');await answer('ℝ');await answer('1');await answer('2');await page.locator('[data-help]').click();assert.equal((await getTask()).done,true);assert.equal((await getTask()).solution,'');assert.equal((await getTask()).solutionRed,true);
  await seed('0=0');await page.locator('[data-key="ℝ"]').click();await page.locator('[data-check]').click();assert.equal((await getTask()).done,true);assert.equal((await getTask()).award,'green');
  // Large real browser workload: every answer is saved through the actual bridge.
  const stress = await page.evaluate(async()=>{
    const s=v3.E.fresh(),times=[],sizes={},kinds=[];let x=1357911;const rng=()=>((x=(Math.imul(1664525,x)+1013904223)>>>0)/4294967296);
    v3.state=s;
    for(let i=0;i<1200;i++){
      v3.E.newTask(s,rng);const t=s.tasks.at(-1);kinds.push(t.kind);
      while(!t.done){const r=v3.E.apply(t,v3.E.nextAnswer(t));if(!r.ok)throw Error(r.error);v3.E.account(s,t);}
      const start=performance.now();v3.persist();times.push(performance.now()-start);
      if([49,599,1199].includes(i))sizes[i+1]=JSON.stringify(s).length;
      if(i%60===0)await new Promise(resolve=>setTimeout(resolve,0));
    }
    v3.render();times.sort((a,b)=>a-b);return {total:s.totals.total,retained:s.tasks.length,archive:s.archive.total,sizes,median:times[600],p95:times[1140],max:times.at(-1),typeCounts:['unique','all','none'].map(k=>s.totals[k]),valid:v3.E.validate(s)};
  });
  assert.equal(stress.total,1200);assert.equal(stress.retained,50);assert.equal(stress.archive,1150);assert.deepEqual(stress.typeCounts,[400,400,400]);assert.equal(stress.valid,true);assert.ok(stress.sizes[1200]<stress.sizes[50]*1.5);assert.ok(stress.p95<300,JSON.stringify(stress));
  assert.equal(await page.locator('[data-history-list] table').count(),0);await page.locator('[data-history-panel] > summary').click();assert.equal(await page.locator('.history-item').count(),50);assert.equal(await page.locator('.history-item table').count(),0);await page.locator('.history-item > summary').first().click();assert.equal(await page.locator('.history-item table').count(),1);
  await page.reload();await page.locator('[data-next]').waitFor();assert.equal(await page.evaluate(()=>v3.state.totals.total),1200);assert.equal(await page.locator('[data-history-list] table').count(),0);
  console.log('PASS stress '+JSON.stringify(stress));
  // Edulo: three colors including reversing a filled board, native flags and E1 authority.
  await page.goto(base+'/host',{waitUntil:'domcontentloaded'});let frame=page.frames()[1];await frame.locator('[data-exercise]').waitFor();assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.locator('#e2').isVisible(),false);assert.equal(await page.locator('#footerButtons').isVisible(),false);
  await seed('2x=4',frame);await finish(frame);assert.equal(await page.locator('#e2_cloze_text_input_1').inputValue(),'1');assert.equal(await page.evaluate(()=>saved.input[0].h),'false');
  await frame.locator('[data-next]').click();await frame.locator('[data-help]').click();await finish(frame);assert.equal(await page.evaluate(()=>saved.input[1].h),'true');
  await frame.locator('[data-next]').click();for(let i=0;i<4;i++)await frame.locator('[data-help]').click();assert.equal(await page.locator('#e2_cloze_text_input_20').inputValue(),'0');assert.equal(await page.evaluate(()=>saved.input[19].c),'false');assert.equal(await page.evaluate(()=>saved.counter.wrong),1);
  hostSeed = await page.locator('#e1_text_input').inputValue();await page.goto(base+'/host',{waitUntil:'domcontentloaded'});frame=page.frames()[1];await frame.locator('[data-exercise]').waitFor();assert.equal((await getTask(frame)).usedSolve,true);assert.equal(await page.evaluate(()=>writes.length),0);await finish(frame);
  // New empty E1 never imports the standalone 1200-task state.
  hostSeed='';await page.goto(base+'/inline',{waitUntil:'domcontentloaded'});await page.locator('[data-exercise]').waitFor();assert.equal(await page.evaluate(()=>v3.state.totals.total),0);await seed('2x=4');await finish();assert.equal(await page.evaluate(()=>saved.counter.correct),1);
  hostSeed='foreign-corrupt-state';await page.goto(base+'/host',{waitUntil:'domcontentloaded'});frame=page.frames()[1];await frame.locator('[data-retry]').waitFor();assert.equal(await page.locator('#e1_text_input').inputValue(),hostSeed);assert.equal(await page.evaluate(()=>writes.length),0);assert.equal(await frame.locator('[data-controls]').evaluate(el=>el.disabled),true);
  hostSeed='';await page.goto(base+'/inline?mode=editor',{waitUntil:'domcontentloaded'});await page.locator('[data-exercise]').waitFor();assert.equal(await page.locator('[data-controls]').evaluate(el=>el.disabled),true);assert.equal(await page.evaluate(()=>writes.length),0);assert.equal(await page.locator('#e1').isVisible(),true);
  console.log('PASS local Edulo iframe/inline colors, native events, readonly restore, E1 isolation/corruption and editor');
  hostSeed=legacyRaw;await page.goto(base+'/host',{waitUntil:'domcontentloaded'});frame=page.frames()[1];await frame.locator('[data-exercise]').waitFor();
  assert.equal(await page.locator('#e1_text_input').inputValue(),legacyRaw);assert.equal(await page.evaluate(()=>writes.length),0);
  assert.equal(await frame.locator('[data-answer]').inputValue(),'mein Entwurf');assert.equal((await getTask(frame)).lines[0].operation,'-(2x-8)');
  await answer('x+16',frame);await finish(frame);assert.equal((await getTask(frame)).solution,'-8');
  console.log('PASS existing Edulo E1 migration without load writes, complete and save with corrected operation semantics');
  // Responsive visual checks; capture actual hint and expansion in each layout.
  for(const [width,height] of [[920,768],[390,844],[320,740]]){
    await page.setViewportSize({width,height});await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('[data-exercise]').waitFor();await seed('2(x+1)+3x-x=2x+5');await page.locator('[data-help]').click();await page.locator('[data-help]').click();
    assert.equal(await page.locator('[data-edulo-id]').evaluate(el=>el.scrollWidth<=el.clientWidth),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.equal(await page.locator('[data-answer]').count(),1);assert.ok(await page.locator('[data-keyboard] button').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)));
    await page.screenshot({path:path.join(__dirname,'qa-'+width+'.png'),fullPage:true});
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'qa-results.json'),JSON.stringify({stress,errors,viewports:[920,390,320],testedAt:new Date().toISOString()},null,2));
  console.log('ALL BROWSER TESTS PASSED');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
