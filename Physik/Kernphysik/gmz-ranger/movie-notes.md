# Filmfassung mit den Eigenaufnahmen

## Stand · 7. November 2026

Die fünf Eigenaufnahmen für Aufbau, Zählelektronik, Ionisation, Zählimpuls und Totzeit liegen vor, sind bereinigt und mit den erhaltenen Originalpassagen montiert. Die aktuelle Audiodatei ist `outputs/gmz-ranger-source/gmz-montage-elektronik.m4a`: **240,55314583333333 s**, samplegenau 11.546.551 PCM-Samples bei 48 kHz. Die Zählelektronik ersetzt den Originalbereich 49,339762–57,370352 s und liegt in der Montage bei **53,2461875–69,6511875 s**. Die Lehrkraft hat bestätigt, dass in der Totzeitaufnahme „Elektronen“ gesprochen wird.

Der Aufbau-Fehlansatz wurde entfernt. Die Aufnahmen behalten ihre Sprechgeschwindigkeit; es gibt keine Sprachsynthese oder Zeitdehnung. Die konstanten Pegelkorrekturen ergeben ungefähr −24,5 LUFS. Originaldateien bleiben unverändert. Die neue vollständige MP4 mit fünfter Aufnahme, verbesserter LCD-Anzeige und bis zum Ende der Elektronikpassage gehaltener geöffneter Ansicht ist fertig: ungefähr **4:01 Minuten**. Vollständiges Decodieren ohne Fehler, Browserwiedergabe und Seek zu 120 s sind bestanden; es gab keine Browserfehler und bei 390 px keinen Überlauf. Die AAC-Pakete entsprechen exakt der neuen Montage. Ausgewählte Einzelbilder wurden visuell geprüft; eine eigene Hörprüfung fand nicht statt.

Die Wortmarken stammen aus **lokaler ASR** und werden rechnerisch auf die samplegenaue Montage übertragen. Eine eigene Hörprüfung war technisch nicht möglich und wird nicht behauptet. Der aktuelle Zeitplan verwendet `sync.mode:'recording-cues'`, bleibt jedoch `finalSync:false` und dokumentiert `auditoryReviewByAgent:false`. Die Nutzerbestätigung zum Wort „Elektronen“ löst diese konkrete Textunsicherheit; sie ersetzt keine eigene vollständige Hörprüfung.

## Dateien und Zeitachsen

`movie.html` und `movie.js` verwenden dieselbe 3D-Szene aus `model-runtime.js` wie das Widget. Quellenbasis ist `video-timeline.json`; die Aufnahmefassung wird reproduzierbar als `outputs/gmz-ranger-source/recorded-timeline.json` erzeugt. Beim lokalen Rendern werden keine externen Bilder, Schriften, Audiodateien oder Dienste geladen.

- `timeMap` beschreibt die tatsächliche Tonmontage mit erhaltenen und ersetzten Originalbereichen. Sie verändert keine Sprechgeschwindigkeit.
- `presentationMap` ordnet ursprüngliche Szenenkoordinaten den neuen Zeitpunkten für Kamera, Kapitel und Bildtexte zu.
- `eventCues[].time` löst Bildereignisse auf der neuen Tonzeitachse aus. ASR-Wortanker betreffen unter anderem das Herausschlagen des Elektrons, das positive Ion, den elektrischen Impuls, seine Registrierung und Anfang/Ende der Totzeit. Weitere Originalmarken werden über die Montagezeitkarte verschoben.

`movie-timing.js` validiert die Karten auf vollständige, lückenlose Abdeckung und unveränderte Dauer erhaltener Originalsegmente. Das Montage-Sidecar allein ist eine technische Zeitkarte; die Aufnahmefassung ergänzt Bildregie und Ereignismarken. Ein interner Name wie `quench_end` ist kein Unterrichts- oder Sprecherbegriff zur Löschung und besitzt derzeit keine gesprochene Wortmarke.

