function drawFractionAsCircle(zähler, nenner, canvasId, canvasSize) {
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
        context.fillStyle = 'yellow';
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

  