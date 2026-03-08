import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { api } from "@/services/api";

export default function OtpScreen() {
  const router = useRouter();
  const { phone, email, name, password } = useLocalSearchParams<{
    phone: string;
    email: string;
    name: string;
    password: string;
  }>();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer === 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleResend = async () => {
    try {
      await api.post("/otp/send/email", { email });
      setTimer(30);
      setOtp(["", "", "", ""]);
      setError("");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    console.log("Verifying OTP:", { email, code }); // ← add this
  
    if (code.length < 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Verify OTP
      const verifyRes = await api.post("/otp/verify", { key: email, code });
      const verifyData = await verifyRes.json();
         console.log("Verify response:", verifyData); // ← add this
      if (!verifyRes.ok) {
        setError(verifyData.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // Step 2: Create user account
      const registerRes = await api.post("/users", {
        name,
        email,
        phone,
        password,
        Confirmpassword: password,
        role: "user",
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Step 3: Go to login
      router.replace("/(app)/login");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="bg-orange-500 h-52 rounded-b-[48px] items-center justify-center">
        <Text className="text-5xl">📱</Text>
        <Text className="text-white text-xl font-bold mt-2">Verify OTP</Text>
        <Text className="text-orange-100 text-sm mt-1">Sent to {email}</Text>
      </View>

      <View className="flex-1 px-6 pt-10">
        <Text className="text-gray-800 text-2xl font-bold mb-1">Enter the code</Text>
        <Text className="text-gray-400 text-sm mb-8">
          Check your email for the 4-digit code
        </Text>

        {/* OTP Boxes */}
        <View className="flex-row justify-between mb-2">
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => { if (r) inputs.current[idx] = r; }}
              className={`w-16 h-16 border-2 rounded-2xl text-center text-2xl font-bold text-gray-800
                ${digit ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-gray-50"}
                ${error ? "border-red-400" : ""}`}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, idx)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && !otp[idx] && idx > 0)
                  inputs.current[idx - 1]?.focus();
              }}
            />
          ))}
        </View>

        {error ? (
          <Text className="text-red-500 text-sm mb-4">{error}</Text>
        ) : (
          <View className="mb-4" />
        )}

        {/* Resend */}
        <View className="flex-row items-center mb-8">
          <Text className="text-gray-400 text-sm">Didn't receive it? </Text>
          {timer > 0 ? (
            <Text className="text-gray-400 text-sm">Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-orange-500 font-semibold text-sm">Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-6 ${
            otp.every(Boolean) && !loading ? "bg-orange-500" : "bg-orange-200"
          }`}
          disabled={!otp.every(Boolean) || loading}
          onPress={handleVerify}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center mb-4"
        >
          <Text className="text-gray-400 text-sm">← Go back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}