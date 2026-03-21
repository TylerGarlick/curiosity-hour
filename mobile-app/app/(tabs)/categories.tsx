import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuestionBank, Category } from '../../src/context/QuestionBankContext';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

export default function CategoriesScreen() {
  const router = useRouter();
  const {
    state,
    getSelectedCategories,
    toggleCategory,
    setSelectedCategories,
    isEntitled,
    toggleNsfw,
    getAvailableQuestionCount,
  } = useQuestionBank();

  const selectedCategories = getSelectedCategories();
  const isLoading = state.isLoadingBanks;

  // Calculate total available questions
  const totalQuestions = state.banks.reduce((sum, bank) => {
    const questions = state.nsfwEnabled 
      ? bank.questions 
      : bank.questions.filter(q => !q.isNsfw);
    return sum + questions.length;
  }, 0);

  const handleCategoryPress = (bankId: string) => {
    // Don't allow selecting paid categories that aren't owned
    const isPaid = ['intimate', 'nsfw', 'spicy'].includes(bankId);
    const owned = isEntitled(bankId as any);
    
    if (isPaid && !owned) {
      // Navigate to purchase screen
      Alert.alert(
        'Pack Locked 🔒',
        'This pack is part of the premium content. Would you like to unlock it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Unlock', onPress: () => router.push('/purchase-packs') },
        ]
      );
      return;
    }
    
    toggleCategory(bankId as Category);
  };

  const handleStartGame = () => {
    if (selectedCategories.length > 0) {
      router.push('/room/create');
    }
  };

  const getCategoryColor = (categoryId: string): string => {
    const bank = state.banks.find(b => b.id === categoryId);
    return bank?.color || colors.accent;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading question banks...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>
        Select categories to include in your game
      </Text>

      {/* NSFW Toggle */}
      <View style={styles.nsfwSection}>
        <View style={styles.nsfwInfo}>
          <Text style={styles.nsfwLabel}>NSFW Content</Text>
          <Text style={styles.nsfwDescription}>
            Enable to show adult-themed questions from all categories
          </Text>
        </View>
        <Switch
          value={state.nsfwEnabled}
          onValueChange={toggleNsfw}
          trackColor={{ false: colors.surface, true: colors.primary + '60' }}
          thumbColor={state.nsfwEnabled ? colors.primary : colors.textMuted}
        />
      </View>

      {/* Category Grid */}
      <View style={styles.grid}>
        {state.banks.map((bank) => {
          const isSelected = selectedCategories.includes(bank.category);
          const isPaid = !bank.isFree;
          const isLocked = isPaid && !isEntitled(bank.id as any);
          const bankColor = bank.color;

          return (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.categoryCard,
                isSelected && { borderColor: bankColor, borderWidth: 2 },
                isLocked && styles.lockedCard,
              ]}
              onPress={() => handleCategoryPress(bank.id)}
              disabled={isLocked}
              activeOpacity={0.7}
            >
              {/* Lock overlay for unpaid packs */}
              {isLocked && (
                <View style={styles.lockOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.priceTag}>$1.99</Text>
                </View>
              )}

              {/* Selection indicator */}
              <View style={[
                styles.checkbox,
                isSelected && { backgroundColor: bankColor, borderColor: bankColor }
              ]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <Text style={styles.categoryIcon}>{bank.icon}</Text>
              <Text style={styles.categoryName}>{bank.name}</Text>
              <Text style={styles.categoryCount}>
                {bank.questions.filter(q => !q.isNsfw || state.nsfwEnabled).length} questions
              </Text>
              {bank.isNsfw && (
                <View style={[styles.nsfwBadge, { backgroundColor: bankColor + '30' }]}>
                  <Text style={[styles.nsfwBadgeText, { color: bankColor }]}>NSFW</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Selected Categories</Text>
          <Text style={styles.summaryValue}>{selectedCategories.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Available Questions</Text>
          <Text style={styles.summaryValue}>{getAvailableQuestionCount(selectedCategories)}</Text>
        </View>
      </View>

      {/* Start Game Button */}
      <TouchableOpacity
        style={[
          styles.startButton,
          selectedCategories.length === 0 && styles.startButtonDisabled
        ]}
        onPress={handleStartGame}
        disabled={selectedCategories.length === 0}
      >
        <Text style={styles.startButtonText}>
          Start Game ({selectedCategories.length} categories)
        </Text>
      </TouchableOpacity>

      {/* All Categories Button */}
      <TouchableOpacity 
        style={styles.allCategoriesButton}
        onPress={() => {
          // Select all available categories
          const allAvailable = state.banks
            .filter(b => b.isFree || isEntitled(b.id as any))
            .map(b => b.category);
          setSelectedCategories(allAvailable);
        }}
      >
        <Text style={styles.allCategoriesText}>Select All Available</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  nsfwSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  nsfwInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  nsfwLabel: {
    ...typography.bodyBold,
    marginBottom: spacing.xs,
  },
  nsfwDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lockOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
  priceTag: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  checkbox: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  categoryCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  nsfwBadge: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  nsfwBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyBold,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  startButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  startButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  allCategoriesButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  allCategoriesText: {
    ...typography.body,
    color: colors.primary,
  },
});
