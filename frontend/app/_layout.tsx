import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(app)/login" />
        <Stack.Screen name="(app)/otp" />
        <Stack.Screen name="(app)/cart" />
        <Stack.Screen name="(app)/food/[id]" options={{ presentation: "modal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}