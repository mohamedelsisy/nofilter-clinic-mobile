# IMCKSA Patient App - Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure Environment

The `.env` file is already created with a default API URL. Update it if needed:

```bash
EXPO_PUBLIC_API_BASE_URL=http://your-server-ip:8000/api
```

For local development:
- iOS Simulator: `http://localhost:8000/api`
- Android Emulator: `http://10.0.2.2:8000/api`
- Physical Device: Use your computer's IP address

### 3. Start Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

### 4. Run on Device

**Option A: Expo Go App (Easiest)**
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code from the terminal

**Option B: iOS Simulator** (Mac only)
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

## 📱 App Features

### ✅ Currently Implemented

1. **Home Screen**
   - Dynamic sliders/banners
   - Featured services
   - Doctor listings
   - Latest offers
   - Blog posts preview
   - Language switcher (Arabic/English)

2. **Core Infrastructure**
   - API client with interceptors
   - Authentication ready (Sanctum Bearer)
   - Language management (AR/EN with RTL support)
   - Settings management
   - Error handling with retry
   - Loading states
   - Type-safe API calls

3. **Bottom Tab Navigation**
   - Home
   - Services (placeholder)
   - Appointments (placeholder)
   - Profile (placeholder)

### 🔨 To Be Built

- Services list and details
- Offers page
- Doctors details
- Blog/Posts
- Booking flow
- Appointments management
- Invoices
- Cart & Checkout
- Loyalty points
- User profile
- Authentication screens (login/register)

## 🏗 Architecture Overview

### File Structure

```
mobile-app/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx        # Root layout (providers)
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx   # Tabs config
│       └── index.tsx     # Home screen
│
├── src/
│   ├── api/               # API layer
│   │   ├── client.ts     # Axios instance
│   │   ├── endpoints.ts  # API functions
│   │   └── types.ts      # TypeScript types
│   │
│   ├── store/             # State management (Zustand)
│   │   ├── authStore.ts  # Auth state (token, user)
│   │   ├── languageStore.ts # Language/RTL
│   │   └── configStore.ts   # App settings
│   │
│   ├── components/        # Reusable UI components
│   │   ├── LoadingScreen.tsx
│   │   ├── ErrorView.tsx
│   │   ├── ServiceCard.tsx
│   │   └── DoctorCard.tsx
│   │
│   └── utils/
│       └── i18n.ts       # i18next config
```

### State Management

**Zustand Stores:**

1. **authStore** - User authentication
   ```ts
   { token, user, isAuthenticated, setAuth, logout }
   ```

2. **languageStore** - Localization
   ```ts
   { language, isRTL, setLanguage, toggleLanguage }
   ```

3. **configStore** - App configuration
   ```ts
   { settings, apiBaseUrl, setSettings, getThemeColor }
   ```

### API Client

- Axios instance with interceptors
- Automatic auth header injection
- Automatic language header
- 401 auto-logout
- Network error handling
- TypeScript types for all endpoints

### Localization

- **Default Language:** Arabic (RTL)
- **Supported:** Arabic, English
- **Switch:** Header button in Home screen
- **i18next** for translations

## 🔧 Development Tips

### API Testing

The Home screen requires these endpoints:

```
GET /site/homepage
GET /site/settings
```

Make sure your Laravel backend is running and accessible.

### Check API Connection

Update the base URL in `.env` to match your backend:

```bash
# For iOS Simulator
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api

# For Android Emulator
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api

# For Physical Device (replace with your machine's IP)
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000/api
```

### Hot Reload

- Save any file to see changes instantly
- Shake device or press `R` to reload manually

### Debug Menu

- iOS: `Cmd+D` (simulator) or shake device
- Android: `Cmd+M` or `Ctrl+M` or shake device

## 🐛 Troubleshooting

### "Network request failed"

1. Check API URL in `.env`
2. Ensure backend is running
3. Use correct IP for device type:
   - Simulator: `localhost`
   - Android Emulator: `10.0.2.2`
   - Physical device: Your computer's network IP

### "Module not found"

```bash
npm install
npx expo start --clear
```

### RTL Issues

The app automatically switches to RTL when Arabic is selected. If layout looks wrong:
- Restart the app after language change
- Check `I18nManager.isRTL` is working

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npx expo start --clear
```

## 📦 Building for Production

### Android APK

```bash
eas build --platform android
```

### iOS IPA

```bash
eas build --platform ios
```

*Note: EAS Build requires an Expo account (free)*

## 🎨 Customization

### Theme Color

The app uses `#0d525a` as the primary theme color. This is:
- Configurable via API settings
- Stored in `configStore`
- Applied to buttons, tabs, headers

### Adding Translations

Edit `src/utils/i18n.ts` and add keys to both `ar` and `en`:

```typescript
const resources = {
  ar: {
    translation: {
      my_key: 'النص بالعربية',
    },
  },
  en: {
    translation: {
      my_key: 'Text in English',
    },
  },
};
```

### Adding API Endpoints

1. Add types in `src/api/types.ts`
2. Add function in `src/api/endpoints.ts`
3. Use with React Query:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['myKey'],
  queryFn: myApi.getMyData,
});
```

## 📖 Next Steps

1. **Test the Home screen** - Ensure it loads data from your backend
2. **Build Services screen** - List and detail views
3. **Implement authentication** - Login/register screens
4. **Add booking flow** - Appointment scheduling
5. **Build remaining screens** - According to requirements

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review README.md
3. Check API responses in network tab
4. Verify backend endpoints are working

## 🎯 Current Status

**✅ COMPLETED:**
- Project structure
- API client with interceptors
- Zustand stores (auth, language, config)
- i18next localization
- React Query setup
- Home screen with API integration
- Error handling and loading states
- Bottom tab navigation

**⏳ WAITING FOR NEXT INSTRUCTION:**
- Additional screens as per your requirements

The foundation is solid and production-ready. Ready to build the next feature when you are! 🚀
