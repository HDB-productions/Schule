# DynaMot-Arbeitsaufträge und Aufgabenmotor

Vier vollständig definierte Versuche, insgesamt **20 Punkte**. Die neue Aufgabenoberfläche wird separat durch die Integrationsaufgabe erstellt. Diese Dateien verändern weder Laborquelle noch Build noch eigenständig Edulo-Felder.

## Unterrichtsablauf

Jeder Versuch folgt demselben Muster: Aufbauauftrag mit Foto oder einer kleinen schematischen Aufbauhilfe → automatische Prüfung und Häkchen → Experimenthandlung und Häkchen → korrigierbare Dropdown-Lücken → andockbares Energieflussdiagramm. Ein gemeinsamer Auftrag steht im Vordergrund; `hints` enthält drei einzeln abrufbare Hilfen ohne Punktabzug. Der Motor akzeptiert beliebige zulässige Tischplätze und beide Kabelorientierungen. Unverbundene Zusatzgeräte stören nicht. Die konkreten Aufträge, Antwortoptionen, Lösungen und Zusammenfassungstexte stehen als Daten in `experiments` und `definitions`.

| Versuch | Aufbau und Experiment | Punkte |
|---|---|---:|
| 1 Licht erzeugen | Kurbel-DynaMot und Lampe; langsam/schneller vergleichen | 5 |
| 3 Eine Kurbel treibt die andere an (ID v2) | Zwei DynaMots mit Kurbeln; nur einer wird von Hand angetrieben. Geschwindigkeit, Antriebsrichtung und Polung variieren | 5 |
| 4 Gewicht heben (ID v3) | Kurbelgenerator treibt Motor mit Seilrolle und zunächst 0,5 kg; Gewicht sichtbar heben | 5 |
| 2 Fallendes Gewicht (ID v4) | Seilrollen-DynaMot treibt Lampe; beispielsweise 0,5 kg und 1 kg bei gleichen Start- und Vergleichshöhen | 5 |

Je Versuch: Aufbau 1 Punkt, nachgewiesene Handlung 1 Punkt, alle korrigierten Lücken zusammen 1 Punkt, richtiges Diagramm 2 Punkte. 16 Schritte, 20 Punkte. Wiederholungen erzeugen keine zusätzlichen Punkte. Falsche Antworten bleiben korrigierbar. Diese Lernbewertung ist kein manipulationssicherer Prüfungsnachweis.

Für Versuch 1 `IMG_2155.jpeg`, für Versuch 2 `IMG_2157.jpeg` als Referenz verwenden. Die Bilder zeigen keine zwingende Slotbelegung. Für Versuch 3/4 stellt die UI aus Aufbauauftrag und `reference.chain` eine beschriftete kleine schematische Hilfe bereit; es gibt kein angeblich fotografiertes Seilrollen-Referenzbild.

Beim Vergleich der Drehrichtungen gilt eine einheitliche Blickrichtung: jeweils von außen auf die Kurbel, entlang der Welle zum Gerät. Gleichnamige Pole (rot–rot, schwarz–schwarz) ergeben gleichsinnige Drehrichtung, gekreuzte Polung gegensinnige. Der passive Motor hat eine Kurbel, aber `hand=false`. Die Aussagen gelten für den vorgesehenen unbelasteten Modellaufbau. Reibung und Widerstand führen zu thermischer Energie; eine niedrigere Drehzahl allein beweist keinen bestimmten Energieverlust.

## Energieflussdiagramme

Pfeile sind Energieformen, rechteckige Kästen Stationen/Wandler. Das Gewicht wird ausdrücklich als Speicherstation beschrieben. Folgende Hauptketten sind erforderlich:

1. kinetische Energie → [DynaMot] → elektrische Energie → [Lampe] → Licht
2. kinetische Energie → [DynaMot (Generator)] → elektrische Energie → [DynaMot (Motor)] → kinetische Energie
3. kinetische Energie → [DynaMot (Generator)] → elektrische Energie → [DynaMot (Motor)] → kinetische Energie → [Gewicht] → Lageenergie
4. Lageenergie → [Gewicht] → kinetische Energie → [DynaMot] → elektrische Energie → [Lampe] → Licht

Thermische Ausgangspfeile an DynaMot und Lampe sind optional und werden zusätzlich akzeptiert. Ohne diese Nebenpfeile ist das vereinfachte Diagramm richtig; die Erklärung behauptet ausdrücklich nicht, dass Energie verschwindet. Ein zusätzlicher thermischer Pfeil ersetzt keinen erforderlichen Hauptpfeil.

Die Auswahlpalette entspricht exakt der gewünschten Unterrichtseinteilung:

