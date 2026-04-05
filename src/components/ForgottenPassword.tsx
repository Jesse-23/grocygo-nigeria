import { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ForgottenPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgottenPassword = ({ isOpen, onClose }: ForgottenPasswordProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Call your backend API to send password reset email
    // Example: await resetPassword(email);

    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
      // Auto close after 3 seconds
      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);
    }, 1500);
  };

  const resetForm = () => {
    setEmail("");
    setSubmitted(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 pt-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:shadow-button transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              This dialog will close automatically
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgottenPassword;
