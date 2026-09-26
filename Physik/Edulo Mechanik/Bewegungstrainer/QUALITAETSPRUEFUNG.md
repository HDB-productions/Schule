# Inhaltliche und technische Qualitätsprüfung

Stand: überarbeiteter Prototyp vom 26. September 2026. Prüfung der tatsächlich eingebauten neuen Text- und Tippfunktionen, nicht der zur Altdatenübernahme aufbewahrten Erstfassung.

## Verbindliche Kriterien

1. Alltagssprache mit konkret benanntem Ort; keine abstrakten Kilometermarken- und Richtungsdefinitionen als angehängter Erklärungstext.
2. Eindeutiger Beginn der Zeitmessung, passende Anfangsposition und Bewegung weiter vom Bezugspunkt weg. „Weitere Kilometer“ sind eine zusätzliche Strecke, nicht die Position.
3. Jede erwartete Eingabe folgt aus den Angaben. Zeitspannen werden von Uhrzeiten beziehungsweise Beobachtungszeitpunkten unterschieden.
4. Vorbereitung je nach Typ: zwei Zeit-Ort-Paare nur bei zwei Ortsmessungen; sonst getrennte gegebene Größen.
5. Drei aufeinander aufbauende Hilfen: Orientierung, konkrete Vorgehensweise, nahezu ausführbarer Ansatz. Die vollständige eigene Antwort bleibt bis zur gesonderten Lösungsfreigabe offen.
6. Visualisierungen erklären genau den aktuellen Schritt und verraten keinen abschließenden Quotienten, Anfangsabstand, zusammengesetzten Formelterm oder Endabstand.
7. Selbstständige, unterstützte und vorgegebene Lösungen werden unterschieden. Vorgegebene Lösungen geben keinen Punkt; frühere grüne Punkte bleiben erhalten.

## Texte einzeln geprüft

Jede der folgenden Kombinationen wurde auf natürliche Formulierung, Grammatik, vollständige Daten und eindeutige erwartete Eingaben gelesen. Die genauen 24 Vorlagen stehen in `situationstexte.md` und werden aus denselben Textfunktionen wie das Widget erzeugt.

| Muster | Bus | Zug | Radfahrerin | Wanderer | Fachlicher Schwerpunkt |
|---|---|---|---|---|---|
| Strecke und Dauer | geprüft | geprüft | geprüft | geprüft | Anfangsabstand getrennt von zusätzlich zurückgelegter Strecke |
| Zwei Beobachtungen | geprüft | geprüft | geprüft | geprüft | Beide Zeiten ab demselben Messbeginn; zweite Zeit ausdrücklich „insgesamt“ |
| Ein Blick auf die Uhr | geprüft | geprüft | geprüft | geprüft | Erste Uhrzeit ist Messbeginn; Dauer muss aus Uhrzeiten berechnet werden |
| Den Anfangsort herausfinden | geprüft | geprüft | geprüft | geprüft | Gegebene Position gehört zu einer späteren Beobachtung, nicht zum Beginn |
| Zeitmessung beim Vorbeikommen | geprüft | geprüft | geprüft | geprüft | Messbeginn beim Passieren des Bezugspunkts, keine Beschleunigung aus dem Stand |
| Schon unterwegs | geprüft | geprüft | geprüft | geprüft | Gegebene Geschwindigkeit und Anfangsabstand, Bewegung hat schon vorher begonnen |

Bezugspunkte sind Ortsschild, Bahnübergang, Wegweiser und Waldrand am betrachteten geraden Weg. Bewegungen werden als gleichförmig auf dem beschriebenen Abschnitt behandelt; bei Bus und Zug wird ein Zwischenhalt ausdrücklich ausgeschlossen. Das sind vereinfachte Unterrichtsmodelle, keine realen Fahrpläne oder Ortsbeschreibungen.

## Alle 30 Tippfolgen geprüft

Je Muster wurden Vorbereitung und vier Teilaufgaben mit allen drei Stufen geprüft (90 visuelle Zustände). Gemeinsame Formeltipps: allgemeine Formel, Einsetzen anregen, Werte einzeln mit Einheiten. Gemeinsame letzte Aufgabe: Positionszusammensetzung, Zeitumrechnung, Rechnung mit konkreten Größen und offenem Ergebnis. Bei Anfangsabstand null bleibt auch die Weg-Multiplikation offen, damit eine Skizze nicht versehentlich bereits den gesuchten Endabstand verrät.

| Muster | Vorbereitung | Geschwindigkeit | Anfangsposition | Formel | Weitere Position |
|---|---|---|---|---|---|
| Strecke/Dauer | Position, Zeit und zusätzliche Strecke zuordnen; nur ein Beispielfeld in Stufe 3 | Strecke/Zeit → Minuten umrechnen → Division mit Zahlen, Quotient offen | Richtigen Zeitpunkt finden → Satz zum Messbeginn → dessen Kilometerangabe übernehmen, Zahl nicht verraten | geprüft | geprüft |
| Zwei Beobachtungen | Zeit oben, zugehöriger Ort unten; nur erstes Feld beispielhaft | Pfeile zwischen Zeiten/Positionen → Subtraktionen → Differenzen und Umrechnung, Quotient offen | Späteren Ort rückwärts betrachten → s − v·t → Zahlen und Wegstrecke, Subtraktion offen | geprüft | geprüft |
| Uhrzeiten | Uhrzeiten statt Dauer eintragen; Strecke extra | Zeitstrahl → Ende minus Beginn → Dauer in Stunden, Quotient offen | Abstand zur ersten Uhrzeit finden, nicht die zusätzliche Strecke | geprüft | geprüft |
| Anfangsort erschließen | Späteren Zeitpunkt mit späterer Position und v verbinden | Gegebene Geschwindigkeit → passende Einheit → Zahl vor km/h, Wert nicht vorsagen | Rückwegskizze → s − v·t → bekannte Größen, Anfangsposition offen | geprüft | geprüft |
| Beginn beim Vorbeikommen | Anfangsposition und v; nur erstes Beispielfeld | Ablesehilfe ohne genannten Zahlenwert | Moment des Vorbeikommens → Abstand in diesem Moment bedenken; keine ausdrückliche Lösung 0 km im Tipp | geprüft | geprüft |
| Schon unterwegs | Anfangsposition und v getrennt | Ablesehilfe ohne genannten Zahlenwert | Zum Satz des Messbeginns führen; keine ausdrückliche Zahl im Tipp | geprüft | geprüft |

