import { ChangeEvent } from "react";
import { gradePresets } from "../domain/gradePresets";
import { ExamMetadata, GradeBoundary, GradePresetId } from "../domain/types";
import { createId } from "../lib/utils";

interface MetadataPanelProps {
  metadata: ExamMetadata;
  onChange: (metadata: ExamMetadata) => void;
}

const metadataFields: Array<{ key: keyof ExamMetadata; label: string; type?: string }> = [
  { key: "title", label: "Titel" },
  { key: "schuljahr", label: "Schuljahr" },
  { key: "fach", label: "Fach" },
  { key: "kursOderKlasse", label: "Kurs/Klasse" },
  { key: "termin", label: "Termin", type: "date" },
  { key: "arbeitsNummer", label: "Nummer" },
  { key: "thema", label: "Thema" },
  { key: "lehrkraft", label: "Lehrkraft" },
  { key: "lehrkraftKuerzel", label: "Kürzel" }
];

const cloneBoundaries = (presetId: Exclude<GradePresetId, "custom">): GradeBoundary[] =>
  gradePresets[presetId].boundaries.map((boundary) => ({
    ...boundary,
    id: createId("grade")
  }));

export const MetadataPanel = ({ metadata, onChange }: MetadataPanelProps) => {
  const handleFieldChange = (key: keyof ExamMetadata, value: string) => {
    onChange({
      ...metadata,
      [key]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const presetId = event.target.value as GradePresetId;
    onChange({
      ...metadata,
      notenschluesselPreset: presetId,
      benutzerdefinierteNotengrenzen:
        presetId === "custom" ? metadata.benutzerdefinierteNotengrenzen : cloneBoundaries(presetId),
      updatedAt: new Date().toISOString()
    });
  };

  const updateBoundary = (boundaryId: string, patch: Partial<GradeBoundary>) => {
    onChange({
      ...metadata,
      benutzerdefinierteNotengrenzen: metadata.benutzerdefinierteNotengrenzen.map((boundary) =>
        boundary.id === boundaryId ? { ...boundary, ...patch } : boundary
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const addBoundary = () => {
    onChange({
      ...metadata,
      notenschluesselPreset: "custom",
      benutzerdefinierteNotengrenzen: [
        ...metadata.benutzerdefinierteNotengrenzen,
        { id: createId("grade"), label: "neu", minPercent: 0 }
      ],
      updatedAt: new Date().toISOString()
    });
  };

  const removeBoundary = (boundaryId: string) => {
    onChange({
      ...metadata,
      notenschluesselPreset: "custom",
      benutzerdefinierteNotengrenzen: metadata.benutzerdefinierteNotengrenzen.filter(
        (boundary) => boundary.id !== boundaryId
      ),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <section className="panel stack-gap">
      <div className="panel-header">
        <div>
          <h2>Stammdaten</h2>
          <p className="muted-text">Pflichtfelder, Varianten und editierbare Notengrenzen.</p>
        </div>
      </div>

      <div className="form-grid">
        {metadataFields.map((field) => (
          <label key={field.key} className="field-group">
            <span>{field.label}</span>
            <input
              type={field.type ?? "text"}
              value={String(metadata[field.key] ?? "")}
              onChange={(event) => handleFieldChange(field.key, event.target.value)}
            />
          </label>
        ))}

        <label className="field-group">
          <span>Hilfsmittelfreie Aufgaben</span>
          <input
            type="number"
            min="0"
            step="1"
            value={metadata.anzahlHilfsmittelfreierAufgaben ?? ""}
            onChange={(event) =>
              onChange({
                ...metadata,
                anzahlHilfsmittelfreierAufgaben: event.target.value ? Number(event.target.value) : undefined,
                updatedAt: new Date().toISOString()
              })
            }
          />
        </label>

        <label className="field-group">
          <span>Aktive Varianten</span>
          <input
            type="text"
            value={metadata.aktivierteVarianten.join(", ")}
            onChange={(event) =>
              onChange({
                ...metadata,
                aktivierteVarianten: event.target.value
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean),
                updatedAt: new Date().toISOString()
              })
            }
            placeholder="A, B"
          />
        </label>

        <label className="field-group">
          <span>Notenschlüssel</span>
          <select value={metadata.notenschluesselPreset} onChange={handlePresetChange}>
            <option value="sek1">Sek I (1 bis 6)</option>
            <option value="oberstufe">Oberstufe (0 bis 15)</option>
            <option value="symbol">++ / + / o / - / --</option>
            <option value="custom">Benutzerdefiniert</option>
          </select>
        </label>
      </div>

      <article className="subpanel">
        <div className="panel-header">
          <div>
            <h3>Notengrenzen</h3>
            <p className="muted-text">Die Grenzen aktualisieren die Notenberechnung sofort.</p>
          </div>
          <button type="button" className="secondary-button" onClick={addBoundary}>
            Grenze ergänzen
          </button>
        </div>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Ab Prozent</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {metadata.benutzerdefinierteNotengrenzen.map((boundary) => (
              <tr key={boundary.id}>
                <td>
                  <input value={boundary.label} onChange={(event) => updateBoundary(boundary.id, { label: event.target.value })} />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    value={boundary.minPercent}
                    onChange={(event) => updateBoundary(boundary.id, { minPercent: Number(event.target.value) })}
                  />
                </td>
                <td>
                  <button type="button" className="danger-button" onClick={() => removeBoundary(boundary.id)}>
                    Entfernen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};
