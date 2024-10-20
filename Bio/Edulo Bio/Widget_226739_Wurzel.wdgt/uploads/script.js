// script.js
document.addEventListener("DOMContentLoaded", () => {
    initializeGrid();
});

// script.js

// Aktualisierte initializeGrid Funktion, um das Startquadrat zu ändern
function initializeGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Raster zurücksetzen
    for (let i = 0; i < 25; i++) { // 5x5 Grid
        const square = document.createElement('div');
        square.classList.add('square');
        square.addEventListener('click', () => colorSquare(square));
        grid.appendChild(square);
    }
    // Start mit einem schwarzen Quadrat in der Mitte der oberen Reihe
    grid.children[2].classList.add('black');
    calculateInterface();
}

// Funktion zum Zurücksetzen des Spiels
function resetGame() {
    initializeGrid();
    document.getElementById('interfaceResult').innerText = ''; // Grenzflächenanzeige zurücksetzen
    
}

// Aktualisierte calculateInterface Funktion, um Ränder zu berücksichtigen
function calculateInterface() {
    insertArrows();
    let interfaceCount = 0;
    const size = 5; // Größe des Rasters
    const squares = document.querySelectorAll('.square');

    squares.forEach((square, index) => {
        if (square.classList.contains('black')) {
            const row = Math.floor(index / size);
            const col = index % size;
            console.log(`Schwarzes Quadrat bei [${row}, ${col}]`);

            const directions = [
                [-1, 0], // oben
                [1, 0],  // unten
                [0, -1], // links
                [0, 1]   // rechts
            ];

            directions.forEach(([dRow, dCol]) => {
                const adjRow = row + dRow;
                const adjCol = col + dCol;
             

                if (adjRow < 0 || adjRow >= size || adjCol < 0 || adjCol >= size) {
                    if (!(adjRow < 0 && adjCol === Math.floor(size / 2))) {
                        interfaceCount++;
                    
                    }
                } else {
                    const adjIndex = adjRow * size + adjCol;
                    if (!squares[adjIndex].classList.contains('black')) {
                        interfaceCount++;
                       
                    }
                }
            });
        }
    });

    document.getElementById('interfaceResult').innerText = `Grenzflächen: ${interfaceCount}`;
}


function colorSquare(square) {
    if (isAdjacentToBlack(square)) {
        square.classList.add('black');
        calculateInterface()
    }
}

function isAdjacentToBlack(square) {
    const index = Array.from(square.parentNode.children).indexOf(square);
    const adjacentIndices = [index - 1, index + 1, index - 5, index + 5];
    return adjacentIndices.some(i => {
        const adjacentSquare = square.parentNode.children[i];
        return adjacentSquare && adjacentSquare.classList.contains('black');
    });
}

function insertArrows() {
    const grid = document.getElementById('grid');
    const squares = document.querySelectorAll('.square');
    const size = Math.sqrt(squares.length); // Annahme: das Grid ist quadratisch
    const squareSize = 50; // Größe eines Quadrats basierend auf CSS
    const arrowSize = 10; // Höhe des Pfeils, angepasst an das CSS

    // Entferne alle vorhandenen Pfeile, um Duplikate zu vermeiden
    document.querySelectorAll('.arrow').forEach(arrow => arrow.remove());

    squares.forEach((square, index) => {
        const row = Math.floor(index / size);
        const col = index % size;

        const directions = [
            [-1, 0, 'up'],
            [1, 0, 'down'],
            [0, -1, 'left'],
            [0, 1, 'right']
        ];
        if (!square.classList.contains('black')) {
            return; // Überspringe Nicht-Wurzelfelder
        }
        directions.forEach(([dRow, dCol, dir]) => {
            const adjRow = row + dRow;
            const adjCol = col + dCol;
            const adjIndex = adjRow * size + adjCol;

            // Prüfe, ob das angrenzende Quadrat innerhalb des Grids liegt oder ob es sich um eine Außengrenze handelt
            if ((adjRow >= 0 && adjRow < size && adjCol >= 0 && adjCol < size && !squares[adjIndex].classList.contains('black')) || 
                (adjRow < 0 || adjRow >= size || adjCol < 0 || adjCol >= size)) {
                // Vermeide das Hinzufügen eines Pfeils am oberen mittleren Rand
                if (!(adjRow < 0 && adjCol === Math.floor(size / 2))) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow';
                    let top = row * (squareSize + 2) + squareSize / 2;
                    let left = col * (squareSize + 2) + squareSize / 2;

                    // Anpassen der Position basierend auf der Richtung
                    if (dir === 'up') top -= squareSize / 4;
                    if (dir === 'down') top += squareSize / 4;
                    if (dir === 'left') left -= squareSize / 4;
                    if (dir === 'right') left += squareSize / 4;

                    // Setze die endgültige Position und Rotation des Pfeils
                    arrow.style.top = `${top}px`;
                    arrow.style.left = `${left}px`;
                    arrow.style.transform = `rotate(${dir === 'up' ? 0 : dir === 'right' ? 90 : dir === 'down' ? 180 : 270}deg)`;

                    grid.appendChild(arrow);
                }
            }
        });
    });
}








// Fügen Sie die insertArrows Funktion am Ende von calculateInterface oder colorSquare hinzu, je nachdem, wann Sie die Pfeile anzeigen möchten.
