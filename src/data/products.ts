export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  unit: string;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
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

export const categories: Category[] = [
  { id: "vegetables", name: "Vegetables", icon: "🥬", count: 24 },
  { id: "fruits", name: "Fruits", icon: "🍎", count: 18 },
  { id: "drinks", name: "Drinks", icon: "🥤", count: 15 },
  { id: "snacks", name: "Snacks", icon: "🍪", count: 20 },
  { id: "grains", name: "Grains & Cereals", icon: "🌾", count: 12 },
  { id: "household", name: "Household Items", icon: "🧹", count: 16 },
];

export const products: Product[] = [
  {
    id: "1", name: "Fresh Tomatoes", price: 1500, originalPrice: 2000,
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=400&fit=crop",
    category: "vegetables", description: "Fresh, ripe tomatoes perfect for stew and jollof rice. Locally sourced from farms in Jos, Plateau State.", inStock: true, rating: 4.8, unit: "per basket", popular: true,
  },
  {
    id: "2", name: "Red Bell Pepper (Tatashe)", price: 2500,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop",
    category: "vegetables", description: "Vibrant red bell peppers, great for pepper soup and stews.", inStock: true, rating: 4.6, unit: "per kg",
  },
  {
    id: "3", name: "Fresh Spinach (Efo Tete)", price: 500,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    category: "vegetables", description: "Freshly harvested Nigerian spinach for your efo riro.", inStock: true, rating: 4.7, unit: "per bunch", popular: true,
  },
  {
    id: "4", name: "Sweet Banana", price: 800, originalPrice: 1000,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    category: "fruits", description: "Sweet, ripe bananas rich in potassium and energy.", inStock: true, rating: 4.5, unit: "per bunch",
  },
  {
    id: "5", name: "Watermelon", price: 3000,
    image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=400&fit=crop",
    category: "fruits", description: "Large, juicy watermelon perfect for hot Lagos afternoons.", inStock: true, rating: 4.9, unit: "per piece", popular: true,
  },
  {
    id: "6", name: "Pineapple", price: 1200,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop",
    category: "fruits", description: "Fresh, sweet pineapple sourced from Benin farms.", inStock: true, rating: 4.4, unit: "per piece",
  },
  {
    id: "7", name: "Coca-Cola (50cl x 12)", price: 3600,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop",
    category: "drinks", description: "Pack of 12 Coca-Cola 50cl bottles.", inStock: true, rating: 4.8, unit: "per pack",
  },
  {
    id: "8", name: "Hollandia Yoghurt (1L)", price: 1800,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    category: "drinks", description: "Creamy Hollandia yoghurt, 1 litre.", inStock: true, rating: 4.3, unit: "per bottle", popular: true,
  },
  {
    id: "9", name: "Chin Chin (500g)", price: 1500,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    category: "snacks", description: "Crunchy, sweet chin chin snack made with love.", inStock: true, rating: 4.6, unit: "per pack",
  },
  {
    id: "10", name: "Plantain Chips", price: 800, originalPrice: 1000,
    image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&h=400&fit=crop",
    category: "snacks", description: "Crispy plantain chips, lightly salted.", inStock: true, rating: 4.5, unit: "per pack", popular: true,
  },
  {
    id: "11", name: "Golden Penny Spaghetti", price: 950,
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop",
    category: "grains", description: "500g pack of quality spaghetti.", inStock: true, rating: 4.7, unit: "per pack",
  },
  {
    id: "12", name: "Local Rice (5kg)", price: 8500, originalPrice: 9500,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    category: "grains", description: "Premium Nigerian long grain rice from Ebonyi State.", inStock: true, rating: 4.8, unit: "per bag", popular: true,
  },
  {
    id: "13", name: "Morning Fresh Dish Soap", price: 1200,
    image: "https://images.unsplash.com/photo-1585441695325-21557f83020f?w=400&h=400&fit=crop",
    category: "household", description: "Effective dish washing liquid, 450ml.", inStock: true, rating: 4.4, unit: "per bottle",
  },
  {
    id: "14", name: "Tissue Paper (12 Rolls)", price: 3500,
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&h=400&fit=crop",
    category: "household", description: "Soft, strong tissue paper pack of 12 rolls.", inStock: false, rating: 4.2, unit: "per pack",
  },
  {
    id: "15", name: "Fresh Onions", price: 2000,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
    category: "vegetables", description: "Large fresh onions, essential for every Nigerian kitchen.", inStock: true, rating: 4.6, unit: "per basket",
  },
  {
    id: "16", name: "Mango (Agbalumo Season)", price: 600,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop",
    category: "fruits", description: "Sweet, juicy mangoes in season.", inStock: true, rating: 4.9, unit: "per 5 pieces", popular: true,
  },
];

export const formatNaira = (amount: number): string => {
  return "₦" + amount.toLocaleString("en-NG");
};

export const testimonials = [
  {
    name: "Chioma A.",
    text: "GrocyGo saves me so much time! Fresh vegetables delivered to my hostel in under an hour. I don't have to stress about going to the market anymore.",
    role: "Student, UNILAG",
  },
  {
    name: "Emeka O.",
    text: "As a busy software developer, I barely have time to shop. GrocyGo delivers everything I need right to my apartment. The prices are fair too!",
    role: "Tech Worker, Lekki",
  },
  {
    name: "Mrs. Adebayo",
    text: "I order my weekly groceries for my family of 5 through GrocyGo. The quality is always excellent and delivery is always on time.",
    role: "Mother of 3, Ikeja",
  },
];

export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    items: [
      { product: products[0], quantity: 2 },
      { product: products[11], quantity: 1 },
    ],
    total: 11500,
    status: "delivered",
    date: "2026-03-25",
    address: "12 Allen Avenue, Ikeja, Lagos",
  },
  {
    id: "ORD-002",
    items: [
      { product: products[4], quantity: 1 },
      { product: products[7], quantity: 2 },
    ],
    total: 6600,
    status: "delivering",
    date: "2026-03-27",
    address: "Block C, Jabi Lake Mall, Abuja",
  },
];
