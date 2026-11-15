"""Überträgt die am 29.10. überarbeitete Aufgabenfassung in eindeutige Antwortfelder."""
from pathlib import Path
from copy import deepcopy
from docx import Document
from docx.shared import Cm, Pt
from docx.enum.table import WD_ROW_HEIGHT_RULE, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont
import erstellen as base

ROOT=Path(__file__).parent

def para(d,text='',bold=False,after=4):
    p=d.add_paragraph();p.paragraph_format.space_after=Pt(after)
    p.add_run(text).bold=bold
    return p

def points(d,text,points,heading=False):
    p=d.add_paragraph(style='Heading 1' if heading else 'Normal')
    p.paragraph_format.tab_stops.add_tab_stop(Cm(17),2)
    p.add_run(text).bold=heading
    r=p.add_run(f'\t____ / {points} P');r.bold=heading
    if not heading: r.font.size=Pt(10)
    return p

def field(d,label,lines=1):
    p=para(d,label,bold=True,after=0);p.runs[0].font.size=Pt(9)
    p.paragraph_format.keep_with_next=True
    # One form field consists of a label and a ruled response area.
    for _ in range(lines):
        p=d.add_paragraph();p.paragraph_format.space_after=Pt(0)
        p.paragraph_format.line_spacing=Pt(19)
        pr=p._p.get_or_add_pPr();b=OxmlElement('w:pBdr');side=OxmlElement('w:bottom')
        for k,v in [('val','single'),('sz','4'),('color','B8C2C5')]:side.set(qn('w:'+k),v)
        b.append(side);pr.append(b)
    return p

def equation(d,tokens,prefix='',suffix=''):
    return base.eq(d,tokens,prefix,suffix)

def formula(d,left,right,factor=True):
    # Printed response form: ample rectangular writing slots, not underscored
    # equation tokens whose numerator/denominator spacing is too small to fill.
    im=Image.new('RGB',(1550,245),'white');dr=ImageDraw.Draw(im)
    ft=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',49)
    sm=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',29)
    def frac(x,values):
        for y,val in zip([75,170],values):
            if val=='____':dr.rectangle((x-78,y-32,x+78,y+32),outline='#62757a',width=2)
            else:dr.text((x,y),val,font=ft,fill='black',anchor='mm')
        dr.line((x-91,120,x+91,120),fill='black',width=3)
    frac(350,left);frac(1090,right)
    dr.text((720,126),'=',font=ft,fill='black',anchor='mm')
    if factor:dr.rectangle((658,19,782,77),outline='#62757a',width=2)
    else:
        dr.text((350,226),'Wortbruch',font=sm,fill='black',anchor='mm')
        dr.text((1090,226),'vollständig gekürzt',font=sm,fill='black',anchor='mm')
    path=ROOT/'bilder'/('antwort_'+('_'.join(left+right))+('_f' if factor else '')+'.png')
    im.save(path)
    p=d.add_paragraph();p.paragraph_format.space_after=Pt(5)
    p.add_run().add_picture(str(path),width=Cm(13.5))
    return p

def form(d,headers,widths,height):
    t=base.table(d,headers,[['']*len(headers)],widths)
    for col,w in zip(t.columns,widths):col.width=Cm(w)
    row=t.rows[1];row.height=Cm(height);row.height_rule=WD_ROW_HEIGHT_RULE.AT_LEAST
    for c in row.cells:c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.TOP
    for r in t.rows:
        pr=r._tr.get_or_add_trPr();pr.append(OxmlElement('w:cantSplit'))
    return t

def gridpaper():
    im=Image.new('RGB',(1100,310),'white');dr=ImageDraw.Draw(im)
    for x in range(0,1101,31):dr.line((x,0,x,310),fill='#c8d0d2',width=1)
    for y in range(0,311,31):dr.line((0,y,1100,y),fill='#c8d0d2',width=1)
    f=ROOT/'bilder'/'zeichenfeld.png';im.save(f);return f

