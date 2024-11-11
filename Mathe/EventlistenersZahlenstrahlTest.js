// eventListeners.js

/**
 * Initialisiert alle Event-Listener für die Formulare.
 * Diese Funktion wird aufgerufen, sobald das DOM vollständig geladen ist.
 */
function initializeEventListeners() {
    // Event-Listener für das Prüfen einer Markierung
const prueferForm = document.getElementById('prueferForm');
if (prueferForm) {
    prueferForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        // Werte aus dem Formular holen
        const prueferContainerID = document.getElementById('prueferContainerID').value.trim();
        const prueferTyp = document.getElementById('prueferTyp').value;
        const prueferStart = parseFloat(document.getElementById('prueferStart').value);
        let prueferEnd = null;
        if (prueferTyp === 'arrow') {
            prueferEnd = parseFloat(document.getElementById('prueferEnd').value);
            if (isNaN(prueferEnd)) {
                alert('Bitte geben Sie einen gültigen Endwert für den Pfeil ein.');
                return;
            }
        }

        // Prüfe die Markierung
        const istVorhanden = pruefer(prueferContainerID, prueferTyp, prueferStart, prueferEnd);

        // Ergebnis anzeigen
        const prueferErgebnisDiv = document.getElementById('prueferErgebnis');
        if (istVorhanden) {
            prueferErgebnisDiv.textContent = 'Die Markierung ist vorhanden.';
        } else {
            prueferErgebnisDiv.textContent = 'Die Markierung ist nicht vorhanden.';
        }
    });
}
    // Event-Listener für das Zeichnen des Zahlenstrahls
    const zahlenstrahlForm = document.getElementById('zahlenstrahlForm');
    if (zahlenstrahlForm) {
        zahlenstrahlForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite

            // Werte aus dem Formular holen
            const min = parseFloat(document.getElementById('min').value);
            const max = parseFloat(document.getElementById('max').value);
            const skalierung = parseFloat(document.getElementById('skalierung').value);
            const containerID = document.getElementById('containerID').value.trim();
            const farbe = document.getElementById('farbe').value || '#000000';

            // Validierung der Eingaben
            if (min >= max) {
                alert('Min muss kleiner als Max sein.');
                return;
            }

            // Zeichne den Zahlenstrahl
            zeichneZahlenstrahl(min, max, skalierung, containerID, farbe);
        });
    }

    // Event-Listener für das Markieren eines Kreuzes
    const kreuzForm = document.getElementById('kreuzForm');
    if (kreuzForm) {
        kreuzForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite

            // Werte aus dem Formular holen
            const markContainerID = document.getElementById('kreuzContainerID').value.trim();
            const zahl = parseFloat(document.getElementById('kreuzZahl').value); // Nutzung von parseFloat statt parseInt
            const markFarbe = document.getElementById('kreuzFarbe').value || '#000000';
            const sichtbar = document.getElementById('kreuzSichtbar').checked;
            const bewegbar = document.getElementById('kreuzBewegbar').checked;

            // Markiere die Zahl als Kreuz und erhalte die Markierungs-ID
            const markID = markiereZahl(markContainerID, zahl, markFarbe, sichtbar, bewegbar);
            if (markID) {
                console.log(`Kreuz ID: ${markID}`);
            }
        });
    }

    // Event-Listener für das Erstellen eines Pfeils
    const pfeilForm = document.getElementById('pfeilForm');
    if (pfeilForm) {
        pfeilForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite

            // Werte aus dem Formular holen
            const pfeilContainerID = document.getElementById('pfeilContainerID').value.trim();
            const start = parseFloat(document.getElementById('pfeilStart').value);
            const operator = document.getElementById('pfeilOperator').value;
            const value = parseFloat(document.getElementById('pfeilWert').value);
            const pfeilFarbe = document.getElementById('pfeilFarbe').value || '#000000';
            const sichtbar = document.getElementById('pfeilSichtbar').checked;
            const bewegbar = document.getElementById('pfeilBewegbar').checked;

            // Markiere den Pfeil und erhalte die Markierungs-ID
            const markID = markierePfeil(pfeilContainerID, start, operator, value, pfeilFarbe, sichtbar, bewegbar);
            if (markID) {
                console.log(`Pfeil ID: ${markID}`);
            }
        });
    }

    // Event-Listener für das Löschen einer Markierung
    const loescheMarkierungForm = document.getElementById('loescheMarkierungForm');
    if (loescheMarkierungForm) {
        loescheMarkierungForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite

            const markID = document.getElementById('markID').value.trim();
            if (markID) {
                loescheMarkierung(markID);
            } else {
                alert('Bitte gib eine gültige Markierungs-ID ein.');
            }
        });
    }

    // Event-Listener für das Auflisten der Markierungen
    const listeMarkierungenForm = document.getElementById('listeMarkierungenForm');
    if (listeMarkierungenForm) {
        listeMarkierungenForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite

            const containerID = document.getElementById('listeContainerID').value.trim();
            if (containerID) {
                listeMarkierungen(containerID);
            } else {
                alert('Bitte gib eine gültige Container-ID ein.');
            }
        });
    }
}