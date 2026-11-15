# Freier Fall mit Stroboskopbild

Die Seite ersetzt das Arbeitsblattfoto durch acht Höhenmessungen, sieben Strecken- und Geschwindigkeitsberechnungen, ein h-t-Diagramm und vier Aufgaben mit KI-Rückmeldung. Die Eingaben beginnen leer. Das Diagramm zeichnet ausschließlich eingegebene Messpunkte; die gestrichelte Verbindung ist eine Lesehilfe. Quelle: die vom Nutzer bereitgestellte DOCX und Originalaufnahme.

## In Edulo einsetzen

1. Den vollständigen Inhalt von `widget.html` im Modul **HTML und Dateien** einsetzen.
2. **Im selben Modul** diese beiden Zusatzdateien hochladen und die Namen beibehalten: `fallvideo.mov` und `stroboskop-original.jpg`. Keine Base64-Nutzlast und keine Medien im HTML.
3. E1 als unbegrenztes Textfeld anlegen. E2 mit 20 unabhängigen Cloze-Feldern, Lösung jeweils `1`, je ein Punkt. Die ersten 13 werden verwendet. Technische Felder und Edulos Fußleiste werden im Lernmodus ausgeblendet.
4. In der eigenen Lernendenansicht öffnen, Eingaben speichern und erneut öffnen. Für die KI braucht das Konto die bestehende Freigabe und Guthaben beim Rückmeldedienst.

Dateien werden anhand des eindeutigen Markers des eigenen `html_and_files`-Moduls gesucht und mit Edulos `getMediaURLPath` aufgelöst. Fehlt die Datei oder ist die Modulzuordnung mehrdeutig, erscheint eine Meldung. Es werden keine Serverpfade geraten. Der lokale Browser verwendet die beiden Dateien neben der HTML-Datei. Die MOV-Datei bleibt unverändert; ein Link ermöglicht separates Öffnen, falls ein Endgerät den Codec nicht abspielt.

Die Aufnahme wird per CSS auf Murmel und Höhenskala fokussiert. Antippen öffnet das vollständige Original inklusive des alten leeren Diagramms. Die neue Grafik wird als SVG aus den Eingaben erzeugt.

## Fachliche Festlegungen

Die Vorlage nennt 100 Bilder/s. Daraus folgt als Quellenrechnung ein Abstand von 0,01 s. Die Wiedergabefrequenz des Zeitlupenvideos bestätigt die Aufnahmefrequenz nicht. Die oberste Position wird für diese Aufgabe ausdrücklich als Bild 0 bei t=0 definiert. Die roten Markierungen zählen seitdem die Intervalle; fünf Intervalle entsprechen einer Tabellenzeile.

Die Originalskala zeigt die Höhe **h über dem Boden**, keinen gefallenen Weg. Positive Fallstrecken werden als h1−h2 berechnet, der Geschwindigkeitsbetrag als Δs/0,05 s. Die Daten passen bei der genannten Bildrate nicht zu idealem freiem Fall mit g=9,81 m/s². Deshalb werden Bildablesungen mit Toleranz bewertet und keine theoretischen Ersatzwerte verlangt. Rechnungen werden anhand der eigenen Ablesungen geprüft; Folgefehler sollen nicht doppelt zählen. Eine Bestimmung von g ist nicht Teil des Auftrags.

## KI und Speicherung

Bestehender Dienst: `https://edulomodularai.hildebrandt.workers.dev`. Keine API-Schlüssel im Widget. Texte und Tabellen werden übertragen, die KI sieht keine Medien. Tabellen sind strukturierte Teilantworten. Antworten, ursprüngliche Einreichungen, Rückmeldungen und Punkte werden ausschließlich über die Edulo-Bridge gespeichert. Standalone gibt es lokale Entwurfsspeicherung, KI-Aufrufe verlangen die eigene Edulo-Identität. Editor, Fremdstand und Prüfungsansicht sind schreibgeschützt.

Unveränderte Antworten werden wiederverwendet. Eine Änderung der Höhen ändert auch den mitgesendeten Bezug der Geschwindigkeitsaufgabe; damit wird deren Rückmeldung ebenfalls erneuert. Vor einer kostenpflichtigen Anfrage wird die genaue Einreichung gespeichert. Ungeklärte Prüfungen werden über `/result` abgerufen, ohne automatisch eine zweite Anfrage zu starten. Grün bedeutet auf Anhieb erfüllt, Gelb nach einem früheren nicht erfüllten Kriterium. Erreichte Punkte bleiben erhalten.

## Bauen und Prüfstand

```powershell
node 'Physik/Edulo Mechanik/Freier-Fall/build.cjs'
node --test 'Physik/Edulo Mechanik/Freier-Fall/lesson.test.mjs'
node 'Physik/Edulo Mechanik/Freier-Fall/browser.test.cjs'
```

`task.js`, `domain.js`, `ui.js`, `media.js`, `worksheet.js`, `app.css`, `worksheet.css` und `widget.quelle.html` sind Quellen. `app.js` und `widget.html` werden erzeugt. Tests nutzen die vorhandenen gebündelten Playwright-Abhängigkeiten und ein isoliertes Edge-Profil. Der Browser benötigt auf diesem Rechner einen Start außerhalb der Sandbox.

Bestanden: Worker-Vertrag und Anfragegröße, selektive Wiederprüfung, erhaltene Punkte, eindeutige Medienzuordnung mit Fehlerfällen sowie lokaler Browserlauf mit simuliertem Edulo und simuliertem KI-Dienst. Der Browser prüft leere Tabellen, alle 22 Zahlenfelder, Bild und Videowiedergabe, Diagramm, Breiten 390/920/1440 ohne Seitenüberlauf, E1/E2, Wiederöffnung, Teilanfragen, Abruf ungeklärter Prüfungen, Klartextdarstellung und Schreibschutz der Fremdansicht. Die Vorschaubilder enthalten ausschließlich Testantworten.

Noch offen: tatsächlicher Edulo-Dateiupload und Wiederöffnung, physisches Tablet und Qualität der Rückmeldungen mit echten KI-Antworten. Keine kostenpflichtigen KI-Aufrufe für diese Umsetzung, nichts veröffentlicht.
