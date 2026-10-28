# Drei Bruchübungen

Uploadfähige, eigenständige Dateien:

- `../kuerzen/widget.html`: einen möglichst großen gemeinsamen Teiler wählen, kürzen und entscheiden, ob weiter gekürzt werden kann; bei Bedarf mehrere Runden.
- `../erweitern/widget.html`: exakten Faktor zum Zielnenner finden, Zähler und Nenner damit erweitern.
- `../addieren-subtrahieren/widget.html`: einen gemeinsamen Nenner wählen, Brüche durch Kürzen/Erweitern umschreiben, Zähler verrechnen und Ergebnis vollständig kürzen.

Jede App enthält zwei bewusst wählbare Stufen. Kürzen enthält 53 Aufgaben in Stufe 1 (Nenner bis 48) und 66 in Stufe 2 (Nenner bis 96); die anderen Apps enthalten jeweils 32 Aufgaben pro Stufe. Beim Kürzen werden vier von fünf Aufgabenwahlen bevorzugt aus den noch verfügbaren Aufgaben mit größtem gemeinsamen Teiler 4, 6, 8, 9, 10 oder 12 gewählt. Dabei werden die bisher am wenigsten bearbeiteten Teilergruppen bevorzugt. Die ursprünglichen 32 Aufgaben und IDs je Stufe bleiben unverändert erhalten. Viele Aufgaben erlauben sinnvolle mehrstufige Wege, z. B. `84/96 : 4 → 21/24 : 3 → 7/8`. Größere Bilder werden bei passender Teilung in zwei oder drei Spalten als ein Ganzes dargestellt; die Spaltengrenzen unterbrechen keine zusammengefassten Gruppen.

Die Stufe lässt sich nach Abschluss einer Aufgabe wechseln. Bei Addition/Subtraktion enthält jede Stufe gleich viele Aufgaben beider Rechenarten; negative Ergebnisse kommen nicht vor, Null und Ergebnisse über einem Ganzen schon. Vollständig gekürzte ganze Ergebnisse werden als Bruch mit Nenner 1 eingegeben, z. B. 0/1. Die Aufgabenstellung verlangt ausdrücklich einen Bruch. Nach Ausschöpfen einer Stufe werden deren Aufgaben wiederholt; unmittelbar dieselbe Aufgabe wird vermieden.

Die Gestaltung folgt den vorhandenen Apps „Brüche verstehen“, „Anteile berechnen“, „Anteile berechnen 2“ und „Das Ganze bestimmen“: Petrol/Mint, große Brüche, weiße Karten, jeweils ein Lernschritt, Tipps und Historie. Die aktuellen Kit-Regeln haben Vorrang: keine eigene Seitenüberschrift, volle Breite, natürliche Höhe.

SVG-Streifen zeigen jeweils ein gleich großes Ganzes. Beim Kürzen stehen Ausgangsbruch und Ergebnis nebeneinander; unter dem Gleichheitszeichen wird die Kürzungszahl eingetragen. Unter jedem Bruch steht sein senkrechtes Bild. Jeder gemeinsame Teiler größer als 1 ist erlaubt. Erst nach der ersten Ergebnisprüfung erscheint auch rechts die korrekte Gruppierung nach dem gewählten Teiler, selbst bei einem falschen Ergebnis. Falsche Zähler/Nenner werden rot markiert, bleiben korrigierbar und führen spätestens beim Abschluss zu Gelb. Nach jedem richtigen Bruch entscheiden die Lernenden mit „Ja/Nein“, ob weiter gekürzt werden kann. „Ja“ startet bei Bedarf die nächste Kürzungsrunde, „Nein“ beendet nur einen vollständig gekürzten Bruch. Die bisherige Vergleichsfrage entfällt. Ohne Fehler oder Tipp ist auch ein Weg über mehrere kleinere Teiler grün.

