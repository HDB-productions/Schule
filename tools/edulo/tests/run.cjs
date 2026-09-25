// Local contract simulation, not an Edulo server/Excel test.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http'), assert = require('node:assert/strict');
let chromium;
try { ({chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }
const kit = path.resolve(__dirname, '..'), {build} = require('../build.cjs'), {create} = require('../new-widget.cjs');
const bridge = fs.readFileSync(path.join(kit, 'runtime/footer.js'), 'utf8') + '\n' + fs.readFileSync(path.join(kit, 'runtime/bridge.js'), 'utf8');
const footer = fs.readFileSync(path.join(kit, 'runtime/footer.js'), 'utf8');
// Optional private export stays outside the repository; execute the captured methods in a local fixture only.
const exportedMethods = process.env.EDULO_DIAGNOSIS ? Object.fromEntries(JSON.parse(fs.readFileSync(process.env.EDULO_DIAGNOSIS,'utf8')).documents[0].modules.find(m=>m.name==='cloze_text').functions.map(f=>[f.path.split('.').pop(),f.source.text])) : null;
const {readEduloParameters} = require('../runtime/parameters.js');
const parameters = readEduloParameters({contents: [{type: 'html_and_files', html: '<!-- EDULO_WIDGET_KEY:test -->', parameters: [{name:'x',value:'old'},{name:'x',value:'new'},{name:'__proto__',value:'safe'}]}]}, 'EDULO_WIDGET_KEY:test');
assert.equal(parameters.x, 'new'); assert.equal(Object.getPrototypeOf(parameters), null); assert.equal(parameters.__proto__, 'safe');
assert.throws(() => readEduloParameters({contents: []}, 'EDULO_WIDGET_KEY:test'));
const temp = fs.mkdtempSync(path.join(kit, '.test-'));
create(temp, 'kit-test', 'Vorlage & Test');
assert.throws(() => create(temp, 'kit-test', 'No overwrite'));
const built = fs.readFileSync(path.join(temp, 'widget.html'), 'utf8');
assert(!built.includes('/* EDULO_BRIDGE */')); assert(built.includes('Vorlage &amp; Test')); build(path.join(temp, 'widget.quelle.html'));
const footerHtml = require('../diagnostics/build-footer-test.cjs').buildFooter(path.join(temp,'footer-test.html'));
function fixture(mode) {
  const empty = mode === 'missing';
  return `<!doctype html><html><body><div id="contentWrapper" style="position:absolute;top:0;bottom:40px;left:0;right:0"><div id="e1"><textarea id="e1_text_input"></textarea>${mode === 'foreign-container' ? '<input id="unrelated" value="keep">' : ''}</div><div id="e2">${empty || mode === 'late' ? '' : Array.from({length:20},(_,i)=>'<input id="e2_cloze_text_input_'+(i+1)+'">').join('')}</div><div id="mount"></div></div><div id="footerButtons" style="position:absolute;bottom:0;height:40px"><button>Überprüfen</button><button>Lösungen</button></div><script>
  window.writes=[];window.saves=0;window.saved=null;
  const wrap=el=>({0:el,val(v){if(arguments.length){el.value=v;return this;}return el.value;}});
  const mod={name:'cloze_text',loadUserInput(c,rows){for(const row of rows)for(const item of c.clozeInputs)if(item.JSON.id===row.id){item.inputElement.val(row.v);item.last=row.l||null;item.correct=row.c;item.helped=row.h;}},checkSingleClozeInput(item){const ok=item.inputElement.val().trim()==='1';item.correct=ok?'true':'false';return ok;},saveUserInput(c,out){for(const item of c.clozeInputs){out.input.push({id:item.JSON.id,v:item.inputElement.val(),l:item.last||'',c:item.correct,h:item.helped});out.counter.total++;if(item.correct==='true')out.counter.correct++;else if(item.inputElement.val()!=='')out.counter.wrong++;if(item.correct==='true'&&item.helped==='true')out.counter.helped++;}}};
  const storage={JSON:{active:'true'},save(){window.saves++;const out={input:[],counter:{total:0,correct:0,helped:0,wrong:0}};mod.saveUserInput(content,out);window.saved=out;}};
  const content={JSON:{},module:mod,clozeInputs:[]};
  function setup(){content.clozeInputs=[...document.querySelectorAll('#e2 input')].map((el,i)=>{const item={JSON:{id:100+i,values:[{value:'1'}]},inputElement:wrap(el),correct:'false',helped:'false',last:null};el.addEventListener('change',()=>{mod.checkSingleClozeInput(item,content);storage.save();});return item;});}
  setup();window.widget={JSON:{},isEditor:${mode === 'editor'},contentWrapper:{0:document.getElementById('contentWrapper')},forEachContent(fn){fn(content);},findModule(n){return n==='cloze_text'?mod:n==='save_load'?storage:null;}};
  const exported=${JSON.stringify(exportedMethods).replace(/<\/script/gi,'<\\/script')};
  if(exported) for(const name of ['getConnectedValues','checkSingleClozeInput','loadUserInput','saveUserInput']) mod[name]=new Function('u','$','widget','helper','return ('+exported[name]+')')(mod,{trim:s=>s.trim()},window.widget,{compareSanitized:(a,b)=>a===b});
  if(${mode === 'no-api'}) delete window.widget.findModule;
  if(${mode === 'corrupt'}) document.getElementById('e1_text_input').value='foreign-data';
  if(${mode === 'late'}) setTimeout(()=>{document.getElementById('e2').innerHTML=Array.from({length:20},(_,i)=>'<input id="e2_cloze_text_input_'+(i+1)+'">').join('');setup();},100);
  document.addEventListener('input',e=>window.writes.push(e.target.id));
  document.getElementById('e1_text_input').addEventListener('change',()=>storage.save());
  window.install=html=>{document.getElementById('mount').innerHTML=html;};
  window.content=content;window.mod=mod;
  </script></body></html>`;
}
const server = http.createServer((req,res) => { res.setHeader('Content-Type','text/html;charset=utf-8'); res.end(req.url.startsWith('/standalone') ? '<div id="mount"></div>' : fixture(new URL(req.url, 'http://test').searchParams.get('mode') || 'normal')); });
let browser;
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r)); const base='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  async function init(mode='normal', where='inline', options={}) {
    await page.goto(base+(mode==='standalone'?'/standalone':'/?mode='+mode));
    if(where==='iframe') await page.evaluate(()=>{document.getElementById('mount').innerHTML='<iframe style="width:920px;height:640px"></iframe>';});
    const frame=where==='iframe'?page.frames()[1]:page.mainFrame();
    await frame.evaluate(()=>{const root=document.createElement('main');root.id='kitRoot';(document.getElementById('mount') || document.body).append(root);});
    await frame.evaluate(o=>window.bridgeOptions=o,options);
    await frame.addScriptTag({content:bridge+'\nwindow.testBridge=createEduloBridge({root:document.getElementById("kitRoot"),widgetId:"kit-test",fresh:()=>({answer:""}),validate:s=>!!s&&typeof s.answer==="string",attempts:8,retryMs:30,onStatus:s=>window.lastStatus=s,...window.bridgeOptions});'});
    return frame;
  }
  let f=await init('normal','iframe');let loaded=await f.evaluate(()=>testBridge.load());assert.equal(loaded.scores.length,20);assert(loaded.scores.every(s=>s==='gray'));assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.locator('#e2').isVisible(),false);assert.equal(await page.evaluate(()=>writes.length),0);
  assert.equal(await page.locator('#footerButtons').isVisible(),false);
  await f.evaluate(()=>testBridge.setFooterHidden(false));assert(await page.locator('#footerButtons').isVisible());assert.equal(await page.locator('#contentWrapper').evaluate(el=>el.style.bottom),'40px');
  await f.evaluate(()=>testBridge.setFooterHidden(true));assert.equal(await page.locator('#footerButtons').isVisible(),false);
  await page.locator('#footerButtons').evaluate(el=>{const replacement=el.cloneNode(true);replacement.hidden=false;replacement.style.display='';el.replaceWith(replacement);});
  await page.waitForFunction(()=>document.getElementById('footerButtons').hidden);assert.equal(await page.evaluate(()=>writes.length),0);
  await f.evaluate(()=>window.dispatchEvent(new Event('pagehide')));assert(await page.locator('#footerButtons').isVisible());
  await f.evaluate(()=>window.dispatchEvent(new Event('pageshow')));assert.equal(await page.locator('#footerButtons').isVisible(),false);
  await f.evaluate(()=>{const scores=Array(20).fill('gray');scores[0]='green';scores[2]='yellow';testBridge.save({answer:'äöü "Original"'},scores);});
  assert.deepEqual(await page.evaluate(()=>saved.counter),{total:20,correct:2,helped:1,wrong:0});assert.equal(await page.evaluate(()=>saved.input[2].id),102);
  const raw=await page.locator('#e1_text_input').inputValue();const decode=JSON.parse(Buffer.from(raw.slice('EDULO2:'.length),'base64').toString());assert.equal(decode.data.answer,'äöü "Original"');
  const before=await page.evaluate(()=>writes.length);await f.evaluate(()=>testBridge.load());assert.equal(await page.evaluate(()=>writes.length),before);
  await f.evaluate(()=>{const s=testBridge.getSnapshot();s.scores[2]='green';testBridge.save(s.data,s.scores);});assert.equal(await page.evaluate(()=>saved.input[2].h),'false');
  await f.evaluate(()=>{const s=testBridge.getSnapshot();s.scores[2]='gray';testBridge.save(s.data,s.scores);});assert.equal(await page.evaluate(()=>saved.input[2].v),'');
  await f.evaluate(()=>{const s=testBridge.getSnapshot();s.scores[19]='yellow';testBridge.save(s.data,s.scores);});assert.equal(await page.evaluate(()=>saved.input[19].h),'true');
  const rollbackRaw=await page.locator('#e1_text_input').inputValue(),rollbackWrites=await page.evaluate(()=>writes.length);
  await page.evaluate(()=>{window.realCheck=mod.checkSingleClozeInput;mod.checkSingleClozeInput=()=>false;});
  await assert.rejects(()=>f.evaluate(()=>{const s=testBridge.getSnapshot();s.scores[5]='green';testBridge.save(s.data,s.scores);}));
  assert.equal(await page.locator('#e1_text_input').inputValue(),rollbackRaw);assert.equal(await page.evaluate(()=>writes.length),rollbackWrites);assert.equal(await page.locator('#e2_cloze_text_input_6').inputValue(),'');
  await page.evaluate(()=>{mod.checkSingleClozeInput=window.realCheck;});
  await page.locator('#e1_text_input').evaluate(el=>el.value='external-reset');await assert.rejects(()=>f.evaluate(()=>testBridge.save({answer:'overwrite'},Array(20).fill('green'))));assert.equal(await page.locator('#e1_text_input').inputValue(),'external-reset');
  f=await init('editor');await f.evaluate(()=>testBridge.load());await assert.rejects(()=>f.evaluate(()=>testBridge.save({answer:'x'},Array(20).fill('green'))));assert.equal(await page.evaluate(()=>writes.length),0);assert(await page.locator('#e1').isVisible());
  for(const mode of ['corrupt','missing','no-api']) {f=await init(mode);await assert.rejects(()=>f.evaluate(()=>testBridge.load()));assert.equal(await page.evaluate(()=>writes.length),0);}
  f=await init('late');await f.evaluate(()=>testBridge.load());assert.equal(await page.evaluate(()=>writes.length),0);
  f=await init('normal','inline',{hideFooter:false});await f.evaluate(()=>testBridge.load());assert(await page.locator('#footerButtons').isVisible());
  f=await init();await page.evaluate(()=>{window.delayedFooter=document.getElementById('footerButtons');delayedFooter.remove();});await f.evaluate(()=>testBridge.load());assert((await f.evaluate(()=>testBridge.getStatus())).ready);
  await page.evaluate(()=>document.body.append(delayedFooter));await page.waitForFunction(()=>document.getElementById('footerButtons').hidden);
  await f.evaluate(()=>testBridge.dispose());assert(await page.locator('#footerButtons').isVisible());assert.equal(await page.evaluate(()=>writes.length),0);
  f=await init('foreign-container');await f.evaluate(()=>testBridge.load());assert(await page.locator('#unrelated').isVisible());assert.equal(await page.locator('#e1_text_input').isVisible(),false);await page.locator('#kitRoot').evaluate(el=>el.remove());await page.waitForTimeout(30);assert(await page.locator('#e1_text_input').isVisible());
  f=await init('standalone');await f.evaluate(()=>testBridge.load());await f.evaluate(()=>testBridge.save({answer:'offline'},Array(20).fill('gray')));assert.equal((await f.evaluate(()=>testBridge.load())).data.answer,'offline');
  // Template: real 920px width and host viewport; no dependency on a full-page root.
  await page.goto(base+'/?mode=normal');await page.evaluate(html=>{const mount=document.getElementById('mount');mount.style.width='920px';mount.innerHTML=html;for(const old of [...mount.querySelectorAll('script')]){const script=document.createElement('script');script.textContent=old.textContent;old.replaceWith(script);}},built);
  await page.waitForFunction(()=>!document.querySelector('[data-controls]').disabled);assert((await page.locator('.edulo-widget').boundingBox()).width<=920);await page.locator('[data-answer]').fill('5');await page.locator('[data-check]').click();assert.equal(await page.evaluate(()=>saved.input[0].c),'true');
  // Built template includes footer management and uses the extra space.
  assert.equal(await page.locator('#footerButtons').isVisible(),false);
  assert((await page.locator('.edulo-widget').boundingBox()).height>640);
  await page.setViewportSize({width:390,height:844});await page.locator('#mount').evaluate(el=>el.style.width='100%');assert((await page.locator('.edulo-widget').boundingBox()).width<=390);assert.equal(await page.locator('.edulo-widget').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
  await page.setViewportSize({width:1024,height:768});await page.goto(base+'/?mode=normal');
  await page.evaluate(html=>{const mount=document.getElementById('mount');mount.innerHTML=html;for(const old of [...mount.querySelectorAll('script')]){const script=document.createElement('script');script.textContent=old.textContent;old.replaceWith(script);}},footerHtml);
  await page.waitForFunction(()=>!document.querySelector('[data-toggle]').disabled);await page.locator('[data-toggle]').click();await page.waitForFunction(()=>!document.querySelector('[data-toggle]').disabled);
  assert.match(await page.locator('[data-result]').textContent(),/40 px mehr/);assert.equal(await page.locator('#footerButtons').isVisible(),false);assert.equal(await page.locator('#e1').isVisible(),false);assert.equal(await page.evaluate(()=>writes.length),0);
  if(process.env.FOOTER_SCREENSHOT) await page.screenshot({path:process.env.FOOTER_SCREENSHOT});
  await page.locator('[data-toggle]').click();assert(await page.locator('#footerButtons').isVisible());
  await page.locator('.edulo-footer-probe').evaluate(el=>el.remove());await page.waitForTimeout(30);assert(await page.locator('#e1').isVisible());
  assert.deepEqual(errors,[]);console.log('PASS: 20-field contract, native events, color transitions, readonly load, late DOM, E1 protection, editor, missing API, safe hiding/cleanup, standalone, generator/build, responsive template, footer gain/restore, parameters.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();if(path.dirname(temp)!==kit || !path.basename(temp).startsWith('.test-')) throw Error('Unexpected cleanup path');fs.rmSync(temp,{recursive:true,force:true});});
