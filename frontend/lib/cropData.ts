
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

export const CROP_GUIDES: CropGuide[] = [
  {
    name: "Rice (Paddy)",
    scientific: "Oryza sativa",
    category: "Cereal",
    season: "Monsoon (Kharif)",
    image: "/assets/images/Crop.png",
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
    image: "/assets/images/Yield.png",
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
    image: "/assets/images/Market.png",
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
    image: "/assets/images/Crop.png", // Placeholder reuse
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
  },
  {
    name: "Tomato",
    scientific: "Solanum lycopersicum",
    category: "Vegetable",
    season: "Spring/Summer",
    image: "/assets/images/Yield.png", // Placeholder reuse
    description: "High-value vegetable crop, widely cultivated in tunnels and open fields.",
    stats: {
      temp: "20°C - 25°C",
      rainfall: "400mm - 600mm",
      soil: "Sandy Loam",
      duration: "100 - 130 Days"
    },
    steps: [
      "Nursery raising in plastic trays",
      "Transplanting after 3-4 weeks",
      "Staking for support",
      "Regular harvesting at breaker stage"
    ]
  },
  {
    name: "Sugarcane",
    scientific: "Saccharum officinarum",
    category: "Cash Crop",
    season: "Spring",
    image: "/assets/images/Market.png", // Placeholder reuse
    description: "Main industrial crop of Terai region, source of sugar and jaggery.",
    stats: {
      temp: "20°C - 35°C",
      rainfall: "1500mm - 2500mm",
      soil: "Deep Loams",
      duration: "10 - 14 Months"
    },
    steps: [
      "Planting setts in trenches",
      "Earthing up to prevent lodging",
      "Frequent irrigation in dry months",
      "Harvesting at peak maturity"
    ]
  },
  {
    name: "Tea",
    scientific: "Camellia sinensis",
    category: "Cash Crop",
    season: "Perennial",
    image: "/assets/images/Crop.png", // Placeholder reuse
    description: "World-famous Orthodox tea from Ilam and CTC tea from Jhapa.",
    stats: {
      temp: "15°C - 30°C",
      rainfall: "2000mm+",
      soil: "Acidic Loam",
      duration: "Perennial"
    },
    steps: [
      "Nursery vegetative propagation",
      "Planting on contour terraces",
      "Pruning for frame formation",
      "Plucking 'two leaves and a bud'"
    ]
  },
  {
    name: "Coffee",
    scientific: "Coffea arabica",
    category: "Cash Crop",
    season: "Perennial",
    image: "/assets/images/Yield.png", // Placeholder reuse
    description: "High-quality organic coffee grown in mid-hills under shade trees.",
    stats: {
      temp: "15°C - 25°C",
      rainfall: "1500mm - 2000mm",
      soil: "Rich Forest Soil",
      duration: "Perennial"
    },
    steps: [
      "Seedling raising in polybags",
      "Planting with shade trees",
      "Training and pruning bushes",
      "Selective picking of red cherries"
    ]
  },
  {
    name: "Mustard",
    scientific: "Brassica campestris",
    category: "Oilseed",
    season: "Winter",
    image: "/assets/images/Market.png", // Placeholder reuse
    description: "Important oilseed crop, often grown in rotation with rice or maize.",
    stats: {
      temp: "10°C - 25°C",
      rainfall: "300mm - 450mm",
      soil: "Sandy to Heavy Loam",
      duration: "90 - 110 Days"
    },
    steps: [
      "Sowing in late September-October",
      "Thinning to maintain spacing",
      "Control of aphids is critical",
      "Harvest when pods turn yellow"
    ]
  }
];
