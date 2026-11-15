# Privater Klausurarchiv-Sync

Eigenständiger Cloudflare Worker mit einem SQLite Durable Object. Keine Verbindung zu Edulo, keine Schüleranmeldung und keine Cookies. Ein Besitzer-Schlüssel berechtigt zum Lesen und Schreiben des gesamten Archivs. Der Worker speichert ausschließlich dessen SHA-256-Prüfwert als Cloudflare-Secret; keine Zugangsschlüssel in Git, URLs oder dieser Konfiguration ablegen.

## Einrichtung

Voraussetzungen: Cloudflare-Konto mit Workers und SQLite Durable Objects, Node.js und Wrangler. Befehle in diesem Ordner ausführen:

```powershell
npx wrangler login
npx wrangler deploy
npx wrangler secret put ARCHIVE_KEY_SHA256
```

Beim letzten Befehl ausschließlich den **64-stelligen SHA-256-Hex-Prüfwert in Kleinbuchstaben** des Besitzer-Schlüssels eingeben. Den eigentlichen Schlüssel nur auf den eigenen Geräten eintragen. Er muss aus 32 kryptografisch zufälligen Bytes bestehen, ohne Base64-Padding als Base64url kodiert (43 Zeichen). Dieses Repository erzeugt und enthält keinen produktiven Schlüssel. Ohne korrekt gesetzten Prüfwert antworten Archiv-Endpunkte mit `503 not_configured`; `/health` bleibt erreichbar. Das Secret kann auch vor der ersten Veröffentlichung über das Cloudflare-Dashboard eingerichtet werden.

Die von Wrangler ausgegebene HTTPS-Worker-Adresse ist die Sync-Serveradresse für die App auf allen Geräten. Schlüssel und Prüfwert bleiben auch nach Code-Aktualisierungen getrennt: `wrangler deploy` schreibt kein Secret in die Konfigurationsdatei. Eine Schlüsselrotation erfolgt durch erneutes Setzen von `ARCHIVE_KEY_SHA256` und Umstellen aller eigenen Geräte; bestehende Archivdaten bleiben erhalten.

