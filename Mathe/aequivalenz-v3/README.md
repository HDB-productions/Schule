# Äquivalenzumformungen üben – Version 3

Zusätzliche Version mit freiem Umformen, Klammern, noch nicht zusammengefassten Termen und drei Lösungstypen. Version 2 bleibt unverändert. Die neue App ist im Mathe-Inhaltsverzeichnis zusätzlich verlinkt.

## Öffnen und in Edulo einsetzen

- Standalone-Datei: `../Äquivalenzumformungen üben - Version 3.html`.
- Identische uploadfähige Datei: `widget.html`. Den gesamten Inhalt in Edulos „HTML und Dateien“ einsetzen.
- E1: unbewertetes Textfeld ohne begrenzende Zeichenlänge. E2: 20 unabhängige Lücken mit Lösung `1`, jeweils ein Punkt. Die Bridge überträgt Grün, Gelb und Rot einschließlich der Hilfe-Flags; Grau bleibt unbelegt. Technische Felder und Edulo-Fußleiste werden im Lernmodus ausgeblendet.
- Eigene Kennung `aequivalenz-v3`, eigenes Format `EDULO2:` und eigener lokaler Schlüssel `schule-edulo:aequivalenz-v3`. Lernstände von Version 2 werden nicht importiert oder geändert.

## Anforderungen und Nachweise

