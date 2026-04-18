import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CartItem, Product } from "@/data/products";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // We need this to know if we should sync to DB

  // 1. Fetch cart from DB on login or refresh
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("grocygo_token");
    if (!token || !user) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Map backend format to frontend CartItem format
        const formattedItems = data.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.name,
            price: parseFloat(item.price),
            image_url: item.image_url,
          },
          quantity: item.quantity,
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 2. Add Item (Syncs to DB)
  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      const token = localStorage.getItem("grocygo_token");

      // Update Local State immediately (Optimistic UI)
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { product, quantity }];
      });

      // If logged in, sync to Backend
      if (token && user) {
        try {
          await fetch(`${API_BASE_URL}/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: product.id, quantity }),
          });
        } catch (error) {
          console.error("Failed to sync add to cart:", error);
        }
      }
      toast.success(`${product.name} added to cart`);
    },
    [user],
  );

  // 3. Remove Item (Syncs to DB)
  const removeItem = useCallback(
    async (productId: number) => {
      const token = localStorage.getItem("grocygo_token");

      setItems((prev) => prev.filter((i) => i.product.id !== productId));

      if (token && user) {
        try {
          await fetch(`${API_BASE_URL}/cart/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Failed to sync remove from cart:", error);
        }
      }
      toast.info("Item removed from cart");
    },
    [user],
  );

  // 4. Update Quantity (Syncs to DB)
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      const token = localStorage.getItem("grocygo_token");

      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
      );

      if (token && user) {
        try {
          // We reuse the /add route because it handles "UPSERT" (updates existing)
          await fetch(`${API_BASE_URL}/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // Send specific quantity target (Backend will need adjustment if you want strict override)
            body: JSON.stringify({ productId, quantity: 1 }),
          });
        } catch (error) {
          console.error("Failed to sync quantity:", error);
        }
      }
    },
    [user, removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    // Optionally add a DELETE ALL route in backend later
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
