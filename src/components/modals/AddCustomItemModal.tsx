import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface AddCustomItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: any) => void;
}

export function AddCustomItemModal({ open, onOpenChange, onAddItem }: AddCustomItemModalProps) {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/i)) {
        toast.error("Please select a PNG or JPG image file");
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateUUID = () => {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddItem = () => {
    // Validation
    if (!itemName.trim()) {
      toast.error("Item Name is required");
      return;
    }

    const priceValue = parseFloat(price);
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    // Create custom item object
    const customItem = {
      id: generateUUID(),
      name: itemName.trim(),
      rate: priceValue,
      type: "F" as const, // Custom items default to Fixed
      quantity: 1,
      imageUrl: imagePreview || undefined,
    };

    // Add to selectedItems in Step 2
    onAddItem(customItem);

    // Show success toast
    toast.success("Custom item added successfully!");

    // Reset form and close modal
    handleClose();
  };

  const handleClose = () => {
    setItemName("");
    setPrice("");
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const isFormValid = itemName.trim() !== "" && price !== "" && parseFloat(price) > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-full sm:max-w-[600px] md:max-w-[650px] lg:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl border shadow-lg">
        {/* Modal Header */}
        <DialogHeader className="px-6 md:px-8 pt-6 pb-5 border-b">
          <DialogDescription className="sr-only">
            Create a custom item to add to the invoice
          </DialogDescription>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-center flex-1">
              Add Custom Item
            </DialogTitle>
            <button
              onClick={handleClose}
              className="ml-4 h-10 w-10 md:h-11 md:w-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8 space-y-6">
          {/* Item Image (Optional) */}
          <div className="space-y-2">
            <Label className="text-sm md:text-[15px] font-medium text-gray-900">
              Item Image (Optional)
            </Label>
            <div
              className="border-2 border-dashed border-[#D8D8D8] rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:border-primary/50 transition-colors cursor-pointer min-h-[160px] md:min-h-[180px]"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full max-w-xs">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[160px] md:max-h-[180px] mx-auto object-contain rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-white hover:bg-gray-100 rounded-full shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                  <p className="text-sm md:text-base text-gray-600 font-medium">
                    Click to upload image
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-sm md:text-[15px] font-medium text-gray-900">
              Item Name
            </Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              className="h-11 md:h-12 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm md:text-[15px]"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm md:text-[15px] font-medium text-gray-900">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow positive numbers
                if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                  setPrice(value);
                }
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="h-11 md:h-12 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm md:text-[15px]"
              required
            />
          </div>
        </div>

        {/* Footer - Add Item Button */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 border-t">
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!isFormValid}
            className="w-full h-[52px] md:h-[56px] rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base md:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
