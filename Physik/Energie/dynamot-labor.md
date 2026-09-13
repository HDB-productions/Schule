# DynaMot-Labor – gemeinsamer 3D-Experimentiertisch

Öffnen: **dynamot-labor.html**. Die Datei enthält Oberfläche, 3D-Modell, lokale Three.js-Bibliothek und Simulation vollständig. Sie benötigt kein Netzwerk und lässt sich direkt im Browser öffnen. Keine Veröffentlichung vorgenommen.

Die eigenständige Lernseite enthält den Experimentiertisch und vier aufeinanderfolgende Versuche: **1 Kurbel–Lampe, 2 fallendes Gewicht–Lampe, 3 zwei DynaMots, 4 Gewichtheben**. Aufbau und Durchführung werden anhand der laufenden Simulation geprüft. Danach folgen korrigierbare Auswahlantworten und jeweils ein Energieflussdiagramm. Jeder Versuch gibt fünf Punkte (1 Aufbau, 1 Durchführung, 1 Antworten, 2 Diagramm), insgesamt 20. Eine Endübersicht erhält die geprüften Aufbauten, Antworten und Diagramme als Nachschlagewerk. Die internen IDs bleiben v1/v4/v2/v3; alte Ergebnisse werden nach IDs übernommen, nicht nach alter Position umgedeutet.

Der Diagrammeditor bietet alle neun vorgegebenen Energieformen in drei Gruppen und die passenden Gerätekästen. Begriffe lassen sich per Ziehen oder per Auswahl und Antippen anordnen. Die Prüfung verwendet einen gerichteten Graphen, keine Pixelpositionen. Licht als Lampenausgang genügt; zusätzliche thermische Energie von Lampe oder DynaMot ist ebenfalls korrekt. Das Gewicht ist in den vereinfachten Diagrammen eine eigene Speicherstation.

## Bedienung

- Ein gemeinsamer, drehbarer 3D-Tisch trägt drei DynaMot-Plätze M1–M3 an der Vorderkante und vier Lampenplätze L1–L4 auf der Platte. Jedes Feld nimmt genau ein Gerät des passenden Typs auf. Kein freies Überlagern.
- Freien markierten Platz direkt im Bild antippen und im Tisch-Popup das passende Gerät hinzufügen. Die obere Materialleiste entfällt. Die beschrifteten Tastaturziele liegen direkt auf den 3D-Plätzen; es gibt keine separate Geräteliste unter dem Tisch.
- Ein Gerät auswählen, „Umsetzen“ wählen und passenden freien Platz antippen. Kabel bleiben am Gerät. Entfernen gibt den Platz frei und entfernt dessen Kabel.
- Neue DynaMots haben kein Zubehör. Kurbel oder Seilrolle auswählen und Gerät antippen. Zubehör ersetzt einander am selben Schaft; Umbau hält die Welle an.
- Geräte öffnen kleine Pop-ups innerhalb des Tischfelds. Kurbel- und Gewichtsmarkierungen führen unmittelbar zu Tempo beziehungsweise Masse; andere Aktionen liegen unter „Weitere Einstellungen“. Lampen bieten Typwahl und Entfernen. Start/Pause befindet sich einmal zentral im Tisch.
- Kabel antippen: Es wird golden markiert, und „Dieses Kabel entfernen“ erscheint im Tisch. Erst diese Schaltfläche löscht es. „Abwählen“ beziehungsweise „Begonnenes Kabel abbrechen“ und Escape beenden die Auswahl ohne neue Verbindung.
- „Aufbau zurücksetzen“ leert ausschließlich Geräte und Kabel. Lernfortschritt bleibt erhalten; „Rückgängig“ stellt den letzten Aufbau innerhalb der geöffneten Sitzung wieder her.
- Kabel durch Antippen der tatsächlichen Buchsen am 3D-Gerät verbinden, jeweils zwei Enden. Die Ansicht „Buchsen von hinten“ hilft; Zoom vergrößert die Ziele. Kabel sind 3D-Verbindungen und drehen mit der gesamten Szene. Keine separaten A/B-Anschlussfelder. Mehrfachanschlüsse erlauben Serien- und Parallelschaltungen.
- Kurbel einschalten, Drehzahl wählen und Start drücken. Negative Drehzahl kehrt die Richtung um. Die ideale Hand hält die Drehzahl; das erforderliche Handmoment wird angezeigt.
- Gewichte fallen außerhalb der Tischkante nach unten. Ein elektrisch angetriebener zweiter DynaMot kann sie bei passender Polung und ausreichendem Antrieb heben. „Gewicht hochsetzen“ führt von Hand Lageenergie zu.
- Am Handy passen sich Szene und Bedienelemente an. Plätze können touchfreundlich über ihre beschrifteten Knöpfe gewählt werden; Buchsen bleiben direkt in 3D auswählbar. Die Gesamtansicht kann gedreht und gezoomt werden.

