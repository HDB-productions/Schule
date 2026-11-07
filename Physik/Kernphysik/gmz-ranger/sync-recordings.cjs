/* Reproduce the recorded narration timeline. Raw recordings stay outside the publication. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const timing=require('./movie-timing.js');
const args={};for(let i=2;i<process.argv.length;i+=2)args[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
if(!args.map||!args.cleaned||!args.output)throw Error('Benötigt --map MONTAGE.map.json --cleaned VERZEICHNIS --output TIMELINE.json');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const montage=read(args.map),base=read(path.join(__dirname,'video-timeline.json'));
const records=Object.fromEntries(['aufbau','ionisation','zaehlimpuls','totzeit'].map(id=>[id,read(path.join(args.cleaned,id+'-cleaned-map-asr.json'))]));
const original=s=>timing.outputTime(s,montage.segments);
function recording(id,raw){const rec=records[id],section=rec.segments.find(s=>raw>=s.rawStart-1e-6&&raw<=s.rawEnd+1e-6);if(!section)throw Error('Wortmarke liegt außerhalb des erhaltenen Tons: '+id+' '+raw);return montage.segments.find(s=>s.id===id).start+section.cleanStart+raw-section.rawStart;}
const anchors=new Map([[0,0],[montage.originalDuration,montage.duration]]);
for(const s of montage.segments){anchors.set(s.sourceStart,s.start);anchors.set(s.sourceEnd,s.end);}
// These anchors move only the camera/caption clock. Audio is never stretched.
for(const [source,raw] of [[17.54,1.01],[21.5,5.0],[21.7,8.55],[22,13.49],[22.4,15.31],[23.2,17.23],[32,21.93],[34.06,30.61],[36.5,33.63],[39.38,35.47]])anchors.set(source,recording('aufbau',raw));
for(const [source,raw] of [[73.04,1.52],[82.88,5.22],[84.06,9.56]])anchors.set(source,recording('ionisation',raw));
for(const [source,raw] of [[113.08,1.14],[116.5,4.64]])anchors.set(source,recording('zaehlimpuls',raw));
for(const [source,raw] of [[175,13.9],[180,24.64],[185,32.26],[188.4,39.38]])anchors.set(source,recording('totzeit',raw));
base.duration=montage.duration;base.sourceDuration=montage.originalDuration;base.timeMap=montage.segments;
base.presentationMap=[...anchors].sort((a,b)=>a[0]-b[0]).map(([source,time])=>({source,time}));
base.audioStatus='Originalton mit vier Eigenaufnahmen montiert. Aufbau-Fehlansatz entfernt; Pegel angeglichen, keine Sprachsynthese oder Zeitdehnung. Elektronen in der Totzeitaufnahme von der Lehrkraft bestätigt.';
base.sync={...base.sync,mode:'recording-cues',finalSync:false,status:'Wortzeiten aus lokaler ASR auf die samplegenaue Montage übertragen. Bildereignisse technisch prüfbar; keine eigene Hörprüfung durch den Agenten.',sourceTimeMeaning:'Szenenkoordinate des ursprünglichen Films. presentationMap ordnet Kamera und Bildtexte neu zu; timeMap beschreibt ausschließlich die Tonmontage.',wordTimingMethod:'local-ASR-with-explicit-word-anchors',auditoryReviewByAgent:false,userConfirmedTotzeitElectronWord:true};
const selected={atom_ejected:['ionisation',5.22,'herausschlagen'],pair_formed:['ionisation',9.56,'positives Ion'],pulse_count:['zaehlimpuls',6.44,'registriert'],deadtime_start:['totzeit',0,'Nach einem Zählimpuls'],deadtime_end:['totzeit',38.96,'erneut zählen']};
for(const cue of base.eventCues){
 if(selected[cue.id]){const[id,raw,word]=selected[cue.id];cue.time=recording(id,raw);cue.word=word;cue.recording=id;cue.rawTime=raw;}
 else if(Number.isFinite(cue.sourceTime))cue.time=original(cue.sourceTime);
 cue.status=cue.kind==='internal'?'Interner Zustand ohne Sprecherbegriff':'Auf Montagezeit übertragene ASR-Wortmarke; keine eigene Hörprüfung';
}
const signal={id:'pulse_signal',time:recording('zaehlimpuls',4.64),word:'Impuls',recording:'zaehlimpuls',rawTime:4.64,phase:'pulse',from:0,to:1,duration:1.8,status:'Auf Montagezeit übertragene ASR-Wortmarke'};
base.eventCues=base.eventCues.filter(c=>c.id!=='pulse_signal');base.eventCues.push(signal);
base.sync.requiredEvents=[...new Set([...base.sync.requiredEvents,'pulse_signal'])];
const first=base.beats.find(b=>b.start===17.54);
Object.assign(first,{title:'Ein flaches, rundes Zählrohr',text:'Wir betrachten die Bauform eines tragbaren Strahlungsmessgerätes. Im runden Sensor befindet sich der gasgefüllte Raum.',tag:'Flaches Geiger-Müller-Zählrohr',part:'gas',points:['Wiedererkennbare Bauform unseres Messgerätes','Innenaufbau als vereinfachtes Unterrichtsmodell']});
base.beats=base.beats.filter(b=>![21.7,22].includes(b.start));
base.beats.push({start:21.7,title:'Die Gasfüllung',text:'Das Gasgemisch besteht hauptsächlich aus Edelgas. In diesem Gas kann Strahlung Ladungsträger erzeugen.',tag:'Gasgemisch · hauptsächlich Edelgas',mode:'part',part:'gas',phase:'off',points:['Gasfüllung im geschlossenen Sensor','Das Gas wird später stark vergrößert gezeigt.']},{start:22,title:'Die äußere Elektrode',text:'Das leitfähige Metallgehäuse des Zählrohrs bildet die Kathode.',tag:'Kathode · Metallgehäuse',mode:'part',part:'cathode',phase:'off',points:['Die Kathode begrenzt den Gasraum.','Sie liegt gegenüber der Anode am negativen Pol.']});
base.beats.sort((a,b)=>a.start-b.start);
timing.validate(base);
fs.writeFileSync(args.output,JSON.stringify(base,null,2)+'\n');
console.log(JSON.stringify({output:path.resolve(args.output),duration:base.duration,anchors:base.presentationMap.length,cues:base.eventCues.filter(c=>Number.isFinite(c.time)).map(({id,time})=>({id,time}))},null,2));
