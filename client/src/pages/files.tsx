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
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Trash2, MoreVertical, File, Image as ImageIcon, Search, Eye, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentPermission {
  id: string;
  canView: boolean;
  canEdit: boolean;
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: string;
  uploadedDate: string;
  uploadedBy: string;
  permissions: DocumentPermission;
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
    permissions: { id: '1', canView: true, canEdit: true },
    sharedWith: ['admin@securevault.com']
  },
  {
    id: '2',
    name: 'Bank_Statement_Dec.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedDate: '5 days ago',
    uploadedBy: 'You',
    permissions: { id: '2', canView: true, canEdit: true },
    sharedWith: []
  },
  {
    id: '3',
    name: 'Driver_License.jpg',
    type: 'image',
    size: '856 KB',
    uploadedDate: '1 week ago',
    uploadedBy: 'You',
    permissions: { id: '3', canView: true, canEdit: true },
    sharedWith: []
  },
  {
    id: '4',
    name: 'Insurance_Policy.pdf',
    type: 'pdf',
    size: '3.2 MB',
    uploadedDate: '2 weeks ago',
    uploadedBy: 'You',
    permissions: { id: '4', canView: true, canEdit: false },
    sharedWith: ['manager@company.com']
  },
  {
    id: '5',
    name: 'Contract_Draft.docx',
    type: 'document',
    size: '450 KB',
    uploadedDate: '3 weeks ago',
    uploadedBy: 'You',
    permissions: { id: '5', canView: true, canEdit: true },
    sharedWith: []
  },
];

export default function FilesPage() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
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

  const handlePermissionChange = (doc: Document, canView: boolean, canEdit: boolean) => {
    const updated = documents.map(d =>
      d.id === doc.id
        ? { ...d, permissions: { ...d.permissions, canView, canEdit } }
        : d
    );
    setDocuments(updated);
    toast({
      title: "Permissions updated",
      description: "Document access permissions have been changed",
    });
    setIsPermissionDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documents & Files</h1>
          <p className="text-muted-foreground">Manage your documents with role-based access control</p>
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Shared With</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Permissions</th>
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
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted/50 rounded">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">by {doc.uploadedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{doc.size}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{doc.uploadedDate}</td>
                    <td className="px-6 py-4 text-sm">
                      {doc.sharedWith && doc.sharedWith.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {doc.sharedWith.length} user{doc.sharedWith.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Private</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {doc.permissions.canView && (
                          <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </span>
                        )}
                        {doc.permissions.canEdit && (
                          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                          </span>
                        )}
                        {!doc.permissions.canView && !doc.permissions.canEdit && (
                          <span className="text-xs text-muted-foreground">No access</span>
                        )}
                      </div>
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
                              setIsPermissionDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            Manage Permissions
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

      {/* Permission Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">{selectedDoc.name}</p>
                <p className="text-sm text-muted-foreground">
                  Control who can view or edit this document
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">View Permission</span>
                    <input
                      type="checkbox"
                      checked={selectedDoc.permissions.canView}
                      onChange={(e) =>
                        handlePermissionChange(
                          selectedDoc,
                          e.target.checked,
                          selectedDoc.permissions.canEdit
                        )
                      }
                      className="h-4 w-4 rounded"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow users to view this document
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">Edit Permission</span>
                    <input
                      type="checkbox"
                      checked={selectedDoc.permissions.canEdit}
                      onChange={(e) =>
                        handlePermissionChange(
                          selectedDoc,
                          selectedDoc.permissions.canView,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded"
                      disabled={!selectedDoc.permissions.canView}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow users to edit this document (requires View permission)
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Shared with:</strong> {selectedDoc.sharedWith && selectedDoc.sharedWith.length > 0
                    ? selectedDoc.sharedWith.join(', ')
                    : 'No one (Private)'}
                </p>
              </div>

              <Button
                onClick={() => setIsPermissionDialogOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
