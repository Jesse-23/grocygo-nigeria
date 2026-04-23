import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Truck,
  Plus,
  Pencil,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { formatNaira, Product } from "@/data/products";
import { fetchProducts } from "@/api/client";
import Navbar from "@/components/Navbar";

const API_BASE_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    totalProducts: 0,
  });

  // Load both Products and Stats on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const token = localStorage.getItem("grocygo_token");

      try {
        // Fetch Products using your existing helper
        const productData = await fetchProducts();
        setProducts(productData);

        // Fetch Dynamic Stats from the new backend route
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Revenue",
      value: formatNaira(stats.totalRevenue),
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Active Deliveries",
      value: stats.activeDeliveries.toString(),
      icon: <Truck className="h-5 w-5" />,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Products",
      value: stats.totalProducts.toString(),
      icon: <Package className="h-5 w-5" />,
      color: "bg-secondary text-secondary-foreground",
    },
  ];

  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-extrabold text-foreground mb-8"
        >
          Admin Dashboard
        </motion.h1>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 shadow-card"
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color} mb-3`}
              >
                {s.icon}
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {loading ? "..." : s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Product Management Section */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold text-foreground text-lg">Products</h2>
            <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 hover:shadow-button transition-all">
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center animate-pulse">
                Loading dashboard data...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden sm:table-cell">
                      Stock
                    </th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const hasStock = p.stock_quantity > 0;
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                p.image_url.startsWith("http")
                                  ? p.image_url
                                  : `http://localhost:5173${p.image_url}`
                              }
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="font-medium text-foreground">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground capitalize hidden md:table-cell">
                          {p.category}
                        </td>
                        <td className="px-5 py-3 font-semibold text-foreground">
                          {formatNaira(p.price)}
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${hasStock ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}
                          >
                            {hasStock
                              ? `${p.stock_quantity} in stock`
                              : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
