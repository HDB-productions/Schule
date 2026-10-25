'use strict';
const assert = require('node:assert/strict');
const A = require('./algebra.js');
const E = s => A.equation(s);
const Q = (n,d=1) => A.q(n,d);
const V = (x,c) => [Q(x),Q(c)];
const equalEquation = (actual,expected) => assert.deepEqual(actual,E(expected));

assert.deepEqual(Q(12,-18),[-2n,3n]);
assert.deepEqual(A.add(Q(1,3),Q(1,6)),Q(1,2));
assert.deepEqual(A.mul(Q(-2,3),Q(9,4)),Q(-3,2));
assert.deepEqual(A.div(Q(7,10),Q(14,5)),Q(1,4));
assert.deepEqual(A.parse('(x + 2)/3 - 0,5x'),[Q(-1,6),Q(2,3)]);
assert.deepEqual(A.parse('−(2x − 3) + 4·x'),[Q(2),Q(3)]);
assert.deepEqual(A.parse(':(2)'.slice(1)),[Q(0),Q(2)]);
assert.equal(A.analyze('2(x+3)').issue,'brackets');
assert.equal(A.analyze('-(x+3)').issue,'minusBracket');
assert.equal(A.analyze('(x+3)/2').issue,'divideBracket');
assert.equal(A.analyze('x+x').issue,'x');
assert.equal(A.analyze('2+3').issue,'numbers');
assert.equal(A.analyze('x/1').issue,'calculate');
assert.equal(A.analyze('2x+3').issue,null);
assert.throws(() => A.parse('x*x'),/Nichtlineare/);
assert.throws(() => A.parse('2/x'),/Nenner/);
assert.throws(() => A.parse('1/0'),/null/);
assert.throws(() => A.parse('x²'),/Schreibweise/);
assert.throws(() => E('x=1=2'),/genau einem/);

equalEquation(A.operate(E('7x-7=2x+5'),'-2x'),'5x-7=5');
equalEquation(A.operate(E('7x-7=2x+5'),'+7'),'7x=2x+12');
equalEquation(A.operate(E('7x-7=2x+5'),'*0,5'),'3,5x-3,5=x+2,5');
equalEquation(A.operate(E('7x-7=2x+5'),'|:(-2)'),'-3,5x+3,5=-x-2,5');
equalEquation(A.operate(E('x+1=3'),'+(x-2)'),'2x-1=x+1');
// Signs in a compound operation remain attached to each term.
for(const op of ['-2x-8','−2x−8','| -2x - 8','-(2x+8)','+(-2x-8)'])
  equalEquation(A.operate(E('2x=3x+8'),op),'-8=x');
for(const op of ['-2x+8','-(2x-8)','+(-2x+8)'])
  equalEquation(A.operate(E('2x=3x+8'),op),'8=x+16');
equalEquation(A.operate(E('2x=3x+8'),'+2x-8'),'4x-8=5x');
equalEquation(A.operate(E('2x=3x+8'),'-2(x+4)'),'-8=x');
equalEquation(A.operate(E('2x=3x+8'),'-2x-8',true),'8=x+16');
equalEquation(A.operate(E('2x=3x+8'),'-0,5x-3/2'),'3/2x-3/2=5/2x+13/2');
equalEquation(A.operate(E('2x=3x+8'),'-x/2+1/2'),'3/2x+1/2=5/2x+17/2');
equalEquation(A.operate(E('2x=3x+8'),'-(x+3)/2'),'3/2x-3/2=5/2x+13/2');
for(let dx=-3;dx<=3;dx++)for(let dc=-4;dc<=4;dc++){
  const signed=n=>(n<0?'':'+')+n;
  const actual=A.operate(E('2x-5=-x+3'),signed(dx)+'x'+signed(dc));
  assert.deepEqual(actual,[V(2+dx,-5+dc),V(-1+dx,3+dc)]);
}
assert.throws(() => A.operate(E('x=2'),'*0'),/null/);
assert.throws(() => A.operate(E('x=2'),':0'),/null/);
assert.throws(() => A.operate(E('x=2'),'*x'),/Zahl ohne x/);
assert.throws(() => A.operate(E('x=2'),'+x*x'),/Nichtlineare/);
assert.throws(() => A.operate(E('x=2'),':(x+1)'),/Zahl ohne x/);

assert.equal(A.classify(E('2x+1=x+4')),'unique');
assert.deepEqual(A.solution(E('2x+1=x+4')),Q(3));
assert.equal(A.classify(E('2x+1=2x+1')),'all');
assert.equal(A.solution(E('2x+1=2x+1')),null);
assert.equal(A.classify(E('2x+1=2x+2')),'none');
assert.equal(A.solution(E('2x+1=2x+2')),null);
assert.equal(A.isTerminal(E('x=3')),true);
assert.equal(A.isTerminal(E('3=x')),true);
assert.equal(A.isTerminal(E('1=2')),true);
assert.equal(A.isTerminal(E('0=0')),true);
assert.equal(A.isTerminal(E('2x=4')),false);
assert.equal(A.isTerminal(E('x+1=2')),false);
assert.equal(A.suggestOperation(E('7x-7=2x+5')),'-2x');
assert.equal(A.suggestOperation(E('3=2x+1')),'-1');
assert.equal(A.suggestOperation(E('x=3')),null);
assert.ok(A.advisory(E('7x-7=2x+5'),'+100').length);
assert.match(A.advisory(E('2x=4'),'+3').join(' '),/Term/);
assert.match(A.advisory(E('7x-7=2x+5'),'*3000000').join(' '),/größer/);
assert.match(A.advisory(E('7x-7=2x+5'),':3').join(' '),/Brüche/);
for(const useful of ['-2x','-7x','+7'])assert.deepEqual(A.advisory(E('7x-7=2x+5'),useful),[]);
assert.deepEqual(A.advisory(E('x/2+1=3x/2+5'),'*2'),[]);

function random(seed){let state=seed>>>0;return () => ((state=(Math.imul(1664525,state)+1013904223)>>>0)/4294967296);}
const examples=new Set();
for(const [index,kind] of ['unique','all','none'].entries()){
  const rng=random(0xabc124+index*997);
  for(let i=0;i<1000;i++){
    const source=A.generate(kind,rng),e=E(source),initialSolution=A.solution(e);
    assert.equal(A.classify(e),kind,source);
    assert.equal(A.isTerminal(e),false,source);
    assert.match(source,/x/);
    assert.ok(source.includes('(')||source.split('x').length>3,source);
    if(i<30)examples.add(source.replace(/-?\d+/g,'#'));
    let current=e,steps=0;
    while(!A.isTerminal(current)&&steps<6){
      const op=A.suggestOperation(current);
      assert.ok(op,source);
      current=A.operate(current,op);
      assert.equal(A.classify(current),kind,`${source} | ${op}`);
      assert.deepEqual(A.solution(current),initialSolution);
      steps++;
    }
    assert.ok(A.isTerminal(current),source);
    if(kind==='unique')assert.ok(A.same(current[0],[A.one,A.z])||A.same(current[1],[A.one,A.z]));
    else assert.ok(A.zero(current[0][0])&&A.zero(current[1][0]));
  }
}
assert.ok(examples.size>=6,`only ${examples.size} structural variants`);
assert.throws(() => A.generate('other',random(1)),/Unbekannter/);
console.log('Algebra: rational parsing, operations, hints and 3000 generated equations passed.');
