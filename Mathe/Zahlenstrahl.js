// zahlenstrahl.js

// Globale Marker-Zähler für eindeutige Marker-IDs
let markerCounter = 0;
let markCounter = 0; // Zähler für Markierungen

// Variable zum Speichern des aktuell ausgewählten Elements
let selectedElement = null;
let selectedSVG = null;
let offsetX = 0;

/**
 * Zeichnet einen Zahlenstrahl in ein SVG-Element innerhalb eines Containers.
 * @param {number} Min - Der minimale Wert des Zahlenstrahls.
 * @param {number} Max - Der maximale Wert des Zahlenstrahls.
 * @param {number} Skalierung - Die Skalierungseinheit (Exponent der Hauptskalierung, z.B. -4 für 10⁻⁴ = 0,0001).
 * @param {string} KontainerID - Die ID des Container-Elements.
 * @param {string} [farbe='black'] - Die Farbe der Beschriftungen.
 */
function zeichneZahlenstrahl(Min, Max, Skalierung, KontainerID, farbe = 'black') {
    // Berechnung der Skalierungseinheiten
    const HauptskalierungEinheit = Math.pow(10, Skalierung);
    const FeinskalaEinheit = HauptskalierungEinheit / 10;

    // Bestimmen der Dezimalstellen
    function getDecimalPlaces(feinskalaEinheit) {
        let places = 0;
        while (feinskalaEinheit < 1 && places < 20) { // Begrenzung auf 20 Dezimalstellen
            feinskalaEinheit *= 10;
            places++;
        }
        return places;
    }
    const decimalPlaces = getDecimalPlaces(FeinskalaEinheit);

    // Kontainer-Element
    const kontainer = document.getElementById(KontainerID);
    if (!kontainer) {
        console.error(`Kontainer mit der ID "${KontainerID}" nicht gefunden.`);
        return;
    }
    kontainer.innerHTML = `<div class="container-name">ID: ${KontainerID}</div>`; // Inhalt leeren und Containername hinzufügen
    kontainer.style.position = 'relative';

    // SVG erstellen
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '800');
    svg.setAttribute('height', '150'); // Erhöht, um mehr Platz für Bewegungen zu bieten
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    kontainer.appendChild(svg);

    // Zahlenstrahl zeichnen
    const paddingLeft = 50;
    const paddingRight = 50;
    const lineY = 75;

    // Hauptlinie zeichnen
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', lineY);
    line.setAttribute('x2', 800 - paddingRight);
    line.setAttribute('y2', lineY);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);

    const totalWidth = 800 - paddingLeft - paddingRight;
    const range = Max - Min;
    const pixelsPerUnit = totalWidth / range;

    // Hauptskalierung zeichnen
    const startHaupt = Math.ceil(Min / HauptskalierungEinheit) * HauptskalierungEinheit;
    const numSteps = Math.round((Max - startHaupt) / HauptskalierungEinheit);

    for (let i = 0; i <= numSteps; i++) {
        let x = startHaupt + i * HauptskalierungEinheit;
        x = parseFloat(x.toFixed(decimalPlaces));
        if (x > Max) x = Max;

        const xpos = paddingLeft + (x - Min) * pixelsPerUnit;

        // Tick für Hauptskalierung
        const tick = document.createElementNS(svgNS, 'line');
        tick.setAttribute('x1', xpos);
        tick.setAttribute('y1', lineY - 15);
        tick.setAttribute('x2', xpos);
        tick.setAttribute('y2', lineY + 15);
        tick.setAttribute('stroke', 'black');
        tick.setAttribute('stroke-width', '2');
        svg.appendChild(tick);

        // Beschriftung
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', xpos);
        text.setAttribute('y', lineY + 30);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', farbe);
        text.style.fontSize = '14px';
        text.textContent = x.toFixed(decimalPlaces);
        svg.appendChild(text);
    }

    // Feinskala zeichnen
    const startFein = Math.ceil(Min / FeinskalaEinheit) * FeinskalaEinheit;
    const numFeinSteps = Math.round((Max - startFein) / FeinskalaEinheit);

    for (let j = 0; j <= numFeinSteps; j++) {
        let xFein = startFein + j * FeinskalaEinheit;
        xFein = parseFloat(xFein.toFixed(decimalPlaces));
        if (xFein > Max) xFein = Max;

        const xposFein = paddingLeft + (xFein - Min) * pixelsPerUnit;

        // Tick für Feinskala
        const tickFein = document.createElementNS(svgNS, 'line');
        tickFein.setAttribute('x1', xposFein);
        tickFein.setAttribute('y1', lineY - 7);
        tickFein.setAttribute('x2', xposFein);
        tickFein.setAttribute('y2', lineY + 7);
        tickFein.setAttribute('stroke', 'black');
        tickFein.setAttribute('stroke-width', '1');
        svg.appendChild(tickFein);
    }

    // Speichere die Eigenschaften des Zahlenstrahls im Container für spätere Referenz
    kontainer.dataset.min = Min;
    kontainer.dataset.max = Max;
    kontainer.dataset.skalierung = Skalierung;
    kontainer.dataset.paddingLeft = paddingLeft;
    kontainer.dataset.paddingRight = paddingRight;
    kontainer.dataset.lineY = lineY;
    kontainer.dataset.canvasWidth = 800;
    kontainer.dataset.canvasHeight = 150;
    kontainer.dataset.decimalPlaces = decimalPlaces;
    kontainer.dataset.feinskalaEinheit = FeinskalaEinheit;
    kontainer.dataset.pixelsPerUnit = pixelsPerUnit;
}

