// Stub page for Statistics settings
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function StatisticsSettings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.placeholder}>Statistics view coming soon</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  placeholder: { fontSize: 16, color: '#666', textAlign: 'center' },
});
