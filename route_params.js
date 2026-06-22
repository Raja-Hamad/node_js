
// Route Parameters in Express.js
// Route parameters are used to capture values specified in the URL. They are defined using a colon (:) followed by the parameter name in the route path. When a request is made to a route with parameters, the values can be accessed through the req.params object.  

const express = require('express');
const app = express();
app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User ID is ${userId}` });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});