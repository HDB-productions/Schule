# Historische Materialanalyse und erste Textvorschläge

Diese Analyse dokumentiert den Stand vor der Textabstimmung. Die später freigegebenen Texte stehen in `sprechertexte-zur-freigabe.txt`; Aufnahme, Montage und aktueller Prüfstand sind in `movie-notes.md` dokumentiert. Die folgenden ursprünglichen Vorschläge sind kein gültiger Endtext.

## Herkunft und belastbare Auswertung

Die Originale wurden ausschließlich gelesen:

- `3 GMZ mit voice.pptx` (lokale Originaldatei)
- `3 GMZ mit voice.mp4` (lokale Originaldatei)

Die PowerPoint enthält vier Folien, vier AAC/M4A-Sprecheraufnahmen und keine Notizfolien. Ihre Folientexte sind **kein Sprechertranskript**. Der MP4-Ton wurde zusätzlich mit lokalem faster-whisper `small`, Deutsch, CPU/int8, Wortzeitmarken, transkribiert. Dabei wurden ausschließlich Software und ein öffentliches Modell heruntergeladen; die Aufnahmen wurden nicht hochgeladen. Das Ergebnis ist ein automatisches Arbeitsprotokoll, kein wortgetreu gegen das Gehör geprüfter Text. Sichtbare Erkennungsfehler wie „Geiger-Müller-Zero“, „Todzeit“ und „dedektieren“ sind keine belegten Aussprachefehler des Originals. Satzgrenzen und Schnittpunkte müssen vor einem endgültigen Tonschnitt am Audio geprüft werden.

Die Ausgaben unter `outputs/gmz-ranger-source/` bleiben Arbeitsmaterial und sollen nicht als unbearbeitete Originalmedien ins Repository committed werden.

## Wiederverwendbare Originaldateien

| Datei unter `outputs/gmz-ranger-source/` | Inhalt |
|---|---|
| `original-video-audio.m4a` | AAC-Stream des MP4 verlustfrei kopiert, ohne neue Codierung |
| `original-video-audio-16k.wav` | Mono/16-kHz-PCM-Kopie für lokale Transkription |
| `ppt/media/media1.m4a` bis `media4.m4a` | Unveränderte, aus der PPTX extrahierte Originalsprecheraufnahmen, je eine pro Folie |
| `pptx-inventory.json` | Folientexte, XML-Zeitangaben, Medienbezüge und Inventar |
| `slide01.xml` bis `slide04.xml` | Unveränderte Folien-XML-Auszüge |
| `media-probe.json` | Dauer, Codecs, Bildgröße und Stream-Metadaten |
| `transcript-asr.json` | Automatisches Transkript mit Wortzeitmarken und Konfidenzen |
| `transcript-asr.txt` | Automatisches Transkript mit Segmentzeitmarken |
| `original-contact-sheet.jpg` | Sichtprüfung ausgewählter Originalvideobilder |

MP4: **207,141306 s**, 1920 × 1080, H.264, AAC/44,1 kHz. Die vier PPT-Audios dauern 17,030204 s; 40,296667 s; 45,079864 s; 104,616372 s. Ihre Summe 207,023107 s liegt knapp 0,12 s unter der MP4-Dauer. Deshalb für konkrete MP4-Tonschnitte die MP4-Zeitmarken verwenden; Folienzeitangaben nicht ungeprüft als endgültige Schnittgrenzen einsetzen.

## Kapitel und Ausgangszeiten

| Kapitel | Nominal nach PPT-Audiodauern | Inhalt und Hinweis |
|---|---:|---|
| 1 | 0,000–17,030 s | Einführung, schematische Gesamtansicht |
| 2 | 17,030–57,327 s | Bauteile, Glimmerfenster, Elektroden, Spannung und Zähler; alte Zylindergeometrie muss zum Pancake angepasst werden |
| 3 | 57,327–102,407 s | Vergrößerung Gas, Ionisation, Elektron und positives Ion |
| 4 | 102,407–207,023 s | Sekundärionisation, Lawine, Zählung, Nichtnachweis, Ionenbewegung, bisherige Totzeiterklärung |

Für den neuen Film ist diese Reihenfolge weiter sinnvoll. Löschung und eine korrigierte Totzeiterklärung gehören in Kapitel 4. Die neue 3D-Ansicht soll die flache Geometrie zeigen; das Gas, die Ladungsträger und die Vorgänge bleiben ausdrücklich schematisch. Die tatsächliche Anodenführung darf nur nach bestätigter Referenz konkret modelliert werden; der Textvorschlag behauptet deshalb keine zentrale, axiale Drahtgeometrie.

## Vorgeschlagene Sprecheränderungen

Alle folgenden Texte sind **Vorschläge zur Freigabe**. Es wurden keine Ersatzaufnahmen erstellt. Die Zeitfenster beziehen sich auf die automatische Transkription des Original-MP4 und sind Satzbereiche, keine bereits abgenommenen Audio-Schnittmarken.

### 1. Bildbezug: 13,72–16,98 s

Original laut ASR: „Unten sieht man den schematischen Aufbau so eines Gerätes.“

Nur erforderlich, wenn die neue Ansicht nicht unten im Bild steht:

> Hier sieht man den schematischen Aufbau eines solchen Gerätes.

### 2. Bauteile und Pancake-Geometrie: 17,54–48,48 s

Die vier Originalsätze nennen einen Metallzylinder, dessen Verschluss, einen Draht in der Zylindermitte und die Anschlüsse an Zylinder und Draht. Ein zusammenhängender Ersatz vermeidet vier auffällige kleine Tonschnitte:

