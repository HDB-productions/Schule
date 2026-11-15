# Newtonsche Gesetze – digitales Arbeitsblatt

Uploadziel: `widget.html` vollständig in das Edulo-Modul „HTML und Dateien“ kopieren. Die Comicbilder sind als WebP-Daten integriert; dafür müssen keine Dateien separat hochgeladen werden. Das Video wird über genau einen Button „Video öffnen“ auf YouTube geöffnet. Es gibt keinen eingebetteten Player mit zusätzlichen Share-/YouTube-Overlays mehr. Die ZIP-Originaldatei bleibt unverändert.

## Überarbeitung nach Nutzerfeedback, 26.10.2026

- Aufgabe 1: Originalformulierungen aus dem ZIP wörtlich wiederhergestellt, einschließlich „Kreuze Zutreffendes an.“ und „Wenn keine Kraft wirkt, dann...“.
- Aufgabe 2: ein gemeinsamer Abschnitt für Bildzuordnung, eigene Erklärung, KI-Prüfung und Rückmeldung. Neue handgezeichnet wirkende Comicbilder statt SVG-Bussen. Die Busse zeigen dieselben Personen, Fahrtrichtung nach rechts, unterschiedliche Körperhaltungen beim Bremsen/Anfahren. Ein Inlineskater ersetzt die erste stehende Person im grünen/tealfarbenen Pulli: innen im Bus, zwei Inlineskates, beide Hände oben an Haltegriffen. Links rollen seine Füße nach vorn, rechts bleiben sie zurück. Der Inlineskatervergleich ist verbindlicher Teil von Aufgabe 2 und wird als fünfter KI-Aspekt bewertet. Der Arbeitsauftrag enthält keine vorgegebenen Bewegungsrichtungen. Die grün gekleidete Figur im Bremsbild ist korrigiert: Der Oberkörper bewegt sich vorwärts, Beine und Füße bleiben dahinter.
- Aufgabe 3: Originalarbeitsauftrag wiederhergestellt, drei einzelne Symbolfelder pro Gleichung. Größen m/a/F und Rechenzeichen ⋅ beziehungsweise / werden getrennt gewählt; keine vorgegebenen fertigen Gleichungen. F = a ⋅ m wird gleichwertig anerkannt.
- Layout: ruhige Arbeitsblattgestaltung mit klaren Trennlinien, typografischer Hierarchie, gemeinsamem Aufgabenfluss und linierten Schreibfeldern. Verbindungshilfe und Guthaben sind im unteren Detailbereich zugänglich.

Bildquelle: integriertes `image_gen` (kein CLI/API-Fallback). Finales Asset: `assets/bus-inlineskater-v4.png`, WebP-Uploadversion: `assets/bus-inlineskater-v4.webp`. Das aktuelle Korrekturprompt steht in `assets/bus-inlineskater-v4.prompt.txt`, das vorherige Promptset in `assets/bus-inlineskater-v3.prompts.txt`; Ausgangsprompt für den Comic in `assets/bus-comic-v2.prompt.txt`. Die neue Bildbearbeitung korrigiert ausschließlich die Beine und Körperhaltung der grün gekleideten Figur im linken Bremsbild. Komprimierung in WebP verändert weder Bildausschnitt noch Motive. Originalfotos des ZIP und frühere Bildfassungen bleiben im Assetordner als Referenz erhalten.

## Speicher und KI

Widget-ID `newton-gesetze-ki-v1` bleibt stabil. Vorhandene Texte, Lernpunkte und Historie bleiben erhalten. Auch frühere Formelwerte wie `a*m`, `F/a` werden in die einzelnen Symbolfelder zurückgeladen. Neue teilweise ausgefüllte Formeln werden als drei getrennte Slots innerhalb eines Strings gespeichert (z. B. `m||a`), vollständig ausgefüllte als `m|*|a`. Keine neue Speicher-ID oder automatische Löschung. Speicherformat 2 migriert vorherige zehn Punkte, Antworten und die Historie verlustfrei; der elfte Punkt wird grau angehängt. Alte noch offene Vier-Aspekt-Anfragen bleiben über ihre ursprüngliche Request-ID und Rubrikversion abrufbar. Alte Bewertungen zählen nicht als vollständige neue Fünf-Aspekt-Prüfung; das Widget zeigt den Erweiterungshinweis und erlaubt erneutes Prüfen.

E1 als unbegrenztes Textfeld, E2 mit 20 unabhängigen Cloze-Feldern (Lösung `1`, je ein Punkt) nach `tools/edulo/START.md`. Die ersten 11 Felder werden genutzt, weitere bleiben grau. Ein Punkt für die vollständig richtige Mehrfachauswahl, zwei Bildzuordnungen, drei Formeln und fünf KI-Aspekte. Grün auf Anhieb, gelb nach Fehler/Hilfe; einmal erreichte Punkte bleiben erhalten. Zuordnungshilfen markieren den betroffenen KI-Aspekt als unterstützt.

