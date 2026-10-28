// Generiert durch ../werkstatt/build.cjs. Gemeinsame Quellen dort bearbeiten.
const KIND = 'expand';
const WIDGET_ID = 'brueche-erweitern';
// Fraction models use the proven HTML/CSS-grid approach of Brueche verstehen.
// No image source, data URL, SVG, canvas or external asset is required.
const FractionVisuals=(()=>{
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const integer=value=>{
    if(typeof value==='number'&&!Number.isSafeInteger(value))throw new RangeError('Eine sichere ganze Zahl ist erforderlich.');
    const text=String(value);
    if(!/^\d{1,240}$/.test(text))throw new RangeError('Eine nichtnegative ganze Zahl ist erforderlich.');
    return BigInt(text);
  };
  const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
  const percent=(a,b)=>Number(a*100000000n/b)/1000000;
  function columns(value){
    const d=integer(value);
    if(d<1n)throw new RangeError('Der Nenner muss positiv sein.');
    if(d>128n)return 1;
    let best=1,distance=Infinity;
    for(let c=1;c<=8;c++)if(d%BigInt(c)===0n){
      const next=Math.abs(Math.log(c*c/(Number(d)*160/112)));
      if(next<distance){best=c;distance=next;}
    }
    return best;
  }
  function image({n,d,group=1,color='#19a491',columns:requestedColumns,planColumns,label}={}){
    const numerator=integer(n),denominator=integer(d),groupSize=integer(group);
    if(denominator<1n||groupSize<1n||denominator%groupSize!==0n)throw new RangeError('Ungültige Teilung.');
    if(numerator>denominator*2n)throw new RangeError('Das Modell zeigt höchstens zwei Ganze.');
    const count=denominator<=128n?Number(denominator):0;
    const preserve=planColumns!==undefined;
    const plan=preserve?integer(planColumns):null;
    if(preserve&&(plan<1n||plan>8n))throw new RangeError('Ungültiger Teilungsplan.');
    const cols=preserve?Number(gcd(denominator,plan)):requestedColumns===undefined?columns(denominator):Number(requestedColumns);
    if(!Number.isInteger(cols)||cols<1||cols>8||denominator%BigInt(cols)!==0n)throw new RangeError('Ungültige Spaltenzahl.');
    const wholes=numerator>denominator?2:1;
    const fill=/^#[\da-f]{3,8}$/i.test(color)?color:'#19a491';
    // Every equivalent fraction refines the SAME reduced base grid. A child
    // inherits its parent's color rather than starting a new fill sequence.
    const divisor=gcd(numerator,denominator),baseN=numerator/divisor,baseD=denominator/divisor;
    const baseColumns=preserve?gcd(baseD,plan):1n,baseRows=baseD/baseColumns;
    const description=String(label??`${numerator/groupSize} von ${denominator/groupSize} Teilen${wholes>1?' · zwei Ganze dargestellt':' eines Ganzen'}${groupSize>1n?', jeweils '+groupSize+' kleine Teile zusammengefasst':''}`)+(count?'':', Teilung vereinfacht dargestellt');
    let html=`<div class="fraction-model-image" role="img" aria-label="${escape(description)}" title="${escape(description)}" data-wholes="${wholes}">`;
    for(let whole=0;whole<wholes;whole++){
      const remaining=numerator-BigInt(whole)*denominator,filled=remaining<0n?0n:remaining>denominator?denominator:remaining;
      const baseRemaining=baseN-BigInt(whole)*baseD,baseFilled=baseRemaining<0n?0n:baseRemaining>baseD?baseD:baseRemaining;
      html+=`<div class="fraction-grid-whole${count?'':' fraction-grid-solid'}" data-denominator="${denominator}" data-filled="${filled}" data-anchor-columns="${baseColumns}" data-anchor-denominator="${baseD}" style="--fraction-columns:${cols};--fraction-rows:${count?count/cols:1}">`;
      if(count){
        const rows=count/cols;
        for(let i=0;i<count;i++){
          const column=Math.floor(i/rows),row=i%rows,boundary=BigInt(i+1)%groupSize===0n;
          const bottom=row===rows-1?'0':`${groupSize>1n&&boundary?2:1}px ${groupSize>1n&&!boundary?'dashed':'solid'} #193c43`;
          const left=column===0?'0':`${groupSize>1n?2:1}px solid #193c43`;
          const parentColumn=preserve?BigInt(column)/(BigInt(cols)/baseColumns):0n;
          const parentRow=preserve?BigInt(row)/(BigInt(rows)/baseRows):0n;
          const colored=preserve?parentColumn*baseRows+parentRow<baseFilled:BigInt(i)<filled;
          html+=`<span class="fraction-grid-cell" data-filled="${colored?'1':'0'}" aria-hidden="true" style="background-color:${colored?fill:'#ffffff'}!important;border-bottom:${bottom}!important;border-left:${left}!important"></span>`;
        }
      }else{
        if(preserve){
          const full=baseFilled/baseRows,rest=baseFilled%baseRows;
          if(full>0n)html+=`<span class="fraction-grid-fill" aria-hidden="true" style="left:0!important;top:0!important;width:${percent(full,baseColumns)}%!important;height:100%!important;background-color:${fill}!important"></span>`;
          if(rest>0n)html+=`<span class="fraction-grid-fill" aria-hidden="true" style="left:${percent(full,baseColumns)}%!important;top:0!important;width:${percent(1n,baseColumns)}%!important;height:${percent(rest,baseRows)}%!important;background-color:${fill}!important"></span>`;
        }else html+=`<span class="fraction-grid-fill" aria-hidden="true" style="height:${percent(filled,denominator)}%;background-color:${fill}!important"></span>`;
      }
      html+='</div>';
    }
    return html+'</div>';
  }
  return {image,columns};
})();

