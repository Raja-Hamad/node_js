const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary");
exports.registerUser = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            profileImage: req.file ? req.file.path : null,
            profileImagePublicId: req.file ? req.file.filename : null
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // check in mong database that the email exists in db or not

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        /* match the password with the password that is stored in database for the email that 
the user is requesting for
        */

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        /* Mongodb will then generate and return token to user that contains the user id inside the token
        and expiry after 1 hour of token generation
        */
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role   // 🔥 IMPORTANT
            },
            "mysecretkey",
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.userProfile = async (req, res) => {
    res.json({
        message: "Welcome to profile",
        user: req.user
    });
};
exports.updateProfileImage = async (req, res) => {

    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // User ne image hi nahi bheji
        if (!req.file) {

            return res.status(400).json({
                message: "Please select an image"
            });

        }

        // Old image delete
        if (user.profileImagePublicId) {

            await cloudinary.uploader.destroy(
                user.profileImagePublicId
            );

        }


        // Save new image details

        user.profileImage = req.file.path;

        user.profileImagePublicId =
            req.file.filename;


        await user.save();


        res.json({

            message:
                "Profile image updated successfully",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};
exports.deleteProfileImage = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.userId
        );


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        if (!user.profileImagePublicId) {

            return res.status(400).json({

                message:
                    "No profile image found"

            });

        }


        await cloudinary.uploader.destroy(

            user.profileImagePublicId

        );


        user.profileImage = null;

        user.profileImagePublicId = null;


        await user.save();


        res.json({

            message:
                "Profile image deleted successfully",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};