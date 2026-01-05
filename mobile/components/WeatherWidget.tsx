import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { api } from '../lib/api';

const WeatherWidget = () => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadWeather();
    }, []);

    const loadWeather = async () => {
        try {
            setLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location access needed');
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Use the existing backend API for location data which returns weather
            const response = await api.getLocationData(latitude, longitude);
            setWeather(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Weather unavailable');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <TouchableOpacity onPress={loadWeather} style={[styles.container, styles.errorContainer]}>
                <Ionicons name="cloud-offline-outline" size={24} color="#fecaca" />
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
        );
    }

    if (!weather) return null;

    // Mapping weather condition to icon
    const getIcon = (condition: string) => {
        const cond = condition.toLowerCase();
        if (cond.includes('rain')) return 'rainy';
        if (cond.includes('cloud')) return 'cloudy';
        if (cond.includes('clear') || cond.includes('sun')) return 'sunny';
        if (cond.includes('snow')) return 'snow';
        if (cond.includes('thunder')) return 'thunderstorm';
        return 'partly-sunny';
    };

    return (
        <LinearGradient
            colors={['#059669', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={16} color="#ecfdf5" />
                    <Text style={styles.locationText}>{weather.location?.name || 'Local Weather'}</Text>
                </View>
                <Text style={styles.conditionText}>{weather.weather?.condition}</Text>
            </View>

            <View style={styles.mainContent}>
                <View>
                    <Text style={styles.tempText}>{Math.round(weather.weather?.temp)}°</Text>
                    <Text style={styles.realFeel}>Feels like {Math.round(weather.weather?.temp)}°</Text>
                </View>
                <Ionicons name={getIcon(weather.weather?.condition || '') as any} size={64} color="#fff" />
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="water-outline" size={16} color="#d1fae5" />
                    <Text style={styles.detailText}>{Math.round(weather.weather?.humidity)}% Hum</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="speedometer-outline" size={16} color="#d1fae5" />
                    <Text style={styles.detailText}>{weather.weather?.windSpeed} km/h</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        elevation: 8,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    loadingContainer: {
        height: 160,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    errorText: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
    },
    retryText: {
        color: '#fecaca',
        fontSize: 12,
        marginTop: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    locationText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    conditionText: {
        color: '#ecfdf5',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    mainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tempText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    realFeel: {
        color: '#d1fae5',
        fontSize: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        color: '#ecfdf5',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default WeatherWidget;
