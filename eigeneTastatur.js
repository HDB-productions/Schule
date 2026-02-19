// Dokumentation: siehe eigeneTastatur.md
function EigeneTastatur(buttonList, containerId, buttonFunction, buttonSize, rand, eckenRadius) {
    if (!Array.isArray(buttonList)) {
        throw new TypeError("EigeneTastatur: buttonList muss ein Array sein.");
    }
    if (typeof buttonFunction !== "function") {
        throw new TypeError("EigeneTastatur: buttonFunction muss eine Funktion sein.");
    }

    var gridSize = toPositiveInt(buttonSize, 50);
    var buttonMargin = toNonNegativeInt(rand, 0);
    var cornerRadius = toNonNegativeNumber(eckenRadius, 0);
    var container = resolveContainer(containerId);
    var expandedButtonList = expandButtonDefinitions(buttonList);
    var entries = normalizeEntries(expandedButtonList);
    var bounds = calculateBounds(entries);
    var stage = createStage(gridSize, bounds);
    var mathTargets = [];

    detectOverlaps(entries);

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var button = document.createElement("button");
        var left = (entry.x - 1) * gridSize + buttonMargin;
        var top = (entry.y - 1) * gridSize + buttonMargin;
        var width = entry.width * gridSize - buttonMargin * 2;
        var height = entry.height * gridSize - buttonMargin * 2;

        if (width <= 0 || height <= 0) {
            throw new Error(
                "EigeneTastatur: Rand (" +
                buttonMargin +
                "px) ist fuer Button an Index " +
                entry.order +
                " zu gross."
            );
        }

        button.type = "button";
        button.dataset.funktion = String(entry.action);
        button.dataset.gridX = String(entry.x);
        button.dataset.gridY = String(entry.y);
        button.style.position = "absolute";
        button.style.left = left + "px";
        button.style.top = top + "px";
        button.style.width = width + "px";
        button.style.height = height + "px";
        button.style.margin = "0";
        button.style.boxSizing = "border-box";
        button.style.borderRadius = cornerRadius + "px";
        button.style.zIndex = String(i + 1);

        applyButtonStyleOptions(button, entry);
        applyButtonLabel(button, entry.label, entry.mathOption, mathTargets);
        button.addEventListener("click", createClickHandler(buttonFunction, entry, button));
        stage.appendChild(button);
    }

    container.replaceChildren(stage);
    typesetMath(mathTargets);
}

function createStage(gridSize, bounds) {
    var stage = document.createElement("div");
    stage.className = "eigene-tastatur";
    stage.style.position = "relative";
    stage.style.width = Math.max(bounds.maxX, 1) * gridSize + "px";
    stage.style.height = Math.max(bounds.maxY, 1) * gridSize + "px";
    stage.style.display = "block";
    stage.style.boxSizing = "content-box";
    return stage;
}

function createClickHandler(buttonFunction, entry, button) {
    return function (event) {
        buttonFunction(entry.action, entry.original, event, button);
    };
}

function applyButtonStyleOptions(button, entry) {
    if (entry.backgroundColor) {
        button.style.backgroundColor = entry.backgroundColor;
    }
    if (entry.textColor) {
        button.style.color = entry.textColor;
    }
    if (entry.fontSize) {
        button.style.fontSize = entry.fontSize;
    }

    applyCustomStyleObject(button, entry.customStyle);

    if (entry.hoverColor) {
        var normalColor = button.style.backgroundColor;
        button.addEventListener("mouseenter", function () {
            button.style.backgroundColor = entry.hoverColor;
        });
        button.addEventListener("mouseleave", function () {
            button.style.backgroundColor = normalColor;
        });
        button.addEventListener("blur", function () {
            button.style.backgroundColor = normalColor;
        });
    }
}

function applyCustomStyleObject(button, customStyle) {
    if (!customStyle || typeof customStyle !== "object" || Array.isArray(customStyle)) {
        return;
    }

    for (var key in customStyle) {
        if (!Object.prototype.hasOwnProperty.call(customStyle, key)) {
            continue;
        }

        if (key in button.style) {
            button.style[key] = String(customStyle[key]);
        }
    }
}

