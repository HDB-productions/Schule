$ErrorActionPreference = 'Stop'
$path = 'e:\Dateien\Dokumente\GitHub\Schule\Klausurbewertung\app.js'
$content = [System.IO.File]::ReadAllText($path)

function Replace-Literal([string]$source, [string]$old, [string]$new) {
  if (-not $source.Contains($old)) {
    throw "Literal not found:`n$old"
  }
  return $source.Replace($old, $new)
}

function Replace-Between([string]$source, [string]$startMarker, [string]$endMarker, [string]$replacement) {
  $startIndex = $source.IndexOf($startMarker)
  if ($startIndex -lt 0) { throw "Start marker not found: $startMarker" }
  $endIndex = $source.IndexOf($endMarker, $startIndex)
  if ($endIndex -lt 0) { throw "End marker not found: $endMarker" }
  return $source.Substring(0, $startIndex) + $replacement + $source.Substring($endIndex)
}

$helperBlock = @'
  function getDefaultResultLabel(presetId) {
    switch (presetId) {
      case "sek1":
        return "Note";
      case "oberstufe":
        return "Notenpunkte";
      case "symbol":
        return "Bewertung";
      case "custom":
        return "Bewertung";
      default:
        return "Bewertung";
    }
  }

  var PRINT_BORDER_OPTIONS = [
    { value: "default", label: "Automatisch" },
    { value: "none", label: "Kein Rahmen" },
    { value: "top", label: "Linie oben" },
    { value: "bottom", label: "Linie unten" },
    { value: "topBottom", label: "Linie oben + unten" },
    { value: "box", label: "Voller Rahmen" }
  ];

  function createDefaultPrintRowOverride() {
    return {
      borderStyle: "default",
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      breakAfter: false
    };
  }

  function createDefaultPrintLayout() {
    return {
      previewStudentId: "",
      rowOverrides: {}
    };
  }

  function normalizePrintMetric(value, min, max) {
    var numeric = Number(String(value == null ? "" : value).replace(",", "."));
    if (!Number.isFinite(numeric)) {
      return 0;
    }
    numeric = Math.max(min, Math.min(max, numeric));
    return Math.round(numeric * 2) / 2;
  }

  function normalizePrintRowOverride(candidate) {
    var override = candidate && typeof candidate === "object" ? candidate : {};
    var allowedBorderValues = PRINT_BORDER_OPTIONS.map(function (option) {
      return option.value;
    });
    return {
      borderStyle: allowedBorderValues.indexOf(override.borderStyle) >= 0 ? override.borderStyle : "default",
      marginTop: normalizePrintMetric(override.marginTop, -8, 16),
      marginBottom: normalizePrintMetric(override.marginBottom, -8, 16),
      paddingTop: normalizePrintMetric(override.paddingTop, 0, 16),
      paddingBottom: normalizePrintMetric(override.paddingBottom, 0, 16),
      breakAfter: !!override.breakAfter
    };
  }

  function isDefaultPrintRowOverride(override) {
    var normalized = normalizePrintRowOverride(override);
    return normalized.borderStyle === "default"
      && normalized.marginTop === 0
      && normalized.marginBottom === 0
      && normalized.paddingTop === 0
      && normalized.paddingBottom === 0
      && !normalized.breakAfter;
  }

  function normalizePrintLayout(candidate) {
    var layout = candidate && typeof candidate === "object" ? candidate : createDefaultPrintLayout();
    var normalized = createDefaultPrintLayout();
    normalized.previewStudentId = String(layout.previewStudentId || "");

    Object.keys(layout.rowOverrides || {}).forEach(function (rowKey) {
      var rowOverride = normalizePrintRowOverride(layout.rowOverrides[rowKey]);
      if (!isDefaultPrintRowOverride(rowOverride)) {
        normalized.rowOverrides[rowKey] = rowOverride;
      }
    });

    return normalized;
  }

  function normalizeExamRecord(exam) {
    if (!exam || typeof exam !== "object") {
      return exam;
    }
    exam.printLayout = normalizePrintLayout(exam.printLayout);
    return exam;
  }

'@
$content = Replace-Between $content '  function getDefaultResultLabel(presetId) {' '  function createEmptyStore() {' $helperBlock
$content = Replace-Literal $content '    var exams = Array.isArray(store.exams) ? store.exams : [];' "    var exams = Array.isArray(store.exams) ? store.exams : [];`r`n    exams = exams.map(normalizeExamRecord);"
$content = Replace-Literal $content '      evaluations: {}' "      evaluations: {},`r`n      printLayout: createDefaultPrintLayout()"
$content = Replace-Literal $content '    return parsed;' '    return normalizeExamRecord(parsed);'
$content = Replace-Literal $content '      evaluations: duplicatedEvaluations' "      evaluations: duplicatedEvaluations,`r`n      printLayout: remapPrintLayout(exam.printLayout, structureIdMap, studentIdMap)"
$content = Replace-Literal $content '    collapsedNodeIds: {}' "    collapsedNodeIds: {},`r`n    printPreviewSelectedRowKey: null"
$content = Replace-Literal $content '      { id: "print", label: "Druck" }' "      { id: \"printLayout\", label: \"Druckvorschau\" },`r`n      { id: \"print\", label: \"Druck\" }"
$renderCurrentViewBlock = @"
  function renderCurrentView(exam) {
    if (!exam && ui.activeTab !== "archive") {
      return renderEmptyState();
    }
    switch (ui.activeTab) {
      case "archive":
        return renderArchiveView();
      case "overview":
        return renderOverviewView(exam);
      case "metadata":
        return renderMetadataView(exam);
      case "students":
        return renderStudentsView(exam);
      case "structure":
        return renderStructureView(exam);
      case "matrix":
        return renderMatrixView(exam);
      case "printLayout":
        return renderPrintLayoutView(exam);
      case "print":
        return renderPrintView(exam);
      default:
        return renderOverviewView(exam);
    }
  }
