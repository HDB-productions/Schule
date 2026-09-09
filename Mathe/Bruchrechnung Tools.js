function pruefeGanzzahl(zahl, name) {
  if (!Number.isSafeInteger(zahl)) {
    throw new Error(name + ' muss eine ganze Zahl im sicheren Zahlenbereich sein.');
  }
}

function pruefeZeichnung(zaehler, nenner, groesse) {
  pruefeGanzzahl(zaehler, 'Der Zähler');
  pruefeGanzzahl(nenner, 'Der Nenner');
  if (zaehler < 0 || nenner <= 0) {
    throw new Error('Zum Zeichnen muss der Zähler mindestens 0 und der Nenner größer als 0 sein.');
  }
  if (!Number.isFinite(groesse) || groesse < 30 || groesse > 1000) {
    throw new Error('Die Größe muss zwischen 30 und 1000 Pixeln liegen.');
  }
  const anzahl = Math.max(1, Math.ceil(zaehler / nenner));
  if (nenner * anzahl > 10000 || anzahl * groesse * 1.1 > 16000 || anzahl * groesse * groesse * 1.1 > 16000000) {
    throw new Error('Die Zeichnung ist zu groß. Bitte kleinere Zahlen oder eine kleinere Größe wählen.');
  }
}

//diese Funktion kann Brüche als Kreis oder Quadrat zeichnen. 
function drawFraction(zähler, nenner, canvasId, canvasSize, zeichenmethode = 'Kreis',//Zeichenmethoden sind Kreis oder Quadrat (default ist Kreis). 
zerlegung = null, //Zerlegung ist die Art der Zerlegung in Horizontal und Vertikal [a,b]. Wenn sie nicht angegeben ist, wird sie durch Primfaktorzerlegung automatisch optimal berechnet. Alternativ ist 'Horizontal' oder 'Vertikal' möglich.
color = 'yellow') {
  if (zeichenmethode === 'Quadrat') {
      drawFractionAsSquare(zähler, nenner, canvasId, canvasSize, zerlegung, color);
  } else if (zeichenmethode === 'Kreis') {
      drawFractionAsCircle(zähler, nenner, canvasId, canvasSize, color);
  } else {
      throw new Error('Unbekannte Zeichenmethode: ' + zeichenmethode);
  }
}

function drawFractionAsCircle(zähler, nenner, canvasId, canvasSize, color = 'yellow') {
    pruefeZeichnung(zähler, nenner, canvasSize);
    var canvas = document.getElementById(canvasId); // das Element, in das gezeichnet werden soll
    var radius = canvasSize / 2 - 10; // Radius des Kreises (angepasst für den Abstand)
    var rest = zähler%nenner; //berechnet den zähler des letzten Kreises bei unechten Brüchen
    var Kreise = Math.max(1, Math.ceil(zähler / nenner));// Auch 0 als leeren Kreis darstellen
    canvas.height = canvasSize; //Die Höhe des Canvas wird festgelegt    
    canvas.width = canvasSize * Kreise; // Die Breite ist je nach Anzahl der Kreise größer
    var context = canvas.getContext('2d');//Variable für den Inhalt der Zeichnung

    for (var n = 1; n <= Kreise; n++) { // n gibt an, der wievielte Kreis gezeichnet wird
      var x = (2 * n - 1) * canvasSize / 2; // x-Koordinate für die Position des Kreises
      var y = canvasSize / 2; // Y-Koordinate für die Position des Kreises
      

      

      // Schrittweise Zeichnung des Bruchteils
      var startAngle = Math.PI;
      var step = Math.PI * 2 /nenner; // Schrittgröße für jeden Teil des Bruchteils
      var endAngle = startAngle + step;
      var drawClockwise = false;

      for (var i = 0; i < nenner; i++) {
        // Zeichnen eines Teils des Bruchteils
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, drawClockwise);
        context.lineTo(x, y);
        context.closePath();
        context.fillStyle = color;
        if (zähler > 0 && (n < Kreise || i < rest || rest === 0)) {
          context.fill();
        }
        context.stroke();

        // Aktualisieren der Start- und Endwinkel für den nächsten Teil
        startAngle = endAngle;
        endAngle += step;
      }
    }
  }