function applyButtonLabel(button, label, mathOption, mathTargets) {
    var text = String(label || "");
    var shouldRenderMath = shouldUseMathRendering(text, mathOption);

    if (!shouldRenderMath) {
        button.textContent = text;
        return;
    }

    if (typeof window !== "undefined" && window.katex && typeof window.katex.render === "function") {
        try {
            var katexNode = document.createElement("span");
            window.katex.render(text, katexNode, {
                throwOnError: false,
                displayMode: false
            });
            button.replaceChildren(katexNode);
            return;
        } catch (error) {
            console.warn("EigeneTastatur: KaTeX konnte Formel nicht rendern.", error, text);
        }
    }

    var mathNode = document.createElement("span");
    mathNode.className = "eigene-tastatur-math";
    mathNode.textContent = "\\(" + text + "\\)";
    button.replaceChildren(mathNode);
    mathTargets.push(button);
}

function shouldUseMathRendering(labelText, mathOption) {
    if (mathOption === true) {
        return true;
    }
    if (mathOption === false) {
        return false;
    }

    // Auto-Modus: Latex-typische Tokens erkannt.
    return /\\[A-Za-z]+|[_^{}]/.test(labelText);
}

function typesetMath(targets) {
    if (!targets || targets.length === 0 || typeof window === "undefined") {
        return;
    }

    tryMathJaxTypeset(targets, 20);
}

function tryMathJaxTypeset(targets, retriesLeft) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise(targets).catch(function (error) {
            console.warn("EigeneTastatur: MathJax-Rendering fehlgeschlagen.", error);
        });
        return;
    }

    if (retriesLeft <= 0) {
        console.warn(
            "EigeneTastatur: MathJax nicht gefunden. Formeln werden als roher LaTeX-Text angezeigt."
        );
        return;
    }

    window.setTimeout(function () {
        tryMathJaxTypeset(targets, retriesLeft - 1);
    }, 100);
}

function expandButtonDefinitions(buttonList) {
    var expanded = [];

    for (var i = 0; i < buttonList.length; i++) {
        var source = buttonList[i];

        if (isBlockDefinition(source)) {
            var blockButtons = expandBlockDefinition(source, i);
            for (var j = 0; j < blockButtons.length; j++) {
                expanded.push(blockButtons[j]);
            }
            continue;
        }

        expanded.push(source);
    }

    return expanded;
}

function isBlockDefinition(source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
        return false;
    }

    var type = readFirst(source, ["Typ", "typ", "Type", "type", "Art", "art"]);
    if (typeof type !== "undefined" && type !== null) {
        var normalizedType = String(type).trim().toLowerCase();
        if (normalizedType === "block" || normalizedType === "gruppe" || normalizedType === "group") {
            return true;
        }
    }

    var items = readFirst(source, ["Buttons", "buttons", "Eintraege", "eintraege", "Entries", "entries", "Items", "items"]);
    return Array.isArray(items);
}

