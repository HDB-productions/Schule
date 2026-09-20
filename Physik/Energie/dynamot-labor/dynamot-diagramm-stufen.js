/* Optional diagram extension; independent of the 20-point task engine. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./dynamot-aufgaben.js'));
 else root.DynamotDiagramStages=factory(root.DynamotTasks);
})(globalThis,function(Tasks){
 'use strict';
 if(!Tasks||!Array.isArray(Tasks.experiments))throw Error('DynaMot tasks must load before diagram stages');

 const experiment=id=>Tasks.experiments.find(e=>e.id===id)||null;
 const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
 const heatSources=ex=>ex.chain.flatMap((label,index)=>index%2&&label!=='Gewicht'?[index]:[]);
 const fraction=value=>typeof value==='number'&&Number.isFinite(value)&&value>=.05&&value<=.95;

 function mainCorrect(ex,value){
  return !!ex&&object(value)&&Array.isArray(value.main)&&value.main.length===ex.chain.length&&
   value.main.every((token,index)=>object(token)&&token.kind===(index%2?'device':'energy')&&token.label===ex.chain[index]);
 }
 function legalBranches(ex,branches,requireFraction){
  if(!Array.isArray(branches))return false;
  const allowed=new Set(heatSources(ex)),seen=new Set();
  for(const branch of branches){
   if(!object(branch)||!Number.isInteger(branch.from)||!allowed.has(branch.from)||seen.has(branch.from)||branch.energy!=='thermische Energie')return false;
   if(requireFraction&& !fraction(branch.fraction))return false;
   if(!requireFraction&&branch.fraction!==undefined&&!fraction(branch.fraction))return false;
   seen.add(branch.from);
  }
  return true;
 }
 function basicCorrect(id,value){
  const ex=experiment(id);
  return mainCorrect(ex,value)&&Array.isArray(value.branches)&&value.branches.length===0;
 }
 function lossesCorrect(id,value){
  const ex=experiment(id);
  return mainCorrect(ex,value)&&legalBranches(ex,value.branches,true)&&value.branches.length===heatSources(ex).length;
 }
 function seed(id,legacyValue){
  const ex=experiment(id);
  if(!ex)throw Error('Unknown DynaMot experiment');
  const main=ex.chain.map((label,index)=>({kind:index%2?'device':'energy',label}));
  const branches=[],allowed=new Set(heatSources(ex)),seen=new Set();
  for(const branch of Array.isArray(legacyValue?.branches)?legacyValue.branches:[]){
   if(!object(branch)||!Number.isInteger(branch.from)||!allowed.has(branch.from)||seen.has(branch.from)||branch.energy!=='thermische Energie')continue;
   const share=branch.fraction===undefined?.25:branch.fraction;
   if(!fraction(share))continue;
   branches.push({from:branch.from,energy:'thermische Energie',fraction:share});
   seen.add(branch.from);
  }
  return {main,branches};
 }
 function validateExtensions(record,engineState){
  if(record===undefined)return true;
  if(!object(record)||!object(engineState)||!Array.isArray(engineState.completed))throw Error('Invalid diagram extension state');
  for(const [id,entry]of Object.entries(record)){
   const ex=experiment(id);
   if(!ex||!engineState.completed.includes(id+'.diagram')||!object(entry)||typeof entry.completed!=='boolean'||!mainCorrect(ex,entry.value)||!legalBranches(ex,entry.value.branches,true)||entry.completed&&!lossesCorrect(ex.id,entry.value))throw Error('Invalid diagram extension: '+id);
  }
  return true;
 }
 return {basicCorrect,lossesCorrect,seed,validateExtensions};
});
