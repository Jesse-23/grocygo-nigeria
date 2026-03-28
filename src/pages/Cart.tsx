import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const delivery = items.length > 0 ? 1500 : 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mt-2">Add some fresh groceries to get started!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-6 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:shadow-button transition-all"
            >
              Browse Shop <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-extrabold text-foreground mb-6">
          Your Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 bg-card rounded-xl border border-border p-4 shadow-card"
              >
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.unit}</p>
                  <p className="font-bold text-foreground mt-1">{formatNaira(item.product.price * item.quantity)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.product.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary rounded-l-full">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary rounded-r-full">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border p-6 shadow-card h-fit sticky top-20">
            <h3 className="font-bold text-foreground text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-semibold">{formatNaira(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="text-foreground font-semibold">{formatNaira(delivery)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-extrabold text-foreground text-lg">{formatNaira(totalPrice + delivery)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full mt-6 bg-primary text-primary-foreground font-semibold py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-button transition-all block text-center"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