function expandBlockDefinition(block, blockIndex) {
    var items = readFirst(block, ["Buttons", "buttons", "Eintraege", "eintraege", "Entries", "entries", "Items", "items"]);
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("EigeneTastatur: Block an Index " + blockIndex + " braucht eine nicht-leere Buttons-Liste.");
    }

    var startX = toPositiveInt(
        readFirst(block, ["AnkerX", "ankerX", "x", "X", "Spalte", "spalte", "column", "col"]),
        null
    );
    var startY = toPositiveInt(
        readFirst(block, ["AnkerY", "ankerY", "y", "Y", "Zeile", "zeile", "row"]),
        null
    );
    var perRow = toPositiveInt(
        readFirst(
            block,
            [
                "AnzahlProReihe",
                "anzahlProReihe",
                "Anzahl pro reihe",
                "Anzahl pro Reihe",
                "anzahl pro reihe",
                "anzahl pro Reihe",
                "AnzahlProZeile",
                "anzahlProZeile",
                "ProReihe",
                "proReihe",
                "Columns",
                "columns",
                "Spalten",
                "spalten"
            ]
        ),
        null
    );
    var baseWidth = toPositiveInt(readFirst(block, ["Breite", "breite", "width", "colSpan"]), 1);
    var baseHeight = toPositiveInt(
        readFirst(block, ["H\u00f6he", "Hoehe", "h\u00f6he", "hoehe", "height", "rowSpan"]),
        1
    );
    var stepX = toPositiveInt(
        readFirst(block, ["SchrittX", "schrittX", "stepX", "StepX", "AbstandX", "abstandX"]),
        baseWidth
    );
    var stepY = toPositiveInt(
        readFirst(block, ["SchrittY", "schrittY", "stepY", "StepY", "AbstandY", "abstandY"]),
        baseHeight
    );

    if (!startX || !startY) {
        throw new Error("EigeneTastatur: Block an Index " + blockIndex + " braucht AnkerX und AnkerY.");
    }
    if (!perRow) {
        throw new Error("EigeneTastatur: Block an Index " + blockIndex + " braucht AnzahlProReihe > 0.");
    }

    var defaults = buildBlockDefaults(block);
    var expanded = [];

    for (var i = 0; i < items.length; i++) {
        var rawItem = normalizeBlockItem(items[i], blockIndex, i);
        var merged = mergeObjects(defaults, rawItem);
        var colIndex = i % perRow;
        var rowIndex = Math.floor(i / perRow);
        var defaultX = startX + colIndex * stepX;
        var defaultY = startY + rowIndex * stepY;
        var anchor = parseAnchor(readFirst(merged, ["Anker", "anker", "anchor", "position"]));
        var itemX = readFirst(merged, ["AnkerX", "ankerX", "x", "X", "Spalte", "spalte", "column", "col"]);
        var itemY = readFirst(merged, ["AnkerY", "ankerY", "y", "Y", "Zeile", "zeile", "row"]);

        if (!anchor) {
            if (isMissingValue(itemX)) {
                merged.AnkerX = defaultX;
            }
            if (isMissingValue(itemY)) {
                merged.AnkerY = defaultY;
            }
        }

        expanded.push(merged);
    }

    return expanded;
}

function buildBlockDefaults(block) {
    var defaults = {};

    for (var key in block) {
        if (!Object.prototype.hasOwnProperty.call(block, key)) {
            continue;
        }
        if (isBlockControlKey(key)) {
            continue;
        }
        defaults[key] = block[key];
    }

    return defaults;
}

function isBlockControlKey(key) {
    var normalized = String(key || "").toLowerCase().replace(/[\s_\-]/g, "");

    return (
        normalized === "typ" ||
        normalized === "type" ||
        normalized === "art" ||
        normalized === "buttons" ||
        normalized === "items" ||
        normalized === "entries" ||
        normalized === "eintraege" ||
        normalized === "anzahlproreihe" ||
        normalized === "anzahlprozeile" ||
        normalized === "proreihe" ||
        normalized === "columns" ||
        normalized === "spalten" ||
        normalized === "schrittx" ||
        normalized === "schritty" ||
        normalized === "stepx" ||
        normalized === "stepy" ||
        normalized === "anker" ||
        normalized === "anchor" ||
        normalized === "position" ||
        normalized === "ankerx" ||
        normalized === "ankery" ||
        normalized === "col" ||
        normalized === "x" ||
        normalized === "y" ||
        normalized === "zeile" ||
        normalized === "row" ||
        normalized === "spalte" ||
        normalized === "column"
    );
}

function normalizeBlockItem(item, blockIndex, itemIndex) {
    if (item === null || typeof item === "undefined") {
        throw new Error(
            "EigeneTastatur: Block an Index " +
            blockIndex +
            " hat einen leeren Eintrag bei Buttons[" +
            itemIndex +
            "]."
        );
    }

    if (typeof item === "object" && !Array.isArray(item)) {
        return item;
    }

    // Primitive Eintraege werden als Label/Funktionswert interpretiert.
    var text = String(item);
    return {
        Beschriftung: text,
        Funktion: text
    };
}

