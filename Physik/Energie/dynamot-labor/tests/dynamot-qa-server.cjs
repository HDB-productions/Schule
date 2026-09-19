// Local-only Edulo contract fixture. This is not an Edulo server integration.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const app=()=>fs.readFileSync(path.join(__dirname,'../dynamot-labor.html'),'utf8');
const encode=s=>'DYNAMOT1:'+Buffer.from(JSON.stringify(s),'utf8').toString('base64');
http.createServer((req,res)=>{
 res.setHeader('Content-Type','text/html;charset=utf-8');
 if(req.url.startsWith('/app')){res.end(app());return;}
 const mode=new URL(req.url,'http://localhost').pathname.slice(1);
 const value=mode==='foreign'?'FREMDER_UNVERAENDERTER_STAND':mode==='broken'?encode({widget:'dynamot-lab',version:2,next:1,simulationTime:0,devices:[],wires:[],tasks:{'dynamot-learning-v2':{version:99}}}):'';
 res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Lokale Edulo-Nachbildung · ${mode}</title></head><body ${mode==='editor'?'class="editor"':''}><h1>Lokale Edulo-Nachbildung: ${mode}</h1><p>Nur Feldübergabe und Schutz prüfen, keine Server-Speicherzusage.</p><label>E1<textarea hidden id="e1_text_input">${value}</textarea></label><div>${Array.from({length:20},(_,i)=>`<label>P${i+1}<input id="e2_cloze_text_input_${i+1}" value="${['foreign','broken','editor'].includes(mode)?'unverändert':''}" size="3"></label>`).join('')}</div><output id="events">0 Ereignisse</output><script>window.widget={${mode==='editor'?'isEditor:true':''}};let n=0;document.addEventListener('change',()=>{document.getElementById('events').textContent=++n+' Ereignisse'});</script><iframe title="DynaMot Lernseite" src="/app?edulo=1&SHOW_FIELDS=1" style="width:100%;height:700px;border:0"></iframe></body></html>`);
}).listen(8774,'127.0.0.1',()=>console.log('QA fixture: http://127.0.0.1:8774/host'));
