# Ionisierende Strahlung: erste Freitext-KI-Unterrichtsseite

## In Edulo einsetzen

1. **E1:** normales Text-Antwortfeld ohne Zeichenbegrenzung für den vollständigen Lernstand einschließlich aller Entwürfe, eingereichten Antworten, Rückmeldungen, Hilfemerkmale und Punkte. Die Bridge verwendet das bestehende `EDULO2:`-Format; die lesbare Historie erscheint im Widget.
2. **E2:** Cloze-Modul mit **13 unabhängigen Punktefeldern**, jeweils Lösung `1`, je ein Punkt. Keine vorgegebenen/verbundenen/ungeprüften Lücken. Reihenfolge siehe Tabelle unten. `scoreCount:13` ist hier bewusst abweichend vom allgemeinen 20-Punkte-Standard eingestellt. Bei einem Update der ersten Fassung eine 13. Lücke ergänzen; die bisherigen zwölf Zuordnungen bleiben gleich.
3. **E3:** „HTML und Dateien“ mit dem **gesamten** Inhalt von `widget.html`. Bei Updates den Inhalt vollständig ersetzen.

Die technischen E1/E2-Felder und die Edulo-Fußleiste werden im Lernmodus ausgeblendet. Keine eigene Seitenüberschrift; drei fachliche Aufgabenüberschriften. Volle verfügbare Breite, normale Inhaltshöhe, keine verschachtelten vertikalen Scrollflächen. Das Video wird als externer Link geöffnet, nicht eingebettet.

**Die KI-Anbindung ist aktiv und mit echten Luna-Aufrufen geprüft.** `API_BASE` in `task.js` zeigt auf `https://edulomodularai.hildebrandt.workers.dev`. Freigeschaltet ist zunächst ausschließlich die vom Nutzer benannte Test-ID mit 0,50 Euro Gesamtguthaben und 0,10 Euro Wochenlimit. Die ID/Freigabeliste steht nicht im HTML oder Repository. Die Bilder `preview-live-920.png` und `preview-live-390.png` stammen aus echten Luna-Prüfungen mit synthetischen Antworten, aber lokal simulierter Edulo-Speicherung. Bilder ohne `live` im Dateinamen sind ausschließlich Mocktests.

## Fachliche Kriterien und Punktvertrag

| E2 | Frage | Aspekt |
|---:|---|---|
| 1 | Bedeutung | Elektronen werden aus Atomen/Molekülen entfernt |
| 2 | Bedeutung | Positiv geladenes Ion bleibt zurück |
| 3 | Bedeutung | Freies Elektron entsteht |
| 4 | Messung | Nutzbare Nachweiswirkung |
| 5 | Messung | Passender Detektor-/Messaufbau |
| 6 | Messung | Nachvollziehbare Wirkungskette im Detektor |
| 7 | Messung | Messbares Signal |
| 8 | Gefahren | Schäden an Molekülen/Bindungen |
| 9 | Gefahren | Schäden an DNA/Erbgut |
| 10 | Gefahren | Zusammenhang mit Krebs/unkontrollierter Zellteilung |
| 11 | Gefahren | Reparatur oder Beseitigung geschädigter Zellen |
| 12 | Gefahren | Steigendes Risiko bei steigender Dosis |
| 13 | Gefahren | Ohne Messgerät nicht unmittelbar wahrnehmbar |

Fassung 2 ergänzt auf Nutzerwunsch die fehlende Wahrnehmbarkeit mit den menschlichen Sinnen. Geprüfter Videoabschnitt: 6:32–8:10, Sprungziel 392 Sekunden. Ältere E1-Stände der Fassung 1 werden im Speicher unverändert gelesen und in Arbeitsspeicher übernommen: Antworten, Historie und zwölf erreichte Punkte bleiben erhalten, der neue Aspekt startet weiß. Alte Rückmeldungen werden nicht um eine erfundene KI-Bewertung ergänzt; ausstehende alte Prüfungen bleiben mit ihrem ursprünglichen Aufgabenformat abrufbar. Gespeichert wird die migrierte Fassung erst beim nächsten normalen Speichervorgang. Die früheren Live-Testbilder dokumentieren Fassung 1; Fassung 2 wurde lokal ohne weitere API-Kosten geprüft.

