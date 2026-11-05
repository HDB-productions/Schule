/* Achsen direkt wählen, Skalierungen schieben, Messpunkte im SVG setzen. */
globalThis.MeasurementDiagram = (()=>{
  const fmt=n=>Number(n).toLocaleString('de-DE',{maximumFractionDigits:4});
  function mount(stage,key,form,renderGraph){
    const cfg=stage.diagramSetup, drawing=!!stage.interactivePlot;
    const index=id=>stage.fields.findIndex(f=>f.id===id);
    const controls=form.querySelector('.exercise-fields');controls.className='diagram-exercise';
    let xScale=cfg.xScale,yScale=cfg.yScale,row=0,mode='point',cursor=[5,5],rowPassed=false,done=false;
    const marks=cfg.points.map(()=>({}));
    const field=(id,content)=>`<div class="exercise-field" data-field="${index(id)}">${content}<p class="field-feedback" id="${key}-${id}-feedback"></p></div>`;
    const hidden=id=>`<input type="hidden" name="f${index(id)}" aria-label="${stage.fields[index(id)].label}" value="">`;
    function axis(id,label){return field(id,`<label for="${key}-${id}">${label}</label><select id="${key}-${id}" name="f${index(id)}" aria-label="${label}"><option value="">Größe und Einheit …</option><option value="t">t in s</option><option value="s">s in m</option></select>`);}
    function slider(id,label){return field(id,`<div class="scale-heading">${label}: <output class="scale-result"></output></div><label for="${key}-${id}-factor">Faktor: <output class="factor-value">1</output></label><input type="range" id="${key}-${id}-factor" data-scale-part="factor" min="0" max="2" step="1" value="0" aria-label="${label}: Faktor"><div class="scale-ticks"><span>1</span><span>2</span><span>5</span></div><label for="${key}-${id}-exponent">Zehnerpotenz: 10<sup><output class="exponent-value">0</output></sup></label><input type="range" id="${key}-${id}-exponent" data-scale-part="exponent" min="-2" max="2" step="1" value="0" aria-label="${label}: Zehnerpotenz"><div class="scale-ticks">${[-2,-1,0,1,2].map(n=>`<span>${n}</span>`).join('')}</div>${hidden(id)}`);}

    controls.innerHTML=`<div class="diagram-board">${!drawing?`<div class="diagram-y-choice">${axis('yAxis','Senkrechte Achse')}</div><div class="diagram-x-choice">${axis('xAxis','Waagerechte Achse')}</div>`:''}<div class="diagram-canvas"></div></div>${drawing?`<div class="drawing-controls"><p class="drawing-prompt" aria-live="polite"></p><div class="drawing-modes" role="group" aria-label="Was einzeichnen?"><button type="button" data-mode="point">Mittelwert</button><button type="button" data-mode="low">Minimum</button><button type="button" data-mode="high">Maximum</button></div><button type="button" class="drawing-clear">Diese Zeile zurücksetzen</button><p class="exercise-small">Zeile in der Tabelle wählen. Danach Mittelwert, Minimum und Maximum im Diagramm anklicken. Das Raster rastet in halben Kästchen ein. Balkenenden liegen senkrecht über dem gesetzten Punkt. Tastatur: Diagramm fokussieren, Pfeiltasten bewegen, Enter setzt.</p></div><div class="diagram-feedback-fields">${stage.fields.map(f=>field(f.id,hidden(f.id))).join('')}</div>`:`<div class="diagram-sliders">${slider('sx','Waagerecht: Einheiten pro Kästchen')}${slider('sy','Senkrecht: Einheiten pro Kästchen')}</div>`}`;
    const canvas=controls.querySelector('.diagram-canvas');
    function set(id,value){form.elements[`f${index(id)}`].value=value;}
    function draw(){
      const points=marks.filter(p=>p.x!==undefined).map(p=>[p.x,p.y]);
      const bars=marks.filter(p=>p.x!==undefined&&p.low!==undefined&&p.high!==undefined).map(p=>({x:p.x,low:p.low,high:p.high}));
      canvas.innerHTML=renderGraph({points,bars,xMin:0,yMin:0,xMax:10*xScale,yMax:10*yScale,xStep:xScale,yStep:yScale,xLabel:drawing?'t in s':'',yLabel:drawing?'s in m':''});
      if(!drawing){
        for(const [id,axis,scale] of [['sx','xAxis',xScale],['sy','yAxis',yScale]]){
          const value=form.elements[`f${index(axis)}`].value,unit=value==='t'?'s':value==='s'?'m':'Einheiten';
          controls.querySelector(`#${key}-${id}-factor`).closest('.exercise-field').querySelector('.scale-result').textContent=`${fmt(scale)} ${unit}`;
        }
      }
      const svg=canvas.querySelector('svg');
      if(drawing){
        svg.setAttribute('tabindex','0');svg.setAttribute('role','application');svg.setAttribute('aria-label',`Messpunkte und Balken einzeichnen. Cursor bei t = ${fmt(cursor[0]*xScale)} Sekunden, s = ${fmt(cursor[1]*yScale)} Meter. Pfeiltasten bewegen, Enter setzt.`);
        const ns='http://www.w3.org/2000/svg';
        marks.forEach((p,i)=>{
          if(p.x===undefined)return;
          const t=document.createElementNS(ns,'text');t.setAttribute('x',66+p.x/xScale*44+7);t.setAttribute('y',470-p.y/yScale*44-7);t.setAttribute('fill',i===row?'#b95324':'#183f44');t.setAttribute('font-size','15');t.textContent=String(i+1);svg.append(t);
          for(const k of ['low','high'])if(p[k]!==undefined){const cap=document.createElementNS(ns,'path');cap.setAttribute('d',`M${66+p.x/xScale*44-6} ${470-p[k]/yScale*44}h12`);cap.setAttribute('stroke','#b95324');cap.setAttribute('stroke-width','3');svg.append(cap);}
        });
        const focus=document.createElementNS(ns,'circle');focus.setAttribute('cx',66+cursor[0]*44);focus.setAttribute('cy',470-cursor[1]*44);focus.setAttribute('r','7');focus.setAttribute('fill','none');focus.setAttribute('stroke','#b95324');focus.setAttribute('stroke-dasharray','3 2');focus.classList.add('drawing-cursor');svg.append(focus);
        controls.querySelector('.drawing-prompt').textContent=`Messung ${row+1} von ${marks.length}, t = ${fmt(cfg.points[row][0])} s: ${rowPassed?'richtig geprüft.':mode==='point'?'Mittelwert setzen':mode==='low'?'unteres Balkenende setzen':'oberes Balkenende setzen'}.`;
        controls.querySelectorAll('[data-mode]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.mode===mode));b.disabled=rowPassed||done;});
        controls.querySelector('.drawing-clear').disabled=rowPassed||done;
        table?.querySelectorAll('tbody tr').forEach((tr,i)=>{
          tr.classList.toggle('drawing-row-active',i===row);tr.classList.toggle('drawing-row-checked',i<row||i===row&&rowPassed);
          if(i===row)tr.setAttribute('aria-current','step');else tr.removeAttribute('aria-current');
        });
        stage.fields.forEach((f,i)=>{controls.querySelector(`[data-field="${i}"]`).hidden=!['pointX','pointY','low','high'].some(prefix=>f.id===`${prefix}${row}`);});
      }
    }
    const table=drawing?form.closest('.exercise-stage').querySelector('table'):null;
    if(!drawing){
      for(const id of ['sx','sy']){
        const factor=controls.querySelector(`#${key}-${id}-factor`),exponent=controls.querySelector(`#${key}-${id}-exponent`),box=factor.closest('.exercise-field');
        const update=()=>{
          const f=[1,2,5][+factor.value],e=+exponent.value,val=f*10**e;
          set(id,val);box.querySelector('.factor-value').textContent=f;box.querySelector('.exponent-value').textContent=e;
          factor.setAttribute('aria-valuetext',String(f));exponent.setAttribute('aria-valuetext',`10 hoch ${e}`);
          if(id==='sx')xScale=val;else yScale=val;
        };
        update();for(const range of [factor,exponent])range.addEventListener('input',()=>{update();draw();});
      }
      controls.querySelectorAll('select').forEach(s=>s.addEventListener('change',draw));
    }else{
      table?.classList.add('drawing-measurements');
      controls.querySelector('.exercise-small').textContent='Bearbeite nur die hervorgehobene Messung: Mittelwert, Minimum und Maximum anklicken und anschließend prüfen. Erst danach folgt die nächste Messung. Das Raster rastet in halben Kästchen ein. Balkenenden liegen senkrecht über dem gesetzten Punkt. Tastatur: Pfeiltasten bewegen, Enter setzt.';
      form.querySelector('button[type=submit]').textContent='Messung 1 prüfen';
      controls.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(rowPassed||done)return;mode=b.dataset.mode;draw();}));
      function place(gx,gy){
        if(rowPassed||done||form.querySelector('button[type=submit]').disabled)return;
        gx=Math.round(gx*2)/2;gy=Math.round(gy*2)/2;cursor=[gx,gy];
        if(gx<0||gx>10||gy<0||gy>10)return;
        const m=marks[row];
        if(mode==='point'){m.x=gx*xScale;m.y=gy*yScale;set(`pointX${row}`,m.x);set(`pointY${row}`,m.y);mode='low';}
        else{
          if(m.x===undefined){controls.querySelector('.drawing-prompt').textContent='Setze für diese Zeile zuerst den Mittelwert.';return;}
          m[mode]=gy*yScale;set(`${mode}${row}`,m[mode]);
          if(mode==='low')mode='high';
        }
        draw();
      }
      canvas.addEventListener('click',e=>{const svg=e.target.closest('svg');if(!svg)return;const r=svg.getBoundingClientRect();place(((e.clientX-r.left)*565/r.width-66)/44,(470-(e.clientY-r.top)*540/r.height)/44);});
      canvas.addEventListener('keydown',e=>{
        if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key))return;e.preventDefault();
        if(['Enter',' '].includes(e.key))place(...cursor);
        else{cursor[0]=Math.max(0,Math.min(10,cursor[0]+(e.key==='ArrowRight'?.5:e.key==='ArrowLeft'?-.5:0)));cursor[1]=Math.max(0,Math.min(10,cursor[1]+(e.key==='ArrowUp'?.5:e.key==='ArrowDown'?-.5:0)));draw();}
        canvas.querySelector('svg').focus({preventScroll:true});
      });
      controls.querySelector('.drawing-clear').addEventListener('click',()=>{if(rowPassed||done)return;marks[row]={};for(const id of ['pointX','pointY','low','high'])set(`${id}${row}`,'');mode='point';draw();});
    }
    draw();
    if(drawing)return {
      activeIndices:()=>['pointX','pointY','low','high'].map(prefix=>index(`${prefix}${row}`)),
      currentNumber:()=>row+1,
      passCurrent:()=>{rowPassed=true;form.querySelector('button[type=submit]').disabled=true;draw();return row===marks.length-1;},
      advance:()=>{if(!rowPassed||row===marks.length-1)return;row++;rowPassed=false;mode='point';const submit=form.querySelector('button[type=submit]');submit.disabled=false;submit.textContent=`Messung ${row+1} prüfen`;draw();canvas.querySelector('svg').focus();},
      stop:()=>{done=true;draw();}
    };
  }
  return {mount};
})();
