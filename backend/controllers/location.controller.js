import axios from 'axios';

/**
 * Get environmental data based on location coordinates
 * Fetches weather, soil, and estimated NPK values
 */
export const getEnvironmentalData = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates'
            });
        }

        // Fetch weather data from Open-Meteo API
        const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast`,
            {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    hourly: 'relative_humidity_2m,soil_moisture_0_to_7cm,precipitation',
                    daily: 'precipitation_sum',
                    timezone: 'auto'
                }
            }
        );

        const currentWeather = weatherResponse.data.current_weather;
        const hourlyData = weatherResponse.data.hourly;
        const dailyData = weatherResponse.data.daily;

        // Get current hour index
        const currentHourIndex = 0;

        // Calculate rainfall (daily sum from current day)
        const rainfall = dailyData.precipitation_sum[0] || 50; // Default fallback

        // Get current humidity
        const humidity = hourlyData.relative_humidity_2m[currentHourIndex] || 65;

        // Get soil moisture
        const soilMoisture = hourlyData.soil_moisture_0_to_7cm[currentHourIndex] || 50;

        // Temperature from current weather
        const temperature = currentWeather.temperature;

        // Fetch location name from Nominatim (OpenStreetMap)
        let locationName = 'Your Location';
        try {
            const geoResponse = await axios.get(
                `https://nominatim.openstreetmap.org/reverse`,
                {
                    params: {
                        format: 'json',
                        lat: latitude,
                        lon: longitude
                    },
                    headers: {
                        'User-Agent': 'KrishiSahayogi/1.0'
                    }
                }
            );

            const address = geoResponse.data.address;
            locationName = address.city || address.town || address.village || address.county || 'Your Location';
        } catch (geoError) {
            console.error('Geocoding error:', geoError.message);
        }

        // Return only scientifically valid data from weather APIs
        // NPK and pH should be obtained via questionnaire or manual entry
        const environmentalData = {
            success: true,
            location: {
                latitude,
                longitude,
                name: locationName
            },
            weather: {
                temperature: Math.round(temperature * 10) / 10,
                humidity: Math.round(humidity),
                rainfall: Math.round(rainfall * 10) / 10,
                soilMoisture: Math.round(soilMoisture)
            }
        };

        res.json(environmentalData);
    } catch (error) {
        console.error('Location data error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch environmental data',
            error: error.message
        });
    }
};
