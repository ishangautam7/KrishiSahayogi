import express from "express";
import { getFarmers, getNearbyFarmers } from "../controllers/user.controller.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";
import { getFarmers, getNearbyFarmers, updateProfile } from "../controllers/user.controller.js";
import { protect,optionalProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", optionalProtect, getFarmers);
router.get("/nearby", protect, getNearbyFarmers);
router.put("/profile", protect, updateProfile);

export default router;
