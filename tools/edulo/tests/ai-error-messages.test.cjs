const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const sources=['Physik/Kernphysik/ionisierende-strahlung/ui.js','Physik/Edulo Mechanik/Freier-Fall/ui.js','Physik/Edulo Mechanik/Newtonsche-Gesetze/ui.js','Physik/Edulo Mechanik/Stroboskop/ui.js'];
for(const source of sources){
 const code=fs.readFileSync(path.join(root,source),'utf8');
 const fn=code.match(/function errorMessage\(data,status\)\{[\s\S]*?\n\}/)?.[0];assert(fn,source);
 const errorMessage=vm.runInNewContext('('+fn+')');
 for(const [code,pattern] of [['account_frozen',/Konto.*gesperrt/],['upstream_busy',/Anfragelimit.*API-Guthaben/],['upstream_rate_limited',/zu viele Anfragen/],['upstream_quota',/API-Guthaben oder API-Limit/],['not_configured',/nicht vollständig eingerichtet/]]){
  const message=errorMessage({error:{code}},503);assert.match(message,pattern,source);assert(message.endsWith('Fehlercode: '+code+'.'));
  if(code.startsWith('upstream_'))assert(!message.includes('eingerichtet'),source);
 }
 assert.match(errorMessage({},503),/vorübergehend nicht verfügbar/);
 assert.match(errorMessage({error:{code:'<img>'}},503),/vorübergehend nicht verfügbar/);
 assert(!errorMessage({error:{code:'<img>'}},503).includes('<img>'));
 assert.match(errorMessage({},402),/Wochenlimit/);
}
// The older access-code widget has the same service messages in its submit handler.
const legacy=fs.readFileSync(path.join(root,'Edulo/Freitext-KI/app.js'),'utf8');
const mapping=vm.runInNewContext('('+legacy.match(/const serviceMessages=(\{[^\n]+\});/)[1]+')');
for(const code of ['upstream_busy','upstream_rate_limited','upstream_quota','not_configured'])assert(mapping[code]);
console.log('KI error messages: 4 lesson widgets and access-code widget passed.');
