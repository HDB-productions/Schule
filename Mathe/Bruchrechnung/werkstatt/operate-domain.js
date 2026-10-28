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
