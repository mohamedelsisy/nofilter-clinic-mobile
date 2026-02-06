# 🎨 Cairo Font Usage Guide

## Overview

The app now uses **Cairo font** for Arabic text and system default fonts for English. The Cairo font provides excellent Arabic readability and modern aesthetics.

---

## 📦 Installed Fonts

Located in: `assets/fonts/`

- **Cairo-Regular.ttf** - For normal text
- **Cairo-Medium.ttf** - For medium weight text
- **Cairo-SemiBold.ttf** - For semi-bold text
- **Cairo-Bold.ttf** - For bold text

---

## 🎯 How to Use

### Method 1: Using the `useFontFamily` Hook (Recommended)

```tsx
import { useFontFamily } from '@/utils/fonts';
import { useLanguageStore } from '@/store/languageStore';

function MyComponent() {
  const fonts = useFontFamily();
  const { language } = useLanguageStore();

  return (
    <View>
      <Text style={{ fontFamily: fonts.regular }}>Regular Text</Text>
      <Text style={{ fontFamily: fonts.medium }}>Medium Text</Text>
      <Text style={{ fontFamily: fonts.semibold }}>SemiBold Text</Text>
      <Text style={{ fontFamily: fonts.bold }}>Bold Text</Text>
    </View>
  );
}
```

### Method 2: Using `getFontFamily` Function

```tsx
import { getFontFamily } from '@/utils/fonts';
import { useLanguageStore } from '@/store/languageStore';

function MyComponent() {
  const { language } = useLanguageStore();

  return (
    <Text style={styles.title}>Title</Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: getFontFamily('bold', language), // or use directly in component
  },
});
```

### Method 3: Using StyleSheet with Dynamic Styles

```tsx
import { useFontFamily } from '@/utils/fonts';
import { useLanguageStore } from '@/store/languageStore';

function MyComponent() {
  const fonts = useFontFamily();
  const { language } = useLanguageStore();

  const dynamicStyles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontFamily: fonts.bold,
      color: '#333',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: fonts.medium,
      color: '#666',
    },
    body: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: '#333',
    },
  });

  return (
    <View>
      <Text style={dynamicStyles.title}>عنوان / Title</Text>
      <Text style={dynamicStyles.subtitle}>عنوان فرعي / Subtitle</Text>
      <Text style={dynamicStyles.body}>نص عادي / Regular text</Text>
    </View>
  );
}
```

### Method 4: Using with Existing Styles

```tsx
import { useFontFamily } from '@/utils/fonts';

function MyComponent() {
  const fonts = useFontFamily();

  return (
    <Text style={[styles.text, { fontFamily: fonts.regular }]}>
      Text with Cairo font in Arabic
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
    // fontFamily will be overridden by dynamic font
  },
});
```

---

## 🎨 Font Weight Mapping

| Weight | Cairo Font | Use Case |
|--------|-----------|----------|
| **Regular** | `Cairo-Regular` | Body text, paragraphs, descriptions |
| **Medium** | `Cairo-Medium` | Subheadings, labels, buttons |
| **SemiBold** | `Cairo-SemiBold` | Section titles, emphasis |
| **Bold** | `Cairo-Bold` | Headings, titles, important text |

---

## ✨ Example: Complete Screen with Cairo Font

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFontFamily } from '@/utils/fonts';
import { useTranslation } from 'react-i18next';

export default function ExampleScreen() {
  const { t } = useTranslation();
  const fonts = useFontFamily();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.title, { fontFamily: fonts.bold }]}>
        {t('welcome')}
      </Text>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { fontFamily: fonts.semibold }]}>
        {t('subtitle_text')}
      </Text>

      {/* Body */}
      <Text style={[styles.body, { fontFamily: fonts.regular }]}>
        {t('body_text')}
      </Text>

      {/* Button Text */}
      <View style={styles.button}>
        <Text style={[styles.buttonText, { fontFamily: fonts.medium }]}>
          {t('action_button')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#0d525a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#0d525a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});
```

---

## 🔄 How It Works

1. **Language Detection**: The `useFontFamily` hook checks the current language from `useLanguageStore`
2. **Font Selection**: 
   - If language is Arabic (`ar`), it returns Cairo font names
   - If language is English (`en`), it returns `undefined` (uses system default)
3. **Automatic Updates**: When user switches language, components re-render with correct fonts

---

## 🚀 Quick Start

### Update Existing Component:

**Before:**
```tsx
<Text style={styles.title}>العنوان</Text>
```

**After:**
```tsx
const fonts = useFontFamily();

<Text style={[styles.title, { fontFamily: fonts.bold }]}>العنوان</Text>
```

---

## 📝 Best Practices

1. **Always use the hook** for dynamic font selection
2. **Match font weights** to visual hierarchy:
   - Bold for H1/main titles
   - SemiBold for H2/section titles  
   - Medium for H3/labels/buttons
   - Regular for body text
3. **Keep line height** slightly larger for Arabic (1.5-1.8)
4. **Test in both languages** to ensure proper rendering

---

## 🎯 Next Steps

The Cairo font is now loaded and ready to use! To apply it across your app:

1. Update main screens (Home, Services, Offers, etc.)
2. Update authentication screens (Login, Register)
3. Update navigation labels
4. Update form inputs and buttons

---

## 🔍 Troubleshooting

### Font not displaying?
- Check that fonts are loaded: `const [fontsLoaded] = useFonts(...)`
- Verify font files exist in `assets/fonts/`
- Check console for font loading errors

### English text looks different?
- This is expected! English uses system default fonts
- Only Arabic text uses Cairo font

### Font too light/heavy?
- Adjust the weight: Use `fonts.semibold` instead of `fonts.regular`
- Or use different Cairo variant

---

## ✅ Summary

- ✅ Cairo font installed for Arabic
- ✅ 4 font weights available (Regular, Medium, SemiBold, Bold)
- ✅ Dynamic font selection based on language
- ✅ Easy-to-use hooks and utilities
- ✅ Automatic language switching support
- ✅ System default for English (no extra fonts needed)

Enjoy beautiful Arabic typography! 🎉
