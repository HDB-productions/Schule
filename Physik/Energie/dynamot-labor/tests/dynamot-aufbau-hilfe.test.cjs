const assert=require('node:assert/strict'),{next}=require('../dynamot-aufbau-hilfe.js');
for(const mode of ['v1','v4','v2','v3']){
 const state={activeMode:mode,devices:[],wires:[],buildLocked:false};
 assert.deepEqual(next(state),{text:'Platziere hier einen DynaMot.',kind:'slot',id:'M1'});
 state.devices.push({id:5,type:'motor',slot:'M1'});assert.equal(next(state).action,mode==='v4'?'attach-weight':'attach-crank');
 state.devices[0][mode==='v4'?'weight':'crank']=true;
 const lamp=['v1','v4'].includes(mode);assert.equal(next(state).id,lamp?'L1':'M2');
 state.devices.push({id:8,type:lamp?'lamp':'motor',slot:lamp?'L1':'M2'});
 if(!lamp){assert.equal(next(state).action,mode==='v3'?'attach-weight':'attach-crank');state.devices[1][mode==='v3'?'weight':'crank']=true;}
 assert.equal(next(state).pin,0);assert.equal(next(state,{a:5,ap:0}).id,8);assert.equal(next(state,{a:5,ap:0}).pin,lamp?1:0);assert.equal(next(state,{a:8,ap:lamp?1:0}).id,5);
 state.wires.push({a:8,ap:lamp?1:0,b:5,bp:0});assert.equal(next(state).pin,1);
 state.wires.push({a:5,ap:1,b:8,bp:lamp?0:1});assert.equal(next(state).kind,undefined);
 if(lamp){state.wires=[{a:5,ap:0,b:8,bp:0}];assert.equal(next(state,{a:5,ap:1}).pin,1,'finish legacy partial cable pairing');state.wires.push({a:5,ap:1,b:8,bp:1});assert.equal(next(state).kind,undefined,'legacy crossed build accepted');}
 state.buildLocked=true;assert.equal(next(state),null);
}
assert.equal(next({activeMode:'free'}),null);
console.log('Build hints: all four builds, restored partial state, reversed cable storage, pending endpoint, lock and free mode passed.');
