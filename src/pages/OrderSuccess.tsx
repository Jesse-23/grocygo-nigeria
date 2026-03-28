import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const OrderSuccess = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <CheckCircle className="h-20 w-20 text-primary mx-auto" />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-extrabold text-foreground mt-6">
        Order Placed! 🎉
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground mt-3">
        Your groceries are on the way. You'll receive a confirmation on your phone shortly.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/dashboard" className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:shadow-button transition-all flex items-center justify-center gap-2">
          Track Order <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/shop" className="border border-border text-foreground font-semibold px-6 py-3 rounded-full hover:bg-secondary transition-all">
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  </div>
);

export default OrderSuccess;
