import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { categories, products, testimonials } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-grocery.jpg";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <img
          src={heroImage}
          alt="Fresh groceries"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        {/* Accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium px-5 py-2 rounded-full mb-8 border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              🇳🇬 Delivering across Lagos, Abuja & more
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="font-heading text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight"
            >
              <span className="text-white">Fresh groceries</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                delivered fast
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/70 mt-6 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
            >
              Skip the market stress. Order from your phone and get fresh food
              delivered to your home, hostel, or office.
            </motion.p>

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              onSubmit={handleSearch}
              className="mt-10 flex items-center max-w-lg mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-2xl focus-within:border-primary/60 focus-within:bg-white/15 transition-all duration-300"
            >
              <Search className="h-5 w-5 text-white/50 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for rice, tomatoes, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm md:text-base outline-none text-white placeholder:text-white/40"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-xl shadow-button transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Search
              </button>
            </motion.form>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="mt-8 flex items-center justify-center gap-6 text-white/50 text-xs md:text-sm"
            >
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> Free delivery over ₦10k
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Secure payments
              </span>
              <span className="flex items-center gap-1.5">⚡ 30-min delivery</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl font-bold text-foreground text-center mb-10"
        >
          Shop by Category
        </motion.h2>
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
                className="group flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <span className="font-heading font-semibold text-sm text-foreground">{cat.name}</span>
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
          className="bg-gradient-hero rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(160_60%_45%/0.4),transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="font-heading text-2xl md:text-4xl font-extrabold text-primary-foreground">
              🎉 First Order? Get 15% Off!
            </h3>
            <p className="text-primary-foreground/80 mt-3 text-base md:text-lg">
              Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">NEWGROCY</span> at checkout
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-6 bg-card text-primary font-semibold px-7 py-3.5 rounded-xl hover:shadow-card-hover transition-all duration-200 hover:scale-[1.03]"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground">Popular Products</h2>
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
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl font-bold text-foreground text-center mb-12"
        >
          How It Works
        </motion.h2>
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
              className="group flex flex-col items-center text-center p-10 bg-card rounded-3xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-foreground text-center mb-12"
          >
            What Our Customers Say
          </motion.h2>
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
                className="bg-card rounded-2xl p-7 border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <p className="text-foreground italic text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-5">
                  <span className="font-heading font-semibold text-foreground text-sm">{t.name}</span>
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
