import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../src/constants/theme';
import { useQuestionBank, Player } from '../src/context/QuestionBankContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { 
    createGame, 
    getSelectedCategories, 
    state,
    getActiveGames,
    setCurrentGame,
    archiveGame,
    restoreGame,
    deleteGame,
  } = useQuestionBank();
  
  const [playerNames, setPlayerNames] = useState<Player[]>([
    { id: '1', name: '', nsfwEnabled: false },
    { id: '2', name: '', nsfwEnabled: false },
  ]);
  const [showArchived, setShowArchived] = useState(false);

  const selectedCategories = getSelectedCategories();
  const activeGames = getActiveGames();
  const archivedGames = state.games.filter(g => g.isArchived);

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...playerNames];
    newPlayers[index] = { ...newPlayers[index], name };
    setPlayerNames(newPlayers);
  };

  const handleStart = () => {
    // Validate at least 2 players have names
    const validPlayers = playerNames.filter(p => p.name.trim());
    if (validPlayers.length < 2) {
      Alert.alert('Error', 'Please enter at least 2 player names');
      return;
    }

    // Check if categories are selected
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category from the Categories tab');
      return;
    }

    // Create the game
    const gameName = `Game ${state.games.length + 1}`;
    const gameId = createGame(gameName, validPlayers);
    
    // Navigate to the question screen
    router.push('/(tabs)/question');
  };

  const handleResumeGame = (gameId: string) => {
    setCurrentGame(gameId);
    router.push('/(tabs)/question');
  };

  const handleArchiveGame = (gameId: string) => {
    archiveGame(gameId);
  };

  const handleRestoreGame = (gameId: string) => {
    restoreGame(gameId);
  };

  const handleDeleteGame = (gameId: string) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteGame(gameId),
        },
      ]
    );
  };

  const handleQuickStart = () => {
    // Go directly to categories to select
    router.push('/(tabs)/categories');
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGameStats = (gameId: string): { answered: number; total: number } => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return { answered: 0, total: 0 };

    let answered = 0;
    game.questionIds.forEach(qId => {
      if (game.questionStatuses[qId] === 'answered') answered++;
    });

    return { answered, total: game.questionIds.length };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* App Icon / Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>💭</Text>
        </View>
        <Text style={styles.logoSubtext}>Curiosity Hour</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Deep questions for meaningful connections
      </Text>

      {/* Player Names Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who's Playing?</Text>
        
        {playerNames.map((player, index) => (
          <View key={player.id} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Player {index + 1}</Text>
            <View style={styles.playerRow}>
              <View style={styles.playerInputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={index === 0 ? "Enter your name" : "Partner's name"}
                  placeholderTextColor={colors.textMuted}
                  value={player.name}
                  onChangeText={(text) => updatePlayerName(index, text)}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Category Summary (if selected) */}
      {selectedCategories.length > 0 && (
        <View style={styles.categoryPreview}>
          <Text style={styles.categoryPreviewLabel}>Selected Categories:</Text>
          <View style={styles.categoryChips}>
            {selectedCategories.map(cat => {
              const bank = state.banks.find(b => b.category === cat);
              return (
                <View key={cat} style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{bank?.icon} {bank?.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Quick Start Button */}
      <TouchableOpacity style={styles.quickStartButton} onPress={handleQuickStart}>
        <Text style={styles.quickStartIcon}>🎯</Text>
        <Text style={styles.quickStartText}>Select Categories</Text>
      </TouchableOpacity>

      {/* Start Button */}
      <TouchableOpacity 
        style={[
          styles.startButton, 
          (playerNames.filter(p => p.name.trim()).length < 2 || selectedCategories.length === 0) && 
            styles.startButtonDisabled
        ]} 
        onPress={handleStart}
        disabled={playerNames.filter(p => p.name.trim()).length < 2 || selectedCategories.length === 0}
      >
        <Text style={styles.startButtonText}>
          {selectedCategories.length === 0 
            ? 'Select Categories First' 
            : `Start Game (${selectedCategories.length} categories)`}
        </Text>
      </TouchableOpacity>

      {/* Active Games Section */}
      {activeGames.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Games</Text>
          {activeGames.map(game => {
            const stats = getGameStats(game.id);
            return (
              <View key={game.id} style={styles.gameCard}>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameMeta}>
                    {game.players.length} players • {stats.answered}/{stats.total} answered
                  </Text>
                  <Text style={styles.gameDate}>{formatDate(game.updatedAt)}</Text>
                </View>
                <View style={styles.gameActions}>
                  <TouchableOpacity 
                    style={styles.resumeButton}
                    onPress={() => handleResumeGame(game.id)}
                  >
                    <Text style={styles.resumeButtonText}>Resume</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.archiveButton}
                    onPress={() => handleArchiveGame(game.id)}
                  >
                    <Text style={styles.archiveButtonText}>Archive</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Archived Games Toggle */}
      {archivedGames.length > 0 && (
        <TouchableOpacity 
          style={styles.archivedToggle}
          onPress={() => setShowArchived(!showArchived)}
        >
          <Text style={styles.archivedToggleText}>
            {showArchived ? 'Hide' : 'Show'} Archived Games ({archivedGames.length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Archived Games */}
      {showArchived && archivedGames.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Archived</Text>
          {archivedGames.map(game => {
            const stats = getGameStats(game.id);
            return (
              <View key={game.id} style={[styles.gameCard, styles.archivedCard]}>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameMeta}>
                    {game.players.length} players • {stats.answered}/{stats.total} answered
                  </Text>
                  <Text style={styles.gameDate}>{formatDate(game.updatedAt)}</Text>
                </View>
                <View style={styles.gameActions}>
                  <TouchableOpacity 
                    style={styles.restoreButton}
                    onPress={() => handleRestoreGame(game.id)}
                  >
                    <Text style={styles.restoreButtonText}>Restore</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteGame(game.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Settings Link */}
      <TouchableOpacity 
        style={styles.settingsLink}
        onPress={() => router.push('/settings')}
      >
        <Text style={styles.settingsLinkText}>⚙️ Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoSubtext: {
    ...typography.h2,
    marginTop: spacing.md,
  },
  tagline: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInputWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPreview: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  categoryPreviewLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    backgroundColor: colors.primary + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  categoryChipText: {
    ...typography.caption,
    color: colors.primary,
  },
  quickStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickStartIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  quickStartText: {
    ...typography.body,
    color: colors.primary,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  startButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  startButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  gameCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  archivedCard: {
    opacity: 0.7,
  },
  gameInfo: {
    marginBottom: spacing.md,
  },
  gameName: {
    ...typography.bodyBold,
    marginBottom: spacing.xs,
  },
  gameMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  gameDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  gameActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  resumeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  resumeButtonText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
  },
  archiveButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  archiveButtonText: {
    ...typography.buttonSmall,
    color: colors.textSecondary,
  },
  restoreButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  restoreButtonText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error + '20',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  deleteButtonText: {
    ...typography.buttonSmall,
    color: colors.error,
  },
  archivedToggle: {
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  archivedToggleText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  settingsLink: {
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  settingsLinkText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
