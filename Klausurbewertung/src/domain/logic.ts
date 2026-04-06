import { getGradeScheme } from "./gradePresets";
import {
  AppStore,
  EvaluationEntry,
  ExamMetadata,
  ExamRecord,
  GradeBoundary,
  GradeScheme,
  MaxPointsChangeMode,
  ScoreMode,
  Student,
  StudentTotals,
  StructureNode
} from "./types";
import { createId, sortBySortIndex } from "../lib/utils";

export const evaluationKey = (studentId: string, criterionId: string): string =>
  `${studentId}::${criterionId}`;

export const roundDownToHalf = (value: number): number => Math.floor(Math.max(value, 0) * 2) / 2;

export const normalizePointsInput = (value: number, maxPoints: number): number => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const rounded = Math.round(safeValue * 2) / 2;
  return Math.max(0, Math.min(rounded, maxPoints));
};

export const percentToPoints = (percent: number, maxPoints: number): number => {
  const safePercent = Number.isFinite(percent) ? Math.max(percent, 0) : 0;
  const rawPoints = (safePercent / 100) * maxPoints;
  return Math.min(roundDownToHalf(rawPoints), maxPoints);
};

export const pointsToPercent = (achievedPoints: number, maxPoints: number): number => {
  if (maxPoints <= 0) {
    return 0;
  }

  return Number(((achievedPoints / maxPoints) * 100).toFixed(2));
};

export const getGradeFromPercent = (percent: number, scheme: GradeScheme): string => {
  const sortedBoundaries = scheme.boundaries
    .slice()
    .sort((left, right) => right.minPercent - left.minPercent);
  const match = sortedBoundaries.find((boundary) => percent >= boundary.minPercent);
  return match?.label ?? sortedBoundaries.at(-1)?.label ?? "";
};

export const resolveGradeScheme = (metadata: ExamMetadata): GradeScheme =>
  getGradeScheme(metadata.notenschluesselPreset, metadata.benutzerdefinierteNotengrenzen);

export const sortStructure = (nodes: StructureNode[]): StructureNode[] =>
  nodes
    .slice()
    .sort((left, right) => left.sortIndex - right.sortIndex || left.title.localeCompare(right.title));

export const getChildrenMap = (nodes: StructureNode[]): Record<string, StructureNode[]> => {
  const map: Record<string, StructureNode[]> = {};

  sortStructure(nodes).forEach((node) => {
    const key = node.parentId ?? "__root__";
    map[key] ??= [];
    map[key].push(node);
  });

  return map;
};

export const flattenStructure = (nodes: StructureNode[]): Array<StructureNode & { depth: number }> => {
  const childrenMap = getChildrenMap(nodes);
  const result: Array<StructureNode & { depth: number }> = [];

  const visit = (parentId: string | null, depth: number): void => {
    const key = parentId ?? "__root__";
    const children = childrenMap[key] ?? [];
    children.forEach((child) => {
      result.push({ ...child, depth });
      visit(child.id, depth + 1);
    });
  };

  visit(null, 0);
  return result;
};

export const getCriterionNodes = (nodes: StructureNode[]): StructureNode[] =>
  flattenStructure(nodes).filter((node) => node.isScorable && node.type === "criterion");

export const getCriterionById = (nodes: StructureNode[], criterionId: string): StructureNode | undefined =>
  nodes.find((node) => node.id === criterionId && node.isScorable);

export const createEvaluationEntry = (
  studentId: string,
  criterion: StructureNode,
  mode: ScoreMode = "points"
): EvaluationEntry => ({
  studentId,
  criterionId: criterion.id,
  scoreModeUsedLast: mode,
  rawInputValue: "",
  achievedPoints: 0,
  derivedPercent: 0,
  isUnset: true,
  updatedAt: new Date().toISOString()
});

export const setEvaluationValue = (
  exam: ExamRecord,
  studentId: string,
  criterionId: string,
  rawValue: string,
  mode: ScoreMode
): ExamRecord => {
  const criterion = getCriterionById(exam.structure, criterionId);
  if (!criterion || !criterion.isScorable) {
    return exam;
  }

  const maxPoints = criterion.maxPoints ?? 0;
  const numericValue = Number(rawValue.replace(",", "."));
  const points =
    mode === "percent" ? percentToPoints(numericValue, maxPoints) : normalizePointsInput(numericValue, maxPoints);

  const nextEntry: EvaluationEntry = {
    studentId,
    criterionId,
    scoreModeUsedLast: mode,
    rawInputValue: rawValue,
    achievedPoints: points,
    derivedPercent: pointsToPercent(points, maxPoints),
    isUnset: rawValue.trim() === "",
    updatedAt: new Date().toISOString()
  };

  return {
    ...exam,
    metadata: {
      ...exam.metadata,
      updatedAt: new Date().toISOString()
    },
    evaluations: {
      ...exam.evaluations,
      [evaluationKey(studentId, criterionId)]: nextEntry
    }
  };
};

