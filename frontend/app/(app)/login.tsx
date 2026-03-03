import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Header art */}
        <View className="bg-orange-500 h-56 rounded-b-[48px] items-center justify-center">
          <Text className="text-6xl">🍛</Text>
          <Text className="text-white text-2xl font-bold mt-2">Chaat House</Text>
          <Text className="text-orange-100 text-sm mt-1">Sign in to continue</Text>
        </View>

        <View className="flex-1 px-6 pt-10">
          <Text className="text-gray-800 text-2xl font-bold mb-1">Welcome back! 👋</Text>
          <Text className="text-gray-400 text-sm mb-8">Enter your mobile number to get started</Text>

          {/* Phone Input */}
          <Text className="text-gray-600 font-semibold mb-2">Mobile Number</Text>
          <View className={`flex-row items-center border rounded-xl px-4 py-3 mb-4 ${focused === "phone" ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
            <Text className="text-gray-500 mr-2 text-base">🇮🇳 +91</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="9876543210"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused("")}
            />
          </View>

          {/* OR divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-gray-400 mx-4 text-xs">OR CONTINUE WITH</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Logins */}
          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1 border border-gray-200 rounded-xl py-3 items-center flex-row justify-center gap-2">
              <Text className="text-lg">G</Text>
              <Text className="text-gray-700 font-semibold">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 border border-gray-200 rounded-xl py-3 items-center flex-row justify-center gap-2">
              <Text className="text-lg">𝕗</Text>
              <Text className="text-gray-700 font-semibold">Facebook</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1" />

          {/* Submit */}
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center mb-6 ${phone.length === 10 ? "bg-orange-500" : "bg-orange-200"}`}
            disabled={phone.length !== 10}
            onPress={() => router.push({ pathname: "/otp", params: { phone } })}
          >
            <Text className="text-white font-bold text-lg">Send OTP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}