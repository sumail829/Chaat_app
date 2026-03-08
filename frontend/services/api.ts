import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: async (path: string) =>
    fetch(`${API_URL}${path}`, {
      headers: await getHeaders(),
    }),
  post: async (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(body),
    }),
};