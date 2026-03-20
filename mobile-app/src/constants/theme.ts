// Curiosity Hour — Warm Bold Design System
// Phase 1 Foundation - Vibrant, Accessible, Car-Mode Friendly

// ============================================
// COLOR PALETTE
// ============================================

export const colors = {
  // Core backgrounds (dark mode default)
  background: '#0D0D12',
  bg: '#0D0D12', // Alias for backward compatibility

  surface: '#1A1A24',
  surfaceElevated: '#252532',
  surfaceOverlay: 'rgba(0,0,0,0.6)',

  // Primary — Warm coral/amber (the "Curiosity" color)
  primary: '#FF6B4A',
  primaryDark: '#E55A3A',
  primaryLight: '#FF8F6B',
  primaryGlow: 'rgba(255,107,74,0.25)',

  // Secondary — Deep teal
  secondary: '#2DD4BF',
  secondaryDark: '#14B8A6',
  secondaryLight: '#5EEAD4',

  // Accent — Electric purple for contrast
  accent: '#A855F7',
  accentDark: '#9333EA',
  accentLight: '#C084FC',

  // Category Gradients (bold, saturated, accessible)
  categories: {
    deep: { from: '#FF6B4A', to: '#FF8F6B', label: 'Deep Talk', text: '#FFFFFF' },
    intimate: { from: '#A855F7', to: '#C084FC', label: 'Intimate', text: '#FFFFFF' },
    spicy: { from: '#EF4444', to: '#F87171', label: 'Spicy', text: '#FFFFFF' },
    nostalgia: { from: '#F59E0B', to: '#FBBF24', label: 'Nostalgia', text: '#000000' },
    wouldYouRather: { from: '#3B82F6', to: '#60A5FA', label: 'Would You Rather', text: '#FFFFFF' },
    nsfw: { from: '#EC4899', to: '#F472B6', label: 'NSFW', text: '#FFFFFF' },
  },

  // Text hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#000000',

  // Semantic colors (WCAG AA compliant on dark backgrounds)
  success: '#22C55E',       // 4.5:1+ on dark
  successLight: '#4ADE80',
  skip: '#3B82F6',          // Blue for skip
  skipLight: '#60A5FA',
  warning: '#F59E0B',       // Amber warning
  warningLight: '#FBBF24',
  error: '#EF4444',         // Red error
  errorLight: '#F87171',

  // Car Mode (max contrast for driving)
  carBackground: '#000000',
  carSurface: '#1A1A1A',
  carText: '#FFFFFF',
  carAccent: '#FF6B4A',
  carSecondary: '#2DD4BF',

  // Borders
  border: '#2D3748',
  borderLight: '#3D4758',
  borderFocus: '#FF6B4A',

  // Transparent overlays
  backdropDark: 'rgba(0,0,0,0.7)',
  backdropLight: 'rgba(255,255,255,0.1)',
} as const;

// Category type for type-safe access
export type CategoryKey = keyof typeof colors.categories;

// ============================================
// TYPOGRAPHY SCALE
// ============================================

export const typography = {
  // Car Mode - Extra large for glanceability
  carQuestion: {
    fontSize: 38,
    lineHeight: 50,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  carButton: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  carLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  // Hero/Question text
  heroQuestion: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },

  // Section headings
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },

  // Card titles
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  // Body text (WCAG minimum 16px)
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },

  // Heading aliases for backward compatibility
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },

  // Button text
  button: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },

  // Captions and labels (WCAG minimum 13px)
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
  },

  // Small labels (not for critical info)
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

// ============================================
// SPATIAL SYSTEM (8pt grid)
// ============================================

export const spacing = {
  // Base spacing units
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Specific use cases
  screenPadding: 20,
  cardPadding: 24,
  sectionGap: 32,
  itemGap: 12,
} as const;

// Border radius system
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 9999,
} as const;

// Touch targets (WCAG 2.1 AA requires 44x44 minimum)
export const touchTargets = {
  minimum: 44,      // WCAG absolute minimum
  comfortable: 48,  // Good touch target
  large: 56,        // Car mode friendly
  extraLarge: 64,   // Primary actions in car mode
} as const;

// ============================================
// ANIMATION CONFIGS
// ============================================

export const animation = {
  // Durations
  micro: 100,      // Haptic-like feedback
  fast: 150,       // Quick state changes
  standard: 200,   // Default transitions
  slow: 300,       // Emphasis transitions
  slower: 400,     // Dramatic transitions
  page: 350,       // Page transitions

  // Spring physics (natural feel)
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },

  // Bouncy spring (playful)
  bouncy: {
    damping: 10,
    stiffness: 180,
    mass: 0.8,
  },

  // Smooth easing
  easing: {
    standard: 'cubic(0.4, 0, 0.2, 1)',
    decelerate: 'cubic(0, 0, 0.2, 1)',
    accelerate: 'cubic(0.4, 0, 1, 1)',
  },
} as const;

// ============================================
// SHADOW / ELEVATION
// ============================================

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  glowSecondary: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// ============================================
// COMPONENT DEFAULTS
// ============================================

export const componentDefaults = {
  button: {
    primaryHeight: 56,
    secondaryHeight: 48,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  input: {
    height: 56,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  iconButton: {
    size: touchTargets.comfortable,
    iconSize: 24,
  },
  iconButtonLarge: {
    size: touchTargets.large,
    iconSize: 32,
  },
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

export const zIndex = {
  base: 0,
  card: 1,
  raised: 10,
  modal: 100,
  toast: 200,
  tooltip: 300,
} as const;

// Export all theme tokens
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  touchTargets,
  animation,
  shadows,
  componentDefaults,
  zIndex,
} as const;

export type Theme = typeof theme;

export default theme;
