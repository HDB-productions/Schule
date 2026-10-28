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