def student():
    d=base.doc('Klassenarbeit Bruchrechnung')
    for s in d.sections:
        hp=s.header.paragraphs[0];hp.text='Name: __________________________    Klasse: ______    Datum: __________'
        hp.runs[0].font.size=Pt(9)
    d.styles['Normal'].paragraph_format.line_spacing=1.03
    para(d,'Arbeitszeit 40 Minuten     Gesamtpunktzahl 32 Punkte',True)
    para(d,'Schreibe deine Rechenwege auf. Kürze Ergebnisse vollständig, sofern nichts anderes verlangt wird. Du darfst in einem oder in mehreren Schritten kürzen.')
    base.table(d,['Aufgabe 1','Aufgabe 2','Aufgabe 3','Aufgabe 4','Aufgabe 5','Gesamt'],[['___ / 8','___ / 8','___ / 6','___ / 6','___ / 4','___ / 32']],[2.85]*6)
    points(d,'1  Brüche verstehen',8,True)
    points(d,'a) Gib den markierten Anteil als Bruch an.',3)
    para(d,'Erkläre am Bild, was der Zähler und der Nenner bedeuten.')
    t=form(d,['Bild','Deine Antworten'],[4.2,12.9],4.0)
    # Crop the existing figure only to remove unused canvas; mathematics is unchanged.
    im=Image.open(ROOT/'bilder'/'achtel.png');im.crop((50,10,430,390)).save(ROOT/'bilder'/'achtel_kompakt.png')
    p=t.cell(1,0).paragraphs[0];p.add_run().add_picture(str(ROOT/'bilder'/'achtel_kompakt.png'),width=Cm(3.3))
    c=t.cell(1,1);c.paragraphs[0].text='Bruch: ____________________'
    c.add_paragraph('Der Zähler gibt an:')
    c.add_paragraph('________________________________________________')
    c.add_paragraph('Der Nenner gibt an:')
    c.add_paragraph('________________________________________________')
    points(d,'b) Stelle den Bruch als Bild dar und schreibe ihn als gemischte Zahl.',3)
    equation(d,[('7','4')])
    para(d,'Kennzeichne in deinem Bild, was ein Ganzes ist.')
    t=form(d,['Dein Bild','Gemischte Zahl'],[12.0,5.1],3.5)
    t.cell(1,0).paragraphs[0].add_run().add_picture(str(gridpaper()),width=Cm(11.5))
    t.cell(1,1).paragraphs[0].text='\n________________'
    points(d,'c) Schreibe „sechs Zehntel“ als Bruch auf und kürze vollständig.',2)
    formula(d,('____','____'),('____','____'),False)
    d.add_page_break()
    points(d,'2  Kürzen und Erweitern',8,True)
    points(d,'a) Kürze vollständig. Notiere auch deine Kürzungszahl(en).',3)
    equation(d,[('36','48')])
    field(d,'Rechenweg',2)
    para(d,'Kürzungszahl(en): _________________    Gekürzter Bruch: _________________')
    points(d,'b) Im rechten Bild wurde die Einteilung verändert.',3)
    para(d,'Gib beide Brüche und die Erweiterungszahl an. Trage die Erweiterungszahl über dem Gleichheitszeichen ein.')
    # Use the intact equivalent model pair, not the broken pasted overlays.
    base.pic(d,ROOT/'bilder'/'zwoelftel_loesung.png',12.5)
    formula(d,('____','____'),('____','____'))
    points(d,'c) Erweitere auf den angegebenen Nenner.',2)
    para(d,'Trage auch hier die Erweiterungszahl über dem Gleichheitszeichen ein.')
    formula(d,('2','3'),('____','9'))
    points(d,'3  Mit Anteilen und Größen rechnen',6,True)
    p=equation(d,[('5','6')],prefix='a) Eine Packung enthält 120 g Reis. Berechne ',suffix=' davon.');p.paragraph_format.tab_stops.add_tab_stop(Cm(17),2);p.add_run('\t____ / 2 P')
    field(d,'Rechenweg',1);para(d,'Ergebnis mit Einheit: __________________________')
    points(d,'b) Drei Fünftel eines Bandes sind 42 cm lang.',2)
    para(d,'Wie lang ist das ganze Band?')
    field(d,'Rechenweg',1);para(d,'Länge des ganzen Bandes: __________________________')
    p=equation(d,[('3','4')],prefix='c) Berechne ',suffix=' von 1,2 l Saft.');p.paragraph_format.tab_stops.add_tab_stop(Cm(17),2);p.add_run('\t____ / 2 P')
    para(d,'Rechne zuerst in Milliliter um. Gib das Ergebnis in Millilitern an.')
    para(d,'Umrechnung: 1,2 l = __________________ ml')
    field(d,'Rechenweg',1);para(d,'Ergebnis: __________________ ml')
    d.add_page_break()
    points(d,'4  Brüche addieren und subtrahieren',6,True)
    para(d,'Berechne mit Rechenweg und kürze vollständig. Jeder passende gemeinsame Nenner ist erlaubt. Ganze Zahlen und gemischte Zahlen sind als Ergebnis ebenfalls erlaubt.')
    points(d,'a) Berechne die Summe.',3)
    equation(d,[('1','4'),' + ',('7','12')])
    field(d,'Rechenweg',3);para(d,'Vollständig gekürztes Ergebnis: __________________________')
    points(d,'b) Berechne die Differenz.',3)
    equation(d,[('5','6'),' − ',('3','8')])
    field(d,'Rechenweg',3);para(d,'Vollständig gekürztes Ergebnis: __________________________')
    points(d,'5  Eine Behauptung untersuchen',4,True)
    para(d,'Ben behauptet:',True)
    para(d,'„Haben zwei Brüche verschiedene Nenner, muss man immer mindestens einen Bruch erweitern, bevor man sie addieren kann.“')
    para(d,'Untersuche die Behauptung an dieser Summe. Berechne auf einem möglichst einfachen Weg. Entscheide dann, ob Bens Behauptung immer gilt. Begründe deine Entscheidung mit deinem Rechenweg.')
    equation(d,[('2','6'),' + ',('3','9')])
    field(d,'Dein Rechenweg',2);para(d,'Ergebnis der Summe: __________________________')
    para(d,'Bens Behauptung gilt immer:     ☐ Ja     ☐ Nein')
    field(d,'Begründung',3)
    d.save(ROOT/'Klassenarbeit Bruchrechnung 6 überarbeitet.docx')

