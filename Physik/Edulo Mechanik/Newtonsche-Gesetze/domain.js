const LessonDomain=(()=>{
  const colors=['gray','green','yellow'];
  const criteria=lesson=>lesson.questions.flatMap(q=>q.criteria);
  const previous=lesson=>({...lesson,version:'1',questions:lesson.questions.map(q=>({...q,criteria:q.criteria.filter(c=>c.id!=='bus_skater')}))});
  const validAttemptFeedback=(lesson,h,f)=>validFeedback(h.rubricVersion==='1'?previous(lesson):lesson,f);
  const fresh=lesson=>({lesson:lesson.id,version:lesson.version,ownerUid:null,
    answers:Object.fromEntries(lesson.questions.map(q=>[q.id,''])),
    aspects:Object.fromEntries(criteria(lesson).map(c=>[c.id,{earned:'gray',assisted:false}])),history:[]});
  function task(lesson){return {id:lesson.id,version:lesson.version,
    prompt:lesson.questions.map(q=>q.id+': '+q.title+' '+(q.instruction||'')).join('\n')+'\nBeurteile die eingereichten Teilantworten getrennt anhand der zugeordneten Kriterien. Gib zusätzlich allgemeine Formulierungshinweise, wenn sie helfen. Keine Abwertung verständlicher Antworten wegen bloßer Rechtschreibung. Keine erfundenen Videostellen oder Links.',
    referenceAnswer:lesson.questions.map(q=>q.id+': '+q.reference).join('\n\n'),
    feedbackGroups:lesson.questions.map(q=>({id:q.id,prompt:q.title+' '+(q.instruction||''),criterionIds:q.criteria.map(c=>c.id)})),
    criteria:criteria(lesson).map(({id,label,description})=>({id,label,description}))};}
  function validFeedback(lesson,f){
    const ids=criteria(lesson).map(c=>c.id);
    return !!f&&typeof f.summary==='string'&&f.summary.length<=1600&&typeof f.languageFeedback==='string'&&f.languageFeedback.length<=1600&&
      (!Object.hasOwn(f,'misconceptions')||Array.isArray(f.misconceptions)&&f.misconceptions.length<=3&&f.misconceptions.every(m=>m&&typeof m.statement==='string'&&m.statement.trim().length>0&&m.statement.length<=300&&typeof m.correction==='string'&&m.correction.trim().length>0&&m.correction.length<=600))&&
      (!Object.hasOwn(f,'taskFeedback')||Array.isArray(f.taskFeedback)&&f.taskFeedback.length===lesson.questions.length&&new Set(f.taskFeedback.map(g=>g?.id)).size===lesson.questions.length&&f.taskFeedback.every(g=>g&&lesson.questions.some(q=>q.id===g.id)&&typeof g.feedback==='string'&&g.feedback.trim().length>0&&g.feedback.length<=1200))&&
      Array.isArray(f.nextSteps)&&f.nextSteps.length<=6&&f.nextSteps.every(s=>typeof s==='string'&&s.length<=1000)&&
      Array.isArray(f.criteria)&&f.criteria.length===ids.length&&new Set(f.criteria.map(c=>c?.id)).size===ids.length&&
      f.criteria.every(c=>c&&ids.includes(c.id)&&['met','partial','missing'].includes(c.status)&&typeof c.feedback==='string'&&c.feedback.length<=1600);
  }
  function validAnswers(lesson,a){return !!a&&lesson.questions.every(q=>typeof a[q.id]==='string'&&a[q.id].length<=3000);}
  const own=(value,key)=>!!value&&Object.hasOwn(value,key);
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const exact=(value,keys)=>object(value)&&Object.keys(value).length===keys.length&&keys.every(key=>own(value,key));
  const attemptLesson=(lesson,h)=>h.rubricVersion==='1'?previous(lesson):lesson;
  const signature=q=>JSON.stringify({id:q.id,prompt:q.title+' '+(q.instruction||''),referenceAnswer:q.reference,
    criteria:q.criteria.map(({id,label,description})=>({id,label,description}))});
  function checked(lesson,h){
    const ids=lesson.questions.map(q=>q.id);
    if(!own(h,'checkedQuestionIds'))return ids;
    return Array.isArray(h.checkedQuestionIds)&&h.checkedQuestionIds.length>0&&
      new Set(h.checkedQuestionIds).size===h.checkedQuestionIds.length&&h.checkedQuestionIds.every(id=>ids.includes(id))?h.checkedQuestionIds:null;
  }
  function validSignatures(lesson,signatures){
    if(!exact(signatures,lesson.questions.map(q=>q.id)))return false;
    return lesson.questions.every(q=>{
      const text=signatures[q.id];let value;
      if(typeof text!=='string'||text.length>20000)return false;
      try{value=JSON.parse(text);}catch{return false;}
      return exact(value,['id','prompt','referenceAnswer','criteria'])&&value.id===q.id&&
        typeof value.prompt==='string'&&typeof value.referenceAnswer==='string'&&Array.isArray(value.criteria)&&
        value.criteria.length===q.criteria.length&&new Set(value.criteria.map(c=>c?.id)).size===q.criteria.length&&
        value.criteria.every(c=>exact(c,['id','label','description'])&&q.criteria.some(expected=>expected.id===c.id)&&typeof c.label==='string'&&typeof c.description==='string');
    });
  }
  function completeGroupedFeedback(lesson,h){
    return h?.status==='done'&&h.feedbackStyle==='questions-v4'&&h.rubricVersion===lesson.version&&
      validFeedback(lesson,h.feedback)&&Array.isArray(h.feedback.taskFeedback)&&h.feedback.taskFeedback.length===lesson.questions.length;
  }
  function latestDone(history,before=history.length){
    for(let i=before-1;i>=0;i--)if(history[i]?.status==='done')return i;
    return -1;
  }
  function validMetadata(lesson,h,history,index){
    const names=['checkedQuestionIds','reusedFrom','questionSignatures'];
    if(!names.some(name=>own(h,name)))return true; // Legacy attempts have no cache metadata.
    if(!names.every(name=>own(h,name)))return false;
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    if(!ids||!validSignatures(base,h.questionSignatures))return false;
    const reused=base.questions.filter(q=>!ids.includes(q.id));
    if(!exact(h.reusedFrom,reused.map(q=>q.id)))return false;
    if(!reused.length)return true;
    const sourceIndex=latestDone(history,index),source=history[sourceIndex];
    if(sourceIndex<0||!completeGroupedFeedback(base,source)||!validMetadata(lesson,source,history,sourceIndex))return false;
    return reused.every(q=>h.reusedFrom[q.id]===source.requestId&&source.answers?.[q.id]===h.answers?.[q.id]&&
      (!own(source,'questionSignatures')||source.questionSignatures[q.id]===h.questionSignatures[q.id]));
  }
  function plan(lesson,s){
    const all=lesson.questions.map(q=>q.id),history=Array.isArray(s?.history)?s.history:[];
    const index=latestDone(history),source=history[index];
    if(!completeGroupedFeedback(lesson,source)||!validAnswers(lesson,source.answers)||!validMetadata(lesson,source,history,index))
      return {checkedQuestionIds:all,reusedFrom:{}};
    const checkedQuestionIds=[],reusedFrom={};
    for(const q of lesson.questions){
      if(s.answers?.[q.id]!==source.answers[q.id]||
        (own(source,'questionSignatures')&&source.questionSignatures[q.id]!==signature(q)))checkedQuestionIds.push(q.id);
      else reusedFrom[q.id]=source.requestId;
    }
    return {checkedQuestionIds,reusedFrom};
  }
  function request(lesson,h){
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    if(!ids)throw Error('Ungültige Teilaufgaben für die Prüfung.');
    const projected={...base,questions:base.questions.filter(q=>ids.includes(q.id))};
    return {task:task(projected),answer:JSON.stringify(own(h,'checkedQuestionIds')?
      Object.fromEntries(projected.questions.map(q=>[q.id,h.answers[q.id]])):h.answers)};
  }
  function validResponse(lesson,h,f){
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    if(!ids)return false;
    const projected={...base,questions:base.questions.filter(q=>ids.includes(q.id))};
    return validFeedback(projected,f)&&(ids.length===base.questions.length||Array.isArray(f.taskFeedback));
  }
  function valid(lesson,s){
    return !!s&&s.lesson===lesson.id&&s.version===lesson.version&&(s.ownerUid===null||typeof s.ownerUid==='string'&&/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i.test(s.ownerUid))&&
      validAnswers(lesson,s.answers)&&s.aspects&&criteria(lesson).every(c=>colors.includes(s.aspects[c.id]?.earned)&&typeof s.aspects[c.id]?.assisted==='boolean')&&
      Array.isArray(s.history)&&new Set(s.history.map(h=>h?.requestId)).size===s.history.length&&s.history.every((h,index)=>h&&typeof h.requestId==='string'&&typeof h.at==='string'&&validAnswers(lesson,h.answers)&&
        ['pending','done','failed','unknown'].includes(h.status)&&(!own(h,'rubricVersion')||['1',lesson.version].includes(h.rubricVersion))&&criteria(lesson).every(c=>typeof h.assisted?.[c.id]==='boolean')&&
        (h.feedback===null||validAttemptFeedback(lesson,h,h.feedback))&&typeof h.message==='string'&&validMetadata(lesson,h,s.history,index));
  }
  function begin(lesson,s,requestId,at){
    if(s.history.some(h=>h.status==='pending'||h.status==='unknown'))throw Error('Eine frühere Prüfung ist noch ungeklärt.');
    if(!lesson.questions.every(q=>s.answers[q.id].trim()))throw Error('Bitte schreibe zuerst deine Erklärung.');
    const next=plan(lesson,s);
    if(!next.checkedQuestionIds.length)throw Error('Die Antworten sind unverändert. Die vorhandene Rückmeldung gilt weiterhin.');
    const h={requestId,at,rubricVersion:lesson.version,answers:JSON.parse(JSON.stringify(s.answers)),assisted:Object.fromEntries(criteria(lesson).map(c=>[c.id,s.aspects[c.id].assisted])),
      ...next,questionSignatures:Object.fromEntries(lesson.questions.map(q=>[q.id,signature(q)])),status:'pending',feedback:null,message:''};
    s.history.push(h);return h;
  }
  function finish(lesson,s,h,f){
    const index=s.history.indexOf(h);
    if(index<0||!validMetadata(lesson,h,s.history,index)||!validResponse(lesson,h,f))throw Error('Ungültiges Feedback.');
    if(h.status==='done')return;
    const base=attemptLesson(lesson,h),ids=checked(base,h);
    let merged=f;
    if(ids.length<base.questions.length){
      const results=[],groups=[];
      for(const q of base.questions){
        const source=ids.includes(q.id)?f:s.history.find(prior=>prior.requestId===h.reusedFrom[q.id]).feedback;
        for(const c of q.criteria)results.push({...source.criteria.find(result=>result.id===c.id)});
        groups.push({...source.taskFeedback.find(group=>group.id===q.id)});
      }
      merged={summary:'',languageFeedback:'',misconceptions:[],nextSteps:[],criteria:results,taskFeedback:groups};
    }
    if(!validAttemptFeedback(lesson,h,merged))throw Error('Ungültiges zusammengeführtes Feedback.');
    h.feedback=merged;h.status='done';h.message='Rückmeldung erhalten.';
    for(const result of f.criteria){
      const aspect=s.aspects[result.id];
      if(result.status==='met'&&aspect.earned==='gray')aspect.earned=h.assisted[result.id]?'yellow':'green';
      if(result.status!=='met')aspect.assisted=true;
    }
  }
  function scores(lesson,s){return criteria(lesson).map(c=>s.aspects[c.id].earned);}
  function assist(lesson,s,source){for(const c of criteria(lesson))if(c.source===source)s.aspects[c.id].assisted=true;}
  function migrate(lesson,snapshot){
    const old=previous(lesson),local=snapshot?.data?.local;
    const localPoints=object(local)&&Array.isArray(local.earned)&&local.earned.length===6&&Array.from(local.earned).every(value=>colors.includes(value))&&
      Array.isArray(local.assisted)&&local.assisted.length===6&&Array.from(local.assisted).every(value=>typeof value==='boolean');
    if(lesson.id!=='newton-bus-erklaerung'||lesson.version!=='2'||snapshot?.widget!=='newton-gesetze-ki-v1'||snapshot.version!==1||
      !localPoints||!valid(old,snapshot.data)||
      snapshot.data.history.some(h=>own(h,'rubricVersion')&&h.rubricVersion!=='1')||
      JSON.stringify(snapshot.scores)!==JSON.stringify([...local.earned,...scores(old,snapshot.data)]))
      throw Error('Unbekannter älterer Lernstand. Originaldaten bleiben erhalten.');
    // Work on a copy: rejected migrations must never alter the stored source.
    const migrated=JSON.parse(JSON.stringify(snapshot)),s=migrated.data;
    migrated.version=2;s.version=lesson.version;s.aspects.bus_skater={earned:'gray',assisted:false};
    for(const h of s.history){if(!own(h,'rubricVersion'))h.rubricVersion='1';h.assisted.bus_skater=false;}
    migrated.scores=[...snapshot.scores,'gray'];
    if(!valid(lesson,s))throw Error('Der ältere Lernstand konnte nicht vollständig übernommen werden. Originaldaten bleiben erhalten.');
    return migrated;
  }
  return {criteria,fresh,task,valid,validFeedback,validAttemptFeedback,plan,request,validResponse,begin,finish,scores,assist,migrate};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=LessonDomain;
