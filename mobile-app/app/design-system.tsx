// Design System Demo Screen Route
// Access via /design-system from the app

import { StyleSheet, View, Text } from 'react-native';

export default function DesignSystemScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Design System</Text>
      <Text style={styles.subtitle}>Components available in src/components/ui/</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D12',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
  },
});
