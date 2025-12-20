import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Lock, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Menu,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemType, setItemType] = useState("login");
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "All Items", href: "/vault", icon: Lock },
    { name: "Security Check", href: "/security", icon: ShieldCheck },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your item.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `New ${itemType} item "${title}" created!`,
    });
    
    setTitle("");
    setItemType("login");
    setIsAddDialogOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
          <img src={vaultImage} alt="Logo" className="w-full h-full object-cover opacity-80" />
        </div>
        <span className="font-heading font-bold text-lg tracking-tight text-sidebar-foreground">
          SecureVault
        </span>
      </div>

      <div className="px-4 py-6">
        <Button 
          onClick={() => {
            setIsAddDialogOpen(true);
            setIsMobileOpen(false);
          }}
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r border-sidebar-border bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20 overflow-hidden">
              <img src={vaultImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-heading font-bold text-lg">SecureVault</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Create a new credential or document in your SecureVault.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Item Type</Label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger id="type" className="bg-card border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="login">🔑 Login</SelectItem>
                  <SelectItem value="card">💳 Credit Card</SelectItem>
                  <SelectItem value="note">📝 Secure Note</SelectItem>
                  <SelectItem value="wifi">📶 WiFi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Gmail, My Visa Card"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card border-border/50"
                autoFocus
              />
            </div>

            {itemType === "login" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username or Email</Label>
                  <Input
                    id="username"
                    placeholder="your@email.com"
                    className="bg-card border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    className="bg-card border-border/50"
                  />
                </div>
              </>
            )}

            {itemType === "card" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="bg-card border-border/50 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="bg-card border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="•••"
                      className="bg-card border-border/50"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
