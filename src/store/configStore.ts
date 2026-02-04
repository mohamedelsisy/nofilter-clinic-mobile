import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/api/types';

interface ConfigState {
  settings: AppSettings | null;
  apiBaseUrl: string;
  primaryColor: string;
  setSettings: (settings: AppSettings) => void;
  setApiBaseUrl: (url: string) => void;
  getThemeColor: () => string;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      settings: null,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
      primaryColor: '#0d525a',

      setSettings: (settings: AppSettings) => {
        set({ 
          settings,
          primaryColor: settings?.primary_color || '#0d525a'
        });
      },

      setApiBaseUrl: (url: string) => {
        set({ apiBaseUrl: url });
      },

      getThemeColor: () => {
        const settings = get().settings;
        return settings?.primary_color || '#0d525a';
      },
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
