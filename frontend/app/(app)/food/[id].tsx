import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FOODS } from "../../../constants/food";
import { useCartStore } from "../../../store/cartStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FoodDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const food = FOODS.find((f) => f.id === id);
  const { items, addItem, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.id === id);
  const qty = cartItem?.quantity ?? 0;

  if (!food) return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-gray-400">Item not found</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Hero Image */}
      <View className="relative">
        <Image source={{ uri: food.image }} className="w-full h-72" resizeMode="cover" />
        {/* Back button */}
        <SafeAreaView className="absolute top-0 left-0 right-0">
          <View className="flex-row justify-between px-4 pt-2">
            <TouchableOpacity
              className="bg-white/90 rounded-full w-10 h-10 items-center justify-center"
              onPress={() => router.back()}
            >
              <Text className="text-gray-700 text-lg">←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white/90 rounded-full w-10 h-10 items-center justify-center"
              onPress={() => router.push("/cart")}
            >
              <Text className="text-lg">🛒</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {food.popular && (
          <View className="absolute bottom-4 left-4 bg-orange-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">🔥 Popular</Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Title Row */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-gray-800 text-2xl font-bold flex-1 mr-2">{food.name}</Text>
          <Text className="text-orange-500 font-bold text-2xl">₹{food.price}</Text>
        </View>

        {/* Rating & Category */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="flex-row items-center gap-1 bg-green-50 rounded-full px-3 py-1">
            <Text className="text-yellow-400 text-sm">⭐</Text>
            <Text className="text-green-700 font-bold text-sm">{food.rating}</Text>
          </View>
          <View className="bg-orange-50 rounded-full px-3 py-1">
            <Text className="text-orange-600 text-sm font-semibold">{food.category}</Text>
          </View>
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <Text className="text-gray-500 text-sm">🕐 15-20 min</Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-gray-500 text-base leading-7 mb-6">{food.description}</Text>

        {/* Nutrition (mock) */}
        <Text className="text-gray-800 font-bold text-lg mb-3">Nutrition Info</Text>
        <View className="flex-row justify-between bg-gray-50 rounded-2xl p-4 mb-6">
          {[
            { label: "Calories", val: "180 kcal" },
            { label: "Protein", val: "4g" },
            { label: "Carbs", val: "28g" },
            { label: "Fat", val: "6g" },
          ].map((n) => (
            <View key={n.label} className="items-center">
              <Text className="text-gray-800 font-bold text-sm">{n.val}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{n.label}</Text>
            </View>
          ))}
        </View>

        {/* Allergens */}
        <Text className="text-gray-800 font-bold text-lg mb-2">Allergens</Text>
        <Text className="text-gray-400 text-sm leading-6">
          May contain traces of gluten, dairy, and nuts. Cooked in shared equipment.
        </Text>
      </ScrollView>

      {/* Bottom Add to Cart */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
        {qty > 0 ? (
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center bg-orange-50 rounded-2xl px-4 py-3 gap-4">
              <TouchableOpacity onPress={() => removeItem(food.id)}>
                <Text className="text-orange-500 font-bold text-xl">−</Text>
              </TouchableOpacity>
              <Text className="text-orange-500 font-bold text-lg w-6 text-center">{qty}</Text>
              <TouchableOpacity onPress={() => addItem(food)}>
                <Text className="text-orange-500 font-bold text-xl">+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="flex-1 bg-orange-500 rounded-2xl py-4 items-center"
              onPress={() => router.push("/cart")}
            >
              <Text className="text-white font-bold text-base">Go to Cart · ₹{food.price * qty}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-orange-500 rounded-2xl py-4 items-center"
            onPress={() => addItem(food)}
          >
            <Text className="text-white font-bold text-lg">Add to Cart — ₹{food.price}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}