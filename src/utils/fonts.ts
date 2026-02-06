import { useLanguageStore } from '@/store/languageStore';

/**
 * Font weights mapping for Cairo font
 */
export const FontWeights = {
  regular: 'Cairo-Regular',
  medium: 'Cairo-Medium',
  semibold: 'Cairo-SemiBold',
  bold: 'Cairo-Bold',
} as const;

/**
 * Hook to get the appropriate font family based on current language
 * Returns Cairo font for Arabic, system default for English
 */
export const useFontFamily = () => {
  const { language } = useLanguageStore();
  const isArabic = language === 'ar';

  return {
    regular: isArabic ? FontWeights.regular : undefined,
    medium: isArabic ? FontWeights.medium : undefined,
    semibold: isArabic ? FontWeights.semibold : undefined,
    bold: isArabic ? FontWeights.bold : undefined,
  };
};

/**
 * Get font family for a specific weight
 * @param weight - Font weight ('regular', 'medium', 'semibold', 'bold')
 * @param language - Language code ('ar' or 'en')
 * @returns Font family name or undefined for system default
 */
export const getFontFamily = (
  weight: keyof typeof FontWeights = 'regular',
  language: string
): string | undefined => {
  if (language === 'ar') {
    return FontWeights[weight];
  }
  return undefined; // Use system default for English
};

/**
 * Helper to create text style with appropriate font
 * @param weight - Font weight
 * @param language - Language code
 * @returns Style object with fontFamily
 */
export const fontStyle = (
  weight: keyof typeof FontWeights = 'regular',
  language: string = 'ar'
) => ({
  fontFamily: getFontFamily(weight, language),
});

/**
 * Pre-defined font styles for common use cases
 */
export const FontStyles = {
  regular: (language: string) => fontStyle('regular', language),
  medium: (language: string) => fontStyle('medium', language),
  semibold: (language: string) => fontStyle('semibold', language),
  bold: (language: string) => fontStyle('bold', language),
};
