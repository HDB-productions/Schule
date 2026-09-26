# Bewegungstrainer – überarbeiteter Prototyp

`widget.html` ist die uploadfähige Einzeldatei ohne externe Abhängigkeiten. Keine Veröffentlichung, kein Push.

## Quellen und Vorschau

Quellen: `domain.js` (Fachlogik, Texte, Prüfung, Zustand), `ui.js` (Bedienung), `visuals.js` (gestufte Hilfsskizzen), `app.css`, `widget.quelle.html`. `app.js` wird beim Build aus Domain, Hilfsskizzen und UI erzeugt. `situationstexte.md` enthält alle tatsächlich verwendeten Situationsvorlagen mit Zahlenplatzhaltern zur redaktionellen Durchsicht.

Vom Repository-Hauptordner:

```powershell
node 'Physik/Edulo Mechanik/Bewegungstrainer/build.cjs'
node --test 'Physik/Edulo Mechanik/Bewegungstrainer/domain.test.cjs'
node 'Physik/Edulo Mechanik/Bewegungstrainer/browser.test.cjs'
node 'Physik/Edulo Mechanik/Bewegungstrainer/integration.test.cjs'
node 'Physik/Edulo Mechanik/Bewegungstrainer/preview.cjs'
```

Vorschau: http://127.0.0.1:8766 (nur lokal). Nach einem Build die Vorschau neu laden. Der Browsertest verwendet die gebündelte Playwright-Laufzeit und Edge.

## Ablauf

0. Angaben ordnen: bei zwei Ortsmessungen Zeit-Ort-Wertetabelle (t oben, s unten), sonst passende gegebene Größen. Anfangsposition und zurückgelegte Strecke sind getrennte Größen. Uhrzeitfelder verwenden Stunde:Minute; zusätzlich wird die Dauer Δt in Minuten berechnet. Formelzeichen stehen auch in den Tabellenzeilen.
1. Falls nicht gegeben: Geschwindigkeit bestimmen, festes `v =` vor der Eingabe.
2. Falls nicht bereits eingetragen: Anfangsposition bestimmen, festes `s₀ =`.
3. Bewegungsformel als Größengleichung, festes `s(t) =`; Geschwindigkeit und Anfangsposition werden mit Einheiten eingegeben. Beispiel: `60 km/h · t + 8 km`. Der sichere Parser prüft lineare Ausdrücke und Dimensionen.
4. Spätere Position berechnen.

Die tatsächlichen Teilaufgaben werden ohne Lücken durchnummeriert. Bereits in der Vorbereitung eingetragene Größen werden nicht erneut abgefragt und geben keinen zusätzlichen Punkt. Zahlenantworten dürfen Rechenansätze mit Einheiten enthalten; +, −, ·, / und Klammern sowie km, km/h und h stehen zur Verfügung. Für Geschwindigkeitsrechnungen muss die Zeit in Stunden angegeben werden.

Abgeschlossene Ergebnisse bleiben mit Nummer, Formel und Ergebnisstatus über der nächsten Teilaufgabe sichtbar. Eingabebedienung und Hinweise abgeschlossener Schritte verschwinden. Es gibt ausschließlich eigene Bildschirmtasten; kein editierbares HTML-Eingabefeld.

## Hilfe und Punkte

Drei gestufte Hinweise. Für die Formel: allgemeines Muster `s(t) = v · t + s₀`, Aufforderung zum Einsetzen, einzelne konkrete Größen mit Einheiten. Der dritte Hinweis enthält keine fertig zusammengesetzte Formel. Ein weiterer falscher Prüfversuch nach dem dritten Hinweis trägt die vollständige Lösung automatisch ein, markiert sie rot und schließt die Teilaufgabe **ohne Punkt** ab. Weiterarbeiten ist möglich.

20 erfolgreich gelöste Teilaufgaben füllen 20 Punkte. Ohne Fehlversuch/Tipp grün, sonst gelb. Automatische Hinweise gelten als Hilfe. Hilfen/Fehler in der Vorbereitung oder eine frühere vorgegebene Lösung verhindert grüne Punkte in abhängigen Folgeschritten (gelb bleibt möglich). Weitere selbstständige Lösungen können gelbe Punkte aufwerten. Grüne Punkte werden nicht abgewertet. Die Vorbereitung gibt keinen Zusatzpunkt. Auch nach 20 Punkten entstehen weitere Zufallssituationen.

## Speicherung

Baukasten-Bridge unverändert: E1 Text ist der vollständige aktuelle Lernstand, E2 hat 20 Cloze-Felder mit Lösung jeweils 1. `hideFooter: true`. Eingaben werden gebündelt gespeichert, Prüfungen sofort. Standalone lokaler Browserspeicher, eingebettet ausschließlich die Edulo-Anbindung. Keine wachsende Historie: aktuelle Aufgabe samt Vorbereitung, vier Schritte mit Entwürfen/Cursor/Fehlern/Hilfen/Ergebnisstatus und begrenzte Punktezähler.

Bridge-Version bleibt 1; fachliches Schema 3 übernimmt alte Prototypstände. Bereits erreichte Punkte und Eingaben bleiben erhalten; ein bereits begonnener alter Aufgabendurchlauf muss die neue Vorbereitung nicht nachholen. `legacy.fixture.json` ist ein künstlicher Prüfstand aus der ersten Prototypversion, kein echter Schülerdatensatz. Schema-2-Uhrzeitaufgaben erhalten das zusätzliche Dauerfeld; bei bereits abgeschlossener Vorbereitung wird es automatisch ergänzt. Laden allein schreibt keine Punkte neu.

## Prüfungen und Grenzen

Fachtests prüfen Generatorinvarianten, alle Textvarianten, Einheiten und äquivalente Formeln, Vorbereitungen, Hilfe/Lösungsfreigabe, Punkte-Aufwertung, neue Lernstände und Altdatenübernahme. Browserprüfungen verwenden die tatsächlichen Bildschirmtasten: alle sechs Vorbereitungen, Cursor, Fehler/Tipp, Einheitenformel, automatisch vorgegebene Lösungen ohne Punkt, stehenbleibende Ergebnisse, Wiederöffnung und Layout bei 920 × 768 / 390 × 844 px.

Die große Kopfzeile ist entfernt, die Punkteanzeige steht unter der Aufgabe. Auf schmalen Displays scrollt der Aufgabenbereich. Screenshots: `preview-920.png`, `preview-390.png`, `preview-390-eingabe.png`, `preview-results-920.png`, `preview-results-390.png`, `preview-revealed.png`, `preview-hints-920.png`, `preview-hints-390.png`.

**Noch nicht live in Edulo oder auf einem echten Tablet geprüft.** Einbettung, Serverpersistenz und Wiederöffnung in Edulo vor Unterrichtseinsatz prüfen. Die lokale Baukasten-Suite hatte bereits für den ersten Prototyp bestanden; die Bridge wurde nicht geändert.


Die einzeln geprüften Inhaltskriterien und Nachbesserungen sind in `QUALITAETSPRUEFUNG.md` dokumentiert.


Rechenansätze bleiben in abgeschlossenen Ergebniszeilen sichtbar und werden um den berechneten Wert mit Einheit ergänzt, beispielsweise `v = 36 km / 0,5 h = 72 km/h`. Das gilt auch für abgeschlossene numerische Vorbereitungsfelder; Bewegungsformeln bleiben als Formel stehen. Die ursprüngliche Eingabe bleibt gespeichert.
