const assert=require('node:assert/strict');
const {test}=require('node:test');
const {solveDynamotNetwork:solve}=require('../dynamot-stromnetz.js');

const C={k:.18,R:2,lampR:8,wireR:.05};
const source=()=>({id:1,type:'motor',omega:20});
const lamp=(id,lampR=8)=>({id,type:'lamp',lampR});
const wire=(a,ap,b,bp)=>({a,ap,b,bp});
const near=(actual,expected,tolerance=1e-10)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≠ ${expected}`);
const energyBalance=(devices,wires)=>near([...devices,...wires].reduce((sum,x)=>sum+x.power,0),0);
const series=(r2=8,r3=8)=>({devices:[source(),lamp(2,r2),lamp(3,r3)],wires:[wire(1,0,2,0),wire(2,1,3,0),wire(3,1,1,1)]});
const parallel=(r2=8,r3=8)=>({devices:[source(),lamp(2,r2),lamp(3,r3)],wires:[wire(1,0,2,0),wire(2,1,1,1),wire(1,0,3,0),wire(3,1,1,1)]});
const mixed=()=>({devices:[source(),lamp(2),lamp(3),lamp(4)],wires:[wire(1,0,2,0),wire(2,1,3,0),wire(3,1,1,1),wire(1,0,4,0),wire(4,1,1,1)]});

test('equal lamps in series carry one current and dissipate equal power',()=>{
 const {devices,wires}=series();solve(devices,wires,C);
 const expected=.18*20/(2+8+8+3*.05);
 near(devices[1].current,expected);near(devices[2].current,expected);
 near(devices[1].power,8*expected**2);near(devices[2].power,devices[1].power);
 energyBalance(devices,wires);
});

test('unequal series lamps carry one current; the higher resistance dissipates more power',()=>{
 const {devices,wires}=series(8,24);solve(devices,wires,C);
 near(devices[1].current,devices[2].current);
 near(devices[2].power/devices[1].power,3);
 energyBalance(devices,wires);
});

test('equal parallel lamps share branch current and power; each exceeds its series counterpart',()=>{
 const p=parallel(),s=series();solve(p.devices,p.wires,C);solve(s.devices,s.wires,C);
 const branchCurrent=3.6/(8+2*.05+2*(2));
 near(p.devices[1].current,branchCurrent);near(p.devices[2].current,branchCurrent);
 near(p.devices[1].power,p.devices[2].power);
 assert(p.devices[1].power>s.devices[1].power);
 energyBalance(p.devices,p.wires);
});

test('unequal parallel lamps see nearly the same branch voltage; lower resistance is brighter',()=>{
 const {devices,wires}=parallel(8,24);solve(devices,wires,C);
 const branch8=8+2*.05,branch24=24+2*.05;
 near(devices[1].current/devices[2].current,branch24/branch8);
 assert(devices[1].power>devices[2].power);
 const sourceTerminal=Math.abs(devices[0].voltage);
 near(sourceTerminal,devices[1].voltage+2*C.wireR*devices[1].current);
 near(sourceTerminal,devices[2].voltage+2*C.wireR*devices[2].current);
 energyBalance(devices,wires);
});

test('two-lamp series branch parallel to one lamp: both series lamps equal and dimmer than the single lamp',()=>{
 const {devices,wires}=mixed();solve(devices,wires,C);
 const [generator,a,b,single]=devices;
 near(a.current,b.current);near(a.power,b.power);
 assert(single.current>a.current);
 assert(single.power>a.power*3.9);
 near(-generator.current,a.current+single.current);
 energyBalance(devices,wires);
});

test('opening only the series branch extinguishes its two lamps; the independent parallel lamp stays lit',()=>{
 const {devices,wires}=mixed();wires.splice(1,1);solve(devices,wires,C);
 assert.equal(devices[1].current,0);assert.equal(devices[1].power,0);
 assert.equal(devices[2].current,0);assert.equal(devices[2].power,0);
 assert(devices[3].power>0);
 energyBalance(devices,wires);
});

test('bypassing one series lamp leaves a tiny finite power there and lights the other two lamps',()=>{
 const {devices,wires}=mixed();solve(devices,wires,C);
 const before={b:devices[2].power,single:devices[3].power};
 wires.push(wire(2,0,2,1));solve(devices,wires,C);
 assert(devices[1].power>0&&devices[1].power<.0001);
 assert(devices[2].power>before.b);
 assert(devices[3].power>0&&devices[3].power<before.single);
 near(wires.at(-1).current/devices[1].current,8/.05);
 energyBalance(devices,wires);
});
