import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const sendToken = (user, statusCode, res) => {
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    const accessTokenOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    const refreshTokenOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    };

    res.status(statusCode)
        .cookie("token", token, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json({
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
    res.cookie("refreshToken", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// @desc    Google Identity Services callback
// @route   POST /api/v1/auth/google/callback
// @access  Public
export const googleAuthCallback = async (req, res, next) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ success: false, message: "No credential provided" });
        }

        // Verify the Google JWT token
        const ticket = await verifyGoogleToken(credential);
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ success: false, message: "Invalid Google token" });
        }

        // Check if user exists with Google ID or email
        let user = await User.findOne({
            $or: [
                { googleId: payload.sub },
                { email: payload.email }
            ]
        });

        if (user) {
            // Update Google ID if linking existing local account
            if (!user.googleId) {
                user.googleId = payload.sub;
                user.authProvider = 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name: payload.name || payload.email.split('@')[0],
                email: payload.email,
                googleId: payload.sub,
                authProvider: 'google',
                avatar: payload.picture || 'https://via.placeholder.com/150',
                phone: 'Not provided',
                location: 'Not provided',
                primaryCrops: 'Not specified',
            });
        }

        // Generate tokens
        const token = user.generateToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const accessTokenOptions = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        };

        const refreshTokenOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        };

        // Set cookies and return success
        res.cookie("token", token, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
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
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(401).json({ success: false, message: "Google authentication failed" });
    }
};

// Helper function to verify Google token
async function verifyGoogleToken(token) {
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    return ticket;
}

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token not found" });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "default_refresh_secret"
        );

        // Find user and check if refresh token matches
        const user = await User.findById(decoded._id).select("+refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }

        // Generate new tokens
        sendToken(user, 200, res);
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }
};
