// Curiosity Hour — Page Transitions & Animations
// Slide, Fade, and Modal transitions with WCAG compliance

import React from 'react';
import { StyleSheet, ViewStyle, TextStyle, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  SlideInRight,
  SlideOutLeft,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  borderRadius,
  spacing,
  animation,
  shadows,
  touchTargets,
} from '../../constants/theme';

// ============================================
// CUSTOM FADE + SLIDE COMBO (replaces missing FadeInDown/FadeOutUp)
// ============================================

const FadeInDown: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <Animated.View entering={SlideInDown.delay(delay).springify()}>
    {children}
  </Animated.View>
);

const FadeOutUp: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Animated.View exiting={SlideOutUp.duration(animation.fast)}>
    {children}
  </Animated.View>
);

const SlideInLeft: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <Animated.View entering={SlideInRight.delay(delay).springify()}>
    {children}
  </Animated.View>
);

// ============================================
// PAGE TRANSITION WRAPPER
// ============================================

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'slide' | 'fade' | 'modal' | 'slideUp';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'slide',
  duration = animation.page,
}) => {
  const getEnterAnimation = () => {
    switch (type) {
      case 'fade':
        return FadeIn.duration(duration);
      case 'modal':
      case 'slideUp':
        return SlideInUp.duration(duration).springify();
      case 'slide':
      default:
        return SlideInRight.duration(duration);
    }
  };

  return (
    <Animated.View
      entering={getEnterAnimation()}
      style={styles.pageContainer}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// ANIMATED STAGGER LIST (for lists with entrance animation)
// ============================================

interface StaggerListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
}

export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  staggerDelay = 50,
  initialDelay = 100,
}) => {
  return (
    <View style={styles.staggerContainer}>
      {React.Children.map(children, (child, index) => (
        <Animated.View
          key={index}
          entering={FadeIn.delay(initialDelay + index * staggerDelay).duration(animation.standard)}
          exiting={FadeOut.duration(animation.fast)}
        >
          {child}
        </Animated.View>
      ))}
    </View>
  );
};

