import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

export type Language = 'ar' | 'en';

interface LanguageState {
  language: Language;
  isRTL: boolean;
  setLanguage: (language: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'ar', // Default to Arabic
      isRTL: true,

      setLanguage: async (language: Language) => {
        const isRTL = language === 'ar';
        
        // Update RTL setting if it changed
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.forceRTL(isRTL);
          I18nManager.allowRTL(isRTL);
        }

        set({
          language,
          isRTL,
        });
      },

      toggleLanguage: async () => {
        const currentLanguage = get().language;
        const newLanguage: Language = currentLanguage === 'ar' ? 'en' : 'ar';
        await get().setLanguage(newLanguage);
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
