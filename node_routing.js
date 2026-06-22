const http = require('http');
const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === "/") {
        res.write("Home Page");
        res.end();
    }
    else if (url === "/about") {
        res.write("About Page");
        res.end();

    }
    else if (url === "/contact") {
        res.write("Contact Page");
        res.end();
    }

    else if(url==="/info"){
        res.write(JSON.stringify({name:"John",age:30,city:"New York"}));
        res.end();
    }
    else {
        res.write("Page Not Found");
        res.end();
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})