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

## Zahlenrunden und begrenzte Fehlerwiederholung

Eine Zahlengruppe ist die **umgerechnete Ausgangsmenge plus der vorgegebene Zähler und Nenner**. Beispielsweise gehören drei Viertel von 1000 ml und drei Viertel von 1000 g zur selben Gruppe. Gleichwertige, aber anders geschriebene Brüche bleiben eigene Zahlenaufgaben, da sie andere Rechenschritte verlangen. Die vorgeschaltete Umrechnung ist Teil der Motivvariante: Liter → Milliliter und Kilogramm → Gramm dürfen keine zusätzliche Ziehung derselben Zahlenaufgabe innerhalb einer Runde auslösen. Die feste Situation legt die Ausgangseinheit und den Umrechnungsfaktor eindeutig fest.

In jeder Zahlenrunde wird jede noch verfügbare Zahlengruppe genau einmal gezogen, jeweils mit einer zufällig gewählten unbenutzten Situation. Schwierigkeit beeinflusst ausschließlich die Reihenfolge. Auch schwierigere Nenner werden innerhalb derselben Runde vollständig abgearbeitet, bevor eine neue Runde beginnt.

Bereits das Ziehen reserviert die Motiv-Zahlen-Kombination dauerhaft. Moduswechsel vor der ersten Antwort verbraucht deshalb ebenfalls die angezeigte Variante. Neuladen stellt die bestehende Aufgabe wieder her. Eine nicht abgeschlossene, durch Moduswechsel verlassene Aufgabe erzeugt keine Fehlerwiederholung.

Nach vollständiger Zahlenrunde wird jede darin mit Fehlern abgeschlossene Aufgabe genau einmal mit **demselben Motiv und derselben Umrechnung** wiederholt. Fehler in dieser Wiederholung erzeugen keine weitere Wiederholung. Auch die Ziehung einer Wiederholung wird reserviert und entfernt sie aus der Warteschlange. Anschließend beginnt die nächste Runde mit verbleibenden unbenutzten Kombinationen; ausgeschöpfte Zahlengruppen entfallen. Nach der letzten Variantenrunde und ihren Fehlerwiederholungen endet die Auswahl vollständig, unabhängig vom Punktestand.

Der Lernstand speichert Runde, Phase (`numbers`, `retry`, `done`), verbrauchte Kombinationen, in der Runde gezogene Zahlengruppen, alle Reservierungen samt Abschlussstatus sowie eine begrenzte Warteschlange. Historieneinträge nennen zusätzlich Runde, Reservierung und Wiederholungsstatus.

**Alte Lernstände:** Bisherige Historie und Punkte bleiben erhalten. Alle bekannten Kombinationen werden als benutzt und ihre Zahlengruppen für die Übergangsrunde als gezogen übernommen. Genau einmal vorkommende fehlerhafte Abschlüsse erhalten eine Wiederholung. Bei bereits mehrfach bearbeiteten Kombinationen wird vorsichtig keine neue Wiederholung erzeugt, weil ein früherer Wiederholungsstatus nicht rekonstruierbar ist. Eine offene aktuelle Aufgabe erhält eine Reservierung und wird weitergeführt; eine etwaige ältere Warteschlangenposition derselben Kombination entfällt.

## Speicherung und Punkte

Eigene Seite in EduLudoo: E1 als unbewertetes Textfeld und E2 mit 20 Lücken, jeweils `1` als richtige Antwort. Die App verwendet `e1_text_input` und `e2_cloze_text_input_1` bis `_20`. E1 enthält UTF-8/Base64 mit Präfix `EINHEIT:` und Widgetkennung `anteile-einheiten`. Browserfallback: `bruchrechnung-anteile-einheiten-v1`. DOM-Wurzel: `portionUnitsWidget`. Keine gemeinsame Speicherung mit den anderen Apps.

Alle Versuche einschließlich falscher oder leerer Einheitenwahl und Umrechnung werden gespeichert. Eine Aufgabe zählt nur dann auf Anhieb richtig, wenn jeder geprüfte Schritt sofort stimmt. Freie Wahl umfasst vier Prüfungen, geführte Wege sechs. Auswahl, Texteingaben, Markierungen, bestätigte Ergebnisse und gewünschte Tipps bleiben beim Neuladen erhalten. Im Verlauf stehen die Umrechnung und beide Rechnungen. Tippabruf allein zählt nicht als Fehler.

20 progressive Punkte: Für Punkt p sind insgesamt p × (p + 3) auf Anhieb gelöste Aufgaben erforderlich; ab Punkt 3 mindestens aufgerundet ein Fünftel dieser Zahl je Rechenweg. Erreichte Punkte bleiben erhalten. Historie und getrennte Statistiken entsprechen der Vorlage.

Im Editor werden Hostfelder nicht verändert. Fremde oder defekte Speichertexte werden nicht überschrieben. Fehlende Punktefelder erzeugen eine Warnung. URL-Optionen: `edulo=1`, `STATE_ID`, `SCORE_PREFIX`, `SHOW_FIELDS=1`, `editor=1`. Die tatsächliche serverseitige Wiederherstellung muss nach Einbau auf der eingesetzten EduLudoo-Seite bestätigt werden.

## Prüfung

Eigener Test: `tests/anteile-einheiten.test.cjs`; ausführen mit Node und verfügbarer Playwright-Installation (`PLAYWRIGHT_MODULE`), Browser Microsoft Edge. Geprüft werden alle vier Wegvarianten, falsche Einheit, falsche und unzulässige Umrechnung, Wiederherstellung nach jedem Schritt, Erstversuch-Wertung, alle 20 Punkteschwellen, alle 17 Zeichnungen bei 1000/390/320 Pixeln, Hostfelder und Base64-Transport, Schutz fremder Daten, Browserfallback sowie wiederholte Einbettung mit der echten lokalen jQuery-Version 2.1.1. SVG-Tags in JavaScript-Strings besitzen explizite Endtags.

Der Auswahltest durchläuft zusätzlich den gesamten echten Variantenpool, prüft vollständige Zahlenrunden ohne Zahlenduplikate, dauerhaft eindeutige Kombinationen, exakt eine motivgleiche Fehlerwiederholung trotz erneuter Fehler, Reservierungen bei Moduswechsel/Neuladen, Migration alter Historie und das endgültige Ende.


## Kompaktes Layout (17. September 2026)

Aufgabe, Visualisierung und Eingabefelder stehen in einer gemeinsamen Fläche. Regler und Prüfen sind direkt darunter angeordnet; abgeschlossene Schritte werden nicht zusätzlich als lange Liste angezeigt. Historie und Punkte bleiben erhalten. Der Titel wird in der Edulo-Einbettung ausgeblendet. Im Modus „Selbst entscheiden“ folgt nach der Wegwahl derselbe vollständige Ablauf wie bei direkter Wahl.

Die bisherige Widgetkennung, das Speicherpräfix, E1/E2 und der lokale Speicherschlüssel bleiben erhalten. `tests/compact-layout.test.cjs` prüft gespeicherte Altstände mit 100 Ergebnissen und acht Punkten, beide Wege einschließlich freier Wahl, Wiederherstellung nach jedem Schritt und alle Motive in zwei Breiten. Die Altstände in `tests/fixtures` wurden mit der vorherigen App-Fassung erzeugt; es sind synthetische Testdaten. Die Vergleichsdatei „Anteile berechnen - Layout 2.html“ bleibt separat und verwendet weiterhin ihren eigenen Testspeicher.
