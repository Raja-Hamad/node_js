const express=require("express");
const app=express();

app.get("/products",(req,res)=>{
const category=req.query.category;
const price=req.query.price;
 res.json({
price: price,
category:category
});
});

app.listen(3000,()=>{
console.log("listening on 3000");
});