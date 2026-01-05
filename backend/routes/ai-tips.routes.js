import express from 'express';
import { generateCropTips, generateFertilizerTips } from '../controllers/ai-tips.controller.js';

const router = express.Router();

router.post('/crop-tips', generateCropTips);
router.post('/fertilizer-tips', generateFertilizerTips);

export default router;
