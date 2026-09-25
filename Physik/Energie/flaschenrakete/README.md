# Wasserrakete – Edulo-Widget

**Upload: `widget.html`** enthält alle Ressourcen und die Speicheranbindung. Kein weiterer Download ist zur Laufzeit erforderlich.

## Bedienung

Drei getrennte Ansichten mit nummeriertem Kopf und einheitlichen Navigationsfeldern:

1. **Simulation der Wasserrakete** mit Pumpe, Flug und optionalen Energiequadraten.
2. **Lückentext**, gegliedert in Nahrung, Pumpen, Start, Aufstieg und Fallen.
3. **Energieflussdiagramm**, zuerst Hauptweg, anschließend zusätzliche Energieabgaben.

Die Navigation zeigt getrennte Punktestände für Lückentext und Diagramm. Grün und Gelb zählen jeweils als erworbener Punkt. Die Höchstwerte werden aus den tatsächlichen Kriterien abgeleitet. Eingaben und Hilfestände bleiben beim Seitenwechsel erhalten.

Die sechs Textlücken haben jeweils 4, 3, 3, 3, 3 und 4 Hilfestufen. Das Fragezeichen bleibt direkt bei der Lücke. Die letzte Stufe entscheidet nicht für die Lernenden. Hinweise schließen per Schaltfläche, Escape oder Außenklick und geben den Fokus zurück.

Beim Aufbau des Hauptwegs sind nur die Wandler und sechs gleich hohe Hauptpfeile sichtbar. Erst nach erfolgreicher Prüfung erscheinen die sechs Nebenpfeile und ihre offenen Ziele; die vorhandenen Hauptpfeile werden im selben Diagramm schmaler. Position, DOM-Identität und Beschriftung des Hauptwegs bleiben erhalten. Unbelegte Formen sind neutral. Zugeordnete Energieformen verwenden gemeinsame Farben mit der Simulation; Text bleibt zusätzlich erhalten. Die Palette bietet Muskel, Luftpumpe und Flasche. Frühere Entwürfe mit Solarzelle oder Elektromotor bleiben lesbar, die beiden Ablenker werden nicht mehr angeboten. Wasser und Wärme am Start stammen sichtbar vom selben Flaschenplatz.

## Simulation und Legende

Fünf Pumphübe starten die Rakete. Neustart setzt nur das Experiment zurück. Die fünf Hauptzeichen durchlaufen Muskel, Pumpe, Schlauch, Flasche und Flug.

Bei eingeblendeten Energiequadraten ist zusätzlich **Wirkungsgrade einblenden** verfügbar, zunächst ausgeschaltet. Aktiviert werden kleine thermische Anteile an die Umgebung abgegeben; Haupt- und Nebenquadrate stellen die Energiemengen über ihre **Flächen** dar. Die Anteile sind didaktische Modellwerte und keine Messungen. Die Zeichen driften langsam auf unterschiedlichen, leicht wellenförmigen Bahnen vom Entstehungsort in die Umgebung. Sie dürfen den sichtbaren Raum verlassen; ihre Energiemenge bleibt bilanziert. Es gibt keinen Sammelpunkt. Für erkennbare Größenänderungen bei Projektion beträgt die Ausgangsseite 28 SVG-Pixel und die modellhafte Abgabe je Umwandlung 20 Prozent des jeweiligen Restes (keine reale Effizienzaussage). Damit schrumpft die Hauptseite kumulativ ungefähr von 28 über 25, 22,4, 20 und 17,9 auf 16 Pixel. Ausgeschaltet bleiben alle Hauptflächen konstant, ohne Abspaltungen; die vollständige thermische Schlussenergie bewegt sich nach dem Aufprall weiterhin in die Umgebung.

Das Wasserzeichen wird am Flaschenausgang kinetisch/grün. Nach dem Auftreffen wandert seine thermische Energie in die Umgebung. Beim Auftreffen der Flasche wandern auch deren thermische Hauptzeichen aus der Flasche heraus.

Die vier Legendeneinträge stehen untereinander. Hinter jedem Eintrag schaltet ein eigenes Auge ausschließlich dessen Namen; die farbigen E-Symbole bleiben sichtbar. Alle Namen sind anfangs verborgen. Die vier unabhängigen Zustände werden gespeichert. Ein älterer gemeinsamer Wahrheitswert wird beim Laden auf alle vier Namen übertragen; fehlende Einstellungen bedeuten weiterhin verborgen. Energieanzeige und Wirkungsgradoption bleiben getrennt gespeichert.

## Quellen und Build

- `widget.quelle.html`: drei Ansichten und Navigation.
- `app.js` / `app.css`: Anbindung, Teilpunktestände und Layout.
- `learning.js` / `learning.css`: Text, Hinweise und Diagramm.
- `simulation.js`: Animation, Energiezeichen und Legende.

```text
node Physik/Energie/flaschenrakete/build.cjs
node Physik/Energie/flaschenrakete/tests/text.test.cjs
node Physik/Energie/flaschenrakete/tests/hint-copy.test.cjs
node Physik/Energie/flaschenrakete/tests/hints.test.cjs
node Physik/Energie/flaschenrakete/tests/diagram-labels.test.cjs
node Physik/Energie/flaschenrakete/tests/pages.test.cjs
node Physik/Energie/flaschenrakete/tests/embedded.test.cjs
node Physik/Energie/flaschenrakete/tests/simulation-energy.test.cjs
node Physik/Energie/flaschenrakete/tests/browser.test.cjs
node Physik/Energie/flaschenrakete/tests/legend.test.cjs
```

Vorschau: `node Physik/Energie/flaschenrakete/tests/preview.cjs`, anschließend `http://127.0.0.1:8776/`.

## Edulo und Lernstände

Widgetkennung `flaschenrakete`, äußere Speicherhülle Version 1, inneres Lernschema Version 3. E1 enthält den Zustand; die 20 bestehenden E2-Felder bleiben erhalten. 18 aktive Kriterien bilden Text und Diagramm ab; historische Punkte der alten Fassung bleiben separat geschützt. Beim Laden wird nichts zurückgeschrieben. Fehlende Hostfelder führen nicht zu einem stillen Ersatz durch lokalen Speicher.

Alte Wandlernamen und Hilfestände werden kompatibel übernommen. Die alte doppelte Hauptkettenaufgabe ist archiviert und wird nicht erneut verlangt.

## Dokumentierte Layoutbasis und Prüfgrenzen

`tools/edulo/START.md` und `reference/layout.md` dokumentieren einen realen Nutzertest: Viewport 1024 × 768 CSS-px, Widgetbreite 920 px, Inhaltswrapper etwa 974 × 728 px bei Oberkante 40 px nach Footer-Ausblendung. Die Umsetzung misst den tatsächlich verbleibenden Platz und reagiert auf Containeränderungen. Diese Maße sind ein belegter Testfall, keine universelle Edulo-Garantie.

Lokale Prüfungen verwenden Edge/Playwright mit emuliertem Touch und simuliertem Edulo-Parent. Echte Tablet-Bedienung und Bearbeiten/Wiederöffnen auf dem Edulo-Server bleiben separat zu prüfen. Der aktuelle Prüfstand steht in `tests/QA.md`. Keine Veröffentlichung oder Git-Übertragung.
