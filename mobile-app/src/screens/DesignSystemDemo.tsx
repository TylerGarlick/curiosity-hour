// Curiosity Hour — Design System Demo Screen
// Demonstrates all UI components with various states

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Button,
  IconButton,
  Card,
  PressableCard,
  QuestionCard,
  CategoryCard,
  PlayerCard,
  ProgressBar,
  SegmentedProgress,
  Toggle,
  CarToggle,
  FadeInView,
  SlideInView,
  PulseView,
  AnswerButton,
  LoadingSpinner,
  ModalBackdrop,
  StaggerList,
} from '../components/ui';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  touchTargets,
  CategoryKey,
} from '../constants/theme';

// ============================================
// DEMO SCREEN
// ============================================

export const DesignSystemDemo: React.FC = () => {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswer = () => {
    console.log('Answered!');
  };

  const handleSkip = () => {
    console.log('Skipped!');
  };

  const categories: CategoryKey[] = ['deep', 'intimate', 'spicy', 'nostalgia', 'wouldYouRather', 'nsfw'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeInView delay={100}>
          <View style={styles.header}>
            <Text style={styles.title}>Design System</Text>
            <Text style={styles.subtitle}>Curiosity Hour UI Components</Text>
          </View>
        </FadeInView>

        {/* Color Palette */}
        <SlideInView direction="up" delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color Palette</Text>
            <View style={styles.colorGrid}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]}>
                <Text style={styles.colorLabel}>Primary</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: colors.secondary }]}>
                <Text style={styles.colorLabel}>Secondary</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: colors.accent }]}>
                <Text style={styles.colorLabel}>Accent</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: colors.success }]}>
                <Text style={styles.colorLabel}>Success</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: colors.skip }]}>
                <Text style={styles.colorLabel}>Skip</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: colors.warning }]}>
                <Text style={styles.colorLabelDark}>Warning</Text>
              </View>
            </View>
          </View>
        </SlideInView>

        {/* Typography */}
        <SlideInView direction="up" delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Typography</Text>
            <Text style={styles.typoCar}>Car Mode Text (38px Bold)</Text>
            <Text style={styles.typoHero}>Hero Question (28px Bold)</Text>
            <Text style={styles.typoSection}>Section Title (22px SemiBold)</Text>
            <Text style={styles.typoBody}>Body text for readability (16px Regular)</Text>
            <Text style={styles.typoCaption}>Caption text (13px)</Text>
          </View>
        </SlideInView>

        {/* Buttons */}
        <SlideInView direction="up" delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Buttons</Text>
            <View style={styles.buttonGrid}>
              <Button
                title="Primary"
                onPress={() => {}}
                variant="primary"
                size="medium"
              />
              <Button
                title="Secondary"
                onPress={() => {}}
                variant="secondary"
                size="medium"
              />
              <Button
                title="Outlined"
                onPress={() => {}}
                variant="outlined"
                size="medium"
              />
              <Button
                title="Ghost"
                onPress={() => {}}
                variant="ghost"
                size="medium"
              />
              <Button
                title="Danger"
                onPress={() => {}}
                variant="danger"
                size="medium"
              />
              <Button
                title="Loading"
                onPress={() => {}}
                variant="primary"
                size="medium"
                loading={loading}
              />
              <Button
                title="Disabled"
                onPress={() => {}}
                variant="primary"
                size="medium"
                disabled
              />
              <Button
                title="Full Width"
                onPress={() => {}}
                variant="primary"
                size="medium"
                fullWidth
              />
            </View>

            {/* Car Mode Buttons */}
            <Text style={styles.subsectionTitle}>Car Mode Buttons</Text>
            <View style={styles.buttonGrid}>
              <Button
                title="Car Primary"
                onPress={() => {}}
                variant="primary"
                size="car"
              />
            </View>
          </View>
        </SlideInView>

        {/* Icon Buttons */}
        <SlideInView direction="up" delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Icon Buttons</Text>
            <View style={styles.iconButtonRow}>
              <IconButton
                icon={<Text style={styles.iconText}>⚙️</Text>}
                onPress={() => {}}
                size="small"
                accessibilityLabel="Settings"
              />
              <IconButton
                icon={<Text style={styles.iconText}>❤️</Text>}
                onPress={() => {}}
                size="medium"
                accessibilityLabel="Like"
              />
              <IconButton
                icon={<Text style={styles.iconText}>🔊</Text>}
                onPress={() => {}}
                size="large"
                accessibilityLabel="Volume"
              />
              <IconButton
                icon={<Text style={styles.iconText}>🚗</Text>}
                onPress={() => {}}
                size="car"
                variant="primary"
                accessibilityLabel="Car mode"
              />
            </View>
          </View>
        </SlideInView>

        {/* Cards */}
        <SlideInView direction="up" delay={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <Card variant="default" style={styles.demoCard}>
              <Text style={styles.cardText}>Default Card</Text>
            </Card>
            <Card variant="elevated" style={styles.demoCard}>
              <Text style={styles.cardText}>Elevated Card</Text>
            </Card>
            <Card variant="gradient" category="deep" style={styles.demoCard}>
              <Text style={styles.cardTextLight}>Gradient Card</Text>
            </Card>
          </View>
        </SlideInView>

        {/* Question Card */}
        <SlideInView direction="up" delay={700}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Question Card</Text>
            <QuestionCard
              question="If you could have dinner with anyone from history, who would it be and why?"
              category="deep"
              questionNumber={5}
              totalQuestions={20}
              style={styles.questionCardDemo}
            />
          </View>
        </SlideInView>

        {/* Category Cards */}
        <SlideInView direction="up" delay={800}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Selection</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <CategoryCard
                  key={cat}
                  category={cat}
                  label={colors.categories[cat].label}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                />
              ))}
            </View>
          </View>
        </SlideInView>

        {/* Player Cards */}
        <SlideInView direction="up" delay={900}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Cards</Text>
            <StaggerList>
              <PlayerCard name="Tyler" isHost answeredCount={5} />
              <PlayerCard name="Sarah" answeredCount={3} />
              <PlayerCard name="Mike" answeredCount={7} />
            </StaggerList>
          </View>
        </SlideInView>

        {/* Progress Bars */}
        <SlideInView direction="up" delay={1000}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <Text style={styles.subsectionTitle}>Default</Text>
            <ProgressBar progress={0.65} showLabel />
            <Text style={styles.subsectionTitle}>Car Mode</Text>
            <ProgressBar progress={0.8} variant="car" height={12} />
            <Text style={styles.subsectionTitle}>Segmented (Answered/Skipped)</Text>
            <SegmentedProgress answered={12} skipped={3} total={20} />
          </View>
        </SlideInView>

        {/* Toggles */}
        <SlideInView direction="up" delay={1100}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Toggles</Text>
            <Toggle
              value={toggle1}
              onValueChange={setToggle1}
              label="NSFW Content"
              description="Enable mature content"
            />
            <Toggle
              value={toggle2}
              onValueChange={setToggle2}
              label="Auto TTS"
              description="Automatically read questions aloud"
            />
            <Text style={styles.subsectionTitle}>Car Mode Toggles</Text>
            <View style={styles.carToggleRow}>
              <Text style={styles.carToggleLabel}>Car Mode</Text>
              <CarToggle value={true} onValueChange={() => {}} />
            </View>
          </View>
        </SlideInView>

        {/* Answer Buttons */}
        <SlideInView direction="up" delay={1200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Answer Actions</Text>
            <View style={styles.answerRow}>
              <AnswerButton type="answer" onPress={handleAnswer} />
              <AnswerButton type="skip" onPress={handleSkip} />
            </View>
          </View>
        </SlideInView>

        {/* Loading States */}
        <SlideInView direction="up" delay={1300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loading</Text>
            <View style={styles.loadingRow}>
              <LoadingSpinner size="small" />
              <LoadingSpinner size="medium" />
              <LoadingSpinner size="large" />
            </View>
          </View>
        </SlideInView>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.screenPadding,
  },
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.heroQuestion,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subsectionTitle: {
    ...typography.cardTitle,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  // Color palette
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    justifyContent: 'flex-end',
    padding: spacing.sm,
  },
  colorLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  colorLabelDark: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
  },

  // Typography samples
  typoCar: {
    ...typography.carQuestion,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  typoHero: {
    ...typography.heroQuestion,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  typoSection: {
    ...typography.sectionTitle,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  typoBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  typoCaption: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Buttons
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  // Icon buttons
  iconButtonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },

  // Cards
  demoCard: {
    marginBottom: spacing.sm,
  },
  cardText: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cardTextLight: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  questionCardDemo: {
    height: 350,
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  // Car toggle
  carToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  carToggleLabel: {
    ...typography.carLabel,
    color: colors.textPrimary,
  },

  // Answer buttons
  answerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  // Loading
  loadingRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },

  bottomSpacer: {
    height: spacing.xxxl,
  },
});

export default DesignSystemDemo;