Beim Erweitern steht der Faktor über dem Gleichheitszeichen. Er muss genau zum vorgegebenen Zielnenner passen. Danach wird nur der neue Zähler eingetragen; der vorgegebene Zielnenner bleibt fest sichtbar. Jeder Bruch hat sein eigenes senkrechtes Bild darunter. Das rechte Bild mit der feineren Unterteilung erscheint erst nach der ersten Ergebnisprüfung, auch bei falschen Werten. Der exakt erweiterte Bruch schließt die Aufgabe sofort ab; eine zusätzliche Vergleichsfrage gibt es nicht.

Beim Rechnen stehen die Ausgangsbrüche und die gleichnamigen Brüche mit Bildern unmittelbar darunter nebeneinander. Nach der Wahl des gemeinsamen Nenners erscheinen die Zählerfelder direkt über diesem Nenner. Die Bilder der umgeschriebenen Brüche erscheinen erst nach der ersten Zählerprüfung, auch bei einem Fehler. Der kleinste mögliche Nenner wird aus den vollständig gekürzten Ausgangsbrüchen bestimmt: Für `1/3 − 2/6` ist auch `3` möglich. Jeder passende gemeinsame Nenner ist erlaubt. Bei einem größeren öffnet sich die gewünschte Warnung mit den Optionen „Weiter mit deinem Nenner“ und „Kleineren gemeinsamen Nenner suchen“. Die Warnung und eine gültige größere Wahl beeinflussen die Punktefarbe nicht. Eine noch offene Entscheidung bleibt beim Wiederöffnen erhalten.

Die farbige Fläche bleibt beim Umrechnen an derselben Position und behält dieselbe Form. Der gemeinsame Achsenplan wird aus dem ggT der beiden Ausgangsnenner abgeleitet; gemeinsame Faktoren erhalten dadurch dieselbe Richtung. Der vollständig gekürzte Bruch ist der Farbanker. Verfeinerte Zellen übernehmen die Farbe ihrer jeweiligen Ankerzelle, statt die ersten neuen Zellen erneut zu füllen. Beide umgerechneten Brüche nutzen dasselbe Raster. Beispiel `1/4 + 7/12`: `1/4` hat ein 2×2-Raster mit gefärbtem oberen linken Viertel; `3/12` hat ein 2×6-Raster mit genau denselben gefärbten Flächen (drei obere linke Zellen). Auch `7/12` bleibt vor und nach dem Umschreiben unverändert. Bei sehr großen Nennern wird dieselbe Ankerfläche durch höchstens zwei farbige HTML-Rechtecke statt durch sehr viele Einzelzellen dargestellt.

Zusätzlicher räumlicher Test: `node Mathe/Bruchrechnung/werkstatt/visuals.geometry.test.cjs` vergleicht die normalisierten Farbmasken aller Rechenaufgaben bei minimalen, größeren und sehr großen Nennern. Die aktuelle Kopierdatei heißt zusätzlich `addieren-subtrahieren/Edulo-Code-2026-10-28-Flaechentreu.txt`; unten steht „HTML-Gitter · Fläche erhalten“.

Die Arithmetik für frei gewählte Nenner verwendet BigInt; gespeicherte Zahlen bleiben Zeichenketten. Nenner-Eingaben erlauben bis zu 120 Zeichen, Ergebnisfelder bis zu 240. Diagramme mit mehr als 96 Teilen stellen die farbige Fläche proportional dar und kennzeichnen die vereinfachte Teilung, ohne jeden Trennstrich zu erzeugen. Sehr lange angezeigte Zahlen können innerhalb ihres Zahlenfeldes horizontal gescrollt werden. Auch Ergebnisse über einem Ganzen werden mit gleich breiten Ganzen dargestellt.

Die Eingaben bleiben als Originaltexte erhalten. Jede Prüfung und jede Tippnutzung wird gespeichert; abgeschlossene Schritte bleiben lesbar. Ein Punkt je abgeschlossener Aufgabe bis 20: grün ohne Fehler/Tipp, gelb nach Fehler/Tipp. Weiterüben bleibt möglich. Allgemeine Erklärung zählt nicht als aufgabenbezogene Hilfe.

## Quellen und Build

