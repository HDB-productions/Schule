# Anteile berechnen

Die Datei **Anteile berechnen.html** ist ein eigenständiges Widget für die nächste Seite des Brüche-Buchs. Gestaltung, Zeichnungen und Programm sind vollständig enthalten; zusätzliche Dateien und Internetbibliotheken sind nicht nötig. „Brüche verstehen“ bleibt unverändert.

## In EduLudoo einsetzen

1. Auf einer eigenen Seite ein Texteingabefeld **E1** anlegen und aus der Bewertung nehmen.
2. Einen Lückentext **E2 mit 20 Lücken** hinzufügen. Jede Lücke akzeptiert `1` als richtige Lösung und entspricht einem Punkt; `0` bedeutet noch nicht erreicht.
3. **Anteile berechnen.html** auf derselben Seite als HTML-Widget einfügen.
4. Im Lernbetrieb eine Aufgabe bearbeiten, die Seite verlassen und wieder öffnen. Aufgabe, Eingaben und Lernstand müssen erhalten bleiben. Die echte serverseitige Speicherung lässt sich nur auf der eingesetzten EduLudoo-Seite bestätigen.

Das Widget sucht `e1_text_input` (sowie die bekannten Alternativnamen) und `e2_cloze_text_input_1` bis `e2_cloze_text_input_20`. E1 und E2 werden im Lernbetrieb ausgeblendet. Im erkannten Editor läuft eine getrennte, vorübergehende Vorschau: Die Hostfelder bleiben sichtbar und unverändert. Das Programm ist gegen Namenskonflikte mit dem Editor isoliert; wiederholtes Einfügen wurde mit der im Projekt vorhandenen jQuery-Version geprüft.

E1 enthält den vollständigen Verlauf und die aktuelle Aufgabe als UTF-8-Text in Base64 mit dem Präfix `ANTEIL1:`. Diese Kodierung verhindert, dass EduLudoos automatische Änderung von Anführungszeichen den Lernstand beschädigt. Das ist keine Verschlüsselung. Fremde oder beschädigte Lernstände werden nicht überschrieben. Das vorhandene E1 der Seite „Brüche verstehen“ nicht für diese neue Seite übernehmen.

Ohne EduLudoo genügt das Öffnen der HTML-Datei im Browser. Dort wird ein eigener lokaler Speicher verwendet. Innerhalb von EduLudoo ist E1 maßgeblich; fehlt die Verbindung, wird kein möglicherweise fremder Browserstand geladen. Die Speicheranzeige meldet Probleme und bietet einen erneuten Verbindungsversuch. Die Einbettung muss den Zugriff auf die Hostfelder erlauben.

Optionale URL-Parameter entsprechen dem ersten Widget: `edulo=1`, `STATE_ID=e1_text_input`, `SCORE_PREFIX=e2_cloze_text_input_`, `SHOW_FIELDS=1`. Ein erzwungener Editor-Test ist mit `editor=1` möglich.

## Drei Lernwege

**Zuerst teilen:** Das Ganze selbst unterteilen → einen Teil berechnen → die gesuchte Anzahl Teile antippen → deren Menge berechnen. Beispiel: fünf Siebtel von 21 m ergeben zunächst `21 m ÷ 7 = 3 m` und anschließend `3 m × 5 = 15 m`.

**Zuerst vervielfachen:** Anzahl gleicher Ausgangsmengen einstellen → Gesamtmenge berechnen → in gleich große Portionen unterteilen → eine Portion berechnen. Beispiel: drei Sechstel von 10 m ergeben `10 m × 3 = 30 m`, dann `30 m ÷ 6 = 5 m`. In jeder Ausgangsmenge wird dieselbe Unterteilung gezeigt; die grünen Stücke aus allen Darstellungen bilden zusammen eine Portion der Gesamtmenge.

**Selbst entscheiden:** Nach der Aufgabenstellung wird einer der beiden Wege gewählt. Die Bilder werden dann automatisch passend dargestellt; beide Rechnungen müssen selbst gelöst werden. Für Statistik und Punkte zählt der tatsächlich gewählte Weg.

