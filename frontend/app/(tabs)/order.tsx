// ─── app/(tabs)/orders.tsx ───────────────────────────────────────
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../../store/cartStore";
import { useEffect, useState } from "react";

type OrderStatus = "placed" | "preparing" | "ready" | "served";

type Order = {
  id: string;
  items: { name: string; quantity: number; price: number; image: string }[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  tableNo: string;
};

const STATUS_STEPS: { key: OrderStatus; label: string; emoji: string; desc: string }[] = [
  { key: "placed",    label: "Order Placed",  emoji: "📋", desc: "We got your order!" },
  { key: "preparing", label: "Preparing",     emoji: "👨‍🍳", desc: "Chef is cooking..." },
  { key: "ready",     label: "Ready",         emoji: "✅", desc: "Your food is ready!" },
  { key: "served",    label: "Served",        emoji: "🍽️", desc: "Enjoy your meal!" },
];

const STATUS_ORDER: OrderStatus[] = ["placed", "preparing", "ready", "served"];

// Mock past orders
const PAST_ORDERS: Order[] = [
  {
    id: "ORD-1041",
    items: [
      { name: "Pani Puri", quantity: 2, price: 60, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200" },
      { name: "Masala Chai", quantity: 1, price: 25, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200" },
    ],
    total: 145,
    status: "served",
    placedAt: "2:30 PM",
    tableNo: "T-4",
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  // Simulate active order from cart (in real app this comes from backend)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);

  // Simulate status progression every 8 seconds (demo only)
  useEffect(() => {
    if (!activeOrder) return;
    if (statusIndex >= STATUS_ORDER.length - 1) return;
    const t = setTimeout(() => {
      setStatusIndex(i => i + 1);
      setActiveOrder(o => o ? { ...o, status: STATUS_ORDER[statusIndex + 1] } : null);
    }, 8000);
    return () => clearTimeout(t);
  }, [activeOrder, statusIndex]);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const order: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
      total: totalPrice(),
      status: "placed",
      placedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tableNo: "T-3",
    };
    setActiveOrder(order);
    setStatusIndex(0);
    clearCart();
  };

  const currentStep = activeOrder ? STATUS_ORDER.indexOf(activeOrder.status) : -1;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-4 shadow-sm">
        <Text className="text-gray-800 font-bold text-2xl">My Orders 📦</Text>
      </View>

      {/* ── Active Order Tracker ───────────────────────────── */}
      {activeOrder ? (
        <View className="mx-5 mt-5 bg-white rounded-3xl shadow-sm overflow-hidden">
          {/* Order header */}
          <View className="bg-orange-500 px-5 py-4 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-bold text-lg">{activeOrder.id}</Text>
              <Text className="text-orange-100 text-sm">Table {activeOrder.tableNo} · {activeOrder.placedAt}</Text>
            </View>
            <Text className="text-white font-bold text-xl">₹{activeOrder.total}</Text>
          </View>

          {/* Status stepper */}
          <View className="px-5 py-6">
            {STATUS_STEPS.map((step, idx) => {
              const done = idx < currentStep;
              const active = idx === currentStep;
              const upcoming = idx > currentStep;
              return (
                <View key={step.key} className="flex-row items-start">
                  {/* Icon + line */}
                  <View className="items-center mr-4" style={{ width: 36 }}>
                    <View className={`w-9 h-9 rounded-full items-center justify-center
                      ${done ? "bg-green-500" : active ? "bg-orange-500" : "bg-gray-100"}`}>
                      <Text className="text-base">{done ? "✓" : step.emoji}</Text>
                    </View>
                    {idx < STATUS_STEPS.length - 1 && (
                      <View className={`w-0.5 h-8 mt-1 ${done ? "bg-green-400" : "bg-gray-200"}`} />
                    )}
                  </View>
                  {/* Label */}
                  <View className="flex-1 pt-1.5 pb-6">
                    <Text className={`font-bold text-sm ${active ? "text-orange-500" : done ? "text-green-600" : "text-gray-300"}`}>
                      {step.label}
                    </Text>
                    {active && (
                      <Text className="text-gray-400 text-xs mt-0.5">{step.desc}</Text>
                    )}
                  </View>
                  {active && (
                    <View className="bg-orange-100 rounded-full px-3 py-1 mt-1">
                      <Text className="text-orange-600 text-xs font-semibold">Current</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Ordered items */}
          <View className="border-t border-gray-100 px-5 py-4">
            <Text className="text-gray-700 font-bold mb-3">Items Ordered</Text>
            {activeOrder.items.map((item, idx) => (
              <View key={idx} className="flex-row items-center gap-3 mb-2">
                <Image source={{ uri: item.image }} className="w-10 h-10 rounded-xl" />
                <Text className="flex-1 text-gray-600 text-sm">{item.name}</Text>
                <Text className="text-gray-400 text-sm">×{item.quantity}</Text>
                <Text className="text-orange-500 font-semibold text-sm">₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>

          {activeOrder.status === "served" && (
            <TouchableOpacity
              className="mx-5 mb-5 bg-green-500 rounded-2xl py-3 items-center"
              onPress={() => setActiveOrder(null)}
            >
              <Text className="text-white font-bold">Mark Complete ✓</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* Empty active state */
        items.length > 0 ? (
          <View className="mx-5 mt-5 bg-orange-50 border border-orange-200 rounded-3xl p-6 items-center">
            <Text className="text-4xl mb-2">🛒</Text>
            <Text className="text-gray-800 font-bold text-base mb-1">You have items in your cart</Text>
            <Text className="text-gray-400 text-sm text-center mb-4">Place your order to start tracking</Text>
            <TouchableOpacity className="bg-orange-500 rounded-2xl px-6 py-3" onPress={handlePlaceOrder}>
              <Text className="text-white font-bold">Place Order · ₹{totalPrice()}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mx-5 mt-5 bg-white rounded-3xl p-8 items-center shadow-sm">
            <Text className="text-5xl mb-3">🍽️</Text>
            <Text className="text-gray-800 font-bold text-base mb-1">No active orders</Text>
            <Text className="text-gray-400 text-sm text-center">Add items from the menu to get started</Text>
          </View>
        )
      )}

      {/* ── Past Orders ───────────────────────────────────── */}
      <View className="mx-5 mt-6">
        <Text className="text-gray-800 font-bold text-lg mb-3">Past Orders</Text>
        {PAST_ORDERS.map(order => (
          <View key={order.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-800 font-bold">{order.id}</Text>
              <View className="bg-green-100 rounded-full px-3 py-1">
                <Text className="text-green-600 text-xs font-semibold">✓ Served</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 mb-3">
              {order.items.map((item, i) => (
                <Image key={i} source={{ uri: item.image }} className="w-10 h-10 rounded-xl" />
              ))}
              <Text className="text-gray-400 text-xs ml-1">
                {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
              <Text className="text-gray-400 text-xs">Table {order.tableNo} · {order.placedAt}</Text>
              <Text className="text-orange-500 font-bold">₹{order.total}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}