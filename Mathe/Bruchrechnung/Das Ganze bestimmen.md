# Das Ganze bestimmen

Eigenständige HTML-App für eine weitere Seite des Brüche-Buchs. Die Datei enthält Gestaltung, Zeichnungen und Programm und benötigt keine externen Bibliotheken. Ausgangspunkt ist eine bekannte Teilmenge; gesucht ist das Ganze.

## In EduLudoo einsetzen

1. Auf einer **eigenen Buchseite** das Texteingabefeld **E1** anlegen und aus der Bewertung nehmen.
2. Einen Lückentext **E2 mit 20 Lücken** einfügen. Jede Lücke akzeptiert `1` als richtige Lösung und gibt einen Punkt; `0` steht für noch nicht erreicht.
3. **Das Ganze bestimmen.html** als HTML-Widget auf derselben Seite einfügen.
4. Im Lernbetrieb eine Aufgabe bearbeiten, die Seite verlassen und wieder öffnen. Den tatsächlichen serverseitigen Erhalt des Lernstands auf der eingesetzten Seite prüfen.

Das Widget verbindet sich mit `e1_text_input` und `e2_cloze_text_input_1` bis `e2_cloze_text_input_20`. Im Lernbetrieb blendet es diese Felder aus. Im erkannten Editor bleibt die Vorschau vorübergehend; Hostfelder bleiben sichtbar und unverändert. Fehlende Punktefelder verhindern das Üben nicht und werden als Verbindungsproblem gemeldet.

Eigene Kennungen verhindern die Vermischung mit anderen Widgets:

- Wurzelelement: `wholeWidget`
- Lernstand: `widget: das-ganze-bestimmen`, Version 1
- E1-Präfix: `GANZES1:` mit UTF-8/Base64-kodiertem JSON (keine Verschlüsselung)
- Browserfallback: `bruchrechnung-das-ganze-bestimmen-v1`

Base64 schützt den Text vor EduLudoos automatischer Anführungszeichenersetzung. Fremde oder beschädigte Speichertexte werden nicht überschrieben. Ohne EduLudoo speichert die App lokal im Browser; innerhalb von EduLudoo ist E1 maßgeblich. Bei fehlender Verbindung wird kein Browserstand übernommen. Optional: `edulo=1`, `STATE_ID=...`, `SCORE_PREFIX=...`, `SHOW_FIELDS=1`, `editor=1`.

## Lernwege

Beispiel: **Drei Viertel entsprechen 90 g. Bestimme das Ganze.**

**Zuerst teilen:** Das Ganze in Viertel unterteilen → drei Viertel im selben Gegenstand markieren → nach Bestätigung erhalten die markierten Teile gemeinsam die Beschriftung `90 g` → `90 g ÷ 3 = 30 g` für ein Viertel berechnen → alle vier Viertel, auch das noch leere, mit `30 g` beschriften → `30 g × 4 = 120 g` für das Ganze berechnen.

Beim Beispiel **zwei Drittel entsprechen 200 ml** lauten die vier Schritte: „Teile das Ganze in Drittel“, „Markiere zwei Drittel“, „Wie viele Milliliter entsprechen einem Drittel?“ und „Wie viele Milliliter fasst das ganze Gefäß?“. Eine Klammer verbindet die markierten Bereiche mit genau einer kräftigen gemeinsamen `200 ml`-Beschriftung. Nach der Eingabe `100` erscheinen `100 ml` in allen drei Dritteln; `300 ml` erscheint erst nach der letzten Rechnung. Das unmarkierte Drittel bleibt im selben Gefäß über den beiden markierten Dritteln sichtbar, wenn die unteren beiden Teile gewählt werden.

**Zuerst vervielfachen:** Das Ganze unterteilen → den bekannten Anteil markieren und gemeinsam beschriften → mit einem Kopienregler Zähler viele ganze Ziele füllen → die Menge aller Ziele zusammen berechnen → die Menge eines Ganzen berechnen. Der geführte Weg enthält fünf geprüfte Schritte.

Beispiel **drei Fünftel entsprechen 36 cm**: „Teile das Ganze in Fünftel“ → „Markiere drei Fünftel“ → „Wie oft brauchst du dieses markierte Stück, um drei ganze Strecken zu füllen?“ → „Wie lang sind die drei ganzen Strecken zusammen?“ (`36 cm × 5 = 180 cm`) → „Wie lang ist eine ganze Strecke?“ (`180 cm ÷ 3 = 60 cm`). Einheit und Gegenstandsbezeichnungen passen sich der Situation an.

