import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a2e' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="room/create" 
            options={{ 
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="room/join" 
            options={{ 
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="room/[code]" 
            options={{ 
              presentation: 'card',
            }} 
          />
          <Stack.Screen 
            name="settings" 
            options={{ 
              presentation: 'modal',
            }} 
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
