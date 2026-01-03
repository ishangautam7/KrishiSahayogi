import express from "express";
import { getFarmers, getNearbyFarmers, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getFarmers);
router.get("/nearby", protect, getNearbyFarmers);
router.put("/profile", protect, updateProfile);

export default router;
