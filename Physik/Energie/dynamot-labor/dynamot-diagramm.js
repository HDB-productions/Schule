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
 function mount(host,{length=5,devices=['DynaMot','Lampe'],value,onChange=()=>{},readonly=false}={}){
  let data={main:Array(length).fill(null),branches:[]},selected=null,pointer=null,suppressClick=false,ghost=null,hover=null,timer=null;
  if(value&&Array.isArray(value.main)&&value.main.length===length){data=clone(value);data.branches=Array.isArray(data.branches)?data.branches:[];}
  function token(t,extra=''){return `<span class="de-token ${t.kind==='energy'?'de-arrow':'de-box'}" ${extra}>${esc(t.label)}</span>`;}
  function cleanBranches(){data.branches=data.branches.filter((b,i,all)=>data.main[b.from]?.kind==='device'&&all.findIndex(x=>x.from===b.from)===i);}
  function change(){cleanBranches();selected=null;render();onChange(clone(data));}
  function put(target,item=selected){
   if(!item)return false;
   if(target.kind==='branch'){
    if(item.token.kind!=='energy'||item.token.label!=='thermische Energie'||data.main[target.index]?.kind!=='device')return false;
    if(item.source==='main')data.main[item.index]=null;
    if(item.source==='branch')data.branches=data.branches.filter(b=>b.from!==item.index);
    data.branches=data.branches.filter(b=>b.from!==target.index);
    data.branches.push({from:target.index,energy:'thermische Energie'});
   }else{
    if(item.source==='main'){
     if(item.index===target.index){selected=null;render();return false;}
     const displaced=data.main[target.index];data.main[target.index]=clone(item.token);data.main[item.index]=displaced;
     data.branches=data.branches.map(b=>({...b,from:b.from===item.index?target.index:b.from===target.index?item.index:b.from}));
    }else{
     if(item.source==='branch')data.branches=data.branches.filter(b=>b.from!==item.index);
     data.main[target.index]=clone(item.token);data.branches=data.branches.filter(b=>b.from!==target.index);
    }
   }
   change();return true;
  }
  function render(){
   const scroll=host.querySelector('.de-chain')?.scrollLeft||0;
   host.classList.add('de-editor');host.classList.toggle('de-readonly',readonly);host.classList.toggle('de-has-selection',!!selected);
   host.innerHTML=`${readonly?'':`<p class="de-help">Ziehe Pfeile und Energiewandler in die Kette. Wärme: einen thermischen Pfeil an den Ausgang eines Kastens ziehen.</p><div class="de-palette">${[...Object.entries(groups),['Energiewandler',devices]].map(([title,labels])=>`<section class="de-category"><h4>${title}</h4><div>${labels.map(label=>{const kind=title==='Energiewandler'?'device':'energy';return `<button type="button" data-kind="${kind}" data-label="${esc(label)}" aria-pressed="${selected?.source==='palette'&&selected?.token.label===label}">${token({kind,label})}</button>`;}).join('')}</div></section>`).join('')}</div><p class="de-selection" role="status" aria-live="polite">${selected?'Gewählt: '+esc(selected.token.label)+' · Ziel antippen oder mit Escape abbrechen.':'Pfeile zeigen den Energiefluss von links nach rechts.'}</p>`}
    <div class="de-chain" style="--de-count:${length}" aria-label="Energiefluss von links nach rechts">${data.main.map((t,i)=>{
     const branch=data.branches.find(b=>b.from===i),device=t?.kind==='device',chosen=selected?.source==='main'&&selected.index===i;
     return `<div class="de-cell ${device?'de-device-cell':''}"><${readonly?'div':'button type="button"'} class="de-socket ${t?'de-filled':'de-vacant'} ${chosen?'de-chosen':''}" data-socket="${i}" ${t?`data-source-main="${i}"`:''} aria-label="Platz ${i+1}${t?': '+esc(t.label)+'. Zum Verschieben wählen.':': leer'}" ${readonly?'':`aria-pressed="${chosen}"`}>${t?token(t):`<span class="de-empty">${i+1}<small>Ablegen</small></span>`}</${readonly?'div':'button'}>${!readonly&&t?`<button type="button" class="de-clear" data-clear="${i}" aria-label="${esc(t.label)} an Platz ${i+1} entfernen">×</button>`:''}
      ${device&&(branch||!readonly)?`<div class="de-branch ${branch?'de-branch-filled':'de-branch-empty'}"><span class="de-connector" aria-hidden="true"></span><${readonly?'div':'button type="button"'} class="de-branch-socket ${selected?.source==='branch'&&selected.index===i?'de-chosen':''}" data-branch-socket="${i}" ${branch?`data-source-branch="${i}"`:''} aria-label="${branch?'Thermische Energie von '+esc(t.label)+'. Zum Verschieben wählen.':'Nebenast am Ausgang von '+esc(t.label)+': thermischen Pfeil hier andocken'}">${branch?token({kind:'energy',label:branch.energy}):'<span class="de-dock-dot" aria-hidden="true">＋</span><span class="de-dock-label">Ausgang</span>'}</${readonly?'div':'button'}>${branch&&!readonly?`<button type="button" class="de-branch-clear" data-branch-remove="${i}" aria-label="Thermischen Nebenast von ${esc(t.label)} entfernen">×</button>`:''}</div>`:''}</div>`;
    }).join('')}</div>`;
   host.querySelector('.de-chain').scrollLeft=scroll;
  }
  function origin(el){
   const b=el?.closest('[data-label],[data-source-main],[data-source-branch]');if(!b||!host.contains(b))return null;
   if(b.dataset.label)return {source:'palette',token:{kind:b.dataset.kind,label:b.dataset.label}};
   if(b.dataset.sourceMain!==undefined){const index=+b.dataset.sourceMain;return {source:'main',index,token:clone(data.main[index])};}
   const index=+b.dataset.sourceBranch;return {source:'branch',index,token:{kind:'energy',label:data.branches.find(v=>v.from===index).energy}};
  }
  function destination(el){const b=el?.closest('[data-branch-socket],[data-socket]');if(!b||!host.contains(b))return null;return {element:b,kind:b.dataset.branchSocket!==undefined?'branch':'main',index:+(b.dataset.branchSocket??b.dataset.socket)};}
  function click(e){
   if(readonly||suppressClick)return;const b=e.target.closest('button');if(!b||!host.contains(b))return;
   if(b.dataset.clear!==undefined){data.main[+b.dataset.clear]=null;data.branches=data.branches.filter(v=>v.from!==+b.dataset.clear);change();return;}
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
   const d=destination(document.elementFromPoint(e.clientX,e.clientY));const valid=d&&(d.kind==='main'||pointer.item.token.label==='thermische Energie');
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
 root.DynamotDiagram={mount,groups};
})(typeof globalThis==='object'?globalThis:this);
