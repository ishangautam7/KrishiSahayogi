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

export default function CropRecommendationScreen() {
    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleSubmit = async () => {
        // Validate inputs
        const values = Object.values(formData);
        if (values.some(v => !v)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                n: Number(formData.N),
                p: Number(formData.P),
                k: Number(formData.K),
                temp: Number(formData.temperature),
                humidity: Number(formData.humidity),
                ph: Number(formData.ph),
                rainfall: Number(formData.rainfall),
            };

            const response = await mlApi.predictCrop(payload);
            setResult(response.data.crop);
        } catch (error) {
            Alert.alert('Error', 'Failed to get prediction. Make sure ML server is running.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Crop Recommendation</Text>
                <View style={{ width: 24 }} />
            </View>

            <Text style={styles.subtitle}>
                Enter your soil and environmental data for AI-powered crop suggestions
            </Text>

            <View style={styles.form}>
                <Text style={styles.sectionTitle}>Soil Nutrients (NPK)</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nitrogen (N)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0-140"
                        keyboardType="numeric"
                        value={formData.N}
                        onChangeText={(text) => updateField('N', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phosphorus (P)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0-145"
                        keyboardType="numeric"
                        value={formData.P}
                        onChangeText={(text) => updateField('P', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Potassium (K)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0-205"
                        keyboardType="numeric"
                        value={formData.K}
                        onChangeText={(text) => updateField('K', text)}
                    />
                </View>

                <Text style={styles.sectionTitle}>Environmental Factors</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Temperature (°C)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="8-43"
                        keyboardType="numeric"
                        value={formData.temperature}
                        onChangeText={(text) => updateField('temperature', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Humidity (%)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10-100"
                        keyboardType="numeric"
                        value={formData.humidity}
                        onChangeText={(text) => updateField('humidity', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>pH Level</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="3.5-9.5"
                        keyboardType="numeric"
                        value={formData.ph}
                        onChangeText={(text) => updateField('ph', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Rainfall (mm)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="20-300"
                        keyboardType="numeric"
                        value={formData.rainfall}
                        onChangeText={(text) => updateField('rainfall', text)}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="leaf" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Get Recommendation</Text>
                        </>
                    )}
                </TouchableOpacity>

                {result && (
                    <View style={styles.resultCard}>
                        <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                        <Text style={styles.resultTitle}>Recommended Crop</Text>
                        <Text style={styles.resultCrop}>{result}</Text>
                        <Text style={styles.resultDesc}>
                            This crop is best suited for your soil and climate conditions
                        </Text>
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
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        paddingHorizontal: 20,
        marginBottom: 24,
        lineHeight: 20,
    },
    form: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 16,
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
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
    resultDesc: {
        fontSize: 14,
        color: '#047857',
        textAlign: 'center',
        marginTop: 8,
    },
});
