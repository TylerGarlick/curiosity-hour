import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../src/constants/theme';
import { useQuestionBank } from '../src/context/QuestionBankContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for settings
const SETTINGS_STORAGE_KEY = '@curiosity/settings';

// Settings interface
interface AppSettings {
  globalNsfwEnabled: boolean;
  carModeEnabled: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

const defaultSettings: AppSettings = {
  globalNsfwEnabled: false,
  carModeEnabled: false,
  darkMode: true,
  soundEnabled: true,
  hapticEnabled: true,
};

export default function SettingsScreen() {
  const router = useRouter();
  const {
    state,
    toggleNsfw,
    setNsfwEnabled,
    getOwnedPacks,
    addEntitlement,
    getActiveGames,
    getArchivedGames,
    updateGameName,
    archiveGame,
    restoreGame,
    deleteGame,
  } = useQuestionBank();

  // Local settings state
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Rename modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameGameId, setRenameGameId] = useState<string | null>(null);
  const [newGameName, setNewGameName] = useState('');

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppSettings;
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Toggle handlers
  const handleNsfwToggle = (value: boolean) => {
    setNsfwEnabled(value);
    saveSettings({ ...settings, globalNsfwEnabled: value });
  };

  const handleCarModeToggle = (value: boolean) => {
    saveSettings({ ...settings, carModeEnabled: value });
  };

  const handleDarkModeToggle = (value: boolean) => {
    saveSettings({ ...settings, darkMode: value });
  };

  const handleSoundToggle = (value: boolean) => {
    saveSettings({ ...settings, soundEnabled: value });
  };

  const handleHapticToggle = (value: boolean) => {
    saveSettings({ ...settings, hapticEnabled: value });
  };

  // Game management handlers
  const handleRenameGame = (gameId: string, currentName: string) => {
    setRenameGameId(gameId);
    setNewGameName(currentName);
    setShowRenameModal(true);
  };

  const handleSaveRename = () => {
    if (renameGameId && newGameName.trim()) {
      updateGameName(renameGameId, newGameName.trim());
      setShowRenameModal(false);
      setRenameGameId(null);
      setNewGameName('');
    }
  };

