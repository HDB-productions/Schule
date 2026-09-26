const test=require('node:test'),assert=require('node:assert/strict'),M=require('./domain.js');
function state(index){const s=M.fresh();s.index=index;s.task=M.generate(index,()=>.3);s.prep.inputs=M.preparation(s.task).cells.map(()=> '');s.prep.cursors=s.prep.inputs.map(()=>0);return s;}
function ready(s){s.prep.inputs=M.preparation(s.task).cells.map(c=>c.unit==='clock'?c.expected:`${c.expected} ${c.unit}`);s.prep.cursors=s.prep.inputs.map(x=>x.length);s.prep.done=true;return s;}
test('only missing quantities are asked, supplied values earn no duplicate points',()=>{
 const sequences=[[0,2,3],[0,1,2,3],[0,2,3],[1,2,3],[2,3],[2,3]];
 for(let n=0;n<6;n++){const s=ready(state(n));assert.deepEqual(M.requiredSteps(s.task),sequences[n]);for(let i=0;i<4;i++)if(!sequences[n].includes(i))assert.equal(M.completeStep(s,i),false);
 for(const i of sequences[n]){s.steps[i].input=M.canonicalAnswer(s.task,i);s.steps[i].cursor=s.steps[i].input.length;assert(M.completeStep(s,i));assert(M.validate(s));}
 assert.equal(s.total,sequences[n].length);assert(M.nextSituation(s));assert(M.validate(s));}
});
test('clock duration is independently checked and symbols are visible in row labels',()=>{
 const s=ready(state(2)),p=M.preparation(s.task);assert.match(p.cells[0].label,/s₀/);assert.match(p.cells[3].label,/Δs/);assert.match(p.cells[4].label,/Δt/);assert.equal(p.cells[4].unit,'min');
 s.prep.inputs[4]='0 min';assert(!M.checkPreparation(s.task,s.prep.inputs).ok);s.prep.inputs[4]=`${s.task.data.elapsed*60} min`;assert(M.checkPreparation(s.task,s.prep.inputs).ok);
});
test('schema two clock drafts preserved; completed preparation gains duration without points',()=>{
 for(const done of [false,true]){const old=done?ready(state(2)):state(2);old.schema=2;old.prep.inputs.pop();old.prep.cursors.pop();if(!done){old.prep.inputs[1]='08:';old.prep.cursors[1]=3;old.prep.activeCell=1;old.prep.hint=2;}
 const raw=JSON.stringify(old);assert(M.validate(old));const now=M.upgrade(old);assert.equal(JSON.stringify(old),raw);assert(M.validate(now));assert.equal(now.schema,3);assert.equal(now.total,0);assert.deepEqual(now.prep.inputs.slice(0,4),old.prep.inputs);assert.equal(now.prep.inputs[4],done?`${old.task.data.elapsed*60} min`:'');assert.equal(now.prep.hint,old.prep.hint);}
});
