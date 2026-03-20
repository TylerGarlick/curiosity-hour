import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';
import { useQuestionBank, Player } from '../../src/context/QuestionBankContext';

export default function CreateRoomScreen() {
  const router = useRouter();
  const { createGame, getSelectedCategories, state } = useQuestionBank();
  
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '', nsfwEnabled: false },
    { id: '2', name: '', nsfwEnabled: false },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const selectedCategories = getSelectedCategories();

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name };
    setPlayers(newPlayers);
  };

  const handleCreate = () => {
    // Validate game name
    if (!gameName.trim()) {
      Alert.alert('Error', 'Please enter a game name');
      return;
    }

    // Validate at least 2 players have names
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length < 2) {
      Alert.alert('Error', 'Please enter at least 2 player names');
      return;
    }

    // Validate categories selected
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create the game
      const gameId = createGame(gameName.trim(), validPlayers);
      
      // Navigate to the question screen
      router.replace('/(tabs)/question');
    } catch (error) {
      Alert.alert('Error', 'Failed to create game. Please try again.');
      setIsLoading(false);
    }
  };

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { id: String(players.length + 1), name: '', nsfwEnabled: false }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Game</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Game Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Game Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Saturday Night Quiz"
            placeholderTextColor={colors.textMuted}
            value={gameName}
            onChangeText={setGameName}
            maxLength={30}
          />
        </View>

        {/* Players Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Players ({players.length}/4)</Text>
          
          {players.map((player, index) => (
            <View key={player.id} style={styles.playerRow}>
              <View style={styles.playerInputContainer}>
                <Text style={styles.playerLabel}>Player {index + 1}</Text>
                <TextInput
                  style={styles.playerInput}
                  placeholder={`Enter name`}
                  placeholderTextColor={colors.textMuted}
                  value={player.name}
                  onChangeText={(text) => updatePlayerName(index, text)}
                  maxLength={20}
                />
              </View>
              {players.length > 2 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removePlayer(index)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {players.length < 4 && (
            <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayer}>
              <Text style={styles.addPlayerText}>+ Add Player</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selected Categories Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Categories</Text>
          <View style={styles.categoriesSummary}>
            {selectedCategories.length === 0 ? (
              <Text style={styles.noCategories}>No categories selected</Text>
            ) : (
              selectedCategories.map(cat => {
                const bank = state.banks.find(b => b.category === cat);
                return (
                  <View key={cat} style={styles.categoryChip}>
                    <Text style={styles.categoryChipIcon}>{bank?.icon || '📝'}</Text>
                    <Text style={styles.categoryChipText}>{bank?.name || cat}</Text>
                  </View>
                );
              })
            )}
          </View>
          <TouchableOpacity 
            style={styles.changeCategoriesButton}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Text style={styles.changeCategoriesText}>Change Categories</Text>
          </TouchableOpacity>
        </View>

        {/* NSFW Info */}
        {state.nsfwEnabled && (
          <View style={styles.nsfwInfo}>
            <Text style={styles.nsfwInfoIcon}>🔞</Text>
            <Text style={styles.nsfwInfoText}>NSFW content is enabled. Adult questions may appear.</Text>
          </View>
        )}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.createButton, 
            (isLoading || !gameName.trim() || players.filter(p => p.name.trim()).length < 2) && styles.createButtonDisabled
          ]}
          onPress={handleCreate}
          disabled={isLoading || !gameName.trim() || players.filter(p => p.name.trim()).length < 2}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Creating...' : 'Start Game'}
          </Text>
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  title: {
    ...typography.h3,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  playerInputContainer: {
    flex: 1,
  },
  playerLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  playerInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 16,
  },
  addPlayerButton: {
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
  },
  addPlayerText: {
    ...typography.body,
    color: colors.primary,
  },
  categoriesSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  noCategories: {
    ...typography.body,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  categoryChipIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryChipText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  changeCategoriesButton: {
    alignSelf: 'flex-start',
  },
  changeCategoriesText: {
    ...typography.body,
    color: colors.primary,
  },
  nsfwInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  nsfwInfoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  nsfwInfoText: {
    ...typography.bodySmall,
    color: colors.error,
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  createButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
