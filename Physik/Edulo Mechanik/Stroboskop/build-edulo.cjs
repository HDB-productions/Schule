// Small editor HTML + native Edulo auxiliary files. Original single-file build stays available.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib'),crypto=require('node:crypto');
const dir=__dirname;
async function build({singleJS=false}={}){
 const out=path.join(dir,singleJS?'edulo-upload-eine-datei':'edulo-upload-toyota');
 const esbuild=require(path.resolve(dir,'../../../.edulo-tools/cloudflare/node_modules/esbuild'));
 fs.mkdirSync(out,{recursive:true});
 const raw=fs.readFileSync(path.join(dir,'assets/Toyota-Corolla.glb')),packed=zlib.gzipSync(raw,{level:9});
 if(!zlib.gunzipSync(packed).equals(raw))throw Error('Die Modelldaten wurden verändert.');
 const modelName='stroboskop-toyota-v3.bin',scriptName=singleJS?'stroboskop-komplett-v4.js':'stroboskop-3d-v3.js';
 if(!singleJS)fs.writeFileSync(path.join(out,modelName),packed);
 const metadata=fs.readFileSync(path.join(dir,'assets/Toyota-Corolla-metadata.json'),'utf8');
 const template=fs.readFileSync(path.join(dir,'widget.quelle.html'),'utf8');
 const opening=template.indexOf('>',template.indexOf('<main'))+1;
 const markup=template.slice(opening,template.indexOf('<script>',opening)).replace('/* APP_CSS */',fs.readFileSync(path.join(dir,'app.css'),'utf8'));
 const snippet='<!-- EDULO_WIDGET_KEY:stroboskop-ki-v1 -->\n<main class="edulo-widget strobe-lesson" data-edulo-id="stroboskop-ki-v1"><p role="status">Stroboskop-Widget wird geladen …</p></main>\n<!-- widgetInit_stroboskopKI -->\n';
 const sources=['task.js','domain.js','motion-model.js','analog-clock.js','ball-3d.js','scene-3d.js','visuals.js','ui.js'];
 const browserSource=name=>fs.readFileSync(path.join(dir,name),'utf8').replace(/^if\s*\(typeof module[^\n]*module\.exports[^\n]*$/gm,'');
 const bridge=fs.readFileSync(path.resolve(dir,'../../../tools/edulo/runtime/footer.js'),'utf8')+'\n'+fs.readFileSync(path.resolve(dir,'../../../tools/edulo/runtime/bridge.js'),'utf8');
 const code=`(()=>{'use strict';
 ${require('./bundle-three.cjs').bundleThree()}
 ${singleJS?'const STROBE_LAZY=true;\nconst STROBE_3D_CAR='+JSON.stringify(packed.toString('base64'))+';':browserSource('edulo-files.js')}
 const markup=${JSON.stringify(markup)};
 const STROBE_CAR_METADATA=${metadata};
 window.widgetInit_stroboskopKI=function(moduleId,data,actions,callbacks,stats,parameters){
  const container=moduleId?document.getElementById(moduleId):document;
  const root=container?.querySelector('[data-edulo-id="stroboskop-ki-v1"]');
  if(!root||root.dataset.eduloInitialized)return;
  root.dataset.eduloInitialized='1';root.innerHTML=markup;
  const q=selector=>root.querySelector(selector);
  ${singleJS?'':`let STROBE_MODEL_URL;
  try{STROBE_MODEL_URL=resolveStroboskopModelURL(moduleId,{standaloneURL:parameters?.modelURL||null});}
  catch(error){root.replaceChildren(Object.assign(document.createElement('p'),{textContent:error.message}));return;}`}
  ${bridge}
  ${sources.map(browserSource).join('\n')}
  requestAnimationFrame(()=>{try{window.widget?.refreshScrollbars?.();}catch{}});
 };
})();`;
 new vm.Script(code);
 const minified=await esbuild.transform(code,{loader:'js',minify:true,target:'es2022',legalComments:'none'});
 const license=fs.readFileSync(path.resolve(dir,'../../Energie/dynamot-labor/dynamot-3d-vendor/LICENSE'),'utf8');
 const notice='/*\nThree.js MIT license\n'+license+'\n3D car: 2014 Toyota Corolla E180 EU (with interior) by Armored Wave, CC BY 4.0.\nhttps://sketchfab.com/3d-models/2014-toyota-corolla-e180-eu-with-interior-36f95efb0585464cae43a25a3b3392e8\nhttps://creativecommons.org/licenses/by/4.0/\n*/\n';
 fs.writeFileSync(path.join(out,scriptName),notice+minified.code);
 fs.writeFileSync(path.join(out,'html-code.html'),snippet);
 fs.writeFileSync(path.join(out,'vorschau.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stroboskopbilder – Dateipaket</title><body>'+snippet+'<script src="'+scriptName+'"></script><script>widgetInit_stroboskopKI(null,null,null,null,null,'+(singleJS?'{}':'{modelURL:new URL("'+modelName+'",document.baseURI).href}')+');</script></body></html>');
 const instructions=`STROBOSKOP-WIDGET – TOYOTA-FASSUNG\n\nAlte Zusatzdateien stroboskop-3d-v2.js und stroboskop-mercedes-v2.bin im HTML-Modul durch die folgenden Dateien ersetzen. Nicht beide Fassungen gleichzeitig zuordnen.\n\n1. Nur den vollständigen Inhalt von html-code.html in das Feld „HTML-Code“ kopieren.\n2. Als Zusatzdatei 1 stroboskop-3d-v3.js auswählen/hochladen.\n3. Über „+ hinzufügen“ als Zusatzdatei 2 stroboskop-toyota-v3.bin auswählen/hochladen.\n4. E1/E2 und „mit Überprüfung: nein“ wie bisher beibehalten.\n\nKeine der großen Dateien als Text in den Editor kopieren. Die .bin-Datei nicht entpacken, umbenennen oder als HTML öffnen. Das JavaScript lädt Edulo automatisch; die Modelladresse kommt aus Edulos eigener Dateifunktion. Keine externe Hosting-Adresse nötig.\n\nDas Modell wird erst beim ersten Start einer Animation geladen. Der erste Start kann deshalb etwas dauern. Im Editor wird es nicht geladen. Beide Autospuren teilen sich die geladenen Modelldaten. Das Toyota-Modell ersetzt den Mercedes. Seine Texturen sind für die kleine Darstellung optimiert. Physik, Lernstände und Punkte bleiben erhalten.\n\nwidget.html ist die eigenständige lokale Komplettvorschau. Für Edulo ausschließlich dieses neue Dateipaket verwenden. vorschau.html lässt sich über einen lokalen HTTP-Server testen; direkt über file:// kann der Browser das Nachladen der .bin-Datei blockieren.\n\nPrüfstand: Automatisierte Prüfung gegen den Originalcode eines lokal vorhandenen Edulo-html_and_files-Moduls und simulierte Edulo-Speicherung. Die aktuelle installierte Edulo-Version und ein physisches Tablet müssen separat geprüft werden.\n`;
 fs.writeFileSync(path.join(out,'ANLEITUNG.txt'),instructions+'\nEINSTELLUNGEN\n„mit Überprüfung“: nein. „mit Kursdaten“ kann wie bisher auf nein bleiben. Unter „Parameter“ nichts ergänzen.\nFalls die Speicherfelder noch fehlen: E1 als unbegrenztes Textfeld; E2 mit 20 unabhängigen Lücken, Lösung jeweils 1 und je ein Punkt. Die ersten 14 Punkte werden genutzt.\n\nNach dem Speichern in die eigene Lernansicht wechseln und „Zeitlupe starten“ anklicken. Im Bearbeitungsmodus bleiben die Animationen bewusst ausgeschaltet.\n\nHTML-CODE ZUM KOPIEREN (vollständig):\n'+snippet);
 const report={vehicle:'Toyota Corolla E180',htmlBytes:Buffer.byteLength(snippet),scriptBytes:fs.statSync(path.join(out,scriptName)).size,modelBytes:packed.length,decodedModelBytes:raw.length,decodedModelSHA256:crypto.createHash('sha256').update(raw).digest('hex'),inlineHTMLBytes:fs.statSync(path.join(dir,'widget.html')).size,gzipRoundtripExact:true,textureOptimization:'Reduced to at most 512 pixels and WebP encoded; see Toyota-Corolla-optimization.json'};
 report.delivery=singleJS?'single-js-attachment':'js-and-bin-attachments';report.externalModelFile=!singleJS;
 fs.writeFileSync(path.join(out,'build-report.json'),JSON.stringify(report,null,2));
 fs.copyFileSync(path.join(dir,'assets/Toyota-Corolla-CREDITS.md'),path.join(out,'MODELL-LIZENZ.md'));
 if(singleJS){
  fs.writeFileSync(path.join(out,'html-code.txt'),snippet);
  fs.writeFileSync(path.join(out,'ANLEITUNG.txt'),'STROBOSKOP – EINE JAVASCRIPT-ZUSATZDATEI\n\n1. Nur den vollständigen Inhalt von html-code.txt in das Feld HTML-Code kopieren (213 Byte).\n2. Alle bisherigen Zusatzdatei-Zuordnungen dieses HTML-Moduls entfernen.\n3. Als einzige Zusatzdatei stroboskop-komplett-v4.js hochladen/auswählen. Nicht ihren Inhalt in den HTML-Editor kopieren. Keine BIN-Datei erforderlich.\n4. Mit Überprüfung: nein. Mit Kursdaten: nein. Keine zusätzlichen Parameter. E1/E2 wie bisher beibehalten.\n5. Speichern und in der Lernansicht die Zeitlupe starten.\n\nModell, Texturen und Darstellung sind gegenüber dem bisherigen Toyota bytegleich. Die Grafik wird erst beim ersten Start aufgebaut; im Editor bleibt sie ausgeschaltet. Das Modell ist bereits in der JavaScript-Datei enthalten, es wird keine weitere Modelldatei geladen.\n\nLokal wird der Originalcode des archivierten Edulo-Moduls getestet; der reale Upload und ältere Tablets sind separat zu prüfen.\n\nHTML-CODE:\n'+snippet);
 }
 console.log(JSON.stringify(report));return report;
}
module.exports={build};if(require.main===module)build().catch(error=>{console.error(error);process.exitCode=1;});
