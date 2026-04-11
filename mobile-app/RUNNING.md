# Running Curiosity Hour Mobile

## Quick Start with Expo Go

### Option 1: Development Server (Recommended for Testing)

1. **Install Expo Go** on your device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**:
   ```bash
   cd mobile-app
   npx expo start --tunnel
   ```

3. **Scan the QR code**:
   - iOS: Open Camera app and scan the QR code
   - Android: Open Expo Go app and scan the QR code

4. **The app will load** in Expo Go!

### Option 2: EAS Build (Production APK/IPA)

To build a standalone app you can install without Expo Go:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS** (if not already done):
   ```bash
   eas build:configure
   ```

4. **Build for Android**:
   ```bash
   eas build --platform android --profile preview
   ```

5. **Build for iOS**:
   ```bash
   eas build --platform ios --profile preview
   ```

6. **Download and install** the build from the provided URL

## Current Status

✅ Dependencies installed
✅ Expo configured
✅ Development server ready
✅ Tunnel mode enabled (works behind NAT/firewalls)

## Troubleshooting

### Port Conflicts
If port 8081 is in use:
```bash
npx expo start --port 8082
```

### Tunnel Issues
If tunnel mode fails, try local mode (requires same network):
```bash
npx expo start
```

### Build Errors
Run doctor to check for issues:
```bash
npx expo-doctor
```

## Assets

Make sure these files exist in `assets/`:
- `icon.png` (1024x1024)
- `splash-icon.png` (1242x2436 recommended)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)