Die Lampenfassung ist nach dem bereitgestellten Foto IMG_2156.jpeg gestaltet: schwarze flache Grundplatte, zentrale Fassung mit kleiner runder Glühlampe, drei Schraubkontakte und seitliche Buchsen. DynaMot-Geometrie stammt aus der separaten geprüften 3D-Komponente und wurde anhand IMG_2154.jpeg korrigiert. Die vier bereitgestellten Fotos zeigen keine Schnurrolle und kein Gewicht; diese bleiben ausdrücklich schematisch.

## Physikalisches Modell

Alle folgenden Zahlen sind frei gewählte **Modellparameter, keine gemessenen Cornelsen-Gerätedaten**. Sie beziehen sich auf die sichtbare Welle; das sichtbare innere Getriebe ist nur eine Modellanimation.

Elektrisch wird der gesamte frei verdrahtete Aufbau als Widerstandsnetz berechnet. Jedes Kabel besitzt einen kleinen Modellwiderstand von **0,05 Ω**. Damit sind auch Ströme in parallelen beziehungsweise überbrückenden Kabelzweigen eindeutig berechenbar. Getrennte Komponenten werden separat geerdet, offene Brücken bleiben exakt stromlos. Für jeden DynaMot gilt:

`E = k ω`, `I = (U − E) / R`, `τ_el = k I`.

Dabei ist I positiv in den roten Anschluss hinein definiert. Bei positiver Drehzahl und abgegebener Leistung ist I negativ, also wirkt das elektrische Moment bremsend. Der Motor ist dasselbe Bauteil mit umgekehrtem Energiefluss. Die Lampe hat `P = I² R_L`. Für die Unterrichtsansicht verstärken ein Glanz, goldener Halo und Strahlen das sichtbare Leuchten; Stärke und Größe folgen monoton der berechneten Leistung und sättigen bei 3 W. Stromlose Lampen haben keinen Effekt. Pausieren friert den Zustand ein, Stillstand ohne Energiezufuhr ergibt kein Licht.

Lampenwahl: illustrative Nennmodelle mit 6 V und 1,5 / 4,5 / 9 W, entsprechend 24 / 8 / 4 Ω. Die Standardlampe behält den bisherigen Widerstand 8 Ω. Diese Werte bedeuten keine konstante Leistungsaufnahme; tatsächliche Spannung und Strom werden berechnet. Für Aufgabenvergleiche muss die Lampenart gleich bleiben.

„Elektronenfluss anzeigen“ zeigt blaue Ladungsmarkierungen entgegen der technischen Kabelstromrichtung. Bewegung und Richtung folgen `wire.current`; stromlose Zweige bleiben leer, Pause hält die Markierungen an. Kabelüberbrückungen werden im Netz mitgerechnet. Wegen des endlichen Kabelwiderstands bleibt an einer überbrückten Lampe eine kleine Restspannung statt eines künstlich erzwungenen Nullwerts.

