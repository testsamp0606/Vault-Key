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
  FileText,
  Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function Layout({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemType, setItemType] = useState("login");
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged out",
      description: "You have been signed out of your account",
    });
    onLogout?.();
  };

  const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "All Items", href: "/vault", icon: Lock },
    { name: "Security Check", href: "/security", icon: ShieldCheck },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Files", href: "/files", icon: Folder },
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-heading font-bold text-lg">SecureVault</span>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <main className="p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md border-0">
          <SheetHeader>
            <SheetTitle>Add New Item</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label htmlFor="item-type">Item Type</Label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger className="bg-card border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="note">Secure Note</SelectItem>
                  <SelectItem value="wifi">WiFi Password</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter item title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card border-border/50"
              />
            </div>

            {itemType === "login" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username/Email</Label>
                  <Input
                    id="username"
                    placeholder="you@example.com"
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
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL (optional)</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    className="bg-card border-border/50"
                  />
                </div>
              </>
            )}

            {itemType === "card" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input
                    id="cardholder"
                    placeholder="John Doe"
                    className="bg-card border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="4532 1234 5678 9010"
                    className="bg-card border-border/50"
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
                      placeholder="123"
                      className="bg-card border-border/50"
                    />
                  </div>
                </div>
              </>
            )}

            {itemType === "note" && (
              <div className="space-y-2">
                <Label htmlFor="note-content">Note Content</Label>
                <textarea
                  id="note-content"
                  placeholder="Enter your secure note here..."
                  rows={5}
                  className="w-full p-3 rounded-md bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            {itemType === "bank" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="1234567890"
                    className="bg-card border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routing-number">Routing Number</Label>
                  <Input
                    id="routing-number"
                    placeholder="021000021"
                    className="bg-card border-border/50"
                  />
                </div>
              </>
            )}

            {itemType === "wifi" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ssid">Network Name (SSID)</Label>
                  <Input
                    id="ssid"
                    placeholder="My WiFi Network"
                    className="bg-card border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wifi-password">WiFi Password</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    placeholder="••••••••••"
                    className="bg-card border-border/50"
                  />
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
