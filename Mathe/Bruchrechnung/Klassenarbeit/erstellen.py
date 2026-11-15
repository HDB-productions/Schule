from pathlib import Path
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw

ROOT = Path(__file__).parent
ASSETS = ROOT / 'bilder'
ASSETS.mkdir(exist_ok=True)

def grid(draw, x, y, size, cols, rows, filled=(), shade='#81b5ae'):
    for r in range(rows):
        for c in range(cols):
            box = (x+c*size/cols, y+r*size/rows, x+(c+1)*size/cols, y+(r+1)*size/rows)
            draw.rectangle(box, fill=shade if (c,r) in filled else 'white')
    for c in range(cols+1):
        draw.line((x+c*size/cols,y,x+c*size/cols,y+size), fill='#183b40', width=3)
    for r in range(rows+1):
        draw.line((x,y+r*size/rows,x+size,y+r*size/rows), fill='#183b40', width=3)

def picture(name, kind):
    im = Image.new('RGB',(1550,410),'white'); d=ImageDraw.Draw(im)
    if kind=='read':
        grid(d,70,30,340,2,4,[(0,0),(0,1),(0,2),(0,3),(1,0)])
    elif kind=='mark':
        grid(d,100,30,340,2,2); grid(d,650,30,340,2,2)
    elif kind in ('refine','refine_answer'):
        fill=[(0,0),(0,1),(1,0)]
        grid(d,120,30,340,2,2,fill)
        if kind=='refine': grid(d,960,30,340,2,2,fill)
        else: grid(d,960,30,340,2,6,[(0,r) for r in range(6)]+[(1,r) for r in range(3)])
        d.line((725,176,785,176),fill='#183b40',width=6)
        d.line((725,201,785,201),fill='#183b40',width=6)
    path=ASSETS/(name+'.png'); im.save(path); return path

READ=picture('achtel','read'); MARK=picture('viertel_leer','mark')
REFINE=picture('viertel_verfeinern','refine'); ANS=picture('zwoelftel_loesung','refine_answer')

def doc(title, teacher=False):
    d=Document(); s=d.sections[0]
    s.page_height=Cm(29.7); s.page_width=Cm(21)
    s.top_margin=Cm(1.5); s.bottom_margin=Cm(1.5)
    s.left_margin=Cm(1.8); s.right_margin=Cm(1.8)
    s.header_distance=Cm(.65); s.footer_distance=Cm(.65)
    for n in ['Normal','Title','Subtitle','Heading 1','Heading 2']:
        st=d.styles[n]; st.font.name='Arial'; st.font.color.rgb=RGBColor(0,0,0)
        for border in st.element.xpath('./w:pPr/w:pBdr'): border.getparent().remove(border)
    st=d.styles['Normal']; st.font.size=Pt(11); st.paragraph_format.space_after=Pt(5)
    st.paragraph_format.line_spacing=1.08
    for n,sz in [('Title',19),('Heading 1',13),('Heading 2',11)]:
        d.styles[n].font.size=Pt(sz)
        d.styles[n].paragraph_format.space_before=Pt(10)
        d.styles[n].paragraph_format.space_after=Pt(5)
    d.styles['Title'].paragraph_format.space_before=Pt(0)
    h=s.header.paragraphs[0]; h.text='MATHEMATIK 6  ·  BRUCHRECHNUNG'+('  ·  LEHRKRAFT' if teacher else '')
    h.runs[0].font.size=Pt(8)
    f=s.footer.paragraphs[0]; f.alignment=2
    f.add_run('Seite ')
    field=OxmlElement('w:fldSimple'); field.set(qn('w:instr'),'PAGE'); f._p.append(field)
    d.add_paragraph(title,'Title')
    return d

def p(d,text='',bold=False):
    para=d.add_paragraph(); para.add_run(text).bold=bold; return para

def eq(d, tokens, prefix='',suffix=''):
    para=d.add_paragraph(); para.paragraph_format.space_after=Pt(8)
    if prefix: para.add_run(prefix)
    math=OxmlElement('m:oMath')
    def mr(s):
        r=OxmlElement('m:r'); pr=OxmlElement('w:rPr'); sz=OxmlElement('w:sz'); sz.set(qn('w:val'),'26');pr.append(sz);r.append(pr)
        t=OxmlElement('m:t'); t.text=str(s); r.append(t); return r
    for t in tokens:
        if isinstance(t,tuple):
            f=OxmlElement('m:f'); n=OxmlElement('m:num'); den=OxmlElement('m:den')
            n.append(mr(t[0])); den.append(mr(t[1])); f.extend([n,den]); math.append(f)
        else: math.append(mr(t))
    para._p.append(math)
    if suffix: para.add_run(suffix)
    return para

