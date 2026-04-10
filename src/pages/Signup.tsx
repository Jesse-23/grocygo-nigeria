import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Added Loader
import Navbar from "@/components/Navbar";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import { registerUser } from "@/api/client"; // Added API call
import { useAuth } from "@/context/AuthContext"; // Added AuthContext
import { toast } from "sonner"; // Using your existing sonner toast

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send data to Backend
      const response = await registerUser(form);
      
      // 2. Update Global Auth State
      login(response.user, response.token);
      
      // 3. Success Notification
      toast.success("Account created! Welcome to GrocyGo 🛒");
      
      // 4. Redirect to Home
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-4xl">🛒</span>
          <h1 className="text-2xl font-extrabold text-foreground mt-3">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join GrocyGo and start shopping</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <input
            type="text"
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
          <input
            type="email"
            required
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:shadow-button transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </motion.form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GoogleOAuthButton
            onSuccess={(response) => {
              console.log("Signup successful:", response);
            }}
            onError={() => {
              console.error("Google signup failed");
            }}
          />
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;