/**
 * Hilfsfunktion zum Parsen der Transform-Attribute.
 * @param {string} transform - Der Transform-String (z.B. "translate(50,0)").
 * @returns {object} - Ein Objekt mit x und y Werten.
 */
function parseTransform(transform) {
    const result = /translate\(\s*([-\d.]+)[ ,]([-\d.]+)\s*\)/.exec(transform);
    if (result) {
        return { x: parseFloat(result[1]), y: parseFloat(result[2]) };
    }
    return { x: 0, y: 0 };
}

/**
 * Markiert eine bestimmte Zahl auf einem bestehenden Zahlenstrahl.
 * Fügt ein "×" und optional eine Beschriftung des Zahlenwerts hinzu.
 * Macht das Element anklickbar und verschiebbar, je nach Einstellung.
 * @param {string} KontainerID - Die ID des Container-Elements, das den Zahlenstrahl enthält.
 * @param {number} zahl - Die Zahl, die markiert werden soll.
 * @param {string} [farbe='black'] - Die Farbe der Markierung und Beschriftung.
 * @param {boolean} [sichtbar=true] - Bestimmt, ob die Beschriftung des Zahlenwerts angezeigt werden soll.
 * @param {boolean} [bewegbar=true] - Bestimmt, ob das Objekt verschiebbar ist.
 * @returns {string|null} - Die eindeutige ID der erstellten Markierung oder null bei Fehler.
 */
function markiereZahl(KontainerID, zahl, farbe = 'black', sichtbar = true, bewegbar = true) {
    // Kontainer-Element abrufen
    const kontainer = document.getElementById(KontainerID);
    if (!kontainer) {
        console.error(`Kontainer mit der ID "${KontainerID}" nicht gefunden.`);
        return null;
    }

    // Überprüfen, ob ein SVG-Zahlenstrahl vorhanden ist
    const svg = kontainer.querySelector('svg');
    if (!svg) {
        console.error(`Es wurde kein SVG-Zahlenstrahl im Container "${KontainerID}" gefunden.`);
        return null;
    }

    // Aus den Datenattributen die notwendigen Werte abrufen
    const Min = parseFloat(kontainer.dataset.min);
    const Max = parseFloat(kontainer.dataset.max);
    const Skalierung = parseFloat(kontainer.dataset.skalierung);
    const paddingLeft = parseFloat(kontainer.dataset.paddingLeft);
    const paddingRight = parseFloat(kontainer.dataset.paddingRight);
    const lineY = parseFloat(kontainer.dataset.lineY);
    const canvasWidth = parseFloat(kontainer.dataset.canvasWidth);
    const decimalPlaces = parseInt(kontainer.dataset.decimalPlaces, 10);
    const pixelsPerUnit = parseFloat(kontainer.dataset.pixelsPerUnit);
    const FeinskalaEinheit = parseFloat(kontainer.dataset.feinskalaEinheit);

    // Überprüfen, ob die Zahl innerhalb des Bereichs liegt
    if (zahl < Min || zahl > Max) {
        console.error(`Die Zahl ${zahl} liegt außerhalb des Zahlenstrahls (${Min} bis ${Max}).`);
        return null;
    }

    // Berechnung der x-Position der Zahl
    const xpos = paddingLeft + (zahl - Min) * pixelsPerUnit;

    // Erstellen eines Gruppen-Elements
    const svgNS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(svgNS, 'g');

    // Zuweisen einer eindeutigen ID
    markCounter++;
    const markID = `mark-${markCounter}`;
    group.setAttribute('id', markID);

    // Optional: Bewegbarkeit als Klasse hinzufügen
    if (bewegbar) {
        group.classList.add('movable', 'cross');
    } else {
        group.classList.add('cross');
        group.style.pointerEvents = 'none'; // Fixierte Kreuze ignorieren Mausereignisse
    }

    // Runden des Wertes entsprechend decimalPlaces
    const gerundeterWert = parseFloat(zahl.toFixed(decimalPlaces));
    group.setAttribute('transform', `translate(${xpos},0)`);
    group.dataset.value = gerundeterWert;

    // Erstellen des "×" Symbols
    const crossSize = 10; // Basisgröße des "×"

    // Erstes Linie des "×"
    const line1 = document.createElementNS(svgNS, 'line');
    line1.setAttribute('x1', -crossSize / 2);
    line1.setAttribute('y1', lineY - crossSize / 2);
    line1.setAttribute('x2', crossSize / 2);
    line1.setAttribute('y2', lineY + crossSize / 2);
    line1.setAttribute('stroke', farbe);
    line1.setAttribute('stroke-width', '2');
    group.appendChild(line1);

    // Zweites Linie des "×"
    const line2 = document.createElementNS(svgNS, 'line');
    line2.setAttribute('x1', crossSize / 2);
    line2.setAttribute('y1', lineY - crossSize / 2);
    line2.setAttribute('x2', -crossSize / 2);
    line2.setAttribute('y2', lineY + crossSize / 2);
    line2.setAttribute('stroke', farbe);
    line2.setAttribute('stroke-width', '2');
    group.appendChild(line2);

    // Optional: Beschriftung der Zahl
    if (sichtbar) {
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', 0);
        text.setAttribute('y', lineY + crossSize - 35); // Position unterhalb des "×"
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', farbe);
        text.style.fontSize = '14px';
        text.textContent = gerundeterWert;
        group.appendChild(text);
    }

    // Optional: Anzeige der Markierungs-ID als Tooltip
    group.setAttribute('title', `Markierung ID: ${markID}`);

    // Append the group to the SVG
    svg.appendChild(group);

    // Rückgabe der Markierungs-ID
    return markID;
}

