import express from "express";
import { getEnvironmentalData } from "../controllers/location.controller.js";

const router = express.Router();

// Get environmental data based on coordinates
router.get('/data', getEnvironmentalData);

export default router;

