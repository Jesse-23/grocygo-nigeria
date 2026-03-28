import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Truck, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { categories, products, testimonials, formatNaira } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const featured = products.filter((p) => p.popular).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.06]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-secondary text-secondary-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            >
              🇳🇬 Delivering across Lagos, Abuja & more
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight"
            >
              Fresh groceries{" "}
              <span className="text-gradient-hero">delivered fast</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-4 text-lg max-w-lg mx-auto"
            >
              Skip the market stress. Order from your phone and get fresh food delivered to your home, hostel, or office.
            </motion.p>

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="mt-8 flex items-center max-w-md mx-auto bg-card border border-border rounded-full px-4 py-2 shadow-card focus-within:ring-2 focus-within:ring-ring transition-all"
            >
              <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for rice, tomatoes, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button type="submit" className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full hover:shadow-button transition-all">
                Search
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Shop by Category</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={item}>
              <Link
                to={`/shop?category=${cat.id}`}
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count} items</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold text-primary-foreground">🎉 First Order? Get 15% Off!</h3>
          <p className="text-primary-foreground/80 mt-2">Use code <span className="font-bold">NEWGROCY</span> at checkout</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-5 bg-card text-primary font-semibold px-6 py-3 rounded-full hover:shadow-card-hover transition-all"
          >
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Popular Products</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">How It Works</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Search className="h-8 w-8" />, title: "Browse & Search", desc: "Find your favourite groceries from our wide collection." },
            { icon: <ShieldCheck className="h-8 w-8" />, title: "Pay Securely", desc: "Checkout with Paystack — fast, safe, and easy." },
            { icon: <Truck className="h-8 w-8" />, title: "Get it Delivered", desc: "We bring it straight to your door, hostel, or office." },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border shadow-card"
            >
              <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-foreground text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">What Our Customers Say</h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={item}
                className="bg-card rounded-xl p-6 border border-border shadow-card"
              >
                <p className="text-foreground italic text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-4">
                  <span className="font-semibold text-foreground text-sm">{t.name}</span>
                  <span className="text-muted-foreground text-xs ml-2">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
