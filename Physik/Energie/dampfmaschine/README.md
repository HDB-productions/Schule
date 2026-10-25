# Dampfmaschine – Energie auf Reisen

Uploadfähiges Edulo-Widget: `widget.html` ist eine einzelne, offline nutzbare HTML-Datei. Die interaktive Ansicht ist ein echtes, lokal berechnetes Three.js-3D-Modell nach dem zuletzt bereitgestellten Foto: Chromkessel hinten links auf dem Ziegelfeuerhaus, hohe Esse am hinteren Ende, Galerie mit zwei Leitern und separater Kolbenantrieb vorne rechts mit Schwungrad dahinter. Der Transparentmodus macht Kessel, Dampfleitung, Zylinder und den vollständigen Kesselunterbau durchsichtig: Mauerwerk einschließlich Esse, Galerie, Geländer, Leitern und Kesselboden. In der normalen 3D-Ansicht ist die seitliche Ziegelwand geschlossen; das Nachlegen erfolgt durch die kleine schwarze Luke vorn. Brennstoff und Feuer liegen innerhalb des Gehäuses. Three.js und dessen MIT-Lizenz sind vollständig in der HTML-Datei eingebettet; keine Netzverbindung ist nötig. WebGL wird benötigt.

## Einbettung und Navigation

Das Widget hat keine eigene Seitenüberschrift; den Titel setzt die umgebende Edulo-Seite. Es nutzt die volle verfügbare Breite und natürliche Inhaltshöhe. Weder der Root noch der Inhaltsbereich haben eine feste Viewporthöhe oder einen eigenen vertikalen Scrollcontainer; die ganze Seite scrollt. Das breite Energieflussdiagramm darf auf schmalen Bildschirmen weiterhin lokal horizontal verschoben werden.

Oben stehen stets nur die beiden anderen Ansichten als gleich breite Buttons. Aufgabenbuttons nennen den zugehörigen Punktestand: Lückentext 9 und Energieflussdiagramm 11 Punkte. Die aktive Ansicht wird nicht noch einmal als Button angeboten. Das Gesamtergebnis bleibt für assistive Technologien verfügbar; sichtbar stehen die Punkte in den Buttons.

## Unterricht

1. Simulation: Start/Pause, 3D-Ansicht/Transparentmodus, Energiequadrate und Wirkungsgrade. Mit der Maus ziehen zum Drehen, Mausrad zum Zoomen; auf Touchscreens mit einem Finger drehen, mit zwei Fingern zoomen/verschieben. Zusätzliche Zoomknöpfe, Gesamtansicht und Direktansichten für Kessel, Dampfleitung und Kolben. Die Kamera bleibt bei Pause, Ansichtswechsel und Größenänderung erhalten. Die Namen der drei Energieformen lassen sich einzeln über das Auge aufdecken.
2. Lückentext: drei klar gegliederte Abschnitte und neun Auswahlfelder mit vollständigen Begriffen (z. B. „chemische Energie“). Jede Lücke hat vier gestaffelte Hilfen. Nur die erste Hilfe erlaubt weiterhin Grün; jede weitere Hilfe ab Stufe 2 oder ein falscher Prüfversuch führt bei später richtiger Lösung zu Gelb. Höchste geöffnete Hilfestufe und Fehlversuche werden gespeichert. Brennstoff-Beispiel als zusätzliche aufklappbare Hilfe ohne Wertungsänderung.
3. Energieflussdiagramm: Energieformen als Pfeile, Brennstoff/Kessel/Zylinder als Kästen. Zuerst Hauptkette ohne Verluste; nach korrekter Bearbeitung erscheinen im gleichen Diagramm vier Wärmeabzweige. Einen Rechenteil zu Wirkungsgraden gibt es nicht mehr.

