import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["vegetables", "fruits", "grains", "seeds", "tools", "other"],
        },
        image: {
            type: String,
            default: "https://via.placeholder.com/300",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);
