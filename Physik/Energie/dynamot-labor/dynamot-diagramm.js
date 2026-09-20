/* Connected energy-flow editor with pointer dragging and equivalent tap/keyboard moves. */
(function(root){
 'use strict';
 const groups={
  'Mechanische Energieformen':['kinetische Energie','Lageenergie','elastische Energie'],
  'Innere Energieformen':['thermische Energie','chemische Energie','Kernenergie'],
  'Elektromagnetische Energieformen':['Licht','elektrische Energie','magnetische Energie']
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone=s=>JSON.parse(JSON.stringify(s));
 function mount(host,{stage='basic',length=5,devices=['DynaMot','Lampe'],value,onChange=()=>{},readonly=false}={}){
  if(stage==='losses')return mountLosses(host,{length,value,onChange,readonly});
  if(!['basic','legacy'].includes(stage))throw Error('Unbekannter Diagrammschritt');
  const legacy=stage==='legacy';
  let data={main:Array(length).fill(null),branches:[]},selected=null,pointer=null,suppressClick=false,ghost=null,hover=null,timer=null;
  if(value&&Array.isArray(value.main)&&value.main.length===length){data=clone(value);data.branches=Array.isArray(data.branches)?data.branches:[];}
  function token(t,extra=''){return `<span class="de-token ${t.kind==='energy'?'de-arrow':'de-box'}" ${extra}>${esc(t.label)}</span>`;}
  function cleanBranches(){data.branches=data.branches.filter((b,i,all)=>data.main[b.from]?.kind==='device'&&all.findIndex(x=>x.from===b.from)===i);}
  function change(){if(legacy)cleanBranches();selected=null;render();onChange(clone(data));}
  function put(target,item=selected){
   if(!item)return false;
   if(target.kind==='branch'){
    if(!legacy)return false;
    if(item.token.kind!=='energy'||item.token.label!=='thermische Energie'||data.main[target.index]?.kind!=='device')return false;
    if(item.source==='main')data.main[item.index]=null;
    if(item.source==='branch')data.branches=data.branches.filter(b=>b.from!==item.index);
    data.branches=data.branches.filter(b=>b.from!==target.index);
    data.branches.push({from:target.index,energy:'thermische Energie'});
   }else{
    if(item.source==='main'){
     if(item.index===target.index){selected=null;render();return false;}
     const displaced=data.main[target.index];data.main[target.index]=clone(item.token);data.main[item.index]=displaced;
     if(legacy)data.branches=data.branches.map(b=>({...b,from:b.from===item.index?target.index:b.from===target.index?item.index:b.from}));
    }else{
     if(legacy&&item.source==='branch')data.branches=data.branches.filter(b=>b.from!==item.index);
     data.main[target.index]=clone(item.token);if(legacy)data.branches=data.branches.filter(b=>b.from!==target.index);
    }
   }
   change();return true;
  }
  function render(){
   const scroll=host.querySelector('.de-chain')?.scrollLeft||0;
   host.classList.add('de-editor');host.dataset.diagramStage=stage;host.classList.toggle('de-readonly',readonly);host.classList.toggle('de-has-selection',!!selected);
   host.innerHTML=`${readonly?'':`<p class="de-help">${legacy?'Ziehe Pfeile und Energiewandler in die Kette. Wärme: einen thermischen Pfeil an den Ausgang eines Kastens ziehen.':'Ordne die Energiepfeile und Wandler von links nach rechts. Wärmeverluste kommen erst im nächsten Schritt.'}</p><div class="de-palette">${[...Object.entries(groups),['Energiewandler',devices]].map(([title,labels])=>`<section class="de-category"><h4>${title}</h4><div>${labels.map(label=>{const kind=title==='Energiewandler'?'device':'energy';return `<button type="button" data-kind="${kind}" data-label="${esc(label)}" aria-pressed="${selected?.source==='palette'&&selected?.token.label===label}">${token({kind,label})}</button>`;}).join('')}</div></section>`).join('')}</div><p class="de-selection" role="status" aria-live="polite">${selected?'Gewählt: '+esc(selected.token.label)+' · Ziel antippen oder mit Escape abbrechen.':'Pfeile zeigen den Energiefluss von links nach rechts.'}</p>`}
    <div class="de-chain" style="--de-count:${length}" aria-label="Energiefluss von links nach rechts">${data.main.map((t,i)=>{
     const branch=data.branches.find(b=>b.from===i),device=t?.kind==='device',chosen=selected?.source==='main'&&selected.index===i;
     return `<div class="de-cell ${device?'de-device-cell':''}"><${readonly?'div':'button type="button"'} class="de-socket ${t?'de-filled':'de-vacant'} ${chosen?'de-chosen':''}" data-socket="${i}" ${t?`data-source-main="${i}"`:''} aria-label="Platz ${i+1}${t?': '+esc(t.label)+'. Zum Verschieben wählen.':': leer'}" ${readonly?'':`aria-pressed="${chosen}"`}>${t?token(t):`<span class="de-empty">${i+1}<small>Ablegen</small></span>`}</${readonly?'div':'button'}>${!readonly&&t?`<button type="button" class="de-clear" data-clear="${i}" aria-label="${esc(t.label)} an Platz ${i+1} entfernen">×</button>`:''}
      ${legacy&&device&&(branch||!readonly)?`<div class="de-branch ${branch?'de-branch-filled':'de-branch-empty'}"><span class="de-connector" aria-hidden="true"></span><${readonly?'div':'button type="button"'} class="de-branch-socket ${selected?.source==='branch'&&selected.index===i?'de-chosen':''}" data-branch-socket="${i}" ${branch?`data-source-branch="${i}"`:''} aria-label="${branch?'Thermische Energie von '+esc(t.label)+'. Zum Verschieben wählen.':'Nebenast am Ausgang von '+esc(t.label)+': thermischen Pfeil hier andocken'}">${branch?token({kind:'energy',label:branch.energy}):'<span class="de-dock-dot" aria-hidden="true">＋</span><span class="de-dock-label">Ausgang</span>'}</${readonly?'div':'button'}>${branch&&!readonly?`<button type="button" class="de-branch-clear" data-branch-remove="${i}" aria-label="Thermischen Nebenast von ${esc(t.label)} entfernen">×</button>`:''}</div>`:''}</div>`;
    }).join('')}</div>`;
   host.querySelector('.de-chain').scrollLeft=scroll;
  }
  function origin(el){
   const b=el?.closest('[data-label],[data-source-main],[data-source-branch]');if(!b||!host.contains(b))return null;
   if(b.dataset.label)return {source:'palette',token:{kind:b.dataset.kind,label:b.dataset.label}};
   if(b.dataset.sourceMain!==undefined){const index=+b.dataset.sourceMain;return {source:'main',index,token:clone(data.main[index])};}
   if(!legacy)return null;const index=+b.dataset.sourceBranch;return {source:'branch',index,token:{kind:'energy',label:data.branches.find(v=>v.from===index).energy}};
  }
  function destination(el){const b=el?.closest('[data-branch-socket],[data-socket]');if(!b||!host.contains(b)||!legacy&&b.dataset.branchSocket!==undefined)return null;return {element:b,kind:b.dataset.branchSocket!==undefined?'branch':'main',index:+(b.dataset.branchSocket??b.dataset.socket)};}
  function click(e){
   if(readonly||suppressClick)return;const b=e.target.closest('button');if(!b||!host.contains(b))return;
   if(b.dataset.clear!==undefined){data.main[+b.dataset.clear]=null;if(legacy)data.branches=data.branches.filter(v=>v.from!==+b.dataset.clear);change();return;}
   if(b.dataset.branchRemove!==undefined){data.branches=data.branches.filter(v=>v.from!==+b.dataset.branchRemove);change();return;}
   const dest=destination(b),item=origin(b);
   if(selected&&dest){put(dest);return;}
   if(item){selected=item;render();host.querySelector('.de-selection')?.scrollIntoView({block:'nearest'});}
  }
  function clearDrag(){if(hover)hover.classList.remove('de-drag-hover');hover=null;ghost?.remove();ghost=null;host.classList.remove('de-dragging');}
  function down(e){
   if(readonly||e.button>0||e.target.closest('[data-clear],[data-branch-remove]'))return;const item=origin(e.target);if(!item)return;
   const capture=e.target.closest('button');pointer={id:e.pointerId,x:e.clientX,y:e.clientY,item,moved:false,capture};capture?.setPointerCapture?.(e.pointerId);
  }
  function move(e){
   if(!pointer||e.pointerId!==pointer.id)return;
   if(!pointer.moved&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)<7)return;
   pointer.moved=true;e.preventDefault();
   if(!ghost){ghost=document.createElement('div');ghost.className='de-drag-ghost';ghost.setAttribute('aria-hidden','true');ghost.innerHTML=token(pointer.item.token);host.append(ghost);host.classList.add('de-dragging');}
   ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
   const d=destination(document.elementFromPoint(e.clientX,e.clientY));const valid=d&&(d.kind==='main'||legacy&&pointer.item.token.label==='thermische Energie');
   if(hover&&(!valid||hover!==d?.element))hover.classList.remove('de-drag-hover');hover=valid?d.element:null;hover?.classList.add('de-drag-hover');
   // Keep all seven parts reachable on narrow phones without changing the tablet layout.
   const chain=host.querySelector('.de-chain'),r=chain.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){if(e.clientX>r.right-30)chain.scrollLeft+=12;else if(e.clientX<r.left+30)chain.scrollLeft-=12;}
  }
  function up(e){
   if(!pointer||e.pointerId!==pointer.id)return;const p=pointer;pointer=null;clearDrag();p.capture?.releasePointerCapture?.(e.pointerId);
   if(!p.moved)return;suppressClick=true;clearTimeout(timer);timer=setTimeout(()=>suppressClick=false,250);
   const d=destination(document.elementFromPoint(e.clientX,e.clientY));if(d)put(d,p.item);
  }
  function cancel(){pointer=null;clearDrag();}
  function key(e){if(e.key==='Escape'){cancel();selected=null;render();}}
  function nativeDrag(e){e.preventDefault();}
  host.addEventListener('click',click);host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('keydown',key);host.addEventListener('dragstart',nativeDrag);render();
  return {getValue:()=>clone(data),destroy(){cancel();clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('keydown',key);host.removeEventListener('dragstart',nativeDrag);}};
 }
 const isConverter=t=>t?.kind==='device'&&/DynaMot|Lampe/i.test(t.label)&&!/Gewicht/i.test(t.label);
 const lossFraction=b=>Number.isFinite(b?.fraction)?Math.max(.05,Math.min(.95,b.fraction)):.25;
  function flowLayout(main,branches=[],options={}){
   const cell=options.cell||82,top=options.top??75,base=options.base||66,height=266,width=main.length*cell;
   const byFrom=new Map(branches.filter(b=>b&&Number.isInteger(b.from)&&b.energy==='thermische Energie').map(b=>[b.from,b]));
   const gaps=[],splits=[],energyCells=[{index:0,x:0,thickness:base}];let remaining=1;
   for(let i=0;i<main.length-1;i++){
    const incoming=base*remaining;
    if(i%2&&isConverter(main[i])){
     const branch=byFrom.get(i),fraction=branch?lossFraction(branch):0,heat=incoming*fraction,outgoing=incoming-heat,x0=(i+1)*cell,radius=Math.max(heat+2,Math.min(cell-14,Math.max(52,heat+4)));
     gaps.push({fromIndex:i,from:x0,to:x0+cell,incoming,outgoing,heat,branch:!!branch,last:i===main.length-2});
     splits.push({from:i,label:main[i].label,x0,cx:x0+12,radius,innerRadius:radius-heat,top,incoming,outgoing,heat,fraction,branch:!!branch});
     remaining*=1-fraction;
    }else gaps.push({fromIndex:i,from:i*cell,to:(i+1)*cell,incoming,outgoing:incoming,heat:0,last:i===main.length-2});
    if(i%2)energyCells.push({index:i+1,x:(i+1)*cell,thickness:base*remaining});
   }
   return {width,height,cell,top,base,gaps,splits,energyCells,remaining,nodes:main.map((token,i)=>({index:i,x:i*cell,token}))};
  }
  function arrowPath(x,top,height,cell){return `M ${x} ${top} L ${x+cell-13} ${top} L ${x+cell} ${top+height/2} L ${x+cell-13} ${top+height} L ${x} ${top+height} Z`;}
  function heatPath(s){const y=s.top+s.outgoing,R=s.radius,r=s.innerRadius,cx=s.cx,turn=y+R,base=207,tip=226;return `M ${s.x0} ${y} L ${cx} ${y} A ${R} ${R} 0 0 1 ${cx+R} ${turn} L ${cx+R} ${base} L ${cx+(R+r)/2} ${tip} L ${cx+r} ${base} L ${cx+r} ${turn} A ${r} ${r} 0 0 0 ${cx} ${y+s.heat} L ${s.x0} ${y+s.heat} Z`;}
 function svgLabel(label,x,y,klass,centered=false){const words=String(label||'').split(' '),mid=words.length>2?Math.ceil(words.length/2):1,lines=words.length===1?[label]:[words.slice(0,mid).join(' '),words.slice(mid).join(' ')].filter(Boolean);return `<text class="${klass}" x="${x}" y="${centered?y-(lines.length-1)*7.5:y}" ${centered?'dominant-baseline="central"':''} text-anchor="middle">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?15:0}">${esc(line)}</tspan>`).join('')}</text>`;}
 function mountLosses(host,{length=5,value,onChange=()=>{},readonly=false}={}){
  const data=value&&Array.isArray(value.main)?clone(value):{main:Array(length).fill(null),branches:[]};data.branches=Array.isArray(data.branches)?data.branches:[];
  let selected=null,feedback='',bad=false,drag=null,grip=null,ghost=null,hover=null,suppressClick=false,suppressTimer=null;
  const energyGroups=Object.entries(groups);
  const snapshot=()=>clone(data);
  function setFeedback(text,isBad=false){feedback=text;bad=isBad;const el=host.querySelector('.de-loss-feedback');if(el){el.textContent=text;el.classList.toggle('de-loss-error',isBad);}}
  function commit(){onChange(snapshot());}
  function measuredLayout(){const css=getComputedStyle(host),minimum=parseFloat(css.getPropertyValue('--de-min-cell'))||0;return flowLayout(data.main,data.branches,{top:24,cell:Math.max(minimum,(host.clientWidth-2)/data.main.length),base:parseFloat(css.getPropertyValue('--de-height'))||66});}
  function render(){
   host.classList.add('de-editor','de-losses');
   const scroll=host.querySelector('.de-losses-scroll')?.scrollLeft||0,layout=measuredLayout();
   host.classList.add('de-editor','de-losses');host.dataset.diagramStage='losses';host.classList.toggle('de-readonly',readonly);
   const mainPaths=layout.energyCells.map(c=>`<path class="de-flow-main" data-flow-after="${c.index-1}" d="${arrowPath(c.x,layout.top,c.thickness,layout.cell)}"/>`).join('');
   const heatPaths=layout.splits.filter(s=>s.branch).map(s=>`<path class="de-flow-heat" data-heat-after="${s.from}" d="${heatPath(s)}"/>`).join('');
   const labels=layout.nodes.map(n=>n.index%2?`<g class="de-flow-device"><rect x="${n.x}" y="${layout.top}" width="${layout.cell}" height="${layout.base}" rx="0"/>${svgLabel(n.token?.label||'Wandler',n.x+layout.cell/2,layout.top+layout.base/2,'de-flow-device-label',true)}</g>`:svgLabel(n.token?.label||'Energieform',n.x+layout.cell/2,layout.top+layout.energyCells.find(c=>c.index===n.index).thickness/2,`de-flow-energy-label${layout.energyCells.find(c=>c.index===n.index)?.thickness<34?' de-flow-narrow':''}`,true)).join('');
   const heatLabels=layout.splits.filter(s=>s.branch).map(s=>svgLabel('thermische Energie',s.x0+layout.cell/2,layout.height-29,'de-flow-heat-label')).join('');
   const targets=readonly?'':layout.splits.map(s=>s.branch?`<div class="de-loss-grip" data-loss-grip="${s.from}" role="slider" tabindex="0" aria-label="Wärmeanteil nach ${esc(s.label)}" aria-orientation="vertical" aria-valuemin="5" aria-valuemax="95" aria-valuenow="${Math.round(s.fraction*100)}" aria-valuetext="${Math.round(s.fraction*100)} Prozent Wärme" style="left:${s.x0+3}px;top:${layout.top+s.outgoing}px" title="Grenze nach oben oder unten ziehen · Pfeiltasten">↕</div>`:`<button type="button" class="de-loss-dock" data-loss-dock="${s.from}" aria-label="Energieform am Ausgang von ${esc(s.label)} zuordnen" style="left:${s.x0+3}px;top:${layout.top+s.incoming/2}px">＋</button>`).join('');
   host.innerHTML=`${readonly?'':`<p class="de-help">Welche Energieform verlässt die Wandler zusätzlich? Wähle eine Energieform und lege sie auf den Ausgangspfeil. Ziehe dann die Grenze zwischen den Bändern senkrecht; es gibt keinen vorgegebenen Wirkungsgrad.</p><details class="de-loss-palette-panel" ${layout.splits.every(s=>s.branch)?'':'open'}><summary>Energieform auswählen</summary><div class="de-loss-palette">${energyGroups.map(([title,forms])=>`<section class="de-loss-category"><h4>${title}</h4><div>${forms.map(form=>`<button type="button" data-loss-energy="${esc(form)}" aria-pressed="${selected===form}">${esc(form)}</button>`).join('')}</div></section>`).join('')}</div></details>`}<p class="de-loss-feedback ${bad?'de-loss-error':''}" role="status" aria-live="polite">${esc(feedback||(!readonly&&selected?'Gewählt: '+selected+' · Ausgangspfeil antippen oder dorthin ziehen.':''))}</p><div class="de-losses-scroll" aria-label="Energiefluss mit Anteilen; horizontal verschiebbar"><div class="de-sankey-wrap" style="width:${layout.width}px;height:${layout.height}px"><svg class="de-sankey-svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-label="Energiefluss: Die Bandbreite zeigt den verbleibenden Anteil von links nach rechts"><rect class="de-flow-background" width="${layout.width}" height="${layout.height}" rx="12"/>${mainPaths}${heatPaths}${labels}${heatLabels}</svg>${targets}</div></div><p class="de-loss-note">Die Breiten zeigen gewählte Anteile im Modell, keine gemessenen Wirkungsgrade. Am Gewicht wird Lageenergie gespeichert; dort zweigt keine Wärme ab.</p>`;
   host.querySelector('.de-losses-scroll').scrollLeft=scroll;
  }
  function place(from,form=selected){const target=flowLayout(data.main,data.branches).splits.find(s=>s.from===from);if(!target)return false;if(form!=='thermische Energie'){selected=null;render();setFeedback('An diesem Ausgang wird thermische Energie als zusätzlicher Anteil gesucht. Wähle die passende Energieform.',true);return false;}if(!data.branches.some(b=>b.from===from)){data.branches.push({from,energy:'thermische Energie',fraction:.25});selected=null;feedback='✓ Thermische Energie am Ausgang ergänzt. Ziehe die Grenze, um die Anteile zu verändern.';bad=false;render();commit();}else{selected=null;render();setFeedback('Dieser Ausgang hat bereits einen thermischen Anteil. Ziehe seine Grenze, um den Anteil zu ändern.');}return true;}
  function changeFraction(from,value,notify=false){const b=data.branches.find(b=>b.from===from);if(!b)return;const fraction=Math.round(Math.max(.05,Math.min(.95,value))*100)/100;if(b.fraction===fraction)return;b.fraction=fraction;render();if(notify)commit();}
  function fractionAt(from,clientY){const s=measuredLayout().splits.find(s=>s.from===from),r=host.querySelector('.de-sankey-svg').getBoundingClientRect();return 1-(clientY-r.top-s.top)/s.incoming;}
  function clearGhost(){ghost?.remove();ghost=null;hover?.classList.remove('de-loss-hover');hover=null;}
  function click(e){if(readonly||suppressClick)return;const button=e.target.closest('button');if(!button||!host.contains(button))return;if(button.dataset.lossEnergy){selected=button.dataset.lossEnergy;feedback='';bad=false;render();return;}if(button.dataset.lossDock!==undefined){if(!selected){setFeedback('Wähle zuerst eine Energieform aus der Palette.');return;}place(+button.dataset.lossDock);}}
  function down(e){if(readonly||e.button>0)return;const handle=e.target.closest('[data-loss-grip]');if(handle&&host.contains(handle)){e.preventDefault();grip={id:e.pointerId,from:+handle.dataset.lossGrip,changed:false};host.setPointerCapture?.(e.pointerId);return;}const token=e.target.closest('[data-loss-energy]');if(token&&host.contains(token)){drag={id:e.pointerId,x:e.clientX,y:e.clientY,form:token.dataset.lossEnergy,moved:false,capture:token};token.setPointerCapture?.(e.pointerId);}}
  function move(e){if(grip&&e.pointerId===grip.id){e.preventDefault();const old=data.branches.find(b=>b.from===grip.from)?.fraction;changeFraction(grip.from,fractionAt(grip.from,e.clientY));if(data.branches.find(b=>b.from===grip.from)?.fraction!==old)grip.changed=true;return;}if(!drag||e.pointerId!==drag.id)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<7)return;drag.moved=true;e.preventDefault();if(!ghost){ghost=document.createElement('div');ghost.className='de-loss-ghost';ghost.textContent=drag.form;host.append(ghost);}ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-loss-dock]');if(hover&&hover!==target)hover.classList.remove('de-loss-hover');hover=target&&host.contains(target)?target:null;hover?.classList.add('de-loss-hover');const scroll=host.querySelector('.de-losses-scroll'),r=scroll.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){if(e.clientX>r.right-30)scroll.scrollLeft+=12;else if(e.clientX<r.left+30)scroll.scrollLeft-=12;}}
  function up(e){if(grip&&e.pointerId===grip.id){const changed=grip.changed;grip=null;host.releasePointerCapture?.(e.pointerId);if(changed)commit();return;}if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;clearGhost();d.capture?.releasePointerCapture?.(e.pointerId);if(!d.moved)return;suppressClick=true;clearTimeout(suppressTimer);suppressTimer=setTimeout(()=>suppressClick=false,240);const dock=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-loss-dock]');if(dock&&host.contains(dock))place(+dock.dataset.lossDock,d.form);else setFeedback('Lege die Energieform auf einen Ausgangspfeil nach einem Wandler.');}
  function cancel(){const changed=grip?.changed;grip=null;drag=null;clearGhost();if(changed)commit();}
  function key(e){if(e.key==='Escape'){selected=null;feedback='';bad=false;render();return;}const handle=e.target.closest('[data-loss-grip]');if(!handle||readonly)return;const from=+handle.dataset.lossGrip,branch=data.branches.find(b=>b.from===from);if(!branch)return;let f=lossFraction(branch);if(e.key==='ArrowUp')f+=.025;else if(e.key==='ArrowDown')f-=.025;else if(e.key==='Home')f=.05;else if(e.key==='End')f=.95;else return;e.preventDefault();changeFraction(from,f,true);host.querySelector(`[data-loss-grip="${from}"]`)?.focus({preventScroll:true});}
  function nativeDrag(e){e.preventDefault();}
  host.addEventListener('click',click);host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('keydown',key);host.addEventListener('dragstart',nativeDrag);render();
  let lastWidth=host.clientWidth;const resize=new ResizeObserver(()=>{if(host.clientWidth!==lastWidth){lastWidth=host.clientWidth;render();}});resize.observe(host);
  return {getValue:snapshot,destroy(){resize.disconnect();cancel();clearTimeout(suppressTimer);host.removeEventListener('click',click);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('keydown',key);host.removeEventListener('dragstart',nativeDrag);}};
 }
 root.DynamotDiagram={mount,groups,flowLayout};
})(typeof globalThis==='object'?globalThis:this);