Die Apps wurden mit `tools/edulo/new-widget.cjs` angelegt. Gemeinsame Grundlagen sind `domain.js`, `visuals.js` und `style.css`. Die aktuellen Apps verwenden eigene Quellen: `reduce-domain.js`, `reduce-engine.js`, `reduce.css`, `reduce-template.html`; `expand-engine.js`, `expand.css`, `expand-template.html`; und `operate-domain.js`, `operate-engine.js`, `operate.css`, `operate-template.html`. `FractionDomain.steps` enthält weiterhin den alten Version-1-Vertrag zur Zustandsmigration. `engine.js` und `template.html` sind frühere Referenzquellen und werden nicht mehr eingebunden. Änderungen an den aktuellen Spezialquellen vornehmen, dann im Repository-Hauptordner:

```powershell
node Mathe/Bruchrechnung/werkstatt/build.cjs
# Nur die Kürzen-App neu bauen:
node Mathe/Bruchrechnung/werkstatt/build.cjs kuerzen
node Mathe/Bruchrechnung/werkstatt/build.cjs erweitern
node Mathe/Bruchrechnung/werkstatt/build.cjs addieren-subtrahieren
```

Der Build erzeugt pro App `app.js`, `app.css`, `widget.quelle.html` und über den offiziellen Edulo-Build `widget.html`. Auch der Standardbuild funktioniert für die so erzeugten einzelnen Quellordner; gemeinsame Änderungen davor mit diesem Build verteilen. Keine externen Laufzeitabhängigkeiten, Grafiken oder Schriften.

## Edulo

Je App die gesamte `widget.html` in „HTML und Dateien“ einsetzen. E1: Textfeld für den vollständigen Zustand. E2: 20 unabhängige Cloze-Felder mit Lösung `1`, je ein Punkt. Technische Felder und die Edulo-Fußleiste blendet die Kit-Bridge im Lernmodus aus. Editor-Vorschauen schreiben keine Lernstände. Standalone wird im Browser gespeichert; jede App besitzt eine eigene Speicherkennung. Fehlerhafte/fremde Speicherstände werden nicht durch einen leeren Stand ersetzt.

Alle drei Apps verwenden Zustandsschema 2 unter denselben Widget-IDs. Version-1-Lernstände werden streng validiert und übernommen: bestehende Punktefarben, Aufgabenhistorie und Originalversuche bleiben erhalten; beim Kürzen werden alte Versuche in `legacyAttempts` abgelegt, beim Erweitern bleiben sie in `attempts`. Rechnen bewahrt alte Versuche zusätzlich als `legacyAttempts`-Präfix und prüft diese nach den damaligen Regeln; neue Prüfungen folgen der freien Nennerwahl. Ein damals bereits bestätigter Nenner wird ohne erneute Warnung übernommen. Laufende Aufgaben setzen mit den bereits bestätigten Zahlen fort. Beim Erweitern muss ein alter, bereits richtig eingegebener Bruch vor der früheren Vergleichsfrage einmal bestätigt werden, damit die Aufgabe abgeschlossen wird. Laden schreibt und bewertet keine Punkte neu.

## Prüfung

```powershell
node --test Mathe/Bruchrechnung/werkstatt/domain.test.cjs
node --test Mathe/Bruchrechnung/werkstatt/reduce-domain.test.cjs
node --test Mathe/Bruchrechnung/werkstatt/operate-domain.test.cjs
node Mathe/Bruchrechnung/werkstatt/browser.test.cjs
# Einzelne Browser-Suiten optional separat:
node Mathe/Bruchrechnung/werkstatt/reduce.browser.test.cjs
node Mathe/Bruchrechnung/werkstatt/expand.browser.test.cjs
node Mathe/Bruchrechnung/werkstatt/operate.browser.test.cjs
```