| Kriterium | Umsetzung und Prüfung |
|---|---|
| Alte Version erhalten | SHA256 von Version 2 vor/nach der Arbeit identisch: `C94AB9536C3768CEB62E5B0C6E45BCF7C7B74E6EF7F8A2731B05EB39B96CA30D`. Der bisherige Index-Link bleibt bestehen. |
| Klammern und offene Terme | Sechs Generatormuster einschließlich Minusklammern, beidseitigen Klammern, wiederholten x- und Zahlentermen. 3.000 erzeugte Gleichungen auf algebraische Richtigkeit und Lösbarkeit geprüft. |
| Drei gleich häufige Lösungstypen | Zufällig gemischte Dreiergruppen mit je einer eindeutigen, allgemeingültigen und nicht lösbaren Gleichung. Im Belastungslauf 400 Aufgaben je Typ. |
| Freier Lösungsweg | Mathematisch zulässige Operationen auf beiden Seiten; keine Festlegung auf eine Lösungsrichtung. Andere Reihenfolge, Multiplikation/Division und zuerst Vereinfachen oder zuerst Umformen getestet. Multiplikation/Division durch null, nichtlineare Terme und x im Nenner werden abgelehnt. |
| Zusammengesetzte Operationen | Vorzeichen bleiben am jeweiligen Summanden: `2x = 3x+8` mit `−2x−8` ergibt `−8 = x`; `−(2x−8)` ergibt dagegen `8 = x+16`. Beide Schreibweisen, gemischte Vorzeichen, Klammern und manuelle/gelöste Eingaben getestet. |
| Selbst ausrechnen | Genau ein aktives Feld für Operation, linke Seite, rechte Seite oder Lösungsmenge. Originalschreibweisen bleiben erhalten. Richtige offene Rechnungen führen zum Vereinfachen und zählen nicht als Fehler. |
| Abschluss | Zahlen zunächst ausrechnen. Danach x allein links/rechts oder keine x-Terme mehr; erst dann Lösungsmenge. Leeres Feld, ℝ/R, Null, Brüche und Dezimalkomma geprüft. Bei ℝ wird mathematisch korrekt `L = ℝ` dargestellt, sonst `L = {…}`. |
| Bildschirmtastatur | Vier feste Zeilen mit Zahlenblock links, paarweisen Rechenzeichen, x/ℝ übereinander und paarweisen Bedientasten rechts. 0/Komma stehen in einer eigenen Zeile unter dem Zahlenblock; die Klammern direkt unter Mal/Geteilt. Vier Farbfamilien; kein redundanter /-Knopf. Brüche bleiben mit : oder Hardware-/ eingebbar. Cursor links/rechts/Anfang/Ende, Rückwärtslöschen und Entf; Auswahl ersetzen und Wiederaufnahme geprüft. Auf schmalen Bildschirmen scrollt nur die Tastatur seitlich. Hardwareeingabe bleibt für Zugänglichkeit möglich. |
| Gestaffelte Hilfen | Falsche Prüfung und Hilfe-Taste öffnen jeweils die nächste von drei Stufen für das aktive Feld. Stufe 1 Text, ab Stufe 2 farbige Markierungen und Regelschema. Beim Ausmultiplizieren werden nur Faktor und Bestandteile der betreffenden Klammer markiert, mit denselben Rollenfarben a/b/c im Regelschema. Nur die aktuelle Ausgangszeile wird markiert. Keine Stufe trägt die richtige Eingabe ein. Hilfen berücksichtigen Operation, Seite, Klammern, Zusammenfassen, Division und Lösungsmenge. |
| Lösen nach erschöpften Hilfen | Taste wird nach Stufe 3 zu „Lösen“. Nur das aktive Feld wird übernommen; übernommene Einträge bleiben rot. Danach startet die Hilfestaffel für das nächste Feld neu. Kein automatischer Abschluss des restlichen Lösungswegs. |
| Grün/Gelb/Rot | Ohne Fehler/Hilfe grün; jede falsche Prüfung oder konkrete Hilfe gelb; Lösen sofort einmalig rot. Rot bleibt für diese Aufgabe erhalten. Kein weiterer Punkt beim späteren Abschluss oder Reload. |
| Farben einzelner Eingaben | Auf Anhieb richtig grün, nach Fehler oder Hilfe richtig gelb, mit Lösen übernommen rot. Jede Operation, Seite und Lösungsmenge wird einzeln bewertet; spätere sofort richtige Eingaben bleiben grün. Aus vorhandenen Ereignissen abgeleitet, auch für ältere Speicherstände und den Verlauf. Farbverlauf wird nur um neue Ereignisse erweitert, ohne zusätzliche Speicherung. Engine- und Browserregression prüfen Korrektur, Hilfe, Lösen, Reload und Verlauf. |
| Punkteverschiebung | 20 Felder, Grün/Gelb links, Rot rechts. Volle Leiste: positive Punkte ersetzen Rot; ohne Rot verbessert Grün Gelb, Gelb ersetzt Grün. Rot ersetzt Gelb; ohne Gelb wird Grün zu Gelb. Alle möglichen Grün/Gelb/Rot-Anzahlen bis 20 mit allen drei neuen Farben geprüft. |
| Hinweis bei möglichen Umwegen | Unverbindliches ? direkt nach Operationsprüfung, bevor die Seiten berechnet werden. Öffnen des Hinweises verändert weder Operation noch Aufgabenfarbe. Eigenes Ändern bleibt folgenlos; konkrete Alternativhilfe macht gelb. Quellprüfung entdeckte und behob einen Fehler in dieser Trennung; Browserregression besteht. |
| Lange Verläufe | Höchstens 50 Aufgaben mit Detailverlauf. Ältere Aufgaben werden zu Farb-/Lösungstyp-Zahlen zusammengefasst; Gesamtstatistik und Punkte bleiben erhalten. Historienübersicht wird erst beim Öffnen aufgebaut, Einzelwege erst beim Öffnen einer Aufgabe. |
| Flüssige Speicherung | Keine vollständige Kopie/Serialisierung pro Tastendruck. Entwürfe nach 400 ms Pause gebündelt; geprüfte Schritte unmittelbar. Entwurf beim Verlassen, Fenster-Fokusverlust und Verbergen sichern. Mathematische Wiederprüfung wird für unveränderte Aufgaben gecacht; geänderte Aufgaben werden anhand ihrer Ereignisse geprüft. |
| Wiederaufnahme | Entwürfe, offene Seiten, freie Operationen, Hilfestufen, rote Einträge, Punktestand und Gesamtzahlen nach Reload geprüft. Beschädigte und fremde Speicherstände werden nicht überschrieben. |
| Ältere Rechenlogik | Internes Schema 2, Bridge-Kennung und Envelope-Version bleiben erhalten. Schema 1 wird mit damaliger Minusinterpretation geprüft und erst danach in einer Kopie aktualisiert. Betroffene frühere Minusoperationen erhalten ausdrückliche Klammern, Originaleingaben bleiben im Verlauf dokumentiert; Ergebnisse, Punkte und Entwürfe bleiben erhalten. Neue Operationen verwenden stets die korrigierte Vorzeichenlogik. Laden schreibt keinen Stand zurück; die nächste normale Speicherung sichert Schema 2. Teilaufgaben, abgeschlossene Aufgaben, maximale Eingabelänge und lokales/Edulo-E1-Neuladen getestet. |
| Edulo | Lokale Inline- und iframe-Hostsimulation: E1-Vorrang, natives input/change, 20 Farben/Hilfe-Flags, nur lesendes Wiederherstellen, Editor ohne Speicherung, fremdes E1 ohne Überschreiben. Zusätzlich Edulo-Kit-Suite bestanden. |
| Layout | Edge bei 920, 390 und 320 px, ohne horizontalen Seitenüberlauf; Tasten mindestens 44 px hoch. Screenshots `qa-920.png`, `qa-390.png`, `qa-320.png` visuell kontrolliert. Die Übung besitzt einen internen Scrollbereich. |

