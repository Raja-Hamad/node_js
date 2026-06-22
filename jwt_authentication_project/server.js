const express = require("express");
const app = express();

const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

connectDB();

// Routes
app.use("/users", userRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});