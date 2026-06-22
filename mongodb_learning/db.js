const mongoose = require("mongoose");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

async function connectDB() {
    try {
        await mongoose.connect(
            "mongodb+srv://kayanihamad25_db_user:IIq9SeRpRK5d2jnX@cluster0.jejvsof.mongodb.net/test?retryWrites=true&w=majority"
        );

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("DB Error:", error);
    }
}

module.exports = connectDB;