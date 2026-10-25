# Edulo-Freitext-API: Identität und dauerhaftes Guthaben

## Verwaltung im Browser

Die veröffentlichte Verwaltung liegt unter `https://edulomodularai.hildebrandt.workers.dev/admin`. Sie ist eine eigene Seite und benötigt keine Änderung am Schülerwidget. Anmeldung mit dem separaten Verwaltungskennwort (`ADMIN_UI_TOKEN` als Cloudflare-Secret, mindestens 32 Zeichen). Das OpenAI-Secret und der optionale technische Abrechnungszugang `ADMIN_TOKEN` bleiben getrennt. Zugangsdaten dürfen nicht ins HTML, Repository, URL-Parameter oder Chat geschrieben werden. Die private lokale Zugangskopie liegt ausschließlich im ignorierten `.edulo-tools/admin-zugang.private.txt`.

Nach Anmeldung stehen zur Verfügung:

- Edulo-ID mit Startguthaben und Wochenlimit hinzufügen.
- Optional einen Namen oder ein Kürzel je ID vergeben und später über „Name speichern“ ändern oder leeren. Vorhandene Konten beginnen ohne Namen. Die ID bleibt die unveränderte Zugangskennung; die Namensänderung beeinflusst keine Buchungen.
- Zusätzlichen Eurobetrag aufladen; bisheriger Verbrauch wird nicht zurückgesetzt.
- Wochenlimit je Konto ändern. Die Woche beginnt montags in Berlin; eine Änderung setzt den Verbrauch dieser Woche nicht zurück.
- Gesamt- und Wochenobergrenze für alle Konten gemeinsam einstellen. Einzelaufladungen erhöhen diese Grenzen nicht automatisch.
- Restguthaben, Verbrauch, Reservierungen und etwaige Abrechnungssperren ansehen.

Nach der ersten Verwaltungsänderung sind die Konten und gemeinsamen Grenzen in der bestehenden Durable-Object-Datenbank maßgebend. `ACCOUNTS_JSON` und `LIMITS_JSON` dienen dann nur noch als ursprüngliche Startkonfiguration; erneutes Einspielen alter Secrets überschreibt die verwalteten Einstellungen nicht. Bestehende Konten werden beim ersten Speichern vollständig übernommen, vorhandene Buchungen und Ergebnisse bleiben erhalten. Preise bleiben unverändert in `PRICE_CONFIG_JSON`.

Namen werden nur in der geschützten Cloudflare-Verwaltungsdatenbank und ihren privaten Änderungsbelegen gespeichert. Sie sind kein Anmeldegeheimnis, werden nicht an OpenAI übermittelt und nicht in Schülerantworten oder Guthaben-Endpunkten ausgegeben. `add` akzeptiert optional `name`, `rename` erwartet `{operationId,action:"rename",uid,name}`. Namen sind auf 120 Zeichen begrenzt, äußere Leerzeichen werden entfernt und Steuerzeichen abgewiesen. Die Oberfläche behandelt Namen ausschließlich als Text. Lokale private Testdateien enthalten weiterhin Kopien der Test-ID; die produktive Freigabeliste wird nicht in Git gespeichert.

Namenszuordnung veröffentlicht am 25.10.2026 als Version `5a51bbe2-c11f-424d-a2a6-9f638197dca0`. 45 Worker-/Verwaltungsprüfungen sowie der lokale Browserlauf bestanden; SQLite-Neustartprüfung bestätigt den geänderten Namen bei unverändert erhaltenem Guthaben. Der Browserlauf prüft Anlegen mit Namen, Ändern, Leeren, Textsicherheit und Wiederanmeldung. Es wurden keine echten Schülernamen oder neue IDs für die Tests in Produktion angelegt.

`POST /admin/manage` erfordert Bearer-Authentifizierung und bei Browseraufrufen exakt die eigene Herkunft; es gibt keine CORS-Freigabe für fremde Seiten. Das Kennwort wird nur im Arbeitsspeicher der geöffneten Seite gehalten, bei Abmeldung verworfen und nicht dauerhaft im Browser gespeichert. Die Seite wird ohne Cache, mit CSP-Script-Nonce und ohne Einbettung in fremde Frames ausgeliefert. Verwaltungsaufrufe unterliegen einer separaten Rate-Limit-Kennung im vorhandenen Rate-Limiter und rufen OpenAI niemals auf.

