# Messdaten auswerten

Responsives Nachschlagewerk mit lokalen Zufallsübungen für die Physik-Oberstufe. Die sechs abgestimmten Unterrichtsschritte, fünf Funktionstypen, analoge Näherungsverfahren und der GeoGebra-CAS-Bedienweg sind in `dist/` umgesetzt.

## Übungen

Unter jedem der sechs Schritte sind **Wissen** (Erklärungen und Beispiele) und **Üben** unabhängig aufklappbar und zunächst geschlossen. Direktlinks zu Wissensinhalten und Suchtreffer öffnen die zugehörigen Erklärungen automatisch. **Üben** öffnet eine Aufgabe. Die Sprunglinks „Direkt üben“ führen unmittelbar dorthin. **Neue Aufgabe** erzeugt neue Werte; die Variantenwahl erlaubt gezieltes Training. Antworten werden ausschließlich lokal anhand der erzeugten Daten geprüft. Keine KI, kein Konto und kein externer Bewertungsdienst.

1. Mittelwerte, Minima und Maxima direkt in drei Ergebnis-Spalten der Messwerttabelle eintragen. Anschließend genau zwei auffällige Einzelwerte direkt in derselben Tabelle anklicken. Erst danach erscheinen kurze Informationen zu diesen Werten: einer ohne beobachtetes Problem, einer mit belegtem, nicht rekonstruierbarem Messfehler. Die Entscheidung erfolgt per Auswahl.
2. Eine Messwerttabelle mit eigener Nummernspalte vorgeben; Größe und Einheit an den SVG-Achsen per Dropdown auswählen und beide Einteilungen mit je zwei Schiebereglern einstellen: Faktor 1, 2 oder 5 und Zehnerpotenz −2 bis 2. Beide Achsen starten unabhängig von den Daten bei Faktor 1 und Exponent 0; alle 15 Schrittweiten von 0,01 bis 500 stehen bereit. Anschließend ist genau eine Messung hervorgehoben. Für sie Mittelwert und Min-Max-Balken direkt im SVG setzen, prüfen und erst danach mit „Nächste Messung“ fortfahren. Falsche Einträge lassen sich korrigieren. Das Raster rastet auf halbe Kästchen ein. Pfeiltasten und Enter sind als Alternative zum Klick möglich; Toleranz 0,15 Kästchen.
3. Zunächst nur Messpunkte zeigen. Merkmale sind nach Krümmung, x-Achse, y-Achse und Scheitelpunkt gruppiert. Bei einem Schnittpunkt mit der y-Achse wird zusätzlich zwischen „bei y = 0“ und „bei y ≠ 0“ unterschieden. Bei der x-Achse gibt es keine zusätzliche Ursprungsfrage. Die Korrektur steht direkt an den Optionen, ohne zweite Lösungsliste. Danach proportional, linear oder quadratisch vermuten: Erst ein Klick auf einen Typ blendet dessen tatsächlich aus den Punkten berechnete Regression ein; beim Wechsel wird sie ersetzt. Alle Aufgaben zeigen ausreichend große, eindeutige Verläufe, keine kurzen Ausschnitte oder Unentscheidbarkeitsoption. Eine quadratische Anpassung mit Koeffizient null wird als Gerade erklärt. Das Übungsmenü verrät den gesuchten Funktionstyp nicht.
4. Die im Kurs behandelten Prüfgrößen berechnen und daraus erste analoge Näherungen gewinnen. Lineares b wird abgelesen; keine analoge quadratische Parameterbestimmung.
5. Regressionstyp wählen, Daten im tatsächlichen externen GeoGebra CAS auswerten und Parameter übertragen. Die Seite simuliert kein CAS. Die Beispieldaten sind idealisiert und passen exakt.
6. Eine allgemeine Gleichung mit vorgegebenen Koeffizienten in eine physikalische Gleichung übertragen: Formelzeichen, auf drei signifikante Stellen gerundete Koeffizienten und Einheiten direkt an ihren Stellen in der Gleichung eintippen. Dezimalzahlen ohne E-/Zehnerpotenzschreibweise; erforderliche Endnullen werden geprüft. Die Lösung füllt dieselben Gleichungsfelder direkt aus; es erscheint keine zweite Gleichung. Die Formelzeichenfelder enthalten zunächst y und x zum Ersetzen. Koeffizient und Einheit stehen ohne zusätzliche Klammern nebeneinander.

Die Übungen verwenden proportionale, lineare und quadratische Zusammenhänge. Die fünf Funktionstypen des bestehenden Nachschlagewerks bleiben unverändert zugänglich. Bei Zahleneingaben werden Komma und Punkt akzeptiert. Falsche Antworten können korrigiert werden. **Lösung ansehen** zeigt den Lösungsweg und erlaubt das Fortsetzen; die Runde wird dann als mit Lösungshilfe abgeschlossen gekennzeichnet. Licht-, Fenster- und Bildfehlzuordnungen sowie die konkrete Streuungs-Beurteilungsaufgabe der Klausur sind nicht Teil der neuen Übungen.

