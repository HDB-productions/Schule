# Herkunft und Prüfgrenzen

## Quellen

- Inspector-Unterhaltung „Edulo Inspector Unterhaltung“, Chat-ID `6aaea8f8-31e0-83eb-af3d-df42b8ac6cbd`: gebündelte Befunde vom 24.–26.01. und 26.02.2026 zu Einbettung, Parametern, DOM und früheren Score-Versuchen.
- Nutzertests vom 19.09.2026 in der anschließenden Codex-Unterhaltung: `Edulo-Test-Ergebnis.json`, `Edulo-Steuerung-Diagnose.json`, `Edulo-Modul-Diagnose.json`, `Edulo-Farbwechsel-Ergebnis.json`. Deren relevante Befunde sind in findings.md konsolidiert. Große Rohberichte, persönliche Dateipfade und komplette App-Sources werden absichtlich nicht als Standardkontext verteilt.
- Anschließende explizite Nutzerbestätigungen: E1 zusätzlicher grüner Punkt; direkte Farben in Übersicht korrekt; Prüfung/Wiederöffnen aktualisiert Feldsymbole; Excel übernimmt aktuellen Zustand ohne Prüfung.
- Nutzer-Größentest: konkrete CSS-Messwerte in layout.md. Kein aus einer Auflösung geratenes globales Edulo-Fenstermaß.
- Lokale Vorbilder: Bruchrechnungswidgets, Äquivalenzumformungen und DynaMot. Die neuen Befunde ersetzen ältere 0/1- und Auto-Check-Annahmen für neue Integrationen.

## Was wurde wie geprüft?

- Realer Edulo-Nutzertest: drei Cloze-Punkte, gezielte Einzelpunkt-Zustände, Wiederöffnen, andere Punkte unverändert, Übersicht, anschließend Excel und Prüfmarkierungen.
- Lokal: alter Einzelpunkt-Setter und neue 20-Felder-Kit-Anbindung gegen tatsächlich exportierte load/check/save-Funktionen geprüft. Die Kit-Suite prüft zusätzlich Fremddaten-/Editor-/Einbettungsschutz, Rücknahme bei abweichender Bewertung und Layout. Simulierte Host-/Eventumgebung ist keine neue unabhängige Edulo-Serverprüfung.
- Neue Kit-Fassung: vorbereitetes Mehrpunkt-Batching, robustere Feld-/Rootverwaltung, Generator und Build. Sie ist noch kein im echten Edulo getestetes fertiges Lernwidget. Ein neu gebautes Fachwidget braucht den kurzen echten Einbettungs-/Wiederöffnungstest.

## Pflege

Bei neuen bestätigten Erkenntnissen die betroffene kurze Referenz aktualisieren; keine langen Chatprotokolle an START.md anhängen. Standardvertrag/Adapter nur ändern, wenn der Normalfall betroffen ist. Nach Adapteränderung Kit-Suite, nach reiner Fachänderung Fachtests. Keine erneute Full-Repo-/Chat-Suche, solange der dokumentierte Vertrag passt.

Offene nicht blockierende Themen: bewertungsneutraler Ersatz für E1; zukünftige Host-Versionen; unabhängige Geräte-/Server-Synchronisierung; gezielte sichtbare Symbolauffrischung ohne Nebenwirkung. Diese Fragen ändern den bestätigten Standardweg nicht automatisch.

Footer jetzt zusätzlich im echten Nutzerexport bestätigt: `reference/footer-live.json` (Originaldatei `1f3eab40-defb-4dab-b28a-0202805e23bf.json`, 19.09.2026). Zwei Ausblendungen mit identischen Maßen und dazwischen vollständige Wiederherstellung: Wrapperhöhe 643,0134 → 728,0067 px, Gewinn 84,9933 px; Viewport 1024 × 768. Kein neuer Bewertungs-/Servernachweis. Die früheren 40 px waren ausschließlich die lokale Testumgebung.

Weiterentwicklung: Die Bridge blendet den Footer standardmäßig aus, mit Konfigurations- und Laufzeitschalter. Automatische Einbindung, Wiederherstellung, Ersatz-/Spätrendering und dynamische Vorlagenhöhe werden lokal geprüft; der zugrunde liegende Layout-Eingriff ist durch den Footer-Nutzerexport belegt. Der neue automatische Lebenszyklus braucht noch den ersten Einsatz in einem echten Lernwidget.
