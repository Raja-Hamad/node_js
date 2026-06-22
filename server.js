// Express: A web application framework for Node.js, designed for building web applications and APIs. It provides a robust set of features for web and mobile applications, including routing, middleware support, and template engines.

const express=require('express');
const app =express();
 
app.get("/",(req,res)=>{
    res.send("Home PAGE");
})

app.get("/profile",(req,res)=>{
    res.send("Profile PAGE");
})

app.get("/info",(req,res)=>{
    res.json({name:"John",age:30,city:"New York"});
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

