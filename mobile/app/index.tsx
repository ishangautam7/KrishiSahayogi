import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ImageBackground,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Translation Dictionary
const translations = {
    en: {
        heroTitle: 'Krishi Sahayogi',
        heroSubtitle: 'Modern Farming for a Golden Harvest',
        getStarted: 'Get Started',
        login: 'Login',
        toolsTitle: 'Our Services',
        tools: {
            crop: 'Crop Doctor',
            cropDesc: 'Diagnose diseases',
            fert: 'Fertilizer',
            fertDesc: 'Nutrient guide',
            guide: 'Cultivation',
            guideDesc: 'Expert advice',
            market: 'Marketplace',
            marketDesc: 'Buy & Sell',
        },
        communityTitle: 'Community',
        communityDesc: 'Join 10,000+ Farmers',
        communityBtn: 'Join Network',
        howItWorks: 'How It Works',
        steps: [
            { title: 'Scan', desc: 'Take a photo of your crop' },
            { title: 'Analyze', desc: 'Get AI diagnosis' },
            { title: 'Harvest', desc: 'Maximize your yield' },
        ],
        footerTag: 'Digitalizing Nepal Agriculture',
    },
    np: {
        heroTitle: 'कृषि सहयोगी',
        heroSubtitle: 'सुनौला भविष्यका लागि आधुनिक खेती',
        getStarted: 'सुरु गर्नुहोस्',
        login: 'लगइन',
        toolsTitle: 'हाम्रा सेवाहरू',
        tools: {
            crop: 'बाली उपचार',
            cropDesc: 'रोग पहिचान गर्नुहोस्',
            fert: 'मलखाद',
            fertDesc: 'पोषक तत्व सल्लाह',
            guide: 'खेती निर्देशिका',
            guideDesc: 'विज्ञ सल्लाह',
            market: 'बजार',
            marketDesc: 'किनबेच गर्नुहोस्',
        },
        communityTitle: 'समुदाय',
        communityDesc: '१०,०००+ किसानहरूसँग जोडिनुहोस्',
        communityBtn: 'नेटवर्कमा जानुहोस्',
        howItWorks: 'कसरी काम गर्छ',
        steps: [
            { title: 'फोटो खिच्नुहोस्', desc: 'बालीको फोटो लिनुहोस्' },
            { title: 'विश्लेषण', desc: 'AI द्वारा जाँच गर्नुहोस्' },
            { title: 'उत्पादन', desc: 'अधिकतम फल प्राप्त गर्नुहोस्' },
        ],
        footerTag: 'नेपालको कृषि डिजिटलाइजेशन',
    },
};

const features = [
    {
        id: 'disease',
        icon: 'medkit',
        color: '#dc2626',
        link: '/disease-detection',
    },
    {
        id: 'fertilizer',
        icon: 'flask',
        color: '#2563eb',
        link: '/fertilizer-prediction',
    },
    {
        id: 'guide',
        icon: 'book',
        color: '#059669',
        link: '/crop-recommendation',
    },
    {
        id: 'market',
        icon: 'cart',
        color: '#d97706',
        link: '/(tabs)/marketplace',
    },
];

import { useAppSelector } from '@/store/hooks';

