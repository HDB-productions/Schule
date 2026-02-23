(() => {
  "use strict";

  const DEFAULTS = {
    width: 150,
    height: 150,
    margin: 10,
    background: "#ffffff",
    showMinor: true,
    minorSpacing: 1,
    minorStroke: 0.05,
    minorColor: "#d0d0d0",
    showMajor: true,
    majorSpacing: 5,
    majorStroke: 0.05,
    majorColor: "#9b9b9b",
    axisStroke: 0.1,
    axisColor: "#000000",
    arrowSize: 2,
    showXAxis: true,
    showYAxis: true,
    originOffsetX: 0,
    originOffsetY: 0,
    showTicks: true,
    tickSpacingX: 10,
    tickSpacingY: 10,
    tickLength: 2,
    tickStroke: 0.1,
    tickColor: "#000000",
    showTickLabels: true,
    tickLabelOffset: 2,
    tickLabelFontSize: 1,
    tickLabelColor: "#000000",
    tickValueStepX: 1,
    tickValueStepY: 1,
    axisLabelX: "x",
    axisLabelY: "y",
    showXAxisLabel: true,
    showYAxisLabel: true,
    axisLabelFontSize: 1.5,
    axisLabelColor: "#000000",
    xAxisLabelOffsetX: 6,
    xAxisLabelOffsetY: 2,
    yAxisLabelOffsetX: -3.5,
    yAxisLabelOffsetY: 8,
  };

  const EPS = 1e-9;

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const toNum = (v, fallback) => {
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const fmt = (v) => {
    const n = Math.abs(v) < EPS ? 0 : v;
    return Number.parseFloat(n.toFixed(4)).toString().replace(/\.0+$/, "");
  };
  const esc = (v) =>
    String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  const parseInputNumber = (el, fallback, min = undefined) => {
    if (!el) return fallback;
    const v = Number.parseFloat(el.value);
    if (!Number.isFinite(v)) return fallback;
    if (typeof min === "number" && v < min) return fallback;
    return v;
  };
  const labelNum = (value) => {
    if (!Number.isFinite(value)) return "";
    const n = Math.abs(value) < EPS ? 0 : value;
    if (Math.abs(n - Math.round(n)) < EPS) return String(Math.round(n));
    return fmt(n);
  };
  const linePositions = (start, end, spacing) => {
    if (!(spacing > 0)) return [];
    const list = [];
    let v = start;
    let i = 0;
    while (v <= end + EPS && i < 5000) {
      list.push(v);
      v += spacing;
      i += 1;
    }
    return list;
  };

  const MATH_FUNCTIONS = new Set([
    "abs",
    "acos",
    "acosh",
    "asin",
    "asinh",
    "atan",
    "atan2",
    "atanh",
    "cbrt",
    "ceil",
    "cos",
    "cosh",
    "exp",
    "floor",
    "hypot",
    "log",
    "log10",
    "log2",
    "max",
    "min",
    "pow",
    "round",
    "sign",
    "sin",
    "sinh",
    "sqrt",
    "tan",
    "tanh",
    "trunc",
  ]);

  const isFunctionName = (name) => {
    const lower = String(name || "").toLowerCase();
    return MATH_FUNCTIONS.has(lower) || lower === "ln" || lower === "lg";
  };

  const normalizeIdentifier = (name) => {
    const lower = String(name || "").toLowerCase();
    if (lower === "ln") return "log";
    if (lower === "lg") return "log10";
    if (lower === "pi") return "pi";
    if (lower === "e") return "e";
    return name;
  };

  const shouldSplitIdentifier = (name, knownIdentifiers = null) => {
    if (!/^[A-Za-z]{2,}$/.test(name)) return false;
    if (knownIdentifiers && knownIdentifiers.has(name)) return false;
    const lower = name.toLowerCase();
    if (lower === "pi" || lower === "nan" || lower === "infinity") return false;
    if (isFunctionName(lower)) return false;
    return true;
  };

  const tokenizeFormula = (expression) => {
    const src = String(expression ?? "").trim();
    if (!src) return [];
    const tokens = [];
    const regex = /\s*([A-Za-z_][A-Za-z0-9_]*|\d+(?:[.,]\d+)?(?:[eE][-+]?\d+)?|[()+\-*/^,])/y;
    let position = 0;
    while (position < src.length) {
      regex.lastIndex = position;
      const match = regex.exec(src);
      if (!match) return null;
      const token = match[1];
      position = regex.lastIndex;
      if (/^\d/.test(token)) {
        tokens.push({ type: "number", value: token.replace(",", ".") });
        continue;
      }
      if (/^[A-Za-z_]/.test(token)) {
        tokens.push({ type: "ident", value: token });
        continue;
      }
      if (token === "(") {
        tokens.push({ type: "lparen", value: token });
        continue;
      }
      if (token === ")") {
        tokens.push({ type: "rparen", value: token });
        continue;
      }
      if (token === ",") {
        tokens.push({ type: "comma", value: token });
        continue;
      }
      tokens.push({ type: "op", value: token });
    }
    return tokens;
  };

  const isTermEnd = (token) =>
    token && (token.type === "number" || token.type === "ident" || token.type === "rparen");
  const isTermStart = (token) =>
    token && (token.type === "number" || token.type === "ident" || token.type === "lparen");

  const needsImplicitMultiplication = (current, next) => {
    if (!isTermEnd(current) || !isTermStart(next)) return false;
    if (
      current.type === "ident" &&
      next.type === "lparen" &&
      isFunctionName(current.value)
    ) {
      return false;
    }
    return true;
  };

  const formulaToJS = (expression, parameterMap = null) => {
    const rawTokens = tokenizeFormula(expression);
    if (!rawTokens || rawTokens.length === 0) return null;
    const knownIdentifiers = new Set(["x"]);
    if (parameterMap && typeof parameterMap === "object") {
      for (const key of Object.keys(parameterMap)) {
        knownIdentifiers.add(key);
      }
    }

    const tokens = [];
    for (const token of rawTokens) {
      if (token.type !== "ident") {
        tokens.push(token);
        continue;
      }
      const normalized = normalizeIdentifier(token.value);
      if (shouldSplitIdentifier(normalized, knownIdentifiers)) {
        const chars = normalized.split("");
        chars.forEach((char, index) => {
          if (index > 0) {
            tokens.push({ type: "op", value: "*" });
          }
          tokens.push({ type: "ident", value: char });
        });
      } else {
        tokens.push({ type: "ident", value: normalized });
      }
    }

    const output = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const current = tokens[i];
      const next = tokens[i + 1];
      if (current.type === "op" && current.value === "^") {
        output.push("**");
      } else {
        output.push(current.value);
      }
      if (needsImplicitMultiplication(current, next)) {
        output.push("*");
      }
    }
    return output.join(" ");
  };

  const parseFunctionParameters = (parameterText) => {
    const params = { pi: Math.PI, e: Math.E };
    if (typeof parameterText !== "string" || !parameterText.trim()) {
      return params;
    }
    const assignmentRegex =
      /([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([-+]?\d+(?:[.,]\d+)?(?:e[-+]?\d+)?)/gi;
    let match;
    while ((match = assignmentRegex.exec(parameterText)) !== null) {
      const key = match[1];
      const value = Number.parseFloat(match[2].replace(",", "."));
      if (!Number.isFinite(value)) continue;
      if (key === "x") continue;
      params[key] = value;
    }
    return params;
  };

  const compileFormulaExpression = (expression, parameterText) => {
    const params = parseFunctionParameters(parameterText);
    const jsExpression = formulaToJS(expression, params);
    if (!jsExpression) return null;
    let evaluator;
    try {
      evaluator = new Function(
        "x",
        "params",
        `with (Math) { with (params) { return (${jsExpression}); } }`
      );
    } catch {
      return null;
    }
    return (x) => {
      try {
        const y = Number(evaluator(x, params));
        return Number.isFinite(y) ? y : Number.NaN;
      } catch {
        return Number.NaN;
      }
    };
  };

  const styleDashArray = (style, strokeWidth) => {
    const safeStroke = Math.max(0.05, toNum(strokeWidth, 0.2));
    const normalized = String(style || "solid").toLowerCase();
    if (normalized === "dashed") {
      return `${fmt(8 * safeStroke)} ${fmt(4 * safeStroke)}`;
    }
    if (normalized === "dotted") {
      return `${fmt(1.4 * safeStroke)} ${fmt(3.2 * safeStroke)}`;
    }
    return "";
  };

  const strokeDashAttr = (style, strokeWidth, explicitDash = null) => {
    if (Number.isFinite(explicitDash) && explicitDash > 0) {
      return ` stroke-dasharray="${fmt(explicitDash)} ${fmt(explicitDash)}"`;
    }
    const dashArray = styleDashArray(style, strokeWidth);
    return dashArray ? ` stroke-dasharray="${dashArray}"` : "";
  };

  let INSTANCE_COUNTER = 0;

  class KoordinatensystemSVG {
    constructor(config = {}) {
      this.config = { ...DEFAULTS, ...config };
      this.objects = [];
      INSTANCE_COUNTER += 1;
      this.instanceId = INSTANCE_COUNTER;
    }

    setConfig(config = {}) {
      this.config = { ...this.config, ...config };
      return this;
    }

    getConfig() {
      const width = Math.max(10, toNum(this.config.width, DEFAULTS.width));
      const height = Math.max(10, toNum(this.config.height, DEFAULTS.height));
      const margin = clamp(
        Math.max(0, toNum(this.config.margin, DEFAULTS.margin)),
        0,
        Math.min(width / 2, height / 2)
      );
      const legacyAxisLabelOffset = Math.max(0, toNum(this.config.axisLabelOffset, 3.5));
      const legacyAxisLabelOffsetX = Math.max(
        0,
        toNum(this.config.axisLabelOffsetX, legacyAxisLabelOffset)
      );
      const legacyAxisLabelOffsetY = Math.max(
        0,
        toNum(this.config.axisLabelOffsetY, legacyAxisLabelOffset)
      );
      const hasLegacyAxisLabelOffsets =
        typeof this.config.axisLabelOffset !== "undefined" ||
        typeof this.config.axisLabelOffsetX !== "undefined" ||
        typeof this.config.axisLabelOffsetY !== "undefined";
      return {
        ...DEFAULTS,
        ...this.config,
        width,
        height,
        margin,
        minorSpacing: Math.max(0, toNum(this.config.minorSpacing, DEFAULTS.minorSpacing)),
        minorStroke: Math.max(0, toNum(this.config.minorStroke, DEFAULTS.minorStroke)),
        majorSpacing: Math.max(0, toNum(this.config.majorSpacing, DEFAULTS.majorSpacing)),
        majorStroke: Math.max(0, toNum(this.config.majorStroke, DEFAULTS.majorStroke)),
        axisStroke: Math.max(0, toNum(this.config.axisStroke, DEFAULTS.axisStroke)),
        arrowSize: Math.max(0, toNum(this.config.arrowSize, DEFAULTS.arrowSize)),
        showXAxis: this.config.showXAxis !== false,
        showYAxis: this.config.showYAxis !== false,
        originOffsetX: toNum(this.config.originOffsetX, DEFAULTS.originOffsetX),
        originOffsetY: toNum(this.config.originOffsetY, DEFAULTS.originOffsetY),
        tickSpacingX: Math.max(0, toNum(this.config.tickSpacingX, DEFAULTS.tickSpacingX)),
        tickSpacingY: Math.max(0, toNum(this.config.tickSpacingY, DEFAULTS.tickSpacingY)),
        tickLength: Math.max(0, toNum(this.config.tickLength, DEFAULTS.tickLength)),
        tickStroke: Math.max(0, toNum(this.config.tickStroke, DEFAULTS.tickStroke)),
        tickLabelOffset: Math.max(0, toNum(this.config.tickLabelOffset, DEFAULTS.tickLabelOffset)),
        tickLabelFontSize: Math.max(
          0,
          toNum(this.config.tickLabelFontSize, DEFAULTS.tickLabelFontSize)
        ),
        tickValueStepX: Math.max(0, toNum(this.config.tickValueStepX, DEFAULTS.tickValueStepX)),
        tickValueStepY: Math.max(0, toNum(this.config.tickValueStepY, DEFAULTS.tickValueStepY)),
        showXAxisLabel: this.config.showXAxisLabel !== false,
        showYAxisLabel: this.config.showYAxisLabel !== false,
        axisLabelFontSize: Math.max(
          0,
          toNum(this.config.axisLabelFontSize, DEFAULTS.axisLabelFontSize)
        ),
        xAxisLabelOffsetX: toNum(
          this.config.xAxisLabelOffsetX,
          hasLegacyAxisLabelOffsets ? -legacyAxisLabelOffsetX : DEFAULTS.xAxisLabelOffsetX
        ),
        xAxisLabelOffsetY: toNum(
          this.config.xAxisLabelOffsetY,
          hasLegacyAxisLabelOffsets ? -legacyAxisLabelOffsetY : DEFAULTS.xAxisLabelOffsetY
        ),
        yAxisLabelOffsetX: toNum(
          this.config.yAxisLabelOffsetX,
          hasLegacyAxisLabelOffsets ? legacyAxisLabelOffsetX : DEFAULTS.yAxisLabelOffsetX
        ),
        yAxisLabelOffsetY: toNum(
          this.config.yAxisLabelOffsetY,
          hasLegacyAxisLabelOffsets ? -legacyAxisLabelOffsetY : DEFAULTS.yAxisLabelOffsetY
        ),
      };
    }

    setObjects(objects = []) {
      this.objects = Array.isArray(objects) ? objects.slice() : [];
      return this;
    }

    clearObjects() {
      this.objects = [];
      return this;
    }

    addPoint(point = {}) {
      this.objects.push({ type: "point", ...point });
      return this;
    }

    addLine(line = {}) {
      this.objects.push({ type: "line", ...line });
      return this;
    }

    addFunction(func = {}) {
      this.objects.push({ type: "function", ...func });
      return this;
    }

    addArea(area = {}) {
      this.objects.push({ type: "area", ...area });
      return this;
    }

    geometry(cfg) {
      const startX = cfg.margin;
      const endX = cfg.width - cfg.margin;
      const startY = cfg.margin;
      const endY = cfg.height - cfg.margin;
      const originX = clamp(startX + cfg.originOffsetX, startX, endX);
      const originY = clamp(startY + cfg.originOffsetY, startY, endY);
      const scaleX =
        cfg.tickSpacingX > 0 && cfg.tickValueStepX > 0
          ? cfg.tickSpacingX / cfg.tickValueStepX
          : cfg.majorSpacing > 0
          ? cfg.majorSpacing
          : 10;
      const scaleY =
        cfg.tickSpacingY > 0 && cfg.tickValueStepY > 0
          ? cfg.tickSpacingY / cfg.tickValueStepY
          : cfg.majorSpacing > 0
          ? cfg.majorSpacing
          : scaleX;
      return {
        startX,
        endX,
        startY,
        endY,
        originX,
        originY,
        scaleX: scaleX > 0 ? scaleX : 1,
        scaleY: scaleY > 0 ? scaleY : 1,
      };
    }

    toSvgCoordinates(x, y) {
      const cfg = this.getConfig();
      const g = this.geometry(cfg);
      return { x: g.originX + toNum(x, 0) * g.scaleX, y: g.originY + toNum(y, 0) * g.scaleY };
    }

    buildSVG() {
      const cfg = this.getConfig();
      const g = this.geometry(cfg);
      const partsMinor = [];
      const partsMajor = [];
      const partsAxes = [];
      const partsTicks = [];
      const partsTickLabels = [];
      const partsObjects = [];

      const drawGrid = (list, spacing, strokeWidth, color) => {
        if (!(spacing > 0) || !(strokeWidth > 0)) return;
        for (const x of linePositions(g.startX, g.endX, spacing)) {
          list.push(
            `<line x1="${fmt(x)}" y1="${fmt(g.startY)}" x2="${fmt(x)}" y2="${fmt(
              g.endY
            )}" stroke="${esc(color)}" stroke-width="${fmt(strokeWidth)}mm" />`
          );
        }
        for (const y of linePositions(g.startY, g.endY, spacing)) {
          list.push(
            `<line x1="${fmt(g.startX)}" y1="${fmt(y)}" x2="${fmt(g.endX)}" y2="${fmt(
              y
            )}" stroke="${esc(color)}" stroke-width="${fmt(strokeWidth)}mm" />`
          );
        }
      };

      if (cfg.showMinor) drawGrid(partsMinor, cfg.minorSpacing, cfg.minorStroke, cfg.minorColor);
      if (cfg.showMajor) drawGrid(partsMajor, cfg.majorSpacing, cfg.majorStroke, cfg.majorColor);

      const drawXAxis = cfg.showXAxis && cfg.axisStroke > 0;
      const drawYAxis = cfg.showYAxis && cfg.axisStroke > 0;
      if (drawXAxis || drawYAxis) {
        if (drawXAxis) {
          partsAxes.push(
            `<line x1="${fmt(g.startX)}" y1="${fmt(g.originY)}" x2="${fmt(g.endX)}" y2="${fmt(
              g.originY
            )}" stroke="${esc(cfg.axisColor)}" stroke-width="${fmt(cfg.axisStroke)}mm" />`
          );
        }
        if (drawYAxis) {
          partsAxes.push(
            `<line x1="${fmt(g.originX)}" y1="${fmt(g.startY)}" x2="${fmt(g.originX)}" y2="${fmt(
              g.endY
            )}" stroke="${esc(cfg.axisColor)}" stroke-width="${fmt(cfg.axisStroke)}mm" />`
          );
        }
        if (cfg.arrowSize > 0) {
          if (drawXAxis) {
            partsAxes.push(
              `<path d="M ${fmt(g.endX - cfg.arrowSize)} ${fmt(
                g.originY - cfg.arrowSize / 2
              )} L ${fmt(g.endX)} ${fmt(g.originY)} L ${fmt(g.endX - cfg.arrowSize)} ${fmt(
                g.originY + cfg.arrowSize / 2
              )}" fill="none" stroke="${esc(cfg.axisColor)}" stroke-width="${fmt(
                cfg.axisStroke
              )}mm" />`
            );
          }
          if (drawYAxis) {
            partsAxes.push(
              `<path d="M ${fmt(g.originX - cfg.arrowSize / 2)} ${fmt(
                g.endY - cfg.arrowSize
              )} L ${fmt(g.originX)} ${fmt(g.endY)} L ${fmt(g.originX + cfg.arrowSize / 2)} ${fmt(
                g.endY - cfg.arrowSize
              )}" fill="none" stroke="${esc(cfg.axisColor)}" stroke-width="${fmt(
                cfg.axisStroke
              )}mm" />`
            );
          }
        }
        if (cfg.axisLabelFontSize > 0) {
          const xLabel = (cfg.axisLabelX || "").trim();
          const yLabel = (cfg.axisLabelY || "").trim();
          if (drawXAxis && cfg.showXAxisLabel && xLabel) {
            const xLabelBaseX = g.endX - cfg.arrowSize;
            const xLabelBaseY = g.originY - cfg.tickLength;
            partsAxes.push(
              `<g transform="translate(${fmt(xLabelBaseX + cfg.xAxisLabelOffsetX)} ${fmt(
                xLabelBaseY + cfg.xAxisLabelOffsetY
              )}) scale(1 -1)"><text text-anchor="end" dominant-baseline="middle" font-size="${fmt(
                cfg.axisLabelFontSize
              )}mm" fill="${esc(cfg.axisLabelColor)}">${esc(xLabel)}</text></g>`
            );
          }
          if (drawYAxis && cfg.showYAxisLabel && yLabel) {
            const yLabelBaseX = g.originX + cfg.tickLength;
            const yLabelBaseY = g.endY - cfg.arrowSize;
            partsAxes.push(
              `<g transform="translate(${fmt(yLabelBaseX + cfg.yAxisLabelOffsetX)} ${fmt(
                yLabelBaseY + cfg.yAxisLabelOffsetY
              )}) scale(1 -1)"><text text-anchor="start" dominant-baseline="middle" font-size="${fmt(
                cfg.axisLabelFontSize
              )}mm" fill="${esc(cfg.axisLabelColor)}">${esc(yLabel)}</text></g>`
            );
          }
        }
      }

      if (cfg.showTicks && cfg.tickLength > 0 && cfg.tickStroke > 0) {
        const half = cfg.tickLength / 2;
        if (cfg.tickSpacingX > 0 && cfg.showXAxis) {
          for (const x of linePositions(g.startX, g.endX, cfg.tickSpacingX)) {
            if (Math.abs(x - g.endX) > 1e-5) {
              partsTicks.push(
                `<line x1="${fmt(x)}" y1="${fmt(g.originY - half)}" x2="${fmt(x)}" y2="${fmt(
                  g.originY + half
                )}" stroke="${esc(cfg.tickColor)}" stroke-width="${fmt(cfg.tickStroke)}mm" />`
              );
            }
            if (cfg.showTickLabels) {
              const value = ((x - g.originX) / cfg.tickSpacingX) * cfg.tickValueStepX;
              partsTickLabels.push(
                `<g transform="translate(${fmt(x)} ${fmt(
                  g.originY - half - cfg.tickLabelOffset
                )}) scale(1 -1)"><text text-anchor="middle" dominant-baseline="hanging" font-size="${fmt(
                  cfg.tickLabelFontSize
                )}mm" fill="${esc(cfg.tickLabelColor)}">${esc(labelNum(value))}</text></g>`
              );
            }
          }
        }
        if (cfg.tickSpacingY > 0 && cfg.showYAxis) {
          for (const y of linePositions(g.startY, g.endY, cfg.tickSpacingY)) {
            if (Math.abs(y - g.endY) > 1e-5) {
              partsTicks.push(
                `<line x1="${fmt(g.originX - half)}" y1="${fmt(y)}" x2="${fmt(
                  g.originX + half
                )}" y2="${fmt(y)}" stroke="${esc(cfg.tickColor)}" stroke-width="${fmt(
                  cfg.tickStroke
                )}mm" />`
              );
            }
            if (cfg.showTickLabels) {
              const value = ((y - g.originY) / cfg.tickSpacingY) * cfg.tickValueStepY;
              partsTickLabels.push(
                `<g transform="translate(${fmt(g.originX - half - cfg.tickLabelOffset)} ${fmt(
                  y
                )}) scale(1 -1)"><text text-anchor="end" dominant-baseline="middle" font-size="${fmt(
                  cfg.tickLabelFontSize
                )}mm" fill="${esc(cfg.tickLabelColor)}">${esc(labelNum(value))}</text></g>`
              );
            }
          }
        }
      }

      const objStrokeFallback = Math.max(0.05, cfg.axisStroke || 0.1);
      const domainMinX = (g.startX - g.originX) / g.scaleX;
      const domainMaxX = (g.endX - g.originX) / g.scaleX;
      const toSvgPoint = (unitX, unitY) => ({
        x: g.originX + unitX * g.scaleX,
        y: g.originY + unitY * g.scaleY,
      });

      for (const obj of this.objects) {
        if (!obj || typeof obj !== "object" || obj.hidden) continue;
        const color = obj.color || cfg.axisColor;
        const strokeWidth = Math.max(0, toNum(obj.strokeWidth, objStrokeFallback));
        if (obj.type === "point") {
          const x = toNum(obj.x, NaN);
          const y = toNum(obj.y, NaN);
          if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
          const svgPoint = toSvgPoint(x, y);
          const px = svgPoint.x;
          const py = svgPoint.y;
          const radius = Math.max(0, toNum(obj.radius, 1.2));
          const shape = String(obj.shape || "circle").toLowerCase();
          if (shape === "cross") {
            partsObjects.push(
              `<line x1="${fmt(px - radius)}" y1="${fmt(py - radius)}" x2="${fmt(
                px + radius
              )}" y2="${fmt(py + radius)}" stroke="${esc(color)}" stroke-width="${fmt(
                strokeWidth
              )}mm" stroke-linecap="round" />`,
              `<line x1="${fmt(px - radius)}" y1="${fmt(py + radius)}" x2="${fmt(
                px + radius
              )}" y2="${fmt(py - radius)}" stroke="${esc(color)}" stroke-width="${fmt(
                strokeWidth
              )}mm" stroke-linecap="round" />`
            );
          } else if (shape === "errorbars") {
            const errorX = Math.max(0, toNum(obj.errorX, 0));
            const errorY = Math.max(0, toNum(obj.errorY, 0));
            const errorXmm = errorX * g.scaleX;
            const errorYmm = errorY * g.scaleY;
            const cap = Math.max(0.4, radius * 0.8);
            if (errorXmm > 0) {
              partsObjects.push(
                `<line x1="${fmt(px - errorXmm)}" y1="${fmt(py)}" x2="${fmt(
                  px + errorXmm
                )}" y2="${fmt(py)}" stroke="${esc(color)}" stroke-width="${fmt(
                  strokeWidth
                )}mm" stroke-linecap="round" />`,
                `<line x1="${fmt(px - errorXmm)}" y1="${fmt(py - cap)}" x2="${fmt(
                  px - errorXmm
                )}" y2="${fmt(py + cap)}" stroke="${esc(color)}" stroke-width="${fmt(
                  strokeWidth
                )}mm" stroke-linecap="round" />`,
                `<line x1="${fmt(px + errorXmm)}" y1="${fmt(py - cap)}" x2="${fmt(
                  px + errorXmm
                )}" y2="${fmt(py + cap)}" stroke="${esc(color)}" stroke-width="${fmt(
                  strokeWidth
                )}mm" stroke-linecap="round" />`
              );
            }
            if (errorYmm > 0) {
              partsObjects.push(
                `<line x1="${fmt(px)}" y1="${fmt(py - errorYmm)}" x2="${fmt(px)}" y2="${fmt(
                  py + errorYmm
                )}" stroke="${esc(color)}" stroke-width="${fmt(strokeWidth)}mm" stroke-linecap="round" />`,
                `<line x1="${fmt(px - cap)}" y1="${fmt(py - errorYmm)}" x2="${fmt(
                  px + cap
                )}" y2="${fmt(py - errorYmm)}" stroke="${esc(color)}" stroke-width="${fmt(
                  strokeWidth
                )}mm" stroke-linecap="round" />`,
                `<line x1="${fmt(px - cap)}" y1="${fmt(py + errorYmm)}" x2="${fmt(
                  px + cap
                )}" y2="${fmt(py + errorYmm)}" stroke="${esc(color)}" stroke-width="${fmt(
                  strokeWidth
                )}mm" stroke-linecap="round" />`
              );
            }
            partsObjects.push(
              `<circle cx="${fmt(px)}" cy="${fmt(py)}" r="${fmt(
                Math.max(0.45, radius * 0.45)
              )}" fill="${esc(color)}" stroke="${esc(color)}" stroke-width="${fmt(
                strokeWidth
              )}mm" />`
            );
          } else {
            partsObjects.push(
              `<circle cx="${fmt(px)}" cy="${fmt(py)}" r="${fmt(radius)}" fill="${esc(
                color
              )}" stroke="${esc(color)}" stroke-width="${fmt(strokeWidth)}mm" />`
            );
          }
          const label = (obj.label || "").toString().trim();
          if (label) {
            const offs = Math.max(0, toNum(obj.labelOffset, radius + 1.2));
            partsObjects.push(
              `<g transform="translate(${fmt(px + offs)} ${fmt(
                py + offs
              )}) scale(1 -1)"><text text-anchor="start" dominant-baseline="middle" font-size="${fmt(
                toNum(obj.labelFontSize, 1.6)
              )}mm" fill="${esc(color)}">${esc(label)}</text></g>`
            );
          }
          continue;
        }
        if (obj.type === "line") {
          const x1 = toNum(obj.x1, NaN);
          const y1 = toNum(obj.y1, NaN);
          const x2 = toNum(obj.x2, NaN);
          const y2 = toNum(obj.y2, NaN);
          if (![x1, y1, x2, y2].every(Number.isFinite)) continue;
          const dashAttr = strokeDashAttr(
            obj.style || obj.lineStyle || "solid",
            strokeWidth,
            toNum(obj.dash, Number.NaN)
          );
          const p1 = toSvgPoint(x1, y1);
          const p2 = toSvgPoint(x2, y2);
          partsObjects.push(
            `<line x1="${fmt(p1.x)}" y1="${fmt(p1.y)}" x2="${fmt(p2.x)}" y2="${fmt(
              p2.y
            )}" stroke="${esc(color)}" stroke-width="${fmt(
              strokeWidth
            )}mm" stroke-linecap="round"${dashAttr} />`
          );
          continue;
        }
        if (obj.type === "function") {
          const expr = (obj.expression || "").toString().trim();
          if (!expr) continue;
          const fn = compileFormulaExpression(expr, obj.parameters);
          if (!fn) continue;
          const minX = toNum(obj.minX, domainMinX);
          const maxX = toNum(obj.maxX, domainMaxX);
          if (!(maxX > minX)) continue;
          const step = Math.max(1e-4, toNum(obj.step, (maxX - minX) / 240));
          const path = [];
          let open = false;
          let count = 0;
          for (let x = minX; x <= maxX + step * 0.5 && count < 5000; x += step) {
            const y = fn(x);
            if (!Number.isFinite(y)) {
              open = false;
              continue;
            }
            const svgPoint = toSvgPoint(x, y);
            path.push(`${open ? "L" : "M"} ${fmt(svgPoint.x)} ${fmt(svgPoint.y)}`);
            open = true;
            count += 1;
          }
          if (path.length > 0) {
            const dashAttr = strokeDashAttr(obj.style || obj.funcStyle || "solid", strokeWidth);
            partsObjects.push(
              `<path d="${path.join(" ")}" fill="none" stroke="${esc(
                color
              )}" stroke-width="${fmt(
                strokeWidth
              )}mm" stroke-linejoin="round" stroke-linecap="round"${dashAttr} />`
            );
          }
          continue;
        }
        if (obj.type === "area") {
          const mode = String(obj.mode || obj.areaMode || "polygon").toLowerCase();
          const fillColor = obj.fillColor || "#ffcc80";
          const fillOpacity = clamp(toNum(obj.fillOpacity, 0.45), 0, 1);
          const borderStyle = obj.style || obj.areaStyle || "solid";
          const dashAttr = strokeDashAttr(borderStyle, strokeWidth);

          if (mode === "functions") {
            const lowerExpr = String(obj.lowerExpression || obj.areaLowerExpression || "").trim();
            const upperExpr = String(obj.upperExpression || obj.areaUpperExpression || "").trim();
            if (!lowerExpr || !upperExpr) continue;
            const lowerFn = compileFormulaExpression(
              lowerExpr,
              obj.lowerParameters || obj.areaLowerParameters
            );
            const upperFn = compileFormulaExpression(
              upperExpr,
              obj.upperParameters || obj.areaUpperParameters
            );
            if (!lowerFn || !upperFn) continue;
            const minX = toNum(obj.minX ?? obj.areaMinX, domainMinX);
            const maxX = toNum(obj.maxX ?? obj.areaMaxX, domainMaxX);
            if (!(maxX > minX)) continue;
            const step = Math.max(1e-4, toNum(obj.step ?? obj.areaStep, (maxX - minX) / 240));
            const lowerPoints = [];
            const upperPoints = [];
            let count = 0;
            for (let x = minX; x <= maxX + step * 0.5 && count < 6000; x += step) {
              const yl = lowerFn(x);
              const yu = upperFn(x);
              if (!Number.isFinite(yl) || !Number.isFinite(yu)) continue;
              lowerPoints.push(toSvgPoint(x, yl));
              upperPoints.push(toSvgPoint(x, yu));
              count += 1;
            }
            if (lowerPoints.length >= 2 && upperPoints.length >= 2) {
              const polygonPoints = lowerPoints
                .concat(upperPoints.reverse())
                .map((p) => `${fmt(p.x)},${fmt(p.y)}`)
                .join(" ");
              partsObjects.push(
                `<polygon points="${polygonPoints}" fill="${esc(
                  fillColor
                )}" fill-opacity="${fmt(fillOpacity)}" stroke="${esc(
                  color
                )}" stroke-width="${fmt(strokeWidth)}mm"${dashAttr} />`
              );
            }
            continue;
          }

          const rawPoints = String(obj.points || obj.areaPoints || "")
            .split(/[;\n]/)
            .map((entry) => entry.trim())
            .filter(Boolean);
          if (rawPoints.length === 0) continue;
          const unitPoints = [];
          for (const entry of rawPoints) {
            const match = entry.match(
              /^\s*([-+]?\d+(?:[.,]\d+)?(?:[eE][-+]?\d+)?)\s*[, ]\s*([-+]?\d+(?:[.,]\d+)?(?:[eE][-+]?\d+)?)\s*$/
            );
            if (!match) {
              continue;
            }
            const x = Number.parseFloat(match[1].replace(",", "."));
            const y = Number.parseFloat(match[2].replace(",", "."));
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            unitPoints.push({ x, y });
          }
          if (unitPoints.length < 3) continue;
          const polygonPoints = unitPoints
            .map((p) => toSvgPoint(p.x, p.y))
            .map((p) => `${fmt(p.x)},${fmt(p.y)}`)
            .join(" ");
          partsObjects.push(
            `<polygon points="${polygonPoints}" fill="${esc(fillColor)}" fill-opacity="${fmt(
              fillOpacity
            )}" stroke="${esc(color)}" stroke-width="${fmt(strokeWidth)}mm"${dashAttr} />`
          );
        }
      }

      const clipId = `plot-clip-${this.instanceId}`;
      const plotWidth = g.endX - g.startX;
      const plotHeight = g.endY - g.startY;
      const objectLayer = partsObjects.length
        ? `<g clip-path="url(#${clipId})">\n          ${partsObjects.join(
            "\n          "
          )}\n        </g>`
        : "";

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${fmt(cfg.width)}mm"
     height="${fmt(cfg.height)}mm"
     viewBox="0 0 ${fmt(cfg.width)} ${fmt(cfg.height)}">
  <defs>
    <clipPath id="${clipId}">
      <rect x="${fmt(g.startX)}" y="${fmt(g.startY)}" width="${fmt(plotWidth)}" height="${fmt(
        plotHeight
      )}" />
    </clipPath>
  </defs>
  <rect x="0" y="0" width="${fmt(cfg.width)}" height="${fmt(cfg.height)}" fill="${esc(
        cfg.background
      )}" />
  <g transform="translate(0 ${fmt(cfg.height)}) scale(1 -1)">
    ${partsMinor.length ? `<g>\n          ${partsMinor.join("\n          ")}\n        </g>` : ""}
    ${partsMajor.length ? `<g>\n          ${partsMajor.join("\n          ")}\n        </g>` : ""}
    <g>
          ${partsAxes.join("\n          ")}
    </g>
    ${
      partsTicks.length || partsTickLabels.length
        ? `<g>\n          ${partsTicks.join("\n          ")}\n          ${partsTickLabels.join(
            "\n          "
          )}\n        </g>`
        : ""
    }
    ${objectLayer}
  </g>
</svg>`;
    }
  }

  const formNum = (form, name, fallback, min = undefined) =>
    parseInputNumber(form.elements[name], fallback, min);
  const formTxt = (form, name, fallback) => {
    const el = form.elements[name];
    return el && typeof el.value === "string" ? el.value : fallback;
  };
  const formColor = (form, name, fallback) => {
    const el = form.elements[name];
    return el && typeof el.value === "string" && el.value ? el.value : fallback;
  };
  const formCheck = (form, name, fallback) => {
    const el = form.elements[name];
    return el ? el.checked : fallback;
  };

  const formConfig = (form) => {
    const width = formNum(form, "width", DEFAULTS.width, 1);
    const height = formNum(form, "height", DEFAULTS.height, 1);
    const marginRaw = formNum(form, "margin", DEFAULTS.margin, 0);
    const legacyAxisLabelOffset = formNum(form, "axisLabelOffset", 3.5, 0);
    const legacyAxisLabelOffsetX = formNum(form, "axisLabelOffsetX", legacyAxisLabelOffset, 0);
    const legacyAxisLabelOffsetY = formNum(form, "axisLabelOffsetY", legacyAxisLabelOffset, 0);
    const hasLegacyAxisLabelOffsets =
      !!form.elements.axisLabelOffset ||
      !!form.elements.axisLabelOffsetX ||
      !!form.elements.axisLabelOffsetY;
    return {
      width,
      height,
      margin: clamp(marginRaw, 0, Math.min(width / 2, height / 2)),
      background: formColor(form, "background", DEFAULTS.background),
      showMinor: formCheck(form, "showMinor", DEFAULTS.showMinor),
      minorSpacing: formNum(form, "minorSpacing", DEFAULTS.minorSpacing, 0),
      minorStroke: formNum(form, "minorStroke", DEFAULTS.minorStroke, 0),
      minorColor: formColor(form, "minorColor", DEFAULTS.minorColor),
      showMajor: formCheck(form, "showMajor", DEFAULTS.showMajor),
      majorSpacing: formNum(form, "majorSpacing", DEFAULTS.majorSpacing, 0),
      majorStroke: formNum(form, "majorStroke", DEFAULTS.majorStroke, 0),
      majorColor: formColor(form, "majorColor", DEFAULTS.majorColor),
      axisStroke: formNum(form, "axisStroke", DEFAULTS.axisStroke, 0),
      axisColor: formColor(form, "axisColor", DEFAULTS.axisColor),
      arrowSize: formNum(form, "arrowSize", DEFAULTS.arrowSize, 0),
      showXAxis: formCheck(form, "showXAxis", DEFAULTS.showXAxis),
      showYAxis: formCheck(form, "showYAxis", DEFAULTS.showYAxis),
      originOffsetX: formNum(form, "originOffsetX", DEFAULTS.originOffsetX),
      originOffsetY: formNum(form, "originOffsetY", DEFAULTS.originOffsetY),
      showTicks: formCheck(form, "showTicks", DEFAULTS.showTicks),
      tickSpacingX: formNum(form, "tickSpacingX", DEFAULTS.tickSpacingX, 0),
      tickSpacingY: formNum(form, "tickSpacingY", DEFAULTS.tickSpacingY, 0),
      tickLength: formNum(form, "tickLength", DEFAULTS.tickLength, 0),
      tickStroke: formNum(form, "tickStroke", DEFAULTS.tickStroke, 0),
      tickColor: formColor(form, "tickColor", DEFAULTS.tickColor),
      showTickLabels: formCheck(form, "showTickLabels", DEFAULTS.showTickLabels),
      tickLabelOffset: formNum(form, "tickLabelOffset", DEFAULTS.tickLabelOffset, 0),
      tickLabelFontSize: formNum(form, "tickLabelFontSize", DEFAULTS.tickLabelFontSize, 0),
      tickLabelColor: formColor(form, "tickLabelColor", DEFAULTS.tickLabelColor),
      tickValueStepX: formNum(form, "tickValueStepX", DEFAULTS.tickValueStepX, 0),
      tickValueStepY: formNum(form, "tickValueStepY", DEFAULTS.tickValueStepY, 0),
      axisLabelX: formTxt(form, "axisLabelX", DEFAULTS.axisLabelX),
      axisLabelY: formTxt(form, "axisLabelY", DEFAULTS.axisLabelY),
      showXAxisLabel: formCheck(form, "showXAxisLabel", DEFAULTS.showXAxisLabel),
      showYAxisLabel: formCheck(form, "showYAxisLabel", DEFAULTS.showYAxisLabel),
      axisLabelFontSize: formNum(form, "axisLabelFontSize", DEFAULTS.axisLabelFontSize, 0),
      axisLabelColor: formColor(form, "axisLabelColor", DEFAULTS.axisLabelColor),
      xAxisLabelOffsetX: formNum(
        form,
        "xAxisLabelOffsetX",
        hasLegacyAxisLabelOffsets ? -legacyAxisLabelOffsetX : DEFAULTS.xAxisLabelOffsetX
      ),
      xAxisLabelOffsetY: formNum(
        form,
        "xAxisLabelOffsetY",
        hasLegacyAxisLabelOffsets ? -legacyAxisLabelOffsetY : DEFAULTS.xAxisLabelOffsetY
      ),
      yAxisLabelOffsetX: formNum(
        form,
        "yAxisLabelOffsetX",
        hasLegacyAxisLabelOffsets ? legacyAxisLabelOffsetX : DEFAULTS.yAxisLabelOffsetX
      ),
      yAxisLabelOffsetY: formNum(
        form,
        "yAxisLabelOffsetY",
        hasLegacyAxisLabelOffsets ? -legacyAxisLabelOffsetY : DEFAULTS.yAxisLabelOffsetY
      ),
    };
  };

  const objSummary = (obj, i) => {
    if (obj.type === "point") {
      const shape = String(obj.shape || "circle");
      return `${i + 1}. Punkt (${labelNum(toNum(obj.x, 0))}|${labelNum(
        toNum(obj.y, 0)
      )}, ${shape})`;
    }
    if (obj.type === "line") {
      return `${i + 1}. Strecke (${labelNum(toNum(obj.x1, 0))}|${labelNum(
        toNum(obj.y1, 0)
      )}) -> (${labelNum(toNum(obj.x2, 0))}|${labelNum(toNum(obj.y2, 0))})`;
    }
    if (obj.type === "function") {
      return `${i + 1}. Funktion y=${obj.expression || "f(x)"}`;
    }
    if (obj.type === "area") {
      const mode = String(obj.mode || obj.areaMode || "polygon");
      return `${i + 1}. Flaeche (${mode})`;
    }
    return `${i + 1}. Objekt`;
  };

  const objFromForm = (form) => {
    const type = form.elements.objectType ? form.elements.objectType.value : "point";
    const color = formColor(form, "objectColor", "#d81b60");
    const fallbackStrokeWidth = 0.2;
    const name = formTxt(form, "objectName", "").trim();
    const labelFontSize = formNum(form, "objectLabelFontSize", 1.6, 0);
    if (type === "point") {
      return {
        type: "point",
        name,
        x: formNum(form, "pointX", 0),
        y: formNum(form, "pointY", 0),
        label: formTxt(form, "pointLabel", ""),
        shape: formTxt(form, "pointShape", "circle"),
        radius: formNum(form, "pointRadius", 1.2, 0),
        errorX: formNum(form, "pointErrorX", 0, 0),
        errorY: formNum(form, "pointErrorY", 0, 0),
        labelFontSize,
        color,
        strokeWidth: formNum(form, "pointStroke", fallbackStrokeWidth, 0),
      };
    }
    if (type === "line") {
      return {
        type: "line",
        name,
        x1: formNum(form, "lineX1", 0),
        y1: formNum(form, "lineY1", 0),
        x2: formNum(form, "lineX2", 1),
        y2: formNum(form, "lineY2", 1),
        style: formTxt(form, "lineStyle", "solid"),
        color,
        strokeWidth: formNum(form, "lineStroke", fallbackStrokeWidth, 0),
      };
    }
    if (type === "function") {
      const expression = formTxt(form, "funcExpression", "").trim();
      if (!expression) return null;
      return {
        type: "function",
        name,
        expression,
        parameters: formTxt(form, "funcParameters", ""),
        minX: formNum(form, "funcMinX", -10),
        maxX: formNum(form, "funcMaxX", 10),
        step: Math.max(1e-4, formNum(form, "funcStep", 0.1)),
        style: formTxt(form, "funcStyle", "solid"),
        color,
        strokeWidth: formNum(form, "funcStroke", fallbackStrokeWidth, 0),
      };
    }
    if (type === "area") {
      return {
        type: "area",
        name,
        mode: formTxt(form, "areaMode", "polygon"),
        points: formTxt(form, "areaPoints", ""),
        lowerExpression: formTxt(form, "areaLowerExpression", ""),
        lowerParameters: formTxt(form, "areaLowerParameters", ""),
        upperExpression: formTxt(form, "areaUpperExpression", ""),
        upperParameters: formTxt(form, "areaUpperParameters", ""),
        minX: formNum(form, "areaMinX", -10),
        maxX: formNum(form, "areaMaxX", 10),
        step: Math.max(1e-4, formNum(form, "areaStep", 0.1)),
        fillColor: formColor(form, "areaFillColor", "#ffcc80"),
        fillOpacity: clamp(formNum(form, "areaFillOpacity", 0.45), 0, 1),
        style: formTxt(form, "areaStyle", "solid"),
        color,
        strokeWidth: formNum(form, "areaStroke", fallbackStrokeWidth, 0),
      };
    }
    return null;
  };

  const setObjectPanels = (form) => {
    const type = form.elements.objectType ? form.elements.objectType.value : "point";
    for (const panel of form.querySelectorAll("[data-object-panel]")) {
      panel.hidden = panel.getAttribute("data-object-panel") !== type;
    }
  };

  const initKoordinatensystemGenerator = (options = {}) => {
    const form =
      options.form instanceof HTMLElement
        ? options.form
        : document.getElementById(options.formId || "config-form");
    const preview =
      options.preview instanceof HTMLElement
        ? options.preview
        : document.getElementById(options.previewId || "preview");
    const output =
      options.output instanceof HTMLElement
        ? options.output
        : document.getElementById(options.outputId || "svg-output");
    const saveButton =
      options.saveButton instanceof HTMLElement
        ? options.saveButton
        : document.getElementById(options.saveButtonId || "save-svg");
    const addObjectButton =
      options.addObjectButton instanceof HTMLElement
        ? options.addObjectButton
        : document.getElementById(options.addObjectButtonId || "add-object");
    const clearObjectsButton =
      options.clearObjectsButton instanceof HTMLElement
        ? options.clearObjectsButton
        : document.getElementById(options.clearObjectsButtonId || "clear-objects");
    const exportFunctionCallButton =
      options.exportFunctionCallButton instanceof HTMLElement
        ? options.exportFunctionCallButton
        : document.getElementById(
            options.exportFunctionCallButtonId || "export-function-call"
          );
    const toggleSettingsPanelsButton =
      options.toggleSettingsPanelsButton instanceof HTMLElement
        ? options.toggleSettingsPanelsButton
        : document.getElementById(options.toggleSettingsPanelsButtonId || "toggle-settings-panels");
    const functionCallOutput =
      options.functionCallOutput instanceof HTMLElement
        ? options.functionCallOutput
        : document.getElementById(options.functionCallOutputId || "function-call-output");
    const objectList =
      options.objectList instanceof HTMLElement
        ? options.objectList
        : document.getElementById(options.objectListId || "object-list");

    if (!form || !preview) {
      throw new Error("Form oder Vorschau fehlt.");
    }

    const generator = new KoordinatensystemSVG();
    const objects = [];
    let currentSVG = "";

    const renderObjects = () => {
      if (!objectList) return;
      objectList.innerHTML = "";
      objects.forEach((obj, i) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = objSummary(obj, i);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "secondary small";
        remove.dataset.removeIndex = String(i);
        remove.textContent = "Entfernen";
        li.appendChild(text);
        li.appendChild(remove);
        objectList.appendChild(li);
      });
    };

    const updateSVG = () => {
      generator.setConfig(formConfig(form)).setObjects(objects);
      currentSVG = generator.buildSVG();
      preview.innerHTML = currentSVG;
      if (output) output.value = currentSVG;
      if (functionCallOutput instanceof HTMLTextAreaElement && functionCallOutput.value.trim()) {
        functionCallOutput.value = buildFunctionCallExport();
      }
    };

    const addObject = (obj) => {
      if (!obj) return;
      objects.push(obj);
      renderObjects();
      updateSVG();
    };

    const clearObjects = () => {
      objects.length = 0;
      renderObjects();
      updateSVG();
    };

    const removeObject = (index) => {
      if (index < 0 || index >= objects.length) return;
      objects.splice(index, 1);
      renderObjects();
      updateSVG();
    };

    const saveSVG = () => {
      if (!currentSVG) updateSVG();
      const blob = new Blob([currentSVG], { type: "image/svg+xml" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "koordinatensystem.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    };

    const serializeObject = (obj) => {
      const out = {};
      for (const [key, value] of Object.entries(obj || {})) {
        if (typeof value === "function") continue;
        if (typeof value === "undefined") continue;
        out[key] = value;
      }
      return out;
    };

    const buildFunctionCallExport = () => {
      const config = formConfig(form);
      const exportObjects = objects.map((obj) => serializeObject(obj));
      return [
        "// benoetigt koordinatensystem-svg.js",
        "// Erzeugt nur den SVG-String. Wohin er gerendert wird, bestimmst du selbst.",
        `const config = ${JSON.stringify(config, null, 2)};`,
        `const objects = ${JSON.stringify(exportObjects, null, 2)};`,
        "const generator = new KoordinatensystemSVG(config);",
        "generator.setObjects(objects);",
        "const svg = generator.buildSVG();",
        "",
        "// Beispiel: SVG in ein Ziel-Element deiner Seite schreiben",
        'const target = document.getElementById("mein-svg-ziel");',
        "if (target) target.innerHTML = svg;",
      ].join("\n");
    };

    const exportFunctionCall = () => {
      const text = buildFunctionCallExport();
      if (functionCallOutput instanceof HTMLTextAreaElement) {
        functionCallOutput.value = text;
      }
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      return text;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateSVG();
    });
    form.addEventListener("input", () => updateSVG());
    if (form.elements.objectType) {
      form.elements.objectType.addEventListener("change", () => setObjectPanels(form));
      setObjectPanels(form);
    }
    if (addObjectButton) {
      addObjectButton.addEventListener("click", () => addObject(objFromForm(form)));
    }
    if (clearObjectsButton) {
      clearObjectsButton.addEventListener("click", clearObjects);
    }
    if (objectList) {
      objectList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const removeIndex = target.dataset.removeIndex;
        if (typeof removeIndex !== "string") return;
        removeObject(Number.parseInt(removeIndex, 10));
      });
    }
    if (saveButton) {
      saveButton.addEventListener("click", saveSVG);
    }
    if (exportFunctionCallButton) {
      exportFunctionCallButton.addEventListener("click", exportFunctionCall);
    }
    const topSections = () => Array.from(form.querySelectorAll("details.top-section"));
    const updateToggleSettingsPanelsButton = () => {
      if (!(toggleSettingsPanelsButton instanceof HTMLButtonElement)) return;
      const sections = topSections();
      const allOpen = sections.length > 0 && sections.every((section) => section.open);
      toggleSettingsPanelsButton.textContent = allOpen
        ? "Alle Bereiche zuklappen"
        : "Alle Bereiche aufklappen";
    };
    if (toggleSettingsPanelsButton) {
      toggleSettingsPanelsButton.addEventListener("click", () => {
        const sections = topSections();
        const allOpen = sections.length > 0 && sections.every((section) => section.open);
        for (const section of sections) section.open = !allOpen;
        updateToggleSettingsPanelsButton();
      });
    }
    for (const section of topSections()) {
      section.addEventListener("toggle", updateToggleSettingsPanelsButton);
    }

    renderObjects();
    updateSVG();
    updateToggleSettingsPanelsButton();

    return {
      generator,
      updateSVG,
      getSVG: () => currentSVG,
      getObjects: () => objects.slice(),
      addObject,
      clearObjects,
      removeObject,
      addPoint: (point) => addObject({ type: "point", ...point }),
      addLine: (line) => addObject({ type: "line", ...line }),
      addFunction: (func) => addObject({ type: "function", ...func }),
      addArea: (area) => addObject({ type: "area", ...area }),
      exportFunctionCall: buildFunctionCallExport,
      setOrigin: (offsetX, offsetY) => {
        if (form.elements.originOffsetX) form.elements.originOffsetX.value = String(toNum(offsetX, 0));
        if (form.elements.originOffsetY) form.elements.originOffsetY.value = String(toNum(offsetY, 0));
        updateSVG();
      },
      setAxisLabels: (xLabel, yLabel) => {
        if (form.elements.axisLabelX) form.elements.axisLabelX.value = String(xLabel ?? "");
        if (form.elements.axisLabelY) form.elements.axisLabelY.value = String(yLabel ?? "");
        updateSVG();
      },
    };
  };

  window.KoordinatensystemSVG = KoordinatensystemSVG;
  window.initKoordinatensystemGenerator = initKoordinatensystemGenerator;
})();