def lines(d,n=1):
    for _ in range(n):
        para=d.add_paragraph(''); para.paragraph_format.space_after=Pt(0)
        para.paragraph_format.line_spacing=Pt(21)
        pp=para._p.get_or_add_pPr(); b=OxmlElement('w:pBdr'); bt=OxmlElement('w:bottom')
        for k,v in [('val','single'),('sz','3'),('color','C7CDD0')]: bt.set(qn('w:'+k),v)
        b.append(bt); pp.append(b)

def pic(d,path,width=15.5):
    para=d.add_paragraph(); para.paragraph_format.space_after=Pt(0)
    run=para.add_run(); run.add_picture(str(path),width=Cm(width))
    for node in run._r.xpath('.//wp:docPr'): node.set('descr',path.stem.replace('_',' '))

def heading(d,text): d.add_paragraph(text,'Heading 1')

def table(d,headers,rows,widths=None):
    t=d.add_table(rows=1,cols=len(headers)); t.autofit=False
    for c,h in zip(t.rows[0].cells,headers): c.text=h
    for row in rows:
        for c,txt in zip(t.add_row().cells,row): c.text=str(txt)
    for ri,row in enumerate(t.rows):
        for ci,c in enumerate(row.cells):
            if widths: c.width=Cm(widths[ci])
            pr=c._tc.get_or_add_tcPr(); borders=OxmlElement('w:tcBorders')
            for side in ('top','left','bottom','right'):
                b=OxmlElement('w:'+side)
                for k,v in [('val','single'),('sz','4'),('color','D9D9D9')]: b.set(qn('w:'+k),v)
                borders.append(b)
            pr.append(borders)
            margins=OxmlElement('w:tcMar')
            for side in ('top','left','bottom','right'):
                m=OxmlElement('w:'+side);m.set(qn('w:w'),'90');m.set(qn('w:type'),'dxa');margins.append(m)
            pr.append(margins)
            if ri==0:
                sh=OxmlElement('w:shd'); sh.set(qn('w:fill'),'E8ECEE');pr.append(sh)
            for para in c.paragraphs:
                para.paragraph_format.space_after=Pt(2)
                for r in para.runs: r.font.size=Pt(9);r.bold=ri==0
    return t

