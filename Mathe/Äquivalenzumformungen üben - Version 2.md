# Äquivalenzumformungen üben – Version 2

## Datei und Lernidee

`Äquivalenzumformungen üben - Version 2.html` ist eine eigenständige HTML-Datei ohne externe Bibliotheken. Direkt im Browser öffnen oder als Edulo-Widget einbinden. Die bisherigen drei Gleichungsübungen und der Index bleiben unverändert.

Die erste Altversion trennt Operation, linke und rechte Seite, vergleicht jedoch nur Text. Die Neufassung bewahrt diese Eigenleistung und ersetzt die Textprüfung durch exakte rationale Algebra und eine zusätzliche Strukturprüfung.

1. x-Terme von rechts nach links bringen: Operation hinter dem Strich eingeben.
2. Linke und rechte Seite jeweils selbst berechnen, mit genau einem aktiven Feld.
3. Noch offene Rechnungen in zusätzlichen Zeilen vereinfachen. Hier gibt es keine neue Operation. Bereits vereinfachte Seiten werden unverändert übernommen; noch offene Seiten werden einzeln abgefragt.
4. Zahlen von links nach rechts bringen, beide Seiten berechnen und gegebenenfalls vereinfachen.
5. Nach x auflösen, beide Seiten selbst berechnen und gegebenenfalls vereinfachen.

Jede bestätigte Eingabe bleibt in ihrer ursprünglichen Schreibweise im Lösungsweg und im Prüfprotokoll. Andere Termreihenfolgen sind gleichberechtigt. Auch richtige, noch nicht vereinfachte Terme zählen als richtige Versuche. Sie führen zu gezielten Aufträgen zum Zusammenfassen, Ausmultiplizieren, Auflösen einer Minusklammer oder Ausrechnen einer Division. Reine Gruppierungsklammern erzwingen keine Zusatzarbeit. Eine unverändert erneut eingegebene, richtige Seite bleibt richtig; der Vereinfachungsauftrag bleibt dann offen.

Der Generator bleibt bei einfachen linearen Gleichungen mit ganzzahligen Koeffizienten und ganzzahliger Lösung. Ein Bruch-/Klammer-Aufgabenpool wurde nicht ergänzt. Die Eingabeprüfung unterstützt bereits Brüche, Dezimalkomma und Klammern. Potenzen, Produkte von x mit x, Funktionen und x im Nenner sind außerhalb des Umfangs. Kein `eval`, keine Rundungstoleranz.

## Speicherung und Punkte

- Eigene Kennung: `AEQUIV2:` plus Base64-kodiertes UTF-8-JSON; internes Schema 3.
- Standalone-Schlüssel: `mathe-aequivalenz-v2`. Speicherung nur in diesem Browser und unter dieser Herkunft.
- In Edulo ist E1 maßgeblich. Auch ein leeres E1 startet unabhängig von lokalen Browserständen. Bei fehlendem/unerreichbarem E1 wird kein lokaler Ersatz geladen. Unbekannte oder beschädigte Speichertexte bleiben erhalten.
- E1 enthält alle Aufgaben, Originaleingaben, Prüfversuche, Entwürfe, offene Seiten und Vereinfachungsphasen. Beim Wiederherstellen werden die bestätigten Schritte erneut geprüft.
- E2 enthält zwanzig Punktefelder mit `1` für erreicht und `0` für noch nicht erreicht. Es zählen vollständig auf Anhieb gelöste Aufgaben. Die kumulierten Schwellen sind wie im Brüche-Widget: **4, 10, 18, 28, 40, 54, 70, 88, 108, 130**. Die Schwellen gelten getrennt für zwei Bereiche: mit und ohne Umformungstipps. Jeder Bereich hat zehn Punkte und benötigt insgesamt 130 anrechenbare Gleichungen; zusammen sind es 20 Punkte bei 260 Gleichungen. Fehler bleiben korrigierbar und ziehen keine erworbenen Punkte ab.
- Punkte werden aus abgeschlossenen Aufgaben abgeleitet, nicht bei jedem Klick addiert. Reload und Historienansicht erzeugen keine neuen Punkte.

### Edulo einrichten

