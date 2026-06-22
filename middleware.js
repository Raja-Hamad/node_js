const express = require("express");
const app = express();

// Middleware in Express.js
// Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. They can execute any code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function in the stack.        

app.use((req, res, next) => {
    console.log("Middleware function executed");
    next(); // Call the next middleware function in the stack
})

app.get("/", (req, res) => {
    res.send("Home PAGE");
})

app.get("/profile", (req, res) => {
    res.send("Profile PAGE");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})




