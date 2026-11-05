/* Run: NODE_PATH=<bundled node_modules> node tests/browser.cjs */
const {chromium}=require('playwright');
const {pathToFileURL}=require('node:url');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {variants}=require('../dist/exercise-data.js');
const root=path.resolve(__dirname,'../dist'),qa=path.resolve(__dirname,'../qa');fs.mkdirSync(qa,{recursive:true});
const url=pathToFileURL(path.join(root,'index.html')).href;
(async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.addInitScript(()=>{
    let api;window.__tasks={};window.__force=null;
    Object.defineProperty(window,'MeasurementExercises',{configurable:true,get:()=>api,set:v=>{
      api=v;const generate=v.generate;v.generate=(s,r,variant)=>{const t=generate(s,r,window.__force?.step===s?window.__force.variant:variant);window.__tasks[s]=t;return t;};
    }});
  });
  try{
    await page.goto(url);
    assert.equal(await page.locator('details.exercise').count(),6);
    let rounds=0;
    for(let step=1;step<=6;step++) {
      await page.locator(`#ueben-${step}>summary`).click();
      for(const {value} of variants(step)) {
        await page.evaluate(({step,value})=>window.__force={step,variant:value},{step,value});
        await page.locator(`#ueben-${step} .exercise-new`).click();
        const task=await page.evaluate(s=>window.__tasks[s],step);
        if(step===1){
          assert.equal(await page.locator('#ueben-1 table input').count(),9);
          assert.equal(await page.locator('#ueben-1 .exercise-fields input').count(),0);
          assert.equal(await page.locator('#ueben-1 table thead th').count(),8);
        }
        for(let n=0;n<task.stages.length;n++) {
          const st=task.stages[n],form=page.locator(`#ueben-${step} .exercise-stage`).nth(n).locator('form');
          if(step===6){
            assert.equal(await form.isVisible(),true,`rounding stage ${value}`);
            assert.equal(await form.locator('.equation-symbolic').isVisible(),true);
            assert.ok((await form.locator('.equation-symbolic').innerText()).trim());
            assert.equal(await form.locator('.equation-parameters').isVisible(),true);
            assert.ok((await form.locator('.equation-parameters').innerText()).trim());
            assert.equal(await form.locator('.equation-entry input').count(),st.fields.length);
            assert.equal(await form.locator('.equation-lhs input').inputValue(),'y');
            for(const variable of await form.locator('.equation-variable input').all())assert.equal(await variable.inputValue(),'x');
            assert.doesNotMatch(await form.locator('.equation-entry').innerText(),/[()]/);
            for(const input of await form.locator('.equation-entry input').all()){
              assert.equal(await input.isVisible(),true);
              assert.ok((await input.getAttribute('placeholder')).trim());
            }
          }
          if(n===0){await form.locator('button[type=submit]').click();assert.ok((await form.locator('.exercise-result').innerText()).includes('Noch nicht'));}
          if(step===3&&st.fields.some(f=>f.type==='multi')){
            assert.equal(await form.locator('.feature-group').count(),4);
            assert.equal(await form.locator('..').locator('.exercise-figure path[stroke-width="2.8"]').getAttribute('d'),'');
          }
          if(st.regressionPreview){
            const choices=form.locator('input[type=radio]');
            assert.equal(await choices.count(),3);
            assert.equal(await form.locator('..').locator('.regression-preview path[stroke-width="2.8"]').getAttribute('d'),'');
            for(let k=0;k<await choices.count();k++){
              await choices.nth(k).check();
              assert.ok((await form.locator('..').locator('.regression-preview path[stroke-width="2.8"]').getAttribute('d')).length>0);
              assert.ok((await form.locator('..').locator('.regression-caption').innerText()).includes('Regression:'));
            }
          }
          if(st.regressionPreview)await form.locator('..').screenshot({path:path.join(qa,'regression-selected.png')});
          if(st.interactivePlot){
            const cfg=st.diagramSetup,stage=form.locator('..'),rows=stage.locator('table tbody tr');
            assert.equal(await stage.locator('table thead th').first().innerText(),'Nummer');
            assert.equal(await stage.locator('table thead th').count(),5);
            for(let r=0;r<cfg.points.length;r++){
              assert.equal(await stage.locator('table tbody tr.drawing-row-active').count(),1);
              assert.equal(await rows.nth(r).getAttribute('aria-current'),'step');
              assert.equal(await rows.nth(r).locator('th,td').first().innerText(),String(r+1));
              assert.equal(await form.getByRole('button',{name:'Nächste Messung',exact:true}).count(),0);
              await form.locator('button[type=submit]').click();
              assert.ok((await form.locator('.exercise-result').innerText()).includes('Noch nicht'));
              assert.equal(await form.getByRole('button',{name:'Nächste Messung',exact:true}).count(),0);
              assert.equal(await rows.nth(r).getAttribute('aria-current'),'step');
              for(const y of [cfg.points[r][1],cfg.bars[r].low,cfg.bars[r].high]){
                const svg=form.locator('.diagram-canvas svg');
                const rect=await svg.boundingBox();
                await svg.click({position:{x:(66+cfg.points[r][0]/cfg.xScale*44)*rect.width/565,y:(470-y/cfg.yScale*44)*rect.height/540}});
              }
              if(r===0)await stage.screenshot({path:path.join(qa,'drawing-active-measurement.png')});
              // Placing the maximum must keep this measurement active until explicitly checked.
              assert.equal(await rows.nth(r).getAttribute('aria-current'),'step');
              assert.equal(await form.getByRole('button',{name:'Nächste Messung',exact:true}).count(),0);
              await form.locator('button[type=submit]').click();
              assert.equal(await rows.nth(r).getAttribute('aria-current'),'step');
              if(r+1<cfg.points.length){
                assert.ok((await form.locator('.exercise-result').innerText()).includes(`Messung ${r+1} ist richtig`));
                assert.equal(await form.locator('button[type=submit]').isDisabled(),true);
                await form.getByRole('button',{name:'Nächste Messung',exact:true}).click();
                assert.equal(await rows.nth(r+1).getAttribute('aria-current'),'step');
              }
            }
          }
          for(let i=0;i<st.fields.length&&!st.interactivePlot;i++) {
            const f=st.fields[i],inputs=form.locator(`[name="f${i}"]`);
            if(st.diagramSetup&&f.type==='number'){
              const box=form.locator(`[data-field="${i}"]`),exponent=Math.floor(Math.log10(f.answer)),factor=Math.round(f.answer/10**exponent);
              assert.equal(await box.locator('[data-scale-part="factor"]').inputValue(),'0');
              assert.equal(await box.locator('[data-scale-part="exponent"]').inputValue(),'0');
              assert.equal(await box.locator('input[type=hidden]').inputValue(),'1');
              for(const e of [-2,-1,0,1,2])for(const [j,factorValue] of [1,2,5].entries()){
                for(const [part,val] of [['factor',j],['exponent',e]])await box.locator(`[data-scale-part="${part}"]`).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},String(val));
                assert.ok(Math.abs(Number(await box.locator('input[type=hidden]').inputValue())-factorValue*10**e)<1e-10);
              }

              for(const [part,val] of [['factor',[1,2,5].indexOf(factor)],['exponent',exponent]])await box.locator(`[data-scale-part="${part}"]`).evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},String(val));
            }
            else if(f.type==='number')await inputs.fill(f.displayAnswer??String(f.answer).replace('.',','));
            else if(f.type==='text')await inputs.fill(f.answer);
            else if(await inputs.first().evaluate(e=>e.tagName==='SELECT'))await inputs.selectOption(f.answer);
            else for(const val of f.type==='multi'?f.answer:[f.answer])await form.locator(`[name="f${i}"][value="${val}"]`).check();
          }
          if(!st.interactivePlot)await form.locator('button[type=submit]').click();
          for(let i=0;i<st.fields.length;i++){
            const f=st.fields[i];
            if(f.type==='multi'&&f.options.some(o=>o.explanation)){
              const field=form.locator(`[data-field="${i}"]`);
              assert.equal(await field.locator('label .option-correction').count(),f.options.length);
              for(const note of await field.locator('.option-correction').allTextContents())assert.ok(note.trim().length>0);
              assert.equal(await form.locator('.exercise-result ul,.exercise-result details').count(),0);
            }
          }
          assert.ok((await form.locator('.exercise-result').innerText()).startsWith('Richtig gelöst.'),`${step}/${value}/${n}`);
          if(n+1<task.stages.length)await form.getByRole('button',{name:'Weiter zum nächsten Teil'}).click();
        }
        assert.ok((await page.locator(`#ueben-${step} .exercise-completion`).innerText()).includes('vollständig selbst'));
        rounds++;
      }
      await page.locator(`#ueben-${step}>summary`).click();
    }
    // Every rounding variant renders immediately, and reveal fills the original equation.
    await page.locator('#ueben-6>summary').click();
    for(const {value} of variants(6)){
      await page.evaluate(value=>window.__force={step:6,variant:value},value);
      await page.locator('#ueben-6 .exercise-new').click();
      const rounding=page.locator('#ueben-6 .exercise-stage').first(),form=rounding.locator('form');
      const st=await page.evaluate(()=>window.__tasks[6].stages[0]);
      assert.equal(await form.isVisible(),true,`rounding reveal ${value}`);
      await rounding.screenshot({path:path.join(qa,`rounding-${value}-before-1280.png`)});
      await form.getByRole('button',{name:'Lösung ansehen'}).click();
      assert.equal(await rounding.locator('.equation-entry').count(),1);
      for(let i=0;i<st.fields.length;i++){
        const input=form.locator(`[name="f${i}"]`);
        assert.ok((await input.inputValue()).trim(),`revealed field ${value}/${i}`);
        assert.equal(await input.isDisabled(),true);
      }
      for(const width of [1280,320]){
        await page.setViewportSize({width,height:900});
        await rounding.screenshot({path:path.join(qa,`rounding-${value}-revealed-${width}.png`)});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`rounding reveal overflow ${value}/${width}`);
      }
      await page.setViewportSize({width:1280,height:900});
    }
    await page.locator('#ueben-6>summary').click();
    // Revealing feature feedback corrects each existing option inline, without a second answer list.
    await page.locator('#ueben-3>summary').click();
    await page.locator('#ueben-3 .exercise-new').click();
    const featureForm=page.locator('#ueben-3 .exercise-stage').first().locator('form');
    const featureStage=await page.evaluate(()=>window.__tasks[3].stages[0]);
    await featureForm.getByRole('button',{name:'Lösung ansehen'}).click();
    for(let i=0;i<featureStage.fields.length;i++){
      const f=featureStage.fields[i];
      if(f.type!=='multi'||!f.options.some(o=>o.explanation))continue;
      const field=featureForm.locator(`[data-field="${i}"]`);
      assert.equal(await field.locator('label .option-correction').count(),f.options.length);
      assert.equal(await field.locator('.option-wrong').count(),0);
      for(const o of f.options)assert.equal(await field.locator(`input[value="${o.value}"]`).isChecked(),f.answer.includes(o.value));
    }
    assert.equal(await featureForm.locator('.exercise-result ul,.exercise-result details').count(),0);
    await featureForm.locator('..').screenshot({path:path.join(qa,'features-inline-correction-1280.png')});
    await page.setViewportSize({width:320,height:900});
    await featureForm.locator('..').screenshot({path:path.join(qa,'features-inline-correction-320.png')});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'feature correction overflow 320');
    await page.setViewportSize({width:1280,height:900});
    await page.locator('#ueben-3>summary').click();
    // Help never claims independent success, and repeated new data reset all stages.
    await page.evaluate(()=>window.__force={step:1,variant:'wiederholung'});
    await page.locator('#ueben-1>summary').click();await page.locator('#ueben-1 .exercise-new').click();
    for(let n=0;n<3;n++){
      const form=page.locator('#ueben-1 .exercise-stage').nth(n).locator('form');
      await form.getByRole('button',{name:'Lösung ansehen'}).click();
      if(n<2)await form.getByRole('button',{name:'Weiter zum nächsten Teil'}).click();
    }
    assert.ok((await page.locator('#ueben-1 .exercise-completion').innerText()).includes('teilweise mit'));
    const old=await page.evaluate(()=>window.__tasks[1].signature);
    await page.locator('#ueben-1 .exercise-new').click();
    assert.notEqual(await page.evaluate(()=>window.__tasks[1].signature),old);assert.equal(await page.locator('#ueben-1 .exercise-stage').count(),1);
    // Keyboard access and correction of drawn points use the same geometry as clicks.
    await page.evaluate(()=>window.__force={step:2,variant:'skalierung'});
    await page.locator('#ueben-2>summary').click();await page.locator('#ueben-2 .exercise-new').click();
    await page.locator('#ueben-2 .exercise-stage').first().getByRole('button',{name:'Lösung ansehen'}).click();
    await page.locator('#ueben-2').getByRole('button',{name:'Weiter zum nächsten Teil'}).click();
    const drawing=page.locator('#ueben-2 .exercise-stage').nth(1),cfg=await page.evaluate(()=>window.__tasks[2].stages[1].diagramSetup);
    await drawing.locator('svg').focus();
    const gx=cfg.points[0][0]/cfg.xScale,gy=cfg.points[0][1]/cfg.yScale;
    for(let k=0;k<Math.abs(gx-5)*2;k++)await page.keyboard.press(gx<5?'ArrowLeft':'ArrowRight');
    for(let k=0;k<Math.abs(gy-5)*2;k++)await page.keyboard.press(gy<5?'ArrowDown':'ArrowUp');
    await page.keyboard.press('Enter');
    assert.equal(Number(await drawing.locator('[name="f0"]').inputValue()),cfg.points[0][0]);
    assert.equal(Number(await drawing.locator('[name="f1"]').inputValue()),cfg.points[0][1]);
    assert.equal(await drawing.locator('table tbody tr.drawing-row-active').count(),1);
    await drawing.locator('[name="f1"]').evaluate(e=>{e.value='-1';});
    await drawing.getByRole('button',{name:'Messung 1 prüfen',exact:true}).click();
    assert.ok((await drawing.locator('.exercise-result').innerText()).includes('Noch nicht'));
    assert.equal(await drawing.getByRole('button',{name:'Nächste Messung',exact:true}).count(),0);
    assert.equal(await drawing.locator('table tbody tr').first().getAttribute('aria-current'),'step');
    await drawing.getByRole('button',{name:'Diese Zeile zurücksetzen'}).click();
    assert.equal(await drawing.locator('[name="f0"]').inputValue(),'');
    await drawing.getByRole('button',{name:'Messung 1 prüfen',exact:true}).click();
    assert.ok((await drawing.locator('.exercise-result').innerText()).includes('Noch nicht'));
    await drawing.getByRole('button',{name:'Lösung ansehen'}).click();
    await drawing.locator('.exercise-result .exercise-figure').screenshot({path:path.join(qa,'drawing-solution.png')});
    for(const width of [1280,820,390,320]) {
      await page.setViewportSize({width,height:900});
      for(const step of [1,2,3,4,5,6]) {
        await page.evaluate(s=>{for(const e of document.querySelectorAll('details.exercise'))e.open=e.id===`ueben-${s}`;window.__force=null;},step);
        await page.locator(`#ueben-${step} .exercise-new`).click();
        await page.locator(`#ueben-${step} .exercise-title`).scrollIntoViewIfNeeded();
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
        assert.equal(overflow,false,`page overflow ${width}/${step}`);
        if([1,2,3,6].includes(step)){
          if(step===3)await page.locator(`#ueben-${step} .exercise-figure`).scrollIntoViewIfNeeded();
          else if(step===6)await page.locator(`#ueben-${step} .equation-entry`).scrollIntoViewIfNeeded();
          else if(step===2)await page.locator(`#ueben-${step} .diagram-board`).scrollIntoViewIfNeeded();
          else await page.locator(`#ueben-${step} .exercise-table`).scrollIntoViewIfNeeded();
          await page.screenshot({path:path.join(qa,`exercise-${step}-${width}.png`)});
        }
      }
    }
    // Deep link opens practice directly; old explanation navigation still exists.
    await page.goto(url+'#ueben-2');
    assert.equal(await page.locator('#ueben-2').evaluate(e=>e.open),true);
    assert.equal(await page.locator('#stepNav a').count(),6);
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(qa,'browser-result.json'),JSON.stringify({rounds,viewports:[1280,820,390,320],errors},null,2));
    console.log(JSON.stringify({rounds,viewports:[1280,820,390,320],errors}));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
