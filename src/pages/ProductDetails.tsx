import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { formatNaira } from "@/data/products"; // Removed 'products' array import
import { fetchProducts } from "@/api/client"; // Use the helper we created earlier
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  
  // --- New State for DB Data ---
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allProducts = await fetchProducts();
        
        // Find specific product by ID (converted to number to match PostgreSQL SERIAL ID)
        const foundProduct = allProducts.find((p: any) => p.id === Number(id));
        setProduct(foundProduct);

        // Find related products in same category (excluding current product)
        if (foundProduct) {
          const relatedItems = allProducts
            .filter((p: any) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4);
          setRelated(relatedItems);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]); // Reloads when the URL ID changes (e.g. clicking a related product)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg animate-pulse text-primary font-medium">Fetching product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">Product not found</p>
          <Link to="/shop" className="text-primary font-semibold mt-2 inline-block">Back to shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Database uses stock_quantity instead of inStock boolean
  const inStock = product.stock_quantity > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border shadow-sm"
          >
            <img 
              src={`http://localhost:5173${product.image_url}`} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </motion.div>

          {/* Info Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span className="text-sm font-medium text-primary uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 4) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating || 4.5})</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">{formatNaira(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatNaira(product.originalPrice)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            </div>

            <p className="text-muted-foreground mt-6 text-base leading-relaxed">{product.description}</p>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <div className="flex items-center border border-border rounded-full bg-card shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                <button 
                   onClick={() => setQty(Math.max(1, qty - 1))} 
                   className="p-4 hover:bg-secondary rounded-l-full transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-bold text-foreground text-lg">{qty}</span>
                <button 
                   onClick={() => setQty(qty + 1)} 
                   className="p-4 hover:bg-secondary rounded-r-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => inStock && addItem(product, qty)}
                disabled={!inStock}
                className="w-full sm:flex-1 bg-primary text-primary-foreground font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 hover:shadow-button transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </motion.button>
            </div>

            {!inStock && (
              <p className="text-destructive font-medium text-sm mt-4 flex items-center gap-2">
                ⚠️ This item is currently unavailable.
              </p>
            )}
          </motion.div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
               <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;