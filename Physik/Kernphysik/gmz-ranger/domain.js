const GMZDomain = (() => {
  const lesson = typeof GMZ_LESSON !== 'undefined' ? GMZ_LESSON : require('./lesson.js');
  const colors = ['gray', 'green', 'yellow'];
  const statuses = ['pending', 'done', 'failed', 'unknown'];
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const uid = /^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i;
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const exact = (value, keys) => object(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
  const string = (value, max) => typeof value === 'string' && value.length <= max;
  const answerKey = value => value.trim().replace(/\s+/g, ' ');
  const criterionIds = lesson.criteria.map(c => c.id);
  const componentIds = lesson.components.map(c => c.id);
  const clone = value => JSON.parse(JSON.stringify(value));
  const signature = JSON.stringify(task());
  function normalize(text) {
    return typeof text === 'string' ? text.normalize('NFKC').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[\s\p{P}]+/gu, '').trim() : '';
  }
  function fresh() {
    return { lesson: lesson.id, version: lesson.version, ownerUid: null,
      labels: Object.fromEntries(componentIds.map(id => [id, { draft: '', earned: 'gray', assisted: false, attempts: 0 }])),
      answer: '', aspects: Object.fromEntries(criterionIds.map(id => [id, { earned: 'gray', assisted: false }])), history: [] };
  }
  function task() {
    return { id: lesson.id, version: lesson.version,
      prompt: lesson.prompt + '\nBewerte fachliche Zusammenhänge, nicht die bloße Nennung von Bauteilen. Verständliche Alltagssprache und Rechtschreibfehler nicht abwerten. Fehlendes mit offenen Leitfragen erschließen; keine vollständige Musterlösung ausgeben.',
      referenceAnswer: lesson.reference, criteria: lesson.criteria.map(({ id, label, description }) => ({ id, label, description })),
      feedbackGroups: [{ id: 'explanation', prompt: lesson.prompt, criterionIds: [...criterionIds] }] };
  }
  function validFeedback(f) {
    if (!object(f) || !Object.keys(f).every(k => ['summary', 'criteria', 'nextSteps', 'languageFeedback', 'misconceptions', 'taskFeedback'].includes(k))) return false;
    return !!(string(f.summary, 1600) && string(f.languageFeedback, 1600) &&
      Array.isArray(f.criteria) && f.criteria.length === criterionIds.length && new Set(f.criteria.map(c => c?.id)).size === criterionIds.length &&
      f.criteria.every(c => exact(c, ['id', 'status', 'feedback']) && criterionIds.includes(c.id) && ['met', 'partial', 'missing'].includes(c.status) && string(c.feedback, 1600)) &&
      Array.isArray(f.nextSteps) && f.nextSteps.length <= 3 && f.nextSteps.every(s => string(s, 1000)) &&
      Array.isArray(f.taskFeedback) && f.taskFeedback.length === 1 && exact(f.taskFeedback[0], ['id', 'feedback']) && f.taskFeedback[0].id === 'explanation' && string(f.taskFeedback[0].feedback, 1200) && f.taskFeedback[0].feedback.trim().length > 0 &&
      (!Object.hasOwn(f, 'misconceptions') || Array.isArray(f.misconceptions) && f.misconceptions.length <= 3 && f.misconceptions.every(m => exact(m, ['statement', 'correction']) && string(m.statement, 300) && m.statement.trim() && string(m.correction, 600) && m.correction.trim())));
  }
  function valid(s) {
    if (!exact(s, ['lesson', 'version', 'ownerUid', 'labels', 'answer', 'aspects', 'history']) || s.lesson !== lesson.id || s.version !== lesson.version || !(s.ownerUid === null || typeof s.ownerUid === 'string' && uid.test(s.ownerUid)) || !string(s.answer, 12000)) return false;
    if (!exact(s.labels, componentIds) || !componentIds.every(id => {
      const label = s.labels[id];
      return exact(label, ['draft', 'earned', 'assisted', 'attempts']) && string(label.draft, 160) && colors.includes(label.earned) && typeof label.assisted === 'boolean' && Number.isSafeInteger(label.attempts) && label.attempts >= 0 && (label.earned === 'gray' || label.attempts > 0) && (label.earned !== 'yellow' || label.assisted);
    }) || !exact(s.aspects, criterionIds) || !criterionIds.every(id => exact(s.aspects[id], ['earned', 'assisted']) && colors.includes(s.aspects[id].earned) && typeof s.aspects[id].assisted === 'boolean' && (s.aspects[id].earned !== 'yellow' || s.aspects[id].assisted))) return false;
    return Array.isArray(s.history) && s.history.length <= 1000 && new Set(s.history.map(h => h?.requestId)).size === s.history.length && s.history.filter(h => h?.status === 'pending' || h?.status === 'unknown').length <= 1 && s.history.every(h =>
      exact(h, ['requestId', 'at', 'rubricVersion', 'taskSignature', 'answer', 'assisted', 'status', 'feedback', 'message', 'applied']) && typeof h.requestId === 'string' && uuid.test(h.requestId) && string(h.at, 40) && Number.isFinite(Date.parse(h.at)) && h.rubricVersion === lesson.version && h.taskSignature === signature && string(h.answer, 12000) && !!answerKey(h.answer) && exact(h.assisted, criterionIds) && criterionIds.every(id => typeof h.assisted[id] === 'boolean') && statuses.includes(h.status) && string(h.message, 1600) && typeof h.applied === 'boolean' &&
      (h.status === 'done' ? validFeedback(h.feedback) : h.feedback === null && h.applied === false));
  }
  function ensure(s) { if (!valid(s)) throw Error('Ungültiger Lernstand. Die gespeicherten Daten bleiben erhalten.'); }
  function component(id) {
    const result = lesson.components.find(c => c.id === id);
    if (!result) throw Error('Unbekanntes Bauteil.');
    return result;
  }
  function checkLabel(id, input) {
    const c = component(id), value = normalize(input);
    return value !== '' && c.aliases.some(alias => {
      const expected = normalize(alias);
      return expected === value || Math.min(value.length, expected.length) >= 6 && oneTypo(value, expected);
    });
  }
  function oneTypo(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, errors = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++errors > 1) return false;
      if (a.length >= b.length) i++;
      if (b.length >= a.length) j++;
    }
    return errors + (i < a.length || j < b.length ? 1 : 0) <= 1;
  }
  function submitLabel(s, id, input) {
    ensure(s); component(id);
    if (!string(input, 160)) throw Error('Die Bezeichnung ist zu lang.');
    const item = s.labels[id]; item.draft = input; item.attempts += 1;
    const correct = checkLabel(id, input);
    if (correct && item.earned === 'gray') item.earned = item.assisted ? 'yellow' : 'green';
    if (!correct) item.assisted = true;
    return correct;
  }
  function useHint(s, id) { ensure(s); const c = component(id); s.labels[id].assisted = true; return c.hint; }
  function scores(s) { return [...componentIds.map(id => s.labels[id].earned), ...criterionIds.map(id => s.aspects[id].earned), 'gray']; }
  function begin(s, requestId, at) {
    ensure(s);
    if (typeof requestId !== 'string' || !uuid.test(requestId) || !string(at, 40) || !Number.isFinite(Date.parse(at))) throw Error('Ungültige Anfragekennung oder Zeitangabe.');
    if (s.history.length >= 1000) throw Error('Die maximale Zahl gespeicherter Prüfungen wurde erreicht.');
    if (s.history.some(h => h.requestId === requestId)) throw Error('Diese Anfragekennung wurde bereits verwendet.');
    if (s.history.some(h => h.status === 'pending' || h.status === 'unknown')) throw Error('Eine frühere Prüfung ist noch ungeklärt. Rufe zuerst ihr Ergebnis ab.');
    if (!answerKey(s.answer)) throw Error('Schreibe zuerst eine Erklärung.');
    if (s.history.some(h => h.status === 'done' && answerKey(h.answer) === answerKey(s.answer))) throw Error('Diese Erklärung wurde bereits geprüft. Die vorhandene Rückmeldung gilt weiterhin.');
    const attempt = { requestId, at, rubricVersion: lesson.version, taskSignature: signature, answer: s.answer,
      assisted: Object.fromEntries(criterionIds.map(id => [id, s.aspects[id].assisted])), status: 'pending', feedback: null, message: '', applied: false };
    s.history.push(attempt); return attempt;
  }
  function cached(s) {
    ensure(s);
    return [...s.history].reverse().find(h => h.status === 'done' && !h.applied && answerKey(h.answer) === answerKey(s.answer)) || null;
  }
  function award(s, h) {
    h.applied = true;
    for (const result of h.feedback.criteria) {
      const aspect = s.aspects[result.id];
      if (result.status === 'met' && aspect.earned === 'gray') aspect.earned = h.assisted[result.id] ? 'yellow' : 'green';
      if (result.status !== 'met') aspect.assisted = true;
    }
  }
  function applyCached(s, requestId) {
    ensure(s);
    const h = s.history.find(entry => entry.requestId === requestId);
    if (!h || h.status !== 'done') throw Error('Keine abgeschlossene Rückmeldung zu dieser Anfrage vorhanden.');
    if (h.applied) return false;
    if (answerKey(h.answer) !== answerKey(s.answer)) throw Error('Diese Rückmeldung passt nicht zum aktuellen Text.');
    award(s, h); return true;
  }
  function finish(s, attempt, feedback) {
    ensure(s);
    const h = s.history.find(entry => entry.requestId === attempt?.requestId);
    if (!h || h.answer !== attempt.answer || h.at !== attempt.at || h.rubricVersion !== attempt.rubricVersion || h.taskSignature !== attempt.taskSignature || JSON.stringify(h.assisted) !== JSON.stringify(attempt.assisted)) throw Error('Die Rückmeldung gehört nicht zur gespeicherten Anfrage.');
    if (!validFeedback(feedback)) throw Error('Ungültige Rückmeldung.');
    if (h.status === 'done') return false;
    if (!['pending', 'unknown'].includes(h.status)) throw Error('Diese Anfrage ist bereits abgeschlossen.');
    h.feedback = clone(feedback); h.status = 'done'; h.message = 'Rückmeldung erhalten.';
    if (answerKey(s.answer) === answerKey(h.answer)) award(s, h);
    return h.applied;
  }
  return { fresh, valid, normalize, checkLabel, submitLabel, useHint, scores, task, validFeedback, begin, finish, cached, applyCached };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = GMZDomain;
