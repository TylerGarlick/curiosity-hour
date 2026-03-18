import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [relationshipMode, setRelationshipMode] = useState<'friends' | 'dating' | 'married'>('friends');

  const handleStart = () => {
    // Store game state (simplified for mockup)
    router.push('/(tabs)/question');
  };

  const handleCreateRoom = () => {
    router.push('/room/create');
  };

  const handleJoinRoom = () => {
    router.push('/room/join');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          
          {playerNames.map((name, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Player {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder={index === 0 ? "Enter your name" : "Partner's name"}
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={(text) => {
                  const newNames = [...playerNames];
                  newNames[index] = text;
                  setPlayerNames(newNames);
                }}
              />
            </View>
          ))}
        </View>

        {/* Relationship Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relationship Mode</Text>
          <View style={styles.modeSelector}>
            {(['friends', 'dating', 'married'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  relationshipMode === mode && styles.modeButtonActive,
                ]}
                onPress={() => setRelationshipMode(mode)}
              >
                <Text style={[
                  styles.modeButtonText,
                  relationshipMode === mode && styles.modeButtonTextActive,
                ]}>
                  {mode === 'friends' ? '👥 Friends' : mode === 'dating' ? '💕 Dating' : '💍 Married'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Shared Room Buttons */}
        <View style={styles.sharedRoomButtons}>
          <TouchableOpacity 
            style={styles.sharedRoomButton} 
            onPress={handleCreateRoom}
          >
            <Text style={styles.sharedRoomIcon}>🎮</Text>
            <Text style={styles.sharedRoomText}>Create Room</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sharedRoomButton} 
            onPress={handleJoinRoom}
          >
            <Text style={styles.sharedRoomIcon}>🔗</Text>
            <Text style={styles.sharedRoomText}>Join Room</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Link */}
        <TouchableOpacity 
          style={styles.settingsLink}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsLinkText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
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
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  modeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: colors.textPrimary,
  },
  startButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  startButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    marginHorizontal: spacing.md,
  },
  sharedRoomButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sharedRoomButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sharedRoomIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  sharedRoomText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  settingsLink: {
    alignItems: 'center',
    padding: spacing.md,
  },
  settingsLinkText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});