'use strict';

const FractionDomain = (() => {
  function integer(value) {
    if (!Number.isSafeInteger(value)) throw new RangeError('Es sind nur sichere ganze Zahlen erlaubt.');
    return Math.abs(value);
  }

  function gcd(a, b) {
    a = integer(a);
    b = integer(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function lcm(a, b) {
    a = integer(a);
    b = integer(b);
    if (!a || !b) return 0;
    const result = a / gcd(a, b) * b;
    if (!Number.isSafeInteger(result)) throw new RangeError('Das kgV ist zu groß.');
    return result;
  }

  // Pick across denominator groups before repeating a group. Within each group,
  // start in the middle and alternate outward to avoid a pool of unit fractions.
  function balanced(candidates, group, count) {
    const buckets = new Map();
    candidates.forEach(task => {
      const key = group(task);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(task);
    });
    const queues = Array.from(buckets.values(), list => {
      const ordered = [];
      let left = Math.floor((list.length - 1) / 2);
      let right = left + 1;
      while (left >= 0 || right < list.length) {
        if (left >= 0) ordered.push(list[left--]);
        if (right < list.length) ordered.push(list[right++]);
      }
      return ordered;
    });
    const selected = [];
    for (let round = 0; selected.length < count; round++) {
      let added = false;
      for (const queue of queues) {
        if (queue[round] && selected.length < count) {
          selected.push(queue[round]);
          added = true;
        }
      }
      if (!added) break;
    }
    return selected;
  }

  function reduceTasks(level) {
    const candidates = [];
    const maxDenominator = level === 1 ? 16 : 36;
    for (let d = level === 1 ? 4 : 12; d <= maxDenominator; d++) {
      for (let n = 1; n < d; n++) {
        const factor = gcd(n, d);
        if (factor > 1 && (level === 2 ? factor >= 3 : factor <= 4)) {
          candidates.push({ n, d, factor });
        }
      }
    }
    // Keep the original sequence and identifiers stable for saved learning states.
    const selected = balanced(candidates, task => task.d, 32);
    const seen = new Set(selected.map(task => `${task.n}/${task.d}`));
    const bases = level === 1 ? [[1, 2], [1, 3], [2, 3], [3, 4]]
      : [[2, 5], [3, 5], [4, 5], [5, 6], [5, 7], [7, 8]];
    // Composite common divisors permit both direct and meaningful staged reduction.
    for (const factor of [4, 6, 8, 9, 10, 12]) {
      // All four level-one factor-4 examples already occur in the legacy prefix.
      // Add one further reduced base so factor 4 also gains a fresh example.
      const factorBases = level === 1 && factor === 4 ? [...bases, [2, 5]] : bases;
      for (const [baseN, baseD] of factorBases) {
        const n = baseN * factor, d = baseD * factor, key = `${n}/${d}`;
        if (seen.has(key)) continue;
        selected.push({ n, d, factor });
        seen.add(key);
      }
    }
    return selected;
  }

  function expandTasks(level) {
    const candidates = [];
    for (let d = 2; d <= (level === 1 ? 8 : 12); d++) {
      for (let factor = level === 1 ? 2 : 3; factor <= (level === 1 ? 3 : 6); factor++) {
        const target = d * factor;
        if (target > (level === 1 ? 24 : 36)) continue;
        for (let n = 1; n < d; n++) {
          if (gcd(n, d) === 1) candidates.push({ n, d, factor, target });
        }
      }
    }
    return balanced(candidates, task => `${task.d}:${task.factor}`, 32);
  }

  function operateTasks(level) {
    const pairs = level === 1
      ? [[2, 4], [3, 6], [4, 8], [2, 6], [3, 9], [4, 12], [6, 12], [2, 8]]
      : [[3, 4], [4, 6], [3, 8], [6, 8], [5, 4], [5, 3], [5, 2], [6, 9]];
    const result = [];
    for (const [d, bd] of pairs) {
      for (const op of ['+', '-']) {
        const candidates = [];
        for (let n = 1; n < d; n++) {
          for (let bn = 1; bn < bd; bn++) {
            if (op === '-' && n * bd < bn * d) continue;
            candidates.push({ n, d, bn, bd, op });
          }
        }
        // Two different numerator combinations per denominator pair and operation.
        result.push(candidates[Math.floor(candidates.length / 5)]);
        result.push(candidates[Math.floor(candidates.length * 4 / 5)]);
      }
    }
    return result;
  }

  const pools = {};
  for (const kind of ['reduce', 'expand', 'operate']) {
    for (const level of [1, 2]) {
      const generated = kind === 'reduce' ? reduceTasks(level)
        : kind === 'expand' ? expandTasks(level) : operateTasks(level);
      pools[`${kind}:${level}`] = generated.map((task, index) => Object.freeze({
        id: `${kind}-${level}-${index + 1}`, kind, level, ...task
      }));
    }
  }

  function tasks(kind, level) {
    if (typeof kind !== 'string' || (level !== 1 && level !== 2)) return [];
    return (pools[`${kind}:${level}`] || []).map(task => ({ ...task }));
  }

  function validTask(task) {
    if (!task || typeof task !== 'object' || Array.isArray(task)) return false;
    if (typeof task.kind !== 'string' || (task.level !== 1 && task.level !== 2)) return false;
    const canonical = (pools[`${task.kind}:${task.level}`] || []).find(item => item.id === task.id);
    if (!canonical) return false;
    const keys = Object.keys(canonical);
    return Object.keys(task).length === keys.length
      && keys.every(key => Object.prototype.hasOwnProperty.call(task, key) && task[key] === canonical[key]);
  }

  const field = (key, label, value) => ({ key, label, value });
  const divisors = value => Array.from({ length: value }, (_, index) => index + 1)
    .filter(candidate => value % candidate === 0).join(', ');
  const multiples = (value, until) => Array.from({ length: until / value }, (_, index) => value * (index + 1)).join(', ');
  const sameStep = () => ({
    title: 'Menge vergleichen',
    text: 'Stellen der Ausgangsbruch und der neue Bruch denselben Anteil am Ganzen dar?',
    fields: [field('same', 'Gleiche Menge? (1 = ja, 0 = nein)', 1)],
    hint: 'Die Teile sind anders eingeteilt. Der Anteil am selben Ganzen bleibt gleich. Wähle: Der Anteil bleibt gleich.',
    explanation: 'Zähler und Nenner wurden mit derselben Zahl multipliziert oder durch dieselbe Zahl geteilt. Der Wert des Bruchs bleibt gleich.'
  });

  function steps(task) {
    if (!validTask(task)) throw new RangeError('Diese Aufgabe gehört nicht zum Aufgabenpool.');
    const { n, d, bn, bd, factor, target, op } = task;
    if (task.kind === 'reduce') {
      const rn = n / factor;
      const rd = d / factor;
      return [{
        title: 'Gemeinsamen Teiler finden',
        text: 'Finde die größte ganze Zahl, durch die sich Zähler und Nenner ohne Rest teilen lassen.',
        fields: [field('factor', 'Größter gemeinsamer Teiler', factor)],
        hint: `Notiere die positiven Teiler beider Zahlen. Teiler von ${n}: ${divisors(n)}. Teiler von ${d}: ${divisors(d)}. Vergleiche beide Listen. Die größte Zahl, die in beiden vorkommt, ist ${factor}: der größte gemeinsame Teiler.`,
        explanation: `${factor} ist der größte gemeinsame Teiler von ${n} und ${d}.`
      }, {
        title: 'Vollständig kürzen',
        text: 'Teile Zähler und Nenner durch den gefundenen größten gemeinsamen Teiler.',
        fields: [field('n', 'Neuer Zähler', rn), field('d', 'Neuer Nenner', rd)],
        hint: `Rechne ${n} : ${factor} und ${d} : ${factor}. Du erhältst ${rn}/${rd}.`,
        explanation: `${n}/${d} = (${n} : ${factor})/(${d} : ${factor}) = ${rn}/${rd}. Dieser Bruch ist vollständig gekürzt.`
      }, sameStep()];
    }
    if (task.kind === 'expand') {
      return [{
        title: 'Erweiterungsfaktor finden',
        text: `Bestimme den Faktor, mit dem du den Nenner multiplizieren musst, um den Zielnenner ${target} zu erhalten.`,
        fields: [field('factor', 'Erweiterungsfaktor', factor)],
        hint: `Teile den Zielnenner durch den bisherigen Nenner: ${target} : ${d} = ${factor}. So findest du den Faktor, mit dem der bisherige Nenner multipliziert werden muss.`,
        explanation: `${d} · ${factor} = ${target}. Der Erweiterungsfaktor ist ${factor}.`
      }, {
        title: 'Bruch erweitern',
        text: 'Multipliziere Zähler und Nenner mit dem gefundenen Erweiterungsfaktor.',
        fields: [field('n', 'Neuer Zähler', n * factor), field('d', 'Neuer Nenner', target)],
        hint: `Rechne ${n} · ${factor} und ${d} · ${factor}. Du erhältst ${n * factor}/${target}.`,
        explanation: `${n}/${d} = (${n} · ${factor})/(${d} · ${factor}) = ${n * factor}/${target}.`
      }, sameStep()];
    }
    const common = lcm(d, bd);
    const left = n * (common / d);
    const right = bn * (common / bd);
    const numerator = op === '+' ? left + right : left - right;
    const divisor = gcd(numerator, common);
    const rn = numerator / divisor;
    const rd = common / divisor;
    return [{
      title: 'Gemeinsamen Nenner finden',
      text: 'Bestimme das kleinste gemeinsame Vielfache der beiden Nenner.',
      fields: [field('common', 'Kleinster gemeinsamer Nenner', common)],
      hint: `Notiere die positiven Vielfachen beider Nenner, bis eine Zahl in beiden Listen vorkommt. Vielfache von ${d}: ${multiples(d, common)}. Vielfache von ${bd}: ${multiples(bd, common)}. Die kleinste gemeinsame Zahl ist ${common}: das kleinste gemeinsame Vielfache.`,
      explanation: `kgV(${d}, ${bd}) = ${common}. Das ist der kleinste gemeinsame Nenner.`
    }, {
      title: 'Gleichnamig machen',
      text: 'Bringe beide Brüche auf den gefundenen gemeinsamen Nenner. Trage ihre neuen Zähler ein.',
      fields: [field('left', 'Neuer Zähler links', left), field('right', 'Neuer Zähler rechts', right)],
      hint: `Multipliziere links mit ${common / d} und rechts mit ${common / bd}. Die neuen Zähler sind ${left} und ${right}.`,
      explanation: `${n}/${d} = ${left}/${common} und ${bn}/${bd} = ${right}/${common}.`
    }, {
      title: op === '+' ? 'Brüche addieren' : 'Brüche subtrahieren',
      text: `Rechne mit den gleichnamigen Brüchen. ${op === '+' ? 'Addiere' : 'Subtrahiere'} die Zähler und behalte den gemeinsamen Nenner. Kürze erst im nächsten Schritt.`,
      fields: [field('n', 'Zähler des Ergebnisses', numerator), field('d', 'Gemeinsamer Nenner', common)],
      hint: `${left} ${op} ${right} = ${numerator}. Der Nenner bleibt ${common}.`,
      explanation: `${left}/${common} ${op} ${right}/${common} = ${numerator}/${common}.`
    }, {
      title: 'Ergebnis vollständig kürzen',
      text: 'Gib das Ergebnis als vollständig gekürzten Bruch an. Ist es bereits vollständig gekürzt, übernimm es unverändert.',
      fields: [field('n', 'Vollständig gekürzter Zähler', rn), field('d', 'Vollständig gekürzter Nenner', rd)],
      hint: divisor === 1 ? `Der Bruch ${numerator}/${common} ist bereits vollständig gekürzt.`
        : `Teile Zähler und Nenner durch ${divisor}. Du erhältst ${rn}/${rd}.`,
      explanation: divisor === 1 ? `${numerator}/${common} ist vollständig gekürzt.`
        : `${numerator}/${common} = (${numerator} : ${divisor})/(${common} : ${divisor}) = ${rn}/${rd}.`
    }];
  }

  return { gcd, lcm, tasks, steps, validTask };
})();

if (typeof module !== 'undefined') module.exports = FractionDomain;

const D=FractionDomain;
const clone=value=>JSON.parse(JSON.stringify(value));
const plain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const exactKeys=(value,keys)=>plain(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
const text=value=>typeof value==='string'&&value.length<=24;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fraction=(n,d)=>`<span class="frac" aria-label="${n} durch ${d}"><span>${n}</span><span>${d}</span></span>`;
const introduction='Beim Erweitern multiplizierst du Zähler und Nenner mit derselben natürlichen Zahl größer als 1. Der Anteil bleibt gleich: Aus 1 von 2 Teilen werden mit dem Faktor 3 genau 3 von 6 kleineren Teilen. Hier ist der Zielnenner vorgegeben. Bestimme zuerst den passenden Faktor und erweitere dann den Bruch.';
// Stable state/test hooks: state, scores, ready, freshActive and render. Index 0:
// factor; index 1: result; index 2: completed. Only check() awards a point.
const freshActive=task=>({task:clone(task),index:0,drafts:[],attempts:[],help:[],feedback:null,legacy:false,legacyAttempts:null});
const selectTask=(level,history)=>{
  const pool=D.tasks('expand',level),used=new Set(history.map(h=>h.task.id)),unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  return choices[Math.floor(Math.random()*choices.length)];
};
const validFeedback=value=>value===null||(exactKeys(value,['text','bad'])&&typeof value.text==='string'&&value.text.length<=2000&&typeof value.bad==='boolean');
const validDraft=value=>plain(value)&&Object.entries(value).every(([key,value])=>['factor','n','d','same','common','left','right'].includes(key)&&text(value));
const valueMatches=(value,expected)=>text(value)&&/^\d+$/.test(value.trim())&&Number(value)===expected;
const answerCorrect=(task,step,answer)=>D.steps(task)[step].fields.every(field=>valueMatches(answer[field.key],field.value));
function validAttempt(attempt,task,legacy=false){
  return exactKeys(attempt,['step','answer','correct'])&&Number.isInteger(attempt.step)&&attempt.step>=0&&attempt.step<(legacy?3:2)&&validDraft(attempt.answer)&&(legacy||exactKeys(attempt.answer,attempt.step===0?['factor']:['n','d']))&&typeof attempt.correct==='boolean'&&attempt.correct===answerCorrect(task,attempt.step,attempt.answer);
}
function validOldActive(a){
  if(!exactKeys(a,['task','index','drafts','attempts','help','feedback'])||!D.validTask(a.task)||a.task.kind!=='expand'||!Number.isInteger(a.index)||a.index<0||a.index>3||!Array.isArray(a.drafts)||a.drafts.length>3||!a.drafts.every(validDraft)||!Array.isArray(a.attempts)||!a.attempts.every(v=>validAttempt(v,a.task,true))||!Array.isArray(a.help)||!a.help.every(v=>Number.isInteger(v)&&v>=0&&v<3)||!validFeedback(a.feedback))return false;
  for(let i=0;i<a.index;i++)if(!a.drafts[i]||!answerCorrect(a.task,i,a.drafts[i]))return false;
  return true;
}
function validActive(a){
  if(!exactKeys(a,['task','index','drafts','attempts','help','feedback','legacy','legacyAttempts'])||!D.validTask(a.task)||a.task.kind!=='expand'||typeof a.legacy!=='boolean'||!Number.isInteger(a.index)||a.index<0||a.index>2||!Array.isArray(a.drafts)||a.drafts.length>(a.legacy?3:2)||!a.drafts.every(validDraft)||!Array.isArray(a.attempts)||!a.attempts.every(v=>validAttempt(v,a.task,a.legacy))||!Array.isArray(a.help)||!a.help.every(v=>Number.isInteger(v)&&v>=0&&v<(a.legacy?3:2))||!validFeedback(a.feedback))return false;
  if(a.legacyAttempts!==null&&(!a.legacy||!Array.isArray(a.legacyAttempts)||!a.legacyAttempts.every(v=>validAttempt(v,a.task,true))))return false;
  for(let i=0;i<a.index;i++)if(!a.drafts[i]||!answerCorrect(a.task,i,a.drafts[i]))return false;
  if(!a.legacy&&a.drafts.some((draft,index)=>Object.keys(draft).some(key=>!(index===0?['factor']:['n','d']).includes(key))))return false;
  return true;
}
function validState(s){return exactKeys(s,['level','active','history','intro'])&&[1,2].includes(s.level)&&typeof s.intro==='boolean'&&validActive(s.active)&&s.active.task.level===s.level&&Array.isArray(s.history)&&s.history.every(h=>validActive(h)&&h.index===2);}
function migrateSnapshot(snapshot){
  if(!exactKeys(snapshot,['widget','version','data','scores'])||snapshot.widget!=='brueche-erweitern'||snapshot.version!==1||!Array.isArray(snapshot.scores)||snapshot.scores.length!==20||snapshot.scores.some(v=>!['gray','green','yellow','red'].includes(v)))throw new Error('Dieser ältere Lernstand kann nicht übernommen werden. Das Original bleibt erhalten.');
  const s=snapshot.data;
  if(!exactKeys(s,['level','active','history','intro'])||![1,2].includes(s.level)||typeof s.intro!=='boolean'||!validOldActive(s.active)||s.active.task.level!==s.level||!Array.isArray(s.history)||!s.history.every(h=>validOldActive(h)&&h.index===3))throw new Error('Der ältere Erweiterungsstand ist beschädigt. Das Original bleibt erhalten.');
  const convert=a=>{
    const next={...clone(a),index:a.index===3?2:a.index===2?1:a.index,legacy:true,legacyAttempts:null};
    if(a.index===2)next.feedback={text:'Dein Bruch wurde bereits richtig geprüft. Bestätige ihn mit „Bruch prüfen“, um die Aufgabe abzuschließen.',bad:false};
    return next;
  };
  const migrated={widget:snapshot.widget,version:2,data:{level:s.level,active:convert(s.active),history:s.history.map(convert),intro:s.intro},scores:clone(snapshot.scores)};
  if(!validState(migrated.data))throw new Error('Der ältere Erweiterungsstand konnte nicht vollständig übernommen werden. Das Original bleibt erhalten.');
  return migrated;
}
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:2,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),validate:validState,migrateSnapshot,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
const tainted=a=>a.help.length>0||a.attempts.some(v=>!v.correct)||!!a.legacyAttempts?.some(v=>!v.correct);
function save(immediate=false){try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{}}
function diagram(task,result=false){
  const {n,d,factor}=task,count=result?d*factor:d,filled=result?n*factor:n;
  const image=FractionVisuals.image({n:filled,d:count,group:result?factor:1,columns:FractionVisuals.columns(d),label:`${filled} von ${count} Teilen eines Ganzen${result?', jedes ursprüngliche Teil in '+factor+' kleine Teile unterteilt':''}`});
  return `<figure class="expand-diagram ${result?'result':'original'}" ${result?'data-result-model':''}>${image}<figcaption>${result?`Jedes Teil → ${factor} Teilstücke`:'Ein Ganzes'}</figcaption></figure>`;
}
function renderEquations(){
  const a=state.active,t=a.task,factor=a.drafts[0]?.factor||'',result=a.drafts[1]||{},preview=a.attempts.filter(v=>v.step===1).at(-1),done=a.index===2;
  const factorHTML=a.index===0?`<label class="factor-input"><span class="sr-only">Erweiterungsfaktor</span><input data-key="factor" aria-label="Erweiterungsfaktor" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(factor)}" ${a.feedback?.bad?'aria-invalid="true"':''}></label>`:`<span class="expand-factor" aria-label="Erweiterungsfaktor ${t.factor}">${t.factor}</span>`;
  const input=(key,label,expected)=>`<input data-key="${key}" aria-label="${label}" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(result[key]||'')}" aria-invalid="${!!preview&&!valueMatches(result[key]||'',expected)}">`;
  const answer=done?fraction(t.n*t.factor,t.target):a.index===1?`<div class="expand-fraction-input">${input('n','Neuer Zähler',t.n*t.factor)}<span class="expand-input-rule" aria-hidden="true"></span><span class="fixed-denominator" aria-label="Vorgegebener Nenner ${t.target}">${t.target}</span></div>`:fraction('?',t.target);
  q('[data-equations]').innerHTML=`<section class="expand-round" aria-label="Bruch erweitern"><p class="expand-target">Erweitere auf den Nenner ${t.target}.</p><div class="expand-equation"><div class="expand-number">${fraction(t.n,t.d)}</div><div class="expand-sign">${factorHTML}<span class="equals">=</span></div><div class="expand-number">${answer}</div>${diagram(t)}${preview?diagram(t,true):''}</div></section>`;
}
function renderHistory(){
  const history=state.history,clean=history.filter(h=>!tainted(h)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  const answerText=(task,attempt)=>D.steps(task)[attempt.step].fields.map(field=>`${field.label}: ${attempt.answer[field.key]||'leer'}`).join(', ');
  const attemptsHTML=h=>[...h.attempts,...(h.legacyAttempts||[])].map(v=>`<li>${v.step===2?'Bisheriger Vergleich':`Schritt ${v.step+1}`}: ${esc(answerText(h.task,v))} – ${v.correct?'richtig':'noch nicht richtig'}</li>`).join('');
  q('[data-history]').innerHTML=history.length?history.map(h=>`<li><details><summary>${h.task.n}/${h.task.d} auf Nenner ${h.task.target} · Stufe ${h.task.level} · ${tainted(h)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><p>${h.task.n}/${h.task.d} mit Faktor ${h.task.factor} erweitert: ${h.task.n*h.task.factor}/${h.task.target}</p><details><summary>Meine Versuche</summary><ol>${attemptsHTML(h)}</ol>${h.help.length?`<p>Tipp genutzt in Schritt ${h.help.map(i=>i+1).join(', ')}.</p>`:''}</details></details></li>`).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function render(){
  const a=state.active,done=a.index===2;
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`Schritt ${a.index+1} von 2 · ${a.index===0?'Erweiterungsfaktor finden':'Neuen Zähler berechnen'}`;
  q('[data-heading]').textContent=done?'Richtig erweitert!':a.index===0?'Finde den passenden Erweiterungsfaktor.':'Berechne den neuen Zähler.';
  q('[data-instruction]').textContent=done?'Der Bruch hat jetzt den Zielnenner. Die gleich große farbige Fläche zeigt: Der Anteil bleibt beim Erweitern gleich.':a.index===0?`Mit welcher Zahl musst du ${a.task.d} multiplizieren, um den Zielnenner ${a.task.target} zu erhalten? Trage den Faktor über dem Gleichheitszeichen ein.`:`Multipliziere den Zähler mit ${a.task.factor}. Der Zielnenner ${a.task.target} ist schon vorgegeben.`;
  q('[data-check]').hidden=done;q('[data-check]').textContent=a.index===0?'Faktor prüfen':'Bruch prüfen';q('[data-hint]').hidden=done;q('[data-next]').hidden=!done;
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);
  q('[data-rating]').hidden=!tainted(a);q('[data-hint-text]').hidden=done||!a.help.includes(a.index);q('[data-hint-text]').textContent=done?'':D.steps(a.task)[a.index].hint;
  q('[data-introduction]').textContent=introduction;q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;
  q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');renderEquations();renderHistory();
}
q('[data-equations]').addEventListener('input',e=>{
  if(!ready||!e.target.dataset.key||state.active.index===2)return;
  (state.active.drafts[state.active.index]||={})[e.target.dataset.key]=e.target.value;e.target.removeAttribute('aria-invalid');save();
});
function check(){
  if(!ready||state.active.index===2)return;
  // Keep the existing storage format; the target denominator is supplied,
  // including when resuming a previous editable-denominator draft.
  if(state.active.index===1)(state.active.drafts[1]||={}).d=String(state.active.task.target);
  const a=state.active,step=a.index,fields=D.steps(a.task)[step].fields,draft=a.drafts[step]||{},answer=Object.fromEntries(fields.map(f=>[f.key,draft[f.key]||''])),correct=answerCorrect(a.task,step,answer);
  a.attempts.push({step,answer,correct});
  if(correct){
    a.index++;
    a.feedback={text:step===0?`Richtig! Multipliziere Zähler und Nenner mit ${a.task.factor}.`:'Richtig! Du hast den Bruch auf den vorgegebenen Nenner erweitert.',bad:false};
    if(a.index===2){const slot=state.history.length;if(slot<scores.length)scores[slot]=tainted(a)?'yellow':'green';state.history.push(clone(a));}
  }else a.feedback={text:step===0?`Noch nicht richtig. Der Faktor muss ${a.task.d} auf den Zielnenner ${a.task.target} bringen.`:`Noch nicht richtig. Multipliziere Zähler und Nenner mit ${a.task.factor}. Vergleiche die Unterteilung im Bild mit deinem Bruch.`,bad:true};
  save(true);render();if(correct)q(a.index===2?'[data-next]':'[data-key="n"]').focus();
}
q('[data-check]').addEventListener('click',check);
q('[data-equations]').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();check();}});
q('[data-hint]').addEventListener('click',()=>{if(!ready||state.active.index===2)return;const a=state.active;if(!a.help.includes(a.index))a.help.push(a.index);save(true);q('[data-hint-text]').textContent=D.steps(a.task)[a.index].hint;q('[data-hint-text]').hidden=false;q('[data-rating]').hidden=false;});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-introduction]').textContent=introduction;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
function next(level){if(!ready||state.active.index!==2)return;state.level=level;state.active=freshActive(selectTask(level,state.history));save(true);render();q('[data-key="factor"]').focus();}
q('[data-next]').addEventListener('click',()=>next(state.level));q('[data-level]').addEventListener('change',()=>next(Number(q('[data-level]').value)));
async function start(){ready=false;q('[data-controls]').disabled=true;try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}}
q('[data-retry]').addEventListener('click',start);start();
