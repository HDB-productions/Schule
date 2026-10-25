# Freitext mit Luna-Feedback – erste Integrationsfassung

**Stand nach den Nutzerentscheidungen vom 25.10.2026:** Die erste vollständige Unterrichtsseite liegt unter `Physik/Kernphysik/ionisierende-strahlung/README.md`. Sie verwendet die automatische Edulo-Anmelde-ID und den aktuellen Worker in `worker/` mit Wochen- und Gesamtguthaben. Die früheren Demoquellen direkt in diesem Ordner verwenden noch den verworfenen Zugangscode-Vertrag und sind kein Uploadziel für diesen Worker. Die folgenden Abschnitte dokumentieren ausschließlich diesen früheren Prototyp. Für neue Seiten die aktuelle Unterrichtsseite und `worker/README.md` verwenden.

Ein gemeinsamer Cloudflare-Worker bewertet Aufgaben aus beliebigen Widgets. Aufgabenstellung, Musterlösung und Prüfkriterien stehen in `app.js` im Objekt `TASK` und werden bei jeder Prüfung zusammen mit der Antwort übermittelt. Die Musterlösung ist deshalb für technisch versierte Lernende im HTML lesbar. Diese Fassung dient zum Üben.

## Tatsächlicher Einrichtungsstand am 25.10.2026

Der Nutzer hat die Ersetzung des bestehenden Workers `edulomodularai` unter Beibehaltung seines verschlüsselten `OPENAI_API_KEY` freigegeben. Im Cloudflare-Dashboard ist `FEEDBACK_LIMITER` mit Namespace `10012501`, Limit 30 und Zeitraum 60 Sekunden eingerichtet und in der Bindungstabelle bestätigt. Dabei entstand die aktive Konfigurationsversion `504b5b2b`. Der vorhandene OpenAI-Schlüssel wurde weder ausgelesen noch verändert.

Der neue Code ist noch NICHT veröffentlicht: Der Cloudflare-Codeeditor bleibt auch nach Neuladen mit leerem Editor und Ladeanzeige stehen. Der Aufruf der eingebetteten Editor-Domain zeigt ebenfalls eine leere Seite. `CLASSROOM_CODE` und `ALLOWED_ORIGINS` sind noch nicht gesetzt; die Bestätigung für das Anlegen des neuen Zugangscodes wurde angefragt. `API_BASE` bleibt bis zur Live-Einrichtung leer. Es hat keinen echten OpenAI-Aufruf gegeben.

Lokale Abnahme: 19 Worker-Mocktests sowie ein Edge-Browsertest mit mehreren Abläufen und 390/920/1440 Pixeln bestanden. Der Edge-Browser musste wegen eines Startabbruchs in der Sandbox mit einem isolierten Testprofil außerhalb der Sandbox laufen.

## Einrichtung

1. Worker nach `worker/README.md` einrichten. API-Schlüssel ausschließlich als Cloudflare-Secret speichern; keine Schlüssel im HTML oder Git ablegen.
2. `API_BASE` in `app.js` auf die reine HTTPS-Worker-Adresse setzen, ohne `/feedback`. Die ausgelieferte Fassung hat absichtlich keine aktive Adresse.
3. Aufgabenstellung, Musterlösung und Kriterien in `TASK` bearbeiten. IDs müssen stabil und Kriterien eindeutig sein. Bei inhaltlichen Änderungen die Aufgaben-Version ändern; bei einer neuen Aufgabe zusätzlich eine neue dauerhafte Widget-ID in Quelle und `app.js` vergeben, damit keine fremden Lernstände geladen werden.
4. `node tools/edulo/build.cjs Edulo/Freitext-KI/widget.quelle.html`
5. Den gesamten Inhalt von `widget.html` in ein Edulo-Modul „HTML und Dateien“ einsetzen. E1 als unbegrenztes Textfeld und E2 mit 20 unabhängigen Cloze-Feldern, Lösung jeweils `1`, gemäß `tools/edulo/START.md` vorbereiten.
6. Der separat verteilte Zugangscode schützt die kostenpflichtige Schnittstelle vor völlig offenen Aufrufen. Er ist kein OpenAI-Schlüssel, wird nur für Anfragen genutzt und nicht im Lernstand gespeichert. Ein geteilter Code ersetzt keine individuelle Benutzeranmeldung. CORS allein ist keine Authentifizierung.

Die erste Fassung gibt formative Rückmeldung und verändert keine E2-Punkte. Eine fachlich geprüfte Zuordnung von Kriterien zu Punkten kann anschließend ergänzt werden. Entwurf, Anzahl erfolgreicher Prüfungen, zuletzt geprüfte Antwort und Feedback werden über die bestehende Bridge gespeichert. Standalone im lokalen Browser; eingebettet ausschließlich über Edulo, ohne lokalen Ersatzspeicher.

## Feedback-Vertrag

`POST /feedback`, JSON `{task: {id, version, prompt, referenceAnswer, criteria: [{id, label, description}]}, answer}`. Header `Authorization: Bearer <Zugangscode>`. Keine Namen, Edulo-Kontodaten oder vollständigen Lernstände werden verschickt. Die Antwort enthält `{taskId, taskVersion, feedback: {summary, criteria: [{id, status, feedback}], nextSteps}}`. Status pro Kriterium: `met`, `partial`, `missing`. Alle Modelltexte werden als Klartext angezeigt.

Bei Textänderungen wird vorheriges Feedback als veraltet gekennzeichnet. Antwortet eine laufende Prüfung nach einer Änderung, wird ihr Ergebnis verworfen. Ein Verbindungsfehler zählt weder als falsche Antwort noch als erfolgreicher Versuch. Keine automatischen Wiederholungen kostenpflichtiger Anfragen.

## Prüfung und offene Abnahme

`node --test Edulo/Freitext-KI/widget.test.cjs` prüft in einem echten lokalen Edge-Browser mit einer simulierten Feedback-API Speicherung/Wiederöffnung, Klartextdarstellung, Aufgabenübergabe, Fehler und verspätete Antworten sowie 390/920/1440 Pixel Breite. Die erzeugten Vorschaubilder enthalten simuliertes Feedback.

`node --test Edulo/Freitext-KI/worker/worker.test.mjs` prüft den Worker mit simuliertem OpenAI-Aufruf (Dateiname siehe Worker-Anleitung).

Noch separat erforderlich: reale OpenAI-Verbindung mit gültigem Schlüssel und API-Budget, fachliche Qualität bei richtigen/teilrichtigen/falschen/anders formulierten/manipulativen Antworten, Edulo-Origin/CORS aus der tatsächlichen Lernumgebung, Speicherung und Wiederöffnung im echten Edulo sowie Tabletbedienung. Lokale Tests belegen diese Punkte nicht.

Offizielle OpenAI-Quellen: https://developers.openai.com/api/docs/models/gpt-6-luna und https://developers.openai.com/api/docs/guides/structured-outputs.
