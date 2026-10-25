# Einbettung und sichtbarer Bereich

## Verbindlicher Layoutstandard

Edulo setzt den Seitentitel. Widgets erhalten nie eine zusätzliche eigene Seitenüberschrift; der Generatorparameter `<Titel>` dient ausschließlich als Dokumenttitel/Metadatum. Aufgabenüberschriften und die fachliche Gliederung eines Lückentextes bleiben zulässig, wenn sie konkrete Inhalte benennen.

Der Widget-Root nutzt `width: 100%` ohne künstliche maximale Seitenbreite und wächst mit seinem Inhalt. Keine festen Höhen, `vh`-Höhen, Berechnung einer verfügbaren Viewport-Resthöhe oder zusätzlichen vertikalen Scrollcontainer einbauen: Edulo scrollt die Gesamtseite. Auch lange Aufgaben und aufgeklappte Hilfen bleiben im normalen Seitenfluss. Unvermeidbar breite Inhalte, etwa ein Diagramm, dürfen bei Bedarf einen lokalen horizontalen Scrollbereich erhalten.

Die Vorlage setzt diesen Standard um und blendet weiterhin standardmäßig die Edulo-Fußleiste aus (`hideFooter: false` deaktiviert dies). Die frühere Vorgabe mit 920 px Widgetbreite, berechneter Resthöhe und internem vertikalem Scrollen ist hiermit ersetzt. Bestehende Widgets nicht ohne konkreten Änderungsauftrag global migrieren.

## Historische Messungen als Kontext

Die folgenden Befunde dokumentieren eine damalige Einbettung und sind keine Zielmaße oder Höhenvorgaben für neue Widgets.

Vom Nutzer gemessener realer Größentest (CSS-Pixel, Zoom 1):

| Ebene | Layout / dargestellt | overflow-y |
|---|---|---|
| iframe window.inner / client / visual viewport | jeweils 1024 × 768 | – |
| Widgetbreite im Layout | 920 | – |
| damaliges div#e1 (HTML-Modul dieses Größentests!) | 924 × 519 | visible |
| div#content | 984 × 539 | visible |
| umgebendes div | 974 × 728 | visible |
| weiteres div | 974 × 728 | hidden |
| div#contentWrapper | 974 × 728 | hidden |
| div#contentWrapperOuter | 974 × 768 | visible |
| body / html | jeweils 1024 × 768 | visible |

**e1 bezeichnet hier die damalige Modulposition, nicht zwingend das E1-Speicherfeld des neuen Standards.** Die 519/539-Pixel-Höhen hängen vom damaligen Inhalt ab. Window-Höhe ist nicht automatisch nutzbare Widgethöhe. Der obere Versatz des Widgets und abschneidende Vorfahren reduzieren sie.

**Ergänzender Footer-Livetest:** Im gleichen 1024×768-Viewport ist der Inhaltswrapper bei sichtbarer Fußleiste etwa **974 × 643 px**, nach Ausblenden und Freigabe des unteren Abstands **974 × 728 px**. Die Oberkante bleibt bei 40 px; rund **85 px** kommen hinzu. Wiederherstellen und erneutes Ausblenden reproduzieren diese Maße. Der frühere Größentest allein dokumentierte die Footer-Sichtbarkeit nicht. Details und Messbericht: `footer.md` / `footer-live.json`.

Die damalige Vorlage berechnete die verfügbare Höhe aus Root-Offset und Clipping-Vorfahren; davor bestand eine feste Obergrenze von 640 px. Beide Höhenverfahren gehören nicht mehr zum aktuellen Standard. Falls ein konkreter Host Inhalt abschneidet, muss dessen Einbettung beziehungsweise Seitenscrollen geprüft werden; keine zusätzliche feste Widgethöhe oder innere vertikale Scrollfläche als Standard einführen. Die Messwerte sind keine global garantierte Edulo-Spezifikation.

## Einbettung und Isolation

Edulo setzt HTML unter Umständen direkt im Aufgabendokument innerhalb seines iframe ein (inklusive jQuery-Einfügung). Deshalb:

- Root lokal über currentScript.closest oder noch nicht initialisierten Marker wählen; niemals blind das erste gleiche globale ID-Element.
- Alle Fach-Selektoren und CSS unter dem Root. Keine globalen Event-Handler für fremde Felder.
- Keine selbstschließenden SVG-Elemente in HTML-Strings: alte jQuery-Vorfilter können sie verändern. Explizite Endtags verwenden.
- E1/E2 über document/parent/top suchen; Cross-Origin-Zugriffe abfangen. Keine Annahme, dass parent immer der richtige Speicherort ist.
- Mehrere Widgets brauchen verschiedene IDs und getrennte E1/E2-Zuordnung. Zwei Schreibinstanzen auf denselben E1 sind kein unterstützter Standardfall.
- Bei dynamisch eingefügten oder entfernten Roots Listener/Observer abbauen. Globale persistente Events dürfen keinen alten Widgetstand zurückschreiben.

Messwerte sind Nutzerbefund; 1024×668 und 1180×720 stammen aus DynaMot-Lokaltests. Beide Quellen nicht vermischen.
