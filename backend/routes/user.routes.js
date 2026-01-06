import express from "express";
import { getFarmers, getNearbyFarmers, updateProfile, getUserById } from "../controllers/user.controller.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", optionalProtect, getFarmers);
router.get("/nearby", protect, getNearbyFarmers);
router.get("/:id", getUserById);
router.put("/profile", protect, updateProfile);

export default router;
