import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/cart", label: "Cart" },
    { to: "/dashboard", label: "My Orders" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="text-xl font-extrabold text-gradient-hero">GrocyGo</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <Link to="/login" className="p-2 hover:bg-secondary rounded-full transition-colors hidden md:flex">
            <User className="h-5 w-5 text-foreground" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 md:hidden hover:bg-secondary rounded-full transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-card border-r border-border shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <span className="text-xl font-extrabold text-gradient-hero">GrocyGo</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 py-3 px-3 rounded-lg transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 py-3 px-3 rounded-lg transition-colors"
                >
                  Login / Signup
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