Vom Nutzer bestätigt: **Grün** beim ersten ausreichend erklärten Aspekt, **Gelb** erst nach fachlicher Rückmeldung/Hilfe ausreichend erklärt, **Weiß** solange fehlend oder unklar. Intern entspricht Weiß `gray` im Edulo-Vertrag. Ein nur teilweise erfülltes Kriterium gibt noch keinen Punkt. Allgemeine Formulierungshinweise verändern keine fachlich richtigen Punkte. Erworbene Punkte bleiben als belegter Lernfortschritt bestehen; die zugrunde liegende Antwort bleibt in der Historie erhalten.

Das erste Ansehen des vollständigen Grundlagenvideos gilt als Arbeitsgrundlage, nicht als abgezogene Hilfe. Gezielte Videohinweise nach Rückmeldungen betreffen die jeweiligen Aspekte. Beim Absenden wird das bisherige Hilfemerkmal jedes Aspekts mitgespeichert. Ein späterer Hinweis ändert deshalb nicht rückwirkend die Bewertung der bereits eingereichten Fassung.

Die Musterlösung akzeptiert sinngleiche Aussagen und alternative fachlich richtige Nachweismethoden. Ein bloßer Gerätename oder das Wort „Krebs“ ohne Erläuterung genügt nicht. Die automatische fachliche Qualität muss noch mit echten Luna-Antworten geprüft werden.

## Video und Hinweise

