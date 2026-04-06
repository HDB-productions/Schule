import { DragEvent, useMemo, useState } from "react";
import { StructureNode, StructureNodeType, TaskBlockTemplate } from "../domain/types";
import { flattenStructure } from "../domain/logic";
import { readFileAsDataUrl } from "../lib/utils";
import { MarkdownPreview } from "./MarkdownPreview";

interface StructureEditorProps {
  structure: StructureNode[];
  taskBlockLibrary: TaskBlockTemplate[];
  onChange: (nodes: StructureNode[]) => void;
  onAddNode: (type: StructureNodeType, parentId: string | null) => void;
  onRequestMaxPointsChange: (criterionId: string, nextMaxPoints: number) => void;
  onSaveTaskBlock: (name: string, nodeId: string | null) => void;
  onInsertTaskBlock: (templateId: string) => void;
}

const nonScorableTypes: StructureNodeType[] = ["section", "task", "subtask", "spacer", "headingOnly"];

export const StructureEditor = ({
  structure,
  taskBlockLibrary,
  onChange,
  onAddNode,
  onRequestMaxPointsChange,
  onSaveTaskBlock,
  onInsertTaskBlock
}: StructureEditorProps) => {
  const flattened = useMemo(() => flattenStructure(structure), [structure]);
  const [bulkText, setBulkText] = useState("");
  const [bulkParentId, setBulkParentId] = useState<string>("");
  const [blockName, setBlockName] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const updateNode = (nodeId: string, patch: Partial<StructureNode>) => {
    onChange(structure.map((node) => (node.id === nodeId ? { ...node, ...patch } : node)));
  };

  const removeNode = (nodeId: string) => {
    const idsToRemove = new Set<string>([nodeId]);
    let added = true;
    while (added) {
      added = false;
      structure.forEach((node) => {
        if (node.parentId && idsToRemove.has(node.parentId) && !idsToRemove.has(node.id)) {
          idsToRemove.add(node.id);
          added = true;
        }
      });
    }
    onChange(
      structure
        .filter((node) => !idsToRemove.has(node.id))
        .map((node, index) => ({ ...node, sortIndex: index }))
    );
  };

  const addBulkCriteria = () => {
    const lines = bulkText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return;
    }

    let nextNodes = structure.slice();
    lines.forEach((line) => {
      const title = line.split("|")[0]?.trim() ?? line;
      const points = Number(line.split("|")[1]?.trim() ?? "1");
      const node = {
        id: `node_${Math.random().toString(36).slice(2, 10)}`,
        type: "criterion" as const,
        parentId: bulkParentId || null,
        sortIndex: nextNodes.length,
        title,
        richContent: title,
        printVisibility: "always" as const,
        maxPoints: Number.isFinite(points) ? points : 1,
        isBonus: false,
        isScorable: true
      };
      nextNodes = [...nextNodes, node];
    });
    onChange(nextNodes);
    setBulkText("");
  };

  const handleImageInsert = async (nodeId: string, file: File) => {
    const dataUrl = await readFileAsDataUrl(file);
    const node = structure.find((entry) => entry.id === nodeId);
    if (!node) {
      return;
    }
    const imageMarkdown = `\n\n![${file.name}](${dataUrl})`;
    updateNode(nodeId, { richContent: `${node.richContent}${imageMarkdown}`.trim() });
  };

  const reorder = (sourceId: string, targetId: string) => {
    const ordered = structure.slice().sort((left, right) => left.sortIndex - right.sortIndex);
    const sourceIndex = ordered.findIndex((node) => node.id === sourceId);
    const targetIndex = ordered.findIndex((node) => node.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }
    const next = ordered.slice();
    const [item] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, item);
    onChange(next.map((node, index) => ({ ...node, sortIndex: index })));
  };

  return (
    <section className="panel stack-gap">
      <div className="panel-header">
        <div>
          <h2>Erwartungshorizont</h2>
          <p className="muted-text">Freie Struktur, Drag-and-Drop, Mehrfachanlage und wiederverwendbare Aufgabenblöcke.</p>
        </div>
        <div className="inline-actions wrap-actions">
          <button type="button" className="secondary-button" onClick={() => onAddNode("section", null)}>Abschnitt</button>
          <button type="button" className="secondary-button" onClick={() => onAddNode("task", null)}>Aufgabe</button>
          <button type="button" className="secondary-button" onClick={() => onAddNode("criterion", null)}>Kriterium</button>
        </div>
      </div>

      <article className="subpanel stack-gap">
        <div className="panel-header">
          <div>
            <h3>Bibliothek und Massenanlage</h3>
            <p className="muted-text">Zeilenweise Kriterien einfügen. Format: Titel | Punkte</p>
          </div>
        </div>
        <div className="inline-form wrap-actions">
          <select value={bulkParentId} onChange={(event) => setBulkParentId(event.target.value)}>
            <option value="">Oberste Ebene</option>
            {flattened.filter((node) => nonScorableTypes.includes(node.type)).map((node) => (
              <option key={node.id} value={node.id}>{`${" ".repeat(node.depth * 2)}${node.title}`}</option>
            ))}
          </select>
          <textarea
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
            rows={4}
            placeholder={"Beispiel:\nRechenweg vollständig | 2\nErgebnis korrekt | 1"}
          />
          <button type="button" className="secondary-button" onClick={addBulkCriteria}>Mehrere Kriterien anlegen</button>
        </div>
        <div className="inline-form wrap-actions">
          <input value={blockName} onChange={(event) => setBlockName(event.target.value)} placeholder="Name für Aufgabenblock" />
          <button type="button" className="secondary-button" onClick={() => onSaveTaskBlock(blockName || "Aktueller Block", null)}>Gesamte Struktur speichern</button>
          <select defaultValue="" onChange={(event) => event.target.value && onInsertTaskBlock(event.target.value)}>
            <option value="">Aufgabenblock einfügen</option>
            {taskBlockLibrary.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>
      </article>

      <div className="stack-gap">
        {flattened.map((node) => (
          <article
            key={node.id}
            className="structure-row subpanel"
            draggable
            onDragStart={() => setDraggedId(node.id)}
            onDragOver={(event: DragEvent<HTMLElement>) => event.preventDefault()}
            onDrop={() => {
              if (draggedId && draggedId !== node.id) {
                reorder(draggedId, node.id);
              }
              setDraggedId(null);
            }}
          >
            <div className="structure-header" style={{ paddingLeft: `${node.depth * 18}px` }}>
              <div className="structure-meta">
                <strong>{node.title || "Ohne Titel"}</strong>
                <span className="pill">{node.type}</span>
                {node.isBonus ? <span className="pill pill-bonus">Bonus</span> : null}
              </div>
              <div className="inline-actions wrap-actions">
                <button type="button" className="secondary-button" onClick={() => onAddNode("criterion", node.id)}>+ Kriterium</button>
                <button type="button" className="secondary-button" onClick={() => onAddNode("subtask", node.id)}>+ Unterpunkt</button>
                <button type="button" className="secondary-button" onClick={() => onSaveTaskBlock(blockName || node.title, node.id)}>Block sichern</button>
                <button type="button" className="danger-button" onClick={() => removeNode(node.id)}>Entfernen</button>
              </div>
            </div>

            <div className="structure-form-grid">
              <label className="field-group">
                <span>Titel</span>
                <input value={node.title} onChange={(event) => updateNode(node.id, { title: event.target.value })} />
              </label>
              <label className="field-group">
                <span>Typ</span>
                <select value={node.type} onChange={(event) => updateNode(node.id, { type: event.target.value as StructureNodeType, isScorable: event.target.value === "criterion" })}>
                  <option value="section">section</option>
                  <option value="task">task</option>
                  <option value="subtask">subtask</option>
                  <option value="criterion">criterion</option>
                  <option value="spacer">spacer</option>
                  <option value="headingOnly">headingOnly</option>
                </select>
              </label>
              <label className="field-group">
                <span>Elternelement</span>
                <select value={node.parentId ?? ""} onChange={(event) => updateNode(node.id, { parentId: event.target.value || null })}>
                  <option value="">Oberste Ebene</option>
                  {flattened.filter((entry) => entry.id !== node.id && entry.type !== "criterion").map((entry) => (
                    <option key={entry.id} value={entry.id}>{`${" ".repeat(entry.depth * 2)}${entry.title}`}</option>
                  ))}
                </select>
              </label>
              <label className="field-group">
                <span>Drucksichtbarkeit</span>
                <select value={node.printVisibility} onChange={(event) => updateNode(node.id, { printVisibility: event.target.value as StructureNode["printVisibility"] })}>
                  <option value="always">Immer</option>
                  <option value="screenOnly">Nur Bildschirm</option>
                  <option value="printOnly">Nur Druck</option>
                  <option value="hidden">Ausblenden</option>
                </select>
              </label>
              {node.type === "criterion" ? (
                <>
                  <label className="field-group">
                    <span>Maximalpunkte</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={node.maxPoints ?? 0}
                      onChange={(event) => onRequestMaxPointsChange(node.id, Number(event.target.value))}
                    />
                  </label>
                  <label className="field-group">
                    <span>Kurzlabel</span>
                    <input value={node.shortLabel ?? ""} onChange={(event) => updateNode(node.id, { shortLabel: event.target.value })} />
                  </label>
                  <label className="field-group inline-checkbox">
                    <span>Bonus</span>
                    <input type="checkbox" checked={Boolean(node.isBonus)} onChange={(event) => updateNode(node.id, { isBonus: event.target.checked, isScorable: true })} />
                  </label>
                </>
              ) : null}
            </div>

            <div className="field-group">
              <span>Rich Content / Markdown</span>
              <textarea value={node.richContent} rows={5} onChange={(event) => updateNode(node.id, { richContent: event.target.value })} />
            </div>
            <div className="inline-actions wrap-actions">
              <label className="secondary-button file-button">
                Bild einfügen
                <input type="file" accept="image/*" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleImageInsert(node.id, file);
                    event.target.value = "";
                  }
                }} />
              </label>
            </div>
            <MarkdownPreview content={node.richContent} />
          </article>
        ))}
      </div>
    </section>
  );
};
