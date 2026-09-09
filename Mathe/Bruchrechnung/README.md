# Bruchrechnung: Brüche verstehen

`Brueche verstehen.html` ist das erste eigenständige Widget. Die Datei enthält Oberfläche, Gestaltung und JavaScript und benötigt keine weiteren Dateien oder Internetbibliotheken. Der Ordner `tests` gehört nur zur Entwicklungsprüfung und wird nicht hochgeladen.

## In EduLudoo erproben

1. Ein Texteingabefeld **E1** anlegen und aus der Bewertung nehmen. Darin speichert das Widget seinen vollständigen Lernstand als kodierten Text.
2. Einen Lückentext **E2** mit **zehn Lücken** anlegen. Jede Lücke muss die `1` als richtige Lösung akzeptieren; `0` bedeutet noch nicht erreicht. Jede Lücke als einen Punkt bewerten.
3. Die HTML-Datei als Widget auf derselben Seite einbinden.

Die vorhandenen EduLudoo-Exportdateien verwenden für das Texteingabefeld `e1_text_input` und für die zehn Lücken `e2_cloze_text_input_1` bis `e2_cloze_text_input_10`. Diese Zuordnung wird automatisch gesucht. Nach erfolgreicher Verbindung blendet das Widget E1 und E2 aus und setzt bei Änderungen die Werte mit `input`- und `change`-Ereignissen. Das Ausblenden entfernt die Felder aus der normalen Bedienoberfläche; es ist kein Zugriffsschutz gegen Entwicklertools.

Die Speicheranzeige meldet, ob die Werte an EduLudoo übergeben wurden. Eine tatsächliche serverseitige Speicherung kann nur beim Test in EduLudoo bestätigt werden: Aufgabe bearbeiten, Seite verlassen und wieder öffnen. Es wurde noch keine echte EduLudoo-Seite verändert.

**Editor-Kompatibilität:** Das JavaScript läuft in einem eigenen Funktionsbereich und die CSS-Regeln gelten nur innerhalb des Widgets. Das ist wichtig, weil das HTML-Modul in den vorhandenen EduLudoo-Dateien den HTML-Inhalt direkt in sein Dokument einfügt. Ein globaler Widget-Helfer namens `$` würde dort den jQuery-Zugriff des Editors verdecken. Dieser Konflikt wurde lokal reproduziert und behoben. Wiederholtes Einfügen erzeugt keine globalen Variablenkollisionen; entfernte Widget-Instanzen melden ihre Ereignisbehandlung wieder ab.

Anhand der vorhandenen EduLudoo-Editormarkierungen (`widget.isEditor`, Body-Klasse `editor` oder URL-Parameter `editor=1`) startet das Widget eine separate Editor-Vorschau. Diese liest keinen Lernstand ein, schreibt keine Werte in die EduLudoo-Felder und blendet sie nicht aus. Im normalen Lernbetrieb bleibt die Speicherung aktiv. Nach dem Ersetzen der HTML-Datei den Editor vollständig neu laden, damit globale Definitionen der alten Version entfernt werden. Der vollständige Editor wurde nicht live bedient; die Einbettung mit dessen jQuery-Version wird lokal nachgebildet.

**Speicherformat:** EduLudoo ersetzt in Texteingabefeldern gerade Anführungszeichen durch deutsche Anführungszeichen. Unkodiertes JSON wird dadurch ungültig. Deshalb speichert das Widget in E1 jetzt `BRUCH1:` gefolgt von Base64-kodiertem UTF-8-JSON. Das ist eine Textkodierung, keine Verschlüsselung. Beim Laden werden auch bisheriges JSON und durch deutsche Anführungszeichen verändertes JSON gelesen und nach erfolgreicher Prüfung in das neue Format überführt. Andere beschädigte oder unbekannte Daten werden nicht überschrieben. Zum Aktualisieren der HTML-Datei E1 daher nicht leeren.

Optionale URL-Parameter:

| Parameter | Zweck |
| --- | --- |
| `edulo=1` | EduLudoo-Modus ausdrücklich aktivieren; in einem eingebetteten Fenster ist er ohnehin aktiv. |
| `STATE_ID=e1_text_input` | Exakte ID des Texteingabefelds festlegen. |
| `SCORE_PREFIX=e2_cloze_text_input_` | Präfix der zehn Punktefelder ändern. Die Nummerierung beginnt bei 1. |
| `SHOW_FIELDS=1` | EduLudoo-Felder beim Test sichtbar lassen. |

Die direkte Feldverbindung setzt voraus, dass das Widget auf das Dokument der einbettenden Seite zugreifen darf. Bei einer durch Browserregeln isolierten Einbettung oder fehlendem E1 meldet das Widget den Fehler und lädt ausdrücklich keinen lokalen Ersatzstand. Die genaue Einbettungsvariante muss in EduLudoo geprüft werden.

