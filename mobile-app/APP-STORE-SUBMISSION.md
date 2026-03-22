# Curiosity Hour - App Store Submission Guide

## Current App State

**Bundle ID (iOS):** `com.curiosityhour.app`
**Package Name (Android):** `com.curiosityhour.app`
**Version:** 1.0.0
**Expo SDK:** 54.0.33
**React Native:** 0.81.5

## Pre-Submission Checklist

### Required for iOS (Apple App Store)
- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect access
- [ ] App icons (1024x1024 for App Store)
- [ ] Screenshots (iPhone 6.5", 6.7", 5.5", iPad Pro 12.9")
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Category selection
- [ ] Age rating (4+ for Curiosity Hour)
- [ ] Content rights declaration
- [ ] Export compliance (not required for Q&A)

### Required for Android (Google Play Store)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Google Play Console access
- [ ] App icons (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Phone screenshots (min 2)
- [ ] Tablet screenshots (optional)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire

## Build Commands

### iOS Build (requires Mac with Xcode)
```bash
cd /home/ubuntu/.openclaw/workspace/curiosity-hour/mobile-app

# First time setup
npx expo prebuild --platform ios
eas credentials --platform ios

# Build for simulator (testing)
eas build --platform ios --profile simulator

# Build for TestFlight
eas build --platform ios --profile preview
```

### Android Build
```bash
cd /home/ubuntu/.openclaw/workspace/curiosity-hour/mobile-app

# First time setup
npx expo prebuild --platform android

# Build debug APK (testing)
eas build --platform android --profile debug

# Build release AAB (Play Store)
eas build --platform android --profile production
```

## EAS Build Configuration

Create `eas.json` in the mobile-app directory:

```json
{
  "cli": {
    "version": ">= 9.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "ios": {
        "simulator": false,
        "distribution": "internal"
      },
      "android": {
        "distribution": "internal"
      }
    },
    "production": {
      "ios": {
        "simulator": false,
        "distribution": "app-store"
      },
      "android": {
        "distribution": "play-store"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID",
        "ascAppId": "YOUR_ASC_APP_ID"
      },
      "android": {
        "serviceAccountJsonPath": "./path-to-service-account.json",
        "track": "production"
      }
    }
  }
}
```

## Permissions Configuration

The app uses `expo-iap` for in-app purchases. No special permissions required beyond:
- `com.apple.developer.in-app-payments` (Apple Pay - optional)
- `com.google.android.gms.permission.BILLING` (Google Play Billing)

No location, camera, or microphone permissions required.

## Submission Process

### iOS via App Store Connect
1. Run `eas build --platform ios --profile production`
2. Wait for build completion (typically 10-20 minutes)
3. EAS will automatically submit to TestFlight OR:
   - Download the IPA from EAS
   - Upload via Xcode: Product > Archive > Distribute
4. In App Store Connect:
   - Complete app information
   - Upload screenshots
   - Select pricing and availability
   - Add review notes (mention: game for couples/friends, no user-generated content)
5. Submit for review
6. Review typically takes 24-48 hours

### Android via Google Play Console
1. Run `eas build --platform android --profile production`
2. Wait for build completion (typically 5-15 minutes)
3. Download the AAB from EAS
4. In Google Play Console:
   - Create new app
   - Complete store listing
   - Upload AAB
   - Fill out content rating questionnaire
   - Set up pricing (Free or $0.00-0.99 for paid packs)
   - Complete trust and safety questionnaire
5. Submit for review
6. Review typically takes 1-7 days (faster for updates)

## Troubleshooting

### iOS Build Failures
- Ensure Xcode Command Line Tools are installed
- Verify Apple Developer certificates are valid
- Check for any Expo build conflicts with `expo doctor`

### Android Build Failures
- Verify Google Play Console API access
- Ensure package name matches exactly
- Check ProGuard/R8 configuration if needed

### Common Issues
- **App Store rejection for "Incomplete Information"**: Ensure all required fields in App Store Connect are filled
- **Play Store rejection for "Sensitive Permissions"**: Ensure permissions in app.json match actual usage
- **Build timeout**: Use `eas build --wait` to poll for completion
