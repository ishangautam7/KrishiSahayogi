import axios from 'axios';
import FormData from 'form-data';

const PYTHON_SERVER_URL = process.env.PYTHON_SERVER_URL || 'http://localhost:5000';


export const predictDisease = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file uploaded'
            });
        }

        // Create form data to send to Python server
        const formData = new FormData();
        formData.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Forward request to Python server
        const response = await axios.post(
            `${PYTHON_SERVER_URL}/predict_disease`,
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                }
            }
        );

        // Return prediction result
        res.json(response.data);
    } catch (error) {
        console.error('Disease prediction error:', error);

        if (error.response) {
            // Python server returned an error
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to predict disease. Please ensure the Python server is running.'
        });
    }
};

/**
 * Get AI-generated solution for a plant disease
 */
export const getDiseaseSolution = async (req, res) => {
    try {
        const { disease_name, api_key } = req.body;

        if (!disease_name) {
            return res.status(400).json({
                success: false,
                error: 'disease_name is required'
            });
        }

        // Forward request to Python server
        const response = await axios.post(
            `${PYTHON_SERVER_URL}/get_disease_solution`,
            {
                disease_name,
                api_key
            },
            {
                headers: api_key ? {
                    'X-Gemini-API-Key': api_key
                } : {}
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Disease solution error:', error);

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to get disease solution. Please ensure the Python server is running.'
        });
    }
};
