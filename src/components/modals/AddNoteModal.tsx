import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
}

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  existingNotes?: Note[];
}

export const AddNoteModal = ({
  open,
  onOpenChange,
  appointmentId,
  existingNotes = [],
}: AddNoteModalProps) => {
  const { toast } = useToast();
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>(existingNotes);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PNG, JPG, or PDF files only.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedFiles((prev) => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, just add the file without preview
        setUploadedFiles((prev) => [...prev, { file, preview: '' }]);
      }
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddNote = () => {
    if (!noteText.trim() && uploadedFiles.length === 0) return;

    const newNote: Note = {
      id: `NOTE-${Date.now()}`,
      text: noteText,
      createdBy: "Current User",
      createdAt: new Date().toLocaleString(),
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription className="sr-only">
            Add a note with optional file or image attachment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Enter Note</Label>
            <div className="relative">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your note here..."
                className="min-h-[100px] pr-12 pb-10"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Upload file or image"
              >
                <Camera className="h-5 w-5 text-[#F46A1F]" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {/* File Previews */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
                    {item.file.type.startsWith('image/') ? (
                      <img
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">PDF</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
                      <p className="text-xs text-gray-500">{(item.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleAddNote} className="w-full">
            Add
          </Button>

          {notes.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Existing Notes</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <p className="text-sm text-foreground mb-2">{note.text}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Created by: {note.createdBy}</span>
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
