"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, HelpCircle } from "lucide-react";

export default function YieldPredictionPage() {
    return (
        <main className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Yield Prediction</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Forecast your harvest outcomes with data-driven precision.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-4 glass rounded-2xl text-gray-500"><HelpCircle className="w-6 h-6" /></button>
                        <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg">New Forecast</button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 glass rounded-[3rem] p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <BarChart3 className="w-12 h-12 text-emerald-600 opacity-20" />
                        </div>
                        <TrendingUp className="w-20 h-20 text-emerald-600 mb-8 animate-pulse" />
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">No Historical Data Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center">Start a new forecast by entering your crop types and land size to see predicted yields.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="glass p-8 rounded-[2.5rem]">
                            <h4 className="text-sm font-black text-emerald-600 uppercase mb-6 tracking-widest">Market Status</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Tomato</span>
                                    <span className="text-green-500 font-black">+12%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Potato</span>
                                    <span className="text-red-500 font-black">-3%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
