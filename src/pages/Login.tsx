import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import ForgottenPassword from "@/components/ForgottenPassword";
import { loginUser } from "@/api/client"; 
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgottenPasswordOpen, setIsForgottenPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      login(response.user, response.token);
      toast.success(`Welcome back, ${response.user.name}!`);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: credentialResponse.credential }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (error) {
      toast.error("Could not connect to server");
    }
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

        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <input
            type="email" required placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"} required placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-right">
            <button type="button" onClick={() => setIsForgottenPasswordOpen(true)} className="text-sm text-primary hover:underline font-medium">
              Forgot password?
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
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

        {/* buttonText defaults to signin_with internally */}
        <GoogleOAuthButton 
          onSuccess={handleGoogleSuccess} 
          onError={() => toast.error("Google login failed")} 
        />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
        </p>

        <ForgottenPassword isOpen={isForgottenPasswordOpen} onClose={() => setIsForgottenPasswordOpen(false)} />
      </div>
    </div>
  );
};

export default Login;