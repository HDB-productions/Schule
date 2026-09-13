# Integrationsprüfung, 12.09.2026

Auslieferung: `../dynamot-labor.html`, vollständig lokal gebündelt. Kein Publish/Push.

## Tatsächlicher Browserdurchlauf

Die gebündelte Seite wurde im Codex-Browser über einen eigenen lokalen Testursprung geöffnet. Es wurden keine Erfolgszustände in den Aufgabenmotor injiziert. Geräte, Kabel, Regler, Antworten und Diagramme wurden über sichtbare UI-Elemente bedient.

- Versuch 1: DynaMot M1, Kurbel, Lampe L1, zwei direkte Buchsenverbindungen. Langsam 8 und schneller 22 rad/s: Aufbau und Beobachtung erkannt. Eine falsche Antwort wurde abgewiesen und korrigiert. Eine Energieform am falschen Diagrammplatz wurde abgewiesen; richtige Kette ohne Wärme akzeptiert. 5 Punkte.
- Versuch 2: Lampe entfernt, zweiter DynaMot M2 mit Kurbel. Normale Polung, 8/24 rad/s, Richtungswechsel auf −24, Kabel gelöst und gekreuzt neu verbunden. Alle Teilhandlungen erkannt. Auswahlantworten und Diagramm mit zusätzlichem Wärmezweig vom Generator akzeptiert. 10 Punkte.
- Wiederöffnen bei 8 Punkten: pausiertes Labor, Aufbauten, Kabel, abgeschlossene Schritte und Antworten erhalten. Diagramm konnte weiterbearbeitet werden.
- Diagrammeditor: echter Zeiger-Drag eines kinetischen Energiepfeils zum ersten Platz erfolgreich; zusätzlich Auswahl/Antippen für alle Ketten getestet. Die erste Drag-Implementierung wurde nach fehlgeschlagenem UI-Test auf Zeigerereignisse korrigiert und erneut erfolgreich geprüft.
- Versuch 3: Zweiter DynaMot auf Seilrolle/0,5 kg umgebaut. Antrieb ausgeschaltet, Gewicht bis zum Boden sinken lassen; dann Antrieb eingeschaltet und Gewicht motorisch gehoben. Durchführung, Antworten und siebenstellige Kette mit Gewicht als Speicherstation akzeptiert. 15 Punkte.
- Versuch 4: Antriebs-DynaMot entfernt, verbliebenen Gewichts-DynaMot M2 mit neuer Lampe L2 verbunden. 0,5 kg fallen lassen; pausiert, 1 kg eingestellt, auf dieselbe Starthöhe hochgesetzt, erneut fallen lassen. Vergleich erkannt. Antworten korrekt. 17 bzw. 18 Punkte vor dem Diagramm.
- Mobile Prüfung bei 390 × 844: keine horizontale Seitenüberschreitung, Palette und Auswahlbedienung funktionieren. Die längere Diagrammkette hat einen eigenen horizontalen Scrollbereich. Ein Wärmezweig vom Gewicht wird abgewiesen; nach Entfernen wird Wärme von der Lampe akzeptiert. Abschluss mit genau 20 Punkten.
- Endübersicht nach erneutem Laden: 20 Punkte, alle vier Versuche aufrufbar, Geräte/Slots/Kabel, Antworten und Diagramm einschließlich freiwilligem Wärmezweig erhalten. Keine Browser-Fehlermeldungen im geprüften Ablauf.

## Lokale Edulo-Nachbildung

`node tests/dynamot-qa-server.cjs` stellt auf `127.0.0.1:8774` eine Testseite mit E1, 20 E2-Feldern und iframe bereit.

- `/host`: E1 erhält `DYNAMOT1:` einschließlich Aufgabenstand, alle E2 starten mit 0. Ein korrekt über UI aufgebauter V1 auf alternativen Slots M3/L4 ergibt E2_1=1 und E2_2…20=0; native Ereignisse wurden ausgelöst.
- `/foreign`: fremder E1-Text bleibt trotz Gerätebedienung exakt erhalten, alle E2-Werte unverändert, 0 Hostereignisse.
- `/broken`: absichtlich inkompatibler Aufgaben-Namensraum sperrt E1 und E2; beide bleiben unverändert, 0 Hostereignisse.
- `/editor`: Geräte lassen sich in der Vorschau setzen; E1/E2 unverändert, 0 Hostereignisse.

Dies prüft den lokalen Feldvertrag. Serverseitiges Speichern, reale Edulo-Uploadgrößen und HTML-Einbettungsregeln wurden nicht live verifiziert.

## Ergänzende Tests

`node tests/dynamot-aufgaben.test.cjs` prüft alle vier Handlungslogiken mit dem tatsächlichen Simulationsmodell, alternative Reihenfolgen, Teilwiederherstellung, manuelles Hochsetzen als Gegenbeispiel, Graphstruktur, Wärme, Antworten, 20-Punkte-Grenze und beschädigte Motorzustände.

`tests/dynamot-labor.test.cjs` prüft Modell, echte Socket-/Slotbedienung, Material-Drag, Umsetzen, mehrere Lampen, Migration, mobile Ansicht sowie lokale E1- und jQuery-Einbettung. Der E1-Testselektor wurde wegen des neuen Notiz-Textfelds von `textarea` auf `#e1_text_input` präzisiert.

## Grenzen

Die Geräteparameter sind illustrative Modellwerte, keine kalibrierten DynaMot-Messdaten. Seilrolle und Gewicht sind schematisch; ihre Fotos waren nicht vorhanden. Aufbauhilfe ist eine kleine schematische Referenzgrafik. Die Software prüft simulierte Handlungen, keine Aufmerksamkeit und keinen realen Schüleraufbau. Standalone erfordert WebGL; Browserstand ist lokal, nicht geräteübergreifend.
