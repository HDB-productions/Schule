const {test}=require('node:test');
const assert=require('node:assert/strict');
const {parseNumber,correct,graph,regression}=require('../dist/exercises.js');
test('German and scientific numeric inputs, rejecting invalid/trailing text',()=>{
  for(const [s,n] of [[' 1,25 ',1.25],['.5',.5],['−2,5',-2.5],['1e-3',.001],['0',0]])assert.equal(parseNumber(s),n);
  for(const s of ['', ' ', '1 m', '1,2,3','Infinity','NaN','1.000,5','1/2','0x10','3text'])assert.ok(Number.isNaN(parseNumber(s)),s);
});
test('Answers require full multi-selection and valid numbers',()=>{
  assert.equal(correct({type:'number',answer:0},''),false);
  assert.equal(correct({type:'number',answer:1.5,tolerance:.001},'1,5'),true);
  assert.equal(correct({type:'number',answer:1.5,tolerance:.001},'1,502'),false);
  const f={type:'multi',answer:['A1','B3']};
  assert.equal(correct(f,['B3','A1']),true);assert.equal(correct(f,['A1']),false);assert.equal(correct(f,['A1','B3','C2']),false);
});
test('Graph includes bars, finite reciprocal path and escaped labels',()=>{
  const s=graph({points:[[2,4]],bars:[{x:2,low:3,high:5}],curve:{kind:'antiproportional',a:8},xMax:10,yMax:10,xStep:1,yStep:1,xLabel:'<unsafe>'});
  assert.ok(!s.includes('NaN'));assert.ok(!s.includes('Infinity'));assert.ok(s.includes('&lt;unsafe&gt;'));assert.ok(s.includes('V250'));
});
test('Significant figures preserve necessary zeroes and support scientific notation',()=>{
  const f={type:'number',answer:1.2,significantDigits:3};
  assert.equal(correct(f,'1,20'),true);assert.equal(correct(f,'1,2'),false);assert.equal(correct(f,'1,200'),false);
  assert.equal(correct({...f,answer:1200},'1.20e3'),true);
  assert.equal(correct({...f,answer:.005},'0,00500'),true);
  assert.equal(correct({...f,answer:-1.2},'−1,20'),true);
  assert.equal(correct({...f,decimalOnly:true},'1.20e0'),false);
});
test('Physical equation text accepts equivalent unit syntax but not wrong symbols',()=>{
  assert.equal(correct({type:'text',answer:'s(t)'},' s ( t ) '),true);
  assert.equal(correct({type:'text',answer:'s(t)'},'y(x)'),false);
  assert.equal(correct({type:'text',answer:'m/s²',accepted:['m/s²','m/(s²)']},'m / (s^2)'),true);
  assert.equal(correct({type:'text',answer:'m/s²'},'m/s'),false);
});

test('regression preview fits actual points and collapses quadratic fits to straight lines',()=>{
  const points=[-3,-1,0,2,4].map(x=>[x,2*x*x+3*x+4]);
  const quadratic=regression(points,'quadratisch');
  for(const [key,v] of Object.entries({a:2,b:3,c:4}))assert.ok(Math.abs(quadratic[key]-v)<1e-9);
  const line=regression(points.map(([x])=>[x,3*x+2]),'linear');
  assert.ok(Math.abs(line.a-3)<1e-9);assert.ok(Math.abs(line.b-2)<1e-9);
  assert.equal(regression(points.map(([x])=>[x,3*x+2]),'quadratisch').a,0);
  const prop=regression(points,'proportional');
  assert.ok(Math.abs(points.reduce((sum,[x,y])=>sum+x*(y-prop.a*x),0))<1e-8);
  const spec={points,xMin:-4,xMax:5,yMin:0,yMax:60,curve:quadratic};
  assert.match(graph({...spec,pointsOnly:true}),/path d="" fill="none" stroke="#b95324"/);
  assert.doesNotMatch(graph(spec),/path d="" fill="none" stroke="#b95324"/);
});
