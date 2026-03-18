import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';
import { categories } from '../../src/data/questions';

export default function CategoriesScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    // Navigate to question with that category filter
    router.push({
      pathname: '/(tabs)/question',
      params: { category: categoryId }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose a Category</Text>
      <Text style={styles.subtitle}>
        Or mix questions from all categories for variety
      </Text>

      <TouchableOpacity 
        style={styles.allCategories}
        onPress={() => router.push('/(tabs)/question')}
      >
        <Text style={styles.allCategoriesIcon}>🎲</Text>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>All Categories</Text>
          <Text style={styles.categoryDesc}>Random mix of all questions</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { borderColor: category.color }]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.label}</Text>
            <Text style={styles.categoryCount}>30 questions</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.xl,
  },
  allCategories: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  allCategoriesIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
  },
  categoryDesc: {
    ...typography.caption,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  categoryCount: {
    ...typography.caption,
  },
});