In allen drei Modi steht zuerst die Situation mit konkreten Mengen und dem gesuchten Anteil, darunter der kurze Rechenauftrag. Bereits erledigte Schritte bleiben mit ihrer Frage und der bestätigten Antwort oberhalb des aktuellen Schritts sichtbar. Die Eingaben, Regler und Prüfbuttons stehen vor der Bilderbox; die Visualisierung bildet den Abschluss der Aufgabe und aktualisiert sich beim Verstellen sofort.

Die Aufträge zum Einteilen und Markieren nennen die Bruchbegriffe: beispielsweise „Teile das Ganze in Drittel“ und „Markiere zwei Drittel“. Die Kinder übersetzen diese selbst in Teilezahlen. Erst der Tipp oder die bestätigte Antwort erklärt „drei gleich große Teile“ beziehungsweise „zwei von drei Teilen markiert“.

Operationen werden nicht vorweggenommen: Eine Hilfe zum aktuellen Schritt erscheint über **Tipp zu diesem Schritt** oder nach einem Fehlversuch. Der Tipp verrät keinen späteren Rechenschritt. Nach einer richtigen Rechnung erscheint die bestätigte Gleichung innerhalb der Grafik über den dargestellten Gegenständen, mit einer hervorgehobenen Mengenangabe wie „Gesamtmenge: 1.600 g“, beispielsweise `4 × 400 g = 1.600 g`. Diese Menge bleibt beim anschließenden Unterteilen sichtbar. Beim Weg „Zuerst teilen“ steht nach der richtigen Berechnung die Menge eines Teils in jeder Teilfläche, beispielsweise viermal „30 g“. Die Beschriftung bleibt beim Antippen und nach dem Prüfen erhalten; bei engen Uhrsegmenten verbinden Linien die Mengenangaben mit den zugehörigen Bereichen. Die Fragen nennen die konkrete Einheit, beispielsweise „Wie viele Gramm wiegen die markierten Teile zusammen?“. Die zusätzlichen Beschriftungen „Ausgangsmenge 1, 2 …“ entfallen. Erst nach Abschluss zeigt die Übersicht mit Pfeilen den vollständigen Rechenweg.

Die Hilfeseite erklärt bei Bedarf beide Wege. Eingaben müssen ausgerechnete Zahlen sein, etwa `60` oder `1,5`; Brüche und Rechenausdrücke wie `240/4` werden abgewiesen. Deutsche Tausenderpunkte sind erlaubt: `1.600` entspricht `1600`, `1.600,5` entspricht `1600,5`. Ein Punkt mit genau drei nachfolgenden Ziffern wird bei gültiger Tausendergruppierung als Tausenderpunkt gelesen; für Dezimalzahlen ist das Komma eindeutig. Beim Teilen und bei freier Auswahl sind auch die Zwischenwerte ganze oder halbe Einheiten. Alte noch offene Aufgaben, die dafür einen gebrochenen Zwischenwert verlangen würden, werden beim Laden ersetzt; Verlauf und Punkte bleiben erhalten.

## Aufgaben und Darstellungen

20 Situationen mit acht Darstellungsarten: Cola, Orangensaft, Wasser, Milch und Limonade in Messbechern; eine Messspritze ohne Nadel; dunkle und weiße Schokolade; Butter und Ton als gleichmäßige Blöcke; Mehl und Reis in geradwandigen Behältern; Lineal, Maßband, Geschenkband und Seil; Zeitspannen in Minuten, Sekunden und Stunden; Eierpackungen.

