const Algebra = (() => {
  'use strict';
  // Exact rational arithmetic and term analysis are carried over from version 2.
  function q(n,d=1n){n=BigInt(n);d=BigInt(d);if(!d)throw Error('Durch null darfst du nicht teilen.');if(d<0n){n=-n;d=-d;}let a=n<0n?-n:n,b=d;while(b){[a,b]=[b,a%b];}return [n/a,d/a];}
  const add=(a,b)=>q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),neg=a=>[-a[0],a[1]],mul=(a,b)=>q(a[0]*b[0],a[1]*b[1]),div=(a,b)=>q(a[0]*b[1],a[1]*b[0]),eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],zero=a=>a[0]===0n,one=q(1),z=q(0);
  const plus=(a,b)=>[add(a[0],b[0]),add(a[1],b[1])],scale=(a,b)=>a.map(v=>mul(v,b)),same=(a,b)=>eq(a[0],b[0])&&eq(a[1],b[1]);
  function unsupported(message){const e=Error(message);e.name='UnsupportedInput';return e;}
  function analyze(raw,maxLength=160){
   const text=String(raw).toLowerCase().replace(/[−–]/g,'-').replace(/[·×]/g,'*').replace(/[÷:]/g,'/').replace(/,/g,'.').replace(/\s/g,'');
   if(!text||text.length>maxLength)throw Error('Gib einen Term mit höchstens 160 Zeichen ein.');
   const tokens=text.match(/\d+(?:\.\d+)?|[x()+*/-]/g)||[];
   if(tokens.join('')!==text)throw unsupported('Diese Schreibweise wird hier nicht unterstützt. Erlaubt sind rationale Zahlen, x, Rechenzeichen und runde Klammern; pi, π und weitere Buchstaben gehören nicht zur Eingabesprache.');
   let i=0;
   function atom(){const t=tokens[i++];if(t==='+')return atom();if(t==='-'){const a=atom();return {k:'neg',a,v:scale(a.v,q(-1))};}if(t==='('){const a=sum();if(tokens[i++]!==')')throw Error('Prüfe deine Klammern.');return a;}if(t==='x')return {k:'x',v:[one,z]};if(t&&/^\d/.test(t)){const [a,b='']=t.split('.');return {k:'num',v:[z,q(BigInt(a+b),10n**BigInt(b.length))]};}throw Error('Hier fehlt eine Zahl, x oder eine Klammer.');}
   function product(){let a=atom();while(i<tokens.length){const t=tokens[i],implicit=t==='x'||t==='('||/^\d/.test(t);if(!implicit&&t!=='*'&&t!=='/')break;if(!implicit)i++;const b=atom();let v,k=t==='/'&&!implicit?'div':'mul';if(k==='div'){if(!zero(b.v[0]))throw unsupported('x im Nenner wird in dieser Übung nicht unterstützt.');v=scale(a.v,div(one,b.v[1]));}else{if(!zero(a.v[0])&&!zero(b.v[0]))throw unsupported('Nichtlineare Terme werden in dieser Übung nicht unterstützt.');v=zero(b.v[0])?scale(a.v,b.v[1]):scale(b.v,a.v[1]);}a={k,a,b,v};}return a;}
   function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const t=tokens[i++],b=product();a={k:t==='+'?'add':'sub',a,b,v:plus(a.v,t==='-'?scale(b.v,q(-1)):b.v)};}return a;}
   const tree=sum();if(i!==tokens.length)throw Error('Prüfe die Reihenfolge deiner Zeichen und Klammern.');
   const un=n=>n.k==='neg'?un(n.a):n;
   const hasSum=n=>n.k==='add'||n.k==='sub'||!!n.a&&hasSum(n.a)||!!n.b&&hasSum(n.b);
   const expansion=n=>n.k==='neg'&&hasSum(n)?'minusBracket':n.k==='mul'&&hasSum(n)?'brackets':n.k==='div'&&hasSum(n)?'divideBracket':n.a&&expansion(n.a)||n.b&&expansion(n.b)||null;
   function scalar(n){n=un(n);if(n.k==='num')return true;if(n.k!=='div'||un(n.a).k!=='num'||un(n.b).k!=='num')return false;const a=n.a.v[1],b=n.b.v[1];return a[1]===1n&&b[1]===1n&&b[0]>1n&&n.v[1][1]===b[0];}
   function simple(n){n=un(n);if(n.k==='x'||scalar(n))return true;if(n.k==='div'&&simple(n.a)&&scalar(n.b)&&!zero(n.a.v[0])){const denominator=n.b.v[1];return denominator[1]===1n&&denominator[0]>1n&&n.v[0][1]===denominator[0];}if(n.k!=='mul')return false;const a=un(n.a),b=un(n.b),c=a.k==='x'?n.b:b.k==='x'?n.a:null;return !!c&&scalar(c)&&!zero(c.v[1])&&!eq(c.v[1],one)&&!eq(c.v[1],q(-1));}
   const terms=[];function flatten(n){if(n.k==='add'||n.k==='sub'){flatten(n.a);flatten(n.b);}else terms.push(n);}flatten(tree);
   let issue=null;
   if(expansion(tree))issue=expansion(tree);
   else if(terms.filter(n=>!zero(n.v[0])).length>1)issue='x';
   else if(terms.filter(n=>zero(n.v[0])).length>1||terms.length>1&&terms.some(n=>zero(n.v[0])&&zero(n.v[1])))issue='numbers';
   else if(terms.some(n=>!simple(n)))issue='calculate';
   return {value:tree.v,issue};
  }
  function parse(raw){return analyze(raw).value;}
  function equation(s){let p=s.split('=');if(p.length!==2)throw Error('Schreibe beide Seiten der Gleichung mit genau einem =.');return p.map(parse);}
  const qt=a=>a[1]===1n?String(a[0]):a[0]+'/'+a[1];
  function term(a){let x=zero(a[0])?'':eq(a[0],one)?'x':eq(a[0],q(-1))?'-x':qt(a[0])+'x';return x+(zero(a[1])?(x?'':'0'):x?(a[1][0]<0n?' − ':' + ')+qt(q(a[1][0]<0n?-a[1][0]:a[1][0],a[1][1])):qt(a[1]));}
  const et=e=>e.map(term).join(' = ');

  function operate(e,text,legacy=false){
    const s=String(text).trim().replace(/^\|\s*/,'').replace(/[−–]/g,'-'),sign=s[0];
    if(!['+','-',':','/','÷','*','·','×'].includes(sign))throw Error('Beginne mit +, −, : oder ·.');
    // A signed sum applies each written sign: -2x-8 adds the term -2x-8.
    // Only explicit parentheses, as in -(2x-8), negate the whole remainder.
    // Two extra characters allow explicit grouping when upgrading an old save.
    if(sign==='+'||sign==='-'){
      const v=analyze(legacy?s.slice(1):s,162).value;
      return e.map(a=>plus(a,legacy&&sign==='-'?scale(v,q(-1)):v));
    }
    const v=parse(s.slice(1));
    if(!zero(v[0]))throw Error('Zum Multiplizieren oder Dividieren brauchst du eine Zahl ohne x.');
    if(zero(v[1]))throw Error('Multiplizieren oder Dividieren mit null ist keine zulässige Äquivalenzumformung.');
    const factor=[':', '/', '÷'].includes(sign)?div(one,v[1]):v[1];
    return e.map(a=>scale(a,factor));
  }
  function classify(e){const dx=add(e[0][0],neg(e[1][0]));if(!zero(dx))return 'unique';return eq(e[0][1],e[1][1])?'all':'none';}
  function solution(e){return classify(e)==='unique'?div(add(e[1][1],neg(e[0][1])),add(e[0][0],neg(e[1][0]))):null;}
  function isTerminal(e){
    if(zero(e[0][0])&&zero(e[1][0]))return true;
    return same(e[0],[one,z])&&zero(e[1][0])||same(e[1],[one,z])&&zero(e[0][0]);
  }
  function suggestOperation(e){
    if(isTerminal(e))return null;
    const left=e[0],right=e[1];
    if(!zero(left[0])&&!zero(right[0])){const n=neg(right[0]);return (n[0]<0n?'':'+')+qt(n)+'x';}
    const active=zero(left[0])?right:left;
    if(!zero(active[1]))return (active[1][0]<0n?'+':'-')+qt(q(active[1][0]<0n?-active[1][0]:active[1][0],active[1][1]));
    return ':('+qt(active[0])+')';
  }
  function advisory(before,op){
    let after;
    try{after=operate(before,op);}catch{return [];}
    const abs=a=>a[0]<0n?neg(a):a;
    const greater=(a,b)=>a[0]*b[1]>b[0]*a[1];
    const values=e=>e.flat(),terms=e=>values(e).filter(v=>!zero(v)).length;
    const fractions=e=>values(e).filter(v=>!zero(v)&&v[1]!==1n).length;
    // Removing a term or clearing a fraction is useful even if another number grows.
    if(terms(after)<terms(before)||fractions(after)<fractions(before)||isTerminal(after)&&!isTerminal(before))return [];
    if(terms(after)>terms(before))return ['Es kommt ein weiterer Term hinzu, ohne dass ein anderer verschwindet.'];
    if(fractions(after)>fractions(before))return ['Es entstehen zusätzliche Brüche, ohne dass ein Term verschwindet.'];
    const max=e=>values(e).reduce((m,v)=>greater(abs(v),m)?abs(v):m,z);
    if(greater(max(after),mul(max(before),q(10))))
      return ['Die Zahlen oder Faktoren werden deutlich größer, ohne dass ein Term verschwindet.'];
    return [];
  }

  const draw=(rng,min,max)=>min+Math.floor(rng()*(max-min+1));
  function nonzero(rng,min=-5,max=5){let n;do{n=draw(rng,min,max);}while(!n);return n;}
  function xpart(n){return n===1?'x':n===-1?'-x':`${n}x`;}
  function joined(...parts){return parts.reduce((s,p,i)=>i===0?p:s+(p.startsWith('-')?' - '+p.slice(1):' + '+p),'');}
  function bracket(k,t){return joined(xpart(k),String(t));}
  function productBracket(k,t){return `${k}(${bracket(1,t)})`;}
  function side(A,B,shape,rng){
    let p=nonzero(rng),u=nonzero(rng);
    const t=nonzero(rng),v=nonzero(rng);
    if([0,2,5].includes(shape)&&p===A||[1,3].includes(shape)&&p===-A)p+=p===-1?-1:1;
    if(shape===4&&A-p+u===0)u+=u===-1?-1:1;
    switch(shape){
      case 0:return joined(productBracket(p,t),xpart(A-p),String(B-p*t));
      case 1:return joined(xpart(A+p),`(${joined(xpart(p),String(t))})`.replace(/^/,'-'),String(B+t));
      case 2:return joined(xpart(p),xpart(A-p),String(t),String(B-t));
      case 3:return joined(`-(${joined(xpart(p),String(t))})`,xpart(A+p),String(B+t));
      case 4:return joined(productBracket(p,t),`-(${joined(xpart(u),String(v))})`,xpart(A-p+u),String(B-p*t+v));
      default:return joined(`(${joined(xpart(p),String(t))})`,xpart(A-p),String(B-t));
    }
  }
  function generate(kind,rng=Math.random){
    if(!['unique','all','none'].includes(kind))throw Error('Unbekannter Gleichungstyp.');
    const A=nonzero(rng,-6,6);
    let C=kind==='unique'?nonzero(rng,-6,6):A;
    if(kind==='unique'&&A===C)C=C===6?5:C+1;
    const B=draw(rng,-8,8),D=kind==='all'?B:kind==='none'?B+nonzero(rng,-6,6):draw(rng,-8,8);
    const shape=draw(rng,0,5);
    const left=side(A,B,shape,rng),right=side(C,D,(shape+1+draw(rng,0,3))%6,rng);
    return `${left} = ${right}`;
  }
  return {q,add,neg,mul,div,eq,zero,one,z,same,plus,scale,analyze,parse,equation,qt,term,et,operate,classify,solution,isTerminal,suggestOperation,advisory,generate};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=Algebra;
