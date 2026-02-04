# Nofilter Clinic Patient App

A production-ready React Native mobile application built with Expo for Nofilter Clinic (Patient/Public App).

## 📱 App Overview

This is the **Patient/Public App** that allows users to:
- Browse services, offers, doctors, and blog posts
- Book appointments (with auto-registration)
- Manage appointments and view invoices
- Add offers to cart and checkout
- Track loyalty points
- Contact the clinic

**Note:** This is NOT the staff dashboard app.

## 🛠 Tech Stack

- **Expo SDK** (latest) - React Native framework
- **TypeScript** - Type safety
- **expo-router** - File-based routing
- **Axios** - API client with interceptors
- **TanStack Query (React Query)** - Server state management, caching, pagination
- **Zustand** - Client state management (auth, language, config)
- **react-hook-form + zod** - Form handling and validation
- **i18next + react-i18next** - Internationalization (Arabic/English with RTL)
- **expo-secure-store** - Secure token storage
- **expo-web-browser** - Payment redirect handling
- **expo-file-system + expo-sharing** - PDF download and sharing
- **@expo/vector-icons** - Icon library

## 🌍 Features

### ✅ Implemented (Steps 1-4)

1. **Project Setup**
   - Expo app scaffolded with TypeScript
   - All dependencies installed
   - expo-router configured
   - Environment variables setup

2. **Localization (i18n)**
   - Arabic (RTL) default language
   - English (LTR) support
   - Language switcher
   - Persisted language preference
   - RTL layout using I18nManager

3. **API Client & State Management**
   - Axios client with interceptors
   - Auto-inject Bearer token
   - Auto-inject Accept-Language header
   - Normalized error handling (AppError type)
   - 401 auto-logout
   - 422 validation error handling
   - Zustand stores: authStore, languageStore, configStore
   - React Query provider with proper config

4. **Home Screen**
   - Fetches `GET /site/homepage`
   - Fetches `GET /site/settings`
   - Displays sliders/banners
   - Shows featured services
   - Lists doctors
   - Shows latest offers
   - Loading states with skeleton
   - Error handling with retry button
   - Language switcher in header
   - Clinic branding (logo, name, colors)

### ⏳ To Be Implemented (Steps 5-10)

- **Step 5:** Services list + details
- **Step 6:** Booking flow (departments → doctors → slots → submit)
- **Step 7:** Offers list + details
- **Step 8:** Cart + Checkout + payment redirect
- **Step 9:** Blog list + details + comments
- **Step 10:** Account area (appointments, invoices, points, PDFs, contact)

## 📂 Project Structure

```
mobile-app/
├── app/                         # Routes (expo-router)
│   ├── _layout.tsx             # Root layout with providers
│   └── (tabs)/                 # Bottom tab navigation
│       ├── _layout.tsx        # Tab configuration
│       ├── index.tsx          # ✅ Home screen
│       ├── services.tsx       # Placeholder
│       ├── offers.tsx         # Placeholder
│       ├── booking.tsx        # Placeholder
│       └── account.tsx        # Placeholder
│
├── src/
│   ├── api/                    # API layer
│   │   ├── client.ts          # ✅ Axios instance with interceptors
│   │   ├── endpoints.ts       # ✅ API endpoint functions
│   │   ├── types.ts           # ✅ TypeScript types
│   │   └── index.ts           # Barrel export
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts       # ✅ Auth state (token, user)
│   │   ├── languageStore.ts   # ✅ Language/RTL state
│   │   └── configStore.ts     # ✅ App configuration
│   │
│   ├── components/             # Reusable UI components
│   │   ├── LoadingScreen.tsx  # ✅ Loading indicator
│   │   ├── ErrorView.tsx      # ✅ Error with retry
│   │   ├── ServiceCard.tsx    # ✅ Service card
│   │   ├── DoctorCard.tsx     # ✅ Doctor card
│   │   └── index.ts           # Barrel export
│   │
│   ├── utils/                  # Helper functions
│   │   ├── i18n.ts            # ✅ i18next configuration
│   │   └── errors.ts          # ✅ Error normalization
│   │
│   ├── features/               # Domain-specific modules (TBD)
│   └── i18n/                   # Additional translations (TBD)
│
├── assets/                      # Images, fonts, etc.
├── .env                         # Environment variables (gitignored)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── app.json                     # Expo config
├── babel.config.js              # Babel with module resolver
├── metro.config.js              # Metro bundler config
├── README.md                    # This file
├── INSTALLATION.md              # Setup instructions
└── SETUP_GUIDE.md               # Development guide
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- Expo CLI (installed with dependencies)
- iOS Simulator (Mac + Xcode) or Android Emulator (Android Studio)
- Expo Go app (optional, for physical device testing)

### Quick Start

```bash
# 1. Navigate to project directory
cd mobile-app

# 2. Install dependencies
npm install

# 3. Configure environment (see below)
# Edit .env file with your API URL

# 4. Start development server
npm start

# 5. Run on device
# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Or scan QR code with Expo Go app
```

### Environment Configuration

Create a `.env` file (or use the existing one):

```bash
EXPO_PUBLIC_API_BASE_URL=https://nofilter.clinic/api/v1
```

**For local development:**

| Device Type | API Base URL |
|-------------|--------------|
| iOS Simulator | `http://localhost:8000/api/v1` |
| Android Emulator | `http://10.0.2.2:8000/api/v1` |
| Physical Device | `http://YOUR_IP:8000/api/v1` |

Find your IP:
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

