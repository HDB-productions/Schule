# Klausurbewertung

Lokale, statische Web-App zur Korrektur von Klassenarbeiten und Klausuren. Die Anwendung ist als React-/TypeScript-/Vite-Projekt aufgebaut, speichert alle Fachdaten lokal im Browser und ist für statisches Hosting, insbesondere GitHub Pages, ausgelegt.

## Status

Der fachliche MVP ist umgesetzt mit Fokus auf Kernlogik und Alltagstauglichkeit:

- lokale Archivverwaltung mehrerer Klausuren
- Stammdaten inklusive editierbarer Notengrenzen
- Schülerverwaltung mit CSV-Import, manueller Pflege und Klassenlisten-Bibliothek
- Erwartungshorizont-Editor mit Strukturblöcken, Kriterien, Bonus, Markdown/LaTeX und Bild-Einbettung per Data-URL
- Aufgabenblock-Bibliothek zur Wiederverwendung alter Teilstrukturen
- Bewertungsmatrix mit Sticky-Bereichen, Tastaturnavigation und Blockaktionen
- Notenberechnung für Sek I, Oberstufe und Symbolskala
- Bonuslogik und kontrollierte Änderung von Maximalpunkten
- JSON-Import/Export kompletter Klausuren
- formale Druckansicht für Sammel-PDF über den Browserdruck
- Tests für die kritische Berechnungslogik

## Annahmen

- Die beiden genannten Referenzdateien waren im Workspace nicht vorhanden und konnten daher nicht analysiert werden.
- Die App speichert lokal per `localStorage`. Das ist für eine einzelne Lehrkraft robust genug und ohne zusätzliche Browser-API nutzbar. Für sehr große eingebettete Bilder ist IndexedDB perspektivisch sinnvoll, aber für den MVP nicht zwingend.
- Der PDF-Weg ist bewusst browserbasiert: Die Druckansicht ist formal aufbereitet und wird über `window.print()` als PDF ausgegeben. Das bleibt vektororientiert und vermeidet Screenshot-PDFs.
- Bilder in Kriterien werden als Data-URL direkt im Rich-Content gespeichert. Dadurch bleiben Export/Import ohne zusätzliche Dateiverwaltung vollständig.
- A/B-Varianten sind im Datenmodell berücksichtigt. Im MVP ist die Struktur noch gemeinsam, Schüler können aber Varianten zugewiesen bekommen.

## Projektstart

Voraussetzung: lokale Node.js-Installation.

```bash
cd Klausurbewertung
npm install
npm run dev
```

Für Build und lokale Vorschau:

```bash
npm run build
npm run preview
```

Für Tests:

```bash
npm run test
```

## Wichtiger Hinweis zur aktuellen Umgebung

In der aktuellen Arbeitsumgebung standen `node` und `npm` nicht im PATH zur Verfügung. Deshalb konnte ich den Build hier nicht ausführen. Der Code ist strukturiert und auf lauffähige Vite-/React-Konfiguration ausgelegt, sollte aber lokal nach Installation von Node einmal gebaut und getestet werden.

## Architekturüberblick

### 1. UI

- `src/components/App.tsx`: zentrale Orchestrierung, Tabs, lokale Archiv- und Klausuraktionen
- `src/components/ArchiveView.tsx`: Archivseite für Öffnen, Duplizieren, Löschen, Import/Export
- `src/components/MetadataPanel.tsx`: Stammdaten und editierbare Notengrenzen
- `src/components/StudentManager.tsx`: Schülerpflege, CSV-Import, Klassenlisten-Bibliothek
- `src/components/StructureEditor.tsx`: Erwartungshorizont-Editor mit Mehrfachanlage, Blockbibliothek und DnD-Reihenfolge
- `src/components/EvaluationMatrix.tsx`: Kernraster für die Korrektur
- `src/components/OverviewPanel.tsx`: Deckblatt-/Übersichtsseite
- `src/components/PrintView.tsx`: druckoptimierte Sammelausgabe

### 2. Domänenlogik

- `src/domain/types.ts`: zentrale Typen und Datenstrukturen
- `src/domain/gradePresets.ts`: Standard-Notenschlüssel
- `src/domain/logic.ts`: reine Funktionen für Rundung, Prozentumrechnung, Summen, Bonus, Noten und Reskalierung

Die fachlich kritischen Regeln liegen absichtlich nicht in UI-Komponenten.

### 3. Persistenz

- `src/store/repository.ts`: Laden, Speichern, Demo-Daten, JSON-Import/Export und Bibliotheksobjekte
- lokaler Schlüssel: `klausurbewertung.store.v1`

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

### Rundung und Prozent

- Punkte werden in 0,5-Schritten gespeichert.
- Prozentangaben werden über `percentToPoints()` in Punkte umgerechnet.
- Es wird immer auf halbe Punkte abgerundet: `floor(value * 2) / 2`.

### Bonus

- Bonuskriterien erhöhen nur die erreichten Punkte.
- Bonus erhöht nicht die reguläre Maximalpunktzahl.
- Dadurch kann der Prozentwert über 100 % liegen.
- Die beste Note bleibt durch die obere Grenzdefinition gedeckelt.

### Änderung von Maximalpunkten

Die App bietet zwei Modi:

- `absolute`: eingetragene Punkte bleiben erhalten, werden aber bei Bedarf auf die neue Obergrenze begrenzt
- `proportional`: vorhandene Leistungen werden prozentual auf die neue Maximalpunktzahl übertragen und erneut auf 0,5 abgerundet

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
- Rich-Content inklusive Data-URL-Bildern

Hinweis:

- Der Export ist klausurbezogen, nicht archivbezogen.
- Beim JSON-Import wird eine neue lokale Klausur mit neuer ID angelegt.

## Druck / PDF

Die Druckansicht ist über den Tab `Druck` erreichbar.

Enthalten pro Schüler:

- Kopf mit Stammdaten
- Name
- Fach / Klasse / Datum
- Seitenzählung innerhalb des Schülerbogens
- vollständige Struktur
- Punkte je Kriterium
- Summen pro Block
- Gesamtpunkte, Bonus, Prozent, Note
- Notengrenzen-Tabelle
- Kürzelfeld der Lehrkraft

Empfohlener Ablauf:

1. Tab `Druck` öffnen.
2. `Sammel-PDF drucken` klicken.
3. Im Browser `Als PDF speichern` wählen.

## Tests

Die Tests liegen in `src/test/logic.test.ts` und decken die geforderten Kernregeln ab:

- Rundung auf 0,5
- Prozent -> Punkte
- Notenberechnung
- Bonuslogik
- Maximalpunktänderung in beiden Modi

## Nächste sinnvolle Ausbaustufen

- Migration von `localStorage` auf IndexedDB für sehr große Bildmengen
- feinere Variantenlogik auf Kriteriumsebene
- explizite Undo-/Redo-Historie
- stabileres Drag-and-Drop mit hierarchischem Umhängen
- echte PWA-Installation mit Service Worker
