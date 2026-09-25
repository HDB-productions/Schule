/* Self-contained 2-D bottle rocket scene. Embedded by app.js during the widget build. */
function createRocketSimulation(host, options = {}) {
  if (!host || typeof host.querySelector !== 'function') throw new Error('Simulationsbereich fehlt.');
  const COLORS = {chemical:'#f6ae58', kinetic:'#6cd1a0', thermal:'#f27770', potential:'#bc97eb'};
  const LEGEND_FORMS = [['chemical','chemische Energie'],['kinetic','kinetische Energie'],['thermal','thermische Energie'],['potential','Lageenergie']];
  const legendNames = Object.fromEntries(LEGEND_FORMS.map(([form])=>[form,options.legendNames?.[form] ?? !!options.legendLabelsVisible]));
  const MAX_STROKES = 5;
  let phase = 'ready', strokes = 0, queued = 0, energyVisible = !!options.energyVisible, efficiencyVisible = !!options.efficiencyVisible, legendLabelsVisible=Object.values(legendNames).every(Boolean);
  let frame = 0, strokeStart = 0, flightStart = 0, destroyed = false;
  const strokeTimes=Array(MAX_STROKES).fill(null);
  const doc = host.ownerDocument;
  const style = doc.createElement('style');
  style.textContent = `
    .rocket-scene{background:#eaf4fb;border:1px solid #b8d3e4;border-radius:15px;padding:9px;color:#18384a}
    .rocket-scene *{box-sizing:border-box}
    .rocket-scene__viewport{width:100%;max-width:850px;margin:auto;position:relative}
    .rocket-scene svg{display:block;width:100%;height:auto;max-height:410px;border-radius:10px;background:#dff1fc;touch-action:manipulation}
    .rocket-scene [data-person]{cursor:pointer}
    .rocket-scene [data-person]:focus-visible{outline:none;filter:drop-shadow(0 0 5px #b77900)}
    .rocket-scene__controls{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 3px 0}
    .rocket-scene__controls button{min-height:44px;padding:8px 14px;border-radius:9px;border:1px solid #185277;background:#21679b;color:#fff;font:600 15px system-ui,sans-serif;cursor:pointer;touch-action:manipulation}
    .rocket-scene__controls button[aria-pressed=true]{background:#145573}
    .rocket-scene__controls button:disabled{opacity:.55;cursor:default}
    .rocket-scene__controls button:focus-visible{outline:3px solid #d58310;outline-offset:2px}
    .rocket-scene__status{font:600 14px/1.35 system-ui,sans-serif;flex:1 1 220px;margin:0}
    .rocket-scene__caption{font:13px/1.35 system-ui,sans-serif;margin:5px 4px 0;color:#36586a}
    .rocket-scene [data-energy-group][hidden]{display:none}
    .rocket-scene [data-efficiency-button][hidden]{display:none}
    .rocket-scene [data-energy-group]{pointer-events:none}
    .rocket-scene__legend{position:absolute;right:1%;top:23%;width:18%;padding:8px;background:#ffffffeb;border:1px solid #b8d3e4;border-radius:8px;font:14px/1.3 system-ui,sans-serif;color:#18384a}
    .rocket-scene__legend strong{display:block;margin-bottom:6px;font-size:15px}
    .rocket-scene__legend-list{display:grid;gap:7px}
    .rocket-scene__legend-item{display:grid;grid-template-columns:19px minmax(0,1fr) 32px;align-items:center;gap:4px;min-width:0;overflow-wrap:normal}
    .rocket-scene__legend-e{display:grid;place-items:center;flex:none;width:19px;height:19px;border:1px solid #315165;border-radius:2px;font-size:12px;font-weight:800}
    .rocket-scene [data-energy-legend][hidden]{display:none}
    .rocket-scene [data-legend-labels][hidden]{visibility:hidden;display:block}
    .rocket-scene [data-legend-labels-button]{display:flex;align-items:center;justify-content:center;gap:5px;width:32px;min-height:40px;margin:0;padding:2px;border:1px solid #185277;border-radius:6px;background:#edf7fc;color:#164a69;font:700 13px system-ui,sans-serif;cursor:pointer}
    .rocket-scene [data-legend-labels-button]:focus-visible{outline:3px solid #d58310;outline-offset:2px}
    .rocket-scene [data-legend-labels-button][aria-pressed=true]{background:#d4ebf7}
    @media(max-width:700px){.rocket-scene__legend{position:static;width:auto;margin:8px 3px 0;font-size:14px}.rocket-scene__legend-list{grid-template-columns:1fr;gap:8px}.rocket-scene__legend-e{width:20px;height:20px}}
    @media(max-width:600px){.rocket-scene{padding:5px}.rocket-scene__controls{gap:6px}.rocket-scene__controls button{padding:7px 9px;font-size:14px}.rocket-scene__status{flex-basis:100%}}
  `;
  host.classList.add('rocket-scene');
  host.append(style);
  const PACKET_SIDE=28;
  // Visible teaching-model fractions, deliberately not measured efficiencies.
  const LOSS={muscle:.20,pump:.20,start:.20,ascent:.20,fall:.20};
  const LOSS_STAGES=Object.keys(LOSS);
  const packetsMarkup = Array.from({length:MAX_STROKES},(_,i)=>`<g data-packet-id="${i}" data-form="chemical" transform="translate(149 220)"><rect x="-9" y="-9" width="18" height="18" rx="2" fill="${COLORS.chemical}" stroke="#315165" stroke-width="1.2"/><text text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="800" fill="#18384a">E</text></g>`).join('');
  const lossesMarkup=Array.from({length:MAX_STROKES},(_,i)=>LOSS_STAGES.map(stage=>`<g data-loss-id="${i}:${stage}" data-form="thermal" style="opacity:0"><rect fill="${COLORS.thermal}" stroke="#315165" stroke-width=".8" rx="1"/><text text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="800" fill="#18384a">E</text></g>`).join('')).join('');
  host.insertAdjacentHTML('beforeend', `
    <div class="rocket-scene__viewport">
      <svg viewBox="0 0 850 400" role="img" aria-labelledby="rocket-scene-title rocket-scene-desc" preserveAspectRatio="xMidYMid meet">
        <title id="rocket-scene-title">Flaschenrakete mit Standpumpe</title>
        <desc id="rocket-scene-desc">Eine Person pumpt durch einen Schlauch und eine Ballpumpennadel Luft in eine kopfüber stehende, zu einem Drittel mit Wasser gefüllte Flasche. Nach fünf Hüben startet sie nach oben und fällt wieder.</desc>
        <defs>
          <linearGradient id="rocket-sky" x2="0" y2="1"><stop stop-color="#bde6fd"/><stop offset="1" stop-color="#effaff"/></linearGradient>
          <clipPath id="rocket-bottle-clip"><path d="M-34 -100 L-38 -94 L-38 38 Q-37 50 -18 61 L-10 69 L-10 78 L10 78 L10 69 L18 61 Q37 50 38 38 L38 -94 L34 -100 Z"/></clipPath>
        </defs>
        <rect width="850" height="400" fill="url(#rocket-sky)"/>
        <circle cx="754" cy="55" r="27" fill="#fff6c0" opacity=".8"/>
        <path d="M0 337 Q220 325 420 337 T850 337 V400 H0Z" fill="#85c49e"/>
        <path d="M0 351 H850" stroke="#50866d" stroke-width="4"/>
        <text x="15" y="29" font-size="19" font-weight="700" fill="#205069">Luft hinein · Wasser hinaus · Rakete hinauf</text>
        <g data-person tabindex="0" role="button" aria-label="Einmal pumpen" aria-disabled="false">
          <path d="M111 270 L99 335 M137 272 L155 335" stroke="#34495c" stroke-width="16" stroke-linecap="round"/>
          <path d="M85 337 Q94 331 107 337 M145 337 Q156 331 168 337" stroke="#343e49" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M108 213 Q122 206 140 216 L142 269 Q124 279 106 268 Z" fill="#e35d55" stroke="#8e4740" stroke-width="2"/>
          <path d="M108 267 Q123 272 142 267" fill="none" stroke="#ffd181" stroke-width="5"/>
          <circle cx="118" cy="189" r="21" fill="#f4b887" stroke="#8e6550" stroke-width="2"/>
          <circle cx="98" cy="190" r="5" fill="#f4b887" stroke="#8e6550" stroke-width="1.5"/>
          <path d="M96 187 Q95 157 117 160 Q139 159 141 184 Q132 177 124 177 Q110 174 98 185 Z" fill="#694b3e"/>
          <circle cx="126" cy="187" r="1.8" fill="#352d2b"/><path d="M136 191 L139 195 L135 196" stroke="#9f6555" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M127 201 Q133 205 139 200" fill="none" stroke="#934e51" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M108 218 Q95 233 103 255 Q106 259 112 259" stroke="#f4b887" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path data-arm d="M139 219 Q157 215 174 232 Q193 219 219 194" stroke="#f4b887" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse data-muscle cx="159" cy="225" rx="22" ry="13" fill="#f4b887" stroke="#ad7460" stroke-width="1.5"/>
          <circle data-hand cx="219" cy="194" r="7" fill="#f4b887" stroke="#a86f5b" stroke-width="1"/>
          <text x="68" y="375" font-size="17" fill="#234b5f">Pumpe antippen</text>
        </g>
        <g data-pump>
          <rect x="204" y="327" width="78" height="13" rx="5" fill="#42536a"/>
          <rect x="236" y="215" width="14" height="114" rx="5" fill="#778da1" stroke="#405973" stroke-width="2"/>
          <rect x="238" y="194" width="10" height="87" fill="#c7d7e2" stroke="#405973" stroke-width="2"/>
          <g data-pump-handle><path d="M210 193 H276" stroke="#334b63" stroke-width="10" stroke-linecap="round"/><path d="M243 196 V224" stroke="#334b63" stroke-width="6"/></g>
          <text x="215" y="375" font-size="17" fill="#234b5f">Standpumpe</text>
        </g>
        <path data-hose-path d="M250 308 Q328 329 394 308 Q478 270 568 328" fill="none" stroke="#23526c" stroke-width="9" stroke-linecap="round"/>
        <path d="M250 308 Q328 329 394 308 Q478 270 568 328" fill="none" stroke="#b9e4ee" stroke-width="3" stroke-linecap="round"/>
        <path d="M568 329 V308" stroke="#596675" stroke-width="5"/>
        <text x="410" y="286" font-size="17" fill="#234b5f">Schlauch</text>
        <g data-launcher>
          <path d="M525 338 L541 302 M611 338 L595 302 M525 338 H611" fill="none" stroke="#586e7d" stroke-width="7" stroke-linecap="round"/>
          <path d="M553 311 H583" stroke="#586e7d" stroke-width="6"/>
          <text x="590" y="371" font-size="17" fill="#234b5f">Startplatz</text>
        </g>
        <g data-bottle-position transform="translate(568 227)">
          <g data-bottle-rotate>
            <path d="M-34 -100 L-38 -94 L-38 38 Q-37 50 -18 61 L-10 69 L-10 78 L10 78 L10 69 L18 61 Q37 50 38 38 L38 -94 L34 -100 Z" fill="#effbff" fill-opacity=".72" stroke="#3e758a" stroke-width="4"/>
            <g clip-path="url(#rocket-bottle-clip)">
              <path data-water-shape d="M-43 17 Q-15 11 0 17 T43 17 V81 H-43 Z" fill="#43b6e1" opacity=".8"/>
              <path data-water-surface d="M-40 18 Q-17 11 0 17 T40 17" fill="none" stroke="#d8f9ff" stroke-width="4"/>
              <g data-bubbles></g>
            </g>
            <path d="M-36 -91 H36" stroke="#6e9aaa" stroke-width="4"/>
            <path d="M-10 67 H10" stroke="#317a95" stroke-width="3"/>
            <text x="-30" y="-28" font-size="17" font-weight="700" fill="#1b607b">LUFT</text>
            <text data-water-label x="-31" y="47" font-size="14" font-weight="700" fill="#125d83">WASSER</text>
          </g>
        </g>
        <g data-cork><path d="M558 306 L578 306 L581 321 L555 321 Z" fill="#c99a5e" stroke="#805e3f" stroke-width="2"/><path d="M568 328 V282" stroke="#5c7180" stroke-width="3" stroke-linecap="round"/><path d="M566 283 L568 278 L570 283" fill="#5c7180"/></g>
        <text data-needle-label x="612" y="315" font-size="15" fill="#234b5f">Ballpumpennadel</text>
        <g data-exhaust style="display:none"><path data-water-jet d="M568 301 Q548 326 536 342 M568 302 Q572 327 578 347 M569 304 Q584 322 604 336" fill="none" stroke="#38aee2" stroke-width="8" stroke-linecap="round"/><circle cx="532" cy="344" r="4" fill="#38aee2"/><circle cx="586" cy="351" r="4" fill="#38aee2"/></g>
        <g data-energy-group aria-label="Fünf bewegliche Energiequadrate">${lossesMarkup}${packetsMarkup}</g>
      </svg>
      <aside class="rocket-scene__legend" data-energy-legend ${energyVisible?'':'hidden'} aria-label="Legende zu den Energiequadraten"><strong>Legende</strong><div class="rocket-scene__legend-list">${LEGEND_FORMS.map(([form,label],index)=>`<div class="rocket-scene__legend-item" data-legend-form="${form}"><span class="rocket-scene__legend-e" style="background:${COLORS[form]}">E</span><span data-legend-labels ${legendNames[form]?'':'hidden'}>${label}</span><button type="button" data-legend-labels-button="${form}" aria-pressed="${legendNames[form]}" aria-label="Name der Energieform ${index+1} ${legendNames[form]?'verbergen':'anzeigen'}"><span aria-hidden="true">👁</span></button></div>`).join('')}</div></aside>
    </div>
    <div class="rocket-scene__controls">
      <button type="button" data-pump-button>Einmal pumpen</button>
      <button type="button" data-reset-button>Neustart</button>
      <button type="button" data-energy-button aria-pressed="${energyVisible}">Energiequadrate ${energyVisible?'ausblenden':'einblenden'}</button>
      <button type="button" data-efficiency-button aria-pressed="${efficiencyVisible}" ${energyVisible?'':'hidden'}>Wirkungsgrade einblenden</button>
      <p class="rocket-scene__status" data-sim-status role="status" aria-live="polite"></p>
    </div>
    <p class="rocket-scene__caption">Schematisches Unterrichtsmodell: Ein Klick löst einen vollständigen Pumphub aus. Nach fünf Hüben startet die Flasche.</p>
  `);
  const find = selector => host.querySelector(selector);
  const person = find('[data-person]'), button = find('[data-pump-button]'), resetButton = find('[data-reset-button]'), energyButton = find('[data-energy-button]'), efficiencyButton=find('[data-efficiency-button]'), legendLabelsButtons=[...host.querySelectorAll('[data-legend-labels-button]')];
  const bottle = find('[data-bottle-position]'), rotate = find('[data-bottle-rotate]'), cork = find('[data-cork]'), exhaust = find('[data-exhaust]');
  const water = find('[data-water-shape]'), waterSurface = find('[data-water-surface]'), waterLabel = find('[data-water-label]'), needleLabel = find('[data-needle-label]');
  const bubbles = find('[data-bubbles]'), handle = find('[data-pump-handle]'), arm = find('[data-arm]'), hand = find('[data-hand]'), muscle = find('[data-muscle]');
  const hose = find('[data-hose-path]'), packetNodes = [...host.querySelectorAll('[data-packet-id]')];
  const lossNodes = Object.fromEntries([...host.querySelectorAll('[data-loss-id]')].map(node=>[node.dataset.lossId,node]));
  const packetStates = Array.from({length:MAX_STROKES},(_,id)=>({id,form:'chemical',x:0,y:0,visible:true,amount:1}));
  const lossStates = Object.fromEntries(Object.keys(lossNodes).map(id=>[id,{id,amount:0,visible:false,emitted:false}]));
  let sceneLift=0, sceneTilt=0, sceneDrop=0;
  const status = find('[data-sim-status]');
  const raf = callback => (doc.defaultView || window).requestAnimationFrame(callback);
  const caf = id => (doc.defaultView || window).cancelAnimationFrame(id);
  const now = () => (doc.defaultView || window).performance.now();
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const ease = t => t*t*(3-2*t);
  function ascendingLift(elapsed){
    if(elapsed<650){const t=clamp(elapsed/650,0,1);return 44*t*t;}
    const coast=clamp(elapsed-650,0,1050), initialSpeed=88/650;
    return 44+initialSpeed*coast*(1-coast/2100);
  }
  const lerp=(a,b,t)=>a+(b-a)*clamp(t,0,1);
  const musclePosition=(i,down=0)=>({x:140+(i%3)*24,y:216+Math.floor(i/3)*26+down*8});
  const airPosition=i=>({x:544+(i%3)*24,y:160+Math.floor(i/3)*26});
  function rocketPosition(localX,localY){
    const angle=sceneTilt*Math.PI/180;
    return {x:568+localX*Math.cos(angle)-localY*Math.sin(angle),
      y:227-sceneLift+sceneDrop+localX*Math.sin(angle)+localY*Math.cos(angle)};
  }
  function drawPacket(id,x,y,form,visible=true,amount=1){
    const node=packetNodes[id],state=packetStates[id];
    state.x=+x.toFixed(1);state.y=+y.toFixed(1);state.form=form;state.visible=visible;state.amount=amount;
    node.setAttribute('transform',`translate(${state.x} ${state.y})`);
    node.dataset.x=String(state.x);node.dataset.y=String(state.y);node.dataset.form=form;node.dataset.amount=String(amount);
    node.style.opacity=visible?'1':'0';
    const side=PACKET_SIDE*Math.sqrt(amount),rect=node.querySelector('rect'),label=node.querySelector('text');
    rect.setAttribute('x',String(-side/2));rect.setAttribute('y',String(-side/2));rect.setAttribute('width',String(side));rect.setAttribute('height',String(side));rect.setAttribute('fill',COLORS[form]);
    label.setAttribute('font-size',String(Math.max(8,side*.65)));
  }
  function flightPose(elapsed){
    if(elapsed<1700)return {lift:ascendingLift(elapsed),tilt:0,drop:0};
    if(elapsed<2050)return {lift:115,tilt:0,drop:0};
    if(elapsed<3700){const t=clamp((elapsed-2050)/1650,0,1);return {lift:115*(1-t*t),tilt:170*ease(clamp(t*2,0,1)),drop:24*t*t};}
    return {lift:0,tilt:170,drop:24};
  }
  function rocketPositionAt(elapsed,localX,localY){
    const {lift,tilt,drop}=flightPose(elapsed),angle=tilt*Math.PI/180;
    return {x:568+localX*Math.cos(angle)-localY*Math.sin(angle),y:227-lift+drop+localX*Math.sin(angle)+localY*Math.cos(angle)};
  }
  function waterPositionAt(elapsed){
    const start=rocketPositionAt(elapsed,airPosition(4).x-568,airPosition(4).y-227);
    const nozzle=rocketPositionAt(elapsed,0,76);
    const t=clamp((elapsed-100)/550,0,1);
    return {x:lerp(start.x,nozzle.x+9,t),y:lerp(start.y,350,t)};
  }
  function waterCrossing(){
    let low=100,high=650;
    for(let n=0;n<24;n++){
      const mid=(low+high)/2;
      if(waterPositionAt(mid).y>=rocketPositionAt(mid,0,76).y)high=mid;else low=mid;
    }
    return high;
  }
  const waterExitAt=waterCrossing();
  // Continuous deterministic dispersion, with no collection point. Coordinates may
  // leave the SVG; the energy amount remains in the balance outside the viewport.
  const HEAT_DRIFT_MS=60000;
  function heatPosition(source,age,seed){
    const t=Math.max(0,age)/1000,phase=seed*2.399963;
    const vx=Math.sin(phase)*18,vy=9+(Math.cos(phase*1.7)+1)*4;
    const envelope=1-Math.exp(-t/1.5);
    let dx=vx*t+5*(Math.sin(t*.9+phase)-Math.sin(phase))*envelope;
    if(dx>0){const room=Math.max(1,680-source.x);dx=room*Math.tanh(dx/room);}
    return {x:source.x+dx,y:source.y-vy*t+4*(Math.sin(t*.7+phase)-Math.sin(phase))*envelope};
  }
  function drawLoss(id,stage,source,age,amount){
    const key=`${id}:${stage}`,node=lossNodes[key],state=lossStates[key];
    state.amount=amount;state.emitted=amount>0;state.visible=age>=0&&amount>0;
    node.dataset.amount=String(amount);
    if(!state.visible){node.style.opacity='0';return;}
    const side=PACKET_SIDE*Math.sqrt(amount),position=heatPosition(source,age,1+id*5+LOSS_STAGES.indexOf(stage));
    node.setAttribute('transform',`translate(${position.x.toFixed(1)} ${position.y.toFixed(1)})`);
    node.style.opacity='1';
    node.querySelector('text').setAttribute('font-size',String(side*.65));
    const rect=node.querySelector('rect');rect.setAttribute('x',String(-side/2));rect.setAttribute('y',String(-side/2));rect.setAttribute('width',String(side));rect.setAttribute('height',String(side));
  }
  function energyAmount(id,events){
    let amount=1;
    for(const stage of LOSS_STAGES){
      const event=events[stage],active=!!event&&event.age>=0&&efficiencyVisible;
      const loss=active?amount*LOSS[stage]:0;
      drawLoss(id,stage,event?.source||{x:0,y:0},event?.age??-1,loss);
      amount-=loss;
    }
    return amount;
  }
  function renderPackets(time=now()){
    const elapsed=phase==='ready'||phase==='pumping'?0:Math.max(0,time-flightStart);
    const strokeProgress=phase==='pumping'?clamp((time-strokeStart)/1200,0,1):0;
    const down=phase==='pumping'?(1-Math.cos(strokeProgress*Math.PI*2))/2:0;
    for(let i=0;i<MAX_STROKES;i++){
      const muscle=musclePosition(i,down),air=airPosition(i);
      if(phase==='ready'||phase==='pumping'){
        const p=strokeProgress;
        const eventTime=strokeTimes[i];
        const events=eventTime===null?{}:{muscle:{age:time-eventTime-1200*.06,source:{x:170,y:226}},pump:{age:time-eventTime-1200*.43,source:{x:250,y:285}}};
        const amount=energyAmount(i,events);
        if(i<strokes){drawPacket(i,air.x,air.y,'thermal',true,amount);continue;}
        if(i>strokes||phase==='ready'){drawPacket(i,muscle.x,muscle.y,'chemical',true,amount);continue;}
        const wristY=194+down*45;
        if(p<.22){const t=p/.22;drawPacket(i,lerp(muscle.x,219,t),lerp(muscle.y,wristY,t),p<.06?'chemical':'kinetic',true,amount);}
        else if(p<.35){const t=(p-.22)/.13;drawPacket(i,lerp(219,243,t),lerp(wristY,240,t),'kinetic',true,amount);}
        else if(p<.48){const t=(p-.35)/.13;drawPacket(i,lerp(243,250,t),lerp(240,308,t),p<.43?'kinetic':'thermal',true,amount);}
        else if(p<.80){const t=(p-.48)/.32,length=hose.getTotalLength();const point=hose.getPointAtLength(length*t);drawPacket(i,point.x,point.y,'thermal',true,amount);}
        else if(p<.91){const t=(p-.80)/.11;drawPacket(i,568,lerp(328,278,t),'thermal',true,amount);}
        else{const t=(p-.91)/.09;drawPacket(i,lerp(568,air.x,t),lerp(278,air.y,t),'thermal',true,amount);}
        continue;
      }
      const startAt=i===4?waterExitAt:i*90+30;
      const airLocal={x:air.x-568,y:air.y-227};
      const endLocal={x:-25+i*17,y:-32+(i%2)*24};
      const events={
        muscle:{age:time-strokeTimes[i]-1200*.06,source:{x:170,y:226}},
        pump:{age:time-strokeTimes[i]-1200*.43,source:{x:250,y:285}},
        start:{age:elapsed-startAt,source:i===4?waterPositionAt(waterExitAt):rocketPositionAt(startAt,lerp(airLocal.x,endLocal.x,clamp((startAt-i*90)/450,0,1)),lerp(airLocal.y,endLocal.y,clamp((startAt-i*90)/450,0,1)))},
        ascent:i===4?null:{age:elapsed-(700+i*230),source:rocketPositionAt(700+i*230,endLocal.x,endLocal.y)},
        fall:i===4?null:{age:elapsed-(2150+i*320),source:rocketPositionAt(2150+i*320,endLocal.x,endLocal.y)}
      };
      const amount=energyAmount(i,events);
      if(i===4){
        const start=rocketPosition(air.x-568,air.y-227);
        if(elapsed<100){drawPacket(i,start.x,start.y,'thermal',true,amount);continue;}
        const t=clamp((elapsed-100)/550,0,1);
        const nozzle=rocketPosition(0,76);
        const x=elapsed>=650?577:lerp(start.x,nozzle.x+9,t), y=lerp(start.y,350,t);
        // At the nozzle the water carries kinetic energy; after ground contact its energy spreads into the surroundings.
        const impact=heatPosition({x:577,y:350},elapsed-650,31);
        drawPacket(i,elapsed>=650?impact.x:x,elapsed>=650?impact.y:y,elapsed>=650?'thermal':y>=nozzle.y?'kinetic':'thermal',true,amount);
        continue;
      }
      const localStart={x:air.x-568,y:air.y-227};
      const localEnd={x:-25+i*17,y:-32+(i%2)*24};
      const move=clamp((elapsed-i*90)/450,0,1);
      const position=rocketPosition(lerp(localStart.x,localEnd.x,move),lerp(localStart.y,localEnd.y,move));
      let form='thermal';
      if(elapsed>i*90+30)form='kinetic';
      if(elapsed>=700+i*230&&phase!=='falling'&&phase!=='landed')form='potential';
      if(phase==='falling'&&elapsed<2150+i*320)form='potential';
      if(phase==='falling'&&elapsed>=2150+i*320)form='kinetic';
      if(phase==='landed')form='thermal';
      const release=heatPosition(position,elapsed-3700,36+i);
      drawPacket(i,phase==='landed'?release.x:position.x,phase==='landed'?release.y:position.y,form,true,amount);
    }
  }
  function hasPendingStrokeHeat(time){
    return efficiencyVisible&&strokeTimes.some(start=>start!==null&&time<start+1200*.43+HEAT_DRIFT_MS);
  }
  function getState(){return {phase,strokes,queued,energyVisible,efficiencyVisible,legendLabelsVisible,legendNames:{...legendNames},animationActive:!!frame,flightElapsed:['launching','apex','falling','landed'].includes(phase)?Math.max(0,now()-flightStart):null,waterExitAt,packets:packetStates.map(packet=>({...packet})),losses:Object.values(lossStates).map(loss=>({...loss}))};}
  function setEnergyVisible(value){
    energyVisible = !!value;
    if(energyVisible)find('[data-energy-group]').removeAttribute('hidden');
    else find('[data-energy-group]').setAttribute('hidden','');
    find('[data-energy-legend]').hidden=!energyVisible;
    efficiencyButton.hidden=!energyVisible;
    energyButton.setAttribute('aria-pressed',String(energyVisible));
    energyButton.textContent = `Energiequadrate ${energyVisible?'ausblenden':'einblenden'}`;
    if(typeof options.onEnergyChange === 'function') options.onEnergyChange(energyVisible);
    renderPackets();
  }
  function setEfficiencyVisible(value){
    efficiencyVisible=!!value;
    efficiencyButton.setAttribute('aria-pressed',String(efficiencyVisible));
    efficiencyButton.textContent='Wirkungsgrade einblenden';
    if(typeof options.onEfficiencyChange==='function')options.onEfficiencyChange(efficiencyVisible);
    renderPackets();
    if(!frame&&phase==='ready'&&hasPendingStrokeHeat(now()))frame=raf(tick);
  }
  function setLegendLabelsVisible(value,form){
    const forms=form?[form]:LEGEND_FORMS.map(([key])=>key);
    for(const key of forms){
      if(!(key in legendNames))continue;
      legendNames[key]=!!value;
      const row=find(`[data-legend-form="${key}"]`),button=row.querySelector('button');
      row.querySelector('[data-legend-labels]').hidden=!value;
      button.setAttribute('aria-pressed',String(!!value));
      button.setAttribute('aria-label',`Name der Energieform ${LEGEND_FORMS.findIndex(([id])=>id===key)+1} ${value?'verbergen':'anzeigen'}`);
    }
    legendLabelsVisible=Object.values(legendNames).every(Boolean);
    if(typeof options.onLegendLabelsChange==='function')options.onLegendLabelsChange(legendLabelsVisible,{...legendNames});
  }
  function updateStatus(){
    let message = `${strokes} von ${MAX_STROKES} Pumphüben`;
    if(phase==='pumping') message += queued?` · ${queued} weiterer ${queued===1?'Hub':'Hübe'} vorgemerkt`:' · ein Hub läuft';
    if(phase==='launching') message = 'Der Korken löst sich. Wasser strömt nach unten und die Rakete steigt.';
    if(phase==='apex') message = 'Die Flasche erreicht den höchsten Punkt.';
    if(phase==='falling') message = 'Die Flasche fällt wieder.';
    if(phase==='landed') message = 'Flug beendet. Mit „Neustart“ kannst du erneut pumpen.';
    status.textContent = message;
    button.disabled = strokes + queued + (phase==='pumping'?1:0) >= MAX_STROKES || !['ready','pumping'].includes(phase);
    person.setAttribute('aria-disabled',String(button.disabled));
    host.dataset.phase = phase;
    host.dataset.strokes = String(strokes);
    host.dataset.queued = String(queued);
    renderPackets();
  }
  function setBubbles(progress){
    if(progress<0){bubbles.innerHTML='';return;}
    const count = 4 + Math.min(strokes,4);
    bubbles.innerHTML = Array.from({length:count},(_,i)=>{
      const x = -24+(i*17)%49;
      const y = 61-((progress*90+i*17)%65);
      const r = 2+(i%3);
      return `<circle cx="${x}" cy="${y.toFixed(1)}" r="${r}" fill="#eafcff" fill-opacity=".85" stroke="#54a9cf" stroke-width="1"/>`;
    }).join('');
  }
  function startStroke(time){
    phase='pumping';strokeStart=time;strokeTimes[strokes]=time;updateStatus();
    if(!frame) frame=raf(tick);
  }
  function pump(){
    if(destroyed || strokes+queued+(phase==='pumping'?1:0)>=MAX_STROKES || !['ready','pumping'].includes(phase))return false;
    queued++;
    if(phase==='ready'){queued--;startStroke(now());}
    updateStatus();
    return true;
  }
  function tick(time){
    frame=0;
    if(destroyed)return;
    if(phase==='pumping'){
      const progress=clamp((time-strokeStart)/1200,0,1);
      const down=(1-Math.cos(progress*Math.PI*2))/2;
      handle.setAttribute('transform',`translate(0 ${Math.round(down*45)})`);
      const wristY=Math.round(194+down*45),elbowY=Math.round(232+down*8);
      arm.setAttribute('d',`M139 219 Q157 215 174 ${elbowY} Q193 ${elbowY-13} 219 ${wristY}`);
      hand.setAttribute('cy',String(wristY));
      muscle.setAttribute('cy',String(Math.round(225+down*8)));
      setBubbles(progress);
      if(progress>=1){
        strokes++;
        handle.removeAttribute('transform');
        arm.setAttribute('d','M139 219 Q157 215 174 232 Q193 219 219 194');hand.setAttribute('cy','194');muscle.setAttribute('cy','225');
        if(strokes===MAX_STROKES){queued=0;phase='launching';flightStart=time;exhaust.style.display='';}
        else if(queued>0){queued--;strokeStart=time;strokeTimes[strokes]=time;}
        else {phase='ready';setBubbles(-1);}
        updateStatus();
      }
    }
    if(['launching','apex','falling'].includes(phase)){
      const elapsed=time-flightStart;
      let lift=0,tilt=0;
      if(elapsed<1700){phase='launching';lift=ascendingLift(elapsed);tilt=0;exhaust.style.display=elapsed<650?'':'none';}
      else if(elapsed<2050){phase='apex';lift=115;tilt=0;exhaust.style.display='none';}
      else if(elapsed<3700){phase='falling';const t=clamp((elapsed-2050)/1650,0,1);lift=115*(1-t*t);tilt=170*ease(clamp(t*2,0,1));}
      else {phase='landed';lift=0;tilt=170;exhaust.style.display='none';setBubbles(-1);}
      const landingDrop=phase==='falling'?24*Math.pow(clamp((elapsed-2050)/1650,0,1),2):phase==='landed'?24:0;
      sceneLift=lift;sceneTilt=tilt;sceneDrop=landingDrop;
      bottle.setAttribute('transform',`translate(568 ${Math.round(227-lift+landingDrop)})`);
      rotate.setAttribute('transform',`rotate(${Math.round(tilt)})`);
      const waterLeft=clamp(1-elapsed/650,0,1), waterTop=81-64*waterLeft;
      water.setAttribute('d',`M-43 ${waterTop.toFixed(1)} Q-15 ${(waterTop-6).toFixed(1)} 0 ${waterTop.toFixed(1)} T43 ${waterTop.toFixed(1)} V81 H-43 Z`);
      waterSurface.style.display=waterLeft>.02?'':'none';
      waterLabel.style.display=waterLeft>.55?'':'none';
      waterSurface.setAttribute('transform',`translate(0 ${(waterTop-17).toFixed(1)})`);
      exhaust.setAttribute('transform',`translate(0 ${Math.round(-lift)})`);
      cork.setAttribute('transform',`translate(${Math.round(elapsed/25)} ${Math.round(Math.min(elapsed/5,60))}) rotate(${Math.round(elapsed/3)} 568 310)`);
      cork.style.display=elapsed<450?'':'none';
      needleLabel.style.display=elapsed<450?'':'none';
      updateStatus();
    }
    renderPackets(time);
    if(phase==='pumping'||['launching','apex','falling'].includes(phase)||(phase==='landed'&&time-flightStart<3700+HEAT_DRIFT_MS)||(phase==='ready'&&hasPendingStrokeHeat(time)))frame=raf(tick);
  }
  function reset(){
    if(frame){caf(frame);frame=0;}
    phase='ready';strokes=0;queued=0;strokeStart=0;flightStart=0;strokeTimes.fill(null);
    handle.removeAttribute('transform');arm.setAttribute('d','M139 219 Q157 215 174 232 Q193 219 219 194');hand.setAttribute('cy','194');muscle.setAttribute('cy','225');
    sceneLift=0;sceneTilt=0;sceneDrop=0;
    bottle.setAttribute('transform','translate(568 227)');rotate.removeAttribute('transform');
    water.setAttribute('d','M-43 17 Q-15 11 0 17 T43 17 V81 H-43 Z');waterSurface.style.display='';waterSurface.removeAttribute('transform');waterLabel.style.display='';
    cork.style.display='';cork.removeAttribute('transform');needleLabel.style.display='';exhaust.style.display='none';exhaust.removeAttribute('transform');setBubbles(-1);updateStatus();
  }
  function onPersonKey(e){if((e.key==='Enter'||e.key===' ')&&!button.disabled){e.preventDefault();pump();}}
  function onEnergy(){setEnergyVisible(!energyVisible);}
  function onEfficiency(){setEfficiencyVisible(!efficiencyVisible);}
  function onLegendLabels(event){const form=event.currentTarget.dataset.legendLabelsButton;setLegendLabelsVisible(!legendNames[form],form);}
  person.addEventListener('click',pump);person.addEventListener('keydown',onPersonKey);
  button.addEventListener('click',pump);resetButton.addEventListener('click',reset);energyButton.addEventListener('click',onEnergy);efficiencyButton.addEventListener('click',onEfficiency);legendLabelsButtons.forEach(button=>button.addEventListener('click',onLegendLabels));
  function destroy(){
    if(destroyed)return;destroyed=true;
    if(frame)caf(frame);
    person.removeEventListener('click',pump);person.removeEventListener('keydown',onPersonKey);
    button.removeEventListener('click',pump);resetButton.removeEventListener('click',reset);energyButton.removeEventListener('click',onEnergy);efficiencyButton.removeEventListener('click',onEfficiency);legendLabelsButtons.forEach(button=>button.removeEventListener('click',onLegendLabels));
    host.replaceChildren();host.classList.remove('rocket-scene');delete host.dataset.phase;delete host.dataset.strokes;delete host.dataset.queued;
  }
  if(!energyVisible)find('[data-energy-group]').setAttribute('hidden','');
  updateStatus();
  return {reset,setEnergyVisible,setEfficiencyVisible,setLegendLabelsVisible,destroy,getState};
}
