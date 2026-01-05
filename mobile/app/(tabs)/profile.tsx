import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logout());
            router.replace('/');
        } catch (error) {
            Alert.alert('Error', 'Failed to logout');
        }
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>
                <View style={styles.centerContainer}>
                    <Ionicons name="person-circle-outline" size={80} color="#d1d5db" />
                    <Text style={styles.guestText}>Please login to view your profile</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{user?.farmerType || 'Farmer'}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>

                <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="location-outline" size={20} color="#6b7280" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoValue}>{user?.location || 'Not set'}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="call-outline" size={20} color="#6b7280" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Phone</Text>
                        <Text style={styles.infoValue}>+977 9800000000</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color="#1f2937" />
                    <Text style={styles.menuText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="language-outline" size={24} color="#1f2937" />
                    <Text style={styles.menuText}>Language</Text>
                    <Text style={styles.menuRightText}>English</Text>
                    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="moon-outline" size={24} color="#1f2937" />
                    <Text style={styles.menuText}>Dark Mode</Text>
                    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
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
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    guestText: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 16,
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ecfdf5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#10b981',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#10b981',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 12,
    },
    badge: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: '#4f46e5',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    infoValue: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        marginLeft: 16,
    },
    menuRightText: {
        fontSize: 14,
        color: '#6b7280',
        marginRight: 8,
    },
    logoutButton: {
        margin: 20,
        backgroundColor: '#fee2e2',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    version: {
        textAlign: 'center',
        color: '#d1d5db',
        fontSize: 12,
        marginBottom: 40,
    },
});
