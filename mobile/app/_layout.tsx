import { useEffect } from 'react';
import { View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store/store';
import { loadUser } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="crop-recommendation" options={{ headerShown: false }} />
            <Stack.Screen name="fertilizer-prediction" options={{ headerShown: false }} />
            <Stack.Screen name="disease-detection" options={{ headerShown: false }} />
          </Stack>
          <Navbar />
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