- **Mechanische Energieformen:** kinetische Energie, Lageenergie, elastische Energie
- **Innere Energieformen:** thermische Energie, chemische Energie, Kernenergie
- **Elektromagnetische Energieformen:** Licht, elektrische Energie, magnetische Energie

`checkDiagram(experimentId, graph)` prüft einen gerichteten Graphen. Format:

```js
{
  nodes: [{id:'g',label:'DynaMot'}, {id:'l',label:'Lampe'}],
  edges: [
    {from:null,to:'g',energy:'kinetische Energie'},
    {from:'g',to:'l',energy:'elektrische Energie'},
    {from:'l',to:null,energy:'Licht'},
    // optional:
    {from:'l',to:null,energy:'thermische Energie'}
  ]
}
```

`null` ist das freie Anfangs-/Ausgangsende. Knoten-IDs sind beliebige eindeutige Strings. Beschriftungen entsprechen der jeweiligen `chain`. Arrayreihenfolge, Bildschirmkoordinaten und gewählte Knoten-IDs sind unerheblich. Zusätzliche falsche Kanten, doppelte Knoten, fehlende Hauptpfeile oder unverbundene Kästen werden nicht als korrekt bewertet. Die UI kann intern eine geordnete Andockkette verwenden und vor der Prüfung in diesen Graphen übersetzen. Drag-and-Drop und eine Touch-/Tastaturalternative sind Aufgabe der UI, keine Motorabhängigkeit.

## API und Integration

Browser: `DynamotTasks`; Node: CommonJS `require('./dynamot-aufgaben.js')`. Exporte: `experiments`, `definitions`, `palette`, `create`, `fromLab`, `checkBuild`, `checkDiagram`.

```js
const root = document.querySelector('#energyLab');
const namespace = 'dynamot-aufgaben-v2';
const saved = root.energyLab.getTaskState(namespace);
const engine = DynamotTasks.create(saved ? {state:saved} : {});
// Die UI bindet dieses Ereignis erst nach erfolgreichem Laden des Laborzustands.
root.addEventListener('dynamot:state', event => {
  const changed = engine.observe(DynamotTasks.fromLab(event.detail.snapshot));
  if (changed) renderCurrentStep(engine.current());
});
```

Die Integration speichert `engine.serialize()` über `setTaskState(namespace,json)`, außerhalb eines rekursiven Save/Event-Zyklus und zusätzlich nach Antwort-/Diagrammänderungen. Achtung: Teilfortschritt von Beobachtungen (`activity()`) kann sich ändern, obwohl `observe()` false zurückgibt; auch diesen Stand gelegentlich bzw. beim Verlassen speichern. Der Motor selbst schreibt nichts. E1 enthält weiter den vollständigen Laborzustand mit getrenntem `tasks`-Namensraum; Aufgaben-JSON darf E1 niemals ersetzen. Edulo-E2-Ausgabe der 20 erreichten Punkte übernimmt die Integration. Fremden oder beschädigten Zustand bei Ladefehler nicht still überschreiben.

- `create({state?, definitions?})`: neuer oder wiederhergestellter Motor. Definitionen sind austauschbare JSON-Daten. Eine reine Umordnung des exakt gleichen Definitionssets wird verlustfrei übernommen. Inhaltlich geänderte Definitionen werden weiter durch die Signaturprüfung abgewiesen. Neue physikalische Versuchsarten brauchen zusätzliche Prüflogik.
- `current(experimentId?)`: nächster Schritt im gewählten Versuch oder null, falls dieser abgeschlossen ist. Ohne ID bleibt der erste offene Schritt in Anzeigereihenfolge als Kompatibilitätsstandard erhalten. Felder `id`, `experiment`, `kind`, `points`, `text`; bei Aufbau `image`, `hints`, `reference`; bei Auswahl `questions:[{id,text,options,answer}]`; bei Diagramm `chain`, `note`.
- `observe(snapshot, experimentId?)`: true genau dann, wenn Aufbau/Handlung des gewählten Versuchs abgeschlossen wurde. Snapshot wird nicht verändert. Beim Wechsel werden nur flüchtige Messproben verworfen; bereits gespeicherte Teilhandlungen bleiben erhalten.
- `answer({questionId:optionText,...}, experimentId?)`: alle Lücken des aktuellen Auswahlschritts im gewählten Versuch; Ergebnis `{accepted,correct,feedback:{questionId:boolean}}`. Unvollständige/fremde Auswahl bleibt unbewertet; falsche gültige Auswahl wird als Versuch gespeichert.
- `submitDiagram(graph, experimentId?)`: `{accepted,correct}`; bei Erfolg nächsten Schritt im gewählten Versuch freischalten. UI verwaltet den noch unvollständigen Diagrammentwurf selbst, bei Bedarf in eigenem Namespace.
- `progress()`: `{completed,total,done,points,maxPoints}`.
- `activity(experimentId?)`: bereits erfüllte Teilhandlungen des gewählten Beobachtungsschritts.
- `results()`: vollständige Daten für die abschließende Nachschlageübersicht: Fortschritt und Experimente mit Texten, Lösungen, Erklärungen, Diagrammketten sowie `steps` mit `completed` und gegebenen Antworten/Diagrammen.
- `serialize()`: eigenes JSON, `version:2`, Definitionssignatur, Abschlüsse, Antworten, Diagramme und Handlungsevidenz. Nach Wiederherstellung sind neue Messpunkte nötig; abgeschlossene Teilhandlungen bleiben erhalten. Version 1 des frühen Entwurfs wird bewusst nicht automatisch als fertiger neuer Versuch ausgelegt.

