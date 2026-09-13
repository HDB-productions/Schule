# DynaMot: abschließende Bedienprüfung, 12.09.2026

Dieser Stand ergänzt und ersetzt die Bedienangaben des früheren Integrationsprotokolls. Auslieferung: `../dynamot-labor.html`, vollständig lokal gebündelt. Kein Upload oder Push durchgeführt.

## Ergebnis

- Geräte und Zubehör öffnen ihre Einstellungen direkt am Tisch. Kurbeltempo, Antrieb, Gewichtsmasse, Lampentyp, Verschieben und Entfernen funktionieren ohne separate Geräteliste. Eigenschaftsmarker weichen Anschlussbuchsen aus.
- Kabel werden beim Antippen ausgewählt und erst mit der ausdrücklichen Entfernen-Schaltfläche gelöscht. Abwahl, Abbruch einer begonnenen Verbindung und Wiederherstellung nach Neuladen sind geprüft.
- Ein Start/Pause-Schalter im Tisch. Aufbau zurücksetzen erhält Aufgaben und Punkte; Rückgängig stellt Geräte und Kabel innerhalb der laufenden Sitzung wieder her.
- Lampenhelligkeit folgt der elektrischen Leistung. Langsames/schnelles Kurbeln, unverbundene Lampe und Überbrückung geprüft; Bildschirmbilder zeigen den sichtbaren Unterschied.
- Elektronenmarkierungen folgen den tatsächlichen Zweigströmen entgegen der technischen Stromrichtung. Umkehr, stromlose Zweige, Pause und Überbrückung geprüft. Das Netz berücksichtigt 0,05 Ohm je Kabel.
- Neue Reihenfolge: Licht durch Kurbeln, fallendes Gewicht, gekoppelte DynaMots, Gewicht heben. Alte vollständige, halbfertige und noch unbeantwortete Aufgabenstände werden über stabile IDs zugeordnet; weiterhin 20 Punkte.
- Integrierte Diagramme mit echten Chromium-Touchereignissen aufgebaut, platzierte Wandler vertauscht und korrigiert sowie thermischen Zweig gezogen. Fünf- und siebenteilige Ketten erfolgreich geprüft. Kategorie Energiewandler und zusammenhängende Kette ohne gestrichelte Zellrahmen.
- Tabletprüfung bei 1024 × 668 und 1180 × 720 nutzbarer Fläche (100 px Reserve gegenüber 1024 × 768 bzw. 1180 × 820). Tisch, aktueller Auftrag bzw. Diagramm und Prüfschaltfläche passen; Popup bleibt im Tisch. Ansichten zusätzlich visuell kontrolliert.

## Erfolgreiche Prüfungen

`dynamot-labor.test.cjs`: Modell und integrierte Browserabläufe einschließlich Touch, Speicherung, Edulo-Feldnachbildung und zweimaligem Einfügen mit jQuery 2.1.1.

`dynamot-stromnetz.test.cjs`: 13 Prüfungen, darunter Vorzeichen, Kirchhoff-Bilanz, Kabelverluste, offene Zweige, Umkehr, Parallelzweige, Überbrückung, Kurzschluss und zwei Maschinen.

`dynamot-aufgaben.test.cjs`: alle vier realen Simulationsaktionen, Diagrammgraphen, optionale Wärme, Antworten, 20 Punkte, Wiederherstellung, Migration und Zurückweisung beschädigter Zustände.

## Grenzen

Echte serverseitige Edulo-Speicherung und Upload-/Einbettungsgrenzen wurden nicht geprüft. Die lokale Nachbildung bestätigt den Feldvertrag, nicht den Edulo-Server. Die aktuelle Touch-Abnahme konzentriert sich auf Tabletquerformat. Rückgängig ist eine unmittelbare Sitzungshilfe und wird nicht über Neuladen gespeichert. Modellwerte sind illustrative Werte, keine Messwerte des realen Geräts.

## Nachprüfung: Elektronenphase, permanente Palette und direkte Bauplätze

- `dynamot-elektronen.test.cjs`: echte 0,4-kg-Modelltransiente bei Gesamtzeiten 0/30/60 s liefert dieselbe Phasenbewegung; Gewichtsreset, Pause, Umkehr, stromlose Zweige, neue/entfernte Kabel und rückgesetzte Uhr bestanden. Physik unverändert.
- `dynamot-palette.test.cjs`: alle vier Diagramme bei 1024×668 und 1180×720 mit echten Touchereignissen gelegt, einschließlich thermischem Zweig. Alle Palette-Bausteine dauerhaft sichtbar, Touchziele mindestens 44 px, keine Überdeckung, kein Scrollen für Palette/Kette/Prüfen. Separater Editor-Test im echten Seitenlayout; zusätzlich vollständiger integrierter Durchlauf der ersten beiden Diagramme.
- Integrierter Labortest auf direkte Slot-Popups umgestellt: Gerät hinzufügen, Zubehör, Umsetzen, Kabel und Edulo-Feldnachbildung bestanden. Freie Slots im schmalen Diagrammtisch separat auf erreichbare Mittelpunkte geprüft.
- Neue Screenshots `dynamot-palette-v1-1024.png` bis `dynamot-palette-v3-1180.png` (stabile Versuchs-IDs) sowie integrierte Diagrammansichten visuell geprüft.
- Lampenwiderstand bleibt konstant. Gebogene Kabel nur untersucht, nicht implementiert.

