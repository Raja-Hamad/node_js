const express = require("express");
const app = express();

const connectDB = require("./db");
const productRoutes = require("./routes/productRoutes");

app.use(express.json());

connectDB();

// Routes
app.use("/products", productRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});