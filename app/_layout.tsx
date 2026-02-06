import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import i18n from '@/utils/i18n';
import { useLanguageStore } from '@/store/languageStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('❌ App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>⚠️ App Error</Text>
          <Text style={errorStyles.subtitle}>Something went wrong</Text>
          <ScrollView style={errorStyles.errorScroll}>
            <Text style={errorStyles.errorText}>
              {this.state.error.toString()}
            </Text>
            <Text style={errorStyles.stackText}>
              {this.state.error.stack}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={errorStyles.button}
            onPress={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            <Text style={errorStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorScroll: {
    maxHeight: 300,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  stackText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#0d525a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Create a client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 60 * 1000, // 1 minute for most data
      gcTime: 5 * 60 * 1000, // 5 minutes cache
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
    },
  },
});

function AppContent() {
  const { language, setLanguage } = useLanguageStore();
  const [isReady, setIsReady] = useState(false);

  // Load Cairo fonts for Arabic
  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': require('../assets/fonts/Cairo-Regular.ttf'),
    'Cairo-Medium': require('../assets/fonts/Cairo-Medium.ttf'),
    'Cairo-SemiBold': require('../assets/fonts/Cairo-SemiBold.ttf'),
    'Cairo-Bold': require('../assets/fonts/Cairo-Bold.ttf'),
  });

  // Log font loading status
  console.log('📝 Fonts loaded:', fontsLoaded);
  console.log('❌ Font error:', fontError);

  useEffect(() => {
    // Initialize language and RTL
    const initLanguage = async () => {
      try {
        await setLanguage(language);
        await i18n.changeLanguage(language);
        console.log('✅ Language initialized:', language);
        setIsReady(true);
      } catch (error) {
        console.error('❌ Language init error:', error);
        setIsReady(true); // Still show app even if language fails
      }
    };
    initLanguage();
  }, []);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReady]);

  // Show error if fonts failed to load
  useEffect(() => {
    if (fontError) {
      console.error('❌ Font loading error:', fontError);
      console.error('Font error details:', JSON.stringify(fontError, null, 2));
      // Still hide splash and show app with default fonts
      SplashScreen.hideAsync();
    }
  }, [fontError]);

  // If fonts failed but app is ready, still show app
  if ((!fontsLoaded && !fontError) && !isReady) {
    return null; // Splash screen is visible
  }

  // If there's a font error but app is ready, proceed without custom fonts
  if (fontError && isReady) {
    console.warn('⚠️ App running without Cairo fonts due to loading error');
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AppContent />
        </I18nextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
