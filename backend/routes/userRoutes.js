const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {protect}=require("../middleware/authMiddleware")
const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide all fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();

// JWT Payload
        const payload ={
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Generate Token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" }
        );

        // Response
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});


//@routePost/api/users/login
//@desc Authenticate User
//Access will be public
router.post("/login", async (req, res) => {
    try {
        console.log("===== LOGIN REQUEST =====");
        console.log(req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const isMatch = await user.matchPassword(password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const payload = {
            user: {
                id: user._id,
                role: user.role,
            },
        };

        console.log("JWT Secret:", process.env.JWT_SECRET);

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "40h",
            }
        );

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        console.error("LOGIN ERROR:");
        console.error(error);

        return res.status(500).json({
            message: error.message,
            stack: error.stack,
        });
    }
});
//@route GET/api/users/profile
//@Description GET logged-in users profile
//@access will be Private
// @route   GET /api/users/profile
// @desc    Get logged in user's profile
// @access  Private


router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


module.exports = router;