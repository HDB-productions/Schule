const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(path.join(__dirname,'widget.html')));}).listen(8766,'127.0.0.1',()=>console.log('Vorschau: http://127.0.0.1:8766'));
