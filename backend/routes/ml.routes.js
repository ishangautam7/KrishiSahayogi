import express from 'express';
import { predictCrop, predictFertilizer } from '../controllers/ml.controller.js';

const router = express.Router();

// POST /api/v1/ml/predict-crop - Predict crop recommendation
router.post('/predict-crop', predictCrop);

// POST /api/v1/ml/predict-fertilizer - Predict fertilizer recommendation
router.post('/predict-fertilizer', predictFertilizer);

export default router;
