# Edulo-Konto-Diagnose

`widget.html` vollständig in ein separates Edulo-Modul „HTML und Dateien“ einsetzen. Keine E1-/E2-Felder nötig. In der normalen Aufgabenansicht öffnen, kurz warten, „Neu auslesen“ und „JSON kopieren“ anklicken; den Bericht in den Chat einfügen.

Die bisherige Annahme im Anzeige-Widget war falsch: Der Nutzertest vom 25.10.2026 zeigte für `widget.user.ID` die interne Nummer 19319 statt der gesuchten Anmelde-ID `xx-xxxxxx-xxxxxx-xxxxxx`. Der eigene Benutzername blieb leer. Das Diagnosewidget dient zur Feststellung des tatsächlichen Datenvertrags, bevor das Anzeige-Widget angepasst wird.

## Bericht

- Erreichbare Fenster: eigene Ebene und Eltern bis zu acht Ebenen, mit Origin/Pfad und URL-Parameternamen ohne Parameterwerte.
- `widget.user` mit Feldnamen, eigenen Kontowerten, Typen, Zeichenlängen und Prüfung auf das gewünschte ID-Format.
- Typübersicht der übrigen `widget`-Eigenschaften und Konfigurationsschlüssel, einige ausdrücklich benannte Identitäts-/Ansichtsmerkmale. Keine Aufgabeninhalte oder gespeicherten Schülerantworten.
- Explizite Kontoobjekte `user`, `currentUser`, `loggedInUser`, `account`, sofern als direkte Datenfelder vorhanden. Keine Suche durch andere App-Objekte.
- Ab Start beobachtete Nachrichten des bestehenden `user|JSON`-Protokolls; für andere Nachrichten nur bekannte Kategorien und Zähler. Der Absender wird benannt; solche Diagnosedaten sind noch kein authentifizierter Identitätsvertrag für das spätere Anzeige-Widget.

Passwort-, Token-, Sitzungs-, Hash- und verwandte Felder sowie Klassen-/Mitgliederlisten sind maskiert. Die Maskierung erhält Typ, Länge und ID-Formatindikator; es können trotzdem persönliche Kontodaten wie Name und Anmelde-ID im Bericht stehen. Der Bericht bleibt im Widget und wird nur über den angeklickten Kopierbutton übernommen. Keine Cookies, kein localStorage/sessionStorage, keine Netzwerkanfragen, keine Speicher-/Punkteaktionen, keine Anfragen an vermutete API-Endpunkte. Zugriff auf fremde Origins wird nicht umgangen. Getter werden nicht ausgeführt.

Verschachtelung, Feldzahl, Textlänge und Nachrichten sind begrenzt. Dadurch ist der Bericht gezielt auf die Kontodiagnose ausgerichtet und kein vollständiger Export der Edulo-App. Bereits vor Widgetstart gesendete Nachrichten können fehlen; das aktuelle `widget.user` wird regelmäßig erneut ausgelesen.

## Build

```text
node tools/edulo/build.cjs Edulo/Konto-Diagnose/widget.quelle.html
node Edulo/Konto-Diagnose/diagnose.test.cjs
```

Ein lokaler Fixturetest bestätigt die Berichtserstellung und Maskierung, aber weder den tatsächlichen öffentlichen ID-Feldnamen noch dessen Verfügbarkeit in Edulo. Das wird erst mit dem Nutzerbericht geklärt.
