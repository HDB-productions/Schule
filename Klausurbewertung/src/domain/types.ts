export type GradePresetId = "sek1" | "oberstufe" | "symbol" | "custom";
export type ScaleType = "grade" | "points" | "symbol";
export type VariantCode = "A" | "B" | "C" | string;
export type StructureNodeType =
  | "section"
  | "task"
  | "subtask"
  | "criterion"
  | "spacer"
  | "headingOnly";
export type PrintVisibility = "always" | "screenOnly" | "printOnly" | "hidden";
export type ScoreMode = "points" | "percent";
export type MaxPointsChangeMode = "absolute" | "proportional";

export interface GradeBoundary {
  id: string;
  label: string;
  minPercent: number;
}

export interface GradeScheme {
  presetId: GradePresetId;
  label: string;
  scaleType: ScaleType;
  boundaries: GradeBoundary[];
}

export interface ExamMetadata {
  id: string;
  title: string;
  schuljahr: string;
  fach: string;
  kursOderKlasse: string;
  termin: string;
  arbeitsNummer: string;
  thema: string;
  lehrkraft: string;
  lehrkraftKuerzel: string;
  notenschluesselPreset: GradePresetId;
  benutzerdefinierteNotengrenzen: GradeBoundary[];
  anzahlHilfsmittelfreierAufgaben?: number;
  aktivierteVarianten: VariantCode[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  vorname: string;
  nachname: string;
  displayName: string;
  variante?: VariantCode;
  aktiv: boolean;
  sortIndex: number;
}

export interface StructureNode {
  id: string;
  type: StructureNodeType;
  parentId: string | null;
  sortIndex: number;
  title: string;
  shortLabel?: string;
  richContent: string;
  printVisibility: PrintVisibility;
  maxPoints?: number;
  isBonus?: boolean;
  isScorable?: boolean;
  variantScope?: VariantCode[];
}

export interface EvaluationEntry {
  studentId: string;
  criterionId: string;
  scoreModeUsedLast: ScoreMode;
  rawInputValue: string;
  achievedPoints: number;
  derivedPercent: number;
  isUnset: boolean;
  updatedAt: string;
}

export interface ExamRecord {
  metadata: ExamMetadata;
  students: Student[];
  structure: StructureNode[];
  evaluations: Record<string, EvaluationEntry>;
}

export interface TaskBlockTemplate {
  id: string;
  name: string;
  createdAt: string;
  nodes: StructureNode[];
}

export interface ClassListTemplate {
  id: string;
  name: string;
  createdAt: string;
  students: Omit<Student, "id" | "sortIndex">[];
}

export interface AppStore {
  version: 1;
  currentExamId: string | null;
  exams: ExamRecord[];
  taskBlockLibrary: TaskBlockTemplate[];
  classListLibrary: ClassListTemplate[];
}

export interface StudentTotals {
  regularAchieved: number;
  bonusAchieved: number;
  totalAchieved: number;
  maxRegular: number;
  percent: number;
  gradeLabel: string;
}
