# Environment Configuration Guide

## 📝 .env File Setup

The `.env` file should be created in the root of the `mobile-app` directory.

### For Local Development

Create or update the `.env` file with the following content:

```bash
# API Base URL
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### For Different Environments

#### iOS Simulator (Mac)
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

#### Android Emulator
```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api/v1
```

**Note:** Android Emulator uses `10.0.2.2` to access the host machine's localhost.

#### Physical Device (iOS or Android)
```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_IP:8000/api/v1
```

Replace `YOUR_COMPUTER_IP` with your machine's local network IP address.

**Find your IP address:**

On Mac/Linux:
```bash
# Option 1: Quick way
ipconfig getifaddr en0

# Option 2: Detailed info
ifconfig | grep "inet "
```

On Windows:
```bash
ipconfig
```

Look for your IPv4 address (usually starts with 192.168.x.x or 10.0.x.x).

### For Production

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api/v1
```

## 🔍 How It Works

The app reads the `EXPO_PUBLIC_API_BASE_URL` environment variable in several places:

1. **API Client** (`src/api/client.ts`)
   - Uses it as the base URL for all API requests
   - Falls back to `http://localhost:8000/api/v1` if not set

2. **Config Store** (`src/store/configStore.ts`)
   - Stores the URL for runtime override
   - Can be changed in app settings (future feature)

## 🔄 Runtime Override

The app also supports runtime API base URL changes through the config store:

```typescript
import { useConfigStore } from '@/store/configStore';

const { setApiBaseUrl } = useConfigStore();
setApiBaseUrl('https://new-api-url.com/api/v1');
```

This can be useful for:
- Switching between staging and production
- Testing different backend instances
- Development/debugging

## 🚨 Important Notes

### 1. EXPO_PUBLIC_ Prefix
The `EXPO_PUBLIC_` prefix is **required** for Expo to make the variable available in the app. Don't remove it!

### 2. No Trailing Slash
Do **not** include a trailing slash in the URL:
```bash
# ✅ Correct
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# ❌ Wrong
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1/
```

### 3. HTTPS in Production
Always use HTTPS in production for security:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api/v1
```

### 4. Restart After Changes
After changing the `.env` file, you must restart the Expo dev server:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
```

Or use the `--clear` flag to clear cache:
```bash
npx expo start --clear
```

## 🧪 Testing Your Configuration

### 1. Test from Terminal

Test if your Laravel API is accessible:

```bash
# Test homepage endpoint
curl http://localhost:8000/api/v1/site/homepage

# Test settings endpoint
curl http://localhost:8000/api/v1/site/settings
```

You should see JSON responses with `success: true`.

### 2. Test from App

1. Start the app
2. Watch for API calls in terminal
3. If you see "Network request failed", check:
   - Is Laravel running? (`php artisan serve`)
   - Is the URL correct in `.env`?
   - Are you using the right IP for your device type?

### 3. Check Network Tab

If using Expo DevTools or Flipper:
1. Open Network tab
2. Look for requests to your API
3. Check request headers include:
   - `Authorization: Bearer {token}` (if logged in)
   - `Accept-Language: ar` or `en`

## 🔐 Security

### Development
For local development, HTTP is fine:
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Production
**Always use HTTPS in production:**
```bash
EXPO_PUBLIC_API_BASE_URL=https://api.imcksa.com/api/v1
```

This ensures:
- Data encryption in transit
- Token security
- Compliance with app store requirements

## 📦 EAS Build Configuration

For production builds with EAS, you can configure environment variables in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://api.imcksa.com/api/v1"
      }
    },
    "development": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://staging-api.imcksa.com/api/v1"
      }
    }
  }
}
```

## 🐛 Troubleshooting

### "Cannot read EXPO_PUBLIC_API_BASE_URL"

**Solution:**
1. Make sure `.env` file exists in `mobile-app/` directory
2. Restart Expo dev server with `--clear`:
   ```bash
   npx expo start --clear
   ```

### "Network request failed"

**Solution:**
1. Check Laravel is running:
   ```bash
   php artisan serve
   ```
2. Test API directly:
   ```bash
   curl http://localhost:8000/api/v1/site/homepage
   ```
3. For Android Emulator, use `10.0.2.2` instead of `localhost`
4. For physical device, use your computer's IP address

### "Connection refused"

**Solution:**
1. Make sure Laravel is listening on all interfaces:
   ```bash
   php artisan serve --host=0.0.0.0
   ```
2. Check firewall isn't blocking connections
3. Verify device and computer are on same WiFi network

## ✅ Quick Reference

| Environment | URL Format | Example |
|-------------|-----------|---------|
| iOS Simulator | `http://localhost:8000/api/v1` | Local dev |
| Android Emulator | `http://10.0.2.2:8000/api/v1` | Local dev |
| Physical Device | `http://YOUR_IP:8000/api/v1` | Local dev |
| Staging | `https://staging.domain.com/api/v1` | Testing |
| Production | `https://api.domain.com/api/v1` | Live |

---

**Current Configuration:** The app is pre-configured for iOS Simulator development. Update `.env` based on your testing device.
