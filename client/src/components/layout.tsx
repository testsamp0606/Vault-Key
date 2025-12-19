import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Lock, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import vaultImage from "@assets/generated_images/abstract_cybersecurity_vault_lock_concept.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "All Items", href: "/vault", icon: Lock },
    { name: "Security Check", href: "/security", icon: ShieldCheck },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 overflow-hidden">
             <img src={vaultImage} alt="Logo" className="w-full h-full object-cover opacity-80" />
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-sidebar-foreground">
          SecureVault
        </span>
      </div>

      <div className="px-4 mb-6">
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
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

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
