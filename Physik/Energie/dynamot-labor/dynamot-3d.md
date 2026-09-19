# DynaMot 3D

`dynamot-3d-vorschau.html` über einen lokalen Webserver öffnen (ES-Module funktionieren nicht zuverlässig über `file://`). Alle Laufzeitabhängigkeiten liegen lokal; kein CDN erforderlich. Bestehendes SVG bleibt unverändert.

```js
import { createDynamotView } from './dynamot-3d.js';
const view = createDynamotView(element, {
  controls: false, // eigene Kurbelbedienung des Labors
  onCrankChange: radians => { /* nur manuelle Bedienung des eingebauten Reglers */ }
});
view.setAccessory('crank'); // 'none' (Standard), 'crank', 'pulley'
view.setCrankAngle(Math.PI / 2); // setzt Winkel ohne Callback
view.setWeightHeight(-2); // Gewichtsmittelpunkt, lokale Y-Koordinate
// Bei Entfernen:
view.dispose();
```

Der Container benötigt eine Breite und Höhe. ResizeObserver aktualisiert die Ansicht automatisch. `resetView()`, `zoom(factor)` und `resize()` sind ebenfalls verfügbar. `setCrankAttached(bool)` und `setWeightAttached(bool)` sind Kurzformen für den Zubehörwechsel. Ausschalten setzt auf `none`. Kurbel und Schnurrolle befinden sich am selben Anschluss und sind gegenseitig ausgeschlossen.

Mehrere Modelle können unabhängig instanziiert werden. Für große Baukästen `createDynamotModel()` verwenden und die zurückgegebene `group` einer gemeinsamen Three.js-Scene hinzufügen, statt viele WebGL-Kontexte anzulegen. Das Ergebnis enthält `parts`, die Modellsetter, `getCrankAngle()`, `getAccessory()` und `dispose()`. Die View stellt das Modell als `view.model` bereit.

Z ist die Geräteachse; Zubehör sitzt an +Z. `setCrankAngle` erwartet endliche Winkel in Radiant, auch über mehrere Umdrehungen. Gehäuse, Motorhülle und Stativstab bleiben fest. Die inneren Scheiben sind schematisch mit Drehzahlfaktor 1 bzw. 30. Die genaue Zahnfolge und innere Drehrichtung sind nicht rekonstruiert. Die Gewichtshöhe wird auf -3.5 bis -0.55 begrenzt; sie muss die Labor-Simulation vorgeben. Die Vorschau demonstriert nur eine begrenzte lineare Aufwicklung, keine Kraft- oder Energiesimulation.

OrbitControls: ein Finger/Linksklick dreht die Kamera, zwei Finger/Mausrad zoomen. Kurbelbedienung liegt getrennt außerhalb der 3D-Fläche. Touch-Gesten basieren auf OrbitControls; die Prüfung erfolgte mit Desktop-Pointer und schmalem Viewport, nicht auf einem physischen Smartphone.

Referenzen: Cornelsen DynaMot 54850, offizielle Bilder [Kurbelseite](https://en.cornelsen-experimenta.de/media/do/renderImage/57176/D/57176?no_sess=true) und [Gehäuse](https://en.cornelsen-experimenta.de/media/do/renderImage/57173/D/57173?no_sess=true). Ergänzt durch die eigenen Fotos `IMG_2154.jpeg` (Seite), `IMG_2155.jpeg` (DynaMot und Lampe), `IMG_2156.jpeg` (Lampenfassung) und `IMG_2157.jpeg` (zwei DynaMots). Daraus übernommen: blanker silberner Motor, innere Montageplatte, gerader Stativstab und Tischklemme. `parts.clamp` gehört zur festen Gruppe. Proportionen und Klemmengeometrie sind stilisiert. Zubehör Spule/Gewicht ist weiterhin schematisch, da die vier Bilder es nicht zeigen.

Abhängigkeit: Three.js 0.180.0 (MIT), einschließlich OrbitControls. Dateien aus dem npm-Paket über jsDelivr, Lizenz unter `dynamot-3d-vendor/LICENSE`. Einzige Anpassung der Herstellerdateien: OrbitControls importiert `./three.module.js` statt `three`.

Geprüft: echtes Orbitieren zur Rückseite, manuelle Kurbelrotation, Abspielen/Pause und Richtungswechsel, exklusiver Zubehörwechsel, schmale Ansicht ohne horizontalen Überlauf und ohne Browserfehler. Modellprüfung mit zwei Instanzen: Standard ohne Zubehör, unabhängige Winkel, Übersetzung 30:1, feststehende Gruppe und Freigabe der Ressourcen.
