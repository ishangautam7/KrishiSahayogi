import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v4 as uuidv4 } from 'uuid';
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: function () {
                return this.authProvider === 'local';
            },
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true,
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        refreshToken: {
            type: String,
            select: false,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        farmerType: {
            type: String,
            enum: ["subsistence", "commercial", "hobbyist", "student"],
            default: "subsistence",
        },
        primaryCrops: {
            type: String,
            required: [true, "Primary crops are required"],
            trim: true,
        },
        avatar: {
            type: String, // URL to image
            default: "https://via.placeholder.com/150",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.JWT_SECRET || "default_secret_for_development_replace_immediately",
        { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );
};

userSchema.methods.generateRefreshToken = function () {
    
    const refreshToken = jwt.sign(
        {
            _id: this._id,
            tokenId: uuidv4(),
        },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "default_refresh_secret",
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
    );
    return refreshToken;
};

export const User = mongoose.model("User", userSchema);