> Im Ranger arbeitet ein flaches, rundes Geiger-Müller-Zählrohr, ein sogenannter Pancake-Detektor. Sein Metallgehäuse bildet die Kathode. Im Inneren befinden sich eine Gasfüllung und eine dünne Drahtelektrode, die Anode. Die große Vorderseite ist durch ein sehr dünnes Glimmerfenster verschlossen. Durch dieses Fenster kann Strahlung eindringen, während das Gas im Detektor bleibt. Eine Hochspannungsquelle hält die Anode gegenüber der Kathode auf positivem Potential.

Grund: passende flache Geometrie; keine Behauptung eines axialen Drahts; Spannung als Potentialunterschied statt pauschal als negative/positive Ladung des ganzen Bauteils. Die einfache Originalformulierung ab 49,48 s über Zähler und Widerstand kann erhalten bleiben, sofern die neue Schaltung sie passend zeigt.

### 3. Begriff Ionisation: 73,04–86,28 s

Das Original formuliert laut ASR, die Strahlung treffe ein Elektron und sei in der Lage „dieses zu ionisieren“. Gemeint ist die Ionisation des Atoms. Vorgeschlagene fachliche Präzisierung:

> Trifft ionisierende Strahlung auf das Gas, kann sie ein Elektron aus einem Atom herausschlagen. Diesen Vorgang nennt man Ionisation. Dabei bleibt ein positiv geladenes Ion zurück.

Der anschließende Originalsatz 87,34–96,06 s kann die Bewegungsrichtungen erklären; die Wiederholung des entstandenen Ions ist didaktisch vertretbar. Falls ein straffer Ablauf gewünscht wird, diese beiden Sätze gemeinsam überarbeiten und erneut vorlegen.

### 4. Lawine und Zählimpuls: 113,08–131,13 s

Das Original lässt die Elektronenlawine „durch den Zähler wandern“. Für die neue Animation ist eine Trennung zwischen Vorgang im Gas und äußerem Zählimpuls verständlicher:

> So entsteht nahe an der Anode eine Elektronenlawine. Die Bewegung der Ladungen erzeugt einen kurzen elektrischen Impuls im äußeren Stromkreis. Die Elektronik registriert diesen Impuls als ein Zählereignis. Damit wissen wir: Im Detektor hat eine Ionisation stattgefunden.

Die Originalerklärung 131,57–148,99 s, dass Strahlung ohne Ionisationsereignis unbemerkt passieren kann, bleibt grundsätzlich anschlussfähig.

### 5. Ionen, Löschung und Totzeit: 151,21–204,32 s

Das Original behandelt zwar die langsame Ionenbewegung und nennt die Totzeit. Seine Erklärung ist jedoch missverständlich: Sie begründet den Nichtnachweis damit, dass die Ionen selbst keine weiteren Ionisationsprozesse detektieren könnten, und sagt, es könne kein weiterer Prozess stattfinden. Neue Ionisation und ein erneut registrierbarer Impuls müssen unterschieden werden. Eine nur angehängte Ergänzung würde diese Aussage stehen lassen. Deshalb zusammenhängender Ersatzvorschlag:

> Nach dem Impuls bleiben zunächst viele positive Ionen im Gas zurück. Sie bewegen sich deutlich langsamer als die Elektronen zur Kathode. Ihre Ladung schwächt das elektrische Feld in der Nähe der Anode. Deshalb kann das Zählrohr für kurze Zeit keinen weiteren vollständigen Zählimpuls erzeugen. Diese Zeit heißt Totzeit. Weitere Strahlung kann in dieser Zeit trotzdem das Gas ionisieren, wird aber nicht als separates Ereignis gezählt. Damit die Entladung nicht von selbst weitergeht, muss sie gelöscht werden. Dazu trägt ein Löschgas in der Gasfüllung bei. Auch der große Vorwiderstand hilft, die Entladung zu beenden. Danach erholt sich das elektrische Feld, und das Zählrohr ist wieder messbereit. Diese Vorgänge laufen sehr schnell ab; die Animation zeigt sie stark verlangsamt.

Planungsdauer ungefähr 50–60 s; nach Freigabe hängt die genaue Länge von der Aufnahme ab. „Löschgas“ und Vorwiderstand müssen im 3D-Film nachvollziehbar markiert werden. Konkrete Gerätespezifikationen wie Spannung, Gaszusammensetzung oder Totzeit in Mikrosekunden werden hier bewusst nicht ergänzt; sie bedürfen einer bestätigten Ranger-Referenz. Totzeit und die anschließende Erholungsphase in der Darstellung nicht als identisch behandeln.

## Grenzen und nächste Schritte

1. Hauptagent prüft den Text fachlich gegen die herangezogenen Gerätereferenzen und legt dem Nutzer die konkreten Ersatztexte zur Entscheidung vor.
2. Bis zur Freigabe können die 3D-Geometrie und die neue Animation mit dem unveränderten Originalton als interne Arbeitsfassung geplant werden. Sie dürfen nicht als fachlich fertiger neuer Film ausgegeben werden, solange der Ton noch vom Zylinder oder der bisherigen Totzeiterklärung spricht.
3. Erst nach Freigabe Ersatzaufnahme oder ausdrücklich genehmigte Sprachsynthese, Tonschnitt an hörgeprüften Satzgrenzen und Endkontrolle der Synchronität. Kein neues Video wurde in dieser Teilaufgabe gerendert.
