# Installation Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Expo CLI** (will be installed with dependencies)
- **iOS Simulator** (Mac only, via Xcode)
- **Android Studio** (for Android Emulator)
- **Expo Go** app on your phone (optional, for testing on physical device)

## Step-by-Step Installation

### 1. Navigate to Project Directory

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Expo SDK
- React Native
- TypeScript
- Axios
- TanStack Query
- Zustand
- i18next
- And all other dependencies

### 3. Configure Environment Variables

The `.env` file should already exist. Update it with your API base URL:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

**Important:** For different environments:

| Device Type | API Base URL |
|-------------|--------------|
| iOS Simulator | `http://localhost:8000/api` |
| Android Emulator | `http://10.0.2.2:8000/api` |
| Physical Device (WiFi) | `http://YOUR_COMPUTER_IP:8000/api` |

To find your computer's IP:
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

### 4. Start Development Server

```bash
npm start
```

Or with cache cleared:
```bash
npx expo start --clear
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Display a QR code in the terminal

### 5. Run the App

You have three options:

#### Option A: Expo Go (Easiest for Testing)

1. Install **Expo Go** from:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in the terminal:
   - iOS: Use Camera app
   - Android: Use Expo Go app

#### Option B: iOS Simulator (Mac Only)

1. Install Xcode from Mac App Store
2. Open Xcode → Preferences → Components → Install a simulator
3. Run:
   ```bash
   npm run ios
   ```

#### Option C: Android Emulator

1. Install Android Studio
2. Open Android Studio → AVD Manager → Create Virtual Device
3. Start the emulator
4. Run:
   ```bash
   npm run android
   ```

## Verify Installation

Once the app loads, you should see:

1. **Home Screen** with:
   - Clinic logo and name in header
   - Language switcher button (AR/EN)
   - Sliders/banners (if configured in backend)
   - Featured services section
   - Doctors section
   - Offers section

2. **Bottom Navigation** with 4 tabs:
   - Home (🏠)
   - Services (⚕️)
   - Appointments (📅)
   - Profile (👤)

## Troubleshooting

### "Unable to resolve module"

```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### "Network request failed"

1. Verify backend Laravel server is running:
   ```bash
   php artisan serve
   ```

2. Check the API URL in `.env`

3. Test API manually:
   ```bash
   curl http://localhost:8000/api/site/homepage
   ```

4. Ensure CORS is configured in Laravel backend

### "Expo CLI not found"

```bash
npm install -g expo-cli
```

Or use npx:
```bash
npx expo start
```

### iOS Build Issues

```bash
cd ios
pod install
cd ..
npx expo start --clear
```

### Android Build Issues

1. Clean Android build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx expo start --clear
   ```

2. Check Android SDK is installed in Android Studio

### Port Already in Use

```bash
npx expo start --port 8081
```

## Backend Requirements

The mobile app requires these API endpoints from your Laravel backend:

### Public Endpoints (No Auth Required)

```
GET /api/site/homepage      → Homepage data
GET /api/site/settings      → App settings
GET /api/site/services      → Services list
GET /api/site/services/{id} → Service details
GET /api/site/doctors       → Doctors list
GET /api/site/offers        → Offers list
GET /api/site/posts         → Blog posts
```

### Protected Endpoints (Auth Required)

```
POST /api/auth/login        → User login
POST /api/auth/register     → User registration
POST /api/auth/logout       → User logout
GET  /api/auth/profile      → User profile

GET  /api/appointments      → User appointments
POST /api/appointments      → Create appointment

GET  /api/invoices          → User invoices
GET  /api/invoices/{id}     → Invoice details
```

### Response Format

All endpoints should return:

```json
{
  "success": true,
  "message": "Success message",
  "data": { /* actual data */ },
  "meta": { /* pagination data (optional) */ },
  "links": { /* pagination links (optional) */ }
}
```

## Development Workflow

1. Make changes to code
2. Save file (app will hot-reload automatically)
3. See changes instantly in the app
4. No need to restart server (unless you change dependencies)

## Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### iOS IPA

```bash
eas build --platform ios --profile preview
```

*Note: Building for iOS requires a Mac and Apple Developer account ($99/year)*

## Next Steps

After successful installation:

1. ✅ Test the Home screen
2. ✅ Switch between Arabic and English
3. ✅ Verify API data loads correctly
4. ✅ Test error handling (disconnect backend)
5. ✅ Test retry functionality

Then you're ready to build additional features!

## Project Structure Overview

```
mobile-app/
├── app/                    # Routes (Expo Router)
│   ├── _layout.tsx        # Root layout with providers
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx   # Tab configuration
│       ├── index.tsx     # Home screen ✅
│       ├── services.tsx  # Services (placeholder)
│       ├── appointments.tsx
│       └── profile.tsx
│
├── src/
│   ├── api/               # API layer ✅
│   │   ├── client.ts     # Axios with interceptors
│   │   ├── endpoints.ts  # API functions
│   │   └── types.ts      # TypeScript interfaces
│   │
│   ├── store/             # State management ✅
│   │   ├── authStore.ts  # Auth (token, user)
│   │   ├── languageStore.ts # Language/RTL
│   │   └── configStore.ts   # Settings
│   │
│   ├── components/        # Reusable UI ✅
│   │   ├── LoadingScreen.tsx
│   │   ├── ErrorView.tsx
│   │   ├── ServiceCard.tsx
│   │   └── DoctorCard.tsx
│   │
│   └── utils/
│       └── i18n.ts       # Localization ✅
│
├── .env                   # Environment config
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── app.json               # Expo config
└── README.md             # Documentation

✅ = Fully implemented
```

## Documentation

- `README.md` - Full project documentation
- `SETUP_GUIDE.md` - Quick setup and development tips
- `INSTALLATION.md` - This file
- `API_DOCUMENTATION.md` - API reference (in parent directory)

## Support & Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **React Query**: https://tanstack.com/query/latest
- **Zustand**: https://zustand-demo.pmnd.rs/
- **i18next**: https://www.i18next.com/

## Status: ✅ Ready for Development

All core infrastructure is complete:
- ✅ Project structure
- ✅ API client with interceptors
- ✅ State management (Zustand)
- ✅ Localization (Arabic/English)
- ✅ React Query setup
- ✅ Home screen working
- ✅ Navigation ready

**Next:** Build additional screens as needed!
