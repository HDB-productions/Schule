# Anteile berechnen 2 – Einheiten umrechnen

Eigenständige HTML-App: `Anteile berechnen 2.html`. Die vorhandenen Apps und deren Tests bleiben unabhängig.

## Ablauf

1. Eine passende kleinere Einheit im Dropdown auswählen und prüfen.
2. Die gesamte Ausgangsmenge in diese Einheit umrechnen und als ausgerechnete Zahl eingeben.
3. Den Anteil wie in „Anteile berechnen“ bestimmen: zuerst teilen, zuerst vervielfachen oder den Weg selbst wählen.

Beispiel: drei Viertel von 1 l → ml auswählen → 1000 eingeben → 1000 : 4 = 250 → 250 × 3 = 750 ml. Im geführten Modus gehören Unterteilen und Markieren dazu. Bei freier Wahl werden nur die beiden Rechnungen geprüft. Bestätigte Schritte bleiben sichtbar, Eingaben stehen vor den Zeichnungen. Tipps erscheinen nur auf Wunsch oder nach Fehlern. Vor bestätigter Umrechnung wird der umgerechnete Zahlenwert nicht durch die Zeichnung verraten.

## Aufgaben

17 Situationen: fünf Getränke, zwei Schokoladentafeln, Butter, Ton, Mehl, Reis, Lineal, Zaun mit Maßband ohne gelbes Gehäuse, Geschenkband, Seil und zwei Zeitspannen. Umrechnungen: l → ml, kg → g, m → cm, cm → mm, h → min und min → s. Schokolade verwendet realistische 0,12 bzw. 0,24 kg, Butter 0,25 bis 1 kg. Zeitspannen bleiben innerhalb eines Zifferblattumlaufs.

Jeder Zähler ist mindestens zwei. Der Anteil ist in der Ausgangseinheit nicht ganzzahlig; nach Umrechnung sind beide Zwischenwerte und das Endergebnis ganzzahlig. Jede Auswahlliste enthält genau eine kleinere Einheit derselben Größenart. Andere Antworten sind die Ausgangseinheit, eine größere Einheit oder eine andere Größenart; etwa bei Stunden: h, m, min, g. Weitere ebenfalls richtige kleinere Einheiten werden nicht gleichzeitig angeboten.

Die adaptive Auswahl berücksichtigt jüngste Trefferquote, bisherige Übung und Darstellungswechsel. Auf Anhieb gelöste Aufgaben werden nicht erneut angeboten; Aufgaben mit Fehlern können später wiederkehren.

## Speicherung und Punkte

Eigene Seite in EduLudoo: E1 als unbewertetes Textfeld und E2 mit 20 Lücken, jeweils `1` als richtige Antwort. Die App verwendet `e1_text_input` und `e2_cloze_text_input_1` bis `_20`. E1 enthält UTF-8/Base64 mit Präfix `EINHEIT:` und Widgetkennung `anteile-einheiten`. Browserfallback: `bruchrechnung-anteile-einheiten-v1`. DOM-Wurzel: `portionUnitsWidget`. Keine gemeinsame Speicherung mit den anderen Apps.

Alle Versuche einschließlich falscher oder leerer Einheitenwahl und Umrechnung werden gespeichert. Eine Aufgabe zählt nur dann auf Anhieb richtig, wenn jeder geprüfte Schritt sofort stimmt. Freie Wahl umfasst vier Prüfungen, geführte Wege sechs. Auswahl, Texteingaben, Markierungen, bestätigte Ergebnisse und gewünschte Tipps bleiben beim Neuladen erhalten. Im Verlauf stehen die Umrechnung und beide Rechnungen. Tippabruf allein zählt nicht als Fehler.

20 progressive Punkte: Für Punkt p sind insgesamt p × (p + 3) auf Anhieb gelöste Aufgaben erforderlich; ab Punkt 3 mindestens aufgerundet ein Fünftel dieser Zahl je Rechenweg. Erreichte Punkte bleiben erhalten. Historie und getrennte Statistiken entsprechen der Vorlage.

Im Editor werden Hostfelder nicht verändert. Fremde oder defekte Speichertexte werden nicht überschrieben. Fehlende Punktefelder erzeugen eine Warnung. URL-Optionen: `edulo=1`, `STATE_ID`, `SCORE_PREFIX`, `SHOW_FIELDS=1`, `editor=1`. Die tatsächliche serverseitige Wiederherstellung muss nach Einbau auf der eingesetzten EduLudoo-Seite bestätigt werden.

## Prüfung

Eigener Test: `tests/anteile-einheiten.test.cjs`; ausführen mit Node und verfügbarer Playwright-Installation (`PLAYWRIGHT_MODULE`), Browser Microsoft Edge. Geprüft werden alle vier Wegvarianten, falsche Einheit, falsche und unzulässige Umrechnung, Wiederherstellung nach jedem Schritt, Erstversuch-Wertung, alle 20 Punkteschwellen, alle 17 Zeichnungen bei 1000/390/320 Pixeln, Hostfelder und Base64-Transport, Schutz fremder Daten, Browserfallback sowie wiederholte Einbettung mit der echten lokalen jQuery-Version 2.1.1. SVG-Tags in JavaScript-Strings besitzen explizite Endtags.
