# Anteile berechnen – Layout 2

Eigenständiger Vergleichsentwurf: **Anteile berechnen - Layout 2.html**. Nach Freigabe wurde das Layout am 17. September 2026 auch in **Anteile berechnen.html**, **Das Ganze bestimmen.html** und **Anteile berechnen 2.html** übernommen. Diese Vergleichsdatei bleibt mit eigenem Testspeicher erhalten; für bestehende Edulo-Seiten die jeweilige reguläre App-Datei verwenden. **Brueche verstehen.html** bleibt unverändert.

## Gestaltung

- Kein „Mathe im Alltag“ und kein Werbeuntertitel. „Anteile berechnen“ bleibt beim eigenständigen Öffnen sichtbar; in der erkannten Edulo-Einbettung entfällt der zusätzliche Titel.
- Moduswahl und „So funktioniert’s“ stehen kompakt über der Arbeitsfläche.
- Situation, Rechenauftrag, Zeichnung und Rechnung bilden eine gemeinsame Box. Im breiten Layout stehen grüne Eingabe-/Ergebniskarten direkt neben der Zeichnung; schmale Ansichten ordnen sie innerhalb derselben Box darunter an.
- Der Regler sitzt unmittelbar unter der Zeichnung. Sein Prüfbutton steht rechts daneben. Tipp und weitere Prüfbuttons bleiben am unteren Rand der gemeinsamen Arbeitsfläche.
- Die grünen Rechenkarten zeigen den konkreten Bruchbezug, etwa „1/3 von 6 m = 2 m“, plus die bestätigte Rechnung. Das Ergebnis wird direkt in einer solchen Karte eingetragen.
- Abgehakte Schrittlisten, Fortschrittsbalken, doppelte Fragen sowie zusätzliche Bildunterschriften und die Pfeilübersicht am Ende entfallen aus der Anzeige. Der vollständige Verlauf wird weiterhin gespeichert und ist in der Historie abrufbar.
- Historie und Punkte stehen unter der Arbeitsfläche. Bei kurzen Fenstern werden die Zeichnungen kompakter. Der Arbeitsbereich wurde bei 920 × 728 Pixeln geprüft, der Einstieg auch bei 920 × 506 Pixeln. Lange Tipps, viele Ausgangsobjekte oder sehr schmale Fenster können weiterhin Scrollen erfordern; es wird kein Inhalt abgeschnitten.

## Unveränderte Funktionen

Beide geführten Rechenwege und die freie Wahl, der Aufgabenpool, die Zahlenrunden, einmalige Fehlerwiederholungen, Erstversuchswertung und 20 Punkte sind aus der Originaldatei übernommen. Auch die bestehenden Korrekturen für gebündeltes Speichern und Touch-Markierung bleiben enthalten. Fragen nach Eingabezahlen akzeptieren weiterhin nur berechnete Zahlen, keine Brüche oder Rechenausdrücke.

## Unabhängig vergleichen

Für den Browservergleich beide HTML-Dateien öffnen. Der Entwurf verwendet einen eigenen lokalen Speicher (`bruchrechnung-anteile-layout2-v1`) sowie eine eigene Widgetkennung (`anteile-layout2`) und das Präfix `ANTEIL2:`. So verändert das Ausprobieren den Browser-Lernstand des Originals nicht.

In Edulo auf einer separaten Testseite mit einem eigenen unbewerteten E1-Textfeld und E2 mit 20 Punktelücken einsetzen. Die IDs und optionalen URL-Parameter entsprechen dem Original. Einen vorhandenen Original-Lernstand nicht durch ein neues leeres E1 ersetzen: Der Entwurf ist ausdrücklich eine Vergleichsversion und kein automatisches Upgrade für bestehende Schülerstände. Fremde Lernstände werden weiterhin geschützt.

## Test

`tests/anteile-layout2.test.cjs` prüft alle vier Wegvarianten, alle 20 Situationen, den sichtbaren Zusammenhang von Regler/Prüfbutton und Grafik, schmale Ansichten ohne horizontalen Überlauf, den kompakten Einstieg bei geringer Fensterhöhe, Fehlerkorrektur, Enter zum Prüfen, erhaltene Rechenergebnisse, Touch-Wischen, eigenen Speichertext, wiederholte Einbettung mit echter jQuery-Version und den Titel beim eigenständigen Öffnen. Screenshots werden im temporären Ordner `anteile-layout2` abgelegt.

Nachbesserungen: Der Regler reserviert Platz für die längste Beschriftung. Mengenbeschriftungen stehen einzeilig; Butter und Ton tragen die Gesamtbeschriftung unter dem Block und färben beim Markieren auch Ober- und Seitenflächen. Kleine Uhrsektoren erhalten kreisförmig angeordnete Mengenbeschriftungen. Der Vergleichstest prüft zusätzlich stabile Reglermaße, einzeilige SVG-Texte und die markierte Butteroberfläche. Speicherfunktionen und Speicherformat wurden bei diesen Nachbesserungen nicht geändert.
