// Stub page for Category Management settings
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function CategoriesSettings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Manage Categories' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Manage Categories</Text>
        <Text style={styles.placeholder}>Category management coming soon</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  placeholder: { fontSize: 16, color: '#666', textAlign: 'center' },
});
