import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                text: String,
                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Post = mongoose.model("Post", postSchema);
