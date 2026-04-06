import { GradeBoundary, GradePresetId, GradeScheme } from "./types";
import { createId } from "../lib/utils";

const buildBoundaries = (items: Array<[string, number]>): GradeBoundary[] =>
  items.map(([label, minPercent]) => ({
    id: createId("grade"),
    label,
    minPercent
  }));

export const gradePresets: Record<Exclude<GradePresetId, "custom">, GradeScheme> = {
  sek1: {
    presetId: "sek1",
    label: "Sek I (1 bis 6)",
    scaleType: "grade",
    boundaries: buildBoundaries([
      ["1", 87.5],
      ["2", 75],
      ["3", 62.5],
      ["4", 50],
      ["5", 25],
      ["6", 0]
    ])
  },
  oberstufe: {
    presetId: "oberstufe",
    label: "Gymnasiale Oberstufe (0 bis 15 Punkte)",
    scaleType: "points",
    boundaries: buildBoundaries([
      ["15", 95],
      ["14", 90],
      ["13", 85],
      ["12", 80],
      ["11", 75],
      ["10", 70],
      ["9", 65],
      ["8", 60],
      ["7", 55],
      ["6", 50],
      ["5", 45],
      ["4", 40],
      ["3", 33],
      ["2", 27],
      ["1", 20],
      ["0", 0]
    ])
  },
  symbol: {
    presetId: "symbol",
    label: "++ / + / o / - / --",
    scaleType: "symbol",
    boundaries: buildBoundaries([
      ["++", 87.5],
      ["+", 75],
      ["o", 62.5],
      ["-", 50],
      ["--", 0]
    ])
  }
};

export const getGradeScheme = (
  presetId: GradePresetId,
  customBoundaries: GradeBoundary[]
): GradeScheme => {
  if (presetId === "custom") {
    return {
      presetId: "custom",
      label: "Benutzerdefiniert",
      scaleType: "grade",
      boundaries: customBoundaries
        .slice()
        .sort((left, right) => right.minPercent - left.minPercent)
    };
  }

  return {
    ...gradePresets[presetId],
    boundaries: customBoundaries.length
      ? customBoundaries.slice().sort((left, right) => right.minPercent - left.minPercent)
      : gradePresets[presetId].boundaries
  };
};
