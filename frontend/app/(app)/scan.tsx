import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";

export default function ScanScreen() {
  const router = useRouter();
  const { table } = useLocalSearchParams<{ table: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [sessionData, setSessionData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (table) handleScan();
  }, [table]);

  const handleScan = async () => {
    try {
      console.log("tableId:", table);
      const res = await api.post("/session/start", { tableId: table });
      const data = await res.json();
      console.log("response:", res.status, data);

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid QR code");
        setStatus("error");
        return;
      }

      setSessionData(data);
      setStatus("success");

    } catch (err: any) {
      console.log("Scan error:", err);
      setErrorMsg(err?.message || "Something went wrong");
      setStatus("error");
    }
  };

  // Loading
  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-5xl mb-4">🍛</Text>
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-500 mt-4 font-medium">Setting up your table...</Text>
      </View>
    );
  }

  // Error
  if (status === "error") {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-5xl mb-4">❌</Text>
        <Text className="text-gray-800 font-bold text-xl mb-2">Oops!</Text>
        <Text className="text-gray-400 text-center mb-8">{errorMsg}</Text>
        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 px-8"
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text className="text-white font-bold">Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Success
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-6xl mb-4">🎉</Text>
      <Text className="text-gray-800 font-bold text-2xl mb-2">Table Ready!</Text>
      <Text className="text-gray-400 text-center mb-2">
        You're seated at
      </Text>
      <Text className="text-orange-500 font-bold text-3xl mb-8">
        Table {sessionData?.tableNumber}
      </Text>
      <Text className="text-gray-400 text-xs text-center mb-8">
        Session: {sessionData?.sessionToken?.substring(0, 8)}...
      </Text>
      <TouchableOpacity
        className="bg-orange-500 rounded-2xl py-4 px-12 w-full items-center"
        onPress={() =>
          router.replace({
            pathname: "/(tabs)/menu",
            params: {
              sessionToken: sessionData?.sessionToken,
              tableNumber: sessionData?.tableNumber,
            },
          })
        }
      >
        <Text className="text-white font-bold text-lg">View Menu 🍽️</Text>
      </TouchableOpacity>
    </View>
  );
}
