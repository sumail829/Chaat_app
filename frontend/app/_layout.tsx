import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />          {/* Landing */}
        <Stack.Screen name="(app)" />          {/* Auth + detail screens */}
        <Stack.Screen name="(tabs)" />         {/* Main app */}
      </Stack>
    </SafeAreaProvider>
  );
}