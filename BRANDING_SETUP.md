# 🎨 No Filter Clinic - App Branding Setup

## 📱 Required Assets

Your "No Filter" logo needs to be converted into the following formats for the mobile app:

### 1. **App Icon** (`icon.png`)
- **Size:** 1024x1024 pixels (square)
- **Format:** PNG with transparency
- **Used for:** iOS App Icon, Android launcher icon
- **Design tip:** Since your logo is wide, you have two options:
  - **Option A:** Crop to show just the crown + woman silhouette (left side)
  - **Option B:** Add a solid background color (#0d525a brand color) and center the logo

### 2. **Adaptive Icon** (`adaptive-icon.png`)
- **Size:** 1024x1024 pixels (square)
- **Format:** PNG with transparency
- **Used for:** Android adaptive icons (various shapes)
- **Design tip:** Keep important elements in the center "safe zone" (66% of the image)

### 3. **Splash Screen** (`splash.png`)
- **Size:** 1284x2778 pixels (portrait) or keep wide format
- **Format:** PNG with transparency or solid background
- **Background color:** #0d525a (brand color - already configured)
- **Design tip:** Your wide logo works perfectly here! Center it on the colored background

### 4. **Favicon** (`favicon.png`)
- **Size:** 48x48 or 64x64 pixels (square)
- **Format:** PNG
- **Used for:** Web version of the app
- **Design tip:** Use a simplified version (just the crown icon or initials "NF")

---

## 🛠 Quick Setup Options

### **Option 1: Use Online Tool (Easiest)**

Use **Expo's Icon and Splash Screen Generator**:

1. Go to https://icon.kitchen/
2. Upload your "No Filter" logo
3. Set background color: `#0d525a`
4. Download the icon pack
5. Copy files to `/mobile-app/assets/`

### **Option 2: Use Design Software**

**Figma / Photoshop / Sketch:**

1. Create a 1024x1024 canvas
2. Fill background with `#0d525a`
3. Center your logo (resize proportionally)
4. Export as PNG
5. Repeat for other sizes

### **Option 3: Use ImageMagick (Command Line)**

If you have the wide logo saved as `logo-wide.png`:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app/assets

# Create square icon with brand color background
convert logo-wide.png -resize 800x800 -gravity center -background "#0d525a" -extent 1024x1024 icon.png

# Create adaptive icon
cp icon.png adaptive-icon.png

# Create splash screen (portrait)
convert logo-wide.png -resize 1000x400 -gravity center -background "#0d525a" -extent 1284x2778 splash.png

# Create favicon
convert icon.png -resize 48x48 favicon.png
```

---

## 📁 Where to Place Files

Replace these files in your project:

```
/mobile-app/assets/
├── icon.png          (1024x1024 - App icon)
├── adaptive-icon.png (1024x1024 - Android adaptive icon)
├── splash.png        (1284x2778 - Splash screen)
└── favicon.png       (48x48 - Web favicon)
```

---

## 🎨 Current Brand Colors

Already configured in your app:

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary Brand | Teal/Turquoise | `#0d525a` |
| Splash Background | Teal/Turquoise | `#0d525a` |
| Adaptive Icon BG | Teal/Turquoise | `#0d525a` |

These are set in `app.config.ts`:
- `splash.backgroundColor: '#0d525a'`
- `android.adaptiveIcon.backgroundColor: '#0d525a'`

---

## ✅ After Replacing Assets

### 1. Verify Assets Locally

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
npx expo start
```

Press `i` for iOS or `a` for Android to see the new icons in the emulator.

### 2. Rebuild for Production

```bash
# Commit the new assets
git add assets/
git commit -m "Update app branding with No Filter logo"
git push origin main

# Rebuild the app
eas build -p android --profile preview
```

### 3. Build Time

The new logo will be included in the next build (~15-20 minutes).

---

## 🎯 Design Recommendations

### **For App Icon (Square 1024x1024):**

**Recommended Design:**
- Background: Solid `#0d525a` (brand teal)
- Logo: Centered, white or gold version
- Padding: 15% margin from edges
- Style: Clean, recognizable at small sizes

**What works:**
- ✅ Crown + silhouette only (left portion of logo)
- ✅ "NF" initials with crown above
- ✅ Full logo scaled down with padding

**What doesn't work:**
- ❌ Full wide logo (too small to read)
- ❌ No padding (gets cut off on rounded icons)

### **For Splash Screen (Portrait 1284x2778):**

**Recommended Design:**
- Background: Solid `#0d525a`
- Logo: Full wide logo, centered
- Size: ~60-70% of screen width
- Position: Vertically centered

---

## 📱 Preview Your Icons

After replacing assets, you can preview them:

**iOS:**
- Settings app → App icons
- Home screen (install via TestFlight or simulator)

**Android:**
- Launcher icons (various shapes: circle, square, rounded)
- Adaptive icon animations

---

## 🔄 Current Status

- ✅ Brand color (`#0d525a`) already configured
- ✅ Splash screen background color set
- ⏳ **Next Step:** Replace default Expo assets with "No Filter" logo

---

## 💡 Quick Win

If you just want to test quickly:

1. Save your wide logo as `assets/splash.png`
2. Keep the square icon as-is for now
3. Rebuild and see the splash screen with your branding!

---

## 🚀 Professional Tip

For best results, hire a designer on Fiverr ($10-20) to create:
- App icon set (all sizes)
- Splash screen
- App Store screenshots

Search: "React Native app icon design" or "Expo app branding"

---

**Need help with any of these steps? Let me know!** 🎨
