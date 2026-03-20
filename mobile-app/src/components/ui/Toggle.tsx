// Animated Toggle Component (NSFW toggle)
import React, { useEffect } from 'react';
import { StyleSheet, Pressable, ViewStyle, Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing, typography, animation, touchTargets } from '../../constants/theme';

const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;
const THUMB_MARGIN = 3;

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  style?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  label,
  description,
  style,
}) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: animation.spring.damping - 3,
      stiffness: animation.spring.stiffness + 20,
    });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.surface, colors.primary]
      ),
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    'worklet';
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [THUMB_MARGIN, TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
    >
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
};

// Large car-mode friendly toggle
interface CarToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const CarToggle: React.FC<CarToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: animation.spring.damping,
      stiffness: animation.spring.stiffness,
    });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.surface, colors.primary]
      ),
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    'worklet';
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [THUMB_MARGIN, TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      style={[styles.carContainer, disabled && styles.disabled, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View style={[styles.carTrack, trackStyle]}>
        <Animated.View style={[styles.carThumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: touchTargets.minimum,
    paddingVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.md,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Car mode styles (larger)
  carContainer: {
    padding: spacing.sm,
  },
  carTrack: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  carThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.textPrimary,
  },
});

export default Toggle;
