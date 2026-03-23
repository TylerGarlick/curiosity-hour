// Stub page for Custom Questions settings
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function CustomQuestionsSettings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Custom Questions' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Custom Questions</Text>
        <Text style={styles.placeholder}>Custom question management coming soon</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  placeholder: { fontSize: 16, color: '#666', textAlign: 'center' },
});
