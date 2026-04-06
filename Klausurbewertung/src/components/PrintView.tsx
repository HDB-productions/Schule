import { useMemo } from "react";
import {
  flattenStructure,
  getNodeTotalsForStudent,
  getStudentTotals,
  resolveGradeScheme
} from "../domain/logic";
import { ExamRecord, Student } from "../domain/types";
import { formatDate } from "../lib/utils";
import { MarkdownPreview } from "./MarkdownPreview";

interface PrintViewProps {
  exam: ExamRecord;
}

interface PrintRow {
  nodeId: string;
  depth: number;
  title: string;
  richContent: string;
  maxPoints?: number;
  isScorable?: boolean;
  isBonus?: boolean;
}

const estimateWeight = (row: PrintRow): number => {
  const contentWeight = Math.max(1, Math.ceil(row.richContent.length / 180));
  return row.isScorable ? 1 + contentWeight : 1;
};

const chunkRows = (rows: PrintRow[]): PrintRow[][] => {
  const pages: PrintRow[][] = [];
  let current: PrintRow[] = [];
  let currentWeight = 0;
  const maxWeight = 16;

  rows.forEach((row) => {
    const nextWeight = estimateWeight(row);
    if (current.length > 0 && currentWeight + nextWeight > maxWeight) {
      pages.push(current);
      current = [];
      currentWeight = 0;
    }
    current.push(row);
    currentWeight += nextWeight;
  });

  if (current.length > 0) {
    pages.push(current);
  }

  return pages;
};

const getStudents = (exam: ExamRecord): Student[] =>
  exam.students.slice().sort((left, right) => left.sortIndex - right.sortIndex).filter((student) => student.aktiv);

export const PrintView = ({ exam }: PrintViewProps) => {
  const rows = useMemo(
    () =>
      flattenStructure(exam.structure)
        .filter((node) => node.printVisibility !== "hidden" && node.printVisibility !== "screenOnly")
        .map((node) => ({
          nodeId: node.id,
          depth: node.depth,
          title: node.title,
          richContent: node.richContent,
          maxPoints: node.maxPoints,
          isScorable: node.isScorable,
          isBonus: node.isBonus
        })),
    [exam.structure]
  );
  const students = useMemo(() => getStudents(exam), [exam]);
  const scheme = resolveGradeScheme(exam.metadata);

  return (
    <section className="panel stack-gap print-panel">
      <div className="panel-header no-print">
        <div>
          <h2>Druckansicht</h2>
          <p className="muted-text">Formale Sammelausgabe für den Browserdruck als PDF.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => window.print()}>
          Sammel-PDF drucken
        </button>
      </div>

      <div className="print-document">
        {students.flatMap((student) => {
          const pages = chunkRows(rows);
          const totals = getStudentTotals(exam, student.id);
          return pages.map((pageRows, pageIndex) => (
            <section className="print-sheet-page" key={`${student.id}-${pageIndex}`}>
              <header className="print-sheet-header">
                <div>
                  <h3>{exam.metadata.title || "Klausur"}</h3>
                  <p>{student.displayName}</p>
                </div>
                <div className="print-header-meta">
                  <span>{exam.metadata.fach}</span>
                  <span>{exam.metadata.kursOderKlasse}</span>
                  <span>{formatDate(exam.metadata.termin)}</span>
                  <span>Seite {pageIndex + 1} von {pages.length}</span>
                </div>
              </header>

              <table className="print-table">
                <thead>
                  <tr>
                    <th>Struktur / Kriterium</th>
                    <th>Inhalt</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => {
                    const totalsForRow = getNodeTotalsForStudent(exam, row.nodeId, student.id);
                    return (
                      <tr key={row.nodeId}>
                        <td style={{ paddingLeft: `${12 + row.depth * 16}px` }}>
                          <strong>{row.title || "-"}</strong>
                          {row.isBonus ? <div>Bonus</div> : null}
                        </td>
                        <td><MarkdownPreview content={row.richContent} /></td>
                        <td>
                          {row.isScorable
                            ? `${totalsForRow.achieved.toFixed(1)} / ${(row.maxPoints ?? 0).toFixed(1)}`
                            : `${totalsForRow.achieved.toFixed(1)} / ${totalsForRow.max.toFixed(1)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <footer className="print-sheet-footer">
                <div>
                  <strong>Gesamt:</strong> {totals.totalAchieved.toFixed(1)} / {totals.maxRegular.toFixed(1)} Punkte
                  {' '}| Bonus {totals.bonusAchieved.toFixed(1)}
                  {' '}| {totals.percent.toFixed(2)}%
                  {' '}| Note {totals.gradeLabel}
                  {' '}| Kürzel {exam.metadata.lehrkraftKuerzel || "_____"}
                </div>
                <table className="grade-table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>ab %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheme.boundaries.map((boundary) => (
                      <tr key={boundary.id}>
                        <td>{boundary.label}</td>
                        <td>{boundary.minPercent.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </footer>
            </section>
          ));
        })}
      </div>
    </section>
  );
};
