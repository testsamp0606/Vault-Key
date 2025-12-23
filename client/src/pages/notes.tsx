import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Search, Share2, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: string[];
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Important Reminders',
      content: 'Remember to update all passwords by end of month',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15'),
      sharedWith: []
    },
    {
      id: '2',
      title: 'Account Recovery Info',
      content: 'Recovery email: backup@example.com\nRecovery phone: +1-555-0123',
      createdAt: new Date('2024-12-10'),
      updatedAt: new Date('2024-12-10'),
      sharedWith: []
    },
    {
      id: '3',
      title: 'Security Questions Answers',
      content: 'First pet: Max\nBirth city: New York',
      createdAt: new Date('2024-12-05'),
      updatedAt: new Date('2024-12-05'),
      sharedWith: []
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const { toast } = useToast();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content",
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
    setSelectedNote(newNote);
    toast({
      title: "Note created",
      description: `"${newTitle}" has been added to your notes`,
    });
  };

  const handleDeleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
    toast({
      title: "Note deleted",
      description: `"${note?.title}" has been removed`,
    });
  };

  const validateAndShareNote = () => {
    if (!shareEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!shareEmail.endsWith("@securevault.com")) {
      toast({
        title: "Invalid email",
        description: "Only @securevault.com email addresses can access notes",
        variant: "destructive",
      });
      return;
    }

    if (selectedNote) {
      const updated = notes.map(n =>
        n.id === selectedNote.id
          ? {
            ...n,
            sharedWith: [...(n.sharedWith || []), shareEmail]
          }
          : n
      );
      setNotes(updated);
      setSelectedNote({
        ...selectedNote,
        sharedWith: [...(selectedNote.sharedWith || []), shareEmail]
      });
      setShareEmail("");
      setIsShareDialogOpen(false);
      toast({
        title: "Note shared",
        description: `"${selectedNote.title}" shared with ${shareEmail}`,
      });
    }
  };

  const removeSharedUser = (email: string) => {
    if (selectedNote) {
      const updated = notes.map(n =>
        n.id === selectedNote.id
          ? {
            ...n,
            sharedWith: (n.sharedWith || []).filter(e => e !== email)
          }
          : n
      );
      setNotes(updated);
      setSelectedNote({
        ...selectedNote,
        sharedWith: (selectedNote.sharedWith || []).filter(e => e !== email)
      });
      toast({
        title: "Access removed",
        description: `${email} no longer has access to this note`,
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground">Keep track of important information securely</p>
        </div>
        <div className="flex gap-2">
          <Link href="/files">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              View Files
            </Button>
          </Link>
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-card border-border/50"
              />
            </div>

            <motion.div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No notes found</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsCreating(false);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedNote?.id === note.id
                        ? 'bg-primary/10 border-primary/50'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {note.updatedAt.toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>

        {/* Note Editor / Display */}
        <div className="lg:col-span-2">
          {isCreating ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Note title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-2 bg-card border-border/50"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    placeholder="Write your note here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full mt-2 p-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[300px]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewTitle('');
                      setNewContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleAddNote}
                  >
                    Save Note
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : selectedNote ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Updated {selectedNote.updatedAt.toLocaleDateString()} at{' '}
                      {selectedNote.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="gap-2"
                      onClick={() => setIsShareDialogOpen(true)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg min-h-[300px] whitespace-pre-wrap text-foreground">
                  {selectedNote.content}
                </div>

                {/* Shared With Section */}
                {selectedNote.sharedWith && selectedNote.sharedWith.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm font-medium mb-3">Shared with:</p>
                    <div className="space-y-2">
                      {selectedNote.sharedWith.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between p-2 rounded bg-muted/30"
                        >
                          <p className="text-sm">{email}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSharedUser(email)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[400px] text-center"
            >
              <div>
                <p className="text-muted-foreground mb-4">Select a note or create a new one</p>
                <Button
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create New Note
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">{selectedNote.title}</p>
                <p className="text-sm text-muted-foreground">
                  Share this note with @securevault.com users
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="share-email">Email Address</Label>
                <Input
                  id="share-email"
                  type="email"
                  placeholder="user@securevault.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="bg-card border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Only @securevault.com email addresses can access notes
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={validateAndShareNote}
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