Eine Kopie füllt drei Fünftel der ersten Strecke. Die zweite füllt die restlichen zwei Fünftel und ein Fünftel der zweiten Strecke. Gleiche Farben kennzeichnen alle Teile desselben Stücks auch über eine Zielgrenze hinweg. In den Farbflächen stehen keine wiederholten Nummern. Die Legende nennt bei Längen „Stück 1“, „Stück 2“ usw.; bei Flüssigkeiten entsprechend Portionen, bei Eiern Gruppen und bei Zeitspannen Abschnitte. Fünf Kopien füllen die drei Ziele genau. Zu viele Kopien werden als Überfüllung gemeldet. Die Zähler vielen realen Zielgegenstände ersetzen das Ausgangsbild direkt an dessen Stelle. Für alle Motive stehen sie nebeneinander mit kleinen Abständen in einem gemeinsamen Hauptbild. Bei schmalen Bildschirmen bleibt die Reihe seitlich scrollbar, damit die Gegenstände lesbar bleiben. Es gibt kein zusätzliches Ausgangsbild über den Zielen und kein separates abstraktes Schema. Bestätigte Gleichungen bleiben oben im Bild; Gesamt- und Einzelmengen werden erst nach der jeweiligen richtigen Rechnung gezeigt.

**Selbst entscheiden:** Einen der beiden Wege wählen und beide Zahlenergebnisse selbst berechnen. Keine zusätzlichen Pflichtschritte zum Unterteilen, Markieren oder Kopieren. Die Darstellungen entstehen automatisch passend zum Weg: Beim Vervielfachen sind die Ziele bereits mit der passenden Anzahl Anteilskopien gefüllt, die Mengen müssen selbst berechnet werden. Für die Statistik zählt der tatsächlich gerechnete Weg.

Die Situation nennt die bekannte Menge vor dem Rechenauftrag. Bestätigte Fragen und Antworten bleiben oberhalb der aktuellen Eingabe stehen; die Bilder folgen zuletzt. Rechenhilfen erscheinen nur auf Wunsch oder nach einem Fehler. Der Hilfe-Dialog erläutert beide Wege. Bestätigte Gleichungen bleiben im Bild sichtbar. Nach der Einzelteil-Rechnung stehen die berechneten Mengen in sämtlichen Teilflächen desselben Gegenstands; das Ganze erhält erst nach seiner Berechnung ein Ergebnisetikett. Im Weg „Zuerst teilen“ gibt es kein separates Ergänzungsschema.

## Aufgaben und Bilder

20 Situationen: Cola, Orangensaft, Wasser, Milch, Limonade, Messspritze ohne Nadel, dunkle und weiße Schokolade, Butter, Ton, Mehl, Reis, Lineal, Maßband, Geschenkband, Seil, Minuten, Sekunden, Stunden und Eier.

Beim Weg **Zuerst teilen** zeigt ein durchgehend gleiches Gefäß, eine Tafel, ein Block, eine Strecke, eine Uhr oder eine Eierpackung das **unbekannte Ganze**. Nur die gewählten Teile sind gefüllt beziehungsweise farbig; die hellen oder leeren Bereiche ergänzen sie zum Ganzen. Zahlen auf Skalen verraten weder die Einzelmenge noch die Gesamtmenge. Schokoladentafeln enthalten 24 Stückchen; der Unterteilungsregler erlaubt dafür nur passende Gruppen. Eier werden nur in ganze Eiergruppen geteilt; die noch unbekannten Bereiche bleiben leer. Zeitdarstellungen sind ein festes Bruchschema der gesamten Zeitspanne mit Viertelmarken; sie verraten keine Dauer und stellen keine Uhrzeit dar.

