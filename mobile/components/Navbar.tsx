import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const navItems = [
    {
      name: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
      route: '/',
      isActive: pathname === '/' || pathname === '/dashboard'
    },
    {
      name: 'Market',
      icon: 'cart-outline',
      activeIcon: 'cart',
      route: '/(tabs)/marketplace',
      isActive: pathname.includes('marketplace')
    },
    {
      name: 'Disease',
      icon: 'camera-outline',
      activeIcon: 'camera',
      route: '/disease-detection',
      isActive: pathname.includes('disease'),
      isMiddle: true
    },
    {
      name: 'Network',
      icon: 'people-outline',
      activeIcon: 'people',
      route: '/(tabs)/explore',
      isActive: pathname.includes('explore') || pathname.includes('network')
    },
    {
      name: isAuthenticated ? 'Profile' : 'Login',
      icon: isAuthenticated ? 'person-outline' : 'log-in-outline',
      activeIcon: isAuthenticated ? 'person' : 'log-in',
      route: isAuthenticated ? '/(tabs)/profile' : '/login',
      isActive: pathname.includes('profile') || pathname.includes('login')
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, item.isMiddle && styles.middleItem]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer, 
              item.isMiddle && styles.middleIconContainer,
              item.isActive && !item.isMiddle && styles.activeIconContainer
            ]}>
              <Ionicons
                name={(item.isActive ? item.activeIcon : item.icon) as any}
                size={item.isMiddle ? 32 : 24}
                color={item.isMiddle ? '#fff' : item.isActive ? '#10b981' : '#6b7280'}
              />
            </View>
            {!item.isMiddle && (
              <Text style={[styles.navText, item.isActive && styles.activeText]}>
                {item.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  middleItem: {
    top: -20,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    marginBottom: 4,
  },
  activeIconContainer: {
    // Optional: Add background for active state if needed
  },
  middleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeText: {
    color: '#10b981',
    fontWeight: '600',
  },
});
