// Build the optional plain-answer adapter without the score/state bridge.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const files={
 '/* EDULO_ANSWER_BRIDGE */':path.resolve(__dirname,'../../tools/edulo/runtime/answer.js'),
 '/* QR_ENCODER */':path.join(__dirname,'vendor/qrcode.js'),
 '/* APP_JS */':path.join(__dirname,'app.js'),
 '/* APP_CSS */':path.join(__dirname,'app.css')
};
let html=fs.readFileSync(path.join(__dirname,'widget.quelle.html'),'utf8');
for(const [marker,file] of Object.entries(files)){
 if(html.split(marker).length!==2)throw Error('Marker fehlt oder mehrfach: '+marker);
 let code=fs.readFileSync(file,'utf8');
 if(marker==='/* QR_ENCODER */'){
  const license=fs.readFileSync(path.join(__dirname,'vendor/LICENSE-qrcode.txt'),'utf8');
  code='/* '+license.replace(/\*\//g,'* /')+' */\nconst createLoginQr=(function(define,exports,module){\n'+code+'\nreturn qrcode;\n})();';
 }
 if(file.endsWith('.js')){new vm.Script(code);code=code.replace(/<\/script/gi,'<\\/script');}
 else if(/<\/style/i.test(code))throw Error('CSS enthält HTML-Endtag.');
 html=html.replace(marker,()=>code);
}
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);
fs.writeFileSync(path.join(__dirname,'widget.html'),html,'utf8');
console.log('Gebaut: '+path.join(__dirname,'widget.html'));
