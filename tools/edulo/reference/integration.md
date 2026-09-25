# API und Grenzen

`runtime/bridge.js` wird beim Build innerhalb der Root-Closure eingefügt. Es erzeugt keine globale Bibliotheksvariable. Es verwendet Edulos private, empirisch untersuchte Methoden; bei fehlenden Funktionen wird blockiert.

## Optionen

Pflicht: `root`, eindeutige `widgetId`, `fresh()` und fachlicher `validate(data)` (true/false). Optional: `stateVersion` (1), `scoreCount` (20), `onStatus({text,error,mode})`, `stateId`, `scorePrefix`, `stateModuleId`, `scoreModuleId`, `showFields`, `hideFooter` (true), `mode` (`edulo` oder `standalone`), `attempts` (50), `retryMs` (200), `debounceMs` (300).

URL-Fallbacks: `STATE_ID`, `SCORE_PREFIX`, `SHOW_FIELDS=1`. `?edulo=1` erzwingt Erkennung. Ein iframe, `data=` oder ein erreichbares Edulo-widget/Hostfeld gilt ebenfalls als Einbettung. In fremden iframes `mode:'standalone'` nur bewusst setzen; dadurch werden keine Edulo-Felder benutzt.

E1-Format: `EDULO2:` + UTF-8-Base64-JSON `{widget,version,data,scores}`. Das Präfix ist Kit-spezifisch, kein Edulo-Protokoll. Fremde/alte Formate werden nicht überschrieben. Standalone-Key `schule-edulo:<widgetId>`. JSON-taugliche Daten, keine DOM-Knoten/Zyklen/Funktionen. Originaleingaben als Strings bewahren.

`load()` liest nur. Ein später expliziter `save(data,scores)` gleicht die gewünschten Farben ab; E1 ist die fachliche Quelle. `queueSave` bündelt Entwürfe, `flush` schreibt ausstehende Entwürfe, `dispose` beendet die Bridge. Fehlerstatus sichtbar lassen. `load()` erneut aufrufen bedeutet bewusstes Wiederherstellen aus dem Host, nicht Speichern ungesicherter In-Memory-Änderungen.

Beim regulären Verlassen, Fokusverlust und Verbergen werden ausstehende Änderungen gesichert. Bei bereits entfernter Root wird nicht mehr geschrieben (Schutz vor veralteten Instanzen); explizites `flush` vor selbst gesteuertem Entfernen. Keine Garantie für Speicherung bei Prozessabbruch.

## Punkte

Die Bridge identifiziert das echte `cloze_text`-Contentobjekt über die DOM-Referenzen der 20 Felder. Interne `JSON.id` nicht aus DOM-Suffixen erraten. Vorab werden Zielzustände geladen, durch Edulo bewertet und serialisiert. Erst dann folgen E1-Schreiben und native input/change-Events für geänderte Punktfelder (auch bei gleichem Wert und geändertem Hilfe-Flag).

E1 und E2 sind keine atomare Transaktion. Scheitert nach erfolgreichem E1-Schreiben die Punkteübernahme, wird dies ausdrücklich gemeldet. Wiederholtes explizites `save` kann den Abgleich nachholen. Ein späteres Server-Problem ist durch lokale DOM-Lesung nicht beweisbar.

Keine Vorgabe, jede falsche Lernantwort rot zu bewerten: für den Standard bleiben unerledigte Kriterien grau. Fehler/Hilfe in Fachzustand merken; später gelb statt grün vergeben. Rot ist zusätzliche Option. Grüner Rückwechsel ist technisch möglich, pädagogisch nur nach den Regeln der jeweiligen Übung.

## Troubleshooting

- Fehlende Felder: Modulreihenfolge/IDs und Bearbeitungsansicht prüfen. Retry wartet maximal rund 10 s; kein lokaler Ersatz in Edulo.
- Fehlende interne Schnittstelle: nicht still zu 0/1-Feldern zurückfallen. Host-Version diagnostizieren; Bericht nur bei Bedarf.
- E1 verändert: fremder Stand/Reset/zweite Instanz. Nicht überschreiben; laden oder exportieren.
- E1 zu kurz: Zeichenbegrenzung entfernen; kein stilles Abschneiden des Lernstands.
- Container sichtbar: `SHOW_FIELDS`, Editor und fremde Inputs prüfen. Die Bridge versteckt nie fremde Inputs/iframe/Widget-Root zusammen mit technischen Feldern.
- E2 nicht neutral: Lösung 1, keine connected/predefined/unchecked-Lücken, keine nocheck-Konfiguration.
- Alte Feldsymbole: unerheblich für bestätigten Übersichts-/Excel-Weg. Keine globale Prüfung als kosmetische Reparatur.

## Vorhandene Widgets migrieren

Nur gezielt beauftragt. Altes Präfix, Versionsschema, E1-Lernstände, Punktemapping und idempotente Initialisierung erfassen. Vorher echte alte Fixtures sichern, explizite Migration testen und den neuen Stand validieren. DynaMot-Aufbau, Kamera, Leitungen, Aufgabe/Historie und Entwürfe nicht auf eine Punktesumme reduzieren. Alte erzeugte HTML-Dateien nie direkt patchen.

## Fußleiste

Der Build bindet `runtime/footer.js` mit der Bridge ein. `hideFooter: true` ist Standard; `false` lässt die Edulo-Fußleiste sichtbar. `bridge.setFooterHidden(true/false)` schaltet zur Laufzeit um. Kein zusätzlicher eigener Footer-Code im Fachwidget nötig. In Editor-/Prüfungsansichten bleibt die Leiste unverändert. Beim Verlassen/Entfernen wird das ursprüngliche Layout wiederhergestellt. Spät erzeugte oder ersetzte Footer werden erneut zugeordnet.

Fehlende oder nicht zuordenbare Footer blockieren die Speicherung nicht; `getStatus().footerError` enthält die Diagnose, `footerHidden` den übernommenen Zustand. Die Einstellung ist unabhängig von `showFields`.
