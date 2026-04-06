(function () {
  "use strict";

  var STORAGE_KEY = "klausurbewertung.nobuild.v1";
  var fallbackStorageValue = null;

  var gradePresets = {
    sek1: {
      label: "Sek I (1 bis 6)",
      scaleType: "grade",
      boundaries: [
        { label: "1", minPercent: 87.5 },
        { label: "2", minPercent: 75 },
        { label: "3", minPercent: 62.5 },
        { label: "4", minPercent: 50 },
        { label: "5", minPercent: 25 },
        { label: "6", minPercent: 0 }
      ]
    },
    oberstufe: {
      label: "Gymnasiale Oberstufe (0 bis 15 Punkte)",
      scaleType: "points",
      boundaries: [
        { label: "15", minPercent: 95 },
        { label: "14", minPercent: 90 },
        { label: "13", minPercent: 85 },
        { label: "12", minPercent: 80 },
        { label: "11", minPercent: 75 },
        { label: "10", minPercent: 70 },
        { label: "9", minPercent: 65 },
        { label: "8", minPercent: 60 },
        { label: "7", minPercent: 55 },
        { label: "6", minPercent: 50 },
        { label: "5", minPercent: 45 },
        { label: "4", minPercent: 40 },
        { label: "3", minPercent: 33 },
        { label: "2", minPercent: 27 },
        { label: "1", minPercent: 20 },
        { label: "0", minPercent: 0 }
      ]
    },
    symbol: {
      label: "++ / + / o / - / --",
      scaleType: "symbol",
      boundaries: [
        { label: "++", minPercent: 87.5 },
        { label: "+", minPercent: 75 },
        { label: "o", minPercent: 62.5 },
        { label: "-", minPercent: 50 },
        { label: "--", minPercent: 0 }
      ]
    }
  };

  function createId(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 10);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function deepClone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(value) {
    if (!value) {
      return "";
    }
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat("de-DE").format(date);
  }

  function sortBySortIndex(items) {
    return items.slice().sort(function (a, b) {
      if (a.sortIndex !== b.sortIndex) {
        return a.sortIndex - b.sortIndex;
      }
      return String(a.title || "").localeCompare(String(b.title || ""), "de");
    });
  }

  function clonePresetBoundaries(presetId) {
    return gradePresets[presetId].boundaries.map(function (boundary) {
      return {
        id: createId("grade"),
        label: boundary.label,
        minPercent: boundary.minPercent
      };
    });
  }

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

  function createEmptyStore() {
    return {
      version: 1,
      currentExamId: null,
      exams: [],
      taskBlockLibrary: [],
      classListLibrary: []
    };
  }

  function createDemoStructure() {
    var section1 = createId("node");
    var task1 = createId("node");
    var task1a = createId("node");
    var task1b = createId("node");
    var task2 = createId("node");
    var task2a = createId("node");
    var criterion1 = createId("node");
    var criterion2 = createId("node");
    var criterion3 = createId("node");
    var criterion4 = createId("node");

    return [
      {
        id: section1,
        type: "block",
        parentId: null,
        sortIndex: 0,
        title: "Hilfsmittelfreier Teil",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        isScorable: false,
        showSum: true,
        isHeading: true
      },
      {
        id: task1,
        type: "block",
        parentId: section1,
        sortIndex: 1,
        title: "Aufgabe 1",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        isScorable: false,
        showSum: true,
        isHeading: true
      },
      {
        id: task1a,
        type: "block",
        parentId: task1,
        sortIndex: 2,
        title: "a)",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        isScorable: false,
        showSum: false,
        isHeading: false
      },
      {
        id: criterion1,
        type: "criterion",
        parentId: task1a,
        sortIndex: 3,
        title: "Rechenweg nachvollziehbar",
        shortLabel: "",
        richContent: "Alle Zwischenschritte sind sauber notiert.",
        printVisibility: "always",
        maxPoints: 3,
        isBonus: false,
        isScorable: true,
        variantScope: []
      },
      {
        id: task1b,
        type: "block",
        parentId: task1,
        sortIndex: 4,
        title: "b)",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        isScorable: false,
        showSum: false,
        isHeading: false
      },
      {
        id: criterion2,
        type: "criterion",
        parentId: task1b,
        sortIndex: 5,
        title: "Ergebnis korrekt",
        shortLabel: "",
        richContent: "Das Endergebnis stimmt vollständig.",
        printVisibility: "always",
        maxPoints: 2,
        isBonus: false,
        isScorable: true,
        variantScope: []
      },
      {
        id: task2,
        type: "block",
        parentId: null,
        sortIndex: 6,
        title: "Aufgabe 2",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        isScorable: false,
        showSum: true,
        isHeading: true
      },
      {
        id: task2a,
        type: "block",
        parentId: task2,
        sortIndex: 7,
        title: "a)",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        isScorable: false,
        showSum: false,
        isHeading: false
      },
      {
        id: criterion3,
        type: "criterion",
        parentId: task2a,
        sortIndex: 8,
        title: "Skizze und Ansatz",
        shortLabel: "",
        richContent: "Geeignete Skizze mit passenden Bezeichnungen.",
        printVisibility: "always",
        maxPoints: 4,
        isBonus: false,
        isScorable: true,
        variantScope: []
      },
      {
        id: criterion4,
        type: "criterion",
        parentId: task2a,
        sortIndex: 9,
        title: "Bonus: eleganter Lösungsweg",
        shortLabel: "",
        richContent: "Alternative oder besonders effiziente Lösungsidee.",
        printVisibility: "always",
        maxPoints: 1,
        isBonus: true,
        isScorable: true,
        variantScope: []
      }
    ];
  }

  function createBlankExam() {
    var createdAt = nowIso();
    return {
      metadata: {
        id: createId("exam"),
        title: "Neue Klausur",
        schuljahr: "",
        fach: "",
        kursOderKlasse: "",
        termin: "",
        arbeitsNummer: "",
        thema: "",
        lehrkraft: "",
        lehrkraftKuerzel: "",
        resultLabel: getDefaultResultLabel("sek1"),
        notenschluesselPreset: "sek1",
        benutzerdefinierteNotengrenzen: clonePresetBoundaries("sek1"),
        anzahlHilfsmittelfreierAufgaben: "",
        aktivierteVarianten: ["A", "B"],
        createdAt: createdAt,
        updatedAt: createdAt
      },
      students: [],
      structure: [],
      evaluations: {}
    };
  }

  function createDemoExam() {
    var createdAt = nowIso();
    return {
      metadata: {
        id: createId("exam"),
        title: "Demo-Klausur",
        schuljahr: "2025/2026",
        fach: "Mathematik",
        kursOderKlasse: "5G1",
        termin: createdAt.slice(0, 10),
        arbeitsNummer: "1",
        thema: "Terme und Geometrie",
        lehrkraft: "Lehrkraft",
        lehrkraftKuerzel: "LKR",
        resultLabel: getDefaultResultLabel("sek1"),
        notenschluesselPreset: "sek1",
        benutzerdefinierteNotengrenzen: clonePresetBoundaries("sek1"),
        anzahlHilfsmittelfreierAufgaben: 1,
        aktivierteVarianten: ["A", "B"],
        createdAt: createdAt,
        updatedAt: createdAt
      },
      students: [
        {
          id: createId("student"),
          vorname: "Anna",
          nachname: "Beispiel",
          displayName: "Anna Beispiel",
          variante: "A",
          aktiv: true,
          sortIndex: 0
        },
        {
          id: createId("student"),
          vorname: "Ben",
          nachname: "Muster",
          displayName: "Ben Muster",
          variante: "B",
          aktiv: true,
          sortIndex: 1
        }
      ],
      structure: createDemoStructure(),
      evaluations: {}
    };
  }

  function safeGetStorage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return fallbackStorageValue;
    }
  }

  function safeSetStorage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      fallbackStorageValue = value;
    }
  }

  function sanitizeStore(candidate) {
    var store = candidate && typeof candidate === "object" ? candidate : createEmptyStore();
    var exams = Array.isArray(store.exams) ? store.exams : [];
    var currentExamId = exams.some(function (exam) {
      return exam && exam.metadata && exam.metadata.id === store.currentExamId;
    })
      ? store.currentExamId
      : exams.length
        ? exams[0].metadata.id
        : null;

    return {
      version: 1,
      currentExamId: currentExamId,
      exams: exams,
      taskBlockLibrary: Array.isArray(store.taskBlockLibrary) ? store.taskBlockLibrary : [],
      classListLibrary: Array.isArray(store.classListLibrary) ? store.classListLibrary : []
    };
  }

  function loadStore() {
    var raw = safeGetStorage();
    if (!raw) {
      var demo = createDemoExam();
      return {
        version: 1,
        currentExamId: demo.metadata.id,
        exams: [demo],
        taskBlockLibrary: [],
        classListLibrary: []
      };
    }
    try {
      return sanitizeStore(JSON.parse(raw));
    } catch (error) {
      return createEmptyStore();
    }
  }

  function saveStore() {
    safeSetStorage(JSON.stringify(store));
  }

  function getCurrentExam() {
    for (var index = 0; index < store.exams.length; index += 1) {
      if (store.exams[index].metadata.id === store.currentExamId) {
        return store.exams[index];
      }
    }
    return null;
  }

  function evaluationKey(studentId, criterionId) {
    return studentId + "::" + criterionId;
  }

  function roundDownToHalf(value) {
    return Math.floor(Math.max(Number(value) || 0, 0) * 2) / 2;
  }

  function normalizePointsInput(value, maxPoints) {
    var safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    var rounded = Math.round(safeValue * 2) / 2;
    return Math.max(0, Math.min(rounded, maxPoints));
  }

  function percentToPoints(percent, maxPoints) {
    var safePercent = Number.isFinite(Number(percent)) ? Math.max(Number(percent), 0) : 0;
    return Math.min(roundDownToHalf((safePercent / 100) * maxPoints), maxPoints);
  }

  function pointsToPercent(points, maxPoints) {
    if (!(maxPoints > 0)) {
      return 0;
    }
    return Number(((points / maxPoints) * 100).toFixed(2));
  }

  function normalizeBoundaries(boundaries) {
    return boundaries
      .map(function (boundary) {
        return {
          id: boundary.id || createId("grade"),
          label: String(boundary.label || ""),
          minPercent: Number(boundary.minPercent) || 0
        };
      })
      .sort(function (a, b) {
        return b.minPercent - a.minPercent;
      });
  }

  function resolveGradeScheme(metadata) {
    if (metadata.notenschluesselPreset === "custom") {
      return {
        label: "Benutzerdefiniert",
        scaleType: "grade",
        boundaries: normalizeBoundaries(metadata.benutzerdefinierteNotengrenzen)
      };
    }

    return {
      label: gradePresets[metadata.notenschluesselPreset].label,
      scaleType: gradePresets[metadata.notenschluesselPreset].scaleType,
      boundaries: normalizeBoundaries(
        metadata.benutzerdefinierteNotengrenzen && metadata.benutzerdefinierteNotengrenzen.length
          ? metadata.benutzerdefinierteNotengrenzen
          : clonePresetBoundaries(metadata.notenschluesselPreset)
      )
    };
  }

  function getResultLabel(metadata) {
    return metadata && metadata.resultLabel ? metadata.resultLabel : getDefaultResultLabel(metadata ? metadata.notenschluesselPreset : "custom");
  }

  function getNodeIsHeading(node) {
    if (!node || node.type === "criterion") {
      return false;
    }
    if (typeof node.isHeading === "boolean") {
      return node.isHeading;
    }
    return node.type === "section" || node.type === "task" || node.type === "headingOnly";
  }

  function getNodeShowSum(node) {
    if (!node || node.type === "criterion") {
      return false;
    }
    if (typeof node.showSum === "boolean") {
      return node.showSum;
    }
    return node.type === "section" || node.type === "task";
  }

  function getNodeBorderStyle(node) {
    if (!node || node.type === "criterion") {
      return "none";
    }
    return node.borderStyle || "none";
  }

  function isCriterionNode(node) {
    return !!(node && node.type === "criterion" && node.isScorable);
  }

  function isBlockNode(node) {
    return !!node && node.type !== "spacer" && !isCriterionNode(node);
  }

  function getGradeFromPercent(percent, metadata) {
    var boundaries = resolveGradeScheme(metadata).boundaries;
    for (var index = 0; index < boundaries.length; index += 1) {
      if (percent >= boundaries[index].minPercent) {
        return boundaries[index].label;
      }
    }
    return boundaries.length ? boundaries[boundaries.length - 1].label : "";
  }

  function getChildrenMap(nodes) {
    var map = {};
    sortBySortIndex(nodes).forEach(function (node) {
      var key = node.parentId || "__root__";
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(node);
    });
    return map;
  }

  function flattenStructure(nodes) {
    var childrenMap = getChildrenMap(nodes);
    var result = [];

    function visit(parentId, depth) {
      var key = parentId || "__root__";
      var children = childrenMap[key] || [];
      children.forEach(function (child) {
        result.push(Object.assign({}, child, { depth: depth }));
        visit(child.id, depth + 1);
      });
    }

    visit(null, 0);
    return result;
  }

  function getCriterionNodes(nodes) {
    return flattenStructure(nodes).filter(function (node) {
      return node.isScorable && node.type === "criterion";
    });
  }

  function getCriterionById(nodes, criterionId) {
    return nodes.find(function (node) {
      return node.id === criterionId && node.isScorable;
    });
  }

  function getDescendantCriterionIds(nodes, parentId) {
    var childrenMap = getChildrenMap(nodes);
    var result = [];

    function visit(nodeId) {
      var children = childrenMap[nodeId] || [];
      children.forEach(function (child) {
        if (child.isScorable && child.type === "criterion") {
          result.push(child.id);
        }
        visit(child.id);
      });
    }

    visit(parentId);
    return result;
  }
  function getStudentTotals(exam, studentId) {
    var criteria = getCriterionNodes(exam.structure);
    var regularAchieved = 0;
    var bonusAchieved = 0;
    var maxRegular = 0;

    criteria.forEach(function (criterion) {
      var entry = exam.evaluations[evaluationKey(studentId, criterion.id)];
      var achievedPoints = entry ? Number(entry.achievedPoints) || 0 : 0;
      if (criterion.isBonus) {
        bonusAchieved += achievedPoints;
      } else {
        regularAchieved += achievedPoints;
        maxRegular += Number(criterion.maxPoints) || 0;
      }
    });

    var totalAchieved = regularAchieved + bonusAchieved;
    var percent = maxRegular > 0 ? Number(((totalAchieved / maxRegular) * 100).toFixed(2)) : 0;

    return {
      regularAchieved: Number(regularAchieved.toFixed(2)),
      bonusAchieved: Number(bonusAchieved.toFixed(2)),
      totalAchieved: Number(totalAchieved.toFixed(2)),
      maxRegular: Number(maxRegular.toFixed(2)),
      percent: percent,
      gradeLabel: getGradeFromPercent(percent, exam.metadata)
    };
  }

  function getNodeTotalsForStudent(exam, nodeId, studentId) {
    var node = exam.structure.find(function (entry) {
      return entry.id === nodeId;
    });
    if (!node) {
      return { achieved: 0, max: 0 };
    }

    var criterionIds = node.isScorable && node.type === "criterion"
      ? [nodeId]
      : getDescendantCriterionIds(exam.structure, nodeId);

    return criterionIds.reduce(function (accumulator, criterionId) {
      var criterion = getCriterionById(exam.structure, criterionId);
      if (!criterion) {
        return accumulator;
      }
      var achieved = exam.evaluations[evaluationKey(studentId, criterionId)]
        ? Number(exam.evaluations[evaluationKey(studentId, criterionId)].achievedPoints) || 0
        : 0;
      accumulator.achieved += achieved;
      accumulator.max += criterion.isBonus ? 0 : Number(criterion.maxPoints) || 0;
      return accumulator;
    }, { achieved: 0, max: 0 });
  }

  function summarizeExam(exam) {
    var activeStudents = sortBySortIndex(exam.students).filter(function (student) {
      return student.aktiv;
    });
    var studentSummaries = activeStudents.map(function (student) {
      return {
        student: student,
        totals: getStudentTotals(exam, student.id)
      };
    });
    var scheme = resolveGradeScheme(exam.metadata);
    var distribution = {};
    scheme.boundaries.forEach(function (boundary) {
      distribution[boundary.label] = 0;
    });
    studentSummaries.forEach(function (entry) {
      distribution[entry.totals.gradeLabel] = (distribution[entry.totals.gradeLabel] || 0) + 1;
    });

    var averagePercent = 0;
    if (studentSummaries.length) {
      averagePercent = Number((studentSummaries.reduce(function (sum, entry) {
        return sum + entry.totals.percent;
      }, 0) / studentSummaries.length).toFixed(2));
    }

    var maxRegularPoints = getCriterionNodes(exam.structure)
      .filter(function (criterion) {
        return !criterion.isBonus;
      })
      .reduce(function (sum, criterion) {
        return sum + (Number(criterion.maxPoints) || 0);
      }, 0);

    return {
      studentSummaries: studentSummaries,
      maxRegularPoints: maxRegularPoints,
      averagePercent: averagePercent,
      distribution: distribution,
      scheme: scheme
    };
  }

  function getPassingThreshold(metadata) {
    if (metadata.notenschluesselPreset === "oberstufe") {
      return 20;
    }
    if (metadata.notenschluesselPreset === "custom") {
      var custom = normalizeBoundaries(metadata.benutzerdefinierteNotengrenzen);
      return custom.length > 1 ? custom[custom.length - 2].minPercent : 50;
    }
    return 50;
  }

  function getHighlightState(metadata, percent) {
    if (percent == null) {
      return "missing";
    }
    var passingThreshold = getPassingThreshold(metadata);
    var boundaries = resolveGradeScheme(metadata).boundaries;
    var strongThreshold = boundaries.length > 1 ? boundaries[1].minPercent : 75;
    if (percent < passingThreshold) {
      return "weak";
    }
    if (percent >= strongThreshold) {
      return "strong";
    }
    return "normal";
  }

  function setEvaluationValue(exam, studentId, criterionId, rawValue, mode) {
    var criterion = getCriterionById(exam.structure, criterionId);
    if (!criterion) {
      return exam;
    }

    var maxPoints = Number(criterion.maxPoints) || 0;
    var numericValue = Number(String(rawValue).replace(",", "."));
    var points = mode === "percent"
      ? percentToPoints(numericValue, maxPoints)
      : normalizePointsInput(numericValue, maxPoints);

    exam.evaluations[evaluationKey(studentId, criterionId)] = {
      studentId: studentId,
      criterionId: criterionId,
      scoreModeUsedLast: mode,
      rawInputValue: String(rawValue),
      achievedPoints: points,
      derivedPercent: pointsToPercent(points, maxPoints),
      isUnset: String(rawValue).trim() === "",
      updatedAt: nowIso()
    };
    exam.metadata.updatedAt = nowIso();
    return exam;
  }

  function rescaleCriterionAfterMaxPointsChange(exam, criterionId, nextMaxPoints, mode) {
    var criterion = getCriterionById(exam.structure, criterionId);
    if (!criterion) {
      return exam;
    }

    var previousMaxPoints = Number(criterion.maxPoints) || 0;
    exam.structure = exam.structure.map(function (node) {
      if (node.id === criterionId) {
        var nextNode = Object.assign({}, node);
        nextNode.maxPoints = nextMaxPoints;
        return nextNode;
      }
      return node;
    });

    Object.keys(exam.evaluations).forEach(function (key) {
      var entry = exam.evaluations[key];
      if (entry.criterionId !== criterionId || entry.isUnset) {
        return;
      }
      var nextPoints = mode === "proportional" && previousMaxPoints > 0
        ? percentToPoints((entry.achievedPoints / previousMaxPoints) * 100, nextMaxPoints)
        : Math.min(entry.achievedPoints, nextMaxPoints);

      exam.evaluations[key] = Object.assign({}, entry, {
        achievedPoints: nextPoints,
        derivedPercent: pointsToPercent(nextPoints, nextMaxPoints),
        rawInputValue: entry.scoreModeUsedLast === "percent"
          ? String(pointsToPercent(nextPoints, nextMaxPoints))
          : String(nextPoints),
        updatedAt: nowIso()
      });
    });

    exam.metadata.updatedAt = nowIso();
    return exam;
  }

  function duplicateExamRecord(exam) {
    var structureIdMap = new Map();
    var studentIdMap = new Map();

    function mapStructureId(id) {
      if (!structureIdMap.has(id)) {
        structureIdMap.set(id, createId("node"));
      }
      return structureIdMap.get(id);
    }

    function mapStudentId(id) {
      if (!studentIdMap.has(id)) {
        studentIdMap.set(id, createId("student"));
      }
      return studentIdMap.get(id);
    }

    var duplicatedStructure = exam.structure.map(function (node) {
      var copy = deepClone(node);
      copy.id = mapStructureId(node.id);
      copy.parentId = node.parentId ? mapStructureId(node.parentId) : null;
      return copy;
    });

    var duplicatedStudents = exam.students.map(function (student) {
      var copy = deepClone(student);
      copy.id = mapStudentId(student.id);
      return copy;
    });

    var duplicatedEvaluations = {};
    Object.keys(exam.evaluations).forEach(function (key) {
      var entry = exam.evaluations[key];
      var copy = deepClone(entry);
      copy.studentId = mapStudentId(entry.studentId);
      copy.criterionId = mapStructureId(entry.criterionId);
      duplicatedEvaluations[evaluationKey(copy.studentId, copy.criterionId)] = copy;
    });

    return {
      metadata: Object.assign({}, deepClone(exam.metadata), {
        id: createId("exam"),
        title: (exam.metadata.title || "Klausur") + " (Kopie)",
        createdAt: nowIso(),
        updatedAt: nowIso()
      }),
      students: duplicatedStudents,
      structure: duplicatedStructure,
      evaluations: duplicatedEvaluations
    };
  }

  function renumberSortIndices(items) {
    return items.map(function (item, index) {
      var copy = deepClone(item);
      copy.sortIndex = index;
      return copy;
    });
  }

  function parseCsvLine(line, delimiter) {
    var result = [];
    var current = "";
    var insideQuotes = false;

    for (var index = 0; index < line.length; index += 1) {
      var character = line[index];
      var nextCharacter = line[index + 1];
      if (character === '"') {
        if (insideQuotes && nextCharacter === '"') {
          current += '"';
          index += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
        continue;
      }
      if (character === delimiter && !insideQuotes) {
        result.push(current.trim());
        current = "";
        continue;
      }
      current += character;
    }

    result.push(current.trim());
    return result;
  }

  function parseStudentCsv(text) {
    var lines = String(text)
      .split(/\r?\n/)
      .map(function (line) { return line.trim(); })
      .filter(Boolean);

    if (!lines.length) {
      return [];
    }

    var delimiter = lines[0].indexOf(";") >= 0 ? ";" : ",";
    var headers = parseCsvLine(lines[0], delimiter).map(function (header) {
      return header.toLowerCase();
    });
    var firstNameIndex = headers.findIndex(function (header) {
      return header.indexOf("vorname") >= 0;
    });
    var lastNameIndex = headers.findIndex(function (header) {
      return header.indexOf("nachname") >= 0;
    });

    if (firstNameIndex === -1 || lastNameIndex === -1) {
      throw new Error("CSV konnte nicht gelesen werden. Erwartet werden die Spalten Vorname und Nachname.");
    }

    return lines.slice(1).reduce(function (students, line, index) {
      var columns = parseCsvLine(line, delimiter);
      var firstName = columns[firstNameIndex] ? columns[firstNameIndex].trim() : "";
      var lastName = columns[lastNameIndex] ? columns[lastNameIndex].trim() : "";
      if (!firstName && !lastName) {
        return students;
      }
      students.push({
        id: createId("student"),
        vorname: firstName,
        nachname: lastName,
        displayName: (firstName + " " + lastName).trim(),
        variante: "",
        aktiv: true,
        sortIndex: index
      });
      return students;
    }, []);
  }

  function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(reader.error || new Error("Datei konnte nicht gelesen werden."));
      };
      reader.readAsText(file);
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(reader.error || new Error("Bild konnte nicht gelesen werden."));
      };
      reader.readAsDataURL(file);
    });
  }

  function downloadTextFile(fileName, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportExamPayload(exam) {
    return JSON.stringify(exam, null, 2);
  }

  function importExamPayload(raw) {
    var parsed = JSON.parse(raw);
    if (!parsed || !parsed.metadata || !parsed.metadata.id || !Array.isArray(parsed.students) || !Array.isArray(parsed.structure)) {
      throw new Error("Die JSON-Datei ist kein gültiger Klausurexport.");
    }
    return parsed;
  }

  function collectTaskBlockNodes(structure, nodeId) {
    if (!nodeId) {
      return deepClone(structure);
    }
    var ids = new Set([nodeId]);
    var changed = true;
    while (changed) {
      changed = false;
      structure.forEach(function (node) {
        if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
          ids.add(node.id);
          changed = true;
        }
      });
    }
    return structure.filter(function (node) {
      return ids.has(node.id);
    }).map(function (node) {
      return deepClone(node);
    });
  }

  function createTaskBlockTemplate(name, nodes) {
    return {
      id: createId("block"),
      name: name,
      createdAt: nowIso(),
      nodes: nodes
    };
  }

  function createClassListTemplate(name, students) {
    return {
      id: createId("classlist"),
      name: name,
      createdAt: nowIso(),
      students: students.map(function (student) {
        return {
          vorname: student.vorname,
          nachname: student.nachname,
          displayName: student.displayName,
          variante: student.variante || "",
          aktiv: student.aktiv !== false
        };
      })
    };
  }

  function applyTaskBlockToExam(exam, template) {
    var idMap = new Map();
    var includedIds = new Set(template.nodes.map(function (node) { return node.id; }));

    function mapId(id) {
      if (!idMap.has(id)) {
        idMap.set(id, createId("node"));
      }
      return idMap.get(id);
    }

    var offset = exam.structure.length;
    var appended = template.nodes.map(function (node, index) {
      var copy = deepClone(node);
      copy.id = mapId(node.id);
      copy.parentId = node.parentId && includedIds.has(node.parentId) ? mapId(node.parentId) : null;
      copy.sortIndex = offset + index;
      return copy;
    });

    exam.structure = exam.structure.concat(appended);
    exam.metadata.updatedAt = nowIso();
    return exam;
  }

  function reorderLinear(list, sourceId, targetId) {
    var ordered = sortBySortIndex(list);
    var sourceIndex = ordered.findIndex(function (node) { return node.id === sourceId; });
    var targetIndex = ordered.findIndex(function (node) { return node.id === targetId; });
    if (sourceIndex === -1 || targetIndex === -1) {
      return list;
    }
    var next = ordered.slice();
    var item = next.splice(sourceIndex, 1)[0];
    next.splice(targetIndex, 0, item);
    return renumberSortIndices(next);
  }

  var store = loadStore();
  var ui = {
    activeTab: store.exams.length ? "overview" : "archive",
    scoreMode: "points",
    notice: "",
    pendingMaxChange: null,
    draggedNodeId: null,
    matrixFocus: null,
    imageResize: null
  };

  var appRoot = document.getElementById("app");
  function attrSelected(condition) {
    return condition ? " selected" : "";
  }

  function attrChecked(condition) {
    return condition ? " checked" : "";
  }

  function parseImageMeta(rawAlt) {
    var text = String(rawAlt || "");
    var match = text.match(/^(.*?)(?:\|w=(\d+))?$/);
    return {
      alt: match ? match[1] : text,
      width: match && match[2] ? Number(match[2]) || null : null
    };
  }

  function buildImageMetaText(alt, width) {
    var cleanAlt = String(alt || "").trim();
    var roundedWidth = Math.max(48, Math.round(Number(width) || 0));
    return roundedWidth ? (cleanAlt ? cleanAlt + "|w=" + roundedWidth : "|w=" + roundedWidth) : cleanAlt;
  }

  function renderImageMarkup(rawAlt, src, options) {
    var meta = parseImageMeta(rawAlt);
    var widthStyle = meta.width ? ` style="width:${meta.width}px"` : "";
    var imageHtml = `<img alt="${meta.alt}" src="${src}"${widthStyle} />`;

    if (options && options.editableImages && options.nodeId) {
      var imageIndex = options.imageIndexCounter || 0;
      options.imageIndexCounter = imageIndex + 1;
      return `<span class="markdown-image-shell" data-node-id="${options.nodeId}" data-image-index="${imageIndex}"><span class="markdown-image-frame">${imageHtml}<button type="button" class="markdown-image-resize-handle" data-role="resize-image" data-node-id="${options.nodeId}" data-image-index="${imageIndex}" aria-label="Bildgröße ändern"></button></span></span>`;
    }

    return imageHtml;
  }

  function renderInlineMarkdown(text, options) {
    return String(text)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, altText, src) {
        return renderImageMarkup(altText, src, options);
      })
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\$([^$\n]+)\$/g, '<span class="math-inline">$1</span>')
      .replace(/\n/g, "<br />");
  }

  function renderMarkdown(content, options) {
    if (!content || !String(content).trim()) {
      return '<span class="muted-text">Kein Inhalt</span>';
    }

    var renderOptions = Object.assign({ imageIndexCounter: 0 }, options || {});
    var escaped = escapeHtml(String(content)).replace(/\r\n/g, "\n");
    escaped = escaped.replace(/\$\$([\s\S]+?)\$\$/g, function (_, formula) {
      return "\n<div class=\"math-block\">" + formula.trim() + "</div>\n";
    });

    var blocks = escaped.split(/\n{2,}/).map(function (block) {
      return block.trim();
    }).filter(Boolean);

    return blocks.map(function (block) {
      if (block.indexOf('<div class="math-block">') === 0) {
        return block;
      }
      if (/^#{1,6}\s/.test(block)) {
        var level = block.match(/^#+/)[0].length;
        var headingText = block.replace(/^#{1,6}\s*/, "");
        return "<h" + level + ">" + renderInlineMarkdown(headingText, renderOptions) + "</h" + level + ">";
      }
      var lines = block.split("\n");
      var isList = lines.every(function (line) {
        return /^[-*]\s+/.test(line.trim());
      });
      if (isList) {
        return "<ul>" + lines.map(function (line) {
          return "<li>" + renderInlineMarkdown(line.replace(/^[-*]\s+/, ""), renderOptions) + "</li>";
        }).join("") + "</ul>";
      }
      return "<p>" + renderInlineMarkdown(block, renderOptions) + "</p>";
    }).join("");
  }

  function getActiveStudents(exam) {
    return sortBySortIndex(exam.students).filter(function (student) {
      return student.aktiv;
    });
  }

  function renderTopBar(exam) {
    return `
      <header class="topbar">
        <div>
          <h1>Klausurbewertung</h1>
          <p class="muted-text">Lokal-first, statisch und direkt über index.html lauffähig.</p>
        </div>
        <div class="inline-actions wrap-actions">
          ${exam ? `<strong>${escapeHtml(exam.metadata.title || "Neue Klausur")}</strong>` : ""}
          <button type="button" class="secondary-button" data-action="clear-archive">Archiv leeren</button>
        </div>
      </header>
    `;
  }

  function renderTabs() {
    var tabs = [
      { id: "archive", label: "Archiv" },
      { id: "overview", label: "Übersicht" },
      { id: "metadata", label: "Stammdaten" },
      { id: "students", label: "Schüler" },
      { id: "structure", label: "Erwartungshorizont" },
      { id: "matrix", label: "Matrix" },
      { id: "print", label: "Druck" }
    ];

    return `
      <nav class="tabbar no-print">
        ${tabs.map(function (tab) {
          return `<button type="button" class="${ui.activeTab === tab.id ? "tab-active" : ""}" data-action="switch-tab" data-tab="${tab.id}">${tab.label}</button>`;
        }).join("")}
      </nav>
    `;
  }

  function renderEmptyState() {
    return `
      <section class="empty-state">
        <h2>No-Build-Version bereit</h2>
        <p class="muted-text">Diese App läuft direkt lokal im Browser. Lege eine neue Klausur an oder starte mit einer Demo.</p>
        <div class="empty-state-actions">
          <button type="button" class="primary-button" data-action="create-exam">Neue Klausur</button>
          <button type="button" class="secondary-button" data-action="seed-demo">Demo laden</button>
          <label class="secondary-button file-button">
            JSON importieren
            <input type="file" data-role="import-exam" accept="application/json,.json" />
          </label>
        </div>
      </section>
    `;
  }

  function renderArchiveView() {
    return `
      <section class="panel stack-gap archive-view">
        <div class="panel-header">
          <div>
            <h2>Archiv</h2>
            <p class="muted-text">Mehrere Klausuren lokal verwalten, exportieren und duplizieren.</p>
          </div>
          <div class="inline-actions wrap-actions">
            <label class="secondary-button file-button">
              JSON importieren
              <input type="file" data-role="import-exam" accept="application/json,.json" />
            </label>
            <button type="button" class="primary-button" data-action="create-exam">Neue Klausur</button>
          </div>
        </div>
        <div class="archive-grid">
          ${store.exams.map(function (exam) {
            return `
              <article class="archive-card ${store.currentExamId === exam.metadata.id ? "archive-card-active" : ""}">
                <div class="archive-card-main" data-action="select-exam" data-exam-id="${exam.metadata.id}">
                  <h3>${escapeHtml(exam.metadata.title || "Unbenannte Klausur")}</h3>
                  <dl class="compact-definition-list">
                    <div><dt>Fach</dt><dd>${escapeHtml(exam.metadata.fach || "-")}</dd></div>
                    <div><dt>Klasse</dt><dd>${escapeHtml(exam.metadata.kursOderKlasse || "-")}</dd></div>
                    <div><dt>Termin</dt><dd>${escapeHtml(formatDate(exam.metadata.termin))}</dd></div>
                    <div><dt>Bearbeitet</dt><dd>${escapeHtml(formatDate(exam.metadata.updatedAt))}</dd></div>
                  </dl>
                </div>
                <div class="inline-actions wrap-actions">
                  <button type="button" class="secondary-button" data-action="export-exam" data-exam-id="${exam.metadata.id}">Export</button>
                  <button type="button" class="secondary-button" data-action="duplicate-exam" data-exam-id="${exam.metadata.id}">Duplizieren</button>
                  <button type="button" class="danger-button" data-action="delete-exam" data-exam-id="${exam.metadata.id}">Löschen</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderOverviewView(exam) {
    var summary = summarizeExam(exam);
    var resultLabel = getResultLabel(exam.metadata);
    return `
      <section class="panel stack-gap overview-view">
        <div class="panel-header">
          <div>
            <h2>Deckblatt und Übersicht</h2>
            <p class="muted-text">Stammdaten, Notenspiegel und Schülergesamtergebnisse.</p>
          </div>
        </div>
        <div class="overview-grid">
          <article class="subpanel">
            <h3>Stammdaten</h3>
            <dl class="compact-definition-list">
              <div><dt>Titel</dt><dd>${escapeHtml(exam.metadata.title || "-")}</dd></div>
              <div><dt>Schuljahr</dt><dd>${escapeHtml(exam.metadata.schuljahr || "-")}</dd></div>
              <div><dt>Fach</dt><dd>${escapeHtml(exam.metadata.fach || "-")}</dd></div>
              <div><dt>Klasse/Kurs</dt><dd>${escapeHtml(exam.metadata.kursOderKlasse || "-")}</dd></div>
              <div><dt>Termin</dt><dd>${escapeHtml(formatDate(exam.metadata.termin) || "-")}</dd></div>
              <div><dt>Nummer</dt><dd>${escapeHtml(exam.metadata.arbeitsNummer || "-")}</dd></div>
              <div><dt>Thema</dt><dd>${escapeHtml(exam.metadata.thema || "-")}</dd></div>
              <div><dt>Lehrkraft</dt><dd>${escapeHtml(exam.metadata.lehrkraft || "-")}</dd></div>
            </dl>
          </article>
          <article class="subpanel">
            <h3>Kennzahlen</h3>
            <dl class="compact-definition-list">
              <div><dt>Schülerzahl</dt><dd>${summary.studentSummaries.length}</dd></div>
              <div><dt>Maximalpunkte</dt><dd>${summary.maxRegularPoints.toFixed(1)}</dd></div>
              <div><dt>Durchschnitt</dt><dd>${summary.averagePercent.toFixed(2)}%</dd></div>
              <div><dt>Hilfsmittelfrei</dt><dd>${escapeHtml(String(exam.metadata.anzahlHilfsmittelfreierAufgaben || "-"))}</dd></div>
              <div><dt>Ergebnisbezeichnung</dt><dd>${escapeHtml(resultLabel)}</dd></div>
            </dl>
          </article>
        </div>
        <div class="overview-grid">
          <article class="subpanel">
            <h3>Notenspiegel</h3>
            <table class="simple-table">
              <thead><tr><th>${escapeHtml(resultLabel)}</th><th>Anzahl</th><th>ab %</th></tr></thead>
              <tbody>
                ${summary.scheme.boundaries.map(function (boundary) {
                  return `<tr><td>${escapeHtml(boundary.label)}</td><td>${summary.distribution[boundary.label] || 0}</td><td>${boundary.minPercent.toFixed(1)}%</td></tr>`;
                }).join("")}
              </tbody>
            </table>
          </article>
          <article class="subpanel">
            <h3>Schülerübersicht</h3>
            <table class="simple-table">
              <thead><tr><th>Schüler</th><th>Punkte</th><th>Bonus</th><th>Prozent</th><th>${escapeHtml(resultLabel)}</th></tr></thead>
              <tbody>
                ${summary.studentSummaries.map(function (entry) {
                  return `<tr>
                    <td>${escapeHtml(entry.student.displayName)}</td>
                    <td>${entry.totals.regularAchieved.toFixed(1)} / ${entry.totals.maxRegular.toFixed(1)}</td>
                    <td>${entry.totals.bonusAchieved.toFixed(1)}</td>
                    <td>${entry.totals.percent.toFixed(2)}%</td>
                    <td>${escapeHtml(entry.totals.gradeLabel)}</td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </article>
        </div>
      </section>
    `;
  }

  function renderMetadataView(exam) {
    var metadata = exam.metadata;
    var boundaries = resolveGradeScheme(metadata).boundaries;
    var resultLabel = getResultLabel(metadata);
    return `
      <section class="panel stack-gap metadata-view">
        <div class="panel-header">
          <div>
            <h2>Stammdaten</h2>
            <p class="muted-text">Pflichtfelder, Varianten und editierbare Notengrenzen.</p>
          </div>
        </div>
        <div class="form-grid">
          ${[
            ["title", "Titel", metadata.title || "", "text"],
            ["schuljahr", "Schuljahr", metadata.schuljahr || "", "text"],
            ["fach", "Fach", metadata.fach || "", "text"],
            ["kursOderKlasse", "Kurs/Klasse", metadata.kursOderKlasse || "", "text"],
            ["termin", "Termin", metadata.termin || "", "date"],
            ["arbeitsNummer", "Nummer", metadata.arbeitsNummer || "", "text"],
            ["thema", "Thema", metadata.thema || "", "text"],
            ["lehrkraft", "Lehrkraft", metadata.lehrkraft || "", "text"],
            ["lehrkraftKuerzel", "Kürzel", metadata.lehrkraftKuerzel || "", "text"]
          ].map(function (field) {
            return `<label class="field-group"><span>${field[1]}</span><input type="${field[3]}" value="${escapeHtml(field[2])}" data-meta-field="${field[0]}" /></label>`;
          }).join("")}
          <label class="field-group">
            <span>Hilfsmittelfreie Aufgaben</span>
            <input type="number" min="0" step="1" value="${escapeHtml(String(metadata.anzahlHilfsmittelfreierAufgaben || ""))}" data-meta-field="anzahlHilfsmittelfreierAufgaben" />
          </label>
          <label class="field-group">
            <span>Aktive Varianten</span>
            <input type="text" value="${escapeHtml((metadata.aktivierteVarianten || []).join(", "))}" data-meta-field="aktivierteVarianten" placeholder="A, B" />
          </label>
          <label class="field-group">
            <span>Notenschlüssel</span>
            <select data-meta-field="notenschluesselPreset">
              <option value="sek1"${attrSelected(metadata.notenschluesselPreset === "sek1")}>Sek I (1 bis 6)</option>
              <option value="oberstufe"${attrSelected(metadata.notenschluesselPreset === "oberstufe")}>Oberstufe (0 bis 15)</option>
              <option value="symbol"${attrSelected(metadata.notenschluesselPreset === "symbol")}>++ / + / o / - / --</option>
              <option value="custom"${attrSelected(metadata.notenschluesselPreset === "custom")}>Benutzerdefiniert</option>
            </select>
          </label>
          <label class="field-group">
            <span>Bezeichnung im Druck</span>
            <input type="text" value="${escapeHtml(resultLabel)}" data-meta-field="resultLabel" placeholder="z. B. Note oder Notenpunkte" />
          </label>
        </div>
        <article class="subpanel stack-gap">
          <div class="panel-header">
            <div>
              <h3>Notengrenzen</h3>
              <p class="muted-text">Hier legst du sowohl die Grenzwerte als auch die Bezeichnungen fest.</p>
            </div>
            <button type="button" class="secondary-button" data-action="add-boundary">Grenze ergänzen</button>
          </div>
          <table class="simple-table">
            <thead><tr><th>${escapeHtml(resultLabel)}</th><th>ab Prozent</th><th></th></tr></thead>
            <tbody>
              ${boundaries.map(function (boundary) {
                return `<tr>
                  <td><input value="${escapeHtml(boundary.label)}" data-boundary-id="${boundary.id}" data-boundary-field="label" /></td>
                  <td><input type="number" step="0.1" value="${escapeHtml(String(boundary.minPercent))}" data-boundary-id="${boundary.id}" data-boundary-field="minPercent" /></td>
                  <td><button type="button" class="danger-button" data-action="remove-boundary" data-boundary-id="${boundary.id}">Entfernen</button></td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </article>
      </section>
    `;
  }

  function renderStudentsView(exam) {
    var variants = exam.metadata.aktivierteVarianten || [];
    var students = sortBySortIndex(exam.students);
    return `
      <section class="panel stack-gap students-view">
        <div class="panel-header">
          <div>
            <h2>Schülerliste</h2>
            <p class="muted-text">CSV-Import, manuelle Pflege und Klassenlisten-Bibliothek.</p>
          </div>
          <div class="inline-actions wrap-actions">
            <label class="secondary-button file-button">
              CSV importieren
              <input type="file" data-role="import-students" accept=".csv,text/csv" />
            </label>
          </div>
        </div>
        <article class="subpanel stack-gap">
          <div class="panel-header"><div><h3>Neuen Schüler anlegen</h3></div></div>
          <div class="inline-form wrap-actions">
            <input id="new-student-first" type="text" placeholder="Vorname" />
            <input id="new-student-last" type="text" placeholder="Nachname" />
            <select id="new-student-variant">
              <option value="">Variante</option>
              ${variants.map(function (variant) {
                return `<option value="${escapeHtml(variant)}">${escapeHtml(variant)}</option>`;
              }).join("")}
            </select>
            <button type="button" class="primary-button" data-action="add-student">Schüler hinzufügen</button>
          </div>
        </article>
        <article class="subpanel stack-gap">
          <div class="panel-header"><div><h3>Klassenlisten-Bibliothek</h3><p class="muted-text">Klassen lokal wiederverwenden.</p></div></div>
          <div class="inline-form wrap-actions">
            <input id="classlist-name" type="text" placeholder="Name der Klassenliste" />
            <button type="button" class="secondary-button" data-action="save-class-list">Aktuelle Liste speichern</button>
            <select id="classlist-select">
              <option value="">Klassenliste anwenden</option>
              ${store.classListLibrary.map(function (template) {
                return `<option value="${template.id}">${escapeHtml(template.name)}</option>`;
              }).join("")}
            </select>
            <button type="button" class="secondary-button" data-action="apply-class-list">Übernehmen</button>
          </div>
        </article>
        <table class="simple-table">
          <thead><tr><th>#</th><th>Vorname</th><th>Nachname</th><th>Anzeigename</th><th>Variante</th><th>Aktiv</th><th></th></tr></thead>
          <tbody>
            ${students.map(function (student, index) {
              return `<tr>
                <td>${index + 1}</td>
                <td><input value="${escapeHtml(student.vorname)}" data-student-id="${student.id}" data-student-field="vorname" /></td>
                <td><input value="${escapeHtml(student.nachname)}" data-student-id="${student.id}" data-student-field="nachname" /></td>
                <td>${escapeHtml(student.displayName)}</td>
                <td>
                  <select data-student-id="${student.id}" data-student-field="variante">
                    <option value="">-</option>
                    ${variants.map(function (variant) {
                      return `<option value="${escapeHtml(variant)}"${attrSelected((student.variante || "") === variant)}>${escapeHtml(variant)}</option>`;
                    }).join("")}
                  </select>
                </td>
                <td><input type="checkbox" data-student-id="${student.id}" data-student-field="aktiv"${attrChecked(student.aktiv)} /></td>
                <td>
                  <div class="inline-actions wrap-actions">
                    <button type="button" class="secondary-button tiny-button" data-action="move-student" data-student-id="${student.id}" data-direction="-1">Hoch</button>
                    <button type="button" class="secondary-button tiny-button" data-action="move-student" data-student-id="${student.id}" data-direction="1">Runter</button>
                    <button type="button" class="danger-button tiny-button" data-action="remove-student" data-student-id="${student.id}">Löschen</button>
                  </div>
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </section>
    `;
  }
  function renderBlockParentOptions(flattened, currentNodeId, selectedParentId) {
    return flattened
      .filter(function (node) {
        return node.id !== currentNodeId && isBlockNode(node);
      })
      .map(function (node) {
        var indent = Array(node.depth + 1).join("&nbsp;&nbsp;");
        return `<option value="${node.id}"${attrSelected(selectedParentId === node.id)}>${indent}${escapeHtml(node.title || "Block")}</option>`;
      })
      .join("");
  }

  function getBlockBorderLabel(style) {
    switch (style) {
      case "top":
        return "Rand oben";
      case "bottom":
        return "Rand unten";
      case "topBottom":
        return "Rand oben/unten";
      case "box":
        return "Rahmen";
      default:
        return "";
    }
  }

  function renderBorderStyleOptions(selectedStyle) {
    var style = selectedStyle || "none";
    return [
      ["none", "Kein Rand"],
      ["top", "Oben"],
      ["bottom", "Unten"],
      ["topBottom", "Oben + unten"],
      ["box", "Rahmen"]
    ].map(function (entry) {
      return `<option value="${entry[0]}"${attrSelected(style === entry[0])}>${entry[1]}</option>`;
    }).join("");
  }

  function renderStructureView(exam) {
    var flattened = flattenStructure(exam.structure);
    var blockNodes = flattened.filter(function (node) {
      return isBlockNode(node);
    });

    return `
      <section class="panel stack-gap structure-view">
        <div class="panel-header">
          <div>
            <h2>Erwartungshorizont</h2>
            <p class="muted-text">Vereinfachtes Modell mit nur zwei Typen: Block und Kriterium.</p>
          </div>
          <div class="inline-actions wrap-actions">
            <button type="button" class="secondary-button" data-action="add-node" data-node-type="block" data-parent-id="">Block</button>
            <button type="button" class="secondary-button" data-action="add-node" data-node-type="criterion" data-parent-id="">Kriterium</button>
          </div>
        </div>
        <article class="subpanel stack-gap">
          <div class="panel-header">
            <div>
              <h3>Bibliothek und Massenanlage</h3>
              <p class="muted-text">Format für Schnellanlage: Name | Punkte</p>
            </div>
          </div>
          <div class="inline-form wrap-actions">
            <select id="bulk-parent-id">
              <option value="">Oberste Ebene</option>
              ${blockNodes.map(function (node) {
                var indent = Array(node.depth + 1).join("&nbsp;&nbsp;");
                return `<option value="${node.id}">${indent}${escapeHtml(node.title || "Block")}</option>`;
              }).join("")}
            </select>
            <textarea id="bulk-criteria-text" rows="4" placeholder="Beispiel:\nRechenweg vollständig | 2\nErgebnis korrekt | 1"></textarea>
            <button type="button" class="secondary-button" data-action="add-bulk-criteria">Mehrere Kriterien anlegen</button>
          </div>
          <div class="inline-form wrap-actions">
            <input id="taskblock-name" type="text" placeholder="Name für Aufgabenblock" />
            <button type="button" class="secondary-button" data-action="save-task-block" data-node-id="">Gesamte Struktur speichern</button>
            <select id="taskblock-select">
              <option value="">Aufgabenblock einfügen</option>
              ${store.taskBlockLibrary.map(function (template) {
                return `<option value="${template.id}">${escapeHtml(template.name)}</option>`;
              }).join("")}
            </select>
            <button type="button" class="secondary-button" data-action="insert-task-block">Einfügen</button>
          </div>
        </article>
        <div class="stack-gap">
          ${flattened.map(function (node) {
            var isCriterion = isCriterionNode(node);
            var isHeading = getNodeIsHeading(node);
            var showSum = getNodeShowSum(node);
            var borderStyle = getNodeBorderStyle(node);
            return `
              <article class="structure-row subpanel" draggable="true" data-node-id="${node.id}">
                <div class="structure-header" style="padding-left:${node.depth * 18}px">
                  <div class="structure-meta">
                    <strong>${escapeHtml(node.title || (isCriterion ? "Kriterium" : "Block"))}</strong>
                    <span class="pill">${isCriterion ? "Kriterium" : "Block"}</span>
                    ${isCriterion && node.isBonus ? '<span class="pill pill-bonus">Bonus</span>' : ""}
                    ${!isCriterion && showSum ? '<span class="pill">Summe</span>' : ""}
                    ${!isCriterion && isHeading ? '<span class="pill">Überschrift</span>' : ""}
                    ${!isCriterion && borderStyle !== "none" ? `<span class="pill">${escapeHtml(getBlockBorderLabel(borderStyle))}</span>` : ""}
                  </div>
                  <div class="inline-actions wrap-actions">
                    <button type="button" class="secondary-button tiny-button" data-action="add-node" data-node-type="block" data-parent-id="${node.id}">+ Block</button>
                    <button type="button" class="secondary-button tiny-button" data-action="add-node" data-node-type="criterion" data-parent-id="${node.id}">+ Kriterium</button>
                    <button type="button" class="secondary-button tiny-button" data-action="save-task-block" data-node-id="${node.id}">Block sichern</button>
                    <button type="button" class="secondary-button tiny-button" data-action="move-node" data-node-id="${node.id}" data-direction="-1">Hoch</button>
                    <button type="button" class="secondary-button tiny-button" data-action="move-node" data-node-id="${node.id}" data-direction="1">Runter</button>
                    <button type="button" class="danger-button tiny-button" data-action="remove-node" data-node-id="${node.id}">Entfernen</button>
                  </div>
                </div>
                <div class="structure-form-grid">
                  <label class="field-group">
                    <span>Typ</span>
                    <select data-node-id="${node.id}" data-node-field="nodeKind">
                      <option value="block"${attrSelected(!isCriterion)}>Block</option>
                      <option value="criterion"${attrSelected(isCriterion)}>Kriterium</option>
                    </select>
                  </label>
                  <label class="field-group"><span>Name</span><input value="${escapeHtml(node.title || "")}" data-node-id="${node.id}" data-node-field="title" /></label>
                  <label class="field-group">
                    <span>Übergeordneter Block</span>
                    <select data-node-id="${node.id}" data-node-field="parentId">
                      <option value=""${attrSelected(!node.parentId)}>Oberste Ebene</option>
                      ${renderBlockParentOptions(flattened, node.id, node.parentId || "")}
                    </select>
                  </label>
                  ${isCriterion ? `
                    <label class="field-group"><span>Maximalpunkte</span><input type="number" min="0" step="0.5" value="${escapeHtml(String(node.maxPoints || 0))}" data-node-id="${node.id}" data-node-field="maxPoints" /></label>
                    <label class="field-group inline-checkbox"><span>Ist Bonus</span><input type="checkbox" data-node-id="${node.id}" data-node-field="isBonus"${attrChecked(!!node.isBonus)} /></label>
                  ` : `
                    <label class="field-group inline-checkbox"><span>Summe anzeigen</span><input type="checkbox" data-node-id="${node.id}" data-node-field="showSum"${attrChecked(showSum)} /></label>
                    <label class="field-group inline-checkbox"><span>Ist Überschrift</span><input type="checkbox" data-node-id="${node.id}" data-node-field="isHeading"${attrChecked(isHeading)} /></label>
                    <label class="field-group"><span>Rand</span><select data-node-id="${node.id}" data-node-field="borderStyle">${renderBorderStyleOptions(borderStyle)}</select></label>
                  `}
                </div>
                ${isCriterion ? `
                  <div class="field-group">
                    <span>Text</span>
                    <textarea rows="5" data-node-id="${node.id}" data-node-field="richContent">${escapeHtml(node.richContent || "")}</textarea>
                  </div>
                  <div class="inline-actions wrap-actions">
                    <label class="secondary-button file-button">
                      Bild einfügen
                      <input type="file" accept="image/*" data-role="node-image" data-node-id="${node.id}" />
                    </label>
                  </div>
                  <div class="markdown-preview" data-preview-node-id="${node.id}">${renderMarkdown(node.richContent || "", { editableImages: true, nodeId: node.id })}</div>
                ` : `
                  <div class="small-help">Blöcke strukturieren den Erwartungshorizont. Für Zeilen wie „Hilfsmittelfreier Teil“, „Aufgabe 1“ oder „a)“ legst du jeweils einen Block an. Optional kannst du einen Rand für die Druckausgabe wählen.</div>
                `}
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function getMatrixCellValue(entry, mode) {
    if (!entry || entry.isUnset) {
      return "";
    }
    if (mode === "points") {
      return String(entry.achievedPoints);
    }
    if (entry.scoreModeUsedLast === "percent" && entry.rawInputValue) {
      return entry.rawInputValue;
    }
    return String(entry.derivedPercent);
  }

  function renderMatrixView(exam) {
    var students = getActiveStudents(exam);
    var rows = flattenStructure(exam.structure).filter(function (node) {
      return node.printVisibility !== "hidden" && node.printVisibility !== "printOnly";
    });
    var scorableRows = rows.filter(function (row) { return row.isScorable; });
    var scorableIndexMap = {};
    scorableRows.forEach(function (row, index) {
      scorableIndexMap[row.id] = index;
    });

    var bodyRows = rows.map(function (row) {
      var label = `<td class="sticky-col matrix-label-col" style="padding-left:${16 + row.depth * 18}px"><div class="matrix-label-cell"><strong>${escapeHtml(row.title || row.type)}</strong>${row.isScorable ? `<span class="muted-text">${Number(row.maxPoints || 0).toFixed(1)} P${row.isBonus ? " +Bonus" : ""}</span>` : ""}</div></td>`;
      var actionCell = row.isScorable
        ? `<td class="matrix-meta-col"><div class="inline-actions wrap-actions"><button type="button" class="secondary-button tiny-button" data-action="set-criterion-percent" data-criterion-id="${row.id}" data-percent="0">0%</button><button type="button" class="secondary-button tiny-button" data-action="set-criterion-percent" data-criterion-id="${row.id}" data-percent="100">100%</button></div></td>`
        : `<td class="matrix-meta-col"><span class="muted-text">Summe</span></td>`;

      var studentCells = students.map(function (student, studentIndex) {
        if (!row.isScorable) {
          var totals = getNodeTotalsForStudent(exam, row.id, student.id);
          return `<td class="matrix-summary-cell">${totals.achieved.toFixed(1)} / ${totals.max.toFixed(1)}</td>`;
        }
        var entry = exam.evaluations[evaluationKey(student.id, row.id)];
        var stateClass = getHighlightState(exam.metadata, entry && !entry.isUnset ? entry.derivedPercent : null);
        return `<td class="matrix-input-cell matrix-${stateClass}">
          <input class="matrix-input" type="number" step="${ui.scoreMode === "points" ? "0.5" : "0.1"}" min="0" ${ui.scoreMode === "points" ? `max="${escapeHtml(String(row.maxPoints || 0))}"` : ""}
            value="${escapeHtml(getMatrixCellValue(entry, ui.scoreMode))}"
            data-student-id="${student.id}" data-criterion-id="${row.id}" data-matrix-row="${scorableIndexMap[row.id]}" data-matrix-col="${studentIndex}" />
          <small>${entry && !entry.isUnset ? `${Number(entry.achievedPoints).toFixed(1)} P` : "offen"}</small>
        </td>`;
      }).join("");

      return `<tr class="${row.isScorable ? "criterion-row" : "structure-only-row"}">${label}${actionCell}${studentCells}</tr>`;
    }).join("");

    var totalRow = `<tr class="matrix-final-row"><td class="sticky-col matrix-label-col">Gesamt</td><td class="matrix-meta-col">Note</td>${students.map(function (student) {
      var totals = getStudentTotals(exam, student.id);
      return `<td><strong>${totals.totalAchieved.toFixed(1)} / ${totals.maxRegular.toFixed(1)}</strong><div>${totals.percent.toFixed(2)}%</div><div>${escapeHtml(totals.gradeLabel)}</div></td>`;
    }).join("")}</tr>`;

    return `
      <section class="panel stack-gap matrix-view">
        <div class="panel-header">
          <div>
            <h2>Bewertungsmatrix</h2>
            <p class="muted-text">Sticky-Raster mit Tastaturnavigation und Blockaktionen.</p>
          </div>
          <div class="segmented-control">
            <button type="button" class="${ui.scoreMode === "points" ? "segmented-active" : ""}" data-action="set-score-mode" data-mode="points">Punktmodus</button>
            <button type="button" class="${ui.scoreMode === "percent" ? "segmented-active" : ""}" data-action="set-score-mode" data-mode="percent">Prozentmodus</button>
          </div>
        </div>
        <div class="matrix-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="sticky-col sticky-head matrix-label-col">Struktur / Kriterium</th>
                <th class="sticky-head matrix-meta-col">Aktionen</th>
                ${students.map(function (student) {
                  var totals = getStudentTotals(exam, student.id);
                  return `<th class="sticky-head matrix-student-head"><div class="student-head"><strong>${escapeHtml(student.displayName)}</strong><span>${student.variante ? `Variante ${escapeHtml(student.variante)}` : ""}</span><span>${totals.totalAchieved.toFixed(1)} / ${totals.maxRegular.toFixed(1)} Punkte</span><span>${totals.percent.toFixed(2)}% | ${escapeHtml(totals.gradeLabel)}</span><div class="inline-actions wrap-actions"><button type="button" class="secondary-button tiny-button" data-action="set-student-percent" data-student-id="${student.id}" data-percent="0">0%</button><button type="button" class="secondary-button tiny-button" data-action="set-student-percent" data-student-id="${student.id}" data-percent="100">100%</button></div></div></th>`;
                }).join("")}
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
              ${totalRow}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function formatNumberDe(value, digits) {
    return Number(value || 0).toFixed(digits).replace(".", ",");
  }

  function formatPointValue(value) {
    var number = Number(value || 0);
    if (Math.abs(number - Math.round(number)) < 0.001) {
      return String(Math.round(number));
    }
    return number.toFixed(1).replace(".", ",");
  }

  function formatPercentValue(value) {
    return formatNumberDe(value, 2) + "%";
  }

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

  function getPrintRowWeight(row) {
    if (row.kind === "criterion") {
      return Math.max(1, Math.ceil(String(row.bodyText || row.titleText || "").length / 220) + 1);
    }
    if (row.kind === "blockHeading") {
      return 2;
    }
    if (row.kind === "summary") {
      return 6;
    }
    return 1;
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

    function addNodeRows(node, depth) {
      if (node.printVisibility === "hidden" || node.printVisibility === "screenOnly") {
        return;
      }

      if (isCriterionNode(node)) {
        var entry = exam.evaluations[evaluationKey(studentId, node.id)];
        rows.push({
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
      if (blockTitle) {
        rows.push({
          kind: getNodeIsHeading(node) ? "blockHeading" : "blockInline",
          depth: depth,
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

      if (getNodeShowSum(node) && getDescendantCriterionIds(exam.structure, node.id).length) {
        var totals = getNodeTotalsForStudent(exam, node.id, studentId);
        rows.push({
          kind: "sum",
          depth: depth,
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

  function chunkRowsForPrint(rows, summaryWeight) {
    var pages = [];
    var current = [];
    var currentWeight = 0;
    var maxWeight = 24;

    rows.forEach(function (row) {
      var weight = getPrintRowWeight(row);
      var reserveHeading = row.kind === "blockHeading" && currentWeight > 20;
      if (current.length && (currentWeight + weight > maxWeight || reserveHeading)) {
        pages.push(current);
        current = [];
        currentWeight = 0;
      }
      current.push(row);
      currentWeight += weight;
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

  function getPrintHeaderTitle(exam) {
    var metadata = exam.metadata || {};
    var title = String(metadata.title || "").trim();
    if (title) {
      return title;
    }
    var fallback = metadata.fach ? ("Klassenarbeit " + metadata.fach) : "Klassenarbeit";
    if (metadata.arbeitsNummer) {
      fallback += " " + metadata.arbeitsNummer;
    }
    if (metadata.thema) {
      fallback += " (" + metadata.thema + ")";
    }
    return fallback;
  }

  function getPrintFrameClasses(row) {
    var classes = [];
    switch (row.frameStyle) {
      case "top":
        if (row.frameStart) {
          classes.push("print-frame-top");
        }
        break;
      case "bottom":
        if (row.frameEnd) {
          classes.push("print-frame-bottom");
        }
        break;
      case "topBottom":
        if (row.frameStart) {
          classes.push("print-frame-top");
        }
        if (row.frameEnd) {
          classes.push("print-frame-bottom");
        }
        break;
      case "box":
        classes.push("print-frame-box");
        if (row.frameStart) {
          classes.push("print-frame-start");
        }
        if (row.frameEnd) {
          classes.push("print-frame-end");
        }
        break;
      default:
        break;
    }
    return classes.join(" ");
  }

  function renderPrintHeader(exam, student, pageIndex, pageCount) {
    var metadata = exam.metadata || {};
    var schemeLabel = getPrintSchemeLabel(metadata);
    var classText = metadata.kursOderKlasse || "";
    if (schemeLabel) {
      classText += classText ? ` (${schemeLabel})` : schemeLabel;
    }
    var title = getPrintHeaderTitle(exam);
    return `
      <header class="print-header-card">
        <div class="print-title-row">
          <div class="print-title-main">${escapeHtml(title)}</div>
          <div class="print-title-date">${escapeHtml(formatDate(metadata.termin) || "")}</div>
        </div>
        <div class="print-header-grid">
          <div class="print-header-cell print-header-left"><span class="print-meta-label">Kurs/Klasse:</span><span class="print-meta-value">${escapeHtml(classText || "-")}</span></div>
          <div class="print-header-cell print-header-center"><span class="print-meta-label">Name:</span><span class="print-meta-value">${escapeHtml(student.displayName || "")}</span></div>
          <div class="print-header-cell print-header-right"><span class="print-meta-label">Lehrkraft:</span><span class="print-meta-value">${escapeHtml(metadata.lehrkraft || "")}</span></div>
          <div class="print-header-cell print-header-left print-header-subline">${metadata.schuljahr ? `<span class="print-meta-label">Schuljahr:</span><span class="print-meta-value">${escapeHtml(metadata.schuljahr)}</span>` : ""}</div>
          <div class="print-header-cell print-header-center print-header-subline"><span class="print-meta-label">Seite:</span><span class="print-meta-value">${pageIndex + 1} von ${pageCount}</span></div>
          <div class="print-header-cell print-header-right print-header-subline">${metadata.arbeitsNummer ? `<span class="print-meta-label">Nr.:</span><span class="print-meta-value">${escapeHtml(metadata.arbeitsNummer)}</span>` : ""}</div>
        </div>
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

  function renderPrintRow(row) {
    var indentStyle = `padding-left:${row.depth * 12}px`;
    var frameClasses = getPrintFrameClasses(row);

    if (row.kind === "spacer") {
      return '<tr class="print-row-spacer"><td colspan="3"></td></tr>';
    }

    if (row.kind === "blockHeading") {
      return `<tr class="print-row-block-heading ${frameClasses}"><td class="print-marker-cell"></td><td class="print-content-cell" colspan="2" style="${indentStyle}"><div class="print-heading-block">${escapeHtml(row.titleText || "")}</div></td></tr>`;
    }

    if (row.kind === "blockInline") {
      return `<tr class="print-row-block-inline ${frameClasses}"><td class="print-marker-cell"></td><td class="print-content-cell" colspan="2" style="${indentStyle}"><div class="print-heading-inline">${escapeHtml(row.titleText || "")}</div></td></tr>`;
    }

    if (row.kind === "sum") {
      return `<tr class="print-row-sum ${frameClasses}"><td class="print-marker-cell"></td><td class="print-content-cell" style="${indentStyle}"><strong>${escapeHtml(row.label || "Summe")}</strong></td><td class="print-score-cell">${renderPrintScore(row.achieved, row.max)}</td></tr>`;
    }

    return `<tr class="print-row-criterion ${frameClasses}"><td class="print-marker-cell">${escapeHtml(row.marker || "")}</td><td class="print-content-cell" style="${indentStyle}">${renderPrintCriterionContent(row)}</td><td class="print-score-cell">${renderPrintScore(row.achieved, row.max)}${row.isBonus ? '<div class="print-bonus-note">Bonus</div>' : ""}</td></tr>`;
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
          <div class="print-summary-value print-summary-note-line"><span class="print-summary-note">${escapeHtml(totals.gradeLabel)}</span><span class="print-summary-teacher">${escapeHtml(exam.metadata.lehrkraftKuerzel || "")}</span></div>
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

  function renderPrintView(exam) {
    var students = getActiveStudents(exam);
    var scheme = resolveGradeScheme(exam.metadata);

    return `
      <section class="panel stack-gap print-panel">
        <div class="panel-header no-print">
          <div>
            <h2>Druckansicht</h2>
            <p class="muted-text">Formaler Bewertungsbogen für den Browserdruck.</p>
            <p class="small-help">Browser-Kopf- und Fußzeilen wie Datum oder Dateiname werden vom Browser gesteuert und müssen im Druckdialog deaktiviert werden.</p>
          </div>
          <button type="button" class="primary-button" data-action="print">Sammel-PDF drucken</button>
        </div>
        <div class="print-document">
          ${students.map(function (student) {
            var rows = buildPrintRowsForStudent(exam, student.id);
            var totals = getStudentTotals(exam, student.id);
            var pages = chunkRowsForPrint(rows, 6);
            return pages.map(function (pageRows, pageIndex) {
              return `<section class="print-sheet-page">
                ${renderPrintHeader(exam, student, pageIndex, pages.length)}
                <table class="print-work-table">
                  <tbody>
                    ${pageRows.map(renderPrintRow).join("")}
                  </tbody>
                </table>
                ${pageIndex === pages.length - 1 ? renderPrintSummary(exam, student, totals, scheme) : ""}
              </section>`;
            }).join("");
          }).join("")}
        </div>
      </section>
    `;
  }
  function renderModal() {
    if (!ui.pendingMaxChange) {
      return "";
    }
    return `
      <div class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h3>Maximalpunkte ändern</h3>
            <button type="button" class="secondary-button" data-action="close-modal">Schließen</button>
          </div>
          <div class="modal-body">
            <p>Bereits eingetragene Leistungen existieren. Bitte festlegen, wie die bisherigen Punkte behandelt werden.</p>
            <div class="inline-actions wrap-actions">
              <button type="button" class="secondary-button" data-action="apply-max-change" data-mode="absolute">Absolute Punkte beibehalten</button>
              <button type="button" class="primary-button" data-action="apply-max-change" data-mode="proportional">Leistungen proportional mitskalieren</button>
            </div>
            <p class="muted-text">Beim Senken der Maximalpunkte werden im Modus "absolute Punkte" Werte auf die neue Obergrenze begrenzt.</p>
          </div>
        </div>
      </div>
    `;
  }

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
      case "print":
        return renderPrintView(exam);
      default:
        return renderOverviewView(exam);
    }
  }

  function render() {
    var exam = getCurrentExam();
    appRoot.innerHTML = `
      <main class="app-shell">
        ${renderTopBar(exam)}
        ${store.exams.length ? renderTabs() : ""}
        ${ui.notice ? `<div class="notice-banner no-print"><div class="form-row"><span>${escapeHtml(ui.notice)}</span><button type="button" class="ghost-button" data-action="dismiss-notice">Schließen</button></div></div>` : ""}
        ${store.exams.length || ui.activeTab === "archive" ? renderCurrentView(exam) : renderEmptyState()}
      </main>
      ${renderModal()}
    `;
    restoreMatrixFocus();
  }

  function showNotice(message) {
    ui.notice = message;
    render();
  }

  function mutateStore(recipe) {
    store = recipe(deepClone(store));
    saveStore();
    render();
  }

  function mutateCurrentExam(recipe) {
    var currentExam = getCurrentExam();
    if (!currentExam) {
      return;
    }
    mutateStore(function (currentStore) {
      currentStore.exams = currentStore.exams.map(function (exam) {
        return exam.metadata.id === currentExam.metadata.id ? recipe(exam) : exam;
      });
      return currentStore;
    });
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, function (character) {
      return "\\" + character;
    });
  }

  function restoreMatrixFocus() {
    if (!ui.matrixFocus) {
      return;
    }
    var selector = `.matrix-input[data-criterion-id="${cssEscape(ui.matrixFocus.criterionId)}"][data-student-id="${cssEscape(ui.matrixFocus.studentId)}"]`;
    var input = appRoot.querySelector(selector);
    if (input) {
      input.focus();
      input.select();
    }
  }

  function getValue(id) {
    var element = document.getElementById(id);
    return element ? element.value : "";
  }

  function clearValue(id) {
    var element = document.getElementById(id);
    if (element) {
      element.value = "";
    }
  }

  function updateImageWidthInContent(content, imageIndex, nextWidth) {
    var targetIndex = Number(imageIndex);
    var currentIndex = -1;
    var roundedWidth = Math.max(48, Math.round(Number(nextWidth) || 0));
    return String(content || "").replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (match, rawAlt, src) {
      currentIndex += 1;
      if (currentIndex !== targetIndex) {
        return match;
      }
      var meta = parseImageMeta(rawAlt);
      return "![" + buildImageMetaText(meta.alt, roundedWidth) + "](" + src + ")";
    });
  }

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

  function handleCreateExam() {
    var exam = createBlankExam();
    mutateStore(function (currentStore) {
      currentStore.exams.push(exam);
      currentStore.currentExamId = exam.metadata.id;
      return currentStore;
    });
    ui.activeTab = "metadata";
    render();
  }

  function handleSeedDemo() {
    var exam = createDemoExam();
    store = {
      version: 1,
      currentExamId: exam.metadata.id,
      exams: [exam],
      taskBlockLibrary: [],
      classListLibrary: []
    };
    saveStore();
    ui.activeTab = "overview";
    ui.notice = "Demo geladen.";
    render();
  }

  function updateMetadataField(field, value) {
    mutateCurrentExam(function (exam) {
      var metadata = exam.metadata;
      if (field === "notenschluesselPreset") {
        var previousPreset = metadata.notenschluesselPreset || "custom";
        var previousDefaultLabel = getDefaultResultLabel(previousPreset);
        var currentLabel = String(metadata.resultLabel || "").trim();
        metadata.notenschluesselPreset = value;
        metadata.benutzerdefinierteNotengrenzen = value === "custom" ? metadata.benutzerdefinierteNotengrenzen : clonePresetBoundaries(value);
        if (!currentLabel || currentLabel === previousDefaultLabel) {
          metadata.resultLabel = getDefaultResultLabel(value);
        }
      } else if (field === "aktivierteVarianten") {
        metadata.aktivierteVarianten = String(value).split(",").map(function (item) {
          return item.trim();
        }).filter(Boolean);
      } else if (field === "anzahlHilfsmittelfreierAufgaben") {
        metadata.anzahlHilfsmittelfreierAufgaben = value === "" ? "" : Number(value);
      } else if (field === "resultLabel") {
        metadata.resultLabel = String(value || "").trim();
      } else {
        metadata[field] = value;
      }
      metadata.updatedAt = nowIso();
      metadata.benutzerdefinierteNotengrenzen = normalizeBoundaries(metadata.benutzerdefinierteNotengrenzen);
      return exam;
    });
  }

  function updateBoundary(boundaryId, field, value) {
    mutateCurrentExam(function (exam) {
      exam.metadata.notenschluesselPreset = "custom";
      exam.metadata.benutzerdefinierteNotengrenzen = normalizeBoundaries((exam.metadata.benutzerdefinierteNotengrenzen || []).map(function (boundary) {
        if (boundary.id !== boundaryId) {
          return boundary;
        }
        var next = deepClone(boundary);
        next[field] = field === "minPercent" ? Number(value) || 0 : value;
        return next;
      }));
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function updateStudentField(studentId, field, value, checked) {
    mutateCurrentExam(function (exam) {
      exam.students = exam.students.map(function (student) {
        if (student.id !== studentId) {
          return student;
        }
        var next = deepClone(student);
        next[field] = field === "aktiv" ? !!checked : value;
        next.displayName = (String(next.vorname || "") + " " + String(next.nachname || "")).trim();
        return next;
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function moveStudent(studentId, direction) {
    mutateCurrentExam(function (exam) {
      var students = sortBySortIndex(exam.students);
      var sourceIndex = students.findIndex(function (student) {
        return student.id === studentId;
      });
      var targetIndex = sourceIndex + direction;
      if (sourceIndex === -1 || targetIndex < 0 || targetIndex >= students.length) {
        return exam;
      }
      var item = students.splice(sourceIndex, 1)[0];
      students.splice(targetIndex, 0, item);
      exam.students = students.map(function (student, index) {
        student.sortIndex = index;
        return student;
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function addStudentFromDraft() {
    var firstName = getValue("new-student-first").trim();
    var lastName = getValue("new-student-last").trim();
    var variant = getValue("new-student-variant").trim();
    if (!firstName && !lastName) {
      return;
    }
    mutateCurrentExam(function (exam) {
      exam.students.push({
        id: createId("student"),
        vorname: firstName,
        nachname: lastName,
        displayName: (firstName + " " + lastName).trim(),
        variante: variant,
        aktiv: true,
        sortIndex: exam.students.length
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
    clearValue("new-student-first");
    clearValue("new-student-last");
    clearValue("new-student-variant");
  }

  function removeStudent(studentId) {
    mutateCurrentExam(function (exam) {
      exam.students = exam.students.filter(function (student) {
        return student.id !== studentId;
      }).map(function (student, index) {
        student.sortIndex = index;
        return student;
      });
      Object.keys(exam.evaluations).forEach(function (key) {
        if (exam.evaluations[key].studentId === studentId) {
          delete exam.evaluations[key];
        }
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function saveCurrentClassList() {
    var currentExam = getCurrentExam();
    if (!currentExam) {
      return;
    }
    var name = getValue("classlist-name").trim() || (currentExam.metadata.kursOderKlasse || "Klassenliste");
    mutateStore(function (currentStore) {
      currentStore.classListLibrary.unshift(createClassListTemplate(name, currentExam.students));
      return currentStore;
    });
    clearValue("classlist-name");
    showNotice("Klassenliste gespeichert: " + name);
  }

  function applySavedClassList() {
    var templateId = getValue("classlist-select");
    if (!templateId) {
      return;
    }
    var template = store.classListLibrary.find(function (entry) {
      return entry.id === templateId;
    });
    if (!template) {
      return;
    }
    mutateCurrentExam(function (exam) {
      exam.students = template.students.map(function (student, index) {
        return {
          id: createId("student"),
          vorname: student.vorname,
          nachname: student.nachname,
          displayName: student.displayName,
          variante: student.variante || "",
          aktiv: student.aktiv !== false,
          sortIndex: index
        };
      });
      exam.evaluations = {};
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
    showNotice("Klassenliste angewendet: " + template.name);
  }

  function addNode(nodeType, parentId) {
    mutateCurrentExam(function (exam) {
      var isCriterion = nodeType === "criterion";
      exam.structure.push({
        id: createId("node"),
        type: isCriterion ? "criterion" : "block",
        parentId: parentId || null,
        sortIndex: exam.structure.length,
        title: isCriterion ? "Neues Kriterium" : "Neuer Block",
        shortLabel: "",
        richContent: "",
        printVisibility: "always",
        maxPoints: isCriterion ? 1 : undefined,
        isBonus: false,
        isScorable: isCriterion,
        showSum: isCriterion ? undefined : false,
        isHeading: isCriterion ? undefined : false,
        borderStyle: isCriterion ? undefined : "none",
        variantScope: []
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function removeNode(nodeId) {
    mutateCurrentExam(function (exam) {
      var ids = new Set([nodeId]);
      var changed = true;
      while (changed) {
        changed = false;
        exam.structure.forEach(function (node) {
          if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
            ids.add(node.id);
            changed = true;
          }
        });
      }
      exam.structure = exam.structure.filter(function (node) {
        return !ids.has(node.id);
      }).map(function (node, index) {
        node.sortIndex = index;
        return node;
      });
      Object.keys(exam.evaluations).forEach(function (key) {
        if (ids.has(exam.evaluations[key].criterionId)) {
          delete exam.evaluations[key];
        }
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function moveNode(nodeId, direction) {
    mutateCurrentExam(function (exam) {
      var nodes = sortBySortIndex(exam.structure);
      var sourceIndex = nodes.findIndex(function (node) { return node.id === nodeId; });
      var targetIndex = sourceIndex + direction;
      if (sourceIndex === -1 || targetIndex < 0 || targetIndex >= nodes.length) {
        return exam;
      }
      var item = nodes.splice(sourceIndex, 1)[0];
      nodes.splice(targetIndex, 0, item);
      exam.structure = renumberSortIndices(nodes);
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function updateNodeField(nodeId, field, value, checked) {
    var currentExam = getCurrentExam();
    if (!currentExam) {
      return;
    }
    if (field === "maxPoints") {
      var currentCriterion = getCriterionById(currentExam.structure, nodeId);
      var nextMaxPoints = Math.max(0, Number(value) || 0);
      var hasExistingEntries = Object.keys(currentExam.evaluations).some(function (key) {
        return currentExam.evaluations[key].criterionId === nodeId && !currentExam.evaluations[key].isUnset;
      });
      if (currentCriterion && hasExistingEntries && Number(currentCriterion.maxPoints || 0) !== nextMaxPoints) {
        ui.pendingMaxChange = { criterionId: nodeId, nextMaxPoints: nextMaxPoints };
        render();
        return;
      }
    }

    mutateCurrentExam(function (exam) {
      exam.structure = exam.structure.map(function (node) {
        if (node.id !== nodeId) {
          return node;
        }
        var next = deepClone(node);
        if (field === "nodeKind") {
          if (value === "criterion") {
            next.type = "criterion";
            next.isScorable = true;
            next.maxPoints = next.maxPoints == null ? 1 : Math.max(0, Number(next.maxPoints) || 0);
            next.isBonus = !!next.isBonus;
            next.borderStyle = undefined;
          } else {
            next.type = "block";
            next.isScorable = false;
            next.maxPoints = undefined;
            next.isBonus = false;
            next.richContent = "";
            next.showSum = typeof next.showSum === "boolean" ? next.showSum : getNodeShowSum(node);
            next.isHeading = typeof next.isHeading === "boolean" ? next.isHeading : getNodeIsHeading(node);
            next.borderStyle = next.borderStyle || getNodeBorderStyle(node);
          }
        } else if (field === "isBonus") {
          next.type = "criterion";
          next.isScorable = true;
          next.isBonus = !!checked;
          if (next.maxPoints == null) {
            next.maxPoints = 1;
          }
          next.borderStyle = undefined;
        } else if (field === "borderStyle") {
          next.type = "block";
          next.isScorable = false;
          next.borderStyle = value || "none";
          next.isBonus = false;
          next.maxPoints = undefined;
          next.richContent = "";
        } else if (field === "showSum") {
          next.type = "block";
          next.isScorable = false;
          next.showSum = !!checked;
          next.isBonus = false;
          next.maxPoints = undefined;
          next.richContent = "";
        } else if (field === "isHeading") {
          next.type = "block";
          next.isScorable = false;
          next.isHeading = !!checked;
          next.isBonus = false;
          next.maxPoints = undefined;
          next.richContent = "";
        } else if (field === "parentId") {
          next.parentId = value || null;
        } else if (field === "maxPoints") {
          next.type = "criterion";
          next.isScorable = true;
          next.maxPoints = Math.max(0, Number(value) || 0);
          next.borderStyle = undefined;
        } else {
          next[field] = value;
        }

        if (next.type !== "criterion") {
          next.type = "block";
          next.isScorable = false;
          next.isBonus = false;
          next.maxPoints = undefined;
          next.showSum = typeof next.showSum === "boolean" ? next.showSum : getNodeShowSum(node);
          next.isHeading = typeof next.isHeading === "boolean" ? next.isHeading : getNodeIsHeading(node);
          next.borderStyle = next.borderStyle || getNodeBorderStyle(node);
        }
        return next;
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
  }

  function saveTaskBlock() {
    var currentExam = getCurrentExam();
    if (!currentExam) {
      return;
    }
    var nodeId = eventTargetDataset.nodeId || "";
    var name = getValue("taskblock-name").trim() || (nodeId ? "Aufgabenblock" : (currentExam.metadata.title || "Struktur"));
    var nodes = collectTaskBlockNodes(currentExam.structure, nodeId || null);
    mutateStore(function (currentStore) {
      currentStore.taskBlockLibrary.unshift(createTaskBlockTemplate(name, nodes));
      return currentStore;
    });
    showNotice("Aufgabenblock gespeichert: " + name);
  }

  function insertTaskBlock() {
    var templateId = getValue("taskblock-select");
    if (!templateId) {
      return;
    }
    var template = store.taskBlockLibrary.find(function (entry) {
      return entry.id === templateId;
    });
    if (!template) {
      return;
    }
    mutateCurrentExam(function (exam) {
      return applyTaskBlockToExam(exam, template);
    });
    showNotice("Aufgabenblock eingefügt: " + template.name);
  }

  function addBulkCriteria() {
    var parentId = getValue("bulk-parent-id") || null;
    var lines = getValue("bulk-criteria-text").split(/\r?\n/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
    if (!lines.length) {
      return;
    }
    mutateCurrentExam(function (exam) {
      lines.forEach(function (line) {
        var parts = line.split("|");
        var title = (parts[0] || "Neues Kriterium").trim();
        var points = Number((parts[1] || "1").trim());
        exam.structure.push({
          id: createId("node"),
          type: "criterion",
          parentId: parentId,
          sortIndex: exam.structure.length,
          title: title,
          shortLabel: "",
          richContent: title,
          printVisibility: "always",
          maxPoints: Number.isFinite(points) ? points : 1,
          isBonus: false,
          isScorable: true,
          variantScope: []
        });
      });
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
    clearValue("bulk-criteria-text");
  }

  function batchSetCriterionPercent(criterionId, percent) {
    mutateCurrentExam(function (exam) {
      getActiveStudents(exam).forEach(function (student) {
        setEvaluationValue(exam, student.id, criterionId, String(percent), "percent");
      });
      return exam;
    });
  }

  function batchSetStudentPercent(studentId, percent) {
    mutateCurrentExam(function (exam) {
      getCriterionNodes(exam.structure).forEach(function (criterion) {
        setEvaluationValue(exam, studentId, criterion.id, String(percent), "percent");
      });
      return exam;
    });
  }

  function updateMatrixValue(studentId, criterionId, rawValue) {
    ui.matrixFocus = { studentId: studentId, criterionId: criterionId };
    mutateCurrentExam(function (exam) {
      return setEvaluationValue(exam, studentId, criterionId, rawValue, ui.scoreMode);
    });
  }

  function applyPendingMaxChange(mode) {
    if (!ui.pendingMaxChange) {
      return;
    }
    var pending = ui.pendingMaxChange;
    mutateCurrentExam(function (exam) {
      return rescaleCriterionAfterMaxPointsChange(exam, pending.criterionId, pending.nextMaxPoints, mode);
    });
    ui.pendingMaxChange = null;
    render();
  }

  function focusMatrixByOffset(rowOffset, colOffset, input) {
    var row = Number(input.dataset.matrixRow);
    var col = Number(input.dataset.matrixCol);
    var target = appRoot.querySelector(`.matrix-input[data-matrix-row="${row + rowOffset}"][data-matrix-col="${col + colOffset}"]`);
    if (target) {
      target.focus();
      target.select();
    }
  }

  var eventTargetDataset = {};

  appRoot.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }
    eventTargetDataset = target.dataset || {};

    switch (target.dataset.action) {
      case "dismiss-notice":
        ui.notice = "";
        render();
        break;
      case "clear-archive":
        if (window.confirm("Lokales Archiv wirklich vollständig leeren?")) {
          store = createEmptyStore();
          saveStore();
          ui.activeTab = "archive";
          ui.notice = "";
          render();
        }
        break;
      case "switch-tab":
        ui.activeTab = target.dataset.tab;
        render();
        break;
      case "create-exam":
        handleCreateExam();
        break;
      case "seed-demo":
        handleSeedDemo();
        break;
      case "select-exam":
        store.currentExamId = target.dataset.examId;
        saveStore();
        ui.activeTab = "overview";
        render();
        break;
      case "delete-exam":
        if (window.confirm("Klausur wirklich löschen?")) {
          mutateStore(function (currentStore) {
            currentStore.exams = currentStore.exams.filter(function (exam) {
              return exam.metadata.id !== target.dataset.examId;
            });
            currentStore.currentExamId = currentStore.exams.length ? currentStore.exams[0].metadata.id : null;
            return currentStore;
          });
          ui.activeTab = "archive";
          render();
        }
        break;
      case "duplicate-exam":
        mutateStore(function (currentStore) {
          var source = currentStore.exams.find(function (exam) {
            return exam.metadata.id === target.dataset.examId;
          });
          if (!source) {
            return currentStore;
          }
          var copy = duplicateExamRecord(source);
          currentStore.exams.push(copy);
          currentStore.currentExamId = copy.metadata.id;
          return currentStore;
        });
        ui.activeTab = "overview";
        render();
        break;
      case "export-exam": {
        var exam = store.exams.find(function (entry) { return entry.metadata.id === target.dataset.examId; });
        if (exam) {
          downloadTextFile((exam.metadata.title || "klausur") + ".json", exportExamPayload(exam), "application/json");
        }
        break;
      }
      case "add-boundary":
        mutateCurrentExam(function (exam) {
          exam.metadata.notenschluesselPreset = "custom";
          exam.metadata.benutzerdefinierteNotengrenzen.push({ id: createId("grade"), label: "neu", minPercent: 0 });
          exam.metadata.benutzerdefinierteNotengrenzen = normalizeBoundaries(exam.metadata.benutzerdefinierteNotengrenzen);
          exam.metadata.updatedAt = nowIso();
          return exam;
        });
        break;
      case "remove-boundary":
        mutateCurrentExam(function (exam) {
          exam.metadata.notenschluesselPreset = "custom";
          exam.metadata.benutzerdefinierteNotengrenzen = (exam.metadata.benutzerdefinierteNotengrenzen || []).filter(function (boundary) {
            return boundary.id !== target.dataset.boundaryId;
          });
          exam.metadata.updatedAt = nowIso();
          return exam;
        });
        break;
      case "add-student":
        addStudentFromDraft();
        break;
      case "move-student":
        moveStudent(target.dataset.studentId, Number(target.dataset.direction));
        break;
      case "remove-student":
        removeStudent(target.dataset.studentId);
        break;
      case "save-class-list":
        saveCurrentClassList();
        break;
      case "apply-class-list":
        applySavedClassList();
        break;
      case "add-node":
        addNode(target.dataset.nodeType, target.dataset.parentId || null);
        break;
      case "remove-node":
        removeNode(target.dataset.nodeId);
        break;
      case "move-node":
        moveNode(target.dataset.nodeId, Number(target.dataset.direction));
        break;
      case "save-task-block":
        saveTaskBlock();
        break;
      case "insert-task-block":
        insertTaskBlock();
        break;
      case "add-bulk-criteria":
        addBulkCriteria();
        break;
      case "set-score-mode":
        ui.scoreMode = target.dataset.mode;
        render();
        break;
      case "set-criterion-percent":
        batchSetCriterionPercent(target.dataset.criterionId, Number(target.dataset.percent));
        break;
      case "set-student-percent":
        batchSetStudentPercent(target.dataset.studentId, Number(target.dataset.percent));
        break;
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
      case "close-modal":
        ui.pendingMaxChange = null;
        render();
        break;
      case "apply-max-change":
        applyPendingMaxChange(target.dataset.mode);
        break;
      default:
        break;
    }
  });

  appRoot.addEventListener("change", function (event) {
    var target = event.target;

    if (target.matches("[data-meta-field]")) {
      updateMetadataField(target.dataset.metaField, target.value);
      return;
    }

    if (target.matches("[data-boundary-id][data-boundary-field]")) {
      updateBoundary(target.dataset.boundaryId, target.dataset.boundaryField, target.value);
      return;
    }

    if (target.matches("[data-student-id][data-student-field]")) {
      updateStudentField(target.dataset.studentId, target.dataset.studentField, target.value, target.checked);
      return;
    }

    if (target.matches("[data-node-id][data-node-field]")) {
      updateNodeField(target.dataset.nodeId, target.dataset.nodeField, target.value, target.checked);
      return;
    }

    if (target.matches("[data-role='import-exam']") && target.files && target.files[0]) {
      readFileAsText(target.files[0]).then(function (text) {
        var importedExam = importExamPayload(text);
        importedExam.metadata.id = createId("exam");
        importedExam.metadata.createdAt = nowIso();
        importedExam.metadata.updatedAt = nowIso();
        mutateStore(function (currentStore) {
          currentStore.exams.push(importedExam);
          currentStore.currentExamId = importedExam.metadata.id;
          return currentStore;
        });
        ui.activeTab = "overview";
        showNotice("Importiert: " + importedExam.metadata.title);
      }).catch(function (error) {
        showNotice(error.message || "Import fehlgeschlagen.");
      }).finally(function () {
        target.value = "";
      });
      return;
    }

    if (target.matches("[data-role='import-students']") && target.files && target.files[0]) {
      readFileAsText(target.files[0]).then(function (text) {
        var students = parseStudentCsv(text);
        mutateCurrentExam(function (exam) {
          exam.students = students;
          exam.evaluations = {};
          exam.metadata.updatedAt = nowIso();
          return exam;
        });
        showNotice(students.length + " Schüler importiert.");
      }).catch(function (error) {
        showNotice(error.message || "CSV-Import fehlgeschlagen.");
      }).finally(function () {
        target.value = "";
      });
      return;
    }

    if (target.matches("[data-role='node-image']") && target.files && target.files[0]) {
      readFileAsDataUrl(target.files[0]).then(function (dataUrl) {
        mutateCurrentExam(function (exam) {
          exam.structure = exam.structure.map(function (node) {
            if (node.id !== target.dataset.nodeId) {
              return node;
            }
            var copy = deepClone(node);
            var append = "\n\n![" + target.files[0].name + "](" + dataUrl + ")";
            copy.richContent = (copy.richContent || "") + append;
            return copy;
          });
          exam.metadata.updatedAt = nowIso();
          return exam;
        });
      }).catch(function () {
        showNotice("Bild konnte nicht eingefügt werden.");
      }).finally(function () {
        target.value = "";
      });
    }
  });

  appRoot.addEventListener("input", function (event) {
    var target = event.target;
    if (target.matches(".matrix-input")) {
      updateMatrixValue(target.dataset.studentId, target.dataset.criterionId, target.value);
    }
  });

  appRoot.addEventListener("pointerdown", function (event) {
    var target = event.target;
    if (!target.matches("[data-role='resize-image']")) {
      return;
    }
    var shell = target.closest(".markdown-image-shell");
    var preview = target.closest(".markdown-preview");
    var image = shell ? shell.querySelector("img") : null;
    if (!shell || !preview || !image) {
      return;
    }
    event.preventDefault();
    ui.imageResize = {
      nodeId: target.dataset.nodeId,
      imageIndex: Number(target.dataset.imageIndex),
      startX: event.clientX,
      startWidth: image.getBoundingClientRect().width,
      maxWidth: Math.max(120, preview.clientWidth - 24),
      shell: shell,
      image: image
    };
    document.body.classList.add("image-resize-active");
  });

  window.addEventListener("pointermove", function (event) {
    if (!ui.imageResize) {
      return;
    }
    event.preventDefault();
    var nextWidth = Math.max(48, Math.min(ui.imageResize.maxWidth, ui.imageResize.startWidth + (event.clientX - ui.imageResize.startX)));
    ui.imageResize.image.style.width = Math.round(nextWidth) + "px";
  });

  window.addEventListener("pointerup", function () {
    if (!ui.imageResize) {
      return;
    }
    var finalWidth = Math.round(ui.imageResize.image.getBoundingClientRect().width);
    var nodeId = ui.imageResize.nodeId;
    var imageIndex = ui.imageResize.imageIndex;
    ui.imageResize = null;
    document.body.classList.remove("image-resize-active");
    updateNodeImageWidth(nodeId, imageIndex, finalWidth);
  });

  appRoot.addEventListener("keydown", function (event) {
    var target = event.target;
    if (!target.matches(".matrix-input")) {
      return;
    }
    if (event.key === "ArrowRight" || event.key === "Tab") {
      event.preventDefault();
      focusMatrixByOffset(0, 1, target);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusMatrixByOffset(0, -1, target);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "Enter") {
      event.preventDefault();
      focusMatrixByOffset(1, 0, target);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMatrixByOffset(-1, 0, target);
    }
  });

  appRoot.addEventListener("dragstart", function (event) {
    var row = event.target.closest("[data-node-id]");
    if (!row) {
      return;
    }
    ui.draggedNodeId = row.dataset.nodeId;
  });

  appRoot.addEventListener("dragover", function (event) {
    if (event.target.closest("[data-node-id]")) {
      event.preventDefault();
    }
  });

  appRoot.addEventListener("drop", function (event) {
    var row = event.target.closest("[data-node-id]");
    if (!row || !ui.draggedNodeId || ui.draggedNodeId === row.dataset.nodeId) {
      ui.draggedNodeId = null;
      return;
    }
    event.preventDefault();
    mutateCurrentExam(function (exam) {
      exam.structure = reorderLinear(exam.structure, ui.draggedNodeId, row.dataset.nodeId);
      exam.metadata.updatedAt = nowIso();
      return exam;
    });
    ui.draggedNodeId = null;
  });

  render();
})();






