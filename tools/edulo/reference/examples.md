# Vorbilder gezielt nutzen

Stand der Pfade bei Einrichtung des Kits. Vor Änderungen aktuelle Dateien/Build prüfen.

| Aufgabe | Einstieg | Nur übernehmen |
|---|---|---|
| Brüche kleinschrittig üben | `Mathe/Bruchrechnung/Brueche verstehen.html` | Ablauf, Originaleingaben, Versuche/Hilfe, Aufgabenhistorie |
| Ganze/Anteile, verschiedene Lernwege | `Mathe/Bruchrechnung/Das Ganze bestimmen.html` und gleichnamiges md | getrennte Lernwege, aktive Aufgabe samt Entwurf, kleine Schritte |
| Äquivalenzumformungen | `Mathe/Äquivalenzumformungen üben - Version 2.html`, `Mathe/aequivalenz-v2.test.cjs` | exakte algebraische Prüfung, korrekte unsimplifizierte Eingaben bewahren |
| 3D-/Simulationslabor | `Physik/Energie/dynamot-labor/dynamot-labor.md` und `dynamot-labor.quelle.html` | Fachmodell, getrennte Module, lokaler Bundle-Build, Kamera/Undo/Versuche im Zustand |

Die bestehenden Widgets haben ältere eigene Speicherpräfixe und teilweise andere E2-Punktpolitik. Sie sind Fach-/UX-Vorbilder, keine aktuelle Status-API-Referenz. Für neue Projekte Kit benutzen; vorhandene Projekte nur gezielt migrieren.

DynaMot baut mit `node Physik/Energie/dynamot-labor/build-dynamot-labor.cjs`. Der spezialisierte Build bündelt lokale Three.js-Dateien, Szene, Lern-UI, Diagramme und Modell. Nicht durch den einfachen Kit-Build ersetzen: diesen nur als Einstieg für gewöhnliche Widgets nutzen. Große Bundles nicht für kleine UI-Korrekturen komplett lesen; Quelle/Einzelmodule bevorzugen.

Pädagogischer Standard: schülerseitig kurze deutsche Schritte, unmittelbare Rückmeldung, keine technischen Felder oder Diagnoseschalter. Lernende tragen ihre Arbeit selbst ein. Hilfen und Wiederholungen nicht automatisch als „auf Anhieb richtig“ werten. Technik darf die Lernfolge nicht bestimmen.
