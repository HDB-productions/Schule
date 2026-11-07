# Ranger: Quellen, Modellgrenzen und Szene

## Wiederverwendbare 3D-Dateien

`model.json` ist ein Three.js-Objekt mit eingebetteten Texturen und Millimeterkoordinaten. `model.glb` ist ein standardmäßiges glTF-2.0-Binärmodell mit eingebetteten Texturen; seine Wurzel wandelt die Geometrie in Meter um. Beide zeigen den zusammengebauten, unmarkierten Zustand ohne laufenden Mechanismus und erhalten die Metadaten zum schematischen Innenraum. Nominale Herstellermaße sind von den kleinen äußeren Vorsprüngen des Lehrmodells zu unterscheiden.

Reproduzierbarer Export aus dem Repo-Hauptverzeichnis, nach Änderungen zunächst neu bauen:

```powershell
node Physik/Kernphysik/gmz-ranger/build.cjs
node Physik/Kernphysik/gmz-ranger/export-model.cjs
```

Das Exportskript startet selbst einen lokalen HTTP-Server und einen isolierten Edge-Kontext. Es verwendet den echten `root.gmzViewer`, montiert das Modell, entfernt Hervorhebung und Mechanismus und lädt die exportierten Dateien anschließend mit Three.js `ObjectLoader` beziehungsweise dem offiziellen `GLTFLoader` neu. Es benötigt das installierte Playwright; alternativ dessen Modulpfad über `PLAYWRIGHT_MODULE` angeben. Alle Exporter-/Loader-Quellen sind lokal unter `model-vendor` mit Herkunftslinks und MIT-Lizenz abgelegt; beim Export werden keine Dateien aus dem Internet geladen.

Validierung: `model-export-validation.json`. Beide Formate enthalten 183 Geräte-Meshes und ein Schutzgitter aus Linien. Die Boundingbox ist nach erneutem Laden identisch (GLB nach Umrechnung in Meter), einschließlich Gehäuse, Bedienelementen und Vorsprüngen: etwa 68,30 × 141,05 × 34,60 mm. Der Export kanonisiert prozedurale Geometrien als reale BufferGeometry-Attribute, damit insbesondere bereits zentrierte Extrusionen beim JSON-Neuladen ihre Position behalten. Das verändert keine dargestellte Geometrie. Dateigrößen bei diesem Prüfstand: JSON 9.330.770 Bytes, GLB 2.995.372 Bytes.

## Belegte Außenform und Eigenschaften

