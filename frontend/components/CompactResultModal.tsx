"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { getFertilizerData } from "@/lib/fertilizers";

interface CompactResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    recommendation: string;
    aiTips: string[];
    isLoadingTips?: boolean;
}

export default function CompactResultModal({
    isOpen,
    onClose,
    title,
    recommendation,
    aiTips,
    isLoadingTips = false
}: CompactResultModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto z-50"
                    >
                        <div className="glass p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                                <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl text-xl font-black shadow-lg mb-2">
                                    {recommendation}
                                </div>
                                {title.toLowerCase().includes("fertilizer") && (
                                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 uppercase tracking-widest">
                                        NPK: {getFertilizerData(recommendation).composition}
                                    </div>
                                )}
                            </div>

                            {/* AI Tips Section */}
                            <div className="mt-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">AI-Powered Tips</h4>
                                </div>

                                {isLoadingTips ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Generating personalized tips...</p>
                                    </div>
                                ) : aiTips && aiTips.length > 0 ? (
                                    <ul className="space-y-3">
                                        {aiTips.map((tip, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                                            >
                                                <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                                    {index + 1}
                                                </span>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                                        No tips available
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
