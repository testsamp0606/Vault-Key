import { MOCK_VAULT_ITEMS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle, RefreshCw, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function Security() {
  const weakPasswords = MOCK_VAULT_ITEMS.filter(i => i.strength === 'weak');
  const mediumPasswords = MOCK_VAULT_ITEMS.filter(i => i.strength === 'medium');
  const strongPasswords = MOCK_VAULT_ITEMS.filter(i => i.strength === 'strong');
  
  const securityScore = 98;
  const reusedPasswords = 2;
  const duplicatePasswords = 1;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
          <h1 className="text-3xl font-bold text-foreground">Security Check</h1>
          <p className="text-muted-foreground">Monitor your vault security and password health</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Run Scan
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <Card className="bg-primary/10 border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary/80">Overall Score</p>
                <p className="text-4xl font-bold text-primary mt-2">{securityScore}%</p>
              </div>
              <CheckCircle className="h-12 w-12 text-primary opacity-30" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-destructive/10 border-destructive/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive/80">Weak Passwords</p>
                <p className="text-4xl font-bold text-destructive mt-2">{weakPasswords.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-destructive opacity-30" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-yellow-500/10 border-yellow-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600/80">Reused Passwords</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{reusedPasswords}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-500 opacity-30" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-blue-500/10 border-blue-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600/80">Duplicate Passwords</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{duplicatePasswords}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-blue-500 opacity-30" />
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Password Strength Breakdown */}
      <motion.div 
        variants={item}
        initial="hidden"
        animate="show"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Password Strength Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">Strong Passwords</span>
                <span className="font-medium text-green-600">{strongPasswords.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: `${(strongPasswords.length / MOCK_VAULT_ITEMS.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">Medium Passwords</span>
                <span className="font-medium text-yellow-600">{mediumPasswords.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600" style={{ width: `${(mediumPasswords.length / MOCK_VAULT_ITEMS.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">Weak Passwords</span>
                <span className="font-medium text-destructive">{weakPasswords.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: `${(weakPasswords.length / MOCK_VAULT_ITEMS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Weak Passwords List */}
      {weakPasswords.length > 0 && (
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Weak Passwords Found
            </h2>
            <div className="space-y-3">
              {weakPasswords.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Consider updating this password</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    Update
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Security Recommendations */}
      <motion.div variants={item} initial="hidden" animate="show">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security Recommendations</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Enabled on most accounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Update Weak Passwords</p>
                <p className="text-sm text-muted-foreground">You have {weakPasswords.length} weak password(s) that should be updated</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Remove Duplicate Passwords</p>
                <p className="text-sm text-muted-foreground">Use unique passwords for each account to prevent breaches</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
