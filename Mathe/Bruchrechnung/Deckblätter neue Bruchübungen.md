# Deckblätter zu den neuen Bruchübungen

Erstellt mit der integrierten Bildgenerierung, nicht über CLI/API. Alle drei PNGs haben das Seitenverhältnis 4:3. Stilreferenzen: `Cover Brüche verstehen 4zu3.png` und `Cover Anteile berechnen 4zu3.png`. Die bestehenden Bilder bleiben unverändert.

## Dateien und geprüfter Inhalt

- `Cover Brüche kürzen 4zu3.png`: 6/8 = 3/4, Kürzungszahl 2; links acht gleich große Teile mit sechs petrolfarbenen, rechts vier Teile mit drei petrolfarbenen. Beide Ganzen gleich groß. Unten 12/24 = 6/12 = 1/2.
- `Cover Brüche erweitern 4zu3.png`: 1/2 = 3/6, links zwei Hälften, rechts sechs gleich breite Streifen mit drei petrolfarbenen. Beide Ganzen gleich groß. Unten 2/5 = 8/20.
- `Cover Brüche addieren und subtrahieren 4zu3.png`: 1/2 + 1/4 = 3/4 und 3/4 − 1/2 = 1/4. Die beiden 2×2-Modelle zeigen jeweils das Ergebnis: drei bzw. ein petrolfarbenes Viertel.

Titel, HDB, Rechnungen und Anteile wurden visuell geprüft. Kürzen und Erweitern erhielten jeweils eine gezielte Nachbearbeitung der Diagramme: gleiche Größe der Ganzen bzw. exakt sechs gleich breite Streifen.

## Finales Promptset, zusammengeführt

Gemeinsamer Stilprompt:

> Create a matching German mathematics cover in exact landscape 4:3. Use the attached existing covers as style references only. Warm ivory textured paper, tactile dimensional paper-cut fraction pieces, soft shadows, teal and dark petrol palette. Very large bold refined dark petrol serif title centered across the middle. Exact HDB centered near the bottom with a safe margin. Mathematical annotations in distinctly smaller slim casual teacher handwriting; stacked fractions with horizontal bars. Generous safe edges, spacious title band, no unrelated objects, no watermark, flat finished cover rather than a book mockup. German umlauts correct.

Kürzen:

> Exact title: Brüche kürzen. Top: handwritten stacked equation 6/8 = 3/4 with small :2 below the equals sign. Two rectangular models of exactly identical outer width and height, aligned top and bottom. Left: exactly 2 rows by 4 columns, first three columns teal and last column ivory. Right: exactly four equal vertical columns, three teal and one ivory. Both represent the same whole and three quarters colored. Bottom: slightly tilted cream sticky note with handwritten stacked fractions 12/24 = 6/12 = 1/2. Preserve the title and HDB unobstructed.

Erweitern:

> Exact title: Brüche erweitern. Top: handwritten stacked equation 1/2 = 3/6 and two rectangular fraction models of exactly identical outer dimensions, aligned tops and bottoms. Left: two equal vertical halves, one teal and one ivory. Right: exactly six identical-width vertical strips, first three teal, last three ivory, exactly five internal boundaries. The teal/ivory boundary must be exactly at the center. No narrow extra sliver or decorative bevel that looks like another division. Bottom: cream sticky note with handwritten stacked fractions 2/5 = 8/20. Preserve warm tactile paper and soft outer shadows.

Addieren/Subtrahieren:

> Main title on two centered lines: Brüche addieren / und subtrahieren. Above title: slightly tilted cream note with slim handwritten stacked-fraction equation 1/2 + 1/4 = 3/4. To its right one square divided into exactly 2×2 equal cells, three teal and one ivory. Below title: another cream note with 3/4 − 1/2 = 1/4. To its right another identical-size 2×2 square, one teal and three ivory. The squares illustrate the respective results. No other text, numbers, icons or objects beyond the title, equations and HDB.

## Code zum Kopieren

In jedem App-Ordner liegt zusätzlich `Edulo-Code.txt`. Diese Datei enthält exakt den vollständigen Inhalt der jeweiligen `widget.html`. Der gemeinsame Build aktualisiert beide Dateien gleichzeitig; die TXT-Datei dient zum direkten Markieren und Kopieren nach Edulos „HTML und Dateien“.
