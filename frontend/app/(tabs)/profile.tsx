
// ─── app/(tabs)/profile.tsx ──────────────────────────────────────
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const MENU_ITEMS = [
  { icon: "📍", label: "Saved Addresses" },
  { icon: "💳", label: "Payment Methods" },
  { icon: "🎁", label: "Offers & Rewards" },
  { icon: "⭐", label: "Rate the App" },
  { icon: "🆘", label: "Help & Support" },
  { icon: "ℹ️", label: "About Us" },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-orange-500 px-5 pt-14 pb-10 rounded-b-[36px] items-center">
        <View className="w-20 h-20 rounded-full bg-orange-300 items-center justify-center mb-3">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-white font-bold text-xl">Suman Sharma</Text>
        <Text className="text-orange-100 text-sm mt-1">+91 98765 43210</Text>
      </View>

      <ScrollView className="px-5 mt-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stats */}
        <View className="flex-row gap-3 mb-5">
          {[{ label: "Orders", val: "12" }, { label: "Reviews", val: "4" }, { label: "Points", val: "340" }].map(s => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
              <Text className="text-orange-500 font-bold text-xl">{s.val}</Text>
              <Text className="text-gray-400 text-xs mt-1">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu List */}
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center px-4 py-4 gap-3 ${i < MENU_ITEMS.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <Text className="text-xl">{item.icon}</Text>
              <Text className="flex-1 text-gray-700 font-medium">{item.label}</Text>
              <Text className="text-gray-300 text-lg">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-red-50 border border-red-100 rounded-2xl py-4 items-center"
          onPress={() => router.push("/")}
        >
          <Text className="text-red-500 font-bold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}