import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddServicePicturesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobOrderId?: string;
  initialTab?: "before" | "after"; // Tab to focus when opening
  onSave?: (beforeImages: File[], afterImages: File[]) => Promise<void>;
}

export const AddServicePicturesModal = ({
  open,
  onOpenChange,
  jobId,
  jobOrderId,
  initialTab = "before",
  onSave,
}: AddServicePicturesModalProps) => {
  const { toast } = useToast();
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  const [beforeImages, setBeforeImages] = useState<File[]>([]);
  const [afterImages, setAfterImages] = useState<File[]>([]);
  const [beforePreviews, setBeforePreviews] = useState<string[]>([]);
  const [afterPreviews, setAfterPreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const beforeSectionRef = useRef<HTMLDivElement>(null);
  const afterSectionRef = useRef<HTMLDivElement>(null);

  // Reset and scroll to focused section when modal opens
  useEffect(() => {
    if (open) {
      setBeforeImages([]);
      setAfterImages([]);
      setBeforePreviews([]);
      setAfterPreviews([]);
      
      // Scroll to the appropriate section after a short delay to ensure modal is rendered
      setTimeout(() => {
        if (initialTab === "after" && afterSectionRef.current) {
          afterSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (initialTab === "before" && beforeSectionRef.current) {
          beforeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [open, initialTab]);

  // Handle file selection for Before Service
  const handleBeforeFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const previewPromises: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload image files only",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
      const previewPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      previewPromises.push(previewPromise);
    });

    if (validFiles.length > 0) {
      setBeforeImages((prev) => [...prev, ...validFiles]);
      Promise.all(previewPromises).then((previews) => {
        setBeforePreviews((prev) => [...prev, ...previews]);
      });
    }
  };

  // Handle file selection for After Service
  const handleAfterFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const previewPromises: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload image files only",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
      const previewPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      previewPromises.push(previewPromise);
    });

    if (validFiles.length > 0) {
      setAfterImages((prev) => [...prev, ...validFiles]);
      Promise.all(previewPromises).then((previews) => {
        setAfterPreviews((prev) => [...prev, ...previews]);
      });
    }
  };

  // Remove image from Before Service
  const removeBeforeImage = (index: number) => {
    setBeforeImages((prev) => prev.filter((_, i) => i !== index));
    setBeforePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove image from After Service
  const removeAfterImage = (index: number) => {
    setAfterImages((prev) => prev.filter((_, i) => i !== index));
    setAfterPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBeforeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleBeforeFileSelect(e.dataTransfer.files);
  };

  const handleAfterDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAfterFileSelect(e.dataTransfer.files);
  };

  // Handle Save
  const handleSave = async () => {
    if (beforeImages.length === 0 && afterImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please add at least one image before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(beforeImages, afterImages);
      } else {
        // Default behavior: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast({
        title: "Pictures uploaded successfully",
        description: "Service pictures have been saved",
      });

      // Reset state and close modal
      setBeforeImages([]);
      setAfterImages([]);
      setBeforePreviews([]);
      setAfterPreviews([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload pictures. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    setBeforeImages([]);
    setAfterImages([]);
    setBeforePreviews([]);
    setAfterPreviews([]);
    onOpenChange(false);
  };

  // Render dropzone for Before Service
  const renderBeforeDropzone = () => (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Before Service</Label>
      <div
        className={cn(
          "border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px]",
          beforePreviews.length > 0 && "p-4"
        )}
        onClick={() => beforeFileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleBeforeDrop}
      >
        {beforePreviews.length > 0 ? (
          <div className="w-full space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {beforePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Before service ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBeforeImage(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                beforeFileInputRef.current?.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Add More Images
            </Button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Camera className="h-12 w-12 text-muted-foreground" />
              <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5">
                <Upload className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Dropzone</p>
            <p className="text-xs text-muted-foreground text-center">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 10MB
            </p>
          </>
        )}
      </div>
      <input
        ref={beforeFileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleBeforeFileSelect(e.target.files)}
      />
      {beforePreviews.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => beforeFileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      )}
    </div>
  );

  // Render dropzone for After Service
  const renderAfterDropzone = () => (
    <div className="space-y-3">
      <Label className="text-base font-semibold">After Service</Label>
      <div
        className={cn(
          "border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px]",
          afterPreviews.length > 0 && "p-4"
        )}
        onClick={() => afterFileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleAfterDrop}
      >
        {afterPreviews.length > 0 ? (
          <div className="w-full space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {afterPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`After service ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAfterImage(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                afterFileInputRef.current?.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Add More Images
            </Button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Camera className="h-12 w-12 text-muted-foreground" />
              <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5">
                <Upload className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Dropzone</p>
            <p className="text-xs text-muted-foreground text-center">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 10MB
            </p>
          </>
        )}
      </div>
      <input
        ref={afterFileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleAfterFileSelect(e.target.files)}
      />
      {afterPreviews.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => afterFileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Service Pictures</DialogTitle>
          <DialogDescription>
            Upload before and after service pictures for {jobOrderId || `job ${jobId}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div ref={beforeSectionRef}>
            {renderBeforeDropzone()}
          </div>
          <div ref={afterSectionRef}>
            {renderAfterDropzone()}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || (beforeImages.length === 0 && afterImages.length === 0)}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

