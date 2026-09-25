# Kit prüfen

`node tools/edulo/tests/run.cjs`

Voraussetzung: Node.js, Playwright und ein installierter Edge-Browser. Der Test verwendet zuerst das normale `playwright`-Paket, dann die gebündelte Codex-Laufzeit im Benutzerprofil. Abweichende Installation über `PLAYWRIGHT_MODULE` (absoluter Paketpfad) und Browser über `BROWSER_CHANNEL` konfigurieren. Keine Paketinstallation im Build erforderlich.

Die Suite erzeugt kurzzeitig ein eigenes `.test-*`-Verzeichnis unter `tools/edulo` und entfernt nur dieses. Sie startet einen lokalen HTTP-Host und prüft Standalone, gleiche Dokumentebene und iframe/Parent-Anbindung mit 20 Feldern, Farbwechsel, E1-Schutz, späte Felder, Editor, Rücknahme bei Fehlern, Generator und mobile Breite. Footer-Helfer und dessen einfache Testoberfläche werden ebenfalls lokal geprüft. Kein Kontakt zu Edulo-Servern.

Optional kann `EDULO_DIAGNOSIS` auf einen privaten `Edulo-Modul-Diagnose.json`-Export zeigen. Dann führt die Suite dessen tatsächlich exportierte vier Cloze-Funktionen in der lokalen Testumgebung aus. Nur eigene vertrauenswürdige Diagnose verwenden: Funktionsquellen werden als JavaScript ausgeführt. Rohdatei nicht ins Repo kopieren. Ohne diese Option wird ein bewusst vereinfachtes Modell benutzt.

Neue Fachlogik separat gezielt testen. Erfolgreicher lokaler Test ersetzt nicht das einmalige Einbetten, Bearbeiten und Wiederöffnen des neuen Widgets in Edulo.
