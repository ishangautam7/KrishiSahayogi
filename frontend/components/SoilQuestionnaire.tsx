"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, X } from "lucide-react";
import axios from "axios";

// Question database with simple farmer-friendly language
const QUESTIONS = {
    nitrogen: [
        {
            q: "What color is your soil?",
            options: [
                { label: "Dark black", value: 3 },
                { label: "Medium brown", value: 2 },
                { label: "Light grey", value: 1 }
            ]
        },
        {
            q: "What did you grow here last season?",
            options: [
                { label: "Beans/Peas (Legumes)", value: 3 },
                { label: "Other crops", value: 2 },
                { label: "First time farming here", value: 1 }
            ]
        },
        {
            q: "What color are your plant leaves?",
            options: [
                { label: "Deep green", value: 3 },
                { label: "Yellowish-green", value: 2 },
                { label: "Pale yellow", value: 1 }
            ]
        },
        {
            q: "Are the lower/older leaves turning yellow?",
            options: [
                { label: "No yellowing", value: 3 },
                { label: "Slight yellowing", value: 2 },
                { label: "Severe yellowing", value: 1 }
            ]
        },
        {
            q: "How is your plant growth?",
            options: [
                { label: "Strong and vigorous", value: 3 },
                { label: "Moderate growth", value: 2 },
                { label: "Weak/stunted", value: 1 }
            ]
        },
        {
            q: "When did you last add compost or manure?",
            options: [
                { label: "Recently (within 3 months)", value: 3 },
                { label: "About 6 months ago", value: 2 },
                { label: "Never or very long ago", value: 1 }
            ]
        }
    ],
    phosphorus: [
        {
            q: "What color is the underside of leaves?",
            options: [
                { label: "Normal green", value: 3 },
                { label: "Slightly purple", value: 2 },
                { label: "Dark purple/red", value: 1 }
            ]
        },
        {
            q: "What color are the stems?",
            options: [
                { label: "Normal green", value: 3 },
                { label: "Reddish tint", value: 2 },
                { label: "Deep red/purple", value: 1 }
            ]
        },
        {
            q: "How are the plant roots?",
            options: [
                { label: "Strong and deep", value: 3 },
                { label: "Moderate", value: 2 },
                { label: "Weak/shallow", value: 1 }
            ]
        },
        {
            q: "How is flowering/fruiting?",
            options: [
                { label: "Normal timing", value: 3 },
                { label: "Slightly delayed", value: 2 },
                { label: "Very delayed or poor", value: 1 }
            ]
        },
        {
            q: "How do the tips of older leaves look?",
            options: [
                { label: "Normal and healthy", value: 3 },
                { label: "Brownish", value: 2 },
                { label: "Dead/dried tips", value: 1 }
            ]
        },
        {
            q: "How does water drain in your field?",
            options: [
                { label: "Good drainage", value: 3 },
                { label: "Moderate", value: 2 },
                { label: "Waterlogged/poor drainage", value: 1 }
            ]
        }
    ],
    potassium: [
        {
            q: "How do the leaf edges look?",
            options: [
                { label: "Normal green", value: 3 },
                { label: "Yellowish edges", value: 2 },
                { label: "Brown/scorched edges", value: 1 }
            ]
        },
        {
            q: "How do the older leaves look?",
            options: [
                { label: "Healthy", value: 3 },
                { label: "Yellow spots", value: 2 },
                { label: "Brown patches/dying", value: 1 }
            ]
        },
        {
            q: "How is the fruit/grain quality?",
            options: [
                { label: "Firm and good size", value: 3 },
                { label: "Moderate quality", value: 2 },
                { label: "Small or poor quality", value: 1 }
            ]
        },
        {
            q: "How strong are the plant stems?",
            options: [
                { label: "Strong and sturdy", value: 3 },
                { label: "Moderate strength", value: 2 },
                { label: "Weak/falling over", value: 1 }
            ]
        },
        {
            q: "How often do plants get diseased?",
            options: [
                { label: "Rarely sick", value: 3 },
                { label: "Sometimes", value: 2 },
                { label: "Often diseased", value: 1 }
            ]
        },
        {
            q: "When you squeeze wet soil, does it:",
            options: [
                { label: "Stick together (clayey)", value: 3 },
                { label: "Somewhat hold shape (loamy)", value: 2 },
                { label: "Crumble easily (sandy)", value: 1 }
            ]
        }
    ],
    ph: [
        {
            q: "What color is the soil when wet?",
            options: [
                { label: "Light/reddish brown", value: 3 },
                { label: "Medium brown", value: 2 },
                { label: "Very dark black", value: 1 }
            ]
        },
        {
            q: "What grows wild in your field?",
            options: [
                { label: "Grasses/clovers", value: 3 },
                { label: "Mixed plants", value: 2 },
                { label: "Mosses/ferns", value: 1 }
            ]
        },
        {
            q: "How fast does water drain?",
            options: [
                { label: "Fast drainage", value: 3 },
                { label: "Moderate", value: 2 },
                { label: "Very slow/pools", value: 1 }
            ]
        },
        {
            q: "Do you see white crust on dry soil?",
            options: [
                { label: "Yes, white residue", value: 3 },
                { label: "Sometimes", value: 2 },
                { label: "Never", value: 1 }
            ]
        },
        {
            q: "When did you last add lime?",
            options: [
                { label: "Recently (within 1 year)", value: 3 },
                { label: "2-3 years ago", value: 2 },
                { label: "Never", value: 1 }
            ]
        },
        {
            q: "Are plant leaves stunted with brown tips?",
            options: [
                { label: "No, healthy", value: 3 },
                { label: "Slightly", value: 2 },
                { label: "Yes, very stunted", value: 1 }
            ]
        }
    ]
};

