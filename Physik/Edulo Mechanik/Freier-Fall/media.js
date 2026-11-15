/* Edulo resolves its own uploaded files. No guessed server paths. */
function resolveFallMedia(host,name,standaloneBase){
 if(!host)return new URL(name,standaloneBase).href;
 if(typeof host.forEachContent!=='function'||typeof host.getMediaURLPath!=='function')throw Error('Edulos Dateizugriff ist hier nicht verfügbar.');
 const matches=[];
 host.forEachContent(c=>{if((c?.JSON?.type==='html_and_files'||c?.module?.name==='html_and_files')&&typeof c.JSON?.html==='string'&&c.JSON.html.includes('EDULO_WIDGET_KEY:freier-fall-ki-v1'))matches.push(c);});
 if(matches.length!==1)throw Error('Das zugehörige HTML-Modul ist nicht eindeutig auffindbar.');
 const files=(Array.isArray(matches[0].JSON.files)?matches[0].JSON.files:[]).filter(f=>{
  if(typeof f?.url!=='string')return false;
  let basename=f.url.split(/[?#]/,1)[0].split(/[\\/]/).pop();
  try{basename=decodeURIComponent(basename);}catch{}
  return basename===name;
 });
 if(files.length!==1)throw Error('Bitte die Datei '+name+' genau einmal im zugehörigen Edulo-Modul hochladen.');
 const url=host.getMediaURLPath(files[0].url);
 if(typeof url!=='string'||!url.trim()||/^\s*(?:javascript|data):/i.test(url))throw Error('Die Medienadresse ist ungültig.');
 return url;
}
function initFallMedia(root){
 let win=window,host=null;
 for(let i=0;i<8;i++){try{if(win.widget){host=win.widget;break;}if(win.parent===win)break;win=win.parent;}catch{break;}}
 for(const item of [{file:'fallvideo.mov',selector:'[data-fall-video]',link:'[data-video-link]',status:'[data-video-status]'},{file:'stroboskop-original.jpg',selector:'[data-fall-image]',link:'[data-image-link]',status:'[data-image-status]'}]){
  const media=root.querySelector(item.selector),status=root.querySelector(item.status),link=root.querySelector(item.link);
  try{const url=resolveFallMedia(host,item.file,document.baseURI);media.src=url;link.href=url;link.target='_blank';link.rel='noopener';
   media.addEventListener('error',()=>{status.textContent='Die Datei '+item.file+' konnte hier nicht angezeigt werden. Nutze den Link zum separaten Öffnen oder informiere deine Lehrkraft.';});
  }catch(error){status.textContent=error.message;link.hidden=true;}
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports={resolveFallMedia};
