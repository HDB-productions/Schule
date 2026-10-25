// Public lesson configuration. Reference answers intentionally remain inside the widget.
const API_BASE = 'https://edulomodularai.hildebrandt.workers.dev';
const LESSON = {
  id:'ionisierende-strahlung-v1',version:'2',videoId:'PN3aSorc2mc',videoTitle:'3.1 Ionisierende Strahlung',
  questions:[
    {id:'definition',title:'Erläutere, was man unter ionisierender Strahlung versteht.',
      reference:'Ionisierende Strahlung kann Elektronen aus Atomen oder Molekülen entfernen. Wird einem neutralen Atom ein Elektron entzogen, bleiben ein positiv geladenes Ion und ein freies Elektron zurück. Abgrenzung bei Fehlvorstellungen: Ionisierende Strahlung ist ein Oberbegriff und umfasst Teilchenstrahlung sowie elektromagnetische Strahlung; sie ist nicht mit UV-Strahlung oder Licht gleichzusetzen. Die Sonnen-UV-Strahlung, die den Erdboden erreicht (UVA/UVB), ist nichtionisierend und kann dennoch Krebs verursachen. Sehr kurzwelliges, energiereiches UV kann hingegen ionisieren; keine pauschale Aussage „UV kann niemals ionisieren“. Eine richtige Aussage zu Sonnen-UV erklärt allein noch nicht die Wirkung oder Gefahren der hier gefragten ionisierenden Strahlung.',
      criteria:[
        {id:'q1_electron_removal',label:'Elektronenentzug',description:'Erklärt, dass die Strahlung Elektronen aus Atomen oder Molekülen entfernen kann. Bloß das Wort Ionisation reicht nicht.',source:14},
        {id:'q1_positive_ion',label:'Entstehung eines Ions',description:'Erklärt das zurückbleibende positiv geladene Teilchen nach Elektronenentzug; sinngemäße Worte genügen.',source:14},
        {id:'q1_free_electron',label:'Freies Elektron',description:'Nennt das herausgelöste freie Elektron neben dem zurückbleibenden Ion.',source:14}
      ]},
    {id:'messung',title:'Erläutere, wie man ionisierende Strahlung messen könnte.',
      reference:'Die ionisierende Wirkung kann als Nachweis dienen: Strahlung erzeugt in einem Gas freie Elektronen und positive Ionen. Zwischen zwei Elektroden mit angelegter Spannung wandern diese Ladungsträger zu den jeweils entgegengesetzt geladenen Elektroden. Ihre Bewegung erzeugt ein messbares elektrisches Signal, beispielsweise in einer Ionisationskammer. Andere fachlich richtige Verfahren mit nachvollziehbarer Wirkungskette und messbarem Signal sind ebenfalls gültig, zum Beispiel ein Szintillationsdetektor oder die Schwärzung eines Filmdosimeters. Ein Gerätename ohne Erklärung genügt nicht. Der Videoteil erklärt die Ionisation und Ladungsbewegung; die Gerätebezeichnung und die ausdrückliche Strommessung sind fachliche Ergänzungen.',
      criteria:[
        {id:'q2_ionisation',label:'Nachweiswirkung',description:'Nennt die nutzbare Wechselwirkung der Strahlung mit einem Material: z. B. Ionisation im Gas, Lichtblitze oder Filmschwärzung.',source:54},
        {id:'q2_setup',label:'Geeigneter Messaufbau',description:'Beschreibt einen passenden Aufbau: im Videobeispiel Gas zwischen Elektroden mit Spannung; bei einem alternativen Verfahren dessen geeignetes Nachweismaterial bzw. Detektor. Keine Spannung verlangen, wenn eine andere korrekte Methode erklärt wird.',source:54},
        {id:'q2_process',label:'Wirkung im Detektor',description:'Erklärt den Weg zum Nachweis: im Videobeispiel Bewegung der Ladungsträger zu entgegengesetzt geladenen Platten. Bei Alternativen fachlich richtige Wirkungskette gleichwertig anerkennen.',source:54},
        {id:'q2_signal',label:'Messbares Signal',description:'Verknüpft den Vorgang mit einer messbaren Größe, z. B. Strom/Impulse, Lichtsignale oder auswertbare Filmschwärzung. Nicht verlangen, dass ein einfaches Signal ohne Kalibrierung bereits eine Strahlendosis ergibt.',source:54}
      ]},
    {id:'gefahren',title:'Erläutere, worin die Gefahren der ionisierenden Strahlung bestehen.',
      reference:'Ionisierende Strahlung kann chemische Bindungen und wichtige Moleküle in Zellen schädigen. Schäden an der DNA können zum Absterben von Zellen oder zu bleibenden Veränderungen führen. Wenn die Kontrolle der Zellteilung gestört wird, kann Krebs entstehen. Viele Schäden werden repariert oder geschädigte Zellen beseitigt; eine Bestrahlung führt deshalb nicht zwangsläufig zu Krebs. Mit steigender Dosis steigt grundsätzlich das Risiko. Menschen können ionisierende Strahlung nicht unmittelbar mit ihren Sinnesorganen wahrnehmen: Man kann sie weder sehen noch hören oder riechen. Ohne ein geeignetes Messgerät bleibt eine gefährliche Exposition deshalb unbemerkt; erst später erkennbare Schäden sind kein verlässliches Warnsignal. Keine vermeintlichen Superkräfte oder die falsche Behauptung verlangen, somatische Mutationen bei bereits geborenen Lebewesen seien unmöglich.',
      criteria:[
        {id:'q3_molecules',label:'Schäden an Molekülen',description:'Erklärt Schäden an chemischen Bindungen bzw. Molekülen in Körperzellen durch die Strahlung.',source:195},
        {id:'q3_dna',label:'Schäden am Erbgut',description:'Benennt DNA/Erbgut als besonders folgenreiches Angriffsziel und mögliche bleibende Veränderung oder Zelltod.',source:261},
        {id:'q3_cancer',label:'Entstehung von Krebs',description:'Verknüpft Schäden am Erbgut mit gestörter Kontrolle der Zellteilung bzw. unkontrolliertem Zellwachstum und Krebsrisiko. Nur das Wort Krebs ist noch keine Erläuterung.',source:261},
        {id:'q3_repair',label:'Reparatur und Schutzreaktionen',description:'Erkennt mögliche Reparatur oder Beseitigung geschädigter Zellen. Nicht jede Bestrahlung führt zwangsläufig zu Krebs.',source:261},
        {id:'q3_risk',label:'Dosis und Risiko',description:'Erkennt grundsätzlich steigendes Risiko bei höherer Strahlendosis. Keine absolute Sicherheit oder zwangsläufigen Krebs bei beliebig kleiner Dosis behaupten.',source:261},
        {id:'q3_perception',label:'Ohne Messgerät nicht wahrnehmbar',description:'Erklärt, dass Menschen ionisierende Strahlung nicht direkt mit ihren Sinnen wahrnehmen können und eine Gefahr ohne geeignetes Messgerät unbemerkt bleiben kann. Sinngemäße Aussagen wie man sieht oder spürt sie nicht genügen; keine vollständige Aufzählung aller Sinne verlangen.',source:392}
      ]}
  ]
};
if(typeof module!=='undefined'&&module.exports)module.exports=LESSON;
