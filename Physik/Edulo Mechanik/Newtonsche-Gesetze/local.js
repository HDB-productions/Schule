const LocalTasks=(()=>{
 const keys=['choices','matches','formulas','earned','assisted'];
 const legacyFormulaOptions=[
  [['m*a','m · a'],['a*m','a · m'],['m/a','m / a'],['a/m','a / m'],['m+a','m + a']],
  [['F/a','F / a'],['a/F','a / F'],['F*a','F · a'],['F+a','F + a']],
  [['F/m','F / m'],['m/F','m / F'],['F*m','F · m'],['F+m','F + m']]
 ];
 const quantityOptions=[['m','m'],['a','a'],['F','F']];
 const operatorOptions=[['*','⋅'],['/','/']];
 function formulaSlots(value){
  if(value==='')return ['','',''];
  if(value.includes('|'))return value.split('|');
  const match=/^([maF])([*/+])([maF])$/.exec(value);
  return match?match.slice(1):['','',''];
 }
 function validFormula(value,index){
  if(typeof value!=='string')return false;
  if(value===''||legacyFormulaOptions[index].some(option=>option[0]===value))return true;
  // The plus token only restores formerly offered answers; new controls offer ⋅ and /.
  return /^[maF]?\|[*/+]?\|[maF]?$/.test(value);
 }
 const fresh=()=>({choices:[false,false,false],matches:['',''],formulas:['','',''],earned:Array(6).fill('gray'),assisted:Array(6).fill(false)});
 const array=(v,n,test)=>Array.isArray(v)&&v.length===n&&Array.from(v).every(test);
 function valid(s){
  return !!s&&typeof s==='object'&&!Array.isArray(s)&&Object.keys(s).length===keys.length&&keys.every(k=>Object.hasOwn(s,k))&&
   array(s.choices,3,v=>typeof v==='boolean')&&array(s.matches,2,v=>['','braking','accelerating'].includes(v))&&
   array(s.formulas,3,validFormula)&&
   array(s.earned,6,v=>['gray','green','yellow'].includes(v))&&array(s.assisted,6,v=>typeof v==='boolean');
 }
 const scores=s=>s.earned;
 let mounted=false;
 const inputs={choices:[],matches:[],formulas:[]},statuses=[],dots=[],results=Array(6).fill(null);
 const successes=[
  'Richtig. Ohne resultierende Kraft bleibt ein Körper in Ruhe oder bewegt sich geradlinig mit gleichbleibender Geschwindigkeit weiter.',
  'Richtig: Bild A zeigt das Bremsen.',
  'Richtig: Bild B zeigt das Beschleunigen.',
  'Richtig. Die Kraft ist das Produkt aus Masse und Beschleunigung.',
  'Richtig. Teile F = m · a durch a, um die Masse zu berechnen (für a ≠ 0).',
  'Richtig. Teile F = m · a durch m, um die Beschleunigung zu berechnen (für m > 0).'
 ];
 const failures=[
  'Die Auswahl stimmt noch nicht. Prüfe jede Aussage: Ohne resultierende Kraft ändert sich die Geschwindigkeit weder im Betrag noch in der Richtung.',
  'Diese Zuordnung stimmt noch nicht. Vergleiche die Körperhaltung mit der Fahrtrichtung: Beim Bremsen behält der Körper zunächst seine bisherige Geschwindigkeit bei.',
  'Diese Zuordnung stimmt noch nicht. Beim Anfahren wird der Bus schneller. Der Körper behält zunächst seine bisherige Geschwindigkeit bei.',
  'Diese Formel stimmt noch nicht. Die Grundgleichung lautet: Kraft = Masse mal Beschleunigung.',
  'Diese Umstellung stimmt noch nicht. Teile beide Seiten von F = m · a durch a.',
  'Diese Umstellung stimmt noch nicht. Teile beide Seiten von F = m · a durch m.'
 ];
 function correct(s,index){
  if(index===0)return s.choices.every((v,i)=>v===[true,true,false][i]);
  if(index<3)return s.matches[index-1]===['braking','accelerating'][index-1];
  return [['m*a','a*m'],['F/a'],['F/m']][index-3].includes(formulaSlots(s.formulas[index-3]).join(''));
 }
 function edited(group,index,value){
  if(!loaded||!state?.local||state.ownerUid&&syncIdentity()!==state.ownerUid)return;
  state.local[group][index]=value;results[group==='choices'?0:group==='matches'?index+1:index+3]=null;
  bridge.queueSave(state,D.scores(LESSON,state));render();
 }
 function check(indices){
  if(!loaded||!state?.local||state.ownerUid&&syncIdentity()!==state.ownerUid)return;
  for(const index of indices){
   const right=correct(state.local,index);results[index]=right;
   if(!right){state.local.assisted[index]=true;if(index===1||index===2)state.aspects[index===1?'bus_bremsen':'bus_anfahren'].assisted=true;}
   else if(state.local.earned[index]==='gray')state.local.earned[index]=state.local.assisted[index]?'yellow':'green';
  }
  bridge.save(state,D.scores(LESSON,state));render();
 }
 function section(title,text){
  const box=element('section',undefined,'question local-task');
  box.append(element('h2',title),element('p',text));return box;
 }
 function status(index,parent){
  const line=element('div',undefined,'local-result'),dot=element('span',undefined,'point');
  dot.setAttribute('role','img');dots[index]=dot;
  const text=element('p',undefined,'local-feedback');text.setAttribute('role','status');text.setAttribute('aria-live','polite');
  statuses[index]=text;line.append(dot,text);parent.append(line);
 }
 function button(parent,label,indices){
  const control=element('button',label,'local-check');control.type='button';control.addEventListener('click',()=>check(indices));parent.append(control);
 }
 function select(group,index,label,options){
  const wrapper=element('label',undefined,'local-select-label');wrapper.append(element('span',label));
  const control=element('select');control.setAttribute('aria-label',label);
  for(const [value,text] of [['','Bitte auswählen …'],...options]){const option=element('option',text);option.value=value;control.append(option);}
  control.addEventListener('change',()=>edited(group,index,control.value));inputs[group][index]=control;wrapper.append(control);return wrapper;
 }
 function formulaSelect(index,slot,symbol){
  const names=['erste Größe','Rechenzeichen','zweite Größe'];
  const control=element('select');control.setAttribute('aria-label',symbol+' =: '+names[slot]);control.dataset.slot=String(slot);
  for(const [value,text] of [['','…'],...(slot===1?operatorOptions:quantityOptions)]){
   const option=element('option',text);option.value=value;control.append(option);
  }
  control.addEventListener('change',()=>{
   const values=inputs.formulas[index].map(input=>input.value);
   edited('formulas',index,values.join('|'));
  });
  inputs.formulas[index][slot]=control;return control;
 }
 function mount(){
  if(mounted)return;const questions=q('[data-questions]'),controls=q('[data-controls]');if(!questions||!controls)return;mounted=true;
  const first=section('Aufgabe 1','Kreuze Zutreffendes an.');
  const choices=element('fieldset',undefined,'local-choices');choices.append(element('legend','Wenn keine Kraft wirkt, dann...','condition'));
  ['... bleibt ein unbewegter Körper an der Position, an der er sich befindet.','... bewegt sich ein bewegter Körper mit gleichbleibender Richtung und Geschwindigkeit weiter.','... behält ein beschleunigter Körper seine Beschleunigung und wird immer schneller.'].forEach((text,index)=>{
   const label=element('label',undefined,'local-choice'),control=element('input');control.type='checkbox';control.addEventListener('change',()=>edited('choices',index,control.checked));inputs.choices[index]=control;
   label.append(control,element('span',text));choices.append(label);
  });first.append(choices);button(first,'Auswahl prüfen',[0]);status(0,first);
  const second=section('Aufgabe 2','Ordne die Bilder der passenden Situation zu und erkläre anschließend die Beobachtungen.');
  second.append(element('p','Beide Busse fahren nach rechts.','task-subline'));
  const gallery=element('div',undefined,'local-bus-grid');
  ['A','B'].forEach((letter,index)=>{
   const card=element('figure',undefined,'local-bus-card'),title=element('figcaption','Bild '+letter),drawing=element('div',undefined,'local-bus-drawing');const comic=element('img',undefined,'comic-image');comic.src=BUS_COMIC;comic.alt='Bild '+letter+': Der Bus fährt nach rechts. Die Fahrgäste ohne Rollschuhe neigen sich '+(index===0?'nach vorn. Der Inlineskater hält sich oben fest; seine Füße rollen nach vorn, während sich sein Oberkörper nach hinten neigt.':'nach hinten. Der Inlineskater hält sich oben fest; seine Füße bleiben zurück, während sich sein Oberkörper nach vorn neigt.');comic.width=2048;comic.height=768;drawing.append(comic);title.append(element('span','Fahrtrichtung →','driving-direction'));
   card.append(title,drawing,select('matches',index,'Situation',[['accelerating','Beschleunigen'],['braking','Bremsen']]));status(index+1,card);gallery.append(card);
  });second.append(gallery);button(second,'Zuordnungen prüfen',[1,2]);
  const third=section('Aufgabe 3','Die Gleichung, die die Kraft als Masse mal Beschleunigung definiert, lässt sich umformen, sodass damit, wenn die anderen beiden Größen gegeben sind, die dritte berechnet werden kann. Notiere alle drei äquivalenten Gleichungen.');
  const formulas=element('div',undefined,'local-formula-grid');
  ['F','m','a'].forEach((symbol,index)=>{
   const row=element('div',undefined,'local-formula-card'),equation=element('div',undefined,'formula-equation');
   inputs.formulas[index]=[];equation.append(element('span',symbol+' =','formula-symbol'));
   for(let slot=0;slot<3;slot++)equation.append(formulaSelect(index,slot,symbol));
   row.append(equation);status(index+3,row);formulas.append(row);
  });third.append(formulas);button(third,'Formeln prüfen',[3,4,5]);
  questions.before(first,second);second.append(questions);
  const aiTools=root.querySelector('[data-ai-tools]');if(aiTools)second.append(aiTools);
  controls.append(third);paint();
 }
 function paint(){
  if(!mounted)return;
  const local=state?.local;
  for(const group of ['choices','matches'])inputs[group].forEach((control,index)=>{control.disabled=!loaded;if(local){if(group==='choices')control.checked=local[group][index];else control.value=local[group][index];}});
  inputs.formulas.forEach((controls,index)=>{
   const values=local?formulaSlots(local.formulas[index]):['','',''];
   controls.forEach((control,slot)=>{
    control.disabled=!loaded;
    // Keep old + answers readable without adding + to the choices for new answers.
    let legacy=control.querySelector('[data-legacy-operator]');
    if(slot===1&&values[slot]==='+'){
     if(!legacy){legacy=element('option','+');legacy.value='+';legacy.disabled=true;legacy.setAttribute('data-legacy-operator','');control.append(legacy);}
    }else if(legacy)legacy.remove();
    control.value=values[slot];
   });
  });
  root.querySelectorAll('.local-check').forEach(control=>{control.disabled=!loaded;});
  if(!local)return;
  for(let index=0;index<6;index++){
   const earned=local.earned[index];dots[index].dataset.color=earned;dots[index].setAttribute('aria-label',earned==='gray'?'Punkt noch offen':earned==='green'?'Punkt auf Anhieb erreicht':'Punkt nach Hilfe erreicht');
   statuses[index].dataset.result=results[index]===false?'wrong':results[index]===true?'right':'neutral';
   statuses[index].textContent=results[index]===true?successes[index]:results[index]===false?failures[index]+(earned!=='gray'?' Dein bereits erreichter Punkt bleibt erhalten.':''):earned!=='gray'?'Punkt bereits erreicht. Du kannst deine aktuelle Auswahl erneut prüfen.':local.assisted[index]?'Punkt noch offen. Du kannst deine Antwort ändern und erneut prüfen.':'Ein Punkt · noch offen';
  }
 }
 return {fresh,valid,scores,mount,render:paint};
})();
