// The story must present observation before interpretation at every energy gap.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const dir=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(dir,'widget.html'),'utf8');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:920,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('[data-navigate=cloze]:visible').click();await page.locator('[data-cloze="0"]').waitFor();
 assert.deepEqual(await page.locator('.rocket-story h4').allTextContents(),['Energie aus der Nahrung','Pumpen','Start','Aufstieg','Fallen']);assert.equal(await page.locator('.model-details').count(),0);
 const text=await page.locator('.rocket-story').evaluate(el=>{const c=el.cloneNode(true);c.querySelectorAll('select').forEach((s,i)=>s.replaceWith('[[GAP'+i+']]'));c.querySelectorAll('.rocket-sr,.rocket-cloze-help,h4').forEach(e=>e.remove());return c.textContent;});
 assert(text.startsWith('Über die Nahrung nimmt der Mensch Energie auf. Ein Teil ist in seinen Muskeln als [[GAP0]] gespeichert.'));
 const answers=['chemische Energie','kinetische Energie','thermische Energie','kinetische Energie','Lageenergie','kinetische Energie'];
 const observations=['Über die Nahrung','Beim Pumpen','drückt die Pumpe zusätzliche Luft','löst sich der Korken','steigt sie immer höher und wird dabei jedoch immer langsamer','fällt nach unten und wird dabei immer schneller'];
 const conversions=['als','wandeln die Muskeln','Dabei wandelt die Pumpe','Dabei wird die Rakete','Während die Rakete steigt','Beim Fallen wird'];
 let previous=0;
 for(let i=0;i<6;i++){
  const gap=text.indexOf('[[GAP'+i+']]');assert(gap>previous);const before=text.slice(previous,gap);
  assert(before.indexOf(observations[i])>=0,'observation before gap '+i);assert(before.indexOf(conversions[i])>before.indexOf(observations[i]),'observation precedes conversion explanation '+i);
  assert(!before.includes(answers[i]),'new target form not given away before gap '+i);
  const options=await page.locator('[data-cloze="'+i+'"]').locator('option').evaluateAll(nodes=>nodes.slice(1).map(e=>e.value));assert.equal(options.length,9);assert(options.includes(answers[i]));
  previous=gap+('[[GAP'+i+']]').length;
 }
 assert(!text.slice(text.indexOf('Durch die Bewegung'),text.indexOf('[[GAP2]]')).includes('kinetische Energie'));assert(!text.includes('Der bewegte Griff'));
 assert(!/chemische Energie|kinetische Energie|thermische Energie|Lageenergie/.test(text),'no solution names in narrative');
 assert(!text.includes('Auch nachdem kein Wasser mehr ausströmt'));assert(text.includes('Während die Rakete steigt, wird also ein Teil ihrer Energie'));
 assert(!/erzeug|die wir hier|Unterrichtsmodell/.test(text));
 assert(text.includes('der Druck dort steigt'));assert(text.includes('nimmt diese Energie in der Flasche insgesamt zu'));
 await page.locator('.rocket-story').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'artifacts','cloze-observe-first.png')});
 await page.locator('.rocket-story').screenshot({path:path.join(__dirname,'artifacts','story-sections-920.png')});await page.setViewportSize({width:390,height:844});await page.locator('.rocket-story').screenshot({path:path.join(__dirname,'artifacts','story-sections-390.png')});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no mobile document overflow');
 for(let i=0;i<6;i++)await page.locator('[data-cloze="'+i+'"]').selectOption(answers[i]);await page.locator('[data-check="cloze"]').click();assert.match(await page.locator('.rocket-feedback').first().textContent(),/Alles richtig/);assert.deepEqual(errors,[]);
 console.log('PASS: accepted opening, all 6 gaps observation before explanation, no premature target form, all 9 options retained, all answers score correctly.');
 }finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