1. E1 als unbewertetes Textfeld: normalerweise `e1_text_input` (auch `e1_input` wird erkannt).
2. E2 als Lückentext mit zwanzig Lücken: `e2_cloze_text_input_1` bis `_20`, jeweils `1` als richtige Lösung und ein Punkt. Felder 1–10 gehören zu Aufgaben mit Tipps, Felder 11–20 zu Aufgaben ohne Tipps.
3. HTML auf derselben Seite einbinden. Die Feldverbindung braucht Zugriff auf das einbettende Dokument.

Die Felder und ihre eigenen Container werden nach Verbindung ausgeblendet. Es werden native `input`- und `change`-Ereignisse ausgelöst. Die Editor-Vorschau schreibt und versteckt keine Hostfelder. Direkte Einbettung und gleich-originige Iframes werden unterstützt; browserseitig isolierte Cross-Origin-Einbettung benötigt eine passende Plattformanbindung.

Optionale URL-Parameter: `edulo=1`, `STATE_ID`, `SCORE_PREFIX`, `SHOW_FIELDS=1`. Der Editor wird über `widget.isEditor`, Body-Klasse `editor` oder `editor=1` erkannt.

## Nachgewiesene Prüfungen

`node Mathe/aequivalenz-v2.test.cjs` startet einen lokalen Prüfserver und einen echten Edge-Browser über Playwright. `PLAYWRIGHT_MODULE` kann die Playwright-Installation festlegen. Der voreingestellte Pfad entspricht der lokalen Codex-Laufzeit. Für eine interaktive lokale Vorschau: `node Mathe/aequivalenz-v2.test.cjs --preview`, danach `http://127.0.0.1:8769` öffnen.

Abgedeckt sind vollständige Schülerdurchläufe; erhaltene Termreihenfolgen; mehrere zusätzliche Vereinfachungszeilen; keine unnötige Vereinfachung bloß umsortierter Terme; Gruppierungs-, Multiplikations-, Minus- und Divisionsklammern; negative Division; Kehrwertmultiplikation; Dezimalkomma; undefinierte/falsche Eingaben; verbindliche Operationswirkung; Wiederaufnahme mitten in einer Vereinfachungsphase und mit Eingabeentwurf; alle zehn Punkteschwellen; Historie und Reload ohne Doppelzählung; E1-Vorrang bei leerem und gefülltem Hostfeld; Punktefelder und Ereignisse; Editor; direkte Einbettung; fehlende/beschädigte Felder; Parameter; Tastatur; genau ein aktives Feld; Breiten 320, 390 und 1000 px ohne horizontalen Überlauf. Screenshots werden neben dem Testskript erzeugt.

**Grenze:** Die Edulo-Tests sind lokale Hostsimulationen. Ein echter Edulo-Server-Roundtrip und eine Bedienprüfung auf einem physischen Tablet sind damit nicht bestätigt. Die Speicheranzeige meldet die Übergabe an Felder, keine serverseitige Speicherbestätigung.

## Unveränderte Originale (SHA256)

- Erste Datei: `415CA389160A59B94414042CD4D7D5F3FDD066163E40C3FB832E6327749486B5`
- Vorhandene v2: `6FC108B9E58307FC180E9D3DFCEE68BC59AE8453F1809446C9E2B869195CE664`
- Vorhandene v3: `D5024125B4B116C2AF996B10813DA17BA6796B6656163BD0C7D32E523C57BC96`

Kein Commit, Push oder Deployment. Auf ausdrücklichen Nutzerauftrag wurde die neue Fassung zusätzlich ins lokale Repository unter `E:/Dateien/Dokumente/GitHub/Schule/Mathe` übernommen und in `MatheIndex.html` anstelle der Altübung verlinkt.

## Überarbeitete räumliche Anordnung

Die Überschrift lautet „Gleichungen schrittweise lösen“. Der Arbeitsbereich verwendet wie die bisherige v2 ein fest ausgerichtetes Schema aus linker Seite, =, rechter Seite, | und Operation. Das einzige aktive Feld sitzt unmittelbar an seiner mathematischen Stelle. Bestätigte Eingaben bleiben in dieser Position; zusätzliche Vereinfachungszeilen haben keine Operation. Die Punkte stehen unterhalb der Übung. Farben und abgerundete Flächen behalten den neuen visuellen Stil bei.

Der konkrete Arbeitsauftrag steht als Platzhalter im aktiven Feld und verschwindet beim Tippen. Das Feld wächst bei langen Hinweisen automatisch in der Höhe, auch auf schmalen Ansichten. Enter prüft die Eingabe. Zusätzlich ist eine zugängliche Beschriftung vorhanden.

