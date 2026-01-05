import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUser } from '@/store/slices/authSlice';

export default function HomeScreen() {
  const rootNavigationState = useRootNavigationState();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  useEffect(() => {
    const isNavigationReady = rootNavigationState?.key;
    if (isNavigationReady && !isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, rootNavigationState?.key]);

  const features = [
    {
      title: 'Crop Recommendation',
      subtitle: 'ML-powered crop suggestions',
      icon: 'leaf',
      color: '#10b981',
      route: '/crop-recommendation',
    },
    {
      title: 'Fertilizer Prediction',
      subtitle: 'Optimal fertilizer for your soil',
      icon: 'flask',
      color: '#3b82f6',
      route: '/fertilizer-prediction',
    },
    {
      title: 'Disease Detection',
      subtitle: 'Identify plant diseases',
      icon: 'bug',
      color: '#ef4444',
      route: '/disease-detection',
    },
    {
      title: 'Plantation Guide',
      subtitle: 'Expert cultivation advice',
      icon: 'book',
      color: '#8b5cf6',
      route: '/plantation-guide',
    },
    {
      title: 'Community Network',
      subtitle: 'Connect with farmers',
      icon: 'people',
      color: '#ec4899',
      route: '/(tabs)/explore',
    },
    {
      title: 'Marketplace',
      subtitle: 'Buy & sell products',
      icon: 'cart',
      color: '#f59e0b',
      route: '/(tabs)/marketplace',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
        </View>
        <Ionicons name="notifications-outline" size={28} color="#1f2937" />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => router.push(feature.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
              <Ionicons name={feature.icon as any} size={28} color={feature.color} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
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
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
