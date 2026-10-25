// Keep widgetId/stateVersion stable after release; define migration before changing stored data.
const bridge = createEduloBridge({root, widgetId: '__WIDGET_ID__', stateVersion: 1,
  hideFooter: true, // false leaves Edulo's check/solution toolbar visible.
  fresh: () => ({answer: '', attempts: 0, solved: false}),
  validate: s => !!s && typeof s.answer === 'string' && Number.isInteger(s.attempts) && s.attempts >= 0 && typeof s.solved === 'boolean',
  onStatus: ({text, error}) => { q('[data-storage]').textContent = text; q('[data-retry]').hidden = !error; }
});
let state, scores;
function render() {
  q('[data-answer]').value = state.answer;
  q('[data-progress]').textContent = scores.filter(s => s === 'green' || s === 'yellow').length + ' von ' + scores.length + ' Kriterien erreicht';
  q('[data-feedback]').textContent = state.solved ? 'Richtig gelöst.' : '';
}
async function start() {
  q('[data-controls]').disabled = true;
  try { const loaded = await bridge.load(); state = loaded.data; scores = loaded.scores; render(); q('[data-controls]').disabled = bridge.getStatus().mode === 'editor'; }
  catch {} // Bridge reports the actionable error; no silent fresh state.
}
q('[data-answer]').addEventListener('input', () => { state.answer = q('[data-answer]').value; bridge.queueSave(state, scores); });
q('[data-check]').addEventListener('click', () => {
  state.answer = q('[data-answer]').value;
  const correct = state.answer.trim() === '5';
  if (!state.solved) {
    if (correct) { scores[0] = state.attempts ? 'yellow' : 'green'; state.solved = true; }
    else state.attempts++;
  }
  try { bridge.save(state, scores); } catch {}
  render(); if (!correct) q('[data-feedback]').textContent = 'Versuche es noch einmal.';
});
q('[data-retry]').addEventListener('click', start);
// Natural content height: Edulo scrolls the whole page.
start();
