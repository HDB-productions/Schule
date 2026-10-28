// Generiert durch ../werkstatt/build.cjs. Gemeinsame Quellen dort bearbeiten.
const KIND = 'reduce';
const WIDGET_ID = 'brueche-kuerzen';
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

'use strict';

const ReduceDomain = (() => {
  const D = typeof FractionDomain !== 'undefined' ? FractionDomain : require('./domain.js');
  const clone = value => JSON.parse(JSON.stringify(value));
  const phases = ['factor', 'result', 'again', 'done'];
  const text = value => typeof value === 'string' && value.length <= 24;
  const plain = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const exactKeys = (value, keys) => plain(value) && Object.keys(value).length === keys.length && keys.every(k => Object.hasOwn(value, k));
  function positive(value) {
    if (!text(value) || !/^\d+$/.test(value.trim())) return null;
    const n = Number(value);
    return Number.isSafeInteger(n) && n > 0 ? n : null;
  }
  const canReduce = (n,d) => Number.isSafeInteger(n) && Number.isSafeInteger(d) && n > 0 && d > 0 && D.gcd(n,d) > 1;
  const round = (n,d) => ({n,d,factor:null,draftFactor:'',draftN:'',draftD:'',preview:null,solved:false,again:''});
  function fresh(task) {
    if (!D.validTask(task) || task.kind !== 'reduce') throw new RangeError('Unbekannte Kürzungsaufgabe.');
    return {task:clone(task),phase:'factor',rounds:[round(task.n,task.d)],attempts:[],help:[],feedback:null,legacy:false,hadError:false,legacyAttempts:null};
  }
  const current = active => active.rounds.at(-1);
  const validFactor = (r,value) => Number.isSafeInteger(value) && value > 1 && r.n % value === 0 && r.d % value === 0;
  function expected(r,phase,answer) {
    if (phase === 'factor') return validFactor(r,positive(answer.factor));
    if (phase === 'result') return positive(answer.n) === r.n/r.factor && positive(answer.d) === r.d/r.factor;
    if (phase === 'again') return answer.again === (canReduce(r.n/r.factor,r.d/r.factor)?'yes':'no');
    return false;
  }
  function validAnswer(phase,answer) {
    const keys = phase === 'factor' ? ['factor'] : phase === 'result' ? ['n','d'] : ['again'];
    return exactKeys(answer,keys) && keys.every(k=>text(answer[k])) && (phase!=='again' || ['','yes','no'].includes(answer.again));
  }
  function check(active,answer) {
    if (!validActive(active)) throw new RangeError('Ungültiger Kürzungsstand.');
    if (active.phase === 'done') return {correct:false,completed:false};
    const phase=active.phase,r=current(active),index=active.rounds.length-1;
    if (!validAnswer(phase,answer)) throw new TypeError('Ungültige Antwortfelder.');
    const correct=expected(r,phase,answer);
    active.attempts.push({round:index,phase,answer:clone(answer),correct});
    if (!correct) active.hadError=true;
    if (phase === 'factor') {
      r.draftFactor=answer.factor;
      if (correct) {
        r.factor=positive(answer.factor);active.phase='result';
        active.feedback={text:`Richtig! Teile Zähler und Nenner durch ${r.factor}. Trage den neuen Bruch ein.`,bad:false};
      } else active.feedback={text:'Noch nicht richtig. Die Kürzungszahl muss größer als 1 sein und Zähler und Nenner ohne Rest teilen.',bad:true};
    } else if (phase === 'result') {
      r.draftN=answer.n;r.draftD=answer.d;r.preview={n:answer.n,d:answer.d,correct};
      if (correct) {
        r.solved=true;active.phase='again';
        active.feedback={text:'Richtig gekürzt. Kannst du den neuen Bruch noch weiter kürzen?',bad:false};
      } else active.feedback={text:`Noch nicht richtig. Jeweils ${r.factor} Teile werden zu einem Teil zusammengefasst. Teile Zähler und Nenner durch ${r.factor}. Vergleiche deinen Bruch mit dem Bild.`,bad:true};
    } else {
      r.again=answer.again;
      if (correct && answer.again === 'yes') {
        active.rounds.push(round(r.n/r.factor,r.d/r.factor));active.phase='factor';
        active.feedback={text:'Ja, du kannst weiter kürzen. Finde wieder einen möglichst großen gemeinsamen Teiler.',bad:false};
      } else if (correct) {
        active.phase='done';active.feedback={text:'Richtig! Der Bruch ist jetzt vollständig gekürzt.',bad:false};
      } else active.feedback={text:answer.again===''?'Wähle Ja oder Nein.':canReduce(r.n/r.factor,r.d/r.factor)?'Du kannst noch weiter kürzen: Suche eine Zahl größer als 1, die beide Zahlen ohne Rest teilt.':'Der Bruch ist vollständig gekürzt. Zähler und Nenner haben keinen gemeinsamen Teiler größer als 1.',bad:true};
    }
    return {correct,completed:active.phase==='done'};
  }
  const validFeedback = value => value===null || (exactKeys(value,['text','bad']) && typeof value.text==='string' && value.text.length<=2000 && typeof value.bad==='boolean');
  const oldDraft = value => plain(value) && Object.entries(value).every(([k,v])=>['n','d','factor','same','common','left','right'].includes(k) && text(v));
  function oldAttempt(value) {
    return exactKeys(value,['step','answer','correct']) && Number.isInteger(value.step) && value.step>=0 && value.step<3 && typeof value.correct==='boolean' && oldDraft(value.answer);
  }
  function validActive(a) {
    if (!exactKeys(a,['task','phase','rounds','attempts','help','feedback','legacy','hadError','legacyAttempts']) || !D.validTask(a.task) || a.task.kind!=='reduce' || !phases.includes(a.phase) || typeof a.legacy!=='boolean' || typeof a.hadError!=='boolean' || !validFeedback(a.feedback)) return false;
    if (!Array.isArray(a.rounds) || !a.rounds.length || a.rounds.length>6 || !Array.isArray(a.attempts) || !Array.isArray(a.help) || !a.help.every(h=>typeof h==='string' && (/^\d+:(factor|result|again)$/.test(h)?Number(h.split(':')[0])<a.rounds.length:/^legacy:[0-2]$/.test(h)))) return false;
    if (a.legacyAttempts!==null && (!a.legacy || !Array.isArray(a.legacyAttempts) || !a.legacyAttempts.every(oldAttempt))) return false;
    let previousN=a.task.n,previousD=a.task.d;
    for (let i=0;i<a.rounds.length;i++) {
      const r=a.rounds[i],last=i===a.rounds.length-1;
      if (!exactKeys(r,['n','d','factor','draftFactor','draftN','draftD','preview','solved','again']) || r.n!==previousN || r.d!==previousD || ![r.draftFactor,r.draftN,r.draftD].every(text) || typeof r.solved!=='boolean' || !['','yes','no'].includes(r.again)) return false;
      if (r.factor!==null && !validFactor(r,r.factor)) return false;
      if (r.preview!==null && (!exactKeys(r.preview,['n','d','correct']) || !text(r.preview.n) || !text(r.preview.d) || typeof r.preview.correct!=='boolean' || r.factor===null || r.preview.correct!==expected(r,'result',r.preview))) return false;
      if (r.solved && (r.factor===null || !r.preview?.correct || !expected(r,'result',{n:r.draftN,d:r.draftD}))) return false;
      if (!last && (!r.solved || r.again!=='yes' || !canReduce(r.n/r.factor,r.d/r.factor))) return false;
      if (last) {
        if (a.phase==='factor' && (r.factor!==null || r.solved || r.preview!==null)) return false;
        if (a.phase==='result' && (r.factor===null || r.solved || r.preview?.correct)) return false;
        if (['again','done'].includes(a.phase) && !r.solved) return false;
        if (a.phase==='done' && (r.again!=='no' || canReduce(r.n/r.factor,r.d/r.factor))) return false;
      }
      previousN=r.n/r.factor;previousD=r.d/r.factor;
    }
    for (const attempt of a.attempts) {
      if (!exactKeys(attempt,['round','phase','answer','correct']) || !Number.isInteger(attempt.round) || attempt.round<0 || attempt.round>=a.rounds.length || !['factor','result','again'].includes(attempt.phase) || !validAnswer(attempt.phase,attempt.answer) || typeof attempt.correct!=='boolean' || expected(a.rounds[attempt.round],attempt.phase,attempt.answer)!==attempt.correct) return false;
    }
    if (a.attempts.some(v=>!v.correct) && !a.hadError) return false;
    return true;
  }
  function validState(s) {
    return exactKeys(s,['level','active','history','intro']) && [1,2].includes(s.level) && typeof s.intro==='boolean' && validActive(s.active) && s.active.task.level===s.level && Array.isArray(s.history) && s.history.every(h=>validActive(h)&&h.phase==='done');
  }
  function validOldActive(a) {
    if (!exactKeys(a,['task','index','drafts','attempts','help','feedback']) || !D.validTask(a.task) || a.task.kind!=='reduce' || !Number.isInteger(a.index) || a.index<0 || a.index>3 || !Array.isArray(a.drafts) || a.drafts.length>3 || !a.drafts.every(oldDraft) || !Array.isArray(a.attempts) || !a.attempts.every(oldAttempt) || !Array.isArray(a.help) || !a.help.every(v=>Number.isInteger(v)&&v>=0&&v<3) || !validFeedback(a.feedback)) return false;
    const steps=D.steps(a.task);
    const correctAt = (index,answer) => steps[index].fields.every(f=>positive(answer[f.key])===f.value);
    if (a.attempts.some(v=>v.correct!==correctAt(v.step,v.answer))) return false;
    for (let index=0;index<a.index;index++) if (!a.drafts[index] || !correctAt(index,a.drafts[index])) return false;
    return true;
  }
  function convertOld(a) {
    const next=fresh(a.task),r=current(next);
    next.legacy=true;next.legacyAttempts=clone(a.attempts);next.help=a.help.map(i=>`legacy:${i}`);next.hadError=a.attempts.some(v=>!v.correct)||a.help.length>0;next.feedback=clone(a.feedback);
    r.draftFactor=a.drafts[0]?.factor||'';
    if (a.index>=1) {r.factor=a.task.factor;next.phase='result';r.draftN=a.drafts[1]?.n||'';r.draftD=a.drafts[1]?.d||'';}
    if (a.index===1) {
      const attempts=a.attempts.filter(v=>v.step===1);
      const last=attempts.at(-1);
      if(last)r.preview={n:last.answer.n||'',d:last.answer.d||'',correct:last.correct};
    }
    if (a.index>=2) {r.solved=true;r.preview={n:r.draftN,d:r.draftD,correct:true};next.phase=a.index===3?'done':'again';if(a.index===3)r.again='no';}
    return next;
  }
  function migrateSnapshot(snapshot) {
    if (!exactKeys(snapshot,['widget','version','data','scores']) || snapshot.widget!=='brueche-kuerzen' || snapshot.version!==1 || !Array.isArray(snapshot.scores) || snapshot.scores.length!==20 || snapshot.scores.some(v=>!['gray','green','yellow','red'].includes(v))) throw new Error('Dieser ältere Lernstand kann nicht übernommen werden.');
    const s=snapshot.data;
    if (!exactKeys(s,['level','active','history','intro']) || ![1,2].includes(s.level) || typeof s.intro!=='boolean' || !validOldActive(s.active) || s.active.task.level!==s.level || !Array.isArray(s.history) || !s.history.every(h=>validOldActive(h)&&h.index===3)) throw new Error('Der ältere Kürzungsstand ist beschädigt. Das Original bleibt erhalten.');
    const migrated={widget:snapshot.widget,version:2,data:{level:s.level,active:convertOld(s.active),history:s.history.map(convertOld),intro:s.intro},scores:clone(snapshot.scores)};
    if (!validState(migrated.data)) throw new Error('Der ältere Kürzungsstand konnte nicht vollständig übernommen werden.');
    return migrated;
  }
  return {fresh,current,check,canReduce,validActive,validState,migrateSnapshot};
})();