## Lokal öffnen

`dist/index.html` direkt im Browser öffnen oder aus diesem Verzeichnis `python -m http.server 8768 --directory dist` starten. Keine Installation und keine externen Bibliotheken erforderlich. Die Website benötigt weder Konto noch Dateneingabe; die Suche läuft lokal im Browser.

## Bearbeiten

- `dist/index.html`: Seitenrahmen und Navigation.
- `dist/app.js`: Inhalte, Diagramme, Suche und Funktionsvergleich.
- `dist/style.css`: responsive Darstellung.
- `dist/proof.js` und `dist/proof.css`: fünf ausführliche Rechenhilfen zu Schritt 4 „Vermutung prüfen und erste Näherung machen“, mit Beispieltabelle, farbigen Größen, Pfeilen, analogen Näherungen und Einheitenherleitungen. Schritt 5 behandelt die Regression; Schritt 6 fasst Rundung und Einheitenkontrolle zusammen.
- `dist/exercise-data.js`: reine Aufgabengeneratoren und eindeutige Lösungsschlüssel; auch mit Node prüfbar.
- `dist/exercises.js` und `dist/exercises.css`: Übungsoberfläche, Eingabeprüfung, SVG-Diagramme und Rückmeldungen.
- `dist/diagram-exercise.js` und `dist/diagram-exercise.css`: SVG-Bedienung mit Achsen-Auswahl, Skalierungsreglern und Zeichnen per Klick bzw. Tastatur.

## Prüfungen der Übungen

`node --test tests/*.test.cjs` prüft Generatoren, Rechnungen, Einheiten, Zahleneingaben und Rundung. Alle Varianten werden mit jeweils 100 reproduzierbaren Zufallsfolgen geprüft; zusätzliche Tests rechnen Mittelwerte, Quotienten, Differenzen, CAS-Parameter und Rundungsgrenzen unabhängig nach.

`node tests/browser.cjs` nutzt Playwright (über `NODE_PATH` bereitstellen) und installiertes Chrome. Es durchläuft alle 14 Varianten mit richtigen und leeren Antworten, Lösungseinblendung und Neustart. Es zeichnet die Punkte und Balken per Klick und prüft zusätzlich Tastaturbedienung und Zurücksetzen. Außerdem werden 1280, 820, 390 und 320 Pixel breite Ansichten auf Seitenüberlauf geprüft. Screenshots und Ergebnisdatei liegen im ignorierten Ordner `qa/`. Lokal als Datei getestet; keine Veröffentlichung oder Prüfung in einer echten Schüler-CAS-Sitzung erfolgt.

Die Formeln verwenden HTML mit Hoch-/Tiefstellung und gesetzten Brüchen. Die Diagramme sind schematische SVGs, keine GeoGebra-Screenshots. Analoge Verfahren und Stellenzahl-Faustregel bewusst beibehalten.

## Geprüft

- JavaScript-Syntax mit `node --check dist/app.js` und `node --check dist/proof.js`.
- Alle fünf neuen Beispieltabelle(n) rechnerisch geprüft: Quotienten, Produkte, Steigungen sowie erste und zweite Differenzen.
- Neue Rechenhilfen: alle fünf Tabs bei 320 Pixel Breite ohne Seitenüberlauf; zusätzliche Smartphone- und Tabletprüfung bei 390 bzw. 820 Pixel.
- Direktlinks zwischen Vermutung und Prüfung, Tastatursteuerung, ausklappbare Rechnungen und Suche in verdeckten Rechenseiten geprüft.
- Browser-Vorschau: 320 und 390 Pixel breite Smartphoneansichten sowie 820 Pixel breite Tabletansicht; kein horizontaler Seitenüberlauf.
- Suchtreffer einschließlich verdeckter Funktionstypen, leere Trefferliste und Rücksetzen auf alle sechs Schritte.
- Mobile Navigation, Sprunglinks, Funktionstabs und aufklappbare Vertiefungen.
- Keine Fehler im Browserprotokoll. Physische Geräte und Safari wurden nicht geprüft.

Die Dateien in `dist/` funktionieren auch ohne Hosting. Zum Verteilen müssen alle zehn Dateien dieses Ordners zusammenbleiben. `Messdaten-auswerten.zip` enthält die Website-Dateien direkt auf oberster Ebene. Neue Änderungen werden nicht automatisch veröffentlicht.

Die Schrittgrößen stehen als beschriftete Pfeile außerhalb der Tabellen: Δx links, Δy rechts (beim exponentiellen Beispiel der y-Faktor). An den tatsächlichen Zeilen ausgerichtet, bei Tabwechsel und Größenänderung neu berechnet; bei 320 und 820 Pixel Breite geprüft.
