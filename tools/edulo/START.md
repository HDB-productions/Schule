# Edulo-Widgets

Sofern nicht anders gefordert, werden Edulo-Widgets als einzelne HTML-Datei mit eingebettetem JavaScript und CSS gebaut, die sowohl standalone im Browser als auch eingebettet in Edulo läuft. Die Anbindung erkennt die Betriebsart und speichert den Lernstand entsprechend lokal im Browser oder in Edulo.

Für neue Widgets die Vorlage und Anbindung verwenden. Bei bestehenden Widgets deren Quelle/Build nutzen; nicht ungefragt migrieren.

## Erstellen und bearbeiten

Befehlsschema: Die Platzhalter in spitzen Klammern durch passende Werte ersetzen, dann im Repo-Hauptordner ausführen.

```text
node tools/edulo/new-widget.cjs "<Zielordner>" "<Widget-ID>" "<Titel>"
```

`<Zielordner>`: neuer Ordner im passenden Fachbereich; `<Widget-ID>`: eindeutige, dauerhafte Kennung; `<Titel>`: sichtbare Überschrift.

Im Zielordner entstehen `widget.quelle.html`, `app.js`, `app.css` und die uploadfähige `widget.html`.

- Inhalt und Layout in den drei Quelldateien bearbeiten. Die Edulo-Anbindung (`bridge`) wird beim Build eingebunden.
- In `app.js` Anfangszustand (`fresh`) und Validierung (`validate`) anpassen. Entwürfe, Versuche, Hilfen und Fortschritt speichern; veröffentlichte ID stabil halten, alte Speicherstände bei Schemaänderungen migrieren.
- Bauen: `node tools/edulo/build.cjs "<Zielordner>/widget.quelle.html"`.
- Gesamte erzeugte HTML-Datei in Edulos „HTML und Dateien“ einsetzen. Zusätzliche Bilder oder Softwarebausteine bei Bedarf in die Datei einbetten.

## Speicher und Punkte

- Sofern nicht anders gefordert: E1 als Textfeld für den vollständigen Zustand; E2 mit 20 unabhängigen Cloze-Feldern, Lösung jeweils `1`, je ein Punkt. Andere Feldzuordnungen und Punktzahlen über die Bridge-Optionen einstellen (siehe `reference/integration.md`). Technische Felder samt Containern werden im Lernmodus ausgeblendet.
- Farben: `gray` unbearbeitet, `green` auf Anhieb richtig, `yellow` nach Fehler/Hilfe richtig; `red` optional falsch. Fehler/Hilfe in der Lernlogik merken, unbenutzte Punkte grau lassen.
- Nur über `bridge` speichern. Laden verändert keine Punkte. Kein zusätzliches globales Prüfen oder Zurücksetzen.

```js
const saved = await bridge.load();
state = saved.data; scores = saved.scores; // eine Farbe je Punktefeld; Index 0 = erste Lücke
bridge.queueSave(state, scores);          // Entwurf, gebündelt
scores[0] = 'yellow';
bridge.save(state, scores);               // abgeschlossener Lernschritt
```

Fehleranzeige der Vorlage erhalten; fehlgeschlagenes Laden nicht durch einen leeren Stand ersetzen.

## Layout und Prüfung

Standard: Edulos gesamte Fußleiste mit Prüfen/Lösungen ist ausgeblendet (`hideFooter: true` in der Bridge-Konfiguration); mit `false` bleibt sie sichtbar. Die Vorlage nutzt den verfügbaren Platz.

Layoutbasis: iframe 1024 × 768 CSS-px, Widgetbreite 920 px, Inhaltsbereich ohne Fußleiste etwa 728 px hoch. Tatsächlichen Platz und interne Scrollbereiche beachten. CSS/Selektoren auf den Widget-Root begrenzen; kein zusätzliches eigenes iframe voraussetzen. Deutsche, touchfreundliche Oberfläche.

Fachlogik und Wiederherstellung gezielt testen; Ansicht bei 920 und 390 px Breite prüfen. Neue Integration einmal in Edulo bearbeiten und wiederöffnen. Kit-Suite bei Änderungen an der Anbindung ausführen.

## Nachschlagen – nur bei Bedarf

| Bedarf | Datei |
|---|---|
| Feld-IDs, API, Speicherfehler, Migration | [integration.md](reference/integration.md) |
| Footer-Einstellung und Layoutverhalten | [footer.md](reference/footer.md) |
| Einbettung, genaue Maße, Layout-Sonderfälle | [layout.md](reference/layout.md) |
| Übergebene Modulparameter | [parameters.md](reference/parameters.md) |
| Statusfarben, Prüfung, Excel, interne Methoden | [findings.md](reference/findings.md) |
| Bestehende Widgets als Vorbilder | [examples.md](reference/examples.md) |
| Herkunft und Prüfstand | [evidence.md](reference/evidence.md) |
| Kit-Suite ausführen | [Tests](tests/README.md) |

Neue Erkenntnisse, Fehlerursachen und Lösungswege in der passenden Nachschlagedatei ergänzen; ungetestete Ideen kennzeichnen. Den Einstieg nur bei Änderungen am Standardablauf anpassen.
