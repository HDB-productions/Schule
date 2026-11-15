function initFallWorksheet(root){
 'use strict';
 if(root.dataset.fallWorksheet)return;
 root.dataset.fallWorksheet='1';
 const times=['0','0,05','0,10','0,15','0,20','0,25','0,30','0,35'];
 const sheets=[];
 function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
 function number(value){const text=value.trim().replace(',','.');return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)?Number(text):NaN;}
 const graph=root.querySelector('[data-measurement-graph]');
 function draw(values){
  if(!graph)return;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 600 400');svg.setAttribute('role','img');svg.setAttribute('aria-label','Höhen-Zeit-Diagramm deiner eingegebenen Messwerte.');svg.classList.add('fall-graph');
  function shape(tag,attrs,text){const n=document.createElementNS(ns,tag);for(const [key,val] of Object.entries(attrs))n.setAttribute(key,String(val));if(text!==undefined)n.textContent=text;svg.append(n);return n;}
  const x=t=>64+t/.35*508,y=h=>346-h/1.4*308;
  for(let i=0;i<=7;i++){
   const h=i*.2,yy=y(h);shape('line',{x1:64,y1:yy,x2:572,y2:yy,class:'fall-grid'});
   shape('text',{x:53,y:yy+5,'text-anchor':'end'},h.toLocaleString('de-DE',{maximumFractionDigits:1}));
  }
  times.forEach((t,i)=>{const xx=x(i*.05);shape('line',{x1:xx,y1:38,x2:xx,y2:346,class:'fall-grid'});shape('text',{x:xx,y:369,'text-anchor':'middle'},t);});
  shape('path',{d:'M64 24V346H584',class:'fall-axis'});
  shape('text',{x:15,y:20},'h / m');shape('text',{x:574,y:395,'text-anchor':'end'},'t / s');
  let run=[];const runs=[];
  values.forEach((v,i)=>{const h=number(v);if(Number.isFinite(h)&&h>=0&&h<=1.5){run.push([x(i*.05),y(h)]);}else if(run.length){runs.push(run);run=[];}});if(run.length)runs.push(run);
  for(const points of runs){if(points.length>1)shape('polyline',{points:points.map(p=>p.join(',')).join(' '),class:'fall-measurement-line'});for(const [cx,cy] of points)shape('circle',{cx,cy,r:5,class:'fall-measurement-point'});}
  graph.replaceChildren(svg);
 }
 function heights(){return sheets.find(s=>s.backing.dataset.answer==='messung')?.read().hoehen_m||Array(8).fill('');}
 function install(id,columns,count){
  const backing=root.querySelector('textarea[data-answer="'+id+'"]');if(!backing)return;
  const question=backing.closest('.question');if(!question)return;
  backing.hidden=true;backing.classList.add('fall-backing');
  for(const label of question.querySelectorAll('label'))if(label.htmlFor===backing.id)label.hidden=true;
  const counter=question.querySelector('[data-count="'+id+'"]');if(counter)counter.hidden=true;
  const box=el('div',undefined,'fall-worksheet'),table=el('table',undefined,'fall-table'),head=el('thead'),headRow=el('tr'),body=el('tbody');
  const labels=[id==='messung'?'t / s':'Zeitabschnitt / s',...columns.map(c=>c.label)];
  for(const text of labels){const th=el('th',text);th.scope='col';headRow.append(th);}head.append(headRow);table.append(head,body);
  const fields=columns.map(()=>[]);
  for(let i=0;i<count;i++){
   const row=el('tr'),time=id==='messung'?times[i]:times[i]+' – '+times[i+1],th=el('th',time);th.scope='row';row.append(th);
   columns.forEach((column,j)=>{const td=el('td'),input=el('input');input.type='text';input.inputMode='decimal';input.autocomplete='off';input.maxLength=16;input.setAttribute('aria-label',column.label+' bei '+time+' Sekunden');input.dataset.fallCell=column.key;input.dataset.row=String(i);fields[j].push(input);td.append(input);row.append(td);});body.append(row);
  }
  const explanationLabel=el('label','Deine Erläuterung', 'fall-explanation-label'),explanation=el('textarea');explanation.rows=3;explanation.maxLength=1300;explanation.placeholder='Beschreibe deine Beobachtungen und deinen Rechenweg …';explanationLabel.append(explanation);
  box.append(table,explanationLabel);backing.before(box);
  let last;
  const controls=[...fields.flat(),explanation];
  function read(){const data={};columns.forEach((c,j)=>data[c.key]=fields[j].map(n=>n.value));if(id==='geschwindigkeit')data.hoehen_m=heights();data.erlaeuterung=explanation.value;return data;}
  function disabled(){const locked=backing.disabled||backing.readOnly||backing.matches(':disabled');controls.forEach(n=>n.disabled=locked);return locked;}
  function sync(){
   disabled();if(last===backing.value)return;
   last=backing.value;let data;try{data=JSON.parse(last);}catch{data={erlaeuterung:last};}
   if(!data||typeof data!=='object')data={};
   columns.forEach((c,j)=>fields[j].forEach((n,i)=>{const v=Array.isArray(data[c.key])&&typeof data[c.key][i]==='string'?data[c.key][i]:'';if(n.value!==v)n.value=v;}));
   const text=typeof data.erlaeuterung==='string'?data.erlaeuterung:'';if(explanation.value!==text)explanation.value=text;
   if(id==='messung')draw(fields[0].map(n=>n.value));
  }
  function save(){
   let serialized=JSON.stringify(read());
   while(serialized.length>2000&&explanation.value.length){explanation.value=explanation.value.slice(0,-1);serialized=JSON.stringify(read());}
   if(serialized.length>2000)return;
   backing.value=serialized;last=serialized;backing.dispatchEvent(new Event('input',{bubbles:true}));
   if(id==='messung'){draw(fields[0].map(n=>n.value));const next=sheets.find(s=>s.backing.dataset.answer==='geschwindigkeit');if(next&&!next.disabled())next.save();}
  }
  box.addEventListener('input',event=>{
   if(!controls.includes(event.target))return;if(disabled()){last=undefined;sync();return;}
   save();
  });
  backing.addEventListener('input',sync);backing.addEventListener('change',sync);sheets.push({sync,backing,read,save,disabled});sync();
 }
 install('messung',[{key:'hoehen_m',label:'Höhe h / m'}],8);
 install('geschwindigkeit',[{key:'strecken_m',label:'Fallstrecke Δs / m'},{key:'geschwindigkeiten_ms',label:'Durchschnitt v̄ / (m/s)'}],7);
 if(!sheets.some(s=>s.backing.dataset.answer==='messung'))draw([]);
 const observer=new MutationObserver(()=>sheets.forEach(s=>s.sync()));observer.observe(root,{attributes:true,subtree:true,attributeFilter:['disabled','readonly']});
 const timer=setInterval(()=>{if(!root.isConnected){clearInterval(timer);observer.disconnect();return;}sheets.forEach(s=>s.sync());},500);
}
