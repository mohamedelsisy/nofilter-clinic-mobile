# Quick Start Guide

## ⚡️ Get Running in 5 Minutes

### 1. Install Dependencies (2 min)

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
npm install
```

### 2. Configure API URL (30 sec)

Edit the `.env` file (already created):

```bash
# For local development on iOS Simulator:
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# For Android Emulator:
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api/v1

# For Physical Device (replace with your machine's IP):
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:8000/api/v1
```

**Find your IP:**
```bash
# Mac
ipconfig getifaddr en0

# Or use:
ifconfig | grep "inet "
```

### 3. Start Laravel Backend

Make sure your Laravel API is running:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa
php artisan serve
```

### 4. Start Expo Dev Server (1 min)

```bash
npm start
```

### 5. Run on Device (1 min)

#### Option A: iOS Simulator (Mac only)
Press `i` in the terminal

#### Option B: Android Emulator
Press `a` in the terminal

#### Option C: Physical Device
1. Install "Expo Go" from App Store / Play Store
2. Scan the QR code shown in terminal

## ✅ Verify It's Working

You should see:

1. **Loading screen** (brief)
2. **Home screen** with:
   - Green header (#0d525a)
   - Clinic name
   - Language switcher (AR/EN)
   - Sliders (if configured in backend)
   - Featured Services section
   - Doctors section
   - Offers section
3. **Bottom navigation** with 5 tabs

## 🐛 Troubleshooting

### "Network request failed"

**Check:**
1. Is Laravel backend running? (`php artisan serve`)
2. Is the API URL correct in `.env`?
3. Can you access the API in browser?
   - Test: `http://localhost:8000/api/v1/site/homepage`

**For Android Emulator:** Use `10.0.2.2` instead of `localhost`

**For Physical Device:** Use your computer's IP address

### "Module not found"

```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Still not working?

1. Check `INSTALLATION.md` for detailed troubleshooting
2. Check `SETUP_GUIDE.md` for common issues
3. Verify Laravel API endpoints are working:

```bash
# Test homepage endpoint
curl http://localhost:8000/api/v1/site/homepage

# Test settings endpoint
curl http://localhost:8000/api/v1/site/settings
```

## 🎯 What's Next?

Once the Home screen is working:

**✅ Steps 1-4 Complete:**
- Project setup
- i18n (Arabic/English)
- API client
- Home screen

**⏳ Waiting for "continue" instruction:**
- Step 5: Services
- Step 6: Booking Flow
- Step 7: Offers
- Step 8: Cart + Checkout
- Step 9: Blog
- Step 10: Account Area

## 📱 Testing the Home Screen

1. **Language Switcher:**
   - Tap the language button in header
   - UI should flip to RTL/LTR
   - Text should change to Arabic/English

2. **Data Loading:**
   - Pull to refresh (if implemented)
   - Should show loading indicator
   - Data should appear

3. **Error Handling:**
   - Stop Laravel backend
   - Reload app
   - Should show error message
   - Tap "Retry"
   - Restart Laravel backend
   - Data should load

4. **Navigation:**
   - Tap bottom tabs
   - Should navigate to placeholder screens
   - Home tab is fully functional

## 📖 Documentation

- **README.md** - Complete project overview
- **INSTALLATION.md** - Detailed setup instructions
- **SETUP_GUIDE.md** - Development tips
- **PROJECT_STATUS.md** - Current progress and what's next

## 🎨 Customization

### Change Theme Color

In your Laravel backend, update the settings:
```php
'primary_color' => '#0d525a'  // Current color
```

The app will automatically use the color from API.

### Add Translations

Edit `src/utils/i18n.ts`:

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

Use in component:
```typescript
const { t } = useTranslation();
<Text>{t('my_key')}</Text>
```

## 🚀 Ready to Continue

Everything is set up and working! The Home screen demonstrates:
- ✅ API integration
- ✅ Loading states
- ✅ Error handling
- ✅ Localization
- ✅ RTL support
- ✅ State management
- ✅ Navigation

**Waiting for your "continue" instruction to build the next feature!** 🎉
