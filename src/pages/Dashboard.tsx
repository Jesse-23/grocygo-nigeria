import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, ShoppingBag, X } from "lucide-react"; //
import { formatNaira } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Status Configuration mapping
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Pending: { label: "Pending", color: "bg-accent/20 text-accent", icon: <Clock className="h-4 w-4" /> },
  Confirmed: { label: "Confirmed", color: "bg-primary/20 text-primary", icon: <CheckCircle className="h-4 w-4" /> },
  Preparing: { label: "Preparing", color: "bg-accent/20 text-accent", icon: <Package className="h-4 w-4" /> },
  Shipped: { label: "On the way", color: "bg-primary/20 text-primary", icon: <Truck className="h-4 w-4" /> },
  Delivered: { label: "Delivered", color: "bg-primary/10 text-primary", icon: <CheckCircle className="h-4 w-4" /> },
  Cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive", icon: <X className="h-4 w-4" /> },
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("grocygo_token");
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching personal orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-foreground mb-1">
            Welcome, {user?.name?.split(' ')[0] || 'Jesse'}!
          </h1>
          <p className="text-muted-foreground mb-8">Track and manage your grocery orders</p>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 opacity-50 animate-pulse">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You haven't placed any orders yet.</p>
              <button 
                onClick={() => navigate('/shop')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Go to Shop
              </button>
            </div>
          ) : (
            orders.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="font-bold text-foreground">Order #{order.id}</span>
                      <span className="text-sm text-muted-foreground ml-3">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Delivery Address</span>
                        <span className="text-sm text-foreground">{order.delivery_address}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Total Amount</span>
                        <span className="font-bold text-foreground text-lg">{formatNaira(order.total_amount)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;