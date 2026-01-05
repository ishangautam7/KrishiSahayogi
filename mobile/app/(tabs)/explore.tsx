import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { router } from 'expo-router';

interface Farmer {
    _id: string;
    name: string;
    farmerType: string;
    location: string;
    primaryCrops?: string[] | string;
}

export default function NetworkScreen() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const fetchFarmers = async () => {
        try {
            // In a real app, we might use different endpoints or params based on auth
            const response = await api.getUsers();
            setFarmers(response.data.farmers || []);
        } catch (error) {
            console.error('Failed to fetch farmers', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchFarmers();
    };

    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = farmer.location.toLowerCase().includes(locationQuery.toLowerCase());
        const matchesType = selectedType === 'All' || farmer.farmerType.toLowerCase() === selectedType.toLowerCase();
        return matchesSearch && matchesLocation && matchesType;
    });

    const renderFarmer = ({ item }: { item: Farmer }) => {
        const crops = Array.isArray(item.primaryCrops)
            ? item.primaryCrops
            : typeof item.primaryCrops === 'string'
                ? [item.primaryCrops]
                : [];

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={24} color="#10b981" />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.farmerName}>{item.name}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={14} color="#6b7280" />
                            <Text style={styles.locationText}>{item.location}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tagsContainer}>
                    <View style={[styles.tag, styles.typeTag]}>
                        <Text style={styles.typeTagText}>{item.farmerType}</Text>
                    </View>
                    {crops.slice(0, 3).map((crop, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{crop}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => router.push(`/messages/${item._id}`)}
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                    <Text style={styles.chatButtonText}>Start Conversation</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const farmerTypes = ["All", "Subsistence", "Commercial", "Hobbyist", "Student"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Farmer Network</Text>
                <Text style={styles.subtitle}>Connect with local experts</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#9ca3af" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search farmers..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={[styles.searchBar, { marginTop: 8 }]}>
                    <Ionicons name="location-outline" size={20} color="#9ca3af" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Filter by location..."
                        value={locationQuery}
                        onChangeText={setLocationQuery}
                    />
                </View>

                <FlatList
                    data={farmerTypes}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.typeList}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                selectedType === item && styles.typeButtonActive
                            ]}
                            onPress={() => setSelectedType(item)}
                        >
                            <Text style={[
                                styles.typeButtonText,
                                selectedType === item && styles.typeButtonTextActive
                            ]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#10b981" />
                </View>
            ) : (
                <FlatList
                    data={filteredFarmers}
                    renderItem={renderFarmer}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No farmers found</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1f2937',
    },
    typeList: {
        paddingVertical: 12,
        gap: 8,
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
    },
    typeButtonActive: {
        backgroundColor: '#10b981',
    },
    typeButtonText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    typeButtonTextActive: {
        color: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ecfdf5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    farmerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    typeTag: {
        backgroundColor: '#ecfdf5',
    },
    tagText: {
        fontSize: 12,
        color: '#4b5563',
    },
    typeTagText: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '600',
    },
    chatButton: {
        backgroundColor: '#1f2937',
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9ca3af',
    },
});
