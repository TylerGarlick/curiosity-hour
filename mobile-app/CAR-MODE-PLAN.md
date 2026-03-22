# Car Mode Screen - Implementation Plan

## Overview
Car Mode provides a distraction-free, voice-first interface for playing Curiosity Hour while driving. Questions are read aloud using text-to-speech and large touch targets allow hands-free operation.

## Files to Create/Modify

### 1. Create Car Mode Screen
**File:** `app/(tabs)/car-mode.tsx`

### 2. Update Tab Navigation
**File:** `app/(tabs)/_layout.tsx` - Add Car Mode tab

### 3. Integrate TTS Service
**File:** `src/services/tts.ts` - Already created

### 4. Update Settings
**File:** `app/settings.tsx` - Car Mode toggle exists but doesn't navigate to Car Mode screen

## Car Mode Screen Requirements

### Layout
- Full-screen, high-contrast UI
- Background color: #0a0a1a (dark)
- Text color: #FFFFFF (white)
- Minimum touch target: 60px

### Elements
1. **Question Display** - Large text (32px+), centered
2. **Category Badge** - Top, shows current category
3. **Progress** - Bottom, shows answered/skipped count
4. **Action Buttons** (60px+ height):
   - Skip (left)
   - Mark as Answered (center)
   - Replay/Re-read (small, bottom-right corner)
5. **Exit Button** - Top-left, returns to normal mode

### TTS Integration
```typescript
import { speak, stop } from '../../src/services/tts';
import { useSettingsStore } from '../../src/stores/settingsStore';

// When question changes and carModeAutoTTS is true:
speak(question.text, { rate: carModeSpeed });

// On skip/answer:
stop();
```

### Auto-Advance Behavior
After 3 seconds of silence following an action, auto-advance to next question.

## Screen States
1. **Loading** - "Loading question..."
2. **Question Active** - Shows question, TTS reading
3. **Transitioning** - Brief pause before next question
4. **Game Complete** - "Game Over" with replay option
5. **No Questions** - Error state if no questions available

## Navigation
- Accessed from settings toggle OR dedicated tab
- Back button exits Car Mode (with confirmation if mid-question)
