// Plain display; the bridge alone writes the designated Edulo answer field.
const bridge=createEduloAnswerBridge({root});
let timer;
let qrValue='';
function renderQr(data) {
  const uid=data?.uid || '';
  const section=root.querySelector('[data-qr-section]');
  const canvas=root.querySelector('[data-qr]');
  const status=root.querySelector('[data-qr-status]');
  if(!/^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i.test(uid)){
    qrValue='';section.hidden=true;canvas.width=0;canvas.height=0;status.hidden=true;status.textContent='';return;
  }
  if(uid===qrValue && !section.hidden)return;
  try {
    const qr=createLoginQr(0,'M');
    qr.addData(uid,'Byte'); // Exact raw Edulo ID; no name, prefix, URL or network.
    qr.make();
    const count=qr.getModuleCount(), quiet=4, scale=8;
    canvas.width=canvas.height=(count+quiet*2)*scale;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw Error('Canvas ist nicht verfügbar.');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#000';
    for(let y=0;y<count;y++)for(let x=0;x<count;x++)if(qr.isDark(y,x))ctx.fillRect((x+quiet)*scale,(y+quiet)*scale,scale,scale);
    qrValue=uid;section.hidden=false;status.hidden=true;status.textContent='';
  } catch(error) {
    qrValue='';section.hidden=true;canvas.width=0;canvas.height=0;
    status.textContent='QR-Code konnte hier nicht angezeigt werden. Die UserID steht weiterhin als Text bereit.';status.hidden=false;
  }
}
function display(data,text) {
  root.querySelector('[data-userid]').textContent=data?.uid || 'Nicht verfügbar';
  root.querySelector('[data-username]').textContent=data?.name || 'Nicht verfügbar';
  root.querySelector('[data-email]').textContent=typeof data?.email==='string'?(data.email || 'Keine hinterlegt'):'Nicht verfügbar';
  root.querySelector('[data-status]').textContent=text;
  renderQr(data);
}
function update() {
  if(!root.isConnected){stop();return;}
  try {
    const result=bridge.sync();
    display(result.data,result.text);
  } catch(error) {
    const data=bridge.getDisplay();
    display(data,'Nicht gespeichert: '+error.message);
  }
}
function suspend(){clearInterval(timer);bridge.restore();}
function stop(){suspend();window.removeEventListener('pagehide',suspend);window.removeEventListener('pageshow',resume);}
function resume(){if(!root.isConnected)return;update();clearInterval(timer);timer=setInterval(update,500);}
window.addEventListener('pagehide',suspend);
window.addEventListener('pageshow',resume);
update();timer=setInterval(update,500);
