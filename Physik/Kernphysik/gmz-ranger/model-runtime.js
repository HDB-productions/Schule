/*! Three.js MIT license
The MIT License

Copyright © 2010-2025 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/const gmzThreeCore=(()=>{const Mn={};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jt={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Dt={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Oe=0,Xt=1,ri=2,Tn=3,en=0,tn=1,ln=2,_s=3,gr=0,Bi=1,Xe=2,Ut=0,si=1,$i=2,Nn=3,Re=4,Ve=5,Ke=100,Ce=101,He=102,bt=103,Tt=104,Et=200,rn=201,Zt=202,Kt=203,pn=204,Bn=205,mn=206,mt=207,Gn=208,yn=209,ai=210,Qn=211,hn=212,fi=213,ft=214,sn=0,kn=1,yi=2,Zn=3,_r=4,rl=5,Zr=6,vi=7,$r=0,sl=1,io=2,Ma=0,ro=1,Ji=2,al=3,Hs=4,Ws=5,ol=6,ll=7,Sa="attached",Jr="detached",xs=300,Kr=301,so=302,Xs=303,Oi=304,Ki=306,Qi=1e3,Ii=1001,Rr=1002,Mi=1003,qs=1004,cl=1004,xr=1005,ji=1005,$n=1006,Ys=1007,Ir=1007,Pr=1008,Lr=1008,ys=1009,ba=1010,vs=1011,Zs=1012,ao=1013,$s=1014,Dr=1015,oo=1016,On=1017,hr=1018,er=1020,Ur=35902,Si=35899,Js=1021,yr=1022,bi=1023,Fr=1026,Pi=1027,zi=1028,Qr=1029,Ms=1030,Ss=1031,lo=1032,bs=1033,jr=33776,Ta=33777,es=33778,ts=33779,Ts=35840,co=35841,hi=35842,Ks=35843,ho=36196,uo=37492,ns=37496,Qs=37808,As=37809,fo=37810,Aa=37811,po=37812,mo=37813,vr=37814,Ea=37815,Nr=37816,ur=37817,dr=37818,is=37819,go=37820,rs=37821,ss=36492,Br=36494,Es=36495,js=36283,ws=36284,wa=36285,_o=36286,Or=2200,Gi=2201,Cs=2202,zr=2300,as=2301,Rs=2302,fr=2400,tr=2401,Gr=2402,os=2500,Mr=2501,ea=0,Ca=1,Ra=2,Vn=3200,y=3201,z=3202,V=3203,ne=0,ye=1,le="",$e="srgb",Mt="srgb-linear",wt="linear",Bt="srgb",Sn=0,Rn=7680,Sr=7681,pi=7682,Is=7683,ls=34055,xo=34056,yo=5386,nc=512,ic=513,rc=514,sc=515,ac=516,oc=517,lc=518,vo=519,cc=512,hc=513,Qc=514,jc=515,hl=516,su=517,eh=518,th=519,Ia=35044,uc=35048,au=35040,nh=35045,ou=35049,lu=35041,cu=35046,hu=35050,uu=35042,du="100",fu="300 es",br=2e3,Pa=2001,pu={COMPUTE:"compute",RENDER:"render"},mu={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},gu={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"};class cs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const Ti=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ih=1234567;const ta=Math.PI/180,La=180/Math.PI;function nr(){const u=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ti[u&255]+Ti[u>>8&255]+Ti[u>>16&255]+Ti[u>>24&255]+"-"+Ti[e&255]+Ti[e>>8&255]+"-"+Ti[e>>16&15|64]+Ti[e>>24&255]+"-"+Ti[t&63|128]+Ti[t>>8&255]+"-"+Ti[t>>16&255]+Ti[t>>24&255]+Ti[n&255]+Ti[n>>8&255]+Ti[n>>16&255]+Ti[n>>24&255]).toLowerCase()}function At(u,e,t){return Math.max(e,Math.min(t,u))}function dc(u,e){return(u%e+e)%e}function _u(u,e,t,n,i){return n+(u-e)*(i-n)/(t-e)}function xu(u,e,t){return u!==e?(t-u)/(e-u):0}function Mo(u,e,t){return(1-t)*u+t*e}function yu(u,e,t,n){return Mo(u,e,1-Math.exp(-t*n))}function vu(u,e=1){return e-Math.abs(dc(u,e*2)-e)}function Mu(u,e,t){return u<=e?0:u>=t?1:(u=(u-e)/(t-e),u*u*(3-2*u))}function Su(u,e,t){return u<=e?0:u>=t?1:(u=(u-e)/(t-e),u*u*u*(u*(u*6-15)+10))}function bu(u,e){return u+Math.floor(Math.random()*(e-u+1))}function Tu(u,e){return u+Math.random()*(e-u)}function Au(u){return u*(.5-Math.random())}function Eu(u){u!==void 0&&(ih=u);let e=ih+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function wu(u){return u*ta}function Cu(u){return u*La}function Ru(u){return(u&u-1)===0&&u!==0}function Iu(u){return Math.pow(2,Math.ceil(Math.log(u)/Math.LN2))}function Pu(u){return Math.pow(2,Math.floor(Math.log(u)/Math.LN2))}function Lu(u,e,t,n,i){const r=Math.cos,s=Math.sin,a=r(t/2),l=s(t/2),c=r((e+n)/2),d=s((e+n)/2),p=r((e-n)/2),m=s((e-n)/2),g=r((n-e)/2),_=s((n-e)/2);switch(i){case"XYX":u.set(a*d,l*p,l*m,a*c);break;case"YZY":u.set(l*m,a*d,l*p,a*c);break;case"ZXZ":u.set(l*p,l*m,a*d,a*c);break;case"XZX":u.set(a*d,l*_,l*g,a*c);break;case"YXY":u.set(l*g,a*d,l*_,a*c);break;case"ZYZ":u.set(l*_,l*g,a*d,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Li(u,e){switch(e.constructor){case Float32Array:return u;case Uint32Array:return u/4294967295;case Uint16Array:return u/65535;case Uint8Array:return u/255;case Int32Array:return Math.max(u/2147483647,-1);case Int16Array:return Math.max(u/32767,-1);case Int8Array:return Math.max(u/127,-1);default:throw new Error("Invalid component type.")}}function Vt(u,e){switch(e.constructor){case Float32Array:return u;case Uint32Array:return Math.round(u*4294967295);case Uint16Array:return Math.round(u*65535);case Uint8Array:return Math.round(u*255);case Int32Array:return Math.round(u*2147483647);case Int16Array:return Math.round(u*32767);case Int8Array:return Math.round(u*127);default:throw new Error("Invalid component type.")}}const Du={DEG2RAD:ta,RAD2DEG:La,generateUUID:nr,clamp:At,euclideanModulo:dc,mapLinear:_u,inverseLerp:xu,lerp:Mo,damp:yu,pingpong:vu,smoothstep:Mu,smootherstep:Su,randInt:bu,randFloat:Tu,randFloatSpread:Au,seededRandom:Eu,degToRad:wu,radToDeg:Cu,isPowerOfTwo:Ru,ceilPowerOfTwo:Iu,floorPowerOfTwo:Pu,setQuaternionFromProperEuler:Lu,normalize:Vt,denormalize:Li};class Pe{constructor(e=0,t=0){Pe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=At(this.x,e.x,t.x),this.y=At(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=At(this.x,e,t),this.y=At(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(At(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(At(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*n-s*i+e.x,this.y=r*i+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ki{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,s,a){let l=n[i+0],c=n[i+1],d=n[i+2],p=n[i+3];const m=r[s+0],g=r[s+1],_=r[s+2],M=r[s+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=p;return}if(a===1){e[t+0]=m,e[t+1]=g,e[t+2]=_,e[t+3]=M;return}if(p!==M||l!==m||c!==g||d!==_){let E=1-a;const w=l*m+c*g+d*_+p*M,F=w>=0?1:-1,D=1-w*w;if(D>Number.EPSILON){const Q=Math.sqrt(D),ce=Math.atan2(Q,w*F);E=Math.sin(E*ce)/Q,a=Math.sin(a*ce)/Q}const B=a*F;if(l=l*E+m*B,c=c*E+g*B,d=d*E+_*B,p=p*E+M*B,E===1-a){const Q=1/Math.sqrt(l*l+c*c+d*d+p*p);l*=Q,c*=Q,d*=Q,p*=Q}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,i,r,s){const a=n[i],l=n[i+1],c=n[i+2],d=n[i+3],p=r[s],m=r[s+1],g=r[s+2],_=r[s+3];return e[t]=a*_+d*p+l*g-c*m,e[t+1]=l*_+d*m+c*p-a*g,e[t+2]=c*_+d*g+a*m-l*p,e[t+3]=d*_-a*p-l*m-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,s=e._order,a=Math.cos,l=Math.sin,c=a(n/2),d=a(i/2),p=a(r/2),m=l(n/2),g=l(i/2),_=l(r/2);switch(s){case"XYZ":this._x=m*d*p+c*g*_,this._y=c*g*p-m*d*_,this._z=c*d*_+m*g*p,this._w=c*d*p-m*g*_;break;case"YXZ":this._x=m*d*p+c*g*_,this._y=c*g*p-m*d*_,this._z=c*d*_-m*g*p,this._w=c*d*p+m*g*_;break;case"ZXY":this._x=m*d*p-c*g*_,this._y=c*g*p+m*d*_,this._z=c*d*_+m*g*p,this._w=c*d*p-m*g*_;break;case"ZYX":this._x=m*d*p-c*g*_,this._y=c*g*p+m*d*_,this._z=c*d*_-m*g*p,this._w=c*d*p+m*g*_;break;case"YZX":this._x=m*d*p+c*g*_,this._y=c*g*p+m*d*_,this._z=c*d*_-m*g*p,this._w=c*d*p-m*g*_;break;case"XZY":this._x=m*d*p-c*g*_,this._y=c*g*p-m*d*_,this._z=c*d*_+m*g*p,this._w=c*d*p+m*g*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],s=t[1],a=t[5],l=t[9],c=t[2],d=t[6],p=t[10],m=n+a+p;if(m>0){const g=.5/Math.sqrt(m+1);this._w=.25/g,this._x=(d-l)*g,this._y=(r-c)*g,this._z=(s-i)*g}else if(n>a&&n>p){const g=2*Math.sqrt(1+n-a-p);this._w=(d-l)/g,this._x=.25*g,this._y=(i+s)/g,this._z=(r+c)/g}else if(a>p){const g=2*Math.sqrt(1+a-n-p);this._w=(r-c)/g,this._x=(i+s)/g,this._y=.25*g,this._z=(l+d)/g}else{const g=2*Math.sqrt(1+p-n-a);this._w=(s-i)/g,this._x=(r+c)/g,this._y=(l+d)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,s=e._w,a=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+s*a+i*c-r*l,this._y=i*d+s*l+r*a-n*c,this._z=r*d+s*c+n*l-i*a,this._w=s*d-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,s=this._w;let a=s*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const g=1-t;return this._w=g*s+t*this._w,this._x=g*n+t*this._x,this._y=g*i+t*this._y,this._z=g*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),p=Math.sin((1-t)*d)/c,m=Math.sin(t*d)/c;return this._w=s*p+this._w*m,this._x=n*p+this._x*m,this._y=i*p+this._y*m,this._z=r*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,n=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,s=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*s,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*s,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,s=e.y,a=e.z,l=e.w,c=2*(s*i-a*n),d=2*(a*t-r*i),p=2*(r*n-s*t);return this.x=t+l*c+s*p-a*d,this.y=n+l*d+a*c-r*p,this.z=i+l*p+r*d-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=At(this.x,e.x,t.x),this.y=At(this.y,e.y,t.y),this.z=At(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=At(this.x,e,t),this.y=At(this.y,e,t),this.z=At(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(At(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,s=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*s-n*l,this.z=n*a-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return fc.copy(this).projectOnVector(e),this.sub(fc)}reflect(e){return this.sub(fc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(At(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fc=new U,rh=new ki;class Tr{constructor(e,t,n,i,r,s,a,l,c){Tr.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,s,a,l,c)}set(e,t,n,i,r,s,a,l,c){const d=this.elements;return d[0]=e,d[1]=i,d[2]=a,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=s,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,s=n[0],a=n[3],l=n[6],c=n[1],d=n[4],p=n[7],m=n[2],g=n[5],_=n[8],M=i[0],E=i[3],w=i[6],F=i[1],D=i[4],B=i[7],Q=i[2],ce=i[5],xe=i[8];return r[0]=s*M+a*F+l*Q,r[3]=s*E+a*D+l*ce,r[6]=s*w+a*B+l*xe,r[1]=c*M+d*F+p*Q,r[4]=c*E+d*D+p*ce,r[7]=c*w+d*B+p*xe,r[2]=m*M+g*F+_*Q,r[5]=m*E+g*D+_*ce,r[8]=m*w+g*B+_*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return t*s*d-t*a*c-n*r*d+n*a*l+i*r*c-i*s*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8],p=d*s-a*c,m=a*l-d*r,g=c*r-s*l,_=t*p+n*m+i*g;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/_;return e[0]=p*M,e[1]=(i*c-d*n)*M,e[2]=(a*n-i*s)*M,e[3]=m*M,e[4]=(d*t-i*l)*M,e[5]=(i*r-a*t)*M,e[6]=g*M,e[7]=(n*l-c*t)*M,e[8]=(s*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,s,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*s+c*a)+s+e,-i*c,i*l,-i*(-c*s+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(pc.makeScale(e,t)),this}rotate(e){return this.premultiply(pc.makeRotation(-e)),this}translate(e,t){return this.premultiply(pc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const pc=new Tr;function sh(u){for(let e=u.length-1;e>=0;--e)if(u[e]>=65535)return!0;return!1}const Uu={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Da(u,e){return new Uu[u](e)}function So(u){return document.createElementNS("http://www.w3.org/1999/xhtml",u)}function Fu(){const u=So("canvas");return u.style.display="block",u}const ah={};function mc(u){u in ah||(ah[u]=!0,console.warn(u))}function Nu(u,e,t){return new Promise(function(n,i){function r(){switch(u.clientWaitSync(e,u.SYNC_FLUSH_COMMANDS_BIT,0)){case u.WAIT_FAILED:i();break;case u.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const oh=new Tr().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lh=new Tr().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bu(){const u={enabled:!0,workingColorSpace:Mt,spaces:{},convert:function(i,r,s){return this.enabled===!1||r===s||!r||!s||(this.spaces[r].transfer===Bt&&(i.r=hs(i.r),i.g=hs(i.g),i.b=hs(i.b)),this.spaces[r].primaries!==this.spaces[s].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===Bt&&(i.r=Ua(i.r),i.g=Ua(i.g),i.b=Ua(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===le?wt:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,s){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return mc("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),u.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return mc("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),u.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return u.define({[Mt]:{primaries:e,whitePoint:n,transfer:wt,toXYZ:oh,fromXYZ:lh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$e},outputColorSpaceConfig:{drawingBufferColorSpace:$e}},[$e]:{primaries:e,whitePoint:n,transfer:Bt,toXYZ:oh,fromXYZ:lh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$e}}}),u}const Vi=Bu();function hs(u){return u<.04045?u*.0773993808:Math.pow(u*.9478672986+.0521327014,2.4)}function Ua(u){return u<.0031308?u*12.92:1.055*Math.pow(u,.41666)-.055}let Fa;class ch{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Fa===void 0&&(Fa=So("canvas")),Fa.width=e.width,Fa.height=e.height;const i=Fa.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Fa}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=So("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let s=0;s<r.length;s++)r[s]=hs(r[s]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(hs(t[n]/255)*255):t[n]=hs(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ou=0;class Ps{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=nr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let s=0,a=i.length;s<a;s++)i[s].isDataTexture?r.push(gc(i[s].image)):r.push(gc(i[s]))}else r=gc(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function gc(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap?ch.getDataURL(u):u.data?{data:Array.from(u.data),width:u.width,height:u.height,type:u.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let zu=0;const _c=new U;class Jn extends cs{constructor(e=Jn.DEFAULT_IMAGE,t=Jn.DEFAULT_MAPPING,n=Ii,i=Ii,r=$n,s=Pr,a=bi,l=ys,c=Jn.DEFAULT_ANISOTROPY,d=le){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=nr(),this.name="",this.source=new Ps(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=s,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Tr,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(_c).x}get height(){return this.source.getSize(_c).y}get depth(){return this.source.getSize(_c).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xs)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qi:e.x=e.x-Math.floor(e.x);break;case Ii:e.x=e.x<0?0:1;break;case Rr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qi:e.y=e.y-Math.floor(e.y);break;case Ii:e.y=e.y<0?0:1;break;case Rr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Jn.DEFAULT_IMAGE=null,Jn.DEFAULT_MAPPING=xs,Jn.DEFAULT_ANISOTROPY=1;class oi{constructor(e=0,t=0,n=0,i=1){oi.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i+s[12]*r,this.y=s[1]*t+s[5]*n+s[9]*i+s[13]*r,this.z=s[2]*t+s[6]*n+s[10]*i+s[14]*r,this.w=s[3]*t+s[7]*n+s[11]*i+s[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],d=l[4],p=l[8],m=l[1],g=l[5],_=l[9],M=l[2],E=l[6],w=l[10];if(Math.abs(d-m)<.01&&Math.abs(p-M)<.01&&Math.abs(_-E)<.01){if(Math.abs(d+m)<.1&&Math.abs(p+M)<.1&&Math.abs(_+E)<.1&&Math.abs(c+g+w-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const D=(c+1)/2,B=(g+1)/2,Q=(w+1)/2,ce=(d+m)/4,xe=(p+M)/4,de=(_+E)/4;return D>B&&D>Q?D<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(D),i=ce/n,r=xe/n):B>Q?B<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(B),n=ce/i,r=de/i):Q<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(Q),n=xe/r,i=de/r),this.set(n,i,r,t),this}let F=Math.sqrt((E-_)*(E-_)+(p-M)*(p-M)+(m-d)*(m-d));return Math.abs(F)<.001&&(F=1),this.x=(E-_)/F,this.y=(p-M)/F,this.z=(m-d)/F,this.w=Math.acos((c+g+w-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=At(this.x,e.x,t.x),this.y=At(this.y,e.y,t.y),this.z=At(this.z,e.z,t.z),this.w=At(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=At(this.x,e,t),this.y=At(this.y,e,t),this.z=At(this.z,e,t),this.w=At(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(At(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xc extends cs{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new oi(0,0,e,t),this.scissorTest=!1,this.viewport=new oi(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new Jn(i);this.textures=[];const s=n.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:$n,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Ps(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ul extends xc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class hh extends Jn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Mi,this.minFilter=Mi,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gu extends ul{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new hh(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class yc extends Jn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Mi,this.minFilter=Mi,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ku extends ul{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new yc(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class Ai{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ar.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ar.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ar.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,Ar):Ar.fromBufferAttribute(r,s),Ar.applyMatrix4(e.matrixWorld),this.expandByPoint(Ar);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),dl.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),dl.copy(n.boundingBox)),dl.applyMatrix4(e.matrixWorld),this.union(dl)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ar),Ar.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(bo),fl.subVectors(this.max,bo),Na.subVectors(e.a,bo),Ba.subVectors(e.b,bo),Oa.subVectors(e.c,bo),Ls.subVectors(Ba,Na),Ds.subVectors(Oa,Ba),na.subVectors(Na,Oa);let t=[0,-Ls.z,Ls.y,0,-Ds.z,Ds.y,0,-na.z,na.y,Ls.z,0,-Ls.x,Ds.z,0,-Ds.x,na.z,0,-na.x,-Ls.y,Ls.x,0,-Ds.y,Ds.x,0,-na.y,na.x,0];return!vc(t,Na,Ba,Oa,fl)||(t=[1,0,0,0,1,0,0,0,1],!vc(t,Na,Ba,Oa,fl))?!1:(pl.crossVectors(Ls,Ds),t=[pl.x,pl.y,pl.z],vc(t,Na,Ba,Oa,fl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ar).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ar).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(us[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),us[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),us[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),us[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),us[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),us[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),us[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),us[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(us),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const us=[new U,new U,new U,new U,new U,new U,new U,new U],Ar=new U,dl=new Ai,Na=new U,Ba=new U,Oa=new U,Ls=new U,Ds=new U,na=new U,bo=new U,fl=new U,pl=new U,ia=new U;function vc(u,e,t,n,i){for(let r=0,s=u.length-3;r<=s;r+=3){ia.fromArray(u,r);const a=i.x*Math.abs(ia.x)+i.y*Math.abs(ia.y)+i.z*Math.abs(ia.z),l=e.dot(ia),c=t.dot(ia),d=n.dot(ia);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const Vu=new Ai,To=new U,Mc=new U;class mi{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Vu.setFromPoints(e).getCenter(n);let i=0;for(let r=0,s=e.length;r<s;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;To.subVectors(e,this.center);const t=To.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(To,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(To.copy(e.center).add(Mc)),this.expandByPoint(To.copy(e.center).sub(Mc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ds=new U,Sc=new U,ml=new U,Us=new U,bc=new U,gl=new U,Tc=new U;class za{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ds)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ds.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ds.copy(this.origin).addScaledVector(this.direction,t),ds.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Sc.copy(e).add(t).multiplyScalar(.5),ml.copy(t).sub(e).normalize(),Us.copy(this.origin).sub(Sc);const r=e.distanceTo(t)*.5,s=-this.direction.dot(ml),a=Us.dot(this.direction),l=-Us.dot(ml),c=Us.lengthSq(),d=Math.abs(1-s*s);let p,m,g,_;if(d>0)if(p=s*l-a,m=s*a-l,_=r*d,p>=0)if(m>=-_)if(m<=_){const M=1/d;p*=M,m*=M,g=p*(p+s*m+2*a)+m*(s*p+m+2*l)+c}else m=r,p=Math.max(0,-(s*m+a)),g=-p*p+m*(m+2*l)+c;else m=-r,p=Math.max(0,-(s*m+a)),g=-p*p+m*(m+2*l)+c;else m<=-_?(p=Math.max(0,-(-s*r+a)),m=p>0?-r:Math.min(Math.max(-r,-l),r),g=-p*p+m*(m+2*l)+c):m<=_?(p=0,m=Math.min(Math.max(-r,-l),r),g=m*(m+2*l)+c):(p=Math.max(0,-(s*r+a)),m=p>0?r:Math.min(Math.max(-r,-l),r),g=-p*p+m*(m+2*l)+c);else m=s>0?-r:r,p=Math.max(0,-(s*m+a)),g=-p*p+m*(m+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),i&&i.copy(Sc).addScaledVector(ml,m),g}intersectSphere(e,t){ds.subVectors(e.center,this.origin);const n=ds.dot(this.direction),i=ds.dot(ds)-n*n,r=e.radius*e.radius;if(i>r)return null;const s=Math.sqrt(r-i),a=n-s,l=n+s;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,s,a,l;const c=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,m=this.origin;return c>=0?(n=(e.min.x-m.x)*c,i=(e.max.x-m.x)*c):(n=(e.max.x-m.x)*c,i=(e.min.x-m.x)*c),d>=0?(r=(e.min.y-m.y)*d,s=(e.max.y-m.y)*d):(r=(e.max.y-m.y)*d,s=(e.min.y-m.y)*d),n>s||r>i||((r>n||isNaN(n))&&(n=r),(s<i||isNaN(i))&&(i=s),p>=0?(a=(e.min.z-m.z)*p,l=(e.max.z-m.z)*p):(a=(e.max.z-m.z)*p,l=(e.min.z-m.z)*p),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ds)!==null}intersectTriangle(e,t,n,i,r){bc.subVectors(t,e),gl.subVectors(n,e),Tc.crossVectors(bc,gl);let s=this.direction.dot(Tc),a;if(s>0){if(i)return null;a=1}else if(s<0)a=-1,s=-s;else return null;Us.subVectors(this.origin,e);const l=a*this.direction.dot(gl.crossVectors(Us,gl));if(l<0)return null;const c=a*this.direction.dot(bc.cross(Us));if(c<0||l+c>s)return null;const d=-a*Us.dot(Tc);return d<0?null:this.at(d/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ot{constructor(e,t,n,i,r,s,a,l,c,d,p,m,g,_,M,E){Ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,s,a,l,c,d,p,m,g,_,M,E)}set(e,t,n,i,r,s,a,l,c,d,p,m,g,_,M,E){const w=this.elements;return w[0]=e,w[4]=t,w[8]=n,w[12]=i,w[1]=r,w[5]=s,w[9]=a,w[13]=l,w[2]=c,w[6]=d,w[10]=p,w[14]=m,w[3]=g,w[7]=_,w[11]=M,w[15]=E,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ot().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Ga.setFromMatrixColumn(e,0).length(),r=1/Ga.setFromMatrixColumn(e,1).length(),s=1/Ga.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,s=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),d=Math.cos(r),p=Math.sin(r);if(e.order==="XYZ"){const m=s*d,g=s*p,_=a*d,M=a*p;t[0]=l*d,t[4]=-l*p,t[8]=c,t[1]=g+_*c,t[5]=m-M*c,t[9]=-a*l,t[2]=M-m*c,t[6]=_+g*c,t[10]=s*l}else if(e.order==="YXZ"){const m=l*d,g=l*p,_=c*d,M=c*p;t[0]=m+M*a,t[4]=_*a-g,t[8]=s*c,t[1]=s*p,t[5]=s*d,t[9]=-a,t[2]=g*a-_,t[6]=M+m*a,t[10]=s*l}else if(e.order==="ZXY"){const m=l*d,g=l*p,_=c*d,M=c*p;t[0]=m-M*a,t[4]=-s*p,t[8]=_+g*a,t[1]=g+_*a,t[5]=s*d,t[9]=M-m*a,t[2]=-s*c,t[6]=a,t[10]=s*l}else if(e.order==="ZYX"){const m=s*d,g=s*p,_=a*d,M=a*p;t[0]=l*d,t[4]=_*c-g,t[8]=m*c+M,t[1]=l*p,t[5]=M*c+m,t[9]=g*c-_,t[2]=-c,t[6]=a*l,t[10]=s*l}else if(e.order==="YZX"){const m=s*l,g=s*c,_=a*l,M=a*c;t[0]=l*d,t[4]=M-m*p,t[8]=_*p+g,t[1]=p,t[5]=s*d,t[9]=-a*d,t[2]=-c*d,t[6]=g*p+_,t[10]=m-M*p}else if(e.order==="XZY"){const m=s*l,g=s*c,_=a*l,M=a*c;t[0]=l*d,t[4]=-p,t[8]=c*d,t[1]=m*p+M,t[5]=s*d,t[9]=g*p-_,t[2]=_*p-g,t[6]=a*d,t[10]=M*p+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Hu,e,Wu)}lookAt(e,t,n){const i=this.elements;return pr.subVectors(e,t),pr.lengthSq()===0&&(pr.z=1),pr.normalize(),ra.crossVectors(n,pr),ra.lengthSq()===0&&(Math.abs(n.z)===1?pr.x+=1e-4:pr.z+=1e-4,pr.normalize(),ra.crossVectors(n,pr)),ra.normalize(),Ac.crossVectors(pr,ra),i[0]=ra.x,i[4]=Ac.x,i[8]=pr.x,i[1]=ra.y,i[5]=Ac.y,i[9]=pr.y,i[2]=ra.z,i[6]=Ac.z,i[10]=pr.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,s=n[0],a=n[4],l=n[8],c=n[12],d=n[1],p=n[5],m=n[9],g=n[13],_=n[2],M=n[6],E=n[10],w=n[14],F=n[3],D=n[7],B=n[11],Q=n[15],ce=i[0],xe=i[4],de=i[8],Ie=i[12],Be=i[1],dt=i[5],Yt=i[9],Qt=i[13],Pn=i[2],Cn=i[6],_i=i[10],Ni=i[14],ms=i[3],ni=i[7],di=i[11],ii=i[15];return r[0]=s*ce+a*Be+l*Pn+c*ms,r[4]=s*xe+a*dt+l*Cn+c*ni,r[8]=s*de+a*Yt+l*_i+c*di,r[12]=s*Ie+a*Qt+l*Ni+c*ii,r[1]=d*ce+p*Be+m*Pn+g*ms,r[5]=d*xe+p*dt+m*Cn+g*ni,r[9]=d*de+p*Yt+m*_i+g*di,r[13]=d*Ie+p*Qt+m*Ni+g*ii,r[2]=_*ce+M*Be+E*Pn+w*ms,r[6]=_*xe+M*dt+E*Cn+w*ni,r[10]=_*de+M*Yt+E*_i+w*di,r[14]=_*Ie+M*Qt+E*Ni+w*ii,r[3]=F*ce+D*Be+B*Pn+Q*ms,r[7]=F*xe+D*dt+B*Cn+Q*ni,r[11]=F*de+D*Yt+B*_i+Q*di,r[15]=F*Ie+D*Qt+B*Ni+Q*ii,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],s=e[1],a=e[5],l=e[9],c=e[13],d=e[2],p=e[6],m=e[10],g=e[14],_=e[3],M=e[7],E=e[11],w=e[15];return _*(+r*l*p-i*c*p-r*a*m+n*c*m+i*a*g-n*l*g)+M*(+t*l*g-t*c*m+r*s*m-i*s*g+i*c*d-r*l*d)+E*(+t*c*p-t*a*g-r*s*p+n*s*g+r*a*d-n*c*d)+w*(-i*a*d-t*l*p+t*a*m+i*s*p-n*s*m+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8],p=e[9],m=e[10],g=e[11],_=e[12],M=e[13],E=e[14],w=e[15],F=p*E*c-M*m*c+M*l*g-a*E*g-p*l*w+a*m*w,D=_*m*c-d*E*c-_*l*g+s*E*g+d*l*w-s*m*w,B=d*M*c-_*p*c+_*a*g-s*M*g-d*a*w+s*p*w,Q=_*p*l-d*M*l-_*a*m+s*M*m+d*a*E-s*p*E,ce=t*F+n*D+i*B+r*Q;if(ce===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const xe=1/ce;return e[0]=F*xe,e[1]=(M*m*r-p*E*r-M*i*g+n*E*g+p*i*w-n*m*w)*xe,e[2]=(a*E*r-M*l*r+M*i*c-n*E*c-a*i*w+n*l*w)*xe,e[3]=(p*l*r-a*m*r-p*i*c+n*m*c+a*i*g-n*l*g)*xe,e[4]=D*xe,e[5]=(d*E*r-_*m*r+_*i*g-t*E*g-d*i*w+t*m*w)*xe,e[6]=(_*l*r-s*E*r-_*i*c+t*E*c+s*i*w-t*l*w)*xe,e[7]=(s*m*r-d*l*r+d*i*c-t*m*c-s*i*g+t*l*g)*xe,e[8]=B*xe,e[9]=(_*p*r-d*M*r-_*n*g+t*M*g+d*n*w-t*p*w)*xe,e[10]=(s*M*r-_*a*r+_*n*c-t*M*c-s*n*w+t*a*w)*xe,e[11]=(d*a*r-s*p*r-d*n*c+t*p*c+s*n*g-t*a*g)*xe,e[12]=Q*xe,e[13]=(d*M*i-_*p*i+_*n*m-t*M*m-d*n*E+t*p*E)*xe,e[14]=(_*a*i-s*M*i-_*n*l+t*M*l+s*n*E-t*a*E)*xe,e[15]=(s*p*i-d*a*i+d*n*l-t*p*l-s*n*m+t*a*m)*xe,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,s=e.x,a=e.y,l=e.z,c=r*s,d=r*a;return this.set(c*s+n,c*a-i*l,c*l+i*a,0,c*a+i*l,d*a+n,d*l-i*s,0,c*l-i*a,d*l+i*s,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,s){return this.set(1,n,r,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,s=t._y,a=t._z,l=t._w,c=r+r,d=s+s,p=a+a,m=r*c,g=r*d,_=r*p,M=s*d,E=s*p,w=a*p,F=l*c,D=l*d,B=l*p,Q=n.x,ce=n.y,xe=n.z;return i[0]=(1-(M+w))*Q,i[1]=(g+B)*Q,i[2]=(_-D)*Q,i[3]=0,i[4]=(g-B)*ce,i[5]=(1-(m+w))*ce,i[6]=(E+F)*ce,i[7]=0,i[8]=(_+D)*xe,i[9]=(E-F)*xe,i[10]=(1-(m+M))*xe,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Ga.set(i[0],i[1],i[2]).length();const s=Ga.set(i[4],i[5],i[6]).length(),a=Ga.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Er.copy(this);const c=1/r,d=1/s,p=1/a;return Er.elements[0]*=c,Er.elements[1]*=c,Er.elements[2]*=c,Er.elements[4]*=d,Er.elements[5]*=d,Er.elements[6]*=d,Er.elements[8]*=p,Er.elements[9]*=p,Er.elements[10]*=p,t.setFromRotationMatrix(Er),n.x=r,n.y=s,n.z=a,this}makePerspective(e,t,n,i,r,s,a=br,l=!1){const c=this.elements,d=2*r/(t-e),p=2*r/(n-i),m=(t+e)/(t-e),g=(n+i)/(n-i);let _,M;if(l)_=r/(s-r),M=s*r/(s-r);else if(a===br)_=-(s+r)/(s-r),M=-2*s*r/(s-r);else if(a===Pa)_=-s/(s-r),M=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=d,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=p,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,s,a=br,l=!1){const c=this.elements,d=2/(t-e),p=2/(n-i),m=-(t+e)/(t-e),g=-(n+i)/(n-i);let _,M;if(l)_=1/(s-r),M=s/(s-r);else if(a===br)_=-2/(s-r),M=-(s+r)/(s-r);else if(a===Pa)_=-1/(s-r),M=-r/(s-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=d,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=p,c[9]=0,c[13]=g,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ga=new U,Er=new Ot,Hu=new U(0,0,0),Wu=new U(1,1,1),ra=new U,Ac=new U,pr=new U,Xu=new Ot,qu=new ki;class kr{constructor(e=0,t=0,n=0,i=kr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],s=i[4],a=i[8],l=i[1],c=i[5],d=i[9],p=i[2],m=i[6],g=i[10];switch(t){case"XYZ":this._y=Math.asin(At(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,g),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-At(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(At(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,g),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-At(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,g),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(At(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-At(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-d,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qu.setFromEuler(this),this.setFromQuaternion(qu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}kr.DEFAULT_ORDER="XYZ";class uh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Gd=0;const Yu=new U,Ao=new ki,Fs=new Ot,Ec=new U,_l=new U,kd=new U,Vd=new ki,Zu=new U(1,0,0),$u=new U(0,1,0),Ju=new U(0,0,1),Ku={type:"added"},Hd={type:"removed"},Eo={type:"childadded",child:null},dh={type:"childremoved",child:null};class cn extends cs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const e=new U,t=new kr,n=new ki,i=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ot},normalMatrix:{value:new Tr}}),this.matrix=new Ot,this.matrixWorld=new Ot,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ao.setFromAxisAngle(e,t),this.quaternion.multiply(Ao),this}rotateOnWorldAxis(e,t){return Ao.setFromAxisAngle(e,t),this.quaternion.premultiply(Ao),this}rotateX(e){return this.rotateOnAxis(Zu,e)}rotateY(e){return this.rotateOnAxis($u,e)}rotateZ(e){return this.rotateOnAxis(Ju,e)}translateOnAxis(e,t){return Yu.copy(e).applyQuaternion(this.quaternion),this.position.add(Yu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zu,e)}translateY(e){return this.translateOnAxis($u,e)}translateZ(e){return this.translateOnAxis(Ju,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fs.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ec.copy(e):Ec.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),_l.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fs.lookAt(_l,Ec,this.up):Fs.lookAt(Ec,_l,this.up),this.quaternion.setFromRotationMatrix(Fs),i&&(Fs.extractRotation(i.matrixWorld),Ao.setFromRotationMatrix(Fs),this.quaternion.premultiply(Ao.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ku),Eo.child=e,this.dispatchEvent(Eo),Eo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hd),dh.child=e,this.dispatchEvent(dh),dh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fs.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fs.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fs),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ku),Eo.child=e,this.dispatchEvent(Eo),Eo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_l,e,kd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_l,Vd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const p=l[c];r(e.shapes,p)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=s(e.geometries),l=s(e.materials),c=s(e.textures),d=s(e.images),p=s(e.shapes),m=s(e.skeletons),g=s(e.animations),_=s(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),g.length>0&&(n.animations=g),_.length>0&&(n.nodes=_)}return n.object=i,n;function s(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}cn.DEFAULT_UP=new U(0,1,0),cn.DEFAULT_MATRIX_AUTO_UPDATE=!0,cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vr=new U,Ns=new U,fh=new U,Bs=new U,wo=new U,Co=new U,Qu=new U,ph=new U,mh=new U,gh=new U,_h=new oi,zt=new oi,ke=new oi;class Ln{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Vr.subVectors(e,t),i.cross(Vr);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Vr.subVectors(i,t),Ns.subVectors(n,t),fh.subVectors(e,t);const s=Vr.dot(Vr),a=Vr.dot(Ns),l=Vr.dot(fh),c=Ns.dot(Ns),d=Ns.dot(fh),p=s*c-a*a;if(p===0)return r.set(0,0,0),null;const m=1/p,g=(c*l-a*d)*m,_=(s*d-a*l)*m;return r.set(1-g-_,_,g)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Bs)===null?!1:Bs.x>=0&&Bs.y>=0&&Bs.x+Bs.y<=1}static getInterpolation(e,t,n,i,r,s,a,l){return this.getBarycoord(e,t,n,i,Bs)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Bs.x),l.addScaledVector(s,Bs.y),l.addScaledVector(a,Bs.z),l)}static getInterpolatedAttribute(e,t,n,i,r,s){return _h.setScalar(0),zt.setScalar(0),ke.setScalar(0),_h.fromBufferAttribute(e,t),zt.fromBufferAttribute(e,n),ke.fromBufferAttribute(e,i),s.setScalar(0),s.addScaledVector(_h,r.x),s.addScaledVector(zt,r.y),s.addScaledVector(ke,r.z),s}static isFrontFacing(e,t,n,i){return Vr.subVectors(n,t),Ns.subVectors(e,t),Vr.cross(Ns).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vr.subVectors(this.c,this.b),Ns.subVectors(this.a,this.b),Vr.cross(Ns).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(.3333333333333333)}getNormal(e){return Ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ln.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Ln.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let s,a;wo.subVectors(i,n),Co.subVectors(r,n),ph.subVectors(e,n);const l=wo.dot(ph),c=Co.dot(ph);if(l<=0&&c<=0)return t.copy(n);mh.subVectors(e,i);const d=wo.dot(mh),p=Co.dot(mh);if(d>=0&&p<=d)return t.copy(i);const m=l*p-d*c;if(m<=0&&l>=0&&d<=0)return s=l/(l-d),t.copy(n).addScaledVector(wo,s);gh.subVectors(e,r);const g=wo.dot(gh),_=Co.dot(gh);if(_>=0&&g<=_)return t.copy(r);const M=g*c-l*_;if(M<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(n).addScaledVector(Co,a);const E=d*_-g*p;if(E<=0&&p-d>=0&&g-_>=0)return Qu.subVectors(r,i),a=(p-d)/(p-d+(g-_)),t.copy(i).addScaledVector(Qu,a);const w=1/(E+M+m);return s=M*w,a=m*w,t.copy(n).addScaledVector(wo,s).addScaledVector(Co,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ro={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},xl={h:0,s:0,l:0};function wc(u,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<.16666666666666666?u+(e-u)*6*t:t<.5?e:t<.6666666666666666?u+(e-u)*6*(.6666666666666666-t):u}class Pt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vi.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Vi.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vi.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Vi.workingColorSpace){if(e=dc(e,1),t=At(t,0,1),n=At(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,s=2*n-r;this.r=wc(s,r,e+.3333333333333333),this.g=wc(s,r,e),this.b=wc(s,r,e-.3333333333333333)}return Vi.colorSpaceToWorking(this,i),this}setStyle(e,t=$e){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],a=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$e){const n=Ro[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hs(e.r),this.g=hs(e.g),this.b=hs(e.b),this}copyLinearToSRGB(e){return this.r=Ua(e.r),this.g=Ua(e.g),this.b=Ua(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$e){return Vi.workingToColorSpace(Ei.copy(this),e),Math.round(At(Ei.r*255,0,255))*65536+Math.round(At(Ei.g*255,0,255))*256+Math.round(At(Ei.b*255,0,255))}getHexString(e=$e){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vi.workingColorSpace){Vi.workingToColorSpace(Ei.copy(this),t);const n=Ei.r,i=Ei.g,r=Ei.b,s=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const d=(a+s)/2;if(a===s)l=0,c=0;else{const p=s-a;switch(c=d<=.5?p/(s+a):p/(2-s-a),s){case n:l=(i-r)/p+(i<r?6:0);break;case i:l=(r-n)/p+2;break;case r:l=(n-i)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Vi.workingColorSpace){return Vi.workingToColorSpace(Ei.copy(this),t),e.r=Ei.r,e.g=Ei.g,e.b=Ei.b,e}getStyle(e=$e){Vi.workingToColorSpace(Ei.copy(this),e);const t=Ei.r,n=Ei.g,i=Ei.b;return e!==$e?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+t,Hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hi),e.getHSL(xl);const n=Mo(Hi.h,xl.h,t),i=Mo(Hi.s,xl.s,t),r=Mo(Hi.l,xl.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ei=new Pt;Pt.NAMES=Ro;let ju=0;class wi extends cs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=nr(),this.name="",this.type="Material",this.blending=si,this.side=gr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=pn,this.blendDst=Bn,this.blendEquation=Ke,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=Zn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rn,this.stencilZFail=Rn,this.stencilZPass=Rn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==si&&(n.blending=this.blending),this.side!==gr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==pn&&(n.blendSrc=this.blendSrc),this.blendDst!==Bn&&(n.blendDst=this.blendDst),this.blendEquation!==Ke&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Zn&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Rn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Rn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const s=[];for(const a in r){const l=r[a];delete l.metadata,s.push(l)}return s}if(t){const r=i(e.textures),s=i(e.images);r.length>0&&(n.textures=r),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class sa extends wi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kr,this.combine=$r,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Wi=xh();function xh(){const u=new ArrayBuffer(4),e=new Float32Array(u),t=new Uint32Array(u),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),s=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,d=0;for(;(c&8388608)===0;)c<<=1,d-=8388608;c&=-8388609,d+=947912704,r[l]=c|d}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)s[l]=l<<23;s[31]=1199570944,s[32]=2147483648;for(let l=33;l<63;++l)s[l]=2147483648+(l-32<<23);s[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:s,offsetTable:a}}function jn(u){Math.abs(u)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),u=At(u,-65504,65504),Wi.floatView[0]=u;const e=Wi.uint32View[0],t=e>>23&511;return Wi.baseTable[t]+((e&8388607)>>Wi.shiftTable[t])}function aa(u){const e=u>>10;return Wi.uint32View[0]=Wi.mantissaTable[Wi.offsetTable[e]+(u&1023)]+Wi.exponentTable[e],Wi.floatView[0]}class yh{static toHalfFloat(e){return jn(e)}static fromHalfFloat(e){return aa(e)}}const Hn=new U,ka=new Pe;let Cc=0;class An{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ia,this.updateRanges=[],this.gpuType=Dr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ka.fromBufferAttribute(this,t),ka.applyMatrix3(e),this.setXY(t,ka.x,ka.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Hn.fromBufferAttribute(this,t),Hn.applyMatrix3(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Hn.fromBufferAttribute(this,t),Hn.applyMatrix4(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Hn.fromBufferAttribute(this,t),Hn.applyNormalMatrix(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Hn.fromBufferAttribute(this,t),Hn.transformDirection(e),this.setXYZ(t,Hn.x,Hn.y,Hn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Li(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Li(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Li(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ia&&(e.usage=this.usage),e}}class oa extends An{constructor(e,t,n){super(new Int8Array(e),t,n)}}class Va extends An{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class vh extends An{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class ed extends An{constructor(e,t,n){super(new Int16Array(e),t,n)}}class yl extends An{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class td extends An{constructor(e,t,n){super(new Int32Array(e),t,n)}}class Rc extends An{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class vl extends An{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=aa(this.array[e*this.itemSize]);return this.normalized&&(t=Li(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=jn(t),this}getY(e){let t=aa(this.array[e*this.itemSize+1]);return this.normalized&&(t=Li(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=jn(t),this}getZ(e){let t=aa(this.array[e*this.itemSize+2]);return this.normalized&&(t=Li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=jn(t),this}getW(e){let t=aa(this.array[e*this.itemSize+3]);return this.normalized&&(t=Li(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=jn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.array[e+0]=jn(t),this.array[e+1]=jn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array)),this.array[e+0]=jn(t),this.array[e+1]=jn(n),this.array[e+2]=jn(i),this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array),r=Vt(r,this.array)),this.array[e+0]=jn(t),this.array[e+1]=jn(n),this.array[e+2]=jn(i),this.array[e+3]=jn(r),this}}class et extends An{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Mh=0;const ir=new Ot,Io=new cn,Ha=new U,rr=new Ai,Po=new Ai,ui=new U;class qt extends cs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mh++}),this.uuid=nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sh(e)?Rc:yl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Tr().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ir.makeRotationFromQuaternion(e),this.applyMatrix4(ir),this}rotateX(e){return ir.makeRotationX(e),this.applyMatrix4(ir),this}rotateY(e){return ir.makeRotationY(e),this.applyMatrix4(ir),this}rotateZ(e){return ir.makeRotationZ(e),this.applyMatrix4(ir),this}translate(e,t,n){return ir.makeTranslation(e,t,n),this.applyMatrix4(ir),this}scale(e,t,n){return ir.makeScale(e,t,n),this.applyMatrix4(ir),this}lookAt(e){return Io.lookAt(e),Io.updateMatrix(),this.applyMatrix4(Io.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ha).negate(),this.translate(Ha.x,Ha.y,Ha.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new et(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];rr.setFromBufferAttribute(r),this.morphTargetsRelative?(ui.addVectors(this.boundingBox.min,rr.min),this.boundingBox.expandByPoint(ui),ui.addVectors(this.boundingBox.max,rr.max),this.boundingBox.expandByPoint(ui)):(this.boundingBox.expandByPoint(rr.min),this.boundingBox.expandByPoint(rr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(rr.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];Po.setFromBufferAttribute(a),this.morphTargetsRelative?(ui.addVectors(rr.min,Po.min),rr.expandByPoint(ui),ui.addVectors(rr.max,Po.max),rr.expandByPoint(ui)):(rr.expandByPoint(Po.min),rr.expandByPoint(Po.max))}rr.getCenter(n);let i=0;for(let r=0,s=e.count;r<s;r++)ui.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(ui));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)ui.fromBufferAttribute(a,c),l&&(Ha.fromBufferAttribute(e,c),ui.add(Ha)),i=Math.max(i,n.distanceToSquared(ui))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new An(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),a=[],l=[];for(let de=0;de<n.count;de++)a[de]=new U,l[de]=new U;const c=new U,d=new U,p=new U,m=new Pe,g=new Pe,_=new Pe,M=new U,E=new U;function w(de,Ie,Be){c.fromBufferAttribute(n,de),d.fromBufferAttribute(n,Ie),p.fromBufferAttribute(n,Be),m.fromBufferAttribute(r,de),g.fromBufferAttribute(r,Ie),_.fromBufferAttribute(r,Be),d.sub(c),p.sub(c),g.sub(m),_.sub(m);const dt=1/(g.x*_.y-_.x*g.y);isFinite(dt)&&(M.copy(d).multiplyScalar(_.y).addScaledVector(p,-g.y).multiplyScalar(dt),E.copy(p).multiplyScalar(g.x).addScaledVector(d,-_.x).multiplyScalar(dt),a[de].add(M),a[Ie].add(M),a[Be].add(M),l[de].add(E),l[Ie].add(E),l[Be].add(E))}let F=this.groups;F.length===0&&(F=[{start:0,count:e.count}]);for(let de=0,Ie=F.length;de<Ie;++de){const Be=F[de],dt=Be.start,Yt=Be.count;for(let Qt=dt,Pn=dt+Yt;Qt<Pn;Qt+=3)w(e.getX(Qt+0),e.getX(Qt+1),e.getX(Qt+2))}const D=new U,B=new U,Q=new U,ce=new U;function xe(de){Q.fromBufferAttribute(i,de),ce.copy(Q);const Ie=a[de];D.copy(Ie),D.sub(Q.multiplyScalar(Q.dot(Ie))).normalize(),B.crossVectors(ce,Ie);const dt=B.dot(l[de])<0?-1:1;s.setXYZW(de,D.x,D.y,D.z,dt)}for(let de=0,Ie=F.length;de<Ie;++de){const Be=F[de],dt=Be.start,Yt=Be.count;for(let Qt=dt,Pn=dt+Yt;Qt<Pn;Qt+=3)xe(e.getX(Qt+0)),xe(e.getX(Qt+1)),xe(e.getX(Qt+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new An(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,g=n.count;m<g;m++)n.setXYZ(m,0,0,0);const i=new U,r=new U,s=new U,a=new U,l=new U,c=new U,d=new U,p=new U;if(e)for(let m=0,g=e.count;m<g;m+=3){const _=e.getX(m+0),M=e.getX(m+1),E=e.getX(m+2);i.fromBufferAttribute(t,_),r.fromBufferAttribute(t,M),s.fromBufferAttribute(t,E),d.subVectors(s,r),p.subVectors(i,r),d.cross(p),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,E),a.add(d),l.add(d),c.add(d),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(E,c.x,c.y,c.z)}else for(let m=0,g=t.count;m<g;m+=3)i.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),s.fromBufferAttribute(t,m+2),d.subVectors(s,r),p.subVectors(i,r),d.cross(p),n.setXYZ(m+0,d.x,d.y,d.z),n.setXYZ(m+1,d.x,d.y,d.z),n.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ui.fromBufferAttribute(e,t),ui.normalize(),e.setXYZ(t,ui.x,ui.y,ui.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,p=a.normalized,m=new c.constructor(l.length*d);let g=0,_=0;for(let M=0,E=l.length;M<E;M++){a.isInterleavedBufferAttribute?g=l[M]*a.data.stride+a.offset:g=l[M]*d;for(let w=0;w<d;w++)m[_++]=c[g++]}return new An(m,d,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let d=0,p=c.length;d<p;d++){const m=c[d],g=e(m,n);l.push(g)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,l=s.length;a<l;a++){const c=s[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let p=0,m=c.length;p<m;p++){const g=c[p];d.push(g.toJSON(e.data))}d.length>0&&(i[l]=d,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const d=i[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],p=r[c];for(let m=0,g=p.length;m<g;m++)d.push(p[m].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,d=s.length;c<d;c++){const p=s[c];this.addGroup(p.start,p.count,p.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Sh=new Ot,la=new za,Lo=new mi,Ic=new U,Do=new U,Uo=new U,Fo=new U,Ml=new U,No=new U,Pc=new U,Bo=new U;class sr extends cn{constructor(e=new qt,t=new sa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){No.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=a[l],p=r[l];d!==0&&(Ml.fromBufferAttribute(p,e),s?No.addScaledVector(Ml,d):No.addScaledVector(Ml.sub(t),d))}t.add(No)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Lo.copy(n.boundingSphere),Lo.applyMatrix4(r),la.copy(e.ray).recast(e.near),!(Lo.containsPoint(la.origin)===!1&&(la.intersectSphere(Lo,Ic)===null||la.origin.distanceToSquared(Ic)>(e.far-e.near)**2))&&(Sh.copy(r).invert(),la.copy(e.ray).applyMatrix4(Sh),!(n.boundingBox!==null&&la.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,la)))}_computeIntersections(e,t,n){let i;const r=this.geometry,s=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,p=r.attributes.normal,m=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(s))for(let _=0,M=m.length;_<M;_++){const E=m[_],w=s[E.materialIndex],F=Math.max(E.start,g.start),D=Math.min(a.count,Math.min(E.start+E.count,g.start+g.count));for(let B=F,Q=D;B<Q;B+=3){const ce=a.getX(B),xe=a.getX(B+1),de=a.getX(B+2);i=Wn(this,w,e,n,c,d,p,ce,xe,de),i&&(i.faceIndex=Math.floor(B/3),i.face.materialIndex=E.materialIndex,t.push(i))}}else{const _=Math.max(0,g.start),M=Math.min(a.count,g.start+g.count);for(let E=_,w=M;E<w;E+=3){const F=a.getX(E),D=a.getX(E+1),B=a.getX(E+2);i=Wn(this,s,e,n,c,d,p,F,D,B),i&&(i.faceIndex=Math.floor(E/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(s))for(let _=0,M=m.length;_<M;_++){const E=m[_],w=s[E.materialIndex],F=Math.max(E.start,g.start),D=Math.min(l.count,Math.min(E.start+E.count,g.start+g.count));for(let B=F,Q=D;B<Q;B+=3){const ce=B,xe=B+1,de=B+2;i=Wn(this,w,e,n,c,d,p,ce,xe,de),i&&(i.faceIndex=Math.floor(B/3),i.face.materialIndex=E.materialIndex,t.push(i))}}else{const _=Math.max(0,g.start),M=Math.min(l.count,g.start+g.count);for(let E=_,w=M;E<w;E+=3){const F=E,D=E+1,B=E+2;i=Wn(this,s,e,n,c,d,p,F,D,B),i&&(i.faceIndex=Math.floor(E/3),t.push(i))}}}}function Wa(u,e,t,n,i,r,s,a){let l;if(e.side===Bi?l=n.intersectTriangle(s,r,i,!0,a):l=n.intersectTriangle(i,r,s,e.side===gr,a),l===null)return null;Bo.copy(a),Bo.applyMatrix4(u.matrixWorld);const c=t.ray.origin.distanceTo(Bo);return c<t.near||c>t.far?null:{distance:c,point:Bo.clone(),object:u}}function Wn(u,e,t,n,i,r,s,a,l,c){u.getVertexPosition(a,Do),u.getVertexPosition(l,Uo),u.getVertexPosition(c,Fo);const d=Wa(u,e,t,n,Do,Uo,Fo,Pc);if(d){const p=new U;Ln.getBarycoord(Pc,Do,Uo,Fo,p),i&&(d.uv=Ln.getInterpolatedAttribute(i,a,l,c,p,new Pe)),r&&(d.uv1=Ln.getInterpolatedAttribute(r,a,l,c,p,new Pe)),s&&(d.normal=Ln.getInterpolatedAttribute(s,a,l,c,p,new U),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const m={a,b:l,c,normal:new U,materialIndex:0};Ln.getNormal(Do,Uo,Fo,m.normal),d.face=m,d.barycoord=p}return d}class zn extends qt{constructor(e=1,t=1,n=1,i=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:s};const a=this;i=Math.floor(i),r=Math.floor(r),s=Math.floor(s);const l=[],c=[],d=[],p=[];let m=0,g=0;_("z","y","x",-1,-1,n,t,e,s,r,0),_("z","y","x",1,-1,n,t,-e,s,r,1),_("x","z","y",1,1,e,n,t,i,s,2),_("x","z","y",1,-1,e,n,-t,i,s,3),_("x","y","z",1,-1,e,t,n,i,r,4),_("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new et(c,3)),this.setAttribute("normal",new et(d,3)),this.setAttribute("uv",new et(p,2));function _(M,E,w,F,D,B,Q,ce,xe,de,Ie){const Be=B/xe,dt=Q/de,Yt=B/2,Qt=Q/2,Pn=ce/2,Cn=xe+1,_i=de+1;let Ni=0,ms=0;const ni=new U;for(let di=0;di<_i;di++){const ii=di*dt-Qt;for(let gs=0;gs<Cn;gs++){const Yr=gs*Be-Yt;ni[M]=Yr*F,ni[E]=ii*D,ni[w]=Pn,c.push(ni.x,ni.y,ni.z),ni[M]=0,ni[E]=0,ni[w]=ce>0?1:-1,d.push(ni.x,ni.y,ni.z),p.push(gs/xe),p.push(1-di/de),Ni+=1}}for(let di=0;di<de;di++)for(let ii=0;ii<xe;ii++){const gs=m+ii+Cn*di,Yr=m+ii+Cn*(di+1),tc=m+(ii+1)+Cn*(di+1),Kc=m+(ii+1)+Cn*di;l.push(gs,Yr,Kc),l.push(Yr,tc,Kc),ms+=6}a.addGroup(g,ms,Ie),g+=ms,m+=Ni}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Os(u){const e={};for(const t in u){e[t]={};for(const n in u[t]){const i=u[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function bh(u){const e={};for(let t=0;t<u.length;t++){const n=Os(u[t]);for(const i in n)e[i]=n[i]}return e}function nd(u){const e=[];for(let t=0;t<u.length;t++)e.push(u[t].clone());return e}function id(u){const e=u.getRenderTarget();return e===null?u.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Vi.workingColorSpace}const rd={clone:Os,merge:bh};var sd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ad=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sl extends wi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sd,this.fragmentShader=ad,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=nd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class bl extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ot,this.projectionMatrix=new Ot,this.projectionMatrixInverse=new Ot,this.coordinateSystem=br,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zs=new U,Th=new Pe,Ah=new Pe;class ar extends bl{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=La*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ta*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return La*2*Math.atan(Math.tan(ta*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zs.x,zs.y).multiplyScalar(-e/zs.z),zs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zs.x,zs.y).multiplyScalar(-e/zs.z)}getViewSize(e,t){return this.getViewBounds(e,Th,Ah),t.subVectors(Ah,Th)}setViewOffset(e,t,n,i,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ta*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;r+=s.offsetX*i/l,t-=s.offsetY*n/c,i*=s.width/l,n*=s.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Xa=-90,qa=1;class Eh extends cn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new ar(Xa,qa,e,t);i.layers=this.layers,this.add(i);const r=new ar(Xa,qa,e,t);r.layers=this.layers,this.add(r);const s=new ar(Xa,qa,e,t);s.layers=this.layers,this.add(s);const a=new ar(Xa,qa,e,t);a.layers=this.layers,this.add(a);const l=new ar(Xa,qa,e,t);l.layers=this.layers,this.add(l);const c=new ar(Xa,qa,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,s,a,l]=t;for(const c of t)this.remove(c);if(e===br)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Pa)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,l,c,d]=this.children,p=e.getRenderTarget(),m=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,s),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,i),e.render(t,d),e.setRenderTarget(p,m,g),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Tl extends Jn{constructor(e=[],t=Kr,n,i,r,s,a,l,c,d){super(e,t,n,i,r,s,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class od extends ul{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Tl(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new zn(5,5,5),r=new Sl({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Bi,blending:Ut});r.uniforms.tEquirect.value=t;const s=new sr(i,r),a=t.minFilter;return t.minFilter===Pr&&(t.minFilter=$n),new Eh(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,i);e.setRenderTarget(r)}}class Ya extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ld={type:"move"};class cd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ya,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ya,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ya,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,s=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const M of e.hand.values()){const E=t.getJointPose(M,n),w=this._getHandJoint(c,M);E!==null&&(w.matrix.fromArray(E.transform.matrix),w.matrix.decompose(w.position,w.rotation,w.scale),w.matrixWorldNeedsUpdate=!0,w.jointRadius=E.radius),w.visible=E!==null}const d=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],m=d.position.distanceTo(p.position),g=.02,_=.005;c.inputState.pinching&&m>g+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=g-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ld)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ya;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Al{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Pt(e),this.density=t}clone(){return new Al(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class El{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Pt(e),this.near=t,this.far=n}clone(){return new El(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class wh extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kr,this.environmentIntensity=1,this.environmentRotation=new kr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class wl{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ia,this.updateRanges=[],this.version=0,this.uuid=nr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=nr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=nr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Di=new U;class ca{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Di.fromBufferAttribute(this,t),Di.applyMatrix4(e),this.setXYZ(t,Di.x,Di.y,Di.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Di.fromBufferAttribute(this,t),Di.applyNormalMatrix(e),this.setXYZ(t,Di.x,Di.y,Di.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Di.fromBufferAttribute(this,t),Di.transformDirection(e),this.setXYZ(t,Di.x,Di.y,Di.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Li(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Li(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Li(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Li(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array),r=Vt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new An(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ca(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Lc extends wi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Za;const Oo=new U,$a=new U,Ja=new U,Ka=new Pe,zo=new Pe,Ch=new Ot,Cl=new U,Go=new U,Rl=new U,Rh=new Pe,Dc=new Pe,Ih=new Pe;class Ph extends cn{constructor(e=new Lc){if(super(),this.isSprite=!0,this.type="Sprite",Za===void 0){Za=new qt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new wl(t,5);Za.setIndex([0,1,2,0,2,3]),Za.setAttribute("position",new ca(n,3,0,!1)),Za.setAttribute("uv",new ca(n,2,3,!1))}this.geometry=Za,this.material=e,this.center=new Pe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),$a.setFromMatrixScale(this.matrixWorld),Ch.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ja.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&$a.multiplyScalar(-Ja.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const s=this.center;Il(Cl.set(-.5,-.5,0),Ja,s,$a,i,r),Il(Go.set(.5,-.5,0),Ja,s,$a,i,r),Il(Rl.set(.5,.5,0),Ja,s,$a,i,r),Rh.set(0,0),Dc.set(1,0),Ih.set(1,1);let a=e.ray.intersectTriangle(Cl,Go,Rl,!1,Oo);if(a===null&&(Il(Go.set(-.5,.5,0),Ja,s,$a,i,r),Dc.set(0,1),a=e.ray.intersectTriangle(Cl,Rl,Go,!1,Oo),a===null))return;const l=e.ray.origin.distanceTo(Oo);l<e.near||l>e.far||t.push({distance:l,point:Oo.clone(),uv:Ln.getInterpolation(Oo,Cl,Go,Rl,Rh,Dc,Ih,new Pe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Il(u,e,t,n,i,r){Ka.subVectors(u,t).addScalar(.5).multiply(n),i!==void 0?(zo.x=r*Ka.x-i*Ka.y,zo.y=i*Ka.x+r*Ka.y):zo.copy(Ka),u.copy(e),u.x+=zo.x,u.y+=zo.y,u.applyMatrix4(Ch)}const Pl=new U,Ll=new U;class Uc extends cn{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const r=t[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let r;for(r=0;r<i.length&&!(t<i[r].distance);r++);return i.splice(r,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let r=t[n].distance;if(t[n].object.visible&&(r-=r*t[n].hysteresis),e<r)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Pl.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(Pl);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){Pl.setFromMatrixPosition(e.matrixWorld),Ll.setFromMatrixPosition(this.matrixWorld);const n=Pl.distanceTo(Ll)/e.zoom;t[0].object.visible=!0;let i,r;for(i=1,r=t.length;i<r;i++){let s=t[i].distance;if(t[i].object.visible&&(s-=s*t[i].hysteresis),n>=s)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,r=n.length;i<r;i++){const s=n[i];t.object.levels.push({object:s.object.uuid,distance:s.distance,hysteresis:s.hysteresis})}return t}}const Lh=new U,ko=new oi,Fc=new oi,hd=new U,Dh=new Ot,Dl=new U,Ul=new mi,Uh=new Ot,Fl=new za;class Fh extends sr{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Sa,this.bindMatrix=new Ot,this.bindMatrixInverse=new Ot,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ai),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Dl),this.boundingBox.expandByPoint(Dl)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Dl),this.boundingSphere.expandByPoint(Dl)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ul.copy(this.boundingSphere),Ul.applyMatrix4(i),e.ray.intersectsSphere(Ul)!==!1&&(Uh.copy(i).invert(),Fl.copy(e.ray).applyMatrix4(Uh),!(this.boundingBox!==null&&Fl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Fl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new oi,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Sa?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Jr?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;ko.fromBufferAttribute(i.attributes.skinIndex,e),Fc.fromBufferAttribute(i.attributes.skinWeight,e),Lh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const s=Fc.getComponent(r);if(s!==0){const a=ko.getComponent(r);Dh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(hd.copy(Lh).applyMatrix4(Dh),s)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Nc extends cn{constructor(){super(),this.isBone=!0,this.type="Bone"}}class or extends Jn{constructor(e=null,t=1,n=1,i,r,s,a,l,c=Mi,d=Mi,p,m){super(null,s,a,l,c,d,i,r,p,m),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Nh=new Ot,ud=new Ot;class Nl{constructor(e=[],t=[]){this.uuid=nr(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ot)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ot;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,s=e.length;r<s;r++){const a=e[r]?e[r].matrixWorld:ud;Nh.multiplyMatrices(a,t[r]),Nh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Nl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new or(t,e,e,bi,Dr);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let s=t[r];s===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),s=new Nc),this.bones.push(s),this.boneInverses.push(new Ot().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const s=t[i];e.bones.push(s.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class Qa extends An{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Hr=new Ot,Bc=new Ot,Vo=[],Bh=new Ai,Oc=new Ot,Ho=new sr,Wo=new mi;class Oh extends sr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Qa(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Oc)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ai),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hr),Bh.copy(e.boundingBox).applyMatrix4(Hr),this.boundingBox.union(Bh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new mi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hr),Wo.copy(e.boundingSphere).applyMatrix4(Hr),this.boundingSphere.union(Wo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,s=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[s+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ho.geometry=this.geometry,Ho.material=this.material,Ho.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wo.copy(this.boundingSphere),Wo.applyMatrix4(n),e.ray.intersectsSphere(Wo)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Hr),Bc.multiplyMatrices(n,Hr),Ho.matrixWorld=Bc,Ho.raycast(e,Vo);for(let s=0,a=Vo.length;s<a;s++){const l=Vo[s];l.instanceId=r,l.object=this,t.push(l)}Vo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Qa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new or(new Float32Array(i*this.count),i,this.count,zi,Dr));const r=this.morphTexture.source.data.data;let s=0;for(let c=0;c<n.length;c++)s+=n[c];const a=this.geometry.morphTargetsRelative?1:1-s,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Bl=new U,dd=new U,zh=new Tr;class ha{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Bl.subVectors(n,t).cross(dd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Bl),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||zh.getNormalMatrix(e),i=this.coplanarPoint(Bl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ua=new mi,fd=new Pe(.5,.5),Ol=new U;class zl{constructor(e=new ha,t=new ha,n=new ha,i=new ha,r=new ha,s=new ha){this.planes=[e,t,n,i,r,s]}set(e,t,n,i,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=br,n=!1){const i=this.planes,r=e.elements,s=r[0],a=r[1],l=r[2],c=r[3],d=r[4],p=r[5],m=r[6],g=r[7],_=r[8],M=r[9],E=r[10],w=r[11],F=r[12],D=r[13],B=r[14],Q=r[15];if(i[0].setComponents(c-s,g-d,w-_,Q-F).normalize(),i[1].setComponents(c+s,g+d,w+_,Q+F).normalize(),i[2].setComponents(c+a,g+p,w+M,Q+D).normalize(),i[3].setComponents(c-a,g-p,w-M,Q-D).normalize(),n)i[4].setComponents(l,m,E,B).normalize(),i[5].setComponents(c-l,g-m,w-E,Q-B).normalize();else if(i[4].setComponents(c-l,g-m,w-E,Q-B).normalize(),t===br)i[5].setComponents(c+l,g+m,w+E,Q+B).normalize();else if(t===Pa)i[5].setComponents(l,m,E,B).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ua.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ua.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ua)}intersectsSprite(e){ua.center.set(0,0,0);const t=fd.distanceTo(e.center);return ua.radius=.7071067811865476+t,ua.applyMatrix4(e.matrixWorld),this.intersectsSphere(ua)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ol.x=i.normal.x>0?e.max.x:e.min.x,Ol.y=i.normal.y>0?e.max.y:e.min.y,Ol.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ol)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Wr=new Ot,Xr=new zl;class Gl{constructor(){this.coordinateSystem=br}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Wr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Xr.setFromProjectionMatrix(Wr,i.coordinateSystem,i.reversedDepth),Xr.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Wr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Xr.setFromProjectionMatrix(Wr,i.coordinateSystem,i.reversedDepth),Xr.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Wr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Xr.setFromProjectionMatrix(Wr,i.coordinateSystem,i.reversedDepth),Xr.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Wr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Xr.setFromProjectionMatrix(Wr,i.coordinateSystem,i.reversedDepth),Xr.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Wr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Xr.setFromProjectionMatrix(Wr,i.coordinateSystem,i.reversedDepth),Xr.containsPoint(e))return!0}return!1}clone(){return new Gl}}function zc(u,e){return u-e}function pd(u,e){return u.z-e.z}function md(u,e){return e.z-u.z}class gd{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){const r=this.pool,s=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});const a=r[this.index];s.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}}const Ui=new Ot,Gh=new Pt(1,1,1),kh=new zl,_d=new Gl,kl=new Ai,da=new mi,Xo=new U,Vh=new U,Hh=new U,Gc=new gd,Ci=new sr,Vl=[];function xd(u,e,t=0){const n=e.itemSize;if(u.isInterleavedBufferAttribute||u.array.constructor!==e.array.constructor){const i=u.count;for(let r=0;r<i;r++)for(let s=0;s<n;s++)e.setComponent(r+t,s,u.getComponent(r,s))}else e.array.set(u.array,t*n);e.needsUpdate=!0}function fa(u,e){if(u.constructor!==e.constructor){const t=Math.min(u.length,e.length);for(let n=0;n<t;n++)e[n]=u[n]}else{const t=Math.min(u.length,e.length);e.set(new u.constructor(u.buffer,0,t))}}class Wh extends sr{constructor(e,t,n=t*2,i){super(new qt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new or(t,e,e,bi,Dr);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new or(t,e,e,Qr,$s);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new or(t,e,e,bi,Dr);n.colorSpace=Vi.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const r in e.attributes){const s=e.getAttribute(r),{array:a,itemSize:l,normalized:c}=s,d=new a.constructor(n*l),p=new An(d,l,c);t.setAttribute(r,p)}if(e.getIndex()!==null){const r=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new An(r,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),r=t.getAttribute(n);if(i.itemSize!==r.itemSize||i.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){const t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){const t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);const e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,Ui),this.getBoundingBoxAt(r,kl).applyMatrix4(Ui),e.union(kl)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mi);const e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,Ui),this.getBoundingSphereAt(r,da).applyMatrix4(Ui),e.union(da)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(zc),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));const r=this._matricesTexture;Ui.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;const s=this._colorsTexture;return s&&(Gh.toArray(s.image.data,i*4),s.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);const i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;const s=e.getIndex();if(s!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?s.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(zc),l=this._availableGeometryIds.shift(),r[l]=i):(l=this._geometryCount,this._geometryCount++,r.push(i)),this.setGeometryAt(l,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,r=n.getIndex(),s=t.getIndex(),a=this._geometryInfo[e];if(i&&s.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(const d in n.attributes){const p=t.getAttribute(d),m=n.getAttribute(d);xd(p,m,l);const g=p.itemSize;for(let _=p.count,M=c;_<M;_++){const E=l+_;for(let w=0;w<g;w++)m.setComponent(E,w,0)}m.needsUpdate=!0,m.addUpdateRange(l*g,c*g)}if(i){const d=a.indexStart,p=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let m=0;m<s.count;m++)r.setX(d+m,l+s.getX(m));for(let m=s.count,g=p;m<g;m++)r.setX(d+m,l);r.needsUpdate=!0,r.addUpdateRange(d,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){const t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;const n=this._instanceInfo;for(let i=0,r=n.length;i<r;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0;const n=this._geometryInfo,i=n.map((s,a)=>a).sort((s,a)=>n[s].vertexStart-n[a].vertexStart),r=this.geometry;for(let s=0,a=n.length;s<a;s++){const l=i[s],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==t){const{indexStart:d,vertexStart:p,reservedIndexCount:m}=c,g=r.index,_=g.array,M=e-p;for(let E=d;E<d+m;E++)_[E]=_[E]+M;g.array.copyWithin(t,d,d+m),g.addUpdateRange(t,m),c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){const{vertexStart:d,reservedVertexCount:p}=c,m=r.attributes;for(const g in m){const _=m[g],{array:M,itemSize:E}=_;M.copyWithin(e*E,d*E,(d+p)*E),_.addUpdateRange(e*E,p*E)}c.vertexStart=e}e+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart,this._nextIndexStart=r.index?c.indexStart+c.reservedIndexCount:0,this._nextVertexStart=c.vertexStart+c.reservedVertexCount}}return this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){const r=new Ai,s=n.index,a=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let d=l;s&&(d=s.getX(d)),r.expandByPoint(Xo.fromBufferAttribute(a,d))}i.boundingBox=r}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){const r=new mi;this.getBoundingBoxAt(e,kl),kl.getCenter(r.center);const s=n.index,a=n.attributes.position;let l=0;for(let c=i.start,d=i.start+i.count;c<d;c++){let p=c;s&&(p=s.getX(p)),Xo.fromBufferAttribute(a,p),l=Math.max(l,r.center.distanceToSquared(Xo))}r.radius=Math.sqrt(l),i.boundingSphere=r}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);const n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);const n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){const t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(zc);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);const i=new Int32Array(e),r=new Int32Array(e);fa(this._multiDrawCounts,i),fa(this._multiDrawStarts,r),this._multiDrawCounts=i,this._multiDrawStarts=r,this._maxInstanceCount=e;const s=this._indirectTexture,a=this._matricesTexture,l=this._colorsTexture;s.dispose(),this._initIndirectTexture(),fa(s.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),fa(a.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),fa(l.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){const n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>t)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);const r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new qt,this._initializeGeometry(r));const s=this.geometry;r.index&&fa(r.index.array,s.index.array);for(const a in r.attributes)fa(r.attributes[a].array,s.attributes[a].array)}raycast(e,t){const n=this._instanceInfo,i=this._geometryInfo,r=this.matrixWorld,s=this.geometry;Ci.material=this.material,Ci.geometry.index=s.index,Ci.geometry.attributes=s.attributes,Ci.geometry.boundingBox===null&&(Ci.geometry.boundingBox=new Ai),Ci.geometry.boundingSphere===null&&(Ci.geometry.boundingSphere=new mi);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;const c=n[a].geometryIndex,d=i[c];Ci.geometry.setDrawRange(d.start,d.count),this.getMatrixAt(a,Ci.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,Ci.geometry.boundingBox),this.getBoundingSphereAt(c,Ci.geometry.boundingSphere),Ci.raycast(e,Vl);for(let p=0,m=Vl.length;p<m;p++){const g=Vl[p];g.object=this,g.batchId=a,t.push(g)}Vl.length=0}Ci.material=null,Ci.geometry.index=null,Ci.geometry.attributes={},Ci.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const s=i.getIndex(),a=s===null?1:s.array.BYTES_PER_ELEMENT,l=this._instanceInfo,c=this._multiDrawStarts,d=this._multiDrawCounts,p=this._geometryInfo,m=this.perObjectFrustumCulled,g=this._indirectTexture,_=g.image.data,M=n.isArrayCamera?_d:kh;m&&!n.isArrayCamera&&(Ui.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),kh.setFromProjectionMatrix(Ui,n.coordinateSystem,n.reversedDepth));let E=0;if(this.sortObjects){Ui.copy(this.matrixWorld).invert(),Xo.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Ui),Vh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Ui);for(let D=0,B=l.length;D<B;D++)if(l[D].visible&&l[D].active){const Q=l[D].geometryIndex;this.getMatrixAt(D,Ui),this.getBoundingSphereAt(Q,da).applyMatrix4(Ui);let ce=!1;if(m&&(ce=!M.intersectsSphere(da,n)),!ce){const xe=p[Q],de=Hh.subVectors(da.center,Xo).dot(Vh);Gc.push(xe.start,xe.count,de,D)}}const w=Gc.list,F=this.customSort;F===null?w.sort(r.transparent?md:pd):F.call(this,w,n);for(let D=0,B=w.length;D<B;D++){const Q=w[D];c[E]=Q.start*a,d[E]=Q.count,_[E]=Q.index,E++}Gc.reset()}else for(let w=0,F=l.length;w<F;w++)if(l[w].visible&&l[w].active){const D=l[w].geometryIndex;let B=!1;if(m&&(this.getMatrixAt(w,Ui),this.getBoundingSphereAt(D,da).applyMatrix4(Ui),B=!M.intersectsSphere(da,n)),!B){const Q=p[D];c[E]=Q.start*a,d[E]=Q.count,_[E]=w,E++}}g.needsUpdate=!0,this._multiDrawCount=E,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,r,s){this.onBeforeRender(e,null,i,r,s)}}class Fi extends wi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const qo=new U,Hl=new U,Xh=new Ot,Yo=new za,Wl=new mi,fs=new U,qh=new U;class Gs extends cn{constructor(e=new qt,t=new Fi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)qo.fromBufferAttribute(t,i-1),Hl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=qo.distanceTo(Hl);e.setAttribute("lineDistance",new et(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wl.copy(n.boundingSphere),Wl.applyMatrix4(i),Wl.radius+=r,e.ray.intersectsSphere(Wl)===!1)return;Xh.copy(i).invert(),Yo.copy(e.ray).applyMatrix4(Xh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,d=n.index,m=n.attributes.position;if(d!==null){const g=Math.max(0,s.start),_=Math.min(d.count,s.start+s.count);for(let M=g,E=_-1;M<E;M+=c){const w=d.getX(M),F=d.getX(M+1),D=Xl(this,e,Yo,l,w,F,M);D&&t.push(D)}if(this.isLineLoop){const M=d.getX(_-1),E=d.getX(g),w=Xl(this,e,Yo,l,M,E,_-1);w&&t.push(w)}}else{const g=Math.max(0,s.start),_=Math.min(m.count,s.start+s.count);for(let M=g,E=_-1;M<E;M+=c){const w=Xl(this,e,Yo,l,M,M+1,M);w&&t.push(w)}if(this.isLineLoop){const M=Xl(this,e,Yo,l,_-1,g,_-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Xl(u,e,t,n,i,r,s){const a=u.geometry.attributes.position;if(qo.fromBufferAttribute(a,i),Hl.fromBufferAttribute(a,r),t.distanceSqToSegment(qo,Hl,fs,qh)>n)return;fs.applyMatrix4(u.matrixWorld);const c=e.ray.origin.distanceTo(fs);if(!(c<e.near||c>e.far))return{distance:c,point:qh.clone().applyMatrix4(u.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:u}}const Yh=new U,o=new U;class f extends Gs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Yh.fromBufferAttribute(t,i),o.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Yh.distanceTo(o);e.setAttribute("lineDistance",new et(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class h extends Gs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class x extends wi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const A=new Ot,b=new za,N=new mi,R=new U;class j extends cn{constructor(e=new qt,t=new x){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),N.copy(n.boundingSphere),N.applyMatrix4(i),N.radius+=r,e.ray.intersectsSphere(N)===!1)return;A.copy(i).invert(),b.copy(e.ray).applyMatrix4(A);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,p=n.attributes.position;if(c!==null){const m=Math.max(0,s.start),g=Math.min(c.count,s.start+s.count);for(let _=m,M=g;_<M;_++){const E=c.getX(_);R.fromBufferAttribute(p,E),Y(R,E,l,i,e,t,this)}}else{const m=Math.max(0,s.start),g=Math.min(p.count,s.start+s.count);for(let _=m,M=g;_<M;_++)R.fromBufferAttribute(p,_),Y(R,_,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Y(u,e,t,n,i,r,s){const a=b.distanceSqToPoint(u);if(a<t){const l=new U;b.closestPointToPoint(u,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class ie extends Jn{constructor(e,t,n,i,r=$n,s=$n,a,l,c){super(e,t,n,i,r,s,a,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const d=this;function p(){d.needsUpdate=!0,d._requestVideoFrameCallbackId=e.requestVideoFrameCallback(p)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(p))}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class H extends ie{constructor(e,t,n,i,r,s,a,l){super({},e,t,n,i,r,s,a,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(e){this.image=e,this.needsUpdate=!0}}class X extends Jn{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Mi,this.minFilter=Mi,this.generateMipmaps=!1,this.needsUpdate=!0}}class $ extends Jn{constructor(e,t,n,i,r,s,a,l,c,d,p,m){super(null,s,a,l,c,d,i,r,p,m),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class ge extends ${constructor(e,t,n,i,r,s){super(e,t,n,r,s),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=Ii,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ae extends ${constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,Kr),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class C extends Jn{constructor(e,t,n,i,r,s,a,l,c){super(e,t,n,i,r,s,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class v extends Jn{constructor(e,t,n=$s,i,r,s,a=Mi,l=Mi,c,d=Fr,p=1){if(d!==Fr&&d!==Pi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:p};super(m,i,r,s,a,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ps(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class re extends Jn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class J extends qt{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const s=[],a=[],l=[],c=[],d=t/2,p=Math.PI/2*e,m=t,g=2*p+m,_=n*2+r,M=i+1,E=new U,w=new U;for(let F=0;F<=_;F++){let D=0,B=0,Q=0,ce=0;if(F<=n){const Ie=F/n,Be=Ie*Math.PI/2;B=-d-e*Math.cos(Be),Q=e*Math.sin(Be),ce=-e*Math.cos(Be),D=Ie*p}else if(F<=n+r){const Ie=(F-n)/r;B=-d+Ie*t,Q=e,ce=0,D=p+Ie*m}else{const Ie=(F-n-r)/n,Be=Ie*Math.PI/2;B=d+e*Math.sin(Be),Q=e*Math.cos(Be),ce=e*Math.sin(Be),D=p+m+Ie*p}const xe=Math.max(0,Math.min(1,D/g));let de=0;F===0?de=.5/i:F===_&&(de=-.5/i);for(let Ie=0;Ie<=i;Ie++){const Be=Ie/i,dt=Be*Math.PI*2,Yt=Math.sin(dt),Qt=Math.cos(dt);w.x=-Q*Qt,w.y=B,w.z=Q*Yt,a.push(w.x,w.y,w.z),E.set(-Q*Qt,ce,Q*Yt),E.normalize(),l.push(E.x,E.y,E.z),c.push(Be+de,xe)}if(F>0){const Ie=(F-1)*M;for(let Be=0;Be<i;Be++){const dt=Ie+Be,Yt=Ie+Be+1,Qt=F*M+Be,Pn=F*M+Be+1;s.push(dt,Yt,Qt),s.push(Yt,Pn,Qt)}}}this.setIndex(s),this.setAttribute("position",new et(a,3)),this.setAttribute("normal",new et(l,3)),this.setAttribute("uv",new et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new J(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class k extends qt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],s=[],a=[],l=[],c=new U,d=new Pe;s.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let p=0,m=3;p<=t;p++,m+=3){const g=n+p/t*i;c.x=e*Math.cos(g),c.y=e*Math.sin(g),s.push(c.x,c.y,c.z),a.push(0,0,1),d.x=(s[m]/e+1)/2,d.y=(s[m+1]/e+1)/2,l.push(d.x,d.y)}for(let p=1;p<=t;p++)r.push(p,p+1,0);this.setIndex(r),this.setAttribute("position",new et(s,3)),this.setAttribute("normal",new et(a,3)),this.setAttribute("uv",new et(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new k(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class he extends qt{constructor(e=1,t=1,n=1,i=32,r=1,s=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const d=[],p=[],m=[],g=[];let _=0;const M=[],E=n/2;let w=0;F(),s===!1&&(e>0&&D(!0),t>0&&D(!1)),this.setIndex(d),this.setAttribute("position",new et(p,3)),this.setAttribute("normal",new et(m,3)),this.setAttribute("uv",new et(g,2));function F(){const B=new U,Q=new U;let ce=0;const xe=(t-e)/n;for(let de=0;de<=r;de++){const Ie=[],Be=de/r,dt=Be*(t-e)+e;for(let Yt=0;Yt<=i;Yt++){const Qt=Yt/i,Pn=Qt*l+a,Cn=Math.sin(Pn),_i=Math.cos(Pn);Q.x=dt*Cn,Q.y=-Be*n+E,Q.z=dt*_i,p.push(Q.x,Q.y,Q.z),B.set(Cn,xe,_i).normalize(),m.push(B.x,B.y,B.z),g.push(Qt,1-Be),Ie.push(_++)}M.push(Ie)}for(let de=0;de<i;de++)for(let Ie=0;Ie<r;Ie++){const Be=M[Ie][de],dt=M[Ie+1][de],Yt=M[Ie+1][de+1],Qt=M[Ie][de+1];(e>0||Ie!==0)&&(d.push(Be,dt,Qt),ce+=3),(t>0||Ie!==r-1)&&(d.push(dt,Yt,Qt),ce+=3)}c.addGroup(w,ce,0),w+=ce}function D(B){const Q=_,ce=new Pe,xe=new U;let de=0;const Ie=B===!0?e:t,Be=B===!0?1:-1;for(let Yt=1;Yt<=i;Yt++)p.push(0,E*Be,0),m.push(0,Be,0),g.push(.5,.5),_++;const dt=_;for(let Yt=0;Yt<=i;Yt++){const Pn=Yt/i*l+a,Cn=Math.cos(Pn),_i=Math.sin(Pn);xe.x=Ie*_i,xe.y=E*Be,xe.z=Ie*Cn,p.push(xe.x,xe.y,xe.z),m.push(0,Be,0),ce.x=Cn*.5+.5,ce.y=_i*.5*Be+.5,g.push(ce.x,ce.y),_++}for(let Yt=0;Yt<i;Yt++){const Qt=Q+Yt,Pn=dt+Yt;B===!0?d.push(Pn,Pn+1,Qt):d.push(Pn+1,Pn,Qt),de+=3}c.addGroup(w,de,B===!0?1:2),w+=de}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new he(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ee extends he{constructor(e=1,t=1,n=32,i=1,r=!1,s=0,a=Math.PI*2){super(0,e,t,n,i,r,s,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:s,thetaLength:a}}static fromJSON(e){return new ee(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class te extends qt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],s=[];a(i),c(n),d(),this.setAttribute("position",new et(r,3)),this.setAttribute("normal",new et(r.slice(),3)),this.setAttribute("uv",new et(s,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(F){const D=new U,B=new U,Q=new U;for(let ce=0;ce<t.length;ce+=3)g(t[ce+0],D),g(t[ce+1],B),g(t[ce+2],Q),l(D,B,Q,F)}function l(F,D,B,Q){const ce=Q+1,xe=[];for(let de=0;de<=ce;de++){xe[de]=[];const Ie=F.clone().lerp(B,de/ce),Be=D.clone().lerp(B,de/ce),dt=ce-de;for(let Yt=0;Yt<=dt;Yt++)Yt===0&&de===ce?xe[de][Yt]=Ie:xe[de][Yt]=Ie.clone().lerp(Be,Yt/dt)}for(let de=0;de<ce;de++)for(let Ie=0;Ie<2*(ce-de)-1;Ie++){const Be=Math.floor(Ie/2);Ie%2===0?(m(xe[de][Be+1]),m(xe[de+1][Be]),m(xe[de][Be])):(m(xe[de][Be+1]),m(xe[de+1][Be+1]),m(xe[de+1][Be]))}}function c(F){const D=new U;for(let B=0;B<r.length;B+=3)D.x=r[B+0],D.y=r[B+1],D.z=r[B+2],D.normalize().multiplyScalar(F),r[B+0]=D.x,r[B+1]=D.y,r[B+2]=D.z}function d(){const F=new U;for(let D=0;D<r.length;D+=3){F.x=r[D+0],F.y=r[D+1],F.z=r[D+2];const B=E(F)/2/Math.PI+.5,Q=w(F)/Math.PI+.5;s.push(B,1-Q)}_(),p()}function p(){for(let F=0;F<s.length;F+=6){const D=s[F+0],B=s[F+2],Q=s[F+4],ce=Math.max(D,B,Q),xe=Math.min(D,B,Q);ce>.9&&xe<.1&&(D<.2&&(s[F+0]+=1),B<.2&&(s[F+2]+=1),Q<.2&&(s[F+4]+=1))}}function m(F){r.push(F.x,F.y,F.z)}function g(F,D){const B=F*3;D.x=e[B+0],D.y=e[B+1],D.z=e[B+2]}function _(){const F=new U,D=new U,B=new U,Q=new U,ce=new Pe,xe=new Pe,de=new Pe;for(let Ie=0,Be=0;Ie<r.length;Ie+=9,Be+=6){F.set(r[Ie+0],r[Ie+1],r[Ie+2]),D.set(r[Ie+3],r[Ie+4],r[Ie+5]),B.set(r[Ie+6],r[Ie+7],r[Ie+8]),ce.set(s[Be+0],s[Be+1]),xe.set(s[Be+2],s[Be+3]),de.set(s[Be+4],s[Be+5]),Q.copy(F).add(D).add(B).divideScalar(3);const dt=E(Q);M(ce,Be+0,F,dt),M(xe,Be+2,D,dt),M(de,Be+4,B,dt)}}function M(F,D,B,Q){Q<0&&F.x===1&&(s[D]=F.x-1),B.x===0&&B.z===0&&(s[D]=Q/2/Math.PI+.5)}function E(F){return Math.atan2(F.z,-F.x)}function w(F){return Math.atan2(-F.y,Math.sqrt(F.x*F.x+F.z*F.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new te(e.vertices,e.indices,e.radius,e.details)}}class ve extends te{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,s,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ve(e.radius,e.detail)}}const L=new U,P=new U,Z=new U,fe=new Ln;class Ae extends qt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(ta*t),s=e.getIndex(),a=e.getAttribute("position"),l=s?s.count:a.count,c=[0,0,0],d=["a","b","c"],p=new Array(3),m={},g=[];for(let _=0;_<l;_+=3){s?(c[0]=s.getX(_),c[1]=s.getX(_+1),c[2]=s.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);const{a:M,b:E,c:w}=fe;if(M.fromBufferAttribute(a,c[0]),E.fromBufferAttribute(a,c[1]),w.fromBufferAttribute(a,c[2]),fe.getNormal(Z),p[0]=`${Math.round(M.x*i)},${Math.round(M.y*i)},${Math.round(M.z*i)}`,p[1]=`${Math.round(E.x*i)},${Math.round(E.y*i)},${Math.round(E.z*i)}`,p[2]=`${Math.round(w.x*i)},${Math.round(w.y*i)},${Math.round(w.z*i)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let F=0;F<3;F++){const D=(F+1)%3,B=p[F],Q=p[D],ce=fe[d[F]],xe=fe[d[D]],de=`${B}_${Q}`,Ie=`${Q}_${B}`;Ie in m&&m[Ie]?(Z.dot(m[Ie].normal)<=r&&(g.push(ce.x,ce.y,ce.z),g.push(xe.x,xe.y,xe.z)),m[Ie]=null):de in m||(m[de]={index0:c[F],index1:c[D],normal:Z.clone()})}}for(const _ in m)if(m[_]){const{index0:M,index1:E}=m[_];L.fromBufferAttribute(a,M),P.fromBufferAttribute(a,E),g.push(L.x,L.y,L.z),g.push(P.x,P.y,P.z)}this.setAttribute("position",new et(g,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class we{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let s=1;s<=e;s++)n=this.getPoint(s/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let s;t?s=t:s=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-s,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===s)return i/(r-1);const d=n[i],m=n[i+1]-d,g=(s-d)/m;return(i+g)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const s=this.getPoint(i),a=this.getPoint(r),l=t||(s.isVector2?new Pe:new U);return l.copy(a).sub(s).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new U,i=[],r=[],s=[],a=new U,l=new Ot;for(let g=0;g<=e;g++){const _=g/e;i[g]=this.getTangentAt(_,new U)}r[0]=new U,s[0]=new U;let c=Number.MAX_VALUE;const d=Math.abs(i[0].x),p=Math.abs(i[0].y),m=Math.abs(i[0].z);d<=c&&(c=d,n.set(1,0,0)),p<=c&&(c=p,n.set(0,1,0)),m<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),s[0].crossVectors(i[0],r[0]);for(let g=1;g<=e;g++){if(r[g]=r[g-1].clone(),s[g]=s[g-1].clone(),a.crossVectors(i[g-1],i[g]),a.length()>Number.EPSILON){a.normalize();const _=Math.acos(At(i[g-1].dot(i[g]),-1,1));r[g].applyMatrix4(l.makeRotationAxis(a,_))}s[g].crossVectors(i[g],r[g])}if(t===!0){let g=Math.acos(At(r[0].dot(r[e]),-1,1));g/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(g=-g);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(i[_],g*_)),s[_].crossVectors(i[_],r[_])}return{tangents:i,normals:r,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Se extends we{constructor(e=0,t=0,n=1,i=1,r=0,s=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=s,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new Pe){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const s=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(s?r=0:r=i),this.aClockwise===!0&&!s&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const d=Math.cos(this.aRotation),p=Math.sin(this.aRotation),m=l-this.aX,g=c-this.aY;l=m*d-g*p+this.aX,c=m*p+g*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class be extends Se{constructor(e,t,n,i,r,s){super(e,t,n,n,i,r,s),this.isArcCurve=!0,this.type="ArcCurve"}}function De(){let u=0,e=0,t=0,n=0;function i(r,s,a,l){u=r,e=a,t=-3*r+3*s-2*a-l,n=2*r-2*s+a+l}return{initCatmullRom:function(r,s,a,l,c){i(s,a,c*(a-r),c*(l-s))},initNonuniformCatmullRom:function(r,s,a,l,c,d,p){let m=(s-r)/c-(a-r)/(c+d)+(a-s)/d,g=(a-s)/d-(l-s)/(d+p)+(l-a)/p;m*=d,g*=d,i(s,a,m,g)},calc:function(r){const s=r*r,a=s*r;return u+e*r+t*s+n*a}}}const _e=new U,ot=new De,yt=new De,Ht=new De;class un extends we{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new U){const n=t,i=this.points,r=i.length,s=(r-(this.closed?0:1))*e;let a=Math.floor(s),l=s-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,d;this.closed||a>0?c=i[(a-1)%r]:(_e.subVectors(i[0],i[1]).add(i[0]),c=_e);const p=i[a%r],m=i[(a+1)%r];if(this.closed||a+2<r?d=i[(a+2)%r]:(_e.subVectors(i[r-1],i[r-2]).add(i[r-1]),d=_e),this.curveType==="centripetal"||this.curveType==="chordal"){const g=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(p),g),M=Math.pow(p.distanceToSquared(m),g),E=Math.pow(m.distanceToSquared(d),g);M<1e-4&&(M=1),_<1e-4&&(_=M),E<1e-4&&(E=M),ot.initNonuniformCatmullRom(c.x,p.x,m.x,d.x,_,M,E),yt.initNonuniformCatmullRom(c.y,p.y,m.y,d.y,_,M,E),Ht.initNonuniformCatmullRom(c.z,p.z,m.z,d.z,_,M,E)}else this.curveType==="catmullrom"&&(ot.initCatmullRom(c.x,p.x,m.x,d.x,this.tension),yt.initCatmullRom(c.y,p.y,m.y,d.y,this.tension),Ht.initCatmullRom(c.z,p.z,m.z,d.z,this.tension));return n.set(ot.calc(l),yt.calc(l),Ht.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new U().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Xn(u,e,t,n,i){const r=(n-e)*.5,s=(i-t)*.5,a=u*u,l=u*a;return(2*t-2*n+r+s)*l+(-3*t+3*n-2*r-s)*a+r*u+t}function qn(u,e){const t=1-u;return t*t*e}function bn(u,e){return 2*(1-u)*u*e}function Me(u,e){return u*u*e}function Ee(u,e,t,n){return qn(u,e)+bn(u,t)+Me(u,n)}function rt(u,e){const t=1-u;return t*t*t*e}function Lt(u,e){const t=1-u;return 3*t*t*u*e}function pt(u,e){return 3*(1-u)*u*u*e}function nn(u,e){return u*u*u*e}function ei(u,e,t,n,i){return rt(u,e)+Lt(u,t)+pt(u,n)+nn(u,i)}class O extends we{constructor(e=new Pe,t=new Pe,n=new Pe,i=new Pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new Pe){const n=t,i=this.v0,r=this.v1,s=this.v2,a=this.v3;return n.set(ei(e,i.x,r.x,s.x,a.x),ei(e,i.y,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class In extends we{constructor(e=new U,t=new U,n=new U,i=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new U){const n=t,i=this.v0,r=this.v1,s=this.v2,a=this.v3;return n.set(ei(e,i.x,r.x,s.x,a.x),ei(e,i.y,r.y,s.y,a.y),ei(e,i.z,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ft extends we{constructor(e=new Pe,t=new Pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Pe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ct extends we{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class st extends we{constructor(e=new Pe,t=new Pe,n=new Pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Pe){const n=t,i=this.v0,r=this.v1,s=this.v2;return n.set(Ee(e,i.x,r.x,s.x),Ee(e,i.y,r.y,s.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class En extends we{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){const n=t,i=this.v0,r=this.v1,s=this.v2;return n.set(Ee(e,i.x,r.x,s.x),Ee(e,i.y,r.y,s.y),Ee(e,i.z,r.z,s.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class at extends we{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Pe){const n=t,i=this.points,r=(i.length-1)*e,s=Math.floor(r),a=r-s,l=i[s===0?s:s-1],c=i[s],d=i[s>i.length-2?i.length-1:s+1],p=i[s>i.length-3?i.length-1:s+2];return n.set(Xn(a,l.x,c.x,d.x,p.x),Xn(a,l.y,c.y,d.y,p.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new Pe().fromArray(i))}return this}}var Gt=Object.freeze({__proto__:null,ArcCurve:be,CatmullRomCurve3:un,CubicBezierCurve:O,CubicBezierCurve3:In,EllipseCurve:Se,LineCurve:Ft,LineCurve3:Ct,QuadraticBezierCurve:st,QuadraticBezierCurve3:En,SplineCurve:at});class li extends we{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gt[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const s=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-s/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const s=r[i],a=s.isEllipseCurve?e*2:s.isLineCurve||s.isLineCurve3?1:s.isSplineCurve?e*s.points.length:e,l=s.getPoints(a);for(let c=0;c<l.length;c++){const d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Gt[i.type]().fromJSON(i))}return this}}class Dn extends li{constructor(e){super(),this.type="Path",this.currentPoint=new Pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Ft(this.currentPoint.clone(),new Pe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new st(this.currentPoint.clone(),new Pe(e,t),new Pe(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,s){const a=new O(this.currentPoint.clone(),new Pe(e,t),new Pe(n,i),new Pe(r,s));return this.curves.push(a),this.currentPoint.set(r,s),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new at(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,s){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,i,r,s),this}absarc(e,t,n,i,r,s){return this.absellipse(e,t,n,n,i,r,s),this}ellipse(e,t,n,i,r,s,a,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,i,r,s,a,l),this}absellipse(e,t,n,i,r,s,a,l){const c=new Se(e,t,n,i,r,s,a,l);if(this.curves.length>0){const p=c.getPoint(0);p.equals(this.currentPoint)||this.lineTo(p.x,p.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class I extends Dn{constructor(e){super(e),this.uuid=nr(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Dn().fromJSON(i))}return this}}function S(u,e,t=2){const n=e&&e.length,i=n?e[0]*t:u.length;let r=K(u,0,i,t,!0);const s=[];if(!r||r.next===r.prev)return s;let a,l,c;if(n&&(r=ct(u,e,r,t)),u.length>80*t){a=1/0,l=1/0;let d=-1/0,p=-1/0;for(let m=t;m<i;m+=t){const g=u[m],_=u[m+1];g<a&&(a=g),_<l&&(l=_),g>d&&(d=g),_>p&&(p=_)}c=Math.max(d-a,p-l),c=c!==0?32767/c:0}return Te(r,s,t,a,l,c,0),s}function K(u,e,t,n,i){let r;if(i===Zl(u,e,t,n)>0)for(let s=e;s<t;s+=n)r=ql(s/n|0,u[s],u[s+1],r);else for(let s=t-n;s>=e;s-=n)r=ql(s/n|0,u[s],u[s+1],r);return r&&je(r,r.next)&&(ja(r),r=r.next),r}function pe(u,e){if(!u)return u;e||(e=u);let t=u,n;do if(n=!1,!t.steiner&&(je(t,t.next)||ue(t.prev,t,t.next)===0)){if(ja(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Te(u,e,t,n,i,r,s){if(!u)return;!s&&r&&qe(u,n,i,r);let a=u;for(;u.prev!==u.next;){const l=u.prev,c=u.next;if(r?ut(u,n,i,r):me(u)){e.push(l.i,u.i,c.i),ja(u),u=c.next,a=c.next;continue}if(u=c,u===a){s?s===1?(u=ze(pe(u),e),Te(u,e,t,n,i,r,2)):s===2&&lt(u,e,t,n,i,r):Te(pe(u),e,t,n,i,r,1);break}}}function me(u){const e=u.prev,t=u,n=u.next;if(ue(e,t,n)>=0)return!1;const i=e.x,r=t.x,s=n.x,a=e.y,l=t.y,c=n.y,d=Math.min(i,r,s),p=Math.min(a,l,c),m=Math.max(i,r,s),g=Math.max(a,l,c);let _=n.next;for(;_!==e;){if(_.x>=d&&_.x<=m&&_.y>=p&&_.y<=g&&Qe(i,a,r,l,s,c,_.x,_.y)&&ue(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function ut(u,e,t,n){const i=u.prev,r=u,s=u.next;if(ue(i,r,s)>=0)return!1;const a=i.x,l=r.x,c=s.x,d=i.y,p=r.y,m=s.y,g=Math.min(a,l,c),_=Math.min(d,p,m),M=Math.max(a,l,c),E=Math.max(d,p,m),w=G(g,_,e,t,n),F=G(M,E,e,t,n);let D=u.prevZ,B=u.nextZ;for(;D&&D.z>=w&&B&&B.z<=F;){if(D.x>=g&&D.x<=M&&D.y>=_&&D.y<=E&&D!==i&&D!==s&&Qe(a,d,l,p,c,m,D.x,D.y)&&ue(D.prev,D,D.next)>=0||(D=D.prevZ,B.x>=g&&B.x<=M&&B.y>=_&&B.y<=E&&B!==i&&B!==s&&Qe(a,d,l,p,c,m,B.x,B.y)&&ue(B.prev,B,B.next)>=0))return!1;B=B.nextZ}for(;D&&D.z>=w;){if(D.x>=g&&D.x<=M&&D.y>=_&&D.y<=E&&D!==i&&D!==s&&Qe(a,d,l,p,c,m,D.x,D.y)&&ue(D.prev,D,D.next)>=0)return!1;D=D.prevZ}for(;B&&B.z<=F;){if(B.x>=g&&B.x<=M&&B.y>=_&&B.y<=E&&B!==i&&B!==s&&Qe(a,d,l,p,c,m,B.x,B.y)&&ue(B.prev,B,B.next)>=0)return!1;B=B.nextZ}return!0}function ze(u,e){let t=u;do{const n=t.prev,i=t.next.next;!je(n,i)&&Nt(n,t,t.next,i)&&Xi(n,i)&&Xi(i,n)&&(e.push(n.i,t.i,i.i),ja(t),ja(t.next),t=u=i),t=t.next}while(t!==u);return pe(t)}function lt(u,e,t,n,i,r){let s=u;do{let a=s.next.next;for(;a!==s.prev;){if(s.i!==a.i&&Ue(s,a)){let l=ks(s,a);s=pe(s,s.next),l=pe(l,l.next),Te(s,e,t,n,i,r,0),Te(l,e,t,n,i,r,0);return}a=a.next}s=s.next}while(s!==u)}function ct(u,e,t,n){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r]*n,l=r<s-1?e[r+1]*n:u.length,c=K(u,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Ne(c))}i.sort(Fe);for(let r=0;r<i.length;r++)t=Ze(i[r],t);return t}function Fe(u,e){let t=u.x-e.x;if(t===0&&(t=u.y-e.y,t===0)){const n=(u.next.y-u.y)/(u.next.x-u.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Ze(u,e){const t=Rt(u,e);if(!t)return e;const n=ks(t,u);return pe(n,n.next),pe(t,t.next)}function Rt(u,e){let t=e;const n=u.x,i=u.y;let r=-1/0,s;if(je(u,t))return t;do{if(je(u,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const p=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(p<=n&&p>r&&(r=p,s=t.x<t.next.x?t:t.next,p===n))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,l=s.x,c=s.y;let d=1/0;t=s;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Ge(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const p=Math.abs(i-t.y)/(n-t.x);Xi(t,u)&&(p<d||p===d&&(t.x>s.x||t.x===s.x&&ht(s,t)))&&(s=t,d=p)}t=t.next}while(t!==a);return s}function ht(u,e){return ue(u.prev,u,e.prev)<0&&ue(e.next,u,u.next)<0}function qe(u,e,t,n){let i=u;do i.z===0&&(i.z=G(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==u);i.prevZ.nextZ=null,i.prevZ=null,Wt(i)}function Wt(u){let e,t=1;do{let n=u,i;u=null;let r=null;for(e=0;n;){e++;let s=n,a=0;for(let c=0;c<t&&(a++,s=s.nextZ,!!s);c++);let l=t;for(;a>0||l>0&&s;)a!==0&&(l===0||!s||n.z<=s.z)?(i=n,n=n.nextZ,a--):(i=s,s=s.nextZ,l--),r?r.nextZ=i:u=i,i.prevZ=r,r=i;n=s}r.nextZ=null,t*=2}while(e>1);return u}function G(u,e,t,n,i){return u=(u-t)*i|0,e=(e-n)*i|0,u=(u|u<<8)&16711935,u=(u|u<<4)&252645135,u=(u|u<<2)&858993459,u=(u|u<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,u|e<<1}function Ne(u){let e=u,t=u;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==u);return t}function Ge(u,e,t,n,i,r,s,a){return(i-s)*(e-a)>=(u-s)*(r-a)&&(u-s)*(n-a)>=(t-s)*(e-a)&&(t-s)*(r-a)>=(i-s)*(n-a)}function Qe(u,e,t,n,i,r,s,a){return!(u===s&&e===a)&&Ge(u,e,t,n,i,r,s,a)}function Ue(u,e){return u.next.i!==e.i&&u.prev.i!==e.i&&!ps(u,e)&&(Xi(u,e)&&Xi(e,u)&&Zh(u,e)&&(ue(u.prev,u,e.prev)||ue(u,e.prev,e))||je(u,e)&&ue(u.prev,u,u.next)>0&&ue(e.prev,e,e.next)>0)}function ue(u,e,t){return(e.y-u.y)*(t.x-e.x)-(e.x-u.x)*(t.y-e.y)}function je(u,e){return u.x===e.x&&u.y===e.y}function Nt(u,e,t,n){const i=an(ue(u,e,t)),r=an(ue(u,e,n)),s=an(ue(t,n,u)),a=an(ue(t,n,e));return!!(i!==r&&s!==a||i===0&&gn(u,t,e)||r===0&&gn(u,n,e)||s===0&&gn(t,u,n)||a===0&&gn(t,e,n))}function gn(u,e,t){return e.x<=Math.max(u.x,t.x)&&e.x>=Math.min(u.x,t.x)&&e.y<=Math.max(u.y,t.y)&&e.y>=Math.min(u.y,t.y)}function an(u){return u>0?1:u<0?-1:0}function ps(u,e){let t=u;do{if(t.i!==u.i&&t.next.i!==u.i&&t.i!==e.i&&t.next.i!==e.i&&Nt(t,t.next,u,e))return!0;t=t.next}while(t!==u);return!1}function Xi(u,e){return ue(u.prev,u,u.next)<0?ue(u,e,u.next)>=0&&ue(u,u.prev,e)>=0:ue(u,e,u.prev)<0||ue(u,u.next,e)<0}function Zh(u,e){let t=u,n=!1;const i=(u.x+e.x)/2,r=(u.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==u);return n}function ks(u,e){const t=Yl(u.i,u.x,u.y),n=Yl(e.i,e.x,e.y),i=u.next,r=e.prev;return u.next=e,e.prev=u,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function ql(u,e,t,n){const i=Yl(u,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ja(u){u.next.prev=u.prev,u.prev.next=u.next,u.prevZ&&(u.prevZ.nextZ=u.nextZ),u.nextZ&&(u.nextZ.prevZ=u.prevZ)}function Yl(u,e,t){return{i:u,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Zl(u,e,t,n){let i=0;for(let r=e,s=t-n;r<t;r+=n)i+=(u[s]-u[r])*(u[r+1]+u[s+1]),s=r;return i}class $h{static triangulate(e,t,n=2){return S(e,t,n)}}class qi{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return qi.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];kc(e),Vc(n,e);let s=e.length;t.forEach(kc);for(let l=0;l<t.length;l++)i.push(s),s+=t[l].length,Vc(n,t[l]);const a=$h.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function kc(u){const e=u.length;e>2&&u[e-1].equals(u[0])&&u.pop()}function Vc(u,e){for(let t=0;t<e.length;t++)u.push(e[t].x),u.push(e[t].y)}class $l extends qt{constructor(e=new I([new Pe(.5,.5),new Pe(-.5,.5),new Pe(-.5,-.5),new Pe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];s(c)}this.setAttribute("position",new et(i,3)),this.setAttribute("uv",new et(r,2)),this.computeVertexNormals();function s(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,p=t.depth!==void 0?t.depth:1;let m=t.bevelEnabled!==void 0?t.bevelEnabled:!0,g=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:g-.1,M=t.bevelOffset!==void 0?t.bevelOffset:0,E=t.bevelSegments!==void 0?t.bevelSegments:3;const w=t.extrudePath,F=t.UVGenerator!==void 0?t.UVGenerator:yd;let D,B=!1,Q,ce,xe,de;w&&(D=w.getSpacedPoints(d),B=!0,m=!1,Q=w.computeFrenetFrames(d,!1),ce=new U,xe=new U,de=new U),m||(E=0,g=0,_=0,M=0);const Ie=a.extractPoints(c);let Be=Ie.shape;const dt=Ie.holes;if(!qi.isClockWise(Be)){Be=Be.reverse();for(let Ye=0,nt=dt.length;Ye<nt;Ye++){const it=dt[Ye];qi.isClockWise(it)&&(dt[Ye]=it.reverse())}}function Qt(Ye){const it=10000000000000001e-36;let vt=Ye[0];for(let _t=1;_t<=Ye.length;_t++){const fn=_t%Ye.length,Jt=Ye[fn],Yn=Jt.x-vt.x,Kn=Jt.y-vt.y,xi=Yn*Yn+Kn*Kn,wr=Math.max(Math.abs(Jt.x),Math.abs(Jt.y),Math.abs(vt.x),Math.abs(vt.y)),il=it*wr*wr;if(xi<=il){Ye.splice(fn,1),_t--;continue}vt=Jt}}Qt(Be),dt.forEach(Qt);const Pn=dt.length,Cn=Be;for(let Ye=0;Ye<Pn;Ye++){const nt=dt[Ye];Be=Be.concat(nt)}function _i(Ye,nt,it){return nt||console.error("THREE.ExtrudeGeometry: vec does not exist"),Ye.clone().addScaledVector(nt,it)}const Ni=Be.length;function ms(Ye,nt,it){let vt,_t,fn;const Jt=Ye.x-nt.x,Yn=Ye.y-nt.y,Kn=it.x-Ye.x,xi=it.y-Ye.y,wr=Jt*Jt+Yn*Yn,il=Jt*xi-Yn*Kn;if(Math.abs(il)>Number.EPSILON){const Cr=Math.sqrt(wr),If=Math.sqrt(Kn*Kn+xi*xi),Pf=nt.x-Yn/Cr,Lf=nt.y+Jt/Cr,em=it.x-xi/If,tm=it.y+Kn/If,Df=((em-Pf)*xi-(tm-Lf)*Kn)/(Jt*xi-Yn*Kn);vt=Pf+Jt*Df-Ye.x,_t=Lf+Yn*Df-Ye.y;const Uf=vt*vt+_t*_t;if(Uf<=2)return new Pe(vt,_t);fn=Math.sqrt(Uf/2)}else{let Cr=!1;Jt>Number.EPSILON?Kn>Number.EPSILON&&(Cr=!0):Jt<-Number.EPSILON?Kn<-Number.EPSILON&&(Cr=!0):Math.sign(Yn)===Math.sign(xi)&&(Cr=!0),Cr?(vt=-Yn,_t=Jt,fn=Math.sqrt(wr)):(vt=Jt,_t=Yn,fn=Math.sqrt(wr/2))}return new Pe(vt/fn,_t/fn)}const ni=[];for(let Ye=0,nt=Cn.length,it=nt-1,vt=Ye+1;Ye<nt;Ye++,it++,vt++)it===nt&&(it=0),vt===nt&&(vt=0),ni[Ye]=ms(Cn[Ye],Cn[it],Cn[vt]);const di=[];let ii,gs=ni.concat();for(let Ye=0,nt=Pn;Ye<nt;Ye++){const it=dt[Ye];ii=[];for(let vt=0,_t=it.length,fn=_t-1,Jt=vt+1;vt<_t;vt++,fn++,Jt++)fn===_t&&(fn=0),Jt===_t&&(Jt=0),ii[vt]=ms(it[vt],it[fn],it[Jt]);di.push(ii),gs=gs.concat(ii)}let Yr;if(E===0)Yr=qi.triangulateShape(Cn,dt);else{const Ye=[],nt=[];for(let it=0;it<E;it++){const vt=it/E,_t=g*Math.cos(vt*Math.PI/2),fn=_*Math.sin(vt*Math.PI/2)+M;for(let Jt=0,Yn=Cn.length;Jt<Yn;Jt++){const Kn=_i(Cn[Jt],ni[Jt],fn);xa(Kn.x,Kn.y,-_t),vt===0&&Ye.push(Kn)}for(let Jt=0,Yn=Pn;Jt<Yn;Jt++){const Kn=dt[Jt];ii=di[Jt];const xi=[];for(let wr=0,il=Kn.length;wr<il;wr++){const Cr=_i(Kn[wr],ii[wr],fn);xa(Cr.x,Cr.y,-_t),vt===0&&xi.push(Cr)}vt===0&&nt.push(xi)}}Yr=qi.triangulateShape(Ye,nt)}const tc=Yr.length,Kc=_+M;for(let Ye=0;Ye<Ni;Ye++){const nt=m?_i(Be[Ye],gs[Ye],Kc):Be[Ye];B?(xe.copy(Q.normals[0]).multiplyScalar(nt.x),ce.copy(Q.binormals[0]).multiplyScalar(nt.y),de.copy(D[0]).add(xe).add(ce),xa(de.x,de.y,de.z)):xa(nt.x,nt.y,0)}for(let Ye=1;Ye<=d;Ye++)for(let nt=0;nt<Ni;nt++){const it=m?_i(Be[nt],gs[nt],Kc):Be[nt];B?(xe.copy(Q.normals[Ye]).multiplyScalar(it.x),ce.copy(Q.binormals[Ye]).multiplyScalar(it.y),de.copy(D[Ye]).add(xe).add(ce),xa(de.x,de.y,de.z)):xa(it.x,it.y,p/d*Ye)}for(let Ye=E-1;Ye>=0;Ye--){const nt=Ye/E,it=g*Math.cos(nt*Math.PI/2),vt=_*Math.sin(nt*Math.PI/2)+M;for(let _t=0,fn=Cn.length;_t<fn;_t++){const Jt=_i(Cn[_t],ni[_t],vt);xa(Jt.x,Jt.y,p+it)}for(let _t=0,fn=dt.length;_t<fn;_t++){const Jt=dt[_t];ii=di[_t];for(let Yn=0,Kn=Jt.length;Yn<Kn;Yn++){const xi=_i(Jt[Yn],ii[Yn],vt);B?xa(xi.x,xi.y+D[d-1].y,D[d-1].x+it):xa(xi.x,xi.y,p+it)}}}Kp(),Qp();function Kp(){const Ye=i.length/3;if(m){let nt=0,it=Ni*nt;for(let vt=0;vt<tc;vt++){const _t=Yr[vt];ru(_t[2]+it,_t[1]+it,_t[0]+it)}nt=d+E*2,it=Ni*nt;for(let vt=0;vt<tc;vt++){const _t=Yr[vt];ru(_t[0]+it,_t[1]+it,_t[2]+it)}}else{for(let nt=0;nt<tc;nt++){const it=Yr[nt];ru(it[2],it[1],it[0])}for(let nt=0;nt<tc;nt++){const it=Yr[nt];ru(it[0]+Ni*d,it[1]+Ni*d,it[2]+Ni*d)}}n.addGroup(Ye,i.length/3-Ye,0)}function Qp(){const Ye=i.length/3;let nt=0;Rf(Cn,nt),nt+=Cn.length;for(let it=0,vt=dt.length;it<vt;it++){const _t=dt[it];Rf(_t,nt),nt+=_t.length}n.addGroup(Ye,i.length/3-Ye,1)}function Rf(Ye,nt){let it=Ye.length;for(;--it>=0;){const vt=it;let _t=it-1;_t<0&&(_t=Ye.length-1);for(let fn=0,Jt=d+E*2;fn<Jt;fn++){const Yn=Ni*fn,Kn=Ni*(fn+1),xi=nt+vt+Yn,wr=nt+_t+Yn,il=nt+_t+Kn,Cr=nt+vt+Kn;jp(xi,wr,il,Cr)}}}function xa(Ye,nt,it){l.push(Ye),l.push(nt),l.push(it)}function ru(Ye,nt,it){ya(Ye),ya(nt),ya(it);const vt=i.length/3,_t=F.generateTopUV(n,i,vt-3,vt-2,vt-1);va(_t[0]),va(_t[1]),va(_t[2])}function jp(Ye,nt,it,vt){ya(Ye),ya(nt),ya(vt),ya(nt),ya(it),ya(vt);const _t=i.length/3,fn=F.generateSideWallUV(n,i,_t-6,_t-3,_t-2,_t-1);va(fn[0]),va(fn[1]),va(fn[3]),va(fn[1]),va(fn[2]),va(fn[3])}function ya(Ye){i.push(l[Ye*3+0]),i.push(l[Ye*3+1]),i.push(l[Ye*3+2])}function va(Ye){r.push(Ye.x),r.push(Ye.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return vd(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];n.push(a)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Gt[i.type]().fromJSON(i)),new $l(n,e.options)}}const yd={generateTopUV:function(u,e,t,n,i){const r=e[t*3],s=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[i*3],d=e[i*3+1];return[new Pe(r,s),new Pe(a,l),new Pe(c,d)]},generateSideWallUV:function(u,e,t,n,i,r){const s=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],d=e[n*3+1],p=e[n*3+2],m=e[i*3],g=e[i*3+1],_=e[i*3+2],M=e[r*3],E=e[r*3+1],w=e[r*3+2];return Math.abs(a-d)<Math.abs(s-c)?[new Pe(s,1-l),new Pe(c,1-p),new Pe(m,1-_),new Pe(M,1-w)]:[new Pe(a,1-l),new Pe(d,1-p),new Pe(g,1-_),new Pe(E,1-w)]}};function vd(u,e,t){if(t.shapes=[],Array.isArray(u))for(let n=0,i=u.length;n<i;n++){const r=u[n];t.shapes.push(r.uuid)}else t.shapes.push(u.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Jl extends te{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Jl(e.radius,e.detail)}}class Kl extends qt{constructor(e=[new Pe(0,-.5),new Pe(.5,0),new Pe(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=At(i,0,Math.PI*2);const r=[],s=[],a=[],l=[],c=[],d=1/t,p=new U,m=new Pe,g=new U,_=new U,M=new U;let E=0,w=0;for(let F=0;F<=e.length-1;F++)switch(F){case 0:E=e[F+1].x-e[F].x,w=e[F+1].y-e[F].y,g.x=w*1,g.y=-E,g.z=w*0,M.copy(g),g.normalize(),l.push(g.x,g.y,g.z);break;case e.length-1:l.push(M.x,M.y,M.z);break;default:E=e[F+1].x-e[F].x,w=e[F+1].y-e[F].y,g.x=w*1,g.y=-E,g.z=w*0,_.copy(g),g.x+=M.x,g.y+=M.y,g.z+=M.z,g.normalize(),l.push(g.x,g.y,g.z),M.copy(_)}for(let F=0;F<=t;F++){const D=n+F*d*i,B=Math.sin(D),Q=Math.cos(D);for(let ce=0;ce<=e.length-1;ce++){p.x=e[ce].x*B,p.y=e[ce].y,p.z=e[ce].x*Q,s.push(p.x,p.y,p.z),m.x=F/t,m.y=ce/(e.length-1),a.push(m.x,m.y);const xe=l[3*ce+0]*B,de=l[3*ce+1],Ie=l[3*ce+0]*Q;c.push(xe,de,Ie)}}for(let F=0;F<t;F++)for(let D=0;D<e.length-1;D++){const B=D+F*e.length,Q=B,ce=B+e.length,xe=B+e.length+1,de=B+1;r.push(Q,ce,de),r.push(xe,de,ce)}this.setIndex(r),this.setAttribute("position",new et(s,3)),this.setAttribute("uv",new et(a,2)),this.setAttribute("normal",new et(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kl(e.points,e.segments,e.phiStart,e.phiLength)}}class Zo extends te{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Zo(e.radius,e.detail)}}class T extends qt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,s=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,d=l+1,p=e/a,m=t/l,g=[],_=[],M=[],E=[];for(let w=0;w<d;w++){const F=w*m-s;for(let D=0;D<c;D++){const B=D*p-r;_.push(B,-F,0),M.push(0,0,1),E.push(D/a),E.push(1-w/l)}}for(let w=0;w<l;w++)for(let F=0;F<a;F++){const D=F+c*w,B=F+c*(w+1),Q=F+1+c*(w+1),ce=F+1+c*w;g.push(D,B,ce),g.push(B,Q,ce)}this.setIndex(g),this.setAttribute("position",new et(_,3)),this.setAttribute("normal",new et(M,3)),this.setAttribute("uv",new et(E,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new T(e.width,e.height,e.widthSegments,e.heightSegments)}}class W extends qt{constructor(e=.5,t=1,n=32,i=1,r=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:s},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],d=[];let p=e;const m=(t-e)/i,g=new U,_=new Pe;for(let M=0;M<=i;M++){for(let E=0;E<=n;E++){const w=r+E/n*s;g.x=p*Math.cos(w),g.y=p*Math.sin(w),l.push(g.x,g.y,g.z),c.push(0,0,1),_.x=(g.x/t+1)/2,_.y=(g.y/t+1)/2,d.push(_.x,_.y)}p+=m}for(let M=0;M<i;M++){const E=M*(n+1);for(let w=0;w<n;w++){const F=w+E,D=F,B=F+n+1,Q=F+n+2,ce=F+1;a.push(D,B,ce),a.push(B,Q,ce)}}this.setIndex(a),this.setAttribute("position",new et(l,3)),this.setAttribute("normal",new et(c,3)),this.setAttribute("uv",new et(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new W(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class se extends qt{constructor(e=new I([new Pe(0,.5),new Pe(-.5,-.5),new Pe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],s=[];let a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let d=0;d<e.length;d++)c(e[d]),this.addGroup(a,l,d),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new et(i,3)),this.setAttribute("normal",new et(r,3)),this.setAttribute("uv",new et(s,2));function c(d){const p=i.length/3,m=d.extractPoints(t);let g=m.shape;const _=m.holes;qi.isClockWise(g)===!1&&(g=g.reverse());for(let E=0,w=_.length;E<w;E++){const F=_[E];qi.isClockWise(F)===!0&&(_[E]=F.reverse())}const M=qi.triangulateShape(g,_);for(let E=0,w=_.length;E<w;E++){const F=_[E];g=g.concat(F)}for(let E=0,w=g.length;E<w;E++){const F=g[E];i.push(F.x,F.y,0),r.push(0,0,1),s.push(F.x,F.y)}for(let E=0,w=M.length;E<w;E++){const F=M[E],D=F[0]+p,B=F[1]+p,Q=F[2]+p;n.push(D,B,Q),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return oe(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const s=t[e.shapes[i]];n.push(s)}return new se(n,e.curveSegments)}}function oe(u,e){if(e.shapes=[],Array.isArray(u))for(let t=0,n=u.length;t<n;t++){const i=u[t];e.shapes.push(i.uuid)}else e.shapes.push(u.uuid);return e}class q extends qt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(s+a,Math.PI);let c=0;const d=[],p=new U,m=new U,g=[],_=[],M=[],E=[];for(let w=0;w<=n;w++){const F=[],D=w/n;let B=0;w===0&&s===0?B=.5/t:w===n&&l===Math.PI&&(B=-.5/t);for(let Q=0;Q<=t;Q++){const ce=Q/t;p.x=-e*Math.cos(i+ce*r)*Math.sin(s+D*a),p.y=e*Math.cos(s+D*a),p.z=e*Math.sin(i+ce*r)*Math.sin(s+D*a),_.push(p.x,p.y,p.z),m.copy(p).normalize(),M.push(m.x,m.y,m.z),E.push(ce+B,1-D),F.push(c++)}d.push(F)}for(let w=0;w<n;w++)for(let F=0;F<t;F++){const D=d[w][F+1],B=d[w][F],Q=d[w+1][F],ce=d[w+1][F+1];(w!==0||s>0)&&g.push(D,B,ce),(w!==n-1||l<Math.PI)&&g.push(B,Q,ce)}this.setIndex(g),this.setAttribute("position",new et(_,3)),this.setAttribute("normal",new et(M,3)),this.setAttribute("uv",new et(E,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new q(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Le extends te{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Le(e.radius,e.detail)}}class We extends qt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const s=[],a=[],l=[],c=[],d=new U,p=new U,m=new U;for(let g=0;g<=n;g++)for(let _=0;_<=i;_++){const M=_/i*r,E=g/n*Math.PI*2;p.x=(e+t*Math.cos(E))*Math.cos(M),p.y=(e+t*Math.cos(E))*Math.sin(M),p.z=t*Math.sin(E),a.push(p.x,p.y,p.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),m.subVectors(p,d).normalize(),l.push(m.x,m.y,m.z),c.push(_/i),c.push(g/n)}for(let g=1;g<=n;g++)for(let _=1;_<=i;_++){const M=(i+1)*g+_-1,E=(i+1)*(g-1)+_-1,w=(i+1)*(g-1)+_,F=(i+1)*g+_;s.push(M,E,F),s.push(E,w,F)}this.setIndex(s),this.setAttribute("position",new et(a,3)),this.setAttribute("normal",new et(l,3)),this.setAttribute("uv",new et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new We(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class tt extends qt{constructor(e=1,t=.4,n=64,i=8,r=2,s=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:s},n=Math.floor(n),i=Math.floor(i);const a=[],l=[],c=[],d=[],p=new U,m=new U,g=new U,_=new U,M=new U,E=new U,w=new U;for(let D=0;D<=n;++D){const B=D/n*r*Math.PI*2;F(B,r,s,e,g),F(B+.01,r,s,e,_),E.subVectors(_,g),w.addVectors(_,g),M.crossVectors(E,w),w.crossVectors(M,E),M.normalize(),w.normalize();for(let Q=0;Q<=i;++Q){const ce=Q/i*Math.PI*2,xe=-t*Math.cos(ce),de=t*Math.sin(ce);p.x=g.x+(xe*w.x+de*M.x),p.y=g.y+(xe*w.y+de*M.y),p.z=g.z+(xe*w.z+de*M.z),l.push(p.x,p.y,p.z),m.subVectors(p,g).normalize(),c.push(m.x,m.y,m.z),d.push(D/n),d.push(Q/i)}}for(let D=1;D<=n;D++)for(let B=1;B<=i;B++){const Q=(i+1)*(D-1)+(B-1),ce=(i+1)*D+(B-1),xe=(i+1)*D+B,de=(i+1)*(D-1)+B;a.push(Q,ce,de),a.push(ce,xe,de)}this.setIndex(a),this.setAttribute("position",new et(l,3)),this.setAttribute("normal",new et(c,3)),this.setAttribute("uv",new et(d,2));function F(D,B,Q,ce,xe){const de=Math.cos(D),Ie=Math.sin(D),Be=Q/B*D,dt=Math.cos(Be);xe.x=ce*(2+dt)*.5*de,xe.y=ce*(2+dt)*Ie*.5,xe.z=ce*Math.sin(Be)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tt(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Je extends qt{constructor(e=new En(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const s=e.computeFrenetFrames(t,r);this.tangents=s.tangents,this.normals=s.normals,this.binormals=s.binormals;const a=new U,l=new U,c=new Pe;let d=new U;const p=[],m=[],g=[],_=[];M(),this.setIndex(_),this.setAttribute("position",new et(p,3)),this.setAttribute("normal",new et(m,3)),this.setAttribute("uv",new et(g,2));function M(){for(let D=0;D<t;D++)E(D);E(r===!1?t:0),F(),w()}function E(D){d=e.getPointAt(D/t,d);const B=s.normals[D],Q=s.binormals[D];for(let ce=0;ce<=i;ce++){const xe=ce/i*Math.PI*2,de=Math.sin(xe),Ie=-Math.cos(xe);l.x=Ie*B.x+de*Q.x,l.y=Ie*B.y+de*Q.y,l.z=Ie*B.z+de*Q.z,l.normalize(),m.push(l.x,l.y,l.z),a.x=d.x+n*l.x,a.y=d.y+n*l.y,a.z=d.z+n*l.z,p.push(a.x,a.y,a.z)}}function w(){for(let D=1;D<=t;D++)for(let B=1;B<=i;B++){const Q=(i+1)*(D-1)+(B-1),ce=(i+1)*D+(B-1),xe=(i+1)*D+B,de=(i+1)*(D-1)+B;_.push(Q,ce,de),_.push(ce,xe,de)}}function F(){for(let D=0;D<=t;D++)for(let B=0;B<=i;B++)c.x=D/t,c.y=B/i,g.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Je(new Gt[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class St extends qt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new U,r=new U;if(e.index!==null){const s=e.attributes.position,a=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,d=l.length;c<d;++c){const p=l[c],m=p.start,g=p.count;for(let _=m,M=m+g;_<M;_+=3)for(let E=0;E<3;E++){const w=a.getX(_+E),F=a.getX(_+(E+1)%3);i.fromBufferAttribute(s,w),r.fromBufferAttribute(s,F),It(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}}else{const s=e.attributes.position;for(let a=0,l=s.count/3;a<l;a++)for(let c=0;c<3;c++){const d=3*a+c,p=3*a+(c+1)%3;i.fromBufferAttribute(s,d),r.fromBufferAttribute(s,p),It(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new et(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function It(u,e,t){const n=`${u.x},${u.y},${u.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${u.x},${u.y},${u.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var gt=Object.freeze({__proto__:null,BoxGeometry:zn,CapsuleGeometry:J,CircleGeometry:k,ConeGeometry:ee,CylinderGeometry:he,DodecahedronGeometry:ve,EdgesGeometry:Ae,ExtrudeGeometry:$l,IcosahedronGeometry:Jl,LatheGeometry:Kl,OctahedronGeometry:Zo,PlaneGeometry:T,PolyhedronGeometry:te,RingGeometry:W,ShapeGeometry:se,SphereGeometry:q,TetrahedronGeometry:Le,TorusGeometry:We,TorusKnotGeometry:tt,TubeGeometry:Je,WireframeGeometry:St});class $t extends wi{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Pt(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class _n extends Sl{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Un extends wi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ne,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wn extends Un{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Pe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return At(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Pt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Pt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Pt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class vn extends wi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Pt(16777215),this.specular=new Pt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ne,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kr,this.combine=$r,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class xt extends wi{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Pt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ne,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class Fn extends wi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ne,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class on extends wi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ne,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kr,this.combine=$r,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Yi extends wi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vn,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pa extends wi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Zi extends wi{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new Pt(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ne,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class eo extends Fi{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function xn(u,e){return!u||u.constructor===e?u:typeof e.BYTES_PER_ELEMENT=="number"?new e(u):Array.prototype.slice.call(u)}function lr(u){return ArrayBuffer.isView(u)&&!(u instanceof DataView)}function cr(u){function e(i,r){return u[i]-u[r]}const t=u.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function gi(u,e,t){const n=u.length,i=new u.constructor(n);for(let r=0,s=0;s!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)i[s++]=u[a+l]}return i}function Ri(u,e,t,n){let i=1,r=u[0];for(;r!==void 0&&r[n]===void 0;)r=u[i++];if(r===void 0)return;let s=r[n];if(s!==void 0)if(Array.isArray(s))do s=r[n],s!==void 0&&(e.push(r.time),t.push(...s)),r=u[i++];while(r!==void 0);else if(s.toArray!==void 0)do s=r[n],s!==void 0&&(e.push(r.time),s.toArray(t,t.length)),r=u[i++];while(r!==void 0);else do s=r[n],s!==void 0&&(e.push(r.time),t.push(s)),r=u[i++];while(r!==void 0)}function Hc(u,e,t,n,i=30){const r=u.clone();r.name=e;const s=[];for(let l=0;l<r.tracks.length;++l){const c=r.tracks[l],d=c.getValueSize(),p=[],m=[];for(let g=0;g<c.times.length;++g){const _=c.times[g]*i;if(!(_<t||_>=n)){p.push(c.times[g]);for(let M=0;M<d;++M)m.push(c.values[g*d+M])}}p.length!==0&&(c.times=xn(p,c.times.constructor),c.values=xn(m,c.values.constructor),s.push(c))}r.tracks=s;let a=1/0;for(let l=0;l<r.tracks.length;++l)a>r.tracks[l].times[0]&&(a=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*a);return r.resetDuration(),r}function ma(u,e=0,t=u,n=30){n<=0&&(n=30);const i=t.tracks.length,r=e/n;for(let s=0;s<i;++s){const a=t.tracks[s],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;const c=u.tracks.find(function(w){return w.name===a.name&&w.ValueTypeName===l});if(c===void 0)continue;let d=0;const p=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=p/3);let m=0;const g=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(m=g/3);const _=a.times.length-1;let M;if(r<=a.times[0]){const w=d,F=p-d;M=a.values.slice(w,F)}else if(r>=a.times[_]){const w=_*p+d,F=w+p-d;M=a.values.slice(w,F)}else{const w=a.createInterpolant(),F=d,D=p-d;w.evaluate(r),M=w.resultBuffer.slice(F,D)}l==="quaternion"&&new ki().fromArray(M).normalize().conjugate().toArray(M);const E=c.times.length;for(let w=0;w<E;++w){const F=w*g+m;if(l==="quaternion")ki.multiplyQuaternionsFlat(c.values,F,M,0,c.values,F);else{const D=g-m*2;for(let B=0;B<D;++B)c.values[F+B]-=M[B]}}}return u.blendMode=Mr,u}class Ff{static convertArray(e,t){return xn(e,t)}static isTypedArray(e){return lr(e)}static getKeyframeOrder(e){return cr(e)}static sortedArray(e,t,n){return gi(e,t,n)}static flattenJSON(e,t,n,i){Ri(e,t,n,i)}static subclip(e,t,n,i,r=30){return Hc(e,t,n,i,r)}static makeClipAdditive(e,t=0,n=e,i=30){return ma(e,t,n,i)}}class Wc{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let s;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break t}s=t.length;break n}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}s=n,n=0;break n}break e}for(;n<s;){const a=n+s>>>1;e<t[a]?s=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let s=0;s!==i;++s)t[s]=n[r+s];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Wd extends Wc{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:fr,endingEnd:fr}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,s=e+1,a=i[r],l=i[s];if(a===void 0)switch(this.getSettings_().endingStart){case tr:r=e,a=2*t-n;break;case Gr:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case tr:s=e,l=2*n-t;break;case Gr:s=1,l=n+i[1]-i[0];break;default:s=e-1,l=t}const c=(n-t)*.5,d=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*d,this._offsetNext=s*d}interpolate_(e,t,n,i){const r=this.resultBuffer,s=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,d=this._offsetPrev,p=this._offsetNext,m=this._weightPrev,g=this._weightNext,_=(n-t)/(i-t),M=_*_,E=M*_,w=-m*E+2*m*M-m*_,F=(1+m)*E+(-1.5-2*m)*M+(-.5+m)*_+1,D=(-1-g)*E+(1.5+g)*M+.5*_,B=g*E-g*M;for(let Q=0;Q!==a;++Q)r[Q]=w*s[d+Q]+F*s[c+Q]+D*s[l+Q]+B*s[p+Q];return r}}class Md extends Wc{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,s=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,d=(n-t)/(i-t),p=1-d;for(let m=0;m!==a;++m)r[m]=s[c+m]*p+s[l+m]*d;return r}}class Xd extends Wc{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class qr{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=xn(t,this.TimeBufferType),this.values=xn(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:xn(e.times,Array),values:xn(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Xd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Md(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Wd(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case zr:t=this.InterpolantFactoryMethodDiscrete;break;case as:t=this.InterpolantFactoryMethodLinear;break;case Rs:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zr;case this.InterpolantFactoryMethodLinear:return as;case this.InterpolantFactoryMethodSmooth:return Rs}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,s=i-1;for(;r!==i&&n[r]<e;)++r;for(;s!==-1&&n[s]>t;)--s;if(++s,r!==0||s!==i){r>=s&&(s=Math.max(s,1),r=s-1);const a=this.getValueSize();this.times=n.slice(r,s),this.values=this.values.slice(r*a,s*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let s=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(s!==null&&s>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,s),e=!1;break}s=l}if(i!==void 0&&lr(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Rs,r=e.length-1;let s=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],d=e[a+1];if(c!==d&&(a!==1||c!==e[0]))if(i)l=!0;else{const p=a*n,m=p-n,g=p+n;for(let _=0;_!==n;++_){const M=t[p+_];if(M!==t[m+_]||M!==t[g+_]){l=!0;break}}}if(l){if(a!==s){e[s]=e[a];const p=a*n,m=s*n;for(let g=0;g!==n;++g)t[m+g]=t[p+g]}++s}}if(r>0){e[s]=e[r];for(let a=r*n,l=s*n,c=0;c!==n;++c)t[l+c]=t[a+c];++s}return s!==e.length?(this.times=e.slice(0,s),this.values=t.slice(0,s*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}qr.prototype.ValueTypeName="",qr.prototype.TimeBufferType=Float32Array,qr.prototype.ValueBufferType=Float32Array,qr.prototype.DefaultInterpolation=as;class $o extends qr{constructor(e,t,n){super(e,t,n)}}$o.prototype.ValueTypeName="bool",$o.prototype.ValueBufferType=Array,$o.prototype.DefaultInterpolation=zr,$o.prototype.InterpolantFactoryMethodLinear=void 0,$o.prototype.InterpolantFactoryMethodSmooth=void 0;class Sd extends qr{constructor(e,t,n,i){super(e,t,n,i)}}Sd.prototype.ValueTypeName="color";class Xc extends qr{constructor(e,t,n,i){super(e,t,n,i)}}Xc.prototype.ValueTypeName="number";class qd extends Wc{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,s=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t);let c=e*a;for(let d=c+a;c!==d;c+=4)ki.slerpFlat(r,0,s,c-a,s,c,l);return r}}class qc extends qr{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new qd(this.times,this.values,this.getValueSize(),e)}}qc.prototype.ValueTypeName="quaternion",qc.prototype.InterpolantFactoryMethodSmooth=void 0;class Jo extends qr{constructor(e,t,n){super(e,t,n)}}Jo.prototype.ValueTypeName="string",Jo.prototype.ValueBufferType=Array,Jo.prototype.DefaultInterpolation=zr,Jo.prototype.InterpolantFactoryMethodLinear=void 0,Jo.prototype.InterpolantFactoryMethodSmooth=void 0;class Yc extends qr{constructor(e,t,n,i){super(e,t,n,i)}}Yc.prototype.ValueTypeName="vector";class Zc{constructor(e="",t=-1,n=[],i=os){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=nr(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let s=0,a=n.length;s!==a;++s)t.push(Bf(n[s]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,s=n.length;r!==s;++r)t.push(qr.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,s=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const d=cr(l);l=gi(l,1,d),c=gi(c,1,d),!i&&l[0]===0&&(l.push(r),c.push(c[0])),s.push(new Xc(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,s)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],d=c.name.match(r);if(d&&d.length>1){const p=d[1];let m=i[p];m||(i[p]=m=[]),m.push(c)}}const s=[];for(const a in i)s.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return s}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(p,m,g,_,M){if(g.length!==0){const E=[],w=[];Ri(g,E,w,_),E.length!==0&&M.push(new p(m,E,w))}},i=[],r=e.name||"default",s=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let p=0;p<c.length;p++){const m=c[p].keys;if(!(!m||m.length===0))if(m[0].morphTargets){const g={};let _;for(_=0;_<m.length;_++)if(m[_].morphTargets)for(let M=0;M<m[_].morphTargets.length;M++)g[m[_].morphTargets[M]]=-1;for(const M in g){const E=[],w=[];for(let F=0;F!==m[_].morphTargets.length;++F){const D=m[_];E.push(D.time),w.push(D.morphTarget===M?1:0)}i.push(new Xc(".morphTargetInfluence["+M+"]",E,w))}l=g.length*s}else{const g=".bones["+t[p].name+"]";n(Yc,g+".position",m,"pos",i),n(qc,g+".quaternion",m,"rot",i),n(Yc,g+".scale",m,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Nf(u){switch(u.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Xc;case"vector":case"vector2":case"vector3":case"vector4":return Yc;case"color":return Sd;case"quaternion":return qc;case"bool":case"boolean":return $o;case"string":return Jo}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+u)}function Bf(u){if(u.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Nf(u.type);if(u.times===void 0){const t=[],n=[];Ri(u.keys,t,n,"value"),u.times=t,u.values=n}return e.parse!==void 0?e.parse(u):new e(u.name,u.times,u.values,u.interpolation)}const Vs={enabled:!1,files:{},add:function(u,e){this.enabled!==!1&&(this.files[u]=e)},get:function(u){if(this.enabled!==!1)return this.files[u]},remove:function(u){delete this.files[u]},clear:function(){this.files={}}};class bd{constructor(e,t,n){const i=this;let r=!1,s=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){a++,r===!1&&i.onStart!==void 0&&i.onStart(d,s,a),r=!0},this.itemEnd=function(d){s++,i.onProgress!==void 0&&i.onProgress(d,s,a),s===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(d){i.onError!==void 0&&i.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,p){return c.push(d,p),this},this.removeHandler=function(d){const p=c.indexOf(d);return p!==-1&&c.splice(p,2),this},this.getHandler=function(d){for(let p=0,m=c.length;p<m;p+=2){const g=c[p],_=c[p+1];if(g.global&&(g.lastIndex=0),g.test(d))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Yd=new bd;class mr{constructor(e){this.manager=e!==void 0?e:Yd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}mr.DEFAULT_MATERIAL_NAME="__DEFAULT";const ga={};class Of extends Error{constructor(e,t){super(e),this.response=t}}class _a extends mr{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Vs.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(ga[e]!==void 0){ga[e].push({onLoad:t,onProgress:n,onError:i});return}ga[e]=[],ga[e].push({onLoad:t,onProgress:n,onError:i});const s=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(s).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const d=ga[e],p=c.body.getReader(),m=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),g=m?parseInt(m):0,_=g!==0;let M=0;const E=new ReadableStream({start(w){F();function F(){p.read().then(({done:D,value:B})=>{if(D)w.close();else{M+=B.byteLength;const Q=new ProgressEvent("progress",{lengthComputable:_,loaded:M,total:g});for(let ce=0,xe=d.length;ce<xe;ce++){const de=d[ce];de.onProgress&&de.onProgress(Q)}w.enqueue(B),F()}},D=>{w.error(D)})}}});return new Response(E)}else throw new Of(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(d=>new DOMParser().parseFromString(d,a));case"json":return c.json();default:if(a==="")return c.text();{const p=/charset="?([^;"\s]*)"?/i.exec(a),m=p&&p[1]?p[1].toLowerCase():void 0,g=new TextDecoder(m);return c.arrayBuffer().then(_=>g.decode(_))}}}).then(c=>{Vs.add(`file:${e}`,c);const d=ga[e];delete ga[e];for(let p=0,m=d.length;p<m;p++){const g=d[p];g.onLoad&&g.onLoad(c)}}).catch(c=>{const d=ga[e];if(d===void 0)throw this.manager.itemError(e),c;delete ga[e];for(let p=0,m=d.length;p<m;p++){const g=d[p];g.onError&&g.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class zf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new _a(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=Zc.parse(e[n]);t.push(i)}return t}}class Gf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=this,s=[],a=new $,l=new _a(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(r.withCredentials);let c=0;function d(p){l.load(e[p],function(m){const g=r.parse(m,!0);s[p]={width:g.width,height:g.height,format:g.format,mipmaps:g.mipmaps},c+=1,c===6&&(g.mipmapCount===1&&(a.minFilter=$n),a.image=s,a.format=g.format,a.needsUpdate=!0,t&&t(a))},n,i)}if(Array.isArray(e))for(let p=0,m=e.length;p<m;++p)d(p);else l.load(e,function(p){const m=r.parse(p,!0);if(m.isCubemap){const g=m.mipmaps.length/m.mipmapCount;for(let _=0;_<g;_++){s[_]={mipmaps:[]};for(let M=0;M<m.mipmapCount;M++)s[_].mipmaps.push(m.mipmaps[_*m.mipmapCount+M]),s[_].format=m.format,s[_].width=m.width,s[_].height=m.height}a.image=s}else a.image.width=m.width,a.image.height=m.height,a.mipmaps=m.mipmaps;m.mipmapCount===1&&(a.minFilter=$n),a.format=m.format,a.needsUpdate=!0,t&&t(a)},n,i);return a}}const Ql=new WeakMap;class $c extends mr{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,s=Vs.get(`image:${e}`);if(s!==void 0){if(s.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(s),r.manager.itemEnd(e)},0);else{let p=Ql.get(s);p===void 0&&(p=[],Ql.set(s,p)),p.push({onLoad:t,onError:i})}return s}const a=So("img");function l(){d(),t&&t(this);const p=Ql.get(this)||[];for(let m=0;m<p.length;m++){const g=p[m];g.onLoad&&g.onLoad(this)}Ql.delete(this),r.manager.itemEnd(e)}function c(p){d(),i&&i(p),Vs.remove(`image:${e}`);const m=Ql.get(this)||[];for(let g=0;g<m.length;g++){const _=m[g];_.onError&&_.onError(p)}Ql.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function d(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Vs.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class kf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=new Tl;r.colorSpace=$e;const s=new $c(this.manager);s.setCrossOrigin(this.crossOrigin),s.setPath(this.path);let a=0;function l(c){s.load(e[c],function(d){r.images[c]=d,a++,a===6&&(r.needsUpdate=!0,t&&t(r))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return r}}class Vf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new or,a=new _a(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(l){let c;try{c=r.parse(l)}catch(d){if(i!==void 0)i(d);else{console.error(d);return}}c.image!==void 0?s.image=c.image:c.data!==void 0&&(s.image.width=c.width,s.image.height=c.height,s.image.data=c.data),s.wrapS=c.wrapS!==void 0?c.wrapS:Ii,s.wrapT=c.wrapT!==void 0?c.wrapT:Ii,s.magFilter=c.magFilter!==void 0?c.magFilter:$n,s.minFilter=c.minFilter!==void 0?c.minFilter:$n,s.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(s.colorSpace=c.colorSpace),c.flipY!==void 0&&(s.flipY=c.flipY),c.format!==void 0&&(s.format=c.format),c.type!==void 0&&(s.type=c.type),c.mipmaps!==void 0&&(s.mipmaps=c.mipmaps,s.minFilter=Pr),c.mipmapCount===1&&(s.minFilter=$n),c.generateMipmaps!==void 0&&(s.generateMipmaps=c.generateMipmaps),s.needsUpdate=!0,t&&t(s,c)},n,i),s}}class Hf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=new Jn,s=new $c(this.manager);return s.setCrossOrigin(this.crossOrigin),s.setPath(this.path),s.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class to extends cn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Zd extends to{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Td=new Ot,$d=new U,Jd=new U;class Ad{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pe(512,512),this.mapType=ys,this.map=null,this.mapPass=null,this.matrix=new Ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zl,this._frameExtents=new Pe(1,1),this._viewportCount=1,this._viewports=[new oi(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;$d.setFromMatrixPosition(e.matrixWorld),t.position.copy($d),Jd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Jd),t.updateMatrixWorld(),Td.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Td,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Td)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Wf extends Ad{constructor(){super(new ar(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=La*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Kd extends to{constructor(e,t,n=0,i=Math.PI/3,r=0,s=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.target=new cn,this.distance=n,this.angle=i,this.penumbra=r,this.decay=s,this.map=null,this.shadow=new Wf}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Qd=new Ot,Jc=new U,Ed=new U;class Xf extends Ad{constructor(){super(new ar(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Pe(4,2),this._viewportCount=6,this._viewports=[new oi(2,1,1,1),new oi(0,1,1,1),new oi(3,1,1,1),new oi(1,1,1,1),new oi(3,0,1,1),new oi(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Jc.setFromMatrixPosition(e.matrixWorld),n.position.copy(Jc),Ed.copy(n.position),Ed.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ed),n.updateMatrixWorld(),i.makeTranslation(-Jc.x,-Jc.y,-Jc.z),Qd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qd,n.coordinateSystem,n.reversedDepth)}}class jd extends to{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Xf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class wd extends bl{constructor(e=-1,t=1,n=1,i=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,s=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,s=r+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class qf extends Ad{constructor(){super(new wd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ef extends to{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.target=new cn,this.shadow=new qf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class tf extends to{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class nf extends to{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class rf{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new U)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,r=e.z,s=this.coefficients;return t.copy(s[0]).multiplyScalar(.282095),t.addScaledVector(s[1],.488603*i),t.addScaledVector(s[2],.488603*r),t.addScaledVector(s[3],.488603*n),t.addScaledVector(s[4],1.092548*(n*i)),t.addScaledVector(s[5],1.092548*(i*r)),t.addScaledVector(s[6],.315392*(3*r*r-1)),t.addScaledVector(s[7],1.092548*(n*r)),t.addScaledVector(s[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,r=e.z,s=this.coefficients;return t.copy(s[0]).multiplyScalar(.886227),t.addScaledVector(s[1],1.023328*i),t.addScaledVector(s[2],1.023328*r),t.addScaledVector(s[3],1.023328*n),t.addScaledVector(s[4],.858086*n*i),t.addScaledVector(s[5],.858086*i*r),t.addScaledVector(s[6],.743125*r*r-.247708),t.addScaledVector(s[7],.858086*n*r),t.addScaledVector(s[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,r=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*r,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*r,t[6]=.315392*(3*r*r-1),t[7]=1.092548*n*r,t[8]=.546274*(n*n-i*i)}}class sf extends to{constructor(e=new rf,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class Jh extends mr{constructor(e){super(e),this.textures={}}load(e,t,n,i){const r=this,s=new _a(r.manager);s.setPath(r.path),s.setRequestHeader(r.requestHeader),s.setWithCredentials(r.withCredentials),s.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=this.textures;function n(r){return t[r]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",r),t[r]}const i=this.createMaterialFromType(e.type);if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new Pt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(i.dispersion=e.dispersion),e.iridescence!==void 0&&(i.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(i.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(i.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(i.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(i.depthFunc=e.depthFunc),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(i.blendSrc=e.blendSrc),e.blendDst!==void 0&&(i.blendDst=e.blendDst),e.blendEquation!==void 0&&(i.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(i.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(i.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==void 0&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(i.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const r in e.uniforms){const s=e.uniforms[r];switch(i.uniforms[r]={},s.type){case"t":i.uniforms[r].value=n(s.value);break;case"c":i.uniforms[r].value=new Pt().setHex(s.value);break;case"v2":i.uniforms[r].value=new Pe().fromArray(s.value);break;case"v3":i.uniforms[r].value=new U().fromArray(s.value);break;case"v4":i.uniforms[r].value=new oi().fromArray(s.value);break;case"m3":i.uniforms[r].value=new Tr().fromArray(s.value);break;case"m4":i.uniforms[r].value=new Ot().fromArray(s.value);break;default:i.uniforms[r].value=s.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(i.glslVersion=e.glslVersion),e.extensions!==void 0)for(const r in e.extensions)i.extensions[r]=e.extensions[r];if(e.lights!==void 0&&(i.lights=e.lights),e.clipping!==void 0&&(i.clipping=e.clipping),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let r=e.normalScale;Array.isArray(r)===!1&&(r=[r,r]),i.normalScale=new Pe().fromArray(r)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapRotation!==void 0&&i.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new Pe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(i.iridescenceMap=n(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.anisotropyMap!==void 0&&(i.anisotropyMap=n(e.anisotropyMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return Jh.createMaterialFromType(e)}static createMaterialFromType(e){const t={ShadowMaterial:$t,SpriteMaterial:Lc,RawShaderMaterial:_n,ShaderMaterial:Sl,PointsMaterial:x,MeshPhysicalMaterial:wn,MeshStandardMaterial:Un,MeshPhongMaterial:vn,MeshToonMaterial:xt,MeshNormalMaterial:Fn,MeshLambertMaterial:on,MeshDepthMaterial:Yi,MeshDistanceMaterial:pa,MeshBasicMaterial:sa,MeshMatcapMaterial:Zi,LineDashedMaterial:eo,LineBasicMaterial:Fi,Material:wi};return new t[e]}}class Cd{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class af extends qt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class of extends mr{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new _a(r.manager);s.setPath(r.path),s.setRequestHeader(r.requestHeader),s.setWithCredentials(r.withCredentials),s.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(g,_){if(t[_]!==void 0)return t[_];const E=g.interleavedBuffers[_],w=r(g,E.buffer),F=Da(E.type,w),D=new wl(F,E.stride);return D.uuid=E.uuid,t[_]=D,D}function r(g,_){if(n[_]!==void 0)return n[_];const E=g.arrayBuffers[_],w=new Uint32Array(E).buffer;return n[_]=w,w}const s=e.isInstancedBufferGeometry?new af:new qt,a=e.data.index;if(a!==void 0){const g=Da(a.type,a.array);s.setIndex(new An(g,1))}const l=e.data.attributes;for(const g in l){const _=l[g];let M;if(_.isInterleavedBufferAttribute){const E=i(e.data,_.data);M=new ca(E,_.itemSize,_.offset,_.normalized)}else{const E=Da(_.type,_.array),w=_.isInstancedBufferAttribute?Qa:An;M=new w(E,_.itemSize,_.normalized)}_.name!==void 0&&(M.name=_.name),_.usage!==void 0&&M.setUsage(_.usage),s.setAttribute(g,M)}const c=e.data.morphAttributes;if(c)for(const g in c){const _=c[g],M=[];for(let E=0,w=_.length;E<w;E++){const F=_[E];let D;if(F.isInterleavedBufferAttribute){const B=i(e.data,F.data);D=new ca(B,F.itemSize,F.offset,F.normalized)}else{const B=Da(F.type,F.array);D=new An(B,F.itemSize,F.normalized)}F.name!==void 0&&(D.name=F.name),M.push(D)}s.morphAttributes[g]=M}e.data.morphTargetsRelative&&(s.morphTargetsRelative=!0);const p=e.data.groups||e.data.drawcalls||e.data.offsets;if(p!==void 0)for(let g=0,_=p.length;g!==_;++g){const M=p[g];s.addGroup(M.start,M.count,M.materialIndex)}const m=e.data.boundingSphere;return m!==void 0&&(s.boundingSphere=new mi().fromJSON(m)),e.name&&(s.name=e.name),e.userData&&(s.userData=e.userData),s}}class Yf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=this,s=this.path===""?Cd.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||s;const a=new _a(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(p){i!==void 0&&i(p),console.error("THREE:ObjectLoader: Can't parse "+e+".",p.message);return}const d=c.metadata;if(d===void 0||d.type===void 0||d.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}r.parse(c,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?Cd.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const r=new _a(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);const s=await r.loadAsync(e,t),a=JSON.parse(s),l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(a)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),s=this.parseImages(e.images,function(){t!==void 0&&t(c)}),a=this.parseTextures(e.textures,s),l=this.parseMaterials(e.materials,a),c=this.parseObject(e.object,r,l,a,n),d=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,d),this.bindLightTargets(c),t!==void 0){let p=!1;for(const m in s)if(s[m].data instanceof HTMLImageElement){p=!0;break}p===!1&&t(c)}return c}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),r=await this.parseImagesAsync(e.images),s=this.parseTextures(e.textures,r),a=this.parseMaterials(e.materials,s),l=this.parseObject(e.object,i,a,s,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const r=new I().fromJSON(e[n]);t[r.uuid]=r}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(r){r.isBone&&(i[r.uuid]=r)}),e!==void 0)for(let r=0,s=e.length;r<s;r++){const a=new Nl().fromJSON(e[r],i);n[a.uuid]=a}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new of;for(let r=0,s=e.length;r<s;r++){let a;const l=e[r];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(l);break;default:l.type in gt?a=gt[l.type].fromJSON(l,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),l.userData!==void 0&&(a.userData=l.userData),n[l.uuid]=a}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const r=new Jh;r.setTextures(t);for(let s=0,a=e.length;s<a;s++){const l=e[s];n[l.uuid]===void 0&&(n[l.uuid]=r.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],r=Zc.parse(i);t[r.uuid]=r}return t}parseImages(e,t){const n=this,i={};let r;function s(l){return n.manager.itemStart(l),r.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function a(l){if(typeof l=="string"){const c=l,d=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return s(d)}else return l.data?{data:Da(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){const l=new bd(t);r=new $c(l),r.setCrossOrigin(this.crossOrigin);for(let c=0,d=e.length;c<d;c++){const p=e[c],m=p.url;if(Array.isArray(m)){const g=[];for(let _=0,M=m.length;_<M;_++){const E=m[_],w=a(E);w!==null&&(w instanceof HTMLImageElement?g.push(w):g.push(new or(w.data,w.width,w.height)))}i[p.uuid]=new Ps(g)}else{const g=a(p.url);i[p.uuid]=new Ps(g)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function r(s){if(typeof s=="string"){const a=s,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:t.resourcePath+a;return await i.loadAsync(l)}else return s.data?{data:Da(s.type,s.data),width:s.width,height:s.height}:null}if(e!==void 0&&e.length>0){i=new $c(this.manager),i.setCrossOrigin(this.crossOrigin);for(let s=0,a=e.length;s<a;s++){const l=e[s],c=l.url;if(Array.isArray(c)){const d=[];for(let p=0,m=c.length;p<m;p++){const g=c[p],_=await r(g);_!==null&&(_ instanceof HTMLImageElement?d.push(_):d.push(new or(_.data,_.width,_.height)))}n[l.uuid]=new Ps(d)}else{const d=await r(l.url);n[l.uuid]=new Ps(d)}}}return n}parseTextures(e,t){function n(r,s){return typeof r=="number"?r:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",r),s[r])}const i={};if(e!==void 0)for(let r=0,s=e.length;r<s;r++){const a=e[r];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),t[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);const l=t[a.image],c=l.data;let d;Array.isArray(c)?(d=new Tl,c.length===6&&(d.needsUpdate=!0)):(c&&c.data?d=new or:d=new Jn,c&&(d.needsUpdate=!0)),d.source=l,d.uuid=a.uuid,a.name!==void 0&&(d.name=a.name),a.mapping!==void 0&&(d.mapping=n(a.mapping,Zf)),a.channel!==void 0&&(d.channel=a.channel),a.offset!==void 0&&d.offset.fromArray(a.offset),a.repeat!==void 0&&d.repeat.fromArray(a.repeat),a.center!==void 0&&d.center.fromArray(a.center),a.rotation!==void 0&&(d.rotation=a.rotation),a.wrap!==void 0&&(d.wrapS=n(a.wrap[0],lf),d.wrapT=n(a.wrap[1],lf)),a.format!==void 0&&(d.format=a.format),a.internalFormat!==void 0&&(d.internalFormat=a.internalFormat),a.type!==void 0&&(d.type=a.type),a.colorSpace!==void 0&&(d.colorSpace=a.colorSpace),a.minFilter!==void 0&&(d.minFilter=n(a.minFilter,cf)),a.magFilter!==void 0&&(d.magFilter=n(a.magFilter,cf)),a.anisotropy!==void 0&&(d.anisotropy=a.anisotropy),a.flipY!==void 0&&(d.flipY=a.flipY),a.generateMipmaps!==void 0&&(d.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(d.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(d.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(d.compareFunction=a.compareFunction),a.userData!==void 0&&(d.userData=a.userData),i[a.uuid]=d}return i}parseObject(e,t,n,i,r){let s;function a(m){return t[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",m),t[m]}function l(m){if(m!==void 0){if(Array.isArray(m)){const g=[];for(let _=0,M=m.length;_<M;_++){const E=m[_];n[E]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",E),g.push(n[E])}return g}return n[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",m),n[m]}}function c(m){return i[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",m),i[m]}let d,p;switch(e.type){case"Scene":s=new wh,e.background!==void 0&&(Number.isInteger(e.background)?s.background=new Pt(e.background):s.background=c(e.background)),e.environment!==void 0&&(s.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?s.fog=new El(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(s.fog=new Al(e.fog.color,e.fog.density)),e.fog.name!==""&&(s.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(s.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(s.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&s.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(s.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&s.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":s=new ar(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(s.focus=e.focus),e.zoom!==void 0&&(s.zoom=e.zoom),e.filmGauge!==void 0&&(s.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(s.filmOffset=e.filmOffset),e.view!==void 0&&(s.view=Object.assign({},e.view));break;case"OrthographicCamera":s=new wd(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(s.zoom=e.zoom),e.view!==void 0&&(s.view=Object.assign({},e.view));break;case"AmbientLight":s=new tf(e.color,e.intensity);break;case"DirectionalLight":s=new ef(e.color,e.intensity),s.target=e.target||"";break;case"PointLight":s=new jd(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":s=new nf(e.color,e.intensity,e.width,e.height);break;case"SpotLight":s=new Kd(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),s.target=e.target||"";break;case"HemisphereLight":s=new Zd(e.color,e.groundColor,e.intensity);break;case"LightProbe":s=new sf().fromJSON(e);break;case"SkinnedMesh":d=a(e.geometry),p=l(e.material),s=new Fh(d,p),e.bindMode!==void 0&&(s.bindMode=e.bindMode),e.bindMatrix!==void 0&&s.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(s.skeleton=e.skeleton);break;case"Mesh":d=a(e.geometry),p=l(e.material),s=new sr(d,p);break;case"InstancedMesh":d=a(e.geometry),p=l(e.material);const m=e.count,g=e.instanceMatrix,_=e.instanceColor;s=new Oh(d,p,m),s.instanceMatrix=new Qa(new Float32Array(g.array),16),_!==void 0&&(s.instanceColor=new Qa(new Float32Array(_.array),_.itemSize));break;case"BatchedMesh":d=a(e.geometry),p=l(e.material),s=new Wh(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,p),s.geometry=d,s.perObjectFrustumCulled=e.perObjectFrustumCulled,s.sortObjects=e.sortObjects,s._drawRanges=e.drawRanges,s._reservedRanges=e.reservedRanges,s._geometryInfo=e.geometryInfo.map(M=>{let E=null,w=null;return M.boundingBox!==void 0&&(E=new Ai().fromJSON(M.boundingBox)),M.boundingSphere!==void 0&&(w=new mi().fromJSON(M.boundingSphere)),{...M,boundingBox:E,boundingSphere:w}}),s._instanceInfo=e.instanceInfo,s._availableInstanceIds=e._availableInstanceIds,s._availableGeometryIds=e._availableGeometryIds,s._nextIndexStart=e.nextIndexStart,s._nextVertexStart=e.nextVertexStart,s._geometryCount=e.geometryCount,s._maxInstanceCount=e.maxInstanceCount,s._maxVertexCount=e.maxVertexCount,s._maxIndexCount=e.maxIndexCount,s._geometryInitialized=e.geometryInitialized,s._matricesTexture=c(e.matricesTexture.uuid),s._indirectTexture=c(e.indirectTexture.uuid),e.colorsTexture!==void 0&&(s._colorsTexture=c(e.colorsTexture.uuid)),e.boundingSphere!==void 0&&(s.boundingSphere=new mi().fromJSON(e.boundingSphere)),e.boundingBox!==void 0&&(s.boundingBox=new Ai().fromJSON(e.boundingBox));break;case"LOD":s=new Uc;break;case"Line":s=new Gs(a(e.geometry),l(e.material));break;case"LineLoop":s=new h(a(e.geometry),l(e.material));break;case"LineSegments":s=new f(a(e.geometry),l(e.material));break;case"PointCloud":case"Points":s=new j(a(e.geometry),l(e.material));break;case"Sprite":s=new Ph(l(e.material));break;case"Group":s=new Ya;break;case"Bone":s=new Nc;break;default:s=new cn}if(s.uuid=e.uuid,e.name!==void 0&&(s.name=e.name),e.matrix!==void 0?(s.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(s.matrixAutoUpdate=e.matrixAutoUpdate),s.matrixAutoUpdate&&s.matrix.decompose(s.position,s.quaternion,s.scale)):(e.position!==void 0&&s.position.fromArray(e.position),e.rotation!==void 0&&s.rotation.fromArray(e.rotation),e.quaternion!==void 0&&s.quaternion.fromArray(e.quaternion),e.scale!==void 0&&s.scale.fromArray(e.scale)),e.up!==void 0&&s.up.fromArray(e.up),e.castShadow!==void 0&&(s.castShadow=e.castShadow),e.receiveShadow!==void 0&&(s.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(s.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(s.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(s.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(s.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&s.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(s.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(s.visible=e.visible),e.frustumCulled!==void 0&&(s.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(s.renderOrder=e.renderOrder),e.userData!==void 0&&(s.userData=e.userData),e.layers!==void 0&&(s.layers.mask=e.layers),e.children!==void 0){const m=e.children;for(let g=0;g<m.length;g++)s.add(this.parseObject(m[g],t,n,i,r))}if(e.animations!==void 0){const m=e.animations;for(let g=0;g<m.length;g++){const _=m[g];s.animations.push(r[_])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(s.autoUpdate=e.autoUpdate);const m=e.levels;for(let g=0;g<m.length;g++){const _=m[g],M=s.getObjectByProperty("uuid",_.object);M!==void 0&&s.addLevel(M,_.distance,_.hysteresis)}}return s}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new cn}})}}const Zf={UVMapping:xs,CubeReflectionMapping:Kr,CubeRefractionMapping:so,EquirectangularReflectionMapping:Xs,EquirectangularRefractionMapping:Oi,CubeUVReflectionMapping:Ki},lf={RepeatWrapping:Qi,ClampToEdgeWrapping:Ii,MirroredRepeatWrapping:Rr},cf={NearestFilter:Mi,NearestMipmapNearestFilter:qs,NearestMipmapLinearFilter:xr,LinearFilter:$n,LinearMipmapNearestFilter:Ys,LinearMipmapLinearFilter:Pr},Rd=new WeakMap;class $f extends mr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,s=Vs.get(`image-bitmap:${e}`);if(s!==void 0){if(r.manager.itemStart(e),s.then){s.then(c=>{if(Rd.has(s)===!0)i&&i(Rd.get(s)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(s),r.manager.itemEnd(e)},0),s}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Vs.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Rd.set(l,c),Vs.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Vs.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let Kh;class Id{static getContext(){return Kh===void 0&&(Kh=new(window.AudioContext||window.webkitAudioContext)),Kh}static setContext(e){Kh=e}}class Jf extends mr{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new _a(this.manager);s.setResponseType("arraybuffer"),s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(l){try{const c=l.slice(0);Id.getContext().decodeAudioData(c,function(p){t(p)}).catch(a)}catch(c){a(c)}},n,i);function a(l){i?i(l):console.error(l),r.manager.itemError(e)}}}const hf=new Ot,uf=new Ot,Ko=new Ot;class Kf{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new ar,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new ar,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,Ko.copy(e.projectionMatrix);const i=t.eyeSep/2,r=i*t.near/t.focus,s=t.near*Math.tan(ta*t.fov*.5)/t.zoom;let a,l;uf.elements[12]=-i,hf.elements[12]=i,a=-s*t.aspect+r,l=s*t.aspect+r,Ko.elements[0]=2*t.near/(l-a),Ko.elements[8]=(l+a)/(l-a),this.cameraL.projectionMatrix.copy(Ko),a=-s*t.aspect-r,l=s*t.aspect-r,Ko.elements[0]=2*t.near/(l-a),Ko.elements[8]=(l+a)/(l-a),this.cameraR.projectionMatrix.copy(Ko)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(uf),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(hf)}}class Qf extends ar{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class df{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Qo=new U,Pd=new ki,jf=new U,jo=new U,el=new U;class ep extends cn{constructor(){super(),this.type="AudioListener",this.context=Id.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new df}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(Qo,Pd,jf),jo.set(0,0,-1).applyQuaternion(Pd),el.set(0,1,0).applyQuaternion(Pd),t.positionX){const n=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(Qo.x,n),t.positionY.linearRampToValueAtTime(Qo.y,n),t.positionZ.linearRampToValueAtTime(Qo.z,n),t.forwardX.linearRampToValueAtTime(jo.x,n),t.forwardY.linearRampToValueAtTime(jo.y,n),t.forwardZ.linearRampToValueAtTime(jo.z,n),t.upX.linearRampToValueAtTime(el.x,n),t.upY.linearRampToValueAtTime(el.y,n),t.upZ.linearRampToValueAtTime(el.z,n)}else t.setPosition(Qo.x,Qo.y,Qo.z),t.setOrientation(jo.x,jo.y,jo.z,el.x,el.y,el.z)}}class ff extends cn{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(console.warn("THREE.Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}}const tl=new U,pf=new ki,tp=new U,nl=new U;class np extends ff{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(tl,pf,tp),nl.set(0,0,1).applyQuaternion(pf);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(tl.x,n),t.positionY.linearRampToValueAtTime(tl.y,n),t.positionZ.linearRampToValueAtTime(tl.z,n),t.orientationX.linearRampToValueAtTime(nl.x,n),t.orientationY.linearRampToValueAtTime(nl.y,n),t.orientationZ.linearRampToValueAtTime(nl.z,n)}else t.setPosition(tl.x,tl.y,tl.z),t.setOrientation(nl.x,nl.y,nl.z)}}class ip{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class mf{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,s;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,s=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,s=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,s=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=s,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let s=this.cumulativeWeight;if(s===0){for(let a=0;a!==i;++a)n[r+a]=n[a];s=t}else{s+=t;const a=t/s;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=s}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,s=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}s>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,s=i;r!==s;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let s=0;s!==r;++s)e[t+s]=e[n+s]}_slerp(e,t,n,i){ki.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const s=this._workIndex*r;ki.multiplyQuaternionsFlat(e,s,e,t,e,n),ki.slerpFlat(e,t,e,t,e,s,i)}_lerp(e,t,n,i,r){const s=1-i;for(let a=0;a!==r;++a){const l=t+a;e[l]=e[l]*s+e[n+a]*i}}_lerpAdditive(e,t,n,i,r){for(let s=0;s!==r;++s){const a=t+s;e[a]=e[a]+e[n+s]*i}}}const Ld="\\[\\]\\.:\\/",rp=new RegExp("["+Ld+"]","g"),Dd="[^"+Ld+"]",sp="[^"+Ld.replace("\\.","")+"]",ap=/((?:WC+[\/:])*)/.source.replace("WC",Dd),op=/(WCOD+)?/.source.replace("WCOD",sp),lp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Dd),cp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Dd),hp=new RegExp("^"+ap+op+lp+cp+"$"),up=["material","materials","bones","map"];class dp{constructor(e,t,n){const i=n||dn.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class dn{constructor(e,t,n){this.path=t,this.parsedPath=n||dn.parseTrackName(t),this.node=dn.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new dn.Composite(e,t,n):new dn(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(rp,"")}static parseTrackName(e){const t=hp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);up.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let s=0;s<r.length;s++){const a=r[s];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=dn.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const s=e[i];if(s===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=r}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}dn.Composite=dp,dn.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},dn.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},dn.prototype.GetterByBindingType=[dn.prototype._getValue_direct,dn.prototype._getValue_array,dn.prototype._getValue_arrayElement,dn.prototype._getValue_toArray],dn.prototype.SetterByBindingTypeAndVersioning=[[dn.prototype._setValue_direct,dn.prototype._setValue_direct_setNeedsUpdate,dn.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dn.prototype._setValue_array,dn.prototype._setValue_array_setNeedsUpdate,dn.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dn.prototype._setValue_arrayElement,dn.prototype._setValue_arrayElement_setNeedsUpdate,dn.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dn.prototype._setValue_fromArray,dn.prototype._setValue_fromArray_setNeedsUpdate,dn.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class fp{constructor(){this.isAnimationObjectGroup=!0,this.uuid=nr(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,r=this._bindings,s=r.length;let a,l=e.length,c=this.nCachedObjects_;for(let d=0,p=arguments.length;d!==p;++d){const m=arguments[d],g=m.uuid;let _=t[g];if(_===void 0){_=l++,t[g]=_,e.push(m);for(let M=0,E=s;M!==E;++M)r[M].push(new dn(m,n[M],i[M]))}else if(_<c){a=e[_];const M=--c,E=e[M];t[E.uuid]=_,e[_]=E,t[g]=M,e[M]=m;for(let w=0,F=s;w!==F;++w){const D=r[w],B=D[M];let Q=D[_];D[_]=B,Q===void 0&&(Q=new dn(m,n[w],i[w])),D[M]=Q}}else e[_]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_;for(let s=0,a=arguments.length;s!==a;++s){const l=arguments[s],c=l.uuid,d=t[c];if(d!==void 0&&d>=r){const p=r++,m=e[p];t[m.uuid]=d,e[d]=m,t[c]=p,e[p]=l;for(let g=0,_=i;g!==_;++g){const M=n[g],E=M[p],w=M[d];M[d]=E,M[p]=w}}}this.nCachedObjects_=r}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_,s=e.length;for(let a=0,l=arguments.length;a!==l;++a){const c=arguments[a],d=c.uuid,p=t[d];if(p!==void 0)if(delete t[d],p<r){const m=--r,g=e[m],_=--s,M=e[_];t[g.uuid]=p,e[p]=g,t[M.uuid]=m,e[m]=M,e.pop();for(let E=0,w=i;E!==w;++E){const F=n[E],D=F[m],B=F[_];F[p]=D,F[m]=B,F.pop()}}else{const m=--s,g=e[m];m>0&&(t[g.uuid]=p),e[p]=g,e.pop();for(let _=0,M=i;_!==M;++_){const E=n[_];E[p]=E[m],E.pop()}}}this.nCachedObjects_=r}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const r=this._bindings;if(i!==void 0)return r[i];const s=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,d=this.nCachedObjects_,p=new Array(c);i=r.length,n[e]=i,s.push(e),a.push(t),r.push(p);for(let m=d,g=l.length;m!==g;++m){const _=l[m];p[m]=new dn(_,e,t)}return p}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,r=this._parsedPaths,s=this._bindings,a=s.length-1,l=s[a],c=e[a];t[c]=n,s[n]=l,s.pop(),r[n]=r[a],r.pop(),i[n]=i[a],i.pop()}}}class gf{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,s=r.length,a=new Array(s),l={endingStart:fr,endingEnd:fr};for(let c=0;c!==s;++c){const d=r[c].createInterpolant(null);a[c]=d,d.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(s),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Gi,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,s=r/i,a=i/r;e.warp(1,s,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,s=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/s,c[1]=t/s,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const s=this._updateTime(t),a=this._updateWeight(e);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Mr:for(let d=0,p=l.length;d!==p;++d)l[d].evaluate(s),c[d].accumulateAdditive(a);break;case os:default:for(let d=0,p=l.length;d!==p;++d)l[d].evaluate(s),c[d].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const s=n===Cs;if(e===0)return r===-1?i:s&&(r&1)===1?t-i:i;if(n===Or){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,s)):this._setEndings(this.repetitions===0,!0,s)),i>=t||i<0){const a=Math.floor(i/t);i-=t*a,r+=Math.abs(a);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,s)}else this._setEndings(!1,!1,s);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(s&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=tr,i.endingEnd=tr):(e?i.endingStart=this.zeroSlopeAtStart?tr:fr:i.endingStart=Gr,t?i.endingEnd=this.zeroSlopeAtEnd?tr:fr:i.endingEnd=Gr)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let s=this._weightInterpolant;s===null&&(s=i._lendControlInterpolant(),this._weightInterpolant=s);const a=s.parameterPositions,l=s.sampleValues;return a[0]=r,l[0]=t,a[1]=r+e,l[1]=n,this}}const pp=new Float32Array(1);class mp extends cs{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,s=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let d=c[l];d===void 0&&(d={},c[l]=d);for(let p=0;p!==r;++p){const m=i[p],g=m.name;let _=d[g];if(_!==void 0)++_.referenceCount,s[p]=_;else{if(_=s[p],_!==void 0){_._cacheIndex===null&&(++_.referenceCount,this._addInactiveBinding(_,l,g));continue}const M=t&&t._propertyBindings[p].binding.parsedPath;_=new mf(dn.create(n,g,M),m.ValueTypeName,m.getValueSize()),++_.referenceCount,this._addInactiveBinding(_,l,g),s[p]=_}a[p].resultBuffer=_.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let s=r[t];if(s===void 0)s={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=s;else{const a=s.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),s.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,s=this._actionsByClip,a=s[r],l=a.knownActions,c=l[l.length-1],d=e._byClipCacheIndex;c._byClipCacheIndex=d,l[d]=c,l.pop(),e._byClipCacheIndex=null;const p=a.actionByRoot,m=(e._localRoot||this._root).uuid;delete p[m],l.length===0&&delete s[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let s=i[t];s===void 0&&(s={},i[t]=s),s[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,s=this._bindingsByRootAndName,a=s[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[r],Object.keys(a).length===0&&delete s[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Md(new Float32Array(2),new Float32Array(2),1,pp),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let s=typeof e=="string"?Zc.findByName(i,e):e;const a=s!==null?s.uuid:e,l=this._actionsByClip[a];let c=null;if(n===void 0&&(s!==null?n=s.blendMode:n=os),l!==void 0){const p=l.actionByRoot[r];if(p!==void 0&&p.blendMode===n)return p;c=l.knownActions[0],s===null&&(s=c._clip)}if(s===null)return null;const d=new gf(this,s,t,n);return this._bindAction(d,c),this._addInactiveAction(d,a,r),d}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Zc.findByName(n,e):e,s=r?r.uuid:e,a=this._actionsByClip[s];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),s=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,s);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(s);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const s=r.knownActions;for(let a=0,l=s.length;a!==l;++a){const c=s[a];this._deactivateAction(c);const d=c._cacheIndex,p=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,p._cacheIndex=d,t[d]=p,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const s in n){const a=n[s].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const s in r){const a=r[s];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class gp extends xc{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isRenderTarget3D=!0,this.depth=n,this.texture=new yc(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class Ud{constructor(e){this.value=e}clone(){return new Ud(this.value.clone===void 0?this.value:this.value.clone())}}let _p=0;class xp extends cs{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:_p++}),this.name="",this.usage=Ia,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const r=Array.isArray(t[n])?t[n]:[t[n]];for(let s=0;s<r.length;s++)this.uniforms.push(r[s].clone())}return this}clone(){return new this.constructor().copy(this)}}class yp extends wl{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class vp{constructor(e,t,n,i,r,s=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=r,this.normalized=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const _f=new Ot;class Mp{constructor(e,t,n=0,i=1/0){this.ray=new za(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new uh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return _f.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(_f),this}intersectObject(e,t=!0,n=[]){return Fd(e,this,n,t),n.sort(xf),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Fd(e[i],this,n,t);return n.sort(xf),n}}function xf(u,e){return u.distance-e.distance}function Fd(u,e,t,n){let i=!0;if(u.layers.test(e.layers)&&u.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=u.children;for(let s=0,a=r.length;s<a;s++)Fd(r[s],e,t,!0)}}class Sp{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=bp.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function bp(){this._document.hidden===!1&&this.reset()}class Tp{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=At(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(At(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Ap{constructor(e=1,t=0,n=0){this.radius=e,this.theta=t,this.y=n}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}class Nd{constructor(e,t,n,i){Nd.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}}const yf=new Pe;class Ep{constructor(e=new Pe(1/0,1/0),t=new Pe(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=yf.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yf).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const vf=new U,Qh=new U,jl=new U,ec=new U,Bd=new U,wp=new U,Cp=new U;class Rp{constructor(e=new U,t=new U){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){vf.subVectors(e,this.start),Qh.subVectors(this.end,this.start);const n=Qh.dot(Qh);let r=Qh.dot(vf)/n;return t&&(r=At(r,0,1)),r}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=wp,n=Cp){const i=10000000000000001e-32;let r,s;const a=this.start,l=e.start,c=this.end,d=e.end;jl.subVectors(c,a),ec.subVectors(d,l),Bd.subVectors(a,l);const p=jl.dot(jl),m=ec.dot(ec),g=ec.dot(Bd);if(p<=i&&m<=i)return t.copy(a),n.copy(l),t.sub(n),t.dot(t);if(p<=i)r=0,s=g/m,s=At(s,0,1);else{const _=jl.dot(Bd);if(m<=i)s=0,r=At(-_/p,0,1);else{const M=jl.dot(ec),E=p*m-M*M;E!==0?r=At((M*g-_*m)/E,0,1):r=0,s=(M*r+g)/m,s<0?(s=0,r=At(-_/p,0,1)):s>1&&(s=1,r=At((M-_)/p,0,1))}}return t.copy(a).add(jl.multiplyScalar(r)),n.copy(l).add(ec.multiplyScalar(s)),t.sub(n),t.dot(t)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Mf=new U;class Ip extends cn{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new qt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let s=0,a=1,l=32;s<l;s++,a++){const c=s/l*Math.PI*2,d=a/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(d),Math.sin(d),1)}n.setAttribute("position",new et(i,3));const r=new Fi({fog:!1,toneMapped:!1});this.cone=new f(n,r),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Mf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Mf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const no=new U,jh=new Ot,Od=new Ot;class Pp extends f{constructor(e){const t=Sf(e),n=new qt,i=[],r=[];for(let c=0;c<t.length;c++){const d=t[c];d.parent&&d.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(0,0,0),r.push(0,0,0))}n.setAttribute("position",new et(i,3)),n.setAttribute("color",new et(r,3));const s=new Fi({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,s),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;const a=new Pt(255),l=new Pt(65280);this.setColors(a,l)}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");Od.copy(this.root.matrixWorld).invert();for(let r=0,s=0;r<t.length;r++){const a=t[r];a.parent&&a.parent.isBone&&(jh.multiplyMatrices(Od,a.matrixWorld),no.setFromMatrixPosition(jh),i.setXYZ(s,no.x,no.y,no.z),jh.multiplyMatrices(Od,a.parent.matrixWorld),no.setFromMatrixPosition(jh),i.setXYZ(s+1,no.x,no.y,no.z),s+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){const i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,e.r,e.g,e.b),i.setXYZ(r+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function Sf(u){const e=[];u.isBone===!0&&e.push(u);for(let t=0;t<u.children.length;t++)e.push(...Sf(u.children[t]));return e}class Lp extends sr{constructor(e,t,n){const i=new q(t,4,2),r=new sa({wireframe:!0,fog:!1,toneMapped:!1});super(i,r),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const Dp=new U,bf=new Pt,Tf=new Pt;class Up extends cn{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new Zo(t);i.rotateY(Math.PI*.5),this.material=new sa({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const r=i.getAttribute("position"),s=new Float32Array(r.count*3);i.setAttribute("color",new An(s,3)),this.add(new sr(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");bf.copy(this.light.color),Tf.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const r=n<i/2?bf:Tf;t.setXYZ(n,r.r,r.g,r.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(Dp.setFromMatrixPosition(this.light.matrixWorld).negate())}}class Fp extends f{constructor(e=10,t=10,n=4473924,i=8947848){n=new Pt(n),i=new Pt(i);const r=t/2,s=e/t,a=e/2,l=[],c=[];for(let m=0,g=0,_=-a;m<=t;m++,_+=s){l.push(-a,0,_,a,0,_),l.push(_,0,-a,_,0,a);const M=m===r?n:i;M.toArray(c,g),g+=3,M.toArray(c,g),g+=3,M.toArray(c,g),g+=3,M.toArray(c,g),g+=3}const d=new qt;d.setAttribute("position",new et(l,3)),d.setAttribute("color",new et(c,3));const p=new Fi({vertexColors:!0,toneMapped:!1});super(d,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Np extends f{constructor(e=10,t=16,n=8,i=64,r=4473924,s=8947848){r=new Pt(r),s=new Pt(s);const a=[],l=[];if(t>1)for(let p=0;p<t;p++){const m=p/t*(Math.PI*2),g=Math.sin(m)*e,_=Math.cos(m)*e;a.push(0,0,0),a.push(g,0,_);const M=p&1?r:s;l.push(M.r,M.g,M.b),l.push(M.r,M.g,M.b)}for(let p=0;p<n;p++){const m=p&1?r:s,g=e-e/n*p;for(let _=0;_<i;_++){let M=_/i*(Math.PI*2),E=Math.sin(M)*g,w=Math.cos(M)*g;a.push(E,0,w),l.push(m.r,m.g,m.b),M=(_+1)/i*(Math.PI*2),E=Math.sin(M)*g,w=Math.cos(M)*g,a.push(E,0,w),l.push(m.r,m.g,m.b)}}const c=new qt;c.setAttribute("position",new et(a,3)),c.setAttribute("color",new et(l,3));const d=new Fi({vertexColors:!0,toneMapped:!1});super(c,d),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Af=new U,eu=new U,Ef=new U;class Bp extends cn{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new qt;i.setAttribute("position",new et([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const r=new Fi({fog:!1,toneMapped:!1});this.lightPlane=new Gs(i,r),this.add(this.lightPlane),i=new qt,i.setAttribute("position",new et([0,0,0,0,0,1],3)),this.targetLine=new Gs(i,r),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Af.setFromMatrixPosition(this.light.matrixWorld),eu.setFromMatrixPosition(this.light.target.matrixWorld),Ef.subVectors(eu,Af),this.lightPlane.lookAt(eu),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(eu),this.targetLine.scale.z=Ef.length()}}const tu=new U,ti=new bl;class Op extends f{constructor(e){const t=new qt,n=new Fi({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],r=[],s={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(_,M){l(_),l(M)}function l(_){i.push(0,0,0),r.push(0,0,0),s[_]===void 0&&(s[_]=[]),s[_].push(i.length/3-1)}t.setAttribute("position",new et(i,3)),t.setAttribute("color",new et(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=s,this.update();const c=new Pt(16755200),d=new Pt(16711680),p=new Pt(43775),m=new Pt(16777215),g=new Pt(3355443);this.setColors(c,d,p,m,g)}setColors(e,t,n,i,r){const a=this.geometry.getAttribute("color");return a.setXYZ(0,e.r,e.g,e.b),a.setXYZ(1,e.r,e.g,e.b),a.setXYZ(2,e.r,e.g,e.b),a.setXYZ(3,e.r,e.g,e.b),a.setXYZ(4,e.r,e.g,e.b),a.setXYZ(5,e.r,e.g,e.b),a.setXYZ(6,e.r,e.g,e.b),a.setXYZ(7,e.r,e.g,e.b),a.setXYZ(8,e.r,e.g,e.b),a.setXYZ(9,e.r,e.g,e.b),a.setXYZ(10,e.r,e.g,e.b),a.setXYZ(11,e.r,e.g,e.b),a.setXYZ(12,e.r,e.g,e.b),a.setXYZ(13,e.r,e.g,e.b),a.setXYZ(14,e.r,e.g,e.b),a.setXYZ(15,e.r,e.g,e.b),a.setXYZ(16,e.r,e.g,e.b),a.setXYZ(17,e.r,e.g,e.b),a.setXYZ(18,e.r,e.g,e.b),a.setXYZ(19,e.r,e.g,e.b),a.setXYZ(20,e.r,e.g,e.b),a.setXYZ(21,e.r,e.g,e.b),a.setXYZ(22,e.r,e.g,e.b),a.setXYZ(23,e.r,e.g,e.b),a.setXYZ(24,t.r,t.g,t.b),a.setXYZ(25,t.r,t.g,t.b),a.setXYZ(26,t.r,t.g,t.b),a.setXYZ(27,t.r,t.g,t.b),a.setXYZ(28,t.r,t.g,t.b),a.setXYZ(29,t.r,t.g,t.b),a.setXYZ(30,t.r,t.g,t.b),a.setXYZ(31,t.r,t.g,t.b),a.setXYZ(32,n.r,n.g,n.b),a.setXYZ(33,n.r,n.g,n.b),a.setXYZ(34,n.r,n.g,n.b),a.setXYZ(35,n.r,n.g,n.b),a.setXYZ(36,n.r,n.g,n.b),a.setXYZ(37,n.r,n.g,n.b),a.setXYZ(38,i.r,i.g,i.b),a.setXYZ(39,i.r,i.g,i.b),a.setXYZ(40,r.r,r.g,r.b),a.setXYZ(41,r.r,r.g,r.b),a.setXYZ(42,r.r,r.g,r.b),a.setXYZ(43,r.r,r.g,r.b),a.setXYZ(44,r.r,r.g,r.b),a.setXYZ(45,r.r,r.g,r.b),a.setXYZ(46,r.r,r.g,r.b),a.setXYZ(47,r.r,r.g,r.b),a.setXYZ(48,r.r,r.g,r.b),a.setXYZ(49,r.r,r.g,r.b),a.needsUpdate=!0,this}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;let r,s;if(ti.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,s=0;else if(this.camera.coordinateSystem===br)r=-1,s=1;else if(this.camera.coordinateSystem===Pa)r=0,s=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);ci("c",t,e,ti,0,0,r),ci("t",t,e,ti,0,0,s),ci("n1",t,e,ti,-n,-i,r),ci("n2",t,e,ti,n,-i,r),ci("n3",t,e,ti,-n,i,r),ci("n4",t,e,ti,n,i,r),ci("f1",t,e,ti,-n,-i,s),ci("f2",t,e,ti,n,-i,s),ci("f3",t,e,ti,-n,i,s),ci("f4",t,e,ti,n,i,s),ci("u1",t,e,ti,n*.7,i*1.1,r),ci("u2",t,e,ti,-n*.7,i*1.1,r),ci("u3",t,e,ti,0,i*2,r),ci("cf1",t,e,ti,-n,0,s),ci("cf2",t,e,ti,n,0,s),ci("cf3",t,e,ti,0,-i,s),ci("cf4",t,e,ti,0,i,s),ci("cn1",t,e,ti,-n,0,r),ci("cn2",t,e,ti,n,0,r),ci("cn3",t,e,ti,0,-i,r),ci("cn4",t,e,ti,0,i,r),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function ci(u,e,t,n,i,r,s){tu.set(i,r,s).unproject(n);const a=e[u];if(a!==void 0){const l=t.getAttribute("position");for(let c=0,d=a.length;c<d;c++)l.setXYZ(a[c],tu.x,tu.y,tu.z)}}const nu=new Ai;class zp extends f{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),r=new qt;r.setIndex(new An(n,1)),r.setAttribute("position",new An(i,3)),super(r,new Fi({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&nu.setFromObject(this.object),nu.isEmpty())return;const e=nu.min,t=nu.max,n=this.geometry.attributes.position,i=n.array;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=e.x,i[4]=t.y,i[5]=t.z,i[6]=e.x,i[7]=e.y,i[8]=t.z,i[9]=t.x,i[10]=e.y,i[11]=t.z,i[12]=t.x,i[13]=t.y,i[14]=e.z,i[15]=e.x,i[16]=t.y,i[17]=e.z,i[18]=e.x,i[19]=e.y,i[20]=e.z,i[21]=t.x,i[22]=e.y,i[23]=e.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Gp extends f{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new qt;r.setIndex(new An(n,1)),r.setAttribute("position",new et(i,3)),super(r,new Fi({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class kp extends Gs{constructor(e,t=1,n=16776960){const i=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],s=new qt;s.setAttribute("position",new et(r,3)),s.computeBoundingSphere(),super(s,new Fi({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new qt;l.setAttribute("position",new et(a,3)),l.computeBoundingSphere(),this.add(new sr(l,new sa({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const wf=new U;let iu,zd;class Vp extends cn{constructor(e=new U(0,0,1),t=new U(0,0,0),n=1,i=16776960,r=n*.2,s=r*.2){super(),this.type="ArrowHelper",iu===void 0&&(iu=new qt,iu.setAttribute("position",new et([0,0,0,0,1,0],3)),zd=new ee(.5,1,5,1),zd.translate(0,-.5,0)),this.position.copy(t),this.line=new Gs(iu,new Fi({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new sr(zd,new sa({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,s)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{wf.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(wf,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class Hp extends f{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new qt;i.setAttribute("position",new et(t,3)),i.setAttribute("color",new et(n,3));const r=new Fi({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(e,t,n){const i=new Pt,r=this.geometry.attributes.color.array;return i.set(e),i.toArray(r,0),i.toArray(r,3),i.set(t),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Wp{constructor(){this.type="ShapePath",this.color=new Pt,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new Dn,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,s){return this.currentPath.bezierCurveTo(e,t,n,i,r,s),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(w){const F=[];for(let D=0,B=w.length;D<B;D++){const Q=w[D],ce=new I;ce.curves=Q.curves,F.push(ce)}return F}function n(w,F){const D=F.length;let B=!1;for(let Q=D-1,ce=0;ce<D;Q=ce++){let xe=F[Q],de=F[ce],Ie=de.x-xe.x,Be=de.y-xe.y;if(Math.abs(Be)>Number.EPSILON){if(Be<0&&(xe=F[ce],Ie=-Ie,de=F[Q],Be=-Be),w.y<xe.y||w.y>de.y)continue;if(w.y===xe.y){if(w.x===xe.x)return!0}else{const dt=Be*(w.x-xe.x)-Ie*(w.y-xe.y);if(dt===0)return!0;if(dt<0)continue;B=!B}}else{if(w.y!==xe.y)continue;if(de.x<=w.x&&w.x<=xe.x||xe.x<=w.x&&w.x<=de.x)return!0}}return B}const i=qi.isClockWise,r=this.subPaths;if(r.length===0)return[];let s,a,l;const c=[];if(r.length===1)return a=r[0],l=new I,l.curves=a.curves,c.push(l),c;let d=!i(r[0].getPoints());d=e?!d:d;const p=[],m=[];let g=[],_=0,M;m[_]=void 0,g[_]=[];for(let w=0,F=r.length;w<F;w++)a=r[w],M=a.getPoints(),s=i(M),s=e?!s:s,s?(!d&&m[_]&&_++,m[_]={s:new I,p:M},m[_].s.curves=a.curves,d&&_++,g[_]=[]):g[_].push({h:a,p:M[0]});if(!m[0])return t(r);if(m.length>1){let w=!1,F=0;for(let D=0,B=m.length;D<B;D++)p[D]=[];for(let D=0,B=m.length;D<B;D++){const Q=g[D];for(let ce=0;ce<Q.length;ce++){const xe=Q[ce];let de=!0;for(let Ie=0;Ie<m.length;Ie++)n(xe.p,m[Ie].p)&&(D!==Ie&&F++,de?(de=!1,p[Ie].push(xe)):w=!0);de&&p[D].push(xe)}}F>0&&w===!1&&(g=p)}let E;for(let w=0,F=m.length;w<F;w++){l=m[w].s,c.push(l),E=g[w];for(let D=0,B=E.length;D<B;D++)l.holes.push(E[D].h)}return c}}class Xp extends cs{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function qp(u,e){const t=u.image&&u.image.width?u.image.width/u.image.height:1;return t>e?(u.repeat.x=1,u.repeat.y=t/e,u.offset.x=0,u.offset.y=(1-u.repeat.y)/2):(u.repeat.x=e/t,u.repeat.y=1,u.offset.x=(1-u.repeat.x)/2,u.offset.y=0),u}function Yp(u,e){const t=u.image&&u.image.width?u.image.width/u.image.height:1;return t>e?(u.repeat.x=e/t,u.repeat.y=1,u.offset.x=(1-u.repeat.x)/2,u.offset.y=0):(u.repeat.x=1,u.repeat.y=t/e,u.offset.x=0,u.offset.y=(1-u.repeat.y)/2),u}function Zp(u){return u.repeat.x=1,u.repeat.y=1,u.offset.x=0,u.offset.y=0,u}function Cf(u,e,t,n){const i=$p(n);switch(t){case Js:return u*e;case zi:return u*e/i.components*i.byteLength;case Qr:return u*e/i.components*i.byteLength;case Ms:return u*e*2/i.components*i.byteLength;case Ss:return u*e*2/i.components*i.byteLength;case yr:return u*e*3/i.components*i.byteLength;case bi:return u*e*4/i.components*i.byteLength;case bs:return u*e*4/i.components*i.byteLength;case jr:case Ta:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*8;case es:case ts:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*16;case co:case Ks:return Math.max(u,16)*Math.max(e,8)/4;case Ts:case hi:return Math.max(u,8)*Math.max(e,8)/2;case ho:case uo:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*8;case ns:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*16;case Qs:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*16;case As:return Math.floor((u+4)/5)*Math.floor((e+3)/4)*16;case fo:return Math.floor((u+4)/5)*Math.floor((e+4)/5)*16;case Aa:return Math.floor((u+5)/6)*Math.floor((e+4)/5)*16;case po:return Math.floor((u+5)/6)*Math.floor((e+5)/6)*16;case mo:return Math.floor((u+7)/8)*Math.floor((e+4)/5)*16;case vr:return Math.floor((u+7)/8)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((u+7)/8)*Math.floor((e+7)/8)*16;case Nr:return Math.floor((u+9)/10)*Math.floor((e+4)/5)*16;case ur:return Math.floor((u+9)/10)*Math.floor((e+5)/6)*16;case dr:return Math.floor((u+9)/10)*Math.floor((e+7)/8)*16;case is:return Math.floor((u+9)/10)*Math.floor((e+9)/10)*16;case go:return Math.floor((u+11)/12)*Math.floor((e+9)/10)*16;case rs:return Math.floor((u+11)/12)*Math.floor((e+11)/12)*16;case ss:case Br:case Es:return Math.ceil(u/4)*Math.ceil(e/4)*16;case js:case ws:return Math.ceil(u/4)*Math.ceil(e/4)*8;case wa:case _o:return Math.ceil(u/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $p(u){switch(u){case ys:case ba:return{byteLength:1,components:1};case Zs:case vs:case oo:return{byteLength:2,components:1};case On:case hr:return{byteLength:2,components:4};case $s:case ao:case Dr:return{byteLength:4,components:1};case Ur:case Si:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${u}.`)}class Jp{static contain(e,t){return qp(e,t)}static cover(e,t){return Yp(e,t)}static fill(e){return Zp(e)}static getByteLength(e,t,n,i){return Cf(e,t,n,i)}}return typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180"),Object.assign(Mn,{ACESFilmicToneMapping:Hs,AddEquation:Ke,AddOperation:io,AdditiveAnimationBlendMode:Mr,AdditiveBlending:$i,AgXToneMapping:ol,AlphaFormat:Js,AlwaysCompare:th,AlwaysDepth:kn,AlwaysStencilFunc:vo,AmbientLight:tf,AnimationAction:gf,AnimationClip:Zc,AnimationLoader:zf,AnimationMixer:mp,AnimationObjectGroup:fp,AnimationUtils:Ff,ArcCurve:be,ArrayCamera:Qf,ArrowHelper:Vp,AttachedBindMode:Sa,Audio:ff,AudioAnalyser:ip,AudioContext:Id,AudioListener:ep,AudioLoader:Jf,AxesHelper:Hp,BackSide:Bi,BasicDepthPacking:Vn,BasicShadowMap:en,BatchedMesh:Wh,Bone:Nc,BooleanKeyframeTrack:$o,Box2:Ep,Box3:Ai,Box3Helper:Gp,BoxGeometry:zn,BoxHelper:zp,BufferAttribute:An,BufferGeometry:qt,BufferGeometryLoader:of,ByteType:ba,Cache:Vs,Camera:bl,CameraHelper:Op,CanvasTexture:C,CapsuleGeometry:J,CatmullRomCurve3:un,CineonToneMapping:al,CircleGeometry:k,ClampToEdgeWrapping:Ii,Clock:df,Color:Pt,ColorKeyframeTrack:Sd,ColorManagement:Vi,CompressedArrayTexture:ge,CompressedCubeTexture:ae,CompressedTexture:$,CompressedTextureLoader:Gf,ConeGeometry:ee,ConstantAlphaFactor:fi,ConstantColorFactor:Qn,Controls:Xp,CubeCamera:Eh,CubeReflectionMapping:Kr,CubeRefractionMapping:so,CubeTexture:Tl,CubeTextureLoader:kf,CubeUVReflectionMapping:Ki,CubicBezierCurve:O,CubicBezierCurve3:In,CubicInterpolant:Wd,CullFaceBack:Xt,CullFaceFront:ri,CullFaceFrontBack:Tn,CullFaceNone:Oe,Curve:we,CurvePath:li,CustomBlending:Ve,CustomToneMapping:Ws,CylinderGeometry:he,Cylindrical:Ap,Data3DTexture:yc,DataArrayTexture:hh,DataTexture:or,DataTextureLoader:Vf,DataUtils:yh,DecrementStencilOp:Is,DecrementWrapStencilOp:xo,DefaultLoadingManager:Yd,DepthFormat:Fr,DepthStencilFormat:Pi,DepthTexture:v,DetachedBindMode:Jr,DirectionalLight:ef,DirectionalLightHelper:Bp,DiscreteInterpolant:Xd,DodecahedronGeometry:ve,DoubleSide:Xe,DstAlphaFactor:mn,DstColorFactor:Gn,DynamicCopyUsage:hu,DynamicDrawUsage:uc,DynamicReadUsage:ou,EdgesGeometry:Ae,EllipseCurve:Se,EqualCompare:Qc,EqualDepth:_r,EqualStencilFunc:rc,EquirectangularReflectionMapping:Xs,EquirectangularRefractionMapping:Oi,Euler:kr,EventDispatcher:cs,ExternalTexture:re,ExtrudeGeometry:$l,FileLoader:_a,Float16BufferAttribute:vl,Float32BufferAttribute:et,FloatType:Dr,Fog:El,FogExp2:Al,FramebufferTexture:X,FrontSide:gr,Frustum:zl,FrustumArray:Gl,GLBufferAttribute:vp,GLSL1:du,GLSL3:fu,GreaterCompare:hl,GreaterDepth:Zr,GreaterEqualCompare:eh,GreaterEqualDepth:rl,GreaterEqualStencilFunc:lc,GreaterStencilFunc:ac,GridHelper:Fp,Group:Ya,HalfFloatType:oo,HemisphereLight:Zd,HemisphereLightHelper:Up,IcosahedronGeometry:Jl,ImageBitmapLoader:$f,ImageLoader:$c,ImageUtils:ch,IncrementStencilOp:pi,IncrementWrapStencilOp:ls,InstancedBufferAttribute:Qa,InstancedBufferGeometry:af,InstancedInterleavedBuffer:yp,InstancedMesh:Oh,Int16BufferAttribute:ed,Int32BufferAttribute:td,Int8BufferAttribute:oa,IntType:ao,InterleavedBuffer:wl,InterleavedBufferAttribute:ca,Interpolant:Wc,InterpolateDiscrete:zr,InterpolateLinear:as,InterpolateSmooth:Rs,InterpolationSamplingMode:gu,InterpolationSamplingType:mu,InvertStencilOp:yo,KeepStencilOp:Rn,KeyframeTrack:qr,LOD:Uc,LatheGeometry:Kl,Layers:uh,LessCompare:hc,LessDepth:yi,LessEqualCompare:jc,LessEqualDepth:Zn,LessEqualStencilFunc:sc,LessStencilFunc:ic,Light:to,LightProbe:sf,Line:Gs,Line3:Rp,LineBasicMaterial:Fi,LineCurve:Ft,LineCurve3:Ct,LineDashedMaterial:eo,LineLoop:h,LineSegments:f,LinearFilter:$n,LinearInterpolant:Md,LinearMipMapLinearFilter:Lr,LinearMipMapNearestFilter:Ir,LinearMipmapLinearFilter:Pr,LinearMipmapNearestFilter:Ys,LinearSRGBColorSpace:Mt,LinearToneMapping:ro,LinearTransfer:wt,Loader:mr,LoaderUtils:Cd,LoadingManager:bd,LoopOnce:Or,LoopPingPong:Cs,LoopRepeat:Gi,MOUSE:jt,Material:wi,MaterialLoader:Jh,MathUtils:Du,Matrix2:Nd,Matrix3:Tr,Matrix4:Ot,MaxEquation:Tt,Mesh:sr,MeshBasicMaterial:sa,MeshDepthMaterial:Yi,MeshDistanceMaterial:pa,MeshLambertMaterial:on,MeshMatcapMaterial:Zi,MeshNormalMaterial:Fn,MeshPhongMaterial:vn,MeshPhysicalMaterial:wn,MeshStandardMaterial:Un,MeshToonMaterial:xt,MinEquation:bt,MirroredRepeatWrapping:Rr,MixOperation:sl,MultiplyBlending:Re,MultiplyOperation:$r,NearestFilter:Mi,NearestMipMapLinearFilter:ji,NearestMipMapNearestFilter:cl,NearestMipmapLinearFilter:xr,NearestMipmapNearestFilter:qs,NeutralToneMapping:ll,NeverCompare:cc,NeverDepth:sn,NeverStencilFunc:nc,NoBlending:Ut,NoColorSpace:le,NoToneMapping:Ma,NormalAnimationBlendMode:os,NormalBlending:si,NotEqualCompare:su,NotEqualDepth:vi,NotEqualStencilFunc:oc,NumberKeyframeTrack:Xc,Object3D:cn,ObjectLoader:Yf,ObjectSpaceNormalMap:ye,OctahedronGeometry:Zo,OneFactor:rn,OneMinusConstantAlphaFactor:ft,OneMinusConstantColorFactor:hn,OneMinusDstAlphaFactor:mt,OneMinusDstColorFactor:yn,OneMinusSrcAlphaFactor:Bn,OneMinusSrcColorFactor:Kt,OrthographicCamera:wd,PCFShadowMap:tn,PCFSoftShadowMap:ln,Path:Dn,PerspectiveCamera:ar,Plane:ha,PlaneGeometry:T,PlaneHelper:kp,PointLight:jd,PointLightHelper:Lp,Points:j,PointsMaterial:x,PolarGridHelper:Np,PolyhedronGeometry:te,PositionalAudio:np,PropertyBinding:dn,PropertyMixer:mf,QuadraticBezierCurve:st,QuadraticBezierCurve3:En,Quaternion:ki,QuaternionKeyframeTrack:qc,QuaternionLinearInterpolant:qd,RAD2DEG:La,RED_GREEN_RGTC2_Format:wa,RED_RGTC1_Format:js,REVISION:"180",RGBADepthPacking:y,RGBAFormat:bi,RGBAIntegerFormat:bs,RGBA_ASTC_10x10_Format:is,RGBA_ASTC_10x5_Format:Nr,RGBA_ASTC_10x6_Format:ur,RGBA_ASTC_10x8_Format:dr,RGBA_ASTC_12x10_Format:go,RGBA_ASTC_12x12_Format:rs,RGBA_ASTC_4x4_Format:Qs,RGBA_ASTC_5x4_Format:As,RGBA_ASTC_5x5_Format:fo,RGBA_ASTC_6x5_Format:Aa,RGBA_ASTC_6x6_Format:po,RGBA_ASTC_8x5_Format:mo,RGBA_ASTC_8x6_Format:vr,RGBA_ASTC_8x8_Format:Ea,RGBA_BPTC_Format:ss,RGBA_ETC2_EAC_Format:ns,RGBA_PVRTC_2BPPV1_Format:Ks,RGBA_PVRTC_4BPPV1_Format:hi,RGBA_S3TC_DXT1_Format:Ta,RGBA_S3TC_DXT3_Format:es,RGBA_S3TC_DXT5_Format:ts,RGBDepthPacking:z,RGBFormat:yr,RGBIntegerFormat:lo,RGB_BPTC_SIGNED_Format:Br,RGB_BPTC_UNSIGNED_Format:Es,RGB_ETC1_Format:ho,RGB_ETC2_Format:uo,RGB_PVRTC_2BPPV1_Format:co,RGB_PVRTC_4BPPV1_Format:Ts,RGB_S3TC_DXT1_Format:jr,RGDepthPacking:V,RGFormat:Ms,RGIntegerFormat:Ss,RawShaderMaterial:_n,Ray:za,Raycaster:Mp,RectAreaLight:nf,RedFormat:zi,RedIntegerFormat:Qr,ReinhardToneMapping:Ji,RenderTarget:xc,RenderTarget3D:gp,RepeatWrapping:Qi,ReplaceStencilOp:Sr,ReverseSubtractEquation:He,RingGeometry:W,SIGNED_RED_GREEN_RGTC2_Format:_o,SIGNED_RED_RGTC1_Format:ws,SRGBColorSpace:$e,SRGBTransfer:Bt,Scene:wh,ShaderMaterial:Sl,ShadowMaterial:$t,Shape:I,ShapeGeometry:se,ShapePath:Wp,ShapeUtils:qi,ShortType:vs,Skeleton:Nl,SkeletonHelper:Pp,SkinnedMesh:Fh,Source:Ps,Sphere:mi,SphereGeometry:q,Spherical:Tp,SphericalHarmonics3:rf,SplineCurve:at,SpotLight:Kd,SpotLightHelper:Ip,Sprite:Ph,SpriteMaterial:Lc,SrcAlphaFactor:pn,SrcAlphaSaturateFactor:ai,SrcColorFactor:Zt,StaticCopyUsage:cu,StaticDrawUsage:Ia,StaticReadUsage:nh,StereoCamera:Kf,StreamCopyUsage:uu,StreamDrawUsage:au,StreamReadUsage:lu,StringKeyframeTrack:Jo,SubtractEquation:Ce,SubtractiveBlending:Nn,TOUCH:Dt,TangentSpaceNormalMap:ne,TetrahedronGeometry:Le,Texture:Jn,TextureLoader:Hf,TextureUtils:Jp,Timer:Sp,TimestampQuery:pu,TorusGeometry:We,TorusKnotGeometry:tt,Triangle:Ln,TriangleFanDrawMode:Ra,TriangleStripDrawMode:Ca,TrianglesDrawMode:ea,TubeGeometry:Je,UVMapping:xs,Uint16BufferAttribute:yl,Uint32BufferAttribute:Rc,Uint8BufferAttribute:Va,Uint8ClampedBufferAttribute:vh,Uniform:Ud,UniformsGroup:xp,UniformsUtils:rd,UnsignedByteType:ys,UnsignedInt101111Type:Si,UnsignedInt248Type:er,UnsignedInt5999Type:Ur,UnsignedIntType:$s,UnsignedShort4444Type:On,UnsignedShort5551Type:hr,UnsignedShortType:Zs,VSMShadowMap:_s,Vector2:Pe,Vector3:U,Vector4:oi,VectorKeyframeTrack:Yc,VideoFrameTexture:H,VideoTexture:ie,WebGL3DRenderTarget:ku,WebGLArrayRenderTarget:Gu,WebGLCoordinateSystem:br,WebGLCubeRenderTarget:od,WebGLRenderTarget:ul,WebGPUCoordinateSystem:Pa,WebXRController:cd,WireframeGeometry:St,WrapAroundEnding:Gr,ZeroCurvatureEnding:fr,ZeroFactor:Et,ZeroSlopeEnding:tr,ZeroStencilOp:Sn,arrayNeedsUint32:sh,cloneUniforms:Os,createCanvasElement:Fu,createElementNS:So,getByteLength:Cf,getUnlitUniformColorSpace:id,mergeUniforms:bh,probeAsync:Nu,warnOnce:mc}),Mn})(),THREE=(()=>{const Mn={};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const{Matrix3:kt,Vector2:jt,Color:Dt,mergeUniforms:Oe,Vector3:Xt,CubeUVReflectionMapping:ri,Mesh:Tn,BoxGeometry:en,ShaderMaterial:tn,BackSide:ln,cloneUniforms:_s,Euler:gr,Matrix4:Bi,ColorManagement:Xe,SRGBTransfer:Ut,PlaneGeometry:si,FrontSide:$i,getUnlitUniformColorSpace:Nn,IntType:Re,HalfFloatType:Ve,UnsignedByteType:Ke,FloatType:Ce,RGBAFormat:He,Plane:bt,EquirectangularReflectionMapping:Tt,EquirectangularRefractionMapping:Et,WebGLCubeRenderTarget:rn,CubeReflectionMapping:Zt,CubeRefractionMapping:Kt,OrthographicCamera:pn,PerspectiveCamera:Bn,NoToneMapping:mn,MeshBasicMaterial:mt,NoBlending:Gn,WebGLRenderTarget:yn,BufferGeometry:ai,BufferAttribute:Qn,LinearSRGBColorSpace:hn,LinearFilter:fi,warnOnce:ft,Uint32BufferAttribute:sn,Uint16BufferAttribute:kn,arrayNeedsUint32:yi,Vector4:Zn,DataArrayTexture:_r,CubeTexture:rl,Data3DTexture:Zr,LessEqualCompare:vi,DepthTexture:$r,Texture:sl,GLSL3:io,PCFShadowMap:Ma,PCFSoftShadowMap:ro,VSMShadowMap:Ji,CustomToneMapping:al,NeutralToneMapping:Hs,AgXToneMapping:Ws,ACESFilmicToneMapping:ol,CineonToneMapping:ll,ReinhardToneMapping:Sa,LinearToneMapping:Jr,LinearTransfer:xs,AddOperation:Kr,MixOperation:so,MultiplyOperation:Xs,UniformsUtils:Oi,DoubleSide:Ki,NormalBlending:Qi,TangentSpaceNormalMap:Ii,ObjectSpaceNormalMap:Rr,Layers:Mi,Frustum:qs,MeshDepthMaterial:cl,RGBADepthPacking:xr,MeshDistanceMaterial:ji,NearestFilter:$n,LessEqualDepth:Ys,ReverseSubtractEquation:Ir,SubtractEquation:Pr,AddEquation:Lr,OneMinusConstantAlphaFactor:ys,ConstantAlphaFactor:ba,OneMinusConstantColorFactor:vs,ConstantColorFactor:Zs,OneMinusDstAlphaFactor:ao,OneMinusDstColorFactor:$s,OneMinusSrcAlphaFactor:Dr,OneMinusSrcColorFactor:oo,DstAlphaFactor:On,DstColorFactor:hr,SrcAlphaSaturateFactor:er,SrcAlphaFactor:Ur,SrcColorFactor:Si,OneFactor:Js,ZeroFactor:yr,NotEqualDepth:bi,GreaterDepth:Fr,GreaterEqualDepth:Pi,EqualDepth:zi,LessDepth:Qr,AlwaysDepth:Ms,NeverDepth:Ss,CullFaceNone:lo,CullFaceBack:bs,CullFaceFront:jr,CustomBlending:Ta,MultiplyBlending:es,SubtractiveBlending:ts,AdditiveBlending:Ts,MinEquation:co,MaxEquation:hi,MirroredRepeatWrapping:Ks,ClampToEdgeWrapping:ho,RepeatWrapping:uo,LinearMipmapLinearFilter:ns,LinearMipmapNearestFilter:Qs,NearestMipmapLinearFilter:As,NearestMipmapNearestFilter:fo,NotEqualCompare:Aa,GreaterCompare:po,GreaterEqualCompare:mo,EqualCompare:vr,LessCompare:Ea,AlwaysCompare:Nr,NeverCompare:ur,NoColorSpace:dr,DepthStencilFormat:is,getByteLength:go,DepthFormat:rs,UnsignedIntType:ss,UnsignedInt248Type:Br,UnsignedShortType:Es,createElementNS:js,UnsignedShort4444Type:ws,UnsignedShort5551Type:wa,UnsignedInt5999Type:_o,UnsignedInt101111Type:Or,ByteType:Gi,ShortType:Cs,AlphaFormat:zr,RGBFormat:as,RedFormat:Rs,RedIntegerFormat:fr,RGFormat:tr,RGIntegerFormat:Gr,RGBAIntegerFormat:os,RGB_S3TC_DXT1_Format:Mr,RGBA_S3TC_DXT1_Format:ea,RGBA_S3TC_DXT3_Format:Ca,RGBA_S3TC_DXT5_Format:Ra,RGB_PVRTC_4BPPV1_Format:Vn,RGB_PVRTC_2BPPV1_Format:y,RGBA_PVRTC_4BPPV1_Format:z,RGBA_PVRTC_2BPPV1_Format:V,RGB_ETC1_Format:ne,RGB_ETC2_Format:ye,RGBA_ETC2_EAC_Format:le,RGBA_ASTC_4x4_Format:$e,RGBA_ASTC_5x4_Format:Mt,RGBA_ASTC_5x5_Format:wt,RGBA_ASTC_6x5_Format:Bt,RGBA_ASTC_6x6_Format:Sn,RGBA_ASTC_8x5_Format:Rn,RGBA_ASTC_8x6_Format:Sr,RGBA_ASTC_8x8_Format:pi,RGBA_ASTC_10x5_Format:Is,RGBA_ASTC_10x6_Format:ls,RGBA_ASTC_10x8_Format:xo,RGBA_ASTC_10x10_Format:yo,RGBA_ASTC_12x10_Format:nc,RGBA_ASTC_12x12_Format:ic,RGBA_BPTC_Format:rc,RGB_BPTC_SIGNED_Format:sc,RGB_BPTC_UNSIGNED_Format:ac,RED_RGTC1_Format:oc,SIGNED_RED_RGTC1_Format:lc,RED_GREEN_RGTC2_Format:vo,SIGNED_RED_GREEN_RGTC2_Format:cc,ExternalTexture:hc,EventDispatcher:Qc,ArrayCamera:jc,WebXRController:hl,RAD2DEG:su,createCanvasElement:eh,SRGBColorSpace:th,REVISION:Ia,WebGLCoordinateSystem:uc,probeAsync:au}=gmzThreeCore;Object.assign(Mn,{AdditiveAnimationBlendMode:gmzThreeCore.AdditiveAnimationBlendMode,AlwaysStencilFunc:gmzThreeCore.AlwaysStencilFunc,AmbientLight:gmzThreeCore.AmbientLight,AnimationAction:gmzThreeCore.AnimationAction,AnimationClip:gmzThreeCore.AnimationClip,AnimationLoader:gmzThreeCore.AnimationLoader,AnimationMixer:gmzThreeCore.AnimationMixer,AnimationObjectGroup:gmzThreeCore.AnimationObjectGroup,AnimationUtils:gmzThreeCore.AnimationUtils,ArcCurve:gmzThreeCore.ArcCurve,ArrowHelper:gmzThreeCore.ArrowHelper,AttachedBindMode:gmzThreeCore.AttachedBindMode,Audio:gmzThreeCore.Audio,AudioAnalyser:gmzThreeCore.AudioAnalyser,AudioContext:gmzThreeCore.AudioContext,AudioListener:gmzThreeCore.AudioListener,AudioLoader:gmzThreeCore.AudioLoader,AxesHelper:gmzThreeCore.AxesHelper,BasicDepthPacking:gmzThreeCore.BasicDepthPacking,BasicShadowMap:gmzThreeCore.BasicShadowMap,BatchedMesh:gmzThreeCore.BatchedMesh,Bone:gmzThreeCore.Bone,BooleanKeyframeTrack:gmzThreeCore.BooleanKeyframeTrack,Box2:gmzThreeCore.Box2,Box3:gmzThreeCore.Box3,Box3Helper:gmzThreeCore.Box3Helper,BoxHelper:gmzThreeCore.BoxHelper,BufferGeometryLoader:gmzThreeCore.BufferGeometryLoader,Cache:gmzThreeCore.Cache,Camera:gmzThreeCore.Camera,CameraHelper:gmzThreeCore.CameraHelper,CanvasTexture:gmzThreeCore.CanvasTexture,CapsuleGeometry:gmzThreeCore.CapsuleGeometry,CatmullRomCurve3:gmzThreeCore.CatmullRomCurve3,CircleGeometry:gmzThreeCore.CircleGeometry,Clock:gmzThreeCore.Clock,ColorKeyframeTrack:gmzThreeCore.ColorKeyframeTrack,CompressedArrayTexture:gmzThreeCore.CompressedArrayTexture,CompressedCubeTexture:gmzThreeCore.CompressedCubeTexture,CompressedTexture:gmzThreeCore.CompressedTexture,CompressedTextureLoader:gmzThreeCore.CompressedTextureLoader,ConeGeometry:gmzThreeCore.ConeGeometry,Controls:gmzThreeCore.Controls,CubeCamera:gmzThreeCore.CubeCamera,CubeTextureLoader:gmzThreeCore.CubeTextureLoader,CubicBezierCurve:gmzThreeCore.CubicBezierCurve,CubicBezierCurve3:gmzThreeCore.CubicBezierCurve3,CubicInterpolant:gmzThreeCore.CubicInterpolant,CullFaceFrontBack:gmzThreeCore.CullFaceFrontBack,Curve:gmzThreeCore.Curve,CurvePath:gmzThreeCore.CurvePath,CylinderGeometry:gmzThreeCore.CylinderGeometry,Cylindrical:gmzThreeCore.Cylindrical,DataTexture:gmzThreeCore.DataTexture,DataTextureLoader:gmzThreeCore.DataTextureLoader,DataUtils:gmzThreeCore.DataUtils,DecrementStencilOp:gmzThreeCore.DecrementStencilOp,DecrementWrapStencilOp:gmzThreeCore.DecrementWrapStencilOp,DefaultLoadingManager:gmzThreeCore.DefaultLoadingManager,DetachedBindMode:gmzThreeCore.DetachedBindMode,DirectionalLight:gmzThreeCore.DirectionalLight,DirectionalLightHelper:gmzThreeCore.DirectionalLightHelper,DiscreteInterpolant:gmzThreeCore.DiscreteInterpolant,DodecahedronGeometry:gmzThreeCore.DodecahedronGeometry,DynamicCopyUsage:gmzThreeCore.DynamicCopyUsage,DynamicDrawUsage:gmzThreeCore.DynamicDrawUsage,DynamicReadUsage:gmzThreeCore.DynamicReadUsage,EdgesGeometry:gmzThreeCore.EdgesGeometry,EllipseCurve:gmzThreeCore.EllipseCurve,EqualStencilFunc:gmzThreeCore.EqualStencilFunc,ExtrudeGeometry:gmzThreeCore.ExtrudeGeometry,FileLoader:gmzThreeCore.FileLoader,Float16BufferAttribute:gmzThreeCore.Float16BufferAttribute,Float32BufferAttribute:gmzThreeCore.Float32BufferAttribute,Fog:gmzThreeCore.Fog,FogExp2:gmzThreeCore.FogExp2,FramebufferTexture:gmzThreeCore.FramebufferTexture,FrustumArray:gmzThreeCore.FrustumArray,GLBufferAttribute:gmzThreeCore.GLBufferAttribute,GLSL1:gmzThreeCore.GLSL1,GreaterEqualStencilFunc:gmzThreeCore.GreaterEqualStencilFunc,GreaterStencilFunc:gmzThreeCore.GreaterStencilFunc,GridHelper:gmzThreeCore.GridHelper,Group:gmzThreeCore.Group,HemisphereLight:gmzThreeCore.HemisphereLight,HemisphereLightHelper:gmzThreeCore.HemisphereLightHelper,IcosahedronGeometry:gmzThreeCore.IcosahedronGeometry,ImageBitmapLoader:gmzThreeCore.ImageBitmapLoader,ImageLoader:gmzThreeCore.ImageLoader,ImageUtils:gmzThreeCore.ImageUtils,IncrementStencilOp:gmzThreeCore.IncrementStencilOp,IncrementWrapStencilOp:gmzThreeCore.IncrementWrapStencilOp,InstancedBufferAttribute:gmzThreeCore.InstancedBufferAttribute,InstancedBufferGeometry:gmzThreeCore.InstancedBufferGeometry,InstancedInterleavedBuffer:gmzThreeCore.InstancedInterleavedBuffer,InstancedMesh:gmzThreeCore.InstancedMesh,Int16BufferAttribute:gmzThreeCore.Int16BufferAttribute,Int32BufferAttribute:gmzThreeCore.Int32BufferAttribute,Int8BufferAttribute:gmzThreeCore.Int8BufferAttribute,InterleavedBuffer:gmzThreeCore.InterleavedBuffer,InterleavedBufferAttribute:gmzThreeCore.InterleavedBufferAttribute,Interpolant:gmzThreeCore.Interpolant,InterpolateDiscrete:gmzThreeCore.InterpolateDiscrete,InterpolateLinear:gmzThreeCore.InterpolateLinear,InterpolateSmooth:gmzThreeCore.InterpolateSmooth,InterpolationSamplingMode:gmzThreeCore.InterpolationSamplingMode,InterpolationSamplingType:gmzThreeCore.InterpolationSamplingType,InvertStencilOp:gmzThreeCore.InvertStencilOp,KeepStencilOp:gmzThreeCore.KeepStencilOp,KeyframeTrack:gmzThreeCore.KeyframeTrack,LOD:gmzThreeCore.LOD,LatheGeometry:gmzThreeCore.LatheGeometry,LessEqualStencilFunc:gmzThreeCore.LessEqualStencilFunc,LessStencilFunc:gmzThreeCore.LessStencilFunc,Light:gmzThreeCore.Light,LightProbe:gmzThreeCore.LightProbe,Line:gmzThreeCore.Line,Line3:gmzThreeCore.Line3,LineBasicMaterial:gmzThreeCore.LineBasicMaterial,LineCurve:gmzThreeCore.LineCurve,LineCurve3:gmzThreeCore.LineCurve3,LineDashedMaterial:gmzThreeCore.LineDashedMaterial,LineLoop:gmzThreeCore.LineLoop,LineSegments:gmzThreeCore.LineSegments,LinearInterpolant:gmzThreeCore.LinearInterpolant,LinearMipMapLinearFilter:gmzThreeCore.LinearMipMapLinearFilter,LinearMipMapNearestFilter:gmzThreeCore.LinearMipMapNearestFilter,Loader:gmzThreeCore.Loader,LoaderUtils:gmzThreeCore.LoaderUtils,LoadingManager:gmzThreeCore.LoadingManager,LoopOnce:gmzThreeCore.LoopOnce,LoopPingPong:gmzThreeCore.LoopPingPong,LoopRepeat:gmzThreeCore.LoopRepeat,MOUSE:gmzThreeCore.MOUSE,Material:gmzThreeCore.Material,MaterialLoader:gmzThreeCore.MaterialLoader,MathUtils:gmzThreeCore.MathUtils,Matrix2:gmzThreeCore.Matrix2,MeshLambertMaterial:gmzThreeCore.MeshLambertMaterial,MeshMatcapMaterial:gmzThreeCore.MeshMatcapMaterial,MeshNormalMaterial:gmzThreeCore.MeshNormalMaterial,MeshPhongMaterial:gmzThreeCore.MeshPhongMaterial,MeshPhysicalMaterial:gmzThreeCore.MeshPhysicalMaterial,MeshStandardMaterial:gmzThreeCore.MeshStandardMaterial,MeshToonMaterial:gmzThreeCore.MeshToonMaterial,NearestMipMapLinearFilter:gmzThreeCore.NearestMipMapLinearFilter,NearestMipMapNearestFilter:gmzThreeCore.NearestMipMapNearestFilter,NeverStencilFunc:gmzThreeCore.NeverStencilFunc,NormalAnimationBlendMode:gmzThreeCore.NormalAnimationBlendMode,NotEqualStencilFunc:gmzThreeCore.NotEqualStencilFunc,NumberKeyframeTrack:gmzThreeCore.NumberKeyframeTrack,Object3D:gmzThreeCore.Object3D,ObjectLoader:gmzThreeCore.ObjectLoader,OctahedronGeometry:gmzThreeCore.OctahedronGeometry,Path:gmzThreeCore.Path,PlaneHelper:gmzThreeCore.PlaneHelper,PointLight:gmzThreeCore.PointLight,PointLightHelper:gmzThreeCore.PointLightHelper,Points:gmzThreeCore.Points,PointsMaterial:gmzThreeCore.PointsMaterial,PolarGridHelper:gmzThreeCore.PolarGridHelper,PolyhedronGeometry:gmzThreeCore.PolyhedronGeometry,PositionalAudio:gmzThreeCore.PositionalAudio,PropertyBinding:gmzThreeCore.PropertyBinding,PropertyMixer:gmzThreeCore.PropertyMixer,QuadraticBezierCurve:gmzThreeCore.QuadraticBezierCurve,QuadraticBezierCurve3:gmzThreeCore.QuadraticBezierCurve3,Quaternion:gmzThreeCore.Quaternion,QuaternionKeyframeTrack:gmzThreeCore.QuaternionKeyframeTrack,QuaternionLinearInterpolant:gmzThreeCore.QuaternionLinearInterpolant,RGBDepthPacking:gmzThreeCore.RGBDepthPacking,RGBIntegerFormat:gmzThreeCore.RGBIntegerFormat,RGDepthPacking:gmzThreeCore.RGDepthPacking,RawShaderMaterial:gmzThreeCore.RawShaderMaterial,Ray:gmzThreeCore.Ray,Raycaster:gmzThreeCore.Raycaster,RectAreaLight:gmzThreeCore.RectAreaLight,RenderTarget:gmzThreeCore.RenderTarget,RenderTarget3D:gmzThreeCore.RenderTarget3D,ReplaceStencilOp:gmzThreeCore.ReplaceStencilOp,RingGeometry:gmzThreeCore.RingGeometry,Scene:gmzThreeCore.Scene,ShadowMaterial:gmzThreeCore.ShadowMaterial,Shape:gmzThreeCore.Shape,ShapeGeometry:gmzThreeCore.ShapeGeometry,ShapePath:gmzThreeCore.ShapePath,ShapeUtils:gmzThreeCore.ShapeUtils,Skeleton:gmzThreeCore.Skeleton,SkeletonHelper:gmzThreeCore.SkeletonHelper,SkinnedMesh:gmzThreeCore.SkinnedMesh,Source:gmzThreeCore.Source,Sphere:gmzThreeCore.Sphere,SphereGeometry:gmzThreeCore.SphereGeometry,Spherical:gmzThreeCore.Spherical,SphericalHarmonics3:gmzThreeCore.SphericalHarmonics3,SplineCurve:gmzThreeCore.SplineCurve,SpotLight:gmzThreeCore.SpotLight,SpotLightHelper:gmzThreeCore.SpotLightHelper,Sprite:gmzThreeCore.Sprite,SpriteMaterial:gmzThreeCore.SpriteMaterial,StaticCopyUsage:gmzThreeCore.StaticCopyUsage,StaticDrawUsage:gmzThreeCore.StaticDrawUsage,StaticReadUsage:gmzThreeCore.StaticReadUsage,StereoCamera:gmzThreeCore.StereoCamera,StreamCopyUsage:gmzThreeCore.StreamCopyUsage,StreamDrawUsage:gmzThreeCore.StreamDrawUsage,StreamReadUsage:gmzThreeCore.StreamReadUsage,StringKeyframeTrack:gmzThreeCore.StringKeyframeTrack,TOUCH:gmzThreeCore.TOUCH,TetrahedronGeometry:gmzThreeCore.TetrahedronGeometry,TextureLoader:gmzThreeCore.TextureLoader,TextureUtils:gmzThreeCore.TextureUtils,Timer:gmzThreeCore.Timer,TimestampQuery:gmzThreeCore.TimestampQuery,TorusGeometry:gmzThreeCore.TorusGeometry,TorusKnotGeometry:gmzThreeCore.TorusKnotGeometry,Triangle:gmzThreeCore.Triangle,TriangleFanDrawMode:gmzThreeCore.TriangleFanDrawMode,TriangleStripDrawMode:gmzThreeCore.TriangleStripDrawMode,TrianglesDrawMode:gmzThreeCore.TrianglesDrawMode,TubeGeometry:gmzThreeCore.TubeGeometry,UVMapping:gmzThreeCore.UVMapping,Uint8BufferAttribute:gmzThreeCore.Uint8BufferAttribute,Uint8ClampedBufferAttribute:gmzThreeCore.Uint8ClampedBufferAttribute,Uniform:gmzThreeCore.Uniform,UniformsGroup:gmzThreeCore.UniformsGroup,VectorKeyframeTrack:gmzThreeCore.VectorKeyframeTrack,VideoFrameTexture:gmzThreeCore.VideoFrameTexture,VideoTexture:gmzThreeCore.VideoTexture,WebGL3DRenderTarget:gmzThreeCore.WebGL3DRenderTarget,WebGLArrayRenderTarget:gmzThreeCore.WebGLArrayRenderTarget,WebGPUCoordinateSystem:gmzThreeCore.WebGPUCoordinateSystem,WireframeGeometry:gmzThreeCore.WireframeGeometry,WrapAroundEnding:gmzThreeCore.WrapAroundEnding,ZeroCurvatureEnding:gmzThreeCore.ZeroCurvatureEnding,ZeroSlopeEnding:gmzThreeCore.ZeroSlopeEnding,ZeroStencilOp:gmzThreeCore.ZeroStencilOp});function nh(){let o=null,f=!1,h=null,x=null;function A(b,N){h(b,N),x=o.requestAnimationFrame(A)}return{start:function(){f!==!0&&h!==null&&(x=o.requestAnimationFrame(A),f=!0)},stop:function(){o.cancelAnimationFrame(x),f=!1},setAnimationLoop:function(b){h=b},setContext:function(b){o=b}}}function ou(o){const f=new WeakMap;function h(R,j){const Y=R.array,ie=R.usage,H=Y.byteLength,X=o.createBuffer();o.bindBuffer(j,X),o.bufferData(j,Y,ie),R.onUploadCallback();let $;if(Y instanceof Float32Array)$=o.FLOAT;else if(typeof Float16Array<"u"&&Y instanceof Float16Array)$=o.HALF_FLOAT;else if(Y instanceof Uint16Array)R.isFloat16BufferAttribute?$=o.HALF_FLOAT:$=o.UNSIGNED_SHORT;else if(Y instanceof Int16Array)$=o.SHORT;else if(Y instanceof Uint32Array)$=o.UNSIGNED_INT;else if(Y instanceof Int32Array)$=o.INT;else if(Y instanceof Int8Array)$=o.BYTE;else if(Y instanceof Uint8Array)$=o.UNSIGNED_BYTE;else if(Y instanceof Uint8ClampedArray)$=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+Y);return{buffer:X,type:$,bytesPerElement:Y.BYTES_PER_ELEMENT,version:R.version,size:H}}function x(R,j,Y){const ie=j.array,H=j.updateRanges;if(o.bindBuffer(Y,R),H.length===0)o.bufferSubData(Y,0,ie);else{H.sort(($,ge)=>$.start-ge.start);let X=0;for(let $=1;$<H.length;$++){const ge=H[X],ae=H[$];ae.start<=ge.start+ge.count+1?ge.count=Math.max(ge.count,ae.start+ae.count-ge.start):(++X,H[X]=ae)}H.length=X+1;for(let $=0,ge=H.length;$<ge;$++){const ae=H[$];o.bufferSubData(Y,ae.start*ie.BYTES_PER_ELEMENT,ie,ae.start,ae.count)}j.clearUpdateRanges()}j.onUploadCallback()}function A(R){return R.isInterleavedBufferAttribute&&(R=R.data),f.get(R)}function b(R){R.isInterleavedBufferAttribute&&(R=R.data);const j=f.get(R);j&&(o.deleteBuffer(j.buffer),f.delete(R))}function N(R,j){if(R.isInterleavedBufferAttribute&&(R=R.data),R.isGLBufferAttribute){const ie=f.get(R);(!ie||ie.version<R.version)&&f.set(R,{buffer:R.buffer,type:R.type,bytesPerElement:R.elementSize,version:R.version});return}const Y=f.get(R);if(Y===void 0)f.set(R,h(R,j));else if(Y.version<R.version){if(Y.size!==R.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");x(Y.buffer,R,j),Y.version=R.version}}return{get:A,remove:b,update:N}}var lu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,du=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,br=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Pa=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,mu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cs=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ti=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ih=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ta=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,La=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,nr=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,At=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dc=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_u=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Mo=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,vu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Mu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Su=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,bu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Au=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Eu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ru=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Iu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Pu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Lu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Li=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vt=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Du=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pe=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ki=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,U=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,fc=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Tr=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pc=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,sh=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Uu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Da=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,So=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ah=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,mc=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Nu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,oh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Vi=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hs=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ua=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fa=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ch=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ou=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ps=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gc=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_c=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jn=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,oi=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xc=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ul=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Gu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,yc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ku=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ai=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,us=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ar=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Na=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ba=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Oa=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ls=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ds=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,na=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bo=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fl=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ia=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Vu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,To=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mc=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,mi=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ds=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Sc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ml=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Us=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,za=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ot=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ga=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Er=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zt={alphahash_fragment:lu,alphahash_pars_fragment:cu,alphamap_fragment:hu,alphamap_pars_fragment:uu,alphatest_fragment:du,alphatest_pars_fragment:fu,aomap_fragment:br,aomap_pars_fragment:Pa,batching_pars_vertex:pu,batching_vertex:mu,begin_vertex:gu,beginnormal_vertex:cs,bsdfs:Ti,iridescence_fragment:ih,bumpmap_pars_fragment:ta,clipping_planes_fragment:La,clipping_planes_pars_fragment:nr,clipping_planes_pars_vertex:At,clipping_planes_vertex:dc,color_fragment:_u,color_pars_fragment:xu,color_pars_vertex:Mo,color_vertex:yu,common:vu,cube_uv_reflection_fragment:Mu,defaultnormal_vertex:Su,displacementmap_pars_vertex:bu,displacementmap_vertex:Tu,emissivemap_fragment:Au,emissivemap_pars_fragment:Eu,colorspace_fragment:wu,colorspace_pars_fragment:Cu,envmap_fragment:Ru,envmap_common_pars_fragment:Iu,envmap_pars_fragment:Pu,envmap_pars_vertex:Lu,envmap_physical_pars_fragment:sh,envmap_vertex:Li,fog_vertex:Vt,fog_pars_vertex:Du,fog_fragment:Pe,fog_pars_fragment:ki,gradientmap_pars_fragment:U,lightmap_pars_fragment:fc,lights_lambert_fragment:rh,lights_lambert_pars_fragment:Tr,lights_pars_begin:pc,lights_toon_fragment:Uu,lights_toon_pars_fragment:Da,lights_phong_fragment:So,lights_phong_pars_fragment:Fu,lights_physical_fragment:ah,lights_physical_pars_fragment:mc,lights_fragment_begin:Nu,lights_fragment_maps:oh,lights_fragment_end:lh,logdepthbuf_fragment:Bu,logdepthbuf_pars_fragment:Vi,logdepthbuf_pars_vertex:hs,logdepthbuf_vertex:Ua,map_fragment:Fa,map_pars_fragment:ch,map_particle_fragment:Ou,map_particle_pars_fragment:Ps,metalnessmap_fragment:gc,metalnessmap_pars_fragment:zu,morphinstance_vertex:_c,morphcolor_vertex:Jn,morphnormal_vertex:oi,morphtarget_pars_vertex:xc,morphtarget_vertex:ul,normal_fragment_begin:hh,normal_fragment_maps:Gu,normal_pars_fragment:yc,normal_pars_vertex:ku,normal_vertex:Ai,normalmap_pars_fragment:us,clearcoat_normal_fragment_begin:Ar,clearcoat_normal_fragment_maps:dl,clearcoat_pars_fragment:Na,iridescence_pars_fragment:Ba,opaque_fragment:Oa,packing:Ls,premultiplied_alpha_fragment:Ds,project_vertex:na,dithering_fragment:bo,dithering_pars_fragment:fl,roughnessmap_fragment:pl,roughnessmap_pars_fragment:ia,shadowmap_pars_fragment:vc,shadowmap_pars_vertex:Vu,shadowmap_vertex:To,shadowmask_pars_fragment:Mc,skinbase_vertex:mi,skinning_pars_vertex:ds,skinning_vertex:Sc,skinnormal_vertex:ml,specularmap_fragment:Us,specularmap_pars_fragment:bc,tonemapping_fragment:gl,tonemapping_pars_fragment:Tc,transmission_fragment:za,transmission_pars_fragment:Ot,uv_pars_fragment:Ga,uv_pars_vertex:Er,uv_vertex:Hu,worldpos_vertex:Wu,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},ke={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},envMapRotation:{value:new kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new jt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new jt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},Ln={basic:{uniforms:Oe([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:Oe([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new Dt(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:Oe([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:Oe([ke.common,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.roughnessmap,ke.metalnessmap,ke.fog,ke.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:Oe([ke.common,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.gradientmap,ke.fog,ke.lights,{emissive:{value:new Dt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:Oe([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:Oe([ke.points,ke.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:Oe([ke.common,ke.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:Oe([ke.common,ke.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:Oe([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:Oe([ke.sprite,ke.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kt}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:Oe([ke.common,ke.displacementmap,{referencePosition:{value:new Xt},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:Oe([ke.lights,ke.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};Ln.physical={uniforms:Oe([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new jt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new jt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new jt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const Ro={r:0,b:0,g:0},Hi=new gr,xl=new Bi;function wc(o,f,h,x,A,b,N){const R=new Dt(0);let j=b===!0?0:1,Y,ie,H=null,X=0,$=null;function ge(J){let k=J.isScene===!0?J.background:null;return k&&k.isTexture&&(k=(J.backgroundBlurriness>0?h:f).get(k)),k}function ae(J){let k=!1;const he=ge(J);he===null?v(R,j):he&&he.isColor&&(v(he,1),k=!0);const ee=o.xr.getEnvironmentBlendMode();ee==="additive"?x.buffers.color.setClear(0,0,0,1,N):ee==="alpha-blend"&&x.buffers.color.setClear(0,0,0,0,N),(o.autoClear||k)&&(x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function C(J,k){const he=ge(k);he&&(he.isCubeTexture||he.mapping===ri)?(ie===void 0&&(ie=new Tn(new en(1,1,1),new tn({name:"BackgroundCubeMaterial",uniforms:_s(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),ie.geometry.deleteAttribute("normal"),ie.geometry.deleteAttribute("uv"),ie.onBeforeRender=function(ee,te,ve){this.matrixWorld.copyPosition(ve.matrixWorld)},Object.defineProperty(ie.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),A.update(ie)),Hi.copy(k.backgroundRotation),Hi.x*=-1,Hi.y*=-1,Hi.z*=-1,he.isCubeTexture&&he.isRenderTargetTexture===!1&&(Hi.y*=-1,Hi.z*=-1),ie.material.uniforms.envMap.value=he,ie.material.uniforms.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1,ie.material.uniforms.backgroundBlurriness.value=k.backgroundBlurriness,ie.material.uniforms.backgroundIntensity.value=k.backgroundIntensity,ie.material.uniforms.backgroundRotation.value.setFromMatrix4(xl.makeRotationFromEuler(Hi)),ie.material.toneMapped=Xe.getTransfer(he.colorSpace)!==Ut,(H!==he||X!==he.version||$!==o.toneMapping)&&(ie.material.needsUpdate=!0,H=he,X=he.version,$=o.toneMapping),ie.layers.enableAll(),J.unshift(ie,ie.geometry,ie.material,0,0,null)):he&&he.isTexture&&(Y===void 0&&(Y=new Tn(new si(2,2),new tn({name:"BackgroundMaterial",uniforms:_s(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:$i,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),Y.geometry.deleteAttribute("normal"),Object.defineProperty(Y.material,"map",{get:function(){return this.uniforms.t2D.value}}),A.update(Y)),Y.material.uniforms.t2D.value=he,Y.material.uniforms.backgroundIntensity.value=k.backgroundIntensity,Y.material.toneMapped=Xe.getTransfer(he.colorSpace)!==Ut,he.matrixAutoUpdate===!0&&he.updateMatrix(),Y.material.uniforms.uvTransform.value.copy(he.matrix),(H!==he||X!==he.version||$!==o.toneMapping)&&(Y.material.needsUpdate=!0,H=he,X=he.version,$=o.toneMapping),Y.layers.enableAll(),J.unshift(Y,Y.geometry,Y.material,0,0,null))}function v(J,k){J.getRGB(Ro,Nn(o)),x.buffers.color.setClear(Ro.r,Ro.g,Ro.b,k,N)}function re(){ie!==void 0&&(ie.geometry.dispose(),ie.material.dispose(),ie=void 0),Y!==void 0&&(Y.geometry.dispose(),Y.material.dispose(),Y=void 0)}return{getClearColor:function(){return R},setClearColor:function(J,k=1){R.set(J),j=k,v(R,j)},getClearAlpha:function(){return j},setClearAlpha:function(J){j=J,v(R,j)},render:ae,addToRenderList:C,dispose:re}}function Pt(o,f){const h=o.getParameter(o.MAX_VERTEX_ATTRIBS),x={},A=X(null);let b=A,N=!1;function R(P,Z,fe,Ae,we){let Se=!1;const be=H(Ae,fe,Z);b!==be&&(b=be,Y(b.object)),Se=$(P,Ae,fe,we),Se&&ge(P,Ae,fe,we),we!==null&&f.update(we,o.ELEMENT_ARRAY_BUFFER),(Se||N)&&(N=!1,k(P,Z,fe,Ae),we!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,f.get(we).buffer))}function j(){return o.createVertexArray()}function Y(P){return o.bindVertexArray(P)}function ie(P){return o.deleteVertexArray(P)}function H(P,Z,fe){const Ae=fe.wireframe===!0;let we=x[P.id];we===void 0&&(we={},x[P.id]=we);let Se=we[Z.id];Se===void 0&&(Se={},we[Z.id]=Se);let be=Se[Ae];return be===void 0&&(be=X(j()),Se[Ae]=be),be}function X(P){const Z=[],fe=[],Ae=[];for(let we=0;we<h;we++)Z[we]=0,fe[we]=0,Ae[we]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Z,enabledAttributes:fe,attributeDivisors:Ae,object:P,attributes:{},index:null}}function $(P,Z,fe,Ae){const we=b.attributes,Se=Z.attributes;let be=0;const De=fe.getAttributes();for(const _e in De)if(De[_e].location>=0){const yt=we[_e];let Ht=Se[_e];if(Ht===void 0&&(_e==="instanceMatrix"&&P.instanceMatrix&&(Ht=P.instanceMatrix),_e==="instanceColor"&&P.instanceColor&&(Ht=P.instanceColor)),yt===void 0||yt.attribute!==Ht||Ht&&yt.data!==Ht.data)return!0;be++}return b.attributesNum!==be||b.index!==Ae}function ge(P,Z,fe,Ae){const we={},Se=Z.attributes;let be=0;const De=fe.getAttributes();for(const _e in De)if(De[_e].location>=0){let yt=Se[_e];yt===void 0&&(_e==="instanceMatrix"&&P.instanceMatrix&&(yt=P.instanceMatrix),_e==="instanceColor"&&P.instanceColor&&(yt=P.instanceColor));const Ht={};Ht.attribute=yt,yt&&yt.data&&(Ht.data=yt.data),we[_e]=Ht,be++}b.attributes=we,b.attributesNum=be,b.index=Ae}function ae(){const P=b.newAttributes;for(let Z=0,fe=P.length;Z<fe;Z++)P[Z]=0}function C(P){v(P,0)}function v(P,Z){const fe=b.newAttributes,Ae=b.enabledAttributes,we=b.attributeDivisors;fe[P]=1,Ae[P]===0&&(o.enableVertexAttribArray(P),Ae[P]=1),we[P]!==Z&&(o.vertexAttribDivisor(P,Z),we[P]=Z)}function re(){const P=b.newAttributes,Z=b.enabledAttributes;for(let fe=0,Ae=Z.length;fe<Ae;fe++)Z[fe]!==P[fe]&&(o.disableVertexAttribArray(fe),Z[fe]=0)}function J(P,Z,fe,Ae,we,Se,be){be===!0?o.vertexAttribIPointer(P,Z,fe,we,Se):o.vertexAttribPointer(P,Z,fe,Ae,we,Se)}function k(P,Z,fe,Ae){ae();const we=Ae.attributes,Se=fe.getAttributes(),be=Z.defaultAttributeValues;for(const De in Se){const _e=Se[De];if(_e.location>=0){let ot=we[De];if(ot===void 0&&(De==="instanceMatrix"&&P.instanceMatrix&&(ot=P.instanceMatrix),De==="instanceColor"&&P.instanceColor&&(ot=P.instanceColor)),ot!==void 0){const yt=ot.normalized,Ht=ot.itemSize,un=f.get(ot);if(un===void 0)continue;const Xn=un.buffer,qn=un.type,bn=un.bytesPerElement,Me=qn===o.INT||qn===o.UNSIGNED_INT||ot.gpuType===Re;if(ot.isInterleavedBufferAttribute){const Ee=ot.data,rt=Ee.stride,Lt=ot.offset;if(Ee.isInstancedInterleavedBuffer){for(let pt=0;pt<_e.locationSize;pt++)v(_e.location+pt,Ee.meshPerAttribute);P.isInstancedMesh!==!0&&Ae._maxInstanceCount===void 0&&(Ae._maxInstanceCount=Ee.meshPerAttribute*Ee.count)}else for(let pt=0;pt<_e.locationSize;pt++)C(_e.location+pt);o.bindBuffer(o.ARRAY_BUFFER,Xn);for(let pt=0;pt<_e.locationSize;pt++)J(_e.location+pt,Ht/_e.locationSize,qn,yt,rt*bn,(Lt+Ht/_e.locationSize*pt)*bn,Me)}else{if(ot.isInstancedBufferAttribute){for(let Ee=0;Ee<_e.locationSize;Ee++)v(_e.location+Ee,ot.meshPerAttribute);P.isInstancedMesh!==!0&&Ae._maxInstanceCount===void 0&&(Ae._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Ee=0;Ee<_e.locationSize;Ee++)C(_e.location+Ee);o.bindBuffer(o.ARRAY_BUFFER,Xn);for(let Ee=0;Ee<_e.locationSize;Ee++)J(_e.location+Ee,Ht/_e.locationSize,qn,yt,Ht*bn,Ht/_e.locationSize*Ee*bn,Me)}}else if(be!==void 0){const yt=be[De];if(yt!==void 0)switch(yt.length){case 2:o.vertexAttrib2fv(_e.location,yt);break;case 3:o.vertexAttrib3fv(_e.location,yt);break;case 4:o.vertexAttrib4fv(_e.location,yt);break;default:o.vertexAttrib1fv(_e.location,yt)}}}}re()}function he(){ve();for(const P in x){const Z=x[P];for(const fe in Z){const Ae=Z[fe];for(const we in Ae)ie(Ae[we].object),delete Ae[we];delete Z[fe]}delete x[P]}}function ee(P){if(x[P.id]===void 0)return;const Z=x[P.id];for(const fe in Z){const Ae=Z[fe];for(const we in Ae)ie(Ae[we].object),delete Ae[we];delete Z[fe]}delete x[P.id]}function te(P){for(const Z in x){const fe=x[Z];if(fe[P.id]===void 0)continue;const Ae=fe[P.id];for(const we in Ae)ie(Ae[we].object),delete Ae[we];delete fe[P.id]}}function ve(){L(),N=!0,b!==A&&(b=A,Y(b.object))}function L(){A.geometry=null,A.program=null,A.wireframe=!1}return{setup:R,reset:ve,resetDefaultState:L,dispose:he,releaseStatesOfGeometry:ee,releaseStatesOfProgram:te,initAttributes:ae,enableAttribute:C,disableUnusedAttributes:re}}function Ei(o,f,h){let x;function A(Y){x=Y}function b(Y,ie){o.drawArrays(x,Y,ie),h.update(ie,x,1)}function N(Y,ie,H){H!==0&&(o.drawArraysInstanced(x,Y,ie,H),h.update(ie,x,H))}function R(Y,ie,H){if(H===0)return;f.get("WEBGL_multi_draw").multiDrawArraysWEBGL(x,Y,0,ie,0,H);let $=0;for(let ge=0;ge<H;ge++)$+=ie[ge];h.update($,x,1)}function j(Y,ie,H,X){if(H===0)return;const $=f.get("WEBGL_multi_draw");if($===null)for(let ge=0;ge<Y.length;ge++)N(Y[ge],ie[ge],X[ge]);else{$.multiDrawArraysInstancedWEBGL(x,Y,0,ie,0,X,0,H);let ge=0;for(let ae=0;ae<H;ae++)ge+=ie[ae]*X[ae];h.update(ge,x,1)}}this.setMode=A,this.render=b,this.renderInstances=N,this.renderMultiDraw=R,this.renderMultiDrawInstances=j}function ju(o,f,h,x){let A;function b(){if(A!==void 0)return A;if(f.has("EXT_texture_filter_anisotropic")===!0){const te=f.get("EXT_texture_filter_anisotropic");A=o.getParameter(te.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else A=0;return A}function N(te){return!(te!==He&&x.convert(te)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function R(te){const ve=te===Ve&&(f.has("EXT_color_buffer_half_float")||f.has("EXT_color_buffer_float"));return!(te!==Ke&&x.convert(te)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&te!==Ce&&!ve)}function j(te){if(te==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";te="mediump"}return te==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let Y=h.precision!==void 0?h.precision:"highp";const ie=j(Y);ie!==Y&&(console.warn("THREE.WebGLRenderer:",Y,"not supported, using",ie,"instead."),Y=ie);const H=h.logarithmicDepthBuffer===!0,X=h.reversedDepthBuffer===!0&&f.has("EXT_clip_control"),$=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),ge=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),ae=o.getParameter(o.MAX_TEXTURE_SIZE),C=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),v=o.getParameter(o.MAX_VERTEX_ATTRIBS),re=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),J=o.getParameter(o.MAX_VARYING_VECTORS),k=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),he=ge>0,ee=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:b,getMaxPrecision:j,textureFormatReadable:N,textureTypeReadable:R,precision:Y,logarithmicDepthBuffer:H,reversedDepthBuffer:X,maxTextures:$,maxVertexTextures:ge,maxTextureSize:ae,maxCubemapSize:C,maxAttributes:v,maxVertexUniforms:re,maxVaryings:J,maxFragmentUniforms:k,vertexTextures:he,maxSamples:ee}}function wi(o){const f=this;let h=null,x=0,A=!1,b=!1;const N=new bt,R=new kt,j={value:null,needsUpdate:!1};this.uniform=j,this.numPlanes=0,this.numIntersection=0,this.init=function(H,X){const $=H.length!==0||X||x!==0||A;return A=X,x=H.length,$},this.beginShadows=function(){b=!0,ie(null)},this.endShadows=function(){b=!1},this.setGlobalState=function(H,X){h=ie(H,X,0)},this.setState=function(H,X,$){const ge=H.clippingPlanes,ae=H.clipIntersection,C=H.clipShadows,v=o.get(H);if(!A||ge===null||ge.length===0||b&&!C)b?ie(null):Y();else{const re=b?0:x,J=re*4;let k=v.clippingState||null;j.value=k,k=ie(ge,X,J,$);for(let he=0;he!==J;++he)k[he]=h[he];v.clippingState=k,this.numIntersection=ae?this.numPlanes:0,this.numPlanes+=re}};function Y(){j.value!==h&&(j.value=h,j.needsUpdate=x>0),f.numPlanes=x,f.numIntersection=0}function ie(H,X,$,ge){const ae=H!==null?H.length:0;let C=null;if(ae!==0){if(C=j.value,ge!==!0||C===null){const v=$+ae*4,re=X.matrixWorldInverse;R.getNormalMatrix(re),(C===null||C.length<v)&&(C=new Float32Array(v));for(let J=0,k=$;J!==ae;++J,k+=4)N.copy(H[J]).applyMatrix4(re,R),N.normal.toArray(C,k),C[k+3]=N.constant}j.value=C,j.needsUpdate=!0}return f.numPlanes=ae,f.numIntersection=0,C}}function sa(o){let f=new WeakMap;function h(N,R){return R===Tt?N.mapping=Zt:R===Et&&(N.mapping=Kt),N}function x(N){if(N&&N.isTexture){const R=N.mapping;if(R===Tt||R===Et)if(f.has(N)){const j=f.get(N).texture;return h(j,N.mapping)}else{const j=N.image;if(j&&j.height>0){const Y=new rn(j.height);return Y.fromEquirectangularTexture(o,N),f.set(N,Y),N.addEventListener("dispose",A),h(Y.texture,N.mapping)}else return null}}return N}function A(N){const R=N.target;R.removeEventListener("dispose",A);const j=f.get(R);j!==void 0&&(f.delete(R),j.dispose())}function b(){f=new WeakMap}return{get:x,dispose:b}}const Wi=4,xh=[.125,.215,.35,.446,.526,.582],jn=20,aa=new pn,yh=new Dt;let Hn=null,ka=0,Cc=0,An=!1;const oa=(1+Math.sqrt(5))/2,Va=1/oa,vh=[new Xt(-oa,Va,0),new Xt(oa,Va,0),new Xt(-Va,0,oa),new Xt(Va,0,oa),new Xt(0,oa,-Va),new Xt(0,oa,Va),new Xt(-1,1,-1),new Xt(1,1,-1),new Xt(-1,1,1),new Xt(1,1,1)],ed=new Xt;class yl{constructor(f){this._renderer=f,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(f,h=0,x=.1,A=100,b={}){const{size:N=256,position:R=ed}=b;Hn=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),An=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(N);const j=this._allocateTargets();return j.depthBuffer=!0,this._sceneToCubeUV(f,x,A,j,R),h>0&&this._blur(j,0,0,h),this._applyPMREM(j),this._cleanup(j),j}fromEquirectangular(f,h=null){return this._fromTexture(f,h)}fromCubemap(f,h=null){return this._fromTexture(f,h)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ir(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(f){this._lodMax=Math.floor(Math.log2(f)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let f=0;f<this._lodPlanes.length;f++)this._lodPlanes[f].dispose()}_cleanup(f){this._renderer.setRenderTarget(Hn,ka,Cc),this._renderer.xr.enabled=An,f.scissorTest=!1,vl(f,0,0,f.width,f.height)}_fromTexture(f,h){f.mapping===Zt||f.mapping===Kt?this._setSize(f.image.length===0?16:f.image[0].width||f.image[0].image.width):this._setSize(f.image.width/4),Hn=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),An=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const x=h||this._allocateTargets();return this._textureToCubeUV(f,x),this._applyPMREM(x),this._cleanup(x),x}_allocateTargets(){const f=3*Math.max(this._cubeSize,112),h=4*this._cubeSize,x={magFilter:fi,minFilter:fi,generateMipmaps:!1,type:Ve,format:He,colorSpace:hn,depthBuffer:!1},A=Rc(f,h,x);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==f||this._pingPongRenderTarget.height!==h){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rc(f,h,x);const{_lodMax:b}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=td(b)),this._blurMaterial=et(b,f,h)}return A}_compileMaterial(f){const h=new Tn(this._lodPlanes[0],f);this._renderer.compile(h,aa)}_sceneToCubeUV(f,h,x,A,b){const j=new Bn(90,1,h,x),Y=[1,-1,1,1,1,1],ie=[1,1,1,-1,-1,-1],H=this._renderer,X=H.autoClear,$=H.toneMapping;H.getClearColor(yh),H.toneMapping=mn,H.autoClear=!1,H.state.buffers.depth.getReversed()&&(H.setRenderTarget(A),H.clearDepth(),H.setRenderTarget(null));const ae=new mt({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1}),C=new Tn(new en,ae);let v=!1;const re=f.background;re?re.isColor&&(ae.color.copy(re),f.background=null,v=!0):(ae.color.copy(yh),v=!0);for(let J=0;J<6;J++){const k=J%3;k===0?(j.up.set(0,Y[J],0),j.position.set(b.x,b.y,b.z),j.lookAt(b.x+ie[J],b.y,b.z)):k===1?(j.up.set(0,0,Y[J]),j.position.set(b.x,b.y,b.z),j.lookAt(b.x,b.y+ie[J],b.z)):(j.up.set(0,Y[J],0),j.position.set(b.x,b.y,b.z),j.lookAt(b.x,b.y,b.z+ie[J]));const he=this._cubeSize;vl(A,k*he,J>2?he:0,he,he),H.setRenderTarget(A),v&&H.render(C,j),H.render(f,j)}C.geometry.dispose(),C.material.dispose(),H.toneMapping=$,H.autoClear=X,f.background=re}_textureToCubeUV(f,h){const x=this._renderer,A=f.mapping===Zt||f.mapping===Kt;A?(this._cubemapMaterial===null&&(this._cubemapMaterial=ir()),this._cubemapMaterial.uniforms.flipEnvMap.value=f.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mh());const b=A?this._cubemapMaterial:this._equirectMaterial,N=new Tn(this._lodPlanes[0],b),R=b.uniforms;R.envMap.value=f;const j=this._cubeSize;vl(h,0,0,3*j,2*j),x.setRenderTarget(h),x.render(N,aa)}_applyPMREM(f){const h=this._renderer,x=h.autoClear;h.autoClear=!1;const A=this._lodPlanes.length;for(let b=1;b<A;b++){const N=Math.sqrt(this._sigmas[b]*this._sigmas[b]-this._sigmas[b-1]*this._sigmas[b-1]),R=vh[(A-b-1)%vh.length];this._blur(f,b-1,b,N,R)}h.autoClear=x}_blur(f,h,x,A,b){const N=this._pingPongRenderTarget;this._halfBlur(f,N,h,x,A,"latitudinal",b),this._halfBlur(N,f,x,x,A,"longitudinal",b)}_halfBlur(f,h,x,A,b,N,R){const j=this._renderer,Y=this._blurMaterial;N!=="latitudinal"&&N!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const ie=3,H=new Tn(this._lodPlanes[A],Y),X=Y.uniforms,$=this._sizeLods[x]-1,ge=isFinite(b)?Math.PI/(2*$):2*Math.PI/(2*jn-1),ae=b/ge,C=isFinite(b)?1+Math.floor(ie*ae):jn;C>jn&&console.warn(`sigmaRadians, ${b}, is too large and will clip, as it requested ${C} samples when the maximum is set to ${jn}`);const v=[];let re=0;for(let te=0;te<jn;++te){const ve=te/ae,L=Math.exp(-ve*ve/2);v.push(L),te===0?re+=L:te<C&&(re+=2*L)}for(let te=0;te<v.length;te++)v[te]=v[te]/re;X.envMap.value=f.texture,X.samples.value=C,X.weights.value=v,X.latitudinal.value=N==="latitudinal",R&&(X.poleAxis.value=R);const{_lodMax:J}=this;X.dTheta.value=ge,X.mipInt.value=J-x;const k=this._sizeLods[A],he=3*k*(A>J-Wi?A-J+Wi:0),ee=4*(this._cubeSize-k);vl(h,he,ee,3*k,2*k),j.setRenderTarget(h),j.render(H,aa)}}function td(o){const f=[],h=[],x=[];let A=o;const b=o-Wi+1+xh.length;for(let N=0;N<b;N++){const R=Math.pow(2,A);h.push(R);let j=1/R;N>o-Wi?j=xh[N-o+Wi-1]:N===0&&(j=0),x.push(j);const Y=1/(R-2),ie=-Y,H=1+Y,X=[ie,ie,H,ie,H,H,ie,ie,H,H,ie,H],$=6,ge=6,ae=3,C=2,v=1,re=new Float32Array(ae*ge*$),J=new Float32Array(C*ge*$),k=new Float32Array(v*ge*$);for(let ee=0;ee<$;ee++){const te=ee%3*2/3-1,ve=ee>2?0:-1,L=[te,ve,0,te+2/3,ve,0,te+2/3,ve+1,0,te,ve,0,te+2/3,ve+1,0,te,ve+1,0];re.set(L,ae*ge*ee),J.set(X,C*ge*ee);const P=[ee,ee,ee,ee,ee,ee];k.set(P,v*ge*ee)}const he=new ai;he.setAttribute("position",new Qn(re,ae)),he.setAttribute("uv",new Qn(J,C)),he.setAttribute("faceIndex",new Qn(k,v)),f.push(he),A>Wi&&A--}return{lodPlanes:f,sizeLods:h,sigmas:x}}function Rc(o,f,h){const x=new yn(o,f,h);return x.texture.mapping=ri,x.texture.name="PMREM.cubeUv",x.scissorTest=!0,x}function vl(o,f,h,x,A){o.viewport.set(f,h,x,A),o.scissor.set(f,h,x,A)}function et(o,f,h){const x=new Float32Array(jn),A=new Xt(0,1,0);return new tn({name:"SphericalGaussianBlur",defines:{n:jn,CUBEUV_TEXEL_WIDTH:1/f,CUBEUV_TEXEL_HEIGHT:1/h,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:x},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:A}},vertexShader:Io(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Mh(){return new tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Io(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function ir(){return new tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Io(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Io(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ha(o){let f=new WeakMap,h=null;function x(R){if(R&&R.isTexture){const j=R.mapping,Y=j===Tt||j===Et,ie=j===Zt||j===Kt;if(Y||ie){let H=f.get(R);const X=H!==void 0?H.texture.pmremVersion:0;if(R.isRenderTargetTexture&&R.pmremVersion!==X)return h===null&&(h=new yl(o)),H=Y?h.fromEquirectangular(R,H):h.fromCubemap(R,H),H.texture.pmremVersion=R.pmremVersion,f.set(R,H),H.texture;if(H!==void 0)return H.texture;{const $=R.image;return Y&&$&&$.height>0||ie&&$&&A($)?(h===null&&(h=new yl(o)),H=Y?h.fromEquirectangular(R):h.fromCubemap(R),H.texture.pmremVersion=R.pmremVersion,f.set(R,H),R.addEventListener("dispose",b),H.texture):null}}}return R}function A(R){let j=0;const Y=6;for(let ie=0;ie<Y;ie++)R[ie]!==void 0&&j++;return j===Y}function b(R){const j=R.target;j.removeEventListener("dispose",b);const Y=f.get(j);Y!==void 0&&(f.delete(j),Y.dispose())}function N(){f=new WeakMap,h!==null&&(h.dispose(),h=null)}return{get:x,dispose:N}}function rr(o){const f={};function h(x){if(f[x]!==void 0)return f[x];let A;switch(x){case"WEBGL_depth_texture":A=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":A=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":A=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":A=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:A=o.getExtension(x)}return f[x]=A,A}return{has:function(x){return h(x)!==null},init:function(){h("EXT_color_buffer_float"),h("WEBGL_clip_cull_distance"),h("OES_texture_float_linear"),h("EXT_color_buffer_half_float"),h("WEBGL_multisampled_render_to_texture"),h("WEBGL_render_shared_exponent")},get:function(x){const A=h(x);return A===null&&ft("THREE.WebGLRenderer: "+x+" extension not supported."),A}}}function Po(o,f,h,x){const A={},b=new WeakMap;function N(H){const X=H.target;X.index!==null&&f.remove(X.index);for(const ge in X.attributes)f.remove(X.attributes[ge]);X.removeEventListener("dispose",N),delete A[X.id];const $=b.get(X);$&&(f.remove($),b.delete(X)),x.releaseStatesOfGeometry(X),X.isInstancedBufferGeometry===!0&&delete X._maxInstanceCount,h.memory.geometries--}function R(H,X){return A[X.id]===!0||(X.addEventListener("dispose",N),A[X.id]=!0,h.memory.geometries++),X}function j(H){const X=H.attributes;for(const $ in X)f.update(X[$],o.ARRAY_BUFFER)}function Y(H){const X=[],$=H.index,ge=H.attributes.position;let ae=0;if($!==null){const re=$.array;ae=$.version;for(let J=0,k=re.length;J<k;J+=3){const he=re[J+0],ee=re[J+1],te=re[J+2];X.push(he,ee,ee,te,te,he)}}else if(ge!==void 0){const re=ge.array;ae=ge.version;for(let J=0,k=re.length/3-1;J<k;J+=3){const he=J+0,ee=J+1,te=J+2;X.push(he,ee,ee,te,te,he)}}else return;const C=new(yi(X)?sn:kn)(X,1);C.version=ae;const v=b.get(H);v&&f.remove(v),b.set(H,C)}function ie(H){const X=b.get(H);if(X){const $=H.index;$!==null&&X.version<$.version&&Y(H)}else Y(H);return b.get(H)}return{get:R,update:j,getWireframeAttribute:ie}}function ui(o,f,h){let x;function A(X){x=X}let b,N;function R(X){b=X.type,N=X.bytesPerElement}function j(X,$){o.drawElements(x,$,b,X*N),h.update($,x,1)}function Y(X,$,ge){ge!==0&&(o.drawElementsInstanced(x,$,b,X*N,ge),h.update($,x,ge))}function ie(X,$,ge){if(ge===0)return;f.get("WEBGL_multi_draw").multiDrawElementsWEBGL(x,$,0,b,X,0,ge);let C=0;for(let v=0;v<ge;v++)C+=$[v];h.update(C,x,1)}function H(X,$,ge,ae){if(ge===0)return;const C=f.get("WEBGL_multi_draw");if(C===null)for(let v=0;v<X.length;v++)Y(X[v]/N,$[v],ae[v]);else{C.multiDrawElementsInstancedWEBGL(x,$,0,b,X,0,ae,0,ge);let v=0;for(let re=0;re<ge;re++)v+=$[re]*ae[re];h.update(v,x,1)}}this.setMode=A,this.setIndex=R,this.render=j,this.renderInstances=Y,this.renderMultiDraw=ie,this.renderMultiDrawInstances=H}function qt(o){const f={geometries:0,textures:0},h={frame:0,calls:0,triangles:0,points:0,lines:0};function x(b,N,R){switch(h.calls++,N){case o.TRIANGLES:h.triangles+=R*(b/3);break;case o.LINES:h.lines+=R*(b/2);break;case o.LINE_STRIP:h.lines+=R*(b-1);break;case o.LINE_LOOP:h.lines+=R*b;break;case o.POINTS:h.points+=R*b;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",N);break}}function A(){h.calls=0,h.triangles=0,h.points=0,h.lines=0}return{memory:f,render:h,programs:null,autoReset:!0,reset:A,update:x}}function Sh(o,f,h){const x=new WeakMap,A=new Zn;function b(N,R,j){const Y=N.morphTargetInfluences,ie=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,H=ie!==void 0?ie.length:0;let X=x.get(R);if(X===void 0||X.count!==H){let P=function(){ve.dispose(),x.delete(R),R.removeEventListener("dispose",P)};var $=P;X!==void 0&&X.texture.dispose();const ge=R.morphAttributes.position!==void 0,ae=R.morphAttributes.normal!==void 0,C=R.morphAttributes.color!==void 0,v=R.morphAttributes.position||[],re=R.morphAttributes.normal||[],J=R.morphAttributes.color||[];let k=0;ge===!0&&(k=1),ae===!0&&(k=2),C===!0&&(k=3);let he=R.attributes.position.count*k,ee=1;he>f.maxTextureSize&&(ee=Math.ceil(he/f.maxTextureSize),he=f.maxTextureSize);const te=new Float32Array(he*ee*4*H),ve=new _r(te,he,ee,H);ve.type=Ce,ve.needsUpdate=!0;const L=k*4;for(let Z=0;Z<H;Z++){const fe=v[Z],Ae=re[Z],we=J[Z],Se=he*ee*4*Z;for(let be=0;be<fe.count;be++){const De=be*L;ge===!0&&(A.fromBufferAttribute(fe,be),te[Se+De+0]=A.x,te[Se+De+1]=A.y,te[Se+De+2]=A.z,te[Se+De+3]=0),ae===!0&&(A.fromBufferAttribute(Ae,be),te[Se+De+4]=A.x,te[Se+De+5]=A.y,te[Se+De+6]=A.z,te[Se+De+7]=0),C===!0&&(A.fromBufferAttribute(we,be),te[Se+De+8]=A.x,te[Se+De+9]=A.y,te[Se+De+10]=A.z,te[Se+De+11]=we.itemSize===4?A.w:1)}}X={count:H,texture:ve,size:new jt(he,ee)},x.set(R,X),R.addEventListener("dispose",P)}if(N.isInstancedMesh===!0&&N.morphTexture!==null)j.getUniforms().setValue(o,"morphTexture",N.morphTexture,h);else{let ge=0;for(let C=0;C<Y.length;C++)ge+=Y[C];const ae=R.morphTargetsRelative?1:1-ge;j.getUniforms().setValue(o,"morphTargetBaseInfluence",ae),j.getUniforms().setValue(o,"morphTargetInfluences",Y)}j.getUniforms().setValue(o,"morphTargetsTexture",X.texture,h),j.getUniforms().setValue(o,"morphTargetsTextureSize",X.size)}return{update:b}}function la(o,f,h,x){let A=new WeakMap;function b(j){const Y=x.render.frame,ie=j.geometry,H=f.get(j,ie);if(A.get(H)!==Y&&(f.update(H),A.set(H,Y)),j.isInstancedMesh&&(j.hasEventListener("dispose",R)===!1&&j.addEventListener("dispose",R),A.get(j)!==Y&&(h.update(j.instanceMatrix,o.ARRAY_BUFFER),j.instanceColor!==null&&h.update(j.instanceColor,o.ARRAY_BUFFER),A.set(j,Y))),j.isSkinnedMesh){const X=j.skeleton;A.get(X)!==Y&&(X.update(),A.set(X,Y))}return H}function N(){A=new WeakMap}function R(j){const Y=j.target;Y.removeEventListener("dispose",R),h.remove(Y.instanceMatrix),Y.instanceColor!==null&&h.remove(Y.instanceColor)}return{update:b,dispose:N}}const Lo=new sl,Ic=new $r(1,1),Do=new _r,Uo=new Zr,Fo=new rl,Ml=[],No=[],Pc=new Float32Array(16),Bo=new Float32Array(9),sr=new Float32Array(4);function Wa(o,f,h){const x=o[0];if(x<=0||x>0)return o;const A=f*h;let b=Ml[A];if(b===void 0&&(b=new Float32Array(A),Ml[A]=b),f!==0){x.toArray(b,0);for(let N=1,R=0;N!==f;++N)R+=h,o[N].toArray(b,R)}return b}function Wn(o,f){if(o.length!==f.length)return!1;for(let h=0,x=o.length;h<x;h++)if(o[h]!==f[h])return!1;return!0}function zn(o,f){for(let h=0,x=f.length;h<x;h++)o[h]=f[h]}function Os(o,f){let h=No[f];h===void 0&&(h=new Int32Array(f),No[f]=h);for(let x=0;x!==f;++x)h[x]=o.allocateTextureUnit();return h}function bh(o,f){const h=this.cache;h[0]!==f&&(o.uniform1f(this.addr,f),h[0]=f)}function nd(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y)&&(o.uniform2f(this.addr,f.x,f.y),h[0]=f.x,h[1]=f.y);else{if(Wn(h,f))return;o.uniform2fv(this.addr,f),zn(h,f)}}function id(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z)&&(o.uniform3f(this.addr,f.x,f.y,f.z),h[0]=f.x,h[1]=f.y,h[2]=f.z);else if(f.r!==void 0)(h[0]!==f.r||h[1]!==f.g||h[2]!==f.b)&&(o.uniform3f(this.addr,f.r,f.g,f.b),h[0]=f.r,h[1]=f.g,h[2]=f.b);else{if(Wn(h,f))return;o.uniform3fv(this.addr,f),zn(h,f)}}function rd(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z||h[3]!==f.w)&&(o.uniform4f(this.addr,f.x,f.y,f.z,f.w),h[0]=f.x,h[1]=f.y,h[2]=f.z,h[3]=f.w);else{if(Wn(h,f))return;o.uniform4fv(this.addr,f),zn(h,f)}}function sd(o,f){const h=this.cache,x=f.elements;if(x===void 0){if(Wn(h,f))return;o.uniformMatrix2fv(this.addr,!1,f),zn(h,f)}else{if(Wn(h,x))return;sr.set(x),o.uniformMatrix2fv(this.addr,!1,sr),zn(h,x)}}function ad(o,f){const h=this.cache,x=f.elements;if(x===void 0){if(Wn(h,f))return;o.uniformMatrix3fv(this.addr,!1,f),zn(h,f)}else{if(Wn(h,x))return;Bo.set(x),o.uniformMatrix3fv(this.addr,!1,Bo),zn(h,x)}}function Sl(o,f){const h=this.cache,x=f.elements;if(x===void 0){if(Wn(h,f))return;o.uniformMatrix4fv(this.addr,!1,f),zn(h,f)}else{if(Wn(h,x))return;Pc.set(x),o.uniformMatrix4fv(this.addr,!1,Pc),zn(h,x)}}function bl(o,f){const h=this.cache;h[0]!==f&&(o.uniform1i(this.addr,f),h[0]=f)}function zs(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y)&&(o.uniform2i(this.addr,f.x,f.y),h[0]=f.x,h[1]=f.y);else{if(Wn(h,f))return;o.uniform2iv(this.addr,f),zn(h,f)}}function Th(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z)&&(o.uniform3i(this.addr,f.x,f.y,f.z),h[0]=f.x,h[1]=f.y,h[2]=f.z);else{if(Wn(h,f))return;o.uniform3iv(this.addr,f),zn(h,f)}}function Ah(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z||h[3]!==f.w)&&(o.uniform4i(this.addr,f.x,f.y,f.z,f.w),h[0]=f.x,h[1]=f.y,h[2]=f.z,h[3]=f.w);else{if(Wn(h,f))return;o.uniform4iv(this.addr,f),zn(h,f)}}function ar(o,f){const h=this.cache;h[0]!==f&&(o.uniform1ui(this.addr,f),h[0]=f)}function Xa(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y)&&(o.uniform2ui(this.addr,f.x,f.y),h[0]=f.x,h[1]=f.y);else{if(Wn(h,f))return;o.uniform2uiv(this.addr,f),zn(h,f)}}function qa(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z)&&(o.uniform3ui(this.addr,f.x,f.y,f.z),h[0]=f.x,h[1]=f.y,h[2]=f.z);else{if(Wn(h,f))return;o.uniform3uiv(this.addr,f),zn(h,f)}}function Eh(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z||h[3]!==f.w)&&(o.uniform4ui(this.addr,f.x,f.y,f.z,f.w),h[0]=f.x,h[1]=f.y,h[2]=f.z,h[3]=f.w);else{if(Wn(h,f))return;o.uniform4uiv(this.addr,f),zn(h,f)}}function Tl(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A);let b;this.type===o.SAMPLER_2D_SHADOW?(Ic.compareFunction=vi,b=Ic):b=Lo,h.setTexture2D(f||b,A)}function od(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A),h.setTexture3D(f||Uo,A)}function Ya(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A),h.setTextureCube(f||Fo,A)}function ld(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A),h.setTexture2DArray(f||Do,A)}function cd(o){switch(o){case 5126:return bh;case 35664:return nd;case 35665:return id;case 35666:return rd;case 35674:return sd;case 35675:return ad;case 35676:return Sl;case 5124:case 35670:return bl;case 35667:case 35671:return zs;case 35668:case 35672:return Th;case 35669:case 35673:return Ah;case 5125:return ar;case 36294:return Xa;case 36295:return qa;case 36296:return Eh;case 35678:case 36198:case 36298:case 36306:case 35682:return Tl;case 35679:case 36299:case 36307:return od;case 35680:case 36300:case 36308:case 36293:return Ya;case 36289:case 36303:case 36311:case 36292:return ld}}function Al(o,f){o.uniform1fv(this.addr,f)}function El(o,f){const h=Wa(f,this.size,2);o.uniform2fv(this.addr,h)}function wh(o,f){const h=Wa(f,this.size,3);o.uniform3fv(this.addr,h)}function wl(o,f){const h=Wa(f,this.size,4);o.uniform4fv(this.addr,h)}function Di(o,f){const h=Wa(f,this.size,4);o.uniformMatrix2fv(this.addr,!1,h)}function ca(o,f){const h=Wa(f,this.size,9);o.uniformMatrix3fv(this.addr,!1,h)}function Lc(o,f){const h=Wa(f,this.size,16);o.uniformMatrix4fv(this.addr,!1,h)}function Za(o,f){o.uniform1iv(this.addr,f)}function Oo(o,f){o.uniform2iv(this.addr,f)}function $a(o,f){o.uniform3iv(this.addr,f)}function Ja(o,f){o.uniform4iv(this.addr,f)}function Ka(o,f){o.uniform1uiv(this.addr,f)}function zo(o,f){o.uniform2uiv(this.addr,f)}function Ch(o,f){o.uniform3uiv(this.addr,f)}function Cl(o,f){o.uniform4uiv(this.addr,f)}function Go(o,f,h){const x=this.cache,A=f.length,b=Os(h,A);Wn(x,b)||(o.uniform1iv(this.addr,b),zn(x,b));for(let N=0;N!==A;++N)h.setTexture2D(f[N]||Lo,b[N])}function Rl(o,f,h){const x=this.cache,A=f.length,b=Os(h,A);Wn(x,b)||(o.uniform1iv(this.addr,b),zn(x,b));for(let N=0;N!==A;++N)h.setTexture3D(f[N]||Uo,b[N])}function Rh(o,f,h){const x=this.cache,A=f.length,b=Os(h,A);Wn(x,b)||(o.uniform1iv(this.addr,b),zn(x,b));for(let N=0;N!==A;++N)h.setTextureCube(f[N]||Fo,b[N])}function Dc(o,f,h){const x=this.cache,A=f.length,b=Os(h,A);Wn(x,b)||(o.uniform1iv(this.addr,b),zn(x,b));for(let N=0;N!==A;++N)h.setTexture2DArray(f[N]||Do,b[N])}function Ih(o){switch(o){case 5126:return Al;case 35664:return El;case 35665:return wh;case 35666:return wl;case 35674:return Di;case 35675:return ca;case 35676:return Lc;case 5124:case 35670:return Za;case 35667:case 35671:return Oo;case 35668:case 35672:return $a;case 35669:case 35673:return Ja;case 5125:return Ka;case 36294:return zo;case 36295:return Ch;case 36296:return Cl;case 35678:case 36198:case 36298:case 36306:case 35682:return Go;case 35679:case 36299:case 36307:return Rl;case 35680:case 36300:case 36308:case 36293:return Rh;case 36289:case 36303:case 36311:case 36292:return Dc}}class Ph{constructor(f,h,x){this.id=f,this.addr=x,this.cache=[],this.type=h.type,this.setValue=cd(h.type)}}class Il{constructor(f,h,x){this.id=f,this.addr=x,this.cache=[],this.type=h.type,this.size=h.size,this.setValue=Ih(h.type)}}class Pl{constructor(f){this.id=f,this.seq=[],this.map={}}setValue(f,h,x){const A=this.seq;for(let b=0,N=A.length;b!==N;++b){const R=A[b];R.setValue(f,h[R.id],x)}}}const Ll=/(\w+)(\])?(\[|\.)?/g;function Uc(o,f){o.seq.push(f),o.map[f.id]=f}function Lh(o,f,h){const x=o.name,A=x.length;for(Ll.lastIndex=0;;){const b=Ll.exec(x),N=Ll.lastIndex;let R=b[1];const j=b[2]==="]",Y=b[3];if(j&&(R=R|0),Y===void 0||Y==="["&&N+2===A){Uc(h,Y===void 0?new Ph(R,o,f):new Il(R,o,f));break}else{let H=h.map[R];H===void 0&&(H=new Pl(R),Uc(h,H)),h=H}}}class ko{constructor(f,h){this.seq=[],this.map={};const x=f.getProgramParameter(h,f.ACTIVE_UNIFORMS);for(let A=0;A<x;++A){const b=f.getActiveUniform(h,A),N=f.getUniformLocation(h,b.name);Lh(b,N,this)}}setValue(f,h,x,A){const b=this.map[h];b!==void 0&&b.setValue(f,x,A)}setOptional(f,h,x){const A=h[x];A!==void 0&&this.setValue(f,x,A)}static upload(f,h,x,A){for(let b=0,N=h.length;b!==N;++b){const R=h[b],j=x[R.id];j.needsUpdate!==!1&&R.setValue(f,j.value,A)}}static seqWithValue(f,h){const x=[];for(let A=0,b=f.length;A!==b;++A){const N=f[A];N.id in h&&x.push(N)}return x}}function Fc(o,f,h){const x=o.createShader(f);return o.shaderSource(x,h),o.compileShader(x),x}const hd=37297;let Dh=0;function Dl(o,f){const h=o.split(`
`),x=[],A=Math.max(f-6,0),b=Math.min(f+6,h.length);for(let N=A;N<b;N++){const R=N+1;x.push(`${R===f?">":" "} ${R}: ${h[N]}`)}return x.join(`
`)}const Ul=new kt;function Uh(o){Xe._getMatrix(Ul,Xe.workingColorSpace,o);const f=`mat3( ${Ul.elements.map(h=>h.toFixed(4))} )`;switch(Xe.getTransfer(o)){case xs:return[f,"LinearTransferOETF"];case Ut:return[f,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[f,"LinearTransferOETF"]}}function Fl(o,f,h){const x=o.getShaderParameter(f,o.COMPILE_STATUS),b=(o.getShaderInfoLog(f)||"").trim();if(x&&b==="")return"";const N=/ERROR: 0:(\d+)/.exec(b);if(N){const R=parseInt(N[1]);return h.toUpperCase()+`

`+b+`

`+Dl(o.getShaderSource(f),R)}else return b}function Fh(o,f){const h=Uh(f);return[`vec4 ${o}( vec4 value ) {`,`	return ${h[1]}( vec4( value.rgb * ${h[0]}, value.a ) );`,"}"].join(`
`)}function Nc(o,f){let h;switch(f){case Jr:h="Linear";break;case Sa:h="Reinhard";break;case ll:h="Cineon";break;case ol:h="ACESFilmic";break;case Ws:h="AgX";break;case Hs:h="Neutral";break;case al:h="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",f),h="Linear"}return"vec3 "+o+"( vec3 color ) { return "+h+"ToneMapping( color ); }"}const or=new Xt;function Nh(){Xe.getLuminanceCoefficients(or);const o=or.x.toFixed(4),f=or.y.toFixed(4),h=or.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${f}, ${h} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ud(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hr).join(`
`)}function Nl(o){const f=[];for(const h in o){const x=o[h];x!==!1&&f.push("#define "+h+" "+x)}return f.join(`
`)}function Qa(o,f){const h={},x=o.getProgramParameter(f,o.ACTIVE_ATTRIBUTES);for(let A=0;A<x;A++){const b=o.getActiveAttrib(f,A),N=b.name;let R=1;b.type===o.FLOAT_MAT2&&(R=2),b.type===o.FLOAT_MAT3&&(R=3),b.type===o.FLOAT_MAT4&&(R=4),h[N]={type:b.type,location:o.getAttribLocation(f,N),locationSize:R}}return h}function Hr(o){return o!==""}function Bc(o,f){const h=f.numSpotLightShadows+f.numSpotLightMaps-f.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,f.numDirLights).replace(/NUM_SPOT_LIGHTS/g,f.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,f.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,h).replace(/NUM_RECT_AREA_LIGHTS/g,f.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,f.numPointLights).replace(/NUM_HEMI_LIGHTS/g,f.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,f.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,f.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,f.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,f.numPointLightShadows)}function Vo(o,f){return o.replace(/NUM_CLIPPING_PLANES/g,f.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,f.numClippingPlanes-f.numClipIntersection)}const Bh=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oc(o){return o.replace(Bh,Wo)}const Ho=new Map;function Wo(o,f){let h=zt[f];if(h===void 0){const x=Ho.get(f);if(x!==void 0)h=zt[x],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',f,x);else throw new Error("Can not resolve #include <"+f+">")}return Oc(h)}const Oh=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bl(o){return o.replace(Oh,dd)}function dd(o,f,h,x){let A="";for(let b=parseInt(f);b<parseInt(h);b++)A+=x.replace(/\[\s*i\s*\]/g,"[ "+b+" ]").replace(/UNROLLED_LOOP_INDEX/g,b);return A}function zh(o){let f=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?f+=`
#define HIGH_PRECISION`:o.precision==="mediump"?f+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(f+=`
#define LOW_PRECISION`),f}function ha(o){let f="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===Ma?f="SHADOWMAP_TYPE_PCF":o.shadowMapType===ro?f="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ji&&(f="SHADOWMAP_TYPE_VSM"),f}function ua(o){let f="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Zt:case Kt:f="ENVMAP_TYPE_CUBE";break;case ri:f="ENVMAP_TYPE_CUBE_UV";break}return f}function fd(o){let f="ENVMAP_MODE_REFLECTION";return o.envMap&&o.envMapMode===Kt&&(f="ENVMAP_MODE_REFRACTION"),f}function Ol(o){let f="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case Xs:f="ENVMAP_BLENDING_MULTIPLY";break;case so:f="ENVMAP_BLENDING_MIX";break;case Kr:f="ENVMAP_BLENDING_ADD";break}return f}function zl(o){const f=o.envMapCubeUVHeight;if(f===null)return null;const h=Math.log2(f)-2,x=1/f;return{texelWidth:1/(3*Math.max(Math.pow(2,h),112)),texelHeight:x,maxMip:h}}function Wr(o,f,h,x){const A=o.getContext(),b=h.defines;let N=h.vertexShader,R=h.fragmentShader;const j=ha(h),Y=ua(h),ie=fd(h),H=Ol(h),X=zl(h),$=ud(h),ge=Nl(b),ae=A.createProgram();let C,v,re=h.glslVersion?"#version "+h.glslVersion+`
`:"";h.isRawShaderMaterial?(C=["#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge].filter(Hr).join(`
`),C.length>0&&(C+=`
`),v=["#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge].filter(Hr).join(`
`),v.length>0&&(v+=`
`)):(C=[zh(h),"#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge,h.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",h.batching?"#define USE_BATCHING":"",h.batchingColor?"#define USE_BATCHING_COLOR":"",h.instancing?"#define USE_INSTANCING":"",h.instancingColor?"#define USE_INSTANCING_COLOR":"",h.instancingMorph?"#define USE_INSTANCING_MORPH":"",h.useFog&&h.fog?"#define USE_FOG":"",h.useFog&&h.fogExp2?"#define FOG_EXP2":"",h.map?"#define USE_MAP":"",h.envMap?"#define USE_ENVMAP":"",h.envMap?"#define "+ie:"",h.lightMap?"#define USE_LIGHTMAP":"",h.aoMap?"#define USE_AOMAP":"",h.bumpMap?"#define USE_BUMPMAP":"",h.normalMap?"#define USE_NORMALMAP":"",h.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",h.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",h.displacementMap?"#define USE_DISPLACEMENTMAP":"",h.emissiveMap?"#define USE_EMISSIVEMAP":"",h.anisotropy?"#define USE_ANISOTROPY":"",h.anisotropyMap?"#define USE_ANISOTROPYMAP":"",h.clearcoatMap?"#define USE_CLEARCOATMAP":"",h.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",h.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",h.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",h.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",h.specularMap?"#define USE_SPECULARMAP":"",h.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",h.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",h.roughnessMap?"#define USE_ROUGHNESSMAP":"",h.metalnessMap?"#define USE_METALNESSMAP":"",h.alphaMap?"#define USE_ALPHAMAP":"",h.alphaHash?"#define USE_ALPHAHASH":"",h.transmission?"#define USE_TRANSMISSION":"",h.transmissionMap?"#define USE_TRANSMISSIONMAP":"",h.thicknessMap?"#define USE_THICKNESSMAP":"",h.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",h.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",h.mapUv?"#define MAP_UV "+h.mapUv:"",h.alphaMapUv?"#define ALPHAMAP_UV "+h.alphaMapUv:"",h.lightMapUv?"#define LIGHTMAP_UV "+h.lightMapUv:"",h.aoMapUv?"#define AOMAP_UV "+h.aoMapUv:"",h.emissiveMapUv?"#define EMISSIVEMAP_UV "+h.emissiveMapUv:"",h.bumpMapUv?"#define BUMPMAP_UV "+h.bumpMapUv:"",h.normalMapUv?"#define NORMALMAP_UV "+h.normalMapUv:"",h.displacementMapUv?"#define DISPLACEMENTMAP_UV "+h.displacementMapUv:"",h.metalnessMapUv?"#define METALNESSMAP_UV "+h.metalnessMapUv:"",h.roughnessMapUv?"#define ROUGHNESSMAP_UV "+h.roughnessMapUv:"",h.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+h.anisotropyMapUv:"",h.clearcoatMapUv?"#define CLEARCOATMAP_UV "+h.clearcoatMapUv:"",h.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+h.clearcoatNormalMapUv:"",h.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+h.clearcoatRoughnessMapUv:"",h.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+h.iridescenceMapUv:"",h.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+h.iridescenceThicknessMapUv:"",h.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+h.sheenColorMapUv:"",h.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+h.sheenRoughnessMapUv:"",h.specularMapUv?"#define SPECULARMAP_UV "+h.specularMapUv:"",h.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+h.specularColorMapUv:"",h.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+h.specularIntensityMapUv:"",h.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+h.transmissionMapUv:"",h.thicknessMapUv?"#define THICKNESSMAP_UV "+h.thicknessMapUv:"",h.vertexTangents&&h.flatShading===!1?"#define USE_TANGENT":"",h.vertexColors?"#define USE_COLOR":"",h.vertexAlphas?"#define USE_COLOR_ALPHA":"",h.vertexUv1s?"#define USE_UV1":"",h.vertexUv2s?"#define USE_UV2":"",h.vertexUv3s?"#define USE_UV3":"",h.pointsUvs?"#define USE_POINTS_UV":"",h.flatShading?"#define FLAT_SHADED":"",h.skinning?"#define USE_SKINNING":"",h.morphTargets?"#define USE_MORPHTARGETS":"",h.morphNormals&&h.flatShading===!1?"#define USE_MORPHNORMALS":"",h.morphColors?"#define USE_MORPHCOLORS":"",h.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+h.morphTextureStride:"",h.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+h.morphTargetsCount:"",h.doubleSided?"#define DOUBLE_SIDED":"",h.flipSided?"#define FLIP_SIDED":"",h.shadowMapEnabled?"#define USE_SHADOWMAP":"",h.shadowMapEnabled?"#define "+j:"",h.sizeAttenuation?"#define USE_SIZEATTENUATION":"",h.numLightProbes>0?"#define USE_LIGHT_PROBES":"",h.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",h.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hr).join(`
`),v=[zh(h),"#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge,h.useFog&&h.fog?"#define USE_FOG":"",h.useFog&&h.fogExp2?"#define FOG_EXP2":"",h.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",h.map?"#define USE_MAP":"",h.matcap?"#define USE_MATCAP":"",h.envMap?"#define USE_ENVMAP":"",h.envMap?"#define "+Y:"",h.envMap?"#define "+ie:"",h.envMap?"#define "+H:"",X?"#define CUBEUV_TEXEL_WIDTH "+X.texelWidth:"",X?"#define CUBEUV_TEXEL_HEIGHT "+X.texelHeight:"",X?"#define CUBEUV_MAX_MIP "+X.maxMip+".0":"",h.lightMap?"#define USE_LIGHTMAP":"",h.aoMap?"#define USE_AOMAP":"",h.bumpMap?"#define USE_BUMPMAP":"",h.normalMap?"#define USE_NORMALMAP":"",h.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",h.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",h.emissiveMap?"#define USE_EMISSIVEMAP":"",h.anisotropy?"#define USE_ANISOTROPY":"",h.anisotropyMap?"#define USE_ANISOTROPYMAP":"",h.clearcoat?"#define USE_CLEARCOAT":"",h.clearcoatMap?"#define USE_CLEARCOATMAP":"",h.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",h.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",h.dispersion?"#define USE_DISPERSION":"",h.iridescence?"#define USE_IRIDESCENCE":"",h.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",h.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",h.specularMap?"#define USE_SPECULARMAP":"",h.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",h.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",h.roughnessMap?"#define USE_ROUGHNESSMAP":"",h.metalnessMap?"#define USE_METALNESSMAP":"",h.alphaMap?"#define USE_ALPHAMAP":"",h.alphaTest?"#define USE_ALPHATEST":"",h.alphaHash?"#define USE_ALPHAHASH":"",h.sheen?"#define USE_SHEEN":"",h.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",h.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",h.transmission?"#define USE_TRANSMISSION":"",h.transmissionMap?"#define USE_TRANSMISSIONMAP":"",h.thicknessMap?"#define USE_THICKNESSMAP":"",h.vertexTangents&&h.flatShading===!1?"#define USE_TANGENT":"",h.vertexColors||h.instancingColor||h.batchingColor?"#define USE_COLOR":"",h.vertexAlphas?"#define USE_COLOR_ALPHA":"",h.vertexUv1s?"#define USE_UV1":"",h.vertexUv2s?"#define USE_UV2":"",h.vertexUv3s?"#define USE_UV3":"",h.pointsUvs?"#define USE_POINTS_UV":"",h.gradientMap?"#define USE_GRADIENTMAP":"",h.flatShading?"#define FLAT_SHADED":"",h.doubleSided?"#define DOUBLE_SIDED":"",h.flipSided?"#define FLIP_SIDED":"",h.shadowMapEnabled?"#define USE_SHADOWMAP":"",h.shadowMapEnabled?"#define "+j:"",h.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",h.numLightProbes>0?"#define USE_LIGHT_PROBES":"",h.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",h.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",h.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",h.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",h.toneMapping!==mn?"#define TONE_MAPPING":"",h.toneMapping!==mn?zt.tonemapping_pars_fragment:"",h.toneMapping!==mn?Nc("toneMapping",h.toneMapping):"",h.dithering?"#define DITHERING":"",h.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,Fh("linearToOutputTexel",h.outputColorSpace),Nh(),h.useDepthPacking?"#define DEPTH_PACKING "+h.depthPacking:"",`
`].filter(Hr).join(`
`)),N=Oc(N),N=Bc(N,h),N=Vo(N,h),R=Oc(R),R=Bc(R,h),R=Vo(R,h),N=Bl(N),R=Bl(R),h.isRawShaderMaterial!==!0&&(re=`#version 300 es
`,C=[$,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+C,v=["#define varying in",h.glslVersion===io?"":"layout(location = 0) out highp vec4 pc_fragColor;",h.glslVersion===io?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const J=re+C+N,k=re+v+R,he=Fc(A,A.VERTEX_SHADER,J),ee=Fc(A,A.FRAGMENT_SHADER,k);A.attachShader(ae,he),A.attachShader(ae,ee),h.index0AttributeName!==void 0?A.bindAttribLocation(ae,0,h.index0AttributeName):h.morphTargets===!0&&A.bindAttribLocation(ae,0,"position"),A.linkProgram(ae);function te(Z){if(o.debug.checkShaderErrors){const fe=A.getProgramInfoLog(ae)||"",Ae=A.getShaderInfoLog(he)||"",we=A.getShaderInfoLog(ee)||"",Se=fe.trim(),be=Ae.trim(),De=we.trim();let _e=!0,ot=!0;if(A.getProgramParameter(ae,A.LINK_STATUS)===!1)if(_e=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(A,ae,he,ee);else{const yt=Fl(A,he,"vertex"),Ht=Fl(A,ee,"fragment");console.error("THREE.WebGLProgram: Shader Error "+A.getError()+" - VALIDATE_STATUS "+A.getProgramParameter(ae,A.VALIDATE_STATUS)+`

Material Name: `+Z.name+`
Material Type: `+Z.type+`

Program Info Log: `+Se+`
`+yt+`
`+Ht)}else Se!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Se):(be===""||De==="")&&(ot=!1);ot&&(Z.diagnostics={runnable:_e,programLog:Se,vertexShader:{log:be,prefix:C},fragmentShader:{log:De,prefix:v}})}A.deleteShader(he),A.deleteShader(ee),ve=new ko(A,ae),L=Qa(A,ae)}let ve;this.getUniforms=function(){return ve===void 0&&te(this),ve};let L;this.getAttributes=function(){return L===void 0&&te(this),L};let P=h.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=A.getProgramParameter(ae,hd)),P},this.destroy=function(){x.releaseStatesOfProgram(this),A.deleteProgram(ae),this.program=void 0},this.type=h.shaderType,this.name=h.shaderName,this.id=Dh++,this.cacheKey=f,this.usedTimes=1,this.program=ae,this.vertexShader=he,this.fragmentShader=ee,this}let Xr=0;class Gl{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(f){const h=f.vertexShader,x=f.fragmentShader,A=this._getShaderStage(h),b=this._getShaderStage(x),N=this._getShaderCacheForMaterial(f);return N.has(A)===!1&&(N.add(A),A.usedTimes++),N.has(b)===!1&&(N.add(b),b.usedTimes++),this}remove(f){const h=this.materialCache.get(f);for(const x of h)x.usedTimes--,x.usedTimes===0&&this.shaderCache.delete(x.code);return this.materialCache.delete(f),this}getVertexShaderID(f){return this._getShaderStage(f.vertexShader).id}getFragmentShaderID(f){return this._getShaderStage(f.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(f){const h=this.materialCache;let x=h.get(f);return x===void 0&&(x=new Set,h.set(f,x)),x}_getShaderStage(f){const h=this.shaderCache;let x=h.get(f);return x===void 0&&(x=new zc(f),h.set(f,x)),x}}class zc{constructor(f){this.id=Xr++,this.code=f,this.usedTimes=0}}function pd(o,f,h,x,A,b,N){const R=new Mi,j=new Gl,Y=new Set,ie=[],H=A.logarithmicDepthBuffer,X=A.vertexTextures;let $=A.precision;const ge={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function ae(L){return Y.add(L),L===0?"uv":`uv${L}`}function C(L,P,Z,fe,Ae){const we=fe.fog,Se=Ae.geometry,be=L.isMeshStandardMaterial?fe.environment:null,De=(L.isMeshStandardMaterial?h:f).get(L.envMap||be),_e=De&&De.mapping===ri?De.image.height:null,ot=ge[L.type];L.precision!==null&&($=A.getMaxPrecision(L.precision),$!==L.precision&&console.warn("THREE.WebGLProgram.getParameters:",L.precision,"not supported, using",$,"instead."));const yt=Se.morphAttributes.position||Se.morphAttributes.normal||Se.morphAttributes.color,Ht=yt!==void 0?yt.length:0;let un=0;Se.morphAttributes.position!==void 0&&(un=1),Se.morphAttributes.normal!==void 0&&(un=2),Se.morphAttributes.color!==void 0&&(un=3);let Xn,qn,bn,Me;if(ot){const an=Ln[ot];Xn=an.vertexShader,qn=an.fragmentShader}else Xn=L.vertexShader,qn=L.fragmentShader,j.update(L),bn=j.getVertexShaderID(L),Me=j.getFragmentShaderID(L);const Ee=o.getRenderTarget(),rt=o.state.buffers.depth.getReversed(),Lt=Ae.isInstancedMesh===!0,pt=Ae.isBatchedMesh===!0,nn=!!L.map,ei=!!L.matcap,O=!!De,In=!!L.aoMap,Ft=!!L.lightMap,Ct=!!L.bumpMap,st=!!L.normalMap,En=!!L.displacementMap,at=!!L.emissiveMap,Gt=!!L.metalnessMap,li=!!L.roughnessMap,Dn=L.anisotropy>0,I=L.clearcoat>0,S=L.dispersion>0,K=L.iridescence>0,pe=L.sheen>0,Te=L.transmission>0,me=Dn&&!!L.anisotropyMap,ut=I&&!!L.clearcoatMap,ze=I&&!!L.clearcoatNormalMap,lt=I&&!!L.clearcoatRoughnessMap,ct=K&&!!L.iridescenceMap,Fe=K&&!!L.iridescenceThicknessMap,Ze=pe&&!!L.sheenColorMap,Rt=pe&&!!L.sheenRoughnessMap,ht=!!L.specularMap,qe=!!L.specularColorMap,Wt=!!L.specularIntensityMap,G=Te&&!!L.transmissionMap,Ne=Te&&!!L.thicknessMap,Ge=!!L.gradientMap,Qe=!!L.alphaMap,Ue=L.alphaTest>0,ue=!!L.alphaHash,je=!!L.extensions;let Nt=mn;L.toneMapped&&(Ee===null||Ee.isXRRenderTarget===!0)&&(Nt=o.toneMapping);const gn={shaderID:ot,shaderType:L.type,shaderName:L.name,vertexShader:Xn,fragmentShader:qn,defines:L.defines,customVertexShaderID:bn,customFragmentShaderID:Me,isRawShaderMaterial:L.isRawShaderMaterial===!0,glslVersion:L.glslVersion,precision:$,batching:pt,batchingColor:pt&&Ae._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&Ae.instanceColor!==null,instancingMorph:Lt&&Ae.morphTexture!==null,supportsVertexTextures:X,outputColorSpace:Ee===null?o.outputColorSpace:Ee.isXRRenderTarget===!0?Ee.texture.colorSpace:hn,alphaToCoverage:!!L.alphaToCoverage,map:nn,matcap:ei,envMap:O,envMapMode:O&&De.mapping,envMapCubeUVHeight:_e,aoMap:In,lightMap:Ft,bumpMap:Ct,normalMap:st,displacementMap:X&&En,emissiveMap:at,normalMapObjectSpace:st&&L.normalMapType===Rr,normalMapTangentSpace:st&&L.normalMapType===Ii,metalnessMap:Gt,roughnessMap:li,anisotropy:Dn,anisotropyMap:me,clearcoat:I,clearcoatMap:ut,clearcoatNormalMap:ze,clearcoatRoughnessMap:lt,dispersion:S,iridescence:K,iridescenceMap:ct,iridescenceThicknessMap:Fe,sheen:pe,sheenColorMap:Ze,sheenRoughnessMap:Rt,specularMap:ht,specularColorMap:qe,specularIntensityMap:Wt,transmission:Te,transmissionMap:G,thicknessMap:Ne,gradientMap:Ge,opaque:L.transparent===!1&&L.blending===Qi&&L.alphaToCoverage===!1,alphaMap:Qe,alphaTest:Ue,alphaHash:ue,combine:L.combine,mapUv:nn&&ae(L.map.channel),aoMapUv:In&&ae(L.aoMap.channel),lightMapUv:Ft&&ae(L.lightMap.channel),bumpMapUv:Ct&&ae(L.bumpMap.channel),normalMapUv:st&&ae(L.normalMap.channel),displacementMapUv:En&&ae(L.displacementMap.channel),emissiveMapUv:at&&ae(L.emissiveMap.channel),metalnessMapUv:Gt&&ae(L.metalnessMap.channel),roughnessMapUv:li&&ae(L.roughnessMap.channel),anisotropyMapUv:me&&ae(L.anisotropyMap.channel),clearcoatMapUv:ut&&ae(L.clearcoatMap.channel),clearcoatNormalMapUv:ze&&ae(L.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:lt&&ae(L.clearcoatRoughnessMap.channel),iridescenceMapUv:ct&&ae(L.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&ae(L.iridescenceThicknessMap.channel),sheenColorMapUv:Ze&&ae(L.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&ae(L.sheenRoughnessMap.channel),specularMapUv:ht&&ae(L.specularMap.channel),specularColorMapUv:qe&&ae(L.specularColorMap.channel),specularIntensityMapUv:Wt&&ae(L.specularIntensityMap.channel),transmissionMapUv:G&&ae(L.transmissionMap.channel),thicknessMapUv:Ne&&ae(L.thicknessMap.channel),alphaMapUv:Qe&&ae(L.alphaMap.channel),vertexTangents:!!Se.attributes.tangent&&(st||Dn),vertexColors:L.vertexColors,vertexAlphas:L.vertexColors===!0&&!!Se.attributes.color&&Se.attributes.color.itemSize===4,pointsUvs:Ae.isPoints===!0&&!!Se.attributes.uv&&(nn||Qe),fog:!!we,useFog:L.fog===!0,fogExp2:!!we&&we.isFogExp2,flatShading:L.flatShading===!0&&L.wireframe===!1,sizeAttenuation:L.sizeAttenuation===!0,logarithmicDepthBuffer:H,reversedDepthBuffer:rt,skinning:Ae.isSkinnedMesh===!0,morphTargets:Se.morphAttributes.position!==void 0,morphNormals:Se.morphAttributes.normal!==void 0,morphColors:Se.morphAttributes.color!==void 0,morphTargetsCount:Ht,morphTextureStride:un,numDirLights:P.directional.length,numPointLights:P.point.length,numSpotLights:P.spot.length,numSpotLightMaps:P.spotLightMap.length,numRectAreaLights:P.rectArea.length,numHemiLights:P.hemi.length,numDirLightShadows:P.directionalShadowMap.length,numPointLightShadows:P.pointShadowMap.length,numSpotLightShadows:P.spotShadowMap.length,numSpotLightShadowsWithMaps:P.numSpotLightShadowsWithMaps,numLightProbes:P.numLightProbes,numClippingPlanes:N.numPlanes,numClipIntersection:N.numIntersection,dithering:L.dithering,shadowMapEnabled:o.shadowMap.enabled&&Z.length>0,shadowMapType:o.shadowMap.type,toneMapping:Nt,decodeVideoTexture:nn&&L.map.isVideoTexture===!0&&Xe.getTransfer(L.map.colorSpace)===Ut,decodeVideoTextureEmissive:at&&L.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(L.emissiveMap.colorSpace)===Ut,premultipliedAlpha:L.premultipliedAlpha,doubleSided:L.side===Ki,flipSided:L.side===ln,useDepthPacking:L.depthPacking>=0,depthPacking:L.depthPacking||0,index0AttributeName:L.index0AttributeName,extensionClipCullDistance:je&&L.extensions.clipCullDistance===!0&&x.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(je&&L.extensions.multiDraw===!0||pt)&&x.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:x.has("KHR_parallel_shader_compile"),customProgramCacheKey:L.customProgramCacheKey()};return gn.vertexUv1s=Y.has(1),gn.vertexUv2s=Y.has(2),gn.vertexUv3s=Y.has(3),Y.clear(),gn}function v(L){const P=[];if(L.shaderID?P.push(L.shaderID):(P.push(L.customVertexShaderID),P.push(L.customFragmentShaderID)),L.defines!==void 0)for(const Z in L.defines)P.push(Z),P.push(L.defines[Z]);return L.isRawShaderMaterial===!1&&(re(P,L),J(P,L),P.push(o.outputColorSpace)),P.push(L.customProgramCacheKey),P.join()}function re(L,P){L.push(P.precision),L.push(P.outputColorSpace),L.push(P.envMapMode),L.push(P.envMapCubeUVHeight),L.push(P.mapUv),L.push(P.alphaMapUv),L.push(P.lightMapUv),L.push(P.aoMapUv),L.push(P.bumpMapUv),L.push(P.normalMapUv),L.push(P.displacementMapUv),L.push(P.emissiveMapUv),L.push(P.metalnessMapUv),L.push(P.roughnessMapUv),L.push(P.anisotropyMapUv),L.push(P.clearcoatMapUv),L.push(P.clearcoatNormalMapUv),L.push(P.clearcoatRoughnessMapUv),L.push(P.iridescenceMapUv),L.push(P.iridescenceThicknessMapUv),L.push(P.sheenColorMapUv),L.push(P.sheenRoughnessMapUv),L.push(P.specularMapUv),L.push(P.specularColorMapUv),L.push(P.specularIntensityMapUv),L.push(P.transmissionMapUv),L.push(P.thicknessMapUv),L.push(P.combine),L.push(P.fogExp2),L.push(P.sizeAttenuation),L.push(P.morphTargetsCount),L.push(P.morphAttributeCount),L.push(P.numDirLights),L.push(P.numPointLights),L.push(P.numSpotLights),L.push(P.numSpotLightMaps),L.push(P.numHemiLights),L.push(P.numRectAreaLights),L.push(P.numDirLightShadows),L.push(P.numPointLightShadows),L.push(P.numSpotLightShadows),L.push(P.numSpotLightShadowsWithMaps),L.push(P.numLightProbes),L.push(P.shadowMapType),L.push(P.toneMapping),L.push(P.numClippingPlanes),L.push(P.numClipIntersection),L.push(P.depthPacking)}function J(L,P){R.disableAll(),P.supportsVertexTextures&&R.enable(0),P.instancing&&R.enable(1),P.instancingColor&&R.enable(2),P.instancingMorph&&R.enable(3),P.matcap&&R.enable(4),P.envMap&&R.enable(5),P.normalMapObjectSpace&&R.enable(6),P.normalMapTangentSpace&&R.enable(7),P.clearcoat&&R.enable(8),P.iridescence&&R.enable(9),P.alphaTest&&R.enable(10),P.vertexColors&&R.enable(11),P.vertexAlphas&&R.enable(12),P.vertexUv1s&&R.enable(13),P.vertexUv2s&&R.enable(14),P.vertexUv3s&&R.enable(15),P.vertexTangents&&R.enable(16),P.anisotropy&&R.enable(17),P.alphaHash&&R.enable(18),P.batching&&R.enable(19),P.dispersion&&R.enable(20),P.batchingColor&&R.enable(21),P.gradientMap&&R.enable(22),L.push(R.mask),R.disableAll(),P.fog&&R.enable(0),P.useFog&&R.enable(1),P.flatShading&&R.enable(2),P.logarithmicDepthBuffer&&R.enable(3),P.reversedDepthBuffer&&R.enable(4),P.skinning&&R.enable(5),P.morphTargets&&R.enable(6),P.morphNormals&&R.enable(7),P.morphColors&&R.enable(8),P.premultipliedAlpha&&R.enable(9),P.shadowMapEnabled&&R.enable(10),P.doubleSided&&R.enable(11),P.flipSided&&R.enable(12),P.useDepthPacking&&R.enable(13),P.dithering&&R.enable(14),P.transmission&&R.enable(15),P.sheen&&R.enable(16),P.opaque&&R.enable(17),P.pointsUvs&&R.enable(18),P.decodeVideoTexture&&R.enable(19),P.decodeVideoTextureEmissive&&R.enable(20),P.alphaToCoverage&&R.enable(21),L.push(R.mask)}function k(L){const P=ge[L.type];let Z;if(P){const fe=Ln[P];Z=Oi.clone(fe.uniforms)}else Z=L.uniforms;return Z}function he(L,P){let Z;for(let fe=0,Ae=ie.length;fe<Ae;fe++){const we=ie[fe];if(we.cacheKey===P){Z=we,++Z.usedTimes;break}}return Z===void 0&&(Z=new Wr(o,P,L,b),ie.push(Z)),Z}function ee(L){if(--L.usedTimes===0){const P=ie.indexOf(L);ie[P]=ie[ie.length-1],ie.pop(),L.destroy()}}function te(L){j.remove(L)}function ve(){j.dispose()}return{getParameters:C,getProgramCacheKey:v,getUniforms:k,acquireProgram:he,releaseProgram:ee,releaseShaderCache:te,programs:ie,dispose:ve}}function md(){let o=new WeakMap;function f(N){return o.has(N)}function h(N){let R=o.get(N);return R===void 0&&(R={},o.set(N,R)),R}function x(N){o.delete(N)}function A(N,R,j){o.get(N)[R]=j}function b(){o=new WeakMap}return{has:f,get:h,remove:x,update:A,dispose:b}}function gd(o,f){return o.groupOrder!==f.groupOrder?o.groupOrder-f.groupOrder:o.renderOrder!==f.renderOrder?o.renderOrder-f.renderOrder:o.material.id!==f.material.id?o.material.id-f.material.id:o.z!==f.z?o.z-f.z:o.id-f.id}function Ui(o,f){return o.groupOrder!==f.groupOrder?o.groupOrder-f.groupOrder:o.renderOrder!==f.renderOrder?o.renderOrder-f.renderOrder:o.z!==f.z?f.z-o.z:o.id-f.id}function Gh(){const o=[];let f=0;const h=[],x=[],A=[];function b(){f=0,h.length=0,x.length=0,A.length=0}function N(H,X,$,ge,ae,C){let v=o[f];return v===void 0?(v={id:H.id,object:H,geometry:X,material:$,groupOrder:ge,renderOrder:H.renderOrder,z:ae,group:C},o[f]=v):(v.id=H.id,v.object=H,v.geometry=X,v.material=$,v.groupOrder=ge,v.renderOrder=H.renderOrder,v.z=ae,v.group=C),f++,v}function R(H,X,$,ge,ae,C){const v=N(H,X,$,ge,ae,C);$.transmission>0?x.push(v):$.transparent===!0?A.push(v):h.push(v)}function j(H,X,$,ge,ae,C){const v=N(H,X,$,ge,ae,C);$.transmission>0?x.unshift(v):$.transparent===!0?A.unshift(v):h.unshift(v)}function Y(H,X){h.length>1&&h.sort(H||gd),x.length>1&&x.sort(X||Ui),A.length>1&&A.sort(X||Ui)}function ie(){for(let H=f,X=o.length;H<X;H++){const $=o[H];if($.id===null)break;$.id=null,$.object=null,$.geometry=null,$.material=null,$.group=null}}return{opaque:h,transmissive:x,transparent:A,init:b,push:R,unshift:j,finish:ie,sort:Y}}function kh(){let o=new WeakMap;function f(x,A){const b=o.get(x);let N;return b===void 0?(N=new Gh,o.set(x,[N])):A>=b.length?(N=new Gh,b.push(N)):N=b[A],N}function h(){o=new WeakMap}return{get:f,dispose:h}}function _d(){const o={};return{get:function(f){if(o[f.id]!==void 0)return o[f.id];let h;switch(f.type){case"DirectionalLight":h={direction:new Xt,color:new Dt};break;case"SpotLight":h={position:new Xt,direction:new Xt,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":h={position:new Xt,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":h={direction:new Xt,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":h={color:new Dt,position:new Xt,halfWidth:new Xt,halfHeight:new Xt};break}return o[f.id]=h,h}}}function kl(){const o={};return{get:function(f){if(o[f.id]!==void 0)return o[f.id];let h;switch(f.type){case"DirectionalLight":h={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt};break;case"SpotLight":h={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt};break;case"PointLight":h={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[f.id]=h,h}}}let da=0;function Xo(o,f){return(f.castShadow?2:0)-(o.castShadow?2:0)+(f.map?1:0)-(o.map?1:0)}function Vh(o){const f=new _d,h=kl(),x={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let Y=0;Y<9;Y++)x.probe.push(new Xt);const A=new Xt,b=new Bi,N=new Bi;function R(Y){let ie=0,H=0,X=0;for(let L=0;L<9;L++)x.probe[L].set(0,0,0);let $=0,ge=0,ae=0,C=0,v=0,re=0,J=0,k=0,he=0,ee=0,te=0;Y.sort(Xo);for(let L=0,P=Y.length;L<P;L++){const Z=Y[L],fe=Z.color,Ae=Z.intensity,we=Z.distance,Se=Z.shadow&&Z.shadow.map?Z.shadow.map.texture:null;if(Z.isAmbientLight)ie+=fe.r*Ae,H+=fe.g*Ae,X+=fe.b*Ae;else if(Z.isLightProbe){for(let be=0;be<9;be++)x.probe[be].addScaledVector(Z.sh.coefficients[be],Ae);te++}else if(Z.isDirectionalLight){const be=f.get(Z);if(be.color.copy(Z.color).multiplyScalar(Z.intensity),Z.castShadow){const De=Z.shadow,_e=h.get(Z);_e.shadowIntensity=De.intensity,_e.shadowBias=De.bias,_e.shadowNormalBias=De.normalBias,_e.shadowRadius=De.radius,_e.shadowMapSize=De.mapSize,x.directionalShadow[$]=_e,x.directionalShadowMap[$]=Se,x.directionalShadowMatrix[$]=Z.shadow.matrix,re++}x.directional[$]=be,$++}else if(Z.isSpotLight){const be=f.get(Z);be.position.setFromMatrixPosition(Z.matrixWorld),be.color.copy(fe).multiplyScalar(Ae),be.distance=we,be.coneCos=Math.cos(Z.angle),be.penumbraCos=Math.cos(Z.angle*(1-Z.penumbra)),be.decay=Z.decay,x.spot[ae]=be;const De=Z.shadow;if(Z.map&&(x.spotLightMap[he]=Z.map,he++,De.updateMatrices(Z),Z.castShadow&&ee++),x.spotLightMatrix[ae]=De.matrix,Z.castShadow){const _e=h.get(Z);_e.shadowIntensity=De.intensity,_e.shadowBias=De.bias,_e.shadowNormalBias=De.normalBias,_e.shadowRadius=De.radius,_e.shadowMapSize=De.mapSize,x.spotShadow[ae]=_e,x.spotShadowMap[ae]=Se,k++}ae++}else if(Z.isRectAreaLight){const be=f.get(Z);be.color.copy(fe).multiplyScalar(Ae),be.halfWidth.set(Z.width*.5,0,0),be.halfHeight.set(0,Z.height*.5,0),x.rectArea[C]=be,C++}else if(Z.isPointLight){const be=f.get(Z);if(be.color.copy(Z.color).multiplyScalar(Z.intensity),be.distance=Z.distance,be.decay=Z.decay,Z.castShadow){const De=Z.shadow,_e=h.get(Z);_e.shadowIntensity=De.intensity,_e.shadowBias=De.bias,_e.shadowNormalBias=De.normalBias,_e.shadowRadius=De.radius,_e.shadowMapSize=De.mapSize,_e.shadowCameraNear=De.camera.near,_e.shadowCameraFar=De.camera.far,x.pointShadow[ge]=_e,x.pointShadowMap[ge]=Se,x.pointShadowMatrix[ge]=Z.shadow.matrix,J++}x.point[ge]=be,ge++}else if(Z.isHemisphereLight){const be=f.get(Z);be.skyColor.copy(Z.color).multiplyScalar(Ae),be.groundColor.copy(Z.groundColor).multiplyScalar(Ae),x.hemi[v]=be,v++}}C>0&&(o.has("OES_texture_float_linear")===!0?(x.rectAreaLTC1=ke.LTC_FLOAT_1,x.rectAreaLTC2=ke.LTC_FLOAT_2):(x.rectAreaLTC1=ke.LTC_HALF_1,x.rectAreaLTC2=ke.LTC_HALF_2)),x.ambient[0]=ie,x.ambient[1]=H,x.ambient[2]=X;const ve=x.hash;(ve.directionalLength!==$||ve.pointLength!==ge||ve.spotLength!==ae||ve.rectAreaLength!==C||ve.hemiLength!==v||ve.numDirectionalShadows!==re||ve.numPointShadows!==J||ve.numSpotShadows!==k||ve.numSpotMaps!==he||ve.numLightProbes!==te)&&(x.directional.length=$,x.spot.length=ae,x.rectArea.length=C,x.point.length=ge,x.hemi.length=v,x.directionalShadow.length=re,x.directionalShadowMap.length=re,x.pointShadow.length=J,x.pointShadowMap.length=J,x.spotShadow.length=k,x.spotShadowMap.length=k,x.directionalShadowMatrix.length=re,x.pointShadowMatrix.length=J,x.spotLightMatrix.length=k+he-ee,x.spotLightMap.length=he,x.numSpotLightShadowsWithMaps=ee,x.numLightProbes=te,ve.directionalLength=$,ve.pointLength=ge,ve.spotLength=ae,ve.rectAreaLength=C,ve.hemiLength=v,ve.numDirectionalShadows=re,ve.numPointShadows=J,ve.numSpotShadows=k,ve.numSpotMaps=he,ve.numLightProbes=te,x.version=da++)}function j(Y,ie){let H=0,X=0,$=0,ge=0,ae=0;const C=ie.matrixWorldInverse;for(let v=0,re=Y.length;v<re;v++){const J=Y[v];if(J.isDirectionalLight){const k=x.directional[H];k.direction.setFromMatrixPosition(J.matrixWorld),A.setFromMatrixPosition(J.target.matrixWorld),k.direction.sub(A),k.direction.transformDirection(C),H++}else if(J.isSpotLight){const k=x.spot[$];k.position.setFromMatrixPosition(J.matrixWorld),k.position.applyMatrix4(C),k.direction.setFromMatrixPosition(J.matrixWorld),A.setFromMatrixPosition(J.target.matrixWorld),k.direction.sub(A),k.direction.transformDirection(C),$++}else if(J.isRectAreaLight){const k=x.rectArea[ge];k.position.setFromMatrixPosition(J.matrixWorld),k.position.applyMatrix4(C),N.identity(),b.copy(J.matrixWorld),b.premultiply(C),N.extractRotation(b),k.halfWidth.set(J.width*.5,0,0),k.halfHeight.set(0,J.height*.5,0),k.halfWidth.applyMatrix4(N),k.halfHeight.applyMatrix4(N),ge++}else if(J.isPointLight){const k=x.point[X];k.position.setFromMatrixPosition(J.matrixWorld),k.position.applyMatrix4(C),X++}else if(J.isHemisphereLight){const k=x.hemi[ae];k.direction.setFromMatrixPosition(J.matrixWorld),k.direction.transformDirection(C),ae++}}}return{setup:R,setupView:j,state:x}}function Hh(o){const f=new Vh(o),h=[],x=[];function A(ie){Y.camera=ie,h.length=0,x.length=0}function b(ie){h.push(ie)}function N(ie){x.push(ie)}function R(){f.setup(h)}function j(ie){f.setupView(h,ie)}const Y={lightsArray:h,shadowsArray:x,camera:null,lights:f,transmissionRenderTarget:{}};return{init:A,state:Y,setupLights:R,setupLightsView:j,pushLight:b,pushShadow:N}}function Gc(o){let f=new WeakMap;function h(A,b=0){const N=f.get(A);let R;return N===void 0?(R=new Hh(o),f.set(A,[R])):b>=N.length?(R=new Hh(o),N.push(R)):R=N[b],R}function x(){f=new WeakMap}return{get:h,dispose:x}}const Ci=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function xd(o,f,h){let x=new qs;const A=new jt,b=new jt,N=new Zn,R=new cl({depthPacking:xr}),j=new ji,Y={},ie=h.maxTextureSize,H={[$i]:ln,[ln]:$i,[Ki]:Ki},X=new tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new jt},radius:{value:4}},vertexShader:Ci,fragmentShader:Vl}),$=X.clone();$.defines.HORIZONTAL_PASS=1;const ge=new ai;ge.setAttribute("position",new Qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const ae=new Tn(ge,X),C=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ma;let v=this.type;this.render=function(ee,te,ve){if(C.enabled===!1||C.autoUpdate===!1&&C.needsUpdate===!1||ee.length===0)return;const L=o.getRenderTarget(),P=o.getActiveCubeFace(),Z=o.getActiveMipmapLevel(),fe=o.state;fe.setBlending(Gn),fe.buffers.depth.getReversed()===!0?fe.buffers.color.setClear(0,0,0,0):fe.buffers.color.setClear(1,1,1,1),fe.buffers.depth.setTest(!0),fe.setScissorTest(!1);const Ae=v!==Ji&&this.type===Ji,we=v===Ji&&this.type!==Ji;for(let Se=0,be=ee.length;Se<be;Se++){const De=ee[Se],_e=De.shadow;if(_e===void 0){console.warn("THREE.WebGLShadowMap:",De,"has no shadow.");continue}if(_e.autoUpdate===!1&&_e.needsUpdate===!1)continue;A.copy(_e.mapSize);const ot=_e.getFrameExtents();if(A.multiply(ot),b.copy(_e.mapSize),(A.x>ie||A.y>ie)&&(A.x>ie&&(b.x=Math.floor(ie/ot.x),A.x=b.x*ot.x,_e.mapSize.x=b.x),A.y>ie&&(b.y=Math.floor(ie/ot.y),A.y=b.y*ot.y,_e.mapSize.y=b.y)),_e.map===null||Ae===!0||we===!0){const Ht=this.type!==Ji?{minFilter:$n,magFilter:$n}:{};_e.map!==null&&_e.map.dispose(),_e.map=new yn(A.x,A.y,Ht),_e.map.texture.name=De.name+".shadowMap",_e.camera.updateProjectionMatrix()}o.setRenderTarget(_e.map),o.clear();const yt=_e.getViewportCount();for(let Ht=0;Ht<yt;Ht++){const un=_e.getViewport(Ht);N.set(b.x*un.x,b.y*un.y,b.x*un.z,b.y*un.w),fe.viewport(N),_e.updateMatrices(De,Ht),x=_e.getFrustum(),k(te,ve,_e.camera,De,this.type)}_e.isPointLightShadow!==!0&&this.type===Ji&&re(_e,ve),_e.needsUpdate=!1}v=this.type,C.needsUpdate=!1,o.setRenderTarget(L,P,Z)};function re(ee,te){const ve=f.update(ae);X.defines.VSM_SAMPLES!==ee.blurSamples&&(X.defines.VSM_SAMPLES=ee.blurSamples,$.defines.VSM_SAMPLES=ee.blurSamples,X.needsUpdate=!0,$.needsUpdate=!0),ee.mapPass===null&&(ee.mapPass=new yn(A.x,A.y)),X.uniforms.shadow_pass.value=ee.map.texture,X.uniforms.resolution.value=ee.mapSize,X.uniforms.radius.value=ee.radius,o.setRenderTarget(ee.mapPass),o.clear(),o.renderBufferDirect(te,null,ve,X,ae,null),$.uniforms.shadow_pass.value=ee.mapPass.texture,$.uniforms.resolution.value=ee.mapSize,$.uniforms.radius.value=ee.radius,o.setRenderTarget(ee.map),o.clear(),o.renderBufferDirect(te,null,ve,$,ae,null)}function J(ee,te,ve,L){let P=null;const Z=ve.isPointLight===!0?ee.customDistanceMaterial:ee.customDepthMaterial;if(Z!==void 0)P=Z;else if(P=ve.isPointLight===!0?j:R,o.localClippingEnabled&&te.clipShadows===!0&&Array.isArray(te.clippingPlanes)&&te.clippingPlanes.length!==0||te.displacementMap&&te.displacementScale!==0||te.alphaMap&&te.alphaTest>0||te.map&&te.alphaTest>0||te.alphaToCoverage===!0){const fe=P.uuid,Ae=te.uuid;let we=Y[fe];we===void 0&&(we={},Y[fe]=we);let Se=we[Ae];Se===void 0&&(Se=P.clone(),we[Ae]=Se,te.addEventListener("dispose",he)),P=Se}if(P.visible=te.visible,P.wireframe=te.wireframe,L===Ji?P.side=te.shadowSide!==null?te.shadowSide:te.side:P.side=te.shadowSide!==null?te.shadowSide:H[te.side],P.alphaMap=te.alphaMap,P.alphaTest=te.alphaToCoverage===!0?.5:te.alphaTest,P.map=te.map,P.clipShadows=te.clipShadows,P.clippingPlanes=te.clippingPlanes,P.clipIntersection=te.clipIntersection,P.displacementMap=te.displacementMap,P.displacementScale=te.displacementScale,P.displacementBias=te.displacementBias,P.wireframeLinewidth=te.wireframeLinewidth,P.linewidth=te.linewidth,ve.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const fe=o.properties.get(P);fe.light=ve}return P}function k(ee,te,ve,L,P){if(ee.visible===!1)return;if(ee.layers.test(te.layers)&&(ee.isMesh||ee.isLine||ee.isPoints)&&(ee.castShadow||ee.receiveShadow&&P===Ji)&&(!ee.frustumCulled||x.intersectsObject(ee))){ee.modelViewMatrix.multiplyMatrices(ve.matrixWorldInverse,ee.matrixWorld);const Ae=f.update(ee),we=ee.material;if(Array.isArray(we)){const Se=Ae.groups;for(let be=0,De=Se.length;be<De;be++){const _e=Se[be],ot=we[_e.materialIndex];if(ot&&ot.visible){const yt=J(ee,ot,L,P);ee.onBeforeShadow(o,ee,te,ve,Ae,yt,_e),o.renderBufferDirect(ve,null,Ae,yt,ee,_e),ee.onAfterShadow(o,ee,te,ve,Ae,yt,_e)}}}else if(we.visible){const Se=J(ee,we,L,P);ee.onBeforeShadow(o,ee,te,ve,Ae,Se,null),o.renderBufferDirect(ve,null,Ae,Se,ee,null),ee.onAfterShadow(o,ee,te,ve,Ae,Se,null)}}const fe=ee.children;for(let Ae=0,we=fe.length;Ae<we;Ae++)k(fe[Ae],te,ve,L,P)}function he(ee){ee.target.removeEventListener("dispose",he);for(const ve in Y){const L=Y[ve],P=ee.target.uuid;P in L&&(L[P].dispose(),delete L[P])}}}const fa={[Ss]:Ms,[Qr]:Fr,[zi]:bi,[Ys]:Pi,[Ms]:Ss,[Fr]:Qr,[bi]:zi,[Pi]:Ys};function Wh(o,f){function h(){let G=!1;const Ne=new Zn;let Ge=null;const Qe=new Zn(0,0,0,0);return{setMask:function(Ue){Ge!==Ue&&!G&&(o.colorMask(Ue,Ue,Ue,Ue),Ge=Ue)},setLocked:function(Ue){G=Ue},setClear:function(Ue,ue,je,Nt,gn){gn===!0&&(Ue*=Nt,ue*=Nt,je*=Nt),Ne.set(Ue,ue,je,Nt),Qe.equals(Ne)===!1&&(o.clearColor(Ue,ue,je,Nt),Qe.copy(Ne))},reset:function(){G=!1,Ge=null,Qe.set(-1,0,0,0)}}}function x(){let G=!1,Ne=!1,Ge=null,Qe=null,Ue=null;return{setReversed:function(ue){if(Ne!==ue){const je=f.get("EXT_clip_control");ue?je.clipControlEXT(je.LOWER_LEFT_EXT,je.ZERO_TO_ONE_EXT):je.clipControlEXT(je.LOWER_LEFT_EXT,je.NEGATIVE_ONE_TO_ONE_EXT),Ne=ue;const Nt=Ue;Ue=null,this.setClear(Nt)}},getReversed:function(){return Ne},setTest:function(ue){ue?Ee(o.DEPTH_TEST):rt(o.DEPTH_TEST)},setMask:function(ue){Ge!==ue&&!G&&(o.depthMask(ue),Ge=ue)},setFunc:function(ue){if(Ne&&(ue=fa[ue]),Qe!==ue){switch(ue){case Ss:o.depthFunc(o.NEVER);break;case Ms:o.depthFunc(o.ALWAYS);break;case Qr:o.depthFunc(o.LESS);break;case Ys:o.depthFunc(o.LEQUAL);break;case zi:o.depthFunc(o.EQUAL);break;case Pi:o.depthFunc(o.GEQUAL);break;case Fr:o.depthFunc(o.GREATER);break;case bi:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Qe=ue}},setLocked:function(ue){G=ue},setClear:function(ue){Ue!==ue&&(Ne&&(ue=1-ue),o.clearDepth(ue),Ue=ue)},reset:function(){G=!1,Ge=null,Qe=null,Ue=null,Ne=!1}}}function A(){let G=!1,Ne=null,Ge=null,Qe=null,Ue=null,ue=null,je=null,Nt=null,gn=null;return{setTest:function(an){G||(an?Ee(o.STENCIL_TEST):rt(o.STENCIL_TEST))},setMask:function(an){Ne!==an&&!G&&(o.stencilMask(an),Ne=an)},setFunc:function(an,ps,Xi){(Ge!==an||Qe!==ps||Ue!==Xi)&&(o.stencilFunc(an,ps,Xi),Ge=an,Qe=ps,Ue=Xi)},setOp:function(an,ps,Xi){(ue!==an||je!==ps||Nt!==Xi)&&(o.stencilOp(an,ps,Xi),ue=an,je=ps,Nt=Xi)},setLocked:function(an){G=an},setClear:function(an){gn!==an&&(o.clearStencil(an),gn=an)},reset:function(){G=!1,Ne=null,Ge=null,Qe=null,Ue=null,ue=null,je=null,Nt=null,gn=null}}}const b=new h,N=new x,R=new A,j=new WeakMap,Y=new WeakMap;let ie={},H={},X=new WeakMap,$=[],ge=null,ae=!1,C=null,v=null,re=null,J=null,k=null,he=null,ee=null,te=new Dt(0,0,0),ve=0,L=!1,P=null,Z=null,fe=null,Ae=null,we=null;const Se=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let be=!1,De=0;const _e=o.getParameter(o.VERSION);_e.indexOf("WebGL")!==-1?(De=parseFloat(/^WebGL (\d)/.exec(_e)[1]),be=De>=1):_e.indexOf("OpenGL ES")!==-1&&(De=parseFloat(/^OpenGL ES (\d)/.exec(_e)[1]),be=De>=2);let ot=null,yt={};const Ht=o.getParameter(o.SCISSOR_BOX),un=o.getParameter(o.VIEWPORT),Xn=new Zn().fromArray(Ht),qn=new Zn().fromArray(un);function bn(G,Ne,Ge,Qe){const Ue=new Uint8Array(4),ue=o.createTexture();o.bindTexture(G,ue),o.texParameteri(G,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(G,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let je=0;je<Ge;je++)G===o.TEXTURE_3D||G===o.TEXTURE_2D_ARRAY?o.texImage3D(Ne,0,o.RGBA,1,1,Qe,0,o.RGBA,o.UNSIGNED_BYTE,Ue):o.texImage2D(Ne+je,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Ue);return ue}const Me={};Me[o.TEXTURE_2D]=bn(o.TEXTURE_2D,o.TEXTURE_2D,1),Me[o.TEXTURE_CUBE_MAP]=bn(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),Me[o.TEXTURE_2D_ARRAY]=bn(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Me[o.TEXTURE_3D]=bn(o.TEXTURE_3D,o.TEXTURE_3D,1,1),b.setClear(0,0,0,1),N.setClear(1),R.setClear(0),Ee(o.DEPTH_TEST),N.setFunc(Ys),Ct(!1),st(bs),Ee(o.CULL_FACE),In(Gn);function Ee(G){ie[G]!==!0&&(o.enable(G),ie[G]=!0)}function rt(G){ie[G]!==!1&&(o.disable(G),ie[G]=!1)}function Lt(G,Ne){return H[G]!==Ne?(o.bindFramebuffer(G,Ne),H[G]=Ne,G===o.DRAW_FRAMEBUFFER&&(H[o.FRAMEBUFFER]=Ne),G===o.FRAMEBUFFER&&(H[o.DRAW_FRAMEBUFFER]=Ne),!0):!1}function pt(G,Ne){let Ge=$,Qe=!1;if(G){Ge=X.get(Ne),Ge===void 0&&(Ge=[],X.set(Ne,Ge));const Ue=G.textures;if(Ge.length!==Ue.length||Ge[0]!==o.COLOR_ATTACHMENT0){for(let ue=0,je=Ue.length;ue<je;ue++)Ge[ue]=o.COLOR_ATTACHMENT0+ue;Ge.length=Ue.length,Qe=!0}}else Ge[0]!==o.BACK&&(Ge[0]=o.BACK,Qe=!0);Qe&&o.drawBuffers(Ge)}function nn(G){return ge!==G?(o.useProgram(G),ge=G,!0):!1}const ei={[Lr]:o.FUNC_ADD,[Pr]:o.FUNC_SUBTRACT,[Ir]:o.FUNC_REVERSE_SUBTRACT};ei[co]=o.MIN,ei[hi]=o.MAX;const O={[yr]:o.ZERO,[Js]:o.ONE,[Si]:o.SRC_COLOR,[Ur]:o.SRC_ALPHA,[er]:o.SRC_ALPHA_SATURATE,[hr]:o.DST_COLOR,[On]:o.DST_ALPHA,[oo]:o.ONE_MINUS_SRC_COLOR,[Dr]:o.ONE_MINUS_SRC_ALPHA,[$s]:o.ONE_MINUS_DST_COLOR,[ao]:o.ONE_MINUS_DST_ALPHA,[Zs]:o.CONSTANT_COLOR,[vs]:o.ONE_MINUS_CONSTANT_COLOR,[ba]:o.CONSTANT_ALPHA,[ys]:o.ONE_MINUS_CONSTANT_ALPHA};function In(G,Ne,Ge,Qe,Ue,ue,je,Nt,gn,an){if(G===Gn){ae===!0&&(rt(o.BLEND),ae=!1);return}if(ae===!1&&(Ee(o.BLEND),ae=!0),G!==Ta){if(G!==C||an!==L){if((v!==Lr||k!==Lr)&&(o.blendEquation(o.FUNC_ADD),v=Lr,k=Lr),an)switch(G){case Qi:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Ts:o.blendFunc(o.ONE,o.ONE);break;case ts:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case es:o.blendFuncSeparate(o.DST_COLOR,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Qi:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Ts:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE,o.ONE,o.ONE);break;case ts:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case es:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}re=null,J=null,he=null,ee=null,te.set(0,0,0),ve=0,C=G,L=an}return}Ue=Ue||Ne,ue=ue||Ge,je=je||Qe,(Ne!==v||Ue!==k)&&(o.blendEquationSeparate(ei[Ne],ei[Ue]),v=Ne,k=Ue),(Ge!==re||Qe!==J||ue!==he||je!==ee)&&(o.blendFuncSeparate(O[Ge],O[Qe],O[ue],O[je]),re=Ge,J=Qe,he=ue,ee=je),(Nt.equals(te)===!1||gn!==ve)&&(o.blendColor(Nt.r,Nt.g,Nt.b,gn),te.copy(Nt),ve=gn),C=G,L=!1}function Ft(G,Ne){G.side===Ki?rt(o.CULL_FACE):Ee(o.CULL_FACE);let Ge=G.side===ln;Ne&&(Ge=!Ge),Ct(Ge),G.blending===Qi&&G.transparent===!1?In(Gn):In(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),N.setFunc(G.depthFunc),N.setTest(G.depthTest),N.setMask(G.depthWrite),b.setMask(G.colorWrite);const Qe=G.stencilWrite;R.setTest(Qe),Qe&&(R.setMask(G.stencilWriteMask),R.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),R.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),at(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?Ee(o.SAMPLE_ALPHA_TO_COVERAGE):rt(o.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(G){P!==G&&(G?o.frontFace(o.CW):o.frontFace(o.CCW),P=G)}function st(G){G!==lo?(Ee(o.CULL_FACE),G!==Z&&(G===bs?o.cullFace(o.BACK):G===jr?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):rt(o.CULL_FACE),Z=G}function En(G){G!==fe&&(be&&o.lineWidth(G),fe=G)}function at(G,Ne,Ge){G?(Ee(o.POLYGON_OFFSET_FILL),(Ae!==Ne||we!==Ge)&&(o.polygonOffset(Ne,Ge),Ae=Ne,we=Ge)):rt(o.POLYGON_OFFSET_FILL)}function Gt(G){G?Ee(o.SCISSOR_TEST):rt(o.SCISSOR_TEST)}function li(G){G===void 0&&(G=o.TEXTURE0+Se-1),ot!==G&&(o.activeTexture(G),ot=G)}function Dn(G,Ne,Ge){Ge===void 0&&(ot===null?Ge=o.TEXTURE0+Se-1:Ge=ot);let Qe=yt[Ge];Qe===void 0&&(Qe={type:void 0,texture:void 0},yt[Ge]=Qe),(Qe.type!==G||Qe.texture!==Ne)&&(ot!==Ge&&(o.activeTexture(Ge),ot=Ge),o.bindTexture(G,Ne||Me[G]),Qe.type=G,Qe.texture=Ne)}function I(){const G=yt[ot];G!==void 0&&G.type!==void 0&&(o.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function S(){try{o.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function K(){try{o.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function pe(){try{o.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Te(){try{o.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function me(){try{o.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ut(){try{o.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ze(){try{o.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function lt(){try{o.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ct(){try{o.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Fe(){try{o.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ze(G){Xn.equals(G)===!1&&(o.scissor(G.x,G.y,G.z,G.w),Xn.copy(G))}function Rt(G){qn.equals(G)===!1&&(o.viewport(G.x,G.y,G.z,G.w),qn.copy(G))}function ht(G,Ne){let Ge=Y.get(Ne);Ge===void 0&&(Ge=new WeakMap,Y.set(Ne,Ge));let Qe=Ge.get(G);Qe===void 0&&(Qe=o.getUniformBlockIndex(Ne,G.name),Ge.set(G,Qe))}function qe(G,Ne){const Qe=Y.get(Ne).get(G);j.get(Ne)!==Qe&&(o.uniformBlockBinding(Ne,Qe,G.__bindingPointIndex),j.set(Ne,Qe))}function Wt(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),N.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),ie={},ot=null,yt={},H={},X=new WeakMap,$=[],ge=null,ae=!1,C=null,v=null,re=null,J=null,k=null,he=null,ee=null,te=new Dt(0,0,0),ve=0,L=!1,P=null,Z=null,fe=null,Ae=null,we=null,Xn.set(0,0,o.canvas.width,o.canvas.height),qn.set(0,0,o.canvas.width,o.canvas.height),b.reset(),N.reset(),R.reset()}return{buffers:{color:b,depth:N,stencil:R},enable:Ee,disable:rt,bindFramebuffer:Lt,drawBuffers:pt,useProgram:nn,setBlending:In,setMaterial:Ft,setFlipSided:Ct,setCullFace:st,setLineWidth:En,setPolygonOffset:at,setScissorTest:Gt,activeTexture:li,bindTexture:Dn,unbindTexture:I,compressedTexImage2D:S,compressedTexImage3D:K,texImage2D:ct,texImage3D:Fe,updateUBOMapping:ht,uniformBlockBinding:qe,texStorage2D:ze,texStorage3D:lt,texSubImage2D:pe,texSubImage3D:Te,compressedTexSubImage2D:me,compressedTexSubImage3D:ut,scissor:Ze,viewport:Rt,reset:Wt}}function Fi(o,f,h,x,A,b,N){const R=f.has("WEBGL_multisampled_render_to_texture")?f.get("WEBGL_multisampled_render_to_texture"):null,j=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),Y=new jt,ie=new WeakMap;let H;const X=new WeakMap;let $=!1;try{$=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function ge(I,S){return $?new OffscreenCanvas(I,S):js("canvas")}function ae(I,S,K){let pe=1;const Te=Dn(I);if((Te.width>K||Te.height>K)&&(pe=K/Math.max(Te.width,Te.height)),pe<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const me=Math.floor(pe*Te.width),ut=Math.floor(pe*Te.height);H===void 0&&(H=ge(me,ut));const ze=S?ge(me,ut):H;return ze.width=me,ze.height=ut,ze.getContext("2d").drawImage(I,0,0,me,ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Te.width+"x"+Te.height+") to ("+me+"x"+ut+")."),ze}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Te.width+"x"+Te.height+")."),I;return I}function C(I){return I.generateMipmaps}function v(I){o.generateMipmap(I)}function re(I){return I.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?o.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function J(I,S,K,pe,Te=!1){if(I!==null){if(o[I]!==void 0)return o[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let me=S;if(S===o.RED&&(K===o.FLOAT&&(me=o.R32F),K===o.HALF_FLOAT&&(me=o.R16F),K===o.UNSIGNED_BYTE&&(me=o.R8)),S===o.RED_INTEGER&&(K===o.UNSIGNED_BYTE&&(me=o.R8UI),K===o.UNSIGNED_SHORT&&(me=o.R16UI),K===o.UNSIGNED_INT&&(me=o.R32UI),K===o.BYTE&&(me=o.R8I),K===o.SHORT&&(me=o.R16I),K===o.INT&&(me=o.R32I)),S===o.RG&&(K===o.FLOAT&&(me=o.RG32F),K===o.HALF_FLOAT&&(me=o.RG16F),K===o.UNSIGNED_BYTE&&(me=o.RG8)),S===o.RG_INTEGER&&(K===o.UNSIGNED_BYTE&&(me=o.RG8UI),K===o.UNSIGNED_SHORT&&(me=o.RG16UI),K===o.UNSIGNED_INT&&(me=o.RG32UI),K===o.BYTE&&(me=o.RG8I),K===o.SHORT&&(me=o.RG16I),K===o.INT&&(me=o.RG32I)),S===o.RGB_INTEGER&&(K===o.UNSIGNED_BYTE&&(me=o.RGB8UI),K===o.UNSIGNED_SHORT&&(me=o.RGB16UI),K===o.UNSIGNED_INT&&(me=o.RGB32UI),K===o.BYTE&&(me=o.RGB8I),K===o.SHORT&&(me=o.RGB16I),K===o.INT&&(me=o.RGB32I)),S===o.RGBA_INTEGER&&(K===o.UNSIGNED_BYTE&&(me=o.RGBA8UI),K===o.UNSIGNED_SHORT&&(me=o.RGBA16UI),K===o.UNSIGNED_INT&&(me=o.RGBA32UI),K===o.BYTE&&(me=o.RGBA8I),K===o.SHORT&&(me=o.RGBA16I),K===o.INT&&(me=o.RGBA32I)),S===o.RGB&&(K===o.UNSIGNED_INT_5_9_9_9_REV&&(me=o.RGB9_E5),K===o.UNSIGNED_INT_10F_11F_11F_REV&&(me=o.R11F_G11F_B10F)),S===o.RGBA){const ut=Te?xs:Xe.getTransfer(pe);K===o.FLOAT&&(me=o.RGBA32F),K===o.HALF_FLOAT&&(me=o.RGBA16F),K===o.UNSIGNED_BYTE&&(me=ut===Ut?o.SRGB8_ALPHA8:o.RGBA8),K===o.UNSIGNED_SHORT_4_4_4_4&&(me=o.RGBA4),K===o.UNSIGNED_SHORT_5_5_5_1&&(me=o.RGB5_A1)}return(me===o.R16F||me===o.R32F||me===o.RG16F||me===o.RG32F||me===o.RGBA16F||me===o.RGBA32F)&&f.get("EXT_color_buffer_float"),me}function k(I,S){let K;return I?S===null||S===ss||S===Br?K=o.DEPTH24_STENCIL8:S===Ce?K=o.DEPTH32F_STENCIL8:S===Es&&(K=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ss||S===Br?K=o.DEPTH_COMPONENT24:S===Ce?K=o.DEPTH_COMPONENT32F:S===Es&&(K=o.DEPTH_COMPONENT16),K}function he(I,S){return C(I)===!0||I.isFramebufferTexture&&I.minFilter!==$n&&I.minFilter!==fi?Math.log2(Math.max(S.width,S.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?S.mipmaps.length:1}function ee(I){const S=I.target;S.removeEventListener("dispose",ee),ve(S),S.isVideoTexture&&ie.delete(S)}function te(I){const S=I.target;S.removeEventListener("dispose",te),P(S)}function ve(I){const S=x.get(I);if(S.__webglInit===void 0)return;const K=I.source,pe=X.get(K);if(pe){const Te=pe[S.__cacheKey];Te.usedTimes--,Te.usedTimes===0&&L(I),Object.keys(pe).length===0&&X.delete(K)}x.remove(I)}function L(I){const S=x.get(I);o.deleteTexture(S.__webglTexture);const K=I.source,pe=X.get(K);delete pe[S.__cacheKey],N.memory.textures--}function P(I){const S=x.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),x.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(S.__webglFramebuffer[pe]))for(let Te=0;Te<S.__webglFramebuffer[pe].length;Te++)o.deleteFramebuffer(S.__webglFramebuffer[pe][Te]);else o.deleteFramebuffer(S.__webglFramebuffer[pe]);S.__webglDepthbuffer&&o.deleteRenderbuffer(S.__webglDepthbuffer[pe])}else{if(Array.isArray(S.__webglFramebuffer))for(let pe=0;pe<S.__webglFramebuffer.length;pe++)o.deleteFramebuffer(S.__webglFramebuffer[pe]);else o.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&o.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&o.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let pe=0;pe<S.__webglColorRenderbuffer.length;pe++)S.__webglColorRenderbuffer[pe]&&o.deleteRenderbuffer(S.__webglColorRenderbuffer[pe]);S.__webglDepthRenderbuffer&&o.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const K=I.textures;for(let pe=0,Te=K.length;pe<Te;pe++){const me=x.get(K[pe]);me.__webglTexture&&(o.deleteTexture(me.__webglTexture),N.memory.textures--),x.remove(K[pe])}x.remove(I)}let Z=0;function fe(){Z=0}function Ae(){const I=Z;return I>=A.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+A.maxTextures),Z+=1,I}function we(I){const S=[];return S.push(I.wrapS),S.push(I.wrapT),S.push(I.wrapR||0),S.push(I.magFilter),S.push(I.minFilter),S.push(I.anisotropy),S.push(I.internalFormat),S.push(I.format),S.push(I.type),S.push(I.generateMipmaps),S.push(I.premultiplyAlpha),S.push(I.flipY),S.push(I.unpackAlignment),S.push(I.colorSpace),S.join()}function Se(I,S){const K=x.get(I);if(I.isVideoTexture&&Gt(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&K.__version!==I.version){const pe=I.image;if(pe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Me(K,I,S);return}}else I.isExternalTexture&&(K.__webglTexture=I.sourceTexture?I.sourceTexture:null);h.bindTexture(o.TEXTURE_2D,K.__webglTexture,o.TEXTURE0+S)}function be(I,S){const K=x.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){Me(K,I,S);return}h.bindTexture(o.TEXTURE_2D_ARRAY,K.__webglTexture,o.TEXTURE0+S)}function De(I,S){const K=x.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){Me(K,I,S);return}h.bindTexture(o.TEXTURE_3D,K.__webglTexture,o.TEXTURE0+S)}function _e(I,S){const K=x.get(I);if(I.version>0&&K.__version!==I.version){Ee(K,I,S);return}h.bindTexture(o.TEXTURE_CUBE_MAP,K.__webglTexture,o.TEXTURE0+S)}const ot={[uo]:o.REPEAT,[ho]:o.CLAMP_TO_EDGE,[Ks]:o.MIRRORED_REPEAT},yt={[$n]:o.NEAREST,[fo]:o.NEAREST_MIPMAP_NEAREST,[As]:o.NEAREST_MIPMAP_LINEAR,[fi]:o.LINEAR,[Qs]:o.LINEAR_MIPMAP_NEAREST,[ns]:o.LINEAR_MIPMAP_LINEAR},Ht={[ur]:o.NEVER,[Nr]:o.ALWAYS,[Ea]:o.LESS,[vi]:o.LEQUAL,[vr]:o.EQUAL,[mo]:o.GEQUAL,[po]:o.GREATER,[Aa]:o.NOTEQUAL};function un(I,S){if(S.type===Ce&&f.has("OES_texture_float_linear")===!1&&(S.magFilter===fi||S.magFilter===Qs||S.magFilter===As||S.magFilter===ns||S.minFilter===fi||S.minFilter===Qs||S.minFilter===As||S.minFilter===ns)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(I,o.TEXTURE_WRAP_S,ot[S.wrapS]),o.texParameteri(I,o.TEXTURE_WRAP_T,ot[S.wrapT]),(I===o.TEXTURE_3D||I===o.TEXTURE_2D_ARRAY)&&o.texParameteri(I,o.TEXTURE_WRAP_R,ot[S.wrapR]),o.texParameteri(I,o.TEXTURE_MAG_FILTER,yt[S.magFilter]),o.texParameteri(I,o.TEXTURE_MIN_FILTER,yt[S.minFilter]),S.compareFunction&&(o.texParameteri(I,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(I,o.TEXTURE_COMPARE_FUNC,Ht[S.compareFunction])),f.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===$n||S.minFilter!==As&&S.minFilter!==ns||S.type===Ce&&f.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||x.get(S).__currentAnisotropy){const K=f.get("EXT_texture_filter_anisotropic");o.texParameterf(I,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,A.getMaxAnisotropy())),x.get(S).__currentAnisotropy=S.anisotropy}}}function Xn(I,S){let K=!1;I.__webglInit===void 0&&(I.__webglInit=!0,S.addEventListener("dispose",ee));const pe=S.source;let Te=X.get(pe);Te===void 0&&(Te={},X.set(pe,Te));const me=we(S);if(me!==I.__cacheKey){Te[me]===void 0&&(Te[me]={texture:o.createTexture(),usedTimes:0},N.memory.textures++,K=!0),Te[me].usedTimes++;const ut=Te[I.__cacheKey];ut!==void 0&&(Te[I.__cacheKey].usedTimes--,ut.usedTimes===0&&L(S)),I.__cacheKey=me,I.__webglTexture=Te[me].texture}return K}function qn(I,S,K){return Math.floor(Math.floor(I/K)/S)}function bn(I,S,K,pe){const me=I.updateRanges;if(me.length===0)h.texSubImage2D(o.TEXTURE_2D,0,0,0,S.width,S.height,K,pe,S.data);else{me.sort((Fe,Ze)=>Fe.start-Ze.start);let ut=0;for(let Fe=1;Fe<me.length;Fe++){const Ze=me[ut],Rt=me[Fe],ht=Ze.start+Ze.count,qe=qn(Rt.start,S.width,4),Wt=qn(Ze.start,S.width,4);Rt.start<=ht+1&&qe===Wt&&qn(Rt.start+Rt.count-1,S.width,4)===qe?Ze.count=Math.max(Ze.count,Rt.start+Rt.count-Ze.start):(++ut,me[ut]=Rt)}me.length=ut+1;const ze=o.getParameter(o.UNPACK_ROW_LENGTH),lt=o.getParameter(o.UNPACK_SKIP_PIXELS),ct=o.getParameter(o.UNPACK_SKIP_ROWS);o.pixelStorei(o.UNPACK_ROW_LENGTH,S.width);for(let Fe=0,Ze=me.length;Fe<Ze;Fe++){const Rt=me[Fe],ht=Math.floor(Rt.start/4),qe=Math.ceil(Rt.count/4),Wt=ht%S.width,G=Math.floor(ht/S.width),Ne=qe,Ge=1;o.pixelStorei(o.UNPACK_SKIP_PIXELS,Wt),o.pixelStorei(o.UNPACK_SKIP_ROWS,G),h.texSubImage2D(o.TEXTURE_2D,0,Wt,G,Ne,Ge,K,pe,S.data)}I.clearUpdateRanges(),o.pixelStorei(o.UNPACK_ROW_LENGTH,ze),o.pixelStorei(o.UNPACK_SKIP_PIXELS,lt),o.pixelStorei(o.UNPACK_SKIP_ROWS,ct)}}function Me(I,S,K){let pe=o.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(pe=o.TEXTURE_2D_ARRAY),S.isData3DTexture&&(pe=o.TEXTURE_3D);const Te=Xn(I,S),me=S.source;h.bindTexture(pe,I.__webglTexture,o.TEXTURE0+K);const ut=x.get(me);if(me.version!==ut.__version||Te===!0){h.activeTexture(o.TEXTURE0+K);const ze=Xe.getPrimaries(Xe.workingColorSpace),lt=S.colorSpace===dr?null:Xe.getPrimaries(S.colorSpace),ct=S.colorSpace===dr||ze===lt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,S.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,S.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);let Fe=ae(S.image,!1,A.maxTextureSize);Fe=li(S,Fe);const Ze=b.convert(S.format,S.colorSpace),Rt=b.convert(S.type);let ht=J(S.internalFormat,Ze,Rt,S.colorSpace,S.isVideoTexture);un(pe,S);let qe;const Wt=S.mipmaps,G=S.isVideoTexture!==!0,Ne=ut.__version===void 0||Te===!0,Ge=me.dataReady,Qe=he(S,Fe);if(S.isDepthTexture)ht=k(S.format===is,S.type),Ne&&(G?h.texStorage2D(o.TEXTURE_2D,1,ht,Fe.width,Fe.height):h.texImage2D(o.TEXTURE_2D,0,ht,Fe.width,Fe.height,0,Ze,Rt,null));else if(S.isDataTexture)if(Wt.length>0){G&&Ne&&h.texStorage2D(o.TEXTURE_2D,Qe,ht,Wt[0].width,Wt[0].height);for(let Ue=0,ue=Wt.length;Ue<ue;Ue++)qe=Wt[Ue],G?Ge&&h.texSubImage2D(o.TEXTURE_2D,Ue,0,0,qe.width,qe.height,Ze,Rt,qe.data):h.texImage2D(o.TEXTURE_2D,Ue,ht,qe.width,qe.height,0,Ze,Rt,qe.data);S.generateMipmaps=!1}else G?(Ne&&h.texStorage2D(o.TEXTURE_2D,Qe,ht,Fe.width,Fe.height),Ge&&bn(S,Fe,Ze,Rt)):h.texImage2D(o.TEXTURE_2D,0,ht,Fe.width,Fe.height,0,Ze,Rt,Fe.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){G&&Ne&&h.texStorage3D(o.TEXTURE_2D_ARRAY,Qe,ht,Wt[0].width,Wt[0].height,Fe.depth);for(let Ue=0,ue=Wt.length;Ue<ue;Ue++)if(qe=Wt[Ue],S.format!==He)if(Ze!==null)if(G){if(Ge)if(S.layerUpdates.size>0){const je=go(qe.width,qe.height,S.format,S.type);for(const Nt of S.layerUpdates){const gn=qe.data.subarray(Nt*je/qe.data.BYTES_PER_ELEMENT,(Nt+1)*je/qe.data.BYTES_PER_ELEMENT);h.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,Ue,0,0,Nt,qe.width,qe.height,1,Ze,gn)}S.clearLayerUpdates()}else h.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,Ue,0,0,0,qe.width,qe.height,Fe.depth,Ze,qe.data)}else h.compressedTexImage3D(o.TEXTURE_2D_ARRAY,Ue,ht,qe.width,qe.height,Fe.depth,0,qe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Ge&&h.texSubImage3D(o.TEXTURE_2D_ARRAY,Ue,0,0,0,qe.width,qe.height,Fe.depth,Ze,Rt,qe.data):h.texImage3D(o.TEXTURE_2D_ARRAY,Ue,ht,qe.width,qe.height,Fe.depth,0,Ze,Rt,qe.data)}else{G&&Ne&&h.texStorage2D(o.TEXTURE_2D,Qe,ht,Wt[0].width,Wt[0].height);for(let Ue=0,ue=Wt.length;Ue<ue;Ue++)qe=Wt[Ue],S.format!==He?Ze!==null?G?Ge&&h.compressedTexSubImage2D(o.TEXTURE_2D,Ue,0,0,qe.width,qe.height,Ze,qe.data):h.compressedTexImage2D(o.TEXTURE_2D,Ue,ht,qe.width,qe.height,0,qe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Ge&&h.texSubImage2D(o.TEXTURE_2D,Ue,0,0,qe.width,qe.height,Ze,Rt,qe.data):h.texImage2D(o.TEXTURE_2D,Ue,ht,qe.width,qe.height,0,Ze,Rt,qe.data)}else if(S.isDataArrayTexture)if(G){if(Ne&&h.texStorage3D(o.TEXTURE_2D_ARRAY,Qe,ht,Fe.width,Fe.height,Fe.depth),Ge)if(S.layerUpdates.size>0){const Ue=go(Fe.width,Fe.height,S.format,S.type);for(const ue of S.layerUpdates){const je=Fe.data.subarray(ue*Ue/Fe.data.BYTES_PER_ELEMENT,(ue+1)*Ue/Fe.data.BYTES_PER_ELEMENT);h.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,ue,Fe.width,Fe.height,1,Ze,Rt,je)}S.clearLayerUpdates()}else h.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Fe.width,Fe.height,Fe.depth,Ze,Rt,Fe.data)}else h.texImage3D(o.TEXTURE_2D_ARRAY,0,ht,Fe.width,Fe.height,Fe.depth,0,Ze,Rt,Fe.data);else if(S.isData3DTexture)G?(Ne&&h.texStorage3D(o.TEXTURE_3D,Qe,ht,Fe.width,Fe.height,Fe.depth),Ge&&h.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Fe.width,Fe.height,Fe.depth,Ze,Rt,Fe.data)):h.texImage3D(o.TEXTURE_3D,0,ht,Fe.width,Fe.height,Fe.depth,0,Ze,Rt,Fe.data);else if(S.isFramebufferTexture){if(Ne)if(G)h.texStorage2D(o.TEXTURE_2D,Qe,ht,Fe.width,Fe.height);else{let Ue=Fe.width,ue=Fe.height;for(let je=0;je<Qe;je++)h.texImage2D(o.TEXTURE_2D,je,ht,Ue,ue,0,Ze,Rt,null),Ue>>=1,ue>>=1}}else if(Wt.length>0){if(G&&Ne){const Ue=Dn(Wt[0]);h.texStorage2D(o.TEXTURE_2D,Qe,ht,Ue.width,Ue.height)}for(let Ue=0,ue=Wt.length;Ue<ue;Ue++)qe=Wt[Ue],G?Ge&&h.texSubImage2D(o.TEXTURE_2D,Ue,0,0,Ze,Rt,qe):h.texImage2D(o.TEXTURE_2D,Ue,ht,Ze,Rt,qe);S.generateMipmaps=!1}else if(G){if(Ne){const Ue=Dn(Fe);h.texStorage2D(o.TEXTURE_2D,Qe,ht,Ue.width,Ue.height)}Ge&&h.texSubImage2D(o.TEXTURE_2D,0,0,0,Ze,Rt,Fe)}else h.texImage2D(o.TEXTURE_2D,0,ht,Ze,Rt,Fe);C(S)&&v(pe),ut.__version=me.version,S.onUpdate&&S.onUpdate(S)}I.__version=S.version}function Ee(I,S,K){if(S.image.length!==6)return;const pe=Xn(I,S),Te=S.source;h.bindTexture(o.TEXTURE_CUBE_MAP,I.__webglTexture,o.TEXTURE0+K);const me=x.get(Te);if(Te.version!==me.__version||pe===!0){h.activeTexture(o.TEXTURE0+K);const ut=Xe.getPrimaries(Xe.workingColorSpace),ze=S.colorSpace===dr?null:Xe.getPrimaries(S.colorSpace),lt=S.colorSpace===dr||ut===ze?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,S.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,S.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);const ct=S.isCompressedTexture||S.image[0].isCompressedTexture,Fe=S.image[0]&&S.image[0].isDataTexture,Ze=[];for(let ue=0;ue<6;ue++)!ct&&!Fe?Ze[ue]=ae(S.image[ue],!0,A.maxCubemapSize):Ze[ue]=Fe?S.image[ue].image:S.image[ue],Ze[ue]=li(S,Ze[ue]);const Rt=Ze[0],ht=b.convert(S.format,S.colorSpace),qe=b.convert(S.type),Wt=J(S.internalFormat,ht,qe,S.colorSpace),G=S.isVideoTexture!==!0,Ne=me.__version===void 0||pe===!0,Ge=Te.dataReady;let Qe=he(S,Rt);un(o.TEXTURE_CUBE_MAP,S);let Ue;if(ct){G&&Ne&&h.texStorage2D(o.TEXTURE_CUBE_MAP,Qe,Wt,Rt.width,Rt.height);for(let ue=0;ue<6;ue++){Ue=Ze[ue].mipmaps;for(let je=0;je<Ue.length;je++){const Nt=Ue[je];S.format!==He?ht!==null?G?Ge&&h.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je,0,0,Nt.width,Nt.height,ht,Nt.data):h.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je,Wt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je,0,0,Nt.width,Nt.height,ht,qe,Nt.data):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je,Wt,Nt.width,Nt.height,0,ht,qe,Nt.data)}}}else{if(Ue=S.mipmaps,G&&Ne){Ue.length>0&&Qe++;const ue=Dn(Ze[0]);h.texStorage2D(o.TEXTURE_CUBE_MAP,Qe,Wt,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(Fe){G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,Ze[ue].width,Ze[ue].height,ht,qe,Ze[ue].data):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Wt,Ze[ue].width,Ze[ue].height,0,ht,qe,Ze[ue].data);for(let je=0;je<Ue.length;je++){const gn=Ue[je].image[ue].image;G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je+1,0,0,gn.width,gn.height,ht,qe,gn.data):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je+1,Wt,gn.width,gn.height,0,ht,qe,gn.data)}}else{G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,ht,qe,Ze[ue]):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Wt,ht,qe,Ze[ue]);for(let je=0;je<Ue.length;je++){const Nt=Ue[je];G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je+1,0,0,ht,qe,Nt.image[ue]):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ue,je+1,Wt,ht,qe,Nt.image[ue])}}}C(S)&&v(o.TEXTURE_CUBE_MAP),me.__version=Te.version,S.onUpdate&&S.onUpdate(S)}I.__version=S.version}function rt(I,S,K,pe,Te,me){const ut=b.convert(K.format,K.colorSpace),ze=b.convert(K.type),lt=J(K.internalFormat,ut,ze,K.colorSpace),ct=x.get(S),Fe=x.get(K);if(Fe.__renderTarget=S,!ct.__hasExternalTextures){const Ze=Math.max(1,S.width>>me),Rt=Math.max(1,S.height>>me);Te===o.TEXTURE_3D||Te===o.TEXTURE_2D_ARRAY?h.texImage3D(Te,me,lt,Ze,Rt,S.depth,0,ut,ze,null):h.texImage2D(Te,me,lt,Ze,Rt,0,ut,ze,null)}h.bindFramebuffer(o.FRAMEBUFFER,I),at(S)?R.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,pe,Te,Fe.__webglTexture,0,En(S)):(Te===o.TEXTURE_2D||Te>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Te<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,pe,Te,Fe.__webglTexture,me),h.bindFramebuffer(o.FRAMEBUFFER,null)}function Lt(I,S,K){if(o.bindRenderbuffer(o.RENDERBUFFER,I),S.depthBuffer){const pe=S.depthTexture,Te=pe&&pe.isDepthTexture?pe.type:null,me=k(S.stencilBuffer,Te),ut=S.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ze=En(S);at(S)?R.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ze,me,S.width,S.height):K?o.renderbufferStorageMultisample(o.RENDERBUFFER,ze,me,S.width,S.height):o.renderbufferStorage(o.RENDERBUFFER,me,S.width,S.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,ut,o.RENDERBUFFER,I)}else{const pe=S.textures;for(let Te=0;Te<pe.length;Te++){const me=pe[Te],ut=b.convert(me.format,me.colorSpace),ze=b.convert(me.type),lt=J(me.internalFormat,ut,ze,me.colorSpace),ct=En(S);K&&at(S)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,ct,lt,S.width,S.height):at(S)?R.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ct,lt,S.width,S.height):o.renderbufferStorage(o.RENDERBUFFER,lt,S.width,S.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function pt(I,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(h.bindFramebuffer(o.FRAMEBUFFER,I),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pe=x.get(S.depthTexture);pe.__renderTarget=S,(!pe.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Se(S.depthTexture,0);const Te=pe.__webglTexture,me=En(S);if(S.depthTexture.format===rs)at(S)?R.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Te,0,me):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Te,0);else if(S.depthTexture.format===is)at(S)?R.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Te,0,me):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Te,0);else throw new Error("Unknown depthTexture format")}function nn(I){const S=x.get(I),K=I.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==I.depthTexture){const pe=I.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),pe){const Te=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,pe.removeEventListener("dispose",Te)};pe.addEventListener("dispose",Te),S.__depthDisposeCallback=Te}S.__boundDepthTexture=pe}if(I.depthTexture&&!S.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");const pe=I.texture.mipmaps;pe&&pe.length>0?pt(S.__webglFramebuffer[0],I):pt(S.__webglFramebuffer,I)}else if(K){S.__webglDepthbuffer=[];for(let pe=0;pe<6;pe++)if(h.bindFramebuffer(o.FRAMEBUFFER,S.__webglFramebuffer[pe]),S.__webglDepthbuffer[pe]===void 0)S.__webglDepthbuffer[pe]=o.createRenderbuffer(),Lt(S.__webglDepthbuffer[pe],I,!1);else{const Te=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,me=S.__webglDepthbuffer[pe];o.bindRenderbuffer(o.RENDERBUFFER,me),o.framebufferRenderbuffer(o.FRAMEBUFFER,Te,o.RENDERBUFFER,me)}}else{const pe=I.texture.mipmaps;if(pe&&pe.length>0?h.bindFramebuffer(o.FRAMEBUFFER,S.__webglFramebuffer[0]):h.bindFramebuffer(o.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=o.createRenderbuffer(),Lt(S.__webglDepthbuffer,I,!1);else{const Te=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,me=S.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,me),o.framebufferRenderbuffer(o.FRAMEBUFFER,Te,o.RENDERBUFFER,me)}}h.bindFramebuffer(o.FRAMEBUFFER,null)}function ei(I,S,K){const pe=x.get(I);S!==void 0&&rt(pe.__webglFramebuffer,I,I.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),K!==void 0&&nn(I)}function O(I){const S=I.texture,K=x.get(I),pe=x.get(S);I.addEventListener("dispose",te);const Te=I.textures,me=I.isWebGLCubeRenderTarget===!0,ut=Te.length>1;if(ut||(pe.__webglTexture===void 0&&(pe.__webglTexture=o.createTexture()),pe.__version=S.version,N.memory.textures++),me){K.__webglFramebuffer=[];for(let ze=0;ze<6;ze++)if(S.mipmaps&&S.mipmaps.length>0){K.__webglFramebuffer[ze]=[];for(let lt=0;lt<S.mipmaps.length;lt++)K.__webglFramebuffer[ze][lt]=o.createFramebuffer()}else K.__webglFramebuffer[ze]=o.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){K.__webglFramebuffer=[];for(let ze=0;ze<S.mipmaps.length;ze++)K.__webglFramebuffer[ze]=o.createFramebuffer()}else K.__webglFramebuffer=o.createFramebuffer();if(ut)for(let ze=0,lt=Te.length;ze<lt;ze++){const ct=x.get(Te[ze]);ct.__webglTexture===void 0&&(ct.__webglTexture=o.createTexture(),N.memory.textures++)}if(I.samples>0&&at(I)===!1){K.__webglMultisampledFramebuffer=o.createFramebuffer(),K.__webglColorRenderbuffer=[],h.bindFramebuffer(o.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let ze=0;ze<Te.length;ze++){const lt=Te[ze];K.__webglColorRenderbuffer[ze]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,K.__webglColorRenderbuffer[ze]);const ct=b.convert(lt.format,lt.colorSpace),Fe=b.convert(lt.type),Ze=J(lt.internalFormat,ct,Fe,lt.colorSpace,I.isXRRenderTarget===!0),Rt=En(I);o.renderbufferStorageMultisample(o.RENDERBUFFER,Rt,Ze,I.width,I.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ze,o.RENDERBUFFER,K.__webglColorRenderbuffer[ze])}o.bindRenderbuffer(o.RENDERBUFFER,null),I.depthBuffer&&(K.__webglDepthRenderbuffer=o.createRenderbuffer(),Lt(K.__webglDepthRenderbuffer,I,!0)),h.bindFramebuffer(o.FRAMEBUFFER,null)}}if(me){h.bindTexture(o.TEXTURE_CUBE_MAP,pe.__webglTexture),un(o.TEXTURE_CUBE_MAP,S);for(let ze=0;ze<6;ze++)if(S.mipmaps&&S.mipmaps.length>0)for(let lt=0;lt<S.mipmaps.length;lt++)rt(K.__webglFramebuffer[ze][lt],I,S,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+ze,lt);else rt(K.__webglFramebuffer[ze],I,S,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+ze,0);C(S)&&v(o.TEXTURE_CUBE_MAP),h.unbindTexture()}else if(ut){for(let ze=0,lt=Te.length;ze<lt;ze++){const ct=Te[ze],Fe=x.get(ct);let Ze=o.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Ze=I.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),h.bindTexture(Ze,Fe.__webglTexture),un(Ze,ct),rt(K.__webglFramebuffer,I,ct,o.COLOR_ATTACHMENT0+ze,Ze,0),C(ct)&&v(Ze)}h.unbindTexture()}else{let ze=o.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(ze=I.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),h.bindTexture(ze,pe.__webglTexture),un(ze,S),S.mipmaps&&S.mipmaps.length>0)for(let lt=0;lt<S.mipmaps.length;lt++)rt(K.__webglFramebuffer[lt],I,S,o.COLOR_ATTACHMENT0,ze,lt);else rt(K.__webglFramebuffer,I,S,o.COLOR_ATTACHMENT0,ze,0);C(S)&&v(ze),h.unbindTexture()}I.depthBuffer&&nn(I)}function In(I){const S=I.textures;for(let K=0,pe=S.length;K<pe;K++){const Te=S[K];if(C(Te)){const me=re(I),ut=x.get(Te).__webglTexture;h.bindTexture(me,ut),v(me),h.unbindTexture()}}}const Ft=[],Ct=[];function st(I){if(I.samples>0){if(at(I)===!1){const S=I.textures,K=I.width,pe=I.height;let Te=o.COLOR_BUFFER_BIT;const me=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ut=x.get(I),ze=S.length>1;if(ze)for(let ct=0;ct<S.length;ct++)h.bindFramebuffer(o.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ct,o.RENDERBUFFER,null),h.bindFramebuffer(o.FRAMEBUFFER,ut.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+ct,o.TEXTURE_2D,null,0);h.bindFramebuffer(o.READ_FRAMEBUFFER,ut.__webglMultisampledFramebuffer);const lt=I.texture.mipmaps;lt&&lt.length>0?h.bindFramebuffer(o.DRAW_FRAMEBUFFER,ut.__webglFramebuffer[0]):h.bindFramebuffer(o.DRAW_FRAMEBUFFER,ut.__webglFramebuffer);for(let ct=0;ct<S.length;ct++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(Te|=o.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(Te|=o.STENCIL_BUFFER_BIT)),ze){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,ut.__webglColorRenderbuffer[ct]);const Fe=x.get(S[ct]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,Fe,0)}o.blitFramebuffer(0,0,K,pe,0,0,K,pe,Te,o.NEAREST),j===!0&&(Ft.length=0,Ct.length=0,Ft.push(o.COLOR_ATTACHMENT0+ct),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Ft.push(me),Ct.push(me),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,Ct)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,Ft))}if(h.bindFramebuffer(o.READ_FRAMEBUFFER,null),h.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),ze)for(let ct=0;ct<S.length;ct++){h.bindFramebuffer(o.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ct,o.RENDERBUFFER,ut.__webglColorRenderbuffer[ct]);const Fe=x.get(S[ct]).__webglTexture;h.bindFramebuffer(o.FRAMEBUFFER,ut.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+ct,o.TEXTURE_2D,Fe,0)}h.bindFramebuffer(o.DRAW_FRAMEBUFFER,ut.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&j){const S=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[S])}}}function En(I){return Math.min(A.maxSamples,I.samples)}function at(I){const S=x.get(I);return I.samples>0&&f.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Gt(I){const S=N.render.frame;ie.get(I)!==S&&(ie.set(I,S),I.update())}function li(I,S){const K=I.colorSpace,pe=I.format,Te=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||K!==hn&&K!==dr&&(Xe.getTransfer(K)===Ut?(pe!==He||Te!==Ke)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),S}function Dn(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(Y.width=I.naturalWidth||I.width,Y.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(Y.width=I.displayWidth,Y.height=I.displayHeight):(Y.width=I.width,Y.height=I.height),Y}this.allocateTextureUnit=Ae,this.resetTextureUnits=fe,this.setTexture2D=Se,this.setTexture2DArray=be,this.setTexture3D=De,this.setTextureCube=_e,this.rebindTextures=ei,this.setupRenderTarget=O,this.updateRenderTargetMipmap=In,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=nn,this.setupFrameBufferTexture=rt,this.useMultisampledRTT=at}function qo(o,f){function h(x,A=dr){let b;const N=Xe.getTransfer(A);if(x===Ke)return o.UNSIGNED_BYTE;if(x===ws)return o.UNSIGNED_SHORT_4_4_4_4;if(x===wa)return o.UNSIGNED_SHORT_5_5_5_1;if(x===_o)return o.UNSIGNED_INT_5_9_9_9_REV;if(x===Or)return o.UNSIGNED_INT_10F_11F_11F_REV;if(x===Gi)return o.BYTE;if(x===Cs)return o.SHORT;if(x===Es)return o.UNSIGNED_SHORT;if(x===Re)return o.INT;if(x===ss)return o.UNSIGNED_INT;if(x===Ce)return o.FLOAT;if(x===Ve)return o.HALF_FLOAT;if(x===zr)return o.ALPHA;if(x===as)return o.RGB;if(x===He)return o.RGBA;if(x===rs)return o.DEPTH_COMPONENT;if(x===is)return o.DEPTH_STENCIL;if(x===Rs)return o.RED;if(x===fr)return o.RED_INTEGER;if(x===tr)return o.RG;if(x===Gr)return o.RG_INTEGER;if(x===os)return o.RGBA_INTEGER;if(x===Mr||x===ea||x===Ca||x===Ra)if(N===Ut)if(b=f.get("WEBGL_compressed_texture_s3tc_srgb"),b!==null){if(x===Mr)return b.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(x===ea)return b.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(x===Ca)return b.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(x===Ra)return b.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(b=f.get("WEBGL_compressed_texture_s3tc"),b!==null){if(x===Mr)return b.COMPRESSED_RGB_S3TC_DXT1_EXT;if(x===ea)return b.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(x===Ca)return b.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(x===Ra)return b.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(x===Vn||x===y||x===z||x===V)if(b=f.get("WEBGL_compressed_texture_pvrtc"),b!==null){if(x===Vn)return b.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(x===y)return b.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(x===z)return b.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(x===V)return b.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(x===ne||x===ye||x===le)if(b=f.get("WEBGL_compressed_texture_etc"),b!==null){if(x===ne||x===ye)return N===Ut?b.COMPRESSED_SRGB8_ETC2:b.COMPRESSED_RGB8_ETC2;if(x===le)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:b.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(x===$e||x===Mt||x===wt||x===Bt||x===Sn||x===Rn||x===Sr||x===pi||x===Is||x===ls||x===xo||x===yo||x===nc||x===ic)if(b=f.get("WEBGL_compressed_texture_astc"),b!==null){if(x===$e)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:b.COMPRESSED_RGBA_ASTC_4x4_KHR;if(x===Mt)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:b.COMPRESSED_RGBA_ASTC_5x4_KHR;if(x===wt)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:b.COMPRESSED_RGBA_ASTC_5x5_KHR;if(x===Bt)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:b.COMPRESSED_RGBA_ASTC_6x5_KHR;if(x===Sn)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:b.COMPRESSED_RGBA_ASTC_6x6_KHR;if(x===Rn)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:b.COMPRESSED_RGBA_ASTC_8x5_KHR;if(x===Sr)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:b.COMPRESSED_RGBA_ASTC_8x6_KHR;if(x===pi)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:b.COMPRESSED_RGBA_ASTC_8x8_KHR;if(x===Is)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:b.COMPRESSED_RGBA_ASTC_10x5_KHR;if(x===ls)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:b.COMPRESSED_RGBA_ASTC_10x6_KHR;if(x===xo)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:b.COMPRESSED_RGBA_ASTC_10x8_KHR;if(x===yo)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:b.COMPRESSED_RGBA_ASTC_10x10_KHR;if(x===nc)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:b.COMPRESSED_RGBA_ASTC_12x10_KHR;if(x===ic)return N===Ut?b.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:b.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(x===rc||x===sc||x===ac)if(b=f.get("EXT_texture_compression_bptc"),b!==null){if(x===rc)return N===Ut?b.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:b.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(x===sc)return b.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(x===ac)return b.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(x===oc||x===lc||x===vo||x===cc)if(b=f.get("EXT_texture_compression_rgtc"),b!==null){if(x===oc)return b.COMPRESSED_RED_RGTC1_EXT;if(x===lc)return b.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(x===vo)return b.COMPRESSED_RED_GREEN_RGTC2_EXT;if(x===cc)return b.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return x===Br?o.UNSIGNED_INT_24_8:o[x]!==void 0?o[x]:null}return{convert:h}}const Hl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xh=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Yo{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(f,h){if(this.texture===null){const x=new hc(f.texture);(f.depthNear!==h.depthNear||f.depthFar!==h.depthFar)&&(this.depthNear=f.depthNear,this.depthFar=f.depthFar),this.texture=x}}getMesh(f){if(this.texture!==null&&this.mesh===null){const h=f.cameras[0].viewport,x=new tn({vertexShader:Hl,fragmentShader:Xh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:h.z},depthHeight:{value:h.w}}});this.mesh=new Tn(new si(20,20),x)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Wl extends Qc{constructor(f,h){super();const x=this;let A=null,b=1,N=null,R="local-floor",j=1,Y=null,ie=null,H=null,X=null,$=null,ge=null;const ae=typeof XRWebGLBinding<"u",C=new Yo,v={},re=h.getContextAttributes();let J=null,k=null;const he=[],ee=[],te=new jt;let ve=null;const L=new Bn;L.viewport=new Zn;const P=new Bn;P.viewport=new Zn;const Z=[L,P],fe=new jc;let Ae=null,we=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Me){let Ee=he[Me];return Ee===void 0&&(Ee=new hl,he[Me]=Ee),Ee.getTargetRaySpace()},this.getControllerGrip=function(Me){let Ee=he[Me];return Ee===void 0&&(Ee=new hl,he[Me]=Ee),Ee.getGripSpace()},this.getHand=function(Me){let Ee=he[Me];return Ee===void 0&&(Ee=new hl,he[Me]=Ee),Ee.getHandSpace()};function Se(Me){const Ee=ee.indexOf(Me.inputSource);if(Ee===-1)return;const rt=he[Ee];rt!==void 0&&(rt.update(Me.inputSource,Me.frame,Y||N),rt.dispatchEvent({type:Me.type,data:Me.inputSource}))}function be(){A.removeEventListener("select",Se),A.removeEventListener("selectstart",Se),A.removeEventListener("selectend",Se),A.removeEventListener("squeeze",Se),A.removeEventListener("squeezestart",Se),A.removeEventListener("squeezeend",Se),A.removeEventListener("end",be),A.removeEventListener("inputsourceschange",De);for(let Me=0;Me<he.length;Me++){const Ee=ee[Me];Ee!==null&&(ee[Me]=null,he[Me].disconnect(Ee))}Ae=null,we=null,C.reset();for(const Me in v)delete v[Me];f.setRenderTarget(J),$=null,X=null,H=null,A=null,k=null,bn.stop(),x.isPresenting=!1,f.setPixelRatio(ve),f.setSize(te.width,te.height,!1),x.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Me){b=Me,x.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Me){R=Me,x.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return Y||N},this.setReferenceSpace=function(Me){Y=Me},this.getBaseLayer=function(){return X!==null?X:$},this.getBinding=function(){return H===null&&ae&&(H=new XRWebGLBinding(A,h)),H},this.getFrame=function(){return ge},this.getSession=function(){return A},this.setSession=async function(Me){if(A=Me,A!==null){if(J=f.getRenderTarget(),A.addEventListener("select",Se),A.addEventListener("selectstart",Se),A.addEventListener("selectend",Se),A.addEventListener("squeeze",Se),A.addEventListener("squeezestart",Se),A.addEventListener("squeezeend",Se),A.addEventListener("end",be),A.addEventListener("inputsourceschange",De),re.xrCompatible!==!0&&await h.makeXRCompatible(),ve=f.getPixelRatio(),f.getSize(te),ae&&"createProjectionLayer"in XRWebGLBinding.prototype){let rt=null,Lt=null,pt=null;re.depth&&(pt=re.stencil?h.DEPTH24_STENCIL8:h.DEPTH_COMPONENT24,rt=re.stencil?is:rs,Lt=re.stencil?Br:ss);const nn={colorFormat:h.RGBA8,depthFormat:pt,scaleFactor:b};H=this.getBinding(),X=H.createProjectionLayer(nn),A.updateRenderState({layers:[X]}),f.setPixelRatio(1),f.setSize(X.textureWidth,X.textureHeight,!1),k=new yn(X.textureWidth,X.textureHeight,{format:He,type:Ke,depthTexture:new $r(X.textureWidth,X.textureHeight,Lt,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:re.stencil,colorSpace:f.outputColorSpace,samples:re.antialias?4:0,resolveDepthBuffer:X.ignoreDepthValues===!1,resolveStencilBuffer:X.ignoreDepthValues===!1})}else{const rt={antialias:re.antialias,alpha:!0,depth:re.depth,stencil:re.stencil,framebufferScaleFactor:b};$=new XRWebGLLayer(A,h,rt),A.updateRenderState({baseLayer:$}),f.setPixelRatio(1),f.setSize($.framebufferWidth,$.framebufferHeight,!1),k=new yn($.framebufferWidth,$.framebufferHeight,{format:He,type:Ke,colorSpace:f.outputColorSpace,stencilBuffer:re.stencil,resolveDepthBuffer:$.ignoreDepthValues===!1,resolveStencilBuffer:$.ignoreDepthValues===!1})}k.isXRRenderTarget=!0,this.setFoveation(j),Y=null,N=await A.requestReferenceSpace(R),bn.setContext(A),bn.start(),x.isPresenting=!0,x.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(A!==null)return A.environmentBlendMode},this.getDepthTexture=function(){return C.getDepthTexture()};function De(Me){for(let Ee=0;Ee<Me.removed.length;Ee++){const rt=Me.removed[Ee],Lt=ee.indexOf(rt);Lt>=0&&(ee[Lt]=null,he[Lt].disconnect(rt))}for(let Ee=0;Ee<Me.added.length;Ee++){const rt=Me.added[Ee];let Lt=ee.indexOf(rt);if(Lt===-1){for(let nn=0;nn<he.length;nn++)if(nn>=ee.length){ee.push(rt),Lt=nn;break}else if(ee[nn]===null){ee[nn]=rt,Lt=nn;break}if(Lt===-1)break}const pt=he[Lt];pt&&pt.connect(rt)}}const _e=new Xt,ot=new Xt;function yt(Me,Ee,rt){_e.setFromMatrixPosition(Ee.matrixWorld),ot.setFromMatrixPosition(rt.matrixWorld);const Lt=_e.distanceTo(ot),pt=Ee.projectionMatrix.elements,nn=rt.projectionMatrix.elements,ei=pt[14]/(pt[10]-1),O=pt[14]/(pt[10]+1),In=(pt[9]+1)/pt[5],Ft=(pt[9]-1)/pt[5],Ct=(pt[8]-1)/pt[0],st=(nn[8]+1)/nn[0],En=ei*Ct,at=ei*st,Gt=Lt/(-Ct+st),li=Gt*-Ct;if(Ee.matrixWorld.decompose(Me.position,Me.quaternion,Me.scale),Me.translateX(li),Me.translateZ(Gt),Me.matrixWorld.compose(Me.position,Me.quaternion,Me.scale),Me.matrixWorldInverse.copy(Me.matrixWorld).invert(),pt[10]===-1)Me.projectionMatrix.copy(Ee.projectionMatrix),Me.projectionMatrixInverse.copy(Ee.projectionMatrixInverse);else{const Dn=ei+Gt,I=O+Gt,S=En-li,K=at+(Lt-li),pe=In*O/I*Dn,Te=Ft*O/I*Dn;Me.projectionMatrix.makePerspective(S,K,pe,Te,Dn,I),Me.projectionMatrixInverse.copy(Me.projectionMatrix).invert()}}function Ht(Me,Ee){Ee===null?Me.matrixWorld.copy(Me.matrix):Me.matrixWorld.multiplyMatrices(Ee.matrixWorld,Me.matrix),Me.matrixWorldInverse.copy(Me.matrixWorld).invert()}this.updateCamera=function(Me){if(A===null)return;let Ee=Me.near,rt=Me.far;C.texture!==null&&(C.depthNear>0&&(Ee=C.depthNear),C.depthFar>0&&(rt=C.depthFar)),fe.near=P.near=L.near=Ee,fe.far=P.far=L.far=rt,(Ae!==fe.near||we!==fe.far)&&(A.updateRenderState({depthNear:fe.near,depthFar:fe.far}),Ae=fe.near,we=fe.far),fe.layers.mask=Me.layers.mask|6,L.layers.mask=fe.layers.mask&3,P.layers.mask=fe.layers.mask&5;const Lt=Me.parent,pt=fe.cameras;Ht(fe,Lt);for(let nn=0;nn<pt.length;nn++)Ht(pt[nn],Lt);pt.length===2?yt(fe,L,P):fe.projectionMatrix.copy(L.projectionMatrix),un(Me,fe,Lt)};function un(Me,Ee,rt){rt===null?Me.matrix.copy(Ee.matrixWorld):(Me.matrix.copy(rt.matrixWorld),Me.matrix.invert(),Me.matrix.multiply(Ee.matrixWorld)),Me.matrix.decompose(Me.position,Me.quaternion,Me.scale),Me.updateMatrixWorld(!0),Me.projectionMatrix.copy(Ee.projectionMatrix),Me.projectionMatrixInverse.copy(Ee.projectionMatrixInverse),Me.isPerspectiveCamera&&(Me.fov=su*2*Math.atan(1/Me.projectionMatrix.elements[5]),Me.zoom=1)}this.getCamera=function(){return fe},this.getFoveation=function(){if(!(X===null&&$===null))return j},this.setFoveation=function(Me){j=Me,X!==null&&(X.fixedFoveation=Me),$!==null&&$.fixedFoveation!==void 0&&($.fixedFoveation=Me)},this.hasDepthSensing=function(){return C.texture!==null},this.getDepthSensingMesh=function(){return C.getMesh(fe)},this.getCameraTexture=function(Me){return v[Me]};let Xn=null;function qn(Me,Ee){if(ie=Ee.getViewerPose(Y||N),ge=Ee,ie!==null){const rt=ie.views;$!==null&&(f.setRenderTargetFramebuffer(k,$.framebuffer),f.setRenderTarget(k));let Lt=!1;rt.length!==fe.cameras.length&&(fe.cameras.length=0,Lt=!0);for(let O=0;O<rt.length;O++){const In=rt[O];let Ft=null;if($!==null)Ft=$.getViewport(In);else{const st=H.getViewSubImage(X,In);Ft=st.viewport,O===0&&(f.setRenderTargetTextures(k,st.colorTexture,st.depthStencilTexture),f.setRenderTarget(k))}let Ct=Z[O];Ct===void 0&&(Ct=new Bn,Ct.layers.enable(O),Ct.viewport=new Zn,Z[O]=Ct),Ct.matrix.fromArray(In.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(In.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),O===0&&(fe.matrix.copy(Ct.matrix),fe.matrix.decompose(fe.position,fe.quaternion,fe.scale)),Lt===!0&&fe.cameras.push(Ct)}const pt=A.enabledFeatures;if(pt&&pt.includes("depth-sensing")&&A.depthUsage=="gpu-optimized"&&ae){H=x.getBinding();const O=H.getDepthInformation(rt[0]);O&&O.isValid&&O.texture&&C.init(O,A.renderState)}if(pt&&pt.includes("camera-access")&&ae){f.state.unbindTexture(),H=x.getBinding();for(let O=0;O<rt.length;O++){const In=rt[O].camera;if(In){let Ft=v[In];Ft||(Ft=new hc,v[In]=Ft);const Ct=H.getCameraImage(In);Ft.sourceTexture=Ct}}}}for(let rt=0;rt<he.length;rt++){const Lt=ee[rt],pt=he[rt];Lt!==null&&pt!==void 0&&pt.update(Lt,Ee,Y||N)}Xn&&Xn(Me,Ee),Ee.detectedPlanes&&x.dispatchEvent({type:"planesdetected",data:Ee}),ge=null}const bn=new nh;bn.setAnimationLoop(qn),this.setAnimationLoop=function(Me){Xn=Me},this.dispose=function(){}}}const fs=new gr,qh=new Bi;function Gs(o,f){function h(C,v){C.matrixAutoUpdate===!0&&C.updateMatrix(),v.value.copy(C.matrix)}function x(C,v){v.color.getRGB(C.fogColor.value,Nn(o)),v.isFog?(C.fogNear.value=v.near,C.fogFar.value=v.far):v.isFogExp2&&(C.fogDensity.value=v.density)}function A(C,v,re,J,k){v.isMeshBasicMaterial||v.isMeshLambertMaterial?b(C,v):v.isMeshToonMaterial?(b(C,v),H(C,v)):v.isMeshPhongMaterial?(b(C,v),ie(C,v)):v.isMeshStandardMaterial?(b(C,v),X(C,v),v.isMeshPhysicalMaterial&&$(C,v,k)):v.isMeshMatcapMaterial?(b(C,v),ge(C,v)):v.isMeshDepthMaterial?b(C,v):v.isMeshDistanceMaterial?(b(C,v),ae(C,v)):v.isMeshNormalMaterial?b(C,v):v.isLineBasicMaterial?(N(C,v),v.isLineDashedMaterial&&R(C,v)):v.isPointsMaterial?j(C,v,re,J):v.isSpriteMaterial?Y(C,v):v.isShadowMaterial?(C.color.value.copy(v.color),C.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function b(C,v){C.opacity.value=v.opacity,v.color&&C.diffuse.value.copy(v.color),v.emissive&&C.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(C.map.value=v.map,h(v.map,C.mapTransform)),v.alphaMap&&(C.alphaMap.value=v.alphaMap,h(v.alphaMap,C.alphaMapTransform)),v.bumpMap&&(C.bumpMap.value=v.bumpMap,h(v.bumpMap,C.bumpMapTransform),C.bumpScale.value=v.bumpScale,v.side===ln&&(C.bumpScale.value*=-1)),v.normalMap&&(C.normalMap.value=v.normalMap,h(v.normalMap,C.normalMapTransform),C.normalScale.value.copy(v.normalScale),v.side===ln&&C.normalScale.value.negate()),v.displacementMap&&(C.displacementMap.value=v.displacementMap,h(v.displacementMap,C.displacementMapTransform),C.displacementScale.value=v.displacementScale,C.displacementBias.value=v.displacementBias),v.emissiveMap&&(C.emissiveMap.value=v.emissiveMap,h(v.emissiveMap,C.emissiveMapTransform)),v.specularMap&&(C.specularMap.value=v.specularMap,h(v.specularMap,C.specularMapTransform)),v.alphaTest>0&&(C.alphaTest.value=v.alphaTest);const re=f.get(v),J=re.envMap,k=re.envMapRotation;J&&(C.envMap.value=J,fs.copy(k),fs.x*=-1,fs.y*=-1,fs.z*=-1,J.isCubeTexture&&J.isRenderTargetTexture===!1&&(fs.y*=-1,fs.z*=-1),C.envMapRotation.value.setFromMatrix4(qh.makeRotationFromEuler(fs)),C.flipEnvMap.value=J.isCubeTexture&&J.isRenderTargetTexture===!1?-1:1,C.reflectivity.value=v.reflectivity,C.ior.value=v.ior,C.refractionRatio.value=v.refractionRatio),v.lightMap&&(C.lightMap.value=v.lightMap,C.lightMapIntensity.value=v.lightMapIntensity,h(v.lightMap,C.lightMapTransform)),v.aoMap&&(C.aoMap.value=v.aoMap,C.aoMapIntensity.value=v.aoMapIntensity,h(v.aoMap,C.aoMapTransform))}function N(C,v){C.diffuse.value.copy(v.color),C.opacity.value=v.opacity,v.map&&(C.map.value=v.map,h(v.map,C.mapTransform))}function R(C,v){C.dashSize.value=v.dashSize,C.totalSize.value=v.dashSize+v.gapSize,C.scale.value=v.scale}function j(C,v,re,J){C.diffuse.value.copy(v.color),C.opacity.value=v.opacity,C.size.value=v.size*re,C.scale.value=J*.5,v.map&&(C.map.value=v.map,h(v.map,C.uvTransform)),v.alphaMap&&(C.alphaMap.value=v.alphaMap,h(v.alphaMap,C.alphaMapTransform)),v.alphaTest>0&&(C.alphaTest.value=v.alphaTest)}function Y(C,v){C.diffuse.value.copy(v.color),C.opacity.value=v.opacity,C.rotation.value=v.rotation,v.map&&(C.map.value=v.map,h(v.map,C.mapTransform)),v.alphaMap&&(C.alphaMap.value=v.alphaMap,h(v.alphaMap,C.alphaMapTransform)),v.alphaTest>0&&(C.alphaTest.value=v.alphaTest)}function ie(C,v){C.specular.value.copy(v.specular),C.shininess.value=Math.max(v.shininess,1e-4)}function H(C,v){v.gradientMap&&(C.gradientMap.value=v.gradientMap)}function X(C,v){C.metalness.value=v.metalness,v.metalnessMap&&(C.metalnessMap.value=v.metalnessMap,h(v.metalnessMap,C.metalnessMapTransform)),C.roughness.value=v.roughness,v.roughnessMap&&(C.roughnessMap.value=v.roughnessMap,h(v.roughnessMap,C.roughnessMapTransform)),v.envMap&&(C.envMapIntensity.value=v.envMapIntensity)}function $(C,v,re){C.ior.value=v.ior,v.sheen>0&&(C.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),C.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(C.sheenColorMap.value=v.sheenColorMap,h(v.sheenColorMap,C.sheenColorMapTransform)),v.sheenRoughnessMap&&(C.sheenRoughnessMap.value=v.sheenRoughnessMap,h(v.sheenRoughnessMap,C.sheenRoughnessMapTransform))),v.clearcoat>0&&(C.clearcoat.value=v.clearcoat,C.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(C.clearcoatMap.value=v.clearcoatMap,h(v.clearcoatMap,C.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(C.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,h(v.clearcoatRoughnessMap,C.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(C.clearcoatNormalMap.value=v.clearcoatNormalMap,h(v.clearcoatNormalMap,C.clearcoatNormalMapTransform),C.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===ln&&C.clearcoatNormalScale.value.negate())),v.dispersion>0&&(C.dispersion.value=v.dispersion),v.iridescence>0&&(C.iridescence.value=v.iridescence,C.iridescenceIOR.value=v.iridescenceIOR,C.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],C.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(C.iridescenceMap.value=v.iridescenceMap,h(v.iridescenceMap,C.iridescenceMapTransform)),v.iridescenceThicknessMap&&(C.iridescenceThicknessMap.value=v.iridescenceThicknessMap,h(v.iridescenceThicknessMap,C.iridescenceThicknessMapTransform))),v.transmission>0&&(C.transmission.value=v.transmission,C.transmissionSamplerMap.value=re.texture,C.transmissionSamplerSize.value.set(re.width,re.height),v.transmissionMap&&(C.transmissionMap.value=v.transmissionMap,h(v.transmissionMap,C.transmissionMapTransform)),C.thickness.value=v.thickness,v.thicknessMap&&(C.thicknessMap.value=v.thicknessMap,h(v.thicknessMap,C.thicknessMapTransform)),C.attenuationDistance.value=v.attenuationDistance,C.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(C.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(C.anisotropyMap.value=v.anisotropyMap,h(v.anisotropyMap,C.anisotropyMapTransform))),C.specularIntensity.value=v.specularIntensity,C.specularColor.value.copy(v.specularColor),v.specularColorMap&&(C.specularColorMap.value=v.specularColorMap,h(v.specularColorMap,C.specularColorMapTransform)),v.specularIntensityMap&&(C.specularIntensityMap.value=v.specularIntensityMap,h(v.specularIntensityMap,C.specularIntensityMapTransform))}function ge(C,v){v.matcap&&(C.matcap.value=v.matcap)}function ae(C,v){const re=f.get(v).light;C.referencePosition.value.setFromMatrixPosition(re.matrixWorld),C.nearDistance.value=re.shadow.camera.near,C.farDistance.value=re.shadow.camera.far}return{refreshFogUniforms:x,refreshMaterialUniforms:A}}function Xl(o,f,h,x){let A={},b={},N=[];const R=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function j(re,J){const k=J.program;x.uniformBlockBinding(re,k)}function Y(re,J){let k=A[re.id];k===void 0&&(ge(re),k=ie(re),A[re.id]=k,re.addEventListener("dispose",C));const he=J.program;x.updateUBOMapping(re,he);const ee=f.render.frame;b[re.id]!==ee&&(X(re),b[re.id]=ee)}function ie(re){const J=H();re.__bindingPointIndex=J;const k=o.createBuffer(),he=re.__size,ee=re.usage;return o.bindBuffer(o.UNIFORM_BUFFER,k),o.bufferData(o.UNIFORM_BUFFER,he,ee),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,J,k),k}function H(){for(let re=0;re<R;re++)if(N.indexOf(re)===-1)return N.push(re),re;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function X(re){const J=A[re.id],k=re.uniforms,he=re.__cache;o.bindBuffer(o.UNIFORM_BUFFER,J);for(let ee=0,te=k.length;ee<te;ee++){const ve=Array.isArray(k[ee])?k[ee]:[k[ee]];for(let L=0,P=ve.length;L<P;L++){const Z=ve[L];if($(Z,ee,L,he)===!0){const fe=Z.__offset,Ae=Array.isArray(Z.value)?Z.value:[Z.value];let we=0;for(let Se=0;Se<Ae.length;Se++){const be=Ae[Se],De=ae(be);typeof be=="number"||typeof be=="boolean"?(Z.__data[0]=be,o.bufferSubData(o.UNIFORM_BUFFER,fe+we,Z.__data)):be.isMatrix3?(Z.__data[0]=be.elements[0],Z.__data[1]=be.elements[1],Z.__data[2]=be.elements[2],Z.__data[3]=0,Z.__data[4]=be.elements[3],Z.__data[5]=be.elements[4],Z.__data[6]=be.elements[5],Z.__data[7]=0,Z.__data[8]=be.elements[6],Z.__data[9]=be.elements[7],Z.__data[10]=be.elements[8],Z.__data[11]=0):(be.toArray(Z.__data,we),we+=De.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,fe,Z.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function $(re,J,k,he){const ee=re.value,te=J+"_"+k;if(he[te]===void 0)return typeof ee=="number"||typeof ee=="boolean"?he[te]=ee:he[te]=ee.clone(),!0;{const ve=he[te];if(typeof ee=="number"||typeof ee=="boolean"){if(ve!==ee)return he[te]=ee,!0}else if(ve.equals(ee)===!1)return ve.copy(ee),!0}return!1}function ge(re){const J=re.uniforms;let k=0;const he=16;for(let te=0,ve=J.length;te<ve;te++){const L=Array.isArray(J[te])?J[te]:[J[te]];for(let P=0,Z=L.length;P<Z;P++){const fe=L[P],Ae=Array.isArray(fe.value)?fe.value:[fe.value];for(let we=0,Se=Ae.length;we<Se;we++){const be=Ae[we],De=ae(be),_e=k%he,ot=_e%De.boundary,yt=_e+ot;k+=ot,yt!==0&&he-yt<De.storage&&(k+=he-yt),fe.__data=new Float32Array(De.storage/Float32Array.BYTES_PER_ELEMENT),fe.__offset=k,k+=De.storage}}}const ee=k%he;return ee>0&&(k+=he-ee),re.__size=k,re.__cache={},this}function ae(re){const J={boundary:0,storage:0};return typeof re=="number"||typeof re=="boolean"?(J.boundary=4,J.storage=4):re.isVector2?(J.boundary=8,J.storage=8):re.isVector3||re.isColor?(J.boundary=16,J.storage=12):re.isVector4?(J.boundary=16,J.storage=16):re.isMatrix3?(J.boundary=48,J.storage=48):re.isMatrix4?(J.boundary=64,J.storage=64):re.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",re),J}function C(re){const J=re.target;J.removeEventListener("dispose",C);const k=N.indexOf(J.__bindingPointIndex);N.splice(k,1),o.deleteBuffer(A[J.id]),delete A[J.id],delete b[J.id]}function v(){for(const re in A)o.deleteBuffer(A[re]);N=[],A={},b={}}return{bind:j,update:Y,dispose:v}}class Yh{constructor(f={}){const{canvas:h=eh(),context:x=null,depth:A=!0,stencil:b=!1,alpha:N=!1,antialias:R=!1,premultipliedAlpha:j=!0,preserveDrawingBuffer:Y=!1,powerPreference:ie="default",failIfMajorPerformanceCaveat:H=!1,reversedDepthBuffer:X=!1}=f;this.isWebGLRenderer=!0;let $;if(x!==null){if(typeof WebGLRenderingContext<"u"&&x instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");$=x.getContextAttributes().alpha}else $=N;const ge=new Uint32Array(4),ae=new Int32Array(4);let C=null,v=null;const re=[],J=[];this.domElement=h,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const k=this;let he=!1;this._outputColorSpace=th;let ee=0,te=0,ve=null,L=-1,P=null;const Z=new Zn,fe=new Zn;let Ae=null;const we=new Dt(0);let Se=0,be=h.width,De=h.height,_e=1,ot=null,yt=null;const Ht=new Zn(0,0,be,De),un=new Zn(0,0,be,De);let Xn=!1;const qn=new qs;let bn=!1,Me=!1;const Ee=new Bi,rt=new Xt,Lt=new Zn,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nn=!1;function ei(){return ve===null?_e:1}let O=x;function In(T,W){return h.getContext(T,W)}try{const T={alpha:!0,depth:A,stencil:b,antialias:R,premultipliedAlpha:j,preserveDrawingBuffer:Y,powerPreference:ie,failIfMajorPerformanceCaveat:H};if("setAttribute"in h&&h.setAttribute("data-engine",`three.js r${Ia}`),h.addEventListener("webglcontextlost",Ge,!1),h.addEventListener("webglcontextrestored",Qe,!1),h.addEventListener("webglcontextcreationerror",Ue,!1),O===null){const W="webgl2";if(O=In(W,T),O===null)throw In(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ft,Ct,st,En,at,Gt,li,Dn,I,S,K,pe,Te,me,ut,ze,lt,ct,Fe,Ze,Rt,ht,qe,Wt;function G(){Ft=new rr(O),Ft.init(),ht=new qo(O,Ft),Ct=new ju(O,Ft,f,ht),st=new Wh(O,Ft),Ct.reversedDepthBuffer&&X&&st.buffers.depth.setReversed(!0),En=new qt(O),at=new md,Gt=new Fi(O,Ft,st,at,Ct,ht,En),li=new sa(k),Dn=new Ha(k),I=new ou(O),qe=new Pt(O,I),S=new Po(O,I,En,qe),K=new la(O,S,I,En),Fe=new Sh(O,Ct,Gt),ze=new wi(at),pe=new pd(k,li,Dn,Ft,Ct,qe,ze),Te=new Gs(k,at),me=new kh,ut=new Gc(Ft),ct=new wc(k,li,Dn,st,K,$,j),lt=new xd(k,K,Ct),Wt=new Xl(O,En,Ct,st),Ze=new Ei(O,Ft,En),Rt=new ui(O,Ft,En),En.programs=pe.programs,k.capabilities=Ct,k.extensions=Ft,k.properties=at,k.renderLists=me,k.shadowMap=lt,k.state=st,k.info=En}G();const Ne=new Wl(k,O);this.xr=Ne,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const T=Ft.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ft.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(T){T!==void 0&&(_e=T,this.setSize(be,De,!1))},this.getSize=function(T){return T.set(be,De)},this.setSize=function(T,W,se=!0){if(Ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}be=T,De=W,h.width=Math.floor(T*_e),h.height=Math.floor(W*_e),se===!0&&(h.style.width=T+"px",h.style.height=W+"px"),this.setViewport(0,0,T,W)},this.getDrawingBufferSize=function(T){return T.set(be*_e,De*_e).floor()},this.setDrawingBufferSize=function(T,W,se){be=T,De=W,_e=se,h.width=Math.floor(T*se),h.height=Math.floor(W*se),this.setViewport(0,0,T,W)},this.getCurrentViewport=function(T){return T.copy(Z)},this.getViewport=function(T){return T.copy(Ht)},this.setViewport=function(T,W,se,oe){T.isVector4?Ht.set(T.x,T.y,T.z,T.w):Ht.set(T,W,se,oe),st.viewport(Z.copy(Ht).multiplyScalar(_e).round())},this.getScissor=function(T){return T.copy(un)},this.setScissor=function(T,W,se,oe){T.isVector4?un.set(T.x,T.y,T.z,T.w):un.set(T,W,se,oe),st.scissor(fe.copy(un).multiplyScalar(_e).round())},this.getScissorTest=function(){return Xn},this.setScissorTest=function(T){st.setScissorTest(Xn=T)},this.setOpaqueSort=function(T){ot=T},this.setTransparentSort=function(T){yt=T},this.getClearColor=function(T){return T.copy(ct.getClearColor())},this.setClearColor=function(){ct.setClearColor(...arguments)},this.getClearAlpha=function(){return ct.getClearAlpha()},this.setClearAlpha=function(){ct.setClearAlpha(...arguments)},this.clear=function(T=!0,W=!0,se=!0){let oe=0;if(T){let q=!1;if(ve!==null){const Le=ve.texture.format;q=Le===os||Le===Gr||Le===fr}if(q){const Le=ve.texture.type,We=Le===Ke||Le===ss||Le===Es||Le===Br||Le===ws||Le===wa,tt=ct.getClearColor(),Je=ct.getClearAlpha(),St=tt.r,It=tt.g,gt=tt.b;We?(ge[0]=St,ge[1]=It,ge[2]=gt,ge[3]=Je,O.clearBufferuiv(O.COLOR,0,ge)):(ae[0]=St,ae[1]=It,ae[2]=gt,ae[3]=Je,O.clearBufferiv(O.COLOR,0,ae))}else oe|=O.COLOR_BUFFER_BIT}W&&(oe|=O.DEPTH_BUFFER_BIT),se&&(oe|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(oe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){h.removeEventListener("webglcontextlost",Ge,!1),h.removeEventListener("webglcontextrestored",Qe,!1),h.removeEventListener("webglcontextcreationerror",Ue,!1),ct.dispose(),me.dispose(),ut.dispose(),at.dispose(),li.dispose(),Dn.dispose(),K.dispose(),qe.dispose(),Wt.dispose(),pe.dispose(),Ne.dispose(),Ne.removeEventListener("sessionstart",Xi),Ne.removeEventListener("sessionend",Zh),ks.stop()};function Ge(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),he=!0}function Qe(){console.log("THREE.WebGLRenderer: Context Restored."),he=!1;const T=En.autoReset,W=lt.enabled,se=lt.autoUpdate,oe=lt.needsUpdate,q=lt.type;G(),En.autoReset=T,lt.enabled=W,lt.autoUpdate=se,lt.needsUpdate=oe,lt.type=q}function Ue(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ue(T){const W=T.target;W.removeEventListener("dispose",ue),je(W)}function je(T){Nt(T),at.remove(T)}function Nt(T){const W=at.get(T).programs;W!==void 0&&(W.forEach(function(se){pe.releaseProgram(se)}),T.isShaderMaterial&&pe.releaseShaderCache(T))}this.renderBufferDirect=function(T,W,se,oe,q,Le){W===null&&(W=pt);const We=q.isMesh&&q.matrixWorld.determinant()<0,tt=$l(T,W,se,oe,q);st.setMaterial(oe,We);let Je=se.index,St=1;if(oe.wireframe===!0){if(Je=S.getWireframeAttribute(se),Je===void 0)return;St=2}const It=se.drawRange,gt=se.attributes.position;let $t=It.start*St,_n=(It.start+It.count)*St;Le!==null&&($t=Math.max($t,Le.start*St),_n=Math.min(_n,(Le.start+Le.count)*St)),Je!==null?($t=Math.max($t,0),_n=Math.min(_n,Je.count)):gt!=null&&($t=Math.max($t,0),_n=Math.min(_n,gt.count));const Un=_n-$t;if(Un<0||Un===1/0)return;qe.setup(q,oe,tt,se,Je);let wn,vn=Ze;if(Je!==null&&(wn=I.get(Je),vn=Rt,vn.setIndex(wn)),q.isMesh)oe.wireframe===!0?(st.setLineWidth(oe.wireframeLinewidth*ei()),vn.setMode(O.LINES)):vn.setMode(O.TRIANGLES);else if(q.isLine){let xt=oe.linewidth;xt===void 0&&(xt=1),st.setLineWidth(xt*ei()),q.isLineSegments?vn.setMode(O.LINES):q.isLineLoop?vn.setMode(O.LINE_LOOP):vn.setMode(O.LINE_STRIP)}else q.isPoints?vn.setMode(O.POINTS):q.isSprite&&vn.setMode(O.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)ft("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),vn.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))vn.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const xt=q._multiDrawStarts,Fn=q._multiDrawCounts,on=q._multiDrawCount,Yi=Je?I.get(Je).bytesPerElement:1,pa=at.get(oe).currentProgram.getUniforms();for(let Zi=0;Zi<on;Zi++)pa.setValue(O,"_gl_DrawID",Zi),vn.render(xt[Zi]/Yi,Fn[Zi])}else if(q.isInstancedMesh)vn.renderInstances($t,Un,q.count);else if(se.isInstancedBufferGeometry){const xt=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,Fn=Math.min(se.instanceCount,xt);vn.renderInstances($t,Un,Fn)}else vn.render($t,Un)};function gn(T,W,se){T.transparent===!0&&T.side===Ki&&T.forceSinglePass===!1?(T.side=ln,T.needsUpdate=!0,qi(T,W,se),T.side=$i,T.needsUpdate=!0,qi(T,W,se),T.side=Ki):qi(T,W,se)}this.compile=function(T,W,se=null){se===null&&(se=T),v=ut.get(se),v.init(W),J.push(v),se.traverseVisible(function(q){q.isLight&&q.layers.test(W.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),T!==se&&T.traverseVisible(function(q){q.isLight&&q.layers.test(W.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),v.setupLights();const oe=new Set;return T.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Le=q.material;if(Le)if(Array.isArray(Le))for(let We=0;We<Le.length;We++){const tt=Le[We];gn(tt,se,q),oe.add(tt)}else gn(Le,se,q),oe.add(Le)}),v=J.pop(),oe},this.compileAsync=function(T,W,se=null){const oe=this.compile(T,W,se);return new Promise(q=>{function Le(){if(oe.forEach(function(We){at.get(We).currentProgram.isReady()&&oe.delete(We)}),oe.size===0){q(T);return}setTimeout(Le,10)}Ft.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let an=null;function ps(T){an&&an(T)}function Xi(){ks.stop()}function Zh(){ks.start()}const ks=new nh;ks.setAnimationLoop(ps),typeof self<"u"&&ks.setContext(self),this.setAnimationLoop=function(T){an=T,Ne.setAnimationLoop(T),T===null?ks.stop():ks.start()},Ne.addEventListener("sessionstart",Xi),Ne.addEventListener("sessionend",Zh),this.render=function(T,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(he===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),Ne.enabled===!0&&Ne.isPresenting===!0&&(Ne.cameraAutoUpdate===!0&&Ne.updateCamera(W),W=Ne.getCamera()),T.isScene===!0&&T.onBeforeRender(k,T,W,ve),v=ut.get(T,J.length),v.init(W),J.push(v),Ee.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),qn.setFromProjectionMatrix(Ee,uc,W.reversedDepth),Me=this.localClippingEnabled,bn=ze.init(this.clippingPlanes,Me),C=me.get(T,re.length),C.init(),re.push(C),Ne.enabled===!0&&Ne.isPresenting===!0){const Le=k.xr.getDepthSensingMesh();Le!==null&&ql(Le,W,-1/0,k.sortObjects)}ql(T,W,0,k.sortObjects),C.finish(),k.sortObjects===!0&&C.sort(ot,yt),nn=Ne.enabled===!1||Ne.isPresenting===!1||Ne.hasDepthSensing()===!1,nn&&ct.addToRenderList(C,T),this.info.render.frame++,bn===!0&&ze.beginShadows();const se=v.state.shadowsArray;lt.render(se,T,W),bn===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset();const oe=C.opaque,q=C.transmissive;if(v.setupLights(),W.isArrayCamera){const Le=W.cameras;if(q.length>0)for(let We=0,tt=Le.length;We<tt;We++){const Je=Le[We];Yl(oe,q,T,Je)}nn&&ct.render(T);for(let We=0,tt=Le.length;We<tt;We++){const Je=Le[We];ja(C,T,Je,Je.viewport)}}else q.length>0&&Yl(oe,q,T,W),nn&&ct.render(T),ja(C,T,W);ve!==null&&te===0&&(Gt.updateMultisampleRenderTarget(ve),Gt.updateRenderTargetMipmap(ve)),T.isScene===!0&&T.onAfterRender(k,T,W),qe.resetDefaultState(),L=-1,P=null,J.pop(),J.length>0?(v=J[J.length-1],bn===!0&&ze.setGlobalState(k.clippingPlanes,v.state.camera)):v=null,re.pop(),re.length>0?C=re[re.length-1]:C=null};function ql(T,W,se,oe){if(T.visible===!1)return;if(T.layers.test(W.layers)){if(T.isGroup)se=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(W);else if(T.isLight)v.pushLight(T),T.castShadow&&v.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||qn.intersectsSprite(T)){oe&&Lt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ee);const We=K.update(T),tt=T.material;tt.visible&&C.push(T,We,tt,se,Lt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||qn.intersectsObject(T))){const We=K.update(T),tt=T.material;if(oe&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Lt.copy(T.boundingSphere.center)):(We.boundingSphere===null&&We.computeBoundingSphere(),Lt.copy(We.boundingSphere.center)),Lt.applyMatrix4(T.matrixWorld).applyMatrix4(Ee)),Array.isArray(tt)){const Je=We.groups;for(let St=0,It=Je.length;St<It;St++){const gt=Je[St],$t=tt[gt.materialIndex];$t&&$t.visible&&C.push(T,We,$t,se,Lt.z,gt)}}else tt.visible&&C.push(T,We,tt,se,Lt.z,null)}}const Le=T.children;for(let We=0,tt=Le.length;We<tt;We++)ql(Le[We],W,se,oe)}function ja(T,W,se,oe){const q=T.opaque,Le=T.transmissive,We=T.transparent;v.setupLightsView(se),bn===!0&&ze.setGlobalState(k.clippingPlanes,se),oe&&st.viewport(Z.copy(oe)),q.length>0&&Zl(q,W,se),Le.length>0&&Zl(Le,W,se),We.length>0&&Zl(We,W,se),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function Yl(T,W,se,oe){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[oe.id]===void 0&&(v.state.transmissionRenderTarget[oe.id]=new yn(1,1,{generateMipmaps:!0,type:Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float")?Ve:Ke,minFilter:ns,samples:4,stencilBuffer:b,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const Le=v.state.transmissionRenderTarget[oe.id],We=oe.viewport||Z;Le.setSize(We.z*k.transmissionResolutionScale,We.w*k.transmissionResolutionScale);const tt=k.getRenderTarget(),Je=k.getActiveCubeFace(),St=k.getActiveMipmapLevel();k.setRenderTarget(Le),k.getClearColor(we),Se=k.getClearAlpha(),Se<1&&k.setClearColor(16777215,.5),k.clear(),nn&&ct.render(se);const It=k.toneMapping;k.toneMapping=mn;const gt=oe.viewport;if(oe.viewport!==void 0&&(oe.viewport=void 0),v.setupLightsView(oe),bn===!0&&ze.setGlobalState(k.clippingPlanes,oe),Zl(T,se,oe),Gt.updateMultisampleRenderTarget(Le),Gt.updateRenderTargetMipmap(Le),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let _n=0,Un=W.length;_n<Un;_n++){const wn=W[_n],vn=wn.object,xt=wn.geometry,Fn=wn.material,on=wn.group;if(Fn.side===Ki&&vn.layers.test(oe.layers)){const Yi=Fn.side;Fn.side=ln,Fn.needsUpdate=!0,$h(vn,se,oe,xt,Fn,on),Fn.side=Yi,Fn.needsUpdate=!0,$t=!0}}$t===!0&&(Gt.updateMultisampleRenderTarget(Le),Gt.updateRenderTargetMipmap(Le))}k.setRenderTarget(tt,Je,St),k.setClearColor(we,Se),gt!==void 0&&(oe.viewport=gt),k.toneMapping=It}function Zl(T,W,se){const oe=W.isScene===!0?W.overrideMaterial:null;for(let q=0,Le=T.length;q<Le;q++){const We=T[q],tt=We.object,Je=We.geometry,St=We.group;let It=We.material;It.allowOverride===!0&&oe!==null&&(It=oe),tt.layers.test(se.layers)&&$h(tt,W,se,Je,It,St)}}function $h(T,W,se,oe,q,Le){T.onBeforeRender(k,W,se,oe,q,Le),T.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),q.onBeforeRender(k,W,se,oe,T,Le),q.transparent===!0&&q.side===Ki&&q.forceSinglePass===!1?(q.side=ln,q.needsUpdate=!0,k.renderBufferDirect(se,W,oe,q,T,Le),q.side=$i,q.needsUpdate=!0,k.renderBufferDirect(se,W,oe,q,T,Le),q.side=Ki):k.renderBufferDirect(se,W,oe,q,T,Le),T.onAfterRender(k,W,se,oe,q,Le)}function qi(T,W,se){W.isScene!==!0&&(W=pt);const oe=at.get(T),q=v.state.lights,Le=v.state.shadowsArray,We=q.state.version,tt=pe.getParameters(T,q.state,Le,W,se),Je=pe.getProgramCacheKey(tt);let St=oe.programs;oe.environment=T.isMeshStandardMaterial?W.environment:null,oe.fog=W.fog,oe.envMap=(T.isMeshStandardMaterial?Dn:li).get(T.envMap||oe.environment),oe.envMapRotation=oe.environment!==null&&T.envMap===null?W.environmentRotation:T.envMapRotation,St===void 0&&(T.addEventListener("dispose",ue),St=new Map,oe.programs=St);let It=St.get(Je);if(It!==void 0){if(oe.currentProgram===It&&oe.lightsStateVersion===We)return Vc(T,tt),It}else tt.uniforms=pe.getUniforms(T),T.onBeforeCompile(tt,k),It=pe.acquireProgram(tt,Je),St.set(Je,It),oe.uniforms=tt.uniforms;const gt=oe.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(gt.clippingPlanes=ze.uniform),Vc(T,tt),oe.needsLights=vd(T),oe.lightsStateVersion=We,oe.needsLights&&(gt.ambientLightColor.value=q.state.ambient,gt.lightProbe.value=q.state.probe,gt.directionalLights.value=q.state.directional,gt.directionalLightShadows.value=q.state.directionalShadow,gt.spotLights.value=q.state.spot,gt.spotLightShadows.value=q.state.spotShadow,gt.rectAreaLights.value=q.state.rectArea,gt.ltc_1.value=q.state.rectAreaLTC1,gt.ltc_2.value=q.state.rectAreaLTC2,gt.pointLights.value=q.state.point,gt.pointLightShadows.value=q.state.pointShadow,gt.hemisphereLights.value=q.state.hemi,gt.directionalShadowMap.value=q.state.directionalShadowMap,gt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,gt.spotShadowMap.value=q.state.spotShadowMap,gt.spotLightMatrix.value=q.state.spotLightMatrix,gt.spotLightMap.value=q.state.spotLightMap,gt.pointShadowMap.value=q.state.pointShadowMap,gt.pointShadowMatrix.value=q.state.pointShadowMatrix),oe.currentProgram=It,oe.uniformsList=null,It}function kc(T){if(T.uniformsList===null){const W=T.currentProgram.getUniforms();T.uniformsList=ko.seqWithValue(W.seq,T.uniforms)}return T.uniformsList}function Vc(T,W){const se=at.get(T);se.outputColorSpace=W.outputColorSpace,se.batching=W.batching,se.batchingColor=W.batchingColor,se.instancing=W.instancing,se.instancingColor=W.instancingColor,se.instancingMorph=W.instancingMorph,se.skinning=W.skinning,se.morphTargets=W.morphTargets,se.morphNormals=W.morphNormals,se.morphColors=W.morphColors,se.morphTargetsCount=W.morphTargetsCount,se.numClippingPlanes=W.numClippingPlanes,se.numIntersection=W.numClipIntersection,se.vertexAlphas=W.vertexAlphas,se.vertexTangents=W.vertexTangents,se.toneMapping=W.toneMapping}function $l(T,W,se,oe,q){W.isScene!==!0&&(W=pt),Gt.resetTextureUnits();const Le=W.fog,We=oe.isMeshStandardMaterial?W.environment:null,tt=ve===null?k.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:hn,Je=(oe.isMeshStandardMaterial?Dn:li).get(oe.envMap||We),St=oe.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,It=!!se.attributes.tangent&&(!!oe.normalMap||oe.anisotropy>0),gt=!!se.morphAttributes.position,$t=!!se.morphAttributes.normal,_n=!!se.morphAttributes.color;let Un=mn;oe.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(Un=k.toneMapping);const wn=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,vn=wn!==void 0?wn.length:0,xt=at.get(oe),Fn=v.state.lights;if(bn===!0&&(Me===!0||T!==P)){const gi=T===P&&oe.id===L;ze.setState(oe,T,gi)}let on=!1;oe.version===xt.__version?(xt.needsLights&&xt.lightsStateVersion!==Fn.state.version||xt.outputColorSpace!==tt||q.isBatchedMesh&&xt.batching===!1||!q.isBatchedMesh&&xt.batching===!0||q.isBatchedMesh&&xt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&xt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&xt.instancing===!1||!q.isInstancedMesh&&xt.instancing===!0||q.isSkinnedMesh&&xt.skinning===!1||!q.isSkinnedMesh&&xt.skinning===!0||q.isInstancedMesh&&xt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&xt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&xt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&xt.instancingMorph===!1&&q.morphTexture!==null||xt.envMap!==Je||oe.fog===!0&&xt.fog!==Le||xt.numClippingPlanes!==void 0&&(xt.numClippingPlanes!==ze.numPlanes||xt.numIntersection!==ze.numIntersection)||xt.vertexAlphas!==St||xt.vertexTangents!==It||xt.morphTargets!==gt||xt.morphNormals!==$t||xt.morphColors!==_n||xt.toneMapping!==Un||xt.morphTargetsCount!==vn)&&(on=!0):(on=!0,xt.__version=oe.version);let Yi=xt.currentProgram;on===!0&&(Yi=qi(oe,W,q));let pa=!1,Zi=!1,eo=!1;const xn=Yi.getUniforms(),lr=xt.uniforms;if(st.useProgram(Yi.program)&&(pa=!0,Zi=!0,eo=!0),oe.id!==L&&(L=oe.id,Zi=!0),pa||P!==T){st.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),xn.setValue(O,"projectionMatrix",T.projectionMatrix),xn.setValue(O,"viewMatrix",T.matrixWorldInverse);const Ri=xn.map.cameraPosition;Ri!==void 0&&Ri.setValue(O,rt.setFromMatrixPosition(T.matrixWorld)),Ct.logarithmicDepthBuffer&&xn.setValue(O,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial)&&xn.setValue(O,"isOrthographic",T.isOrthographicCamera===!0),P!==T&&(P=T,Zi=!0,eo=!0)}if(q.isSkinnedMesh){xn.setOptional(O,q,"bindMatrix"),xn.setOptional(O,q,"bindMatrixInverse");const gi=q.skeleton;gi&&(gi.boneTexture===null&&gi.computeBoneTexture(),xn.setValue(O,"boneTexture",gi.boneTexture,Gt))}q.isBatchedMesh&&(xn.setOptional(O,q,"batchingTexture"),xn.setValue(O,"batchingTexture",q._matricesTexture,Gt),xn.setOptional(O,q,"batchingIdTexture"),xn.setValue(O,"batchingIdTexture",q._indirectTexture,Gt),xn.setOptional(O,q,"batchingColorTexture"),q._colorsTexture!==null&&xn.setValue(O,"batchingColorTexture",q._colorsTexture,Gt));const cr=se.morphAttributes;if((cr.position!==void 0||cr.normal!==void 0||cr.color!==void 0)&&Fe.update(q,se,Yi),(Zi||xt.receiveShadow!==q.receiveShadow)&&(xt.receiveShadow=q.receiveShadow,xn.setValue(O,"receiveShadow",q.receiveShadow)),oe.isMeshGouraudMaterial&&oe.envMap!==null&&(lr.envMap.value=Je,lr.flipEnvMap.value=Je.isCubeTexture&&Je.isRenderTargetTexture===!1?-1:1),oe.isMeshStandardMaterial&&oe.envMap===null&&W.environment!==null&&(lr.envMapIntensity.value=W.environmentIntensity),Zi&&(xn.setValue(O,"toneMappingExposure",k.toneMappingExposure),xt.needsLights&&yd(lr,eo),Le&&oe.fog===!0&&Te.refreshFogUniforms(lr,Le),Te.refreshMaterialUniforms(lr,oe,_e,De,v.state.transmissionRenderTarget[T.id]),ko.upload(O,kc(xt),lr,Gt)),oe.isShaderMaterial&&oe.uniformsNeedUpdate===!0&&(ko.upload(O,kc(xt),lr,Gt),oe.uniformsNeedUpdate=!1),oe.isSpriteMaterial&&xn.setValue(O,"center",q.center),xn.setValue(O,"modelViewMatrix",q.modelViewMatrix),xn.setValue(O,"normalMatrix",q.normalMatrix),xn.setValue(O,"modelMatrix",q.matrixWorld),oe.isShaderMaterial||oe.isRawShaderMaterial){const gi=oe.uniformsGroups;for(let Ri=0,Hc=gi.length;Ri<Hc;Ri++){const ma=gi[Ri];Wt.update(ma,Yi),Wt.bind(ma,Yi)}}return Yi}function yd(T,W){T.ambientLightColor.needsUpdate=W,T.lightProbe.needsUpdate=W,T.directionalLights.needsUpdate=W,T.directionalLightShadows.needsUpdate=W,T.pointLights.needsUpdate=W,T.pointLightShadows.needsUpdate=W,T.spotLights.needsUpdate=W,T.spotLightShadows.needsUpdate=W,T.rectAreaLights.needsUpdate=W,T.hemisphereLights.needsUpdate=W}function vd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return ee},this.getActiveMipmapLevel=function(){return te},this.getRenderTarget=function(){return ve},this.setRenderTargetTextures=function(T,W,se){const oe=at.get(T);oe.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,oe.__autoAllocateDepthBuffer===!1&&(oe.__useRenderToTexture=!1),at.get(T.texture).__webglTexture=W,at.get(T.depthTexture).__webglTexture=oe.__autoAllocateDepthBuffer?void 0:se,oe.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,W){const se=at.get(T);se.__webglFramebuffer=W,se.__useDefaultFramebuffer=W===void 0};const Jl=O.createFramebuffer();this.setRenderTarget=function(T,W=0,se=0){ve=T,ee=W,te=se;let oe=!0,q=null,Le=!1,We=!1;if(T){const Je=at.get(T);if(Je.__useDefaultFramebuffer!==void 0)st.bindFramebuffer(O.FRAMEBUFFER,null),oe=!1;else if(Je.__webglFramebuffer===void 0)Gt.setupRenderTarget(T);else if(Je.__hasExternalTextures)Gt.rebindTextures(T,at.get(T.texture).__webglTexture,at.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const gt=T.depthTexture;if(Je.__boundDepthTexture!==gt){if(gt!==null&&at.has(gt)&&(T.width!==gt.image.width||T.height!==gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Gt.setupDepthRenderbuffer(T)}}const St=T.texture;(St.isData3DTexture||St.isDataArrayTexture||St.isCompressedArrayTexture)&&(We=!0);const It=at.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(It[W])?q=It[W][se]:q=It[W],Le=!0):T.samples>0&&Gt.useMultisampledRTT(T)===!1?q=at.get(T).__webglMultisampledFramebuffer:Array.isArray(It)?q=It[se]:q=It,Z.copy(T.viewport),fe.copy(T.scissor),Ae=T.scissorTest}else Z.copy(Ht).multiplyScalar(_e).floor(),fe.copy(un).multiplyScalar(_e).floor(),Ae=Xn;if(se!==0&&(q=Jl),st.bindFramebuffer(O.FRAMEBUFFER,q)&&oe&&st.drawBuffers(T,q),st.viewport(Z),st.scissor(fe),st.setScissorTest(Ae),Le){const Je=at.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,Je.__webglTexture,se)}else if(We){const Je=W;for(let St=0;St<T.textures.length;St++){const It=at.get(T.textures[St]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+St,It.__webglTexture,se,Je)}}else if(T!==null&&se!==0){const Je=at.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Je.__webglTexture,se)}L=-1},this.readRenderTargetPixels=function(T,W,se,oe,q,Le,We,tt=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Je=at.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&We!==void 0&&(Je=Je[We]),Je){st.bindFramebuffer(O.FRAMEBUFFER,Je);try{const St=T.textures[tt],It=St.format,gt=St.type;if(!Ct.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=T.width-oe&&se>=0&&se<=T.height-q&&(T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+tt),O.readPixels(W,se,oe,q,ht.convert(It),ht.convert(gt),Le))}finally{const St=ve!==null?at.get(ve).__webglFramebuffer:null;st.bindFramebuffer(O.FRAMEBUFFER,St)}}},this.readRenderTargetPixelsAsync=async function(T,W,se,oe,q,Le,We,tt=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Je=at.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&We!==void 0&&(Je=Je[We]),Je)if(W>=0&&W<=T.width-oe&&se>=0&&se<=T.height-q){st.bindFramebuffer(O.FRAMEBUFFER,Je);const St=T.textures[tt],It=St.format,gt=St.type;if(!Ct.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $t=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,$t),O.bufferData(O.PIXEL_PACK_BUFFER,Le.byteLength,O.STREAM_READ),T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+tt),O.readPixels(W,se,oe,q,ht.convert(It),ht.convert(gt),0);const _n=ve!==null?at.get(ve).__webglFramebuffer:null;st.bindFramebuffer(O.FRAMEBUFFER,_n);const Un=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await au(O,Un,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,$t),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Le),O.deleteBuffer($t),O.deleteSync(Un),Le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,W=null,se=0){const oe=Math.pow(2,-se),q=Math.floor(T.image.width*oe),Le=Math.floor(T.image.height*oe),We=W!==null?W.x:0,tt=W!==null?W.y:0;Gt.setTexture2D(T,0),O.copyTexSubImage2D(O.TEXTURE_2D,se,0,0,We,tt,q,Le),st.unbindTexture()};const Kl=O.createFramebuffer(),Zo=O.createFramebuffer();this.copyTextureToTexture=function(T,W,se=null,oe=null,q=0,Le=null){Le===null&&(q!==0?(ft("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Le=q,q=0):Le=0);let We,tt,Je,St,It,gt,$t,_n,Un;const wn=T.isCompressedTexture?T.mipmaps[Le]:T.image;if(se!==null)We=se.max.x-se.min.x,tt=se.max.y-se.min.y,Je=se.isBox3?se.max.z-se.min.z:1,St=se.min.x,It=se.min.y,gt=se.isBox3?se.min.z:0;else{const cr=Math.pow(2,-q);We=Math.floor(wn.width*cr),tt=Math.floor(wn.height*cr),T.isDataArrayTexture?Je=wn.depth:T.isData3DTexture?Je=Math.floor(wn.depth*cr):Je=1,St=0,It=0,gt=0}oe!==null?($t=oe.x,_n=oe.y,Un=oe.z):($t=0,_n=0,Un=0);const vn=ht.convert(W.format),xt=ht.convert(W.type);let Fn;W.isData3DTexture?(Gt.setTexture3D(W,0),Fn=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(Gt.setTexture2DArray(W,0),Fn=O.TEXTURE_2D_ARRAY):(Gt.setTexture2D(W,0),Fn=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const on=O.getParameter(O.UNPACK_ROW_LENGTH),Yi=O.getParameter(O.UNPACK_IMAGE_HEIGHT),pa=O.getParameter(O.UNPACK_SKIP_PIXELS),Zi=O.getParameter(O.UNPACK_SKIP_ROWS),eo=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,wn.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,wn.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,St),O.pixelStorei(O.UNPACK_SKIP_ROWS,It),O.pixelStorei(O.UNPACK_SKIP_IMAGES,gt);const xn=T.isDataArrayTexture||T.isData3DTexture,lr=W.isDataArrayTexture||W.isData3DTexture;if(T.isDepthTexture){const cr=at.get(T),gi=at.get(W),Ri=at.get(cr.__renderTarget),Hc=at.get(gi.__renderTarget);st.bindFramebuffer(O.READ_FRAMEBUFFER,Ri.__webglFramebuffer),st.bindFramebuffer(O.DRAW_FRAMEBUFFER,Hc.__webglFramebuffer);for(let ma=0;ma<Je;ma++)xn&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,at.get(T).__webglTexture,q,gt+ma),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,at.get(W).__webglTexture,Le,Un+ma)),O.blitFramebuffer(St,It,We,tt,$t,_n,We,tt,O.DEPTH_BUFFER_BIT,O.NEAREST);st.bindFramebuffer(O.READ_FRAMEBUFFER,null),st.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(q!==0||T.isRenderTargetTexture||at.has(T)){const cr=at.get(T),gi=at.get(W);st.bindFramebuffer(O.READ_FRAMEBUFFER,Kl),st.bindFramebuffer(O.DRAW_FRAMEBUFFER,Zo);for(let Ri=0;Ri<Je;Ri++)xn?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,cr.__webglTexture,q,gt+Ri):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,cr.__webglTexture,q),lr?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,gi.__webglTexture,Le,Un+Ri):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,gi.__webglTexture,Le),q!==0?O.blitFramebuffer(St,It,We,tt,$t,_n,We,tt,O.COLOR_BUFFER_BIT,O.NEAREST):lr?O.copyTexSubImage3D(Fn,Le,$t,_n,Un+Ri,St,It,We,tt):O.copyTexSubImage2D(Fn,Le,$t,_n,St,It,We,tt);st.bindFramebuffer(O.READ_FRAMEBUFFER,null),st.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else lr?T.isDataTexture||T.isData3DTexture?O.texSubImage3D(Fn,Le,$t,_n,Un,We,tt,Je,vn,xt,wn.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(Fn,Le,$t,_n,Un,We,tt,Je,vn,wn.data):O.texSubImage3D(Fn,Le,$t,_n,Un,We,tt,Je,vn,xt,wn):T.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Le,$t,_n,We,tt,vn,xt,wn.data):T.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Le,$t,_n,wn.width,wn.height,vn,wn.data):O.texSubImage2D(O.TEXTURE_2D,Le,$t,_n,We,tt,vn,xt,wn);O.pixelStorei(O.UNPACK_ROW_LENGTH,on),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Yi),O.pixelStorei(O.UNPACK_SKIP_PIXELS,pa),O.pixelStorei(O.UNPACK_SKIP_ROWS,Zi),O.pixelStorei(O.UNPACK_SKIP_IMAGES,eo),Le===0&&W.generateMipmaps&&O.generateMipmap(Fn),st.unbindTexture()},this.initRenderTarget=function(T){at.get(T).__webglFramebuffer===void 0&&Gt.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Gt.setTextureCube(T,0):T.isData3DTexture?Gt.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Gt.setTexture2DArray(T,0):Gt.setTexture2D(T,0),st.unbindTexture()},this.resetState=function(){ee=0,te=0,ve=null,st.reset(),qe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return uc}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(f){this._outputColorSpace=f;const h=this.getContext();h.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(f),h.unpackColorSpace=Xe._getUnpackColorSpace()}}return Object.assign(Mn,{ACESFilmicToneMapping:ol,AddEquation:Lr,AddOperation:Kr,AdditiveBlending:Ts,AgXToneMapping:Ws,AlphaFormat:zr,AlwaysCompare:Nr,AlwaysDepth:Ms,ArrayCamera:jc,BackSide:ln,BoxGeometry:en,BufferAttribute:Qn,BufferGeometry:ai,ByteType:Gi,CineonToneMapping:ll,ClampToEdgeWrapping:ho,Color:Dt,ColorManagement:Xe,ConstantAlphaFactor:ba,ConstantColorFactor:Zs,CubeReflectionMapping:Zt,CubeRefractionMapping:Kt,CubeTexture:rl,CubeUVReflectionMapping:ri,CullFaceBack:bs,CullFaceFront:jr,CullFaceNone:lo,CustomBlending:Ta,CustomToneMapping:al,Data3DTexture:Zr,DataArrayTexture:_r,DepthFormat:rs,DepthStencilFormat:is,DepthTexture:$r,DoubleSide:Ki,DstAlphaFactor:On,DstColorFactor:hr,EqualCompare:vr,EqualDepth:zi,EquirectangularReflectionMapping:Tt,EquirectangularRefractionMapping:Et,Euler:gr,EventDispatcher:Qc,ExternalTexture:hc,FloatType:Ce,FrontSide:$i,Frustum:qs,GLSL3:io,GreaterCompare:po,GreaterDepth:Fr,GreaterEqualCompare:mo,GreaterEqualDepth:Pi,HalfFloatType:Ve,IntType:Re,Layers:Mi,LessCompare:Ea,LessDepth:Qr,LessEqualCompare:vi,LessEqualDepth:Ys,LinearFilter:fi,LinearMipmapLinearFilter:ns,LinearMipmapNearestFilter:Qs,LinearSRGBColorSpace:hn,LinearToneMapping:Jr,LinearTransfer:xs,Matrix3:kt,Matrix4:Bi,MaxEquation:hi,Mesh:Tn,MeshBasicMaterial:mt,MeshDepthMaterial:cl,MeshDistanceMaterial:ji,MinEquation:co,MirroredRepeatWrapping:Ks,MixOperation:so,MultiplyBlending:es,MultiplyOperation:Xs,NearestFilter:$n,NearestMipmapLinearFilter:As,NearestMipmapNearestFilter:fo,NeutralToneMapping:Hs,NeverCompare:ur,NeverDepth:Ss,NoBlending:Gn,NoColorSpace:dr,NoToneMapping:mn,NormalBlending:Qi,NotEqualCompare:Aa,NotEqualDepth:bi,ObjectSpaceNormalMap:Rr,OneFactor:Js,OneMinusConstantAlphaFactor:ys,OneMinusConstantColorFactor:vs,OneMinusDstAlphaFactor:ao,OneMinusDstColorFactor:$s,OneMinusSrcAlphaFactor:Dr,OneMinusSrcColorFactor:oo,OrthographicCamera:pn,PCFShadowMap:Ma,PCFSoftShadowMap:ro,PMREMGenerator:yl,PerspectiveCamera:Bn,Plane:bt,PlaneGeometry:si,RED_GREEN_RGTC2_Format:vo,RED_RGTC1_Format:oc,REVISION:Ia,RGBADepthPacking:xr,RGBAFormat:He,RGBAIntegerFormat:os,RGBA_ASTC_10x10_Format:yo,RGBA_ASTC_10x5_Format:Is,RGBA_ASTC_10x6_Format:ls,RGBA_ASTC_10x8_Format:xo,RGBA_ASTC_12x10_Format:nc,RGBA_ASTC_12x12_Format:ic,RGBA_ASTC_4x4_Format:$e,RGBA_ASTC_5x4_Format:Mt,RGBA_ASTC_5x5_Format:wt,RGBA_ASTC_6x5_Format:Bt,RGBA_ASTC_6x6_Format:Sn,RGBA_ASTC_8x5_Format:Rn,RGBA_ASTC_8x6_Format:Sr,RGBA_ASTC_8x8_Format:pi,RGBA_BPTC_Format:rc,RGBA_ETC2_EAC_Format:le,RGBA_PVRTC_2BPPV1_Format:V,RGBA_PVRTC_4BPPV1_Format:z,RGBA_S3TC_DXT1_Format:ea,RGBA_S3TC_DXT3_Format:Ca,RGBA_S3TC_DXT5_Format:Ra,RGBFormat:as,RGB_BPTC_SIGNED_Format:sc,RGB_BPTC_UNSIGNED_Format:ac,RGB_ETC1_Format:ne,RGB_ETC2_Format:ye,RGB_PVRTC_2BPPV1_Format:y,RGB_PVRTC_4BPPV1_Format:Vn,RGB_S3TC_DXT1_Format:Mr,RGFormat:tr,RGIntegerFormat:Gr,RedFormat:Rs,RedIntegerFormat:fr,ReinhardToneMapping:Sa,RepeatWrapping:uo,ReverseSubtractEquation:Ir,SIGNED_RED_GREEN_RGTC2_Format:cc,SIGNED_RED_RGTC1_Format:lc,SRGBColorSpace:th,SRGBTransfer:Ut,ShaderChunk:zt,ShaderLib:Ln,ShaderMaterial:tn,ShortType:Cs,SrcAlphaFactor:Ur,SrcAlphaSaturateFactor:er,SrcColorFactor:Si,SubtractEquation:Pr,SubtractiveBlending:ts,TangentSpaceNormalMap:Ii,Texture:sl,Uint16BufferAttribute:kn,Uint32BufferAttribute:sn,UniformsLib:ke,UniformsUtils:Oi,UnsignedByteType:Ke,UnsignedInt101111Type:Or,UnsignedInt248Type:Br,UnsignedInt5999Type:_o,UnsignedIntType:ss,UnsignedShort4444Type:ws,UnsignedShort5551Type:wa,UnsignedShortType:Es,VSMShadowMap:Ji,Vector2:jt,Vector3:Xt,Vector4:Zn,WebGLCoordinateSystem:uc,WebGLCubeRenderTarget:rn,WebGLRenderTarget:yn,WebGLRenderer:Yh,WebGLUtils:qo,WebXRController:hl,ZeroFactor:yr,createCanvasElement:eh}),Mn})();window.THREE=THREE,(function(Mn,kt){const jt=kt();typeof module=="object"&&module.exports&&(module.exports=jt),Mn&&(Mn.RangerAtomicMotion=jt)})(typeof window<"u"?window:null,function(){"use strict";const Mn=(Re,Ve=0,Ke=1)=>Math.max(Ve,Math.min(Ke,Re)),kt=(Re,Ve,Ke)=>Re.map((Ce,He)=>Ce+(Ve[He]-Ce)*Ke),jt=(Re,Ve)=>Number.isFinite(Re)?Re:Ve;function ri(Re,Ve){let Ke=(Math.imul(Re+1,374761393)^Math.imul(Ve|0,668265263))>>>0;return Ke=Math.imul(Ke^Ke>>>13,1274126177),((Ke^Ke>>>16)>>>0)/4294967296}function Tn(Re){Re=Re||{};const Ve=jt(Re.collisionAt,2),Ke=Math.max(Ve,jt(Re.electronAt,Ve+.35)),Ce=Math.max(Ve,jt(Re.ionAt,Ke+.4)),He=Math.max(Ke+.1,jt(Re.avalancheAt,Ke+3)),bt=Math.max(He+.8,jt(Re.pulseAt,He+4.5)),Tt=Math.max(bt+.5,jt(Re.readyAt,bt+5)),Et=Math.min(Ve-.001,jt(Re.radiationStart,Ve-2)),rn=Number.isFinite(Re.windowAt)?Mn(Re.windowAt,Et+1e-4,Ve-1e-4):null;return{collisionAt:Ve,electronAt:Ke,ionAt:Ce,avalancheAt:He,pulseAt:bt,readyAt:Tt,radiationStart:Et,windowAt:rn,seed:Math.trunc(jt(Re.seed,7391)),gasTime:Re.gasTime}}function en(Re,Ve,Ke=!1){const Ce=Ke?901:101,He=Et=>ri(Re*19+Ce+Et,Ve.seed),bt=He(0)*Math.PI*2,Tt=.35+He(1)*.4;return[Math.cos(bt)*Tt,Math.sin(bt)*Tt,(Ke||He(2)<.5?-1:1)*(.16+He(3)*.2)]}function tn(Re,Ve,Ke){const Ce=Re.slice(),He=Ve.map(Et=>Et*(Ke<0?-1:1));let bt=Math.abs(Ke);for(let Et=0;bt>1e-10&&Et<4096;Et++){const rn=He[0]*He[0]+He[1]*He[1],Zt=Ce[0]*He[0]+Ce[1]*He[1],Kt=Ce[0]*Ce[0]+Ce[1]*Ce[1]-21.2*21.2,pn=rn>1e-16?Math.max(0,(-Zt+Math.sqrt(Math.max(0,Zt*Zt-rn*Kt)))/rn):1/0,Bn=Math.abs(He[2])>1e-16?Math.max(0,((He[2]>0?5.4:-5.4)-Ce[2])/He[2]):1/0,mn=Math.min(bt,pn,Bn);for(let mt=0;mt<3;mt++)Ce[mt]+=He[mt]*mn;if(bt-=mn,bt<=1e-10)break;if(pn<=mn+1e-9){const mt=Math.hypot(Ce[0],Ce[1]),Gn=Ce[0]/mt,yn=Ce[1]/mt,ai=He[0]*Gn+He[1]*yn;He[0]-=2*ai*Gn,He[1]-=2*ai*yn}Bn<=mn+1e-9&&(He[2]*=-1)}const Tt=Math.hypot(Ce[0],Ce[1]);return Tt>21.2&&(Ce[0]*=21.2/Tt,Ce[1]*=21.2/Tt),Ce[2]=Mn(Ce[2],-5.4,5.4),Ce}function ln(Re,Ve,Ke){if(Re===0)return tn([3,0,-.35],en(Re,Ke),Ve-Ke.collisionAt);const Ce=Tt=>ri(Re*23+Tt,Ke.seed),He=Math.sqrt(Ce(0))*20.8,bt=Ce(1)*Math.PI*2;return tn([Math.cos(bt)*He,Math.sin(bt)*He,-5.4+(5.4- -5.4)*Ce(2)],en(Re,Ke),Ve)}function _s(Re,Ve=0){const Ke=Math.atan2(Re[1],Re[0])+Ve;return[Math.cos(Ke)*13.8,Math.sin(Ke)*13.8,.2]}function gr(Re,Ve,Ke,Ce,He){const bt=jt(He,$i(Ce,Ke));return Ve>=bt?tn([Ce.position[0],Ce.position[1],5.4],en(Re,Ke,!0),Ve-bt):tn(Ce.position,en(Re,Ke),Ve-Ce.time)}function Bi(Re,Ve,Ke){const Ce=Tn(Ke);return Re<=15?gr(Re,Ve,Ce,Xe(Ce).events[Re]):ln(Re,Ve,Ce)}function Xe(Re){const Ve=Tn(Re),Ke=ln(0,Ve.collisionAt,Ve),Ce=[{index:0,type:"primary",atomIndex:0,parentElectron:null,time:Ve.collisionAt,position:Ke,anodeTarget:_s(Ke)}],He={config:Ve,events:Ce},bt=Ve.pulseAt-Ve.avalancheAt-.2;for(let Tt=1;Tt<=15;Tt++){const Et=Math.floor(Math.log2(Tt)),rn=Tt-Math.pow(2,Et),Zt=.1+Et*.22+ri(Tt+300,Ve.seed)*.018,Kt=Ve.avalancheAt+bt*Zt,pn=Ut(rn,Kt,He),Bn=Ce[rn].anodeTarget,mn=Math.atan2(Bn[1],Bn[0]),mt=Math.atan2(pn[1],pn[0]),Gn=mt+Math.acos(Mn(Math.hypot(pn[0],pn[1])/13.8)),yn=mn+Math.min(.19*Math.pow(.32,Et),Math.max(0,(Gn-mn)*.6));Ce.push({index:Tt,type:"secondary",atomIndex:Tt,parentElectron:rn,generation:Et,time:Kt,position:pn,anodeTarget:[Math.cos(yn)*13.8,Math.sin(yn)*13.8,.2]})}return{config:Ve,events:Ce}}function Ut(Re,Ve,Ke,Ce){const He=Ke.events[Re],bt=Ke.config,Tt=Re===0?Math.max(0,Math.min(.25,bt.electronAt-He.time)):0,Et=He.anodeTarget.map((pn,Bn)=>pn-He.position[Bn]),rn=Math.hypot(...Et),Zt=Re===0&&Tt>0?He.position.map((pn,Bn)=>pn+Et[Bn]/rn*2):He.position;if(Re===0&&Ve<=bt.electronAt)return kt(He.position,Zt,Tt>0?Mn((Ve-He.time)/Tt):0);const Kt=Re===0?bt.electronAt:He.time;return Re===0&&Ve<bt.avalancheAt&&Number.isFinite(Ce)&&(Ve=Kt+Mn(Ce)*(bt.avalancheAt-Kt)),kt(Zt,He.anodeTarget,Mn((Ve-Kt)/(bt.pulseAt-Kt)))}function si(Re,Ve){const He=Ve.readyAt-Ve.pulseAt,bt=Et=>(Et=Mn(Et),Et*Et*(3-2*Et));let Tt;return Re<Ve.pulseAt?Tt=1-(1-.28)*bt((Re-(Ve.pulseAt-.5))/.5):Re<=Ve.readyAt?Tt=.28+(.78-.28)*bt((Re-Ve.pulseAt)/He):Tt=.78+(1-.78)*bt((Re-Ve.readyAt)/Math.max(.5,He*.18)),{fieldStrength:Tt,measurementReady:Tt>=.78-1e-12,qualitative:!0}}function $i(Re,Ve){const Ke=.7+Re.index/15*.72+(ri(Re.index+711,Ve.seed)-.5)*.04;return Math.max(Math.max(Re.time,Ve.ionAt)+.25,Ve.pulseAt+(Ve.readyAt-Ve.pulseAt)*Ke)}function Nn(Re,Ve){const Ke=Xe(Ve),Ce=Ke.config;Re=jt(Re,0);const He=Ve&&Ve.chargeProgress||{},bt=[],Tt=[],Et=[],rn=si(Re,Ce),Zt=Ke.events.map(ft=>$i(ft,Ce)),Kt=Ke.events.map((ft,sn)=>Re>=Zt[sn]||sn===0&&Re>Math.max(ft.time,Ce.ionAt)&&Number.isFinite(He.ion)&&He.ion>=1);for(let ft=0;ft<52;ft++){const sn=Ke.events[ft],kn=!!sn&&Re>=sn.time&&!Kt[ft],yi=ft>15&&Re>Ce.collisionAt?jt(Ce.gasTime,Re):Re,Zn=ft===0&&Kt[ft]?Math.min(Re,Zt[ft]):void 0;bt.push({index:ft,position:sn?gr(ft,yi,Ce,sn,Zn):ln(ft,yi,Ce),visible:!kn})}for(const ft of Ke.events){const sn=Re>=ft.time;Tt.push({index:ft.index,bornAt:ft.time,anodeTarget:ft.anodeTarget.slice(),position:Ut(ft.index,Re,Ke,ft.index===0?He.electron:void 0),visible:sn&&Re<Ce.pulseAt});const kn=Math.max(ft.time,Ce.ionAt),yi=Re<=kn?0:ft.index===0&&Number.isFinite(He.ion)?Mn(He.ion):Mn((Re-kn)/Math.max(.001,Zt[ft.index]-kn));Et.push({index:ft.index,bornAt:ft.time,neutralizedAt:Zt[ft.index],neutralized:Kt[ft.index],driftProgress:yi,position:kt(ft.position,[ft.position[0],ft.position[1],5.4],yi),visible:sn&&!Kt[ft.index]})}const pn=Ke.events[0].position,Bn=Mn((Re-Ce.radiationStart)/(Ce.collisionAt-Ce.radiationStart)),mn=[pn[0],pn[1],-45],mt=-7.9,Gn=[pn[0],pn[1],mt],yn=Ce.windowAt===null?Ce.radiationStart+(Ce.collisionAt-Ce.radiationStart)*(mt-mn[2])/(pn[2]-mn[2]):Ce.windowAt,ai=Ce.windowAt===null?kt(mn,pn,Bn):Re<=yn?kt(mn,Gn,Mn((Re-Ce.radiationStart)/(yn-Ce.radiationStart))):kt(Gn,pn,Mn((Re-yn)/(Ce.collisionAt-yn))),Qn=Ke.events.map(ft=>({...ft,position:ft.position.slice(),occurred:Re>=ft.time,projectileAtContact:ft.parentElectron===null?pn.slice():Ut(ft.parentElectron,ft.time,Ke),electronAtBirth:ft.position.slice(),ionAtBirth:ft.position.slice()})),hn=Et.filter(ft=>ft.visible).length,fi=Et.filter(ft=>Re>=ft.bornAt).length;return{time:Re,config:Ce,space:"sensor-local-mm",atoms:bt,electrons:Tt,ions:Et,events:Qn,primary:Qn[0],radiation:{position:ai,start:mn,contact:pn.slice(),visible:Re>=Ce.radiationStart&&Re<=Ce.collisionAt,windowPlaneZ:mt,windowPosition:Gn,windowCrossingAt:yn,enteredWindow:Re>=yn},fieldStrength:rn.fieldStrength,measurementReady:rn.measurementReady,avalanchePermitted:rn.measurementReady,recovered:rn.measurementReady,neutralization:{remainingIons:hn,totalBorn:fi,allNeutralized:fi===Qn.length&&hn===0,lastArrivalAt:Math.max(...Zt)},fieldIsQualitative:!0}}return{evaluate:Nn,atomPosition:Bi,schedule:Xe,normalize:Tn}}),(function(Mn){"use strict";Mn.createRangerViewer=function(jt,Dt){Dt=Dt||{};const Oe=Dt.THREE||(typeof THREE<"u"?THREE:Mn.THREE);if(!Oe)throw new Error("Three.js fehlt.");const Xt=new Oe.Scene;Xt.background=new Oe.Color(Dt.background||"#eaf0f5");const ri=new Oe.PerspectiveCamera(34,1,1,1800),Tn=new Oe.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!!Dt.preserveDrawingBuffer});Tn.setPixelRatio(Math.min(Mn.devicePixelRatio||1,Dt.pixelRatio||1.75)),Tn.outputColorSpace=Oe.SRGBColorSpace,Tn.toneMapping=Oe.ACESFilmicToneMapping,Tn.toneMappingExposure=1.16,Tn.shadowMap.enabled=!0,Tn.shadowMap.type=Oe.PCFSoftShadowMap;const en=Tn.domElement;en.style.cssText="display:block;width:100%;height:100%;touch-action:none;outline:none;cursor:grab",en.tabIndex=0,en.setAttribute("role","img"),en.setAttribute("aria-label","Drehbares 3D-Modell eines Geiger-M\xFCller-Z\xE4hlers. Ziehen zum Drehen, zwei Finger zum Zoomen."),jt.appendChild(en);const tn=new Oe.Group;tn.name="Radiation Alert Ranger \u2013 Lehrmodell",tn.userData={units:"mm",exteriorDimensions:[68,140,33],interior:"schematic functional abstraction, not a service drawing",source:"https://seintl.com/products/radiation-alert-ranger/"},Xt.add(tn);const ln={},_s=[],gr=[],Bi=[],Xe=(y,z,V)=>new Oe.Vector3(y,z,V);let Ut=0,si=null,$i=!1,Nn=!0,Re=0,Ve=null;const Ke=new Set(["window","cathode","anode","gas","voltage","counter","battery"]),Ce=Xe(0,0,0),He=Ce.clone();let bt=.43,Tt=.2,Et=280,rn=bt,Zt=Tt,Kt=Et;const pn=new Oe.HemisphereLight(15332607,7107201,2.3);Xt.add(pn);function Bn(y,z,V,ne){const ye=new Oe.DirectionalLight(y,z);return ye.position.copy(V),ye.castShadow=!!ne,ne&&(ye.shadow.mapSize.set(1024,1024),ye.shadow.camera.left=-190,ye.shadow.camera.right=190,ye.shadow.camera.top=190,ye.shadow.camera.bottom=-190,ye.shadow.normalBias=.7),Xt.add(ye),ye}Bn(16777215,3.8,Xe(-110,190,180),!0),Bn(11982079,2.1,Xe(150,40,-110)),Bn(16777215,1,Xe(20,-70,160));const mn=new Oe.Mesh(new Oe.PlaneGeometry(1500,1500),new Oe.ShadowMaterial({opacity:.13}));mn.rotation.x=-Math.PI/2,mn.position.y=-83,mn.receiveShadow=!0,Xt.add(mn);function mt(y,z){const V=new Oe.MeshStandardMaterial(Object.assign({color:y,roughness:.47,metalness:.05},z));return gr.push(V),V.userData.baseOpacity=V.opacity,V.userData.baseColor=V.color.getHex(),V.userData.baseEmissive=V.emissive.getHex(),V.userData.baseEmissiveIntensity=V.emissiveIntensity,V}const Gn=()=>mt(1393307,{roughness:.36}),yn=()=>mt(795992,{roughness:.65}),ai=()=>mt(10925246,{metalness:.8,roughness:.29});function Qn(y,z,V){const ne=new Oe.Group;return ne.name=y,ne.userData.partId=y,ne.position.copy(z||Xe(0,0,0)),tn.add(ne),ln[y]||(ln[y]=ne),_s.push({group:ne,base:ne.position.clone(),offset:V||Xe(0,0,0)}),ne}function hn(y,z,V,ne,ye,le){const $e=new Oe.Mesh(z,V);return $e.position.set(ne||0,ye||0,le||0),$e.castShadow=!0,$e.receiveShadow=!0,y.add($e),$e}function fi(y,z,V){const ne=new Oe.Shape,ye=-y/2,le=-z/2;return ne.moveTo(ye+V,le),ne.lineTo(ye+y-V,le),ne.quadraticCurveTo(ye+y,le,ye+y,le+V),ne.lineTo(ye+y,le+z-V),ne.quadraticCurveTo(ye+y,le+z,ye+y-V,le+z),ne.lineTo(ye+V,le+z),ne.quadraticCurveTo(ye,le+z,ye,le+z-V),ne.lineTo(ye,le+V),ne.quadraticCurveTo(ye,le,ye+V,le),ne}function ft(y,z,V){const ne=new Oe.ExtrudeGeometry(y,{depth:z,bevelEnabled:!!V,bevelSegments:3,steps:1,bevelSize:V||0,bevelThickness:V||0,curveSegments:10});return ne.translate(0,0,-z/2),ne}function sn(y,z,V,ne,ye,le,$e,Mt,wt,Bt){return hn(y,ft(fi(z,V,ye),ne,Bt),le,$e,Mt,wt)}function kn(y,z,V,ne,ye,le,$e,Mt){const wt=hn(y,new Oe.CylinderGeometry(z,z,V,Mt||48),ne,ye,le,$e);return wt.rotation.x=Math.PI/2,wt}function yi(y,z,V,ne,ye,le,$e){return hn(y,new Oe.TorusGeometry(z,V,8,72),ne,ye,le,$e)}function Zn(y,z,V,ne){const ye=new Oe.CatmullRomCurve3(z.map(le=>Xe.apply(null,le)));return hn(y,new Oe.TubeGeometry(ye,Math.max(12,z.length*8),V,7,!1),ne)}function _r(y,z,V,ne,ye,le,$e,Mt){const wt=document.createElement("canvas"),Bt=1024,Sn=Math.max(128,Math.round(1024*V/z)),Rn=Math.min(1,1024/Sn);wt.width=Math.round(Bt*Rn),wt.height=Math.round(Sn*Rn);const Sr=wt.getContext("2d");Sr.scale(Rn,Rn),$e(Sr,Bt,Sn);const pi=new Oe.CanvasTexture(wt);pi.colorSpace=Oe.SRGBColorSpace,pi.anisotropy=Math.min(4,Tn.capabilities.getMaxAnisotropy()),Bi.push(pi);const Is=mt(16777215,{map:pi,transparent:!0,alphaTest:.04,roughness:.66,side:Oe.DoubleSide,depthWrite:!1}),ls=hn(y,new Oe.PlaneGeometry(z,V),Is,ne,ye,le);return ls.castShadow=!1,Mt&&(ls.rotation.y=Math.PI),ls}function rl(y,z,V,ne,ye){kn(y,1.25,.55,ai(),z,V,ne);const le=hn(y,new Oe.BoxGeometry(1.6,.27,.15),mt(2438212),z,V,ne+(ye?-.36:.36));le.rotation.z=.55}const Zr=Qn("shell",Xe(0,0,0),Xe(-38,12,88)),vi=Qn("rear",Xe(0,0,0),Xe(-38,0,-82));sn(Zr,66,138,6,10,Gn(),0,0,12,.8);const $r=fi(66,138,10),sl=fi(60,132,8),io=new Oe.Path(sl.getPoints(64));$r.holes.push(io),hn(vi,ft($r,23,.3),Gn(),0,0,-2);const Ma=fi(66,138,10),ro=new Oe.Path;ro.absarc(0,30,24.2,0,Math.PI*2,!0),Ma.holes.push(ro),hn(vi,ft(Ma,3,.65),Gn(),0,0,-14.1);const Ji=fi(66.35,138.35,10),al=new Oe.Path(fi(64.9,136.9,9).getPoints(64));Ji.holes.push(al),hn(vi,ft(Ji,.65,0),yn(),0,0,6.4);for(let y=0;y<5;y++)sn(vi,1.9,7,15.5,.8,yn(),-33.2,-24+y*10,-1),sn(vi,1.9,7,15.5,.8,yn(),33.2,-24+y*10,-1);sn(vi,58,44,1,9,Gn(),0,-44,-16.2,.3);for(let y=0;y<5;y++)sn(vi,15-Math.abs(y-2)*1.3,.7,.3,.3,yn(),0,-34+y*1.5,-17);for(const y of[-26,26])for(const z of[-59,61])rl(vi,y,z,-16.5,!0);sn(vi,7.2,3.6,1.5,.7,mt(1581355),29,61,0),sn(vi,13,4.5,3,2,yn(),0,-69,0);const Hs=Qn("display",Xe(0,0,0),Xe(-38,12,88));Zr.add(Hs),_s.pop(),sn(Hs,53,39,1.6,3.5,yn(),0,42,16,.3),sn(Hs,47.5,33.5,.45,1.6,mt(11978662,{roughness:.45}),0,42,17.1),_r(Hs,46,31.5,0,42,17.45,(y,z,V)=>{y.fillStyle="#b9c8aa",y.fillRect(0,0,z,V),y.fillStyle="#30453c",y.font="bold 47px Arial",y.fillText("\u25B0\u25B0\u25B0",34,70),y.font="bold 300px monospace",y.fillText("0.017",25,V*.65),y.font="bold 65px Arial",y.textAlign="right",y.fillText("mR/h",z-35,V-50),y.textAlign="left",y.strokeStyle="#4e6353",y.lineWidth=3,y.beginPath(),y.moveTo(z*.5,V-45),y.lineTo(z*.5,V-13),y.moveTo(z*.5-16,V-29),y.lineTo(z*.5+16,V-29),y.stroke()}),kn(Zr,1.4,.8,mt(8588568,{emissive:6229001,emissiveIntensity:.6}),0,66,16.5,20),_r(Zr,52,15,0,8,16.05,(y,z,V)=>{y.fillStyle="#f3e947",y.font="bold 70px Arial",y.fillText("RADIATION ALERT",190,V*.3),y.fillStyle="#fff",y.font="italic bold 225px Georgia",y.fillText("Ranger",20,V*.98)}),kn(Zr,24.5,1,yn(),0,-27,16,72),_r(Zr,49,49,0,-27,16.56,(y,z,V)=>{const ne=z/2,ye=V/2,le=z*.475;y.fillStyle="#142d5d",y.beginPath(),y.arc(ne,ye,le,0,Math.PI*2),y.fill(),y.strokeStyle="#f6e936",y.lineWidth=13,y.stroke(),y.lineWidth=10;for(let wt=0;wt<6;wt++){const Bt=wt*Math.PI/3;y.beginPath(),y.moveTo(ne+Math.cos(Bt)*le*.29,ye+Math.sin(Bt)*le*.29),y.lineTo(ne+Math.cos(Bt)*le,ye+Math.sin(Bt)*le),y.stroke()}y.fillStyle="#f5f6ec",y.textAlign="center",y.textBaseline="middle",y.font="bold 48px Arial";const $e=["COUNT","((\u2022))","MENU","\u2600 +","MODE","ALARM"],Mt=[-30,30,90,150,210,270];$e.forEach((wt,Bt)=>{const Sn=Mt[Bt]*Math.PI/180;y.save(),y.translate(ne+Math.cos(Sn)*le*.67,ye+Math.sin(Sn)*le*.67),y.rotate(Bt===0||Bt===4?Sn+Math.PI/2:0),y.fillText(wt,0,0),y.restore()}),y.beginPath(),y.arc(ne,ye,le*.29,0,Math.PI*2),y.fillStyle="#172337",y.fill(),y.stroke(),y.strokeStyle="#fff",y.lineWidth=15,y.beginPath(),y.arc(ne,ye,le*.165,-Math.PI*.32,Math.PI*1.32),y.stroke(),y.beginPath(),y.moveTo(ne,ye-le*.23),y.lineTo(ne,ye),y.stroke()}),_r(vi,51,22,0,-9,-16.45,(y,z,V)=>{y.fillStyle="#ebf2f6",y.textAlign="center",y.font="bold 29px Arial",y.fillText("RADIATION ALERT\xAE  RANGER",z/2,42),y.font="23px Arial",y.fillText("S.E. INTERNATIONAL, INC.",z/2,80),y.fillText("www.seintl.com",z/2,112),y.font="20px Arial",y.fillText("FRAGILE WINDOW \xB7 DO NOT TOUCH",z/2,151),y.fillStyle="#eaf0f5",y.fillRect(z*.2,V-58,z*.6,23)},!0);const Ws=Qn("cathode",Xe(0,30,0),Xe(-10,0,-6)),ol=kn(Ws,24,1.3,ai(),0,0,-.8);ol.userData.cathodeBacking=!0;const ll=new Oe.CylinderGeometry(24,24,10,64,1,!0),Sa=hn(Ws,ll,mt(10925246,{metalness:.8,roughness:.29,side:Oe.DoubleSide}),0,0,-6.5);Sa.rotation.x=Math.PI/2,yi(Ws,23.3,.85,ai(),0,0,-12),yi(Ws,24,.38,mt(5464170,{metalness:.8}),0,0,-2);const Jr=Qn("gas",Xe(0,30,-6.9),Xe(33,0,-23)),xs=mt(12035557,{transparent:!0,opacity:.11,roughness:.9,metalness:0,depthWrite:!1,side:Oe.DoubleSide});kn(Jr,22.4,9,xs,0,0,0);const Kr=new Oe.SphereGeometry(.46,8,6),so=mt(7986164,{emissive:878728,emissiveIntensity:.25,transparent:!0,opacity:.7}),Xs=new Oe.SphereGeometry(.46,20,14),Oi=[];for(let y=0;y<52;y++){const z=y*2.39996323,V=Math.sqrt((y+.5)/52)*21,ne=hn(Jr,Kr,so.clone(),Math.cos(z)*V,Math.sin(z)*V,Math.sin(y*1.91)*3.5);ne.userData.neutralGas=!0,Oi.push(ne)}const Ki=Oi.map(y=>y.position.clone()),Qi=Qn("anode",Xe(0,30,-6.7),Xe(63,0,0)),Ii=mt(14262858,{metalness:.82,roughness:.27});yi(Qi,13.8,.22,Ii,0,0,0),Zn(Qi,[[13.8,0,0],[19,0,0],[25,0,0],[28,0,1.8]],.23,Ii),kn(Qi,1.65,3,mt(14998727,{roughness:.32}),25,0,0,16);const Rr=Qn("window",Xe(0,30,-14.8),Xe(-6,0,-59));kn(Rr,22.5,.16,mt(11839627,{metalness:.18,roughness:.28,transparent:!0,opacity:.58,depthWrite:!1,side:Oe.DoubleSide}),0,0,0),yi(Rr,23.2,.75,ai(),0,0,-.15);const Mi=[];for(let y=-21;y<=21;y+=1.65){const z=Math.sqrt(488.4100000000001-y*y);Mi.push(y,-z,-1.1,y,z,-1.1,-z,y,-1.1,z,y,-1.1)}const qs=new Oe.BufferGeometry;qs.setAttribute("position",new Oe.Float32BufferAttribute(Mi,3));const cl=new Oe.LineSegments(qs,new Oe.LineBasicMaterial({color:6844506,transparent:!0,opacity:.85}));Rr.add(cl),yi(Rr,21.7,.1,mt(14471351,{transparent:!0,opacity:.7}),0,0,-.2),_r(vi,25,6,0,60,-16.5,(y,z,V)=>{y.fillStyle="#fff",y.font="italic bold 145px Georgia",y.fillText("Ranger",8,V*.8)},!0);const xr=Qn("voltage",Xe(15,-7,0),Xe(75,-18,27));sn(xr,23,25,1.2,1.3,mt(1595202),0,0,0),sn(xr,10,9,7,1,mt(2370616),0,3,4);for(const y of[-7,7])kn(xr,2.1,6,mt(1387843),y,-7,3),kn(xr,1.9,.15,ai(),y,-7,6.1);for(let y=0;y<6;y++)sn(xr,2.4,1.1,.7,.2,mt(13481353),-8+y*3.2,10,1);const ji=Qn("counter",Xe(-8,18,5.5),Xe(25,7,42));sn(ji,46,68,1.25,3,mt(2121547),0,0,0);const $n=mt(5218439,{metalness:.3,roughness:.7});for(let y=0;y<9;y++)sn(ji,.42,40-y*2,.13,.1,$n,-19+y*4.6,2,.72),sn(ji,35-y*2,.42,.13,.1,$n,0,-26+y*6,.73);sn(ji,17,18,2.3,.6,mt(2435890),-3,6,1.7);for(let y=0;y<8;y++)for(const z of[-1,1])sn(ji,2.3,.65,.5,.1,ai(),-3+z*9.5,1+y*1.7,1.1);for(let y=0;y<10;y++)sn(ji,2.8,1.8,.9,.2,mt(y%3===0?3884368:12825237),-16+y%5*7,-15-Math.floor(y/5)*7,1.3);for(const y of[-18,18])for(const z of[-29,29])kn(ji,1.3,1.5,ai(),y,z,1,16);const Ys=kn(ji,6,4,mt(2239026),11,21,2.8);yi(ji,3,.4,mt(593170),11,21,5);const Ir=Qn("battery",Xe(0,-43,-1),Xe(6,-37,5));sn(Ir,48,53,2,3,mt(1647920),0,0,-5);for(const y of[-12,12]){const z=hn(Ir,new Oe.CylinderGeometry(7,7,48,28),mt(12630178,{metalness:.66,roughness:.4}),y,0,1.5),V=hn(Ir,new Oe.CylinderGeometry(7,7,12,28),mt(2637396,{metalness:.3}),y,18,1.5);hn(Ir,new Oe.CylinderGeometry(2.4,2.4,1.2,20),ai(),y,24.6,1.5),hn(Ir,new Oe.CylinderGeometry(5,5,.45,24),ai(),y,-24.2,1.5);for(const ne of[-26,26]){const ye=hn(Ir,new Oe.BoxGeometry(9,.6,8),ai(),y,ne,1);ye.rotation.x=.2}_r(Ir,8,25,y,0,8.7,(ne,ye,le)=>{ne.fillStyle="#273948",ne.font="bold 210px Arial",ne.textAlign="center",ne.fillText("AA",ye/2,le*.45),ne.font="130px Arial",ne.fillText("1.5 V",ye/2,le*.7),ne.fillText("+",ye/2,le*.18)})}const Pr=[];let Lr={positive:0,negative:0};function ys(y,z,V){const ne=kn(y,1.25,1.4,mt(3423815,{metalness:.65,roughness:.35}),...z,20);ne.userData.polarity=V;const ye=kn(y,.67,1.7,mt(12634061,{metalness:.8,roughness:.25}),...z,16);ye.userData.polarity=V}function ba(y,z,V,ne){const ye=y==="positive",le=ye?11028802:3501467;ys(xr,z,y),ys(ln[V],ne,y),_r(xr,3.3,3.3,z[0],z[1]-3,z[2]+1.05,(Mt,wt,Bt)=>{Mt.fillStyle=ye?"#b63832":"#2865b1",Mt.font="bold "+Math.round(Bt*.94)+"px Arial",Mt.textAlign="center",Mt.textBaseline="middle",Mt.fillText(ye?"+":"\u2212",wt/2,Bt*.52)});const $e=hn(tn,new Oe.BufferGeometry,mt(le,{roughness:.72,metalness:0}));$e.name=ye?"HV + \u2192 Anode":"HV \u2212 \u2192 Kathodenmantel",$e.userData={partId:"voltage",polarity:y,electricalLead:!0},Pr.push({id:y,source:{part:"voltage",local:z},target:{part:V,local:ne},lead:$e,points:[]})}ba("positive",[6,12,4],"anode",[28,0,1.8]),ba("negative",[-6,12,4],"cathode",[-24,0,-6.5]);function vs(y){return ln[y.part].localToWorld(Xe(...y.local))}function Zs(){tn.updateMatrixWorld(!0),Pr.forEach(y=>{const z=vs(y.source),V=vs(y.target),ne=y.id==="positive",ye=ur(Ut,.3,.6),le=z.toArray().concat(V.toArray(),ye,tn.matrixWorld.elements).join(",");if(y.pose===le)return;y.pose=le;const $e=tn.worldToLocal(z.clone()),Mt=tn.worldToLocal(V.clone()),wt=2+12*ye,Bt=2+3*ye,Sn=ne?Math.max($e.x,Mt.x)+wt:Math.min($e.x,Mt.x)-wt,Rn=Math.min($e.z,Mt.z)-5-2*ye,Sr=tn.worldToLocal(ln.voltage.localToWorld(Xe(y.source.local[0],y.source.local[1]+3,y.source.local[2]+4))),pi=Math.min($e.y-8,Mt.y-32),Is=[$e,Sr,Xe(Sr.x,pi,Rn),Xe(Sn,pi,Rn),Xe(Sn,Mt.y-6,Rn),Xe(Mt.x+(ne?Bt:-Bt),Mt.y,Mt.z-3),Mt],ls=new Oe.CatmullRomCurve3(Is),xo=y.lead.geometry;y.lead.geometry=new Oe.TubeGeometry(ls,72,.62,9,!1),xo.dispose(),y.points=Is.map(yo=>tn.localToWorld(yo.clone()).toArray())})}function ao(){return Zs(),Pr.map(y=>({id:y.id,polarity:y.id,source:{part:y.source.part,local:y.source.local.slice(),world:vs(y.source).toArray()},target:{part:y.target.part,local:y.target.local.slice(),world:vs(y.target).toArray()},points:y.points.map(z=>z.slice()),cableStart:y.points[0].slice(),cableEnd:y.points[y.points.length-1].slice()}))}const $s={cathode:[0,23.3,-12],gas:[-6,8,-.3],anode:[13.8,0,0],voltage:[0,3,8],counter:[-3,6,3],battery:[-12,0,8.5],window:[0,0,-.2],display:[0,42,17.5],shell:[-24,0,15],rear:[-26,0,-16]};function Dr(y){return ln[y]?(tn.updateMatrixWorld(!0),ln[y].localToWorld(Xe(...$s[y]||[0,0,0])).toArray()):null}function oo(y){y=y||{};const z=V=>Math.max(0,Math.min(1,Number(V)||0));return Lr={positive:z(y.positive),negative:z(y.negative)},Nr(),Vn}const On=new Oe.Group;On.name="Schematische Vorg\xE4nge",Xt.add(On);let hr={phase:"off",progress:0},er=8,Ur=null,Si=null,Js=null,yr=0,bi=0;const Fr=mt(1153203,{emissive:19297,emissiveIntensity:.5,roughness:.25}),Pi=mt(13789719,{emissive:4921091,emissiveIntensity:.3,roughness:.4}),zi=hn(On,new Oe.SphereGeometry(1.15,16,10),mt(16768115,{emissive:15179557,emissiveIntensity:1}));function Qr(y,z){const V=document.createElement("canvas");V.width=V.height=128;const ne=V.getContext("2d");ne.fillStyle=z,ne.font="bold 105px Arial",ne.textAlign="center",ne.textBaseline="middle",ne.fillText(y,64,68);const ye=new Oe.CanvasTexture(V);return Bi.push(ye),new Oe.SpriteMaterial({map:ye,transparent:!0,depthTest:!1,depthWrite:!1})}const Ms=Qr("\u2212","#082a3e"),Ss=Qr("+","#54230b");function lo(y,z,V){const ne=new Oe.Sprite(z.clone());ne.scale.set(V,V,1),ne.renderOrder=20,y.add(ne)}const bs=new Oe.SphereGeometry(1.1,12,8),jr=[];for(let y=0;y<16;y++){const z={origin:Oi[y].position.clone(),e:hn(On,new Oe.SphereGeometry(.75,12,8),Fr),ion:hn(On,bs,Pi.clone())};z.e.userData={role:"electron",index:y},z.ion.userData={role:"ion",index:y},lo(z.e,Ms,1.15),lo(z.ion,Ss,1.55),jr.push(z)}const Ta=jr.map((y,z)=>{const V=yi(On,.8,.045,mt(15251792,{emissive:9260040,emissiveIntensity:.7,transparent:!0,opacity:0,depthWrite:!1}),0,0,0);return V.userData={role:"collision",index:z},V.visible=!1,V}),es=[];for(let y=0;y<34;y++)es.push(hn(On,new Oe.SphereGeometry(.46,8,6),Fr));const ts=hn(On,new Oe.SphereGeometry(1.45,12,8),Fr),Ts=[];for(let y=0;y<8;y++){const z=y*Math.PI/4,V=new Oe.ArrowHelper(Xe(0,0,1),Xe(Math.cos(z)*13.8,Math.sin(z)*13.8,.4),4.8,14261812,1.4,.7);V.userData={role:"field",index:y},On.add(V),Ts.push(V)}const co=new Oe.BufferGeometry().setFromPoints([Xe(0,0,-58),Xe(0,0,-5)]),hi=new Oe.Line(co,new Oe.LineDashedMaterial({color:15776580,dashSize:1.6,gapSize:1.5,transparent:!0,opacity:.6}));hi.computeLineDistances(),On.add(hi);const Ks=yi(On,13.8,.47,mt(8186367,{emissive:3782886,emissiveIntensity:1,transparent:!0,opacity:.8,depthWrite:!1}),0,0,0);function ho(y,z){y=String(y||"off");const V=y!==hr.phase;return hr={phase:y,progress:Math.max(0,Math.min(1,Number(z)||0))},V&&Nr(),Nn=!0,Vn}function uo(y){return er=Math.max(1,Math.min(8,Math.round(Number(y)||8))),Nn=!0,Vn}function ns(y){if(y===null||typeof y!="object")Ur=null;else{Ur={};for(const z of["electron","ion"])Number.isFinite(y[z])&&(Ur[z]=Math.max(0,Math.min(1,y[z])))}return Nn=!0,Vn}function Qs(y){const z=Si!==null;if(y===null)Si=null,Js=null,Oi.forEach((V,ne)=>{V.position.copy(Ki[ne]),V.scale.setScalar(1),V.geometry=Kr});else{if(!Mn.RangerAtomicMotion)throw new Error("atomic-motion.js muss vor model.js geladen werden.");Si=Object.assign({},y)}return z!==(Si!==null)&&Nr(),Nn=!0,Vn}function As(y){const z=y===!0?1:y===!1?0:Math.max(0,Math.min(1,Number(y)||0));return z!==yr&&(yr=z,Nr()),Nn=!0,Vn}function fo(y){const z=Math.max(0,Math.min(1,Number(y)||0));return z!==bi&&(bi=z,Nr()),Nn=!0,Vn}function Aa(){if(Si===null)return null;const y=Mn.RangerAtomicMotion.evaluate(Number(Si.time)||0,Object.assign({},Si,{chargeProgress:Ur}));return Object.assign(y,{sensorOrigin:Jr.position.toArray()})}function po(){Js=Aa();const y=Js,z=hr.phase,V=hr.progress;On.visible=!0,On.position.copy(Jr.position),y.atoms.forEach((ye,le)=>{Oi[le].position.fromArray(ye.position),Oi[le].visible=ye.visible,Oi[le].scale.setScalar(.22/.46),Oi[le].geometry=Xs}),jr.forEach((ye,le)=>{const $e=y.electrons[le],Mt=y.ions[le];ye.e.position.fromArray($e.position),ye.ion.position.fromArray(Mt.position),ye.e.visible=$e.visible,ye.ion.visible=Mt.visible,ye.e.scale.setScalar(.11/.75),ye.ion.geometry=Xs,ye.ion.scale.setScalar(.22/.46);const wt=ur(y.time,Mt.neutralizedAt-.45,Mt.neutralizedAt),Bt=ye.ion.material,Sn=Oi[le].material;Bt.color.copy(Pi.color).lerp(Sn.color,wt),Bt.emissive.copy(Pi.emissive).lerp(Sn.emissive,wt),Bt.emissiveIntensity=Pi.emissiveIntensity+(Sn.emissiveIntensity-Pi.emissiveIntensity)*wt,Bt.opacity=1+(Sn.opacity-1)*wt,Bt.roughness=Pi.roughness+(Sn.roughness-Pi.roughness)*wt,Bt.transparent=wt>0,Bt.depthWrite=Bt.opacity>.8,ye.e.children.forEach(Rn=>Rn.position.set(0,0,.05)),ye.ion.children.forEach(Rn=>{Rn.position.set(0,0,.05),Rn.material.opacity=1-wt})}),zi.visible=y.radiation.visible,zi.position.fromArray(y.radiation.position),zi.scale.setScalar(.4),hi.visible=y.radiation.visible,hi.position.set(0,0,0),hi.material.opacity=.65;const ne=hi.geometry.attributes.position;ne.setXYZ(0,...y.radiation.start),ne.setXYZ(1,...y.radiation.position),ne.needsUpdate=!0,hi.geometry.computeBoundingSphere(),hi.computeLineDistances(),Ta.forEach((ye,le)=>{const $e=y.time-y.events[le].time;ye.visible=$e>=0&&$e<.45,ye.position.fromArray(y.events[le].position),ye.scale.setScalar(.275+Math.max(0,$e)*.25),ye.material.opacity=ye.visible?(1-$e/.45)*.85:0}),es.forEach(ye=>{ye.visible=!1}),Ts.forEach(ye=>{const le=y.fieldStrength,$e=bi*(.25+.75*le),Mt=4.8*le;ye.visible=$e>0,ye.setLength(Mt,Math.min(1.4,Mt*.32),Math.min(.7,Mt*.18)),ye.userData.fieldStrength=le,ye.line.material.transparent=ye.cone.material.transparent=!0,ye.line.material.opacity=ye.cone.material.opacity=$e}),Ks.visible=!1,ts.visible=!1}function mo(){if(Si!==null){po();return}Ta.forEach(le=>{le.visible=!1}),zi.scale.setScalar(1);const y=hi.geometry.attributes.position;y.setXYZ(0,0,0,-58),y.setXYZ(1,0,0,-5),y.needsUpdate=!0,hi.geometry.computeBoundingSphere(),hi.computeLineDistances();const z=hr.phase,V=hr.progress;if(On.visible=z!=="off"&&z!=="none",Oi.forEach((le,$e)=>{le.visible=!On.visible||$e>=er||z==="incoming"||z==="ionization"&&$e/er>=V||z==="deadtime"&&V>.92}),!On.visible)return;On.position.copy(Jr.position),zi.visible=z==="incoming"||z==="ionization";const ne=jr[0].origin;er===1?zi.position.set(ne.x,ne.y,z==="incoming"?-58+V*(58+ne.z):ne.z+V*3.5):zi.position.set(-7,3,z==="incoming"?-58+V*50:-8+V*11),hi.visible=z==="incoming"||z==="ionization",hi.position.set(er===1?ne.x:-7,er===1?ne.y:3,er===1?ne.z+5:0),hi.material.opacity=z==="incoming"?.55:.55*(1-V),Ts.forEach(le=>{le.setLength(4.8,1.4,.7),le.visible=z==="drift"||z==="deadtime",le.line.material.transparent=le.cone.material.transparent=!0,le.line.material.opacity=le.cone.material.opacity=z==="deadtime"?V:1}),Ks.visible=["avalanche","pulse","quench","deadtime"].includes(z),Ks.material.opacity=z==="quench"?.8*(1-V):z==="deadtime"?.12+.35*V:.8;const ye=["ionization","drift","avalanche","pulse","quench","deadtime"].includes(z);if(jr.forEach((le,$e)=>{const Mt=ye&&$e<er&&(z!=="ionization"||$e/er<V);le.e.visible=Mt&&(z==="ionization"||z==="drift"),le.ion.visible=Mt;const wt=le.origin,Bt=Xe(wt.x,wt.y,.2).normalize().multiplyScalar(13.8);Bt.z=.2;const Sn=Xe(wt.x,wt.y,5.4),Rn=Ur?.electron??(z==="drift"?V:0),Sr=Ur?.ion??(z==="drift"?V*.12:z==="avalanche"?.12+V*.1:z==="pulse"?.22+V*.08:z==="quench"?.3+V*.35:z==="deadtime"?.65+V*.35:0);le.e.position.copy(wt).lerp(Bt,Rn),z==="ionization"&&(le.e.position.x+=.8+Math.max(0,V-$e/er)*1.5),le.ion.position.copy(wt).lerp(Sn,Sr),le.e.scale.setScalar(1),le.ion.scale.setScalar(z==="deadtime"?Math.min(1,(1-V)*5):1),le.ion.geometry=bs,le.ion.material.copy(Pi),le.ion.children.forEach(pi=>{pi.material.opacity=1}),le.e.children.forEach(pi=>pi.position.set(0,0,0)),le.ion.children.forEach(pi=>pi.position.set(0,0,0))}),es.forEach((le,$e)=>{le.visible=z==="avalanche"&&$e/es.length<=V;const Mt=.15+Math.sin($e*2.7)*(.05+.3*V),wt=13.8+(1-V)*(2+$e%5*.4);le.position.set(Math.cos(Mt)*wt,Math.sin(Mt)*wt,Math.sin($e*1.9)*(.8*(1-V)+.2))}),ts.visible=z==="pulse",ts.visible){const le=Qi.position.clone().add(Xe(28,0,1.8)),$e=ji.position.clone().add(Xe(-3,6,4));ts.position.copy(le.lerp($e,V)).sub(On.position)}}const vr=new Oe.Box3Helper(new Oe.Box3,15115832);vr.visible=!1,vr.material.transparent=!0,vr.material.opacity=.7,Xt.add(vr);function Ea(y){for(;y&&y!==tn;){if(y.userData.partId)return y.userData.partId;y=y.parent}return null}tn.traverse(y=>{if(y.material)for(const z of[].concat(y.material))!z.userData.baseOpacity&&z.userData.baseOpacity!==0&&(z.userData.baseOpacity=z.opacity,z.userData.baseColor=z.color?z.color.getHex():null,z.userData.baseEmissive=z.emissive?z.emissive.getHex():null)});function Nr(){const y=Si===null&&hr.phase!=="off"&&hr.phase!=="none",z=y||si&&Ke.has(si);tn.traverse(V=>{if(!V.material)return;const ne=Ea(V),ye=ne===si;for(const le of[].concat(V.material)){const $e=z&&!ye,Mt=le.userData.baseOpacity===void 0?1:le.userData.baseOpacity;if(le.opacity=$e?Math.min(Mt,.18):Mt,y&&(["shell","rear","display","battery","voltage","counter"].includes(ne)?le.opacity=Math.min(Mt,.025):ne==="cathode"?le.opacity=V.userData.cathodeBacking?.07:.55:ne==="anode"?le.opacity=Mt:ne==="window"?le.opacity=V.isLineSegments?.16:.08:ne==="gas"&&(le.opacity=V.userData.neutralGas?.2:Math.min(Mt,.13))),Si!==null&&V.userData.neutralGas&&(le.opacity=.88),yr>0&&!V.userData.neutralGas){const Sn=ne==="anode"?.1+.4*bi:ne==="cathode"?(V.userData.cathodeBacking?.12:.3)*bi:0;le.opacity=le.opacity*(1-yr)+Sn*yr}le.color&&le.userData.baseColor!==null&&le.color.setHex(Si!==null&&V.userData.neutralGas?9346474:le.userData.baseColor),le.transparent=le.opacity<1||!!le.map,le.depthWrite=!$e&&le.opacity>.8,le.emissive&&(le.emissive.setHex(Si!==null&&V.userData.neutralGas?1120285:ye?7092224:le.userData.baseEmissive||0),le.emissiveIntensity=ye?.36:le.userData.baseEmissiveIntensity??1);const wt=V.userData.polarity||(ne==="anode"?"positive":ne==="cathode"?"negative":null),Bt=wt?Lr[wt]:0;if(Bt>0){const Sn=new Oe.Color(wt==="positive"?14826550:2649309);le.color&&le.color.lerp(Sn,Bt),le.emissive&&(le.emissive.lerp(Sn,Bt),le.emissiveIntensity+=(.32-le.emissiveIntensity)*Bt)}le.needsUpdate=!0}V.userData.neutralGas||(V.visible=[].concat(V.material).some(le=>le.opacity>0)),V.castShadow=yr===0&&(!z||ye)}),vr.visible=!1,Nn=!0}const ur=(y,z,V)=>{const ne=Math.max(0,Math.min(1,(y-z)/(V-z)));return ne*ne*(3-2*ne)};function dr(){_s.forEach(y=>{y.group.position.copy(y.base);const z=y.group.userData.partId;if(z==="shell")y.group.position.addScaledVector(Xe(-45,12,65),ur(Ut,0,.3));else if(z==="counter"||z==="voltage"){const V=ur(Ut,.3,.6);y.group.position.addScaledVector(Xe(45,0,22),V),y.group.rotation.y=Math.PI*V}else z==="rear"?y.group.position.addScaledVector(Xe(190,-18,-42),ur(Ut,.35,.65)):z==="window"&&y.group.position.addScaledVector(Xe(-34,0,-22),ur(Ut,.6,1))}),mn.position.y=-83-15*ur(Ut,.35,.65),tn.updateMatrixWorld(!0),Zs(),si&&vr.box.setFromObject(ln[si]),Nn=!0}function is(y,z){return Ut=Math.max(0,Math.min(1,Number(y)||0)),dr(),z?.preserveView||(si?new Oe.Box3().setFromObject(ln[si]).getCenter(He):(Kt=280+Ut*75,He.set(0,-2,0)),Dt.manual&&(Ce.copy(He),Et=Kt)),Vn}function go(y,z){const V={window:0,display:0,shell:0,rear:0,counter:.4,voltage:.4,battery:.65,cathode:1,anode:1,gas:1},ne=V[y]===void 0?0:V[y];return z?.apply&&is(ne,z),ne}function rs(y){return si=ln[y]?y:null,Nr(),dr(),Vn}function ss(y,z){if(!ln[y])return Vn;z=z||{},rs(y);const V=new Oe.Box3().setFromObject(ln[y]);V.getCenter(He);const ne=V.getSize(Xe(0,0,0));return Kt=Math.max(Ke.has(y)?205:130,Math.max(ne.x,ne.y,ne.z)*2.8),rn=["window","anode","cathode","gas","battery"].includes(y)?-2.85:.4,Zt=y==="window"?.1:.3,(y==="voltage"||y==="counter")&&(rn=.4+2.45*ur(Ut,.3,.6)),(z.immediate||Dt.manual)&&(bt=rn,Tt=Zt,Et=Kt,Ce.copy(He)),Nn=!0,Vn}function Br(){return rs(null),rn=.43,Zt=.2,Kt=280+Ut*95,He.set(16*Ut,-2,0),Dt.manual&&(bt=rn,Tt=Zt,Et=Kt,Ce.copy(He)),Nn=!0,Vn}function Es(){const y=Math.cos(Tt);ri.position.set(Ce.x+Math.sin(bt)*y*Et,Ce.y+Math.sin(Tt)*Et,Ce.z+Math.cos(bt)*y*Et),ri.lookAt(Ce),ri.updateMatrixWorld()}function js(y){if($i)return;const z=Math.max(0,Number(y)||0);return Dt.manual&&(bt=rn,Tt=Zt,Et=Kt,Ce.copy(He)),Es(),mo(),Zs(),si&&vr.box.setFromObject(ln[si]),Tn.render(Xt,ri),Nn=!1,Ve=z,Vn}function ws(y,z){const V=jt.getBoundingClientRect();return y=y||V.width||640,z=z||V.height||420,Tn.setSize(y,z,!1),ri.aspect=y/z,ri.updateProjectionMatrix(),Nn=!0,Dt.manual&&js(Ve||0),Vn}function wa(y){return y.target&&(He.fromArray(y.target),Ce.copy(He)),Number.isFinite(y.yaw)&&(bt=rn=y.yaw),Number.isFinite(y.pitch)&&(Tt=Zt=y.pitch),Number.isFinite(y.distance)&&(Et=Kt=y.distance),Nn=!0,Vn}function _o(){return{yaw:bt,pitch:Tt,distance:Et,target:Ce.toArray()}}function Or(y){return Kt=Math.max(70,Math.min(700,Kt*y)),Dt.manual&&(Et=Kt),Nn=!0,Vn}const Gi=new Map;let Cs=0,zr=!1,as=null;function Rs(y){if(en.focus({preventScroll:!0}),en.setPointerCapture(y.pointerId),Gi.set(y.pointerId,{x:y.clientX,y:y.clientY}),en.style.cursor="grabbing",zr=!1,as={x:y.clientX,y:y.clientY},Gi.size===2){const z=Array.from(Gi.values());Cs=Math.hypot(z[0].x-z[1].x,z[0].y-z[1].y)}}function fr(y){if(!Gi.has(y.pointerId))return;const z=Gi.get(y.pointerId);if(Gi.set(y.pointerId,{x:y.clientX,y:y.clientY}),Math.hypot(y.clientX-as.x,y.clientY-as.y)>5&&(zr=!0),Gi.size===1)rn-=(y.clientX-z.x)*.009,Zt=Math.max(-1.4,Math.min(1.4,Zt+(y.clientY-z.y)*.007));else{const V=Array.from(Gi.values()),ne=Math.hypot(V[0].x-V[1].x,V[0].y-V[1].y);Cs>0&&ne>0&&Or(Cs/ne),Cs=ne}Dt.manual&&(bt=rn,Tt=Zt),Nn=!0}function tr(y){if(Gi.delete(y.pointerId),Gi.size||(en.style.cursor="grab"),!zr&&Dt.onSelect){const z=en.getBoundingClientRect(),V=new Oe.Raycaster;V.setFromCamera(new Oe.Vector2((y.clientX-z.left)/z.width*2-1,-(y.clientY-z.top)/z.height*2+1),ri);const ye=V.intersectObject(tn,!0).find(le=>le.object.material&&le.object.material.opacity>.15);ye&&Dt.onSelect(Ea(ye.object))}}function Gr(y){document.activeElement!==en&&!y.ctrlKey||(y.preventDefault(),Or(Math.exp(y.deltaY*.0015)))}function os(y){["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-","0"].indexOf(y.key)<0||(y.preventDefault(),y.key==="ArrowLeft"&&(rn-=.15),y.key==="ArrowRight"&&(rn+=.15),y.key==="ArrowUp"&&(Zt=Math.min(1.4,Zt+.1)),y.key==="ArrowDown"&&(Zt=Math.max(-1.4,Zt-.1)),(y.key==="+"||y.key==="=")&&Or(.9),y.key==="-"&&Or(1.1),y.key==="0"&&Br(),Nn=!0)}Dt.interactive!==!1&&(en.addEventListener("pointerdown",Rs),en.addEventListener("pointermove",fr),en.addEventListener("pointerup",tr),en.addEventListener("pointercancel",tr),en.addEventListener("wheel",Gr,{passive:!1}),en.addEventListener("keydown",os));let Mr=null;Mn.ResizeObserver&&(Mr=new ResizeObserver(()=>ws()),Mr.observe(jt));function ea(y){if($i)return;const z=Ve===null?.016:Math.min(.06,Math.max(.001,y/1e3-Ve));Ve=y/1e3;const V=1-Math.exp(-z*10);Math.abs(bt-rn)+Math.abs(Tt-Zt)+Math.abs(Et-Kt)+Ce.distanceTo(He)>.002&&(bt+=(rn-bt)*V,Tt+=(Zt-Tt)*V,Et+=(Kt-Et)*V,Ce.lerp(He,V),Nn=!0),Nn&&js(y/1e3),Re=requestAnimationFrame(ea)}function Ca(){$i=!0,cancelAnimationFrame(Re),Mr&&Mr.disconnect(),en.removeEventListener("pointerdown",Rs),en.removeEventListener("pointermove",fr),en.removeEventListener("pointerup",tr),en.removeEventListener("pointercancel",tr),en.removeEventListener("wheel",Gr),en.removeEventListener("keydown",os);const y=new Set([Kr,Xs,bs]),z=new Set([Pi,Ms,Ss]);Xt.traverse(V=>{V.geometry&&y.add(V.geometry),V.material&&[].concat(V.material).forEach(ne=>z.add(ne))}),y.forEach(V=>V.dispose()),z.forEach(V=>V.dispose()),Bi.forEach(V=>V.dispose()),Tn.dispose(),en.remove()}function Ra(){tn.updateMatrixWorld(!0);const y=tn.clone(!0),z=new Map;y.traverse(ne=>{if(ne.geometry&&ne.geometry.parameters){if(!z.has(ne.geometry)){const ye=new Oe.BufferGeometry().copy(ne.geometry);ye.name=ne.geometry.name,ye.userData=Object.assign({},ne.geometry.userData,{sourceGeometryType:ne.geometry.type}),z.set(ne.geometry,ye)}ne.geometry=z.get(ne.geometry)}});const V=y.toJSON();return z.forEach(ne=>ne.dispose()),V}const Vn={scene:Xt,camera:ri,renderer:Tn,model:tn,parts:ln,canvas:en,setExplosion:is,revealPart:go,highlightPart:rs,focusPart:ss,resetView:Br,resize:ws,renderAt:js,setView:wa,getView:_o,zoom:Or,zoomBy:Or,setPhase:ho,setPairCount:uo,setChargeProgress:ns,setAtomicClock:Qs,getAtomicState:Aa,setMicroscopic:As,getMicroscopic:()=>yr,setFieldVisibility:fo,getFieldVisibility:()=>bi,setPolarityHighlight:oo,getPolarityHighlight:()=>Object.assign({},Lr),getElectricalConnections:ao,getPartAnchor:Dr,dispose:Ca,exportModel:Ra,getExplosion:()=>Ut,getHighlight:()=>si,sensor:{center:[0,30,-6.9],windowCenter:[0,30,-14.8],outwardNormal:[0,0,-1],anodeRadius:13.8},mechanism:On};return ws(),dr(),js(0),Dt.manual||(Re=requestAnimationFrame(ea)),Vn}})(window);
