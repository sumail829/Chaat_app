import { create } from "zustand";

// New type — works with API data
export type CartItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;      // ← optional, mapped from imageUrl
  category?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  sessionToken: string | null;
  tableNumber: string | null;
  setSession: (sessionToken: string, tableNumber: string) => void;
  addItem: (food: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  sessionToken: null,
  tableNumber: null,

  // Save session info when QR is scanned
  setSession: (sessionToken, tableNumber) => {
    set({ sessionToken, tableNumber });
  },

  addItem: (food) => {
    const existing = get().items.find((i) => i.id === food.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...get().items, { ...food, quantity: 1 }] });
    }
  },

  removeItem: (id) => {
    const existing = get().items.find((i) => i.id === id);
    if (!existing) return;
    if (existing.quantity === 1) {
      set({ items: get().items.filter((i) => i.id !== id) });
    } else {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      });
    }
  },

  deleteItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
  totalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}));