import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgreementSignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreementId: string;
}

interface AgreementSignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreementId: string;
  onSignComplete?: () => void;
}

export const AgreementSignModal = ({
  open,
  onOpenChange,
  agreementId,
  onSignComplete,
}: AgreementSignModalProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!documentType) {
      toast({
        title: "Document Type Required",
        description: "Please select a document type before uploading.",
        variant: "destructive",
      });
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!documentType) {
      toast({
        title: "Document Type Required",
        description: "Please select a document type before sending.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadedImage) {
      toast({
        title: "Document Required",
        description: "Please upload a document before sending.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Agreement Signed",
      description: "Agreement documents have been uploaded successfully.",
    });
    onOpenChange(false);
    
    // Trigger payment modal after a brief delay
    setTimeout(() => {
      onSignComplete?.();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign & Upload Agreement Documents</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {/* Left side - Signature Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Please sign here</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCanvas}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Clear
              </Button>
            </div>
            <div className="border-2 border-muted rounded-lg bg-background">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full cursor-crosshair rounded-lg"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>

          {/* Right side - Document Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Select Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driving-licence">Driving Licence</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="social-security">Social Security card</SelectItem>
                  <SelectItem value="real-id">REAL ID Act</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Upload Document</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[300px]"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded document" 
                    className="max-h-[280px] object-contain rounded"
                  />
                ) : (
                  <>
                    <div className="relative mb-4">
                      <Camera className="h-20 w-20 text-info" />
                      <div className="absolute -top-2 -right-2 bg-destructive rounded-full p-2">
                        <Upload className="h-6 w-6 text-destructive-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Click to upload or drag and drop
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSend} 
            className="px-12 h-12 text-lg font-semibold"
            size="lg"
          >
            SEND
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
