const test=require('node:test'),assert=require('node:assert/strict');
const {resolveStroboskopModelURL:resolve}=require('./edulo-files.js');
function own(overrides={}){return {id:'own',JSON:{id:12,type:'html_and_files',html:'<!-- EDULO_WIDGET_KEY:stroboskop-ki-v1 -->',files:[{url:'Nutzer/Größe ü/stroboskop-toyota-v3.bin'}]},...overrides};}
function host(contents=[own()],resolver=url=>'native-media:'+url){return {forEachContent(fn){contents.forEach(fn);},getMediaURLPath:resolver};}

test('resolves the own module file through the host using the untouched UTF-8 URL',()=>{
  let received;const raw=own().JSON.files[0].url;
  const h=host([own({id:'other',JSON:{id:99,type:'html_and_files',html:'other widget',files:[{url:'wrong/stroboskop-toyota-v3.bin'}]}}),own()],url=>{received=url;return 'edulo-native:opaque/path';});
  assert.equal(resolve('own',{host:h}),'edulo-native:opaque/path');assert.equal(received,raw);
});
test('accepts JSON id and module.name as the native alternate module descriptors',()=>{
  const c=own();delete c.JSON.type;c.module={name:'html_and_files'};
  assert.equal(resolve(12,{host:host([c])}),'native-media:'+c.JSON.files[0].url);
});
test('does not rewrite HTTP, file or opaque media API results',()=>{
  for(const url of ['https://example.test/model?q=ü','http://localhost:8765/model','file:///C:/App/model','native-model:opaque-key'])assert.equal(resolve('own',{host:host([own()],()=>url)}),url);
});
test('missing, duplicate, foreign or unmarked module is rejected without fallback',()=>{
  for(const contents of [[],[own(),own()],[own({JSON:{type:'image',html:'EDULO_WIDGET_KEY:stroboskop-ki-v1'}})],[own({JSON:{type:'html_and_files',html:'foreign'}})]])assert.throws(()=>resolve('own',{host:host(contents),standaloneURL:'https://example.test/forbidden-fallback'}));
  assert.throws(()=>resolve('own',{host:{},standaloneURL:'https://example.test/model'}),/Edulo-Inhalte/);
});
test('requires one exact model basename among the own module attachments',()=>{
  for(const files of [[],[{url:'stroboskop-toyota-v3.bin.js'}],[{url:'prefix-stroboskop-toyota-v3.bin'}],[{url:'a/stroboskop-toyota-v3.bin'},{url:'b/stroboskop-toyota-v3.bin'}]]){const c=own();c.JSON.files=files;assert.throws(()=>resolve('own',{host:host([c])}),/Zusatzdatei/);}
  const c=own();c.JSON.files=[{url:'ü/stroboskop-toyota-v3.bin?token=raw#hash'}];assert.equal(resolve('own',{host:host([c],url=>url)}),c.JSON.files[0].url);
});
test('missing, failing or empty media resolver yields a readable error',()=>{
  const absent=host();delete absent.getMediaURLPath;
  assert.throws(()=>resolve('own',{host:absent}),/Medien-Dateiauflösung/);
  for(const resolver of [()=>{throw Error('private internals');},()=>'',()=>null])assert.throws(()=>resolve('own',{host:host([own()],resolver)}),/Edulo/);
});
test('standalone mode requires an explicit absolute local-preview URL',()=>{
  for(const url of ['https://example.test/model','http://localhost:8000/model','file:///C:/model.bin','blob:https://example.test/uuid'])assert.equal(resolve(null,{host:null,standaloneURL:url}),url);
  for(const url of [null,'','relative.bin','javascript:alert(1)','data:text/plain,model'])assert.throws(()=>resolve(null,{host:null,standaloneURL:url}));
});