Beide geführten Wege beginnen mit demselben neutralen Ganzen, dessen Unterteilung und der Markierung des bekannten Anteils. Beim Vervielfachen füllen die Anteilskopien danach Zähler viele reale Zielbilder proportional. Auch hierbei bleiben nicht gefüllte Teile hell und unbekannte Mengen unbeschriftet. Bei Eiern enthält jede Teilgruppe ausschließlich ganze Eier; Schokoladentafeln bestehen auch in den Zielen aus 24 Stückchen. Das Maßband-Szenario zeigt den übernommenen Holzlattenzaun im Hintergrund; das störende gelbe Maßbandgehäuse wurde in beiden Apps entfernt. Bei Längen entfällt in dieser App der unbeschriftete Pfeil über die gesamte unbekannte Länge. Nach bestätigter Markierung kennzeichnet ein Doppelpfeil nur den bekannten Abschnitt. In der gemeinsamen Vervielfachungsdarstellung erhält jedes vollständige gleichfarbige Stück genau eine Mengenangabe, etwa 9 m; über Zielgrenzen hinweg verbinden gestrichelte Linien seine Abschnitte. Teilstücke erhalten dadurch nicht fälschlich jeweils die volle Mengenangabe.

Zähler sind mindestens zwei und kleiner als der Nenner. Beide Rechenwege haben ausschließlich ganze oder halbe Zwischen- und Endwerte. Bei Eiern sind alle Mengen ganzzahlig. Schokoladen-Nenner teilen 24 ohne Rest. Geprüfte Antworten müssen berechnete Zahlen sein; Brüche und Ausdrücke wie `90/3` sind unzulässig. Dezimalkomma und korrekt gruppierte Tausenderpunkte werden erkannt, beispielsweise `1,5` und `1.600,5`.

Die Auswahl läuft in Runden über **Zahlenaufgaben**, unabhängig von Motiv und Einheit. Die Zahlenidentität besteht aus Ausgangsmenge sowie dem vorgegebenen Zähler und Nenner. In „Das Ganze bestimmen“ ist damit auch die bekannte Teilmenge eindeutig festgelegt. Jede Zahlengruppe wird in einer Runde genau einmal mit einer zufällig passenden, bislang unbenutzten Situation gezogen. Bereits das Ziehen reserviert Zahlenaufgabe und konkrete Variante dauerhaft, auch ohne Antwort und bei Moduswechsel oder Neuladen.

Erst nach der vollständigen Zahlenrunde folgen alle darin mit Fehlern abgeschlossenen Aufgaben genau einmal im selben Motiv. Diese Wiederholungsrunde erzeugt auch bei erneuten Fehlern keine weitere Warteschlange. Danach beginnt die nächste Zahlenrunde mit bislang unbenutzten Situationen. Gruppen ohne weitere Varianten fallen heraus. Nach dem vollständigen Variantenpool und seiner letzten Fehlerwiederholung ist die Auswahl beendet.

Schwierigkeit und Darstellungswechsel beeinflussen nur die Reihenfolge innerhalb der noch nicht gezogenen Aufgaben; sie erlauben keine vorzeitigen Zahlenwiederholungen. In „Anteile berechnen“ können am Ende einer Runde Aufgaben verbleiben, die wegen ihres Zwischenwerts ausschließlich für „Zuerst vervielfachen“ vorgesehen sind. Dann fordert die App zum passenden Moduswechsel auf, statt eine neue Runde zu beginnen. „Das Ganze bestimmen“ besitzt einen für beide Wege geeigneten gemeinsamen Pool.

Runde, Phase, reservierte Kombinationen, gezogene Zahlengruppen und die endliche Fehlerwarteschlange werden mit dem Lernstand gespeichert. Vorhandene Historien werden übernommen: bereits bearbeitete Kombinationen gelten als benutzt, ihre Zahlengruppen als gezogen; pro Kombination wird höchstens der letzte noch fehlerhafte Abschluss einmal vorgemerkt. Die bestehende Aufgabe und erreichte Punkte bleiben erhalten. Alte, nicht gespeicherte Ziehungen lassen sich rückwirkend nicht rekonstruieren.

`tests/selection.test.cjs` durchläuft beide vollständigen Pools, prüft Zahlen- und Motivduplikate, Rundenwechsel, falsche Wiederholungen ohne Endlosschleife, endgültige Erschöpfung, Reservierung und Wiederherstellung. Aktuell: „Das Ganze bestimmen“ 981 Zahlengruppen / 4.187 Varianten; „Anteile berechnen“ 1.156 Zahlengruppen / 4.963 Varianten.

## Historie und Punkte

