const ROCKET_HINT_LEVELS=[
  [
    "Welche Energieform ist in deinen Muskeln gespeichert?",
    "Es handelt sich um eine der inneren Energieformen.",
    "Die inneren Energieformen sind chemische Energie, thermische Energie und Kernenergie.",
    "In deinen Muskeln wird Zucker mit Sauerstoff in andere Stoffe umgewandelt. Welche der drei Energieformen passt zu dieser Stoffumwandlung?"
  ],
  [
    "Mit deinen Muskeln kannst du Dinge bewegen, anheben oder verformen.",
    "Die drei mechanischen Energieformen sind kinetische Energie, Lageenergie und elastische Energie.",
    "Deine Arme bewegen den Griff der Pumpe. Welche Energieform passt dazu?"
  ],
  [
    "Beim Pumpen gelangt zusätzliche Luft in die Flasche, sodass der Druck steigt. Welche Energieform gehört zum Druck?",
    "Suche bei den inneren Energieformen.",
    "Die inneren Energieformen sind chemische Energie, thermische Energie und Kernenergie."
  ],
  [
    "Wenn die Rakete startet, wird sie schneller. Welche Energie gehört zur Geschwindigkeit?",
    "Suche bei den mechanischen Energieformen.",
    "Die mechanischen Energieformen sind kinetische Energie, Lageenergie und elastische Energie."
  ],
  [
    "Beim Steigen kommt die Rakete immer höher. Welche Energie gehört zur Höhe?",
    "Suche bei den mechanischen Energieformen.",
    "Die mechanischen Energieformen sind kinetische Energie, Lageenergie und elastische Energie."
  ],
  [
    "Die Rakete fällt wieder herunter. Was geschieht dabei mit ihrer Geschwindigkeit?",
    "Suche bei den mechanischen Energieformen. Achte darauf, welche Energie beim Fallen zunimmt.",
    "Die mechanischen Energieformen sind kinetische Energie, Lageenergie und elastische Energie.",
    "Die Rakete verliert Höhe und wird gleichzeitig schneller. Welche der beiden Formen nimmt wegen der größeren Geschwindigkeit zu?"
  ]
];
/* Flaschenrakete learning component. Persistence is handled by its host. */
const ROCKET_ENERGIES = ['kinetische Energie','Lageenergie','elastische Energie','thermische Energie','chemische Energie','Kernenergie','Licht','elektrische Energie','magnetische Energie'];
const ROCKET_DEVICES = ['Muskel','Luftpumpe','Flasche'];
const ROCKET_RETIRED_DEVICES = ['Solarzelle','Elektromotor']; // Valid saved drafts, no longer offered.
const ROCKET_ENERGY_COLORS = Object.freeze({
  'kinetische Energie':'#6cd1a0','Lageenergie':'#bc97eb','elastische Energie':'#72c9bf',
  'thermische Energie':'#f27770','chemische Energie':'#f6ae58','Kernenergie':'#ed9ac0',
  'Licht':'#f5cf50','elektrische Energie':'#80b8f2','magnetische Energie':'#92a8c3'
});
const ROCKET_UNSET_COLOR='#b6c9d6';
// Keep already saved V2 diagrams readable; changing labels does not change points.
const ROCKET_DEVICE_ALIASES = Object.freeze({'Muskeln':'Muskel','Pumpe':'Luftpumpe','Druckluft und Düse':'Flasche','Rakete und Erde (Steigen)':'Flasche','Rakete und Erde (Fallen)':'Flasche'});
const ROCKET_GROUPS = [['Mechanische Energieformen',ROCKET_ENERGIES.slice(0,3)],['Innere Energieformen',ROCKET_ENERGIES.slice(3,6)],['Elektromagnetische Energieformen',ROCKET_ENERGIES.slice(6)],['Energiewandler',ROCKET_DEVICES]];
const ROCKET_CLOZE = ['chemische Energie','kinetische Energie','thermische Energie','kinetische Energie','Lageenergie','kinetische Energie'];
const ROCKET_CHAIN = ['chemische Energie','Muskel','kinetische Energie','Luftpumpe','thermische Energie','Flasche','kinetische Energie','Flasche','Lageenergie','Flasche','kinetische Energie'];
const ROCKET_BRANCHES = ['thermische Energie','thermische Energie','thermische Energie','kinetische Energie','thermische Energie','thermische Energie'];
const ROCKET_EXTRAS=[{from:1,context:'Umgebung'},{from:3,context:'Umgebung'},{from:5,context:'Umgebung'},{from:5,context:'Wasser'},{from:7,context:'Umgebung'},{from:9,context:'Umgebung'}];
const ROCKET_HINTS = ['Welche Energie steckt in der Nahrung?','Was bewegt sich an der Pumpe?','Welche Energieform ordnen wir der Druckluft hier zu?','Was bewegen Wasserstrahl und Rakete?','Welche Energie hat die Rakete wegen ihrer Höhe?','Welche Energie nimmt beim Fallen zu?'];
const rocketCopy = x => JSON.parse(JSON.stringify(x));
const rocketEsc = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rocketObj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const rocketDraft = (a,n,values) => Array.isArray(a)&&a.length===n&&a.every(x=>x===''||values.includes(x));

