# Curiosity Hour Native Mobile App - Mockup Documentation

## Overview

This document outlines the screen structure and design for the Curiosity Hour native mobile app, built with Expo/React Native.

---

## Screen Structure

```
App
├── WelcomeScreen (/)
│   └── Player name inputs
│   └── Relationship mode selector
│   └── Solo / Create Room / Join Room buttons
├── (Tabs)
│   ├── Categories (/categories)
│   ├── Question (/question)
│   ├── Room (/room)
│   └── Profile (/profile)
├── Room
│   └── CreateRoomModal
│   └── JoinRoomModal
└── Settings (/settings)
```

---

## Screens

### 1. Welcome Screen (/)

**Purpose:** Entry point - players enter names and choose mode

**Components:**
- Logo + app name + tagline
- Player 1 name input
- Player 2 name input (for shared mode)
- Relationship mode selector (Friends / Dating / Married)
- Action buttons:
  - "Start Solo" - Single player mode
  - "Create Room" - Create shared room
  - "Join Room" - Join with code

**Visual Design:**
- Background: Deep purple (#1a1a2e)
- Primary accent: Purple (#7c3aed)
- Text: White/gray

---

### 2. Categories Screen (/categories)

**Purpose:** Select question categories for solo play

**Components:**
- Category grid (2 columns)
- Categories: Deep, Funny, General, Intimate, Nostalgia, NSFW, Spicy, Would You Rather
- "Start Game" button

---

### 3. Question Screen (/question)

**Purpose:** Display questions and capture responses

**Components:**
- Question card (large, centered)
- Answer input field
- Timer (optional)
- "Skip" button
- "Mark Answered" button

**States:**
- Loading new question
- Question displayed
- Answer submitted
- Next question loading

---

### 4. Shared Room Screen (/room)

**Purpose:** Multiplayer question mode

**Components:**
- Room code display
- Player status indicators
- Question display
- Private answer input
- Waiting for other player indicator
- Revealed responses view

**Flow:**
1. Both players join room
2. Question displayed to both
3. Both submit answers privately
4. Both revealed simultaneously
5. "Play Again" or "Back to Solo"

---

### 5. Profile Screen (/profile)

**Purpose:** User stats and settings

**Components:**
- Questions answered count
- Current streak
- Favorite category
- Settings link

---

### 6. Settings Screen (/settings)

**Purpose:** App configuration

**Components:**
- Sound effects toggle
- Haptic feedback toggle
- Dark/Light mode (default dark)
- Clear data option
- About/Version info

---

## Navigation

- **Tab Navigation:** Bottom tabs for main screens
- **Stack Navigation:** For modals and detail screens

---

## Technical Stack

- **Framework:** Expo SDK 52
- **Language:** TypeScript
- **Navigation:** expo-router
- **State Management:** React Context + useReducer

---

## Platform Support

- **iOS:** 13.0+
- **Android:** API 24+ (Android 7.0)

---

## Mockup Status

✅ App structure created with expo-router
✅ Welcome screen implemented
✅ Categories screen implemented  
✅ Question screen implemented
✅ Room (shared responses) screen implemented
✅ Profile screen implemented
✅ Settings screen implemented

**Next Steps:**
- Generate app icons and splash screen
- Test on physical devices
- Build iOS .ipa and Android .apk
- Submit to App Store / Play Store