Hersteller: [Radiation Alert Ranger, SE International](https://seintl.com/products/radiation-alert-ranger/), abgerufen am 07.11.2026.

- Außenmaße: 140 × 68 × 33 mm; Energieversorgung über zwei AA-Batterien oder USB.
- Internes, halogengelöschtes Geiger-Müller-Zählrohr; dünnes Glimmerfenster mit 45 mm wirksamem Durchmesser und 1,4–2,0 mg/cm² Flächenmasse.
- Grafisches LCD, rote Zählimpuls-LED, akustischer Impulsgeber.

[Hersteller-Bedienungsanleitung](https://seintl.com/wp-content/uploads/2026/03/Ranger-Operation-Manual-12-4-2024_241204065023.pdf), besonders die Abschnitte „The Buttons“, „The Detector“ und „Appendix A“. Die Anleitung bezeichnet den flachen Detektor als „pancake tube“ und ordnet das empfindliche Fenster der Geräterückseite zu. Die Membrantastatur besteht aus sechs äußeren Bedienbereichen und dem zentralen Ein/Aus-Knopf.

Geprüfte Bildreferenz: die vom Hauptagenten geladene öffentliche Herstelleraufnahme `outputs/gmz-ranger-source/reference/back.webp` zeigt Vorder- und Rückseite. Direkte [Hersteller-Bildreferenz](https://seintl.com/wp-content/uploads/2026/01/08ab429140c499fb6a6ae4e0783f633309bf28ba.webp). Das Modell übernimmt blaues Gehäuse, oberes Display, gelb-weiße Wortmarke, kreisförmige gelb gerahmte Tasten, rückseitiges Schutzgitter und Batteriefach. Es verwendet keine eingebetteten Fotografien. Beschriftungen entstehen lokal als Canvas-Texturen. Die Zahl auf dem Display ist eine illustrative statische Anzeige.

## Bewusste Modellvereinfachungen

Die Quellen belegen keine vollständige innere Konstruktion oder Leiterplattenbestückung dieses Geräts. Der Innenraum ist deshalb ein **Funktionsmodell**, kein Wartungsplan oder maßgetreuer Nachbau. Platinenlage, Bauteile, Verdrahtung, Hochspannungsmodul und Gehäuseteilung veranschaulichen Funktionen. Exakte Gaszusammensetzung, Betriebsspannung und Schaltung werden nicht behauptet.

Der Detektor bleibt eine flache runde Kammer: metallischer Kathodenbecher, dünne rückseitige Fensterebene, Gasraum und feiner ebener Draht als schematische Anode mit isolierter Durchführung. Die Kreisform und Lage dieses Drahts sind eine didaktische Darstellung; sie sind **kein belegtes Detail des im Ranger verbauten Zählrohrs**. Insbesondere stellt das Modell kein langes axiales Schulbuch-Zylinderrohr im Handgerät dar. Das äußere Schutzgitter ist vom gasdichten Glimmerfenster getrennt.

Gasmarkierungen und Ladungsteilchen sind stark vergrößert. Dichte, Weg und Ablaufzeiten sind nicht maßstäblich. Im Mechanismus bewegen sich Elektronen zum positiven Anodendraht und positive Ionen zur Kathodenrückwand. Die schematischen Feldpfeile zeigen vom positiven Draht in Richtung der Kathodenrückwand. Sie beanspruchen keine vollständige oder numerisch berechnete Feldgeometrie; im Inneren des ebenen Drahtrings wird insbesondere kein radiales Feld nach außen behauptet. Die dargestellte Lawine ist eine vereinfachte lokale Elektronenvermehrung; sichtbare Punkte sind keine Simulation sämtlicher Stöße oder der vollständigen Geiger-Entladung. Löschung und Totzeit sind didaktische Phasen, keine gemessenen Zeitkurven. Die Impulsmarkierung zur Auswertung steht für den elektrischen Signalweg.

## Schnittstelle

`window.createRangerViewer(container, options)` benötigt `options.THREE`, eine erreichbare lexikalische `THREE`-Konstante oder `window.THREE`. Das Modell lädt keine Netzressourcen.

Optionen: `manual` (keine eigene Animationsschleife), `interactive` (standardmäßig aktiv), `preserveDrawingBuffer`, `pixelRatio` (standardmäßig maximal 1,75), `background`, `onSelect(partId)`.

- `setExplosion(e, {preserveView:true})` mit 0…1: kontinuierliche, stufenweise Öffnung. Erst hebt sich die Vorderhälfte ab (0…0,30), danach bewegt sich die Elektronik gemeinsam (0,30…0,60), die Rückhälfte öffnet sich (0,35…0,65), zuletzt wird das Detektorfenster abgenommen (0,60…1). Gasraum, Kathode, Anode und Batterien behalten ihre tatsächliche Position. `preserveView` lässt die unabhängig interpolierte Kamera unverändert; `getExplosion()` liest den Stand.
- `revealPart(id)` gibt lediglich den passenden Zielwert zurück und löst keinen Kamera-/Montagesprung aus: Fenster/Display 0; Auswertung/Hochspannung 0,40; Batterie 0,65; Kathode/Anode/Gas 1. Optional setzt `{apply:true}` diesen Wert unmittelbar.
- `highlightPart(id|null)`: hebt das Teil hervor und stellt bei Innenteilen alle anderen Teile transparent dar.
- `focusPart(id, {immediate:true})`: fokussiert das Teil ohne verdeckende Gehäuseflächen. Der Montagezustand bleibt bedienbar.
- IDs: `window`, `cathode`, `anode`, `gas`, `voltage`, `counter`, `battery`, außerdem `shell`, `rear`, `display`.
- `resetView()`, `resize(width?,height?)`, `zoomBy(factor)` beziehungsweise `zoom(factor)`.
- `setView({yaw,pitch,distance,target:[x,y,z]})`: Winkel in Radiant, Abstände in mm; sofortige Kameraposition für Filmregie.
- `getView()` liefert den aktuellen Snapshot im gleichen Format, damit Kamerafahrten am sichtbaren Zustand beginnen können.
- `setPhase(phase, progress)` für `incoming`, `ionization`, `drift`, `avalanche`, `pulse`, `quench`, `deadtime`; `progress` 0…1. `off` blendet den Mechanismus aus. Der Aufrufer bestimmt Phasenfolge und Zeit.
- `setPairCount(n)` begrenzt die gezeigten primären Elektron-Ion-Paare auf 1…8 (Standard 8). Bei Ionisation mit Fortschritt 0 bleiben sämtliche Gasmarkierungen neutral; erst positiver Fortschritt setzt Elektronen frei. Im Einzelpaarmodus läuft die einfallende Strahlung genau auf das anschließend ionisierte Atom zu. Dadurch kann die Filmregie Ionisation und erste Drift an ein bestimmtes gesprochenes Wort binden.
- `setChargeProgress({electron, ion})` überschreibt optional den Driftfortschritt der beiden Ladungsarten unabhängig (je 0…1). Fehlende Kanäle verwenden weiter den bisherigen Phasenablauf. `setChargeProgress(null)` hebt sämtliche Überschreibungen auf. Im neuen Atomablauf betrifft eine Elektronenüberschreibung nur die primäre Drift vor der Lawine; während der sekundären Stöße haben die exakten Kontakte Vorrang. Ladungs-Meshes tragen `userData.role` (`electron` oder `ion`) und `userData.index` (0…15) für eindeutige Prüfungen.
- `setAtomicClock({time,collisionAt,electronAt,ionAt,avalancheAt,pulseAt,readyAt,seed?,gasTime?})` aktiviert bewegte Gasatome und kontaktbasierte Ionisation. Sämtliche Zeiten sind absolute Sekunden. `null` stellt die bisherigen statischen Gasmarkierungen und die Kompatibilität der alten Phasensteuerung wieder her. Vor jedem Filmbild diese Uhr explizit setzen; sie funktioniert auch bei `setPhase('off',0)`.
- `setMicroscopic(0…1)` blendet Gerät, Gehäuse und Detektorhüllen kontinuierlich aus, während Atome und Ladungen sichtbar bleiben; die Anode bleibt als schwacher räumlicher Kontext erhalten. Erst bei Transparenz 0 wird eine Hülle unsichtbar geschaltet. `getMicroscopic()` liest den Stand. Die Atomuhr allein und Phasenwechsel bei aktiver Atomuhr verändern die Gehäusetransparenz **nicht**.
- `setFieldVisibility(0…1)` / `getFieldVisibility()` steuern die Feldpfeile im Atommodus unabhängig von der mikroskopischen Ausblendung. Auch bei `setMicroscopic(1)` bleiben sie kontinuierlich einblendbar. Länge und Deckkraft folgen dem qualitativen Feldindikator; die Richtung bleibt von der positiven Anode zur Kathodenrückwand. Standardwert 0.
- `getAtomicState()` liefert den deterministischen Debug-Zustand: `space:'sensor-local-mm'`, `sensorOrigin` in Modellkoordinaten, bewegte `atoms`, `electrons`, `ions`, `radiation` und die 16 geplanten `events` (ein primärer und 15 sekundäre Kontakte). `events[i].position`, `projectileAtContact`, `electronAtBirth` und `ionAtBirth` dokumentieren denselben Stoßort. Vor Aktivierung der Atomuhr ist das Ergebnis `null`.
- Der Atomzustand enthält außerdem `fieldStrength` (rein qualitativer Wert 0…1), `measurementReady` und `avalanchePermitted`. `recovered` ist nur ein Alias für Messbereitschaft, nicht für vollständige Ionenentfernung. `neutralization.remainingIons`, `allNeutralized` und `lastArrivalAt` beschreiben den davon getrennten Neutralisationsstand. Einzelne Ionen tragen `neutralizedAt`, `neutralized` und `driftProgress`.
- `renderAt(seconds)` rendert deterministisch den eingestellten Zustand. Bei `manual:true` werden Kamera-Zielwerte sofort angewendet. Die Sekundenangabe löst keine eigenen Zustandswechsel aus; Filmregie stellt Explosion, Phase und Kamera für jedes Bild explizit ein.
- `exportModel()` gibt `Object3D.toJSON()` des Geräte-Modells einschließlich eingebetteter Canvas-Texturen zurück. `scene`, `camera`, `renderer`, `model`, `parts`, `canvas`, `mechanism` werden ebenfalls bereitgestellt. `dispose()` gibt Ressourcen frei.

Koordinaten: mm, Vorderseite +Z, Rückseite −Z, oben +Y. Sensorzentrum `[0,30,-6.9]`, Fenstermitte `[0,30,-14.8]`, rückseitige Außennormale `[0,0,-1]`, schematischer Anodenradius 13,8 mm. Gasraum und Elektroden bleiben bei der stufenweisen Öffnung an diesem gemeinsamen Ort.

Für die Funktionsanimation `setExplosion(0)` verwenden. Die räumlich nachvollziehbare Fahrt montiert zunächst das Gerät, blendet anschließend die verdeckenden Hüllen mit `setMicroscopic` aus und zoomt erst dann in das Gas. Die geöffneten Schichten dienen der Bauteilzuordnung und stellen keinen arbeitenden Detektor dar.

## Bewegung und tatsächliche Stoßorte im Atommodell

`atomic-motion.js` muss vor `model.js` geladen werden und enthält eine reine, zustandslose Auswertung. 52 Gasmarkierungen bewegen sich auf glatten, durch einen Seed bestimmten, scheinbar zufälligen Bahnen innerhalb des Gasvolumens (Radius höchstens 21,2 mm, z zwischen −3,5 und +3,5 mm). Das ist ein stark verlangsamtes Anschauungsmodell, keine molekulardynamische Rechnung und kein Anspruch auf echte atomare Abstände oder Geschwindigkeiten.

Das erste Zielatom bewegt sich nahe `[3,0,0]` in Sensorkoordinaten. Die einfallende Markierung läuft zu dessen **tatsächlicher Position bei `collisionAt`**. Vorher existieren weder das freie Elektron noch das positive Ion. Genau beim Kontakt verschwindet das neutrale Ziel, und beide Produkte entstehen am selben Punkt. Anschließend setzt sich das Elektron innerhalb von höchstens 0,25 s um schematische 2 mm vom Ion ab und verharrt dort, bis die feldgerichtete Drift bei `electronAt` beginnt. Dieser kleine, stark zeitgedehnte Freisetzungsschritt macht beide Ladungen unterscheidbar; er ist keine behauptete atomare Länge oder Stoßgeschwindigkeit. Der Übergang in die anschließende Drift ist stetig. Die Ionenbewegung beginnt frühestens bei `ionAt`. Neutrale Gasmarkierungen sind graublau, Elektronen kräftig cyan und Ionen orange.

Die Lawine besteht aus 15 geplanten Sekundärstößen in vier wachsenden Generationen nahe dem Anodendraht (Zielatome ungefähr bei Radius 12…13 mm). Ein bereits vorhandenes Elektron erreicht bei jedem Ereignis genau das bewegte Zielatom. Erst dort entstehen ein zusätzliches Elektron und ein Ion. Es gibt in diesem Modus keine beliebig eingeblendete Elektronenwolke. Das bleibt eine begrenzte Veranschaulichung der Verstärkung; die vollständige Geiger-Entladung und ihre photonischen Prozesse werden nicht simuliert. `pulseAt` markiert die schematische Sammlung der Elektronen, `readyAt` ein wieder ausreichend starkes Feld für Messbereitschaft.

Die positive Raumladung schwächt das Feld nahe dem Anodendraht. Der didaktische Feldindikator fällt deshalb in der Nähe von `pulseAt`, bleibt ausdrücklich größer als null und steigt bis `readyAt` wieder auf einen für die Modellanzeige ausreichenden Stand. Er ist **keine berechnete Feldstärke, Spannung oder quantitative Schwelle**. Während des abgeschwächten Zustands zeigt `measurementReady:false`, dass kein neuer gezählter Lawinenimpuls entstehen soll. Diese Veranschaulichung erklärt die Totzeit; sie stellt keine technische Löschung dar.

Messbereitschaft setzt im Modell **nicht** voraus, dass alle positiven Ionen die Kathode erreicht haben. Ihre individuellen, durch den Seed bestimmten Ankunftszeiten liegen teils vor und teils nach `readyAt`; erst bei der eigenen Neutralisation wird die jeweilige neutrale Gasmarkierung wieder sichtbar. Im geprüften Beispiel ist das Modell bei `readyAt` messbereit, während noch neun der sechzehn gezeigten Ionen unterwegs sind. Die zeitgedehnte Einteilung und der Schwellenindikator dienen ausschließlich der Anschauung und bilden weder die reale Ranger-Totzeit noch eine vollständige Raumladungsrechnung ab.

Fachliche Orientierung: Die [RWTH-Praktikumsanleitung zu gasgefüllten Detektoren](https://institut2a.physik.rwth-aachen.de/de/teaching/praktikum/Anleitungen/T07_20220221.pdf) erläutert die Feldschwächung durch langsamere positive Ionen und unterscheidet Totzeit von weiterer Erholung. [Collinge, „Reduction of Dead Times in Geiger–Müller Counters“](https://www.nature.com/articles/162853b0) beschreibt Messbereitschaft, sobald sich die Ionenhülle weit genug vom Draht entfernt hat und das Feld eine erneute Detektion ermöglicht; dafür ist nicht die restlose Entfernung aller Ionen aus dem Gas vorausgesetzt.

Optionales `gasTime` bewegt ausschließlich die nicht für Stöße vorgesehenen Hintergrundatome (Index 16…51) weiter, wenn eine didaktische Phase am Endpunkt pausiert. Vor dem primären Stoß gilt immer die tatsächliche `time`; sämtliche Stoßziele und Produktursprünge verwenden unabhängig davon ihre kanonischen Ereigniszeiten.

Empfohlene Kameraposen: primäre Ionisation mit Blickziel ungefähr `[3,30,-6.9]` und Abstand 25; zur Lawine auf Ziel `[7,30,-6.9]` und Abstand etwa 65 weiten. Der Übergang muss die starke Maßstabsänderung als schematische Atomansicht kennzeichnen. Die Atomuhr und die Kamera sind getrennt; keine dieser Methoden schneidet automatisch auf eine neue Ansicht.

Bedienung: Ziehen dreht, zwei Finger zoomen. Mausrad-Zoom wird nur nach Fokussierung des Canvas oder mit Strg abgefangen; außerhalb des Canvas bleibt Seitenscrollen unberührt. Pfeiltasten drehen, +/− zoomen, 0 stellt die Ansicht zurück. Der Canvas beansprucht Touch-Gesten während der direkten 3D-Bedienung.

## Prüfstand

Aktueller Atom-/Öffnungsstand: `node atomic-motion.test.cjs` prüft die reine Auswertung (52 bewegte, räumlich begrenzte Atome; ein primärer und 15 sekundäre Kontakte; Projektil/Ziel/Produkte am exakt gleichen Stoßort; keine Produkte vor dem Kontakt; Freisetzung um 2 schematische mm; stetiger Driftbeginn; zeitversetzter Ionenstart; deterministischer Rückwärtssprung; Erholung). `node model-phase.test.cjs --screenshots` prüft die tatsächlichen Three.js-Meshes im installierten Edge: dieselben 16 Kontakte, unabhängige Driftkanäle, Erhaltung der gemeinsamen Detektorpositionen, gemeinsamer Elektronikversatz, stufenlose mikroskopische Ausblendung und unveränderte Kamera mit `preserveView`. Zusätzliche Assertions sichern, dass die Atomuhr allein das Gehäuse nicht transparent macht und Phasenwechsel bei aktiver Uhr die Transparenz nicht ändern. Keine Browserfehler und keine externen Anfragen. Atom-Nahansichten liegen unter `outputs/gmz-ranger-qa/model-atomic-*.png`.

Früherer statischer Prüfstand vor der Kontaktanimation: `node --check model.js` erfolgreich. Geometrie-/API-Prüfung mit dem tatsächlich verwendeten Three.js-Modul und einem Renderer-Stub: 245 Meshes, sämtliche Positionsattribute endlich; alle sieben Innenteil-Fokussierungen bei drei Explosionsständen sowie sämtliche sieben Mechanismusphasen bei 0, 0,5 und 1 erfolgreich durchlaufen.

Zusätzlich echte WebGL-Prüfung in installiertem Edge über Playwright, ohne JavaScript-Fehler: Gesamtansicht sowie Ionisation, Drift, Lawine, Löschung und Totzeit wurden als PNG unter `outputs/gmz-ranger-qa/model-polished-*.png` gesichert und visuell geprüft. Die Funktionsdarstellung benötigt im gemessenen Bild 181 Drawcalls und rund 36.000 Dreiecke. Geprüft wurden gut erkennbare Fenster-/Kathodenränder, feiner ebener Anodendraht, geladene Teilchen mit +/−, freie Elektronen nur bis zur Sammlung, langsamere positive Ionen bis zur Kathode und wiederkehrende Feldpfeile nach Totzeit. Die integrierte Ansicht und mobile Seitenbreiten prüft der Hauptagent. Eine echte iPad-/Safari-Prüfung ist damit nicht belegt.