export default function LandingPage() {
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [lang, setLang] = useState<'en' | 'np'>('en');
    const t = translations[lang];

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'np' : 'en');
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Classic Hero Section */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1625246333195-bf5f7955dcb2?q=80&w=1000&auto=format&fit=crop' }}
                    style={styles.hero}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
                        style={styles.heroOverlay}
                    >
                        {/* Header with Lang Toggle */}
                        <View style={styles.headerTop}>
                            <View style={styles.logoBadge}>
                                <Ionicons name="leaf" size={20} color="#fff" />
                                <Text style={styles.logoText}>KS</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.langButton}
                                onPress={toggleLanguage}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="globe-outline" size={18} color="#fff" />
                                <Text style={styles.langText}>{lang === 'en' ? 'नेपाली' : 'English'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.heroContent}>
                            <View style={styles.divider} />
                            <Text style={styles.heroTitle}>{t.heroTitle}</Text>
                            <Text style={styles.heroSubtitle}>{t.heroSubtitle}</Text>
                            <View style={styles.divider} />

                            <View style={styles.heroButtons}>
                                {isAuthenticated ? (
                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={() => router.push('/(tabs)/dashboard')}
                                        activeOpacity={0.9}
                                    >
                                        <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
                                        <Ionicons name="apps" size={18} color="#064e3b" />
                                    </TouchableOpacity>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={() => router.push('/register')}
                                            activeOpacity={0.9}
                                        >
                                            <Text style={styles.primaryButtonText}>{t.getStarted}</Text>
                                            <Ionicons name="arrow-forward" size={18} color="#064e3b" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.secondaryButton}
                                            onPress={() => router.push('/login')}
                                            activeOpacity={0.9}
                                        >
                                            <Text style={styles.secondaryButtonText}>{t.login}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                {/* Classic Content Section */}
                <View style={styles.contentSection}>
                    <View style={styles.ornamentLine} />
                    <Text style={styles.sectionTitle}>{t.toolsTitle}</Text>

                    <View style={styles.grid}>
                        {features.map((item, index) => {
                            // Map feature id to translation keys
                            let title = '';
                            let desc = '';
                            if (item.id === 'disease') { title = t.tools.crop; desc = t.tools.cropDesc; }
                            else if (item.id === 'fertilizer') { title = t.tools.fert; desc = t.tools.fertDesc; }
                            else if (item.id === 'guide') { title = t.tools.guide; desc = t.tools.guideDesc; }
                            else { title = t.tools.market; desc = t.tools.marketDesc; }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => router.push(item.link as any)}
                                    activeOpacity={0.9}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                                        <Ionicons name={item.icon as any} size={28} color={item.color} />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle}>{title}</Text>
                                        <Text style={styles.cardDesc}>{desc}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Community Banner - Gold/Classic */}
                    <TouchableOpacity
                        style={styles.banner}
                        onPress={() => router.push('/(tabs)/explore')}
                        activeOpacity={0.95}
                    >
                        <ImageBackground
                            source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop' }}
                            style={styles.bannerImage}
                            imageStyle={{ borderRadius: 16 }}
                        >
                            <LinearGradient
                                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']}
                                style={styles.bannerOverlay}
                            >
                                <View>
                                    <Text style={styles.bannerTitle}>{t.communityTitle}</Text>
                                    <Text style={styles.bannerDesc}>{t.communityDesc}</Text>
                                </View>
                                <View style={styles.bannerBtn}>
                                    <Text style={styles.bannerBtnText}>{t.communityBtn}</Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* How It Works - Minimalist */}
                    <View style={styles.stepsSection}>
                        <Text style={styles.sectionTitle}>{t.howItWorks}</Text>
                        <View style={styles.stepsRow}>
                            {t.steps.map((step, i) => (
                                <View key={i} style={styles.stepItem}>
                                    <View style={styles.stepCircle}>
                                        <Text style={styles.stepNum}>{i + 1}</Text>
                                    </View>
                                    <Text style={styles.stepTitle}>{step.title}</Text>
                                    <Text style={styles.stepDesc}>{step.desc}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Elegant Footer */}
                    <View style={styles.footer}>
                        <Ionicons name="leaf" size={24} color="#10b981" style={{ marginBottom: 8 }} />
                        <Text style={styles.footerBrand}>KRISHI SAHAYOGI</Text>
                        <Text style={styles.footerTag}>{t.footerTag}</Text>
                        <Text style={styles.footerCopy}>© 2026</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
    },
    hero: {
        height: 550,
        width: '100%',
    },
    heroOverlay: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 60,
    },
    logoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    logoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    langText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    heroContent: {
        alignItems: 'center',
    },
    divider: {
        width: 60,
        height: 4,
        backgroundColor: '#fbbf24', // Amber/Gold
        borderRadius: 2,
        marginVertical: 24,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '900', // Serif style heavy weight
        color: '#fff',
        textAlign: 'center',
        lineHeight: 56,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Trying to use native serif
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#f3f4f6',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '400',
        letterSpacing: 0.5,
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 12,
    },
    primaryButton: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 8,
    },
    primaryButtonText: {
        color: '#064e3b',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    contentSection: {
        backgroundColor: '#f8fafc', // Off-white classic
        marginTop: -40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 32,
        minHeight: 500,
    },
    ornamentLine: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 32,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        letterSpacing: 0.5,
    },
    grid: {
        gap: 16,
        marginBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: '#6b7280',
    },
    banner: {
        height: 180,
        marginBottom: 40,
        elevation: 4,
        borderRadius: 16,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        flex: 1,
        borderRadius: 16,
        padding: 24,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    bannerDesc: {
        color: '#e5e7eb',
        fontSize: 14,
    },
    bannerBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    bannerBtnText: {
        color: '#1f2937',
        fontWeight: 'bold',
        fontSize: 12,
    },
    stepsSection: {
        marginBottom: 40,
    },
    stepsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepItem: {
        alignItems: 'center',
        width: '30%',
    },
    stepCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1f2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepNum: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fbbf24',
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    stepDesc: {
        fontSize: 10,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 14,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footerBrand: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        letterSpacing: 2,
        marginBottom: 4,
    },
    footerTag: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    footerCopy: {
        fontSize: 10,
        color: '#d1d5db',
    },
});