function mergeObjects(base, override) {
    var merged = {};
    var key;

    if (base && typeof base === "object") {
        for (key in base) {
            if (Object.prototype.hasOwnProperty.call(base, key)) {
                merged[key] = base[key];
            }
        }
    }

    if (override && typeof override === "object") {
        for (key in override) {
            if (Object.prototype.hasOwnProperty.call(override, key)) {
                merged[key] = override[key];
            }
        }
    }

    return merged;
}

function isMissingValue(value) {
    return value === null || typeof value === "undefined" || value === "";
}

function normalizeEntries(buttonList) {
    var raw = [];

    for (var i = 0; i < buttonList.length; i++) {
        var source = buttonList[i];

        if (!source || typeof source !== "object") {
            console.warn("EigeneTastatur: ungueltiger Eintrag wurde uebersprungen.", source);
            continue;
        }

        var anchor = parseAnchor(readFirst(source, ["Anker", "anker", "anchor", "position"]));
        var width = toPositiveInt(readFirst(source, ["Breite", "breite", "width", "colSpan"]), 1);
        var height = toPositiveInt(
            readFirst(source, ["H\u00f6he", "Hoehe", "h\u00f6he", "hoehe", "height", "rowSpan"]),
            1
        );
        var label = String(readFirst(source, ["Beschriftung", "beschriftung", "label", "Label"]) || "");
        var action = readFirst(source, ["Funktion", "funktion", "value", "action"]);
        var xCandidate = toPositiveInt(
            readFirst(source, ["AnkerX", "ankerX", "x", "X", "Spalte", "spalte", "column", "col"]),
            null
        );
        var yCandidate = toPositiveInt(
            readFirst(source, ["AnkerY", "ankerY", "y", "Y", "Zeile", "zeile", "row"]),
            null
        );
        var backgroundColor = normalizeCssText(
            readFirst(source, ["Hintergrundfarbe", "hintergrundfarbe", "backgroundColor", "background", "bgColor"])
        );
        var hoverColor = normalizeCssText(
            readFirst(source, ["HoverFarbe", "hoverFarbe", "Hoverfarbe", "hoverfarbe", "hoverColor", "hover"])
        );
        var textColor = normalizeCssText(
            readFirst(source, ["Schriftfarbe", "schriftfarbe", "Textfarbe", "textfarbe", "color", "textColor", "fontColor"])
        );
        var fontSize = normalizeFontSize(
            readFirst(
                source,
                ["Schriftgroesse", "schriftgroesse", "Schriftgr\u00f6\u00dfe", "schriftgr\u00f6\u00dfe", "fontSize"]
            )
        );
        var customStyle = normalizeStyleObject(readFirst(source, ["Style", "style", "Stil", "stil"]));
        var mathOption = normalizeMathOption(
            readFirst(source, ["Formel", "formel", "latex", "LaTeX", "math", "Math", "renderMath", "mathMode"])
        );
        var x = xCandidate;
        var y = yCandidate;

        if (anchor) {
            if (!x) {
                x = anchor.x;
            }
            if (!y) {
                y = anchor.y;
            }
        }

        if (!x || !y) {
            throw new Error(
                "EigeneTastatur: Button an Index " +
                i +
                " braucht einen vollstaendigen Anker mit X und Y (z.B. Anker: [1,2])."
            );
        }

        if (typeof action === "undefined") {
            action = label;
        }

        raw.push({
            order: i,
            x: x,
            y: y,
            width: width,
            height: height,
            label: label,
            action: action,
            original: source,
            backgroundColor: backgroundColor,
            hoverColor: hoverColor,
            textColor: textColor,
            fontSize: fontSize,
            customStyle: customStyle,
            mathOption: mathOption
        });
    }

    return raw;
}

