# Aktueller Prüfbericht · Flaschenrakete

## Aktuelle UI

Drei getrennte Ansichten: Experiment, Lückentext, Energieflussdiagramm. Der obere Überschriftenblock und der separate „Hinweis zum Pumpen“ sind entfernt. Der abgestimmte Lückentext ist unverändert in fünf Phasen gegliedert. Alle sechs Dropdowns und ihre individuellen Hilfestände bleiben erhalten; Fragezeichen und Dropdown bleiben auch auf schmalen Ansichten zusammen.

Alle sechs Nebenverbindungen und ihre Zielkästchen sind zunächst verborgen. Die Hauptpfeile haben einheitlich volle Höhe. Erst die erfolgreiche Prüfung des Hauptwegs blendet die Nebenverbindungen ein und verringert die Höhe derselben Hauptpfeile an unveränderter Position. Sie haben zunächst eine gemeinsame neutrale Farbe und keine Lösungsbeschriftung. „+ Umgebung“ und „+ Wasser“ bleiben offen. Die beiden Startabzweige entspringen demselben Flaschenplatz. Erst richtige Antworten ergänzen Energiebezeichnung und Farbe; nach dem Hauptweg werden die Nebenplätze bearbeitbar.

## Belegte Layoutbasis

`tools/edulo/START.md`, `reference/layout.md` und `reference/evidence.md` dokumentieren einen realen Nutzertest: 1024 × 768 CSS-px Viewport, 920 px Widgetbreite, Wrapper etwa 974 × 728 px nach Footer-Ausblendung, Oberkante 40 px. Lokale Tests stellen diese Geometrie nach, zusätzlich einen verkleinerten 390 × 360 px Container sowie schmale Ansichten. Das ist keine neue Live-Edulo-Prüfung.

## Prüfungen

Bestanden: `hint-copy.test.cjs`, `text.test.cjs`, `hints.test.cjs`, `diagram-labels.test.cjs`, `pages.test.cjs`, `browser.test.cjs`, `embedded.test.cjs`, `simulation-energy.test.cjs` und `legend.test.cjs`. Geprüft wurden Text/Lücken, gestufte Hilfen, unabhängige Punktestände, Navigation, Speicherung und Migration, E1/E2, Drag-and-drop sowie Simulation. Nach der letzten Layoutkorrektur wurden Legende, Energiebilanz und Seitenprüfung erneut erfolgreich ausgeführt.

## Simulation und Legende

Die anschließend ausdrücklich freigegebene Weiterarbeit ist abgeschlossen. Das Wasserpaket wechselt beim tatsächlichen Austritt aus der bewegten Düse von thermisch zu kinetisch/grün. Die optionale Wirkungsgraddarstellung teilt modellhafte thermische Abgaben ab; Quadratflächen entsprechen den Energiemengen. Die gesamte modellierte Energie bleibt bei fünf Einheiten, auch nach Umschalten, Neustart und erneutem Flug. Nach Bodenaufprall bewegen sich die thermischen Hauptpakete in die Umgebung. Es werden keine gemessenen Wirkungsgrade behauptet.

Legendennamen sind standardmäßig verborgen und über vier unabhängige Augen hinter den untereinander angeordneten Einträgen einblendbar. Der vollständige Flug mit eingeblendeten Namen wurde bei 920, 701, 610 und 390 px ohne Überdeckung der Flasche geprüft. Die Wärmezeichen bewegen sich kontinuierlich vom jeweiligen Entstehungsort auf verstreuten Bahnen und verlassen später den sichtbaren Raum ohne Änderung der bilanzierten Energie. Die Legende bleibt frei. Vergrößerte Beschriftungen und Endzustand wurden zusätzlich visuell geprüft. Screenshots liegen in `tests/artifacts/`, unter anderem `simulation-end-labels-920.png`, `pages-home-energy-edulo.png`, `pages-cloze-start-edulo.png` und `pages-diagram-start-edulo.png`.

## Grenzen

Lokaler Edge mit emulierter Touch-Bedienung und simuliertem Edulo-Parent. Physisches Tablet sowie echtes Edulo-Bearbeiten/Wiederöffnen bleiben offen. Kein Push oder Publish.

## Nachprüfung: einzelne Augen und erkennbare Wärmeabgaben

Unabhängige Namensschalter einschließlich gemischtem Restore und Migration des alten gemeinsamen Wahrheitswerts geprüft. Hauptquadrate: 28 Pixel Ausgangsseite, flächenproportionale kumulative Verkleinerung mit ausdrücklich didaktischen Abgaben von jeweils 20 Prozent. Rote Abgabequadrate enthalten ein passend skaliertes E ohne übergroßen weißen Schriftumriss. Wirkungsgrade AUS behält alle fünf Ausgangsflächen und erzeugt keine Abspaltungen. `heat-dispersion.test.cjs` prüft die ruhigen stetigen Bahnen, verteilte Positionen und erhaltene Energie außerhalb des Bildes. Bildfolge in der nachgestellten Zielgeometrie: `heat-dispersion-6400.png`, `-8000.png`, `-9750.png`, `-11000.png`, `-15000.png`.
