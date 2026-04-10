import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth(); // Get auth state
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

          {/* Logic for Authenticated vs Guest */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 hover:bg-secondary rounded-full transition-all border border-transparent hover:border-border">
                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{user?.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={logout} 
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-2 hover:bg-secondary rounded-full transition-colors hidden md:flex">
              <User className="h-5 w-5 text-foreground" />
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 md:hidden hover:bg-secondary rounded-full transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-b border-border bg-card"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium text-red-500 py-2 w-full text-left flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout ({user?.name})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Login / Signup
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;