'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Motion=require('./domain.js');
const task={...Motion.generate(0,()=>0),v:72,s0:8,targetT:1.5,answer:116};
const accepted=(step,inputs)=>{for(const input of inputs)assert.equal(Motion.check(task,step,input).ok,true,input);};
const rejected=(step,inputs)=>{for(const input of inputs)assert.equal(Motion.check(task,step,input).ok,false,input);};

test('numeric answers accept arithmetic and preserve quantities in natural division',()=>{
  accepted(0,['36 km / 0,5 h','36 km ÷ 0,5 h','36 km / (0,5 h)','(54 km - 18 km) / (0,75 h - 0,25 h)','(36 / 0,5) km/h','72000 m / 1 h','144 km/h / 2','144 km / 2 / h','72 km/h / 2 * 2','36 km / (30 / 60) h']);
  accepted(1,['20 km - 12 km','44 km - 72 km/h · 0,5 h','(44 - 36) km','16000 m / 2','(2+2)·2 km']);
  accepted(3,['72 km/h · 1,5 h + 8 km','8 km + 216 km / 2','(72 * 1,5 + 8) km']);
});

test('speed answers require converting minute and second units to hours',()=>{
  for(const input of ['1,2 km/min','20 m/s','36 km / 30 min','36000 m / 1800 s','36 km / (30 min / 60)']){
    const result=Motion.check(task,0,input);assert.equal(result.ok,false,input);assert.match(result.message,/Stunden/);assert.match(result.message,/60/);
  }
  accepted(0,['36 km / (30/60) h','72 km/h']);
});

test('wrong dimensions and explicit operator precedence cannot fake a correct answer',()=>{
  rejected(0,['72','72 km','72 h','36 km / 0,5 * h','72 km/h + 0 h','36 km / (0,5 h * h)']);
  rejected(1,['8','8 km/h','8 h','8 km + 1 h','8 km * h']);
  rejected(3,['116','116 km/h','72 km/h*t+8 km','72 km/h*1,5+8 km']);
});

test('affine formulas retain units, grouping and implicit multiplication',()=>{
  accepted(2,['72 km/h·t+8 km','(36 km / 0,5 h)*t+8 km','(36+36)km/h(t)+8km','8km+t*72km/h','(72km*t)/h+8000m','72km/h*t + (16÷2)km']);
  rejected(2,['72*t+8','72km/h*t*t+8km','72km/h/t+8km','72km/h*t+8h']);
});

test('parser rejects unsafe syntax, division by zero and excessive nesting',()=>{
  for(const step of [0,1,2,3])rejected(step,['globalThis.process.exit()','constructor.constructor("return 1")()','8km;alert(1)','8km[0]','8km**1','8km/0','8km/(2-2)','8km+','(8km','8km)',`${'('.repeat(34)}8km${')'.repeat(34)}`,'9'.repeat(201)]);
});
