const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("⚠️ EXPO_PUBLIC_API_URL is not set in .env");
}

export const api = {
  get: (path: string) => fetch(`${API_URL}${path}`),
  post: (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};