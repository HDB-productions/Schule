// Synthetic Edulo e1/e2 host. No real Edulo account or API is contacted.
const uid = 'aa-bbbbbb-cccccc-dddddd';
function fixture(html) {
  return html.replace('<body>', '<body><div id="contentWrapper"><div id="e1"><textarea id="e1_text_input"></textarea></div><div id="e2">' + Array.from({ length: 20 }, (_, i) => '<input id="e2_cloze_text_input_' + (i + 1) + '">').join('') + '</div><div id="footerButtons">Überprüfen Lösungen</div><script>' + `
const wrap=el=>({0:el,val(v){if(arguments.length){el.value=v;return this;}return el.value;}});
const mod={name:'cloze_text',loadUserInput(c,rows){for(const row of rows)for(const item of c.clozeInputs)if(item.JSON.id===row.id){item.inputElement.val(row.v);item.last=row.l||null;item.correct=row.c;item.helped=row.h;}},checkSingleClozeInput(item){const ok=item.inputElement.val().trim()==='1';item.correct=ok?'true':'false';return ok;},saveUserInput(c,out){for(const item of c.clozeInputs){out.input.push({id:item.JSON.id,v:item.inputElement.val(),l:item.last||'',c:item.correct,h:item.helped});out.counter.total++;if(item.correct==='true')out.counter.correct++;else if(item.inputElement.val()!=='')out.counter.wrong++;if(item.correct==='true'&&item.helped==='true')out.counter.helped++;}}};
const content={JSON:{},module:mod,clozeInputs:[]};
const storage={JSON:{active:'true'},save(){localStorage.setItem('fixture',JSON.stringify({e1:document.querySelector('#e1_text_input').value,rows:content.clozeInputs.map(i=>({id:i.JSON.id,v:i.inputElement.val(),l:i.last||'',c:i.correct,h:i.helped}))}));}};
content.clozeInputs=[...document.querySelectorAll('#e2 input')].map((el,i)=>({JSON:{id:100+i,values:[{value:'1'}]},inputElement:wrap(el),correct:'false',helped:'false',last:null}));
const stored=JSON.parse(localStorage.getItem('fixture')||'null');if(stored){document.querySelector('#e1_text_input').value=stored.e1;mod.loadUserInput(content,stored.rows);}
document.querySelector('#e1_text_input').addEventListener('change',()=>storage.save());
window.widget={JSON:{},user:{uid:${JSON.stringify(uid)}},isEditor:false,contentWrapper:{0:document.getElementById('contentWrapper')},forEachContent(fn){fn(content)},findModule(n){return n==='cloze_text'?mod:n==='save_load'?storage:null}};
window.fixtureState=()=>{const raw=document.querySelector('#e1_text_input').value;return raw?JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw.slice(7)),c=>c.charCodeAt(0)))):null;};
window.fixtureRows=()=>content.clozeInputs.map(i=>({value:i.inputElement.val(),correct:i.correct,helped:i.helped}));
` + '</script>').replace('</body>', '</div></body>');
}
module.exports = { fixture, uid };
