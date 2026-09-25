// Read-only local preview; serves only this widget.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const port=Number(process.env.PORT||8776);
http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(path.join(__dirname,'../widget.html')));}).listen(port,'127.0.0.1',()=>console.log(`Flaschenrakete: http://127.0.0.1:${port}/`));
