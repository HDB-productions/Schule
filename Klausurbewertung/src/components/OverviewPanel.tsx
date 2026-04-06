import { resolveGradeScheme, summarizeExam } from "../domain/logic";
import { ExamRecord } from "../domain/types";
import { formatDate } from "../lib/utils";

interface OverviewPanelProps {
  exam: ExamRecord;
}

export const OverviewPanel = ({ exam }: OverviewPanelProps) => {
  const summary = summarizeExam(exam);
  const scheme = resolveGradeScheme(exam.metadata);

  return (
    <section className="panel stack-gap">
      <div className="panel-header">
        <div>
          <h2>Deckblatt und Übersicht</h2>
          <p className="muted-text">Druckfähige Stammdaten, Schülerliste, Notenspiegel und Grenzwerte.</p>
        </div>
      </div>

      <div className="overview-grid">
        <article className="subpanel">
          <h3>Stammdaten</h3>
          <dl className="compact-definition-list">
            <div><dt>Titel</dt><dd>{exam.metadata.title || "-"}</dd></div>
            <div><dt>Schuljahr</dt><dd>{exam.metadata.schuljahr || "-"}</dd></div>
            <div><dt>Fach</dt><dd>{exam.metadata.fach || "-"}</dd></div>
            <div><dt>Klasse/Kurs</dt><dd>{exam.metadata.kursOderKlasse || "-"}</dd></div>
            <div><dt>Termin</dt><dd>{formatDate(exam.metadata.termin)}</dd></div>
            <div><dt>Nummer</dt><dd>{exam.metadata.arbeitsNummer || "-"}</dd></div>
            <div><dt>Thema</dt><dd>{exam.metadata.thema || "-"}</dd></div>
            <div><dt>Lehrkraft</dt><dd>{exam.metadata.lehrkraft || "-"}</dd></div>
          </dl>
        </article>

        <article className="subpanel">
          <h3>Kennzahlen</h3>
          <dl className="compact-definition-list">
            <div><dt>Schülerzahl</dt><dd>{summary.studentSummaries.length}</dd></div>
            <div><dt>Maximalpunkte</dt><dd>{summary.maxRegularPoints.toFixed(1)}</dd></div>
            <div><dt>Durchschnitt</dt><dd>{summary.averagePercent.toFixed(2)}%</dd></div>
            <div><dt>Hilfsmittelfrei</dt><dd>{exam.metadata.anzahlHilfsmittelfreierAufgaben ?? "-"}</dd></div>
          </dl>
        </article>
      </div>

      <div className="overview-grid">
        <article className="subpanel">
          <h3>Notenspiegel</h3>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Note/Punkte</th>
                <th>Anzahl</th>
                <th>Ab %</th>
              </tr>
            </thead>
            <tbody>
              {scheme.boundaries.map((boundary) => (
                <tr key={boundary.id}>
                  <td>{boundary.label}</td>
                  <td>{summary.distribution[boundary.label] ?? 0}</td>
                  <td>{boundary.minPercent.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="subpanel">
          <h3>Schülerübersicht</h3>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Schüler</th>
                <th>Punkte</th>
                <th>Bonus</th>
                <th>Prozent</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {summary.studentSummaries.map(({ student, totals }) => (
                <tr key={student.id}>
                  <td>{student.displayName}</td>
                  <td>{totals.regularAchieved.toFixed(1)} / {totals.maxRegular.toFixed(1)}</td>
                  <td>{totals.bonusAchieved.toFixed(1)}</td>
                  <td>{totals.percent.toFixed(2)}%</td>
                  <td>{totals.gradeLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
};
