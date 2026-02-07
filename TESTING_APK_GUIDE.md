# Android APK Testing Guide

## Build Information

**Build URL:** https://expo.dev/accounts/mohamedelsisym9/projects/nofilter-clinic/builds/6921edb8-16f0-4ceb-8894-f551e22227e0

**Build ID:** 6921edb8-16f0-4ceb-8894-f551e22227e0
**Status:** Building (Started at 10:51 AM)
**Profile:** Preview (APK for testing)
**Version:** 1.0.0

## How to Download & Install

### Step 1: Check Build Status
Visit the build URL above or run:
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
npx eas-cli build:view 6921edb8-16f0-4ceb-8894-f551e22227e0
```

### Step 2: Download the APK
Once the build is complete (Status: "finished"):
1. Visit the build URL
2. Click the "Download" button
3. Save the APK file (e.g., `nofilter-clinic-preview.apk`)

### Step 3: Install on Android Device

#### Option A: Direct Installation
1. Transfer the APK to your Android device
2. Open the APK file on your device
3. If prompted, enable "Install from unknown sources":
   - Go to Settings → Security → Unknown Sources
   - Or Settings → Apps → Special Access → Install Unknown Apps
4. Tap "Install"
5. Open "Nofilter Clinic" app

#### Option B: Using ADB (if connected to computer)
```bash
adb install path/to/nofilter-clinic-preview.apk
```

## What's Included in This Build

✅ **All Services** - Shows all 8 services from database:
  - Laser Hair Removal
  - Skin Care
  - Dental
  - Aesthetic
  - Plastic and Cosmetic Surgery
  - Hair Transplant and Restoration
  - Nutrition and Body Contouring
  - Laboratory

✅ **Full Booking Flow:**
  - Select Department (all 8 services)
  - Select Doctor (filtered by department)
  - Select Date (calendar picker)
  - Check Doctor Availability
  - Select Time Slot (only if doctor works that day)
  - Patient Information
  - Booking Confirmation

✅ **Fixed Navigation:**
  - Bottom tabs working (Home, Services, Offers, Booking, Account)
  - Service detail pages working
  - Book Now button working

✅ **Live Data:**
  - Connects to https://nofilter.clinic/api/v1
  - Real-time data from production database
  - Arabic/English language support
  - Cairo font for Arabic

## Testing Checklist

### Homepage
- [ ] All 8 services displayed with images
- [ ] Service slider working
- [ ] Doctors section showing
- [ ] Special offers displayed
- [ ] Blog posts showing

### Services Tab
- [ ] All 8 services listed
- [ ] Images and descriptions visible
- [ ] Click on service opens detail page
- [ ] Service detail shows full information

### Booking Flow
- [ ] Navigate to Booking tab
- [ ] Start booking shows all 8 departments
- [ ] Select department → shows doctors
- [ ] Select doctor → shows calendar
- [ ] Select date → checks if doctor works
- [ ] Shows available time slots or warning
- [ ] Complete patient info form
- [ ] See confirmation

### Navigation
- [ ] Bottom tabs respond to clicks
- [ ] Can switch between Home, Services, Offers, Booking, Account
- [ ] Back button works
- [ ] Navigation between screens smooth

### Language
- [ ] Switch between Arabic/English
- [ ] Cairo font displays correctly for Arabic
- [ ] RTL layout for Arabic

## Troubleshooting

### "App not installed" error
- Make sure you have enough storage space
- Uninstall any previous version first
- Enable "Install from unknown sources"

### App crashes on launch
- Check if your Android version is supported (Android 5.0+)
- Clear app data and restart
- Reinstall the APK

### No data showing
- Check internet connection
- Verify the app is connecting to https://nofilter.clinic
- Check if API is accessible

## Next Steps After Testing

1. **Report Issues:** Note any bugs or problems
2. **UI/UX Feedback:** Suggest improvements
3. **Feature Requests:** Any missing functionality
4. **Performance:** Note any slowness or crashes

## Production Build

When ready for Play Store:
```bash
npx eas-cli build --platform android --profile production
```

This will create an AAB (Android App Bundle) file for Google Play Store submission.