Die Layoutregression prüft tatsächliche Tabellenzellen für Operations-/Seitenfelder, ausgerichtete Gleichheitszeichen, leere Operationsspalten beim Vereinfachen, Punkte unter der Übung und die sichtbare Höhe der Platzhalter. Desktop- und Mobil-Screenshots wurden visuell kontrolliert. Diese Kontrolle ersetzt nicht die gestalterische Beurteilung durch den Nutzer.

## Einstellungen und freies Umformen

Das Zahnrad öffnet einen erweiterbaren Einstellungsbereich. **Umformungstipps** ist standardmäßig eingeschaltet, auch beim Laden älterer Lernstände ohne diese Einstellung.

- **An:** Der oben beschriebene geführte Ablauf gilt. Platzhalter und zugängliche Beschriftungen nennen konkrete Umformungs- bzw. Vereinfachungsaufträge.
- **Aus:** Freies Umformen innerhalb der linearen Eingabesprache. Beliebige lineare Terme dürfen auf beiden Seiten addiert/subtrahiert werden; Multiplikation und Division mit beliebigen von null verschiedenen Zahlen sind erlaubt. Auch Schritte ohne Verkürzung werden akzeptiert. Die Felder heißen neutral „Operation auf beiden Seiten“, „Linke Gleichungsseite“ oder „Rechte Gleichungsseite“. Strategische Anleitung im Hilfebereich wird ausgeblendet. Mathematisch falsche oder undefinierte Operationen bleiben ungültig. Beide Seiten werden weiterhin selbst eingegeben und offene Ausdrücke in den bestehenden Vereinfachungsphasen bearbeitet.

Ein Abschluss ist auch mit x allein auf der rechten Seite möglich. Ungünstige, aber richtige Schritte werden nicht als falsch oder rot bewertet. Eine vorsichtige Hilfeeinschätzung ist unten beschrieben. Die Behandlung unverändert erneut eingegebener Vereinfachungsterme wurde nicht geändert.

Die Einstellung wird im vollständigen Lernstand gespeichert (E1 bzw. standalone). Der geführte/freie Modus wird zusätzlich bei jedem Operationsversuch festgehalten. Dadurch bleiben akzeptierte Operationen auch nach Umschalten oder Reload korrekt auswertbar. Ein Moduswechsel verändert weder bisherige Punkte noch Prüfversuche und erhält den Eingabeentwurf.

Browserregression zusätzlich bestanden: Zahnrad öffnen/schließen, Standardwert, neutrale Platzhalter und zugängliche Namen, Umschalten mit Entwurf, ältere Lernstände, lokaler Reload, E1-Wiederaufnahme, freie andere Lösungsrichtung, nicht verkürzende Operation, Abschluss rechts, Multiplikation/Division durch null ablehnen sowie Umschalten mitten in einer bereits akzeptierten freien Operation. Die vollständige vorherige Kern- und Layoutsuite wurde ebenfalls erfolgreich abgeschlossen.


## Schritthilfe und andere Lösungswege

Im freien Modus kann neben einer akzeptierten Operation ein **?** erscheinen. Es ist ein unverbindlicher Hinweis, keine mathematische Fehlerbewertung und keine Sperre. Das Kind kann sofort die Seiten ausrechnen oder mit „Weiterrechnen“ den Hinweis schließen. Das Fragezeichen bleibt bei genau dieser Operation erreichbar, auch nach Folgezeilen und Reload.

Die Heuristik vergleicht vor und nach der Operation:

- Anzahl vorhandener x- und Konstantenterme;
- Abstand zu einem alleinstehenden x, symmetrisch für beide Gleichungsrichtungen;
- zusätzlich auftretende Brüche und längere Zahlen-/Bruchschreibweisen;
- deutlich größere Zahlen (Maximum über 1000 und mehr als das Zehnfache des vorherigen Maximums).

Verschwindende Terme oder größere Nähe zu isoliertem x sprechen für einen sinnvollen Zwischenschritt. Zusätzliche Brüche oder Terme werden dann nicht automatisch beanstandet. Ein extremer Zahlensprung kann trotzdem einen vorsichtigen Hinweis auslösen. Die Heuristik garantiert keine optimale Strategie und kann Hinweise auslassen oder bei nützlichen Schritten anzeigen. Sie zeigt keine vorausberechneten Gleichungsseiten an.