Die Filmvorschau ist über einen lokalen HTTP-Server erreichbar, beispielsweise `movie.html?t=80`. `window.movieReady` wartet auf Szene und Schriften. `window.renderMovieAt(seconds,{draft:true})` stellt den vollständigen Zustand unabhängig von vorherigen Aufrufen her. `window.configureMovieTiming(config)` übernimmt den Aufnahmezeitplan; `window.movieViewer` erlaubt die Modellprüfung.

## Bereinigte Aufnahmen und Montage reproduzieren

Alle Befehle laufen ab Repositorywurzel. Arbeitsmedien und lokale Abhängigkeiten bleiben unter `outputs/` und gehören nicht zur Veröffentlichung. Die bereinigten Dateien liegen unter `outputs/gmz-ranger-source/replacements/cleaned/`:

| Aufnahme | Bereinigte Dauer | Konstante Pegelkorrektur | Gemessener Pegel |
|---|---:|---:|---:|
| `aufbau-cleaned.wav` | 35,921 s | +3,78 dB | −24,6 LUFS |
| `ionisation-cleaned.wav` | 11,612 s | +2,58 dB | −24,5 LUFS |
| `zaehlimpuls-cleaned.wav` | 6,599 s | +2,48 dB | −24,4 LUFS |
| `totzeit-cleaned.wav` | 40,140 s | −0,52 dB | −24,5 LUFS |
| `zaehlelektronik-cleaned.wav` | 16,405 s | +3,18 dB | −24,5 LUFS |

Format: 48 kHz, Stereo, PCM 24 Bit. Beim Aufbau entfällt der Fehlansatz der Rohzeit 22,400–27,650 s. Jeder erhaltene Abschnitt hat eine kurze 5-ms-Ein-/Ausblendung ohne Überlappung. Es gibt keine Dynamikkompression oder automatische Nachregelung. Roh-/Bereinigungs-Zuordnung, weggelassene Wörter und Schnittgrenzen stehen in den lokalen `*-cleaned-map-asr.json` und `cleaned-report.*`.

Die lokale Bereinigung ist mit `prepare_cleaned.py` reproduzierbar; bei vorhandenen eigenen WAV-Ausgaben wird `--overwrite` benötigt:

```powershell
python outputs/gmz-ranger-source/replacements/cleaned/prepare_cleaned.py --overwrite
```

Dieser Aufruf betrifft die ersten vier Aufnahmen. Die fünfte Aufnahme wird getrennt durch `python outputs/gmz-ranger-source/replacements/cleaned/prepare_zaehlelektronik.py` vorbereitet und überschreibt keine vorhandene Arbeitskopie. Von ihrer Rohdauer 18,5813125 s bleibt ausschließlich der Bereich 0,800–17,205 s erhalten; interne Wörter und Pausen bleiben bestehen. Der vollständige ASR-Wortlaut lautet: „Im Gerät befindet sich außerdem die Zählelektronik. Sie registriert und zählt die elektrischen Impulse aus dem Zählrohr. Das Ergebnis wird dann auf dem Display angezeigt. Zusätzlich kann jeder registrierte Impuls auch als Klick hörbar gemacht werden.“ Gegenüber dem freigegebenen Text erkennt ASR die Zusätze „dann“ und „auch“. Dies ist keine eigene Hörbestätigung.

`audio-edit-plan.json` nennt die Ersatzbereiche des Originals. Die aktuellen Grenzen liegen in gemessenen Sprechpausen; die erste Totzeitgrenze wurde gezielt angepasst. Das ist eine technische Schnittgrundlage, keine behauptete Hörprüfung. `audio-montage.cjs` verlangt alle fünf Dateien ausdrücklich. `--replacement1` bis `--replacement4` behalten die Bedeutung Aufbau, Ionisation, Zählimpuls und Totzeit; `--electronics` ergänzt die Zählelektronik:

