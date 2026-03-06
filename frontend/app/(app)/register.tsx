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
import { api } from "@/services/api";

export default function Register() {
  const router = useRouter();
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

 const isValid =
  form.name.trim().length >= 2 &&
  form.phone.length === 10 &&
  form.email.includes("@") &&
  form.password.length >= 6 &&
  form.password === form.confirmPassword;  
  const handleSubmit = async () => {
    setError("");
    const { name, email, phone, password, confirmPassword } = form;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
     const response = await api.post("/users", {
  name,
  email,
  phone,
  password,
  Confirmpassword: confirmPassword,
  role: "user",
});

const data = await response.json();
console.log("response data:", data);  // ← this will show exact validation error

if (!response.ok) {
  setError(data.message || "Registration failed");
  return;
}

router.push({ pathname: "/(app)/otp", params: { phone } });
    } catch (err: any) {
  console.log("ERROR DETAILS:", err?.message, err);
  setError(err?.message || "An unexpected error occurred.");
}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header art */}
        <View className="bg-orange-500 h-56 rounded-b-[48px] items-center justify-center">
          <Text className="text-6xl">🍛</Text>
          <Text className="text-white text-2xl font-bold mt-2">Chaat House</Text>
          <Text className="text-orange-100 text-sm mt-1">Create your account</Text>
        </View>

        <View className="flex-1 px-6 pt-10">
          <Text className="text-gray-800 text-2xl font-bold mb-1">
            Let's get started! 🎉
          </Text>
          <Text className="text-gray-400 text-sm mb-8">
            Fill in your details to create an account
          </Text>

          {/* Error */}
          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-500 text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <Text className="text-gray-600 font-semibold mb-2">Full Name</Text>
          <View
            className={`flex-row items-center border rounded-xl px-4 py-3 mb-4 ${
              focused === "name"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Text className="text-gray-400 mr-2">👤</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="John Doe"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
            />
          </View>

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

          {/* Phone */}
          <Text className="text-gray-600 font-semibold mb-2">Mobile Number</Text>
          <View
            className={`flex-row items-center border rounded-xl px-4 py-3 mb-4 ${
              focused === "phone"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Text className="text-gray-500 mr-2 text-base">  +977</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="9876543210"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              maxLength={10}
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused("")}
            />
          </View>

          {/* Password */}
          <Text className="text-gray-600 font-semibold mb-2">Password</Text>
          <View
            className={`flex-row items-center border rounded-xl px-4 py-3 mb-4 ${
              focused === "password"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Text className="text-gray-400 mr-2">🔒</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="Min. 6 characters"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text className="text-gray-400 text-sm">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text className="text-gray-600 font-semibold mb-2">Confirm Password</Text>
          <View
            className={`flex-row items-center border rounded-xl px-4 py-3 mb-1 ${
              focused === "confirmPassword"
                ? "border-orange-500 bg-orange-50"
                : form.confirmPassword && form.password !== form.confirmPassword
                ? "border-red-400 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Text className="text-gray-400 mr-2">🔒</Text>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="Re-enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showConfirm}
              value={form.confirmPassword}
              onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
              onFocus={() => setFocused("confirmPassword")}
              onBlur={() => setFocused("")}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Text className="text-gray-400 text-sm">
                {showConfirm ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Password mismatch hint */}
          {form.confirmPassword && form.password !== form.confirmPassword ? (
            <Text className="text-red-400 text-xs mb-2">Passwords don't match</Text>
          ) : <View className="mb-4" />}

          <View className="flex-1" />

          {/* Submit */}
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center mt-6 mb-4 ${
              isValid ? "bg-orange-500" : "bg-orange-200"
            }`}
            disabled={!isValid}
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold text-lg">Create Account</Text>
          </TouchableOpacity>

          {/* Login link */}
          <TouchableOpacity
            className="items-center mb-8"
            onPress={() => router.push("/(app)/login")}
          >
            <Text className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Text className="text-orange-500 font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}