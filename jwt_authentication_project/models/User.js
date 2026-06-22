const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    // 🔥 NEW FIELD
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    // 📸 NEW FIELD
    profileImage: {
        type: String,
        default: null
    },
    profileImagePublicId: {
        type: String,
        default: null
    }

});

module.exports = mongoose.model("User", userSchema);