/* Ausführliche, vollständig lokale Rechenhilfen zu Schritt 4. */
const proofGuide = (() => {
  const keys = ['proportional','linear','antiproportional','quadratisch','exponentiell'];
  const labels = ['Proportional','Linear','Antiproportional','Quadratisch','Exponentiell'];
  const Q = (s,k) => `<span class="quantity q${k}">${s}</span>`;
  const X = s => Q(s,'x'), Y = s => Q(s,'y'), R = s => Q(s,'test');
  const B = (a,b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const cellCalc = s => `<span class="table-calculation">${s}</span>`;
  const quotient = (a,b,r) => cellCalc(B(a,b)+' = '+R(r));
  const change = (a,b,r,color) => cellCalc(color(`${a} − ${b}`)+' = '+color(r));
  const eq = s => `<div class="calc-equation">${s}</div>`;
  const step = (title,body) => `<li><strong>${title}</strong>${body}</li>`;
  const calc = items => `<ol class="calc-steps">${items.join('')}</ol>`;
  const tab = (heads,rows,steps=null) => {
    if(!steps)return `<div class="table-wrap proof-table" tabindex="0" role="region" aria-label="Beispieltabelle, bei Bedarf seitlich scrollen"><table><caption>Zum Üben: idealisierte Beispielwerte ohne Einheiten</caption><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const alternative=`<span class="step-accessible">${steps.x.slice(0,-1).map((v,i)=>`x von ${v} zu ${steps.x[i+1]}: Änderung ${steps.x[i+1]-v}.`).join(' ')} ${steps.y.slice(0,-1).map((v,i)=>`y von ${v} zu ${steps.y[i+1]}: ${steps.factor?'Faktor '+steps.y[i+1]/v:'Änderung '+(steps.y[i+1]-v)}.`).join(' ')} ${steps.second?steps.y.slice(0,-2).map((v,i)=>`Zweite Differenz: ${steps.y[i+2]-steps.y[i+1]} minus ${steps.y[i+1]-v} gleich ${steps.y[i+2]-2*steps.y[i+1]+v}.`).join(' '):''}</span>`;
    const tbody=rows.map((r,i)=>{
      const data=`<tr class="measurement-row"><td>${r[1]}</td><th scope="row">${r[0]}</th>${steps.second?'':'<td class="derived-value"></td>'}<td>${r[2]}</td></tr>`;
      const between=i<rows.length-1?`<tr class="interval-row"><td></td><td></td>${steps.second?'':`<td class="derived-value">${r[3]}</td>`}<td></td></tr>`:'';
      return data+between;
    }).join('');
    const data=`<table><caption>Idealisierte Beispielwerte ohne Einheiten</caption><colgroup><col class="col-measurement"><col class="col-index">${steps.second?'':'<col class="col-derived">'}<col class="col-measurement"></colgroup><thead><tr><th scope="col">${heads[1]}</th><th scope="col">Punkt<br>i</th>${steps.second?'':`<th scope="col">${heads[3]}</th>`}<th scope="col">${heads[2]}</th></tr></thead><tbody>${tbody}</tbody></table>`;
    return `<div class="table-wrap proof-table stepped-table" tabindex="0" role="region" aria-label="Werte und versetzte Berechnungen mit Pfeilen, bei Bedarf seitlich scrollen">${alternative}<div class="table-step-layout${steps.second?' second-difference-table':''}" data-second-difference="${!!steps.second}" data-step-x="${steps.x.join(',')}" data-step-y="${steps.y.join(',')}" data-y-operation="${steps.factor?'factor':'difference'}">${data}<svg class="table-step-arrows" aria-hidden="true"></svg></div></div><p class="table-step-key">${X('Links: Δx')}${Y(steps.factor?'Rechts: Faktor zwischen y-Werten':'Rechts: Δy')}${steps.second?R('Außen rechts: Δ²y'):''}<span>${steps.second?'Die äußeren Pfeile verbinden jeweils zwei Δy-Werte. Die zweite Differenz steht genau zwischen diesen Werten.':'Die Rechnungen stehen auf Höhe der Pfeilbeschriftungen, zwischen den zugehörigen Messpunkten.'}</span></p>`;
  };

  const pair = (title,start,end,arrow,kind) => `<div class="proof-pair-card"><h4>${title}</h4><div class="pair-values">${Q(start,kind)}<span class="pair-arrow">→ ${arrow}</span>${Q(end,kind)}</div></div>`;
  const verdict = text => `<div class="proof-verdict"><strong>Was sagt das Ergebnis?</strong><p>${text}</p></div>`;
  const caution = text => `<div class="proof-caution"><strong>Darauf achten</strong><p>${text}</p></div>`;
  const more = (id,body) => `<button class="proof-reveal" aria-expanded="false" aria-controls="${id}">Eine weitere Rechnung ansehen ↓</button><div id="${id}" hidden>${body}</div>`;
  const ladder = (label,values,changes,kind) => `<div class="ladder-row"><strong>${label}</strong><div class="ladder-track">${values.map((v,i)=>`${Q(v,kind)}${i<values.length-1?`<span class="ladder-arrow">→<small>${changes[i]}</small></span>`:''}`).join('')}</div></div>`;
  const pages = [
    {
      title:'Proportional: y durch x teilen',
      intro:'Bei y = ax steckt in jedem Wertepaar derselbe Faktor a. Du findest ihn, indem du den y-Wert durch den zugehörigen x-Wert teilst.',
      html:tab(['Messpunkt i',X('xᵢ'),Y('yᵢ'),R('aᵢ')+' = '+B(Y('yᵢ'),X('xᵢ'))],[['1',X('0'),Y('0'),'nicht teilen'],['2',X('1'),Y('2'),quotient(Y('2'),X('1'),'2')],['3',X('2'),Y('4'),quotient(Y('4'),X('2'),'2')],['4',X('3'),Y('6'),quotient(Y('6'),X('3'),'2')],['5',X('4'),Y('8'),quotient(Y('8'),X('4'),'2')]])+
        '<h4>Ein Wertepaar – ein Quotient</h4><p>Wir nehmen Messpunkt 3. Lies beide Werte aus derselben Tabellenzeile ab.</p>'+
        calc([step('Werte zuordnen.',eq(X('x₃ = 2')+' &nbsp; und &nbsp; '+Y('y₃ = 4'))),step('In die Prüfgröße einsetzen.',eq(R('a₃')+' = '+B(Y('y₃'),X('x₃'))+' = '+B(Y('4'),X('2'))+' = '+R('2'))+'<p class="calc-hint">Oben steht y, unten x. Die Farben bleiben beim Einsetzen erhalten.</p>'),step('Für die übrigen Zeilen wiederholen und vergleichen.',eq(R('2')+' = '+R('2')+' = '+R('2')+' = '+R('2')))])+
        more('rechnung-proportional',eq(R('a₅')+' = '+B(Y('y₅'),X('x₅'))+' = '+B(Y('8'),X('4'))+' = '+R('2')))+
        verdict('Alle berechenbaren Quotienten sind hier 2. Das stützt die Vermutung „proportional“. Bei Messwerten suchst du nach annähernd konstanten Quotienten. Gleiche x-Abstände sind für diese Prüfung nicht erforderlich.')+
        caution('Bei x = 0 darfst du nicht dividieren – auch 0/0 ist nicht definiert. Ein vorhandener Messwert dort sollte mit y = 0 vereinbar sein. Die Tabellenzeile bleibt erhalten; nur der Quotient entfällt.')
    },
    {
      title:'Linear: Änderungen vergleichen',
      intro:'Bei einer Geraden ist die Steigung gleich: Wie stark ändert sich y pro Änderung von x? Dafür brauchst du jeweils zwei aufeinanderfolgende Messpunkte.',
      html:tab(['Messpunkt i',X('xᵢ'),Y('yᵢ'),R('mᵢ')+' = '+B(Y('Δy'),X('Δx'))],[['1',X('0'),Y('1'),quotient(Y('2'),X('1'),'2')],['2',X('1'),Y('3'),quotient(Y('4'),X('2'),'2')],['3',X('3'),Y('7'),quotient(Y('6'),X('3'),'2')],['4',X('6'),Y('13'),'—']],{x:[0,1,3,6],y:[1,3,7,13]})+
        '<p>Hier sind die x-Abstände absichtlich verschieden. Deshalb reicht es nicht, nur die Änderungen von y zu vergleichen.</p><h4>Von Messpunkt 2 zu Messpunkt 3</h4><div class="proof-pair">'+pair('Waagerechter Schritt: x', '1','3','+ 2','x')+pair('Senkrechter Schritt: y','3','7','+ 4','y')+'</div>'+
        calc([step('Änderung von x berechnen.',eq(X('Δx')+' = '+X('x₃ − x₂')+' = '+X('3 − 1')+' = '+X('2'))),step('Änderung von y berechnen.',eq(Y('Δy')+' = '+Y('y₃ − y₂')+' = '+Y('7 − 3')+' = '+Y('4'))),step('Beide Änderungen durcheinander teilen.',eq(R('m₂')+' = '+B(Y('Δy'),X('Δx'))+' = '+B(Y('4'),X('2'))+' = '+R('2'))+'<p class="calc-hint">Im Zähler und im Nenner immer in derselben Richtung rechnen: nächster Wert minus vorheriger Wert.</p>')])+
        more('rechnung-linear','<p>Jetzt von Messpunkt 3 zu Messpunkt 4:</p>'+eq(R('m₃')+' = '+B(Y('6'),X('3'))+' = '+R('2')))+
        verdict('Die Steigungen sind 2, 2, 2. Obwohl die y-Änderungen 2, 4, 6 verschieden sind, bleibt ihr Verhältnis zu den x-Änderungen gleich. Das stützt „linear“. Der Achsenabschnitt muss dabei nicht 0 sein.')+
        caution('Sortiere die Messpunkte nach x und vergleiche benachbarte Punkte. Die x-Werte eines Paars müssen verschieden sein, sonst wäre Δx = 0. Wiederholungsmessungen zum gleichen x-Wert vorher mitteln. Bei gleichen x-Abständen reichen zum Vergleich auch die ersten y-Differenzen; die Steigungsrechnung funktioniert ebenso bei ungleichen Abständen.')
    },
    {
      title:'Antiproportional: x und y multiplizieren',
      intro:'Bei y = '+B('a','x')+' mit a > 0 wird y kleiner, wenn ein positives x größer wird. Zur Prüfung multiplizierst du jeweils die beiden Werte einer Tabellenzeile: x · y = a.',
      html:tab(['Messpunkt i',X('xᵢ'),Y('yᵢ'),R('aᵢ = xᵢ · yᵢ')],[['1',X('1'),Y('12'),cellCalc(X('1')+' · '+Y('12')+' = '+R('12'))],['2',X('2'),Y('6'),cellCalc(X('2')+' · '+Y('6')+' = '+R('12'))],['3',X('3'),Y('4'),cellCalc(X('3')+' · '+Y('4')+' = '+R('12'))],['4',X('6'),Y('2'),cellCalc(X('6')+' · '+Y('2')+' = '+R('12'))]])+
        '<h4>Ein Wertepaar – ein Produkt</h4><p>Wir nehmen Messpunkt 3. Multipliziere die Werte aus derselben Zeile, nicht aus zwei verschiedenen Zeilen.</p>'+
        calc([step('Werte zuordnen.',eq(X('x₃ = 3')+' &nbsp; und &nbsp; '+Y('y₃ = 4'))),step('In die Prüfgröße einsetzen.',eq(R('a₃')+' = '+X('x₃')+' · '+Y('y₃')+' = '+X('3')+' · '+Y('4')+' = '+R('12'))),step('Die Produkte aller Zeilen vergleichen.',eq(R('12')+' = '+R('12')+' = '+R('12')+' = '+R('12')))])+
        more('rechnung-antiproportional',eq(R('a₄')+' = '+X('x₄')+' · '+Y('y₄')+' = '+X('6')+' · '+Y('2')+' = '+R('12')))+
        '<div class="proof-pair">'+pair('x wird verdoppelt','3','6','· 2','x')+pair('y wird dabei halbiert','4','2',': 2','y')+'</div>'+
        verdict('Die Produkte bleiben hier alle 12. Das stützt „antiproportional“. Verdoppeln von x und Halbieren von y passen dazu. Gleiche x-Abstände sind für die Produktprüfung nicht erforderlich.')+
        caution('Das Modell ist bei x = 0 nicht definiert. Dass eine Kurve fällt, genügt als Erkennungsmerkmal nicht: Auch andere Funktionstypen können fallen. Entscheidend ist hier, ob die Produkte annähernd konstant bleiben.')
    },
    {
      title:'Quadratisch: zweimal Differenzen bilden',
      intro:'Prüfe zuerst, ob die x-Abstände gleich sind. Erst dann darfst du die ersten und zweiten y-Differenzen auf die hier beschriebene Weise vergleichen.',
      html:tab(['Messpunkt i',X('xᵢ'),Y('yᵢ'),R('Δ²y zur nächsten Differenz')],[['1',X('0'),Y('1'),cellCalc(Y('5 − 3')+' = '+R('2'))],['2',X('1'),Y('4'),cellCalc(Y('7 − 5')+' = '+R('2'))],['3',X('2'),Y('9'),cellCalc(Y('9 − 7')+' = '+R('2'))],['4',X('3'),Y('16'),'—'],['5',X('4'),Y('25'),'—']],{x:[0,1,2,3,4],y:[1,4,9,16,25],second:true})+
        '<h4>Die Differenzen als Rechenweg</h4><p>Lies die Pfeile von links nach rechts. Die Beschriftung zeigt jeweils die Änderung zum nächsten Wert. Auf kleinen Bildschirmen kannst du den Rechenweg seitlich verschieben.</p><div class="ladder-scroll" tabindex="0" role="region" aria-label="Differenzen mit beschrifteten Pfeilen, seitlich scrollbar"><div class="difference-ladder">'+
        ladder('x-Werte',[0,1,2,3,4],['+ 1','+ 1','+ 1','+ 1'],'x')+
        ladder('y-Werte',[1,4,9,16,25],['+ 3','+ 5','+ 7','+ 9'],'y')+
        ladder('Erste Differenzen Δy',[3,5,7,9],['+ 2','+ 2','+ 2'],'y')+
        ladder('Zweite Differenzen Δ²y',[2,2,2],['gleich','gleich'],'test')+'</div></div>'+
        calc([step('Gleiche x-Abstände sicherstellen.',eq(X('1 − 0 = 1')+'; &nbsp; '+X('2 − 1 = 1')+'; &nbsp; '+X('3 − 2 = 1')+'; &nbsp; '+X('4 − 3 = 1'))+'<p>Überall gilt Δx = 1. Wir können die Differenzenmethode anwenden.</p>'),step('Erste Differenzen bilden: nächster y-Wert minus vorheriger y-Wert.',eq(Y('Δy₁ = 4 − 1 = 3')+'<br>'+Y('Δy₂ = 9 − 4 = 5')+'<br>'+Y('Δy₃ = 16 − 9 = 7')+'<br>'+Y('Δy₄ = 25 − 16 = 9'))),step('Zweite Differenzen bilden: nächste erste Differenz minus vorherige erste Differenz.',eq(R('Δ²y₁')+' = '+Y('5 − 3')+' = '+R('2')+'<br>'+R('Δ²y₂')+' = '+Y('7 − 5')+' = '+R('2')+'<br>'+R('Δ²y₃')+' = '+Y('9 − 7')+' = '+R('2')))])+
        verdict('Die ersten Differenzen 3, 5, 7, 9 verändern sich. Ihre Änderungen – die zweiten Differenzen – sind aber gleich und von null verschieden: 2, 2, 2. Das stützt „quadratisch“.')+
        caution('Ohne gleiche x-Abstände ist diese vereinfachte Prüfung nicht anwendbar. Zweite Differenzen von 0 passen zu einem linearen Verlauf. Bei gemessenen Werten nahe 0 musst du die Messunsicherheit berücksichtigen. Vier Messpunkte liefern zwei zweite Differenzen zum Vergleichen; mehr Punkte erlauben einen breiteren Vergleich.')
    },
    {
      title:'Exponentiell: benachbarte y-Werte teilen',
      intro:'Bei gleichen x-Schritten wird y immer mit demselben Faktor vervielfacht. Teile den nächsten y-Wert durch den vorherigen – nicht y durch x.',
      html:tab(['Messpunkt i',X('xᵢ'),Y('yᵢ'),R('qᵢ')+' = '+B(Y('yᵢ₊₁'),Y('yᵢ'))],[['1',X('0'),Y('3'),quotient(Y('12'),Y('3'),'4')],['2',X('2'),Y('12'),quotient(Y('48'),Y('12'),'4')],['3',X('4'),Y('48'),quotient(Y('192'),Y('48'),'4')],['4',X('6'),Y('192'),'—']],{x:[0,2,4,6],y:[3,12,48,192],factor:true})+
        '<h4>Von Messpunkt 2 zu Messpunkt 3</h4><div class="proof-pair">'+pair('Gleicher x-Schritt','2','4','+ 2','x')+pair('Multiplikativer y-Schritt','12','48','· 4','y')+'</div>'+
        calc([step('Gleiche x-Abstände prüfen.',eq(X('2 − 0 = 2')+'; &nbsp; '+X('4 − 2 = 2')+'; &nbsp; '+X('6 − 4 = 2'))+'<p>Jeder Schritt ist Δx = 2 groß.</p>'),step('Nächsten y-Wert durch vorherigen y-Wert teilen.',eq(R('q₂')+' = '+B(Y('y₃'),Y('y₂'))+' = '+B(Y('48'),Y('12'))+' = '+R('4'))+'<p class="calc-hint">Beide Werte gehören zu y. Die Indizes zeigen, welcher Wert in Zähler und Nenner gehört.</p>'),step('Alle aufeinanderfolgenden Quotienten vergleichen.',eq(R('q₁')+' = '+B(Y('12'),Y('3'))+' = '+R('4')+'<br>'+R('q₂')+' = '+B(Y('48'),Y('12'))+' = '+R('4')+'<br>'+R('q₃')+' = '+B(Y('192'),Y('48'))+' = '+R('4')))])+
        verdict('Die Quotienten sind 4, 4, 4 bei immer gleichem Δx = 2. Das stützt „exponentiell“: Pro x-Schritt von 2 vervierfacht sich y.')+
        caution('Bei Δx = 1 entspricht q der Basis b. Hier gilt dagegen q = b², weil Δx = 2 ist: Der Faktor 4 gilt für zwei x-Einheiten. Die Basis ist deshalb b = 4<sup>1/2</sup> = 2. Allgemein gilt q = b<sup>Δx</sup>. Eine konstante Folge mit q = 1 erfüllt nicht den hier behandelten exponentiellen Typ mit b ≠ 1. Der Nenner darf nicht 0 sein; das Modell a · bˣ mit a ≠ 0 hat keine y-Werte von 0.')+
        '<details class="proof-mini-example"><summary>Wie sieht exponentielle Abnahme aus?</summary><div><p>Bei x = 0; 1; 2; 3 seien die y-Werte 8; 4; 2; 1. Dann ist Δx = 1 und die Quotienten sind:</p>'+eq(B(Y('4'),Y('8'))+' = '+R('0,5')+'; &nbsp; '+B(Y('2'),Y('4'))+' = '+R('0,5')+'; &nbsp; '+B(Y('1'),Y('2'))+' = '+R('0,5'))+'<p>Pro x-Schritt halbiert sich y. Weil Δx = 1 ist, gilt hier b = 0,5.</p></div></details>'
    }
  ];
  const approximation = (body,units) => `<section class="proof-approximation"><span class="tag">VON DER PRÜFUNG ZUR ERSTEN NÄHERUNG</span><h4>1. Parameter näherungsweise bestimmen</h4>${body}<h4>2. Einheiten aus dem Rechenweg herleiten</h4><p>[x] bezeichnet die Einheit von x. Beim Mitteln gleichartiger Größen bleibt ihre Einheit erhalten.</p>${units}<p class="calc-hint">Zwischenergebnisse möglichst ungerundet verwenden. Runde die abschließenden Parameter erst in <a href="#schritt-6">Schritt 6</a>.</p></section>`;
  const approximations = [
    approximation(
      '<p>Wenn die Quotienten annähernd konstant sind, verwende ihren arithmetischen Mittelwert als erste Näherung für a. N ist hier die Anzahl der berechenbaren Quotienten; Zeilen mit x = 0 zählen nicht mit.</p>'+eq(R('a')+' ≈ '+B(R('Summe der berechenbaren aᵢ'), 'N'))+'<p>Im Beispiel sind vier Quotienten berechenbar:</p>'+eq(R('a')+' ≈ '+B(R('2 + 2 + 2 + 2'),'4')+' = '+R('2'))+'<p>Erste Näherung: <strong>y ≈ 2x</strong>. Bei echten Messdaten sind die einzelnen Quotienten meist etwas verschieden.</p>',
      '<p>Jeder Quotient entsteht aus y geteilt durch x. Deshalb hat auch sein Mittelwert diese Einheit:</p>'+eq('[a] = '+B(Y('[y]'),X('[x]')))+'<p>Ordnen wir den Beispielzahlen x = Zeit t in s und y = Strecke s in m zu, gilt:</p>'+eq('[a] = '+B(Y('m'),X('s')))+'<p>Die erste physikalische Näherung lautet dann:</p>'+eq('s(t) ≈ '+R('2 '+B('m','s'))+' · t')
    ),
    approximation(
      '<p>Verwende den arithmetischen Mittelwert der zuvor berechneten Steigungen als m. N ist die Anzahl dieser Steigungen.</p>'+eq(R('m')+' ≈ '+B(R('m₁ + … + m<sub>N</sub>'),'N')+' = '+B(R('2 + 2 + 2'),'3')+' = '+R('2'))+'<p>Lies b am Schnittpunkt des angenommenen geraden Verlaufs mit der y-Achse ab. Im Beispiel liegt dieser bei <strong>b ≈ 1</strong>. Damit erhältst du <strong>y ≈ 2x + 1</strong>.</p><p class="calc-hint">b wird hier aus dem Diagramm abgelesen. Ein außerhalb des Messbereichs abgelesener Startwert kann besonders unsicher sein.</p>',
      '<p>Eine Differenz behält die Einheit der ursprünglichen Größe: Δy hat die Einheit von y, Δx die von x. Aus der Steigungsrechnung folgt:</p>'+eq('[m] = '+B(Y('[Δy]'),X('[Δx]'))+' = '+B(Y('[y]'),X('[x]')))+'<p>b ist ein abgelesener y-Wert bei x = 0, also gilt <strong>[b] = [y]</strong>.</p><p>Für x = Zeit t in s und y = Strecke s in m wird daraus:</p>'+eq('s(t) ≈ '+R('2 '+B('m','s'))+' · t + '+R('1 m'))+'<p>Kontrolle: Sowohl (m/s) · s als auch der konstante Term haben die Einheit Meter.</p>'
    ),
    approximation(
      '<p>Wenn die Produkte annähernd konstant sind, verwende ihren arithmetischen Mittelwert als erste Näherung für a. N ist die Anzahl der Produkte.</p>'+eq(R('a')+' ≈ '+B(R('a₁ + … + a<sub>N</sub>'),'N')+' = '+B(R('12 + 12 + 12 + 12'),'4')+' = '+R('12'))+'<p>Erste Näherung:</p>'+eq('y ≈ '+B(R('12'),X('x'))),
      '<p>Jeder Wert aᵢ entsteht durch Multiplizieren von x und y. Deshalb hat auch ihr Mittelwert die Produkteinheit:</p>'+eq('[a] = '+X('[x]')+' · '+Y('[y]'))+'<p>Ordnen wir den Beispielzahlen x = Volumen V in cm³ und y = Druck p in kPa zu, gilt <strong>[a] = kPa · cm³</strong>. Die Gleichung lautet dann:</p>'+eq('p(V) ≈ '+B(R('12 kPa · cm³'),X('V')))+'<p>Kontrolle: Beim Teilen durch V mit der Einheit cm³ bleibt kPa übrig – die Einheit des Drucks.</p>'
    ),
    `<section class="proof-approximation"><span class="tag">NÄCHSTER SCHRITT · REGRESSION</span><h4>Keine analoge Parameterbestimmung vorgesehen</h4><p>Die zweiten Differenzen helfen dir hier, den Funktionstyp zu prüfen. Für die allgemeine quadratische Gleichung werden die Parameter a, b und c in diesem Unterrichtsverfahren erst durch die <a href="#geogebra">quadratische Regression in Schritt 5</a> bestimmt.</p><h4>Die Einheiten kannst du schon vorab klären</h4><p>Bei y = ax² + bx + c muss jeder Summand dieselbe Einheit wie y haben. Prüfe die Terme einzeln:</p>${eq('[a] · '+X('[x]²')+' = '+Y('[y]')+' ⇒ [a] = '+B(Y('[y]'),X('[x]²')))}${eq('[b] · '+X('[x]')+' = '+Y('[y]')+' ⇒ [b] = '+B(Y('[y]'),X('[x]')))}${eq('[c] = '+Y('[y]'))}<p>Für x = Zeit t in s und y = Strecke s in m gilt daher: [a] = m/s², [b] = m/s und [c] = m. Hier werden die Einheiten aus den Gleichungstermen hergeleitet, nicht aus einer analogen Näherung.</p></section>`,
    approximation(
      '<p>Bilde den arithmetischen Mittelwert q̄ der aufeinanderfolgenden Quotienten. N ist die Anzahl der Quotienten.</p>'+eq(R('q̄')+' = '+B(R('q₁ + … + q<sub>N</sub>'),'N')+' = '+B(R('4 + 4 + 4'),'3')+' = '+R('4'))+'<p>Bei Δx = 1 verwendest du b ≈ q̄. Sonst gilt:</p>'+eq(R('b')+' ≈ '+R('q̄')+'<sup>1/Δx</sup>')+'<p>Δx meint hier den Zahlenabstand in der Tabelle. Im Beispiel beträgt er 2:</p>'+eq(R('b')+' ≈ '+R('4')+'<sup>1/2</sup> = '+R('2'))+'<p>Lies den Startwert a am Schnittpunkt des angenommenen Kurvenverlaufs mit der y-Achse ab. Hier ist <strong>a ≈ 3</strong>. Die erste Näherung lautet <strong>y ≈ 3 · 2ˣ</strong>.</p><p class="calc-hint">Ein außerhalb des Messbereichs abgelesener Startwert kann besonders unsicher sein.</p>',
      '<p>Im Quotienten werden zwei Werte derselben Größe geteilt. Ihre Einheiten kürzen sich:</p>'+eq('[q] = '+B(Y('[y]'),Y('[y]'))+' = 1')+'<p>q, q̄ und die Basis b sind einheitenlos. a ist ein abgelesener y-Wert bei x = 0, daher gilt <strong>[a] = [y]</strong>. Auch der Exponent muss einheitenlos sein.</p><p>Ordnen wir den Beispielzahlen x = Zeit t in s und y = Spannung U in V zu, schreiben wir deshalb:</p>'+eq('U(t) ≈ '+R('3 V')+' · 2<sup>t/(1 s)</sup>')+'<p>t/(1 s) ist einheitenlos. Der Faktor 2 gilt pro Sekunde; die Tabellenquotienten 4 gelten jeweils für einen Schritt von zwei Sekunden. Die Bezugseinheit im Exponenten entspricht der bei der Dateneingabe verwendeten Einheit.</p>'
    )
  ];
  function html() {
    return `<div class="proof-guide"><p class="proof-intro">Wähle die vermutete Funktion: erst prüfen, dann eine erste analoge Näherung bestimmen und die Einheiten herleiten. Die Tabellen enthalten zunächst idealisierte Zahlen ohne Einheiten. Für die physikalische Gleichung ordnen wir den Größen am Ende jedes Rechenwegs beispielhaft Einheiten zu. Bei deinen Daten rechnest du mit den Messwerten bzw. Mittelwerten und berücksichtigst die Messunsicherheit.</p><div class="proof-legend" aria-label="Farbschlüssel">${X('x: unabhängige Größe')}${Y('y: abhängige Größe')}${R('Prüfgröße oder Parameter')}</div><p class="muted">Gleiche Formelzeichen behalten ihre Farbe. Indizes 1, 2, 3, … bezeichnen die Messpunkte. Δ („Delta“) bedeutet Änderung: nächster Wert minus vorheriger Wert.</p><div class="type-tabs proof-tabs" role="tablist" aria-label="Rechnerische Prüfung nach Funktionstyp">${labels.map((n,i)=>`<button type="button" role="tab" id="proof-tab-${keys[i]}" aria-controls="pruefen-${keys[i]}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-proof="${i}">${n}</button>`).join('')}</div>${pages.map((p,i)=>`<section class="proof-panel" id="pruefen-${keys[i]}" role="tabpanel" aria-labelledby="proof-tab-${keys[i]}" tabindex="0" ${i?'hidden':''}><div class="proof-head"><span class="tag">PRÜFEN & NÄHERN · ${labels[i].toUpperCase()}</span><h3>${p.title}</h3><p>${p.intro}</p></div>${p.html}${approximations[i]}<div class="proof-next"><a href="#funktionsvergleich" data-model="${keys[i]}">← Merkmale im Diagramm</a><a href="#schritt-5">Weiter zur Regression →</a></div></section>`).join('')}</div>`;
  }
  function drawStepArrows() {
    document.querySelectorAll('.table-step-layout').forEach(layout=>{
      if(!layout.getBoundingClientRect().width)return;
      const frame=layout.getBoundingClientRect(), svg=layout.querySelector('svg'), rows=[...layout.querySelectorAll('tbody tr.measurement-row')];
      svg.setAttribute('viewBox',`0 0 ${layout.offsetWidth} ${layout.offsetHeight}`);
      let drawing='';
      const second=layout.dataset.secondDifference==='true',firstDifferences=[];
      const side=(values,kind,factor)=>{
        const right=kind==='y', rail=right?(second?layout.querySelector('table').getBoundingClientRect().right-frame.left+30:layout.offsetWidth-22):22, color=right?'#99450f':'#175d96', bg=right?'#fff0df':'#e9f2fb';
        const cells=rows.map(r=>r.querySelector(right?'td:last-child .quantity':'td:first-child .quantity'));
        const header=layout.querySelector(right?'thead th:last-child':'thead th:first-child').getBoundingClientRect();
        drawing+=`<text x="${rail}" y="${header.top-frame.top+header.height/2}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="13" font-weight="700">${factor?'× y':'Δ'+kind}</text>`;
        values.slice(0,-1).forEach((v,i)=>{
          const a=cells[i].getBoundingClientRect(),b=cells[i+1].getBoundingClientRect(),start=right?a.right-frame.left+5:a.left-frame.left-5,end=right?b.right-frame.left+5:b.left-frame.left-5,y1=a.top-frame.top+a.height/2,y2=b.top-frame.top+b.height/2,mid=(y1+y2)/2,change=factor?values[i+1]/v:values[i+1]-v,label=factor?'×'+change:(change>=0?'+':'−')+Math.abs(change),turn=right?-8:8,head=right?6:-6;
          if(right&&second)firstDifferences.push({x:rail+26,y:mid,value:change});
          drawing+=`<path d="M${start} ${y1}H${rail+turn}Q${rail} ${y1} ${rail} ${y1+8}V${y2-8}Q${rail} ${y2} ${rail+turn} ${y2}H${end}" fill="none" stroke="${color}" stroke-width="1.6"/><path d="M${end+head} ${y2-4}L${end} ${y2}L${end+head} ${y2+4}" fill="none" stroke="${color}" stroke-width="1.6"/><rect x="${rail-22}" y="${mid-12}" width="44" height="24" rx="5" fill="${bg}"/><text x="${rail}" y="${mid}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="14" font-weight="700">${label}</text>`;
        });
      };
      side(layout.dataset.stepX.split(',').map(Number),'x',false);
      side(layout.dataset.stepY.split(',').map(Number),'y',layout.dataset.yOperation==='factor');
      if(second){
        const rail=layout.offsetWidth-48,color='#6b3c96';
        const header=layout.querySelector('thead').getBoundingClientRect();
        drawing+=`<text x="${rail}" y="${header.top-frame.top+header.height/2}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="13" font-weight="700">Δ²y</text>`;
        firstDifferences.slice(0,-1).forEach((a,i)=>{
          const b=firstDifferences[i+1],mid=(a.y+b.y)/2,result=b.value-a.value;
          drawing+=`<path d="M${a.x} ${a.y}H${rail-8}Q${rail} ${a.y} ${rail} ${a.y+8}V${b.y-8}Q${rail} ${b.y} ${rail-8} ${b.y}H${b.x}" fill="none" stroke="${color}" stroke-width="1.6"/><path d="M${b.x+6} ${b.y-4}L${b.x} ${b.y}L${b.x+6} ${b.y+4}" fill="none" stroke="${color}" stroke-width="1.6"/><rect x="${rail-44}" y="${mid-13}" width="88" height="26" rx="5" fill="#f3ebfa"/><text x="${rail}" y="${mid}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700"><tspan fill="${color}">${result>=0?'+':'−'}${Math.abs(result)}</tspan></text>`;
        });
      }
      svg.innerHTML=drawing;
    });
  }
  function select(i,updateHash=false) {
    const guide=document.querySelector('.proof-guide');
    if(!guide)return;
    guide.querySelectorAll('[data-proof]').forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1;});
    guide.querySelectorAll('.proof-panel').forEach((p,n)=>p.hidden=n!==i);
    requestAnimationFrame(drawStepArrows);
    if(updateHash)history.replaceState(null,'',`#pruefen-${keys[i]}`);
  }
  function followHash(scroll=false) {
    const i=keys.findIndex(k=>location.hash===`#pruefen-${k}`);
    if(i>=0){select(i);if(scroll)document.getElementById(`pruefen-${keys[i]}`).scrollIntoView({block:'start'});}
  }
  function init() {
    const guide=document.querySelector('.proof-guide');
    guide.addEventListener('click',e=>{const b=e.target.closest('[data-proof]');if(b)select(+b.dataset.proof,true);const reveal=e.target.closest('.proof-reveal');if(reveal){const open=reveal.getAttribute('aria-expanded')!=='true';reveal.setAttribute('aria-expanded',String(open));document.getElementById(reveal.getAttribute('aria-controls')).hidden=!open;reveal.textContent=open?'Weitere Rechnung einklappen ↑':'Eine weitere Rechnung ansehen ↓';}});
    guide.querySelector('.proof-tabs').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let n=+e.target.dataset.proof;n=e.key==='Home'?0:e.key==='End'?4:(n+(e.key==='ArrowRight'?1:4))%5;select(n,true);guide.querySelector(`[data-proof="${n}"]`).focus();});
    document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#pruefen-"]');if(a){const i=keys.findIndex(k=>a.hash===`#pruefen-${k}`);if(i>=0)select(i);}});
    window.addEventListener('hashchange',()=>followHash(true));
    followHash(true);
    const resizeObserver=new ResizeObserver(drawStepArrows);
    guide.querySelectorAll('.table-step-layout table').forEach(t=>resizeObserver.observe(t));
    window.addEventListener('resize',drawStepArrows);
    requestAnimationFrame(drawStepArrows);
  }
  function search(q) {
    if(!q)return;
    const panels=[...document.querySelectorAll('.proof-panel')];
    const i=panels.findIndex(p=>p.textContent.toLocaleLowerCase('de').includes(q));
    if(i>=0)select(i);
  }
  return {html,init,search};
})();