- Flüssigkeiten werden innerhalb ihrer gefüllten Menge horizontal unterteilt. Die Größenbeziehung bleibt proportional. Eine Skalierung mit Mengenangaben macht die Ausgangsmenge sichtbar.
- Schokoladentafeln bestehen aus 24 gleich schweren Stückchen. Sichtbare Grenzen fassen diese zu gleich großen Gruppen zusammen. Der Regler bietet nur dazu passende Unterteilungen.
- Eier werden ausschließlich in ganze Eier und gleich große Gruppen geteilt. Die Aufgaben verlangen keine halben Eier.
- Zeit wird als Zeitspanne auf einem Zifferblatt dargestellt, nicht als gesuchte Uhrzeit. Ein voller Umlauf entspricht 60 Minuten, 60 Sekunden beziehungsweise 12 Stunden.
- Bei Mehl und Reis wird ein gleichmäßig gefüllter, geradwandiger Behälter angenommen; bei Butter und Ton ein gleichmäßiger Block.

Der Aufgabenpool enthält ausschließlich Brüche mit einem Zähler ab 2, damit beide Rechenschritte benötigt werden. Beim Öffnen wird eine bisher gespeicherte aktuelle Aufgabe mit Zähler 1 durch eine passende neue Aufgabe ersetzt; frühere Ergebnisse und Punkte bleiben erhalten. Endergebnisse sind ganze Zahlen oder halbe Einheiten. Im geführten Teilen und bei freier Auswahl gilt dies auch für den Zwischenwert. Beim Vervielfachen kommen gezielt auch ungekürzte Brüche vor, bei denen dieser Weg bequemere Zwischenwerte liefert. Schwierigkeit richtet sich nach Übungsumfang und jüngster Trefferquote. Wo möglich, wechselt auch die Darstellungsart zwischen Aufgaben.

Die Auswahl läuft in Runden über **Zahlenaufgaben**, unabhängig von Motiv und Einheit. Die Zahlenidentität besteht aus Ausgangsmenge sowie dem vorgegebenen Zähler und Nenner. In „Das Ganze bestimmen“ ist damit auch die bekannte Teilmenge eindeutig festgelegt. Jede Zahlengruppe wird in einer Runde genau einmal mit einer zufällig passenden, bislang unbenutzten Situation gezogen. Bereits das Ziehen reserviert Zahlenaufgabe und konkrete Variante dauerhaft, auch ohne Antwort und bei Moduswechsel oder Neuladen.

Erst nach der vollständigen Zahlenrunde folgen alle darin mit Fehlern abgeschlossenen Aufgaben genau einmal im selben Motiv. Diese Wiederholungsrunde erzeugt auch bei erneuten Fehlern keine weitere Warteschlange. Danach beginnt die nächste Zahlenrunde mit bislang unbenutzten Situationen. Gruppen ohne weitere Varianten fallen heraus. Nach dem vollständigen Variantenpool und seiner letzten Fehlerwiederholung ist die Auswahl beendet.

Schwierigkeit und Darstellungswechsel beeinflussen nur die Reihenfolge innerhalb der noch nicht gezogenen Aufgaben; sie erlauben keine vorzeitigen Zahlenwiederholungen. In „Anteile berechnen“ können am Ende einer Runde Aufgaben verbleiben, die wegen ihres Zwischenwerts ausschließlich für „Zuerst vervielfachen“ vorgesehen sind. Dann fordert die App zum passenden Moduswechsel auf, statt eine neue Runde zu beginnen. „Das Ganze bestimmen“ besitzt einen für beide Wege geeigneten gemeinsamen Pool.

Runde, Phase, reservierte Kombinationen, gezogene Zahlengruppen und die endliche Fehlerwarteschlange werden mit dem Lernstand gespeichert. Vorhandene Historien werden übernommen: bereits bearbeitete Kombinationen gelten als benutzt, ihre Zahlengruppen als gezogen; pro Kombination wird höchstens der letzte noch fehlerhafte Abschluss einmal vorgemerkt. Die bestehende Aufgabe und erreichte Punkte bleiben erhalten. Alte, nicht gespeicherte Ziehungen lassen sich rückwirkend nicht rekonstruieren.