"@
$content = Replace-Between $content '  function renderCurrentView(exam) {' '  function render() {' $renderCurrentViewBlock
$content = Replace-Literal $content '      Object.keys(exam.evaluations).forEach(function (key) {' "      prunePrintLayoutRowsForNodeIds(exam, ids);`r`n      Object.keys(exam.evaluations).forEach(function (key) {"

$printBlock = @'
  function getPrintSchemeLabel(metadata) {
    switch (metadata.notenschluesselPreset) {
      case "sek1":
        return "Sek I";
      case "oberstufe":
        return "Oberstufe";
      case "symbol":
        return "Bewertung";
      case "custom":
        return "Benutzerdefiniert";
      default:
        return "";
    }
  }

  function buildPrintRowKey(kind, nodeId) {
    return String(kind || "row") + ":" + String(nodeId || "global");
  }

  function parsePrintRowKey(rowKey) {
    var normalizedKey = String(rowKey || "");
    var separatorIndex = normalizedKey.indexOf(":");
    if (separatorIndex === -1) {
      return null;
    }
    return {
      kind: normalizedKey.slice(0, separatorIndex),
      nodeId: normalizedKey.slice(separatorIndex + 1)
    };
  }

  function remapPrintLayout(layout, structureIdMap, studentIdMap) {
    var normalizedLayout = normalizePrintLayout(layout);
    var remappedOverrides = {};

    Object.keys(normalizedLayout.rowOverrides).forEach(function (rowKey) {
      var parsed = parsePrintRowKey(rowKey);
      if (!parsed || !structureIdMap.has(parsed.nodeId)) {
        return;
      }
      remappedOverrides[buildPrintRowKey(parsed.kind, structureIdMap.get(parsed.nodeId))] = deepClone(normalizedLayout.rowOverrides[rowKey]);
    });

    return {
      previewStudentId: normalizedLayout.previewStudentId && studentIdMap.has(normalizedLayout.previewStudentId)
        ? studentIdMap.get(normalizedLayout.previewStudentId)
        : "",
      rowOverrides: remappedOverrides
    };
  }

  function prunePrintLayoutRowsForNodeIds(exam, nodeIds) {
    if (!exam || !nodeIds || !nodeIds.size) {
      return;
    }
    var layout = normalizePrintLayout(exam.printLayout);
    Object.keys(layout.rowOverrides).forEach(function (rowKey) {
      var parsed = parsePrintRowKey(rowKey);
      if (parsed && nodeIds.has(parsed.nodeId)) {
        delete layout.rowOverrides[rowKey];
      }
    });
    exam.printLayout = layout;
  }

  function getPrintLayout(exam) {
    return normalizePrintLayout(exam && exam.printLayout);
  }

  function getPrintPreviewStudentId(exam) {
    var students = getActiveStudents(exam);
    var preferredStudentId = getPrintLayout(exam).previewStudentId;
    if (!students.length) {
      return "";
    }
    if (preferredStudentId && students.some(function (student) { return student.id === preferredStudentId; })) {
      return preferredStudentId;
    }
    return students[0].id;
  }

  function getPrintRowOverride(exam, row) {
    var layout = getPrintLayout(exam);
    return normalizePrintRowOverride(layout.rowOverrides[row.rowKey]);
  }

  function getPrintBorderLabel(value) {
    var option = PRINT_BORDER_OPTIONS.find(function (entry) {
      return entry.value === value;
    });
    return option ? option.label : "Automatisch";
  }

  function formatPrintMetricInput(value) {
    var numeric = Number(value) || 0;
    return Number.isInteger(numeric) ? String(numeric) : String(numeric);
  }

  function formatPrintMetricCss(value) {
    var numeric = Number(value) || 0;
    if (!numeric) {
      return "";
    }
    return String(numeric).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1") + "mm";
  }

  function shortenPrintLabel(text, maxLength) {
    var normalized = String(text || "").trim();
    if (!normalized || normalized.length <= maxLength) {
      return normalized;
    }
    return normalized.slice(0, Math.max(1, maxLength - 3)).trim() + "...";
  }

  function getPrintRowTypeLabel(row) {
    switch (row.kind) {
      case "criterion":
        return "Kriterium";
      case "blockHeading":
        return "Block�berschrift";
      case "blockInline":
        return "Blockzeile";
      case "sum":
        return "Blocksumme";
      default:
        return "Element";
    }
  }

  function getPrintRowLabel(row) {
    var parts = [];
    if (row.marker) {
      parts.push(String(row.marker).trim());
    }
    if (row.titleText) {
      parts.push(String(row.titleText).trim());
    }
    if (row.label) {
      parts.push(String(row.label).trim());
    }
    var baseLabel = parts.join(" ").trim();
    if (!baseLabel) {
      baseLabel = getPrintableRowText(row);
    }
    return shortenPrintLabel(baseLabel || getPrintRowTypeLabel(row), 88);
  }

  function getPrintableRowText(row) {
    return String(row.bodyText || row.titleText || "")
      .replace(/!\[[^\]]*\]\((?:data:[^)]+|[^)]+)\)/g, " [Bild] ")
      .replace(/\$\$[\s\S]+?\$\$/g, " Formelblock ")
      .replace(/\$[^$\n]+\$/g, " Formel ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isPrintHeadingRow(row) {
    return !!row && (row.kind === "blockHeading" || row.kind === "blockInline");
  }

  function getPrintRowWeight(row, exam) {
    var weight = 1;

    if (row.kind === "criterion") {
      var raw = String(row.bodyText || row.titleText || "");
      var printableText = getPrintableRowText(row);
      var textWeight = printableText ? Math.ceil(printableText.length / 320) : 0;
      var imageMatches = raw.match(/!\[([^\]]*)\]\((?:data:[^)]+|[^)]+)\)/g) || [];
      var imageWeight = 0;

      imageMatches.forEach(function (match) {
        var widthMatch = match.match(/\|w=(\d+)/);
        var width = widthMatch ? Number(widthMatch[1]) || 220 : 220;
        imageWeight += Math.max(1, Math.ceil(width / 180));
      });

      weight = Math.max(1, textWeight + imageWeight);
    } else if (row.kind === "blockHeading") {
      weight = 1;
    } else if (row.kind === "summary") {
      weight = 5;
    }

    if (exam) {
      var override = getPrintRowOverride(exam, row);
      var spacingWeight = Math.ceil((Math.max(0, override.marginTop) + Math.max(0, override.marginBottom) + Math.max(0, override.paddingTop) + Math.max(0, override.paddingBottom)) / 4);
      weight += spacingWeight;
    }

    return weight;
  }

  function buildPrintRowsForStudent(exam, studentId) {
    var rows = [];
    var childrenMap = getChildrenMap(exam.structure);

    function applyBlockFrame(startIndex, endIndex, borderStyle) {
      if (borderStyle === "none" || endIndex < startIndex) {
        return;
      }
      for (var index = startIndex; index <= endIndex; index += 1) {
        rows[index].frameStyle = borderStyle;
        if (index === startIndex) {
          rows[index].frameStart = true;
        }
        if (index === endIndex) {
          rows[index].frameEnd = true;
        }
      }
    }

    function foldInlineBlockRows(startIndex, endIndex, blockTitle) {
      var firstRow = null;
      var index;
      if (endIndex < startIndex) {
        return;
      }

      for (index = startIndex; index <= endIndex; index += 1) {
        rows[index].depth = Math.max(0, Number(rows[index].depth || 0) - 1);
        if (!firstRow && rows[index].kind !== "spacer") {
          firstRow = rows[index];
        }
      }

      if (!firstRow || !blockTitle) {
        return;
      }

      if (firstRow.marker) {
        firstRow.marker = blockTitle + " " + firstRow.marker;
      } else {
        firstRow.marker = blockTitle;
      }
    }

    function addNodeRows(node, depth) {
      if (node.printVisibility === "hidden" || node.printVisibility === "screenOnly") {
        return;
      }

      if (isCriterionNode(node)) {
        var entry = exam.evaluations[evaluationKey(studentId, node.id)];
        rows.push({
          rowKey: buildPrintRowKey("criterion", node.id),
          sourceNodeId: node.id,
          kind: "criterion",
          depth: depth,
          marker: "",
          titleText: node.title || "",
          bodyText: node.richContent || "",
          achieved: entry ? Number(entry.achievedPoints) || 0 : 0,
          max: Number(node.maxPoints) || 0,
          isBonus: !!node.isBonus,
          frameStyle: "none",
          frameStart: false,
          frameEnd: false
        });
        return;
      }

      if (!isBlockNode(node)) {
        return;
      }

      var startIndex = rows.length;
      var blockTitle = String(node.title || "").trim();
      if (blockTitle && getNodeIsHeading(node)) {
        rows.push({
          rowKey: buildPrintRowKey("blockHeading", node.id),
          sourceNodeId: node.id,
          kind: "blockHeading",
          depth: 0,
          marker: "",
          titleText: blockTitle,
          frameStyle: "none",
          frameStart: false,
          frameEnd: false
        });
      }

      var children = childrenMap[node.id] || [];
      children.forEach(function (child) {
        addNodeRows(child, depth + 1);
      });

      if (blockTitle && !getNodeIsHeading(node)) {
        foldInlineBlockRows(startIndex, rows.length - 1, blockTitle);
      }

      if (getNodeShowSum(node) && getDescendantCriterionIds(exam.structure, node.id).length) {
        var totals = getNodeTotalsForStudent(exam, node.id, studentId);
        rows.push({
          rowKey: buildPrintRowKey("sum", node.id),
          sourceNodeId: node.id,
          kind: "sum",
          depth: getNodeIsHeading(node) ? 0 : Math.max(0, depth - 1),
          marker: "",
          label: getNodeIsHeading(node) && blockTitle ? "Summe " + blockTitle : "Summe",
          achieved: totals.achieved,
          max: totals.max,
          frameStyle: "none",
          frameStart: false,
          frameEnd: false
        });
      }

      applyBlockFrame(startIndex, rows.length - 1, getNodeBorderStyle(node));
    }

    (childrenMap.__root__ || []).forEach(function (node) {
      addNodeRows(node, 0);
    });

    return rows;
  }

  function chunkRowsForPrint(rows, summaryWeight, exam) {
    var pages = [];
    var current = [];
    var currentWeight = 0;
    var maxWeight = 28;

    rows.forEach(function (row, index) {
      var weight = getPrintRowWeight(row, exam);
      var nextRow = rows[index + 1] || null;
      var rowOverride = exam ? getPrintRowOverride(exam, row) : createDefaultPrintRowOverride();
      var reserveFollower = rowOverride.breakAfter || !isPrintHeadingRow(row) || !nextRow ? 0 : Math.min(getPrintRowWeight(nextRow, exam), 6);
      var wouldOverflow = current.length && (currentWeight + weight + reserveFollower > maxWeight);
      var currentHasOnlyHeading = current.length === 1 && isPrintHeadingRow(current[0]);

      if (wouldOverflow && !currentHasOnlyHeading) {
        pages.push(current);
        current = [];
        currentWeight = 0;
      }

      current.push(row);
      currentWeight += weight;

      if (rowOverride.breakAfter && index < rows.length - 1) {
        pages.push(current);
        current = [];
        currentWeight = 0;
      }
    });

    if (current.length) {
      pages.push(current);
    }

    if (!pages.length) {
      pages.push([]);
    }

    if (summaryWeight && currentWeight + summaryWeight > maxWeight) {
      pages.push([]);
    }

    return pages;
  }

  function buildPrintDocumentForStudent(exam, student) {
    var rows = buildPrintRowsForStudent(exam, student.id);
    return {
      rows: rows,
      pages: chunkRowsForPrint(rows, 5, exam),
      totals: getStudentTotals(exam, student.id)
    };
  }

  function getPrintHeaderTitle(exam) {
    var metadata = exam.metadata || {};
    var parts = [];
    if (metadata.typ) {
      parts.push(String(metadata.typ).trim());
    }
    if (metadata.fach) {
      parts.push(String(metadata.fach).trim());
    }
    if (metadata.arbeitsNummer) {
      parts.push("Nr: " + String(metadata.arbeitsNummer).trim());
    }
    if (metadata.thema) {
      parts.push("(" + String(metadata.thema).trim() + ")");
    }
    return parts.join(" ").trim() || "Leistungsnachweis";
  }

  function getPrintFrameClasses(row, override) {
    var classes = [];
    var useOverride = override && override.borderStyle && override.borderStyle !== "default";
    var style = useOverride ? override.borderStyle : row.frameStyle;

    switch (style) {
      case "top":
        if (useOverride || row.frameStart) {
          classes.push("print-frame-top");
        }
        break;
      case "bottom":
        if (useOverride || row.frameEnd) {
          classes.push("print-frame-bottom");
        }
        break;
      case "topBottom":
        if (useOverride || row.frameStart) {
          classes.push("print-frame-top");
        }
        if (useOverride || row.frameEnd) {
          classes.push("print-frame-bottom");
        }
        break;
      case "box":
        classes.push("print-frame-box");
        if (useOverride || row.frameStart) {
          classes.push("print-frame-start");
        }
        if (useOverride || row.frameEnd) {
          classes.push("print-frame-end");
        }
        break;
      default:
        break;
    }
    return classes.join(" ");
  }

  function getPrintRowBoxStyle(override) {
    var styles = [];
    var marginTop = formatPrintMetricCss(override.marginTop);
    var marginBottom = formatPrintMetricCss(override.marginBottom);
    var paddingTop = formatPrintMetricCss(override.paddingTop);
    var paddingBottom = formatPrintMetricCss(override.paddingBottom);

    if (marginTop) {
      styles.push("margin-top:" + marginTop);
    }
    if (marginBottom) {
      styles.push("margin-bottom:" + marginBottom);
    }
    if (paddingTop) {
      styles.push("padding-top:" + paddingTop);
    }
    if (paddingBottom) {
      styles.push("padding-bottom:" + paddingBottom);
    }

    return styles.join(";");
  }

  function renderPrintHeader(exam, student, pageIndex, pageCount) {
    var metadata = exam.metadata || {};
    var title = getPrintHeaderTitle(exam);
    return `
      <header class="print-header-card">
        <div class="print-title-row">
          <div class="print-title-main">${escapeHtml(title)}</div>
          <div class="print-title-date">${escapeHtml(formatDate(metadata.termin) || "")}</div>
        </div>
        <div class="print-header-grid">
          <div class="print-header-cell print-header-left"><span class="print-meta-label">Klasse/Kurs:</span><span class="print-meta-value">${escapeHtml(metadata.kursOderKlasse || "-")}</span></div>
          <div class="print-header-cell print-header-center"><span class="print-meta-label">Name:</span><span class="print-meta-value">${escapeHtml(student.displayName || "")}</span></div>
          <div class="print-header-cell print-header-right"><span class="print-meta-label">Lehrkraft:</span><span class="print-meta-value">${escapeHtml(metadata.lehrkraft || "")}</span></div>
        </div>
        <div class="print-page-row">Seite: ${pageIndex + 1} von ${pageCount}</div>
      </header>
    `;
  }

  function renderPrintScore(achieved, max) {
    return `<div class="print-score-bracket"><span>(</span><span class="print-score-value">${formatPointValue(achieved)}</span><span>/</span><span class="print-score-value">${formatPointValue(max)}</span><span>)</span></div>`;
  }

  function renderPrintCriterionContent(row) {
    var parts = [];
    var titleText = String(row.titleText || "").trim();
    var bodyText = String(row.bodyText || "").trim();

    if (titleText) {
      parts.push(`<div class="print-criterion-title">${escapeHtml(titleText)}</div>`);
    }
    if (bodyText && bodyText !== titleText) {
      parts.push(`<div class="print-criterion-body">${renderMarkdown(bodyText)}</div>`);
    }
    if (!parts.length) {
      parts.push('<div class="print-criterion-title">Ohne Inhalt</div>');
    }
    return parts.join("");
  }

  function renderPrintRow(row, options) {
    var renderOptions = options || {};
    var override = renderOptions.exam ? getPrintRowOverride(renderOptions.exam, row) : createDefaultPrintRowOverride();
    var frameClasses = getPrintFrameClasses(row, override);
    var rowClass = ["print-work-row", "print-row-" + row.kind];
    var rowStyle = getPrintRowBoxStyle(override);
    var rowStyleAttr = rowStyle ? ` style="${rowStyle}"` : "";
    var indentStyle = `padding-left:${row.depth * 12}px`;
    var rowActionAttr = "";
    var breakFlag = renderOptions.showBreakMarkers && override.breakAfter
      ? '<div class="print-break-flag">Seitenumbruch nach diesem Element</div>'
      : "";

    if (frameClasses) {
      rowClass.push(frameClasses);
    }
    if (renderOptions.selectable) {
      rowClass.push("print-row-selectable");
      rowActionAttr = ` data-action="select-print-row" data-row-key="${escapeHtml(row.rowKey)}" role="button" tabindex="0"`;
    }
    if (renderOptions.selectedRowKey && renderOptions.selectedRowKey === row.rowKey) {
      rowClass.push("print-row-selected");
    }
    if (renderOptions.showBreakMarkers && override.breakAfter) {
      rowClass.push("print-row-has-break");
    }

    if (row.kind === "spacer") {
      return `<div class="${rowClass.join(" ")}"${rowStyleAttr}${rowActionAttr}><div class="print-spacer-cell"></div>${breakFlag}</div>`;
    }

    if (row.kind === "blockHeading") {
      return `<div class="${rowClass.join(" ")}"${rowStyleAttr}${rowActionAttr}><div class="print-content-cell print-content-full" style="${indentStyle}"><div class="print-heading-block">${escapeHtml(row.titleText || "")}</div></div>${breakFlag}</div>`;
    }

    if (row.kind === "blockInline") {
      return `<div class="${rowClass.join(" ")}"${rowStyleAttr}${rowActionAttr}><div class="print-marker-cell">${escapeHtml(row.marker || "")}</div><div class="print-content-cell print-content-span" style="${indentStyle}"><div class="print-heading-inline">${escapeHtml(row.titleText || "")}</div></div>${breakFlag}</div>`;
    }

    if (row.kind === "sum") {
      return `<div class="${rowClass.join(" ")}"${rowStyleAttr}${rowActionAttr}><div class="print-content-cell print-sum-content" style="${indentStyle}"><strong>${escapeHtml(row.label || "Summe")}</strong></div><div class="print-score-cell">${renderPrintScore(row.achieved, row.max)}</div>${breakFlag}</div>`;
    }

    return `<div class="${rowClass.join(" ")}"${rowStyleAttr}${rowActionAttr}><div class="print-marker-cell">${escapeHtml(row.marker || "")}</div><div class="print-content-cell" style="${indentStyle}">${renderPrintCriterionContent(row)}</div><div class="print-score-cell">${renderPrintScore(row.achieved, row.max)}${row.isBonus ? '<div class="print-bonus-note">Bonus</div>' : ""}</div>${breakFlag}</div>`;
  }

  function renderPrintSummary(exam, student, totals, scheme) {
    var horizontalBoundaries = scheme.boundaries.slice().sort(function (a, b) {
      return a.minPercent - b.minPercent;
    });
    var resultLabel = getResultLabel(exam.metadata);
    return `
      <section class="print-summary-block">
        <div class="print-summary-grid">
          <div class="print-summary-label">Gesamtpunktzahl</div>
          <div class="print-summary-value">${renderPrintScore(totals.totalAchieved, totals.maxRegular)}</div>
          <div class="print-summary-label">In Prozent</div>
          <div class="print-summary-value">${formatPercentValue(totals.percent)}</div>
          <div class="print-summary-label">${escapeHtml(resultLabel)}</div>
          <div class="print-summary-value print-summary-note-line"><span class="print-summary-note">${escapeHtml(totals.gradeLabel)}</span><span class="print-summary-teacher" aria-hidden="true"></span></div>
        </div>
        <table class="print-grade-horizontal">
          <thead>
            <tr><th colspan="${horizontalBoundaries.length + 1}">Notengrenzen</th></tr>
          </thead>
          <tbody>
            <tr><th>${escapeHtml(resultLabel)}</th>${horizontalBoundaries.map(function (boundary) {
              return `<td>${escapeHtml(boundary.label)}</td>`;
            }).join("")}</tr>
            <tr><th>Ab Prozent</th>${horizontalBoundaries.map(function (boundary) {
              return `<td>${formatNumberDe(boundary.minPercent, 1)}%</td>`;
            }).join("")}</tr>
            <tr><th>Ab Punktzahl</th>${horizontalBoundaries.map(function (boundary) {
              return `<td>${formatPointValue(roundDownToHalf((boundary.minPercent / 100) * totals.maxRegular))}</td>`;
            }).join("")}</tr>
          </tbody>
        </table>
      </section>
    `;
  }

  function renderPrintPagesMarkup(exam, student, documentData, scheme, options) {
    var renderOptions = Object.assign({ exam: exam }, options || {});
    return documentData.pages.map(function (pageRows, pageIndex) {
      return `<section class="print-sheet-page">
        ${renderPrintHeader(exam, student, pageIndex, documentData.pages.length)}
        <div class="print-work-list">
          ${pageRows.map(function (row) {
            return renderPrintRow(row, renderOptions);
          }).join("")}
        </div>
        ${pageIndex === documentData.pages.length - 1 ? renderPrintSummary(exam, student, documentData.totals, scheme) : ""}
      </section>`;
    }).join("");
  }

  function getPrintRowPageIndex(pages, rowKey) {
    var result = -1;
    pages.some(function (pageRows, pageIndex) {
      var found = pageRows.some(function (row) {
        return row.rowKey === rowKey;
      });
      if (found) {
        result = pageIndex;
      }
      return found;
    });
    return result;
  }

  function renderPrintLayoutInspector(exam, previewStudent, documentData, selectedRowKey) {
    if (!documentData.rows.length) {
      return `
        <aside class="subpanel print-layout-sidebar">
          <div class="print-layout-empty">
            <h3>Layouter</h3>
            <p class="muted-text">F�r die Vorschau gibt es noch keine druckbaren Elemente.</p>
          </div>
        </aside>
      `;
    }

    var selectedRow = documentData.rows.find(function (row) {
      return row.rowKey === selectedRowKey;
    }) || documentData.rows[0];
    var override = getPrintRowOverride(exam, selectedRow);
    var pageIndex = Math.max(0, getPrintRowPageIndex(documentData.pages, selectedRow.rowKey));

    return `
      <aside class="subpanel print-layout-sidebar">
        <div class="stack-gap">
          <div>
            <h3>Layouter</h3>
            <p class="muted-text">Die Einstellungen gelten f�r alle Sch�lerb�gen. Gezeigt wird ${escapeHtml(previewStudent.displayName)}.</p>
          </div>
          <dl class="compact-definition-list">
            <div><dt>Typ</dt><dd>${escapeHtml(getPrintRowTypeLabel(selectedRow))}</dd></div>
            <div><dt>Element</dt><dd>${escapeHtml(getPrintRowLabel(selectedRow))}</dd></div>
            <div><dt>Vorschauseite</dt><dd>${pageIndex + 1} / ${documentData.pages.length}</dd></div>
            <div><dt>Geerbter Rahmen</dt><dd>${escapeHtml(getPrintBorderLabel(selectedRow.frameStyle || "none"))}</dd></div>
          </dl>
        </div>

        <label class="field-group">
          <span>Rahmen</span>
          <select data-print-layout-field="borderStyle" data-row-key="${escapeHtml(selectedRow.rowKey)}">
            ${PRINT_BORDER_OPTIONS.map(function (option) {
              return `<option value="${option.value}"${attrSelected(override.borderStyle === option.value)}>${escapeHtml(option.label)}</option>`;
            }).join("")}
          </select>
        </label>

        <div class="print-layout-metric-grid">
          <label class="field-group"><span>Padding oben (mm)</span><input type="number" step="0.5" min="0" max="16" value="${escapeHtml(formatPrintMetricInput(override.paddingTop))}" data-print-layout-field="paddingTop" data-row-key="${escapeHtml(selectedRow.rowKey)}" /></label>
          <label class="field-group"><span>Padding unten (mm)</span><input type="number" step="0.5" min="0" max="16" value="${escapeHtml(formatPrintMetricInput(override.paddingBottom))}" data-print-layout-field="paddingBottom" data-row-key="${escapeHtml(selectedRow.rowKey)}" /></label>
          <label class="field-group"><span>Margin oben (mm)</span><input type="number" step="0.5" min="-8" max="16" value="${escapeHtml(formatPrintMetricInput(override.marginTop))}" data-print-layout-field="marginTop" data-row-key="${escapeHtml(selectedRow.rowKey)}" /></label>
          <label class="field-group"><span>Margin unten (mm)</span><input type="number" step="0.5" min="-8" max="16" value="${escapeHtml(formatPrintMetricInput(override.marginBottom))}" data-print-layout-field="marginBottom" data-row-key="${escapeHtml(selectedRow.rowKey)}" /></label>
        </div>

        <label class="inline-checkbox print-layout-break-toggle">
          <span>Seitenumbruch nach diesem Element</span>
          <input type="checkbox" data-print-layout-field="breakAfter" data-row-key="${escapeHtml(selectedRow.rowKey)}"${attrChecked(override.breakAfter)} />
        </label>

        <div class="inline-actions wrap-actions">
          <button type="button" class="secondary-button" data-action="reset-print-row-layout" data-row-key="${escapeHtml(selectedRow.rowKey)}">Element zur�cksetzen</button>
        </div>
      </aside>
    `;
  }

  function renderPrintLayoutView(exam) {
    var students = getActiveStudents(exam);
    var scheme = resolveGradeScheme(exam.metadata);
    var previewStudentId = getPrintPreviewStudentId(exam);
    var previewStudent = students.find(function (student) {
      return student.id === previewStudentId;
    }) || students[0] || null;

    if (!previewStudent) {
      return `
        <section class="panel stack-gap print-layout-view">
          <div class="panel-header">
            <div>
              <h2>Druckvorschau</h2>
              <p class="muted-text">Lege zuerst mindestens einen aktiven Sch�ler an, damit die Vorschau aufgebaut werden kann.</p>
            </div>
          </div>
          <div class="print-layout-empty">
            <p class="muted-text">Ohne aktiven Sch�ler kann der Layouter keine Seite rendern.</p>
          </div>
        </section>
      `;
    }

    var documentData = buildPrintDocumentForStudent(exam, previewStudent);
    var selectedRowKey = documentData.rows.some(function (row) {
      return row.rowKey === ui.printPreviewSelectedRowKey;
    })
      ? ui.printPreviewSelectedRowKey
      : (documentData.rows[0] ? documentData.rows[0].rowKey : "");

    return `
      <section class="panel stack-gap print-layout-view">
        <div class="panel-header print-layout-header">
          <div>
            <h2>Druckvorschau</h2>
            <p class="muted-text">Interaktiver Layouter f�r den ersten Beispielbogen. Hier setzt du manuelle Umbr�che und Feinabst�nde.</p>
            <p class="small-help">Die Einstellungen gelten global f�r alle Sch�ler. Die eigentliche Sammelausgabe bleibt im Tab "Druck".</p>
          </div>
          <div class="inline-actions wrap-actions">
            <label class="field-group print-layout-student-field">
              <span>Vorschau-Sch�ler</span>
              <select data-print-layout-field="previewStudentId">
                ${students.map(function (student) {
                  return `<option value="${student.id}"${attrSelected(student.id === previewStudent.id)}>${escapeHtml(student.displayName)}</option>`;
                }).join("")}
              </select>
            </label>
            <button type="button" class="secondary-button" data-action="switch-tab" data-tab="print">Zur Druckansicht</button>
            <button type="button" class="primary-button" data-action="print-from-layout">Sammel-PDF drucken</button>
          </div>
        </div>
        <div class="print-layout-shell">
          <div class="print-layout-preview print-live-preview">
            <div class="print-document">
              ${renderPrintPagesMarkup(exam, previewStudent, documentData, scheme, {
                selectable: true,
                selectedRowKey: selectedRowKey,
                showBreakMarkers: true
              })}
            </div>
          </div>
          ${renderPrintLayoutInspector(exam, previewStudent, documentData, selectedRowKey)}
        </div>
      </section>
    `;
  }

  function renderPrintView(exam) {
    var students = getActiveStudents(exam);
    var scheme = resolveGradeScheme(exam.metadata);

    return `
      <section class="panel stack-gap print-panel print-live-preview">
        <div class="panel-header no-print">
          <div>
            <h2>Druckansicht</h2>
            <p class="muted-text">Druckfertige Sammelausgabe. Feinjustierung f�r Umbr�che und Abst�nde erfolgt in der Druckvorschau.</p>
            <p class="small-help">Browser-Kopf- und Fu�zeilen wie Datum oder Dateiname werden vom Browser gesteuert und m�ssen im Druckdialog deaktiviert werden.</p>
          </div>
          <div class="inline-actions wrap-actions">
            <button type="button" class="secondary-button" data-action="switch-tab" data-tab="printLayout">Druckvorschau �ffnen</button>
            <button type="button" class="primary-button" data-action="print">Sammel-PDF drucken</button>
          </div>
        </div>
        <div class="print-document">
          ${students.map(function (student) {
            return renderPrintPagesMarkup(exam, student, buildPrintDocumentForStudent(exam, student), scheme, {
              selectable: false,
              showBreakMarkers: false
            });
          }).join("")}
        </div>
      </section>
    `;
  }
