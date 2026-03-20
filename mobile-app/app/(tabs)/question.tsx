import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuestionBank, Question } from '../../src/context/QuestionBankContext';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

export default function QuestionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    getQuestionById,
    answerQuestion,
    skipQuestion,
    getNextQuestion,
    state,
    getCurrentGame,
    getGameProgress,
    isGameComplete,
    resetGame,
  } = useQuestionBank();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  // Initialize game on mount
  useEffect(() => {
    const game = getCurrentGame();
    if (game) {
      setCurrentGameId(game.id);
      const next = getNextQuestion(game.id);
      if (next) {
        setCurrentQuestion(next);
      }
    }
  }, []);

  // Animate in on question change
  useEffect(() => {
    if (currentQuestion) {
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
    }
  }, [currentQuestion?.id]);

  const advanceToNextQuestion = useCallback(() => {
    if (!currentGameId) return;

    const game = state.games.find(g => g.id === currentGameId);
    if (!game) return;

    // Check if game is complete
    if (isGameComplete(currentGameId)) {
      // Show completion state
      return;
    }

    // Get next question
    const next = getNextQuestion(currentGameId);
    setCurrentQuestion(next);
  }, [currentGameId, currentQuestion, state.games, getNextQuestion, isGameComplete]);

  const handleAnswer = useCallback(() => {
    if (!currentGameId || !currentQuestion) return;

    answerQuestion(currentGameId, currentQuestion.id);

    if (isGameComplete(currentGameId)) {
      // Show completion
      return;
    }

    advanceToNextQuestion();
  }, [currentGameId, currentQuestion, answerQuestion, isGameComplete, advanceToNextQuestion]);

  const handleSkip = useCallback(() => {
    if (!currentGameId || !currentQuestion) return;

    skipQuestion(currentGameId, currentQuestion.id);

    if (isGameComplete(currentGameId)) {
      // Show completion
      return;
    }

    advanceToNextQuestion();
  }, [currentGameId, currentQuestion, skipQuestion, isGameComplete, advanceToNextQuestion]);

  const handleReset = useCallback(() => {
    if (!currentGameId) return;

    Alert.alert(
      'Reset Questions',
      'This will mark all questions as unread. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetGame(currentGameId);
            const next = getNextQuestion(currentGameId);
            setCurrentQuestion(next);
          },
        },
      ]
    );
  }, [currentGameId, resetGame, getNextQuestion]);

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'deep': '#805ad5',
      'funny': '#ed8936',
      'intimate': '#d53f8c',
      'nostalgia': '#38b2ac',
      'spicy': '#e94560',
      'would-you-rather': '#4299e1',
      'nsfw': '#ec4899',
      'custom': '#4299e1',
    };
    return categoryColors[category] || colors.accent;
  };

  const getCategoryEmoji = (category: string): string => {
    const categoryEmojis: Record<string, string> = {
      'deep': '🤔',
      'funny': '😂',
      'intimate': '❤️',
      'nostalgia': '📸',
      'spicy': '🌶️',
      'would-you-rather': '🤨',
      'nsfw': '⚠️',
      'custom': '✨',
    };
    return categoryEmojis[category] || '💭';
  };

  // No game state
  if (!currentGameId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎲</Text>
          <Text style={styles.emptyTitle}>No Active Game</Text>
          <Text style={styles.emptyText}>
            Start a new game from the Categories tab to begin
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Game complete state
  if (isGameComplete(currentGameId)) {
    const progress = getGameProgress(currentGameId);

    return (
      <View style={styles.container}>
        <View style={styles.completeState}>
          <Text style={styles.completeIcon}>🎉</Text>
          <Text style={styles.completeTitle}>Game Complete!</Text>
          <Text style={styles.completeText}>
            You answered {progress.answered} questions
          </Text>
          <View style={styles.completeActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <Text style={styles.newGameButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // No question available
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Questions Available</Text>
          <Text style={styles.emptyText}>
            Try selecting different categories or adjusting NSFW settings
          </Text>
        </View>
      </View>
    );
  }

  const progress = getGameProgress(currentGameId);

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((progress.answered + progress.skipped) / progress.total) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progress.answered + progress.skipped} / {progress.total}
        </Text>
      </View>

      {/* Category Badge */}
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentQuestion.category) + '20' }]}>
        <Text style={styles.categoryEmoji}>{getCategoryEmoji(currentQuestion.category)}</Text>
        <Text style={[styles.categoryText, { color: getCategoryColor(currentQuestion.category) }]}>
          {currentQuestion.category.replace('-', ' ').toUpperCase()}
        </Text>
        {currentQuestion.isNsfw && (
          <View style={[styles.nsfwIndicator, { backgroundColor: colors.error + '30' }]}>
            <Text style={[styles.nsfwIndicatorText, { color: colors.error }]}>NSFW</Text>
          </View>
        )}
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

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.success }]}>{progress.answered}</Text>
          <Text style={styles.statLabel}>Answered</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.skip }]}>{progress.skipped}</Text>
          <Text style={styles.statLabel}>Skipped</Text>
        </View>
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
    backgroundColor: colors.primary,
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
  nsfwIndicator: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  nsfwIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
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
    backgroundColor: colors.primary,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  startButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  completeState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completeIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  completeTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  completeText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  completeActions: {
    gap: spacing.md,
    width: '100%',
  },
  resetButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resetButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  newGameButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  newGameButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
