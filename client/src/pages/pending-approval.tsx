import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, LogOut, Mail } from "lucide-react";
import { motion } from "framer-motion";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function PendingApproval() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const userEmail = localStorage.getItem("userEmail") || "your account";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("planStartDate");
    toast({
      title: "Logged out",
      description: "You have been signed out",
    });
    setLocation("/login");
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
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 flex items-center justify-center border-2 border-amber-500/30">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-white mb-2">
            Pending Approval
          </h1>
          <p className="text-slate-400 text-sm">
            Your account is awaiting admin verification
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-8 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-400 font-medium">
                  ⏳ Account Under Review
                </p>
                <p className="text-xs text-amber-300/70 mt-1">
                  Thank you for registering! Your account has been created and is now under review by our admin team.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-slate-300">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">Account Created</p>
                    <p className="text-xs text-slate-400">{userEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-3 w-3 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">Waiting for Admin Review</p>
                    <p className="text-xs text-slate-400">Usually approved within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-slate-400">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">Access Granted</p>
                    <p className="text-xs text-slate-400">Once approved, you can use all features</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-3">
              <p className="text-sm text-slate-300">
                Need help? Contact our support team:
              </p>
              <Button
                onClick={() => {
                  window.location.href = "mailto:support@securevault.com";
                }}
                className="w-full gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Card>
        </motion.div>

        {/* Info Box */}
        <motion.div
          className="mt-8 p-4 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700"
          variants={itemVariants}
        >
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Why the approval?</strong> We verify each account to ensure the security and integrity of our platform. This helps us prevent fraud and maintain the highest standards of data protection.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
