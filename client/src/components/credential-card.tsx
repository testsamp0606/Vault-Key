import { useState } from "react";
import { VaultItem } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Globe, 
  CreditCard, 
  FileText, 
  Wifi, 
  MoreVertical,
  Star,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface CredentialCardProps {
  item: VaultItem;
}

export default function CredentialCard({ item }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'login': return Globe;
      case 'card': return CreditCard;
      case 'note': return FileText;
      case 'wifi': return Wifi;
      default: return LockIcon;
    }
  };

  const Icon = getIcon(item.type);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied securely.`,
    });
  };

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold leading-none tracking-tight">{item.title}</h3>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-4">
        {item.type === 'login' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-xs font-medium text-muted-foreground uppercase w-12 shrink-0">User</span>
                <span className="text-sm truncate select-all">{item.username}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 shrink-0"
                onClick={() => copyToClipboard(item.username || '', 'Username')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-xs font-medium text-muted-foreground uppercase w-12 shrink-0">Pass</span>
                <span className="text-sm font-mono truncate">
                  {showPassword ? item.password : "••••••••••••"}
                </span>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 shrink-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 shrink-0"
                  onClick={() => copyToClipboard(item.password || '', 'Password')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {item.url && (
               <div className="flex justify-between items-center mt-2">
                 <Badge variant={item.strength === 'strong' ? 'default' : item.strength === 'medium' ? 'secondary' : 'destructive'} className="text-[10px] px-2 h-5">
                    {item.strength?.toUpperCase() || 'UNKNOWN'}
                 </Badge>
                 <a href={`https://${item.url}`} target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                   Launch <ExternalLink className="h-3 w-3" />
                 </a>
               </div>
            )}
          </div>
        )}

        {item.type === 'card' && (
           <div className="space-y-3">
             <div className="p-3 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 shadow-inner">
               <div className="flex justify-between items-start mb-4">
                 <CreditCard className="h-4 w-4 text-white/50" />
                 <span className="text-xs font-mono text-white/80">{item.expiry}</span>
               </div>
               <div className="font-mono text-white tracking-wider text-sm mb-2">
                 {showPassword ? item.cardNumber : `•••• •••• •••• ${item.cardNumber?.slice(-4)}`}
               </div>
             </div>
             <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-8 text-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide Details" : "Show Details"}
             </Button>
           </div>
        )}

        {item.type === 'note' && (
          <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground min-h-[80px]">
            {item.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