## Ohne EduLudoo

Die HTML-Datei direkt im Browser öffnen. Der Stand wird unter `bruchrechnung-brueche-verstehen-v1` im lokalen Browserspeicher abgelegt. Er gehört zu diesem Browserprofil und dieser Herkunft bzw. bei lokalen Dateien zum browserabhängigen Dateikontext. Umbenennen, Verschieben, Privatmodus oder Löschen der Browserdaten kann die Verfügbarkeit verändern. Innerhalb von EduLudoo wird dieser lokale Stand nicht eingelesen.

## Lernablauf und Bewertung

- Stufe 1: echte Brüche. Wortbruch aufschreiben, ein Ganzes mit dem Regler unterteilen, passende Teile antippen.
- Beim Unterteilen steht zuerst die Frage, dann das Quadrat und darunter die Teilezahl, der Schieberegler und der Prüfbutton. Die Einteilung ist sofort beim Verschieben sichtbar.
- Gemischte Zahlen erscheinen in der kurzen Form, beispielsweise `zwei zwei Drittel` oder `ein ein Drittel`. Die Erklärung darf weiterhin die ausführliche Form verwenden. Die Kurzform gilt auch bei der Anzeige bisheriger gemischter Aufgaben; Eingaben und Ergebnisse bleiben erhalten.
- Stufe 2: zusätzlich unechte Brüche und gemischte Vorgaben. Vor dem ersten Wechsel erscheint eine Erklärung. Das Feld für Ganze bleibt in Stufe 2 dauerhaft sichtbar und darf leer bleiben. Beide Schreibweisen sind erlaubt, wenn sie dieselbe Menge mit dem vorgegebenen Nenner ausdrücken.
- Ein vollständig markiertes Ganzes erzeugt in Stufe 2 ein weiteres leeres Ganzes. Das geschieht unabhängig von der gesuchten Lösung. Leere Ganze zählen nicht mit. Ein erneutes Antippen entfernt die Markierung.
- Eine abgeschlossene Aufgabe zählt nur dann als auf Anhieb richtig, wenn alle drei Schritte beim ersten Prüfen stimmen. Auch eine leere oder ungültige Antwort beim Prüfen zählt als Fehlversuch. Nachbessern bleibt möglich.
- Der bestätigte Zahlenbruch bleibt neben der Wortaufgabe sichtbar, auch als gemischte Zahl. Die Eingabefelder verschwinden nach erfolgreicher Prüfung.
- Der zunächst geschlossene Bereich **Historie** enthält den aufklappbaren Aufgabenverlauf und drei getrennte Statistiken: **Teile eines Ganzen**, **unechte Brüche** und **gemischte Zahlen**, jeweils mit erledigten, auf Anhieb richtigen und mit Fehlern bearbeiteten Aufgaben sowie der Trefferquote. Die Kategorie richtet sich nach der Vorgabe, nicht nach der vom Kind gewählten Schreibweise. Bereits gespeicherte Aufgaben werden entsprechend zugeordnet. Die Punkteleiste und die Bedingungen für den nächsten Punkt bleiben außerhalb der Historie dauerhaft sichtbar.
- Eingaben und Markierungen einer begonnenen Aufgabe werden gespeichert. Jede Prüfung wird mit Eingabe, Ergebnis und Zeit protokolliert. Der aufklappbare Verlauf zeigt die abgeschlossenen Aufgaben und ihre Prüfversuche.
- Nach dem ersten Prüfen bleibt die Stufe für diese Aufgabe fest, bis die Aufgabe abgeschlossen ist.
- Richtig gelöste Aufgaben werden auch nach einem Stufenwechsel nicht erneut gewählt. Aufgabenidentität umfasst Zähler, Nenner und Vorgabeform: `ein Halb` und `zwei Viertel` sind unterschiedliche Aufgaben; eine gemischte Vorgabe und ein unechter Wortbruch sind unterschiedliche Übungen.
- Falsch gelöste Aufgaben können mit Abstand wiederkehren. Eine später auf Anhieb gelöste Wiederholung zählt als neuer erfolgreicher Durchgang; der frühere Fehler bleibt in Statistik und Verlauf bestehen.
- Die Aufgaben beginnen mit kleinen Nennern. Mit wachsender Zahl bearbeiteter Aufgaben und höherer Trefferquote in der jeweiligen Kategorie werden größere Nenner wahrscheinlicher. Die Einführung in Stufe 2 erfolgt durch bewussten Stufenwechsel, nicht automatisch.
- Die Kategorieauswahl bevorzugt wenig geübte und unsicher gelöste Bereiche: Als Lernwert dient `Trefferquote × Anzahl richtiger Aufgaben`, wobei die Quote zwischen 0 und 1 liegt. Das Auswahlgewicht ist `1 / sqrt(1 + Lernwert)`. Die Kategorien werden vor der konkreten Aufgabe ausgewählt, damit unterschiedliche Poolgrößen keine Kategorie bevorzugen. Noch ungeübte Kategorien erhalten das höchste Gewicht. In Stufe 1 stehen ausschließlich Teile eines Ganzen zur Verfügung.
- Der aktuelle Aufgabenpool verwendet Nenner von 2 bis 24 und in Stufe 2 Werte unter vier Ganzen. Ist der Pool ausgeschöpft, erscheint eine Meldung. Bereits gemeisterte Aufgaben werden nicht stillschweigend wiederholt.

