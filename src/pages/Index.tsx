import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/api/client";
import { categories, testimonials } from "@/data/products";
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
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeatured = async () => {
      try {
        const data = await fetchProducts();
        setDbProducts(data);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    getFeatured();
  }, []);

  const featured = dbProducts.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Fresh groceries"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium px-5 py-2 rounded-full mb-8 border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              🇳🇬 Delivering across Lagos, Abuja & more
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.1]"
            >
              Fresh groceries <br />
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                delivered fast
              </span>
            </motion.h1>

            {/* FIXED SEARCH FORM FOR MOBILE */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSearch}
              className="mt-10 relative flex items-center max-w-lg mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl"
            >
              <div className="flex items-center flex-1 px-3">
                <Search className="h-5 w-5 text-white/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for rice, tomatoes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white outline-none py-3 pl-3 pr-24 placeholder:text-white/40 text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                className="absolute right-1.5 bg-primary text-white px-5 md:px-7 py-2.5 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
              >
                Search
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl font-bold text-center mb-10">
          Shop by Category
        </h2>
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
                className="group flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border shadow-card hover:-translate-y-1.5 transition-all"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="font-heading font-semibold text-sm">
                  {cat.name}
                </span>
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
              Use code{" "}
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded">
                NEWGROCY
              </span>{" "}
              at checkout
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-6 bg-card text-primary font-semibold px-7 py-3.5 rounded-xl hover:scale-[1.03] transition-all"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl font-bold">Popular Products</h2>
          <Link
            to="/shop"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-10">Loading groceries...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Search className="h-8 w-8" />,
              title: "Browse & Search",
              desc: "Find your favourite groceries from our wide collection.",
            },
            {
              icon: <ShieldCheck className="h-8 w-8" />,
              title: "Pay Securely",
              desc: "Checkout with Paystack — fast, safe, and easy.",
            },
            {
              icon: <Truck className="h-8 w-8" />,
              title: "Get it Delivered",
              desc: "We bring it straight to your door, hostel, or office.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex flex-col items-center text-center p-10 bg-card rounded-3xl border border-border"
            >
              <div className="h-16 w-16 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-5">
                {step.icon}
              </div>
              <h3 className="font-heading font-bold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
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
                className="bg-card rounded-2xl p-7 border border-border shadow-card"
              >
                <p className="text-foreground italic text-sm">"{t.text}"</p>
                <div className="mt-5">
                  <span className="font-heading font-semibold text-sm">
                    {t.name}
                  </span>
                  <span className="text-muted-foreground text-xs ml-2">
                    {t.role}
                  </span>
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
