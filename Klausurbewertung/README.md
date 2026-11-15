# Klausurbewertung

Statische Web-App zur Korrektur von Klassenarbeiten und Klausuren. Die Anwendung läuft direkt über `index.html` im Browser und benötigt für das Frontend weder Node.js noch einen Build-Schritt.

## Zentraler Speicher für PC und Tablet

Der optionale Archivdienst unter `https://klausurbewertung-sync.hildebrandt.workers.dev` benötigt einen privaten Zugangsschlüssel. Er wird auf verbundenen Geräten gespeichert; im öffentlichen Quelltext befindet sich kein Schlüssel. Cloudflare speichert ausschließlich seinen SHA-256-Prüfwert als Secret. Der Archiv-Durable-Object ist auf die EU-Jurisdiktion beschränkt. Daten liegen beim Cloudflare-Konto des Betreibers; es handelt sich nicht um Ende-zu-Ende-Verschlüsselung.

### Einmalige Übernahme

1. Zuerst die bisher verwendete **lokale Datei** im selben Browserprofil öffnen und neu laden. „Zentraler Speicher“ öffnen, den Schlüssel eingeben und „Verbinden“ wählen.
2. **„Lokales Archiv übernehmen“** wählen. Eine vollständige Archivdatei wird heruntergeladen und zusätzlich eine lokale Sicherung angelegt. Danach wird das Archiv einschließlich Klassenlisten- und Aufgabenblockbibliothek übertragen. Bei gleichen Klausur-IDs hat der ausgewählte lokale Stand Vorrang; nur zentral vorhandene Klausuren bleiben erhalten.
3. Erst nach „Mit der Cloud synchronisiert“ auf Webseite bzw. Tablet mit demselben Schlüssel verbinden und **„Zentralen Stand laden“** wählen. Der vorherige Bestand dieses Geräts wird vorher automatisch lokal gesichert.

Datei und Webseite behalten getrennte Browserablagen, die der neue Dienst abgleicht. Bestehende Browserarchive werden bei der ersten Verbindung nie automatisch ersetzt oder hochgeladen. Durch Einzelklausur-Importe mit verschiedenen IDs entstandene Dubletten werden nicht automatisch zusammengelegt.

### Alltag und Sicherungen

- Änderungen werden nach kurzer Pause übertragen. Neue zentrale Stände werden etwa alle 15 Sekunden abgerufen, solange keine Eingabe bearbeitet wird. Beim Wiederöffnen bzw. Wiederverbinden wird ebenfalls abgeglichen.
- Offline bleiben Änderungen lokal. Vor einem Gerätewechsel die erfolgreiche Synchronisierung abwarten. Dieselbe Klausur möglichst nicht gleichzeitig auf zwei Geräten bearbeiten.
- Bei konkurrierenden Änderungen stoppt der Abgleich. Zuerst „Archiv sichern“, dann bewusst einen Stand auswählen. Es gibt keine automatische Zusammenführung einzelner Punkteingaben: bei ausdrücklicher lokaler Übernahme gewinnt die gesamte lokale Fassung einer Klausur mit gleicher ID.
- Eine zweite Registerkarte wird angehalten, sobald sich die lokale Ablage ändert. Sie kann ihren noch sichtbaren Stand exportieren und anschließend neu laden.
- „Archiv sichern“ exportiert das vollständige Archiv. „Archiv-Sicherung laden“ importiert es unter Erhalt der IDs. Einzelklausur-Exporte bleiben unterstützt.
- Vor Übernahmen entstehen lokale IndexedDB-Sicherungen (letzte 20). Die jüngste lässt sich unter „Zentraler Speicher“ herunterladen. Der Server hält den aktuellen Stand plus 20 vorherige Stände bereit. Technische Wiederherstellung siehe `cloud/README.md`.
- „Abmelden“ trennt nur dieses Gerät und löscht keine Klausuren. Nicht übertragene Änderungen erfordern beim erneuten Verbinden eine ausdrückliche lokale Übernahme.
- Schlüssel und Archive privat aufbewahren; nicht in GitHub hochladen. Der Server nimmt höchstens 6 MiB je Anfrage an. Zusätzlich gelten die Speichergrenzen des Browsers, insbesondere bei eingebetteten Bildern.

### Prüfungen

`node --test cloud-sync.test.cjs storage-guard.test.cjs cloud/worker.test.mjs`

Browsercode: `cloud-sync.js`, `app.js`, `styles.css`, `index.html`. Deployment und Secret-Rotation: `cloud/README.md`.

## Start

1. Ordner `Klausurbewertung` öffnen.
2. `index.html` im Browser starten.

Empfohlen:

- aktueller Desktop-Browser wie Edge oder Chrome
- für PDF-Ausgabe den Browserdruck `Als PDF speichern`

