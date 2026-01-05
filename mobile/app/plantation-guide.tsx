import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CROP_GUIDES = [
    {
        name: "Rice (Paddy)",
        scientific: "Oryza sativa",
        category: "Cereal",
        season: "Monsoon (Kharif)",
        // In a real app, you'd use require() or a remote URL
        image: "https://images.unsplash.com/photo-1536630596251-61b420f8625c?q=80&w=1000&auto=format&fit=crop", 
        description: "The primary staple crop of Nepal, requiring standing water and humid conditions.",
        stats: {
            temp: "20°C - 35°C",
            rainfall: "1500mm - 2000mm",
            soil: "Clayey Loam",
            duration: "120 - 150 Days"
        },
        steps: [
            "Seedbed preparation (May-June)",
            "Transplanting seedlings (June-July)",
            "Regular weeding and water management",
            "Harvesting when grains turn golden"
        ]
    },
    {
        name: "Wheat",
        scientific: "Triticum aestivum",
        category: "Cereal",
        season: "Winter (Rabi)",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop",
        description: "A major winter crop in the Terai and mid-hills, essential for food security.",
        stats: {
            temp: "10°C - 25°C",
            rainfall: "450mm - 650mm",
            soil: "Loamy",
            duration: "110 - 140 Days"
        },
        steps: [
            "Sowing in late October-November",
            "Irrigation at critical growth stages",
            "Balanced nitrogen fertilization",
            "Harvesting in March-April"
        ]
    },
    {
        name: "Maize (Corn)",
        scientific: "Zea mays",
        category: "Cereal",
        season: "Summer/Monsoon",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop",
        description: "Widely grown in the hilly regions for both food and livestock feed.",
        stats: {
            temp: "18°C - 30°C",
            rainfall: "500mm - 800mm",
            soil: "Well-drained Loam",
            duration: "90 - 120 Days"
        },
        steps: [
            "Soil preparation with organic manure",
            "Sowing with proper spacing",
            "Inter-cultivation for aeration",
            "Harvesting when husks dry"
        ]
    }
];

export default function PlantationGuideScreen() {
    const [selectedCrop, setSelectedCrop] = useState(CROP_GUIDES[0]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Plantation Manual</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
                    {CROP_GUIDES.map((crop) => (
                        <TouchableOpacity
                            key={crop.name}
                            onPress={() => setSelectedCrop(crop)}
                            style={[
                                styles.tab,
                                selectedCrop.name === crop.name && styles.activeTab
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedCrop.name === crop.name && styles.activeTabText
                            ]}>
                                {crop.name.split(' ')[0]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.heroImageContainer}>
                    <Image source={{ uri: selectedCrop.image }} style={styles.heroImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.imageOverlay}
                    >
                        <Text style={styles.categoryBadge}>{selectedCrop.category}</Text>
                        <Text style={styles.cropName}>{selectedCrop.name}</Text>
                        <Text style={styles.scientificName}>{selectedCrop.scientific}</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="leaf" size={24} color="#10b981" />
                        <Text style={styles.sectionTitle}>Overview</Text>
                    </View>
                    <Text style={styles.description}>{selectedCrop.description}</Text>
                    
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Ionicons name="calendar-outline" size={20} color="#10b981" />
                            <Text style={styles.statLabel}>Season</Text>
                            <Text style={styles.statValue}>{selectedCrop.season}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="time-outline" size={20} color="#10b981" />
                            <Text style={styles.statLabel}>Duration</Text>
                            <Text style={styles.statValue}>{selectedCrop.stats.duration}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="thermometer-outline" size={24} color="#ef4444" />
                        <Text style={styles.sectionTitle}>Growth Requirements</Text>
                    </View>
                    
                    <View style={styles.requirementRow}>
                        <View style={styles.requirementItem}>
                            <Text style={styles.reqLabel}>Temperature</Text>
                            <Text style={styles.reqValue}>{selectedCrop.stats.temp}</Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Text style={styles.reqLabel}>Rainfall</Text>
                            <Text style={styles.reqValue}>{selectedCrop.stats.rainfall}</Text>
                        </View>
                    </View>
                     <View style={styles.requirementRow}>
                        <View style={styles.requirementItem}>
                            <Text style={styles.reqLabel}>Soil Type</Text>
                            <Text style={styles.reqValue}>{selectedCrop.stats.soil}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { marginBottom: 40 }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
                        <Text style={styles.sectionTitle}>Best Practices</Text>
                    </View>

                    <View style={styles.stepsContainer}>
                        {selectedCrop.steps.map((step, index) => (
                            <View key={index} style={styles.stepRow}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    tabsContainer: {
        backgroundColor: '#fff',
        paddingBottom: 12,
    },
    tabsContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: '#10b981',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
    activeTabText: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    heroImageContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingTop: 60,
    },
    categoryBadge: {
        color: '#34d399',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    cropName: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    scientificName: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontStyle: 'italic',
    },
    section: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    description: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 16,
    },
    statLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 8,
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    requirementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    requirementItem: {
        flex: 1,
    },
    reqLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    reqValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    stepsContainer: {
        gap: 16,
    },
    stepRow: {
        flexDirection: 'row',
        gap: 16,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        color: '#4b5563',
        paddingTop: 4,
    },
});