if (typeof module !== 'undefined') module.exports = ReduceDomain;

const D=FractionDomain,R=ReduceDomain;
const freshActive=task=>R.fresh(task);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fraction=(n,d)=>`<span class="frac" aria-label="${n} durch ${d}"><span>${n}</span><span>${d}</span></span>`;
const introduction='Beim Kürzen teilst du Zähler und Nenner durch dieselbe natürliche Zahl größer als 1. Suche einen möglichst großen gemeinsamen Teiler. Auch ein kleinerer gemeinsamer Teiler ist richtig: Du kannst danach weiter kürzen. Beispiel: 12/24 : 2 ergibt 6/12. Daraus wird mit : 3 der Bruch 2/4 und mit : 2 schließlich 1/2. Nach jedem Ergebnis entscheidest du, ob du noch weiter kürzen kannst.';
const selectTask=(level,history)=>{
  const pool=D.tasks('reduce',level),used=new Set(history.map(h=>h.task.id)),unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  // Four of every five selections prioritize composite divisors. Rotate among
  // the least-practised divisor groups instead of letting small primes dominate.
  const completed=history.filter(h=>h.task.level===level);
  if(completed.length%5!==4){
    const factors=[4,6,8,9,10,12],groups=factors.map(factor=>({factor,tasks:choices.filter(t=>t.factor===factor),done:completed.filter(h=>h.task.factor===factor).length})).filter(g=>g.tasks.length);
    if(groups.length){const minimum=Math.min(...groups.map(g=>g.done)),least=groups.filter(g=>g.done===minimum),group=least[Math.floor(Math.random()*least.length)];return group.tasks[Math.floor(Math.random()*group.tasks.length)];}
  }
  return choices[Math.floor(Math.random()*choices.length)];
};
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:2,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),
  validate:R.validState,migrateSnapshot:R.migrateSnapshot,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