function parseAnchor(anchor) {
    if (Array.isArray(anchor)) {
        var ax = toPositiveInt(anchor[0], null);
        var ay = toPositiveInt(anchor[1], null);
        if (ax && ay) {
            return { x: ax, y: ay };
        }
        return null;
    }

    if (anchor && typeof anchor === "object") {
        var ox = toPositiveInt(readFirst(anchor, ["x", "X", "spalte", "Spalte"]), null);
        var oy = toPositiveInt(readFirst(anchor, ["y", "Y", "zeile", "Zeile"]), null);
        if (ox && oy) {
            return { x: ox, y: oy };
        }
    }

    return null;
}

function calculateBounds(entries) {
    var maxX = 0;
    var maxY = 0;

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        maxX = Math.max(maxX, entry.x + entry.width - 1);
        maxY = Math.max(maxY, entry.y + entry.height - 1);
    }

    return {
        maxX: maxX,
        maxY: maxY
    };
}

function detectOverlaps(entries) {
    for (var i = 0; i < entries.length; i++) {
        for (var j = i + 1; j < entries.length; j++) {
            if (rectanglesOverlap(entries[i], entries[j])) {
                console.warn(
                    "EigeneTastatur: Buttons ueberlappen sich.",
                    entries[i].original,
                    entries[j].original
                );
            }
        }
    }
}

function rectanglesOverlap(a, b) {
    var ax2 = a.x + a.width - 1;
    var ay2 = a.y + a.height - 1;
    var bx2 = b.x + b.width - 1;
    var by2 = b.y + b.height - 1;

    if (ax2 < b.x) {
        return false;
    }
    if (bx2 < a.x) {
        return false;
    }
    if (ay2 < b.y) {
        return false;
    }
    if (by2 < a.y) {
        return false;
    }
    return true;
}

function resolveContainer(containerId) {
    if (containerId && containerId.nodeType === 1) {
        return containerId;
    }

    if (typeof containerId !== "string" || !containerId.trim()) {
        throw new TypeError("EigeneTastatur: containerId muss eine nicht-leere ID oder ein HTMLElement sein.");
    }

    var container = document.getElementById(containerId);
    if (!container) {
        throw new Error('EigeneTastatur: Kein Container mit ID "' + containerId + '" gefunden.');
    }

    return container;
}

function toPositiveInt(value, fallback) {
    if (value === null || typeof value === "undefined" || value === "") {
        return fallback;
    }

    var parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }
    return fallback;
}

function toNonNegativeInt(value, fallback) {
    if (value === null || typeof value === "undefined" || value === "") {
        return fallback;
    }

    var parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) {
        return parsed;
    }
    return fallback;
}

function toNonNegativeNumber(value, fallback) {
    if (value === null || typeof value === "undefined" || value === "") {
        return fallback;
    }

    var parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed;
    }
    return fallback;
}

function normalizeCssText(value) {
    if (value === null || typeof value === "undefined") {
        return null;
    }

    var text = String(value).trim();
    if (!text) {
        return null;
    }

    return text;
}

function normalizeFontSize(value) {
    if (value === null || typeof value === "undefined" || value === "") {
        return null;
    }

    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        return value + "px";
    }

    var text = String(value).trim();
    if (!text) {
        return null;
    }

    if (/^\d+(\.\d+)?$/.test(text)) {
        return text + "px";
    }

    return text;
}

function normalizeStyleObject(styleValue) {
    if (!styleValue || typeof styleValue !== "object" || Array.isArray(styleValue)) {
        return null;
    }
    return styleValue;
}

function normalizeMathOption(value) {
    if (value === null || typeof value === "undefined" || value === "") {
        return null;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value !== 0;
    }

    var text = String(value).trim().toLowerCase();
    if (!text) {
        return null;
    }

    if (text === "1" || text === "true" || text === "yes" || text === "ja" || text === "latex" || text === "math" || text === "tex") {
        return true;
    }
    if (text === "0" || text === "false" || text === "no" || text === "nein" || text === "text") {
        return false;
    }

    return null;
}

function readFirst(obj, keys) {
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }
    }
    return undefined;
}