def teacher():
    # Preserve the existing concept and its overall structure; replace only stale parts.
    d=Document(ROOT/'qa'/'Erwartungshorizont vor Layoutkorrektur.docx')
    reps={
    '36 Punkten':'32 Punkten',
    'Die rechte Darstellung in 2c':'Die rechte Darstellung in 2b',
    'a) 5/8 (1 P). Der Nenner 8 bedeutet, dass ein Ganzes in acht gleich große Teile zerlegt ist (1 P). „Acht Teile“ ohne die Gleichgröße genügt für den Erklärungspunkt nicht.':'a) Bruch 5/8 (1 P). Zähler 5: fünf Teilflächen sind markiert (1 P). Nenner 8: ein Ganzes ist in acht gleich große Teile zerlegt (1 P).',
    'b) Insgesamt sieben Viertelflächen markieren: ein Ganzes und drei Viertel des zweiten (2 P). 1 P für ein richtig dargestelltes ganzes Quadrat; 1 P für weitere drei Viertel. Andere Verteilungen mit insgesamt sieben Viertelflächen sind ebenfalls richtig.':'b) Bild mit insgesamt sieben Vierteln bei erkennbar gleich großen Ganzen (2 P): 1 P für ein Ganzes und 1 P für weitere drei Viertel. Gemischte Zahl 1¾ (1 P). Andere mathematisch eindeutige Darstellungen sind gleichwertig.',
    'a) 240 g : 8 = 30 g; 30 g · 3 = 90 g. Passender Anteilsansatz (1 P), richtiges Ergebnis mit Einheit (1 P). Auch zuerst vervielfachen oder vorher sinnvoll kürzen ist zulässig.':'a) 120 g : 6 = 20 g; 20 g · 5 = 100 g. Passender Anteilsansatz (1 P), Ergebnis 100 g mit Einheit (1 P). Auch zuerst vervielfachen oder vorher sinnvoll kürzen ist zulässig.',
    'AFB III entsteht durch das Prüfen einer allgemeinen Behauptung und das gezielte Konstruieren eines Gegenbeispiels. Die Rechnung mit den vorgegebenen Brüchen allein zählt nicht als AFB III. War genau diese Behauptung samt Gegenbeispielen bereits Unterrichtsinhalt, sinkt der Transferanspruch; dann sollte die Aussage vor dem Einsatz variiert werden.':'AFB III liegt hier im begründeten Urteil über Bens allgemeine Behauptung. Die Rechnung allein zählt als AFB II. Das frühere Konstruieren eines eigenen Gegenbeispiels ist in der überarbeiteten Schülerfassung entfallen. War genau diese Behauptung bereits Unterrichtsinhalt, sinkt der Transferanspruch.',
    'Der Einstieg ist niedrigschwellig. Aufgabe 2a erlaubt sowohl den schnellen Weg über 12 als auch mehrere Kürzungsschritte. Aufgabe 2b gibt den Zielnenner fest vor; er muss wie in der App nicht erneut ermittelt werden. Aufgabe 2c prüft die unveränderte Fläche statt einer bloßen Merksatzabfrage.':'Aufgabe 1 verbindet Bruchverständnis und den Wechsel zwischen Bild, Bruch und gemischter Zahl. Aufgabe 2a erlaubt sowohl Kürzen mit 12 als auch mehrere Schritte. In 2b werden zwei gleichwertige Flächenbilder beschriftet; 2c gibt den Zielnenner fest vor.',
    'Die vier Rechnungen in Aufgabe 4 prüfen unterschiedliche Fälle: ein Nenner ist Vielfaches des anderen, zwei Nenner ohne direkte Teilbarkeit, ein Ergebnis über einem Ganzen und das Ergebnis null. Bei 4d wird bewusst auch das Kürzen vor dem Rechnen ermöglicht. Aufgabe 5 knüpft daran an, gibt aber keinen Rechenweg vor.':'Aufgabe 4 enthält nach der Überarbeitung eine Addition mit einem Nenner als Vielfachem des anderen sowie eine Subtraktion ohne direkte Teilbarkeit der Nenner. Die früheren Teile 4c und 4d entfallen. Aufgabe 5 untersucht, ob auch Kürzen zum Gleichnamigmachen ausreichen kann.',
    'Die Schülerfassung umfasst drei Seiten mit Schreibraum. Die dritte Seite enthält den Transferteil und zusätzlichen Raum zum Begründen; sie ist kein zusätzlicher Zeitblock. Für die Ausgabe auf Papier die Schülerfassung allein drucken, nicht dieses Lehrkraftdokument. Das Lineal dient den geraden Teilungslinien, der Farbstift der Markierung in 1b; Schraffieren ist gleichwertig.':'Die Schülerfassung umfasst drei Seiten: 1 – Bruchverständnis; 2 – Kürzen, Erweitern und Größen; 3 – Rechnen und begründetes Urteil. Jede Antwort hat ein bezeichnetes Feld. Punkte können je Teilaufgabe, Hauptaufgabe und in der Gesamtübersicht eingetragen werden. Nur die Schülerfassung ausgeben.',
    }
    for p in d.paragraphs:
        if p.text in reps:p.text=reps[p.text]
        elif '36 Punkten' in p.text:p.text=p.text.replace('36 Punkten','32 Punkten')
        if 'Die rechte Darstellung in 2c' in p.text:
            p.text=p.text.replace('Die rechte Darstellung in 2c','Die rechte Darstellung in 2b')
    # Remove precisely the deleted exercises and replace the two reordered subparts.
    pars=list(d.paragraphs)
    for p in pars:
        txt=p.text
        if txt.startswith('b)') and 'Erweiterungszahl 7' in txt:
            p.text='b) Linker Bruch 3/4 (1 P), rechter Bruch 9/12 (1 P), Erweiterungszahl 3 (1 P). Die farbige Fläche ist in beiden Bildern gleich groß.'
            # Old equation is part of this same paragraph; text replacement removes it.
        if txt.startswith('c) Jedes der vier Viertel'):
            p.text='c) 2/3 = 6/9: Erweiterungszahl 3 (1 P), Zähler 6 (1 P). Der Zielnenner 9 ist vorgegeben.'
    # The retained model pair belongs to 2b, so place it before the new 2c text.
    pars=list(d.paragraphs)
    for i,p in enumerate(pars):
        if p.text.startswith('c) 2/3 = 6/9') and i+1<len(pars) and pars[i+1]._p.xpath('.//w:drawing'):
            p._p.addprevious(pars[i+1]._p)
    # Original solution paragraphs with display math are identified by nearby content.
    pars=list(d.paragraphs)
    for i,p in enumerate(pars):
        if p.text.startswith('c)') and 'oder 1' in p.text:
            p._element.getparent().remove(p._element)
            if i+1<len(pars):pars[i+1]._element.getparent().remove(pars[i+1]._element)
        if p.text.startswith('d)') and p._p.xpath('.//m:oMath'):
            p._element.getparent().remove(p._element)
            if i+1<len(pars):pars[i+1]._element.getparent().remove(pars[i+1]._element)
        if p.text.startswith('b) Zum Beispiel'):
            p._element.getparent().remove(p._element)
            if i+1<len(pars):pars[i+1]._element.getparent().remove(pars[i+1]._element)
    # Table updates preserve the existing typography and borders.
    t=d.tables[0]
    values=[['1','Brüche lesen, erklären und darstellen','8','7 min'],['2','Kürzen und Erweitern','8','8 min'],['3','Anteil, Ganzes und Einheiten','6','7 min'],['4','Addition und Subtraktion','6','7 min'],['5','Behauptung prüfen und begründen','4','6 min'],['Reserve','Lesen und Kontrolle','–','5 min']]
    for row,vals in zip(t.rows[1:],values):
        for c,v in zip(row.cells,vals):c.text=v
    for row in d.tables[1].rows:
        if 'Brüche erweitern' in row.cells[0].text:row.cells[1].text='2b und 2c: Brüche zum Bild, Erweiterungszahl und Zielnenner'
    t=d.tables[2]
    vals=[['AFB I','24','75 %','1a Bruch lesen (1), 1b/c (5), 2a/c (5), 3a/c (4), 4 (6), 2b Zahlen (3)'],['AFB II','6','19 %','1a Zähler/Nenner erklären (2), 3b (2), 5 Rechnung (2)'],['AFB III','2','6 %','5 begründetes Urteil (2)']]
    for row,vs in zip(t.rows[1:],vals):
        for c,v in zip(row.cells,vs):c.text=v
    d.save(ROOT/'Konzept und Erwartungshorizont überarbeitet.docx')

if __name__=='__main__':
    student();teacher()
