# Mobile Testing Checklist

## Deployment Status
✅ **Build**: Successful (Next.js 16.1.6)
✅ **Deploy**: Production live at https://curiosity-hour.vercel.app
✅ **Icons**: PNG format (192px + 512px) with maskable purpose
✅ **Touch Targets**: All ≥44px minimum (WCAG 2.1 AA)

## Physical Device Testing Required

### iOS Testing (iPhone/iPad)
- [ ] Open Safari → visit curiosity-hour.vercel.app
- [ ] Test PWA installation: Share → "Add to Home Screen"
- [ ] Verify app launches in standalone mode (no Safari UI)
- [ ] Test touch targets feel responsive (44px+ minimum)
- [ ] Verify safe area insets (notch/home indicator)
- [ ] Test landscape orientation handling
- [ ] Test shared responses mode with second device
- [ ] Verify keyboard doesn't obscure inputs
- [ ] Test text-to-speech read aloud feature

### Android Testing (Phone/Tablet)
- [ ] Open Chrome → visit curiosity-hour.vercel.app
- [ ] Test PWA installation: Menu → "Install app"
- [ ] Verify app launches in standalone mode
- [ ] Test touch targets feel responsive
- [ ] Test shared responses mode with second device
- [ ] Verify keyboard behavior
- [ ] Test text-to-speech feature

## Touch Target Verification

| Element | Expected Size | Test Status |
|---------|--------------|-------------|
| Done/Skip buttons | 80px × 120px+ | ⏳ Pending |
| Player count buttons | 48px height | ⏳ Pending |
| Name inputs | 64px height | ⏳ Pending |
| Start Game button | 64px height | ⏳ Pending |
| Create/Join Room | 48px height | ⏳ Pending |
| Pro upgrade button | 48px+ height | ⏳ Pending |
| Speak button | 48px | ⏳ Pending |

## PWA Features to Verify

- [ ] App icon displays correctly on home screen
- [ ] App launches without browser chrome
- [ ] Offline mode works (service worker caching)
- [ ] Theme color matches app UI
- [ ] Orientation lock works (portrait mode)

## Responsive Breakpoints

- [ ] iPhone SE (375px width)
- [ ] iPhone 14/15 (390px width)
- [ ] iPhone Plus/Max (420px width)
- [ ] iPad Mini (768px width)
- [ ] iPad Pro (1024px width)

## Shared Responses Mode

- [ ] Create room on device A
- [ ] Join room on device B
- [ ] Verify real-time sync
- [ ] Test with iOS + Android combination
- [ ] Verify chat input doesn't cause layout shift

## Issues Found & Fixed

### Fixed
1. ✅ PWA icons: Converted from SVG to PNG format
2. ✅ Touch targets: All buttons now meet 44px minimum
3. ✅ Touch manipulation: Added `touch-manipulation` class
4. ✅ Safe area: Added `pb-safe` class for notched devices

### Requires Physical Testing
1. ⏳ PWA installation flow on iOS
2. ⏳ PWA installation flow on Android
3. ⏳ Actual touch feel on various screen sizes
4. ⏳ Shared responses mode on two physical devices
5. ⏳ Keyboard interaction on both platforms

## Next Steps

1. Test on physical iOS device
2. Test on physical Android device
3. Document any platform-specific issues
4. Fix any issues found during physical testing
5. Commit fixes to main branch

---

**Tested By**: AI Agent (automated analysis)
**Date**: 2026-03-19
**Build**: 2594809f
**URL**: https://curiosity-hour.vercel.app