Laboradapter: `fromLab({widget:'dynamot-lab',version:2,simulationTime,running,devices,wires,...})`. Interner Snapshot: `{time,running,slots,devices,wires}`. Zeit in Simulationssekunden; Slots M1–M3 (motor), L1–L4 (lamp). Geräte/Kabel behalten das Laborformat. Leistung positiv = Aufnahme, Generatorleistung negativ. `omega` ist tatsächliche Wellenrad/s, `rate` nur Sollwert. Handlungsprüfung nutzt tatsächliche Bewegung und Lampenleistung, nicht lediglich Reglerstellungen.

## Prüfkriterien und Modellgrenzen

Aufbau: zwei isoliert verbundene Versuchsgeräte, genau zwei Kabel an diesen Geräten, beide Pole verwendet, gültige unterschiedliche Slots, Zubehör entsprechend Versuch. Ein zusätzliches Kabel/eine Abzweigung am Versuchskreis wird abgelehnt; der geforderte einfache Vergleich würde sonst verändert. Zusätzliche unverbundene Geräte sind erlaubt.

Handlungen dürfen innerhalb eines Versuchs in unterschiedlicher Reihenfolge erfolgen. Richtungs-/Polungsvergleiche und Geschwindigkeitsvergleiche bleiben als Teilhandlungen erhalten; die UI darf deren Häkchen anzeigen. Pause und wiederholte Zeitstempel erzeugen keinen Fortschritt.

- V1: mindestens 30 % unterschiedliche tatsächliche Drehzahl mit passender sichtbarer Helligkeitsänderung > 0,015, zwei leuchtende Beobachtungen mindestens 0,2 s auseinander. Auch schneller→langsamer wird als gültiger Vergleich angenommen. Gesättigte Lampenbilder allein beweisen keine weitere sichtbare Steigerung.
- V2: tatsächlich mitdrehender passiver Motor bei normaler und gekreuzter Polung, Richtungswechsel bei gleicher Polung sowie passende Geschwindigkeitsänderung. Teilhandlungen müssen nicht in der Textreihenfolge erfolgen.
- V3: insgesamt mindestens 3 cm physikalisch plausible Höhenzunahme bei positiv drehendem, elektrisch versorgtem Motor. Sprunghaftes manuelles Hochsetzen zählt nicht als Heben durch den Motor.
- V4: nachgewiesene Abwärtsbewegung und leuchtende Lampe; zwei Massen mindestens 30 % auseinander, mit passenden Helligkeiten. Vergleichsmessungen liegen innerhalb von 8 cm gleicher Höhe und ihre beobachteten Starthöhen ebenfalls innerhalb von 8 cm. Die gleichen Geräte und gleiche Polung bleiben erforderlich; ein erneutes Hochsetzen beginnt einen neuen Falllauf. Sehr kleine stillstehende Gewichte allein erfüllen den Versuch nicht, ihre Erklärung erscheint als Lücke.

Schwellen sind didaktische Toleranzen für das vorhandene illustrative Modell, keine Messdaten realer Cornelsen-Geräte. Die Handlungen prüfen simulierte Zustände, keine menschliche Aufmerksamkeit. Mehrere Lampen sind weiterhin freies Experimentieren und werden nicht mit einer pauschalen falschen Helligkeitsregel bewertet.

## Tests

`node Physik/Energie/dynamot-labor/tests/dynamot-aufgaben.test.cjs`

