const LessonDomain=(()=>{
  const colors=['gray','green','yellow'];
  const criteria=lesson=>lesson.questions.flatMap(q=>q.criteria);
  const validAttemptFeedback=(lesson,h,f)=>h.rubricVersion===lesson.version&&validFeedback(lesson,f);
  const fresh=lesson=>({lesson:lesson.id,version:lesson.version,ownerUid:null,
    answers:Object.fromEntries(lesson.questions.map(q=>[q.id,''])),
    aspects:Object.fromEntries(criteria(lesson).map(c=>[c.id,{earned:'gray',assisted:false}])),history:[]});
  function task(lesson){return {id:lesson.id,version:lesson.version,
    prompt:lesson.questions.map(q=>q.id+': '+q.title).join('\n')+'\nBeurteile alle Antworten getrennt anhand der zugeordneten Kriterien. Gib zusätzlich allgemeine Formulierungshinweise, wenn sie helfen. Keine Abwertung verständlicher Antworten wegen bloßer Rechtschreibung. Die KI erhält nur Texte, keine Bild- oder Videodateien. Behaupte niemals, das eigene Video gesehen zu haben. Prüfe die beschriebene Beobachtung und deren Begründung. Keine erfundenen Links.',
    referenceAnswer:lesson.questions.map(q=>q.id+': '+q.reference).join('\n\n'),
    feedbackGroups:lesson.questions.map(q=>({id:q.id,prompt:q.title,criterionIds:q.criteria.map(c=>c.id)})),
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
  function validAnswers(lesson,a){return !!a&&lesson.questions.every(q=>typeof a[q.id]==='string'&&a[q.id].length<=1500);}
  function valid(lesson,s){
    return !!s&&s.lesson===lesson.id&&s.version===lesson.version&&(s.ownerUid===null||typeof s.ownerUid==='string'&&/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i.test(s.ownerUid))&&
      validAnswers(lesson,s.answers)&&s.aspects&&criteria(lesson).every(c=>colors.includes(s.aspects[c.id]?.earned)&&typeof s.aspects[c.id]?.assisted==='boolean')&&
      Array.isArray(s.history)&&new Set(s.history.map(h=>h?.requestId)).size===s.history.length&&s.history.every(h=>h&&typeof h.requestId==='string'&&typeof h.at==='string'&&validAnswers(lesson,h.answers)&&
        ['pending','done','failed','unknown'].includes(h.status)&&criteria(lesson).every(c=>typeof h.assisted?.[c.id]==='boolean')&&
        (h.feedback===null||validAttemptFeedback(lesson,h,h.feedback))&&typeof h.message==='string');
  }
  function begin(lesson,s,requestId,at){
    if(s.history.some(h=>h.status==='pending'||h.status==='unknown'))throw Error('Eine frühere Prüfung ist noch ungeklärt.');
    if(!lesson.questions.every(q=>s.answers[q.id].trim()))throw Error('Bitte beantworte zuerst alle Fragen.');
    const h={requestId,at,rubricVersion:lesson.version,answers:JSON.parse(JSON.stringify(s.answers)),assisted:Object.fromEntries(criteria(lesson).map(c=>[c.id,s.aspects[c.id].assisted])),status:'pending',feedback:null,message:''};
    s.history.push(h);return h;
  }
  function finish(lesson,s,h,f){
    if(!validAttemptFeedback(lesson,h,f))throw Error('Ungültiges Feedback.');
    if(h.status==='done')return;
    h.feedback=f;h.status='done';h.message='Rückmeldung erhalten.';
    for(const result of f.criteria){
      const aspect=s.aspects[result.id];
      if(result.status==='met'&&aspect.earned==='gray')aspect.earned=h.assisted[result.id]?'yellow':'green';
      if(result.status!=='met')aspect.assisted=true;
    }
  }
  function scores(lesson,s){return criteria(lesson).map(c=>s.aspects[c.id].earned);}
  function assist(lesson,s,source){for(const c of criteria(lesson))if(c.source===source)s.aspects[c.id].assisted=true;}

  return {criteria,fresh,task,valid,validFeedback,validAttemptFeedback,begin,finish,scores,assist};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=LessonDomain;
