// Stub page for Sync settings
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function SyncSettings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sync Progress' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Sync Progress</Text>
        <Text style={styles.placeholder}>Sync functionality coming soon</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  placeholder: { fontSize: 16, color: '#666', textAlign: 'center' },
});
