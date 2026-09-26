// Render the actual hint functions with distinguishable sample values, then
// substitute their semantic placeholders. No duplicate editorial hint source.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Motion=require('./domain.js');
function buildReview(){
  const context={Motion};vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'visuals.js'),'utf8'),context);
  const names=['0. Gegebene Größen ordnen','1. Geschwindigkeit','2. Anfangsposition','3. Bewegungsformel','4. Weitere Position'];
  const templates=Motion.textTemplates();
  const sections=Array.from({length:6},(_,type)=>{
    const template=templates[type*4],task=Motion.generate(type,()=>.01);
    const d=task.data;
    Object.assign(d,{v:83,s0:type===4?0:17,elapsed:.65,firstT:.31,targetT:2.3,clockStart:503});
    Object.assign(task,{v:d.v,s0:d.s0,targetT:d.targetT,answer:d.s0+d.v*d.targetT});
    const values=new Map();
    function add(value,label){if(value===0)return;for(const key of [String(value),String(Math.round(value*1e6)/1e6)]){if(values.has(key)&&values.get(key)!==label)throw Error('Ambiguous placeholder '+key);values.set(key,label);}}
    add(d.v,'Geschwindigkeit');add(d.s0,'Anfangsabstand');add(d.elapsed,'Zeitspanne in Stunden');add(d.elapsed*60,'Zeitspanne in Minuten');
    add(d.firstT,'erste Beobachtungszeit in Stunden');add(d.firstT*60,'erste Beobachtungszeit in Minuten');
    add((d.firstT+d.elapsed)*60,'zweite Beobachtungszeit in Minuten');
    add(d.v*d.elapsed,'zusätzlich zurückgelegte Strecke');
    if(type!==4){add(d.s0+d.v*d.firstT,'Position bei der ersten Beobachtung');add(d.s0+d.v*(d.firstT+d.elapsed),'Position bei der zweiten Beobachtung');}
    add(d.v*d.firstT,'Strecke bis zur ersten Beobachtung');
    add(d.targetT,'gesuchte Zeit in Stunden');add(d.targetT*60,'gesuchte Zeit in Minuten');
    // The deliberately distinct sample values never equal the constant 60.
    function replace(text){
      return String(text).replaceAll('08:23','[erste Uhrzeit]').replaceAll('09:02','[zweite Uhrzeit]')
        .replace(/(?<![\w])\d+(?:[.,]\d+)?(?![\w])/g,n=>values.has(n.replace(',','.'))?'['+values.get(n.replace(',','.'))+']':n);
    }
    function visualMarkdown(v){
      const lines=['**Visuelle Hilfe: '+v.title+'**'];
      if(v.rows)for(const row of v.rows)lines.push(`${row.label}: ${row.from} → ${row.to}. ${row.change}`);
      else if(v.kind==='journey')lines.push(`${v.from} ${v.back?'←':'→'} ${v.to}`,v.travel,v.time);
      else for(const item of v.items)lines.push(`${item.label}: ${item.value}`);
      lines.push(v.note);return lines.map(line=>'> '+replace(line)).join('\n>\n');
    }
    const steps=names.map((name,offset)=>{
      const step=offset-1;if(step>=0&&!Motion.requiredSteps(task).includes(step))return null;
      if(step>=0)name=(Motion.requiredSteps(task).indexOf(step)+1)+'. '+name.slice(3);
      const hints=step===-1?Motion.preparationHints(task):Motion.hints(task,step);
      return '### '+name+'\n\n'+hints.map((hint,i)=>'**Tipp '+(i+1)+'**\n\n'+replace(hint)+'\n\n'+visualMarkdown(context.teachingVisual(task,step,i+1))).join('\n\n');
    }).filter(Boolean);
    const situations=templates.slice(type*4,type*4+4).map(t=>'### Situation: '+t.title.split(' – ')[1]+'\n\n'+t.text).join('\n\n');
    return '## '+template.title.split(' – ')[0]+'\n\n'+situations+'\n\nDie folgenden Tipps gelten für alle vier Situationen dieses Typs.\n\n'+steps.join('\n\n');
  });
  const text='# Alle 24 Situationen mit Platzhaltern und sämtlichen Tipps\n\n'+
    'Die Übersicht ist nach den sechs Aufgabentypen gegliedert. Je Typ stehen zuerst die vier Situationstexte und danach einmal die gemeinsamen Tipps für Vorbereitung und die jeweils nötigen Teilaufgaben: jeweils alle drei Stufen mit den Inhalten der visuellen Hilfe. Insgesamt sind es 24 Situationen und 69 Tipps. Die Texte werden direkt aus den im Widget verwendeten Funktionen erzeugt. Zahlen stehen als beschreibende Platzhalter in eckigen Klammern; Einheiten, die Umrechnung durch 60 und feststehende Nullwerte bleiben erhalten.\n\n'+
    'Die Visualisierungen sind hier als lesbare Pfeilfolgen und Karteninhalte wiedergegeben. Im Widget erscheinen sie als gestaltete Skizzen. Nach einem weiteren falschen Versuch nach Tipp 3 wird die vollständige Lösung automatisch rot eingetragen, ohne Punkt. Dieser abschließende Lösungsschritt ist kein vierter Tipp.\n\n'+sections.join('\n\n---\n\n')+'\n';
  fs.writeFileSync(path.join(__dirname,'situationstexte.md'),text);
  return {situations:templates.length,types:sections.length,steps:23,hints:69};
}
module.exports={buildReview};
if(require.main===module)console.log(buildReview());