Mechanisch gilt `J_eff dω/dt = kI − mgr − bω − τ_Reibung`. Positive Drehung hebt ein Gewicht, negative senkt es. Statische Reibung verhindert den Start, solange das antreibende Moment ihre Grenze nicht überschreitet. Bei Bewegung wirkt Coulomb-Reibung gegen die Drehrichtung. Deshalb ergibt sich eine Mindestlast aus der Momentenbilanz und keiner frei programmierten „ab x Gramm“-Fallunterscheidung.

| Parameter | Modellwert |
| --- | ---: |
| Elektromechanische Konstante k | 0,18 V s/rad bzw. Nm/A |
| Innenwiderstand R pro DynaMot | 2 Ω |
| Lampenwiderstand R_L | 8 Ω |
| Kabelwiderstand pro Verbindung | 0,05 Ω |
| Wellenträgheit J | 0,012 kg m² |
| Haft-/Gleitreibmoment | 0,03 Nm |
| Viskose Reibung b | 0,012 Nm s/rad |
| Seilrollenradius r | 0,02 m |
| g | 9,81 m/s² |
| Gewicht | 0,05–2 kg, nur Modellbereich |
| Höhe | 0–1,5 m |

Zusätzlich geht `m r²` in die Trägheit ein. Zeitschritt 0,005 s. Am Boden bzw. oberen Anschlag endet die entsprechende Bewegung; kinetische Energie wird am idealisierten Anschlag dissipiert. Beim Kurbeln hält eine ideale äußere Hand die gewählte Drehzahl, unabhängig von der Last. Das nötige Handmoment steigt mit der Last und wird angezeigt. Dieses Modell bildet daher **keine begrenzte Muskelkraft** ab. Das Einschalten kann schlagartig Energie zuführen. Bei Pause und Neuladen fließt keine Modellzeit weiter.

Grenzen: konstante Widerstände statt temperaturabhängiger Glühwendel, keine Induktivität, Getriebespiel, Rutschen, Strombegrenzung, Überlastschäden oder elastischen Seile. Die Werte dürfen nicht als zulässige Belastung des realen Geräts verstanden werden. Keine quantitative Vorhersage des konkreten Versuchsgeräts.

## Edulo und Speicherung

Für das freie Labor genügt ein **unbewertetes E1-Texteingabefeld** auf derselben Seite. Standard-ID `e1_text_input`, alternativ `e1_input`; per `STATE_ID` konfigurierbar. Die HTML-Datei als Widget einfügen. E1 enthält `DYNAMOT1:` und UTF-8/Base64-JSON mit eigener Widgetkennung und Version. Version 2 speichert Geräte, Einrastplätze, Kabel, Zubehör, Einstellungen, Drehzustand, Gewichthöhe und Simulationszeit. Version-1-Aufbauten werden nach Gerätetyp auf freie Slots migriert; IDs und Kabel bleiben erhalten. Falls ein alter Aufbau mehr als drei Motoren oder vier Lampen hat, wird er nicht abgeschnitten oder überschrieben; die Speicherverbindung meldet den Konflikt. Der gespeicherte Start-/Pausezustand wird wiederhergestellt; während der geschlossenen Seite vergeht keine Simulationszeit. Ältere Stände ohne dieses Feld starten pausiert.

Wie im Bruchrechnungswidget: nativer value-Setter, `input` und `change`, ausschließlich eigene Variablen/CSS, Editor-Schutz (`widget.isEditor`, Bodyklasse `editor`, `editor=1`). E1 wird im Lernmodus ausgeblendet; `SHOW_FIELDS=1` lässt es sichtbar. Ein fehlender Host oder beschädigter/fremder Lernstand wird gemeldet und nicht überschrieben. In Edulo wird kein lokaler Browserstand als Ersatz geladen. Außerhalb von Edulo liegt der Stand unter `dynamot-lab-v1` im Browser. Base64 ist keine Verschlüsselung.

