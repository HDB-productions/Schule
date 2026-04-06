import { Student } from "../domain/types";
import { createId } from "./utils";

const parseLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === delimiter && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  result.push(current.trim());
  return result;
};

const detectDelimiter = (text: string): string => {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().length > 0) ?? "";
  return firstLine.includes(";") ? ";" : ",";
};

export const parseStudentCsv = (text: string): Student[] => {
  const delimiter = detectDelimiter(text);
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseLine(lines[0], delimiter).map((header) => header.toLowerCase());
  const vornameIndex = headers.findIndex((header) => header.includes("vorname"));
  const nachnameIndex = headers.findIndex((header) => header.includes("nachname"));

  if (vornameIndex === -1 || nachnameIndex === -1) {
    throw new Error("CSV konnte nicht gelesen werden. Erwartet werden die Spalten Vorname und Nachname.");
  }

  return lines.slice(1).flatMap((line, index) => {
    const columns = parseLine(line, delimiter);
    const vorname = columns[vornameIndex]?.trim() ?? "";
    const nachname = columns[nachnameIndex]?.trim() ?? "";

    if (!vorname && !nachname) {
      return [];
    }

    return [
      {
        id: createId("student"),
        vorname,
        nachname,
        displayName: `${vorname} ${nachname}`.trim(),
        aktiv: true,
        sortIndex: index,
        variante: ""
      }
    ];
  });
};
