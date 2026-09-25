const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../learning.js'),'utf8');
const hints=vm.runInNewContext(source.slice(0,source.indexOf('/* Flaschenrakete'))+'ROCKET_HINT_LEVELS');
assert.equal(hints.length,6);
for(const stages of hints){assert([3,4].includes(stages.length));for(const text of stages){assert(text.split(/\s+/).length<=26,'each stage at most26 words');assert((text.match(/[.!?]/g)||[]).length<=2,'one or two sentences');assert.doesNotMatch(text,/richtige Antwort|Lösung ist|wähle (chemische|thermische|kinetische|Lageenergie)/i);}}
assert.match(hints[0][3],/Zucker mit Sauerstoff in andere Stoffe/);assert.deepEqual(Array.from(hints,x=>x.length),[4,3,3,3,3,4]);assert.match(hints[2][0],/Druck/);assert.match(hints[4][0],/Höhe/);assert.match(hints[5][3],/größeren Geschwindigkeit/);
console.log('PASS: six compact hint sequences, <=26words and <=2sentences per stage, approved clue counts and situational hints.');
