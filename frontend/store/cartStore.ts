import { create } from "zustand";
import { FoodItem } from "../constants/food";

export type CartItem = FoodItem & { quantity: number };

type CartStore = {
  items: CartItem[];
  addItem: (food: FoodItem) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (food) => {
    const existing = get().items.find((i) => i.id === food.id);
    if (existing) {
      set({ items: get().items.map((i) => i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i) });
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
      set({ items: get().items.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) });
    }
  },

  deleteItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),

  totalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}));