def student():
    d=doc('Klassenarbeit Bruchrechnung')
    p(d,'Name: __________________________    Klasse: ______    Datum: __________')
    p(d,'Arbeitszeit 40 Minuten     Gesamtpunktzahl 36 Punkte',True)
    p(d,'Hilfsmittel: Lineal und Farbstift, kein Taschenrechner. Schreibe deine Rechenwege auf. Kürze Ergebnisse vollständig, sofern nichts anderes verlangt wird. Du darfst in einem oder in mehreren Schritten kürzen.')
    heading(d,'1  Brüche verstehen                                  6 Punkte')
    p(d,'a) Welcher Bruch ist markiert? Erkläre am Bild, was die Zahl im Nenner bedeutet.  (2 P)')
    pic(d,READ,11.2); lines(d,1)
    eq(d,[('7','4')],prefix='b) Markiere insgesamt ',suffix='. Jedes Quadrat stellt ein Ganzes dar.  (2 P)')
    pic(d,MARK,11.2)
    p(d,'c) Schreibe „sechs Zehntel“ als Bruch auf und kürze vollständig.  (2 P)'); lines(d,1)
    heading(d,'2  Kürzen und Erweitern                           8 Punkte')
    eq(d,[('36','48')],prefix='a) Kürze ',suffix=' vollständig. Notiere deine Kürzungszahl oder Kürzungszahlen.  (3 P)'); lines(d,2)
    eq(d,[('5','6'),' = ',('□','42')],prefix='b) Ergänze den Zähler und notiere die Erweiterungszahl.   ',suffix='   (2 P)')
    p(d,'Erweiterungszahl: __________')
    p(d,'c) Unterteile im rechten Bild jedes Viertel in drei gleich große Teile. Ergänze den Bruch und erkläre kurz, warum der Anteil gleich bleibt.  (3 P)')
    pic(d,REFINE,11.2)
    eq(d,[('3','4'),' = ',('□','12')]); lines(d,1)
    d.add_page_break()
    heading(d,'3  Mit Anteilen und Größen rechnen             6 Punkte')
    eq(d,[('3','8')],prefix='a) Eine Packung enthält 240 g Reis. Berechne ',suffix=' davon.  (2 P)'); lines(d,3)
    p(d,'b) Drei Fünftel eines Bandes sind 42 cm lang. Wie lang ist das ganze Band?  (2 P)'); lines(d,3)
    eq(d,[('3','4')],prefix='c) Berechne ',suffix=' von 1,2 l Saft. Rechne zuerst 1,2 l in Milliliter um und gib das Ergebnis in Millilitern an.  (2 P)'); lines(d,3)
    heading(d,'4  Brüche addieren und subtrahieren          10 Punkte')
    p(d,'Berechne mit Rechenweg und kürze vollständig. Jeder passende gemeinsame Nenner ist erlaubt. Ganze Zahlen und gemischte Zahlen sind als Ergebnis ebenfalls erlaubt.')
    eq(d,[('1','4'),' + ',('7','12')],prefix='a)  ',suffix='    (3 P)'); lines(d,3)
    eq(d,[('5','6'),' − ',('3','8')],prefix='b)  ',suffix='    (3 P)'); lines(d,3)
    eq(d,[('3','4'),' + ',('5','8')],prefix='c)  ',suffix='    (2 P)'); lines(d,2)
    eq(d,[('2','3'),' − ',('4','6')],prefix='d)  ',suffix='    (2 P)'); lines(d,2)
    d.add_page_break()
    heading(d,'5  Eine Behauptung untersuchen                6 Punkte')
    p(d,'Ben behauptet:',True)
    p(d,'„Haben zwei Brüche verschiedene Nenner, muss man immer mindestens einen Bruch erweitern, bevor man sie addieren kann.“')
    p(d,'a) Untersuche Bens Behauptung an dieser Summe. Berechne auf einem möglichst einfachen Weg. Entscheide dann, ob Bens Behauptung immer gilt, und begründe deine Entscheidung mit deinem Rechenweg.  (4 P)')
    eq(d,[('2','6'),' + ',('3','9')]); lines(d,7)
    p(d,'b) Finde zwei andere Brüche mit verschiedenen Nennern, die du ohne Erweitern auf denselben Nenner bringen kannst. Verwende einen anderen gemeinsamen Nenner als bei a). Schreibe deine Addition mit Rechenweg auf.  (2 P)'); lines(d,6)
    p(d,'Wenn du fertig bist: Prüfe die Einheiten, deine Rechenzeichen und ob du alle Ergebnisse vollständig gekürzt hast.')
    d.save(ROOT/'Klassenarbeit Bruchrechnung 6.docx')

