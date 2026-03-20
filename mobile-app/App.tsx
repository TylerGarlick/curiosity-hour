// Curiosity Hour Mobile App Entry Point
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QuestionBankProvider } from "./src/context/QuestionBankContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <QuestionBankProvider>
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
            name="(tabs)/question" 
            options={{ 
              presentation: 'card',
              animation: 'slide_from_bottom',
            }} 
          />
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
          <Stack.Screen 
            name="design-system" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              headerStyle: { backgroundColor: '#0D0D12' },
              headerTintColor: '#FF6B4A',
              headerTitle: 'Design System',
            }} 
          />
        </Stack>
      </QuestionBankProvider>
    </SafeAreaProvider>
  );
}