const SECTION_NAMES = {
    nitrogen: { title: "Nitrogen (N)", icon: "🌱" },
    phosphorus: { title: "Phosphorus (P)", icon: "🌿" },
    potassium: { title: "Potassium (K)", icon: "🍃" },
    ph: { title: "Soil pH", icon: "🧪" }
};

interface QuestionnaireProps {
    onComplete: (values: { N: number; P: number; K: number; pH: number }) => void;
    onClose: () => void;
}

export default function SoilQuestionnaire({ onComplete, onClose }: QuestionnaireProps) {
    const sections = Object.keys(QUESTIONS) as Array<keyof typeof QUESTIONS>;
    const [currentSection, setCurrentSection] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number[]>>({
        nitrogen: [],
        phosphorus: [],
        potassium: [],
        ph: []
    });
    const [loading, setLoading] = useState(false);

    const section = sections[currentSection];
    const questions = QUESTIONS[section];
    const question = questions[currentQuestion];
    const totalQuestions = 24;
    const answeredCount = Object.values(answers).flat().length;
    const progress = (answeredCount / totalQuestions) * 100;

    const handleAnswer = (value: number) => {
        const newAnswers = { ...answers };
        newAnswers[section][currentQuestion] = value;
        setAnswers(newAnswers);

        // Auto-advance
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else if (currentSection < sections.length - 1) {
                setCurrentSection(currentSection + 1);
                setCurrentQuestion(0);
            } else {
                // All questions answered
                handleSubmit(newAnswers);
            }
        }, 300);
    };

    const handleSubmit = async (finalAnswers: Record<string, number[]>) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:7000/api/v1/soil-assessment/calculate', finalAnswers);

            if (response.data.success) {
                const { nitrogen, phosphorus, potassium, ph } = response.data.soil;
                onComplete({ N: nitrogen, P: phosphorus, K: potassium, pH: ph });
            }
        } catch (error) {
            console.error('Failed to calculate soil values:', error);
            alert('Failed to calculate values. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        } else if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
            setCurrentQuestion(QUESTIONS[sections[currentSection - 1]].length - 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black mb-2">Smart Soil Assessment</h2>
                    <p className="text-sm opacity-90">Answer simple questions about your soil</p>

                    {/* Progress bar */}
                    <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-white h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs mt-2 opacity-75">{answeredCount} of {totalQuestions} questions</p>
                </div>

                {/* Question */}
                {!loading ? (
                    <div className="p-8">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl">{SECTION_NAMES[section].icon}</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {SECTION_NAMES[section].title}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {question.q}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="wait">
                                {question.options.map((option, idx) => (
                                    <motion.button
                                        key={`${section}-${currentQuestion}-${idx}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleAnswer(option.value)}
                                        className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all font-medium text-gray-800 dark:text-gray-200"
                                    >
                                        {option.label}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={goBack}
                                disabled={currentSection === 0 && currentQuestion === 0}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                            <span className="text-sm text-gray-500">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                            Analyzing your answers...
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
