import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../src/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will clear all your answered questions and statistics. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your interest! This would open the App Store/Play Store.');
  };

  const handleContact = () => {
    Alert.alert('Contact Us', 'Email: hello@curiosityhour.app');
  };

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
        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
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
              value={notifications}
              onValueChange={setNotifications}
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
              value={soundEffects}
              onValueChange={setSoundEffects}
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
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/custom-questions')}>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  settingText: {
    ...typography.body,
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
});