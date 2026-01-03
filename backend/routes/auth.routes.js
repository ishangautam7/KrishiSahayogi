import express from "express";
import passport from "passport";
import { registerUser, loginUser, getMe, logout, googleAuthCallback, refreshToken } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/logout", logout);

// Google Identity Services callback (POST instead of GET)
router.post("/google/callback", googleAuthCallback);

// Refresh token route
router.post("/refresh", refreshToken);

export default router;