  const handleArchiveGame = (gameId: string) => {
    Alert.alert(
      'Archive Game',
      'This game will be hidden from the main screen but can be restored later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Archive', onPress: () => archiveGame(gameId) },
      ]
    );
  };

  const handleRestoreGame = (gameId: string) => {
    restoreGame(gameId);
  };

  const handleDeleteGame = (gameId: string) => {
    Alert.alert(
      'Delete Game',
      'This will permanently delete this game and all its progress. This cannot be undone.',
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

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will clear all your answered questions and statistics. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset all games
            // This would clear all game progress
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your interest! This would open the App Store/Play Store.');
  };

  const handleContact = () => {
    Alert.alert('Contact Us', 'Email: hello@curiosityhour.app');
  };

  const handleUnlockPacks = () => {
    router.push('/purchase-packs');
  };

  const ownedPacks = getOwnedPacks();
  const freePacks = ['deep', 'funny', 'nostalgia', 'would-you-rather'];
  const paidPacks = ['intimate', 'nsfw', 'spicy'];
  const ownedPaidPacks = ownedPacks.filter(p => paidPacks.includes(p));

  const activeGames = getActiveGames();
  const archivedGames = getArchivedGames();

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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Game Management Section */}
        {(activeGames.length > 0 || archivedGames.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Management</Text>

            {/* Active Games */}
            {activeGames.length > 0 && (
              <View style={styles.gamesSubSection}>
                <Text style={styles.subSectionTitle}>Active Games</Text>
                {activeGames.map(game => {
                  const stats = getGameStats(game.id);
                  return (
                    <View key={game.id} style={styles.gameItem}>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>{game.name}</Text>
                        <Text style={styles.gameMeta}>
                          {stats.answered}/{stats.total} answered • {formatDate(game.updatedAt)}
                        </Text>
                      </View>
                      <View style={styles.gameActions}>
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleRenameGame(game.id, game.name)}
                        >
                          <Text style={styles.iconButtonText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleArchiveGame(game.id)}
                        >
                          <Text style={styles.iconButtonText}>📦</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Archived Games */}
            {archivedGames.length > 0 && (
              <View style={styles.gamesSubSection}>
                <Text style={styles.subSectionTitle}>Archived Games</Text>
                {archivedGames.map(game => {
                  const stats = getGameStats(game.id);
                  return (
                    <View key={game.id} style={[styles.gameItem, styles.archivedGameItem]}>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>{game.name}</Text>
                        <Text style={styles.gameMeta}>
                          {stats.answered}/{stats.total} answered • {formatDate(game.updatedAt)}
                        </Text>
                      </View>
                      <View style={styles.gameActions}>
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleRestoreGame(game.id)}
                        >
                          <Text style={styles.iconButtonText}>♻️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.iconButton, styles.deleteIconButton]}
                          onPress={() => handleDeleteGame(game.id)}
                        >
                          <Text style={styles.iconButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* NSFW Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🔞</Text>
              <View>
                <Text style={styles.settingText}>NSFW Content</Text>
                <Text style={styles.settingDescription}>Show adult-themed questions across all categories</Text>
              </View>
            </View>
            <Switch
              value={state.nsfwEnabled}
              onValueChange={handleNsfwToggle}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={state.nsfwEnabled ? colors.primary : colors.textMuted}
            />
          </View>

          <View style={styles.packStatus}>
            <Text style={styles.packStatusTitle}>Premium Packs</Text>
            <Text style={styles.packStatusText}>
              {ownedPaidPacks.length}/{paidPacks.length} unlocked
            </Text>
          </View>

          {ownedPaidPacks.length < paidPacks.length && (
            <TouchableOpacity
              style={styles.unlockButton}
              onPress={handleUnlockPacks}
            >
              <Text style={styles.unlockButtonText}>🔓 Get More Packs</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Car Mode Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Mode</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🚗</Text>
              <View>
                <Text style={styles.settingText}>Car Mode</Text>
                <Text style={styles.settingDescription}>Enable manual entry mode for driving (larger text, simpler UI)</Text>
              </View>
            </View>
            <Switch
              value={settings.carModeEnabled}
              onValueChange={handleCarModeToggle}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={settings.carModeEnabled ? colors.primary : colors.textMuted}
            />
          </View>

          {settings.carModeEnabled && (
            <View style={styles.carModeNote}>
              <Text style={styles.carModeNoteText}>
                💡 Car mode provides a simplified interface with larger text for safe use while driving.
                Questions can be answered with simple taps.
              </Text>
            </View>
          )}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>📳</Text>
              <Text style={styles.settingText}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={handleHapticToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuText}>Custom Questions</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuText}>View Statistics</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuIcon}>💾</Text>
            <Text style={styles.menuText}>Export Data</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemDanger]}
            onPress={handleResetProgress}
          >
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuText, styles.menuTextDanger]}>Reset Progress</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleRateApp}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>Rate App</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleContact}>
            <Text style={styles.menuIcon}>✉️</Text>
            <Text style={styles.menuText}>Contact Us</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={styles.version}>
          <Text style={styles.versionText}>Curiosity Hour v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Curiosity Hour</Text>
        </View>
      </ScrollView>

      {/* Rename Game Modal */}
      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Game</Text>

            <TextInput
              style={styles.modalInput}
              value={newGameName}
              onChangeText={setNewGameName}
              placeholder="Enter new game name"
              placeholderTextColor={colors.textMuted}
              autoFocus
              maxLength={50}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowRenameModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveRename}
                disabled={!newGameName.trim()}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.xxl + 10,
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
  title: {
    ...typography.h3,
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    color: colors.textMuted,
  },
  subSectionTitle: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 60,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  settingText: {
    ...typography.body,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  packStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  packStatusTitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  packStatusText: {
    ...typography.bodyBold,
    color: colors.success,
  },
  unlockButton: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  unlockButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  carModeNote: {
    backgroundColor: colors.secondary + '15',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  carModeNoteText: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuItemDanger: {
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  menuText: {
    ...typography.body,
    flex: 1,
  },
  menuTextDanger: {
    color: colors.error,
  },
  menuChevron: {
    color: colors.textMuted,
    fontSize: 20,
  },
  gamesSubSection: {
    marginBottom: spacing.md,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  archivedGameItem: {
    opacity: 0.7,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    ...typography.bodyBold,
    marginBottom: spacing.xxs,
  },
  gameMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  gameActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 18,
  },
  deleteIconButton: {
    backgroundColor: colors.error + '20',
  },
  version: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  versionText: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  copyrightText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.backdropDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: colors.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
  },
  modalSaveText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
