import { useEffect, useMemo, useState } from "react";
import { gradePresets } from "../domain/gradePresets";
import {
  createEmptyStore,
  duplicateExamRecord,
  getCriterionById,
  getCriterionNodes,
  normalizeBoundaries,
  renumberSortIndices,
  rescaleCriterionAfterMaxPointsChange,
  setEvaluationValue
} from "../domain/logic";
import {
  AppStore,
  ClassListTemplate,
  ExamMetadata,
  ExamRecord,
  MaxPointsChangeMode,
  ScoreMode,
  StructureNode,
  StructureNodeType,
  TaskBlockTemplate
} from "../domain/types";
import { parseStudentCsv } from "../lib/csv";
import { createId, deepClone, downloadTextFile, readFileAsText } from "../lib/utils";
import {
  createClassListTemplate,
  createDemoExam,
  createTaskBlockTemplate,
  exportExamPayload,
  importExamPayload,
  loadStore,
  saveStore
} from "../store/repository";
import { ArchiveView } from "./ArchiveView";
import { EvaluationMatrix } from "./EvaluationMatrix";
import { MetadataPanel } from "./MetadataPanel";
import { Modal } from "./Modal";
import { OverviewPanel } from "./OverviewPanel";
import { PrintView } from "./PrintView";
import { StudentManager } from "./StudentManager";
import { StructureEditor } from "./StructureEditor";

type AppTab = "archive" | "overview" | "metadata" | "students" | "structure" | "matrix" | "print";

const now = () => new Date().toISOString();

const cloneSekIBoundaries = () =>
  gradePresets.sek1.boundaries.map((boundary) => ({ ...boundary, id: createId("grade") }));

const createBlankExam = (): ExamRecord => {
  const createdAt = now();
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
      notenschluesselPreset: "sek1",
      benutzerdefinierteNotengrenzen: cloneSekIBoundaries(),
      aktivierteVarianten: ["A", "B"],
      createdAt,
      updatedAt: createdAt
    },
    students: [],
    structure: [],
    evaluations: {}
  };
};

const cloneTaskBlockIntoExam = (exam: ExamRecord, template: TaskBlockTemplate): StructureNode[] => {
  const idMap = new Map<string, string>();
  const includedIds = new Set(template.nodes.map((node) => node.id));
  const rootIds = new Set(
    template.nodes
      .filter((node) => !node.parentId || !includedIds.has(node.parentId))
      .map((node) => node.id)
  );

  const mapId = (id: string): string => {
    const existing = idMap.get(id);
    if (existing) {
      return existing;
    }
    const nextId = createId("node");
    idMap.set(id, nextId);
    return nextId;
  };

  const offset = exam.structure.length;
  const appended = template.nodes.map((node, index) => ({
    ...node,
    id: mapId(node.id),
    parentId: !node.parentId || rootIds.has(node.id) || !includedIds.has(node.parentId) ? null : mapId(node.parentId),
    sortIndex: offset + index
  }));

  return [...exam.structure, ...appended];
};

const collectTaskBlockNodes = (structure: StructureNode[], nodeId: string | null): StructureNode[] => {
  if (!nodeId) {
    return structure;
  }

  const ids = new Set<string>([nodeId]);
  let changed = true;
  while (changed) {
    changed = false;
    structure.forEach((node) => {
      if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    });
  }

  return structure.filter((node) => ids.has(node.id));
};

const buildClassTemplatePayload = (exam: ExamRecord): ClassListTemplate["students"] =>
  exam.students.map((student) => ({
    vorname: student.vorname,
    nachname: student.nachname,
    displayName: student.displayName,
    aktiv: student.aktiv,
    variante: student.variante
  }));

