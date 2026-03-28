import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { products, formatNaira } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

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

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-2xl overflow-hidden bg-secondary"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span className="text-sm font-medium text-primary uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-extrabold text-foreground mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating}</span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-extrabold text-foreground">{formatNaira(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through ml-3">
                  {formatNaira(product.originalPrice)}
                </span>
              )}
              <span className="text-sm text-muted-foreground ml-3">{product.unit}</span>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary rounded-l-full transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-semibold text-foreground">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary rounded-r-full transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(product, qty)}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:shadow-button transition-all disabled:opacity-40"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </motion.button>
            </div>

            {!product.inStock && (
              <p className="text-destructive text-sm mt-3">This item is currently out of stock.</p>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
