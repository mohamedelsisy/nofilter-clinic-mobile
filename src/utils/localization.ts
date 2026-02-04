import { useLanguageStore } from '@/store/languageStore';

/**
 * Helper function to get localized field value based on current language
 * @param arValue - Arabic value
 * @param enValue - English value
 * @returns The value matching the current language
 */
export const tField = (arValue: string | undefined, enValue: string | undefined): string => {
  const language = useLanguageStore.getState().language;
  
  if (language === 'ar') {
    return arValue || enValue || '';
  }
  
  return enValue || arValue || '';
};

/**
 * React hook version of tField for use in components
 */
export const useTField = () => {
  const { language } = useLanguageStore();
  
  return (arValue: string | undefined, enValue: string | undefined): string => {
    if (language === 'ar') {
      return arValue || enValue || '';
    }
    
    return enValue || arValue || '';
  };
};