def teacher():
    d=doc('Konzept und Erwartungshorizont',True)
    p(d,'Klassenarbeit Bruchrechnung für Jahrgang 6 am Gymnasium. Vorschlag für 40 Minuten mit 36 Punkten. Die Aufgaben übertragen die sieben vorhandenen Apps auf eine schriftliche Arbeit; es werden keine zusätzlichen Rechenverfahren vorausgesetzt.')
    heading(d,'Umfang und Zeitplanung')
    p(d,'Die Mehrheit bearbeitete laut Unterrichtsbeobachtung in 90 Minuten jeweils etwa 20 Aufgaben der drei neuen Apps, zusammen etwa 60 Aufgaben. Das entspricht grob 1½ Minuten pro App-Aufgabe. Diese Angabe belegt Übungserfahrung, aber weder selbstständige Erstversuchssicherheit noch einheitliches Tempo. Drei Lernende lagen bei jedem Typ unter zehn richtigen Aufgaben.')
    p(d,'Die Arbeit enthält deutlich weniger Rechnungen und plant Zeit für Zeichnungen, schriftliche Wege und Begründungen ein. Die Zielzeiten summieren sich auf 35 Minuten; fünf Minuten bleiben für Lesen, Wechsel und Kontrolle. Für langsamere Lernende kann der Transferteil trotzdem zeitlich anspruchsvoll sein. Eine echte Zeitpilotierung steht aus.')
    table(d,['Aufgabe','Schwerpunkt','Punkte','Zielzeit'],[
        ['1','Brüche lesen und darstellen',6,'5 min'],['2','Kürzen, Erweitern, Flächeninvarianz',8,'6 min'],
        ['3','Anteil, Ganzes und Einheiten',6,'6 min'],['4','Addition und Subtraktion',10,'9 min'],
        ['5','Behauptung prüfen und Beispiel konstruieren',6,'9 min'],['Reserve','Lesen und Kontrolle','–','5 min']], [1.9,10,1.7,2.5])
    heading(d,'Bezug zu den sieben Apps')
    table(d,['App','Übertragung in die Klassenarbeit'],[
        ['Brüche verstehen','1a bis c: gleiche Teilflächen, Wortbruch, mehr als ein Ganzes'],
        ['Anteile berechnen','3a: bekannte Gesamtmenge in gleiche Teile zerlegen'],
        ['Das Ganze bestimmen','3b: von bekannter Teilmenge auf das Ganze schließen'],
        ['Anteile berechnen mit Einheitenwechsel','3c: passende kleinere Einheit vor der Anteilsrechnung'],
        ['Brüche kürzen','1c und 2a: ein- oder mehrschrittig vollständig kürzen'],
        ['Brüche erweitern','2b und c: Faktor, vorgegebener Nenner und feinere Einteilung'],
        ['Brüche addieren und subtrahieren','4 und 5: gleichnamig schreiben, rechnen, Ergebnis kürzen']], [6,10.1])
    p(d,'Die Bilder übernehmen die Flächenidee der Apps: ein Quadrat als Ganzes, gleich große Zellen und petrolfarbene Markierungen. Die rechte Darstellung in 2c hat dieselbe gefärbte Fläche wie die linke; nur die Einteilung wird feiner. Die Linien sind auch bei Graustufendruck deutlich. Sachaufgaben verwenden die vertrauten Kontexte Reis, Band und Saft, verzichten aber auf zusätzliche dekorative Bilder.')
    d.add_page_break()
    heading(d,'Lösungen und Punkte für Aufgaben 1 bis 3')
    heading(d,'1  Brüche verstehen')
    p(d,'a) 5/8 (1 P). Der Nenner 8 bedeutet, dass ein Ganzes in acht gleich große Teile zerlegt ist (1 P). „Acht Teile“ ohne die Gleichgröße genügt für den Erklärungspunkt nicht.')
    p(d,'b) Insgesamt sieben Viertelflächen markieren: ein Ganzes und drei Viertel des zweiten (2 P). 1 P für ein richtig dargestelltes ganzes Quadrat; 1 P für weitere drei Viertel. Andere Verteilungen mit insgesamt sieben Viertelflächen sind ebenfalls richtig.')
    eq(d,[('6','10'),' = ',('3','5')],prefix='c)  ',suffix=': Wortbruch korrekt (1 P), vollständig gekürzt (1 P).')
    heading(d,'2  Kürzen und Erweitern')
    eq(d,[('36','48'),' = ',('18','24'),' = ',('3','4')],prefix='a) Zum Beispiel  ',suffix='  mit Kürzungszahlen 2 und 6.')
    p(d,'Auch direkt mit 12 oder über andere zulässige gemeinsame Teiler. Punkte: zulässige Kürzungszahl(en) erkennbar (1 P), Zähler und Nenner konsequent durch denselben Teiler geteilt (1 P), vollständig gekürztes Ergebnis 3/4 (1 P). Keine Pflicht zum größten Teiler im ersten Schritt.')
    eq(d,[('5','6'),' = ',('35','42')],prefix='b)  ',suffix='; Erweiterungszahl 7 (1 P), Zähler 35 (1 P).')
    p(d,'c) Jedes der vier Viertel wird in drei gleich große Teilflächen zerlegt (1 P). Neun von zwölf Teilflächen sind gefärbt, also 9/12 (1 P). Erklärung: Die gefärbte Fläche und das Ganze bleiben gleich; nur die Zahl der gleich großen Teile ändert sich (1 P). Die genaue Richtung der neuen Linien ist frei, solange alle zwölf Teile gleich groß sind.')
    pic(d,ANS,12.4)
    heading(d,'3  Mit Anteilen und Größen rechnen')
    p(d,'a) 240 g : 8 = 30 g; 30 g · 3 = 90 g. Passender Anteilsansatz (1 P), richtiges Ergebnis mit Einheit (1 P). Auch zuerst vervielfachen oder vorher sinnvoll kürzen ist zulässig.')
    p(d,'b) 42 cm : 3 = 14 cm; 14 cm · 5 = 70 cm. Passender Ansatz für das Ganze (1 P), Ergebnis mit Einheit (1 P). Auch 42 cm · 5 : 3 ist richtig.')
    p(d,'c) 1,2 l = 1200 ml (1 P); 1200 ml : 4 · 3 = 900 ml (1 P). 0,9 l ist gleichwertig, erfüllt allein aber nicht die ausdrücklich verlangte Ergebniseinheit ml.')
    d.add_page_break()
    heading(d,'Lösungen und Punkte für Aufgaben 4 und 5')
    heading(d,'4  Brüche addieren und subtrahieren')
    eq(d,[('1','4'),' + ',('7','12'),' = ',('3','12'),' + ',('7','12'),' = ',('10','12'),' = ',('5','6')],prefix='a)  ')
    p(d,'Gleichnamig richtig (1 P), Zähler richtig verrechnet (1 P), vollständig gekürzt (1 P).')
    eq(d,[('5','6'),' − ',('3','8'),' = ',('20','24'),' − ',('9','24'),' = ',('11','24')],prefix='b)  ')
    p(d,'Gemeinsamer Nenner passend (1 P), beide Brüche richtig umgeschrieben (1 P), Ergebnis richtig (1 P).')
    eq(d,[('3','4'),' + ',('5','8'),' = ',('6','8'),' + ',('5','8'),' = ',('11','8')],prefix='c)  ',suffix='  oder 1⅜.')
    p(d,'Gleichnamig richtig (1 P), Ergebnis richtig (1 P).')
    eq(d,[('2','3'),' − ',('4','6'),' = ',('2','3'),' − ',('2','3'),' = 0'],prefix='d)  ')
    p(d,'Gleichnamig richtig oder Gleichheit der Ausgangsbrüche begründet erkannt (1 P), Ergebnis 0 oder 0/1 (1 P). Auch der Weg über Sechstel oder einen anderen passenden Nenner zählt voll.')
    heading(d,'5  Eine Behauptung untersuchen')
    eq(d,[('2','6'),' + ',('3','9'),' = ',('1','3'),' + ',('1','3'),' = ',('2','3')],prefix='a)  ')
    p(d,'Beide Ausgangsbrüche durch Kürzen auf Drittel gebracht (1 P); Summe 2/3 (1 P). Bens Behauptung gilt nicht immer (1 P). Begründung: Im Beispiel reichen Kürzungen beider Brüche, kein Bruch muss erweitert werden; ein solches Beispiel widerlegt das Wort „immer“ (1 P). Eine sinngemäße Erklärung genügt. Ein Weg nur über Achtzehntel ist rechnerisch richtig, untersucht die Behauptung aber noch nicht ausreichend.')
    eq(d,[('2','8'),' + ',('3','12'),' = ',('1','4'),' + ',('1','4'),' = ',('1','2')],prefix='b) Zum Beispiel  ')
    p(d,'Passendes anderes Zahlenpaar mit verschiedenen Ausgangsnennern und anderem gemeinsamen Nenner als in a (1 P); korrekter Nachweis durch Umschreiben ohne Erweitern und vollständige Rechnung (1 P). Auch ein schon passend geschriebener Summand ist erlaubt, etwa 1/5 + 2/10. Nicht nur ein Zahlenpaar, sondern die gezeigte Möglichkeit ohne Erweitern wird bewertet.')
    heading(d,'Korrekturgrundsätze')
    p(d,'In Aufgabe 4 erhalten gleichwertige Wege und passende größere gemeinsame Nenner volle Punkte. Eine gültige Kürzung in mehreren Schritten wird nicht abgewertet. Folgefehler nur an ihrer Entstehungsstelle werten; weitere methodisch richtige Schritte auf Grundlage des eigenen Zwischenwerts erhalten die vorgesehenen Verfahrenspunkte. Reine Ergebniszeilen ersetzen die ausdrücklich verlangten Rechenwege nicht. Es gibt keine gesonderten Schönschriftpunkte. Die Notengrenzen werden nach den vor Ort vereinbarten Regeln festgelegt.')
    d.add_page_break()
    heading(d,'Anforderungsbereiche und Einsatzhinweise')
    p(d,'Die Zuordnung ist eine didaktische Einschätzung für diesen Unterricht und keine behauptete landesspezifische Vorgabe. Entscheidend ist, welche Lösungswege im Unterricht bereits explizit geübt wurden.')
    table(d,['Bereich','Punkte','Anteil','Zuordnung'],[
        ['AFB I',22,'61 %','1a Bruch lesen (1), 1b/c (4), 2a/b (5), 3a/c (4), 4a–c (8)'],
        ['AFB II',10,'28 %','1a Nenner erläutern (1), 2c (3), 3b (2), 4d (2), 5a Rechnung (2)'],
        ['AFB III',4,'11 %','5a Urteil mit Begründung (2), 5b eigenes Gegenbeispiel (2)']], [2,1.7,1.7,10.7])
    p(d,'AFB III entsteht durch das Prüfen einer allgemeinen Behauptung und das gezielte Konstruieren eines Gegenbeispiels. Die Rechnung mit den vorgegebenen Brüchen allein zählt nicht als AFB III. War genau diese Behauptung samt Gegenbeispielen bereits Unterrichtsinhalt, sinkt der Transferanspruch; dann sollte die Aussage vor dem Einsatz variiert werden.')
    heading(d,'Bewusste Entscheidungen zum Aufgabendesign')
    p(d,'Der Einstieg ist niedrigschwellig. Aufgabe 2a erlaubt sowohl den schnellen Weg über 12 als auch mehrere Kürzungsschritte. Aufgabe 2b gibt den Zielnenner fest vor; er muss wie in der App nicht erneut ermittelt werden. Aufgabe 2c prüft die unveränderte Fläche statt einer bloßen Merksatzabfrage.')
    p(d,'Die vier Rechnungen in Aufgabe 4 prüfen unterschiedliche Fälle: ein Nenner ist Vielfaches des anderen, zwei Nenner ohne direkte Teilbarkeit, ein Ergebnis über einem Ganzen und das Ergebnis null. Bei 4d wird bewusst auch das Kürzen vor dem Rechnen ermöglicht. Aufgabe 5 knüpft daran an, gibt aber keinen Rechenweg vor.')
    heading(d,'Organisation')
    p(d,'Die Schülerfassung umfasst drei Seiten mit Schreibraum. Die dritte Seite enthält den Transferteil und zusätzlichen Raum zum Begründen; sie ist kein zusätzlicher Zeitblock. Für die Ausgabe auf Papier die Schülerfassung allein drucken, nicht dieses Lehrkraftdokument. Das Lineal dient den geraden Teilungslinien, der Farbstift der Markierung in 1b; Schraffieren ist gleichwertig.')
    p(d,'Annahmen dieses Vorschlags: ohne Taschenrechner, alle sieben Aufgabentypen wurden behandelt, gemischte Zahlen sind zulässig und Größenumrechnungen wie 1,2 l = 1200 ml sind bekannt. Kein Teil verlangt Multiplikation oder Division zweier Brüche, negative Ergebnisse oder kgV-/ggT-Fachsprache. Eine verkürzte oder angepasste Fassung richtet sich nach den geltenden individuellen Regelungen; die App-Ergebnisse allein begründen keine solche Entscheidung.')
    heading(d,'Verwendete lokale Quellen')
    p(d,'Brueche verstehen.html; Anteile berechnen.html und .md; Das Ganze bestimmen.html und .md; Anteile berechnen 2.html und .md; werkstatt/README.md, domain.js, reduce-domain.js, operate-domain.js und visuals.js. Die drei neuen Apps werden aus diesen Werkstattquellen gebaut. Stand der Sichtung: 29. Oktober 2026.')
    d.save(ROOT/'Konzept und Erwartungshorizont.docx')

if __name__=='__main__':
    student(); teacher(); print('Created two DOCX files in',ROOT)
