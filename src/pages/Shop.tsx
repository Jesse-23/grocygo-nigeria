import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { fetchProducts } from "@/api/client"; 
import { categories } from "@/data/products"; 
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Shop = () => {
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const initialCat = params.get("category") || "";

  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState("default");

  // Fetch products whenever search or category changes
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true); // Show loader while fetching
      try {
        // Now passing the filters directly to the API helper
        const data = await fetchProducts(selectedCategory, search);
        setDbProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    // We use a small delay (debounce) for search so it doesn't hit the DB on every single keystroke
    const timer = setTimeout(() => {
      getProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategory]); // Triggers API call on change

  const sortedProducts = useMemo(() => {
    let list = [...dbProducts];
    
    // We only handle Sorting here, because Filtering is now done by Postgres
    if (sortBy === "price-low") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }
    
    return list;
  }, [sortBy, dbProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-foreground mb-6"
        >
          Shop Groceries
        </motion.h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center bg-card border border-border rounded-lg px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Popularity</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !selectedCategory ? "bg-primary text-primary-foreground shadow-button" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id === selectedCategory ? "" : c.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === c.id ? "bg-primary text-primary-foreground shadow-button" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-50">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="aspect-[4/5] bg-secondary animate-pulse rounded-xl" />
             ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found for "{search || selectedCategory}"</p>
            <button onClick={() => { setSearch(""); setSelectedCategory(""); }} className="text-primary font-semibold mt-2 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Shop;