Die Lernseite schreibt zusätzlich die zwanzig E2-Felder `e2_cloze_text_input_1` bis `_20` mit `1` oder `0`. Der Präfix kann über `SCORE_PREFIX` angepasst werden. E2 wird erst nach erfolgreicher E1-Übergabe geschrieben; fremde Feldwerte bleiben unverändert. Aufgaben, Diagrammentwürfe, Notizen und Aufbauprotokolle liegen im E1-Namensraum `tasks["dynamot-learning-v2"]`. Ein beschädigter Aufgabenstand sperrt auch die E1-Überschreibung. Teilnachweise werden regelmäßig mitgespeichert. Die Punkte sind Lernfortschritt, kein manipulationssicherer Prüfungsnachweis.

Die lokale Edulo-Nachbildung prüft Feldübergabe und Editor-Schutz. **Serverseitiges Speichern und die konkrete Upload-Größen-/HTML-Einbettungsgrenze müssen auf einer echten Edulo-Seite noch geprüft werden.** Die eingebettete 3D-Bibliothek macht die Datei etwa 2 MB groß. Eine durch Browserregeln isolierte Einbettung ohne DOM-Zugriff auf E1 kann nicht speichern.

E1 und E2 werden im Lernmodus gezielt am jeweiligen Modul (`e1`/`e2`) oder Feldcontainer (`.inputcontainer`) mit `hidden` und inline `display:none!important` ausgeblendet. Container mit dem Labor, einem iframe oder fremden Eingabefeldern werden nicht verborgen; nötigenfalls wird nur das Speicherfeld selbst versteckt. DOM-Werte und Eingabeereignisse bleiben erhalten. Wie bei den Bruchrechnungs-Widgets werden Editor-Merkmale auch im erreichbaren Eltern-/Top-Dokument geprüft (`widget.isEditor`, Bodyklasse und `editor=1`). Editor-Vorschauen bleiben sichtbar und schreiben nicht. `SHOW_FIELDS=1` erlaubt die Feldkontrolle. Ursprüngliche Sichtbarkeit und Inline-Stile werden beim Verlassen bzw. erkannten Wechsel zum Editor wiederhergestellt. `tests/dynamot-felder.test.cjs` prüft dies einschließlich konkurrierendem Host-CSS und Speicher-Roundtrip; die konkrete echte Buchansicht muss der Nutzer erneut prüfen.

## Entwicklung und Prüfung

Bearbeitet werden `dynamot-labor.quelle.html`, `dynamot-labor-szene.js`, `dynamot-aufgaben.js`, `dynamot-diagramm.js`, `dynamot-diagramm.css`, `dynamot-stromnetz.js`, `dynamot-lern-ui.js` und `dynamot-lern-ui.css`; `node build-dynamot-labor.cjs` erzeugt die einzige auszuliefernde Datei `dynamot-labor.html`. Der Build bündelt die bekannten lokalen ESM-Dateien der 3D-Komponente und die Lernoberfläche; kein Download. Originaldateien der 3D-Komponente werden nicht geändert. Three.js-Lizenz ist im Ergebnis enthalten.

`tests/dynamot-labor.test.cjs` prüft Modell und Browserabläufe mit Playwright/Edge. `PLAYWRIGHT_MODULE` kann auf die vorhandene Installation zeigen. Tests und Quellen müssen nicht in Edulo hochgeladen werden. Geprüft sind u. a. offene/einadrige/geschlossene Stromkreise, Helligkeitsänderung, Motor unter Last, zu kleine und größere Gewichte, Gewicht am zweiten Motor heben, Bodenanschlag, Kurzschlussbelastung und Leistungsbilanz bei parallelen Lampen. Browserprüfungen bauen über Klick und Ziehen auf, verbinden Kabel per Drag, wechseln Zubehör exklusiv, öffnen die 3D-Ansicht, treiben den zweiten Motor, laden gespeicherte Aufbauten und prüfen mobile Ansicht sowie zweimaliges direktes Einfügen mit jQuery 2.1.1.

Referenzen:

