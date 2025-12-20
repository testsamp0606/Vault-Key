import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

    // Simulate sending email
    setTimeout(() => {
      setSubmitted(true);
      toast({
        title: "Email sent",
        description: `Password reset instructions have been sent to ${email}`,
      });
      setIsLoading(false);
    }, 1500);
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-3">
              Check Your Email
            </h1>
            <p className="text-slate-400 mb-6">
              We've sent password reset instructions to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-sm text-slate-400 mb-8">
              Follow the link in the email to reset your password. The link will expire in 24 hours for security.
            </p>

            <Button
              onClick={() => setLocation("/login")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mb-3"
            >
              Back to Login
            </Button>
            <Button
              onClick={() => {
                setEmail("");
                setSubmitted(false);
              }}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Try Another Email
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => setLocation("/login")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6"
          variants={itemVariants}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </motion.button>

        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/30 overflow-hidden">
              <img src={vaultImage} alt="Logo" className="w-full h-full object-cover opacity-90" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-white mb-2">
            Reset Password
          </h1>
          <p className="text-slate-400 text-sm">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                Remember your password?{" "}
                <button
                  onClick={() => setLocation("/login")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
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
              <p className="text-sm font-medium text-slate-200">Secure Process</p>
              <p className="text-xs text-slate-400 mt-1">
                We'll never ask for your password. Always reset through this secure link.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
