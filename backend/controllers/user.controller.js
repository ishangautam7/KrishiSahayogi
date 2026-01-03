import { User } from "../models/user.model.js";

// @desc    Get nearby farmers
// @route   GET /api/v1/users/nearby
// @access  Private
export const getNearbyFarmers = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // Find users in the same location, excluding current user
        const farmers = await User.find({
            location: user.location,
            _id: { $ne: user.id }
        }).select("-password");

        res.status(200).json({
            success: true,
            count: farmers.length,
            farmers
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all farmers with filters
// @route   GET /api/v1/users
// @access  Public
export const getFarmers = async (req, res, next) => {
    try {
        const { location, farmerType, primaryCrops } = req.query;

        const query = {};

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (farmerType && farmerType !== "all") {
            query.farmerType = farmerType;
        }

        if (primaryCrops) {
            query.primaryCrops = { $regex: primaryCrops, $options: "i" };
        }

        // Exclude current user if logged in
        if (req.user) {
            query._id = { $ne: req.user.id };
        }

        const farmers = await User.find(query).select("-password");
        res.status(200).json({
            success: true,
            count: farmers.length,
            farmers
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Update user profile
// @route   PUT /api/v1/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, location, farmerType, primaryCrops } = req.body;

        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (location) user.location = location;
        if (farmerType) user.farmerType = farmerType;
        if (primaryCrops) user.primaryCrops = primaryCrops;

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};
