# 📱 Local Testing Guide

## Problem: Backend API Not Deployed

The mobile app is trying to connect to `https://nofilter.clinic/api/v1`, but the API routes aren't deployed to production yet. Your local XAMPP backend **IS working correctly**.

---

## ✅ Solution: Test with Local Backend

### Step 1: Find Your Mac's Local IP Address

Open Terminal and run:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Example output:**
```
inet 192.168.1.100 netmask 0xffffff00
```

Your local IP is **192.168.1.100** (yours will be different - use whatever shows up!)

---

### Step 2: Update `eas.json` with Your Local IP

Open `/mobile-app/eas.json` and find the `"local"` build profile (around line 6):

```json
"local": {
  "distribution": "internal",
  "channel": "local",
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  },
  "env": {
    "EXPO_PUBLIC_API_BASE_URL": "http://YOUR_LOCAL_IP:8000/api/v1"
  }
}
```

**Replace `YOUR_LOCAL_IP` with your actual IP:**

```json
"EXPO_PUBLIC_API_BASE_URL": "http://192.168.1.100:8000/api/v1"
```

**IMPORTANT:** 
- Use `http://` not `https://`
- Use port `:8000` (your XAMPP port)
- Keep `/api/v1` at the end

---

### Step 3: Make Sure XAMPP is Accessible from Network

Your XAMPP server must be accessible from your local network (not just localhost).

**Test it from your Android device browser:**
1. Open Chrome on your Android phone
2. Connect to the **same WiFi** as your Mac
3. Navigate to: `http://192.168.1.100:8000` (replace with your IP)
4. You should see your Laravel app!

If you can't access it, you may need to configure XAMPP to listen on all network interfaces.

---

### Step 4: Build APK with Local Configuration

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
eas build -p android --profile local
```

This will build an APK that connects to your local backend at `http://YOUR_IP:8000/api/v1`.

---

### Step 5: Install & Test

1. Wait for the build to complete (~15-20 minutes)
2. Download the APK to your Android device
3. Install and open the app
4. **Make sure your phone is on the same WiFi as your Mac**
5. The app should now load data from your local XAMPP backend! 🎉

---

## 🚀 Alternative: Deploy to Production

If you want to deploy to production instead:

### 1. Upload Files to Production Server

Upload your entire Laravel project to:
```
/home/u270738160/domains/nofilter.clinic/
```

**Important files:**
- `app/` - All controllers including `SiteController`
- `routes/api_v1.php` - Mobile app API routes
- `bootstrap/app.php` - Route configuration
- `config/` - Configuration files
- `.env` - Environment variables

### 2. Run These Commands on Production Server

```bash
cd /home/u270738160/domains/nofilter.clinic
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan optimize
```

### 3. Verify Routes Are Loaded

```bash
php artisan route:list | grep "site/homepage"
```

You should see:
```
GET   api/v1/site/homepage ... SiteController@homepage
```

### 4. Test the API

```bash
curl https://nofilter.clinic/api/v1/site/homepage \
  -H "Accept-Language: ar" \
  -H "Accept: application/json"
```

Should return JSON with sliders, services, doctors, posts.

### 5. Rebuild Mobile App with Production URL

Once the production API is working, use the `preview` or `production` profile:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
eas build -p android --profile preview
```

---

## 🔧 Troubleshooting

### Can't Access XAMPP from Phone

**Problem:** Phone can't reach `http://YOUR_IP:8000`

**Solutions:**
1. Make sure both devices are on the same WiFi
2. Disable Mac firewall temporarily for testing
3. Check XAMPP is running on port 8000
4. Try accessing from your Mac browser first: `http://YOUR_IP:8000`

### API Returns 404

**Problem:** Routes not found on local server

**Solution:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan route:list | grep "site/"
```

### App Shows "Network Error"

**Problem:** App can't connect to backend

**Checklist:**
- [ ] Phone on same WiFi as Mac
- [ ] Correct IP address in `eas.json`
- [ ] XAMPP running and accessible
- [ ] Used `http://` not `https://`
- [ ] Port `:8000` included in URL
- [ ] Rebuilt app after changing `eas.json`

---

## 📊 Build Profiles Summary

| Profile | API URL | Use Case |
|---------|---------|----------|
| `local` | `http://YOUR_IP:8000/api/v1` | Local XAMPP testing |
| `preview` | `https://nofilter.clinic/api/v1` | Production testing |
| `production` | `https://nofilter.clinic/api/v1` | App Store / Play Store |

---

## ✅ Current Status

- ✅ Mobile app code is correct
- ✅ Local backend API is working
- ❌ Production API is not deployed yet
- 🔄 **Next Step:** Choose local testing OR deploy to production

---

**Questions? Check the logs or ask for help!** 🚀
