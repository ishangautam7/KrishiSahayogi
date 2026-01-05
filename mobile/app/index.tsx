import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '@/components/Navbar';

const { width } = Dimensions.get('window');

const features = [
    {
        title: 'Fertilizer Prediction',
        desc: 'Advanced AI models to forecast the perfect fertilizer mix for your soil and crops.',
        icon: 'bar-chart-outline',
        link: '/fertilizer-prediction',
    },
    {
        title: 'Crop Recommendation',
        desc: 'Personalized suggestions for what to plant next to maximize your season\'s profit.',
        icon: 'leaf-outline',
        link: '/crop-recommendation',
    },
    {
        title: 'Disease Detection',
        desc: 'Snap a photo and get instant diagnosis and organic treatment solutions.',
        icon: 'flask-outline',
        link: '/disease-detection',
    },
    {
        title: 'Plantation Guide',
        desc: 'Expert cultivation advice for Nepal\'s most vital crops. From seed to harvest.',
        icon: 'book-outline',
        link: '/plantation-guide',
    },
    {
        title: 'Community Network',
        desc: 'Connect with local experts, share wisdom, and grow your community.',
        icon: 'people-outline',
        link: '/(tabs)/explore',
    },
    {
        title: 'Marketplace',
        desc: 'Direct farm-to-table access. Sell your produce at fair prices with no middlemen.',
        icon: 'cart-outline',
        link: '/(tabs)/marketplace',
    },
];

export default function LandingPage() {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
            {/* Hero Section */}
            <LinearGradient
                colors={['#ecfdf5', '#f9fafb']}
                style={styles.hero}
            >
                <View style={styles.heroContent}>
                    <Text style={styles.heroNepali}>कृषि सहयोगी</Text>
                    <Text style={styles.heroTitle}>
                        Empowering{'\n'}
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientTextContainer}
                        >
                            <Text style={styles.heroGradientText}>Modern Agriculture</Text>
                        </LinearGradient>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Harness the power of AI to transform your farming with crop recommendations, disease detection, and direct market access
                    </Text>

                    <View style={styles.ctaButtons}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.push('/register')}
                        >
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.primaryButtonText}>Get Started</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.push('/login')}
                        >
                            <Text style={styles.secondaryButtonText}>Explore Marketplace</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            {/* Features Section */}
            <View style={styles.featuresSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>CORE ECOSYSTEM</Text>
                    <Text style={styles.sectionTitle}>Designed for Every Farmer</Text>
                    <Text style={styles.sectionDesc}>
                        Our comprehensive suite of tools leverages cutting-edge technology to solve traditional farming challenges.
                    </Text>
                </View>

                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.featureCard}
                            onPress={() => router.push(feature.link as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDesc}>{feature.desc}</Text>

                                <View style={styles.featureImagePlaceholder}>
                                    <Ionicons name={feature.icon as any} size={48} color="#10b981" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* How it Works Section */}
            <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.howItWorksSection}
            >
                <Text style={styles.howItWorksTitle}>Getting Started is Simple</Text>

                <View style={styles.steps}>
                    <View style={styles.step}>
                        <View style={styles.stepIcon}>
                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Register</Text>
                            <Text style={styles.stepDesc}>Create your profile and list your farm location.</Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepIcon}>
                            <Ionicons name="flask" size={24} color="#fff" />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Analyze</Text>
                            <Text style={styles.stepDesc}>Use AI tools to optimize your farming strategy.</Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepIcon}>
                            <Ionicons name="cart" size={24} color="#fff" />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Trade</Text>
                            <Text style={styles.stepDesc}>Sell your produce directly to verified buyers.</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.joinButton} onPress={() => router.push('/register')}>
                    <Text style={styles.joinButtonText}>Join the Revolution</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerLogo}>
                    <View style={styles.footerLogoIcon}>
                        <Ionicons name="leaf" size={24} color="#fff" />
                    </View>
                    <Text style={styles.footerLogoText}>कृषि सहयोगी</Text>
                </View>
                <Text style={styles.footerDesc}>
                    Empowering Nepali farmers with the power of Artificial Intelligence and direct market access.
                </Text>
                <Text style={styles.copyright}>© 2026 Krishi Sahayogi. All rights reserved.</Text>
                <Text style={styles.nepaliTagline}>भविष्यको कृषि, आजको प्रविधि</Text>
            </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    hero: {
        paddingTop: 40,
        paddingBottom: 60,
        borderBottomRightRadius: 60,
        overflow: 'hidden',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'center',
    },
    heroNepali: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1f2937',
        marginBottom: 16,
        textAlign: 'left',
    },
    heroTitle: {
        fontSize: 56,
        fontWeight: '900',
        color: '#1f2937',
        lineHeight: 64,
        marginBottom: 24,
    },
    gradientTextContainer: {
        borderRadius: 8,
        paddingVertical: 4,
    },
    heroGradientText: {
        fontSize: 56,
        fontWeight: '900',
        color: '#fff',
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#6b7280',
        lineHeight: 28,
        marginBottom: 40,
    },
    ctaButtons: {
        gap: 16,
    },
    primaryButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#1f2937',
        fontSize: 18,
        fontWeight: '700',
    },
    featuresSection: {
        paddingVertical: 80,
        paddingHorizontal: 24,
        backgroundColor: '#f9fafb',
    },
    sectionHeader: {
        marginBottom: 48,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#10b981',
        letterSpacing: 3,
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#1f2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionDesc: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    featuresGrid: {
        gap: 16,
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
    },
    featureContent: {
        gap: 12,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1f2937',
        textTransform: 'uppercase',
        letterSpacing: -0.5,
    },
    featureDesc: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 22,
    },
    featureImagePlaceholder: {
        height: 120,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    howItWorksSection: {
        padding: 48,
        paddingVertical: 80,
    },
    howItWorksTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 48,
    },
    steps: {
        gap: 32,
    },
    step: {
        flexDirection: 'row',
        gap: 16,
    },
    stepIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    stepDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 22,
    },
    joinButton: {
        marginTop: 48,
        paddingVertical: 18,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#10b981',
        fontSize: 18,
        fontWeight: '900',
    },
    footer: {
        backgroundColor: '#111827',
        padding: 48,
        paddingVertical: 80,
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    footerLogoIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#10b981',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLogoText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '700',
    },
    footerDesc: {
        fontSize: 14,
        color: '#9ca3af',
        lineHeight: 22,
        marginBottom: 32,
    },
    copyright: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
    },
    nepaliTagline: {
        fontSize: 12,
        color: '#10b981',
        opacity: 0.5,
    },
});
