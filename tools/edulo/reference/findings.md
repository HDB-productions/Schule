# Konsolidierte Edulo-Erkenntnisse

Diese Datei enthält den **aktuellen** Stand, keine chronologische Sammlung widersprüchlicher Zwischenannahmen. September-2026-Nutzertests und lokal gelesener Edulo-Code; private Methoden ohne offizielle Stabilitätsgarantie.

## Drei getrennte Ebenen

1. Lückendaten: `v` Wert, `l` letzte falsche Eingabe, `c` korrekt, `h` geholfen/Fehlerhistorie. c/h sind Strings `"true"` / `"false"`, keine Booleans.
2. Aufgaben-Prüfkennzeichen `widgetchecked|<widget-id> = "1"` sowie `content.isChecked` in der laufenden Ansicht. Kein einzelnes zusätzliches Prüfbit im v/l/c/h-Datensatz.
3. Feldsymbole: CSS-Klassen `wrong`, `correct`, `correct helped`; können nach Eingabe veraltet bleiben. Prüfung oder erneute Auswertung nach Öffnen aktualisiert sie.

Übersicht bewertet aktuelle Lückendaten auch ungeprüft. Ein unbewertet falscher Wert → richtiger Wert ergibt Grün. Falsch → prüfen → richtig ergibt Gelb. Leeren macht im Balken Grau, löscht aber mit reinem DOM-Wertschreiben die Historie nicht. Erneut richtig kann dann wieder Gelb ergeben.

## Bestätigter gezielter Weg

`widget.findModule('cloze_text')` und `widget.forEachContent` finden Modul/Content. `content.clozeInputs` über `inputElement[0]` mit echten DOM-Feldern abgleichen. `item.JSON.id` ist die interne ID und muss nicht dem DOM-Suffix entsprechen.

| Ziel | v | l | c | h |
|---|---|---|---|---|
| grau | leer | leer | false | false |
| grün | 1 | leer | true | false |
| gelb | 1 | leer | true | true |
| rot (optional) | 0 | leer | false | false |

`cloze_text.loadUserInput(content,[row])` übernimmt nur die referenzierte Lücke. `checkSingleClozeInput(item,content)` berechnet korrekt anhand des echten Lösungswerts neu und lässt das Hilfe-Flag stehen. `saveUserInput(content,target)` serialisiert die Daten; `target` braucht `input:[]` und Zähler total/correct/helped/wrong. Normales change-Ereignis führt erneut zur Korrektheitsberechnung und `save_load.save()`.

Bei Grün↔Gelb ist v unverändert: trotzdem Speichern auslösen. Rein identischen Feldwert überspringen wäre hier falsch. Keine Funktionsnamen erraten und kein globales clear/reset als Ersatz für eine einzelne Zeile.

Echter Test: Grün → Gelb → Grau → Grün auf Feld 3 erfolgreich, nach Wiederöffnen erhalten, andere zwei Felder unverändert. Übersicht und **Excel-Punkteliste** übernehmen laut Nutzer sofort ohne Prüfen. Feldsymbole blieben zunächst unmarkiert. Neuere Prüfung eines direkt gelb gesetzten Werts ergab auch gelbes Feldsymbol, obwohl nie eine falsche Eingabe vorlag. Der Kit-Adapter erweitert diesen Mechanismus auf 20 Felder; dessen allgemeine Robustheit wird separat lokal getestet.

## Prüfen, Hilfe und Reset

- `check_solution.check()` prüft alle Inhalte, setzt `isChecked`, speichert und markiert die Aufgabe als geprüft. Nicht bloß kosmetisch.
- `cloze_text.checkSolution()` zeichnet Symbole neu und setzt bei geprüfter, **nichtleerer falscher** Eingabe `helped="true"`. Eine leere Lücke bekommt zwar wrong als Feldsymbol, aber dadurch nicht automatisch ein neues Hilfe-Flag.
- `reloadCheck()` rekonstruiert bei bereits geprüfter Aufgabe die Markierungen. Es existieren Editor-/Testmodus-/forceCheck-Schutzbedingungen.
- Prüfbutton ist im beobachteten Host `#footerButtons button.checkBtn` mit Text „Überprüfen“. Daneben „Lösungen“ mit gleicher Klasse: nicht nur nach Klasse klicken.
- `clearUserInput(content)` leert alle nicht vorgegebenen Lücken des Moduls und setzt last/helped/correct zurück. `loadUserInput` mit einer Zeile erlaubt gezieltere Steuerung.
- App-Aufruf `app.resetWidget('.studentCollectionWidgetPreviewPanel')` sendet `reset` an das Aufgabeniframe, betrifft die Aufgabe, potenziell inklusive E1. Standard nutzt ihn nicht.

## Speicherung und Zähler

E1 als UTF-8/Base64 verhindert Quote-Ersetzungen in JSON. E1 erhält vollständigen Fachzustand; E2 ist Bewertungsschnittstelle. Edulos `save_load.save()` nutzt `buildWidgetSaveData`, schreibt `widgetinput|<id>` und sendet bei Änderungen `WIDGETINPUTCHANGED|id|timestamp|json` an die App. Das ist ein echter Speicherweg, keine selbst gesendete Fake-Message.

`counter.correct` umfasst Grün und Gelb. `counter.helped` ist die gelbe Teilmenge, nicht addieren! wrong zählt nichtleere falsche Eingaben; total alle bewertbaren Lücken. Im Test trug E1 einen zusätzlichen grünen Punkt bei, obwohl nur als Speicher gedacht. Ausblenden entfernt ihn nicht aus der Bewertung.

## Historische Sackgassen / Diagnose

- Direktes postMessage-Score-Injizieren änderte die Übersicht nur kurz; Edulos Zustand überschrieb es nach ungefähr einer Sekunde. Nicht verwenden.
- Beobachtete Nachrichten: WIDGETINPUTCHANGED, WIDGETINPUTCHECKED, WIDGETINPUTRESET, CLASSDATAREQUEST. Ursprung/Modul zuordnen; eine globale Nachricht beweist keine Einzelpunktänderung.
- useClassData/CLASSDATAREQUEST ist kein benötigter Standardweg. Keine fremden Klassenantworten für Speicherzugriff laden.
- Platzhalterparameter und feste Modulindizes funktionierten nicht zuverlässig: siehe parameters.md.
- Initiale 0 in allen Feldern ist kein grauer Anfangsstand. Ein Prüfklick ist für Übersicht/Excel nicht erforderlich; ältere Dokumente mit AUTO_CLICK_CHECK als Pflicht sind überholt.

## Grenzen

Bestätigt ist der konkrete Desktop-Edulo-Testaufbau, nicht jede Edulo-Version, Remote-/Prüfungsansicht oder Cloud-Synchronisierung über unabhängige Geräte. Excel-Befund ist echter Nutzertest, keine hier analysierte XLSX-Datei. Keine offizielle API-Zusage. Sichtbare Symbole, persistenter Status, Scorezähler und pädagogische Bewertung bewusst getrennt halten.
