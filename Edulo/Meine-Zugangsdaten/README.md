# Meine Edulo-Zugangsdaten

Uploaddatei: `widget.html` – den vollständigen Inhalt im vorhandenen Modul „HTML und Dateien“ ersetzen. Keine E1-/E2-Felder und keine Punkte nötig.

Das Widget zeigt Anmelde-ID und Benutzername des aktuell angemeldeten Schülerkontos mit je einem Kopierbutton. Ohne erlaubten Zwischenablagezugriff wird zuerst die ältere Kopiermethode versucht; andernfalls bleibt der Text zum manuellen Kopieren markiert. Außerhalb von Edulo erscheint ein Hinweis ohne Beispieldaten. Lehrer-, Editor- und fremde Antwortansichten zeigen keine Kontodaten.

## Bestätigte Kontofelder

Im vom Nutzer am 25.10.2026 aus Edulo kopierten Diagnosebericht und durch seine ausdrückliche Bestätigung identifiziert:

- **Anmelde-ID:** `widget.user.uid` (kleingeschrieben), Format `xx-xxxxxx-xxxxxx-xxxxxx`.
- **Benutzername:** `widget.user.name` (kleingeschrieben). Groß-/Kleinschreibung des Kontowerts bleibt erhalten.
- `widget.user.ID` und `widget.user.id` sind interne Nummern und werden nicht verwendet.
- `activations[].UID` und `activations[].Username` gehören zu historischen Aktivierungen und werden nicht als Ersatz für aktuelle Kontodaten genutzt. Auch die früher angenommenen Namensfelder `username`/`Username`/`userName` werden nicht verwendet.

Eine fehlende oder falsch formatierte `uid` wird nicht angezeigt; der ID-Kopierbutton bleibt dann gesperrt. Der Name bleibt unabhängig davon verfügbar. Persönliche Daten aus dem Nutzerbericht sind nicht als Testdaten oder feste Ausgabewerte in das Widget übernommen.

Die Kontodaten werden ausschließlich aus dem nächstgelegenen erreichbaren `window.widget.user` gelesen. Sie werden weder gespeichert noch an einen Server gesendet. Kontowechsel und Abmeldung werden laufend berücksichtigt. Die Speicherfunktionen des eingebundenen Edulo-Baukastens werden nicht aufgerufen. Die Fußleiste wird über dessen bestehenden Helfer ausgeblendet, wenn die Zuordnung zur eigenen Aufgabe möglich ist.

## Prüfung

Die lokale Edge-Hostsimulation prüft den bestätigten Datenvertrag mit synthetischen Werten: Vorrang von `uid`/`name` gegenüber interner ID und alten Aktivierungen, Ablehnung ungültiger Kennungen, spätes Laden, Kontowechsel/Abmeldung, geschützte Ansichten und Kopierwege. Layoutprüfung bei 920 und 390 px.

Der Datenvertrag stammt aus dem echten Nutzerbericht. Das korrigierte Anzeige-Widget wurde danach lokal geprüft; das erneute Einsetzen und Kopieren in einer echten Schüleransicht ist noch offen.

## Bearbeiten

Quellen: `widget.quelle.html`, `app.js`, `app.css`.

```text
node tools/edulo/build.cjs Edulo/Meine-Zugangsdaten/widget.quelle.html
node Edulo/Meine-Zugangsdaten/identity.test.cjs
```
