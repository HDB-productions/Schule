//diese Funktion kann Brüche als Kreis oder Quadrat zeichnen. 
function drawFraction(zähler, nenner, canvasId, canvasSize, zeichenmethode = 'Kreis',//Zeichenmethoden sind Kreis oder Quadrat (default ist Kreis). 
zerlegung = null, //Zerlegung ist die Art der Zerlegung in Horizontal und Vertikal [a,b]. Wenn sie nicht angegeben ist, wird sie durch Primfaktorzerlegung automatisch optimal berechnet. Alternativ ist 'Horizontal' oder 'Vertikal' möglich.
color = 'yellow') {
  if (zeichenmethode === 'Quadrat') {
      drawFractionAsSquare(zähler, nenner, canvasId, canvasSize, zerlegung, color);
  } else if (zeichenmethode === 'Kreis') {
      drawFractionAsCircle(zähler, nenner, canvasId, canvasSize, color);
  } else {
      console.error('Unbekannte Zeichenmethode: ' + zeichenmethode);
  }
}

function drawFractionAsCircle(zähler, nenner, canvasId, canvasSize, color = 'yellow') {
    var canvas = document.getElementById(canvasId); // das Element, in das gezeichnet werden soll
    var radius = canvasSize / 2 - 10; // Radius des Kreises (angepasst für den Abstand)
    var rest = zähler%nenner; //berechnet den zähler des letzten Kreises bei unechten Brüchen
    var Kreise = Math.ceil(zähler / nenner);// Berechnen, wie viele Kreise gezeichnet werden müssen
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
        if (n < Kreise||i<rest||0==rest) {
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
  var canvas = document.getElementById(canvasId);
  var rest = zähler % nenner;
  var Quadrate = Math.ceil(zähler / nenner);
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

  if (zerlegung !== null && Array.isArray(zerlegung) && zerlegung[0] * zerlegung[1] === nenner) {
    faktor1 = zerlegung[0];
    faktor2 = zerlegung[1];
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
        if (n < Quadrate || (i * faktor2 + j) < rest || 0 == rest) {
          context.fill();
        }
        context.stroke();
      }
    }
  }
}


  function ggT(z1,z2) {
    var m = z1;
    var n = z2;
    var r = 1;
    while(r != 0) {
      if(m < n) {
        var h = m;
        m = n;
        n = h;
      }
      r = m - n;
      m = n;
      n = r;
    }
    return m;
  }
  function kgV(z1,z2) {
    kgv = (z1 * z2 / ggT(z1,z2));
    return kgv;
  }
  function calcGGT(zahl1, zahl2) {
    
    ggt = ggT(zahl1,zahl2);
    $('.res').html('Der ggT von ' + zahl1 + ' und ' + zahl2 + ' ist: <b>' + ggt + '</b>');
  }
  function calcKGV(zahl1,zahl2) {
     kgv = kgV(zahl1,zahl2);
    $('.res').html('Das kgV von ' + zahl1 + ' und ' + zahl2 + ' ist: <b>' + kgv + '</b>');
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
    var faktoren = [];
    for (var i = 2; i <= zahl; i++) {
        while (zahl % i === 0) {
            faktoren.push(i);
            zahl /= i;
        }
    }
    return faktoren;
}