function save(immediate=false){try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{}}
const tainted=a=>a.hadError||a.help.length>0||a.attempts.some(v=>!v.correct);
function diagram(n,d,group=1,result=false) {
  // Keep every group inside a column, including when the learner chooses a
  // smaller divisor before completing the reduction in another round.
  const reducedDenominator=d/D.gcd(n,d);
  let columns=1;
  for(let c=1;c<=8;c++)if(reducedDenominator%c===0)columns=c;
  const image=FractionVisuals.image({n,d,group,columns});
  const caption=result?`Je ${group} Teile → 1 Teil`:'Ein Ganzes';
  return `<figure class="reduce-diagram ${result?'result':'original'}" ${result?'data-result-model':''}>${image}<figcaption>${caption}</figcaption></figure>`;
}
function renderEquations() {
  const a=state.active;
  const rounds=a.rounds.map((r,index)=>{
    const active=index===a.rounds.length-1,editingFactor=active&&a.phase==='factor',editingResult=active&&a.phase==='result';
    const factor=editingFactor?`<label class="factor-input"><span class="sr-only">Kürzungszahl</span><input data-key="factor" aria-label="Kürzungszahl" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(r.draftFactor)}" ${a.feedback?.bad?'aria-invalid="true"':''}></label>`:`<span class="reduce-factor" aria-label="Kürzungszahl ${r.factor}">${r.factor}</span>`;
    const validEntry=(value,expected)=>/^\d+$/.test(value.trim())&&Number(value)===expected;
    const invalidN=!!r.preview&&!r.preview.correct&&!validEntry(r.preview.n,r.n/r.factor);
    const invalidD=!!r.preview&&!r.preview.correct&&!validEntry(r.preview.d,r.d/r.factor);
    let answer='';
    if(editingResult)answer=`<div class="reduce-fraction-input"><input data-key="n" aria-label="Neuer Zähler" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(r.draftN)}" aria-invalid="${invalidN}"><span class="reduce-input-rule" aria-hidden="true"></span><input data-key="d" aria-label="Neuer Nenner" inputmode="numeric" autocomplete="off" maxlength="24" value="${esc(r.draftD)}" aria-invalid="${invalidD}"></div>`;
    else if(r.solved)answer=fraction(r.n/r.factor,r.d/r.factor);
    return `<section class="reduce-round" aria-label="Kürzung ${index+1}"><p class="reduce-round-label">${index+1}. Kürzung</p><div class="reduce-equation"><div class="reduce-number">${fraction(r.n,r.d)}</div><div class="reduce-sign"><span class="equals">=</span>${factor}</div><div class="reduce-number">${answer}</div>${diagram(r.n,r.d)}${r.preview?diagram(r.n,r.d,r.factor,true):''}</div></section>`;
  });
  q('[data-equations]').innerHTML=(rounds.length>1?`<details class="prior-steps"><summary>Vorherige Kürzungen (${rounds.length-1})</summary>${rounds.slice(0,-1).join('')}</details>`:'')+rounds.at(-1);
}
function renderHistory() {
  const history=state.history,clean=history.filter(h=>!tainted(h)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  const answerText=attempt=>attempt.phase==='factor'?`Kürzungszahl: ${attempt.answer.factor||'leer'}`:attempt.phase==='result'?`Bruch: ${attempt.answer.n||'leer'}/${attempt.answer.d||'leer'}`:`Weiter kürzen? ${attempt.answer.again==='yes'?'Ja':attempt.answer.again==='no'?'Nein':'keine Auswahl'}`;
  q('[data-history]').innerHTML=history.length?history.map(h=>`<li><details><summary>${h.task.n}/${h.task.d} · Stufe ${h.task.level} · ${tainted(h)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><ol>${h.rounds.map(r=>`<li>${r.n}/${r.d} mit ${r.factor} kürzen: ${r.n/r.factor}/${r.d/r.factor}</li>`).join('')}</ol><details><summary>Meine Versuche</summary><ol>${h.attempts.map(attempt=>`<li>${attempt.round+1}. Kürzung · ${esc(answerText(attempt))} – ${attempt.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>${h.help.length?'<p>Tipp genutzt.</p>':''}${h.legacyAttempts?`<p>Aus der bisherigen Übung übernommen.</p><ol>${h.legacyAttempts.map(attempt=>`<li>Schritt ${attempt.step+1}: ${esc(Object.entries(attempt.answer).map(([key,value])=>`${key==='factor'?'Kürzungszahl':key==='n'?'Zähler':key==='d'?'Nenner':'Vergleich'}: ${value}`).join(', '))} – ${attempt.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>`:''}</details></details></li>`).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function hint() {
  const a=state.active,r=a.rounds.at(-1);
  if(a.phase==='factor') {
    const divisors=Array.from({length:Math.min(r.n,r.d)-1},(_,i)=>i+2).filter(k=>r.n%k===0&&r.d%k===0);
    return `Suche Zahlen größer als 1, durch die ${r.n} und ${r.d} ohne Rest teilbar sind. Gemeinsame Teiler sind: ${divisors.join(', ')}. Jede dieser Zahlen ist erlaubt. Mit einer großen Zahl geht es oft schneller.`;
  }
  if(a.phase==='result')return `Je ${r.factor} kleine Teile werden zu einem größeren Teil. Rechne ${r.n} : ${r.factor} = ${r.n/r.factor} und ${r.d} : ${r.factor} = ${r.d/r.factor}.`;
  const n=r.n/r.factor,d=r.d/r.factor,divisor=D.gcd(n,d);
  return divisor>1?`${n} und ${d} sind beide durch ${divisor} teilbar. Du kannst weiter kürzen. Wähle „Ja“.`:`${n} und ${d} haben keinen gemeinsamen Teiler größer als 1. Der Bruch ist vollständig gekürzt. Wähle „Nein“.`;
}
function render() {
  const a=state.active,done=a.phase==='done';
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`${a.rounds.length}. Kürzung · ${a.phase==='factor'?'Kürzungszahl wählen':a.phase==='result'?'Zähler und Nenner teilen':'Ergebnis untersuchen'}`;
  q('[data-heading]').textContent={factor:'Wähle eine Kürzungszahl.',result:'Kürze Zähler und Nenner.',again:'Kannst du weiter kürzen?',done:'Vollständig gekürzt!'}[a.phase];
  q('[data-instruction]').textContent={factor:'Finde einen möglichst großen gemeinsamen Teiler. Jeder gemeinsame Teiler größer als 1 ist erlaubt.',result:`Teile Zähler und Nenner durch ${a.rounds.at(-1).factor}. Trage den neuen Bruch ein.`,again:'Haben Zähler und Nenner noch einen gemeinsamen Teiler größer als 1?',done:'Zähler und Nenner haben keinen gemeinsamen Teiler größer als 1 mehr.'}[a.phase];
  q('[data-check]').hidden=done||a.phase==='again';q('[data-check]').textContent=a.phase==='factor'?'Kürzungszahl prüfen':'Bruch prüfen';q('[data-hint]').hidden=done;
  q('[data-decisions]').hidden=a.phase!=='again';q('[data-next]').hidden=!done;
  (a.phase==='again'?q('[data-decisions]'):q('.reduce-actions')).append(q('[data-hint]'));
  q('.reduce-actions').hidden=done||a.phase==='again';
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);
  q('[data-rating]').hidden=!tainted(a);
  q('[data-hint-text]').hidden=done||!a.help.includes(`${a.rounds.length-1}:${a.phase}`);q('[data-hint-text]').textContent=done?'':hint();
  q('[data-introduction]').textContent=introduction;q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;
  q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');
  renderEquations();renderHistory();
}
q('[data-equations]').addEventListener('input',e=>{
  if(!ready||!e.target.dataset.key)return;const r=state.active.rounds.at(-1),key=e.target.dataset.key;
  const mapping={factor:'draftFactor',n:'draftN',d:'draftD'};r[mapping[key]]=e.target.value;
  e.target.removeAttribute('aria-invalid');save();
});
function check(again) {
  if(!ready||state.active.phase==='done')return;
  const a=state.active,r=a.rounds.at(-1),answer=a.phase==='factor'?{factor:r.draftFactor}:a.phase==='result'?{n:r.draftN,d:r.draftD}:{again};
  const result=R.check(a,answer);
  if(result.completed) {
    const slot=state.history.length;if(slot<scores.length)scores[slot]=tainted(a)?'yellow':'green';
    state.history.push(JSON.parse(JSON.stringify(a)));
  }
  save(true);render();
  if(result.correct)q(a.phase==='done'?'[data-next]':a.phase==='factor'?'[data-key="factor"]':a.phase==='result'?'[data-key="n"]':'[data-heading]').focus();
}
q('[data-check]').addEventListener('click',()=>check());
q('[data-equations]').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();check();}});
q('[data-decisions]').addEventListener('click',e=>{const button=e.target.closest('[data-again]');if(button&&state.active.phase==='again')check(button.dataset.again);});
q('[data-hint]').addEventListener('click',()=>{
  if(!ready||state.active.phase==='done')return;const a=state.active,key=`${a.rounds.length-1}:${a.phase}`;
  if(!a.help.includes(key))a.help.push(key);save(true);q('[data-hint-text]').textContent=hint();q('[data-hint-text]').hidden=false;q('[data-rating]').hidden=false;
});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-introduction]').textContent=introduction;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
function next(level) {if(!ready||state.active.phase!=='done')return;state.level=level;state.active=freshActive(selectTask(level,state.history));save(true);render();q('[data-key="factor"]').focus();}
q('[data-next]').addEventListener('click',()=>next(state.level));
q('[data-level]').addEventListener('change',()=>next(Number(q('[data-level]').value)));
async function start() {
  ready=false;q('[data-controls]').disabled=true;
  try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}
}
q('[data-retry]').addEventListener('click',start);
start();
