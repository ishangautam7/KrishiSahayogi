import axios from 'axios';

const PYTHON_SERVER_URL = process.env.PYTHON_SERVER_URL || 'http://localhost:5000';

/**
 * Proxy crop prediction request to Python ML server
 */
export const predictCrop = async (req, res) => {
    try {
        const { n, p, k, temp, humidity, ph, rainfall } = req.body;

        // Validate required fields
        const requiredFields = ['n', 'p', 'k', 'temp', 'humidity', 'ph', 'rainfall'];
        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        // Forward request to Python server
        const response = await axios.post(
            `${PYTHON_SERVER_URL}/predict_crop`,
            { n, p, k, temp, humidity, ph, rainfall }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Crop prediction error:', error);

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to predict crop. Please ensure the Python server is running.'
        });
    }
};

/**
 * Proxy fertilizer prediction request to Python ML server
 */
export const predictFertilizer = async (req, res) => {
    try {
        const { temp, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorus } = req.body;

        // Validate required fields
        const requiredFields = ['temp', 'humidity', 'moisture', 'soil_type', 'crop_type', 'nitrogen', 'potassium', 'phosphorus'];
        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        // Forward request to Python server
        const response = await axios.post(
            `${PYTHON_SERVER_URL}/predict_fertilizer`,
            { temp, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorus }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Fertilizer prediction error:', error);

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to predict fertilizer. Please ensure the Python server is running.'
        });
    }
};
