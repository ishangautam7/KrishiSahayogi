"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Upload, X, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

interface PredictionResult {
    disease: string;
    display_name: string;
    disease_index: number;
}

interface Solution {
    solution: string;
    disease: string;
}

export default function DiseaseDetectionPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [solution, setSolution] = useState<Solution | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingSolution, setLoadingSolution] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setPrediction(null);
            setSolution(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;

        setLoading(true);
        setError(null);
        setPrediction(null);
        setSolution(null);

        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await axios.post(
                "http://localhost:5000/predict_disease",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setPrediction(response.data);
                // Automatically fetch solution
                fetchSolution(response.data.disease);
            } else {
                setError(response.data.error || "Failed to analyze image");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to connect to server. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSolution = async (diseaseName: string) => {
        setLoadingSolution(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/get_disease_solution",
                {
                    disease_name: diseaseName,
                }
            );

            if (response.data.success) {
                setSolution(response.data);
            } else {
                console.error("Solution error:", response.data.error);
            }
        } catch (err: any) {
            console.error("Failed to fetch solution:", err);
        } finally {
            setLoadingSolution(false);
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setImageFile(null);
        setPrediction(null);
        setSolution(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-slate-50 dark:bg-gray-950">
            {/* Background Decorations */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse-soft"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                        Disease <span className="text-emerald-500">Detection</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Identify plant pathologies instantly using computer vision and receive expert treatment plans.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-12 rounded-[3.5rem] shadow-2xl border border-white/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>

                        {!selectedImage ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-[2.5rem] p-16 text-center cursor-pointer hover:border-emerald-500 transition-all hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10"
                            >
                                <Upload className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                                    Upload Plant Image
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    Click to select or drag and drop an image of a plant leaf
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative">
                                    <img
                                        src={selectedImage}
                                        alt="Selected plant"
                                        className="w-full h-96 object-cover rounded-3xl"
                                    />
                                    <button
                                        onClick={handleReset}
                                        className="absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wider shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Brain className="w-5 h-5" />
                                            Analyze Disease
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass p-6 rounded-3xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20"
                            >
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">Error</h3>
                                        <p className="text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Prediction Result */}
                    <AnimatePresence>
                        {prediction && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass p-10 rounded-[3rem] shadow-xl border border-white/20"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
                                            Detection Result
                                        </h3>
                                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                                            {prediction.display_name}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* AI Solution */}
                    <AnimatePresence>
                        {solution && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass p-10 rounded-[3rem] shadow-xl border border-purple-200/50 dark:border-purple-800/50"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                        AI-Powered Treatment Guide
                                    </h3>
                                </div>
                                <div className="prose prose-emerald dark:prose-invert max-w-none">
                                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                        {solution.solution}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
