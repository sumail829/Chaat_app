import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useCartStore } from "../../store/cartStore";

type IconProps = {
  focused: boolean;
  badge?: number;
  children: React.ReactNode;
  label: string;
};

function TabIcon({ focused, badge, children, label }: IconProps) {
  return (
    <View className="items-center justify-center pt-1">
      <View>
        {children}
        {badge ? (
          <View className="absolute -top-1 -right-2 bg-orange-500 rounded-full w-4 h-4 items-center justify-center">
            <Text
              className="text-white font-bold"
              style={{ fontSize: 9 }}
            >
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        className={`mt-0.5 font-semibold ${focused ? "text-orange-500" : "text-gray-400"}`}
        style={{ fontSize: 10 }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 4,
          backgroundColor: "#fff",
          borderTopColor: "#f3f4f6",
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home">
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? "#f97316" : "#9ca3af"}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Menu" badge={cartCount}>
              <MaterialCommunityIcons
                name={focused ? "silverware-fork-knife" : "silverware-fork-knife"}
                size={24}
                color={focused ? "#f97316" : "#9ca3af"}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Orders">
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                size={24}
                color={focused ? "#f97316" : "#9ca3af"}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile">
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#f97316" : "#9ca3af"}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Cart">
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={24}
                color={focused ? "#f97316" : "#9ca3af"}
              />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}