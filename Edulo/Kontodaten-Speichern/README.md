# Kontodaten automatisch als Edulo-Antwort speichern

## In Edulo einrichten

Eine eigene Seite mit genau diesen Modulen anlegen:

1. **E1: ein normales Text-Antwortfeld**, das Texteingaben akzeptiert. Als Aufgabentext z. B. „Meine Edulo-Zugangsdaten – wird automatisch ausgefüllt“. Keine Zeichenbegrenzung; falls angeboten, Korrektur für dieses Feld ausschalten. Nicht selbst deaktivieren oder schreibgeschützt setzen: Das Widget blendet es für SuS automatisch aus und muss es weiter befüllen können.
2. **E2: HTML und Dateien**. Dort den vollständigen Inhalt von `widget.html` einsetzen.
3. **E3: ein zweites normales Text-Antwortfeld für die Mailadresse**, hinter dem bestehenden HTML-Modul ergänzen. Keine Zeichenbegrenzung und kein Schreibschutz. Die normale Korrektur für dieses Feld aktiviert lassen (ohne feste Musterlösung), damit Edulos Text-Antwortmodul den Inhalt im Fortschritt berücksichtigt. Auch dieses Feld blendet das Widget für SuS aus.

Keine zusätzlichen Punkte-/Cloze-Felder nötig. Die Antwortspeicherung der Aufgabe muss aktiv sein. Eine reine Textanzeige oder ein selbst im HTML angelegtes Eingabefeld ist kein Edulo-Antwortfeld.

Beim Öffnen durch das Schülerkonto wird E1 automatisch so befüllt:

```text
UserID: 12-123456-123456-123456 | Benutzername: Beispielname
```

Das sind erfundene Beispielwerte. E1 nutzt ausschließlich `widget.user.uid` und `widget.user.name` des aktuell angemeldeten Kontos. `uid` muss das bestätigte Format besitzen. Die interne numerische ID wird nicht gespeichert. E3 enthält getrennt ausschließlich die Adresse aus `widget.user.email`.

Später in Edulo die Bearbeitung des jeweiligen SuS öffnen und E1 ablesen. Das Widget zeigt in einer erkannten fremden Bearbeitung ebenfalls den gespeicherten Inhalt, ohne die Lehrer-Kontodaten hineinzuschreiben. Die SuS müssen die Seite vorher mindestens einmal mit ihrem eigenen Konto geöffnet haben. Das neue Öffnen auf einem Leihgerät ist zum Ablesen durch die Lehrkraft nicht nötig.

## Mailadresse und Fortschritt

Die hinterlegte Adresse erscheint zusätzlich als Text. Ohne Adresse zeigt das Widget „Keine hinterlegt“, schreibt diesen Hinweis aber **nicht** in E3: E3 bleibt dann leer. Wenn eine Adresse im Konto geändert oder ausdrücklich entfernt wird, aktualisiert bzw. leert das Widget E3 beim nächsten Öffnen/Auslesen im eigenen Konto. Fehlt das `email`-Datenfeld ganz, gilt der Wert als unbekannt und ein alter E3-Inhalt wird nicht gelöscht.

Die nativen Änderungsereignisse übernehmen die normale Edulo-Feldverarbeitung. Im vorhandenen `media_input`-Code bewertet `checkInput` ein nichtleeres Textfeld als ausgefüllt; für den Fortschrittsbalken muss dieses Feld an der normalen Korrektur teilnehmen. Es gibt keine künstliche Lösung `1`, keine zusätzlichen Lücken und keine eigene globale Prüfung. Die neue E3-Fortschrittsanzeige ist lokal simuliert geprüft und muss nach dem Einsetzen einmal in Edulo bestätigt werden.

Die Adresse wird unverändert aus den aktuellen Kontodaten übernommen. Es wird weder eine Schul-Domain vorgegeben noch die Bestätigung/Erreichbarkeit der Adresse behauptet. In einer fremden Bearbeitung stammt die Anzeige ausschließlich aus deren gespeichertem E3, niemals aus der Lehreradresse. Alte Bearbeitungen ohne E3 können noch keine Adresse anzeigen. Die SuS müssen die aktualisierte Seite einmal öffnen.

## QR-Code

Unter den Kontodaten erscheint ein QR-Code der angezeigten ID. In einer fremden Bearbeitung wird er ausschließlich aus dem gespeicherten E1-Datensatz dieser Bearbeitung erzeugt. Beim Wechsel der ausgewählten Bearbeitung aktualisiert er sich; ohne gültige ID wird er ausgeblendet. Nach Abmeldung in der eigenen Ansicht wird kein Code des vorherigen Kontos weiter angezeigt.

QR-Inhalt ist exakt die rohe ID (23 Zeichen), ohne Beschriftung, Benutzernamen, URL oder sonstigen Zusatz. Der Code wird lokal auf einer weißen Fläche mit vier Modulen Rand erzeugt. Es werden keine IDs an einen QR-Webdienst geschickt; die Encoderbibliothek ist vollständig in `widget.html` eingebettet. Das Antwortformat und seine Speicherereignisse bleiben davon unabhängig.

18 lokale QR-Prüfungen bestanden: Der QR-Inhalt wurde mit einem unabhängigen Decoder aus den tatsächlich gezeichneten Canvas-Pixeln zurückgelesen, einschließlich eigener Ansicht, fremder Bearbeitung, Wechsel und Abmeldung bei 920/390 px. Der Nutzer bestätigte anschließend am 25.10.2026, dass die Version mit QR-Code funktioniert. Die danach ergänzte Ausblendung des Antwortfelds wird separat lokal geprüft.

## Verhalten und Schutz