Alle Prüfversuche, auch leere und ungültige Eingaben, bleiben gespeichert. Eine Aufgabe zählt nur dann als auf Anhieb richtig, wenn jeder geprüfte Schritt beim ersten Versuch stimmt. Ein Tippabruf wird protokolliert, ist für sich aber kein Fehler. Eine Aufgabe wird genau einmal gewertet. Noch offene geführte Aufgaben aus einer jeweils früheren Schrittfolge beginnen mit derselben Aufgabe beim neuen Unterteilungsschritt. Ihr bisheriger Zwischenstand bleibt als `previousFlow` im Lernstand erhalten; vorhandene Punkte und abgeschlossene Aufgaben bleiben bestehen. Bereits entstandene Fehler bleiben für die Wertung dieser Aufgabe berücksichtigt. Historie und Statistiken sind zunächst zugeklappt; Punkte und fehlende Aufgaben bleiben sichtbar.

Für Punkt `p` werden insgesamt `p × (p + 3)` auf Anhieb richtige Aufgaben benötigt: 4, 10, 18, 28, 40, 54, 70, 88, 108, 130, 154, 180, 208, 238, 270, 304, 340, 378, 418, 460. Ab Punkt 3 muss zusätzlich mindestens ein aufgerundetes Fünftel der jeweiligen Schwelle mit **jedem** Rechenweg gelöst sein. Alle bisherigen Lösungen zählen weiter; erreichte Punkte bleiben erhalten.

## Prüfung

`tests/ganze.test.cjs` ist der eigene Integrationstest. Er prüft alle drei Modi und beide freien Wege, das Beispiel 90 → 30 → 120 beziehungsweise 90 → 360 → 120, Eingaben, Fehlversuche, Wiederherstellung, Aufgabenwechsel, alle 20 Punkteschwellen sowie sämtliche Situationen bei 1000, 390 und 320 Pixeln Breite. Zusätzlich werden E1/E2, fremde Lernstände, Editorvorschau und wiederholtes **tatsächliches jQuery-2.1.1-Einfügen** mit anschließender Bedienung geprüft. Sichtbare Eierformen, 24 Schokoladenstücke und Uhrbeschriftungen werden kontrolliert. Der zusätzliche Regressionstest bearbeitet das 200-ml-Beispiel bei 1000 und 390 Pixeln Breite Schritt für Schritt: ein einziges durchgehendes Bild, drei Teile, zwei Markierungen, genau eine gemeinsame 200-ml-Angabe, anschließend drei 100-ml-Angaben einschließlich des leeren Drittels und zuletzt 300 ml. Der Vervielfachungs-Test bearbeitet zusätzlich das 36-cm-Beispiel: drei Zielstrecken, grenzübergreifende Kopien, unvollständige und vollständige Füllung, Überfüllung, fünf Schritte und erst nach korrekter Antwort sichtbare 180 beziehungsweise 60 cm. Auch Zwischenstand-Wiederherstellung, verbotene Rechenausdrücke und die Umstellung alter Aufgaben werden geprüft.

Ausführung: `PLAYWRIGHT_MODULE` auf eine lokale Playwright-Installation setzen und `node tests/ganze.test.cjs` aus diesem Ordner aufrufen. Optional erzeugt `SCREENSHOT_DIR` Bildschirmaufnahmen. Standardbrowser ist Microsoft Edge; `BROWSER_CHANNEL` kann ihn ändern. Tests werden nicht in EduLudoo hochgeladen.

Alle SVG-Elemente in JavaScript-Strings haben explizite Endtags. Selbstschließende SVG-Tags dürfen hier nicht eingeführt werden: Der ältere jQuery-HTML-Prefilter kann sonst Zeichnungen innerhalb von Schleifen beschädigen.


## Kompaktes Layout (17. September 2026)

Aufgabe, Visualisierung und Eingabefelder stehen in einer gemeinsamen Fläche. Regler und Prüfen sind direkt darunter angeordnet; abgeschlossene Schritte werden nicht zusätzlich als lange Liste angezeigt. Historie und Punkte bleiben erhalten. Der Titel wird in der Edulo-Einbettung ausgeblendet. Im Modus „Selbst entscheiden“ folgt nach der Wegwahl derselbe vollständige Ablauf wie bei direkter Wahl.

Die bisherige Widgetkennung, das Speicherpräfix, E1/E2 und der lokale Speicherschlüssel bleiben erhalten. `tests/compact-layout.test.cjs` prüft gespeicherte Altstände mit 100 Ergebnissen und acht Punkten, beide Wege einschließlich freier Wahl, Wiederherstellung nach jedem Schritt und alle Motive in zwei Breiten. Die Altstände in `tests/fixtures` wurden mit der vorherigen App-Fassung erzeugt; es sind synthetische Testdaten.
