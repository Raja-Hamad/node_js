// Route and global middleware together

const express = require("express");
const app = express();

function appLogger(req, res, next) {
    console.log("Login Middleware");
    next();
};

function checkUser(req, res, next) {
    console.log("Checking user");
    next();
};

function profileHandler(req, res) {
    res.send("Profile View");
};

function aboutHandler(req,res){
    res.send("About View");
}

app.use(appLogger);

app.get("/profile", checkUser, profileHandler);

app.get("/about",checkUser,aboutHandler);

app.listen(3000, (req, res) => {
    console.log("Listening for requests on port 3000");
});