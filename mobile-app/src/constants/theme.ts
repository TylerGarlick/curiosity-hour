// Theme constants matching the web app
export const colors = {
  // Background colors
  bg: '#1a1a2e',
  surface: '#16213e',
  card: '#0f3460',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textMuted: '#718096',
  
  // Accent colors
  accent: '#e94560',
  accentLight: '#ff6b8a',
  
  // Status colors
  success: '#48bb78',
  warning: '#ed8936',
  error: '#fc8181',
  
  // Border
  border: '#2d3748',
  borderLight: '#4a5568',
  
  // Category colors
  deep: '#805ad5',
  intimate: '#d53f8c',
  funny: '#ed8936',
  nostalgia: '#38b2ac',
  spicy: '#e94560',
  custom: '#4299e1',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textMuted,
  },
};