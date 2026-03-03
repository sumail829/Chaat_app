import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../../store/cartStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const router = useRouter();
  const { items, addItem, removeItem, deleteItem, clearCart, totalPrice, totalItems } = useCartStore();

  const subtotal = totalPrice();
  const delivery = subtotal > 0 ? 30 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + taxes;

  const handlePlaceOrder = () => {
    Alert.alert("Order Placed! 🎉", "Your order has been placed successfully.", [
      { text: "OK", onPress: () => { clearCart(); router.replace("/(tabs)/order")  ; } }
    ]);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-6xl mb-4">🛒</Text>
        <Text className="text-gray-800 font-bold text-xl mb-2">Your cart is empty</Text>
        <Text className="text-gray-400 text-sm text-center mb-8">
          Add some delicious items from our menu!
        </Text>
        <TouchableOpacity
          className="bg-orange-500 rounded-2xl px-8 py-4"
          onPress={() => router.push("/(tabs)/menu")}
        >
          <Text className="text-white font-bold text-base">Browse Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <SafeAreaView className="bg-white shadow-sm">
        <View className="flex-row items-center px-5 py-3 gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-gray-800 font-bold text-xl">
            My Cart ({totalItems()} items)
          </Text>
          <TouchableOpacity onPress={() => {
            Alert.alert("Clear Cart", "Remove all items?", [
              { text: "Cancel" },
              { text: "Clear", style: "destructive", onPress: clearCart }
            ]);
          }}>
            <Text className="text-red-400 text-sm font-semibold">Clear</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        {/* Delivery address */}
        <TouchableOpacity className="bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-3 shadow-sm">
          <Text className="text-2xl">📍</Text>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold text-sm">Deliver to</Text>
            <Text className="text-gray-400 text-xs mt-0.5">Kathmandu, Bagmati Province, NP</Text>
          </View>
          <Text className="text-orange-500 text-sm font-semibold">Change</Text>
        </TouchableOpacity>

        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.id} className="bg-white rounded-2xl p-3 mb-3 flex-row gap-3 shadow-sm">
            <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl" resizeMode="cover" />
            <View className="flex-1 justify-between">
              <View className="flex-row justify-between items-start">
                <Text className="text-gray-800 font-bold text-sm flex-1 mr-2">{item.name}</Text>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <Text className="text-red-300 text-lg">✕</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-400 text-xs" numberOfLines={1}>{item.category}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-orange-500 font-bold">₹{item.price * item.quantity}</Text>
                <View className="flex-row items-center bg-orange-50 rounded-full px-2 py-1 gap-2">
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text className="text-orange-500 font-bold text-base">−</Text>
                  </TouchableOpacity>
                  <Text className="text-orange-500 font-bold text-sm w-4 text-center">{item.quantity}</Text>
                  <TouchableOpacity onPress={() => addItem(item)}>
                    <Text className="text-orange-500 font-bold text-base">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Promo Code */}
        <TouchableOpacity className="bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-3 shadow-sm">
          <Text className="text-2xl">🎁</Text>
          <Text className="flex-1 text-gray-500 text-sm">Apply promo code</Text>
          <Text className="text-orange-500 text-lg">›</Text>
        </TouchableOpacity>

        {/* Bill Summary */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-gray-800 font-bold text-base mb-3">Bill Summary</Text>
          {[
            { label: "Subtotal", val: `₹${subtotal}` },
            { label: "Delivery fee", val: `₹${delivery}` },
            { label: "Taxes (5%)", val: `₹${taxes}` },
          ].map((row) => (
            <View key={row.label} className="flex-row justify-between mb-2">
              <Text className="text-gray-400 text-sm">{row.label}</Text>
              <Text className="text-gray-600 text-sm">{row.val}</Text>
            </View>
          ))}
          <View className="border-t border-gray-100 mt-2 pt-3 flex-row justify-between">
            <Text className="text-gray-800 font-bold text-base">Total</Text>
            <Text className="text-orange-500 font-bold text-base">₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
        {/* Payment Method */}
        <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-lg">💳</Text>
          <Text className="text-gray-500 text-sm flex-1">Cash on Delivery</Text>
          <TouchableOpacity>
            <Text className="text-orange-500 text-sm font-semibold">Change</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 flex-row items-center justify-between px-5"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white font-bold text-base">Place Order</Text>
          <Text className="text-orange-100 font-semibold">₹{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}