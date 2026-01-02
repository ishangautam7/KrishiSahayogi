"use client";

import { motion } from "framer-motion";
import { Sprout, Brain, MapPin, Cloudy } from "lucide-react";

export default function CropRecommendationPage() {
    return (
        <main className="min-h-screen pt-32 px-4 relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse-soft"></div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-6">
                        <Brain className="w-4 h-4" /> AI Powered Analysis
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6">Crop Recommendation</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Get intelligent crop suggestions based on your soil type, season, and current weather conditions in Nepal.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Input Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass p-8 rounded-[2.5rem] shadow-xl">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Set Parameters</h2>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                        <input type="text" placeholder="Detecting location..." className="w-full bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Soil Type</label>
                                    <select className="w-full bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500">
                                        <option>Alluvial Soil</option>
                                        <option>Sandy Soil</option>
                                        <option>Black Soil</option>
                                        <option>Clayey Soil</option>
                                    </select>
                                </div>
                                <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">
                                    Analyze & Recommend
                                </button>
                            </form>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] bg-emerald-600 text-white">
                            <Cloudy className="w-10 h-10 mb-4 opacity-80" />
                            <h3 className="text-2xl font-black mb-2">Kathmandu Valley</h3>
                            <p className="opacity-80 font-medium">Currently: 18°C • Sunny</p>
                            <div className="mt-6 pt-6 border-t border-white/20 text-sm font-medium opacity-90">
                                Perfect time for planting leafy vegetables.
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass p-8 rounded-[2.5rem] min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-8">
                                <Sprout className="w-12 h-12 text-emerald-600 animate-float" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Run Analysis</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">Input your farming parameters on the left to get premium AI recommendations for your next harvest.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