Grundlage: [3.1 Ionisierende Strahlung](https://www.youtube.com/watch?v=PN3aSorc2mc), HDB@AES, 14:15 Minuten. Geprüfte Sprungziele: **0:14**, **0:54**, **3:15**, **4:21**. Belege und fachliche Abgrenzungen stehen in `sources.json`. Das Widget wählt passende feste Links anhand offener Kriterien; das Modell erfindet keine Zeitmarken oder Linkziele. Fachliche Ergänzungen zur Strommessung und Gerätebezeichnung sind von Videoaussagen getrennt dokumentiert.

## Speicherung, Identität und Kosten

Alle drei Antworten werden gemeinsam geprüft, sobald sie ausgefüllt sind. **Vor** einer kostenpflichtigen Anfrage speichert die Bridge den exakten Eingabestand samt einmaliger `requestId` in E1. Nach der Rückmeldung ergänzt sie denselben Historieneintrag und aktualisiert E2. Bei einem Speicherfehler vor dem Versand erfolgt kein API-Aufruf. Der lokale Edulo-Schreibweg ist keine unabhängige Bestätigung einer späteren Edulo-Serverantwort.

Die ID wird ausschließlich aus dem nächstgelegenen erreichbaren `widget.user.uid` gelesen. Keine Codeeingabe, keine manuelle ID, keine interne Nummer als Ersatz. Editor, fremde Bearbeitungen/Klassenansichten und Prüfungsansicht senden keine KI-Anfragen. Ohne eigene ID bleibt die KI-Prüfung gesperrt. Der Worker erhält `uid`, Aufgabe und Antwort; OpenAI erhält ausschließlich Aufgabe und Antworten, weder UID noch Edulo-Benutzernamen/Mailadresse.

Der gemeinsame Worker unter `Edulo/Freitext-KI/worker/` prüft eine serverseitige Freigabeliste und verwaltet dauerhaftes Gesamtguthaben, Wochenverbrauch ab Montag 0 Uhr Europe/Berlin und globale Grenzen. Es gibt keine automatischen Erstattungen oder KI-Wiederholungen. Entstandener Verbrauch wird auch bei unbrauchbarem Feedback belastet. Unklarer Ausgang bleibt blockiert und kann ohne weiteren KI-Aufruf über `/result` abgerufen werden. Für tatsächliche Kostenklärung ist eine private Admin-Reconciliation vorbereitet. Guthabenanzeige stammt immer vom Server, nicht aus manipulierten E1-Daten.

Die Oberfläche speichert alle Historieneinträge und zeigt zunächst die jüngsten acht an; weitere lassen sich aufklappen. Kein stilles Abschneiden alter Antworten. Geänderte aktuelle Texte kennzeichnen die letzte Rückmeldung als veraltet.

## Quellen bearbeiten und lokal prüfen

`task.js`: Aufgaben, öffentliche Musterlösungen und Kriterien. `domain.js`: Historie/Farben. `ui.js`: Oberfläche/Anfragen. `app.css`: Layout. `app.js` und `widget.html` sind generiert.

```powershell
node Physik/Kernphysik/ionisierende-strahlung/build.cjs
node --test Physik/Kernphysik/ionisierende-strahlung/domain.test.cjs
node --test Physik/Kernphysik/ionisierende-strahlung/integration.test.mjs
node Physik/Kernphysik/ionisierende-strahlung/widget.test.cjs
node --test Edulo/Freitext-KI/worker/worker.test.mjs
```

Die regulären lokalen Tests nutzen synthetische Konten und simulierte Antworten. Browserprüfung: E1/E2-Hostsimulation, Wiederöffnung, unklare/fehlerhafte Rückmeldungen, Wiederabruf ohne zweite Anfrage, sichere Textausgabe und 390/920/1440 Pixel. Die ergänzende Produktionsprüfung mit echten Luna-Antworten und Guthabenbuchung ist unten dokumentiert. Die echte Edulo-Wiederöffnung und Tabletbedienung bleiben separat zu prüfen.

Abnahme am 25.10.2026: **32** Node-Fach-/Worker-/Integrationsprüfungen bestanden, Browserlauf bestanden, Cloudflare-CLI `wrangler deploy --dry-run` erfolgreich. Zusätzlich **eine echte lokale Miniflare/workerd-SQLite-Prüfung** bestanden: parallele Reservierungen, Abrechnung, vollständiger Runtime-Neustart, dauerhafte Guthaben und idempotenter Wiederabruf. Dieser Test blockiert ausgehende Requests und simuliert OpenAI; er ist kein Cloudflare-Produktionsnachweis. Aufruf nach vorbereiteter lokaler Wrangler-Installation: `EDULO_MINIFLARE_TEST=1 node --test Edulo/Freitext-KI/worker/persistence.test.mjs` (in PowerShell die Umgebungsvariable vorher setzen). Die isolierten Werkzeuge und synthetischen SQLite-Dateien liegen im ignorierten `.edulo-tools/`.

Live-Abnahme am 25.10.2026: Der Nutzer hat CLI-Verbindung, Veröffentlichung und Testkonto ausdrücklich freigegeben. Der Worker ist einschließlich SQLite-Durable-Object und Durchsatzbegrenzer veröffentlicht; Version `950845f9-f842-47ba-bee0-9f8ea9922058`. Der vorhandene `OPENAI_API_KEY` blieb erhalten. Die Freigabeliste und Preis-/Limitkonfiguration liegen als verschlüsselte Cloudflare-Secrets vor. Globale Grenzen entsprechen zunächst dem einzigen Testkonto: 0,50 Euro insgesamt, 0,10 Euro wöchentlich. Weitere Konten benötigen eine ausdrückliche Freigabe und passende globale Grenzen.

`GET /health` liefert 200/ready:true; die Produktionsdatenbank bestätigt die eingerichteten Grenzen. Desktop-Preflight mit Origin `null` liefert 204. Drei echte Prüfungen bestanden: vollständige Antworten ergeben zwölf erfüllte Aspekte; schwache Antworten ergeben keine Punkte, aber konkrete fachliche und sprachliche Hinweise; die danach verbesserten Antworten ergeben zwölf gelbe Punkte. Derselbe ursprüngliche Request wurde kostenfrei aus dem gespeicherten Ergebnis wiedergegeben. E1/E2-Historie und Wiederöffnung wurden dabei im lokalen Edulo-Hostmodell geprüft, nicht in der tatsächlichen Edulo-App. Layout 390/920 Pixel auch mit echten Rückmeldungen geprüft.

Verbrauch der drei bewussten Testprüfungen: **0,001017 Euro**. Danach serverseitig verfügbar: **0,498983 Euro Gesamtguthaben**, **0,098983 Euro Wochenkontingent**, keine offene Reservierung. Für die Testbuchführung gilt ein fester Kurs von 0,893416 Euro je USD, abgeleitet vom [Referenzkurs 23.10.2026](https://www.centralbankmalta.org/exchange-rates) mit 1 Euro = 1,1193 USD. Das ist ein dokumentierter Referenz-/Testkurs, keine Behauptung zum tatsächlichen Bank-/Abrechnungskurs oder zu Steuer-/Cloudflarekosten. Tokenpreise entsprechen dem geprüften Luna-Standardtarif; `reasoning.effort` ist explizit `low`.

Noch erforderlich: vollständige Seite im echten Edulo mit E1/E2/E3 einsetzen, mit dem freigegebenen Konto prüfen, schließen/wiederöffnen und auf dem Tablet testen. Andere Edulo-Weborigins sind noch nicht pauschal freigegeben. Die eigenen GitHub-Pages-Origin, ausdrücklich `null` für die bekannte Desktop-/Dateiumgebung und der lokale Testserver `http://127.0.0.1:8791` sind freigegeben; CORS ersetzt die serverseitige ID-Liste und Guthabenprüfung nicht.

## iPad-Verbindung: Diagnose und Kompatibilität

Nachtrag: Der Nutzer hat anschließend bestätigt, dass die Verbindung nun funktioniert.

**Ursache inzwischen durch den Nutzerscreenshot bestätigt und serverseitig korrigiert:** Edulo auf dem iPad sendet tatsächlich `ionic://localhost`, sowohl über Fetch als auch über XMLHttpRequest. Der Dienst war erreichbar, diese Herkunft aber nicht freigegeben. Der Worker akzeptiert jetzt ausschließlich diese zusätzlich konfigurierte exakte Ionic-Herkunft; andere Ionic-/Custom-Scheme-Herkünfte bleiben gesperrt. Veröffentlichung `68fa9536-412b-4836-807b-af84bfe1f203`. Live kostenfrei geprüft: Diagnose `originAllowed:true`, Preflights für `/quota` und `/result` 204 mit passendem Origin, Guthabenabfrage 200, Ergebnisabfrage als lesbare 404 für eine erfundene Anfrage-ID. Guthaben unverändert, keine offene Reservierung und kein neuer KI-Aufruf. Die bereits eingesetzte HTML-Fassung kann weiterverwendet werden; auf dem iPad neu öffnen, Guthaben aktualisieren und die alte Prüfung abrufen. Der Erfolg auf dem tatsächlichen iPad wird anschließend vom Nutzer bestätigt.

Nutzerrückmeldung am 25.10.2026: In der Edulo-iPad-App meldeten Guthabenaktualisierung und Wiederabruf „Load failed“. Die konkrete iPad-Herkunft und die Ursache sind damit noch nicht bestätigt. Die Produktionsabfrage zeigte unverändert 0,498983 Euro insgesamt/0,098983 Euro wöchentlich und keine Reservierung; es war kein zusätzlicher KI-Verbrauch gebucht.

Die aktualisierte Oberfläche verwendet für kostenfreie `/quota`- und `/result`-Abfragen nach einem Fetch-Transportfehler einen Standard-XMLHttpRequest-Kompatibilitätsweg. Funktioniert er, werden nachfolgende Anfragen direkt über diesen Weg gesendet. Eine kostenpflichtige `/feedback`-Anfrage wird niemals automatisch über einen zweiten Weg wiederholt. Beide Transportwege verwenden denselben Serververtrag und die bestehenden ID-/Guthabengrenzen. Die vorhandene Historie bleibt erhalten.

Unter „Verbindungshilfe → Verbindung prüfen (kostenfrei)“ werden App-Origin/Protokoll sowie ein öffentlicher GET auf `/connection` über Fetch und XMLHttpRequest geprüft. Keine UID, Schülerantworten oder Kontodaten werden für diese Probe übertragen. Der Bericht enthält die eigene vom Server empfangene Herkunft, deren Freigabestatus und die Bereitschaft des Dienstes. Nur dieser Diagnose-Endpunkt erlaubt CORS `*`; Guthaben-, Ergebnis- und KI-Endpunkte behalten ihre exakten Herkunftsprüfungen und die serverseitigen Kontogrenzen. Backend-Diagnose veröffentlicht als Version `4722a14d-f715-4326-8a79-bc67e3702401`.

Lokaler Browsernachweis: erzwungener Fetch-Abbruch der Guthabenabfrage → erfolgreicher XHR → genau eine Feedbackanfrage; abgebrochene Feedbackanfrage → keine automatische Wiederholung; Wiederabruf derselben Anfrage-ID über XHR. Worker-Diagnosetest und bestehende 13-Punkte-/Migrations-/Layouttests bestanden. **Die Behebung auf dem tatsächlichen iPad muss nach Ersetzen des HTML noch bestätigt werden.** Falls weiter keine Verbindung besteht, den Diagnosebericht aus der Verbindungshilfe zurückgeben. Keine pauschale Freigabe unbekannter Ursprünge und kein Zurücksetzen der E1-Historie.

## Fragendes Feedback statt vorweggenommener Lösungen

Am 25.10.2026 auf Nutzerwunsch überarbeitet: Luna bewertet weiterhin intern anhand der vollständigen Referenz, soll aber ausschließlich auf bereits geschriebene Inhalte Bezug nehmen und offene Arbeitsfragen stellen. Fehlende Fachbegriffe, Mechanismen, Musterformulierungen und Antworten in Suggestivfragen sind in sämtlichen Ausgabefeldern untersagt. Konkrete Gegenbeispiele betreffen die Ionenerzeugung und die Gefahren. Verifizierte Videostellen ergänzt weiterhin ausschließlich die Oberfläche. Grundlage für eindeutige Regeln und Beispiele: [OpenAI Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering).

Alle Kriterienüberschriften sind neutral: „Offener Punkt“ oder „Aspekt ausreichend erklärt“. Auch die Historie zeigt keine internen Rubriklabels mehr. Der neue Worker markiert Ergebnisse mit `feedbackStyle: questions-v1`; das Widget speichert den Marker im jeweiligen Versuch. Generierte Texte älterer Ergebnisse ohne diesen Marker werden ausgeblendet, da sie Lösungen verraten können. Originaltexte bleiben vollständig im E1-Zustand erhalten, ebenso Schülerantworten, Punkte und Wiederabruf. Es erfolgt keine automatische neue kostenpflichtige Prüfung. Für die Anzeigeänderungen den gesamten bisherigen HTML-Inhalt durch die neu gebaute `widget.html` ersetzen; vorhandene Punktefelder bleiben bestehen.

Veröffentlicht: Worker-Version `31a6976f-8c91-48b3-8b81-70e00a3cce02`. Zwei bewusste echte Tests mit knappen synthetischen Antworten kosteten zusammen **0,001085 Euro**. Nach dem ersten Test wurde die Anweisung zusätzlich gegen vorgegebene Kategorien wie „Schutzreaktionen“ präzisiert. Im abschließenden Test lautete der Hinweis beispielsweise: „Du schreibst, dass Ionen entstehen. Wie genau entstehen sie durch die Strahlung?“; die fehlende Erklärung wurde nicht geliefert. Verfügbar danach: **0,497459 Euro insgesamt**, **0,097459 Euro wöchentlich**, keine Reservierung. Das sind beobachtete Testergebnisse; die inhaltliche Befolgung der Anweisungen bleibt Modellverhalten und wird nicht durch das JSON-Schema garantiert.

36 Node-Prüfungen sowie der lokale Edge-Browserlauf bestanden: neutrale Überschriften und Historie, alte Feedbacktexte unsichtbar bei vollständig erhaltener Speicherung, Marker, Videolinks, 13 Punkte und bestehende Speicher-/Transportfälle. Der Browser nutzt dabei eine Edulo-Hostsimulation; die neue Oberfläche wurde noch nicht in der tatsächlichen iPad-App geprüft.

## Vorhandene Fehlvorstellungen gezielt klären

Auf Nutzerwunsch vom 25.10.2026 gibt es ergänzend den Bereich „Fehlvorstellungen klären“. Das neue `feedback.misconceptions` enthält bis zu drei Paare aus Schüleraussage und knapper Klarstellung. Bei einer nur unvollständigen Erklärung ist es leer. Die erforderliche richtige Ersatzinformation darf ausschließlich zur Korrektur einer tatsächlich vorhandenen Fehlvorstellung genannt werden; die übrigen offenen Aspekte behalten Fragen und verifizierte Videohinweise. Der Bereich vergibt keine zusätzlichen Punkte und erscheint auch in der Historie. Frühere `questions-v1`-Ergebnisse ohne dieses Feld bleiben lesbar; neue Ergebnisse sind `questions-v2`. Unformatierte Textausgabe und Validierung bleiben erhalten.

Insbesondere darf die KI fachlich richtige Aussagen zum falschen Aufgabenthema nicht durch ihre Rückfragen als passende Erklärung bestätigen. Geprüfte Abgrenzung: Sonnen-UV am Erdboden gehört zur nichtionisierenden Strahlung ([Bundesumweltministerium](https://www.bundesumweltministerium.de/themen/strahlenschutz/nichtionisierende-strahlung/ueberblick-nichtionisierende-strahlung)); UV kann trotzdem Krebs verursachen ([DKFZ](https://www.krebsinformationsdienst.de/krebs-vorbeugen/krebsrisiko-uv-strahlung)). Eine Aussage zu Sonnenbrand-/UV-Krebsrisiko erklärt allein noch nicht die hier gefragten Gefahren ionisierender Strahlung. Keine pauschale Behauptung „UV kann niemals ionisieren“: sehr kurzwelliges UV kann ionisieren ([FÖD Volksgesundheit](https://www.health.belgium.be/de/themen/gesundheit/ihre-gesundheit/umwelt-gesundheit/einfluss-elektromagnetischer-strahlung-ihre-gesundheit/arten-strahlung)). Die Referenz im Widget enthält diese Abgrenzung; Kriterien und die 13 Punkte bleiben unverändert.

Worker veröffentlicht als Version `83948f55-5d41-45cf-9ff0-20d8ea9dc495`. 38 Node-Prüfungen (29 Worker, acht Domain, eine Integration) und der lokale Browserlauf bestanden, einschließlich Altstände, Klartext, Historie, Wiederöffnung und unveränderter Punktezuordnung. Zwei echte Luna-Tests: Die vom Nutzer berichteten UV-Antworten erhalten klare Korrekturen und keinen erfüllten Aspekt; nur knappe, sachlich nicht falsche Antworten erhalten keine erfundenen Fehlvorstellungen. Im zweiten Fall bleibt `misconceptions: []`. Kosten dieser beiden Prüfungen zusammen **0,001348 Euro**; danach **0,495151 Euro insgesamt**, **0,095151 Euro wöchentlich**, keine offene Reservierung. Dies ist eine beobachtete Modellprüfung, keine Garantie für jede künftige Formulierung.

Die aktualisierte `widget.html` vollständig in Edulo ersetzen und eine neue Prüfung bewusst auslösen. Bereits gespeicherte Ergebnisse werden nicht nachträglich geändert und lösen keine automatische kostenpflichtige Neuberechnung aus. Die neue Darstellung wurde noch nicht in der tatsächlichen iPad-App getestet.

## Eine zusammenhängende Rückmeldung je Aufgabe

Am 25.10.2026 auf Nutzerwunsch umgestellt: Die drei Teilaufgaben erhalten jeweils einen kurzen zusammenhängenden Absatz mit höchstens zwei unterschiedlichen Leitfragen. Die KI bewertet weiterhin jeden der 13 Aspekte getrennt; Punktfarben, Hilfemarkierungen und historische Punkte bleiben unverändert. `task.feedbackGroups` ordnet die Kriterien den drei Teilaufgaben zu. Der Worker validiert eine vollständige eindeutige Zuordnung, liefert `feedback.taskFeedback` und lässt für diese Gruppierung `criteria[].feedback` leer sowie `nextSteps: []`. Damit entstehen auch im Modell keine 13 Einzeltexte mehr, die später nur aneinandergehängt werden müssten.

Die Oberfläche zeigt einen Absatz je Aufgabe und jeden passenden Video-Zeitlink nur einmal je Aufgabe. Fehlvorstellungen und sprachliche Hinweise bleiben getrennt. Alte gespeicherte Rückmeldungen ohne gruppierte Texte werden nicht künstlich zusammengefasst und nicht erneut kostenpflichtig angefragt: Pro Aufgabe erscheint ein neutraler Hinweis auf das frühere Format, während Originaldaten und Punkte erhalten bleiben. Auch die Historie zeigt keine alten Einzelhinweislisten mehr. Die neue HTML-Datei vollständig einsetzen; die nächste bewusste Prüfung erzeugt das neue Format.

Veröffentlicht als Worker-Version `d5be5aca-4317-439a-94f0-8940346c1110`. 42 Node-Prüfungen (31 Worker, zehn Domain, eine Integration) und die lokale Edge-Browserregression bestanden. Eine echte Luna-Anfrage bestätigte drei gebündelte Rückmeldungen, leere Einzelhinweistexte, drei erfüllte und zehn offene Aspekte sowie die weiterhin klare UV-Korrektur. Nach Anwendung in der lokalen Domain ergeben sich entsprechend drei grüne und zehn weiße Punkte. Kosten dieses Tests: **0,000735 Euro**; danach **0,494416 Euro insgesamt**, **0,094416 Euro wöchentlich**, keine Reservierung. Die übrige Browserprüfung nutzt synthetische Konten/Antworten und bestätigt Historie, Wiederöffnung, Altstände, Klartext, deduplizierte Links und bestehende Transportfälle. Keine neue echte iPad-Abnahme.