Bei reinen Ableseaufgaben sind die drei Stufen naturgemäß ähnlicher als bei mehrschrittigen Rechnungen. Sie lenken zunehmend genau auf Zeitpunkt, Satz und Einheit, statt zusätzliche künstliche Rechenschritte einzuführen.

## Gefundene Probleme und Nachbesserungen

- Anfangsfassung hatte technische Kilometermarken-Sätze: ersetzt durch konkrete Orte und natürliche Zeitbezüge.
- Einige dritte Tipps nannten bereits das Endergebnis: entfernt; vollständige Lösung erst nach gesondertem Fehlversuch und ohne Punkt.
- „Ausgangspunkt“ in Skizzen konnte mit Anfangsort verwechselt werden: durch „Bezugspunkt“ ersetzt.
- Formelauftrag verriet bereits das allgemeine Muster: Muster in den ersten Tipp verlegt.
- Stundenwert im Präfix der letzten Aufgabe nahm die Umrechnung vorweg: Präfix zeigt nun die im Text gegebenen Minuten.
- Textänderungen hätten neue gespeicherte Stände ungültig gemacht: Darstellung wird beim Laden aus geprüften Aufgabendaten aktualisiert; Eingaben und Fortschritt bleiben erhalten.
- Großer Titel und Punkte über dem Inhalt beanspruchten Platz: Titel entfernt, Punkte unter die Aufgabe verschoben.

## Technisch geprüft

- Zehn Fachtests: 600 generierte Situationen, alle 24 exakt passenden Platzhaltervorlagen, Einheiten/äquivalente sichere Formeleingaben, sechs Vorbereitungen, 90 visuelle Zustände, automatische Lösung ohne Punkt, 30 Übungsrunden mit Punkte-Aufwertung, strenge Zustandsprüfung und Altdatenübernahme.
- Browser: tatsächliche Bildschirmtasten, Cursor und Korrektur, Vorbereitungen aller sechs Typen, vierteiliger Durchlauf, feste Präfixe, Einheitenformel, stehenbleibende Ergebnisse, automatische rote Lösung, unterstützte Folgeschritte, Wiederöffnung, schreibfreies Laden alter Stände und folgende Migration.
- Lokale Edulo-Hostsimulation: E1 als Quelle, E2 mit korrekten Hilfe-Flags bei grün/gelb, keine Punkte bei vorgegebener Lösung, Wiederöffnung aus E1, ausgeblendete Fußleiste, kein lokaler Speicherersatz.
- Ansichten und Hilfsskizzen bei 920 × 768 und 390 × 844 px geprüft; kein horizontaler Überlauf. Vertikales Scrollen gehört zum Layout auf schmalen Geräten.

Nicht geprüft: echter Edulo-Server, Edulo-Wiederöffnung über verschiedene Geräte, echte Tablet-Tastatur-/Touch-Ereignisse. Diese lokale Prüfung ersetzt keinen Live-Edulo-Test. Keine Veröffentlichung, kein Push.


## Ergänzung: Eingaben und verkürzte Aufgabenfolge (26. September 2026)

- Formelzeichen stehen in den Tabellenzeilen. Uhrzeitaufgaben enthalten Startuhrzeit, Enduhrzeit und das zusätzliche Feld Dauer der Zeitmessung Δt in Minuten.
- Bereits in der Vorbereitung eingetragene Geschwindigkeiten und Anfangspositionen werden nicht erneut abgefragt. Die verbleibenden Aufgaben werden fortlaufend nummeriert; entfallene Schritte erhalten keinen zusätzlichen Punkt.
- Rechenansätze mit Einheiten sind als Zahlenantworten zugelassen. Die Zeit muss bei Geschwindigkeitsrechnungen in Stunden angegeben werden. Die eigene Tastatur bietet Rechenzeichen, Klammern und benötigte Einheiten.
- Schema 3 übernimmt Schema 2 und das ursprüngliche Format. Abgeschlossene alte Uhrzeitvorbereitungen erhalten die Dauer automatisch; unvollständige behalten ihre bisherigen Eingaben. Laden löst weiterhin keine Speicherung aus.
- 18 Fachtests bestanden, darunter 600 erzeugte Situationen, alle verkürzten Abläufe, sichere Ausdrucksauswertung und Migration von Uhrzeitentwürfen. Browserprüfung bestanden: tatsächliche Eingabe eines Geschwindigkeitsquotienten über Bildschirmtasten, sechs Vorbereitungen, Ergebniszeilen, Hilfe/Punkte, Wiederherstellung und Layout bei 920/390 px. Lokale simulierte Edulo-Prüfung bestanden; kein echter Edulo-Server- oder Tablet-Test.
- Die redaktionelle Übersicht wurde neu erzeugt: 24 Situationen, 23 tatsächlich verwendete Vorbereitungs-/Aufgabenabschnitte und 69 Tipps. Die ältere 90er-Prüfung oben umfasst zusätzlich die nun entfallenen Ableseaufgaben.
