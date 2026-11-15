# 2014 Toyota Corolla E180 EU (with interior): Herkunft und Anpassungen

- Urheber: [Armored Wave](https://sketchfab.com/armoredwave)
- Original: [2014 Toyota Corolla E180 EU (with interior)](https://sketchfab.com/3d-models/2014-toyota-corolla-e180-eu-with-interior-36f95efb0585464cae43a25a3b3392e8)
- Lizenz: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/), auch in den Metadaten der offiziellen GLB-Datei angegeben.
- Vom Nutzer am 26.10.2026 für das Stroboskop-Widget ausgewählt; offizieller Download der 1K-Fassung nach Nutzeranmeldung.

Die Originaldatei `Toyota-Corolla-original.glb` bleibt unverändert: 18.501.296 Bytes; SHA-256 `a589c3210f64b8ee9805e6657bfff7199272544dd5d4cbf54dbdfc95d5d138ac`. Urheber, Quelle und Lizenz bleiben im Modell und in diesem Nachweis dokumentiert und werden zusätzlich sichtbar im Widget-Fußbereich geführt.

## Aufbereitung für die Darstellung

- Laufzeitdatei: `Toyota-Corolla.glb`. Sämtliche Originaldreiecke, der Innenraum und die Materialwerte bleiben erhalten. Statische Transformationen werden in die Geometrie eingerechnet, sodass die aufbereitete Fassung Y als Höhenachse und −Z als Fahrzeugfront verwendet.
- Die Raddreiecke werden auf vier Gruppen `WheelFL`, `WheelFR`, `WheelRL`, `WheelRR` mit passenden Pivots und lokalen X-Drehachsen verteilt. Die vollständigen geometrischen Räder drehen anschließend in der Simulation.
- Alle 27 Texturen werden auf höchstens 512 Pixel je Kante verkleinert und als WebP mit Qualität 90 gespeichert. Normalmaps bleiben erhalten und werden im Vektorraum verkleinert. Diese Texturänderungen sind nicht verlustfrei.
- Die Darstellung skaliert das Fahrzeug proportional, richtet es am Boden aus und dreht es in positive X-Fahrtrichtung. Beleuchtung und Schatten stammen aus der Widget-Szene.
- `Toyota-Corolla-metadata.json` dokumentiert die aufbereitete Geometrie und Radzuordnung. Sechs Toyota-Geometrietests und der vollständige Browserlauf der Zusatzdateifassung sind bestanden; die gerenderten Autospuren wurden visuell kontrolliert. Die aufbereitete GLB-Datei umfasst 4.519.968 Bytes, als GZIP-Zusatzdatei 3.258.821 Bytes.

Das Paket `edulo-upload-toyota/` enthält `stroboskop-3d-v3.js` und `stroboskop-toyota-v3.bin`. Die BIN-Datei verpackt die aufbereitete GLB-Datei verlustfrei mit GZIP; ihre WebP-Texturen wurden zuvor wie oben beschrieben verändert. Das Modell wird über Edulos eigene Zusatzdateiauflösung geladen. Es werden keine Modelle von Sketchfab oder einem CDN zur Laufzeit nachgeladen.

Die Anpassungen werden unter Beibehaltung des obigen Urhebernachweises und der CC-BY-4.0-Lizenz dokumentiert; sie implizieren keine Unterstützung durch den ursprünglichen Urheber. Die alten Mercedes- und ToyCar-Dateien sind historische Artefakte und gehören nicht zum aktuellen Toyota-Uploadpaket.
