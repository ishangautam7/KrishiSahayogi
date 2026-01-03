import express from 'express';
import multer from 'multer';
import { predictDisease, getDiseaseSolution } from '../controllers/disease.controller.js';

const router = express.Router();

// Configure multer for memory storage (file will be in req.file.buffer)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// POST /api/disease/predict - Upload image and predict disease
router.post('/predict', upload.single('image'), predictDisease);

// POST /api/disease/solution - Get AI-generated solution for disease
router.post('/solution', getDiseaseSolution);

export default router;
