import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import ForgottenPassword from "@/components/ForgottenPassword";

const Login = () => {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgottenPasswordOpen, setIsForgottenPasswordOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-4xl">🛒</span>
          <h1 className="text-2xl font-extrabold text-foreground mt-3">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Login to your GrocyGo account</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsForgottenPasswordOpen(true)}
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:shadow-button transition-all"
          >
            Log In
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
              console.log("Login successful:", response);
              // TODO: Handle successful login - redirect to dashboard
            }}
            onError={() => {
              console.error("Google login failed");
            }}
          />
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
        </p>

        <ForgottenPassword
          isOpen={isForgottenPasswordOpen}
          onClose={() => setIsForgottenPasswordOpen(false)}
        />
      </div>
    </div>
  );
};

export default Login;
