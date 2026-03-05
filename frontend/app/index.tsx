import { View, Text, ImageBackground, TouchableOpacity, StatusBar, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function Landing() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1601050690117-94f5f7a4d2d0?w=800" }}
      style={{ flex: 1, height }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]}
        style={{ flex: 1 }}
      >
      <SafeAreaView style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24, paddingBottom: 40 }}>
        {/* Logo / Brand */}
        <View className="mb-8">
          <Text className="text-orange-400 text-5xl font-bold tracking-wider">
            🍛 Chaat
          </Text>
          <Text className="text-white text-5xl font-bold">House</Text>
          <Text className="text-gray-300 text-base mt-3 leading-6">
            Authentic street food, delivered fresh{"\n"}to your doorstep.
          </Text>
        </View>

        {/* CTA Buttons */}
        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 items-center mb-4"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-white/50 rounded-2xl py-4 items-center"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text className="text-white font-semibold text-base">Browse as Guest</Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-xs text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}