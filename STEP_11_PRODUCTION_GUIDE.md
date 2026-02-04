# Step 11: Production Readiness Guide

## 🎯 Overview

This guide covers all production-readiness improvements implemented for the **Nofilter Clinic** mobile app, including deep linking, analytics, push notifications, performance optimizations, and release build instructions.

---

## ✅ Completed Features

### 1. Deep Linking & Sharing
- **App Scheme**: `nofilterclinic://`
- **Supported Deep Links**:
  - `nofilterclinic://services/{slug}` - Service details
  - `nofilterclinic://offers/{id}` - Offer details
  - `nofilterclinic://blog/{slug}` - Blog post details
  - `nofilterclinic://booking` - Booking flow
  - `nofilterclinic://cart` - Shopping cart

- **Share Buttons**: Added to all detail screens (Services, Offers, Blog Posts)
- **Implementation**: See `src/utils/deepLinking.ts` and `src/components/ShareButton.tsx`

### 2. Analytics System
- **File**: `src/analytics/index.ts`
- **Features**:
  - Event tracking: `track(eventName, properties)`
  - User identification: `identify(userId, traits)`
  - Screen tracking: `screen(screenName, properties)`
  - User properties: `setUserProperties(properties)`
  
- **Predefined Events** (ready for integration):
  - App lifecycle: `app_open`, `app_background`, `app_foreground`
  - Language: `language_changed`
  - Services/Offers: `service_viewed`, `offer_viewed`
  - Cart/Checkout: `add_to_cart`, `checkout_started`, `payment_redirect_opened`
  - Booking: `booking_started`, `booking_submitted`, `booking_success`
  - Blog: `blog_post_viewed`, `comment_submitted`
  - Account: `invoice_pdf_downloaded`, `points_card_downloaded`

- **Integration Ready**: Console logging in dev, pluggable for Firebase/Segment/Mixpanel

### 3. Error Monitoring
- **File**: `src/monitoring/index.ts`
- **Features**:
  - Exception capture: `captureException(error, context)`
  - Message logging: `captureMessage(message, level, context)`
  - User context: `setUser(userId, email, username)`
  - Breadcrumbs: `addBreadcrumb(message, category, data)`

- **Integration Ready**: Sentry integration guide included in file

### 4. Push Notifications Scaffold
- **File**: `src/notifications/index.ts`
- **Features**:
  - Permission management
  - Expo push token generation
  - Local notification scheduling
  - Appointment reminders (scheduled 24h or 1h before)
  - Device registration placeholder (backend TODO)

- **Requirements**: `npm install expo-notifications`

### 5. Toast/Feedback System
- **File**: `src/utils/toast.tsx`
- **Features**:
  - Unified user feedback: `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`
  - Predefined errors: `networkError()`, `authError()`, `validationError()`, `serverError()`
  - Action buttons support

### 6. Skeleton Loaders
- **File**: `src/components/SkeletonLoader.tsx`
- **Components**:
  - `SkeletonLoader` - Base component
  - `SkeletonCard` - Card placeholder
  - `SkeletonListItem` - List item placeholder
  - `SkeletonDoctorCard` - Doctor card placeholder
  - `SkeletonSlider` - Slider placeholder
  - `SkeletonServiceGrid` - Service grid placeholder

### 7. React Query Optimization
- **File**: `app/_layout.tsx`
- **Improvements**:
  - `retry: 1` - Retry failed requests once
  - `staleTime: 60 * 1000` - 1-minute stale time
  - `gcTime: 5 * 60 * 1000` - 5-minute cache
  - `refetchOnReconnect: true` - Refetch on network reconnect

### 8. Build Configuration
- **File**: `eas.json`
- **Profiles**:
  - `development` - Debug builds with dev client
  - `preview` - Internal testing (APK/IPA)
  - `production` - Store releases (AAB/IPA)

### 9. Code Quality
- **ESLint**: `.eslintrc.js` - TypeScript + Expo rules
- **Prettier**: `.prettierrc.js` - Code formatting rules

---

## 📦 Required Packages

Install these additional packages:

```bash
npm install expo-notifications
```

---

## 🚀 EAS Build & Release Guide

### Prerequisites
```bash
npm install -g eas-cli
eas login
```

### Configure EAS
```bash
eas build:configure
```

### Development Builds
```bash
# Android
eas build -p android --profile development

# iOS
eas build -p ios --profile development
```

### Preview Builds (Internal Testing)
```bash
# Android APK
eas build -p android --profile preview

# iOS IPA
eas build -p ios --profile preview
```

