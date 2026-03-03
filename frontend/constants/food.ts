export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  popular?: boolean;
};

export const CATEGORIES = ["All", "Chaat", "Snacks", "Drinks", "Sweets"];

export const FOODS: FoodItem[] = [
  {
    id: "1",
    name: "Pani Puri",
    description: "Crispy puris filled with spiced tamarind water & chickpeas",
    price: 60,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400",
    category: "Chaat",
    rating: 4.8,
    popular: true,
  },
  {
    id: "2",
    name: "Bhel Puri",
    description: "Puffed rice tossed with veggies, chutneys & sev",
    price: 80,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    category: "Chaat",
    rating: 4.6,
    popular: true,
  },
  {
    id: "3",
    name: "Samosa",
    description: "Golden fried pastry stuffed with spiced potatoes & peas",
    price: 30,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f7a4d2d0?w=400",
    category: "Snacks",
    rating: 4.7,
    popular: true,
  },
  {
    id: "4",
    name: "Dahi Puri",
    description: "Puris topped with yogurt, chutneys & pomegranate seeds",
    price: 90,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400",
    category: "Chaat",
    rating: 4.9,
  },
  {
    id: "5",
    name: "Vada Pav",
    description: "Mumbai's favourite street burger — spiced potato fritter in a bun",
    price: 40,
    image: "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=400",
    category: "Snacks",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Masala Chai",
    description: "Freshly brewed tea with ginger, cardamom & spices",
    price: 25,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400",
    category: "Drinks",
    rating: 4.7,
    popular: true,
  },
  {
    id: "7",
    name: "Jalebi",
    description: "Crispy spiral sweets soaked in sugar syrup",
    price: 50,
    image: "https://images.unsplash.com/photo-1613685703305-b8ca85a3ce5d?w=400",
    category: "Sweets",
    rating: 4.6,
  },
  {
    id: "8",
    name: "Aloo Tikki",
    description: "Pan-fried spiced potato patties served with chutney",
    price: 70,
    image: "https://images.unsplash.com/photo-1626776877523-7f8e44f8b26b?w=400",
    category: "Snacks",
    rating: 4.4,
  },
];