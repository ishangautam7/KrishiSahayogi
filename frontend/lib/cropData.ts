
export interface CropGuide {
  name: string;
  scientific: string;
  category: string;
  season: string;
  image: string;
  description: string;
  stats: {
    temp: string;
    rainfall: string;
    soil: string;
    duration: string;
  };
  steps: string[];
}

export const CROP_GUIDES_EN: CropGuide[] = [
  {
    name: "Rice",
    scientific: "Oryza sativa",
    category: "Cereal",
    season: "Monsoon (Kharif)",
    image: "/assets/images/rice.webp",
    description: "The primary staple crop of Nepal, requiring standing water and humid conditions.",
    stats: {
      temp: "20°C - 35°C",
      rainfall: "1500mm - 2000mm",
      soil: "Clayey Loam",
      duration: "120 - 150 Days"
    },
    steps: [
      "Seedbed preparation (May-June)",
      "Transplanting seedlings (June-July)",
      "Regular weeding and water management",
      "Harvesting when grains turn golden"
    ]
  },
  {
    name: "Wheat",
    scientific: "Triticum aestivum",
    category: "Cereal",
    season: "Winter (Rabi)",
    image: "/assets/images/wheat.jpg",
    description: "A major winter crop in the Terai and mid-hills, essential for food security.",
    stats: {
      temp: "10°C - 25°C",
      rainfall: "450mm - 650mm",
      soil: "Loamy",
      duration: "110 - 140 Days"
    },
    steps: [
      "Sowing in late October-November",
      "Irrigation at critical growth stages",
      "Balanced nitrogen fertilization",
      "Harvesting in March-April"
    ]
  },
  {
    name: "Maize (Corn)",
    scientific: "Zea mays",
    category: "Cereal",
    season: "Summer/Monsoon",
    image: "/assets/images/makai.png",
    description: "Widely grown in the hilly regions for both food and livestock feed.",
    stats: {
      temp: "18°C - 30°C",
      rainfall: "500mm - 800mm",
      soil: "Well-drained Loam",
      duration: "90 - 120 Days"
    },
    steps: [
      "Soil preparation with organic manure",
      "Sowing with proper spacing",
      "Inter-cultivation for aeration",
      "Harvesting when husks dry"
    ]
  },
  {
    name: "Potato",
    scientific: "Solanum tuberosum",
    category: "Vegetable",
    season: "Winter",
    image: "/assets/images/potato.jpg",
    description: "A major cash crop in Nepal, grown across Terai, Hills, and Mountains.",
    stats: {
      temp: "15°C - 25°C",
      rainfall: "500mm - 700mm",
      soil: "Sandy Loam",
      duration: "90 - 120 Days"
    },
    steps: [
      "Choose disease-free seed tubers",
      "Prepare ridges for planting",
      "Earthing up at 30-45 days",
      "Harvest when vines yellow and die"
    ]
  }
];

export const CROP_GUIDES_NE: CropGuide[] = [
  {
    name: "धान",
    scientific: "Oryza sativa",
    category: "अन्न",
    season: "मनसुन (खरिफ)",
    image: "/assets/images/rice.webp",
    description: "नेपालको प्रमुख मुख्य बाली, जसलाई स्थिर पानी र आर्द्र अवस्था चाहिन्छ।",
    stats: {
      temp: "20°C - 35°C",
      rainfall: "1500mm - 2000mm",
      soil: "माटो दोमट",
      duration: "120 - 150 दिन"
    },
    steps: [
      "बीउ तयारी (मे-जुन)",
      "बिरुवा रोपण (जुन-जुलाई)",
      "नियमित झार नियन्त्रण र पानी व्यवस्थापन",
      "अनाज सुनौलो हुँदा फसल काट्ने"
    ]
  },
  {
    name: "गहुँ",
    scientific: "Triticum aestivum",
    category: "अन्न",
    season: "हिउँद (रबी)",
    image: "/assets/images/wheat.jpg",
    description: "तराई र मध्यपहाडी क्षेत्रको प्रमुख हिउँदे बाली, खाद्य सुरक्षाका लागि आवश्यक छ।",
    stats: {
      temp: "10°C - 25°C",
      rainfall: "450mm - 650mm",
      soil: "दोमट",
      duration: "110 - 140 दिन"
    },
    steps: [
      "अक्टोबर-नोभेम्बरको अन्त्यमा सowing",
      "महत्वपूर्ण वृद्धि चरणहरूमा सिंचाई",
      "सन्तुलित नाइट्रोजन मल",
      "मार्च-अप्रिलमा फसल काट्ने"
    ]
  },
  {
    name: "मकै",
    scientific: "Zea mays",
    category: "अन्न",
    season: "गर्मी/मनसुन",
    image: "/assets/images/makai.png",
    description: "मानिसको खाना र पशु आहाराका लागि पहाडी क्षेत्रमा व्यापक रूपमा लगाइन्छ।",
    stats: {
      temp: "18°C - 30°C",
      rainfall: "500mm - 800mm",
      soil: "निकास राम्रो भएको दोमट",
      duration: "90 - 120 दिन"
    },
    steps: [
      "जैविक मलसहित माटोको तयारी",
      "उचित दूरीमा बीउ रोप्ने",
      "नियमित गोडमेल",
      "घोगा सुकेपछि फसल काट्ने"
    ]
  },
  {
    name: "आलु",
    scientific: "Solanum tuberosum",
    category: "तरकारी",
    season: "हिउँद",
    image: "/assets/images/potato.jpg",
    description: "नेपालको प्रमुख नगदे बाली, तराई, पहाड र हिमालमा लगाइन्छ।",
    stats: {
      temp: "15°C - 25°C",
      rainfall: "500mm - 700mm",
      soil: "बलौटे दोमट",
      duration: "90 - 120 दिन"
    },
    steps: [
      "रोगमुक्त बीउ आलु छान्नुहोस्",
      "रोप्नका लागि ड्याङ बनाउनुहोस्",
      "३०-४५ दिनमा उकेरा लगाउने",
      "बोट सुकेपछि खन्ने"
    ]
  }
];

// Helper function to get crops based on language
export const getCropGuides = (language: 'en' | 'ne'): CropGuide[] => {
  return language === 'ne' ? CROP_GUIDES_NE : CROP_GUIDES_EN;
};

// For backward compatibility
export const CROP_GUIDES = CROP_GUIDES_EN;