## Slotdarstellung bereinigt

Zusätzliche grüne Slotmarker und Führungslinien entfernt. Vorhandene 3D-Flächen und deren Labels bleiben als einzige sichtbare Platzdarstellung; transparente Touchziele direkt auf den Labels, mindestens44px. Alle7 Plätze bei1024×668 und1180×720 per Touch mit Popup belegt, belegte Ziele verborgen. `dynamot-slots.test.cjs` sichert diesen Ablauf ab; Screenshots `dynamot-slots-1024.png` und `dynamot-slots-1180.png`. Keine Kabeländerung.

## Gebogene Kabel und vollständiger Seitenstand

Gemeinsame Kurven für TubeGeometry, Elektronen und Touch-Hit-Test. Vier Leitungen (zwei DynaMots und Lampe), normale und gekreuzte Polung, drei Kameravoreinstellungen bei beiden Tabletgrößen einzeln per Touch ausgewählt. Kurvenpunkte bleiben über der Tischplatte; getrennte Routen überprüft, Screenshots visuell kontrolliert. Globale Kollisionsfreiheit in beliebig dichten Aufbauten wird nicht behauptet. Die vollständige Laborsuite bestätigt weiterhin Auswahl/Entfernen, Stromrichtung, Pause/Reset und Edulo-Vertrag.

`dynamot-kabel-speicher.test.cjs` bestätigt E1-Roundtrip trotz absichtlich unlesbarem lokalen Browserstand, anschließend lokalen Roundtrip: Geräte/Einstellungen/Kabel/Zeitzustand, Teilantworten/Diagrammentwürfe/Wärme, Aufgabenstand/Notizen/Snapshots, Kamera/Zoom und gewählte Aufgabenseite. Zudem Rückgängig nach Neuladen und gespeicherter Startzustand. E2 weiter20 Felder. Kameradrehung wird zusätzlich über Orbit-Ende gespeichert.

Die frühere Einschränkung von Rückgängig auf dieselbe Sitzung entfällt: Undo-Aufbau wird nun mitgespeichert. Auch laufend/pausiert und aktuelle Ansicht werden wiederhergestellt; ältere Stände ohne Laufzustand bleiben pausiert. Reine Pointerbewegung und momentane Elektronenpunktphase sind keine gespeicherten Arbeitsdaten. Echte Edulo-Server-/Uploadprüfung weiterhin offen.

## Abschließende Kabel- und Steckerprüfung

Die früheren hoch geführten Kabel sind durch bodennahe Kurven mit seitlichem Steckeraustritt ersetzt. Alle 91 unterschiedlichen Paare der 14 Buchsen wurden als Einzelbilder und acht Kontaktbögen visuell geprüft; 182 geometrische Konfigurationen (jeweils nur beteiligte Geräte sowie alle sieben Plätze belegt) bestanden. Katalog: `kabel-katalog/index.html`.

`dynamot-stecker.test.cjs`: zwei und drei axial gestapelte Stecker an Motor und Lampe bei beiden Tabletgrößen per Buchsen-Touch hinzugefügt; seitliche Austritte, Entfernen des unteren Steckers, Nachrücken, stabile Farben/Routen und Neuladen bestanden.

`dynamot-kabel-auflage.test.cjs`: drei gemeinsame Leitungen und eine tatsächlich kreuzende Motor-/Lampenverbindung bei beiden Tabletgrößen. Die spätere Leitung hebt sich lokal an. Kleinster gemessener Mittellinienabstand mindestens 0,114 bei 0,09 Rohrdurchmesser; identische Geometrie nach Neuladen. Der ursprüngliche Kreuzungsaufbau wurde ersetzt, weil seine Leitungen einander auswichen.

Der vollständige Labortest sowie der E1-/localStorage-Roundtrip einschließlich Kamera, Aufgaben, Touch-Auswahl und Rückgängig bestanden mit der fertigen Kabeldarstellung. Keine Änderung des Stromnetzmodells. Nicht geprüft sind sämtliche Kombinationen mehrerer Kabel und sämtliche Teilbelegungen; der Katalog deckt sämtliche einzelnen Buchsenpaare ab. Echte Edulo-Serverspeicherung bleibt offen.
