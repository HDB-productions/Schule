# Klausurbewertung

Lokale, statische Web-App zur Korrektur von Klassenarbeiten und Klausuren. Die Anwendung läuft jetzt direkt über `index.html` im Browser und benötigt weder Node.js noch einen Build-Schritt.

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
