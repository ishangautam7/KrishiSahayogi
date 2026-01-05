import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '@/store/hooks';
import WeatherWidget from '@/components/WeatherWidget';
import { api } from '@/lib/api';

const { width } = Dimensions.get('window');

// Translation Dictionary
const translations = {
    en: {
        heroTitle: 'Modern Farming for a Golden Harvest',
        heroSubtitle: 'Empowering farmers with AI tools and expert insights.',
        startFarming: 'Start Farming',
        diseaseDetection: 'Disease Detection',
        login: 'Login',
        ecosystemTitle: 'Core Ecosystem',
        noticesTitle: 'Agricultural Notices',
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
        communityBtn: 'Join Network',
        howItWorks: 'How It Works',
        steps: [
            { title: 'Scan', desc: 'Expert diagnosis in seconds' },
            { title: 'Analyze', desc: 'AI-powered insights' },
            { title: 'Harvest', desc: 'Maximize your yield' },
        ],
        footerTag: 'Digitalizing Nepal Agriculture',
    },
    np: {
        heroTitle: 'सुनौला भविष्यका लागि आधुनिक खेती',
        heroSubtitle: 'AI उपकरण र विज्ञ सल्लाहका साथ किसानहरूलाई सशक्त बनाउँदै।',
        startFarming: 'खेती सुरु गर्नुहोस्',
        diseaseDetection: 'रोग पहिचान',
        login: 'लगइन',
        ecosystemTitle: 'मुख्य सेवाहरू',
        noticesTitle: 'कृषि सूचनाहरू',
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
        communityBtn: 'नेटवर्कमा जानुहोस्',
        howItWorks: 'कसरी काम गर्छ',
        steps: [
            { title: 'फोटो खिच्नुहोस्', desc: 'विज्ञबाट तुरुन्त जाँच' },
            { title: 'विश्लेषण', desc: 'AI द्वारा सुझावहरू' },
            { title: 'उत्पादन', desc: 'अधिकतम फल प्राप्त गर्नुहोस्' },
        ],
        footerTag: 'नेपालको कृषि डिजिटलाइजेशन',
    },
};

const features = [
    {
        id: 'guide', // Prioritized
        icon: 'book',
        color: '#f59e0b', // Amber/Plantation
        bgColor: '#fffbeb',
        link: '/crop-recommendation',
    },
    {
        id: 'fertilizer', // Prioritized
        icon: 'flask',
        color: '#10b981', // Emerald/Yield
        bgColor: '#ecfdf5',
        link: '/fertilizer-prediction',
    },
    {
        id: 'disease', // Prioritized
        icon: 'scan-circle',
        color: '#0ea5e9', // Sky/Teal
        bgColor: '#f0f9ff',
        link: '/disease-detection',
    },
    {
        id: 'market', // Deprioritized (Last)
        icon: 'cart',
        color: '#f43f5e', // Rose/Marketplace
        bgColor: '#fff1f2',
        link: '/(tabs)/marketplace',
    },
];

