const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/danie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const raw=fs.readFileSync(path.join(__dirname,'widget.html'),'utf8'),html=raw.replace('/* TEST_HOOK */','window.layoutTest={bracketHelp,seed(text){state=E.fresh();state.tasks=[E.makeTask(text)];state.nextId=2;E.requestHelp(state.tasks[0]);E.requestHelp(state.tasks[0]);showFeedback();render();persist();}};');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html)});let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({channel:'msedge',headless:true,args:['--no-proxy-server']});
 const page=await browser.newPage({viewport:{width:920,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});await page.locator('[data-exercise]').waitFor();
 const source='1(x+5)-5x-13 = -3x-x+4-11';await page.evaluate(s=>layoutTest.seed(s),source);
 assert.deepEqual(await page.locator('[data-work] mark').allTextContents(),['1','x','5']);assert.equal(await page.locator('[data-work] [data-column=right] mark').count(),0);
 for(const role of ['a','b','c']){const term=await page.locator('[data-work] mark.role-'+role).evaluate(el=>getComputedStyle(el).backgroundColor),rule=await page.locator('[data-help-visual] mark.role-'+role).first().evaluate(el=>getComputedStyle(el).backgroundColor);assert.equal(term,rule);}
 for(const [eq,expected,rule] of [['2(x-5)+3(x+1)=3x+2',['2','x','5'],'a · (b − c) → a · b − a · c'],['-2(x+5)=3x+2',['-2','x','5'],'a · (b + c) → a · b + a · c'],['(x-5):(-2)+7=x',['x','5','(-2)'],'(a − b) : c → a : c − b : c'],['((x+5)/2)+7=x',['x','5','2'],'(a + b) : c → a : c + b : c'],['-(x-5)+3x=7',['x','5'],'−(a − b) → −a + b'],['2(3(x+5)+1)=x+2',['3','x','5'],'a · (b + c) → a · b + a · c']]){
   await page.evaluate(s=>layoutTest.seed(s),eq);assert.deepEqual(await page.locator('[data-work] mark').allTextContents(),expected,eq);assert.equal(await page.locator('[data-help-visual]').innerText(),rule,eq);
 }
 const wanted=[['7','8','9','+','−','x','⌫','Entf'],['4','5','6','·',':','ℝ','←','→'],['1','2','3','(',')','','↤','↦'],['0',',','','','','','','']];
 for(let r=1;r<=4;r++)assert.deepEqual(await page.locator('.key-grid [data-row="'+r+'"]').allTextContents(),wanted[r-1]);
 assert.equal(await page.locator('[data-key="/"]').count(),0);
 for(const [a,b] of [['·','('],[':',')'],['1','0'],['2',',']]){const top=await page.locator('[data-key="'+a+'"]').boundingBox(),below=await page.locator('[data-key="'+b+'"]').boundingBox();assert.equal(top.x,below.x);assert.ok(below.y>top.y);}
 const colors=await page.locator('.key-grid').evaluate(el=>['number','op','symbol','nav'].map(c=>getComputedStyle(el.querySelector('.'+c)).backgroundColor));assert.equal(new Set(colors).size,4);
 for(const [width,height] of [[920,768],[390,844],[320,740]]){
   await page.setViewportSize({width,height});await page.evaluate(s=>layoutTest.seed(s),source);await page.locator('.edulo-work').evaluate(el=>el.scrollTop=0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.ok(await page.locator('.key-grid button').evaluateAll(es=>es.every(el=>{const r=el.getBoundingClientRect();return r.height>=44&&r.width>=44})));
   await page.screenshot({path:path.join(__dirname,'layout-'+width+'.png'),fullPage:true});
   if(width<400){await page.locator('.key-grid-wrap').evaluate(el=>el.scrollLeft=el.scrollWidth);const last=await page.locator('[data-key=end]').boundingBox(),wrap=await page.locator('.key-grid-wrap').boundingBox();assert.ok(last.x+last.width<=wrap.x+wrap.width+1);}
 }
 assert.deepEqual(errors,[]);console.log('PASS matching role colors; bracket keys below multiply/divide, 0/comma below number block; four palettes; 44px targets; 920/390/320px without page overflow');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