/**
 * Markiert einen Pfeil auf einem bestehenden Zahlenstrahl.
 * Fügt einen Pfeil von einer Startzahl um einen bestimmten Wert hinzu und optional eine Beschriftung der Veränderung.
 * Macht das Element anklickbar und verschiebbar, je nach Einstellung.
 * @param {string} KontainerID - Die ID des Container-Elements, das den Zahlenstrahl enthält.
 * @param {number} start - Die Zahl, bei der der Pfeil startet.
 * @param {string} operator - Der Operator ('+' oder '-'), der die Richtung der Veränderung bestimmt.
 * @param {number} value - Der Wert, um den der Pfeil verlängert wird (muss positiv sein).
 * @param {string} [farbe='black'] - Die Farbe des Pfeils und der Beschriftung.
 * @param {boolean} [sichtbar=true] - Bestimmt, ob oberhalb des Pfeils eine Beschriftung der Veränderung angezeigt wird.
 * @param {boolean} [bewegbar=true] - Bestimmt, ob das Objekt verschiebbar ist.
 * @returns {string|null} - Die eindeutige ID der erstellten Markierung oder null bei Fehler.
 */
function markierePfeil(KontainerID, start, operator, value, farbe = 'black', sichtbar = true, bewegbar = true) {
    // Validierung des Operators
    if (operator !== '+' && operator !== '-') {
        console.error("Der Operator muss entweder '+' oder '-' sein.");
        return null;
    }

    // Validierung des Wertes
    if (value < 0) {
        console.error("Der Wert muss positiv sein.");
        return null;
    }

    // Berechnung der Veränderung basierend auf dem Operator
    const change = operator === '+' ? value : -value;
    const end = start + change;

    // Kontainer-Element abrufen
    const kontainer = document.getElementById(KontainerID);
    if (!kontainer) {
        console.error(`Kontainer mit der ID "${KontainerID}" nicht gefunden.`);
        return null;
    }

    // Überprüfen, ob ein SVG-Zahlenstrahl vorhanden ist
    const svg = kontainer.querySelector('svg');
    if (!svg) {
        console.error(`Es wurde kein SVG-Zahlenstrahl im Container "${KontainerID}" gefunden.`);
        return null;
    }

    // Aus den Datenattributen die notwendigen Werte abrufen
    const Min = parseFloat(kontainer.dataset.min);
    const Max = parseFloat(kontainer.dataset.max);
    const Skalierung = parseFloat(kontainer.dataset.skalierung);
    const paddingLeft = parseFloat(kontainer.dataset.paddingLeft);
    const paddingRight = parseFloat(kontainer.dataset.paddingRight);
    const lineY = parseFloat(kontainer.dataset.lineY);
    const canvasWidth = parseFloat(kontainer.dataset.canvasWidth);
    const decimalPlaces = parseInt(kontainer.dataset.decimalPlaces, 10);
    const pixelsPerUnit = parseFloat(kontainer.dataset.pixelsPerUnit);
    const FeinskalaEinheit = parseFloat(kontainer.dataset.feinskalaEinheit);

    // Überprüfen, ob die Zahl innerhalb des Bereichs liegt
    if (start < Min || start > Max) {
        console.error(`Die Startzahl ${start} liegt außerhalb des Zahlenstrahls (${Min} bis ${Max}).`);
        return null;
    }
    if (end < Min || end > Max) {
        console.error(`Die Endzahl ${end} liegt außerhalb des Zahlenstrahls (${Min} bis ${Max}).`);
        return null;
    }

    // Berechnung der x-Positionen der Start- und Endzahlen
    const xStart = paddingLeft + (start - Min) * pixelsPerUnit;
    const xEnd = paddingLeft + (end - Min) * pixelsPerUnit;

    // Definieren eines einzigartigen Marker-IDs
    markerCounter++;
    const markerId = `arrowhead-${markerCounter}`;

    // Dynamische Skalierung der Pfeilspitze basierend auf der Pfeillinienlänge
    const arrowLineLength = Math.abs(end - start) * pixelsPerUnit;
    let arrowHeadSize = 10; // Basisgröße des Pfeilkopfs

    // Berechnung der maximalen Pfeillinienlänge, die nicht von der Pfeilspitze überdeckt wird
    const minVisibleLine = arrowLineLength * 0.25; // Mindestens 25% der Linie sichtbar

    if (arrowLineLength < 4 * arrowHeadSize) { // Wenn die Linie weniger als 4 * Basisgröße ist
        arrowHeadSize = arrowLineLength / 4; // Skalieren der Pfeilspitze
        if (arrowHeadSize < 3) { // Mindestgröße der Pfeilspitze
            arrowHeadSize = 3;
        }
    }

    // Definieren des Pfeilkopfs
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = svg.querySelector('defs') || (() => {
        const newDefs = document.createElementNS(svgNS, 'defs');
        svg.appendChild(newDefs);
        return newDefs;
    })();

    const marker = document.createElementNS(svgNS, 'marker');
    marker.setAttribute('id', markerId);
    marker.setAttribute('markerWidth', arrowHeadSize);
    marker.setAttribute('markerHeight', arrowHeadSize / 2);
    marker.setAttribute('refX', arrowHeadSize);
    marker.setAttribute('refY', 0); // Spitze auf der Achse ausrichten
    marker.setAttribute('viewBox', `0 -${arrowHeadSize / 2} ${arrowHeadSize} ${arrowHeadSize}`); // ViewBox hinzufügen
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');

    const arrowPath = document.createElementNS(svgNS, 'path');
    arrowPath.setAttribute('d', `M0,-${arrowHeadSize / 2} L${arrowHeadSize},0 L0,${arrowHeadSize / 2} Z`);

    arrowPath.setAttribute('fill', farbe);
    marker.appendChild(arrowPath);
    defs.appendChild(marker);

    // Erstellen der Pfeillinie
    const lineElem = document.createElementNS(svgNS, 'line'); 
    lineElem.setAttribute('x1', 0); 
    lineElem.setAttribute('y1', lineY); 
    lineElem.setAttribute('x2', (end - start) * pixelsPerUnit);
    lineElem.setAttribute('y2', lineY);
    lineElem.setAttribute('stroke', farbe);
    lineElem.setAttribute('stroke-width', '2');
    lineElem.setAttribute('marker-end', `url(#${markerId})`);

    // Erstellen eines Gruppen-Elements
    const group = document.createElementNS(svgNS, 'g');

    // Zuweisen einer eindeutigen ID
    markCounter++;
    const markID = `mark-${markCounter}`;
    group.setAttribute('id', markID);

    // Optional: Bewegbarkeit als Klasse hinzufügen
    if (bewegbar) {
        group.classList.add('movable', 'arrow');
    } else {
        group.classList.add('arrow');
        group.style.pointerEvents = 'none'; // Fixierte pfeile ignorieren Mausereignisse
    }

    // Runden der Start- und Änderungswerte entsprechend decimalPlaces
    const gerundeterStart = parseFloat(start.toFixed(decimalPlaces));
    const gerundeterChange = parseFloat(change.toFixed(decimalPlaces));

    group.setAttribute('transform', `translate(${xStart},0)`);
    group.dataset.start = gerundeterStart;
    group.dataset.change = gerundeterChange;

    group.appendChild(lineElem);

    // Optional: Beschriftung der Veränderung
    if (sichtbar) {
        const midX = ((end - start) * pixelsPerUnit) / 2;
        const midY = lineY - 15; // Position über dem Pfeil

        // Bestimmen des Vorzeichens der Veränderung für die Beschriftung
        const sign = gerundeterChange >= 0 ? '+' : '';
        const labelText = `${sign}${gerundeterChange}`;

        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', farbe);
        text.style.fontSize = '14px';
        text.textContent = labelText;
        group.appendChild(text);
    }

    // Optional: Anzeige der Markierungs-ID als Tooltip
    group.setAttribute('title', `Markierung ID: ${markID}`);

    // Append the group to the SVG
    svg.appendChild(group);

    // Rückgabe der Markierungs-ID
    return markID;
}

