# Einbettung und sichtbarer Bereich

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

Die Vorlage blendet standardmäßig die Edulo-Fußleiste aus (`hideFooter: false` deaktiviert dies) und berechnet die verfügbare Höhe aus realem Root-Offset und Clipping-Vorfahren. Die frühere feste Obergrenze von 640 px entfällt. Bei extrem kleinem Restbereich muss die Aufgabe höher eingebettet oder der Host gescrollt werden; kein beliebiges CSS kann einen abschneidenden äußeren Host vergrößern. Layoutgrenze ist keine global garantierte Edulo-Spezifikation.

Edulo setzt HTML unter Umständen direkt im Aufgabendokument innerhalb seines iframe ein (inklusive jQuery-Einfügung). Deshalb:

- Root lokal über currentScript.closest oder noch nicht initialisierten Marker wählen; niemals blind das erste gleiche globale ID-Element.
- Alle Fach-Selektoren und CSS unter dem Root. Keine globalen Event-Handler für fremde Felder.
- Keine selbstschließenden SVG-Elemente in HTML-Strings: alte jQuery-Vorfilter können sie verändern. Explizite Endtags verwenden.
- E1/E2 über document/parent/top suchen; Cross-Origin-Zugriffe abfangen. Keine Annahme, dass parent immer der richtige Speicherort ist.
- Mehrere Widgets brauchen verschiedene IDs und getrennte E1/E2-Zuordnung. Zwei Schreibinstanzen auf denselben E1 sind kein unterstützter Standardfall.
- Bei dynamisch eingefügten oder entfernten Roots Listener/Observer abbauen. Globale persistente Events dürfen keinen alten Widgetstand zurückschreiben.

Messwerte sind Nutzerbefund; 1024×668 und 1180×720 stammen aus DynaMot-Lokaltests. Beide Quellen nicht vermischen.