Alle auf Anhieb richtig gelösten Aufgaben zählen dauerhaft und unabhängig von ihrer Reihenfolge. Für die ersten drei Punkte ist ihre Verteilung beliebig. Ab dem vierten Punkt muss jede der drei Kategorien mindestens ein Fünftel der jeweiligen Gesamt-Schwelle beitragen, auf ganze Aufgaben aufgerundet. Bezugsgröße ist die feste Schwelle des Punktes, nicht die möglicherweise schon größere Anzahl bearbeiteter Aufgaben.

| Punkt | Richtige insgesamt mindestens | Richtige je Kategorie mindestens |
| --- | ---: | ---: |
| 1 | 4 | keine Vorgabe |
| 2 | 10 | keine Vorgabe |
| 3 | 18 | keine Vorgabe |
| 4 | 28 | 6 |
| 5 | 40 | 8 |
| 6 | 54 | 11 |
| 7 | 70 | 14 |
| 8 | 88 | 18 |
| 9 | 108 | 22 |
| 10 | 130 | 26 |

Beispiel für Punkt 4: 28 richtige Aufgaben insgesamt, darunter mindestens sechs echte Brüche, sechs unechte Brüche und sechs gemischte Zahlen. Die übrigen zehn sind frei verteilt. Alle früheren Aufgaben zählen mit. Überschüssige richtige Lösungen werden nicht verbraucht und zählen für folgende Punkte weiter. Eine einzelne neue Lösung kann bei diesen steigenden Schwellen und Mindestzahlen höchstens einen zusätzlich erfüllten Punkt bewirken.

Unter der Punkteleiste steht die fehlende Gesamtzahl und ab Punkt 4 zusätzlich die fehlende Anzahl je Kategorie. Bereits erfüllte Mindestzahlen sind gekennzeichnet. Die Kategorie-Aufgaben zählen gleichzeitig zur Gesamtzahl; die Zahlen sind nicht zusätzlich zusammenzurechnen. Wenn in Stufe 1 noch unechte Brüche oder gemischte Zahlen fehlen, wird auf Stufe 2 hingewiesen. Echte Brüche bleiben auch danach anrechenbar.

Erreichte Punkte bleiben bestehen, auch beim Laden von Lernständen aus früheren Versionen mit anderen Bewertungsregeln. Falsche Antworten ziehen keine Punkte ab. Nach zehn Punkten kann weitergeübt werden. Die Punkte gelten gemeinsam für das gesamte Widget.

## Prüfung

`tests/widget.test.cjs` prüft den Ablauf in einem echten Browser sowie eine lokal nachgebildete EduLudoo-Seite. Benötigt werden Node.js, Playwright und ein installierter Edge-Browser. Alternativ lässt sich der Browserkanal mit `BROWSER_CHANNEL` setzen. `PLAYWRIGHT_MODULE` kann auf eine vorhandene Playwright-Installation zeigen.

```text
node tests/widget.test.cjs
```

Der Test deckt Fehlerkorrekturen, drei Kategorien, gewichtete Auswahl, Gesamt- und Kategorienschwellen, Unabhängigkeit von der Aufgabenreihenfolge, dauerhafte Anrechnung, fehlende Kategorie-Aufgaben, Historie, unechte und gemischte Brüche, zusätzliche Ganze, Wiederherstellung, Aufgabenwiederholungen, Punkteübergabe, Ausblenden, fehlende Hostfelder, beschädigte Daten und schmale Ansichten ab. Die Host-Nachbildung ersetzt Anführungszeichen wie EduLudoo; alte so veränderte Lernstände werden testweise wiederhergestellt. Direkte Einbettung und wiederholtes Einfügen werden mit der vorhandenen EduLudoo-jQuery-Version geprüft. Die lokale Nachbildung ersetzt nicht den abschließenden Versuch auf einer echten EduLudoo-Seite.
