import express from 'express';
import { generateCropTips, generateFertilizerTips, generatePlantationGuide } from '../controllers/ai-tips.controller.js';

const router = express.Router();

router.post('/crop-tips', generateCropTips);
router.post('/fertilizer-tips', generateFertilizerTips);
router.post('/plantation-guide', generatePlantationGuide);

export default router;