KI-Dienst: `https://edulomodularai.hildebrandt.workers.dev`, automatische Edulo-ID, Speichern vor Versand, Historie, unveränderte Antworten ohne erneute Prüfung, ungeklärte Anfragen über Ergebnisabruf statt erneutem kostenpflichtigen Aufruf. Die aktuelle Überarbeitung verändert den gemeinsamen Worker nicht. Keine echten kostenpflichtigen KI-Aufrufe zur automatisierten Prüfung durchgeführt.

Video: Originalquelle `w5gzaixKb1o`, „Newton 1 und 2“, HDB@AES, 9:42. Quellenprüfung und Grenzen: `video-notes.md`. Bus und Inlineskater sind Transferbeispiele; im vollständigen gesprochenen Transkript wird kein Busbeispiel erklärt. Unvollständige KI-Aspekte erhalten feste geprüfte Videolinks bei 1:47/2:14 (Trägheit), 3:48 (Kraft) und 4:34 (Masse). Der Skatervergleich ist Pflichtkriterium `bus_skater`. Ganz ohne Vergleich: missing; nur Richtungsfeststellung oder nur eine Situation: partial; beide Vorgänge mit verständlicher Ursache: met. Dazu verweist das Widget auf die Kraft-Grundlage ab 2:23, ohne eine Skaterszene im Video zu behaupten.

## Build und Prüfung

Quellen: `task.js`, `domain.js`, `local.js`, `ui.js`, `widget.quelle.html`, `base.css`, `local.css`, finales WebP-Asset. Erzeugte Dateien: `app.js`, `app.css`, `widget.html`.

```powershell
node 'Physik/Edulo Mechanik/Newtonsche-Gesetze/build.cjs'
node --test 'Physik/Edulo Mechanik/Newtonsche-Gesetze/domain.test.cjs'
node 'Physik/Edulo Mechanik/Newtonsche-Gesetze/widget.test.cjs'
```

Prüfstand der verbindlichen Skaterfassung: acht Domain-/Migrationstests bestanden. Die Aufgabe wird vom tatsächlichen Worker-Schema `validTask` akzeptiert. Lokaler Edge-Browsertest mit simulierter Edulo-/KI-Schnittstelle: Originalformulierungen, neun Symbolfelder, elf Lernpunkte, Checkboxen, Bildzuordnung, vertauschte Faktorfolge, Fehler→Gelb, Hilfemarkierung, Freitext-/Punkterestaurierung, alte Formelwerte, Wiederherstellung unvollständiger Formeln, Anfrageinhalt, Klartextdarstellung, Videoverweise, unveränderte Antworten ohne neue Prüfung, Wiederaufnahme ungeklärter Ergebnisse ohne zweiten KI-Aufruf und 390/920/1440 Pixel ohne horizontalen Seitenüberlauf. Zusätzlich im Browser: reale Bridge-Migration von v1 auf v2 ohne Schreibzugriff beim Laden, anschließend Speichern mit elf Punkten, Wiederaufnahme einer alten ungeklärten Vier-Aspekt-Prüfung ohne neue KI-Anfrage.

Vorschauen `preview-v2-*.png` zeigen die simulierte Lernumgebung. Die aktuelle Fassung enthält einen einzigen externen Video-Button. `preview-edulo-checkbox-fix.png` zeigt zusätzlich die lokale Simulation des Edulo-Stylesheets.

Offen: neue Seite in echtem Edulo einsetzen und wiederöffnen, fachliche Qualität echter KI-Antworten, Öffnen des Videolinks aus dem Edulo-WebView und Bedienung auf einem realen Tablet. Browser-/Mocktests ersetzen diese Prüfungen nicht.

## Edulo-Darstellungskorrektur, 26.10.2026

Die CSS-Regel im ursprünglichen ZIP `.widgetBody #contentWrapper input[type=checkbox]:before` zeichnet zusätzlich zum nativen Eingabefeld ein zweites Kästchen. Das Widget unterdrückt deshalb ausschließlich für seine `.local-choice`-Checkboxen `::before`/`::after` und setzt den Abstand gegen den Hostselektor fest. Native Bedienung per Maus, Tastatur und Label bleibt erhalten. Im Edge-Test wurde die ursprüngliche Hostregel mit ihrer ID-Spezifität nachträglich injiziert: beide Pseudoelemente bleiben ausgeblendet, das native Kontrollkästchen lässt sich an- und abwählen, die Lernstandstests bestehen. Eine einzelne Videoaktion im Quellenbereich und unveränderte gezielte Videolinks im KI-Feedback sind geprüft. Live-Abnahme in Edulo noch offen.