**Schritt ändern:** Jede frühere Operation besitzt eine anklickbare Hilfe: **?** bei möglicher Erschwernis, sonst **↶**. „Schritt ändern“ nimmt diese Operation und alle Folgezeilen aus dem aktiven Weg zurück. Frühere Zeilen bleiben erhalten; das Feld sitzt wieder direkt hinter dem passenden Strich und enthält die alte Operation als bearbeitbaren Entwurf. Der verworfene Stand mit Originaleingaben und Prüfversuchen bleibt als „Frühere Fassung“ in der Aufgabenhistorie. Auch über die Historie kann eine ältere Aufgabe erneut bearbeitet werden.

Die Aufgabe bleibt dieselbe und kann nur einmal für Punkte angerechnet werden. Bereits erworbene Anrechnung bleibt bei Rücksprung und späteren Fehlern erhalten. Frühere mathematische Fehlversuche werden durch Zurückspringen nicht aus der Erstversuchsstatistik gelöscht. Ungeschickte, aber korrekte Operationen und nicht unterstützte Syntax verursachen keinen Abzug.

Nicht unterstützte Eingaben wie `:pi` und `+a` werden ausdrücklich als außerhalb der Eingabesprache erklärt, nicht als mathematisch falsch. Der rationale lineare Parser wurde nicht um zusätzliche Konstanten oder Variablen erweitert. Division bzw. Multiplikation mit null bleibt unzulässig.

Zusätzlich browsergeprüft: `*3000000` akzeptieren und trotzdem Hinweis anbieten; Weiterrechnen ohne Sperre; hilfreiche Schritte in beiden Richtungen; zusätzliche Brüche/Termkomplexität; Rücksprung direkt nach der Operation und nach mehreren Folgezeilen; Erhalt früherer Zeilen; frühere Fassungen; Wiederaufnahme standalone und in lokal simuliertem E1; Wiederabschluss derselben Aufgabe ohne zusätzliche Punkte; bestehende Punkte während Rücksprung; frühere Rechenfehler nicht durch Rücksprung löschen. Die bestehende Kern- und Layoutsuite ist ebenfalls Teil des Tests.


## Zwei unabhängige Punktelisten

Unter der Übung stehen „Mit Umformungstipps“ und „Ohne Umformungstipps“, jeweils mit eigener Anzeige von 0 bis 10 Punkten und eigenem Abstand zur nächsten Schwelle. Die Aufgaben des anderen Bereichs verändern diesen Abstand nicht. Beispiel: zehn anrechenbare Aufgaben mit Tipps ergeben 2/10; vier ohne Tipps ergeben daneben 1/10. Insgesamt sind dann drei Edulo-Punkte erreicht.

Jede Aufgabe kann nur in einem Bereich angerechnet werden. Eine ohne Tipps begonnene Aufgabe zählt mit Tipps, sobald während ihrer Bearbeitung konkrete Umformungstipps eingeschaltet werden. Das Umschalten vor der ersten Prüfung ist frei. Die Nutzung von Tipps bleibt auch über Rücksprünge dokumentiert. Eine bereits erworbene Anrechnung behält dagegen ihren ursprünglichen Bereich, auch wenn die Aufgabe später in einem anderen Modus wieder geöffnet wird. Kein doppeltes Anrechnen derselben Gleichung.

Bestehende Lernstände werden aus den gespeicherten Operationsmodi in die beiden Bereiche eingeordnet. Frühere Schritte ohne explizite Freimoduskennung gelten als geführt. Neue Stände speichern zusätzlich, ob bei einer begonnenen Aufgabe Tipps eingeblendet wurden. Der Umschalter verwendet ein eigenständig gestaltetes Schalter-Element statt einer Checkbox, um doppelte Checkbox-Dekorationen in Edulo zu vermeiden.

Die Regression prüft alle zehn Schwellen beider Bereiche, unabhängige Zählung, 2+1 im Beispiel, volle 10+10 bei 130+130 Aufgaben, Übergabe an zwanzig Felder, Umschalten bei offenen Aufgaben und unveränderte Bereichszuordnung erworbener Punkte bei Rücksprung und E1-Reload. Anzeige und Edulo-Ausgabe verwenden dieselbe Punkteberechnung.
