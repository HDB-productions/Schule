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

*/const gmzThreeCore=(()=>{const Pn={};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $t={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},At={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Be=0,Ct=1,di=2,vn=3,Qt=0,Ln=1,Mn=2,as=3,ze=0,qe=1,we=2,$e=0,lt=1,Yt=2,Lt=3,hn=4,an=5,pn=100,dt=101,Nt=102,jt=103,An=104,kn=200,ti=201,Sn=202,En=203,Mt=204,$n=205,Vn=206,Rt=207,Zi=208,Ti=209,Ui=210,fi=211,dn=212,Fi=213,os=214,Fn=0,Ni=1,Ar=2,Hn=3,Er=4,$o=5,Gr=6,pi=7,kr=0,Jo=1,Ya=2,oa=0,Za=1,$i=2,Ko=3,Cs=4,Rs=5,Qo=6,jo=7,la="attached",Vr="detached",ls=300,Hr=301,$a=302,ca=303,Ji=304,Ki=306,Qi=1e3,Ai=1001,wr=1002,mi=1003,Is=1004,el=1004,Cr=1005,Bi=1005,Wn=1006,Ps=1007,Rr=1007,mn=1008,Ei=1008,gi=1009,Ir=1010,_i=1011,Ls=1012,dr=1013,or=1014,lr=1015,Ja=1016,fr=1017,ha=1018,tl=1020,Ka=35902,ua=35899,Wr=1021,da=1022,Oi=1023,pr=1026,Xr=1027,cs=1028,Xn=1029,qr=1030,Ds=1031,nl=1032,fa=1033,Qa=33776,ja=33777,pa=33778,Us=33779,ma=35840,eo=35841,mr=35842,ga=35843,Yr=36196,Zr=37492,gr=37496,hs=37808,us=37809,Fs=37810,to=37811,_a=37812,no=37813,ds=37814,Ns=37815,io=37816,ro=37817,wi=37818,oi=37819,fs=37820,$r=37821,_r=36492,Pr=36494,Jr=36495,Bs=36283,Os=36284,zs=36285,ps=36286,xa=2200,so=2201,ao=2202,Dn=2300,S=2301,z=2302,V=2400,oe=2401,Me=2402,me=2500,xt=2501,tn=0,Xt=1,qn=2,zi=3200,Lr=3201,ms=3202,cr=3203,xr=0,Gs=1,oo="",Ci="srgb",lo="srgb-linear",co="linear",ya="srgb",$l=0,Kr=7680,Jl=7681,Kl=7682,Ql=7683,jl=34055,ec=34056,tc=5386,nc=512,ic=513,rc=514,sc=515,ac=516,oc=517,lc=518,ho=519,cc=512,hc=513,Qc=514,jc=515,il=516,su=517,eh=518,th=519,va=35044,uc=35048,au=35040,nh=35045,ou=35049,lu=35041,cu=35046,hu=35050,uu=35042,du="100",fu="300 es",yr=2e3,Ma=2001,pu={COMPUTE:"compute",RENDER:"render"},mu={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},gu={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"};class Qr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const xi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ih=1234567;const ks=Math.PI/180,Sa=180/Math.PI;function ji(){const u=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xi[u&255]+xi[u>>8&255]+xi[u>>16&255]+xi[u>>24&255]+"-"+xi[e&255]+xi[e>>8&255]+"-"+xi[e>>16&15|64]+xi[e>>24&255]+"-"+xi[t&63|128]+xi[t>>8&255]+"-"+xi[t>>16&255]+xi[t>>24&255]+xi[n&255]+xi[n>>8&255]+xi[n>>16&255]+xi[n>>24&255]).toLowerCase()}function vt(u,e,t){return Math.max(e,Math.min(t,u))}function dc(u,e){return(u%e+e)%e}function _u(u,e,t,n,i){return n+(u-e)*(i-n)/(t-e)}function xu(u,e,t){return u!==e?(t-u)/(e-u):0}function uo(u,e,t){return(1-t)*u+t*e}function yu(u,e,t,n){return uo(u,e,1-Math.exp(-t*n))}function vu(u,e=1){return e-Math.abs(dc(u,e*2)-e)}function Mu(u,e,t){return u<=e?0:u>=t?1:(u=(u-e)/(t-e),u*u*(3-2*u))}function Su(u,e,t){return u<=e?0:u>=t?1:(u=(u-e)/(t-e),u*u*u*(u*(u*6-15)+10))}function bu(u,e){return u+Math.floor(Math.random()*(e-u+1))}function Tu(u,e){return u+Math.random()*(e-u)}function Au(u){return u*(.5-Math.random())}function Eu(u){u!==void 0&&(ih=u);let e=ih+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function wu(u){return u*ks}function Cu(u){return u*Sa}function Ru(u){return(u&u-1)===0&&u!==0}function Iu(u){return Math.pow(2,Math.ceil(Math.log(u)/Math.LN2))}function Pu(u){return Math.pow(2,Math.floor(Math.log(u)/Math.LN2))}function Lu(u,e,t,n,i){const r=Math.cos,s=Math.sin,a=r(t/2),l=s(t/2),c=r((e+n)/2),d=s((e+n)/2),p=r((e-n)/2),m=s((e-n)/2),g=r((n-e)/2),_=s((n-e)/2);switch(i){case"XYX":u.set(a*d,l*p,l*m,a*c);break;case"YZY":u.set(l*m,a*d,l*p,a*c);break;case"ZXZ":u.set(l*p,l*m,a*d,a*c);break;case"XZX":u.set(a*d,l*_,l*g,a*c);break;case"YXY":u.set(l*g,a*d,l*_,a*c);break;case"ZYZ":u.set(l*_,l*g,a*d,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ri(u,e){switch(e.constructor){case Float32Array:return u;case Uint32Array:return u/4294967295;case Uint16Array:return u/65535;case Uint8Array:return u/255;case Int32Array:return Math.max(u/2147483647,-1);case Int16Array:return Math.max(u/32767,-1);case Int8Array:return Math.max(u/127,-1);default:throw new Error("Invalid component type.")}}function Bt(u,e){switch(e.constructor){case Float32Array:return u;case Uint32Array:return Math.round(u*4294967295);case Uint16Array:return Math.round(u*65535);case Uint8Array:return Math.round(u*255);case Int32Array:return Math.round(u*2147483647);case Int16Array:return Math.round(u*32767);case Int8Array:return Math.round(u*127);default:throw new Error("Invalid component type.")}}const Du={DEG2RAD:ks,RAD2DEG:Sa,generateUUID:ji,clamp:vt,euclideanModulo:dc,mapLinear:_u,inverseLerp:xu,lerp:uo,damp:yu,pingpong:vu,smoothstep:Mu,smootherstep:Su,randInt:bu,randFloat:Tu,randFloatSpread:Au,seededRandom:Eu,degToRad:wu,radToDeg:Cu,isPowerOfTwo:Ru,ceilPowerOfTwo:Iu,floorPowerOfTwo:Pu,setQuaternionFromProperEuler:Lu,normalize:Bt,denormalize:Ri};class Ie{constructor(e=0,t=0){Ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*n-s*i+e.x,this.y=r*i+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,s,a){let l=n[i+0],c=n[i+1],d=n[i+2],p=n[i+3];const m=r[s+0],g=r[s+1],_=r[s+2],v=r[s+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=p;return}if(a===1){e[t+0]=m,e[t+1]=g,e[t+2]=_,e[t+3]=v;return}if(p!==v||l!==m||c!==g||d!==_){let E=1-a;const w=l*m+c*g+d*_+p*v,F=w>=0?1:-1,D=1-w*w;if(D>Number.EPSILON){const Q=Math.sqrt(D),le=Math.atan2(Q,w*F);E=Math.sin(E*le)/Q,a=Math.sin(a*le)/Q}const B=a*F;if(l=l*E+m*B,c=c*E+g*B,d=d*E+_*B,p=p*E+v*B,E===1-a){const Q=1/Math.sqrt(l*l+c*c+d*d+p*p);l*=Q,c*=Q,d*=Q,p*=Q}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,i,r,s){const a=n[i],l=n[i+1],c=n[i+2],d=n[i+3],p=r[s],m=r[s+1],g=r[s+2],_=r[s+3];return e[t]=a*_+d*p+l*g-c*m,e[t+1]=l*_+d*m+c*p-a*g,e[t+2]=c*_+d*g+a*m-l*p,e[t+3]=d*_-a*p-l*m-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,s=e._order,a=Math.cos,l=Math.sin,c=a(n/2),d=a(i/2),p=a(r/2),m=l(n/2),g=l(i/2),_=l(r/2);switch(s){case"XYZ":this._x=m*d*p+c*g*_,this._y=c*g*p-m*d*_,this._z=c*d*_+m*g*p,this._w=c*d*p-m*g*_;break;case"YXZ":this._x=m*d*p+c*g*_,this._y=c*g*p-m*d*_,this._z=c*d*_-m*g*p,this._w=c*d*p+m*g*_;break;case"ZXY":this._x=m*d*p-c*g*_,this._y=c*g*p+m*d*_,this._z=c*d*_+m*g*p,this._w=c*d*p-m*g*_;break;case"ZYX":this._x=m*d*p-c*g*_,this._y=c*g*p+m*d*_,this._z=c*d*_-m*g*p,this._w=c*d*p+m*g*_;break;case"YZX":this._x=m*d*p+c*g*_,this._y=c*g*p+m*d*_,this._z=c*d*_-m*g*p,this._w=c*d*p-m*g*_;break;case"XZY":this._x=m*d*p-c*g*_,this._y=c*g*p-m*d*_,this._z=c*d*_+m*g*p,this._w=c*d*p+m*g*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],s=t[1],a=t[5],l=t[9],c=t[2],d=t[6],p=t[10],m=n+a+p;if(m>0){const g=.5/Math.sqrt(m+1);this._w=.25/g,this._x=(d-l)*g,this._y=(r-c)*g,this._z=(s-i)*g}else if(n>a&&n>p){const g=2*Math.sqrt(1+n-a-p);this._w=(d-l)/g,this._x=.25*g,this._y=(i+s)/g,this._z=(r+c)/g}else if(a>p){const g=2*Math.sqrt(1+a-n-p);this._w=(r-c)/g,this._x=(i+s)/g,this._y=.25*g,this._z=(l+d)/g}else{const g=2*Math.sqrt(1+p-n-a);this._w=(s-i)/g,this._x=(r+c)/g,this._y=(l+d)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,s=e._w,a=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+s*a+i*c-r*l,this._y=i*d+s*l+r*a-n*c,this._z=r*d+s*c+n*l-i*a,this._w=s*d-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,s=this._w;let a=s*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const g=1-t;return this._w=g*s+t*this._w,this._x=g*n+t*this._x,this._y=g*i+t*this._y,this._z=g*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),p=Math.sin((1-t)*d)/c,m=Math.sin(t*d)/c;return this._w=s*p+this._w*m,this._x=n*p+this._x*m,this._y=i*p+this._y*m,this._z=r*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,n=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,s=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*s,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*s,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,s=e.y,a=e.z,l=e.w,c=2*(s*i-a*n),d=2*(a*t-r*i),p=2*(r*n-s*t);return this.x=t+l*c+s*p-a*d,this.y=n+l*d+a*c-r*p,this.z=i+l*p+r*d-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,s=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*s-n*l,this.z=n*a-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return fc.copy(this).projectOnVector(e),this.sub(fc)}reflect(e){return this.sub(fc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fc=new U,rh=new Gi;class vr{constructor(e,t,n,i,r,s,a,l,c){vr.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,s,a,l,c)}set(e,t,n,i,r,s,a,l,c){const d=this.elements;return d[0]=e,d[1]=i,d[2]=a,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=s,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,s=n[0],a=n[3],l=n[6],c=n[1],d=n[4],p=n[7],m=n[2],g=n[5],_=n[8],v=i[0],E=i[3],w=i[6],F=i[1],D=i[4],B=i[7],Q=i[2],le=i[5],xe=i[8];return r[0]=s*v+a*F+l*Q,r[3]=s*E+a*D+l*le,r[6]=s*w+a*B+l*xe,r[1]=c*v+d*F+p*Q,r[4]=c*E+d*D+p*le,r[7]=c*w+d*B+p*xe,r[2]=m*v+g*F+_*Q,r[5]=m*E+g*D+_*le,r[8]=m*w+g*B+_*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return t*s*d-t*a*c-n*r*d+n*a*l+i*r*c-i*s*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8],p=d*s-a*c,m=a*l-d*r,g=c*r-s*l,_=t*p+n*m+i*g;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=p*v,e[1]=(i*c-d*n)*v,e[2]=(a*n-i*s)*v,e[3]=m*v,e[4]=(d*t-i*l)*v,e[5]=(i*r-a*t)*v,e[6]=g*v,e[7]=(n*l-c*t)*v,e[8]=(s*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,s,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*s+c*a)+s+e,-i*c,i*l,-i*(-c*s+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(pc.makeScale(e,t)),this}rotate(e){return this.premultiply(pc.makeRotation(-e)),this}translate(e,t){return this.premultiply(pc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const pc=new vr;function sh(u){for(let e=u.length-1;e>=0;--e)if(u[e]>=65535)return!0;return!1}const Uu={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function ba(u,e){return new Uu[u](e)}function fo(u){return document.createElementNS("http://www.w3.org/1999/xhtml",u)}function Fu(){const u=fo("canvas");return u.style.display="block",u}const ah={};function mc(u){u in ah||(ah[u]=!0,console.warn(u))}function Nu(u,e,t){return new Promise(function(n,i){function r(){switch(u.clientWaitSync(e,u.SYNC_FLUSH_COMMANDS_BIT,0)){case u.WAIT_FAILED:i();break;case u.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const oh=new vr().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lh=new vr().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bu(){const u={enabled:!0,workingColorSpace:lo,spaces:{},convert:function(i,r,s){return this.enabled===!1||r===s||!r||!s||(this.spaces[r].transfer===ya&&(i.r=jr(i.r),i.g=jr(i.g),i.b=jr(i.b)),this.spaces[r].primaries!==this.spaces[s].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===ya&&(i.r=Ta(i.r),i.g=Ta(i.g),i.b=Ta(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===oo?co:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,s){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return mc("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),u.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return mc("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),u.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return u.define({[lo]:{primaries:e,whitePoint:n,transfer:co,toXYZ:oh,fromXYZ:lh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ci},outputColorSpaceConfig:{drawingBufferColorSpace:Ci}},[Ci]:{primaries:e,whitePoint:n,transfer:ya,toXYZ:oh,fromXYZ:lh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ci}}}),u}const ki=Bu();function jr(u){return u<.04045?u*.0773993808:Math.pow(u*.9478672986+.0521327014,2.4)}function Ta(u){return u<.0031308?u*12.92:1.055*Math.pow(u,.41666)-.055}let Aa;class ch{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Aa===void 0&&(Aa=fo("canvas")),Aa.width=e.width,Aa.height=e.height;const i=Aa.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Aa}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fo("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let s=0;s<r.length;s++)r[s]=jr(r[s]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(jr(t[n]/255)*255):t[n]=jr(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ou=0;class gs{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=ji(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let s=0,a=i.length;s<a;s++)i[s].isDataTexture?r.push(gc(i[s].image)):r.push(gc(i[s]))}else r=gc(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function gc(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap?ch.getDataURL(u):u.data?{data:Array.from(u.data),width:u.width,height:u.height,type:u.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let zu=0;const _c=new U;class Yn extends Qr{constructor(e=Yn.DEFAULT_IMAGE,t=Yn.DEFAULT_MAPPING,n=Ai,i=Ai,r=Wn,s=mn,a=Oi,l=gi,c=Yn.DEFAULT_ANISOTROPY,d=oo){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=ji(),this.name="",this.source=new gs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=s,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vr,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(_c).x}get height(){return this.source.getSize(_c).y}get depth(){return this.source.getSize(_c).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ls)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qi:e.x=e.x-Math.floor(e.x);break;case Ai:e.x=e.x<0?0:1;break;case wr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qi:e.y=e.y-Math.floor(e.y);break;case Ai:e.y=e.y<0?0:1;break;case wr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Yn.DEFAULT_IMAGE=null,Yn.DEFAULT_MAPPING=ls,Yn.DEFAULT_ANISOTROPY=1;class ni{constructor(e=0,t=0,n=0,i=1){ni.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i+s[12]*r,this.y=s[1]*t+s[5]*n+s[9]*i+s[13]*r,this.z=s[2]*t+s[6]*n+s[10]*i+s[14]*r,this.w=s[3]*t+s[7]*n+s[11]*i+s[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],d=l[4],p=l[8],m=l[1],g=l[5],_=l[9],v=l[2],E=l[6],w=l[10];if(Math.abs(d-m)<.01&&Math.abs(p-v)<.01&&Math.abs(_-E)<.01){if(Math.abs(d+m)<.1&&Math.abs(p+v)<.1&&Math.abs(_+E)<.1&&Math.abs(c+g+w-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const D=(c+1)/2,B=(g+1)/2,Q=(w+1)/2,le=(d+m)/4,xe=(p+v)/4,ue=(_+E)/4;return D>B&&D>Q?D<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(D),i=le/n,r=xe/n):B>Q?B<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(B),n=le/i,r=ue/i):Q<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(Q),n=xe/r,i=ue/r),this.set(n,i,r,t),this}let F=Math.sqrt((E-_)*(E-_)+(p-v)*(p-v)+(m-d)*(m-d));return Math.abs(F)<.001&&(F=1),this.x=(E-_)/F,this.y=(p-v)/F,this.z=(m-d)/F,this.w=Math.acos((c+g+w-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this.w=vt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this.w=vt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xc extends Qr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ni(0,0,e,t),this.scissorTest=!1,this.viewport=new ni(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new Yn(i);this.textures=[];const s=n.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Wn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new gs(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class rl extends xc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class hh extends Yn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=mi,this.minFilter=mi,this.wrapR=Ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gu extends rl{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new hh(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class yc extends Yn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=mi,this.minFilter=mi,this.wrapR=Ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ku extends rl{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new yc(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class yi{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Mr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Mr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Mr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,Mr):Mr.fromBufferAttribute(r,s),Mr.applyMatrix4(e.matrixWorld),this.expandByPoint(Mr);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),sl.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),sl.copy(n.boundingBox)),sl.applyMatrix4(e.matrixWorld),this.union(sl)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mr),Mr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(po),al.subVectors(this.max,po),Ea.subVectors(e.a,po),wa.subVectors(e.b,po),Ca.subVectors(e.c,po),_s.subVectors(wa,Ea),xs.subVectors(Ca,wa),Vs.subVectors(Ea,Ca);let t=[0,-_s.z,_s.y,0,-xs.z,xs.y,0,-Vs.z,Vs.y,_s.z,0,-_s.x,xs.z,0,-xs.x,Vs.z,0,-Vs.x,-_s.y,_s.x,0,-xs.y,xs.x,0,-Vs.y,Vs.x,0];return!vc(t,Ea,wa,Ca,al)||(t=[1,0,0,0,1,0,0,0,1],!vc(t,Ea,wa,Ca,al))?!1:(ol.crossVectors(_s,xs),t=[ol.x,ol.y,ol.z],vc(t,Ea,wa,Ca,al))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(es[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),es[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),es[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),es[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),es[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),es[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),es[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),es[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(es),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const es=[new U,new U,new U,new U,new U,new U,new U,new U],Mr=new U,sl=new yi,Ea=new U,wa=new U,Ca=new U,_s=new U,xs=new U,Vs=new U,po=new U,al=new U,ol=new U,Hs=new U;function vc(u,e,t,n,i){for(let r=0,s=u.length-3;r<=s;r+=3){Hs.fromArray(u,r);const a=i.x*Math.abs(Hs.x)+i.y*Math.abs(Hs.y)+i.z*Math.abs(Hs.z),l=e.dot(Hs),c=t.dot(Hs),d=n.dot(Hs);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const Vu=new yi,mo=new U,Mc=new U;class li{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Vu.setFromPoints(e).getCenter(n);let i=0;for(let r=0,s=e.length;r<s;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mo.subVectors(e,this.center);const t=mo.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(mo,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mo.copy(e.center).add(Mc)),this.expandByPoint(mo.copy(e.center).sub(Mc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ts=new U,Sc=new U,ll=new U,ys=new U,bc=new U,cl=new U,Tc=new U;class Ra{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ts)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ts.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ts.copy(this.origin).addScaledVector(this.direction,t),ts.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Sc.copy(e).add(t).multiplyScalar(.5),ll.copy(t).sub(e).normalize(),ys.copy(this.origin).sub(Sc);const r=e.distanceTo(t)*.5,s=-this.direction.dot(ll),a=ys.dot(this.direction),l=-ys.dot(ll),c=ys.lengthSq(),d=Math.abs(1-s*s);let p,m,g,_;if(d>0)if(p=s*l-a,m=s*a-l,_=r*d,p>=0)if(m>=-_)if(m<=_){const v=1/d;p*=v,m*=v,g=p*(p+s*m+2*a)+m*(s*p+m+2*l)+c}else m=r,p=Math.max(0,-(s*m+a)),g=-p*p+m*(m+2*l)+c;else m=-r,p=Math.max(0,-(s*m+a)),g=-p*p+m*(m+2*l)+c;else m<=-_?(p=Math.max(0,-(-s*r+a)),m=p>0?-r:Math.min(Math.max(-r,-l),r),g=-p*p+m*(m+2*l)+c):m<=_?(p=0,m=Math.min(Math.max(-r,-l),r),g=m*(m+2*l)+c):(p=Math.max(0,-(s*r+a)),m=p>0?r:Math.min(Math.max(-r,-l),r),g=-p*p+m*(m+2*l)+c);else m=s>0?-r:r,p=Math.max(0,-(s*m+a)),g=-p*p+m*(m+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),i&&i.copy(Sc).addScaledVector(ll,m),g}intersectSphere(e,t){ts.subVectors(e.center,this.origin);const n=ts.dot(this.direction),i=ts.dot(ts)-n*n,r=e.radius*e.radius;if(i>r)return null;const s=Math.sqrt(r-i),a=n-s,l=n+s;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,s,a,l;const c=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,m=this.origin;return c>=0?(n=(e.min.x-m.x)*c,i=(e.max.x-m.x)*c):(n=(e.max.x-m.x)*c,i=(e.min.x-m.x)*c),d>=0?(r=(e.min.y-m.y)*d,s=(e.max.y-m.y)*d):(r=(e.max.y-m.y)*d,s=(e.min.y-m.y)*d),n>s||r>i||((r>n||isNaN(n))&&(n=r),(s<i||isNaN(i))&&(i=s),p>=0?(a=(e.min.z-m.z)*p,l=(e.max.z-m.z)*p):(a=(e.max.z-m.z)*p,l=(e.min.z-m.z)*p),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ts)!==null}intersectTriangle(e,t,n,i,r){bc.subVectors(t,e),cl.subVectors(n,e),Tc.crossVectors(bc,cl);let s=this.direction.dot(Tc),a;if(s>0){if(i)return null;a=1}else if(s<0)a=-1,s=-s;else return null;ys.subVectors(this.origin,e);const l=a*this.direction.dot(cl.crossVectors(ys,cl));if(l<0)return null;const c=a*this.direction.dot(bc.cross(ys));if(c<0||l+c>s)return null;const d=-a*ys.dot(Tc);return d<0?null:this.at(d/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Dt{constructor(e,t,n,i,r,s,a,l,c,d,p,m,g,_,v,E){Dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,s,a,l,c,d,p,m,g,_,v,E)}set(e,t,n,i,r,s,a,l,c,d,p,m,g,_,v,E){const w=this.elements;return w[0]=e,w[4]=t,w[8]=n,w[12]=i,w[1]=r,w[5]=s,w[9]=a,w[13]=l,w[2]=c,w[6]=d,w[10]=p,w[14]=m,w[3]=g,w[7]=_,w[11]=v,w[15]=E,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Ia.setFromMatrixColumn(e,0).length(),r=1/Ia.setFromMatrixColumn(e,1).length(),s=1/Ia.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,s=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),d=Math.cos(r),p=Math.sin(r);if(e.order==="XYZ"){const m=s*d,g=s*p,_=a*d,v=a*p;t[0]=l*d,t[4]=-l*p,t[8]=c,t[1]=g+_*c,t[5]=m-v*c,t[9]=-a*l,t[2]=v-m*c,t[6]=_+g*c,t[10]=s*l}else if(e.order==="YXZ"){const m=l*d,g=l*p,_=c*d,v=c*p;t[0]=m+v*a,t[4]=_*a-g,t[8]=s*c,t[1]=s*p,t[5]=s*d,t[9]=-a,t[2]=g*a-_,t[6]=v+m*a,t[10]=s*l}else if(e.order==="ZXY"){const m=l*d,g=l*p,_=c*d,v=c*p;t[0]=m-v*a,t[4]=-s*p,t[8]=_+g*a,t[1]=g+_*a,t[5]=s*d,t[9]=v-m*a,t[2]=-s*c,t[6]=a,t[10]=s*l}else if(e.order==="ZYX"){const m=s*d,g=s*p,_=a*d,v=a*p;t[0]=l*d,t[4]=_*c-g,t[8]=m*c+v,t[1]=l*p,t[5]=v*c+m,t[9]=g*c-_,t[2]=-c,t[6]=a*l,t[10]=s*l}else if(e.order==="YZX"){const m=s*l,g=s*c,_=a*l,v=a*c;t[0]=l*d,t[4]=v-m*p,t[8]=_*p+g,t[1]=p,t[5]=s*d,t[9]=-a*d,t[2]=-c*d,t[6]=g*p+_,t[10]=m-v*p}else if(e.order==="XZY"){const m=s*l,g=s*c,_=a*l,v=a*c;t[0]=l*d,t[4]=-p,t[8]=c*d,t[1]=m*p+v,t[5]=s*d,t[9]=g*p-_,t[2]=_*p-g,t[6]=a*d,t[10]=v*p+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Hu,e,Wu)}lookAt(e,t,n){const i=this.elements;return hr.subVectors(e,t),hr.lengthSq()===0&&(hr.z=1),hr.normalize(),Ws.crossVectors(n,hr),Ws.lengthSq()===0&&(Math.abs(n.z)===1?hr.x+=1e-4:hr.z+=1e-4,hr.normalize(),Ws.crossVectors(n,hr)),Ws.normalize(),Ac.crossVectors(hr,Ws),i[0]=Ws.x,i[4]=Ac.x,i[8]=hr.x,i[1]=Ws.y,i[5]=Ac.y,i[9]=hr.y,i[2]=Ws.z,i[6]=Ac.z,i[10]=hr.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,s=n[0],a=n[4],l=n[8],c=n[12],d=n[1],p=n[5],m=n[9],g=n[13],_=n[2],v=n[6],E=n[10],w=n[14],F=n[3],D=n[7],B=n[11],Q=n[15],le=i[0],xe=i[4],ue=i[8],Re=i[12],Ne=i[1],ht=i[5],Vt=i[9],qt=i[13],Tn=i[2],yn=i[6],hi=i[10],Di=i[14],rs=i[3],jn=i[7],ai=i[11],ei=i[15];return r[0]=s*le+a*Ne+l*Tn+c*rs,r[4]=s*xe+a*ht+l*yn+c*jn,r[8]=s*ue+a*Vt+l*hi+c*ai,r[12]=s*Re+a*qt+l*Di+c*ei,r[1]=d*le+p*Ne+m*Tn+g*rs,r[5]=d*xe+p*ht+m*yn+g*jn,r[9]=d*ue+p*Vt+m*hi+g*ai,r[13]=d*Re+p*qt+m*Di+g*ei,r[2]=_*le+v*Ne+E*Tn+w*rs,r[6]=_*xe+v*ht+E*yn+w*jn,r[10]=_*ue+v*Vt+E*hi+w*ai,r[14]=_*Re+v*qt+E*Di+w*ei,r[3]=F*le+D*Ne+B*Tn+Q*rs,r[7]=F*xe+D*ht+B*yn+Q*jn,r[11]=F*ue+D*Vt+B*hi+Q*ai,r[15]=F*Re+D*qt+B*Di+Q*ei,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],s=e[1],a=e[5],l=e[9],c=e[13],d=e[2],p=e[6],m=e[10],g=e[14],_=e[3],v=e[7],E=e[11],w=e[15];return _*(+r*l*p-i*c*p-r*a*m+n*c*m+i*a*g-n*l*g)+v*(+t*l*g-t*c*m+r*s*m-i*s*g+i*c*d-r*l*d)+E*(+t*c*p-t*a*g-r*s*p+n*s*g+r*a*d-n*c*d)+w*(-i*a*d-t*l*p+t*a*m+i*s*p-n*s*m+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8],p=e[9],m=e[10],g=e[11],_=e[12],v=e[13],E=e[14],w=e[15],F=p*E*c-v*m*c+v*l*g-a*E*g-p*l*w+a*m*w,D=_*m*c-d*E*c-_*l*g+s*E*g+d*l*w-s*m*w,B=d*v*c-_*p*c+_*a*g-s*v*g-d*a*w+s*p*w,Q=_*p*l-d*v*l-_*a*m+s*v*m+d*a*E-s*p*E,le=t*F+n*D+i*B+r*Q;if(le===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const xe=1/le;return e[0]=F*xe,e[1]=(v*m*r-p*E*r-v*i*g+n*E*g+p*i*w-n*m*w)*xe,e[2]=(a*E*r-v*l*r+v*i*c-n*E*c-a*i*w+n*l*w)*xe,e[3]=(p*l*r-a*m*r-p*i*c+n*m*c+a*i*g-n*l*g)*xe,e[4]=D*xe,e[5]=(d*E*r-_*m*r+_*i*g-t*E*g-d*i*w+t*m*w)*xe,e[6]=(_*l*r-s*E*r-_*i*c+t*E*c+s*i*w-t*l*w)*xe,e[7]=(s*m*r-d*l*r+d*i*c-t*m*c-s*i*g+t*l*g)*xe,e[8]=B*xe,e[9]=(_*p*r-d*v*r-_*n*g+t*v*g+d*n*w-t*p*w)*xe,e[10]=(s*v*r-_*a*r+_*n*c-t*v*c-s*n*w+t*a*w)*xe,e[11]=(d*a*r-s*p*r-d*n*c+t*p*c+s*n*g-t*a*g)*xe,e[12]=Q*xe,e[13]=(d*v*i-_*p*i+_*n*m-t*v*m-d*n*E+t*p*E)*xe,e[14]=(_*a*i-s*v*i-_*n*l+t*v*l+s*n*E-t*a*E)*xe,e[15]=(s*p*i-d*a*i+d*n*l-t*p*l-s*n*m+t*a*m)*xe,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,s=e.x,a=e.y,l=e.z,c=r*s,d=r*a;return this.set(c*s+n,c*a-i*l,c*l+i*a,0,c*a+i*l,d*a+n,d*l-i*s,0,c*l-i*a,d*l+i*s,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,s){return this.set(1,n,r,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,s=t._y,a=t._z,l=t._w,c=r+r,d=s+s,p=a+a,m=r*c,g=r*d,_=r*p,v=s*d,E=s*p,w=a*p,F=l*c,D=l*d,B=l*p,Q=n.x,le=n.y,xe=n.z;return i[0]=(1-(v+w))*Q,i[1]=(g+B)*Q,i[2]=(_-D)*Q,i[3]=0,i[4]=(g-B)*le,i[5]=(1-(m+w))*le,i[6]=(E+F)*le,i[7]=0,i[8]=(_+D)*xe,i[9]=(E-F)*xe,i[10]=(1-(m+v))*xe,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Ia.set(i[0],i[1],i[2]).length();const s=Ia.set(i[4],i[5],i[6]).length(),a=Ia.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Sr.copy(this);const c=1/r,d=1/s,p=1/a;return Sr.elements[0]*=c,Sr.elements[1]*=c,Sr.elements[2]*=c,Sr.elements[4]*=d,Sr.elements[5]*=d,Sr.elements[6]*=d,Sr.elements[8]*=p,Sr.elements[9]*=p,Sr.elements[10]*=p,t.setFromRotationMatrix(Sr),n.x=r,n.y=s,n.z=a,this}makePerspective(e,t,n,i,r,s,a=yr,l=!1){const c=this.elements,d=2*r/(t-e),p=2*r/(n-i),m=(t+e)/(t-e),g=(n+i)/(n-i);let _,v;if(l)_=r/(s-r),v=s*r/(s-r);else if(a===yr)_=-(s+r)/(s-r),v=-2*s*r/(s-r);else if(a===Ma)_=-s/(s-r),v=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=d,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=p,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,s,a=yr,l=!1){const c=this.elements,d=2/(t-e),p=2/(n-i),m=-(t+e)/(t-e),g=-(n+i)/(n-i);let _,v;if(l)_=1/(s-r),v=s/(s-r);else if(a===yr)_=-2/(s-r),v=-(s+r)/(s-r);else if(a===Ma)_=-1/(s-r),v=-r/(s-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=d,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=p,c[9]=0,c[13]=g,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ia=new U,Sr=new Dt,Hu=new U(0,0,0),Wu=new U(1,1,1),Ws=new U,Ac=new U,hr=new U,Xu=new Dt,qu=new Gi;class Dr{constructor(e=0,t=0,n=0,i=Dr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],s=i[4],a=i[8],l=i[1],c=i[5],d=i[9],p=i[2],m=i[6],g=i[10];switch(t){case"XYZ":this._y=Math.asin(vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,g),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(vt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,g),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-vt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,g),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-vt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-d,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qu.setFromEuler(this),this.setFromQuaternion(qu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dr.DEFAULT_ORDER="XYZ";class uh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Gd=0;const Yu=new U,go=new Gi,vs=new Dt,Ec=new U,hl=new U,kd=new U,Vd=new Gi,Zu=new U(1,0,0),$u=new U(0,1,0),Ju=new U(0,0,1),Ku={type:"added"},Hd={type:"removed"},_o={type:"childadded",child:null},dh={type:"childremoved",child:null};class en extends Qr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new U,t=new Dr,n=new Gi,i=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Dt},normalMatrix:{value:new vr}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return go.setFromAxisAngle(e,t),this.quaternion.multiply(go),this}rotateOnWorldAxis(e,t){return go.setFromAxisAngle(e,t),this.quaternion.premultiply(go),this}rotateX(e){return this.rotateOnAxis(Zu,e)}rotateY(e){return this.rotateOnAxis($u,e)}rotateZ(e){return this.rotateOnAxis(Ju,e)}translateOnAxis(e,t){return Yu.copy(e).applyQuaternion(this.quaternion),this.position.add(Yu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zu,e)}translateY(e){return this.translateOnAxis($u,e)}translateZ(e){return this.translateOnAxis(Ju,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vs.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ec.copy(e):Ec.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),hl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vs.lookAt(hl,Ec,this.up):vs.lookAt(Ec,hl,this.up),this.quaternion.setFromRotationMatrix(vs),i&&(vs.extractRotation(i.matrixWorld),go.setFromRotationMatrix(vs),this.quaternion.premultiply(go.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ku),_o.child=e,this.dispatchEvent(_o),_o.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hd),dh.child=e,this.dispatchEvent(dh),dh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vs.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vs.multiply(e.parent.matrixWorld)),e.applyMatrix4(vs),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ku),_o.child=e,this.dispatchEvent(_o),_o.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hl,e,kd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hl,Vd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const p=l[c];r(e.shapes,p)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=s(e.geometries),l=s(e.materials),c=s(e.textures),d=s(e.images),p=s(e.shapes),m=s(e.skeletons),g=s(e.animations),_=s(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),g.length>0&&(n.animations=g),_.length>0&&(n.nodes=_)}return n.object=i,n;function s(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}en.DEFAULT_UP=new U(0,1,0),en.DEFAULT_MATRIX_AUTO_UPDATE=!0,en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ur=new U,Ms=new U,fh=new U,Ss=new U,xo=new U,yo=new U,Qu=new U,ph=new U,mh=new U,gh=new U,_h=new ni,Ut=new ni,ke=new ni;class wn{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Ur.subVectors(e,t),i.cross(Ur);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Ur.subVectors(i,t),Ms.subVectors(n,t),fh.subVectors(e,t);const s=Ur.dot(Ur),a=Ur.dot(Ms),l=Ur.dot(fh),c=Ms.dot(Ms),d=Ms.dot(fh),p=s*c-a*a;if(p===0)return r.set(0,0,0),null;const m=1/p,g=(c*l-a*d)*m,_=(s*d-a*l)*m;return r.set(1-g-_,_,g)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Ss)===null?!1:Ss.x>=0&&Ss.y>=0&&Ss.x+Ss.y<=1}static getInterpolation(e,t,n,i,r,s,a,l){return this.getBarycoord(e,t,n,i,Ss)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ss.x),l.addScaledVector(s,Ss.y),l.addScaledVector(a,Ss.z),l)}static getInterpolatedAttribute(e,t,n,i,r,s){return _h.setScalar(0),Ut.setScalar(0),ke.setScalar(0),_h.fromBufferAttribute(e,t),Ut.fromBufferAttribute(e,n),ke.fromBufferAttribute(e,i),s.setScalar(0),s.addScaledVector(_h,r.x),s.addScaledVector(Ut,r.y),s.addScaledVector(ke,r.z),s}static isFrontFacing(e,t,n,i){return Ur.subVectors(n,t),Ms.subVectors(e,t),Ur.cross(Ms).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ur.subVectors(this.c,this.b),Ms.subVectors(this.a,this.b),Ur.cross(Ms).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(.3333333333333333)}getNormal(e){return wn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return wn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return wn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return wn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return wn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let s,a;xo.subVectors(i,n),yo.subVectors(r,n),ph.subVectors(e,n);const l=xo.dot(ph),c=yo.dot(ph);if(l<=0&&c<=0)return t.copy(n);mh.subVectors(e,i);const d=xo.dot(mh),p=yo.dot(mh);if(d>=0&&p<=d)return t.copy(i);const m=l*p-d*c;if(m<=0&&l>=0&&d<=0)return s=l/(l-d),t.copy(n).addScaledVector(xo,s);gh.subVectors(e,r);const g=xo.dot(gh),_=yo.dot(gh);if(_>=0&&g<=_)return t.copy(r);const v=g*c-l*_;if(v<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(n).addScaledVector(yo,a);const E=d*_-g*p;if(E<=0&&p-d>=0&&g-_>=0)return Qu.subVectors(r,i),a=(p-d)/(p-d+(g-_)),t.copy(i).addScaledVector(Qu,a);const w=1/(E+v+m);return s=v*w,a=m*w,t.copy(n).addScaledVector(xo,s).addScaledVector(yo,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vi={h:0,s:0,l:0},ul={h:0,s:0,l:0};function wc(u,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<.16666666666666666?u+(e-u)*6*t:t<.5?e:t<.6666666666666666?u+(e-u)*6*(.6666666666666666-t):u}class Et{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ki.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ki.workingColorSpace){return this.r=e,this.g=t,this.b=n,ki.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ki.workingColorSpace){if(e=dc(e,1),t=vt(t,0,1),n=vt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,s=2*n-r;this.r=wc(s,r,e+.3333333333333333),this.g=wc(s,r,e),this.b=wc(s,r,e-.3333333333333333)}return ki.colorSpaceToWorking(this,i),this}setStyle(e,t=Ci){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],a=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ci){const n=vo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jr(e.r),this.g=jr(e.g),this.b=jr(e.b),this}copyLinearToSRGB(e){return this.r=Ta(e.r),this.g=Ta(e.g),this.b=Ta(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ci){return ki.workingToColorSpace(vi.copy(this),e),Math.round(vt(vi.r*255,0,255))*65536+Math.round(vt(vi.g*255,0,255))*256+Math.round(vt(vi.b*255,0,255))}getHexString(e=Ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ki.workingColorSpace){ki.workingToColorSpace(vi.copy(this),t);const n=vi.r,i=vi.g,r=vi.b,s=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const d=(a+s)/2;if(a===s)l=0,c=0;else{const p=s-a;switch(c=d<=.5?p/(s+a):p/(2-s-a),s){case n:l=(i-r)/p+(i<r?6:0);break;case i:l=(r-n)/p+2;break;case r:l=(n-i)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=ki.workingColorSpace){return ki.workingToColorSpace(vi.copy(this),t),e.r=vi.r,e.g=vi.g,e.b=vi.b,e}getStyle(e=Ci){ki.workingToColorSpace(vi.copy(this),e);const t=vi.r,n=vi.g,i=vi.b;return e!==Ci?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Vi),this.setHSL(Vi.h+e,Vi.s+t,Vi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Vi),e.getHSL(ul);const n=uo(Vi.h,ul.h,t),i=uo(Vi.s,ul.s,t),r=uo(Vi.l,ul.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const vi=new Et;Et.NAMES=vo;let ju=0;class Mi extends Qr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=ji(),this.name="",this.type="Material",this.blending=lt,this.side=ze,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mt,this.blendDst=$n,this.blendEquation=pn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=Hn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ho,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Kr,this.stencilZFail=Kr,this.stencilZPass=Kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==lt&&(n.blending=this.blending),this.side!==ze&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Mt&&(n.blendSrc=this.blendSrc),this.blendDst!==$n&&(n.blendDst=this.blendDst),this.blendEquation!==pn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Hn&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ho&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Kr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Kr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Kr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const s=[];for(const a in r){const l=r[a];delete l.metadata,s.push(l)}return s}if(t){const r=i(e.textures),s=i(e.images);r.length>0&&(n.textures=r),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Xs extends Mi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Hi=xh();function xh(){const u=new ArrayBuffer(4),e=new Float32Array(u),t=new Uint32Array(u),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),s=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,d=0;for(;(c&8388608)===0;)c<<=1,d-=8388608;c&=-8388609,d+=947912704,r[l]=c|d}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)s[l]=l<<23;s[31]=1199570944,s[32]=2147483648;for(let l=33;l<63;++l)s[l]=2147483648+(l-32<<23);s[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:s,offsetTable:a}}function Jn(u){Math.abs(u)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),u=vt(u,-65504,65504),Hi.floatView[0]=u;const e=Hi.uint32View[0],t=e>>23&511;return Hi.baseTable[t]+((e&8388607)>>Hi.shiftTable[t])}function qs(u){const e=u>>10;return Hi.uint32View[0]=Hi.mantissaTable[Hi.offsetTable[e]+(u&1023)]+Hi.exponentTable[e],Hi.floatView[0]}class yh{static toHalfFloat(e){return Jn(e)}static fromHalfFloat(e){return qs(e)}}const Nn=new U,Pa=new Ie;let Cc=0;class gn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=va,this.updateRanges=[],this.gpuType=lr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pa.fromBufferAttribute(this,t),Pa.applyMatrix3(e),this.setXY(t,Pa.x,Pa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.applyMatrix3(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.applyMatrix4(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.applyNormalMatrix(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.transformDirection(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ri(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Bt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ri(t,this.array)),t}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ri(t,this.array)),t}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ri(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ri(t,this.array)),t}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),i=Bt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),i=Bt(i,this.array),r=Bt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==va&&(e.usage=this.usage),e}}class Ys extends gn{constructor(e,t,n){super(new Int8Array(e),t,n)}}class La extends gn{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class vh extends gn{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class ed extends gn{constructor(e,t,n){super(new Int16Array(e),t,n)}}class dl extends gn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class td extends gn{constructor(e,t,n){super(new Int32Array(e),t,n)}}class Rc extends gn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class fl extends gn{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=qs(this.array[e*this.itemSize]);return this.normalized&&(t=Ri(t,this.array)),t}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize]=Jn(t),this}getY(e){let t=qs(this.array[e*this.itemSize+1]);return this.normalized&&(t=Ri(t,this.array)),t}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+1]=Jn(t),this}getZ(e){let t=qs(this.array[e*this.itemSize+2]);return this.normalized&&(t=Ri(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+2]=Jn(t),this}getW(e){let t=qs(this.array[e*this.itemSize+3]);return this.normalized&&(t=Ri(t,this.array)),t}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+3]=Jn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array)),this.array[e+0]=Jn(t),this.array[e+1]=Jn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),i=Bt(i,this.array)),this.array[e+0]=Jn(t),this.array[e+1]=Jn(n),this.array[e+2]=Jn(i),this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),i=Bt(i,this.array),r=Bt(r,this.array)),this.array[e+0]=Jn(t),this.array[e+1]=Jn(n),this.array[e+2]=Jn(i),this.array[e+3]=Jn(r),this}}class Ke extends gn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Mh=0;const er=new Dt,Mo=new en,Da=new U,tr=new yi,So=new yi,si=new U;class kt extends Qr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mh++}),this.uuid=ji(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sh(e)?Rc:dl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new vr().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return er.makeRotationFromQuaternion(e),this.applyMatrix4(er),this}rotateX(e){return er.makeRotationX(e),this.applyMatrix4(er),this}rotateY(e){return er.makeRotationY(e),this.applyMatrix4(er),this}rotateZ(e){return er.makeRotationZ(e),this.applyMatrix4(er),this}translate(e,t,n){return er.makeTranslation(e,t,n),this.applyMatrix4(er),this}scale(e,t,n){return er.makeScale(e,t,n),this.applyMatrix4(er),this}lookAt(e){return Mo.lookAt(e),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Da).negate(),this.translate(Da.x,Da.y,Da.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Ke(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];tr.setFromBufferAttribute(r),this.morphTargetsRelative?(si.addVectors(this.boundingBox.min,tr.min),this.boundingBox.expandByPoint(si),si.addVectors(this.boundingBox.max,tr.max),this.boundingBox.expandByPoint(si)):(this.boundingBox.expandByPoint(tr.min),this.boundingBox.expandByPoint(tr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new li);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(tr.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];So.setFromBufferAttribute(a),this.morphTargetsRelative?(si.addVectors(tr.min,So.min),tr.expandByPoint(si),si.addVectors(tr.max,So.max),tr.expandByPoint(si)):(tr.expandByPoint(So.min),tr.expandByPoint(So.max))}tr.getCenter(n);let i=0;for(let r=0,s=e.count;r<s;r++)si.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(si));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)si.fromBufferAttribute(a,c),l&&(Da.fromBufferAttribute(e,c),si.add(Da)),i=Math.max(i,n.distanceToSquared(si))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gn(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),a=[],l=[];for(let ue=0;ue<n.count;ue++)a[ue]=new U,l[ue]=new U;const c=new U,d=new U,p=new U,m=new Ie,g=new Ie,_=new Ie,v=new U,E=new U;function w(ue,Re,Ne){c.fromBufferAttribute(n,ue),d.fromBufferAttribute(n,Re),p.fromBufferAttribute(n,Ne),m.fromBufferAttribute(r,ue),g.fromBufferAttribute(r,Re),_.fromBufferAttribute(r,Ne),d.sub(c),p.sub(c),g.sub(m),_.sub(m);const ht=1/(g.x*_.y-_.x*g.y);isFinite(ht)&&(v.copy(d).multiplyScalar(_.y).addScaledVector(p,-g.y).multiplyScalar(ht),E.copy(p).multiplyScalar(g.x).addScaledVector(d,-_.x).multiplyScalar(ht),a[ue].add(v),a[Re].add(v),a[Ne].add(v),l[ue].add(E),l[Re].add(E),l[Ne].add(E))}let F=this.groups;F.length===0&&(F=[{start:0,count:e.count}]);for(let ue=0,Re=F.length;ue<Re;++ue){const Ne=F[ue],ht=Ne.start,Vt=Ne.count;for(let qt=ht,Tn=ht+Vt;qt<Tn;qt+=3)w(e.getX(qt+0),e.getX(qt+1),e.getX(qt+2))}const D=new U,B=new U,Q=new U,le=new U;function xe(ue){Q.fromBufferAttribute(i,ue),le.copy(Q);const Re=a[ue];D.copy(Re),D.sub(Q.multiplyScalar(Q.dot(Re))).normalize(),B.crossVectors(le,Re);const ht=B.dot(l[ue])<0?-1:1;s.setXYZW(ue,D.x,D.y,D.z,ht)}for(let ue=0,Re=F.length;ue<Re;++ue){const Ne=F[ue],ht=Ne.start,Vt=Ne.count;for(let qt=ht,Tn=ht+Vt;qt<Tn;qt+=3)xe(e.getX(qt+0)),xe(e.getX(qt+1)),xe(e.getX(qt+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,g=n.count;m<g;m++)n.setXYZ(m,0,0,0);const i=new U,r=new U,s=new U,a=new U,l=new U,c=new U,d=new U,p=new U;if(e)for(let m=0,g=e.count;m<g;m+=3){const _=e.getX(m+0),v=e.getX(m+1),E=e.getX(m+2);i.fromBufferAttribute(t,_),r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,E),d.subVectors(s,r),p.subVectors(i,r),d.cross(p),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,E),a.add(d),l.add(d),c.add(d),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(E,c.x,c.y,c.z)}else for(let m=0,g=t.count;m<g;m+=3)i.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),s.fromBufferAttribute(t,m+2),d.subVectors(s,r),p.subVectors(i,r),d.cross(p),n.setXYZ(m+0,d.x,d.y,d.z),n.setXYZ(m+1,d.x,d.y,d.z),n.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)si.fromBufferAttribute(e,t),si.normalize(),e.setXYZ(t,si.x,si.y,si.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,p=a.normalized,m=new c.constructor(l.length*d);let g=0,_=0;for(let v=0,E=l.length;v<E;v++){a.isInterleavedBufferAttribute?g=l[v]*a.data.stride+a.offset:g=l[v]*d;for(let w=0;w<d;w++)m[_++]=c[g++]}return new gn(m,d,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new kt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let d=0,p=c.length;d<p;d++){const m=c[d],g=e(m,n);l.push(g)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,l=s.length;a<l;a++){const c=s[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let p=0,m=c.length;p<m;p++){const g=c[p];d.push(g.toJSON(e.data))}d.length>0&&(i[l]=d,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const d=i[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],p=r[c];for(let m=0,g=p.length;m<g;m++)d.push(p[m].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,d=s.length;c<d;c++){const p=s[c];this.addGroup(p.start,p.count,p.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Sh=new Dt,Zs=new Ra,bo=new li,Ic=new U,To=new U,Ao=new U,Eo=new U,pl=new U,wo=new U,Pc=new U,Co=new U;class nr extends en{constructor(e=new kt,t=new Xs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){wo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=a[l],p=r[l];d!==0&&(pl.fromBufferAttribute(p,e),s?wo.addScaledVector(pl,d):wo.addScaledVector(pl.sub(t),d))}t.add(wo)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(r),Zs.copy(e.ray).recast(e.near),!(bo.containsPoint(Zs.origin)===!1&&(Zs.intersectSphere(bo,Ic)===null||Zs.origin.distanceToSquared(Ic)>(e.far-e.near)**2))&&(Sh.copy(r).invert(),Zs.copy(e.ray).applyMatrix4(Sh),!(n.boundingBox!==null&&Zs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Zs)))}_computeIntersections(e,t,n){let i;const r=this.geometry,s=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,p=r.attributes.normal,m=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(s))for(let _=0,v=m.length;_<v;_++){const E=m[_],w=s[E.materialIndex],F=Math.max(E.start,g.start),D=Math.min(a.count,Math.min(E.start+E.count,g.start+g.count));for(let B=F,Q=D;B<Q;B+=3){const le=a.getX(B),xe=a.getX(B+1),ue=a.getX(B+2);i=Bn(this,w,e,n,c,d,p,le,xe,ue),i&&(i.faceIndex=Math.floor(B/3),i.face.materialIndex=E.materialIndex,t.push(i))}}else{const _=Math.max(0,g.start),v=Math.min(a.count,g.start+g.count);for(let E=_,w=v;E<w;E+=3){const F=a.getX(E),D=a.getX(E+1),B=a.getX(E+2);i=Bn(this,s,e,n,c,d,p,F,D,B),i&&(i.faceIndex=Math.floor(E/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(s))for(let _=0,v=m.length;_<v;_++){const E=m[_],w=s[E.materialIndex],F=Math.max(E.start,g.start),D=Math.min(l.count,Math.min(E.start+E.count,g.start+g.count));for(let B=F,Q=D;B<Q;B+=3){const le=B,xe=B+1,ue=B+2;i=Bn(this,w,e,n,c,d,p,le,xe,ue),i&&(i.faceIndex=Math.floor(B/3),i.face.materialIndex=E.materialIndex,t.push(i))}}else{const _=Math.max(0,g.start),v=Math.min(l.count,g.start+g.count);for(let E=_,w=v;E<w;E+=3){const F=E,D=E+1,B=E+2;i=Bn(this,s,e,n,c,d,p,F,D,B),i&&(i.faceIndex=Math.floor(E/3),t.push(i))}}}}function Ua(u,e,t,n,i,r,s,a){let l;if(e.side===qe?l=n.intersectTriangle(s,r,i,!0,a):l=n.intersectTriangle(i,r,s,e.side===ze,a),l===null)return null;Co.copy(a),Co.applyMatrix4(u.matrixWorld);const c=t.ray.origin.distanceTo(Co);return c<t.near||c>t.far?null:{distance:c,point:Co.clone(),object:u}}function Bn(u,e,t,n,i,r,s,a,l,c){u.getVertexPosition(a,To),u.getVertexPosition(l,Ao),u.getVertexPosition(c,Eo);const d=Ua(u,e,t,n,To,Ao,Eo,Pc);if(d){const p=new U;wn.getBarycoord(Pc,To,Ao,Eo,p),i&&(d.uv=wn.getInterpolatedAttribute(i,a,l,c,p,new Ie)),r&&(d.uv1=wn.getInterpolatedAttribute(r,a,l,c,p,new Ie)),s&&(d.normal=wn.getInterpolatedAttribute(s,a,l,c,p,new U),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const m={a,b:l,c,normal:new U,materialIndex:0};wn.getNormal(To,Ao,Eo,m.normal),d.face=m,d.barycoord=p}return d}class Un extends kt{constructor(e=1,t=1,n=1,i=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:s};const a=this;i=Math.floor(i),r=Math.floor(r),s=Math.floor(s);const l=[],c=[],d=[],p=[];let m=0,g=0;_("z","y","x",-1,-1,n,t,e,s,r,0),_("z","y","x",1,-1,n,t,-e,s,r,1),_("x","z","y",1,1,e,n,t,i,s,2),_("x","z","y",1,-1,e,n,-t,i,s,3),_("x","y","z",1,-1,e,t,n,i,r,4),_("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ke(c,3)),this.setAttribute("normal",new Ke(d,3)),this.setAttribute("uv",new Ke(p,2));function _(v,E,w,F,D,B,Q,le,xe,ue,Re){const Ne=B/xe,ht=Q/ue,Vt=B/2,qt=Q/2,Tn=le/2,yn=xe+1,hi=ue+1;let Di=0,rs=0;const jn=new U;for(let ai=0;ai<hi;ai++){const ei=ai*ht-qt;for(let ss=0;ss<yn;ss++){const zr=ss*Ne-Vt;jn[v]=zr*F,jn[E]=ei*D,jn[w]=Tn,c.push(jn.x,jn.y,jn.z),jn[v]=0,jn[E]=0,jn[w]=le>0?1:-1,d.push(jn.x,jn.y,jn.z),p.push(ss/xe),p.push(1-ai/ue),Di+=1}}for(let ai=0;ai<ue;ai++)for(let ei=0;ei<xe;ei++){const ss=m+ei+yn*ai,zr=m+ei+yn*(ai+1),Zl=m+(ei+1)+yn*(ai+1),Kc=m+(ei+1)+yn*ai;l.push(ss,zr,Kc),l.push(zr,Zl,Kc),rs+=6}a.addGroup(g,rs,Re),g+=rs,m+=Di}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Un(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function bs(u){const e={};for(const t in u){e[t]={};for(const n in u[t]){const i=u[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function bh(u){const e={};for(let t=0;t<u.length;t++){const n=bs(u[t]);for(const i in n)e[i]=n[i]}return e}function nd(u){const e=[];for(let t=0;t<u.length;t++)e.push(u[t].clone());return e}function id(u){const e=u.getRenderTarget();return e===null?u.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ki.workingColorSpace}const rd={clone:bs,merge:bh};var sd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ad=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ml extends Mi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sd,this.fragmentShader=ad,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bs(e.uniforms),this.uniformsGroups=nd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class gl extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=yr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ts=new U,Th=new Ie,Ah=new Ie;class ir extends gl{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Sa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ks*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Sa*2*Math.atan(Math.tan(ks*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ts.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ts.x,Ts.y).multiplyScalar(-e/Ts.z),Ts.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ts.x,Ts.y).multiplyScalar(-e/Ts.z)}getViewSize(e,t){return this.getViewBounds(e,Th,Ah),t.subVectors(Ah,Th)}setViewOffset(e,t,n,i,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ks*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;r+=s.offsetX*i/l,t-=s.offsetY*n/c,i*=s.width/l,n*=s.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Fa=-90,Na=1;class Eh extends en{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new ir(Fa,Na,e,t);i.layers=this.layers,this.add(i);const r=new ir(Fa,Na,e,t);r.layers=this.layers,this.add(r);const s=new ir(Fa,Na,e,t);s.layers=this.layers,this.add(s);const a=new ir(Fa,Na,e,t);a.layers=this.layers,this.add(a);const l=new ir(Fa,Na,e,t);l.layers=this.layers,this.add(l);const c=new ir(Fa,Na,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,s,a,l]=t;for(const c of t)this.remove(c);if(e===yr)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ma)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,l,c,d]=this.children,p=e.getRenderTarget(),m=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,s),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,d),e.setRenderTarget(p,m,g),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class _l extends Yn{constructor(e=[],t=Hr,n,i,r,s,a,l,c,d){super(e,t,n,i,r,s,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class od extends rl{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new _l(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Un(5,5,5),r=new ml({name:"CubemapFromEquirect",uniforms:bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:$e});r.uniforms.tEquirect.value=t;const s=new nr(i,r),a=t.minFilter;return t.minFilter===mn&&(t.minFilter=Wn),new Eh(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,i);e.setRenderTarget(r)}}class Ba extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ld={type:"move"};class cd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ba,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ba,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ba,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,s=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const v of e.hand.values()){const E=t.getJointPose(v,n),w=this._getHandJoint(c,v);E!==null&&(w.matrix.fromArray(E.transform.matrix),w.matrix.decompose(w.position,w.rotation,w.scale),w.matrixWorldNeedsUpdate=!0,w.jointRadius=E.radius),w.visible=E!==null}const d=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],m=d.position.distanceTo(p.position),g=.02,_=.005;c.inputState.pinching&&m>g+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=g-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ld)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ba;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class xl{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Et(e),this.density=t}clone(){return new xl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class yl{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Et(e),this.near=t,this.far=n}clone(){return new yl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class wh extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dr,this.environmentIntensity=1,this.environmentRotation=new Dr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class vl{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=va,this.updateRanges=[],this.version=0,this.uuid=ji()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ji()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ji()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ii=new U;class $s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ii.fromBufferAttribute(this,t),Ii.applyMatrix4(e),this.setXYZ(t,Ii.x,Ii.y,Ii.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ii.fromBufferAttribute(this,t),Ii.applyNormalMatrix(e),this.setXYZ(t,Ii.x,Ii.y,Ii.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ii.fromBufferAttribute(this,t),Ii.transformDirection(e),this.setXYZ(t,Ii.x,Ii.y,Ii.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Ri(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Bt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ri(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ri(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ri(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ri(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),i=Bt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),i=Bt(i,this.array),r=Bt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new gn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new $s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Lc extends Mi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Et(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Oa;const Ro=new U,za=new U,Ga=new U,ka=new Ie,Io=new Ie,Ch=new Dt,Ml=new U,Po=new U,Sl=new U,Rh=new Ie,Dc=new Ie,Ih=new Ie;class Ph extends en{constructor(e=new Lc){if(super(),this.isSprite=!0,this.type="Sprite",Oa===void 0){Oa=new kt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new vl(t,5);Oa.setIndex([0,1,2,0,2,3]),Oa.setAttribute("position",new $s(n,3,0,!1)),Oa.setAttribute("uv",new $s(n,2,3,!1))}this.geometry=Oa,this.material=e,this.center=new Ie(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),za.setFromMatrixScale(this.matrixWorld),Ch.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ga.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&za.multiplyScalar(-Ga.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const s=this.center;bl(Ml.set(-.5,-.5,0),Ga,s,za,i,r),bl(Po.set(.5,-.5,0),Ga,s,za,i,r),bl(Sl.set(.5,.5,0),Ga,s,za,i,r),Rh.set(0,0),Dc.set(1,0),Ih.set(1,1);let a=e.ray.intersectTriangle(Ml,Po,Sl,!1,Ro);if(a===null&&(bl(Po.set(-.5,.5,0),Ga,s,za,i,r),Dc.set(0,1),a=e.ray.intersectTriangle(Ml,Sl,Po,!1,Ro),a===null))return;const l=e.ray.origin.distanceTo(Ro);l<e.near||l>e.far||t.push({distance:l,point:Ro.clone(),uv:wn.getInterpolation(Ro,Ml,Po,Sl,Rh,Dc,Ih,new Ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function bl(u,e,t,n,i,r){ka.subVectors(u,t).addScalar(.5).multiply(n),i!==void 0?(Io.x=r*ka.x-i*ka.y,Io.y=i*ka.x+r*ka.y):Io.copy(ka),u.copy(e),u.x+=Io.x,u.y+=Io.y,u.applyMatrix4(Ch)}const Tl=new U,Al=new U;class Uc extends en{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const r=t[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let r;for(r=0;r<i.length&&!(t<i[r].distance);r++);return i.splice(r,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let r=t[n].distance;if(t[n].object.visible&&(r-=r*t[n].hysteresis),e<r)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Tl.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(Tl);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){Tl.setFromMatrixPosition(e.matrixWorld),Al.setFromMatrixPosition(this.matrixWorld);const n=Tl.distanceTo(Al)/e.zoom;t[0].object.visible=!0;let i,r;for(i=1,r=t.length;i<r;i++){let s=t[i].distance;if(t[i].object.visible&&(s-=s*t[i].hysteresis),n>=s)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,r=n.length;i<r;i++){const s=n[i];t.object.levels.push({object:s.object.uuid,distance:s.distance,hysteresis:s.hysteresis})}return t}}const Lh=new U,Lo=new ni,Fc=new ni,hd=new U,Dh=new Dt,El=new U,wl=new li,Uh=new Dt,Cl=new Ra;class Fh extends nr{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=la,this.bindMatrix=new Dt,this.bindMatrixInverse=new Dt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new yi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,El),this.boundingBox.expandByPoint(El)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new li),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,El),this.boundingSphere.expandByPoint(El)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wl.copy(this.boundingSphere),wl.applyMatrix4(i),e.ray.intersectsSphere(wl)!==!1&&(Uh.copy(i).invert(),Cl.copy(e.ray).applyMatrix4(Uh),!(this.boundingBox!==null&&Cl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Cl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ni,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===la?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Vr?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Lo.fromBufferAttribute(i.attributes.skinIndex,e),Fc.fromBufferAttribute(i.attributes.skinWeight,e),Lh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const s=Fc.getComponent(r);if(s!==0){const a=Lo.getComponent(r);Dh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(hd.copy(Lh).applyMatrix4(Dh),s)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Nc extends en{constructor(){super(),this.isBone=!0,this.type="Bone"}}class rr extends Yn{constructor(e=null,t=1,n=1,i,r,s,a,l,c=mi,d=mi,p,m){super(null,s,a,l,c,d,i,r,p,m),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Nh=new Dt,ud=new Dt;class Rl{constructor(e=[],t=[]){this.uuid=ji(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Dt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Dt;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,s=e.length;r<s;r++){const a=e[r]?e[r].matrixWorld:ud;Nh.multiplyMatrices(a,t[r]),Nh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Rl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new rr(t,e,e,Oi,lr);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let s=t[r];s===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),s=new Nc),this.bones.push(s),this.boneInverses.push(new Dt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const s=t[i];e.bones.push(s.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class Va extends gn{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Fr=new Dt,Bc=new Dt,Do=[],Bh=new yi,Oc=new Dt,Uo=new nr,Fo=new li;class Oh extends nr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Va(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Oc)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new yi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fr),Bh.copy(e.boundingBox).applyMatrix4(Fr),this.boundingBox.union(Bh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new li),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fr),Fo.copy(e.boundingSphere).applyMatrix4(Fr),this.boundingSphere.union(Fo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,s=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[s+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Uo.geometry=this.geometry,Uo.material=this.material,Uo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fo.copy(this.boundingSphere),Fo.applyMatrix4(n),e.ray.intersectsSphere(Fo)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Fr),Bc.multiplyMatrices(n,Fr),Uo.matrixWorld=Bc,Uo.raycast(e,Do);for(let s=0,a=Do.length;s<a;s++){const l=Do[s];l.instanceId=r,l.object=this,t.push(l)}Do.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Va(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new rr(new Float32Array(i*this.count),i,this.count,cs,lr));const r=this.morphTexture.source.data.data;let s=0;for(let c=0;c<n.length;c++)s+=n[c];const a=this.geometry.morphTargetsRelative?1:1-s,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Il=new U,dd=new U,zh=new vr;class Js{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Il.subVectors(n,t).cross(dd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Il),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||zh.getNormalMatrix(e),i=this.coplanarPoint(Il).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ks=new li,fd=new Ie(.5,.5),Pl=new U;class Ll{constructor(e=new Js,t=new Js,n=new Js,i=new Js,r=new Js,s=new Js){this.planes=[e,t,n,i,r,s]}set(e,t,n,i,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=yr,n=!1){const i=this.planes,r=e.elements,s=r[0],a=r[1],l=r[2],c=r[3],d=r[4],p=r[5],m=r[6],g=r[7],_=r[8],v=r[9],E=r[10],w=r[11],F=r[12],D=r[13],B=r[14],Q=r[15];if(i[0].setComponents(c-s,g-d,w-_,Q-F).normalize(),i[1].setComponents(c+s,g+d,w+_,Q+F).normalize(),i[2].setComponents(c+a,g+p,w+v,Q+D).normalize(),i[3].setComponents(c-a,g-p,w-v,Q-D).normalize(),n)i[4].setComponents(l,m,E,B).normalize(),i[5].setComponents(c-l,g-m,w-E,Q-B).normalize();else if(i[4].setComponents(c-l,g-m,w-E,Q-B).normalize(),t===yr)i[5].setComponents(c+l,g+m,w+E,Q+B).normalize();else if(t===Ma)i[5].setComponents(l,m,E,B).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ks.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ks.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ks)}intersectsSprite(e){Ks.center.set(0,0,0);const t=fd.distanceTo(e.center);return Ks.radius=.7071067811865476+t,Ks.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ks)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Pl.x=i.normal.x>0?e.max.x:e.min.x,Pl.y=i.normal.y>0?e.max.y:e.min.y,Pl.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Pl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Nr=new Dt,Br=new Ll;class Dl{constructor(){this.coordinateSystem=yr}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Nr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Br.setFromProjectionMatrix(Nr,i.coordinateSystem,i.reversedDepth),Br.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Nr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Br.setFromProjectionMatrix(Nr,i.coordinateSystem,i.reversedDepth),Br.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Nr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Br.setFromProjectionMatrix(Nr,i.coordinateSystem,i.reversedDepth),Br.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Nr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Br.setFromProjectionMatrix(Nr,i.coordinateSystem,i.reversedDepth),Br.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let n=0;n<t.cameras.length;n++){const i=t.cameras[n];if(Nr.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),Br.setFromProjectionMatrix(Nr,i.coordinateSystem,i.reversedDepth),Br.containsPoint(e))return!0}return!1}clone(){return new Dl}}function zc(u,e){return u-e}function pd(u,e){return u.z-e.z}function md(u,e){return e.z-u.z}class gd{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){const r=this.pool,s=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});const a=r[this.index];s.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}}const Pi=new Dt,Gh=new Et(1,1,1),kh=new Ll,_d=new Dl,Ul=new yi,Qs=new li,No=new U,Vh=new U,Hh=new U,Gc=new gd,Si=new nr,Fl=[];function xd(u,e,t=0){const n=e.itemSize;if(u.isInterleavedBufferAttribute||u.array.constructor!==e.array.constructor){const i=u.count;for(let r=0;r<i;r++)for(let s=0;s<n;s++)e.setComponent(r+t,s,u.getComponent(r,s))}else e.array.set(u.array,t*n);e.needsUpdate=!0}function js(u,e){if(u.constructor!==e.constructor){const t=Math.min(u.length,e.length);for(let n=0;n<t;n++)e[n]=u[n]}else{const t=Math.min(u.length,e.length);e.set(new u.constructor(u.buffer,0,t))}}class Wh extends nr{constructor(e,t,n=t*2,i){super(new kt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new rr(t,e,e,Oi,lr);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new rr(t,e,e,Xn,or);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new rr(t,e,e,Oi,lr);n.colorSpace=ki.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const r in e.attributes){const s=e.getAttribute(r),{array:a,itemSize:l,normalized:c}=s,d=new a.constructor(n*l),p=new gn(d,l,c);t.setAttribute(r,p)}if(e.getIndex()!==null){const r=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new gn(r,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),r=t.getAttribute(n);if(i.itemSize!==r.itemSize||i.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){const t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){const t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yi);const e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,Pi),this.getBoundingBoxAt(r,Ul).applyMatrix4(Pi),e.union(Ul)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new li);const e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,Pi),this.getBoundingSphereAt(r,Qs).applyMatrix4(Pi),e.union(Qs)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(zc),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));const r=this._matricesTexture;Pi.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;const s=this._colorsTexture;return s&&(Gh.toArray(s.image.data,i*4),s.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);const i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;const s=e.getIndex();if(s!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?s.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(zc),l=this._availableGeometryIds.shift(),r[l]=i):(l=this._geometryCount,this._geometryCount++,r.push(i)),this.setGeometryAt(l,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,r=n.getIndex(),s=t.getIndex(),a=this._geometryInfo[e];if(i&&s.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(const d in n.attributes){const p=t.getAttribute(d),m=n.getAttribute(d);xd(p,m,l);const g=p.itemSize;for(let _=p.count,v=c;_<v;_++){const E=l+_;for(let w=0;w<g;w++)m.setComponent(E,w,0)}m.needsUpdate=!0,m.addUpdateRange(l*g,c*g)}if(i){const d=a.indexStart,p=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let m=0;m<s.count;m++)r.setX(d+m,l+s.getX(m));for(let m=s.count,g=p;m<g;m++)r.setX(d+m,l);r.needsUpdate=!0,r.addUpdateRange(d,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){const t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;const n=this._instanceInfo;for(let i=0,r=n.length;i<r;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0;const n=this._geometryInfo,i=n.map((s,a)=>a).sort((s,a)=>n[s].vertexStart-n[a].vertexStart),r=this.geometry;for(let s=0,a=n.length;s<a;s++){const l=i[s],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==t){const{indexStart:d,vertexStart:p,reservedIndexCount:m}=c,g=r.index,_=g.array,v=e-p;for(let E=d;E<d+m;E++)_[E]=_[E]+v;g.array.copyWithin(t,d,d+m),g.addUpdateRange(t,m),c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){const{vertexStart:d,reservedVertexCount:p}=c,m=r.attributes;for(const g in m){const _=m[g],{array:v,itemSize:E}=_;v.copyWithin(e*E,d*E,(d+p)*E),_.addUpdateRange(e*E,p*E)}c.vertexStart=e}e+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart,this._nextIndexStart=r.index?c.indexStart+c.reservedIndexCount:0,this._nextVertexStart=c.vertexStart+c.reservedVertexCount}}return this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){const r=new yi,s=n.index,a=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let d=l;s&&(d=s.getX(d)),r.expandByPoint(No.fromBufferAttribute(a,d))}i.boundingBox=r}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){const r=new li;this.getBoundingBoxAt(e,Ul),Ul.getCenter(r.center);const s=n.index,a=n.attributes.position;let l=0;for(let c=i.start,d=i.start+i.count;c<d;c++){let p=c;s&&(p=s.getX(p)),No.fromBufferAttribute(a,p),l=Math.max(l,r.center.distanceToSquared(No))}r.radius=Math.sqrt(l),i.boundingSphere=r}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);const n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);const n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){const t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(zc);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);const i=new Int32Array(e),r=new Int32Array(e);js(this._multiDrawCounts,i),js(this._multiDrawStarts,r),this._multiDrawCounts=i,this._multiDrawStarts=r,this._maxInstanceCount=e;const s=this._indirectTexture,a=this._matricesTexture,l=this._colorsTexture;s.dispose(),this._initIndirectTexture(),js(s.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),js(a.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),js(l.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){const n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>t)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);const r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new kt,this._initializeGeometry(r));const s=this.geometry;r.index&&js(r.index.array,s.index.array);for(const a in r.attributes)js(r.attributes[a].array,s.attributes[a].array)}raycast(e,t){const n=this._instanceInfo,i=this._geometryInfo,r=this.matrixWorld,s=this.geometry;Si.material=this.material,Si.geometry.index=s.index,Si.geometry.attributes=s.attributes,Si.geometry.boundingBox===null&&(Si.geometry.boundingBox=new yi),Si.geometry.boundingSphere===null&&(Si.geometry.boundingSphere=new li);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;const c=n[a].geometryIndex,d=i[c];Si.geometry.setDrawRange(d.start,d.count),this.getMatrixAt(a,Si.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,Si.geometry.boundingBox),this.getBoundingSphereAt(c,Si.geometry.boundingSphere),Si.raycast(e,Fl);for(let p=0,m=Fl.length;p<m;p++){const g=Fl[p];g.object=this,g.batchId=a,t.push(g)}Fl.length=0}Si.material=null,Si.geometry.index=null,Si.geometry.attributes={},Si.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const s=i.getIndex(),a=s===null?1:s.array.BYTES_PER_ELEMENT,l=this._instanceInfo,c=this._multiDrawStarts,d=this._multiDrawCounts,p=this._geometryInfo,m=this.perObjectFrustumCulled,g=this._indirectTexture,_=g.image.data,v=n.isArrayCamera?_d:kh;m&&!n.isArrayCamera&&(Pi.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),kh.setFromProjectionMatrix(Pi,n.coordinateSystem,n.reversedDepth));let E=0;if(this.sortObjects){Pi.copy(this.matrixWorld).invert(),No.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Pi),Vh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Pi);for(let D=0,B=l.length;D<B;D++)if(l[D].visible&&l[D].active){const Q=l[D].geometryIndex;this.getMatrixAt(D,Pi),this.getBoundingSphereAt(Q,Qs).applyMatrix4(Pi);let le=!1;if(m&&(le=!v.intersectsSphere(Qs,n)),!le){const xe=p[Q],ue=Hh.subVectors(Qs.center,No).dot(Vh);Gc.push(xe.start,xe.count,ue,D)}}const w=Gc.list,F=this.customSort;F===null?w.sort(r.transparent?md:pd):F.call(this,w,n);for(let D=0,B=w.length;D<B;D++){const Q=w[D];c[E]=Q.start*a,d[E]=Q.count,_[E]=Q.index,E++}Gc.reset()}else for(let w=0,F=l.length;w<F;w++)if(l[w].visible&&l[w].active){const D=l[w].geometryIndex;let B=!1;if(m&&(this.getMatrixAt(w,Pi),this.getBoundingSphereAt(D,Qs).applyMatrix4(Pi),B=!v.intersectsSphere(Qs,n)),!B){const Q=p[D];c[E]=Q.start*a,d[E]=Q.count,_[E]=w,E++}}g.needsUpdate=!0,this._multiDrawCount=E,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,r,s){this.onBeforeRender(e,null,i,r,s)}}class Li extends Mi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Bo=new U,Nl=new U,Xh=new Dt,Oo=new Ra,Bl=new li,ns=new U,qh=new U;class As extends en{constructor(e=new kt,t=new Li){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Bo.fromBufferAttribute(t,i-1),Nl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Bo.distanceTo(Nl);e.setAttribute("lineDistance",new Ke(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Bl.copy(n.boundingSphere),Bl.applyMatrix4(i),Bl.radius+=r,e.ray.intersectsSphere(Bl)===!1)return;Xh.copy(i).invert(),Oo.copy(e.ray).applyMatrix4(Xh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,d=n.index,m=n.attributes.position;if(d!==null){const g=Math.max(0,s.start),_=Math.min(d.count,s.start+s.count);for(let v=g,E=_-1;v<E;v+=c){const w=d.getX(v),F=d.getX(v+1),D=Ol(this,e,Oo,l,w,F,v);D&&t.push(D)}if(this.isLineLoop){const v=d.getX(_-1),E=d.getX(g),w=Ol(this,e,Oo,l,v,E,_-1);w&&t.push(w)}}else{const g=Math.max(0,s.start),_=Math.min(m.count,s.start+s.count);for(let v=g,E=_-1;v<E;v+=c){const w=Ol(this,e,Oo,l,v,v+1,v);w&&t.push(w)}if(this.isLineLoop){const v=Ol(this,e,Oo,l,_-1,g,_-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ol(u,e,t,n,i,r,s){const a=u.geometry.attributes.position;if(Bo.fromBufferAttribute(a,i),Nl.fromBufferAttribute(a,r),t.distanceSqToSegment(Bo,Nl,ns,qh)>n)return;ns.applyMatrix4(u.matrixWorld);const c=e.ray.origin.distanceTo(ns);if(!(c<e.near||c>e.far))return{distance:c,point:qh.clone().applyMatrix4(u.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:u}}const Yh=new U,o=new U;class f extends As{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Yh.fromBufferAttribute(t,i),o.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Yh.distanceTo(o);e.setAttribute("lineDistance",new Ke(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class h extends As{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class x extends Mi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const A=new Dt,b=new Ra,N=new li,R=new U;class j extends en{constructor(e=new kt,t=new x){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),N.copy(n.boundingSphere),N.applyMatrix4(i),N.radius+=r,e.ray.intersectsSphere(N)===!1)return;A.copy(i).invert(),b.copy(e.ray).applyMatrix4(A);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,p=n.attributes.position;if(c!==null){const m=Math.max(0,s.start),g=Math.min(c.count,s.start+s.count);for(let _=m,v=g;_<v;_++){const E=c.getX(_);R.fromBufferAttribute(p,E),Y(R,E,l,i,e,t,this)}}else{const m=Math.max(0,s.start),g=Math.min(p.count,s.start+s.count);for(let _=m,v=g;_<v;_++)R.fromBufferAttribute(p,_),Y(R,_,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Y(u,e,t,n,i,r,s){const a=b.distanceSqToPoint(u);if(a<t){const l=new U;b.closestPointToPoint(u,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class ne extends Yn{constructor(e,t,n,i,r=Wn,s=Wn,a,l,c){super(e,t,n,i,r,s,a,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const d=this;function p(){d.needsUpdate=!0,d._requestVideoFrameCallbackId=e.requestVideoFrameCallback(p)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(p))}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class H extends ne{constructor(e,t,n,i,r,s,a,l){super({},e,t,n,i,r,s,a,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(e){this.image=e,this.needsUpdate=!0}}class X extends Yn{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=mi,this.minFilter=mi,this.generateMipmaps=!1,this.needsUpdate=!0}}class $ extends Yn{constructor(e,t,n,i,r,s,a,l,c,d,p,m){super(null,s,a,l,c,d,i,r,p,m),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class ge extends ${constructor(e,t,n,i,r,s){super(e,t,n,r,s),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=Ai,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class se extends ${constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,Hr),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class C extends Yn{constructor(e,t,n,i,r,s,a,l,c){super(e,t,n,i,r,s,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class y extends Yn{constructor(e,t,n=or,i,r,s,a=mi,l=mi,c,d=pr,p=1){if(d!==pr&&d!==Xr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:p};super(m,i,r,s,a,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new gs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ie extends Yn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class J extends kt{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const s=[],a=[],l=[],c=[],d=t/2,p=Math.PI/2*e,m=t,g=2*p+m,_=n*2+r,v=i+1,E=new U,w=new U;for(let F=0;F<=_;F++){let D=0,B=0,Q=0,le=0;if(F<=n){const Re=F/n,Ne=Re*Math.PI/2;B=-d-e*Math.cos(Ne),Q=e*Math.sin(Ne),le=-e*Math.cos(Ne),D=Re*p}else if(F<=n+r){const Re=(F-n)/r;B=-d+Re*t,Q=e,le=0,D=p+Re*m}else{const Re=(F-n-r)/n,Ne=Re*Math.PI/2;B=d+e*Math.sin(Ne),Q=e*Math.cos(Ne),le=e*Math.sin(Ne),D=p+m+Re*p}const xe=Math.max(0,Math.min(1,D/g));let ue=0;F===0?ue=.5/i:F===_&&(ue=-.5/i);for(let Re=0;Re<=i;Re++){const Ne=Re/i,ht=Ne*Math.PI*2,Vt=Math.sin(ht),qt=Math.cos(ht);w.x=-Q*qt,w.y=B,w.z=Q*Vt,a.push(w.x,w.y,w.z),E.set(-Q*qt,le,Q*Vt),E.normalize(),l.push(E.x,E.y,E.z),c.push(Ne+ue,xe)}if(F>0){const Re=(F-1)*v;for(let Ne=0;Ne<i;Ne++){const ht=Re+Ne,Vt=Re+Ne+1,qt=F*v+Ne,Tn=F*v+Ne+1;s.push(ht,Vt,qt),s.push(Vt,Tn,qt)}}}this.setIndex(s),this.setAttribute("position",new Ke(a,3)),this.setAttribute("normal",new Ke(l,3)),this.setAttribute("uv",new Ke(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new J(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class k extends kt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],s=[],a=[],l=[],c=new U,d=new Ie;s.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let p=0,m=3;p<=t;p++,m+=3){const g=n+p/t*i;c.x=e*Math.cos(g),c.y=e*Math.sin(g),s.push(c.x,c.y,c.z),a.push(0,0,1),d.x=(s[m]/e+1)/2,d.y=(s[m+1]/e+1)/2,l.push(d.x,d.y)}for(let p=1;p<=t;p++)r.push(p,p+1,0);this.setIndex(r),this.setAttribute("position",new Ke(s,3)),this.setAttribute("normal",new Ke(a,3)),this.setAttribute("uv",new Ke(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new k(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ce extends kt{constructor(e=1,t=1,n=1,i=32,r=1,s=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const d=[],p=[],m=[],g=[];let _=0;const v=[],E=n/2;let w=0;F(),s===!1&&(e>0&&D(!0),t>0&&D(!1)),this.setIndex(d),this.setAttribute("position",new Ke(p,3)),this.setAttribute("normal",new Ke(m,3)),this.setAttribute("uv",new Ke(g,2));function F(){const B=new U,Q=new U;let le=0;const xe=(t-e)/n;for(let ue=0;ue<=r;ue++){const Re=[],Ne=ue/r,ht=Ne*(t-e)+e;for(let Vt=0;Vt<=i;Vt++){const qt=Vt/i,Tn=qt*l+a,yn=Math.sin(Tn),hi=Math.cos(Tn);Q.x=ht*yn,Q.y=-Ne*n+E,Q.z=ht*hi,p.push(Q.x,Q.y,Q.z),B.set(yn,xe,hi).normalize(),m.push(B.x,B.y,B.z),g.push(qt,1-Ne),Re.push(_++)}v.push(Re)}for(let ue=0;ue<i;ue++)for(let Re=0;Re<r;Re++){const Ne=v[Re][ue],ht=v[Re+1][ue],Vt=v[Re+1][ue+1],qt=v[Re][ue+1];(e>0||Re!==0)&&(d.push(Ne,ht,qt),le+=3),(t>0||Re!==r-1)&&(d.push(ht,Vt,qt),le+=3)}c.addGroup(w,le,0),w+=le}function D(B){const Q=_,le=new Ie,xe=new U;let ue=0;const Re=B===!0?e:t,Ne=B===!0?1:-1;for(let Vt=1;Vt<=i;Vt++)p.push(0,E*Ne,0),m.push(0,Ne,0),g.push(.5,.5),_++;const ht=_;for(let Vt=0;Vt<=i;Vt++){const Tn=Vt/i*l+a,yn=Math.cos(Tn),hi=Math.sin(Tn);xe.x=Re*hi,xe.y=E*Ne,xe.z=Re*yn,p.push(xe.x,xe.y,xe.z),m.push(0,Ne,0),le.x=yn*.5+.5,le.y=hi*.5*Ne+.5,g.push(le.x,le.y),_++}for(let Vt=0;Vt<i;Vt++){const qt=Q+Vt,Tn=ht+Vt;B===!0?d.push(Tn,Tn+1,qt):d.push(Tn+1,Tn,qt),ue+=3}c.addGroup(w,ue,B===!0?1:2),w+=ue}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ce(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ee extends ce{constructor(e=1,t=1,n=32,i=1,r=!1,s=0,a=Math.PI*2){super(0,e,t,n,i,r,s,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:s,thetaLength:a}}static fromJSON(e){return new ee(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class te extends kt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],s=[];a(i),c(n),d(),this.setAttribute("position",new Ke(r,3)),this.setAttribute("normal",new Ke(r.slice(),3)),this.setAttribute("uv",new Ke(s,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(F){const D=new U,B=new U,Q=new U;for(let le=0;le<t.length;le+=3)g(t[le+0],D),g(t[le+1],B),g(t[le+2],Q),l(D,B,Q,F)}function l(F,D,B,Q){const le=Q+1,xe=[];for(let ue=0;ue<=le;ue++){xe[ue]=[];const Re=F.clone().lerp(B,ue/le),Ne=D.clone().lerp(B,ue/le),ht=le-ue;for(let Vt=0;Vt<=ht;Vt++)Vt===0&&ue===le?xe[ue][Vt]=Re:xe[ue][Vt]=Re.clone().lerp(Ne,Vt/ht)}for(let ue=0;ue<le;ue++)for(let Re=0;Re<2*(le-ue)-1;Re++){const Ne=Math.floor(Re/2);Re%2===0?(m(xe[ue][Ne+1]),m(xe[ue+1][Ne]),m(xe[ue][Ne])):(m(xe[ue][Ne+1]),m(xe[ue+1][Ne+1]),m(xe[ue+1][Ne]))}}function c(F){const D=new U;for(let B=0;B<r.length;B+=3)D.x=r[B+0],D.y=r[B+1],D.z=r[B+2],D.normalize().multiplyScalar(F),r[B+0]=D.x,r[B+1]=D.y,r[B+2]=D.z}function d(){const F=new U;for(let D=0;D<r.length;D+=3){F.x=r[D+0],F.y=r[D+1],F.z=r[D+2];const B=E(F)/2/Math.PI+.5,Q=w(F)/Math.PI+.5;s.push(B,1-Q)}_(),p()}function p(){for(let F=0;F<s.length;F+=6){const D=s[F+0],B=s[F+2],Q=s[F+4],le=Math.max(D,B,Q),xe=Math.min(D,B,Q);le>.9&&xe<.1&&(D<.2&&(s[F+0]+=1),B<.2&&(s[F+2]+=1),Q<.2&&(s[F+4]+=1))}}function m(F){r.push(F.x,F.y,F.z)}function g(F,D){const B=F*3;D.x=e[B+0],D.y=e[B+1],D.z=e[B+2]}function _(){const F=new U,D=new U,B=new U,Q=new U,le=new Ie,xe=new Ie,ue=new Ie;for(let Re=0,Ne=0;Re<r.length;Re+=9,Ne+=6){F.set(r[Re+0],r[Re+1],r[Re+2]),D.set(r[Re+3],r[Re+4],r[Re+5]),B.set(r[Re+6],r[Re+7],r[Re+8]),le.set(s[Ne+0],s[Ne+1]),xe.set(s[Ne+2],s[Ne+3]),ue.set(s[Ne+4],s[Ne+5]),Q.copy(F).add(D).add(B).divideScalar(3);const ht=E(Q);v(le,Ne+0,F,ht),v(xe,Ne+2,D,ht),v(ue,Ne+4,B,ht)}}function v(F,D,B,Q){Q<0&&F.x===1&&(s[D]=F.x-1),B.x===0&&B.z===0&&(s[D]=Q/2/Math.PI+.5)}function E(F){return Math.atan2(F.z,-F.x)}function w(F){return Math.atan2(-F.y,Math.sqrt(F.x*F.x+F.z*F.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new te(e.vertices,e.indices,e.radius,e.details)}}class ye extends te{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,s,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ye(e.radius,e.detail)}}const L=new U,P=new U,Z=new U,de=new wn;class Ae extends kt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(ks*t),s=e.getIndex(),a=e.getAttribute("position"),l=s?s.count:a.count,c=[0,0,0],d=["a","b","c"],p=new Array(3),m={},g=[];for(let _=0;_<l;_+=3){s?(c[0]=s.getX(_),c[1]=s.getX(_+1),c[2]=s.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);const{a:v,b:E,c:w}=de;if(v.fromBufferAttribute(a,c[0]),E.fromBufferAttribute(a,c[1]),w.fromBufferAttribute(a,c[2]),de.getNormal(Z),p[0]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,p[1]=`${Math.round(E.x*i)},${Math.round(E.y*i)},${Math.round(E.z*i)}`,p[2]=`${Math.round(w.x*i)},${Math.round(w.y*i)},${Math.round(w.z*i)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let F=0;F<3;F++){const D=(F+1)%3,B=p[F],Q=p[D],le=de[d[F]],xe=de[d[D]],ue=`${B}_${Q}`,Re=`${Q}_${B}`;Re in m&&m[Re]?(Z.dot(m[Re].normal)<=r&&(g.push(le.x,le.y,le.z),g.push(xe.x,xe.y,xe.z)),m[Re]=null):ue in m||(m[ue]={index0:c[F],index1:c[D],normal:Z.clone()})}}for(const _ in m)if(m[_]){const{index0:v,index1:E}=m[_];L.fromBufferAttribute(a,v),P.fromBufferAttribute(a,E),g.push(L.x,L.y,L.z),g.push(P.x,P.y,P.z)}this.setAttribute("position",new Ke(g,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Ce{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let s=1;s<=e;s++)n=this.getPoint(s/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let s;t?s=t:s=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-s,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===s)return i/(r-1);const d=n[i],m=n[i+1]-d,g=(s-d)/m;return(i+g)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const s=this.getPoint(i),a=this.getPoint(r),l=t||(s.isVector2?new Ie:new U);return l.copy(a).sub(s).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new U,i=[],r=[],s=[],a=new U,l=new Dt;for(let g=0;g<=e;g++){const _=g/e;i[g]=this.getTangentAt(_,new U)}r[0]=new U,s[0]=new U;let c=Number.MAX_VALUE;const d=Math.abs(i[0].x),p=Math.abs(i[0].y),m=Math.abs(i[0].z);d<=c&&(c=d,n.set(1,0,0)),p<=c&&(c=p,n.set(0,1,0)),m<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),s[0].crossVectors(i[0],r[0]);for(let g=1;g<=e;g++){if(r[g]=r[g-1].clone(),s[g]=s[g-1].clone(),a.crossVectors(i[g-1],i[g]),a.length()>Number.EPSILON){a.normalize();const _=Math.acos(vt(i[g-1].dot(i[g]),-1,1));r[g].applyMatrix4(l.makeRotationAxis(a,_))}s[g].crossVectors(i[g],r[g])}if(t===!0){let g=Math.acos(vt(r[0].dot(r[e]),-1,1));g/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(g=-g);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(i[_],g*_)),s[_].crossVectors(i[_],r[_])}return{tangents:i,normals:r,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Se extends Ce{constructor(e=0,t=0,n=1,i=1,r=0,s=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=s,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new Ie){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const s=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(s?r=0:r=i),this.aClockwise===!0&&!s&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const d=Math.cos(this.aRotation),p=Math.sin(this.aRotation),m=l-this.aX,g=c-this.aY;l=m*d-g*p+this.aX,c=m*p+g*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class be extends Se{constructor(e,t,n,i,r,s){super(e,t,n,n,i,r,s),this.isArcCurve=!0,this.type="ArcCurve"}}function Le(){let u=0,e=0,t=0,n=0;function i(r,s,a,l){u=r,e=a,t=-3*r+3*s-2*a-l,n=2*r-2*s+a+l}return{initCatmullRom:function(r,s,a,l,c){i(s,a,c*(a-r),c*(l-s))},initNonuniformCatmullRom:function(r,s,a,l,c,d,p){let m=(s-r)/c-(a-r)/(c+d)+(a-s)/d,g=(a-s)/d-(l-s)/(d+p)+(l-a)/p;m*=d,g*=d,i(s,a,m,g)},calc:function(r){const s=r*r,a=s*r;return u+e*r+t*s+n*a}}}const _e=new U,rt=new Le,gt=new Le,Ot=new Le;class nn extends Ce{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new U){const n=t,i=this.points,r=i.length,s=(r-(this.closed?0:1))*e;let a=Math.floor(s),l=s-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,d;this.closed||a>0?c=i[(a-1)%r]:(_e.subVectors(i[0],i[1]).add(i[0]),c=_e);const p=i[a%r],m=i[(a+1)%r];if(this.closed||a+2<r?d=i[(a+2)%r]:(_e.subVectors(i[r-1],i[r-2]).add(i[r-1]),d=_e),this.curveType==="centripetal"||this.curveType==="chordal"){const g=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(p),g),v=Math.pow(p.distanceToSquared(m),g),E=Math.pow(m.distanceToSquared(d),g);v<1e-4&&(v=1),_<1e-4&&(_=v),E<1e-4&&(E=v),rt.initNonuniformCatmullRom(c.x,p.x,m.x,d.x,_,v,E),gt.initNonuniformCatmullRom(c.y,p.y,m.y,d.y,_,v,E),Ot.initNonuniformCatmullRom(c.z,p.z,m.z,d.z,_,v,E)}else this.curveType==="catmullrom"&&(rt.initCatmullRom(c.x,p.x,m.x,d.x,this.tension),gt.initCatmullRom(c.y,p.y,m.y,d.y,this.tension),Ot.initCatmullRom(c.z,p.z,m.z,d.z,this.tension));return n.set(rt.calc(l),gt.calc(l),Ot.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new U().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function On(u,e,t,n,i){const r=(n-e)*.5,s=(i-t)*.5,a=u*u,l=u*a;return(2*t-2*n+r+s)*l+(-3*t+3*n-2*r-s)*a+r*u+t}function zn(u,e){const t=1-u;return t*t*e}function fn(u,e){return 2*(1-u)*u*e}function ve(u,e){return u*u*e}function Ee(u,e,t,n){return zn(u,e)+fn(u,t)+ve(u,n)}function tt(u,e){const t=1-u;return t*t*t*e}function wt(u,e){const t=1-u;return 3*t*t*u*e}function ut(u,e){return 3*(1-u)*u*u*e}function Zt(u,e){return u*u*u*e}function Kn(u,e,t,n,i){return tt(u,e)+wt(u,t)+ut(u,n)+Zt(u,i)}class O extends Ce{constructor(e=new Ie,t=new Ie,n=new Ie,i=new Ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new Ie){const n=t,i=this.v0,r=this.v1,s=this.v2,a=this.v3;return n.set(Kn(e,i.x,r.x,s.x,a.x),Kn(e,i.y,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class bn extends Ce{constructor(e=new U,t=new U,n=new U,i=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new U){const n=t,i=this.v0,r=this.v1,s=this.v2,a=this.v3;return n.set(Kn(e,i.x,r.x,s.x,a.x),Kn(e,i.y,r.y,s.y,a.y),Kn(e,i.z,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class It extends Ce{constructor(e=new Ie,t=new Ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ie){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class St extends Ce{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class nt extends Ce{constructor(e=new Ie,t=new Ie,n=new Ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ie){const n=t,i=this.v0,r=this.v1,s=this.v2;return n.set(Ee(e,i.x,r.x,s.x),Ee(e,i.y,r.y,s.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _n extends Ce{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){const n=t,i=this.v0,r=this.v1,s=this.v2;return n.set(Ee(e,i.x,r.x,s.x),Ee(e,i.y,r.y,s.y),Ee(e,i.z,r.z,s.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class it extends Ce{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ie){const n=t,i=this.points,r=(i.length-1)*e,s=Math.floor(r),a=r-s,l=i[s===0?s:s-1],c=i[s],d=i[s>i.length-2?i.length-1:s+1],p=i[s>i.length-3?i.length-1:s+2];return n.set(On(a,l.x,c.x,d.x,p.x),On(a,l.y,c.y,d.y,p.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new Ie().fromArray(i))}return this}}var Ft=Object.freeze({__proto__:null,ArcCurve:be,CatmullRomCurve3:nn,CubicBezierCurve:O,CubicBezierCurve3:bn,EllipseCurve:Se,LineCurve:It,LineCurve3:St,QuadraticBezierCurve:nt,QuadraticBezierCurve3:_n,SplineCurve:it});class ii extends Ce{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ft[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const s=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-s/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const s=r[i],a=s.isEllipseCurve?e*2:s.isLineCurve||s.isLineCurve3?1:s.isSplineCurve?e*s.points.length:e,l=s.getPoints(a);for(let c=0;c<l.length;c++){const d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Ft[i.type]().fromJSON(i))}return this}}class Cn extends ii{constructor(e){super(),this.type="Path",this.currentPoint=new Ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new It(this.currentPoint.clone(),new Ie(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new nt(this.currentPoint.clone(),new Ie(e,t),new Ie(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,s){const a=new O(this.currentPoint.clone(),new Ie(e,t),new Ie(n,i),new Ie(r,s));return this.curves.push(a),this.currentPoint.set(r,s),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new it(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,s){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,i,r,s),this}absarc(e,t,n,i,r,s){return this.absellipse(e,t,n,n,i,r,s),this}ellipse(e,t,n,i,r,s,a,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,i,r,s,a,l),this}absellipse(e,t,n,i,r,s,a,l){const c=new Se(e,t,n,i,r,s,a,l);if(this.curves.length>0){const p=c.getPoint(0);p.equals(this.currentPoint)||this.lineTo(p.x,p.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class I extends Cn{constructor(e){super(e),this.uuid=ji(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Cn().fromJSON(i))}return this}}function M(u,e,t=2){const n=e&&e.length,i=n?e[0]*t:u.length;let r=K(u,0,i,t,!0);const s=[];if(!r||r.next===r.prev)return s;let a,l,c;if(n&&(r=at(u,e,r,t)),u.length>80*t){a=1/0,l=1/0;let d=-1/0,p=-1/0;for(let m=t;m<i;m+=t){const g=u[m],_=u[m+1];g<a&&(a=g),_<l&&(l=_),g>d&&(d=g),_>p&&(p=_)}c=Math.max(d-a,p-l),c=c!==0?32767/c:0}return Te(r,s,t,a,l,c,0),s}function K(u,e,t,n,i){let r;if(i===kl(u,e,t,n)>0)for(let s=e;s<t;s+=n)r=zl(s/n|0,u[s],u[s+1],r);else for(let s=t-n;s>=e;s-=n)r=zl(s/n|0,u[s],u[s+1],r);return r&&Je(r,r.next)&&(Ha(r),r=r.next),r}function fe(u,e){if(!u)return u;e||(e=u);let t=u,n;do if(n=!1,!t.steiner&&(Je(t,t.next)||he(t.prev,t,t.next)===0)){if(Ha(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Te(u,e,t,n,i,r,s){if(!u)return;!s&&r&&He(u,n,i,r);let a=u;for(;u.prev!==u.next;){const l=u.prev,c=u.next;if(r?ct(u,n,i,r):pe(u)){e.push(l.i,u.i,c.i),Ha(u),u=c.next,a=c.next;continue}if(u=c,u===a){s?s===1?(u=Oe(fe(u),e),Te(u,e,t,n,i,r,2)):s===2&&st(u,e,t,n,i,r):Te(fe(u),e,t,n,i,r,1);break}}}function pe(u){const e=u.prev,t=u,n=u.next;if(he(e,t,n)>=0)return!1;const i=e.x,r=t.x,s=n.x,a=e.y,l=t.y,c=n.y,d=Math.min(i,r,s),p=Math.min(a,l,c),m=Math.max(i,r,s),g=Math.max(a,l,c);let _=n.next;for(;_!==e;){if(_.x>=d&&_.x<=m&&_.y>=p&&_.y<=g&&Ze(i,a,r,l,s,c,_.x,_.y)&&he(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function ct(u,e,t,n){const i=u.prev,r=u,s=u.next;if(he(i,r,s)>=0)return!1;const a=i.x,l=r.x,c=s.x,d=i.y,p=r.y,m=s.y,g=Math.min(a,l,c),_=Math.min(d,p,m),v=Math.max(a,l,c),E=Math.max(d,p,m),w=G(g,_,e,t,n),F=G(v,E,e,t,n);let D=u.prevZ,B=u.nextZ;for(;D&&D.z>=w&&B&&B.z<=F;){if(D.x>=g&&D.x<=v&&D.y>=_&&D.y<=E&&D!==i&&D!==s&&Ze(a,d,l,p,c,m,D.x,D.y)&&he(D.prev,D,D.next)>=0||(D=D.prevZ,B.x>=g&&B.x<=v&&B.y>=_&&B.y<=E&&B!==i&&B!==s&&Ze(a,d,l,p,c,m,B.x,B.y)&&he(B.prev,B,B.next)>=0))return!1;B=B.nextZ}for(;D&&D.z>=w;){if(D.x>=g&&D.x<=v&&D.y>=_&&D.y<=E&&D!==i&&D!==s&&Ze(a,d,l,p,c,m,D.x,D.y)&&he(D.prev,D,D.next)>=0)return!1;D=D.prevZ}for(;B&&B.z<=F;){if(B.x>=g&&B.x<=v&&B.y>=_&&B.y<=E&&B!==i&&B!==s&&Ze(a,d,l,p,c,m,B.x,B.y)&&he(B.prev,B,B.next)>=0)return!1;B=B.nextZ}return!0}function Oe(u,e){let t=u;do{const n=t.prev,i=t.next.next;!Je(n,i)&&Pt(n,t,t.next,i)&&Wi(n,i)&&Wi(i,n)&&(e.push(n.i,t.i,i.i),Ha(t),Ha(t.next),t=u=i),t=t.next}while(t!==u);return fe(t)}function st(u,e,t,n,i,r){let s=u;do{let a=s.next.next;for(;a!==s.prev;){if(s.i!==a.i&&De(s,a)){let l=Es(s,a);s=fe(s,s.next),l=fe(l,l.next),Te(s,e,t,n,i,r,0),Te(l,e,t,n,i,r,0);return}a=a.next}s=s.next}while(s!==u)}function at(u,e,t,n){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r]*n,l=r<s-1?e[r+1]*n:u.length,c=K(u,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Fe(c))}i.sort(Ue);for(let r=0;r<i.length;r++)t=Xe(i[r],t);return t}function Ue(u,e){let t=u.x-e.x;if(t===0&&(t=u.y-e.y,t===0)){const n=(u.next.y-u.y)/(u.next.x-u.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Xe(u,e){const t=bt(u,e);if(!t)return e;const n=Es(t,u);return fe(n,n.next),fe(t,t.next)}function bt(u,e){let t=e;const n=u.x,i=u.y;let r=-1/0,s;if(Je(u,t))return t;do{if(Je(u,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const p=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(p<=n&&p>r&&(r=p,s=t.x<t.next.x?t:t.next,p===n))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,l=s.x,c=s.y;let d=1/0;t=s;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Ge(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const p=Math.abs(i-t.y)/(n-t.x);Wi(t,u)&&(p<d||p===d&&(t.x>s.x||t.x===s.x&&ot(s,t)))&&(s=t,d=p)}t=t.next}while(t!==a);return s}function ot(u,e){return he(u.prev,u,e.prev)<0&&he(e.next,u,u.next)<0}function He(u,e,t,n){let i=u;do i.z===0&&(i.z=G(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==u);i.prevZ.nextZ=null,i.prevZ=null,zt(i)}function zt(u){let e,t=1;do{let n=u,i;u=null;let r=null;for(e=0;n;){e++;let s=n,a=0;for(let c=0;c<t&&(a++,s=s.nextZ,!!s);c++);let l=t;for(;a>0||l>0&&s;)a!==0&&(l===0||!s||n.z<=s.z)?(i=n,n=n.nextZ,a--):(i=s,s=s.nextZ,l--),r?r.nextZ=i:u=i,i.prevZ=r,r=i;n=s}r.nextZ=null,t*=2}while(e>1);return u}function G(u,e,t,n,i){return u=(u-t)*i|0,e=(e-n)*i|0,u=(u|u<<8)&16711935,u=(u|u<<4)&252645135,u=(u|u<<2)&858993459,u=(u|u<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,u|e<<1}function Fe(u){let e=u,t=u;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==u);return t}function Ge(u,e,t,n,i,r,s,a){return(i-s)*(e-a)>=(u-s)*(r-a)&&(u-s)*(n-a)>=(t-s)*(e-a)&&(t-s)*(r-a)>=(i-s)*(n-a)}function Ze(u,e,t,n,i,r,s,a){return!(u===s&&e===a)&&Ge(u,e,t,n,i,r,s,a)}function De(u,e){return u.next.i!==e.i&&u.prev.i!==e.i&&!is(u,e)&&(Wi(u,e)&&Wi(e,u)&&Zh(u,e)&&(he(u.prev,u,e.prev)||he(u,e.prev,e))||Je(u,e)&&he(u.prev,u,u.next)>0&&he(e.prev,e,e.next)>0)}function he(u,e,t){return(e.y-u.y)*(t.x-e.x)-(e.x-u.x)*(t.y-e.y)}function Je(u,e){return u.x===e.x&&u.y===e.y}function Pt(u,e,t,n){const i=Jt(he(u,e,t)),r=Jt(he(u,e,n)),s=Jt(he(t,n,u)),a=Jt(he(t,n,e));return!!(i!==r&&s!==a||i===0&&on(u,t,e)||r===0&&on(u,n,e)||s===0&&on(t,u,n)||a===0&&on(t,e,n))}function on(u,e,t){return e.x<=Math.max(u.x,t.x)&&e.x>=Math.min(u.x,t.x)&&e.y<=Math.max(u.y,t.y)&&e.y>=Math.min(u.y,t.y)}function Jt(u){return u>0?1:u<0?-1:0}function is(u,e){let t=u;do{if(t.i!==u.i&&t.next.i!==u.i&&t.i!==e.i&&t.next.i!==e.i&&Pt(t,t.next,u,e))return!0;t=t.next}while(t!==u);return!1}function Wi(u,e){return he(u.prev,u,u.next)<0?he(u,e,u.next)>=0&&he(u,u.prev,e)>=0:he(u,e,u.prev)<0||he(u,u.next,e)<0}function Zh(u,e){let t=u,n=!1;const i=(u.x+e.x)/2,r=(u.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==u);return n}function Es(u,e){const t=Gl(u.i,u.x,u.y),n=Gl(e.i,e.x,e.y),i=u.next,r=e.prev;return u.next=e,e.prev=u,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function zl(u,e,t,n){const i=Gl(u,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ha(u){u.next.prev=u.prev,u.prev.next=u.next,u.prevZ&&(u.prevZ.nextZ=u.nextZ),u.nextZ&&(u.nextZ.prevZ=u.prevZ)}function Gl(u,e,t){return{i:u,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function kl(u,e,t,n){let i=0;for(let r=e,s=t-n;r<t;r+=n)i+=(u[s]-u[r])*(u[r+1]+u[s+1]),s=r;return i}class $h{static triangulate(e,t,n=2){return M(e,t,n)}}class Xi{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Xi.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];kc(e),Vc(n,e);let s=e.length;t.forEach(kc);for(let l=0;l<t.length;l++)i.push(s),s+=t[l].length,Vc(n,t[l]);const a=$h.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function kc(u){const e=u.length;e>2&&u[e-1].equals(u[0])&&u.pop()}function Vc(u,e){for(let t=0;t<e.length;t++)u.push(e[t].x),u.push(e[t].y)}class Vl extends kt{constructor(e=new I([new Ie(.5,.5),new Ie(-.5,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];s(c)}this.setAttribute("position",new Ke(i,3)),this.setAttribute("uv",new Ke(r,2)),this.computeVertexNormals();function s(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,p=t.depth!==void 0?t.depth:1;let m=t.bevelEnabled!==void 0?t.bevelEnabled:!0,g=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:g-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,E=t.bevelSegments!==void 0?t.bevelSegments:3;const w=t.extrudePath,F=t.UVGenerator!==void 0?t.UVGenerator:yd;let D,B=!1,Q,le,xe,ue;w&&(D=w.getSpacedPoints(d),B=!0,m=!1,Q=w.computeFrenetFrames(d,!1),le=new U,xe=new U,ue=new U),m||(E=0,g=0,_=0,v=0);const Re=a.extractPoints(c);let Ne=Re.shape;const ht=Re.holes;if(!Xi.isClockWise(Ne)){Ne=Ne.reverse();for(let We=0,je=ht.length;We<je;We++){const et=ht[We];Xi.isClockWise(et)&&(ht[We]=et.reverse())}}function qt(We){const et=10000000000000001e-36;let _t=We[0];for(let pt=1;pt<=We.length;pt++){const sn=pt%We.length,Wt=We[sn],Gn=Wt.x-_t.x,Zn=Wt.y-_t.y,ui=Gn*Gn+Zn*Zn,br=Math.max(Math.abs(Wt.x),Math.abs(Wt.y),Math.abs(_t.x),Math.abs(_t.y)),Zo=et*br*br;if(ui<=Zo){We.splice(sn,1),pt--;continue}_t=Wt}}qt(Ne),ht.forEach(qt);const Tn=ht.length,yn=Ne;for(let We=0;We<Tn;We++){const je=ht[We];Ne=Ne.concat(je)}function hi(We,je,et){return je||console.error("THREE.ExtrudeGeometry: vec does not exist"),We.clone().addScaledVector(je,et)}const Di=Ne.length;function rs(We,je,et){let _t,pt,sn;const Wt=We.x-je.x,Gn=We.y-je.y,Zn=et.x-We.x,ui=et.y-We.y,br=Wt*Wt+Gn*Gn,Zo=Wt*ui-Gn*Zn;if(Math.abs(Zo)>Number.EPSILON){const Tr=Math.sqrt(br),If=Math.sqrt(Zn*Zn+ui*ui),Pf=je.x-Gn/Tr,Lf=je.y+Wt/Tr,em=et.x-ui/If,tm=et.y+Zn/If,Df=((em-Pf)*ui-(tm-Lf)*Zn)/(Wt*ui-Gn*Zn);_t=Pf+Wt*Df-We.x,pt=Lf+Gn*Df-We.y;const Uf=_t*_t+pt*pt;if(Uf<=2)return new Ie(_t,pt);sn=Math.sqrt(Uf/2)}else{let Tr=!1;Wt>Number.EPSILON?Zn>Number.EPSILON&&(Tr=!0):Wt<-Number.EPSILON?Zn<-Number.EPSILON&&(Tr=!0):Math.sign(Gn)===Math.sign(ui)&&(Tr=!0),Tr?(_t=-Gn,pt=Wt,sn=Math.sqrt(br)):(_t=Wt,pt=Gn,sn=Math.sqrt(br/2))}return new Ie(_t/sn,pt/sn)}const jn=[];for(let We=0,je=yn.length,et=je-1,_t=We+1;We<je;We++,et++,_t++)et===je&&(et=0),_t===je&&(_t=0),jn[We]=rs(yn[We],yn[et],yn[_t]);const ai=[];let ei,ss=jn.concat();for(let We=0,je=Tn;We<je;We++){const et=ht[We];ei=[];for(let _t=0,pt=et.length,sn=pt-1,Wt=_t+1;_t<pt;_t++,sn++,Wt++)sn===pt&&(sn=0),Wt===pt&&(Wt=0),ei[_t]=rs(et[_t],et[sn],et[Wt]);ai.push(ei),ss=ss.concat(ei)}let zr;if(E===0)zr=Xi.triangulateShape(yn,ht);else{const We=[],je=[];for(let et=0;et<E;et++){const _t=et/E,pt=g*Math.cos(_t*Math.PI/2),sn=_*Math.sin(_t*Math.PI/2)+v;for(let Wt=0,Gn=yn.length;Wt<Gn;Wt++){const Zn=hi(yn[Wt],jn[Wt],sn);ra(Zn.x,Zn.y,-pt),_t===0&&We.push(Zn)}for(let Wt=0,Gn=Tn;Wt<Gn;Wt++){const Zn=ht[Wt];ei=ai[Wt];const ui=[];for(let br=0,Zo=Zn.length;br<Zo;br++){const Tr=hi(Zn[br],ei[br],sn);ra(Tr.x,Tr.y,-pt),_t===0&&ui.push(Tr)}_t===0&&je.push(ui)}}zr=Xi.triangulateShape(We,je)}const Zl=zr.length,Kc=_+v;for(let We=0;We<Di;We++){const je=m?hi(Ne[We],ss[We],Kc):Ne[We];B?(xe.copy(Q.normals[0]).multiplyScalar(je.x),le.copy(Q.binormals[0]).multiplyScalar(je.y),ue.copy(D[0]).add(xe).add(le),ra(ue.x,ue.y,ue.z)):ra(je.x,je.y,0)}for(let We=1;We<=d;We++)for(let je=0;je<Di;je++){const et=m?hi(Ne[je],ss[je],Kc):Ne[je];B?(xe.copy(Q.normals[We]).multiplyScalar(et.x),le.copy(Q.binormals[We]).multiplyScalar(et.y),ue.copy(D[We]).add(xe).add(le),ra(ue.x,ue.y,ue.z)):ra(et.x,et.y,p/d*We)}for(let We=E-1;We>=0;We--){const je=We/E,et=g*Math.cos(je*Math.PI/2),_t=_*Math.sin(je*Math.PI/2)+v;for(let pt=0,sn=yn.length;pt<sn;pt++){const Wt=hi(yn[pt],jn[pt],_t);ra(Wt.x,Wt.y,p+et)}for(let pt=0,sn=ht.length;pt<sn;pt++){const Wt=ht[pt];ei=ai[pt];for(let Gn=0,Zn=Wt.length;Gn<Zn;Gn++){const ui=hi(Wt[Gn],ei[Gn],_t);B?ra(ui.x,ui.y+D[d-1].y,D[d-1].x+et):ra(ui.x,ui.y,p+et)}}}Kp(),Qp();function Kp(){const We=i.length/3;if(m){let je=0,et=Di*je;for(let _t=0;_t<Zl;_t++){const pt=zr[_t];ru(pt[2]+et,pt[1]+et,pt[0]+et)}je=d+E*2,et=Di*je;for(let _t=0;_t<Zl;_t++){const pt=zr[_t];ru(pt[0]+et,pt[1]+et,pt[2]+et)}}else{for(let je=0;je<Zl;je++){const et=zr[je];ru(et[2],et[1],et[0])}for(let je=0;je<Zl;je++){const et=zr[je];ru(et[0]+Di*d,et[1]+Di*d,et[2]+Di*d)}}n.addGroup(We,i.length/3-We,0)}function Qp(){const We=i.length/3;let je=0;Rf(yn,je),je+=yn.length;for(let et=0,_t=ht.length;et<_t;et++){const pt=ht[et];Rf(pt,je),je+=pt.length}n.addGroup(We,i.length/3-We,1)}function Rf(We,je){let et=We.length;for(;--et>=0;){const _t=et;let pt=et-1;pt<0&&(pt=We.length-1);for(let sn=0,Wt=d+E*2;sn<Wt;sn++){const Gn=Di*sn,Zn=Di*(sn+1),ui=je+_t+Gn,br=je+pt+Gn,Zo=je+pt+Zn,Tr=je+_t+Zn;jp(ui,br,Zo,Tr)}}}function ra(We,je,et){l.push(We),l.push(je),l.push(et)}function ru(We,je,et){sa(We),sa(je),sa(et);const _t=i.length/3,pt=F.generateTopUV(n,i,_t-3,_t-2,_t-1);aa(pt[0]),aa(pt[1]),aa(pt[2])}function jp(We,je,et,_t){sa(We),sa(je),sa(_t),sa(je),sa(et),sa(_t);const pt=i.length/3,sn=F.generateSideWallUV(n,i,pt-6,pt-3,pt-2,pt-1);aa(sn[0]),aa(sn[1]),aa(sn[3]),aa(sn[1]),aa(sn[2]),aa(sn[3])}function sa(We){i.push(l[We*3+0]),i.push(l[We*3+1]),i.push(l[We*3+2])}function aa(We){r.push(We.x),r.push(We.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return vd(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];n.push(a)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Ft[i.type]().fromJSON(i)),new Vl(n,e.options)}}const yd={generateTopUV:function(u,e,t,n,i){const r=e[t*3],s=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[i*3],d=e[i*3+1];return[new Ie(r,s),new Ie(a,l),new Ie(c,d)]},generateSideWallUV:function(u,e,t,n,i,r){const s=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],d=e[n*3+1],p=e[n*3+2],m=e[i*3],g=e[i*3+1],_=e[i*3+2],v=e[r*3],E=e[r*3+1],w=e[r*3+2];return Math.abs(a-d)<Math.abs(s-c)?[new Ie(s,1-l),new Ie(c,1-p),new Ie(m,1-_),new Ie(v,1-w)]:[new Ie(a,1-l),new Ie(d,1-p),new Ie(g,1-_),new Ie(E,1-w)]}};function vd(u,e,t){if(t.shapes=[],Array.isArray(u))for(let n=0,i=u.length;n<i;n++){const r=u[n];t.shapes.push(r.uuid)}else t.shapes.push(u.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Hl extends te{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Hl(e.radius,e.detail)}}class Wl extends kt{constructor(e=[new Ie(0,-.5),new Ie(.5,0),new Ie(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=vt(i,0,Math.PI*2);const r=[],s=[],a=[],l=[],c=[],d=1/t,p=new U,m=new Ie,g=new U,_=new U,v=new U;let E=0,w=0;for(let F=0;F<=e.length-1;F++)switch(F){case 0:E=e[F+1].x-e[F].x,w=e[F+1].y-e[F].y,g.x=w*1,g.y=-E,g.z=w*0,v.copy(g),g.normalize(),l.push(g.x,g.y,g.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:E=e[F+1].x-e[F].x,w=e[F+1].y-e[F].y,g.x=w*1,g.y=-E,g.z=w*0,_.copy(g),g.x+=v.x,g.y+=v.y,g.z+=v.z,g.normalize(),l.push(g.x,g.y,g.z),v.copy(_)}for(let F=0;F<=t;F++){const D=n+F*d*i,B=Math.sin(D),Q=Math.cos(D);for(let le=0;le<=e.length-1;le++){p.x=e[le].x*B,p.y=e[le].y,p.z=e[le].x*Q,s.push(p.x,p.y,p.z),m.x=F/t,m.y=le/(e.length-1),a.push(m.x,m.y);const xe=l[3*le+0]*B,ue=l[3*le+1],Re=l[3*le+0]*Q;c.push(xe,ue,Re)}}for(let F=0;F<t;F++)for(let D=0;D<e.length-1;D++){const B=D+F*e.length,Q=B,le=B+e.length,xe=B+e.length+1,ue=B+1;r.push(Q,le,ue),r.push(xe,ue,le)}this.setIndex(r),this.setAttribute("position",new Ke(s,3)),this.setAttribute("uv",new Ke(a,2)),this.setAttribute("normal",new Ke(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wl(e.points,e.segments,e.phiStart,e.phiLength)}}class zo extends te{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new zo(e.radius,e.detail)}}class T extends kt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,s=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,d=l+1,p=e/a,m=t/l,g=[],_=[],v=[],E=[];for(let w=0;w<d;w++){const F=w*m-s;for(let D=0;D<c;D++){const B=D*p-r;_.push(B,-F,0),v.push(0,0,1),E.push(D/a),E.push(1-w/l)}}for(let w=0;w<l;w++)for(let F=0;F<a;F++){const D=F+c*w,B=F+c*(w+1),Q=F+1+c*(w+1),le=F+1+c*w;g.push(D,B,le),g.push(B,Q,le)}this.setIndex(g),this.setAttribute("position",new Ke(_,3)),this.setAttribute("normal",new Ke(v,3)),this.setAttribute("uv",new Ke(E,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new T(e.width,e.height,e.widthSegments,e.heightSegments)}}class W extends kt{constructor(e=.5,t=1,n=32,i=1,r=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:s},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],d=[];let p=e;const m=(t-e)/i,g=new U,_=new Ie;for(let v=0;v<=i;v++){for(let E=0;E<=n;E++){const w=r+E/n*s;g.x=p*Math.cos(w),g.y=p*Math.sin(w),l.push(g.x,g.y,g.z),c.push(0,0,1),_.x=(g.x/t+1)/2,_.y=(g.y/t+1)/2,d.push(_.x,_.y)}p+=m}for(let v=0;v<i;v++){const E=v*(n+1);for(let w=0;w<n;w++){const F=w+E,D=F,B=F+n+1,Q=F+n+2,le=F+1;a.push(D,B,le),a.push(B,Q,le)}}this.setIndex(a),this.setAttribute("position",new Ke(l,3)),this.setAttribute("normal",new Ke(c,3)),this.setAttribute("uv",new Ke(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new W(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class re extends kt{constructor(e=new I([new Ie(0,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],s=[];let a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let d=0;d<e.length;d++)c(e[d]),this.addGroup(a,l,d),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ke(i,3)),this.setAttribute("normal",new Ke(r,3)),this.setAttribute("uv",new Ke(s,2));function c(d){const p=i.length/3,m=d.extractPoints(t);let g=m.shape;const _=m.holes;Xi.isClockWise(g)===!1&&(g=g.reverse());for(let E=0,w=_.length;E<w;E++){const F=_[E];Xi.isClockWise(F)===!0&&(_[E]=F.reverse())}const v=Xi.triangulateShape(g,_);for(let E=0,w=_.length;E<w;E++){const F=_[E];g=g.concat(F)}for(let E=0,w=g.length;E<w;E++){const F=g[E];i.push(F.x,F.y,0),r.push(0,0,1),s.push(F.x,F.y)}for(let E=0,w=v.length;E<w;E++){const F=v[E],D=F[0]+p,B=F[1]+p,Q=F[2]+p;n.push(D,B,Q),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return ae(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const s=t[e.shapes[i]];n.push(s)}return new re(n,e.curveSegments)}}function ae(u,e){if(e.shapes=[],Array.isArray(u))for(let t=0,n=u.length;t<n;t++){const i=u[t];e.shapes.push(i.uuid)}else e.shapes.push(u.uuid);return e}class q extends kt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(s+a,Math.PI);let c=0;const d=[],p=new U,m=new U,g=[],_=[],v=[],E=[];for(let w=0;w<=n;w++){const F=[],D=w/n;let B=0;w===0&&s===0?B=.5/t:w===n&&l===Math.PI&&(B=-.5/t);for(let Q=0;Q<=t;Q++){const le=Q/t;p.x=-e*Math.cos(i+le*r)*Math.sin(s+D*a),p.y=e*Math.cos(s+D*a),p.z=e*Math.sin(i+le*r)*Math.sin(s+D*a),_.push(p.x,p.y,p.z),m.copy(p).normalize(),v.push(m.x,m.y,m.z),E.push(le+B,1-D),F.push(c++)}d.push(F)}for(let w=0;w<n;w++)for(let F=0;F<t;F++){const D=d[w][F+1],B=d[w][F],Q=d[w+1][F],le=d[w+1][F+1];(w!==0||s>0)&&g.push(D,B,le),(w!==n-1||l<Math.PI)&&g.push(B,Q,le)}this.setIndex(g),this.setAttribute("position",new Ke(_,3)),this.setAttribute("normal",new Ke(v,3)),this.setAttribute("uv",new Ke(E,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new q(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Pe extends te{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Pe(e.radius,e.detail)}}class Ve extends kt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const s=[],a=[],l=[],c=[],d=new U,p=new U,m=new U;for(let g=0;g<=n;g++)for(let _=0;_<=i;_++){const v=_/i*r,E=g/n*Math.PI*2;p.x=(e+t*Math.cos(E))*Math.cos(v),p.y=(e+t*Math.cos(E))*Math.sin(v),p.z=t*Math.sin(E),a.push(p.x,p.y,p.z),d.x=e*Math.cos(v),d.y=e*Math.sin(v),m.subVectors(p,d).normalize(),l.push(m.x,m.y,m.z),c.push(_/i),c.push(g/n)}for(let g=1;g<=n;g++)for(let _=1;_<=i;_++){const v=(i+1)*g+_-1,E=(i+1)*(g-1)+_-1,w=(i+1)*(g-1)+_,F=(i+1)*g+_;s.push(v,E,F),s.push(E,w,F)}this.setIndex(s),this.setAttribute("position",new Ke(a,3)),this.setAttribute("normal",new Ke(l,3)),this.setAttribute("uv",new Ke(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ve(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Qe extends kt{constructor(e=1,t=.4,n=64,i=8,r=2,s=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:s},n=Math.floor(n),i=Math.floor(i);const a=[],l=[],c=[],d=[],p=new U,m=new U,g=new U,_=new U,v=new U,E=new U,w=new U;for(let D=0;D<=n;++D){const B=D/n*r*Math.PI*2;F(B,r,s,e,g),F(B+.01,r,s,e,_),E.subVectors(_,g),w.addVectors(_,g),v.crossVectors(E,w),w.crossVectors(v,E),v.normalize(),w.normalize();for(let Q=0;Q<=i;++Q){const le=Q/i*Math.PI*2,xe=-t*Math.cos(le),ue=t*Math.sin(le);p.x=g.x+(xe*w.x+ue*v.x),p.y=g.y+(xe*w.y+ue*v.y),p.z=g.z+(xe*w.z+ue*v.z),l.push(p.x,p.y,p.z),m.subVectors(p,g).normalize(),c.push(m.x,m.y,m.z),d.push(D/n),d.push(Q/i)}}for(let D=1;D<=n;D++)for(let B=1;B<=i;B++){const Q=(i+1)*(D-1)+(B-1),le=(i+1)*D+(B-1),xe=(i+1)*D+B,ue=(i+1)*(D-1)+B;a.push(Q,le,ue),a.push(le,xe,ue)}this.setIndex(a),this.setAttribute("position",new Ke(l,3)),this.setAttribute("normal",new Ke(c,3)),this.setAttribute("uv",new Ke(d,2));function F(D,B,Q,le,xe){const ue=Math.cos(D),Re=Math.sin(D),Ne=Q/B*D,ht=Math.cos(Ne);xe.x=le*(2+ht)*.5*ue,xe.y=le*(2+ht)*Re*.5,xe.z=le*Math.sin(Ne)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qe(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Ye extends kt{constructor(e=new _n(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const s=e.computeFrenetFrames(t,r);this.tangents=s.tangents,this.normals=s.normals,this.binormals=s.binormals;const a=new U,l=new U,c=new Ie;let d=new U;const p=[],m=[],g=[],_=[];v(),this.setIndex(_),this.setAttribute("position",new Ke(p,3)),this.setAttribute("normal",new Ke(m,3)),this.setAttribute("uv",new Ke(g,2));function v(){for(let D=0;D<t;D++)E(D);E(r===!1?t:0),F(),w()}function E(D){d=e.getPointAt(D/t,d);const B=s.normals[D],Q=s.binormals[D];for(let le=0;le<=i;le++){const xe=le/i*Math.PI*2,ue=Math.sin(xe),Re=-Math.cos(xe);l.x=Re*B.x+ue*Q.x,l.y=Re*B.y+ue*Q.y,l.z=Re*B.z+ue*Q.z,l.normalize(),m.push(l.x,l.y,l.z),a.x=d.x+n*l.x,a.y=d.y+n*l.y,a.z=d.z+n*l.z,p.push(a.x,a.y,a.z)}}function w(){for(let D=1;D<=t;D++)for(let B=1;B<=i;B++){const Q=(i+1)*(D-1)+(B-1),le=(i+1)*D+(B-1),xe=(i+1)*D+B,ue=(i+1)*(D-1)+B;_.push(Q,le,ue),_.push(le,xe,ue)}}function F(){for(let D=0;D<=t;D++)for(let B=0;B<=i;B++)c.x=D/t,c.y=B/i,g.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Ye(new Ft[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class yt extends kt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new U,r=new U;if(e.index!==null){const s=e.attributes.position,a=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,d=l.length;c<d;++c){const p=l[c],m=p.start,g=p.count;for(let _=m,v=m+g;_<v;_+=3)for(let E=0;E<3;E++){const w=a.getX(_+E),F=a.getX(_+(E+1)%3);i.fromBufferAttribute(s,w),r.fromBufferAttribute(s,F),Tt(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}}else{const s=e.attributes.position;for(let a=0,l=s.count/3;a<l;a++)for(let c=0;c<3;c++){const d=3*a+c,p=3*a+(c+1)%3;i.fromBufferAttribute(s,d),r.fromBufferAttribute(s,p),Tt(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new Ke(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Tt(u,e,t){const n=`${u.x},${u.y},${u.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${u.x},${u.y},${u.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var ft=Object.freeze({__proto__:null,BoxGeometry:Un,CapsuleGeometry:J,CircleGeometry:k,ConeGeometry:ee,CylinderGeometry:ce,DodecahedronGeometry:ye,EdgesGeometry:Ae,ExtrudeGeometry:Vl,IcosahedronGeometry:Hl,LatheGeometry:Wl,OctahedronGeometry:zo,PlaneGeometry:T,PolyhedronGeometry:te,RingGeometry:W,ShapeGeometry:re,SphereGeometry:q,TetrahedronGeometry:Pe,TorusGeometry:Ve,TorusKnotGeometry:Qe,TubeGeometry:Ye,WireframeGeometry:yt});class Ht extends Mi{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Et(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class ln extends ml{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Rn extends Mi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class xn extends Rn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ie(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return vt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Et(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Et(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Et(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class un extends Mi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Et(16777215),this.specular=new Et(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class mt extends Mi{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Et(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class In extends Mi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class Kt extends Mi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qi extends Mi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zi,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ea extends Mi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Yi extends Mi{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new Et(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wa extends Li{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function cn(u,e){return!u||u.constructor===e?u:typeof e.BYTES_PER_ELEMENT=="number"?new e(u):Array.prototype.slice.call(u)}function sr(u){return ArrayBuffer.isView(u)&&!(u instanceof DataView)}function ar(u){function e(i,r){return u[i]-u[r]}const t=u.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function ci(u,e,t){const n=u.length,i=new u.constructor(n);for(let r=0,s=0;s!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)i[s++]=u[a+l]}return i}function bi(u,e,t,n){let i=1,r=u[0];for(;r!==void 0&&r[n]===void 0;)r=u[i++];if(r===void 0)return;let s=r[n];if(s!==void 0)if(Array.isArray(s))do s=r[n],s!==void 0&&(e.push(r.time),t.push(...s)),r=u[i++];while(r!==void 0);else if(s.toArray!==void 0)do s=r[n],s!==void 0&&(e.push(r.time),s.toArray(t,t.length)),r=u[i++];while(r!==void 0);else do s=r[n],s!==void 0&&(e.push(r.time),t.push(s)),r=u[i++];while(r!==void 0)}function Hc(u,e,t,n,i=30){const r=u.clone();r.name=e;const s=[];for(let l=0;l<r.tracks.length;++l){const c=r.tracks[l],d=c.getValueSize(),p=[],m=[];for(let g=0;g<c.times.length;++g){const _=c.times[g]*i;if(!(_<t||_>=n)){p.push(c.times[g]);for(let v=0;v<d;++v)m.push(c.values[g*d+v])}}p.length!==0&&(c.times=cn(p,c.times.constructor),c.values=cn(m,c.values.constructor),s.push(c))}r.tracks=s;let a=1/0;for(let l=0;l<r.tracks.length;++l)a>r.tracks[l].times[0]&&(a=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*a);return r.resetDuration(),r}function ta(u,e=0,t=u,n=30){n<=0&&(n=30);const i=t.tracks.length,r=e/n;for(let s=0;s<i;++s){const a=t.tracks[s],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;const c=u.tracks.find(function(w){return w.name===a.name&&w.ValueTypeName===l});if(c===void 0)continue;let d=0;const p=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=p/3);let m=0;const g=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(m=g/3);const _=a.times.length-1;let v;if(r<=a.times[0]){const w=d,F=p-d;v=a.values.slice(w,F)}else if(r>=a.times[_]){const w=_*p+d,F=w+p-d;v=a.values.slice(w,F)}else{const w=a.createInterpolant(),F=d,D=p-d;w.evaluate(r),v=w.resultBuffer.slice(F,D)}l==="quaternion"&&new Gi().fromArray(v).normalize().conjugate().toArray(v);const E=c.times.length;for(let w=0;w<E;++w){const F=w*g+m;if(l==="quaternion")Gi.multiplyQuaternionsFlat(c.values,F,v,0,c.values,F);else{const D=g-m*2;for(let B=0;B<D;++B)c.values[F+B]-=v[B]}}}return u.blendMode=xt,u}class Ff{static convertArray(e,t){return cn(e,t)}static isTypedArray(e){return sr(e)}static getKeyframeOrder(e){return ar(e)}static sortedArray(e,t,n){return ci(e,t,n)}static flattenJSON(e,t,n,i){bi(e,t,n,i)}static subclip(e,t,n,i,r=30){return Hc(e,t,n,i,r)}static makeClipAdditive(e,t=0,n=e,i=30){return ta(e,t,n,i)}}class Wc{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let s;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break t}s=t.length;break n}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}s=n,n=0;break n}break e}for(;n<s;){const a=n+s>>>1;e<t[a]?s=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let s=0;s!==i;++s)t[s]=n[r+s];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Wd extends Wc{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:V,endingEnd:V}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,s=e+1,a=i[r],l=i[s];if(a===void 0)switch(this.getSettings_().endingStart){case oe:r=e,a=2*t-n;break;case Me:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case oe:s=e,l=2*n-t;break;case Me:s=1,l=n+i[1]-i[0];break;default:s=e-1,l=t}const c=(n-t)*.5,d=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*d,this._offsetNext=s*d}interpolate_(e,t,n,i){const r=this.resultBuffer,s=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,d=this._offsetPrev,p=this._offsetNext,m=this._weightPrev,g=this._weightNext,_=(n-t)/(i-t),v=_*_,E=v*_,w=-m*E+2*m*v-m*_,F=(1+m)*E+(-1.5-2*m)*v+(-.5+m)*_+1,D=(-1-g)*E+(1.5+g)*v+.5*_,B=g*E-g*v;for(let Q=0;Q!==a;++Q)r[Q]=w*s[d+Q]+F*s[c+Q]+D*s[l+Q]+B*s[p+Q];return r}}class Md extends Wc{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,s=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,d=(n-t)/(i-t),p=1-d;for(let m=0;m!==a;++m)r[m]=s[c+m]*p+s[l+m]*d;return r}}class Xd extends Wc{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Or{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=cn(t,this.TimeBufferType),this.values=cn(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:cn(e.times,Array),values:cn(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Xd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Md(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Wd(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Dn:t=this.InterpolantFactoryMethodDiscrete;break;case S:t=this.InterpolantFactoryMethodLinear;break;case z:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Dn;case this.InterpolantFactoryMethodLinear:return S;case this.InterpolantFactoryMethodSmooth:return z}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,s=i-1;for(;r!==i&&n[r]<e;)++r;for(;s!==-1&&n[s]>t;)--s;if(++s,r!==0||s!==i){r>=s&&(s=Math.max(s,1),r=s-1);const a=this.getValueSize();this.times=n.slice(r,s),this.values=this.values.slice(r*a,s*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let s=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(s!==null&&s>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,s),e=!1;break}s=l}if(i!==void 0&&sr(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===z,r=e.length-1;let s=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],d=e[a+1];if(c!==d&&(a!==1||c!==e[0]))if(i)l=!0;else{const p=a*n,m=p-n,g=p+n;for(let _=0;_!==n;++_){const v=t[p+_];if(v!==t[m+_]||v!==t[g+_]){l=!0;break}}}if(l){if(a!==s){e[s]=e[a];const p=a*n,m=s*n;for(let g=0;g!==n;++g)t[m+g]=t[p+g]}++s}}if(r>0){e[s]=e[r];for(let a=r*n,l=s*n,c=0;c!==n;++c)t[l+c]=t[a+c];++s}return s!==e.length?(this.times=e.slice(0,s),this.values=t.slice(0,s*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Or.prototype.ValueTypeName="",Or.prototype.TimeBufferType=Float32Array,Or.prototype.ValueBufferType=Float32Array,Or.prototype.DefaultInterpolation=S;class Go extends Or{constructor(e,t,n){super(e,t,n)}}Go.prototype.ValueTypeName="bool",Go.prototype.ValueBufferType=Array,Go.prototype.DefaultInterpolation=Dn,Go.prototype.InterpolantFactoryMethodLinear=void 0,Go.prototype.InterpolantFactoryMethodSmooth=void 0;class Sd extends Or{constructor(e,t,n,i){super(e,t,n,i)}}Sd.prototype.ValueTypeName="color";class Xc extends Or{constructor(e,t,n,i){super(e,t,n,i)}}Xc.prototype.ValueTypeName="number";class qd extends Wc{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,s=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t);let c=e*a;for(let d=c+a;c!==d;c+=4)Gi.slerpFlat(r,0,s,c-a,s,c,l);return r}}class qc extends Or{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new qd(this.times,this.values,this.getValueSize(),e)}}qc.prototype.ValueTypeName="quaternion",qc.prototype.InterpolantFactoryMethodSmooth=void 0;class ko extends Or{constructor(e,t,n){super(e,t,n)}}ko.prototype.ValueTypeName="string",ko.prototype.ValueBufferType=Array,ko.prototype.DefaultInterpolation=Dn,ko.prototype.InterpolantFactoryMethodLinear=void 0,ko.prototype.InterpolantFactoryMethodSmooth=void 0;class Yc extends Or{constructor(e,t,n,i){super(e,t,n,i)}}Yc.prototype.ValueTypeName="vector";class Zc{constructor(e="",t=-1,n=[],i=me){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=ji(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let s=0,a=n.length;s!==a;++s)t.push(Bf(n[s]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,s=n.length;r!==s;++r)t.push(Or.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,s=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const d=ar(l);l=ci(l,1,d),c=ci(c,1,d),!i&&l[0]===0&&(l.push(r),c.push(c[0])),s.push(new Xc(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,s)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],d=c.name.match(r);if(d&&d.length>1){const p=d[1];let m=i[p];m||(i[p]=m=[]),m.push(c)}}const s=[];for(const a in i)s.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return s}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(p,m,g,_,v){if(g.length!==0){const E=[],w=[];bi(g,E,w,_),E.length!==0&&v.push(new p(m,E,w))}},i=[],r=e.name||"default",s=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let p=0;p<c.length;p++){const m=c[p].keys;if(!(!m||m.length===0))if(m[0].morphTargets){const g={};let _;for(_=0;_<m.length;_++)if(m[_].morphTargets)for(let v=0;v<m[_].morphTargets.length;v++)g[m[_].morphTargets[v]]=-1;for(const v in g){const E=[],w=[];for(let F=0;F!==m[_].morphTargets.length;++F){const D=m[_];E.push(D.time),w.push(D.morphTarget===v?1:0)}i.push(new Xc(".morphTargetInfluence["+v+"]",E,w))}l=g.length*s}else{const g=".bones["+t[p].name+"]";n(Yc,g+".position",m,"pos",i),n(qc,g+".quaternion",m,"rot",i),n(Yc,g+".scale",m,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Nf(u){switch(u.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Xc;case"vector":case"vector2":case"vector3":case"vector4":return Yc;case"color":return Sd;case"quaternion":return qc;case"bool":case"boolean":return Go;case"string":return ko}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+u)}function Bf(u){if(u.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Nf(u.type);if(u.times===void 0){const t=[],n=[];bi(u.keys,t,n,"value"),u.times=t,u.values=n}return e.parse!==void 0?e.parse(u):new e(u.name,u.times,u.values,u.interpolation)}const ws={enabled:!1,files:{},add:function(u,e){this.enabled!==!1&&(this.files[u]=e)},get:function(u){if(this.enabled!==!1)return this.files[u]},remove:function(u){delete this.files[u]},clear:function(){this.files={}}};class bd{constructor(e,t,n){const i=this;let r=!1,s=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){a++,r===!1&&i.onStart!==void 0&&i.onStart(d,s,a),r=!0},this.itemEnd=function(d){s++,i.onProgress!==void 0&&i.onProgress(d,s,a),s===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(d){i.onError!==void 0&&i.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,p){return c.push(d,p),this},this.removeHandler=function(d){const p=c.indexOf(d);return p!==-1&&c.splice(p,2),this},this.getHandler=function(d){for(let p=0,m=c.length;p<m;p+=2){const g=c[p],_=c[p+1];if(g.global&&(g.lastIndex=0),g.test(d))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Yd=new bd;class ur{constructor(e){this.manager=e!==void 0?e:Yd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ur.DEFAULT_MATERIAL_NAME="__DEFAULT";const na={};class Of extends Error{constructor(e,t){super(e),this.response=t}}class ia extends ur{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ws.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(na[e]!==void 0){na[e].push({onLoad:t,onProgress:n,onError:i});return}na[e]=[],na[e].push({onLoad:t,onProgress:n,onError:i});const s=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(s).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const d=na[e],p=c.body.getReader(),m=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),g=m?parseInt(m):0,_=g!==0;let v=0;const E=new ReadableStream({start(w){F();function F(){p.read().then(({done:D,value:B})=>{if(D)w.close();else{v+=B.byteLength;const Q=new ProgressEvent("progress",{lengthComputable:_,loaded:v,total:g});for(let le=0,xe=d.length;le<xe;le++){const ue=d[le];ue.onProgress&&ue.onProgress(Q)}w.enqueue(B),F()}},D=>{w.error(D)})}}});return new Response(E)}else throw new Of(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(d=>new DOMParser().parseFromString(d,a));case"json":return c.json();default:if(a==="")return c.text();{const p=/charset="?([^;"\s]*)"?/i.exec(a),m=p&&p[1]?p[1].toLowerCase():void 0,g=new TextDecoder(m);return c.arrayBuffer().then(_=>g.decode(_))}}}).then(c=>{ws.add(`file:${e}`,c);const d=na[e];delete na[e];for(let p=0,m=d.length;p<m;p++){const g=d[p];g.onLoad&&g.onLoad(c)}}).catch(c=>{const d=na[e];if(d===void 0)throw this.manager.itemError(e),c;delete na[e];for(let p=0,m=d.length;p<m;p++){const g=d[p];g.onError&&g.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class zf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new ia(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=Zc.parse(e[n]);t.push(i)}return t}}class Gf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=this,s=[],a=new $,l=new ia(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(r.withCredentials);let c=0;function d(p){l.load(e[p],function(m){const g=r.parse(m,!0);s[p]={width:g.width,height:g.height,format:g.format,mipmaps:g.mipmaps},c+=1,c===6&&(g.mipmapCount===1&&(a.minFilter=Wn),a.image=s,a.format=g.format,a.needsUpdate=!0,t&&t(a))},n,i)}if(Array.isArray(e))for(let p=0,m=e.length;p<m;++p)d(p);else l.load(e,function(p){const m=r.parse(p,!0);if(m.isCubemap){const g=m.mipmaps.length/m.mipmapCount;for(let _=0;_<g;_++){s[_]={mipmaps:[]};for(let v=0;v<m.mipmapCount;v++)s[_].mipmaps.push(m.mipmaps[_*m.mipmapCount+v]),s[_].format=m.format,s[_].width=m.width,s[_].height=m.height}a.image=s}else a.image.width=m.width,a.image.height=m.height,a.mipmaps=m.mipmaps;m.mipmapCount===1&&(a.minFilter=Wn),a.format=m.format,a.needsUpdate=!0,t&&t(a)},n,i);return a}}const Xl=new WeakMap;class $c extends ur{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,s=ws.get(`image:${e}`);if(s!==void 0){if(s.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(s),r.manager.itemEnd(e)},0);else{let p=Xl.get(s);p===void 0&&(p=[],Xl.set(s,p)),p.push({onLoad:t,onError:i})}return s}const a=fo("img");function l(){d(),t&&t(this);const p=Xl.get(this)||[];for(let m=0;m<p.length;m++){const g=p[m];g.onLoad&&g.onLoad(this)}Xl.delete(this),r.manager.itemEnd(e)}function c(p){d(),i&&i(p),ws.remove(`image:${e}`);const m=Xl.get(this)||[];for(let g=0;g<m.length;g++){const _=m[g];_.onError&&_.onError(p)}Xl.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function d(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ws.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class kf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=new _l;r.colorSpace=Ci;const s=new $c(this.manager);s.setCrossOrigin(this.crossOrigin),s.setPath(this.path);let a=0;function l(c){s.load(e[c],function(d){r.images[c]=d,a++,a===6&&(r.needsUpdate=!0,t&&t(r))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return r}}class Vf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new rr,a=new ia(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(l){let c;try{c=r.parse(l)}catch(d){if(i!==void 0)i(d);else{console.error(d);return}}c.image!==void 0?s.image=c.image:c.data!==void 0&&(s.image.width=c.width,s.image.height=c.height,s.image.data=c.data),s.wrapS=c.wrapS!==void 0?c.wrapS:Ai,s.wrapT=c.wrapT!==void 0?c.wrapT:Ai,s.magFilter=c.magFilter!==void 0?c.magFilter:Wn,s.minFilter=c.minFilter!==void 0?c.minFilter:Wn,s.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(s.colorSpace=c.colorSpace),c.flipY!==void 0&&(s.flipY=c.flipY),c.format!==void 0&&(s.format=c.format),c.type!==void 0&&(s.type=c.type),c.mipmaps!==void 0&&(s.mipmaps=c.mipmaps,s.minFilter=mn),c.mipmapCount===1&&(s.minFilter=Wn),c.generateMipmaps!==void 0&&(s.generateMipmaps=c.generateMipmaps),s.needsUpdate=!0,t&&t(s,c)},n,i),s}}class Hf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=new Yn,s=new $c(this.manager);return s.setCrossOrigin(this.crossOrigin),s.setPath(this.path),s.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Xa extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Zd extends Xa{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Et(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Td=new Dt,$d=new U,Jd=new U;class Ad{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.mapType=gi,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ll,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new ni(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;$d.setFromMatrixPosition(e.matrixWorld),t.position.copy($d),Jd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Jd),t.updateMatrixWorld(),Td.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Td,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Td)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Wf extends Ad{constructor(){super(new ir(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Sa*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Kd extends Xa{constructor(e,t,n=0,i=Math.PI/3,r=0,s=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.distance=n,this.angle=i,this.penumbra=r,this.decay=s,this.map=null,this.shadow=new Wf}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Qd=new Dt,Jc=new U,Ed=new U;class Xf extends Ad{constructor(){super(new ir(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new ni(2,1,1,1),new ni(0,1,1,1),new ni(3,1,1,1),new ni(1,1,1,1),new ni(3,0,1,1),new ni(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Jc.setFromMatrixPosition(e.matrixWorld),n.position.copy(Jc),Ed.copy(n.position),Ed.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ed),n.updateMatrixWorld(),i.makeTranslation(-Jc.x,-Jc.y,-Jc.z),Qd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qd,n.coordinateSystem,n.reversedDepth)}}class jd extends Xa{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Xf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class wd extends gl{constructor(e=-1,t=1,n=1,i=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,s=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,s=r+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class qf extends Ad{constructor(){super(new wd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ef extends Xa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new qf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class tf extends Xa{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class nf extends Xa{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class rf{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new U)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,r=e.z,s=this.coefficients;return t.copy(s[0]).multiplyScalar(.282095),t.addScaledVector(s[1],.488603*i),t.addScaledVector(s[2],.488603*r),t.addScaledVector(s[3],.488603*n),t.addScaledVector(s[4],1.092548*(n*i)),t.addScaledVector(s[5],1.092548*(i*r)),t.addScaledVector(s[6],.315392*(3*r*r-1)),t.addScaledVector(s[7],1.092548*(n*r)),t.addScaledVector(s[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,r=e.z,s=this.coefficients;return t.copy(s[0]).multiplyScalar(.886227),t.addScaledVector(s[1],1.023328*i),t.addScaledVector(s[2],1.023328*r),t.addScaledVector(s[3],1.023328*n),t.addScaledVector(s[4],.858086*n*i),t.addScaledVector(s[5],.858086*i*r),t.addScaledVector(s[6],.743125*r*r-.247708),t.addScaledVector(s[7],.858086*n*r),t.addScaledVector(s[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,r=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*r,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*r,t[6]=.315392*(3*r*r-1),t[7]=1.092548*n*r,t[8]=.546274*(n*n-i*i)}}class sf extends Xa{constructor(e=new rf,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class Jh extends ur{constructor(e){super(e),this.textures={}}load(e,t,n,i){const r=this,s=new ia(r.manager);s.setPath(r.path),s.setRequestHeader(r.requestHeader),s.setWithCredentials(r.withCredentials),s.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=this.textures;function n(r){return t[r]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",r),t[r]}const i=this.createMaterialFromType(e.type);if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new Et().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(i.dispersion=e.dispersion),e.iridescence!==void 0&&(i.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(i.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(i.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(i.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(i.depthFunc=e.depthFunc),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(i.blendSrc=e.blendSrc),e.blendDst!==void 0&&(i.blendDst=e.blendDst),e.blendEquation!==void 0&&(i.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(i.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(i.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==void 0&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(i.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const r in e.uniforms){const s=e.uniforms[r];switch(i.uniforms[r]={},s.type){case"t":i.uniforms[r].value=n(s.value);break;case"c":i.uniforms[r].value=new Et().setHex(s.value);break;case"v2":i.uniforms[r].value=new Ie().fromArray(s.value);break;case"v3":i.uniforms[r].value=new U().fromArray(s.value);break;case"v4":i.uniforms[r].value=new ni().fromArray(s.value);break;case"m3":i.uniforms[r].value=new vr().fromArray(s.value);break;case"m4":i.uniforms[r].value=new Dt().fromArray(s.value);break;default:i.uniforms[r].value=s.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(i.glslVersion=e.glslVersion),e.extensions!==void 0)for(const r in e.extensions)i.extensions[r]=e.extensions[r];if(e.lights!==void 0&&(i.lights=e.lights),e.clipping!==void 0&&(i.clipping=e.clipping),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let r=e.normalScale;Array.isArray(r)===!1&&(r=[r,r]),i.normalScale=new Ie().fromArray(r)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapRotation!==void 0&&i.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new Ie().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(i.iridescenceMap=n(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.anisotropyMap!==void 0&&(i.anisotropyMap=n(e.anisotropyMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return Jh.createMaterialFromType(e)}static createMaterialFromType(e){const t={ShadowMaterial:Ht,SpriteMaterial:Lc,RawShaderMaterial:ln,ShaderMaterial:ml,PointsMaterial:x,MeshPhysicalMaterial:xn,MeshStandardMaterial:Rn,MeshPhongMaterial:un,MeshToonMaterial:mt,MeshNormalMaterial:In,MeshLambertMaterial:Kt,MeshDepthMaterial:qi,MeshDistanceMaterial:ea,MeshBasicMaterial:Xs,MeshMatcapMaterial:Yi,LineDashedMaterial:Wa,LineBasicMaterial:Li,Material:Mi};return new t[e]}}class Cd{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class af extends kt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class of extends ur{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new ia(r.manager);s.setPath(r.path),s.setRequestHeader(r.requestHeader),s.setWithCredentials(r.withCredentials),s.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(g,_){if(t[_]!==void 0)return t[_];const E=g.interleavedBuffers[_],w=r(g,E.buffer),F=ba(E.type,w),D=new vl(F,E.stride);return D.uuid=E.uuid,t[_]=D,D}function r(g,_){if(n[_]!==void 0)return n[_];const E=g.arrayBuffers[_],w=new Uint32Array(E).buffer;return n[_]=w,w}const s=e.isInstancedBufferGeometry?new af:new kt,a=e.data.index;if(a!==void 0){const g=ba(a.type,a.array);s.setIndex(new gn(g,1))}const l=e.data.attributes;for(const g in l){const _=l[g];let v;if(_.isInterleavedBufferAttribute){const E=i(e.data,_.data);v=new $s(E,_.itemSize,_.offset,_.normalized)}else{const E=ba(_.type,_.array),w=_.isInstancedBufferAttribute?Va:gn;v=new w(E,_.itemSize,_.normalized)}_.name!==void 0&&(v.name=_.name),_.usage!==void 0&&v.setUsage(_.usage),s.setAttribute(g,v)}const c=e.data.morphAttributes;if(c)for(const g in c){const _=c[g],v=[];for(let E=0,w=_.length;E<w;E++){const F=_[E];let D;if(F.isInterleavedBufferAttribute){const B=i(e.data,F.data);D=new $s(B,F.itemSize,F.offset,F.normalized)}else{const B=ba(F.type,F.array);D=new gn(B,F.itemSize,F.normalized)}F.name!==void 0&&(D.name=F.name),v.push(D)}s.morphAttributes[g]=v}e.data.morphTargetsRelative&&(s.morphTargetsRelative=!0);const p=e.data.groups||e.data.drawcalls||e.data.offsets;if(p!==void 0)for(let g=0,_=p.length;g!==_;++g){const v=p[g];s.addGroup(v.start,v.count,v.materialIndex)}const m=e.data.boundingSphere;return m!==void 0&&(s.boundingSphere=new li().fromJSON(m)),e.name&&(s.name=e.name),e.userData&&(s.userData=e.userData),s}}class Yf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=this,s=this.path===""?Cd.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||s;const a=new ia(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(p){i!==void 0&&i(p),console.error("THREE:ObjectLoader: Can't parse "+e+".",p.message);return}const d=c.metadata;if(d===void 0||d.type===void 0||d.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}r.parse(c,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?Cd.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const r=new ia(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);const s=await r.loadAsync(e,t),a=JSON.parse(s),l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(a)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),s=this.parseImages(e.images,function(){t!==void 0&&t(c)}),a=this.parseTextures(e.textures,s),l=this.parseMaterials(e.materials,a),c=this.parseObject(e.object,r,l,a,n),d=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,d),this.bindLightTargets(c),t!==void 0){let p=!1;for(const m in s)if(s[m].data instanceof HTMLImageElement){p=!0;break}p===!1&&t(c)}return c}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),r=await this.parseImagesAsync(e.images),s=this.parseTextures(e.textures,r),a=this.parseMaterials(e.materials,s),l=this.parseObject(e.object,i,a,s,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const r=new I().fromJSON(e[n]);t[r.uuid]=r}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(r){r.isBone&&(i[r.uuid]=r)}),e!==void 0)for(let r=0,s=e.length;r<s;r++){const a=new Rl().fromJSON(e[r],i);n[a.uuid]=a}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new of;for(let r=0,s=e.length;r<s;r++){let a;const l=e[r];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(l);break;default:l.type in ft?a=ft[l.type].fromJSON(l,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),l.userData!==void 0&&(a.userData=l.userData),n[l.uuid]=a}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const r=new Jh;r.setTextures(t);for(let s=0,a=e.length;s<a;s++){const l=e[s];n[l.uuid]===void 0&&(n[l.uuid]=r.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],r=Zc.parse(i);t[r.uuid]=r}return t}parseImages(e,t){const n=this,i={};let r;function s(l){return n.manager.itemStart(l),r.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function a(l){if(typeof l=="string"){const c=l,d=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return s(d)}else return l.data?{data:ba(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){const l=new bd(t);r=new $c(l),r.setCrossOrigin(this.crossOrigin);for(let c=0,d=e.length;c<d;c++){const p=e[c],m=p.url;if(Array.isArray(m)){const g=[];for(let _=0,v=m.length;_<v;_++){const E=m[_],w=a(E);w!==null&&(w instanceof HTMLImageElement?g.push(w):g.push(new rr(w.data,w.width,w.height)))}i[p.uuid]=new gs(g)}else{const g=a(p.url);i[p.uuid]=new gs(g)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function r(s){if(typeof s=="string"){const a=s,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:t.resourcePath+a;return await i.loadAsync(l)}else return s.data?{data:ba(s.type,s.data),width:s.width,height:s.height}:null}if(e!==void 0&&e.length>0){i=new $c(this.manager),i.setCrossOrigin(this.crossOrigin);for(let s=0,a=e.length;s<a;s++){const l=e[s],c=l.url;if(Array.isArray(c)){const d=[];for(let p=0,m=c.length;p<m;p++){const g=c[p],_=await r(g);_!==null&&(_ instanceof HTMLImageElement?d.push(_):d.push(new rr(_.data,_.width,_.height)))}n[l.uuid]=new gs(d)}else{const d=await r(l.url);n[l.uuid]=new gs(d)}}}return n}parseTextures(e,t){function n(r,s){return typeof r=="number"?r:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",r),s[r])}const i={};if(e!==void 0)for(let r=0,s=e.length;r<s;r++){const a=e[r];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),t[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);const l=t[a.image],c=l.data;let d;Array.isArray(c)?(d=new _l,c.length===6&&(d.needsUpdate=!0)):(c&&c.data?d=new rr:d=new Yn,c&&(d.needsUpdate=!0)),d.source=l,d.uuid=a.uuid,a.name!==void 0&&(d.name=a.name),a.mapping!==void 0&&(d.mapping=n(a.mapping,Zf)),a.channel!==void 0&&(d.channel=a.channel),a.offset!==void 0&&d.offset.fromArray(a.offset),a.repeat!==void 0&&d.repeat.fromArray(a.repeat),a.center!==void 0&&d.center.fromArray(a.center),a.rotation!==void 0&&(d.rotation=a.rotation),a.wrap!==void 0&&(d.wrapS=n(a.wrap[0],lf),d.wrapT=n(a.wrap[1],lf)),a.format!==void 0&&(d.format=a.format),a.internalFormat!==void 0&&(d.internalFormat=a.internalFormat),a.type!==void 0&&(d.type=a.type),a.colorSpace!==void 0&&(d.colorSpace=a.colorSpace),a.minFilter!==void 0&&(d.minFilter=n(a.minFilter,cf)),a.magFilter!==void 0&&(d.magFilter=n(a.magFilter,cf)),a.anisotropy!==void 0&&(d.anisotropy=a.anisotropy),a.flipY!==void 0&&(d.flipY=a.flipY),a.generateMipmaps!==void 0&&(d.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(d.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(d.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(d.compareFunction=a.compareFunction),a.userData!==void 0&&(d.userData=a.userData),i[a.uuid]=d}return i}parseObject(e,t,n,i,r){let s;function a(m){return t[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",m),t[m]}function l(m){if(m!==void 0){if(Array.isArray(m)){const g=[];for(let _=0,v=m.length;_<v;_++){const E=m[_];n[E]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",E),g.push(n[E])}return g}return n[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",m),n[m]}}function c(m){return i[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",m),i[m]}let d,p;switch(e.type){case"Scene":s=new wh,e.background!==void 0&&(Number.isInteger(e.background)?s.background=new Et(e.background):s.background=c(e.background)),e.environment!==void 0&&(s.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?s.fog=new yl(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(s.fog=new xl(e.fog.color,e.fog.density)),e.fog.name!==""&&(s.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(s.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(s.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&s.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(s.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&s.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":s=new ir(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(s.focus=e.focus),e.zoom!==void 0&&(s.zoom=e.zoom),e.filmGauge!==void 0&&(s.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(s.filmOffset=e.filmOffset),e.view!==void 0&&(s.view=Object.assign({},e.view));break;case"OrthographicCamera":s=new wd(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(s.zoom=e.zoom),e.view!==void 0&&(s.view=Object.assign({},e.view));break;case"AmbientLight":s=new tf(e.color,e.intensity);break;case"DirectionalLight":s=new ef(e.color,e.intensity),s.target=e.target||"";break;case"PointLight":s=new jd(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":s=new nf(e.color,e.intensity,e.width,e.height);break;case"SpotLight":s=new Kd(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),s.target=e.target||"";break;case"HemisphereLight":s=new Zd(e.color,e.groundColor,e.intensity);break;case"LightProbe":s=new sf().fromJSON(e);break;case"SkinnedMesh":d=a(e.geometry),p=l(e.material),s=new Fh(d,p),e.bindMode!==void 0&&(s.bindMode=e.bindMode),e.bindMatrix!==void 0&&s.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(s.skeleton=e.skeleton);break;case"Mesh":d=a(e.geometry),p=l(e.material),s=new nr(d,p);break;case"InstancedMesh":d=a(e.geometry),p=l(e.material);const m=e.count,g=e.instanceMatrix,_=e.instanceColor;s=new Oh(d,p,m),s.instanceMatrix=new Va(new Float32Array(g.array),16),_!==void 0&&(s.instanceColor=new Va(new Float32Array(_.array),_.itemSize));break;case"BatchedMesh":d=a(e.geometry),p=l(e.material),s=new Wh(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,p),s.geometry=d,s.perObjectFrustumCulled=e.perObjectFrustumCulled,s.sortObjects=e.sortObjects,s._drawRanges=e.drawRanges,s._reservedRanges=e.reservedRanges,s._geometryInfo=e.geometryInfo.map(v=>{let E=null,w=null;return v.boundingBox!==void 0&&(E=new yi().fromJSON(v.boundingBox)),v.boundingSphere!==void 0&&(w=new li().fromJSON(v.boundingSphere)),{...v,boundingBox:E,boundingSphere:w}}),s._instanceInfo=e.instanceInfo,s._availableInstanceIds=e._availableInstanceIds,s._availableGeometryIds=e._availableGeometryIds,s._nextIndexStart=e.nextIndexStart,s._nextVertexStart=e.nextVertexStart,s._geometryCount=e.geometryCount,s._maxInstanceCount=e.maxInstanceCount,s._maxVertexCount=e.maxVertexCount,s._maxIndexCount=e.maxIndexCount,s._geometryInitialized=e.geometryInitialized,s._matricesTexture=c(e.matricesTexture.uuid),s._indirectTexture=c(e.indirectTexture.uuid),e.colorsTexture!==void 0&&(s._colorsTexture=c(e.colorsTexture.uuid)),e.boundingSphere!==void 0&&(s.boundingSphere=new li().fromJSON(e.boundingSphere)),e.boundingBox!==void 0&&(s.boundingBox=new yi().fromJSON(e.boundingBox));break;case"LOD":s=new Uc;break;case"Line":s=new As(a(e.geometry),l(e.material));break;case"LineLoop":s=new h(a(e.geometry),l(e.material));break;case"LineSegments":s=new f(a(e.geometry),l(e.material));break;case"PointCloud":case"Points":s=new j(a(e.geometry),l(e.material));break;case"Sprite":s=new Ph(l(e.material));break;case"Group":s=new Ba;break;case"Bone":s=new Nc;break;default:s=new en}if(s.uuid=e.uuid,e.name!==void 0&&(s.name=e.name),e.matrix!==void 0?(s.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(s.matrixAutoUpdate=e.matrixAutoUpdate),s.matrixAutoUpdate&&s.matrix.decompose(s.position,s.quaternion,s.scale)):(e.position!==void 0&&s.position.fromArray(e.position),e.rotation!==void 0&&s.rotation.fromArray(e.rotation),e.quaternion!==void 0&&s.quaternion.fromArray(e.quaternion),e.scale!==void 0&&s.scale.fromArray(e.scale)),e.up!==void 0&&s.up.fromArray(e.up),e.castShadow!==void 0&&(s.castShadow=e.castShadow),e.receiveShadow!==void 0&&(s.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(s.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(s.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(s.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(s.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&s.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(s.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(s.visible=e.visible),e.frustumCulled!==void 0&&(s.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(s.renderOrder=e.renderOrder),e.userData!==void 0&&(s.userData=e.userData),e.layers!==void 0&&(s.layers.mask=e.layers),e.children!==void 0){const m=e.children;for(let g=0;g<m.length;g++)s.add(this.parseObject(m[g],t,n,i,r))}if(e.animations!==void 0){const m=e.animations;for(let g=0;g<m.length;g++){const _=m[g];s.animations.push(r[_])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(s.autoUpdate=e.autoUpdate);const m=e.levels;for(let g=0;g<m.length;g++){const _=m[g],v=s.getObjectByProperty("uuid",_.object);v!==void 0&&s.addLevel(v,_.distance,_.hysteresis)}}return s}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new en}})}}const Zf={UVMapping:ls,CubeReflectionMapping:Hr,CubeRefractionMapping:$a,EquirectangularReflectionMapping:ca,EquirectangularRefractionMapping:Ji,CubeUVReflectionMapping:Ki},lf={RepeatWrapping:Qi,ClampToEdgeWrapping:Ai,MirroredRepeatWrapping:wr},cf={NearestFilter:mi,NearestMipmapNearestFilter:Is,NearestMipmapLinearFilter:Cr,LinearFilter:Wn,LinearMipmapNearestFilter:Ps,LinearMipmapLinearFilter:mn},Rd=new WeakMap;class $f extends ur{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,s=ws.get(`image-bitmap:${e}`);if(s!==void 0){if(r.manager.itemStart(e),s.then){s.then(c=>{if(Rd.has(s)===!0)i&&i(Rd.get(s)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(s),r.manager.itemEnd(e)},0),s}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return ws.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Rd.set(l,c),ws.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ws.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let Kh;class Id{static getContext(){return Kh===void 0&&(Kh=new(window.AudioContext||window.webkitAudioContext)),Kh}static setContext(e){Kh=e}}class Jf extends ur{constructor(e){super(e)}load(e,t,n,i){const r=this,s=new ia(this.manager);s.setResponseType("arraybuffer"),s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(l){try{const c=l.slice(0);Id.getContext().decodeAudioData(c,function(p){t(p)}).catch(a)}catch(c){a(c)}},n,i);function a(l){i?i(l):console.error(l),r.manager.itemError(e)}}}const hf=new Dt,uf=new Dt,Vo=new Dt;class Kf{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new ir,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new ir,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,Vo.copy(e.projectionMatrix);const i=t.eyeSep/2,r=i*t.near/t.focus,s=t.near*Math.tan(ks*t.fov*.5)/t.zoom;let a,l;uf.elements[12]=-i,hf.elements[12]=i,a=-s*t.aspect+r,l=s*t.aspect+r,Vo.elements[0]=2*t.near/(l-a),Vo.elements[8]=(l+a)/(l-a),this.cameraL.projectionMatrix.copy(Vo),a=-s*t.aspect-r,l=s*t.aspect-r,Vo.elements[0]=2*t.near/(l-a),Vo.elements[8]=(l+a)/(l-a),this.cameraR.projectionMatrix.copy(Vo)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(uf),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(hf)}}class Qf extends ir{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class df{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Ho=new U,Pd=new Gi,jf=new U,Wo=new U,Xo=new U;class ep extends en{constructor(){super(),this.type="AudioListener",this.context=Id.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new df}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(Ho,Pd,jf),Wo.set(0,0,-1).applyQuaternion(Pd),Xo.set(0,1,0).applyQuaternion(Pd),t.positionX){const n=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(Ho.x,n),t.positionY.linearRampToValueAtTime(Ho.y,n),t.positionZ.linearRampToValueAtTime(Ho.z,n),t.forwardX.linearRampToValueAtTime(Wo.x,n),t.forwardY.linearRampToValueAtTime(Wo.y,n),t.forwardZ.linearRampToValueAtTime(Wo.z,n),t.upX.linearRampToValueAtTime(Xo.x,n),t.upY.linearRampToValueAtTime(Xo.y,n),t.upZ.linearRampToValueAtTime(Xo.z,n)}else t.setPosition(Ho.x,Ho.y,Ho.z),t.setOrientation(Wo.x,Wo.y,Wo.z,Xo.x,Xo.y,Xo.z)}}class ff extends en{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(console.warn("THREE.Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}}const qo=new U,pf=new Gi,tp=new U,Yo=new U;class np extends ff{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(qo,pf,tp),Yo.set(0,0,1).applyQuaternion(pf);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(qo.x,n),t.positionY.linearRampToValueAtTime(qo.y,n),t.positionZ.linearRampToValueAtTime(qo.z,n),t.orientationX.linearRampToValueAtTime(Yo.x,n),t.orientationY.linearRampToValueAtTime(Yo.y,n),t.orientationZ.linearRampToValueAtTime(Yo.z,n)}else t.setPosition(qo.x,qo.y,qo.z),t.setOrientation(Yo.x,Yo.y,Yo.z)}}class ip{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class mf{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,s;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,s=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,s=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,s=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=s,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let s=this.cumulativeWeight;if(s===0){for(let a=0;a!==i;++a)n[r+a]=n[a];s=t}else{s+=t;const a=t/s;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=s}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,s=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}s>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,s=i;r!==s;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let s=0;s!==r;++s)e[t+s]=e[n+s]}_slerp(e,t,n,i){Gi.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const s=this._workIndex*r;Gi.multiplyQuaternionsFlat(e,s,e,t,e,n),Gi.slerpFlat(e,t,e,t,e,s,i)}_lerp(e,t,n,i,r){const s=1-i;for(let a=0;a!==r;++a){const l=t+a;e[l]=e[l]*s+e[n+a]*i}}_lerpAdditive(e,t,n,i,r){for(let s=0;s!==r;++s){const a=t+s;e[a]=e[a]+e[n+s]*i}}}const Ld="\\[\\]\\.:\\/",rp=new RegExp("["+Ld+"]","g"),Dd="[^"+Ld+"]",sp="[^"+Ld.replace("\\.","")+"]",ap=/((?:WC+[\/:])*)/.source.replace("WC",Dd),op=/(WCOD+)?/.source.replace("WCOD",sp),lp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Dd),cp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Dd),hp=new RegExp("^"+ap+op+lp+cp+"$"),up=["material","materials","bones","map"];class dp{constructor(e,t,n){const i=n||rn.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class rn{constructor(e,t,n){this.path=t,this.parsedPath=n||rn.parseTrackName(t),this.node=rn.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new rn.Composite(e,t,n):new rn(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(rp,"")}static parseTrackName(e){const t=hp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);up.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let s=0;s<r.length;s++){const a=r[s];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=rn.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const s=e[i];if(s===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=r}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}rn.Composite=dp,rn.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},rn.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},rn.prototype.GetterByBindingType=[rn.prototype._getValue_direct,rn.prototype._getValue_array,rn.prototype._getValue_arrayElement,rn.prototype._getValue_toArray],rn.prototype.SetterByBindingTypeAndVersioning=[[rn.prototype._setValue_direct,rn.prototype._setValue_direct_setNeedsUpdate,rn.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[rn.prototype._setValue_array,rn.prototype._setValue_array_setNeedsUpdate,rn.prototype._setValue_array_setMatrixWorldNeedsUpdate],[rn.prototype._setValue_arrayElement,rn.prototype._setValue_arrayElement_setNeedsUpdate,rn.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[rn.prototype._setValue_fromArray,rn.prototype._setValue_fromArray_setNeedsUpdate,rn.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class fp{constructor(){this.isAnimationObjectGroup=!0,this.uuid=ji(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,r=this._bindings,s=r.length;let a,l=e.length,c=this.nCachedObjects_;for(let d=0,p=arguments.length;d!==p;++d){const m=arguments[d],g=m.uuid;let _=t[g];if(_===void 0){_=l++,t[g]=_,e.push(m);for(let v=0,E=s;v!==E;++v)r[v].push(new rn(m,n[v],i[v]))}else if(_<c){a=e[_];const v=--c,E=e[v];t[E.uuid]=_,e[_]=E,t[g]=v,e[v]=m;for(let w=0,F=s;w!==F;++w){const D=r[w],B=D[v];let Q=D[_];D[_]=B,Q===void 0&&(Q=new rn(m,n[w],i[w])),D[v]=Q}}else e[_]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_;for(let s=0,a=arguments.length;s!==a;++s){const l=arguments[s],c=l.uuid,d=t[c];if(d!==void 0&&d>=r){const p=r++,m=e[p];t[m.uuid]=d,e[d]=m,t[c]=p,e[p]=l;for(let g=0,_=i;g!==_;++g){const v=n[g],E=v[p],w=v[d];v[d]=E,v[p]=w}}}this.nCachedObjects_=r}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_,s=e.length;for(let a=0,l=arguments.length;a!==l;++a){const c=arguments[a],d=c.uuid,p=t[d];if(p!==void 0)if(delete t[d],p<r){const m=--r,g=e[m],_=--s,v=e[_];t[g.uuid]=p,e[p]=g,t[v.uuid]=m,e[m]=v,e.pop();for(let E=0,w=i;E!==w;++E){const F=n[E],D=F[m],B=F[_];F[p]=D,F[m]=B,F.pop()}}else{const m=--s,g=e[m];m>0&&(t[g.uuid]=p),e[p]=g,e.pop();for(let _=0,v=i;_!==v;++_){const E=n[_];E[p]=E[m],E.pop()}}}this.nCachedObjects_=r}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const r=this._bindings;if(i!==void 0)return r[i];const s=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,d=this.nCachedObjects_,p=new Array(c);i=r.length,n[e]=i,s.push(e),a.push(t),r.push(p);for(let m=d,g=l.length;m!==g;++m){const _=l[m];p[m]=new rn(_,e,t)}return p}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,r=this._parsedPaths,s=this._bindings,a=s.length-1,l=s[a],c=e[a];t[c]=n,s[n]=l,s.pop(),r[n]=r[a],r.pop(),i[n]=i[a],i.pop()}}}class gf{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,s=r.length,a=new Array(s),l={endingStart:V,endingEnd:V};for(let c=0;c!==s;++c){const d=r[c].createInterpolant(null);a[c]=d,d.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(s),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=so,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,s=r/i,a=i/r;e.warp(1,s,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,s=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/s,c[1]=t/s,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const s=this._updateTime(t),a=this._updateWeight(e);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case xt:for(let d=0,p=l.length;d!==p;++d)l[d].evaluate(s),c[d].accumulateAdditive(a);break;case me:default:for(let d=0,p=l.length;d!==p;++d)l[d].evaluate(s),c[d].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const s=n===ao;if(e===0)return r===-1?i:s&&(r&1)===1?t-i:i;if(n===xa){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,s)):this._setEndings(this.repetitions===0,!0,s)),i>=t||i<0){const a=Math.floor(i/t);i-=t*a,r+=Math.abs(a);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,s)}else this._setEndings(!1,!1,s);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(s&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=oe,i.endingEnd=oe):(e?i.endingStart=this.zeroSlopeAtStart?oe:V:i.endingStart=Me,t?i.endingEnd=this.zeroSlopeAtEnd?oe:V:i.endingEnd=Me)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let s=this._weightInterpolant;s===null&&(s=i._lendControlInterpolant(),this._weightInterpolant=s);const a=s.parameterPositions,l=s.sampleValues;return a[0]=r,l[0]=t,a[1]=r+e,l[1]=n,this}}const pp=new Float32Array(1);class mp extends Qr{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,s=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let d=c[l];d===void 0&&(d={},c[l]=d);for(let p=0;p!==r;++p){const m=i[p],g=m.name;let _=d[g];if(_!==void 0)++_.referenceCount,s[p]=_;else{if(_=s[p],_!==void 0){_._cacheIndex===null&&(++_.referenceCount,this._addInactiveBinding(_,l,g));continue}const v=t&&t._propertyBindings[p].binding.parsedPath;_=new mf(rn.create(n,g,v),m.ValueTypeName,m.getValueSize()),++_.referenceCount,this._addInactiveBinding(_,l,g),s[p]=_}a[p].resultBuffer=_.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let s=r[t];if(s===void 0)s={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=s;else{const a=s.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),s.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,s=this._actionsByClip,a=s[r],l=a.knownActions,c=l[l.length-1],d=e._byClipCacheIndex;c._byClipCacheIndex=d,l[d]=c,l.pop(),e._byClipCacheIndex=null;const p=a.actionByRoot,m=(e._localRoot||this._root).uuid;delete p[m],l.length===0&&delete s[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let s=i[t];s===void 0&&(s={},i[t]=s),s[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,s=this._bindingsByRootAndName,a=s[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[r],Object.keys(a).length===0&&delete s[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Md(new Float32Array(2),new Float32Array(2),1,pp),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let s=typeof e=="string"?Zc.findByName(i,e):e;const a=s!==null?s.uuid:e,l=this._actionsByClip[a];let c=null;if(n===void 0&&(s!==null?n=s.blendMode:n=me),l!==void 0){const p=l.actionByRoot[r];if(p!==void 0&&p.blendMode===n)return p;c=l.knownActions[0],s===null&&(s=c._clip)}if(s===null)return null;const d=new gf(this,s,t,n);return this._bindAction(d,c),this._addInactiveAction(d,a,r),d}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Zc.findByName(n,e):e,s=r?r.uuid:e,a=this._actionsByClip[s];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),s=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,s);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(s);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const s=r.knownActions;for(let a=0,l=s.length;a!==l;++a){const c=s[a];this._deactivateAction(c);const d=c._cacheIndex,p=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,p._cacheIndex=d,t[d]=p,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const s in n){const a=n[s].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const s in r){const a=r[s];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class gp extends xc{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isRenderTarget3D=!0,this.depth=n,this.texture=new yc(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class Ud{constructor(e){this.value=e}clone(){return new Ud(this.value.clone===void 0?this.value:this.value.clone())}}let _p=0;class xp extends Qr{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:_p++}),this.name="",this.usage=va,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const r=Array.isArray(t[n])?t[n]:[t[n]];for(let s=0;s<r.length;s++)this.uniforms.push(r[s].clone())}return this}clone(){return new this.constructor().copy(this)}}class yp extends vl{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class vp{constructor(e,t,n,i,r,s=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=r,this.normalized=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const _f=new Dt;class Mp{constructor(e,t,n=0,i=1/0){this.ray=new Ra(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new uh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return _f.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(_f),this}intersectObject(e,t=!0,n=[]){return Fd(e,this,n,t),n.sort(xf),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Fd(e[i],this,n,t);return n.sort(xf),n}}function xf(u,e){return u.distance-e.distance}function Fd(u,e,t,n){let i=!0;if(u.layers.test(e.layers)&&u.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=u.children;for(let s=0,a=r.length;s<a;s++)Fd(r[s],e,t,!0)}}class Sp{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=bp.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function bp(){this._document.hidden===!1&&this.reset()}class Tp{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=vt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(vt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Ap{constructor(e=1,t=0,n=0){this.radius=e,this.theta=t,this.y=n}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}class Nd{constructor(e,t,n,i){Nd.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}}const yf=new Ie;class Ep{constructor(e=new Ie(1/0,1/0),t=new Ie(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=yf.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yf).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const vf=new U,Qh=new U,ql=new U,Yl=new U,Bd=new U,wp=new U,Cp=new U;class Rp{constructor(e=new U,t=new U){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){vf.subVectors(e,this.start),Qh.subVectors(this.end,this.start);const n=Qh.dot(Qh);let r=Qh.dot(vf)/n;return t&&(r=vt(r,0,1)),r}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=wp,n=Cp){const i=10000000000000001e-32;let r,s;const a=this.start,l=e.start,c=this.end,d=e.end;ql.subVectors(c,a),Yl.subVectors(d,l),Bd.subVectors(a,l);const p=ql.dot(ql),m=Yl.dot(Yl),g=Yl.dot(Bd);if(p<=i&&m<=i)return t.copy(a),n.copy(l),t.sub(n),t.dot(t);if(p<=i)r=0,s=g/m,s=vt(s,0,1);else{const _=ql.dot(Bd);if(m<=i)s=0,r=vt(-_/p,0,1);else{const v=ql.dot(Yl),E=p*m-v*v;E!==0?r=vt((v*g-_*m)/E,0,1):r=0,s=(v*r+g)/m,s<0?(s=0,r=vt(-_/p,0,1)):s>1&&(s=1,r=vt((v-_)/p,0,1))}}return t.copy(a).add(ql.multiplyScalar(r)),n.copy(l).add(Yl.multiplyScalar(s)),t.sub(n),t.dot(t)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Mf=new U;class Ip extends en{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new kt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let s=0,a=1,l=32;s<l;s++,a++){const c=s/l*Math.PI*2,d=a/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(d),Math.sin(d),1)}n.setAttribute("position",new Ke(i,3));const r=new Li({fog:!1,toneMapped:!1});this.cone=new f(n,r),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Mf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Mf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const qa=new U,jh=new Dt,Od=new Dt;class Pp extends f{constructor(e){const t=Sf(e),n=new kt,i=[],r=[];for(let c=0;c<t.length;c++){const d=t[c];d.parent&&d.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(0,0,0),r.push(0,0,0))}n.setAttribute("position",new Ke(i,3)),n.setAttribute("color",new Ke(r,3));const s=new Li({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,s),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;const a=new Et(255),l=new Et(65280);this.setColors(a,l)}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");Od.copy(this.root.matrixWorld).invert();for(let r=0,s=0;r<t.length;r++){const a=t[r];a.parent&&a.parent.isBone&&(jh.multiplyMatrices(Od,a.matrixWorld),qa.setFromMatrixPosition(jh),i.setXYZ(s,qa.x,qa.y,qa.z),jh.multiplyMatrices(Od,a.parent.matrixWorld),qa.setFromMatrixPosition(jh),i.setXYZ(s+1,qa.x,qa.y,qa.z),s+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){const i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,e.r,e.g,e.b),i.setXYZ(r+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function Sf(u){const e=[];u.isBone===!0&&e.push(u);for(let t=0;t<u.children.length;t++)e.push(...Sf(u.children[t]));return e}class Lp extends nr{constructor(e,t,n){const i=new q(t,4,2),r=new Xs({wireframe:!0,fog:!1,toneMapped:!1});super(i,r),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const Dp=new U,bf=new Et,Tf=new Et;class Up extends en{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new zo(t);i.rotateY(Math.PI*.5),this.material=new Xs({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const r=i.getAttribute("position"),s=new Float32Array(r.count*3);i.setAttribute("color",new gn(s,3)),this.add(new nr(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");bf.copy(this.light.color),Tf.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const r=n<i/2?bf:Tf;t.setXYZ(n,r.r,r.g,r.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(Dp.setFromMatrixPosition(this.light.matrixWorld).negate())}}class Fp extends f{constructor(e=10,t=10,n=4473924,i=8947848){n=new Et(n),i=new Et(i);const r=t/2,s=e/t,a=e/2,l=[],c=[];for(let m=0,g=0,_=-a;m<=t;m++,_+=s){l.push(-a,0,_,a,0,_),l.push(_,0,-a,_,0,a);const v=m===r?n:i;v.toArray(c,g),g+=3,v.toArray(c,g),g+=3,v.toArray(c,g),g+=3,v.toArray(c,g),g+=3}const d=new kt;d.setAttribute("position",new Ke(l,3)),d.setAttribute("color",new Ke(c,3));const p=new Li({vertexColors:!0,toneMapped:!1});super(d,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Np extends f{constructor(e=10,t=16,n=8,i=64,r=4473924,s=8947848){r=new Et(r),s=new Et(s);const a=[],l=[];if(t>1)for(let p=0;p<t;p++){const m=p/t*(Math.PI*2),g=Math.sin(m)*e,_=Math.cos(m)*e;a.push(0,0,0),a.push(g,0,_);const v=p&1?r:s;l.push(v.r,v.g,v.b),l.push(v.r,v.g,v.b)}for(let p=0;p<n;p++){const m=p&1?r:s,g=e-e/n*p;for(let _=0;_<i;_++){let v=_/i*(Math.PI*2),E=Math.sin(v)*g,w=Math.cos(v)*g;a.push(E,0,w),l.push(m.r,m.g,m.b),v=(_+1)/i*(Math.PI*2),E=Math.sin(v)*g,w=Math.cos(v)*g,a.push(E,0,w),l.push(m.r,m.g,m.b)}}const c=new kt;c.setAttribute("position",new Ke(a,3)),c.setAttribute("color",new Ke(l,3));const d=new Li({vertexColors:!0,toneMapped:!1});super(c,d),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Af=new U,eu=new U,Ef=new U;class Bp extends en{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new kt;i.setAttribute("position",new Ke([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const r=new Li({fog:!1,toneMapped:!1});this.lightPlane=new As(i,r),this.add(this.lightPlane),i=new kt,i.setAttribute("position",new Ke([0,0,0,0,0,1],3)),this.targetLine=new As(i,r),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Af.setFromMatrixPosition(this.light.matrixWorld),eu.setFromMatrixPosition(this.light.target.matrixWorld),Ef.subVectors(eu,Af),this.lightPlane.lookAt(eu),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(eu),this.targetLine.scale.z=Ef.length()}}const tu=new U,Qn=new gl;class Op extends f{constructor(e){const t=new kt,n=new Li({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],r=[],s={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(_,v){l(_),l(v)}function l(_){i.push(0,0,0),r.push(0,0,0),s[_]===void 0&&(s[_]=[]),s[_].push(i.length/3-1)}t.setAttribute("position",new Ke(i,3)),t.setAttribute("color",new Ke(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=s,this.update();const c=new Et(16755200),d=new Et(16711680),p=new Et(43775),m=new Et(16777215),g=new Et(3355443);this.setColors(c,d,p,m,g)}setColors(e,t,n,i,r){const a=this.geometry.getAttribute("color");return a.setXYZ(0,e.r,e.g,e.b),a.setXYZ(1,e.r,e.g,e.b),a.setXYZ(2,e.r,e.g,e.b),a.setXYZ(3,e.r,e.g,e.b),a.setXYZ(4,e.r,e.g,e.b),a.setXYZ(5,e.r,e.g,e.b),a.setXYZ(6,e.r,e.g,e.b),a.setXYZ(7,e.r,e.g,e.b),a.setXYZ(8,e.r,e.g,e.b),a.setXYZ(9,e.r,e.g,e.b),a.setXYZ(10,e.r,e.g,e.b),a.setXYZ(11,e.r,e.g,e.b),a.setXYZ(12,e.r,e.g,e.b),a.setXYZ(13,e.r,e.g,e.b),a.setXYZ(14,e.r,e.g,e.b),a.setXYZ(15,e.r,e.g,e.b),a.setXYZ(16,e.r,e.g,e.b),a.setXYZ(17,e.r,e.g,e.b),a.setXYZ(18,e.r,e.g,e.b),a.setXYZ(19,e.r,e.g,e.b),a.setXYZ(20,e.r,e.g,e.b),a.setXYZ(21,e.r,e.g,e.b),a.setXYZ(22,e.r,e.g,e.b),a.setXYZ(23,e.r,e.g,e.b),a.setXYZ(24,t.r,t.g,t.b),a.setXYZ(25,t.r,t.g,t.b),a.setXYZ(26,t.r,t.g,t.b),a.setXYZ(27,t.r,t.g,t.b),a.setXYZ(28,t.r,t.g,t.b),a.setXYZ(29,t.r,t.g,t.b),a.setXYZ(30,t.r,t.g,t.b),a.setXYZ(31,t.r,t.g,t.b),a.setXYZ(32,n.r,n.g,n.b),a.setXYZ(33,n.r,n.g,n.b),a.setXYZ(34,n.r,n.g,n.b),a.setXYZ(35,n.r,n.g,n.b),a.setXYZ(36,n.r,n.g,n.b),a.setXYZ(37,n.r,n.g,n.b),a.setXYZ(38,i.r,i.g,i.b),a.setXYZ(39,i.r,i.g,i.b),a.setXYZ(40,r.r,r.g,r.b),a.setXYZ(41,r.r,r.g,r.b),a.setXYZ(42,r.r,r.g,r.b),a.setXYZ(43,r.r,r.g,r.b),a.setXYZ(44,r.r,r.g,r.b),a.setXYZ(45,r.r,r.g,r.b),a.setXYZ(46,r.r,r.g,r.b),a.setXYZ(47,r.r,r.g,r.b),a.setXYZ(48,r.r,r.g,r.b),a.setXYZ(49,r.r,r.g,r.b),a.needsUpdate=!0,this}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;let r,s;if(Qn.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,s=0;else if(this.camera.coordinateSystem===yr)r=-1,s=1;else if(this.camera.coordinateSystem===Ma)r=0,s=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);ri("c",t,e,Qn,0,0,r),ri("t",t,e,Qn,0,0,s),ri("n1",t,e,Qn,-n,-i,r),ri("n2",t,e,Qn,n,-i,r),ri("n3",t,e,Qn,-n,i,r),ri("n4",t,e,Qn,n,i,r),ri("f1",t,e,Qn,-n,-i,s),ri("f2",t,e,Qn,n,-i,s),ri("f3",t,e,Qn,-n,i,s),ri("f4",t,e,Qn,n,i,s),ri("u1",t,e,Qn,n*.7,i*1.1,r),ri("u2",t,e,Qn,-n*.7,i*1.1,r),ri("u3",t,e,Qn,0,i*2,r),ri("cf1",t,e,Qn,-n,0,s),ri("cf2",t,e,Qn,n,0,s),ri("cf3",t,e,Qn,0,-i,s),ri("cf4",t,e,Qn,0,i,s),ri("cn1",t,e,Qn,-n,0,r),ri("cn2",t,e,Qn,n,0,r),ri("cn3",t,e,Qn,0,-i,r),ri("cn4",t,e,Qn,0,i,r),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function ri(u,e,t,n,i,r,s){tu.set(i,r,s).unproject(n);const a=e[u];if(a!==void 0){const l=t.getAttribute("position");for(let c=0,d=a.length;c<d;c++)l.setXYZ(a[c],tu.x,tu.y,tu.z)}}const nu=new yi;class zp extends f{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),r=new kt;r.setIndex(new gn(n,1)),r.setAttribute("position",new gn(i,3)),super(r,new Li({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&nu.setFromObject(this.object),nu.isEmpty())return;const e=nu.min,t=nu.max,n=this.geometry.attributes.position,i=n.array;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=e.x,i[4]=t.y,i[5]=t.z,i[6]=e.x,i[7]=e.y,i[8]=t.z,i[9]=t.x,i[10]=e.y,i[11]=t.z,i[12]=t.x,i[13]=t.y,i[14]=e.z,i[15]=e.x,i[16]=t.y,i[17]=e.z,i[18]=e.x,i[19]=e.y,i[20]=e.z,i[21]=t.x,i[22]=e.y,i[23]=e.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Gp extends f{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new kt;r.setIndex(new gn(n,1)),r.setAttribute("position",new Ke(i,3)),super(r,new Li({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class kp extends As{constructor(e,t=1,n=16776960){const i=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],s=new kt;s.setAttribute("position",new Ke(r,3)),s.computeBoundingSphere(),super(s,new Li({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new kt;l.setAttribute("position",new Ke(a,3)),l.computeBoundingSphere(),this.add(new nr(l,new Xs({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const wf=new U;let iu,zd;class Vp extends en{constructor(e=new U(0,0,1),t=new U(0,0,0),n=1,i=16776960,r=n*.2,s=r*.2){super(),this.type="ArrowHelper",iu===void 0&&(iu=new kt,iu.setAttribute("position",new Ke([0,0,0,0,1,0],3)),zd=new ee(.5,1,5,1),zd.translate(0,-.5,0)),this.position.copy(t),this.line=new As(iu,new Li({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new nr(zd,new Xs({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,s)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{wf.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(wf,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class Hp extends f{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new kt;i.setAttribute("position",new Ke(t,3)),i.setAttribute("color",new Ke(n,3));const r=new Li({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(e,t,n){const i=new Et,r=this.geometry.attributes.color.array;return i.set(e),i.toArray(r,0),i.toArray(r,3),i.set(t),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Wp{constructor(){this.type="ShapePath",this.color=new Et,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new Cn,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,s){return this.currentPath.bezierCurveTo(e,t,n,i,r,s),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(w){const F=[];for(let D=0,B=w.length;D<B;D++){const Q=w[D],le=new I;le.curves=Q.curves,F.push(le)}return F}function n(w,F){const D=F.length;let B=!1;for(let Q=D-1,le=0;le<D;Q=le++){let xe=F[Q],ue=F[le],Re=ue.x-xe.x,Ne=ue.y-xe.y;if(Math.abs(Ne)>Number.EPSILON){if(Ne<0&&(xe=F[le],Re=-Re,ue=F[Q],Ne=-Ne),w.y<xe.y||w.y>ue.y)continue;if(w.y===xe.y){if(w.x===xe.x)return!0}else{const ht=Ne*(w.x-xe.x)-Re*(w.y-xe.y);if(ht===0)return!0;if(ht<0)continue;B=!B}}else{if(w.y!==xe.y)continue;if(ue.x<=w.x&&w.x<=xe.x||xe.x<=w.x&&w.x<=ue.x)return!0}}return B}const i=Xi.isClockWise,r=this.subPaths;if(r.length===0)return[];let s,a,l;const c=[];if(r.length===1)return a=r[0],l=new I,l.curves=a.curves,c.push(l),c;let d=!i(r[0].getPoints());d=e?!d:d;const p=[],m=[];let g=[],_=0,v;m[_]=void 0,g[_]=[];for(let w=0,F=r.length;w<F;w++)a=r[w],v=a.getPoints(),s=i(v),s=e?!s:s,s?(!d&&m[_]&&_++,m[_]={s:new I,p:v},m[_].s.curves=a.curves,d&&_++,g[_]=[]):g[_].push({h:a,p:v[0]});if(!m[0])return t(r);if(m.length>1){let w=!1,F=0;for(let D=0,B=m.length;D<B;D++)p[D]=[];for(let D=0,B=m.length;D<B;D++){const Q=g[D];for(let le=0;le<Q.length;le++){const xe=Q[le];let ue=!0;for(let Re=0;Re<m.length;Re++)n(xe.p,m[Re].p)&&(D!==Re&&F++,ue?(ue=!1,p[Re].push(xe)):w=!0);ue&&p[D].push(xe)}}F>0&&w===!1&&(g=p)}let E;for(let w=0,F=m.length;w<F;w++){l=m[w].s,c.push(l),E=g[w];for(let D=0,B=E.length;D<B;D++)l.holes.push(E[D].h)}return c}}class Xp extends Qr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function qp(u,e){const t=u.image&&u.image.width?u.image.width/u.image.height:1;return t>e?(u.repeat.x=1,u.repeat.y=t/e,u.offset.x=0,u.offset.y=(1-u.repeat.y)/2):(u.repeat.x=e/t,u.repeat.y=1,u.offset.x=(1-u.repeat.x)/2,u.offset.y=0),u}function Yp(u,e){const t=u.image&&u.image.width?u.image.width/u.image.height:1;return t>e?(u.repeat.x=e/t,u.repeat.y=1,u.offset.x=(1-u.repeat.x)/2,u.offset.y=0):(u.repeat.x=1,u.repeat.y=t/e,u.offset.x=0,u.offset.y=(1-u.repeat.y)/2),u}function Zp(u){return u.repeat.x=1,u.repeat.y=1,u.offset.x=0,u.offset.y=0,u}function Cf(u,e,t,n){const i=$p(n);switch(t){case Wr:return u*e;case cs:return u*e/i.components*i.byteLength;case Xn:return u*e/i.components*i.byteLength;case qr:return u*e*2/i.components*i.byteLength;case Ds:return u*e*2/i.components*i.byteLength;case da:return u*e*3/i.components*i.byteLength;case Oi:return u*e*4/i.components*i.byteLength;case fa:return u*e*4/i.components*i.byteLength;case Qa:case ja:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*8;case pa:case Us:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*16;case eo:case ga:return Math.max(u,16)*Math.max(e,8)/4;case ma:case mr:return Math.max(u,8)*Math.max(e,8)/2;case Yr:case Zr:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*8;case gr:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*16;case hs:return Math.floor((u+3)/4)*Math.floor((e+3)/4)*16;case us:return Math.floor((u+4)/5)*Math.floor((e+3)/4)*16;case Fs:return Math.floor((u+4)/5)*Math.floor((e+4)/5)*16;case to:return Math.floor((u+5)/6)*Math.floor((e+4)/5)*16;case _a:return Math.floor((u+5)/6)*Math.floor((e+5)/6)*16;case no:return Math.floor((u+7)/8)*Math.floor((e+4)/5)*16;case ds:return Math.floor((u+7)/8)*Math.floor((e+5)/6)*16;case Ns:return Math.floor((u+7)/8)*Math.floor((e+7)/8)*16;case io:return Math.floor((u+9)/10)*Math.floor((e+4)/5)*16;case ro:return Math.floor((u+9)/10)*Math.floor((e+5)/6)*16;case wi:return Math.floor((u+9)/10)*Math.floor((e+7)/8)*16;case oi:return Math.floor((u+9)/10)*Math.floor((e+9)/10)*16;case fs:return Math.floor((u+11)/12)*Math.floor((e+9)/10)*16;case $r:return Math.floor((u+11)/12)*Math.floor((e+11)/12)*16;case _r:case Pr:case Jr:return Math.ceil(u/4)*Math.ceil(e/4)*16;case Bs:case Os:return Math.ceil(u/4)*Math.ceil(e/4)*8;case zs:case ps:return Math.ceil(u/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $p(u){switch(u){case gi:case Ir:return{byteLength:1,components:1};case Ls:case _i:case Ja:return{byteLength:2,components:1};case fr:case ha:return{byteLength:2,components:4};case or:case dr:case lr:return{byteLength:4,components:1};case Ka:case ua:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${u}.`)}class Jp{static contain(e,t){return qp(e,t)}static cover(e,t){return Yp(e,t)}static fill(e){return Zp(e)}static getByteLength(e,t,n,i){return Cf(e,t,n,i)}}return typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180"),Object.assign(Pn,{ACESFilmicToneMapping:Cs,AddEquation:pn,AddOperation:Ya,AdditiveAnimationBlendMode:xt,AdditiveBlending:Yt,AgXToneMapping:Qo,AlphaFormat:Wr,AlwaysCompare:th,AlwaysDepth:Ni,AlwaysStencilFunc:ho,AmbientLight:tf,AnimationAction:gf,AnimationClip:Zc,AnimationLoader:zf,AnimationMixer:mp,AnimationObjectGroup:fp,AnimationUtils:Ff,ArcCurve:be,ArrayCamera:Qf,ArrowHelper:Vp,AttachedBindMode:la,Audio:ff,AudioAnalyser:ip,AudioContext:Id,AudioListener:ep,AudioLoader:Jf,AxesHelper:Hp,BackSide:qe,BasicDepthPacking:zi,BasicShadowMap:Qt,BatchedMesh:Wh,Bone:Nc,BooleanKeyframeTrack:Go,Box2:Ep,Box3:yi,Box3Helper:Gp,BoxGeometry:Un,BoxHelper:zp,BufferAttribute:gn,BufferGeometry:kt,BufferGeometryLoader:of,ByteType:Ir,Cache:ws,Camera:gl,CameraHelper:Op,CanvasTexture:C,CapsuleGeometry:J,CatmullRomCurve3:nn,CineonToneMapping:Ko,CircleGeometry:k,ClampToEdgeWrapping:Ai,Clock:df,Color:Et,ColorKeyframeTrack:Sd,ColorManagement:ki,CompressedArrayTexture:ge,CompressedCubeTexture:se,CompressedTexture:$,CompressedTextureLoader:Gf,ConeGeometry:ee,ConstantAlphaFactor:Fi,ConstantColorFactor:fi,Controls:Xp,CubeCamera:Eh,CubeReflectionMapping:Hr,CubeRefractionMapping:$a,CubeTexture:_l,CubeTextureLoader:kf,CubeUVReflectionMapping:Ki,CubicBezierCurve:O,CubicBezierCurve3:bn,CubicInterpolant:Wd,CullFaceBack:Ct,CullFaceFront:di,CullFaceFrontBack:vn,CullFaceNone:Be,Curve:Ce,CurvePath:ii,CustomBlending:an,CustomToneMapping:Rs,CylinderGeometry:ce,Cylindrical:Ap,Data3DTexture:yc,DataArrayTexture:hh,DataTexture:rr,DataTextureLoader:Vf,DataUtils:yh,DecrementStencilOp:Ql,DecrementWrapStencilOp:ec,DefaultLoadingManager:Yd,DepthFormat:pr,DepthStencilFormat:Xr,DepthTexture:y,DetachedBindMode:Vr,DirectionalLight:ef,DirectionalLightHelper:Bp,DiscreteInterpolant:Xd,DodecahedronGeometry:ye,DoubleSide:we,DstAlphaFactor:Vn,DstColorFactor:Zi,DynamicCopyUsage:hu,DynamicDrawUsage:uc,DynamicReadUsage:ou,EdgesGeometry:Ae,EllipseCurve:Se,EqualCompare:Qc,EqualDepth:Er,EqualStencilFunc:rc,EquirectangularReflectionMapping:ca,EquirectangularRefractionMapping:Ji,Euler:Dr,EventDispatcher:Qr,ExternalTexture:ie,ExtrudeGeometry:Vl,FileLoader:ia,Float16BufferAttribute:fl,Float32BufferAttribute:Ke,FloatType:lr,Fog:yl,FogExp2:xl,FramebufferTexture:X,FrontSide:ze,Frustum:Ll,FrustumArray:Dl,GLBufferAttribute:vp,GLSL1:du,GLSL3:fu,GreaterCompare:il,GreaterDepth:Gr,GreaterEqualCompare:eh,GreaterEqualDepth:$o,GreaterEqualStencilFunc:lc,GreaterStencilFunc:ac,GridHelper:Fp,Group:Ba,HalfFloatType:Ja,HemisphereLight:Zd,HemisphereLightHelper:Up,IcosahedronGeometry:Hl,ImageBitmapLoader:$f,ImageLoader:$c,ImageUtils:ch,IncrementStencilOp:Kl,IncrementWrapStencilOp:jl,InstancedBufferAttribute:Va,InstancedBufferGeometry:af,InstancedInterleavedBuffer:yp,InstancedMesh:Oh,Int16BufferAttribute:ed,Int32BufferAttribute:td,Int8BufferAttribute:Ys,IntType:dr,InterleavedBuffer:vl,InterleavedBufferAttribute:$s,Interpolant:Wc,InterpolateDiscrete:Dn,InterpolateLinear:S,InterpolateSmooth:z,InterpolationSamplingMode:gu,InterpolationSamplingType:mu,InvertStencilOp:tc,KeepStencilOp:Kr,KeyframeTrack:Or,LOD:Uc,LatheGeometry:Wl,Layers:uh,LessCompare:hc,LessDepth:Ar,LessEqualCompare:jc,LessEqualDepth:Hn,LessEqualStencilFunc:sc,LessStencilFunc:ic,Light:Xa,LightProbe:sf,Line:As,Line3:Rp,LineBasicMaterial:Li,LineCurve:It,LineCurve3:St,LineDashedMaterial:Wa,LineLoop:h,LineSegments:f,LinearFilter:Wn,LinearInterpolant:Md,LinearMipMapLinearFilter:Ei,LinearMipMapNearestFilter:Rr,LinearMipmapLinearFilter:mn,LinearMipmapNearestFilter:Ps,LinearSRGBColorSpace:lo,LinearToneMapping:Za,LinearTransfer:co,Loader:ur,LoaderUtils:Cd,LoadingManager:bd,LoopOnce:xa,LoopPingPong:ao,LoopRepeat:so,MOUSE:$t,Material:Mi,MaterialLoader:Jh,MathUtils:Du,Matrix2:Nd,Matrix3:vr,Matrix4:Dt,MaxEquation:An,Mesh:nr,MeshBasicMaterial:Xs,MeshDepthMaterial:qi,MeshDistanceMaterial:ea,MeshLambertMaterial:Kt,MeshMatcapMaterial:Yi,MeshNormalMaterial:In,MeshPhongMaterial:un,MeshPhysicalMaterial:xn,MeshStandardMaterial:Rn,MeshToonMaterial:mt,MinEquation:jt,MirroredRepeatWrapping:wr,MixOperation:Jo,MultiplyBlending:hn,MultiplyOperation:kr,NearestFilter:mi,NearestMipMapLinearFilter:Bi,NearestMipMapNearestFilter:el,NearestMipmapLinearFilter:Cr,NearestMipmapNearestFilter:Is,NeutralToneMapping:jo,NeverCompare:cc,NeverDepth:Fn,NeverStencilFunc:nc,NoBlending:$e,NoColorSpace:oo,NoToneMapping:oa,NormalAnimationBlendMode:me,NormalBlending:lt,NotEqualCompare:su,NotEqualDepth:pi,NotEqualStencilFunc:oc,NumberKeyframeTrack:Xc,Object3D:en,ObjectLoader:Yf,ObjectSpaceNormalMap:Gs,OctahedronGeometry:zo,OneFactor:ti,OneMinusConstantAlphaFactor:os,OneMinusConstantColorFactor:dn,OneMinusDstAlphaFactor:Rt,OneMinusDstColorFactor:Ti,OneMinusSrcAlphaFactor:$n,OneMinusSrcColorFactor:En,OrthographicCamera:wd,PCFShadowMap:Ln,PCFSoftShadowMap:Mn,Path:Cn,PerspectiveCamera:ir,Plane:Js,PlaneGeometry:T,PlaneHelper:kp,PointLight:jd,PointLightHelper:Lp,Points:j,PointsMaterial:x,PolarGridHelper:Np,PolyhedronGeometry:te,PositionalAudio:np,PropertyBinding:rn,PropertyMixer:mf,QuadraticBezierCurve:nt,QuadraticBezierCurve3:_n,Quaternion:Gi,QuaternionKeyframeTrack:qc,QuaternionLinearInterpolant:qd,RAD2DEG:Sa,RED_GREEN_RGTC2_Format:zs,RED_RGTC1_Format:Bs,REVISION:"180",RGBADepthPacking:Lr,RGBAFormat:Oi,RGBAIntegerFormat:fa,RGBA_ASTC_10x10_Format:oi,RGBA_ASTC_10x5_Format:io,RGBA_ASTC_10x6_Format:ro,RGBA_ASTC_10x8_Format:wi,RGBA_ASTC_12x10_Format:fs,RGBA_ASTC_12x12_Format:$r,RGBA_ASTC_4x4_Format:hs,RGBA_ASTC_5x4_Format:us,RGBA_ASTC_5x5_Format:Fs,RGBA_ASTC_6x5_Format:to,RGBA_ASTC_6x6_Format:_a,RGBA_ASTC_8x5_Format:no,RGBA_ASTC_8x6_Format:ds,RGBA_ASTC_8x8_Format:Ns,RGBA_BPTC_Format:_r,RGBA_ETC2_EAC_Format:gr,RGBA_PVRTC_2BPPV1_Format:ga,RGBA_PVRTC_4BPPV1_Format:mr,RGBA_S3TC_DXT1_Format:ja,RGBA_S3TC_DXT3_Format:pa,RGBA_S3TC_DXT5_Format:Us,RGBDepthPacking:ms,RGBFormat:da,RGBIntegerFormat:nl,RGB_BPTC_SIGNED_Format:Pr,RGB_BPTC_UNSIGNED_Format:Jr,RGB_ETC1_Format:Yr,RGB_ETC2_Format:Zr,RGB_PVRTC_2BPPV1_Format:eo,RGB_PVRTC_4BPPV1_Format:ma,RGB_S3TC_DXT1_Format:Qa,RGDepthPacking:cr,RGFormat:qr,RGIntegerFormat:Ds,RawShaderMaterial:ln,Ray:Ra,Raycaster:Mp,RectAreaLight:nf,RedFormat:cs,RedIntegerFormat:Xn,ReinhardToneMapping:$i,RenderTarget:xc,RenderTarget3D:gp,RepeatWrapping:Qi,ReplaceStencilOp:Jl,ReverseSubtractEquation:Nt,RingGeometry:W,SIGNED_RED_GREEN_RGTC2_Format:ps,SIGNED_RED_RGTC1_Format:Os,SRGBColorSpace:Ci,SRGBTransfer:ya,Scene:wh,ShaderMaterial:ml,ShadowMaterial:Ht,Shape:I,ShapeGeometry:re,ShapePath:Wp,ShapeUtils:Xi,ShortType:_i,Skeleton:Rl,SkeletonHelper:Pp,SkinnedMesh:Fh,Source:gs,Sphere:li,SphereGeometry:q,Spherical:Tp,SphericalHarmonics3:rf,SplineCurve:it,SpotLight:Kd,SpotLightHelper:Ip,Sprite:Ph,SpriteMaterial:Lc,SrcAlphaFactor:Mt,SrcAlphaSaturateFactor:Ui,SrcColorFactor:Sn,StaticCopyUsage:cu,StaticDrawUsage:va,StaticReadUsage:nh,StereoCamera:Kf,StreamCopyUsage:uu,StreamDrawUsage:au,StreamReadUsage:lu,StringKeyframeTrack:ko,SubtractEquation:dt,SubtractiveBlending:Lt,TOUCH:At,TangentSpaceNormalMap:xr,TetrahedronGeometry:Pe,Texture:Yn,TextureLoader:Hf,TextureUtils:Jp,Timer:Sp,TimestampQuery:pu,TorusGeometry:Ve,TorusKnotGeometry:Qe,Triangle:wn,TriangleFanDrawMode:qn,TriangleStripDrawMode:Xt,TrianglesDrawMode:tn,TubeGeometry:Ye,UVMapping:ls,Uint16BufferAttribute:dl,Uint32BufferAttribute:Rc,Uint8BufferAttribute:La,Uint8ClampedBufferAttribute:vh,Uniform:Ud,UniformsGroup:xp,UniformsUtils:rd,UnsignedByteType:gi,UnsignedInt101111Type:ua,UnsignedInt248Type:tl,UnsignedInt5999Type:Ka,UnsignedIntType:or,UnsignedShort4444Type:fr,UnsignedShort5551Type:ha,UnsignedShortType:Ls,VSMShadowMap:as,Vector2:Ie,Vector3:U,Vector4:ni,VectorKeyframeTrack:Yc,VideoFrameTexture:H,VideoTexture:ne,WebGL3DRenderTarget:ku,WebGLArrayRenderTarget:Gu,WebGLCoordinateSystem:yr,WebGLCubeRenderTarget:od,WebGLRenderTarget:rl,WebGPUCoordinateSystem:Ma,WebXRController:cd,WireframeGeometry:yt,WrapAroundEnding:Me,ZeroCurvatureEnding:V,ZeroFactor:kn,ZeroSlopeEnding:oe,ZeroStencilOp:$l,arrayNeedsUint32:sh,cloneUniforms:bs,createCanvasElement:Fu,createElementNS:fo,getByteLength:Cf,getUnlitUniformColorSpace:id,mergeUniforms:bh,probeAsync:Nu,warnOnce:mc}),Pn})(),THREE=(()=>{const Pn={};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const{Matrix3:Gt,Vector2:$t,Color:At,mergeUniforms:Be,Vector3:Ct,CubeUVReflectionMapping:di,Mesh:vn,BoxGeometry:Qt,ShaderMaterial:Ln,BackSide:Mn,cloneUniforms:as,Euler:ze,Matrix4:qe,ColorManagement:we,SRGBTransfer:$e,PlaneGeometry:lt,FrontSide:Yt,getUnlitUniformColorSpace:Lt,IntType:hn,HalfFloatType:an,UnsignedByteType:pn,FloatType:dt,RGBAFormat:Nt,Plane:jt,EquirectangularReflectionMapping:An,EquirectangularRefractionMapping:kn,WebGLCubeRenderTarget:ti,CubeReflectionMapping:Sn,CubeRefractionMapping:En,OrthographicCamera:Mt,PerspectiveCamera:$n,NoToneMapping:Vn,MeshBasicMaterial:Rt,NoBlending:Zi,WebGLRenderTarget:Ti,BufferGeometry:Ui,BufferAttribute:fi,LinearSRGBColorSpace:dn,LinearFilter:Fi,warnOnce:os,Uint32BufferAttribute:Fn,Uint16BufferAttribute:Ni,arrayNeedsUint32:Ar,Vector4:Hn,DataArrayTexture:Er,CubeTexture:$o,Data3DTexture:Gr,LessEqualCompare:pi,DepthTexture:kr,Texture:Jo,GLSL3:Ya,PCFShadowMap:oa,PCFSoftShadowMap:Za,VSMShadowMap:$i,CustomToneMapping:Ko,NeutralToneMapping:Cs,AgXToneMapping:Rs,ACESFilmicToneMapping:Qo,CineonToneMapping:jo,ReinhardToneMapping:la,LinearToneMapping:Vr,LinearTransfer:ls,AddOperation:Hr,MixOperation:$a,MultiplyOperation:ca,UniformsUtils:Ji,DoubleSide:Ki,NormalBlending:Qi,TangentSpaceNormalMap:Ai,ObjectSpaceNormalMap:wr,Layers:mi,Frustum:Is,MeshDepthMaterial:el,RGBADepthPacking:Cr,MeshDistanceMaterial:Bi,NearestFilter:Wn,LessEqualDepth:Ps,ReverseSubtractEquation:Rr,SubtractEquation:mn,AddEquation:Ei,OneMinusConstantAlphaFactor:gi,ConstantAlphaFactor:Ir,OneMinusConstantColorFactor:_i,ConstantColorFactor:Ls,OneMinusDstAlphaFactor:dr,OneMinusDstColorFactor:or,OneMinusSrcAlphaFactor:lr,OneMinusSrcColorFactor:Ja,DstAlphaFactor:fr,DstColorFactor:ha,SrcAlphaSaturateFactor:tl,SrcAlphaFactor:Ka,SrcColorFactor:ua,OneFactor:Wr,ZeroFactor:da,NotEqualDepth:Oi,GreaterDepth:pr,GreaterEqualDepth:Xr,EqualDepth:cs,LessDepth:Xn,AlwaysDepth:qr,NeverDepth:Ds,CullFaceNone:nl,CullFaceBack:fa,CullFaceFront:Qa,CustomBlending:ja,MultiplyBlending:pa,SubtractiveBlending:Us,AdditiveBlending:ma,MinEquation:eo,MaxEquation:mr,MirroredRepeatWrapping:ga,ClampToEdgeWrapping:Yr,RepeatWrapping:Zr,LinearMipmapLinearFilter:gr,LinearMipmapNearestFilter:hs,NearestMipmapLinearFilter:us,NearestMipmapNearestFilter:Fs,NotEqualCompare:to,GreaterCompare:_a,GreaterEqualCompare:no,EqualCompare:ds,LessCompare:Ns,AlwaysCompare:io,NeverCompare:ro,NoColorSpace:wi,DepthStencilFormat:oi,getByteLength:fs,DepthFormat:$r,UnsignedIntType:_r,UnsignedInt248Type:Pr,UnsignedShortType:Jr,createElementNS:Bs,UnsignedShort4444Type:Os,UnsignedShort5551Type:zs,UnsignedInt5999Type:ps,UnsignedInt101111Type:xa,ByteType:so,ShortType:ao,AlphaFormat:Dn,RGBFormat:S,RedFormat:z,RedIntegerFormat:V,RGFormat:oe,RGIntegerFormat:Me,RGBAIntegerFormat:me,RGB_S3TC_DXT1_Format:xt,RGBA_S3TC_DXT1_Format:tn,RGBA_S3TC_DXT3_Format:Xt,RGBA_S3TC_DXT5_Format:qn,RGB_PVRTC_4BPPV1_Format:zi,RGB_PVRTC_2BPPV1_Format:Lr,RGBA_PVRTC_4BPPV1_Format:ms,RGBA_PVRTC_2BPPV1_Format:cr,RGB_ETC1_Format:xr,RGB_ETC2_Format:Gs,RGBA_ETC2_EAC_Format:oo,RGBA_ASTC_4x4_Format:Ci,RGBA_ASTC_5x4_Format:lo,RGBA_ASTC_5x5_Format:co,RGBA_ASTC_6x5_Format:ya,RGBA_ASTC_6x6_Format:$l,RGBA_ASTC_8x5_Format:Kr,RGBA_ASTC_8x6_Format:Jl,RGBA_ASTC_8x8_Format:Kl,RGBA_ASTC_10x5_Format:Ql,RGBA_ASTC_10x6_Format:jl,RGBA_ASTC_10x8_Format:ec,RGBA_ASTC_10x10_Format:tc,RGBA_ASTC_12x10_Format:nc,RGBA_ASTC_12x12_Format:ic,RGBA_BPTC_Format:rc,RGB_BPTC_SIGNED_Format:sc,RGB_BPTC_UNSIGNED_Format:ac,RED_RGTC1_Format:oc,SIGNED_RED_RGTC1_Format:lc,RED_GREEN_RGTC2_Format:ho,SIGNED_RED_GREEN_RGTC2_Format:cc,ExternalTexture:hc,EventDispatcher:Qc,ArrayCamera:jc,WebXRController:il,RAD2DEG:su,createCanvasElement:eh,SRGBColorSpace:th,REVISION:va,WebGLCoordinateSystem:uc,probeAsync:au}=gmzThreeCore;Object.assign(Pn,{AdditiveAnimationBlendMode:gmzThreeCore.AdditiveAnimationBlendMode,AlwaysStencilFunc:gmzThreeCore.AlwaysStencilFunc,AmbientLight:gmzThreeCore.AmbientLight,AnimationAction:gmzThreeCore.AnimationAction,AnimationClip:gmzThreeCore.AnimationClip,AnimationLoader:gmzThreeCore.AnimationLoader,AnimationMixer:gmzThreeCore.AnimationMixer,AnimationObjectGroup:gmzThreeCore.AnimationObjectGroup,AnimationUtils:gmzThreeCore.AnimationUtils,ArcCurve:gmzThreeCore.ArcCurve,ArrowHelper:gmzThreeCore.ArrowHelper,AttachedBindMode:gmzThreeCore.AttachedBindMode,Audio:gmzThreeCore.Audio,AudioAnalyser:gmzThreeCore.AudioAnalyser,AudioContext:gmzThreeCore.AudioContext,AudioListener:gmzThreeCore.AudioListener,AudioLoader:gmzThreeCore.AudioLoader,AxesHelper:gmzThreeCore.AxesHelper,BasicDepthPacking:gmzThreeCore.BasicDepthPacking,BasicShadowMap:gmzThreeCore.BasicShadowMap,BatchedMesh:gmzThreeCore.BatchedMesh,Bone:gmzThreeCore.Bone,BooleanKeyframeTrack:gmzThreeCore.BooleanKeyframeTrack,Box2:gmzThreeCore.Box2,Box3:gmzThreeCore.Box3,Box3Helper:gmzThreeCore.Box3Helper,BoxHelper:gmzThreeCore.BoxHelper,BufferGeometryLoader:gmzThreeCore.BufferGeometryLoader,Cache:gmzThreeCore.Cache,Camera:gmzThreeCore.Camera,CameraHelper:gmzThreeCore.CameraHelper,CanvasTexture:gmzThreeCore.CanvasTexture,CapsuleGeometry:gmzThreeCore.CapsuleGeometry,CatmullRomCurve3:gmzThreeCore.CatmullRomCurve3,CircleGeometry:gmzThreeCore.CircleGeometry,Clock:gmzThreeCore.Clock,ColorKeyframeTrack:gmzThreeCore.ColorKeyframeTrack,CompressedArrayTexture:gmzThreeCore.CompressedArrayTexture,CompressedCubeTexture:gmzThreeCore.CompressedCubeTexture,CompressedTexture:gmzThreeCore.CompressedTexture,CompressedTextureLoader:gmzThreeCore.CompressedTextureLoader,ConeGeometry:gmzThreeCore.ConeGeometry,Controls:gmzThreeCore.Controls,CubeCamera:gmzThreeCore.CubeCamera,CubeTextureLoader:gmzThreeCore.CubeTextureLoader,CubicBezierCurve:gmzThreeCore.CubicBezierCurve,CubicBezierCurve3:gmzThreeCore.CubicBezierCurve3,CubicInterpolant:gmzThreeCore.CubicInterpolant,CullFaceFrontBack:gmzThreeCore.CullFaceFrontBack,Curve:gmzThreeCore.Curve,CurvePath:gmzThreeCore.CurvePath,CylinderGeometry:gmzThreeCore.CylinderGeometry,Cylindrical:gmzThreeCore.Cylindrical,DataTexture:gmzThreeCore.DataTexture,DataTextureLoader:gmzThreeCore.DataTextureLoader,DataUtils:gmzThreeCore.DataUtils,DecrementStencilOp:gmzThreeCore.DecrementStencilOp,DecrementWrapStencilOp:gmzThreeCore.DecrementWrapStencilOp,DefaultLoadingManager:gmzThreeCore.DefaultLoadingManager,DetachedBindMode:gmzThreeCore.DetachedBindMode,DirectionalLight:gmzThreeCore.DirectionalLight,DirectionalLightHelper:gmzThreeCore.DirectionalLightHelper,DiscreteInterpolant:gmzThreeCore.DiscreteInterpolant,DodecahedronGeometry:gmzThreeCore.DodecahedronGeometry,DynamicCopyUsage:gmzThreeCore.DynamicCopyUsage,DynamicDrawUsage:gmzThreeCore.DynamicDrawUsage,DynamicReadUsage:gmzThreeCore.DynamicReadUsage,EdgesGeometry:gmzThreeCore.EdgesGeometry,EllipseCurve:gmzThreeCore.EllipseCurve,EqualStencilFunc:gmzThreeCore.EqualStencilFunc,ExtrudeGeometry:gmzThreeCore.ExtrudeGeometry,FileLoader:gmzThreeCore.FileLoader,Float16BufferAttribute:gmzThreeCore.Float16BufferAttribute,Float32BufferAttribute:gmzThreeCore.Float32BufferAttribute,Fog:gmzThreeCore.Fog,FogExp2:gmzThreeCore.FogExp2,FramebufferTexture:gmzThreeCore.FramebufferTexture,FrustumArray:gmzThreeCore.FrustumArray,GLBufferAttribute:gmzThreeCore.GLBufferAttribute,GLSL1:gmzThreeCore.GLSL1,GreaterEqualStencilFunc:gmzThreeCore.GreaterEqualStencilFunc,GreaterStencilFunc:gmzThreeCore.GreaterStencilFunc,GridHelper:gmzThreeCore.GridHelper,Group:gmzThreeCore.Group,HemisphereLight:gmzThreeCore.HemisphereLight,HemisphereLightHelper:gmzThreeCore.HemisphereLightHelper,IcosahedronGeometry:gmzThreeCore.IcosahedronGeometry,ImageBitmapLoader:gmzThreeCore.ImageBitmapLoader,ImageLoader:gmzThreeCore.ImageLoader,ImageUtils:gmzThreeCore.ImageUtils,IncrementStencilOp:gmzThreeCore.IncrementStencilOp,IncrementWrapStencilOp:gmzThreeCore.IncrementWrapStencilOp,InstancedBufferAttribute:gmzThreeCore.InstancedBufferAttribute,InstancedBufferGeometry:gmzThreeCore.InstancedBufferGeometry,InstancedInterleavedBuffer:gmzThreeCore.InstancedInterleavedBuffer,InstancedMesh:gmzThreeCore.InstancedMesh,Int16BufferAttribute:gmzThreeCore.Int16BufferAttribute,Int32BufferAttribute:gmzThreeCore.Int32BufferAttribute,Int8BufferAttribute:gmzThreeCore.Int8BufferAttribute,InterleavedBuffer:gmzThreeCore.InterleavedBuffer,InterleavedBufferAttribute:gmzThreeCore.InterleavedBufferAttribute,Interpolant:gmzThreeCore.Interpolant,InterpolateDiscrete:gmzThreeCore.InterpolateDiscrete,InterpolateLinear:gmzThreeCore.InterpolateLinear,InterpolateSmooth:gmzThreeCore.InterpolateSmooth,InterpolationSamplingMode:gmzThreeCore.InterpolationSamplingMode,InterpolationSamplingType:gmzThreeCore.InterpolationSamplingType,InvertStencilOp:gmzThreeCore.InvertStencilOp,KeepStencilOp:gmzThreeCore.KeepStencilOp,KeyframeTrack:gmzThreeCore.KeyframeTrack,LOD:gmzThreeCore.LOD,LatheGeometry:gmzThreeCore.LatheGeometry,LessEqualStencilFunc:gmzThreeCore.LessEqualStencilFunc,LessStencilFunc:gmzThreeCore.LessStencilFunc,Light:gmzThreeCore.Light,LightProbe:gmzThreeCore.LightProbe,Line:gmzThreeCore.Line,Line3:gmzThreeCore.Line3,LineBasicMaterial:gmzThreeCore.LineBasicMaterial,LineCurve:gmzThreeCore.LineCurve,LineCurve3:gmzThreeCore.LineCurve3,LineDashedMaterial:gmzThreeCore.LineDashedMaterial,LineLoop:gmzThreeCore.LineLoop,LineSegments:gmzThreeCore.LineSegments,LinearInterpolant:gmzThreeCore.LinearInterpolant,LinearMipMapLinearFilter:gmzThreeCore.LinearMipMapLinearFilter,LinearMipMapNearestFilter:gmzThreeCore.LinearMipMapNearestFilter,Loader:gmzThreeCore.Loader,LoaderUtils:gmzThreeCore.LoaderUtils,LoadingManager:gmzThreeCore.LoadingManager,LoopOnce:gmzThreeCore.LoopOnce,LoopPingPong:gmzThreeCore.LoopPingPong,LoopRepeat:gmzThreeCore.LoopRepeat,MOUSE:gmzThreeCore.MOUSE,Material:gmzThreeCore.Material,MaterialLoader:gmzThreeCore.MaterialLoader,MathUtils:gmzThreeCore.MathUtils,Matrix2:gmzThreeCore.Matrix2,MeshLambertMaterial:gmzThreeCore.MeshLambertMaterial,MeshMatcapMaterial:gmzThreeCore.MeshMatcapMaterial,MeshNormalMaterial:gmzThreeCore.MeshNormalMaterial,MeshPhongMaterial:gmzThreeCore.MeshPhongMaterial,MeshPhysicalMaterial:gmzThreeCore.MeshPhysicalMaterial,MeshStandardMaterial:gmzThreeCore.MeshStandardMaterial,MeshToonMaterial:gmzThreeCore.MeshToonMaterial,NearestMipMapLinearFilter:gmzThreeCore.NearestMipMapLinearFilter,NearestMipMapNearestFilter:gmzThreeCore.NearestMipMapNearestFilter,NeverStencilFunc:gmzThreeCore.NeverStencilFunc,NormalAnimationBlendMode:gmzThreeCore.NormalAnimationBlendMode,NotEqualStencilFunc:gmzThreeCore.NotEqualStencilFunc,NumberKeyframeTrack:gmzThreeCore.NumberKeyframeTrack,Object3D:gmzThreeCore.Object3D,ObjectLoader:gmzThreeCore.ObjectLoader,OctahedronGeometry:gmzThreeCore.OctahedronGeometry,Path:gmzThreeCore.Path,PlaneHelper:gmzThreeCore.PlaneHelper,PointLight:gmzThreeCore.PointLight,PointLightHelper:gmzThreeCore.PointLightHelper,Points:gmzThreeCore.Points,PointsMaterial:gmzThreeCore.PointsMaterial,PolarGridHelper:gmzThreeCore.PolarGridHelper,PolyhedronGeometry:gmzThreeCore.PolyhedronGeometry,PositionalAudio:gmzThreeCore.PositionalAudio,PropertyBinding:gmzThreeCore.PropertyBinding,PropertyMixer:gmzThreeCore.PropertyMixer,QuadraticBezierCurve:gmzThreeCore.QuadraticBezierCurve,QuadraticBezierCurve3:gmzThreeCore.QuadraticBezierCurve3,Quaternion:gmzThreeCore.Quaternion,QuaternionKeyframeTrack:gmzThreeCore.QuaternionKeyframeTrack,QuaternionLinearInterpolant:gmzThreeCore.QuaternionLinearInterpolant,RGBDepthPacking:gmzThreeCore.RGBDepthPacking,RGBIntegerFormat:gmzThreeCore.RGBIntegerFormat,RGDepthPacking:gmzThreeCore.RGDepthPacking,RawShaderMaterial:gmzThreeCore.RawShaderMaterial,Ray:gmzThreeCore.Ray,Raycaster:gmzThreeCore.Raycaster,RectAreaLight:gmzThreeCore.RectAreaLight,RenderTarget:gmzThreeCore.RenderTarget,RenderTarget3D:gmzThreeCore.RenderTarget3D,ReplaceStencilOp:gmzThreeCore.ReplaceStencilOp,RingGeometry:gmzThreeCore.RingGeometry,Scene:gmzThreeCore.Scene,ShadowMaterial:gmzThreeCore.ShadowMaterial,Shape:gmzThreeCore.Shape,ShapeGeometry:gmzThreeCore.ShapeGeometry,ShapePath:gmzThreeCore.ShapePath,ShapeUtils:gmzThreeCore.ShapeUtils,Skeleton:gmzThreeCore.Skeleton,SkeletonHelper:gmzThreeCore.SkeletonHelper,SkinnedMesh:gmzThreeCore.SkinnedMesh,Source:gmzThreeCore.Source,Sphere:gmzThreeCore.Sphere,SphereGeometry:gmzThreeCore.SphereGeometry,Spherical:gmzThreeCore.Spherical,SphericalHarmonics3:gmzThreeCore.SphericalHarmonics3,SplineCurve:gmzThreeCore.SplineCurve,SpotLight:gmzThreeCore.SpotLight,SpotLightHelper:gmzThreeCore.SpotLightHelper,Sprite:gmzThreeCore.Sprite,SpriteMaterial:gmzThreeCore.SpriteMaterial,StaticCopyUsage:gmzThreeCore.StaticCopyUsage,StaticDrawUsage:gmzThreeCore.StaticDrawUsage,StaticReadUsage:gmzThreeCore.StaticReadUsage,StereoCamera:gmzThreeCore.StereoCamera,StreamCopyUsage:gmzThreeCore.StreamCopyUsage,StreamDrawUsage:gmzThreeCore.StreamDrawUsage,StreamReadUsage:gmzThreeCore.StreamReadUsage,StringKeyframeTrack:gmzThreeCore.StringKeyframeTrack,TOUCH:gmzThreeCore.TOUCH,TetrahedronGeometry:gmzThreeCore.TetrahedronGeometry,TextureLoader:gmzThreeCore.TextureLoader,TextureUtils:gmzThreeCore.TextureUtils,Timer:gmzThreeCore.Timer,TimestampQuery:gmzThreeCore.TimestampQuery,TorusGeometry:gmzThreeCore.TorusGeometry,TorusKnotGeometry:gmzThreeCore.TorusKnotGeometry,Triangle:gmzThreeCore.Triangle,TriangleFanDrawMode:gmzThreeCore.TriangleFanDrawMode,TriangleStripDrawMode:gmzThreeCore.TriangleStripDrawMode,TrianglesDrawMode:gmzThreeCore.TrianglesDrawMode,TubeGeometry:gmzThreeCore.TubeGeometry,UVMapping:gmzThreeCore.UVMapping,Uint8BufferAttribute:gmzThreeCore.Uint8BufferAttribute,Uint8ClampedBufferAttribute:gmzThreeCore.Uint8ClampedBufferAttribute,Uniform:gmzThreeCore.Uniform,UniformsGroup:gmzThreeCore.UniformsGroup,VectorKeyframeTrack:gmzThreeCore.VectorKeyframeTrack,VideoFrameTexture:gmzThreeCore.VideoFrameTexture,VideoTexture:gmzThreeCore.VideoTexture,WebGL3DRenderTarget:gmzThreeCore.WebGL3DRenderTarget,WebGLArrayRenderTarget:gmzThreeCore.WebGLArrayRenderTarget,WebGPUCoordinateSystem:gmzThreeCore.WebGPUCoordinateSystem,WireframeGeometry:gmzThreeCore.WireframeGeometry,WrapAroundEnding:gmzThreeCore.WrapAroundEnding,ZeroCurvatureEnding:gmzThreeCore.ZeroCurvatureEnding,ZeroSlopeEnding:gmzThreeCore.ZeroSlopeEnding,ZeroStencilOp:gmzThreeCore.ZeroStencilOp});function nh(){let o=null,f=!1,h=null,x=null;function A(b,N){h(b,N),x=o.requestAnimationFrame(A)}return{start:function(){f!==!0&&h!==null&&(x=o.requestAnimationFrame(A),f=!0)},stop:function(){o.cancelAnimationFrame(x),f=!1},setAnimationLoop:function(b){h=b},setContext:function(b){o=b}}}function ou(o){const f=new WeakMap;function h(R,j){const Y=R.array,ne=R.usage,H=Y.byteLength,X=o.createBuffer();o.bindBuffer(j,X),o.bufferData(j,Y,ne),R.onUploadCallback();let $;if(Y instanceof Float32Array)$=o.FLOAT;else if(typeof Float16Array<"u"&&Y instanceof Float16Array)$=o.HALF_FLOAT;else if(Y instanceof Uint16Array)R.isFloat16BufferAttribute?$=o.HALF_FLOAT:$=o.UNSIGNED_SHORT;else if(Y instanceof Int16Array)$=o.SHORT;else if(Y instanceof Uint32Array)$=o.UNSIGNED_INT;else if(Y instanceof Int32Array)$=o.INT;else if(Y instanceof Int8Array)$=o.BYTE;else if(Y instanceof Uint8Array)$=o.UNSIGNED_BYTE;else if(Y instanceof Uint8ClampedArray)$=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+Y);return{buffer:X,type:$,bytesPerElement:Y.BYTES_PER_ELEMENT,version:R.version,size:H}}function x(R,j,Y){const ne=j.array,H=j.updateRanges;if(o.bindBuffer(Y,R),H.length===0)o.bufferSubData(Y,0,ne);else{H.sort(($,ge)=>$.start-ge.start);let X=0;for(let $=1;$<H.length;$++){const ge=H[X],se=H[$];se.start<=ge.start+ge.count+1?ge.count=Math.max(ge.count,se.start+se.count-ge.start):(++X,H[X]=se)}H.length=X+1;for(let $=0,ge=H.length;$<ge;$++){const se=H[$];o.bufferSubData(Y,se.start*ne.BYTES_PER_ELEMENT,ne,se.start,se.count)}j.clearUpdateRanges()}j.onUploadCallback()}function A(R){return R.isInterleavedBufferAttribute&&(R=R.data),f.get(R)}function b(R){R.isInterleavedBufferAttribute&&(R=R.data);const j=f.get(R);j&&(o.deleteBuffer(j.buffer),f.delete(R))}function N(R,j){if(R.isInterleavedBufferAttribute&&(R=R.data),R.isGLBufferAttribute){const ne=f.get(R);(!ne||ne.version<R.version)&&f.set(R,{buffer:R.buffer,type:R.type,bytesPerElement:R.elementSize,version:R.version});return}const Y=f.get(R);if(Y===void 0)f.set(R,h(R,j));else if(Y.version<R.version){if(Y.size!==R.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");x(Y.buffer,R,j),Y.version=R.version}}return{get:A,remove:b,update:N}}var lu=`#ifdef USE_ALPHAHASH
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
#endif`,yr=`#ifdef USE_AOMAP
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
#endif`,Ma=`#ifdef USE_AOMAP
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
#endif`,Qr=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xi=`float G_BlinnPhong_Implicit( ) {
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
#endif`,ks=`#ifdef USE_BUMPMAP
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
#endif`,Sa=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ji=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vt=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,uo=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ri=`#ifdef USE_ENVMAP
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
#endif`,Bt=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Du=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ie=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gi=`#ifdef USE_FOG
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
material.specularStrength = specularStrength;`,vr=`varying vec3 vViewPosition;
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
material.diffuseColor = diffuseColor.rgb;`,ba=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fo=`BlinnPhongMaterial material;
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
#endif`,ki=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jr=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ta=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Aa=`#ifdef USE_MAP
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
#endif`,gs=`#if defined( USE_POINTS_UV )
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
#endif`,Yn=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ni=`#ifdef USE_MORPHNORMALS
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
#endif`,rl=`#ifdef USE_MORPHTARGETS
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
#endif`,yi=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,es=`#ifdef USE_NORMALMAP
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
#endif`,Mr=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ea=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wa=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ca=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_s=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,xs=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vs=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,po=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,al=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ol=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hs=`#ifdef USE_ROUGHNESSMAP
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
#endif`,mo=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
}`,li=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ts=`#ifdef USE_SKINNING
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
#endif`,ll=`#ifdef USE_SKINNING
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
#endif`,ys=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cl=`#if defined( TONE_MAPPING )
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ra=`#ifdef USE_TRANSMISSION
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
#endif`,Dt=`#ifdef USE_TRANSMISSION
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
#endif`,Ia=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sr=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`;const Ut={alphahash_fragment:lu,alphahash_pars_fragment:cu,alphamap_fragment:hu,alphamap_pars_fragment:uu,alphatest_fragment:du,alphatest_pars_fragment:fu,aomap_fragment:yr,aomap_pars_fragment:Ma,batching_pars_vertex:pu,batching_vertex:mu,begin_vertex:gu,beginnormal_vertex:Qr,bsdfs:xi,iridescence_fragment:ih,bumpmap_pars_fragment:ks,clipping_planes_fragment:Sa,clipping_planes_pars_fragment:ji,clipping_planes_pars_vertex:vt,clipping_planes_vertex:dc,color_fragment:_u,color_pars_fragment:xu,color_pars_vertex:uo,color_vertex:yu,common:vu,cube_uv_reflection_fragment:Mu,defaultnormal_vertex:Su,displacementmap_pars_vertex:bu,displacementmap_vertex:Tu,emissivemap_fragment:Au,emissivemap_pars_fragment:Eu,colorspace_fragment:wu,colorspace_pars_fragment:Cu,envmap_fragment:Ru,envmap_common_pars_fragment:Iu,envmap_pars_fragment:Pu,envmap_pars_vertex:Lu,envmap_physical_pars_fragment:sh,envmap_vertex:Ri,fog_vertex:Bt,fog_pars_vertex:Du,fog_fragment:Ie,fog_pars_fragment:Gi,gradientmap_pars_fragment:U,lightmap_pars_fragment:fc,lights_lambert_fragment:rh,lights_lambert_pars_fragment:vr,lights_pars_begin:pc,lights_toon_fragment:Uu,lights_toon_pars_fragment:ba,lights_phong_fragment:fo,lights_phong_pars_fragment:Fu,lights_physical_fragment:ah,lights_physical_pars_fragment:mc,lights_fragment_begin:Nu,lights_fragment_maps:oh,lights_fragment_end:lh,logdepthbuf_fragment:Bu,logdepthbuf_pars_fragment:ki,logdepthbuf_pars_vertex:jr,logdepthbuf_vertex:Ta,map_fragment:Aa,map_pars_fragment:ch,map_particle_fragment:Ou,map_particle_pars_fragment:gs,metalnessmap_fragment:gc,metalnessmap_pars_fragment:zu,morphinstance_vertex:_c,morphcolor_vertex:Yn,morphnormal_vertex:ni,morphtarget_pars_vertex:xc,morphtarget_vertex:rl,normal_fragment_begin:hh,normal_fragment_maps:Gu,normal_pars_fragment:yc,normal_pars_vertex:ku,normal_vertex:yi,normalmap_pars_fragment:es,clearcoat_normal_fragment_begin:Mr,clearcoat_normal_fragment_maps:sl,clearcoat_pars_fragment:Ea,iridescence_pars_fragment:wa,opaque_fragment:Ca,packing:_s,premultiplied_alpha_fragment:xs,project_vertex:Vs,dithering_fragment:po,dithering_pars_fragment:al,roughnessmap_fragment:ol,roughnessmap_pars_fragment:Hs,shadowmap_pars_fragment:vc,shadowmap_pars_vertex:Vu,shadowmap_vertex:mo,shadowmask_pars_fragment:Mc,skinbase_vertex:li,skinning_pars_vertex:ts,skinning_vertex:Sc,skinnormal_vertex:ll,specularmap_fragment:ys,specularmap_pars_fragment:bc,tonemapping_fragment:cl,tonemapping_pars_fragment:Tc,transmission_fragment:Ra,transmission_pars_fragment:Dt,uv_pars_fragment:Ia,uv_pars_vertex:Sr,uv_vertex:Hu,worldpos_vertex:Wu,background_vert:`varying vec2 vUv;
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
}`},ke={common:{diffuse:{value:new At(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},envMapRotation:{value:new Gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new At(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new At(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new At(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},wn={basic:{uniforms:Be([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.fog]),vertexShader:Ut.meshbasic_vert,fragmentShader:Ut.meshbasic_frag},lambert:{uniforms:Be([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new At(0)}}]),vertexShader:Ut.meshlambert_vert,fragmentShader:Ut.meshlambert_frag},phong:{uniforms:Be([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new At(0)},specular:{value:new At(1118481)},shininess:{value:30}}]),vertexShader:Ut.meshphong_vert,fragmentShader:Ut.meshphong_frag},standard:{uniforms:Be([ke.common,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.roughnessmap,ke.metalnessmap,ke.fog,ke.lights,{emissive:{value:new At(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag},toon:{uniforms:Be([ke.common,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.gradientmap,ke.fog,ke.lights,{emissive:{value:new At(0)}}]),vertexShader:Ut.meshtoon_vert,fragmentShader:Ut.meshtoon_frag},matcap:{uniforms:Be([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,{matcap:{value:null}}]),vertexShader:Ut.meshmatcap_vert,fragmentShader:Ut.meshmatcap_frag},points:{uniforms:Be([ke.points,ke.fog]),vertexShader:Ut.points_vert,fragmentShader:Ut.points_frag},dashed:{uniforms:Be([ke.common,ke.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ut.linedashed_vert,fragmentShader:Ut.linedashed_frag},depth:{uniforms:Be([ke.common,ke.displacementmap]),vertexShader:Ut.depth_vert,fragmentShader:Ut.depth_frag},normal:{uniforms:Be([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,{opacity:{value:1}}]),vertexShader:Ut.meshnormal_vert,fragmentShader:Ut.meshnormal_frag},sprite:{uniforms:Be([ke.sprite,ke.fog]),vertexShader:Ut.sprite_vert,fragmentShader:Ut.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ut.background_vert,fragmentShader:Ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Gt}},vertexShader:Ut.backgroundCube_vert,fragmentShader:Ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ut.cube_vert,fragmentShader:Ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ut.equirect_vert,fragmentShader:Ut.equirect_frag},distanceRGBA:{uniforms:Be([ke.common,ke.displacementmap,{referencePosition:{value:new Ct},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ut.distanceRGBA_vert,fragmentShader:Ut.distanceRGBA_frag},shadow:{uniforms:Be([ke.lights,ke.fog,{color:{value:new At(0)},opacity:{value:1}}]),vertexShader:Ut.shadow_vert,fragmentShader:Ut.shadow_frag}};wn.physical={uniforms:Be([wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new At(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new At(0)},specularColor:{value:new At(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag};const vo={r:0,b:0,g:0},Vi=new ze,ul=new qe;function wc(o,f,h,x,A,b,N){const R=new At(0);let j=b===!0?0:1,Y,ne,H=null,X=0,$=null;function ge(J){let k=J.isScene===!0?J.background:null;return k&&k.isTexture&&(k=(J.backgroundBlurriness>0?h:f).get(k)),k}function se(J){let k=!1;const ce=ge(J);ce===null?y(R,j):ce&&ce.isColor&&(y(ce,1),k=!0);const ee=o.xr.getEnvironmentBlendMode();ee==="additive"?x.buffers.color.setClear(0,0,0,1,N):ee==="alpha-blend"&&x.buffers.color.setClear(0,0,0,0,N),(o.autoClear||k)&&(x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function C(J,k){const ce=ge(k);ce&&(ce.isCubeTexture||ce.mapping===di)?(ne===void 0&&(ne=new vn(new Qt(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:as(wn.backgroundCube.uniforms),vertexShader:wn.backgroundCube.vertexShader,fragmentShader:wn.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),ne.geometry.deleteAttribute("normal"),ne.geometry.deleteAttribute("uv"),ne.onBeforeRender=function(ee,te,ye){this.matrixWorld.copyPosition(ye.matrixWorld)},Object.defineProperty(ne.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),A.update(ne)),Vi.copy(k.backgroundRotation),Vi.x*=-1,Vi.y*=-1,Vi.z*=-1,ce.isCubeTexture&&ce.isRenderTargetTexture===!1&&(Vi.y*=-1,Vi.z*=-1),ne.material.uniforms.envMap.value=ce,ne.material.uniforms.flipEnvMap.value=ce.isCubeTexture&&ce.isRenderTargetTexture===!1?-1:1,ne.material.uniforms.backgroundBlurriness.value=k.backgroundBlurriness,ne.material.uniforms.backgroundIntensity.value=k.backgroundIntensity,ne.material.uniforms.backgroundRotation.value.setFromMatrix4(ul.makeRotationFromEuler(Vi)),ne.material.toneMapped=we.getTransfer(ce.colorSpace)!==$e,(H!==ce||X!==ce.version||$!==o.toneMapping)&&(ne.material.needsUpdate=!0,H=ce,X=ce.version,$=o.toneMapping),ne.layers.enableAll(),J.unshift(ne,ne.geometry,ne.material,0,0,null)):ce&&ce.isTexture&&(Y===void 0&&(Y=new vn(new lt(2,2),new Ln({name:"BackgroundMaterial",uniforms:as(wn.background.uniforms),vertexShader:wn.background.vertexShader,fragmentShader:wn.background.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),Y.geometry.deleteAttribute("normal"),Object.defineProperty(Y.material,"map",{get:function(){return this.uniforms.t2D.value}}),A.update(Y)),Y.material.uniforms.t2D.value=ce,Y.material.uniforms.backgroundIntensity.value=k.backgroundIntensity,Y.material.toneMapped=we.getTransfer(ce.colorSpace)!==$e,ce.matrixAutoUpdate===!0&&ce.updateMatrix(),Y.material.uniforms.uvTransform.value.copy(ce.matrix),(H!==ce||X!==ce.version||$!==o.toneMapping)&&(Y.material.needsUpdate=!0,H=ce,X=ce.version,$=o.toneMapping),Y.layers.enableAll(),J.unshift(Y,Y.geometry,Y.material,0,0,null))}function y(J,k){J.getRGB(vo,Lt(o)),x.buffers.color.setClear(vo.r,vo.g,vo.b,k,N)}function ie(){ne!==void 0&&(ne.geometry.dispose(),ne.material.dispose(),ne=void 0),Y!==void 0&&(Y.geometry.dispose(),Y.material.dispose(),Y=void 0)}return{getClearColor:function(){return R},setClearColor:function(J,k=1){R.set(J),j=k,y(R,j)},getClearAlpha:function(){return j},setClearAlpha:function(J){j=J,y(R,j)},render:se,addToRenderList:C,dispose:ie}}function Et(o,f){const h=o.getParameter(o.MAX_VERTEX_ATTRIBS),x={},A=X(null);let b=A,N=!1;function R(P,Z,de,Ae,Ce){let Se=!1;const be=H(Ae,de,Z);b!==be&&(b=be,Y(b.object)),Se=$(P,Ae,de,Ce),Se&&ge(P,Ae,de,Ce),Ce!==null&&f.update(Ce,o.ELEMENT_ARRAY_BUFFER),(Se||N)&&(N=!1,k(P,Z,de,Ae),Ce!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,f.get(Ce).buffer))}function j(){return o.createVertexArray()}function Y(P){return o.bindVertexArray(P)}function ne(P){return o.deleteVertexArray(P)}function H(P,Z,de){const Ae=de.wireframe===!0;let Ce=x[P.id];Ce===void 0&&(Ce={},x[P.id]=Ce);let Se=Ce[Z.id];Se===void 0&&(Se={},Ce[Z.id]=Se);let be=Se[Ae];return be===void 0&&(be=X(j()),Se[Ae]=be),be}function X(P){const Z=[],de=[],Ae=[];for(let Ce=0;Ce<h;Ce++)Z[Ce]=0,de[Ce]=0,Ae[Ce]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Z,enabledAttributes:de,attributeDivisors:Ae,object:P,attributes:{},index:null}}function $(P,Z,de,Ae){const Ce=b.attributes,Se=Z.attributes;let be=0;const Le=de.getAttributes();for(const _e in Le)if(Le[_e].location>=0){const gt=Ce[_e];let Ot=Se[_e];if(Ot===void 0&&(_e==="instanceMatrix"&&P.instanceMatrix&&(Ot=P.instanceMatrix),_e==="instanceColor"&&P.instanceColor&&(Ot=P.instanceColor)),gt===void 0||gt.attribute!==Ot||Ot&&gt.data!==Ot.data)return!0;be++}return b.attributesNum!==be||b.index!==Ae}function ge(P,Z,de,Ae){const Ce={},Se=Z.attributes;let be=0;const Le=de.getAttributes();for(const _e in Le)if(Le[_e].location>=0){let gt=Se[_e];gt===void 0&&(_e==="instanceMatrix"&&P.instanceMatrix&&(gt=P.instanceMatrix),_e==="instanceColor"&&P.instanceColor&&(gt=P.instanceColor));const Ot={};Ot.attribute=gt,gt&&gt.data&&(Ot.data=gt.data),Ce[_e]=Ot,be++}b.attributes=Ce,b.attributesNum=be,b.index=Ae}function se(){const P=b.newAttributes;for(let Z=0,de=P.length;Z<de;Z++)P[Z]=0}function C(P){y(P,0)}function y(P,Z){const de=b.newAttributes,Ae=b.enabledAttributes,Ce=b.attributeDivisors;de[P]=1,Ae[P]===0&&(o.enableVertexAttribArray(P),Ae[P]=1),Ce[P]!==Z&&(o.vertexAttribDivisor(P,Z),Ce[P]=Z)}function ie(){const P=b.newAttributes,Z=b.enabledAttributes;for(let de=0,Ae=Z.length;de<Ae;de++)Z[de]!==P[de]&&(o.disableVertexAttribArray(de),Z[de]=0)}function J(P,Z,de,Ae,Ce,Se,be){be===!0?o.vertexAttribIPointer(P,Z,de,Ce,Se):o.vertexAttribPointer(P,Z,de,Ae,Ce,Se)}function k(P,Z,de,Ae){se();const Ce=Ae.attributes,Se=de.getAttributes(),be=Z.defaultAttributeValues;for(const Le in Se){const _e=Se[Le];if(_e.location>=0){let rt=Ce[Le];if(rt===void 0&&(Le==="instanceMatrix"&&P.instanceMatrix&&(rt=P.instanceMatrix),Le==="instanceColor"&&P.instanceColor&&(rt=P.instanceColor)),rt!==void 0){const gt=rt.normalized,Ot=rt.itemSize,nn=f.get(rt);if(nn===void 0)continue;const On=nn.buffer,zn=nn.type,fn=nn.bytesPerElement,ve=zn===o.INT||zn===o.UNSIGNED_INT||rt.gpuType===hn;if(rt.isInterleavedBufferAttribute){const Ee=rt.data,tt=Ee.stride,wt=rt.offset;if(Ee.isInstancedInterleavedBuffer){for(let ut=0;ut<_e.locationSize;ut++)y(_e.location+ut,Ee.meshPerAttribute);P.isInstancedMesh!==!0&&Ae._maxInstanceCount===void 0&&(Ae._maxInstanceCount=Ee.meshPerAttribute*Ee.count)}else for(let ut=0;ut<_e.locationSize;ut++)C(_e.location+ut);o.bindBuffer(o.ARRAY_BUFFER,On);for(let ut=0;ut<_e.locationSize;ut++)J(_e.location+ut,Ot/_e.locationSize,zn,gt,tt*fn,(wt+Ot/_e.locationSize*ut)*fn,ve)}else{if(rt.isInstancedBufferAttribute){for(let Ee=0;Ee<_e.locationSize;Ee++)y(_e.location+Ee,rt.meshPerAttribute);P.isInstancedMesh!==!0&&Ae._maxInstanceCount===void 0&&(Ae._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ee=0;Ee<_e.locationSize;Ee++)C(_e.location+Ee);o.bindBuffer(o.ARRAY_BUFFER,On);for(let Ee=0;Ee<_e.locationSize;Ee++)J(_e.location+Ee,Ot/_e.locationSize,zn,gt,Ot*fn,Ot/_e.locationSize*Ee*fn,ve)}}else if(be!==void 0){const gt=be[Le];if(gt!==void 0)switch(gt.length){case 2:o.vertexAttrib2fv(_e.location,gt);break;case 3:o.vertexAttrib3fv(_e.location,gt);break;case 4:o.vertexAttrib4fv(_e.location,gt);break;default:o.vertexAttrib1fv(_e.location,gt)}}}}ie()}function ce(){ye();for(const P in x){const Z=x[P];for(const de in Z){const Ae=Z[de];for(const Ce in Ae)ne(Ae[Ce].object),delete Ae[Ce];delete Z[de]}delete x[P]}}function ee(P){if(x[P.id]===void 0)return;const Z=x[P.id];for(const de in Z){const Ae=Z[de];for(const Ce in Ae)ne(Ae[Ce].object),delete Ae[Ce];delete Z[de]}delete x[P.id]}function te(P){for(const Z in x){const de=x[Z];if(de[P.id]===void 0)continue;const Ae=de[P.id];for(const Ce in Ae)ne(Ae[Ce].object),delete Ae[Ce];delete de[P.id]}}function ye(){L(),N=!0,b!==A&&(b=A,Y(b.object))}function L(){A.geometry=null,A.program=null,A.wireframe=!1}return{setup:R,reset:ye,resetDefaultState:L,dispose:ce,releaseStatesOfGeometry:ee,releaseStatesOfProgram:te,initAttributes:se,enableAttribute:C,disableUnusedAttributes:ie}}function vi(o,f,h){let x;function A(Y){x=Y}function b(Y,ne){o.drawArrays(x,Y,ne),h.update(ne,x,1)}function N(Y,ne,H){H!==0&&(o.drawArraysInstanced(x,Y,ne,H),h.update(ne,x,H))}function R(Y,ne,H){if(H===0)return;f.get("WEBGL_multi_draw").multiDrawArraysWEBGL(x,Y,0,ne,0,H);let $=0;for(let ge=0;ge<H;ge++)$+=ne[ge];h.update($,x,1)}function j(Y,ne,H,X){if(H===0)return;const $=f.get("WEBGL_multi_draw");if($===null)for(let ge=0;ge<Y.length;ge++)N(Y[ge],ne[ge],X[ge]);else{$.multiDrawArraysInstancedWEBGL(x,Y,0,ne,0,X,0,H);let ge=0;for(let se=0;se<H;se++)ge+=ne[se]*X[se];h.update(ge,x,1)}}this.setMode=A,this.render=b,this.renderInstances=N,this.renderMultiDraw=R,this.renderMultiDrawInstances=j}function ju(o,f,h,x){let A;function b(){if(A!==void 0)return A;if(f.has("EXT_texture_filter_anisotropic")===!0){const te=f.get("EXT_texture_filter_anisotropic");A=o.getParameter(te.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else A=0;return A}function N(te){return!(te!==Nt&&x.convert(te)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function R(te){const ye=te===an&&(f.has("EXT_color_buffer_half_float")||f.has("EXT_color_buffer_float"));return!(te!==pn&&x.convert(te)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&te!==dt&&!ye)}function j(te){if(te==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";te="mediump"}return te==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let Y=h.precision!==void 0?h.precision:"highp";const ne=j(Y);ne!==Y&&(console.warn("THREE.WebGLRenderer:",Y,"not supported, using",ne,"instead."),Y=ne);const H=h.logarithmicDepthBuffer===!0,X=h.reversedDepthBuffer===!0&&f.has("EXT_clip_control"),$=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),ge=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),se=o.getParameter(o.MAX_TEXTURE_SIZE),C=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),y=o.getParameter(o.MAX_VERTEX_ATTRIBS),ie=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),J=o.getParameter(o.MAX_VARYING_VECTORS),k=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),ce=ge>0,ee=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:b,getMaxPrecision:j,textureFormatReadable:N,textureTypeReadable:R,precision:Y,logarithmicDepthBuffer:H,reversedDepthBuffer:X,maxTextures:$,maxVertexTextures:ge,maxTextureSize:se,maxCubemapSize:C,maxAttributes:y,maxVertexUniforms:ie,maxVaryings:J,maxFragmentUniforms:k,vertexTextures:ce,maxSamples:ee}}function Mi(o){const f=this;let h=null,x=0,A=!1,b=!1;const N=new jt,R=new Gt,j={value:null,needsUpdate:!1};this.uniform=j,this.numPlanes=0,this.numIntersection=0,this.init=function(H,X){const $=H.length!==0||X||x!==0||A;return A=X,x=H.length,$},this.beginShadows=function(){b=!0,ne(null)},this.endShadows=function(){b=!1},this.setGlobalState=function(H,X){h=ne(H,X,0)},this.setState=function(H,X,$){const ge=H.clippingPlanes,se=H.clipIntersection,C=H.clipShadows,y=o.get(H);if(!A||ge===null||ge.length===0||b&&!C)b?ne(null):Y();else{const ie=b?0:x,J=ie*4;let k=y.clippingState||null;j.value=k,k=ne(ge,X,J,$);for(let ce=0;ce!==J;++ce)k[ce]=h[ce];y.clippingState=k,this.numIntersection=se?this.numPlanes:0,this.numPlanes+=ie}};function Y(){j.value!==h&&(j.value=h,j.needsUpdate=x>0),f.numPlanes=x,f.numIntersection=0}function ne(H,X,$,ge){const se=H!==null?H.length:0;let C=null;if(se!==0){if(C=j.value,ge!==!0||C===null){const y=$+se*4,ie=X.matrixWorldInverse;R.getNormalMatrix(ie),(C===null||C.length<y)&&(C=new Float32Array(y));for(let J=0,k=$;J!==se;++J,k+=4)N.copy(H[J]).applyMatrix4(ie,R),N.normal.toArray(C,k),C[k+3]=N.constant}j.value=C,j.needsUpdate=!0}return f.numPlanes=se,f.numIntersection=0,C}}function Xs(o){let f=new WeakMap;function h(N,R){return R===An?N.mapping=Sn:R===kn&&(N.mapping=En),N}function x(N){if(N&&N.isTexture){const R=N.mapping;if(R===An||R===kn)if(f.has(N)){const j=f.get(N).texture;return h(j,N.mapping)}else{const j=N.image;if(j&&j.height>0){const Y=new ti(j.height);return Y.fromEquirectangularTexture(o,N),f.set(N,Y),N.addEventListener("dispose",A),h(Y.texture,N.mapping)}else return null}}return N}function A(N){const R=N.target;R.removeEventListener("dispose",A);const j=f.get(R);j!==void 0&&(f.delete(R),j.dispose())}function b(){f=new WeakMap}return{get:x,dispose:b}}const Hi=4,xh=[.125,.215,.35,.446,.526,.582],Jn=20,qs=new Mt,yh=new At;let Nn=null,Pa=0,Cc=0,gn=!1;const Ys=(1+Math.sqrt(5))/2,La=1/Ys,vh=[new Ct(-Ys,La,0),new Ct(Ys,La,0),new Ct(-La,0,Ys),new Ct(La,0,Ys),new Ct(0,Ys,-La),new Ct(0,Ys,La),new Ct(-1,1,-1),new Ct(1,1,-1),new Ct(-1,1,1),new Ct(1,1,1)],ed=new Ct;class dl{constructor(f){this._renderer=f,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(f,h=0,x=.1,A=100,b={}){const{size:N=256,position:R=ed}=b;Nn=this._renderer.getRenderTarget(),Pa=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),gn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(N);const j=this._allocateTargets();return j.depthBuffer=!0,this._sceneToCubeUV(f,x,A,j,R),h>0&&this._blur(j,0,0,h),this._applyPMREM(j),this._cleanup(j),j}fromEquirectangular(f,h=null){return this._fromTexture(f,h)}fromCubemap(f,h=null){return this._fromTexture(f,h)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=er(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(f){this._lodMax=Math.floor(Math.log2(f)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let f=0;f<this._lodPlanes.length;f++)this._lodPlanes[f].dispose()}_cleanup(f){this._renderer.setRenderTarget(Nn,Pa,Cc),this._renderer.xr.enabled=gn,f.scissorTest=!1,fl(f,0,0,f.width,f.height)}_fromTexture(f,h){f.mapping===Sn||f.mapping===En?this._setSize(f.image.length===0?16:f.image[0].width||f.image[0].image.width):this._setSize(f.image.width/4),Nn=this._renderer.getRenderTarget(),Pa=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),gn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const x=h||this._allocateTargets();return this._textureToCubeUV(f,x),this._applyPMREM(x),this._cleanup(x),x}_allocateTargets(){const f=3*Math.max(this._cubeSize,112),h=4*this._cubeSize,x={magFilter:Fi,minFilter:Fi,generateMipmaps:!1,type:an,format:Nt,colorSpace:dn,depthBuffer:!1},A=Rc(f,h,x);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==f||this._pingPongRenderTarget.height!==h){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rc(f,h,x);const{_lodMax:b}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=td(b)),this._blurMaterial=Ke(b,f,h)}return A}_compileMaterial(f){const h=new vn(this._lodPlanes[0],f);this._renderer.compile(h,qs)}_sceneToCubeUV(f,h,x,A,b){const j=new $n(90,1,h,x),Y=[1,-1,1,1,1,1],ne=[1,1,1,-1,-1,-1],H=this._renderer,X=H.autoClear,$=H.toneMapping;H.getClearColor(yh),H.toneMapping=Vn,H.autoClear=!1,H.state.buffers.depth.getReversed()&&(H.setRenderTarget(A),H.clearDepth(),H.setRenderTarget(null));const se=new Rt({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1}),C=new vn(new Qt,se);let y=!1;const ie=f.background;ie?ie.isColor&&(se.color.copy(ie),f.background=null,y=!0):(se.color.copy(yh),y=!0);for(let J=0;J<6;J++){const k=J%3;k===0?(j.up.set(0,Y[J],0),j.position.set(b.x,b.y,b.z),j.lookAt(b.x+ne[J],b.y,b.z)):k===1?(j.up.set(0,0,Y[J]),j.position.set(b.x,b.y,b.z),j.lookAt(b.x,b.y+ne[J],b.z)):(j.up.set(0,Y[J],0),j.position.set(b.x,b.y,b.z),j.lookAt(b.x,b.y,b.z+ne[J]));const ce=this._cubeSize;fl(A,k*ce,J>2?ce:0,ce,ce),H.setRenderTarget(A),y&&H.render(C,j),H.render(f,j)}C.geometry.dispose(),C.material.dispose(),H.toneMapping=$,H.autoClear=X,f.background=ie}_textureToCubeUV(f,h){const x=this._renderer,A=f.mapping===Sn||f.mapping===En;A?(this._cubemapMaterial===null&&(this._cubemapMaterial=er()),this._cubemapMaterial.uniforms.flipEnvMap.value=f.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mh());const b=A?this._cubemapMaterial:this._equirectMaterial,N=new vn(this._lodPlanes[0],b),R=b.uniforms;R.envMap.value=f;const j=this._cubeSize;fl(h,0,0,3*j,2*j),x.setRenderTarget(h),x.render(N,qs)}_applyPMREM(f){const h=this._renderer,x=h.autoClear;h.autoClear=!1;const A=this._lodPlanes.length;for(let b=1;b<A;b++){const N=Math.sqrt(this._sigmas[b]*this._sigmas[b]-this._sigmas[b-1]*this._sigmas[b-1]),R=vh[(A-b-1)%vh.length];this._blur(f,b-1,b,N,R)}h.autoClear=x}_blur(f,h,x,A,b){const N=this._pingPongRenderTarget;this._halfBlur(f,N,h,x,A,"latitudinal",b),this._halfBlur(N,f,x,x,A,"longitudinal",b)}_halfBlur(f,h,x,A,b,N,R){const j=this._renderer,Y=this._blurMaterial;N!=="latitudinal"&&N!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const ne=3,H=new vn(this._lodPlanes[A],Y),X=Y.uniforms,$=this._sizeLods[x]-1,ge=isFinite(b)?Math.PI/(2*$):2*Math.PI/(2*Jn-1),se=b/ge,C=isFinite(b)?1+Math.floor(ne*se):Jn;C>Jn&&console.warn(`sigmaRadians, ${b}, is too large and will clip, as it requested ${C} samples when the maximum is set to ${Jn}`);const y=[];let ie=0;for(let te=0;te<Jn;++te){const ye=te/se,L=Math.exp(-ye*ye/2);y.push(L),te===0?ie+=L:te<C&&(ie+=2*L)}for(let te=0;te<y.length;te++)y[te]=y[te]/ie;X.envMap.value=f.texture,X.samples.value=C,X.weights.value=y,X.latitudinal.value=N==="latitudinal",R&&(X.poleAxis.value=R);const{_lodMax:J}=this;X.dTheta.value=ge,X.mipInt.value=J-x;const k=this._sizeLods[A],ce=3*k*(A>J-Hi?A-J+Hi:0),ee=4*(this._cubeSize-k);fl(h,ce,ee,3*k,2*k),j.setRenderTarget(h),j.render(H,qs)}}function td(o){const f=[],h=[],x=[];let A=o;const b=o-Hi+1+xh.length;for(let N=0;N<b;N++){const R=Math.pow(2,A);h.push(R);let j=1/R;N>o-Hi?j=xh[N-o+Hi-1]:N===0&&(j=0),x.push(j);const Y=1/(R-2),ne=-Y,H=1+Y,X=[ne,ne,H,ne,H,H,ne,ne,H,H,ne,H],$=6,ge=6,se=3,C=2,y=1,ie=new Float32Array(se*ge*$),J=new Float32Array(C*ge*$),k=new Float32Array(y*ge*$);for(let ee=0;ee<$;ee++){const te=ee%3*2/3-1,ye=ee>2?0:-1,L=[te,ye,0,te+2/3,ye,0,te+2/3,ye+1,0,te,ye,0,te+2/3,ye+1,0,te,ye+1,0];ie.set(L,se*ge*ee),J.set(X,C*ge*ee);const P=[ee,ee,ee,ee,ee,ee];k.set(P,y*ge*ee)}const ce=new Ui;ce.setAttribute("position",new fi(ie,se)),ce.setAttribute("uv",new fi(J,C)),ce.setAttribute("faceIndex",new fi(k,y)),f.push(ce),A>Hi&&A--}return{lodPlanes:f,sizeLods:h,sigmas:x}}function Rc(o,f,h){const x=new Ti(o,f,h);return x.texture.mapping=di,x.texture.name="PMREM.cubeUv",x.scissorTest=!0,x}function fl(o,f,h,x,A){o.viewport.set(f,h,x,A),o.scissor.set(f,h,x,A)}function Ke(o,f,h){const x=new Float32Array(Jn),A=new Ct(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:Jn,CUBEUV_TEXEL_WIDTH:1/f,CUBEUV_TEXEL_HEIGHT:1/h,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:x},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:A}},vertexShader:Mo(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Mh(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mo(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function er(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Mo(){return`

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
	`}function Da(o){let f=new WeakMap,h=null;function x(R){if(R&&R.isTexture){const j=R.mapping,Y=j===An||j===kn,ne=j===Sn||j===En;if(Y||ne){let H=f.get(R);const X=H!==void 0?H.texture.pmremVersion:0;if(R.isRenderTargetTexture&&R.pmremVersion!==X)return h===null&&(h=new dl(o)),H=Y?h.fromEquirectangular(R,H):h.fromCubemap(R,H),H.texture.pmremVersion=R.pmremVersion,f.set(R,H),H.texture;if(H!==void 0)return H.texture;{const $=R.image;return Y&&$&&$.height>0||ne&&$&&A($)?(h===null&&(h=new dl(o)),H=Y?h.fromEquirectangular(R):h.fromCubemap(R),H.texture.pmremVersion=R.pmremVersion,f.set(R,H),R.addEventListener("dispose",b),H.texture):null}}}return R}function A(R){let j=0;const Y=6;for(let ne=0;ne<Y;ne++)R[ne]!==void 0&&j++;return j===Y}function b(R){const j=R.target;j.removeEventListener("dispose",b);const Y=f.get(j);Y!==void 0&&(f.delete(j),Y.dispose())}function N(){f=new WeakMap,h!==null&&(h.dispose(),h=null)}return{get:x,dispose:N}}function tr(o){const f={};function h(x){if(f[x]!==void 0)return f[x];let A;switch(x){case"WEBGL_depth_texture":A=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":A=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":A=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":A=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:A=o.getExtension(x)}return f[x]=A,A}return{has:function(x){return h(x)!==null},init:function(){h("EXT_color_buffer_float"),h("WEBGL_clip_cull_distance"),h("OES_texture_float_linear"),h("EXT_color_buffer_half_float"),h("WEBGL_multisampled_render_to_texture"),h("WEBGL_render_shared_exponent")},get:function(x){const A=h(x);return A===null&&os("THREE.WebGLRenderer: "+x+" extension not supported."),A}}}function So(o,f,h,x){const A={},b=new WeakMap;function N(H){const X=H.target;X.index!==null&&f.remove(X.index);for(const ge in X.attributes)f.remove(X.attributes[ge]);X.removeEventListener("dispose",N),delete A[X.id];const $=b.get(X);$&&(f.remove($),b.delete(X)),x.releaseStatesOfGeometry(X),X.isInstancedBufferGeometry===!0&&delete X._maxInstanceCount,h.memory.geometries--}function R(H,X){return A[X.id]===!0||(X.addEventListener("dispose",N),A[X.id]=!0,h.memory.geometries++),X}function j(H){const X=H.attributes;for(const $ in X)f.update(X[$],o.ARRAY_BUFFER)}function Y(H){const X=[],$=H.index,ge=H.attributes.position;let se=0;if($!==null){const ie=$.array;se=$.version;for(let J=0,k=ie.length;J<k;J+=3){const ce=ie[J+0],ee=ie[J+1],te=ie[J+2];X.push(ce,ee,ee,te,te,ce)}}else if(ge!==void 0){const ie=ge.array;se=ge.version;for(let J=0,k=ie.length/3-1;J<k;J+=3){const ce=J+0,ee=J+1,te=J+2;X.push(ce,ee,ee,te,te,ce)}}else return;const C=new(Ar(X)?Fn:Ni)(X,1);C.version=se;const y=b.get(H);y&&f.remove(y),b.set(H,C)}function ne(H){const X=b.get(H);if(X){const $=H.index;$!==null&&X.version<$.version&&Y(H)}else Y(H);return b.get(H)}return{get:R,update:j,getWireframeAttribute:ne}}function si(o,f,h){let x;function A(X){x=X}let b,N;function R(X){b=X.type,N=X.bytesPerElement}function j(X,$){o.drawElements(x,$,b,X*N),h.update($,x,1)}function Y(X,$,ge){ge!==0&&(o.drawElementsInstanced(x,$,b,X*N,ge),h.update($,x,ge))}function ne(X,$,ge){if(ge===0)return;f.get("WEBGL_multi_draw").multiDrawElementsWEBGL(x,$,0,b,X,0,ge);let C=0;for(let y=0;y<ge;y++)C+=$[y];h.update(C,x,1)}function H(X,$,ge,se){if(ge===0)return;const C=f.get("WEBGL_multi_draw");if(C===null)for(let y=0;y<X.length;y++)Y(X[y]/N,$[y],se[y]);else{C.multiDrawElementsInstancedWEBGL(x,$,0,b,X,0,se,0,ge);let y=0;for(let ie=0;ie<ge;ie++)y+=$[ie]*se[ie];h.update(y,x,1)}}this.setMode=A,this.setIndex=R,this.render=j,this.renderInstances=Y,this.renderMultiDraw=ne,this.renderMultiDrawInstances=H}function kt(o){const f={geometries:0,textures:0},h={frame:0,calls:0,triangles:0,points:0,lines:0};function x(b,N,R){switch(h.calls++,N){case o.TRIANGLES:h.triangles+=R*(b/3);break;case o.LINES:h.lines+=R*(b/2);break;case o.LINE_STRIP:h.lines+=R*(b-1);break;case o.LINE_LOOP:h.lines+=R*b;break;case o.POINTS:h.points+=R*b;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",N);break}}function A(){h.calls=0,h.triangles=0,h.points=0,h.lines=0}return{memory:f,render:h,programs:null,autoReset:!0,reset:A,update:x}}function Sh(o,f,h){const x=new WeakMap,A=new Hn;function b(N,R,j){const Y=N.morphTargetInfluences,ne=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,H=ne!==void 0?ne.length:0;let X=x.get(R);if(X===void 0||X.count!==H){let P=function(){ye.dispose(),x.delete(R),R.removeEventListener("dispose",P)};var $=P;X!==void 0&&X.texture.dispose();const ge=R.morphAttributes.position!==void 0,se=R.morphAttributes.normal!==void 0,C=R.morphAttributes.color!==void 0,y=R.morphAttributes.position||[],ie=R.morphAttributes.normal||[],J=R.morphAttributes.color||[];let k=0;ge===!0&&(k=1),se===!0&&(k=2),C===!0&&(k=3);let ce=R.attributes.position.count*k,ee=1;ce>f.maxTextureSize&&(ee=Math.ceil(ce/f.maxTextureSize),ce=f.maxTextureSize);const te=new Float32Array(ce*ee*4*H),ye=new Er(te,ce,ee,H);ye.type=dt,ye.needsUpdate=!0;const L=k*4;for(let Z=0;Z<H;Z++){const de=y[Z],Ae=ie[Z],Ce=J[Z],Se=ce*ee*4*Z;for(let be=0;be<de.count;be++){const Le=be*L;ge===!0&&(A.fromBufferAttribute(de,be),te[Se+Le+0]=A.x,te[Se+Le+1]=A.y,te[Se+Le+2]=A.z,te[Se+Le+3]=0),se===!0&&(A.fromBufferAttribute(Ae,be),te[Se+Le+4]=A.x,te[Se+Le+5]=A.y,te[Se+Le+6]=A.z,te[Se+Le+7]=0),C===!0&&(A.fromBufferAttribute(Ce,be),te[Se+Le+8]=A.x,te[Se+Le+9]=A.y,te[Se+Le+10]=A.z,te[Se+Le+11]=Ce.itemSize===4?A.w:1)}}X={count:H,texture:ye,size:new $t(ce,ee)},x.set(R,X),R.addEventListener("dispose",P)}if(N.isInstancedMesh===!0&&N.morphTexture!==null)j.getUniforms().setValue(o,"morphTexture",N.morphTexture,h);else{let ge=0;for(let C=0;C<Y.length;C++)ge+=Y[C];const se=R.morphTargetsRelative?1:1-ge;j.getUniforms().setValue(o,"morphTargetBaseInfluence",se),j.getUniforms().setValue(o,"morphTargetInfluences",Y)}j.getUniforms().setValue(o,"morphTargetsTexture",X.texture,h),j.getUniforms().setValue(o,"morphTargetsTextureSize",X.size)}return{update:b}}function Zs(o,f,h,x){let A=new WeakMap;function b(j){const Y=x.render.frame,ne=j.geometry,H=f.get(j,ne);if(A.get(H)!==Y&&(f.update(H),A.set(H,Y)),j.isInstancedMesh&&(j.hasEventListener("dispose",R)===!1&&j.addEventListener("dispose",R),A.get(j)!==Y&&(h.update(j.instanceMatrix,o.ARRAY_BUFFER),j.instanceColor!==null&&h.update(j.instanceColor,o.ARRAY_BUFFER),A.set(j,Y))),j.isSkinnedMesh){const X=j.skeleton;A.get(X)!==Y&&(X.update(),A.set(X,Y))}return H}function N(){A=new WeakMap}function R(j){const Y=j.target;Y.removeEventListener("dispose",R),h.remove(Y.instanceMatrix),Y.instanceColor!==null&&h.remove(Y.instanceColor)}return{update:b,dispose:N}}const bo=new Jo,Ic=new kr(1,1),To=new Er,Ao=new Gr,Eo=new $o,pl=[],wo=[],Pc=new Float32Array(16),Co=new Float32Array(9),nr=new Float32Array(4);function Ua(o,f,h){const x=o[0];if(x<=0||x>0)return o;const A=f*h;let b=pl[A];if(b===void 0&&(b=new Float32Array(A),pl[A]=b),f!==0){x.toArray(b,0);for(let N=1,R=0;N!==f;++N)R+=h,o[N].toArray(b,R)}return b}function Bn(o,f){if(o.length!==f.length)return!1;for(let h=0,x=o.length;h<x;h++)if(o[h]!==f[h])return!1;return!0}function Un(o,f){for(let h=0,x=f.length;h<x;h++)o[h]=f[h]}function bs(o,f){let h=wo[f];h===void 0&&(h=new Int32Array(f),wo[f]=h);for(let x=0;x!==f;++x)h[x]=o.allocateTextureUnit();return h}function bh(o,f){const h=this.cache;h[0]!==f&&(o.uniform1f(this.addr,f),h[0]=f)}function nd(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y)&&(o.uniform2f(this.addr,f.x,f.y),h[0]=f.x,h[1]=f.y);else{if(Bn(h,f))return;o.uniform2fv(this.addr,f),Un(h,f)}}function id(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z)&&(o.uniform3f(this.addr,f.x,f.y,f.z),h[0]=f.x,h[1]=f.y,h[2]=f.z);else if(f.r!==void 0)(h[0]!==f.r||h[1]!==f.g||h[2]!==f.b)&&(o.uniform3f(this.addr,f.r,f.g,f.b),h[0]=f.r,h[1]=f.g,h[2]=f.b);else{if(Bn(h,f))return;o.uniform3fv(this.addr,f),Un(h,f)}}function rd(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z||h[3]!==f.w)&&(o.uniform4f(this.addr,f.x,f.y,f.z,f.w),h[0]=f.x,h[1]=f.y,h[2]=f.z,h[3]=f.w);else{if(Bn(h,f))return;o.uniform4fv(this.addr,f),Un(h,f)}}function sd(o,f){const h=this.cache,x=f.elements;if(x===void 0){if(Bn(h,f))return;o.uniformMatrix2fv(this.addr,!1,f),Un(h,f)}else{if(Bn(h,x))return;nr.set(x),o.uniformMatrix2fv(this.addr,!1,nr),Un(h,x)}}function ad(o,f){const h=this.cache,x=f.elements;if(x===void 0){if(Bn(h,f))return;o.uniformMatrix3fv(this.addr,!1,f),Un(h,f)}else{if(Bn(h,x))return;Co.set(x),o.uniformMatrix3fv(this.addr,!1,Co),Un(h,x)}}function ml(o,f){const h=this.cache,x=f.elements;if(x===void 0){if(Bn(h,f))return;o.uniformMatrix4fv(this.addr,!1,f),Un(h,f)}else{if(Bn(h,x))return;Pc.set(x),o.uniformMatrix4fv(this.addr,!1,Pc),Un(h,x)}}function gl(o,f){const h=this.cache;h[0]!==f&&(o.uniform1i(this.addr,f),h[0]=f)}function Ts(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y)&&(o.uniform2i(this.addr,f.x,f.y),h[0]=f.x,h[1]=f.y);else{if(Bn(h,f))return;o.uniform2iv(this.addr,f),Un(h,f)}}function Th(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z)&&(o.uniform3i(this.addr,f.x,f.y,f.z),h[0]=f.x,h[1]=f.y,h[2]=f.z);else{if(Bn(h,f))return;o.uniform3iv(this.addr,f),Un(h,f)}}function Ah(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z||h[3]!==f.w)&&(o.uniform4i(this.addr,f.x,f.y,f.z,f.w),h[0]=f.x,h[1]=f.y,h[2]=f.z,h[3]=f.w);else{if(Bn(h,f))return;o.uniform4iv(this.addr,f),Un(h,f)}}function ir(o,f){const h=this.cache;h[0]!==f&&(o.uniform1ui(this.addr,f),h[0]=f)}function Fa(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y)&&(o.uniform2ui(this.addr,f.x,f.y),h[0]=f.x,h[1]=f.y);else{if(Bn(h,f))return;o.uniform2uiv(this.addr,f),Un(h,f)}}function Na(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z)&&(o.uniform3ui(this.addr,f.x,f.y,f.z),h[0]=f.x,h[1]=f.y,h[2]=f.z);else{if(Bn(h,f))return;o.uniform3uiv(this.addr,f),Un(h,f)}}function Eh(o,f){const h=this.cache;if(f.x!==void 0)(h[0]!==f.x||h[1]!==f.y||h[2]!==f.z||h[3]!==f.w)&&(o.uniform4ui(this.addr,f.x,f.y,f.z,f.w),h[0]=f.x,h[1]=f.y,h[2]=f.z,h[3]=f.w);else{if(Bn(h,f))return;o.uniform4uiv(this.addr,f),Un(h,f)}}function _l(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A);let b;this.type===o.SAMPLER_2D_SHADOW?(Ic.compareFunction=pi,b=Ic):b=bo,h.setTexture2D(f||b,A)}function od(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A),h.setTexture3D(f||Ao,A)}function Ba(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A),h.setTextureCube(f||Eo,A)}function ld(o,f,h){const x=this.cache,A=h.allocateTextureUnit();x[0]!==A&&(o.uniform1i(this.addr,A),x[0]=A),h.setTexture2DArray(f||To,A)}function cd(o){switch(o){case 5126:return bh;case 35664:return nd;case 35665:return id;case 35666:return rd;case 35674:return sd;case 35675:return ad;case 35676:return ml;case 5124:case 35670:return gl;case 35667:case 35671:return Ts;case 35668:case 35672:return Th;case 35669:case 35673:return Ah;case 5125:return ir;case 36294:return Fa;case 36295:return Na;case 36296:return Eh;case 35678:case 36198:case 36298:case 36306:case 35682:return _l;case 35679:case 36299:case 36307:return od;case 35680:case 36300:case 36308:case 36293:return Ba;case 36289:case 36303:case 36311:case 36292:return ld}}function xl(o,f){o.uniform1fv(this.addr,f)}function yl(o,f){const h=Ua(f,this.size,2);o.uniform2fv(this.addr,h)}function wh(o,f){const h=Ua(f,this.size,3);o.uniform3fv(this.addr,h)}function vl(o,f){const h=Ua(f,this.size,4);o.uniform4fv(this.addr,h)}function Ii(o,f){const h=Ua(f,this.size,4);o.uniformMatrix2fv(this.addr,!1,h)}function $s(o,f){const h=Ua(f,this.size,9);o.uniformMatrix3fv(this.addr,!1,h)}function Lc(o,f){const h=Ua(f,this.size,16);o.uniformMatrix4fv(this.addr,!1,h)}function Oa(o,f){o.uniform1iv(this.addr,f)}function Ro(o,f){o.uniform2iv(this.addr,f)}function za(o,f){o.uniform3iv(this.addr,f)}function Ga(o,f){o.uniform4iv(this.addr,f)}function ka(o,f){o.uniform1uiv(this.addr,f)}function Io(o,f){o.uniform2uiv(this.addr,f)}function Ch(o,f){o.uniform3uiv(this.addr,f)}function Ml(o,f){o.uniform4uiv(this.addr,f)}function Po(o,f,h){const x=this.cache,A=f.length,b=bs(h,A);Bn(x,b)||(o.uniform1iv(this.addr,b),Un(x,b));for(let N=0;N!==A;++N)h.setTexture2D(f[N]||bo,b[N])}function Sl(o,f,h){const x=this.cache,A=f.length,b=bs(h,A);Bn(x,b)||(o.uniform1iv(this.addr,b),Un(x,b));for(let N=0;N!==A;++N)h.setTexture3D(f[N]||Ao,b[N])}function Rh(o,f,h){const x=this.cache,A=f.length,b=bs(h,A);Bn(x,b)||(o.uniform1iv(this.addr,b),Un(x,b));for(let N=0;N!==A;++N)h.setTextureCube(f[N]||Eo,b[N])}function Dc(o,f,h){const x=this.cache,A=f.length,b=bs(h,A);Bn(x,b)||(o.uniform1iv(this.addr,b),Un(x,b));for(let N=0;N!==A;++N)h.setTexture2DArray(f[N]||To,b[N])}function Ih(o){switch(o){case 5126:return xl;case 35664:return yl;case 35665:return wh;case 35666:return vl;case 35674:return Ii;case 35675:return $s;case 35676:return Lc;case 5124:case 35670:return Oa;case 35667:case 35671:return Ro;case 35668:case 35672:return za;case 35669:case 35673:return Ga;case 5125:return ka;case 36294:return Io;case 36295:return Ch;case 36296:return Ml;case 35678:case 36198:case 36298:case 36306:case 35682:return Po;case 35679:case 36299:case 36307:return Sl;case 35680:case 36300:case 36308:case 36293:return Rh;case 36289:case 36303:case 36311:case 36292:return Dc}}class Ph{constructor(f,h,x){this.id=f,this.addr=x,this.cache=[],this.type=h.type,this.setValue=cd(h.type)}}class bl{constructor(f,h,x){this.id=f,this.addr=x,this.cache=[],this.type=h.type,this.size=h.size,this.setValue=Ih(h.type)}}class Tl{constructor(f){this.id=f,this.seq=[],this.map={}}setValue(f,h,x){const A=this.seq;for(let b=0,N=A.length;b!==N;++b){const R=A[b];R.setValue(f,h[R.id],x)}}}const Al=/(\w+)(\])?(\[|\.)?/g;function Uc(o,f){o.seq.push(f),o.map[f.id]=f}function Lh(o,f,h){const x=o.name,A=x.length;for(Al.lastIndex=0;;){const b=Al.exec(x),N=Al.lastIndex;let R=b[1];const j=b[2]==="]",Y=b[3];if(j&&(R=R|0),Y===void 0||Y==="["&&N+2===A){Uc(h,Y===void 0?new Ph(R,o,f):new bl(R,o,f));break}else{let H=h.map[R];H===void 0&&(H=new Tl(R),Uc(h,H)),h=H}}}class Lo{constructor(f,h){this.seq=[],this.map={};const x=f.getProgramParameter(h,f.ACTIVE_UNIFORMS);for(let A=0;A<x;++A){const b=f.getActiveUniform(h,A),N=f.getUniformLocation(h,b.name);Lh(b,N,this)}}setValue(f,h,x,A){const b=this.map[h];b!==void 0&&b.setValue(f,x,A)}setOptional(f,h,x){const A=h[x];A!==void 0&&this.setValue(f,x,A)}static upload(f,h,x,A){for(let b=0,N=h.length;b!==N;++b){const R=h[b],j=x[R.id];j.needsUpdate!==!1&&R.setValue(f,j.value,A)}}static seqWithValue(f,h){const x=[];for(let A=0,b=f.length;A!==b;++A){const N=f[A];N.id in h&&x.push(N)}return x}}function Fc(o,f,h){const x=o.createShader(f);return o.shaderSource(x,h),o.compileShader(x),x}const hd=37297;let Dh=0;function El(o,f){const h=o.split(`
`),x=[],A=Math.max(f-6,0),b=Math.min(f+6,h.length);for(let N=A;N<b;N++){const R=N+1;x.push(`${R===f?">":" "} ${R}: ${h[N]}`)}return x.join(`
`)}const wl=new Gt;function Uh(o){we._getMatrix(wl,we.workingColorSpace,o);const f=`mat3( ${wl.elements.map(h=>h.toFixed(4))} )`;switch(we.getTransfer(o)){case ls:return[f,"LinearTransferOETF"];case $e:return[f,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[f,"LinearTransferOETF"]}}function Cl(o,f,h){const x=o.getShaderParameter(f,o.COMPILE_STATUS),b=(o.getShaderInfoLog(f)||"").trim();if(x&&b==="")return"";const N=/ERROR: 0:(\d+)/.exec(b);if(N){const R=parseInt(N[1]);return h.toUpperCase()+`

`+b+`

`+El(o.getShaderSource(f),R)}else return b}function Fh(o,f){const h=Uh(f);return[`vec4 ${o}( vec4 value ) {`,`	return ${h[1]}( vec4( value.rgb * ${h[0]}, value.a ) );`,"}"].join(`
`)}function Nc(o,f){let h;switch(f){case Vr:h="Linear";break;case la:h="Reinhard";break;case jo:h="Cineon";break;case Qo:h="ACESFilmic";break;case Rs:h="AgX";break;case Cs:h="Neutral";break;case Ko:h="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",f),h="Linear"}return"vec3 "+o+"( vec3 color ) { return "+h+"ToneMapping( color ); }"}const rr=new Ct;function Nh(){we.getLuminanceCoefficients(rr);const o=rr.x.toFixed(4),f=rr.y.toFixed(4),h=rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${f}, ${h} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ud(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fr).join(`
`)}function Rl(o){const f=[];for(const h in o){const x=o[h];x!==!1&&f.push("#define "+h+" "+x)}return f.join(`
`)}function Va(o,f){const h={},x=o.getProgramParameter(f,o.ACTIVE_ATTRIBUTES);for(let A=0;A<x;A++){const b=o.getActiveAttrib(f,A),N=b.name;let R=1;b.type===o.FLOAT_MAT2&&(R=2),b.type===o.FLOAT_MAT3&&(R=3),b.type===o.FLOAT_MAT4&&(R=4),h[N]={type:b.type,location:o.getAttribLocation(f,N),locationSize:R}}return h}function Fr(o){return o!==""}function Bc(o,f){const h=f.numSpotLightShadows+f.numSpotLightMaps-f.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,f.numDirLights).replace(/NUM_SPOT_LIGHTS/g,f.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,f.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,h).replace(/NUM_RECT_AREA_LIGHTS/g,f.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,f.numPointLights).replace(/NUM_HEMI_LIGHTS/g,f.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,f.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,f.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,f.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,f.numPointLightShadows)}function Do(o,f){return o.replace(/NUM_CLIPPING_PLANES/g,f.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,f.numClippingPlanes-f.numClipIntersection)}const Bh=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oc(o){return o.replace(Bh,Fo)}const Uo=new Map;function Fo(o,f){let h=Ut[f];if(h===void 0){const x=Uo.get(f);if(x!==void 0)h=Ut[x],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',f,x);else throw new Error("Can not resolve #include <"+f+">")}return Oc(h)}const Oh=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Il(o){return o.replace(Oh,dd)}function dd(o,f,h,x){let A="";for(let b=parseInt(f);b<parseInt(h);b++)A+=x.replace(/\[\s*i\s*\]/g,"[ "+b+" ]").replace(/UNROLLED_LOOP_INDEX/g,b);return A}function zh(o){let f=`precision ${o.precision} float;
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
#define LOW_PRECISION`),f}function Js(o){let f="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===oa?f="SHADOWMAP_TYPE_PCF":o.shadowMapType===Za?f="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===$i&&(f="SHADOWMAP_TYPE_VSM"),f}function Ks(o){let f="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Sn:case En:f="ENVMAP_TYPE_CUBE";break;case di:f="ENVMAP_TYPE_CUBE_UV";break}return f}function fd(o){let f="ENVMAP_MODE_REFLECTION";return o.envMap&&o.envMapMode===En&&(f="ENVMAP_MODE_REFRACTION"),f}function Pl(o){let f="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case ca:f="ENVMAP_BLENDING_MULTIPLY";break;case $a:f="ENVMAP_BLENDING_MIX";break;case Hr:f="ENVMAP_BLENDING_ADD";break}return f}function Ll(o){const f=o.envMapCubeUVHeight;if(f===null)return null;const h=Math.log2(f)-2,x=1/f;return{texelWidth:1/(3*Math.max(Math.pow(2,h),112)),texelHeight:x,maxMip:h}}function Nr(o,f,h,x){const A=o.getContext(),b=h.defines;let N=h.vertexShader,R=h.fragmentShader;const j=Js(h),Y=Ks(h),ne=fd(h),H=Pl(h),X=Ll(h),$=ud(h),ge=Rl(b),se=A.createProgram();let C,y,ie=h.glslVersion?"#version "+h.glslVersion+`
`:"";h.isRawShaderMaterial?(C=["#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge].filter(Fr).join(`
`),C.length>0&&(C+=`
`),y=["#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge].filter(Fr).join(`
`),y.length>0&&(y+=`
`)):(C=[zh(h),"#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge,h.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",h.batching?"#define USE_BATCHING":"",h.batchingColor?"#define USE_BATCHING_COLOR":"",h.instancing?"#define USE_INSTANCING":"",h.instancingColor?"#define USE_INSTANCING_COLOR":"",h.instancingMorph?"#define USE_INSTANCING_MORPH":"",h.useFog&&h.fog?"#define USE_FOG":"",h.useFog&&h.fogExp2?"#define FOG_EXP2":"",h.map?"#define USE_MAP":"",h.envMap?"#define USE_ENVMAP":"",h.envMap?"#define "+ne:"",h.lightMap?"#define USE_LIGHTMAP":"",h.aoMap?"#define USE_AOMAP":"",h.bumpMap?"#define USE_BUMPMAP":"",h.normalMap?"#define USE_NORMALMAP":"",h.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",h.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",h.displacementMap?"#define USE_DISPLACEMENTMAP":"",h.emissiveMap?"#define USE_EMISSIVEMAP":"",h.anisotropy?"#define USE_ANISOTROPY":"",h.anisotropyMap?"#define USE_ANISOTROPYMAP":"",h.clearcoatMap?"#define USE_CLEARCOATMAP":"",h.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",h.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",h.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",h.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",h.specularMap?"#define USE_SPECULARMAP":"",h.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",h.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",h.roughnessMap?"#define USE_ROUGHNESSMAP":"",h.metalnessMap?"#define USE_METALNESSMAP":"",h.alphaMap?"#define USE_ALPHAMAP":"",h.alphaHash?"#define USE_ALPHAHASH":"",h.transmission?"#define USE_TRANSMISSION":"",h.transmissionMap?"#define USE_TRANSMISSIONMAP":"",h.thicknessMap?"#define USE_THICKNESSMAP":"",h.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",h.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",h.mapUv?"#define MAP_UV "+h.mapUv:"",h.alphaMapUv?"#define ALPHAMAP_UV "+h.alphaMapUv:"",h.lightMapUv?"#define LIGHTMAP_UV "+h.lightMapUv:"",h.aoMapUv?"#define AOMAP_UV "+h.aoMapUv:"",h.emissiveMapUv?"#define EMISSIVEMAP_UV "+h.emissiveMapUv:"",h.bumpMapUv?"#define BUMPMAP_UV "+h.bumpMapUv:"",h.normalMapUv?"#define NORMALMAP_UV "+h.normalMapUv:"",h.displacementMapUv?"#define DISPLACEMENTMAP_UV "+h.displacementMapUv:"",h.metalnessMapUv?"#define METALNESSMAP_UV "+h.metalnessMapUv:"",h.roughnessMapUv?"#define ROUGHNESSMAP_UV "+h.roughnessMapUv:"",h.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+h.anisotropyMapUv:"",h.clearcoatMapUv?"#define CLEARCOATMAP_UV "+h.clearcoatMapUv:"",h.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+h.clearcoatNormalMapUv:"",h.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+h.clearcoatRoughnessMapUv:"",h.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+h.iridescenceMapUv:"",h.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+h.iridescenceThicknessMapUv:"",h.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+h.sheenColorMapUv:"",h.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+h.sheenRoughnessMapUv:"",h.specularMapUv?"#define SPECULARMAP_UV "+h.specularMapUv:"",h.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+h.specularColorMapUv:"",h.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+h.specularIntensityMapUv:"",h.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+h.transmissionMapUv:"",h.thicknessMapUv?"#define THICKNESSMAP_UV "+h.thicknessMapUv:"",h.vertexTangents&&h.flatShading===!1?"#define USE_TANGENT":"",h.vertexColors?"#define USE_COLOR":"",h.vertexAlphas?"#define USE_COLOR_ALPHA":"",h.vertexUv1s?"#define USE_UV1":"",h.vertexUv2s?"#define USE_UV2":"",h.vertexUv3s?"#define USE_UV3":"",h.pointsUvs?"#define USE_POINTS_UV":"",h.flatShading?"#define FLAT_SHADED":"",h.skinning?"#define USE_SKINNING":"",h.morphTargets?"#define USE_MORPHTARGETS":"",h.morphNormals&&h.flatShading===!1?"#define USE_MORPHNORMALS":"",h.morphColors?"#define USE_MORPHCOLORS":"",h.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+h.morphTextureStride:"",h.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+h.morphTargetsCount:"",h.doubleSided?"#define DOUBLE_SIDED":"",h.flipSided?"#define FLIP_SIDED":"",h.shadowMapEnabled?"#define USE_SHADOWMAP":"",h.shadowMapEnabled?"#define "+j:"",h.sizeAttenuation?"#define USE_SIZEATTENUATION":"",h.numLightProbes>0?"#define USE_LIGHT_PROBES":"",h.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",h.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fr).join(`
`),y=[zh(h),"#define SHADER_TYPE "+h.shaderType,"#define SHADER_NAME "+h.shaderName,ge,h.useFog&&h.fog?"#define USE_FOG":"",h.useFog&&h.fogExp2?"#define FOG_EXP2":"",h.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",h.map?"#define USE_MAP":"",h.matcap?"#define USE_MATCAP":"",h.envMap?"#define USE_ENVMAP":"",h.envMap?"#define "+Y:"",h.envMap?"#define "+ne:"",h.envMap?"#define "+H:"",X?"#define CUBEUV_TEXEL_WIDTH "+X.texelWidth:"",X?"#define CUBEUV_TEXEL_HEIGHT "+X.texelHeight:"",X?"#define CUBEUV_MAX_MIP "+X.maxMip+".0":"",h.lightMap?"#define USE_LIGHTMAP":"",h.aoMap?"#define USE_AOMAP":"",h.bumpMap?"#define USE_BUMPMAP":"",h.normalMap?"#define USE_NORMALMAP":"",h.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",h.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",h.emissiveMap?"#define USE_EMISSIVEMAP":"",h.anisotropy?"#define USE_ANISOTROPY":"",h.anisotropyMap?"#define USE_ANISOTROPYMAP":"",h.clearcoat?"#define USE_CLEARCOAT":"",h.clearcoatMap?"#define USE_CLEARCOATMAP":"",h.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",h.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",h.dispersion?"#define USE_DISPERSION":"",h.iridescence?"#define USE_IRIDESCENCE":"",h.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",h.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",h.specularMap?"#define USE_SPECULARMAP":"",h.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",h.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",h.roughnessMap?"#define USE_ROUGHNESSMAP":"",h.metalnessMap?"#define USE_METALNESSMAP":"",h.alphaMap?"#define USE_ALPHAMAP":"",h.alphaTest?"#define USE_ALPHATEST":"",h.alphaHash?"#define USE_ALPHAHASH":"",h.sheen?"#define USE_SHEEN":"",h.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",h.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",h.transmission?"#define USE_TRANSMISSION":"",h.transmissionMap?"#define USE_TRANSMISSIONMAP":"",h.thicknessMap?"#define USE_THICKNESSMAP":"",h.vertexTangents&&h.flatShading===!1?"#define USE_TANGENT":"",h.vertexColors||h.instancingColor||h.batchingColor?"#define USE_COLOR":"",h.vertexAlphas?"#define USE_COLOR_ALPHA":"",h.vertexUv1s?"#define USE_UV1":"",h.vertexUv2s?"#define USE_UV2":"",h.vertexUv3s?"#define USE_UV3":"",h.pointsUvs?"#define USE_POINTS_UV":"",h.gradientMap?"#define USE_GRADIENTMAP":"",h.flatShading?"#define FLAT_SHADED":"",h.doubleSided?"#define DOUBLE_SIDED":"",h.flipSided?"#define FLIP_SIDED":"",h.shadowMapEnabled?"#define USE_SHADOWMAP":"",h.shadowMapEnabled?"#define "+j:"",h.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",h.numLightProbes>0?"#define USE_LIGHT_PROBES":"",h.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",h.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",h.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",h.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",h.toneMapping!==Vn?"#define TONE_MAPPING":"",h.toneMapping!==Vn?Ut.tonemapping_pars_fragment:"",h.toneMapping!==Vn?Nc("toneMapping",h.toneMapping):"",h.dithering?"#define DITHERING":"",h.opaque?"#define OPAQUE":"",Ut.colorspace_pars_fragment,Fh("linearToOutputTexel",h.outputColorSpace),Nh(),h.useDepthPacking?"#define DEPTH_PACKING "+h.depthPacking:"",`
`].filter(Fr).join(`
`)),N=Oc(N),N=Bc(N,h),N=Do(N,h),R=Oc(R),R=Bc(R,h),R=Do(R,h),N=Il(N),R=Il(R),h.isRawShaderMaterial!==!0&&(ie=`#version 300 es
`,C=[$,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+C,y=["#define varying in",h.glslVersion===Ya?"":"layout(location = 0) out highp vec4 pc_fragColor;",h.glslVersion===Ya?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const J=ie+C+N,k=ie+y+R,ce=Fc(A,A.VERTEX_SHADER,J),ee=Fc(A,A.FRAGMENT_SHADER,k);A.attachShader(se,ce),A.attachShader(se,ee),h.index0AttributeName!==void 0?A.bindAttribLocation(se,0,h.index0AttributeName):h.morphTargets===!0&&A.bindAttribLocation(se,0,"position"),A.linkProgram(se);function te(Z){if(o.debug.checkShaderErrors){const de=A.getProgramInfoLog(se)||"",Ae=A.getShaderInfoLog(ce)||"",Ce=A.getShaderInfoLog(ee)||"",Se=de.trim(),be=Ae.trim(),Le=Ce.trim();let _e=!0,rt=!0;if(A.getProgramParameter(se,A.LINK_STATUS)===!1)if(_e=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(A,se,ce,ee);else{const gt=Cl(A,ce,"vertex"),Ot=Cl(A,ee,"fragment");console.error("THREE.WebGLProgram: Shader Error "+A.getError()+" - VALIDATE_STATUS "+A.getProgramParameter(se,A.VALIDATE_STATUS)+`

Material Name: `+Z.name+`
Material Type: `+Z.type+`

Program Info Log: `+Se+`
`+gt+`
`+Ot)}else Se!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Se):(be===""||Le==="")&&(rt=!1);rt&&(Z.diagnostics={runnable:_e,programLog:Se,vertexShader:{log:be,prefix:C},fragmentShader:{log:Le,prefix:y}})}A.deleteShader(ce),A.deleteShader(ee),ye=new Lo(A,se),L=Va(A,se)}let ye;this.getUniforms=function(){return ye===void 0&&te(this),ye};let L;this.getAttributes=function(){return L===void 0&&te(this),L};let P=h.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=A.getProgramParameter(se,hd)),P},this.destroy=function(){x.releaseStatesOfProgram(this),A.deleteProgram(se),this.program=void 0},this.type=h.shaderType,this.name=h.shaderName,this.id=Dh++,this.cacheKey=f,this.usedTimes=1,this.program=se,this.vertexShader=ce,this.fragmentShader=ee,this}let Br=0;class Dl{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(f){const h=f.vertexShader,x=f.fragmentShader,A=this._getShaderStage(h),b=this._getShaderStage(x),N=this._getShaderCacheForMaterial(f);return N.has(A)===!1&&(N.add(A),A.usedTimes++),N.has(b)===!1&&(N.add(b),b.usedTimes++),this}remove(f){const h=this.materialCache.get(f);for(const x of h)x.usedTimes--,x.usedTimes===0&&this.shaderCache.delete(x.code);return this.materialCache.delete(f),this}getVertexShaderID(f){return this._getShaderStage(f.vertexShader).id}getFragmentShaderID(f){return this._getShaderStage(f.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(f){const h=this.materialCache;let x=h.get(f);return x===void 0&&(x=new Set,h.set(f,x)),x}_getShaderStage(f){const h=this.shaderCache;let x=h.get(f);return x===void 0&&(x=new zc(f),h.set(f,x)),x}}class zc{constructor(f){this.id=Br++,this.code=f,this.usedTimes=0}}function pd(o,f,h,x,A,b,N){const R=new mi,j=new Dl,Y=new Set,ne=[],H=A.logarithmicDepthBuffer,X=A.vertexTextures;let $=A.precision;const ge={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function se(L){return Y.add(L),L===0?"uv":`uv${L}`}function C(L,P,Z,de,Ae){const Ce=de.fog,Se=Ae.geometry,be=L.isMeshStandardMaterial?de.environment:null,Le=(L.isMeshStandardMaterial?h:f).get(L.envMap||be),_e=Le&&Le.mapping===di?Le.image.height:null,rt=ge[L.type];L.precision!==null&&($=A.getMaxPrecision(L.precision),$!==L.precision&&console.warn("THREE.WebGLProgram.getParameters:",L.precision,"not supported, using",$,"instead."));const gt=Se.morphAttributes.position||Se.morphAttributes.normal||Se.morphAttributes.color,Ot=gt!==void 0?gt.length:0;let nn=0;Se.morphAttributes.position!==void 0&&(nn=1),Se.morphAttributes.normal!==void 0&&(nn=2),Se.morphAttributes.color!==void 0&&(nn=3);let On,zn,fn,ve;if(rt){const Jt=wn[rt];On=Jt.vertexShader,zn=Jt.fragmentShader}else On=L.vertexShader,zn=L.fragmentShader,j.update(L),fn=j.getVertexShaderID(L),ve=j.getFragmentShaderID(L);const Ee=o.getRenderTarget(),tt=o.state.buffers.depth.getReversed(),wt=Ae.isInstancedMesh===!0,ut=Ae.isBatchedMesh===!0,Zt=!!L.map,Kn=!!L.matcap,O=!!Le,bn=!!L.aoMap,It=!!L.lightMap,St=!!L.bumpMap,nt=!!L.normalMap,_n=!!L.displacementMap,it=!!L.emissiveMap,Ft=!!L.metalnessMap,ii=!!L.roughnessMap,Cn=L.anisotropy>0,I=L.clearcoat>0,M=L.dispersion>0,K=L.iridescence>0,fe=L.sheen>0,Te=L.transmission>0,pe=Cn&&!!L.anisotropyMap,ct=I&&!!L.clearcoatMap,Oe=I&&!!L.clearcoatNormalMap,st=I&&!!L.clearcoatRoughnessMap,at=K&&!!L.iridescenceMap,Ue=K&&!!L.iridescenceThicknessMap,Xe=fe&&!!L.sheenColorMap,bt=fe&&!!L.sheenRoughnessMap,ot=!!L.specularMap,He=!!L.specularColorMap,zt=!!L.specularIntensityMap,G=Te&&!!L.transmissionMap,Fe=Te&&!!L.thicknessMap,Ge=!!L.gradientMap,Ze=!!L.alphaMap,De=L.alphaTest>0,he=!!L.alphaHash,Je=!!L.extensions;let Pt=Vn;L.toneMapped&&(Ee===null||Ee.isXRRenderTarget===!0)&&(Pt=o.toneMapping);const on={shaderID:rt,shaderType:L.type,shaderName:L.name,vertexShader:On,fragmentShader:zn,defines:L.defines,customVertexShaderID:fn,customFragmentShaderID:ve,isRawShaderMaterial:L.isRawShaderMaterial===!0,glslVersion:L.glslVersion,precision:$,batching:ut,batchingColor:ut&&Ae._colorsTexture!==null,instancing:wt,instancingColor:wt&&Ae.instanceColor!==null,instancingMorph:wt&&Ae.morphTexture!==null,supportsVertexTextures:X,outputColorSpace:Ee===null?o.outputColorSpace:Ee.isXRRenderTarget===!0?Ee.texture.colorSpace:dn,alphaToCoverage:!!L.alphaToCoverage,map:Zt,matcap:Kn,envMap:O,envMapMode:O&&Le.mapping,envMapCubeUVHeight:_e,aoMap:bn,lightMap:It,bumpMap:St,normalMap:nt,displacementMap:X&&_n,emissiveMap:it,normalMapObjectSpace:nt&&L.normalMapType===wr,normalMapTangentSpace:nt&&L.normalMapType===Ai,metalnessMap:Ft,roughnessMap:ii,anisotropy:Cn,anisotropyMap:pe,clearcoat:I,clearcoatMap:ct,clearcoatNormalMap:Oe,clearcoatRoughnessMap:st,dispersion:M,iridescence:K,iridescenceMap:at,iridescenceThicknessMap:Ue,sheen:fe,sheenColorMap:Xe,sheenRoughnessMap:bt,specularMap:ot,specularColorMap:He,specularIntensityMap:zt,transmission:Te,transmissionMap:G,thicknessMap:Fe,gradientMap:Ge,opaque:L.transparent===!1&&L.blending===Qi&&L.alphaToCoverage===!1,alphaMap:Ze,alphaTest:De,alphaHash:he,combine:L.combine,mapUv:Zt&&se(L.map.channel),aoMapUv:bn&&se(L.aoMap.channel),lightMapUv:It&&se(L.lightMap.channel),bumpMapUv:St&&se(L.bumpMap.channel),normalMapUv:nt&&se(L.normalMap.channel),displacementMapUv:_n&&se(L.displacementMap.channel),emissiveMapUv:it&&se(L.emissiveMap.channel),metalnessMapUv:Ft&&se(L.metalnessMap.channel),roughnessMapUv:ii&&se(L.roughnessMap.channel),anisotropyMapUv:pe&&se(L.anisotropyMap.channel),clearcoatMapUv:ct&&se(L.clearcoatMap.channel),clearcoatNormalMapUv:Oe&&se(L.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&se(L.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&se(L.iridescenceMap.channel),iridescenceThicknessMapUv:Ue&&se(L.iridescenceThicknessMap.channel),sheenColorMapUv:Xe&&se(L.sheenColorMap.channel),sheenRoughnessMapUv:bt&&se(L.sheenRoughnessMap.channel),specularMapUv:ot&&se(L.specularMap.channel),specularColorMapUv:He&&se(L.specularColorMap.channel),specularIntensityMapUv:zt&&se(L.specularIntensityMap.channel),transmissionMapUv:G&&se(L.transmissionMap.channel),thicknessMapUv:Fe&&se(L.thicknessMap.channel),alphaMapUv:Ze&&se(L.alphaMap.channel),vertexTangents:!!Se.attributes.tangent&&(nt||Cn),vertexColors:L.vertexColors,vertexAlphas:L.vertexColors===!0&&!!Se.attributes.color&&Se.attributes.color.itemSize===4,pointsUvs:Ae.isPoints===!0&&!!Se.attributes.uv&&(Zt||Ze),fog:!!Ce,useFog:L.fog===!0,fogExp2:!!Ce&&Ce.isFogExp2,flatShading:L.flatShading===!0&&L.wireframe===!1,sizeAttenuation:L.sizeAttenuation===!0,logarithmicDepthBuffer:H,reversedDepthBuffer:tt,skinning:Ae.isSkinnedMesh===!0,morphTargets:Se.morphAttributes.position!==void 0,morphNormals:Se.morphAttributes.normal!==void 0,morphColors:Se.morphAttributes.color!==void 0,morphTargetsCount:Ot,morphTextureStride:nn,numDirLights:P.directional.length,numPointLights:P.point.length,numSpotLights:P.spot.length,numSpotLightMaps:P.spotLightMap.length,numRectAreaLights:P.rectArea.length,numHemiLights:P.hemi.length,numDirLightShadows:P.directionalShadowMap.length,numPointLightShadows:P.pointShadowMap.length,numSpotLightShadows:P.spotShadowMap.length,numSpotLightShadowsWithMaps:P.numSpotLightShadowsWithMaps,numLightProbes:P.numLightProbes,numClippingPlanes:N.numPlanes,numClipIntersection:N.numIntersection,dithering:L.dithering,shadowMapEnabled:o.shadowMap.enabled&&Z.length>0,shadowMapType:o.shadowMap.type,toneMapping:Pt,decodeVideoTexture:Zt&&L.map.isVideoTexture===!0&&we.getTransfer(L.map.colorSpace)===$e,decodeVideoTextureEmissive:it&&L.emissiveMap.isVideoTexture===!0&&we.getTransfer(L.emissiveMap.colorSpace)===$e,premultipliedAlpha:L.premultipliedAlpha,doubleSided:L.side===Ki,flipSided:L.side===Mn,useDepthPacking:L.depthPacking>=0,depthPacking:L.depthPacking||0,index0AttributeName:L.index0AttributeName,extensionClipCullDistance:Je&&L.extensions.clipCullDistance===!0&&x.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&L.extensions.multiDraw===!0||ut)&&x.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:x.has("KHR_parallel_shader_compile"),customProgramCacheKey:L.customProgramCacheKey()};return on.vertexUv1s=Y.has(1),on.vertexUv2s=Y.has(2),on.vertexUv3s=Y.has(3),Y.clear(),on}function y(L){const P=[];if(L.shaderID?P.push(L.shaderID):(P.push(L.customVertexShaderID),P.push(L.customFragmentShaderID)),L.defines!==void 0)for(const Z in L.defines)P.push(Z),P.push(L.defines[Z]);return L.isRawShaderMaterial===!1&&(ie(P,L),J(P,L),P.push(o.outputColorSpace)),P.push(L.customProgramCacheKey),P.join()}function ie(L,P){L.push(P.precision),L.push(P.outputColorSpace),L.push(P.envMapMode),L.push(P.envMapCubeUVHeight),L.push(P.mapUv),L.push(P.alphaMapUv),L.push(P.lightMapUv),L.push(P.aoMapUv),L.push(P.bumpMapUv),L.push(P.normalMapUv),L.push(P.displacementMapUv),L.push(P.emissiveMapUv),L.push(P.metalnessMapUv),L.push(P.roughnessMapUv),L.push(P.anisotropyMapUv),L.push(P.clearcoatMapUv),L.push(P.clearcoatNormalMapUv),L.push(P.clearcoatRoughnessMapUv),L.push(P.iridescenceMapUv),L.push(P.iridescenceThicknessMapUv),L.push(P.sheenColorMapUv),L.push(P.sheenRoughnessMapUv),L.push(P.specularMapUv),L.push(P.specularColorMapUv),L.push(P.specularIntensityMapUv),L.push(P.transmissionMapUv),L.push(P.thicknessMapUv),L.push(P.combine),L.push(P.fogExp2),L.push(P.sizeAttenuation),L.push(P.morphTargetsCount),L.push(P.morphAttributeCount),L.push(P.numDirLights),L.push(P.numPointLights),L.push(P.numSpotLights),L.push(P.numSpotLightMaps),L.push(P.numHemiLights),L.push(P.numRectAreaLights),L.push(P.numDirLightShadows),L.push(P.numPointLightShadows),L.push(P.numSpotLightShadows),L.push(P.numSpotLightShadowsWithMaps),L.push(P.numLightProbes),L.push(P.shadowMapType),L.push(P.toneMapping),L.push(P.numClippingPlanes),L.push(P.numClipIntersection),L.push(P.depthPacking)}function J(L,P){R.disableAll(),P.supportsVertexTextures&&R.enable(0),P.instancing&&R.enable(1),P.instancingColor&&R.enable(2),P.instancingMorph&&R.enable(3),P.matcap&&R.enable(4),P.envMap&&R.enable(5),P.normalMapObjectSpace&&R.enable(6),P.normalMapTangentSpace&&R.enable(7),P.clearcoat&&R.enable(8),P.iridescence&&R.enable(9),P.alphaTest&&R.enable(10),P.vertexColors&&R.enable(11),P.vertexAlphas&&R.enable(12),P.vertexUv1s&&R.enable(13),P.vertexUv2s&&R.enable(14),P.vertexUv3s&&R.enable(15),P.vertexTangents&&R.enable(16),P.anisotropy&&R.enable(17),P.alphaHash&&R.enable(18),P.batching&&R.enable(19),P.dispersion&&R.enable(20),P.batchingColor&&R.enable(21),P.gradientMap&&R.enable(22),L.push(R.mask),R.disableAll(),P.fog&&R.enable(0),P.useFog&&R.enable(1),P.flatShading&&R.enable(2),P.logarithmicDepthBuffer&&R.enable(3),P.reversedDepthBuffer&&R.enable(4),P.skinning&&R.enable(5),P.morphTargets&&R.enable(6),P.morphNormals&&R.enable(7),P.morphColors&&R.enable(8),P.premultipliedAlpha&&R.enable(9),P.shadowMapEnabled&&R.enable(10),P.doubleSided&&R.enable(11),P.flipSided&&R.enable(12),P.useDepthPacking&&R.enable(13),P.dithering&&R.enable(14),P.transmission&&R.enable(15),P.sheen&&R.enable(16),P.opaque&&R.enable(17),P.pointsUvs&&R.enable(18),P.decodeVideoTexture&&R.enable(19),P.decodeVideoTextureEmissive&&R.enable(20),P.alphaToCoverage&&R.enable(21),L.push(R.mask)}function k(L){const P=ge[L.type];let Z;if(P){const de=wn[P];Z=Ji.clone(de.uniforms)}else Z=L.uniforms;return Z}function ce(L,P){let Z;for(let de=0,Ae=ne.length;de<Ae;de++){const Ce=ne[de];if(Ce.cacheKey===P){Z=Ce,++Z.usedTimes;break}}return Z===void 0&&(Z=new Nr(o,P,L,b),ne.push(Z)),Z}function ee(L){if(--L.usedTimes===0){const P=ne.indexOf(L);ne[P]=ne[ne.length-1],ne.pop(),L.destroy()}}function te(L){j.remove(L)}function ye(){j.dispose()}return{getParameters:C,getProgramCacheKey:y,getUniforms:k,acquireProgram:ce,releaseProgram:ee,releaseShaderCache:te,programs:ne,dispose:ye}}function md(){let o=new WeakMap;function f(N){return o.has(N)}function h(N){let R=o.get(N);return R===void 0&&(R={},o.set(N,R)),R}function x(N){o.delete(N)}function A(N,R,j){o.get(N)[R]=j}function b(){o=new WeakMap}return{has:f,get:h,remove:x,update:A,dispose:b}}function gd(o,f){return o.groupOrder!==f.groupOrder?o.groupOrder-f.groupOrder:o.renderOrder!==f.renderOrder?o.renderOrder-f.renderOrder:o.material.id!==f.material.id?o.material.id-f.material.id:o.z!==f.z?o.z-f.z:o.id-f.id}function Pi(o,f){return o.groupOrder!==f.groupOrder?o.groupOrder-f.groupOrder:o.renderOrder!==f.renderOrder?o.renderOrder-f.renderOrder:o.z!==f.z?f.z-o.z:o.id-f.id}function Gh(){const o=[];let f=0;const h=[],x=[],A=[];function b(){f=0,h.length=0,x.length=0,A.length=0}function N(H,X,$,ge,se,C){let y=o[f];return y===void 0?(y={id:H.id,object:H,geometry:X,material:$,groupOrder:ge,renderOrder:H.renderOrder,z:se,group:C},o[f]=y):(y.id=H.id,y.object=H,y.geometry=X,y.material=$,y.groupOrder=ge,y.renderOrder=H.renderOrder,y.z=se,y.group=C),f++,y}function R(H,X,$,ge,se,C){const y=N(H,X,$,ge,se,C);$.transmission>0?x.push(y):$.transparent===!0?A.push(y):h.push(y)}function j(H,X,$,ge,se,C){const y=N(H,X,$,ge,se,C);$.transmission>0?x.unshift(y):$.transparent===!0?A.unshift(y):h.unshift(y)}function Y(H,X){h.length>1&&h.sort(H||gd),x.length>1&&x.sort(X||Pi),A.length>1&&A.sort(X||Pi)}function ne(){for(let H=f,X=o.length;H<X;H++){const $=o[H];if($.id===null)break;$.id=null,$.object=null,$.geometry=null,$.material=null,$.group=null}}return{opaque:h,transmissive:x,transparent:A,init:b,push:R,unshift:j,finish:ne,sort:Y}}function kh(){let o=new WeakMap;function f(x,A){const b=o.get(x);let N;return b===void 0?(N=new Gh,o.set(x,[N])):A>=b.length?(N=new Gh,b.push(N)):N=b[A],N}function h(){o=new WeakMap}return{get:f,dispose:h}}function _d(){const o={};return{get:function(f){if(o[f.id]!==void 0)return o[f.id];let h;switch(f.type){case"DirectionalLight":h={direction:new Ct,color:new At};break;case"SpotLight":h={position:new Ct,direction:new Ct,color:new At,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":h={position:new Ct,color:new At,distance:0,decay:0};break;case"HemisphereLight":h={direction:new Ct,skyColor:new At,groundColor:new At};break;case"RectAreaLight":h={color:new At,position:new Ct,halfWidth:new Ct,halfHeight:new Ct};break}return o[f.id]=h,h}}}function Ul(){const o={};return{get:function(f){if(o[f.id]!==void 0)return o[f.id];let h;switch(f.type){case"DirectionalLight":h={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":h={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":h={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[f.id]=h,h}}}let Qs=0;function No(o,f){return(f.castShadow?2:0)-(o.castShadow?2:0)+(f.map?1:0)-(o.map?1:0)}function Vh(o){const f=new _d,h=Ul(),x={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let Y=0;Y<9;Y++)x.probe.push(new Ct);const A=new Ct,b=new qe,N=new qe;function R(Y){let ne=0,H=0,X=0;for(let L=0;L<9;L++)x.probe[L].set(0,0,0);let $=0,ge=0,se=0,C=0,y=0,ie=0,J=0,k=0,ce=0,ee=0,te=0;Y.sort(No);for(let L=0,P=Y.length;L<P;L++){const Z=Y[L],de=Z.color,Ae=Z.intensity,Ce=Z.distance,Se=Z.shadow&&Z.shadow.map?Z.shadow.map.texture:null;if(Z.isAmbientLight)ne+=de.r*Ae,H+=de.g*Ae,X+=de.b*Ae;else if(Z.isLightProbe){for(let be=0;be<9;be++)x.probe[be].addScaledVector(Z.sh.coefficients[be],Ae);te++}else if(Z.isDirectionalLight){const be=f.get(Z);if(be.color.copy(Z.color).multiplyScalar(Z.intensity),Z.castShadow){const Le=Z.shadow,_e=h.get(Z);_e.shadowIntensity=Le.intensity,_e.shadowBias=Le.bias,_e.shadowNormalBias=Le.normalBias,_e.shadowRadius=Le.radius,_e.shadowMapSize=Le.mapSize,x.directionalShadow[$]=_e,x.directionalShadowMap[$]=Se,x.directionalShadowMatrix[$]=Z.shadow.matrix,ie++}x.directional[$]=be,$++}else if(Z.isSpotLight){const be=f.get(Z);be.position.setFromMatrixPosition(Z.matrixWorld),be.color.copy(de).multiplyScalar(Ae),be.distance=Ce,be.coneCos=Math.cos(Z.angle),be.penumbraCos=Math.cos(Z.angle*(1-Z.penumbra)),be.decay=Z.decay,x.spot[se]=be;const Le=Z.shadow;if(Z.map&&(x.spotLightMap[ce]=Z.map,ce++,Le.updateMatrices(Z),Z.castShadow&&ee++),x.spotLightMatrix[se]=Le.matrix,Z.castShadow){const _e=h.get(Z);_e.shadowIntensity=Le.intensity,_e.shadowBias=Le.bias,_e.shadowNormalBias=Le.normalBias,_e.shadowRadius=Le.radius,_e.shadowMapSize=Le.mapSize,x.spotShadow[se]=_e,x.spotShadowMap[se]=Se,k++}se++}else if(Z.isRectAreaLight){const be=f.get(Z);be.color.copy(de).multiplyScalar(Ae),be.halfWidth.set(Z.width*.5,0,0),be.halfHeight.set(0,Z.height*.5,0),x.rectArea[C]=be,C++}else if(Z.isPointLight){const be=f.get(Z);if(be.color.copy(Z.color).multiplyScalar(Z.intensity),be.distance=Z.distance,be.decay=Z.decay,Z.castShadow){const Le=Z.shadow,_e=h.get(Z);_e.shadowIntensity=Le.intensity,_e.shadowBias=Le.bias,_e.shadowNormalBias=Le.normalBias,_e.shadowRadius=Le.radius,_e.shadowMapSize=Le.mapSize,_e.shadowCameraNear=Le.camera.near,_e.shadowCameraFar=Le.camera.far,x.pointShadow[ge]=_e,x.pointShadowMap[ge]=Se,x.pointShadowMatrix[ge]=Z.shadow.matrix,J++}x.point[ge]=be,ge++}else if(Z.isHemisphereLight){const be=f.get(Z);be.skyColor.copy(Z.color).multiplyScalar(Ae),be.groundColor.copy(Z.groundColor).multiplyScalar(Ae),x.hemi[y]=be,y++}}C>0&&(o.has("OES_texture_float_linear")===!0?(x.rectAreaLTC1=ke.LTC_FLOAT_1,x.rectAreaLTC2=ke.LTC_FLOAT_2):(x.rectAreaLTC1=ke.LTC_HALF_1,x.rectAreaLTC2=ke.LTC_HALF_2)),x.ambient[0]=ne,x.ambient[1]=H,x.ambient[2]=X;const ye=x.hash;(ye.directionalLength!==$||ye.pointLength!==ge||ye.spotLength!==se||ye.rectAreaLength!==C||ye.hemiLength!==y||ye.numDirectionalShadows!==ie||ye.numPointShadows!==J||ye.numSpotShadows!==k||ye.numSpotMaps!==ce||ye.numLightProbes!==te)&&(x.directional.length=$,x.spot.length=se,x.rectArea.length=C,x.point.length=ge,x.hemi.length=y,x.directionalShadow.length=ie,x.directionalShadowMap.length=ie,x.pointShadow.length=J,x.pointShadowMap.length=J,x.spotShadow.length=k,x.spotShadowMap.length=k,x.directionalShadowMatrix.length=ie,x.pointShadowMatrix.length=J,x.spotLightMatrix.length=k+ce-ee,x.spotLightMap.length=ce,x.numSpotLightShadowsWithMaps=ee,x.numLightProbes=te,ye.directionalLength=$,ye.pointLength=ge,ye.spotLength=se,ye.rectAreaLength=C,ye.hemiLength=y,ye.numDirectionalShadows=ie,ye.numPointShadows=J,ye.numSpotShadows=k,ye.numSpotMaps=ce,ye.numLightProbes=te,x.version=Qs++)}function j(Y,ne){let H=0,X=0,$=0,ge=0,se=0;const C=ne.matrixWorldInverse;for(let y=0,ie=Y.length;y<ie;y++){const J=Y[y];if(J.isDirectionalLight){const k=x.directional[H];k.direction.setFromMatrixPosition(J.matrixWorld),A.setFromMatrixPosition(J.target.matrixWorld),k.direction.sub(A),k.direction.transformDirection(C),H++}else if(J.isSpotLight){const k=x.spot[$];k.position.setFromMatrixPosition(J.matrixWorld),k.position.applyMatrix4(C),k.direction.setFromMatrixPosition(J.matrixWorld),A.setFromMatrixPosition(J.target.matrixWorld),k.direction.sub(A),k.direction.transformDirection(C),$++}else if(J.isRectAreaLight){const k=x.rectArea[ge];k.position.setFromMatrixPosition(J.matrixWorld),k.position.applyMatrix4(C),N.identity(),b.copy(J.matrixWorld),b.premultiply(C),N.extractRotation(b),k.halfWidth.set(J.width*.5,0,0),k.halfHeight.set(0,J.height*.5,0),k.halfWidth.applyMatrix4(N),k.halfHeight.applyMatrix4(N),ge++}else if(J.isPointLight){const k=x.point[X];k.position.setFromMatrixPosition(J.matrixWorld),k.position.applyMatrix4(C),X++}else if(J.isHemisphereLight){const k=x.hemi[se];k.direction.setFromMatrixPosition(J.matrixWorld),k.direction.transformDirection(C),se++}}}return{setup:R,setupView:j,state:x}}function Hh(o){const f=new Vh(o),h=[],x=[];function A(ne){Y.camera=ne,h.length=0,x.length=0}function b(ne){h.push(ne)}function N(ne){x.push(ne)}function R(){f.setup(h)}function j(ne){f.setupView(h,ne)}const Y={lightsArray:h,shadowsArray:x,camera:null,lights:f,transmissionRenderTarget:{}};return{init:A,state:Y,setupLights:R,setupLightsView:j,pushLight:b,pushShadow:N}}function Gc(o){let f=new WeakMap;function h(A,b=0){const N=f.get(A);let R;return N===void 0?(R=new Hh(o),f.set(A,[R])):b>=N.length?(R=new Hh(o),N.push(R)):R=N[b],R}function x(){f=new WeakMap}return{get:h,dispose:x}}const Si=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fl=`uniform sampler2D shadow_pass;
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
}`;function xd(o,f,h){let x=new Is;const A=new $t,b=new $t,N=new Hn,R=new el({depthPacking:Cr}),j=new Bi,Y={},ne=h.maxTextureSize,H={[Yt]:Mn,[Mn]:Yt,[Ki]:Ki},X=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:Si,fragmentShader:Fl}),$=X.clone();$.defines.HORIZONTAL_PASS=1;const ge=new Ui;ge.setAttribute("position",new fi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const se=new vn(ge,X),C=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oa;let y=this.type;this.render=function(ee,te,ye){if(C.enabled===!1||C.autoUpdate===!1&&C.needsUpdate===!1||ee.length===0)return;const L=o.getRenderTarget(),P=o.getActiveCubeFace(),Z=o.getActiveMipmapLevel(),de=o.state;de.setBlending(Zi),de.buffers.depth.getReversed()===!0?de.buffers.color.setClear(0,0,0,0):de.buffers.color.setClear(1,1,1,1),de.buffers.depth.setTest(!0),de.setScissorTest(!1);const Ae=y!==$i&&this.type===$i,Ce=y===$i&&this.type!==$i;for(let Se=0,be=ee.length;Se<be;Se++){const Le=ee[Se],_e=Le.shadow;if(_e===void 0){console.warn("THREE.WebGLShadowMap:",Le,"has no shadow.");continue}if(_e.autoUpdate===!1&&_e.needsUpdate===!1)continue;A.copy(_e.mapSize);const rt=_e.getFrameExtents();if(A.multiply(rt),b.copy(_e.mapSize),(A.x>ne||A.y>ne)&&(A.x>ne&&(b.x=Math.floor(ne/rt.x),A.x=b.x*rt.x,_e.mapSize.x=b.x),A.y>ne&&(b.y=Math.floor(ne/rt.y),A.y=b.y*rt.y,_e.mapSize.y=b.y)),_e.map===null||Ae===!0||Ce===!0){const Ot=this.type!==$i?{minFilter:Wn,magFilter:Wn}:{};_e.map!==null&&_e.map.dispose(),_e.map=new Ti(A.x,A.y,Ot),_e.map.texture.name=Le.name+".shadowMap",_e.camera.updateProjectionMatrix()}o.setRenderTarget(_e.map),o.clear();const gt=_e.getViewportCount();for(let Ot=0;Ot<gt;Ot++){const nn=_e.getViewport(Ot);N.set(b.x*nn.x,b.y*nn.y,b.x*nn.z,b.y*nn.w),de.viewport(N),_e.updateMatrices(Le,Ot),x=_e.getFrustum(),k(te,ye,_e.camera,Le,this.type)}_e.isPointLightShadow!==!0&&this.type===$i&&ie(_e,ye),_e.needsUpdate=!1}y=this.type,C.needsUpdate=!1,o.setRenderTarget(L,P,Z)};function ie(ee,te){const ye=f.update(se);X.defines.VSM_SAMPLES!==ee.blurSamples&&(X.defines.VSM_SAMPLES=ee.blurSamples,$.defines.VSM_SAMPLES=ee.blurSamples,X.needsUpdate=!0,$.needsUpdate=!0),ee.mapPass===null&&(ee.mapPass=new Ti(A.x,A.y)),X.uniforms.shadow_pass.value=ee.map.texture,X.uniforms.resolution.value=ee.mapSize,X.uniforms.radius.value=ee.radius,o.setRenderTarget(ee.mapPass),o.clear(),o.renderBufferDirect(te,null,ye,X,se,null),$.uniforms.shadow_pass.value=ee.mapPass.texture,$.uniforms.resolution.value=ee.mapSize,$.uniforms.radius.value=ee.radius,o.setRenderTarget(ee.map),o.clear(),o.renderBufferDirect(te,null,ye,$,se,null)}function J(ee,te,ye,L){let P=null;const Z=ye.isPointLight===!0?ee.customDistanceMaterial:ee.customDepthMaterial;if(Z!==void 0)P=Z;else if(P=ye.isPointLight===!0?j:R,o.localClippingEnabled&&te.clipShadows===!0&&Array.isArray(te.clippingPlanes)&&te.clippingPlanes.length!==0||te.displacementMap&&te.displacementScale!==0||te.alphaMap&&te.alphaTest>0||te.map&&te.alphaTest>0||te.alphaToCoverage===!0){const de=P.uuid,Ae=te.uuid;let Ce=Y[de];Ce===void 0&&(Ce={},Y[de]=Ce);let Se=Ce[Ae];Se===void 0&&(Se=P.clone(),Ce[Ae]=Se,te.addEventListener("dispose",ce)),P=Se}if(P.visible=te.visible,P.wireframe=te.wireframe,L===$i?P.side=te.shadowSide!==null?te.shadowSide:te.side:P.side=te.shadowSide!==null?te.shadowSide:H[te.side],P.alphaMap=te.alphaMap,P.alphaTest=te.alphaToCoverage===!0?.5:te.alphaTest,P.map=te.map,P.clipShadows=te.clipShadows,P.clippingPlanes=te.clippingPlanes,P.clipIntersection=te.clipIntersection,P.displacementMap=te.displacementMap,P.displacementScale=te.displacementScale,P.displacementBias=te.displacementBias,P.wireframeLinewidth=te.wireframeLinewidth,P.linewidth=te.linewidth,ye.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const de=o.properties.get(P);de.light=ye}return P}function k(ee,te,ye,L,P){if(ee.visible===!1)return;if(ee.layers.test(te.layers)&&(ee.isMesh||ee.isLine||ee.isPoints)&&(ee.castShadow||ee.receiveShadow&&P===$i)&&(!ee.frustumCulled||x.intersectsObject(ee))){ee.modelViewMatrix.multiplyMatrices(ye.matrixWorldInverse,ee.matrixWorld);const Ae=f.update(ee),Ce=ee.material;if(Array.isArray(Ce)){const Se=Ae.groups;for(let be=0,Le=Se.length;be<Le;be++){const _e=Se[be],rt=Ce[_e.materialIndex];if(rt&&rt.visible){const gt=J(ee,rt,L,P);ee.onBeforeShadow(o,ee,te,ye,Ae,gt,_e),o.renderBufferDirect(ye,null,Ae,gt,ee,_e),ee.onAfterShadow(o,ee,te,ye,Ae,gt,_e)}}}else if(Ce.visible){const Se=J(ee,Ce,L,P);ee.onBeforeShadow(o,ee,te,ye,Ae,Se,null),o.renderBufferDirect(ye,null,Ae,Se,ee,null),ee.onAfterShadow(o,ee,te,ye,Ae,Se,null)}}const de=ee.children;for(let Ae=0,Ce=de.length;Ae<Ce;Ae++)k(de[Ae],te,ye,L,P)}function ce(ee){ee.target.removeEventListener("dispose",ce);for(const ye in Y){const L=Y[ye],P=ee.target.uuid;P in L&&(L[P].dispose(),delete L[P])}}}const js={[Ds]:qr,[Xn]:pr,[cs]:Oi,[Ps]:Xr,[qr]:Ds,[pr]:Xn,[Oi]:cs,[Xr]:Ps};function Wh(o,f){function h(){let G=!1;const Fe=new Hn;let Ge=null;const Ze=new Hn(0,0,0,0);return{setMask:function(De){Ge!==De&&!G&&(o.colorMask(De,De,De,De),Ge=De)},setLocked:function(De){G=De},setClear:function(De,he,Je,Pt,on){on===!0&&(De*=Pt,he*=Pt,Je*=Pt),Fe.set(De,he,Je,Pt),Ze.equals(Fe)===!1&&(o.clearColor(De,he,Je,Pt),Ze.copy(Fe))},reset:function(){G=!1,Ge=null,Ze.set(-1,0,0,0)}}}function x(){let G=!1,Fe=!1,Ge=null,Ze=null,De=null;return{setReversed:function(he){if(Fe!==he){const Je=f.get("EXT_clip_control");he?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Fe=he;const Pt=De;De=null,this.setClear(Pt)}},getReversed:function(){return Fe},setTest:function(he){he?Ee(o.DEPTH_TEST):tt(o.DEPTH_TEST)},setMask:function(he){Ge!==he&&!G&&(o.depthMask(he),Ge=he)},setFunc:function(he){if(Fe&&(he=js[he]),Ze!==he){switch(he){case Ds:o.depthFunc(o.NEVER);break;case qr:o.depthFunc(o.ALWAYS);break;case Xn:o.depthFunc(o.LESS);break;case Ps:o.depthFunc(o.LEQUAL);break;case cs:o.depthFunc(o.EQUAL);break;case Xr:o.depthFunc(o.GEQUAL);break;case pr:o.depthFunc(o.GREATER);break;case Oi:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Ze=he}},setLocked:function(he){G=he},setClear:function(he){De!==he&&(Fe&&(he=1-he),o.clearDepth(he),De=he)},reset:function(){G=!1,Ge=null,Ze=null,De=null,Fe=!1}}}function A(){let G=!1,Fe=null,Ge=null,Ze=null,De=null,he=null,Je=null,Pt=null,on=null;return{setTest:function(Jt){G||(Jt?Ee(o.STENCIL_TEST):tt(o.STENCIL_TEST))},setMask:function(Jt){Fe!==Jt&&!G&&(o.stencilMask(Jt),Fe=Jt)},setFunc:function(Jt,is,Wi){(Ge!==Jt||Ze!==is||De!==Wi)&&(o.stencilFunc(Jt,is,Wi),Ge=Jt,Ze=is,De=Wi)},setOp:function(Jt,is,Wi){(he!==Jt||Je!==is||Pt!==Wi)&&(o.stencilOp(Jt,is,Wi),he=Jt,Je=is,Pt=Wi)},setLocked:function(Jt){G=Jt},setClear:function(Jt){on!==Jt&&(o.clearStencil(Jt),on=Jt)},reset:function(){G=!1,Fe=null,Ge=null,Ze=null,De=null,he=null,Je=null,Pt=null,on=null}}}const b=new h,N=new x,R=new A,j=new WeakMap,Y=new WeakMap;let ne={},H={},X=new WeakMap,$=[],ge=null,se=!1,C=null,y=null,ie=null,J=null,k=null,ce=null,ee=null,te=new At(0,0,0),ye=0,L=!1,P=null,Z=null,de=null,Ae=null,Ce=null;const Se=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let be=!1,Le=0;const _e=o.getParameter(o.VERSION);_e.indexOf("WebGL")!==-1?(Le=parseFloat(/^WebGL (\d)/.exec(_e)[1]),be=Le>=1):_e.indexOf("OpenGL ES")!==-1&&(Le=parseFloat(/^OpenGL ES (\d)/.exec(_e)[1]),be=Le>=2);let rt=null,gt={};const Ot=o.getParameter(o.SCISSOR_BOX),nn=o.getParameter(o.VIEWPORT),On=new Hn().fromArray(Ot),zn=new Hn().fromArray(nn);function fn(G,Fe,Ge,Ze){const De=new Uint8Array(4),he=o.createTexture();o.bindTexture(G,he),o.texParameteri(G,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(G,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let Je=0;Je<Ge;Je++)G===o.TEXTURE_3D||G===o.TEXTURE_2D_ARRAY?o.texImage3D(Fe,0,o.RGBA,1,1,Ze,0,o.RGBA,o.UNSIGNED_BYTE,De):o.texImage2D(Fe+Je,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,De);return he}const ve={};ve[o.TEXTURE_2D]=fn(o.TEXTURE_2D,o.TEXTURE_2D,1),ve[o.TEXTURE_CUBE_MAP]=fn(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),ve[o.TEXTURE_2D_ARRAY]=fn(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),ve[o.TEXTURE_3D]=fn(o.TEXTURE_3D,o.TEXTURE_3D,1,1),b.setClear(0,0,0,1),N.setClear(1),R.setClear(0),Ee(o.DEPTH_TEST),N.setFunc(Ps),St(!1),nt(fa),Ee(o.CULL_FACE),bn(Zi);function Ee(G){ne[G]!==!0&&(o.enable(G),ne[G]=!0)}function tt(G){ne[G]!==!1&&(o.disable(G),ne[G]=!1)}function wt(G,Fe){return H[G]!==Fe?(o.bindFramebuffer(G,Fe),H[G]=Fe,G===o.DRAW_FRAMEBUFFER&&(H[o.FRAMEBUFFER]=Fe),G===o.FRAMEBUFFER&&(H[o.DRAW_FRAMEBUFFER]=Fe),!0):!1}function ut(G,Fe){let Ge=$,Ze=!1;if(G){Ge=X.get(Fe),Ge===void 0&&(Ge=[],X.set(Fe,Ge));const De=G.textures;if(Ge.length!==De.length||Ge[0]!==o.COLOR_ATTACHMENT0){for(let he=0,Je=De.length;he<Je;he++)Ge[he]=o.COLOR_ATTACHMENT0+he;Ge.length=De.length,Ze=!0}}else Ge[0]!==o.BACK&&(Ge[0]=o.BACK,Ze=!0);Ze&&o.drawBuffers(Ge)}function Zt(G){return ge!==G?(o.useProgram(G),ge=G,!0):!1}const Kn={[Ei]:o.FUNC_ADD,[mn]:o.FUNC_SUBTRACT,[Rr]:o.FUNC_REVERSE_SUBTRACT};Kn[eo]=o.MIN,Kn[mr]=o.MAX;const O={[da]:o.ZERO,[Wr]:o.ONE,[ua]:o.SRC_COLOR,[Ka]:o.SRC_ALPHA,[tl]:o.SRC_ALPHA_SATURATE,[ha]:o.DST_COLOR,[fr]:o.DST_ALPHA,[Ja]:o.ONE_MINUS_SRC_COLOR,[lr]:o.ONE_MINUS_SRC_ALPHA,[or]:o.ONE_MINUS_DST_COLOR,[dr]:o.ONE_MINUS_DST_ALPHA,[Ls]:o.CONSTANT_COLOR,[_i]:o.ONE_MINUS_CONSTANT_COLOR,[Ir]:o.CONSTANT_ALPHA,[gi]:o.ONE_MINUS_CONSTANT_ALPHA};function bn(G,Fe,Ge,Ze,De,he,Je,Pt,on,Jt){if(G===Zi){se===!0&&(tt(o.BLEND),se=!1);return}if(se===!1&&(Ee(o.BLEND),se=!0),G!==ja){if(G!==C||Jt!==L){if((y!==Ei||k!==Ei)&&(o.blendEquation(o.FUNC_ADD),y=Ei,k=Ei),Jt)switch(G){case Qi:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case ma:o.blendFunc(o.ONE,o.ONE);break;case Us:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case pa:o.blendFuncSeparate(o.DST_COLOR,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Qi:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case ma:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE,o.ONE,o.ONE);break;case Us:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pa:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}ie=null,J=null,ce=null,ee=null,te.set(0,0,0),ye=0,C=G,L=Jt}return}De=De||Fe,he=he||Ge,Je=Je||Ze,(Fe!==y||De!==k)&&(o.blendEquationSeparate(Kn[Fe],Kn[De]),y=Fe,k=De),(Ge!==ie||Ze!==J||he!==ce||Je!==ee)&&(o.blendFuncSeparate(O[Ge],O[Ze],O[he],O[Je]),ie=Ge,J=Ze,ce=he,ee=Je),(Pt.equals(te)===!1||on!==ye)&&(o.blendColor(Pt.r,Pt.g,Pt.b,on),te.copy(Pt),ye=on),C=G,L=!1}function It(G,Fe){G.side===Ki?tt(o.CULL_FACE):Ee(o.CULL_FACE);let Ge=G.side===Mn;Fe&&(Ge=!Ge),St(Ge),G.blending===Qi&&G.transparent===!1?bn(Zi):bn(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),N.setFunc(G.depthFunc),N.setTest(G.depthTest),N.setMask(G.depthWrite),b.setMask(G.colorWrite);const Ze=G.stencilWrite;R.setTest(Ze),Ze&&(R.setMask(G.stencilWriteMask),R.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),R.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),it(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?Ee(o.SAMPLE_ALPHA_TO_COVERAGE):tt(o.SAMPLE_ALPHA_TO_COVERAGE)}function St(G){P!==G&&(G?o.frontFace(o.CW):o.frontFace(o.CCW),P=G)}function nt(G){G!==nl?(Ee(o.CULL_FACE),G!==Z&&(G===fa?o.cullFace(o.BACK):G===Qa?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):tt(o.CULL_FACE),Z=G}function _n(G){G!==de&&(be&&o.lineWidth(G),de=G)}function it(G,Fe,Ge){G?(Ee(o.POLYGON_OFFSET_FILL),(Ae!==Fe||Ce!==Ge)&&(o.polygonOffset(Fe,Ge),Ae=Fe,Ce=Ge)):tt(o.POLYGON_OFFSET_FILL)}function Ft(G){G?Ee(o.SCISSOR_TEST):tt(o.SCISSOR_TEST)}function ii(G){G===void 0&&(G=o.TEXTURE0+Se-1),rt!==G&&(o.activeTexture(G),rt=G)}function Cn(G,Fe,Ge){Ge===void 0&&(rt===null?Ge=o.TEXTURE0+Se-1:Ge=rt);let Ze=gt[Ge];Ze===void 0&&(Ze={type:void 0,texture:void 0},gt[Ge]=Ze),(Ze.type!==G||Ze.texture!==Fe)&&(rt!==Ge&&(o.activeTexture(Ge),rt=Ge),o.bindTexture(G,Fe||ve[G]),Ze.type=G,Ze.texture=Fe)}function I(){const G=gt[rt];G!==void 0&&G.type!==void 0&&(o.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function M(){try{o.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function K(){try{o.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function fe(){try{o.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Te(){try{o.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function pe(){try{o.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ct(){try{o.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Oe(){try{o.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function st(){try{o.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function at(){try{o.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ue(){try{o.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Xe(G){On.equals(G)===!1&&(o.scissor(G.x,G.y,G.z,G.w),On.copy(G))}function bt(G){zn.equals(G)===!1&&(o.viewport(G.x,G.y,G.z,G.w),zn.copy(G))}function ot(G,Fe){let Ge=Y.get(Fe);Ge===void 0&&(Ge=new WeakMap,Y.set(Fe,Ge));let Ze=Ge.get(G);Ze===void 0&&(Ze=o.getUniformBlockIndex(Fe,G.name),Ge.set(G,Ze))}function He(G,Fe){const Ze=Y.get(Fe).get(G);j.get(Fe)!==Ze&&(o.uniformBlockBinding(Fe,Ze,G.__bindingPointIndex),j.set(Fe,Ze))}function zt(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),N.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),ne={},rt=null,gt={},H={},X=new WeakMap,$=[],ge=null,se=!1,C=null,y=null,ie=null,J=null,k=null,ce=null,ee=null,te=new At(0,0,0),ye=0,L=!1,P=null,Z=null,de=null,Ae=null,Ce=null,On.set(0,0,o.canvas.width,o.canvas.height),zn.set(0,0,o.canvas.width,o.canvas.height),b.reset(),N.reset(),R.reset()}return{buffers:{color:b,depth:N,stencil:R},enable:Ee,disable:tt,bindFramebuffer:wt,drawBuffers:ut,useProgram:Zt,setBlending:bn,setMaterial:It,setFlipSided:St,setCullFace:nt,setLineWidth:_n,setPolygonOffset:it,setScissorTest:Ft,activeTexture:ii,bindTexture:Cn,unbindTexture:I,compressedTexImage2D:M,compressedTexImage3D:K,texImage2D:at,texImage3D:Ue,updateUBOMapping:ot,uniformBlockBinding:He,texStorage2D:Oe,texStorage3D:st,texSubImage2D:fe,texSubImage3D:Te,compressedTexSubImage2D:pe,compressedTexSubImage3D:ct,scissor:Xe,viewport:bt,reset:zt}}function Li(o,f,h,x,A,b,N){const R=f.has("WEBGL_multisampled_render_to_texture")?f.get("WEBGL_multisampled_render_to_texture"):null,j=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),Y=new $t,ne=new WeakMap;let H;const X=new WeakMap;let $=!1;try{$=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function ge(I,M){return $?new OffscreenCanvas(I,M):Bs("canvas")}function se(I,M,K){let fe=1;const Te=Cn(I);if((Te.width>K||Te.height>K)&&(fe=K/Math.max(Te.width,Te.height)),fe<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const pe=Math.floor(fe*Te.width),ct=Math.floor(fe*Te.height);H===void 0&&(H=ge(pe,ct));const Oe=M?ge(pe,ct):H;return Oe.width=pe,Oe.height=ct,Oe.getContext("2d").drawImage(I,0,0,pe,ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Te.width+"x"+Te.height+") to ("+pe+"x"+ct+")."),Oe}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Te.width+"x"+Te.height+")."),I;return I}function C(I){return I.generateMipmaps}function y(I){o.generateMipmap(I)}function ie(I){return I.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?o.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function J(I,M,K,fe,Te=!1){if(I!==null){if(o[I]!==void 0)return o[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let pe=M;if(M===o.RED&&(K===o.FLOAT&&(pe=o.R32F),K===o.HALF_FLOAT&&(pe=o.R16F),K===o.UNSIGNED_BYTE&&(pe=o.R8)),M===o.RED_INTEGER&&(K===o.UNSIGNED_BYTE&&(pe=o.R8UI),K===o.UNSIGNED_SHORT&&(pe=o.R16UI),K===o.UNSIGNED_INT&&(pe=o.R32UI),K===o.BYTE&&(pe=o.R8I),K===o.SHORT&&(pe=o.R16I),K===o.INT&&(pe=o.R32I)),M===o.RG&&(K===o.FLOAT&&(pe=o.RG32F),K===o.HALF_FLOAT&&(pe=o.RG16F),K===o.UNSIGNED_BYTE&&(pe=o.RG8)),M===o.RG_INTEGER&&(K===o.UNSIGNED_BYTE&&(pe=o.RG8UI),K===o.UNSIGNED_SHORT&&(pe=o.RG16UI),K===o.UNSIGNED_INT&&(pe=o.RG32UI),K===o.BYTE&&(pe=o.RG8I),K===o.SHORT&&(pe=o.RG16I),K===o.INT&&(pe=o.RG32I)),M===o.RGB_INTEGER&&(K===o.UNSIGNED_BYTE&&(pe=o.RGB8UI),K===o.UNSIGNED_SHORT&&(pe=o.RGB16UI),K===o.UNSIGNED_INT&&(pe=o.RGB32UI),K===o.BYTE&&(pe=o.RGB8I),K===o.SHORT&&(pe=o.RGB16I),K===o.INT&&(pe=o.RGB32I)),M===o.RGBA_INTEGER&&(K===o.UNSIGNED_BYTE&&(pe=o.RGBA8UI),K===o.UNSIGNED_SHORT&&(pe=o.RGBA16UI),K===o.UNSIGNED_INT&&(pe=o.RGBA32UI),K===o.BYTE&&(pe=o.RGBA8I),K===o.SHORT&&(pe=o.RGBA16I),K===o.INT&&(pe=o.RGBA32I)),M===o.RGB&&(K===o.UNSIGNED_INT_5_9_9_9_REV&&(pe=o.RGB9_E5),K===o.UNSIGNED_INT_10F_11F_11F_REV&&(pe=o.R11F_G11F_B10F)),M===o.RGBA){const ct=Te?ls:we.getTransfer(fe);K===o.FLOAT&&(pe=o.RGBA32F),K===o.HALF_FLOAT&&(pe=o.RGBA16F),K===o.UNSIGNED_BYTE&&(pe=ct===$e?o.SRGB8_ALPHA8:o.RGBA8),K===o.UNSIGNED_SHORT_4_4_4_4&&(pe=o.RGBA4),K===o.UNSIGNED_SHORT_5_5_5_1&&(pe=o.RGB5_A1)}return(pe===o.R16F||pe===o.R32F||pe===o.RG16F||pe===o.RG32F||pe===o.RGBA16F||pe===o.RGBA32F)&&f.get("EXT_color_buffer_float"),pe}function k(I,M){let K;return I?M===null||M===_r||M===Pr?K=o.DEPTH24_STENCIL8:M===dt?K=o.DEPTH32F_STENCIL8:M===Jr&&(K=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===_r||M===Pr?K=o.DEPTH_COMPONENT24:M===dt?K=o.DEPTH_COMPONENT32F:M===Jr&&(K=o.DEPTH_COMPONENT16),K}function ce(I,M){return C(I)===!0||I.isFramebufferTexture&&I.minFilter!==Wn&&I.minFilter!==Fi?Math.log2(Math.max(M.width,M.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?M.mipmaps.length:1}function ee(I){const M=I.target;M.removeEventListener("dispose",ee),ye(M),M.isVideoTexture&&ne.delete(M)}function te(I){const M=I.target;M.removeEventListener("dispose",te),P(M)}function ye(I){const M=x.get(I);if(M.__webglInit===void 0)return;const K=I.source,fe=X.get(K);if(fe){const Te=fe[M.__cacheKey];Te.usedTimes--,Te.usedTimes===0&&L(I),Object.keys(fe).length===0&&X.delete(K)}x.remove(I)}function L(I){const M=x.get(I);o.deleteTexture(M.__webglTexture);const K=I.source,fe=X.get(K);delete fe[M.__cacheKey],N.memory.textures--}function P(I){const M=x.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),x.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let fe=0;fe<6;fe++){if(Array.isArray(M.__webglFramebuffer[fe]))for(let Te=0;Te<M.__webglFramebuffer[fe].length;Te++)o.deleteFramebuffer(M.__webglFramebuffer[fe][Te]);else o.deleteFramebuffer(M.__webglFramebuffer[fe]);M.__webglDepthbuffer&&o.deleteRenderbuffer(M.__webglDepthbuffer[fe])}else{if(Array.isArray(M.__webglFramebuffer))for(let fe=0;fe<M.__webglFramebuffer.length;fe++)o.deleteFramebuffer(M.__webglFramebuffer[fe]);else o.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&o.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&o.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let fe=0;fe<M.__webglColorRenderbuffer.length;fe++)M.__webglColorRenderbuffer[fe]&&o.deleteRenderbuffer(M.__webglColorRenderbuffer[fe]);M.__webglDepthRenderbuffer&&o.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const K=I.textures;for(let fe=0,Te=K.length;fe<Te;fe++){const pe=x.get(K[fe]);pe.__webglTexture&&(o.deleteTexture(pe.__webglTexture),N.memory.textures--),x.remove(K[fe])}x.remove(I)}let Z=0;function de(){Z=0}function Ae(){const I=Z;return I>=A.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+A.maxTextures),Z+=1,I}function Ce(I){const M=[];return M.push(I.wrapS),M.push(I.wrapT),M.push(I.wrapR||0),M.push(I.magFilter),M.push(I.minFilter),M.push(I.anisotropy),M.push(I.internalFormat),M.push(I.format),M.push(I.type),M.push(I.generateMipmaps),M.push(I.premultiplyAlpha),M.push(I.flipY),M.push(I.unpackAlignment),M.push(I.colorSpace),M.join()}function Se(I,M){const K=x.get(I);if(I.isVideoTexture&&Ft(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&K.__version!==I.version){const fe=I.image;if(fe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(fe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ve(K,I,M);return}}else I.isExternalTexture&&(K.__webglTexture=I.sourceTexture?I.sourceTexture:null);h.bindTexture(o.TEXTURE_2D,K.__webglTexture,o.TEXTURE0+M)}function be(I,M){const K=x.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){ve(K,I,M);return}h.bindTexture(o.TEXTURE_2D_ARRAY,K.__webglTexture,o.TEXTURE0+M)}function Le(I,M){const K=x.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){ve(K,I,M);return}h.bindTexture(o.TEXTURE_3D,K.__webglTexture,o.TEXTURE0+M)}function _e(I,M){const K=x.get(I);if(I.version>0&&K.__version!==I.version){Ee(K,I,M);return}h.bindTexture(o.TEXTURE_CUBE_MAP,K.__webglTexture,o.TEXTURE0+M)}const rt={[Zr]:o.REPEAT,[Yr]:o.CLAMP_TO_EDGE,[ga]:o.MIRRORED_REPEAT},gt={[Wn]:o.NEAREST,[Fs]:o.NEAREST_MIPMAP_NEAREST,[us]:o.NEAREST_MIPMAP_LINEAR,[Fi]:o.LINEAR,[hs]:o.LINEAR_MIPMAP_NEAREST,[gr]:o.LINEAR_MIPMAP_LINEAR},Ot={[ro]:o.NEVER,[io]:o.ALWAYS,[Ns]:o.LESS,[pi]:o.LEQUAL,[ds]:o.EQUAL,[no]:o.GEQUAL,[_a]:o.GREATER,[to]:o.NOTEQUAL};function nn(I,M){if(M.type===dt&&f.has("OES_texture_float_linear")===!1&&(M.magFilter===Fi||M.magFilter===hs||M.magFilter===us||M.magFilter===gr||M.minFilter===Fi||M.minFilter===hs||M.minFilter===us||M.minFilter===gr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(I,o.TEXTURE_WRAP_S,rt[M.wrapS]),o.texParameteri(I,o.TEXTURE_WRAP_T,rt[M.wrapT]),(I===o.TEXTURE_3D||I===o.TEXTURE_2D_ARRAY)&&o.texParameteri(I,o.TEXTURE_WRAP_R,rt[M.wrapR]),o.texParameteri(I,o.TEXTURE_MAG_FILTER,gt[M.magFilter]),o.texParameteri(I,o.TEXTURE_MIN_FILTER,gt[M.minFilter]),M.compareFunction&&(o.texParameteri(I,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(I,o.TEXTURE_COMPARE_FUNC,Ot[M.compareFunction])),f.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Wn||M.minFilter!==us&&M.minFilter!==gr||M.type===dt&&f.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||x.get(M).__currentAnisotropy){const K=f.get("EXT_texture_filter_anisotropic");o.texParameterf(I,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,A.getMaxAnisotropy())),x.get(M).__currentAnisotropy=M.anisotropy}}}function On(I,M){let K=!1;I.__webglInit===void 0&&(I.__webglInit=!0,M.addEventListener("dispose",ee));const fe=M.source;let Te=X.get(fe);Te===void 0&&(Te={},X.set(fe,Te));const pe=Ce(M);if(pe!==I.__cacheKey){Te[pe]===void 0&&(Te[pe]={texture:o.createTexture(),usedTimes:0},N.memory.textures++,K=!0),Te[pe].usedTimes++;const ct=Te[I.__cacheKey];ct!==void 0&&(Te[I.__cacheKey].usedTimes--,ct.usedTimes===0&&L(M)),I.__cacheKey=pe,I.__webglTexture=Te[pe].texture}return K}function zn(I,M,K){return Math.floor(Math.floor(I/K)/M)}function fn(I,M,K,fe){const pe=I.updateRanges;if(pe.length===0)h.texSubImage2D(o.TEXTURE_2D,0,0,0,M.width,M.height,K,fe,M.data);else{pe.sort((Ue,Xe)=>Ue.start-Xe.start);let ct=0;for(let Ue=1;Ue<pe.length;Ue++){const Xe=pe[ct],bt=pe[Ue],ot=Xe.start+Xe.count,He=zn(bt.start,M.width,4),zt=zn(Xe.start,M.width,4);bt.start<=ot+1&&He===zt&&zn(bt.start+bt.count-1,M.width,4)===He?Xe.count=Math.max(Xe.count,bt.start+bt.count-Xe.start):(++ct,pe[ct]=bt)}pe.length=ct+1;const Oe=o.getParameter(o.UNPACK_ROW_LENGTH),st=o.getParameter(o.UNPACK_SKIP_PIXELS),at=o.getParameter(o.UNPACK_SKIP_ROWS);o.pixelStorei(o.UNPACK_ROW_LENGTH,M.width);for(let Ue=0,Xe=pe.length;Ue<Xe;Ue++){const bt=pe[Ue],ot=Math.floor(bt.start/4),He=Math.ceil(bt.count/4),zt=ot%M.width,G=Math.floor(ot/M.width),Fe=He,Ge=1;o.pixelStorei(o.UNPACK_SKIP_PIXELS,zt),o.pixelStorei(o.UNPACK_SKIP_ROWS,G),h.texSubImage2D(o.TEXTURE_2D,0,zt,G,Fe,Ge,K,fe,M.data)}I.clearUpdateRanges(),o.pixelStorei(o.UNPACK_ROW_LENGTH,Oe),o.pixelStorei(o.UNPACK_SKIP_PIXELS,st),o.pixelStorei(o.UNPACK_SKIP_ROWS,at)}}function ve(I,M,K){let fe=o.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(fe=o.TEXTURE_2D_ARRAY),M.isData3DTexture&&(fe=o.TEXTURE_3D);const Te=On(I,M),pe=M.source;h.bindTexture(fe,I.__webglTexture,o.TEXTURE0+K);const ct=x.get(pe);if(pe.version!==ct.__version||Te===!0){h.activeTexture(o.TEXTURE0+K);const Oe=we.getPrimaries(we.workingColorSpace),st=M.colorSpace===wi?null:we.getPrimaries(M.colorSpace),at=M.colorSpace===wi||Oe===st?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,M.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,M.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,at);let Ue=se(M.image,!1,A.maxTextureSize);Ue=ii(M,Ue);const Xe=b.convert(M.format,M.colorSpace),bt=b.convert(M.type);let ot=J(M.internalFormat,Xe,bt,M.colorSpace,M.isVideoTexture);nn(fe,M);let He;const zt=M.mipmaps,G=M.isVideoTexture!==!0,Fe=ct.__version===void 0||Te===!0,Ge=pe.dataReady,Ze=ce(M,Ue);if(M.isDepthTexture)ot=k(M.format===oi,M.type),Fe&&(G?h.texStorage2D(o.TEXTURE_2D,1,ot,Ue.width,Ue.height):h.texImage2D(o.TEXTURE_2D,0,ot,Ue.width,Ue.height,0,Xe,bt,null));else if(M.isDataTexture)if(zt.length>0){G&&Fe&&h.texStorage2D(o.TEXTURE_2D,Ze,ot,zt[0].width,zt[0].height);for(let De=0,he=zt.length;De<he;De++)He=zt[De],G?Ge&&h.texSubImage2D(o.TEXTURE_2D,De,0,0,He.width,He.height,Xe,bt,He.data):h.texImage2D(o.TEXTURE_2D,De,ot,He.width,He.height,0,Xe,bt,He.data);M.generateMipmaps=!1}else G?(Fe&&h.texStorage2D(o.TEXTURE_2D,Ze,ot,Ue.width,Ue.height),Ge&&fn(M,Ue,Xe,bt)):h.texImage2D(o.TEXTURE_2D,0,ot,Ue.width,Ue.height,0,Xe,bt,Ue.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){G&&Fe&&h.texStorage3D(o.TEXTURE_2D_ARRAY,Ze,ot,zt[0].width,zt[0].height,Ue.depth);for(let De=0,he=zt.length;De<he;De++)if(He=zt[De],M.format!==Nt)if(Xe!==null)if(G){if(Ge)if(M.layerUpdates.size>0){const Je=fs(He.width,He.height,M.format,M.type);for(const Pt of M.layerUpdates){const on=He.data.subarray(Pt*Je/He.data.BYTES_PER_ELEMENT,(Pt+1)*Je/He.data.BYTES_PER_ELEMENT);h.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,De,0,0,Pt,He.width,He.height,1,Xe,on)}M.clearLayerUpdates()}else h.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,De,0,0,0,He.width,He.height,Ue.depth,Xe,He.data)}else h.compressedTexImage3D(o.TEXTURE_2D_ARRAY,De,ot,He.width,He.height,Ue.depth,0,He.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Ge&&h.texSubImage3D(o.TEXTURE_2D_ARRAY,De,0,0,0,He.width,He.height,Ue.depth,Xe,bt,He.data):h.texImage3D(o.TEXTURE_2D_ARRAY,De,ot,He.width,He.height,Ue.depth,0,Xe,bt,He.data)}else{G&&Fe&&h.texStorage2D(o.TEXTURE_2D,Ze,ot,zt[0].width,zt[0].height);for(let De=0,he=zt.length;De<he;De++)He=zt[De],M.format!==Nt?Xe!==null?G?Ge&&h.compressedTexSubImage2D(o.TEXTURE_2D,De,0,0,He.width,He.height,Xe,He.data):h.compressedTexImage2D(o.TEXTURE_2D,De,ot,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Ge&&h.texSubImage2D(o.TEXTURE_2D,De,0,0,He.width,He.height,Xe,bt,He.data):h.texImage2D(o.TEXTURE_2D,De,ot,He.width,He.height,0,Xe,bt,He.data)}else if(M.isDataArrayTexture)if(G){if(Fe&&h.texStorage3D(o.TEXTURE_2D_ARRAY,Ze,ot,Ue.width,Ue.height,Ue.depth),Ge)if(M.layerUpdates.size>0){const De=fs(Ue.width,Ue.height,M.format,M.type);for(const he of M.layerUpdates){const Je=Ue.data.subarray(he*De/Ue.data.BYTES_PER_ELEMENT,(he+1)*De/Ue.data.BYTES_PER_ELEMENT);h.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,he,Ue.width,Ue.height,1,Xe,bt,Je)}M.clearLayerUpdates()}else h.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Ue.width,Ue.height,Ue.depth,Xe,bt,Ue.data)}else h.texImage3D(o.TEXTURE_2D_ARRAY,0,ot,Ue.width,Ue.height,Ue.depth,0,Xe,bt,Ue.data);else if(M.isData3DTexture)G?(Fe&&h.texStorage3D(o.TEXTURE_3D,Ze,ot,Ue.width,Ue.height,Ue.depth),Ge&&h.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Ue.width,Ue.height,Ue.depth,Xe,bt,Ue.data)):h.texImage3D(o.TEXTURE_3D,0,ot,Ue.width,Ue.height,Ue.depth,0,Xe,bt,Ue.data);else if(M.isFramebufferTexture){if(Fe)if(G)h.texStorage2D(o.TEXTURE_2D,Ze,ot,Ue.width,Ue.height);else{let De=Ue.width,he=Ue.height;for(let Je=0;Je<Ze;Je++)h.texImage2D(o.TEXTURE_2D,Je,ot,De,he,0,Xe,bt,null),De>>=1,he>>=1}}else if(zt.length>0){if(G&&Fe){const De=Cn(zt[0]);h.texStorage2D(o.TEXTURE_2D,Ze,ot,De.width,De.height)}for(let De=0,he=zt.length;De<he;De++)He=zt[De],G?Ge&&h.texSubImage2D(o.TEXTURE_2D,De,0,0,Xe,bt,He):h.texImage2D(o.TEXTURE_2D,De,ot,Xe,bt,He);M.generateMipmaps=!1}else if(G){if(Fe){const De=Cn(Ue);h.texStorage2D(o.TEXTURE_2D,Ze,ot,De.width,De.height)}Ge&&h.texSubImage2D(o.TEXTURE_2D,0,0,0,Xe,bt,Ue)}else h.texImage2D(o.TEXTURE_2D,0,ot,Xe,bt,Ue);C(M)&&y(fe),ct.__version=pe.version,M.onUpdate&&M.onUpdate(M)}I.__version=M.version}function Ee(I,M,K){if(M.image.length!==6)return;const fe=On(I,M),Te=M.source;h.bindTexture(o.TEXTURE_CUBE_MAP,I.__webglTexture,o.TEXTURE0+K);const pe=x.get(Te);if(Te.version!==pe.__version||fe===!0){h.activeTexture(o.TEXTURE0+K);const ct=we.getPrimaries(we.workingColorSpace),Oe=M.colorSpace===wi?null:we.getPrimaries(M.colorSpace),st=M.colorSpace===wi||ct===Oe?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,M.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,M.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);const at=M.isCompressedTexture||M.image[0].isCompressedTexture,Ue=M.image[0]&&M.image[0].isDataTexture,Xe=[];for(let he=0;he<6;he++)!at&&!Ue?Xe[he]=se(M.image[he],!0,A.maxCubemapSize):Xe[he]=Ue?M.image[he].image:M.image[he],Xe[he]=ii(M,Xe[he]);const bt=Xe[0],ot=b.convert(M.format,M.colorSpace),He=b.convert(M.type),zt=J(M.internalFormat,ot,He,M.colorSpace),G=M.isVideoTexture!==!0,Fe=pe.__version===void 0||fe===!0,Ge=Te.dataReady;let Ze=ce(M,bt);nn(o.TEXTURE_CUBE_MAP,M);let De;if(at){G&&Fe&&h.texStorage2D(o.TEXTURE_CUBE_MAP,Ze,zt,bt.width,bt.height);for(let he=0;he<6;he++){De=Xe[he].mipmaps;for(let Je=0;Je<De.length;Je++){const Pt=De[Je];M.format!==Nt?ot!==null?G?Ge&&h.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je,0,0,Pt.width,Pt.height,ot,Pt.data):h.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je,zt,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je,0,0,Pt.width,Pt.height,ot,He,Pt.data):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je,zt,Pt.width,Pt.height,0,ot,He,Pt.data)}}}else{if(De=M.mipmaps,G&&Fe){De.length>0&&Ze++;const he=Cn(Xe[0]);h.texStorage2D(o.TEXTURE_CUBE_MAP,Ze,zt,he.width,he.height)}for(let he=0;he<6;he++)if(Ue){G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Xe[he].width,Xe[he].height,ot,He,Xe[he].data):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,zt,Xe[he].width,Xe[he].height,0,ot,He,Xe[he].data);for(let Je=0;Je<De.length;Je++){const on=De[Je].image[he].image;G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je+1,0,0,on.width,on.height,ot,He,on.data):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je+1,zt,on.width,on.height,0,ot,He,on.data)}}else{G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,ot,He,Xe[he]):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,zt,ot,He,Xe[he]);for(let Je=0;Je<De.length;Je++){const Pt=De[Je];G?Ge&&h.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je+1,0,0,ot,He,Pt.image[he]):h.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+he,Je+1,zt,ot,He,Pt.image[he])}}}C(M)&&y(o.TEXTURE_CUBE_MAP),pe.__version=Te.version,M.onUpdate&&M.onUpdate(M)}I.__version=M.version}function tt(I,M,K,fe,Te,pe){const ct=b.convert(K.format,K.colorSpace),Oe=b.convert(K.type),st=J(K.internalFormat,ct,Oe,K.colorSpace),at=x.get(M),Ue=x.get(K);if(Ue.__renderTarget=M,!at.__hasExternalTextures){const Xe=Math.max(1,M.width>>pe),bt=Math.max(1,M.height>>pe);Te===o.TEXTURE_3D||Te===o.TEXTURE_2D_ARRAY?h.texImage3D(Te,pe,st,Xe,bt,M.depth,0,ct,Oe,null):h.texImage2D(Te,pe,st,Xe,bt,0,ct,Oe,null)}h.bindFramebuffer(o.FRAMEBUFFER,I),it(M)?R.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,fe,Te,Ue.__webglTexture,0,_n(M)):(Te===o.TEXTURE_2D||Te>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Te<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,fe,Te,Ue.__webglTexture,pe),h.bindFramebuffer(o.FRAMEBUFFER,null)}function wt(I,M,K){if(o.bindRenderbuffer(o.RENDERBUFFER,I),M.depthBuffer){const fe=M.depthTexture,Te=fe&&fe.isDepthTexture?fe.type:null,pe=k(M.stencilBuffer,Te),ct=M.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Oe=_n(M);it(M)?R.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Oe,pe,M.width,M.height):K?o.renderbufferStorageMultisample(o.RENDERBUFFER,Oe,pe,M.width,M.height):o.renderbufferStorage(o.RENDERBUFFER,pe,M.width,M.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,ct,o.RENDERBUFFER,I)}else{const fe=M.textures;for(let Te=0;Te<fe.length;Te++){const pe=fe[Te],ct=b.convert(pe.format,pe.colorSpace),Oe=b.convert(pe.type),st=J(pe.internalFormat,ct,Oe,pe.colorSpace),at=_n(M);K&&it(M)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,at,st,M.width,M.height):it(M)?R.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,at,st,M.width,M.height):o.renderbufferStorage(o.RENDERBUFFER,st,M.width,M.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function ut(I,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(h.bindFramebuffer(o.FRAMEBUFFER,I),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const fe=x.get(M.depthTexture);fe.__renderTarget=M,(!fe.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Se(M.depthTexture,0);const Te=fe.__webglTexture,pe=_n(M);if(M.depthTexture.format===$r)it(M)?R.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Te,0,pe):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Te,0);else if(M.depthTexture.format===oi)it(M)?R.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Te,0,pe):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Te,0);else throw new Error("Unknown depthTexture format")}function Zt(I){const M=x.get(I),K=I.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==I.depthTexture){const fe=I.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),fe){const Te=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,fe.removeEventListener("dispose",Te)};fe.addEventListener("dispose",Te),M.__depthDisposeCallback=Te}M.__boundDepthTexture=fe}if(I.depthTexture&&!M.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");const fe=I.texture.mipmaps;fe&&fe.length>0?ut(M.__webglFramebuffer[0],I):ut(M.__webglFramebuffer,I)}else if(K){M.__webglDepthbuffer=[];for(let fe=0;fe<6;fe++)if(h.bindFramebuffer(o.FRAMEBUFFER,M.__webglFramebuffer[fe]),M.__webglDepthbuffer[fe]===void 0)M.__webglDepthbuffer[fe]=o.createRenderbuffer(),wt(M.__webglDepthbuffer[fe],I,!1);else{const Te=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,pe=M.__webglDepthbuffer[fe];o.bindRenderbuffer(o.RENDERBUFFER,pe),o.framebufferRenderbuffer(o.FRAMEBUFFER,Te,o.RENDERBUFFER,pe)}}else{const fe=I.texture.mipmaps;if(fe&&fe.length>0?h.bindFramebuffer(o.FRAMEBUFFER,M.__webglFramebuffer[0]):h.bindFramebuffer(o.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=o.createRenderbuffer(),wt(M.__webglDepthbuffer,I,!1);else{const Te=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,pe=M.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,pe),o.framebufferRenderbuffer(o.FRAMEBUFFER,Te,o.RENDERBUFFER,pe)}}h.bindFramebuffer(o.FRAMEBUFFER,null)}function Kn(I,M,K){const fe=x.get(I);M!==void 0&&tt(fe.__webglFramebuffer,I,I.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),K!==void 0&&Zt(I)}function O(I){const M=I.texture,K=x.get(I),fe=x.get(M);I.addEventListener("dispose",te);const Te=I.textures,pe=I.isWebGLCubeRenderTarget===!0,ct=Te.length>1;if(ct||(fe.__webglTexture===void 0&&(fe.__webglTexture=o.createTexture()),fe.__version=M.version,N.memory.textures++),pe){K.__webglFramebuffer=[];for(let Oe=0;Oe<6;Oe++)if(M.mipmaps&&M.mipmaps.length>0){K.__webglFramebuffer[Oe]=[];for(let st=0;st<M.mipmaps.length;st++)K.__webglFramebuffer[Oe][st]=o.createFramebuffer()}else K.__webglFramebuffer[Oe]=o.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){K.__webglFramebuffer=[];for(let Oe=0;Oe<M.mipmaps.length;Oe++)K.__webglFramebuffer[Oe]=o.createFramebuffer()}else K.__webglFramebuffer=o.createFramebuffer();if(ct)for(let Oe=0,st=Te.length;Oe<st;Oe++){const at=x.get(Te[Oe]);at.__webglTexture===void 0&&(at.__webglTexture=o.createTexture(),N.memory.textures++)}if(I.samples>0&&it(I)===!1){K.__webglMultisampledFramebuffer=o.createFramebuffer(),K.__webglColorRenderbuffer=[],h.bindFramebuffer(o.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let Oe=0;Oe<Te.length;Oe++){const st=Te[Oe];K.__webglColorRenderbuffer[Oe]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,K.__webglColorRenderbuffer[Oe]);const at=b.convert(st.format,st.colorSpace),Ue=b.convert(st.type),Xe=J(st.internalFormat,at,Ue,st.colorSpace,I.isXRRenderTarget===!0),bt=_n(I);o.renderbufferStorageMultisample(o.RENDERBUFFER,bt,Xe,I.width,I.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Oe,o.RENDERBUFFER,K.__webglColorRenderbuffer[Oe])}o.bindRenderbuffer(o.RENDERBUFFER,null),I.depthBuffer&&(K.__webglDepthRenderbuffer=o.createRenderbuffer(),wt(K.__webglDepthRenderbuffer,I,!0)),h.bindFramebuffer(o.FRAMEBUFFER,null)}}if(pe){h.bindTexture(o.TEXTURE_CUBE_MAP,fe.__webglTexture),nn(o.TEXTURE_CUBE_MAP,M);for(let Oe=0;Oe<6;Oe++)if(M.mipmaps&&M.mipmaps.length>0)for(let st=0;st<M.mipmaps.length;st++)tt(K.__webglFramebuffer[Oe][st],I,M,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,st);else tt(K.__webglFramebuffer[Oe],I,M,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,0);C(M)&&y(o.TEXTURE_CUBE_MAP),h.unbindTexture()}else if(ct){for(let Oe=0,st=Te.length;Oe<st;Oe++){const at=Te[Oe],Ue=x.get(at);let Xe=o.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Xe=I.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),h.bindTexture(Xe,Ue.__webglTexture),nn(Xe,at),tt(K.__webglFramebuffer,I,at,o.COLOR_ATTACHMENT0+Oe,Xe,0),C(at)&&y(Xe)}h.unbindTexture()}else{let Oe=o.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Oe=I.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),h.bindTexture(Oe,fe.__webglTexture),nn(Oe,M),M.mipmaps&&M.mipmaps.length>0)for(let st=0;st<M.mipmaps.length;st++)tt(K.__webglFramebuffer[st],I,M,o.COLOR_ATTACHMENT0,Oe,st);else tt(K.__webglFramebuffer,I,M,o.COLOR_ATTACHMENT0,Oe,0);C(M)&&y(Oe),h.unbindTexture()}I.depthBuffer&&Zt(I)}function bn(I){const M=I.textures;for(let K=0,fe=M.length;K<fe;K++){const Te=M[K];if(C(Te)){const pe=ie(I),ct=x.get(Te).__webglTexture;h.bindTexture(pe,ct),y(pe),h.unbindTexture()}}}const It=[],St=[];function nt(I){if(I.samples>0){if(it(I)===!1){const M=I.textures,K=I.width,fe=I.height;let Te=o.COLOR_BUFFER_BIT;const pe=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ct=x.get(I),Oe=M.length>1;if(Oe)for(let at=0;at<M.length;at++)h.bindFramebuffer(o.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+at,o.RENDERBUFFER,null),h.bindFramebuffer(o.FRAMEBUFFER,ct.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+at,o.TEXTURE_2D,null,0);h.bindFramebuffer(o.READ_FRAMEBUFFER,ct.__webglMultisampledFramebuffer);const st=I.texture.mipmaps;st&&st.length>0?h.bindFramebuffer(o.DRAW_FRAMEBUFFER,ct.__webglFramebuffer[0]):h.bindFramebuffer(o.DRAW_FRAMEBUFFER,ct.__webglFramebuffer);for(let at=0;at<M.length;at++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(Te|=o.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(Te|=o.STENCIL_BUFFER_BIT)),Oe){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,ct.__webglColorRenderbuffer[at]);const Ue=x.get(M[at]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,Ue,0)}o.blitFramebuffer(0,0,K,fe,0,0,K,fe,Te,o.NEAREST),j===!0&&(It.length=0,St.length=0,It.push(o.COLOR_ATTACHMENT0+at),I.depthBuffer&&I.resolveDepthBuffer===!1&&(It.push(pe),St.push(pe),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,St)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,It))}if(h.bindFramebuffer(o.READ_FRAMEBUFFER,null),h.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Oe)for(let at=0;at<M.length;at++){h.bindFramebuffer(o.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+at,o.RENDERBUFFER,ct.__webglColorRenderbuffer[at]);const Ue=x.get(M[at]).__webglTexture;h.bindFramebuffer(o.FRAMEBUFFER,ct.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+at,o.TEXTURE_2D,Ue,0)}h.bindFramebuffer(o.DRAW_FRAMEBUFFER,ct.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&j){const M=I.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[M])}}}function _n(I){return Math.min(A.maxSamples,I.samples)}function it(I){const M=x.get(I);return I.samples>0&&f.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ft(I){const M=N.render.frame;ne.get(I)!==M&&(ne.set(I,M),I.update())}function ii(I,M){const K=I.colorSpace,fe=I.format,Te=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||K!==dn&&K!==wi&&(we.getTransfer(K)===$e?(fe!==Nt||Te!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),M}function Cn(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(Y.width=I.naturalWidth||I.width,Y.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(Y.width=I.displayWidth,Y.height=I.displayHeight):(Y.width=I.width,Y.height=I.height),Y}this.allocateTextureUnit=Ae,this.resetTextureUnits=de,this.setTexture2D=Se,this.setTexture2DArray=be,this.setTexture3D=Le,this.setTextureCube=_e,this.rebindTextures=Kn,this.setupRenderTarget=O,this.updateRenderTargetMipmap=bn,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=it}function Bo(o,f){function h(x,A=wi){let b;const N=we.getTransfer(A);if(x===pn)return o.UNSIGNED_BYTE;if(x===Os)return o.UNSIGNED_SHORT_4_4_4_4;if(x===zs)return o.UNSIGNED_SHORT_5_5_5_1;if(x===ps)return o.UNSIGNED_INT_5_9_9_9_REV;if(x===xa)return o.UNSIGNED_INT_10F_11F_11F_REV;if(x===so)return o.BYTE;if(x===ao)return o.SHORT;if(x===Jr)return o.UNSIGNED_SHORT;if(x===hn)return o.INT;if(x===_r)return o.UNSIGNED_INT;if(x===dt)return o.FLOAT;if(x===an)return o.HALF_FLOAT;if(x===Dn)return o.ALPHA;if(x===S)return o.RGB;if(x===Nt)return o.RGBA;if(x===$r)return o.DEPTH_COMPONENT;if(x===oi)return o.DEPTH_STENCIL;if(x===z)return o.RED;if(x===V)return o.RED_INTEGER;if(x===oe)return o.RG;if(x===Me)return o.RG_INTEGER;if(x===me)return o.RGBA_INTEGER;if(x===xt||x===tn||x===Xt||x===qn)if(N===$e)if(b=f.get("WEBGL_compressed_texture_s3tc_srgb"),b!==null){if(x===xt)return b.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(x===tn)return b.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(x===Xt)return b.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(x===qn)return b.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(b=f.get("WEBGL_compressed_texture_s3tc"),b!==null){if(x===xt)return b.COMPRESSED_RGB_S3TC_DXT1_EXT;if(x===tn)return b.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(x===Xt)return b.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(x===qn)return b.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(x===zi||x===Lr||x===ms||x===cr)if(b=f.get("WEBGL_compressed_texture_pvrtc"),b!==null){if(x===zi)return b.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(x===Lr)return b.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(x===ms)return b.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(x===cr)return b.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(x===xr||x===Gs||x===oo)if(b=f.get("WEBGL_compressed_texture_etc"),b!==null){if(x===xr||x===Gs)return N===$e?b.COMPRESSED_SRGB8_ETC2:b.COMPRESSED_RGB8_ETC2;if(x===oo)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:b.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(x===Ci||x===lo||x===co||x===ya||x===$l||x===Kr||x===Jl||x===Kl||x===Ql||x===jl||x===ec||x===tc||x===nc||x===ic)if(b=f.get("WEBGL_compressed_texture_astc"),b!==null){if(x===Ci)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:b.COMPRESSED_RGBA_ASTC_4x4_KHR;if(x===lo)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:b.COMPRESSED_RGBA_ASTC_5x4_KHR;if(x===co)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:b.COMPRESSED_RGBA_ASTC_5x5_KHR;if(x===ya)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:b.COMPRESSED_RGBA_ASTC_6x5_KHR;if(x===$l)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:b.COMPRESSED_RGBA_ASTC_6x6_KHR;if(x===Kr)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:b.COMPRESSED_RGBA_ASTC_8x5_KHR;if(x===Jl)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:b.COMPRESSED_RGBA_ASTC_8x6_KHR;if(x===Kl)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:b.COMPRESSED_RGBA_ASTC_8x8_KHR;if(x===Ql)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:b.COMPRESSED_RGBA_ASTC_10x5_KHR;if(x===jl)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:b.COMPRESSED_RGBA_ASTC_10x6_KHR;if(x===ec)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:b.COMPRESSED_RGBA_ASTC_10x8_KHR;if(x===tc)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:b.COMPRESSED_RGBA_ASTC_10x10_KHR;if(x===nc)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:b.COMPRESSED_RGBA_ASTC_12x10_KHR;if(x===ic)return N===$e?b.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:b.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(x===rc||x===sc||x===ac)if(b=f.get("EXT_texture_compression_bptc"),b!==null){if(x===rc)return N===$e?b.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:b.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(x===sc)return b.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(x===ac)return b.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(x===oc||x===lc||x===ho||x===cc)if(b=f.get("EXT_texture_compression_rgtc"),b!==null){if(x===oc)return b.COMPRESSED_RED_RGTC1_EXT;if(x===lc)return b.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(x===ho)return b.COMPRESSED_RED_GREEN_RGTC2_EXT;if(x===cc)return b.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return x===Pr?o.UNSIGNED_INT_24_8:o[x]!==void 0?o[x]:null}return{convert:h}}const Nl=`
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

}`;class Oo{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(f,h){if(this.texture===null){const x=new hc(f.texture);(f.depthNear!==h.depthNear||f.depthFar!==h.depthFar)&&(this.depthNear=f.depthNear,this.depthFar=f.depthFar),this.texture=x}}getMesh(f){if(this.texture!==null&&this.mesh===null){const h=f.cameras[0].viewport,x=new Ln({vertexShader:Nl,fragmentShader:Xh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:h.z},depthHeight:{value:h.w}}});this.mesh=new vn(new lt(20,20),x)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Bl extends Qc{constructor(f,h){super();const x=this;let A=null,b=1,N=null,R="local-floor",j=1,Y=null,ne=null,H=null,X=null,$=null,ge=null;const se=typeof XRWebGLBinding<"u",C=new Oo,y={},ie=h.getContextAttributes();let J=null,k=null;const ce=[],ee=[],te=new $t;let ye=null;const L=new $n;L.viewport=new Hn;const P=new $n;P.viewport=new Hn;const Z=[L,P],de=new jc;let Ae=null,Ce=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ve){let Ee=ce[ve];return Ee===void 0&&(Ee=new il,ce[ve]=Ee),Ee.getTargetRaySpace()},this.getControllerGrip=function(ve){let Ee=ce[ve];return Ee===void 0&&(Ee=new il,ce[ve]=Ee),Ee.getGripSpace()},this.getHand=function(ve){let Ee=ce[ve];return Ee===void 0&&(Ee=new il,ce[ve]=Ee),Ee.getHandSpace()};function Se(ve){const Ee=ee.indexOf(ve.inputSource);if(Ee===-1)return;const tt=ce[Ee];tt!==void 0&&(tt.update(ve.inputSource,ve.frame,Y||N),tt.dispatchEvent({type:ve.type,data:ve.inputSource}))}function be(){A.removeEventListener("select",Se),A.removeEventListener("selectstart",Se),A.removeEventListener("selectend",Se),A.removeEventListener("squeeze",Se),A.removeEventListener("squeezestart",Se),A.removeEventListener("squeezeend",Se),A.removeEventListener("end",be),A.removeEventListener("inputsourceschange",Le);for(let ve=0;ve<ce.length;ve++){const Ee=ee[ve];Ee!==null&&(ee[ve]=null,ce[ve].disconnect(Ee))}Ae=null,Ce=null,C.reset();for(const ve in y)delete y[ve];f.setRenderTarget(J),$=null,X=null,H=null,A=null,k=null,fn.stop(),x.isPresenting=!1,f.setPixelRatio(ye),f.setSize(te.width,te.height,!1),x.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ve){b=ve,x.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ve){R=ve,x.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return Y||N},this.setReferenceSpace=function(ve){Y=ve},this.getBaseLayer=function(){return X!==null?X:$},this.getBinding=function(){return H===null&&se&&(H=new XRWebGLBinding(A,h)),H},this.getFrame=function(){return ge},this.getSession=function(){return A},this.setSession=async function(ve){if(A=ve,A!==null){if(J=f.getRenderTarget(),A.addEventListener("select",Se),A.addEventListener("selectstart",Se),A.addEventListener("selectend",Se),A.addEventListener("squeeze",Se),A.addEventListener("squeezestart",Se),A.addEventListener("squeezeend",Se),A.addEventListener("end",be),A.addEventListener("inputsourceschange",Le),ie.xrCompatible!==!0&&await h.makeXRCompatible(),ye=f.getPixelRatio(),f.getSize(te),se&&"createProjectionLayer"in XRWebGLBinding.prototype){let tt=null,wt=null,ut=null;ie.depth&&(ut=ie.stencil?h.DEPTH24_STENCIL8:h.DEPTH_COMPONENT24,tt=ie.stencil?oi:$r,wt=ie.stencil?Pr:_r);const Zt={colorFormat:h.RGBA8,depthFormat:ut,scaleFactor:b};H=this.getBinding(),X=H.createProjectionLayer(Zt),A.updateRenderState({layers:[X]}),f.setPixelRatio(1),f.setSize(X.textureWidth,X.textureHeight,!1),k=new Ti(X.textureWidth,X.textureHeight,{format:Nt,type:pn,depthTexture:new kr(X.textureWidth,X.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:ie.stencil,colorSpace:f.outputColorSpace,samples:ie.antialias?4:0,resolveDepthBuffer:X.ignoreDepthValues===!1,resolveStencilBuffer:X.ignoreDepthValues===!1})}else{const tt={antialias:ie.antialias,alpha:!0,depth:ie.depth,stencil:ie.stencil,framebufferScaleFactor:b};$=new XRWebGLLayer(A,h,tt),A.updateRenderState({baseLayer:$}),f.setPixelRatio(1),f.setSize($.framebufferWidth,$.framebufferHeight,!1),k=new Ti($.framebufferWidth,$.framebufferHeight,{format:Nt,type:pn,colorSpace:f.outputColorSpace,stencilBuffer:ie.stencil,resolveDepthBuffer:$.ignoreDepthValues===!1,resolveStencilBuffer:$.ignoreDepthValues===!1})}k.isXRRenderTarget=!0,this.setFoveation(j),Y=null,N=await A.requestReferenceSpace(R),fn.setContext(A),fn.start(),x.isPresenting=!0,x.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(A!==null)return A.environmentBlendMode},this.getDepthTexture=function(){return C.getDepthTexture()};function Le(ve){for(let Ee=0;Ee<ve.removed.length;Ee++){const tt=ve.removed[Ee],wt=ee.indexOf(tt);wt>=0&&(ee[wt]=null,ce[wt].disconnect(tt))}for(let Ee=0;Ee<ve.added.length;Ee++){const tt=ve.added[Ee];let wt=ee.indexOf(tt);if(wt===-1){for(let Zt=0;Zt<ce.length;Zt++)if(Zt>=ee.length){ee.push(tt),wt=Zt;break}else if(ee[Zt]===null){ee[Zt]=tt,wt=Zt;break}if(wt===-1)break}const ut=ce[wt];ut&&ut.connect(tt)}}const _e=new Ct,rt=new Ct;function gt(ve,Ee,tt){_e.setFromMatrixPosition(Ee.matrixWorld),rt.setFromMatrixPosition(tt.matrixWorld);const wt=_e.distanceTo(rt),ut=Ee.projectionMatrix.elements,Zt=tt.projectionMatrix.elements,Kn=ut[14]/(ut[10]-1),O=ut[14]/(ut[10]+1),bn=(ut[9]+1)/ut[5],It=(ut[9]-1)/ut[5],St=(ut[8]-1)/ut[0],nt=(Zt[8]+1)/Zt[0],_n=Kn*St,it=Kn*nt,Ft=wt/(-St+nt),ii=Ft*-St;if(Ee.matrixWorld.decompose(ve.position,ve.quaternion,ve.scale),ve.translateX(ii),ve.translateZ(Ft),ve.matrixWorld.compose(ve.position,ve.quaternion,ve.scale),ve.matrixWorldInverse.copy(ve.matrixWorld).invert(),ut[10]===-1)ve.projectionMatrix.copy(Ee.projectionMatrix),ve.projectionMatrixInverse.copy(Ee.projectionMatrixInverse);else{const Cn=Kn+Ft,I=O+Ft,M=_n-ii,K=it+(wt-ii),fe=bn*O/I*Cn,Te=It*O/I*Cn;ve.projectionMatrix.makePerspective(M,K,fe,Te,Cn,I),ve.projectionMatrixInverse.copy(ve.projectionMatrix).invert()}}function Ot(ve,Ee){Ee===null?ve.matrixWorld.copy(ve.matrix):ve.matrixWorld.multiplyMatrices(Ee.matrixWorld,ve.matrix),ve.matrixWorldInverse.copy(ve.matrixWorld).invert()}this.updateCamera=function(ve){if(A===null)return;let Ee=ve.near,tt=ve.far;C.texture!==null&&(C.depthNear>0&&(Ee=C.depthNear),C.depthFar>0&&(tt=C.depthFar)),de.near=P.near=L.near=Ee,de.far=P.far=L.far=tt,(Ae!==de.near||Ce!==de.far)&&(A.updateRenderState({depthNear:de.near,depthFar:de.far}),Ae=de.near,Ce=de.far),de.layers.mask=ve.layers.mask|6,L.layers.mask=de.layers.mask&3,P.layers.mask=de.layers.mask&5;const wt=ve.parent,ut=de.cameras;Ot(de,wt);for(let Zt=0;Zt<ut.length;Zt++)Ot(ut[Zt],wt);ut.length===2?gt(de,L,P):de.projectionMatrix.copy(L.projectionMatrix),nn(ve,de,wt)};function nn(ve,Ee,tt){tt===null?ve.matrix.copy(Ee.matrixWorld):(ve.matrix.copy(tt.matrixWorld),ve.matrix.invert(),ve.matrix.multiply(Ee.matrixWorld)),ve.matrix.decompose(ve.position,ve.quaternion,ve.scale),ve.updateMatrixWorld(!0),ve.projectionMatrix.copy(Ee.projectionMatrix),ve.projectionMatrixInverse.copy(Ee.projectionMatrixInverse),ve.isPerspectiveCamera&&(ve.fov=su*2*Math.atan(1/ve.projectionMatrix.elements[5]),ve.zoom=1)}this.getCamera=function(){return de},this.getFoveation=function(){if(!(X===null&&$===null))return j},this.setFoveation=function(ve){j=ve,X!==null&&(X.fixedFoveation=ve),$!==null&&$.fixedFoveation!==void 0&&($.fixedFoveation=ve)},this.hasDepthSensing=function(){return C.texture!==null},this.getDepthSensingMesh=function(){return C.getMesh(de)},this.getCameraTexture=function(ve){return y[ve]};let On=null;function zn(ve,Ee){if(ne=Ee.getViewerPose(Y||N),ge=Ee,ne!==null){const tt=ne.views;$!==null&&(f.setRenderTargetFramebuffer(k,$.framebuffer),f.setRenderTarget(k));let wt=!1;tt.length!==de.cameras.length&&(de.cameras.length=0,wt=!0);for(let O=0;O<tt.length;O++){const bn=tt[O];let It=null;if($!==null)It=$.getViewport(bn);else{const nt=H.getViewSubImage(X,bn);It=nt.viewport,O===0&&(f.setRenderTargetTextures(k,nt.colorTexture,nt.depthStencilTexture),f.setRenderTarget(k))}let St=Z[O];St===void 0&&(St=new $n,St.layers.enable(O),St.viewport=new Hn,Z[O]=St),St.matrix.fromArray(bn.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(bn.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(It.x,It.y,It.width,It.height),O===0&&(de.matrix.copy(St.matrix),de.matrix.decompose(de.position,de.quaternion,de.scale)),wt===!0&&de.cameras.push(St)}const ut=A.enabledFeatures;if(ut&&ut.includes("depth-sensing")&&A.depthUsage=="gpu-optimized"&&se){H=x.getBinding();const O=H.getDepthInformation(tt[0]);O&&O.isValid&&O.texture&&C.init(O,A.renderState)}if(ut&&ut.includes("camera-access")&&se){f.state.unbindTexture(),H=x.getBinding();for(let O=0;O<tt.length;O++){const bn=tt[O].camera;if(bn){let It=y[bn];It||(It=new hc,y[bn]=It);const St=H.getCameraImage(bn);It.sourceTexture=St}}}}for(let tt=0;tt<ce.length;tt++){const wt=ee[tt],ut=ce[tt];wt!==null&&ut!==void 0&&ut.update(wt,Ee,Y||N)}On&&On(ve,Ee),Ee.detectedPlanes&&x.dispatchEvent({type:"planesdetected",data:Ee}),ge=null}const fn=new nh;fn.setAnimationLoop(zn),this.setAnimationLoop=function(ve){On=ve},this.dispose=function(){}}}const ns=new ze,qh=new qe;function As(o,f){function h(C,y){C.matrixAutoUpdate===!0&&C.updateMatrix(),y.value.copy(C.matrix)}function x(C,y){y.color.getRGB(C.fogColor.value,Lt(o)),y.isFog?(C.fogNear.value=y.near,C.fogFar.value=y.far):y.isFogExp2&&(C.fogDensity.value=y.density)}function A(C,y,ie,J,k){y.isMeshBasicMaterial||y.isMeshLambertMaterial?b(C,y):y.isMeshToonMaterial?(b(C,y),H(C,y)):y.isMeshPhongMaterial?(b(C,y),ne(C,y)):y.isMeshStandardMaterial?(b(C,y),X(C,y),y.isMeshPhysicalMaterial&&$(C,y,k)):y.isMeshMatcapMaterial?(b(C,y),ge(C,y)):y.isMeshDepthMaterial?b(C,y):y.isMeshDistanceMaterial?(b(C,y),se(C,y)):y.isMeshNormalMaterial?b(C,y):y.isLineBasicMaterial?(N(C,y),y.isLineDashedMaterial&&R(C,y)):y.isPointsMaterial?j(C,y,ie,J):y.isSpriteMaterial?Y(C,y):y.isShadowMaterial?(C.color.value.copy(y.color),C.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function b(C,y){C.opacity.value=y.opacity,y.color&&C.diffuse.value.copy(y.color),y.emissive&&C.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(C.map.value=y.map,h(y.map,C.mapTransform)),y.alphaMap&&(C.alphaMap.value=y.alphaMap,h(y.alphaMap,C.alphaMapTransform)),y.bumpMap&&(C.bumpMap.value=y.bumpMap,h(y.bumpMap,C.bumpMapTransform),C.bumpScale.value=y.bumpScale,y.side===Mn&&(C.bumpScale.value*=-1)),y.normalMap&&(C.normalMap.value=y.normalMap,h(y.normalMap,C.normalMapTransform),C.normalScale.value.copy(y.normalScale),y.side===Mn&&C.normalScale.value.negate()),y.displacementMap&&(C.displacementMap.value=y.displacementMap,h(y.displacementMap,C.displacementMapTransform),C.displacementScale.value=y.displacementScale,C.displacementBias.value=y.displacementBias),y.emissiveMap&&(C.emissiveMap.value=y.emissiveMap,h(y.emissiveMap,C.emissiveMapTransform)),y.specularMap&&(C.specularMap.value=y.specularMap,h(y.specularMap,C.specularMapTransform)),y.alphaTest>0&&(C.alphaTest.value=y.alphaTest);const ie=f.get(y),J=ie.envMap,k=ie.envMapRotation;J&&(C.envMap.value=J,ns.copy(k),ns.x*=-1,ns.y*=-1,ns.z*=-1,J.isCubeTexture&&J.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),C.envMapRotation.value.setFromMatrix4(qh.makeRotationFromEuler(ns)),C.flipEnvMap.value=J.isCubeTexture&&J.isRenderTargetTexture===!1?-1:1,C.reflectivity.value=y.reflectivity,C.ior.value=y.ior,C.refractionRatio.value=y.refractionRatio),y.lightMap&&(C.lightMap.value=y.lightMap,C.lightMapIntensity.value=y.lightMapIntensity,h(y.lightMap,C.lightMapTransform)),y.aoMap&&(C.aoMap.value=y.aoMap,C.aoMapIntensity.value=y.aoMapIntensity,h(y.aoMap,C.aoMapTransform))}function N(C,y){C.diffuse.value.copy(y.color),C.opacity.value=y.opacity,y.map&&(C.map.value=y.map,h(y.map,C.mapTransform))}function R(C,y){C.dashSize.value=y.dashSize,C.totalSize.value=y.dashSize+y.gapSize,C.scale.value=y.scale}function j(C,y,ie,J){C.diffuse.value.copy(y.color),C.opacity.value=y.opacity,C.size.value=y.size*ie,C.scale.value=J*.5,y.map&&(C.map.value=y.map,h(y.map,C.uvTransform)),y.alphaMap&&(C.alphaMap.value=y.alphaMap,h(y.alphaMap,C.alphaMapTransform)),y.alphaTest>0&&(C.alphaTest.value=y.alphaTest)}function Y(C,y){C.diffuse.value.copy(y.color),C.opacity.value=y.opacity,C.rotation.value=y.rotation,y.map&&(C.map.value=y.map,h(y.map,C.mapTransform)),y.alphaMap&&(C.alphaMap.value=y.alphaMap,h(y.alphaMap,C.alphaMapTransform)),y.alphaTest>0&&(C.alphaTest.value=y.alphaTest)}function ne(C,y){C.specular.value.copy(y.specular),C.shininess.value=Math.max(y.shininess,1e-4)}function H(C,y){y.gradientMap&&(C.gradientMap.value=y.gradientMap)}function X(C,y){C.metalness.value=y.metalness,y.metalnessMap&&(C.metalnessMap.value=y.metalnessMap,h(y.metalnessMap,C.metalnessMapTransform)),C.roughness.value=y.roughness,y.roughnessMap&&(C.roughnessMap.value=y.roughnessMap,h(y.roughnessMap,C.roughnessMapTransform)),y.envMap&&(C.envMapIntensity.value=y.envMapIntensity)}function $(C,y,ie){C.ior.value=y.ior,y.sheen>0&&(C.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),C.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(C.sheenColorMap.value=y.sheenColorMap,h(y.sheenColorMap,C.sheenColorMapTransform)),y.sheenRoughnessMap&&(C.sheenRoughnessMap.value=y.sheenRoughnessMap,h(y.sheenRoughnessMap,C.sheenRoughnessMapTransform))),y.clearcoat>0&&(C.clearcoat.value=y.clearcoat,C.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(C.clearcoatMap.value=y.clearcoatMap,h(y.clearcoatMap,C.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(C.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,h(y.clearcoatRoughnessMap,C.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(C.clearcoatNormalMap.value=y.clearcoatNormalMap,h(y.clearcoatNormalMap,C.clearcoatNormalMapTransform),C.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Mn&&C.clearcoatNormalScale.value.negate())),y.dispersion>0&&(C.dispersion.value=y.dispersion),y.iridescence>0&&(C.iridescence.value=y.iridescence,C.iridescenceIOR.value=y.iridescenceIOR,C.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],C.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(C.iridescenceMap.value=y.iridescenceMap,h(y.iridescenceMap,C.iridescenceMapTransform)),y.iridescenceThicknessMap&&(C.iridescenceThicknessMap.value=y.iridescenceThicknessMap,h(y.iridescenceThicknessMap,C.iridescenceThicknessMapTransform))),y.transmission>0&&(C.transmission.value=y.transmission,C.transmissionSamplerMap.value=ie.texture,C.transmissionSamplerSize.value.set(ie.width,ie.height),y.transmissionMap&&(C.transmissionMap.value=y.transmissionMap,h(y.transmissionMap,C.transmissionMapTransform)),C.thickness.value=y.thickness,y.thicknessMap&&(C.thicknessMap.value=y.thicknessMap,h(y.thicknessMap,C.thicknessMapTransform)),C.attenuationDistance.value=y.attenuationDistance,C.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(C.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(C.anisotropyMap.value=y.anisotropyMap,h(y.anisotropyMap,C.anisotropyMapTransform))),C.specularIntensity.value=y.specularIntensity,C.specularColor.value.copy(y.specularColor),y.specularColorMap&&(C.specularColorMap.value=y.specularColorMap,h(y.specularColorMap,C.specularColorMapTransform)),y.specularIntensityMap&&(C.specularIntensityMap.value=y.specularIntensityMap,h(y.specularIntensityMap,C.specularIntensityMapTransform))}function ge(C,y){y.matcap&&(C.matcap.value=y.matcap)}function se(C,y){const ie=f.get(y).light;C.referencePosition.value.setFromMatrixPosition(ie.matrixWorld),C.nearDistance.value=ie.shadow.camera.near,C.farDistance.value=ie.shadow.camera.far}return{refreshFogUniforms:x,refreshMaterialUniforms:A}}function Ol(o,f,h,x){let A={},b={},N=[];const R=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function j(ie,J){const k=J.program;x.uniformBlockBinding(ie,k)}function Y(ie,J){let k=A[ie.id];k===void 0&&(ge(ie),k=ne(ie),A[ie.id]=k,ie.addEventListener("dispose",C));const ce=J.program;x.updateUBOMapping(ie,ce);const ee=f.render.frame;b[ie.id]!==ee&&(X(ie),b[ie.id]=ee)}function ne(ie){const J=H();ie.__bindingPointIndex=J;const k=o.createBuffer(),ce=ie.__size,ee=ie.usage;return o.bindBuffer(o.UNIFORM_BUFFER,k),o.bufferData(o.UNIFORM_BUFFER,ce,ee),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,J,k),k}function H(){for(let ie=0;ie<R;ie++)if(N.indexOf(ie)===-1)return N.push(ie),ie;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function X(ie){const J=A[ie.id],k=ie.uniforms,ce=ie.__cache;o.bindBuffer(o.UNIFORM_BUFFER,J);for(let ee=0,te=k.length;ee<te;ee++){const ye=Array.isArray(k[ee])?k[ee]:[k[ee]];for(let L=0,P=ye.length;L<P;L++){const Z=ye[L];if($(Z,ee,L,ce)===!0){const de=Z.__offset,Ae=Array.isArray(Z.value)?Z.value:[Z.value];let Ce=0;for(let Se=0;Se<Ae.length;Se++){const be=Ae[Se],Le=se(be);typeof be=="number"||typeof be=="boolean"?(Z.__data[0]=be,o.bufferSubData(o.UNIFORM_BUFFER,de+Ce,Z.__data)):be.isMatrix3?(Z.__data[0]=be.elements[0],Z.__data[1]=be.elements[1],Z.__data[2]=be.elements[2],Z.__data[3]=0,Z.__data[4]=be.elements[3],Z.__data[5]=be.elements[4],Z.__data[6]=be.elements[5],Z.__data[7]=0,Z.__data[8]=be.elements[6],Z.__data[9]=be.elements[7],Z.__data[10]=be.elements[8],Z.__data[11]=0):(be.toArray(Z.__data,Ce),Ce+=Le.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,de,Z.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function $(ie,J,k,ce){const ee=ie.value,te=J+"_"+k;if(ce[te]===void 0)return typeof ee=="number"||typeof ee=="boolean"?ce[te]=ee:ce[te]=ee.clone(),!0;{const ye=ce[te];if(typeof ee=="number"||typeof ee=="boolean"){if(ye!==ee)return ce[te]=ee,!0}else if(ye.equals(ee)===!1)return ye.copy(ee),!0}return!1}function ge(ie){const J=ie.uniforms;let k=0;const ce=16;for(let te=0,ye=J.length;te<ye;te++){const L=Array.isArray(J[te])?J[te]:[J[te]];for(let P=0,Z=L.length;P<Z;P++){const de=L[P],Ae=Array.isArray(de.value)?de.value:[de.value];for(let Ce=0,Se=Ae.length;Ce<Se;Ce++){const be=Ae[Ce],Le=se(be),_e=k%ce,rt=_e%Le.boundary,gt=_e+rt;k+=rt,gt!==0&&ce-gt<Le.storage&&(k+=ce-gt),de.__data=new Float32Array(Le.storage/Float32Array.BYTES_PER_ELEMENT),de.__offset=k,k+=Le.storage}}}const ee=k%ce;return ee>0&&(k+=ce-ee),ie.__size=k,ie.__cache={},this}function se(ie){const J={boundary:0,storage:0};return typeof ie=="number"||typeof ie=="boolean"?(J.boundary=4,J.storage=4):ie.isVector2?(J.boundary=8,J.storage=8):ie.isVector3||ie.isColor?(J.boundary=16,J.storage=12):ie.isVector4?(J.boundary=16,J.storage=16):ie.isMatrix3?(J.boundary=48,J.storage=48):ie.isMatrix4?(J.boundary=64,J.storage=64):ie.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",ie),J}function C(ie){const J=ie.target;J.removeEventListener("dispose",C);const k=N.indexOf(J.__bindingPointIndex);N.splice(k,1),o.deleteBuffer(A[J.id]),delete A[J.id],delete b[J.id]}function y(){for(const ie in A)o.deleteBuffer(A[ie]);N=[],A={},b={}}return{bind:j,update:Y,dispose:y}}class Yh{constructor(f={}){const{canvas:h=eh(),context:x=null,depth:A=!0,stencil:b=!1,alpha:N=!1,antialias:R=!1,premultipliedAlpha:j=!0,preserveDrawingBuffer:Y=!1,powerPreference:ne="default",failIfMajorPerformanceCaveat:H=!1,reversedDepthBuffer:X=!1}=f;this.isWebGLRenderer=!0;let $;if(x!==null){if(typeof WebGLRenderingContext<"u"&&x instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");$=x.getContextAttributes().alpha}else $=N;const ge=new Uint32Array(4),se=new Int32Array(4);let C=null,y=null;const ie=[],J=[];this.domElement=h,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const k=this;let ce=!1;this._outputColorSpace=th;let ee=0,te=0,ye=null,L=-1,P=null;const Z=new Hn,de=new Hn;let Ae=null;const Ce=new At(0);let Se=0,be=h.width,Le=h.height,_e=1,rt=null,gt=null;const Ot=new Hn(0,0,be,Le),nn=new Hn(0,0,be,Le);let On=!1;const zn=new Is;let fn=!1,ve=!1;const Ee=new qe,tt=new Ct,wt=new Hn,ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Zt=!1;function Kn(){return ye===null?_e:1}let O=x;function bn(T,W){return h.getContext(T,W)}try{const T={alpha:!0,depth:A,stencil:b,antialias:R,premultipliedAlpha:j,preserveDrawingBuffer:Y,powerPreference:ne,failIfMajorPerformanceCaveat:H};if("setAttribute"in h&&h.setAttribute("data-engine",`three.js r${va}`),h.addEventListener("webglcontextlost",Ge,!1),h.addEventListener("webglcontextrestored",Ze,!1),h.addEventListener("webglcontextcreationerror",De,!1),O===null){const W="webgl2";if(O=bn(W,T),O===null)throw bn(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let It,St,nt,_n,it,Ft,ii,Cn,I,M,K,fe,Te,pe,ct,Oe,st,at,Ue,Xe,bt,ot,He,zt;function G(){It=new tr(O),It.init(),ot=new Bo(O,It),St=new ju(O,It,f,ot),nt=new Wh(O,It),St.reversedDepthBuffer&&X&&nt.buffers.depth.setReversed(!0),_n=new kt(O),it=new md,Ft=new Li(O,It,nt,it,St,ot,_n),ii=new Xs(k),Cn=new Da(k),I=new ou(O),He=new Et(O,I),M=new So(O,I,_n,He),K=new Zs(O,M,I,_n),Ue=new Sh(O,St,Ft),Oe=new Mi(it),fe=new pd(k,ii,Cn,It,St,He,Oe),Te=new As(k,it),pe=new kh,ct=new Gc(It),at=new wc(k,ii,Cn,nt,K,$,j),st=new xd(k,K,St),zt=new Ol(O,_n,St,nt),Xe=new vi(O,It,_n),bt=new si(O,It,_n),_n.programs=fe.programs,k.capabilities=St,k.extensions=It,k.properties=it,k.renderLists=pe,k.shadowMap=st,k.state=nt,k.info=_n}G();const Fe=new Bl(k,O);this.xr=Fe,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const T=It.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=It.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(T){T!==void 0&&(_e=T,this.setSize(be,Le,!1))},this.getSize=function(T){return T.set(be,Le)},this.setSize=function(T,W,re=!0){if(Fe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}be=T,Le=W,h.width=Math.floor(T*_e),h.height=Math.floor(W*_e),re===!0&&(h.style.width=T+"px",h.style.height=W+"px"),this.setViewport(0,0,T,W)},this.getDrawingBufferSize=function(T){return T.set(be*_e,Le*_e).floor()},this.setDrawingBufferSize=function(T,W,re){be=T,Le=W,_e=re,h.width=Math.floor(T*re),h.height=Math.floor(W*re),this.setViewport(0,0,T,W)},this.getCurrentViewport=function(T){return T.copy(Z)},this.getViewport=function(T){return T.copy(Ot)},this.setViewport=function(T,W,re,ae){T.isVector4?Ot.set(T.x,T.y,T.z,T.w):Ot.set(T,W,re,ae),nt.viewport(Z.copy(Ot).multiplyScalar(_e).round())},this.getScissor=function(T){return T.copy(nn)},this.setScissor=function(T,W,re,ae){T.isVector4?nn.set(T.x,T.y,T.z,T.w):nn.set(T,W,re,ae),nt.scissor(de.copy(nn).multiplyScalar(_e).round())},this.getScissorTest=function(){return On},this.setScissorTest=function(T){nt.setScissorTest(On=T)},this.setOpaqueSort=function(T){rt=T},this.setTransparentSort=function(T){gt=T},this.getClearColor=function(T){return T.copy(at.getClearColor())},this.setClearColor=function(){at.setClearColor(...arguments)},this.getClearAlpha=function(){return at.getClearAlpha()},this.setClearAlpha=function(){at.setClearAlpha(...arguments)},this.clear=function(T=!0,W=!0,re=!0){let ae=0;if(T){let q=!1;if(ye!==null){const Pe=ye.texture.format;q=Pe===me||Pe===Me||Pe===V}if(q){const Pe=ye.texture.type,Ve=Pe===pn||Pe===_r||Pe===Jr||Pe===Pr||Pe===Os||Pe===zs,Qe=at.getClearColor(),Ye=at.getClearAlpha(),yt=Qe.r,Tt=Qe.g,ft=Qe.b;Ve?(ge[0]=yt,ge[1]=Tt,ge[2]=ft,ge[3]=Ye,O.clearBufferuiv(O.COLOR,0,ge)):(se[0]=yt,se[1]=Tt,se[2]=ft,se[3]=Ye,O.clearBufferiv(O.COLOR,0,se))}else ae|=O.COLOR_BUFFER_BIT}W&&(ae|=O.DEPTH_BUFFER_BIT),re&&(ae|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){h.removeEventListener("webglcontextlost",Ge,!1),h.removeEventListener("webglcontextrestored",Ze,!1),h.removeEventListener("webglcontextcreationerror",De,!1),at.dispose(),pe.dispose(),ct.dispose(),it.dispose(),ii.dispose(),Cn.dispose(),K.dispose(),He.dispose(),zt.dispose(),fe.dispose(),Fe.dispose(),Fe.removeEventListener("sessionstart",Wi),Fe.removeEventListener("sessionend",Zh),Es.stop()};function Ge(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),ce=!0}function Ze(){console.log("THREE.WebGLRenderer: Context Restored."),ce=!1;const T=_n.autoReset,W=st.enabled,re=st.autoUpdate,ae=st.needsUpdate,q=st.type;G(),_n.autoReset=T,st.enabled=W,st.autoUpdate=re,st.needsUpdate=ae,st.type=q}function De(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function he(T){const W=T.target;W.removeEventListener("dispose",he),Je(W)}function Je(T){Pt(T),it.remove(T)}function Pt(T){const W=it.get(T).programs;W!==void 0&&(W.forEach(function(re){fe.releaseProgram(re)}),T.isShaderMaterial&&fe.releaseShaderCache(T))}this.renderBufferDirect=function(T,W,re,ae,q,Pe){W===null&&(W=ut);const Ve=q.isMesh&&q.matrixWorld.determinant()<0,Qe=Vl(T,W,re,ae,q);nt.setMaterial(ae,Ve);let Ye=re.index,yt=1;if(ae.wireframe===!0){if(Ye=M.getWireframeAttribute(re),Ye===void 0)return;yt=2}const Tt=re.drawRange,ft=re.attributes.position;let Ht=Tt.start*yt,ln=(Tt.start+Tt.count)*yt;Pe!==null&&(Ht=Math.max(Ht,Pe.start*yt),ln=Math.min(ln,(Pe.start+Pe.count)*yt)),Ye!==null?(Ht=Math.max(Ht,0),ln=Math.min(ln,Ye.count)):ft!=null&&(Ht=Math.max(Ht,0),ln=Math.min(ln,ft.count));const Rn=ln-Ht;if(Rn<0||Rn===1/0)return;He.setup(q,ae,Qe,re,Ye);let xn,un=Xe;if(Ye!==null&&(xn=I.get(Ye),un=bt,un.setIndex(xn)),q.isMesh)ae.wireframe===!0?(nt.setLineWidth(ae.wireframeLinewidth*Kn()),un.setMode(O.LINES)):un.setMode(O.TRIANGLES);else if(q.isLine){let mt=ae.linewidth;mt===void 0&&(mt=1),nt.setLineWidth(mt*Kn()),q.isLineSegments?un.setMode(O.LINES):q.isLineLoop?un.setMode(O.LINE_LOOP):un.setMode(O.LINE_STRIP)}else q.isPoints?un.setMode(O.POINTS):q.isSprite&&un.setMode(O.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)os("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),un.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(It.get("WEBGL_multi_draw"))un.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const mt=q._multiDrawStarts,In=q._multiDrawCounts,Kt=q._multiDrawCount,qi=Ye?I.get(Ye).bytesPerElement:1,ea=it.get(ae).currentProgram.getUniforms();for(let Yi=0;Yi<Kt;Yi++)ea.setValue(O,"_gl_DrawID",Yi),un.render(mt[Yi]/qi,In[Yi])}else if(q.isInstancedMesh)un.renderInstances(Ht,Rn,q.count);else if(re.isInstancedBufferGeometry){const mt=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,In=Math.min(re.instanceCount,mt);un.renderInstances(Ht,Rn,In)}else un.render(Ht,Rn)};function on(T,W,re){T.transparent===!0&&T.side===Ki&&T.forceSinglePass===!1?(T.side=Mn,T.needsUpdate=!0,Xi(T,W,re),T.side=Yt,T.needsUpdate=!0,Xi(T,W,re),T.side=Ki):Xi(T,W,re)}this.compile=function(T,W,re=null){re===null&&(re=T),y=ct.get(re),y.init(W),J.push(y),re.traverseVisible(function(q){q.isLight&&q.layers.test(W.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),T!==re&&T.traverseVisible(function(q){q.isLight&&q.layers.test(W.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),y.setupLights();const ae=new Set;return T.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Pe=q.material;if(Pe)if(Array.isArray(Pe))for(let Ve=0;Ve<Pe.length;Ve++){const Qe=Pe[Ve];on(Qe,re,q),ae.add(Qe)}else on(Pe,re,q),ae.add(Pe)}),y=J.pop(),ae},this.compileAsync=function(T,W,re=null){const ae=this.compile(T,W,re);return new Promise(q=>{function Pe(){if(ae.forEach(function(Ve){it.get(Ve).currentProgram.isReady()&&ae.delete(Ve)}),ae.size===0){q(T);return}setTimeout(Pe,10)}It.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let Jt=null;function is(T){Jt&&Jt(T)}function Wi(){Es.stop()}function Zh(){Es.start()}const Es=new nh;Es.setAnimationLoop(is),typeof self<"u"&&Es.setContext(self),this.setAnimationLoop=function(T){Jt=T,Fe.setAnimationLoop(T),T===null?Es.stop():Es.start()},Fe.addEventListener("sessionstart",Wi),Fe.addEventListener("sessionend",Zh),this.render=function(T,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(ce===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),Fe.enabled===!0&&Fe.isPresenting===!0&&(Fe.cameraAutoUpdate===!0&&Fe.updateCamera(W),W=Fe.getCamera()),T.isScene===!0&&T.onBeforeRender(k,T,W,ye),y=ct.get(T,J.length),y.init(W),J.push(y),Ee.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),zn.setFromProjectionMatrix(Ee,uc,W.reversedDepth),ve=this.localClippingEnabled,fn=Oe.init(this.clippingPlanes,ve),C=pe.get(T,ie.length),C.init(),ie.push(C),Fe.enabled===!0&&Fe.isPresenting===!0){const Pe=k.xr.getDepthSensingMesh();Pe!==null&&zl(Pe,W,-1/0,k.sortObjects)}zl(T,W,0,k.sortObjects),C.finish(),k.sortObjects===!0&&C.sort(rt,gt),Zt=Fe.enabled===!1||Fe.isPresenting===!1||Fe.hasDepthSensing()===!1,Zt&&at.addToRenderList(C,T),this.info.render.frame++,fn===!0&&Oe.beginShadows();const re=y.state.shadowsArray;st.render(re,T,W),fn===!0&&Oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const ae=C.opaque,q=C.transmissive;if(y.setupLights(),W.isArrayCamera){const Pe=W.cameras;if(q.length>0)for(let Ve=0,Qe=Pe.length;Ve<Qe;Ve++){const Ye=Pe[Ve];Gl(ae,q,T,Ye)}Zt&&at.render(T);for(let Ve=0,Qe=Pe.length;Ve<Qe;Ve++){const Ye=Pe[Ve];Ha(C,T,Ye,Ye.viewport)}}else q.length>0&&Gl(ae,q,T,W),Zt&&at.render(T),Ha(C,T,W);ye!==null&&te===0&&(Ft.updateMultisampleRenderTarget(ye),Ft.updateRenderTargetMipmap(ye)),T.isScene===!0&&T.onAfterRender(k,T,W),He.resetDefaultState(),L=-1,P=null,J.pop(),J.length>0?(y=J[J.length-1],fn===!0&&Oe.setGlobalState(k.clippingPlanes,y.state.camera)):y=null,ie.pop(),ie.length>0?C=ie[ie.length-1]:C=null};function zl(T,W,re,ae){if(T.visible===!1)return;if(T.layers.test(W.layers)){if(T.isGroup)re=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(W);else if(T.isLight)y.pushLight(T),T.castShadow&&y.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||zn.intersectsSprite(T)){ae&&wt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ee);const Ve=K.update(T),Qe=T.material;Qe.visible&&C.push(T,Ve,Qe,re,wt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||zn.intersectsObject(T))){const Ve=K.update(T),Qe=T.material;if(ae&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),wt.copy(T.boundingSphere.center)):(Ve.boundingSphere===null&&Ve.computeBoundingSphere(),wt.copy(Ve.boundingSphere.center)),wt.applyMatrix4(T.matrixWorld).applyMatrix4(Ee)),Array.isArray(Qe)){const Ye=Ve.groups;for(let yt=0,Tt=Ye.length;yt<Tt;yt++){const ft=Ye[yt],Ht=Qe[ft.materialIndex];Ht&&Ht.visible&&C.push(T,Ve,Ht,re,wt.z,ft)}}else Qe.visible&&C.push(T,Ve,Qe,re,wt.z,null)}}const Pe=T.children;for(let Ve=0,Qe=Pe.length;Ve<Qe;Ve++)zl(Pe[Ve],W,re,ae)}function Ha(T,W,re,ae){const q=T.opaque,Pe=T.transmissive,Ve=T.transparent;y.setupLightsView(re),fn===!0&&Oe.setGlobalState(k.clippingPlanes,re),ae&&nt.viewport(Z.copy(ae)),q.length>0&&kl(q,W,re),Pe.length>0&&kl(Pe,W,re),Ve.length>0&&kl(Ve,W,re),nt.buffers.depth.setTest(!0),nt.buffers.depth.setMask(!0),nt.buffers.color.setMask(!0),nt.setPolygonOffset(!1)}function Gl(T,W,re,ae){if((re.isScene===!0?re.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ae.id]===void 0&&(y.state.transmissionRenderTarget[ae.id]=new Ti(1,1,{generateMipmaps:!0,type:It.has("EXT_color_buffer_half_float")||It.has("EXT_color_buffer_float")?an:pn,minFilter:gr,samples:4,stencilBuffer:b,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:we.workingColorSpace}));const Pe=y.state.transmissionRenderTarget[ae.id],Ve=ae.viewport||Z;Pe.setSize(Ve.z*k.transmissionResolutionScale,Ve.w*k.transmissionResolutionScale);const Qe=k.getRenderTarget(),Ye=k.getActiveCubeFace(),yt=k.getActiveMipmapLevel();k.setRenderTarget(Pe),k.getClearColor(Ce),Se=k.getClearAlpha(),Se<1&&k.setClearColor(16777215,.5),k.clear(),Zt&&at.render(re);const Tt=k.toneMapping;k.toneMapping=Vn;const ft=ae.viewport;if(ae.viewport!==void 0&&(ae.viewport=void 0),y.setupLightsView(ae),fn===!0&&Oe.setGlobalState(k.clippingPlanes,ae),kl(T,re,ae),Ft.updateMultisampleRenderTarget(Pe),Ft.updateRenderTargetMipmap(Pe),It.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let ln=0,Rn=W.length;ln<Rn;ln++){const xn=W[ln],un=xn.object,mt=xn.geometry,In=xn.material,Kt=xn.group;if(In.side===Ki&&un.layers.test(ae.layers)){const qi=In.side;In.side=Mn,In.needsUpdate=!0,$h(un,re,ae,mt,In,Kt),In.side=qi,In.needsUpdate=!0,Ht=!0}}Ht===!0&&(Ft.updateMultisampleRenderTarget(Pe),Ft.updateRenderTargetMipmap(Pe))}k.setRenderTarget(Qe,Ye,yt),k.setClearColor(Ce,Se),ft!==void 0&&(ae.viewport=ft),k.toneMapping=Tt}function kl(T,W,re){const ae=W.isScene===!0?W.overrideMaterial:null;for(let q=0,Pe=T.length;q<Pe;q++){const Ve=T[q],Qe=Ve.object,Ye=Ve.geometry,yt=Ve.group;let Tt=Ve.material;Tt.allowOverride===!0&&ae!==null&&(Tt=ae),Qe.layers.test(re.layers)&&$h(Qe,W,re,Ye,Tt,yt)}}function $h(T,W,re,ae,q,Pe){T.onBeforeRender(k,W,re,ae,q,Pe),T.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),q.onBeforeRender(k,W,re,ae,T,Pe),q.transparent===!0&&q.side===Ki&&q.forceSinglePass===!1?(q.side=Mn,q.needsUpdate=!0,k.renderBufferDirect(re,W,ae,q,T,Pe),q.side=Yt,q.needsUpdate=!0,k.renderBufferDirect(re,W,ae,q,T,Pe),q.side=Ki):k.renderBufferDirect(re,W,ae,q,T,Pe),T.onAfterRender(k,W,re,ae,q,Pe)}function Xi(T,W,re){W.isScene!==!0&&(W=ut);const ae=it.get(T),q=y.state.lights,Pe=y.state.shadowsArray,Ve=q.state.version,Qe=fe.getParameters(T,q.state,Pe,W,re),Ye=fe.getProgramCacheKey(Qe);let yt=ae.programs;ae.environment=T.isMeshStandardMaterial?W.environment:null,ae.fog=W.fog,ae.envMap=(T.isMeshStandardMaterial?Cn:ii).get(T.envMap||ae.environment),ae.envMapRotation=ae.environment!==null&&T.envMap===null?W.environmentRotation:T.envMapRotation,yt===void 0&&(T.addEventListener("dispose",he),yt=new Map,ae.programs=yt);let Tt=yt.get(Ye);if(Tt!==void 0){if(ae.currentProgram===Tt&&ae.lightsStateVersion===Ve)return Vc(T,Qe),Tt}else Qe.uniforms=fe.getUniforms(T),T.onBeforeCompile(Qe,k),Tt=fe.acquireProgram(Qe,Ye),yt.set(Ye,Tt),ae.uniforms=Qe.uniforms;const ft=ae.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(ft.clippingPlanes=Oe.uniform),Vc(T,Qe),ae.needsLights=vd(T),ae.lightsStateVersion=Ve,ae.needsLights&&(ft.ambientLightColor.value=q.state.ambient,ft.lightProbe.value=q.state.probe,ft.directionalLights.value=q.state.directional,ft.directionalLightShadows.value=q.state.directionalShadow,ft.spotLights.value=q.state.spot,ft.spotLightShadows.value=q.state.spotShadow,ft.rectAreaLights.value=q.state.rectArea,ft.ltc_1.value=q.state.rectAreaLTC1,ft.ltc_2.value=q.state.rectAreaLTC2,ft.pointLights.value=q.state.point,ft.pointLightShadows.value=q.state.pointShadow,ft.hemisphereLights.value=q.state.hemi,ft.directionalShadowMap.value=q.state.directionalShadowMap,ft.directionalShadowMatrix.value=q.state.directionalShadowMatrix,ft.spotShadowMap.value=q.state.spotShadowMap,ft.spotLightMatrix.value=q.state.spotLightMatrix,ft.spotLightMap.value=q.state.spotLightMap,ft.pointShadowMap.value=q.state.pointShadowMap,ft.pointShadowMatrix.value=q.state.pointShadowMatrix),ae.currentProgram=Tt,ae.uniformsList=null,Tt}function kc(T){if(T.uniformsList===null){const W=T.currentProgram.getUniforms();T.uniformsList=Lo.seqWithValue(W.seq,T.uniforms)}return T.uniformsList}function Vc(T,W){const re=it.get(T);re.outputColorSpace=W.outputColorSpace,re.batching=W.batching,re.batchingColor=W.batchingColor,re.instancing=W.instancing,re.instancingColor=W.instancingColor,re.instancingMorph=W.instancingMorph,re.skinning=W.skinning,re.morphTargets=W.morphTargets,re.morphNormals=W.morphNormals,re.morphColors=W.morphColors,re.morphTargetsCount=W.morphTargetsCount,re.numClippingPlanes=W.numClippingPlanes,re.numIntersection=W.numClipIntersection,re.vertexAlphas=W.vertexAlphas,re.vertexTangents=W.vertexTangents,re.toneMapping=W.toneMapping}function Vl(T,W,re,ae,q){W.isScene!==!0&&(W=ut),Ft.resetTextureUnits();const Pe=W.fog,Ve=ae.isMeshStandardMaterial?W.environment:null,Qe=ye===null?k.outputColorSpace:ye.isXRRenderTarget===!0?ye.texture.colorSpace:dn,Ye=(ae.isMeshStandardMaterial?Cn:ii).get(ae.envMap||Ve),yt=ae.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,Tt=!!re.attributes.tangent&&(!!ae.normalMap||ae.anisotropy>0),ft=!!re.morphAttributes.position,Ht=!!re.morphAttributes.normal,ln=!!re.morphAttributes.color;let Rn=Vn;ae.toneMapped&&(ye===null||ye.isXRRenderTarget===!0)&&(Rn=k.toneMapping);const xn=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,un=xn!==void 0?xn.length:0,mt=it.get(ae),In=y.state.lights;if(fn===!0&&(ve===!0||T!==P)){const ci=T===P&&ae.id===L;Oe.setState(ae,T,ci)}let Kt=!1;ae.version===mt.__version?(mt.needsLights&&mt.lightsStateVersion!==In.state.version||mt.outputColorSpace!==Qe||q.isBatchedMesh&&mt.batching===!1||!q.isBatchedMesh&&mt.batching===!0||q.isBatchedMesh&&mt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&mt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&mt.instancing===!1||!q.isInstancedMesh&&mt.instancing===!0||q.isSkinnedMesh&&mt.skinning===!1||!q.isSkinnedMesh&&mt.skinning===!0||q.isInstancedMesh&&mt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&mt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&mt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&mt.instancingMorph===!1&&q.morphTexture!==null||mt.envMap!==Ye||ae.fog===!0&&mt.fog!==Pe||mt.numClippingPlanes!==void 0&&(mt.numClippingPlanes!==Oe.numPlanes||mt.numIntersection!==Oe.numIntersection)||mt.vertexAlphas!==yt||mt.vertexTangents!==Tt||mt.morphTargets!==ft||mt.morphNormals!==Ht||mt.morphColors!==ln||mt.toneMapping!==Rn||mt.morphTargetsCount!==un)&&(Kt=!0):(Kt=!0,mt.__version=ae.version);let qi=mt.currentProgram;Kt===!0&&(qi=Xi(ae,W,q));let ea=!1,Yi=!1,Wa=!1;const cn=qi.getUniforms(),sr=mt.uniforms;if(nt.useProgram(qi.program)&&(ea=!0,Yi=!0,Wa=!0),ae.id!==L&&(L=ae.id,Yi=!0),ea||P!==T){nt.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),cn.setValue(O,"projectionMatrix",T.projectionMatrix),cn.setValue(O,"viewMatrix",T.matrixWorldInverse);const bi=cn.map.cameraPosition;bi!==void 0&&bi.setValue(O,tt.setFromMatrixPosition(T.matrixWorld)),St.logarithmicDepthBuffer&&cn.setValue(O,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(ae.isMeshPhongMaterial||ae.isMeshToonMaterial||ae.isMeshLambertMaterial||ae.isMeshBasicMaterial||ae.isMeshStandardMaterial||ae.isShaderMaterial)&&cn.setValue(O,"isOrthographic",T.isOrthographicCamera===!0),P!==T&&(P=T,Yi=!0,Wa=!0)}if(q.isSkinnedMesh){cn.setOptional(O,q,"bindMatrix"),cn.setOptional(O,q,"bindMatrixInverse");const ci=q.skeleton;ci&&(ci.boneTexture===null&&ci.computeBoneTexture(),cn.setValue(O,"boneTexture",ci.boneTexture,Ft))}q.isBatchedMesh&&(cn.setOptional(O,q,"batchingTexture"),cn.setValue(O,"batchingTexture",q._matricesTexture,Ft),cn.setOptional(O,q,"batchingIdTexture"),cn.setValue(O,"batchingIdTexture",q._indirectTexture,Ft),cn.setOptional(O,q,"batchingColorTexture"),q._colorsTexture!==null&&cn.setValue(O,"batchingColorTexture",q._colorsTexture,Ft));const ar=re.morphAttributes;if((ar.position!==void 0||ar.normal!==void 0||ar.color!==void 0)&&Ue.update(q,re,qi),(Yi||mt.receiveShadow!==q.receiveShadow)&&(mt.receiveShadow=q.receiveShadow,cn.setValue(O,"receiveShadow",q.receiveShadow)),ae.isMeshGouraudMaterial&&ae.envMap!==null&&(sr.envMap.value=Ye,sr.flipEnvMap.value=Ye.isCubeTexture&&Ye.isRenderTargetTexture===!1?-1:1),ae.isMeshStandardMaterial&&ae.envMap===null&&W.environment!==null&&(sr.envMapIntensity.value=W.environmentIntensity),Yi&&(cn.setValue(O,"toneMappingExposure",k.toneMappingExposure),mt.needsLights&&yd(sr,Wa),Pe&&ae.fog===!0&&Te.refreshFogUniforms(sr,Pe),Te.refreshMaterialUniforms(sr,ae,_e,Le,y.state.transmissionRenderTarget[T.id]),Lo.upload(O,kc(mt),sr,Ft)),ae.isShaderMaterial&&ae.uniformsNeedUpdate===!0&&(Lo.upload(O,kc(mt),sr,Ft),ae.uniformsNeedUpdate=!1),ae.isSpriteMaterial&&cn.setValue(O,"center",q.center),cn.setValue(O,"modelViewMatrix",q.modelViewMatrix),cn.setValue(O,"normalMatrix",q.normalMatrix),cn.setValue(O,"modelMatrix",q.matrixWorld),ae.isShaderMaterial||ae.isRawShaderMaterial){const ci=ae.uniformsGroups;for(let bi=0,Hc=ci.length;bi<Hc;bi++){const ta=ci[bi];zt.update(ta,qi),zt.bind(ta,qi)}}return qi}function yd(T,W){T.ambientLightColor.needsUpdate=W,T.lightProbe.needsUpdate=W,T.directionalLights.needsUpdate=W,T.directionalLightShadows.needsUpdate=W,T.pointLights.needsUpdate=W,T.pointLightShadows.needsUpdate=W,T.spotLights.needsUpdate=W,T.spotLightShadows.needsUpdate=W,T.rectAreaLights.needsUpdate=W,T.hemisphereLights.needsUpdate=W}function vd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return ee},this.getActiveMipmapLevel=function(){return te},this.getRenderTarget=function(){return ye},this.setRenderTargetTextures=function(T,W,re){const ae=it.get(T);ae.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,ae.__autoAllocateDepthBuffer===!1&&(ae.__useRenderToTexture=!1),it.get(T.texture).__webglTexture=W,it.get(T.depthTexture).__webglTexture=ae.__autoAllocateDepthBuffer?void 0:re,ae.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,W){const re=it.get(T);re.__webglFramebuffer=W,re.__useDefaultFramebuffer=W===void 0};const Hl=O.createFramebuffer();this.setRenderTarget=function(T,W=0,re=0){ye=T,ee=W,te=re;let ae=!0,q=null,Pe=!1,Ve=!1;if(T){const Ye=it.get(T);if(Ye.__useDefaultFramebuffer!==void 0)nt.bindFramebuffer(O.FRAMEBUFFER,null),ae=!1;else if(Ye.__webglFramebuffer===void 0)Ft.setupRenderTarget(T);else if(Ye.__hasExternalTextures)Ft.rebindTextures(T,it.get(T.texture).__webglTexture,it.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const ft=T.depthTexture;if(Ye.__boundDepthTexture!==ft){if(ft!==null&&it.has(ft)&&(T.width!==ft.image.width||T.height!==ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ft.setupDepthRenderbuffer(T)}}const yt=T.texture;(yt.isData3DTexture||yt.isDataArrayTexture||yt.isCompressedArrayTexture)&&(Ve=!0);const Tt=it.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Tt[W])?q=Tt[W][re]:q=Tt[W],Pe=!0):T.samples>0&&Ft.useMultisampledRTT(T)===!1?q=it.get(T).__webglMultisampledFramebuffer:Array.isArray(Tt)?q=Tt[re]:q=Tt,Z.copy(T.viewport),de.copy(T.scissor),Ae=T.scissorTest}else Z.copy(Ot).multiplyScalar(_e).floor(),de.copy(nn).multiplyScalar(_e).floor(),Ae=On;if(re!==0&&(q=Hl),nt.bindFramebuffer(O.FRAMEBUFFER,q)&&ae&&nt.drawBuffers(T,q),nt.viewport(Z),nt.scissor(de),nt.setScissorTest(Ae),Pe){const Ye=it.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,Ye.__webglTexture,re)}else if(Ve){const Ye=W;for(let yt=0;yt<T.textures.length;yt++){const Tt=it.get(T.textures[yt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+yt,Tt.__webglTexture,re,Ye)}}else if(T!==null&&re!==0){const Ye=it.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ye.__webglTexture,re)}L=-1},this.readRenderTargetPixels=function(T,W,re,ae,q,Pe,Ve,Qe=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ye=it.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ve!==void 0&&(Ye=Ye[Ve]),Ye){nt.bindFramebuffer(O.FRAMEBUFFER,Ye);try{const yt=T.textures[Qe],Tt=yt.format,ft=yt.type;if(!St.textureFormatReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!St.textureTypeReadable(ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=T.width-ae&&re>=0&&re<=T.height-q&&(T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Qe),O.readPixels(W,re,ae,q,ot.convert(Tt),ot.convert(ft),Pe))}finally{const yt=ye!==null?it.get(ye).__webglFramebuffer:null;nt.bindFramebuffer(O.FRAMEBUFFER,yt)}}},this.readRenderTargetPixelsAsync=async function(T,W,re,ae,q,Pe,Ve,Qe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ye=it.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ve!==void 0&&(Ye=Ye[Ve]),Ye)if(W>=0&&W<=T.width-ae&&re>=0&&re<=T.height-q){nt.bindFramebuffer(O.FRAMEBUFFER,Ye);const yt=T.textures[Qe],Tt=yt.format,ft=yt.type;if(!St.textureFormatReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!St.textureTypeReadable(ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ht=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ht),O.bufferData(O.PIXEL_PACK_BUFFER,Pe.byteLength,O.STREAM_READ),T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Qe),O.readPixels(W,re,ae,q,ot.convert(Tt),ot.convert(ft),0);const ln=ye!==null?it.get(ye).__webglFramebuffer:null;nt.bindFramebuffer(O.FRAMEBUFFER,ln);const Rn=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await au(O,Rn,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ht),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Pe),O.deleteBuffer(Ht),O.deleteSync(Rn),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,W=null,re=0){const ae=Math.pow(2,-re),q=Math.floor(T.image.width*ae),Pe=Math.floor(T.image.height*ae),Ve=W!==null?W.x:0,Qe=W!==null?W.y:0;Ft.setTexture2D(T,0),O.copyTexSubImage2D(O.TEXTURE_2D,re,0,0,Ve,Qe,q,Pe),nt.unbindTexture()};const Wl=O.createFramebuffer(),zo=O.createFramebuffer();this.copyTextureToTexture=function(T,W,re=null,ae=null,q=0,Pe=null){Pe===null&&(q!==0?(os("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Pe=q,q=0):Pe=0);let Ve,Qe,Ye,yt,Tt,ft,Ht,ln,Rn;const xn=T.isCompressedTexture?T.mipmaps[Pe]:T.image;if(re!==null)Ve=re.max.x-re.min.x,Qe=re.max.y-re.min.y,Ye=re.isBox3?re.max.z-re.min.z:1,yt=re.min.x,Tt=re.min.y,ft=re.isBox3?re.min.z:0;else{const ar=Math.pow(2,-q);Ve=Math.floor(xn.width*ar),Qe=Math.floor(xn.height*ar),T.isDataArrayTexture?Ye=xn.depth:T.isData3DTexture?Ye=Math.floor(xn.depth*ar):Ye=1,yt=0,Tt=0,ft=0}ae!==null?(Ht=ae.x,ln=ae.y,Rn=ae.z):(Ht=0,ln=0,Rn=0);const un=ot.convert(W.format),mt=ot.convert(W.type);let In;W.isData3DTexture?(Ft.setTexture3D(W,0),In=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(Ft.setTexture2DArray(W,0),In=O.TEXTURE_2D_ARRAY):(Ft.setTexture2D(W,0),In=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const Kt=O.getParameter(O.UNPACK_ROW_LENGTH),qi=O.getParameter(O.UNPACK_IMAGE_HEIGHT),ea=O.getParameter(O.UNPACK_SKIP_PIXELS),Yi=O.getParameter(O.UNPACK_SKIP_ROWS),Wa=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,xn.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,xn.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,yt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Tt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ft);const cn=T.isDataArrayTexture||T.isData3DTexture,sr=W.isDataArrayTexture||W.isData3DTexture;if(T.isDepthTexture){const ar=it.get(T),ci=it.get(W),bi=it.get(ar.__renderTarget),Hc=it.get(ci.__renderTarget);nt.bindFramebuffer(O.READ_FRAMEBUFFER,bi.__webglFramebuffer),nt.bindFramebuffer(O.DRAW_FRAMEBUFFER,Hc.__webglFramebuffer);for(let ta=0;ta<Ye;ta++)cn&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,it.get(T).__webglTexture,q,ft+ta),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,it.get(W).__webglTexture,Pe,Rn+ta)),O.blitFramebuffer(yt,Tt,Ve,Qe,Ht,ln,Ve,Qe,O.DEPTH_BUFFER_BIT,O.NEAREST);nt.bindFramebuffer(O.READ_FRAMEBUFFER,null),nt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(q!==0||T.isRenderTargetTexture||it.has(T)){const ar=it.get(T),ci=it.get(W);nt.bindFramebuffer(O.READ_FRAMEBUFFER,Wl),nt.bindFramebuffer(O.DRAW_FRAMEBUFFER,zo);for(let bi=0;bi<Ye;bi++)cn?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ar.__webglTexture,q,ft+bi):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ar.__webglTexture,q),sr?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ci.__webglTexture,Pe,Rn+bi):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ci.__webglTexture,Pe),q!==0?O.blitFramebuffer(yt,Tt,Ve,Qe,Ht,ln,Ve,Qe,O.COLOR_BUFFER_BIT,O.NEAREST):sr?O.copyTexSubImage3D(In,Pe,Ht,ln,Rn+bi,yt,Tt,Ve,Qe):O.copyTexSubImage2D(In,Pe,Ht,ln,yt,Tt,Ve,Qe);nt.bindFramebuffer(O.READ_FRAMEBUFFER,null),nt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else sr?T.isDataTexture||T.isData3DTexture?O.texSubImage3D(In,Pe,Ht,ln,Rn,Ve,Qe,Ye,un,mt,xn.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(In,Pe,Ht,ln,Rn,Ve,Qe,Ye,un,xn.data):O.texSubImage3D(In,Pe,Ht,ln,Rn,Ve,Qe,Ye,un,mt,xn):T.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Pe,Ht,ln,Ve,Qe,un,mt,xn.data):T.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Pe,Ht,ln,xn.width,xn.height,un,xn.data):O.texSubImage2D(O.TEXTURE_2D,Pe,Ht,ln,Ve,Qe,un,mt,xn);O.pixelStorei(O.UNPACK_ROW_LENGTH,Kt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,qi),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ea),O.pixelStorei(O.UNPACK_SKIP_ROWS,Yi),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Wa),Pe===0&&W.generateMipmaps&&O.generateMipmap(In),nt.unbindTexture()},this.initRenderTarget=function(T){it.get(T).__webglFramebuffer===void 0&&Ft.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Ft.setTextureCube(T,0):T.isData3DTexture?Ft.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ft.setTexture2DArray(T,0):Ft.setTexture2D(T,0),nt.unbindTexture()},this.resetState=function(){ee=0,te=0,ye=null,nt.reset(),He.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return uc}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(f){this._outputColorSpace=f;const h=this.getContext();h.drawingBufferColorSpace=we._getDrawingBufferColorSpace(f),h.unpackColorSpace=we._getUnpackColorSpace()}}return Object.assign(Pn,{ACESFilmicToneMapping:Qo,AddEquation:Ei,AddOperation:Hr,AdditiveBlending:ma,AgXToneMapping:Rs,AlphaFormat:Dn,AlwaysCompare:io,AlwaysDepth:qr,ArrayCamera:jc,BackSide:Mn,BoxGeometry:Qt,BufferAttribute:fi,BufferGeometry:Ui,ByteType:so,CineonToneMapping:jo,ClampToEdgeWrapping:Yr,Color:At,ColorManagement:we,ConstantAlphaFactor:Ir,ConstantColorFactor:Ls,CubeReflectionMapping:Sn,CubeRefractionMapping:En,CubeTexture:$o,CubeUVReflectionMapping:di,CullFaceBack:fa,CullFaceFront:Qa,CullFaceNone:nl,CustomBlending:ja,CustomToneMapping:Ko,Data3DTexture:Gr,DataArrayTexture:Er,DepthFormat:$r,DepthStencilFormat:oi,DepthTexture:kr,DoubleSide:Ki,DstAlphaFactor:fr,DstColorFactor:ha,EqualCompare:ds,EqualDepth:cs,EquirectangularReflectionMapping:An,EquirectangularRefractionMapping:kn,Euler:ze,EventDispatcher:Qc,ExternalTexture:hc,FloatType:dt,FrontSide:Yt,Frustum:Is,GLSL3:Ya,GreaterCompare:_a,GreaterDepth:pr,GreaterEqualCompare:no,GreaterEqualDepth:Xr,HalfFloatType:an,IntType:hn,Layers:mi,LessCompare:Ns,LessDepth:Xn,LessEqualCompare:pi,LessEqualDepth:Ps,LinearFilter:Fi,LinearMipmapLinearFilter:gr,LinearMipmapNearestFilter:hs,LinearSRGBColorSpace:dn,LinearToneMapping:Vr,LinearTransfer:ls,Matrix3:Gt,Matrix4:qe,MaxEquation:mr,Mesh:vn,MeshBasicMaterial:Rt,MeshDepthMaterial:el,MeshDistanceMaterial:Bi,MinEquation:eo,MirroredRepeatWrapping:ga,MixOperation:$a,MultiplyBlending:pa,MultiplyOperation:ca,NearestFilter:Wn,NearestMipmapLinearFilter:us,NearestMipmapNearestFilter:Fs,NeutralToneMapping:Cs,NeverCompare:ro,NeverDepth:Ds,NoBlending:Zi,NoColorSpace:wi,NoToneMapping:Vn,NormalBlending:Qi,NotEqualCompare:to,NotEqualDepth:Oi,ObjectSpaceNormalMap:wr,OneFactor:Wr,OneMinusConstantAlphaFactor:gi,OneMinusConstantColorFactor:_i,OneMinusDstAlphaFactor:dr,OneMinusDstColorFactor:or,OneMinusSrcAlphaFactor:lr,OneMinusSrcColorFactor:Ja,OrthographicCamera:Mt,PCFShadowMap:oa,PCFSoftShadowMap:Za,PMREMGenerator:dl,PerspectiveCamera:$n,Plane:jt,PlaneGeometry:lt,RED_GREEN_RGTC2_Format:ho,RED_RGTC1_Format:oc,REVISION:va,RGBADepthPacking:Cr,RGBAFormat:Nt,RGBAIntegerFormat:me,RGBA_ASTC_10x10_Format:tc,RGBA_ASTC_10x5_Format:Ql,RGBA_ASTC_10x6_Format:jl,RGBA_ASTC_10x8_Format:ec,RGBA_ASTC_12x10_Format:nc,RGBA_ASTC_12x12_Format:ic,RGBA_ASTC_4x4_Format:Ci,RGBA_ASTC_5x4_Format:lo,RGBA_ASTC_5x5_Format:co,RGBA_ASTC_6x5_Format:ya,RGBA_ASTC_6x6_Format:$l,RGBA_ASTC_8x5_Format:Kr,RGBA_ASTC_8x6_Format:Jl,RGBA_ASTC_8x8_Format:Kl,RGBA_BPTC_Format:rc,RGBA_ETC2_EAC_Format:oo,RGBA_PVRTC_2BPPV1_Format:cr,RGBA_PVRTC_4BPPV1_Format:ms,RGBA_S3TC_DXT1_Format:tn,RGBA_S3TC_DXT3_Format:Xt,RGBA_S3TC_DXT5_Format:qn,RGBFormat:S,RGB_BPTC_SIGNED_Format:sc,RGB_BPTC_UNSIGNED_Format:ac,RGB_ETC1_Format:xr,RGB_ETC2_Format:Gs,RGB_PVRTC_2BPPV1_Format:Lr,RGB_PVRTC_4BPPV1_Format:zi,RGB_S3TC_DXT1_Format:xt,RGFormat:oe,RGIntegerFormat:Me,RedFormat:z,RedIntegerFormat:V,ReinhardToneMapping:la,RepeatWrapping:Zr,ReverseSubtractEquation:Rr,SIGNED_RED_GREEN_RGTC2_Format:cc,SIGNED_RED_RGTC1_Format:lc,SRGBColorSpace:th,SRGBTransfer:$e,ShaderChunk:Ut,ShaderLib:wn,ShaderMaterial:Ln,ShortType:ao,SrcAlphaFactor:Ka,SrcAlphaSaturateFactor:tl,SrcColorFactor:ua,SubtractEquation:mn,SubtractiveBlending:Us,TangentSpaceNormalMap:Ai,Texture:Jo,Uint16BufferAttribute:Ni,Uint32BufferAttribute:Fn,UniformsLib:ke,UniformsUtils:Ji,UnsignedByteType:pn,UnsignedInt101111Type:xa,UnsignedInt248Type:Pr,UnsignedInt5999Type:ps,UnsignedIntType:_r,UnsignedShort4444Type:Os,UnsignedShort5551Type:zs,UnsignedShortType:Jr,VSMShadowMap:$i,Vector2:$t,Vector3:Ct,Vector4:Hn,WebGLCoordinateSystem:uc,WebGLCubeRenderTarget:ti,WebGLRenderTarget:Ti,WebGLRenderer:Yh,WebGLUtils:Bo,WebXRController:il,ZeroFactor:da,createCanvasElement:eh}),Pn})();window.THREE=THREE,(function(Pn,Gt){const $t=Gt();typeof module=="object"&&module.exports&&(module.exports=$t),Pn&&(Pn.RangerAtomicMotion=$t)})(typeof window<"u"?window:null,function(){"use strict";const Pn=(ze,qe=0,we=1)=>Math.max(qe,Math.min(we,ze)),Gt=(ze,qe,we)=>ze.map(($e,lt)=>$e+(qe[lt]-$e)*we),$t=(ze,qe)=>Number.isFinite(ze)?ze:qe;function At(ze,qe){let we=(Math.imul(ze+1,374761393)^Math.imul(qe|0,668265263))>>>0;return we=Math.imul(we^we>>>13,1274126177),((we^we>>>16)>>>0)/4294967296}function Be(ze){ze=ze||{};const qe=$t(ze.collisionAt,2),we=Math.max(qe,$t(ze.electronAt,qe+.35)),$e=Math.max(qe,$t(ze.ionAt,we+.4)),lt=Math.max(we+.1,$t(ze.avalancheAt,we+3)),Yt=Math.max(lt+.8,$t(ze.pulseAt,lt+4.5)),Lt=Math.max(Yt+.5,$t(ze.readyAt,Yt+5));return{collisionAt:qe,electronAt:we,ionAt:$e,avalancheAt:lt,pulseAt:Yt,readyAt:Lt,radiationStart:$t(ze.radiationStart,qe-2),seed:Math.trunc($t(ze.seed,7391)),gasTime:ze.gasTime}}function Ct(ze,qe,we){const $e=we.seed===void 0?7391:we.seed,lt=dt=>At(ze*11+dt,$e),Yt=.65+lt(1)*.65;let Lt,hn;if(ze===0)Lt=[3,0,-.35],hn=[1.05,.9,.65];else if(ze<=15){const dt=11.95+lt(2)*.6,Nt=-.2+lt(3)*.75;Lt=[Math.cos(Nt)*dt,Math.sin(Nt)*dt,(lt(4)-.5)*1.2],hn=[.27,.3,.55]}else{const dt=Math.sqrt((ze-15-.5)/36)*19.5,Nt=ze*2.39996323+lt(5)*.5;Lt=[Math.cos(Nt)*dt,Math.sin(Nt)*dt,0],hn=[1.1,1.1,2.8]}const an=Lt.map((dt,Nt)=>dt+hn[Nt]*(.72*Math.sin(qe*Yt*(1+Nt*.17)+lt(Nt+6)*Math.PI*2)+.28*Math.sin(qe*Yt*1.93+lt(Nt+9)*Math.PI*2))),pn=Math.hypot(an[0],an[1]);return pn>21.2&&(an[0]*=21.2/pn,an[1]*=21.2/pn),an[2]=Pn(an[2],-3.5,3.5),an}function di(ze){const qe=Math.hypot(ze[0],ze[1])||1;return[ze[0]/qe*13.8,ze[1]/qe*13.8,.2]}function vn(ze){const qe=Be(ze),we=[{index:0,type:"primary",atomIndex:0,parentElectron:null,time:qe.collisionAt,position:Ct(0,qe.collisionAt,qe)}],$e=qe.pulseAt-qe.avalancheAt-.2;for(let lt=1;lt<=15;lt++){const Yt=Math.floor(Math.log2(lt)),Lt=lt-Math.pow(2,Yt),hn=.1+Yt*.22+At(lt+300,qe.seed)*.018,an=qe.avalancheAt+$e*hn;we.push({index:lt,type:"secondary",atomIndex:lt,parentElectron:Lt,generation:Yt,time:an,position:Ct(lt,an,qe)})}return{config:qe,events:we}}function Qt(ze,qe,we,$e){const lt=we.events[ze],Yt=we.config,Lt=ze===0?Math.max(0,Math.min(.25,Yt.electronAt-lt.time)):0,hn=[-.7161,1.8414,.3069],an=Math.hypot(...hn),pn=ze===0&&Lt>0?lt.position.map((jt,An)=>jt+hn[An]/an*2):lt.position;if(ze===0&&qe<=Yt.electronAt)return Gt(lt.position,pn,Lt>0?Pn((qe-lt.time)/Lt):0);const dt=[{time:ze===0?Yt.electronAt:lt.time+.04,position:pn}];for(const jt of we.events)jt.parentElectron===ze&&dt.push({time:jt.time,position:jt.position});const Nt=dt[dt.length-1];if(dt.push({time:Yt.pulseAt,position:di(Nt.position)}),ze===0&&qe<Yt.avalancheAt&&Number.isFinite($e)&&(qe=dt[0].time+Pn($e)*(dt[1].time-dt[0].time)),qe<=dt[0].time)return pn.slice();for(let jt=1;jt<dt.length;jt++)if(qe<=dt[jt].time){const An=Pn((qe-dt[jt-1].time)/(dt[jt].time-dt[jt-1].time));return Gt(dt[jt-1].position,dt[jt].position,An)}return dt[dt.length-1].position.slice()}function Ln(ze,qe){const lt=qe.readyAt-qe.pulseAt,Yt=hn=>(hn=Pn(hn),hn*hn*(3-2*hn));let Lt;return ze<qe.pulseAt?Lt=1-(1-.28)*Yt((ze-(qe.pulseAt-.5))/.5):ze<=qe.readyAt?Lt=.28+(.78-.28)*Yt((ze-qe.pulseAt)/lt):Lt=.78+(1-.78)*Yt((ze-qe.readyAt)/Math.max(.5,lt*.18)),{fieldStrength:Lt,measurementReady:Lt>=.78-1e-12,qualitative:!0}}function Mn(ze,qe){const we=.7+ze.index/15*.72+(At(ze.index+711,qe.seed)-.5)*.04;return Math.max(Math.max(ze.time,qe.ionAt)+.25,qe.pulseAt+(qe.readyAt-qe.pulseAt)*we)}function as(ze,qe){const we=vn(qe),$e=we.config;ze=$t(ze,0);const lt=qe&&qe.chargeProgress||{},Yt=[],Lt=[],hn=[],an=Ln(ze,$e),pn=we.events.map(Mt=>Mn(Mt,$e)),dt=we.events.map((Mt,$n)=>ze>=pn[$n]||$n===0&&ze>Math.max(Mt.time,$e.ionAt)&&Number.isFinite(lt.ion)&&lt.ion>=1);for(let Mt=0;Mt<52;Mt++){const $n=we.events[Mt],Vn=!!$n&&ze>=$n.time&&!dt[Mt],Rt=Mt>15&&ze>$e.collisionAt?$t($e.gasTime,ze):ze;Yt.push({index:Mt,position:Ct(Mt,Rt,$e),visible:!Vn})}for(const Mt of we.events){const $n=ze>=Mt.time;Lt.push({index:Mt.index,bornAt:Mt.time,position:Qt(Mt.index,ze,we,Mt.index===0?lt.electron:void 0),visible:$n&&ze<$e.pulseAt});const Vn=Math.max(Mt.time,$e.ionAt),Rt=ze<=Vn?0:Mt.index===0&&Number.isFinite(lt.ion)?Pn(lt.ion):Pn((ze-Vn)/Math.max(.001,pn[Mt.index]-Vn));hn.push({index:Mt.index,bornAt:Mt.time,neutralizedAt:pn[Mt.index],neutralized:dt[Mt.index],driftProgress:Rt,position:Gt(Mt.position,[Mt.position[0],Mt.position[1],5.4],Rt),visible:$n&&!dt[Mt.index]})}const Nt=we.events[0].position,jt=Pn((ze-$e.radiationStart)/($e.collisionAt-$e.radiationStart)),An=[Nt[0],Nt[1],-45],kn=Gt(An,Nt,jt),ti=we.events.map(Mt=>({...Mt,position:Mt.position.slice(),occurred:ze>=Mt.time,projectileAtContact:Mt.parentElectron===null?Nt.slice():Qt(Mt.parentElectron,Mt.time,we),electronAtBirth:Mt.position.slice(),ionAtBirth:Mt.position.slice()})),Sn=hn.filter(Mt=>Mt.visible).length,En=hn.filter(Mt=>ze>=Mt.bornAt).length;return{time:ze,config:$e,space:"sensor-local-mm",atoms:Yt,electrons:Lt,ions:hn,events:ti,primary:ti[0],radiation:{position:kn,start:An,contact:Nt.slice(),visible:ze>=$e.radiationStart&&ze<=$e.collisionAt},fieldStrength:an.fieldStrength,measurementReady:an.measurementReady,avalanchePermitted:an.measurementReady,recovered:an.measurementReady,neutralization:{remainingIons:Sn,totalBorn:En,allNeutralized:En===ti.length&&Sn===0,lastArrivalAt:Math.max(...pn)},fieldIsQualitative:!0}}return{evaluate:as,atomPosition:Ct,schedule:vn,normalize:Be}}),(function(Pn){"use strict";Pn.createRangerViewer=function($t,At){At=At||{};const Be=At.THREE||(typeof THREE<"u"?THREE:Pn.THREE);if(!Be)throw new Error("Three.js fehlt.");const Ct=new Be.Scene;Ct.background=new Be.Color(At.background||"#eaf0f5");const di=new Be.PerspectiveCamera(34,1,1,1800),vn=new Be.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!!At.preserveDrawingBuffer});vn.setPixelRatio(Math.min(Pn.devicePixelRatio||1,At.pixelRatio||1.75)),vn.outputColorSpace=Be.SRGBColorSpace,vn.toneMapping=Be.ACESFilmicToneMapping,vn.toneMappingExposure=1.16,vn.shadowMap.enabled=!0,vn.shadowMap.type=Be.PCFSoftShadowMap;const Qt=vn.domElement;Qt.style.cssText="display:block;width:100%;height:100%;touch-action:none;outline:none;cursor:grab",Qt.tabIndex=0,Qt.setAttribute("role","img"),Qt.setAttribute("aria-label","Drehbares 3D-Modell eines Geiger-M\xFCller-Z\xE4hlers. Ziehen zum Drehen, zwei Finger zum Zoomen."),$t.appendChild(Qt);const Ln=new Be.Group;Ln.name="Radiation Alert Ranger \u2013 Lehrmodell",Ln.userData={units:"mm",exteriorDimensions:[68,140,33],interior:"schematic functional abstraction, not a service drawing",source:"https://seintl.com/products/radiation-alert-ranger/"},Ct.add(Ln);const Mn={},as=[],ze=[],qe=[],we=(S,z,V)=>new Be.Vector3(S,z,V);let $e=0,lt=null,Yt=!1,Lt=!0,hn=0,an=null;const pn=new Set(["window","cathode","anode","gas","voltage","counter","battery"]),dt=we(0,0,0),Nt=dt.clone();let jt=.43,An=.2,kn=280,ti=jt,Sn=An,En=kn;const Mt=new Be.HemisphereLight(15332607,7107201,2.3);Ct.add(Mt);function $n(S,z,V,oe){const Me=new Be.DirectionalLight(S,z);return Me.position.copy(V),Me.castShadow=!!oe,oe&&(Me.shadow.mapSize.set(1024,1024),Me.shadow.camera.left=-190,Me.shadow.camera.right=190,Me.shadow.camera.top=190,Me.shadow.camera.bottom=-190,Me.shadow.normalBias=.7),Ct.add(Me),Me}$n(16777215,3.8,we(-110,190,180),!0),$n(11982079,2.1,we(150,40,-110)),$n(16777215,1,we(20,-70,160));const Vn=new Be.Mesh(new Be.PlaneGeometry(1500,1500),new Be.ShadowMaterial({opacity:.13}));Vn.rotation.x=-Math.PI/2,Vn.position.y=-83,Vn.receiveShadow=!0,Ct.add(Vn);function Rt(S,z){const V=new Be.MeshStandardMaterial(Object.assign({color:S,roughness:.47,metalness:.05},z));return ze.push(V),V.userData.baseOpacity=V.opacity,V.userData.baseColor=V.color.getHex(),V.userData.baseEmissive=V.emissive.getHex(),V}const Zi=()=>Rt(1393307,{roughness:.36}),Ti=()=>Rt(795992,{roughness:.65}),Ui=()=>Rt(10925246,{metalness:.8,roughness:.29});function fi(S,z,V){const oe=new Be.Group;return oe.name=S,oe.userData.partId=S,oe.position.copy(z||we(0,0,0)),Ln.add(oe),Mn[S]||(Mn[S]=oe),as.push({group:oe,base:oe.position.clone(),offset:V||we(0,0,0)}),oe}function dn(S,z,V,oe,Me,me){const xt=new Be.Mesh(z,V);return xt.position.set(oe||0,Me||0,me||0),xt.castShadow=!0,xt.receiveShadow=!0,S.add(xt),xt}function Fi(S,z,V){const oe=new Be.Shape,Me=-S/2,me=-z/2;return oe.moveTo(Me+V,me),oe.lineTo(Me+S-V,me),oe.quadraticCurveTo(Me+S,me,Me+S,me+V),oe.lineTo(Me+S,me+z-V),oe.quadraticCurveTo(Me+S,me+z,Me+S-V,me+z),oe.lineTo(Me+V,me+z),oe.quadraticCurveTo(Me,me+z,Me,me+z-V),oe.lineTo(Me,me+V),oe.quadraticCurveTo(Me,me,Me+V,me),oe}function os(S,z,V){const oe=new Be.ExtrudeGeometry(S,{depth:z,bevelEnabled:!!V,bevelSegments:3,steps:1,bevelSize:V||0,bevelThickness:V||0,curveSegments:10});return oe.translate(0,0,-z/2),oe}function Fn(S,z,V,oe,Me,me,xt,tn,Xt,qn){return dn(S,os(Fi(z,V,Me),oe,qn),me,xt,tn,Xt)}function Ni(S,z,V,oe,Me,me,xt,tn){const Xt=dn(S,new Be.CylinderGeometry(z,z,V,tn||48),oe,Me,me,xt);return Xt.rotation.x=Math.PI/2,Xt}function Ar(S,z,V,oe,Me,me,xt){return dn(S,new Be.TorusGeometry(z,V,8,72),oe,Me,me,xt)}function Hn(S,z,V,oe){const Me=new Be.CatmullRomCurve3(z.map(me=>we.apply(null,me)));return dn(S,new Be.TubeGeometry(Me,Math.max(12,z.length*8),V,7,!1),oe)}function Er(S,z,V,oe,Me,me,xt,tn){const Xt=document.createElement("canvas"),qn=1024,zi=Math.max(128,Math.round(1024*V/z)),Lr=Math.min(1,1024/zi);Xt.width=Math.round(qn*Lr),Xt.height=Math.round(zi*Lr);const ms=Xt.getContext("2d");ms.scale(Lr,Lr),xt(ms,qn,zi);const cr=new Be.CanvasTexture(Xt);cr.colorSpace=Be.SRGBColorSpace,cr.anisotropy=Math.min(4,vn.capabilities.getMaxAnisotropy()),qe.push(cr);const xr=Rt(16777215,{map:cr,transparent:!0,alphaTest:.04,roughness:.66,side:Be.DoubleSide,depthWrite:!1}),Gs=dn(S,new Be.PlaneGeometry(z,V),xr,oe,Me,me);return Gs.castShadow=!1,tn&&(Gs.rotation.y=Math.PI),Gs}function $o(S,z,V,oe,Me){Ni(S,1.25,.55,Ui(),z,V,oe);const me=dn(S,new Be.BoxGeometry(1.6,.27,.15),Rt(2438212),z,V,oe+(Me?-.36:.36));me.rotation.z=.55}const Gr=fi("shell",we(0,0,0),we(-38,12,88)),pi=fi("rear",we(0,0,0),we(-38,0,-82));Fn(Gr,66,138,6,10,Zi(),0,0,12,.8);const kr=Fi(66,138,10),Jo=Fi(60,132,8),Ya=new Be.Path(Jo.getPoints(64));kr.holes.push(Ya),dn(pi,os(kr,23,.3),Zi(),0,0,-2);const oa=Fi(66,138,10),Za=new Be.Path;Za.absarc(0,30,24.2,0,Math.PI*2,!0),oa.holes.push(Za),dn(pi,os(oa,3,.65),Zi(),0,0,-14.1);const $i=Fi(66.35,138.35,10),Ko=new Be.Path(Fi(64.9,136.9,9).getPoints(64));$i.holes.push(Ko),dn(pi,os($i,.65,0),Ti(),0,0,6.4);for(let S=0;S<5;S++)Fn(pi,1.9,7,15.5,.8,Ti(),-33.2,-24+S*10,-1),Fn(pi,1.9,7,15.5,.8,Ti(),33.2,-24+S*10,-1);Fn(pi,58,44,1,9,Zi(),0,-44,-16.2,.3);for(let S=0;S<5;S++)Fn(pi,15-Math.abs(S-2)*1.3,.7,.3,.3,Ti(),0,-34+S*1.5,-17);for(const S of[-26,26])for(const z of[-59,61])$o(pi,S,z,-16.5,!0);Fn(pi,7.2,3.6,1.5,.7,Rt(1581355),29,61,0),Fn(pi,13,4.5,3,2,Ti(),0,-69,0);const Cs=fi("display",we(0,0,0),we(-38,12,88));Gr.add(Cs),as.pop(),Fn(Cs,53,39,1.6,3.5,Ti(),0,42,16,.3),Fn(Cs,47.5,33.5,.45,1.6,Rt(11978662,{roughness:.45}),0,42,17.1),Er(Cs,46,31.5,0,42,17.45,(S,z,V)=>{S.fillStyle="#b9c8aa",S.fillRect(0,0,z,V),S.fillStyle="#30453c",S.font="bold 47px Arial",S.fillText("\u25B0\u25B0\u25B0",34,70),S.font="bold 300px monospace",S.fillText("0.017",25,V*.65),S.font="bold 65px Arial",S.textAlign="right",S.fillText("mR/h",z-35,V-50),S.textAlign="left",S.strokeStyle="#4e6353",S.lineWidth=3,S.beginPath(),S.moveTo(z*.5,V-45),S.lineTo(z*.5,V-13),S.moveTo(z*.5-16,V-29),S.lineTo(z*.5+16,V-29),S.stroke()}),Ni(Gr,1.4,.8,Rt(8588568,{emissive:6229001,emissiveIntensity:.6}),0,66,16.5,20),Er(Gr,52,15,0,8,16.05,(S,z,V)=>{S.fillStyle="#f3e947",S.font="bold 70px Arial",S.fillText("RADIATION ALERT",190,V*.3),S.fillStyle="#fff",S.font="italic bold 225px Georgia",S.fillText("Ranger",20,V*.98)}),Ni(Gr,24.5,1,Ti(),0,-27,16,72),Er(Gr,49,49,0,-27,16.56,(S,z,V)=>{const oe=z/2,Me=V/2,me=z*.475;S.fillStyle="#142d5d",S.beginPath(),S.arc(oe,Me,me,0,Math.PI*2),S.fill(),S.strokeStyle="#f6e936",S.lineWidth=13,S.stroke(),S.lineWidth=10;for(let Xt=0;Xt<6;Xt++){const qn=Xt*Math.PI/3;S.beginPath(),S.moveTo(oe+Math.cos(qn)*me*.29,Me+Math.sin(qn)*me*.29),S.lineTo(oe+Math.cos(qn)*me,Me+Math.sin(qn)*me),S.stroke()}S.fillStyle="#f5f6ec",S.textAlign="center",S.textBaseline="middle",S.font="bold 48px Arial";const xt=["COUNT","((\u2022))","MENU","\u2600 +","MODE","ALARM"],tn=[-30,30,90,150,210,270];xt.forEach((Xt,qn)=>{const zi=tn[qn]*Math.PI/180;S.save(),S.translate(oe+Math.cos(zi)*me*.67,Me+Math.sin(zi)*me*.67),S.rotate(qn===0||qn===4?zi+Math.PI/2:0),S.fillText(Xt,0,0),S.restore()}),S.beginPath(),S.arc(oe,Me,me*.29,0,Math.PI*2),S.fillStyle="#172337",S.fill(),S.stroke(),S.strokeStyle="#fff",S.lineWidth=15,S.beginPath(),S.arc(oe,Me,me*.165,-Math.PI*.32,Math.PI*1.32),S.stroke(),S.beginPath(),S.moveTo(oe,Me-me*.23),S.lineTo(oe,Me),S.stroke()}),Er(pi,51,22,0,-9,-16.45,(S,z,V)=>{S.fillStyle="#ebf2f6",S.textAlign="center",S.font="bold 29px Arial",S.fillText("RADIATION ALERT\xAE  RANGER",z/2,42),S.font="23px Arial",S.fillText("S.E. INTERNATIONAL, INC.",z/2,80),S.fillText("www.seintl.com",z/2,112),S.font="20px Arial",S.fillText("FRAGILE WINDOW \xB7 DO NOT TOUCH",z/2,151),S.fillStyle="#eaf0f5",S.fillRect(z*.2,V-58,z*.6,23)},!0);const Rs=fi("cathode",we(0,30,0),we(-10,0,-6)),Qo=Ni(Rs,24,1.3,Ui(),0,0,-.8);Qo.userData.cathodeBacking=!0;const jo=new Be.CylinderGeometry(24,24,10,64,1,!0),la=dn(Rs,jo,Rt(10925246,{metalness:.8,roughness:.29,side:Be.DoubleSide}),0,0,-6.5);la.rotation.x=Math.PI/2,Ar(Rs,23.3,.85,Ui(),0,0,-12),Ar(Rs,24,.38,Rt(5464170,{metalness:.8}),0,0,-2);const Vr=fi("gas",we(0,30,-6.9),we(33,0,-23)),ls=Rt(5686763,{transparent:!0,opacity:.16,roughness:.12,metalness:0,depthWrite:!1,side:Be.DoubleSide});Ni(Vr,22.4,9,ls,0,0,0);const Hr=new Be.SphereGeometry(.46,8,6),$a=Rt(7986164,{emissive:878728,emissiveIntensity:.25,transparent:!0,opacity:.7}),ca=new Be.SphereGeometry(.46,20,14),Ji=[];for(let S=0;S<52;S++){const z=S*2.39996323,V=Math.sqrt((S+.5)/52)*21,oe=dn(Vr,Hr,$a.clone(),Math.cos(z)*V,Math.sin(z)*V,Math.sin(S*1.91)*3.5);oe.userData.neutralGas=!0,Ji.push(oe)}const Ki=Ji.map(S=>S.position.clone()),Qi=fi("anode",we(0,30,-6.7),we(63,0,0)),Ai=Rt(14262858,{metalness:.82,roughness:.27});Ar(Qi,13.8,.22,Ai,0,0,0),Hn(Qi,[[13.8,0,0],[19,0,0],[25,0,0],[28,0,1.8]],.23,Ai),Ni(Qi,1.65,3,Rt(14998727,{roughness:.32}),25,0,0,16);const wr=fi("window",we(0,30,-14.8),we(-6,0,-59));Ni(wr,22.5,.16,Rt(11839627,{metalness:.18,roughness:.28,transparent:!0,opacity:.58,depthWrite:!1,side:Be.DoubleSide}),0,0,0),Ar(wr,23.2,.75,Ui(),0,0,-.15);const mi=[];for(let S=-21;S<=21;S+=1.65){const z=Math.sqrt(488.4100000000001-S*S);mi.push(S,-z,-1.1,S,z,-1.1,-z,S,-1.1,z,S,-1.1)}const Is=new Be.BufferGeometry;Is.setAttribute("position",new Be.Float32BufferAttribute(mi,3));const el=new Be.LineSegments(Is,new Be.LineBasicMaterial({color:6844506,transparent:!0,opacity:.85}));wr.add(el),Ar(wr,21.7,.1,Rt(14471351,{transparent:!0,opacity:.7}),0,0,-.2),Er(pi,25,6,0,60,-16.5,(S,z,V)=>{S.fillStyle="#fff",S.font="italic bold 145px Georgia",S.fillText("Ranger",8,V*.8)},!0);const Cr=fi("voltage",we(15,-7,0),we(75,-18,27));Fn(Cr,23,25,1.2,1.3,Rt(1595202),0,0,0),Fn(Cr,10,9,7,1,Rt(2370616),0,3,4);for(const S of[-7,7])Ni(Cr,2.1,6,Rt(1387843),S,-7,3),Ni(Cr,1.9,.15,Ui(),S,-7,6.1);for(let S=0;S<6;S++)Fn(Cr,2.4,1.1,.7,.2,Rt(13481353),-8+S*3.2,10,1);Hn(Cr,[[0,12,1],[0,20,2],[10,26,1],[13,37,-5]],.55,Rt(13059384));const Bi=fi("counter",we(-8,18,5.5),we(25,7,42));Fn(Bi,46,68,1.25,3,Rt(2121547),0,0,0);const Wn=Rt(5218439,{metalness:.3,roughness:.7});for(let S=0;S<9;S++)Fn(Bi,.42,40-S*2,.13,.1,Wn,-19+S*4.6,2,.72),Fn(Bi,35-S*2,.42,.13,.1,Wn,0,-26+S*6,.73);Fn(Bi,17,18,2.3,.6,Rt(2435890),-3,6,1.7);for(let S=0;S<8;S++)for(const z of[-1,1])Fn(Bi,2.3,.65,.5,.1,Ui(),-3+z*9.5,1+S*1.7,1.1);for(let S=0;S<10;S++)Fn(Bi,2.8,1.8,.9,.2,Rt(S%3===0?3884368:12825237),-16+S%5*7,-15-Math.floor(S/5)*7,1.3);for(const S of[-18,18])for(const z of[-29,29])Ni(Bi,1.3,1.5,Ui(),S,z,1,16);const Ps=Ni(Bi,6,4,Rt(2239026),11,21,2.8);Ar(Bi,3,.4,Rt(593170),11,21,5),Hn(Bi,[[18,15,1],[28,15,-1],[34,9,-7],[36,12,-10]],.42,Rt(11814967));const Rr=fi("battery",we(0,-43,-1),we(6,-37,5));Fn(Rr,48,53,2,3,Rt(1647920),0,0,-5);for(const S of[-12,12]){const z=dn(Rr,new Be.CylinderGeometry(7,7,48,28),Rt(12630178,{metalness:.66,roughness:.4}),S,0,1.5),V=dn(Rr,new Be.CylinderGeometry(7,7,12,28),Rt(2637396,{metalness:.3}),S,18,1.5);dn(Rr,new Be.CylinderGeometry(2.4,2.4,1.2,20),Ui(),S,24.6,1.5),dn(Rr,new Be.CylinderGeometry(5,5,.45,24),Ui(),S,-24.2,1.5);for(const oe of[-26,26]){const Me=dn(Rr,new Be.BoxGeometry(9,.6,8),Ui(),S,oe,1);Me.rotation.x=.2}Er(Rr,8,25,S,0,8.7,(oe,Me,me)=>{oe.fillStyle="#273948",oe.font="bold 210px Arial",oe.textAlign="center",oe.fillText("AA",Me/2,me*.45),oe.font="130px Arial",oe.fillText("1.5 V",Me/2,me*.7),oe.fillText("+",Me/2,me*.18)})}const mn=new Be.Group;mn.name="Schematische Vorg\xE4nge",Ct.add(mn);let Ei={phase:"off",progress:0},gi=8,Ir=null,_i=null,Ls=null,dr=0,or=0;const lr=Rt(1153203,{emissive:19297,emissiveIntensity:.5,roughness:.25}),Ja=Rt(13789719,{emissive:4921091,emissiveIntensity:.3,roughness:.4}),fr=dn(mn,new Be.SphereGeometry(1.15,16,10),Rt(16768115,{emissive:15179557,emissiveIntensity:1}));function ha(S,z){const V=document.createElement("canvas");V.width=V.height=128;const oe=V.getContext("2d");oe.fillStyle=z,oe.font="bold 105px Arial",oe.textAlign="center",oe.textBaseline="middle",oe.fillText(S,64,68);const Me=new Be.CanvasTexture(V);return qe.push(Me),new Be.SpriteMaterial({map:Me,transparent:!0,depthTest:!1,depthWrite:!1})}const tl=ha("\u2212","#082a3e"),Ka=ha("+","#54230b");function ua(S,z,V){const oe=new Be.Sprite(z);oe.scale.set(V,V,1),oe.renderOrder=20,S.add(oe)}const Wr=[];for(let S=0;S<16;S++){const z={origin:Ji[S].position.clone(),e:dn(mn,new Be.SphereGeometry(.75,12,8),lr),ion:dn(mn,new Be.SphereGeometry(1.1,12,8),Ja)};z.e.userData={role:"electron",index:S},z.ion.userData={role:"ion",index:S},ua(z.e,tl,1.15),ua(z.ion,Ka,1.55),Wr.push(z)}const da=Wr.map((S,z)=>{const V=Ar(mn,.8,.045,Rt(15251792,{emissive:9260040,emissiveIntensity:.7,transparent:!0,opacity:0,depthWrite:!1}),0,0,0);return V.userData={role:"collision",index:z},V.visible=!1,V}),Oi=[];for(let S=0;S<34;S++)Oi.push(dn(mn,new Be.SphereGeometry(.46,8,6),lr));const pr=dn(mn,new Be.SphereGeometry(1.45,12,8),lr),Xr=[];for(let S=0;S<8;S++){const z=S*Math.PI/4,V=new Be.ArrowHelper(we(0,0,1),we(Math.cos(z)*13.8,Math.sin(z)*13.8,.4),4.8,14261812,1.4,.7);V.userData={role:"field",index:S},mn.add(V),Xr.push(V)}const cs=new Be.BufferGeometry().setFromPoints([we(0,0,-58),we(0,0,-5)]),Xn=new Be.Line(cs,new Be.LineDashedMaterial({color:15776580,dashSize:1.6,gapSize:1.5,transparent:!0,opacity:.6}));Xn.computeLineDistances(),mn.add(Xn);const qr=Ar(mn,13.8,.47,Rt(8186367,{emissive:3782886,emissiveIntensity:1,transparent:!0,opacity:.8,depthWrite:!1}),0,0,0);function Ds(S,z){S=String(S||"off");const V=S!==Ei.phase;return Ei={phase:S,progress:Math.max(0,Math.min(1,Number(z)||0))},V&&Yr(),Lt=!0,Dn}function nl(S){return gi=Math.max(1,Math.min(8,Math.round(Number(S)||8))),Lt=!0,Dn}function fa(S){if(S===null||typeof S!="object")Ir=null;else{Ir={};for(const z of["electron","ion"])Number.isFinite(S[z])&&(Ir[z]=Math.max(0,Math.min(1,S[z])))}return Lt=!0,Dn}function Qa(S){const z=_i!==null;if(S===null)_i=null,Ls=null,Ji.forEach((V,oe)=>{V.position.copy(Ki[oe]),V.scale.setScalar(1),V.geometry=Hr});else{if(!Pn.RangerAtomicMotion)throw new Error("atomic-motion.js muss vor model.js geladen werden.");_i=Object.assign({},S)}return z!==(_i!==null)&&Yr(),Lt=!0,Dn}function ja(S){const z=S===!0?1:S===!1?0:Math.max(0,Math.min(1,Number(S)||0));return z!==dr&&(dr=z,Yr()),Lt=!0,Dn}function pa(S){const z=Math.max(0,Math.min(1,Number(S)||0));return z!==or&&(or=z,Yr()),Lt=!0,Dn}function Us(){if(_i===null)return null;const S=Pn.RangerAtomicMotion.evaluate(Number(_i.time)||0,Object.assign({},_i,{chargeProgress:Ir}));return Object.assign(S,{sensorOrigin:Vr.position.toArray()})}function ma(){Ls=Us();const S=Ls,z=Ei.phase,V=Ei.progress;mn.visible=!0,mn.position.copy(Vr.position),S.atoms.forEach((Me,me)=>{Ji[me].position.fromArray(Me.position),Ji[me].visible=Me.visible,Ji[me].scale.setScalar(1.3),Ji[me].geometry=ca}),Wr.forEach((Me,me)=>{const xt=S.electrons[me],tn=S.ions[me];Me.e.position.fromArray(xt.position),Me.ion.position.fromArray(tn.position),Me.e.visible=xt.visible,Me.ion.visible=tn.visible,Me.e.scale.setScalar(.42),Me.ion.scale.setScalar(.55),Me.e.children.forEach(Xt=>Xt.position.set(0,0,.05)),Me.ion.children.forEach(Xt=>Xt.position.set(0,0,.05))}),fr.visible=S.radiation.visible,fr.position.fromArray(S.radiation.position),fr.scale.setScalar(.4),Xn.visible=S.radiation.visible,Xn.position.set(0,0,0),Xn.material.opacity=.65;const oe=Xn.geometry.attributes.position;oe.setXYZ(0,...S.radiation.start),oe.setXYZ(1,...S.radiation.position),oe.needsUpdate=!0,Xn.geometry.computeBoundingSphere(),Xn.computeLineDistances(),da.forEach((Me,me)=>{const xt=S.time-S.events[me].time;Me.visible=xt>=0&&xt<.45,Me.position.fromArray(S.events[me].position),Me.scale.setScalar(.9+Math.max(0,xt)*2),Me.material.opacity=Me.visible?(1-xt/.45)*.85:0}),Oi.forEach(Me=>{Me.visible=!1}),Xr.forEach(Me=>{const me=S.fieldStrength,xt=or*(.25+.75*me),tn=4.8*me;Me.visible=xt>0,Me.setLength(tn,Math.min(1.4,tn*.32),Math.min(.7,tn*.18)),Me.userData.fieldStrength=me,Me.line.material.transparent=Me.cone.material.transparent=!0,Me.line.material.opacity=Me.cone.material.opacity=xt}),qr.visible=!1,pr.visible=!1}function eo(){if(_i!==null){ma();return}da.forEach(me=>{me.visible=!1}),fr.scale.setScalar(1);const S=Xn.geometry.attributes.position;S.setXYZ(0,0,0,-58),S.setXYZ(1,0,0,-5),S.needsUpdate=!0,Xn.geometry.computeBoundingSphere(),Xn.computeLineDistances();const z=Ei.phase,V=Ei.progress;if(mn.visible=z!=="off"&&z!=="none",Ji.forEach((me,xt)=>{me.visible=!mn.visible||xt>=gi||z==="incoming"||z==="ionization"&&xt/gi>=V||z==="deadtime"&&V>.92}),!mn.visible)return;mn.position.copy(Vr.position),fr.visible=z==="incoming"||z==="ionization";const oe=Wr[0].origin;gi===1?fr.position.set(oe.x,oe.y,z==="incoming"?-58+V*(58+oe.z):oe.z+V*3.5):fr.position.set(-7,3,z==="incoming"?-58+V*50:-8+V*11),Xn.visible=z==="incoming"||z==="ionization",Xn.position.set(gi===1?oe.x:-7,gi===1?oe.y:3,gi===1?oe.z+5:0),Xn.material.opacity=z==="incoming"?.55:.55*(1-V),Xr.forEach(me=>{me.setLength(4.8,1.4,.7),me.visible=z==="drift"||z==="deadtime",me.line.material.transparent=me.cone.material.transparent=!0,me.line.material.opacity=me.cone.material.opacity=z==="deadtime"?V:1}),qr.visible=["avalanche","pulse","quench","deadtime"].includes(z),qr.material.opacity=z==="quench"?.8*(1-V):z==="deadtime"?.12+.35*V:.8;const Me=["ionization","drift","avalanche","pulse","quench","deadtime"].includes(z);if(Wr.forEach((me,xt)=>{const tn=Me&&xt<gi&&(z!=="ionization"||xt/gi<V);me.e.visible=tn&&(z==="ionization"||z==="drift"),me.ion.visible=tn;const Xt=me.origin,qn=we(Xt.x,Xt.y,.2).normalize().multiplyScalar(13.8);qn.z=.2;const zi=we(Xt.x,Xt.y,5.4),Lr=Ir?.electron??(z==="drift"?V:0),ms=Ir?.ion??(z==="drift"?V*.12:z==="avalanche"?.12+V*.1:z==="pulse"?.22+V*.08:z==="quench"?.3+V*.35:z==="deadtime"?.65+V*.35:0);me.e.position.copy(Xt).lerp(qn,Lr),z==="ionization"&&(me.e.position.x+=.8+Math.max(0,V-xt/gi)*1.5),me.ion.position.copy(Xt).lerp(zi,ms),me.e.scale.setScalar(1),me.ion.scale.setScalar(z==="deadtime"?Math.min(1,(1-V)*5):1),me.e.children.forEach(cr=>cr.position.set(0,0,0)),me.ion.children.forEach(cr=>cr.position.set(0,0,0))}),Oi.forEach((me,xt)=>{me.visible=z==="avalanche"&&xt/Oi.length<=V;const tn=.15+Math.sin(xt*2.7)*(.05+.3*V),Xt=13.8+(1-V)*(2+xt%5*.4);me.position.set(Math.cos(tn)*Xt,Math.sin(tn)*Xt,Math.sin(xt*1.9)*(.8*(1-V)+.2))}),pr.visible=z==="pulse",pr.visible){const me=Qi.position.clone().add(we(28,0,1.8)),xt=Bi.position.clone().add(we(-3,6,4));pr.position.copy(me.lerp(xt,V)).sub(mn.position)}}const mr=new Be.Box3Helper(new Be.Box3,15115832);mr.visible=!1,mr.material.transparent=!0,mr.material.opacity=.7,Ct.add(mr);function ga(S){for(;S&&S!==Ln;){if(S.userData.partId)return S.userData.partId;S=S.parent}return null}Ln.traverse(S=>{if(S.material)for(const z of[].concat(S.material))!z.userData.baseOpacity&&z.userData.baseOpacity!==0&&(z.userData.baseOpacity=z.opacity,z.userData.baseColor=z.color?z.color.getHex():null,z.userData.baseEmissive=z.emissive?z.emissive.getHex():null)});function Yr(){const S=_i===null&&Ei.phase!=="off"&&Ei.phase!=="none",z=S||lt&&pn.has(lt);Ln.traverse(V=>{if(!V.material)return;const oe=ga(V),Me=oe===lt;for(const me of[].concat(V.material)){const xt=z&&!Me,tn=me.userData.baseOpacity===void 0?1:me.userData.baseOpacity;if(me.opacity=xt?Math.min(tn,.18):tn,S&&(["shell","rear","display","battery","voltage","counter"].includes(oe)?me.opacity=Math.min(tn,.025):oe==="cathode"?me.opacity=V.userData.cathodeBacking?.07:.55:oe==="anode"?me.opacity=tn:oe==="window"?me.opacity=V.isLineSegments?.16:.08:oe==="gas"&&(me.opacity=V.userData.neutralGas?.2:Math.min(tn,.13))),_i!==null&&V.userData.neutralGas&&(me.opacity=.88),dr>0&&!V.userData.neutralGas){const Xt=oe==="anode"?.1+.4*or:oe==="cathode"?(V.userData.cathodeBacking?.12:.3)*or:0;me.opacity=me.opacity*(1-dr)+Xt*dr}me.color&&me.userData.baseColor!==null&&me.color.setHex(_i!==null&&V.userData.neutralGas?9346474:me.userData.baseColor),me.transparent=me.opacity<1||!!me.map,me.depthWrite=!xt&&me.opacity>.8,me.emissive&&(me.emissive.setHex(_i!==null&&V.userData.neutralGas?1120285:Me?7092224:me.userData.baseEmissive||0),me.emissiveIntensity=Me?.36:1),me.needsUpdate=!0}V.userData.neutralGas||(V.visible=[].concat(V.material).some(me=>me.opacity>0)),V.castShadow=dr===0&&(!z||Me)}),mr.visible=!1,Lt=!0}const Zr=(S,z,V)=>{const oe=Math.max(0,Math.min(1,(S-z)/(V-z)));return oe*oe*(3-2*oe)};function gr(){as.forEach(S=>{S.group.position.copy(S.base);const z=S.group.userData.partId;z==="shell"?S.group.position.addScaledVector(we(-45,12,65),Zr($e,0,.3)):z==="counter"||z==="voltage"?S.group.position.addScaledVector(we(45,0,22),Zr($e,.3,.6)):z==="rear"?S.group.position.addScaledVector(we(65,-18,-32),Zr($e,.35,.65)):z==="window"&&S.group.position.addScaledVector(we(-34,0,-22),Zr($e,.6,1))}),Vn.position.y=-83-15*Zr($e,.35,.65),Ln.updateMatrixWorld(!0),lt&&mr.box.setFromObject(Mn[lt]),Lt=!0}function hs(S,z){return $e=Math.max(0,Math.min(1,Number(S)||0)),gr(),z?.preserveView||(lt?new Be.Box3().setFromObject(Mn[lt]).getCenter(Nt):(En=280+$e*75,Nt.set(0,-2,0)),At.manual&&(dt.copy(Nt),kn=En)),Dn}function us(S,z){const V={window:0,display:0,shell:0,rear:0,counter:.4,voltage:.4,battery:.65,cathode:1,anode:1,gas:1},oe=V[S]===void 0?0:V[S];return z?.apply&&hs(oe,z),oe}function Fs(S){return lt=Mn[S]?S:null,Yr(),gr(),Dn}function to(S,z){if(!Mn[S])return Dn;z=z||{},Fs(S);const V=new Be.Box3().setFromObject(Mn[S]);V.getCenter(Nt);const oe=V.getSize(we(0,0,0));return En=Math.max(pn.has(S)?205:130,Math.max(oe.x,oe.y,oe.z)*2.8),ti=["window","anode","cathode","gas","battery"].includes(S)?-2.85:.4,Sn=S==="window"?.1:.3,(z.immediate||At.manual)&&(jt=ti,An=Sn,kn=En,dt.copy(Nt)),Lt=!0,Dn}function _a(){return Fs(null),ti=.43,Sn=.2,En=280+$e*95,Nt.set(16*$e,-2,0),At.manual&&(jt=ti,An=Sn,kn=En,dt.copy(Nt)),Lt=!0,Dn}function no(){const S=Math.cos(An);di.position.set(dt.x+Math.sin(jt)*S*kn,dt.y+Math.sin(An)*kn,dt.z+Math.cos(jt)*S*kn),di.lookAt(dt),di.updateMatrixWorld()}function ds(S){if(Yt)return;const z=Math.max(0,Number(S)||0);return At.manual&&(jt=ti,An=Sn,kn=En,dt.copy(Nt)),no(),eo(),lt&&mr.box.setFromObject(Mn[lt]),vn.render(Ct,di),Lt=!1,an=z,Dn}function Ns(S,z){const V=$t.getBoundingClientRect();return S=S||V.width||640,z=z||V.height||420,vn.setSize(S,z,!1),di.aspect=S/z,di.updateProjectionMatrix(),Lt=!0,At.manual&&ds(an||0),Dn}function io(S){return S.target&&(Nt.fromArray(S.target),dt.copy(Nt)),Number.isFinite(S.yaw)&&(jt=ti=S.yaw),Number.isFinite(S.pitch)&&(An=Sn=S.pitch),Number.isFinite(S.distance)&&(kn=En=S.distance),Lt=!0,Dn}function ro(){return{yaw:jt,pitch:An,distance:kn,target:dt.toArray()}}function wi(S){return En=Math.max(70,Math.min(700,En*S)),At.manual&&(kn=En),Lt=!0,Dn}const oi=new Map;let fs=0,$r=!1,_r=null;function Pr(S){if(Qt.focus({preventScroll:!0}),Qt.setPointerCapture(S.pointerId),oi.set(S.pointerId,{x:S.clientX,y:S.clientY}),Qt.style.cursor="grabbing",$r=!1,_r={x:S.clientX,y:S.clientY},oi.size===2){const z=Array.from(oi.values());fs=Math.hypot(z[0].x-z[1].x,z[0].y-z[1].y)}}function Jr(S){if(!oi.has(S.pointerId))return;const z=oi.get(S.pointerId);if(oi.set(S.pointerId,{x:S.clientX,y:S.clientY}),Math.hypot(S.clientX-_r.x,S.clientY-_r.y)>5&&($r=!0),oi.size===1)ti-=(S.clientX-z.x)*.009,Sn=Math.max(-1.4,Math.min(1.4,Sn+(S.clientY-z.y)*.007));else{const V=Array.from(oi.values()),oe=Math.hypot(V[0].x-V[1].x,V[0].y-V[1].y);fs>0&&oe>0&&wi(fs/oe),fs=oe}At.manual&&(jt=ti,An=Sn),Lt=!0}function Bs(S){if(oi.delete(S.pointerId),oi.size||(Qt.style.cursor="grab"),!$r&&At.onSelect){const z=Qt.getBoundingClientRect(),V=new Be.Raycaster;V.setFromCamera(new Be.Vector2((S.clientX-z.left)/z.width*2-1,-(S.clientY-z.top)/z.height*2+1),di);const Me=V.intersectObject(Ln,!0).find(me=>me.object.material&&me.object.material.opacity>.15);Me&&At.onSelect(ga(Me.object))}}function Os(S){document.activeElement!==Qt&&!S.ctrlKey||(S.preventDefault(),wi(Math.exp(S.deltaY*.0015)))}function zs(S){["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-","0"].indexOf(S.key)<0||(S.preventDefault(),S.key==="ArrowLeft"&&(ti-=.15),S.key==="ArrowRight"&&(ti+=.15),S.key==="ArrowUp"&&(Sn=Math.min(1.4,Sn+.1)),S.key==="ArrowDown"&&(Sn=Math.max(-1.4,Sn-.1)),(S.key==="+"||S.key==="=")&&wi(.9),S.key==="-"&&wi(1.1),S.key==="0"&&_a(),Lt=!0)}At.interactive!==!1&&(Qt.addEventListener("pointerdown",Pr),Qt.addEventListener("pointermove",Jr),Qt.addEventListener("pointerup",Bs),Qt.addEventListener("pointercancel",Bs),Qt.addEventListener("wheel",Os,{passive:!1}),Qt.addEventListener("keydown",zs));let ps=null;Pn.ResizeObserver&&(ps=new ResizeObserver(()=>Ns()),ps.observe($t));function xa(S){if(Yt)return;const z=an===null?.016:Math.min(.06,Math.max(.001,S/1e3-an));an=S/1e3;const V=1-Math.exp(-z*10);Math.abs(jt-ti)+Math.abs(An-Sn)+Math.abs(kn-En)+dt.distanceTo(Nt)>.002&&(jt+=(ti-jt)*V,An+=(Sn-An)*V,kn+=(En-kn)*V,dt.lerp(Nt,V),Lt=!0),Lt&&ds(S/1e3),hn=requestAnimationFrame(xa)}function so(){Yt=!0,cancelAnimationFrame(hn),ps&&ps.disconnect(),Qt.removeEventListener("pointerdown",Pr),Qt.removeEventListener("pointermove",Jr),Qt.removeEventListener("pointerup",Bs),Qt.removeEventListener("pointercancel",Bs),Qt.removeEventListener("wheel",Os),Qt.removeEventListener("keydown",zs);const S=new Set([Hr,ca]),z=new Set;Ct.traverse(V=>{V.geometry&&S.add(V.geometry),V.material&&[].concat(V.material).forEach(oe=>z.add(oe))}),S.forEach(V=>V.dispose()),z.forEach(V=>V.dispose()),qe.forEach(V=>V.dispose()),vn.dispose(),Qt.remove()}function ao(){Ln.updateMatrixWorld(!0);const S=Ln.clone(!0),z=new Map;S.traverse(oe=>{if(oe.geometry&&oe.geometry.parameters){if(!z.has(oe.geometry)){const Me=new Be.BufferGeometry().copy(oe.geometry);Me.name=oe.geometry.name,Me.userData=Object.assign({},oe.geometry.userData,{sourceGeometryType:oe.geometry.type}),z.set(oe.geometry,Me)}oe.geometry=z.get(oe.geometry)}});const V=S.toJSON();return z.forEach(oe=>oe.dispose()),V}const Dn={scene:Ct,camera:di,renderer:vn,model:Ln,parts:Mn,canvas:Qt,setExplosion:hs,revealPart:us,highlightPart:Fs,focusPart:to,resetView:_a,resize:Ns,renderAt:ds,setView:io,getView:ro,zoom:wi,zoomBy:wi,setPhase:Ds,setPairCount:nl,setChargeProgress:fa,setAtomicClock:Qa,getAtomicState:Us,setMicroscopic:ja,getMicroscopic:()=>dr,setFieldVisibility:pa,getFieldVisibility:()=>or,dispose:so,exportModel:ao,getExplosion:()=>$e,getHighlight:()=>lt,sensor:{center:[0,30,-6.9],windowCenter:[0,30,-14.8],outwardNormal:[0,0,-1],anodeRadius:13.8},mechanism:mn};return Ns(),gr(),ds(0),At.manual||(hn=requestAnimationFrame(xa)),Dn}})(window);
