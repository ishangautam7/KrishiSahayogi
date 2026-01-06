'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertCircle, Loader2, IndianRupee } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Common commodities from the Kalimati dataset
const COMMODITIES = ['Tomato Big(Nepali)', 'Tomato Small(Local)', 'Potato Red',
    'Potato White', 'Onion Dry (Indian)', 'Carrot(Local)',
    'Cabbage(Local)', 'Cauli Local', 'Raddish Red',
    'Raddish White(Local)', 'Brinjal Long', 'Brinjal Round',
    'Cow pea(Long)', 'Green Peas', 'French Bean(Local)',
    'Soyabean Green', 'Bitter Gourd', 'Bottle Gourd',
    'Pointed Gourd(Local)', 'Snake Gourd', 'Smooth Gourd',
    'Sponge Gourd', 'Pumpkin', 'Squash(Long)', 'Turnip', 'Okara',
    'Christophine', 'Brd Leaf Mustard', 'Spinach Leaf', 'Cress Leaf',
    'Mustard Leaf', 'Fenugreek Leaf', 'Onion Green', 'Mushroom(Kanya)',
    'Asparagus', 'Neuro', 'Brocauli', 'Sugarbeet', 'Drumstick',
    'Red Cabbbage', 'Lettuce', 'Celery', 'Parseley', 'Fennel Leaf',
    'Mint', 'Turnip A', 'Tamarind', 'Bamboo Shoot', 'Tofu', 'Gundruk',
    'Apple(Jholey)', 'Banana', 'Lime', 'Pomegranate', 'Mango(Maldah)',
    'Grapes(Green)', 'Water Melon(Green)', 'Sweet Orange', 'Pineapple',
    'Cucumber(Local)', 'Jack Fruit', 'Papaya(Nepali)', 'Sugarcane',
    'Ginger', 'Chilli Dry', 'Chilli Green', 'Capsicum', 'Garlic Green',
    'Coriander Green', 'Garlic Dry Chinese', 'Garlic Dry Nepali',
    'Clive Dry', 'Clive Green', 'Fish Fresh', 'Arum', 'Maize',
    'Sweet Lime', 'Guava', 'Mombin', 'Barela', 'Lemon', 'Sword Bean',
    'Orange(Nepali)', 'Bakula', 'Yam', 'Sweet Potato', 'Mandarin',
    'Knolkhol', 'Cauli Terai', 'Kinnow', 'Strawberry',
    'Bauhania flower', 'Pear(Local)', 'Litchi(Local)', 'Musk Melon',
    'Tomato Small(Tunnel)', 'Potato Red(Indian)', 'Mushroom(Button)',
    'Apple(Fuji)', 'Cucumber(Hybrid)', 'Chilli Green(Bullet)',
    'Chilli Green(Machhe)', 'Chilli Green(Akbare)', 'Fish Fresh(Rahu)',
    'Fish Fresh(Bachuwa)', 'Fish Fresh(Chhadi)', 'Fish Fresh(Mungari)',
    'Raddish White(Hybrid)', 'Cowpea(Short)', 'French Bean(Hybrid)',
    'French Bean(Rajma)', 'Squash(Round)', 'Mango(Dushari)',
    'Water Melon(Dotted)', 'Papaya(Indian)', 'Litchi(Indian)',
    'Cabbage', 'Potato Red(Mude)', 'Tomato Big(Indian)',
    'Pear(Chinese)', 'Tomato Small(Indian)', 'Orange(Indian)',
    'Carrot(Terai)', 'Tomato Small(Terai)', 'Onion Dry (Chinese)',
    'Cabbage(Terai)', 'Cauli Local(Jyapu)', 'Pointed Gourd(Terai)',
    'Grapes(Black)', 'Kiwi', 'Mango(Calcutte)', 'Mango(Chousa)',
    'Sarifa', 'Avocado', 'Amla', 'Tree Tomato'];

export default function PricePredictionPage() {
    const { t } = useLanguage();
    const [commodity, setCommodity] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:5000/predict_price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commodity,
                    date
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to predict price');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                        <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                        {t("price_prediction")}
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Predict future commodity prices using advanced AI analysis of historical market trends.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {t("cat_all")} Commodity
                                </label>
                                <select
                                    value={commodity}
                                    onChange={(e) => setCommodity(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    {COMMODITIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {t("location")} Prediction Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Market Trends...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5" />
                                    {t("get_analysis")}
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl"
                        >
                            <h3 className="text-center text-neutral-600 dark:text-neutral-400 font-medium mb-2 uppercase tracking-widest text-xs">
                                {t("price_forecast")} {result.commodity}
                            </h3>
                            <div className="text-center">
                                <span className="text-5xl font-bold text-green-700 dark:text-green-400">
                                    Rs. {result.predicted_price + 0.15 * result.predicted_price}
                                </span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                                    / Kg
                                </span>
                            </div>
                            <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 mt-4">
                                Forecast for {new Date(result.date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
