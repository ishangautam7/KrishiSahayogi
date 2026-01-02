import express from "express";
import { getPosts, createPost, likePost } from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, likePost);

export default router;
