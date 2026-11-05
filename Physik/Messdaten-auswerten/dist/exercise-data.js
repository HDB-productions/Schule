/* Reine, lokale Aufgabengeneratoren. Keine DOM-, Netzwerk- oder CAS-Simulation. */
(function (root) {
  'use strict';
  const models = ['proportional', 'linear', 'quadratisch'];
  const labels = ['Proportional', 'Linear (nicht proportional)', 'Quadratisch'];
  const fmt = n => String(+n.toFixed(8)).replace('.', ',');
  const round = (n, p = 2) => Math.round((n + Number.EPSILON) * 10 ** p) / 10 ** p;
  const num = (id, label, answer, explanation, tolerance = 0.000001) => ({id, label, type: 'number', answer, tolerance, explanation});
  const opt = (value, label) => ({value, label});
  const modelOptions = () => models.map((v, i) => opt(v, labels[i]));
  const choice = (id, label, answer, options, explanation) => ({id, label, type: 'choice', answer, options, explanation});
  const stage = (title, body, fields, explanation, extra = {}) => ({title, body, fields, explanation, ...extra});
  const table = (xs, ys, headers = ['x', 'y']) => ({headers, rows: xs.map((x, i) => [fmt(x), fmt(ys[i])])});
  const variantSets = {
    1: ['wiederholung'], 2: ['skalierung'], 3: models,
    4: models, 5: models, 6: models
  };
  function variants(step) {
    return (variantSets[step] || []).map(value => ({value, label: ({wiederholung: 'Wiederholungsmessungen', skalierung: 'Achsen und Kästchen', rundungswirkung: 'Wirkung der Rundungsstelle'})[value] || labels[models.indexOf(value)]}));
  }
  function generate(step, rng = Math.random, variant) {
    step = Number(step);
    if (!variantSets[step]) throw new RangeError('Schritt muss zwischen 1 und 6 liegen.');
    const pick = arr => arr[Math.min(arr.length - 1, Math.max(0, Math.floor(rng() * arr.length)))];
    const int = (lo, hi) => lo + Math.min(hi - lo, Math.max(0, Math.floor(rng() * (hi - lo + 1))));
    const shuffle = arr => { const out = arr.slice(); for (let i = out.length - 1; i > 0; i--) { const j = int(0, i); [out[i], out[j]] = [out[j], out[i]]; } return out; };
    const v = variant || pick(variantSets[step]);
    if (!variantSets[step].includes(v)) throw new RangeError('Unbekannte Aufgabenvariante.');
    let result;
    if (step === 1) {
      const base = int(16, 40) / 10;
      const rows = Array.from({length: 3}, (_, r) => Array.from({length: 4}, (_, c) => round(base + r * 0.6 + [-0.03, 0.01, 0.03, -0.01][c], 2)));
      const positions = shuffle([0, 1, 2]).slice(0, 2).map(r => r * 4 + int(0, 3));
      positions.forEach((p, i) => { rows[Math.floor(p / 4)][p % 4] += 2 + i; });
      const cell = p => `${'ABC'[Math.floor(p / 4)]}${p % 4 + 1}`;
      const bad = pick(positions), retained = positions.find(p => p !== bad);
      const fields = rows.flatMap((r, i) => [num(`mean${i}`, `Reihe ${'ABC'[i]}: Mittelwert in s (2 Nachkommastellen)`, round(r.reduce((a, b) => a + b, 0) / 4), `Alle vier Zeiten addieren und durch 4 teilen: ${r.map(fmt).join(' + ')}; erst das Ergebnis auf 2 Nachkommastellen runden.`), num(`min${i}`, `Reihe ${'ABC'[i]}: Minimum in s (exakt)`, Math.min(...r), 'Der kleinste der vier Werte, einschließlich der auffälligen Werte.'), num(`max${i}`, `Reihe ${'ABC'[i]}: Maximum in s (exakt)`, Math.max(...r), 'Der größte der vier Werte, einschließlich der auffälligen Werte.')]);
      result = {title: 'Wiederholte Zeitmessungen auswerten', intro: 'Für drei feste Strecken A, B und C wurden jeweils vier Laufzeiten gemessen. Bearbeite die Schritte in der angegebenen Reihenfolge.', stages: [
        stage('Zuerst alle Werte auswerten', 'Berechne jede mittlere Laufzeit zunächst mit ALLEN vier Messwerten, auch wenn einzelne Werte auffallen. Runde nur den Mittelwert auf zwei Nachkommastellen. Bestimme zusätzlich Minimum und Maximum jeder Reihe; diese Werte exakt übernehmen.', fields, 'Eine Auffälligkeit allein erlaubt noch keinen Ausschluss.', {table: {headers: ['Reihe', 'Messung 1: t in s', 'Messung 2: t in s', 'Messung 3: t in s', 'Messung 4: t in s'], rows: rows.map((r, i) => ['ABC'[i], ...r.map(fmt)])}}),
        stage('Zwei einzelne Zellen prüfen', 'Welche genau zwei Messwerte weichen besonders auffällig von den übrigen Werten derselben Reihe ab? Die Bezeichnung A2 bedeutet Reihe A, Messung 2.', [{id: 'outliers', label: 'Genau zwei Zellen auswählen', type: 'multi', answer: positions.map(cell), options: Array.from({length: 12}, (_, p) => opt(cell(p), `${cell(p)}: ${fmt(rows[Math.floor(p / 4)][p % 4])} s`)), explanation: `Auffällig sind ${positions.map(cell).join(' und ')}. Damit ist noch keine Ursache nachgewiesen.`}], 'Erst auffällige Einzelwerte identifizieren, dann die dokumentierten Umstände untersuchen.'),
        stage('Jetzt die Zusatzinformationen nutzen', `Nur zu diesen beiden Zellen liegt nun folgende Zusatzinformation vor: Bei <strong>${cell(retained)}</strong> wurde kein Problem beobachtet; der Wert ist korrekt übertragen. Bei <strong>${cell(bad)}</strong> ${pick(['wurde die Stoppuhr nachweislich zu spät gestoppt. Die Verzögerung lässt sich nicht rekonstruieren', 'hat der Zielsensor nachweislich erst ein späteres, falsches Stoppsignal registriert. Die tatsächliche Ankunftszeit lässt sich nicht rekonstruieren'])}; eine Wiederholung ist nicht möglich.`, [choice('decision', 'Wie behandelst du die beiden Werte?', 'documented', shuffle([opt('both', 'Beide auffälligen Werte ausschließen.'), opt('documented', `Nur ${cell(bad)} begründet ausschließen; ${cell(retained)} behalten.`), opt('keep', 'Beide Werte unverändert behalten.')]), `Nur ${cell(bad)} hat einen dokumentierten, nicht korrigierbaren Durchführungsfehler. ${cell(retained)} bleibt ohne Fehlernachweis enthalten.`)], 'Ohne Fehlernachweis bleibt ein auffälliger Wert enthalten. Eine sicher nachgewiesene physikalische Unmöglichkeit bei bekannten Rahmenbedingungen oder ein belegter Messfehler erfordert Prüfung: wenn möglich korrigieren oder wiederholen, andernfalls begründet ausschließen. Ausschluss dokumentieren und die betroffene Auswertung neu berechnen.')
      ]};
    }
    if (step === 2) {
      const sx = pick([0.5, 1, 2]), sy = pick([0.5, 1, 2, 5]);
      const heights = [int(3, 4) / 2, int(5, 7) / 2, int(8, 10) / 2, int(12, 14) / 2];
      const points = [1, 3, 5, 7].map((x, i) => [x * sx, heights[i] * sy]);
      const bars = points.map(([x, y]) => ({x, low: y - pick([0.5, 1]) * sy, high: y + pick([0.5, 1]) * sy}));
      const measurements = {headers: ['Nummer', 't in s', 'Mittelwert s in m', 'Minimum s in m', 'Maximum s in m'], rows: points.map(([x, y], i) => [String(i + 1), fmt(x), fmt(y), fmt(bars[i].low), fmt(bars[i].high)])};
      const scales = [-2,-1,0,1,2].flatMap(e=>[1,2,5].map(f=>f*10**e));
      const diagramSetup = {xSteps: scales, ySteps: scales, xScale: sx, yScale: sy, points, bars};
      const maxY = Math.max(...bars.map(b => b.high));
      const axisOptions = [opt('t', 't in s'), opt('s', 's in m')];
      const drawingFields = points.flatMap(([x, y], i) => [num(`pointX${i}`, `Zeile ${i + 1}: Zeitkoordinate des Mittelwertkreuzes in s`, x, `Bei t = ${fmt(x)} s gehört das Kreuz auf diese Zeitkoordinate.`, sx * 0.15), num(`pointY${i}`, `Zeile ${i + 1}: Strecke des Mittelwertkreuzes in m`, y, `Der Mittelwert ist ${fmt(y)} m.`, sy * 0.15), num(`low${i}`, `Zeile ${i + 1}: unteres Balkenende in m`, bars[i].low, `Das Minimum ist ${fmt(bars[i].low)} m.`, sy * 0.15), num(`high${i}`, `Zeile ${i + 1}: oberes Balkenende in m`, bars[i].high, `Das Maximum ist ${fmt(bars[i].high)} m.`, sy * 0.15)]);
      result = {title: 'Achsen planen und Punkte eintragen', intro: 'Zeit t ist unabhängig verändert, Strecke s ist gemessen. Der Ursprung ist (0|0). Es stehen waagerecht 10 und senkrecht 10 große Kästchen zur Verfügung.', stages: [
        stage('Achsen direkt am Diagramm einrichten', 'Beschrifte beide Achsen über die Auswahlfelder und stelle ihre Skalierungen mit je zwei Reglern ein: Faktor 1, 2 oder 5 und Zehnerpotenz von −2 bis 2. Die Schrittweite ist Faktor · 10 hoch Exponent; beide Achsen starten bei 1 · 10⁰. Berücksichtige alle Werte der Tabelle einschließlich Minimum und Maximum. Wähle pro Achse die kleinste angebotene Skalierung, bei der der gesamte Bereich einschließlich 0 in höchstens 9 große Kästchen passt. So nutzt du die Fläche gut; das zehnte Kästchen bleibt für die Pfeilspitze frei.', [choice('xAxis', 'Waagerechte Achse', 't', axisOptions, 'Die unabhängig veränderte Zeit t gehört auf die waagerechte Achse.'), choice('yAxis', 'Senkrechte Achse', 's', axisOptions, 'Die gemessene Strecke s gehört auf die senkrechte Achse.'), num('sx', 'Sekunden pro großem Kästchen', sx, `${fmt(7 * sx)} s brauchen bei ${fmt(sx)} s pro Kästchen 7 Kästchen. Die nächstkleinere einstellbare Schrittweite reicht nicht aus.`), num('sy', 'Meter pro großem Kästchen', sy, `Das größte Maximum ${fmt(maxY)} m braucht bei ${fmt(sy)} m pro Kästchen ${fmt(maxY / sy)} Kästchen. Die kleinere angebotene Skalierung reicht nicht aus.`)], 'Auf einer Achse müssen gleiche Zahlenunterschiede stets gleiche Abstände haben. Die beiden Achsen dürfen verschieden skaliert sein.', {table: measurements, diagramSetup}),
        stage('Mittelwerte und Balken einzeichnen', 'Bearbeite die vier nummerierten Messungen nacheinander. Setze für die hervorgehobene Zeile das Mittelwertkreuz und die Min-Max-Enden direkt im Diagramm. Prüfe diese Messung, bevor du zur nächsten weitergehst. Die Einträge rasten in halben großen Kästchen ein. Beide Balkenenden gehören zur gleichen Zeitkoordinate wie das jeweilige Mittelwertkreuz.', drawingFields, 'Jedes Kreuz zeigt den Mittelwert; der zugehörige senkrechte Balken reicht vom Minimum bis zum Maximum. Diese beobachtete Spannweite ist nicht automatisch eine Messunsicherheit. Die Messpunkte werden zunächst nicht verbunden.', {table: measurements, diagramSetup, interactivePlot: true})
      ]};
    }
    const a = step === 5 && ['linear', 'quadratisch'].includes(v) ? int(4, 19) / 4 : int(2, 5), b = step === 3 && v === 'quadratisch' ? 0 : step === 5 && ['linear', 'quadratisch'].includes(v) ? int(2, 15) / 4 : int(1, 4), c = step === 5 && v === 'quadratisch' ? int(1, 19) / 4 : int(1, 5);
    const xs = step === 3 && v === 'quadratisch' ? [-2, -1, 0, 1, 2] : v === 'linear' ? [0, 1, 3, 6] : v === 'antiproportional' ? [1, 2, 4, 8] : [0, 1, 2, 3, 4];
    const base = pick([0.5, 2]);
    const fn = x => v === 'proportional' ? a * x : v === 'linear' ? a * x + b : v === 'antiproportional' ? a * 8 / x : v === 'quadratisch' ? a * x * x + b * x + c : a * base ** x;
    const ys = xs.map(fn);
    if (step === 3) {
      const qa = v === 'antiproportional' ? a * 8 : a;
      const qb = v === 'proportional' || v === 'quadratisch' ? 0 : v === 'exponentiell' ? base : b;
      const qc = v === 'quadratisch' ? pick([-1, 1]) * c : c;
      const graphXs = v === 'antiproportional' ? [1, 2, 4, 8] : v === 'exponentiell' ? [-4, -3, -2, -1, 0, 1, 2, 3, 4] : v === 'linear' ? [-3, -2, -1, 0, 1, 2] : [-2, -1, 0, 1, 2];
      const graphY = x => v === 'proportional' ? qa * x : v === 'linear' ? qa * x + qb : v === 'quadratisch' ? qa * x * x + qc : v === 'antiproportional' ? qa / x : qa * qb ** x;
      if (v === 'linear') graphXs.push(-qb / qa);
      if (v === 'quadratisch' && qc < 0) graphXs.push(-Math.sqrt(-qc / qa), Math.sqrt(-qc / qa));
      const points = [...new Set(graphXs)].sort((x,y)=>x-y).map(x => [x, Math.abs(graphY(x)) < 1e-10 ? 0 : graphY(x)]);
      const hasX = v !== 'quadratisch' || qc < 0;
      const features = [v === 'quadratisch' ? 'curved' : 'straight', hasX ? 'xIntercept' : 'noXIntercept', 'yIntercept', v === 'proportional' ? 'yOrigin' : 'yNonzero', ...(v === 'quadratisch' ? ['vertex'] : [])];
      const featureDefinitions = [
        ['straight', 'Gerade', 'Die Punkte liegen auf einer Geraden.', 'Krümmung'],
        ['curved', 'Gekrümmt', 'Die Steigung ändert sich im dargestellten Verlauf.', 'Krümmung'],
        ['asymptoticX', 'Asymptotische Annäherung', 'Der Verlauf nähert sich der x-Achse an.', 'x-Achse'],
        ['noXIntercept', 'Kein Schnittpunkt sichtbar', 'Im dargestellten Bereich schneidet der Verlauf die x-Achse nicht.', 'x-Achse'],
        ['xIntercept', 'Schnittpunkt sichtbar', 'Der Verlauf schneidet die x-Achse bei y = 0.', 'x-Achse'],
        ['asymptoticY', 'Asymptotische Annäherung', 'Der Verlauf nähert sich der y-Achse an.', 'y-Achse'],
        ['noYIntercept', 'Kein Schnittpunkt sichtbar', 'Im dargestellten Bereich ist kein Schnittpunkt mit der y-Achse zu sehen.', 'y-Achse'],
        ['yIntercept', 'Schnittpunkt sichtbar', 'Der Verlauf schneidet die y-Achse bei x = 0.', 'y-Achse'],
        ['yOrigin', 'Schnittpunkt bei y = 0', 'Der y-Achsenabschnitt ist null: Der Verlauf geht durch den Ursprung.', 'y-Achse', 'yIntercept'],
        ['yNonzero', 'Schnittpunkt bei y ≠ 0', 'Der y-Achsenabschnitt ist von null verschieden: Der Verlauf schneidet die y-Achse oberhalb oder unterhalb des Ursprungs.', 'y-Achse', 'yIntercept'],
        ['vertex', 'Scheitelpunkt sichtbar', 'Am Scheitelpunkt wechselt der Verlauf von fallend zu steigend.', 'Scheitelpunkt']
      ];
      const featureOptions = featureDefinitions.map(([value, label, explanation, group, dependsOn]) => ({value, label, explanation, group, dependsOn, correction: features.includes(value) ? explanation : 'Dieses Merkmal trifft auf den dargestellten Verlauf nicht zu.'}));
      const plot = {points, pointsOnly: true, xMin: v === 'linear' ? -3.5 : -2.5, xMax: 2.5, yMin: Math.min(0, ...points.map(p => p[1])) - 1, yMax: Math.max(...points.map(p => p[1])) * 1.15 + 1, curve: {kind: v, a: qa, b: qb, c: qc}, xLabel: 'x', yLabel: 'y'};
      const hypothesis = `Die Merkmale und die angepasste Kurve stützen „${labels[models.indexOf(v)]}“. Bei einer quadratischen Anpassung an eine Gerade wird der quadratische Koeffizient null; sie ist dann keine echt quadratische Funktion.`;
      result = {title: 'Einen Funktionstyp vermuten', intro: 'Untersuche zuerst die sichtbaren Merkmale und wähle danach den passenden Funktionstyp.', stages: [
        stage('Zuerst Merkmale sammeln', 'Wähle die zutreffenden Merkmale in jeder Gruppe. Mehrfachauswahl ist möglich. Bei einem Schnittpunkt mit der y-Achse unterscheide zusätzlich, ob der y-Achsenabschnitt null oder von null verschieden ist. „Kein Schnittpunkt sichtbar“ bezieht sich auf den dargestellten Bereich.', [{id: 'features', label: 'Welche Merkmale treffen zu?', type: 'multi', answer: features, options: featureOptions, explanation: 'Die Korrektur steht direkt bei den einzelnen Merkmalen.'}], 'Beurteile Krümmung, Achsenschnitte und Scheitelpunkt am Diagramm.', {plot}),
        stage('Danach den Funktionstyp vermuten', 'Wähle den passenden Funktionstyp. Die Regression zum ausgewählten Typ wird direkt durch die Messpunkte gelegt. Du kannst die Typen zum Vergleich wechseln. „Linear“ meint hier eine Gerade mit von null verschiedenem y-Achsenabschnitt.', [choice('model', 'Funktionsvermutung', v, modelOptions(), hypothesis)], hypothesis, {plot, regressionPreview: true})
      ]};
    }

    if (step === 4) {
      let fields, explanation, body, next;
      if (v === 'proportional') {
        body = 'Berechne y/x für alle Zeilen mit x ≠ 0. Gib exakte Dezimalzahlen ein; die Zeile x = 0 bleibt in der Tabelle, wird aber nicht dividiert.';
        fields = xs.slice(1).map((x, i) => num(`q${i}`, `y/x bei x = ${x}`, a, `${fmt(a * x)} / ${x} = ${a}.`));
        explanation = 'Alle berechenbaren Quotienten sind konstant. Das stützt proportional.';
        next = [num('a', 'Erste Näherung a: Mittelwert der Quotienten', a, 'Alle berechenbaren Quotienten mitteln; x = 0 zählt nicht mit.')];
      } else if (v === 'linear') {
        body = 'Die x-Abstände sind ungleich. Berechne für jedes benachbarte Punktepaar Δx und die Steigung Δy/Δx. Gib exakte Zahlen ein.';
        fields = xs.slice(1).flatMap((x, i) => [num(`dx${i}`, `Δx von Punkt ${i + 1} zu ${i + 2}`, x - xs[i], 'Nächster x-Wert minus vorheriger x-Wert.'), num(`m${i}`, `Δy/Δx von Punkt ${i + 1} zu ${i + 2}`, a, `(${fmt(ys[i + 1])} − ${fmt(ys[i])}) / (${x} − ${xs[i]}) = ${a}.`)]);
        explanation = 'Konstante Steigungen stützen linear; unterschiedliche Δy allein widerlegen das Modell nicht.';
        next = [num('m', 'Erste Näherung m: Mittelwert der Steigungen', a, 'Die benachbarten Steigungen arithmetisch mitteln.'), num('b', 'Erste Näherung b: y-Achsenabschnitt ablesen', b, 'Am Schnittpunkt des angenommenen geraden Verlaufs mit der y-Achse ablesen.')];
      } else if (v === 'antiproportional') {
        body = 'Berechne für jede Zeile das Produkt x·y. Gib exakte Zahlen ein.';
        fields = xs.map((x, i) => num(`p${i}`, `x·y bei x = ${x}`, a * 8, `${x} · ${fmt(ys[i])} = ${a * 8}.`));
        explanation = 'Konstante Produkte stützen antiproportional; kein x ist null.';
        next = [num('a', 'Erste Näherung a: Mittelwert der Produkte', a * 8, 'Alle Produkte arithmetisch mitteln.')];
      } else if (v === 'quadratisch') {
        const d = ys.slice(1).map((y, i) => y - ys[i]);
        body = 'Die x-Abstände sind alle 1. Berechne zuerst ALLE ersten und anschließend ALLE zweiten y-Differenzen. Gib exakte Zahlen ein.';
        fields = [...d.map((x, i) => num(`d${i}`, `Erste Differenz ${i + 1}`, x, `${fmt(ys[i + 1])} − ${fmt(ys[i])} = ${x}.`)), ...d.slice(1).map((x, i) => num(`dd${i}`, `Zweite Differenz ${i + 1}`, 2 * a, `${x} − ${d[i]} = ${2 * a}.`))];
        explanation = 'Gleiche x-Abstände und konstante, von null verschiedene zweite Differenzen stützen quadratisch. Im Kurs ist hier KEINE analoge Parameterbestimmung vorgesehen; weiter mit quadratischer Regression.';
      } else {
        body = 'Die x-Abstände sind alle 1. Berechne jeweils den nächsten y-Wert geteilt durch den vorherigen. Gib exakte Dezimalzahlen ein.';
        fields = xs.slice(1).map((x, i) => num(`r${i}`, `y${i + 2}/y${i + 1}`, base, `${fmt(ys[i + 1])} / ${fmt(ys[i])} = ${fmt(base)}.`));
        explanation = 'Konstante Faktoren bei gleichen x-Abständen stützen exponentiell.';
        next = [num('b', 'Erste Näherung b (Δx = 1)', base, 'Mittlerer Quotient; hier Δx = 1, deshalb entspricht er der Basis b.'), num('a', 'Erste Näherung a: y-Achsenabschnitt ablesen', a, 'Den Startwert am Schnittpunkt des angenommenen Kurvenverlaufs mit der y-Achse ablesen.')];
      }
      result = {title: `${labels[models.indexOf(v)]}: rechnerisch prüfen`, intro: 'Idealisierte, exakt passende Beispieldaten ohne Einheiten. Bei echten Messdaten müssen Abweichungen im Verhältnis zur Unsicherheit beurteilt werden.', stages: [stage('Prüfgrößen berechnen', body, fields, explanation, {table: table(xs, ys)}), ...(next ? [stage('Erste analoge Näherung', 'Verwende die eben berechneten Prüfgrößen. Lies bei linear bzw. exponentiell zusätzlich den y-Achsenabschnitt im Diagramm ab. Gib die hier exakt bestimmbaren Parameter als Dezimalzahlen ein. Zwischenergebnisse nicht runden.', next, 'Dies ist das analoge Näherungsverfahren des Kurses, keine Regression.', {plot: {points: xs.map((x, i) => [x, ys[i]]), curve: {kind: v, a: v === 'antiproportional' ? a * 8 : a, b: v === 'proportional' ? 0 : v === 'exponentiell' ? base : b, c}, xMax: Math.max(...xs) * 1.1, yMax: Math.max(...ys) * 1.15, xLabel: 'x', yLabel: 'y'}})] : [])]};
    }
    if (step === 5) {
      const regression = {proportional: 'linear', linear: 'linear', antiproportional: 'potenz', quadratisch: 'quadratisch', exponentiell: 'exponentiell'}[v];
      const forms = {proportional: 'y = m·x + b', linear: 'y = m·x + b', antiproportional: 'y = A·x^n', quadratisch: 'y = a·x² + b·x + c', exponentiell: 'y = A·B^x'};
      const pars = v === 'quadratisch' ? [['a', a], ['b', b], ['c', c]] : v === 'antiproportional' ? [['A', a * 8], ['n', -1]] : v === 'exponentiell' ? [['A', a], ['B', base]] : [['m', a], ['b', v === 'linear' ? b : 0]];
      result = {title: 'Gleichung mit externer CAS-Regression bestimmen', intro: `Vermutung: ${labels[models.indexOf(v)]}. Die idealisierten Daten passen exakt. Öffne dein tatsächliches GeoGebra CAS; hier wird keine Regression ausgeführt.`, stages: [
        stage('Regressionstyp auswählen', 'Kursweg: Werte unter „Tabelle“ eingeben, über die drei Punkte „Regression“ auswählen und passenden Typ einstellen.', [choice('regression', 'Welchen Typ stellst du ein?', regression, shuffle(['linear', 'quadratisch'].map(k => opt(k, k[0].toUpperCase() + k.slice(1)))), v === 'proportional' ? 'Im Kurs wird linear regressiert; der Achsenabschnitt wird nicht künstlich auf 0 gesetzt.' : v === 'antiproportional' ? 'Im Kurs wird eine Potenzregression verwendet; sie erzwingt den Exponenten −1 nicht.' : 'Den passenden Regressionstyp verwenden.')], 'Die berechnete Anpassung muss anschließend zum Diagramm passen.', {table: table(xs, ys)}),
        stage('CAS-Ergebnis übertragen', `Führe die Regression jetzt im externen CAS aus und übertrage die Parameter in der Form <strong>${forms[v]}</strong>. Runde jeden Eingabewert auf drei Nachkommastellen (z. B. 0,500). Eine Abweichung bis 0,001 wird akzeptiert. Bei abweichender CAS-Schreibweise zuerst in die angegebene Form umrechnen.`, pars.map(([key, value]) => num(key, `Parameter ${key}`, value, `Für diese exakt passenden Daten ist ${key} = ${fmt(value)}.`, 0.001)), 'Die exakten Beispiele dienen zur Kontrolle des Bedienwegs. Bei Messdaten keine Parameter eigenmächtig auf 0 bzw. −1 ändern.', {table: table(xs, ys)})
      ]};
    }
    if (step === 6) {
      const text = (id, label, answer, explanation, accepted = [answer]) => ({id, label, type: 'text', answer, accepted, explanation});
      const definitions = v === 'proportional' ? [['a', 1]] : v === 'linear' ? [['m', 1], ['b', 0]] : [['a', 2], ['b', 1], ['c', 0]];
      const symbolic = v === 'proportional' ? 'y = a·x' : v === 'linear' ? 'y = m·x + b' : 'y = a·x² + b·x + c';
      const parameters = [], terms = [], equationFields = [text('lhs', 'Physikalische linke Seite', 's(t)', 'Die Strecke s hängt von der Zeit t ab; die linke Seite lautet s(t).')];
      for (let i = 0; i < definitions.length; i++) {
        const [symbol, power] = definitions[i];
        const raw = (i === 0 ? 1 : pick([-1, 1])) * int(12345, 98765) / 10000 * pick([0.001, 0.01, 0.1, 1]);
        const answer = Number(raw.toPrecision(3));
        const decimals = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(answer))));
        const displayAnswer = answer.toFixed(decimals).replace('.', ',');
        const place = 10 ** -decimals;
        const unit = power === 2 ? 'm/s²' : power === 1 ? 'm/s' : 'm';
        const unitId = `${symbol}Unit`, variable = power ? `t${power}` : undefined;
        parameters.push({symbol, rawDisplay: fmt(raw)});
        terms.push({coefficient: symbol, unit: unitId, ...(variable ? {variable} : {}), power});
        equationFields.push({...num(symbol, `Gerundeter Koeffizient ${symbol}`, answer, `${fmt(raw)} auf drei signifikante Stellen gerundet: ${displayAnswer}. Ab der ersten von null verschiedenen Ziffer zählen; Vorzeichen und führende Nullen zählen nicht. Erforderliche Endnullen angeben.`, place / 1000), significantDigits: 3, decimalOnly: true, displayAnswer});
        equationFields.push(text(unitId, `Einheit von ${symbol}`, unit, power === 2 ? 'Der Term mit t² braucht m/s², damit insgesamt Meter entstehen.' : power === 1 ? 'Der Term mit t braucht m/s, damit insgesamt Meter entstehen.' : 'Der konstante Summand hat unmittelbar die Einheit Meter.', power === 2 ? ['m/s²', 'm/s^2', 'm/(s²)', 'm/(s^2)'] : [unit]));
        if (variable) equationFields.push(text(variable, `Physikalische Variable im Term mit ${symbol}`, 't', 'x wurde als Zeit in Sekunden eingegeben; ersetze x durch t.'));
      }
      result = {title: 'Die physikalische Gleichung vervollständigen', intro: 'Bei der Dateneingabe war x die Zeit in Sekunden und y die Strecke in Metern. Übertrage das Ergebnis in eine physikalische Gleichung.', stages: [stage('Gleichung direkt ergänzen', 'Runde jeden angegebenen Koeffizienten auf drei signifikante Stellen und trage ihn direkt in die Gleichung ein. Verwende Dezimalzahlen mit Komma und gib nötige Endnullen an. Ergänze außerdem Formelzeichen und Einheiten an den passenden Stellen.', equationFields, 'Die fertige Gleichung beschreibt s als Funktion von t. Jeder Summand muss die Einheit Meter haben. Drei signifikante Stellen sind die Rundungsanweisung dieser Übung; erst am Ende runden.', {equation: {symbolic, parameters, terms, lhs: 'lhs', lhsField: 'lhs'}})]};
    }
    result.variant = v;
    result.signature = JSON.stringify([step, v, result.stages]);
    return result;
  }
  const api = {generate, variants};
  root.MeasurementExercises = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
