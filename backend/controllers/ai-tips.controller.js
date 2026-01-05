/**
 * AI Tips Controller
 * Generates personalized farming tips using Google Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to get Gemini Model
const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in backend environment variables");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

/**
 * Generate crop-specific growing tips
 * POST /api/v1/ai/crop-tips
 */
export const generateCropTips = async (req, res) => {
    try {
        const { crop, soilData, climate } = req.body;

        if (!crop) {
            return res.status(400).json({
                success: false,
                message: 'Crop name is required'
            });
        }

        const model = getGeminiModel();

        const prompt = `You are an expert agricultural advisor. Provide 4-6 concise, actionable bullet points for growing ${crop} successfully.

Soil Conditions:
- Nitrogen: ${soilData?.N || 'N/A'}
- Phosphorus: ${soilData?.P || 'N/A'}
- Potassium: ${soilData?.K || 'N/A'}
- pH: ${soilData?.pH || 'N/A'}

Climate:
- Temperature: ${climate?.temperature || 'N/A'}°C
- Humidity: ${climate?.humidity || 'N/A'}%
- Rainfall: ${climate?.rainfall || 'N/A'}mm

Provide specific, practical tips for:
1. Best planting practices
2. Nutrient management
3. Water requirements
4. Common challenges and solutions

Format: Return ONLY bullet points (•) without numbering. Keep each point under 15 words. Focus on actionable advice.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract bullet points
        const tips = text
            .split('\n')
            .filter(line => line.trim().length > 0 && (line.includes('•') || line.includes('-') || line.includes('*')))
            .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
            .filter(tip => tip.length > 10); // Filter out empty or too short lines

        res.json({
            success: true,
            crop,
            tips,
            rawResponse: text
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate crop tips',
            error: error.message
        });
    }
};

/**
 * Generate fertilizer usage tips
 * POST /api/v1/ai/fertilizer-tips
 */
export const generateFertilizerTips = async (req, res) => {
    try {
        const { fertilizer, soilData, cropType } = req.body;

        if (!fertilizer) {
            return res.status(400).json({
                success: false,
                message: 'Fertilizer name is required'
            });
        }

        const model = getGeminiModel();

        const prompt = `You are an expert agricultural advisor. Provide 4-6 concise, actionable bullet points for using ${fertilizer} fertilizer effectively.

Current Soil Nutrient Levels:
- Nitrogen: ${soilData?.N || 'N/A'}
- Phosphorus: ${soilData?.P || 'N/A'}
- Potassium: ${soilData?.K || 'N/A'}

Crop Type: ${cropType || 'General farming'}
Soil Type: ${soilData?.soilType || 'N/A'}

Provide specific, practical tips for:
1. Application timing and frequency
2. Proper dosage and dilution
3. Application methods
4. Safety precautions
5. Expected results

Format: Return ONLY bullet points (•) without numbering. Keep each point under 15 words. Focus on actionable advice. Avoid using *`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract bullet points
        const tips = text
            .split('\n')
            .filter(line => line.trim().length > 0 && (line.includes('•') || line.includes('-') || line.includes('*')))
            .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
            .filter(tip => tip.length > 10);

        res.json({
            success: true,
            fertilizer,
            tips,
            rawResponse: text
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate fertilizer tips',
            error: error.message
        });
    }
};

/**
 * Generate comprehensive plantation guide
 * POST /api/v1/ai/plantation-guide
 */
export const generatePlantationGuide = async (req, res) => {
    try {
        const { cropName } = req.body;

        if (!cropName) {
            return res.status(400).json({
                success: false,
                message: 'Crop name is required'
            });
        }

        const model = getGeminiModel();

        // Generate both English and Nepali versions
        const prompt = `You are an expert agricultural scientist. Create a detailed plantation guide for "${cropName}" in BOTH English and Nepali.

Return strictly valid JSON with this exact structure (no markdown formatting, just raw JSON):
{
  "en": {
    "name": "${cropName}",
    "scientific": "Scientific Name (in Latin script)",
    "category": "One of: Cereal, Vegetable, Fruit, Cash Crop, Oilseed, Other",
    "season": "Best Growing Season",
    "image": "/assets/placeholder.jpg",
    "description": "Brief description (2 sentences)",
    "stats": {
      "temp": "min°C - max°C",
      "rainfall": "min mm - max mm",
      "soil": "Soil Type",
      "duration": "Days to Harvest (e.g. 90-120 Days)"
    },
    "steps": [
      "Step 1...",
      "Step 2...",
      "Step 3...",
      "Step 4..."
    ]
  },
  "ne": {
    "name": "Nepali name in Devanagari",
    "scientific": "Scientific Name (same as English, in Latin script)",
    "category": "Category in Nepali",
    "season": "Season in Nepali",
    "image": "/assets/placeholder.jpg",
    "description": "Description in Nepali (Devanagari)",
    "stats": {
      "temp": "same as English",
      "rainfall": "same as English",
      "soil": "Soil type in Nepali",
      "duration": "Duration in Nepali"
    },
    "steps": [
      "Step 1 in Nepali...",
      "Step 2 in Nepali...",
      "Step 3 in Nepali...",
      "Step 4 in Nepali..."
    ]
  }
}

IMPORTANT: Provide complete translations. The 'en' object should be in English, the 'ne' object should be in Nepali (Devanagari script). Scientific name stays the same in both.`;

        // Retry logic for transient errors
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Clean up markdown code blocks if present
                const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const cropGuides = JSON.parse(jsonString);

                // Ensure images are set
                if (cropGuides.en) cropGuides.en.image = "/assets/images/Crop.png";
                if (cropGuides.ne) cropGuides.ne.image = "/assets/images/Crop.png";

                return res.json({
                    success: true,
                    data: cropGuides // Returns { en: {...}, ne: {...} }
                });
            } catch (err) {
                lastError = err;
                // If it's a 503 or 429, retry with exponential backoff
                if (err.status === 503 || err.status === 429) {
                    console.log(`Attempt ${attempt + 1} failed with ${err.status}, retrying...`);
                    if (attempt < 2) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                        continue;
                    }
                }
                // For other errors, don't retry
                throw err;
            }
        }

        throw lastError;

    } catch (error) {
        console.error('Gemini Plantation Guide error:', error);

        // Provide user-friendly error messages
        let message = 'Failed to generate plantation guide';
        if (error.status === 503) {
            message = 'AI service is temporarily unavailable. Please try again in a moment.';
        } else if (error.status === 429) {
            message = 'Too many requests. Please wait a moment and try again.';
        }

        res.status(500).json({
            success: false,
            message,
            error: error.message
        });
    }
};
