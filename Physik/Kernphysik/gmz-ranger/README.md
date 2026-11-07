# Geiger-Müller-Zähler – Unterrichtsmodell

Lerneinheit für die Sekundarstufe I: Erklärfilm, dreidimensionales Ranger-Lehrmodell, sieben geführte Beschriftungen und eine zusammenhängende Freitexterklärung mit KI-Rückmeldung. Das echte Gerät besitzt einen flachen Pancake-Sensor; der Innenaufbau ist als Unterrichtsmodell vereinfacht. Hauptzielgeräte sind Schul-iPads in Edulo und Safari. Die Löschung wird nicht behandelt.

## Stand · 7. November 2026

- Modell, Beschriftung, Funktionsanimation, Speicherung und KI-Anbindung sind lokal umgesetzt. Der aktuelle Quellstand ergänzt gerichtete Elektronenbahnen, einen expliziten Glimmereintritt und stetiges Elektronen-Tracking mit 8–12 mm Kameraabstand. Gasatome fliegen ballistisch mit Wandreflexionen; nach Neutralisation beginnen sie genau am Kathodenendpunkt. Die Totzeit zeigt die positive Ionenwolke und das geschwächte, weiterhin vorhandene Feld. Die geänderten Aufbau-, Eintritts-, Lawinen- und Totzeitansichten wurden als Einzelbilder geprüft; die Totzeit besitzt eine eigene Nahansicht.
- Alle vier freigegebenen Eigenaufnahmen liegen vor, sind bereinigt und in `outputs/gmz-ranger-source/gmz-montage.m4a` montiert: **232,178729 s**, ohne Sprachsynthese oder Zeitdehnung, mit entferntem Aufbau-Fehlansatz und angeglichenem Pegel um −24,5 LUFS. Die Lehrkraft hat das Wort „Elektronen“ in der Totzeitaufnahme bestätigt.
- `sync-recordings.cjs` überträgt lokale ASR-Wortmarken auf die samplegenaue Montage und erzeugt `presentationMap` sowie Ereigniszeiten. Eine eigene Hörprüfung war technisch nicht möglich und wird nicht behauptet; `finalSync` bleibt `false`.
- Die neue vollständige Filmfassung liegt unter `media/gmz-ranger.mp4`; Format, Dauer und Prüfsumme dokumentiert `media/render-info.json`. Vollständiges Decodieren, Browserwiedergabe und Seek wurden erfolgreich geprüft. Die AAC-Pakete des Filmzeitraums stimmen exakt mit der Tonmontage und mit der bisherigen Videofassung überein.
- Echtes Öffnen/Wiederöffnen in Edulo und Bedienung auf einem physischen iPad bleiben offen. Browserprüfungen verwenden synthetische Konten und simulierte KI-Antworten.

## Quellen und Build

`widget.quelle.html` und `app.css` bestimmen Aufbau und Gestaltung. `lesson.js` enthält Bauteile, Aufgabe und Rubrik; `domain.js` die Lernlogik, `api.js` den Rückmeldedienst-Vertrag und `ui.js` die Oberfläche. `model.js` erzeugt Geometrien und Texturen ohne externe Modell-Assets; `atomic-motion.js` steuert Teilchenkontakte. Primärquellen und Modellvereinfachungen stehen in [model-notes.md](model-notes.md).

Im Widget-Ordner:

```text
pnpm install
node build.cjs
```

Der Build verwendet Three.js r180 aus dem vorhandenen Vendorordner, die gemeinsame Edulo-Bridge und esbuild mit Ziel Safari 15; die MIT-Lizenz bleibt erhalten. `app.js`, `widget.html`, `index.html` und `model-runtime.js` sind generiert. Build-Abhängigkeiten werden auf Schülergeräten nicht benötigt.

Die gesamte gebaute `widget.html` wird in Edulos „HTML und Dateien“ eingesetzt. Skripte, CSS, Modell und Texturen sind eingebettet. Der Erklärfilm wird separat als MP4 von GitHub Pages geladen; auch die KI benötigt Netzwerkzugang. `index.html` bietet dieselbe Einheit mit lokaler Speicherung. KI-Rückmeldungen erfordern die eigene Edulo-Ansicht mit `widget.user.uid`; es gibt keinen lokalen Ersatzlogin oder eingebetteten API-Schlüssel.

## Edulo-Einrichtung und Lernstand

Eine neue Unterrichtsseite benötigt:

1. **E1:** Text-Antwortfeld ohne Zeichenbegrenzung für den vollständigen Lernstand.
2. **E2:** 20 unabhängige Lücken, jeweils Lösung `1`, jeweils ein Punkt; keine verbundenen oder vorgegebenen Lücken.
3. **HTML und Dateien:** vollständige gebaute `widget.html`.

