# 🚀 Production Build Guide - Nofilter Clinic Mobile App

## ✅ Pre-Build Checklist

All changes have been committed and pushed to GitHub:
- ✅ Cairo font for Arabic typography
- ✅ Login & Register screens
- ✅ Updated homepage with all sections
- ✅ iOS encryption configuration added
- ✅ New Expo account configured: `mohamedelsisym9`
- ✅ Project ID: `94cc4579-8473-4428-8c39-3e9f8ab5751b`

---

## 📱 Build Android Production APK

### **Step 1: Open Terminal**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
```

### **Step 2: Start Android Build**
```bash
eas build --platform android --profile production
```

### **Step 3: Answer Prompts**

#### ❓ "Generate a new Android Keystore?"
→ Type **`y`** and press Enter

The build will then:
1. ✅ Generate and store secure signing keys
2. ✅ Upload project to EAS servers
3. ✅ Build production APK (10-15 minutes)
4. ✅ Provide download link

### **Expected Output:**
```
✔ Generated new Android Keystore
Compressing project files...
✔ Uploaded to EAS
Build in progress...
Build URL: https://expo.dev/accounts/mohamedelsisym9/...
```

### **Build Time:** ~10-15 minutes

---

## 🍎 Build iOS Production App

### **Step 1: Start iOS Build**
```bash
eas build --platform ios --profile production
```

### **Step 2: Answer Prompts**

You'll need to provide:

#### 1️⃣ **Apple Developer Account**
- Your Apple ID (email)
- Apple Developer Program enrollment required ($99/year)

#### 2️⃣ **Distribution Certificate**
→ Type **`y`** to generate new one

#### 3️⃣ **Provisioning Profile**
→ Type **`y`** to generate new one

#### 4️⃣ **Push Notification Keys** (optional)
→ Type **`n`** for now (can add later)

### **Expected Output:**
```
✔ Generated Distribution Certificate
✔ Generated Provisioning Profile
Compressing project files...
✔ Uploaded to EAS
Build in progress...
Build URL: https://expo.dev/accounts/mohamedelsisym9/...
```

### **Build Time:** ~15-20 minutes

---

## 🎯 Build Both Platforms Simultaneously

To save time, build both at once:

```bash
eas build --platform all --profile production
```

This will:
1. Build Android APK
2. Build iOS IPA
3. Run both in parallel

---

## 📦 What Gets Built

### **Android Output:**
- **File:** `nofilter-clinic.apk`
- **Size:** ~50-70 MB
- **Ready for:** Direct installation or Google Play Store

### **iOS Output:**
- **File:** `nofilter-clinic.ipa`
- **Size:** ~60-80 MB
- **Ready for:** TestFlight or App Store submission

---

## 🔑 Requirements for iOS Build

### **Apple Developer Account Needed:**
- Enrollment: $99/year
- Sign up at: https://developer.apple.com/programs/

### **Alternative (For Testing):**
If you don't have Apple Developer Account yet:
1. Build Android first (works without account)
2. Test thoroughly on Android
3. Then enroll and build iOS

---

## 📥 After Build Completes

### **Download Your Builds:**

1. Visit: https://expo.dev/accounts/mohamedelsisym9/projects/nofilter-clinic/builds

2. Click on completed build

3. Download:
   - **Android:** Click "Download" for APK
   - **iOS:** Click "Download" for IPA

### **Install & Test:**

**Android:**
```bash
# Install on connected device/emulator
adb install nofilter-clinic.apk
```

**iOS:**
- Upload to TestFlight
- Or use Xcode to install on device

---

## 🚀 Quick Start Commands

### **Just Android:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
eas build --platform android --profile production
```

### **Just iOS:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
eas build --platform ios --profile production
```

### **Both Platforms:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
eas build --platform all --profile production
```

---

## ⚙️ Build Profiles

### **Production Profile (Current):**
```json
{
  "production": {
    "env": {
      "EXPO_PUBLIC_API_BASE_URL": "https://nofilter.clinic/api/v1"
    },
    "android": {
      "buildType": "app-bundle"  // For Google Play
    },
    "ios": {
      "buildConfiguration": "Release"
    }
  }
}
```

### **For Direct APK Install:**
If you want APK instead of AAB for direct installation:

```bash
eas build --platform android --profile preview
```

---

## 📊 Build Status Monitoring

### **Check Build Status:**
```bash
eas build:list
```

### **View Specific Build:**
```bash
eas build:view [BUILD_ID]
```

### **Build Logs:**
Available in the Expo dashboard or via CLI

---

## 🎨 What's Included in This Build

✅ **Features:**
- Cairo font for beautiful Arabic typography
- Login & Register screens with validation
- Homepage with services, doctors, offers, blog
- Special offers section
- Complete booking flow
- Cart & checkout
- Account management
- Blog with comments
- PDF downloads
- Points/loyalty system

✅ **Languages:**
- Arabic (default, RTL)
- English

✅ **API:**
- Production URL: https://nofilter.clinic/api/v1
- Laravel Sanctum authentication
- Full REST API integration

---

## 🐛 Troubleshooting

### **Build Fails:**
```bash
# Clear local cache
rm -rf node_modules/.cache .expo

# Retry build
eas build --platform android --profile production --clear-cache
```

### **Credentials Issue:**
```bash
# Reset credentials
eas credentials

# Then rebuild
eas build --platform android --profile production
```

### **Need to Update Build:**
```bash
# Make your changes, commit, push
git add .
git commit -m "Your changes"
git push origin main

# Build again
eas build --platform android --profile production
```

---

## 📱 Distribution Options

### **Android:**
1. **Direct Install:** Share APK file
2. **Google Play:** Internal Testing → Beta → Production
3. **Firebase App Distribution:** For team testing

### **iOS:**
1. **TestFlight:** Beta testing (up to 10,000 testers)
2. **App Store:** Production release
3. **Ad Hoc:** Direct install (limited devices)

---

## 💰 Cost Summary

### **Free Tier (Current):**
- 15 builds/month (Android + iOS combined)
- Your new account: `mohamedelsisym9`

### **Paid Plans:**
- **Production:** $29/month - Unlimited builds
- **Enterprise:** $99/month - Priority support

---

## ✨ Summary

**To build Android APK:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
eas build --platform android --profile production
# Press 'y' when asked to generate keystore
# Wait 10-15 minutes
# Download APK from link provided
```

**To build iOS IPA:**
```bash
eas build --platform ios --profile production
# Follow prompts for Apple credentials
# Wait 15-20 minutes
# Download IPA from link provided
```

---

## 🎉 You're Ready!

Everything is configured and ready to build. Just run the commands above!

**Build Dashboard:** https://expo.dev/accounts/mohamedelsisym9/projects/nofilter-clinic/builds

**Need Help?**
- Expo Docs: https://docs.expo.dev/build/introduction/
- Build Errors: Check logs in dashboard

---

**Good luck with your production builds! 🚀**
