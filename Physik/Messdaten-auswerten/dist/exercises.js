/* Lokale Übungen: keine Konten, keine Anfragen, keine KI-Bewertung. */
(() => {
  'use strict';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => Number(n).toLocaleString('de-DE', {maximumFractionDigits: 6});
  function parseNumber(raw) {
    const s = String(raw).trim().replace(/−/g, '-');
    if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?$/.test(s)) return NaN;
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }
  function correct(field, value) {
    if(field.type==='text') {
      const normalize=s=>String(s??'').trim().replace(/\s+/g,'').replace(/²/g,'^2').replace(/−/g,'-').replace(/·/g,'*');
      return (field.accepted??[field.answer]).some(a=>normalize(a)===normalize(value));
    }
    if (field.type === 'number') {
      const digits=String(value).trim().split(/[eE]/)[0].replace(/^[+−-]/,'').replace(/[.,]/,'').replace(/^0+/,'').length;
      return (!field.decimalOnly||!/[eE]/.test(value)) && Number.isFinite(parseNumber(value)) && Math.abs(parseNumber(value) - field.answer) <= (field.tolerance ?? 1e-7) + 1e-10 && (!field.significantDigits||digits===field.significantDigits);
    }
    if (field.type === 'multi') return Array.isArray(value) && value.length === field.answer.length && field.answer.every(v => value.includes(v));
    return value === field.answer;
  }
  function graph(spec) {
    const niceAxis=(lo,hi)=>{
      const rough=(hi-lo)/5, magnitude=10**Math.floor(Math.log10(rough));
      const step=[1,2,5,10].find(n=>n*magnitude>=rough)*magnitude;
      return {min:Math.floor(lo/step)*step,max:Math.ceil(hi/step)*step,step};
    };
    const xx=!spec.ambiguous&&!spec.xStep?niceAxis(spec.xMin??0,spec.xMax):{min:spec.xMin??0,max:spec.xMax,step:spec.xStep};
    const yy=!spec.ambiguous&&!spec.yStep?niceAxis(spec.yMin??0,spec.yMax):{min:spec.yMin??0,max:spec.yMax,step:spec.yStep};
    const left=66, top=30, w=440, h=spec.xStep&&spec.yStep?440:250, xmin=xx.min, ymin=yy.min;
    const xmax=xx.max, ymax=yy.max;
    if (!(xmax>xmin && ymax>ymin)) return '';
    const X=x=>left+(x-xmin)/(xmax-xmin)*w, Y=y=>top+h-(y-ymin)/(ymax-ymin)*h;
    let lines='', ticks='';
    const nx=xx.step?Math.round((xmax-xmin)/xx.step):3, ny=yy.step?Math.round((ymax-ymin)/yy.step):3;
    for(let i=0;i<=nx;i++) {
      const x=xmin+(xmax-xmin)*i/nx;
      lines+=`<path d="M${X(x)} ${top}V${top+h}"/>`;
      ticks+=`<text x="${X(x)}" y="${top+h+21}" text-anchor="middle">${esc(fmt(x))}</text>`;
    }
    for(let i=0;i<=ny;i++) {
      const y=ymin+(ymax-ymin)*i/ny;
      lines+=`<path d="M${left} ${Y(y)}H${left+w}"/>`;
      ticks+=`<text x="${left-10}" y="${Y(y)+4}" text-anchor="end">${esc(fmt(y))}</text>`;
    }
    let curve='';
    if(spec.curve&&!spec.pointsOnly) {
      const c=spec.curve;
      const f=x=>c.kind==='quadratisch'?c.a*x*x+(c.b??0)*x+(c.c??0):c.kind==='antiproportional'?c.a/x:c.kind==='exponentiell'?c.a*Math.pow(c.b,x):c.a*x+(c.b??0);
      let pen=false;
      for(let i=0;i<=400;i++) {
        const x=xmin+(xmax-xmin)*i/400, y=f(x);
        if(Number.isFinite(y)&&y>=ymin&&y<=ymax) {curve+=`${pen?'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `;pen=true;} else pen=false;
      }
    }
    const bars=(spec.bars??[]).map(b=>`<path d="M${X(b.x)} ${Y(b.low)}V${Y(b.high)} M${X(b.x)-5} ${Y(b.low)}h10 M${X(b.x)-5} ${Y(b.high)}h10"/>`).join('');
    const marks=bars+(spec.points??[]).filter(([x,y])=>x>=xmin&&x<=xmax&&y>=ymin&&y<=ymax).map(([x,y])=>`<path d="M${X(x)-4} ${Y(y)-4}l8 8m0-8l-8 8"/>`).join('');
    const ax=X(Math.max(xmin,Math.min(xmax,0))), ay=Y(Math.max(ymin,Math.min(ymax,0)));
    return `<figure class="exercise-figure"><svg viewBox="0 0 565 ${h+100}" role="img" aria-label="${esc(spec.ambiguous?'Diagrammausschnitt für eine Funktionsvermutung':'Übungsdiagramm')}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#d4dfdc" stroke-width="1">${lines}</g><path d="M${ax} ${top-6}V${top+h} M${left} ${ay}H${left+w+10}" fill="none" stroke="#183f44" stroke-width="2"/><path d="M${ax} ${top-6}l-4 8h8Z M${left+w+10} ${ay}l-8 -4v8Z" fill="#183f44"/><g font-size="12" fill="#304e50">${ticks}<text x="${left}" y="17">${esc(spec.yLabel??'y')}</text><text x="${left+w}" y="${h+88}" text-anchor="end">${esc(spec.xLabel??'x')}</text></g><path d="${curve}" fill="none" stroke="#b95324" stroke-width="2.8"/><g stroke="#183f44" stroke-width="2" fill="none">${marks}</g></svg>${spec.ambiguous?'<figcaption>Ausschnitt: Die Achsen beginnen hier nicht zwingend bei null.</figcaption>':''}</figure>`;
  }
  function regression(points,kind){
    const powers=kind==='proportional'?[1]:kind==='linear'?[0,1]:[0,1,2];
    const matrix=powers.map(p=>[...powers.map(q=>points.reduce((s,[x])=>s+x**(p+q),0)),points.reduce((s,[x,y])=>s+y*x**p,0)]);
    for(let i=0;i<powers.length;i++){
      let pivot=i;for(let j=i+1;j<powers.length;j++)if(Math.abs(matrix[j][i])>Math.abs(matrix[pivot][i]))pivot=j;
      [matrix[i],matrix[pivot]]=[matrix[pivot],matrix[i]];
      const divisor=matrix[i][i];if(Math.abs(divisor)<1e-12)throw new Error('Regression benötigt verschiedene x-Werte.');
      matrix[i]=matrix[i].map(v=>v/divisor);
      for(let j=0;j<powers.length;j++)if(j!==i){const factor=matrix[j][i];matrix[j]=matrix[j].map((v,k)=>v-factor*matrix[i][k]);}
    }
    const c=Object.fromEntries(powers.map((p,i)=>[p,Math.abs(matrix[i].at(-1))<1e-10?0:matrix[i].at(-1)]));
    return kind==='quadratisch'?{kind,a:c[2],b:c[1],c:c[0]}:{kind,a:c[1],b:c[0]??0};
  }
  const api={parseNumber,correct,graph,regression};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  if(typeof document==='undefined') return;
  const data=globalThis.MeasurementExercises;
  if(!data) return;
  const titles=['Mittelwerte & auffällige Werte','Achsen, Skalierung & Messpunkte','Funktionstyp vermuten','Rechnerisch prüfen & nähern','Regression im CAS','Runden & physikalische Einheiten'];
  const states=new Map();
  function table(t) {
    return `<div class="table-wrap exercise-table" tabindex="0" role="region" aria-label="Übungsdaten, bei Bedarf seitlich scrollen"><table><thead><tr>${t.headers.map(v=>`<th scope="col">${esc(v)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function fieldsHTML(fields, key) {
    return fields.map((f,i)=>{
      const id=`${key}-f${i}`, feedback=`${id}-feedback`;
      if(f.type==='number') return `<div class="exercise-field" data-field="${i}"><label for="${id}">${f.label}</label><input id="${id}" name="f${i}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-describedby="${feedback}" placeholder="Zahl eingeben"><p id="${feedback}" class="field-feedback"></p></div>`;
      const option=o=>{const j=f.options.indexOf(o);return `<label for="${id}-o${j}" ${o.dependsOn?`data-depends-on="${esc(o.dependsOn)}" hidden`:''}><input type="${f.type==='multi'?'checkbox':'radio'}" id="${id}-o${j}" name="f${i}" value="${esc(o.value)}"><span>${o.label}</span></label>`;};
      const grouped=f.options.some(o=>o.group);
      const options=grouped?[...new Set(f.options.map(o=>o.group))].map(g=>`<fieldset class="feature-group"><legend>${esc(g)}</legend><div class="exercise-options">${f.options.filter(o=>o.group===g).map(option).join('')}</div></fieldset>`).join(''):`<div class="exercise-options">${f.options.map(option).join('')}</div>`;
      return `<fieldset class="exercise-field" data-field="${i}" aria-describedby="${feedback}"><legend>${f.label}</legend>${f.type==='multi'?'<p class="exercise-small">Mehrere Antworten auswählbar.</p>':''}<div class="${grouped?'feature-groups':'option-container'}">${options}</div><p id="${feedback}" class="field-feedback"></p></fieldset>`;
    }).join('');
  }
  function resultTable(stage,key) {
    return `<div class="table-wrap exercise-table exercise-result-table" tabindex="0" role="region" aria-label="Messwerte und Ergebnisfelder, bei Bedarf seitlich scrollen"><table><caption>Alle Zeiten in Sekunden. Ergebnisse direkt in der jeweiligen Zeile eintragen.</caption><thead><tr>${['Reihe','Messung 1','Messung 2','Messung 3','Messung 4','Mittelwert','Minimum','Maximum'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${stage.table.rows.map((r,row)=>`<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map(v=>`<td>${esc(v)}</td>`).join('')}${stage.fields.slice(row*3,row*3+3).map((f,col)=>{
      const i=row*3+col,id=`${key}-f${i}`;
      return `<td class="exercise-field" data-field="${i}"><label class="exercise-sr-only" for="${id}">${f.label}</label><input id="${id}" name="f${i}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-describedby="${id}-feedback" placeholder="…"><p id="${id}-feedback" class="field-feedback"></p></td>`;
    }).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function equationHTML(stage,key,solved=false){
    const eq=stage.equation;
    const slot=(id,kind)=>{
      const i=stage.fields.findIndex(f=>f.id===id),f=stage.fields[i],domId=`${key}-f${i}`;
      if(solved)return `<span class="equation-answer">${answerLabel(f)}</span>`;
        const hint={lhs:'y',coefficient:id,unit:'Einheit',variable:'x'}[kind];
        const initial=kind==='lhs'?'y':kind==='variable'?'x':'';
        return `<span class="exercise-field equation-slot equation-${kind}" data-field="${i}"><label class="exercise-sr-only" for="${domId}">${f.label}</label><input type="text" id="${domId}" name="f${i}" ${f.type==='number'?'inputmode="decimal"':''} autocomplete="off" spellcheck="false" aria-describedby="${domId}-feedback" title="${esc(f.label)}" value="${initial}" placeholder="${esc(hint)}"><span class="field-feedback exercise-sr-only" id="${domId}-feedback"></span></span>`;
    };
    const terms=eq.terms.map((term,i)=>`<span class="equation-term">${i?'<span class="equation-plus">+</span>':''}${slot(term.coefficient,'coefficient')}${slot(term.unit,'unit')}${term.power?`<span>·</span><span class="equation-variable-power">${slot(term.variable,'variable')}${term.power===2?'<sup>2</sup>':''}</span>`:''}</span>`).join('');
    return `${!solved?`<div class="equation-given"><div class="equation-symbolic">${esc(eq.symbolic)}</div><div class="equation-parameters">${eq.parameters.map(p=>`<span>${esc(p.symbol)} = ${esc(p.rawDisplay)}</span>`).join('')}</div></div>`:''}<div class="equation-entry" aria-label="${solved?'Musterlösung':'Physikalische Gleichung zum Ergänzen'}"><span class="equation-left">${slot(eq.lhs??eq.lhsField,'lhs')}<span>=</span></span>${terms}</div>${!solved?'<p class="exercise-small">Ersetze y und x durch die passenden physikalischen Formelzeichen. Einheiten ebenfalls eintippen. Für Quadrat ist sowohl ² als auch ^2 möglich. Negative Zahlen mit Minuszeichen in das Zahlenfeld schreiben.</p>':''}`;
  }
  function answerLabel(f) {
    if(f.type==='number') return f.displayAnswer??fmt(f.answer);
    if(f.type==='text')return esc(f.answer);
    const values=f.type==='multi'?f.answer:[f.answer];
    return f.options.filter(o=>values.includes(o.value)).map(o=>o.label).join('; ');
  }
  function readField(form,f,i) {
    if(f.type==='multi') return [...form.elements].filter(e=>e.name===`f${i}`&&e.checked).map(e=>e.value);
    const element=form.elements.namedItem(`f${i}`);
    return ['number','text'].includes(f.type)||element?.tagName==='SELECT'?element.value:form.querySelector(`[name="f${i}"]:checked`)?.value??null;
  }
  function correctOptions(field,f,reveal=false){
    if(f.type!=='multi'||!f.options.some(o=>o.explanation))return;
    for(const o of f.options){
      const input=[...field.querySelectorAll('input')].find(e=>e.value===o.value);if(!input)continue;
      const label=input.closest('label'),expected=f.answer.includes(o.value),wasCorrect=input.checked===expected;
      label.hidden=false;
      if(reveal)input.checked=expected;
      label.classList.toggle('option-correct',reveal||wasCorrect);label.classList.toggle('option-wrong',!reveal&&!wasCorrect);
      let note=label.querySelector('.option-correction');if(!note){note=document.createElement('span');note.className='option-correction';label.append(note);}
      note.textContent=`${expected?'Trifft zu.':'Nicht ankreuzen.'} ${o.correction??(expected?o.explanation:'Dieses Merkmal ist hier nicht sichtbar.')}`;
    }
  }
  function start(step) {
    const s=states.get(step), variant=s.host.querySelector('.exercise-variant')?.value||undefined;
    let task;
    for(let i=0;i<6;i++){task=data.generate(step,Math.random,variant);if(task.signature!==s.task?.signature)break;}
    s.task=task;s.current=0;s.helped=false;
    s.body.innerHTML=`<h3 class="exercise-title" tabindex="-1">${task.title}</h3><div class="exercise-intro">${task.intro}</div><p class="exercise-small">Zahlen mit Komma oder Punkt eingeben. Du kannst Antworten korrigieren und erneut prüfen.</p><div class="exercise-stages"></div><p class="exercise-completion" role="status"></p>`;
    addStage(step);
  }
  function addStage(step) {
    const s=states.get(step), n=s.current, stage=s.task.stages[n], key=`exercise-${step}-${n}`;
    const container=document.createElement('section');container.className='exercise-stage';
    const inTable=step===1&&n===0;
    container.innerHTML=`<p class="exercise-kicker">Teil ${n+1} von ${s.task.stages.length}</p><h4 tabindex="-1">${stage.title}</h4><div class="exercise-body">${stage.body??''}</div>${stage.table&&!inTable?table(stage.table):''}${stage.plot?graph(stage.plot):''}<form novalidate>${inTable?resultTable(stage,key):stage.equation?equationHTML(stage,key):`<div class="exercise-fields">${fieldsHTML(stage.fields,key)}</div>`}<div class="exercise-actions"><button type="submit" class="exercise-primary">Antworten prüfen</button><button type="button" class="exercise-reveal">Lösung ansehen</button></div><div class="exercise-result" role="status" aria-live="polite"></div></form>`;
    s.body.querySelector('.exercise-stages').append(container);
    const form=container.querySelector('form'), result=form.querySelector('.exercise-result');
    form.id=`${key}-form`;
      form.addEventListener('change',()=>{
        for(const label of form.querySelectorAll('[data-depends-on]')){
          const parent=form.querySelector(`input[value="${label.dataset.dependsOn}"]`);
          label.hidden=!parent.checked;if(label.hidden)label.querySelector('input').checked=false;
        }
      });
      if(stage.regressionPreview){
        const figure=container.querySelector('.exercise-figure');
        const preview=document.createElement('div');preview.className='regression-preview';figure.replaceWith(preview);
        const update=()=>{
          const kind=form.querySelector('input:checked')?.value;
          const fitted=kind?regression(stage.plot.points,kind):null;
          preview.innerHTML=graph({...stage.plot,pointsOnly:false,curve:fitted})+(fitted?`<p class="regression-caption" role="status">Regression: <strong>${esc(kind)}</strong>${kind==='quadratisch'&&fitted.a===0?' – der quadratische Koeffizient ist 0; die Anpassung ergibt eine Gerade.':''}</p>`:'<p class="regression-caption">Wähle unten einen Typ, um die zugehörige Regression einzublenden.</p>');
        };
        form.addEventListener('change',update);update();
      }
    const diagram=stage.diagramSetup?globalThis.MeasurementDiagram.mount(stage,key,form,graph):null;
    if(step===1&&n===1){
      const grid=s.body.querySelector('.exercise-result-table');
      const choices=form.querySelector('.exercise-options');
      choices.innerHTML='';
      grid.querySelector('caption').textContent='Wähle genau zwei auffällige Messwerte direkt in der Tabelle aus.';
      grid.querySelectorAll('tbody tr').forEach((row,r)=>{
        [...row.children].slice(1,5).forEach((cell,c)=>{
          const value=`${'ABC'[r]}${c+1}`, label=cell.textContent, id=`${key}-${value}`;
          cell.innerHTML=`<label class="exercise-cell-choice" for="${id}"><input type="checkbox" id="${id}" form="${form.id}" name="f0" value="${value}" aria-label="${value}: ${esc(label)} Sekunden"><span>${esc(label)}</span></label>`;
        });
      });
      form.querySelector('.exercise-field').prepend(grid);
    }
    function finish(help) {
      s.helped ||= help;
        if(stage.equation){
          stage.fields.forEach((f,i)=>{
            const field=form.querySelector(`[data-field="${i}"]`),input=field.querySelector('input');
            if(help)input.value=f.displayAnswer??String(f.answer);
            field.classList.remove('is-wrong');field.classList.add('is-correct');
            input.setAttribute('aria-invalid','false');input.title=f.explanation;
            field.querySelector('.field-feedback').textContent=f.explanation;
          });
        }
        if(stage.regressionPreview&&help){
          const answer=form.querySelector(`input[value="${stage.fields[0].answer}"]`);
          answer.checked=true;answer.dispatchEvent(new Event('change',{bubbles:true}));
        }
      diagram?.stop();
      stage.fields.forEach((f,i)=>correctOptions(form.querySelector(`[data-field="${i}"]`),f,help));
      for(const el of form.elements) el.disabled=true;
      result.className='exercise-result '+(help?'is-help':'is-correct');
      result.innerHTML=`<strong>${help?'Lösung zur Selbstkontrolle':'Richtig gelöst.'}</strong>${help?`<ul>${stage.fields.map(f=>`<li><strong>${f.label}:</strong> ${answerLabel(f)}${f.explanation?`<br>${f.explanation}`:''}</li>`).join('')}</ul>`:''}<div>${stage.explanation??''}</div>${!help?stage.fields.filter(f=>f.type==='multi'&&f.options.some(o=>o.explanation)).map(f=>`<details><summary>Die Merkmale einzeln erklärt</summary><ul>${f.options.map(o=>`<li><strong>${f.answer.includes(o.value)?'Ausgewählt':'Nicht ausgewählt'}: ${o.label}</strong><br>${o.explanation??''}</li>`).join('')}</ul></details>`).join(''):''}${stage.solutionPlot?graph(stage.solutionPlot):''}${stage.interactivePlot?graph({points:stage.diagramSetup.points,bars:stage.diagramSetup.bars,xStep:stage.diagramSetup.xScale,yStep:stage.diagramSetup.yScale,xMax:10*stage.diagramSetup.xScale,yMax:10*stage.diagramSetup.yScale,xLabel:'t in s',yLabel:'s in m'}):''}`;
      if(stage.equation){
          result.innerHTML=`<strong>${help?'Lösung direkt in der Gleichung eingetragen.':'Richtig gelöst.'}</strong><p>${stage.explanation}</p><details><summary>Rundung und Einheiten erklärt</summary><ul>${stage.fields.filter(f=>f.type==='number'||f.id.endsWith('Unit')).map(f=>`<li>${f.explanation}</li>`).join('')}</ul></details>`;
      }
      if(stage.fields.some(f=>f.type==='multi'&&f.options.some(o=>o.explanation))){
        result.innerHTML=`<strong>${help?'Lösung direkt in den Auswahlfeldern angezeigt.':'Richtig gelöst.'}</strong>`;
      }
      if(n+1<s.task.stages.length) {
        const next=document.createElement('button');next.type='button';next.className='exercise-primary';next.textContent='Weiter zum nächsten Teil';
        next.addEventListener('click',()=>{next.disabled=true;s.current++;addStage(step);const nodes=s.body.querySelectorAll('.exercise-stage h4');nodes[nodes.length-1].focus();});
        result.append(next);
      } else {
        const p=s.body.querySelector('.exercise-completion');p.textContent=s.helped?'Runde abgeschlossen – teilweise mit eingeblendeter Lösung. Mit neuen Daten kannst du es noch einmal selbst versuchen.':'Runde vollständig selbst gelöst. Bereit für neue Daten?';
        const again=document.createElement('button');again.type='button';again.className='exercise-primary';again.textContent='Neue Aufgabe';again.addEventListener('click',()=>{start(step);s.body.querySelector('h3').focus();});p.append(document.createElement('br'),again);
      }
    }
    form.addEventListener('submit',e=>{
      e.preventDefault();let passed=true;
      stage.fields.forEach((f,i)=>{
        if(diagram&&!diagram.activeIndices().includes(i))return;
        const value=readField(form,f,i), ok=correct(f,value), field=form.querySelector(`[data-field="${i}"]`);
        passed&&=ok;field.classList.toggle('is-correct',ok);field.classList.toggle('is-wrong',!ok);
        field.querySelector(':scope > .field-feedback').textContent=stage.interactivePlot?(ok?'':`${f.label}: noch nicht richtig eingezeichnet.`):ok?'Richtig.':f.type==='number'&&!Number.isFinite(parseNumber(value))?'Bitte eine Zahl ohne Einheit eingeben.':f.significantDigits?`Prüfe den gerundeten Wert und die Schreibweise mit ${f.significantDigits} signifikanten Stellen (z. B. 1,20).`:f.type==='multi'?'Die Auswahl stimmt noch nicht vollständig. Prüfe die markierten Werte.':'Noch nicht richtig. Prüfe deine Antwort noch einmal.';
        field.querySelectorAll('input').forEach(el=>el.setAttribute('aria-invalid',String(!ok)));
        correctOptions(field,f);
      });
      if(passed&&diagram&&!diagram.passCurrent()){
        result.className='exercise-result is-correct';result.textContent=`Messung ${diagram.currentNumber()} ist richtig eingezeichnet.`;
        const next=document.createElement('button');next.type='button';next.className='exercise-primary';next.textContent='Nächste Messung';
        next.addEventListener('click',()=>{result.textContent='';result.className='exercise-result';diagram.advance();});result.append(next);
      }
      else if(passed) finish(false);
      else {result.className='exercise-result is-wrong';result.textContent='Noch nicht vollständig richtig. Du kannst korrigieren und erneut prüfen oder die Lösung mit Erklärung ansehen.';if(stage.equation)result.innerHTML+=`<ul>${stage.fields.filter((f,i)=>!correct(f,readField(form,f,i))).map(f=>`<li>${f.label}: ${f.type==='number'?'gerundeten Wert und drei signifikante Stellen prüfen.':'Formelzeichen bzw. Einheit prüfen.'}</li>`).join('')}</ul>`;}
      result.setAttribute('tabindex','-1');result.focus({preventScroll:true});result.scrollIntoView({block:'nearest'});
    });
    form.querySelector('.exercise-reveal').addEventListener('click',()=>finish(true));
  }
  for(let step=1;step<=6;step++) {
    const target=document.querySelector(`#schritt-${step}`);if(!target)continue;
    const host=document.createElement('details');host.className='exercise';host.id=`ueben-${step}`;
    const variants=typeof data.variants==='function'&&step>3?data.variants(step):[];
    host.innerHTML=`<summary><span>Üben</span><span class="exercise-summary">${titles[step-1]} · neue Zufallsdaten</span></summary><div class="exercise-content"><div class="exercise-toolbar">${variants.length?`<label>Aufgabentyp<select class="exercise-variant"><option value="">Gemischt</option>${variants.map(v=>`<option value="${esc(v.value)}">${esc(v.label)}</option>`).join('')}</select></label>`:''}<button type="button" class="exercise-new">Neue Aufgabe</button><span class="exercise-small">Beliebig oft · direkt überprüfbar</span></div><div class="exercise-task"></div></div>`;
    target.insertBefore(host,target.querySelector(':scope > .back-top'));
    states.set(step,{host,body:host.querySelector('.exercise-task'),task:null});
    host.addEventListener('toggle',()=>{if(host.open&&!states.get(step).task)start(step);});
    host.querySelector('.exercise-new').addEventListener('click',()=>{start(step);states.get(step).body.querySelector('h3').focus();});
    host.querySelector('.exercise-variant')?.addEventListener('change',()=>start(step));
  }
  const nav=document.createElement('nav');nav.className='practice-nav';nav.setAttribute('aria-label','Direkt zu den Übungen');
  nav.innerHTML='<strong>Direkt üben</strong>'+titles.map((t,i)=>`<a href="#ueben-${i+1}">${i+1}. ${t}</a>`).join('');
  document.querySelector('#overview')?.after(nav);
  function openHash(){const match=location.hash.match(/^#ueben-([1-6])$/);if(match){const s=states.get(+match[1]);s.host.open=true;if(!s.task)start(+match[1]);}}
  window.addEventListener('hashchange',openHash);openHash();
})();
