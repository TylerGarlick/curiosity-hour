import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

export default function RoomScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'join'>('overview');

  // Mock active room data
  const hasActiveRoom = false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Shared Room</Text>
      <Text style={styles.subtitle}>
        Play together with friends in real-time
      </Text>

      {hasActiveRoom ? (
        // Active Room View
        <View style={styles.activeRoom}>
          <View style={styles.roomCode}>
            <Text style={styles.roomCodeLabel}>Room Code</Text>
            <Text style={styles.roomCodeValue}>ABC123</Text>
          </View>
          
          <View style={styles.players}>
            <Text style={styles.sectionTitle}>Players (3)</Text>
            <View style={styles.playerList}>
              <View style={styles.player}>
                <Text style={styles.playerAvatar}>👤</Text>
                <Text style={styles.playerName}>You</Text>
                <View style={[styles.playerStatus, { backgroundColor: colors.success }]} />
              </View>
              <View style={styles.player}>
                <Text style={styles.playerAvatar}>👤</Text>
                <Text style={styles.playerName}>Alex</Text>
                <View style={[styles.playerStatus, { backgroundColor: colors.success }]} />
              </View>
              <View style={styles.player}>
                <Text style={styles.playerAvatar}>👤</Text>
                <Text style={styles.playerName}>Sam</Text>
                <View style={[styles.playerStatus, { backgroundColor: colors.warning }]} />
              </View>
            </View>
          </View>

          <View style={styles.currentQuestion}>
            <Text style={styles.currentQuestionLabel}>Current Question</Text>
            <Text style={styles.currentQuestionText}>
              "What is a belief you held strongly that changed over time?"
            </Text>
            <View style={styles.responses}>
              <Text style={styles.responsesTitle}>Responses</Text>
              <View style={styles.response}>
                <Text style={styles.responsePlayer}>Alex:</Text>
                <Text style={styles.responseText}>My view on success and work-life balance.</Text>
              </View>
              <View style={styles.response}>
                <Text style={styles.responsePlayer}>Sam:</Text>
                <Text style={styles.responseText}>Religion and spirituality...</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        // No Active Room View
        <View style={styles.noRoom}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎮</Text>
          </View>
          <Text style={styles.noRoomTitle}>No Active Room</Text>
          <Text style={styles.noRoomText}>
            Create a room to play with friends or join an existing room
          </Text>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/room/create')}
          >
            <Text style={styles.primaryButtonText}>Create New Room</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/room/join')}
          >
            <Text style={styles.secondaryButtonText}>Join Existing Room</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* How It Works */}
      <View style={styles.howItWorks}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Create or Join</Text>
            <Text style={styles.stepText}>Create a room and share the code, or join a friend's room</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Answer Together</Text>
            <Text style={styles.stepText}>Both players see the same question and answer privately</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Share & Discuss</Text>
            <Text style={styles.stepText}>Both answers are revealed and you can discuss together</Text>
          </View>
        </View>
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
  noRoom: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 36,
  },
  noRoomTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  noRoomText: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.bg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
  },
  activeRoom: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  roomCode: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  roomCodeLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  roomCodeValue: {
    ...typography.h1,
    letterSpacing: 4,
    color: colors.accent,
  },
  players: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  playerList: {
    gap: spacing.sm,
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  playerAvatar: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  playerName: {
    ...typography.body,
    flex: 1,
  },
  playerStatus: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  currentQuestion: {
    backgroundColor: colors.bg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  currentQuestionLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  currentQuestionText: {
    ...typography.body,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  responses: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  responsesTitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  response: {
    marginBottom: spacing.sm,
  },
  responsePlayer: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.accent,
  },
  responseText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  howItWorks: {
    marginTop: spacing.md,
  },
  step: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stepText: {
    ...typography.bodySmall,
  },
});