Modellbilanz eines nach dem Aufheizen weitergegebenen Pakets: 100 Energieeinheiten Brennstoff → 80 im Wasser → 60 im Dampf → 12 nutzbar am Rad. Bei den Übergängen entstehen thermische Abgaben 20 + 20 + 48; Gesamtwirkungsgrad bis zum Rad 12 %. Nach mehreren Radumdrehungen wird auch die Radenergie (12 Einheiten) durch Reibung zu thermischer Energie der Umgebung. Die Teilwirkungsgrade 80 %, 75 %, 20 % sind frei gewählte Unterrichtswerte, keine Messwerte des Schulgeräts.

Der Kaltstart beginnt mit zehn weißen Brennstoffstücken direkt in der Feuerstelle. Beim Brennen werden sie allmählich schwarz. Es gibt genau zehn wiederverwendbare Plätze, keine externe Vorratsfläche. „Brennstoff nachlegen“ ersetzt bis zu fünf verbrannte Stücke; wenn weniger Plätze frei sind, werden nur diese gefüllt. Bei voller Feuerstelle ist Nachlegen gesperrt.

Die Wärme entsteht ausschließlich durch ankommende Energiepakete, nicht durch eine laufende Uhr: Die ersten vier thermischen Pakete sammeln sich im Wasser. Bei vier Paketen beginnt das Sieden. Vorher steht der Druck exakt auf niedrig, es gibt keinen Dampftransport und keine Siedeblasen. Sobald ein fünftes Paket im Wasser ankommt, verdrängt es das älteste in die Dampfleitung. Die vier jüngeren bleiben im Wasser. Dies wiederholt sich nach dem FIFO-Prinzip bei jeder neuen Wärmezufuhr. Unterschiedlich große, verteilt aufsteigende Blasen werden unabhängig von den eingeblendeten Energiequadraten gezeigt.

Bei Sieden steigt die Druckanzeige verzögert. Erlischt die Flamme, sinkt der Druck allmählich (Halbierung im Modell nach etwa 5,8 Sekunden), auch über den Übergang von vier auf drei Wasserpakete hinweg; die gespeicherte Wärme bleibt zunächst erhalten und wird nach einer Haltephase schrittweise an die Umgebung abgegeben. Die Reservoiranzeige zeigt stets die tatsächlich im Wasser gespeicherten Pakete. Die Modelltemperatur folgt der Paketanzahl (20 + 20 pro Paket), sie ist kein Messwert des echten Geräts.

Energie im Rad fährt drei volle Umdrehungen mit und driftet anschließend als thermische Energie ab. Ohne Wirkungsgrade gibt es an den drei Übergängen keine Abzweige; die spätere Reibung am Rad bleibt sichtbar. Der Schalter gilt für noch unverbrannten Brennstoff, bereits unterwegs befindliche Pakete behalten ihre Bilanz.

Das Modell speichert jedes Paket mit dauerhafter ID, Energiemenge und Phase. Es erzeugt chemische Energie ausschließlich beim erstmaligen Befüllen bzw. beim Nachlegen. Die Umgebung nimmt die ausgeblendete, verteilte Wärme in einer Bilanz auf: Summe aller Paketenergien + Umgebung = insgesamt zugeführte Energie. Pause hält den gesamten Ablauf an; Wiederöffnen setzt den gespeicherten Zustand fort. Temperatur, Druck und Zeiten sind anschauliche Modellgrößen, keine technische Simulation des Schulgeräts.

Das Diagramm verwendet dieselbe Darstellungsweise wie die Flaschenrakete: farbige Pfeilbausteine für Energieformen, rechteckige Wandler, verbundene Hauptpfeile und abgebogene zusätzliche Ausgänge, Beschriftungen direkt auf den Formen. Bausteine werden durch Antippen oder Ziehen zugeordnet. Nach gelöstem Hauptweg erscheinen im selben Diagramm vier thermische Ausgänge (Brennstoff, Wasser→Dampf, Zylinder und Radreibung). Die Radreibung ist eine spätere Energieabgabe, kein weiterer Faktor des Wirkungsgrads bis zum Rad.

Der Text wurde sprachlich geglättet und fachlich präzisiert: Überdruck im Kessel und Druckunterschied treiben die Strömung; Druck selbst wird nicht als eigene Energieform bezeichnet. Das Schulmodell verwendet thermische Energie für die innere Energie des heißen Dampfes.