// ============================================
// FADE IN VIEW (for on-screen entrance)
// ============================================

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = animation.standard,
  style,
}) => {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(duration)}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// SLIDE IN VIEW (directional entrance)
// ============================================

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'up',
  delay = 0,
  style,
}) => {
  const getEnteringAnimation = () => {
    switch (direction) {
      case 'up':
        return SlideInUp.delay(delay).springify();
      case 'down':
        return SlideInDown.delay(delay).springify();
      case 'left':
        return SlideInRight.delay(delay).springify();
      case 'right':
        return SlideOutLeft.delay(delay).springify();
      default:
        return SlideInUp.delay(delay).springify();
    }
  };

  return (
    <Animated.View
      entering={getEnteringAnimation()}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// PULSE ANIMATION (for attention indicators)
// ============================================

interface PulseViewProps {
  children: React.ReactNode;
  active?: boolean;
  style?: ViewStyle;
}

export const PulseView: React.FC<PulseViewProps> = ({
  children,
  active = true,
  style,
}) => {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        pulse.value = withTiming(1.05, { duration: 600 }, () => {
          pulse.value = withTiming(1, { duration: 600 });
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ============================================
// SHAKE ANIMATION (for errors/wrong answers)
// ============================================

interface ShakeViewProps {
  children: React.ReactNode;
  trigger?: boolean;
  style?: ViewStyle;
}

export const ShakeView: React.FC<ShakeViewProps> = ({
  children,
  trigger = false,
  style,
}) => {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (trigger) {
      // Shake sequence: left, right, left, center
      translateX.value = withTiming(-10, { duration: 50 }, () => {
        translateX.value = withTiming(10, { duration: 100 }, () => {
          translateX.value = withTiming(-10, { duration: 100 }, () => {
            translateX.value = withTiming(10, { duration: 100 }, () => {
              translateX.value = withTiming(0, { duration: 50 });
            });
          });
        });
      });
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ============================================
// BOUNCE ANIMATION (for success/correct answers)
// ============================================

interface BounceViewProps {
  children: React.ReactNode;
  trigger?: boolean;
  onComplete?: () => void;
  style?: ViewStyle;
}

export const BounceView: React.FC<BounceViewProps> = ({
  children,
  trigger = false,
  onComplete,
  style,
}) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (trigger) {
      scale.value = withSpring(1.2, { damping: 4, stiffness: 200 }, () => {
        scale.value = withSpring(1, { damping: 8, stiffness: 300 }, () => {
          if (onComplete) {
            runOnJS(onComplete)();
          }
        });
      });
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ============================================
// GLOW EFFECT (for active elements)
// ============================================

interface GlowViewProps {
  children: React.ReactNode;
  color?: string;
  active?: boolean;
  style?: ViewStyle;
}

export const GlowView: React.FC<GlowViewProps> = ({
  children,
  color = colors.primary,
  active = true,
  style,
}) => {
  const glowOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        glowOpacity.value = withTiming(0.6, { duration: 800 }, () => {
          glowOpacity.value = withTiming(0.3, { duration: 800 });
        });
      }, 1600);
      return () => clearInterval(interval);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      shadowOpacity: glowOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.glowContainer,
        { shadowColor: color },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// ICON BUTTON WITH TAP FEEDBACK (standalone)
// ============================================

interface AnimatedIconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  icon,
  onPress,
  size = touchTargets.comfortable,
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.8], Extrapolation.CLAMP) },
        { rotate: `${interpolate(pressed.value, [0, 1], [0, -8], Extrapolation.CLAMP)}deg` },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, 0.7], Extrapolation.CLAMP),
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      pressed.value = withSpring(1, { damping: 8, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: animation.micro });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2 },
        disabled && styles.iconButtonDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={animatedStyle}>
        {icon}
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// ANSWER BUTTONS (Answer/Skip with feedback)
// ============================================

interface AnswerButtonProps {
  type: 'answer' | 'skip';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  type,
  onPress,
  disabled = false,
  style,
}) => {
  const pressed = useSharedValue(0);
  const isAnswer = type === 'answer';
  const baseColor = isAnswer ? colors.success : colors.skip;

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 0.94],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        pressed.value,
        [0, 1],
        [1, 0.85],
        Extrapolation.CLAMP
      ),
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      pressed.value = withSpring(1, animation.spring);
    }
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: animation.micro });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.answerButton,
        { backgroundColor: baseColor },
        disabled && styles.answerButtonDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={isAnswer ? 'Mark as answered' : 'Skip question'}
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[styles.answerButtonContent, animatedStyle]}>
        <Text style={styles.answerButtonIcon}>{isAnswer ? '✓' : '→'}</Text>
        <Text style={styles.answerButtonText}>
          {isAnswer ? 'Answered' : 'Skip'}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// LOADING SPINNER
// ============================================

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = colors.primary,
  style,
}) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      rotation.value = (rotation.value + 30) % 360;
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const sizeMap = {
    small: 16,
    medium: 32,
    large: 48,
  };

  return (
    <Animated.View
      style={[
        styles.spinner,
        { width: sizeMap[size], height: sizeMap[size] },
        animatedStyle,
        style,
      ]}
    >
      <LinearGradient
        colors={[color, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.spinnerGradient}
      />
    </Animated.View>
  );
};

// ============================================
// MODAL BACKDROP
// ============================================

interface ModalBackdropProps {
  visible: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  visible,
  onPress,
  children,
}) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: animation.standard });
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value,
      pointerEvents: visible ? 'auto' : 'none',
    };
  });

  return (
    <Animated.View
      style={[styles.backdrop, backdropStyle]}
      onTouchEnd={onPress}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  staggerContainer: {
    gap: spacing.md,
  },
  glowContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 12,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  answerButton: {
    minHeight: touchTargets.extraLarge,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    ...shadows.card,
  },
  answerButtonDisabled: {
    opacity: 0.5,
  },
  answerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  answerButtonIcon: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  answerButtonText: {
    ...typography.carButton,
    color: colors.textPrimary,
  },
  spinner: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  spinnerGradient: {
    flex: 1,
    borderRadius: borderRadius.full,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backdropDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PageTransition;
