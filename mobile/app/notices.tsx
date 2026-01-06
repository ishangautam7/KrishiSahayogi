import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Platform,
    RefreshControl,
    Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';

// Interface matching actual API response structure
interface Notice {
    source?: string;
    type: string;
    title: string;
    link: string;
    date: string;
    is_subsidy?: boolean;
}

export default function NoticesScreen() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const filters = [
        { id: 'all', label: 'All', icon: 'list-outline' },
        { id: 'subsidy_details', label: 'Subsidies', icon: 'cash-outline' },
        { id: 'notice', label: 'Notices', icon: 'megaphone-outline' },
        { id: 'form', label: 'Forms', icon: 'document-text-outline' },
    ];

    const filteredNotices = selectedFilter === 'all'
        ? notices
        : notices.filter(n => n.type === selectedFilter || (selectedFilter === 'subsidy_details' && n.is_subsidy));

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getNotices();
            // Handle both formats: array directly or wrapped in {success, data}
            let noticesData: Notice[] = [];
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                noticesData = response.data.data;
            } else if (Array.isArray(response.data)) {
                noticesData = response.data;
            }
            setNotices(noticesData);
        } catch (err) {
            console.error(err);
            setError('Failed to load notices');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotices();
        setRefreshing(false);
    };

    const getTypeColor = (type: string, isSubsidy?: boolean) => {
        if (isSubsidy) return '#10b981'; // Green for subsidy
        switch (type) {
            case 'subsidy_details': return '#10b981';
            case 'notice': return '#3b82f6';
            case 'form': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'subsidy_details': return 'cash-outline';
            case 'notice': return 'megaphone-outline';
            case 'form': return 'document-text-outline';
            default: return 'information-circle-outline';
        }
    };

    const getSourceLabel = (source?: string) => {
        if (!source) return 'General';
        switch (source) {
            case 'DOA': return 'Dept. of Agriculture';
            case 'AITC': return 'AITC Nepal';
            default: return source;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const handleNoticePress = (link: string) => {
        Linking.openURL(link).catch(err => console.error('Failed to open link:', err));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agricultural Notices</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[
                                styles.filterTab,
                                selectedFilter === filter.id && styles.filterTabActive
                            ]}
                            onPress={() => setSelectedFilter(filter.id)}
                        >
                            <Ionicons
                                name={filter.icon as any}
                                size={16}
                                color={selectedFilter === filter.id ? '#fff' : '#64748b'}
                            />
                            <Text style={[
                                styles.filterText,
                                selectedFilter === filter.id && styles.filterTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
                }
            >
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text style={styles.loadingText}>Loading notices...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={48} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadNotices}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredNotices.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="newspaper-outline" size={64} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No notices available</Text>
                    </View>
                ) : (
                    filteredNotices.map((notice, index) => (
                        <TouchableOpacity
                            key={`${notice.title}-${index}`}
                            style={styles.noticeCard}
                            onPress={() => handleNoticePress(notice.link)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.noticeHeader}>
                                <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(notice.type, notice.is_subsidy)}15` }]}>
                                    <Ionicons
                                        name={getTypeIcon(notice.type) as any}
                                        size={14}
                                        color={getTypeColor(notice.type, notice.is_subsidy)}
                                    />
                                    <Text style={[styles.typeText, { color: getTypeColor(notice.type, notice.is_subsidy) }]}>
                                        {notice.type.replace('_', ' ')}
                                    </Text>
                                </View>
                                <Text style={styles.dateText}>{formatDate(notice.date)}</Text>
                            </View>

                            <Text style={styles.noticeTitle}>{notice.title}</Text>

                            <View style={styles.noticeFooter}>
                                <View style={styles.sourceContainer}>
                                    <Ionicons name="business-outline" size={12} color="#9ca3af" />
                                    <Text style={styles.sourceText}>{getSourceLabel(notice.source)}</Text>
                                </View>
                                <Ionicons name="open-outline" size={16} color="#10b981" />
                            </View>

                            {notice.is_subsidy && (
                                <View style={styles.subsidyIndicator}>
                                    <Ionicons name="cash" size={14} color="#10b981" />
                                    <Text style={styles.subsidyText}>Subsidy Related</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    filterScroll: {
        gap: 8,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 6,
    },
    filterTabActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    filterTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
        fontWeight: '600',
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#10b981',
        borderRadius: 12,
    },
    retryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '500',
    },
    noticeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    noticeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    dateText: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
    },
    noticeTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
        lineHeight: 22,
    },
    noticeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sourceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sourceText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    subsidyIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        gap: 6,
    },
    subsidyText: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '600',
    },
});
