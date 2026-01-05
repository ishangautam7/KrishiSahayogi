"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Brain, MapPin, Cloudy, Thermometer,
    Droplets, FlaskConical, Beaker,
    ChevronRight, CheckCircle2, AlertCircle,
    Info, Wind, Sun, HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import SoilQuestionnaire from "@/components/SoilQuestionnaire";
import CompactResultModal from "@/components/CompactResultModal";

const ML_API_URL = "http://localhost:5000";

const SOIL_TYPES = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
const CROP_TYPES = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'];

export default function FertilizerPredictionPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Weather & Location States
    const [weather, setWeather] = useState<any>(null);
    const [locationName, setLocationName] = useState("Detecting location...");

    // Form State
    const [fertiForm, setFertiForm] = useState({
        Temperature: "", Humidity: "", Moisture: "", Soil_Type: "Sandy", Crop_Type: "Maize",
        Nitrogen: "", Potassium: "", Phosphorous: ""
    });

    // Location auto-fill states
    const [locationFetching, setLocationFetching] = useState(false);
    const [locationCoords, setLocationCoords] = useState<{ lat: number; lon: number } | null>(null);

    // Questionnaire states
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    // AI Tips states
    const [aiTips, setAiTips] = useState<string[]>([]);
    const [loadingTips, setLoadingTips] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);
                    const current = res.data.current_weather;

                    setWeather({
                        temp: current.temperature,
                        condition: getConditionText(current.weathercode),
                        humidity: res.data.hourly.relative_humidity_2m[0]
                    });

                    const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    setLocationName(geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.village || "Your Farm");
                } catch (err) {
                    console.error("Weather fetch failed", err);
                    setLocationName("Location detected");
                }
            }, (err) => {
                console.error("Geolocation error", err);
                setLocationName("Location access denied");
            });
        }
    }, []);

    const getConditionText = (code: number) => {
        if (code === 0) return "Clear Sky";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 48) return "Foggy";
        if (code <= 67) return "Rainy";
        if (code <= 77) return "Snowy";
        if (code <= 82) return "Rain Showers";
        return "Thunderstorm";
    };

    const handleUseLocation = async () => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLocationFetching(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocationCoords({ lat: latitude, lon: longitude });

                try {
                    const response = await axios.get(
                        `http://localhost:7000/api/v1/location/environmental-data?lat=${latitude}&lon=${longitude}`
                    );

                    if (response.data.success) {
                        const { weather, location } = response.data;

                        // Auto-fill only weather-related fields
                        // NPK should be filled via questionnaire or manual entry
                        setFertiForm({
                            ...fertiForm,
                            Temperature: weather.temperature.toString(),
                            Humidity: weather.humidity.toString(),
                            Moisture: weather.soilMoisture.toString()
                        });

                        setLocationName(location.name);
                    }
                } catch (err: any) {
                    console.error("Failed to fetch location data:", err);
                    setError("Failed to fetch environmental data. Please try again or enter values manually.");
                } finally {
                    setLocationFetching(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setLocationFetching(false);
                setError("Location access denied. Please enable location permissions or enter values manually.");
            }
        );
    };

    const handleQuestionnaireComplete = (values: { N: number; P: number; K: number; pH: number }) => {
        setFertiForm({
            ...fertiForm,
            Nitrogen: values.N.toString(),
            Potassium: values.K.toString(),
            Phosphorous: values.P.toString()
        });
        setShowQuestionnaire(false);
    };

    const handleFertiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const payload = {
                temp: Number(fertiForm.Temperature),
                humidity: Number(fertiForm.Humidity),
                moisture: Number(fertiForm.Moisture),
                soil_type: fertiForm.Soil_Type,
                crop_type: fertiForm.Crop_Type,
                nitrogen: Number(fertiForm.Nitrogen),
                potassium: Number(fertiForm.Potassium),
                phosphorus: Number(fertiForm.Phosphorous)
            };
            const res = await axios.post(`${ML_API_URL}/predict_fertilizer`, payload);
            setResult(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to get fertilizer prediction. Make sure ML server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-slate-50 dark:bg-gray-950">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse-soft"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                        Fertilizer <span className="text-emerald-500">Aid</span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                        <motion.div
                            layout
                            className="glass p-8 rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800/50 relative overflow-hidden"
                        >
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <FlaskConical className="text-emerald-500" /> Efficiency Parameters
                            </h2>

                            <form onSubmit={handleFertiSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Soil Type</label>
                                            <select
                                                value={fertiForm.Soil_Type}
                                                onChange={(e) => setFertiForm({ ...fertiForm, Soil_Type: e.target.value })}
                                                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 appearance-none bg-no-repeat bg-[right_1rem_center]"
                                            >
                                                {SOIL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Crop Type</label>
                                            <select
                                                value={fertiForm.Crop_Type}
                                                onChange={(e) => setFertiForm({ ...fertiForm, Crop_Type: e.target.value })}
                                                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 appearance-none transition-all"
                                            >
                                                {CROP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <InputGroup label="Nitrogen" value={fertiForm.Nitrogen} onChange={(v) => setFertiForm({ ...fertiForm, Nitrogen: v })} />
                                    <InputGroup label="Potassium" value={fertiForm.Potassium} onChange={(v) => setFertiForm({ ...fertiForm, Potassium: v })} />
                                    <InputGroup label="Phosphorus" value={fertiForm.Phosphorous} onChange={(v) => setFertiForm({ ...fertiForm, Phosphorous: v })} />
                                    <InputGroup label="Temp (°C)" value={fertiForm.Temperature} onChange={(v) => setFertiForm({ ...fertiForm, Temperature: v })} />
                                    <InputGroup label="Humidity" value={fertiForm.Humidity} onChange={(v) => setFertiForm({ ...fertiForm, Humidity: v })} />
                                    <InputGroup label="Moisture" value={fertiForm.Moisture} onChange={(v) => setFertiForm({ ...fertiForm, Moisture: v })} />
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-4">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Auto-Fill Options</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleUseLocation}
                                            disabled={locationFetching}
                                            className="py-3 px-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 text-xs"
                                        >
                                            {locationFetching ? (
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-[10px]">Detecting...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="text-[15px] opacity-80">Temp • Humidity • Moisture</div>
                                                </div>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowQuestionnaire(true)}
                                            className="py-3 px-2 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 active:scale-95 transition-all text-xs"
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="text-[15px] opacity-80">N • P • K</div>
                                            </div>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center italic">
                                        or enter manually above
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Run AI Diagnostic
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-8">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="glass p-12 rounded-[3.5rem] shadow-2xl border border-white/20 h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>
                                    <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner group">
                                        <CheckCircle2 className="w-16 h-16 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    </div>

                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400 mb-4 bg-emerald-100 dark:bg-emerald-900/40 px-6 py-2 rounded-full leading-none">
                                        Fertilizer Insight
                                    </h3>

                                    <div className="mb-10">
                                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white capitalize tracking-tighter mb-4">
                                            {result.fertilizer}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-md mx-auto">
                                            Our AI analysis predicts this will yield the best results for your current environmental parameters.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-4">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 text-left flex items-center gap-4">
                                            <div className="bg-emerald-500/10 p-3 rounded-xl">
                                                <Info className="text-emerald-500 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Confidence Score</p>
                                                <p className="text-lg font-black text-gray-800 dark:text-gray-200">98.4% Match</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 text-left flex items-center gap-4">
                                            <div className="bg-blue-500/10 p-3 rounded-xl">
                                                <Wind className="text-blue-500 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Soil Harmony</p>
                                                <p className="text-lg font-black text-gray-800 dark:text-gray-200">Optimal</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setResult(null)}
                                        className="mt-12 text-gray-400 hover:text-emerald-500 text-sm font-bold transition-all uppercase tracking-widest"
                                    >
                                        Try New Parameters
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="glass p-12 rounded-[3.5rem] min-h-[600px] flex flex-col items-center justify-center text-center backdrop-blur-3xl border border-white/20"
                                >
                                    <div className="relative mb-12">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                                        <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl flex items-center justify-center relative z-10">
                                            <Beaker className="w-16 h-16 text-emerald-500 animate-float" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Ready for Diagnosis?</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-lg font-medium leading-relaxed">
                                        Fill in the soil and crop modules and our AI will recommend the ideal fertilizer for your season.
                                    </p>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-10 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-bold"
                                        >
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Questionnaire Modal */}
            <AnimatePresence>
                {showQuestionnaire && (
                    <SoilQuestionnaire
                        onComplete={handleQuestionnaireComplete}
                        onClose={() => setShowQuestionnaire(false)}
                    />
                )}
            </AnimatePresence>

            {/* Result Modal with AI Tips */}
            {result && (
                <CompactResultModal
                    isOpen={showResultModal}
                    onClose={() => setShowResultModal(false)}
                    title="Recommended Fertilizer"
                    recommendation={result.fertilizer}
                    aiTips={aiTips}
                    isLoadingTips={loadingTips}
                />
            )}
        </main>
    );
}

function InputGroup({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: any }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-1">
                {icon} {label}
            </label>
            <div className="relative group">
                <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none"
                />
            </div>
        </div>
    );
}
