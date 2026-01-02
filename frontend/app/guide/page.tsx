"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, Bookmark, ChevronRight } from "lucide-react";

export default function PlantationGuidePage() {
    const categories = [
        { title: "Cereal Crops", icon: "🌾", count: 12 },
        { title: "Vegetables", icon: "🍅", count: 45 },
        { title: "Fruit Trees", icon: "🍎", count: 28 },
        { title: "Organic Practices", icon: "🍃", count: 15 },
    ];

    return (
        <main className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <BookOpen className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6">Plantation Guide</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Your comprehensive library for scientific farming techniques and seasonal crop care.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {categories.map((cat, idx) => (
                        <motion.div
                            whileHover={{ y: -10 }}
                            key={idx}
                            className="glass p-8 rounded-[2.5rem] text-center group cursor-pointer"
                        >
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                            <p className="text-sm text-emerald-600 font-bold">{cat.count} Guides Available</p>
                        </motion.div>
                    ))}
                </div>

                <div className="glass rounded-[3rem] p-12 overflow-hidden relative">
                    <div className="relative z-10 lg:w-1/2">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Recommended for Your Area</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Based on your location in Kirtipur, here the best crops to plant this week.</p>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl hover:bg-emerald-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">#0{i}</div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">Winter Wheat Techniques</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 h-full w-1/2 hidden lg:block opacity-20">
                        <Map className="w-full h-full text-emerald-600" />
                    </div>
                </div>
            </div>
        </main>
    );
}