## Edulo-Einrichtung

Wie bei der Flaschenrakete: vollständige `widget.html` in „HTML und Dateien“ einsetzen. E1 ist ein Textfeld ohne kurze Zeichenbegrenzung. E2 enthält 20 unabhängige Cloze-Felder, jeweils Lösung `1`, je ein Punkt. Technische Felder und Edulo-Fußleiste werden im Lernmodus durch die gemeinsame Kit-Bridge verborgen.

Genau 20 Aufgabenpunkte: neun Lückentextantworten und elf unabhängig gewertete Diagrammplätze (vier Hauptpfeile, drei Kästen, vier thermische Abzweige). Jede richtige Zuordnung ergibt einen Punkt. Alle 20 E2-Felder sind aktiv. Technische Zuordnung: Text [15,0,1,16,17,19,18,4,5]; Hauptdiagramm 6–12; Abzweige [13,2,14,3]. Das Wort „geschlossen“ ist die neunte Textlücke. Es gibt keine alten Lernstände zu übernehmen; die App verwendet direkt das aktuelle Punkteschema. Unbearbeitet grau; auf Anhieb richtig grün; nach Fehler oder Hilfe ab Stufe 2 gelb. Leere Felder gelten nicht als Fehlversuch. Bereits gelöste Felder sind gesperrt, spätere Hilfe verschlechtert ihre Punkte nicht. Kein globales Zurücksetzen oder Lösungseinsetzen. Entwürfe, Versuche, Hilfen, gelöste Felder, aktive Seite und Simulationsschalter werden ausschließlich über die Bridge gesichert. Standalone speichert die Bridge im Browser unter der eigenen Kennung `dampfmaschine`, unabhängig von `flaschenrakete`.

## Bauen und prüfen

Im Repo-Hauptordner:

```
node Physik/Energie/dampfmaschine/build.cjs
node Physik/Energie/dampfmaschine/test.cjs
node Physik/Energie/dampfmaschine/learning.test.cjs
node Physik/Energie/dampfmaschine/model.test.cjs
node Physik/Energie/dampfmaschine/simulation.test.cjs
```

Quellen: `widget.quelle.html`, `app.js`, `app.css`, `steam-model.js`, `steam-view.js`, `simulation.js`, `simulation.css`, `diagram.js`, `diagram.css`; gemeinsame Bridge unter `tools/edulo/runtime`. Generierte `widget.html` nicht direkt ändern.

Lokaler Prüfstand: Syntax/Build, Edge-Headless 920/1366/390 px, natürliche Höhe ohne inneren Vertikalscroll, volle Hostbreite ohne eigene Seitenüberschrift, zwei gleich breite Navigationsbuttons mit korrekten Teilpunkteständen, Simulation/Transparentmodus/Start-Pause/Legende und Energieflächen, alle 20 aktiven Lernkriterien, Grün bei Hinweis 1 und Gelb ab Hinweis 2/Fehler, Wiederherstellung nach Reload, gleicher Diagramm-DOM beim Stufenwechsel, keine horizontale Dokumentüberbreite. E1/E2, unverändertes Wiederladen aktueller Stände, Feld-/Footer-Verbergen und Schutz ungültiger Daten wurden in einer lokalen Edulo-Hostnachbildung geprüft. Screenshots unter `tests/artifacts`. Zusätzlich 168 gezielte Modellprüfungen: vier Pakete bis zum Sieden, FIFO-Verdrängung, Druckschwelle, Zehnerkapazität, Wiederbefüllen, exakte drei Radumdrehungen, Energieerhaltung, Abkühlung und Migration älterer Stände. Die 3D-Sichtprüfung zeigt Kaltstart, Aufheizen, Sieden, Lauf und Nachlegen bei 920/390 px. Zusätzlich im Browser geprüft: Mausrotation bei Pause, Mausradzoom, echter Zweifinger-Zoom über Browser-Touchereignisse, Detailknöpfe, Kamerarückstellung, Erhalt der Kamera bei Resize/Moduswechsel, geschlossene Seitenwand, Transparenz des gesamten Unterbaus und thermische Kühlpakete mit Ursprung im Kessel statt am Schwungrad.

