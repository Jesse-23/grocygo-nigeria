import { Product, formatNaira } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface Props {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: Props) => {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-card text-foreground text-sm font-semibold px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs font-medium text-primary uppercase tracking-wide">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-foreground">{formatNaira(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => product.inStock && addItem(product)}
            disabled={!product.inStock}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:shadow-button transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
