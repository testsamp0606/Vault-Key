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
import Layout from "@/components/layout";

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    // Check if user is logged in on mount
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  // Redirect to login if not logged in (except on login page)
  useEffect(() => {
    if (!isLoading && !isLoggedIn && location !== "/login") {
      // Navigation will be handled by wouter
    }
  }, [isLoggedIn, isLoading, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
  }

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
