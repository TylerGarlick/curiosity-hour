# Curiosity Hour Mobile App - Testing Guide

## Overview

The React Native Expo mobile app is located in `/mobile-app/`. It includes all core screens:
- WelcomeScreen (index)
- QuestionScreen
- CategoriesScreen  
- SharedRoomScreen (room flow)
- SettingsScreen
- ProfileScreen

## Quick Start for Testing

### Option 1: Expo Go (Fastest)

1. **Install Expo Go on your phone:**
   - **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android**: Download from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Open terminal in the mobile-app directory:**
   ```bash
   cd /path/to/curiosity-hour/mobile-app
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

4. **Scan QR code:**
   - Open Expo Go on your phone
   - Tap "Scan QR Code" 
   - Point your camera at the QR code shown in the terminal

### Option 2: Run on Connected Device

If your phone is connected via USB:

```bash
cd mobile-app
npx expo run:android    # For Android
npx expo run:ios         # For iOS (macOS only)
```

### Option 3: Run in Emulator

```bash
cd mobile-app
npx expo start
```
Then press `a` for Android emulator or `i` for iOS simulator.

---

## Building Standalone APK/IPA

### Android (APK for distribution)

**Prerequisites:**
- Java 17+ installed
- Android SDK installed
- Set JAVA_HOME environment variable

**Build:**
```bash
cd mobile-app

# Option A: Using Expo EAS (recommended)
eas build --platform android --profile preview

# Option B: Local build
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS (IPA for distribution)

**Prerequisites:**
- macOS with Xcode
- Apple Developer Account

**Build:**
```bash
cd mobile-app

# Using Expo EAS (recommended)
eas build --platform ios --profile preview

# Local build requires macOS
npx expo run:ios --configuration Release
```

---

## App Features

### Screens

1. **Welcome Screen** (`/`)
   - Enter player names
   - Select relationship mode (Friends/Dating/Married)
   - Start solo game
   - Create or join shared room

2. **Question Screen** (`/(tabs)/question`)
   - View current question
   - Mark as answered or skip
   - See progress bar
   - Category badge display

3. **Categories Screen** (`/(tabs)/categories`)
   - Browse all categories
   - Select specific category
   - View question counts per category

4. **Room Screen** (`/(tabs)/room`)
   - Create new room
   - Join existing room with code
   - View active room status

5. **Shared Room** (`/room/[code]`)
   - Answer questions privately
   - See other players' status
   - Reveal answers simultaneously

6. **Settings** (`/settings`)
   - Toggle dark mode
   - Toggle notifications
   - Toggle sound effects
   - Toggle haptic feedback
   - View custom questions
   - Reset progress

7. **Profile** (`/(tabs)/profile`)
   - View stats (answered, streak)
   - Manage preferences
   - Upgrade to Pro

### Categories

- **Deep** (🤔) - Thought-provoking questions
- **Funny** (😂) - Light-hearted fun
- **Intimate** (❤️) - Personal questions
- **Nostalgia** (📸) - Memory-triggering questions
- **Spicy** (🌶️) - Adventurous questions
- **Would You Rather** (🤨) - Choice-based questions

---

## Troubleshooting

### Metro bundler issues
```bash
cd mobile-app
rm -rf node_modules
npm install
npx expo start --clear
```

### Android build fails
- Ensure JAVA_HOME is set to Java 17+
- Ensure Android SDK is installed
- Try `cd android && ./gradlew clean`

### iOS build fails
- Ensure Xcode is up to date
- Run `cd ios && pod install`
- Ensure iOS deployment target is correct

---

## Project Structure

```
mobile-app/
├── App.tsx                 # App entry with navigation
├── app/                    # Expo Router screens
│   ├── index.tsx           # Welcome screen
│   ├── settings.tsx        # Settings screen
│   ├── (tabs)/             # Tab navigation
│   │   ├── _layout.tsx     # Tab layout
│   │   ├── index.tsx       # Home tab
│   │   ├── categories.tsx  # Categories tab
│   │   ├── question.tsx    # Question tab
│   │   ├── room.tsx        # Room tab
│   │   └── profile.tsx     # Profile tab
│   └── room/               # Modal screens
│       ├── create.tsx      # Create room
│       ├── join.tsx        # Join room
│       └── [code].tsx      # Active room
├── src/
│   ├── constants/
│   │   └── theme.ts        # Colors, spacing, typography
│   └── data/
│       └── questions.ts    # Question data
└── assets/                 # App icons
```

---

## Notes

- Questions are loaded from the main app's JSON files (deep_questions.json, etc.)
- The shared room feature uses mock data for MVP (no backend required)
- State is persisted with AsyncStorage
- All screens are touch-optimized with 44px minimum touch targets
