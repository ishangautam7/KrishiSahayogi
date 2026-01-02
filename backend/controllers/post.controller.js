import { Post } from "../models/post.model.js";

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "name avatar farmerType location");
        res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
export const createPost = async (req, res, next) => {
    try {
        req.body.author = req.user.id;

        const post = await Post.create(req.body);

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like post
// @route   PUT /api/v1/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const index = post.likes.indexOf(req.user.id);

        if (index > -1) {
            post.likes.splice(index, 1);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({
            success: true,
            likes: post.likes.length,
        });
    } catch (error) {
        next(error);
    }
};