`tests/selection.test.cjs` durchläuft beide vollständigen Pools, prüft Zahlen- und Motivduplikate, Rundenwechsel, falsche Wiederholungen ohne Endlosschleife, endgültige Erschöpfung, Reservierung und Wiederherstellung. Aktuell: „Das Ganze bestimmen“ 981 Zahlengruppen / 4.187 Varianten; „Anteile berechnen“ 1.156 Zahlengruppen / 4.963 Varianten.

## Verlauf und 20 Punkte

Eine Aufgabe zählt als auf Anhieb richtig, wenn **alle geprüften Schritte** beim ersten Versuch stimmen. Fehler dürfen verbessert werden; alle Prüfversuche und Eingaben bleiben im Verlauf erhalten. Auch leere oder ungültige geprüfte Zahleneingaben gelten als Fehlversuch. Eine Aufgabe wird nur einmal abgeschlossen und gewertet.

Ein ausdrücklicher Tippabruf wird zusätzlich im Lernstand gespeichert; der Abruf allein zählt nicht als falsche Antwort. Die bisherigen Lernstände können weiterverwendet werden: Abgeschlossene Schritte werden auch aus bereits gespeicherten Aufgaben wieder dargestellt.

**Historie** ist zunächst zugeklappt. Darin stehen frühere Aufgaben mit Rechenweg und Eingaben sowie die Gesamtstatistik und getrennte Statistiken für beide Rechenwege: erledigt, auf Anhieb richtig, mit Fehlern und Trefferquote. Die Punkte und fehlenden Aufgaben bleiben immer sichtbar.

Die Schwellen für insgesamt auf Anhieb richtige Aufgaben sind:

| Punkt | Gesamtzahl | Davon mindestens je Rechenweg |
| --- | ---: | ---: |
| 1 | 4 | frei |
| 2 | 10 | frei |
| 3 | 18 | 4 |
| 4 | 28 | 6 |
| 5 | 40 | 8 |
| 6 | 54 | 11 |
| 7 | 70 | 14 |
| 8 | 88 | 18 |
| 9 | 108 | 22 |
| 10 | 130 | 26 |
| 11 | 154 | 31 |
| 12 | 180 | 36 |
| 13 | 208 | 42 |
| 14 | 238 | 48 |
| 15 | 270 | 54 |
| 16 | 304 | 61 |
| 17 | 340 | 68 |
| 18 | 378 | 76 |
| 19 | 418 | 84 |
| 20 | 460 | 92 |

Ab Punkt 3 muss also jeweils mindestens ein aufgerundetes Fünftel der Schwelle mit jedem Rechenweg gelöst worden sein. Alle bisherigen richtigen Aufgaben zählen mit, unabhängig von ihrer Reihenfolge. Aufgaben werden nicht verbraucht, überschüssige Lösungen zählen für spätere Punkte weiter. Erreichte Punkte werden nicht wieder abgezogen.

## Prüfung

`tests/anteile.test.cjs` prüft die Aufgabenmenge, alle Lernwege mit ausschließlich numerischen Antworten, Fehlversuche, Eingabe- und Verlaufswiederherstellung, alle Punkteschwellen, 20 Darstellungen auf breiten und schmalen Bildschirmen sowie eine lokale EduLudoo-Nachbildung mit Anführungszeichenersetzung, 20 Lücken und wiederholter Editor-Einbettung. Die Testdatei wird nicht nach EduLudoo hochgeladen.


### Kompatibilität der Zeichnungen

SVG-Elemente im eingebetteten Skript besitzen ausdrücklich schließende Tags. Die ältere jQuery-Vorverarbeitung im EduLudoo-HTML-Modul verändert sonst selbstschließende SVG-Tags innerhalb von JavaScript-Schleifen und verschachtelt die Zeichnung falsch. Das führte zu verschwundenen Eiern, fehlenden Uhrzahlen und nur einem sichtbaren Schokoladenstück je Gruppe. Der Integrationstest prüft unveränderten Skripttext nach dieser Vorverarbeitung und die anschließend sichtbaren Formen und auswählbaren Gruppen. Fehlende Punktefelder blockieren die Übung nicht; eine Warnung zeigt die unvollständige Verbindung an.
