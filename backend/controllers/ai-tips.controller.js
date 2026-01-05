/**
 * AI Tips Controller
 * Generates personalized farming tips using Google Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
