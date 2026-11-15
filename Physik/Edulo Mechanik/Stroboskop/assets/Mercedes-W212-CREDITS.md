# Mercedes E Class W212: Herkunft und Anpassungen

- Urheber: [Peter_D (Sketchfab: better_peter)](https://sketchfab.com/better_peter)
- Original: [Mercedes E Class W212](https://sketchfab.com/3d-models/mercedes-e-class-w212-119c5e10733142b197aa53b86f6aeb04)
- Lizenz: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/), bestätigt durch die Metadaten der offiziellen GLB-Datei.
- Vom Nutzer am 26.10.2026 für das Stroboskop-Widget ausgewählt.

Die Modelldatei wurde nach der Nutzeranmeldung über den offiziellen Download bezogen. Die unveränderte Originaldatei liegt als `Mercedes-W212-original.glb` vor (37.334.564 Bytes; SHA-256 `8ed00a65ea18726c512ab2b24c9149fb497bc8ff176f418a341c1d7f1b2fad0e`). Die bereitgestellten Autor-, Quellen- und Lizenzangaben bleiben in den Modellmetadaten erhalten. Der Urhebernachweis samt Quellen- und Lizenzlink wird zusätzlich sichtbar im Widget-Fußbereich geführt.

## Anpassungen für die Darstellung

- `Mercedes-W212.glb`: Texturen verlustfrei nach WebP optimiert; Originalgeometrie unverändert. Texturen, Alpha- und Normalmaps bleiben erhalten.
- Die bereits vorhandenen Radgruppen `WheelFL`, `WheelFR`, `WheelRL` und `WheelRR` werden direkt verwendet. Keine ToyCar-Dreieckspartition ist aktiv. Der Rollradius beträgt vor proportionaler Skalierung etwa 0,3293208 Modelleinheiten; die ursprünglichen Gruppenpivots bleiben erhalten.
- Die glTF-Wurzel bringt bereits eine X-Rotation von −π/2 mit. Die zusätzliche Szenenausrichtung um Y von −π/2 richtet die positive ursprüngliche Fahrzeuglängsachse in die positive X-Fahrtrichtung aus. Das Modell wird proportional skaliert und am Bodenminimum Y ≈ +0,00006949 ausgerichtet; die ursprüngliche Body-Verschiebung wird berücksichtigt.
- Silberner Lack, Glas und Chrom bleiben erhalten. Für Linsen mit positiver Materialtransmission wird diese zur Laufzeit auf null gesetzt: Die transparenten Belichtungsbilder besitzen keinen opaken Brechungshintergrund. Die vorhandenen Farb-, Alpha- und Normaltexturen werden dabei beibehalten.
- `Mercedes-W212-metadata.json` dokumentiert vollständig transformierte Grenzen, Radhierarchien, Pivots, Achsen und Radien. Die sechs Geometrie-/Metadatenprüfungen des Originals sind bestanden; die neue integrierte Browserdarstellung ist noch zu prüfen.

Modell und Texturen werden in das Offline-HTML eingebettet. Es werden keine Modelldateien von Sketchfab oder einem CDN zur Laufzeit nachgeladen. Diese Anpassungen stehen unter Beibehaltung des obigen Urhebernachweises und der CC-BY-4.0-Lizenz; sie implizieren keine Unterstützung durch den ursprünglichen Urheber.

Integration abgeschlossen und lokal geprüft. Die HTML-Nutzlast wird zusätzlich verlustfrei mit GZIP gepackt. Der gemessene `radiusWorld` von etwa 0,329320817 wird gemeinsam mit dem einheitlichen Modellmaßstab für den Abrollwinkel verwendet. Die vier originalen Radgruppen drehen um ihre lokale X-Achse; durch die Ausrichtung auf die positive Welt-X-Richtung hat der Drehwinkel ein negatives Vorzeichen.
