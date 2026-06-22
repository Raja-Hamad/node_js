const http=require('http');

const server=http.createServer((req,res)=>{
    console.log("request received", req.url);
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.write("Hello from node js");            
    res.end();
})


server.listen(3000,()=>{
    console.log("Server is running on port 3000");
})