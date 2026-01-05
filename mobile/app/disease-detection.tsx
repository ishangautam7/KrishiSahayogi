import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';

export default function DiseaseDetectionScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const pickImage = async (useCamera: boolean) => {
        let result;
        if (useCamera) {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Camera permission is required');
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
        }

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
            setResult(null);
        }
    };

    const detectDisease = async () => {
        if (!image) {
            Alert.alert('Error', 'Please select an image first');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: 'plant.jpg',
            } as any);

            const response = await api.predictDisease(formData);
            setResult(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to detect disease');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Disease Detection</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {image ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.changeButton}
                            onPress={() => setImage(null)}
                        >
                            <Text style={styles.changeButtonText}>Change Image</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.uploadContainer}>
                        <Ionicons name="leaf-outline" size={64} color="#10b981" />
                        <Text style={styles.uploadTitle}>Upload Plant Image</Text>
                        <Text style={styles.uploadDesc}>
                            Take a photo or choose from gallery
                        </Text>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => pickImage(true)}
                            >
                                <Ionicons name="camera" size={24} color="#fff" />
                                <Text style={styles.uploadButtonText}>Camera</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => pickImage(false)}
                            >
                                <Ionicons name="images" size={24} color="#fff" />
                                <Text style={styles.uploadButtonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {image && (
                    <TouchableOpacity
                        style={[styles.detectButton, loading && styles.buttonDisabled]}
                        onPress={detectDisease}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="scan" size={20} color="#fff" />
                                <Text style={styles.detectButtonText}>Detect Disease</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {result && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>Detection Result</Text>
                        <Text style={styles.resultDisease}>{result.disease || 'Healthy'}</Text>
                        <Text style={styles.resultDesc}>{result.description}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
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
    content: {
        flex: 1,
        padding: 20,
    },
    uploadContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 24,
    },
    uploadDesc: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
        marginBottom: 32,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 16,
    },
    uploadButton: {
        backgroundColor: '#10b981',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 16,
        backgroundColor: '#e5e7eb',
    },
    changeButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#10b981',
    },
    changeButtonText: {
        color: '#10b981',
        fontWeight: '600',
    },
    detectButton: {
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
    detectButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    resultTitle: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '600',
    },
    resultDisease: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#10b981',
        marginTop: 8,
    },
    resultDesc: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 12,
        lineHeight: 20,
    },
});
