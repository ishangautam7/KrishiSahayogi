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
    ImageBackground,
    StatusBar,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        const values = Object.values(formData);
        if (values.some(v => !v)) {
            Alert.alert('Missing Data', 'Please fill in all fields for accurate prediction');
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
            Alert.alert('Error', 'Failed to get prediction. Ensure ML server is running.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const InputGroup = ({ label, icon, field, placeholder, range }: any) => (
        <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
                <Ionicons name={icon} size={14} color="#10b981" />
                <Text style={styles.label}>{label}</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={(formData as any)[field]}
                onChangeText={(text) => updateField(field, text)}
            />
            <Text style={styles.rangeText}>{range}</Text>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crop Suggestion</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>
                        Find the <Text style={styles.heroHighlight}>Perfect Crop</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        AI-powered analysis based on your soil and climate conditions.
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="leaf" size={24} color="#10b981" />
                        <Text style={styles.cardTitle}>Soil Parameters</Text>
                    </View>

                    <View style={styles.grid}>
                        <InputGroup label="Nitrogen (N)" icon="flask" field="N" placeholder="0-140" range="Ratio" />
                        <InputGroup label="Phosphorus (P)" icon="flask" field="P" placeholder="0-145" range="Ratio" />
                        <InputGroup label="Potassium (K)" icon="flask" field="K" placeholder="0-205" range="Ratio" />
                        <InputGroup label="pH Level" icon="water" field="ph" placeholder="0-14" range="0-14" />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardHeader}>
                        <Ionicons name="cloud" size={24} color="#0ea5e9" />
                        <Text style={styles.cardTitle}>Environment</Text>
                    </View>

                    <View style={styles.grid}>
                        <InputGroup label="Temperature" icon="thermometer" field="temperature" placeholder="°C" range="Celsius" />
                        <InputGroup label="Humidity" icon="water" field="humidity" placeholder="%" range="Percentage" />
                        <View style={styles.fullWidth}>
                            <InputGroup label="Rainfall" icon="rainy" field="rainfall" placeholder="mm" range="Millimeters" />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>Run AI Diagnostic</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Result Modal/Card */}
                {result && (
                    <View style={styles.resultContainer}>
                        <LinearGradient
                            colors={['#ecfdf5', '#d1fae5']}
                            style={styles.resultCard}
                        >
                            <View style={styles.resultIconBg}>
                                <Ionicons name="checkmark-done-circle" size={40} color="#10b981" />
                            </View>
                            <Text style={styles.resultLabel}>Top Recommendation</Text>
                            <Text style={styles.resultText}>{result}</Text>
                            <Text style={styles.resultSubtext}>Optimized for your conditions</Text>

                            <TouchableOpacity
                                onPress={() => setResult(null)}
                                style={styles.resetButton}
                            >
                                <Text style={styles.resetText}>Analyze Again</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: '#f8fafc',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    heroSection: {
        marginBottom: 30,
        marginTop: 10,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: 40,
    },
    heroHighlight: {
        color: '#10b981',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 8,
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    inputContainer: {
        width: '47%',
        marginBottom: 8,
    },
    fullWidth: {
        width: '100%',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    rangeText: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 4,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 24,
    },
    submitButton: {
        marginTop: 32,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    gradientButton: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    resultContainer: {
        marginTop: 30,
    },
    resultCard: {
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a7f3d0',
    },
    resultIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
    },
    resultLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#059669',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
    },
    resultText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#064e3b',
        marginBottom: 8,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    resultSubtext: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '500',
        marginBottom: 24,
    },
    resetButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    resetText: {
        color: '#059669',
        fontWeight: '700',
        fontSize: 14,
    },
});
