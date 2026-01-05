import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed?: number;
    isDay: number; // 1 for Day, 0 for Night
}

interface LocationData {
    name: string;
    lat: number;
    lon: number;
}

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getConditionText = (code: number) => {
        if (code === 0) return "Clear Sky";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 48) return "Foggy";
        if (code <= 67) return "Rainy";
        if (code <= 77) return "Snowy";
        if (code <= 82) return "Rain Showers";
        return "Thunderstorm";
    };

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation not supported");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Fetch Weather
                const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);
                const current = weatherRes.data.current_weather;

                setWeather({
                    temp: current.temperature,
                    condition: getConditionText(current.weathercode),
                    humidity: weatherRes.data.hourly.relative_humidity_2m[0],
                    windSpeed: current.windspeed,
                    isDay: current.is_day
                });

                // Fetch Location Name
                const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const address = geoRes.data.address;
                const locName = address.city || address.town || address.village || address.municipality || "Your Location";

                setLocation({
                    name: locName,
                    lat: latitude,
                    lon: longitude
                });

            } catch (err) {
                console.error("Weather fetch error:", err);
                setError("Failed to fetch weather data");
            } finally {
                setLoading(false);
            }
        }, (err) => {
            console.error("Geolocation error:", err);
            setError("Location access denied");
            setLoading(false);
        });
    }, []);

    return { weather, location, loading, error };
};
