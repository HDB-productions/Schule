// Source-level real-browser visual invariants, independent of the widget task flow.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const D=require('./domain.js'),R=require('./operate-domain.js'),pool=[1,2].flatMap(level=>D.tasks('operate',level));
let browser;
(async()=>{
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});const page=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const css=fs.readFileSync(path.join(__dirname,'style.css'),'utf8');
 await page.setContent(`<meta http-equiv="Content-Security-Policy" content="img-src 'none'"><style>${css}#fixture{display:flex;gap:20px;align-items:start}</style><main class="fraction-workshop"><div id="fixture"></div></main>`);
 await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'visuals.js'),'utf8')+';window.V=FractionVisuals;'});
 const canonical=pool.find(task=>task.n===1&&task.d===4&&task.bn===7&&task.bd===12&&task.op==='+');assert(canonical,'1/4 + 7/12 is a canonical task');
 const cases=pool.flatMap(task=>[R.minimum(task),String(D.lcm(task.d,task.bd)*2),String(BigInt(D.lcm(task.d,task.bd))*1000000000000000000n)].map(common=>({task,common,values:R.values(task,common)})));
 const results=await page.evaluate(cases=>{
  const fixture=document.querySelector('#fixture'),gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
  function geometry(model){return [...model.querySelectorAll('.fraction-grid-whole')].map(whole=>{const box=whole.getBoundingClientRect(),style=getComputedStyle(whole),left=box.left+parseFloat(style.borderLeftWidth),top=box.top+parseFloat(style.borderTopWidth),width=box.width-parseFloat(style.borderLeftWidth)-parseFloat(style.borderRightWidth),height=box.height-parseFloat(style.borderTopWidth)-parseFloat(style.borderBottomWidth);
   const cells=[...whole.querySelectorAll('.fraction-grid-cell[data-filled="1"],.fraction-grid-fill')].map(cell=>{const r=cell.getBoundingClientRect();return {x:(r.left-left)/width,y:(r.top-top)/height,w:r.width/width,h:r.height/height};});
   return {columns:Number(style.getPropertyValue('--fraction-columns')),rows:Number(style.getPropertyValue('--fraction-rows')),denominator:whole.dataset.denominator,filled:whole.dataset.filled,cells};
  });}
  const filled=(whole,x,y)=>whole.cells.some(cell=>x>=cell.x&&x<cell.x+cell.w&&y>=cell.y&&y<cell.y+cell.h);
  function signature(whole){let value='';for(let y=0;y<59;y++)for(let x=0;x<61;x++)value+=filled(whole,(x+.371)/61,(y+.613)/59)?'1':'0';return value;}
  return cases.map(({task,common,values})=>{
   const planColumns=V.columns(gcd(task.d,task.bd));
   fixture.innerHTML=V.image({n:task.n,d:task.d,planColumns})+V.image({n:task.bn,d:task.bd,planColumns})+V.image({n:values.left,d:common,planColumns})+V.image({n:values.right,d:common,planColumns});
   const models=[...fixture.children].map(geometry),mismatches=[];
   for(let side=0;side<2;side++){if(models[side].length!==models[side+2].length)mismatches.push('whole count');else for(let whole=0;whole<models[side].length;whole++)if(signature(models[side][whole])!==signature(models[side+2][whole]))mismatches.push(`side${side}/whole${whole}`);}
   const area=models.slice(2).flatMap(model=>model.map(whole=>({actual:whole.cells.reduce((sum,cell)=>sum+cell.w*cell.h,0),expected:Number(BigInt(whole.filled)*100000000n/BigInt(whole.denominator))/100000000})));
   const example=task.n===1&&task.d===4&&task.bn===7&&task.bd===12&&common==='12'?{source:models[0][0],left:models[2][0],right:models[3][0],points:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y])=>filled(models[2][0],x,y))}:null;
   return {id:task.id,common,mismatches,area,convertedGrid:models.slice(2).map(model=>model.map(whole=>[whole.columns,whole.rows])),example};
  });
 },cases);
 for(const result of results){assert.deepEqual(result.mismatches,[],`${result.id} N=${result.common}: colored shape and position must stay unchanged`);assert.deepEqual(result.convertedGrid[0],result.convertedGrid[1],`${result.id}: both converted fractions share the same grid`);for(const area of result.area)assert(Math.abs(area.actual-area.expected)<.002,`${result.id}: colored area equals fraction`);}
 // Explicit, independent spatial expectation: the quarter remains top left.
 const example=results.find(result=>result.example)?.example;assert(example);assert.deepEqual(example.points,[true,false,false,false]);assert.deepEqual([example.source.columns,example.source.rows],[2,2]);assert.deepEqual([example.left.columns,example.left.rows],[2,6]);assert.deepEqual([example.right.columns,example.right.rows],[2,6]);
 assert.deepEqual(errors,[]);console.log(`PASS: ${results.length} source/converted shape comparisons across all${pool.length} canonical tasks, minimal and doubled common denominators, huge BigInt denominators, identical converted grids and the top-left1/4->3/12 example. Local real browser only.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();});
