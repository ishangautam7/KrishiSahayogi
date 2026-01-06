export interface FertilizerData {
    name: string;
    image: string;
    description: string;
    composition: string;
    tips: string[];
}

const fertilizers: Record<string, FertilizerData> = {
    'Urea': {
        name: 'Urea',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
        description: 'Urea is the most important nitrogenous fertilizer in the market, with the highest Nitrogen content (about 46%). It is a white crystalline organic chemical compound.',
        composition: '46-0-0',
        tips: [
            'Apply Urea when the soil is moist to prevent nitrogen loss.',
            'Do not mix with seeds during sowing.',
            'Spread evenly across the field for best results.',
            'Water the plants after application to help absorption.'
        ]
    },
    'DAP': {
        name: 'DAP (Diammonium Phosphate)',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
        description: 'DAP is the world\'s most widely used phosphorus fertilizer. It is made from two common constituents in the fertilizer industry, and its relatively high nutrient content and excellent physical properties make it a popular choice in farming.',
        composition: '18-46-0',
        tips: [
            'Best applied during sowing or transplanting.',
            'Ensures strong root development in early stages.',
            'Provides both Nitrogen and Phosphorus to the soil.',
            'Avoid contact with seeds to prevent seedling damage.'
        ]
    },
    '14-35-14': {
        name: 'NPK 14-35-14',
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800&auto=format&fit=crop',
        description: 'A balanced complex fertilizer containing Nitrogen, Phosphorus, and Potassium. Excellent for base dressing during the early growth of crops.',
        composition: '14-35-14',
        tips: [
            'Ideal for root crops and tuber crops.',
            'Helps in flowering and fruiting stages.',
            'Reduces the need for multiple fertilizer applications.',
            'Store in a cool, dry place to prevent clumping.'
        ]
    },
    '28-28': {
        name: 'NPK 28-28-0',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
        description: 'A high-nitrogen and high-phosphorus fertilizer, perfect for vegetative growth and early development.',
        composition: '28-28-0',
        tips: [
            'Promotes vigorous green growth.',
            'Effective for cereal crops like wheat and maize.',
            'Apply during the peak vegetative stage.',
            'Ensure adequate soil moisture before application.'
        ]
    },
    '17-17-17': {
        name: 'NPK 17-17-17',
        image: 'https://images.unsplash.com/photo-1599406560943-7f3c4c9b9ce7?q=80&w=800&auto=format&fit=crop',
        description: 'A universally balanced fertilizer suitable for almost all crops and soil types. Provides equal amounts of N, P, and K.',
        composition: '17-17-17',
        tips: [
            'Good for maintenance of established plants.',
            'Supports overall plant health and disease resistance.',
            'Can be used for both commercial and garden crops.',
            'Safe for use on fruit trees and vegetables.'
        ]
    },
    '20-20': {
        name: 'NPK 20-20-0',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
        description: 'A balanced nitrogen and phosphorus fertilizer with no potassium, ideal for soils already rich in potash.',
        composition: '20-20-0',
        tips: [
            'Speeds up maturity and improves grain weight.',
            'Highly soluble in water for quick effect.',
            'Effective for top dressing in humid conditions.',
            'Properly seal the bag after use to avoid moisture entry.'
        ]
    },
    '10-26-26': {
        name: 'NPK 10-26-26',
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800&auto=format&fit=crop',
        description: 'High potassium and phosphorus content makes it ideal for flowering, fruiting, and overall plant resilience.',
        composition: '10-26-26',
        tips: [
            'Enhances the flavor and shelf life of fruits and vegetables.',
            'Increases resistance to pests and extreme weather.',
            'Use during the reproductive phase for best yields.',
            'Ensures better grain filling in cereal crops.'
        ]
    }
};

export const getFertilizerData = (name: string): FertilizerData => {
    // Try to find a match by key
    const match = fertilizers[name] || Object.values(fertilizers).find(f => name.includes(f.name) || f.name.includes(name));

    if (match) return match;

    // Default fallback
    return {
        name: name,
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
        description: 'A specialized fertilizer formulated to provide the essential nutrients needed for your specific crop and soil conditions.',
        composition: 'N-P-K',
        tips: [
            'Always perform a soil test before application.',
            'Follow the recommended dosage on the packaging.',
            'Ensure even distribution for uniform growth.',
            'Store away from direct sunlight and moisture.'
        ]
    };
};
