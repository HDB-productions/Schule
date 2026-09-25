# Parameter: nur für diesen Sonderfall lesen

Der Standard braucht **keinen Metadaten-Fetch**. Widget-Konstanten oder URL-Parameter an die Bridge übergeben. URL-Parameter sind nicht dasselbe wie Edulos im Editor eingetragene Modulparameter.

Historische Inspector-Tests Januar/Februar 2026:

- Keine Ersetzung von `{{name}}`, `${name}`, `%%name%%`, `[[name]]`, `%name%` oder `#name#` in HTML/Textareas/Attributen.
- Kein zuverlässig nutzbares globales Parameterobjekt gefunden. Nicht als universelle Aussage über jede Edulo-Version behandeln.
- Aufgabenmetadaten wurden über `loadWidget.php?GUID=…` aus der tatsächlichen `data=`-Information der laufenden URL geladen. **Origin, Pfad oder GUID nicht raten.** URL/Netzwerkdaten der konkreten Einbettung prüfen; kein vorbeugendes Suchen nach Zugangsdaten.
- Üblich: `json.contents[]`, alternativ beobachtet `json.modules[]` / `json.body.contents[]`. Das eigene `html_and_files`-Modul trägt `html`, `parameters: [{name,value}]` und ggf. `files`.
- Eindeutiger Marker `EDULO_WIDGET_KEY:<widget-id>` im HTML identifiziert das Modul. Keine feste Indexnummer und keine pauschale eX-ID. Verschachtelte Inhalte durchlaufen; bei mehreren Treffern abbrechen.
- Doppelte Parameternamen: letzter Wert gewinnt. Historisch wurden literale `\n` teilweise in Zeilenumbrüche übersetzt; im Helfer ausdrücklich wählbar, da blindes Ersetzen JSON/Regex/Pfade beschädigen kann.
- Zusatzdateien kann Edulo selbst laden. Niemals aus Dateinamen willkürlich eine `/widget/DATEI`-URL bauen.

`runtime/parameters.js` ist ein **optionaler reiner Parser**, nicht Teil des Standardbuilds. Erst einen verifizierten JSON-Datensatz über die tatsächlich vorhandene URL holen; danach:

```js
const params = readEduloParameters(json, 'EDULO_WIDGET_KEY:meine-id');
// params.STATE_ID / params.SCORE_PREFIX explizit als Bridge-Option übergeben.
```

Wenn gebraucht, die kleine Funktion gezielt in app.js einfügen oder den Build um ein geprüftes Inline-Modul erweitern. Keine weltweite Netzwerkabhängigkeit und kein API-Schlüssel gehören in eine auslieferbare HTML-Datei. Werte wie worker_base/aspects_json stammen aus einem alten KI-Widget und sind keine Edulo-Standardparameter.
