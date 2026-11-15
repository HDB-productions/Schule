/* One hand revolution represents two seconds of continuous movement time. */
const MotionClock = (() => {
  const seconds = time => time.toFixed(2).replace('.', ',') + ' s';
  function angle(time) {
    if (!Number.isFinite(time) || time < 0) throw new RangeError('Clock time must be finite and nonnegative.');
    const result = 180 * time;
    if (!Number.isFinite(result)) throw new RangeError('Clock angle must be finite.');
    return result;
  }

  function html(kind) {
    if (!['ball','uniform','accelerated'].includes(kind)) throw new RangeError('Unknown motion clock: ' + kind);
    const id = 'motion-clock-' + kind;
    const ticks = Array.from({length:40}, (_, i) => {
      const major = i % 10 === 0, middle = i % 5 === 0;
      return `<line x1="48" y1="${major ? 12 : middle ? 13 : 14}" x2="48" y2="${major ? 18 : middle ? 17 : 16}" transform="rotate(${i*9} 48 48)" stroke="${major ? '#f3f7fa' : '#9aadb9'}" stroke-width="${major ? 1.7 : 0.9}"/>`;
    }).join('');
    return `<span class="motion-stopwatch" style="display:inline-flex;align-items:center;gap:10px;max-width:100%;vertical-align:middle">
      <svg data-clock-face xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="Analoge Stoppuhr: 0,00 Sekunden. Ein Umlauf entspricht zwei Sekunden." style="display:block;width:96px;max-width:100%;height:auto;flex:0 1 96px;overflow:visible">
        <defs>
          <linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5f7f9"/><stop offset=".24" stop-color="#8d9daa"/><stop offset=".49" stop-color="#e8edf1"/><stop offset=".73" stop-color="#617380"/><stop offset="1" stop-color="#c6d0d7"/></linearGradient>
          <radialGradient id="${id}-dial" cx=".38" cy=".24" r=".9"><stop stop-color="#253742"/><stop offset="1" stop-color="#07131c"/></radialGradient>
        </defs>
        <rect x="41" y="1" width="14" height="8" rx="2" fill="url(#${id}-metal)" stroke="#4c606e"/>
        <path d="M44 2V7M48 2V7M52 2V7" stroke="#6c7d89" stroke-width=".8"/>
        <circle cx="48" cy="49" r="44" fill="#000" opacity=".2"/>
        <circle cx="48" cy="48" r="43" fill="url(#${id}-metal)" stroke="#485e6d" stroke-width="1"/>
        <circle cx="48" cy="48" r="38.8" fill="url(#${id}-dial)" stroke="#071018" stroke-width="1.8"/>
        <circle cx="48" cy="48" r="37" fill="none" stroke="#718592" stroke-opacity=".4" stroke-width=".6"/>
        ${ticks}
        <g fill="#e6eff5" font-family="system-ui,sans-serif" font-size="10" font-weight="600" text-anchor="middle">
          <text x="48" y="29">0</text><text x="67" y="51.5">0,5</text><text x="48" y="75">1,0</text><text x="29" y="51.5">1,5</text>
        </g>
        <text x="48" y="64" fill="#8fa5b5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="6.5" letter-spacing="1.2">SEKUNDEN</text>
        <line data-clock-hand x1="48" y1="55" x2="48" y2="16" transform="rotate(0 48 48)" data-angle="0" stroke="#ff5c67" stroke-width="2.3" stroke-linecap="round"/>
        <circle cx="48" cy="48" r="4.2" fill="url(#${id}-metal)" stroke="#071018" stroke-width="1"/>
        <circle cx="48" cy="48" r="1.5" fill="#ff5c67"/>
      </svg>
      <span style="display:inline-flex;flex-direction:column;gap:2px;min-width:4.5em"><span style="font-size:.7rem;letter-spacing:.04em;color:inherit;opacity:.75">Bewegungszeit</span><output data-clock aria-label="Bewegungszeit" aria-live="off" style="font-variant-numeric:tabular-nums;font-size:.9rem;font-weight:650;white-space:nowrap">0,00 s</output><span style="font-size:.65rem;opacity:.7">1 Umlauf = 2 s</span></span>
    </span>`;
  }

  function update(host, time) {
    const degrees = angle(time);
    const hand = host.querySelector('[data-clock-hand]');
    const digital = host.querySelector('[data-clock]');
    const face = host.querySelector('[data-clock-face]');
    if (!hand || !digital || !face) throw new Error('Motion clock elements are missing from the supplied host.');
    hand.setAttribute('transform', `rotate(${degrees} 48 48)`);
    hand.setAttribute('data-angle', String(degrees));
    digital.textContent = seconds(time);
    face.setAttribute('aria-label', `Analoge Stoppuhr: ${time.toFixed(2).replace('.', ',')} Sekunden. Ein Umlauf entspricht zwei Sekunden.`);
  }

  return { html, update, angle };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = MotionClock;
