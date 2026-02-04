import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { I18nManager } from 'react-native';
import i18n from '@/utils/i18n';
import { useLanguageStore } from '@/store/languageStore';

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

export default function RootLayout() {
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    // Initialize language and RTL
    const initLanguage = async () => {
      await setLanguage(language);
      i18n.changeLanguage(language);
    };
    initLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
        </Stack>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
