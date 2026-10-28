// Generiert durch ../werkstatt/build.cjs. Gemeinsame Quellen dort bearbeiten.
const KIND = 'operate';
const WIDGET_ID = 'brueche-ungleichnamig';
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

const OperateDomain = (() => {
  const D = typeof FractionDomain !== 'undefined' ? FractionDomain : require('./domain.js');
  const clone = value => JSON.parse(JSON.stringify(value));
  const plain = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const exact = (value, keys) => plain(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
  const text = value => typeof value === 'string' && value.length <= 240;
  const commonText = value => typeof value === 'string' && value.length <= 120;
  const keys = [['common'], ['left', 'right'], ['n', 'd'], ['n', 'd']];
  function integer(value) {
    return text(value) && /^\d+$/.test(value.trim()) ? BigInt(value.trim()) : null;
  }
  function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
  const lcm = (a, b) => a / gcd(a, b) * b;
  function operands(task) {
    if (!plain(task) || !['+', '-'].includes(task.op) || !['n', 'd', 'bn', 'bd'].every(key => Number.isSafeInteger(task[key]) && task[key] > 0)) throw new RangeError('Ungültige Bruchaufgabe.');
    return {n:BigInt(task.n), d:BigInt(task.d), bn:BigInt(task.bn), bd:BigInt(task.bd)};
  }
  function minimum(task) {
    const {n,d,bn,bd} = operands(task);
    return String(lcm(d / gcd(n,d), bd / gcd(bn,bd)));
  }
  function values(task, common) {
    const {n,d,bn,bd} = operands(task), N = commonText(common) ? integer(common) : null;
    if (N === null || N <= 0n || n*N%d || bn*N%bd) throw new RangeError('Der Nenner muss beide Brüche ganzzahlig darstellen.');
    const left=n*N/d, right=bn*N/bd, result=task.op==='+'?left+right:left-right;
    const divisor=gcd(result<0n?-result:result,N);
    return {left:String(left),right:String(right),n:String(result),d:String(N),finalN:String(result/divisor),finalD:String(N/divisor)};
  }
  const commonValid = (task, value) => {
    const N=commonText(value)?integer(value):null;
    return N!==null && N>0n && N%BigInt(minimum(task))===0n;
  };
  const canonicalCommon = (task,value) => typeof value==='string' && /^[1-9]\d*$/.test(value) && commonValid(task,value);
  function fresh(task) {
    if (!D.validTask(task) || task.kind!=='operate') throw new RangeError('Unbekannte Bruchrechenaufgabe.');
    return {task:clone(task),index:0,common:null,pending:null,drafts:[],attempts:[],help:[],feedback:null,legacyAttempts:null};
  }
  function expected(task,common,step,answer) {
    if (step===0) return commonValid(task,answer.common);
    if (common===null) return false;
    const v=values(task,common), target=step===1?{left:v.left,right:v.right}:step===2?{n:v.n,d:v.d}:{n:v.finalN,d:v.finalD};
    return keys[step].every(key=>integer(answer[key])!==null && integer(answer[key])===BigInt(target[key]));
  }
  const validAnswer = (step,answer) => exact(answer,keys[step]) && keys[step].every(key=>(key==='common'?commonText:text)(answer[key]));
  const validDraft = value => plain(value) && Object.entries(value).every(([key,v])=>['common','left','right','n','d','factor','same'].includes(key)&&(key==='common'?commonText:text)(v));
  const feedbackValid = value => value===null || (exact(value,['text','bad']) && typeof value.text==='string' && value.text.length<=2000 && typeof value.bad==='boolean');
  const oldDraft = value => validDraft(value) && Object.values(value).every(v=>v.length<=24);
  function oldCorrect(task,step,answer) {
    return D.steps(task)[step].fields.every(field=>/^\d+$/.test((answer[field.key]||'').trim()) && Number(answer[field.key])===field.value);
  }
  function oldAttempt(task,value) {
    return exact(value,['step','answer','correct']) && Number.isInteger(value.step) && value.step>=0 && value.step<4 && typeof value.correct==='boolean' && oldDraft(value.answer) && value.correct===oldCorrect(task,value.step,value.answer);
  }
  function validActive(a) {
    if (!exact(a,['task','index','common','pending','drafts','attempts','help','feedback','legacyAttempts']) || !D.validTask(a.task) || a.task.kind!=='operate' || !Number.isInteger(a.index) || a.index<0 || a.index>4 || !feedbackValid(a.feedback)) return false;
    if (a.index===0 ? a.common!==null : !canonicalCommon(a.task,a.common)) return false;
    if (a.pending!==null && (a.index!==0 || !canonicalCommon(a.task,a.pending) || BigInt(a.pending)<=BigInt(minimum(a.task)))) return false;
    if (!Array.isArray(a.drafts) || a.drafts.length>4 || !a.drafts.every(validDraft) || !Array.isArray(a.help) || !a.help.every(i=>Number.isInteger(i)&&i>=0&&i<4) || !Array.isArray(a.attempts)) return false;
    if (a.legacyAttempts!==null && (!Array.isArray(a.legacyAttempts) || !a.legacyAttempts.every(v=>oldAttempt(a.task,v)) || a.legacyAttempts.length>a.attempts.length || a.legacyAttempts.some((v,i)=>JSON.stringify(v)!==JSON.stringify(a.attempts[i])))) return false;
    const legacyCount=a.legacyAttempts?.length||0;
    for (let i=legacyCount;i<a.attempts.length;i++) {
      const v=a.attempts[i];
      if (!exact(v,['step','answer','correct']) || !Number.isInteger(v.step) || v.step<0 || v.step>3 || !validAnswer(v.step,v.answer) || typeof v.correct!=='boolean' || v.correct!==expected(a.task,a.common,v.step,v.answer)) return false;
    }
    if (a.pending!==null && (!validAnswer(0,a.drafts[0]) || integer(a.drafts[0].common)!==BigInt(a.pending))) return false;
    for (let i=0;i<a.index;i++) if (!validDraft(a.drafts[i]) || !expected(a.task,a.common,i,a.drafts[i])) return false;
    if (a.index>0 && integer(a.drafts[0].common)!==BigInt(a.common)) return false;
    return true;
  }
  function validState(s) {
    return exact(s,['level','active','history','intro']) && [1,2].includes(s.level) && typeof s.intro==='boolean' && validActive(s.active) && s.active.task.level===s.level && Array.isArray(s.history) && s.history.every(h=>validActive(h)&&h.index===4);
  }
  function check(a,answer) {
    if (!validActive(a)) throw new RangeError('Ungültiger Rechenstand.');
    if (a.index===4) return {correct:false,completed:false,warning:false};
    const step=a.index;
    if (!validAnswer(step,answer)) throw new TypeError('Ungültige Antwortfelder.');
    a.drafts[step]=clone(answer);
    const correct=expected(a.task,a.common,step,answer);
    if (step===0) {
      a.pending=null;
      if (correct && integer(answer.common)>BigInt(minimum(a.task))) {
        a.pending=String(integer(answer.common));a.feedback=null;
        return {correct:false,completed:false,warning:true};
      }
    }
    a.attempts.push({step,answer:clone(answer),correct});
    if (correct) {
      if (step===0) a.common=String(integer(answer.common));
      a.index++;a.feedback={text:a.index===4?'Richtig! Das Ergebnis ist vollständig gekürzt.':'Richtig! Rechne mit den bestätigten Zahlen weiter.',bad:false};
    } else a.feedback={text:step===0?'Noch nicht richtig. Wähle einen positiven Nenner, mit dem beide Brüche ganze Zähler erhalten.':step===2?'Noch nicht richtig. Verrechne nur die Zähler und behalte den gemeinsamen Nenner. Kürze erst im nächsten Schritt.':step===3?'Noch nicht richtig. Kürze das Ergebnis vollständig.':'Noch nicht richtig. Prüfe die neuen Zähler beim Kürzen oder Erweitern.',bad:true};
    return {correct,completed:a.index===4,warning:false};
  }
  function resolve(a,continueWith) {
    if (!validActive(a) || typeof continueWith!=='boolean') throw new RangeError('Ungültige Nennerentscheidung.');
    if (a.pending===null) return {correct:false,completed:false,warning:false};
    if (continueWith) {
      // Preserve the original (possibly zero-padded) input in the confirmed attempt.
      const answer=clone(a.drafts[0]);
      if (!validAnswer(0,answer) || integer(answer.common)!==BigInt(a.pending)) throw new RangeError('Die Nennerauswahl wurde verändert.');
      a.common=a.pending;a.index=1;a.attempts.push({step:0,answer,correct:true});
      a.feedback={text:'Der gemeinsame Nenner passt. Rechne mit deiner Wahl weiter.',bad:false};
    } else a.feedback=null;
    a.pending=null;
    return {correct:continueWith,completed:false,warning:false};
  }
  function steps(a) {
    if (!a || !D.validTask(a.task) || a.task.kind!=='operate') throw new RangeError('Unbekannte Bruchrechenaufgabe.');
    const t=a.task,N=a.common||minimum(t),v=values(t,N), min=minimum(t);
    const field=(key,label,value)=>({key,label,value});
    return [{
      title:'Gemeinsamen Nenner finden',
      text:'Finde einen gemeinsamen Nenner, auf den du beide Brüche durch Kürzen oder Erweitern bringen kannst.',
      fields:[field('common','Gemeinsamer Nenner',min)],
      hint:`Kürze beide Ausgangsbrüche zuerst vollständig. Das kgV ihrer gekürzten Nenner ist ${min}. Auch andere passende gemeinsame Nenner sind erlaubt.`,
      explanation:`${N} ist ein gemeinsamer Nenner: Beide Brüche lassen sich damit mit ganzen Zählern darstellen. Der kleinste mögliche gemeinsame Nenner ist ${min}.`
    },{
      title:'Gleichnamig machen',text:`Bringe beide Brüche durch Kürzen oder Erweitern auf deinen gemeinsamen Nenner ${N}. Trage die neuen Zähler ein.`,
      fields:[field('left','Neuer Zähler links',v.left),field('right','Neuer Zähler rechts',v.right)],
      hint:`Kürze zuerst, falls nötig, und erweitere dann auf ${N}. Du erhältst ${v.left}/${N} und ${v.right}/${N}.`,
      explanation:`${t.n}/${t.d} = ${v.left}/${N} und ${t.bn}/${t.bd} = ${v.right}/${N}.`
    },{
      title:t.op==='+'?'Brüche addieren':'Brüche subtrahieren',text:`${t.op==='+'?'Addiere':'Subtrahiere'} nur die Zähler. Behalte den gemeinsamen Nenner ${N}. Kürze erst im nächsten Schritt.`,
      fields:[field('n','Zähler des Ergebnisses',v.n),field('d','Gemeinsamer Nenner',N)],
      hint:`${v.left} ${t.op} ${v.right} = ${v.n}. Der Nenner bleibt ${N}.`,
      explanation:`${v.left}/${N} ${t.op} ${v.right}/${N} = ${v.n}/${N}.`
    },{
      title:'Ergebnis vollständig kürzen',text:'Kürze den Ergebnisbruch vollständig. Ist er schon vollständig gekürzt, übernimm ihn unverändert.',
      fields:[field('n','Vollständig gekürzter Zähler',v.finalN),field('d','Vollständig gekürzter Nenner',v.finalD)],
      hint:v.n===v.finalN&&N===v.finalD?`Der Bruch ${v.n}/${N} ist bereits vollständig gekürzt.`:`Teile Zähler und Nenner durch ${BigInt(N)/BigInt(v.finalD)}. Du erhältst ${v.finalN}/${v.finalD}.`,
      explanation:`${v.n}/${N} = ${v.finalN}/${v.finalD}. Das Ergebnis ist vollständig gekürzt.`
    }];
  }
  function validOldActive(a) {
    if (!exact(a,['task','index','drafts','attempts','help','feedback']) || !D.validTask(a.task) || a.task.kind!=='operate' || !Number.isInteger(a.index) || a.index<0 || a.index>4 || !Array.isArray(a.drafts) || a.drafts.length>4 || !a.drafts.every(oldDraft) || !Array.isArray(a.attempts) || !a.attempts.every(v=>oldAttempt(a.task,v)) || !Array.isArray(a.help) || !a.help.every(i=>Number.isInteger(i)&&i>=0&&i<4) || !feedbackValid(a.feedback)) return false;
    for (let i=0;i<a.index;i++) if (!a.drafts[i] || !oldCorrect(a.task,i,a.drafts[i])) return false;
    return true;
  }
  function convertOld(a) {
    const next=fresh(a.task);
    Object.assign(next,{index:a.index,common:a.index?String(D.lcm(a.task.d,a.task.bd)):null,drafts:clone(a.drafts),attempts:clone(a.attempts),help:clone(a.help),feedback:clone(a.feedback),legacyAttempts:clone(a.attempts)});
    return next;
  }
  function migrateSnapshot(snapshot) {
    if (!exact(snapshot,['widget','version','data','scores']) || snapshot.widget!=='brueche-ungleichnamig' || snapshot.version!==1 || !Array.isArray(snapshot.scores) || snapshot.scores.length!==20 || !snapshot.scores.every(v=>['gray','green','yellow','red'].includes(v))) throw new Error('Dieser ältere Lernstand kann nicht übernommen werden.');
    const s=snapshot.data;
    if (!exact(s,['level','active','history','intro']) || ![1,2].includes(s.level) || typeof s.intro!=='boolean' || !validOldActive(s.active) || s.active.task.level!==s.level || !Array.isArray(s.history) || !s.history.every(h=>validOldActive(h)&&h.index===4)) throw new Error('Der ältere Rechenstand ist beschädigt. Das Original bleibt erhalten.');
    const result={widget:snapshot.widget,version:2,data:{level:s.level,active:convertOld(s.active),history:s.history.map(convertOld),intro:s.intro},scores:clone(snapshot.scores)};
    if (!validState(result.data)) throw new Error('Der ältere Rechenstand konnte nicht vollständig übernommen werden.');
    return result;
  }
  return {fresh,minimum,values,steps,check,resolve,validActive,validState,migrateSnapshot};
})();

if (typeof module !== 'undefined') module.exports = OperateDomain;

const D=FractionDomain,R=OperateDomain;
const clone=value=>JSON.parse(JSON.stringify(value));
const freshActive=task=>R.fresh(task);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numberHTML=value=>`<span class="${String(value).length>12?'long-value':''}" title="${esc(value)}">${esc(value)}</span>`;
const fraction=(n,d)=>`<span class="frac" aria-label="${esc(n)} durch ${esc(d)}">${numberHTML(n)}${numberHTML(d)}</span>`;
const introduction='Brüche müssen gleich große Teile beschreiben, bevor du sie addierst oder subtrahierst. Wähle einen gemeinsamen Nenner und rechne beide Brüche darauf um. Dazu darfst du kürzen und erweitern. Beispiel: 1/3 und 2/6 lassen sich beide als 1/3 schreiben. Auch Nenner 6, 9 oder 12 sind möglich. Verrechne anschließend nur die Zähler und kürze das Ergebnis vollständig.';
const selectTask=(level,history)=>{
  const pool=D.tasks('operate',level),used=new Set(history.map(h=>h.task.id)),unused=pool.filter(t=>!used.has(t.id));
  const choices=unused.length?unused:pool.filter(t=>t.id!==history.at(-1)?.task.id);
  return choices[Math.floor(Math.random()*choices.length)];
};
const bridge=createEduloBridge({root,widgetId:WIDGET_ID,stateVersion:2,hideFooter:true,
  fresh:()=>({level:1,active:freshActive(selectTask(1,[])),history:[],intro:false}),validate:R.validState,migrateSnapshot:R.migrateSnapshot,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,ready=false;
const tainted=a=>a.help.length>0||a.attempts.some(v=>!v.correct);
function save(immediate=false){try{if(immediate)bridge.save(state,scores);else bridge.queueSave(state,scores);}catch{}}
function diagram(n,d,{side='left',converted=false,color='#19a491',result=false}={}){
  const denominator=BigInt(d),wholes=BigInt(n)>denominator?2:1;
  const task=state.active.task;
  const planColumns=FractionVisuals.columns(D.gcd(task.d,task.bd));
  const image=FractionVisuals.image({n,d,color,planColumns});
  return `<figure class="operate-figure ${side}" ${converted?`data-result-model="${side}"`:''} ${result?'data-answer-model':''}>${image}<figcaption>${wholes>1?'Je Rechteck: ein Ganzes':'Ein Ganzes'}${denominator<=128n?'':' · Teilung vereinfacht'}</figcaption></figure>`;
}
function field(key,label,value,expected){
  const a=state.active,preview=a.attempts.filter(v=>v.step===a.index).at(-1);
  let valid=typeof value==='string'&&/^\d+$/.test(value.trim())&&BigInt(value.trim())===BigInt(expected);
  if(key==='common'){try{R.values(a.task,value);valid=true;}catch{valid=false;}}
  return `<input data-key="${key}" aria-label="${label}" inputmode="numeric" autocomplete="off" maxlength="${key==='common'?120:240}" value="${esc(value||'')}" aria-invalid="${!!preview&&!valid}">`;
}
function numeralInput(key,label,denominator,expected){
  const value=state.active.drafts[1]?.[key]||'';
  return `<div class="numerator-entry">${field(key,label,value,expected)}<span class="operate-input-rule" aria-hidden="true"></span><span class="denominator ${String(denominator).length>12?'long-value':''}" title="${esc(denominator)}">${esc(denominator)}</span></div>`;
}
function resultInput(index,values){
  const draft=state.active.drafts[index]||{},n=index===2?values.n:values.finalN,d=index===2?values.d:values.finalD;
  return `<div class="numerator-entry">${field('n',index===2?'Zähler des Ergebnisses':'Vollständig gekürzter Zähler',draft.n||'',n)}<span class="operate-input-rule" aria-hidden="true"></span>${field('d',index===2?'Gemeinsamer Nenner':'Vollständig gekürzter Nenner',draft.d||'',d)}</div>`;
}
function renderEquations(){
  const a=state.active,t=a.task,sign=t.op==='-'?'−':'+',v=a.common?R.values(t,a.common):null;
  const preview=a.index>=2||a.attempts.some(attempt=>attempt.step===1);
  const sourcePictures=diagram(t.n,t.d)+diagram(t.bn,t.bd,{side:'right',color:'#4287bc'});
  let chain=`<div class="operate-chain ${v?'':'initial'} ${v&&preview?'has-preview':''}"><div class="operate-pair original"><div class="operate-number">${fraction(t.n,t.d)}</div><span class="math-sign">${sign}</span><div class="operate-number">${fraction(t.bn,t.bd)}</div><div class="source-pictures-inline">${sourcePictures}</div><details class="source-pictures-mobile"><summary>Ausgangsbilder anzeigen</summary><div class="operate-pair">${sourcePictures}</div></details></div>`;
  if(v)chain+=`<span class="chain-equals">=</span><div class="operate-pair converted"><div class="operate-number">${a.index===1?numeralInput('left','Neuer Zähler links',a.common,v.left):fraction(v.left,a.common)}</div><span class="math-sign">${sign}</span><div class="operate-number">${a.index===1?numeralInput('right','Neuer Zähler rechts',a.common,v.right):fraction(v.right,a.common)}</div>${preview?diagram(v.left,a.common,{converted:true})+diagram(v.right,a.common,{side:'right',converted:true,color:'#4287bc'}):''}</div>`;
  chain+='</div>';
  const previous=[];let current=chain;
  if(a.index>=2){previous.push(chain);current='';}
  if(v&&a.index>=2){
    const resultPreview=a.index>=3||a.attempts.some(attempt=>attempt.step===2);
    const calculation=`<div class="result-line"><div class="result-source"><div class="operate-number">${fraction(`${v.left} ${sign} ${v.right}`,a.common)}</div><p>Der Nenner bleibt gleich.</p></div><span class="math-sign">=</span><div class="result-target"><div class="operate-number">${a.index===2?resultInput(2,v):fraction(v.n,a.common)}</div>${resultPreview?diagram(v.n,a.common,{result:true}):''}</div></div>`;
    if(a.index===2)current=calculation;else previous.push(calculation);
  }
  if(v&&a.index>=3){
    const finalPreview=a.index===4||a.attempts.some(attempt=>attempt.step===3);
    current=`<div class="result-line"><div class="result-source"><div class="operate-number">${fraction(v.n,a.common)}</div><p>Vollständig kürzen</p></div><span class="math-sign">=</span><div class="result-target"><div class="operate-number">${a.index===3?resultInput(3,v):fraction(v.finalN,v.finalD)}</div>${finalPreview?diagram(v.finalN,v.finalD,{result:true}):''}</div></div>`;
  }
  q('[data-equations]').innerHTML=`<div class="operate-scene">${previous.length?`<details class="prior-steps"><summary>Vorherige Rechenschritte</summary>${previous.join('')}</details>`:''}${current}</div>`;
}
function renderHistory(){
  const history=state.history,clean=history.filter(h=>!tainted(h)).length;
  q('[data-stats]').innerHTML=[['Erledigt',history.length],['Auf Anhieb richtig',clean],['Mit Fehler / Hilfe',history.length-clean]].map(([label,n])=>`<div class="stat"><b>${n}</b>${label}</div>`).join('');
  const labels={common:'Gemeinsamer Nenner',left:'Zähler links',right:'Zähler rechts',n:'Zähler',d:'Nenner'};
  q('[data-history]').innerHTML=history.length?history.map(h=>{
    const v=R.values(h.task,h.common);
    return `<li><details><summary>${h.task.n}/${h.task.d} ${h.task.op==='-'?'−':'+'} ${h.task.bn}/${h.task.bd} · Nenner ${esc(h.common)} · ${tainted(h)?'mit Fehler / Hilfe':'auf Anhieb richtig'}</summary><p>${esc(v.left)}/${esc(h.common)} ${h.task.op==='-'?'−':'+'} ${esc(v.right)}/${esc(h.common)} = ${esc(v.n)}/${esc(h.common)} = ${esc(v.finalN)}/${esc(v.finalD)}</p><ol>${h.attempts.map(attempt=>`<li>Schritt ${attempt.step+1}: ${Object.entries(attempt.answer).map(([key,value])=>esc(`${labels[key]||key}: ${value||'leer'}`)).join(', ')} – ${attempt.correct?'richtig':'noch nicht richtig'}</li>`).join('')}</ol>${h.help.length?'<p>Tipp genutzt.</p>':''}</details></li>`;
  }).join(''):'<li>Noch keine abgeschlossenen Aufgaben.</li>';
}
function render(){
  const a=state.active,done=a.index===4,steps=R.steps(a);
  q('[data-level]').value=String(state.level);q('[data-level]').disabled=!done;
  q('[data-step]').textContent=done?'Aufgabe abgeschlossen':`Schritt ${a.index+1} von 4`;
  q('[data-heading]').textContent=done?'Geschafft!':steps[a.index].title;
  q('[data-instruction]').textContent=done?'Das Ergebnis ist vollständig gekürzt.':a.index===1?`Schreibe beide Brüche mit Nenner ${a.common}. Ergänze die Zähler.`:steps[a.index].text;
  q('[data-fields]').hidden=a.index!==0;q('[data-fields]').innerHTML=a.index===0?`<label class="entry">Gemeinsamer Nenner ${field('common','Gemeinsamer Nenner',a.drafts[0]?.common||'',R.minimum(a.task))}</label>`:'';
  q('[data-check]').hidden=done;q('[data-hint]').hidden=done;q('[data-next]').hidden=!done;
  q('[data-feedback]').hidden=!a.feedback;q('[data-feedback]').textContent=a.feedback?.text||'';q('[data-feedback]').classList.toggle('bad',!!a.feedback?.bad);q('[data-rating]').hidden=!tainted(a);
  q('[data-hint-text]').hidden=done||!a.help.includes(a.index);q('[data-hint-text]').textContent=done?'':steps[a.index].hint;
  q('[data-introduction]').textContent=introduction;q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));
  q('[data-progress]').textContent=`${scores.filter(s=>s==='green'||s==='yellow').length} von 20 Punkten`;q('[data-milestones]').innerHTML=scores.map(s=>`<span class="dot ${s}"></span>`).join('');
  renderEquations();renderHistory();
  const dialog=q('[data-denominator-dialog]');if(a.pending&&!dialog.open)dialog.showModal();else if(!a.pending&&dialog.open)dialog.close();
}
root.addEventListener('input',e=>{
  const key=e.target.dataset.key;if(!ready||!key||state.active.index===4||state.active.pending)return;
  (state.active.drafts[state.active.index]||={})[key]=e.target.value;e.target.removeAttribute('aria-invalid');save();
});
function check(){
  if(!ready||state.active.index===4||state.active.pending)return;
  const a=state.active,fields=R.steps(a)[a.index].fields,draft=a.drafts[a.index]||{},answer=Object.fromEntries(fields.map(f=>[f.key,draft[f.key]||'']));
  const result=R.check(a,answer);
  if(result.completed){const slot=state.history.length;if(slot<scores.length)scores[slot]=tainted(a)?'yellow':'green';state.history.push(clone(a));}
  save(true);render();if(result.correct&&!a.pending)q(a.index===4?'[data-next]':a.index===1?'[data-key="left"]':'[data-key="n"]').focus();
}
q('[data-check]').addEventListener('click',check);
root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input[data-key]')){e.preventDefault();check();}});
function chooseDenominator(keep){if(!ready||!state.active.pending)return;R.resolve(state.active,keep);save(true);render();const input=q(keep?'[data-key="left"]':'[data-key="common"]');input.focus();if(!keep)input.select();}
q('[data-continue]').addEventListener('click',()=>chooseDenominator(true));q('[data-smaller]').addEventListener('click',()=>chooseDenominator(false));q('[data-denominator-dialog]').addEventListener('cancel',e=>{e.preventDefault();chooseDenominator(false);});
q('[data-hint]').addEventListener('click',()=>{if(!ready||state.active.index===4)return;const a=state.active;if(!a.help.includes(a.index))a.help.push(a.index);save(true);q('[data-hint-text]').textContent=R.steps(a)[a.index].hint;q('[data-hint-text]').hidden=false;q('[data-rating]').hidden=false;});
q('[data-intro]').addEventListener('click',()=>{if(!ready)return;state.intro=!state.intro;save();q('[data-introduction]').hidden=!state.intro;q('[data-intro]').setAttribute('aria-expanded',String(state.intro));});
function next(level){if(!ready||state.active.index!==4)return;state.level=level;state.active=freshActive(selectTask(level,state.history));save(true);render();q('[data-key="common"]').focus();}
q('[data-next]').addEventListener('click',()=>next(state.level));q('[data-level]').addEventListener('change',()=>next(Number(q('[data-level]').value)));
async function start(){ready=false;q('[data-controls]').disabled=true;const dialog=q('[data-denominator-dialog]');if(dialog.open)dialog.close();try{const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;render();ready=bridge.getStatus().mode!=='editor';q('[data-controls]').disabled=!ready;}catch{}}
q('[data-retry]').addEventListener('click',start);
start();
