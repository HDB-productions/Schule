# Lokale SQLite-Prüfung

Am 25.10.2026 ist `persistence.test.mjs` mit Miniflare `5.20261019.2-beta` und workerd `1.20261019.1` bestanden. Das ist lokale Cloudflare-Emulation, keine produktive Cloudflare-/OpenAI-/Edulo-Abnahme.

Der Test lädt die unveränderten Produktionsmodule `worker.mjs` und `budget.mjs`, bindet `FeedbackBudget` mit `useSQLite:true` und verwendet ausschließlich synthetische IDs/Geldwerte. Jeder ausgehende API-Aufruf wird durch `outboundService` abgefangen und beantwortet; OpenAI wird nicht kontaktiert.

Geprüft werden zwölf parallele Anfragen gegen ein gemeinsames begrenztes Guthaben, atomare Reservierung ohne Überziehung, tatsächliche Abrechnung der Mock-usage, Freigabe des ungenutzten Reservierungsanteils, vollständiges Beenden und Neustarten von Miniflare/workerd mit derselben SQLite-Ablage sowie Wiederaufnahme und identische Wiederholung ohne erneute API-Generierung. Eine persistente SQLite-Datei wird auf lokalem Datenträger bestätigt.

Die lokalen Entwicklungsabhängigkeiten werden unter `.edulo-tools/cloudflare/node_modules/` erwartet. Vom Repository-Hauptordner:

```powershell
$env:EDULO_MINIFLARE_TEST='1'
node --test Edulo/Freitext-KI/worker/persistence.test.mjs
Remove-Item Env:EDULO_MINIFLARE_TEST
```

Ohne die Umgebungsvariable wird dieser Integrationstest übersprungen. Die Sandbox blockierte zunächst Nodes Verbindung zum lokalen workerd-Port mit `connect EACCES 127.0.0.1:<Port>`; die freigegebene lokale Ausführung außerhalb der Sandbox bestand. Synthetische SQLite-Prüfablagen verbleiben unter `.edulo-tools/cloudflare/persistence-test-*` zur Einsicht; keine produktiven Secrets oder Schülerdaten werden dort verwendet.
