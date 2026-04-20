import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CreditCard, CheckCircle, Loader2 } from "lucide-react"; // Added Loader2
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const delivery = 1500;
  const [step, setStep] = useState<"address" | "confirm">("address");
  const [loading, setLoading] = useState(false); // Added loading state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "address") {
      setStep("confirm");
      return;
    }

    // REAL BACKEND INTEGRATION STARTS HERE
    setLoading(true);
    try {
      const token = localStorage.getItem("grocygo_token");
      const fullAddress = `${form.address}, ${form.city}. Note: ${form.note || "none"}`;

      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          totalAmount: totalPrice + delivery,
          deliveryAddress: fullAddress,
          cartItems: items, // Passing the full items array to the backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/order-success");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    navigate("/shop");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-extrabold text-foreground mb-8"
        >
          Checkout
        </motion.h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { label: "Delivery Info", icon: <MapPin className="h-4 w-4" /> },
            { label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  (i === 0 && step === "address") ||
                  (i === 1 && step === "confirm")
                    ? "bg-primary text-primary-foreground"
                    : i === 0 && step === "confirm"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {i === 0 && step === "confirm" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {s.label}
              </span>
              {i === 0 && <div className="w-8 h-0.5 bg-border" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === "address" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  required
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <input
                required
                placeholder="Delivery Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                required
                placeholder="City (e.g. Lagos, Abuja)"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                placeholder="Delivery note (optional)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
              />
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 shadow-card"
            >
              <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm py-2 border-b border-border last:border-0"
                >
                  <span className="text-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatNaira(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 text-muted-foreground">
                <span>Delivery</span>
                <span>{formatNaira(delivery)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span>{formatNaira(totalPrice + delivery)}</span>
              </div>
              <div className="mt-4 p-3 bg-secondary rounded-lg text-sm text-foreground">
                <p>
                  <strong>Deliver to:</strong> {form.name}
                </p>
                <p>
                  {form.address}, {form.city}
                </p>
                <p>{form.phone}</p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 mt-6">
            {step === "confirm" && (
              <button
                type="button"
                disabled={loading}
                onClick={() => setStep("address")}
                className="px-6 py-3 border border-border rounded-full text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Back
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:shadow-button transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : step === "address" ? (
                "Continue to Payment"
              ) : (
                "Confirm Order"
              )}
            </motion.button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