```powershell
node Physik/Kernphysik/gmz-ranger/audio-montage.cjs --source outputs/gmz-ranger-source/original-video-audio.m4a --replacement1 outputs/gmz-ranger-source/replacements/cleaned/aufbau-cleaned.wav --replacement2 outputs/gmz-ranger-source/replacements/cleaned/ionisation-cleaned.wav --replacement3 outputs/gmz-ranger-source/replacements/cleaned/zaehlimpuls-cleaned.wav --replacement4 outputs/gmz-ranger-source/replacements/cleaned/totzeit-cleaned.wav --electronics outputs/gmz-ranger-source/replacements/cleaned/zaehlelektronik-cleaned.wav --output outputs/gmz-ranger-source/gmz-montage-elektronik.m4a --overwrite
```

`--plan`, `--map` und `--ffmpeg` erlauben Alternativpfade. Planpfade sind relativ zum Plan, CLI-Pfade zum Arbeitsordner. Bestehende Ausgaben werden nur mit `--overwrite` ersetzt; Eingaben und Plan bleiben geschützt.

FFmpeg decodiert für die Dauerbestimmung vollständig auf 48 kHz. Das Sidecar `gmz-montage-elektronik.m4a.map.json` enthält `duration`, `sampleRate`, `totalSamples` und `segments` mit `{kind,id?,start,end,sourceStart,sourceEnd}`. Die Montagezeit folgt tatsächlichen Samplezahlen; AAC-Padding wird separat unter `encodedAudio` ausgewiesen. Die gemeinsame AAC-Datei wird neu codiert, die Quellen werden nicht verändert. Das Sidecar bleibt `draft:true,finalSync:false`.

## Aufnahmezeitplan und Film reproduzieren

`sync-recordings.cjs` kombiniert Montagezeitkarte und lokale ASR-Zuordnungen:

```powershell
node Physik/Kernphysik/gmz-ranger/sync-recordings.cjs --map outputs/gmz-ranger-source/gmz-montage-elektronik.m4a.map.json --cleaned outputs/gmz-ranger-source/replacements/cleaned --output outputs/gmz-ranger-source/recorded-timeline.json
```

Das erzeugt `presentationMap`, Aufnahme-/Originalzuordnungen, aktualisierte Bildtexte und `eventCues` auf der Montagezeit. `finalSync:false` hält die fehlende eigene Hörprüfung ausdrücklich fest; numerische Ereignismarken werden nicht mit einer abgeschlossenen akustischen Abnahme gleichgesetzt.

Beispiel für die vollständige Filmherstellung; der Ausgabepfad ist ein ausdrücklich gewähltes Renderziel:

```powershell
node Physik/Kernphysik/gmz-ranger/render-video.cjs --timing outputs/gmz-ranger-source/recorded-timeline.json --audio outputs/gmz-ranger-source/gmz-montage-elektronik.m4a --output outputs/gmz-ranger-video-qa/ranger-recorded.mp4 --draft false
```

`--draft false` betrifft die sichtbare Arbeitsfassungskennzeichnung, nicht den dokumentierten Hörprüfstatus. `media/render-info.json` dokumentiert die aktuelle Filmdatei: H.264/AAC, 1280 × 720, 24 fps, 5.774 Bilder, 240,58333333333334 s Videodauer, 240,60410416666667 s Browser-/Audiodauer und 21.873.072 Byte. SHA256: `2b4aeab843ab2372949adcf04b2e6bde98ae4f89f65ea38f5f2425e95e43daa4`. Vollständiges Decodieren, Browserwiedergabe und Seek zu 120 s sind bestanden. Die 11.273 AAC-Pakete des Filmzeitraums stimmen bitgenau mit der neuen Tonmontage überein; AAC-Vorlauf vor 0 und nach dem Filmende liegende Pakete werden beim Vergleich ausgeschlossen. Eine eigene Hörprüfung fand nicht statt; `auditoryReviewByAgent:false` und `finalSync:false` bleiben erhalten.

Weitere gezielte Prüfaufrufe:

