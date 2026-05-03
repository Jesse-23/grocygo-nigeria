import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  DollarSign,
  Truck,
  Plus,
  Pencil,
  Trash2,
  ShoppingBag,
  X,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { formatNaira, Product } from "@/data/products";
import { fetchProducts } from "@/api/client";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

// --- CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = "dnb9hxtvl";
const CLOUDINARY_UPLOAD_PRESET = "grocygo_preset";
const API_BASE_URL = "http://localhost:5000/api";

// Define a type for our Orders
interface Order {
  id: number;
  full_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // New state for orders
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    totalProducts: 0,
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    stock_quantity: "",
    description: "",
    image_url: "",
  });

  // --- CLOUDINARY WIDGET ---
  const handleOpenUploadWidget = () => {
    // @ts-ignore
    if (!window.cloudinary) {
      toast.error("Cloudinary script not loaded. Check index.html");
      return;
    }
    // @ts-ignore
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
        theme: "minimal",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setNewProduct({ ...newProduct, image_url: result.info.secure_url });
          toast.success("Image uploaded!");
        }
      },
    );
    myWidget.open();
  };

  // --- DATA LOADING ---
  const loadDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("grocygo_token");

    try {
      // Fetch Products
      const productData = await fetchProducts();
      setProducts(productData);

      // Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch Recent Orders
      const ordersRes = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // --- STATUS TOGGLE LOGIC ---
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("grocygo_token");
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (res.ok) {
        // Update local state immediately
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );

        // Refresh the stat cards (e.g. Active Deliveries count)
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        toast.success(`Order #${orderId} marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // DELETE Logic
  const deleteProduct = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("grocygo_token");
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setStats((prev) => ({
          ...prev,
          totalProducts: prev.totalProducts - 1,
        }));
        toast.success("Product deleted");
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  // ADD PRODUCT Logic
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image_url) {
      toast.error("Upload an image first!");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("grocygo_token");
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock_quantity: parseInt(newProduct.stock_quantity),
        }),
      });

      if (res.ok) {
        const addedItem = await res.json();
        setProducts((prev) => [addedItem, ...prev]);
        setStats((prev) => ({
          ...prev,
          totalProducts: prev.totalProducts + 1,
        }));
        setIsModalOpen(false);
        setNewProduct({
          name: "",
          category: "Vegetables",
          price: "",
          stock_quantity: "",
          description: "",
          image_url: "",
        });
        toast.success("Product added!");
      }
    } catch (error) {
      toast.error("Add failed");
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Stats Grid */}
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

        {/* Recent Orders Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden mb-8">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold text-foreground text-lg">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-5 py-3 text-muted-foreground">
                    Order ID
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-muted-foreground"
                    >
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium">#{order.id}</td>
                      <td className="px-5 py-3">{order.full_name}</td>
                      <td className="px-5 py-3 font-semibold">
                        {formatNaira(order.total_amount)}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="bg-secondary p-1 rounded border border-border text-xs outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold text-foreground text-lg">Products</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 hover:shadow-button transition-all"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center animate-pulse">
                Loading dashboard...
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
                  {products.map((p) => (
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
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock_quantity > 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}
                        >
                          {p.stock_quantity > 0
                            ? `${p.stock_quantity} in stock`
                            : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal remains exactly as you had it */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border p-6 rounded-2xl w-full max-w-lg shadow-2xl relative my-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold mb-6 text-foreground">
                Add New Product
              </h2>
              <form
                onSubmit={handleAddProduct}
                className="grid md:grid-cols-[1fr,2fr] gap-6"
              >
                <div className="space-y-2 text-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Image
                  </label>
                  <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden bg-secondary/30 group">
                    {newProduct.image_url ? (
                      <>
                        <img
                          src={newProduct.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleOpenUploadWidget}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="text-white h-6 w-6" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenUploadWidget}
                        className="flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ImagePlus className="h-10 w-10" />
                        <span className="text-[10px] font-bold">Upload</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                      Product Name
                    </label>
                    <input
                      required
                      placeholder="e.g. Fresh Yam"
                      className="w-full bg-secondary/50 border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all mt-1"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                        Category
                      </label>
                      <select
                        className="w-full bg-secondary/50 border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all mt-1"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Household">Household</option>
                        <option value="Tubers">Tubers</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                        Price (₦)
                      </label>
                      <input
                        required
                        type="number"
                        placeholder="0"
                        className="w-full bg-secondary/50 border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all mt-1"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                      Stock Quantity
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 50"
                      className="w-full bg-secondary/50 border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all mt-1"
                      value={newProduct.stock_quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock_quantity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief details..."
                      className="w-full bg-secondary/50 border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all mt-1 resize-none"
                      rows={2}
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={submitting}
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