/**
 * Funktion zum Starten des Dragging.
 * @param {MouseEvent | TouchEvent} evt - Das Maus- oder Touchereignis.
 */
function startDrag(evt) {
    let event = evt;
    if (evt.type.startsWith('touch')) {
        event = evt.touches[0];
    }

    const target = event.target.closest('g.movable');
    if (target) {
        selectedElement = target;
        selectedSVG = target.ownerSVGElement;
        const mousePos = getPointerPosition(event, selectedSVG);
        const transform = selectedElement.getAttribute('transform');
        const translate = parseTransform(transform);
        offsetX = mousePos.x - translate.x;

        if (evt.type.startsWith('touch')) {
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', endDrag);
        } else {
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', endDrag);
        }
        evt.preventDefault();
    }
}

/**
 * Funktion zum Beenden des Dragging.
 * @param {MouseEvent | TouchEvent} evt - Das Maus- oder Touchereignis.
 */
function endDrag(evt) {
    selectedElement = null;
    selectedSVG = null;
    if (evt.type.startsWith('touch')) {
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', endDrag);
    } else {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', endDrag);
    }
}

/**
 * Funktion zum Bewegen des Elements während des Dragging.
 * @param {MouseEvent | TouchEvent} evt - Das Maus- oder Touchereignis.
 */
