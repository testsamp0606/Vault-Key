import { MOCK_VAULT_ITEMS } from "@/lib/mock-data";
import CredentialCard from "@/components/credential-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const recentItems = MOCK_VAULT_ITEMS.slice(0, 4);
  const weakPasswords = MOCK_VAULT_ITEMS.filter(i => i.strength === 'weak').length;
  const reusedPasswords = 2;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">Here is your security overview.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search vault..." 
            className="pl-9 bg-card border-border/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-sm text-primary/80 font-medium">Security Score</div>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-muted rounded-xl text-foreground">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{MOCK_VAULT_ITEMS.length}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </div>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-destructive/20 rounded-xl text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-destructive">{weakPasswords}</div>
            <div className="text-sm text-destructive/80 font-medium">Weak Passwords</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button variant="link" className="text-primary p-0">View All</Button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {recentItems.map((vaultItem) => (
            <motion.div key={vaultItem.id} variants={item}>
              <CredentialCard item={vaultItem} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Security Actions</h2>
            <div className="p-4 rounded-xl border border-border bg-card/30 hover:border-border hover:shadow-md transition-all flex items-center justify-between">
                <div>
                    <div className="font-medium">Enable 2FA</div>
                    <div className="text-sm text-muted-foreground">Protect your vault with extra security</div>
                </div>
                <Button variant="outline" size="sm">Setup</Button>
            </div>
             <div className="p-4 rounded-xl border border-border bg-card/30 hover:border-border hover:shadow-md transition-all flex items-center justify-between">
                <div>
                    <div className="font-medium">Import Passwords</div>
                    <div className="text-sm text-muted-foreground">Import from Chrome or CSV</div>
                </div>
                <Button variant="outline" size="sm">Import</Button>
            </div>
        </div>
         <div className="space-y-4">
            <h2 className="text-xl font-semibold">Vault Health</h2>
             <div className="p-6 rounded-xl border border-border bg-card/30 space-y-4">
                <div className="flex justify-between text-sm mb-1">
                    <span>Overall Strength</span>
                    <span className="text-primary font-medium">Strong</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%] rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground">
                    You have {weakPasswords} weak passwords and {reusedPasswords} reused passwords to fix.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
