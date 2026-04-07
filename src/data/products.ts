export interface Product {
  id: number; // Changed to number to match PostgreSQL SERIAL
  name: string;
  price: number;
  originalPrice?: number;
  image_url: string;     // Matches Database
  stock_quantity: number; // Matches Database
  category: string;
  description: string;
  unit: string;
  rating?: number;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered";
  date: string;
  address: string;
}

// IDs updated to match EXACT case-sensitive names in your DB ('Vegetables', etc.)
export const categories: Category[] = [
  { id: "Vegetables", name: "Vegetables", icon: "🥬" },
  { id: "Fruits", name: "Fruits", icon: "🍎" },
  { id: "Drinks", name: "Drinks", icon: "🥤" },
  { id: "Snacks", name: "Snacks", icon: "🍪" },
  { id: "Grains", name: "Grains & Cereals", icon: "🌾" },
  { id: "Household", name: "Household Items", icon: "🧹" },
];

// WE REMOVED THE HARDCODED PRODUCTS LIST
// Your Shop.tsx now gets this data from http://localhost:5000/api/products

export const formatNaira = (amount: number | string): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return "₦" + numericAmount.toLocaleString("en-NG");
};

export const testimonials = [
  {
    name: "Chioma A.",
    text: "GrocyGo saves me so much time! Fresh vegetables delivered to my hostel in under an hour.",
    role: "Student, UNILAG",
  },
  {
    name: "Emeka O.",
    text: "As a busy software developer, GrocyGo delivers everything I need right to my apartment.",
    role: "Tech Worker, Lekki",
  },
  {
    name: "Mrs. Adebayo",
    text: "I order my weekly groceries for my family through GrocyGo. Quality is always excellent.",
    role: "Mother of 3, Ikeja",
  },
];