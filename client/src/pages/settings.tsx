import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Lock, Eye, Smartphone, LogOut, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const { toast } = useToast();

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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Account Settings */}
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  defaultValue="user@example.com"
                  className="bg-card border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="master-password">Master Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="master-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-card border-border/50"
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  className="bg-primary hover:bg-primary/90 gap-2"
                  onClick={() => toast({ title: "Changes saved", description: "Your account settings have been updated." })}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Fingerprint Login</p>
                  <p className="text-sm text-muted-foreground">Use biometric authentication</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Auto-lock Vault</p>
                  <p className="text-sm text-muted-foreground">Lock after 5 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Set to 30 minutes</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Suspicious Activity Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify me of unusual login attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Weak Password Reminders</p>
                  <p className="text-sm text-muted-foreground">Weekly reminders to update weak passwords</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div>
                  <p className="font-medium">Security Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about important security updates</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Device Settings */}
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Connected Devices
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium">Chrome on macOS</p>
                  <p className="text-sm text-muted-foreground">Last accessed 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium">Safari on iPhone</p>
                  <p className="text-sm text-muted-foreground">Last accessed 1 day ago</p>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Data & Privacy
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Downloading...", description: "Your data export is being prepared." })}>
                Download Your Data
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Activity Log", description: "Showing last 100 login attempts" })}>
                View Activity Log
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={item}>
          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <h2 className="text-xl font-semibold mb-6 text-destructive flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Danger Zone
            </h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => toast({ title: "Signed out", description: "You have been signed out of all devices." })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out Everywhere
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => toast({ title: "Account deleted", description: "Your account and all data have been deleted.", variant: "destructive" })}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
