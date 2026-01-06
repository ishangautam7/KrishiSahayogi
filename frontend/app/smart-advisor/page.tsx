"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Sprout, Brain, MapPin, Cloudy, Thermometer,
    Droplets, FlaskConical, Beaker, Waves, TrendingUp,
    ChevronRight, CheckCircle2, AlertCircle,
    Info, Wind, Sun, Sparkles, Calendar, Loader2, Lightbulb, Settings2 , Gauge , Zap
 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { mapToPriceCommodity } from "@/lib/commodities";
import SoilQuestionnaire from "@/components/SoilQuestionnaire";

const BACKEND_URL = "http://localhost:7000/api/v1";

const SOIL_TYPES = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];

// Valid crop types for fertilizer prediction model
const VALID_FERTILIZER_CROPS = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'];

// Map crop prediction to valid fertilizer crop type
const mapToFertilizerCrop = (predictedCrop: string): string => {
    const cropLower = predictedCrop.toLowerCase();

    // Direct match check
    const directMatch = VALID_FERTILIZER_CROPS.find(c => c.toLowerCase() === cropLower);
    if (directMatch) return directMatch;

    // Category mapping for common crops
    const cropMappings: Record<string, string> = {
        // Fruits → Oil seeds or Pulses (general purpose)
        'apple': 'Pulses',
        'banana': 'Sugarcane',
        'mango': 'Pulses',
        'grapes': 'Pulses',
        'orange': 'Pulses',
        'pomegranate': 'Pulses',
        'watermelon': 'Sugarcane',
        'muskmelon': 'Sugarcane',
        'papaya': 'Pulses',
        'coconut': 'Sugarcane',

        // Grains & Cereals
        'rice': 'Paddy',
        'jute': 'Cotton',
        'coffee': 'Pulses',

        // Legumes & Pulses
        'lentil': 'Pulses',
        'blackgram': 'Pulses',
        'mungbean': 'Pulses',
        'mothbeans': 'Pulses',
        'pigeonpeas': 'Pulses',
        'kidneybeans': 'Pulses',
        'chickpea': 'Pulses',

        // Others
        'cotton': 'Cotton',
        'maize': 'Maize',
        'wheat': 'Wheat',
        'barley': 'Barley',
        'tobacco': 'Tobacco',
        'sugarcane': 'Sugarcane',
        'groundnut': 'Ground Nuts',
        'mustard': 'Oil seeds',
        'soybean': 'Oil seeds',
        'sunflower': 'Oil seeds',
    };

    // Check if we have a mapping
    if (cropMappings[cropLower]) {
        return cropMappings[cropLower];
    }

    // Default fallback - Pulses is a general purpose fertilizer category
    return 'Pulses';
};

