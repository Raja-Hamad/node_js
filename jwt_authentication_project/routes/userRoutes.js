const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const { body } = require("express-validator");

const userController = require("../controllers/userController");

router.post(
    "/register",

    upload.single("profileImage"),

    [
        body("name").notEmpty(),
        body("email").isEmail(),
        body("password").isLength({ min: 6 })
    ],

    userController.registerUser
);

router.post("/login", userController.loginUser);

router.get(
    "/profile",
    authMiddleware,
    userController.userProfile
);

// for updating the profile image of current user
router.put(
    "/update-profile-image",
    authMiddleware,
    upload.single("profileImage"),
    userController.updateProfileImage
);

router.delete(
    "/delete-profile-image",
    authMiddleware,
    userController.deleteProfileImage
);

module.exports = router;