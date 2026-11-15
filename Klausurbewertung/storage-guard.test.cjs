const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(__dirname + '/app.js','utf8');
function fixture() {
  const initial = {version:1,exams:[],currentExamId:null,taskBlockLibrary:[],classListLibrary:[]};
  const key = 'klausurbewertung.nobuild.v1';
  const map = new Map([[key,JSON.stringify(initial)]]);
  const localStorage = {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
  const root = {innerHTML:'',querySelector:()=>null};
  const context = {console,Date,JSON,Map,Set,Math,structuredClone,
    window:{localStorage,setTimeout:()=>1,clearTimeout:()=>{}},
    document:{getElementById:id=>id==='app'?root:null}};
  vm.createContext(context);
  vm.runInContext(source.slice(0,source.indexOf('  appRoot.addEventListener("click"')) +
    '\nglobalThis.api={mutateStore,safeSetStorage,getStore:()=>store,isLocked:()=>archiveLocked,setClient:c=>cloudClient=c};})();',context);
  return {api:context.api,map,key};
}
test('normal saves keep the current archive writable',()=>{
 const {api,map,key}=fixture();
 api.mutateStore(s=>({...s,taskBlockLibrary:[{id:'template',nodes:[]}]}));
 assert.equal(JSON.parse(map.get(key)).taskBlockLibrary.length,1);
 assert.equal(api.isLocked(),false);
 api.mutateStore(s=>({...s,taskBlockLibrary:[]}));
 assert.equal(JSON.parse(map.get(key)).taskBlockLibrary.length,0);
});
test('another tab writing offline blocks stale saves and invalidates in-flight sync',()=>{
 const {api,map,key}=fixture();let suspends=0;
 api.setClient({suspend(){suspends++}});
 const latest={version:1,exams:[],currentExamId:null,taskBlockLibrary:[{id:'newer',nodes:[]}],classListLibrary:[]};
 const raw=JSON.stringify(latest);map.set(key,raw);
 api.mutateStore(s=>({...s,taskBlockLibrary:[{id:'stale',nodes:[]}]}));
 assert.equal(api.isLocked(),true);assert.equal(suspends,1);
 assert.equal(map.get(key),raw);
 assert.equal(api.safeSetStorage(JSON.stringify(api.getStore())),false);
 assert.equal(map.get(key),raw);
});
