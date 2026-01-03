"use client";

import { motion } from "framer-motion";
import {
    Sprout, Calendar, Droplets, Thermometer,
    Sun, Wind, BookOpen, ChevronRight,
    Leaf, CloudRain, ShieldCheck, Timer
} from "lucide-react";
import { useState } from "react";

const CROP_GUIDES = [
    {
        name: "Rice (Paddy)",
        scientific: "Oryza sativa",
        category: "Cereal",
        season: "Monsoon (Kharif)",
        image: "/assets/images/Crop.png", // Reusing existing assets
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
    }
];

export default function PlantationGuidePage() {
    const [selectedCrop, setSelectedCrop] = useState(CROP_GUIDES[0]);

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-white dark:bg-gray-950">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6"
                        >
                            <BookOpen className="w-4 h-4" /> Comprehensive Guide
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            Plantation <span className="text-emerald-500">Manual</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            Expert cultivation advice for Nepal's most vital crops. From seed to harvest, optimize your farming practices.
                        </p>
                    </div>

                    <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                        {CROP_GUIDES.map((crop) => (
                            <button
                                key={crop.name}
                                onClick={() => setSelectedCrop(crop)}
                                className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${selectedCrop.name === crop.name ? "bg-white dark:bg-gray-800 text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                {crop.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-10">
                        <motion.div
                            key={selectedCrop.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-[21/9] rounded-[3rem] overflow-hidden group shadow-2xl"
                        >
                            <img
                                src={selectedCrop.image}
                                alt={selectedCrop.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 text-white">
                                <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">{selectedCrop.category}</p>
                                <h2 className="text-4xl md:text-6xl font-black mb-2">{selectedCrop.name}</h2>
                                <p className="text-white/70 italic font-medium">{selectedCrop.scientific}</p>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <Leaf className="text-emerald-500" /> Overview
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8">
                                    {selectedCrop.description}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                        <Calendar className="text-emerald-500 w-5 h-5" />
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400">Growing Season</p>
                                            <p className="font-bold">{selectedCrop.season}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                        <Timer className="text-emerald-500 w-5 h-5" />
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400">Typical Duration</p>
                                            <p className="font-bold">{selectedCrop.stats.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-gradient-to-br from-white to-emerald-50 dark:to-emerald-950/20">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500" /> Best Practices
                                </h3>
                                <div className="space-y-6">
                                    {selectedCrop.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 pt-1">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Growth Requirements</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                                            <Thermometer className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black text-gray-500">Temperature</span>
                                    </div>
                                    <span className="font-black text-gray-900 dark:text-white">{selectedCrop.stats.temp}</span>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                                            <CloudRain className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black text-gray-500">Annual Rainfall</span>
                                    </div>
                                    <span className="font-black text-gray-900 dark:text-white">{selectedCrop.stats.rainfall}</span>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl">
                                            <Wind className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black text-gray-500">Soil Quality</span>
                                    </div>
                                    <span className="font-black text-gray-900 dark:text-white">{selectedCrop.stats.soil}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                Download Full SOP <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="glass p-8 rounded-[3rem] bg-emerald-600 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <h4 className="text-lg font-black mb-4 relative z-10">Need specific advice?</h4>
                            <p className="text-white/80 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                                Use our AI predictors to get customized recommendations for your specific soil data and location.
                            </p>
                            <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 hover:shadow-lg transition-shadow">
                                Run Diagnosis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