'@
$content = Replace-Between $content '  function getPrintSchemeLabel(metadata) {' '  function renderModal() {' ($printBlock + "`r`n")

$layoutUpdateBlock = @'
  function updateNodeImageWidth(nodeId, imageIndex, nextWidth) {
    mutateCurrentExam(function (exam) {
      exam.structure = exam.structure.map(function (node) {
        if (node.id !== nodeId) {
          return node;
        }
        var copy = deepClone(node);
        copy.richContent = updateImageWidthInContent(copy.richContent || "", imageIndex, nextWidth);
        return copy;
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function triggerBrowserPrint() {
    var previousTitle = document.title;
    var currentExam = getCurrentExam();
    document.title = currentExam ? (currentExam.metadata.title || "") : "";
    window.print();
    window.setTimeout(function () {
      document.title = previousTitle;
    }, 300);
  }

  function updatePrintPreviewStudent(studentId) {
    mutateCurrentExam(function (exam) {
      exam.printLayout = getPrintLayout(exam);
      exam.printLayout.previewStudentId = studentId || "";
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function updatePrintRowLayout(rowKey, field, value, checked) {
    mutateCurrentExam(function (exam) {
      var layout = getPrintLayout(exam);
      var override = normalizePrintRowOverride(layout.rowOverrides[rowKey]);

      if (field === "breakAfter") {
        override.breakAfter = !!checked;
      } else if (field === "borderStyle") {
        override.borderStyle = value || "default";
      } else if (field === "marginTop" || field === "marginBottom") {
        override[field] = normalizePrintMetric(value, -8, 16);
      } else if (field === "paddingTop" || field === "paddingBottom") {
        override[field] = normalizePrintMetric(value, 0, 16);
      }

      if (isDefaultPrintRowOverride(override)) {
        delete layout.rowOverrides[rowKey];
      } else {
        layout.rowOverrides[rowKey] = override;
      }

      exam.printLayout = layout;
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function resetPrintRowLayout(rowKey) {
    mutateCurrentExam(function (exam) {
      var layout = getPrintLayout(exam);
      delete layout.rowOverrides[rowKey];
      exam.printLayout = layout;
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }
'@
$content = Replace-Between $content '  function updateNodeImageWidth(nodeId, imageIndex, nextWidth) {' '  function handleCreateExam() {' $layoutUpdateBlock

$content = Replace-Literal $content @"
      case "print":
        (function () {
          var previousTitle = document.title;
          document.title = getCurrentExam() ? (getCurrentExam().metadata.title || "") : "";
          window.print();
          window.setTimeout(function () {
            document.title = previousTitle;
          }, 300);
        })();
        break;
"@ @"
      case "select-print-row":
        ui.printPreviewSelectedRowKey = target.dataset.rowKey || null;
        render();
        break;
      case "print":
        triggerBrowserPrint();
        break;
      case "print-from-layout":
        ui.activeTab = "print";
        render();
        window.setTimeout(triggerBrowserPrint, 50);
        break;
      case "reset-print-row-layout":
        ui.printPreviewSelectedRowKey = target.dataset.rowKey || null;
        resetPrintRowLayout(target.dataset.rowKey || "");
        break;
"@

$content = Replace-Literal $content @"
    if (target.matches("[data-node-id][data-node-field]")) {
      updateNodeField(target.dataset.nodeId, target.dataset.nodeField, target.value, target.checked);
      return;
    }
"@ @"
    if (target.matches("[data-node-id][data-node-field]")) {
      updateNodeField(target.dataset.nodeId, target.dataset.nodeField, target.value, target.checked);
      return;
    }

    if (target.matches("[data-print-layout-field]")) {
      if (target.dataset.printLayoutField === "previewStudentId") {
        updatePrintPreviewStudent(target.value);
      } else {
        ui.printPreviewSelectedRowKey = target.dataset.rowKey || ui.printPreviewSelectedRowKey;
        updatePrintRowLayout(target.dataset.rowKey || "", target.dataset.printLayoutField, target.value, target.checked);
      }
      return;
    }
"@

[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($true))
Write-Output 'Updated app.js with print layout editor.'
