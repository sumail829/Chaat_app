import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const isValid = form.email.includes("@") && form.password.length >= 6;

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
          <Text className="text-gray-400 text-sm mb-8">Sign in to your account</Text>

          {/* Email */}
          <Text className="text-gray-600 font-semibold mb-2">Email Address</Text>
          <View
            className={`flex-row items-center border rounded-xl px-4 py-3 mb-4 ${
              focused === "email"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Text className="text-gray-400 mr-2">✉️</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="john@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
            />
          </View>

          {/* Password */}
          <Text className="text-gray-600 font-semibold mb-2">Password</Text>
          <View
            className={`flex-row items-center border rounded-xl px-4 py-3 mb-2 ${
              focused === "password"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Text className="text-gray-400 mr-2">🔒</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text className="text-gray-400 text-sm">{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="items-end mb-6">
            <Text className="text-orange-500 text-sm font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          <View className="flex-1" />

          {/* Sign In */}
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center mb-4 ${
              isValid ? "bg-orange-500" : "bg-orange-200"
            }`}
            disabled={!isValid}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text className="text-white font-bold text-lg">Sign In</Text>
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity
            className="items-center mb-8"
            onPress={() => router.push("/(app)/register")}
          >
            <Text className="text-gray-400 text-sm">
              New here?{" "}
              <Text className="text-orange-500 font-semibold">Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}