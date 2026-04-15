# PWA Offline Support Verification Checklist

## Implementation Summary

### 1. Service Worker Integration ✅
- **File**: `/public/sw.js`
- **Version**: v3 (updated from v2)
- **Caching Strategies**:
  - **Cache-First**: Static assets (manifest, icons), images
  - **Network-First**: Navigation requests (HTML pages)
  - **Stale-While-Revalidate**: CSS, JavaScript, fonts
- **Note**: Question data is bundled at build time via `lib/questions.ts` (static imports), so it's automatically cached as part of the JavaScript bundles

### 2. Manifest Optimization ✅
- **File**: `/public/manifest.json`
- **Improvements**:
  - Added `scope` field for proper URL scope definition
  - Added `categories`, `lang`, `dir` for better PWA metadata
  - Added `maskable` purpose icons for adaptive icon support on Android
  - Added app shortcuts (New Game)
  - Added share_target for sharing questions
  - All required icons present (192x192, 512x512)

### 3. Offline UI ✅
- **Component**: `/components/OfflineIndicator.tsx`
- **Features**:
  - Shows amber notification when offline
  - Shows green notification when back online
  - Auto-dismisses after 3-5 seconds
  - Fixed position at bottom center of screen
- **Integration**: Added to `app/layout.tsx`

### 4. Service Worker Registration ✅
- **Component**: `/components/PWAInitializer.tsx` (updated)
- **Features**:
  - Registers SW with proper scope
  - Periodic update checks (every hour)
  - Listens for controller changes

---

## Manual Verification Steps

### Chrome DevTools Testing

#### 1. Verify Service Worker Registration
```
1. Open Chrome DevTools (F12)
2. Go to Application tab → Service Workers
3. Verify:
   - sw.js is registered
   - Status shows "Activated"
   - Cache name shows "curiosity-hour-v3"
```

#### 2. Verify Cache Contents
```
1. In DevTools → Application → Cache Storage
2. Open "curiosity-hour-v3" cache
3. Verify cached items:
   - / (root page)
   - /manifest.json
   - /icon-192.png
   - /icon-512.png

Note: Question data is bundled in JavaScript chunks at build time,
so it's automatically cached as part of the static JS bundles.
Check the "chunks" folder in Cache Storage to see cached JS files.
```

#### 3. Test Offline Mode
```
1. Load the app normally first (to populate cache)
2. In DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Refresh the page (Ctrl+R)
5. Verify:
   - App loads successfully
   - Offline indicator appears (amber)
   - Questions are selectable (data is bundled in JS)
   - Navigation works
   - No network errors in Console
```

#### 4. Test Question Selection Offline
```
1. While offline (see step 3)
2. Start a new game
3. Select different relationship modes
4. Verify:
   - Questions load from cache (bundled in JS)
   - Can advance through questions
   - Can skip questions
   - Can filter by category
   - All question data is accessible
```

#### 5. Test Reconnection
```
1. Uncheck "Offline" in DevTools
2. Verify:
   - Online indicator appears (green)
   - Indicator auto-dismisses after ~3 seconds
   - App continues working normally
```

### Safari Testing (iOS)

#### 1. Verify PWA Installation
```
1. Open app in Safari on iOS
2. Tap Share → Add to Home Screen
3. Verify:
   - App name shows "Curiosity Hour"
   - Icon displays correctly
   - Opens in standalone mode (no Safari UI)
```

#### 2. Test Offline on iOS
```
1. Enable Airplane Mode
2. Open app from Home Screen
3. Verify:
   - App loads
   - Questions are accessible
   - Offline indicator appears
```

---

## Automated Testing (Future)

### Playwright Test Scenarios

```typescript
// tests/pwa-offline.spec.ts
test('app loads offline', async ({ page }) => {
  // Load app online first
  await page.goto('/');
  
  // Go offline
  await page.context().setOffline(true);
  
  // Reload and verify
  await page.reload();
  await expect(page.locator('text=Curiosity Hour')).toBeVisible();
});

test('questions available offline', async ({ page }) => {
  await page.goto('/');
  await page.context().setOffline(true);
  
  // Start game
  await page.click('text=Start Game');
  await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
});
```

---

## Build & Deployment

### Build Command
```bash
cd /root/.openclaw/workspace/projects/curiosity-hour
npm run build
```

### Verify Build Output
```bash
# Check that public/sw.js exists
ls -la public/sw.js public/manifest.json

# Check static chunks are generated
ls -la .next/static/chunks/
```

### Start Production Server
```bash
npm run start
```

---

## Known Limitations

1. **First Load Requires Network**: The app needs to be loaded at least once while online to cache all assets.

2. **Dynamic Content**: Custom questions added by users are stored in localStorage and work offline automatically.

3. **Shared Room Feature**: Real-time room features require network connection and will show appropriate errors when offline.

4. **Pro Features**: Upgrade/monetization features require network for payment processing.

---

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Verify sw.js is served from correct path
- Clear browser cache and reload

### Cache Not Populating
- Check network tab for failed requests
- Check service worker logs in DevTools
- Verify build completed successfully (question data is bundled at build time)

### Offline Indicator Not Showing
- Verify OfflineIndicator component is imported in layout.tsx
- Check browser console for JavaScript errors
- Test navigator.onLine in browser console

---

## Files Modified/Created

| File | Type | Description |
|------|------|-------------|
| `/public/sw.js` | Modified | Enhanced service worker with multiple caching strategies |
| `/public/manifest.json` | Modified | Optimized PWA manifest with shortcuts and share target |
| `/components/PWAInitializer.tsx` | Modified | Updated SW registration with update checks |
| `/components/OfflineIndicator.tsx` | Created | Online/offline status indicator component |
| `/app/layout.tsx` | Modified | Integrated OfflineIndicator component |
| `/PWA-OFFLINE-VERIFICATION.md` | Created | This verification document |

---

## Next Steps (Optional Enhancements)

1. **Install Prompt**: Add a custom "Install App" prompt for better UX
2. **Update Notification**: Notify users when a new SW version is available
3. **Offline Fallback Page**: Create a dedicated offline.html fallback page
4. **Background Sync**: Queue actions (like custom questions) for sync when online
5. **Push Notifications**: Add push notification support for shared room updates
