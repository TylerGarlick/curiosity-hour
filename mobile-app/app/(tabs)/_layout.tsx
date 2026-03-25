import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../src/constants/theme';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.bg,
        },
        headerTitleStyle: {
          color: colors.textPrimary,
          fontWeight: '600',
        },
        headerTintColor: colors.textPrimary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Curiosity Hour',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💭" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🎯" label="Categories" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: 'Question',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="❓" label="Play" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
  },
  labelFocused: {
    color: colors.accent,
    fontWeight: '600',
  },
});