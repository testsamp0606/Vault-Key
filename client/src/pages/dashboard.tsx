import { useState, useEffect } from "react";
import { MOCK_VAULT_ITEMS } from "@/lib/mock-data";
import CredentialCard from "@/components/credential-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Lock, AlertTriangle, FileText, CreditCard, Upload, Download, Trash2, MoreVertical, File, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: string;
  uploadedDate: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Passport_Scan.pdf', type: 'pdf', size: '2.4 MB', uploadedDate: '2 days ago' },
  { id: '2', name: 'Bank_Statement_Dec.pdf', type: 'pdf', size: '1.8 MB', uploadedDate: '5 days ago' },
  { id: '3', name: 'Driver_License.jpg', type: 'image', size: '856 KB', uploadedDate: '1 week ago' },
  { id: '4', name: 'Insurance_Policy.pdf', type: 'pdf', size: '3.2 MB', uploadedDate: '2 weeks ago' },
  { id: '5', name: 'Contract_Draft.docx', type: 'document', size: '450 KB', uploadedDate: '3 weeks ago' },
];

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [userPlan, setUserPlan] = useState("");
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    const plan = localStorage.getItem("userPlan") || "free-trial";
    setUserEmail(email);
    setUserPlan(plan);
  }, []);

  const recentItems = MOCK_VAULT_ITEMS.slice(0, 4);
  const weakPasswords = MOCK_VAULT_ITEMS.filter(i => i.strength === 'weak').length;
  const reusedPasswords = 2;
  const totalDocuments = documents.length;
  const totalCards = MOCK_VAULT_ITEMS.filter(i => i.type === 'card').length;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <File className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

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
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {userEmail.split('@')[0]}</h1>
          <p className="text-muted-foreground">
            {userEmail} • {userPlan === 'free-trial' ? 'Free Trial' : userPlan === 'pro' ? 'Pro Plan' : 'Premium Plan'}
          </p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-sm text-muted-foreground">Total Credentials</div>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-muted rounded-xl text-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <div className="text-sm text-muted-foreground">Documents</div>
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
          <h2 className="text-xl font-semibold">Recent Credentials</h2>
          <a href="/vault">
            <Button variant="link" className="text-primary p-0">View All</Button>
          </a>
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

      {/* Documents & Files Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Documents & Files</h2>
          <Button variant="outline" className="gap-2 text-sm">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Document</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2.5 bg-muted/50 rounded-lg">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size} • {doc.uploadedDate}</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Download className="h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="p-8 rounded-xl border border-dashed border-border text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No documents yet. Upload your first file.</p>
          </div>
        )}
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
