import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="cart" />
      <Stack.Screen
        name="food/[id]"
        options={{
          presentation: "modal",   // slides up as a modal
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}