Die Bridge verbirgt technische Antwortfelder und Edulos Fußleiste im Lernmodus. Der Editor bleibt geschützt. Edulo setzt den Seitentitel; die Einheit nutzt die verfügbare Breite und den normalen Seitenfluss ohne inneren vertikalen Scrollbereich.

Die feste Widget-ID lautet `gmz-ranger-v1`. Die frühere GMZ-Seite hatte einen anderen Lückentext. Ihre Antworten und Punkte werden nicht umgedeutet; diese Einheit benötigt eine neue E1/E2-Konfiguration. Vorhandene alte Schülerantworten bleiben auf ihrer alten Seite.

Die Bridge-Speicherversion ist jetzt 2; Aufgaben-/Rubrikversion und Widget-ID bleiben erhalten. Die Migration von Speicherversion 1 übernimmt bereits gültige Zwölf-Aspekte-Stände unverändert und bekannte Dreizehn-Aspekte-Stände nur mit leerer KI-Historie und konsistenten ursprünglichen Punkten. Beschriftungen, Antwort, Identität sowie erreichte und unterstützte Aspekte bleiben erhalten; der entfallene Aspekt `quenching` wird unter `retiredAspects.quenching` archiviert. Unklare Altstände werden ohne Überschreiben der Originaldaten abgelehnt. Beim Laden wird nichts zurückgeschrieben; erst eine ausdrückliche Lernaktion speichert das neue Format.

Erreichbar sind **19 Punkte**: sieben Beschriftungen und zwölf Freitextaspekte. Das zwanzigste Edulo-Feld bleibt dauerhaft grau. Auf Anhieb richtig ist grün, nach Fehler oder Beschriftungshilfe richtig gelb, noch offen grau. Erreichte Punkte bleiben erhalten. Synonyme, Umlaute, Trennzeichen und begrenzte Tippfehler bei längeren Beschriftungen werden akzeptiert. Nach allen sieben Beschriftungen wird die anklickbare Komponentenliste freigeschaltet.

Entwürfe, Versuche, Hilfen und KI-Historie werden ausschließlich über die Bridge gespeichert. Ladefehler führen nicht zu einem leeren Ersatzstand. Kamera und Abspielposition sind vorübergehende Ansichten. Vor einem bewusst ausgelösten KI-Aufruf wird die genaue Einreichung gespeichert. Unveränderte Fassungen werden nicht erneut gesendet; bei unklarem Ausgang wird ausschließlich das vorhandene Ergebnis mit derselben Anfrage-ID abgerufen. Verspätetes Feedback vergibt keine Punkte für einen inzwischen geänderten Text. Bei Rückkehr zur geprüften Fassung kann es ohne neue KI-Anfrage ausdrücklich übernommen werden.

Die Rückmeldung besteht aus einem zusammenhängenden Absatz mit Leitfragen und gegebenenfalls gezielten Fehlvorstellungskorrekturen (`questions-v4`). Einzelkriterien bestimmen die Punkte; Antworten und Rückmeldungen erscheinen als Klartext. Der bestehende Dienst hat Bereitschaft und Herkunftsfreigaben für `ionic://localhost` sowie GitHub Pages bestätigt. Dies belegt keine echte Schülerprüfung.

## Film und Modellweiterverwendung

`movie.html`, `movie.js` und `video-timeline.json` verwenden dasselbe Modell für Filmaufnahmen. `movie-timing.js` trennt Tonzeit und Szenenkoordinaten. `audio-montage.cjs` montiert ausdrücklich benannte lokale Aufnahmen; `sync-recordings.cjs` erzeugt den aktuellen Aufnahmezeitplan. `render-video.cjs` rendert Bilder und codiert H.264/MP4 mit FFmpeg. Reproduzierbare Aufrufe und Prüfgrenzen stehen in [movie-notes.md](movie-notes.md).

Aufbau und Beschriftung öffnen das Gerät schichtweise. Rote Plusleitung zur Anode und blaue Minusleitung zum Kathodenmantel bleiben dabei an beiden Enden verbunden. Bauteilhinweise verwenden explizite Anker am jeweiligen Teil; zusätzliche Formbeschriftungen wie „flach“ oder „rund“ entfallen. Während der Funktion bleibt der Sensor zusammengesetzt; die Kamera zeigt zuerst den wirklichen Fenstereintritt und folgt anschließend dem Elektron in die atomare Ebene. Neutrale Atome sind graublau, Elektronen cyan und positive Ionen orange. Teilchengrößen, Wege und Ablaufzeiten sind stark vereinfacht. Die Totzeitdarstellung übernimmt die freigegebene ausführlichere Nutzerfassung; eine Lösch-Erklärung ist nicht Teil der Einheit.