```powershell
node Physik/Kernphysik/gmz-ranger/render-video.cjs --timing outputs/gmz-ranger-source/recorded-timeline.json --stills-only --draft false
node Physik/Kernphysik/gmz-ranger/render-video.cjs --start 70 --duration 8 --fps 24 --output outputs/gmz-ranger-video-qa/preview.mp4 --draft true
```

`--segments '0:5,13:7,73:6'` kombiniert stumme Ausschnitte; zusammen mit `--audio` wird es abgelehnt. `--audio` verlangt einen lokalen Dateipfad und muxt dessen AAC-Ton mit `-c:a copy`; der Renderer erzeugt keine Stimme und dehnt den Ton nicht.

Der Renderer verwendet einen lokalen HTTP-Server und isoliertes Headless-Edge. JPEG-Bilder gehen mit Backpressure an FFmpeg; Ausgabe ist H.264/yuv420p mit `faststart`. Standard sind 1280 × 720, 24 fps und maximal 3 Mbit/s Videodatenrate. Encoderpfad: `--ffmpeg` oder `FFMPEG_PATH`; Playwrightpfad: `PLAYWRIGHT_MODULE`. Jeder Aufruf erzeugt Poster, Prüfbilder, Zustandsbericht und einen Pixelvergleich nach verschiedenen vorherigen Szenenzuständen. Die Länge wird auf ganze Videobilder aufgerundet, bei 24 fps um höchstens knapp 42 ms. Ein bestandener Pixelvergleich ersetzt keine Sicht- oder Hörprüfung.

## Modell- und Prüfstand

Das Gerät wird beim Aufbau und bei der Beschriftung schichtweise geöffnet. Rote Plusleitung und blaue Minusleitung bleiben mit Anode beziehungsweise Kathodenmantel verbunden. Bauteilhinweise zielen auf definierte Anker; zusätzliche Formbeschriftungen wie „flach“ oder „rund“ entfallen. Für die Funktion bleibt der Sensor zusammengesetzt.

Während der Zählelektronik-Erklärung bleibt die geöffnete Platine ortsfest und unverändert ausgerichtet; die Kamera nähert sich und hält die offene Ansicht bis zum Passagenende. Erst anschließend fährt sie zurück und das Gerät wird zusammengesetzt. Das Display verwendet die verbesserte LCD-Segmentdarstellung mit Batteriesymbol und mattem Rahmen. Die entsprechenden Einzelbilder des neuen Gesamtfilms wurden visuell geprüft; sechs aktuelle Kameratests sind bestanden. Ein direkt aus der fertigen MP4 extrahiertes Bild bei 57,25 s wurde zusätzlich geprüft: Zählelektronik und Pfeilposition stimmen.

Die Aufnahmeuhr markiert den Eintritt durch die echte Glimmerebene ausdrücklich mit `windowAt`. Die Strahlmarkierung bewegt sich kontinuierlich vom Start über das Fenster zum Kollisionspunkt. Erst nach dem Fenstereintritt zoomt die Kamera in den Gasraum, folgt dem primären Elektron mit 8–12 mm Abstand und hält bei seiner Ankunft stetig am Draht, bevor sie weich zurückfährt. Der Blickvorlauf überschreitet die verbleibende Entfernung zum Draht nicht. Die atomare Ebene und ihre starke Vergrößerung bleiben als Vereinfachung kenntlich.

52 Gasmarkierungen fliegen seeded ballistisch mit spiegelnden Reflexionen an den Grenzen des schematischen Gasvolumens. Neutrale Atome sind graublau, Elektronen cyan und positive Ionen orange. Bei einem Kontakt entstehen Elektron und Ion am tatsächlich beteiligten bewegten Atom. Jeder Elektronenzweig führt geradlinig zum eigenen Punkt auf dem Anodendraht; sein Abstand zum Ringdraht nimmt während der sichtbaren Bewegung monoton ab. Die Zielatome werden konsistent auf den Elternbahnen getroffen. Bei der individuellen Kathodenankunft geht das Ion ohne Positionssprung in eine neutrale Gasmarkierung über, die von genau dort weiterfliegt. Primäre Paarbildung und spätere Verstärkung bleiben getrennt; die Elektronik zählt den Impuls, nicht jedes Elektron der Lawine.

