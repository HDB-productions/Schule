const LegacyMotion = (() => {
  'use strict';
  const TYPES = ['distance_duration', 'table', 'clock', 'inferred', 'direct_zero', 'direct_offset'];
  const ACTORS = [
    { name: 'Ein Linienbus', trip: 'Fahrt', speeds: [36, 48, 60, 72] },
    { name: 'Ein Zug', trip: 'Fahrt', speeds: [60, 80, 100, 120] },
    { name: 'Eine Radfahrerin', trip: 'Fahrt', speeds: [12, 16, 20, 24] },
    { name: 'Ein Wanderer', trip: 'Wanderung', speeds: [4, 5, 6] }
  ];
  const f = n => String(Math.round(n * 1000000) / 1000000).replace('.', ',');
  const close = (a, b, tolerance = 0.000001) => Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b));
  const bounded = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
  const integer = (n, min, max) => Number.isInteger(n) && bounded(n, min, max);
  const timeText = minutes => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')} Uhr`;
  function makeTask(index, data) {
    const type = TYPES[index % TYPES.length];
    const actor = ACTORS[data.actor];
    const { v, s0, elapsed, firstT, targetT, clockStart } = data;
    const distance = v * elapsed;
    let information;
    let title;
    const origin = `Die Strecke hat Kilometerangaben. Die Marke 0 km ist der feste Bezugspunkt. Die positive Richtung führt zu größeren Kilometerangaben. Die Bewegung verläuft ohne Pause mit gleichbleibender Geschwindigkeit in positiver Richtung.`;
    switch (type) {
      case 'distance_duration':
        title = 'Strecke und Dauer';
        information = `${actor.name} startet bei der Marke ${f(s0)} km. Dieser Start ist t = 0. In ${f(elapsed * 60)} Minuten werden ${f(distance)} km zurückgelegt.`;
        break;
      case 'table':
        title = 'Zwei Messwerte';
        information = `${actor.name} wird ab dem Einschalten einer Stoppuhr beobachtet. Das Einschalten ist t = 0. Die Messwerte sind: nach ${f(firstT * 60)} Minuten an der Marke ${f(s0 + v * firstT)} km; nach ${f((firstT + elapsed) * 60)} Minuten an der Marke ${f(s0 + v * (firstT + elapsed))} km.`;
        break;
      case 'clock':
        title = 'Uhrzeiten vergleichen';
        information = `${actor.name} ist um ${timeText(clockStart)} an der Marke ${f(s0)} km. Diese Uhrzeit ist t = 0. Bis ${timeText(clockStart + elapsed * 60)} werden ${f(distance)} km zurückgelegt.`;
        break;
      case 'inferred':
        title = 'Startort rückwärts bestimmen';
        information = `${actor.name} bewegt sich mit ${f(v)} km/h. Das Einschalten einer Stoppuhr ist t = 0. Nach ${f(firstT * 60)} Minuten wird die Marke ${f(s0 + v * firstT)} km erreicht. Der Ort beim Einschalten wird gesucht.`;
        break;
      default:
        title = type === 'direct_zero' ? 'Start am Bezugspunkt' : 'Start mit Vorsprung';
        information = `${actor.name} startet bei der Marke ${f(s0)} km und bewegt sich mit ${f(v)} km/h. Dieser Start ist t = 0.`;
    }
    return {
      type, title, context: `${information} ${origin}`, v, s0, targetT,
      answer: s0 + v * targetT,
      prompts: [
        'Bestimme die Geschwindigkeit v. Gib die Einheit km/h an.',
        'Bestimme den Anfangsort s₀ bei t = 0. Gib die Einheit km an.',
        'Stelle die Ortsfunktion s(t) auf. In dieser Formel steht t für den Zahlenwert der Zeit in Stunden und s für den Zahlenwert des Ortes in Kilometern. Schreibe deshalb die Formel ohne Einheiten.',
        `An welcher Kilometermarke befindet sich die Person oder das Fahrzeug ${f(targetT * 60)} Minuten nach t = 0? Gib den Ort mit der Einheit km an.`
      ],
      data: { ...data }
    };
  }
  function generate(index, rng = Math.random) {
    if (!integer(index, 0, 1000000)) throw new RangeError('Ungültige Aufgabennummer.');
    const choose = values => {
      const n = rng();
      if (!bounded(n, 0, 1) || n === 1) throw new RangeError('Zufallswert muss zwischen 0 und 1 liegen.');
      return values[Math.floor(n * values.length)];
    };
    const actor = choose([0, 1, 2, 3]);
    const v = choose(ACTORS[actor].speeds);
    const elapsed = choose([0.25, 0.5, 0.75, 1, 1.5]);
    const firstT = choose([0.25, 0.5, 0.75]);
    const s0 = index % TYPES.length === 4 ? 0 : choose([2, 3, 5, 8, 10, 12]);
    const targetT = firstT + elapsed + choose([0.25, 0.5, 1]);
    const clockStart = choose([480, 495, 510, 540, 555, 600]);
    return makeTask(index, { actor, v, s0, elapsed, firstT, targetT, clockStart });
  }

  // Evaluate only affine arithmetic, represented by [constant, coefficient of t].
  // No JavaScript evaluation, property access, functions, or arbitrary identifiers.
  function affine(input) {
    let source = input.toLowerCase().replace(/\s+/g, '').replace(/,/g, '.').replace(/[·×]/g, '*').replace(/−/g, '-');
    source = source.replace(/^s(?:\(t\))?=/, '');
    if (!source || source.length > 180) throw new Error('Schreibe eine kurze Formel mit t.');
    const raw = source.match(/(?:\d+(?:\.\d*)?|\.\d+)|t|[()+*/-]/g) || [];
    if (raw.join('') !== source || raw.length > 100) throw new Error('Verwende nur Zahlen, t, Klammern und +, −, ·, /. Lass Einheiten in der Formel weg.');
    const tokens = [];
    const number = token => /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token || '');
    for (const token of raw) {
      const previous = tokens[tokens.length - 1];
      if ((number(previous) || previous === 't' || previous === ')') && (token === 't' || token === '(' || (previous === ')' && number(token)))) tokens.push('*');
      tokens.push(token);
    }
    let p = 0;
    function atom() {
      if (tokens[p] === '+' || tokens[p] === '-') {
        const sign = tokens[p++] === '-' ? -1 : 1;
        return atom().map(n => n * sign);
      }
      if (tokens[p] === '(') {
        p++;
        const value = sum();
        if (tokens[p++] !== ')') throw new Error('Prüfe die Klammern.');
        return value;
      }
      if (tokens[p] === 't') { p++; return [0, 1]; }
      if (number(tokens[p])) return [Number(tokens[p++]), 0];
      throw new Error('Die Formel ist noch nicht vollständig.');
    }
    function product() {
      let value = atom();
      while (tokens[p] === '*' || tokens[p] === '/') {
        const op = tokens[p++];
        const other = atom();
        if (op === '*') {
          if (value[1] !== 0 && other[1] !== 0) throw new Error('Bei gleichförmiger Bewegung ist die Ortsfunktion linear: s(t) = v · t + s₀.');
          value = [value[0] * other[0], value[1] * other[0] + value[0] * other[1]];
        } else {
          if (other[1] !== 0 || other[0] === 0) throw new Error('Teile nur durch eine feste Zahl ungleich 0.');
          value = value.map(n => n / other[0]);
        }
      }
      return value;
    }
    function sum() {
      let value = product();
      while (tokens[p] === '+' || tokens[p] === '-') {
        const sign = tokens[p++] === '+' ? 1 : -1;
        const other = product();
        value = value.map((n, i) => n + sign * other[i]);
      }
      return value;
    }
    const result = sum();
    if (p !== tokens.length || !result.every(Number.isFinite)) throw new Error('Prüfe die Schreibweise deiner Formel.');
    return result;
  }
  function check(task, step, input) {
    if (!integer(step, 0, 3) || typeof input !== 'string' || input.length > 200) return { ok: false, message: 'Prüfe deine Eingabe.' };
    if (!input.trim()) return { ok: false, message: 'Trage zuerst eine Antwort ein.' };
    if (step === 2) {
      try {
        const [constant, slope] = affine(input);
        if (!close(slope, task.v)) return { ok: false, message: 'Der Faktor vor t muss deiner Geschwindigkeit entsprechen. Prüfe ihn noch einmal.' };
        if (!close(constant, task.s0)) return { ok: false, message: 'Für t = 0 muss die Formel deinen Anfangsort ergeben. Prüfe das feste Glied.' };
        return { ok: true, message: 'Richtig! Die Formel beschreibt den Ort zu jeder Zeit.' };
      } catch (error) { return { ok: false, message: error.message }; }
    }
    const normalized = input.toLowerCase().trim().replace(/,/g, '.').replace(/−/g, '-').replace(/\s+/g, '');
    const match = normalized.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\/((?:\d+(?:\.\d*)?|\.\d+)))?(km\/h|km\/min|m\/s|km|m)?$/);
    if (!match) return { ok: false, message: step === 0 ? 'Schreibe einen Zahlenwert mit km/h, zum Beispiel 40 km/h.' : 'Schreibe einen Zahlenwert mit km, zum Beispiel 3 km.' };
    if (!match[3]) return { ok: false, message: `Die Einheit fehlt. Gib ${step === 0 ? 'km/h' : 'km'} an.` };
    const factors = step === 0 ? { 'km/h': 1, 'km/min': 60, 'm/s': 3.6 } : { km: 1, m: 0.001 };
    if (!(match[3] in factors)) return { ok: false, message: step === 0 ? 'Eine Geschwindigkeit braucht eine Strecke pro Zeit. Verwende km/h.' : 'Gesucht ist ein Ort. Verwende die Längeneinheit km.' };
    const value = Number(match[1]) / (match[2] ? Number(match[2]) : 1) * factors[match[3]];
    const expected = step === 0 ? task.v : step === 1 ? task.s0 : task.answer;
    const ok = Number.isFinite(value) && close(value, expected, match[3] === 'm/s' ? 0.0005 : 0.000001);
    return { ok, message: ok ? 'Richtig!' : step === 0 ? 'Prüfe Strecke und Zeitspanne. Rechne Minuten in Stunden um.' : step === 1 ? 'Gesucht ist der Ort bei t = 0, nicht die seitdem zurückgelegte Strecke.' : 'Rechne die Zeit in Stunden um und setze sie in deine Ortsfunktion ein.' };
  }
  function hints(task, step) {
    const { v, s0, targetT, type, data } = task;
    if (step === 0) {
      if (type === 'inferred' || type.startsWith('direct_')) return ['Die Geschwindigkeit ist im Text angegeben.', 'Suche nach der Angabe mit der Einheit km/h.', `Die Geschwindigkeit beträgt v = ${f(v)} km/h.`];
      const delta = type === 'table'
        ? `Δs = ${f(s0 + v * (data.firstT + data.elapsed))} km − ${f(s0 + v * data.firstT)} km = ${f(v * data.elapsed)} km.`
        : `Die zurückgelegte Strecke ist ${f(v * data.elapsed)} km.`;
      const duration = type === 'clock' ? `Zwischen ${timeText(data.clockStart)} und ${timeText(data.clockStart + data.elapsed * 60)} liegen ${f(data.elapsed * 60)} Minuten.` : `Die Zeitspanne beträgt ${f(data.elapsed * 60)} Minuten.`;
      return ['Nutze v = Δs / Δt: zurückgelegte Strecke geteilt durch die dafür benötigte Zeit.', `${delta} ${duration} Teile die Minuten durch 60: Δt = ${f(data.elapsed)} h.`, `v = ${f(v * data.elapsed)} km / ${f(data.elapsed)} h = ${f(v)} km/h.`];
    }
    if (step === 1) {
      if (type === 'table' || type === 'inferred') return ['Der Anfangsort ist der Ort bei t = 0. Rechne von einem bekannten späteren Ort zurück.', `Nach ${f(data.firstT)} h ist der Ort ${f(s0 + v * data.firstT)} km. Bis dahin wurden ${f(v)} km/h · ${f(data.firstT)} h zurückgelegt.`, `s₀ = ${f(s0 + v * data.firstT)} km − ${f(v * data.firstT)} km = ${f(s0)} km.`];
      return ['Suche den Ort, der zum festgelegten Zeitpunkt t = 0 gehört.', 'Die Kilometermarke zum Startzeitpunkt ist der Anfangsort. Sie muss nicht 0 sein.', `Der Anfangsort ist s₀ = ${f(s0)} km.`];
    }
    if (step === 2) return ['Bei gleichförmiger Bewegung gilt: Ort = Anfangsort + Geschwindigkeit · Zeit.', `Verwende die Zahlenwerte v = ${f(v)} und s₀ = ${f(s0)}. Das Muster ist s(t) = v · t + s₀.`, `Eine passende Formel lautet s(t) = ${f(v)} · t + ${f(s0)}. Hier ist t der Zahlenwert in Stunden, s der Zahlenwert in Kilometern.`];
    if (step === 3) return ['Setze die gesuchte Zeit in deine Ortsfunktion ein. Beachte den Anfangsort.', `${f(targetT * 60)} Minuten / 60 = ${f(targetT)} Stunden. Berechne ${f(v)} · ${f(targetT)} + ${f(s0)}.`, `s(${f(targetT)}) = ${f(v)} · ${f(targetT)} + ${f(s0)} = ${f(task.answer)}. Der Ort ist ${f(task.answer)} km.`];
    return [];
  }
  const emptySteps = () => Array.from({ length: 4 }, () => ({ input: '', cursor: 0, errors: 0, hint: 0, solved: false, feedback: '' }));
  const fresh = () => ({ task: generate(0), index: 0, steps: emptySteps(), total: 0, independent: 0 });
  function completeStep(state, step) {
    if (!integer(step, 0, 3) || state.steps[step].solved || state.steps.slice(0, step).some(item => !item.solved)) return false;
    const item = state.steps[step];
    item.solved = true;
    state.total = Math.min(20, state.total + 1);
    if (item.errors === 0 && item.hint === 0) state.independent = Math.min(20, state.independent + 1);
    return true;
  }
  const scoreColors = state => Array.from({ length: 20 }, (_, i) => i < state.independent ? 'green' : i < state.total ? 'yellow' : 'gray');
  function validate(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state) || !integer(state.index, 0, 1000000) || !integer(state.total, 0, 20) || !integer(state.independent, 0, state.total)) return false;
    const task = state.task;
    if (!task || typeof task !== 'object' || !task.data || typeof task.data !== 'object') return false;
    const d = task.data;
    if (!integer(d.actor, 0, 3) || !ACTORS[d.actor].speeds.includes(d.v) || ![0, 2, 3, 5, 8, 10, 12].includes(d.s0) || ![0.25, 0.5, 0.75, 1, 1.5].includes(d.elapsed) || ![0.25, 0.5, 0.75].includes(d.firstT) || ![480, 495, 510, 540, 555, 600].includes(d.clockStart)) return false;
    if (!bounded(d.targetT, 0.75, 3.25) || ![0.25, 0.5, 1].some(extra => close(d.targetT, d.firstT + d.elapsed + extra))) return false;
    if ((state.index % TYPES.length === 4) !== (d.s0 === 0)) return false;
    const expected = makeTask(state.index, d);
    for (const key of ['type', 'title', 'context', 'v', 's0', 'targetT', 'answer']) if (task[key] !== expected[key]) return false;
    if (!Array.isArray(task.prompts) || task.prompts.length !== 4 || task.prompts.some((text, i) => text !== expected.prompts[i])) return false;
    if (!Array.isArray(state.steps) || state.steps.length !== 4) return false;
    let unsolved = false;
    let solvedCount = 0;
    for (const step of state.steps) {
      if (!step || typeof step !== 'object' || typeof step.input !== 'string' || step.input.length > 200 || !integer(step.cursor, 0, step.input.length) || !integer(step.errors, 0, 1000000) || !integer(step.hint, 0, 3) || typeof step.solved !== 'boolean' || typeof step.feedback !== 'string' || step.feedback.length > 1000) return false;
      if (step.solved && unsolved) return false;
      if (step.solved) solvedCount++; else unsolved = true;
    }
    if (state.total !== Math.min(20, state.index * 4 + solvedCount)) return false;
    return true;
  }
  return { generate, makeTask, check, hints, fresh, validate, scoreColors, completeStep };
})();



