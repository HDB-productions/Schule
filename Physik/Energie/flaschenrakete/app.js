const bridge = createEduloBridge({root,widgetId:'flaschenrakete',stateVersion:1,hideFooter:true,
  fresh:()=>({energyVisible:false,efficiencyVisible:false,legendLabelsVisible:false,legendNames:{chemical:false,kinetic:false,thermal:false,potential:false},learning:rocketLearningFresh()}),
  validate:s=>!!s&&typeof s.energyVisible==='boolean'&&(s.efficiencyVisible===undefined||typeof s.efficiencyVisible==='boolean')&&(s.legendLabelsVisible===undefined||typeof s.legendLabelsVisible==='boolean')&&(s.legendNames===undefined||(s.legendNames&&['chemical','kinetic','thermal','potential'].every(key=>typeof s.legendNames[key]==='boolean')))&&rocketLearningValidate(s.learning),
  onStatus:({text,error})=>{q('[data-storage]').textContent=text;q('[data-retry]').hidden=!error;}
});
let state,scores,simulation,learning,currentView='experiment';
const viewScroll={};
function updateNavigation(){
 const progress=learning?.getProgress?.();
 const target=currentView==='diagram'?'cloze':'diagram';
 const taskLink=q('[data-task-link]');taskLink.dataset.navigate=target;
 taskLink.innerHTML=`<span><strong>${target==='cloze'?'Lückentext öffnen':'Energiefluss<wbr>diagramm öffnen'}</strong><small data-section-score="${target}"></small></span><span aria-hidden="true">→</span>`;
 q('[data-page-number]').textContent=currentView==='diagram'?'3':'2';
 q('#learning-page-title').textContent=currentView==='diagram'?'Energieflussdiagramm':'Lückentext';
 if(progress)for(const node of root.querySelectorAll('[data-section-score]')){const part=progress[node.dataset.sectionScore];node.textContent=`${part.earned} von ${part.total} Punkte`;}
}
function showView(view,{focus=true}={}){
 if(!['experiment','cloze','diagram'].includes(view))return;
 viewScroll[currentView]=q('.edulo-work').scrollTop;currentView=view;root.dataset.view=view;
 q('[data-page=experiment]').hidden=view!=='experiment';q('[data-page=learning]').hidden=view==='experiment';
 if(view!=='experiment')learning?.setView(view);updateNavigation();fit();q('.edulo-work').scrollTop=viewScroll[view]||0;
 if(focus){const heading=view==='experiment'?q('#experiment-title'):q('#learning-page-title');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}
}
function navigate(e){const button=e.target.closest('[data-navigate]');if(button&&root.contains(button))showView(button.dataset.navigate);}
root.addEventListener('click',navigate);
function save(){try{bridge.queueSave(state,scores);}catch{}}
async function start(){
 q('[data-controls]').disabled=true;
 try{
  const loaded=await bridge.load();state=loaded.data;scores=loaded.scores;
  root.querySelectorAll("[data-home-logo]").forEach(link=>{const standalone=bridge.getStatus().mode==='standalone';link.hidden=!standalone;if(standalone)link.querySelector("img").src="../../../assets/hdb-youtube-avatar.jpg";});
  state.efficiencyVisible=state.efficiencyVisible??false;state.legendLabelsVisible=state.legendLabelsVisible??false;
  state.learning=rocketLearningMigrate(state.learning); // Read-only migration; first learner edit persists it.
  simulation?.destroy();learning?.destroy();
  simulation=createRocketSimulation(q('[data-simulation]'),{energyVisible:state.energyVisible,efficiencyVisible:state.efficiencyVisible,legendLabelsVisible:state.legendLabelsVisible,legendNames:state.legendNames,onLegendLabelsChange:(visible,names)=>{state.legendLabelsVisible=visible;state.legendNames=names;save();},onEfficiencyChange:visible=>{state.efficiencyVisible=visible;save();},onEnergyChange:visible=>{state.energyVisible=visible;save();}});
  learning=createRocketLearning(q('[data-learning]'),{state:state.learning,onChange:(next,nextScores)=>{state.learning=next;scores=nextScores;updateNavigation();save();}});
  q('[data-controls]').disabled=bridge.getStatus().mode==='editor';showView(currentView,{focus:false});
 }catch(error){if(q('[data-retry]').hidden){q('[data-storage]').textContent='Die Seite konnte nicht geladen werden: '+error.message;q('[data-retry]').hidden=false;}} // Never overwrite an unread state.
}
q('[data-retry]').addEventListener('click',start);
function fit(){let bottom=window.innerHeight,top=Math.max(0,root.getBoundingClientRect().top);for(let p=root.parentElement;p&&p!==document.documentElement;p=p.parentElement){if(/hidden|clip|auto|scroll/.test(getComputedStyle(p).overflowY))bottom=Math.min(bottom,p.getBoundingClientRect().bottom);}const height=Math.max(120,bottom-top-8)+'px';if(root.style.getPropertyValue('--edulo-height')!==height)root.style.setProperty('--edulo-height',height);}
fit();window.addEventListener('resize',fit);
let previousWidth=0;const layoutObserver=new ResizeObserver(()=>{fit();const width=root.clientWidth;if(width!==previousWidth){previousWidth=width;if(currentView==='diagram')learning?.refresh();}});
for(let p=root;p&&p!==document.documentElement;p=p.parentElement)layoutObserver.observe(p);
const cleanup=new MutationObserver(()=>{if(!root.isConnected){simulation?.destroy();learning?.destroy();bridge.dispose();window.removeEventListener('resize',fit);root.removeEventListener('click',navigate);layoutObserver.disconnect();cleanup.disconnect();}});
cleanup.observe(document.documentElement,{childList:true,subtree:true});start();