const rocketEarned=s=>s.solved.map((yes,i)=>s.carryScores20?.[i]&&s.carryScores20[i]!=='gray'?s.carryScores20[i]:yes?(s.attempts[i]||s.hints[i]?'yellow':'green'):'gray');
function rocketLearningFresh(){return {version:3,hintLevels:Array(6).fill(0),drafts:{cloze:Array(6).fill(''),basic:{main:Array(11).fill('')},losses:{branches:Array(6).fill('')}},attempts:Array(20).fill(0),hints:Array(20).fill(false),errors:Array(20).fill(false),solved:Array(20).fill(false),carryScores20:Array(20).fill('gray'),feedback:{cloze:'',basic:'',losses:''}};}
function rocketLearningValidate(s){
  if(!rocketObj(s)||!rocketObj(s.drafts)||!rocketDraft(s.drafts.cloze,6,ROCKET_ENERGIES)||!Array.isArray(s.attempts)||s.attempts.length!==20||!s.attempts.every(x=>Number.isSafeInteger(x)&&x>=0)||!['hints','errors','solved'].every(k=>Array.isArray(s[k])&&s[k].length===20&&s[k].every(x=>typeof x==='boolean'))||!rocketObj(s.feedback)||!['cloze','basic','losses'].every(k=>typeof s.feedback[k]==='string'&&s.feedback[k].length<500))return false;
  if(s.hintLevels!==undefined&&(!Array.isArray(s.hintLevels)||s.hintLevels.length!==6||!s.hintLevels.every(x=>Number.isInteger(x)&&x>=0&&x<=4)))return false;
  if(s.version===1)return rocketDraft(s.drafts.basic,6,ROCKET_ENERGIES)&&rocketDraft(s.drafts.losses,8,ROCKET_ENERGIES);
  const labels=[...ROCKET_ENERGIES,...ROCKET_DEVICES,...ROCKET_RETIRED_DEVICES,...Object.keys(ROCKET_DEVICE_ALIASES)];
  return [2,3].includes(s.version)&&rocketObj(s.drafts.basic)&&rocketObj(s.drafts.losses)&&rocketDraft(s.drafts.basic.main,11,labels)&&(s.version===3||rocketDraft(s.drafts.losses.main,11,labels))&&rocketDraft(s.drafts.losses.branches,s.version===3&&s.drafts.losses.branches?.length===6?6:2,ROCKET_ENERGIES)&&Array.isArray(s.carryScores20)&&s.carryScores20.length===20&&s.carryScores20.every(x=>['gray','green','yellow'].includes(x));
}
function rocketLearningMigrate(old){
  if(!rocketLearningValidate(old))throw Error('Invalid rocket learning state');
  if(old.version===3&&old.drafts.losses.branches.length===6){const copy=rocketCopy(old);copy.hintLevels=old.hintLevels?.slice()||old.hints.slice(0,6).map(x=>x?1:0);return copy;}
  const s=rocketLearningFresh();s.carryScores20=rocketEarned(old);s.hintLevels=old.hintLevels?.slice()||old.hints.slice(0,6).map(x=>x?1:0);s.drafts.cloze=old.drafts.cloze.slice();s.feedback.cloze=old.feedback.cloze;
  // Preserve every old field, including the retired duplicate main-chain exercise.
  if(old.version===1){s.legacyV1=rocketCopy(old);for(let i=0;i<6;i++)s.drafts.basic.main[2*i]=old.drafts.basic[i];}
  else{s[old.version===2?'legacyV2':'legacyTwoBranches']=rocketCopy(old);if(old.legacyV1)s.legacyV1=rocketCopy(old.legacyV1);s.drafts.basic.main=old.drafts.basic.main.map(label=>ROCKET_DEVICE_ALIASES[label]||label);}
  for(let i=0;i<(old.version===1?6:12);i++){s.solved[i]=old.solved[i];s.attempts[i]=old.attempts[i];s.hints[i]=old.hints[i];s.errors[i]=old.errors[i];}
  const previous=old.version===1?old.drafts.losses.slice(6):old.drafts.losses.branches;
  for(const [before,after] of [[0,1],[1,3]]){const n=12+after;s.drafts.losses.branches[after]=previous[before];s.attempts[n]=old.attempts[18+before];s.hints[n]=old.hints[18+before];s.errors[n]=old.errors[18+before];if(s.solved.slice(6,12).every(Boolean))s.solved[n]=previous[before]===ROCKET_BRANCHES[after];}
  return s;
}
function createRocketLearning(host,{state:initialState,onChange}={}){
  if(!(host instanceof Element))throw TypeError('host must be an Element');
  if(initialState!==undefined&&!rocketLearningValidate(initialState))throw Error('Invalid rocket learning state');
  if(onChange!==undefined&&typeof onChange!=='function')throw TypeError('onChange must be a function');
  let state=initialState?rocketLearningMigrate(initialState):rocketLearningFresh(),chosen=null,pointer=null,ghost=null,hover=null,destroyed=false,suppressClick=false,timer=null;
  const getState=()=>rocketCopy(state);
  const getScores=()=>rocketEarned(state);
  const getProgress=()=>{const scores=getScores(),count=(start,end)=>scores.slice(start,end).filter(x=>x==='green'||x==='yellow').length;return {cloze:{earned:count(0,ROCKET_CLOZE.length),total:ROCKET_CLOZE.length},diagram:{earned:count(ROCKET_CLOZE.length,ROCKET_CLOZE.length+Math.ceil(ROCKET_CHAIN.length/2)+ROCKET_EXTRAS.length),total:Math.ceil(ROCKET_CHAIN.length/2)+ROCKET_EXTRAS.length}};};
  const emit=()=>{if(!destroyed)onChange?.(getState(),getScores());};
  const basicDone=()=>state.solved.slice(6,12).every(Boolean);
  const palette=()=>`<div class="rocket-palette">${ROCKET_GROUPS.map(([title,items])=>`<div class="rocket-palette-group"><strong>${rocketEsc(title)}</strong><div>${items.map(label=>{const kind=title==='Energiewandler'?'device':'energy';return `<button type="button" class="rocket-token rocket-${kind}${chosen?.label===label?' is-chosen':''}" data-token="${rocketEsc(label)}" data-kind="${kind}" aria-pressed="${chosen?.label===label}" ${kind==='energy'?`style="--rocket-energy-color:${ROCKET_ENERGY_COLORS[label]}"`:''}>${rocketEsc(label)}</button>`;}).join('')}</div></div>`).join('')}</div>`;
  const select=i=>`<span class="rocket-cloze-pair"><label class="rocket-cloze"><span class="rocket-sr">Energieform in Lücke ${i+1}</span><select data-cloze="${i}" ${state.solved[i]?'disabled':''} class="${state.solved[i]?'is-solved':state.errors[i]?'has-error':''}"><option value="">Energieform wählen</option>${ROCKET_GROUPS.slice(0,3).map(([name,items])=>`<optgroup label="${rocketEsc(name)}">${items.map(x=>`<option value="${rocketEsc(x)}" ${state.drafts.cloze[i]===x?'selected':''}>${rocketEsc(x)}</option>`).join('')}</optgroup>`).join('')}</select></label><button type="button" class="rocket-cloze-help" data-cloze-help="${i}" aria-label="Hilfe zu Lücke ${i+1}" aria-haspopup="dialog"><span aria-hidden="true">?</span></button></span>`;
  function sharedDiagram(){
    const cell=Math.max(64,Math.floor((host.clientWidth-138)/11)),base=66,top=26,width=11*cell+70;
    const active=i=>basicDone()&&state.solved[12+i]&&state.drafts.losses.branches[i]===ROCKET_BRANCHES[i];
    const branchWidth=i=>i===3?10:6;
    const thickness=i=>!basicDone()?base:base-ROCKET_EXTRAS.reduce((sum,s,j)=>sum+(i>s.from?branchWidth(j):0),0);
    const arrow=(x,h)=>`M${x} ${top} H${x+cell-13} L${x+cell} ${top+h/2} L${x+cell-13} ${top+h} H${x} Z`;
    const main=ROCKET_CHAIN.map((_,i)=>i%2?`<rect data-converter-index="${i}" x="${i*cell}" y="${top}" width="${cell}" height="${base}" fill="#fff0ca" stroke="#b48e39" stroke-width="2"/>`:`<path data-flow-index="${i}" data-band-height="${thickness(i)}" d="${arrow(i*cell,thickness(i))}" fill="${ROCKET_ENERGY_COLORS[state.drafts.basic.main[i]]||ROCKET_UNSET_COLOR}"/>`).join('');
    const branches=ROCKET_EXTRAS.map((s,i)=>{const x=(s.from+1)*cell,w=branchWidth(i),y=top+thickness(s.from+1)+(i===2?branchWidth(3):0),cx=x+10,r=16,ry=16,inner=r-w,turn=y+ry,end=110;
      if(i===3)return `<path data-flow-branch="${i}" data-source-slot="basic:${s.from}" d="M${x} ${y} H${x+10} C${x+40} ${y} ${x+40} 106 ${x+66} 111 Q${x+94} 118 ${x+94} 140 V162 L${x+89} 174 L${x+84} 162 V140 Q${x+84} 126 ${x+62} 121 C${x+30} 116 ${x+34} ${y+w} ${x+10} ${y+w} H${x} Z" fill="${active(i)?ROCKET_ENERGY_COLORS[ROCKET_BRANCHES[i]]:ROCKET_UNSET_COLOR}"/>`;
      return `<path data-flow-branch="${i}" data-source-slot="basic:${s.from}" d="M${x} ${y} H${cx} A${r} ${ry} 0 0 1 ${cx+r} ${turn} V${end} L${cx+(r+inner)/2} ${end+10} L${cx+inner} ${end} V${turn} A${inner} ${ry-w} 0 0 0 ${cx} ${y+w} H${x} Z" fill="${active(i)?ROCKET_ENERGY_COLORS[ROCKET_BRANCHES[i]]:ROCKET_UNSET_COLOR}"/>`;
    }).join('');
    const targets=ROCKET_CHAIN.map((_,i)=>{const n=6+Math.ceil(i/2),value=state.drafts.basic.main[i];return `<button type="button" class="rocket-socket rocket-flow-target ${state.solved[n]?'is-solved':state.errors[n]?'has-error':''}" data-slot="basic:${i}" data-kind="${i%2?'device':'energy'}" aria-disabled="${state.solved[n]}" style="left:${i*cell}px;width:${cell}px;top:${top}px;height:${i%2?base:Math.max(44,thickness(i))}px" aria-label="${i%2?'Wandler':'Energiepfeil'} ${i+1}: ${rocketEsc(value||'leer')}"><span>${rocketEsc(value||'Ablegen')}</span></button>`;}).join('');
    const sideTargets=ROCKET_EXTRAS.map((s,i)=>{const style=`left:${(s.from+1)*cell+(i===3?39:-26)}px;top:${i===3?180:124}px`;return active(i)?`<div class="rocket-flow-branch-label" data-branch-label="${i}" style="${style}"><strong>${rocketEsc(ROCKET_BRANCHES[i])}</strong><span>${s.context==='Wasser'?'mit dem Wasser':'an die Umgebung'}</span></div>`:`<button type="button" class="rocket-socket rocket-flow-dock ${state.errors[12+i]?'has-error':''}" data-branch="${i}" data-kind="energy" aria-disabled="${!basicDone()}" style="${style}" aria-label="Zusätzliche Energie am Ausgang von Wandlerplatz ${s.from+1}: ${s.context}"><span>＋ ${s.context}</span></button>`;}).join('');
    return `<div class="rocket-chain-scroll" data-shared-diagram><div class="rocket-flow-wrap" style="width:${width}px;height:240px"><svg class="rocket-flow-svg" width="${width}" height="240" aria-hidden="true">${main}${basicDone()?branches:''}</svg>${targets}${basicDone()?sideTargets:''}</div></div>`;
  }
  const feedback=group=>`<p class="rocket-feedback" role="status" aria-live="polite">${rocketEsc(state.feedback[group])}</p>`;
  function render(){
    if(destroyed)return;const focused=host.contains(document.activeElement)?document.activeElement:null,focusAttr=focused&&['data-token','data-slot','data-branch','data-cloze','data-check','data-hint'].find(k=>focused.hasAttribute(k)),focusValue=focusAttr?focused.getAttribute(focusAttr):null,scrolls=[...host.querySelectorAll('.rocket-chain-scroll')].map(x=>x.scrollLeft),oldDiagram=host.querySelector('[data-shared-diagram]');
    host.classList.add('rocket-learning');host.innerHTML=`<div class="rocket-learning-inner">${state.legacyV1?'<p class="rocket-migration">Bisherige Punkte bleiben erhalten. Neue Wandlerplätze kannst du zusätzlich lösen.</p>':''}
    <section class="rocket-card" data-cloze-card><div class="rocket-card-head"><span class="rocket-step">1</span><h3>Die Geschichte als Lückentext</h3></div><div class="rocket-story"><section class="rocket-story-part"><h4>Energie aus der Nahrung</h4><p>Über die Nahrung nimmt der Mensch Energie auf. Ein Teil ist in seinen Muskeln als ${select(0)} gespeichert.</p></section> <section class="rocket-story-part"><h4>Pumpen</h4><p>Beim Pumpen wandeln die Muskeln diese Energie in ${select(1)} um. Durch die Bewegung drückt die Pumpe zusätzliche Luft durch den Schlauch in die Flasche, sodass der Druck dort steigt. Dabei wandelt die Pumpe die zugeführte Energie in ${select(2)} der Luft um. Mit jedem Pumpstoß nimmt diese Energie in der Flasche insgesamt zu.</p></section> <section class="rocket-story-part"><h4>Start</h4><p>Schließlich löst sich der Korken. Die unter Druck stehende Luft drückt das Wasser nach unten aus der Flasche. Dabei wird die Rakete beschleunigt und erhält ${select(3)}.</p></section> <section class="rocket-story-part"><h4>Aufstieg</h4><p>Durch die Bewegung der Rakete steigt sie immer höher und wird dabei jedoch immer langsamer. Während die Rakete steigt, wird also ein Teil ihrer Energie in ${select(4)} umgewandelt.</p></section> <section class="rocket-story-part"><h4>Fallen</h4><p>Am höchsten Punkt kehrt die Rakete um. Sie fällt nach unten und wird dabei immer schneller. Beim Fallen wird diese Energie wieder in ${select(5)} umgewandelt.</p></section> </div><div class="rocket-actions"><button type="button" class="rocket-primary" data-check="cloze">Lückentext prüfen</button></div>${feedback('cloze')}</section>
    <section class="rocket-card" data-diagram-card><div class="rocket-card-head"><span class="rocket-step">2</span><h3>Der Energiefluss</h3></div>
    <div class="rocket-diagram-instruction">${[['Schritt 1 · Der Hauptweg','Baue den Hauptweg aus Energiepfeilen und Wandlern auf. Du kannst die Flasche mehrfach verwenden.'],['Schritt 2 · Weitere Energieabgaben','Bei jedem Wandler wird auch Energie an die Umgebung abgegeben. Beim Start nimmt außerdem das Wasser Energie mit. Ordne die passenden Energiepfeile zu.']].map(([title,text],i)=>`<div style="visibility:${i===(basicDone()?1:0)?'visible':'hidden'}" aria-hidden="${i!==(basicDone()?1:0)}"><strong>${title}</strong><p>${text}</p></div>`).join('')}</div>
    <p class="rocket-help">Baustein und passenden Platz antippen oder ziehen. Auf schmalen Bildschirmen kannst du die Kette seitlich verschieben.</p>${palette()}${sharedDiagram()}
    <div class="rocket-diagram-actions">${basicDone()?'<span>✓ Der Hauptweg ist richtig.</span>':'<button type="button" class="rocket-primary" data-check="basic">Hauptweg prüfen</button>'}</div>
    <div class="rocket-criterion-hints">${basicDone()?[12,13,14,15,16,17].map((n,i)=>state.solved[n]?'':`<button type="button" class="rocket-hint" data-hint="${n}">Hinweis ${i+1}</button>`).join(''):Array.from({length:6},(_,i)=>state.solved[6+i]?'':`<button type="button" class="rocket-hint" data-hint="${6+i}">Hinweis zu Abschnitt ${i+1}</button>`).join('')}</div>${feedback(basicDone()?'losses':'basic')}</section></div>`;
    if(oldDiagram){const replacement=host.querySelector('[data-shared-diagram]');for(const oldSlot of oldDiagram.querySelectorAll('[data-slot],[data-flow-index],[data-converter-index]')){const key=['data-slot','data-flow-index','data-converter-index'].find(attr=>oldSlot.hasAttribute(attr));const next=replacement.querySelector('['+key+'="'+oldSlot.getAttribute(key)+'"]');if(next){for(const attr of [...oldSlot.attributes])oldSlot.removeAttribute(attr.name);for(const attr of next.attributes)oldSlot.setAttribute(attr.name,attr.value);oldSlot.innerHTML=next.innerHTML;next.replaceWith(oldSlot);}}oldDiagram.replaceChildren(...replacement.childNodes);replacement.replaceWith(oldDiagram);}
    [...host.querySelectorAll('.rocket-chain-scroll')].forEach((x,i)=>x.scrollLeft=scrolls[i]||0);
    if(focusAttr)[...host.querySelectorAll('['+focusAttr+']')].find(x=>x.getAttribute(focusAttr)===focusValue)?.focus({preventScroll:true});
  }
  const commit=()=>{render();emit();};
  function targetFrom(el){const b=el?.closest('[data-slot],[data-branch]');if(!b||!host.contains(b))return null;if(b.dataset.branch!==undefined)return {group:'losses',branch:Number(b.dataset.branch),kind:'energy',element:b};const [group,index]=b.dataset.slot.split(':');return {group,index:Number(index),kind:b.dataset.kind,element:b};}
  function put(t,label=chosen?.label,kind=chosen?.kind){
    if(!t||!label||!kind)return;
    if(t.branch!==undefined){
      if(!basicDone()||state.solved[12+t.branch])return;const n=12+t.branch;
      if(kind==='energy'&&label===ROCKET_BRANCHES[t.branch]){state.drafts.losses.branches[t.branch]=label;state.solved[n]=true;state.errors[n]=false;state.feedback.losses=state.solved.slice(12,18).every(Boolean)?'Alles richtig! Der Energiefluss ist vollständig.':'Richtig! Ergänze die weiteren Energieabgaben.';}
      else{if(kind==='energy')state.drafts.losses.branches[t.branch]=label;state.attempts[n]++;state.errors[n]=true;state.feedback.losses='Das passt an diesem Ausgang noch nicht. Beobachte, was dort geschieht, und versuche es erneut.';}
    }else{if(t.group!=='basic'||kind!==t.kind)return;const n=6+Math.ceil(t.index/2);if(state.solved[n])return;state.drafts.basic.main[t.index]=label;state.errors[n]=false;state.feedback.basic='';}
    chosen=null;commit();
  }
  function check(group){
    if(!['cloze','basic'].includes(group))return;const offset=group==='cloze'?0:6;let right=0;
    for(let i=0;i<6;i++){const n=offset+i;if(state.solved[n]){right++;continue;}const main=state.drafts.basic.main;const correct=group==='cloze'?state.drafts.cloze[i]===ROCKET_CLOZE[i]:i===0?main[0]===ROCKET_CHAIN[0]:main[2*i-1]===ROCKET_CHAIN[2*i-1]&&main[2*i]===ROCKET_CHAIN[2*i];
      if(correct){state.solved[n]=true;state.errors[n]=false;right++;}else{state.attempts[n]++;state.errors[n]=true;}
    }
    state.feedback[group]=right===6?'Alles richtig!':`${right} von 6 Kriterien richtig. Prüfe die markierten Abschnitte.`;commit();
  }
  function openHint(i){
    if(host.querySelector('.rocket-hint-dialog'))return;
    state.hints[i]=true;state.hintLevels[i]=Math.min(ROCKET_HINT_LEVELS[i].length,Math.max(1,state.hintLevels[i]));emit();
    const dialog=document.createElement('dialog');dialog.className='rocket-hint-dialog';dialog.setAttribute('aria-labelledby','rocket-hint-title');
    const draw=()=>{const level=state.hintLevels[i];dialog.innerHTML=`<div class="rocket-hint-dialog-head"><h3 id="rocket-hint-title">Hilfe zu Lücke ${i+1}</h3><button type="button" data-close-help aria-label="Hilfe schließen">×</button></div><p class="rocket-hint-stage">Hinweis ${level} von ${ROCKET_HINT_LEVELS[i].length}</p><div class="rocket-hint-steps">${ROCKET_HINT_LEVELS[i].slice(0,level).map(text=>`<p>${rocketEsc(text)}</p>`).join('')}</div><div class="rocket-hint-dialog-actions">${level<ROCKET_HINT_LEVELS[i].length?'<button type="button" class="rocket-primary" data-more-help>Mehr Hinweise</button>':'<p>Alle Hinweise sind geöffnet. Du entscheidest, welcher Begriff passt.</p>'}<button type="button" data-close-help>Zurück zur Lücke</button></div>`;};
    draw();host.append(dialog);
    dialog.addEventListener('click',e=>{if(e.target.closest('[data-close-help]'))dialog.close();else if(e.target.closest('[data-more-help]')){state.hintLevels[i]=Math.min(ROCKET_HINT_LEVELS[i].length,state.hintLevels[i]+1);emit();draw();(dialog.querySelector('[data-more-help]')||dialog.querySelector('.rocket-hint-dialog-actions [data-close-help]')).focus({preventScroll:true});}else if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{dialog.remove();host.querySelector('[data-cloze-help="'+i+'"]')?.focus({preventScroll:true});},{once:true});
    dialog.showModal();dialog.querySelector('[data-close-help]').focus({preventScroll:true});
  }
  function click(e){if(suppressClick){suppressClick=false;return;}const b=e.target.closest('button');if(!b||!host.contains(b))return;
    if(b.dataset.clozeHelp!==undefined){openHint(Number(b.dataset.clozeHelp));return;}
    if(b.dataset.token){chosen={label:b.dataset.token,kind:b.dataset.kind};render();return;}
    if(b.dataset.slot||b.dataset.branch!==undefined){put(targetFrom(b));return;}
    if(b.dataset.check){check(b.dataset.check);return;}
    if(b.dataset.hint!==undefined){const n=Number(b.dataset.hint),group=n<6?'cloze':n<12?'basic':'losses';state.hints[n]=true;state.feedback[group]=n<6?ROCKET_HINTS[n]:n<12?'Prüfe den Wandler und den Energiepfeil direkt danach.':n===15?'Das Wasser strömt beim Start aus der Flasche.':n>=16?'Beim Flug reibt die Flasche an der Luft.':'Der Wandler und seine Umgebung werden warm.';commit();}
  }
  function change(e){if(!e.target.matches('[data-cloze]'))return;const i=Number(e.target.dataset.cloze);if(state.solved[i])return;state.drafts.cloze[i]=e.target.value;state.errors[i]=false;state.feedback.cloze='';commit();}
  function clearDrag(){hover?.classList.remove('is-drop-target');hover=null;ghost?.remove();ghost=null;pointer?.token?.classList.remove('is-dragging');}
  function down(e){suppressClick=false;const token=e.target.closest('[data-token]');if(!token||!host.contains(token)||e.button>0||pointer||e.isPrimary===false)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,label:token.dataset.token,kind:token.dataset.kind,token,moved:false};try{token.setPointerCapture?.(e.pointerId);}catch{cancel();}}
  function move(e){if(!pointer||pointer.id!==e.pointerId)return;if(!pointer.moved&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)<7)return;pointer.moved=true;e.preventDefault();pointer.token.classList.add('is-dragging');if(!ghost){ghost=document.createElement('div');ghost.className='rocket-drag-ghost';ghost.textContent=pointer.label;host.append(ghost);}ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const t=targetFrom(document.elementFromPoint(e.clientX,e.clientY));hover?.classList.remove('is-drop-target');hover=t?.kind===pointer.kind?t.element:null;hover?.classList.add('is-drop-target');const scroll=document.elementFromPoint(e.clientX,e.clientY)?.closest('.rocket-chain-scroll');if(scroll&&host.contains(scroll)){const r=scroll.getBoundingClientRect();if(e.clientX>r.right-25)scroll.scrollLeft+=12;else if(e.clientX<r.left+25)scroll.scrollLeft-=12;}}
  function up(e){if(!pointer||pointer.id!==e.pointerId)return;const p=pointer,t=targetFrom(document.elementFromPoint(e.clientX,e.clientY));clearDrag();pointer=null;try{if(p.token.hasPointerCapture?.(e.pointerId))p.token.releasePointerCapture(e.pointerId);}catch{}if(!p.moved)return;e.preventDefault();suppressClick=true;clearTimeout(timer);timer=setTimeout(()=>suppressClick=false,250);if(t?.kind===p.kind)put(t,p.label,p.kind);}
  function cancel(){clearDrag();const p=pointer;pointer=null;try{if(p?.token?.hasPointerCapture?.(p.id))p.token.releasePointerCapture(p.id);}catch{}if(chosen){chosen=null;render();}}
  function lost(e){if(pointer?.id===e.pointerId)cancel();}
  function key(e){if(e.key==='Escape')cancel();}
  function nativeDrag(e){e.preventDefault();}
  host.addEventListener('click',click);host.addEventListener('change',change);host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('lostpointercapture',lost);host.addEventListener('dragstart',nativeDrag);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);render();
  return {getState,getScores,getProgress,setView(view){host.dataset.learningView=view;render();},refresh:render,destroy(){destroyed=true;cancel();clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('change',change);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('lostpointercapture',lost);host.removeEventListener('dragstart',nativeDrag);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);host.innerHTML='';host.classList.remove('rocket-learning');}};
}
if(typeof module!=='undefined'&&module.exports)module.exports={createRocketLearning,rocketLearningFresh,rocketLearningValidate,rocketLearningMigrate};
