import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-extrabold">GrocyGo</span>
          </div>
          <p className="text-sm opacity-70">Fresh groceries delivered fast to your doorstep across Nigeria. Students, families, and busy workers trust GrocyGo.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <Link to="/shop" className="hover:opacity-100 transition-opacity">Shop</Link>
            <Link to="/cart" className="hover:opacity-100 transition-opacity">Cart</Link>
            <Link to="/dashboard" className="hover:opacity-100 transition-opacity">My Orders</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <span>help@grocygo.ng</span>
            <span>+234 801 234 5678</span>
            <span>FAQ</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <span className="cursor-pointer hover:scale-110 transition-transform">📘</span>
            <span className="cursor-pointer hover:scale-110 transition-transform">🐦</span>
            <span className="cursor-pointer hover:scale-110 transition-transform">📸</span>
            <span className="cursor-pointer hover:scale-110 transition-transform">📱</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs opacity-50">
        © 2026 GrocyGo. All rights reserved. Made with ❤️ in Nigeria.
      </div>
    </div>
  </footer>
);

export default Footer;