function onDrag(evt) {
    evt.preventDefault(); // Verhindert das Scrollen auf Touch-Geräten

    let event = evt;
    if (evt.type.startsWith('touch')) {
        event = evt.touches[0];
    }

    if (selectedElement && selectedSVG) {
        const containerID = selectedSVG.parentElement.id;
        const container = document.getElementById(containerID);
        if (!container) return;

        const FeinskalaEinheit = parseFloat(container.dataset.feinskalaEinheit);
        const pixelsPerUnit = parseFloat(container.dataset.pixelsPerUnit);
        const paddingLeft = parseFloat(container.dataset.paddingLeft);
        const Min = parseFloat(container.dataset.min);
        const Max = parseFloat(container.dataset.max);
        const canvasWidth = parseFloat(container.dataset.canvasWidth);
        const decimalPlaces = parseInt(container.dataset.decimalPlaces, 10);

        const mousePos = getPointerPosition(event, selectedSVG);
        let newX = mousePos.x - offsetX;

        // Begrenzung auf den Zahlenstrahl
        const MinX = paddingLeft;
        const MaxX = canvasWidth - parseFloat(container.dataset.paddingRight);

        if (newX < MinX) newX = MinX;
        if (newX > MaxX) newX = MaxX;

        // Snap to grid
        const gridValue = Math.round((newX - paddingLeft) / (pixelsPerUnit * FeinskalaEinheit)) * FeinskalaEinheit;
        const snappedX = paddingLeft + gridValue * pixelsPerUnit;

        // Begrenzung nach dem Snapping
        let finalX = snappedX;
        if (finalX < MinX) finalX = MinX;
        if (finalX > MaxX) finalX = MaxX;

        // Aktualisieren der Transform-Eigenschaft
        selectedElement.setAttribute('transform', `translate(${finalX},0)`);

        // Überprüfen, ob es sich um ein Kreuz oder einen Pfeil handelt
        if (selectedElement.classList.contains('cross')) {
            const newValue = parseFloat((Min + gridValue).toFixed(decimalPlaces));
            selectedElement.dataset.value = newValue;

            const text = selectedElement.querySelector('text');
            if (text) {
                text.textContent = newValue.toFixed(decimalPlaces);
            }
        } else if (selectedElement.classList.contains('arrow')) {
            // Berechnung des neuen Startwerts
            const newStart = parseFloat((Min + gridValue).toFixed(decimalPlaces));
            selectedElement.dataset.start = newStart;

            // Update des Titel-Attributs
            const change = parseFloat(selectedElement.dataset.change).toFixed(decimalPlaces);
            selectedElement.setAttribute('title', `Markierung ID: ${selectedElement.id}, Start: ${newStart}, Änderung: ${change}`);

            // Aktualisieren der Beschriftung der Veränderung, falls vorhanden
            const text = selectedElement.querySelector('text');
            if (text) {
                const sign = parseFloat(change) >= 0 ? '+' : '';
                text.textContent = `${sign}${parseFloat(change)}`;
            }
        }
    }
}

/**
 * Hilfsfunktion zum Berechnen der Maus- oder Touchposition relativ zum SVG.
 * @param {MouseEvent | Touch} evt - Das Maus- oder Touchereignis.
 * @param {SVGSVGElement} svg - Das SVG-Element.
 * @returns {object} - Ein Objekt mit x und y Koordinaten.
 */
function getPointerPosition(evt, svg) {
    const CTM = svg.getScreenCTM();
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

// Event-Listener für Dragging starten (Mouse und Touch)
document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: false });

/**
 * Funktion zum Löschen einer Markierung anhand ihrer ID
 * @param {string} markID - Die eindeutige ID der Markierung (z.B. "mark-1")
 */
function loescheMarkierung(markID) {
    const mark = document.getElementById(markID);
    if (mark) {
        mark.parentNode.removeChild(mark);
        alert(`Markierung ${markID} wurde gelöscht.`);
    } else {
        alert(`Markierung mit ID ${markID} nicht gefunden.`);
    }
}

/**
 * Grundlegende Funktion zum Abrufen aller Markierungen in einem Container.
 * @param {string} containerID - Die ID des Containers.
 * @returns {Array} - Ein Array von Markierungsobjekten.
 */
