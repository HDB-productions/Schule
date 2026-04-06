import { ChangeEvent } from "react";
import { ExamRecord } from "../domain/types";
import { formatDate } from "../lib/utils";

interface ArchiveViewProps {
  exams: ExamRecord[];
  currentExamId: string | null;
  onCreate: () => void;
  onSelect: (examId: string) => void;
  onDuplicate: (examId: string) => void;
  onDelete: (examId: string) => void;
  onExport: (examId: string) => void;
  onImport: (file: File) => void;
}

export const ArchiveView = ({
  exams,
  currentExamId,
  onCreate,
  onSelect,
  onDuplicate,
  onDelete,
  onExport,
  onImport
}: ArchiveViewProps) => {
  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = "";
    }
  };

  return (
    <section className="panel stack-gap">
      <div className="panel-header">
        <div>
          <h2>Archiv</h2>
          <p className="muted-text">Mehrere Klausuren lokal verwalten, exportieren und duplizieren.</p>
        </div>
        <div className="inline-actions">
          <label className="secondary-button file-button">
            JSON importieren
            <input type="file" accept="application/json,.json" onChange={handleImport} />
          </label>
          <button type="button" className="primary-button" onClick={onCreate}>
            Neue Klausur
          </button>
        </div>
      </div>

      <div className="archive-grid">
        {exams.map((exam) => (
          <article
            key={exam.metadata.id}
            className={`archive-card ${currentExamId === exam.metadata.id ? "archive-card-active" : ""}`}
          >
            <div className="archive-card-main" role="button" tabIndex={0} onClick={() => onSelect(exam.metadata.id)} onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(exam.metadata.id);
              }
            }}>
              <h3>{exam.metadata.title || "Unbenannte Klausur"}</h3>
              <dl className="compact-definition-list">
                <div>
                  <dt>Fach</dt>
                  <dd>{exam.metadata.fach || "-"}</dd>
                </div>
                <div>
                  <dt>Klasse</dt>
                  <dd>{exam.metadata.kursOderKlasse || "-"}</dd>
                </div>
                <div>
                  <dt>Termin</dt>
                  <dd>{formatDate(exam.metadata.termin)}</dd>
                </div>
                <div>
                  <dt>Bearbeitet</dt>
                  <dd>{formatDate(exam.metadata.updatedAt)}</dd>
                </div>
              </dl>
            </div>
            <div className="inline-actions">
              <button type="button" className="secondary-button" onClick={() => onExport(exam.metadata.id)}>
                Export
              </button>
              <button type="button" className="secondary-button" onClick={() => onDuplicate(exam.metadata.id)}>
                Duplizieren
              </button>
              <button type="button" className="danger-button" onClick={() => onDelete(exam.metadata.id)}>
                Löschen
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
