// Fraction models use the proven HTML/CSS-grid approach of Brueche verstehen.
// No image source, data URL, SVG, canvas or external asset is required.
const FractionVisuals=(()=>{
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const integer=value=>{
    if(typeof value==='number'&&!Number.isSafeInteger(value))throw new RangeError('Eine sichere ganze Zahl ist erforderlich.');
    const text=String(value);
    if(!/^\d{1,240}$/.test(text))throw new RangeError('Eine nichtnegative ganze Zahl ist erforderlich.');
    return BigInt(text);
  };
  const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
  const percent=(a,b)=>Number(a*100000000n/b)/1000000;
  function columns(value){
    const d=integer(value);
    if(d<1n)throw new RangeError('Der Nenner muss positiv sein.');
    if(d>128n)return 1;
    let best=1,distance=Infinity;
    for(let c=1;c<=8;c++)if(d%BigInt(c)===0n){
      const next=Math.abs(Math.log(c*c/(Number(d)*160/112)));
      if(next<distance){best=c;distance=next;}
    }
    return best;
  }
  function image({n,d,group=1,color='#19a491',columns:requestedColumns,planColumns,label}={}){
    const numerator=integer(n),denominator=integer(d),groupSize=integer(group);
    if(denominator<1n||groupSize<1n||denominator%groupSize!==0n)throw new RangeError('Ungültige Teilung.');
    if(numerator>denominator*2n)throw new RangeError('Das Modell zeigt höchstens zwei Ganze.');
    const count=denominator<=128n?Number(denominator):0;
    const preserve=planColumns!==undefined;
    const plan=preserve?integer(planColumns):null;
    if(preserve&&(plan<1n||plan>8n))throw new RangeError('Ungültiger Teilungsplan.');
    const cols=preserve?Number(gcd(denominator,plan)):requestedColumns===undefined?columns(denominator):Number(requestedColumns);
    if(!Number.isInteger(cols)||cols<1||cols>8||denominator%BigInt(cols)!==0n)throw new RangeError('Ungültige Spaltenzahl.');
    const wholes=numerator>denominator?2:1;
    const fill=/^#[\da-f]{3,8}$/i.test(color)?color:'#19a491';
    // Every equivalent fraction refines the SAME reduced base grid. A child
    // inherits its parent's color rather than starting a new fill sequence.
    const divisor=gcd(numerator,denominator),baseN=numerator/divisor,baseD=denominator/divisor;
    const baseColumns=preserve?gcd(baseD,plan):1n,baseRows=baseD/baseColumns;
    const description=String(label??`${numerator/groupSize} von ${denominator/groupSize} Teilen${wholes>1?' · zwei Ganze dargestellt':' eines Ganzen'}${groupSize>1n?', jeweils '+groupSize+' kleine Teile zusammengefasst':''}`)+(count?'':', Teilung vereinfacht dargestellt');
    let html=`<div class="fraction-model-image" role="img" aria-label="${escape(description)}" title="${escape(description)}" data-wholes="${wholes}">`;
    for(let whole=0;whole<wholes;whole++){
      const remaining=numerator-BigInt(whole)*denominator,filled=remaining<0n?0n:remaining>denominator?denominator:remaining;
      const baseRemaining=baseN-BigInt(whole)*baseD,baseFilled=baseRemaining<0n?0n:baseRemaining>baseD?baseD:baseRemaining;
      html+=`<div class="fraction-grid-whole${count?'':' fraction-grid-solid'}" data-denominator="${denominator}" data-filled="${filled}" data-anchor-columns="${baseColumns}" data-anchor-denominator="${baseD}" style="--fraction-columns:${cols};--fraction-rows:${count?count/cols:1}">`;
      if(count){
        const rows=count/cols;
        for(let i=0;i<count;i++){
          const column=Math.floor(i/rows),row=i%rows,boundary=BigInt(i+1)%groupSize===0n;
          const bottom=row===rows-1?'0':`${groupSize>1n&&boundary?2:1}px ${groupSize>1n&&!boundary?'dashed':'solid'} #193c43`;
          const left=column===0?'0':`${groupSize>1n?2:1}px solid #193c43`;
          const parentColumn=preserve?BigInt(column)/(BigInt(cols)/baseColumns):0n;
          const parentRow=preserve?BigInt(row)/(BigInt(rows)/baseRows):0n;
          const colored=preserve?parentColumn*baseRows+parentRow<baseFilled:BigInt(i)<filled;
          html+=`<span class="fraction-grid-cell" data-filled="${colored?'1':'0'}" aria-hidden="true" style="background-color:${colored?fill:'#ffffff'}!important;border-bottom:${bottom}!important;border-left:${left}!important"></span>`;
        }
      }else{
        if(preserve){
          const full=baseFilled/baseRows,rest=baseFilled%baseRows;
          if(full>0n)html+=`<span class="fraction-grid-fill" aria-hidden="true" style="left:0!important;top:0!important;width:${percent(full,baseColumns)}%!important;height:100%!important;background-color:${fill}!important"></span>`;
          if(rest>0n)html+=`<span class="fraction-grid-fill" aria-hidden="true" style="left:${percent(full,baseColumns)}%!important;top:0!important;width:${percent(1n,baseColumns)}%!important;height:${percent(rest,baseRows)}%!important;background-color:${fill}!important"></span>`;
        }else html+=`<span class="fraction-grid-fill" aria-hidden="true" style="height:${percent(filled,denominator)}%;background-color:${fill}!important"></span>`;
      }
      html+='</div>';
    }
    return html+'</div>';
  }
  return {image,columns};
})();
