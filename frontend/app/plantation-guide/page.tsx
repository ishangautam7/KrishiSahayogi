"use client";

import { motion } from "framer-motion";
import {
    Calendar, Droplets, Thermometer,
    Wind, ChevronRight,
    Leaf, CloudRain, ShieldCheck, Timer, Search, Filter, Sparkles, Loader2
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { CROP_GUIDES, CropGuide } from "@/lib/cropData";
import { useLanguage } from "@/context/LanguageContext";

// Extract unique categories and seasons for filter options
const CATEGORIES = Array.from(new Set(CROP_GUIDES.map(c => c.category)));
const SEASONS = Array.from(new Set(CROP_GUIDES.map(c => c.season)));

export default function PlantationGuidePage() {
    const [selectedCrop, setSelectedCrop] = useState<CropGuide>(CROP_GUIDES[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSeason, setSelectedSeason] = useState("All");
    const { language } = useLanguage();

    // AI Integration State - store crops with both languages
    const [aiCrops, setAiCrops] = useState<Array<{ en: CropGuide, ne: CropGuide }>>([]);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Track the scientific name of selected crop to maintain selection across language changes
    const selectedCropScientificRef = useRef<string>(CROP_GUIDES[0].scientific);

    // Get current language version of AI crops
    const currentLanguageAiCrops = useMemo(() =>
        aiCrops.map(crop => crop[language as 'en' | 'ne']),
        [aiCrops, language]
    );

    // Merge local and AI crops for display
    const allCrops = useMemo(() => [...CROP_GUIDES, ...currentLanguageAiCrops], [currentLanguageAiCrops]);

    // Auto-update selected crop when language changes
    useEffect(() => {
        // Find the crop with matching scientific name in the new language
        const matchingCrop = allCrops.find(
            crop => crop.scientific === selectedCropScientificRef.current
        );

        if (matchingCrop) {
            setSelectedCrop(matchingCrop);
        }
    }, [language, allCrops]);

    // Update ref when selected crop changes
    useEffect(() => {
        selectedCropScientificRef.current = selectedCrop.scientific;
    }, [selectedCrop]);

    // Filter logic
    const filteredCrops = useMemo(() => {
        return allCrops.filter((crop) => {
            const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.scientific.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || crop.category === selectedCategory;
            // Simple includes check for season as some might be "Winter (Rabi)"
            const matchesSeason = selectedSeason === "All" || crop.season.includes(selectedSeason);

            return matchesSearch && matchesCategory && matchesSeason;
        });
    }, [searchQuery, selectedCategory, selectedSeason, allCrops]);

    const handleAskAI = async () => {
        if (!searchQuery) return;

        console.log('Starting AI generation for:', searchQuery, 'Language:', language);
        setIsGeneratingAI(true);
        try {
            console.log('Sending request to backend...');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000'}/api/v1/ai/plantation-guide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cropName: searchQuery }),
            });

            console.log('Response received:', response.status, response.statusText);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success && data.data && data.data.en && data.data.ne) {
                const newCrop = data.data; // { en: {...}, ne: {...} }
                console.log('Successfully generated crop:', newCrop.en.name, '/', newCrop.ne.name);

                // Avoid duplicates by scientific name (same in both languages)
                if (!aiCrops.some(c => c.en.scientific.toLowerCase() === newCrop.en.scientific.toLowerCase())) {
                    setAiCrops(prev => [newCrop, ...prev]);
                }

                // Set selected crop to current language version
                setSelectedCrop(newCrop[language as 'en' | 'ne']);

                // Clear search to show the new crop clearly
                setSearchQuery("");
            } else {
                console.error('Failed to generate:', data);
                alert(`Error: ${data.message || "Could not generate guide."}`);
            }
        } catch (error: any) {
            console.error("AI Generation Error:", error);
            alert(`Failed to connect to AI service: ${error.message || error}`);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-white dark:bg-gray-950">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            Plantation <span className="text-emerald-500">Manual</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            Expert cultivation advice for Nepal's most vital crops. From seed to harvest, optimize your farming practices.
                        </p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search crops (e.g., Rice, Wheat)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && filteredCrops.length === 0 && handleAskAI()}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-w-[150px]"
                            >
                                <option value="All">All Categories</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>

                            <select
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(e.target.value)}
                                className="px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-w-[150px]"
                            >
                                <option value="All">All Seasons</option>
                                {SEASONS.map(season => <option key={season} value={season}>{season}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Crop Selection Tabs */}
                    {filteredCrops.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {filteredCrops.map((crop) => (
                                <button
                                    key={crop.name}
                                    onClick={() => setSelectedCrop(crop)}
                                    className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-black transition-all border ${selectedCrop.name === crop.name
                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
                                        : "bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 border-gray-100 dark:border-gray-800"
                                        }`}
                                >
                                    {crop.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 font-medium">
                                No specific guide found for "{searchQuery}".
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={handleAskAI}
                                    disabled={isGeneratingAI}
                                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isGeneratingAI ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Consulting Agricultural AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Generate Guide with AI
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {filteredCrops.length > 0 && selectedCrop && (
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
                                <Link href="/crop-recommendation">
                                    <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 hover:shadow-lg transition-shadow">
                                        Run Diagnosis
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
