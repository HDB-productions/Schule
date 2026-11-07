/* Local, deterministic Edge → JPEG pipe → FFmpeg renderer. No external requests. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn}=require('node:child_process'),{once}=require('node:events');
const args={};for(let i=2;i<process.argv.length;i++){const token=process.argv[i];if(!token.startsWith('--'))throw Error('Unbekanntes Argument: '+token);const key=token.slice(2);args[key]=process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[++i]:true;}
if(args.help){console.log('node render-video.cjs [--output PATH] [--fps 24] [--width 1280] [--start 0] [--duration 207.142] [--segments 0:5,13:7,73:6] [--audio PATH] [--timing PATH] [--draft true|false] [--qa-dir PATH] [--stills-only] [--stills 0,26,80,110,123,175] [--ffmpeg PATH]\nExplicit --audio muxes the supplied original AAC without re-encoding. --segments supports silent technical previews only and rejects --audio. No speech is generated. --draft defaults to true.');process.exit(0);}
const dir=__dirname,root=path.resolve(dir,'../../..'),sourceTimeline=JSON.parse(fs.readFileSync(path.join(dir,'video-timeline.json'),'utf8'));
const timingFile=args.timing?JSON.parse(fs.readFileSync(path.resolve(String(args.timing)),'utf8')):null;
const timingConfig=timingFile?.segments?{duration:timingFile.duration,sourceDuration:timingFile.originalDuration,timeMap:timingFile.segments,sync:{mode:'technical-preview',finalSync:false}}:timingFile;
const timeline=require('./movie-timing.js').validate({...sourceTimeline,...timingConfig,sync:{...sourceTimeline.sync,...timingConfig?.sync}});
const output=path.resolve(args.output||path.join(root,'outputs/gmz-ranger-video-qa/ranger-working-draft.mp4'));
const qa=path.resolve(args['qa-dir']||path.join(path.dirname(output),'frames'));
const fps=Number(args.fps||24),width=Number(args.width||1280),height=Math.round(width*9/16),start=Number(args.start||0),duration=Math.min(Number(args.duration||timeline.duration),timeline.duration-start);
const draft=![false,'false','0'].includes(args.draft),stills=String(args.stills||'0,20,27,80,110,123,175,200').split(',').map(Number);
if(!Number.isFinite(fps)||fps<1||fps>60||!Number.isInteger(width)||width<320||width%2||height%2||!Number.isFinite(start)||start<0||!Number.isFinite(duration)||duration<=0)throw Error('Ungültige Bildrate, Größe oder Zeit. Breite/Höhe müssen gerade sein.');
const moduleCandidates=[process.env.PLAYWRIGHT_MODULE,path.join(path.dirname(process.execPath),'../node_modules/playwright'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
let chromium;for(const p of moduleCandidates){try{({chromium}=require(p));break;}catch{}}if(!chromium)throw Error('Playwright fehlt. PLAYWRIGHT_MODULE auf das lokale Paket setzen.');
const ffmpeg=String(args.ffmpeg||process.env.FFMPEG_PATH||path.join(root,'outputs/gmz-ranger-source/python-deps/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe'));
const audio=args.audio?path.resolve(String(args.audio)):null;
const segments=args.segments?String(args.segments).split(',').map(value=>{const [from,len]=value.split(':').map(Number);if(!Number.isFinite(from)||from<0||!Number.isFinite(len)||len<=0||from+len>timeline.duration)throw Error('Ungültiges Segment: '+value);return {start:from,duration:len};}):[{start,duration}];
if(args.segments&&audio)throw Error('--segments ist nur für stumme technische Vorschauen erlaubt; --audio ist dabei ausgeschlossen.');
if(audio&&!fs.existsSync(audio))throw Error('Audiodatei nicht gefunden: '+audio);
if(!args['stills-only']&&!fs.existsSync(ffmpeg))throw Error('FFmpeg fehlt. --ffmpeg oder FFMPEG_PATH verwenden.');
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.json':'application/json;charset=utf-8','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}const file=path.resolve(dir,'.'+pathname);if(!file.startsWith(dir+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data);});});
async function main(){
  fs.mkdirSync(qa,{recursive:true});fs.mkdirSync(path.dirname(output),{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;let browser,encoder,encoderResult,finished=false;
  const errors=[];
  try{
    browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-background-networking']});
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
    await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/movie.html?capture=1&draft='+(draft?1:0));await page.evaluate(()=>window.movieReady);
    if(timingConfig)await page.evaluate(config=>window.configureMovieTiming(config),timingConfig);
    const frame=page.locator('#capture');
    const states=[];
    for(const t of stills){const state=await page.evaluate(({t,draft})=>window.renderMovieAt(t,{draft}),{t,draft});await frame.screenshot({path:path.join(qa,`frame-${t.toFixed(2).replace('.','-')}.png`),type:'png',animations:'disabled'});states.push(state);}
    await page.evaluate(({draft})=>window.renderMovieAt(0,{draft}),{draft});await frame.screenshot({path:path.join(qa,'poster.png'),type:'png',animations:'disabled'});
    // Revisit a frame after another phase: equal pixels establish order-independent staging.
    await page.evaluate(()=>window.renderMovieAt(83));const first=await frame.screenshot({type:'png',animations:'disabled'});
    await page.evaluate(()=>window.renderMovieAt(177));await page.evaluate(()=>window.renderMovieAt(83));const second=await frame.screenshot({type:'png',animations:'disabled'});
    if(!first.equals(second))throw Error('Determinismusprüfung fehlgeschlagen: Frame 83 ist von der Aufrufreihenfolge abhängig.');
    fs.writeFileSync(path.join(qa,'frame-checks.json'),JSON.stringify({width,height,states,deterministicFrame83:true,errors,draft},null,2));
    if(errors.length)throw Error('Browserfehler: '+errors.join('; '));
    if(args['stills-only']){console.log(JSON.stringify({stills:qa,deterministic:true}));return;}
    const frameTimes=segments.flatMap(segment=>Array.from({length:Math.ceil(segment.duration*fps)},(_,i)=>segment.start+i/fps));
    const count=frameTimes.length,actualDuration=count/fps;
    const ffargs=['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0'];
    if(audio)ffargs.push('-ss',String(start),'-i',audio);
    ffargs.push('-map','0:v:0');if(audio)ffargs.push('-map','1:a:0','-c:a','copy');
    ffargs.push('-c:v','libx264','-preset','medium','-crf','20','-maxrate','3000k','-bufsize','6000k','-pix_fmt','yuv420p','-r',String(fps),'-t',String(actualDuration),'-movflags','+faststart','-metadata','title=Geiger-Müller-Zähler – Aufbau und Funktion'+(draft?' – Arbeitsfassung':''),output);
    encoder=spawn(ffmpeg,ffargs,{stdio:['pipe','ignore','pipe'],windowsHide:true});let log='';encoder.stderr.on('data',b=>{log+=b.toString();if(log.length>16000)log=log.slice(-16000);});
    encoderResult=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('exit',code=>code===0?resolve():reject(Error('FFmpeg '+code+': '+log)));});encoderResult.catch(()=>{});
    encoder.stdin.on('error',()=>{});
    const started=Date.now();
    for(let i=0;i<count;i++){
      await page.evaluate(({t,draft})=>window.renderMovieAt(t,{draft}),{t:Math.min(timeline.duration,frameTimes[i]),draft});
      const jpeg=await frame.screenshot({type:'jpeg',quality:90,animations:'disabled'});
      if(encoder.exitCode!==null)throw Error('FFmpeg vorzeitig beendet: '+log);
      if(!encoder.stdin.write(jpeg))await Promise.race([once(encoder.stdin,'drain'),encoderResult.then(()=>{throw Error('FFmpeg vorzeitig beendet.');})]);
      if(i%Math.max(1,Math.round(fps*5))===0)console.log(JSON.stringify({frame:i,total:count,time:Number(frameTimes[i].toFixed(2)),elapsedSeconds:Math.round((Date.now()-started)/1000)}));
    }
    encoder.stdin.end();await encoderResult;finished=true;
    const report={output,start,duration:actualDuration,segments,fps,width,height,frames:count,bytes:fs.statSync(output).size,audio:audio||null,audioCodec:audio?'copy':'none',draft,deterministicFrame83:true,elapsedSeconds:(Date.now()-started)/1000};
    fs.writeFileSync(output+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{if(encoder&&!finished&&encoder.exitCode===null)encoder.kill();if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
