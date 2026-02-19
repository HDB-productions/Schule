# EigeneTastatur - Dokumentation

Diese Datei beschreibt, wie `EigeneTastatur` in bestehende Projekte integriert wird.
Fokus: schnelle Einbindung, stabile Konfiguration, Blockmodus, Formeln, Troubleshooting.

## 1) Was das Modul macht

`EigeneTastatur` rendert Buttons auf einem festen Raster (Grid) in einen Container.
Jeder Button bekommt:

- eine Ankerposition (`AnkerX`, `AnkerY`)
- eine Rastergroesse (`Breite`, `Hoehe`)
- optional Styles (Farben, Schrift, Hover)
- optional Formelrendering (KaTeX/MathJax)

Zusatzfunktion: Mit `Typ: "Block"` koennen viele gleichartige Buttons kompakt definiert werden.

## 2) Funktion und Parameter

```js
EigeneTastatur(buttonList, containerId, buttonFunction, buttonSize, rand, eckenRadius)
```

- `buttonList` (`Array`): Liste aus Einzelbuttons und/oder Blockdefinitionen
- `containerId` (`string | HTMLElement`): Zielcontainer
- `buttonFunction` (`function`): Callback bei Klick
- `buttonSize` (`number`, optional, default `50`): Rastergroesse in Pixeln
- `rand` (`number`, optional, default `0`): Innenabstand je Seite in Pixeln
- `eckenRadius` (`number`, optional, default `0`): `border-radius` in Pixeln

Callback-Signatur:

```js
function buttonFunction(action, originalEntry, event, buttonElement) { ... }
```

Abwaertskompatibel: ein Callback mit nur einem Parameter (`action`) funktioniert weiterhin.

## 3) Minimale Integration in ein bestehendes HTML-Projekt

```html
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="eigeneTastatur.js"></script>
</head>
<body>
  <div id="tableContainer"></div>

  <script>
    const buttonList = [
      { AnkerX: 1, AnkerY: 1, Beschriftung: "1", Funktion: "1", Breite: 1, Hoehe: 1 },
      { AnkerX: 2, AnkerY: 1, Beschriftung: "2", Funktion: "2", Breite: 1, Hoehe: 1 }
    ];

    function onKey(action) {
      console.log("geklickt:", action);
    }

    EigeneTastatur(buttonList, "tableContainer", onKey, 40, 2, 6);
  </script>
</body>
</html>
```

## 4) Einzelbutton - Felder

### Pflichtfelder (praktisch)

- `AnkerX`, `AnkerY` (beide benoetigt)
- `Beschriftung`
- `Funktion` (optional, fallback ist `Beschriftung`)

### Groesse / Position

- `Breite` (default `1`)
- `Hoehe` (default `1`), alternativ `height`
- optional auch `Anker: [x, y]` oder `Anker: { x, y }`

### Style pro Button

- `Hintergrundfarbe`
- `HoverFarbe`
- `Schriftfarbe`
- `Schriftgroesse` (z. B. `18` oder `"1.1rem"`)
- `Style` (zus. CSS-Objekt, z. B. `{ fontWeight: "700" }`)

### Formelsteuerung pro Button

- `Formel: true` -> immer Formelrenderer
- `Formel: false` -> reiner Text
- weggelassen -> Auto-Erkennung (`\`, `_`, `^`, `{}`)

## 5) Blockmodus fuer grosse Gruppen

Ein Block wird erkannt durch:

- `Typ: "Block"` (oder `"gruppe"`, `"group"`)
- oder durch eine `Buttons`-Liste

Beispiel:

```js
const buttonList = [
  {
    Typ: "Block",
    AnkerX: 2,
    AnkerY: 1,
    AnzahlProReihe: 3,
    Breite: 2,
    Hoehe: 1,
    Hintergrundfarbe: "#1f2937",
    HoverFarbe: "#374151",
    Schriftfarbe: "#fff",
    Schriftgroesse: 18,
    Buttons: [
      { Beschriftung: "0", Funktion: "digit-0" },
      { Beschriftung: "1", Funktion: "digit-1" },
      { Beschriftung: "2", Funktion: "digit-2" },
      { Beschriftung: "3", Funktion: "digit-3" }
    ]
  }
];
```

Regeln:

- Slots werden von links nach rechts, dann oben nach unten gefuellt.
- `SchrittX`/`SchrittY` optional; default ist `Breite`/`Hoehe`.
- Item-Werte in `Buttons` ueberschreiben Block-Defaults.
- Primitive Eintraege (z. B. `"7"`) sind erlaubt und werden zu:
  - `Beschriftung: "7"`
  - `Funktion: "7"`

## 6) Formeln korrekt rendern (wichtig)

Das Modul rendert Formeln so:

1. Wenn KaTeX global geladen ist -> KaTeX
2. sonst -> MathJax (`typesetPromise`)
3. wenn nichts vorhanden -> LaTeX-Text bleibt sichtbar + `console.warn`

### Empfohlene MathJax-Einbindung

```html
<script>
  window.MathJax = {
    tex: { inlineMath: [["\\(", "\\)"]] },
    svg: { fontCache: "global" }
  };
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<script src="eigeneTastatur.js"></script>
```

Beispiele fuer Labels:

- `\\mathbb{Z}`
- `\\int_0^1 x^2 dx`
- `\\frac{1}{2}`
- `\\sqrt{a_1}`

Hinweis: Bei Unsicherheit `Formel: true` setzen.

## 7) Integration in bestehende App-Architektur

### Event-Weitergabe an bestehende Logik

```js
function onKey(action, originalEntry, event, buttonEl) {
  app.dispatch({ type: "keyboard.input", payload: action });
}
```

### Re-Render bei State-Aenderung

`EigeneTastatur(...)` kann mehrfach aufgerufen werden.
Der Container wird intern mit `replaceChildren(...)` neu aufgebaut.

### In Formularen

Buttons werden als `type="button"` gesetzt, damit kein ungewolltes Submit passiert.

## 8) Haeufige Fehler und Loesungen

### Fehler: "braucht einen vollstaendigen Anker mit X und Y"

Mindestens einer der Werte fehlt.
Loesung: `AnkerX` und `AnkerY` setzen (oder `Anker: [x, y]`).

### Fehler: "Rand ... zu gross"

`rand` ist groesser als die halbe Buttonflaeche.
Loesung: `rand` kleiner waehlen oder `buttonSize/Breite/Hoehe` vergroessern.

### Block wird nicht erzeugt

Pruefen:

- `Buttons` ist ein nicht-leeres Array
- `AnkerX`, `AnkerY`, `AnzahlProReihe` sind gueltig (> 0)

### Formel bleibt als Text sichtbar

MathJax/KaTeX ist nicht geladen oder noch nicht verfuegbar.
Loesung: Script-Einbindung pruefen, Browser-Konsole pruefen.

## 9) Kompakte Checkliste fuer neue Projekte

1. `eigeneTastatur.js` einbinden
2. Container setzen (`id` oder HTMLElement)
3. `buttonList` definieren (Einzelbuttons oder Bloecke)
4. Callback anbinden (`buttonFunction`)
5. Optional: MathJax/KaTeX einbinden fuer echte Formeln
6. Mit `buttonSize`, `rand`, `eckenRadius` Feintuning machen