Die Datenbank wird ausdrücklich mit `ARCHIVE.jurisdiction('eu').idFromName('single-owner-archive-v1')` adressiert. Falls EU-Jurisdiktion in der Laufzeit nicht verfügbar ist, schlägt der Zugriff fehl; es gibt keinen stillen Wechsel auf einen anderen Speicherort. Objektname, Binding und Jurisdiktion bei Folgeversionen beibehalten, um dasselbe Archiv weiterzuverwenden. Die Beschränkung gilt für Ausführung und Speicherung des Durable Objects, nicht automatisch für sämtliche Worker-Anfragen oder Cloudflare-Betriebsmetadaten. [Cloudflare: Datenstandort](https://developers.cloudflare.com/durable-objects/reference/data-location/).

## HTTP-Vertrag

Alle Antworten sind JSON, außer erfolgreichen CORS-Preflights (`204`). Kein Cache, kein Cookie, keine Wildcard-Origin. Alle Archiv- und Sicherungsendpunkte benötigen `Authorization: Bearer <Besitzer-Schlüssel>`.

| Methode und Pfad | Ergebnis |
| --- | --- |
| `GET /health` | Öffentlich: `{"ok":true}`. Prüft Erreichbarkeit, nicht Secret oder Datenbank. |
| `GET /archive` | `{"revision":0,"store":null,"updatedAt":null}` vor dem ersten Speichern, danach `{revision,store,updatedAt}`. |
| `PUT /archive` | JSON-Body `{baseRevision,store}`; bei Erfolg `200 {revision,store,updatedAt}` mit um eins erhöhter Revision. |
| `GET /backups` | `{backups:[{revision,updatedAt,bytes}]}`, neueste zuerst, bis zu 20 vorherige Revisionen; kein Archivinhalt. |
| `GET /backups/:revision` | Gespeicherte Revision `{revision,store,updatedAt}`; `404`, falls nicht vorhanden. Auch die aktuelle Revision kann gelesen werden. |

`baseRevision` muss eine nichtnegative sichere Ganzzahl sein und mit dem aktuellen Serverstand übereinstimmen. Bei einer Abweichung: `409 {"error":"conflict","revision":<aktuelle Revision>}`. Der vorhandene Stand wird dabei nicht verändert. Nach einem Konflikt zunächst neu laden und Unterschiede auf dem Gerät klären; nicht automatisch dieselben Daten mit der neuen Revision erneut hochladen.

`store` hat `version:1`, `currentExamId` (ID einer vorhandenen Klausur oder `null`), `exams`, `taskBlockLibrary` und `classListLibrary`. Klausuren besitzen `metadata.id`, `students`, `structure` und `evaluations`; `printLayout` ist optional. Klausur-, Schüler-, Struktur- und Vorlagen-IDs müssen innerhalb ihrer jeweiligen Liste eindeutig sein. Aufgabenbausteine besitzen `nodes`; Klassenlistenvorlagen besitzen `students` ohne erforderliche Schüler-IDs, entsprechend dem bestehenden App-Format. Zusatzfelder bleiben erhalten. Es erfolgt eine grundlegende Strukturprüfung, keine fachliche Prüfung der Bewertungen.

Maximaler Request-Body: **6 MiB (6.291.456 Bytes)** einschließlich JSON-Hülle. `Content-Type: application/json` ist erforderlich. Der Grenzwert wird auch für gestreamte Requests ohne `Content-Length` geprüft. Archivdaten liegen als Binärblöcke von höchstens 128 KiB in SQLite. Revisionsprüfung, vollständiger Schreibvorgang und Aufräumen der Sicherungen laufen gemeinsam in einer synchronen SQLite-Transaktion; es gibt kein `await` zwischen Prüfung und Änderung. [Cloudflare: transactionSync](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/#transactions).

Der aktuelle Stand und die **20 unmittelbar vorhergehenden erfolgreichen Speicherstände** bleiben erhalten. Jeder erfolgreiche PUT zählt als neuer Speicherstand. Bei vielen Speichervorgängen kann dieses Fenster daher kurz sein. Zusätzlich weiterhin lokale JSON-Exporte aufbewahren. Es gibt keinen schreibenden Restore-Endpunkt: Ein gelesener Sicherungsstand kann nach Prüfung mit `PUT /archive` und der derzeitigen `baseRevision` als neuer Stand gespeichert werden.

Fehlerformat: `{error:"code"}`, bei Konflikten zusätzlich `revision`. Verwendete HTTP-Statuscodes: `400` für ungültiges JSON/Archiv, `401` für fehlende oder falsche Zugangsdaten, `403` für unzulässige Origin/Preflight, `404` für unbekannte Pfade/Revisionen, `405` für unzulässige Methoden, `413` bei zu großem Body, `415` für einen anderen Inhaltstyp, `500` für interne Fehler, `503` ohne korrekt konfiguriertes Secret und `507` bei ausgeschöpftem sicheren Revisionszähler. Interne Details und Archivdaten werden nicht protokolliert.

Erlaubte Browser-Origins sind ausschließlich `https://hdb-productions.github.io` und die wörtliche Origin `null` für lokal per `file://` geöffnete Apps. Anfragen ohne Origin sind für CLI-Werkzeuge zulässig. `null` kann auch von anderen isolierten Browserkontexten gesendet werden: CORS ist keine Anmeldung; jede Datenanfrage benötigt weiterhin den starken Besitzer-Schlüssel. Preflight erlaubt nur `Authorization` und `Content-Type` und die Methoden des konkreten Endpunkts. Cookies werden nicht verwendet. Unbekannte Pfade, zusätzliche Query-Parameter und andere Methoden werden zurückgewiesen.

## Lokale Prüfung

Die Tests benötigen Node.js 24 mit dem integrierten `node:sqlite`, keine npm-Abhängigkeiten und keine Zugangsdaten:

```powershell
node --test worker.test.mjs
```

Die Tests führen die SQL-Abfragen gegen echtes SQLite im Arbeitsspeicher aus. Sie prüfen Authentifizierung, CORS und Preflight, Routing, leeres Archiv, konkurrierende CAS-Schreibversuche, Sicherungsaufbewahrung, Objektneuerstellung, große Unicode-Daten, Transaktions-Rollback bei einem unterbrochenen Block-Schreibvorgang, Strukturprüfung und Body-Limits. Dies ersetzt keinen Test der veröffentlichten Cloudflare-Laufzeit oder eines echten Tablets.

Optional vor einer bewussten Veröffentlichung Wrangler nur bündeln lassen:

```powershell
npx wrangler deploy --dry-run --outdir .wrangler/dry-run
```

Wrangler-Laufzeitdaten, lokale Secret-Dateien und Abhängigkeiten sind in diesem Ordner Git-ignoriert. Observability ist deaktiviert. Der Code erzeugt keine Zugangsschlüssel und veröffentlicht sich nicht selbst.
