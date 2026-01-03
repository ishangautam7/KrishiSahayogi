"use client";

import { motion } from "framer-motion";
import { Microscope, Camera, Upload, ShieldCheck } from "lucide-react";

export default function DiseaseDetectionPage() {
    return (
        <main className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-black mb-6 uppercase tracking-widest">
                        <Microscope className="w-4 h-4" /> Instant Diagnostics
                    </div>
                    <h1 className="text-4xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6">Disease Detection</h1>
                    <p className="text-xl text-gray-700 dark:text-gray-400">Snap or upload a photo of your crop to identify pests, fungus, or nutrient deficiencies instantly.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="glass p-12 rounded-[3.5rem] flex flex-col items-center gap-6 group hover:border-red-200 dark:hover:border-red-900/50 transition-all"
                    >
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera className="w-10 h-10 text-red-600" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">Take Photo</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="glass p-12 rounded-[3.5rem] flex flex-col items-center gap-6 group hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all font-bold"
                    >
                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-emerald-600" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">Upload Gallery</span>
                    </motion.button>
                </div>

                <div className="glass p-12 rounded-[3rem] border-dashed border-2 border-gray-200 dark:border-gray-800">
                    <ShieldCheck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium italic">Our AI model can detect over 50+ common crop diseases in Nepal with 95% accuracy.</p>
                </div>
            </div>
        </main>
    );
}