Noch offen: echter Edulo-Upload mit Wiederöffnen und Test auf einem physischen Tablet. Die lokale Hostnachbildung ersetzt diese Abnahme nicht.

Schüleransicht: Die Legende steht ohne deckenden Hintergrund oben rechts in der 3D-Fläche. Jeder Name lässt sich einzeln ausblenden; dann bleiben nur E und Auge sichtbar. Erläuterungen zum Modell und zur Beispielbilanz sowie der Ablauftext stehen ausschließlich im Popup „Informationen für Lehrkräfte“. Die Mess-/Wärmeanzeigen bleiben sichtbar. Die Popup-Hilfen ersetzen die frühere fachliche Modellnotiz unter dem Lückentext.

Verbesserte Umwandlungsanimation: Während der Verbrennung bleibt das chemische Quadrat am Brennstoff und schrumpft. Gleichzeitig wachsen getrennte thermische Quadrate für die Weitergabe und (bei eingeschalteten Wirkungsgraden) die Wärmeabgabe. Erst nach vollständiger chemischer Umwandlung wandert die nutzbare Wärme in den Kessel; ihre Ankunft fällt mit dem Zugang zum Vierpaket-Wasservorrat zusammen. Am Zylinder schrumpft das thermische Quadrat, während kinetischer Anteil und thermische Abgabe wachsen. Im letzten der drei Radumläufe nimmt das kinetische Quadrat ab und ein thermisches wächst; anschließend driftet die Wärme vom Rad ab. Die Summe der gezeichneten Quadratflächen entspricht jederzeit dem jeweiligen Paketanteil, ohne neue Energie zu erzeugen. Der gespeicherte physikalische Modellzustand und die Lernpunkte werden durch diese Darstellungsverbesserung nicht verändert.

„Automatisch nachlegen“ ist ein gespeicherter Schalter (Standard aus). Bei laufender Zeit wird die Feuerstelle erst dann mit zehn neuen Portionen befüllt, wenn alle bisherigen Brennstoffstücke vollständig verbrannt sind. Der maximal gleichzeitig vorhandene Vorrat bleibt zehn. Pause hält auch automatisches Nachlegen an. Wird der Schalter wieder ausgeschaltet, wird nur der verbleibende Vorrat verbraucht. Die externe Energiezufuhr erscheint vollständig in der Bilanz totalAdded.

Zusätzlicher Browsercheck: `node Physik/Energie/dampfmaschine/conversion.test.cjs` prüft ortsfeste chemische Energie, gleichzeitig wachsende Nutz-/Abgabeanteile, den kontinuierlichen Übergang ins Wasser, die Umwandlung am Zylinder, langsame Radreibung und flächentreue Anteile.

Lückentextfassung: Der Brennstoff-Beispielhinweis steht im ersten Satz. Die Beobachtung „Das Wasser wird heiß“ erhält die erste Lücke. Abschnitt2 erklärt Platzbedarf und Druckanstieg bei unverändertem Kesselvolumen. Abschnitt3 führt den Zyklus Kolbenhub → Auslass offen → Druck sinkt → Rückhub durch Schwungrad → Auslass geschlossen und Dampfzufuhr → Druck steigt vor. Die Druckänderungen während dieses Zyklus sind auf den Zylinder bezogen. Vier Energieformlücken verbinden die Beobachtungen weiterhin mit dem Energieflussdiagramm. Alle neun Lücken besitzen vier gestaffelte Hinweise; Nummern und Hilfetexte folgen ihrer sichtbaren Reihenfolge.

Lückentext-Ergänzung: „Das Schwungrad dreht sich durch den Schwung weiter und schiebt den Kolben zurück. Dadurch ist die Öffnung wieder [geschlossen].“ Für die neue Lücke gelten dieselben vier Hilfestufen und die Gelbgrenze ab Hinweis 2. Keine Änderung an Simulation oder Modellbilanz.