// Normalize NPK values from crop prediction range to fertilizer prediction range
// Crop model: N (0-140), P (5-145), K (5-205) - typical ranges
// Fertilizer model: N (4-42), K (0-19), P (0-42)
const normalizeNPKForFertilizer = (n: number, p: number, k: number) => {
    // Helper function to scale value from one range to another
    const scaleValue = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => {
        // Clamp input to source range
        const clampedValue = Math.max(fromMin, Math.min(fromMax, value));
        // Scale to target range
        const scaled = ((clampedValue - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
        return Math.round(scaled * 10) / 10; // Round to 1 decimal place
    };

    return {
        // Nitrogen: scale from crop range (0-140) to fertilizer range (4-42)
        nitrogen: scaleValue(n, 0, 140, 4, 42),
        // Phosphorus: scale from crop range (5-145) to fertilizer range (0-42)
        phosphorus: scaleValue(p, 5, 145, 0, 42),
        // Potassium: scale from crop range (5-205) to fertilizer range (0-19)
        potassium: scaleValue(k, 5, 205, 0, 19)
    };
};



export default function SmartAdvisorPage() {
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState("");
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Weather & Location States
    const [weather, setWeather] = useState<any>(null);
    const [locationName, setLocationName] = useState("Detecting location...");

    // Form States - Combined for both crop and fertilizer
    const [form, setForm] = useState({
        N: "", P: "", K: "", ph: "",
        temperature: "", humidity: "", rainfall: "", moisture: "",
        Soil_Type: "Loamy"
    });

    // Location auto-fill states
    const [locationFetching, setLocationFetching] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    // AI Tips
    const [aiTips, setAiTips] = useState<{ crop: string[], fertilizer: string[] }>({ crop: [], fertilizer: [] });
    const [loadingTips, setLoadingTips] = useState(false);

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
                    setLocationName("Location detected");
                }
            }, () => setLocationName("Location access denied"));
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
            setError("Geolocation is not supported");
            return;
        }
        setLocationFetching(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios.get(`${BACKEND_URL}/location/data?lat=${latitude}&lon=${longitude}`);
                    if (response.data.success) {
                        const { weather, location } = response.data;
                        setForm(prev => ({
                            ...prev,
                            temperature: weather.temperature.toString(),
                            humidity: weather.humidity.toString(),
                            rainfall: weather.rainfall.toString(),
                            moisture: weather.soilMoisture?.toString() || "50"
                        }));
                        setLocationName(location.name);
                    }
                } catch (err) {
                    setError("Failed to fetch environmental data");
                } finally {
                    setLocationFetching(false);
                }
            },
            () => {
                setLocationFetching(false);
                setError("Location access denied");
            }
        );
    };

    const handleQuestionnaireComplete = (values: { N: number; P: number; K: number; pH: number }) => {
        setForm(prev => ({
            ...prev,
            N: values.N.toString(),
            P: values.P.toString(),
            K: values.K.toString(),
            ph: values.pH.toString()
        }));
        setShowQuestionnaire(false);
    };

    const getFutureDates = () => {
        const now = new Date();
        return {
            oneMonth: new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0],
            threeMonths: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
            sixMonths: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setAiTips({ crop: [], fertilizer: [] });

        try {
            // Step 1: Crop Recommendation
            setCurrentStep("Analyzing soil conditions...");
            const cropPayload = {
                n: Number(form.N), p: Number(form.P), k: Number(form.K),
                temp: Number(form.temperature), humidity: Number(form.humidity),
                ph: Number(form.ph), rainfall: Number(form.rainfall)
            };
            const cropRes = await axios.post(`${BACKEND_URL}/ml/predict-crop`, cropPayload);
            const recommendedCrop = cropRes.data.crop;

            // Step 2: Fertilizer Prediction
            setCurrentStep("Finding optimal fertilizer...");
            const fertilizerCropType = mapToFertilizerCrop(recommendedCrop);
            // Normalize NPK values to fertilizer model's expected range
            const normalizedNPK = normalizeNPKForFertilizer(Number(form.N), Number(form.P), Number(form.K));
            const fertiPayload = {
                temp: Number(form.temperature), humidity: Number(form.humidity),
                moisture: Number(form.moisture || 50), soil_type: form.Soil_Type,
                crop_type: fertilizerCropType,
                nitrogen: normalizedNPK.nitrogen,
                potassium: normalizedNPK.potassium,
                phosphorus: normalizedNPK.phosphorus
            };
            const fertiRes = await axios.post(`${BACKEND_URL}/ml/predict-fertilizer`, fertiPayload);
            const recommendedFertilizer = fertiRes.data.fertilizer;

            // Step 3: Price Predictions
            setCurrentStep("Forecasting market prices...");
            const dates = getFutureDates();
            const priceResults: any = {};

            try {
                const priceCommodity = mapToPriceCommodity(recommendedCrop);
                const [price1, price3, price6] = await Promise.all([
                    axios.post(`${BACKEND_URL}/ml/predict-price`, { commodity: priceCommodity, date: dates.oneMonth }),
                    axios.post(`${BACKEND_URL}/ml/predict-price`, { commodity: priceCommodity, date: dates.threeMonths }),
                    axios.post(`${BACKEND_URL}/ml/predict-price`, { commodity: priceCommodity, date: dates.sixMonths })
                ]);

                // Validate prices - if prices are extremely low (<= 2), treat as unavailable
                console.log("Raw Price1:", price1.data);
                const p1 = Number(price1.data.predicted_price);
                const p3 = Number(price3.data.predicted_price);
                const p6 = Number(price6.data.predicted_price);
                console.log("Parsed p1:", p1);

                if (isNaN(p1) || p1 <= 1) {
                    priceResults.unavailable = true;
                } else {
                    priceResults.oneMonth = p1;
                    priceResults.threeMonths = (isNaN(p3) || p3 <= 1) ? p1 : p3;
                    priceResults.sixMonths = (isNaN(p6) || p6 <= 1) ? p1 : p6;
                }
            } catch {
                priceResults.unavailable = true;
            }

            setResult({
                crop: recommendedCrop,
                fertilizer: recommendedFertilizer,
                prices: priceResults
            });

            // Step 4: Fetch AI Tips
            setCurrentStep("Generating AI insights...");
            fetchAITips(recommendedCrop, recommendedFertilizer, cropPayload);

        } catch (err: any) {
            setError(err.response?.data?.message || "Analysis failed. Make sure ML server is running.");
        } finally {
            setLoading(false);
            setCurrentStep("");
        }
    };

    const fetchAITips = async (crop: string, fertilizer: string, soilData: any) => {
        setLoadingTips(true);
        try {
            const [cropTips, fertiTips] = await Promise.all([
                axios.post(`${BACKEND_URL}/ai/crop-tips`, {
                    crop,
                    soilData: { N: soilData.n, P: soilData.p, K: soilData.k, pH: soilData.ph },
                    climate: { temperature: soilData.temp, humidity: soilData.humidity, rainfall: soilData.rainfall }
                }),
                axios.post(`${BACKEND_URL}/ai/fertilizer-tips`, {
                    fertilizer,
                    crop,
                    soilData: { N: soilData.n, P: soilData.p, K: soilData.k }
                })
            ]);
            setAiTips({
                crop: cropTips.data.tips || [],
                fertilizer: fertiTips.data.tips || []
            });
        } catch (err) {
            console.error('Failed to fetch AI tips:', err);
        } finally {
            setLoadingTips(false);
        }
    };

    return (
        <main className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950">
            {/* Animated Background */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/30 to-green-300/20 dark:from-emerald-900/20 dark:to-green-900/10 rounded-full blur-[150px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-cyan-300/20 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-100/20 to-transparent dark:from-yellow-900/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-bold mb-6"
                    >
                        
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        Smart <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">Farming</span> Advisor
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                        One analysis. Complete insights. Crop, fertilizer, pricing & AI tips — all tailored to your farm.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Input Form Section */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-gray-800/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>

                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                                    <Gauge className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Farm Parameters
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Soil Type Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Soil Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {SOIL_TYPES.map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, Soil_Type: type }))}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${form.Soil_Type === type
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* NPK & pH Inputs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label="Nitrogen (N)" value={form.N} onChange={(v) => setForm({ ...form, N: v })} icon={<Beaker className="w-4 h-4" />} />
                                    <InputGroup label="Phosphorus (P)" value={form.P} onChange={(v) => setForm({ ...form, P: v })} icon={<FlaskConical className="w-4 h-4" />} />
                                    <InputGroup label="Potassium (K)" value={form.K} onChange={(v) => setForm({ ...form, K: v })} icon={<FlaskConical className="w-4 h-4" />} />
                                    <InputGroup label="pH Level" value={form.ph} onChange={(v) => setForm({ ...form, ph: v })} icon={<AlertCircle className="w-4 h-4" />} />
                                </div>

                                {/* Environmental Inputs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label="Temperature °C" value={form.temperature} onChange={(v) => setForm({ ...form, temperature: v })} icon={<Thermometer className="w-4 h-4" />} />
                                    <InputGroup label="Humidity %" value={form.humidity} onChange={(v) => setForm({ ...form, humidity: v })} icon={<Droplets className="w-4 h-4" />} />
                                    <InputGroup label="Rainfall mm" value={form.rainfall} onChange={(v) => setForm({ ...form, rainfall: v })} icon={<Waves className="w-4 h-4" />} />
                                    <InputGroup label="Moisture %" value={form.moisture} onChange={(v) => setForm({ ...form, moisture: v })} icon={<Droplets className="w-4 h-4" />} />
                                </div>

                                {/* Auto-Fill Buttons */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Quick Fill</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleUseLocation}
                                            disabled={locationFetching}
                                            className="py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all disabled:opacity-50 text-xs shadow-lg shadow-blue-500/25"
                                        >
                                            {locationFetching ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Detecting...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Weather Data</span>
                                                </div>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowQuestionnaire(true)}
                                            className="py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 active:scale-95 transition-all text-xs shadow-lg shadow-emerald-500/25"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Sprout className="w-4 h-4" />
                                                <span>Soil Quiz</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>{currentStep}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Get Complete Analysis
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Location Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-emerald-600 to-green-700 p-6 rounded-[2rem] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden"
                        >
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    {weather ? <Sun className="w-6 h-6" /> : <Cloudy className="w-6 h-6 animate-pulse" />}
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{weather ? `${weather.temp}°C` : "--°C"}</p>
                                    <p className="text-sm font-bold opacity-80">{locationName}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    {/* Main Results Grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Crop Result */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                                                    <Sprout className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Best Crop</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-gray-900 dark:text-white capitalize mb-2">{result.crop}</h3>
                                            <p className="text-sm text-gray-500">Optimal for your soil and climate conditions</p>
                                        </motion.div>

                                        {/* Fertilizer Result */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-blue-100 dark:border-blue-900/50 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                                    <FlaskConical className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Best Fertilizer</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-gray-900 dark:text-white capitalize mb-2">{result.fertilizer}</h3>
                                            <p className="text-sm text-gray-500">Optimized for {result.crop} cultivation</p>
                                        </motion.div>
                                    </div>

                                    {/* Price Predictions */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-amber-100 dark:border-amber-900/50"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                                                <TrendingUp className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Price Forecast for {result.crop}</span>
                                        </div>

                                        {result.prices.unavailable ? (
                                            <p className="text-gray-500 text-center py-4">Price data not available for this crop</p>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-4">
                                                <PriceCard label="1 Month" price={result.prices.oneMonth} trend="up" />
                                                <PriceCard label="3 Months" price={result.prices.threeMonths} trend="up" />
                                                <PriceCard label="6 Months" price={result.prices.sixMonths} trend="up" />
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* AI Tips Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-8 rounded-[2rem] shadow-xl border border-purple-100 dark:border-purple-900/50"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                                <Lightbulb className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">AI-Powered Tips</span>
                                            {loadingTips && <Loader2 className="w-4 h-4 animate-spin text-purple-500" />}
                                        </div>

                                        {(aiTips.crop.length > 0 || aiTips.fertilizer.length > 0) ? (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {aiTips.crop.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                                            <Sprout className="w-4 h-4 text-emerald-500" />
                                                            Growing Tips
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {aiTips.crop.slice(0, 4).map((tip, i) => (
                                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                    {tip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {aiTips.fertilizer.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                                            <FlaskConical className="w-4 h-4 text-blue-500" />
                                                            Fertilizer Tips
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {aiTips.fertilizer.slice(0, 4).map((tip, i) => (
                                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                                    {tip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : !loadingTips && (
                                            <p className="text-gray-500 text-center py-4">AI tips will appear here after analysis</p>
                                        )}
                                    </motion.div>

                                    {/* Try Again Button */}
                                    <div className="text-center">
                                        <button
                                            onClick={() => setResult(null)}
                                            className="text-gray-400 hover:text-emerald-500 font-bold text-sm uppercase tracking-widest transition-colors"
                                        >
                                            ← Run New Analysis
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-12 rounded-[3rem] min-h-[600px] flex flex-col items-center justify-center text-center border border-white/50 dark:border-gray-800/50"
                                >
                                    <div className="relative mb-10">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-green-400/30 to-blue-500/30 blur-3xl rounded-full scale-150 animate-pulse"></div>
                                        <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl flex items-center justify-center relative z-10">
                                            <Zap className="w-16 h-16 text-emerald-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Complete Farm Analysis</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg font-medium leading-relaxed mb-6">
                                        Fill in your farm parameters and get comprehensive AI-powered recommendations for crops, fertilizers, and market pricing.
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                                        {['Crop Suggestion', 'Fertilizer Match', 'Price Forecast', 'AI Tips'].map((item, i) => (
                                            <span key={i} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-bold text-gray-600 dark:text-gray-400">
                                                {item}
                                            </span>
                                        ))}
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-bold"
                                        >
                                            <AlertCircle className="w-5 h-5" />
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
        </main>
    );
}

function InputGroup({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: any }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                {icon} {label}
            </label>
            <input
                type="number"
                step="any"
                placeholder="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none"
            />
        </div>
    );
}

function PriceCard({ label, price, trend }: { label: string, price: number, trend: 'up' | 'down' }) {
    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-4 rounded-2xl text-center border border-amber-100 dark:border-amber-800/50">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
                Rs. {typeof price === 'number' ? price.toFixed(2) : price}
            </p>
            <p className="text-xs text-gray-500">per kg</p>
        </div>
    );
}