## Belastungstest

Der Browserlauf löst 1.200 Aufgaben und speichert jeden abgeschlossenen Aufgabendurchlauf über die echte lokale Bridge. Der Detailverlauf bleibt bei 50 Aufgaben, 1.150 ältere Aufgaben sind zusammengefasst. Der JSON-Zustand bleibt bei ungefähr 60 KB statt mit der Gesamtzahl weiterzuwachsen. Exakte Zeiten und Größe des letzten bestandenen Laufs stehen in `qa-results.json`. Zeiten gelten für den lokalen Edge-Testrechner und sind keine Messung eines Edulo-Servers oder Tablets.

Zusätzlich prüft die Engine-Suite 1.200 abgeschlossene Aufgaben, alle Dreiergruppen, die erhaltenen Summen und die Wiederherstellung des vollständigen gespeicherten Zustands. Die Algebra-Suite prüft weitere 3.000 Generatorequationen.

## Quellen und Befehle

`algebra.js` enthält exakte rationale Algebra ohne eval oder Rundungstoleranz. `engine.js` enthält Lernablauf, Hilfen, Bewertung und validierbaren Zustand. `ui.js`, `app.css` und `widget.quelle.html` bilden die Oberfläche. `app.js` und beide fertigen HTML-Dateien werden erzeugt, nicht direkt bearbeiten.

```text
node Mathe/aequivalenz-v3/build.cjs
node Mathe/aequivalenz-v3/algebra.test.cjs
node Mathe/aequivalenz-v3/engine.test.cjs
node Mathe/aequivalenz-v3/browser.test.cjs
node Mathe/aequivalenz-v3/layout.test.cjs
node tools/edulo/tests/run.cjs
```

Lokale Vorschau: `node Mathe/aequivalenz-v3/browser.test.cjs --preview`, danach `http://127.0.0.1:8773`.

## Prüfgrenzen

Alle genannten Tests laufen lokal. Ein echter Edulo-Server-Roundtrip und die Bedienung auf einem physischen Tablet sind nicht bestätigt. Die Speicheranzeige bestätigt die Übergabe an Edulo-Felder, keine serverseitige Speicherung. Es wurde kein Commit, Push oder Deployment vorgenommen.
