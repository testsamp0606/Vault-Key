import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Trash2, MoreVertical, File, Image as ImageIcon, Search, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: string;
  uploadedDate: string;
  uploadedBy: string;
  isShared: boolean;
  sharedWith?: string[];
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Passport_Scan.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedDate: '2 days ago',
    uploadedBy: 'You',
    isShared: true,
    sharedWith: ['admin@securevault.com']
  },
  {
    id: '2',
    name: 'Bank_Statement_Dec.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedDate: '5 days ago',
    uploadedBy: 'You',
    isShared: false,
    sharedWith: []
  },
  {
    id: '3',
    name: 'Driver_License.jpg',
    type: 'image',
    size: '856 KB',
    uploadedDate: '1 week ago',
    uploadedBy: 'You',
    isShared: false,
    sharedWith: []
  },
  {
    id: '4',
    name: 'Insurance_Policy.pdf',
    type: 'pdf',
    size: '3.2 MB',
    uploadedDate: '2 weeks ago',
    uploadedBy: 'You',
    isShared: true,
    sharedWith: ['manager@company.com']
  },
  {
    id: '5',
    name: 'Contract_Draft.docx',
    type: 'document',
    size: '450 KB',
    uploadedDate: '3 weeks ago',
    uploadedBy: 'You',
    isShared: false,
    sharedWith: []
  },
];

export default function FilesPage() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const { toast } = useToast();

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <File className="h-5 w-5 text-blue-600" />;
      default:
        return <File className="h-5 w-5 text-slate-400" />;
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The file has been removed permanently",
    });
  };

  const handleShareDocument = (doc: Document) => {
    if (!shareEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    const updated = documents.map(d =>
      d.id === doc.id
        ? {
          ...d,
          isShared: true,
          sharedWith: [...(d.sharedWith || []), shareEmail]
        }
        : d
    );
    setDocuments(updated);
    setShareEmail("");
    setIsShareDialogOpen(false);
    toast({
      title: "Document shared",
      description: `${doc.name} shared with ${shareEmail}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documents & Files</h1>
          <p className="text-muted-foreground">Manage and share your documents</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card"
        />
      </div>

      {/* Documents Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Uploaded</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredDocuments.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <div className="p-2 bg-muted/50 rounded">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-primary group-hover:underline">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">by {doc.uploadedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{doc.size}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{doc.uploadedDate}</td>
                    <td className="px-6 py-4 text-sm">
                      {doc.isShared && doc.sharedWith && doc.sharedWith.length > 0 ? (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1 w-fit">
                          <Share2 className="h-3 w-3" />
                          Shared with {doc.sharedWith.length}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Private</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Download className="h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsShareDialogOpen(true);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                            Share
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
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="p-12 text-center">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        )}
      </div>

      {/* File Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    {getFileIcon(selectedDoc.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedDoc.name}</h3>
                    <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                      <p>Size: {selectedDoc.size}</p>
                      <p>Uploaded: {selectedDoc.uploadedDate}</p>
                      <p>By: {selectedDoc.uploadedBy}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sharing Status */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sharing Status</h4>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  {selectedDoc.isShared && selectedDoc.sharedWith && selectedDoc.sharedWith.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Shared with {selectedDoc.sharedWith.length} user{selectedDoc.sharedWith.length !== 1 ? 's' : ''}:</p>
                      <div className="space-y-1">
                        {selectedDoc.sharedWith.map((email) => (
                          <p key={email} className="text-xs text-foreground flex items-center gap-2">
                            <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                            {email}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">This file is private</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setIsShareDialogOpen(true);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive col-span-2 gap-2"
                  onClick={() => {
                    handleDeleteDocument(selectedDoc.id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete File
                </Button>
              </div>

              <Button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">{selectedDoc.name}</p>
                <p className="text-sm text-muted-foreground">
                  Share this document with others by email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="share-email">Email Address</Label>
                <Input
                  id="share-email"
                  type="email"
                  placeholder="user@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="bg-card"
                />
              </div>

              {selectedDoc.sharedWith && selectedDoc.sharedWith.length > 0 && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Currently shared with:</strong>
                  </p>
                  <div className="space-y-1">
                    {selectedDoc.sharedWith.map((email) => (
                      <p key={email} className="text-xs text-foreground">
                        • {email}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => handleShareDocument(selectedDoc)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => setIsShareDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
