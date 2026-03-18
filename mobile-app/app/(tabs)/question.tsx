import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';
import { sampleQuestions } from '../../src/data/questions';

const { width } = Dimensions.get('window');

export default function QuestionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Filter questions by category if provided
  const filteredQuestions = params.category 
    ? sampleQuestions.filter(q => q.category === params.category)
    : sampleQuestions;

  useEffect(() => {
    // Animate in
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const currentQuestion = filteredQuestions[currentIndex % filteredQuestions.length];

  const handleAnswer = () => {
    setAnswered([...answered, currentQuestion.id]);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handleSkip = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = sampleQuestions.find(q => q.category === category);
    if (!cat) return colors.accent;
    
    const categoryColors: Record<string, string> = {
      'deep': '#805ad5',
      'funny': '#ed8936',
      'intimate': '#d53f8c',
      'nostalgia': '#38b2ac',
      'spicy': '#e94560',
      'would-you-rather': '#4299e1',
      'custom': '#4299e1',
    };
    return categoryColors[category] || colors.accent;
  };

  const getCategoryEmoji = (category: string) => {
    const categoryEmojis: Record<string, string> = {
      'deep': '🤔',
      'funny': '😂',
      'intimate': '❤️',
      'nostalgia': '📸',
      'spicy': '🌶️',
      'would-you-rather': '🤨',
      'custom': '✨',
    };
    return categoryEmojis[category] || '💭';
  };

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((answered.length) / filteredQuestions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {answered.length} / {filteredQuestions.length} answered
        </Text>
      </View>

      {/* Category Badge */}
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentQuestion.category) + '20' }]}>
        <Text style={styles.categoryEmoji}>{getCategoryEmoji(currentQuestion.category)}</Text>
        <Text style={[styles.categoryText, { color: getCategoryColor(currentQuestion.category) }]}>
          {currentQuestion.category.replace('-', ' ').toUpperCase()}
        </Text>
      </View>

      {/* Question Card */}
      <Animated.View 
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipIcon}>⏭</Text>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
          <Text style={styles.answerIcon}>✓</Text>
          <Text style={styles.answerText}>Answered</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Hint */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/categories')}
        >
          <Text style={styles.navIcon}>🎯</Text>
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/room')}
        >
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navText}>Room</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },
  progress: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  progressText: {
    ...typography.caption,
    textAlign: 'right',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionText: {
    ...typography.h3,
    textAlign: 'center',
    lineHeight: 32,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  skipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  answerButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  answerIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
    color: colors.textPrimary,
  },
  answerText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  navText: {
    ...typography.caption,
  },
});