export default function LandingPage() {
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [lang, setLang] = useState<'en' | 'np'>('en');
    const [notices, setNotices] = useState<any[]>([]);
    const t = translations[lang];

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'np' : 'en');
    };

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        try {
            const res = await api.getNotices();
            if (res.data && res.data.success) {
                setNotices(res.data.data.slice(0, 3)); // Take top 3 notices
            }
        } catch (error) {
            console.log("Failed to load notices");
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1625246333195-bf5f7955dcb2?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.3)', 'rgba(6, 78, 59, 0.9)']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.heroGradient}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.logoContainer}>
                                    <View style={styles.logoIconBg}>
                                        <Ionicons name="leaf" size={18} color="#10b981" />
                                    </View>
                                    <Text style={styles.appName}>Krishi Sahayogi</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.langButton}
                                    onPress={toggleLanguage}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.langIconBg}>
                                        <Text style={styles.langIconText}>{lang === 'en' ? 'NP' : 'EN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle}>{t.heroTitle}</Text>
                                <Text style={styles.heroSubtitle}>{t.heroSubtitle}</Text>

                                <View style={styles.actionButtons}>
                                    {isAuthenticated ? (
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={() => router.push('/(tabs)/dashboard')}
                                            activeOpacity={0.9}
                                        >
                                            <Text style={styles.primaryButtonText}>{t.startFarming}</Text>
                                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={() => router.push('/register')}
                                            activeOpacity={0.9}
                                        >
                                            <Text style={styles.primaryButtonText}>{t.startFarming}</Text>
                                            <Ionicons name="leaf-outline" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={() => router.push('/disease-detection')}
                                        activeOpacity={0.9}
                                    >
                                        <Text style={styles.secondaryButtonText}>{t.diseaseDetection}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                {/* Main Content - Floating Sheet */}
                <View style={styles.sheetContainer}>

                    {/* Weather Widget Section */}
                    <View style={styles.weatherSection}>
                        <WeatherWidget />
                    </View>

                    {/* Ecosystem Grid */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t.ecosystemTitle}</Text>
                    </View>

                    <View style={styles.gridContainer}>
                        {features.map((item, index) => {
                            let title, desc;
                            if (item.id === 'disease') { title = t.tools.crop; desc = t.tools.cropDesc; }
                            else if (item.id === 'fertilizer') { title = t.tools.fert; desc = t.tools.fertDesc; }
                            else if (item.id === 'guide') { title = t.tools.guide; desc = t.tools.guideDesc; }
                            else { title = t.tools.market; desc = t.tools.marketDesc; }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.gridItem}
                                    onPress={() => router.push(item.link as any)}
                                    activeOpacity={0.9}
                                >
                                    <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                                        <Ionicons name={item.icon as any} size={28} color={item.color} />
                                    </View>
                                    <Text style={styles.gridTitle}>{title}</Text>
                                    <Text style={styles.gridDesc}>{desc}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Notices Section */}
                    {notices.length > 0 && (
                        <View style={styles.noticesSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t.noticesTitle}</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.noticesList}>
                                {notices.map((notice, index) => (
                                    <TouchableOpacity key={index} style={styles.noticeCard}>
                                        <View style={styles.noticeIcon}>
                                            <Ionicons name="newspaper-outline" size={20} color="#059669" />
                                        </View>
                                        <Text numberOfLines={2} style={styles.noticeTitle}>{notice.title}</Text>
                                        <Text style={styles.noticeDate}>{new Date(notice.date).toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Community Banner */}
                    <TouchableOpacity
                        style={styles.bannerContainer}
                        onPress={() => router.push('/(tabs)/explore')}
                        activeOpacity={0.95}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>{t.communityTitle}</Text>
                                <View style={styles.bannerButton}>
                                    <Text style={styles.bannerBtnText}>{t.communityBtn}</Text>
                                </View>
                            </View>
                            <Ionicons name="people-circle" size={100} color="rgba(255,255,255,0.15)" style={styles.bannerIcon} />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* How It Works - Green Block */}
                    <View style={styles.howItWorksBlock}>
                        <Text style={styles.hiwTitle}>{t.howItWorks}</Text>
                        <View style={styles.stepsContainer}>
                            {t.steps.map((step, i) => (
                                <View key={i} style={styles.stepWrapper}>
                                    <View style={styles.stepNumContainer}>
                                        <Text style={styles.stepNum}>{i + 1}</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>{step.title}</Text>
                                        <Text style={styles.stepDesc}>{step.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.footerDivider} />
                        <Text style={styles.footerText}>{t.footerTag}</Text>
                        <Text style={styles.copyrightText}>© 2026 Krishi Sahayogi</Text>
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
    heroContainer: {
        height: 540,
        width: '100%',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 16,
    },
    logoIconBg: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
        marginRight: 4,
    },
    langButton: {
        padding: 4,
    },
    langIconBg: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    langIconText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    heroContent: {
        marginTop: 20,
    },
    heroTitle: {
        fontSize: 44,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 16,
        lineHeight: 52,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#e2e8f0',
        marginBottom: 32,
        lineHeight: 26,
        maxWidth: '90%',
    },
    actionButtons: {
        flexDirection: 'column',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#ecfdf5', // Light emerald tint for button
        paddingVertical: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        color: '#064e3b',
        fontSize: 16,
        fontWeight: '800',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    sheetContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        marginTop: -30, // Reduced overlap
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 24, // Added padding to separate from overlap
        paddingBottom: 40,
    },
    weatherSection: {
        marginTop: 0, // Removed negative margin
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1f2937',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    gridItem: {
        width: (width - 56) / 2,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 4,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 6,
    },
    gridDesc: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    noticesSection: {
        marginBottom: 32,
    },
    noticesList: {
        gap: 12,
        paddingHorizontal: 2,
    },
    noticeCard: {
        backgroundColor: '#fff',
        width: 200,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 4,
    },
    noticeIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#ecfdf5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    noticeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
        height: 40,
    },
    noticeDate: {
        fontSize: 12,
        color: '#9ca3af',
    },
    bannerContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        elevation: 4,
    },
    bannerGradient: {
        padding: 24,
        position: 'relative',
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerContent: {
        flex: 1,
        zIndex: 1,
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 12,
    },
    bannerButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    bannerBtnText: {
        color: '#059669',
        fontWeight: '700',
        fontSize: 12,
    },
    bannerIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.6,
    },
    howItWorksBlock: {
        backgroundColor: '#064e3b',
        borderRadius: 32,
        padding: 24,
        marginBottom: 20,
    },
    hiwTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    stepsContainer: {
        gap: 16,
    },
    stepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    stepNumContainer: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepNum: {
        color: '#064e3b',
        fontWeight: '800',
        fontSize: 14,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    stepDesc: {
        fontSize: 12,
        color: '#a7f3d0',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerDivider: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 11,
        color: '#94a3b8',
    },
});
