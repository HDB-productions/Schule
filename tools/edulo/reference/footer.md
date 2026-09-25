# Prüfen / Lösungen / Footer

Der gelesene Edulo-Code bestätigt:

- `check_solution.refreshModule()` erzeugt die Buttons über `widget.add2FooterToolbar`, im beobachteten DOM `#footerButtons`.
- „Überprüfen“ und „Lösungen“ teilen sich `.checkBtn`; nicht pauschal nach Klasse ein einzelnes Verhalten auswählen.
- `widget.JSON.noSolution === "1"` unterdrückt im beobachteten Code den Lösungsbutton. Das belegt den internen Konfigurationswert, nicht eine bestimmte sichtbare Editor-Einstellung.
- Wenn keine unteren Buttons vorhanden sind, setzt Edulo selbst `widget.contentWrapper.css('bottom','0px')`. Nur `display:none` am Footer kann deshalb reservierten Platz übrig lassen.

`runtime/footer.js` wird automatisch mit der Bridge eingebunden und bietet einen reversiblen Layout-Helfer: Footer ausblenden; bei absolut/fix positioniertem Contentwrapper den unteren Abstand auf 0 setzen; vorhandene Scrollpane neu vermessen. Er ändert keine Bewertungsflags, ruft kein Prüfen und kein refreshAll auf. Misst Wrapperhöhe vorher/nachher. Im echten Edulo-Test bestätigt (19.09.2026): Ausblenden → Wiederherstellen → erneut Ausblenden, reproduzierbar. Standard ist `hideFooter: true`; `false` lässt die Fußleiste sichtbar. Zur Laufzeit: `bridge.setFooterHidden(true/false)`.

Falls andere sichtbare Aufgaben die globalen Prüf-/Lösungsbuttons benötigen, `hideFooter: false` einstellen. Im Editor, Prüfungsmodus und fremden Antwortansichten blockiert. Ursprüngliche Sichtbarkeit/Abstände beim Verlassen wiederherstellen. Die Bridge beobachtet spät erzeugte oder ersetzte Footer im eigenen Aufgabendokument und ordnet sie neu zu.

Die Vorlage nutzt die tatsächlich verbleibende Höhe statt des früheren festen 640-px-Budgets. Nach dem Ausblenden der technischen Felder und bei Größenänderungen wird neu gemessen; Root-Offset und Clipping-Grenzen bleiben berücksichtigt.

Einfacher Live-Test: `node tools/edulo/diagnostics/build-footer-test.cjs` erzeugt `diagnostics/footer-test.html`. Komplettes HTML in einer eigenen Testaufgabe einsetzen. Ein Button blendet aus und misst, derselbe stellt wieder her; optional JSON exportieren. Vorhandene E1/E2-Felder werden versteckt, ohne Werte zu schreiben. Ersetzt keine Lern-App in einer produktiv verwendeten Aufgabe.

## Bestätigte Live-Messung

Quelle: [footer-live.json](footer-live.json), Nutzerexport 1f3eab40-defb-4dab-b28a-0202805e23bf.json, 19.09.2026. Gerundete CSS-Pixel:

| Zustand | Inhaltswrapper B × H | Oberkante | unterer Abstand | Footer |
|---|---|---|---|---|
| vorher | 974 × 643 | 40 | 85 | sichtbar, etwa 85 hoch |
| ausgeblendet | 974 × 728 | 40 | 0 | display:none, ohne Fläche |
| wiederhergestellt | 974 × 643 | 40 | 85 | ursprüngliche Maße |
| erneut ausgeblendet | 974 × 728 | 40 | 0 | erneut ohne Fläche |

Viewport unverändert 1024 × 768. Gewinn genau 84,9933 CSS-px, gerundet **85 px bzw. 13,2 % mehr Wrapperhöhe**. Die Messung bestätigt die Layoutänderung und ihre Rücknahme in diesem Edulo-Aufbau. Sie untersucht keine Bewertungs- oder Servervorgänge. 728 px ist die Wrapperhöhe, nicht automatisch die verfügbare Höhe jedes darin versetzten Widgets; das eigene Layout muss die zusätzliche Fläche auch nutzen.
