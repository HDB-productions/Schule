import { KeyboardEvent, useMemo, useRef } from "react";
import {
  evaluationKey,
  flattenStructure,
  getHighlightState,
  getNodeTotalsForStudent,
  getStudentTotals
} from "../domain/logic";
import { ExamRecord, ScoreMode, Student, StructureNode } from "../domain/types";

interface EvaluationMatrixProps {
  exam: ExamRecord;
  scoreMode: ScoreMode;
  onScoreModeChange: (mode: ScoreMode) => void;
  onSetEvaluation: (studentId: string, criterionId: string, rawValue: string, mode: ScoreMode) => void;
  onBatchSetCriterionPercent: (criterionId: string, percent: number) => void;
  onBatchSetStudentPercent: (studentId: string, percent: number) => void;
}

const getCellValue = (criterion: StructureNode, entryRaw: ExamRecord["evaluations"][string] | undefined, mode: ScoreMode): string => {
  if (!entryRaw || entryRaw.isUnset) {
    return "";
  }

  if (mode === "points") {
    return String(entryRaw.achievedPoints);
  }

  if (entryRaw.scoreModeUsedLast === "percent" && entryRaw.rawInputValue) {
    return entryRaw.rawInputValue;
  }

  return String(entryRaw.derivedPercent);
};

const getStudents = (exam: ExamRecord): Student[] =>
  exam.students.slice().sort((left, right) => left.sortIndex - right.sortIndex).filter((student) => student.aktiv);