const getDescendantCriterionIds = (nodes: StructureNode[], parentId: string): string[] => {
  const childrenMap = getChildrenMap(nodes);
  const result: string[] = [];

  const visit = (currentId: string): void => {
    const children = childrenMap[currentId] ?? [];
    children.forEach((child) => {
      if (child.isScorable && child.type === "criterion") {
        result.push(child.id);
      }
      visit(child.id);
    });
  };

  visit(parentId);
  return result;
};

export const getStudentTotals = (exam: ExamRecord, studentId: string): StudentTotals => {
  const criteria = getCriterionNodes(exam.structure);
  let regularAchieved = 0;
  let bonusAchieved = 0;
  let maxRegular = 0;

  criteria.forEach((criterion) => {
    const entry = exam.evaluations[evaluationKey(studentId, criterion.id)];
    const achievedPoints = entry?.achievedPoints ?? 0;
    if (criterion.isBonus) {
      bonusAchieved += achievedPoints;
    } else {
      regularAchieved += achievedPoints;
      maxRegular += criterion.maxPoints ?? 0;
    }
  });

  const totalAchieved = regularAchieved + bonusAchieved;
  const percent = maxRegular > 0 ? Number(((totalAchieved / maxRegular) * 100).toFixed(2)) : 0;
  const gradeLabel = getGradeFromPercent(percent, resolveGradeScheme(exam.metadata));

  return {
    regularAchieved: Number(regularAchieved.toFixed(2)),
    bonusAchieved: Number(bonusAchieved.toFixed(2)),
    totalAchieved: Number(totalAchieved.toFixed(2)),
    maxRegular: Number(maxRegular.toFixed(2)),
    percent,
    gradeLabel
  };
};

export const getNodeTotalsForStudent = (
  exam: ExamRecord,
  nodeId: string,
  studentId: string
): { achieved: number; max: number } => {
  const node = exam.structure.find((entry) => entry.id === nodeId);
  if (!node) {
    return { achieved: 0, max: 0 };
  }

  const relevantCriterionIds =
    node.isScorable && node.type === "criterion" ? [nodeId] : getDescendantCriterionIds(exam.structure, nodeId);

  return relevantCriterionIds.reduce(
    (accumulator, criterionId) => {
      const criterion = getCriterionById(exam.structure, criterionId);
      if (!criterion) {
        return accumulator;
      }
      const achieved = exam.evaluations[evaluationKey(studentId, criterionId)]?.achievedPoints ?? 0;
      accumulator.achieved += achieved;
      accumulator.max += criterion.isBonus ? 0 : criterion.maxPoints ?? 0;
      return accumulator;
    },
    { achieved: 0, max: 0 }
  );
};

export const summarizeExam = (exam: ExamRecord): {
  studentSummaries: Array<{ student: Student; totals: StudentTotals }>;
  maxRegularPoints: number;
  averagePercent: number;
  distribution: Record<string, number>;
} => {
  const activeStudents = sortBySortIndex(exam.students).filter((student) => student.aktiv);
  const studentSummaries = activeStudents.map((student) => ({
    student,
    totals: getStudentTotals(exam, student.id)
  }));
  const scheme = resolveGradeScheme(exam.metadata);
  const distribution = studentSummaries.reduce<Record<string, number>>((map, entry) => {
    map[entry.totals.gradeLabel] = (map[entry.totals.gradeLabel] ?? 0) + 1;
    return map;
  }, Object.fromEntries(scheme.boundaries.map((boundary) => [boundary.label, 0])));

  const averagePercent =
    studentSummaries.length === 0
      ? 0
      : Number(
          (
            studentSummaries.reduce((sum, entry) => sum + entry.totals.percent, 0) / studentSummaries.length
          ).toFixed(2)
        );

  const maxRegularPoints = getCriterionNodes(exam.structure)
    .filter((criterion) => !criterion.isBonus)
    .reduce((sum, criterion) => sum + (criterion.maxPoints ?? 0), 0);

  return {
    studentSummaries,
    maxRegularPoints,
    averagePercent,
    distribution
  };
};

