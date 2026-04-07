import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { formatNaira } from "@/data/products"; // Removed sampleOrders from import
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Local sample data to prevent crashes until your Orders API is ready
const sampleOrders = [
  {
    id: "ORD-001",
    date: "2026-03-25",
    status: "delivered",
    address: "12 Allen Avenue, Ikeja, Lagos",
    total: 11500,
    items: [
      { product: { id: 1, name: "Fresh Tomatoes", price: 1500 }, quantity: 2 },
      { product: { id: 12, name: "Local Rice (5kg)", price: 8500 }, quantity: 1 }
    ]
  }
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-accent/20 text-accent", icon: <Clock className="h-4 w-4" /> },
  confirmed: { label: "Confirmed", color: "bg-primary/20 text-primary", icon: <CheckCircle className="h-4 w-4" /> },
  preparing: { label: "Preparing", color: "bg-accent/20 text-accent", icon: <Package className="h-4 w-4" /> },
  delivering: { label: "On the way", color: "bg-primary/20 text-primary", icon: <Truck className="h-4 w-4" /> },
  delivered: { label: "Delivered", color: "bg-primary/10 text-primary", icon: <CheckCircle className="h-4 w-4" /> },
};

const Dashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-extrabold text-foreground mb-2">
        My Orders
      </motion.h1>
      <p className="text-muted-foreground mb-8">Track and manage your grocery orders</p>

      <div className="space-y-4">
        {sampleOrders.map((order, i) => {
          const status = statusConfig[order.status] || statusConfig.pending;
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
                  <span className="font-bold text-foreground">{order.id}</span>
                  <span className="text-sm text-muted-foreground ml-3">{order.date}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${status.color}`}>
                  {status.icon} {status.label}
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.product.name} × {item.quantity}</span>
                    <span className="text-muted-foreground">{formatNaira(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">{order.address}</span>
                <span className="font-bold text-foreground">{formatNaira(order.total)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
    <Footer />
  </div>
);

export default Dashboard;