Browserprüfung mit Playwright und installiertem Edge, optional `PLAYWRIGHT_MODULE`/`BROWSER_CHANNEL`. Die Suiten zusammen prüfen die drei Lernabläufe, Originaleingaben und Wiederöffnung, Fehler-/Hilfefarben, Historie, Stufen, mathematische Randfälle und Seitenbreiten 390/920/1600 px. Kürzen prüft zusätzlich Mehrfachrunden und Tastaturwahl. Kürzen/Erweitern prüfen verzögerte Ergebnisbilder, V1-Migration und die Ausrichtung von Gleichheitszeichen/Bruchstrichen; Erweitern zusätzlich die Position des Faktors oberhalb des Gleichheitszeichens. Rechnen prüft kleinere und beliebige passende Nenner, beide Dialogentscheidungen samt Wiederöffnung, eingebettete Zählerfelder, große Zahlen und V1-Migration. Screenshots in `qa/`. Das sind lokale Standalone-Browsertests, kein Nachweis für einen echten Edulo-Upload oder Tablet-Test; Einbetten, Bearbeiten und Wiederöffnen in der echten Edulo-Umgebung bleibt offen.

## Kompakte Edulo-Ansicht

Die vorherige SVG-Datenbildfassung zeigte im echten Edulo-Nutzerscreenshot kaputte Bildsymbole. Deshalb verwendet `visuals.js` jetzt das bewährte HTML/CSS-Grid-Prinzip aus `Brueche verstehen.html` (dort `renderSquares`, `.square` und `.piece`). Die neuen Modelle bestehen aus normalen `div`-/`span`-Elementen mit gleich großen Rasterzellen, petrolfarbener Markierung, weißer Restfläche und dunklen Rahmen. Gruppierungslinien bleiben beim Kürzen sichtbar. Es gibt keine SVGs, `img`-Elemente, Daten-URLs, Canvas-Zeichnungen oder externen Bilddateien im Aufgabenteil. Sehr große Nenner behalten eine proportional gefärbte HTML-Fläche mit dem Hinweis auf die vereinfachte Teilung.

Der aktuelle Lernschritt bleibt im Vordergrund. Frühere Kürzungen und Rechenschritte sind eingeklappt weiter lesbar. Auf schmalen Bildschirmen lassen sich nach dem Einblenden der umgerechneten Brüche die bereits gezeigten Ausgangsbilder zusätzlich aufklappen. Fragen und Aktionen stehen dicht beim Rechenschritt; die Buttons bleiben mindestens 44 px hoch. Die Seite wächst natürlich, ohne feste Root-Höhe, ohne `vh` und ohne eigenen vertikalen Scrollcontainer.

Zusätzliche Prüfung:

```powershell
node Mathe/Bruchrechnung/werkstatt/layout.edulo.test.cjs
```

Lokal geprüft: 920×650, 1280×720 und 390×740 px. Zusätzlich wurden die dokumentierten historischen Edulo-Maße nachgebildet: Viewport 1024×768, Wrapper 974×728 bei y=40, Widgetbreite 100 Prozent. Die vollständigen Widgets werden mit der vorhandenen jQuery 2.1.1 aus dem Repository eingefügt. Der Test verbietet das Laden aller Bilder mittels CSP `img-src 'none'` und prüft trotzdem sichtbare Rasterflächen, berechnete Hintergrundfarben, sichtbare Rahmen und gleich große Zellen. Der Nutzerfall 48/60 hat exakt 60 Zellen, davon 48 gefärbt. Gleichzeitig sichtbare aktuelle Fragen, Eingaben und Buttons sowie keine vertikalen App-Scrollcontainer sind ebenfalls geprüft. In diesen Prüfszenarien liegen alle aktiven Aufgabenkarten innerhalb des Viewports. Aufgeklappte Zusatzinformationen dürfen die natürliche Seitenhöhe erweitern.

Das ist ein lokaler Einbettungs- und Layoutnachweis, kein bestätigter erneuter Upload der Gitterfassung in die echte Edulo-App. Die aktuellen vollständigen Upload-Codes stehen in den drei `Edulo-Code.txt`-Dateien sowie in den eindeutig benannten `Edulo-Code-2026-10-28-Gitter.txt`-Dateien. Beide sind identisch mit der jeweiligen `widget.html`. Die neue Fassung zeigt unten „Stand 28.10.2026 · HTML-Gitter“.
