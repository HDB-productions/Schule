import { describe, expect, it } from "vitest";
import {
  getGradeFromPercent,
  getStudentTotals,
  percentToPoints,
  rescaleCriterionAfterMaxPointsChange,
  roundDownToHalf
} from "../domain/logic";
import { gradePresets } from "../domain/gradePresets";
import { ExamRecord } from "../domain/types";

const createExam = (): ExamRecord => ({
  metadata: {
    id: "exam_1",
    title: "Test",
    schuljahr: "2025/2026",
    fach: "Mathe",
    kursOderKlasse: "5G1",
    termin: "2026-01-10",
    arbeitsNummer: "1",
    thema: "",
    lehrkraft: "L",
    lehrkraftKuerzel: "L",
    notenschluesselPreset: "sek1",
    benutzerdefinierteNotengrenzen: [],
    aktivierteVarianten: ["A", "B"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  students: [
    {
      id: "student_1",
      vorname: "A",
      nachname: "B",
      displayName: "A B",
      aktiv: true,
      sortIndex: 0,
      variante: "A"
    }
  ],
  structure: [
    {
      id: "criterion_1",
      type: "criterion",
      parentId: null,
      sortIndex: 0,
      title: "Regulär",
      richContent: "",
      printVisibility: "always",
      maxPoints: 3,
      isBonus: false,
      isScorable: true
    },
    {
      id: "criterion_2",
      type: "criterion",
      parentId: null,
      sortIndex: 1,
      title: "Bonus",
      richContent: "",
      printVisibility: "always",
      maxPoints: 1,
      isBonus: true,
      isScorable: true
    }
  ],
  evaluations: {
    "student_1::criterion_1": {
      studentId: "student_1",
      criterionId: "criterion_1",
      scoreModeUsedLast: "points",
      rawInputValue: "2",
      achievedPoints: 2,
      derivedPercent: 66.67,
      isUnset: false,
      updatedAt: "2026-01-01"
    },
    "student_1::criterion_2": {
      studentId: "student_1",
      criterionId: "criterion_2",
      scoreModeUsedLast: "points",
      rawInputValue: "1",
      achievedPoints: 1,
      derivedPercent: 100,
      isUnset: false,
      updatedAt: "2026-01-01"
    }
  }
});

describe("fachlogik", () => {
  it("rundet konsequent auf halbe Punkte nach unten", () => {
    expect(roundDownToHalf(2.74)).toBe(2.5);
    expect(roundDownToHalf(2.49)).toBe(2);
  });

  it("rechnet Prozent in Punkte mit Abrundung auf 0,5 um", () => {
    expect(percentToPoints(83, 3)).toBe(2);
    expect(percentToPoints(84, 3)).toBe(2.5);
  });

  it("berechnet Noten anhand der Grenzen", () => {
    expect(getGradeFromPercent(88, gradePresets.sek1)).toBe("1");
    expect(getGradeFromPercent(74.9, gradePresets.sek1)).toBe("3");
    expect(getGradeFromPercent(94, gradePresets.oberstufe)).toBe("14");
  });

  it("berücksichtigt Bonuspunkte ohne Erhöhung der regulären Maximalpunktzahl", () => {
    const totals = getStudentTotals(createExam(), "student_1");
    expect(totals.regularAchieved).toBe(2);
    expect(totals.bonusAchieved).toBe(1);
    expect(totals.maxRegular).toBe(3);
    expect(totals.percent).toBe(100);
    expect(totals.gradeLabel).toBe("1");
  });

  it("skaliert vorhandene Leistungen proportional mit", () => {
    const exam = createExam();
    const scaled = rescaleCriterionAfterMaxPointsChange(exam, "criterion_1", 4, "proportional");
    expect(scaled.evaluations["student_1::criterion_1"].achievedPoints).toBe(2.5);
  });

  it("behält absolute Punkte bei Änderung der Maximalpunkte bei", () => {
    const exam = createExam();
    const absolute = rescaleCriterionAfterMaxPointsChange(exam, "criterion_1", 4, "absolute");
    expect(absolute.evaluations["student_1::criterion_1"].achievedPoints).toBe(2);
  });
});
