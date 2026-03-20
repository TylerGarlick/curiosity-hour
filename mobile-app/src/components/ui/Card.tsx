// Curiosity Hour — Card Components
// Question Card with 3D flip animation, gradient support, and press feedback

import React, { useCallback } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  borderRadius,
  spacing,
  animation,
  shadows,
  componentDefaults,
  touchTargets,
  CategoryKey,
} from '../../constants/theme';

// ============================================
// TYPES
// ============================================

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
  category?: CategoryKey;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  onPress?: () => void;
}

interface QuestionCardProps {
  question: string;
  category?: CategoryKey;
  questionNumber?: number;
  totalQuestions?: number;
  onFlip?: () => void;
  style?: ViewStyle;
}

// ============================================
// BASE CARD COMPONENT
// ============================================

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  category,
  style,
  contentStyle,
  onPress,
}) => {
  const categoryGradient = category ? colors.categories[category] : null;

  const containerStyles: ViewStyle[] = [
    styles.base,
    variant === 'default' && styles.defaultVariant,
    variant === 'elevated' && [styles.elevatedVariant, shadows.card],
    style,
  ].filter(Boolean) as ViewStyle[];

  const contentStyles: ViewStyle[] = [
    styles.content,
    ...(contentStyle ? [contentStyle] : []),
  ];

  if (variant === 'gradient' && categoryGradient) {
    return (
      <View style={[containerStyles, shadows.glow]}>
        <LinearGradient
          colors={[categoryGradient.from, categoryGradient.to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientFill}
        >
          <View style={contentStyles}>
            {children}
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={containerStyles}>
        <View style={contentStyles}>
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={containerStyles}>
      <View style={contentStyles}>
        {children}
      </View>
    </View>
  );
};

// ============================================
// PRESSABLE CARD (with spring press feedback)
// ============================================

interface PressableCardProps extends CardProps {
  onPress?: () => void;
  disabled?: boolean;
}

export const PressableCard: React.FC<PressableCardProps> = ({
  onPress,
  disabled = false,
  ...props
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
            [1, 0.97],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        pressed.value,
        [0, 1],
        [1, 0.92],
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
    >
      <Animated.View style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}>
        <Card {...props} />
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// QUESTION CARD (with 3D flip animation)
// ============================================

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  category,
  questionNumber,
  totalQuestions,
  onFlip,
  style,
}) => {
  const rotateY = useSharedValue(0);
  const categoryGradient = category ? colors.categories[category] : null;

  const handleFlip = useCallback(() => {
    // Flip animation - rotate around Y axis
    rotateY.value = withSpring(1, animation.spring, (finished) => {
      if (finished && onFlip) {
        runOnJS(onFlip)();
      }
    });
  }, [onFlip]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const rotate = interpolate(
      rotateY.value,
      [0, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotate}deg` },
      ],
      backfaceVisibility: 'hidden',
      opacity: interpolate(
        rotateY.value,
        [0, 0.5, 1],
        [1, 0.5, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const rotate = interpolate(
      rotateY.value,
      [0, 1],
      [180, 360],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotate}deg` },
      ],
      backfaceVisibility: 'hidden',
      opacity: interpolate(
        rotateY.value,
        [0, 0.5, 1],
        [0, 0.5, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  const categoryColor = categoryGradient?.from || colors.primary;
  const textColor = categoryGradient?.text || colors.textPrimary;

  return (
    <View style={[styles.questionCardContainer, style]}>
      {/* Front of card (loading/revealing state) */}
      <Animated.View style={[styles.questionCardFront, frontAnimatedStyle]}>
        <LinearGradient
          colors={[categoryColor, categoryGradient?.to || colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questionGradient}
        >
          <View style={styles.questionCardInner}>
            {/* Category label */}
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryLabel, { color: textColor }]}>
                {categoryGradient?.label || 'Question'}
              </Text>
            </View>

            {/* Question number */}
            {questionNumber !== undefined && totalQuestions !== undefined && (
              <Text style={[styles.questionNumber, { color: textColor }]}>
                {questionNumber} / {totalQuestions}
              </Text>
            )}

            {/* Tap to reveal prompt */}
            <View style={styles.tapToReveal}>
              <Text style={[styles.tapText, { color: textColor }]}>
                Tap to reveal
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Back of card (question revealed) */}
      <Animated.View style={[styles.questionCardBack, backAnimatedStyle]}>
        <LinearGradient
          colors={[categoryGradient?.to || colors.primaryDark, categoryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questionGradient}
        >
          <View style={styles.questionCardInner}>
            {/* Category label */}
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryLabel, { color: textColor }]}>
                {categoryGradient?.label || 'Question'}
              </Text>
            </View>

            {/* Question number */}
            {questionNumber !== undefined && totalQuestions !== undefined && (
              <Text style={[styles.questionNumber, { color: textColor }]}>
                {questionNumber} / {totalQuestions}
              </Text>
            )}

            {/* The actual question */}
            <View style={styles.questionTextContainer}>
              <Text style={[styles.questionText, { color: textColor }]}>
                {question}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// ============================================
// CATEGORY CARD (for selection grid)
// ============================================

interface CategoryCardProps {
  category: CategoryKey;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  label,
  icon,
  selected = false,
  onPress,
  disabled = false,
}) => {
  const pressed = useSharedValue(0);
  const categoryGradient = colors.categories[category];

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 0.95],
            Extrapolation.CLAMP
          ),
        },
      ],
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
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.categoryCard,
          selected && styles.categoryCardSelected,
          disabled && styles.categoryCardDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={`${label} category`}
      >
        <LinearGradient
          colors={[categoryGradient.from, categoryGradient.to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.categoryCardGradient,
            selected && styles.categoryCardGradientSelected,
          ]}
        >
          {icon && <View style={styles.categoryIcon}>{icon}</View>}
          <Text
            style={[
              styles.categoryCardLabel,
              { color: categoryGradient.text },
            ]}
          >
            {label}
          </Text>
          {selected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

// ============================================
// PLAYER CARD (for game lobby)
// ============================================

interface PlayerCardProps {
  name: string;
  isHost?: boolean;
  answeredCount?: number;
  style?: ViewStyle;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  isHost = false,
  answeredCount,
  style,
}) => {
  return (
    <View style={[styles.playerCard, style]}>
      <View style={styles.playerAvatar}>
        <Text style={styles.playerAvatarText}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{name}</Text>
        {isHost && (
          <View style={styles.hostBadge}>
            <Text style={styles.hostBadgeText}>Host</Text>
          </View>
        )}
      </View>
      {answeredCount !== undefined && (
        <Text style={styles.answeredCount}>{answeredCount} ✓</Text>
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Base card
  base: {
    borderRadius: componentDefaults.card.borderRadius,
    overflow: 'hidden',
  },
  content: {
    padding: componentDefaults.card.padding,
  },
  defaultVariant: {
    backgroundColor: colors.surface,
  },
  elevatedVariant: {
    backgroundColor: colors.surfaceElevated,
  },
  gradientFill: {
    borderRadius: componentDefaults.card.borderRadius,
    overflow: 'hidden',
  },

  // Question card
  questionCardContainer: {
    width: '100%',
    aspectRatio: 0.75, // Portrait card
    borderRadius: borderRadius.xxxl,
    overflow: 'hidden',
  },
  questionCardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  questionCardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  questionGradient: {
    flex: 1,
    borderRadius: borderRadius.xxxl,
    overflow: 'hidden',
  },
  questionCardInner: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryLabel: {
    ...typography.label,
    color: colors.textPrimary,
  },
  questionNumber: {
    ...typography.caption,
    opacity: 0.8,
  },
  tapToReveal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapText: {
    ...typography.sectionTitle,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  questionTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    ...typography.heroQuestion,
    textAlign: 'center',
  },

  // Category card
  categoryCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    minHeight: touchTargets.large,
  },
  categoryCardSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryCardGradient: {
    flex: 1,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryCardGradientSelected: {
    padding: spacing.md,
  },
  categoryIcon: {
    marginRight: spacing.xs,
  },
  categoryCardLabel: {
    ...typography.bodyBold,
    flex: 1,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // Player card
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  hostBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  hostBadgeText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  answeredCount: {
    ...typography.body,
    color: colors.success,
    fontWeight: '600',
  },
});

export default Card;
