import { User } from "../models/user.model.js";

const sendToken = (user, statusCode, res) => {
    const token = user.generateToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            farmerType: user.farmerType,
            primaryCrops: user.primaryCrops,
        },
    });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, location, farmerType, primaryCrops } = req.body;

        if (!name || !email || !password || !phone || !location || !primaryCrops) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            location,
            farmerType,
            primaryCrops,
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
