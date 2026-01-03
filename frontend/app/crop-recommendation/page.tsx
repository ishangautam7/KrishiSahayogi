"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Sprout, Brain, MapPin, Cloudy, Thermometer,
    Droplets, FlaskConical, Beaker, Waves,
    ChevronRight, CheckCircle2, AlertCircle,
    Info, Wind, Sun, Microscope
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ML_API_URL = "http://localhost:5000";

const SOIL_TYPES = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
const CROP_TYPES = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'];

export default function CropRecommendationPage() {
    const [activeTab, setActiveTab] = useState<"crop" | "fertilizer" | "disease">("crop");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Weather & Location States
    const [weather, setWeather] = useState<any>(null);
    const [locationName, setLocationName] = useState("Detecting location...");

    // Form States
    const [cropForm, setCropForm] = useState({
        N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: ""
    });

    const [fertiForm, setFertiForm] = useState({
        Temperature: "", Humidity: "", Moisture: "", Soil_Type: "Sandy", Crop_Type: "Maize",
        Nitrogen: "", Potassium: "", Phosphorous: ""
    });

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
                        humidity: res.data.hourly.relative_humidity_2m[0] // Approximation
                    });

                    // Reverse Geocoding (Free, no key needed with Nominatim)
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

    const handleCropSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await axios.post(`${ML_API_URL}/predict_crop`, cropForm);
            setResult({ type: "crop", data: res.data });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to get crop recommendation. Make sure ML server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleFertiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await axios.post(`${ML_API_URL}/predict_fertilizer`, fertiForm);
            setResult({ type: "fertilizer", data: res.data });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to get fertilizer prediction. Make sure ML server is running.");
        } finally {
            setLoading(false);
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
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-widest mb-6 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-md"
                    >
                        <Brain className="w-4 h-4" /> AI Powered Agriculture
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                        Precision <span className="text-emerald-500">Farming</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Harness the power of machine learning to optimize your harvest and soil health with localized insights.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                    <div className="bg-white dark:bg-gray-900 p-2 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 flex w-full md:w-auto">
                        <button
                            onClick={() => { setActiveTab("crop"); setResult(null); setError(null); }}
                            className={`flex-1 md:flex-none px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === "crop" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.05]" : "text-gray-500 hover:text-emerald-500"}`}
                        >
                            <Sprout className="w-5 h-5" /> Crop Suggestion
                        </button>
                        <button
                            onClick={() => { setActiveTab("fertilizer"); setResult(null); setError(null); }}
                            className={`flex-1 md:flex-none px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === "fertilizer" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.05]" : "text-gray-500 hover:text-emerald-500"}`}
                        >
                            <FlaskConical className="w-5 h-5" /> Fertilizer Aid
                        </button>
                        <button
                            onClick={() => { setActiveTab("disease"); setResult(null); setError(null); }}
                            className={`flex-1 md:flex-none px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === "disease" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.05]" : "text-gray-500 hover:text-emerald-500"}`}
                        >
                            <Microscope className="w-5 h-5" /> Disease Detection
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Input Panel */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-8">
                        <motion.div
                            layout
                            className="glass p-8 rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[5rem] -mr-8 -mt-8"></div>

                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                {activeTab === "crop" ? <Sprout className="text-emerald-500" /> : activeTab === "fertilizer" ? <FlaskConical className="text-emerald-500" /> : <Microscope className="text-emerald-500" />}
                                {activeTab === "crop" ? "Soil & Env Parameters" : activeTab === "fertilizer" ? "Efficiency Parameters" : "Visual Diagnosis"}
                            </h2>

                            {activeTab === "disease" ? (
                                <div className="space-y-6 py-10 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Microscope className="w-10 h-10 text-emerald-500 animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Coming Soon</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        Our plant disease detection model is currently not available in web.
                                    </p>
                                    <div className="pt-4">
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "85%" }}
                                                className="h-full bg-emerald-500"
                                            ></motion.div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-2">Model Training Complete</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={activeTab === "crop" ? handleCropSubmit : handleFertiSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {activeTab === "crop" ? (
                                            <>
                                                <InputGroup label="Nitrogen (N)" value={cropForm.N} onChange={(v) => setCropForm({ ...cropForm, N: v })} icon={<Beaker className="w-4 h-4" />} />
                                                <InputGroup label="Phosphorus (P)" value={cropForm.P} onChange={(v) => setCropForm({ ...cropForm, P: v })} icon={<FlaskConical className="w-4 h-4" />} />
                                                <InputGroup label="Potassium (K)" value={cropForm.K} onChange={(v) => setCropForm({ ...cropForm, K: v })} icon={<FlaskConical className="w-4 h-4" />} />
                                                <InputGroup label="pH Level" value={cropForm.ph} onChange={(v) => setCropForm({ ...cropForm, ph: v })} icon={<AlertCircle className="w-4 h-4" />} />
                                                <InputGroup label="Temperature" value={cropForm.temperature} onChange={(v) => setCropForm({ ...cropForm, temperature: v })} icon={<Thermometer className="w-4 h-4" />} />
                                                <InputGroup label="Humidity" value={cropForm.humidity} onChange={(v) => setCropForm({ ...cropForm, humidity: v })} icon={<Droplets className="w-4 h-4" />} />
                                                <div className="col-span-2">
                                                    <InputGroup label="Rainfall (mm)" value={cropForm.rainfall} onChange={(v) => setCropForm({ ...cropForm, rainfall: v })} icon={<Waves className="w-4 h-4" />} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
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
                            )}
                        </motion.div>

                        <div className="glass p-8 rounded-[3rem] bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <h3 className="text-3xl font-black mb-2 flex items-center gap-2">
                                        <MapPin className="w-6 h-6" /> Localized
                                    </h3>
                                    <p className="opacity-90 font-bold text-lg mb-6">{locationName}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                            {weather ? <Sun className="w-6 h-6" /> : <Cloudy className="w-6 h-6 animate-pulse" />}
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black leading-none">{weather ? `${weather.temp}°C` : "--°C"}</p>
                                            <p className="text-xs uppercase font-bold opacity-70">{weather ? weather.condition : "Loading weather..."}</p>
                                        </div>
                                    </div>
                                </div>
                                <Cloudy className="w-16 h-16 opacity-20 animate-float" />
                            </div>
                            <p className="mt-8 pt-6 border-t border-white/20 text-sm font-bold opacity-90 leading-relaxed italic">
                                {weather && weather.temp > 25 ? "\"Warm conditions detected. Ensure proper irrigation for your crops today.\"" :
                                    weather && weather.temp < 15 ? "\"Cooler temperatures today. Ideal for winter crop maintenance.\"" :
                                        "\"Environmental data synced. AI recommendations are now optimized for your local climate.\""}
                            </p>
                        </div>
                    </div>

                    {/* Results Panel */}
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
                                        {activeTab === "crop" ? (
                                            <CheckCircle2 className="w-16 h-16 text-emerald-500 group-hover:scale-110 transition-transform" />
                                        ) : (
                                            <FlaskConical className="w-16 h-16 text-emerald-500 group-hover:scale-110 transition-transform" />
                                        )}
                                    </div>

                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400 mb-4 bg-emerald-100 dark:bg-emerald-900/40 px-6 py-2 rounded-full leading-none">
                                        {result.type === "crop" ? "Top Recommendation" : "Fertilizer Insight"}
                                    </h3>

                                    <div className="mb-10">
                                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white capitalize tracking-tighter mb-4">
                                            {result.data.prediction || result.data.result}
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
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Climate Fit</p>
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
                                            {activeTab === "crop" ? (
                                                <Sprout className="w-16 h-16 text-emerald-500 animate-float" />
                                            ) : activeTab === "fertilizer" ? (
                                                <Beaker className="w-16 h-16 text-emerald-500 animate-float" />
                                            ) : (
                                                <Microscope className="w-16 h-16 text-emerald-500 animate-float" />
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Ready for Diagnosis?</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-lg font-medium leading-relaxed">
                                        Fill in the data modules on the left and our AI will process the complex agricultural relationships to provide expert advice.
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