function drawFractionAsSquare(zähler, nenner, canvasId, canvasSize, zerlegung = null, color = 'yellow') {
  pruefeZeichnung(zähler, nenner, canvasSize);
  var canvas = document.getElementById(canvasId);
  var rest = zähler % nenner;
  var Quadrate = Math.max(1, Math.ceil(zähler / nenner));
  var gapSize = canvasSize * 0.1; // Größe der Lücke als Prozentsatz der Quadratgröße
  canvas.height = canvasSize;
  canvas.width = (canvasSize + gapSize) * Quadrate - gapSize; // Platz für Lücken hinzufügen
  var context = canvas.getContext('2d');

  // Primfaktorzerlegung des Nenners und Aufteilung in zwei Faktoren
  var faktor1, faktor2;

  if (zerlegung === 'Horizontal') {
    zerlegung = [nenner, 1];
  } else if (zerlegung === 'Vertikal') {
    zerlegung = [1, nenner];
  }

  if (zerlegung !== null) {
    if (!Array.isArray(zerlegung) || zerlegung.length !== 2 ||
        zerlegung.some(wert => String(wert).trim() === '' || !Number.isSafeInteger(Number(wert)) || Number(wert) <= 0) ||
        Number(zerlegung[0]) * Number(zerlegung[1]) !== nenner) {
      throw new Error('Die Zerlegung benötigt zwei positive ganze Zahlen, deren Produkt der Nenner ist. Für automatische Zerlegung beide Felder leer lassen.');
    }
    faktor1 = Number(zerlegung[0]);
    faktor2 = Number(zerlegung[1]);
  } else {
    var faktoren = primfaktorzerlegung(nenner);
    faktor1 = 1;
    faktor2 = 1;
    for (var i = 0; i < faktoren.length; i++) {
      if (faktor1 <= faktor2) {
        faktor1 *= faktoren[i];
      } else {
        faktor2 *= faktoren[i];
      }
    }
  }

  for (var n = 1; n <= Quadrate; n++) {
    var x = (2 * n - 1) * canvasSize / 2 + (n - 1) * gapSize; // Position anpassen, um Platz für die Lücke zu lassen
    var y = canvasSize / 2;
    var divisionWidth = canvasSize / faktor1;
    var divisionHeight = canvasSize / faktor2;

    for (var i = 0; i < faktor1; i++) {
      for (var j = 0; j < faktor2; j++) {
        context.beginPath();
        context.rect(x - canvasSize / 2 + i * divisionWidth, j * divisionHeight, divisionWidth, divisionHeight);
        context.closePath();
        context.fillStyle = color;
        if (zähler > 0 && (n < Quadrate || (i * faktor2 + j) < rest || rest === 0)) {
          context.fill();
        }
        context.stroke();
      }
    }
  }
}


  function ggT(z1,z2) {
    pruefeGanzzahl(z1, 'Die erste Zahl');
    pruefeGanzzahl(z2, 'Die zweite Zahl');
    var m = Math.abs(z1);
    var n = Math.abs(z2);
    while (n !== 0) {
      var rest = m % n;
      m = n;
      n = rest;
    }
    return m;
  }
  function kgV(z1,z2) {
    const teiler = ggT(z1, z2);
    if (z1 === 0 || z2 === 0) return 0;
    const kgv = Math.abs((z1 / teiler) * z2);
    pruefeGanzzahl(kgv, 'Das kgV');
    return kgv;
  }
  function calcGGT(zahl1, zahl2) {
    
    const ggt = ggT(zahl1,zahl2);
    document.querySelector('.res').textContent = 'Der ggT von ' + zahl1 + ' und ' + zahl2 + ' ist: ' + ggt;
  }
  function calcKGV(zahl1,zahl2) {
    const kgv = kgV(zahl1,zahl2);
    document.querySelector('.res').textContent = 'Das kgV von ' + zahl1 + ' und ' + zahl2 + ' ist: ' + kgv;
  }
  
  function kuerzeBruch(zaehler, nenner) {
    if (nenner === 0) {
      return "Ungültiger Bruch (Nenner darf nicht 0 sein)";
    }
  
    var ggt = ggT(zaehler, nenner);
    zaehler /= ggt;
    nenner /= ggt;
  
    if (nenner < 0) {
      zaehler = -zaehler;
      nenner = -nenner;
    }
  
    return zaehler + "/" + nenner;
  }

  function primfaktorzerlegung(zahl) {
    pruefeGanzzahl(zahl, 'Die Zahl');
    if (zahl < 1) throw new Error('Die Zahl muss positiv sein.');
    var faktoren = [];
    for (var i = 2; i <= zahl / i; i++) {
        while (zahl % i === 0) {
            faktoren.push(i);
            zahl /= i;
        }
    }
    if (zahl > 1) faktoren.push(zahl);
    return faktoren;
}
function downloadCanvasAsImage(canvasId, filename) {
  var canvas = document.getElementById(canvasId);
  var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = filename;
  link.href = image;
  link.click();
}
