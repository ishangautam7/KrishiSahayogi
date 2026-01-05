import express from "express";
import { calculateFromQuestionnaire } from "../controllers/soil-assessment.controller.js";

const router = express.Router();

// Calculate NPK and pH from questionnaire answers
router.post('/calculate', calculateFromQuestionnaire);

export default router;
