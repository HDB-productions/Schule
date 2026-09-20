const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const tasks=require('../dynamot-aufgaben.js'),raw=fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8');
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(raw);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({hasTouch:true});
 await page.goto('http://127.0.0.1:'+server.address().port);const touch=await page.context().newCDPSession(page);
 for(const size of [{width:1024,height:668},{width:1180,height:720}])for(const ex of tasks.experiments){
  await page.setViewportSize(size);
  await page.evaluate(ex=>{
   window.paletteTest?.destroy();const root=document.querySelector('#energyLab');root.dataset.learningStep='diagram';
   const learn=root.querySelector('.learn');learn.innerHTML='<select class="learn-picker" aria-label="Versuch"><option>'+ex.title+'</option></select><div class="learn-body"><div class="learn-current"><div class="learn-diagram"></div><button data-check-diagram>Diagramm prüfen</button></div></div>';
   window.paletteTest=DynamotDiagram.mount(learn.querySelector('.learn-diagram'),{stage:'legacy',length:ex.chain.length,devices:[...new Set(ex.chain.filter((_,i)=>i%2))]});learn.scrollTop=0;
  },ex);
  async function drag(label,target){const a=await page.locator('[data-label="'+label+'"]').boundingBox(),b=await page.locator(target).boundingBox();assert(a&&b);const x=a.x+a.width/2,y=a.y+a.height/2,tx=b.x+b.width/2,ty=b.y+b.height/2;await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0}]});for(let n=1;n<=8;n++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(tx-x)*n/8,y:y+(ty-y)*n/8,id:0}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  for(const [i,label] of ex.chain.entries())await drag(label,'[data-socket="'+i+'"]');await drag('thermische Energie','[data-branch-socket="1"]');
  assert.deepEqual(await page.evaluate(()=>paletteTest.getValue().main.map(x=>x?.label)),ex.chain);
  const layout=await page.evaluate(()=>{const pane=document.querySelector('.learn'),r=pane.getBoundingClientRect(),p=document.querySelector('.de-palette').getBoundingClientRect(),chain=document.querySelector('.de-chain'),c=chain.getBoundingClientRect(),check=document.querySelector('[data-check-diagram]').getBoundingClientRect(),buttons=[...document.querySelectorAll('.de-palette button')];return {scroll:pane.scrollTop,fit:p.top>=r.top&&check.bottom<=r.bottom&&c.top>=p.bottom,overflow:chain.scrollWidth>chain.clientWidth+1,touch:buttons.every(b=>b.offsetHeight>=44&&b.offsetWidth>=44),uncovered:buttons.every(b=>{const x=b.getBoundingClientRect();return b.contains(document.elementFromPoint(x.x+x.width/2,x.y+x.height/2));}),details:document.querySelectorAll('.de-palette details').length};});
  assert.deepEqual(layout,{scroll:0,fit:true,overflow:false,touch:true,uncovered:true,details:0},ex.id+' '+size.width);
  assert(await page.evaluate(()=>[...document.querySelectorAll('.slot-target')].filter(b=>!b.hidden).every(b=>{const r=b.getBoundingClientRect();return b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})), 'all empty slots independently tappable');
  await page.screenshot({path:path.join(__dirname,`dynamot-palette-${ex.id}-${size.width}.png`)});
 }
 console.log('All four diagrams at 1024x668 and 1180x720: permanent palette, true touch drag, thermal branch, 44px targets, no overlaps or scrolling passed.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
