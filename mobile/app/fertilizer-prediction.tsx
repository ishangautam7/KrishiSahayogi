import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mlApi } from '@/lib/api';

export default function FertilizerPredictionScreen() {
    const [formData, setFormData] = useState({
        Temperature: '',
        Humidity: '',
        Moisture: '',
        Soil_Type: 'Loamy',
        Crop_Type: 'Cotton',
        Nitrogen: '',
        Potassium: '',
        Phosphorous: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
    const cropTypes = ['Cotton', 'Wheat', 'Rice', 'Maize', 'Sugarcane', 'Barley'];

    const handleSubmit = async () => {
        const { Temperature, Humidity, Moisture, Nitrogen, Potassium, Phosphorous } = formData;

        if (!Temperature || !Humidity || !Moisture || !Nitrogen || !Potassium || !Phosphorous) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                temp: Number(Temperature),
                humidity: Number(Humidity),
                moisture: Number(Moisture),
                soil_type: formData.Soil_Type,
                crop_type: formData.Crop_Type,
                nitrogen: Number(Nitrogen),
                potassium: Number(Potassium),
                phosphorus: Number(Phosphorous),
            };

            const response = await mlApi.predictFertilizer(payload);
            setResult(response.data.fertilizer);
        } catch (error) {
            Alert.alert('Error', 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Fertilizer Recommendation</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Temperature (°C)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter temperature"
                    keyboardType="numeric"
                    value={formData.Temperature}
                    onChangeText={(text) => setFormData({ ...formData, Temperature: text })}
                />

                <Text style={styles.label}>Humidity (%)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter humidity"
                    keyboardType="numeric"
                    value={formData.Humidity}
                    onChangeText={(text) => setFormData({ ...formData, Humidity: text })}
                />

                <Text style={styles.label}>Soil Moisture</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter moisture level"
                    keyboardType="numeric"
                    value={formData.Moisture}
                    onChangeText={(text) => setFormData({ ...formData, Moisture: text })}
                />

                <Text style={styles.label}>Nitrogen (N)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0-140"
                    keyboardType="numeric"
                    value={formData.Nitrogen}
                    onChangeText={(text) => setFormData({ ...formData, Nitrogen: text })}
                />

                <Text style={styles.label}>Phosphorus (P)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0-145"
                    keyboardType="numeric"
                    value={formData.Phosphorous}
                    onChangeText={(text) => setFormData({ ...formData, Phosphorous: text })}
                />

                <Text style={styles.label}>Potassium (K)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0-205"
                    keyboardType="numeric"
                    value={formData.Potassium}
                    onChangeText={(text) => setFormData({ ...formData, Potassium: text })}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="flask" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Get Recommendation</Text>
                        </>
                    )}
                </TouchableOpacity>

                {result && (
                    <View style={styles.resultCard}>
                        <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                        <Text style={styles.resultTitle}>Recommended Fertilizer</Text>
                        <Text style={styles.resultCrop}>{result}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    button: {
        backgroundColor: '#10b981',
        borderRadius: 12,
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: '#d1fae5',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginTop: 24,
    },
    resultTitle: {
        fontSize: 16,
        color: '#047857',
        fontWeight: '600',
        marginTop: 12,
    },
    resultCrop: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#10b981',
        marginTop: 8,
    },
});