// Current schemas keep the original validator above solely for existing prototype states.
const Motion = (() => {
  'use strict';
  const f=n=>String(Math.round(n*1e6)/1e6).replace('.',',');
  const clone=x=>JSON.parse(JSON.stringify(x));
  const near=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-6*Math.max(1,Math.abs(b));
  const integer=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
  const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
  const actors=[
    {name:'Bus',subject:'Ein Bus',pronoun:'Er',ref:'Ortsschild',way:'auf einer geraden Straße',motion:'fährt',past:'gefahren',pass:'am Ortsschild vorbeifährt',steady:'Er fährt ohne Zwischenhalt mit gleichbleibender Geschwindigkeit weiter vom Ortsschild weg.'},
    {name:'Zug',subject:'Ein Zug',pronoun:'Er',ref:'Bahnübergang',way:'auf einer geraden Strecke',motion:'fährt',past:'gefahren',pass:'über den Bahnübergang fährt',steady:'Er fährt ohne Halt mit gleichbleibender Geschwindigkeit weiter vom Bahnübergang weg.'},
    {name:'Radfahrerin',subject:'Eine Radfahrerin',pronoun:'Sie',ref:'Wegweiser',way:'auf einem geraden Radweg',motion:'fährt',past:'gefahren',pass:'am Wegweiser vorbeifährt',steady:'Sie fährt mit gleichbleibender Geschwindigkeit weiter vom Wegweiser weg.'},
    {name:'Wanderer',subject:'Ein Wanderer',pronoun:'Er',ref:'Waldrand',way:'auf einem geraden Wanderweg',motion:'geht',past:'gegangen',pass:'den Waldrand erreicht',steady:'Er geht mit gleichbleibender Geschwindigkeit weiter vom Waldrand weg.'}
  ];
  const types=['distance_duration','table','clock','inferred','direct_zero','direct_offset'];
  const titles=['Strecke und Dauer','Zwei Beobachtungen','Ein Blick auf die Uhr','Den Anfangsort herausfinden','Zeitmessung beim Vorbeikommen','Schon unterwegs'];
  function textFor(type,a,n){
    const beginning=`${a.subject} ist ${a.way} unterwegs.`;
    switch(type){
      case 'distance_duration': return `${beginning} Als die Zeitmessung beginnt, ist ${a.pronoun.toLowerCase()} schon ${n.s0} km vom ${a.ref} entfernt. ${a.steady} In den nächsten ${n.duration} Minuten legt ${a.pronoun.toLowerCase()} weitere ${n.distance} km zurück.`;
      case 'table': return `${beginning} Wir starten die Zeitmessung, während ${a.pronoun.toLowerCase()} sich bereits vom ${a.ref} entfernt. ${a.steady} Nach ${n.firstMinutes} Minuten beträgt der Abstand zum ${a.ref} ${n.firstPosition} km, nach insgesamt ${n.secondMinutes} Minuten sind es ${n.secondPosition} km.`;
      case 'clock': return `${beginning} Um ${n.startClock} Uhr ist ${a.pronoun.toLowerCase()} ${n.s0} km vom ${a.ref} entfernt. Zu diesem Zeitpunkt beginnen wir die Zeitmessung. ${a.steady} Bis ${n.endClock} Uhr legt ${a.pronoun.toLowerCase()} weitere ${n.distance} km zurück.`;
      case 'inferred': return `${a.subject} ${a.motion} ${a.way} gleichmäßig mit ${n.v} km/h vom ${a.ref} weg${a.name==='Bus'||a.name==='Zug'?', ohne zwischendurch anzuhalten':''}. Wir beginnen die Zeitmessung, als ${a.pronoun.toLowerCase()} bereits unterwegs ist. ${n.firstMinutes} Minuten später ist ${a.pronoun.toLowerCase()} ${n.firstPosition} km vom ${a.ref} entfernt.`;
      case 'direct_zero': return `${a.subject} ${a.motion} ${a.way} gleichmäßig mit ${n.v} km/h. Als ${a.pronoun.toLowerCase()} ${a.pass}, starten wir die Zeitmessung. ${a.steady}`;
      case 'direct_offset': return `${a.subject} ${a.motion} ${a.way} gleichmäßig mit ${n.v} km/h vom ${a.ref} weg${a.name==='Bus'||a.name==='Zug'?', ohne zwischendurch anzuhalten':''}. Als wir die Zeitmessung starten, ist ${a.pronoun.toLowerCase()} schon ${n.s0} km vom ${a.ref} entfernt.`;
      default: throw Error('Unbekannter Aufgabentyp.');
    }
  }
  function adapt(task){
    const d=task.data,a=actors[d.actor];
    const n={s0:f(d.s0),v:f(d.v),duration:f(d.elapsed*60),distance:f(d.v*d.elapsed),firstMinutes:f(d.firstT*60),secondMinutes:f((d.firstT+d.elapsed)*60),firstPosition:f(d.s0+d.v*d.firstT),secondPosition:f(d.s0+d.v*(d.firstT+d.elapsed)),startClock:clock(d.clockStart),endClock:clock(d.clockStart+d.elapsed*60)};
    return {...task,title:`${a.name} · ${titles[types.indexOf(task.type)]}`,context:textFor(task.type,a,n),prompts:[
      'Bestimme die Geschwindigkeit in km/h. Du kannst einen Wert oder einen Rechenansatz mit Einheiten eingeben. Rechne die Zeit dafür in Stunden um.',
      `Wie weit war ${a.name==='Radfahrerin'?'die Radfahrerin':a.name==='Wanderer'?'der Wanderer':'der '+a.name} zu Beginn der Zeitmessung vom ${a.ref} entfernt? Gib die Anfangsposition mit der Einheit km an.`,
      'Stelle eine Formel für die Position zu einer beliebigen Zeit auf. Trage nur die rechte Seite ein, mit den Einheiten km/h und km. Für t setzt du die Zeit seit Beginn der Messung in Stunden ein.',
      `Wie weit ist ${a.name==='Radfahrerin'?'die Radfahrerin':a.name==='Wanderer'?'der Wanderer':'der '+a.name} ${f(task.targetT*60)} Minuten nach Beginn der Zeitmessung vom ${a.ref} entfernt? Gib die Position in km an.`
    ]};
  }
  const generate=(index,rng)=>adapt(LegacyMotion.generate(index,rng));
  function textTemplates(){const n={s0:'[Anfangsabstand]',v:'[Geschwindigkeit]',duration:'[Dauer]',distance:'[weitere Strecke]',firstMinutes:'[erste Zeit]',secondMinutes:'[zweite Zeit]',firstPosition:'[erster Abstand]',secondPosition:'[zweiter Abstand]',startClock:'[erste Uhrzeit]',endClock:'[zweite Uhrzeit]'};return types.flatMap((type,i)=>actors.map(a=>({title:`${i+1}. ${titles[i]} – ${a.name}`,text:textFor(type,a,n)})));}
  // Polynomial in t with one common physical dimension per expression: km and h.
  function expression(input){
    let source=input.toLowerCase().replace(/\s+/g,'').replace(/,/g,'.').replace(/[·×]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/^s(?:\(t\))?=/,'');
    if(!source||source.length>200)throw Error('Die Eingabe fehlt oder ist zu lang.');
    const raw=source.match(/(?:\d+(?:\.\d*)?|\.\d+)|min|km|[mhts()+*/-]/g)||[];
    if(raw.join('')!==source||raw.length>120)throw Error('Verwende Zahlen, t, Einheiten und die Rechentasten.');
    const number=t=>/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t||'');
    const symbol=t=>['t','km','m','h','min','s'].includes(t);
    const tokens=[];
    for(const token of raw){const prev=tokens[tokens.length-1];if((number(prev)||symbol(prev)||prev===')')&&(symbol(token)||token==='('||(prev===')'&&number(token))))tokens.push('implicit');tokens.push(token);}
    const val=(a,b=0,L=0,T=0)=>({a,b,L,T});
    const units={km:val(1,0,1,0),m:val(.001,0,1,0),h:val(1,0,0,1),min:val(1/60,0,0,1),s:val(1/3600,0,0,1)};
    let p=0,depth=0;
    function atom(){
      if(++depth>32)throw Error('Verwende weniger verschachtelte Klammern.');
      let x;const token=tokens[p++];
      if(token==='+'||token==='-'){x=atom();if(token==='-')x={...x,a:-x.a,b:-x.b};}
      else if(token==='('){x=sum();if(tokens[p++]!==')')throw Error('Prüfe die Klammern.');}
      else if(token==='t')x=val(0,1,0,1);
      else if(units[token])x={...units[token]};
      else if(number(token))x=val(Number(token));
      else throw Error('Die Eingabe ist noch nicht vollständig.');
      depth--;return x;
    }
    function combine(x,y,op){if(op!=='/'){if(x.b!==0&&y.b!==0)throw Error('Bei gleichförmiger Bewegung kommt t nur in der ersten Potenz vor.');return val(x.a*y.a,x.b*y.a+x.a*y.b,x.L+y.L,x.T+y.T);}if(y.b!==0||y.a===0)throw Error('Teile nicht durch t oder durch null.');return val(x.a/y.a,x.b/y.a,x.L-y.L,x.T-y.T);}
    // A written quantity stays together: 36 km / 0,5 h means 36 km / (0,5 h).
    // Explicit products and divisions retain normal left-to-right precedence.
    function measured(){let x=atom();while(tokens[p]==='implicit'&&units[tokens[p+1]]){p++;const unit=tokens[p];x=combine(x,atom(),'*');if((unit==='km'||unit==='m')&&tokens[p]==='/'&&['h','min','s'].includes(tokens[p+1])){p++;x=combine(x,atom(),'/');}}return x;}
    function product(){let x=measured();while(tokens[p]==='*'||tokens[p]==='/'||tokens[p]==='implicit'){const op=tokens[p++];x=combine(x,measured(),op);}return x;}
    function sum(){let x=product();while(tokens[p]==='+'||tokens[p]==='-'){const sign=tokens[p++]==='+'?1:-1,y=product();if(x.L!==y.L||x.T!==y.T){if(x.a===0&&x.b===0&&x.L===0&&x.T===0){x.L=y.L;x.T=y.T;}else if(!(y.a===0&&y.b===0&&y.L===0&&y.T===0))throw Error('Die Einheiten passen bei der Addition nicht zusammen. Geschwindigkeit · Zeit und Anfangsposition müssen Längen ergeben.');}x=val(x.a+sign*y.a,x.b+sign*y.b,x.L,x.T);}return x;}
    const result=sum();if(p!==tokens.length||![result.a,result.b,result.L,result.T].every(Number.isFinite))throw Error('Prüfe die Schreibweise.');return result;
  }
  const dims={km:[1,0],min:[0,1],h:[0,1],'km/h':[1,-1]};
  function quantity(input,expected,unit){try{const x=expression(input),[L,T]=dims[unit];const value=unit==='min'?expected/60:expected;return x.L===L&&x.T===T&&x.b===0&&near(x.a,value);}catch{return false;}}
  function check(task,step,input){
    if(!integer(step,0,3)||typeof input!=='string'||input.length>200)return {ok:false,message:'Prüfe deine Eingabe.'};
    if(!input.trim())return {ok:false,message:'Trage zuerst eine Antwort ein.'};
    if(step!==2){
      if(step===0&&/(?:min|s)/i.test(input))return {ok:false,message:'Rechne die Zeit zuerst in Stunden um: Minuten durch 60, Sekunden durch 3600. Verwende h und gib die Geschwindigkeit in km/h an.'};
      try{const x=expression(input),speed=step===0;
        if(x.b!==0)return {ok:false,message:'Berechne hier einen Zahlenwert mit Einheit. Setze für t die passende Zeit ein.'};
        if(x.L!==1||x.T!==(speed?-1:0))return {ok:false,message:speed?'Eine Geschwindigkeit braucht eine Strecke pro Zeit. Verwende km/h.':'Gesucht ist eine Position. Gib deine Rechnung mit der Längeneinheit km ein.'};
        const expected=speed?task.v:step===1?task.s0:task.answer,ok=near(x.a,expected);
        return {ok,message:ok?'Richtig!':speed?'Prüfe Strecke und Zeitspanne. Rechne Minuten in Stunden um.':step===1?'Gesucht ist der Ort bei t = 0, nicht die seitdem zurückgelegte Strecke.':'Rechne die Zeit in Stunden um und setze sie in deine Ortsfunktion ein.'};
      }catch(e){return {ok:false,message:e.message};}
    }
    try{const x=expression(input);if(x.L!==1||x.T!==0)return {ok:false,message:'Die Formel muss eine Position ergeben. Gib die Geschwindigkeit mit km/h und die Anfangsposition mit km ein.'};
      if(!near(x.b,task.v))return {ok:false,message:'Prüfe die Geschwindigkeit vor t und ihre Einheit.'};
      if(!near(x.a,task.s0))return {ok:false,message:'Für t = 0 muss die Formel die Anfangsposition ergeben. Prüfe das feste Glied und seine Einheit.'};
      return {ok:true,message:'Die Bewegungsformel ist richtig.'};
    }catch(e){return {ok:false,message:e.message};}
  }
  function canonicalAnswer(task,step){return step===0?`${f(task.v)} km/h`:step===1?`${f(task.s0)} km`:step===2?`${f(task.v)} km/h · t + ${f(task.s0)} km`:`${f(task.answer)} km`;}
  function preparation(task,legacy=false){
    const d=task.data,cell=(label,prefix,unit,expected)=>({label:unit==='clock'?label:label+' '+prefix.replace(' =',''),prefix,unit,expected});let cells,layout='givens';
    switch(task.type){
      case 'table':layout='pairs';cells=[cell('Zeit der ersten Beobachtung','t₁ =','min',d.firstT*60),cell('Zeit der zweiten Beobachtung','t₂ =','min',(d.firstT+d.elapsed)*60),cell('Position bei der ersten Beobachtung','s₁ =','km',d.s0+d.v*d.firstT),cell('Position bei der zweiten Beobachtung','s₂ =','km',d.s0+d.v*(d.firstT+d.elapsed))];break;
      case 'distance_duration':cells=[cell('Anfangsposition','s₀ =','km',d.s0),cell('Dauer','Δt =','min',d.elapsed*60),cell('Zurückgelegte Strecke','Δs =','km',d.v*d.elapsed)];break;
      case 'clock':cells=[cell('Anfangsposition','s₀ =','km',d.s0),cell('Startuhrzeit','Beginn:','clock',clock(d.clockStart)),cell('Enduhrzeit','Ende:','clock',clock(d.clockStart+d.elapsed*60)),cell('Zurückgelegte Strecke','Δs =','km',d.v*d.elapsed)];break;
      case 'inferred':cells=[cell('Zeit seit Beginn','t₁ =','min',d.firstT*60),cell('Position zu dieser Zeit','s₁ =','km',d.s0+d.v*d.firstT),cell('Geschwindigkeit','v =','km/h',d.v)];break;
      default:cells=[cell('Anfangsposition','s₀ =','km',d.s0),cell('Geschwindigkeit','v =','km/h',d.v)];break;
    }
    if(task.type==='clock'&&!legacy)cells.push(cell('Dauer der Zeitmessung','Δt =','min',d.elapsed*60));
    return {title:'Gegebene Größen',instruction:layout==='pairs'?'Trage die beiden Beobachtungen in die Wertetabelle ein: oben die Zeit seit Beginn der Messung, darunter die zugehörige Position.':task.type==='clock'?'Ordne die Angaben aus dem Text zu und berechne aus Start- und Enduhrzeit die Dauer der Zeitmessung in Minuten.':'Ordne die Angaben aus dem Text zu. Unterscheide die Position von einer zusätzlich zurückgelegten Strecke.',layout,cells};
  }
  function checkPreparation(task,inputs,legacy=false){const cells=preparation(task,legacy).cells;if(!Array.isArray(inputs)||inputs.length!==cells.length)return {ok:false,message:'Fülle alle Tabellenfelder aus.'};for(let i=0;i<cells.length;i++){const c=cells[i],input=inputs[i];const valid=typeof input==='string'&&(c.unit==='clock'?/^\d{1,2}:\d{2}$/.test(input.trim())&&input.trim().padStart(5,'0')===c.expected:quantity(input,c.expected,c.unit));if(!valid)return {ok:false,message:`Prüfe das Feld „${c.label}“${c.unit==='clock'?' (Stunde:Minute)':` und seine Einheit ${c.unit}`}.`};}return {ok:true,message:'Die Angaben sind richtig zugeordnet.'};}
  function preparationHints(task){
    const p=preparation(task),type=task.type;
    const middle=type==='table'?'Jeder Beobachtungszeit gehört genau eine Position. Trage Zeiten oben und die zugehörigen Positionen darunter ein.':type==='clock'?'Trage die beiden Uhrzeiten ein. Berechne daraus die Dauer der Zeitmessung Δt in Minuten. „Weitere Kilometer“ sind die zusätzlich zurückgelegte Strecke.':type==='inferred'?'Die Minuten und der Abstand gehören zur selben späteren Beobachtung. Die Geschwindigkeit steht ebenfalls im Text.':type.startsWith('direct_')?'Gesucht sind die Position beim Beginn der Zeitmessung und die im Text genannte Geschwindigkeit.':'Der Anfangsabstand ist eine Position. „Weitere Kilometer“ sind die Strecke, die danach zusätzlich zurückgelegt wird.';
    return ['Lies den Text Satz für Satz. Welche Zahlen beschreiben eine Zeit, welche einen Abstand oder eine Geschwindigkeit?',middle,'Ein erstes Feld ist in der Skizze zugeordnet. Ergänze die übrigen Angaben auf dieselbe Weise. Achte jeweils auf die passende Einheit.'];
  }
  function hints(task,step){
    const d=task.data;
    if(step===2)return ['Die allgemeine Formel lautet s(t) = v · t + s₀.','Setze die bekannten Größen für v und s₀ mit ihren Einheiten ein. Die Variable t bleibt stehen.',`Die einzelnen Größen sind v = ${f(task.v)} km/h und s₀ = ${f(task.s0)} km. Setze sie selbst in die allgemeine Formel ein.`];
    if(step===0){
      if(task.type==='inferred'||task.type.startsWith('direct_'))return ['Die Geschwindigkeit steht bereits im Text.','Suche die Zahl mit der Einheit km/h.','Die Zahl direkt vor km/h ist die gesuchte Geschwindigkeit. Übernimm sie zusammen mit der Einheit.'];
      return ['Berechne die Geschwindigkeit: zurückgelegte Strecke geteilt durch die dafür benötigte Zeit.',task.type==='table'?'Berechne zuerst die Differenz der Positionen und die Differenz der Zeiten. Wandle die Minuten dann in Stunden um.':task.type==='clock'?'Nutze die Dauer Δt aus deiner Tabelle. Wandle sie in Stunden um und teile die zurückgelegte Strecke durch diese Zeit.':'Wandle die Dauer von Minuten in Stunden um. Teile anschließend die zurückgelegte Strecke durch die Dauer.',`Die einzelnen Größen für die Rechnung sind Δs = ${f(d.v*d.elapsed)} km und Δt = ${f(d.elapsed)} h. Berechne daraus v = Δs / Δt.`];
    }
    if(step===1){if(task.type==='table'||task.type==='inferred')return ['Gesucht ist die Position zu Beginn der Zeitmessung. Rechne von einer späteren Position zurück.','Verwende s₀ = s − v · t. Die Zeit muss zu der bekannten Position gehören.',`Gegeben sind s = ${f(d.s0+d.v*d.firstT)} km, v = ${f(d.v)} km/h und t = ${f(d.firstT)} h. Setze diese Größen selbst ein.`];return ['Suche die Position zu Beginn der Zeitmessung.','Diese Position ist der Anfangsabstand zum Bezugspunkt, nicht eine danach zurückgelegte Strecke.',task.type==='direct_zero'?'Die Zeitmessung beginnt genau beim Vorbeikommen am Bezugspunkt. Welcher Abstand liegt in diesem Moment zwischen beiden?' :task.type==='clock'?'Nimm den Abstand bei der ersten Uhrzeit, nicht die weiteren Kilometer aus dem letzten Satz. Übernimm den Abstand mit seiner Einheit.':'Der gesuchte Abstand steht im Satz, in dem die Zeitmessung beginnt. Übernimm nur dessen Kilometerangabe mit Einheit.'];}
    return ['Verwende die Bewegungsformel s(t) = v · t + s₀.','Wandle die gefragte Zeit in Stunden um und setze sie für t ein. Vergiss die Anfangsposition nicht.',`Die einzelnen Größen sind v = ${f(task.v)} km/h, t = ${f(task.targetT)} h und s₀ = ${f(task.s0)} km. Berechne daraus die Position.`];
  }
  const emptySteps=()=>Array.from({length:4},()=>({input:'',cursor:0,errors:0,hint:0,solved:false,done:false,revealed:false,earned:null,feedback:''}));
  const emptyPrep=task=>({activeCell:0,inputs:preparation(task).cells.map(()=>''),cursors:preparation(task).cells.map(()=>0),errors:0,hint:0,done:false,revealed:false,feedback:''});
  function fresh(){const task=generate(0);return {schema:3,task,index:0,steps:emptySteps(),prep:emptyPrep(task),total:0,independent:0};}
  const scoreColors=s=>Array.from({length:20},(_,i)=>i<s.independent?'green':i<s.total?'yellow':'gray');
  function requiredSteps(task){return task.type==='table'?[0,1,2,3]:task.type==='inferred'?[1,2,3]:task.type.startsWith('direct_')?[2,3]:[0,2,3];}
  function canComplete(s,i){return requiredSteps(s.task).includes(i)&&s.prep.done&&!s.steps[i].done&&requiredSteps(s.task).filter(j=>j<i).every(j=>s.steps[j].done);}
  function completeStep(s,i){if(!canComplete(s,i))return false;const x=s.steps[i];const helped=x.errors>0||x.hint>0||s.prep.errors>0||s.prep.hint>0||s.prep.revealed||s.steps.slice(0,i).some(t=>t.revealed);x.done=x.solved=true;x.earned=helped?'yellow':'green';x.feedback=helped?'Mit Unterstützung gelöst.':'Selbstständig gelöst.';s.total=Math.min(20,s.total+1);if(!helped)s.independent=Math.min(20,s.independent+1);return true;}
  function revealStep(s,i){if(!canComplete(s,i))return false;const x=s.steps[i];x.input=canonicalAnswer(s.task,i);x.cursor=x.input.length;x.done=x.revealed=true;x.solved=false;x.earned=null;x.feedback='Lösung vorgegeben · kein Punkt';return true;}
  function nextSituation(s){if(!requiredSteps(s.task).every(i=>s.steps[i].done)||s.index>=1000000)return false;s.index++;s.task=generate(s.index);s.prep=emptyPrep(s.task);s.steps=emptySteps();return true;}
  function upgrade(input){if(input.schema===2||input.schema===3){if(!validate(input))throw Error('Der Lernstand ist ungültig und wurde nicht überschrieben.');const updated=clone(input);updated.task=adapt(LegacyMotion.makeTask(updated.index,updated.task.data));
      if(updated.schema===2&&updated.task.type==='clock'){
        const value=updated.prep.done?`${f(updated.task.data.elapsed*60)} min`:'';
        updated.prep.inputs.push(value);updated.prep.cursors.push(value.length);
      }
      updated.schema=3;return updated;}if(!LegacyMotion.validate(input))throw Error('Der alte Lernstand ist ungültig und wurde nicht überschrieben.');const s=clone(input);s.schema=3;s.task=adapt(s.task);s.prep=emptyPrep(s.task);const begun=s.steps.some(x=>x.solved||x.input||x.hint||x.errors);if(begun){s.prep.done=true;s.prep.inputs=preparation(s.task).cells.map(c=>c.unit==='clock'?c.expected:`${f(c.expected)} ${c.unit}`);s.prep.cursors=s.prep.inputs.map(x=>x.length);}
    s.steps=s.steps.map((x,i)=>({...x,done:x.solved,revealed:false,earned:x.solved?(x.errors||x.hint?'yellow':'green'):null,...(i===2&&x.solved?{input:canonicalAnswer(s.task,i),cursor:canonicalAnswer(s.task,i).length}:{}),...(i===2&&!x.solved&&x.input?{feedback:'Dein bisheriger Entwurf ist erhalten. Ergänze jetzt die Einheiten km/h und km.'}:{})}));return s;}
  function validate(s){
    if(!s||typeof s!=='object'||Array.isArray(s))return false;
    if(s.schema===undefined)return LegacyMotion.validate(s);
    if(![2,3].includes(s.schema)||!integer(s.index,0,1000000)||!integer(s.total,0,20)||!integer(s.independent,0,s.total))return false;
    try{
      const original=LegacyMotion.makeTask(s.index,s.task.data);
      // Reuse the first prototype's independent generator-data validation.
      const shell={...LegacyMotion.fresh(),index:s.index,task:original,total:Math.min(20,s.index*4),independent:0};
      if(!LegacyMotion.validate(shell))return false;
      const expected=adapt(original);for(const k of ['type','v','s0','targetT','answer'])if(JSON.stringify(s.task[k])!==JSON.stringify(expected[k]))return false;
      if(typeof s.task.title!=='string'||s.task.title.length>300||typeof s.task.context!=='string'||s.task.context.length>3000||!Array.isArray(s.task.prompts)||s.task.prompts.length!==4||s.task.prompts.some(t=>typeof t!=='string'||t.length>1500))return false;
      if(!Array.isArray(s.steps)||s.steps.length!==4)return false;let waiting=false,solved=0,green=0;
      const common=x=>x&&integer(x.errors,0,1000000)&&integer(x.hint,0,3)&&typeof x.feedback==='string'&&x.feedback.length<=1000&&typeof x.done==='boolean'&&typeof x.revealed==='boolean';
      const p=s.prep,cells=preparation(s.task,s.schema===2).cells;
      if(!common(p)||!Array.isArray(p.inputs)||p.inputs.length!==cells.length||!Array.isArray(p.cursors)||p.cursors.length!==cells.length||p.inputs.some((v,i)=>typeof v!=='string'||v.length>200||!integer(p.cursors[i],0,v.length))||p.revealed&&!p.done)return false;
      if(p.activeCell!==undefined&&!integer(p.activeCell,0,cells.length-1))return false;
      if(p.done&&!checkPreparation(s.task,p.inputs,s.schema===2).ok)return false;
      for(let i=0;i<4;i++){const x=s.steps[i];if(!common(x)||typeof x.input!=='string'||x.input.length>200||!integer(x.cursor,0,x.input.length)||typeof x.solved!=='boolean'||![null,'green','yellow'].includes(x.earned))return false;
        if(x.done&&(!p.done||waiting))return false;if(!x.done&&(s.schema===2||requiredSteps(s.task).includes(i)))waiting=true;
        if(x.solved!==Boolean(x.done&&!x.revealed)||x.solved!==(x.earned!==null))return false;
        if(x.solved&&!check(s.task,i,x.input).ok&&!(i!==2&&LegacyMotion.check(s.task,i,x.input).ok))return false;
        if(x.revealed&&(!x.done||x.input!==canonicalAnswer(s.task,i)))return false;
        if(x.earned==='green'&&(x.errors||x.hint||p.revealed||s.steps.slice(0,i).some(v=>v.revealed)))return false;
        if(x.solved)solved++;if(x.earned==='green')green++;
      }
      if(s.total<Math.min(20,solved)||s.total>Math.min(20,s.index*4+solved)||s.independent<Math.min(20,green)||s.independent>Math.min(20,s.index*4+green))return false;
      return true;
    }catch{return false;}
  }
  return {generate,check,hints,fresh,validate,scoreColors,completeStep,revealStep,canonicalAnswer,preparation,checkPreparation,preparationHints,nextSituation,upgrade,textTemplates,requiredSteps};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=Motion;

// Data-only teaching diagrams. No final answer is supplied by these hints.
function teachingVisual(task,step,level){
  const f=n=>String(n).replace('.',','),d=task.data;
  if(step===-1){const p=Motion.preparation(task);return {kind:'cards',title:level===3?'Ein Feld als Beispiel':'Angaben zuordnen',items:p.cells.map((c,i)=>({label:c.label,value:level===3&&i===0?(c.unit==='clock'?c.expected+' Uhr':f(c.expected)+' '+c.unit):c.unit==='clock'?'Stunde : Minute':c.unit==='km'?'Abstand oder Strecke → km':c.unit==='km/h'?'Strecke pro Zeit → km/h':'Zeit seit Beginn → min'})),note:p.layout==='pairs'?'Oben: Zeiten. Darunter: jeweils die Position zu genau dieser Zeit.':'Ein Abstand zu einem Ort ist eine Position. Eine zusätzlich zurückgelegte Strecke beschreibt eine Änderung.'};}
  if(step===0){
    if(task.type==='inferred'||task.type.startsWith('direct_'))return {kind:'cards',title:'Die Einheit hilft beim Finden',items:[{label:'Position',value:'km'},{label:'Zeitdauer',value:'min oder h'},{label:'Geschwindigkeit',value:'km/h'}],note:level===3?'Suche im Text die Zahl unmittelbar vor km/h.':'Welche Angabe beschreibt, wie viele Kilometer in einer Stunde zurückgelegt werden?'};
    if(task.type==='table')return {kind:'changes',title:'Von der ersten zur zweiten Beobachtung',rows:[{label:'Zeit',from:f(d.firstT*60)+' min',to:f((d.firstT+d.elapsed)*60)+' min',change:level===1?'Wie viel Zeit vergeht?':level===2?`${f((d.firstT+d.elapsed)*60)} − ${f(d.firstT*60)} = ? min`:`${f(d.elapsed*60)} min = ${f(d.elapsed)} h`},{label:'Position',from:f(d.s0+d.v*d.firstT)+' km',to:f(d.s0+d.v*(d.firstT+d.elapsed))+' km',change:level===1?'Um wie viel wächst der Abstand?':level===2?`${f(d.s0+d.v*(d.firstT+d.elapsed))} − ${f(d.s0+d.v*d.firstT)} = ? km`:`Änderung der Position: ${f(d.v*d.elapsed)} km`}],note:level===3?`Geschwindigkeit: ${f(d.v*d.elapsed)} km : ${f(d.elapsed)} h = ? km/h`:'Die Bewegung führt weiter vom Bezugspunkt weg. Die Positionsänderung ist hier die zurückgelegte Strecke.'};
    if(task.type==='clock')return {kind:'changes',title:'Wie lange dauert die Beobachtung?',rows:[{label:'Uhrzeit',from:Motion.preparation(task).cells[1].expected+' Uhr',to:Motion.preparation(task).cells[2].expected+' Uhr',change:level===3?`${f(d.elapsed*60)} min = ${f(d.elapsed)} h`:'Ende − Beginn = vergangene Zeit'}],note:level===3?`Weitere Strecke: ${f(d.v*d.elapsed)} km. Geschwindigkeit: ${f(d.v*d.elapsed)} km : ${f(d.elapsed)} h = ? km/h`:`In dieser Zeit werden weitere ${f(d.v*d.elapsed)} km zurückgelegt. Der Anfangsabstand zählt nicht dazu.`};
    return {kind:'journey',title:'Die zusätzliche Strecke zählt',from:`Beginn: ${f(d.s0)} km vom Bezugspunkt`,to:'Ende der Beobachtung',travel:`Weitere ${f(d.v*d.elapsed)} km`,time:level===3?`${f(d.elapsed*60)} min : 60 = ${f(d.elapsed)} h`:`Dauer: ${f(d.elapsed*60)} min`,note:level===3?`Geschwindigkeit: ${f(d.v*d.elapsed)} km : ${f(d.elapsed)} h = ? km/h`:'Teile die zusätzliche Strecke durch die dafür benötigte Zeit.'};
  }
  if(step===1){
    if(task.type==='table'||task.type==='inferred')return {kind:'journey',title:'Vom späteren Ort zurück zum Anfang',from:'Beginn: s₀ = ?',to:`Später: ${f(d.s0+d.v*d.firstT)} km`,travel:level===3?`Seit Beginn zurückgelegt: ${f(d.v*d.firstT)} km`:'Seit Beginn zurückgelegt: v · t',time:`Bis zu dieser Beobachtung: ${f(d.firstT*60)} min${level>=2?' = '+f(d.firstT)+' h':''}`,note:level===3?`Anfangsposition: ${f(d.s0+d.v*d.firstT)} km − ${f(d.v*d.firstT)} km = ? km`:'Gehe vom bekannten späteren Abstand die seit Beginn zurückgelegte Strecke zurück.',back:true};
    return {kind:'cards',title:'Der richtige Moment',items:[{label:'Beginn der Zeitmessung',value:'Anfangsposition s₀ = ?'},{label:'Später',value:'Ein späterer Abstand ist nicht s₀.'}],note:task.type==='direct_zero'?'Beim Vorbeikommen befinden sich Person oder Fahrzeug direkt am gewählten Bezugspunkt.':'Suche im Text den Abstand beim Beginn der Zeitmessung.'};
  }
  if(step===2)return {kind:'formula',title:level===3?'Die Größen einzeln zuordnen':'Bausteine der Bewegungsformel',items:[{label:'Geschwindigkeit v',value:level===3?f(task.v)+' km/h':'Einheit: km/h'},{label:'Zeit t',value:'bleibt als Variable t'},{label:'Anfangsposition s₀',value:level===3?f(task.s0)+' km':'Einheit: km'}],note:level===1?'s(t) = v · t + s₀':level===2?'Geschwindigkeit × Zeit ergibt eine Strecke. Dazu kommt die Anfangsposition.':'Setze die beiden bekannten Größen selbst an die passenden Stellen. Die Zeit bleibt variabel.'};
  return {kind:'journey',title:'Anfangsabstand und weitere Strecke',from:`Anfangsposition: ${f(task.s0)} km`,to:'Gesuchte Position: ?',travel:level>=2?`${f(task.v)} km/h · ${level===3?f(task.targetT)+' h':'t'}`:'Zusätzliche Strecke: v · t',time:`Gefragte Zeit: ${f(task.targetT*60)} min${level>=2?' = '+f(task.targetT)+' h':''}`,note:level===3?`${f(task.v)} km/h · ${f(task.targetT)} h + ${f(task.s0)} km = ? km`:'Die Position setzt sich aus dem Anfangsabstand und der seitdem zurückgelegten Strecke zusammen.'};
}
function renderTeachingVisual(data){
  const box=el('figure',undefined,'teaching-visual '+data.kind);box.append(el('figcaption',data.title));
  if(data.kind==='changes')for(const r of data.rows){const row=el('div',undefined,'change-row');row.append(el('span',r.label,'change-label'),el('span',r.from,'change-value'),el('span','→','change-arrow'),el('span',r.to,'change-value'),el('span',r.change,'change-explain'));box.append(row);}
  else if(data.kind==='journey'){
    const path=el('div',undefined,'journey-track');path.append(el('span',data.from,'journey-point'),el('span',data.back?'←':'→','journey-arrow'),el('span',data.to,'journey-point'));box.append(path,el('p',data.travel,'journey-travel'),el('p',data.time,'journey-time'));
  }else{const cards=el('div',undefined,'visual-cards');data.items.forEach(item=>{const card=el('div',undefined,'visual-card');card.append(el('span',item.label),el('strong',item.value));cards.append(card);});box.append(cards);}
  box.append(el('p',data.note,'visual-note'));return box;
}

const bridge = createEduloBridge({root,widgetId:'bewegungstrainer',stateVersion:1,hideFooter:true,
  fresh:Motion.fresh, validate:Motion.validate,
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state, active=-1, prepCell=0;
const names=['Geschwindigkeit','Anfangsposition','Bewegungsformel','Weitere Position'];
const format=n=>String(n).replace('.',',');
function save(immediate=false){try{bridge[immediate?'save':'queueSave'](state,Motion.scoreColors(state));}catch{}}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function findActive(){active=!state.prep.done?-1:state.steps.findIndex((s,i)=>Motion.requiredSteps(state.task).includes(i)&&!s.done);if(state.prep.done&&active===-1)active=4;}
function stepNumber(i){return Motion.requiredSteps(state.task).indexOf(i)+1;}
function prefix(i){return ['v =','s₀ =','s(t) =',`s(${format(state.task.targetT*60)} min) =`][i];}
function prepAnswer(cell){return cell.unit==='clock'?cell.expected:`${format(cell.expected)} ${cell.unit}`;}
function statusText(s){return s.revealed?'Lösung vorgegeben · kein Punkt':s.earned==='green'?'Selbstständig gelöst':s.earned==='yellow'?'Mit Unterstützung gelöst':'Richtig gelöst';}
function readable(input){return input.replace(/\*/g,'·').replace(/(\d)(?=km|m\b|h\b|min\b)/g,'$1 ').replace(/([+·−])/g,' $1 ').replace(/\s+/g,' ').trim();}
function calculatedAnswer(input,result){
  const written=readable(input);
  return input.replace(/\s/g,'')===result.replace(/\s/g,'')?written:`${written} = ${result}`;
}
function renderResults(){
  const target=q('[data-results]');target.replaceChildren();
  state.steps.forEach((s,i)=>{if(!s.done)return;const row=el('section',undefined,'result-row'+(s.revealed?' revealed':s.earned==='yellow'?' assisted':''));
    row.append(el('span',`${stepNumber(i)>0?stepNumber(i)+'. ':''}${names[i]}`,'result-name'),el('strong',`${prefix(i)} ${i===2?readable(s.input):calculatedAnswer(s.input,Motion.canonicalAnswer(state.task,i))}`,'result-value'),el('span',statusText(s),'result-status'));
    target.append(row);
  });
}
function prepTable(interactive){
  const definition=Motion.preparation(state.task),wrap=el('div',undefined,'prep-table-wrap'),table=el('table',undefined,'prep-table');
  function cell(i){const item=definition.cells[i],s=state.prep;
    if(!interactive)return el('td',item.unit==='clock'?s.inputs[i]:calculatedAnswer(s.inputs[i],prepAnswer(item)));
    const td=el('td'),b=el('button',s.inputs[i]||'Eintragen','prep-cell'+(i===prepCell?' selected':''));
    b.type='button';b.dataset.cell=String(i);b.setAttribute('aria-label',item.label);b.setAttribute('aria-pressed',String(i===prepCell));
    b.onclick=()=>{prepCell=i;state.prep.activeCell=i;render();save();};td.append(b);return td;
  }
  if(definition.layout==='pairs'){
    const head=el('thead'),header=el('tr');['Größe','1. Messung','2. Messung'].forEach(t=>header.append(el('th',t)));head.append(header);table.append(head);
    const body=el('tbody');for(let r=0;r<2;r++){const row=el('tr'),th=el('th',r===0?'Zeit t':'Position s');th.scope='row';row.append(th,cell(r*2),cell(r*2+1));body.append(row);}table.append(body);
  }else{
    const body=el('tbody');definition.cells.forEach((item,i)=>{const row=el('tr'),th=el('th',item.label);th.scope='row';row.append(th,cell(i));body.append(row);});table.append(body);
  }
  wrap.append(table);return wrap;
}
function renderPreparation(){
  const area=q('[data-preparation]');area.replaceChildren();
  if(!state.prep.done)return;
  const box=el('section',undefined,'prep-completed'+(state.prep.revealed?' revealed':''));
  box.append(el('h2','0. Gegebene Größen'),prepTable(false));
  if(state.prep.revealed)box.append(el('p','Angaben vorgegeben · Vorbereitung nicht selbst gelöst','result-status'));
  area.append(box);
}
function renderAnswer(){
  if(active===4)return;
  const prep=active===-1,s=prep?state.prep:state.steps[active],input=prep?s.inputs[prepCell]:s.input,cursor=prep?s.cursors[prepCell]:s.cursor;
  const definition=prep?Motion.preparation(state.task).cells[prepCell]:null;
  q('[data-prefix]').textContent=prep?definition.prefix:prefix(active);
  const box=q('[data-answer]');box.replaceChildren(document.createTextNode(input.slice(0,cursor)),el('span','│','cursor'),document.createTextNode(input.slice(cursor)));
  box.setAttribute('aria-label',(prep?definition.label:'Deine Eingabe')+': '+(input||'leer'));
  q('[data-input-label]').textContent=prep?`${definition.label} · ${definition.unit==='clock'?'Uhrzeit als Stunde:Minute':'mit Einheit '+definition.unit}`:'Deine Eingabe · mit Einheiten';
  if(prep){const b=q(`[data-cell="${prepCell}"]`);if(b)b.textContent=input||'Eintragen';}
}
function renderKeypad(){
  const prep=active===-1,unit=prep?Motion.preparation(state.task).cells[prepCell].unit:active===0?'km/h':'km';
  const keys=unit==='clock'?['7','8','9','4','5','6','1','2','3','0',':']:
    ['7','8','9',active===2?'t':'h','km/h','4','5','6','·','km','1','2','3','+','−','0',',','/','(',')',...(active===2?['h']:[]),...(prep&&unit==='min'?['min']:[])];
  const labels={'←':'Cursor nach links','→':'Cursor nach rechts','Del':'Zeichen links vom Cursor löschen'};
  q('[data-keypad]').classList.toggle('formula',unit!=='clock');
  q('[data-keypad]').replaceChildren(...[...keys,'←','→','Del'].map(key=>{const b=el('button',key,['←','→','Del'].includes(key)?'edit-key':'');b.type='button';b.setAttribute('aria-label',labels[key]||key);b.onclick=()=>type(key);return b;}));
}
function render(){
  const colors=Motion.scoreColors(state),prep=active===-1,finished=active===4;
  q('[data-progress]').textContent=`${colors.filter(c=>c!=='gray').length}/20 Punkte · ${colors.filter(c=>c==='green').length} selbstständig`;
  q('[data-points]').replaceChildren(...colors.map((c,i)=>{const n=el('span',c==='green'?'✓':c==='yellow'?'●':'',c);n.title=`Punkt ${i+1}: ${c==='green'?'selbstständig':c==='yellow'?'mit Hilfe':'noch offen'}`;return n;}));
  q('[data-number]').textContent=`SITUATION ${state.index+1}`;
  q('[data-title]').textContent=state.task.title;q('[data-context]').textContent=state.task.context;
  renderPreparation();renderResults();
  q('[data-step-title]').textContent=finished?'Situation abgeschlossen':prep?'0. Gegebene Größen ordnen':`${stepNumber(active)}. ${names[active]}`;
  q('[data-prompt]').textContent=finished?'Du kannst mit einer neuen Situation weiterüben. Auch nach 20 Punkten geht es weiter.':prep?Motion.preparation(state.task).instruction:state.task.prompts[active];
  q('[data-prep-fields]').replaceChildren(...(prep?[prepTable(true)]:[]));
  q('[data-entry]').hidden=finished;q('[data-help]').hidden=finished;q('[data-check]').hidden=finished;q('[data-next]').hidden=!finished;
  q('[data-next]').textContent='Nächste Situation →';q('[data-prep-note]').hidden=!prep;
  if(finished){q('[data-feedback]').textContent='';q('[data-hints]').replaceChildren();return;}
  const s=prep?state.prep:state.steps[active];renderAnswer();renderKeypad();
  q('[data-help]').disabled=s.hint>=3;q('[data-help]').textContent=s.hint>=3?'Alle Tipps geöffnet':`Tipp ${s.hint+1} anzeigen`;
  q('[data-feedback]').textContent=s.feedback;
  const hints=prep?Motion.preparationHints(state.task):Motion.hints(state.task,active);
  q('[data-hints]').replaceChildren(...hints.slice(0,s.hint).map((h,i)=>el('p',`${i+1}. ${h}`)));
  if(s.hint)q('[data-hints]').append(renderTeachingVisual(teachingVisual(state.task,active,s.hint)));
  if(s.hint===3)q('[data-hints]').append(el('p','Versuche es noch einmal. Ist die Antwort erneut falsch, tragen wir die Lösung ein. Dafür gibt es keinen Punkt.','reveal-notice'));
}
function type(key){
  if(active===4)return;const prep=active===-1,s=prep?state.prep:state.steps[active];let input=prep?s.inputs[prepCell]:s.input,cursor=prep?s.cursors[prepCell]:s.cursor;
  if(key==='←')cursor=Math.max(0,cursor-1);else if(key==='→')cursor=Math.min(input.length,cursor+1);
  else if(key==='Del'){if(cursor){input=input.slice(0,cursor-1)+input.slice(cursor);cursor--;}}
  else if(input.length+key.length<=160){input=input.slice(0,cursor)+key+input.slice(cursor);cursor+=key.length;}
  if(prep){s.inputs[prepCell]=input;s.cursors[prepCell]=cursor;}else{s.input=input;s.cursor=cursor;}
  renderAnswer();save();
}
q('[data-check]').onclick=()=>{
  if(active===4)return;const prep=active===-1,s=prep?state.prep:state.steps[active];
  const result=prep?Motion.checkPreparation(state.task,s.inputs):Motion.check(state.task,active,s.input);
  if(result.ok){if(prep){s.done=true;s.feedback='Angaben richtig zugeordnet.';}else Motion.completeStep(state,active);findActive();}
  else if(s.hint===3){
    s.errors=Math.min(999,s.errors+1);
    if(prep){s.inputs=Motion.preparation(state.task).cells.map(prepAnswer);s.cursors=s.inputs.map(t=>t.length);s.done=true;s.revealed=true;s.feedback='Angaben vorgegeben.';}
    else Motion.revealStep(state,active);
    findActive();
  }else{s.errors=Math.min(999,s.errors+1);s.hint++;s.feedback=result.message+' Ein passender Tipp steht unten.';}
  save(true);render();
  if(s.done){const target=s.revealed?(prep?q('[data-preparation]'):q('[data-results]').lastElementChild):q('[data-step-title]');target?.scrollIntoView({block:'nearest'});}
  else q('[data-feedback]').scrollIntoView({block:'nearest'});
};
q('[data-help]').onclick=()=>{if(active===4)return;const s=active===-1?state.prep:state.steps[active];s.hint=Math.min(3,s.hint+1);save(true);render();q('[data-hints]').lastElementChild?.scrollIntoView({block:'nearest'});};
q('[data-next]').onclick=()=>{if(!Motion.nextSituation(state))return;prepCell=0;findActive();save(true);render();q('.edulo-work').scrollTop=0;};
q('[data-rules-toggle]').onclick=()=>{const p=q('[data-rules]');p.hidden=!p.hidden;q('[data-rules-toggle]').setAttribute('aria-expanded',String(!p.hidden));};
async function start(){q('[data-controls]').disabled=true;try{const loaded=await bridge.load();state=Motion.upgrade(loaded.data);prepCell=state.prep.activeCell??0;findActive();render();q('[data-controls]').disabled=bridge.getStatus().mode==='editor';}catch(error){q('[data-storage]').textContent='Der Lernstand konnte nicht geladen werden. '+error.message;q('[data-retry]').hidden=false;}}
q('[data-retry]').onclick=start;
function fit(){let bottom=window.innerHeight,top=Math.max(0,root.getBoundingClientRect().top);for(let p=root.parentElement;p&&p!==document.documentElement;p=p.parentElement){if(/hidden|clip|auto|scroll/.test(getComputedStyle(p).overflowY))bottom=Math.min(bottom,p.getBoundingClientRect().bottom);}root.style.setProperty('--edulo-height',Math.max(180,bottom-top-12)+'px');}
fit();window.addEventListener('resize',fit);
const cleanup=new MutationObserver(()=>{if(!root.isConnected){window.removeEventListener('resize',fit);cleanup.disconnect();}});cleanup.observe(document.documentElement,{childList:true,subtree:true});
start();
