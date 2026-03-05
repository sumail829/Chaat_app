import { View, Text, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { FOODS, CATEGORIES } from "../../constants/food";
import { useCartStore } from "../../store/cartStore";

export default function MenuScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { items, addItem, removeItem } = useCartStore();

  const filtered = FOODS.filter(f => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-4 shadow-sm">
        <Text className="text-gray-800 font-bold text-2xl mb-3">Our Menu 🍽️</Text>
        <View className="bg-gray-100 flex-row items-center rounded-xl px-3 py-2 gap-2">
          <Text className="text-gray-400">🔍</Text>
          <TextInput
            placeholder="Search dishes..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-gray-700"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full mr-2 ${activeCategory === cat ? "bg-orange-500" : "bg-gray-100"}`}
            >
              <Text className={`font-semibold text-sm ${activeCategory === cat ? "text-white" : "text-gray-500"}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Food Grid */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => {
          const qty = items.find(i => i.id === item.id)?.quantity ?? 0;
          return (
            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm"
              onPress={() => router.push({ pathname: "/(app)/food/[id]", params: { id: item.id } })}
            >
              <View className="relative">
                <Image source={{ uri: item.image }} className="w-full h-36" resizeMode="cover" />
                {item.popular && (
                  <View className="absolute top-2 left-2 bg-orange-500 rounded-full px-2 py-0.5">
                    <Text className="text-white text-xs font-bold">🔥 Popular</Text>
                  </View>
                )}
              </View>
              <View className="p-3">
                <Text className="text-gray-800 font-bold text-sm" numberOfLines={1}>{item.name}</Text>
                <Text className="text-gray-400 text-xs mt-0.5 leading-4" numberOfLines={2}>{item.description}</Text>
                <View className="flex-row items-center mt-1 gap-1">
                  <Text className="text-yellow-400 text-xs">⭐</Text>
                  <Text className="text-gray-500 text-xs">{item.rating}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-orange-500 font-bold text-base">₹{item.price}</Text>
                  {qty > 0 ? (
                    <View className="flex-row items-center gap-2 bg-orange-50 rounded-full px-2 py-1">
                      <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <Text className="text-orange-500 font-bold text-base">−</Text>
                      </TouchableOpacity>
                      <Text className="text-orange-500 font-bold text-sm">{qty}</Text>
                      <TouchableOpacity onPress={() => addItem(item)}>
                        <Text className="text-orange-500 font-bold text-base">+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="bg-orange-500 rounded-full w-8 h-8 items-center justify-center"
                      onPress={() => addItem(item)}
                    >
                      <Text className="text-white font-bold text-lg">+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Cart Pill */}
      {items.length > 0 && (
        <View className="absolute bottom-24 left-5 right-5">
          <TouchableOpacity
            className="bg-orange-500 rounded-2xl py-4 px-6 flex-row items-center justify-between shadow-lg"
            onPress={() => router.push("/(tabs)/cart")}
          >
            <View className="bg-orange-400 rounded-full w-7 h-7 items-center justify-center">
              <Text className="text-white font-bold text-sm">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </Text>
            </View>
            <Text className="text-white font-bold text-base">View Cart</Text>
            <Text className="text-orange-200 text-sm">
              ₹{items.reduce((s, i) => s + i.price * i.quantity, 0)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}