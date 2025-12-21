import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, LogOut, Search, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

interface User {
  email: string;
  plan: string;
  registeredAt: string;
  status: "pending" | "active" | "inactive" | "trashed";
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    // Load registered users from localStorage
    const allUsers: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("user_")) {
        const userData = JSON.parse(localStorage.getItem(key) || "{}");
        allUsers.push(userData);
      }
    }
    setUsers(allUsers);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (email: string) => {
    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "active" as const } : u
    );
    setUsers(updated);
    localStorage.setItem(`user_${email}`, JSON.stringify(updated.find(u => u.email === email)));
    toast({
      title: "User Approved",
      description: `${email} has been activated`,
    });
  };

  const handleReject = (email: string) => {
    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "inactive" as const } : u
    );
    setUsers(updated);
    localStorage.setItem(`user_${email}`, JSON.stringify(updated.find(u => u.email === email)));
    toast({
      title: "User Rejected",
      description: `${email} has been marked as inactive`,
    });
  };

  const handleTrash = (email: string) => {
    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "trashed" as const } : u
    );
    setUsers(updated);
    localStorage.setItem(`user_${email}`, JSON.stringify(updated.find(u => u.email === email)));
    toast({
      title: "User Trashed",
      description: `${email} has been moved to trash`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    toast({
      title: "Logged out",
      description: "Admin session ended",
    });
    setLocation("/admin-login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "inactive":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "trashed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ Pending";
      case "active":
        return "✓ Active";
      case "inactive":
        return "✕ Inactive";
      case "trashed":
        return "🗑 Trashed";
      default:
        return status;
    }
  };

  const pendingCount = users.filter((u) => u.status === "pending").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
              <img src={vaultImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">SecureVault Admin</h1>
              <p className="text-sm text-slate-400">User Management Dashboard</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <p className="text-slate-400 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">{users.length}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-amber-500/10 border-amber-500/20 p-6">
              <p className="text-amber-400 text-sm font-medium">Pending Approval</p>
              <p className="text-3xl font-bold text-amber-300 mt-2">{pendingCount}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-emerald-500/10 border-emerald-500/20 p-6">
              <p className="text-emerald-400 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-emerald-300 mt-2">{activeCount}</p>
            </Card>
          </motion.div>
        </div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-6">
            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600"
                />
              </div>

              <div className="flex gap-2">
                {["all", "pending", "active", "inactive", "trashed"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No users found</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.email}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-between gap-4 hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                              {user.plan}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(user.status)}`}>
                              {getStatusBadge(user.status)}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(user.registeredAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {user.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleApprove(user.email)}
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => handleReject(user.email)}
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {user.status !== "pending" && user.status !== "trashed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-red-600/50 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleTrash(user.email)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Trash
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Demo Info */}
        <motion.div
          className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-blue-300">
            <strong>Demo Note:</strong> In this mockup, newly registered users are stored in localStorage with "pending" status. Use this dashboard to approve/reject/trash users. User status determines their access when they login.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
