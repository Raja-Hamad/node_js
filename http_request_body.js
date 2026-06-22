// Request body for post/update/delete requets


const express=require("express");

const app=express();

app.use(express.json());

// POST request for creating new product

app.post("/products",(req,res)=>{
    const {name,price}=req.body;

    res.json({
        message:"Product created successfully",
        product:{
            name:name,
            price:price
        }
    });
});



// POST request for creating new user

app.post("/users",(req,res)=>{
    const {name,age}=req.body;
    res.json({
        message:"user created successfully",
        user:{
            name:name,
            age:age
        }
    })
});

app.listen(3000,()=>{
    console.log("Server is listening at port 3000");
});