- Klartext in einem normalen Antwortfeld, kein Base64- oder versteckter Zustand.
- Speicherung ausschließlich über `createEduloAnswerBridge` (`tools/edulo/runtime/answer.js`). Der Adapter setzt das echte Feld mit dem nativen Setter und löst `input`/`change` aus. Im vorhandenen exportierten Edulo-Modul `media_input` löst `change` die normale Feldverarbeitung und `save_load.save()` aus. Kein globales Prüfen oder Zurücksetzen.
- In der normalen Schüleransicht werden die zugeordneten Antwortfelder E1 und E3 automatisch gleichzeitig ausgeblendet, einschließlich ihrer Container, wenn diese ausschließlich das jeweilige Feld enthalten. Container mit anderen Eingaben, Buttons, iframe oder dem Widget selbst werden nicht ausgeblendet. Die automatische Speicherung funktioniert weiter; `readonly`/`disabled` werden nicht gesetzt.
- Im Editor, in Lehrer-/Klassen-/fremden Bearbeitungsansichten und im Prüfungsmodus wird die ursprüngliche Sichtbarkeit des Felds wiederhergestellt. Das gilt auch beim Verlassen oder Entfernen des Widgets. ID, Benutzername und QR-Code bleiben als Widgetanzeige verfügbar, soweit die betreffende Ansicht Kontodaten bereitstellt. Die Edulo-Fußleiste bleibt unverändert. Keine lokale Browser-Speicherung, keine eigenen Netzwerkanfragen.
- Wiederholtes Auslesen schreibt einen identischen Wert nicht erneut. Bei gleicher UID kann ein geänderter Benutzername aktualisiert werden.
- Vorhandene andere Antworten und Einträge mit anderer UID werden nicht überschrieben. Beim Kontowechsel muss Edulo zuerst das zum neuen Konto gehörende Antwortfeld laden.
- Editor, Lehrerkennung, Prüfungsmodus, fremde Antworten (`remoteUserData`, auch leer), Klassenübersicht und `input`-URL sind vom Schreiben ausgeschlossen. Die Statuszeile nennt den genauen Grund einschließlich des erkannten Edulo-Merkmals. Bei fremden Antworten werden ausschließlich gespeicherte Kontodaten angezeigt. In der eigenen Lehreransicht dürfen die eigenen Kontodaten angezeigt werden, ohne sie zu speichern.
- Ein Speicherfehler blendet erfolgreich ausgelesene eigene Kontodaten nicht mehr aus. Die Anzeige wird bei jedem Durchlauf neu ermittelt; ein vorheriges Konto wird nach Abmeldung nicht weiter angezeigt.
- Ein fehlendes, mehrdeutiges, gesperrtes oder zu kurzes Feld sowie eine deaktivierte Speicherfunktion führen zu einem sichtbaren Hinweis. Die Meldung „an Edulo übergeben“ bestätigt den lokalen Übergabeweg, keine unabhängig geprüfte Serverantwort.

## Quelle und Build

Quellen: `widget.quelle.html`, `app.js`, `app.css`, optionaler Adapter `tools/edulo/runtime/answer.js`.

Diese bewusst einfache Variante bindet ausschließlich den Antwortadapter ein. Dafür den eigenen Build verwenden:

```text
node Edulo/Kontodaten-Speichern/build.cjs
node Edulo/Kontodaten-Speichern/save.test.cjs
node Edulo/Kontodaten-Speichern/qr.test.cjs
node Edulo/Kontodaten-Speichern/email.test.cjs
```

Standardziele sind die dokumentierten E1-IDs `e1_text_input` bzw. `e1_input` und E3-IDs `e3_text_input` bzw. `e3_input`. Bei anderer Modulreihenfolge die IDs ausdrücklich im Aufruf `createEduloAnswerBridge({root, fieldIds:[...], emailFieldIds:[...]})` in `app.js` anpassen und neu bauen; keine pauschale Suche nach irgendeinem leeren Feld. Ein noch fehlendes E3 verhindert die bisherige E1-Speicherung nicht, wird aber in der Statuszeile gemeldet.

## Prüfstatus

Zusätzlich 30 lokale Mail-/E3-Szenarien bestanden: vorhandene/fehlende/geänderte/entfernte Adresse, unbekanntes Kontofeld, E1-/E3-Zuordnung, Schreibschutz und Feldgrenzen, gleichzeitige Ausblendung, Lehrer-/Fremdansichten, iframe sowie Ansichten bei 390/920/1440 px. Der leere/belegte Fortschrittszustand wird im lokalen Modell durch native `change`-Ereignisse geprüft; der echte E3-Fortschrittsbalken in Edulo ist noch zu bestätigen.

Tablet-Rückmeldung 25.10.2026: Der Nutzer hat die Ursache geklärt. Die problematische Datei war im Klassenordner und dort nicht bearbeitbar. In der normalen Datei funktioniert die Erfassung auch auf dem Tablet. Das war kein nachgewiesener Tablet-Kompatibilitätsfehler; die Leseansicht-Sperre bleibt bestehen.

66 lokale synthetische Edge-Hostprüfungen bestanden: Übergabe, Wiederöffnen eines simuliert gespeicherten Werts, Ausblenden und Wiederherstellen des Antwortfelds, Schutz fremder Bearbeitungen, fehlende/deaktivierte Speicherfunktion und Ansichten bei 920/390 px. Die vorhandene Edulo-Kit-Suite besteht ebenfalls. Das ist kein echter Edulo-Servernachweis. Nach Einsetzen einmal mit einem Schülerkonto öffnen, Seite verlassen und erneut öffnen sowie aus dem Lehrerkonto die gespeicherte Bearbeitung aufrufen. Erst dieser Test bestätigt den Ende-zu-Ende-Weg in der tatsächlichen Edulo-Version.


