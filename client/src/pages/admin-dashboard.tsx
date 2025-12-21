import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, LogOut, Search, Shield, Eye, Edit, Mail, RotateCcw } from "lucide-react";
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("user_")) {
        const userData = JSON.parse(localStorage.getItem(key) || "{}");
        allUsers.push(userData);
      }
    }
    setUsers(allUsers);
  };

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
    setSelectedUser(null);
    toast({
      title: "User Approved",
      description: `${email} is now active`,
    });
  };

  const handleReject = (email: string) => {
    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "inactive" as const } : u
    );
    setUsers(updated);
    localStorage.setItem(`user_${email}`, JSON.stringify(updated.find(u => u.email === email)));
    setSelectedUser(null);
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
    setSelectedUser(null);
    toast({
      title: "User Trashed",
      description: `${email} has been moved to trash`,
    });
  };

  const handleRestore = (email: string) => {
    const updated = users.map((u) =>
      u.email === email ? { ...u, status: "active" as const } : u
    );
    setUsers(updated);
    localStorage.setItem(`user_${email}`, JSON.stringify(updated.find(u => u.email === email)));
    setSelectedUser(null);
    toast({
      title: "User Restored",
      description: `${email} has been restored to active`,
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      plan: editPlan,
      status: editStatus as "pending" | "active" | "inactive" | "trashed",
    };

    const updated = users.map((u) =>
      u.email === editingUser.email ? updatedUser : u
    );
    setUsers(updated);
    localStorage.setItem(`user_${editingUser.email}`, JSON.stringify(updatedUser));
    setEditingUser(null);
    setSelectedUser(updatedUser);
    toast({
      title: "User Updated",
      description: `${editingUser.email} has been updated`,
    });
  };

  const handleSendResetEmail = (email: string) => {
    toast({
      title: "Email Sent",
      description: `Password reset email sent to ${email}`,
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
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-6">
              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["all", "pending", "active", "inactive", "trashed"].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="capitalize text-xs"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
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
                        className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-between gap-2 hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                              {user.plan}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(user.status)}`}>
                              {getStatusBadge(user.status)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 px-2 border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditingUser(null);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </Card>
          </motion.div>

          {/* User Details Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {selectedUser ? (
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-6 sticky top-8">
                <div className="space-y-4">
                  {!editingUser ? (
                    <>
                      <h3 className="text-lg font-semibold text-white">User Details</h3>
                      <div className="space-y-3 pb-4 border-b border-slate-700">
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Email</p>
                          <p className="text-sm text-white mt-1 break-all">{selectedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Plan</p>
                          <p className="text-sm text-white mt-1">{selectedUser.plan}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Status</p>
                          <p className={`text-sm mt-1 px-2 py-1 rounded border w-fit ${getStatusColor(selectedUser.status)}`}>
                            {getStatusBadge(selectedUser.status)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Registered</p>
                          <p className="text-sm text-slate-300 mt-1">
                            {new Date(selectedUser.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {selectedUser.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleApprove(selectedUser.email)}
                              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(selectedUser.email)}
                              variant="outline"
                              className="w-full gap-2 border-red-600/50 text-red-400 hover:bg-red-500/10 text-sm"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}

                        {selectedUser.status === "trashed" && (
                          <Button
                            onClick={() => handleRestore(selectedUser.email)}
                            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restore
                          </Button>
                        )}

                        <Button
                          onClick={() => {
                            setEditingUser(selectedUser);
                            setEditPlan(selectedUser.plan);
                            setEditStatus(selectedUser.status);
                          }}
                          variant="outline"
                          className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>

                        <Button
                          onClick={() => handleSendResetEmail(selectedUser.email)}
                          variant="outline"
                          className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                        >
                          <Mail className="h-4 w-4" />
                          Send Reset Email
                        </Button>

                        {selectedUser.status !== "trashed" && (
                          <Button
                            onClick={() => handleTrash(selectedUser.email)}
                            variant="outline"
                            className="w-full gap-2 border-red-600/50 text-red-400 hover:bg-red-500/10 text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            Trash
                          </Button>
                        )}

                        <Button
                          onClick={() => setSelectedUser(null)}
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                        >
                          Close
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-white">Edit User</h3>
                      <div className="space-y-4 pb-4 border-b border-slate-700">
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Email</p>
                          <p className="text-sm text-white mt-1">{editingUser.email}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-slate-400 font-medium">Plan</Label>
                          <Select value={editPlan} onValueChange={setEditPlan}>
                            <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free-trial">Free Trial</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-slate-400 font-medium">Status</Label>
                          <Select value={editStatus} onValueChange={setEditStatus}>
                            <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="trashed">Trashed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleSaveEdit}
                          className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                        >
                          <Check className="h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setEditingUser(null)}
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-6">
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Select a user to view details</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Demo Info */}
        <motion.div
          className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-blue-300">
            <strong>Admin Controls:</strong> View user details, edit plan & status, approve/reject registrations, send password reset emails, and manage user lifecycle.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
