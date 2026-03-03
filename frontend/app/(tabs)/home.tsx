import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { FOODS } from "../../constants/food";

const POPULAR = FOODS.filter(f => f.popular);

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-orange-500 px-5 pt-14 pb-8 rounded-b-[36px]">
        <View className="flex-row justify-between items-start mb-5">
          <View>
            <Text className="text-orange-100 text-sm">Delivering to 📍</Text>
            <Text className="text-white font-bold text-lg">Kathmandu, NP</Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full w-10 h-10 items-center justify-center">
            <Text className="text-xl">🔔</Text>
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <View className="bg-white flex-row items-center rounded-2xl px-4 py-3 gap-2">
          <Text className="text-gray-400 text-lg">🔍</Text>
          <TextInput
            placeholder="Search for chaat, snacks..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-gray-700"
            onPress={() => router.push("/(tabs)/menu")}
          />
        </View>
      </View>

      {/* Banner */}
      <View className="mx-5 mt-5 bg-yellow-400 rounded-3xl p-5 flex-row items-center">
        <View className="flex-1">
          <Text className="text-yellow-900 font-bold text-xl">20% OFF</Text>
          <Text className="text-yellow-800 text-sm mt-1">On your first order! 🎉</Text>
          <TouchableOpacity className="bg-yellow-900 rounded-full px-4 py-2 mt-3 self-start">
            <Text className="text-yellow-100 font-semibold text-xs">Order Now</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-6xl">🍛</Text>
      </View>

      {/* Categories */}
      <View className="mt-6 px-5">
        <Text className="text-gray-800 font-bold text-lg mb-3">Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
          {[
            { emoji: "🥙", label: "Chaat" },
            { emoji: "🥟", label: "Snacks" },
            { emoji: "🍵", label: "Drinks" },
            { emoji: "🍮", label: "Sweets" },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.label}
              className="items-center bg-white rounded-2xl px-5 py-3 mr-3 shadow-sm"
              onPress={() => router.push("/(tabs)/menu")}
            >
              <Text className="text-3xl">{cat.emoji}</Text>
              <Text className="text-gray-600 text-xs font-semibold mt-1">{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Items */}
      <View className="mt-6 px-5 mb-24">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-800 font-bold text-lg">🔥 Popular</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/menu")}>
            <Text className="text-orange-500 font-semibold text-sm">See All</Text>
          </TouchableOpacity>
        </View>
        {POPULAR.map((item:any) => (
          <View key={item.id} className="bg-white rounded-2xl flex-row overflow-hidden mb-3 shadow-sm">
            <Image source={{ uri: item.image }} className="w-28 h-28" />
            <View className="flex-1 p-3 justify-between">
              <View>
                <Text className="text-gray-800 font-bold text-base">{item.name}</Text>
                <Text className="text-gray-400 text-xs mt-1 leading-4" numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-orange-500 font-bold text-base">₹{item.price}</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-yellow-400 text-sm">⭐</Text>
                  <Text className="text-gray-600 text-xs font-semibold">{item.rating}</Text>
                </View>
                <TouchableOpacity className="bg-orange-500 rounded-full w-8 h-8 items-center justify-center">
                  <Text className="text-white font-bold text-lg">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}