## Technischer Stand

Die lauffähige Runtime besteht aus:

- `index.html`
- `app.js`
- `styles.css`

Diese drei Dateien genügen für den lokalen Betrieb per Doppelklick auf `index.html`.

## Enthaltene Funktionen

- lokale Archivverwaltung mehrerer Klausuren
- Stammdaten inklusive editierbarer Notengrenzen
- Schülerverwaltung mit CSV-Import, manueller Pflege und Klassenlisten-Bibliothek
- Erwartungshorizont-Editor mit Strukturblöcken, Kriterien, Bonus, Markdown-ähnlicher Vorschau und Bild-Einbettung per Data-URL
- Aufgabenblock-Bibliothek zur Wiederverwendung alter Teilstrukturen
- Bewertungsmatrix mit Sticky-Bereichen, Tastaturnavigation und Blockaktionen
- Notenberechnung für Sek I, Oberstufe und Symbolskala
- Bonuslogik und kontrollierte Änderung von Maximalpunkten
- JSON-Import/Export kompletter Klausuren
- formale Druckansicht für Sammel-PDF über den Browserdruck

## Wichtige Annahmen

- Die beiden genannten Referenzdateien waren im Workspace nicht vorhanden und konnten daher nicht analysiert werden.
- Die App speichert lokal per `localStorage`.
- Bilder in Kriterien werden als Data-URL direkt im JSON mitgeführt.
- A/B-Varianten sind im Datenmodell berücksichtigt. Im MVP ist die Struktur noch gemeinsam, Schüler können aber Varianten zugewiesen bekommen.

## Datenmodell

### Klausur / Prüfung

`ExamRecord.metadata` enthält u. a.:

- `id`
- `title`
- `schuljahr`
- `fach`
- `kursOderKlasse`
- `termin`
- `arbeitsNummer`
- `thema`
- `lehrkraft`
- `lehrkraftKuerzel`
- `notenschluesselPreset`
- `benutzerdefinierteNotengrenzen`
- `anzahlHilfsmittelfreierAufgaben`
- `aktivierteVarianten`
- `createdAt`
- `updatedAt`

### Schüler

`Student` enthält:

- `id`
- `vorname`
- `nachname`
- `displayName`
- `variante`
- `aktiv`
- `sortIndex`

### Struktur / Erwartungshorizont

`StructureNode` bildet einen flexiblen Baum über `parentId` und `sortIndex` ab.

Unterstützte Typen:

- `section`
- `task`
- `subtask`
- `criterion`
- `spacer`
- `headingOnly`

Bewertbare Kriterien tragen zusätzlich:

- `maxPoints`
- `isBonus`
- `isScorable`
- `shortLabel`
- `variantScope`

### Bewertung pro Schüler und Kriterium

`EvaluationEntry` enthält:

- `scoreModeUsedLast`
- `rawInputValue`
- `achievedPoints`
- `derivedPercent`
- `isUnset`
- `updatedAt`

Die kanonische Größe ist `achievedPoints`.

## Fachregeln

- Punkte werden in 0,5-Schritten gespeichert.
- Prozentangaben werden über Abrundung auf halbe Punkte in Punkte umgerechnet.
- Es gilt immer `floor(value * 2) / 2`.
- Bonus erhöht nur die erreichten Punkte, nicht die reguläre Maximalpunktzahl.
- Dadurch kann der Prozentwert über 100 % liegen.
- Bei Änderung von Maximalpunkten gibt es zwei Modi:
  - absolute Punkte beibehalten
  - proportional mitskalieren

## CSV-Import

Erwartet werden die Spalten:

- `Vorname`
- `Nachname`

Das Trennzeichen wird automatisch zwischen `;` und `,` erkannt.

## JSON-Import/Export

Exportiert wird jeweils eine vollständige Klausur als JSON-Datei mit:

- Stammdaten
- Schülern
- Erwartungshorizont
- Bewertungen
- Notengrenzen
- Bonuskriterien
- Rich-Content inklusive eingebetteter Bilder

## Druck / PDF

Der Tab `Druck` erzeugt eine formale Browser-Druckansicht mit:

- Kopf je Schülerbogen
- Seitenzählung pro Schülerbogen
- vollständigem Erwartungshorizont
- Einzelpunkten und Summen
- Gesamtpunkten, Bonus, Prozent und Endnote
- Notengrenzen-Tabelle
- Kürzelfeld der Lehrkraft

## Hinweis zu den übrigen Projektdateien

Im Ordner liegen noch die früher erzeugten React-/Vite-Dateien (`src`, `package.json`, `vite.config.ts` usw.). Diese sind nicht mehr nötig, damit die App läuft. Maßgeblich für den direkten Start sind jetzt `index.html`, `app.js` und `styles.css`.
