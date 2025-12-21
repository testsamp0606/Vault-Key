import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin credentials for demo
    const ADMIN_EMAIL = "admin@securevault.com";
    const ADMIN_PASSWORD = "admin123";

    if (email !== ADMIN_EMAIL) {
      toast({
        title: "Invalid credentials",
        description: "Admin email or password is incorrect",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      toast({
        title: "Invalid credentials",
        description: "Admin email or password is incorrect",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate admin login
    setTimeout(() => {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminEmail", email);
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard",
      });
      // Use direct navigation to ensure state is properly updated
      window.location.href = "/admin-dashboard";
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/30">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-sm">
            SecureVault Administration Portal
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@securevault.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
              >
                {isLoading ? "Signing in..." : "Admin Login"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                  <p className="text-slate-300"><strong>Email:</strong> admin@securevault.com</p>
                </div>
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                  <p className="text-slate-300"><strong>Password:</strong> admin123</p>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <p className="text-center text-sm text-slate-400">
              Regular user?{" "}
              <button
                type="button"
                onClick={() => window.location.href = "/login"}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                User Login
              </button>
            </p>
          </Card>
        </motion.div>

        {/* Security Info */}
        <motion.div
          className="mt-8 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
          variants={itemVariants}
        >
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-200">Admin Only</p>
              <p className="text-xs text-slate-400 mt-1">
                This area is restricted to authorized administrators only
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
