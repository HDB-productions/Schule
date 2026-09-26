const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const M=require('./domain.js'),legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'legacy.fixture.json'),'utf8'));
let savedRaw='EDULO2:'+Buffer.from(JSON.stringify({widget:'bewegungstrainer',version:1,data:legacy,scores:M.scoreColors(legacy)})).toString('base64');
const original=savedRaw,root=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8').match(/<main class="edulo-widget"[\s\S]*<\/main>/)[0];
function html(){return `<!doctype html><html><meta charset="utf-8"><body><div id="contentWrapper" style="position:absolute;top:0;bottom:40px;left:0;right:0"><div id="e1"><textarea id="e1_text_input"></textarea></div><div id="e2">${Array.from({length:20},(_,i)=>`<input id="e2_cloze_text_input_${i+1}">`).join('')}</div><script>
window.writes=[];window.saves=0;
const wrap=el=>({0:el,val(v){if(arguments.length){el.value=v;return this;}return el.value;}});
const mod={name:'cloze_text',loadUserInput(c,rows){for(const row of rows)for(const item of c.clozeInputs)if(item.JSON.id===row.id){item.inputElement.val(row.v);item.last=row.l||null;item.correct=row.c;item.helped=row.h;}},checkSingleClozeInput(item){const ok=item.inputElement.val().trim()==='1';item.correct=ok?'true':'false';return ok;},saveUserInput(c,out){for(const item of c.clozeInputs){out.input.push({id:item.JSON.id,v:item.inputElement.val(),l:item.last||'',c:item.correct,h:item.helped});out.counter.total++;if(item.correct==='true')out.counter.correct++;else if(item.inputElement.val()!=='')out.counter.wrong++;if(item.correct==='true'&&item.helped==='true')out.counter.helped++;}}};
const storage={JSON:{active:'true'},save(){window.saves++;}};
const content={JSON:{},module:mod,clozeInputs:[]};
content.clozeInputs=[...document.querySelectorAll('#e2 input')].map((el,i)=>{const item={JSON:{id:100+i,values:[{value:'1'}]},inputElement:wrap(el),correct:'false',helped:'false',last:null};el.addEventListener('change',()=>{mod.checkSingleClozeInput(item,content);storage.save();});return item;});
window.widget={JSON:{},isEditor:false,contentWrapper:{0:document.getElementById('contentWrapper')},forEachContent(fn){fn(content);},findModule(n){return n==='cloze_text'?mod:n==='save_load'?storage:null;}};
window.content=content;document.getElementById('e1_text_input').value=${JSON.stringify(savedRaw)};
document.addEventListener('input',e=>window.writes.push(e.target.id));document.getElementById('e1_text_input').addEventListener('change',()=>storage.save());
</script>${root}</div><div id="footerButtons" style="position:absolute;bottom:0;height:40px"><button>Überprüfen</button><button>Lösungen</button></div></body></html>`;}
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html());});
const decode=raw=>JSON.parse(Buffer.from(raw.slice(7),'base64').toString('utf8'));
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForSelector('[data-controls]:enabled');
 assert.equal(await page.locator('#e1_text_input').inputValue(),original);assert.equal(await page.evaluate(()=>window.writes.length),0);assert.equal(await page.locator('#footerButtons').isVisible(),false);assert.equal(await page.evaluate(()=>localStorage.length),0);
 await page.locator('[data-help]').click();savedRaw=await page.locator('#e1_text_input').inputValue();let stored=decode(savedRaw);assert.equal(stored.data.schema,3);assert.equal(stored.data.steps[2].hint,2);assert.equal(stored.data.steps[2].input,legacy.steps[2].input);assert.deepEqual(stored.scores.slice(0,3),['green','green','gray']);
 await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-prefix]').textContent(),'s(t) =');assert.equal(await page.locator('[data-hints] > p').count(),2);
 const keypad=page.locator('[data-keypad]');const press=k=>keypad.getByRole('button',{name:k,exact:true}).click();
 for(let n=0;n<legacy.steps[2].input.length;n++)await press('Cursor nach rechts');for(let n=0;n<legacy.steps[2].input.length;n++)await press('Zeichen links vom Cursor löschen');
 for(const k of M.canonicalAnswer(legacy.task,2).replace(/\s/g,'').match(/km\/h|km|[0-9t,.:+−·/()]/g))await press(k);
 await page.locator('[data-check]').click();savedRaw=await page.locator('#e1_text_input').inputValue();stored=decode(savedRaw);assert.deepEqual(stored.scores.slice(0,4),['green','green','yellow','gray']);
 let rows=await page.evaluate(()=>window.content.clozeInputs.map(x=>({v:x.inputElement.val(),helped:x.helped,correct:x.correct})));assert.equal(rows[0].v,'1');assert.equal(rows[0].helped,'false');assert.equal(rows[2].v,'1');assert.equal(rows[2].helped,'true');
 for(let n=0;n<4;n++)await page.locator('[data-check]').click();savedRaw=await page.locator('#e1_text_input').inputValue();stored=decode(savedRaw);assert.equal(stored.data.steps[3].revealed,true);assert.equal(stored.data.total,3);assert.equal(stored.scores[3],'gray');
 await page.reload();await page.waitForSelector('[data-controls]:enabled');assert.equal(await page.locator('[data-results] .result-row').count(),4);assert.equal(await page.locator('[data-results] .revealed').count(),1);assert.equal(await page.evaluate(()=>localStorage.length),0);assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: simulated Edulo E1 legacy upgrade read-only load, E2 green/yellow flags, reveal without point, reload from E1, footer hidden, no localStorage fallback.');
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