Die Tests verwenden das tatsächliche aktuelle Simulationsmodell zwischen `MODEL_START` und `MODEL_END` aus der Laborquelle. Geprüft werden alle vier Versuche mit realen Modellschritten, Slots/Polung/offener Kreis/Kurzschluss, Diagrammstruktur und optionale thermische Zweige, falsche und korrigierte Antworten, Punkte ohne Wiederholungsgewinn sowie serialisierter Fortschritt. UI-/Touch-/Edulo-Tests und Gesamtdarstellung führt die Integrationsaufgabe aus.

## Aktualisierung: Reihenfolge und bestehende Lernstände

Die verbindliche Anzeigereihenfolge lautet jetzt **Licht (v1), fallendes Gewicht (v4), gekoppelte DynaMots (v2), Gewichtheben (v3)**. Die bisherigen IDs bleiben stabil; Zahlen in älteren technischen Abschnitten bezeichnen diese IDs, nicht die aktuelle Position. `experiments` und daraus `definitions` liefern bereits die neue Reihenfolge. UI-Nummern aus dem Arrayindex bilden.

Version-2-Lernstände mit der vorherigen Reihenfolge werden akzeptiert, wenn ihre Signatur genau dieselben Aufgabendefinitionen in anderer Reihenfolge enthält. Abschlüsse bleiben als eindeutige stabile IDs erhalten und dürfen nun zwischen Versuchen Lücken haben. Innerhalb eines Versuchs bleiben die Voraussetzungen strikt: Aufbau vor Beobachtung vor Antworten vor Diagramm. `current()` liefert den ersten noch offenen Schritt der neuen Reihenfolge. Bereits abgeschlossene spätere Versuche werden übersprungen. Auch falsche Teilantworten/Evidenz eines nun späteren Versuchs bleiben gespeichert. Neue Serialisierung und erneutes Laden erhalten dieses Verhalten. Inhaltlich veränderte Definitionen oder kaputte Antworten/Diagramme/Evidenz werden weiterhin abgelehnt.

Tests decken alte vollständige und halb bearbeitete Stände ab, insbesondere bereits fertiges v2 vor dem nun früheren v4, laufende Teilantworten sowie erneutes Laden eines migrierten Stands.

## Freie Versuchsauswahl

Alle vier Versuche sind jederzeit wählbar. Innerhalb eines Versuchs gilt weiter Aufbau → Durchführung → Antworten → Diagramm. Die UI speichert die gewählte Versuchs-ID unter `chosen` im bisherigen Aufgaben-Namensraum; der Aufgabenmotor führt Abschlüsse, Antworten und Beobachtungsevidenz weiter unter stabilen Schritt-IDs. Ein Wechsel verwirft daher weder Fortschritt noch Entwürfe, Notizen oder geprüfte Aufbauten. Das Nachschlagewerk und vollständig bearbeitete Versuche prüfen keine weiteren Simulationszustände. Die Punktzahl ist die Summe tatsächlich abgeschlossener Schritte, unabhängig von der Bearbeitungsreihenfolge. Das Speicherformat bleibt Version 2; alte Präfixstände und bereits migrierte Stände laden ohne Umwertung.

## Aktualisierung: Diagrammeditor

`dynamot-diagramm.js` und die danach zu ladende `dynamot-diagramm.css` erhalten die bestehende `mount/getValue`-Schnittstelle. Wertformat: `{main:[{kind,label}|null],branches:[{from:index,energy:'thermische Energie'}]}`. Kategorie der Kästen heißt **Energiewandler**. Die Palette hat auf Tablets vier kompakte Gruppen nebeneinander. Die Hauptkette hat keine Zwischenräume oder gestrichelten Rahmen; sieben Teile passen in ein 620px breites Aufgabenfenster.

Palette und bereits gelegte Teile unterstützen direktes Pointer-/Touch-Drag mit mitwandernder Vorschau und hervorgehobenem Ziel. Bei Tauschen von Kästen wandern deren Nebenäste mit. Ein thermischer Pfeil wird direkt an den unteren Ausgang eines Kastens gezogen; kein gesonderter Wärmebutton oder Auswahl-Dialog. Antippen/Enter wählt einen Begriff, danach Antippen/Enter am Ziel; Escape bricht ab. Entfernen bleibt über kleine beschriftete ×-Schaltflächen möglich. Die schreibgeschützte Übersicht stellt Hauptkette und angeschlossene Nebenäste ebenfalls dar.

Zusätzlicher isolierter Edge/Playwright-Smoke geprüft: sieben Teile bei 620px ohne horizontalen Überlauf, Antippen, Pointer-Drag eines thermischen Nebenasts, Kasten samt Ast verschieben, echtes Touch-Drag eines bereits gelegten Pfeils, readonly Nebenast. Gesamtlayout-/Tabletprüfung übernimmt die Integration.
