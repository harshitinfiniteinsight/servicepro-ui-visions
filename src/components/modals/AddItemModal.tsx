import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, Search, Upload, Camera, X, ArrowLeft } from "lucide-react";
import { mockInventory } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventoryFormModal } from "./InventoryFormModal";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: any) => void;
  context?: "invoice" | "estimate"; // Context to determine title
}

export const AddItemModal = ({ open, onOpenChange, onAddItem, context = "invoice" }: AddItemModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [customPrice, setCustomPrice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [customItem, setCustomItem] = useState({
    name: "",
    price: "",
    image: null as File | null,
    imagePreview: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    price: "",
  });

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomItem({ ...customItem, image: file, imagePreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCustomItem({ ...customItem, image: null, imagePreview: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddCustomItem = () => {
    const priceValue = parseFloat(customItem.price.replace(/[^0-9.]/g, ""));
    
    // Reset validation errors
    setValidationErrors({ name: "", price: "" });
    
    // Validation
    let hasErrors = false;
    
    if (!customItem.name.trim()) {
      setValidationErrors(prev => ({ ...prev, name: "Custom Item Name is required" }));
      hasErrors = true;
    }
    
    if (!customItem.price || priceValue <= 0) {
      setValidationErrors(prev => ({ ...prev, price: "Price must be a positive number" }));
      hasErrors = true;
    }
    
    if (hasErrors) {
      return;
    }
    
    // Add custom item to the list
    onAddItem({
      description: customItem.name,
      quantity: 1,
      rate: priceValue,
      amount: priceValue,
      type: "custom",
      image: customItem.image,
      imagePreview: customItem.imagePreview,
    });
    
    // Reset and close modal
    resetModal();
  };

  const handleSelectInventory = (inventory: any) => {
    if (inventory.type === "Variable") {
      setSelectedInventory(inventory);
      setCustomPrice(inventory.price.toString());
    } else {
      onAddItem({
        description: `${inventory.name} (${inventory.type === "Fixed" ? "F" : "U"})`,
        quantity: 1,
        rate: inventory.price,
        amount: inventory.price,
        type: "inventory",
        inventoryId: inventory.id,
        sku: inventory.sku,
      });
      resetModal();
    }
  };

  const handleAddVariableInventory = () => {
    if (selectedInventory && customPrice) {
      onAddItem({
        description: `${selectedInventory.name} (V)`,
        quantity: 1,
        rate: parseFloat(customPrice),
        amount: parseFloat(customPrice),
        type: "inventory",
        inventoryId: selectedInventory.id,
        sku: selectedInventory.sku,
      });
      resetModal();
    }
  };

  const handleInventoryAdded = (inventory: any) => {
    onAddItem({
      description: `${inventory.name} (${getInventoryTypeLabel(inventory.type)})`,
      quantity: 1,
      rate: inventory.price,
      amount: inventory.price,
      type: "inventory",
      inventoryId: inventory.id,
      sku: inventory.sku,
    });
    setShowInventoryModal(false);
    resetModal();
  };

  const resetModal = () => {
    setShowCustomItemForm(false);
    setSelectedInventory(null);
    setCustomPrice("");
    setCustomItem({ name: "", price: "", image: null, imagePreview: "" });
    setValidationErrors({ name: "", price: "" });
    setSearchQuery("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const getInventoryTypeLabel = (type: string) => {
    if (type === "Variable") return "V";
    if (type === "Fixed") return "F";
    return "U";
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && resetModal()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden app-card">
        <DialogHeader>
          <DialogTitle className="text-gradient">
            {showCustomItemForm 
              ? "Add Custom Item" 
              : context === "estimate" 
                ? "Add Item to Estimate" 
                : "Add Item to Invoice"
            }
          </DialogTitle>
          <DialogDescription>
            {showCustomItemForm 
              ? "Create a custom line item with image"
              : "Search inventory or create custom line items"
            }
          </DialogDescription>
        </DialogHeader>

        {showCustomItemForm ? (
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customItemName">Custom Item Name *</Label>
              <Input
                id="customItemName"
                value={customItem.name}
                onChange={(e) => {
                  setCustomItem({ ...customItem, name: e.target.value });
                  if (validationErrors.name) {
                    setValidationErrors(prev => ({ ...prev, name: "" }));
                  }
                }}
                placeholder="Enter item name"
                className={`touch-target ${validationErrors.name ? "border-destructive" : ""}`}
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">{validationErrors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customItemPrice">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground font-medium">$</span>
                <Input
                  id="customItemPrice"
                  type="text"
                  value={customItem.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setCustomItem({ ...customItem, price: value });
                    if (validationErrors.price) {
                      setValidationErrors(prev => ({ ...prev, price: "" }));
                    }
                  }}
                  placeholder="0.00"
                  className={`pl-8 touch-target ${validationErrors.price ? "border-destructive" : ""}`}
                />
              </div>
              {validationErrors.price && (
                <p className="text-sm text-destructive">{validationErrors.price}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Upload Image (Optional)</Label>
              <div
                className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px]"
                onClick={() => fileInputRef.current?.click()}
              >
                {customItem.imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={customItem.imagePreview}
                      alt="Preview"
                      className="max-h-[180px] mx-auto object-contain rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-4">
                      <Camera className="h-16 w-16 text-muted-foreground" />
                      <div className="absolute -top-2 -right-2 bg-primary rounded-full p-2">
                        <Upload className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
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

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCustomItemForm(false)}
                className="flex-1 touch-target"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleAddCustomItem}
                disabled={!customItem.name || !customItem.price || parseFloat(customItem.price.replace(/[^0-9.]/g, "")) <= 0}
                className="flex-1 touch-target"
              >
                Add Custom Item
              </Button>
            </div>
          </div>
        ) : !selectedInventory && (
          <div className="space-y-4 py-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowCustomItemForm(true)}
                variant="outline"
                className="h-14 gap-2 touch-target"
              >
                <Plus className="h-5 w-5" />
                Add Custom Item
              </Button>
              <Button
                onClick={() => setShowInventoryModal(true)}
                variant="outline"
                className="h-14 gap-2 touch-target"
              >
                <Package className="h-5 w-5" />
                Add Inventory
              </Button>
            </div>

            {/* Search Field */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by name, SKU, or category..."
                className="pl-9 glass-effect"
              />
            </div>
            
            {/* Info Text */}
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-semibold">V</span> = Variable · <span className="font-semibold">F</span> = Fixed · <span className="font-semibold">U</span> = Per Unit Inventory
              </p>
            </div>

            {/* Inventory List */}
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectInventory(item)}
                      className="w-full p-4 text-left border rounded-xl hover:bg-muted/50 transition-all duration-200 hover:border-primary/50 hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {getInventoryTypeLabel(item.type)}
                            </Badge>
                            <p className="font-semibold group-hover:text-primary transition-colors">{item.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.sku} · {item.category}</p>
                          {item.type === "Per Unit" && item.itemUnit && (
                            <p className="text-xs text-muted-foreground mt-1">Unit: {item.itemUnit}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                          {item.type !== "Variable" && item.type !== "Fixed" && item.stockQuantity > 0 && (
                            <p className="text-xs text-muted-foreground">Stock: {item.stockQuantity}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No inventory items found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}



        {selectedInventory && (
          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono">V</Badge>
                <p className="font-semibold">{selectedInventory.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">{selectedInventory.sku}</p>
              <p className="text-xs text-muted-foreground mt-1">Category: {selectedInventory.category}</p>
            </div>

            <div className="grid gap-2">
              <Label>Set Price for Variable Item ($) *</Label>
              <Input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter price"
                className="glass-effect text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Default price: ${selectedInventory.price.toFixed(2)} (you can change this)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedInventory(null)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleAddVariableInventory} className="flex-1" disabled={!customPrice || parseFloat(customPrice) <= 0}>
                Add to Invoice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <InventoryFormModal
        open={showInventoryModal}
        onOpenChange={setShowInventoryModal}
        mode="create"
        onInventoryAdded={handleInventoryAdded}
      />
    </Dialog>
  );
};
