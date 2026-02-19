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
    var entries = normalizeEntries(buttonList);
    var bounds = calculateBounds(entries);
    var stage = createStage(gridSize, bounds);

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
        applyButtonLabel(button, entry.label);
        button.addEventListener("click", createClickHandler(buttonFunction, entry, button));
        stage.appendChild(button);
    }

    container.replaceChildren(stage);
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

function applyButtonLabel(button, label) {
    var text = String(label || "");
    button.textContent = renderLatexLikeText(text, 0);
}

function renderLatexLikeText(text, depth) {
    var source = String(text || "");
    var level = depth || 0;

    if (!containsLatexSyntax(source) || level > 5) {
        return source;
    }

    var result = source;
    result = result.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, function (_match, numerator, denominator) {
        return (
            renderLatexLikeText(numerator, level + 1) +
            "\u2044" +
            renderLatexLikeText(denominator, level + 1)
        );
    });

    result = result.replace(/\\sqrt\{([^{}]+)\}/g, function (_match, value) {
        return "\u221a(" + renderLatexLikeText(value, level + 1) + ")";
    });

    result = replaceLatexCommands(result);

    result = result.replace(/\^\{([^{}]+)\}/g, function (_match, value) {
        return toSuperscript(renderLatexLikeText(value, level + 1));
    });
    result = result.replace(/_\{([^{}]+)\}/g, function (_match, value) {
        return toSubscript(renderLatexLikeText(value, level + 1));
    });
    result = result.replace(/\^([^\s])/g, function (_match, value) {
        return toSuperscript(renderLatexLikeText(value, level + 1));
    });
    result = result.replace(/_([^\s])/g, function (_match, value) {
        return toSubscript(renderLatexLikeText(value, level + 1));
    });

    result = result.replace(/[{}]/g, "");
    result = result.replace(/\\,/g, " ");
    result = result.replace(/\\;/g, " ");
    result = result.replace(/\\!/g, "");

    return result;
}

function containsLatexSyntax(text) {
    return /\\[A-Za-z]+|\^|_/.test(text);
}

function replaceLatexCommands(text) {
    return text.replace(/\\[A-Za-z]+/g, function (command) {
        if (Object.prototype.hasOwnProperty.call(LATEX_SYMBOL_MAP, command)) {
            return LATEX_SYMBOL_MAP[command];
        }
        return command;
    });
}

function toSuperscript(text) {
    return convertUsingMap(text, SUPERSCRIPT_MAP, "^");
}

function toSubscript(text) {
    return convertUsingMap(text, SUBSCRIPT_MAP, "_");
}

function convertUsingMap(text, map, fallbackPrefix) {
    var raw = String(text || "");
    if (!raw) {
        return "";
    }

    var converted = "";
    for (var i = 0; i < raw.length; i++) {
        var char = raw.charAt(i);
        if (!Object.prototype.hasOwnProperty.call(map, char)) {
            return fallbackPrefix + "(" + raw + ")";
        }
        converted += map[char];
    }

    return converted;
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
            customStyle: customStyle
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

function readFirst(obj, keys) {
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }
    }
    return undefined;
}

var LATEX_SYMBOL_MAP = {
    "\\alpha": "\u03b1",
    "\\beta": "\u03b2",
    "\\gamma": "\u03b3",
    "\\delta": "\u03b4",
    "\\epsilon": "\u03b5",
    "\\theta": "\u03b8",
    "\\lambda": "\u03bb",
    "\\mu": "\u03bc",
    "\\pi": "\u03c0",
    "\\rho": "\u03c1",
    "\\sigma": "\u03c3",
    "\\tau": "\u03c4",
    "\\phi": "\u03c6",
    "\\omega": "\u03c9",
    "\\Gamma": "\u0393",
    "\\Delta": "\u0394",
    "\\Theta": "\u0398",
    "\\Lambda": "\u039b",
    "\\Pi": "\u03a0",
    "\\Sigma": "\u03a3",
    "\\Phi": "\u03a6",
    "\\Omega": "\u03a9",
    "\\times": "\u00d7",
    "\\cdot": "\u00b7",
    "\\pm": "\u00b1",
    "\\leq": "\u2264",
    "\\geq": "\u2265",
    "\\neq": "\u2260",
    "\\approx": "\u2248",
    "\\infty": "\u221e",
    "\\rightarrow": "\u2192",
    "\\leftarrow": "\u2190",
    "\\leftrightarrow": "\u2194",
    "\\degree": "\u00b0"
};

var SUPERSCRIPT_MAP = {
    "0": "\u2070",
    "1": "\u00b9",
    "2": "\u00b2",
    "3": "\u00b3",
    "4": "\u2074",
    "5": "\u2075",
    "6": "\u2076",
    "7": "\u2077",
    "8": "\u2078",
    "9": "\u2079",
    "+": "\u207a",
    "-": "\u207b",
    "=": "\u207c",
    "(": "\u207d",
    ")": "\u207e",
    "n": "\u207f",
    "i": "\u2071"
};

var SUBSCRIPT_MAP = {
    "0": "\u2080",
    "1": "\u2081",
    "2": "\u2082",
    "3": "\u2083",
    "4": "\u2084",
    "5": "\u2085",
    "6": "\u2086",
    "7": "\u2087",
    "8": "\u2088",
    "9": "\u2089",
    "+": "\u208a",
    "-": "\u208b",
    "=": "\u208c",
    "(": "\u208d",
    ")": "\u208e",
    "a": "\u2090",
    "e": "\u2091",
    "h": "\u2095",
    "i": "\u1d62",
    "j": "\u2c7c",
    "k": "\u2096",
    "l": "\u2097",
    "m": "\u2098",
    "n": "\u2099",
    "o": "\u2092",
    "p": "\u209a",
    "r": "\u1d63",
    "s": "\u209b",
    "t": "\u209c",
    "u": "\u1d64",
    "v": "\u1d65",
    "x": "\u2093"
};