### Production Builds (Store Release)
```bash
# Android (App Bundle for Play Store)
eas build -p android --profile production

# iOS (IPA for App Store)
eas build -p ios --profile production
```

### Submit to Stores
```bash
# Android
eas submit -p android

# iOS
eas submit -p ios
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```
EXPO_PUBLIC_API_BASE_URL=https://nofilter.clinic/api/v1
```

For local development:
```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000/api/v1
```

---

## 📱 App Configuration

### App Identity (app.config.ts)
- **Name**: Nofilter Clinic
- **Slug**: nofilter-clinic
- **Scheme**: nofilterclinic
- **iOS Bundle**: clinic.nofilter.app
- **Android Package**: clinic.nofilter.app
- **Primary Color**: #0d525a

### Version Management
Update version in `app.config.ts`:
- **version**: User-facing version (e.g., "1.0.0")
- **ios.buildNumber**: iOS build number (increment for each build)
- **android.versionCode**: Android version code (increment for each build)

---

## 🔔 Push Notifications Setup

### 1. Request Permission (Settings Screen)
```typescript
import { notifications } from '@/notifications';

const granted = await notifications.requestPermission();
if (granted) {
  const token = await notifications.getExpoPushToken();
  console.log('Push Token:', token);
}
```

### 2. Schedule Appointment Reminder
```typescript
await notifications.scheduleAppointmentReminder(
  new Date('2024-12-25T10:00:00'),
  {
    doctorName: 'Smith',
    department: 'Cardiology',
    time: '10:00 AM',
  }
);
```

### 3. Backend Integration (TODO)
When backend endpoint is ready, uncomment the API call in `src/notifications/index.ts`:
```typescript
await apiClient.post('/notifications/register', {
  token,
  userId,
  platform: Platform.OS,
});
```

---

## 📊 Analytics Integration

### Firebase Analytics Example
```bash
npm install @react-native-firebase/analytics @react-native-firebase/app
```

Update `src/analytics/index.ts` to use Firebase:
```typescript
import analytics from '@react-native-firebase/analytics';

track(eventName: string, properties?: Record<string, any>): void {
  analytics().logEvent(eventName, properties);
}
```

### Segment Analytics Example
```bash
npm install @segment/analytics-react-native
```

Update `src/analytics/index.ts` to use Segment:
```typescript
import analytics from '@segment/analytics-react-native';

track(eventName: string, properties?: Record<string, any>): void {
  analytics.track(eventName, properties);
}
```

---

## 🐛 Error Monitoring (Sentry)

### Setup
```bash
npm install @sentry/react-native
```

### Configure in app/_layout.tsx
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
});
```

Update `src/monitoring/index.ts` to use Sentry (uncomment Sentry calls).

---

## ✨ Performance Best Practices

### 1. FlatList Optimization
```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={Platform.OS === 'android'}
  renderItem={({ item }) => <MemoizedItem item={item} />}
/>
```

### 2. Image Optimization
- Use `expo-image` instead of React Native's `Image`
- Add `placeholder` prop for loading states
- Use appropriate `contentFit` settings

### 3. React Query Tuning
- Use `enabled` flag to prevent unnecessary fetches
- Set appropriate `staleTime` for each query
- Use `keepPreviousData` for paginated lists

---

## 🧪 Testing Checklist

### Pre-Release Verification
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] All screens work in both Arabic (RTL) and English (LTR)
- [ ] Deep links open correct screens
- [ ] Booking flow completes successfully
- [ ] Cart + Checkout payment redirect works
- [ ] PDFs download and share without crash
- [ ] Push notification permissions work
- [ ] Analytics events fire correctly
- [ ] No console errors in production build
- [ ] App runs smoothly on low-end devices
- [ ] Offline error handling works properly

### Device Testing
- [ ] Test on iOS (iPhone 8+ and iPad)
- [ ] Test on Android (API 21+ and tablets)
- [ ] Test on various screen sizes
- [ ] Test in poor network conditions
- [ ] Test app state restoration after backgrounding

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)

---

## 🎉 Ready for Production!

Your **Nofilter Clinic** app is now production-ready with:
- ✅ Deep linking & sharing
- ✅ Analytics system (pluggable)
- ✅ Error monitoring (Sentry-ready)
- ✅ Push notifications (scaffold)
- ✅ Optimized performance
- ✅ Build & release configuration
- ✅ Code quality tools

Follow the EAS Build guide to create your first production build and submit to App Store and Play Store!
