import { ChangeEvent, useMemo, useState } from "react";
import { ClassListTemplate, Student, VariantCode } from "../domain/types";
import { createId } from "../lib/utils";

interface StudentManagerProps {
  students: Student[];
  availableVariants: VariantCode[];
  classListLibrary: ClassListTemplate[];
  onChange: (students: Student[]) => void;
  onImportCsv: (file: File) => void;
  onSaveClassList: (name: string) => void;
  onApplyClassList: (templateId: string) => void;
}

export const StudentManager = ({
  students,
  availableVariants,
  classListLibrary,
  onChange,
  onImportCsv,
  onSaveClassList,
  onApplyClassList
}: StudentManagerProps) => {
  const [newStudent, setNewStudent] = useState({ vorname: "", nachname: "", variante: "" });
  const [templateName, setTemplateName] = useState("");

  const sortedStudents = useMemo(
    () => students.slice().sort((left, right) => left.sortIndex - right.sortIndex),
    [students]
  );

  const updateStudent = (studentId: string, patch: Partial<Student>) => {
    onChange(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              ...patch,
              displayName: `${patch.vorname ?? student.vorname} ${patch.nachname ?? student.nachname}`.trim()
            }
          : student
      )
    );
  };

  const addStudent = () => {
    if (!newStudent.vorname.trim() && !newStudent.nachname.trim()) {
      return;
    }

    onChange([
      ...students,
      {
        id: createId("student"),
        vorname: newStudent.vorname.trim(),
        nachname: newStudent.nachname.trim(),
        displayName: `${newStudent.vorname} ${newStudent.nachname}`.trim(),
        aktiv: true,
        sortIndex: students.length,
        variante: newStudent.variante.trim()
      }
    ]);
    setNewStudent({ vorname: "", nachname: "", variante: "" });
  };

  const removeStudent = (studentId: string) => {
    onChange(
      students
        .filter((student) => student.id !== studentId)
        .map((student, index) => ({
          ...student,
          sortIndex: index
        }))
    );
  };

  const moveStudent = (studentId: string, direction: -1 | 1) => {
    const currentIndex = sortedStudents.findIndex((student) => student.id === studentId);
    const nextIndex = currentIndex + direction;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= sortedStudents.length) {
      return;
    }

    const reordered = sortedStudents.slice();
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, item);
    onChange(reordered.map((student, index) => ({ ...student, sortIndex: index })));
  };

  const handleCsvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportCsv(file);
      event.target.value = "";
    }
  };

  return (
    <section className="panel stack-gap">
      <div className="panel-header">
        <div>
          <h2>Schülerliste</h2>
          <p className="muted-text">CSV-Import, manuelle Pflege und Wiederverwendung kompletter Klassenlisten.</p>
        </div>
        <div className="inline-actions">
          <label className="secondary-button file-button">
            CSV importieren
            <input type="file" accept=".csv,text/csv" onChange={handleCsvChange} />
          </label>
        </div>
      </div>

      <article className="subpanel stack-gap">
        <div className="inline-form">
          <input
            type="text"
            value={newStudent.vorname}
            placeholder="Vorname"
            onChange={(event) => setNewStudent((state) => ({ ...state, vorname: event.target.value }))}
          />
          <input
            type="text"
            value={newStudent.nachname}
            placeholder="Nachname"
            onChange={(event) => setNewStudent((state) => ({ ...state, nachname: event.target.value }))}
          />
          <select
            value={newStudent.variante}
            onChange={(event) => setNewStudent((state) => ({ ...state, variante: event.target.value }))}
          >
            <option value="">Variante</option>
            {availableVariants.map((variant) => (
              <option key={variant} value={variant}>{variant}</option>
            ))}
          </select>
          <button type="button" className="primary-button" onClick={addStudent}>
            Schüler hinzufügen
          </button>
        </div>
      </article>

      <article className="subpanel stack-gap">
        <div className="panel-header">
          <div>
            <h3>Klassenlisten-Bibliothek</h3>
            <p className="muted-text">Komplette Klassenlisten sichern und in neue Klausuren übernehmen.</p>
          </div>
        </div>
        <div className="inline-form">
          <input
            type="text"
            value={templateName}
            placeholder="Name der Klassenliste"
            onChange={(event) => setTemplateName(event.target.value)}
          />
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              const fallbackName = templateName.trim() || `Klassenliste ${new Date().toLocaleDateString("de-DE")}`;
              onSaveClassList(fallbackName);
              setTemplateName("");
            }}
          >
            Aktuelle Liste speichern
          </button>
          <select defaultValue="" onChange={(event) => event.target.value && onApplyClassList(event.target.value)}>
            <option value="">Klassenliste anwenden</option>
            {classListLibrary.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>
      </article>

      <table className="simple-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Anzeigename</th>
            <th>Variante</th>
            <th>Aktiv</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>
                <input value={student.vorname} onChange={(event) => updateStudent(student.id, { vorname: event.target.value })} />
              </td>
              <td>
                <input value={student.nachname} onChange={(event) => updateStudent(student.id, { nachname: event.target.value })} />
              </td>
              <td>{student.displayName}</td>
              <td>
                <select value={student.variante ?? ""} onChange={(event) => updateStudent(student.id, { variante: event.target.value })}>
                  <option value="">-</option>
                  {availableVariants.map((variant) => (
                    <option key={variant} value={variant}>{variant}</option>
                  ))}
                </select>
              </td>
              <td>
                <input type="checkbox" checked={student.aktiv} onChange={(event) => updateStudent(student.id, { aktiv: event.target.checked })} />
              </td>
              <td>
                <div className="inline-actions">
                  <button type="button" className="secondary-button" onClick={() => moveStudent(student.id, -1)}>↑</button>
                  <button type="button" className="secondary-button" onClick={() => moveStudent(student.id, 1)}>↓</button>
                  <button type="button" className="danger-button" onClick={() => removeStudent(student.id)}>Löschen</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