function getMarkierungen(containerID) {
    const container = document.getElementById(containerID);
    if (!container) {
        console.error(`Kontainer mit der ID "${containerID}" nicht gefunden.`);
        return [];
    }

    const svg = container.querySelector('svg');
    if (!svg) {
        console.error(`Es wurde kein SVG-Zahlenstrahl im Container "${containerID}" gefunden.`);
        return [];
    }

    const markierungen = svg.querySelectorAll('g[id^="mark-"]');
    const markierungenArray = [];

    markierungen.forEach(mark => {
        const markID = mark.id;
        const classes = mark.classList;
        let typ = 'Unbekannt';
        if (classes.contains('cross')) typ = 'Kreuz';
        if (classes.contains('arrow')) typ = 'Pfeil';

        const transform = parseTransform(mark.getAttribute('transform'));
        const posX = transform.x;
        const posY = transform.y;

        // Farbe extrahieren
        let farbe = 'Unbekannt';
        if (typ === 'Kreuz') {
            const line1 = mark.querySelector('line:nth-child(1)');
            farbe = line1 ? line1.getAttribute('stroke') : 'Unbekannt';
        } else if (typ === 'Pfeil') {
            const line = mark.querySelector('line');
            farbe = line ? line.getAttribute('stroke') : 'Unbekannt';
        }

        // Weitere Daten je nach Typ sammeln
        let weitereDaten = {};
        if (typ === 'Kreuz') {
            const value = mark.dataset.value;
            weitereDaten = {
                value: parseFloat(value)
            };
        } else if (typ === 'Pfeil') {
            const start = mark.dataset.start;
            const change = mark.dataset.change;
            weitereDaten = {
                start: parseFloat(start),
                change: parseFloat(change)
            };
        }

        // Bewegbarkeit
        const bewegbar = classes.contains('movable');

        markierungenArray.push({
            id: markID,
            typ: typ,
            farbe: farbe,
            position: { x: posX, y: posY },
            bewegbar: bewegbar,
            ...weitereDaten
        });
    });

    return markierungenArray;
}

/**
 * Funktion zum Auflisten aller Markierungen in einem Container
 * @param {string} containerID - Die ID des Containers
 */
