import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

type SubscriptionPlan = "free-trial" | "pro" | "premium";

interface Plan {
  id: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  duration: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free-trial",
    name: "Free Trial",
    price: "$0",
    description: "Get started risk-free",
    duration: "3 days",
    features: [
      "Unlimited password storage",
      "All core features",
      "Secure cloud sync",
      "Auto-fill capabilities",
    ],
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$4.99",
    description: "For individuals",
    duration: "per month",
    features: [
      "Everything in Free Trial",
      "Emergency access",
      "Advanced security settings",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    description: "For families & teams",
    duration: "per month",
    features: [
      "Everything in Pro",
      "Family vault sharing",
      "Team management",
      "Advanced analytics",
      "Dedicated support",
    ],
    highlighted: true,
  },
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("free-trial");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
        description: "Please create a strong password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Please use at least 8 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPlan", selectedPlan);
      localStorage.setItem("planStartDate", new Date().toISOString());

      const planName = PLANS.find(p => p.id === selectedPlan)?.name || "Free Trial";
      toast({
        title: "Account created!",
        description: `Welcome! You're on the ${planName} plan.`,
      });
      setLocation("/");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/30 overflow-hidden">
              <img src={vaultImage} alt="Logo" className="w-full h-full object-cover opacity-90" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-white mb-2">
            Join SecureVault
          </h1>
          <p className="text-slate-400 text-sm">
            Create your account and secure your credentials today
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Signup Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-8">
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
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">At least 8 characters</p>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/login")}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </Card>
          </motion.div>

          {/* Plans Selector */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white px-4">Choose Your Plan</h3>
              <div className="space-y-2">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{plan.name}</h4>
                          {plan.id === "free-trial" && (
                            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{plan.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{plan.price}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Plan Details */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-start gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {PLANS.find(p => p.id === selectedPlan)?.name} Selected
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {PLANS.find(p => p.id === selectedPlan)?.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Terms */}
        <motion.p className="text-center text-xs text-slate-500 mt-8" variants={itemVariants}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