export const App = () => {
  const [store, setStore] = useState<AppStore>(() => loadStore());
  const [activeTab, setActiveTab] = useState<AppTab>("archive");
  const [scoreMode, setScoreMode] = useState<ScoreMode>("points");
  const [notice, setNotice] = useState("");
  const [pendingMaxChange, setPendingMaxChange] = useState<null | { criterionId: string; nextMaxPoints: number }>(null);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const currentExam = useMemo(
    () => store.exams.find((exam) => exam.metadata.id === store.currentExamId) ?? null,
    [store]
  );

  const mutateStore = (recipe: (current: AppStore) => AppStore) => {
    setStore((current) => recipe(deepClone(current)));
  };

  const mutateCurrentExam = (recipe: (exam: ExamRecord) => ExamRecord) => {
    if (!currentExam) {
      return;
    }
    mutateStore((current) => ({
      ...current,
      exams: current.exams.map((exam) => (exam.metadata.id === currentExam.metadata.id ? recipe(exam) : exam))
    }));
  };

  const createExam = () => {
    const exam = createBlankExam();
    mutateStore((current) => ({
      ...current,
      currentExamId: exam.metadata.id,
      exams: [...current.exams, exam]
    }));
    setActiveTab("metadata");
  };

  const selectExam = (examId: string) => {
    mutateStore((current) => ({ ...current, currentExamId: examId }));
    setActiveTab("overview");
  };

  const deleteExam = (examId: string) => {
    if (!window.confirm("Klausur wirklich löschen?")) {
      return;
    }
    mutateStore((current) => {
      const exams = current.exams.filter((exam) => exam.metadata.id !== examId);
      return {
        ...current,
        exams,
        currentExamId: current.currentExamId === examId ? exams[0]?.metadata.id ?? null : current.currentExamId
      };
    });
    setActiveTab("archive");
  };

  const duplicateExam = (examId: string) => {
    const exam = store.exams.find((entry) => entry.metadata.id === examId);
    if (!exam) {
      return;
    }
    const duplicate = duplicateExamRecord(exam);
    mutateStore((current) => ({
      ...current,
      currentExamId: duplicate.metadata.id,
      exams: [...current.exams, duplicate]
    }));
    setActiveTab("overview");
  };

  const exportExam = (examId: string) => {
    const exam = store.exams.find((entry) => entry.metadata.id === examId);
    if (!exam) {
      return;
    }
    downloadTextFile(`${exam.metadata.title || "klausur"}.json`, exportExamPayload(exam), "application/json");
  };

  const importExam = async (file: File) => {
    const text = await readFileAsText(file);
    const exam = importExamPayload(text);
    const nextExam = {
      ...exam,
      metadata: {
        ...exam.metadata,
        id: createId("exam"),
        updatedAt: now(),
        createdAt: now()
      }
    };
    mutateStore((current) => ({
      ...current,
      exams: [...current.exams, nextExam],
      currentExamId: nextExam.metadata.id
    }));
    setActiveTab("overview");
    setNotice(`Importiert: ${nextExam.metadata.title}`);
  };

  const importStudents = async (file: File) => {
    try {
      const text = await readFileAsText(file);
      const students = parseStudentCsv(text);
      mutateCurrentExam((exam) => ({
        ...exam,
        students,
        evaluations: {},
        metadata: { ...exam.metadata, updatedAt: now() }
      }));
      setNotice(`${students.length} Schüler importiert.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "CSV-Import fehlgeschlagen.");
    }
  };

  const updateMetadata = (metadata: ExamMetadata) => {
    mutateCurrentExam((exam) => ({
      ...exam,
      metadata: {
        ...metadata,
        benutzerdefinierteNotengrenzen: normalizeBoundaries(metadata.benutzerdefinierteNotengrenzen),
        updatedAt: now()
      }
    }));
  };

  const updateStudents = (students: ExamRecord["students"]) => {
    mutateCurrentExam((exam) => ({
      ...exam,
      students: students.map((student, index) => ({ ...student, sortIndex: index })),
      metadata: { ...exam.metadata, updatedAt: now() }
    }));
  };

  const saveClassList = (name: string) => {
    if (!currentExam) {
      return;
    }
    const template = createClassListTemplate(name, buildClassTemplatePayload(currentExam));
    mutateStore((current) => ({
      ...current,
      classListLibrary: [template, ...current.classListLibrary]
    }));
    setNotice(`Klassenliste gespeichert: ${name}`);
  };

  const applyClassList = (templateId: string) => {
    const template = store.classListLibrary.find((entry) => entry.id === templateId);
    if (!template) {
      return;
    }
    const students = template.students.map((student, index) => ({
      ...student,
      id: createId("student"),
      sortIndex: index
    }));
    mutateCurrentExam((exam) => ({
      ...exam,
      students,
      evaluations: {},
      metadata: { ...exam.metadata, updatedAt: now() }
    }));
    setNotice(`Klassenliste angewendet: ${template.name}`);
  };

  const updateStructure = (structure: StructureNode[]) => {
    mutateCurrentExam((exam) => ({
      ...exam,
      structure: renumberSortIndices(structure),
      metadata: { ...exam.metadata, updatedAt: now() }
    }));
  };

  const addNode = (type: StructureNodeType, parentId: string | null) => {
    mutateCurrentExam((exam) => ({
      ...exam,
      structure: [
        ...exam.structure,
        {
          id: createId("node"),
          type,
          parentId,
          sortIndex: exam.structure.length,
          title: type === "criterion" ? "Neues Kriterium" : "Neuer Block",
          richContent: "",
          printVisibility: "always",
          maxPoints: type === "criterion" ? 1 : undefined,
          isBonus: false,
          isScorable: type === "criterion"
        }
      ],
      metadata: { ...exam.metadata, updatedAt: now() }
    }));
  };

  const saveTaskBlock = (name: string, nodeId: string | null) => {
    if (!currentExam) {
      return;
    }
    const nodes = collectTaskBlockNodes(currentExam.structure, nodeId);
    const template = createTaskBlockTemplate(name, nodes);
    mutateStore((current) => ({
      ...current,
      taskBlockLibrary: [template, ...current.taskBlockLibrary]
    }));
    setNotice(`Aufgabenblock gespeichert: ${name}`);
  };

  const insertTaskBlock = (templateId: string) => {
    const template = store.taskBlockLibrary.find((entry) => entry.id === templateId);
    if (!template) {
      return;
    }
    mutateCurrentExam((exam) => ({
      ...exam,
      structure: cloneTaskBlockIntoExam(exam, template),
      metadata: { ...exam.metadata, updatedAt: now() }
    }));
    setNotice(`Aufgabenblock eingefügt: ${template.name}`);
  };

  const requestMaxPointsChange = (criterionId: string, nextMaxPoints: number) => {
    const clampedNextValue = Math.max(0, Number.isFinite(nextMaxPoints) ? nextMaxPoints : 0);
    if (!currentExam) {
      return;
    }
    const criterion = getCriterionById(currentExam.structure, criterionId);
    if (!criterion || criterion.maxPoints === clampedNextValue) {
      return;
    }

    const hasExistingEntries = Object.values(currentExam.evaluations).some(
      (entry) => entry.criterionId === criterionId && !entry.isUnset
    );

    if (!hasExistingEntries) {
      updateStructure(
        currentExam.structure.map((node) =>
          node.id === criterionId ? { ...node, maxPoints: clampedNextValue } : node
        )
      );
      return;
    }

    setPendingMaxChange({ criterionId, nextMaxPoints: clampedNextValue });
  };

  const applyMaxPointsChange = (mode: MaxPointsChangeMode) => {
    if (!pendingMaxChange) {
      return;
    }
    mutateCurrentExam((exam) =>
      rescaleCriterionAfterMaxPointsChange(exam, pendingMaxChange.criterionId, pendingMaxChange.nextMaxPoints, mode)
    );
    setPendingMaxChange(null);
  };

  const setEvaluation = (studentId: string, criterionId: string, rawValue: string, mode: ScoreMode) => {
    mutateCurrentExam((exam) => setEvaluationValue(exam, studentId, criterionId, rawValue, mode));
  };

  const batchSetCriterionPercent = (criterionId: string, percent: number) => {
    if (!currentExam) {
      return;
    }
    let nextExam = currentExam;
    currentExam.students
      .filter((student) => student.aktiv)
      .forEach((student) => {
        nextExam = setEvaluationValue(nextExam, student.id, criterionId, String(percent), "percent");
      });
    mutateCurrentExam(() => nextExam);
  };

  const batchSetStudentPercent = (studentId: string, percent: number) => {
    if (!currentExam) {
      return;
    }
    let nextExam = currentExam;
    getCriterionNodes(currentExam.structure).forEach((criterion) => {
      nextExam = setEvaluationValue(nextExam, studentId, criterion.id, String(percent), "percent");
    });
    mutateCurrentExam(() => nextExam);
  };

  const seedDemo = () => {
    const demo = createDemoExam();
    setStore({
      version: 1,
      currentExamId: demo.metadata.id,
      exams: [demo],
      taskBlockLibrary: [],
      classListLibrary: []
    });
    setActiveTab("overview");
  };

  const clearArchive = () => {
    if (!window.confirm("Lokales Archiv wirklich vollständig leeren?")) {
      return;
    }
    setStore(createEmptyStore());
    setActiveTab("archive");
  };

  if (!store.exams.length) {
    return (
      <main className="app-shell">
        <header className="topbar">
          <div>
            <h1>Klausurbewertung</h1>
            <p className="muted-text">Lokales Werkzeug zur Korrektur von Klassenarbeiten und Klausuren.</p>
          </div>
          <button type="button" className="primary-button" onClick={seedDemo}>
            Demo anlegen
          </button>
        </header>
      </main>
    );
  }

  const tabs: Array<{ id: AppTab; label: string }> = [
    { id: "archive", label: "Archiv" },
    { id: "overview", label: "Übersicht" },
    { id: "metadata", label: "Stammdaten" },
    { id: "students", label: "Schüler" },
    { id: "structure", label: "Erwartungshorizont" },
    { id: "matrix", label: "Matrix" },
    { id: "print", label: "Druck" }
  ];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Klausurbewertung</h1>
          <p className="muted-text">Lokal-first, statisch und für den Korrekturalltag ausgelegt.</p>
        </div>
        <div className="inline-actions wrap-actions">
          {currentExam ? <strong>{currentExam.metadata.title || "Neue Klausur"}</strong> : null}
          <button type="button" className="secondary-button" onClick={clearArchive}>
            Archiv leeren
          </button>
        </div>
      </header>

      <nav className="tabbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "tab-active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {notice ? <div className="notice-banner">{notice}</div> : null}

      {activeTab === "archive" ? (
        <ArchiveView
          exams={store.exams}
          currentExamId={store.currentExamId}
          onCreate={createExam}
          onSelect={selectExam}
          onDuplicate={duplicateExam}
          onDelete={deleteExam}
          onExport={exportExam}
          onImport={(file) => void importExam(file)}
        />
      ) : currentExam ? (
        <>
          {activeTab === "overview" ? <OverviewPanel exam={currentExam} /> : null}
          {activeTab === "metadata" ? <MetadataPanel metadata={currentExam.metadata} onChange={updateMetadata} /> : null}
          {activeTab === "students" ? (
            <StudentManager
              students={currentExam.students}
              availableVariants={currentExam.metadata.aktivierteVarianten}
              classListLibrary={store.classListLibrary}
              onChange={updateStudents}
              onImportCsv={(file) => void importStudents(file)}
              onSaveClassList={saveClassList}
              onApplyClassList={applyClassList}
            />
          ) : null}
          {activeTab === "structure" ? (
            <StructureEditor
              structure={currentExam.structure}
              taskBlockLibrary={store.taskBlockLibrary}
              onChange={updateStructure}
              onAddNode={addNode}
              onRequestMaxPointsChange={requestMaxPointsChange}
              onSaveTaskBlock={saveTaskBlock}
              onInsertTaskBlock={insertTaskBlock}
            />
          ) : null}
          {activeTab === "matrix" ? (
            <EvaluationMatrix
              exam={currentExam}
              scoreMode={scoreMode}
              onScoreModeChange={setScoreMode}
              onSetEvaluation={setEvaluation}
              onBatchSetCriterionPercent={batchSetCriterionPercent}
              onBatchSetStudentPercent={batchSetStudentPercent}
            />
          ) : null}
          {activeTab === "print" ? <PrintView exam={currentExam} /> : null}
        </>
      ) : null}

      <Modal open={Boolean(pendingMaxChange)} title="Maximalpunkte ändern" onClose={() => setPendingMaxChange(null)}>
        <div className="stack-gap">
          <p>Bereits eingetragene Leistungen existieren. Bitte festlegen, wie die bisherigen Punkte behandelt werden.</p>
          <div className="inline-actions wrap-actions">
            <button type="button" className="secondary-button" onClick={() => applyMaxPointsChange("absolute")}>
              Absolute Punkte beibehalten
            </button>
            <button type="button" className="primary-button" onClick={() => applyMaxPointsChange("proportional")}>
              Leistungen proportional mitskalieren
            </button>
          </div>
          <p className="muted-text">
            Beim Senken der Maximalpunkte können im Modus "absolute Punkte" Werte auf die neue Obergrenze begrenzt werden.
          </p>
        </div>
      </Modal>
    </main>
  );
};
