// Curiosity Hour — Button Component
// Primary, Secondary, Ghost, Outlined variants with animations

import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  borderRadius,
  spacing,
  touchTargets,
  animation,
  shadows,
  componentDefaults,
} from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================
// TYPES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large' | 'car';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

// ============================================
// BUTTON COMPONENT
// ============================================

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const pressed = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);

  // Loading state animation
  React.useEffect(() => {
    loadingOpacity.value = withTiming(loading ? 0.7 : 1, { duration: animation.fast });
  }, [loading]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 0.96],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        pressed.value,
        [0, 1],
        [1, 0.9],
        Extrapolation.CLAMP
      ),
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      pressed.value = withSpring(1, animation.spring);
    }
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: animation.micro });
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    small: {
      height: touchTargets.minimum,
      paddingHorizontal: spacing.md,
      minWidth: 80,
    },
    medium: {
      height: componentDefaults.button.primaryHeight,
      paddingHorizontal: spacing.lg,
      minWidth: 120,
    },
    large: {
      height: 64,
      paddingHorizontal: spacing.xl,
      minWidth: 160,
    },
    car: {
      height: touchTargets.extraLarge,
      paddingHorizontal: spacing.xl,
      minWidth: 200,
    },
  };

  // Text size styles
  const textSizeStyles: Record<ButtonSize, TextStyle> = {
    small: typography.buttonSmall,
    medium: typography.button,
    large: typography.carButton,
    car: typography.carButton,
  };

  // Variant container styles
  const variantContainerStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: colors.primary,
      ...shadows.card,
    },
    secondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: colors.error,
      ...shadows.card,
    },
  };

  // Variant text styles
  const variantTextStyles: Record<ButtonVariant, TextStyle> = {
    primary: { color: colors.textPrimary },
    secondary: { color: colors.textPrimary },
    outlined: { color: colors.primary },
    ghost: { color: colors.primary },
    danger: { color: colors.textPrimary },
  };

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantContainerStyles[variant],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const txtStyles: TextStyle[] = [
    styles.baseText,
    textSizeStyles[size],
    variantTextStyles[variant],
    disabled && styles.disabledText,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  // For primary/danger buttons, use gradient
  if (variant === 'primary' || variant === 'danger') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[containerStyles, animatedContainerStyle]}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        accessibilityLabel={accessibilityLabel || title}
      >
        <LinearGradient
          colors={
            variant === 'primary'
              ? [colors.primary, colors.primaryDark]
              : [colors.error, colors.errorLight]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientFill}
        >
          {loading ? (
            <ActivityIndicator color={colors.textPrimary} size="small" />
          ) : (
            <View style={styles.content}>
              {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
              <Text style={txtStyles}>{title}</Text>
              {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
            </View>
          )}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[containerStyles, animatedContainerStyle]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.textPrimary : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={txtStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
};

// ============================================
// ICON BUTTON (with tap feedback)
// ============================================

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large' | 'car';
  variant?: 'default' | 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 0.85],
            Extrapolation.CLAMP
          ),
        },
        {
          rotate: `${interpolate(
            pressed.value,
            [0, 1],
            [0, -5],
            Extrapolation.CLAMP
          )}deg`,
        },
      ],
      opacity: interpolate(
        pressed.value,
        [0, 1],
        [1, 0.8],
        Extrapolation.CLAMP
      ),
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      pressed.value = withSpring(1, animation.bouncy);
    }
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: animation.micro });
  };

  const sizeMap = {
    small: touchTargets.minimum,
    medium: componentDefaults.iconButton.size,
    large: componentDefaults.iconButtonLarge.size,
    car: touchTargets.extraLarge,
  };

  const containerStyles: ViewStyle[] = [
    styles.iconButtonBase,
    { width: sizeMap[size], height: sizeMap[size] },
    variant === 'primary' && { backgroundColor: colors.primary, ...shadows.glow },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    variant === 'default' && { backgroundColor: colors.surface },
    disabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[containerStyles, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
    </AnimatedPressable>
  );
};

// ============================================
// FLOATING ACTION BUTTON
// ============================================

interface FABProps {
  icon: React.ReactNode;
  onPress: () => void;
  label?: string;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  onPress,
  label,
  variant = 'primary',
  style,
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 0.92],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, animation.spring);
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: animation.micro });
  };

  const isPrimary = variant === 'primary';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.fab,
        isPrimary ? styles.fabPrimary : styles.fabSecondary,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
    >
      {label ? (
        <View style={styles.fabContent}>
          <View style={styles.fabIcon}>{icon}</View>
          <Text style={[styles.fabLabel, isPrimary ? styles.fabLabelPrimary : styles.fabLabelSecondary]}>
            {label}
          </Text>
        </View>
      ) : (
        icon
      )}
    </AnimatedPressable>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Base button
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: componentDefaults.button.borderRadius,
    overflow: 'hidden',
  },
  baseText: {
    textAlign: 'center',
  },

  // Content layout
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  gradientFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: componentDefaults.button.borderRadius,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },

  // States
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },

  // Icon button
  iconButtonBase: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },

  // FAB
  fab: {
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },
  fabPrimary: {
    backgroundColor: colors.primary,
    minWidth: 60,
    height: 60,
  },
  fabSecondary: {
    backgroundColor: colors.surfaceElevated,
    minWidth: 56,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  fabIcon: {
    marginRight: spacing.xs,
  },
  fabLabel: {
    ...typography.button,
  },
  fabLabelPrimary: {
    color: colors.textPrimary,
  },
  fabLabelSecondary: {
    color: colors.textPrimary,
  },
});

export default Button;
