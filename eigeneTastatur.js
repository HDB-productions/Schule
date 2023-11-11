function EigeneTastatur(buttonList, containerId, buttonFunction, buttonSize) {
    // Wenn buttonSize nicht übergeben wurde, setze es auf 50
    buttonSize = buttonSize || 50;

    // Erstellen Sie ein leeres HTML-Element, in dem die Tabelle erstellt wird.
    var table = document.createElement('table');
    var currentRow = null; // Aktuelle Zeile

    // CSS-Stile als Zeichenketten definieren
    var buttonCellStyle = 'width: ' + buttonSize + 'px; height: ' + buttonSize + 'px; text-align: center; vertical-align: middle; padding: 0;';
    var buttonStyle = 'width: 100%; height: 100%; margin: 0;';

    // Durchlaufen Sie die Liste von Buttons und erstellen Sie für jedes Element eine Zeile und einen Button.
    for (var i = 0; i < buttonList.length; i++) {
        var buttonInfo = buttonList[i];

        // Überprüfen Sie, ob eine neue Zeile erstellt werden muss.
        if (!currentRow || buttonInfo.Zeile !== buttonList[i - 1].Zeile) {
            currentRow = table.insertRow();
        }

        // Erstellen Sie den Button.
        var button = document.createElement('button');
        button.innerHTML = buttonInfo.Beschriftung;

        // Fügen Sie die Funktion für den Button hinzu und übergeben den Wert aus der Funktionseigenschaft.
        button.onclick = function (info) {
            return function () {
                // Hier wird die Funktion mit dem Wert aus der Funktionseigenschaft aufgerufen.
                buttonFunction(info.Funktion);
            };
        }(buttonInfo);

        // Hinzufügen der CSS-Stile zu den Elementen
        button.setAttribute('style', buttonStyle);
        var cell = currentRow.insertCell();
        cell.setAttribute('style', buttonCellStyle);

        // Überprüfen Sie, ob Colspan (Breite) verwendet werden soll.
        if (buttonInfo.Breite && buttonInfo.Breite > 1) {
            cell.colSpan = buttonInfo.Breite;
        }

        if (buttonInfo.Höhe && buttonInfo.Höhe > 1) {
            cell.rowSpan = buttonInfo.Höhe;
            button.style.height = (buttonInfo.Höhe * 101) + '%';
        }

        cell.appendChild(button);
    }

    // Fügen Sie die Tabelle dem gewünschten HTML-Element hinzu.
    var container = document.getElementById(containerId);
    container.appendChild(table);
}
