// Extract the actual archived Edulo html_and_files implementation, unchanged.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const originalDirectory=path.resolve(__dirname,'../../../Chemie/Edulo Stoffeigenschaften/Widget_224342_Aggregatzustnde.wdgt');
const jqueryPath=path.join(originalDirectory,'libs/jquery-2.1.1.min.js');
function getOriginalHtmlModuleSource(){
  const source=fs.readFileSync(path.join(originalDirectory,'all_modules.js'),'utf8');
  const start=source.indexOf('function(){var s=new AModule("html_and_files")');
  const end=start<0?-1:source.indexOf(',function(){var n=new AModule("image")',start);
  if(start<0||end<0)throw Error('Original Edulo html_and_files module boundaries were not found.');
  const originalModule=source.slice(start,end);
  const prelude='function AModule(name){this.name=name;if(name==="html_and_files")window.fixtureHtmlModule=this;}\nwindow.FastClick=window.FastClick||{attach:function(){}};\n';
  const script=prelude+';('+originalModule+');\n';
  new vm.Script(script,{filename:'original-edulo-html-and-files.fixture.js'});
  return script;
}
module.exports={getOriginalHtmlModuleSource,jqueryPath};