Die Totzeitdarstellung folgt der freigegebenen ausführlicheren Aufnahme: Positive Ionen bleiben zunächst nahe der Anode, das wirksame Feld ist geschwächt, eine weitere Elektronenlawine und ein neuer Zählimpuls bleiben aus. Die Feldanzeige bleibt dabei über null. Erst nach ausreichend weit gewanderten Ionen ist das Zählrohr wieder bereit. Die Lehrkraft hat „Elektronen“ in dieser Aufnahme ausdrücklich bestätigt. Eine Lösch-Erklärung ist nicht vorgesehen.

Ringform des Anodenleiters, innere Elektronik, Teilchengrößen, Dichte, Wege und Zeiten sind Unterrichtsvereinfachungen und sichtbar so gekennzeichnet. Primärquellen stehen in `model-notes.md`. `export-model.cjs` reproduziert GLB in Metern und Three.js-JSON in Millimetern samt erneuter Ladeprüfung; Quellen und MIT-Lizenzen liegen unter `model-vendor/`.

Die numerischen Tests belegen über mehrere Seeds tatsächliche Kontaktpositionen, monoton gerichtete Elektronenbahnen, ballistische Wandreflexionen, kontinuierliche Neutralisation und stetige Kameraführung (`atomic-motion.test.cjs`, `movie-staging.test.cjs`). `movie-timing.test.cjs` prüft die getrennten Zeitachsen. Die kombinierte Audio-, Kamera- und Timingprüfung bestand zunächst mit 21 erfolgreichen Tests und einem übersprungenen Untertest; nach der Kameraergänzung bestanden zusätzlich alle sechs aktuellen Kameratests. Einzelbilder des neuen Films bei 0, 56,81, 70,5, 86,77, 89,17, 118 und 213 s wurden visuell geprüft; der Gesamtfilm wurde vollständig decodiert und im Browser abgespielt. Browserprüfungen (`model-phase.test.cjs`, `model-ui.test.cjs`) sichern Kontakte und fließende UI-Übergänge. Die Totzeit-Kamera fährt auf 32 schematische mm an die Ionenwolke heran.

Die aktuelle Widget-Fassung bestand lokale Edge- und Windows-WebKit-26.5-Integrationstests bei angeforderten 390/920/1440 px mit synthetischem Edulo und simulierten KI-Antworten, ohne echte kostenpflichtige Anfragen. Native Canvas-Bilder belegen dort WebKits sichtbares 3D-Rendering ohne JavaScript-/WebGL-Fehler. Windows-DPI verursacht abweichende CSS-Viewportgrößen und versetzte Screenshot-Koordinaten, die in den Berichten ausgewiesen sind. Das ist weder eine Safari-/iPad-Abnahme noch ein Nachweis echten Edulo-Öffnens/Wiederöffnens. Belege liegen unter `outputs/gmz-ranger-qa/`, für WebKit in dessen Unterordner `webkit/`.

Die aktuellen Tonmontagetests bestanden mit acht erfolgreichen Tests; ein Hardlink-Untertest wurde wegen Sandbox-Berechtigung übersprungen. Synthetische Prüftöne belegen Reihenfolge, Samplezahlen, lückenlose Karten und Eingabeschutz. Die tatsächlich vorliegenden fünf Sprecheraufnahmen und ihre Montage sind zusätzlich dokumentiert; die AAC-Gleichheit zwischen Montage und Gesamtfilm ist geprüft. Die Aufnahmen sind nicht vom Agenten hörgeprüft. Frühere stumme Vorschauen bleiben historische technische Belege.