export const EvaluationMatrix = ({
  exam,
  scoreMode,
  onScoreModeChange,
  onSetEvaluation,
  onBatchSetCriterionPercent,
  onBatchSetStudentPercent
}: EvaluationMatrixProps) => {
  const students = useMemo(() => getStudents(exam), [exam]);
  const rows = useMemo(
    () => flattenStructure(exam.structure).filter((node) => node.printVisibility !== "hidden" && node.printVisibility !== "printOnly"),
    [exam.structure]
  );
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const focusCell = (rowIndex: number, studentIndex: number) => {
    const row = rows[rowIndex];
    const student = students[studentIndex];
    if (!row || !student || !row.isScorable) {
      return;
    }
    const key = `${row.id}::${student.id}`;
    inputRefs.current[key]?.focus();
    inputRefs.current[key]?.select();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, rowIndex: number, studentIndex: number) => {
    if (event.key === "ArrowRight" || event.key === "Tab") {
      event.preventDefault();
      focusCell(rowIndex, Math.min(studentIndex + 1, students.length - 1));
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusCell(rowIndex, Math.max(studentIndex - 1, 0));
      return;
    }

    if (event.key === "ArrowDown" || event.key === "Enter") {
      event.preventDefault();
      for (let nextRowIndex = rowIndex + 1; nextRowIndex < rows.length; nextRowIndex += 1) {
        if (rows[nextRowIndex].isScorable) {
          focusCell(nextRowIndex, studentIndex);
          break;
        }
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      for (let previousRowIndex = rowIndex - 1; previousRowIndex >= 0; previousRowIndex -= 1) {
        if (rows[previousRowIndex].isScorable) {
          focusCell(previousRowIndex, studentIndex);
          break;
        }
      }
    }
  };

  return (
    <section className="panel stack-gap">
      <div className="panel-header">
        <div>
          <h2>Bewertungsmatrix</h2>
          <p className="muted-text">Sticky-Raster mit Tastaturnavigation, Blockaktionen und Live-Summen.</p>
        </div>
        <div className="segmented-control">
          <button type="button" className={scoreMode === "points" ? "segmented-active" : ""} onClick={() => onScoreModeChange("points")}>Punktmodus</button>
          <button type="button" className={scoreMode === "percent" ? "segmented-active" : ""} onClick={() => onScoreModeChange("percent")}>Prozentmodus</button>
        </div>
      </div>

      <div className="matrix-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="sticky-col sticky-head matrix-label-col">Struktur / Kriterium</th>
              <th className="sticky-head matrix-meta-col">Aktionen</th>
              {students.map((student) => {
                const totals = getStudentTotals(exam, student.id);
                return (
                  <th key={student.id} className="sticky-head matrix-student-head">
                    <div className="student-head">
                      <strong>{student.displayName}</strong>
                      <span>{student.variante ? `Variante ${student.variante}` : ""}</span>
                      <span>{totals.totalAchieved.toFixed(1)} / {totals.maxRegular.toFixed(1)} Punkte</span>
                      <span>{totals.percent.toFixed(2)}% | {totals.gradeLabel}</span>
                      <div className="inline-actions wrap-actions">
                        <button type="button" className="secondary-button tiny-button" onClick={() => onBatchSetStudentPercent(student.id, 0)}>0%</button>
                        <button type="button" className="secondary-button tiny-button" onClick={() => onBatchSetStudentPercent(student.id, 100)}>100%</button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className={row.isScorable ? "criterion-row" : "structure-only-row"}>
                <td className="sticky-col matrix-label-col" style={{ paddingLeft: `${16 + row.depth * 18}px` }}>
                  <div className="matrix-label-cell">
                    <strong>{row.title || row.type}</strong>
                    {row.isScorable ? <span className="muted-text">{row.maxPoints?.toFixed(1)} P{row.isBonus ? " +Bonus" : ""}</span> : null}
                  </div>
                </td>
                <td className="matrix-meta-col">
                  {row.isScorable ? (
                    <div className="inline-actions wrap-actions">
                      <button type="button" className="secondary-button tiny-button" onClick={() => onBatchSetCriterionPercent(row.id, 0)}>0%</button>
                      <button type="button" className="secondary-button tiny-button" onClick={() => onBatchSetCriterionPercent(row.id, 100)}>100%</button>
                    </div>
                  ) : (
                    <span className="muted-text">Summe</span>
                  )}
                </td>
                {students.map((student, studentIndex) => {
                  if (!row.isScorable) {
                    const totals = getNodeTotalsForStudent(exam, row.id, student.id);
                    return (
                      <td key={student.id} className="matrix-summary-cell">
                        {totals.achieved.toFixed(1)} / {totals.max.toFixed(1)}
                      </td>
                    );
                  }

                  const entry = exam.evaluations[evaluationKey(student.id, row.id)];
                  const cellState = getHighlightState(exam.metadata, entry?.isUnset ? null : entry?.derivedPercent ?? null);
                  const refKey = `${row.id}::${student.id}`;
                  return (
                    <td key={student.id} className={`matrix-input-cell matrix-${cellState}`}>
                      <input
                        ref={(element) => {
                          inputRefs.current[refKey] = element;
                        }}
                        type="number"
                        step={scoreMode === "points" ? "0.5" : "0.1"}
                        min="0"
                        max={scoreMode === "points" ? row.maxPoints : undefined}
                        value={getCellValue(row, entry, scoreMode)}
                        onChange={(event) => onSetEvaluation(student.id, row.id, event.target.value, scoreMode)}
                        onKeyDown={(event) => handleKeyDown(event, rowIndex, studentIndex)}
                      />
                      <small>{entry?.isUnset ? "offen" : `${entry?.achievedPoints.toFixed(1)} P`}</small>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="matrix-final-row">
              <td className="sticky-col matrix-label-col">Gesamt</td>
              <td className="matrix-meta-col">Note</td>
              {students.map((student) => {
                const totals = getStudentTotals(exam, student.id);
                return (
                  <td key={student.id}>
                    <strong>{totals.totalAchieved.toFixed(1)} / {totals.maxRegular.toFixed(1)}</strong>
                    <div>{totals.percent.toFixed(2)}%</div>
                    <div>{totals.gradeLabel}</div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
