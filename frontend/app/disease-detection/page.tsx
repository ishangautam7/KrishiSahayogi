"use client";

import { motion } from "framer-motion";
import { Brain, Microscope } from "lucide-react";

export default function DiseaseDetectionPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-slate-50 dark:bg-gray-950">
            {/* Background Decorations */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse-soft"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-widest mb-6 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-md"
                    >
                        <Brain className="w-4 h-4" /> AI Powered Agriculture
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                        Disease <span className="text-emerald-500">Detection</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Identify plant pathologies instantly using computer vision and receive expert treatment plans.
                    </p>
                </div>

                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-12 rounded-[3.5rem] shadow-2xl border border-white/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>

                        <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto shadow-inner group">
                            <Microscope className="w-16 h-16 text-emerald-500 animate-pulse" />
                        </div>

                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400 mb-6 bg-emerald-100 dark:bg-emerald-900/40 px-6 py-2 rounded-full inline-block leading-none">
                            Next-Gen Vision AI
                        </h3>

                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
                            Currently In Training
                        </h2>

                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-10 leading-relaxed text-center">
                            Our plant disease detection model is being optimized for localized crop varieties. This feature will be available in the web portal soon.
                        </p>

                        <div className="space-y-4">
                            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                                ></motion.div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-emerald-600">Model Training</span>
                                <span className="text-gray-400">85% Complete</span>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Available soon for</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Wheat', 'Rice', 'Tomato', 'Potato', 'Maize'].map(crop => (
                                    <span key={crop} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[10px] font-black text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 italic">
                                        #{crop}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