export const rescaleCriterionAfterMaxPointsChange = (
  exam: ExamRecord,
  criterionId: string,
  nextMaxPoints: number,
  mode: MaxPointsChangeMode
): ExamRecord => {
  const criterion = getCriterionById(exam.structure, criterionId);
  if (!criterion) {
    return exam;
  }

  const previousMaxPoints = criterion.maxPoints ?? 0;
  const structure = exam.structure.map((node) =>
    node.id === criterionId ? { ...node, maxPoints: nextMaxPoints } : node
  );

  const evaluations = { ...exam.evaluations };

  Object.values(evaluations).forEach((entry) => {
    if (entry.criterionId !== criterionId || entry.isUnset) {
      return;
    }

    const nextPoints =
      mode === "proportional" && previousMaxPoints > 0
        ? percentToPoints((entry.achievedPoints / previousMaxPoints) * 100, nextMaxPoints)
        : Math.min(entry.achievedPoints, nextMaxPoints);

    evaluations[evaluationKey(entry.studentId, criterionId)] = {
      ...entry,
      achievedPoints: nextPoints,
      derivedPercent: pointsToPercent(nextPoints, nextMaxPoints),
      rawInputValue:
        entry.scoreModeUsedLast === "percent"
          ? String(pointsToPercent(nextPoints, nextMaxPoints))
          : String(nextPoints),
      updatedAt: new Date().toISOString()
    };
  });

  return {
    ...exam,
    metadata: {
      ...exam.metadata,
      updatedAt: new Date().toISOString()
    },
    structure,
    evaluations
  };
};

export const getPassingThreshold = (metadata: ExamMetadata): number => {
  switch (metadata.notenschluesselPreset) {
    case "oberstufe":
      return 20;
    case "sek1":
    case "symbol":
      return 50;
    case "custom": {
      const custom = metadata.benutzerdefinierteNotengrenzen
        .slice()
        .sort((left, right) => right.minPercent - left.minPercent);
      return custom.at(-2)?.minPercent ?? 50;
    }
    default:
      return 50;
  }
};

export const getHighlightState = (
  metadata: ExamMetadata,
  percent: number | null
): "missing" | "weak" | "strong" | "normal" => {
  if (percent === null) {
    return "missing";
  }
  const passingThreshold = getPassingThreshold(metadata);
  const strongThreshold = resolveGradeScheme(metadata).boundaries[1]?.minPercent ?? 75;

  if (percent < passingThreshold) {
    return "weak";
  }
  if (percent >= strongThreshold) {
    return "strong";
  }
  return "normal";
};

export const normalizeBoundaries = (boundaries: GradeBoundary[]): GradeBoundary[] =>
  boundaries
    .map((boundary) => ({
      ...boundary,
      minPercent: Number(boundary.minPercent)
    }))
    .sort((left, right) => right.minPercent - left.minPercent);

export const renumberSortIndices = <T extends { sortIndex: number }>(items: T[]): T[] =>
  items.map((item, index) => ({ ...item, sortIndex: index }));

export const duplicateExamRecord = (exam: ExamRecord): ExamRecord => {
  const structureIdMap = new Map<string, string>();
  const mapStructureId = (id: string): string => {
    const existing = structureIdMap.get(id);
    if (existing) {
      return existing;
    }
    const nextId = createId("node");
    structureIdMap.set(id, nextId);
    return nextId;
  };

  const studentIdMap = new Map<string, string>();
  const mapStudentId = (id: string): string => {
    const existing = studentIdMap.get(id);
    if (existing) {
      return existing;
    }
    const nextId = createId("student");
    studentIdMap.set(id, nextId);
    return nextId;
  };

  const structure = exam.structure.map((node) => ({
    ...node,
    id: mapStructureId(node.id),
    parentId: node.parentId ? mapStructureId(node.parentId) : null
  }));

  const students = exam.students.map((student) => ({
    ...student,
    id: mapStudentId(student.id)
  }));

  const evaluations = Object.values(exam.evaluations).reduce<Record<string, EvaluationEntry>>((map, entry) => {
    const nextEntry = {
      ...entry,
      studentId: mapStudentId(entry.studentId),
      criterionId: mapStructureId(entry.criterionId)
    };
    map[evaluationKey(nextEntry.studentId, nextEntry.criterionId)] = nextEntry;
    return map;
  }, {});

  return {
    metadata: {
      ...exam.metadata,
      id: createId("exam"),
      title: `${exam.metadata.title} (Kopie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    structure,
    students,
    evaluations
  };
};

export const createEmptyStore = (): AppStore => ({
  version: 1,
  currentExamId: null,
  exams: [],
  taskBlockLibrary: [],
  classListLibrary: []
});