- [PhET Circuit Construction Kit – Virtual Lab](https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc-virtual-lab): Bedienidee Materialkasten und freie Verdrahtung, keine kopierten Assets.
- [Cornelsen Demo-Set DynaMot](https://cornelsen-experimenta.de/shop/de/Sekundarstufe/Physik/Energie/54852-Demo-Set%2BDynaMot.html): Verwendung als Gleichspannungsgenerator und Gleichstrommotor.
- [OpenStax: Electric Generators and Back Emf](https://openstax.org/books/university-physics-volume-2/pages/13-6-electric-generators-and-back-emf): Generatorwirkung und Gegen-EMK. Numerische Parameter sind eigene Vereinfachungen.

## Schnittstelle zur separaten Aufgabenintegration

`document.querySelector('#energyLab').energyLab.getSnapshot()` liefert eine tiefe Kopie mit `version:2`, `simulationTime` in Sekunden, `running`, `slots`, `devices`, `wires` und `tasks`. Geräte liefern `id,type,slot,crank,weight,hand,rate,omega,angle,mass,height,voltage,current,power,handTorque`. Kabel `{a,ap,b,bp}` referenzieren Geräte-IDs und Pole 0/1. `omega` ist die tatsächliche Drehzahl, `rate` der Sollwert; negative `power` bedeutet elektrische Abgabe. Die Aufgabenintegration erhält keinen schreibbaren Laborzustand.

Am Root erscheint `dynamot:state` mit `{reason,snapshot}` bei Bedienänderungen und etwa alle 0,1 Sekunden Simulationszeit. `getTaskState(namespace)` und `setTaskState(namespace,json)` lesen/schreiben ausschließlich den getrennten Aufgabenbereich unter `state.tasks`; dieser wird gemeinsam mit E1 gespeichert. `setTaskState` gibt bei erfolgreicher Übergabe `true` zurück. Die integrierte Lernoberfläche schreibt danach E2.

`getPersistenceStatus()` liefert `{ready,blocked,editor,edulo}`. Das Ereignis `dynamot:state` mit `reason:"init"` erscheint nach dem Ladeversuch, auch bei einem geschützten Fehlerzustand. Die Aufgabenintegration prüft vor E2-Schreiben `ready && !blocked && !editor`. Aufgabenstand-Schreiben publiziert kein erneutes State-Ereignis (Schleifenschutz). `blockPersistence(reason)` schützt bei beschädigten Aufgabenständen auch den gesamten ursprünglichen E1-Text.

Die Buchsen besitzen transparente, beschriftete Schaltflächen unmittelbar an ihren projizierten 3D-Positionen. Sie verbessern Touch- und Tastaturbedienung, ohne separate Anschlussfelder einzuführen. Die Positionen folgen Drehen und Zoomen.

Der vollständige integrierte Browserdurchlauf und seine Grenzen sind in `tests/dynamot-integration-qa.md` dokumentiert. `tests/dynamot-qa-server.cjs` stellt ausschließlich eine lokale Edulo-Feldnachbildung bereit.

Die abschließende Tablet-, Touch- und Bedienprüfung nach den Überarbeitungen ist in `tests/dynamot-bedienung-qa.md` dokumentiert; sie ersetzt die älteren Bedienangaben.


Die Elektronenphase wird je Kabel mit dem Simulationszeitunterschied fortgeschrieben. Vergangene Experimentierzeit beeinflusst die Geschwindigkeit nach einem Gewichtsreset nicht. Kabelphasen bleiben bei erneutem Zeichnen erhalten; neue Kabel beginnen bei Phase null. Lampen bleiben feste ohmsche Modellwiderstände.

Die Diagrammpalette zeigt alle neun Energieformen und die jeweils benötigten Energiewandler dauerhaft gleichzeitig. Keine aufklappbaren Kategorien. Die vorhandenen 3D-Platzflächen und Beschriftungen sind die einzige sichtbare Slotdarstellung. Transparente 44-px-Touchziele liegen direkt auf den Beschriftungen; keine zusätzlichen Labels oder Führungslinien.

## Gebogene Kabel und vollständiger Seitenstand

Kabel führen vom seitlichen Steckerausgang auf die Tischplatte, folgen dort einer lockeren Kurve und steigen zum anderen Stecker an. Zusammengesetzte Bézierkurven berücksichtigen Motor-, Lampen-, Diagonal- und Brückenverbindungen sowie belegte Geräteflächen. TubeGeometry, Elektronenbewegung über Bogenlänge und Touch-Hit-Test verwenden dieselbe Kurve. `routeLane` und Kabelfarbe bleiben nach Entfernen anderer Kabel und nach Neuladen erhalten.

Mehrere Stecker werden entlang der Buchsenachse gestapelt, mit sichtbarer rückwärtiger Buchse und eigenem seitlichem Kabelausgang. Nach Entfernen eines unteren Steckers rückt der Stapel nach. Später gelegte Kabel werden bei gemeinsamen Tischstrecken und Kreuzungen lokal über frühere Kabel angehoben; die übrige Kabelform bleibt bestehen. Keine Seilphysik und keine Garantie globaler Kollisionsfreiheit in beliebig dichten Aufbauten.

Der visuelle Katalog `tests/kabel-katalog/index.html` enthält alle 91 unterschiedlichen Buchsenpaare. Geometrisch wurden jeweils nur die beteiligten Geräte und zusätzlich alle sieben belegten Plätze geprüft (182 Konfigurationen). Steckerstapel, echte Kreuzung, drei gemeinsame Leitungen, Touch-Auswahl und Speichern werden durch eigene Browserprüfungen ergänzt.

Zusätzlich zum gesamten fachlichen Stand speichert derselbe JSON-Text nun Kameraposition und Kameraziel (Zoom enthalten), ausgewählte Aufgabenseite, geöffnete Aufgabenhinweise und Aufgaben-Scrollposition, Geräte-/Kabelauswahl, begonnene Kabelverbindung, geöffnetes Bauplatz-Popup, Start/Pause und den Rückgängig-Aufbau. Vorhandene gespeicherte Stände bleiben kompatibel. Reine Pointerbewegungen und die momentane Punktphase der Elektronen werden nicht als Arbeitsstand gespeichert; der Fluss beginnt beim Laden ohne Zeitsprung neu. Der Startzustand bleibt ansonsten erhalten.

E1 und localStorage verwenden exakt denselben serialisierten Zustand. In Edulo wird ausschließlich E1 eingelesen, kein Browserfallback. E2 bleibt bei zwanzig Feldern mit0/1 und insgesamt maximal20 Punkten. Die lokale Feldnachbildung prüft den Roundtrip einschließlich widersprüchlichem localStorage; echte Edulo-Serverspeicherung und Uploadgrenzen sind weiterhin separat zu prüfen.

## Zweifinger-Kamerabedienung

Ein Finger dreht den Tisch. Zwei Finger verschieben die Ansicht über die Bewegung ihres Mittelpunkts und zoomen gleichzeitig über ihren Abstand (OrbitControls DOLLY_PAN, bildschirmbezogenes Pan). Nach Mehrfinger-Gesten und Abbruch werden keine Anschluss-Klicks ausgelöst; ein neuer Tap funktioniert normal. Kameraposition und Ziel werden über den bestehenden Speicherweg in localStorage bzw. E1 erhalten. Keine zusätzliche Begrenzung der Verschiebung; die vorhandenen Zoom- und Winkelgrenzen bleiben bestehen. `tests/dynamot-touch-pan.test.cjs` prüft echte Chromium-Multi-Touch-Ereignisse bei 1024×668 und 1180×720: Pan in beiden Achsen, kombiniertes Pinch/Pan, Übergang zu Einfinger-Orbit ohne Sprung, Abbruch, Seitenscroll, Tap und Kamera-Restore über beide Speicherwege. Eine Prüfung auf physischer Tablet-Hardware steht aus.
