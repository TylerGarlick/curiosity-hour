// Animated Progress Bar Component with gradient fill
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography, animation } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showLabel?: boolean;
  labelText?: string;
  variant?: 'default' | 'car';
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  labelText,
  variant = 'default',
  style,
}) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: animation.slow,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  const defaultLabel = `${Math.round(progress * 100)}%`;
  const displayLabel = labelText || defaultLabel;

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>{displayLabel}</Text>
      )}
      <View
        style={[
          styles.track,
          { height },
          variant === 'car' && styles.carTrack,
        ]}
      >
        <Animated.View style={[styles.fillContainer, fillStyle]}>
          <LinearGradient
            colors={
              variant === 'car'
                ? [colors.carAccent, colors.primary]
                : [colors.primary, colors.primaryDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { height }]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

// Segmented progress bar (for showing answered/skipped separately)
interface SegmentedProgressProps {
  answered: number;
  skipped: number;
  total: number;
  height?: number;
  style?: ViewStyle;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
  answered,
  skipped,
  total,
  height = 8,
  style,
}) => {
  const answeredProgress = total > 0 ? answered / total : 0;
  const skippedProgress = total > 0 ? skipped / total : 0;

  const answeredWidth = useSharedValue(0);
  const skippedWidth = useSharedValue(0);

  useEffect(() => {
    answeredWidth.value = withTiming(answeredProgress, {
      duration: animation.slow,
      easing: Easing.out(Easing.cubic),
    });
    skippedWidth.value = withTiming(skippedProgress, {
      duration: animation.slow,
      easing: Easing.out(Easing.cubic),
    });
  }, [answeredProgress, skippedProgress]);

  const answeredStyle = useAnimatedStyle(() => ({
    width: `${answeredWidth.value * 100}%`,
  }));

  const skippedStyle = useAnimatedStyle(() => ({
    width: `${skippedWidth.value * 100}%`,
  }));

  return (
    <View style={[styles.segmentedContainer, style]}>
      <View style={[styles.segmentedTrack, { height }]}>
        <Animated.View style={[styles.answeredSegment, answeredStyle]}>
          <LinearGradient
            colors={[colors.success, colors.success]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.segmentFill, { height }]}
          />
        </Animated.View>
        <Animated.View style={[styles.skippedSegment, skippedStyle]}>
          <LinearGradient
            colors={[colors.skip, colors.skip]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.segmentFill, { height }]}
          />
        </Animated.View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>{answered} answered</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.skip }]} />
          <Text style={styles.legendText}>{skipped} skipped</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  carTrack: {
    backgroundColor: colors.surfaceElevated,
  },
  fillContainer: {
    height: '100%',
    overflow: 'hidden',
  },
  fill: {
    borderRadius: borderRadius.full,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  // Segmented styles
  segmentedContainer: {
    width: '100%',
  },
  segmentedTrack: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  answeredSegment: {
    height: '100%',
    overflow: 'hidden',
  },
  skippedSegment: {
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  segmentFill: {
    borderRadius: borderRadius.full,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default ProgressBar;
