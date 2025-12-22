import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Vault from "@/pages/vault";
import Security from "@/pages/security";
import Settings from "@/pages/settings";
import Notes from "@/pages/notes";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import Register from "@/pages/register";
import PendingApproval from "@/pages/pending-approval";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Layout from "@/components/layout";

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    // Check if user is logged in or admin
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const admin = localStorage.getItem("isAdmin") === "true";
      const status = localStorage.getItem("userStatus");
      
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
      setUserStatus(status);
      setIsLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes in other tabs/windows
    window.addEventListener("storage", checkAuth);
    
    // Also check when location changes
    checkAuth();
    
    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Admin routes
  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route component={AdminDashboard} />
      </Switch>
    );
  }

  // User pending approval
  if (isLoggedIn && userStatus === "pending") {
    return <PendingApproval />;
  }

  // User not logged in
  if (!isLoggedIn) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/register" component={Register} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={AdminLogin} />
        <Route component={Login} />
      </Switch>
    );
  }

  // User logged in and approved
  return (
    <Layout onLogout={() => setIsLoggedIn(false)}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/vault" component={Vault} />
        <Route path="/security" component={Security} />
        <Route path="/settings" component={Settings} />
        <Route path="/notes" component={Notes} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
