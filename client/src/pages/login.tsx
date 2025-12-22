import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      // Check if user exists and get their status
      const userData = localStorage.getItem(`user_${email}`);
      if (userData) {
        const user = JSON.parse(userData);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userStatus", user.status);
        localStorage.setItem("userPlan", user.plan);
        
        if (user.status === "pending") {
          toast({
            title: "Account pending",
            description: "Your account is awaiting admin approval",
          });
          setLocation("/");
        } else if (user.status === "inactive") {
          toast({
            title: "Account rejected",
            description: "Your account has been rejected. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        } else if (user.status === "trashed") {
          toast({
            title: "Account deleted",
            description: "This account has been deleted.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        } else {
          // active status
          toast({
            title: "Login successful",
            description: `Welcome back, ${email}!`,
          });
          setLocation("/");
        }
      } else {
        // New login (demo user)
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userStatus", "active");
        toast({
          title: "Login successful",
          description: `Welcome back, ${email}!`,
        });
        setLocation("/");
      }
      setIsLoading(false);
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
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/30 overflow-hidden">
              <img src={vaultImage} alt="Logo" className="w-full h-full object-cover opacity-90" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-white mb-2">
            SecureVault
          </h1>
          <p className="text-slate-400 text-sm">
            Your secure credential management system
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                </div>
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setLocation("/forgot-password")}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={() => setLocation("/register")}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up
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
            <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-200">Bank-level Security</p>
              <p className="text-xs text-slate-400 mt-1">
                Your credentials are encrypted with military-grade security
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
