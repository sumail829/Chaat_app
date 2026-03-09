import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";

export default function ScanScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  useEffect(() => {
    if (token) handleScan();
  }, [token]);

  const handleScan = async () => {
    try {
      const res = await api.post("/session/start", { qrToken: token });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid or expired QR code");
        router.replace("/(app)/login");
        return;
      }

      // Go to menu with session token
      router.replace({
        pathname: "/(tabs)/menu",
        params: {
          sessionToken: data.sessionToken,
          tableNumber: data.tableNumber,
        },
      });
    } catch (err) {
      console.log("Scan error:", err);
      alert("Something went wrong. Please scan again.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl mb-4">🍛</Text>
      <ActivityIndicator size="large" color="#f97316" />
      <Text className="text-gray-500 mt-4 font-medium">Setting up your table...</Text>
      <Text className="text-gray-400 text-sm mt-2">Please wait</Text>
    </View>
  );
}