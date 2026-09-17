# Flüssige Bedienung und Touch-Markierung

Stand: 17. September 2026. Gilt für Brüche verstehen, Anteile berechnen, Das Ganze bestimmen und Anteile berechnen 2.

## Bedienung

Mit Maus und Tastatur werden Teile weiterhin einzeln umgeschaltet. Auf einem Touchscreen lassen sich mehrere Teile in einer Wischbewegung markieren. Beginnt die Geste auf einem unmarkierten Teil, werden alle berührten Teile markiert. Beginnt sie auf einem markierten Teil, werden sie entfernt. Innerhalb einer Geste wird jedes Teil höchstens einmal geändert; Zurückwischen schaltet es nicht erneut um. Schnelle Bewegungen werden entlang der zurückgelegten Strecke ausgewertet. Scrollen außerhalb der aktiven Markierungsfläche bleibt möglich.

## Speicherung bleibt kompatibel

Dateinamen, Speicherkennungen, Versionsnummern und Base64-Formate bleiben unverändert. E1 und E2 behalten ihre bisherigen Aufgaben und Punktzahlen. Alte Verläufe, Versuche, Punkte, offene Aufgaben und vorhandene Rundenreservierungen werden nicht gekürzt oder zurückgesetzt. Es gibt kein neues Lernstandsformat und keine Datenbereinigung.

Schnelle Zahleneingaben und Reglerbewegungen werden nach einer kurzen Eingabepause von 200 Millisekunden gemeinsam gespeichert. Der Zustand im geöffneten Widget ist sofort aktuell. Prüfen, Aufgabenwechsel und andere bisherige ausdrückliche Speicheraktionen bleiben unmittelbar. Noch ausstehende Eingaben werden auch beim Fokuswechsel, Verbergen der Seite, Seitenverlassen, Ende/Abbruch einer Touch-Geste und beim Entfernen des Widgets übergeben. Ein abrupt beendeter Browserprozess ohne Abschlussereignis kann wie bei anderen Browseranwendungen die allerletzten noch nicht übergebenen Eingaben verlieren; bereits gespeicherte Aufgaben werden dadurch nicht verändert.

Die Historie bleibt vollständig in E1 enthalten. Nur die Bildschirm-Liste wird erst beim Aufklappen aufgebaut und danach wiederverwendet, solange keine neue Aufgabe abgeschlossen wurde. Statistiken und Punkteanzeigen werden ebenfalls nicht bei jeder Reglerbewegung neu erstellt. Eine Änderung der Punkte oder des Verlaufs aktualisiert die Anzeige weiterhin.

## Prüfung

`tests/performance-touch.test.cjs` prüft alle vier Apps mit je tausend Aufgaben in einem bisherigen Speicherformat, offenen Eingaben und erhaltenem Verlauf. Vierzig unmittelbar aufeinanderfolgende Eingabeereignisse verursachen eine statt vierzig Übergaben an das nachgebildete EduLudoo-Feld. Zusätzlich geprüft: sofortiges Leeren des Speicherpuffers beim Seitenverlassen, zunächst nicht aufgebaute Historie, Wiederverwendung der geöffneten Liste, Touch-Wischen über mehrere Teile, Zurückwischen sowie unveränderte Maus- und Tastaturbedienung.

Die vorhandenen Bedienungs-, Punkte-, Runden-, Speicher- und Einbettungstests bleiben Teil der Prüfung. Die Touch-Tests verwenden Browser-Touch-Ereignisse über Chromium; die tatsächliche Serververarbeitung der Schulinstanz und die verschiedenen Geräte der Kinder werden damit nicht nachgebildet.
