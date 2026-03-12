import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCartStore } from "../../store/cartStore";
import { api } from "@/services/api";

type Category = {
  id: string;
  name: string;
  description?: string;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  category: Category;
};

export default function MenuScreen() {
  const router = useRouter();
  const { items, addItem, removeItem, sessionToken, tableNumber } = useCartStore();


  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, menuRes] = await Promise.all([
        api.get("/categories"),
        api.get("/menus"),
      ]);

      const catData = await catRes.json();
      const menuData = await menuRes.json();

      setCategories(catData);
      setMenuItems(menuData);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchCat =
      activeCategory === "All" || item.category?.name === activeCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchAvailable = item.isAvailable;
    return matchCat && matchSearch && matchAvailable;
  });

  const cartTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-400 mt-3">Loading menu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-800 font-bold text-2xl">Our Menu 🍽️</Text>
          {tableNumber ? (
            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-orange-500 font-semibold text-sm">
                🪑 Table {tableNumber}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Search */}
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          <TouchableOpacity
            onPress={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full mr-2 ${activeCategory === "All" ? "bg-orange-500" : "bg-gray-100"
              }`}
          >
            <Text
              className={`font-semibold text-sm ${activeCategory === "All" ? "text-white" : "text-gray-500"
                }`}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full mr-2 ${activeCategory === cat.name ? "bg-orange-500" : "bg-gray-100"
                }`}
            >
              <Text
                className={`font-semibold text-sm ${activeCategory === cat.name ? "text-white" : "text-gray-500"
                  }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Empty state */}
      {filtered.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-3">🍽️</Text>
          <Text className="text-gray-500 font-semibold">No items found</Text>
          <Text className="text-gray-400 text-sm mt-1">
            Try a different category or search
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const qty = items.find((i) => i.id === item.id)?.quantity ?? 0;
            return (
              <TouchableOpacity
                className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/(app)/food/[id]",
                    params: { id: item.id },
                  })
                }
              >
                {/* Image */}
                <View className="relative">
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-full h-36"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-36 bg-orange-50 items-center justify-center">
                      <Text className="text-5xl">🍛</Text>
                    </View>
                  )}
                  {!item.isAvailable && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                      <Text className="text-white font-bold text-xs">
                        Unavailable
                      </Text>
                    </View>
                  )}
                </View>

                {/* Info */}
                <View className="p-3">
                  <Text
                    className="text-gray-800 font-bold text-sm"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-gray-400 text-xs mt-0.5 leading-4"
                    numberOfLines={2}
                  >
                    {item.description ?? item.category?.name}
                  </Text>

                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-orange-500 font-bold text-base">
                      Rs. {item.price}
                    </Text>
                    {qty > 0 ? (
                      <View className="flex-row items-center gap-2 bg-orange-50 rounded-full px-2 py-1">
                        <TouchableOpacity
                          onPress={() => removeItem(item.id)}
                        >
                          <Text className="text-orange-500 font-bold text-base">
                            −
                          </Text>
                        </TouchableOpacity>
                        <Text className="text-orange-500 font-bold text-sm">
                          {qty}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            addItem({
                              id: item.id,
                              name: item.name,
                              price: Number(item.price),
                              image: item.imageUrl,
                              category: item.category?.name,
                              description: item.description,
                            })

                          }
                        >
                          <Text className="text-orange-500 font-bold text-base">
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        className="bg-orange-500 rounded-full w-8 h-8 items-center justify-center"
                        onPress={() =>
                          addItem({
                            id: item.id,
                            name: item.name,
                            price: Number(item.price),
                            image: item.imageUrl,
                            category: item.category?.name,
                            description: item.description,
                          })

                        }
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
      )}

      {/* Cart Pill */}
      {items.length > 0 && (
        <View className="absolute bottom-24 left-5 right-5">
          <TouchableOpacity
            className="bg-orange-500 rounded-2xl py-4 px-6 flex-row items-center justify-between shadow-lg"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/cart",
                params: { sessionToken, tableNumber },
              })
            }
          >
            <View className="bg-orange-400 rounded-full w-7 h-7 items-center justify-center">
              <Text className="text-white font-bold text-sm">{cartCount}</Text>
            </View>
            <Text className="text-white font-bold text-base">View Cart</Text>
            <Text className="text-orange-200 text-sm">Rs. {cartTotal}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}