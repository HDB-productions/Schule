import { gradePresets } from "../domain/gradePresets";
import { createEmptyStore } from "../domain/logic";
import { AppStore, ClassListTemplate, ExamRecord, StructureNode, TaskBlockTemplate } from "../domain/types";
import { createId } from "../lib/utils";

const STORAGE_KEY = "klausurbewertung.store.v1";

const now = () => new Date().toISOString();

const cloneSekIBoundaries = () =>
  gradePresets.sek1.boundaries.map((boundary) => ({ ...boundary, id: createId("grade") }));

const createDemoStructure = (): StructureNode[] => {
  const section1 = createId("node");
  const task1 = createId("node");
  const task2 = createId("node");
  const criterion1 = createId("node");
  const criterion2 = createId("node");
  const criterion3 = createId("node");
  const criterion4 = createId("node");
  return [
    {
      id: section1,
      type: "section",
      parentId: null,
      sortIndex: 0,
      title: "Hilfsmittelfreier Teil",
      richContent: "",
      printVisibility: "always"
    },
    {
      id: task1,
      type: "task",
      parentId: section1,
      sortIndex: 1,
      title: "Aufgabe 1",
      richContent: "Terme vereinfachen und Ergebnisse begründen.",
      printVisibility: "always"
    },
    {
      id: criterion1,
      type: "criterion",
      parentId: task1,
      sortIndex: 2,
      title: "Rechenweg nachvollziehbar",
      richContent: "Alle Zwischenschritte sind sauber notiert.",
      printVisibility: "always",
      maxPoints: 3,
      isBonus: false,
      isScorable: true
    },
    {
      id: criterion2,
      type: "criterion",
      parentId: task1,
      sortIndex: 3,
      title: "Ergebnis korrekt",
      richContent: "Das Endergebnis stimmt vollständig.",
      printVisibility: "always",
      maxPoints: 2,
      isBonus: false,
      isScorable: true
    },
    {
      id: task2,
      type: "task",
      parentId: null,
      sortIndex: 4,
      title: "Aufgabe 2",
      richContent: "Geometrische Anwendung mit kurzer Begründung.",
      printVisibility: "always"
    },
    {
      id: criterion3,
      type: "criterion",
      parentId: task2,
      sortIndex: 5,
      title: "Skizze und Ansatz",
      richContent: "Geeignete Skizze mit passenden Bezeichnungen.",
      printVisibility: "always",
      maxPoints: 4,
      isBonus: false,
      isScorable: true
    },
    {
      id: criterion4,
      type: "criterion",
      parentId: task2,
      sortIndex: 6,
      title: "Bonus: eleganter Lösungsweg",
      richContent: "Alternative oder besonders effiziente Lösungsidee.",
      printVisibility: "always",
      maxPoints: 1,
      isBonus: true,
      isScorable: true
    }
  ];
};

export const createDemoExam = (): ExamRecord => {
  const createdAt = now();
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
      notenschluesselPreset: "sek1",
      benutzerdefinierteNotengrenzen: cloneSekIBoundaries(),
      anzahlHilfsmittelfreierAufgaben: 1,
      aktivierteVarianten: ["A", "B"],
      createdAt,
      updatedAt: createdAt
    },
    students: [
      {
        id: createId("student"),
        vorname: "Anna",
        nachname: "Beispiel",
        displayName: "Anna Beispiel",
        aktiv: true,
        sortIndex: 0,
        variante: "A"
      },
      {
        id: createId("student"),
        vorname: "Ben",
        nachname: "Muster",
        displayName: "Ben Muster",
        aktiv: true,
        sortIndex: 1,
        variante: "B"
      }
    ],
    structure: createDemoStructure(),
    evaluations: {}
  };
};

const sanitizeStore = (store: AppStore): AppStore => {
  const exams = Array.isArray(store.exams) ? store.exams : [];
  const currentExamId = exams.some((exam) => exam.metadata.id === store.currentExamId)
    ? store.currentExamId
    : exams[0]?.metadata.id ?? null;

  return {
    version: 1,
    currentExamId,
    exams,
    taskBlockLibrary: Array.isArray(store.taskBlockLibrary) ? store.taskBlockLibrary : [],
    classListLibrary: Array.isArray(store.classListLibrary) ? store.classListLibrary : []
  };
};

export const loadStore = (): AppStore => {
  const emptyStore = createEmptyStore();

  if (typeof window === "undefined") {
    return emptyStore;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const demoExam = createDemoExam();
    return {
      version: 1,
      currentExamId: demoExam.metadata.id,
      exams: [demoExam],
      taskBlockLibrary: [],
      classListLibrary: []
    };
  }

  try {
    return sanitizeStore(JSON.parse(raw) as AppStore);
  } catch {
    return emptyStore;
  }
};

export const saveStore = (store: AppStore): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const exportExamPayload = (exam: ExamRecord): string => JSON.stringify(exam, null, 2);

export const importExamPayload = (raw: string): ExamRecord => {
  const parsed = JSON.parse(raw) as ExamRecord;
  if (!parsed?.metadata?.id || !Array.isArray(parsed.students) || !Array.isArray(parsed.structure)) {
    throw new Error("Die JSON-Datei ist kein gültiger Klausurexport.");
  }
  return parsed;
};

export const createTaskBlockTemplate = (name: string, nodes: StructureNode[]): TaskBlockTemplate => ({
  id: createId("block"),
  name,
  createdAt: now(),
  nodes
});

export const createClassListTemplate = (
  name: string,
  students: ClassListTemplate["students"]
): ClassListTemplate => ({
  id: createId("classlist"),
  name,
  createdAt: now(),
  students
});
