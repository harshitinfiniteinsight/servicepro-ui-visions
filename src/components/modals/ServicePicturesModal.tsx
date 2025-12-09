import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ServicePicturesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobOrderId?: string;
  beforeImages?: string[]; // URLs or base64 strings
  afterImages?: string[]; // URLs or base64 strings
  onReplace?: (type: "before" | "after") => void;
  onDelete?: (type: "before" | "after") => Promise<void>;
}

export const ServicePicturesModal = ({
  open,
  onOpenChange,
  jobId,
  jobOrderId,
  beforeImages = [],
  afterImages = [],
  onReplace,
  onDelete,
}: ServicePicturesModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset to "before" tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab("before");
    }
  }, [open]);

  // Determine which tab has images
  const hasBeforeImages = beforeImages.length > 0;
  const hasAfterImages = afterImages.length > 0;

  // Handle Replace
  const handleReplace = () => {
    if (onReplace) {
      onReplace(activeTab);
    }
  };

  // Handle Delete - Show confirmation dialog
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!onDelete) return;

    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      await onDelete(activeTab);
      toast({
        title: "Images deleted",
        description: `${activeTab === "before" ? "Before" : "After"} Service images have been removed`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Render image grid
  const renderImageGrid = (images: string[]) => {
    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No images uploaded</p>
          <p className="text-xs text-muted-foreground mt-1">Upload images to see them here</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden border border-border bg-muted/30"
          >
            <img
              src={imageUrl}
              alt={`Service image ${index + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    );
  };

  const currentImages = activeTab === "before" ? beforeImages : afterImages;
  const hasCurrentImages = currentImages.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Pictures</DialogTitle>
          <DialogDescription>
            View service pictures for {jobOrderId || `job ${jobId}`}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "before" | "after")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted">
            <TabsTrigger
              value="before"
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5 text-sm font-medium",
                activeTab === "before" && "font-bold"
              )}
            >
              Before Service
            </TabsTrigger>
            <TabsTrigger
              value="after"
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5 text-sm font-medium",
                activeTab === "after" && "font-bold"
              )}
            >
              After Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="before" className="mt-4 space-y-4 min-h-[300px]">
            {renderImageGrid(beforeImages)}
          </TabsContent>

          <TabsContent value="after" className="mt-4 space-y-4 min-h-[300px]">
            {renderImageGrid(afterImages)}
          </TabsContent>
        </Tabs>

        {hasCurrentImages && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleReplace}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Images</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all {activeTab === "before" ? "Before" : "After"} Service images? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