`model.glb` ist der glTF-2.0-Export in Metern, `model.json` ist für Three.js ObjectLoader mit Geometrieeinheit Millimeter vorgesehen. `node export-model.cjs` erzeugt beide Dateien und prüft sie durch erneutes Laden. Beide Exporte wurden nach der Verkabelungskorrektur neu erzeugt und erfolgreich geladen; Geometriezahlen, Maße und Dateigrößen stehen in `model-export-validation.json`. Exporter, Loader, Quellenangaben und MIT-Lizenz liegen unter `model-vendor/`.

Originalton, Eigenaufnahmen, lokale ASR-Modelle und Arbeitsdateien liegen unter `outputs/gmz-ranger-source/`. Die Originale bleiben unverändert; kein Transkriptionsdienst wurde verwendet. Rohmedien und lokale Python-/Build-Abhängigkeiten gehören nicht in die Veröffentlichung. `sprechertexte-zur-freigabe.txt` dokumentiert die freigegebenen Sprechertexte, `media-plan.md` die frühere Materialanalyse.

## Prüfstand und Grenzen

Aus dem Widget-Ordner:

```text
node --test domain.test.cjs
node widget.test.cjs
node widget-migration.test.cjs
node model-ui.test.cjs
node --test atomic-motion.test.cjs model-phase.test.cjs movie-staging.test.cjs movie-timing.test.cjs audio-montage.test.cjs
```

Die aktuellen lokalen Edge-/WebKit-Integrationstests sind bestanden. Ein zusätzlicher Browsermigrationstest übernimmt vier alte Beschriftungen ohne Schreibzugriff, ergänzt die drei übrigen und lädt den gespeicherten Version-2-Stand unverändert erneut.

| Prüfung | Belegt | Noch offen |
|---|---|---|
| Windows Edge, isoliertes Profil | Echtes WebGL2, Hilfefarben, Speicherung, Gruppenfeedback, sichere Textausgabe, Duplikatvermeidung und Wiederabruf; kein Überlauf bei 390/920/1440 px | Echtes Edulo und physisches iPad |
| Windows WebKit 26.5 | Synthetischer Widget-Ablauf, sichtbares Modell in nativen Canvas-Bildern, keine JavaScript-/WebGL-Fehler; Totzeit-Feldanzeige lokal geprüft | Safari auf einem iPad |
| `model-ui.test.cjs` | Echte UI-/WebGL-Übergänge mit kontrollierter Browserzeit: Beschriftung, Funktion, Gesamtansicht und Regler nach Mikroansicht; Kontaktpositionen und Zwischenbilder | Bedienung auf dem Zielgerät |
| Fach- und Zeitlogik | 17 Domain-Tests einschließlich Speichermigration; numerische Tests für Teilchenkontakte, gerichtete Bahnen, kontinuierliche Neutralisation und Kamerafahrten | Live-KI-Qualität mit echten Schülerkonten; abschließende Bildprüfung des aktuellen Quellstands |
| Tonmontage | Samplezahlen, Segmentreihenfolge, Zeitkarten und Schutz der Eingaben; sieben Tests bestanden, Hardlink-Untertest wegen Sandbox-Berechtigung übersprungen | Eigene Hörprüfung und abschließende Bild-Ton-Abnahme |

Edge und WebKit verwenden ausschließlich synthetisches Edulo und simulierte KI-Antworten: jeweils vier simulierte, keine echten kostenpflichtigen Prüfungen. Belege liegen unter `outputs/gmz-ranger-qa/`, für WebKit im Unterordner `webkit/`. Auf diesem Windows-Host entsprach WebKits angeforderte Breite 390/920/1440 wegen DPI-Skalierung ungefähr 325/768/1202 CSS-Pixeln. Der strikte Überlaufvergleich verwendet `documentElement.clientWidth`. Native Canvas-Aufnahmen belegen das Rendering unabhängig von den dort versetzten Screenshot-Koordinaten. **Windows WebKit ist keine Safari-/iPad-Abnahme.**

Frühere Aufbau-, Übergangs-, Ionisations- und Totzeitbilder wurden lokal visuell geprüft; auch die damals vorhandene MP4 wurde technisch geprüft und abgespielt. Diese Belege ersetzen keine Abnahme der laufenden Änderungen. Die Bild-Ton-Zuordnung basiert auf ASR-Wortmarken; eine eigene Hörkontrolle des Agenten wird nicht behauptet.

Die GMZ-Kachel der bisherigen Kernphysik-Startseite öffnet die neue Einheit direkt in voller Browserbreite. Die anderen Unterrichtseinheiten behalten ihre bisherigen Verweise. Der reale Navigationsweg und die neue Ansicht bei 390 px wurden lokal geprüft. Die alte GMZ-Exportseite bleibt als historischer Bestand erhalten. `validation.json` fasst die Prüfungen und ihre Grenzen ohne persönliche Kontodaten zusammen.
