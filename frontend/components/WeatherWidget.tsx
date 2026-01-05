'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, MapPin, Sun, Moon, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Thermometer } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

const WeatherWidget = () => {
    const { weather, location, loading, error } = useWeather();

    const getWeatherIcon = (condition: string, isDay: number) => {
        const isNight = isDay === 0;

        if (condition.includes("Rain") || condition.includes("Drizzle")) return <CloudRain className="w-8 h-8 text-blue-400 animate-bounce" />;
        if (condition.includes("Snow")) return <CloudSnow className="w-8 h-8 text-white animate-pulse" />;
        if (condition.includes("Thunder")) return <CloudLightning className="w-8 h-8 text-purple-500 animate-pulse" />;
        if (condition.includes("Fog")) return <CloudFog className="w-8 h-8 text-gray-400" />;
        if (condition.includes("Cloud")) return <Cloud className="w-8 h-8 text-gray-400" />;

        return isNight
            ? <Moon className="w-8 h-8 text-indigo-300 animate-pulse" />
            : <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
    };

    if (loading) {
        return (
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-full max-w-sm animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 mb-4"></div>
                <div className="flex gap-4">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50/90 dark:bg-red-900/20 backdrop-blur-md border border-red-200 dark:border-red-800 rounded-3xl p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                    <MapPin className="w-5 h-5" />
                    <span className="font-bold text-sm">Location Required</span>
                </div>
                <p className="mt-2 text-xs text-red-500/80">Enable location to see local farming weather.</p>
            </div>
        );
    }

    if (!weather || !location) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-yellow-400/30 transition-colors"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold tracking-wide uppercase">{location.name}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {weather.condition}
                        </h3>
                    </div>
                    <div className="bg-emerald-100/50 dark:bg-emerald-900/30 p-3 rounded-2xl">
                        {getWeatherIcon(weather.condition, weather.isDay)}
                    </div>
                </div>

                <div className="flex items-end gap-2 mb-8">
                    <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {Math.round(weather.temp)}°
                    </span>
                    <span className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">C</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-3 flex items-center gap-3">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Humidity</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{Math.round(weather.humidity)}%</p>
                        </div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-3 flex items-center gap-3">
                        <Wind className="w-5 h-5 text-teal-500" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Wind</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{weather.windSpeed} km/h</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherWidget;