function listeMarkierungen(containerID) {
    const markierungen = getMarkierungen(containerID);
    if (markierungen.length === 0) {
        alert('Keine Markierungen im angegebenen Container gefunden.');
        return;
    }

    // Erstellen einer Tabelle zur Anzeige der Markierungen
    let tableHTML = `
        <table id="markierungenTabelle">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Typ</th>
                    <th>Startwert</th>
                    <th>Änderung</th>
                    <th>Farbe</th>
                    <th>Position (x)</th>
                    <th>Position (y)</th>
                    <th>Bewegbar</th>
                </tr>
            </thead>
            <tbody>
    `;

    markierungen.forEach(mark => {
        const { id, typ, farbe, position, bewegbar, value, start, change } = mark;

        tableHTML += `
            <tr>
                <td>${id}</td>
                <td>${typ}</td>
                <td>${typ === 'Pfeil' ? start : value}</td>
                <td>${typ === 'Pfeil' ? change : '—'}</td>
                <td style="background-color: ${farbe};">${farbe}</td>
                <td>${position.x.toFixed(2)}</td>
                <td>${position.y.toFixed(2)}</td>
                <td>${bewegbar ? 'Ja' : 'Nein'}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    // Anzeige der Tabelle im markierungenAnzeige-Bereich
    const markierungenAnzeige = document.getElementById('markierungenAnzeige');
    if (markierungenAnzeige) {
        markierungenAnzeige.innerHTML = tableHTML;
    } else {
        console.error('Bereich zur Anzeige der Markierungen (ID: markierungenAnzeige) nicht gefunden.');
    }
}



/**
 * Prüft, ob eine bestimmte Markierung vorhanden ist.
 * 
 * @param {string} containerID - Die ID des Container-Elements, das den Zahlenstrahl enthält.
 * @param {string} typ - Der Typ der Markierung ('cross' oder 'arrow').
 * @param {number} start - Der Startwert der Markierung.
 * @param {number} [end=null] - Der Endwert der Markierung (nur für 'arrow' erforderlich).
 * @returns {boolean} - Gibt true zurück, wenn die Markierung korrekt ist, sonst false.
 */
function pruefer(containerID, typ, start, end = null) {
    const markierungen = getMarkierungen(containerID);
    console.log(`Prüfe Markierung im Container "${containerID}" für Typ "${typ}" mit Startwert ${start} und Endwert ${end}.`);

    if (typ === 'cross') {
        // Filtere alle beweglichen 'Kreuz'-Markierungen
        const beweglicheCross = markierungen.filter(mark => mark.typ === 'Kreuz' && mark.bewegbar);
        console.log(`Gefundene bewegliche 'Kreuz'-Markierungen:`, beweglicheCross);

        // Suche nach einem 'Kreuz' an der korrekten Position
        const korrektesCross = beweglicheCross.find(mark => mark.value === start);
        if (korrektesCross) {
            console.log(`Passendes 'Kreuz' gefunden:`, korrektesCross);
            // Lösche das gefundene 'Kreuz'
            loescheMarkierung(korrektesCross.id);
            // Erstelle ein neues grünes, unbewegliches 'Kreuz' mit Zahlenanzeige
            markiereZahl(containerID, start, 'green', true, false);
            console.log(`Neues grünes, unbewegliches 'Kreuz' bei ${start} erstellt.`);
            return true;
        } else if (beweglicheCross.length > 0) {
            console.log(`Keine passenden 'Kreuze' gefunden, aber bewegliche 'Kreuze' existieren.`);
            // Erstelle rote, unbewegliche 'Kreuze' an den Positionen der beweglichen 'Kreuze' mit Zahlenanzeige
            beweglicheCross.forEach(mark => {
                markiereZahl(containerID, mark.value, 'red', true, false);
                console.log(`Rotes, unbewegliches 'Kreuz' bei ${mark.value} erstellt.`);
            });
            return false;
        } else {
            console.log(`Keine beweglichen 'Kreuze' vorhanden.`);
            return false;
        }
    } else if (typ === 'arrow') {
        if (end === null) {
            console.error(`Endwert für 'arrow'-Markierung nicht angegeben.`);
            return false;
        }

        // Filtere alle beweglichen 'Pfeil'-Markierungen
        const beweglicheArrow = markierungen.filter(mark => mark.typ === 'Pfeil' && mark.bewegbar);
        console.log(`Gefundene bewegliche 'Pfeil'-Markierungen:`, beweglicheArrow);

        // Suche nach einem 'Pfeil' mit passendem Start- und Endwert
        const korrekterPfeil = beweglicheArrow.find(mark => mark.start === start && mark.change === (end - start));


        if (korrekterPfeil) {
            console.log(`Passender 'Pfeil' gefunden:`, korrekterPfeil);
            // Lösche den gefundene 'Pfeil'
            
            // Erstelle einen neuen grünen, unbeweglichen 'Pfeil' mit Beschriftung
            if (end > start) {
                markierePfeil(containerID, start, '+',end-start, 'green', true, false);
            }else {
                markierePfeil(containerID, start, '-',start-end, 'green', true, false);
            }
            loescheMarkierung(korrekterPfeil.id);
          
            console.log(`Neuer grüner, unbeweglicher 'Pfeil' von ${start} nach ${end} erstellt.`);
            return true;
        } else if (beweglicheArrow.length > 0) {
            console.log(`Keine passenden 'Pfeile' gefunden, aber bewegliche 'Pfeile' existieren.`);
            // Erstelle rote, unbewegliche 'Pfeile' für alle beweglichen 'Pfeile' ohne Zahlenanzeige
            beweglicheArrow.forEach(mark => {
                markierePfeil(containerID, mark.start,'+', mark.change, 'red', false, false);
                console.log(`Roter, unbeweglicher 'Pfeil' von ${mark.start} nach ${mark.start + mark.change} erstellt.`);
            });
            return false;
        } else {
            console.log(`Keine beweglichen 'Pfeile' vorhanden.`);
            return false;
        }
    } else {
        console.error(`Unbekannter Typ: "${typ}".`);
        return false;
    }
}

/**
 * Erstellt einen zufälligen Zahlenstrahl innerhalb des angegebenen Containers.
 *
 * @param {string} KontainerID - Die ID des Container-Elements, das den Zahlenstrahl enthalten soll.
 */
function erstelleZufälligenZahlenstrahl(KontainerID) {
    // Schritt 1: Generiere eine zufällige Skalierung zwischen -3 und 3
    const skalierung = getRandomIntInclusive(-2, 3);
    console.log(`Skalierung: ${skalierung}`);
    
    // Schritt 2: Generiere eine zufällige ganze Zahl zwischen -10 und -1 für den Min-Multiplikator
    const zufaelligerMinMultiplikator = getRandomIntInclusive(-10, -1);
    
    // Berechne den Faktor basierend auf der Skalierung
    const faktor = Math.pow(10, skalierung);
    console.log(`Faktor basierend auf Skalierung (${skalierung}): ${faktor}`);
    
    // Berechne den Min-Wert
    let min = zufaelligerMinMultiplikator * faktor;
    // Rundung entsprechend der Skalierung (Anzahl der Dezimalstellen)
    min = parseFloat(min.toFixed(getDecimalPlaces(skalierung)));
    console.log(`Min-Wert: ${min}`);
    
    // Schritt 3: Generiere eine zufällige ganze Zahl zwischen 11 und 20 für den Max-Multiplikator
    const zufaelligerMaxMultiplikator = getRandomIntInclusive(1, 10);
    
    // Berechne den Max-Zuwachs
    const maxZuwachs = zufaelligerMaxMultiplikator * faktor;
    console.log(`Max-Zuwachs (11-20 * Faktor): ${maxZuwachs}`);
    
    // Berechne den Max-Wert
    let max = maxZuwachs;
    // Rundung entsprechend der Skalierung (Anzahl der Dezimalstellen)
    max = parseFloat(max.toFixed(getDecimalPlaces(skalierung)));
    console.log(`Max-Wert: ${max}`);
    
    // Schritt 4: Rufe die Zeichnungsfunktion auf
    zeichneZahlenstrahl(min, max, skalierung, KontainerID, 'black');
    
    /**
     * Generiert eine zufällige ganze Zahl zwischen min und max (inklusive).
     *
     * @param {number} min - Der minimale Wert.
     * @param {number} max - Der maximale Wert.
     * @returns {number} - Eine zufällige ganze Zahl zwischen min und max.
     */
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Bestimmt die Anzahl der Dezimalstellen basierend auf der Skalierung.
     *
     * @param {number} skalierung - Die Skalierung des Zahlenstrahls.
     * @returns {number} - Die Anzahl der Dezimalstellen.
     */
    function getDecimalPlaces(skalierung) {
        // Wenn skalierung -1 negativ ist, gibt es Dezimalstellen
        // Anzahl der Dezimalstellen entspricht dem Absolutwert von (skalierung - 1)
        const dezimalstellen = Math.max(0, -(skalierung - 1));
        return dezimalstellen;
    }
}
/**
 * Generiert eine zufällige Zahl, die an einer zufälligen Position auf dem Zahlenstrahl liegt.
 * Berücksichtigt die Skalierung als Genauigkeit.
 *
 * @param {string} KontainerID - Die ID des Containers, der den Zahlenstrahl enthält.
 * @returns {number|null} - Die generierte Zufallszahl, die auf dem Zahlenstrahl liegt, oder null bei Fehler.
 */
function generiereZufallszahlAufZahlenstrahl(KontainerID) {
    const container = document.getElementById(KontainerID);
    if (!container) {
         
        console.error(`Container mit ID "${KontainerID}" nicht gefunden.`);
        return null;
    }

    // Extrahiere die Datenattribute
    const min = parseFloat(container.dataset.min);
    
    const max = parseFloat(container.dataset.max);
    
    const skalierung = parseInt(container.dataset.skalierung, 10);
   

    if (isNaN(min) || isNaN(max) || isNaN(skalierung)) {
        console.error(`Datenattribute 'min', 'max' oder 'skalierung' sind nicht korrekt gesetzt.`,min,max,container.dataset.scalierung);
        return null;
    }

    console.log(`Min: ${min}, Max: ${max}, Skalierung: ${skalierung}`);

    // Bestimme die Schrittgröße basierend auf der Skalierung
    const step = Math.pow(10, skalierung - 1);
    console.log(`Schrittgröße basierend auf Skalierung (${skalierung}): ${step}`);

    // Berechne die Anzahl der Schritte
    const numberOfSteps = Math.floor((max - min) / step);
    console.log(`Anzahl der Schritte: ${numberOfSteps}`);

    if (numberOfSteps <= 0) {
        console.error(`Ungültige Schrittzahl (${numberOfSteps}). Überprüfen Sie 'min', 'max' und 'skalierung'.`);
        return null;
    }

    // Generiere eine zufällige Schrittzahl
    const randomStep = getRandomIntInclusive(0, numberOfSteps);
    console.log(`Zufällige Schrittzahl: ${randomStep}`);

    // Berechne die Zufallszahl
    let zufallsZahl = min + (randomStep * step);
    console.log(`Ungerundete Zufallszahl: ${zufallsZahl}`);

    // Bestimme die Anzahl der Dezimalstellen
    const decimalPlaces = getDecimalPlaces(skalierung);
    zufallsZahl = parseFloat(zufallsZahl.toFixed(decimalPlaces));
    console.log(`Gerundete Zufallszahl: ${zufallsZahl}`);

    return zufallsZahl;

    /**
     * Generiert eine zufällige ganze Zahl zwischen min und max (inklusive).
     *
     * @param {number} min - Der minimale Wert.
     * @param {number} max - Der maximale Wert.
     * @returns {number} - Eine zufällige ganze Zahl zwischen min und max.
     */
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Bestimmt die Anzahl der Dezimalstellen basierend auf der Skalierung.
     *
     * @param {number} skalierung - Die Skalierung des Zahlenstrahls.
     * @returns {number} - Die Anzahl der Dezimalstellen.
     */
    function getDecimalPlaces(skalierung) {
        // Anzahl der Dezimalstellen entspricht dem Absolutwert von (skalierung - 1)
        const dezimalstellen = Math.max(0, -(skalierung - 1));
        return dezimalstellen;
    }
}


// Beispielaufruf der Funktion
erstelleZufälligenZahlenstrahl('kontainer')
const zufallsZahl = generiereZufallszahlAufZahlenstrahl('kontainer');
if (zufallsZahl !== null) {
    console.log(`Generierte Zufallszahl: ${zufallsZahl}`);
    // Optional: Markieren Sie die Zufallszahl auf dem Zahlenstrahl
    markiereZahl('kontainer', zufallsZahl, 'blue', true, true); // Beispiel: Markiert die Zahl in Blau und beweglich
} else {
    console.log('Die Zufallszahl konnte nicht generiert werden.');
}
