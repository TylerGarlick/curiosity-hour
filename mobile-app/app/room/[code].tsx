import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

export default function ActiveRoomScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const [showAnswer, setShowAnswer] = useState(false);

  // Mock data for the room
  const roomData = {
    code: code || 'ABC123',
    name: 'Saturday Night Quiz',
    players: [
      { id: '1', name: 'You', status: 'ready', hasAnswered: true },
      { id: '2', name: 'Alex', status: 'ready', hasAnswered: true },
      { id: '3', name: 'Sam', status: 'thinking', hasAnswered: false },
    ],
    currentQuestion: {
      id: '1',
      text: 'What is a belief you held strongly that changed over time?',
      category: 'deep',
    },
    answers: {
      '1': 'My view on success and work-life balance. I used to think working 24/7 was the only way to succeed.',
      '2': 'My political views. I used to be very conservative but through meeting different people, I became more open-minded.',
    },
  };

  const allAnswered = roomData.players.every(p => p.hasAnswered);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{roomData.name}</Text>
          <Text style={styles.code}>Code: {roomData.code}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Players */}
      <View style={styles.playersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersScroll}>
          {roomData.players.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={[styles.playerAvatar, player.hasAnswered && styles.playerAnswered]}>
                <Text style={styles.playerAvatarText}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
              <View style={[
                styles.playerStatus, 
                { backgroundColor: player.hasAnswered ? colors.success : colors.warning }
              ]} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{roomData.currentQuestion.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.questionText}>{roomData.currentQuestion.text}</Text>
      </View>

      {/* Answers Section */}
      <View style={styles.answersContainer}>
        <Text style={styles.answersTitle}>
          {allAnswered ? '🎉 Everyone has answered!' : '⏳ Waiting for players...'}
        </Text>

        {allAnswered && !showAnswer && (
          <TouchableOpacity style={styles.revealButton} onPress={() => setShowAnswer(true)}>
            <Text style={styles.revealButtonText}>Reveal Answers</Text>
          </TouchableOpacity>
        )}

        {showAnswer && (
          <View style={styles.answersList}>
            {roomData.players.map((player) => (
              <View key={player.id} style={styles.answerCard}>
                <View style={styles.answerHeader}>
                  <Text style={styles.answerPlayer}>{player.name}</Text>
                  {player.id === '1' && (
                    <Text style={styles.youBadge}>You</Text>
                  )}
                </View>
                <Text style={styles.answerText}>
                  {roomData.answers[player.id as keyof typeof roomData.answers] || 'No answer yet'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.answerButton}
          onPress={() => {}}
        >
          <Text style={styles.answerButtonText}>Answer This Question</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => {}}
        >
          <Text style={styles.nextButtonText}>Next Question →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
  },
  code: {
    ...typography.caption,
    color: colors.accent,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  playersScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  playerCard: {
    alignItems: 'center',
    width: 60,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border,
  },
  playerAnswered: {
    borderColor: colors.success,
  },
  playerAvatarText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  playerName: {
    ...typography.caption,
    maxWidth: 60,
    textAlign: 'center',
  },
  playerStatus: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  questionContainer: {
    padding: spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  categoryText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  questionText: {
    ...typography.h3,
    lineHeight: 28,
  },
  answersContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  answersTitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  revealButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  revealButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  answersList: {
    gap: spacing.md,
  },
  answerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  answerPlayer: {
    ...typography.body,
    fontWeight: '600',
    color: colors.accent,
  },
  youBadge: {
    backgroundColor: colors.accent,
    color: colors.textPrimary,
    fontSize: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
    overflow: 'hidden',
  },
  answerText: {
    ...typography.bodySmall,
    lineHeight: 22,
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answerButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  answerButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextButtonText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
});