Jede Änderung hat eine UUID. Bei Verbindungsabbruch bleibt derselbe Vorgang in der geöffneten Seite erhalten; „Vorgang erneut abrufen“ verwendet dieselbe UUID und kann deshalb keine zweite Aufladung erzeugen. Ein kompakter, dauerhafter Auditbeleg speichert Aktion, Betrag, Zeit und UUID; Wiederholung liefert den aktuellen Kontostand ohne erneute Buchung. Ungeklärte Vorgänge vor dem Schließen/Abmelden klären. Nach einem Seitenneustart vor einer neuen Aufladung zuerst den aktuellen Kontostand prüfen.

Die Tests `admin-ledger.test.mjs` und `admin-routing.test.mjs` prüfen atomare Buchung, Idempotenz, Migration der Startkonfiguration, Authentifizierung und Grenzen. `admin-page.test.mjs` prüft die Bedienung im lokalen Edge mit synthetischen Konten. `EDULO_MINIFLARE_TEST=1 node --test Edulo/Freitext-KI/worker/persistence.test.mjs` prüft zusätzlich echte lokale SQLite-Persistenz inklusive angelegter ID, Aufladung und Wiederholung nach vollständigem Runtime-Neustart, ohne externe API-Aufrufe. Secrets werden mit dem offiziellen [Wrangler-Secret-Verfahren](https://developers.cloudflare.com/workers/configuration/secrets/) verwaltet; der Schlüssel wird bei der Veröffentlichung nicht ausgegeben.

Veröffentlicht am 25.10.2026 als Worker-Version `e9696c4c-3c59-4a6f-ac92-913349119350`. 51 Node-Fach-/Worker-/Verwaltungsprüfungen, der separate lokale Browserlauf und die echte lokale SQLite-Neustartprüfung bestanden. Der anschließende lesende Live-Edge-Test bestätigte CSP-kompatible Anmeldung, Zugriff auf genau das bisherige Konto, erneute Anmeldung nach Neuladen, vollständige Abmeldung und identisches Guthaben vor/nach dem Test. Nicht authentifizierte Verwaltungsaufrufe liefern 401. In Produktion wurden keine IDs hinzugefügt, Aufladungen gebucht oder Limits geändert und keine OpenAI-Anfragen ausgeführt. Das erste tatsächliche Speichern in der Verwaltung übernimmt die bestehende Startkonfiguration in die Datenbank. Der vorhandene API-Schlüssel blieb erhalten.

Diese Revision verwendet ausschließlich OpenAI Responses mit **gpt-6-luna**, ohne externe Tools. Der neue Guthabendienst ist am 25.10.2026 nach ausdrücklicher Nutzerfreigabe als `edulomodularai` veröffentlicht und mit drei echten Luna-Prüfungen abgenommen. Der vorhandene `OPENAI_API_KEY` blieb erhalten. Vollständige Belege und die verbleibende echte Edulo-/Tablet-Abnahme stehen in `Physik/Kernphysik/ionisierende-strahlung/README.md` ab Repositorywurzel. Die nachstehenden Einrichtungsschritte gelten für weitere Installationen und Konten; sie erzeugen keine aktiven Beispielkonten.

## Noch benötigte Einrichtung

Es gibt im Quellcode absichtlich keine aktiven Beispielkonten, Geldbeträge oder Wechselkurse. Die produktive Testkonfiguration liegt ausschließlich in Cloudflare-Secrets. Ohne vollständige explizite Konfiguration bleibt `/health` auf HTTP 503 und es gibt keine OpenAI-Aufrufe.

1. Lehrkraft legt freizugebende **Edulo-Anmelde-IDs**, dauerhaft insgesamt gewährtes Guthaben in Euro und ein Wochenlimit je ID fest. Die ID kommt automatisch aus `widget.user.uid`; Schüler geben keinen Zugangscode ein. Format: `^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$` (Groß-/Kleinschreibung im Format zulässig, Zuordnung exakt; äußere Leerzeichen werden entfernt).
2. Die Freigabeliste als **Secret `ACCOUNTS_JSON`** setzen, niemals im HTML, Repository, öffentlichen Variablen oder Chat veröffentlichen. Struktur (Platzhalter ersetzen, kein direkt einsetzbarer Kontoeintrag):

   ```text
   {"<exakte Edulo-ID>":{"totalGrantedEuroMicros":<insgesamt gewährte Euro-Millionstel>,"weeklyLimitEuroMicros":<Euro-Millionstel pro Woche>}}
   ```

   1 Euro = 1.000.000 Euro-Millionstel. Gesamtguthaben darf null sein, Wochenlimit muss positiv sein. Sämtliche Zahlen sind sichere ganze JavaScript-Zahlen. **Aufladen:** `totalGrantedEuroMicros` um den neuen Betrag erhöhen; nie nur den gewünschten Restbestand eintragen. Der Ledger behält das höchste bisher eingelesene Gesamtguthaben. Bereits verbrauchte Beträge werden weder gelöscht noch erstattet. Eine veraltete/niedrigere Konfiguration setzt Guthaben nicht zurück. Entfernen der ID sperrt den Zugang, löscht aber keinen Ledger.
3. **`PRICE_CONFIG_JSON`** explizit als Secret konfigurieren:

   ```text
   {"inputNanoUsdPerToken":100,"cachedInputNanoUsdPerToken":10,"outputNanoUsdPerToken":500,"euroMicrosPerUsd":<expliziter Wechselkurs in Euro-Millionstel je USD>,"version":"<eindeutige Preis-/Kursversion>"}
   ```

   Die drei Tokenpreise entsprechen den am 25.10.2026 geprüften [offiziellen Modellpreisen](https://developers.openai.com/api/docs/models/gpt-6-luna): 0,10 USD Eingabe, 0,01 USD gecachte Eingabe, 0,50 USD Ausgabe je Million Tokens. Vor Einrichtung erneut prüfen. Der Wechselkurs ist eine bewusste Lehrkraftentscheidung; der Worker erfindet keinen Kurs und ruft keinen Währungsdienst auf. Neue Aufrufe verwenden die aktuelle Preisversion, jede Reservierung bewahrt ihre eigene Preiskonfiguration.
4. **`LIMITS_JSON`** als Secret explizit setzen:

   ```text
   {"globalLifetimeLimitEuroMicros":<globales dauerhaftes Limit>,"globalWeeklyLimitEuroMicros":<globales Wochenlimit>}
   ```

   Beide Werte müssen positiv sein. Diese Grenzen gelten zusammen für alle Konten im selben Durable-Object-Namespace. Cloudflare-Kosten sind darin nicht enthalten. Für eine endgültige harte Kostenobergrenze zusätzlich den OpenAI-Projektzugriff begrenzen und überwachen: eine konservative Reservierung kann tatsächliche Tokenzahlen nicht mathematisch garantieren.
5. `ALLOWED_ORIGINS` in `wrangler.jsonc` auf die exakten Herkunftswerte setzen, kommasepariert, ohne Pfad/Schrägstrich/Wildcard. HTTPS sowie ausdrücklich eingetragene lokale HTTP-Origins sind erlaubt. **Edulo iPad:** Der Nutzerscreenshot vom 25.10.2026 belegt `ionic://localhost`; genau dieser zusätzlich konfigurierte Wert wird unterstützt. Andere Ionic-/Custom-Scheme-Herkünfte bleiben gesperrt. **Edulo Desktop / file://** kann den Origin `null` senden: ausschließlich dann ausdrücklich den Textwert `null` ergänzen. `file://` selbst ist kein zulässiger Origin-Wert. Diese Freigabe umfasst bewusst alle opaken Browserherkünfte; CORS beweist keine Identität.
6. Die bereitgestellte Wrangler-Konfiguration bindet `FEEDBACK_BUDGET` an die Klasse `FeedbackBudget` und erstellt diese mit `new_sqlite_classes` als [SQLite-backed Durable Object](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/). Der gesamte Worker besteht aus `worker.mjs` **und** `budget.mjs`; bloßes Einfügen der alten Einzeldatei im Dashboard reicht nicht. Der bestehende `FEEDBACK_LIMITER` (30 pro 60 Sekunden, Namespace 10012501) ist weiterhin enthalten. Vor Veröffentlichung bestehende Dashboard-Konfiguration mit der Datei abgleichen. Eine beabsichtigte Veröffentlichung erfolgt aus diesem Ordner mit `npx wrangler deploy`; diese Anleitung führt sie nicht aus. Secrets mit `wrangler secret put <NAME>` einzeln setzen; vorhandenen API-Schlüssel weder auslesen noch ersetzen.
7. `/health` muss `{ "ready": true }` mit HTTP 200 liefern. Das bestätigt nur vorhandene gültige Konfiguration, weder Modellzugriff noch gespeicherte Guthaben oder eine echte Edulo-Anmeldung. Anschließend kontrolliert echte Cloudflare-, OpenAI- und Edulo-/Desktop-Prüfung durchführen.

Der Object-Name `feedback-budget-v1`, Binding-Namespace und gespeicherte Account-/Globaldaten sind dauerhaft. Sie dürfen bei Updates nicht durch einen neuen Namespace oder Object-Namen ersetzt werden: dadurch ginge der bisherige Verbrauch aus der aktiven Abrechnung verloren. Die SQLite-Migration einmal anwenden, nicht bei jedem Update neue Klassen erzeugen. `.dev.vars*`, `.env*` und `.wrangler/` bleiben von Git ausgeschlossen.

## API-Vertrag

Kein Bearer-Klassencode. Alle POSTs verwenden `Content-Type: application/json`.

- `GET /health` → nur `{ready:boolean}`.
- `GET /connection` → ausschließlich `{requestOrigin,originAllowed,ready}` als kostenfreie öffentliche Verbindungsprobe. Nur diese Probe erlaubt CORS `*`, auch für bisher unbekannte App-Herkünfte. Keine Konten, Guthaben oder Schlüssel; kein Aufruf an OpenAI. Alle übrigen Endpunkte behalten ihre eigene strenge Herkunfts- und Kontoprüfung.
- `POST /quota` mit `{uid}` → `{budget}`. Keine Namen, Kontoliste oder anderen IDs.
- `POST /feedback` mit `{uid,requestId,task,answer}`. `requestId` ist eine vom Widget einmal je Anfrage erzeugte UUID. `task` enthält genau `id,version,prompt,referenceAnswer,criteria`; jedes Kriterium genau `id,label,description`.
- `POST /result` mit `{uid,requestId}` fragt eine bereits vorhandene Anfrage ohne Kosten und ohne OpenAI-Aufruf ab; unbekannt HTTP 404, noch laufend HTTP 202.

Ein Erfolg liefert:

```text
{
  taskId, taskVersion, requestId, feedbackStyle: "questions-v2",
  feedback: {
    summary,
    criteria: [{id,status:"met"|"partial"|"missing",feedback}],
    nextSteps: [maximal drei Hinweise],
    languageFeedback: "allgemeine Hinweise zur verständlichen Formulierung",
    misconceptions: [{statement:"kurzes Originalzitat",correction:"gezielte fachliche Klarstellung"}]
  },
  budget: {remainingEuroMicros,weeklyRemainingEuroMicros,reservedEuroMicros,weekKey},
  charge: {status:"settled"|"reserved"|"none",euroMicros}
}
```

`misconceptions` enthält null bis drei Einträge: ausdrücklich vorhandene falsche Aussagen oder thematische Verwechslungen werden knapp korrigiert. Eine bloß fehlende Erklärung erzeugt keinen Eintrag. Das Feld verändert keine Punktzahl. Nur hier darf die zur Fehlerkorrektur notwendige richtige Ersatzinformation stehen; alle weiteren fehlenden Inhalte werden weiterhin durch offene Fragen erschlossen. Eine richtige Aussage im falschen Themenkontext erfüllt die Kriterien der eigentlichen Aufgabe nicht automatisch. Alte gespeicherte Ergebnisse ohne dieses Feld werden unverändert wiedergegeben und bleiben im aktualisierten Widget lesbar.

Optional kann `task.feedbackGroups` als Array von `{id,prompt,criterionIds}` übergeben werden. Die Gruppen müssen sämtliche Kriterien genau einmal zuordnen (maximal zehn Gruppen). Dann liefert der Worker zusätzlich `feedback.taskFeedback: [{id,feedback}]` mit genau einem Text je Gruppe und den Marker `questions-v3`. Die Bewertung aller einzelnen `criteria[].status` bleibt erhalten; `criteria[].feedback` ist dann bewusst `""` und `nextSteps` ist `[]`, damit keine doppelten Arbeitsaufträge erzeugt werden. Gruppenfeedback umfasst maximal 1200 Zeichen, einen zusammenhängenden Absatz und laut Prompt höchstens zwei verschiedene Leitfragen. Ohne Gruppen bleibt der bisherige `questions-v2`-Vertrag unverändert.

`remainingEuroMicros` und `weeklyRemainingEuroMicros` sind bereits um offene Reservierungen vermindert. `reservedEuroMicros` bezeichnet alle offenen Reservierungen dieses Kontos. `weekKey` ist das lokale Kalenderdatum des Wochenmontags in `Europe/Berlin`; Wochenwechsel montags 00:00 Uhr, einschließlich Sommer-/Winterzeit. Über einen Wochenwechsel laufende Anfragen belasten ihre ursprüngliche Reservierungswoche. Fachliche Kriterien und allgemeine Sprachhinweise bleiben getrennt; verständliche Schreib-/Grammatikfehler führen standardmäßig nicht zu fachlichen Abzügen. Keine Noten oder Punkte.

Identische Wiederholung derselben Anfrage-ID liefert das gespeicherte Ergebnis oder HTTP 202 und erzeugt **keinen zweiten API-Aufruf**. Wiederverwendung mit anderer Aufgabe/Antwort liefert HTTP 409 `request_conflict`. Nach Browser-Timeout zuerst `/result` verwenden und die ursprüngliche Anfrage-ID behalten. Eine neue UUID ist eine neue, möglicherweise erneut kostenpflichtige Anfrage. Es gibt keine automatischen API-Wiederholungen.

Fehler sind `{error:{code,message}}`, bei vorhandener Reservierung ergänzt um `requestId`, `budget`, `charge`. Codes enthalten keine rohen API-Fehler oder Geheimnisse. Unter anderem: 400 ungültige Daten, 402 `budget_exhausted`, 403 `uid_not_allowed`/`origin_forbidden`, 409 `request_conflict`/`account_review_required`, 413 Body zu groß, 415 falscher Inhaltstyp, 422 verweigerte Ausgabe, 429 lokales Limit, 502 unbrauchbare/unklare API-Antwort, 503 fehlende Einrichtung/globales Limit, 504 API-Timeout.

## Abrechnung und offene Ergebnisse

Ein einziges Durable Object je Deployment reserviert **Konto + Kontowoche + globalen Gesamtverbrauch + globale Woche** in einer stark konsistenten Storage-Transaktion. Der OpenAI-Netzwerkaufruf erfolgt erst danach und außerhalb der Transaktion. KV-Storage-Methoden innerhalb der SQLite-backed DO-Transaktion sind dauerhaft; das System verwendet keinen RAM-Zähler zur Geldverwaltung. Der Cloudflare-Durchsatzbegrenzer ist lediglich ein zusätzlicher Schutz pro Cloudflare-Standort.

Reserviert wird konservativ mit den UTF-8-Bytes des vollständigen Upstream-JSON plus 16.384 Framing-/Schema-Tokens und 4.000 Ausgabetokens. Das ist eine Sicherheitsabschätzung, keine garantierte Tokenzählung. Abgerechnet wird die tatsächliche gültige API-`usage`: gecachte Tokens werden von der normalen Eingabe abgezogen, Reasoning-Tokens sind bereits in `output_tokens` enthalten. Geldrechnung erfolgt mit BigInt und Aufrundung auf ein Euro-Millionstel pro Aufruf. Bei Abrechnung löst der nicht benötigte Anteil der Reservierung sich; dies ist **keine Erstattung bereits angefallener Kosten**.

Auch verweigerte, unvollständige oder fachlich/strukturell ungültige Rückmeldungen werden bei bekannter `usage` belastet. Explizite strukturierte API-Fehler bei HTTP 400/401/403/404/429 ohne usage oder Ausgabe lösen nur die ungenutzte Reservierung. Fehlerantworten mit gültiger usage werden belastet, mehrdeutige Proxy-/Textfehler halten die Reservierung. Netzwerkfehler, Timeout, HTTP 5xx, unlesbare Antwort oder fehlende/ungültige `usage` bleiben ungeklärt: Reservierung bleibt dauerhaft gehalten, Konto wird für neue Anfragen gesperrt. Nach Worker-Abbruch kann eine Reservierung ohne Ergebnis ebenfalls bestehen bleiben. Keine automatische Freigabe, kein periodisches Reset und keine Wiederholung. Übersteigt ein tatsächlich gemeldeter Verbrauch die Abschätzung, wird er vollständig belastet und das Konto zur Prüfung gesperrt.

## Private Klärung durch die Lehrkraft

Optionales zusätzliches Secret **`ADMIN_TOKEN`** mit mindestens 32 Zeichen ermöglicht `POST /admin/reconcile`. Es ist keine Voraussetzung für die normale Bereitschaft und wird niemals im Widget abgefragt. Diesen separaten Verwaltungsschlüssel später selbst sicher erstellen und als Cloudflare-Secret sowie privat in der lokalen Umgebungsvariable `ADMIN_TOKEN` hinterlegen. Keinen Token in Befehlsargumente, Shell-History, Repository oder HTML schreiben. Verwaltungsaufrufe dürfen **keinen `Origin`-Header** enthalten und benötigen `Authorization: Bearer <ADMIN_TOKEN>`; auch ein sonst freigegebener Browser wird abgewiesen.

Der Body enthält genau `{uid,requestId,actualEuroMicros,supportingNote}` und bei einem bestätigten Nullbetrag zusätzlich `confirmedNoCharge:true`. `supportingNote` muss einen aussagekräftigen überprüften Beleg beschreiben (10–1000 Zeichen). Den endgültigen tatsächlichen API-Verbrauch zuerst anhand der OpenAI-Abrechnung prüfen und mit der bei Reservierung gültigen Preis-/Kursversion berechnen; keine geschätzten Nullbeträge eintragen. Beispielstruktur einer lokal erstellten **`reconciliation.private.json`** (Platzhalter ersetzen):

```text
{"uid":"<exakte Edulo-ID>","requestId":"<ursprüngliche UUID>","actualEuroMicros":<überprüfter tatsächlicher Betrag>,"supportingNote":"<Beleg und geprüfte Zuordnung>"}
```

Das private Hilfsskript liest den Token ausschließlich aus der vorhandenen Umgebungsvariable und sendet genau einen Verwaltungsaufruf:

```powershell
node reconcile.mjs https://<worker-adresse>/ reconciliation.private.json
```

Dateien mit Endung `.private.json` sind lokal von Git ausgeschlossen; sie gehören nicht ins Widget. Nach Benutzung die private Umgebungsvariable entfernen. Das Skript gibt nur die sichere Serverantwort aus. Kein automatischer Wiederholungsversuch; nach einem Timeout dieselbe Klärung mit unveränderten Werten erneut senden, um die Idempotenz zu nutzen.

Eine Klärung gilt nur für eine noch reservierte Anfrage. Ungeklärte Fehler können sofort nach geprüfter Abrechnung geklärt werden; eine ergebnislose möglicherweise abgebrochene Anfrage erst nach mindestens zwei Minuten. Abgeschlossene Buchungen sind unveränderlich. Der bestätigte Betrag muss zwischen null und Reservierung liegen. Ein Betrag darüber führt zu `reconciliation_overrun`: keine Freigabe, separate manuelle Prüfung nötig. In einer Transaktion wird der bestätigte Betrag auf Konto, ursprüngliche Woche und globale Zähler gebucht, die Restreservierung gelöst und Beleg/Zeit dauerhaft gespeichert. Der Ledger bleibt erhalten. Genau dieselbe Klärung ist idempotent, andere Wiederholungswerte ergeben HTTP 409. Andere offene ungeklärte Anfragen oder Überverbräuche halten die Kontosperre aufrecht.

Erfolg liefert ausschließlich `{reconciled:true,requestId,budget,charge}`. Auch null Euro ist danach eine ausdrücklich geklärte Buchung mit `charge.status:"settled"`. Die Schüleransicht `/result` und die ursprüngliche `/feedback`-Anfrage liefern danach einen sicheren gespeicherten Fehler `feedback_unavailable_reconciled`, den geklärten Betrag und aktuelles Budget; der private Beleg wird nie herausgegeben. Eine neue Rückmeldung erfordert eine bewusste neue Anfrage. Der Dienst ruft OpenAI bei der Klärung nicht erneut auf.

## Identität, Daten und Grenzen

`widget.user.uid` ist eine Zuordnungskennung, **kein kryptografischer Anmeldenachweis**. Der Server prüft das Format und die geheime Freigabeliste; wer die fremde freigegebene ID kennt, kann sie außerhalb Edulos behaupten. CORS verhindert das nicht. Die Kontolimits begrenzen diese Nutzung. Für stärkere Identitätsprüfung wäre ein von Edulo serverseitig überprüfbarer Nachweis nötig; ein solcher ist hier nicht erfunden.

- Maximal 48.000 UTF-8-Bytes pro Anfrage und 12.000 Antwort-Zeicheneinheiten (z.B. drei Felder à 4000). Prompt 3000, Referenzantwort 6000, Version 40; 1–20 Kriterien, Label 120, Beschreibung 600. Aufgaben-/Kriterien-IDs: `^[a-z][a-z0-9_-]{0,63}$`, eindeutig. Zusätzliche Felder werden abgewiesen.
- Maximal 4000 Ausgabetokens und 25 Sekunden für die API-Antwort. Keine automatische Wiederholung, keine externen Tools, `store:false`.
- Der Durable Object speichert UID-SHA-256-Schlüssel, Gesamt-/Wochenstände und dauerhaft Anfrage-IDs, Payload-Hash, Reservierung, Preisversion/-konfiguration, Verbrauchskosten, gültige API-usage/Response-ID und Rückmeldung bzw. sicheren Fehler zur Idempotenz. Private Klärungen speichern zusätzlich Beleg, Zeitpunkt und bestätigten Betrag. Schülerantwort und Aufgabeninhalt werden nicht zusätzlich im Ledger gespeichert. Feedback kann sich auf die Schülerantwort beziehen. Keine Schüler-/Schlüsselprotokolle; Wrangler-Observability ist aus.
- Antwort und Aufgabenrubrik werden an OpenAI übertragen. `store:false` ist keine Garantie vollständiger Datenlöschung. Keine unnötigen Namen/Personendaten mitsenden. Die Freigabeliste liegt ausschließlich im Server-Secret.
- Die Rubrik im Widget ist lesbar/veränderbar; keine manipulationssichere Prüfungsbewertung. Instruktionen behandeln Rubrik und Antwort als unzuverlässige Daten; fachliche Fehler und Prompt-Injection bleiben möglich. Texte im Widget mit `textContent` ausgeben.

## Lokale Prüfung

```powershell
node --test Edulo/Freitext-KI/worker/worker.test.mjs
```

26 Tests mit ersetztem OpenAI, Rate-Limiter und persistentem Transaktions-Storage-Mock: parallele Konten-/Globallimits, Neustart mit demselben Speicher, Idempotenz, Aufladung, Berliner DST-Wochengrenzen, Zahlung bei Verweigerung/Fehler, ungeklärte Reservierung, Preisschätzung/usage, Daten-/Instruktionstrennung, CORS einschließlich explizitem `null`, Feld-/Bytegrenzen und failclosed Einrichtung. Mock-Neustart prüft keine echte Cloudflare-SQLite-Persistenz. Zusätzlich werden die getrennte Admin-Autorisierung, Nullkostenbestätigung, Originalwochenbuchung, Mehrfachklärung und unveränderliche abgeschlossene Buchungen geprüft. Echte Bereitstellung, API-Kosten und Edulo-/Tablet-/Desktop-Betrieb sind noch nicht abgenommen.
