import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";

const MENU_ITEMS = [
  { icon: "📍", label: "Saved Addresses" },
  { icon: "💳", label: "Payment Methods" },
  { icon: "🎁", label: "Offers & Rewards" },
  { icon: "⭐", label: "Rate the App" },
  { icon: "🆘", label: "Help & Support" },
  { icon: "ℹ️", label: "About Us" },
];

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        router.replace("/(app)/login");
        return;
      }

      // Decode JWT to get user id (without library)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const res = await api.get(`/users/${payload.sub}`);
      const data = await res.json();

      if (!res.ok) {
        router.replace("/(app)/login");
        return;
      }

      setUser(data);
    } catch (err) {
      console.log("Profile fetch error:", err);
      router.replace("/(app)/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    router.replace("/(app)/login");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 px-5 pt-14 pb-10 rounded-b-[36px] items-center">
        <View className="w-20 h-20 rounded-full bg-orange-300 items-center justify-center mb-3">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-white font-bold text-xl">{user?.name ?? "User"}</Text>
        <Text className="text-orange-100 text-sm mt-1">{user?.email ?? ""}</Text>
        {user?.phone ? (
          <Text className="text-orange-100 text-sm mt-1">+977 {user.phone}</Text>
        ) : null}
        <View className="mt-2 bg-orange-400 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold capitalize">{user?.role ?? "user"}</Text>
        </View>
      </View>

      <ScrollView className="px-5 mt-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stats */}
        <View className="flex-row gap-3 mb-5">
          {[
            { label: "Orders", val: "0" },
            { label: "Reviews", val: "0" },
            { label: "Points", val: "0" },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
              <Text className="text-orange-500 font-bold text-xl">{s.val}</Text>
              <Text className="text-gray-400 text-xs mt-1">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Info */}
        <View className="bg-white rounded-2xl px-4 py-4 mb-4 shadow-sm">
          <Text className="text-gray-500 text-xs font-semibold mb-3 uppercase tracking-wide">Account Info</Text>
          <View className="flex-row items-center mb-3">
            <Text className="text-base mr-3">✉️</Text>
            <View>
              <Text className="text-gray-400 text-xs">Email</Text>
              <Text className="text-gray-700 font-medium">{user?.email}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-base mr-3">📱</Text>
            <View>
              <Text className="text-gray-400 text-xs">Phone</Text>
              <Text className="text-gray-700 font-medium">
                {user?.phone ? `+977 ${user.phone}` : "Not set"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu List */}
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center px-4 py-4 gap-3 ${
                i < MENU_ITEMS.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <Text className="text-xl">{item.icon}</Text>
              <Text className="flex-1 text-gray-700 font-medium">{item.label}</Text>
              <Text className="text-gray-300 text-lg">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-red-50 border border-red-100 rounded-2xl py-4 items-center"
          onPress={handleLogout}
        >
          <Text className="text-red-500 font-bold">🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}