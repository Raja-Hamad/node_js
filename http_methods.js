const express=require("express");
const app=express();

// http methods


app.get("/products",(req,res)=>{
    res.send("All Products fetched");
});

app.post("/products",(req,res)=>{
    res.send("New product created");
});

app.put("/products/:id",(req,res)=>{
     res.json({
    message: "Product updated successfully",
    id: productId
  });
});

app.delete("/products/:id",(req,res)=>{
      res.json({
    message: "Product deleted successfully",
    id: productId
  });
});


app.listen(3000,()=>{
    console.log("Server is running at port 3000");
});