## 🔌 API Integration

### Base URL
```
https://your-domain.com/api/v1
```

### Authentication
- **Type:** Laravel Sanctum Bearer token
- **Header:** `Authorization: Bearer {token}`
- **Storage:** expo-secure-store

### Localization
- **Header:** `Accept-Language: ar` or `Accept-Language: en`
- **Auto-injected** by API client based on language store

### Response Format

All endpoints return:

```typescript
{
  success: boolean;
  message: string;
  data: any;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}
```

### Error Handling

- **401 Unauthorized:** Auto-logout, clear token, show login/guest UI
- **422 Validation Error:** Show field-specific errors
- **Network Error:** Show retry button

### Currently Used Endpoints

```
GET /site/homepage   → Home screen data
GET /site/settings   → App settings (logo, colors, etc.)
```

### Available Public Endpoints (To Be Used)

```
GET  /site/services
GET  /site/services/{slug}
GET  /site/offers
GET  /site/offers/{id}
GET  /site/doctors
GET  /site/doctors/{id}
GET  /site/blog
GET  /site/blog/{slug}
GET  /site/booking/departments
GET  /site/booking/doctors?department_id=ID
GET  /site/booking/slots?doctor_id=ID&date=YYYY-MM-DD
POST /site/booking
POST /site/contact
```

### Protected Endpoints (To Be Implemented)

```
GET    /site/cart
POST   /site/cart
DELETE /site/cart/{offerId}
POST   /site/cart/coupon
GET    /site/checkout/summary
POST   /site/checkout/process
GET    /site/my-appointments
POST   /site/my-appointments/{id}/cancel
GET    /site/invoices/{id}
GET    /site/invoices/{id}/download
POST   /site/invoices/{id}/pay
GET    /site/points
GET    /site/points/card
```

## 🎨 Design & UX

- **Theme Color:** `#0d525a` (configurable via API settings)
- **Default Language:** Arabic (RTL)
- **Bottom Navigation:** Home, Services, Offers, Booking, Account
- **Loading States:** Skeleton loaders and spinners
- **Empty States:** Friendly messages with illustrations
- **Error States:** Clear messages with retry buttons
- **Guest Mode:** Users can browse without logging in

## 📱 Bottom Tabs

| Tab | Icon | Screen |
|-----|------|--------|
| Home | 🏠 | Homepage with sliders, services, doctors, offers |
| Services | ⚕️ | Services list and details |
| Offers | 🏷️ | Special offers and promotions |
| Booking | 📅 | Appointment booking flow |
| Account | 👤 | My appointments, invoices, points, settings |

## 🔐 State Management

### Auth Store (Zustand)

```typescript
const { token, user, isAuthenticated, setAuth, logout, clearAuth } = useAuthStore();
```

- Persisted in expo-secure-store
- Auto-cleared on 401 response

### Language Store (Zustand)

```typescript
const { language, isRTL, setLanguage, toggleLanguage } = useLanguageStore();
```

- Persisted in AsyncStorage
- Controls I18nManager RTL setting
- Auto-injects Accept-Language header

### Config Store (Zustand)

```typescript
const { settings, apiBaseUrl, setSettings, getThemeColor } = useConfigStore();
```

- Stores app settings from API
- Runtime API base URL override
- Theme color helper

## 🧪 Development

### Available Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS Simulator
npm run android    # Run on Android Emulator
npm run web        # Run in web browser (limited support)
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler
```

### Hot Reload

- Save any file to see changes instantly
- Shake device or press `R` to manual reload
- Press `Cmd+D` (iOS) or `Cmd+M` (Android) for dev menu

### Debugging

- **React DevTools:** `npx react-devtools`
- **Network:** Use Flipper or React Native Debugger
- **Logs:** `npx expo start` shows console logs in terminal

## 🏗 Architecture Decisions

### Why Zustand?
- Lightweight (1KB)
- Simple API
- No boilerplate
- Built-in persistence
- Perfect for auth/settings

### Why React Query?
- Automatic caching
- Background refetching
- Pagination support
- Optimistic updates
- Request deduplication

### Why expo-router?
- File-based routing
- Type-safe navigation
- Deep linking support
- Shared routes (web support)

### Why i18next?
- Industry standard
- RTL support
- Interpolation
- Pluralization
- Namespace support

## 📦 Building for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform ios --profile production
```

### Android

```bash
eas build --platform android --profile production
```

## 🐛 Troubleshooting

See `INSTALLATION.md` for detailed troubleshooting steps.

## 📖 Documentation

- **INSTALLATION.md** - Detailed setup instructions
- **SETUP_GUIDE.md** - Development tips and API testing
- **API_DOCUMENTATION.md** - API reference (in parent directory)

## ✅ Current Status

**Steps 1-4: COMPLETED ✅**

- ✅ Expo app scaffolded with TypeScript
- ✅ All dependencies installed and configured
- ✅ expo-router setup with bottom tabs
- ✅ i18n configured (Arabic RTL + English LTR)
- ✅ API client with interceptors (token, language, errors)
- ✅ Zustand stores (auth, language, config)
- ✅ React Query provider
- ✅ Home screen fully functional
  - Fetches homepage data
  - Fetches settings
  - Shows sliders, services, doctors, offers
  - Loading states
  - Error handling with retry
  - Language switcher

**Next Steps: Steps 5-10 (Waiting for "continue" instruction)**

## 🎯 Next Task

**Waiting for your "continue" instruction to proceed with Step 5 (Services list + details).**

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for Nofilter Clinic**
